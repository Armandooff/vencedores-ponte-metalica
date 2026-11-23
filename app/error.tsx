"use client";

import Link from "next/link";
import { useEffect } from "react";
import Logo from "@/components/ui/Logo";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icons";

export default function Erro({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 py-16 text-center text-white">
      <Logo />
      <p className="mt-12 text-[10px] font-bold uppercase tracking-[0.3em] text-sun">
        Algo saiu da rota
      </p>
      <h1 className="mt-4 max-w-2xl font-display text-[clamp(2.8rem,7vw,5rem)] uppercase leading-[0.9]">
        Deu uma onda
        <br />
        por aqui.
      </h1>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60">
        Não foi possível carregar esta página. Tente novamente — se o problema
        continuar, fale com a coordenação do projeto.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={reset} className="btn-sun">
          Tentar de novo <ArrowRight size={16} />
        </button>
        <Link href="/" className="btn-ghost-light">
          <ArrowLeft size={16} /> Voltar ao início
        </Link>
      </div>
    </main>
  );
}
