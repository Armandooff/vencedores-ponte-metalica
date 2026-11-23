import type { Metadata } from "next";
import PainelAtleta from "@/components/atletas/PainelAtleta";

export const metadata: Metadata = {
  title: "Painel do atleta",
  description:
    "Acompanhe novidades, treinos e o status da sua inscrição no projeto Vencedores da Ponte Metálica.",
};

export default function PaginaPainelAtleta() {
  return <PainelAtleta />;
}
