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

const projeto = [
  { href: "/noticias", label: "Notícias" },
  { href: "/cadastro", label: "Inscrever atleta" },
  { href: "/atletas", label: "Área do atleta" },
  { href: "/doacoes", label: "Doações" },
];

export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white">
      <div className="container-x py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
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
                    className="text-sm text-white/60 transition hover:text-white"
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
              {projeto.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-5 text-[10px] font-bold uppercase tracking-wider text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {ano} Vencedores da Ponte Metálica</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/creditos" className="transition hover:text-white">
              Créditos
            </Link>
            <a
              href={ADMIN_LOGIN_URL}
              className="transition hover:text-white"
            >
              Painel administrativo
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
