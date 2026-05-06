import type { EventArea, TriggerFact, TriggerScore } from "./types";

function levelFromScore(score: number, factCount: number): TriggerScore["level"] {
  if (score >= 85 && factCount >= 3) return "very_high";
  if (score >= 70 && factCount >= 2) return "high";
  if (score >= 45) return "medium";
  return "low";
}

export function scoreTriggerArea(
  area: EventArea,
  facts: TriggerFact[]
): TriggerScore {
  const relevant = facts.filter((f) => f.area === area);

  const rawScore = relevant.reduce((sum, fact) => {
    if (fact.kind === "dasha") return sum + fact.strength * 0.20;
    if (fact.kind === "degree_hit") return sum + fact.strength * 0.25;
    if (fact.kind === "transit_house") return sum + fact.strength * 0.22;
    if (fact.kind === "transit_aspect") return sum + fact.strength * 0.18;
    if (fact.kind === "moon_trigger") return sum + fact.strength * 0.05;
    if (fact.kind === "nakshatra_link") return sum + fact.strength * 0.08;
    return sum;
  }, 0);

  const score = Math.min(100, Math.round(rawScore));

  return {
    area,
    score,
    level: levelFromScore(score, relevant.length),
    facts: relevant.sort((a, b) => b.strength - a.strength),
  };
}

export function scoreAllTriggerAreas(facts: TriggerFact[]): TriggerScore[] {
  const areas: EventArea[] = [
    "career",
    "money",
    "health",
    "relationship",
    "property",
    "travel",
    "education",
    "spiritual",
  ];

  return areas
    .map((area) => scoreTriggerArea(area, facts))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}