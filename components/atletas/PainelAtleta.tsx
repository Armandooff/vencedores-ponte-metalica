"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/lib/auth";
import { useDados } from "@/lib/store";
import {
  classesCategoria,
  classesStatus,
  formatarData,
  formatarDataCurta,
  hojeISO,
  iniciais,
  mascararTelefone,
  rotuloCategoria,
  rotuloModalidade,
  rotuloNivel,
  rotuloStatus,
} from "@/lib/format";
import type { CategoriaNoticia, Noticia } from "@/lib/types";
import {
  ArrowRight,
  Bell,
  Calendar,
  Clock,
  Instagram,
  LogOut,
  MapPin,
  Newspaper,
  User,
  Waves,
} from "@/components/ui/Icons";

const categorias: ("Todas" | CategoriaNoticia)[] = [
  "Todas",
  "Aviso",
  "Treino",
  "Competição",
  "Comunidade",
  "Notícia",
];

const mensagensStatus = {
  aprovado:
    "Sua inscrição foi aprovada. Bem-vindo(a) à equipe — nos vemos na areia!",
  pendente:
    "Recebemos sua inscrição. A coordenação está analisando seus dados e entra em contato em breve.",
  reprovado:
    "Sua inscrição não foi aprovada neste momento. Fale com a coordenação para entender os próximos passos.",
};

