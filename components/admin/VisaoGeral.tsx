"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useDados } from "@/lib/store";
import {
  classesStatus,
  formatarDataCurta,
  hojeISO,
  iniciais,
  rotuloNivel,
  rotuloStatus,
} from "@/lib/format";
import Modal from "@/components/ui/Modal";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Calendar,
  Newspaper,
  Plus,
  Shield,
  Users,
} from "@/components/ui/Icons";

export default function VisaoGeral() {
  const { db, restaurarDemo } = useDados();
  const [resetAberto, setResetAberto] = useState(false);

  const hoje = new Date();
  const mesAtual = hojeISO().slice(0, 7);

  const pendentes = db.atletas.filter((a) => a.status === "pendente").length;
  const aprovados = db.atletas.filter((a) => a.status === "aprovado").length;
  const publicadas = db.noticias.filter((n) => n.publicada).length;
  const rascunhos = db.noticias.filter((n) => !n.publicada).length;
  const novosNoMes = db.atletas.filter((a) =>
    a.criadoEm.startsWith(mesAtual)
  ).length;

  const meses = useMemo(() => {
    return Array.from({ length: 6 }).map((_, indice) => {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - (5 - indice), 1);
      const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      const rotulo = new Intl.DateTimeFormat("pt-BR", { month: "short" })
        .format(data)
        .replace(".", "");
      const total = db.atletas.filter((a) => a.criadoEm.startsWith(chave)).length;
      return { chave, rotulo, total };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db.atletas]);

  const maiorMes = Math.max(...meses.map((m) => m.total), 1);

  const recentes = [...db.atletas]
    .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
    .slice(0, 5);

  const ultimasNoticias = [...db.noticias]
    .sort((a, b) => b.publicadoEm.localeCompare(a.publicadoEm))
    .slice(0, 4);

  const niveis = (["iniciante", "intermediario", "avancado"] as const).map(
    (nivel) => ({
      nivel,
      total: db.atletas.filter((a) => a.nivel === nivel).length,
    })
  );
  const totalNivel = Math.max(db.atletas.length, 1);

  const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(hoje);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink/60">
            {dataFormatada}
          </p>
          <h2 className="mt-2 font-display text-3xl uppercase leading-none text-ink sm:text-4xl">
            Olá, equipe.
          </h2>
          <p className="mt-2 text-sm text-ink/65">
            Aqui está o panorama do projeto hoje.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/noticias" className="btn-sun !px-4 !py-2.5 !text-[11px]">
            <Plus size={15} /> Nova notícia
          </Link>
          <Link
            href="/admin/atletas"
            className="btn-ghost-dark !px-4 !py-2.5 !text-[11px]"
          >
            Ver atletas <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card-light p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/60">
              Total de atletas
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink/5 text-ink">
              <Users size={17} />
            </span>
          </div>
          <p className="mt-3 font-display text-4xl leading-none text-ink">
            {db.atletas.length}
          </p>
          <p className="mt-2 text-xs text-ink/60">
            <span className="font-semibold text-emerald-700">
              +{novosNoMes}
            </span>{" "}
            neste mês
          </p>
        </div>

        <div className="card-light p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/60">
              Inscrições pendentes
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Bell size={17} />
            </span>
          </div>
          <p className="mt-3 font-display text-4xl leading-none text-ink">
            {pendentes}
          </p>
          <Link
            href="/admin/atletas"
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:underline"
          >
            Revisar inscrições <ArrowRight size={11} />
          </Link>
        </div>

        <div className="card-light p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/60">
              Atletas aprovados
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Shield size={17} />
            </span>
          </div>
          <p className="mt-3 font-display text-4xl leading-none text-ink">
            {aprovados}
          </p>
          <p className="mt-2 text-xs text-ink/60">
            {db.atletas.length > 0
              ? Math.round((aprovados / db.atletas.length) * 100)
              : 0}
            % do total de cadastros
          </p>
        </div>

        <div className="card-light p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/60">
              Notícias publicadas
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sun/15 text-sun-700">
              <Newspaper size={17} />
            </span>
          </div>
          <p className="mt-3 font-display text-4xl leading-none text-ink">
            {publicadas}
          </p>
          <p className="mt-2 text-xs text-ink/60">
            {rascunhos} rascunho{rascunhos !== 1 ? "s" : ""} em andamento
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="card-light p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl uppercase leading-none text-ink">
                Inscrições por mês
              </h3>
              <p className="mt-1 text-xs text-ink/60">
                Evolução dos últimos 6 meses
              </p>
            </div>
            <span className="chip">{hoje.getFullYear()}</span>
          </div>

          <div className="mt-8 flex h-48 items-end justify-between gap-3">
            {meses.map((mes) => {
              const altura = Math.max((mes.total / maiorMes) * 100, 4);
              return (
                <div
                  key={mes.chave}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-xs font-bold text-ink/60">
                    {mes.total}
                  </span>
                  <div
                    className="w-full max-w-[54px] rounded-t-lg bg-gradient-to-t from-sun-600 to-sun transition hover:opacity-80"
                    style={{ height: `${altura}%` }}
                    title={`${mes.total} inscrição(ões) em ${mes.rotulo}`}
                  />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ink/60">
                    {mes.rotulo}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card-light p-6">
          <h3 className="font-display text-xl uppercase leading-none text-ink">
            Distribuição
          </h3>
          <p className="mt-1 text-xs text-ink/60">Visão por nível e status</p>

          <div className="mt-6 space-y-5">
            {niveis.map(({ nivel, total }, i) => (
              <div key={nivel}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink/70">
                    {rotuloNivel[nivel]}
                  </span>
                  <span className="font-bold text-ink">{total}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10">
                  <div
                    className={`h-full rounded-full ${
                      i === 0 ? "bg-sun" : i === 1 ? "bg-sun/60" : "bg-ink/60"
                    }`}
                    style={{
                      width: `${Math.round((total / totalNivel) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 border-t border-ink/10 pt-5">
            {(["aprovado", "pendente", "reprovado"] as const).map((status) => (
              <div
                key={status}
                className="flex items-center justify-between text-xs"
              >
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${classesStatus(
                    status
                  )}`}
                >
                  {rotuloStatus[status]}
                </span>
                <span className="font-bold text-ink">
                  {db.atletas.filter((a) => a.status === status).length}
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/admin/atletas"
            className="mt-6 flex items-center justify-between rounded-xl bg-ink px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-ink-700"
          >
            Gerenciar atletas <ArrowUpRight size={14} className="text-sun" />
          </Link>
        </div>

        <div className="card-light overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between border-b border-ink/10 p-5">
            <div>
              <h3 className="font-display text-xl uppercase leading-none text-ink">
                Últimos cadastros
              </h3>
              <p className="mt-1 text-xs text-ink/60">
                Inscrições recebidas recentemente
              </p>
            </div>
            <Link
              href="/admin/atletas"
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-sun-700 hover:text-ink"
            >
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px] text-sm">
              <thead>
                <tr className="border-b border-ink/5 bg-ink/[0.02] text-left text-[10px] uppercase tracking-wider text-ink/60">
                  <th className="px-5 py-3 font-semibold">Atleta</th>
                  <th className="px-3 py-3 font-semibold">Nível</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {recentes.map((atleta) => (
                  <tr
                    key={atleta.id}
                    className="border-b border-ink/5 last:border-0"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 text-[11px] font-bold text-ink/60">
                          {iniciais(atleta.nomeCompleto)}
                        </span>
                        <div>
                          <p className="font-semibold text-ink">
                            {atleta.nomeCompleto}
                          </p>
                          <p className="text-[11px] text-ink/60">
                            {atleta.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-ink/60">
                      {rotuloNivel[atleta.nivel]}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${classesStatus(
                          atleta.status
                        )}`}
                      >
                        {rotuloStatus[atleta.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-xs text-ink/60">
                      {formatarDataCurta(atleta.criadoEm)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-light p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl uppercase leading-none text-ink">
              Últimas notícias
            </h3>
            <Link
              href="/admin/noticias"
              className="text-[10px] font-bold uppercase tracking-wider text-sun-700 hover:text-ink"
            >
              Gerenciar
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {ultimasNoticias.map((noticia) => (
              <div
                key={noticia.id}
                className="rounded-xl border border-ink/10 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-sun-700">
                    {noticia.categoria}
                  </span>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider ${
                      noticia.publicada ? "text-emerald-700" : "text-ink/60"
                    }`}
                  >
                    {noticia.publicada ? "Publicada" : "Rascunho"}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs font-semibold leading-snug text-ink">
                  {noticia.titulo}
                </p>
                <p className="mt-1 text-[10px] text-ink/60">
                  {formatarDataCurta(noticia.publicadoEm)}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/admin/agenda"
            className="mt-4 flex items-center justify-between rounded-xl border border-ink/10 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-ink/60 transition hover:border-ink/40 hover:text-ink"
          >
            <span className="inline-flex items-center gap-2">
              <Calendar size={14} className="text-sun-700" /> Abrir agenda
            </span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 border-t border-ink/10 pt-5 sm:flex-row sm:items-center">
        <p className="text-[11px] leading-relaxed text-ink/60">
          Ambiente de demonstração: os dados ficam salvos apenas neste
          navegador (localStorage).
        </p>
        <button
          type="button"
          onClick={() => setResetAberto(true)}
          className="text-[10px] font-bold uppercase tracking-wider text-ink/60 underline-offset-4 transition hover:text-red-600 hover:underline"
        >
          Restaurar dados de exemplo
        </button>
      </div>

      <Modal
        open={resetAberto}
        onClose={() => setResetAberto(false)}
        title="Restaurar demonstração"
      >
        <p className="text-sm leading-relaxed text-ink/65">
          Isso apaga os atletas, notícias e eventos criados neste navegador e
          devolve os dados de exemplo do projeto. A sessão atual continua ativa.
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => setResetAberto(false)}
            className="btn-ghost-dark !px-5 !py-2.5 !text-[11px]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              restaurarDemo();
              setResetAberto(false);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition hover:bg-red-700"
          >
            Restaurar dados
          </button>
        </div>
      </Modal>
    </div>
  );
}
