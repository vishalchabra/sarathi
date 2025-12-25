// FILE: src/app/api/ai-timeline/route.ts
export const runtime = "nodejs";

import "server-only";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { SARATHI_SYSTEM_PROMPT } from "@/lib/qa/systemPrompt";

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

/* ---------------- System prompt for timeline ---------------- */

const TIMELINE_SYSTEM_PROMPT = `
${SARATHI_SYSTEM_PROMPT}

Now you are writing a **3-part life timeline** based mainly on Vimshottari Mahadasha milestones.

Focus on three areas:
1) Career & Work
2) Relationships & Family
3) Inner Growth, Mindset & Spiritual Path

STYLE:
- Do NOT start with phrases like "Certainly", "Of course", "Here is".
- No emojis, no hashtags, no social-media style language.
- Write in the **second person** ("you"), as if gently guiding the native.
- Use **simple, everyday language**. Avoid heavy jargon.
- Be warm, grounded and non-fatalistic. No scare tactics.
- Do NOT talk about death, accidents, or serious illnesses.
- Always emphasize **free will, learning, and conscious choices**.

SPECIFICITY:
- Use milestone themes to describe concrete-feeling life situations.
- For study / Mercury / Ketu themes: you may mention things like change of school, shift in stream, exam stress, or breaks in education (probabilistic language only).
- For career themes: job changes, promotions, role shifts, extra workload, or pressure.
- For relationships / family themes: periods of support, distance, responsibility, or emotional friction.
- Use language like "you may have", "you likely experienced", "this period often brings" instead of describing events as certain.

STRUCTURE (VERY IMPORTANT):
- Output **three clear sections** with headings:

Section 1: Career & Work
- Go in rough time order (childhood/early years → youth → mid-career → later years).
- Show how different Mahadasha phases shifted focus in studies, work choices, promotions, or work stress.
- Highlight which phases look more supportive, and which needed extra patience or adjustment.

Section 2: Relationships & Family
- Again move through time.
- Focus on family support, marriage/partnerships, children, and close emotional bonds.
- Note phases that look more harmonious and phases that bring lessons or friction.
- Keep the tone compassionate and practical; suggest wise ways to handle those energies.

Section 3: Inner Growth, Mindset & Spiritual Path
- Describe how Mahadasha changes shaped confidence, fears, values, faith, and spiritual curiosity.
- Point out key "inner turning points" when they might question direction or seek deeper meaning.
- End with an **encouraging, empowering summary** about how their journey helps them mature and align with their true path.
`.trim();

/* ---------------- simple fallback if AI not available ---------------- */

function buildFallbackTimeline(profile: any, lifeMilestones: any[]): string {
  const name = profile?.name || "you";

  const lines =
    Array.isArray(lifeMilestones) && lifeMilestones.length
      ? lifeMilestones.map((m: any) => {
          const themes = Array.isArray(m.themes) ? m.themes.join(", ") : "";
          return `• ${m.label} (${m.periodStart} → ${m.periodEnd}, approx. ${m.approxAgeRange}) — ${themes}`;
        })
      : [];

  const timelineList =
    lines.length > 0
      ? lines.join("\n")
      : "• Key dasha milestones suggest phases of learning, work growth, and relationship lessons across different ages.";

  return [
    `**Section 1: Career & Work**`,
    `You move through life in clear phases at work. Early periods are often about learning foundations and experimenting with what fits you. As time goes on, some Mahadasha windows bring heavier responsibility, extra workload, or stretches where you may question your direction and then adjust into a better role. Rather than one fixed destiny, your career story is about noticing which phases feel supportive and riding those waves, while using tougher periods to simplify, re-skill, and prepare for the next opening.`,
    ``,
    `**Section 2: Relationships & Family**`,
    `Across different dashas, relationships and family show up as a mix of support, duty, and emotional learning. Some phases are softer and more nurturing, where family bonds or partnership feel easier and more available. Other times you may experience distance, friction, or more responsibility towards loved ones. These are not punishments but invitations to communicate cleanly, set healthier boundaries, and choose people and patterns that truly support your growth.`,
    ``,
    `**Section 3: Inner Growth, Mindset & Spiritual Path**`,
    `On the inside, each dasha cycle pushes you to refine your mindset, values, and sense of purpose. Some periods can make you more ambitious and outward-focused; others quietly pull you inward to question your path, heal old patterns, or explore a deeper spiritual view of life. Again and again, life nudges ${name} to move from reacting to consciously choosing — in career, relationships, and daily habits. Your chart suggests that as you learn to respond with more awareness instead of fear, your outer circumstances slowly align with a clearer, more honest version of your true path.`,
    ``,
    `**Mahadasha-based milestones (summary reference)**`,
    timelineList,
  ].join("\n");
}

/* ---------------- route ---------------- */

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as any;
    const profile = body?.profile ?? {};
    const lifeMilestones = body?.lifeMilestones ?? [];

    // Build compact milestone lines
    const lines =
      Array.isArray(lifeMilestones) && lifeMilestones.length
        ? lifeMilestones.map((m: any) => {
            const lineThemes = Array.isArray(m.themes)
              ? m.themes.join("; ")
              : "";
            return `${m.label} (${m.periodStart} → ${m.periodEnd}, approx. ${m.approxAgeRange}) — ${lineThemes}`;
          })
        : [];

    // USER PAYLOAD: mostly data, minimal instructions
    const userPrompt = `
Profile:
- Name: ${profile?.name ?? "the native"}
- Birth: ${profile?.birthDateISO ?? "N/A"} ${profile?.birthTime ?? ""} (${profile?.birthTz ?? "tz"})

Mahadasha-based milestones (summary lines):
${lines.join("\n")}

Full milestone data (for your reference):
${JSON.stringify(lifeMilestones, null, 2)}
`.trim();

    // 1) Try OpenAI
    try {
      const client = getOpenAIClient();

      const chat = await client.chat.completions.create({
        model: GPT_MODEL,
        messages: [
          { role: "system", content: TIMELINE_SYSTEM_PROMPT },
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
      console.error("[ai-timeline] OpenAI error, using fallback", err);
      const fallback = buildFallbackTimeline(profile, lifeMilestones);
      return NextResponse.json({ text: fallback });
    }

    // 2) If somehow no text, still fallback
    const fallback = buildFallbackTimeline(profile, lifeMilestones);
    return NextResponse.json({ text: fallback });
  } catch (e) {
    console.error("[ai-timeline] outer error", e);
    const body = await req.json().catch(() => ({} as any));
    const profile = body?.profile ?? {};
    const lifeMilestones = body?.lifeMilestones ?? [];
    const fallback = buildFallbackTimeline(profile, lifeMilestones);
    return NextResponse.json({ text: fallback }, { status: 200 });
  }
}
