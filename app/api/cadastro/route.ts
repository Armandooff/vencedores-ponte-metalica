import { NextResponse } from "next/server";
import { hojeISO } from "@/lib/format";
import { novoId } from "@/lib/ids";
import { atletaSchema } from "@/lib/schemas/atleta";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { paraLinhaAtleta } from "@/lib/supabase/mappers";
import type { Atleta } from "@/lib/types";

type CorpoCadastro = unknown;

function erro(mensagem: string, status: number) {
  return NextResponse.json({ erro: mensagem }, { status });
}

function erroUnico(mensagem: string | undefined) {
  if (!mensagem) return null;
  if (
    mensagem.includes("atletas_email_key") ||
    (mensagem.includes("duplicate key") && mensagem.includes("email"))
  ) {
    return "Já existe um cadastro com este e-mail.";
  }
  if (
    mensagem.includes("atletas_cpf_key") ||
    (mensagem.includes("duplicate key") && mensagem.includes("cpf"))
  ) {
    return "Já existe um cadastro com este CPF.";
  }
  return null;
}

export async function POST(request: Request) {
  let corpo: CorpoCadastro;
  try {
    corpo = await request.json();
  } catch {
    return erro("Dados inválidos.", 400);
  }

  const resultado = atletaSchema.safeParse(corpo);
  if (!resultado.success) {
    return erro("Confira os dados informados e tente novamente.", 422);
  }

  const dados = resultado.data;
  const email = dados.email.trim().toLowerCase();
  const atletaId = novoId("atl");

  let admin;
  try {
    admin = createSupabaseAdminClient();
  } catch (falha) {
    console.error(
      "[api/cadastro] configuração do Supabase:",
      falha instanceof Error ? falha.message : falha
    );
    return erro("Cadastro temporariamente indisponível.", 500);
  }

  const { data: existenteEmail, error: erroEmail } = await admin
    .from("atletas")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (erroEmail) {
    console.error("[api/cadastro] verificar e-mail:", erroEmail.message);
    return erro("Não foi possível concluir o cadastro.", 500);
  }
  if (existenteEmail) {
    return erro(
      "Já existe uma conta com este e-mail. Tente entrar na área do atleta.",
      409
    );
  }

  const { data: existenteCpf, error: erroCpf } = await admin
    .from("atletas")
    .select("id")
    .eq("cpf", dados.cpf)
    .maybeSingle();

  if (erroCpf) {
    console.error("[api/cadastro] verificar CPF:", erroCpf.message);
    return erro("Não foi possível concluir o cadastro.", 500);
  }
  if (existenteCpf) {
    return erro("Já existe um cadastro com este CPF.", 409);
  }

  const { data: usuario, error: erroUsuario } = await admin.auth.admin.createUser({
    email,
    password: dados.senha,
    email_confirm: true,
    user_metadata: { nome: dados.nomeCompleto.trim() },
  });

  if (erroUsuario || !usuario.user) {
    console.error(
      "[api/cadastro] criar usuário:",
      erroUsuario?.message ?? "usuário não retornado"
    );
    const mensagem = erroUsuario?.message.toLowerCase() ?? "";
    if (
      mensagem.includes("already registered") ||
      mensagem.includes("already been registered") ||
      mensagem.includes("email exists")
    ) {
      return erro(
        "Já existe uma conta com este e-mail. Tente entrar na área do atleta.",
        409
      );
    }
    return erro("Não foi possível criar a conta de acesso.", 500);
  }

  const atleta: Atleta = {
    id: atletaId,
    userId: usuario.user.id,
    nomeCompleto: dados.nomeCompleto.trim(),
    email,
    dataNascimento: dados.dataNascimento,
    telefone: dados.telefone,
    cpf: dados.cpf,
    cep: dados.cep,
    bairro: dados.bairro.trim(),
    endereco: dados.endereco.trim(),
    numero: dados.numero.trim(),
    codJuv: dados.codJuv?.trim() || undefined,
    cadUnico: dados.cadUnico.trim(),
    nomeMae: dados.nomeMae?.trim() || undefined,
    nomePai: dados.nomePai?.trim() || undefined,
    telefoneMae: dados.telefoneMae?.replace(/\D/g, "") || undefined,
    telefonePai: dados.telefonePai?.replace(/\D/g, "") || undefined,
    cpfMae: dados.cpfMae || undefined,
    cpfPai: dados.cpfPai || undefined,
    categoria: dados.categoria,
    status: "pendente",
    criadoEm: hojeISO(),
  };

  const { error: erroAtleta } = await admin
    .from("atletas")
    .insert(paraLinhaAtleta(atleta));

  if (erroAtleta) {
    console.error("[api/cadastro] inserir atleta:", erroAtleta.message);
    // Evita deixar um usuário Auth órfão sem cadastro de atleta.
    const { error: erroRemocao } = await admin.auth.admin.deleteUser(
      usuario.user.id
    );
    if (erroRemocao) {
      console.error(
        "[api/cadastro] remover usuário após falha:",
        erroRemocao.message
      );
    }

    return erro(
      erroUnico(erroAtleta.message) ??
        "Não foi possível salvar o cadastro. Tente novamente.",
      erroUnico(erroAtleta.message) ? 409 : 500
    );
  }

  return NextResponse.json({ ok: true, id: atletaId }, { status: 201 });
}
