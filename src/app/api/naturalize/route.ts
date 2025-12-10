// FILE: src/app/api/naturalize/route.ts
export const runtime = "nodejs";

import "server-only";
import { NextResponse } from "next/server";
import OpenAI from "openai";

/* ---------------- OpenAI setup (lazy) ---------------- */

const GPT_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

let cachedClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (cachedClient) return cachedClient;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Only throws if this route is actually called at runtime
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

/* ---------------- route ---------------- */

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as any;
    const raw = (body?.text ?? body?.input ?? "") as string;
    const style = (body?.style as "casual" | "formal" | "neutral") ?? "neutral";

    if (!raw || typeof raw !== "string") {
      return badJson("Missing 'text' (or 'input') field in request body", 400);
    }

    const systemPrompt =
  "You are Sārathi's language cleaner. " +
  "Your job is to gently rewrite short texts so they sound natural, clear, and human. " +
  "Keep the meaning the same, just smoother and easier to read. " +
  "No emojis, no hashtags, no bullet lists unless the input already uses them. " +
  "Do not add new ideas or advice. " +
  "Reply with the improved text only, no explanations or commentary.";


    const styleHint =
      style === "casual"
        ? "Tone: warm, conversational, but still respectful."
        : style === "formal"
        ? "Tone: polite, professional, and clear."
        : "Tone: balanced, simple, and neutral.";

    // 1) Try OpenAI
    try {
      const client = getOpenAIClient();

      const completion = await client.chat.completions.create({
        model: GPT_MODEL,
        temperature: 0.2,
        max_tokens: 400,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `${styleHint}\n\nOriginal text:\n${raw}`,
          },
        ],
      });

      const text =
        completion.choices[0]?.message?.content?.trim() || raw.trim();

      return okJson({ text, modelUsed: GPT_MODEL });
    } catch (err) {
      console.error("[api/naturalize] OpenAI error, using fallback", err);

      // Simple deterministic fallback: just normalise whitespace
      const fallback = raw.replace(/\s+/g, " ").trim();

      return okJson({
        text: fallback,
        modelUsed: `${GPT_MODEL} (fallback-local)`,
      });
    }
  } catch (err: any) {
    console.error("[api/naturalize] outer error", err);

    return okJson(
      {
        error: "naturalize_failed",
        details: String(err),
        modelUsed: GPT_MODEL,
      },
      502,
    );
  }
}
