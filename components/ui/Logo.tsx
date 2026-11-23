import Image from "next/image";

export function LogoMark({
  className = "h-12 w-12",
  priority = false,
  alt = "Logo Vencedores da Ponte Metálica",
}: {
  className?: string;
  priority?: boolean;
  alt?: string;
}) {
  return (
    <Image
      src="/img/logo.png"
      alt={alt}
      width={400}
      height={400}
      priority={priority}
      className={`${className} object-contain`}
    />
  );
}

export default function Logo({
  variant = "light",
  className = "",
  priority = false,
}: {
  variant?: "light" | "dark";
  className?: string;
  priority?: boolean;
}) {
  const escuro = variant === "dark";
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <LogoMark className="h-11 w-11 shrink-0" priority={priority} alt="" />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[19px] uppercase leading-none tracking-wide ${
            escuro ? "text-ink" : "text-white"
          }`}
        >
          Vencedores
        </span>
        <span
          className={`mt-1 text-[9px] font-bold uppercase leading-none tracking-[0.22em] ${
            escuro ? "text-ink/55" : "text-white/55"
          }`}
        >
          da Ponte Metálica
        </span>
      </span>
    </span>
  );
}
