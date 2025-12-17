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

function isNonEmptyString(x: any): x is string {
  return typeof x === "string" && x.trim().length > 0;
}

function buildStructuredPrompt(body: any): string {
  // This turns your natPayload (structured) into ONE prompt string
  // so naturalize can work even if "text" isn't provided.
  const userQuestion = String(body?.userQuestion ?? "").trim();
  const topic = String(body?.topic ?? "").trim();
  const followupMode = String(body?.followupMode ?? "").trim();
  const history = String(body?.history ?? "").trim();

  const distressed = Boolean(body?.distressed);
  const moodHint = String(body?.moodHint ?? "").trim();
  const distressSoothing = String(body?.distressSoothing ?? "").trim();
  const astroStressDriver = String(body?.astroStressDriver ?? "").trim();
  const copingTip = String(body?.copingTip ?? "").trim();

  const astroFacts = body?.astroFacts ?? {};
  const evidenceBullets = Array.isArray(body?.evidenceBullets) ? body.evidenceBullets : [];
  const styleGuide = body?.styleGuide ?? null;

  const lines: string[] = [];

  lines.push(`USER_QUESTION:\n${userQuestion || "(missing)"}`);
  if (topic) lines.push(`\nTOPIC:\n${topic}`);
  if (followupMode) lines.push(`\nFOLLOWUP_MODE:\n${followupMode}`);
  if (moodHint) lines.push(`\nMOOD_HINT:\n${moodHint}`);
  lines.push(`\nDISTRESSED:\n${distressed ? "yes" : "no"}`);

  if (distressSoothing) lines.push(`\nSOOTHING:\n${distressSoothing}`);
  if (astroStressDriver) lines.push(`\nASTRO_STRESS_DRIVER:\n${astroStressDriver}`);
  if (copingTip) lines.push(`\nCOPING_TIP:\n${copingTip}`);

  if (history) lines.push(`\nHISTORY:\n${history}`);

  lines.push(`\nASTRO_FACTS_JSON:\n${JSON.stringify(astroFacts, null, 2)}`);
  lines.push(`\nEVIDENCE_BULLETS_JSON:\n${JSON.stringify(evidenceBullets, null, 2)}`);

  if (styleGuide) {
    lines.push(`\nSTYLE_GUIDE_JSON:\n${JSON.stringify(styleGuide, null, 2)}`);
  }

  return lines.join("\n");
}

/* ---------------- route ---------------- */

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as any;

    const style = (body?.style as "casual" | "formal" | "neutral") ?? "neutral";

    // Mode A: simple “clean this text”
    const rawA = body?.text ?? body?.input;

    // Mode B: structured payload from astro-chat
    const hasStructured =
      isNonEmptyString(body?.userQuestion) ||
      body?.astroFacts != null ||
      Array.isArray(body?.evidenceBullets);

    const raw =
      isNonEmptyString(rawA)
        ? String(rawA)
        : hasStructured
        ? buildStructuredPrompt(body)
        : "";

    if (!isNonEmptyString(raw)) {
      return badJson(
        "Missing 'text' (or 'input'). If calling from astro-chat, send userQuestion + astroFacts/evidenceBullets.",
        400
      );
    }

    const styleHint =
      style === "casual"
        ? "Tone: warm, conversational, but still respectful."
        : style === "formal"
        ? "Tone: polite, professional, and clear."
        : "Tone: balanced, simple, and neutral.";

    // If this came from astro-chat (structured), we want a FULL answer, not a “cleaner”.
    const systemPromptStructured =
      "You are Sārathi, an astrology-based guidance assistant. " +
      "You will be given a structured bundle containing: the user's question, astro facts, and evidence bullets. " +
      "Write a clear, human, helpful answer that follows the STYLE_GUIDE_JSON rules if provided. " +
      "IMPORTANT: Do not invent facts. If you add an evidence section, use ONLY the provided evidence bullets verbatim. " +
      "Do not mention JSON or internal fields. Reply with the final answer text only.";

    // Your original text-cleaner prompt (keep it intact)
    const systemPromptCleaner =
      "You are Sārathi's language cleaner. " +
      "Your job is to gently rewrite short texts so they sound natural, clear, and human. " +
      "Keep the meaning the same, just smoother and easier to read. " +
      "No emojis, no hashtags, no bullet lists unless the input already uses them. " +
      "Do not add new ideas or advice. " +
      "Reply with the improved text only, no explanations or commentary.";

    const useStructuredPrompt = !isNonEmptyString(rawA) && hasStructured;

    // 1) Try OpenAI
    try {
      const client = getOpenAIClient();

      const completion = await client.chat.completions.create({
        model: GPT_MODEL,
        temperature: useStructuredPrompt ? 0.35 : 0.2,
        max_tokens: 700,
        messages: [
          {
            role: "system",
            content: useStructuredPrompt ? systemPromptStructured : systemPromptCleaner,
          },
          {
            role: "user",
            content: `${styleHint}\n\n${useStructuredPrompt ? "INPUT_BUNDLE:" : "Original text:"}\n${raw}`,
          },
        ],
      });

      const text = completion.choices[0]?.message?.content?.trim() || raw.trim();
      return okJson({ text, modelUsed: GPT_MODEL });
    } catch (err) {
      console.error("[api/naturalize] OpenAI error, using fallback", err);

      // Simple deterministic fallback:
      // - If structured: return a minimal safe response
      // - Else: normalise whitespace
      if (!isNonEmptyString(rawA) && hasStructured) {
        const uq = String(body?.userQuestion ?? "").trim();
        const fallback =
          (uq ? `I hear you. Here’s a grounded next step: ` : "") +
          "Focus on one small, practical action today, and avoid making irreversible decisions from a spike in emotion. " +
          "If you want, tell me what outcome you want in the next 7 days, and I’ll shape a clear plan.";
        return okJson({ text: fallback, modelUsed: `${GPT_MODEL} (fallback-local)` });
      }

      const fallback = raw.replace(/\s+/g, " ").trim();
      return okJson({ text: fallback, modelUsed: `${GPT_MODEL} (fallback-local)` });
    }
  } catch (err: any) {
    console.error("[api/naturalize] outer error", err);

    return okJson(
      {
        error: "naturalize_failed",
        details: String(err),
        modelUsed: GPT_MODEL,
      },
      502
    );
  }
}
