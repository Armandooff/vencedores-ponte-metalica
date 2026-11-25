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
import { hojeISO } from "./format";
import { novoId } from "./ids";
import { bancoInicial } from "./seed";
import { getSupabaseBrowserClient } from "./supabase/client";
import {
  linhaAtletaParcial,
  mapearAtleta,
  mapearEvento,
  mapearNoticia,
  mapearPresencas,
  paraLinhaAtleta,
  paraLinhaEvento,
  paraLinhaNoticia,
} from "./supabase/mappers";
import type {
  Atleta,
  BancoDados,
  Evento,
  Noticia,
  Presenca,
  StatusAtleta,
} from "./types";

// Conteúdo usado apenas para o primeiro render (SSR da landing). Logo após a
// montagem, o DataProvider substitui tudo pelo que existe no Supabase.
const BANCO_INICIAL: BancoDados = bancoInicial;

type Registro = Record<string, unknown>;

type DadosNovoAtleta = Omit<Atleta, "id" | "criadoEm" | "status"> & {
  status?: StatusAtleta;
};

type DadosNovoAtletaComAcesso = Omit<
  Atleta,
  "id" | "criadoEm" | "status" | "userId"
> & {
  status?: StatusAtleta;
  senha?: string;
};

type ResultadoOperacao = { ok: boolean; erro?: string };

type ContextoDados = {
  db: BancoDados;
  pronto: boolean;
  recarregar: () => Promise<void>;
  criarAtleta: (dados: DadosNovoAtleta) => Atleta;
  criarAtletaComAcesso: (
    dados: DadosNovoAtletaComAcesso
  ) => Promise<ResultadoOperacao>;
  atualizarAtleta: (id: string, dados: Partial<Atleta>) => void;
  excluirAtleta: (id: string) => void;
  criarNoticia: (dados: Omit<Noticia, "id">) => Noticia;
  atualizarNoticia: (id: string, dados: Partial<Noticia>) => void;
  excluirNoticia: (id: string) => void;
  criarEvento: (dados: Omit<Evento, "id">) => Evento;
  atualizarEvento: (id: string, dados: Partial<Evento>) => void;
  excluirEvento: (id: string) => void;
  registrarChamada: (eventoId: string, presencas: Record<string, Presenca>) => void;
  restaurarDemo: () => Promise<ResultadoOperacao>;
};

const Contexto = createContext<ContextoDados | null>(null);

function logarErro(operacao: string, erro: { message?: string } | null) {
  if (!erro) return;
  console.error(`[Supabase] ${operacao}: ${erro.message ?? "erro desconhecido"}`);
}

