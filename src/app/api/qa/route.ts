// FILE: src/app/api/qa/route.ts
import "server-only";
import { NextResponse } from "next/server";

import { orchestrateQA, type Category, type Inputs } from "./orchestrator";

export const runtime = "nodejs";

type QARequestBody = {
  // common incoming shapes
  text?: string;
  input?: string;
  query?: string;
  message?: string;
  question?: string;

  category?: Category;

  dobISO?: string | null;
  tob?: string | null;

  place?: {
    name?: string;
    tz?: string;
    lat?: number;
    lon?: number;
  } | null;

  profile?: Inputs["profile"] | null;

  mdadOverride?: Inputs["mdadOverride"];
  transitsOverride?: Inputs["transitsOverride"];

  // anything else (style, spans, history, etc.)
  [k: string]: any;
};

function okJson(data: any, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function badJson(message: string, status = 400, extra?: any) {
  return okJson({ ok: false, error: message, ...(extra ? { extra } : {}) }, status);
}

function pickQuestion(body: QARequestBody): string {
  return String(
    body?.text ??
      body?.input ??
      body?.query ??      // ✅ what ChatClient sends
      body?.question ??
      body?.message ??
      ""
  ).trim();
}

export async function POST(req: Request) {
  try {
    // Read raw once (helps debug when payload isn't what we expect)
    const raw = await req.text();
    let body: QARequestBody = {};
    try {
      body = (raw ? JSON.parse(raw) : {}) as QARequestBody;
    } catch {
      // If JSON parsing fails, show first 200 chars
      return badJson("Invalid JSON body", 400, { rawPreview: raw.slice(0, 200) });
    }

    const q = pickQuestion(body);
    if (!q) {
      return badJson("Missing question. Send one of: query | text | input | question | message", 400, {
        keys: Object.keys(body || {}),
      });
    }

    // Category is optional (ChatClient often doesn't send it)
    const category: Category = (body.category as Category) ?? ("transit" as Category);

    const input: Inputs = {
      question: q, // ✅ always populated now
      category,
      dobISO: body.dobISO ?? body.profile?.dobISO ?? null,
      tob: body.tob ?? body.profile?.tob ?? null,
      place: body.place ?? body.profile?.place ?? null,
      profile: body.profile ?? null,
      mdadOverride: body.mdadOverride ?? null,
      transitsOverride: body.transitsOverride ?? null,
    };

    const result = await orchestrateQA(input);
    return okJson(result);
  } catch (err: any) {
    console.error("qa/orchestrator route error:", err);
    return okJson(
      {
        ok: false,
        error: "qa/orchestrator internal error",
        details: err?.message ?? String(err),
      },
      500
    );
  }
}
