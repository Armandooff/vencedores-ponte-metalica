import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";
import AgendaLista from "@/components/agenda/AgendaLista";
import { listarEventosPublicos } from "@/lib/agenda-publica";
import { hojeISO } from "@/lib/format";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Instagram,
  MapPin,
} from "@/components/ui/Icons";

const INSTAGRAM_URL = "https://www.instagram.com/vencedorespontemetalica/";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Agenda de treinos e eventos",
  description:
    "Confira os próximos treinos, competições e ações do projeto Vencedores da Ponte Metálica na Praia de Iracema, em Fortaleza (CE).",
  alternates: { canonical: "/agenda" },
  openGraph: {
    title: "Agenda — Vencedores da Ponte Metálica",
    description:
      "Treinos, competições e ações abertas à comunidade na Praia de Iracema.",
    url: "/agenda",
    images: ["/img/treino.jpg"],
  },
};

export default async function PaginaAgenda() {
  const { eventos, indisponivel } = await listarEventosPublicos();
  const hoje = hojeISO();

  return (
    <>
      <Header />
      <main className="bg-cream">
        <PageHero
          kicker="Agenda pública"
          titulo={
            <>
              A próxima onda
              <br />
              tem <span className="text-sun">data.</span>
            </>
          }
          descricao="Treinos, competições e ações abertas à comunidade. Datas, horários e locais são atualizados pela coordenação do projeto."
        >
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-semibold uppercase tracking-wider text-white/60">
            <span className="inline-flex items-center gap-2">
              <Calendar size={14} className="text-sun" />
              Eventos ativos e datas encerradas
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin size={14} className="text-sun" />
              Praia de Iracema · Fortaleza (CE)
            </span>
          </div>
        </PageHero>

        <section className="py-14 md:py-20">
          <div className="container-x">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="kicker text-sun-700">
                  <span className="h-px w-8 bg-sun-600" />
                  Próximos encontros
                </span>
                <h2 className="mt-4 font-display text-[clamp(2.2rem,4vw,3.4rem)] uppercase leading-[0.92] text-ink">
                  Escolha uma data.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-ink/65">
                Os eventos são publicados pela coordenação. Se uma data mudar,
                o aviso aparece aqui e no Instagram do projeto.
              </p>
            </div>

            <div className="mt-8">
              <AgendaLista
                eventos={eventos}
                hoje={hoje}
                indisponivel={indisponivel}
              />
            </div>
          </div>
        </section>

        <section className="border-t border-ink/10 bg-[#EFE6D8] py-12 md:py-14">
          <div className="container-x flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sun-700">
                Quer participar?
              </p>
              <h2 className="mt-2 font-display text-3xl uppercase leading-none text-ink">
                A vaga começa no cadastro.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/65">
                A inscrição é gratuita e feita pela área do atleta. Menores de
                idade precisam dos dados de um responsável.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/cadastro" className="btn-ink">
                Inscrever atleta <ArrowRight size={16} />
              </Link>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost-dark"
              >
                <Instagram size={16} /> Instagram
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
