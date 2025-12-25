// FILE: src/app/api/ai-personality/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import "server-only";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { SARATHI_SYSTEM_PROMPT } from "@/lib/qa/systemPrompt";

/* ---------------- OpenAI setup (lazy) ---------------- */

// Prefer GPT_MODEL (what we’re using elsewhere), but keep OPENAI_MODEL for backward compat.
const GPT_MODEL = process.env.GPT_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini";

let cachedClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (cachedClient) return cachedClient;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is missing");

  cachedClient = new OpenAI({ apiKey });
  return cachedClient;
}

/* ---------------- helpers ---------------- */

function okJson(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "cache-control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      pragma: "no-cache",
    },
  });
}

function badJson(message: string, status = 400, extra: any = {}) {
  return okJson({ ok: false, error: message, modelUsed: GPT_MODEL, ...extra }, status);
}

export async function GET() {
  return okJson({ ok: true, modelUsed: GPT_MODEL });
}

/* ---------------- route ---------------- */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const report = body?.report ?? body?.lifeReport ?? body;

    if (!report || typeof report !== "object") {
      return badJson("Missing report in POST body", 400);
    }

    const client = getOpenAIClient();

    // We want a predictable shape for the UI: { text: string[], closing: string }
    const userPrompt = `
Create a concise personality snapshot (Vedic style) based on the chart data.

Return ONLY valid JSON in this exact shape:
{
  "text": ["bullet 1", "bullet 2", "..."],
  "closing": "one short closing paragraph"
}

Rules:
- "text" must be an array of 5–10 short bullet sentences.
- No markdown fences. No extra keys. No prose outside JSON.
- Warm, grounded, practical. Avoid fatalism/fear/health-scare predictions.
- Emphasize free will and conscious choices.

Chart data:
${JSON.stringify(report, null, 2)}
`.trim();

    const completion = await client.chat.completions.create({
      model: GPT_MODEL,
      temperature: 0.7,
      max_tokens: 450,
      messages: [
        { role: "system", content: SARATHI_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "";

    if (!raw) {
      return badJson("OpenAI returned empty content", 502);
    }

    // Parse the JSON output safely (strip accidental fences if any)
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    let parsed: any = null;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // If the model didn’t follow instructions, surface it clearly for debugging
      return badJson("Model did not return valid JSON", 502, {
        rawPreview: cleaned.slice(0, 300),
      });
    }

    const bulletsRaw = parsed?.text;
    const closingRaw = parsed?.closing;

    const bullets: string[] = Array.isArray(bulletsRaw)
      ? bulletsRaw.map((x: any) => String(x)).filter(Boolean)
      : typeof bulletsRaw === "string"
        ? [bulletsRaw]
        : [];

    const closing = typeof closingRaw === "string" ? closingRaw.trim() : "";

    if (!bullets.length) {
      return badJson("Parsed JSON missing 'text' bullets", 502, {
        parsedPreview: JSON.stringify(parsed).slice(0, 300),
      });
    }

    return okJson({
      ok: true,
      text: bullets,
      closing,
      modelUsed: GPT_MODEL,
    });
  } catch (err: any) {
    console.error("[api/ai-personality] error", err);
    return okJson(
      {
        ok: false,
        error: "ai_personality_failed",
        details: String(err?.message ?? err),
        modelUsed: GPT_MODEL,
      },
      502
    );
  }
}
