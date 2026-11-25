import { categoriaValida } from "./categorias";
import type {
  Atleta,
  BancoDados,
  Evento,
  Noticia,
  Presenca,
} from "./types";

export const CHAVE_ANTIGA = "vpm:db:v2";
export const CHAVE_ATUAL = "vpm:db:v3";

type Registro = Record<string, unknown>;

function comoObjeto(valor: unknown): Registro {
  return valor && typeof valor === "object" && !Array.isArray(valor)
    ? (valor as Registro)
    : {};
}

function digitos(valor: unknown) {
  return typeof valor === "string" ? valor.replace(/\D/g, "") : "";
}

function migrarAtleta(valor: unknown): Atleta | null {
  const registro = comoObjeto(valor);
  if (typeof registro.id !== "string") return null;

  const {
    rg: _rg,
    modalidade: _modalidade,
    nivel: _nivel,
    rgMae: _rgMae,
    rgPai: _rgPai,
    ...restante
  } = registro;

  const cpfMae = digitos(registro.cpfMae);
  const cpfPai = digitos(registro.cpfPai);

  return {
    ...(restante as unknown as Atleta),
    categoria: categoriaValida(registro.categoria)
      ? registro.categoria
      : undefined,
    cpfMae: cpfMae.length === 11 ? cpfMae : undefined,
    cpfPai: cpfPai.length === 11 ? cpfPai : undefined,
    foto: typeof registro.foto === "string" ? registro.foto : undefined,
    historia:
      typeof registro.historia === "string" ? registro.historia : undefined,
  };
}

function migrarPresencas(valor: unknown) {
  const registro = comoObjeto(valor);
  const presencas: Record<string, Presenca> = {};
  for (const [atletaId, presenca] of Object.entries(registro)) {
    if (presenca === "presente" || presenca === "ausente") {
      presencas[atletaId] = presenca;
    }
  }
  return Object.keys(presencas).length ? presencas : undefined;
}

function migrarEvento(valor: unknown): Evento | null {
  const registro = comoObjeto(valor);
  if (typeof registro.id !== "string") return null;

  const {
    turma: _turma,
    presencas: _presencas,
    categorias: _categorias,
    ...restante
  } = registro;

  const categorias = Array.isArray(registro.categorias)
    ? Array.from(
        new Set(registro.categorias.filter((valor) => categoriaValida(valor)))
      )
    : [];

  return {
    ...(restante as unknown as Evento),
    ativo: registro.ativo !== false,
    ...(categorias.length ? { categorias } : {}),
    presencas: migrarPresencas(registro.presencas),
  };
}

function migrarNoticia(valor: unknown): Noticia | null {
  const registro = comoObjeto(valor);
  return typeof registro.id === "string" ? (registro as unknown as Noticia) : null;
}

export function migrarBanco(dados: unknown): BancoDados {
  const registro = comoObjeto(dados);
  const atletas = Array.isArray(registro.atletas)
    ? registro.atletas
        .map(migrarAtleta)
        .filter((atleta): atleta is Atleta => atleta !== null)
    : [];
  const noticias = Array.isArray(registro.noticias)
    ? registro.noticias
        .map(migrarNoticia)
        .filter((noticia): noticia is Noticia => noticia !== null)
    : [];
  const eventos = Array.isArray(registro.eventos)
    ? registro.eventos
        .map(migrarEvento)
        .filter((evento): evento is Evento => evento !== null)
    : [];

  return { atletas, noticias, eventos };
}
