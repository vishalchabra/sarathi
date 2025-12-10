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
        `Theme: Career, work and responsibilities gently take the spotlight this week.`,
        `Rhythm: You may feel more drawn to targets, deadlines or practical tasks, with a quiet urge to move something important forward.`,
        `Action: Pick one meaningful work or study goal and give it steady attention. Protect your time from distractions instead of trying to do everything at once.`,
      ].join("\n");

    case "relationships":
      return [
        `${label}`,
        `Theme: Relationships, family and emotional bonds become more noticeable.`,
        `Rhythm: Conversations, shared plans or small misunderstandings may ask for a bit more presence and patience from you now.`,
        `Action: Choose one person who matters and initiate a sincere check-in. Listen fully, speak honestly, and let the tone stay soft rather than defensive.`,
      ].join("\n");

    case "health":
      return [
        `${label}`,
        `Theme: Body, energy and day-to-day routines ask for recalibration.`,
        `Rhythm: You might become more aware of how sleep, food and stress are affecting your mood and focus.`,
        `Action: Make one small but clear adjustment—sleep 30 minutes earlier, clean up one meal, or schedule a short walk. Treat it as an investment, not a punishment.`,
      ].join("\n");

    case "inner":
      return [
        `${label}`,
        `Theme: Inner processing, reflection and emotional integration are highlighted.`,
        `Rhythm: Life may feel a bit quieter on the surface but deeper questions or feelings can come up underneath.`,
        `Action: Give yourself pockets of silence—journaling, prayer, or a slow walk without your phone. Let insights appear instead of forcing decisions immediately.`,
      ].join("\n");

    case "general":
    default:
      return [
        `${label}`,
        `Theme: A balanced, mixed week with no single area dominating strongly.`,
        `Rhythm: Everyday life may feel steady, giving you room to tidy up loose ends and organise priorities.`,
        `Action: Use this breathing space to clear small pending tasks, review your bigger direction, and set one simple intention for the next week.`,
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
