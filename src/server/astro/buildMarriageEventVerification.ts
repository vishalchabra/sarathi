import type {
  BaseChartFactors,
  EventVerification,
  HistoricalSnapshot,
  MarriageFacts,
} from "@/server/astro/types";

type Input = {
  baseChartFactors?: BaseChartFactors | null;
  marriageFacts?: MarriageFacts | null;
  historicalSnapshot?: HistoricalSnapshot | null;
};

export function buildMarriageEventVerification(input: Input): EventVerification {
  const base = input.baseChartFactors ?? null;
  const facts = input.marriageFacts ?? null;
  const snap = input.historicalSnapshot ?? null;

  const natalSupport: string[] = [];
  const divisionalSupport: string[] = [];
  const dashaSupport: string[] = [];
  const transitSupport: string[] = [];
  const blockers: string[] = [];

  let score = 40;

  const dominant = base?.strengths?.dominantPlanets ?? [];
  const activeHouses = snap?.activeNatalHouses ?? [];
  const activePlanets = snap?.activatedNatalPlanets ?? [];
  const d9Reinforced = base?.divisionalSupport?.d9?.reinforcedPlanets ?? [];
  const degreeHits = snap?.degreeHits ?? [];
  // Natal promise
  if (facts?.strongestMarriageSignals?.length) {
    natalSupport.push(...facts.strongestMarriageSignals);
    score += 10;
  }

  if (facts?.likelyMarriagePattern === "steady") {
    natalSupport.push("Natal marriage pattern looks steady and commitment-supportive.");
    score += 8;
  }

  if (facts?.likelyMarriagePattern === "mixed") {
    natalSupport.push("Natal marriage pattern is mixed but still workable when the timing supports commitment.");
    score += 4;
  }

  if (facts?.likelyMarriagePattern === "delayed") {
    natalSupport.push("Natal chart supports marriage, but with seriousness or delay rather than easy early timing.");
    score += 2;
  }

  if (dominant.includes("Venus")) {
    natalSupport.push("Venus is a strong relationship planet in the chart.");
    score += 6;
  }

  if (dominant.includes("Jupiter")) {
    natalSupport.push("Jupiter supports commitment, growth, and meaningful partnership.");
    score += 5;
  }

  if (dominant.includes("Saturn")) {
    natalSupport.push("Saturn adds seriousness and karmic weight to marriage timing.");
    score += 3;
  }

  // D9 / divisional support
  if (facts?.d9Signals?.length) {
    divisionalSupport.push(...facts.d9Signals);
    score += 10;
  }

  if (d9Reinforced.includes("Venus")) {
    divisionalSupport.push("D9 Venus reinforcement supports relationship consolidation and marriage.");
    score += 6;
  }

  if (d9Reinforced.includes("Jupiter")) {
    divisionalSupport.push("D9 Jupiter reinforcement supports dharmic commitment and spouse support.");
    score += 5;
  }

  if (d9Reinforced.includes("Saturn")) {
    divisionalSupport.push("D9 Saturn reinforcement supports durable commitment, though often with seriousness or delay.");
    score += 3;
  }

  // Dasha support from historical snapshot
  if (snap?.dasha?.md) {
    dashaSupport.push(`Active Mahadasha at the event time: ${snap.dasha.md}.`);
  }
  if (snap?.dasha?.ad) {
    dashaSupport.push(`Active Antardasha at the event time: ${snap.dasha.ad}.`);
  }
  if (snap?.dasha?.pd) {
    dashaSupport.push(`Active Pratyantar at the event time: ${snap.dasha.pd}.`);
  }

  if (activeHouses.some((h) => [2, 5, 7].includes(h))) {
    dashaSupport.push("The active dasha stack was activating relationship/family houses.");
    score += 12;
  }

  if (activeHouses.includes(7)) {
    dashaSupport.push("The 7th house was directly activated at the event time.");
    score += 10;
  }

  if (activeHouses.includes(2)) {
    dashaSupport.push("The 2nd house was activated, supporting family formation.");
    score += 6;
  }

  if (activeHouses.includes(5)) {
    dashaSupport.push("The 5th house was activated, supporting romance and attraction.");
    score += 5;
  }
if (snap?.dasha?.md === "Mars") {
  dashaSupport.push("Mars Mahadasha was active at the event time.");
  score += 8;
}

if (snap?.dasha?.md === "Jupiter") {
  dashaSupport.push("Jupiter Mahadasha supports commitment, family formation, and meaningful partnership.");
  score += 8;
}
if (snap?.dasha?.ad === "Venus") {
  dashaSupport.push("Venus Antardasha strongly supports relationship bonding and marriage.");
  score += 10;
}

if (snap?.dasha?.ad === "Jupiter") {
  dashaSupport.push("Jupiter Antardasha supports commitment, family-building, and meaningful union.");
  score += 10;
}

if (snap?.dasha?.ad === "Moon") {
  dashaSupport.push("Moon Antardasha increases emotional movement and relationship responsiveness.");
  score += 7;
}

if (snap?.dasha?.pd === "Venus") {
  dashaSupport.push("Venus Pratyantar adds a strong event trigger for marriage.");
  score += 6;
}

if (snap?.dasha?.pd === "Jupiter") {
  dashaSupport.push("Jupiter Pratyantar supports formalization and commitment.");
  score += 6;
}
if (
  snap?.dasha?.md === "Mars" &&
  snap?.dasha?.ad === "Jupiter"
) {
  dashaSupport.push("Mars–Jupiter is an active timing combination here and can support marriage when natal promise exists.");
  score += 12;
}
  // Transit support from historical snapshot
  if (snap?.summary?.relationshipActive) {
    transitSupport.push("The historical snapshot shows relationship themes were active during this period.");
    score += 8;
  }

  if (activePlanets.includes("Venus")) {
    transitSupport.push("Venus was being activated by the historical transit pattern.");
    score += 5;
  }

  if (activePlanets.includes("Jupiter")) {
    transitSupport.push("Jupiter was being activated, supporting growth and commitment.");
    score += 4;
  }

  if (activePlanets.includes("Moon")) {
    transitSupport.push("Moon activation added emotional immediacy and relationship movement.");
    score += 3;
  }

  if (snap?.topTransitHits?.length) {
    transitSupport.push(...snap.topTransitHits);
    score += Math.min(6, snap.topTransitHits.length);
  }
  const marriageRelevantNatalPlanets = ["Venus", "Moon", "Jupiter", "Saturn"];

const relationshipDegreeHits = degreeHits.filter((h) =>
  marriageRelevantNatalPlanets.includes(h.natalPlanet)
);

  if (relationshipDegreeHits.length) {
    transitSupport.push(
      ...relationshipDegreeHits
        .slice(0, 3)
        .map(
          (h) =>
            `${h.transitPlanet} made a ${h.orb}° hit to natal ${h.natalPlanet}.`
        )
    );

    score += Math.min(8, relationshipDegreeHits.length * 2);
  }
  // Blockers
  if (facts?.obstacles?.length) {
    blockers.push(...facts.obstacles);
    score -= 4;
  }

  if (facts?.likelyMarriagePattern === "unconventional") {
    blockers.push("Marriage timing may be valid, but the path is less conventional or more emotionally complex.");
    score -= 2;
  }

  if (dominant.includes("Ketu")) {
    blockers.push("Ketu can create detachment or uneven emotional participation.");
    score -= 3;
  }

  score = clamp(score, 0, 100);
  // soft cap to avoid 100 inflation
if (score > 90) {
  score = 85 + (score - 90) * 0.3;
}
  const verdict =
    score >= 70 ? "strong_match" :
    score >= 50 ? "possible_match" :
    "weak_match";

  return {
    eventType: "marriage",
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