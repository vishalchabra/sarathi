// FILE: src/app/api/qa/route.ts
import "server-only";
import { NextResponse } from "next/server";

import {
  orchestrateQA,
  type Category,
  type Inputs,
} from "./orchestrator";

export const runtime = "nodejs";

type QARequestBody = {
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
};

function okJson(data: any, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function badJson(message: string, status = 400) {
  return okJson({ error: message }, status);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as QARequestBody;

    const category: Category | undefined = body.category;
    if (!category) {
      return badJson("Missing category (vehicle | job | property | relationships | disputes | transit)", 400);
    }

    const input: Inputs = {
      question: body.question,
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
