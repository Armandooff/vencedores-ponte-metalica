"use client";

import FormularioAtleta from "@/components/cadastro/FormularioAtleta";
import { AtletaFormData } from "@/lib/schemas/atleta";

export default function ModalEdicaoAtleta({
  atleta,
  aoFechar,
  aoSalvar,
}: {
  atleta: AtletaFormData;
  aoFechar: () => void;
  aoSalvar: (dados: AtletaFormData) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-marinho-900">Editar Cadastro</h2>
          <button onClick={aoFechar} className="text-slate-400 hover:text-slate-700">
            ✕
          </button>
        </div>
        <FormularioAtleta
          valoresIniciais={atleta}
          aoSalvar={async (dados) => {
            aoSalvar(dados);
            aoFechar();
          }}
        />
      </div>
    </div>
  );
}