async function respostaJson(resposta: Response) {
  try {
    return (await resposta.json()) as { erro?: string };
  } catch {
    return {};
  }
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<BancoDados>(BANCO_INICIAL);
  const [pronto, setPronto] = useState(false);
  const dbRef = useRef(db);
  const cargaAtualRef = useRef(0);

  useEffect(() => {
    dbRef.current = db;
  }, [db]);

  const carregar = useCallback(async () => {
    const cargaId = ++cargaAtualRef.current;

    try {
      const supabase = getSupabaseBrowserClient();

      // Garante que a sessão em cookie já foi carregada antes das consultas,
      // para que o RLS aplique o papel correto desde a primeira carga.
      await supabase.auth.getSession();

      const [atletasRes, noticiasRes, eventosRes, presencasRes] =
        await Promise.all([
          supabase.from("atletas").select("*").order("criado_em", {
            ascending: false,
          }),
          supabase.from("noticias").select("*").order("publicado_em", {
            ascending: false,
          }),
          supabase.from("eventos").select("*").order("data", {
            ascending: true,
          }),
          supabase.from("presencas").select("*"),
        ]);

      logarErro("carregar atletas", atletasRes.error);
      logarErro("carregar notícias", noticiasRes.error);
      logarErro("carregar eventos", eventosRes.error);
      logarErro("carregar presenças", presencasRes.error);

      const presencasPorEvento = presencasRes.error
        ? null
        : mapearPresencas((presencasRes.data ?? []) as unknown as Registro[]);

      // Uma carga mais nova (ex.: após restaurar a sessão) tem prioridade.
      if (cargaId !== cargaAtualRef.current) return;

      setDb((atual) => {
        const eventosBase = eventosRes.error
          ? atual.eventos
          : ((eventosRes.data ?? []) as unknown as Registro[]).map(
              mapearEvento
            );

        return {
          atletas: atletasRes.error
            ? atual.atletas
            : ((atletasRes.data ?? []) as unknown as Registro[]).map(
                mapearAtleta
              ),
          noticias: noticiasRes.error
            ? atual.noticias
            : ((noticiasRes.data ?? []) as unknown as Registro[]).map(
                mapearNoticia
              ),
          eventos: eventosBase.map((evento) => {
            const presencas = presencasPorEvento
              ? presencasPorEvento[evento.id]
              : evento.presencas;
            return presencas
              ? { ...evento, presencas }
              : { ...evento, presencas: undefined };
          }),
        };
      });
    } catch (erro) {
      console.error(
        "[Supabase] falha ao carregar dados:",
        erro instanceof Error ? erro.message : erro
      );
    } finally {
      setPronto(true);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const criarAtleta = useCallback<ContextoDados["criarAtleta"]>(
    (dados) => {
      const atleta: Atleta = {
        ...dados,
        id: novoId("atl"),
        status: dados.status ?? "pendente",
        criadoEm: hojeISO(),
      };

      setDb((atual) => ({ ...atual, atletas: [atleta, ...atual.atletas] }));

      void getSupabaseBrowserClient()
        .from("atletas")
        .insert(paraLinhaAtleta(atleta))
        .then(({ error }) => {
          if (error) {
            logarErro("criar atleta", error);
            void carregar();
          }
        });

      return atleta;
    },
    [carregar]
  );

  const criarAtletaComAcesso = useCallback<
    ContextoDados["criarAtletaComAcesso"]
  >(async (dados) => {
    try {
      const resposta = await fetch("/api/admin/atletas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      const corpo = await respostaJson(resposta);
      if (!resposta.ok) {
        return {
          ok: false,
          erro: corpo.erro ?? "Não foi possível cadastrar o atleta.",
        };
      }
      await carregar();
      return { ok: true };
    } catch (erro) {
      console.error(
        "[Supabase] criar atleta com acesso:",
        erro instanceof Error ? erro.message : erro
      );
      return { ok: false, erro: "Não foi possível conectar. Tente novamente." };
    }
  }, [carregar]);

  const atualizarAtleta = useCallback<ContextoDados["atualizarAtleta"]>(
    (id, dados) => {
      const atual = dbRef.current.atletas.find((atleta) => atleta.id === id);

      setDb((estado) => ({
        ...estado,
        atletas: estado.atletas.map((atleta) =>
          atleta.id === id ? { ...atleta, ...dados } : atleta
        ),
      }));

      const linha = linhaAtletaParcial(dados);
      if (!Object.keys(linha).length) return;

      const camposAutoPerfil = Object.keys(dados).every((campo) =>
        ["telefone", "historia", "foto"].includes(campo)
      );
      const tem = (campo: keyof Atleta) =>
        Object.prototype.hasOwnProperty.call(dados, campo);

      void (async () => {
        const supabase = getSupabaseBrowserClient();

        try {
          if (atual?.userId && camposAutoPerfil) {
            const {
              data: { user },
            } = await supabase.auth.getUser();

            if (user?.id === atual.userId) {
              const { error } = await supabase.rpc("atualizar_meu_perfil", {
                p_telefone: tem("telefone")
                  ? (dados.telefone ?? "").replace(/\D/g, "")
                  : atual.telefone,
                p_historia: tem("historia")
                  ? dados.historia ?? null
                  : atual.historia ?? null,
                p_foto_url: tem("foto")
                  ? dados.foto ?? null
                  : atual.foto ?? null,
              });
              if (error) {
                logarErro("atualizar meu perfil", error);
                void carregar();
              }
              return;
            }
          }

          const { error } = await supabase
            .from("atletas")
            .update(linha)
            .eq("id", id);
          if (error) {
            logarErro("atualizar atleta", error);
            void carregar();
          }
        } catch (erro) {
          console.error(
            "[Supabase] atualizar atleta:",
            erro instanceof Error ? erro.message : erro
          );
          void carregar();
        }
      })();
    },
    [carregar]
  );

  const excluirAtleta = useCallback<ContextoDados["excluirAtleta"]>(
    (id) => {
      setDb((atual) => ({
        ...atual,
        atletas: atual.atletas.filter((atleta) => atleta.id !== id),
      }));

      // A rota administrativa remove também a conta em auth.users; a RLS de
      // atletas sozinha deixaria um login órfão para o mesmo e-mail.
      void fetch("/api/admin/atletas", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ atletaId: id }),
      })
        .then(async (resposta) => {
          if (resposta.ok) return;
          const corpo = (await resposta.json().catch(() => ({}))) as {
            erro?: string;
          };
          console.error(
            `[Supabase] excluir atleta: ${corpo.erro ?? resposta.statusText}`
          );
          await carregar();
        })
        .catch(async (erro) => {
          console.error(
            "[Supabase] excluir atleta:",
            erro instanceof Error ? erro.message : erro
          );
          await carregar();
        });
    },
    [carregar]
  );

  const criarNoticia = useCallback<ContextoDados["criarNoticia"]>((dados) => {
    const noticia: Noticia = { ...dados, id: novoId("not") };
    setDb((atual) => ({
      ...atual,
      noticias: [noticia, ...atual.noticias],
    }));

    void getSupabaseBrowserClient()
      .from("noticias")
      .insert(paraLinhaNoticia(noticia))
      .then(({ error }) => {
        if (error) {
          logarErro("criar notícia", error);
          void carregar();
        }
      });

    return noticia;
  }, [carregar]);

  const atualizarNoticia = useCallback<ContextoDados["atualizarNoticia"]>(
    (id, dados) => {
      setDb((atual) => ({
        ...atual,
        noticias: atual.noticias.map((noticia) =>
          noticia.id === id ? { ...noticia, ...dados } : noticia
        ),
      }));

      const linha: Registro = {};
      const tem = (campo: keyof Noticia) =>
        Object.prototype.hasOwnProperty.call(dados, campo);
      if (tem("titulo")) linha.titulo = dados.titulo;
      if (tem("resumo")) linha.resumo = dados.resumo;
      if (tem("conteudo")) linha.conteudo = dados.conteudo;
      if (tem("categoria")) linha.categoria = dados.categoria;
      if (tem("imagem")) linha.imagem = dados.imagem;
      if (tem("autor")) linha.autor = dados.autor;
      if (tem("publicada")) linha.publicada = dados.publicada;
      if (tem("destaque")) linha.destaque = dados.destaque;
      if (tem("publicadoEm")) linha.publicado_em = dados.publicadoEm;
      if (!Object.keys(linha).length) return;

      void getSupabaseBrowserClient()
        .from("noticias")
        .update(linha)
        .eq("id", id)
        .then(({ error }) => {
          if (error) {
            logarErro("atualizar notícia", error);
            void carregar();
          }
        });
    },
    [carregar]
  );

  const excluirNoticia = useCallback<ContextoDados["excluirNoticia"]>(
    (id) => {
      setDb((atual) => ({
        ...atual,
        noticias: atual.noticias.filter((noticia) => noticia.id !== id),
      }));

      void getSupabaseBrowserClient()
        .from("noticias")
        .delete()
        .eq("id", id)
        .then(({ error }) => {
          if (error) {
            logarErro("excluir notícia", error);
            void carregar();
          }
        });
    },
    [carregar]
  );

  const criarEvento = useCallback<ContextoDados["criarEvento"]>((dados) => {
    const evento: Evento = { ...dados, id: novoId("evt") };
    setDb((atual) => ({ ...atual, eventos: [evento, ...atual.eventos] }));

    void getSupabaseBrowserClient()
      .from("eventos")
      .insert(paraLinhaEvento(evento))
      .then(({ error }) => {
        if (error) {
          logarErro("criar evento", error);
          void carregar();
        }
      });

    return evento;
  }, [carregar]);

  const atualizarEvento = useCallback<ContextoDados["atualizarEvento"]>(
    (id, dados) => {
      setDb((atual) => ({
        ...atual,
        eventos: atual.eventos.map((evento) =>
          evento.id === id ? { ...evento, ...dados } : evento
        ),
      }));

      const linha: Registro = {};
      const tem = (campo: keyof Evento) =>
        Object.prototype.hasOwnProperty.call(dados, campo);
      if (tem("titulo")) linha.titulo = dados.titulo;
      if (tem("descricao")) linha.descricao = dados.descricao;
      if (tem("data")) linha.data = dados.data;
      if (tem("hora")) linha.hora = dados.hora;
      if (tem("local")) linha.local = dados.local;
      if (tem("ativo")) linha.ativo = dados.ativo;
      if (tem("categorias")) linha.categorias = dados.categorias ?? [];
      if (!Object.keys(linha).length) return;

      void getSupabaseBrowserClient()
        .from("eventos")
        .update(linha)
        .eq("id", id)
        .then(({ error }) => {
          if (error) {
            logarErro("atualizar evento", error);
            void carregar();
          }
        });
    },
    [carregar]
  );

  const excluirEvento = useCallback<ContextoDados["excluirEvento"]>(
    (id) => {
      setDb((atual) => ({
        ...atual,
        eventos: atual.eventos.filter((evento) => evento.id !== id),
      }));

      void getSupabaseBrowserClient()
        .from("eventos")
        .delete()
        .eq("id", id)
        .then(({ error }) => {
          if (error) {
            logarErro("excluir evento", error);
            void carregar();
          }
        });
    },
    [carregar]
  );

  const registrarChamada = useCallback<ContextoDados["registrarChamada"]>(
    (eventoId, presencas) => {
      setDb((atual) => ({
        ...atual,
        eventos: atual.eventos.map((evento) =>
          evento.id === eventoId ? { ...evento, presencas } : evento
        ),
      }));

      const linhas = Object.entries(presencas).map(([atletaId, status]) => ({
        evento_id: eventoId,
        atleta_id: atletaId,
        status,
      }));
      if (!linhas.length) return;

      void getSupabaseBrowserClient()
        .from("presencas")
        .upsert(linhas, { onConflict: "evento_id,atleta_id" })
        .then(({ error }) => {
          if (error) {
            logarErro("registrar chamada", error);
            void carregar();
          }
        });
    },
    [carregar]
  );

  const restaurarDemo = useCallback<ContextoDados["restaurarDemo"]>(
    async () => {
      try {
        const resposta = await fetch("/api/admin/restaurar-demo", {
          method: "POST",
        });
        const corpo = await respostaJson(resposta);
        if (!resposta.ok) {
          return {
            ok: false,
            erro: corpo.erro ?? "Não foi possível restaurar a demonstração.",
          };
        }
        await carregar();
        return { ok: true };
      } catch (erro) {
        console.error(
          "[Supabase] restaurar demo:",
          erro instanceof Error ? erro.message : erro
        );
        return {
          ok: false,
          erro: "Não foi possível conectar. Tente novamente.",
        };
      }
    },
    [carregar]
  );

  const valor = useMemo(
    () => ({
      db,
      pronto,
      recarregar: carregar,
      criarAtleta,
      criarAtletaComAcesso,
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
      carregar,
      criarAtleta,
      criarAtletaComAcesso,
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
