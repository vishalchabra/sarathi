// FILE: src/app/api/ai-transits/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const chat = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: userPrompt }],
      max_tokens: 900,
      temperature: 0.6,
    });

    const text = chat.choices[0]?.message?.content?.trim() || "";
    return NextResponse.json({ text });
  } catch (e) {
    console.error("[ai-transits] error", e);
    return NextResponse.json(
      { error: "Failed to build transit overview" },
      { status: 500 }
    );
  }
}
