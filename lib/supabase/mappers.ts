import { categoriaValida } from "@/lib/categorias";
import type {
  Atleta,
  CategoriaNoticia,
  Evento,
  Noticia,
  Presenca,
  StatusAtleta,
} from "@/lib/types";

type Registro = Record<string, unknown>;

const CATEGORIAS_NOTICIA: CategoriaNoticia[] = [
  "Notícia",
  "Treino",
  "Competição",
  "Aviso",
  "Comunidade",
];

function texto(valor: unknown, padrao = "") {
  return typeof valor === "string" ? valor : padrao;
}

function textoOpcional(valor: unknown) {
  return typeof valor === "string" && valor.trim().length > 0
    ? valor
    : undefined;
}

function dataISO(valor: unknown) {
  return typeof valor === "string" ? valor.slice(0, 10) : "";
}

function horaCurta(valor: unknown) {
  const hora = texto(valor);
  return hora.length >= 5 ? hora.slice(0, 5) : hora;
}

function statusAtleta(valor: unknown): StatusAtleta {
  return valor === "aprovado" || valor === "reprovado"
    ? valor
    : "pendente";
}

function categoriaNoticia(valor: unknown): CategoriaNoticia {
  return typeof valor === "string" &&
    (CATEGORIAS_NOTICIA as string[]).includes(valor)
    ? (valor as CategoriaNoticia)
    : "Notícia";
}

function categoriaEvento(valor: unknown) {
  return Array.isArray(valor)
    ? Array.from(new Set(valor.filter((item) => categoriaValida(item))))
    : [];
}

/** Converte uma linha de public.atletas para o formato usado pela UI. */
export function mapearAtleta(registro: Registro): Atleta {
  return {
    id: texto(registro.id),
    userId: typeof registro.user_id === "string" ? registro.user_id : null,
    nomeCompleto: texto(registro.nome_completo),
    email: texto(registro.email),
    dataNascimento: dataISO(registro.data_nascimento),
    telefone: texto(registro.telefone),
    cpf: texto(registro.cpf),
    cep: texto(registro.cep),
    bairro: texto(registro.bairro),
    endereco: texto(registro.endereco),
    numero: texto(registro.numero),
    codJuv: textoOpcional(registro.cod_juv),
    cadUnico: textoOpcional(registro.cad_unico),
    nomeMae: textoOpcional(registro.nome_mae),
    nomePai: textoOpcional(registro.nome_pai),
    telefoneMae: textoOpcional(registro.telefone_mae),
    telefonePai: textoOpcional(registro.telefone_pai),
    cpfMae: textoOpcional(registro.cpf_mae),
    cpfPai: textoOpcional(registro.cpf_pai),
    categoria: categoriaValida(registro.categoria)
      ? registro.categoria
      : undefined,
    status: statusAtleta(registro.status),
    criadoEm: dataISO(registro.criado_em),
    foto: textoOpcional(registro.foto_url),
    historia: textoOpcional(registro.historia),
  };
}

/** Converte uma linha de public.noticias para o formato usado pela UI. */
export function mapearNoticia(registro: Registro): Noticia {
  return {
    id: texto(registro.id),
    titulo: texto(registro.titulo),
    resumo: texto(registro.resumo),
    conteudo: texto(registro.conteudo),
    categoria: categoriaNoticia(registro.categoria),
    imagem: texto(registro.imagem, "/img/hero.jpg"),
    autor: texto(registro.autor, "Equipe Vencedores"),
    publicada: registro.publicada === true,
    destaque: registro.destaque === true,
    publicadoEm: dataISO(registro.publicado_em),
  };
}

/** Converte uma linha de public.eventos para o formato usado pela UI. */
export function mapearEvento(registro: Registro): Evento {
  const categorias = categoriaEvento(registro.categorias);
  return {
    id: texto(registro.id),
    titulo: texto(registro.titulo),
    descricao: texto(registro.descricao),
    data: dataISO(registro.data),
    hora: horaCurta(registro.hora),
    local: texto(registro.local),
    ativo: registro.ativo !== false,
    ...(categorias.length ? { categorias } : {}),
  };
}

/** Agrupa as linhas de public.presencas por evento -> atleta. */
export function mapearPresencas(registros: Registro[]) {
  const porEvento: Record<string, Record<string, Presenca>> = {};

  for (const registro of registros) {
    const eventoId = texto(registro.evento_id);
    const atletaId = texto(registro.atleta_id);
    const status = registro.status;
    if (!eventoId || !atletaId) continue;
    if (status !== "presente" && status !== "ausente") continue;
    porEvento[eventoId] = {
      ...(porEvento[eventoId] ?? {}),
      [atletaId]: status,
    };
  }

  return porEvento;
}

