// src/lib/engine.ts
import type { Chart, Panchang, Verdict } from "./types";

/**
 * We use a weighted-signal approach.
 * Each signal adds weight when true, and contributes a human-readable reason.
 * Confidence is the clamped sum of weights (0..1).
 */

type Signal = { label: string; weight: number; hit: boolean; reason: string };

// --- Helpers --------------------------------------------------------------

function hasPlanetInSign(
  chart: Chart,
  planet: string,
  sign: string
): boolean {
  const p = chart.planets?.[planet];
  return !!p && p.sign === sign;
}

function houseHasStrength(
  chart: Chart,
  houseNumber: number
): boolean {
  // Simple heuristic: any of Sun/Mars/Jupiter/Venus/Mercury present in house → strength
  // (Replace with your actual shadbala/ashtakavarga/house lord dignity when you wire real logic)
  const majors = ["Sun", "Mars", "Jupiter", "Venus", "Mercury"];
  return majors.some((pl) => chart.planets?.[pl]?.house === houseNumber);
}

function addIf(signals: Signal[], hit: boolean, weight: number, reason: string, label: string) {
  signals.push({ label, weight, hit, reason });
}

function scoreSignals(signals: Signal[]) {
  const score = signals.reduce((s, x) => s + (x.hit ? x.weight : 0), 0);
  const reasons = signals.filter(s => s.hit).map(s => `• ${s.reason}`);
  return { score: Math.min(1, Math.max(0, score)), reasons };
}

function bandSummary(score: number, strong: string, mid: string, weak: string) {
  return score > 0.7 ? strong : score > 0.45 ? mid : weak;
}

// --- CAREER ---------------------------------------------------------------

function evaluateCareer(chart: Chart, panchang: Panchang, when: Date): Verdict {
  const signals: Signal[] = [];

  addIf(
    signals,
    chart.ascendant === "Virgo",
    0.15,
    "Virgo ascendant supports methodical execution and documentation.",
    "Asc_Virgo"
  );

  addIf(
    signals,
    chart.moonSign === "Taurus",
    0.20,
    "Moon in Taurus favors steady, consistent output.",
    "Moon_Taurus"
  );

  // House 10 strength (status, authority, career)
  addIf(
    signals,
    houseHasStrength(chart, 10),
    0.20,
    "10th house shows supportive placements for reputation and delivery.",
    "H10_Strength"
  );

  // House 6 support (grit, routines, service)
  addIf(
    signals,
    houseHasStrength(chart, 6),
    0.12,
    "6th house strengths back discipline and process improvements.",
    "H6_Strength"
  );

  // Simple panchang nudge (e.g., Abhijit muhurta present)
  addIf(
    signals,
    !!panchang?.muhurtas?.abhijit,
    0.08,
    "Day includes Abhijit muhurta—favors decisive actions.",
    "Abhijit"
  );

  const { score, reasons } = scoreSignals(signals);
  const summary = bandSummary(
    score,
    "Tailwind phase for focused execution—ship key milestones.",
    "Mixed signals—prioritize consistency and remove blockers.",
    "Foundation work first—document, reduce scope, avoid high-risk decisions."
  );

  return { area: "Career", summary, confidence: score, reasons };
}

// --- FINANCE --------------------------------------------------------------

function evaluateFinance(chart: Chart, _panchang: Panchang, _when: Date): Verdict {
  const signals: Signal[] = [];

  // 2nd house (assets, savings)
  addIf(
    signals,
    houseHasStrength(chart, 2),
    0.18,
    "2nd house support suggests steadier savings/asset flow.",
    "H2_Strength"
  );

  // 11th house (income, gains)
  addIf(
    signals,
    houseHasStrength(chart, 11),
    0.18,
    "11th house signals gains through networks or scale.",
    "H11_Strength"
  );

  // Jupiter in strong sign (very rough placeholder)
  addIf(
    signals,
    hasPlanetInSign(chart, "Jupiter", "Sagittarius") || hasPlanetInSign(chart, "Jupiter", "Pisces"),
    0.18,
    "Jupiter’s dignity boosts financial judgment and opportunity.",
    "Jup_Dignity"
  );

  // Grounded Moon reduces impulsive spend
  addIf(
    signals,
    chart.moonSign === "Taurus",
    0.12,
    "Grounded Moon improves patience with budgets.",
    "Moon_Taurus"
  );

  const { score, reasons } = scoreSignals(signals);
  const summary = bandSummary(
    score,
    "Scope to grow savings and scale what’s working.",
    "Keep budgets tight; optimize expenses and iterate.",
    "Consolidate cash reserves; defer non-essential purchases."
  );

  return { area: "Finance", summary, confidence: score, reasons };
}

// --- RELATIONSHIPS --------------------------------------------------------

function evaluateRelationships(chart: Chart, _panchang: Panchang, _when: Date): Verdict {
  const signals: Signal[] = [];

  // 7th house (partnerships)
  addIf(
    signals,
    houseHasStrength(chart, 7),
    0.20,
    "7th house support—favors harmony and teamwork.",
    "H7_Strength"
  );

  // Venus condition (placeholder)
  addIf(
    signals,
    hasPlanetInSign(chart, "Venus", "Libra") || hasPlanetInSign(chart, "Venus", "Taurus"),
    0.18,
    "Venus dignified—enhanced affection, aesthetics, and diplomacy.",
    "Ven_Dignity"
  );

  // Moon stability
  addIf(
    signals,
    chart.moonSign === "Taurus",
    0.14,
    "Emotional steadiness supports warm, supportive exchanges.",
    "Moon_Taurus"
  );

  const { score, reasons } = scoreSignals(signals);
  const summary = bandSummary(
    score,
    "Warm, supportive window for bonding and shared experiences.",
    "Be patient; listen more than you speak; clarify assumptions.",
    "Keep expectations gentle; avoid heavy talks—focus on small kindnesses."
  );

  return { area: "Relationships", summary, confidence: score, reasons };
}

// --- HEALTH ---------------------------------------------------------------

function evaluateHealth(chart: Chart, _panchang: Panchang, _when: Date): Verdict {
  const signals: Signal[] = [];

  // 6th house (routines, recovery)
  addIf(
    signals,
    houseHasStrength(chart, 6),
    0.20,
    "6th house backing—routines, rehab, and hygiene practices land better.",
    "H6_Strength"
  );

  // Asc Virgo → routines + cleanliness
  addIf(
    signals,
    chart.ascendant === "Virgo",
    0.15,
    "Virgo ascendant—habits, diet tracking, and cleanliness pay off.",
    "Asc_Virgo"
  );

  // Mars in disciplined sign (placeholder heuristic)
  addIf(
    signals,
    hasPlanetInSign(chart, "Mars", "Capricorn") || hasPlanetInSign(chart, "Mars", "Aries"),
    0.15,
    "Mars in disciplined sign—training response and willpower trend up.",
    "Mars_Strong"
  );

  const { score, reasons } = scoreSignals(signals);
  const summary = bandSummary(
    score,
    "Good momentum—lock in sleep, hydration, and progressive training.",
    "Maintain routine; keep intensity moderate; avoid overreach.",
    "Prioritize recovery—sleep, mobility, and gentle walks."
  );

  return { area: "Health", summary, confidence: score, reasons };
}

// --- Aggregator -----------------------------------------------------------

export function evaluateAll(chart: Chart, panchang: Panchang, when: Date): Verdict[] {
  return [
    evaluateCareer(chart, panchang, when),
    evaluateFinance(chart, panchang, when),
    evaluateRelationships(chart, panchang, when),
    evaluateHealth(chart, panchang, when),
  ];
}
