"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { useDados } from "@/lib/store";
import { calcularIdade, ehMenorDeIdade } from "@/lib/idade";
import {
  formatarDataCurta,
  iniciais,
  mascararCpf,
  mascararTelefone,
  rotuloModalidade,
  rotuloNivel,
  rotuloStatus,
  classesStatus,
} from "@/lib/format";
import type { Atleta, Modalidade, Nivel, StatusAtleta } from "@/lib/types";
import { Pencil, Trash, X } from "@/components/ui/Icons";

type Modo = "criar" | "editar" | "ver";

type FormAtleta = {
  nomeCompleto: string;
  email: string;
  senha: string;
  telefone: string;
  dataNascimento: string;
  cpf: string;
  rg: string;
  cep: string;
  bairro: string;
  endereco: string;
  numero: string;
  cadUnico: string;
  codJuv: string;
  modalidade: Modalidade;
  nivel: Nivel;
  status: StatusAtleta;
  nomeMae: string;
  nomePai: string;
  telefoneMae: string;
  telefonePai: string;
  rgMae: string;
  rgPai: string;
};

function paraForm(atleta?: Atleta): FormAtleta {
  return {
    nomeCompleto: atleta?.nomeCompleto ?? "",
    email: atleta?.email ?? "",
    senha: "",
    telefone: atleta?.telefone ?? "",
    dataNascimento: atleta?.dataNascimento ?? "",
    cpf: atleta?.cpf ?? "",
    rg: atleta?.rg ?? "",
    cep: atleta?.cep ?? "",
    bairro: atleta?.bairro ?? "",
    endereco: atleta?.endereco ?? "",
    numero: atleta?.numero ?? "",
    cadUnico: atleta?.cadUnico ?? "",
    codJuv: atleta?.codJuv ?? "",
    modalidade: atleta?.modalidade ?? "bodyboard",
    nivel: atleta?.nivel ?? "iniciante",
    status: atleta?.status ?? "pendente",
    nomeMae: atleta?.nomeMae ?? "",
    nomePai: atleta?.nomePai ?? "",
    telefoneMae: atleta?.telefoneMae ?? "",
    telefonePai: atleta?.telefonePai ?? "",
    rgMae: atleta?.rgMae ?? "",
    rgPai: atleta?.rgPai ?? "",
  };
}

