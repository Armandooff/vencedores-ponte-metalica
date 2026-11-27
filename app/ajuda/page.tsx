import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/ui/Reveal";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Instagram,
} from "@/components/ui/Icons";

const INSTAGRAM_URL = "https://www.instagram.com/vencedorespontemetalica/";

export const metadata: Metadata = {
  title: "Central de ajuda",
  description:
    "Respostas sobre inscrição, gratuidade, categorias, treinos, responsáveis, equipamentos, apoio ao projeto e privacidade no Vencedores da Ponte Metálica.",
  alternates: { canonical: "/ajuda" },
};

const linkInline =
  "font-semibold text-sun-700 underline underline-offset-2 hover:text-ink";

const faqs = [
  {
    pergunta: "Como faço para inscrever um atleta?",
    resposta: (
      <>
        <p>
          A inscrição é feita em duas etapas: criar uma conta com e-mail e senha
          e preencher a ficha do atleta. Depois do envio, a coordenação analisa
          o cadastro e confirma a vaga.
        </p>
        <p>
          Você acompanha o status na{" "}
          <Link href="/atletas" className={linkInline}>
            área do atleta
          </Link>
          . Se o atleta for menor de 18 anos, os dados do responsável são
          obrigatórios.
        </p>
      </>
    ),
  },
  {
    pergunta: "A participação é gratuita?",
    resposta: (
      <>
        <p>
          Sim. A participação é gratuita e o projeto oferece pranchas e coletes
          durante os treinos. Não há mensalidade.
        </p>
        <p>
          Doações e parcerias ajudam a manter a estrutura, os equipamentos e o
          acompanhamento técnico das turmas.
        </p>
      </>
    ),
  },
  {
    pergunta: "Quais são as idades e categorias?",
    resposta: (
      <>
        <p>
          O projeto recebe crianças e jovens e organiza as turmas pelas
          categorias Sub12, Sub14, Sub16, Sub18, Open, 40+ e Profissional, nos
          naipes masculino e feminino.
        </p>
        <p>
          A categoria é escolhida no cadastro e confirmada pela coordenação
          durante a análise. Em caso de dúvida, fale com a equipe antes de
          enviar.
        </p>
      </>
    ),
  },
  {
    pergunta: "Onde acontecem os treinos?",
    resposta: (
      <>
        <p>
          Na Praia de Iracema, em Fortaleza (CE), em frente à Ponte dos
          Ingleses.
        </p>
        <p>
          As datas e horários de cada treino ficam na{" "}
          <Link href="/agenda" className={linkInline}>
            Agenda
          </Link>{" "}
          e são atualizados pela coordenação. Condições de mar ou chuva podem
          alterar a programação; o aviso aparece na Agenda e no Instagram.
        </p>
      </>
    ),
  },
  {
    pergunta: "Menores de idade precisam de um responsável?",
    resposta: (
      <>
        <p>
          Sim. Para menores de 18 anos, o formulário pede nome, telefone e CPF
          da mãe e do pai. Esses dados são usados para contato e segurança e não
          aparecem publicamente.
        </p>
        <p>
          Se a configuração familiar for diferente, como guarda unilateral ou
          ausência de um responsável, fale com a coordenação antes de preencher.
          Não invente dados. Veja também{" "}
          <Link href="/responsaveis" className={linkInline}>
            Para responsáveis
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    pergunta: "Preciso levar equipamento?",
    resposta: (
      <>
        <p>
          O projeto oferece pranchas e coletes durante as atividades. Leve
          roupa de banho, água, protetor solar e toalha.
        </p>
        <p>
          A disponibilidade de tamanhos é confirmada no local pela equipe.
        </p>
      </>
    ),
  },
  {
    pergunta: "Como posso apoiar o projeto?",
    resposta: (
      <>
        <p>
          Você pode doar materiais, apoiar financeiramente, ser voluntário ou
          construir uma parceria com sua empresa ou organização.
        </p>
        <p>
          Veja{" "}
          <Link href="/doacoes" className={linkInline}>
            Doações
          </Link>
          ,{" "}
          <Link href="/voluntariado" className={linkInline}>
            Voluntariado
          </Link>{" "}
          e{" "}
          <Link href="/parceiros" className={linkInline}>
            Parceiros
          </Link>
          . O WhatsApp e a chave Pix exibidos hoje são ilustrativos; a
          coordenação confirma os canais oficiais.
        </p>
      </>
    ),
  },
  {
    pergunta: "Como os dados e a privacidade são tratados?",
    resposta: (
      <>
        <p>
          Os dados informados no cadastro são usados para organizar as turmas,
          manter contato com a família, garantir a segurança nas atividades e
          enviar avisos do projeto. Ficam em ambiente restrito, com acesso
          limitado à coordenação, e não são vendidos nem usados para publicidade
          de terceiros.
        </p>
        <p>
          O consentimento é coletado no cadastro; para menores, o responsável
          autoriza. Você pode pedir acesso, correção ou remoção pelo contato.
          Mais detalhes em{" "}
          <Link href="/responsaveis#privacidade" className={linkInline}>
            Privacidade e LGPD
          </Link>
          .
        </p>
      </>
    ),
  },
];

export default function PaginaAjuda() {
  return (
    <>
      <Header />
      <main className="bg-cream">
        <PageHero
          kicker="Central de ajuda"
          titulo={
            <>
              Dúvidas?
              <br />
              A gente <span className="text-sun">explica.</span>
            </>
          }
          descricao="Do primeiro cadastro ao cuidado com os dados, reúna aqui as respostas mais comuns sobre o projeto."
        />

        <section className="py-14 md:py-20">
          <div className="container-x grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <Reveal className="lg:sticky lg:top-28">
              <aside>
                <span className="kicker text-sun-700">
                  <span className="h-px w-8 bg-sun-600" />
                  Perguntas frequentes
                </span>
                <h2 className="mt-4 font-display text-[clamp(2.2rem,4.5vw,3.6rem)] uppercase leading-[0.92] text-ink">
                  O básico,
                  <br />
                  sem letra miúda.
                </h2>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/65">
                  Se a sua dúvida não estiver aqui, fale com a coordenação pelo
                  Instagram ou pela seção de contato do site.
                </p>

                <div className="mt-6 rounded-3xl bg-ink p-6 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sun">
                    Ainda com dúvidas?
                  </p>
                  <p className="mt-2 font-display text-2xl uppercase leading-none">
                    Fale com a gente.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">
                    A coordenação responde sobre inscrição, rotina de treinos e
                    apoio ao projeto.
                  </p>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-sun mt-5 w-full"
                  >
                    <Instagram size={16} /> Instagram
                    <ArrowUpRight size={14} />
                  </a>
                  <Link href="/#contato" className="btn-ghost-light mt-3 w-full">
                    Ir para contato <ArrowRight size={16} />
                  </Link>
                  <p className="mt-4 text-xs leading-relaxed text-white/50">
                    O canal oficial de WhatsApp será confirmado pela
                    coordenação.
                  </p>
                </div>

                <Link
                  href="/responsaveis"
                  className="mt-4 flex min-h-[44px] items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white px-5 py-4 text-sm font-semibold text-ink transition hover:border-ink/30"
                >
                  Informações para responsáveis
                  <ArrowRight size={16} className="shrink-0 text-sun-700" />
                </Link>
              </aside>
            </Reveal>

            <div className="divide-y divide-ink/10 rounded-3xl border border-ink/10 bg-white px-5 sm:px-7">
              {faqs.map((faq) => (
                <details key={faq.pergunta} className="group">
                  <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-semibold text-ink outline-none transition hover:text-sun-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sun-700 [&::-webkit-details-marker]:hidden">
                    <span>{faq.pergunta}</span>
                    <ChevronDown
                      size={18}
                      className="shrink-0 text-ink/60 transition group-open:rotate-180 group-open:text-sun-700"
                    />
                  </summary>
                  <div className="space-y-3 pb-5 text-sm leading-relaxed text-ink/65">
                    {faq.resposta}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
