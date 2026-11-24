"use client";

import { useRef, useState } from "react";
import { IMaskInput } from "react-imask";
import Modal from "@/components/ui/Modal";
import AvatarAtleta from "@/components/ui/AvatarAtleta";
import { useDados } from "@/lib/store";
import type { Atleta } from "@/lib/types";
import { X } from "@/components/ui/Icons";

const LIMITE_FOTO = 8 * 1024 * 1024;

async function comprimirFoto(arquivo: File) {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    leitor.onload = () => resolve(String(leitor.result));
    leitor.readAsDataURL(arquivo);
  });

  const imagem = await new Promise<HTMLImageElement>((resolve, reject) => {
    const elemento = new Image();
    elemento.onerror = () => reject(new Error("Arquivo de imagem inválido."));
    elemento.onload = () => resolve(elemento);
    elemento.src = dataUrl;
  });

  const lado = Math.min(720, Math.max(imagem.width, imagem.height));
  const escala = lado / Math.max(imagem.width, imagem.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(imagem.width * escala);
  canvas.height = Math.round(imagem.height * escala);
  const contexto = canvas.getContext("2d");
  if (!contexto) throw new Error("Não foi possível processar a imagem.");
  contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

export default function ModalPerfilAtleta({
  atleta,
  onClose,
}: {
  atleta: Atleta;
  onClose: () => void;
}) {
  const { atualizarAtleta } = useDados();
  const inputFoto = useRef<HTMLInputElement>(null);
  const [telefone, setTelefone] = useState(atleta.telefone);
  const [historia, setHistoria] = useState(atleta.historia ?? "");
  const [foto, setFoto] = useState(atleta.foto);
  const [erro, setErro] = useState<string | null>(null);
  const [processando, setProcessando] = useState(false);

  const escolherFoto = async (arquivo?: File) => {
    if (!arquivo) return;
    setErro(null);
    if (!arquivo.type.startsWith("image/")) {
      setErro("Escolha um arquivo de imagem.");
      return;
    }
    if (arquivo.size > LIMITE_FOTO) {
      setErro("A foto deve ter no máximo 8 MB.");
      return;
    }
    setProcessando(true);
    try {
      setFoto(await comprimirFoto(arquivo));
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível usar a foto.");
    } finally {
      setProcessando(false);
      if (inputFoto.current) inputFoto.current.value = "";
    }
  };

  const salvar = () => {
    setErro(null);
    const telefoneLimpo = telefone.replace(/\D/g, "");
    if (telefoneLimpo.length < 10) {
      setErro("Informe um telefone com DDD.");
      return;
    }
    if (historia.length > 600) {
      setErro("Sua história pode ter no máximo 600 caracteres.");
      return;
    }
    atualizarAtleta(atleta.id, {
      telefone: telefoneLimpo,
      historia: historia.trim(),
      foto,
    });
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Editar meu perfil"
      description="Atualize sua foto, telefone e conte um pouco da sua história."
      wide
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-ink/10 bg-white p-4 sm:flex-row sm:items-center">
          <AvatarAtleta
            nome={atleta.nomeCompleto}
            foto={foto}
            className="h-24 w-24 text-xl"
            sizes="96px"
          />
          <div className="flex flex-1 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputFoto.current?.click()}
              disabled={processando}
              className="btn-sun !px-5 !py-3 !text-[11px] shadow-[0_8px_24px_rgba(255,107,24,0.28)] disabled:opacity-50"
            >
              {processando ? "Processando..." : "Escolher foto"}
            </button>
            {foto && (
              <button
                type="button"
                onClick={() => setFoto(undefined)}
                className="btn-ghost-dark !px-4 !py-2.5 !text-[11px]"
              >
                Remover foto
              </button>
            )}
            <input
              ref={inputFoto}
              type="file"
              accept="image/*"
              aria-label="Escolher foto de perfil"
              className="sr-only"
              onChange={(e) => escolherFoto(e.target.files?.[0])}
            />
            <p className="basis-full text-[11px] leading-relaxed text-ink/70">
              JPG ou PNG, até 8 MB. A imagem é reduzida automaticamente.
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="perfil-telefone" className="field-label">
            Telefone / WhatsApp
          </label>
          <IMaskInput
            id="perfil-telefone"
            mask="(00) 00000-0000"
            value={telefone}
            onAccept={(valor: string) => setTelefone(valor)}
            className="input"
            placeholder="(85) 90000-0000"
            inputMode="tel"
          />
        </div>

        <div>
          <div className="flex items-end justify-between gap-3">
            <label htmlFor="perfil-historia" className="field-label">
              Minha história
            </label>
            <span className="text-[10px] text-ink/70">{historia.length}/600</span>
          </div>
          <textarea
            id="perfil-historia"
            value={historia}
            onChange={(e) => setHistoria(e.target.value.slice(0, 600))}
            rows={6}
            className="input resize-none"
            placeholder="Conte como o bodyboard entrou na sua vida, o que você aprendeu no projeto e quais são seus sonhos..."
            maxLength={600}
          />
        </div>

        <p className="rounded-xl bg-sun/10 px-4 py-3 text-[11px] leading-relaxed text-ink/65">
          Nome, e-mail, CPF, data de nascimento, categoria e dados dos
          responsáveis continuam sendo atualizados pela coordenação.
        </p>

        {erro && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
            disabled={processando}
            className="btn-sun !px-5 !py-2.5 !text-[11px] disabled:opacity-50"
          >
            Salvar perfil
          </button>
        </div>
      </div>
    </Modal>
  );
}
