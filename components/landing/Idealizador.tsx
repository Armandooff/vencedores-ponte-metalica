import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { ArrowUpRight, Instagram } from "@/components/ui/Icons";

export default function Idealizador() {
  return (
    <section
      id="idealizador"
      className="relative isolate overflow-hidden bg-ink text-white"
    >
      <Image
        src="/img/iracema.jpg"
        alt="Atleta do projeto sob as pilastras da Ponte dos Ingleses"
        fill
        sizes="100vw"
        className="object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/20" />

      <div className="container-x relative py-20 md:py-24">
        <Reveal className="max-w-2xl">
          <span className="kicker text-sun">
            <span className="h-px w-8 bg-sun" />
            Idealizador
          </span>
          <h2 className="mt-5 font-display text-[clamp(2.6rem,5vw,4.6rem)] uppercase leading-[0.92]">
            Gleuson
            <br />
            <span className="text-sun">Farias.</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
            Gleuson criou o Vencedores da Ponte Metálica para transformar o
            bodyboard em oportunidade para crianças e jovens da Praia de
            Iracema. O projeto nasceu na areia e cresce com a comunidade.
          </p>
          <a
            href="https://www.instagram.com/gleusonfarias/"
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-sun transition hover:text-white"
          >
            <Instagram size={15} />
            @gleusonfarias
            <ArrowUpRight size={14} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
