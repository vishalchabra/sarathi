import type { DailySkyInput } from "../core/reasoningEngine";
import { judgeSky } from "../judgement/skyJudgementEngine";
import { judgeAllAscendants } from "../judgement/ascendantJudgementEngine";
import { buildAllAscendantNarratives } from "../narrative/narrativeEngine";
import {
  enrichSkyInputWithPlanetContacts,
} from "../core/aspectResolver";
export function generateDailyPredictionContent(input: DailySkyInput) {
  const enrichedInput =
    enrichSkyInputWithPlanetContacts(input);

  const skyJudgement =
    judgeSky(enrichedInput);

  const ascendantJudgements =
    judgeAllAscendants(enrichedInput);
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