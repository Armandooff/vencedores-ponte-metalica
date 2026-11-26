import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import {
  ArrowRight,
  ArrowUpRight,
  Instagram,
  MapPin,
  Whatsapp,
} from "@/components/ui/Icons";

const WHATSAPP_URL =
  "https://wa.me/5585999990000?text=Ol%C3%A1!%20Quero%20falar%20com%20o%20Vencedores%20da%20Ponte%20Met%C3%A1lica.";
const INSTAGRAM_URL = "https://www.instagram.com/vencedorespontemetalica/";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Praia+de+Iracema+Fortaleza";

const canais = [
  {
    label: "WhatsApp",
    valor: "Fale com a gente",
    href: WHATSAPP_URL,
    icone: Whatsapp,
    externo: true,
  },
  {
    label: "Instagram",
    valor: "@vencedorespontemetalica",
    href: INSTAGRAM_URL,
    icone: Instagram,
    externo: true,
  },
  {
    label: "Onde treinamos",
    valor: "Praia de Iracema",
    href: MAPS_URL,
    icone: MapPin,
    externo: true,
  },
];

export default function CtaFinal() {
  return (
    <section
      id="contato"
      className="noise relative overflow-hidden bg-sun py-16 text-ink md:py-20"
    >
      <div className="pointer-events-none absolute -right-16 top-1/2 hidden -translate-y-1/2 opacity-10 md:block">
        <Image
          src="/img/logo.png"
          alt=""
          width={520}
          height={520}
          className="h-auto w-[28rem]"
        />
      </div>

      <div className="container-x relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <Reveal>
          <span className="kicker text-ink/70">
            <span className="h-px w-8 bg-ink/40" />
            Contato
          </span>
          <h2 className="mt-5 max-w-xl font-display text-[clamp(2.8rem,6vw,5.5rem)] uppercase leading-[0.9]">
            Vamos conversar?
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink/80">
            Tire dúvidas, inscreva um atleta ou apoie o projeto. A coordenação
            está por aqui.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/cadastro" className="btn-ink">
              Inscrever atleta <ArrowRight size={16} />
            </Link>
            <Link
              href="/doacoes"
              className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-ink transition hover:bg-ink hover:text-sun"
            >
              Apoiar o projeto
            </Link>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <nav
            aria-label="Contato e redes sociais"
            className="border-t border-ink/20"
          >
            {canais.map((canal) => {
              const Icone = canal.icone;
              return (
                <a
                  key={canal.label}
                  href={canal.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 border-b border-ink/20 py-5"
                >
                  <span className="flex items-center gap-3">
                    <Icone size={18} className="shrink-0 text-ink/70" />
                    <span>
                      <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-ink/70">
                        {canal.label}
                      </span>
                      <span className="mt-1 block font-display text-2xl uppercase leading-none">
                        {canal.valor}
                      </span>
                    </span>
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              );
            })}
          </nav>
        </Reveal>
      </div>
    </section>
  );
}
