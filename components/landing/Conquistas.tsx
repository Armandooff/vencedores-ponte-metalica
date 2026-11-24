import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

const destaques = [
  {
    titulo: "Pódios",
    texto:
      "Atletas do projeto representando Iracema em competições e vivendo a experiência de competir.",
    imagem: "/img/podio-conquistas.jpg",
    alt: "Três atletas do projeto no pódio com troféus e pranchas de bodyboard",
  },
  {
    titulo: "Vencedores(as)",
    texto:
      "Histórias de crianças e jovens que encontraram no mar um lugar de pertencimento e novas escolhas.",
    imagem: "/img/vencedores.jpg",
    alt: "Atleta do projeto celebrando a vitória na beira do mar",
  },
  {
    titulo: "Treinos",
    texto:
      "Disciplina, técnica e cuidado todos os dias, com equipamentos e acompanhamento de perto.",
    imagem: "/img/treino-onda.jpg",
    alt: "Atleta do projeto descendo uma onda de bodyboard",
  },
];

export default function Conquistas() {
  return (
    <section
      id="conquistas"
      className="relative overflow-hidden bg-ink py-24 text-white md:py-32"
    >
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <Reveal>
            <span className="kicker text-sun">
              <span className="h-px w-8 bg-sun" />
              Conquistas
            </span>
            <h2 className="mt-5 font-display text-[clamp(2.6rem,5.5vw,5rem)] uppercase leading-[0.92]">
              O que a gente
              <br />
              constrói junto.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="max-w-md text-base leading-relaxed text-white/60 lg:pb-2">
              Cada pódio é importante. Mas a maior conquista é ver um atleta
              voltar no sábado seguinte, com a família na areia e a confiança de
              quem sabe que pertence.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {destaques.map((item, i) => (
            <Reveal key={item.titulo} delay={i * 100}>
              <article className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10">
                <Image
                  src={item.imagem}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-sun">
                    Destaque do projeto
                  </span>
                  <h3 className="mt-2 font-display text-3xl uppercase leading-none">
                    {item.titulo}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">
                    {item.texto}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-14 flex flex-col items-start gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl font-display text-2xl uppercase leading-tight text-white/85 sm:text-3xl">
              “A gente não forma só atletas.
              <span className="text-sun"> Forma gente que sabe levantar.”</span>
            </p>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
              Filosofia do projeto
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
