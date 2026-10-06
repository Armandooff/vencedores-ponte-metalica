"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { atletaSchema, AtletaFormData } from "@/lib/schemas/atleta";
import { calcularIdade, ehMenorDeIdade } from "@/lib/idade";

export default function FormularioAtleta({
  valoresIniciais,
  aoSalvar,
}: {
  valoresIniciais?: Partial<AtletaFormData>;
  aoSalvar?: (dados: AtletaFormData) => void | Promise<void>;
}) {
  const [enviado, setEnviado] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AtletaFormData>({
    resolver: zodResolver(atletaSchema),
    defaultValues: valoresIniciais,
  });

  const dataNascimento = watch("dataNascimento");
  const menorDeIdade = ehMenorDeIdade(dataNascimento);
  const idadeAtual = dataNascimento ? calcularIdade(dataNascimento) : null;

  const onSubmit = async (dados: AtletaFormData) => {
    if (aoSalvar) {
      await aoSalvar(dados);
    } else {
      // Simula persistência - troque por chamada real (API Laravel / Firebase)
      console.log("Cadastro enviado:", dados);
    }
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="text-center py-10">
        <p className="text-lg font-semibold text-marinho-900">
          Inscrição enviada com sucesso!
        </p>
        <p className="text-slate-600 mt-2 text-sm">
          Nossa equipe entrará em contato em breve.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* --- Dados gerais do atleta --- */}
      <fieldset className="space-y-4">
        <legend className="font-semibold text-marinho-900 mb-2">Dados do Atleta</legend>

        <div>
          <input {...register("nomeCompleto")} placeholder="Nome completo" className="input" />
          {errors.nomeCompleto && <p className="erro">{errors.nomeCompleto.message}</p>}
        </div>

        <div>
          <label className="text-xs text-slate-500 mb-1 block">Data de nascimento</label>
          <input type="date" {...register("dataNascimento")} className="input" />
          {errors.dataNascimento && <p className="erro">{errors.dataNascimento.message}</p>}
          {idadeAtual !== null && (
            <p className="text-xs text-slate-500 mt-1">
              Idade calculada: {idadeAtual} anos{" "}
              {menorDeIdade && <span className="text-amber-600 font-medium">(menor de idade)</span>}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <input {...register("cpf")} placeholder="CPF" className="input" />
            {errors.cpf && <p className="erro">{errors.cpf.message}</p>}
          </div>
          <div>
            <input {...register("rg")} placeholder="RG" className="input" />
            {errors.rg && <p className="erro">{errors.rg.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <input {...register("cep")} placeholder="CEP" className="input" />
            {errors.cep && <p className="erro">{errors.cep.message}</p>}
          </div>
          <div>
            <input {...register("bairro")} placeholder="Bairro" className="input" />
            {errors.bairro && <p className="erro">{errors.bairro.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <input {...register("endereco")} placeholder="Endereço" className="input" />
            {errors.endereco && <p className="erro">{errors.endereco.message}</p>}
          </div>
          <div>
            <input {...register("numero")} placeholder="Número" className="input" />
            {errors.numero && <p className="erro">{errors.numero.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input {...register("codJuv")} placeholder="Cod Juv (opcional)" className="input" />
          <div>
            <input {...register("cadUnico")} placeholder="Número do CadÚnico" className="input" />
            {errors.cadUnico && <p className="erro">{errors.cadUnico.message}</p>}
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-500 mb-1 block">Foto de perfil</label>
          <input type="file" accept="image/*" className="text-sm" />
        </div>
      </fieldset>

      {/* --- Bloco condicional: só renderiza se o atleta for menor de idade --- */}
      {menorDeIdade && (
        <fieldset className="space-y-4 border-l-4 border-amber-400 pl-4 bg-amber-50/50 py-4 rounded-r-lg">
          <legend className="font-semibold text-amber-700">
            Dados dos Responsáveis
          </legend>
          <p className="text-xs text-amber-700 -mt-2">
            Obrigatório porque o atleta é menor de 18 anos.
          </p>

          <div>
            <input {...register("nomeMae")} placeholder="Nome da mãe" className="input" />
            {errors.nomeMae && <p className="erro">{errors.nomeMae.message}</p>}
          </div>
          <div>
            <input {...register("nomePai")} placeholder="Nome do pai" className="input" />
            {errors.nomePai && <p className="erro">{errors.nomePai.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input {...register("telefoneMae")} placeholder="Telefone da mãe" className="input" />
              {errors.telefoneMae && <p className="erro">{errors.telefoneMae.message}</p>}
            </div>
            <div>
              <input {...register("telefonePai")} placeholder="Telefone do pai" className="input" />
              {errors.telefonePai && <p className="erro">{errors.telefonePai.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input {...register("rgMae")} placeholder="RG da mãe" className="input" />
              {errors.rgMae && <p className="erro">{errors.rgMae.message}</p>}
            </div>
            <div>
              <input {...register("rgPai")} placeholder="RG do pai" className="input" />
              {errors.rgPai && <p className="erro">{errors.rgPai.message}</p>}
            </div>
          </div>
        </fieldset>
      )}

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? "Enviando..." : "Concluir Cadastro"}
      </button>
    </form>
  );
}
