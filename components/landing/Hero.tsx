import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Waves } from "@/components/ui/Icons";

const numeros = [
  { valor: "3.020", rotulo: "seguidores no Instagram" },
  { valor: "100%", rotulo: "gratuito para as famílias" },
];

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink text-white">
      <Image
        src="/img/hero.jpg"
        alt="Ponte dos Ingleses ao entardecer, na Praia de Iracema"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/35 to-transparent" />
      <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-sun/20 blur-[120px]" />

      <div className="container-x relative z-10 pb-10 pt-24 sm:pt-32">
        <div className="grid items-end gap-12 lg:grid-cols-[1fr_auto]">
          <div className="max-w-4xl">
            <p className="kicker text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-sun" />
              Projeto social · Praia de Iracema, Fortaleza
            </p>

            <h1 className="mt-6 font-display text-[clamp(3.1rem,9.2vw,8.5rem)] uppercase leading-[0.88]">
              A vitória
              <br />
              começa na
              <br />
              <span className="text-sun">areia.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white sm:mt-7 sm:text-lg">
              Bodyboard e comunidade para crianças e jovens da Praia de
              Iracema. Aqui, cada onda ensina — e cada atleta descobre que pode
              ir mais longe.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <Link href="/cadastro" className="btn-sun">
                Quero fazer parte <ArrowRight size={17} />
              </Link>
              <Link href="/atletas" className="btn-ghost-light">
                Área do atleta
              </Link>
            </div>
          </div>

          <div className="hidden flex-col items-center gap-6 lg:flex">
            <div className="animate-float">
              <Image
                src="/img/logo.png"
                alt="Selo Vencedores da Ponte Metálica"
                width={220}
                height={220}
                priority
                className="h-48 w-48 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.55)] xl:h-56 xl:w-56"
              />
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">
              <Waves size={14} className="text-sun" />
              Bodyboard · Mar · Cidadania
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/15 pt-7 sm:mt-14">
          {numeros.map((item) => (
            <div key={item.rotulo}>
              <p className="font-display text-3xl leading-none text-white sm:text-4xl">
                {item.valor}
              </p>
              <p className="mt-2 text-[11px] uppercase leading-snug tracking-wider text-white/50">
                {item.rotulo}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
