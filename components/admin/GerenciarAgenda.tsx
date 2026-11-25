"use client";

import { useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import ChamadaEvento from "./ChamadaEvento";
import ModalEvento from "./ModalEvento";
import { useDados } from "@/lib/store";
import { formatarData, hojeISO, proximoSabadoISO } from "@/lib/format";
import { rotuloCategoriaAtleta } from "@/lib/categorias";
import type { Evento } from "@/lib/types";
import {
  Calendar,
  Check,
  Clock,
  MapPin,
  Pencil,
  Plus,
  Trash,
  Users,
} from "@/components/ui/Icons";

export default function GerenciarAgenda() {
  const { db, atualizarEvento, excluirEvento } = useDados();
  const [criando, setCriando] = useState(false);
  const [dataInicial, setDataInicial] = useState<string | undefined>();
  const [tituloInicial, setTituloInicial] = useState<string | undefined>();
  const [editando, setEditando] = useState<Evento | null>(null);
  const [chamada, setChamada] = useState<Evento | null>(null);
  const [excluir, setExcluir] = useState<Evento | null>(null);

  const hoje = hojeISO();

  const eventos = useMemo(
    () => [...db.eventos].sort((a, b) => a.data.localeCompare(b.data)),
    [db.eventos]
  );

  const proximos = eventos.filter((e) => e.data >= hoje && e.ativo).length;
  const ativos = eventos.filter((e) => e.ativo).length;

  const abrirNovo = (sabado = false) => {
    setDataInicial(sabado ? proximoSabadoISO() : undefined);
    setTituloInicial(sabado ? "Treino de bodyboard · Sábado" : undefined);
    setCriando(true);
  };

  const fecharNovo = () => {
    setCriando(false);
    setDataInicial(undefined);
    setTituloInicial(undefined);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-3xl uppercase leading-none text-ink">
            Agenda do projeto
          </h2>
          <p className="mt-2 text-sm text-ink/65">
            Organize treinos, faça a chamada e mantenha todos os eventos ativos
            visíveis no painel dos atletas.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => abrirNovo(true)}
            className="btn-ghost-dark w-fit !px-4 !py-2.5 !text-[11px]"
          >
            <Calendar size={15} /> Treino de sábado
          </button>
          <button
            type="button"
            onClick={() => abrirNovo()}
            className="btn-sun w-fit !px-4 !py-2.5 !text-[11px]"
          >
            <Plus size={15} /> Novo evento
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card-light p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/60">
            Eventos cadastrados
          </p>
          <p className="mt-1 font-display text-3xl leading-none text-ink">
            {eventos.length}
          </p>
        </div>
        <div className="card-light p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/60">
            Próximos e ativos
          </p>
          <p className="mt-1 font-display text-3xl leading-none text-sun-700">
            {proximos}
          </p>
        </div>
        <div className="card-light p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/60">
            Ativos no painel
          </p>
          <p className="mt-1 font-display text-3xl leading-none text-emerald-700">
            {ativos}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {eventos.map((evento) => {
          const data = new Date(`${evento.data}T12:00:00`);
          const dia = String(data.getDate()).padStart(2, "0");
          const mes = new Intl.DateTimeFormat("pt-BR", { month: "short" })
            .format(data)
            .replace(".", "");
          const passado = evento.data < hoje;
          const presentes = Object.values(evento.presencas ?? {}).filter(
            (presenca) => presenca === "presente"
          ).length;
          const chamadaFeita = Boolean(evento.presencas);
          const categorias = evento.categorias ?? [];
          const labelsCategorias = categorias.map(
            (categoria) => rotuloCategoriaAtleta[categoria]
          );
          const resumoCategorias = categorias.length
            ? categorias.length <= 3
              ? labelsCategorias.join(" · ")
              : `${labelsCategorias.slice(0, 2).join(" · ")} +${
                  categorias.length - 2
                }`
            : "Todas as categorias";

          return (
            <div
              key={evento.id}
              className={`card-light flex flex-col gap-4 p-4 sm:flex-row sm:items-center ${
                passado || !evento.ativo ? "opacity-60" : ""
              }`}
            >
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-ink text-white">
                <span className="font-display text-2xl leading-none">{dia}</span>
                <span className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-sun">
                  {mes}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      chamadaFeita
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-sun/10 text-sun-700"
                    }`}
                  >
                    {chamadaFeita
                      ? `Chamada · ${presentes} presente${presentes === 1 ? "" : "s"}`
                      : "Chamada pendente"}
                  </span>
                  {passado && (
                    <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ink/60">
                      Encerrado
                    </span>
                  )}
                  {!evento.ativo && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-700">
                      Inativo
                    </span>
                  )}
                </div>
                <p className="mt-1 font-semibold text-ink">{evento.titulo}</p>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-ink/60">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={12} /> {evento.hora}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={12} /> {evento.local}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={12} /> {formatarData(evento.data)}
                  </span>
                </div>
                <p
                  className="mt-1 text-[10px] text-ink/65"
                  title={labelsCategorias.join(", ")}
                >
                  <span className="font-bold uppercase tracking-wider text-ink/70">
                    Categorias:
                  </span>{" "}
                  {resumoCategorias}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setChamada(evento)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition hover:border-sun hover:text-sun-700"
                  title="Fazer chamada"
                >
                  <Check size={13} /> Fazer chamada
                </button>
                <button
                  type="button"
                  onClick={() =>
                    atualizarEvento(evento.id, { ativo: !evento.ativo })
                  }
                  className="flex items-center gap-2 rounded-full border border-ink/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition hover:border-ink/30"
                  title={evento.ativo ? "Desativar evento" : "Ativar evento"}
                >
                  <span
                    className={`h-4 w-7 rounded-full p-0.5 transition ${
                      evento.ativo ? "bg-emerald-500" : "bg-ink/20"
                    }`}
                  >
                    <span
                      className={`block h-3 w-3 rounded-full bg-white transition ${
                        evento.ativo ? "translate-x-3" : "translate-x-0"
                      }`}
                    />
                  </span>
                  <span className={evento.ativo ? "text-emerald-700" : "text-ink/60"}>
                    {evento.ativo ? "Ativo" : "Inativo"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditando(evento)}
                  title="Editar evento"
                  className="rounded-lg p-2 text-ink/60 transition hover:bg-ink/5 hover:text-ink"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setExcluir(evento)}
                  title="Excluir evento"
                  className="rounded-lg p-2 text-ink/60 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash size={15} />
                </button>
              </div>
            </div>
          );
        })}

        {eventos.length === 0 && (
          <div className="card-light p-14 text-center">
            <Calendar size={30} className="mx-auto text-ink/20" />
            <p className="mt-3 font-display text-xl uppercase text-ink/60">
              Agenda vazia
            </p>
            <p className="mt-1 text-sm text-ink/60">
              Crie o primeiro treino ou encontro do projeto.
            </p>
          </div>
        )}
      </div>

      {criando && (
        <ModalEvento
          dataInicial={dataInicial}
          tituloInicial={tituloInicial}
          onClose={fecharNovo}
        />
      )}
      {editando && (
        <ModalEvento evento={editando} onClose={() => setEditando(null)} />
      )}
      {chamada && (
        <ChamadaEvento evento={chamada} onClose={() => setChamada(null)} />
      )}

      <Modal
        open={Boolean(excluir)}
        onClose={() => setExcluir(null)}
        title="Excluir evento"
      >
        <p className="text-sm leading-relaxed text-ink/65">
          Tem certeza que deseja excluir{" "}
          <strong className="text-ink">{excluir?.titulo}</strong>? Ele deixará
          de aparecer no painel dos atletas.
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
              if (excluir) excluirEvento(excluir.id);
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
