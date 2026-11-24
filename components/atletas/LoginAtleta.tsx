"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { ADMIN_EMAIL, useAuth } from "@/lib/auth";
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Instagram,
  Lock,
  Mail,
  Shield,
} from "@/components/ui/Icons";

export default function LoginAtleta() {
  const router = useRouter();
  const { entrarAtleta, sessao, pronto } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [erroAdmin, setErroAdmin] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (pronto && sessao?.tipo === "atleta") {
      router.replace("/atletas/painel");
    }
  }, [pronto, sessao, router]);

  const aoEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setErroAdmin(false);
    setEnviando(true);

    if (email.trim().toLowerCase() === ADMIN_EMAIL) {
      setErro(
        "Este e-mail é da coordenação do projeto. O acesso administrativo fica em outro painel."
      );
      setErroAdmin(true);
      setEnviando(false);
      return;
    }

    const resultado = entrarAtleta(email, senha);
    if (!resultado.ok) {
      setErro(resultado.erro ?? "Não foi possível entrar.");
      setEnviando(false);
      return;
    }
    router.push("/atletas/painel");
  };

  return (
    <div className="min-h-screen bg-ink text-white lg:grid lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/img/comunidade.jpg"
          alt="Famílias e atletas do projeto na praia"
          fill
          priority
          sizes="55vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/40 to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-between p-10">
          <Link href="/">
            <Logo priority />
          </Link>

          <div className="max-w-md">
            <span className="kicker text-sun">
              <span className="h-px w-8 bg-sun" />
              Área do atleta
            </span>
            <p className="mt-5 font-display text-4xl uppercase leading-[0.95] xl:text-5xl">
              Aqui a sua
              <br />
              evolução
              <br />
              <span className="text-sun">continua.</span>
            </p>
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              Acompanhe novidades, treinos e o status da sua inscrição. Um
              espaço feito para atletas e famílias do projeto.
            </p>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
            Praia de Iracema · Fortaleza · CE
          </p>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <Link href="/">
              <Logo priority />
            </Link>
          </div>

          <div className="mt-10 lg:mt-0">
            <p className="kicker text-sun">Bem-vindo de volta</p>
            <h1 className="mt-3 font-display text-4xl uppercase leading-none sm:text-5xl">
              Entrar no portal
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Use o e-mail e a senha cadastrados na inscrição do atleta.
            </p>
          </div>

          <form onSubmit={aoEnviar} className="mt-8 space-y-4">
            <div>
              <label className="field-label !text-white/50" htmlFor="email">
                E-mail
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/60"
                />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                  className="input-dark pl-11"
                />
              </div>
            </div>

            <div>
              <label className="field-label !text-white/50" htmlFor="senha">
                Senha
              </label>
              <div className="relative">
                <Lock
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/60"
                />
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Sua senha"
                  className="input-dark px-11"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/60 transition hover:text-white"
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {erro && (
              <div
                role="alert"
                className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200"
              >
                <p>{erro}</p>
                {erroAdmin && (
                  <Link
                    href="/admin/login"
                    className="mt-2 inline-flex items-center gap-1.5 font-semibold text-white underline decoration-white/40 underline-offset-4 transition hover:decoration-white"
                  >
                    Ir para o painel administrativo <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="btn-sun w-full"
            >
              {enviando ? "Entrando..." : "Entrar"}
              {!enviando && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-sun">
              <Shield size={14} /> Conta de demonstração
            </p>
            <p className="mt-2 text-xs leading-relaxed text-white/50">
              E-mail: <span className="text-white/80">atleta@demo.com</span>
              <br />
              Senha: <span className="text-white/80">123456</span>
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-white/50">
            É da coordenação?{" "}
            <Link
              href="/admin/login"
              className="font-semibold text-sun transition hover:text-sun-400"
            >
              Acessar o painel administrativo
            </Link>
          </p>

          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-white/50">
              Ainda não tem conta?{" "}
              <Link
                href="/cadastro"
                className="font-semibold text-sun transition hover:text-sun-400"
              >
                Inscrever atleta
              </Link>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between text-[11px] uppercase tracking-wider text-white/60">
            <Link href="/" className="inline-flex items-center gap-1.5 transition hover:text-white">
              <ArrowLeft size={13} /> Voltar ao site
            </Link>
            <a
              href="https://www.instagram.com/vencedorespontemetalica/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition hover:text-white"
            >
              <Instagram size={13} /> Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
