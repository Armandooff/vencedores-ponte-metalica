import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function lerEnvPublica() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY precisam estar configurados."
    );
  }
  return { url, anonKey };
}

/**
 * Cliente para route handlers e server components que respeita a sessão do
 * usuário (cookies). Use em verificações de permissão no servidor.
 */
export function createSupabaseServerClient(): SupabaseClient {
  const { url, anonKey } = lerEnvPublica();
  const cookieStore = cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesParaDefinir) {
        try {
          cookiesParaDefinir.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server components não podem escrever cookies. Nesses casos a
          // renovação é feita pelo cliente/middleware; a leitura continua ok.
        }
      },
    },
  });
}

/**
 * Cliente administrativo com service role. Só pode ser importado por código
 * que roda no servidor (route handlers/server components). Nunca exponha esta
 * chave no bundle do cliente.
 */
export function createSupabaseAdminClient(): SupabaseClient {
  const { url } = lerEnvPublica();
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRole) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada no servidor.");
  }

  return createClient(url, serviceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
