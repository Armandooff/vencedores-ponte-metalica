import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { ArrowUpRight, Check } from "@/components/ui/Icons";

const numeros = [
  { valor: "3.020", rotulo: "seguidores acompanhando o projeto" },
  { valor: "100%", rotulo: "gratuito para as famílias" },
  { valor: "1", rotulo: "modalidade: bodyboard" },
  { valor: "1", rotulo: "comunidade que se fortalece no mar" },
];

const destaques = [
  "Treinos gratuitos com pranchas e coletes disponíveis",
  "Acompanhamento técnico e social de perto",
  "Protagonismo para crianças e jovens da comunidade",
];

export default function QuemSomos() {
  return (
    <section id="projeto" className="relative overflow-hidden bg-cream py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative pb-14 pr-8 sm:pr-14">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
              <Image
                src="/img/ponte.jpg"
                alt="Ponte dos Ingleses vista da Praia de Iracema"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <span className="absolute bottom-6 left-6 text-[10px] font-bold uppercase tracking-[0.25em] text-white/80">
                Ponte dos Ingleses · Iracema
              </span>
            </div>

            <div className="absolute bottom-0 right-0 w-44 overflow-hidden rounded-2xl border-[6px] border-cream shadow-card sm:w-56">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/img/treino.jpg"
                  alt="Crianças aprendendo bodyboard na beira do mar"
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="absolute left-4 top-6 flex h-24 w-24 -rotate-6 items-center justify-center rounded-full bg-sun text-center font-display text-[11px] uppercase leading-[1.15] text-ink shadow-glow">
              O mar é
              <br />
              sala de
              <br />
              aula
            </div>
          </Reveal>

          <Reveal delay={120}>
            <span className="kicker text-sun-700">
              <span className="h-px w-8 bg-sun-600" />
              Quem somos
            </span>
            <h2 className="mt-5 font-display text-[clamp(2.6rem,5vw,4.6rem)] uppercase leading-[0.92] text-ink">
              Nascemos na areia.
              <br />
              Crescemos com a
              <br />
              <span className="text-sun-600">comunidade.</span>
            </h2>

            <p className="mt-6 text-base leading-relaxed text-ink/70">
              O Vencedores da Ponte Metálica é um projeto social que transforma
              o bodyboard em caminhos de oportunidade. Nossos treinos acontecem
              na Praia de Iracema, em Fortaleza, onde a Ponte dos Ingleses é
              parte da paisagem — e da nossa história.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink/70">
              Acreditamos que o esporte ensina disciplina, respeito e coragem.
              Por isso, cada treino é também um encontro de cuidado, educação e
              pertencimento para crianças, jovens e suas famílias.
            </p>

            <ul className="mt-8 space-y-3">
              {destaques.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink/75">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sun text-ink">
                    <Check size={12} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="https://www.instagram.com/vencedorespontemetalica/"
              target="_blank"
              rel="noreferrer"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-ink"
            >
              Acompanhe o dia a dia
              <ArrowUpRight
                size={16}
                className="text-sun-600 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </Reveal>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-8 border-t border-ink/10 pt-10 lg:grid-cols-4">
          {numeros.map((item, i) => (
            <Reveal key={item.rotulo} delay={i * 70}>
              <p className="font-display text-4xl leading-none text-ink sm:text-5xl">
                {item.valor}
              </p>
              <p className="mt-3 text-[11px] uppercase leading-relaxed tracking-wider text-ink/60">
                {item.rotulo}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
