import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";

function loadEnv(file) {
  const env = {};
  if (!fs.existsSync(file)) return env;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const env = { ...loadEnv(path.resolve(".env.local")), ...process.env };
const connectionString = env.SUPABASE_DB_URL;

if (!connectionString) {
  console.error("SUPABASE_DB_URL não encontrada no .env.local");
  process.exit(1);
}

const sql = fs.readFileSync(path.resolve("supabase/schema.sql"), "utf8");
const pooler = new URL(connectionString);
pooler.hostname = "aws-0-sa-east-1.pooler.supabase.com";
pooler.port = "5432";
pooler.username = "postgres.pqetrvpivwhuhwvbulep";

const client = new Client({
  connectionString: pooler.toString(),
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log("Conectado ao Postgres do Supabase.");
  await client.query(sql);
  console.log("Schema, políticas e bucket aplicados com sucesso.");
} finally {
  await client.end();
}
