// FILE: src/server/timing/engine.ts
"use server";

export type TimingResult = {
  ok: boolean;
  source?: "engine";
  bottomLine?: { lead: string; nuance?: string };
  windows?: Array<{
    fromISO?: string;
    toISO?: string;
    tag: string;
    why: string[];
    do: string[];
    score?: number;
  }>;
  guidance?: string[];
  checklist?: string[];
  natal?: string;
  context?: string;
  error?: string;
  [k: string]: any;
};

type Profile = {
  name?: string;
  birth?: { dateISO: string; time: string; tz: string; lat: number; lon: number };
  place?: { name: string; tz: string; lat: number; lon: number };
};

type DashaSpan = { fromISO: string; toISO: string; label: string; note?: string };

/* dates */
const isValidDate = (d: any): d is Date => d instanceof Date && Number.isFinite(+d);
const safeDate = (x?: string | Date | null) => {
  if (!x) return null;
  const d = x instanceof Date ? x : new Date(x as any);
  return isValidDate(d) ? d : null;
};
const safeISO = (x?: string | Date | null): string | undefined => {
  const d = safeDate(x); return d ? d.toISOString().slice(0,10) : undefined;
};
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);
const clampToHorizon = (start: Date, end: Date, horizonEnd: Date) => {
  const now = new Date(); const s = start < now ? now : start; const e = end > horizonEnd ? horizonEnd : end;
  return s <= e ? { s, e } : null;
};

/* span → windows */
function spansWithinHorizon(spans: DashaSpan[] = [], horizonDays: number) {
  const now = new Date(); const horizonEnd = addDays(now, horizonDays);
  return spans
    .map((sp) => {
      const s = safeDate(sp.fromISO); const e = safeDate(sp.toISO);
      if (!s || !e) return null;
      const clamped = clampToHorizon(s, e, horizonEnd);
      return clamped ? { ...sp, s: clamped.s, e: clamped.e } : null;
    })
    .filter(Boolean) as Array<DashaSpan & { s: Date; e: Date }>;
}

function windowsForMarriage(spans: Array<DashaSpan & { s: Date; e: Date }>) {
  const out: NonNullable<TimingResult["windows"]> = [];
  for (const sp of spans) {
    const days = Math.max(1, Math.round((+sp.e - +sp.s) / 86400000));
    const score = Math.max(0.4, Math.min(0.95, days / 365));
    out.push({
      fromISO: safeISO(sp.s), toISO: safeISO(sp.e),
      tag: days >= 90 ? "engage + register" : days >= 45 ? "align + meet families" : "discuss + prep",
      why: ["Dasha alignment supports relationship milestones", `Span: ${safeISO(sp.s)} → ${safeISO(sp.e)}`],
      do: ["Fix shortlists and documents early", "Use strongest sub-window for formal steps"],
      score,
    });
  }
  return out;
}

function windowsForJob(spans: Array<DashaSpan & { s: Date; e: Date }>) {
  const out: NonNullable<TimingResult["windows"]> = [];
  for (const sp of spans) {
    const totalMs = +sp.e - +sp.s;
    const phaseDays = Math.max(14, Math.round(totalMs / 3 / 86400000));

    const p1s = sp.s;
    const p1e = addDays(p1s, phaseDays);
    const p2s = p1e;
    const p2e = addDays(p2s, phaseDays);
    const p3s = p2e;
    const p3e = sp.e;

    out.push(
      {
        fromISO: safeISO(p1s), toISO: safeISO(p1e),
        tag: "prep + momentum",
        why: ["Dasha lift begins; market scan + materials polish"],
        do: ["Update CV/portfolio", "Warm intros list", "Light applications"],
        score: 0.5,
      },
      {
        fromISO: safeISO(p2s), toISO: safeISO(p2e),
        tag: "outreach + interviews",
        why: ["Signal quality improves mid-span"],
        do: ["Targeted outreach", "Interviews & take-homes", "Ref checks"],
        score: 0.65,
      },
      {
        fromISO: safeISO(p3s), toISO: safeISO(p3e),
        tag: "offer + close",
        why: ["Negotiation/closing leans supportive near end"],
        do: ["Negotiate bands", "Decide & handover plan"],
        score: 0.75,
      }
    );
  }
  return out;
}

/* main */
export async function timingForTopic(args: {
  topic: "vehicle" | "property" | "job" | "wealth" | "health" | "relationships" | "disputes" | "marriage";
  profile: Profile;
  horizonDays?: number;
  dashaSpans?: DashaSpan[];
}): Promise<TimingResult> {
  const { topic } = args;
  const horizonDays = Math.max(30, Math.min(540, args.horizonDays ?? 180));

  try {
    const spansInput: DashaSpan[] = Array.isArray(args.dashaSpans) ? args.dashaSpans : [];

    let spans = spansWithinHorizon(spansInput, horizonDays);
    if (!spans.length && spansInput.length) {
      spans = spansWithinHorizon(spansInput, Math.max(horizonDays, 540));
    }

    if (!spans.length) {
      return {
        ok: false,
        error: "No Vimshottari spans available (check birth data or life engine wiring).",
      };
    }

    let windows: NonNullable<TimingResult["windows"]>;
    if (topic === "marriage") windows = windowsForMarriage(spans);
    else if (topic === "job") windows = windowsForJob(spans);
    else windows = windowsForJob(spans);

    const safeWins = (windows || []).filter((w) => w.fromISO && w.toISO);

    const bottomLine =
      topic === "vehicle"
        ? { lead: "A cautious buy is possible; use windows intentionally.", nuance: "" }
      : topic === "job"
        ? { lead: "Momentum via structured outreach; expect quality spikes.", nuance: "10th/11th activation helps outreach; avoid impulse resignations." }
      : topic === "marriage"
        ? { lead: "Marriage lands best when dasha & 7th-house cues align; use the strongest window(s) for formal steps.", nuance: "" }
      : { lead: "Use the windows deliberately; patience between them helps.", nuance: "" };

    return {
      ok: true,
      source: "engine",
      bottomLine,
      windows: safeWins,
      context: "Built from Vimshottari MD/AD windows",
    };
  } catch (err: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[timing/engine] error:", err);
    }
    return { ok: false, error: err?.message || "Timing engine failed" };
  }
}
