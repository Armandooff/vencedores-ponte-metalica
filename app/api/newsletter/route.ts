import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const SEM_CACHE = { "Cache-Control": "no-store" };

const newsletterSchema = z.object({
  email: z
    .string({
      required_error: "Informe seu e-mail.",
      invalid_type_error: "Informe seu e-mail.",
    })
    .trim()
    .min(1, "Informe seu e-mail.")
    .email("Informe um e-mail válido.")
    .max(254, "E-mail muito longo.")
    .transform((valor) => valor.toLowerCase()),
  consentimento: z.literal(true, {
    errorMap: () => ({
      message: "É necessário autorizar o recebimento das novidades.",
    }),
  }),
});

function erro(mensagem: string, status: number) {
  return NextResponse.json({ erro: mensagem }, { status, headers: SEM_CACHE });
}

export async function POST(request: Request) {
  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return erro("Dados inválidos.", 400);
  }

  const resultado = newsletterSchema.safeParse(corpo);
  if (!resultado.success) {
    return erro(
      resultado.error.issues[0]?.message ??
        "Confira os dados informados e tente novamente.",
      422
    );
  }

  let admin;
  try {
    admin = createSupabaseAdminClient();
  } catch (falha) {
    console.error(
      "[api/newsletter] configuração do Supabase:",
      falha instanceof Error ? falha.message : falha
    );
    return erro("Cadastro temporariamente indisponível.", 503);
  }

  const { error } = await admin.from("newsletter_inscritos").insert({
    email: resultado.data.email,
    consentimento: true,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        {
          ok: true,
          jaInscrito: true,
          mensagem:
            "Este e-mail já está na lista de novidades. Não é preciso se inscrever de novo.",
        },
        { headers: SEM_CACHE }
      );
    }

    // Falha fechada: nunca confirmamos um cadastro que não foi gravado.
    console.error("[api/newsletter] inserir:", error.code ?? "sem código");
    return erro(
      "Não foi possível concluir o cadastro agora. Tente novamente mais tarde.",
      503
    );
  }

  return NextResponse.json(
    {
      ok: true,
      mensagem:
        "Pronto! Seu e-mail foi registrado para receber novidades futuras do projeto. Este cadastro não é uma inscrição de atleta.",
    },
    { status: 201, headers: SEM_CACHE }
  );
}
