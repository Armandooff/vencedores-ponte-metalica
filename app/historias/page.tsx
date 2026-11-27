import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/ui/Reveal";
import {
  ArrowRight,
  ArrowUpRight,
  Instagram,
} from "@/components/ui/Icons";

const INSTAGRAM_URL = "https://www.instagram.com/vencedorespontemetalica/";

export const metadata: Metadata = {
  title: "Histórias",
  description:
    "Três narrativas sobre o cotidiano do Vencedores da Ponte Metálica: o primeiro contato com o mar, a primeira competição e a comunidade que fica.",
  alternates: { canonical: "/historias" },
  openGraph: {
    title: "Histórias — Vencedores da Ponte Metálica",
    description:
      "O primeiro contato, a primeira competição e a comunidade que fica.",
    url: "/historias",
    images: ["/img/treino.jpg"],
  },
};

const historias = [
  {
    id: "primeiro-contato",
    numero: "01",
    titulo: "O primeiro contato",
    imagem: "/img/treino.jpg",
    alt: "Grupo de crianças, jovens e professores reunido na areia com pranchas de bodyboard",
    legenda:
      "Roda de conversa antes do treino, na areia da Praia de Iracema.",
    aspecto: "aspect-[4/3]",
    paragrafos: [
      "Chegar na areia já é um passo. Há quem chegue agarrado à mão de um responsável, há quem chegue correndo. O primeiro contato é feito no ritmo de cada criança: observar o mar, entender o vento, conhecer a prancha e vestir o colete.",
      "Antes de qualquer onda, vem o combinado: respeitar o mar, respeitar o colega e pedir ajuda quando for preciso. A confiança aparece em pequenas decisões — segurar a prancha, entrar até a cintura, olhar para o professor antes de remar. O mar ensina que cada um tem seu tempo.",
    ],
  },
  {
    id: "primeira-competicao",
    numero: "02",
    titulo: "A primeira competição",
    imagem: "/img/podio-conquistas.jpg",
    alt: "Atletas do projeto no pódio de uma competição, segurando troféus e pranchas de bodyboard",
    legenda:
      "Celebração no pódio de uma etapa do circuito de bodyboard.",
    aspecto: "aspect-[4/5]",
    paragrafos: [
      "Quando chega a primeira competição, o nervosismo também chega. A prancha parece maior, a bateria parece mais longa e a areia fica cheia de rostos conhecidos. A orientação é a mesma dos treinos: observar as condições, escolher as ondas com calma e lembrar que competir também é aprender.",
      "O resultado não conta a história toda. Conta a coragem de entrar na água, o apoio de quem fica na areia e a vontade de voltar para o próximo treino. Pódio é consequência — e, quando vem, é celebrado junto.",
    ],
  },
  {
    id: "comunidade",
    numero: "03",
    titulo: "A comunidade que fica",
    imagem: "/img/comunidade.jpg",
    alt: "Grupo de atletas, famílias e voluntários posando junto após uma atividade do projeto",
    legenda:
      "Encontro de atletas, famílias e voluntários do projeto.",
    aspecto: "aspect-[4/3]",
    paragrafos: [
      "O projeto não termina quando a aula acaba. Ele continua nas famílias que acompanham os treinos, nos voluntários que chegam cedo e nos atletas que voltam para ajudar os mais novos. A praia vira ponto de encontro, e o cuidado com o mar passa a fazer parte da rotina.",
      "É essa presença que sustenta o trabalho: gente que fica, que pergunta, que aparece de novo no próximo encontro. A comunidade é o que fica depois que a onda passa.",
    ],
  },
];

export default function PaginaHistorias() {
  return (
    <>
      <Header />
      <main className="bg-cream">
        <PageHero
          kicker="Histórias"
          titulo={
            <>
              Três histórias
              <br />
              que o mar <span className="text-sun">guarda.</span>
            </>
          }
          descricao="O que acontece antes da primeira onda, na primeira competição e depois que a areia esvazia. Três narrativas sobre o que fica."
        />

        <section className="py-14 md:py-20">
          <div className="container-x">
            <Reveal>
              <div className="rounded-2xl border border-ink/10 bg-white/70 px-5 py-4 text-sm leading-relaxed text-ink/65">
                <strong className="font-semibold text-ink">
                  Nota editorial:
                </strong>{" "}
                estas narrativas são editoriais, inspiradas no cotidiano do
                projeto. Não nomeiam atletas, famílias ou voluntários e não
                reproduzem falas de pessoas reais.
              </div>
            </Reveal>

            <div className="mt-12 space-y-16 md:mt-16 md:space-y-24">
              {historias.map((historia, indice) => (
                <article
                  key={historia.id}
                  aria-labelledby={`historia-${historia.id}`}
                  className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14"
                >
                  <Reveal
                    className={indice % 2 === 1 ? "lg:order-2" : ""}
                  >
                    <figure>
                      <div
                        className={`relative overflow-hidden rounded-[2rem] bg-ink/5 ${historia.aspecto}`}
                      >
                        <Image
                          src={historia.imagem}
                          alt={historia.alt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 45vw"
                          className="object-cover"
                        />
                      </div>
                      <figcaption className="mt-3 flex gap-2 text-xs leading-relaxed text-ink/60">
                        <span className="font-semibold uppercase tracking-wider text-sun-700">
                          Acervo
                        </span>
                        {historia.legenda}
                      </figcaption>
                    </figure>
                  </Reveal>

                  <Reveal
                    delay={100}
                    className={indice % 2 === 1 ? "lg:order-1" : ""}
                  >
                    <span
                      aria-hidden="true"
                      className="font-display text-5xl leading-none text-ink/50"
                    >
                      {historia.numero}
                    </span>
                    <h2
                      id={`historia-${historia.id}`}
                      className="mt-3 font-display text-[clamp(2.4rem,4.5vw,3.8rem)] uppercase leading-[0.92] text-ink"
                    >
                      {historia.titulo}
                    </h2>
                    <div className="mt-5 space-y-4 text-base leading-relaxed text-ink/70">
                      {historia.paragrafos.map((paragrafo) => (
                        <p key={paragrafo}>{paragrafo}</p>
                      ))}
                    </div>
                  </Reveal>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-ink/10 bg-[#EFE6D8] py-14 md:py-20">
          <div className="container-x flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="kicker text-sun-700">
                <span className="h-px w-8 bg-sun-600" />
                Continue acompanhando
              </span>
              <h2 className="mt-3 font-display text-3xl uppercase leading-none text-ink">
                O dia a dia também é história.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/65">
                Treinos, encontros e bastidores aparecem primeiro no Instagram
                do projeto.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-ink"
              >
                <Instagram size={16} /> Instagram
                <ArrowUpRight size={14} />
              </a>
              <Link href="/noticias" className="btn-ghost-dark">
                Ver notícias <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
