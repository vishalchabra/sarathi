import type {
  BaseChartFactors,
  MarriageFacts,
  MarriageLifeReading,
  PlanetId,
} from "@/server/astro/types";

type Input = {
  baseChartFactors?: BaseChartFactors | null;
  marriageFacts?: MarriageFacts | null;
};

export function buildMarriageLifeReading(input: Input): MarriageLifeReading {
  const base = input.baseChartFactors ?? null;
  const facts = input.marriageFacts ?? null;

  const dominant = base?.strengths?.dominantPlanets ?? [];
  const md = base?.activeTiming?.md ?? null;
  const ad = base?.activeTiming?.ad ?? null;
  const pd = base?.activeTiming?.pd ?? null;

  const strongestSignals: string[] = [];
  const whatStrengthensMarriage: string[] = [];
  const whatWeakensMarriage: string[] = [];
  const currentPhaseImpact: string[] = [];

  let confidence = Number(facts?.confidence ?? 50);

  strongestSignals.push(...(facts?.strongestMarriageSignals ?? []).slice(0, 4));
  strongestSignals.push(...(facts?.d9Signals ?? []).slice(0, 2));

  const overallTone = getOverallTone(dominant, facts);
  const emotionalPattern = getEmotionalPattern(dominant, facts);
  const communicationPattern = getCommunicationPattern(dominant, facts);
  const stabilityPattern = getStabilityPattern(dominant, facts);
  const frictionPattern = getFrictionPattern(dominant, facts);

  // What strengthens marriage
  if (dominant.includes("Saturn")) {
    whatStrengthensMarriage.push(
      "Clear roles, reliability, and doing what was agreed matter more than emotional dramatics."
    );
    confidence += 4;
  }

  if (dominant.includes("Jupiter")) {
    whatStrengthensMarriage.push(
      "Shared growth, respect, and mature conversations strengthen the bond."
    );
    confidence += 4;
  }

  if (dominant.includes("Venus")) {
    whatStrengthensMarriage.push(
      "Warmth, affection, and making time for emotional harmony help the relationship stay softer."
    );
    confidence += 4;
  }

  if (dominant.includes("Moon")) {
    whatStrengthensMarriage.push(
      "Emotional responsiveness and not ignoring small feelings help avoid silent buildup."
    );
    confidence += 3;
  }

  // What weakens marriage
  if (dominant.includes("Saturn")) {
    whatWeakensMarriage.push(
      "Unspoken burden, rigid expectations, or carrying too much silently can create distance."
    );
  }

  if (dominant.includes("Rahu")) {
    whatWeakensMarriage.push(
      "Mixed signals, emotional impatience, or wanting quick relief from tension can destabilize things."
    );
    confidence += 2;
  }

  if (dominant.includes("Ketu")) {
    whatWeakensMarriage.push(
      "Withdrawal, emotional detachment, or shutting down too quickly can weaken connection."
    );
  }

  if (dominant.includes("Moon") && dominant.includes("Saturn")) {
    whatWeakensMarriage.push(
      "Feeling emotionally unsupported while still handling responsibility can create quiet resentment."
    );
    confidence += 4;
  }

  // Current phase impact
  for (const pid of [md, ad, pd].filter(Boolean) as PlanetId[]) {
    if (pid === "Venus") {
      currentPhaseImpact.push(
        "This phase increases the need for warmth, closeness, and more visible relationship effort."
      );
    }
    if (pid === "Rahu") {
      currentPhaseImpact.push(
        "This phase can magnify dissatisfaction, making small gaps feel bigger than usual."
      );
    }
    if (pid === "Saturn") {
      currentPhaseImpact.push(
        "This phase makes commitment feel heavier, but also more real and defining."
      );
    }
    if (pid === "Jupiter") {
      currentPhaseImpact.push(
        "This phase supports growth, perspective, and a more mature understanding of the relationship."
      );
    }
    if (pid === "Moon") {
      currentPhaseImpact.push(
        "This phase heightens emotional sensitivity and the need for reassurance."
      );
    }
  }

  confidence = clamp(confidence, 0, 100);

  return {
    overallTone,
    emotionalPattern,
    communicationPattern,
    stabilityPattern,
    frictionPattern,
    whatStrengthensMarriage: uniq(whatStrengthensMarriage).slice(0, 4),
    whatWeakensMarriage: uniq(whatWeakensMarriage).slice(0, 4),
    currentPhaseImpact: uniq(currentPhaseImpact).slice(0, 4),
    strongestSignals: uniq(strongestSignals).slice(0, 6),
    confidence,
  };
}

