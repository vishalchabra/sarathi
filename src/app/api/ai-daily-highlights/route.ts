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

function safeStrArr(x: any): string[] {
  return Array.isArray(x) ? x.map((v) => String(v)).filter(Boolean) : [];
}

function safeObjArr(x: any): any[] {
  return Array.isArray(x) ? x.filter((v) => v && typeof v === "object") : [];
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const profile = body?.profile || {};
    const days: DayInput[] = Array.isArray(body?.days) ? body.days : [];

    if (!days.length) {
      return Response.json({ days: [] }, { status: 200 });
    }

    // Helpful env checks (will show you WHY it’s 500)
    console.log("[ai-daily-highlights] model:", process.env.OPENAI_MODEL_DAILY || "gpt-4o-mini");
    console.log("[ai-daily-highlights] has key:", !!process.env.OPENAI_API_KEY);
    console.log("[ai-daily-highlights] days:", days.length);

    const sys = [
  "You are a Vedic astrologer writing concise daily guidance.",
  "Return ONLY valid JSON (no markdown, no backticks, no extra text).",
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
  "Return a JSON object only. For each day: write (1) a 4–7 word headline, (2) 60–90 words of guidance, (3) 2–3 DO bullets, (4) 2–3 AVOID bullets. Use at least 2 facts verbatim (or near-verbatim).",

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
    console.log("[ai-daily-highlights] raw length:", raw.length);
    // console.log("[ai-daily-highlights] raw:", raw); // uncomment temporarily if needed

    let parsed: any = {};
    try {
      parsed = JSON.parse(raw);
    } catch (e: any) {
      console.error("[ai-daily-highlights] JSON.parse failed:", e?.message);
      return new Response(
        JSON.stringify({
          error: "ai-daily-highlights invalid JSON from model",
          rawPreview: raw.slice(0, 500),
        }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

    const out: DayOutput[] = safeObjArr(parsed?.days).map((d: any) => ({
      dateISO: String(d?.dateISO ?? ""),
      headline: String(d?.headline ?? "").trim(),
      text: String(d?.text ?? "").trim(),
      do: safeStrArr(d?.do).slice(0, 3),
      avoid: safeStrArr(d?.avoid).slice(0, 3),
      confidence:
        d?.confidence === "high" || d?.confidence === "low"
          ? d.confidence
          : "medium",
    }));

    return Response.json({ days: out }, { status: 200 });
  } catch (err: any) {
  console.error("[ai-daily-highlights] ERROR message:", err?.message ?? err);
  console.error("[ai-daily-highlights] ERROR status:", err?.status);
  console.error("[ai-daily-highlights] ERROR code:", err?.code);
  console.error("[ai-daily-highlights] ERROR type:", err?.type);
  console.error("[ai-daily-highlights] ERROR stack:", err?.stack ?? "");
  console.error("[ai-daily-highlights] ERROR full:", err);

  return new Response(
    JSON.stringify({
      error: "ai-daily-highlights failed",
      message: String(err?.message ?? err),
      status: err?.status ?? null,
      code: err?.code ?? null,
      type: err?.type ?? null,
    }),
    { status: 500, headers: { "content-type": "application/json" } }
  );
}

}
