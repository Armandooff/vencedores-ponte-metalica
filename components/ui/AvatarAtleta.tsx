import Image from "next/image";
import { iniciais } from "@/lib/format";

type AvatarAtletaProps = {
  nome: string;
  foto?: string;
  className?: string;
  sizes?: string;
};

export default function AvatarAtleta({
  nome,
  foto,
  className = "h-10 w-10",
  sizes = "40px",
}: AvatarAtletaProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink/10 text-xs font-bold uppercase tracking-wide text-ink/70 ${className}`}
      aria-hidden="true"
    >
      {foto ? (
        <Image
          src={foto}
          alt=""
          fill
          sizes={sizes}
          unoptimized
          className="object-cover"
        />
      ) : (
        iniciais(nome)
      )}
    </span>
  );
}
