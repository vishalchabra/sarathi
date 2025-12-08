export const runtime = "nodejs";
import "server-only";
import { NextResponse } from "next/server";

export async function GET() {
  // DO NOT return the key — only a boolean + a short hint
  const raw = process.env.OPENAI_API_KEY ?? "";
  const present = !!raw && raw.trim().length > 10 && raw.trim().startsWith("sk-");
  const hint = present ? `${raw.trim().slice(0, 6)}…${raw.trim().slice(-4)}` : null;

  return new NextResponse(JSON.stringify({
    hasKey: present,
    hintPrefixSuffix: hint,   // safe to display; not the full key
    nodeEnv: process.env.NODE_ENV,
  }), { status: 200, headers: { "content-type": "application/json" }});
}
