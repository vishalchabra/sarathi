import { classifyIntent, type Intent } from "./intent";

type Chunk = { id: string; title: string; text: string };

// ---------- time helpers (keep your existing ones) ----------
const toMin = (s?: string) => { /* unchanged */ };
const fmt = (x: number) => { /* unchanged */ };
const fmtRange = (a: number, b: number) => `${fmt(a)}–${fmt(b)}`;
function overlaps(a: [number, number], b: [number, number]) { /* unchanged */ }
function freeSlots(day: { sunrise?: string; sunset?: string; avoid: Array<{ start?: string; end?: string }>}, minLenMin = 45) { /* unchanged */ }
function pick<T>(arr: T[] | undefined, n: number): T[] { return !arr?.length ? [] : arr.slice(0, n); }
const short = (d?: string) => (d ? d.slice(0, 10) : "—");

// NEW: reorder “why” so marriage signals show first
function prioritizeReasons(reasons: string[], intent: Intent) {
  if (!reasons?.length) return reasons || [];
  const rank = (r: string) => {
    const s = r.toLowerCase();
    if (intent === "relationship_timing") {
      if (s.includes("venus")) return 100;
      if (s.includes("jupiter")) return 90;
      if (s.includes("marriage nakshatra") || s.includes("good marriage nakshatra")) return 80;
      if (s.includes("abhijit")) return 50;
      if (s.includes("slot")) return 40;
      if (s.includes("mercury")) return 20; // still helpful but lower
      return 10;
    }
    return 10;
  };
  return [...reasons].sort((a, b) => rank(b) - rank(a));
}

export async function reason(ctx: any, _chunks: Chunk[]) {
  const intent: Intent = classifyIntent(ctx.message);

  const facts = ctx.facts ?? {};
  const windows = facts.windows ?? [];
  const hits = facts.hits ?? [];
  const nextWindow = windows[0] ?? null;

  // “best day & time” computed in facts
  const best = (facts.best ?? null) as
    | { date: string; time: string | null; why: string[]; slotWhy: string | null; alternatives: Array<{ date: string; time: string | null }> }
    | null;

  // Pick the Panchang to talk about (best > peak > today)
  let panchang = facts.bestPanchang ?? facts.peakPanchang ?? facts.panchang ?? null;

  const ab  = panchang?.muhurtas?.abhijit;
  const rah = panchang?.kaal?.rahu;
  const gul = panchang?.kaal?.gulika;
  const yam = panchang?.kaal?.yamagandam;

  // conflict detection + safe slots (unchanged)
  let abOK = false;
  if (ab?.start && ab?.end) {
    const A = toMin(ab.start)!, B = toMin(ab.end)!;
    if (A != null && B != null && B > A) {
      const avoid: [number, number][] = [];
      for (const blk of [rah, gul, yam]) {
        if (!blk?.start || !blk?.end) continue;
        const s = toMin(blk.start)!, e = toMin(blk.end)!;
        if (s != null && e != null && e > s) avoid.push([s, e]);
      }
      abOK = !avoid.some((blk) => !(B <= blk[0] || blk[1] <= A));
    }
  }
  const safeTimes =
    panchang?.sun && (rah || gul || yam)
      ? freeSlots({ sunrise: panchang.sun.sunrise, sunset: panchang.sun.sunset, avoid: [rah || {}, gul || {}, yam || {}] }, 60).slice(0, 2)
      : [];

  const lines: string[] = [];
  const actions: string[] = [];
  const sameDay = !!nextWindow && nextWindow.startISO?.slice(0,10) === nextWindow.endISO?.slice(0,10);

  // ---------- SUMMARY (prediction tone) ----------
  switch (intent) {
    case "relationship_timing": {
      if (best) {
        lines.push(best.time
          ? `**Prediction — Best day for marriage steps: ${best.date}; ideal time: ${best.time}.**`
          : `**Prediction — Best day for marriage steps: ${best.date}.**`);
      } else if (nextWindow) {
        lines.push(sameDay
          ? `**Prediction — Best day for marriage steps: ${short(nextWindow.peakISO)}.**`
          : `**Prediction — Window for marriage steps: ${short(nextWindow.startISO)} → ${short(nextWindow.endISO)}, peak ${short(nextWindow.peakISO)}.**`);
      } else {
        lines.push(`**Prediction — Neutral fortnight:** use this time to prepare calmly.`);
      }
      break;
    }
    case "purchase": { /* keep your purchase block */ break; }
    case "timing":   { /* keep your timing block   */ break; }
    default:         { /* keep others               */ lines.push(hits.length ? `Supportive tone—use it for practical progress.` : `Neutral day—finish what's on your plate.`); }
  }

  // ---------- WHY (prioritized per intent) ----------
  if (best?.why?.length) {
    const pr = prioritizeReasons(best.why, intent).slice(0, 3);
    lines.push(`**Why:** ${pr.join("; ")}${best.slotWhy ? `; ${best.slotWhy}` : ""}.`);
  }

  // ---------- MUHURTA (only when we didn't already promise a specific time) ----------
  const showMuhurtas = !best || !best.time;
  if (showMuhurtas) {
    const dayPrefix = best ? "On that day," : nextWindow ? "On the peak day," : "Today,";
    if (ab?.start && ab?.end) {
      if (abOK) lines.push(`${dayPrefix} **Abhijit** ${ab.start}–${ab.end} is good for decisive steps.`);
      else if (safeTimes.length) lines.push(`${dayPrefix} safer slots: **${safeTimes.join(", ")}**.`);
    } else if (safeTimes.length) {
      lines.push(`${dayPrefix} safer slots: **${safeTimes.join(", ")}**.`);
    }
    if (rah?.start && rah?.end) lines.push(`${dayPrefix} avoid new beginnings during **Rahu Kaal** ${rah.start}–${rah.end}.`);
  }

  // ---------- ACTIONS (marriage-specific when needed) ----------
  if (intent === "relationship_timing") {
    if (best) {
      actions.push(`Plan a warm conversation or family touchpoint on **${best.date}**${best.time ? ` in ${best.time}` : ""}.`);
      actions.push(`Keep it clear and kind; confirm one next step.`);
    } else {
      actions.push(`Aim the conversation near the peak day; pick a clean daytime slot (avoid Rahu Kaal).`);
    }
    actions.push(`If families are involved, use the indicated slot for introductions.`);
  } else {
    // keep your other intent actions as you already have them
  }

  const confidence: "Low" | "Medium" | "High" = hits.length || windows.length || best ? "Medium" : "Low";
  return { text: lines.join("\n\n"), confidence, actions: pick(actions, 4) };
}
