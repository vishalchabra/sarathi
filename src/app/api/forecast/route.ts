// src/app/api/forecast/route.ts
export const runtime = "nodejs";

import "server-only";
import { NextResponse } from "next/server";

/** ---------- Types that match the UI ---------- */
type DaySlice = "today" | "tomorrow" | "weekly" | "monthly";
type ForecastItem = { bucket: "Wealth" | "Health" | "Family" | "Job"; text: string };
type ForecastResponse = { rangeLabel: string; items: ForecastItem[] };

/** ---------- Helpers ---------- */
function fmtRange(from: Date, to?: Date) {
  const f = from.toLocaleDateString();
  if (!to) return f;
  const t = to.toLocaleDateString();
  return `${f} — ${t}`;
}
function startOfDay(d = new Date()) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }

function textWithContext(opts: {
  bucket: ForecastItem["bucket"],
  nakshatra?: string | null,
  maha?: string | null,
  antar?: string | null,
  slice: DaySlice,
}): ForecastItem {
  const { bucket, nakshatra, maha, antar, slice } = opts;

  // Tiny templates influenced by context
  const dashaLine = [maha, antar].filter(Boolean).join(" ⟂ ");
  const nk = nakshatra ? ` (Moon in ${nakshatra})` : "";

  const base: Record<ForecastItem["bucket"], string[]> = {
    Wealth: [
      `Prefer asymmetric, capped-downside bets${nk}.`,
      `Audit small leaks; ${dashaLine ? `dasha: ${dashaLine}.` : "avoid impulsive spends."}`,
      `Network tilt > pushy asks; tie claims to measurable impact.`,
    ],
    Health: [
      `Consistency > intensity${nk}; hydrate and keep mobility 10–15m.`,
      `Early, light dinner supports sleep${dashaLine ? ` in ${dashaLine}.` : "."}`,
      `Gentle routine stabilises energy; avoid over-stimulation.`,
    ],
    Family: [
      `Lead with listening${nk}; a small shared ritual strengthens bonds.`,
      `De-escalate fast; clarify intent before advice.`,
      `Warmth + patience turn mixed signals into alignment.`,
    ],
    Job: [
      `Ship one visible increment; document impact in 3 bullets.`,
      `Use a warm intro; ${dashaLine ? `sync with ${dashaLine} priorities.` : "ask for context first."}`,
      `Batch admin during low-energy band; protect deep-work window.`,
    ],
  };

  // Slice-specific emphasis
  if (slice === "today" || slice === "tomorrow") {
    return { bucket, text: base[bucket][0] };
  }
  if (slice === "weekly") {
    return { bucket, text: base[bucket][1] };
  }
  // monthly
  return { bucket, text: base[bucket][2] };
}

/** ---------- Route ---------- */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slice: DaySlice = body?.slice || "today";
    const report = body?.report ?? null;

    const today = startOfDay();
    let rangeLabel: string;
    if (slice === "today") rangeLabel = fmtRange(today);
    else if (slice === "tomorrow") rangeLabel = fmtRange(addDays(today, 1));
    else if (slice === "weekly") rangeLabel = fmtRange(today, addDays(today, 6));
    else {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      rangeLabel = fmtRange(start, end);
    }

    const nakshatra: string | null =
      report?.ascendant?.panchang?.moonNakshatraName ??
      report?.ascendant?.moonNakshatraName ??
      null;

    const maha: string | null = report?.activePeriods?.mahadasha?.lord ?? null;
    const antar: string | null = report?.activePeriods?.antardasha?.subLord ?? null;

    const buckets: ForecastItem["bucket"][] = ["Wealth", "Health", "Family", "Job"];
    const items: ForecastItem[] = buckets.map((bucket) =>
      textWithContext({ bucket, nakshatra, maha, antar, slice })
    );

    const payload: ForecastResponse = { rangeLabel, items };
    return NextResponse.json(payload, { status: 200 });
  } catch (err: any) {
    return new NextResponse(
      JSON.stringify({
        error: "forecast_error",
        message: typeof err?.message === "string" ? err.message : "Failed to build forecast",
      }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}

export async function GET() {
  const today = startOfDay();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return NextResponse.json({ ok: true, sampleMonthlyRange: fmtRange(start, end) }, { status: 200 });
}
