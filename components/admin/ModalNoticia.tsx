"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { useDados } from "@/lib/store";
import type { CategoriaNoticia, Noticia } from "@/lib/types";
import { hojeISO } from "@/lib/format";
import { Image as ImageIcon, X } from "@/components/ui/Icons";

const categorias: CategoriaNoticia[] = [
  "Aviso",
  "Treino",
  "Competição",
  "Comunidade",
  "Notícia",
];

const imagens = [
  { src: "/img/hero.jpg", label: "Ponte dos Ingleses ao anoitecer" },
  { src: "/img/ponte.jpg", label: "Ponte dos Ingleses de dia" },
  { src: "/img/podio-treino.jpg", label: "Pódio do projeto" },
  { src: "/img/podio-conquistas.jpg", label: "Pódio do circuito" },
  { src: "/img/vencedores.jpg", label: "Atleta celebrando a vitória" },
  { src: "/img/treino-onda.jpg", label: "Bodyboard na onda" },
  { src: "/img/galeria-competicao.jpg", label: "Celebração da equipe" },
  { src: "/img/noticia-podio.jpg", label: "Pódio feminino" },
  { src: "/img/noticia-trofeu.jpg", label: "Troféu do circuito" },
  { src: "/img/noticia-equipamentos.jpg", label: "Equipamento do projeto" },
  { src: "/img/comunidade.jpg", label: "Comunidade do projeto" },
  { src: "/img/iracema.jpg", label: "Projeto sob a Ponte dos Ingleses" },
];

type FormNoticia = {
  titulo: string;
  resumo: string;
  conteudo: string;
  categoria: CategoriaNoticia;
  imagem: string;
  autor: string;
  publicada: boolean;
  destaque: boolean;
  publicadoEm: string;
};

export default function ModalNoticia({
  noticia,
  onClose,
}: {
  noticia?: Noticia;
  onClose: () => void;
}) {
  const { criarNoticia, atualizarNoticia } = useDados();
  const [form, setForm] = useState<FormNoticia>({
    titulo: noticia?.titulo ?? "",
    resumo: noticia?.resumo ?? "",
    conteudo: noticia?.conteudo ?? "",
    categoria: noticia?.categoria ?? "Notícia",
    imagem: noticia?.imagem ?? "/img/hero.jpg",
    autor: noticia?.autor ?? "Equipe Vencedores",
    publicada: noticia?.publicada ?? true,
    destaque: noticia?.destaque ?? false,
    publicadoEm:
      noticia?.publicadoEm ?? hojeISO(),
  });
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!noticia) return;
    setForm({
      titulo: noticia.titulo,
      resumo: noticia.resumo,
      conteudo: noticia.conteudo,
      categoria: noticia.categoria,
      imagem: noticia.imagem,
      autor: noticia.autor,
      publicada: noticia.publicada,
      destaque: noticia.destaque,
      publicadoEm: noticia.publicadoEm,
    });
  }, [noticia]);

  const definir = <K extends keyof FormNoticia>(
    campo: K,
    valor: FormNoticia[K]
  ) => setForm((atual) => ({ ...atual, [campo]: valor }));

  const salvar = () => {
    setErro(null);
    if (form.titulo.trim().length < 5) {
      setErro("Informe um título com pelo menos 5 caracteres.");
      return;
    }
    if (form.resumo.trim().length < 10) {
      setErro("O resumo precisa ter pelo menos 10 caracteres.");
      return;
    }
    if (form.conteudo.trim().length < 20) {
      setErro("O conteúdo da notícia precisa ter pelo menos 20 caracteres.");
      return;
    }

    if (noticia) {
      atualizarNoticia(noticia.id, form);
    } else {
      criarNoticia(form);
    }
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={noticia ? "Editar notícia" : "Nova notícia"}
      wide
    >
      <div className="space-y-5">
        <div>
          <span className="field-label">Título</span>
          <input
            value={form.titulo}
            onChange={(e) => definir("titulo", e.target.value)}
            className="input"
            placeholder="Ex.: Treino de sábado confirmado"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <span className="field-label">Categoria</span>
            <select
              value={form.categoria}
              onChange={(e) =>
                definir("categoria", e.target.value as CategoriaNoticia)
              }
              className="input"
            >
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className="field-label">Autor</span>
            <input
              value={form.autor}
              onChange={(e) => definir("autor", e.target.value)}
              className="input"
            />
          </div>
          <div>
            <span className="field-label">Data de publicação</span>
            <input
              type="date"
              value={form.publicadoEm}
              onChange={(e) => definir("publicadoEm", e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div>
          <span className="field-label">Imagem de capa</span>
          <select
            value={form.imagem}
            onChange={(e) => definir("imagem", e.target.value)}
            className="input"
          >
            {imagens.map((imagem) => (
              <option key={imagem.src} value={imagem.src}>
                {imagem.label}
              </option>
            ))}
          </select>
          <div className="relative mt-3 aspect-[16/7] overflow-hidden rounded-xl border border-ink/10 bg-ink/5">
            {form.imagem ? (
              <Image
                src={form.imagem}
                alt="Prévia da imagem de capa"
                fill
                sizes="640px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-ink/30">
                <ImageIcon size={24} />
              </div>
            )}
          </div>
        </div>

        <div>
          <span className="field-label">Resumo</span>
          <textarea
            value={form.resumo}
            onChange={(e) => definir("resumo", e.target.value)}
            rows={2}
            className="input resize-none"
            placeholder="Frase curta que aparece nos cards"
          />
        </div>

        <div>
          <span className="field-label">Conteúdo</span>
          <textarea
            value={form.conteudo}
            onChange={(e) => definir("conteudo", e.target.value)}
            rows={7}
            className="input resize-y"
            placeholder="Separe os parágrafos com uma linha em branco."
          />
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-4 sm:flex-row sm:gap-8">
          <label className="flex cursor-pointer items-center gap-3 text-sm text-ink/70">
            <input
              type="checkbox"
              checked={form.publicada}
              onChange={(e) => definir("publicada", e.target.checked)}
              className="h-4 w-4 accent-sun"
            />
            Publicar imediatamente
          </label>
          <label className="flex cursor-pointer items-center gap-3 text-sm text-ink/70">
            <input
              type="checkbox"
              checked={form.destaque}
              onChange={(e) => definir("destaque", e.target.checked)}
              className="h-4 w-4 accent-sun"
            />
            Marcar como destaque
          </label>
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
            {noticia ? "Salvar alterações" : "Publicar notícia"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
