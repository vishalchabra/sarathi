  import OpenAI from "openai";

  export const runtime = "nodejs";

  type DayInput = {
    dateISO: string;
    facts: string[];
    eventHints?: string[]; // <-- add
    confidence: "high" | "medium" | "low";
    focusHint?: "work" | "money" | "relationships" | "home" | "health" | "mind" | "purpose" | "creativity";
  };


  type DayOutput = {
  dateISO: string;
  headline: string;
  area: string;
  text: string;
  do: string[];
  avoid: string[];
  microAction: string;
  confidence: "high" | "medium" | "low";
  eventHintsUsed?: string[];
};


  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  function safeStrArr(x: any): string[] {
  // array of strings
  if (Array.isArray(x)) {
    return x
      .map((v) => (typeof v === "string" ? v : typeof v?.text === "string" ? v.text : String(v ?? "")))
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // single string => split into bullets/lines
  if (typeof x === "string") {
    return x
      .split(/\r?\n|•|- /g)
      .map((s) => String(s || "").trim())
      .filter(Boolean);
  }

  return [];
}

  function safeStr(x: any): string {
    return typeof x === "string" ? x.trim() : String(x ?? "").trim();
  }
  function clampWords(s: string, maxWords: number) {
    const parts = safeStr(s).split(/\s+/).filter(Boolean);
    return parts.slice(0, maxWords).join(" ");
  }
  function validateHintsUsed(text: string, hints: string[]) {
  const t = String(text || "").toLowerCase();

  // 1) direct substring match (best)
  for (const h of hints || []) {
    const hh = String(h || "").toLowerCase().trim();
    if (hh && t.includes(hh)) return true;
  }

  // 2) keyword match (fallback): need >=2 meaningful words from same hint
  for (const h of hints || []) {
    const words = String(h || "")
      .toLowerCase()
      .split(/[^a-z0-9]+/g)
      .filter(w => w.length >= 6); // stricter

    let hits = 0;
    for (const w of words) if (t.includes(w)) hits++;
    if (hits >= 2) return true;
  }

  return false;
}


  function hardDegen(s: string) {
  let t = String(s || "")
    .replace(/\bYou might\b/gi, "Today you")
    .replace(/\bYou may\b/gi, "Today you")
    .replace(/\bExpect\b/gi, "Plan for")
    .replace(/\bBe prepared\b/gi, "Stay ready");
 
  // remove double "Today"
  t = t.replace(/Today you\s+Today you/gi, "Today you");
 t = t.replace(/\bmentor\b/gi, "experienced person");

  // remove mentor coaching fluff
  t = t.replace(/mentor support/gi, "guidance");
  t = t.replace(/seek advice from mentors/gi, "get clarity before acting");

  return t.trim();
}

function softenClaims(s: string) {
  return String(s || "")
    // swap certainty words
    .replace(/\bLikely today:\b/gi, "More likely today:")
    .replace(/\bPlan for\b/gi, "Watch for")
    .replace(/\bwill\b/gi, "can")
    .replace(/\bthat could shift your direction\b/gi, "that may change the next step")
    .replace(/\bToday you feel\b/gi, "There’s a pull toward")
    .replace(/\bToday you feel pressure\b/gi, "Pressure can show up")

    // remove “movie scenes” tone
    .replace(/\bA decision lands on your plate\b/gi, "a decision point comes up")
    .replace(/\bA senior pushes back\b/gi, "pushback or extra scrutiny (if approvals/authority are involved)")
    .replace(/\bAn important call\b/gi, "a call/message that clarifies something")
    .trim();
}
function humanizeHint(h: string) {
  return String(h || "").replace(/\s+/g, " ").trim();
}


function rewriteLikelyBlock(text: string, hintsUsed: string[]) {
  const lines = String(text || "").split("\n");
  const out: string[] = [];
  let inLikely = false;

  for (const line of lines) {
    if (/more likely today:/i.test(line)) {
      inLikely = true;
      // If "More likely today:" is on the same line as other text, keep the part before it.
const before = line.split(/more likely today:/i)[0].trim();
if (before) out.push(before);
      out.push("More likely today:");
      // replace the next bullets completely with humanized hint bullets
      const bullets = (hintsUsed || []).slice(0, 3).map(h => `- ${humanizeHint(h)}`).filter(b => b.trim() !== "-");
      out.push(...bullets);
      continue;
    }

    // skip original bullets under "More likely today"
    if (inLikely) {
      if (/^\s*-\s+/.test(line)) continue;          // skip bullets
      if (line.trim() === "") continue;              // skip empty
      inLikely = false;                              // stop skipping once we hit next section
    }

    out.push(line);
  }

  return out.join("\n").trim();
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
  "More likely today:\n" +
  areaScenarios.slice(0, 2).join("\n");

    if (!text || text.length < 40) {
      return `${base}\n\n${scenarioBlock}`;
    }

    if (/(Likely today:|More likely today:)/i.test(text)) return text;


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
  "You are Sārathi — calm, direct, practical. Not a life coach. Not motivational. Not generic.",
  "",
  "You generate DAILY guidance from PROVIDED inputs only.",
  "",
  "NON-NEGOTIABLE TRUTH RULE:",
  "- You cannot know real events with certainty. Do NOT predict exact outcomes.",
  "- You must speak in patterns and probabilities, not promises.",
  "",
  "CRITICAL CONSTRAINTS:",
  "- Use ONLY the provided eventHints for the day. Do NOT invent new scenarios.",
  "- Pick EXACTLY 2 or 3 eventHints per day and list them verbatim in eventHintsUsed.",
  "- In the text, phrase them as 'More likely today:' / 'Watch for:' / 'If X is involved…'",
  "- Never use certainty words: 'will', 'definitely', 'guaranteed', 'for sure', 'an important call will…'",
  "- Avoid vague filler: 'you may feel inclined', 'it’s a good time', 'consider'.",
  "- No astrology jargon. No repeating facts verbatim.",
  "- Bold but NOT fearful.",
  "- Steering line must be DIFFERENT each day (no copy/paste).",
  "",
  "TEXT STRUCTURE (STRICT, exactly this order):",
  "1) Internal state (1 short line, neutral/observational)",
  "2) More likely today:",
  "   - bullet (must match chosen eventHint)",
  "   - bullet (must match chosen eventHint)",
  "   - bullet (optional, must match chosen eventHint)",
  "3) Steering (1–2 lines, actionable, grounded)",
  "",
  "OUTPUT FORMAT (STRICT JSON):",
  "{ days: [ { dateISO, headline, mood, moodText, area, eventHintsUsed, text, do, avoid, microAction, confidence } ] }",
  "",
  "eventHintsUsed MUST be an array of 2–3 strings copied from that day's eventHints input.",
  "",
  "Return JSON only."
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

  "For each day return keys: dateISO, headline (3–6 words), mood (one word), moodText (1 line), area (one of allowed), " +
  "eventHintsUsed (array of EXACTLY 2 or 3 strings, copied verbatim from eventHints input for that day), " +
  "text (4–6 lines), do (3 short bullets), avoid (3 short bullets), microAction (1 line), confidence. " +

  "ABSOLUTE RULES: " +
  "- No certainty language: avoid 'will', 'definitely', 'guaranteed'. Use 'More likely', 'Watch for', 'If X is involved…'. " +
  "- Do NOT invent scenarios beyond eventHints. If eventHints is empty, write generic-but-grounded patterns without specifics. " +
  "- text MUST follow structure: (1) internal state line, (2) 'More likely today:' + 2–3 bullets, (3) steering 1–2 lines. " +

  "Use focusHint as the primary anchor. Do NOT drift into other areas. " +
  "If focusHint is not 'work', avoid office language like management/colleagues/meetings. " +

  "Keep it bold but not alarming. No astrology jargon. Return ONLY valid JSON.",

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
        do: ["...", "...", "..."],
        avoid: ["...", "...", "..."],
        microAction: "string",
        confidence: "high|medium|low",
        eventHintsUsed: ["string", "string"]
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

    // 1) Try a simple salvage: cut to last closing brace
    const cut = (() => {
      const last = raw.lastIndexOf("}");
      if (last > 0) return raw.slice(0, last + 1);
      return raw;
    })();

    try {
      parsed = JSON.parse(cut);
      console.warn("[ai-daily-highlights] JSON salvage succeeded (truncated).");
    } catch (e2: any) {
      console.error("[ai-daily-highlights] JSON salvage failed:", e2?.message);

      // 2) Final fallback: return empty days (client will use deterministic fallback)
      return new Response(
    JSON.stringify({ days: [], _error: "invalid_json", rawPreview: raw.slice(0, 400) }),
    { status: 200, headers: { "content-type": "application/json" } }
  );
    }
  }


    const out: DayOutput[] = safeObjArr(parsed?.days).map((d: any) => ({
    dateISO: safeStr(d?.dateISO),
    headline: clampWords(d?.headline, 6),
    area: safeStr(d?.area || "Work & direction"),
    text: safeStr(d?.text),
    do: safeStrArr(d?.do).slice(0, 3),
    avoid: safeStrArr(d?.avoid).slice(0, 3),
    microAction: safeStr(d?.microAction),
    confidence:
      d?.confidence === "high" || d?.confidence === "medium" || d?.confidence === "low"
        ? d.confidence
        : "medium",
   eventHintsUsed: safeStrArr(d?.eventHintsUsed).slice(0, 3),
  }));
  for (let i = 0; i < out.length; i++) {
  if (!Array.isArray(out[i].do) || out[i].do.length < 3) {
    out[i].do = (out[i].do || [])
      .concat(["One clear follow-up", "One focused block", "One clean close"])
      .slice(0, 3);
  }

  if (!Array.isArray(out[i].avoid) || out[i].avoid.length < 3) {
    out[i].avoid = (out[i].avoid || [])
      .concat(["Over-explaining", "Multi-tasking", "Rushing decisions"])
      .slice(0, 3);
  }
}
  // Enforce confidence from inputs (model tends to overuse "high")
  for (let i = 0; i < out.length && i < days.length; i++) {
    const c = days[i]?.confidence;
    if (c === "low" || c === "medium" || c === "high") out[i].confidence = c;
  }
// ✅ Ensure do/avoid are ALWAYS 3 items (so UI doesn't fall back)
for (let i = 0; i < out.length; i++) {
  if (!Array.isArray(out[i].do) || out[i].do.length < 3) {
    out[i].do = (out[i].do || []).concat(["One clear follow-up", "One focused block", "One clean close"]).slice(0, 3);
  }
  if (!Array.isArray(out[i].avoid) || out[i].avoid.length < 3) {
    out[i].avoid = (out[i].avoid || []).concat(["Over-explaining", "Multi-tasking", "Rushing decisions"]).slice(0, 3);
  }
}

  // If model returns fewer days than requested, pad with deterministic placeholders
  if (out.length < days.length) {
    const missing = days.slice(out.length);
    for (let i = 0; i < missing.length; i++) {
      const di = missing[i];
      const baseHints = safeStrArr(di?.eventHints).slice(0, 3);
const usedHints = baseHints.length ? baseHints.slice(0, Math.min(3, baseHints.length)) : [];

const area =
  di?.focusHint === "money" ? "Money & decisions" :
  di?.focusHint === "relationships" ? "Relationships" :
  di?.focusHint === "home" ? "Home & family" :
  di?.focusHint === "health" ? "Health & energy" :
  di?.focusHint === "mind" ? "Mind & emotions" :
  di?.focusHint === "purpose" ? "Purpose & learning" :
  di?.focusHint === "creativity" ? "Creativity & confidence" :
  "Work & direction";

const likelyBullets = usedHints.length
  ? usedHints.map(h => `- ${humanizeHint(h)}`).join("\n")
  : "- one pending follow-up becomes important\n- a small decision point comes up";

const fallbackText =
  `Internal state: steady, practical focus.\n` +
  `More likely today:\n${likelyBullets}\n\n` +
  `Steering: pick one outcome, ask one clear question, and close one loop before starting anything new.`;

out.push({
  dateISO: String(di?.dateISO || ""),
  headline: `${area}: Day ${out.length + 1}`.slice(0, 32),
  area,
  text: fallbackText,
  do: ["Close one pending task", "Send one precise follow-up", "Work in one focused block"],
  avoid: ["Starting multiple new threads", "Over-explaining", "Late caffeine"],
  microAction: "Write the single outcome you want today, then do 25 minutes on it.",
  confidence:
    di?.confidence === "high" || di?.confidence === "medium" || di?.confidence === "low"
      ? di.confidence
      : "medium",
  eventHintsUsed: usedHints,
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
    } else if (!/(Likely today:|More likely today:)/i.test(t)) {
  const hintsUsedLocal = out[i]?.eventHintsUsed || [];
  if (hintsUsedLocal.length === 0) {
    const inject = [
      ["- A message forces a clarification", "- A decision point comes up"],
      ["- A small delay tests patience", "- Someone reacts strongly to tone"],
      ["- A money/spend choice appears", "- A plan changes last minute"],
      ["- A family/home request interrupts flow", "- A follow-up becomes urgent"],
      ["- A paperwork/detail needs correction", "- A meeting/call shifts direction"],
      ["- A health/routine disruption appears", "- A task takes longer than expected"],
      ["- A networking lead surfaces", "- A conversation reveals hidden info"],
    ];
    const pair = inject[i % inject.length];
    out[i].text = `More likely today:\n${pair[0]}\n${pair[1]}\n\n${t}`;
  }
}
  }

  for (let i = 0; i < out.length; i++) {
    out[i].text = enrichTextPerDay(out[i].text, i, out[i].area);
    out[i].text = hardDegen(out[i].text);
    out[i].text = softenClaims(out[i].text);
    const hintsUsed = out[i]?.eventHintsUsed || [];
if (hintsUsed.length) {
  out[i].text = rewriteLikelyBlock(out[i].text, hintsUsed);
}
const hintsRaw = days[i]?.eventHints || [];
const hintsHuman = hintsRaw.map(humanizeHint);
const used =
  validateHintsUsed(out[i].text, hintsRaw) ||
  validateHintsUsed(out[i].text, hintsHuman);
if (out[i].confidence === "high" && !used) out[i].confidence = "medium";

    // remove emotional coaching filler
out[i].text = out[i].text
  .replace(/you feel .*? today/gi, "")
  .replace(/today you encounter .*? today/gi, "")
  .replace(/balance is key/gi, "")
  .replace(/stay open to learning/gi, "")
  .replace(/\s{2,}/g, " ")
  .trim();

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
