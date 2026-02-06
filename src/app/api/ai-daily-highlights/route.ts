import OpenAI from "openai";

export const runtime = "nodejs";

type DayInput = {
  dateISO: string;
  facts: string[];
  confidence: "high" | "medium" | "low";
  focusHint?: "work" | "money" | "relationships" | "home" | "health" | "mind" | "purpose" | "creativity";
};

type DayOutput = {
  dateISO: string;
  headline: string;
  area: string; // Work & direction | Relationships | etc.
  text: string; // 90–140 words
  why: string[]; // 2 bullets
  do: { text: string; reason: string }[];
  avoid: { text: string; reason: string }[];
  microAction: string;
  confidence: "high" | "medium" | "low";
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function safeStrArr(x: any): string[] {
  return Array.isArray(x) ? x.map((v) => String(v)).filter(Boolean) : [];
}
function safeStr(x: any): string {
  return typeof x === "string" ? x.trim() : String(x ?? "").trim();
}
function clampWords(s: string, maxWords: number) {
  const parts = safeStr(s).split(/\s+/).filter(Boolean);
  return parts.slice(0, maxWords).join(" ");
}

function safeObjBulletArr(x: any): { text: string; reason: string }[] {
  if (!Array.isArray(x)) return [];
  return x
    .map((v) => ({
      text: safeStr(v?.text),
      reason: safeStr(v?.reason),
    }))
    .filter((b) => b.text);
}

function safeObjArr(x: any): any[] {
  return Array.isArray(x) ? x.filter((v) => v && typeof v === "object") : [];
}
function enrichTextPerDay(text: string, idx: number, area: string) {
  const openers = [
    "Today leans practical — progress comes from finishing, not starting.",
    "Momentum builds through closure and follow-ups today.",
    "Clarity improves once you simplify the moving pieces.",
    "A quieter, more deliberate pace works better today.",
    "Focus narrows — what you complete matters more than what you begin.",
    "Expect small decisions to shape the day more than big events.",
    "Energy steadies when you remove noise and stick to basics.",
  ];

  const scenarios = {
    "Work & direction": [
      "- A follow-up or pending response becomes the main task",
      "- One conversation needs clarity before progress continues",
      "- You may need to close something delayed",
    ],
    "Money & decisions": [
      "- A small expense or purchase decision appears",
      "- You review budgets or costs briefly",
      "- Avoid impulse financial moves",
    ],
    "Relationships": [
      "- Tone matters more than content today",
      "- Someone may need reassurance or clarity",
      "- A message or reply needs a softer approach",
    ],
    "Health & energy": [
      "- Energy dips slightly mid-day",
      "- Routine matters more than intensity",
      "- Simpler food/sleep choices help",
    ],
    "Mind & emotions": [
      "- Mood shifts quickly if overstimulated",
      "- Quiet time helps reset perspective",
      "- Overthinking reduces once you act",
    ],
  } as Record<string, string[]>;

  const base = openers[idx % openers.length];
  const areaScenarios = scenarios[area] || scenarios["Work & direction"];

  const scenarioBlock =
    "Likely today:\n" +
    areaScenarios.slice(0, 2).join("\n");

  if (!text || text.length < 40) {
    return `${base}\n\n${scenarioBlock}`;
  }

  if (/Likely today:/i.test(text)) {
    return text;
  }

  return `${base}\n\n${scenarioBlock}\n\n${text}`;
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
  "You are Sārathi — premium, calm, practical daily guidance inspired by Vedic astrology.",
  "You may describe likely scenarios and themes (e.g., follow-ups, negotiations, workload spikes, spending urges, misunderstandings, low energy, clarity bursts) but you must NOT claim certainty or guarantee outcomes.",
  "No fear language. No clichés. No generic motivation. Make guidance specific, grounded, and usable.",
  "Do NOT repeat the input facts verbatim. Use them to infer guidance.",
  "Do NOT mention nakshatra/yoga/karana or raw astro jargon.",
  "Return ONLY valid JSON. No markdown. No extra text.",
  "Do not assume an office context. If the focus is not Work & direction, use everyday-life scenarios (home, money, health, relationships).",
].join(" ");



    const user = {
      profile: {
        name: String(profile?.name ?? ""),
        birthDateISO: String(profile?.birthDateISO ?? ""),
        birthTime: String(profile?.birthTime ?? ""),
        birthTz: String(profile?.birthTz ?? ""),
      },
instruction:
"Return JSON only. You MUST return exactly the same number of days as input (days.length). " +

"Use focusHint as the primary anchor for each day’s life area and scenarios. Do NOT drift into other areas. " +
"If focusHint is not 'work', avoid workplace words like management, colleagues, meetings; use everyday-life contexts instead. " +

"Each day MUST feel specific and distinct. Do NOT reuse the same headline, opening sentence, or the #1 DO item across days. " +

"TEXT FORMAT RULE: In text, include (A) 'Likely today:' with 2–3 concrete adult-real situations, then (B) one line starting with 'Reason:' explaining the day theme in plain language (no jargon), then (C) 1 short paragraph of guidance (100–140 words total). " +

"Likely-today scenarios must be different in meaning across the week (do not repeat the same 'follow-ups/clarity' framing daily). " +

"Write with crisp, high-trust language. Avoid phrases like 'it’s a good time', 'you may feel inclined', 'today is ideal'. Prefer direct guidance. " +

"Each 'why' bullet must reflect the inputs: one about Moon tone (mental/emotional pace) and one about the strongest transit (where pressure/action is). " +

"All DO/AVOID items must match focusHint (money => spending/budget/obligations; relationships => tone/messages/repair; work => priorities/follow-ups/decisions; health => sleep/routine/energy; home => family/organization; mind => overthinking/reset/focus). " +

"No astrology jargon. No clichés. Do NOT repeat the input facts verbatim—translate them into plain reasons and scenarios.",


      days: days.map(d => ({
  ...d,
  focusHint: d.focusHint || "work"
})),

      outputFormat: {
  days: [
    {
      dateISO: "YYYY-MM-DD",
      headline: "string",
      area:
        "Work & direction|Money & decisions|Relationships|Home & family|Health & energy|Mind & emotions|Purpose & learning|Creativity & confidence",
      text: "string",
      why: ["...","..."],
      do: [
        { text: "...", reason: "..." },
        { text: "...", reason: "..." },
        { text: "...", reason: "..." },
      ],
      avoid: [
        { text: "...", reason: "..." },
        { text: "...", reason: "..." },
        { text: "...", reason: "..." },
      ],
      microAction: "string",
      confidence: "high|medium|low",
    },
  ],
},

    };

    const resp = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL_DAILY || "gpt-4o-mini",
      temperature: 0.6,
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
  dateISO: safeStr(d?.dateISO),
  headline: clampWords(d?.headline, 6),
  area: safeStr(d?.area || "Work & direction"),
  text: safeStr(d?.text),
  why: safeStrArr(d?.why).slice(0, 2),
  do: safeObjBulletArr(d?.do).slice(0, 3),
  avoid: safeObjBulletArr(d?.avoid).slice(0, 3),
  microAction: safeStr(d?.microAction),
  confidence:
    d?.confidence === "high" || d?.confidence === "low"
      ? d.confidence
      : "medium",
}));
// If model returns fewer days than requested, pad with deterministic placeholders
if (out.length < days.length) {
  const missing = days.slice(out.length);
  for (let i = 0; i < missing.length; i++) {
    const di = missing[i];
    out.push({
      dateISO: String(di?.dateISO || ""),
      headline: "Steady progress",
      area: "Work & direction",
      text:
        "Keep today simple and execution-focused. Finish one pending item, send one clean follow-up, and avoid starting new threads. If you feel pulled in multiple directions, choose the task with the clearest payoff and complete it first. You’ll gain momentum by tightening the basics rather than chasing novelty.",
      why: ["Your day supports closure and follow-through.", "Less noise brings more progress."],
      do: [
        { text: "Close one pending task", reason: "Momentum beats scattered effort." },
        { text: "Send one precise follow-up", reason: "Clear asks get faster responses." },
        { text: "Work in one focused block", reason: "Depth creates quality." },
      ],
      avoid: [
        { text: "Starting multiple new threads", reason: "It dilutes attention." },
        { text: "Over-explaining", reason: "Keep communication crisp." },
        { text: "Late caffeine", reason: "Protect sleep and recovery." },
      ],
      microAction: "Write the single outcome you want today, then do 25 minutes on it.",
      confidence: di?.confidence === "high" || di?.confidence === "low" ? di.confidence : "medium",
    });
  }
}
const ALLOWED_AREAS = new Set([
  "Work & direction",
  "Money & decisions",
  "Relationships",
  "Home & family",
  "Health & energy",
  "Mind & emotions",
  "Purpose & learning",
  "Creativity & confidence",
]);

