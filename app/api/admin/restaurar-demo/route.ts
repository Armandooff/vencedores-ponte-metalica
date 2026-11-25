import { NextResponse } from "next/server";
import { bancoInicial } from "@/lib/seed";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import {
  paraLinhaAtleta,
  paraLinhaEvento,
  paraLinhaNoticia,
} from "@/lib/supabase/mappers";
import type { Atleta } from "@/lib/types";

export const dynamic = "force-dynamic";

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
    console.error(
      "[api/admin/restaurar-demo] verificar perfil:",
      erroPerfil.message
    );
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

async function listarUsuariosPorEmail(
  admin: ReturnType<typeof createSupabaseAdminClient>
) {
  const { data, error } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (error) {
    console.error(
      "[api/admin/restaurar-demo] listar usuários:",
      error.message
    );
    return new Map<string, string>();
  }

  return new Map(
    data.users
      .filter((usuario) => usuario.email)
      .map((usuario) => [usuario.email!.toLowerCase(), usuario.id])
  );
}

export async function POST() {
  const acesso = await exigirAdmin();
  if (!acesso.ok) return acesso.resposta;

  let admin;
  try {
    admin = createSupabaseAdminClient();
  } catch (falha) {
    console.error(
      "[api/admin/restaurar-demo] configuração do Supabase:",
      falha instanceof Error ? falha.message : falha
    );
    return erro("Restauração temporariamente indisponível.", 500);
  }

  const { data: atletasAtuais, error: erroAtletasAtuais } = await admin
    .from("atletas")
    .select("id, email, user_id");

  if (erroAtletasAtuais) {
    console.error(
      "[api/admin/restaurar-demo] ler atletas:",
      erroAtletasAtuais.message
    );
    return erro("Não foi possível preparar a restauração.", 500);
  }

  const usuariosPorId = new Map<string, string>();
  const usuariosPorEmail = await listarUsuariosPorEmail(admin);

  for (const atleta of atletasAtuais ?? []) {
    if (atleta.user_id && atleta.email) {
      usuariosPorId.set(atleta.id, atleta.user_id);
      usuariosPorEmail.set(atleta.email.toLowerCase(), atleta.user_id);
    }
  }

  const { error: erroPresencas } = await admin
    .from("presencas")
    .delete()
    .neq("evento_id", "");

  if (erroPresencas) {
    console.error(
      "[api/admin/restaurar-demo] limpar presenças:",
      erroPresencas.message
    );
    return erro("Não foi possível limpar as presenças.", 500);
  }

  const { error: erroEventos } = await admin
    .from("eventos")
    .delete()
    .neq("id", "");

  if (erroEventos) {
    console.error(
      "[api/admin/restaurar-demo] limpar eventos:",
      erroEventos.message
    );
    return erro("Não foi possível limpar os eventos.", 500);
  }

  const { error: erroNoticias } = await admin
    .from("noticias")
    .delete()
    .neq("id", "");

  if (erroNoticias) {
    console.error(
      "[api/admin/restaurar-demo] limpar notícias:",
      erroNoticias.message
    );
    return erro("Não foi possível limpar as notícias.", 500);
  }

  const { error: erroAtletas } = await admin
    .from("atletas")
    .delete()
    .neq("id", "");

  if (erroAtletas) {
    console.error(
      "[api/admin/restaurar-demo] limpar atletas:",
      erroAtletas.message
    );
    return erro("Não foi possível limpar os atletas.", 500);
  }

  const atletas: Atleta[] = bancoInicial.atletas.map((atleta) => ({
    ...atleta,
    userId:
      usuariosPorId.get(atleta.id) ??
      usuariosPorEmail.get(atleta.email.toLowerCase()) ??
      null,
  }));

  const { error: erroSeedAtletas } = await admin
    .from("atletas")
    .insert(atletas.map(paraLinhaAtleta));

  if (erroSeedAtletas) {
    console.error(
      "[api/admin/restaurar-demo] inserir atletas:",
      erroSeedAtletas.message
    );
    return erro("Não foi possível restaurar os atletas.", 500);
  }

  const { error: erroSeedNoticias } = await admin
    .from("noticias")
    .insert(bancoInicial.noticias.map(paraLinhaNoticia));

  if (erroSeedNoticias) {
    console.error(
      "[api/admin/restaurar-demo] inserir notícias:",
      erroSeedNoticias.message
    );
    return erro("Não foi possível restaurar as notícias.", 500);
  }

  const { error: erroSeedEventos } = await admin
    .from("eventos")
    .insert(bancoInicial.eventos.map(paraLinhaEvento));

  if (erroSeedEventos) {
    console.error(
      "[api/admin/restaurar-demo] inserir eventos:",
      erroSeedEventos.message
    );
    return erro("Não foi possível restaurar os eventos.", 500);
  }

  return NextResponse.json({ ok: true });
}
