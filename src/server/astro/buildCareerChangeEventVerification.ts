import type {
  BaseChartFactors,
  EventVerification,
  HistoricalSnapshot,
  ProfessionFacts,
} from "@/server/astro/types";

type Input = {
  baseChartFactors?: BaseChartFactors | null;
  professionFacts?: ProfessionFacts | null;
  historicalSnapshot?: HistoricalSnapshot | null;
};

export function buildCareerChangeEventVerification(
  input: Input
): EventVerification {
  const base = input.baseChartFactors ?? null;
  const facts = input.professionFacts ?? null;
  const snap = input.historicalSnapshot ?? null;

  const natalSupport: string[] = [];
  const divisionalSupport: string[] = [];
  const dashaSupport: string[] = [];
  const transitSupport: string[] = [];
  const blockers: string[] = [];

  let score = 35;

  const dominant = base?.strengths?.dominantPlanets ?? [];
  const activeHouses = snap?.activeNatalHouses ?? [];
  const activePlanets = snap?.activatedNatalPlanets ?? [];
  const degreeHits = snap?.degreeHits ?? [];
  const d10Reinforced = base?.divisionalSupport?.d10?.reinforcedPlanets ?? [];
  const d10CareerPlanets = base?.divisionalSupport?.d10?.careerPlanets ?? [];

  // ---------------- Natal career promise ----------------
  if (facts?.strongestCareerSignals?.length) {
    natalSupport.push(...facts.strongestCareerSignals.slice(0, 5));
    score += 10;
  }

  if (facts?.dominantCareerPlanets?.includes("Saturn")) {
    natalSupport.push("Saturn is a major profession driver, supporting structured work, responsibility, and institutional career movement.");
    score += 6;
  }

  if (facts?.dominantCareerPlanets?.includes("Mercury")) {
    natalSupport.push("Mercury supports analytical work, systems, decisions, communication, and role shifts linked to skill/application.");
    score += 6;
  }

  if (facts?.dominantCareerPlanets?.includes("Sun")) {
    natalSupport.push("Sun supports authority, visibility, and role-definition in career matters.");
    score += 5;
  }

  if (facts?.dominantCareerPlanets?.includes("Rahu")) {
    natalSupport.push("Rahu can create ambition, dissatisfaction, and a push toward a more ambitious or unconventional work path.");
    score += 5;
  }

  if (facts?.serviceVsBusiness === "service") {
    natalSupport.push("The natal career pattern is service/job-oriented, so role changes inside structured systems are meaningful triggers.");
    score += 4;
  }

  if (facts?.stabilityPattern === "changing") {
    natalSupport.push("The natal profession pattern supports phases of change, transition, or dissatisfaction that can push career movement.");
    score += 4;
  }

  // ---------------- D10 / divisional support ----------------
  if (facts?.supportingDivisionalSignals?.length) {
    divisionalSupport.push(...facts.supportingDivisionalSignals.slice(0, 4));
    score += 8;
  }

  if (d10Reinforced.length) {
    divisionalSupport.push(`D10 reinforces career planets: ${d10Reinforced.join(", ")}.`);
    score += 6;
  }

  if (d10CareerPlanets.length) {
    divisionalSupport.push(`D10 active career planets: ${d10CareerPlanets.join(", ")}.`);
    score += 5;
  }

  if (d10Reinforced.includes("Saturn")) {
    divisionalSupport.push("D10 Saturn reinforcement supports role responsibility, institutional movement, and serious career shifts.");
    score += 4;
  }

  if (d10Reinforced.includes("Mercury")) {
    divisionalSupport.push("D10 Mercury reinforcement supports skill-based transition, communication-led work, and analytical role changes.");
    score += 4;
  }

  // ---------------- Dasha support ----------------
  if (snap?.dasha?.md) {
    dashaSupport.push(`Active Mahadasha at the event time: ${snap.dasha.md}.`);
  }
  if (snap?.dasha?.ad) {
    dashaSupport.push(`Active Antardasha at the event time: ${snap.dasha.ad}.`);
  }
  if (snap?.dasha?.pd) {
    dashaSupport.push(`Active Pratyantar at the event time: ${snap.dasha.pd}.`);
  }

  if (activeHouses.some((h) => [1, 6, 10, 11].includes(h))) {
    dashaSupport.push("The active dasha stack was activating core career houses.");
    score += 14;
  }

  if (activeHouses.includes(10)) {
    dashaSupport.push("The 10th house was directly activated, supporting profession/status movement.");
    score += 12;
  }

  if (activeHouses.includes(6)) {
    dashaSupport.push("The 6th house was activated, supporting job, service, work environment, or role change.");
    score += 8;
  }

  if (activeHouses.includes(11)) {
    dashaSupport.push("The 11th house was activated, supporting gains, network-based openings, and promotion-style movement.");
    score += 7;
  }

  if (activeHouses.includes(1)) {
    dashaSupport.push("The 1st house was activated, supporting identity shift and role redefinition.");
    score += 6;
  }

  if (snap?.dasha?.ad === "Saturn") {
    dashaSupport.push("Saturn Antardasha supports structured career responsibility, burden, formal role movement, or heavier accountability.");
    score += 8;
  }

  if (snap?.dasha?.ad === "Mercury") {
    dashaSupport.push("Mercury Antardasha supports role changes through skill, decision-making, communication, and application.");
    score += 8;
  }

  if (snap?.dasha?.ad === "Jupiter") {
    dashaSupport.push("Jupiter Antardasha supports growth, expansion, advice-led work, and broader professional openings.");
    score += 7;
  }

  if (snap?.dasha?.ad === "Rahu") {
    dashaSupport.push("Rahu Antardasha supports ambition, dissatisfaction, unconventional movement, and career shift pressure.");
    score += 7;
  }

  if (snap?.dasha?.ad === "Sun") {
    dashaSupport.push("Sun Antardasha supports visibility, authority, and role-definition changes.");
    score += 6;
  }

  // ---------------- Transit support ----------------
  if (snap?.summary?.careerActive) {
    transitSupport.push("The historical snapshot shows career themes were active during this period.");
    score += 8;
  }

  if (activePlanets.includes("Saturn")) {
    transitSupport.push("Saturn was being activated by the historical transit pattern, supporting responsibility or structural shift.");
    score += 5;
  }

  if (activePlanets.includes("Mercury")) {
    transitSupport.push("Mercury activation supports movement through skill, communication, process, or decision.");
    score += 5;
  }

  if (activePlanets.includes("Sun")) {
    transitSupport.push("Sun activation supports visibility, recognition, authority, or a change in role definition.");
    score += 4;
  }

  if (activePlanets.includes("Rahu")) {
    transitSupport.push("Rahu activation supports ambition, dissatisfaction, experimentation, or a more unconventional move.");
    score += 4;
  }

  const careerDegreeHits = degreeHits.filter((h) =>
    ["Saturn", "Mercury", "Sun", "Jupiter", "Rahu"].includes(h.natalPlanet)
  );

  if (careerDegreeHits.length) {
    transitSupport.push(
      ...careerDegreeHits.slice(0, 3).map(
        (h) => `${h.transitPlanet} made a ${h.orb}° hit to natal ${h.natalPlanet}.`
      )
    );
    score += Math.min(8, careerDegreeHits.length * 2);
  }

  // ---------------- Blockers ----------------
  if (facts?.obstacles?.length) {
    blockers.push(...facts.obstacles.slice(0, 4));
    score -= 2;
  }

  if (facts?.serviceVsBusiness === "service" && !activeHouses.includes(10)) {
    blockers.push("Career support exists, but the strongest status/10th-house activation is not visible.");
    score -= 3;
  }

  if (dominant.includes("Ketu")) {
    blockers.push("Ketu can produce detachment, uncertainty, or unclear follow-through around the move.");
    score -= 3;
  }

  score = clamp(score, 0, 100);

  if (score > 90) {
    score = 85 + (score - 90) * 0.3;
  }

  const verdict =
    score >= 70 ? "strong_match" :
    score >= 50 ? "possible_match" :
    "weak_match";

  return {
    eventType: "career_change",
    verdict,
    score,
    reasons: uniq([
      ...natalSupport,
      ...divisionalSupport,
      ...dashaSupport,
      ...transitSupport,
    ]).slice(0, 10),
    natalSupport: uniq(natalSupport).slice(0, 6),
    divisionalSupport: uniq(divisionalSupport).slice(0, 6),
    dashaSupport: uniq(dashaSupport).slice(0, 6),
    transitSupport: uniq(transitSupport).slice(0, 6),
    blockers: uniq(blockers).slice(0, 6),
  };
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr.map((x) => String(x).trim()).filter(Boolean)));
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}