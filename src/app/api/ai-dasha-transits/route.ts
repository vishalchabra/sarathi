// FILE: src/app/api/ai-dasha-transits/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type TransitCategory = "career" | "relationships" | "health" | "inner" | "general";

type IncomingTransit = {
  id?: string;
  startISO?: string;
  endISO?: string;
  planet?: string;
  target?: string;
  category?: TransitCategory;
  strength?: number;
  title?: string;
  description?: string;
};

function safeLayerLabel(layer: any | null | undefined, fallback: string) {
  if (!layer) return fallback;
  const lord =
    layer.lord ??
    layer.planet ??
    layer.name ??
    layer.lordName ??
    layer.mdLord ??
    "";
  const start = layer.startISO ?? layer.start ?? "";
  const end = layer.endISO ?? layer.end ?? "";
  const core = lord ? String(lord) : fallback;
  if (start && end) return `${core} (${start} → ${end})`;
  return core;
}

function summariseCategories(transits: IncomingTransit[]) {
  const sums: Record<TransitCategory, number> = {
    career: 0,
    relationships: 0,
    health: 0,
    inner: 0,
    general: 0,
  };

  for (const t of transits) {
    const cat: TransitCategory = (t.category as TransitCategory) || "general";
    const s = typeof t.strength === "number" ? t.strength : 0.5;
    sums[cat] += Math.max(0, s);
  }

  const total = Object.values(sums).reduce((a, b) => a + b, 0) || 1;

  const lines: string[] = [];
  (Object.keys(sums) as TransitCategory[])
    .sort((a, b) => sums[b] - sums[a])
    .forEach((cat) => {
      const pct = Math.round((sums[cat] / total) * 100);
      if (sums[cat] > 0) {
        lines.push(`${cat}: ~${pct}% of the overall focus this year`);
      }
    });

  return { sums, lines };
}

