import type { Metadata } from "next";
import LoginAtleta from "@/components/atletas/LoginAtleta";

export const metadata: Metadata = {
  title: "Área do atleta",
  description:
    "Acesse o portal do atleta do projeto Vencedores da Ponte Metálica e acompanhe novidades, treinos e o status da sua inscrição.",
};

export default function PaginaAtletas() {
  return <LoginAtleta />;
}
