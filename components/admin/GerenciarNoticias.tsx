"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import ModalNoticia from "./ModalNoticia";
import { useDados } from "@/lib/store";
import {
  classesCategoria,
  formatarDataCurta,
} from "@/lib/format";
import type { Noticia } from "@/lib/types";
import {
  Eye,
  Newspaper,
  Pencil,
  Plus,
  Search,
  Trash,
} from "@/components/ui/Icons";

type Aba = "todas" | "publicadas" | "rascunhos";

export default function GerenciarNoticias() {
  const { db, atualizarNoticia, excluirNoticia } = useDados();
  const [aba, setAba] = useState<Aba>("todas");
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState<Noticia | null>(null);
  const [criando, setCriando] = useState(false);
  const [excluir, setExcluir] = useState<Noticia | null>(null);

  const noticias = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return [...db.noticias]
      .filter((n) =>
        aba === "todas"
          ? true
          : aba === "publicadas"
          ? n.publicada
          : !n.publicada
      )
      .filter(
        (n) =>
          !termo ||
          n.titulo.toLowerCase().includes(termo) ||
          n.resumo.toLowerCase().includes(termo)
      )
      .sort((a, b) => b.publicadoEm.localeCompare(a.publicadoEm));
  }, [db.noticias, aba, busca]);

  const publicadas = db.noticias.filter((n) => n.publicada).length;
  const rascunhos = db.noticias.length - publicadas;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-3xl uppercase leading-none text-ink">
            Notícias & avisos
          </h2>
          <p className="mt-2 text-sm text-ink/65">
            Publique novidades que aparecem no site e no painel dos atletas.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCriando(true)}
          className="btn-sun w-fit !px-4 !py-2.5 !text-[11px]"
        >
          <Plus size={15} /> Nova notícia
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card-light p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/60">
            Total
          </p>
          <p className="mt-1 font-display text-3xl leading-none text-ink">
            {db.noticias.length}
          </p>
        </div>
        <div className="card-light p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/60">
            Publicadas
          </p>
          <p className="mt-1 font-display text-3xl leading-none text-emerald-700">
            {publicadas}
          </p>
        </div>
        <div className="card-light p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/60">
            Rascunhos
          </p>
          <p className="mt-1 font-display text-3xl leading-none text-amber-700">
            {rascunhos}
          </p>
        </div>
      </div>

      <div className="card-light overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-ink/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-full bg-ink/5 p-1">
            {(
              [
                ["todas", "Todas"],
                ["publicadas", "Publicadas"],
                ["rascunhos", "Rascunhos"],
              ] as [Aba, string][]
            ).map(([valor, label]) => (
              <button
                key={valor}
                type="button"
                onClick={() => setAba(valor)}
                className={`rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                  aba === valor
                    ? "bg-ink text-white"
                    : "text-ink/65 hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:max-w-xs">
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

        <div className="divide-y divide-ink/5">
          {noticias.map((noticia) => (
            <div
              key={noticia.id}
              className="flex flex-col gap-4 p-4 transition hover:bg-sun/[0.03] sm:flex-row sm:items-center"
            >
              <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-ink/5 sm:h-20 sm:w-32">
                <Image
                  src={noticia.imagem}
                  alt=""
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${classesCategoria(
                      noticia.categoria
                    )}`}
                  >
                    {noticia.categoria}
                  </span>
                  {noticia.destaque && (
                    <span className="rounded-full bg-ink px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sun">
                      Destaque
                    </span>
                  )}
                  <span className="text-[10px] uppercase tracking-wider text-ink/60">
                    {formatarDataCurta(noticia.publicadoEm)}
                  </span>
                </div>
                <p className="mt-1.5 truncate font-semibold text-ink">
                  {noticia.titulo}
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs text-ink/60">
                  {noticia.resumo}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    atualizarNoticia(noticia.id, {
                      publicada: !noticia.publicada,
                    })
                  }
                  className="flex items-center gap-2 rounded-full border border-ink/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition hover:border-ink/30"
                  title={
                    noticia.publicada ? "Despublicar" : "Publicar notícia"
                  }
                >
                  <span
                    className={`h-4 w-7 rounded-full p-0.5 transition ${
                      noticia.publicada ? "bg-emerald-500" : "bg-ink/20"
                    }`}
                  >
                    <span
                      className={`block h-3 w-3 rounded-full bg-white transition ${
                        noticia.publicada ? "translate-x-3" : "translate-x-0"
                      }`}
                    />
                  </span>
                  <span
                    className={
                      noticia.publicada ? "text-emerald-700" : "text-ink/60"
                    }
                  >
                    {noticia.publicada ? "No ar" : "Rascunho"}
                  </span>
                </button>

                <a
                  href="/noticias"
                  target="_blank"
                  rel="noreferrer"
                  title="Ver no site"
                  className="rounded-lg p-2 text-ink/60 transition hover:bg-ink/5 hover:text-ink"
                >
                  <Eye size={15} />
                </a>
                <button
                  type="button"
                  onClick={() => setEditando(noticia)}
                  title="Editar notícia"
                  className="rounded-lg p-2 text-ink/60 transition hover:bg-ink/5 hover:text-ink"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setExcluir(noticia)}
                  title="Excluir notícia"
                  className="rounded-lg p-2 text-ink/60 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash size={15} />
                </button>
              </div>
            </div>
          ))}

          {noticias.length === 0 && (
            <div className="p-14 text-center">
              <Newspaper size={30} className="mx-auto text-ink/20" />
              <p className="mt-3 font-display text-xl uppercase text-ink/60">
                Nenhuma notícia por aqui
              </p>
              <p className="mt-1 text-sm text-ink/60">
                Crie a primeira publicação para a comunidade.
              </p>
            </div>
          )}
        </div>
      </div>

      {criando && <ModalNoticia onClose={() => setCriando(false)} />}
      {editando && (
        <ModalNoticia noticia={editando} onClose={() => setEditando(null)} />
      )}

      <Modal
        open={Boolean(excluir)}
        onClose={() => setExcluir(null)}
        title="Excluir notícia"
      >
        <p className="text-sm leading-relaxed text-ink/65">
          Tem certeza que deseja excluir{" "}
          <strong className="text-ink">{excluir?.titulo}</strong>? A publicação
          sairá do site e do painel dos atletas.
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => setExcluir(null)}
            className="btn-ghost-dark !px-5 !py-2.5 !text-[11px]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              if (excluir) excluirNoticia(excluir.id);
              setExcluir(null);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition hover:bg-red-700"
          >
            <Trash size={14} /> Sim, excluir
          </button>
        </div>
      </Modal>
    </div>
  );
}
