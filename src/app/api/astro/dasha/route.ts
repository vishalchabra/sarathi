// src/app/api/astro/dasha/route.ts
export const runtime = "nodejs";
import "server-only";
import { NextResponse } from "next/server";
import { computeVimshottariFromPayload } from "@/server/astro/dasha";

export async function POST(req: Request) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    // non-JSON or empty body
  }

  // Debug log once to see what's actually arriving
  console.log("[DASHA DEBUG raw body]", body);

  try {
    const out = computeVimshottariFromPayload(body, {
      includeAD: true,
      horizonYears: 60,
    });
    return NextResponse.json({ ok: true, ...out });
  } catch (e: any) {
    console.error("[DASHA ERROR]", e?.stack || e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? String(e) },
      { status: 400 }
    );
  }
}