export default function ModalAtleta({
  modo,
  atleta,
  onClose,
  onEditar,
  onExcluir,
}: {
  modo: Modo;
  atleta?: Atleta;
  onClose: () => void;
  onEditar?: (atleta: Atleta) => void;
  onExcluir?: (atleta: Atleta) => void;
}) {
  const { db, criarAtleta, atualizarAtleta } = useDados();
  const [form, setForm] = useState<FormAtleta>(() => paraForm(atleta));
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setForm(paraForm(atleta));
    setErro(null);
  }, [atleta, modo]);

  const menor = ehMenorDeIdade(form.dataNascimento);
  const idade = form.dataNascimento ? calcularIdade(form.dataNascimento) : null;

  const definir = <K extends keyof FormAtleta>(campo: K, valor: FormAtleta[K]) =>
    setForm((atual) => ({ ...atual, [campo]: valor }));

  const titulo =
    modo === "criar"
      ? "Novo atleta"
      : modo === "editar"
      ? "Editar atleta"
      : "Ficha do atleta";

  const salvar = () => {
    setErro(null);
    if (form.nomeCompleto.trim().length < 3) {
      setErro("Informe o nome completo do atleta.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErro("Informe um e-mail válido.");
      return;
    }
    if (!form.dataNascimento) {
      setErro("Informe a data de nascimento.");
      return;
    }
    const duplicado = db.atletas.some(
      (a) =>
        a.email.toLowerCase() === form.email.trim().toLowerCase() &&
        a.id !== atleta?.id
    );
    if (duplicado) {
      setErro("Já existe outro atleta com este e-mail.");
      return;
    }

    const dados = {
      ...form,
      email: form.email.trim().toLowerCase(),
      nomeCompleto: form.nomeCompleto.trim(),
    };

    if (modo === "criar") {
      criarAtleta({
        ...dados,
        senha: form.senha || "123456",
        status: form.status,
        foto: undefined,
      });
    } else if (atleta) {
      const { senha, ...semSenha } = dados;
      atualizarAtleta(atleta.id, senha ? dados : semSenha);
    }
    onClose();
  };

  if (modo === "ver" && atleta) {
    return (
      <Modal open onClose={onClose} title="Ficha do atleta">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sun font-display text-xl text-ink">
            {iniciais(atleta.nomeCompleto)}
          </span>
          <div className="min-w-0">
            <p className="font-display text-xl uppercase leading-tight text-ink">
              {atleta.nomeCompleto}
            </p>
            <p className="truncate text-xs text-ink/60">{atleta.email}</p>
          </div>
          <span
            className={`ml-auto shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${classesStatus(
              atleta.status
            )}`}
          >
            {rotuloStatus[atleta.status]}
          </span>
        </div>

        <div className="mt-6 grid gap-4 rounded-2xl border border-ink/10 bg-white p-5 sm:grid-cols-2">
          <Dado rotulo="Telefone" valor={mascararTelefone(atleta.telefone)} />
          <Dado
            rotulo="Nascimento"
            valor={`${formatarDataCurta(atleta.dataNascimento)} · ${
              calcularIdade(atleta.dataNascimento)
            } anos${ehMenorDeIdade(atleta.dataNascimento) ? " (menor)" : ""}`}
          />
          <Dado rotulo="CPF" valor={mascararCpf(atleta.cpf)} />
          <Dado rotulo="RG" valor={atleta.rg || "—"} />
          <Dado
            rotulo="Modalidade"
            valor={`${rotuloModalidade[atleta.modalidade]} · ${rotuloNivel[atleta.nivel]}`}
          />
          <Dado rotulo="Cadastro" valor={formatarDataCurta(atleta.criadoEm)} />
          <Dado
            rotulo="Endereço"
            valor={`${atleta.endereco}, ${atleta.numero} — ${atleta.bairro}`}
          />
          <Dado rotulo="CadÚnico" valor={atleta.cadUnico || "—"} />
          {(atleta.nomeMae || atleta.nomePai) && (
            <div className="sm:col-span-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink/60">
                Responsáveis
              </p>
              <p className="mt-1 text-sm text-ink/70">
                {[atleta.nomeMae, atleta.nomePai].filter(Boolean).join(" · ")}
                {(atleta.telefoneMae || atleta.telefonePai) && (
                  <span className="mt-1 block text-xs text-ink/60">
                    {[atleta.telefoneMae, atleta.telefonePai]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onEditar?.(atleta)}
            className="btn-sun !px-5 !py-2.5 !text-[11px]"
          >
            <Pencil size={14} /> Editar cadastro
          </button>
          <button
            type="button"
            onClick={() => onExcluir?.(atleta)}
            className="inline-flex items-center gap-2 rounded-full border border-red-200 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-red-600 transition hover:bg-red-50"
          >
            <Trash size={14} /> Excluir
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost-dark !px-5 !py-2.5 !text-[11px]"
          >
            Fechar
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open onClose={onClose} title={titulo} wide>
      <div className="space-y-6">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-sun-700">
            Dados principais
          </h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Campo label="Nome completo" className="sm:col-span-2">
              <input
                value={form.nomeCompleto}
                onChange={(e) => definir("nomeCompleto", e.target.value)}
                className="input"
                placeholder="Nome e sobrenome"
              />
            </Campo>
            <Campo label="E-mail">
              <input
                type="email"
                value={form.email}
                onChange={(e) => definir("email", e.target.value)}
                className="input"
                placeholder="atleta@email.com"
              />
            </Campo>
            <Campo
              label={modo === "criar" ? "Senha de acesso" : "Nova senha (opcional)"}
            >
              <input
                type="text"
                value={form.senha}
                onChange={(e) => definir("senha", e.target.value)}
                className="input"
                placeholder={
                  modo === "criar" ? "Padrão: 123456" : "Deixe em branco para manter"
                }
              />
            </Campo>
            <Campo label="Telefone / WhatsApp">
              <input
                value={form.telefone}
                onChange={(e) => definir("telefone", e.target.value)}
                className="input"
                placeholder="(85) 90000-0000"
              />
            </Campo>
            <Campo label="Data de nascimento">
              <input
                type="date"
                value={form.dataNascimento}
                onChange={(e) => definir("dataNascimento", e.target.value)}
                className="input"
              />
              {idade !== null && (
                <p className="mt-1 text-[11px] text-ink/60">
                  {idade} anos{menor ? " · menor de idade" : ""}
                </p>
              )}
            </Campo>
            <Campo label="CPF">
              <input
                value={form.cpf}
                onChange={(e) => definir("cpf", e.target.value)}
                className="input"
                placeholder="Somente números"
              />
            </Campo>
            <Campo label="RG">
              <input
                value={form.rg}
                onChange={(e) => definir("rg", e.target.value)}
                className="input"
              />
            </Campo>
            <Campo label="Modalidade">
              <div className="input flex items-center justify-between bg-ink/[0.03]">
                <span className="font-semibold text-ink">Bodyboard</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink/45">
                  Única modalidade
                </span>
              </div>
            </Campo>
            <Campo label="Nível">
              <select
                value={form.nivel}
                onChange={(e) => definir("nivel", e.target.value as Nivel)}
                className="input"
              >
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
            </Campo>
            <Campo label="Status da inscrição">
              <select
                value={form.status}
                onChange={(e) =>
                  definir("status", e.target.value as StatusAtleta)
                }
                className="input"
              >
                <option value="pendente">Pendente</option>
                <option value="aprovado">Aprovado</option>
                <option value="reprovado">Reprovado</option>
              </select>
            </Campo>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-sun-700">
            Endereço
          </h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Campo label="CEP">
              <input
                value={form.cep}
                onChange={(e) => definir("cep", e.target.value)}
                className="input"
                placeholder="60000-000"
              />
            </Campo>
            <Campo label="Bairro">
              <input
                value={form.bairro}
                onChange={(e) => definir("bairro", e.target.value)}
                className="input"
              />
            </Campo>
            <Campo label="Endereço" className="sm:col-span-2">
              <input
                value={form.endereco}
                onChange={(e) => definir("endereco", e.target.value)}
                className="input"
              />
            </Campo>
            <Campo label="Número">
              <input
                value={form.numero}
                onChange={(e) => definir("numero", e.target.value)}
                className="input"
              />
            </Campo>
            <Campo label="CadÚnico">
              <input
                value={form.cadUnico}
                onChange={(e) => definir("cadUnico", e.target.value)}
                className="input"
              />
            </Campo>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-sun-700">
            Responsáveis
          </h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Campo label="Nome da mãe">
              <input
                value={form.nomeMae}
                onChange={(e) => definir("nomeMae", e.target.value)}
                className="input"
              />
            </Campo>
            <Campo label="Nome do pai">
              <input
                value={form.nomePai}
                onChange={(e) => definir("nomePai", e.target.value)}
                className="input"
              />
            </Campo>
            <Campo label="Telefone da mãe">
              <input
                value={form.telefoneMae}
                onChange={(e) => definir("telefoneMae", e.target.value)}
                className="input"
              />
            </Campo>
            <Campo label="Telefone do pai">
              <input
                value={form.telefonePai}
                onChange={(e) => definir("telefonePai", e.target.value)}
                className="input"
              />
            </Campo>
          </div>
        </div>

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
            {modo === "criar" ? "Cadastrar atleta" : "Salvar alterações"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Campo({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <span className="field-label">{label}</span>
      {children}
    </div>
  );
}

function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-ink/60">
        {rotulo}
      </p>
      <p className="mt-0.5 text-sm text-ink/70">{valor || "—"}</p>
    </div>
  );
}
