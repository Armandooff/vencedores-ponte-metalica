"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useDados } from "@/lib/store";
import {
  classesCategoria,
  formatarData,
  rotuloCategoria,
} from "@/lib/format";
import type { CategoriaNoticia, Noticia } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import {
  ArrowRight,
  Bell,
  Newspaper,
  Search,
} from "@/components/ui/Icons";

const categorias: ("Todas" | CategoriaNoticia)[] = [
  "Todas",
  "Aviso",
  "Treino",
  "Competição",
  "Comunidade",
  "Notícia",
];

export default function NoticiasLista() {
  const { db } = useDados();
  const [categoria, setCategoria] = useState<(typeof categorias)[number]>("Todas");
  const [busca, setBusca] = useState("");
  const [aberta, setAberta] = useState<Noticia | null>(null);

  const noticias = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return [...db.noticias]
      .filter((n) => n.publicada)
      .filter((n) => categoria === "Todas" || n.categoria === categoria)
      .filter(
        (n) =>
          !termo ||
          n.titulo.toLowerCase().includes(termo) ||
          n.resumo.toLowerCase().includes(termo)
      )
      .sort((a, b) => {
        if (a.destaque !== b.destaque) return a.destaque ? -1 : 1;
        return b.publicadoEm.localeCompare(a.publicadoEm);
      });
  }, [db.noticias, categoria, busca]);

  const total = db.noticias.filter((n) => n.publicada).length;

  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-16 pt-32 text-white">
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-sun/15 blur-[100px]" />
        <div className="container-x relative">
          <span className="kicker text-sun">
            <span className="h-px w-8 bg-sun" />
            Notícias & novidades
          </span>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <h1 className="font-display text-[clamp(3rem,7vw,6rem)] uppercase leading-[0.9]">
              O que está
              <br />
              rolando no
              <br />
              <span className="text-sun">projeto.</span>
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-white/60 sm:text-base lg:pb-3">
              Treinos, competições, avisos e histórias da comunidade. Tudo o
              que acontece no Vencedores da Ponte Metálica, em um só lugar.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <Newspaper size={14} className="text-sun" />
              {total} publicações
            </span>
            <span className="h-1 w-1 rounded-full bg-white/25" />
            <span>Atualizado pela coordenação</span>
          </div>
        </div>
      </section>

      <section className="bg-cream py-14">
        <div className="container-x">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoria(cat)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition ${
                    categoria === cat
                      ? "border-ink bg-ink text-white"
                      : "border-ink/15 bg-white text-ink/60 hover:border-ink/40"
                  }`}
                >
                  {cat === "Todas" ? "Todas" : rotuloCategoria[cat]}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/60"
              />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar notícia..."
                className="input pl-10"
                aria-label="Buscar notícia"
              />
            </div>
          </div>

          {noticias.length === 0 ? (
            <div className="mt-12 rounded-3xl border border-dashed border-ink/15 bg-white/60 p-16 text-center">
              <Newspaper size={32} className="mx-auto text-ink/25" />
              <p className="mt-4 font-display text-2xl uppercase text-ink">
                Nada por aqui ainda
              </p>
              <p className="mt-2 text-sm text-ink/60">
                Tente outra categoria ou limpe a busca.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {noticias.map((noticia) => (
                <article
                  key={noticia.id}
                  className={`group flex flex-col overflow-hidden rounded-2xl border bg-cream-50 transition hover:-translate-y-1 hover:shadow-card ${
                    noticia.destaque ? "border-sun/60" : "border-ink/10"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setAberta(noticia)}
                    className="relative aspect-[16/10] overflow-hidden text-left"
                  >
                    <Image
                      src={noticia.imagem}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute left-4 top-4 flex gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${classesCategoria(
                          noticia.categoria
                        )}`}
                      >
                        {noticia.categoria}
                      </span>
                      {noticia.destaque && (
                        <span className="rounded-full bg-ink px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sun">
                          Destaque
                        </span>
                      )}
                    </div>
                    <span className="sr-only">
                      Ler notícia: {noticia.titulo}
                    </span>
                  </button>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/60">
                      {formatarData(noticia.publicadoEm)} · {noticia.autor}
                    </p>
                    <h2 className="mt-3 font-display text-xl uppercase leading-tight text-ink">
                      {noticia.titulo}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/60">
                      {noticia.resumo}
                    </p>
                    <button
                      type="button"
                      onClick={() => setAberta(noticia)}
                      className="mt-auto inline-flex items-center gap-1.5 self-start pt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-sun-700 transition hover:text-ink"
                    >
                      Ler notícia <ArrowRight size={12} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-ink/10 bg-[#EFE6D8] py-16">
        <div className="container-x flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sun text-ink">
              <Bell size={22} />
            </span>
            <div>
              <p className="font-display text-2xl uppercase leading-none text-ink">
                Receba tudo na área do atleta
              </p>
              <p className="mt-2 max-w-lg text-sm text-ink/70">
                Atletas inscritos acompanham as novidades em primeira mão e
                recebem os avisos de treino no painel.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/atletas" className="btn-ink">
              Entrar no portal
            </Link>
            <Link href="/cadastro" className="btn-ghost-dark">
              Inscrever atleta
            </Link>
          </div>
        </div>
      </section>

      <Modal
        open={Boolean(aberta)}
        onClose={() => setAberta(null)}
        title={aberta?.categoria ?? "Notícia"}
        wide
      >
        {aberta && (
          <article>
            <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={aberta.imagem}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 800px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${classesCategoria(
                  aberta.categoria
                )}`}
              >
                {aberta.categoria}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-ink/60">
                {formatarData(aberta.publicadoEm)} · {aberta.autor}
              </span>
            </div>
            <h3 className="mt-3 font-display text-2xl uppercase leading-tight text-ink sm:text-3xl">
              {aberta.titulo}
            </h3>
            <p className="mt-3 text-sm font-medium leading-relaxed text-ink/70">
              {aberta.resumo}
            </p>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-ink/60">
              {aberta.conteudo.split("\n\n").map((paragrafo, i) => (
                <p key={i}>{paragrafo}</p>
              ))}
            </div>
          </article>
        )}
      </Modal>
    </>
  );
}
