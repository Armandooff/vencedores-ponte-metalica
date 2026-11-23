export type StatusAtleta = "pendente" | "aprovado" | "reprovado";
export type Modalidade = "bodyboard";
export type Nivel = "iniciante" | "intermediario" | "avancado";

export type CategoriaNoticia =
  | "Notícia"
  | "Treino"
  | "Competição"
  | "Aviso"
  | "Comunidade";

export type Atleta = {
  id: string;
  nomeCompleto: string;
  email: string;
  senha: string;
  dataNascimento: string;
  telefone: string;
  cpf: string;
  rg: string;
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
  rgMae?: string;
  rgPai?: string;
  modalidade: Modalidade;
  nivel: Nivel;
  status: StatusAtleta;
  criadoEm: string;
  foto?: string;
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
  turma: string;
  ativo: boolean;
};

export type BancoDados = {
  atletas: Atleta[];
  noticias: Noticia[];
  eventos: Evento[];
};
