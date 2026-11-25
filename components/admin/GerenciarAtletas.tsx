"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import ModalAtleta from "./ModalAtleta";
import AvatarAtleta from "@/components/ui/AvatarAtleta";
import { useDados } from "@/lib/store";
import { calcularIdade, ehMenorDeIdade } from "@/lib/idade";
import {
  classesStatus,
  formatarDataCurta,
  rotuloStatus,
} from "@/lib/format";
import {
  opcoesCategoriaAtleta,
  rotuloCategoriaOuPendente,
} from "@/lib/categorias";
import type { Atleta, CategoriaAtleta, StatusAtleta } from "@/lib/types";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash,
  Users,
} from "@/components/ui/Icons";

const POR_PAGINA = 8;

function normalizarBusca(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

type ModalEstado =
  | { modo: "criar" }
  | { modo: "editar"; atleta: Atleta }
  | { modo: "ver"; atleta: Atleta }
  | null;

export default function GerenciarAtletas() {
  const { db, atualizarAtleta, excluirAtleta } = useDados();
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState<"todos" | StatusAtleta>("todos");
  const [categoria, setCategoria] = useState<
    "todas" | CategoriaAtleta | "sem-categoria"
  >("todas");
  const [pagina, setPagina] = useState(1);
  const [modal, setModal] = useState<ModalEstado>(null);
  const [excluir, setExcluir] = useState<Atleta | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const statusUrl = params.get("status");
    if (
      statusUrl === "pendente" ||
      statusUrl === "aprovado" ||
      statusUrl === "reprovado"
    ) {
      setStatus(statusUrl);
    }
  }, []);

  const filtrados = useMemo(() => {
    const termo = normalizarBusca(busca);
    const digitos = busca.replace(/\D/g, "");
    return [...db.atletas]
      .filter((a) => status === "todos" || a.status === status)
      .filter((a) => {
        if (categoria === "todas") return true;
        if (categoria === "sem-categoria") return !a.categoria;
        return a.categoria === categoria;
      })
      .filter(
        (a) =>
          !termo ||
          normalizarBusca(a.nomeCompleto).includes(termo) ||
          a.email.toLowerCase().includes(termo) ||
          (digitos.length > 0 && a.cpf.replace(/\D/g, "").includes(digitos))
      )
      .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
  }, [db.atletas, busca, status, categoria]);

  const totalPaginas = Math.max(Math.ceil(filtrados.length / POR_PAGINA), 1);
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = filtrados.slice(
    (paginaAtual - 1) * POR_PAGINA,
    paginaAtual * POR_PAGINA
  );

  useEffect(() => setPagina(1), [busca, status, categoria]);

  const exportarCsv = () => {
    const cabecalho = [
      "Nome",
      "E-mail",
      "Nascimento",
      "Idade",
      "Telefone",
      "Categoria",
      "Status",
      "Cadastro",
    ];
    const linhas = filtrados.map((a) => [
      a.nomeCompleto,
      a.email,
      a.dataNascimento,
      String(calcularIdade(a.dataNascimento)),
      a.telefone,
      rotuloCategoriaOuPendente(a.categoria),
      rotuloStatus[a.status],
      a.criadoEm,
    ]);
    const csv = [cabecalho, ...linhas]
      .map((linha) =>
        linha.map((campo) => `"${String(campo).replace(/"/g, '""')}"`).join(";")
      )
      .join("\n");
    const blob = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "atletas-vencedores.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-3xl uppercase leading-none text-ink">
            Atletas do projeto
          </h2>
          <p className="mt-2 text-sm text-ink/65">
            Gerencie inscrições, aprove atletas e mantenha as fichas em dia.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportarCsv}
            className="btn-ghost-dark !px-4 !py-2.5 !text-[11px]"
          >
            <Download size={14} /> Exportar CSV
          </button>
          <button
            type="button"
            onClick={() => setModal({ modo: "criar" })}
            className="btn-sun !px-4 !py-2.5 !text-[11px]"
          >
            <Plus size={15} /> Novo atleta
          </button>
        </div>
      </div>

      <div className="card-light overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-ink/10 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/60"
            />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, e-mail ou CPF..."
              className="input pl-10"
              aria-label="Buscar atleta"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "todos" | StatusAtleta)
              }
              className="input !w-auto min-w-[150px]"
              aria-label="Filtrar por status"
            >
              <option value="todos">Todos os status</option>
              <option value="pendente">Pendentes</option>
              <option value="aprovado">Aprovados</option>
              <option value="reprovado">Reprovados</option>
            </select>
            <select
              value={categoria}
              onChange={(e) =>
                setCategoria(
                  e.target.value as
                    | "todas"
                    | CategoriaAtleta
                    | "sem-categoria"
                )
              }
              className="input !w-auto min-w-[190px]"
              aria-label="Filtrar por categoria"
            >
              <option value="todas">Todas as categorias</option>
              {opcoesCategoriaAtleta.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
              <option value="sem-categoria">Sem categoria (antigos)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="bg-ink/[0.02] text-left text-[10px] uppercase tracking-wider text-ink/60">
                <th className="px-4 py-3 font-semibold">Atleta</th>
                <th className="px-3 py-3 font-semibold">Idade</th>
                <th className="px-3 py-3 font-semibold">Categoria</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Cadastro</th>
                <th className="px-4 py-3 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {visiveis.map((atleta) => (
                <tr
                  key={atleta.id}
                  className="border-t border-ink/5 transition hover:bg-sun/[0.03]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <AvatarAtleta
                        nome={atleta.nomeCompleto}
                        foto={atleta.foto}
                        className="h-9 w-9 text-[11px]"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">
                          {atleta.nomeCompleto}
                        </p>
                        <p className="truncate text-[11px] text-ink/60">
                          {atleta.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs text-ink/60">
                    {calcularIdade(atleta.dataNascimento)} anos
                    {ehMenorDeIdade(atleta.dataNascimento) && (
                      <span className="ml-1 text-[10px] font-semibold text-amber-700">
                        menor
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-xs font-medium text-ink/70">
                      {rotuloCategoriaOuPendente(atleta.categoria)}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${classesStatus(
                        atleta.status
                      )}`}
                    >
                      {rotuloStatus[atleta.status]}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-ink/60">
                    {formatarDataCurta(atleta.criadoEm)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {atleta.status === "pendente" && (
                        <button
                          type="button"
                          onClick={() =>
                            atualizarAtleta(atleta.id, { status: "aprovado" })
                          }
                          title="Aprovar inscrição"
                          className="rounded-lg p-2 text-emerald-700 transition hover:bg-emerald-50"
                        >
                          <Check size={15} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setModal({ modo: "ver", atleta })}
                        title="Ver ficha"
                        className="rounded-lg p-2 text-ink/60 transition hover:bg-ink/5 hover:text-ink"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setModal({ modo: "editar", atleta })}
                        title="Editar atleta"
                        className="rounded-lg p-2 text-ink/60 transition hover:bg-ink/5 hover:text-ink"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setExcluir(atleta)}
                        title="Excluir atleta"
                        className="rounded-lg p-2 text-ink/60 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {visiveis.length === 0 && (
            <div className="p-12 text-center">
              <Users size={30} className="mx-auto text-ink/20" />
              <p className="mt-3 font-display text-xl uppercase text-ink/60">
                Nenhum atleta encontrado
              </p>
              <p className="mt-1 text-sm text-ink/60">
                Ajuste os filtros ou cadastre um novo atleta.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-ink/10 p-4 sm:flex-row">
          <p className="text-xs text-ink/60">
            {filtrados.length} atleta{filtrados.length !== 1 ? "s" : ""} · página{" "}
            {paginaAtual} de {totalPaginas}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPagina((p) => Math.max(p - 1, 1))}
              disabled={paginaAtual <= 1}
              className="inline-flex items-center gap-1 rounded-lg border border-ink/15 px-3 py-1.5 text-[11px] font-semibold text-ink/60 transition hover:border-ink/40 disabled:opacity-40"
            >
              <ChevronLeft size={13} /> Anterior
            </button>
            <button
              type="button"
              onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas))}
              disabled={paginaAtual >= totalPaginas}
              className="inline-flex items-center gap-1 rounded-lg border border-ink/15 px-3 py-1.5 text-[11px] font-semibold text-ink/60 transition hover:border-ink/40 disabled:opacity-40"
            >
              Próxima <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {modal && (
        <ModalAtleta
          modo={modal.modo}
          atleta={modal.modo === "criar" ? undefined : modal.atleta}
          onClose={() => setModal(null)}
          onEditar={(atleta) => setModal({ modo: "editar", atleta })}
          onExcluir={(atleta) => {
            setModal(null);
            setExcluir(atleta);
          }}
        />
      )}

      <Modal
        open={Boolean(excluir)}
        onClose={() => setExcluir(null)}
        title="Excluir atleta"
      >
        <p className="text-sm leading-relaxed text-ink/65">
          Tem certeza que deseja excluir o cadastro de{" "}
          <strong className="text-ink">{excluir?.nomeCompleto}</strong>? Essa
          ação não pode ser desfeita.
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
              if (excluir) excluirAtleta(excluir.id);
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
