import type {
  CategoriaNoticia,
  Modalidade,
  Nivel,
  StatusAtleta,
} from "./types";

/** Data de hoje no fuso local, no formato YYYY-MM-DD. */
export function hojeISO() {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

export function formatarData(iso: string, opcoes?: Intl.DateTimeFormatOptions) {  if (!iso) return "—";
  const data = new Date(`${iso.slice(0, 10)}T12:00:00`);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    ...opcoes,
  }).format(data);
}

export function formatarDataCurta(iso: string) {
  if (!iso) return "—";
  const data = new Date(`${iso.slice(0, 10)}T12:00:00`);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(data);
}

export function formatarMes(iso: string) {
  if (!iso) return "—";
  const data = new Date(`${iso.slice(0, 10)}T12:00:00`);
  return new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(data)
    .replace(".", "");
}

export function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}

export function mascararCpf(cpf: string) {
  const digitos = cpf.replace(/\D/g, "");
  if (digitos.length !== 11) return cpf;
  return `***.***.${digitos.slice(-4, -2)}-${digitos.slice(-2)}`;
}

export function mascararTelefone(telefone: string) {
  const digitos = telefone.replace(/\D/g, "");
  if (digitos.length === 11) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  }
  if (digitos.length === 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  return telefone;
}

export const rotuloStatus: Record<StatusAtleta, string> = {
  pendente: "Pendente",
  aprovado: "Aprovado",
  reprovado: "Reprovado",
};

export const rotuloModalidade: Record<Modalidade, string> = {
  bodyboard: "Bodyboard",
};

export const rotuloNivel: Record<Nivel, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

export const rotuloCategoria: Record<CategoriaNoticia, string> = {
  Notícia: "Notícia",
  Treino: "Treino",
  Competição: "Competição",
  Aviso: "Aviso",
  Comunidade: "Comunidade",
};

export function classesStatus(status: StatusAtleta) {
  switch (status) {
    case "aprovado":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "reprovado":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

export function classesCategoria(categoria: CategoriaNoticia) {
  switch (categoria) {
    case "Competição":
      return "bg-sun text-ink border-sun";
    case "Treino":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "Aviso":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Comunidade":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-white text-ink/70 border-ink/15";
  }
}

export function slug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
