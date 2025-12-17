// FILE: src/app/api/qa/route.ts
import "server-only";
import { NextResponse } from "next/server";

import { orchestrateQA, type Category, type Inputs } from "./orchestrator";

export const runtime = "nodejs";

/**
 * We accept multiple possible keys because different clients may send:
 * - query (ChatClient.tsx)
 * - text / input (older QA routes)
 * - question (legacy)
 */
type QARequestBody = {
  // common question fields
  query?: string;
  text?: string;
  input?: string;
  message?: string;
  question?: string;

  // routing
  category?: Category;

  // profile/time/place (both top-level and nested profile)
  dobISO?: string | null;
  tob?: string | null;
  place?: {
    name?: string;
    tz?: string;
    lat?: number;
    lon?: number;
  } | null;

  profile?: Inputs["profile"] | null;

  // overrides
  mdadOverride?: Inputs["mdadOverride"];
  transitsOverride?: Inputs["transitsOverride"];

  // allow extra keys from chat payload (style, spans, history, etc.)
  [k: string]: unknown;
};

function okJson(data: any, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function badJson(message: string, status = 400) {
  return okJson({ ok: false, error: message }, status);
}

function inferCategory(q: string): Category {
  const s = (q || "").toLowerCase();

  // vehicle
  if (
    /\b(vehicle|car|bike|motorcycle|scooter|purchase a car|buy a car|sell my car|new car)\b/.test(
      s
    )
  )
    return "vehicle";

  // property
  if (
    /\b(property|house|home|apartment|flat|villa|plot|land|real estate|rent|lease|mortgage)\b/.test(
      s
    )
  )
    return "property";

  // relationships
  if (
    /\b(relationship|marriage|partner|wife|husband|love|breakup|divorce|compatibility|affair)\b/.test(
      s
    )
  )
    return "relationships";

  // disputes/legal
  if (
    /\b(dispute|case|court|legal|lawsuit|complaint|fight|argument|settlement|police|contract issue)\b/.test(
      s
    )
  )
    return "disputes";

  // job/business
  if (
    /\b(job|career|work|promotion|switch|resign|offer|interview|business|startup|client|sales|hiring)\b/.test(
      s
    )
  )
    return "job-business";

  // default
  return "transit";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as QARequestBody;

    const question = String(
      body.query ??
        body.text ??
        body.input ??
        body.message ??
        body.question ??
        ""
    ).trim();

    if (!question) {
      return badJson(
        "Missing question. Send one of: query | text | input | message | question",
        400
      );
    }

    const category: Category = body.category ?? inferCategory(question);

    const input: Inputs = {
      question,
      category,
      dobISO: (body.dobISO ?? (body.profile as any)?.dobISO ?? null) as any,
      tob: (body.tob ?? (body.profile as any)?.tob ?? null) as any,
      place: (body.place ?? (body.profile as any)?.place ?? null) as any,
      profile: (body.profile ?? null) as any,
      mdadOverride: (body.mdadOverride ?? null) as any,
      transitsOverride: (body.transitsOverride ?? null) as any,
      // If orchestrator supports extra fields, it can read them from `profile` or ignore.
      // We keep input minimal here to avoid type fights.
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