function summariseStrongWindows(transits: IncomingTransit[]) {
  const sorted = [...transits].sort(
    (a, b) => (b.strength ?? 0) - (a.strength ?? 0)
  );

  const usedCats = new Set<string>();
  const picked: IncomingTransit[] = [];

  for (const t of sorted) {
    if (!t.startISO || !t.endISO || !t.category) continue;
    if (picked.length >= 6) break;
    const key = `${t.category}-${t.planet ?? ""}`;
    if (usedCats.has(key)) continue;
    usedCats.add(key);
    picked.push(t);
  }

  const lines: string[] = picked.map((t, idx) => {
    const label = t.title || `${t.planet ?? "Planet"} transit`;
    const cat = t.category;
    const target = t.target ? `, ${t.target}` : "";
    return `${idx + 1}. ${t.startISO} → ${t.endISO} — [${cat}] ${label}${target}`;
  });

  return { picked, lines };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));

    const profile = body?.profile ?? {};
    const dashaLayers = body?.dashaLayers ?? {};
    const transits: IncomingTransit[] = Array.isArray(body?.transits)
      ? body.transits
      : [];
    const lifeMilestones: any[] = Array.isArray(body?.lifeMilestones)
      ? body.lifeMilestones
      : [];

    const name = profile?.name || "the native";

    const mdLabel = safeLayerLabel(dashaLayers.md, "Mahadasha");
    const adLabel = safeLayerLabel(dashaLayers.ad, "Antardasha");
    const pdLabel = safeLayerLabel(dashaLayers.pd, "Pratyantardasha");

    const { lines: catLines } = summariseCategories(transits);
    const { lines: winLines } = summariseStrongWindows(transits);

    const milestoneLines =
      lifeMilestones && lifeMilestones.length
        ? lifeMilestones
            .slice(0, 8)
            .map((m: any) => {
              const label = m.label ?? m.planet ?? m.lord ?? "Period";
              const ps = m.periodStart ?? m.startISO ?? "";
              const pe = m.periodEnd ?? m.endISO ?? "";
              const approx = m.approxAgeRange ? `, ~${m.approxAgeRange}` : "";
              const themes = Array.isArray(m.themes)
                ? ` — ${m.themes.join("; ")}`
                : "";
              return `${label} (${ps} → ${pe}${approx})${themes}`;
            })
        : [];

    const systemPrompt = `
You are an experienced, practical Vedic astrologer writing for one person.

You have:
- Their current Vimshottari Mahadasha stack (MD / AD / PD),
- A list of upcoming transit windows (with dates, planet, category and short descriptions),
- A coarse list of life milestones per Mahadasha (high-level themes only).

Your job:
- Blend the dasha stack + transits into a single, emotionally believable “year ahead” narrative.
- Write in warm, grounded, non-fatalistic language.
- Speak directly to the person as “you”.
- Give concrete, life-like examples (e.g., work changes, study shifts, family responsibilities, emotional phases), but always as possibilities, never guarantees.
- Avoid doom, fear, or talk of death, accidents, or serious illness.
- Always emphasise free will, learning, and conscious choices.
    `.trim();

    const userPrompt = `
Write a clear, human narration called: "Dasha × Transits — Year Ahead Insight" for ${name}.

Context you have:

Profile:
- Name: ${profile?.name ?? "the native"}
- Birth: ${profile?.birthDateISO ?? "N/A"} ${profile?.birthTime ?? ""} (${profile?.birthTz ?? "tz"})

Active Vimshottari stack:
- Mahadasha: ${mdLabel}
- Antardasha: ${adLabel}
- Pratyantardasha: ${pdLabel}

Category emphasis from transit windows:
${catLines.length ? catLines.join("\n") : "- (no strong transit categories detected)"}

Strongest upcoming transit windows:
${winLines.length ? winLines.join("\n") : "- (no strong individual windows detected)"}

Life milestones by dasha (high-level, optional hints):
${milestoneLines.length ? milestoneLines.join("\n") : "- (no explicit milestones provided)"}

Now write 5–8 short paragraphs that:

1) Start with a 2–3 sentence overview of what this period is really about for them.
   - Make it specific: e.g. "balancing heavy responsibility at work with the need for emotional rest", "re-thinking why you work the way you do", "healing patterns in close relationships", etc.
   - Avoid vague openings like "you are moving through a phase where..." or "this period invites you to...".
   - Do NOT mention "category scores" or anything technical.

2) Then, in separate paragraphs, connect the main transit windows to possible real-life experiences.
   - Use the dates as anchors (e.g., "Between March and June...", "Around the middle of the year...").
   - For career-related windows, give 2–3 believable possibilities: role changes, heavier workload, questions about direction, learning something new, visibility, or slow but steady progress.
   - For relationship-related windows, talk about communication, misunderstandings, coming closer, setting boundaries, or feeling both the need for connection and space.
   - For health/inner windows, talk about routines, rest, emotional processing, inner questions, spiritual curiosity, or burnout risk — but keep it gentle and non-scary.

3) Refer to likely periods of:
   - Tension or pressure (e.g. deadlines, family responsibilities, fatigue) — but frame them as chances to mature, not punishment.
   - Relief or support (e.g. helpful people, clarity, smoother communication, better alignment at work).

4) Include 1 short paragraph that sounds almost like remembering the past:
   - Example: "Looking back at the last few years of this Mahadasha, you may notice that certain patterns keep repeating — such as sudden shifts in work, or having to grow faster emotionally than you expected."
   - This paragraph should help the person feel "seen" when they think about what actually happened in recent years of the current Mahadasha.

5) End with 4–6 bullet points of simple, practical focus areas for the next 12 months.
   - Mix career, relationships, health, and inner work.
   - Each bullet should be concrete and behavioural (e.g. "Commit to one sustainable health habit", "Schedule regular check-ins with one key relationship", "Say 'no' a little more often when work starts to feel overwhelming").

Style rules:
- Use simple, everyday language that a non-astrologer can understand.
- Do NOT explain technical astrology terms (no need to mention "conjunction", "trine", etc.).
- Do NOT mention that you are an AI or that this is a prediction; speak as an astrologer offering guidance.
- Avoid generic filler like "this period invites you..." or "you are moving through a phase where...". Be more direct and specific instead.
- Stay within 900–1100 words.
    `.trim();

    const chat = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 900,
      temperature: 0.7,
    });

    const text = chat.choices[0]?.message?.content?.trim() || "";
    return NextResponse.json({ text });
  } catch (e) {
    console.error("[ai-dasha-transits] error", e);
    return NextResponse.json(
      { error: "Failed to build Dasha × Transits narration" },
      { status: 500 }
    );
  }
}
