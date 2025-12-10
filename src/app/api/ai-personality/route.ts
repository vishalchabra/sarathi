// FILE: src/app/api/ai-personality/route.ts
export const runtime = "nodejs";

import "server-only";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/* ---------------- OpenAI setup (lazy) ---------------- */

const GPT_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

let cachedClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (cachedClient) return cachedClient;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Important: this only runs when the route is actually hit,
    // so it won't crash at build time.
    throw new Error("OPENAI_API_KEY is missing");
  }

  cachedClient = new OpenAI({ apiKey });
  return cachedClient;
}

/* ---------------- helpers ---------------- */

function okJson(data: any, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function badJson(message: string, status = 400) {
  return okJson({ error: message, modelUsed: GPT_MODEL }, status);
}

export async function GET() {
  // simple health check endpoint
  return okJson({ ok: true, modelUsed: GPT_MODEL });
}

/* ---------------- route ---------------- */

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as any;
    const prompt: string | undefined = body?.prompt;

    if (!prompt || typeof prompt !== "string") {
      return badJson("Missing 'prompt' in request body", 400);
    }

    const systemPrompt =
      "You are Sārathi, an AI astrologer-personality and guide. " +
      "You speak in warm, grounded, simple language. " +
      "You avoid fatalism, fear, and health scare predictions. " +
      "You emphasise free will, learning, and conscious choices. " +
      "Keep answers compact and human, not over-formal.";

    try {
      const client = getOpenAIClient();

      const completion = await client.chat.completions.create({
        model: GPT_MODEL,
        temperature: 0.4,
        max_tokens: 400,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      });

      const text =
        completion.choices[0]?.message?.content?.trim() ||
        "I’m not sure what to say yet, but I’m here to guide you gently.";

      return okJson({ text, modelUsed: GPT_MODEL });
    } catch (err: any) {
      // If key is missing or OpenAI fails → graceful fallback
      console.error("[api/ai-personality] OpenAI error, using fallback", err);

      const fallback =
        "I am Sārathi, here to remind you that your chart does not lock you in—it simply describes tendencies and timings. " +
        "Your real power is in how you respond: staying honest with yourself, making small, aligned choices, " +
        "and learning from each phase instead of judging it. Wherever you are right now, start with one simple, kind action toward yourself and your path.";

      return okJson({
        text: fallback,
        modelUsed: `${GPT_MODEL} (fallback-local)`,
      });
    }
  } catch (err: any) {
    console.error("[api/ai-personality] outer error", err);
    return okJson(
      {
        error: "ai_personality_failed",
        details: String(err),
        modelUsed: GPT_MODEL,
      },
      502,
    );
  }
}
