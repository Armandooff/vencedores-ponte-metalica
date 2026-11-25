"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { useDados } from "@/lib/store";
import type { CategoriaAtleta, Evento } from "@/lib/types";
import { hojeISO } from "@/lib/format";
import {
  gruposCategoriaAtleta,
  rotuloCategoriaAtleta,
} from "@/lib/categorias";
import { X } from "@/components/ui/Icons";

type FormEvento = {
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  local: string;
  ativo: boolean;
  categorias: CategoriaAtleta[];
};

export default function ModalEvento({
  evento,
  dataInicial,
  tituloInicial,
  onClose,
}: {
  evento?: Evento;
  dataInicial?: string;
  tituloInicial?: string;
  onClose: () => void;
}) {
  const { criarEvento, atualizarEvento } = useDados();
  const [form, setForm] = useState<FormEvento>({
    titulo: evento?.titulo ?? tituloInicial ?? "",
    descricao: evento?.descricao ?? "",
    data: evento?.data ?? dataInicial ?? hojeISO(),
    hora: evento?.hora ?? "07:00",
    local: evento?.local ?? "Praia de Iracema — em frente à Ponte dos Ingleses",
    ativo: evento?.ativo ?? true,
    categorias: evento?.categorias ?? [],
  });
  const [todasCategorias, setTodasCategorias] = useState(
    !evento?.categorias?.length
  );
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!evento) return;
    setForm({
      titulo: evento.titulo,
      descricao: evento.descricao,
      data: evento.data,
      hora: evento.hora,
      local: evento.local,
      ativo: evento.ativo,
      categorias: evento.categorias ?? [],
    });
    setTodasCategorias(!evento.categorias?.length);
  }, [evento]);

  const definir = <K extends keyof FormEvento>(campo: K, valor: FormEvento[K]) =>
    setForm((atual) => ({ ...atual, [campo]: valor }));

  const alternarCategoria = (categoria: CategoriaAtleta) =>
    setForm((atual) => ({
      ...atual,
      categorias: atual.categorias.includes(categoria)
        ? atual.categorias.filter((item) => item !== categoria)
        : [...atual.categorias, categoria],
    }));

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
    if (!todasCategorias && form.categorias.length === 0) {
      setErro("Escolha ao menos uma categoria ou marque “Todas as categorias”.");
      return;
    }

    const dados = {
      ...form,
      categorias: todasCategorias ? [] : form.categorias,
    };

    if (evento) {
      atualizarEvento(evento.id, dados);
    } else {
      criarEvento(dados);
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
            placeholder="Ex.: Treino de bodyboard · Sábado"
            aria-label="Título do evento"
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
            aria-label="Descrição do evento"
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
              aria-label="Data do evento"
            />
          </div>
          <div>
            <span className="field-label">Horário</span>
            <input
              type="time"
              value={form.hora}
              onChange={(e) => definir("hora", e.target.value)}
              className="input"
              aria-label="Horário do evento"
            />
          </div>
        </div>

        <div>
          <span className="field-label">Local</span>
          <input
            value={form.local}
            onChange={(e) => definir("local", e.target.value)}
            className="input"
            aria-label="Local do evento"
          />
        </div>

        <div className="rounded-xl border border-ink/10 bg-white p-4">
          <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              checked={todasCategorias}
              onChange={(e) => {
                setTodasCategorias(e.target.checked);
                if (e.target.checked) definir("categorias", []);
              }}
              className="h-4 w-4 accent-sun"
            />
            Todas as categorias
          </label>
          <p className="mt-1 pl-7 text-xs leading-relaxed text-ink/65">
            O evento aparece para todos os atletas aprovados.
          </p>

          {!todasCategorias && (
            <div className="mt-4 grid gap-4 border-t border-ink/10 pt-4 sm:grid-cols-2">
              {gruposCategoriaAtleta.map((grupo) => (
                <div key={grupo.id}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/70">
                    {grupo.rotulo}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {grupo.categorias.map((categoria) => {
                      const selecionada = form.categorias.includes(categoria);
                      return (
                        <button
                          key={categoria}
                          type="button"
                          aria-pressed={selecionada}
                          onClick={() => alternarCategoria(categoria)}
                          className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                            selecionada
                              ? "border-sun bg-sun text-ink"
                              : "border-ink/15 bg-cream text-ink/70 hover:border-ink/35"
                          }`}
                        >
                          {rotuloCategoriaAtleta[categoria]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
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
