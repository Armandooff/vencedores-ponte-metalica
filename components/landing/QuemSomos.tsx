import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

export default function QuemSomos() {
  return (
    <section id="projeto" className="relative overflow-hidden bg-cream py-16 md:py-24">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative pb-10 pr-8 sm:pr-14">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
              <Image
                src="/img/ponte.jpg"
                alt="Ponte dos Ingleses vista da Praia de Iracema"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <span className="absolute bottom-6 left-6 max-w-[calc(100%-11rem)] text-[10px] font-bold uppercase tracking-[0.25em] text-white/80 sm:max-w-none">
                Ponte dos Ingleses
              </span>
            </div>

            <div className="absolute bottom-0 right-0 w-44 overflow-hidden rounded-2xl border-[6px] border-cream shadow-card sm:w-56">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/img/treino.jpg"
                  alt="Atletas do projeto com pranchas de bodyboard ao pôr do sol"
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

          </Reveal>
        </div>
      </div>
    </section>
  );
}
