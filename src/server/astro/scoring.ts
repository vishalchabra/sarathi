// src/lib/server/astro/scoring.ts

// ===== Your existing lightweight, intent-aware scorers =====

export type TransitPos = { sign: string; degree: number };
export type PanchangScoreBits = {
  tithi?: string | null;
  nakshatra?: string | null;
  muhurta?: { abhijitOK?: boolean } | null;
  hasSafeSlot?: boolean | null;
};

const FIXED_NAK = new Set([
  "Rohini",
  "Uttara Phalguni",
  "Uttara Ashadha",
  "Uttara Bhadrapada",
  "Pushya",
  "Hasta",
  "Revati",
  "Anuradha",
]);

const MARRIAGE_NAK = new Set([
  "Rohini", "Mrigashira", "Uttara Phalguni", "Hasta", "Swati",
  "Anuradha", "Uttara Ashadha", "Uttara Bhadrapada", "Revati"
]);

const CAREER_NAK = new Set([
  "Rohini", "Pushya", "Uttara Phalguni", "Uttara Ashadha", "Shravana"
]);

function proximityScore(degT: number, degN: number, orbMajor = 2.0) {
  let d = degT - degN;
  while (d > 15) d -= 30;
  while (d < -15) d += 30;
  const orb = Math.abs(d);
  return orb > orbMajor ? 0 : (orbMajor - orb) / orbMajor; // 0..1
}

function addIf<T>(arr: T[], ok: boolean, v: T) { if (ok) arr.push(v); }

/** PURCHASE: Decisions, signatures — Mercury + Lagna clarity, clean daytime slot, fixed Nakshatra bias. */
export function scorePurchaseDay(input: {
  transit: { mercury?: TransitPos };
  natal: { mercury?: TransitPos; lagna?: TransitPos };
  dasha?: { md?: string; ad?: string };
  panchang?: PanchangScoreBits;
}) {
  let score = 0;
  const why: string[] = [];

  const trM = input.transit.mercury, nM = input.natal.mercury, nL = input.natal.lagna;
  if (trM && nM && trM.sign === nM.sign) {
    const s = proximityScore(trM.degree, nM.degree); score += s * 0.55;
    addIf(why, s > 0, "Transit Mercury near natal Mercury (clarity)");
  }
  if (trM && nL && trM.sign === nL.sign) {
    const s = proximityScore(trM.degree, nL.degree); score += s * 0.35;
    addIf(why, s > 0, "Transit Mercury near Lagna degree (self-agency)");
  }

  const md = (input.dasha?.md || "").toLowerCase();
  if (md.includes("mercury") || md.includes("budh")) { score += 0.1; why.push("Mercury dasha support"); }

  if (input.panchang?.muhurta?.abhijitOK) score += 0.08, why.push("Abhijit clean");
  if (input.panchang?.hasSafeSlot)        score += 0.05, why.push("Clean daytime slot found");

  const nak = input.panchang?.nakshatra || "";
  if (nak && FIXED_NAK.has(nak)) score += 0.06, why.push(`Fixed Nakshatra (${nak})`);

  return { score: clamp01(score), reasons: dedupe(why) };
}

/** MARRIAGE: Venus/Jupiter support, Lagna/7th flavor (fallback to Mercury). */
export function scoreMarriageDay(input: {
  transit: { venus?: TransitPos; jupiter?: TransitPos; mercury?: TransitPos };
  natal: { venus?: TransitPos; lagna?: TransitPos };
  dasha?: { md?: string; ad?: string };
  panchang?: PanchangScoreBits;
}) {
  let score = 0; const why: string[] = [];
  const trV = input.transit.venus, trJ = input.transit.jupiter, trM = input.transit.mercury;
  const nV = input.natal.venus, nL = input.natal.lagna;

  if (trV && nV && trV.sign === nV.sign) {
    const s = proximityScore(trV.degree, nV.degree); score += s * 0.45;
    addIf(why, s > 0, "Transit Venus near natal Venus (affection/union)");
  }
  if (trJ && nL && trJ.sign === nL.sign) {
    const s = proximityScore(trJ.degree, nL.degree); score += s * 0.30;
    addIf(why, s > 0, "Transit Jupiter near Lagna (support/consent)");
  }
  // fallback clarity
  if (trM && nL && trM.sign === nL.sign) {
    const s = proximityScore(trM.degree, nL.degree); score += s * 0.15;
    addIf(why, s > 0, "Mercury adds clarity for conversations");
  }

  const md = (input.dasha?.md || "").toLowerCase();
  if (md.includes("venus") || md.includes("shukra")) { score += 0.1; why.push("Venus dasha support"); }
  if (md.includes("jupiter") || md.includes("guru")) { score += 0.08; why.push("Jupiter dasha support"); }

  if (input.panchang?.muhurta?.abhijitOK) score += 0.06, why.push("Abhijit clean");
  if (input.panchang?.hasSafeSlot)        score += 0.04, why.push("Clean daytime slot found");

  const nak = input.panchang?.nakshatra || "";
  if (nak && MARRIAGE_NAK.has(nak)) score += 0.07, why.push(`Good marriage Nakshatra (${nak})`);

  return { score: clamp01(score), reasons: dedupe(why) };
}

