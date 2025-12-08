import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const profile = body?.profile ?? {};
    const planets = body?.planets ?? [];
    const aspects = body?.aspects ?? [];
    const nakshatraMap = body?.nakshatraMap ?? {};

    const name = profile?.name || "the native";

    const systemPrompt = `
You are a Vedic astrology guide.
Summarize the core personality and life approach of ${name} using:
- Ascendant, Moon, and Sun signs
- Planet placements
- Key aspects
- Nakshatra hints (if provided)

Rules:
- Speak in 2nd person ("you").
- Be supportive and practical, not fatalistic.
- Focus on strengths, patterns, and gentle cautions.
- Keep it about 300–500 words.
`;

    const userContent = `
Profile:
${JSON.stringify(profile, null, 2)}

Planets:
${JSON.stringify(planets, null, 2)}

Aspects:
${JSON.stringify(aspects, null, 2)}

Nakshatra Map:
${JSON.stringify(nakshatraMap, null, 2)}
`;

    const chat = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      max_tokens: 700,
      temperature: 0.6,
    });

    const text = chat.choices[0]?.message?.content?.trim() || "";
    return NextResponse.json({ text });
  } catch (e) {
    console.error("[ai-personality] error", e);
    return NextResponse.json(
      { error: "Failed to build personality summary" },
      { status: 500 }
    );
  }
}
