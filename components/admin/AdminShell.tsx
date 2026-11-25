"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/lib/auth";
import { useDados } from "@/lib/store";
import { SITE_URL } from "@/lib/app-urls";
import {
  Calendar,
  ExternalLink,
  Home,
  LayoutGrid,
  LogOut,
  Menu,
  Newspaper,
  Users,
  X,
} from "@/components/ui/Icons";

const navegacao = [
  { href: "/admin", label: "Visão geral", icone: Home },
  { href: "/admin/atletas", label: "Atletas", icone: Users },
  { href: "/admin/noticias", label: "Notícias", icone: Newspaper },
  { href: "/admin/agenda", label: "Agenda", icone: Calendar },
];

const titulos: Record<string, string> = {
  "/admin": "Visão geral",
  "/admin/atletas": "Atletas",
  "/admin/noticias": "Notícias",
  "/admin/agenda": "Agenda",
};

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { sessao, pronto, sair } = useAuth();
  const { db } = useDados();
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    if (!pronto) return;
    if (!sessao || sessao.tipo !== "admin") {
      router.replace("/admin/login");
    }
  }, [pronto, sessao, router]);

  useEffect(() => {
    setMenuAberto(false);
  }, [pathname]);

  if (!pronto || !sessao || sessao.tipo !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink text-white">
        <Logo priority />
        <span className="h-1 w-24 overflow-hidden rounded-full bg-white/10">
          <span className="block h-full w-1/2 animate-pulse rounded-full bg-sun" />
        </span>
      </div>
    );
  }

  const pendentes = db.atletas.filter((a) => a.status === "pendente").length;
  const titulo = titulos[pathname] ?? "Painel";

  const linkAtivo = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  const menu = (
    <>
      <div className="px-6 py-6">
        <Link href="/admin">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navegacao.map((item) => {
          const Icone = item.icone;
          const ativo = linkAtivo(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={ativo ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                ativo
                  ? "bg-sun text-ink"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icone size={18} />
              {item.label}
              {item.href === "/admin/atletas" && pendentes > 0 && (
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    ativo ? "bg-ink/15 text-ink" : "bg-sun/15 text-sun"
                  }`}
                >
                  {pendentes}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        <Link
          href={SITE_URL}
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={18} />
          Ver site
        </Link>
        <button
          type="button"
          onClick={() => {
            sair();
            router.replace("/admin/login");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sun text-ink">
            <LayoutGrid size={16} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white">
              Equipe Vencedores
            </p>
            <p className="text-[10px] uppercase tracking-wider text-white/60">
              Administrador
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F3EFE7]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-ink text-white lg:flex">
        {menu}
      </aside>

      {menuAberto && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMenuAberto(false)}
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
          />
          <aside className="relative flex h-full w-72 flex-col bg-ink text-white">
            <button
              type="button"
              onClick={() => setMenuAberto(false)}
              className="absolute right-4 top-6 rounded-full border border-white/20 p-2 text-white/70"
              aria-label="Fechar menu"
            >
              <X size={16} />
            </button>
            {menu}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-ink/10 bg-[#F3EFE7]/90 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-4 px-5 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMenuAberto(true)}
                className="rounded-lg border border-ink/15 p-2 text-ink/70 lg:hidden"
                aria-label="Abrir menu"
              >
                <Menu size={18} />
              </button>
              <h1 className="font-display text-xl uppercase leading-none text-ink">
                {titulo}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {pendentes > 0 && (
                <Link
                  href="/admin/atletas?status=pendente"
                  className="hidden items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 sm:flex"
                >
                  {pendentes} pendente{pendentes > 1 ? "s" : ""}
                </Link>
              )}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-sm text-sun">
                EV
              </span>
            </div>
          </div>
        </header>

        <main className="px-5 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
