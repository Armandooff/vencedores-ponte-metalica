import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { ArrowRight, Instagram } from "@/components/ui/Icons";

export default function CtaFinal() {
  return (
    <section className="noise relative overflow-hidden bg-sun py-24 text-ink md:py-32">
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-[26rem] w-[26rem] rotate-12 opacity-10">
        <Image
          src="/img/logo.png"
          alt=""
          width={400}
          height={400}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="container-x relative">
        <Reveal className="max-w-3xl">
          <span className="kicker text-ink/60">
            <span className="h-px w-8 bg-ink/40" />
            Faça parte
          </span>
          <h2 className="mt-5 font-display text-[clamp(2.8rem,7vw,6.5rem)] uppercase leading-[0.88]">
            A próxima geração
            <br />
            já está na água.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/75">
            Se você tem um filho, sobrinho ou vizinho que sonha em praticar
            bodyboard, essa é a porta de entrada. As vagas são gratuitas e
            menores de 18 anos precisam da autorização de um responsável.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/cadastro" className="btn-ink">
              Inscrever atleta <ArrowRight size={16} />
            </Link>
            <a
              href="https://www.instagram.com/vencedorespontemetalica/"
              target="_blank"
              rel="noreferrer"
              className="btn border border-ink/30 text-ink hover:bg-ink hover:text-white"
            >
              <Instagram size={16} /> Falar com o projeto
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
