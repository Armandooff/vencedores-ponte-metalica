import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/ui/Reveal";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  Image as ImageIcon,
  Instagram,
  MapPin,
  Package,
  Users,
} from "@/components/ui/Icons";

const INSTAGRAM_URL = "https://www.instagram.com/vencedorespontemetalica/";

export const metadata: Metadata = {
  title: "Voluntariado",
  description:
    "Conheça as frentes de voluntariado do Vencedores da Ponte Metálica e saiba como conversar com a coordenação para participar.",
  alternates: { canonical: "/voluntariado" },
};

const funcoes = [
  {
    titulo: "Apoio na areia",
    texto:
      "Recepção das turmas, organização dos grupos e apoio aos professores durante a atividade.",
    Icone: Users,
  },
  {
    titulo: "Registro e fotografia",
    texto:
      "Cobertura de treinos e eventos, com atenção às autorizações de uso de imagem.",
    Icone: ImageIcon,
  },
  {
    titulo: "Equipamentos",
    texto:
      "Conferência, limpeza e organização de pranchas, coletes e materiais de apoio.",
    Icone: Package,
  },
  {
    titulo: "Eventos e oficinas",
    texto:
      "Apoio logístico, recepção e atividades educativas em ações especiais do projeto.",
    Icone: Calendar,
  },
  {
    titulo: "Transporte",
    texto:
      "Ajuda na organização de deslocamentos combinados previamente pela coordenação, quando houver necessidade.",
    Icone: MapPin,
  },
];

const requisitos = [
  "Compromisso com o cuidado e a proteção das crianças e adolescentes.",
  "Disponibilidade aos sábados, em parte do período, a combinar com a coordenação.",
  "Comunicação com a equipe e aviso prévio em caso de ausência.",
  "Participação em uma conversa de alinhamento antes das atividades com menores.",
  "Respeito às orientações de segurança no mar e à rotina do projeto.",
];

const passos = [
  {
    titulo: "Chame no Instagram",
    texto:
      "Conte que quer ser voluntário e em qual frente tem mais interesse em ajudar.",
  },
  {
    titulo: "Converse com a coordenação",
    texto:
      "A equipe explica a rotina, tira dúvidas e confirma a disponibilidade.",
  },
  {
    titulo: "Participe do alinhamento",
    texto:
      "Antes de atividades com crianças, combinamos cuidados, limites e segurança.",
  },
  {
    titulo: "Comece na escala combinada",
    texto:
      "Você acompanha um encontro e, se fizer sentido para os dois lados, segue no time.",
  },
];

export default function PaginaVoluntariado() {
  return (
    <>
      <Header />
      <main className="bg-cream">
        <PageHero
          kicker="Voluntariado"
          titulo={
            <>
              Tem lugar
              <br />
              para você <span className="text-sun">na areia.</span>
            </>
          }
          descricao="O projeto cresce com gente que aparece, ajuda e fica. Conheça as frentes de voluntariado e o primeiro passo para participar."
        >
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-sun"
            >
              <Instagram size={16} /> Falar no Instagram
              <ArrowUpRight size={14} />
            </a>
            <a href="#frentes" className="btn-ghost-light">
              Ver frentes <ArrowRight size={16} />
            </a>
          </div>
        </PageHero>

        <section id="frentes" className="py-14 md:py-20">
          <div className="container-x">
            <div className="max-w-3xl">
              <span className="kicker text-sun-700">
                <span className="h-px w-8 bg-sun-600" />
                Frentes de apoio
              </span>
              <h2 className="mt-4 font-display text-[clamp(2.2rem,4.5vw,3.8rem)] uppercase leading-[0.92] text-ink">
                Cinco frentes,
                <br />
                uma mesma praia.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/65">
                Não é necessário fazer tudo. A coordenação combina a frente que
                faz sentido para você, sua disponibilidade e o momento do
                projeto.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {funcoes.map((funcao, indice) => {
                const Icone = funcao.Icone;
                return (
                  <Reveal
                    as="article"
                    key={funcao.titulo}
                    delay={indice * 70}
                    className="rounded-3xl border border-ink/10 bg-white p-6 shadow-card"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sun/15 text-sun-700">
                      <Icone size={23} />
                    </span>
                    <h3 className="mt-5 font-display text-2xl uppercase leading-none text-ink">
                      {funcao.titulo}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/65">
                      {funcao.texto}
                    </p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#EFE6D8] py-14 md:py-20">
          <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <span className="kicker text-sun-700">
                <span className="h-px w-8 bg-sun-600" />
                Antes de começar
              </span>
              <h2 className="mt-4 font-display text-[clamp(2.2rem,4.5vw,3.8rem)] uppercase leading-[0.92] text-ink">
                Cuidado
                <br />
                vem primeiro.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/65">
                O voluntariado é uma responsabilidade compartilhada. A
                coordenação apresenta a rotina e os combinados antes de
                qualquer atividade com as turmas.
              </p>
              <div className="mt-6 rounded-2xl border border-ink/10 bg-white/70 p-5 text-sm leading-relaxed text-ink/70">
                Não há formulário de inscrição de voluntário nesta página. O
                primeiro passo é uma conversa com a coordenação.
              </div>
            </div>

            <ul className="space-y-3">
              {requisitos.map((requisito) => (
                <li
                  key={requisito}
                  className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-white px-5 py-4 text-sm leading-relaxed text-ink/70"
                >
                  <Check
                    size={16}
                    className="mt-0.5 shrink-0 text-sun-700"
                  />
                  {requisito}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="container-x">
            <div className="overflow-hidden rounded-[2rem] bg-ink p-7 text-white sm:p-9 lg:p-12">
              <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                <div>
                  <span className="kicker text-sun">
                    <span className="h-px w-8 bg-sun" />
                    Como começar
                  </span>
                  <h2 className="mt-4 font-display text-[clamp(2.2rem,4.5vw,3.8rem)] uppercase leading-[0.92]">
                    O primeiro passo
                    <br />
                    é uma <span className="text-sun">conversa.</span>
                  </h2>
                  <p className="mt-5 max-w-md text-sm leading-relaxed text-white/65">
                    A coordenação confirma a disponibilidade e o canal oficial
                    antes de qualquer escala. O WhatsApp exibido no site ainda
                    é ilustrativo; use o Instagram ou a seção de contato.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-sun"
                    >
                      <Instagram size={16} /> Falar no Instagram
                      <ArrowUpRight size={14} />
                    </a>
                    <Link href="/#contato" className="btn-ghost-light">
                      Ir para contato <ArrowRight size={16} />
                    </Link>
                  </div>
                  <p className="mt-5 text-xs leading-relaxed text-white/50">
                    Prefere apoiar de outra forma? Veja{" "}
                    <Link
                      href="/parceiros"
                      className="font-semibold text-sun underline underline-offset-2"
                    >
                      parcerias
                    </Link>{" "}
                    ou{" "}
                    <Link
                      href="/doacoes"
                      className="font-semibold text-sun underline underline-offset-2"
                    >
                      doações
                    </Link>
                    .
                  </p>
                </div>

                <ol className="space-y-5">
                  {passos.map((passo, indice) => (
                    <li key={passo.titulo} className="flex gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sun font-display text-sm text-ink">
                        {String(indice + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-display text-xl uppercase leading-none">
                          {passo.titulo}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                          {passo.texto}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
