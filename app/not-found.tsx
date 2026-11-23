import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { ArrowLeft, ArrowRight, Newspaper } from "@/components/ui/Icons";

export default function NaoEncontrado() {
  return (
    <main className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6 py-16 text-center text-white">
      <Image
        src="/img/hero.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/60" />

      <div className="relative z-10 flex flex-col items-center">
        <Link href="/">
          <Logo priority />
        </Link>

        <p className="mt-12 text-[10px] font-bold uppercase tracking-[0.3em] text-sun">
          Erro 404
        </p>
        <h1 className="mt-4 font-display text-[clamp(3.2rem,10vw,7rem)] uppercase leading-[0.88]">
          Essa onda
          <br />
          não existe.
        </h1>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60">
          A página que você procura pode ter mudado de lugar ou nunca ter
          existido. Volte para a areia e escolha outro caminho.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn-sun">
            <ArrowLeft size={16} /> Voltar ao início
          </Link>
          <Link href="/noticias" className="btn-ghost-light">
            <Newspaper size={16} /> Ver notícias
          </Link>
        </div>

        <Link
          href="/atletas"
          className="mt-8 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 transition hover:text-white"
        >
          Área do atleta <ArrowRight size={12} />
        </Link>
      </div>
    </main>
  );
}
