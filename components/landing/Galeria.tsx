"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Reveal from "@/components/ui/Reveal";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Instagram,
  X,
} from "@/components/ui/Icons";

const fotos = [
  {
    src: "/img/galeria-competicao.jpg",
    alt: "Atletas e famílias do projeto celebrando com a campeã na água",
    legenda: "Celebração no circuito",
    classe: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/img/comunidade.jpg",
    alt: "Crianças, jovens e famílias do projeto reunidos à noite",
    legenda: "A comunidade do projeto",
    classe: "md:col-span-1 md:row-span-1",
  },
  {
    src: "/img/acao.jpg",
    alt: "Atletas do projeto descendo a escada com pranchas de bodyboard",
    legenda: "A caminho do mar",
    classe: "md:col-span-1 md:row-span-1",
  },
  {
    src: "/img/galeria-atleta.jpg",
    alt: "Atleta do projeto observando o mar ao pôr do sol em Iracema",
    legenda: "Fim de tarde em Iracema",
    classe: "md:col-span-1 md:row-span-1",
  },
  {
    src: "/img/galeria-celebracao.jpg",
    alt: "Atletas do projeto comemorando na beira do mar",
    legenda: "Time que se abraça",
    classe: "md:col-span-1 md:row-span-1",
  },
];

export default function Galeria() {
  const [aberta, setAberta] = useState<number | null>(null);
  const [montado, setMontado] = useState(false);

  useEffect(() => setMontado(true), []);

  const fechar = useCallback(() => setAberta(null), []);
  const anterior = useCallback(
    () => setAberta((atual) => (atual === null ? null : (atual - 1 + fotos.length) % fotos.length)),
    []
  );
  const proxima = useCallback(
    () => setAberta((atual) => (atual === null ? null : (atual + 1) % fotos.length)),
    []
  );

  useEffect(() => {
    if (aberta === null) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
      if (e.key === "ArrowLeft") anterior();
      if (e.key === "ArrowRight") proxima();
    };
    document.addEventListener("keydown", aoTeclar);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = overflow;
    };
  }, [aberta, fechar, anterior, proxima]);

  const foto = aberta !== null ? fotos[aberta] : null;

  return (
    <section id="galeria" className="bg-cream py-16 md:py-24">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal>
            <span className="kicker text-sun-700">
              <span className="h-px w-8 bg-sun-600" />
              Galeria
            </span>
            <h2 className="mt-5 font-display text-[clamp(2.6rem,5vw,4.6rem)] uppercase leading-[0.92] text-ink">
              Iracema em
              <br />
              imagens.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <a
              href="https://www.instagram.com/vencedorespontemetalica/"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ink/70 transition hover:text-ink"
            >
              <Instagram size={16} className="text-sun-600" />
              Ver mais no Instagram
              <ArrowUpRight
                size={15}
                className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </Reveal>
        </div>

        <div className="mt-12 grid auto-rows-[190px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:auto-rows-[205px]">
          {fotos.map((item, i) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setAberta(i)}
              className={`group relative overflow-hidden rounded-2xl bg-ink text-left ${item.classe}`}
              aria-label={`Ampliar foto: ${item.legenda}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-transparent opacity-70 transition group-hover:opacity-95" />
              <span className="absolute bottom-4 left-4 right-4 text-[10px] font-bold uppercase leading-relaxed tracking-[0.2em] text-white">
                {item.legenda}
              </span>
              <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                <ArrowUpRight size={15} />
              </span>
            </button>
          ))}
        </div>
      </div>

      {montado && aberta !== null && foto
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex flex-col bg-ink/95 p-4 backdrop-blur sm:p-8"
              role="dialog"
              aria-modal="true"
              aria-label="Galeria de fotos"
            >
              <div className="flex items-center justify-between text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
                  {aberta + 1} / {fotos.length}
                </span>
                <button
                  type="button"
                  onClick={fechar}
                  className="rounded-full border border-white/20 p-2.5 text-white/70 transition hover:border-white/60 hover:text-white"
                  aria-label="Fechar galeria"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="relative flex flex-1 items-center justify-center py-4">
                <button
                  type="button"
                  onClick={anterior}
                  className="absolute left-0 z-10 rounded-full border border-white/20 p-3 text-white/70 transition hover:border-white/60 hover:text-white"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="relative h-[70vh] w-full max-w-5xl">
                  <Image
                    src={foto.src}
                    alt={foto.alt}
                    fill
                    priority
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>

                <button
                  type="button"
                  onClick={proxima}
                  className="absolute right-0 z-10 rounded-full border border-white/20 p-3 text-white/70 transition hover:border-white/60 hover:text-white"
                  aria-label="Próxima foto"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <p className="pb-2 text-center text-xs uppercase tracking-[0.2em] text-white/60">
                {foto.legenda}
              </p>
            </div>,
            document.body
          )
        : null}
    </section>
  );
}
