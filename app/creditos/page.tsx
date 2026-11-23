import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { ArrowLeft, ArrowUpRight } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Créditos das imagens",
  description:
    "Créditos e licenças das imagens utilizadas no site do projeto Vencedores da Ponte Metálica.",
};

const commons = [
  {
    titulo: "Ponte dos Ingleses ao anoitecer",
    autor: "Claudney Neves",
    licenca: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Ponte_dos_Ingleses,_tamb%C3%A9m_conhecida_como_Ponte_Met%C3%A1lica.jpg",
  },
  {
    titulo: "Ponte dos Ingleses",
    autor: "Governo Federal Brasileiro",
    licenca: "CC BY-SA 3.0",
    href: "https://commons.wikimedia.org/wiki/File:Ponte_dos_Ingleses_(2).jpg",
  },
  {
    titulo: "Ponte dos Ingleses ao pôr do sol",
    autor: "GLandovsky",
    licenca: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Ponte_dos_Ingleses_em_Fortaleza_05.jpg",
  },
  {
    titulo: "Treino de bodyboard",
    autor: "Bengt Nyman",
    licenca: "CC BY 2.0",
    href: "https://commons.wikimedia.org/wiki/File:Bodyboarding_2_2006.jpg",
  },
  {
    titulo: "Bodyboard na onda",
    autor: "Dedekindr",
    licenca: "CC BY-SA 3.0",
    href: "https://commons.wikimedia.org/wiki/File:Body-boarding_at_Baggies_beach.jpg",
  },
  {
    titulo: "Comunidade no pôr do sol",
    autor: "kevinmcgill",
    licenca: "CC BY-SA 2.0",
    href: "https://commons.wikimedia.org/wiki/File:Bodyboarders_(4596943453).jpg",
  },
];

export default function PaginaCreditos() {
  return (
    <>
      <Header />
      <main className="bg-cream">
        <section className="bg-ink pb-16 pt-32 text-white">
          <div className="container-x">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 transition hover:text-white"
            >
              <ArrowLeft size={14} /> Voltar ao site
            </Link>
            <h1 className="mt-6 font-display text-[clamp(2.6rem,6vw,5rem)] uppercase leading-[0.92]">
              Créditos &
              <br />
              <span className="text-sun">licenças.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/60">
              O site usa fotografias de arquivo sob licenças livres para
              ilustrar a Ponte dos Ingleses e o bodyboard. As imagens oficiais
              do Vencedores da Ponte Metálica podem substituir os arquivos a
              qualquer momento.
            </p>
          </div>
        </section>

        <section className="container-x max-w-4xl space-y-12 py-16">
          <div>
            <h2 className="font-display text-2xl uppercase text-ink">
              Wikimedia Commons
            </h2>
            <p className="mt-2 text-sm text-ink/65">
              Fotografias sob licenças Creative Commons — atribuição e
              compartilhamento nos mesmos termos.
            </p>
            <ul className="mt-5 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white">
              {commons.map((item) => (
                <li
                  key={item.href}
                  className="flex flex-col gap-1 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.titulo}</p>
                    <p className="mt-0.5 text-xs text-ink/60">
                      {item.autor} · {item.licenca}
                    </p>
                  </div>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sun-700 transition hover:text-ink"
                  >
                    Ver original <ArrowUpRight size={13} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-6">
            <h2 className="font-display text-xl uppercase text-ink">
              Imagens do projeto
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">
              O logotipo e as fotografias oficiais do projeto são de uso
              exclusivo do Vencedores da Ponte Metálica. Para enviar novas
              imagens ou solicitar a remoção de algum conteúdo, fale com a
              coordenação pelo{" "}
              <a
                href="https://www.instagram.com/vencedorespontemetalica/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-sun-700 underline-offset-2 hover:underline"
              >
                Instagram oficial
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
