import type {
  BaseChartFactors,
  MarriageFacts,
  MarriageReading,
  PlanetId,
} from "@/server/astro/types";

type Input = {
  baseChartFactors?: BaseChartFactors | null;
  marriageFacts?: MarriageFacts | null;
};

export function buildMarriageReading(input: Input): MarriageReading {
  const base = input.baseChartFactors ?? null;
  const facts = input.marriageFacts ?? null;

  const strengths: string[] = [];
  const blockers: string[] = [];
  const currentPhaseModifier: string[] = [];
  const strongestSignals: string[] = [];

  const dominantPlanets = base?.strengths?.dominantPlanets ?? [];
  const md = base?.activeTiming?.md ?? null;
  const ad = base?.activeTiming?.ad ?? null;
  const pd = base?.activeTiming?.pd ?? null;

  strengths.push(...(facts?.strongestMarriageSignals ?? []));
  strengths.push(...(facts?.d9Signals ?? []));
  strongestSignals.push(...(facts?.strongestMarriageSignals ?? []));
  strongestSignals.push(...(facts?.d9Signals ?? []));

  blockers.push(...(facts?.obstacles ?? []));
  blockers.push(...(facts?.modifiers ?? []));

  if (dominantPlanets.includes("Venus")) {
    currentPhaseModifier.push("Relationship needs are stronger, and emotional harmony matters more than usual.");
  }
  if (dominantPlanets.includes("Saturn")) {
    currentPhaseModifier.push("Partnership themes feel serious, testing, or responsibility-heavy.");
  }
  if (dominantPlanets.includes("Rahu")) {
    currentPhaseModifier.push("There may be attraction to intensity, unconventional patterns, or emotionally charged dynamics.");
  }

  for (const pid of [md, ad, pd].filter(Boolean) as PlanetId[]) {
    if (pid === "Venus") {
      currentPhaseModifier.push("Current dasha increases attraction, bonding, or relationship focus.");
    }
    if (pid === "Jupiter") {
      currentPhaseModifier.push("Current dasha supports growth, commitment, and more meaningful partnership themes.");
    }
    if (pid === "Saturn") {
      currentPhaseModifier.push("Current dasha slows things down but can make commitment more serious and real.");
    }
    if (pid === "Rahu") {
      currentPhaseModifier.push("Current dasha can bring intensity, confusion, craving, or unconventional relationship developments.");
    }
  }

  const relationshipPattern = getRelationshipPattern(facts);
  const commitmentPattern = getCommitmentPattern(facts);

  return {
    relationshipPattern,
    commitmentPattern,
    spouseType: uniq(facts?.spouseQualities ?? []).slice(0, 5),
    likelyMarriagePattern: facts?.likelyMarriagePattern ?? "mixed",
    loveVsArranged: facts?.loveVsArranged ?? "mixed",
    strengths: uniq(strengths).slice(0, 6),
    blockers: uniq(blockers).slice(0, 6),
    currentPhaseModifier: uniq(currentPhaseModifier).slice(0, 4),
    strongestSignals: uniq(strongestSignals).slice(0, 6),
    confidence: clamp(Number(facts?.confidence ?? 50), 0, 100),
  };
}

function getRelationshipPattern(facts?: MarriageFacts | null): string {
  const style = facts?.partnershipStyle ?? [];

  if (style.includes("affectionate") || style.includes("bond-seeking")) {
    return "You seek emotional connection, relational warmth, and real partnership rather than detached companionship.";
  }

  if (style.includes("serious") || style.includes("selective")) {
    return "You are selective in relationships and tend to take emotional commitment more seriously than casually.";
  }

  return "You approach relationships with a mix of emotional need and practical caution.";
}

function getCommitmentPattern(facts?: MarriageFacts | null): string {
  const style = facts?.commitmentStyle ?? [];

  if (style.includes("serious") || style.includes("duty-based")) {
    return "Commitment tends to become meaningful only when it feels stable, responsible, and real.";
  }

  if (style.includes("growth-oriented") || style.includes("meaning-seeking")) {
    return "Commitment matters most when the relationship feels meaningful, expansive, and aligned with growth.";
  }

  return "Commitment develops gradually and tends to need both emotional and practical trust.";
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr.map((x) => String(x).trim()).filter(Boolean)));
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}