/* ---------------- helpers ---------------- */

function getOverallTone(
  dominant: PlanetId[],
  facts?: MarriageFacts | null
): string {
  if (dominant.includes("Saturn") && dominant.includes("Jupiter")) {
    return "Your married life is built around seriousness, growth, and long-term responsibility rather than light or casual partnership.";
  }

  if (facts?.likelyMarriagePattern === "delayed") {
    return "Your marriage pattern is serious and selective, which usually makes the bond more meaningful but less effortless.";
  }

  if (dominant.includes("Venus") && dominant.includes("Moon")) {
    return "Your married life depends heavily on emotional closeness, warmth, and how safe the relationship feels day to day.";
  }

  return "Your married life is shaped more by commitment and real compatibility than by surface harmony alone.";
}

function getEmotionalPattern(
  dominant: PlanetId[],
  facts?: MarriageFacts | null
): string {
  if (dominant.includes("Moon") && dominant.includes("Saturn")) {
    return "Emotionally, you need closeness but may also carry heaviness quietly, so feelings can build internally before being expressed.";
  }

  if (dominant.includes("Venus") && dominant.includes("Moon")) {
    return "Emotionally, you do best when affection is visible and the relationship feels responsive rather than dry or mechanical.";
  }

  if (facts?.partnershipStyle?.includes("emotionally responsive")) {
    return "Emotionally, you are sensitive to tone and effort, so the quality of connection matters more than appearances.";
  }

  return "Emotionally, marriage works best when there is steadiness, reassurance, and less guessing.";
}

function getCommunicationPattern(
  dominant: PlanetId[],
  facts?: MarriageFacts | null
): string {
  if (dominant.includes("Mercury") && dominant.includes("Saturn")) {
    return "Communication works best when it is direct, practical, and specific rather than emotional but vague.";
  }

  if (dominant.includes("Jupiter")) {
    return "Communication improves when there is perspective, fairness, and room to discuss meaning rather than just reacting to incidents.";
  }

  if (facts?.commitmentStyle?.includes("serious")) {
    return "Communication needs honesty and maturity — half-said things tend to create more weight than relief.";
  }

  return "Communication works best when expectations are named clearly and not left implied.";
}

function getStabilityPattern(
  dominant: PlanetId[],
  facts?: MarriageFacts | null
): string {
  if (facts?.likelyMarriagePattern === "delayed") {
    return "The marriage tends to become stronger with maturity, structure, and time rather than through effortless early flow.";
  }

  if (dominant.includes("Saturn")) {
    return "Stability comes from consistency, dependability, and doing the ordinary things properly over time.";
  }

  if (dominant.includes("Venus") && dominant.includes("Jupiter")) {
    return "Stability improves when warmth and wisdom are both present — neither affection alone nor practicality alone is enough.";
  }

  return "Stability depends on maintaining clarity, effort, and emotional steadiness.";
}

function getFrictionPattern(
  dominant: PlanetId[],
  facts?: MarriageFacts | null
): string {
  if (dominant.includes("Rahu") && dominant.includes("Venus")) {
    return "Friction tends to rise when desire, expectation, or dissatisfaction grows faster than honest communication.";
  }

  if (dominant.includes("Moon") && dominant.includes("Saturn")) {
    return "Friction builds when emotional needs go unspoken while responsibility keeps increasing.";
  }

  if (facts?.obstacles?.length) {
    return "Friction is more likely when emotional distance, mixed signals, or uneven effort are left unaddressed.";
  }

  return "Friction grows more from silence and assumption than from open disagreement.";
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr.map((x) => String(x).trim()).filter(Boolean)));
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}