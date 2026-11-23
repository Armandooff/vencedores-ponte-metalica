import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { ArrowRight, Heart, Waves, Sparkles } from "@/components/ui/Icons";

const pilares = [
  {
    numero: "01",
    titulo: "Esporte",
    icone: Waves,
    texto:
      "Formação técnica em bodyboard, com segurança, constância e evolução acompanhada de perto.",
  },
  {
    numero: "02",
    titulo: "Educação",
    icone: Sparkles,
    texto:
      "Disciplina, respeito e trabalho em equipe. Valores que o mar ensina e que levamos para a vida.",
  },
  {
    numero: "03",
    titulo: "Comunidade",
    icone: Heart,
    texto:
      "Famílias, voluntários e parceiros unidos pelo cuidado com as crianças e com a Praia de Iracema.",
  },
];

export default function Pilares() {
  return (
    <section
      id="pilares"
      className="relative overflow-hidden bg-ink py-24 text-white md:py-32"
    >
      <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-sun/10 blur-[110px]" />

      <div className="container-x relative">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <Reveal>
            <span className="kicker text-sun">
              <span className="h-px w-8 bg-sun" />
              O que nos move
            </span>
            <h2 className="mt-5 font-display text-[clamp(2.6rem,5.5vw,5rem)] uppercase leading-[0.92]">
              Muito além
              <br />
              da onda.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="max-w-md text-base leading-relaxed text-white/60 lg:pb-2">
              O bodyboard é a porta de entrada. O que construímos dentro e fora
              da água é o que fica: autoestima, pertencimento e novas
              possibilidades para quem cresce em Iracema.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {pilares.map((pilar, i) => {
            const Icone = pilar.icone;
            return (
              <Reveal key={pilar.titulo} delay={i * 100}>
                <article className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-colors duration-300 hover:border-sun/50 hover:bg-white/[0.05]">
                  <span className="absolute right-6 top-5 font-display text-6xl text-stroke">
                    {pilar.numero}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sun text-ink">
                    <Icone size={22} />
                  </span>
                  <h3 className="mt-8 font-display text-3xl uppercase leading-none">
                    {pilar.titulo}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/60">
                    {pilar.texto}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={150}>
          <div className="mt-12 flex flex-col items-start justify-between gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
            <p className="max-w-xl font-display text-xl uppercase leading-tight text-white/80 sm:text-2xl">
              O mar é o ponto de partida. A transformação acontece na vida.
            </p>
            <Link
              href="/cadastro"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-sun"
            >
              Fazer parte
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
