import type { DailySkyInput } from "../core/reasoningEngine";
import { judgeSky } from "../judgement/skyJudgementEngine";
import { judgeAllAscendants } from "../judgement/ascendantJudgementEngine";
import { buildAllAscendantNarratives } from "../narrative/narrativeEngine";

export function generateDailyPredictionContent(input: DailySkyInput) {
  const skyJudgement = judgeSky(input);
  const ascendantJudgements = judgeAllAscendants(input);
  const narratives = buildAllAscendantNarratives(ascendantJudgements);

  return {
    date: input.date,
    cosmicNarrative: {
      dominantEnergy: skyJudgement.dominantEnergy,
      energyShift: skyJudgement.energyShift,
      dominantThemes: skyJudgement.dominantThemes,
      globalAdvice: skyJudgement.globalAdvice,
      reasons: skyJudgement.reasons,
    },
    ascendants: narratives,
  };
}