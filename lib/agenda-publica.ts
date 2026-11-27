import { categoriaValida } from "@/lib/categorias";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { EventoPublico } from "@/lib/types";

type Registro = Record<string, unknown>;

export type ResultadoAgendaPublica = {
  eventos: EventoPublico[];
  indisponivel: boolean;
};

function texto(valor: unknown) {
  return typeof valor === "string" ? valor : "";
}

function mapearEventoPublico(registro: Registro): EventoPublico {
  const categorias = Array.isArray(registro.categorias)
    ? Array.from(new Set(registro.categorias.filter(categoriaValida)))
    : [];

  return {
    id: texto(registro.id),
    titulo: texto(registro.titulo),
    descricao: texto(registro.descricao),
    data: texto(registro.data).slice(0, 10),
    hora: texto(registro.hora).slice(0, 5),
    local: texto(registro.local),
    categorias,
  };
}

/**
 * Lê os eventos ativos no servidor e devolve somente os campos públicos.
 * O RLS não abre eventos para anon, por isso a consulta usa a service role
 * exclusivamente no servidor; presenças e dados de atletas nunca são lidos.
 */
export async function listarEventosPublicos(): Promise<ResultadoAgendaPublica> {
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("eventos")
      .select("id, titulo, descricao, data, hora, local, categorias")
      .eq("ativo", true)
      .order("data", { ascending: true })
      .order("hora", { ascending: true })
      .limit(200);

    if (error) {
      console.error("[agenda] consultar eventos:", error.message);
      return { eventos: [], indisponivel: true };
    }

    const eventos = ((data ?? []) as unknown as Registro[])
      .map(mapearEventoPublico)
      .filter(
        (evento) =>
          Boolean(evento.id) && Boolean(evento.titulo) && Boolean(evento.data)
      );

    return { eventos, indisponivel: false };
  } catch (erro) {
    console.error(
      "[agenda] configuração do Supabase:",
      erro instanceof Error ? erro.message : erro
    );
    return { eventos: [], indisponivel: true };
  }
}
