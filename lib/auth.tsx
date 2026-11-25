"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { useDados } from "./store";
import { getSupabaseBrowserClient } from "./supabase/client";
import { mapearAtleta } from "./supabase/mappers";
import type { Atleta } from "./types";

export const ADMIN_EMAIL = "admin@vencedorespontemetalica.com";
export const ADMIN_SENHA = "admin123";

export type Sessao =
  | { tipo: "admin"; nome: string }
  | { tipo: "atleta"; atletaId: string };

type ResultadoLogin = { ok: boolean; erro?: string };

type ContextoAuth = {
  sessao: Sessao | null;
  atletaAtual: Atleta | null;
  pronto: boolean;
  entrarAtleta: (email: string, senha: string) => Promise<ResultadoLogin>;
  iniciarSessaoAtleta: (atletaId?: string) => Promise<ResultadoLogin>;
  entrarAdmin: (email: string, senha: string) => Promise<ResultadoLogin>;
  sair: () => void;
};

const Contexto = createContext<ContextoAuth | null>(null);

type Perfil = {
  role: string;
  nome: string | null;
};

function mensagemErroAuth(erro: { message?: string } | null) {
  const mensagem = (erro?.message ?? "").toLowerCase();

  if (mensagem.includes("invalid login credentials")) {
    return "E-mail ou senha incorretos.";
  }
  if (mensagem.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar.";
  }
  if (mensagem.includes("too many requests") || mensagem.includes("rate limit")) {
    return "Muitas tentativas. Aguarde alguns instantes e tente novamente.";
  }
  if (
    mensagem.includes("failed to fetch") ||
    mensagem.includes("networkerror") ||
    mensagem.includes("network request failed")
  ) {
    return "Não foi possível conectar. Verifique sua internet e tente novamente.";
  }
  return "Não foi possível entrar. Tente novamente.";
}

async function buscarPerfil(userId: string): Promise<Perfil | null> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("role, nome")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("[Supabase] buscar perfil:", error.message);
    return null;
  }
  return (data as Perfil | null) ?? null;
}

async function buscarAtletaDoUsuario(userId: string) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("atletas")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[Supabase] buscar atleta da sessão:", error.message);
    return null;
  }
  return data as Record<string, unknown> | null;
}

