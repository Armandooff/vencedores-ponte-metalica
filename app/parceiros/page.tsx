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
  Heart,
  Instagram,
  MapPin,
  Package,
  Sparkles,
  Users,
} from "@/components/ui/Icons";

const INSTAGRAM_URL = "https://www.instagram.com/vencedorespontemetalica/";

export const metadata: Metadata = {
  title: "Parceiros e apoiadores",
  description:
    "Conheça as formas de apoiar o Vencedores da Ponte Metálica e como empresas, coletivos e organizações podem construir uma parceria com o projeto.",
  alternates: { canonical: "/parceiros" },
};

const motivos = [
  {
    titulo: "Manter a estrutura",
    texto:
      "Pranchas, coletes, segurança e acompanhamento técnico fazem parte da rotina. O apoio ajuda a manter esses recursos disponíveis para as turmas.",
    Icone: Package,
  },
  {
    titulo: "Fortalecer a comunidade",
    texto:
      "Uma parceria conecta sua marca ou organização ao cotidiano da Praia de Iracema e às famílias que participam do projeto.",
    Icone: Users,
  },
  {
    titulo: "Combinar com clareza",
    texto:
      "Escopo, contrapartidas e uso de marca são alinhados antes de qualquer divulgação.",
    Icone: Check,
  },
];

const tipos = [
  {
    titulo: "Equipamentos",
    texto:
      "Pranchas, coletes, nadadeiras e materiais de segurança em bom estado.",
    Icone: Package,
  },
  {
    titulo: "Alimentação",
    texto:
      "Apoio para lanches e encontros, sempre combinado com a coordenação.",
    Icone: Heart,
  },
  {
    titulo: "Transporte",
    texto:
      "Apoio logístico para deslocamentos e eventos do projeto.",
    Icone: MapPin,
  },
  {
    titulo: "Oficinas",
    texto:
      "Aulas, palestras e atividades educativas para atletas e famílias.",
    Icone: Calendar,
  },
  {
    titulo: "Patrocínio",
    texto:
      "Apoio financeiro para custos operacionais, com prestação de contas combinada.",
    Icone: Sparkles,
  },
];

const contrapartidas = [
  "Menção no site e nas redes sociais, quando autorizada.",
  "Relatório simples das atividades e da destinação do apoio.",
  "Presença em treinos ou eventos, mediante agenda.",
  "Uso de marca e conteúdo alinhado previamente com a coordenação.",
];

