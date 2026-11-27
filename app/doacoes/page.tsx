import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Reveal from "@/components/ui/Reveal";
import CopiarPix from "@/components/doacoes/CopiarPix";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Heart,
  Instagram,
  Package,
  QrCode,
  Whatsapp,
} from "@/components/ui/Icons";

const WHATSAPP_NUMERO = "(85) 99999-0000";
const WHATSAPP_LINK =
  "https://wa.me/5585999990000?text=" +
  encodeURIComponent(
    "Olá! Quero doar materiais para o projeto Vencedores da Ponte Metálica."
  );
const PIX_CHAVE = "doacoes@exemplo.com";

export const metadata: Metadata = {
  title: "Doações",
  description:
    "Ajude o projeto Vencedores da Ponte Metálica com materiais de bodyboard ou uma doação em dinheiro via Pix.",
};

const materiais = [
  "Pranchas de bodyboard em bom estado",
  "Coletes, lycras e nadadeiras",
  "Equipamentos de segurança",
  "Materiais de apoio para os treinos",
];

export default function PaginaDoacoes() {
  return (
    <>
      <Header />
      <main className="bg-cream">
        <section className="relative isolate overflow-hidden bg-ink pb-20 pt-36 text-white">
          <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-sun/20 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-sun/10 blur-3xl" />
          <div className="container-x relative">
            <span className="kicker text-sun">
              <span className="h-px w-8 bg-sun" />
              Apoie o projeto
            </span>
            <h1 className="mt-5 max-w-4xl font-display text-[clamp(3rem,7vw,6.5rem)] uppercase leading-[0.88]">
              Toda ajuda
              <br />
              <span className="text-sun">vira onda.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70">
              O Vencedores da Ponte Metálica é gratuito para as famílias. Sua
              doação ajuda a manter pranchas, coletes e treinos na areia da
              Praia de Iracema.
            </p>
          </div>
        </section>

        <section className="container-x -mt-10 pb-24">
          <Reveal>
            <div
              role="note"
              className="rounded-2xl border border-amber-300/60 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-900 shadow-card"
            >
              <strong className="font-semibold">Dados de exemplo.</strong> O
              WhatsApp e a chave Pix desta página são fictícios, para
              demonstração. Substitua pelos dados oficiais do projeto antes de
              divulgar.
            </div>
          </Reveal>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <article className="flex h-full flex-col rounded-[2rem] border border-ink/10 bg-white p-7 shadow-card sm:p-9">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sun/10 text-sun-700">
                  <Package size={24} />
                </div>
                <span className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-sun-700">
                  Doação de materiais
                </span>
                <h2 className="mt-2 font-display text-3xl uppercase leading-none text-ink">
                  Doe equipamento.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ink/65">
                  Pranchas, coletes e acessórios em bom estado viram ferramenta
                  de treino para crianças e jovens do projeto.
                </p>

                <ul className="mt-6 space-y-3">
                  {materiais.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-ink/70"
                    >
                      <Check size={16} className="mt-0.5 shrink-0 text-sun-700" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-sun w-full justify-center"
                  >
                    <Whatsapp size={18} /> Falar no WhatsApp
                  </a>
                  <p className="mt-3 text-center text-xs text-ink/65">
                    {WHATSAPP_NUMERO} · mensagem pronta para doação
                  </p>
                </div>
              </article>
            </Reveal>

            <Reveal delay={100}>
              <article className="flex h-full flex-col rounded-[2rem] border border-ink/10 bg-white p-7 shadow-card sm:p-9">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sun/10 text-sun-700">
                  <Heart size={24} />
                </div>
                <span className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-sun-700">
                  Doação em dinheiro
                </span>
                <h2 className="mt-2 font-display text-3xl uppercase leading-none text-ink">
                  Doe via Pix.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ink/65">
                  Qualquer valor ajuda a manter equipamentos, segurança e
                  acompanhamento técnico para a comunidade.
                </p>

                <div className="mt-6 rounded-2xl border border-ink/10 bg-cream/60 p-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ink/70">
                    <QrCode size={14} /> Chave Pix de exemplo
                  </div>
                  <p className="mt-2 break-all font-mono text-sm font-semibold text-ink">
                    {PIX_CHAVE}
                  </p>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_180px] sm:items-center">
                  <CopiarPix chave={PIX_CHAVE} />
                  <div className="mx-auto w-full max-w-[180px] rounded-2xl border border-ink/10 bg-white p-3">
                    <Image
                      src="/img/pix-qr.png"
                      alt="QR Code Pix de exemplo para doações"
                      width={512}
                      height={512}
                      className="h-auto w-full"
                    />
                  </div>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-ink/65">
                  QR Code ilustrativo. Aponte a câmera do banco para conferir o
                  destinatário antes de confirmar. Substitua a chave pela Pix
                  oficial do projeto.
                </p>
              </article>
            </Reveal>
          </div>

          <Reveal delay={140}>
            <section
              aria-labelledby="doacao-recorrente"
              className="mt-8 overflow-hidden rounded-[2rem] border border-sun/30 bg-white shadow-card"
            >
              <div className="grid gap-8 p-7 sm:p-9 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <div>
                  <span className="kicker text-sun-700">
                    <span className="h-px w-8 bg-sun-600" />
                    Doação recorrente
                  </span>
                  <h2
                    id="doacao-recorrente"
                    className="mt-3 font-display text-3xl uppercase leading-none text-ink sm:text-4xl"
                  >
                    Quero doar todo mês.
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/65">
                    A recorrência ainda não tem cobrança automática nesta
                    página. Se você quiser apoiar o projeto mensalmente,
                    converse com a coordenação para combinar a forma de envio,
                    a frequência e o acompanhamento. Nenhum valor é cobrado e
                    nenhum cartão é solicitado aqui.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/#contato" className="btn-ink">
                      Conversar com a coordenação{" "}
                      <ArrowRight size={16} />
                    </Link>
                    <a
                      href="https://www.instagram.com/vencedorespontemetalica/"
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost-dark"
                    >
                      <Instagram size={16} /> Falar no Instagram
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-ink/60">
                    O canal oficial de WhatsApp será confirmado pela
                    coordenação.
                  </p>
                </div>

                <div className="rounded-2xl bg-cream p-5 sm:p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sun-700">
                    Como funciona
                  </p>
                  <ol className="mt-4 space-y-4">
                    {[
                      "Você conversa com a coordenação e conta que quer apoiar mensalmente.",
                      "A forma de envio, a frequência e o acompanhamento são combinados diretamente.",
                      "O projeto confirma o recebimento pelos canais oficiais.",
                    ].map((item, indice) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-relaxed text-ink/70"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sun text-[10px] font-bold text-ink">
                          {indice + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ol>
                  <p className="mt-5 border-t border-ink/10 pt-4 text-xs leading-relaxed text-ink/60">
                    Sem gateway, sem cadastro de cartão e sem promessa de
                    cobrança automática nesta página.
                  </p>
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-[2rem] bg-ink p-7 text-white sm:flex-row sm:items-center sm:p-9">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sun">
                  Outras formas de ajudar
                </p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65">
                  Compartilhe o projeto com a sua rede, acompanhe os treinos e
                  converse com a gente pelo Instagram.
                </p>
              </div>
              <a
                href="https://www.instagram.com/vencedorespontemetalica/"
                target="_blank"
                rel="noreferrer"
                className="btn-ghost-light w-full justify-center sm:w-auto sm:shrink-0"
              >
                <Instagram size={16} />
                <span className="sm:hidden">Instagram</span>
                <span className="hidden sm:inline">
                  @vencedorespontemetalica
                </span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
