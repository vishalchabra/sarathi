// FILE: src/server/qa/houseScore.ts
// Scoring for domain houses + windows from AD + transits + narrative helpers

import type { NatalSnapshot } from "@/server/astro/model";

export type HouseScore = {
  house: number[];
  base: number;
  dashas: number;
  transits: number;
  total: number;
  notes: string[];
  dashaNotes: string[];
  transitNotes: string[];
};

export type ADSpan = { fromISO: string; toISO: string; label: string; md?: string; ad?: string };
export type TransitWin = { fromISO: string; toISO: string; label: string; why?: string[] };

export const HOUSE_MAP: Record<
  | "vehicle" | "property" | "job" | "wealth" | "health"
  | "relationships" | "disputes" | "marriage",
  number[]
> = {
  job: [2, 6, 10, 11],
  wealth: [2, 11, 9],
  health: [1, 6, 8, 12],
  property: [4, 2, 12],
  relationships: [7, 5, 11],
  marriage: [7, 2, 11],
  disputes: [6, 8, 12],
  vehicle: [4, 3, 12],
};

function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, n));
}

function dignityToScore(d: NatalSnapshot["houses"][number]["lordDignity"]) {
  switch (d) {
    case "uccha": return 12;
    case "own": return 10;
    case "moola": return 8;
    case "friend": return 6;
    case "neutral": return 0;
    case "enemy": return -6;
    case "neecha": return -12;
    default: return 0;
  }
}

function occupantsScore(h: NatalSnapshot["houses"][number], domain: number[]) {
  // Mildly pro-malefic for 6/10 in work contexts
  const allowMaleficPush = domain.includes(6) || domain.includes(10);
  let s = 0;

  for (const o of h.occupants || []) {
    const p = o.planet.toLowerCase();
    const str = clamp(o.strength, -6, 6);

    const isBenefic = /jupiter|venus|mercury|waxing\s*moon|moon/.test(p);
    const isMalefic = /saturn|mars|rahu|ketu|sun/.test(p);

    if (isBenefic) s += Math.max(1, str);
    else if (isMalefic) s += allowMaleficPush ? Math.max(1, Math.abs(str)) : -Math.max(1, Math.abs(str));
  }
  return clamp(s, -10, 10);
}

function aspectsScore(h: NatalSnapshot["houses"][number]) {
  let s = 0;
  for (const a of h.aspects || []) {
    const power = clamp(a.power, -8, 8);
    s += a.type === "benefic" ? Math.abs(power) : -Math.abs(power);
  }
  return clamp(s, -12, 12);
}

function yogasScore(h: NatalSnapshot["houses"][number]) {
  // If your engine marks job-relevant yogas, add them here.
  return Math.min(12, (h.yogas || []).length * 2);
}

export function scoreDomain(
  natal: NatalSnapshot,
  domainHouses: number[],
  md?: string,
  ad?: string,
  pd?: string
): HouseScore {
  const notes: string[] = [];
  let base = 50;

  // Aggregate all domain houses
  for (const H of domainHouses) {
    const h = natal.houses[H];
    if (!h) continue;

    const d = dignityToScore(h.lordDignity);
    const occ = occupantsScore(h, domainHouses);
    const asp = aspectsScore(h);
    const yog = yogasScore(h);

    base += d + h.lordShadbala + occ + asp + yog;

    if (h.lord !== "Unknown") notes.push(`H${H} lord **${h.lord}** (${h.lordDignity}) contributes ${d >= 0 ? "+" : ""}${d}`);
    if (occ) notes.push(`H${H} occupants contribute ${occ >= 0 ? "+" : ""}${occ}`);
    if (asp) notes.push(`H${H} aspects contribute ${asp >= 0 ? "+" : ""}${asp}`);
    if (yog) notes.push(`H${H} yogas add +${yog}`);
  }

  // Dashas layer
  let dashas = 0;
  const dashaNotes: string[] = [];
  const tag = (x?: string) => (x ? x.toLowerCase() : "");

  const mdTag = tag(md);
  const adTag = tag(ad);
  const pdTag = tag(pd);

  const boostIfDomainLord = (planetTag: string | undefined, label: "MD"|"AD"|"PD") => {
    if (!planetTag) return;
    // If the time-lord rules any domain house, boost; if generally afflicting, slight drag
    const isWorkMalefic = /rahu|ketu|mars|saturn/.test(planetTag);
    const isBenefic = /jupiter|venus|mercury|moon/.test(planetTag);

    const bonus =
      label === "MD" ? (isBenefic ? 8 : isWorkMalefic ? 5 : 4)
    : label === "AD" ? (isBenefic ? 5 : isWorkMalefic ? 4 : 2)
    : (isBenefic ? 2 : isWorkMalefic ? 1 : 1);

    dashas += bonus;
    dashaNotes.push(`${label} **${planetTag}** supports this domain (+${bonus}).`);
  };

  boostIfDomainLord(mdTag, "MD");
  boostIfDomainLord(adTag, "AD");
  boostIfDomainLord(pdTag, "PD");

  // Transits (we don't have raw transits here; route will pass summary)
  // Provide a field holder; route.ts will replace this with real value
  const transits = 0;
  const transitNotes: string[] = [];

  const total = clamp(base + dashas + transits);

  return { house: domainHouses, base: clamp(base), dashas, transits, total, notes, dashaNotes, transitNotes };
}

