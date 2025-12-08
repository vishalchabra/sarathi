// FILE: src/app/api/ai-daily/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type DailyFeature = {
  dateISO: string;
  moonNakshatra: string | null;      // e.g. "Swati"
  houseFromMoon: number | null;      // 1..12 relative to natal Moon
  focusArea: string;                 // short, like "career", "home & family"
  strongestTransit?: {
    transitPlanet: string;
    natalPlanet: string;
    aspect: string;                  // "conjunction", "square", etc.
    category: "career" | "relationships" | "health" | "inner" | "general";
    strength: number;
    window?: { startISO: string; endISO: string };
  } | null;
};

type DailyRequestBody = {
  profile?: {
    name?: string;
    birthDateISO?: string;
    birthTime?: string;
    birthTz?: string;
  };
  dailyFeatures?: DailyFeature[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as DailyRequestBody;
    const profile = body.profile ?? {};
    const days = Array.isArray(body.dailyFeatures) ? body.dailyFeatures : [];

    if (!days.length) {
      return NextResponse.json({ days: [] });
    }

    // Compact payload we send to the model
    const payloadForModel = {
      profile: {
        name: profile.name ?? "the user",
        birthDateISO: profile.birthDateISO ?? null,
        birthTime: profile.birthTime ?? null,
        birthTz: profile.birthTz ?? null,
      },
      days: days.map((d) => ({
        dateISO: d.dateISO,
        moonNakshatra: d.moonNakshatra,
        houseFromMoon: d.houseFromMoon,
        focusArea: d.focusArea,
        strongestTransit: d.strongestTransit ?? null,
      })),
    };

const systemPrompt = `
You are an expert Vedic astrology guide writing daily guidance.
You receive:
- The user's basic birth profile (for tone only, not calculation).
- For each day:
  - dateISO
  - moonNakshatra: Moon's transit nakshatra for that day.
  - houseFromMoon: house number from natal Moon that is highlighted that day (1..12).
  - focusArea: a short phrase like "career", "home & family", "finances & food", "communication & short tasks".
  - strongestTransit: optional major transit (e.g. Mars conjunct natal Ketu) including category.

Your task:
- For each day, write **2–3 short, simple sentences** (max ~70–80 words total) of practical guidance.
- Always anchor the message in the Moon and the focus area, but **vary your opening sentence**.
  - Do NOT start every day with the same phrase.
  - Rotate forms like: "Today the Moon moves through...", "With the Moon in...", "As the Moon passes through...", "This day carries the energy of...", etc.
- Mention the Moon's nakshatra in simple language, e.g.
  "With the Moon in Swati today, the energy supports communication and short tasks."
- Do NOT mention "houseFromMoon" as a number; translate it to a domain like "finances", "home & family", "relationships", "routines", etc., using the given focusArea.

Handling strongestTransit (very important):
- strongestTransit is **optional** and should stay a **secondary** background theme.
- You are **not required** to mention it every day.
- When the **same transit** is active on many consecutive days:
  - Mention it explicitly on **at most 3 days** in any 7-day block.
  - Prefer to highlight it on the **first** and **last** day of its active window, plus at most one middle day if helpful.
  - On other days, you may **omit it entirely** or reference the theme very lightly without naming the planets.
- When you *do* mention a transit:
  - Keep it grounded: talk about tendencies and choices, not fixed events.
  - Do NOT be dramatic or fatalistic.
  - Emphasise awareness, practical do/don't, and small adjustments.
  - Translate aspects into plain language: "supportive alignment", "testing influence", "energising influence", etc.
- Never invent dates, planets or nakshatras that are not in the input.

Tone and safety:
- Keep the tone calm, non-fearful, and realistic.
- No predictions of accidents, illness, death, or extreme events.
- Focus on what the user can **do**: small steps, reflections, healthy boundaries, and constructive use of energy.

Return JSON only in this exact shape:

{
  "days": [
    { "dateISO": "YYYY-MM-DD", "text": "..." },
    ...
  ]
}

The "days" array must be in the same order and have the same length as the input days array.
`.trim();


    const userPrompt = `
Here is the structured input for the user's daily guidance:

${JSON.stringify(payloadForModel, null, 2)}

Remember:
- Keep 2–3 short sentences per day.
- Be grounded, gentle, and practical.
- Return only valid JSON, no extra commentary.
    `.trim();

    // Use chat.completions – compatible with older OpenAI SDK versions
    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const rawText = completion.choices[0]?.message?.content ?? "";

    // If model misbehaves, fall back gracefully
    let parsed: any = {};
    try {
      parsed = JSON.parse(rawText);
    } catch {
      // Fallback: echo days with simple local text
      return NextResponse.json({
        days: days.map((d) => ({
          dateISO: d.dateISO,
          text:
            `Today the Moon moves through ${d.moonNakshatra ?? "this nakshatra"}, ` +
            `highlighting ${d.focusArea || "your regular routines"}.`,
        })),
      });
    }

    const outDays = Array.isArray(parsed.days) ? parsed.days : [];

    const result = days.map((d, idx) => {
      const fromModel = outDays[idx] ?? {};
      const text =
        typeof fromModel.text === "string" && fromModel.text.trim()
          ? fromModel.text.trim()
          : `Today the Moon moves through ${d.moonNakshatra ?? "this nakshatra"}, highlighting ${d.focusArea || "your regular routines"}.`;
      return {
        dateISO: d.dateISO,
        text,
      };
    });

    return NextResponse.json({ days: result });
  } catch (e) {
    console.error("[ai-daily] error", e);
    return NextResponse.json(
      {
        days: [],
        error: "Failed to generate AI daily guidance",
      },
      { status: 500 }
    );
  }
}
