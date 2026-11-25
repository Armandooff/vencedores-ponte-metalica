import type { CategoriaAtleta } from "./categorias";

export type { CategoriaAtleta } from "./categorias";

export type StatusAtleta = "pendente" | "aprovado" | "reprovado";
export type Presenca = "presente" | "ausente";

export type CategoriaNoticia =
  | "Notícia"
  | "Treino"
  | "Competição"
  | "Aviso"
  | "Comunidade";

export type Atleta = {
  id: string;
  /** Vínculo com auth.users. Opcional em cadastros antigos/sem conta. */
  userId?: string | null;
  nomeCompleto: string;
  email: string;
  dataNascimento: string;
  telefone: string;
  cpf: string;
  cep: string;
  bairro: string;
  endereco: string;
  numero: string;
  codJuv?: string;
  cadUnico?: string;
  nomeMae?: string;
  nomePai?: string;
  telefoneMae?: string;
  telefonePai?: string;
  cpfMae?: string;
  cpfPai?: string;
  categoria?: CategoriaAtleta;
  status: StatusAtleta;
  criadoEm: string;
  foto?: string;
  historia?: string;
};

export type Noticia = {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  categoria: CategoriaNoticia;
  imagem: string;
  autor: string;
  publicada: boolean;
  destaque: boolean;
  publicadoEm: string;
};

export type Evento = {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  local: string;
  ativo: boolean;
  categorias?: CategoriaAtleta[];
  presencas?: Record<string, Presenca>;
};

export type BancoDados = {
  atletas: Atleta[];
  noticias: Noticia[];
  eventos: Evento[];
};
