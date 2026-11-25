"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { useAuth, ADMIN_EMAIL, ADMIN_SENHA } from "@/lib/auth";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LayoutGrid,
  Lock,
  Mail,
  Shield,
} from "@/components/ui/Icons";

export default function AdminLogin() {
  const router = useRouter();
  const { entrarAdmin, sessao, pronto } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (pronto && sessao?.tipo === "admin") {
      router.replace("/admin");
    }
  }, [pronto, sessao, router]);

  const aoEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const resultado = await entrarAdmin(email, senha);
      if (!resultado.ok) {
        setErro(resultado.erro ?? "Não foi possível entrar.");
        return;
      }
      router.push("/admin");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-ink text-white lg:grid-cols-2">
      <div className="noise relative hidden flex-col justify-between overflow-hidden bg-sun p-10 text-ink lg:flex">
        <Image
          src="/img/ponte.jpg"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-25 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sun via-sun/70 to-sun/40" />

        <div className="relative z-10">
          <Logo variant="dark" priority />
        </div>

        <div className="relative z-10 max-w-md">
          <span className="kicker text-ink/60">
            <span className="h-px w-8 bg-ink/40" />
            Painel administrativo
          </span>
          <h1 className="mt-5 font-display text-5xl uppercase leading-[0.9] xl:text-6xl">
            Quem faz
            <br />
            acontecer,
            <br />
            vê tudo.
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink/70">
            Gerencie inscrições, aprove atletas, publique notícias e organize a
            agenda do projeto em um só lugar.
          </p>
        </div>

        <div className="relative z-10 flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/65">
          <span>Atletas</span>
          <span>Notícias</span>
          <span>Agenda</span>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <Logo priority />
          </div>

          <div className="mt-10 lg:mt-0">
            <span className="kicker text-sun">
              <LayoutGrid size={14} /> Acesso restrito
            </span>
            <h2 className="mt-3 font-display text-4xl uppercase leading-none sm:text-5xl">
              Entrar no painel
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Área exclusiva da coordenação do projeto.
            </p>
          </div>

          <form onSubmit={aoEnviar} className="mt-8 space-y-4">
            <div>
              <label className="field-label !text-white/50" htmlFor="admin-email">
                E-mail
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/60"
                />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vencedorespontemetalica.com"
                  className="input-dark pl-11"
                />
              </div>
            </div>

            <div>
              <label className="field-label !text-white/50" htmlFor="admin-senha">
                Senha
              </label>
              <div className="relative">
                <Lock
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/60"
                />
                <input
                  id="admin-senha"
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
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="btn-sun w-full disabled:opacity-60"
            >
              {enviando ? "Entrando..." : "Entrar no painel"}
              {!enviando && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-sun">
              <Shield size={14} /> Acesso de demonstração
            </p>
            <p className="mt-2 break-all text-xs leading-relaxed text-white/50">
              {ADMIN_EMAIL}
              <br />
              Senha: <span className="text-white/80">{ADMIN_SENHA}</span>
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-white/50">
            É atleta?{" "}
            <Link
              href="/atletas"
              className="font-semibold text-sun transition hover:text-sun-400"
            >
              Entrar no portal do atleta
            </Link>
          </p>

          <div className="mt-8 border-t border-white/10 pt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white/60 transition hover:text-white"
            >
              <ArrowLeft size={13} /> Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
