"use client";

import { useState } from "react";
import { Check, Copy } from "@/components/ui/Icons";

export default function CopiarPix({ chave }: { chave: string }) {
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState(false);

  const copiar = async () => {
    setErro(false);
    let copiou = false;

    try {
      await navigator.clipboard.writeText(chave);
      copiou = true;
    } catch {
      const area = document.createElement("textarea");
      area.value = chave;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        copiou = document.execCommand("copy");
      } catch {
        copiou = false;
      }
      document.body.removeChild(area);
    }

    if (copiou) {
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2500);
    } else {
      setCopiado(false);
      setErro(true);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={copiar}
        className="btn-ghost-dark w-full justify-center !px-5 !py-3 !text-[11px]"
      >
        {copiado ? <Check size={15} /> : <Copy size={15} />}
        {copiado ? "Chave copiada" : "Copiar chave Pix"}
      </button>
      <p aria-live="polite" className="mt-2 min-h-4 text-center text-[11px] text-ink/60">
        {copiado
          ? "A chave Pix foi copiada."
          : erro
            ? "Não foi possível copiar. Selecione a chave acima."
            : ""}
      </p>
    </div>
  );
}
