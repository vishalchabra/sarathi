// FILE: src/app/api/ai-transits/route.ts
export const runtime = "nodejs";

import "server-only";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ASTROSARATHI_SYSTEM_PROMPT } from "@/lib/qa/systemPrompt";

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

/* ---------------- System prompt for transit overview ---------------- */

const TRANSITS_SYSTEM_PROMPT = `
${ASTROSARATHI_SYSTEM_PROMPT}

Now you are writing a **12-month transit overview**.

FOCUS:
- Use the given transit windows as the main timing backbone.
- Translate them into a lived experience across:
  1) Career & Work
  2) Relationships & Family
  3) Inner Growth, Health & Mindset

STYLE:
- Do NOT start with phrases like "Certainly", "Of course", or "Here is".
- No emojis, no hashtags, no social-media tone.
- Write in the **second person** ("you"), speaking directly to the native.
- Use **simple, everyday language**; avoid jargon and cookbook clichés.
- Warm, practical, non-fatalistic; no scare tactics.
- Do NOT talk about death, accidents, or severe illness.
- Emphasise **free will, awareness, and wise choices**.

HOW TO USE TRANSITS:
- Treat each transit window as **background weather**, not a fixed event.
- Use probabilistic language: "you may", "it is likely", "this period often brings".
- Highlight:
  - 2–3 key themes to actively lean into.
  - 2–3 patterns or risks to be mindful of.
- Always suggest **grounded actions** (what to do, how to respond).

STRUCTURE (VERY IMPORTANT):
Write three clear sections with headings:

Section 1: Career & Work
- Describe how the sequence of transits may shift focus at work: visibility, pressure, responsibility, opportunity, change.
- Indicate which periods feel more supportive for proposals, interviews, or new initiatives, and which call for consolidation or patience.

Section 2: Relationships & Family
- Describe how transit patterns might play out in communication, closeness, family duties, or partnership.
- Point out phases that are easier for bonding, and phases that need extra listening, boundaries, or softness.

Section 3: Inner Growth, Health & Mindset
- Connect the transits to mood, energy, discipline, and spiritual curiosity.
- Encourage simple routines: body movement, rest, and a small daily inner practice.
- End with a short, encouraging summary about using these 12 months as a conscious training ground rather than something to fear.
`.trim();

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
Profile:
- Name: ${profile?.name ?? "the native"}
- Birth: ${profile?.birthDateISO ?? "N/A"} ${profile?.birthTime ?? ""} (${profile?.birthTz ?? "tz"})

Transit windows (for your reference):
${lines.join("\n")}
`.trim();

    // 1) Try OpenAI
    try {
      const client = getOpenAIClient();

      const chat = await client.chat.completions.create({
        model: GPT_MODEL,
        messages: [
          { role: "system", content: TRANSITS_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
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