export default function PaginaParceiros() {
  return (
    <>
      <Header />
      <main className="bg-cream">
        <PageHero
          kicker="Parceiros"
          titulo={
            <>
              Parceria que
              <br />
              deixa marca <span className="text-sun">na areia.</span>
            </>
          }
          descricao="Empresas, coletivos e organizações podem ajudar a manter os treinos gratuitos e a estrutura que faz o projeto acontecer. Vamos conversar sobre a melhor forma de apoiar."
        >
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-sun"
            >
              <Instagram size={16} /> Conversar sobre parceria
              <ArrowUpRight size={14} />
            </a>
            <a href="#possibilidades" className="btn-ghost-light">
              Ver possibilidades <ArrowRight size={16} />
            </a>
          </div>
        </PageHero>

        <section className="py-14 md:py-20">
          <div className="container-x">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <span className="kicker text-sun-700">
                  <span className="h-px w-8 bg-sun-600" />
                  Por que apoiar
                </span>
                <h2 className="mt-4 font-display text-[clamp(2.2rem,4.5vw,3.8rem)] uppercase leading-[0.92] text-ink">
                  O projeto
                  <br />
                  acontece com
                  <br />
                  <span className="text-sun-700">apoio.</span>
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-ink/65">
                  O Vencedores é gratuito para as famílias. Cada parceria ajuda
                  a sustentar a rotina de treinos, a segurança e as atividades
                  que reúnem a comunidade.
                </p>
              </div>

              <div className="grid gap-4">
                {motivos.map((motivo, indice) => {
                  const Icone = motivo.Icone;
                  return (
                    <Reveal
                      key={motivo.titulo}
                      delay={indice * 70}
                      className="flex gap-4 rounded-2xl border border-ink/10 bg-white p-5 shadow-card"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sun/15 text-sun-700">
                        <Icone size={21} />
                      </span>
                      <div>
                        <h3 className="font-display text-xl uppercase leading-none text-ink">
                          {motivo.titulo}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink/65">
                          {motivo.texto}
                        </p>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="possibilidades" className="bg-[#EFE6D8] py-14 md:py-20">
          <div className="container-x">
            <div className="max-w-3xl">
              <span className="kicker text-sun-700">
                <span className="h-px w-8 bg-sun-600" />
                Tipos de apoio
              </span>
              <h2 className="mt-4 font-display text-[clamp(2.2rem,4.5vw,3.8rem)] uppercase leading-[0.92] text-ink">
                Cada parceria
                <br />
                tem um formato.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink/65">
                Não há valores de patrocínio publicados nesta página. O escopo
                é combinado diretamente com a coordenação, de acordo com o que
                você pode oferecer e o que o projeto precisa no momento.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tipos.map((tipo, indice) => {
                const Icone = tipo.Icone;
                return (
                  <Reveal
                    as="article"
                    key={tipo.titulo}
                    delay={indice * 70}
                    className="rounded-3xl border border-ink/10 bg-white p-6 shadow-card"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sun/15 text-sun-700">
                      <Icone size={23} />
                    </span>
                    <h3 className="mt-5 font-display text-2xl uppercase leading-none text-ink">
                      {tipo.titulo}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/65">
                      {tipo.texto}
                    </p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <span className="kicker text-sun-700">
                <span className="h-px w-8 bg-sun-600" />
                Contrapartidas
              </span>
              <h2 className="mt-4 font-display text-[clamp(2.2rem,4.5vw,3.8rem)] uppercase leading-[0.92] text-ink">
                O que podemos
                <br />
                combinar.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/65">
                As contrapartidas são definidas caso a caso. A coordenação
                conversa sobre alcance, formato e limites antes de qualquer
                anúncio público.
              </p>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {contrapartidas.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-white px-5 py-4 text-sm leading-relaxed text-ink/70"
                >
                  <Check
                    size={16}
                    className="mt-0.5 shrink-0 text-sun-700"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="pb-14 md:pb-20">
          <div className="container-x">
            <div className="overflow-hidden rounded-[2rem] bg-ink p-7 text-white sm:p-9 lg:p-12">
              <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                <div>
                  <span className="kicker text-sun">
                    <span className="h-px w-8 bg-sun" />
                    Aberto a novas parcerias
                  </span>
                  <h2 className="mt-4 font-display text-[clamp(2.2rem,4.5vw,3.8rem)] uppercase leading-[0.92]">
                    Vamos construir
                    <br />
                    isso <span className="text-sun">juntos.</span>
                  </h2>
                  <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/65">
                    Ainda não publicamos logos ou nomes de parceiros nesta
                    página. Quando uma parceria for firmada e autorizada, ela
                    poderá ser apresentada aqui. Se sua empresa ou organização
                    quer apoiar, o primeiro passo é uma conversa.
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
                    O canal oficial de WhatsApp será confirmado pela
                    coordenação. Não há cadastro automático de parceiros nesta
                    página.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sun">
                    O que esperar da conversa
                  </p>
                  <ol className="mt-5 space-y-4">
                    {[
                      "Entendemos o que sua empresa ou organização pode oferecer.",
                      "Alinhamos o escopo, o período e as contrapartidas.",
                      "Combinamos como a parceria será comunicada e acompanhada.",
                    ].map((item, indice) => (
                      <li key={item} className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sun font-display text-xs text-ink">
                          {indice + 1}
                        </span>
                        <p className="text-sm leading-relaxed text-white/65">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/50">
                    Sem promessa de exclusividade, valores fixos ou benefícios
                    automáticos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