export function windowsForDomain(
  adSpans: ADSpan[],
  transit: TransitWin[],
): Array<{ fromISO: string; toISO: string; tag: string; why: string[]; score: number }> {
  // Very simple merge: tag AD spans by most relevant transit in that span
  const out: Array<{ fromISO: string; toISO: string; tag: string; why: string[]; score: number }> = [];
  const toDate = (s: string) => new Date(s.replace(/T.*/, ""));
  const within = (x: Date, a: Date, b: Date) => +x >= +a && +x <= +b;

  for (const ad of adSpans) {
    const a = toDate(ad.fromISO);
    const b = toDate(ad.toISO);
    const tHits = (transit || []).filter(t => {
      const ta = toDate(t.fromISO), tb = toDate(t.toISO);
      return within(ta, a, b) || within(tb, a, b) || within(a, ta, tb) || within(b, ta, tb);
    });

    const labelFromTransit =
      tHits.find(t => /communication|mercur|interview|visibility/i.test(t.label)) ? "push + interviews" :
      tHits.find(t => /negotiation|venus|closing/i.test(t.label)) ? "negotiate + close" :
      tHits.find(t => /support|jupiter|saturn|structure/i.test(t.label)) ? "steady progress" :
      "focused progress";

    const why = tHits.slice(0, 2).map(t => t.label);
    const score = clamp(0.5 * 100 * (tHits.length ? 0.7 : 0.55), 40, 85);

    out.push({ fromISO: ad.fromISO, toISO: ad.toISO, tag: labelFromTransit, why, score });
  }

  // Keep 3 strongest near-term
  out.sort((x, y) => y.score - x.score);
  return out.slice(0, 3);
}

// Humanized narrative for any domain
export function makeNarrative(opts: {
  topic: string;
  mdad?: string;
  score: HouseScore;
  wins: Array<{ fromISO: string; toISO: string; tag: string; why: string[]; score: number }>;
}) {
  const nice = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—");

  const opener =
    `Reading your chart${opts.mdad ? ` — you’re in **${opts.mdad}**` : ""}, here’s how I’d play your ${opts.topic === "job" ? "work" : opts.topic} right now.`;

  const baseBullets = (opts.score.notes || []).slice(0, 3).map(s => `• ${s}`).join("\n") || "• Solid baseline; I’ll refine as we enrich your birth details.";
  const dashaLine = opts.score.dashaNotes.length
    ? opts.score.dashaNotes.slice(0, 2).map(s => `• ${s}`).join("\n")
    : "• Time-lords are neutral—your steady effort sets the pace.";

  const wins =
    (opts.wins || []).length
      ? opts.wins
          .map(w => `• **${nice(w.fromISO)} → ${nice(w.toISO)}** — ${w.tag}${w.why?.length ? ` (${w.why[0]})` : ""}`)
          .join("\n")
      : "• I’ll surface exact sub-windows as soon as we have complete birth details.";

  const answer = [
    opener, "",
    "What stands out (natal):",
    baseBullets, "",
    "Now (time-lords):",
    dashaLine, "",
    "Windows to use next:",
    wins
  ].join("\n");

  const how =
    opts.topic === "job"
      ? "Keep weekly targets light but consistent: 1 public win, 2 warm intros, 1 mock interview. Anchor your story on **scope → impact → comp**; negotiate inside stronger windows."
      : "Keep the cadence steady; small steps weekly beat bursts. Use the stronger windows for the heavier lifts.";

  return { answer, how };
}
