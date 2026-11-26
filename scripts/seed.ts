import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { bancoInicial } from "../lib/seed";

const { eventos, noticias } = bancoInicial;

function carregarEnv(arquivo: string) {
  const env: Record<string, string> = {};
  if (!fs.existsSync(arquivo)) return env;
  for (const linha of fs.readFileSync(arquivo, "utf8").split(/\r?\n/)) {
    const texto = linha.trim();
    if (!texto || texto.startsWith("#")) continue;
    const indice = texto.indexOf("=");
    if (indice === -1) continue;
    const chave = texto.slice(0, indice).trim();
    let valor = texto.slice(indice + 1).trim();
    if (
      (valor.startsWith('"') && valor.endsWith('"')) ||
      (valor.startsWith("'") && valor.endsWith("'"))
    ) {
      valor = valor.slice(1, -1);
    }
    env[chave] = valor;
  }
  return env;
}

const env = { ...carregarEnv(path.resolve(".env.local")), ...process.env };
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRole) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausente.");
}

const supabase = createClient(url, serviceRole, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ADMIN_EMAIL = "admin@vencedorespontemetalica.com";
const ADMIN_SENHA = "admin123";

async function listarUsuarios() {
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (error) throw error;
  return data.users;
}

async function garantirUsuario(
  email: string,
  nome: string,
  senha: string,
  usuarios: Awaited<ReturnType<typeof listarUsuarios>>
) {
  const existente = usuarios.find(
    (usuario) => usuario.email?.toLowerCase() === email.toLowerCase()
  );
  if (existente) return existente;

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
    user_metadata: { nome },
  });
  if (error) throw error;
  if (!data.user) throw new Error(`Usuário não retornado para ${email}`);
  usuarios.push(data.user);
  return data.user;
}

async function main() {
  const usuarios = await listarUsuarios();

  const admin = await garantirUsuario(
    ADMIN_EMAIL,
    "Equipe Vencedores",
    ADMIN_SENHA,
    usuarios
  );
  const { error: erroAdmin } = await supabase.from("profiles").upsert(
    {
      id: admin.id,
      role: "admin",
      nome: "Equipe Vencedores",
      email: ADMIN_EMAIL,
    },
    { onConflict: "id" }
  );
  if (erroAdmin) throw erroAdmin;

  

  for (const noticia of noticias) {
    const { error } = await supabase.from("noticias").upsert(
      {
        id: noticia.id,
        titulo: noticia.titulo,
        resumo: noticia.resumo,
        conteudo: noticia.conteudo,
        categoria: noticia.categoria,
        imagem: noticia.imagem,
        autor: noticia.autor,
        publicada: noticia.publicada,
        destaque: noticia.destaque,
        publicado_em: noticia.publicadoEm || null,
        criado_em: noticia.publicadoEm || new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (error) throw error;
  }

  for (const evento of eventos) {
    const { error } = await supabase.from("eventos").upsert(
      {
        id: evento.id,
        titulo: evento.titulo,
        descricao: evento.descricao,
        data: evento.data,
        hora: evento.hora,
        local: evento.local,
        ativo: evento.ativo,
        categorias: evento.categorias ?? [],
        criado_em: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (error) throw error;

    const presencas = Object.entries(evento.presencas ?? {});
    if (presencas.length > 0) {
      const { error: erroPresencas } = await supabase.from("presencas").upsert(
        presencas.map(([atletaId, status]) => ({
          evento_id: evento.id,
          atleta_id: atletaId,
          status,
        })),
        { onConflict: "evento_id,atleta_id" }
      );
      if (erroPresencas) throw erroPresencas;
    }
  }

  console.log(`Seed concluído: ${noticias.length} notícias e ${eventos.length} eventos.`);
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
