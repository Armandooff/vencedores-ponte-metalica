import { NextResponse } from "next/server";
import { listarEventosPublicos } from "@/lib/agenda-publica";

export const dynamic = "force-dynamic";

const SEM_CACHE = { "Cache-Control": "no-store" };

export async function GET() {
  const { eventos, indisponivel } = await listarEventosPublicos();

  if (indisponivel) {
    return NextResponse.json(
      { erro: "Agenda temporariamente indisponível." },
      { status: 503, headers: SEM_CACHE }
    );
  }

  return NextResponse.json({ eventos }, { headers: SEM_CACHE });
}
