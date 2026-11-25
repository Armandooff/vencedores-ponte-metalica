import { NextResponse } from "next/server";
import { categoriaValida } from "@/lib/categorias";
import { hojeISO } from "@/lib/format";
import { novoId } from "@/lib/ids";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import { mapearAtleta, paraLinhaAtleta } from "@/lib/supabase/mappers";
import type { Atleta, StatusAtleta } from "@/lib/types";

export const dynamic = "force-dynamic";

function texto(valor: unknown) {
  return typeof valor === "string" ? valor.trim() : "";
}

function digitos(valor: unknown) {
  return texto(valor).replace(/\D/g, "");
}

function opcional(valor: unknown) {
  const limpo = texto(valor);
  return limpo.length ? limpo : undefined;
}

function statusValido(valor: unknown): StatusAtleta {
  return valor === "aprovado" || valor === "reprovado"
    ? valor
    : "pendente";
}

function erro(mensagem: string, status: number) {
  return NextResponse.json({ erro: mensagem }, { status });
}

async function exigirAdmin() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      ok: false as const,
      resposta: erro("Acesso não autenticado.", 401),
    };
  }

  const { data: perfil, error: erroPerfil } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (erroPerfil) {
    console.error("[api/admin/atletas] verificar perfil:", erroPerfil.message);
    return {
      ok: false as const,
      resposta: erro("Não foi possível verificar o acesso.", 500),
    };
  }

  if (perfil?.role !== "admin") {
    return {
      ok: false as const,
      resposta: erro("Acesso restrito à coordenação.", 403),
    };
  }

  return { ok: true as const };
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
  const acesso = await exigirAdmin();
  if (!acesso.ok) return acesso.resposta;

  let corpo: Record<string, unknown>;
  try {
    corpo = (await request.json()) as Record<string, unknown>;
  } catch {
    return erro("Dados inválidos.", 400);
  }

  const nomeCompleto = texto(corpo.nomeCompleto);
  const email = texto(corpo.email).toLowerCase();
  const dataNascimento = texto(corpo.dataNascimento);
  const cpf = digitos(corpo.cpf);
  const senha = texto(corpo.senha) || "123456";
  const status = statusValido(corpo.status);

  if (nomeCompleto.length < 3) {
    return erro("Informe o nome completo do atleta.", 422);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return erro("Informe um e-mail válido.", 422);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dataNascimento)) {
    return erro("Informe a data de nascimento.", 422);
  }
  if (cpf.length !== 11) {
    return erro("Informe um CPF com 11 dígitos.", 422);
  }
  if (!categoriaValida(corpo.categoria)) {
    return erro("Escolha a categoria do atleta.", 422);
  }
  if (senha.length < 6) {
    return erro("A senha precisa ter ao menos 6 caracteres.", 422);
  }

  let admin;
  try {
    admin = createSupabaseAdminClient();
  } catch (falha) {
    console.error(
      "[api/admin/atletas] configuração do Supabase:",
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
    console.error("[api/admin/atletas] verificar e-mail:", erroEmail.message);
    return erro("Não foi possível verificar o e-mail.", 500);
  }
  if (existenteEmail) {
    return erro("Já existe outro atleta com este e-mail.", 409);
  }

  const { data: existenteCpf, error: erroCpf } = await admin
    .from("atletas")
    .select("id")
    .eq("cpf", cpf)
    .maybeSingle();

  if (erroCpf) {
    console.error("[api/admin/atletas] verificar CPF:", erroCpf.message);
    return erro("Não foi possível verificar o CPF.", 500);
  }
  if (existenteCpf) {
    return erro("Já existe outro atleta com este CPF.", 409);
  }

  const { data: usuario, error: erroUsuario } = await admin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
    user_metadata: { nome: nomeCompleto },
  });

  if (erroUsuario || !usuario.user) {
    console.error(
      "[api/admin/atletas] criar usuário:",
      erroUsuario?.message ?? "usuário não retornado"
    );
    const mensagem = erroUsuario?.message.toLowerCase() ?? "";
    if (
      mensagem.includes("already registered") ||
      mensagem.includes("already been registered") ||
      mensagem.includes("email exists")
    ) {
      return erro("Já existe uma conta de acesso com este e-mail.", 409);
    }
    return erro("Não foi possível criar a conta de acesso.", 500);
  }

  const atleta: Atleta = {
    id: novoId("atl"),
    userId: usuario.user.id,
    nomeCompleto,
    email,
    dataNascimento,
    telefone: digitos(corpo.telefone),
    cpf,
    cep: digitos(corpo.cep),
    bairro: texto(corpo.bairro),
    endereco: texto(corpo.endereco),
    numero: texto(corpo.numero),
    codJuv: opcional(corpo.codJuv),
    cadUnico: opcional(corpo.cadUnico),
    nomeMae: opcional(corpo.nomeMae),
    nomePai: opcional(corpo.nomePai),
    telefoneMae: digitos(corpo.telefoneMae) || undefined,
    telefonePai: digitos(corpo.telefonePai) || undefined,
    cpfMae: digitos(corpo.cpfMae) || undefined,
    cpfPai: digitos(corpo.cpfPai) || undefined,
    categoria: corpo.categoria,
    status,
    criadoEm: hojeISO(),
  };

  const { data: inserido, error: erroAtleta } = await admin
    .from("atletas")
    .insert(paraLinhaAtleta(atleta))
    .select("*")
    .single();

  if (erroAtleta) {
    console.error("[api/admin/atletas] inserir atleta:", erroAtleta.message);
    const { error: erroRemocao } = await admin.auth.admin.deleteUser(
      usuario.user.id
    );
    if (erroRemocao) {
      console.error(
        "[api/admin/atletas] remover usuário após falha:",
        erroRemocao.message
      );
    }

    return erro(
      erroUnico(erroAtleta.message) ??
        "Não foi possível salvar o cadastro do atleta.",
      erroUnico(erroAtleta.message) ? 409 : 500
    );
  }

  return NextResponse.json(
    { atleta: mapearAtleta(inserido as Record<string, unknown>) },
    { status: 201 }
  );
}

