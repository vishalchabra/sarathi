import type { TriggerScore } from "./types";

export function getTopAreas(scores: TriggerScore[]) {
  return scores
    .filter((s) => s.score > 0)
    .slice(0, 3);
}