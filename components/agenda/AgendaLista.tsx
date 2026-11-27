"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clock,
  Instagram,
  MapPin,
  Search,
} from "@/components/ui/Icons";
import { rotuloCategoriaAtleta } from "@/lib/categorias";
import { formatarData } from "@/lib/format";
import type { EventoPublico } from "@/lib/types";

const INSTAGRAM_URL = "https://www.instagram.com/vencedorespontemetalica/";

type Aba = "proximos" | "encerrados";

function partesData(iso: string) {
  const data = new Date(`${iso}T12:00:00`);
  return {
    dia: new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(data),
    mes: new Intl.DateTimeFormat("pt-BR", { month: "short" })
      .format(data)
      .replace(".", "")
      .toUpperCase(),
    semana: new Intl.DateTimeFormat("pt-BR", { weekday: "short" })
      .format(data)
      .replace(".", ""),
  };
}

function CartaoEvento({
  evento,
  encerrado,
}: {
  evento: EventoPublico;
  encerrado: boolean;
}) {
  const { dia, mes, semana } = partesData(evento.data);

  return (
    <article className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-card">
      <div className="grid lg:grid-cols-[150px_minmax(0,1fr)_auto]">
        <div
          className={`flex items-center gap-4 px-6 py-4 sm:px-7 lg:flex-col lg:items-start lg:justify-center lg:gap-1 lg:px-6 lg:py-7 ${
            encerrado ? "bg-ink/[0.04] text-ink" : "bg-sun text-ink"
          }`}
        >
          <time
            dateTime={evento.data}
            className="flex items-baseline gap-3 lg:block"
          >
            <span className="font-display text-4xl leading-none sm:text-5xl">
              {dia}
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              {mes}
            </span>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider lg:mt-1 lg:block ${
                encerrado ? "text-ink/70" : "text-ink"
              }`}
            >
              {semana}
            </span>
            <span className="sr-only">
              {" "}
              — {formatarData(evento.data, { weekday: "long" })}
            </span>
          </time>
        </div>

        <div className="min-w-0 p-6 sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            {encerrado && (
              <span className="inline-flex min-h-[24px] items-center rounded-full border border-ink/15 bg-ink/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink/70">
                Encerrado
              </span>
            )}
            {evento.categorias.map((categoria) => (
              <span
                key={categoria}
                className="inline-flex min-h-[24px] items-center rounded-full border border-ink/10 bg-cream px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink/70"
              >
                {rotuloCategoriaAtleta[categoria]}
              </span>
            ))}
          </div>

          <h3 className="mt-3 font-display text-2xl uppercase leading-none text-ink sm:text-3xl">
            {evento.titulo}
          </h3>

          {evento.descricao && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/65">
              {evento.descricao}
            </p>
          )}

          <div className="mt-4 flex flex-col gap-2 text-xs leading-relaxed text-ink/65 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
            <span className="inline-flex items-start gap-1.5">
              <Clock size={14} className="mt-0.5 shrink-0 text-sun-700" />
              <span>
                <span className="sr-only">Horário: </span>
                {evento.hora || "Horário a confirmar"}
              </span>
            </span>
            <span className="inline-flex items-start gap-1.5">
              <MapPin size={14} className="mt-0.5 shrink-0 text-sun-700" />
              <span>
                <span className="sr-only">Local: </span>
                {evento.local || "Local a confirmar"}
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center p-6 pt-0 sm:p-7 sm:pt-0 lg:p-7 lg:pl-0">
          {encerrado ? (
            <span className="inline-flex min-h-[44px] items-center rounded-full bg-ink/5 px-4 text-[10px] font-bold uppercase tracking-wider text-ink/60">
              Evento encerrado
            </span>
          ) : (
            <Link
              href="/cadastro"
              className="btn-sun w-full justify-center lg:w-auto"
            >
              Inscrever atleta <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default function AgendaLista({
  eventos,
  hoje,
  indisponivel,
}: {
  eventos: EventoPublico[];
  hoje: string;
  indisponivel: boolean;
}) {
  const [aba, setAba] = useState<Aba>("proximos");
  const [busca, setBusca] = useState("");

  const proximos = useMemo(
    () =>
      eventos
        .filter((evento) => evento.data >= hoje)
        .sort((a, b) => `${a.data}${a.hora}`.localeCompare(`${b.data}${b.hora}`)),
    [eventos, hoje]
  );

  const encerrados = useMemo(
    () =>
      eventos
        .filter((evento) => evento.data < hoje)
        .sort((a, b) => `${b.data}${b.hora}`.localeCompare(`${a.data}${a.hora}`)),
    [eventos, hoje]
  );

  const base = aba === "proximos" ? proximos : encerrados;

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return base;

    return base.filter((evento) => {
      const categorias = evento.categorias
        .map((categoria) => rotuloCategoriaAtleta[categoria])
        .join(" ");
      return [evento.titulo, evento.descricao, evento.local, categorias]
        .join(" ")
        .toLowerCase()
        .includes(termo);
    });
  }, [base, busca]);

  if (indisponivel) {
    return (
      <div
        role="alert"
        className="rounded-3xl border border-amber-300/70 bg-amber-50 px-6 py-10 text-amber-950 sm:px-9"
      >
        <AlertCircle size={26} className="text-amber-700" />
        <h2 className="mt-4 font-display text-3xl uppercase leading-none">
          Não foi possível carregar a agenda agora.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-amber-900">
          Tente novamente em instantes. Enquanto isso, as novidades e mudanças
          de última hora aparecem no Instagram do projeto.
        </p>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ink px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-white transition hover:bg-ink-700"
        >
          <Instagram size={16} /> Acompanhar no Instagram
          <ArrowUpRight size={14} />
        </a>
      </div>
    );
  }

  if (eventos.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-ink/20 bg-white/70 px-6 py-14 text-center sm:px-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sun/15 text-sun-700">
          <Calendar size={26} />
        </span>
        <h2 className="mt-5 font-display text-3xl uppercase leading-none text-ink">
          A agenda está em pausa.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/65">
          Nenhum evento ativo publicado neste momento. Quando a coordenação
          abrir uma nova data, ela aparece aqui.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-ink"
          >
            <Instagram size={16} /> Acompanhar no Instagram
            <ArrowUpRight size={14} />
          </a>
          <Link href="/noticias" className="btn-ghost-dark">
            Ver notícias
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Filtrar eventos por período"
          className="inline-flex w-fit rounded-full border border-ink/10 bg-white p-1"
        >
          <button
            type="button"
            aria-pressed={aba === "proximos"}
            onClick={() => setAba("proximos")}
            className={`inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition ${
              aba === "proximos"
                ? "bg-ink text-white"
                : "text-ink/60 hover:bg-ink/5 hover:text-ink"
            }`}
          >
            Próximos
            <span
              className={`rounded-full px-1.5 text-[10px] ${
                aba === "proximos"
                  ? "bg-sun text-ink"
                  : "bg-ink/10 text-ink/60"
              }`}
            >
              {proximos.length}
            </span>
          </button>
          <button
            type="button"
            aria-pressed={aba === "encerrados"}
            onClick={() => setAba("encerrados")}
            className={`inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition ${
              aba === "encerrados"
                ? "bg-ink text-white"
                : "text-ink/60 hover:bg-ink/5 hover:text-ink"
            }`}
          >
            Encerrados
            <span
              className={`rounded-full px-1.5 text-[10px] ${
                aba === "encerrados"
                  ? "bg-sun text-ink"
                  : "bg-ink/10 text-ink/60"
              }`}
            >
              {encerrados.length}
            </span>
          </button>
        </div>

        <div className="relative w-full lg:max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/60"
          />
          <label className="sr-only" htmlFor="agenda-busca">
            Buscar evento na agenda
          </label>
          <input
            id="agenda-busca"
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar por treino, local..."
            className="input pl-10"
          />
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {filtrados.length} evento{filtrados.length === 1 ? "" : "s"}{" "}
        encontrado{filtrados.length === 1 ? "" : "s"}.
      </p>

      {filtrados.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-ink/20 bg-white/70 px-6 py-12 text-center">
          <Search size={28} className="mx-auto text-ink/30" />
          <h2 className="mt-4 font-display text-2xl uppercase leading-none text-ink">
            {busca.trim()
              ? "Nenhum evento encontrado."
              : aba === "proximos"
                ? "Nenhum evento futuro no momento."
                : "Nenhum evento encerrado."}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/65">
            {busca.trim()
              ? "Tente outra palavra ou limpe a busca para ver todas as datas."
              : "A coordenação atualiza a agenda assim que novas datas são confirmadas."}
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            {busca.trim() ? (
              <button
                type="button"
                onClick={() => setBusca("")}
                className="btn-ghost-dark"
              >
                Limpar busca
              </button>
            ) : aba === "proximos" && encerrados.length > 0 ? (
              <button
                type="button"
                onClick={() => setAba("encerrados")}
                className="btn-ghost-dark"
              >
                Ver encerrados
              </button>
            ) : (
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-ink"
              >
                <Instagram size={16} /> Acompanhar no Instagram
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {filtrados.map((evento) => (
            <CartaoEvento
              key={evento.id}
              evento={evento}
              encerrado={evento.data < hoje}
            />
          ))}
        </div>
      )}
    </div>
  );
}
