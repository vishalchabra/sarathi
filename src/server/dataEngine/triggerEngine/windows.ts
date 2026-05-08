import type { TriggerScore, TriggerWindow } from "./types";
import { explainTriggerScore, shortTriggerTitle } from "./explain";

export function buildTriggerWindow(input: {
  areaScore: TriggerScore;
  startDate: string;
  endDate: string;
}): TriggerWindow {
  const { areaScore, startDate, endDate } = input;

  return {
    area: areaScore.area,
    startDate,
    endDate,
    score: areaScore.score,
    level: areaScore.level,
    title: shortTriggerTitle(areaScore),
    reasons: explainTriggerScore(areaScore),
  };
}