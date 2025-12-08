// src/lib/ai.ts
import OpenAI from "openai";

/**
 * You can force a model via .env:
 *   OPENAI_MODEL=gpt-4.1
 *   (or gpt-5-thinking, gpt-5, gpt-4o-mini, etc.)
 *
 * Default stays on a widely available model so you never 404.
 */
const DEFAULT_MODEL = "gpt-4.1";
export const GPT_MODEL = process.env.OPENAI_MODEL || DEFAULT_MODEL;

if (!process.env.OPENAI_API_KEY) {
  console.warn("[ai.ts] Missing OPENAI_API_KEY in .env.local");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Optional helpers
export const isModel = (name: string) => GPT_MODEL.toLowerCase().startsWith(name.toLowerCase());
export const modelLabel = () => GPT_MODEL;
