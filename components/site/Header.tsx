"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";
import { ArrowUpRight, Instagram, Menu, X } from "@/components/ui/Icons";

const links = [
  { href: "/#projeto", label: "Projeto" },
  { href: "/#treinos", label: "Treinos" },
  { href: "/#galeria", label: "Galeria" },
  { href: "/agenda", label: "Agenda" },
  { href: "/noticias", label: "Notícias" },
  { href: "/doacoes", label: "Doações" },
];

export default function Header() {
  const pathname = usePathname();
  const [solido, setSolido] = useState(false);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const aoRolar = () => setSolido(window.scrollY > 24);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  useEffect(() => {
    setAberto(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  const transparente = pathname === "/" && !solido && !aberto;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          transparente
            ? "bg-gradient-to-b from-ink/70 to-transparent"
            : "border-b border-white/10 bg-ink/90 backdrop-blur-xl"
        }`}
      >
        <div className="container-x flex h-20 items-center justify-between gap-6">
          <Link href="/" className="shrink-0">
            <Logo priority />
          </Link>

          <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-[13px] font-medium text-white/70 transition hover:text-sun"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/atletas"
              className="whitespace-nowrap rounded-full border border-white/25 px-3.5 py-2.5 text-[12px] font-bold uppercase tracking-wide text-white transition hover:border-white/60 hover:bg-white/10 xl:px-4"
            >
              Área do atleta
            </Link>
            <Link
              href="/cadastro"
              className="whitespace-nowrap rounded-full bg-sun px-3.5 py-2.5 text-[12px] font-bold uppercase tracking-wide text-ink transition hover:bg-sun-400 xl:px-4"
            >
              Inscrever atleta
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setAberto(true)}
            className="rounded-full border border-white/25 p-2.5 text-white md:hidden"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {aberto && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-ink px-6 py-6 md:hidden">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={() => setAberto(false)}
              className="rounded-full border border-white/25 p-2.5 text-white"
              aria-label="Fechar menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="mt-14 flex flex-col gap-2">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setAberto(false)}
                className="group flex items-center justify-between border-b border-white/10 py-4"
              >
                <span className="font-display text-4xl uppercase leading-none text-white transition group-hover:text-sun">
                  {link.label}
                </span>
                <span
                  aria-hidden="true"
                  className="text-xs font-bold text-white/50"
                >
                  0{i + 1}
                </span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-3">
            <Link
              href="/cadastro"
              onClick={() => setAberto(false)}
              className="btn-sun w-full"
            >
              Inscrever atleta
            </Link>
            <Link
              href="/atletas"
              onClick={() => setAberto(false)}
              className="btn-ghost-light w-full"
            >
              Área do atleta
            </Link>
            <a
              href="https://www.instagram.com/vencedorespontemetalica/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 pt-2 text-xs font-semibold uppercase tracking-widest text-white/50"
            >
              <Instagram size={16} /> @vencedorespontemetalica
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
