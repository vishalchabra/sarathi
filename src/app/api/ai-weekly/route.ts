// FILE: src/app/api/ai-weekly/route.ts
export const runtime = "nodejs";

import "server-only";
import { NextResponse } from "next/server";

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

type WeeklyInsight = {
  label: string;
  text: string;
};

/* -------------------- small date helpers -------------------- */

function parseISODate(d: string | undefined): Date | null {
  if (!d) return null;
  const t = Date.parse(d);
  if (Number.isNaN(t)) return null;
  return new Date(t);
}

function fmtISO(d: Date): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function addDays(d: Date, days: number): Date {
  const nd = new Date(d.getTime());
  nd.setDate(nd.getDate() + days);
  return nd;
}

/* Does this transit overlap with [weekStart, weekEnd]? */
function overlapsWeek(t: IncomingTransit, weekStart: Date, weekEnd: Date): boolean {
  const ts = parseISODate(t.startISO);
  const te = parseISODate(t.endISO);
  if (!ts || !te) return false;
  return ts <= weekEnd && te >= weekStart;
}

/* Choose the dominant category for a week based on overlapping transits */
function primaryCategoryForWeek(
  transits: IncomingTransit[],
  weekStart: Date,
  weekEnd: Date
): TransitCategory {
  const sums: Record<TransitCategory, number> = {
    career: 0,
    relationships: 0,
    health: 0,
    inner: 0,
    general: 0,
  };

  for (const t of transits) {
    if (!overlapsWeek(t, weekStart, weekEnd)) continue;
    const cat: TransitCategory = (t.category as TransitCategory) || "general";
    const s = typeof t.strength === "number" ? t.strength : 0.5;
    sums[cat] += Math.max(0, s);
  }

  // If nothing hits this week, default to "general"
  let best: TransitCategory = "general";
  let bestVal = -1;
  (Object.keys(sums) as TransitCategory[]).forEach((cat) => {
    if (sums[cat] > bestVal) {
      bestVal = sums[cat];
      best = cat;
    }
  });

  return best;
}

/* Build a human-friendly text for the week based on main category */
function buildWeekText(label: string, mainCat: TransitCategory): string {
  switch (mainCat) {
    case "career":
      return [
        `${label}`,
        `Theme: Career growth and responsibility take the lead this week.`,
        `Rhythm: You may feel more focused on work, goals, or practical tasks, with a desire to make visible progress.`,
        `Action: Choose one important work or study goal and move it forward with steady, realistic steps. Avoid overloading yourself; consistency matters more than speed.`,
      ].join("\n");
    case "relationships":
      return [
        `${label}`,
        `Theme: Relationships and emotional connections are in focus.`,
        `Rhythm: Conversations, family matters, or partnership themes may feel more active or important now.`,
        `Action: Make time for one meaningful check-in with someone you care about. Listen with patience and be honest about what you need too.`,
      ].join("\n");
    case "health":
      return [
        `${label}`,
        `Theme: Health, routines, and daily habits ask for attention.`,
        `Rhythm: You may notice your energy levels or stress more clearly, pushing you to adjust your lifestyle.`,
        `Action: Simplify your schedule where possible. Prioritise rest, movement, and simple food choices that support your body.`,
      ].join("\n");
    case "inner":
      return [
        `${label}`,
        `Theme: Inner growth, reflection, and emotional processing are highlighted.`,
        `Rhythm: This week may feel more introspective, with a desire to understand your deeper motives and feelings.`,
        `Action: Create small pockets of silence for journaling, prayer, or meditation. Let yourself feel what you feel without forcing quick answers.`,
      ].join("\n");
    case "general":
    default:
      return [
        `${label}`,
        `Theme: A balanced week with no single area dominating strongly.`,
        `Rhythm: Life may feel relatively steady, giving you space to handle everyday matters and small improvements.`,
        `Action: Use this gentle rhythm to organise your priorities, clear minor pending tasks, and check in with your overall direction.`,
      ].join("\n");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));

    const transits: IncomingTransit[] = Array.isArray(body?.transits)
      ? body.transits
      : [];

    const startDateISO: string =
      typeof body?.startDateISO === "string" && body.startDateISO
        ? body.startDateISO
        : new Date().toISOString().slice(0, 10);

    const weeksRequested: number = Number(body?.weeks ?? 8);
    const weeks = Math.max(1, Math.min(weeksRequested, 12)); // 1–12

    const startDate = parseISODate(startDateISO) || new Date();

    const weeklyInsights: WeeklyInsight[] = [];

    for (let i = 0; i < weeks; i++) {
      const weekStart = addDays(startDate, i * 7);
      const weekEnd = addDays(weekStart, 7);

      const label = `Week of ${fmtISO(weekStart)} – ${fmtISO(weekEnd)}`;
      const mainCat = primaryCategoryForWeek(transits, weekStart, weekEnd);
      const text = buildWeekText(label, mainCat);

      weeklyInsights.push({ label, text });
    }

    return NextResponse.json({ weeklyInsights });
  } catch (e) {
    console.error("[ai-weekly] error", e);
    return NextResponse.json(
      { error: "Failed to build weekly insights" },
      { status: 500 },
    );
  }
}
