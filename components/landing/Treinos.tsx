import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

const etapas = [
  {
    numero: "01",
    titulo: "Inscrição",
    texto:
      "Crie sua conta e preencha a ficha do atleta. Menores de 18 anos contam com os dados do responsável.",
  },
  {
    numero: "02",
    titulo: "Triagem",
    texto:
      "A coordenação avalia o perfil e confirma a vaga na turma mais adequada para cada fase.",
  },
  {
    numero: "03",
    titulo: "Treinos",
    texto:
      "Aulas regulares na Praia de Iracema, com pranchas, coletes e acompanhamento técnico.",
  },
  {
    numero: "04",
    titulo: "Acompanhamento",
    texto:
      "A evolução é registrada no painel do atleta e compartilhada com a família.",
  },
];

export default function Treinos() {
  return (
    <section id="treinos" className="bg-[#EFE6D8] py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <Reveal>
              <span className="kicker text-sun-700">
                <span className="h-px w-8 bg-sun-600" />
                Como funciona
              </span>
              <h2 className="mt-5 font-display text-[clamp(2.6rem,5vw,4.6rem)] uppercase leading-[0.92] text-ink">
                Do primeiro
                <br />
                contato ao
                <br />
                <span className="text-sun-700">primeiro pódio.</span>
              </h2>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-ink/70">
                Nosso método é simples: acolher, ensinar e acompanhar. Cada
                etapa foi pensada para que o atleta evolua com segurança e se
                sinta parte de algo maior.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-[2rem]">
                <Image
                  src="/img/podio-treino.jpg"
                  alt="Atletas do projeto no pódio com troféus e pranchas de bodyboard"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              </div>
            </Reveal>
          </div>

          <div className="lg:pt-4">
            <ol className="relative space-y-2 border-l border-ink/15 pl-8">
              {etapas.map((etapa, i) => (
                <Reveal
                  as="li"
                  key={etapa.numero}
                  delay={i * 90}
                  className="group relative block pb-8"
                >
                  <span className="absolute -left-[3.05rem] top-0 flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-cream font-display text-sm text-ink transition group-hover:border-sun group-hover:bg-sun">
                    {etapa.numero}
                  </span>
                  <h3 className="font-display text-2xl uppercase leading-none text-ink">
                    {etapa.titulo}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/60">
                    {etapa.texto}
                  </p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
