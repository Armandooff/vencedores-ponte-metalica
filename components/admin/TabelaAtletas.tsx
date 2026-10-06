"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import atletasMock from "@/lib/mock/atletas.json";
import { ehMenorDeIdade } from "@/lib/idade";
import { AtletaFormData } from "@/lib/schemas/atleta";
import ModalEdicaoAtleta from "./ModalEdicaoAtleta";

type AtletaRegistro = AtletaFormData & { id: number; status: string };

const columnHelper = createColumnHelper<AtletaRegistro>();

function mascararDocumento(valor: string) {
  if (!valor || valor.length < 4) return valor;
  return `***.***.${valor.slice(-4, -2)}-${valor.slice(-2)}`;
}

export default function TabelaAtletas() {
  const [dados, setDados] = useState<AtletaRegistro[]>(atletasMock as AtletaRegistro[]);
  const [filtro, setFiltro] = useState("");
  const [atletaEditando, setAtletaEditando] = useState<AtletaRegistro | null>(null);
  const [revelarDocumentos, setRevelarDocumentos] = useState(false);

  const salvarEdicao = (id: number, camposAtualizados: AtletaFormData) => {
    setDados((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...camposAtualizados } : a))
    );
  };

  const excluir = (id: number) => {
    if (!confirm("Confirma a exclusão deste cadastro?")) return;
    setDados((prev) => prev.filter((a) => a.id !== id));
  };

  const atualizarStatus = (id: number, status: string) => {
    setDados((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const colunas = useMemo(
    () => [
      columnHelper.accessor("nomeCompleto", {
        header: "Nome",
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor("dataNascimento", {
        header: "Nascimento",
        cell: (info) => {
          const menor = ehMenorDeIdade(info.getValue());
          return (
            <span className={menor ? "text-amber-600 font-medium" : ""}>
              {info.getValue()} {menor && "· menor"}
            </span>
          );
        },
      }),
      columnHelper.accessor("cpf", {
        header: "CPF",
        cell: (info) => (revelarDocumentos ? info.getValue() : mascararDocumento(info.getValue())),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <select
            value={info.getValue()}
            onChange={(e) => atualizarStatus(info.row.original.id, e.target.value)}
            className="text-xs border border-slate-200 rounded px-2 py-1"
          >
            <option value="pendente">Pendente</option>
            <option value="aprovado">Aprovado</option>
            <option value="reprovado">Reprovado</option>
          </select>
        ),
      }),
      columnHelper.display({
        id: "acoes",
        header: "Ações",
        cell: ({ row }) => (
          <div className="flex gap-3 text-sm">
            <button
              onClick={() => setAtletaEditando(row.original)}
              className="text-turquesa-600 hover:underline"
            >
              Editar
            </button>
            <button
              onClick={() => excluir(row.original.id)}
              className="text-red-600 hover:underline"
            >
              Excluir
            </button>
          </div>
        ),
      }),
    ],
    [revelarDocumentos]
  );

  const table = useReactTable({
    data: dados,
    columns: colunas,
    state: { globalFilter: filtro },
    onGlobalFilterChange: setFiltro,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border-b border-slate-100">
        <input
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar por nome, CPF..."
          className="input md:max-w-xs"
        />
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={revelarDocumentos}
            onChange={(e) => setRevelarDocumentos(e.target.checked)}
          />
          Revelar documentos completos
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="text-left p-3 font-semibold text-slate-700">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={colunas.length} className="p-6 text-center text-slate-400">
                  Nenhum cadastro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-4 border-t border-slate-100 text-sm">
        <span className="text-slate-500">
          {table.getFilteredRowModel().rows.length} cadastro(s)
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="btn-secondary !px-3 !py-1.5 text-xs"
          >
            Anterior
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="btn-secondary !px-3 !py-1.5 text-xs"
          >
            Próxima
          </button>
        </div>
      </div>

      {atletaEditando && (
        <ModalEdicaoAtleta
          atleta={atletaEditando}
          aoFechar={() => setAtletaEditando(null)}
          aoSalvar={(dados) => salvarEdicao(atletaEditando.id, dados)}
        />
      )}
    </div>
  );
}
