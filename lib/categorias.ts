export const CATEGORIAS_ATLETA = [
  "profissional-masculino",
  "profissional-feminino",
  "sub14-masculino",
  "sub14-feminino",
  "sub16-masculino",
  "sub16-feminino",
  "sub18-masculino",
  "sub18-feminino",
  "open-masculino",
  "open-feminino",
  "40-mais-masculino",
  "40-mais-feminino",
  "sub12-masculino",
  "sub12-feminino",
] as const;

export type CategoriaAtleta = (typeof CATEGORIAS_ATLETA)[number];

export const rotuloCategoriaAtleta: Record<CategoriaAtleta, string> = {
  "profissional-masculino": "Profissional masculino",
  "profissional-feminino": "Profissional feminino",
  "sub14-masculino": "Sub14 masculino",
  "sub14-feminino": "Sub14 feminino",
  "sub16-masculino": "Sub16 masculino",
  "sub16-feminino": "Sub16 feminino",
  "sub18-masculino": "Sub18 masculino",
  "sub18-feminino": "Sub18 feminino",
  "open-masculino": "Open masculino",
  "open-feminino": "Open feminino",
  "40-mais-masculino": "40+ masculino",
  "40-mais-feminino": "40+ feminino",
  "sub12-masculino": "Sub12 masculino",
  "sub12-feminino": "Sub12 feminino",
};

export const opcoesCategoriaAtleta = CATEGORIAS_ATLETA.map((value) => ({
  value,
  label: rotuloCategoriaAtleta[value],
}));

export type GrupoCategoriaAtleta = {
  id: string;
  rotulo: string;
  categorias: CategoriaAtleta[];
};

export const gruposCategoriaAtleta: GrupoCategoriaAtleta[] = [
  {
    id: "profissional",
    rotulo: "Profissional",
    categorias: ["profissional-masculino", "profissional-feminino"],
  },
  {
    id: "sub14",
    rotulo: "Sub14",
    categorias: ["sub14-masculino", "sub14-feminino"],
  },
  {
    id: "sub16",
    rotulo: "Sub16",
    categorias: ["sub16-masculino", "sub16-feminino"],
  },
  {
    id: "sub18",
    rotulo: "Sub18",
    categorias: ["sub18-masculino", "sub18-feminino"],
  },
  {
    id: "open",
    rotulo: "Open",
    categorias: ["open-masculino", "open-feminino"],
  },
  {
    id: "40-mais",
    rotulo: "40+",
    categorias: ["40-mais-masculino", "40-mais-feminino"],
  },
  {
    id: "sub12",
    rotulo: "Sub12",
    categorias: ["sub12-masculino", "sub12-feminino"],
  },
];

export function rotuloCategoriaOuPendente(
  categoria: CategoriaAtleta | null | undefined
) {
  return categoria ? rotuloCategoriaAtleta[categoria] : "A definir";
}

export function categoriaValida(valor: unknown): valor is CategoriaAtleta {
  return (
    typeof valor === "string" &&
    (CATEGORIAS_ATLETA as readonly string[]).includes(valor)
  );
}
