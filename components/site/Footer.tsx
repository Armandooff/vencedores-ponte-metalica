import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { ADMIN_LOGIN_URL } from "@/lib/app-urls";
import { Instagram, MapPin } from "@/components/ui/Icons";

const navegacao = [
  { href: "/#projeto", label: "O projeto" },
  { href: "/#treinos", label: "Treinos" },
  { href: "/#conquistas", label: "Conquistas" },
  { href: "/#galeria", label: "Galeria" },
];

const projeto = [
  { href: "/noticias", label: "Notícias" },
  { href: "/cadastro", label: "Inscrever atleta" },
  { href: "/atletas", label: "Área do atleta" },
  { href: "/doacoes", label: "Doações" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
            Projeto social de bodyboard que usa o mar como ferramenta de
            transformação para crianças e jovens da Praia de Iracema, em
            Fortaleza (CE).
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://www.instagram.com/vencedorespontemetalica/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram do projeto"
              className="rounded-full border border-white/15 p-2.5 text-white/70 transition hover:border-sun hover:text-sun"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.instagram.com/gleusonfarias/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white/70 transition hover:border-sun hover:text-sun"
            >
              @gleusonfarias
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.28em] text-sun">
            Navegação
          </h3>
          <ul className="mt-5 space-y-3">
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
        </div>

        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.28em] text-sun">
            Participe
          </h3>
          <ul className="mt-5 space-y-3">
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

          <div className="mt-6 flex items-start gap-2 text-sm text-white/60">
            <MapPin size={16} className="mt-0.5 shrink-0 text-sun" />
            <span>
              Praia de Iracema
              <br />
              Fortaleza · Ceará
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-[11px] uppercase tracking-widest text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Vencedores da Ponte Metálica</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/creditos" className="transition hover:text-white/70">
              Créditos
            </Link>
            <Link href={ADMIN_LOGIN_URL} className="transition hover:text-white/70">
              Painel administrativo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
