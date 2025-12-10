// FILE: src/app/api/ai-transits/route.ts
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
    throw new Error("OPENAI_API_KEY is missing");
  }

  cachedClient = new OpenAI({ apiKey });
  return cachedClient;
}

/* ---------------- simple fallback if AI not available ---------------- */

function buildFallbackTransits(profile: any, transits: any[]): string {
  const name = profile?.name || "you";

  const lines =
    Array.isArray(transits) && transits.length
      ? transits.map((t: any) => {
          return `• ${t.title} (${t.startISO} → ${t.endISO}) — ${t.planet} → ${t.target} [${t.category}, strength ${t.strength}]`;
        })
      : [];

  const summaryList =
    lines.length > 0
      ? lines.join("\n")
      : "• No specific transit windows were provided, so this overview stays general.";

  return [
    `**Career & Work**`,
    `In the coming months, your work life is likely to move through a few clear phases. Some windows bring extra focus, visibility and chances to take on responsibility; others feel slower and more about stabilising what you already have. Instead of pushing constantly, treat the “high-energy” periods as times to propose ideas, network, or step up — and the quieter stretches as time to organise, clear backlog and upgrade your skills. This approach helps you ride the waves of the year rather than fight them.`,
    ``,
    `**Relationships & Family**`,
    `Relationships are likely to have a mix of supportive and stretching phases. You may notice periods where communication flows more easily and family or partner feel closer, and other times where small misunderstandings or distance appear. Take these as reminders to listen carefully, state your needs clearly, and avoid reacting from stress. When intensity rises, simple check-ins, shared routines, and a little extra patience will go a long way in keeping bonds steady.`,
    ``,
    `**Inner Growth, Health & Mindset**`,
    `On the inner level, this year invites ${name} to become more conscious of how mood and energy rise and fall with different planetary transits. Some windows may stir restlessness or overthinking; others support discipline, focus, or a deeper spiritual curiosity. Use this awareness to build steady habits: regular movement, cleaner boundaries with work, and a small daily practice (breath, prayer, journaling) that helps you reset. The more you respond with awareness instead of automatic reaction, the more these transits become opportunities for growth rather than stress.`,
    ``,
    `**Transit windows (reference)**`,
    summaryList,
  ].join("\n");
}

/* ---------------- route ---------------- */

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const profile = body?.profile ?? {};
    const transits = Array.isArray(body?.transits) ? body.transits : [];

    const lines =
      transits.length > 0
        ? transits.map((t: any) => {
            return `${t.title} (${t.startISO} → ${t.endISO}) — ${t.planet} → ${t.target} [${t.category}, strength ${t.strength}]`;
          })
        : [];

    const userPrompt = `
You are an insightful, practical Vedic astrologer.

Using the upcoming transit windows listed below, write a clear, grounded overview of the next 12 months for this person.

STYLE:
- Do NOT start with "Certainly", "Of course", "Here is", etc. Begin directly with the message.
- No hashtags, no emojis.
- Use simple, everyday language, second person ("you").
- Warm, practical, non-fatalistic. No scare tactics.
- Do NOT talk about death, accidents, or severe illness.
- Emphasise free will and wise choices.

CONTENT:
- Organise the overview into 3 short sections:
  1) Career & Work
  2) Relationships & Family
  3) Inner Growth, Health & Mindset
- Refer to the transit windows as background energy, not as fixed events.
- Use probabilistic language like "you may", "it is likely", "this period often brings".
- Highlight 2–3 key themes to focus on and 2–3 things to be mindful of.

Profile:
- Name: ${profile?.name ?? "the native"}
- Birth: ${profile?.birthDateISO ?? "N/A"} ${profile?.birthTime ?? ""} (${profile?.birthTz ?? "tz"})

Transit windows (for your reference as the model):
${lines.join("\n")}
`.trim();

    // 1) Try OpenAI
    try {
      const client = getOpenAIClient();

      const chat = await client.chat.completions.create({
        model: GPT_MODEL,
        messages: [{ role: "user", content: userPrompt }],
        max_tokens: 900,
        temperature: 0.6,
      });

      const text = chat.choices[0]?.message?.content?.trim() || "";
      if (text) {
        return NextResponse.json({ text });
      }
    } catch (err) {
      console.error("[ai-transits] OpenAI error, using fallback", err);
      const fallback = buildFallbackTransits(profile, transits);
      return NextResponse.json({ text: fallback });
    }

    // 2) If somehow no text, still fallback
    const fallback = buildFallbackTransits(profile, transits);
    return NextResponse.json({ text: fallback });
  } catch (e) {
    console.error("[ai-transits] outer error", e);
    const body = await req.json().catch(() => ({} as any));
    const profile = body?.profile ?? {};
    const transits = Array.isArray(body?.transits) ? body.transits : [];
    const fallback = buildFallbackTransits(profile, transits);

    return NextResponse.json({ text: fallback }, { status: 200 });
  }
}
