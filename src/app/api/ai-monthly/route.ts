// FILE: src/app/api/ai-monthly/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type MonthlyBody = {
  profile?: any;
  dashaLayers?: any;
  transits?: any[];
  startDateISO?: string;
  months?: number;
};

type MonthContext = {
  label: string;
  startISO: string;
  endISO: string;
  transits: any[];
};

function buildMonthContexts(
  startDateISO: string,
  months: number,
  transits: any[]
): MonthContext[] {
  const out: MonthContext[] = [];
  const base = new Date(startDateISO + "T00:00:00Z");

  for (let i = 0; i < months; i++) {
    const start = new Date(base.getTime());
    start.setMonth(start.getMonth() + i);
    start.setDate(1);

    const end = new Date(start.getTime());
    end.setMonth(end.getMonth() + 1);
    end.setDate(0); // last day of month

    const monthName = start.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });

    out.push({
      label: monthName, // e.g. "November 2025"
      startISO: start.toISOString().slice(0, 10),
      endISO: end.toISOString().slice(0, 10),
      transits,
    });
  }

  return out;
}

export async function POST(req: Request) {
  try {
    const body: MonthlyBody = await req.json().catch(() => ({} as any));

    const profile = body?.profile ?? {};
    const dashaLayers = body?.dashaLayers ?? {};
    const transits = Array.isArray(body?.transits) ? body.transits : [];
    const startDateISO =
      typeof body?.startDateISO === "string" && body.startDateISO.length >= 10
        ? body.startDateISO.slice(0, 10)
        : new Date().toISOString().slice(0, 10);
    const months =
      typeof body?.months === "number" && body.months > 0 ? body.months : 12;

    const monthContexts = buildMonthContexts(startDateISO, months, transits);

    const userPrompt = `
You are an insightful, practical Vedic astrologer.

You will receive:
- profile information about the person
- dashaLayers (mahadasha / antardasha / pratyantardasha etc., for overall themes)
- an array of monthContexts, each with:
  - label (e.g. "November 2025")
  - startISO, endISO
  - transits[] (planet, target, category, house, houseArea, startISO, endISO, strength, title, description)

Your task:
For EACH monthContext, write a clear monthly guidance section.

How to use the data:
- Use 'category' to identify the main life areas of the month:
  - "career" → work, visibility, responsibilities
  - "relationships" → partnerships, close bonds, negotiations
  - "health" → body, routines, work pressure
  - "inner" → inner work, emotions, spiritual focus
  - "general" → mixed or subtle themes
- Use 'house' and 'houseArea' to make the month feel specific:
  - Repeated 10th house emphasis → career and public role become central.
  - Repeated 7th house emphasis → relationships and partnerships take focus.
  - Repeated 6th house emphasis → health, routines, daily work and discipline.
  - Repeated 4th house emphasis → home, emotional peace, inner stability.
  - Repeated 11th house emphasis → gains, networks, social support.
- Blend this with the dashaLayers context (e.g., if the dasha is relationship-focused, relationship transits gain extra weight).

Fusion logic (conceptual):
- For each month, imagine you weigh all transits:
  - Count which categories and houses are most active.
  - Choose ONE main theme for the month and at most TWO supporting themes.
  - Do NOT try to mention everything; prioritise what clearly stands out.

Output format (very important):
Return ONLY valid JSON in this exact structure:

{
  "months": [
    { "label": "Month YYYY", "text": "Monthly guidance..." },
    ...
  ]
}

Style rules:
- 2–4 short paragraphs per month.
- Use simple, everyday language.
- Use "you" when speaking to the person.
- Tone: warm, grounded, non-fatalistic.
- Do NOT talk about death, accidents, or serious illnesses.
- Do NOT use hashtags or emojis.
- Do NOT complain about missing data.
- Make each month feel distinct in emphasis (even if similar themes, vary the wording and angle).

PROFILE:
${JSON.stringify(profile, null, 2)}

DASHA_LAYERS (context only, don't over-explain it):
${JSON.stringify(dashaLayers, null, 2)}

MONTH_CONTEXTS:
${JSON.stringify(monthContexts, null, 2)}
`.trim();

    const chat = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a calm, practical Vedic astrologer who explains timing in simple, grounded language.",
        },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.6,
      max_tokens: 2200,
    });

    const raw = chat.choices[0]?.message?.content?.trim() || "";

    let parsed: any = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.warn("[ai-monthly] JSON parse failed, raw:", raw);
      const fallback = monthContexts.map((m) => ({
        label: m.label,
        text:
          "This month invites steady progress and balance across key areas of life. Focus on practical steps and gentle self-care.",
      }));
      return NextResponse.json({ months: fallback });
    }

    const monthsOut =
      parsed && Array.isArray(parsed.months) ? parsed.months : ([] as any[]);

    return NextResponse.json({ months: monthsOut });
  } catch (e) {
    console.error("[ai-monthly] error", e);
    return NextResponse.json(
      { error: "Failed to build monthly guidance" },
      { status: 500 }
    );
  }
}
