"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { useDados } from "@/lib/store";
import type { Evento } from "@/lib/types";
import { hojeISO } from "@/lib/format";
import { X } from "@/components/ui/Icons";

type FormEvento = {
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  local: string;
  turma: string;
  ativo: boolean;
};

export default function ModalEvento({
  evento,
  onClose,
}: {
  evento?: Evento;
  onClose: () => void;
}) {
  const { criarEvento, atualizarEvento } = useDados();
  const [form, setForm] = useState<FormEvento>({
    titulo: evento?.titulo ?? "",
    descricao: evento?.descricao ?? "",
    data: evento?.data ?? hojeISO(),
    hora: evento?.hora ?? "07:00",
    local: evento?.local ?? "Praia de Iracema — em frente à Ponte dos Ingleses",
    turma: evento?.turma ?? "Todas as turmas",
    ativo: evento?.ativo ?? true,
  });
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!evento) return;
    setForm({
      titulo: evento.titulo,
      descricao: evento.descricao,
      data: evento.data,
      hora: evento.hora,
      local: evento.local,
      turma: evento.turma,
      ativo: evento.ativo,
    });
  }, [evento]);

  const definir = <K extends keyof FormEvento>(campo: K, valor: FormEvento[K]) =>
    setForm((atual) => ({ ...atual, [campo]: valor }));

  const salvar = () => {
    setErro(null);
    if (form.titulo.trim().length < 5) {
      setErro("Informe um título para o evento.");
      return;
    }
    if (!form.data || !form.hora) {
      setErro("Informe a data e o horário do evento.");
      return;
    }
    if (evento) {
      atualizarEvento(evento.id, form);
    } else {
      criarEvento(form);
    }
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={evento ? "Editar evento" : "Novo evento"}
    >
      <div className="space-y-4">
        <div>
          <span className="field-label">Título</span>
          <input
            value={form.titulo}
            onChange={(e) => definir("titulo", e.target.value)}
            className="input"
            placeholder="Ex.: Treino de bodyboard · Turma iniciante"
          />
        </div>

        <div>
          <span className="field-label">Descrição</span>
          <textarea
            value={form.descricao}
            onChange={(e) => definir("descricao", e.target.value)}
            rows={3}
            className="input resize-none"
            placeholder="O que vai acontecer neste encontro?"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="field-label">Data</span>
            <input
              type="date"
              value={form.data}
              onChange={(e) => definir("data", e.target.value)}
              className="input"
            />
          </div>
          <div>
            <span className="field-label">Horário</span>
            <input
              type="time"
              value={form.hora}
              onChange={(e) => definir("hora", e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div>
          <span className="field-label">Local</span>
          <input
            value={form.local}
            onChange={(e) => definir("local", e.target.value)}
            className="input"
          />
        </div>

        <div>
          <span className="field-label">Turma</span>
          <input
            value={form.turma}
            onChange={(e) => definir("turma", e.target.value)}
            className="input"
            placeholder="Todas as turmas / Iniciante / Avançado"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink/70">
          <input
            type="checkbox"
            checked={form.ativo}
            onChange={(e) => definir("ativo", e.target.checked)}
            className="h-4 w-4 accent-sun"
          />
          Evento ativo (aparece no painel dos atletas)
        </label>

        {erro && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-3 border-t border-ink/10 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost-dark !px-5 !py-2.5 !text-[11px]"
          >
            <X size={14} /> Cancelar
          </button>
          <button
            type="button"
            onClick={salvar}
            className="btn-sun !px-5 !py-2.5 !text-[11px]"
          >
            {evento ? "Salvar alterações" : "Criar evento"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