/** CAREER: Mercury clarity + Sun/Saturn steadiness; career-friendly Nakshatras. */
export function scoreCareerDay(input: {
  transit: { mercury?: TransitPos; sun?: TransitPos; saturn?: TransitPos };
  natal: { mercury?: TransitPos; lagna?: TransitPos };
  dasha?: { md?: string; ad?: string };
  panchang?: PanchangScoreBits;
}) {
  let score = 0; const why: string[] = [];
  const trM = input.transit.mercury, trS = input.transit.sun, trSa = input.transit.saturn;
  const nM = input.natal.mercury, nL = input.natal.lagna;

  if (trM && nM && trM.sign === nM.sign) { const s = proximityScore(trM.degree, nM.degree); score += s * 0.40; addIf(why, s>0,"Transit Mercury near natal Mercury (communication)"); }
  if (trM && nL && trM.sign === nL.sign) { const s = proximityScore(trM.degree, nL.degree); score += s * 0.25; addIf(why, s>0,"Mercury near Lagna (clarity/agency)"); }
  if (trS && nL && trS.sign === nL.sign) { const s = proximityScore(trS.degree, nL.degree); score += s * 0.15; addIf(why, s>0,"Sun boosts visibility"); }
  if (trSa && nL && trSa.sign === nL.sign) { const s = proximityScore(trSa.degree, nL.degree); score += s * 0.10; addIf(why, s>0,"Saturn favors discipline"); }

  const md = (input.dasha?.md || "").toLowerCase();
  if (md.includes("mercury") || md.includes("budh")) score += 0.08, why.push("Mercury dasha support");
  if (md.includes("saturn")  || md.includes("shani")) score += 0.06, why.push("Saturn dasha steadiness");

  if (input.panchang?.muhurta?.abhijitOK) score += 0.05, why.push("Abhijit clean");
  if (input.panchang?.hasSafeSlot)        score += 0.04, why.push("Clean daytime slot found");

  const nak = input.panchang?.nakshatra || "";
  if (nak && CAREER_NAK.has(nak)) score += 0.05, why.push(`Career-friendly Nakshatra (${nak})`);

  return { score: clamp01(score), reasons: dedupe(why) };
}

// helpers
function clamp01(x: number) { return Math.max(0, Math.min(1, x)); }
function dedupe(arr: string[]) { return Array.from(new Set(arr)); }

// ===== Added: Generic category scorer that produces WINDOWS for orchestrator =====

import { DateTime } from "luxon";

export type ScoreCategoryInput = {
  daily: Array<{
    date: string; // ISO yyyy-mm-dd
    hits?: Array<{
      planet: string;
      house?: number;
      target?: string; // optional extra tag
      type?: string;   // e.g., conjunction/opposition/trine/etc.
      exact?: number;  // degrees from exact (smaller = tighter)
      strength?: number; // optional precomputed
    }>;
  }>;
  targets: { houses: number[]; planets: string[] };
  orbDeg: number;
  context?: any;
};

export type Window = {
  start: string;
  end: string;
  score: number; // 0..100
  why: string[];
};

const BENEFICS = new Set(["Jupiter", "Venus", "Mercury", "Moon"]);
const MALEFICS = new Set(["Saturn", "Mars", "Rahu", "Ketu"]);
const EASY_ASPECTS = new Set(["trine", "sextile"]);
const HARD_ASPECTS = new Set(["square", "opposition"]);
const POWER_ASPECTS = new Set(["conjunction"]);

