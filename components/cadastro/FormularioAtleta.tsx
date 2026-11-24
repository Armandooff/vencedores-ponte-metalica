"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IMaskInput } from "react-imask";
import { atletaSchema, AtletaFormData } from "@/lib/schemas/atleta";
import { opcoesCategoriaAtleta } from "@/lib/categorias";
import { calcularIdade, ehMenorDeIdade } from "@/lib/idade";
import { useDados } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { ArrowRight, Check, MapPin, Shield, User, Users } from "@/components/ui/Icons";

function Secao({
  icone,
  titulo,
  descricao,
  children,
}: {
  icone: React.ReactNode;
  titulo: string;
  descricao?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-t border-ink/10 pt-8 first:border-t-0 first:pt-0">
      <legend className="sr-only">{titulo}</legend>
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sun/15 text-sun-600">
          {icone}
        </span>
        <div>
          <h2 className="font-display text-xl uppercase leading-none text-ink">
            {titulo}
          </h2>
          {descricao && (
            <p className="mt-1.5 text-xs leading-relaxed text-ink/65">
              {descricao}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}

export default function FormularioAtleta() {
  const router = useRouter();
  const { db, criarAtleta, pronto } = useDados();
  const { iniciarSessaoAtleta } = useAuth();
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [cepNaoEncontrado, setCepNaoEncontrado] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AtletaFormData>({
    resolver: zodResolver(atletaSchema),
    defaultValues: {
      consentimento: false,
    },
  });

  const dataNascimento = watch("dataNascimento");
  const cep = watch("cep");
  const menorDeIdade = ehMenorDeIdade(dataNascimento);
  const idadeAtual = dataNascimento ? calcularIdade(dataNascimento) : null;

  // Autopreenchimento de endereço via ViaCEP
  useEffect(() => {
    const digitos = (cep ?? "").replace(/\D/g, "");
    setCepNaoEncontrado(false);
    if (digitos.length !== 8) return;

    const controller = new AbortController();
    setBuscandoCep(true);

    fetch(`https://viacep.com.br/ws/${digitos}/json/`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((dados: { erro?: boolean; bairro?: string; logradouro?: string }) => {
        if (dados.erro) {
          setCepNaoEncontrado(true);
          return;
        }
        if (dados.bairro) setValue("bairro", dados.bairro, { shouldValidate: true });
        if (dados.logradouro)
          setValue("endereco", dados.logradouro, { shouldValidate: true });
      })
      .catch(() => {
        // Sem conexão, o preenchimento manual continua disponível.
      })
      .finally(() => setBuscandoCep(false));

    return () => {
      controller.abort();
      setBuscandoCep(false);
    };
  }, [cep, setValue]);

  const onSubmit = async (dados: AtletaFormData) => {
    setErroGeral(null);
    if (!pronto) {
      setErroGeral("Aguarde um instante e tente novamente.");
      return;
    }

    const emailNormalizado = dados.email.trim().toLowerCase();
    const jaExiste = db.atletas.some(
      (a) => a.email.toLowerCase() === emailNormalizado
    );
    if (jaExiste) {
      setErroGeral(
        "Já existe uma conta com este e-mail. Tente entrar na área do atleta."
      );
      return;
    }

    const { confirmarSenha, consentimento, ...resto } = dados;
    void confirmarSenha;
    void consentimento;

    const atleta = criarAtleta({
      ...resto,
      email: emailNormalizado,
      status: "pendente",
    });

    iniciarSessaoAtleta(atleta.id);
    router.push("/atletas/painel");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Secao
        icone={<User size={18} />}
        titulo="Conta de acesso"
        descricao="Com estes dados você acompanha novidades, treinos e o status da sua inscrição."
      >
        <div>
          <label className="field-label" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="voce@email.com"
            className="input"
            {...register("email")}
          />
          {errors.email && <p className="erro">{errors.email.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="senha">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo de 6 caracteres"
              className="input"
              {...register("senha")}
            />
            {errors.senha && <p className="erro">{errors.senha.message}</p>}
          </div>
          <div>
            <label className="field-label" htmlFor="confirmarSenha">
              Confirmar senha
            </label>
            <input
              id="confirmarSenha"
              type="password"
              autoComplete="new-password"
              placeholder="Repita a senha"
              className="input"
              {...register("confirmarSenha")}
            />
            {errors.confirmarSenha && (
              <p className="erro">{errors.confirmarSenha.message}</p>
            )}
          </div>
        </div>
      </Secao>

      <Secao
        icone={<Users size={18} />}
        titulo="Dados do atleta"
        descricao="Informações básicas para identificar o atleta e organizar as turmas."
      >
        <div>
          <label className="field-label" htmlFor="nomeCompleto">
            Nome completo
          </label>
          <input
            id="nomeCompleto"
            placeholder="Nome e sobrenome"
            className="input"
            {...register("nomeCompleto")}
          />
          {errors.nomeCompleto && (
            <p className="erro">{errors.nomeCompleto.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="dataNascimento">
              Data de nascimento
            </label>
            <input
              id="dataNascimento"
              type="date"
              className="input"
              {...register("dataNascimento")}
            />
            {errors.dataNascimento && (
              <p className="erro">{errors.dataNascimento.message}</p>
            )}
            {idadeAtual !== null && (
              <p className="mt-1.5 text-[11px] font-medium text-ink/60">
                {idadeAtual} anos
                {menorDeIdade && (
                  <span className="ml-1 text-amber-700">
                    · menor de idade
                  </span>
                )}
              </p>
            )}
          </div>
          <div>
            <label className="field-label" htmlFor="telefone">
              Telefone / WhatsApp
            </label>
            <Controller
              name="telefone"
              control={control}
              render={({ field }) => (
                <IMaskInput
                  id="telefone"
                  mask="(00) 00000-0000"
                  value={field.value ?? ""}
                  onAccept={(value: string) => field.onChange(value)}
                  onBlur={field.onBlur}
                  inputMode="numeric"
                  placeholder="(85) 90000-0000"
                  className="input"
                />
              )}
            />
            {errors.telefone && (
              <p className="erro">{errors.telefone.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="cpf">
              CPF
            </label>
            <Controller
              name="cpf"
              control={control}
              render={({ field }) => (
                <IMaskInput
                  id="cpf"
                  mask="000.000.000-00"
                  value={field.value ?? ""}
                  onAccept={(value: string) => field.onChange(value)}
                  onBlur={field.onBlur}
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  className="input"
                />
              )}
            />
            {errors.cpf && <p className="erro">{errors.cpf.message}</p>}
          </div>
          <div>
            <label className="field-label" htmlFor="categoria">
              Categoria
            </label>
            <select
              id="categoria"
              className="input"
              defaultValue=""
              {...register("categoria")}
            >
              <option value="" disabled>
                Selecione a categoria
              </option>
              {opcoesCategoriaAtleta.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </select>
            {errors.categoria && (
              <p className="erro">{errors.categoria.message}</p>
            )}
          </div>
        </div>
      </Secao>

      <Secao
        icone={<MapPin size={18} />}
        titulo="Endereço"
        descricao="Usamos o CEP para preencher o endereço automaticamente."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="cep">
              CEP
            </label>
            <Controller
              name="cep"
              control={control}
              render={({ field }) => (
                <IMaskInput
                  id="cep"
                  mask="00000-000"
                  value={field.value ?? ""}
                  onAccept={(value: string) => field.onChange(value)}
                  onBlur={field.onBlur}
                  inputMode="numeric"
                  placeholder="60000-000"
                  className="input"
                />
              )}
            />
            {errors.cep && <p className="erro">{errors.cep.message}</p>}
            {buscandoCep && (
              <p className="mt-1.5 text-[11px] text-ink/60">
                Buscando endereço...
              </p>
            )}
            {cepNaoEncontrado && (
              <p className="mt-1.5 text-[11px] text-amber-700">
                CEP não encontrado. Preencha manualmente.
              </p>
            )}
          </div>
          <div>
            <label className="field-label" htmlFor="bairro">
              Bairro
            </label>
            <input id="bairro" className="input" {...register("bairro")} />
            {errors.bairro && <p className="erro">{errors.bairro.message}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
          <div>
            <label className="field-label" htmlFor="endereco">
              Endereço
            </label>
            <input id="endereco" className="input" {...register("endereco")} />
            {errors.endereco && (
              <p className="erro">{errors.endereco.message}</p>
            )}
          </div>
          <div>
            <label className="field-label" htmlFor="numero">
              Número
            </label>
            <input id="numero" className="input" {...register("numero")} />
            {errors.numero && <p className="erro">{errors.numero.message}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="cadUnico">
              Número do CadÚnico
            </label>
            <input id="cadUnico" className="input" {...register("cadUnico")} />
            {errors.cadUnico && (
              <p className="erro">{errors.cadUnico.message}</p>
            )}
          </div>
          <div>
            <label className="field-label" htmlFor="codJuv">
              Código Jovem (opcional)
            </label>
            <input id="codJuv" className="input" {...register("codJuv")} />
          </div>
        </div>
      </Secao>

      {menorDeIdade && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-amber-600" />
            <h3 className="font-display text-xl uppercase leading-none text-amber-800">
              Dados dos responsáveis
            </h3>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-amber-700">
            O atleta é menor de 18 anos, então os dados de um responsável são
            obrigatórios.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="nomeMae">
                Nome da mãe
              </label>
              <input id="nomeMae" className="input" {...register("nomeMae")} />
              {errors.nomeMae && <p className="erro">{errors.nomeMae.message}</p>}
            </div>
            <div>
              <label className="field-label" htmlFor="nomePai">
                Nome do pai
              </label>
              <input id="nomePai" className="input" {...register("nomePai")} />
              {errors.nomePai && <p className="erro">{errors.nomePai.message}</p>}
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="telefoneMae">
                Telefone da mãe
              </label>
              <input
                id="telefoneMae"
                className="input"
                {...register("telefoneMae")}
              />
              {errors.telefoneMae && (
                <p className="erro">{errors.telefoneMae.message}</p>
              )}
            </div>
            <div>
              <label className="field-label" htmlFor="telefonePai">
                Telefone do pai
              </label>
              <input
                id="telefonePai"
                className="input"
                {...register("telefonePai")}
              />
              {errors.telefonePai && (
                <p className="erro">{errors.telefonePai.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="cpfMae">
                CPF da mãe
              </label>
              <Controller
                name="cpfMae"
                control={control}
                render={({ field }) => (
                  <IMaskInput
                    id="cpfMae"
                    mask="000.000.000-00"
                    value={field.value ?? ""}
                    onAccept={(value: string) => field.onChange(value)}
                    onBlur={field.onBlur}
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    className="input"
                  />
                )}
              />
              {errors.cpfMae && (
                <p className="erro">{errors.cpfMae.message}</p>
              )}
            </div>
            <div>
              <label className="field-label" htmlFor="cpfPai">
                CPF do pai
              </label>
              <Controller
                name="cpfPai"
                control={control}
                render={({ field }) => (
                  <IMaskInput
                    id="cpfPai"
                    mask="000.000.000-00"
                    value={field.value ?? ""}
                    onAccept={(value: string) => field.onChange(value)}
                    onBlur={field.onBlur}
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    className="input"
                  />
                )}
              />
              {errors.cpfPai && (
                <p className="erro">{errors.cpfPai.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-ink/10 pt-8">
        <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-ink/60">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-sun"
            {...register("consentimento")}
          />
          <span>
            Autorizo o uso dos dados informados para participação nas
            atividades do projeto Vencedores da Ponte Metálica, nos termos da
            LGPD. As informações são utilizadas apenas para fins de organização
            das turmas e acompanhamento dos atletas.
          </span>
        </label>
        {errors.consentimento && (
          <p className="erro">{errors.consentimento.message}</p>
        )}

        {erroGeral && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erroGeral}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-sun mt-6 w-full"
        >
          {isSubmitting ? "Enviando inscrição..." : "Concluir inscrição"}
          {!isSubmitting && <ArrowRight size={16} />}
        </button>

        <p className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-ink/60">
          <Check size={13} className="text-emerald-600" />
          Sua inscrição será analisada pela coordenação do projeto.
        </p>
      </div>
    </form>
  );
}
