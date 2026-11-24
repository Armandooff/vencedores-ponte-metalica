"use client";

import { useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import AvatarAtleta from "@/components/ui/AvatarAtleta";
import { Check, Search, X } from "@/components/ui/Icons";
import { formatarData } from "@/lib/format";
import { rotuloCategoriaOuPendente } from "@/lib/categorias";
import { useDados } from "@/lib/store";
import type { Evento, Presenca } from "@/lib/types";

export default function ChamadaEvento({
  evento,
  onClose,
}: {
  evento: Evento;
  onClose: () => void;
}) {
  const { db, registrarChamada } = useDados();
  const aprovados = useMemo(
    () =>
      db.atletas
        .filter((atleta) => atleta.status === "aprovado")
        .sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto, "pt-BR")),
    [db.atletas]
  );
  const [busca, setBusca] = useState("");
  const [presencas, setPresencas] = useState<Record<string, Presenca>>(() => {
    if (evento.presencas) return { ...evento.presencas };
    return Object.fromEntries(
      aprovados.map((atleta) => [atleta.id, "presente" as Presenca])
    );
  });

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return aprovados;
    return aprovados.filter(
      (atleta) =>
        atleta.nomeCompleto.toLowerCase().includes(termo) ||
        atleta.email.toLowerCase().includes(termo) ||
        (atleta.categoria ?? "")
          .toLowerCase()
          .includes(termo)
    );
  }, [aprovados, busca]);

  const presentes = Object.values(presencas).filter(
    (presenca) => presenca === "presente"
  ).length;
  const ausentes = aprovados.length - presentes;

  const alternar = (id: string) => {
    setPresencas((atual) => ({
      ...atual,
      [id]: atual[id] === "presente" ? "ausente" : "presente",
    }));
  };

  const todosPresentes = () => {
    setPresencas(
      Object.fromEntries(
        aprovados.map((atleta) => [atleta.id, "presente" as Presenca])
      )
    );
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Chamada do treino"
      description={`${evento.titulo} · ${formatarData(evento.data)} · ${evento.hora}`}
      wide
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-cream/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-2 font-semibold text-emerald-700">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              {presentes} presentes
            </span>
            <span className="inline-flex items-center gap-2 text-ink/60">
              <span className="h-2.5 w-2.5 rounded-full bg-ink/25" />
              {ausentes} ausentes
            </span>
          </div>
          <button
            type="button"
            onClick={todosPresentes}
            className="btn-ghost-dark !px-4 !py-2 !text-[10px]"
          >
            <Check size={14} /> Todos presentes
          </button>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
          />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input !pl-9"
            placeholder="Buscar atleta ou categoria..."
            aria-label="Buscar atleta na chamada"
          />
        </div>

        <div className="max-h-[45vh] overflow-y-auto rounded-2xl border border-ink/10">
          {lista.length ? (
            <ul className="divide-y divide-ink/10">
              {lista.map((atleta) => {
                const presente = presencas[atleta.id] !== "ausente";
                return (
                  <li
                    key={atleta.id}
                    className="flex items-center gap-3 bg-white px-4 py-3"
                  >
                    <AvatarAtleta
                      nome={atleta.nomeCompleto}
                      foto={atleta.foto}
                      className="h-10 w-10"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">
                        {atleta.nomeCompleto}
                      </p>
                      <p className="truncate text-xs text-ink/55">
                        {rotuloCategoriaOuPendente(atleta.categoria)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => alternar(atleta.id)}
                      aria-pressed={presente}
                      className={`inline-flex min-w-[92px] items-center justify-center gap-2 rounded-full border px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition ${
                        presente
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-ink/15 bg-white text-ink/55 hover:bg-ink/5"
                      }`}
                    >
                      {presente ? <Check size={14} /> : <X size={14} />}
                      {presente ? "Presente" : "Ausente"}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="bg-white px-4 py-8 text-center text-sm text-ink/55">
              Nenhum atleta aprovado encontrado.
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-ink/10 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost-dark !px-5 !py-2.5 !text-[11px]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              registrarChamada(evento.id, presencas);
              onClose();
            }}
            className="btn-sun !px-5 !py-2.5 !text-[11px]"
          >
            <Check size={14} /> Salvar chamada
          </button>
        </div>
      </div>
    </Modal>
  );
}
