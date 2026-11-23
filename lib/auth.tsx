"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDados } from "./store";
import type { Atleta } from "./types";

export const ADMIN_EMAIL = "admin@vencedorespontemetalica.com";
export const ADMIN_SENHA = "admin123";

const CHAVE_SESSAO = "vpm:sessao:v2";

export type Sessao =
  | { tipo: "admin"; nome: string }
  | { tipo: "atleta"; atletaId: string };

type ResultadoLogin = { ok: boolean; erro?: string };

type ContextoAuth = {
  sessao: Sessao | null;
  atletaAtual: Atleta | null;
  pronto: boolean;
  entrarAtleta: (email: string, senha: string) => ResultadoLogin;
  iniciarSessaoAtleta: (atletaId: string) => void;
  entrarAdmin: (email: string, senha: string) => ResultadoLogin;
  sair: () => void;
};

const Contexto = createContext<ContextoAuth | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { db, pronto: dadosProntos } = useDados();
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    try {
      const salvo = window.localStorage.getItem(CHAVE_SESSAO);
      if (salvo) setSessao(JSON.parse(salvo) as Sessao);
    } catch {
      // Sessão inválida é ignorada.
    }
    setPronto(true);
  }, []);

  useEffect(() => {
    if (!pronto) return;
    try {
      if (sessao) {
        window.localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
      } else {
        window.localStorage.removeItem(CHAVE_SESSAO);
      }
    } catch {
      // Sem persistência, a sessão vale apenas em memória.
    }
  }, [sessao, pronto]);

  const entrarAtleta = useCallback<ContextoAuth["entrarAtleta"]>(
    (email, senha) => {
      if (!dadosProntos) return { ok: false, erro: "Aguarde um instante." };
      const atleta = db.atletas.find(
        (a) => a.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (!atleta || atleta.senha !== senha) {
        return { ok: false, erro: "E-mail ou senha incorretos." };
      }
      setSessao({ tipo: "atleta", atletaId: atleta.id });
      return { ok: true };
    },
    [db.atletas, dadosProntos]
  );

  const iniciarSessaoAtleta = useCallback<ContextoAuth["iniciarSessaoAtleta"]>(
    (atletaId) => {
      setSessao({ tipo: "atleta", atletaId });
    },
    []
  );

  const entrarAdmin = useCallback<ContextoAuth["entrarAdmin"]>(
    (email, senha) => {
      if (
        email.trim().toLowerCase() !== ADMIN_EMAIL ||
        senha !== ADMIN_SENHA
      ) {
        return { ok: false, erro: "Credenciais de administrador inválidas." };
      }
      setSessao({ tipo: "admin", nome: "Equipe Vencedores" });
      return { ok: true };
    },
    []
  );

  const sair = useCallback(() => {
    setSessao(null);
    try {
      window.localStorage.removeItem(CHAVE_SESSAO);
    } catch {
      // Ignora falha de armazenamento.
    }
  }, []);

  const atletaAtual = useMemo(() => {
    if (!sessao || sessao.tipo !== "atleta") return null;
    return db.atletas.find((a) => a.id === sessao.atletaId) ?? null;
  }, [db.atletas, sessao]);

  const valor = useMemo(
    () => ({
      sessao,
      atletaAtual,
      pronto,
      entrarAtleta,
      iniciarSessaoAtleta,
      entrarAdmin,
      sair,
    }),
    [
      sessao,
      atletaAtual,
      pronto,
      entrarAtleta,
      iniciarSessaoAtleta,
      entrarAdmin,
      sair,
    ]
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useAuth() {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error("useAuth precisa ser usado dentro de <AuthProvider>");
  }
  return contexto;
}