export async function DELETE(request: Request) {
  const acesso = await exigirAdmin();
  if (!acesso.ok) return acesso.resposta;

  let corpo: Record<string, unknown>;
  try {
    corpo = (await request.json()) as Record<string, unknown>;
  } catch {
    return erro("Dados inválidos.", 400);
  }

  const atletaId = texto(corpo.atletaId);
  if (!atletaId) return erro("Atleta não informado.", 422);

  let admin;
  try {
    admin = createSupabaseAdminClient();
  } catch (falha) {
    console.error(
      "[api/admin/atletas] configuração do Supabase:",
      falha instanceof Error ? falha.message : falha
    );
    return erro("Exclusão temporariamente indisponível.", 500);
  }

  const { data: atleta, error: erroAtleta } = await admin
    .from("atletas")
    .select("id, user_id")
    .eq("id", atletaId)
    .maybeSingle();

  if (erroAtleta) {
    console.error("[api/admin/atletas] buscar atleta:", erroAtleta.message);
    return erro("Não foi possível localizar o atleta.", 500);
  }
  if (!atleta) return erro("Atleta não encontrado.", 404);

  if (atleta.user_id) {
    const { error: erroAuth } = await admin.auth.admin.deleteUser(
      atleta.user_id
    );
    if (erroAuth) {
      console.error(
        "[api/admin/atletas] excluir usuário Auth:",
        erroAuth.message
      );
      return erro("Não foi possível excluir a conta de acesso.", 500);
    }
  }

  const { error: erroExclusao } = await admin
    .from("atletas")
    .delete()
    .eq("id", atletaId);

  if (erroExclusao) {
    console.error(
      "[api/admin/atletas] excluir atleta:",
      erroExclusao.message
    );
    return erro("Não foi possível excluir o cadastro do atleta.", 500);
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const acesso = await exigirAdmin();
  if (!acesso.ok) return acesso.resposta;

  let corpo: Record<string, unknown>;
  try {
    corpo = (await request.json()) as Record<string, unknown>;
  } catch {
    return erro("Dados inválidos.", 400);
  }

  const atletaId = texto(corpo.atletaId);
  const senha = texto(corpo.senha);
  const email = texto(corpo.email).toLowerCase();

  if (!atletaId) return erro("Atleta não informado.", 422);
  if (!email && !senha) {
    return erro("Informe o novo e-mail ou a nova senha.", 422);
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return erro("Informe um e-mail válido.", 422);
  }
  if (senha && senha.length < 6) {
    return erro("A senha precisa ter ao menos 6 caracteres.", 422);
  }

  let admin;
  try {
    admin = createSupabaseAdminClient();
  } catch (falha) {
    console.error(
      "[api/admin/atletas] configuração do Supabase:",
      falha instanceof Error ? falha.message : falha
    );
    return erro("Operação temporariamente indisponível.", 500);
  }

  const { data: atleta, error: erroAtleta } = await admin
    .from("atletas")
    .select("user_id")
    .eq("id", atletaId)
    .maybeSingle();

  if (erroAtleta) {
    console.error("[api/admin/atletas] buscar atleta:", erroAtleta.message);
    return erro("Não foi possível localizar o atleta.", 500);
  }
  if (!atleta?.user_id) {
    return erro("Este atleta não possui conta de acesso vinculada.", 409);
  }

  if (email) {
    const { data: outroAtleta, error: erroOutro } = await admin
      .from("atletas")
      .select("id")
      .eq("email", email)
      .neq("id", atletaId)
      .maybeSingle();

    if (erroOutro) {
      console.error(
        "[api/admin/atletas] verificar novo e-mail:",
        erroOutro.message
      );
      return erro("Não foi possível verificar o e-mail.", 500);
    }
    if (outroAtleta) {
      return erro("Já existe outro atleta com este e-mail.", 409);
    }
  }

  const { error } = await admin.auth.admin.updateUserById(atleta.user_id, {
    ...(email ? { email, email_confirm: true } : {}),
    ...(senha ? { password: senha } : {}),
  });

  if (error) {
    console.error("[api/admin/atletas] atualizar acesso:", error.message);
    const mensagem = error.message.toLowerCase();
    if (mensagem.includes("already") || mensagem.includes("registered")) {
      return erro("Já existe uma conta de acesso com este e-mail.", 409);
    }
    return erro("Não foi possível atualizar os dados de acesso.", 500);
  }

  if (email) {
    const { error: erroEmail } = await admin
      .from("atletas")
      .update({ email })
      .eq("id", atletaId);
    if (erroEmail) {
      console.error(
        "[api/admin/atletas] sincronizar e-mail:",
        erroEmail.message
      );
      return erro("Não foi possível sincronizar o e-mail do atleta.", 500);
    }
  }

  return NextResponse.json({ ok: true });
}
