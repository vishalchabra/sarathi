import OpenAI from "openai";

export const runtime = "nodejs";

type DayInput = {
  dateISO: string;
  facts: string[];
  confidence: "high" | "medium" | "low";
};

type DayOutput = {
  dateISO: string;
  headline: string;
  text: string;
  do: string[];
  avoid: string[];
  confidence: "high" | "medium" | "low";
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function safeArr(x: any): string[] {
  return Array.isArray(x) ? x.map((v) => String(v)).filter(Boolean) : [];
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const profile = body?.profile || {};
    const days: DayInput[] = Array.isArray(body?.days) ? body.days : [];

    if (!days.length) {
      return Response.json({ days: [] }, { status: 200 });
    }

    // System: astrologer voice + must use facts
    const sys = [
      "You are a Vedic astrologer writing concise daily guidance.",
      "Do NOT sound like ChatGPT. No generic motivational language.",
      "You MUST base every day strictly on the provided facts.",
      "Do not invent planets, nakshatras, houses, yogas, or aspects.",
      "Keep it short, grounded, and human.",
    ].join(" ");

    const user = {
      profile: {
        name: String(profile?.name ?? ""),
        birthDateISO: String(profile?.birthDateISO ?? ""),
        birthTime: String(profile?.birthTime ?? ""),
        birthTz: String(profile?.birthTz ?? ""),
      },
      instruction:
        "For each day: write (1) a 4–7 word headline, (2) 60–90 words of guidance, (3) 2–3 DO bullets, (4) 2–3 AVOID bullets. Use at least 2 facts verbatim (or near-verbatim).",
      days,
      outputFormat: {
        days: [
          {
            dateISO: "YYYY-MM-DD",
            headline: "string",
            text: "string",
            do: ["..."],
            avoid: ["..."],
            confidence: "high|medium|low",
          },
        ],
      },
    };

    const resp = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL_DAILY || "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: JSON.stringify(user) },
      ],
      response_format: { type: "json_object" },
    });

    const raw = resp.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);

    const out: DayOutput[] = safeArr(parsed?.days).map((d: any) => ({
      dateISO: String(d?.dateISO ?? ""),
      headline: String(d?.headline ?? "").trim(),
      text: String(d?.text ?? "").trim(),
      do: safeArr(d?.do).slice(0, 3),
      avoid: safeArr(d?.avoid).slice(0, 3),
      confidence:
        d?.confidence === "high" || d?.confidence === "low"
          ? d.confidence
          : "medium",
    }));

    return Response.json({ days: out }, { status: 200 });
  } catch (e: any) {
    return Response.json(
      { error: e?.message || "ai daily failed" },
      { status: 500 }
    );
  }
}
