"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  Mail,
  Whatsapp,
} from "@/components/ui/Icons";

type Estado = "idle" | "carregando" | "sucesso" | "erro";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSecao() {
  const [email, setEmail] = useState("");
  const [consentimento, setConsentimento] = useState(false);
  const [estado, setEstado] = useState<Estado>("idle");
  const [mensagem, setMensagem] = useState("");

  function limparFeedback() {
    if (estado === "erro" || estado === "sucesso") {
      setEstado("idle");
      setMensagem("");
    }
  }

  async function aoEnviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (estado === "carregando") return;

    const emailLimpo = email.trim();
    setMensagem("");

    if (!EMAIL_REGEX.test(emailLimpo)) {
      setEstado("erro");
      setMensagem("Informe um e-mail válido para continuar.");
      return;
    }

    if (!consentimento) {
      setEstado("erro");
      setMensagem("Marque o consentimento para receber as novidades.");
      return;
    }

    setEstado("carregando");

    try {
      const resposta = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailLimpo, consentimento }),
      });
      const corpo = (await resposta.json().catch(() => ({}))) as {
        ok?: boolean;
        mensagem?: string;
        erro?: string;
      };

      if (!resposta.ok) {
        setEstado("erro");
        setMensagem(
          corpo.erro ?? "Não foi possível concluir o cadastro agora."
        );
        return;
      }

      setEstado("sucesso");
      setMensagem(
        corpo.mensagem ??
          "Pronto! Seu e-mail foi registrado para novidades futuras do projeto."
      );
      setEmail("");
      setConsentimento(false);
    } catch {
      setEstado("erro");
      setMensagem(
        "Não foi possível conectar. Verifique sua internet e tente novamente."
      );
    }
  }

  return (
    <section
      id="newsletter"
      aria-labelledby="newsletter-titulo"
      className="relative overflow-hidden border-t border-white/10 bg-ink py-16 text-white md:py-20"
    >
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-sun/10 blur-[100px]" />
      <div className="container-x relative grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div>
          <span className="kicker text-sun">
            <span className="h-px w-8 bg-sun" />
            Novidades
          </span>
          <h2
            id="newsletter-titulo"
            className="mt-4 font-display text-[clamp(2.4rem,5vw,4.2rem)] uppercase leading-[0.92]"
          >
            Novidades
            <br />
            <span className="text-sun">no seu e-mail.</span>
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/65 sm:text-base">
            Uma lista simples para avisar quando a coordenação tiver novidades
            futuras. Este cadastro não é uma inscrição de atleta e não gera
            cobrança.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-start gap-3">
              <Whatsapp size={18} className="mt-0.5 shrink-0 text-sun" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Prefere falar direto?
                </p>
                <Link
                  href="/#contato"
                  className="mt-1 inline-flex min-h-[24px] items-center gap-1.5 text-sm font-semibold text-sun underline-offset-4 hover:underline"
                >
                  Falar no WhatsApp <ArrowRight size={14} />
                </Link>
                <p className="mt-1 text-xs leading-relaxed text-white/55">
                  A conversa é direta com a coordenação. Não há broadcast
                  automático nem disparo de mensagens por esta lista.
                </p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={aoEnviar}
          noValidate
          aria-busy={estado === "carregando"}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"
        >
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-sun">
            <Mail size={14} /> Lista de novidades
          </p>

          <div className="mt-5">
            <label
              htmlFor="newsletter-email"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/70"
            >
              Seu e-mail
            </label>
            <input
              id="newsletter-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              required
              value={email}
              onChange={(evento) => {
                setEmail(evento.target.value);
                limparFeedback();
              }}
              placeholder="voce@email.com"
              aria-describedby="newsletter-privacidade newsletter-status"
              className="w-full rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/55 focus:border-sun focus:ring-4 focus:ring-sun/20"
            />
          </div>

          <div className="mt-4 flex items-start gap-3">
            <input
              id="newsletter-consentimento"
              type="checkbox"
              required
              checked={consentimento}
              onChange={(evento) => {
                setConsentimento(evento.target.checked);
                limparFeedback();
              }}
              className="mt-0.5 h-6 w-6 shrink-0 cursor-pointer accent-sun focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun"
            />
            <label
              htmlFor="newsletter-consentimento"
              className="cursor-pointer text-xs leading-relaxed text-white/70"
            >
              Quero receber novidades futuras do projeto por e-mail. Entendo
              que este cadastro não é uma inscrição de atleta e que ainda não
              há envio automático de newsletters.
            </label>
          </div>

          <p
            id="newsletter-privacidade"
            className="mt-3 text-[11px] leading-relaxed text-white/55"
          >
            Usamos o e-mail apenas para novidades futuras. Para pedir acesso,
            correção ou remoção, fale com a coordenação. Veja como tratamos
            dados em{" "}
            <Link
              href="/responsaveis#privacidade"
              className="font-semibold text-sun underline underline-offset-2"
            >
              Privacidade e LGPD
            </Link>
            .
          </p>

          <button
            type="submit"
            disabled={estado === "carregando"}
            className="btn-sun mt-6 w-full justify-center"
          >
            {estado === "carregando"
              ? "Enviando..."
              : "Quero receber novidades"}
            {estado !== "carregando" && <ArrowRight size={16} />}
          </button>

          <div
            id="newsletter-status"
            aria-live="polite"
            aria-atomic="true"
            className="mt-4 min-h-[20px]"
          >
            {mensagem && (
              <p
                className={
                  estado === "erro"
                    ? "text-sm leading-relaxed text-red-200"
                    : "flex items-start gap-2 text-sm leading-relaxed text-emerald-200"
                }
              >
                {estado === "sucesso" && (
                  <Check size={16} className="mt-0.5 shrink-0" />
                )}
                <span>{mensagem}</span>
              </p>
            )}
          </div>

          <p className="mt-2 text-[10px] leading-relaxed text-white/50">
            A lista é para novidades futuras. Não há promessa de frequência nem
            envio imediato.
          </p>
        </form>
      </div>
    </section>
  );
}
