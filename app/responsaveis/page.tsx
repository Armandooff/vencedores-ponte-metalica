import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/ui/Reveal";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Image as ImageIcon,
  Instagram,
  Lock,
  Shield,
  User,
} from "@/components/ui/Icons";

const INSTAGRAM_URL = "https://www.instagram.com/vencedorespontemetalica/";

export const metadata: Metadata = {
  title: "Para responsáveis",
  description:
    "Informações para mães, pais e responsáveis sobre o portal do atleta, dados de menores, consentimento, LGPD e uso de imagem no Vencedores da Ponte Metálica.",
  alternates: { canonical: "/responsaveis" },
};

const resumo = [
  "O portal é acessado com a conta criada na inscrição do atleta.",
  "Não existe login separado para responsáveis nesta versão.",
  "Dados de menores não aparecem publicamente.",
  "O uso de imagem é tratado separadamente com a coordenação.",
];

export default function PaginaResponsaveis() {
  return (
    <>
      <Header />
      <main className="bg-cream">
        <PageHero
          kicker="Para responsáveis"
          titulo={
            <>
              Para quem
              <br />
              <span className="text-sun">cuida.</span>
            </>
          }
          descricao="Informações sobre o portal do atleta, dados de menores, consentimento e privacidade para mães, pais e responsáveis."
        />

        <section className="py-14 md:py-20">
          <div className="container-x grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <Reveal className="lg:sticky lg:top-28">
              <aside>
                <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-card">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sun/15 text-sun-700">
                    <Shield size={23} />
                  </span>
                  <h2 className="mt-5 font-display text-2xl uppercase leading-none text-ink">
                    Resumo rápido
                  </h2>
                  <ul className="mt-5 space-y-3">
                    {resumo.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/70"
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

                <div className="mt-4 rounded-3xl bg-ink p-6 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sun">
                    Precisa de ajuda?
                  </p>
                  <p className="mt-2 font-display text-2xl uppercase leading-none">
                    Fale com a coordenação.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">
                    Para atualizar dados, retirar um consentimento ou tirar
                    dúvidas sobre o atleta.
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
                  href="/ajuda"
                  className="mt-4 flex min-h-[44px] items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white px-5 py-4 text-sm font-semibold text-ink transition hover:border-ink/30"
                >
                  Central de ajuda
                  <ArrowRight size={16} className="shrink-0 text-sun-700" />
                </Link>
              </aside>
            </Reveal>

            <div className="space-y-12">
              <Reveal as="section">
                <div id="portal">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sun/15 text-sun-700">
                      <User size={20} />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-sun-700">
                      Portal do atleta
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] uppercase leading-[0.95] text-ink">
                    Uma conta, nenhuma área separada.
                  </h2>
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-ink/70">
                    <p>
                      O acesso à área do atleta é feito com o e-mail e a senha
                      criados na inscrição. É por ali que o atleta acompanha o
                      status da inscrição, vê os eventos e atualiza telefone,
                      história e foto.
                    </p>
                    <p>
                      Não existe uma área de login separada para mães, pais ou
                      responsáveis nesta versão. O responsável pode acompanhar
                      o atleta usando a conta dele, com o conhecimento do
                      atleta, ou falar diretamente com a coordenação.
                    </p>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link href="/atletas" className="btn-ink">
                      Entrar na área do atleta <ArrowRight size={16} />
                    </Link>
                    <Link href="/cadastro" className="btn-ghost-dark">
                      Fazer inscrição
                    </Link>
                  </div>
                </div>
              </Reveal>

              <Reveal as="section">
                <div id="dados" className="scroll-mt-28">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sun/15 text-sun-700">
                      <Shield size={20} />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-sun-700">
                      Dados de menores
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] uppercase leading-[0.95] text-ink">
                    Por que pedimos o CPF dos pais?
                  </h2>
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-ink/70">
                    <p>
                      Para atletas menores de 18 anos, o cadastro pede nome,
                      telefone e CPF da mãe e do pai. Esses dados fazem parte da
                      ficha de identificação usada pela coordenação para
                      contato e segurança durante as atividades.
                    </p>
                    <p>
                      As informações de menores não aparecem no site e não são
                      exibidas para outros atletas. Se a configuração familiar
                      for diferente, como guarda unilateral ou ausência de um
                      responsável, fale com a coordenação antes de preencher.
                      Não use dados de outra pessoa.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal as="section">
                <div id="privacidade" className="scroll-mt-28">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sun/15 text-sun-700">
                      <Lock size={20} />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-sun-700">
                      Privacidade e LGPD
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] uppercase leading-[0.95] text-ink">
                    Consentimento com finalidade.
                  </h2>
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-ink/70">
                    <p>
                      O cadastro coleta o consentimento para uso dos dados na
                      participação do projeto. A finalidade é organizar as
                      turmas, manter contato com a família, garantir a segurança
                      nas atividades e enviar avisos do projeto.
                    </p>
                    <p>
                      Os dados ficam em ambiente restrito, com acesso limitado à
                      coordenação, e não são vendidos nem usados para publicidade
                      de terceiros. O projeto trata as informações conforme as
                      orientações da LGPD.
                    </p>
                    <p>
                      Você pode pedir confirmação, acesso, correção ou remoção
                      dos dados pelo contato. Para retirar um consentimento,
                      fale com a coordenação; a equipe explica os efeitos da
                      retirada. Se o pedido envolver um atleta menor, a
                      coordenação pode confirmar o vínculo do responsável.
                    </p>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ink/65">
                    Mais respostas na{" "}
                    <Link
                      href="/ajuda"
                      className="font-semibold text-sun-700 underline underline-offset-2 hover:text-ink"
                    >
                      Central de ajuda
                    </Link>
                    .
                  </p>
                </div>
              </Reveal>

              <Reveal as="section">
                <div id="imagem" className="scroll-mt-28">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sun/15 text-sun-700">
                      <ImageIcon size={20} />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-sun-700">
                      Consentimento de imagem
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] uppercase leading-[0.95] text-ink">
                    Imagem é uma autorização à parte.
                  </h2>
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-ink/70">
                    <p>
                      O consentimento de dados do cadastro não é a mesma coisa
                      que autorização para usar a imagem do atleta em
                      divulgação. Fotos de atletas menores só devem ser
                      divulgadas com autorização do responsável.
                    </p>
                    <p>
                      A autorização para divulgação é tratada separadamente com
                      a coordenação. Se você não quer a imagem do atleta em
                      publicações, informe a equipe. Também é possível pedir a
                      remoção de conteúdo já publicado; a coordenação analisa o
                      pedido.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal as="section">
                <div id="atualizar" className="scroll-mt-28">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sun/15 text-sun-700">
                      <Check size={20} />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-sun-700">
                      Atualização de dados
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] uppercase leading-[0.95] text-ink">
                    Mantenha a ficha em dia.
                  </h2>
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-ink/70">
                    <p>
                      O atleta pode atualizar telefone, história e foto pela
                      área do atleta. Nome, e-mail, CPF, data de nascimento,
                      categoria e dados dos responsáveis passam pela
                      coordenação.
                    </p>
                    <p>
                      Para mudar um dado de responsável ou corrigir uma
                      informação da ficha, fale com a coordenação pelo Instagram
                      ou pela seção de contato. Não compartilhe a senha do
                      portal com outras pessoas.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
