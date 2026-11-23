import Image from "next/image";
import { Instagram, ArrowUpRight } from "@/components/ui/Icons";
import Reveal from "@/components/ui/Reveal";

export default function Idealizador() {
  return (
    <section id="idealizador" className="relative isolate overflow-hidden bg-ink text-white">
      <Image
        src="/img/comunidade.jpg"
        alt="Bodyboarders na praia ao pôr do sol"
        fill
        sizes="100vw"
        className="object-cover object-center opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />

      <div className="container-x relative z-10 py-24 md:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
          <Reveal className="max-w-2xl">
            <span className="kicker text-sun">
              <span className="h-px w-8 bg-sun" />
              Idealizador
            </span>
            <h2 className="mt-5 font-display text-[clamp(2.8rem,6vw,5.5rem)] uppercase leading-[0.9]">
              Gleuson
              <br />
              Farias
            </h2>
            <p className="mt-6 text-base leading-relaxed text-white/70">
              Gleuson Farias é o idealizador do Vencedores da Ponte Metálica.
              Foi ele quem começou a reunir a molecada de Iracema para treinar e
              sonhar mais alto — e quem segue puxando o projeto junto com
              atletas, famílias e voluntários.
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              A crença é simples: quando uma criança encontra no mar um lugar de
              pertencimento, ela descobre força para enfrentar tudo o que vem
              depois.
            </p>

            <a
              href="https://www.instagram.com/gleusonfarias/"
              target="_blank"
              rel="noreferrer"
              className="group mt-8 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur transition hover:border-sun hover:text-sun"
            >
              <Instagram size={16} />
              @gleusonfarias
              <ArrowUpRight
                size={14}
                className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </Reveal>

          <Reveal delay={120} className="hidden lg:block">
            <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur">
              <Image
                src="/img/logo.png"
                alt="Selo do projeto Vencedores da Ponte Metálica"
                width={220}
                height={220}
                className="h-52 w-52 object-contain"
              />
            </div>
          </Reveal>
        </div>

        <p className="mt-16 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">
          Praia de Iracema · Fortaleza · Ceará
        </p>
      </div>
    </section>
  );
}
