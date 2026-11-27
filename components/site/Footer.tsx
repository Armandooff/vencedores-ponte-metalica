import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { ADMIN_LOGIN_URL } from "@/lib/app-urls";

const navegacao = [
  { href: "/#projeto", label: "O projeto" },
  { href: "/#treinos", label: "Treinos" },
  { href: "/#conquistas", label: "Conquistas" },
  { href: "/#galeria", label: "Galeria" },
  { href: "/#contato", label: "Contato" },
];

const participe = [
  { href: "/cadastro", label: "Inscrever atleta" },
  { href: "/atletas", label: "Área do atleta" },
  { href: "/voluntariado", label: "Voluntariado" },
  { href: "/parceiros", label: "Parceiros" },
  { href: "/doacoes", label: "Doações" },
];

const comunidade = [
  { href: "/agenda", label: "Agenda" },
  { href: "/noticias", label: "Notícias" },
  { href: "/historias", label: "Histórias" },
  { href: "/ajuda", label: "Central de ajuda" },
  { href: "/responsaveis", label: "Para responsáveis" },
  { href: "/noticias#newsletter", label: "Newsletter" },
];

export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white">
      <div className="container-x py-10 md:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              Projeto social de bodyboard na Praia de Iracema. Esporte,
              educação e comunidade para crianças e jovens.
            </p>
          </div>

          <nav aria-label="Navegação do site">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-sun">
              Navegação
            </p>
            <ul className="mt-4 space-y-2.5">
              {navegacao.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-[24px] items-center text-sm text-white/60 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Participe do projeto">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-sun">
              Participe
            </p>
            <ul className="mt-4 space-y-2.5">
              {participe.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-[24px] items-center text-sm text-white/60 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Comunidade do projeto">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-sun">
              Comunidade
            </p>
            <ul className="mt-4 space-y-2.5">
              {comunidade.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-[24px] items-center text-sm text-white/60 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-9 flex flex-col gap-3 border-t border-white/10 pt-5 text-[10px] font-bold uppercase tracking-wider text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {ano} Vencedores da Ponte Metálica</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href="/creditos"
              className="inline-flex min-h-[24px] items-center transition hover:text-white"
            >
              Créditos
            </Link>
            <a
              href={ADMIN_LOGIN_URL}
              className="inline-flex min-h-[24px] items-center transition hover:text-white"
            >
              Painel administrativo
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