export default function PainelAtleta() {
  const router = useRouter();
  const { sessao, atletaAtual, pronto, sair } = useAuth();
  const { db, pronto: dadosProntos } = useDados();
  const [categoria, setCategoria] = useState<(typeof categorias)[number]>("Todas");
  const [noticiaAberta, setNoticiaAberta] = useState<Noticia | null>(null);

  useEffect(() => {
    if (!pronto) return;
    if (!sessao || sessao.tipo !== "atleta") {
      router.replace("/atletas");
      return;
    }
    if (!atletaAtual && dadosProntos) {
      sair();
      router.replace("/atletas");
    }
  }, [pronto, sessao, atletaAtual, dadosProntos, router, sair]);

  const noticias = useMemo(
    () =>
      [...db.noticias]
        .filter((n) => n.publicada)
        .sort((a, b) => b.publicadoEm.localeCompare(a.publicadoEm)),
    [db.noticias]
  );

  const noticiasFiltradas = useMemo(
    () =>
      categoria === "Todas"
        ? noticias
        : noticias.filter((n) => n.categoria === categoria),
    [noticias, categoria]
  );

  const proximoEvento = useMemo(() => {
    const hoje = hojeISO();
    return [...db.eventos]
      .filter((e) => e.ativo && e.data >= hoje)
      .sort((a, b) => `${a.data}${a.hora}`.localeCompare(`${b.data}${b.hora}`))[0];
  }, [db.eventos]);

  if (!pronto || !atletaAtual) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink text-white">
        <Logo priority />
        <span className="h-1 w-24 overflow-hidden rounded-full bg-white/10">
          <span className="block h-full w-1/2 animate-pulse rounded-full bg-sun" />
        </span>
      </div>
    );
  }

  const primeiroNome = atletaAtual.nomeCompleto.split(" ")[0];

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 text-white backdrop-blur-xl">
        <div className="container-x flex h-20 items-center justify-between gap-4">
          <Link href="/">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <a
              href="#novidades"
              className="text-[13px] font-medium text-white/70 transition hover:text-sun"
            >
              Novidades
            </a>
            <a
              href="#perfil"
              className="text-[13px] font-medium text-white/70 transition hover:text-sun"
            >
              Meu perfil
            </a>
            <Link
              href="/noticias"
              className="text-[13px] font-medium text-white/70 transition hover:text-sun"
            >
              Notícias
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden rounded-full border border-white/20 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-white/80 transition hover:border-white/50 hover:text-white sm:inline-flex"
            >
              Ver site
            </Link>
            <button
              type="button"
              onClick={() => {
                sair();
                router.replace("/atletas");
              }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-white transition hover:bg-red-500/20 hover:text-red-200"
            >
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="bg-ink pb-24 pt-10 text-white">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="kicker text-sun">
                <span className="h-1.5 w-1.5 rounded-full bg-sun" />
                Portal do atleta
              </p>
              <h1 className="mt-4 font-display text-[clamp(2.6rem,6vw,4.8rem)] uppercase leading-[0.92]">
                E aí, {primeiroNome}.
                <br />
                <span className="text-white/40">Pronto para a próxima onda?</span>
              </h1>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sun font-display text-lg text-ink">
                {iniciais(atletaAtual.nomeCompleto)}
              </span>
              <div>
                <p className="text-sm font-semibold">{atletaAtual.nomeCompleto}</p>
                <p className="text-[11px] uppercase tracking-wider text-white/60">
                  {rotuloModalidade[atletaAtual.modalidade]} ·{" "}
                  {rotuloNivel[atletaAtual.nivel]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-x -mt-14 relative z-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60">
                Status da inscrição
              </span>
              <User size={16} className="text-sun-700" />
            </div>
            <span
              className={`mt-3 inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${classesStatus(
                atletaAtual.status
              )}`}
            >
              {rotuloStatus[atletaAtual.status]}
            </span>
            <p className="mt-3 text-xs leading-relaxed text-ink/65">
              {mensagensStatus[atletaAtual.status]}
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60">
                Sua modalidade
              </span>
              <Waves size={16} className="text-sun-700" />
            </div>
            <p className="mt-3 font-display text-3xl uppercase leading-none text-ink">
              {rotuloModalidade[atletaAtual.modalidade]}
            </p>
            <p className="mt-2 text-xs text-ink/65">
              Nível {rotuloNivel[atletaAtual.nivel].toLowerCase()}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ink/65">
              Atleta desde {formatarDataCurta(atletaAtual.criadoEm)}.
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60">
                Próximo treino
              </span>
              <Calendar size={16} className="text-sun-700" />
            </div>
            {proximoEvento ? (
              <>
                <p className="mt-3 font-display text-3xl uppercase leading-none text-ink">
                  {formatarData(proximoEvento.data, {
                    day: "2-digit",
                    month: "short",
                    year: undefined,
                  })}
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-ink/65">
                  <Clock size={12} /> {proximoEvento.hora} · {proximoEvento.turma}
                </p>
                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-ink/65">
                  {proximoEvento.titulo}
                </p>
              </>
            ) : (
              <p className="mt-3 text-xs leading-relaxed text-ink/65">
                Nenhum treino agendado no momento. Fique de olho nas novidades.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60">
                Novidades
              </span>
              <Bell size={16} className="text-sun-700" />
            </div>
            <p className="mt-3 font-display text-4xl uppercase leading-none text-ink">
              {noticias.length}
            </p>
            <p className="mt-2 text-xs text-ink/65">
              publicações do projeto
            </p>
            <a
              href="#novidades"
              className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-sun-700"
            >
              Ver novidades <ArrowRight size={12} />
            </a>
          </div>
        </div>
      </div>

      <main className="container-x grid gap-8 py-12 lg:grid-cols-[1fr_340px]">
        <section id="novidades" className="min-w-0">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="kicker text-sun-700">
                <span className="h-px w-6 bg-sun-600" />
                Fique por dentro
              </p>
              <h2 className="mt-2 font-display text-3xl uppercase leading-none text-ink">
                Novidades do projeto
              </h2>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink/60">
              {noticiasFiltradas.length} publicações
            </span>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categorias.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoria(cat)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                  categoria === cat
                    ? "border-ink bg-ink text-white"
                    : "border-ink/15 bg-white text-ink/65 hover:border-ink/40"
                }`}
              >
                {cat === "Todas" ? "Todas" : rotuloCategoria[cat]}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            {noticiasFiltradas.length === 0 && (
              <div className="rounded-2xl border border-dashed border-ink/15 bg-white/50 p-10 text-center">
                <Newspaper size={28} className="mx-auto text-ink/25" />
                <p className="mt-3 text-sm text-ink/65">
                  Nenhuma novidade nesta categoria por enquanto.
                </p>
              </div>
            )}

            {noticiasFiltradas.map((noticia) => (
              <article
                key={noticia.id}
                className="group overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card transition hover:-translate-y-0.5"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative h-44 w-full shrink-0 sm:h-auto sm:w-56">
                    <Image
                      src={noticia.imagem}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 224px"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${classesCategoria(
                          noticia.categoria
                        )}`}
                      >
                        {noticia.categoria}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink/60">
                        {formatarData(noticia.publicadoEm)}
                      </span>
                      {noticia.destaque && (
                        <span className="rounded-full bg-ink px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sun">
                          Destaque
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 font-display text-xl uppercase leading-tight text-ink">
                      {noticia.titulo}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/65">
                      {noticia.resumo}
                    </p>
                    <button
                      type="button"
                      onClick={() => setNoticiaAberta(noticia)}
                      className="mt-auto inline-flex items-center gap-1.5 self-start pt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-sun-700 transition hover:text-ink"
                    >
                      Ler notícia <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-5">
          <div
            id="perfil"
            className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sun font-display text-lg text-ink">
                {iniciais(atletaAtual.nomeCompleto)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">
                  {atletaAtual.nomeCompleto}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-ink/60">
                  Atleta do projeto
                </p>
              </div>
            </div>

            <dl className="mt-5 space-y-3 text-xs">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-ink/60">
                  E-mail
                </dt>
                <dd className="mt-0.5 truncate text-ink/70">{atletaAtual.email}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-ink/60">
                  Telefone
                </dt>
                <dd className="mt-0.5 text-ink/70">
                  {mascararTelefone(atletaAtual.telefone)}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-ink/60">
                  Modalidade
                </dt>
                <dd className="mt-0.5 text-ink/70">
                  {rotuloModalidade[atletaAtual.modalidade]} ·{" "}
                  {rotuloNivel[atletaAtual.nivel]}
                </dd>
              </div>
            </dl>

            <p className="mt-5 border-t border-ink/10 pt-4 text-[11px] leading-relaxed text-ink/60">
              Para atualizar seus dados, fale com a coordenação do projeto.
            </p>
          </div>

          {proximoEvento && (
            <div className="overflow-hidden rounded-2xl bg-ink text-white">
              <div className="border-b border-white/10 px-6 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sun">
                  Próxima sessão
                </p>
              </div>
              <div className="p-6">
                <p className="font-display text-2xl uppercase leading-tight">
                  {proximoEvento.titulo}
                </p>
                <div className="mt-4 space-y-2 text-xs text-white/60">
                  <p className="flex items-center gap-2">
                    <Calendar size={14} className="text-sun" />
                    {formatarData(proximoEvento.data)}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={14} className="text-sun" />
                    {proximoEvento.hora} · {proximoEvento.turma}
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-sun" />
                    {proximoEvento.local}
                  </p>
                </div>
                <p className="mt-4 text-[11px] leading-relaxed text-white/60">
                  {proximoEvento.descricao}
                </p>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
            <Instagram size={20} className="text-sun-700" />
            <p className="mt-3 font-display text-xl uppercase leading-none text-ink">
              Fale com a gente
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ink/65">
              Dúvidas sobre treinos, horários ou sua inscrição? Chame a
              coordenação no Instagram.
            </p>
            <a
              href="https://www.instagram.com/vencedorespontemetalica/"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-sun-700 transition hover:text-ink"
            >
              @vencedorespontemetalica <ArrowRight size={12} />
            </a>
          </div>
        </aside>
      </main>

      <footer className="border-t border-ink/10 bg-cream">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-[10px] uppercase tracking-widest text-ink/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Vencedores da Ponte Metálica</p>
          <p>Praia de Iracema · Fortaleza · CE</p>
        </div>
      </footer>

      <Modal
        open={Boolean(noticiaAberta)}
        onClose={() => setNoticiaAberta(null)}
        title={noticiaAberta?.categoria ?? "Notícia"}
        wide
      >
        {noticiaAberta && (
          <article>
            <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={noticiaAberta.imagem}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 800px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${classesCategoria(
                  noticiaAberta.categoria
                )}`}
              >
                {noticiaAberta.categoria}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-ink/60">
                {formatarData(noticiaAberta.publicadoEm)} · {noticiaAberta.autor}
              </span>
            </div>
            <h3 className="mt-3 font-display text-2xl uppercase leading-tight text-ink">
              {noticiaAberta.titulo}
            </h3>
            <p className="mt-3 text-sm font-medium leading-relaxed text-ink/70">
              {noticiaAberta.resumo}
            </p>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-ink/60">
              {noticiaAberta.conteudo.split("\n\n").map((paragrafo, i) => (
                <p key={i}>{paragrafo}</p>
              ))}
            </div>
          </article>
        )}
      </Modal>
    </div>
  );
}
