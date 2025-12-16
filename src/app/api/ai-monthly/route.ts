// FILE: src/app/api/ai-monthly/route.ts
export const runtime = "nodejs";

import "server-only";
import { NextResponse } from "next/server";

type TransitCategory = "career" | "relationships" | "health" | "inner" | "general";

type IncomingTransit = {
  startISO?: string;
  endISO?: string;
  planet?: string;
  target?: string;
  category?: TransitCategory;
  strength?: number;
  title?: string;
};

type Profile = {
  name?: string;
  birthDateISO?: string;
  birthTime?: string;
  birthTz?: string;
};

type ReqBody = {
  profile?: Profile;
  transits?: IncomingTransit[];
  startMonthISO?: string; // optional, YYYY-MM-DD
  months?: number;        // how many months to build
};

/* ---------- small date helpers ---------- */

function parseISODate(d?: string | null): Date | null {
  if (!d) return null;
  const t = Date.parse(d);
  if (Number.isNaN(t)) return null;
  return new Date(t);
}

function addMonths(d: Date, n: number): Date {
  const nd = new Date(d.getTime());
  nd.setMonth(nd.getMonth() + n);
  return nd;
}

function fmtMonthLabel(d: Date): string {
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

/* ---------- scoring helpers ---------- */

function overlapsMonth(t: IncomingTransit, mStart: Date, mEnd: Date) {
  const ts = parseISODate(t.startISO);
  const te = parseISODate(t.endISO);
  if (!ts || !te) return false;
  return ts <= mEnd && te >= mStart;
}

function categoryScore(
  transits: IncomingTransit[],
  cat: TransitCategory,
  mStart: Date,
  mEnd: Date
): number {
  let s = 0;
  for (const t of transits) {
    if (!overlapsMonth(t, mStart, mEnd)) continue;
    const c = (t.category as TransitCategory) || "general";
    if (c !== cat) continue;
    const strength = typeof t.strength === "number" ? t.strength : 0.5;
    s += Math.max(0, strength);
  }
  return s;
}

function buildMonthText(
  label: string,
  cat: TransitCategory,
  profile: Profile | undefined
): string {
  const name = (profile?.name || "you").trim() || "you";

  switch (cat) {
    case "career":
      return [
        `**${label} – Career & Work highlighted**`,
        `This month nudges ${name} to focus more on projects, responsibility and long-term direction.`,
        `Use it to move one important work or money decision forward, but avoid burning out by trying to fix everything at once.`,
      ].join("\n");
    case "relationships":
      return [
        `**${label} – Relationships & Family in focus**`,
        `Conversations, family dynamics or partnership themes may feel louder now.`,
        `Treat this month as a chance to repair, deepen or clarify one key bond instead of winning every argument.`,
      ].join("\n");
    case "health":
      return [
        `**${label} – Health & routines calling for attention**`,
        `Your body and energy levels may give clearer feedback this month.`,
        `Small consistent shifts in sleep, food or movement will go much further than dramatic short bursts.`,
      ].join("\n");
    case "inner":
      return [
        `**${label} – Inner work & mindset**`,
        `This month pulls ${name} inward: reflection, values, and subtle emotional themes become more obvious.`,
        `Make time for quiet practices—journaling, prayer, meditation, or honest self-check-ins.`,
      ].join("\n");
    case "general":
    default:
      return [
        `**${label} – Mixed focus, steady rhythm**`,
        `No single area dominates, which is actually a gift.`,
        `Use the relative balance to tidy loose ends, organise your priorities and prepare for the stronger months ahead.`,
      ].join("\n");
  }
}

/* ---------- route ---------- */

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as ReqBody;
    const profile = body.profile ?? {};
    const transits: IncomingTransit[] = Array.isArray(body.transits)
      ? body.transits
      : [];

    const monthsRequested = Number(body.months ?? 6);
    const count = Math.max(1, Math.min(monthsRequested, 12)); // 1–12

    const startBase =
      parseISODate(body.startMonthISO || null) ||
      new Date();
    // normalise to 1st of month
    const startMonth = new Date(
      startBase.getFullYear(),
      startBase.getMonth(),
      1
    );

    const months: Array<{ label: string; text: string }> = [];

    for (let i = 0; i < count; i++) {
      const mStart = addMonths(startMonth, i);
      const mEnd = addMonths(startMonth, i + 1);

      const cats: TransitCategory[] = [
        "career",
        "relationships",
        "health",
        "inner",
        "general",
      ];

      let bestCat: TransitCategory = "general";
      let bestScore = -1;

      for (const c of cats) {
        const s = categoryScore(transits, c, mStart, mEnd);
        if (s > bestScore) {
          bestScore = s;
          bestCat = c;
        }
      }

      const label = fmtMonthLabel(mStart);
      const text = buildMonthText(label, bestCat, profile);
      months.push({ label, text });
    }

    // Return both keys so shell is happy no matter what it expects.
    return NextResponse.json(
      {
        months,
        monthlyInsights: months,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("[api/ai-monthly] error", e);
    // Safe fallback
    const now = new Date();
    const label = fmtMonthLabel(now);

    const text = [
      `**${label} – Steady month**`,
      `This month invites you to make small, practical improvements in work, relationships and daily routine, without rushing big decisions.`,
      `Focus on one habit you can stabilise rather than chasing many changes at once.`,
    ].join("\n");

    const months = [{ label, text }];

    return NextResponse.json(
      { months, monthlyInsights: months },
      { status: 200 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: true, endpoint: "/api/ai-monthly" },
    { status: 200 }
  );
}