/** Linha completa para insert em public.atletas. */
export function paraLinhaAtleta(atleta: Atleta): Registro {
  return {
    ...(atleta.userId ? { user_id: atleta.userId } : {}),
    ...(atleta.id ? { id: atleta.id } : {}),
    nome_completo: atleta.nomeCompleto,
    email: atleta.email.trim().toLowerCase(),
    data_nascimento: atleta.dataNascimento,
    telefone: atleta.telefone ?? "",
    cpf: atleta.cpf ?? "",
    cep: atleta.cep ?? "",
    bairro: atleta.bairro ?? "",
    endereco: atleta.endereco ?? "",
    numero: atleta.numero ?? "",
    cod_juv: atleta.codJuv ?? null,
    cad_unico: atleta.cadUnico ?? null,
    nome_mae: atleta.nomeMae ?? null,
    nome_pai: atleta.nomePai ?? null,
    telefone_mae: atleta.telefoneMae ?? null,
    telefone_pai: atleta.telefonePai ?? null,
    cpf_mae: atleta.cpfMae ?? null,
    cpf_pai: atleta.cpfPai ?? null,
    categoria: atleta.categoria ?? null,
    status: atleta.status,
    foto_url: atleta.foto ?? null,
    historia: atleta.historia ?? null,
    consentimento: true,
    ...(atleta.criadoEm ? { criado_em: atleta.criadoEm } : {}),
  };
}

/** Apenas os campos informados, para update parcial em public.atletas. */
export function linhaAtletaParcial(dados: Partial<Atleta>): Registro {
  const linha: Registro = {};
  const tem = (campo: keyof Atleta) =>
    Object.prototype.hasOwnProperty.call(dados, campo);

  if (tem("nomeCompleto")) linha.nome_completo = dados.nomeCompleto;
  if (tem("email")) linha.email = dados.email?.trim().toLowerCase();
  if (tem("dataNascimento")) linha.data_nascimento = dados.dataNascimento;
  if (tem("telefone")) linha.telefone = dados.telefone ?? "";
  if (tem("cpf")) linha.cpf = dados.cpf ?? "";
  if (tem("cep")) linha.cep = dados.cep ?? "";
  if (tem("bairro")) linha.bairro = dados.bairro ?? "";
  if (tem("endereco")) linha.endereco = dados.endereco ?? "";
  if (tem("numero")) linha.numero = dados.numero ?? "";
  if (tem("codJuv")) linha.cod_juv = dados.codJuv ?? null;
  if (tem("cadUnico")) linha.cad_unico = dados.cadUnico ?? null;
  if (tem("nomeMae")) linha.nome_mae = dados.nomeMae ?? null;
  if (tem("nomePai")) linha.nome_pai = dados.nomePai ?? null;
  if (tem("telefoneMae")) linha.telefone_mae = dados.telefoneMae ?? null;
  if (tem("telefonePai")) linha.telefone_pai = dados.telefonePai ?? null;
  if (tem("cpfMae")) linha.cpf_mae = dados.cpfMae ?? null;
  if (tem("cpfPai")) linha.cpf_pai = dados.cpfPai ?? null;
  if (tem("categoria")) linha.categoria = dados.categoria ?? null;
  if (tem("status")) linha.status = dados.status;
  if (tem("foto")) linha.foto_url = dados.foto ?? null;
  if (tem("historia")) linha.historia = dados.historia ?? null;

  return linha;
}

/** Linha completa para insert em public.noticias. */
export function paraLinhaNoticia(noticia: Noticia): Registro {
  return {
    id: noticia.id,
    titulo: noticia.titulo,
    resumo: noticia.resumo,
    conteudo: noticia.conteudo,
    categoria: noticia.categoria,
    imagem: noticia.imagem,
    autor: noticia.autor,
    publicada: noticia.publicada,
    destaque: noticia.destaque,
    ...(noticia.publicadoEm ? { publicado_em: noticia.publicadoEm } : {}),
  };
}

/** Linha completa para insert em public.eventos. */
export function paraLinhaEvento(evento: Evento): Registro {
  return {
    id: evento.id,
    titulo: evento.titulo,
    descricao: evento.descricao,
    data: evento.data,
    hora: evento.hora,
    local: evento.local,
    ativo: evento.ativo,
    categorias: evento.categorias ?? [],
  };
}
