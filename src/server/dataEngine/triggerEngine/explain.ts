import type { TriggerScore } from "./types";

export function explainTriggerScore(score: TriggerScore): string[] {
  return score.facts.slice(0, 4).map((fact) => fact.explanation);
}

export function shortTriggerTitle(score: TriggerScore): string {
  if (score.area === "career") {
    if (score.level === "very_high") return "Very strong career activation";
    if (score.level === "high") return "Strong career movement possible";
    if (score.level === "medium") return "Career area is active";
    return "Mild career activation";
  }

  return `${score.area} activation: ${score.level}`;
}