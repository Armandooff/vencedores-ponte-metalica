import type { Metadata } from "next";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import NoticiasLista from "@/components/noticias/NoticiasLista";

export const metadata: Metadata = {
  title: "Notícias & novidades",
  description:
    "Acompanhe treinos, competições, avisos e histórias do projeto Vencedores da Ponte Metálica.",
};

export default function PaginaNoticias() {
  return (
    <>
      <Header />
      <main>
        <NoticiasLista />
      </main>
      <Footer />
    </>
  );
}
