"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { bancoInicial } from "./seed";
import { hojeISO } from "./format";
import { CHAVE_ANTIGA, CHAVE_ATUAL, migrarBanco } from "./migracao";
import type {
  Atleta,
  BancoDados,
  Evento,
  Noticia,
  Presenca,
  StatusAtleta,
} from "./types";

const CHAVE = CHAVE_ATUAL;

function novoId(prefixo: string) {
  const aleatorio =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefixo}-${aleatorio}`;
}

type ContextoDados = {
  db: BancoDados;
  pronto: boolean;
  criarAtleta: (
    dados: Omit<Atleta, "id" | "criadoEm" | "status"> & {
      status?: StatusAtleta;
    }
  ) => Atleta;
  atualizarAtleta: (id: string, dados: Partial<Atleta>) => void;
  excluirAtleta: (id: string) => void;
  criarNoticia: (dados: Omit<Noticia, "id">) => Noticia;
  atualizarNoticia: (id: string, dados: Partial<Noticia>) => void;
  excluirNoticia: (id: string) => void;
  criarEvento: (dados: Omit<Evento, "id">) => Evento;
  atualizarEvento: (id: string, dados: Partial<Evento>) => void;
  excluirEvento: (id: string) => void;
  registrarChamada: (eventoId: string, presencas: Record<string, Presenca>) => void;
  restaurarDemo: () => void;
};

const Contexto = createContext<ContextoDados | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<BancoDados>(bancoInicial);
  const [pronto, setPronto] = useState(false);

  // Hidrata do armazenamento local (substituível por API/banco real).
  useEffect(() => {
    try {
      const salvo = window.localStorage.getItem(CHAVE);
      const legado = window.localStorage.getItem(CHAVE_ANTIGA);
      const bruto = salvo ?? legado;
      if (bruto) {
        const dados = JSON.parse(bruto) as BancoDados;
        if (
          Array.isArray(dados.atletas) &&
          Array.isArray(dados.noticias) &&
          Array.isArray(dados.eventos)
        ) {
          const migrado = migrarBanco(dados);
          setDb(migrado);
          if (!salvo) {
            window.localStorage.setItem(CHAVE, JSON.stringify(migrado));
            window.localStorage.removeItem(CHAVE_ANTIGA);
          }
        }
      }
    } catch {
      // Se o armazenamento estiver corrompido, mantém o seed inicial.
    }
    setPronto(true);
  }, []);

  useEffect(() => {
    if (!pronto) return;
    try {
      window.localStorage.setItem(CHAVE, JSON.stringify(db));
    } catch {
      // Armazenamento cheio ou indisponível: a sessão continua em memória.
    }
  }, [db, pronto]);

  const criarAtleta = useCallback<ContextoDados["criarAtleta"]>((dados) => {
    const atleta: Atleta = {
      ...dados,
      id: novoId("atl"),
      status: dados.status ?? "pendente",
      criadoEm: hojeISO(),
    };
    setDb((atual) => ({ ...atual, atletas: [atleta, ...atual.atletas] }));
    return atleta;
  }, []);

  const atualizarAtleta = useCallback<ContextoDados["atualizarAtleta"]>(
    (id, dados) => {
      setDb((atual) => ({
        ...atual,
        atletas: atual.atletas.map((a) => (a.id === id ? { ...a, ...dados } : a)),
      }));
    },
    []
  );

  const excluirAtleta = useCallback<ContextoDados["excluirAtleta"]>((id) => {
    setDb((atual) => ({
      ...atual,
      atletas: atual.atletas.filter((a) => a.id !== id),
    }));
  }, []);

  const criarNoticia = useCallback<ContextoDados["criarNoticia"]>((dados) => {
    const noticia: Noticia = { ...dados, id: novoId("not") };
    setDb((atual) => ({
      ...atual,
      noticias: [noticia, ...atual.noticias],
    }));
    return noticia;
  }, []);

  const atualizarNoticia = useCallback<ContextoDados["atualizarNoticia"]>(
    (id, dados) => {
      setDb((atual) => ({
        ...atual,
        noticias: atual.noticias.map((n) =>
          n.id === id ? { ...n, ...dados } : n
        ),
      }));
    },
    []
  );

  const excluirNoticia = useCallback<ContextoDados["excluirNoticia"]>((id) => {
    setDb((atual) => ({
      ...atual,
      noticias: atual.noticias.filter((n) => n.id !== id),
    }));
  }, []);

  const criarEvento = useCallback<ContextoDados["criarEvento"]>((dados) => {
    const evento: Evento = { ...dados, id: novoId("evt") };
    setDb((atual) => ({ ...atual, eventos: [evento, ...atual.eventos] }));
    return evento;
  }, []);

  const atualizarEvento = useCallback<ContextoDados["atualizarEvento"]>(
    (id, dados) => {
      setDb((atual) => ({
        ...atual,
        eventos: atual.eventos.map((e) => (e.id === id ? { ...e, ...dados } : e)),
      }));
    },
    []
  );

  const excluirEvento = useCallback<ContextoDados["excluirEvento"]>((id) => {
    setDb((atual) => ({
      ...atual,
      eventos: atual.eventos.filter((e) => e.id !== id),
    }));
  }, []);

  const registrarChamada = useCallback<ContextoDados["registrarChamada"]>(
    (eventoId, presencas) => {
      setDb((atual) => ({
        ...atual,
        eventos: atual.eventos.map((evento) =>
          evento.id === eventoId ? { ...evento, presencas } : evento
        ),
      }));
    },
    []
  );

  const restaurarDemo = useCallback(() => {
    setDb(bancoInicial);
  }, []);

  const valor = useMemo(
    () => ({
      db,
      pronto,
      criarAtleta,
      atualizarAtleta,
      excluirAtleta,
      criarNoticia,
      atualizarNoticia,
      excluirNoticia,
      criarEvento,
      atualizarEvento,
      excluirEvento,
      registrarChamada,
      restaurarDemo,
    }),
    [
      db,
      pronto,
      criarAtleta,
      atualizarAtleta,
      excluirAtleta,
      criarNoticia,
      atualizarNoticia,
      excluirNoticia,
      criarEvento,
      atualizarEvento,
      excluirEvento,
      registrarChamada,
      restaurarDemo,
    ]
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useDados() {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error("useDados precisa ser usado dentro de <DataProvider>");
  }
  return contexto;
}