// 1) sanitize areas
for (const d of out) {
  if (!ALLOWED_AREAS.has(d.area)) d.area = "Work & direction";
}

// 2) only rotate areas if the model didn't diversify enough
const uniqueAreas = new Set(out.map((d) => d.area));
if (uniqueAreas.size < 4 && out.length >= 4) {
  const targetOrder = [
    "Work & direction",
    "Money & decisions",
    "Relationships",
    "Health & energy",
    "Home & family",
    "Mind & emotions",
    "Purpose & learning",
    "Creativity & confidence",
  ];

  for (let i = 0; i < out.length; i++) {
    out[i].area = targetOrder[i % targetOrder.length];
  }
}

// 3) dedupe headlines AFTER final areas are set
const seenHeadlines = new Set<string>();
for (let i = 0; i < out.length; i++) {
  const h = (out[i].headline || "").trim();
  const key = h.toLowerCase();

  if (!h || seenHeadlines.has(key)) {
    out[i].headline = `${out[i].area}: Day ${i + 1}`.slice(0, 32);
  }

  seenHeadlines.add((out[i].headline || "").toLowerCase());
}
for (let i = 0; i < out.length; i++) {
  const t = (out[i].text || "").trim();
  if (!t) {
    out[i].text =
      "Likely today:\n- One pending follow-up becomes important\n- A small decision needs clarity\n\nKeep the day simple: close one loop, communicate clearly, and avoid rushing. Choose one priority, take one clean step, and stop when it’s done.";
  } else if (!/Likely today:/i.test(t)) {
    out[i].text = `Likely today:\n- A follow-up or reply becomes central\n- One conversation needs softer tone\n\n${t}`;
  }
}

for (let i = 0; i < out.length; i++) {
  out[i].text = enrichTextPerDay(out[i].text, i, out[i].area);
}

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