function clampNum(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function weightByOrb(exactDeg: number | undefined, orbDeg: number): number {
  if (exactDeg == null) return 0.6;
  const x = clampNum(1 - exactDeg / Math.max(1, orbDeg), 0, 1);
  return 0.35 + 0.65 * Math.pow(x, 1.5);
}

function aspectWeight(type?: string): number {
  if (!type) return 1;
  const t = type.toLowerCase();
  if (EASY_ASPECTS.has(t)) return 1.0;
  if (HARD_ASPECTS.has(t)) return 0.8;
  if (POWER_ASPECTS.has(t)) return 1.1;
  return 1.0;
}

function planetPolarity(p: string): number {
  if (BENEFICS.has(p)) return +1;
  if (MALEFICS.has(p)) return -1;
  return +0.5; // neutral-light
}

function hitTouchesTarget(h: any, targets: ScoreCategoryInput["targets"]): boolean {
  const byHouse = typeof h.house === "number" && targets.houses.includes(h.house as number);
  const byPlanet = typeof h.planet === "string" && targets.planets.includes(h.planet);
  return byHouse || byPlanet;
}

function dayScoreGeneric(
  hits: NonNullable<ScoreCategoryInput["daily"][number]["hits"]>,
  targets: ScoreCategoryInput["targets"],
  orbDeg: number
) {
  let score = 0;
  const why: string[] = [];

  for (const h of hits) {
    if (!hitTouchesTarget(h, targets)) continue;

    const pol = planetPolarity(h.planet);
    const wOrb = weightByOrb(h.exact, orbDeg);
    const wAsp = aspectWeight(h.type);

    let contrib = pol * 2.0 * wOrb * wAsp;

    const both = (typeof h.house === "number" && targets.houses.includes(h.house)) &&
                 (typeof h.planet === "string" && targets.planets.includes(h.planet));
    if (both) contrib *= 1.25;

    const tag = h.type ? `${h.type}` : `aspect`;
    const focus = typeof h.house === "number" ? `H${h.house}` : `topic`;
    const tight = h.exact != null ? ` (±${h.exact.toFixed(1)}°)` : "";
    const flavor = pol >= 0 ? "supports" : "pressures";
    why.push(`${h.planet} ${tag}${tight} ${flavor} ${focus}`);

    score += contrib;
  }

  return { score, why };
}

function toWindows(dailyScores: Array<{ date: string; score: number; why: string[] }>): Window[] {
  const THRESH = 1.6; // tune
  const windows: Window[] = [];
  let cur: { start: string; end: string; sum: number; days: number; why: string[] } | null = null;

  for (const d of dailyScores) {
    if (d.score >= THRESH) {
      if (!cur) {
        cur = { start: d.date, end: d.date, sum: d.score, days: 1, why: [...d.why] };
      } else {
        cur.end = d.date;
        cur.sum += d.score;
        cur.days += 1;
        if (d.why.length) cur.why.push(...d.why);
      }
    } else if (cur) {
      const avg = cur.sum / cur.days;
      windows.push({
        start: cur.start,
        end: cur.end,
        score: clampNum(Math.round(avg * 15) + 50, 0, 100), // map to ~50..100
        why: Array.from(new Set(cur.why)).slice(0, 8),
      });
      cur = null;
    }
  }

  if (cur) {
    const avg = cur.sum / cur.days;
    windows.push({
      start: cur.start,
      end: cur.end,
      score: clampNum(Math.round(avg * 15) + 50, 0, 100),
      why: Array.from(new Set(cur.why)).slice(0, 8),
    });
  }

  // merge spans ≤2-day gaps
  const merged: Window[] = [];
  let prev: Window | null = null;
  for (const w of windows) {
    if (!prev) { prev = { ...w }; continue; }
    const gap = DateTime.fromISO(w.start).diff(DateTime.fromISO(prev.end), "days").days;
    if (gap <= 2) {
      prev.end = w.end;
      prev.score = Math.max(prev.score, w.score);
      prev.why = Array.from(new Set([...prev.why, ...w.why])).slice(0, 8);
    } else {
      merged.push(prev);
      prev = { ...w };
    }
  }
  if (prev) merged.push(prev);

  merged.sort((a, b) => b.score - a.score);
  return merged;
}

/**
 * Public API used by orchestrator.ts
 * - Consumes `daily` array (from your transits provider)
 * - Uses target houses/planets + orb to compute best windows
 */
export function scoreCategory(input: ScoreCategoryInput): Window[] {
  const { daily, targets, orbDeg } = input;
  if (!daily?.length) return [];

  const scoredPerDay = daily.map((d) => {
    const { score, why } = dayScoreGeneric(d.hits ?? [], targets, Math.max(0.5, orbDeg));
    return { date: d.date, score, why };
    // keep raw if needed: raw: d
  });

  return toWindows(scoredPerDay);
}
