"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useDados } from "@/lib/store";
import { classesCategoria, formatarData } from "@/lib/format";
import Reveal from "@/components/ui/Reveal";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";

export default function NoticiasPreview() {
  const { db } = useDados();

  const noticias = useMemo(() => {
    return [...db.noticias]
      .filter((n) => n.publicada)
      .sort((a, b) => b.publicadoEm.localeCompare(a.publicadoEm))
      .slice(0, 3);
  }, [db.noticias]);

  if (noticias.length === 0) return null;

  return (
    <section className="bg-[#EFE6D8] py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal>
            <span className="kicker text-sun-700">
              <span className="h-px w-8 bg-sun-600" />
              Notícias & novidades
            </span>
            <h2 className="mt-5 font-display text-[clamp(2.6rem,5vw,4.6rem)] uppercase leading-[0.92] text-ink">
              O que está rolando
              <br />
              no projeto.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <Link
              href="/noticias"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ink/70 transition hover:text-ink"
            >
              Ver todas as notícias
              <ArrowRight
                size={15}
                className="text-sun-600 transition group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {noticias.map((noticia, i) => (
            <Reveal key={noticia.id} delay={i * 90}>
              <Link
                href="/noticias"
                className="group block h-full overflow-hidden rounded-2xl border border-ink/10 bg-cream-50 transition hover:-translate-y-1 hover:shadow-card"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={noticia.imagem}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span
                    className={`absolute left-4 top-4 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${classesCategoria(
                      noticia.categoria
                    )}`}
                  >
                    {noticia.categoria}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/60">
                    {formatarData(noticia.publicadoEm)}
                  </p>
                  <h3 className="mt-3 font-display text-xl uppercase leading-tight text-ink">
                    {noticia.titulo}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink/60">
                    {noticia.resumo}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-sun-700">
                    Ler notícia
                    <ArrowUpRight size={13} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
