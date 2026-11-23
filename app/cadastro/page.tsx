import type { Metadata } from "next";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import FormularioAtleta from "@/components/cadastro/FormularioAtleta";
import { Check, Shield, Waves } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Inscrição de atleta",
  description:
    "Inscreva um atleta no projeto Vencedores da Ponte Metálica. Vagas gratuitas para bodyboard na Praia de Iracema.",
};

export default function PaginaCadastro() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        <section className="relative overflow-hidden bg-ink pb-20 pt-32 text-white">
          <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-sun/15 blur-[100px]" />
          <div className="container-x relative">
            <span className="kicker text-sun">
              <span className="h-px w-8 bg-sun" />
              Inscrição de atleta
            </span>
            <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.8rem,6vw,5rem)] uppercase leading-[0.9]">
              Sua vaga
              <br />
              começa aqui.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
              Preencha a ficha do atleta para participar dos treinos gratuitos
              de bodyboard. Menores de 18 anos precisam dos dados de um
              responsável.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[11px] font-semibold uppercase tracking-wider text-white/50">
              <span className="inline-flex items-center gap-2">
                <Check size={14} className="text-sun" /> 100% gratuito
              </span>
              <span className="inline-flex items-center gap-2">
                <Waves size={14} className="text-sun" /> Equipamentos inclusos
              </span>
              <span className="inline-flex items-center gap-2">
                <Shield size={14} className="text-sun" /> Dados protegidos
              </span>
            </div>
          </div>
        </section>

        <section className="container-x -mt-10 pb-24">
          <div className="mx-auto max-w-3xl rounded-3xl border border-ink/10 bg-white p-6 shadow-card sm:p-10">
            <FormularioAtleta />
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-center text-[11px] leading-relaxed text-ink/60">
            Após o envio, a coordenação analisa a inscrição e entra em contato
            pelo telefone informado. Você também pode acompanhar tudo pela área
            do atleta.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