async function buscarAtletaPorId(userId: string, atletaId: string) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("atletas")
    .select("*")
    .eq("id", atletaId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[Supabase] buscar atleta por id:", error.message);
    return null;
  }
  return data as Record<string, unknown> | null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { db, recarregar } = useDados();
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [atletaForcado, setAtletaForcado] = useState<Atleta | null>(null);
  const [pronto, setPronto] = useState(false);
  const restauradoRef = useRef(false);

  const aplicarUsuario = useCallback(async (user: User | null) => {
    if (!user) {
      setSessao(null);
      setAtletaForcado(null);
      return;
    }

    const perfil = await buscarPerfil(user.id);
    if (!perfil) {
      setSessao(null);
      setAtletaForcado(null);
      return;
    }

    if (perfil.role === "admin") {
      setAtletaForcado(null);
      setSessao({
        tipo: "admin",
        nome: perfil.nome?.trim() || "Equipe Vencedores",
      });
      return;
    }

    if (perfil.role !== "atleta") {
      setSessao(null);
      setAtletaForcado(null);
      return;
    }

    const registro = await buscarAtletaDoUsuario(user.id);
    if (!registro) {
      setSessao(null);
      setAtletaForcado(null);
      return;
    }

    const atleta = mapearAtleta(registro);
    setAtletaForcado(atleta);
    setSessao({ tipo: "atleta", atletaId: atleta.id });
  }, []);

  // Restaura a sessão do Supabase ao recarregar a página.
  useEffect(() => {
    let ativo = true;
    const supabase = getSupabaseBrowserClient();

    const restaurar = async (user: User | null) => {
      if (!ativo || restauradoRef.current) return;
      restauradoRef.current = true;

      try {
        await aplicarUsuario(user);
        await recarregar();
      } catch (erro) {
        console.error(
          "[Supabase] restaurar sessão:",
          erro instanceof Error ? erro.message : erro
        );
        if (ativo) {
          setSessao(null);
          setAtletaForcado(null);
        }
      } finally {
        if (ativo) setPronto(true);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((evento, session) => {
      if (!ativo) return;

      if (evento === "SIGNED_OUT") {
        setSessao(null);
        setAtletaForcado(null);
        void recarregar();
        return;
      }

      if (evento === "INITIAL_SESSION") {
        void restaurar(session?.user ?? null);
      }
    });

    void supabase.auth.getUser().then(({ data, error }) => {
      if (error && error.name !== "AuthSessionMissingError") {
        console.error("[Supabase] usuário da sessão:", error.message);
      }
      void restaurar(data.user ?? null);
    });

    return () => {
      ativo = false;
      subscription.unsubscribe();
    };
  }, [aplicarUsuario, recarregar]);

  const entrarAtleta = useCallback<ContextoAuth["entrarAtleta"]>(
    async (email, senha) => {
      const supabase = getSupabaseBrowserClient();
      const emailNormalizado = email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailNormalizado,
        password: senha,
      });

      if (error || !data.user) {
        return { ok: false, erro: mensagemErroAuth(error) };
      }

      const perfil = await buscarPerfil(data.user.id);
      if (!perfil || perfil.role !== "atleta") {
        await supabase.auth.signOut();
        return {
          ok: false,
          erro: "Esta conta não tem acesso ao portal do atleta.",
        };
      }

      const registro = await buscarAtletaDoUsuario(data.user.id);
      if (!registro) {
        await supabase.auth.signOut();
        return {
          ok: false,
          erro: "Cadastro de atleta não encontrado para esta conta.",
        };
      }

      const atleta = mapearAtleta(registro);
      setAtletaForcado(atleta);
      setSessao({ tipo: "atleta", atletaId: atleta.id });
      await recarregar();
      return { ok: true };
    },
    [recarregar]
  );

  const iniciarSessaoAtleta = useCallback<
    ContextoAuth["iniciarSessaoAtleta"]
  >(async (atletaId) => {
    const supabase = getSupabaseBrowserClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        ok: false,
        erro: "Sessão expirada. Entre novamente com seu e-mail e senha.",
      };
    }

    const perfil = await buscarPerfil(user.id);
    if (!perfil || perfil.role !== "atleta") {
      return {
        ok: false,
        erro: "Esta conta não tem acesso ao portal do atleta.",
      };
    }

    const registro = atletaId
      ? await buscarAtletaPorId(user.id, atletaId)
      : await buscarAtletaDoUsuario(user.id);

    if (!registro) {
      return {
        ok: false,
        erro: "Cadastro de atleta não encontrado para esta conta.",
      };
    }

    const atleta = mapearAtleta(registro);
    setAtletaForcado(atleta);
    setSessao({ tipo: "atleta", atletaId: atleta.id });
    await recarregar();
    return { ok: true };
  }, [recarregar]);

  const entrarAdmin = useCallback<ContextoAuth["entrarAdmin"]>(
    async (email, senha) => {
      const supabase = getSupabaseBrowserClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: senha,
      });

      if (error || !data.user) {
        return { ok: false, erro: mensagemErroAuth(error) };
      }

      const perfil = await buscarPerfil(data.user.id);
      if (!perfil || perfil.role !== "admin") {
        await supabase.auth.signOut();
        return {
          ok: false,
          erro: "Esta conta não tem acesso ao painel administrativo.",
        };
      }

      setAtletaForcado(null);
      setSessao({
        tipo: "admin",
        nome: perfil.nome?.trim() || "Equipe Vencedores",
      });
      await recarregar();
      return { ok: true };
    },
    [recarregar]
  );

  const sair = useCallback(() => {
    setSessao(null);
    setAtletaForcado(null);

    const supabase = getSupabaseBrowserClient();
    void supabase.auth
      .signOut()
      .then(({ error }) => {
        if (error) {
          console.error("[Supabase] sair:", error.message);
        }
      })
      .finally(() => {
        void recarregar();
      });
  }, [recarregar]);

  const atletaAtual = useMemo(() => {
    if (!sessao || sessao.tipo !== "atleta") return null;
    return (
      db.atletas.find((atleta) => atleta.id === sessao.atletaId) ??
      atletaForcado
    );
  }, [db.atletas, sessao, atletaForcado]);

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
