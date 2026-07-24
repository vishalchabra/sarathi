import type { LifeArea, ZodiacSign } from "../types";
import type {
  AscendantJudgement,
  JudgementSignal,
} from "../judgement/ascendantJudgementEngine";

export type AscendantNarrative = {
  ascendant: ZodiacSign;
  date: string;
  headline: string;
  story: string;
  whatMightHappen: string[];
  cautions: string[];
  bestUse: string;
  why: string[];
  dominantAreas: LifeArea[];
};

export function buildAscendantNarrative(
  judgement: AscendantJudgement
): AscendantNarrative {
  const topSignals = getTopSignals(judgement);

  return {
    ascendant: judgement.ascendant,
    date: judgement.date,
    headline: buildHeadline(judgement),
    story: buildStory(judgement, topSignals),
    whatMightHappen: buildWhatMightHappen(judgement, topSignals),
    cautions: buildCautions(judgement),
    bestUse: judgement.practicalAdvice,
    why: judgement.reasons.slice(0, 5),
    dominantAreas: judgement.dominantAreas,
  };
}

export function buildAllAscendantNarratives(
  judgements: AscendantJudgement[]
): AscendantNarrative[] {
  return judgements.map(buildAscendantNarrative);
}

function getTopSignals(judgement: AscendantJudgement): JudgementSignal[] {
  return [
    ...judgement.opportunities,
    ...judgement.cautions,
    ...judgement.mixedThemes,
  ]
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 3);
}

function buildHeadline(judgement: AscendantJudgement): string {
  const area = judgement.dominantAreas[0];

const map: Record<LifeArea, string> = {
  career: "Career and responsibility take focus",
  money: "Money and practical choices need attention",
  relationships: "Relationships need maturity and balance",
  health: "Health and routine need care",
  mind: "Emotional clarity becomes important",
  family: "Family matters may need attention",
  home: "Home and inner peace take focus",
  children: "Creativity and children-related matters activate",
  travel: "Travel and movement need planning",
  spirituality: "Reflection and guidance become important",
  education: "Learning and clarity are supported",
  publicImage: "Visibility and reputation matter today",
  hiddenMatters: "Private matters need careful handling",
  communication: "Communication and practical effort take focus",
  property: "Property and stability need attention",
};

  return map[area] ?? "A thoughtful day for steady choices";
}

function buildStory(
  judgement: AscendantJudgement,
  topSignals: JudgementSignal[]
): string {
  const main = buildOpening({
  ascendant: judgement.ascendant,
  moonHouse: judgement.moonHouse,
  houseName: judgement.dominantAreas[0],
});
  const emotional = judgement.emotionalTheme;

  const signalLine = topSignals[0]?.message
    ? ` The strongest signal is: ${topSignals[0].message}`
    : "";

  return `${main} ${emotional}${signalLine}`;
}

function buildWhatMightHappen(
  judgement: AscendantJudgement,
  topSignals: JudgementSignal[]
): string[] {
  const items: string[] = [];

  for (const signal of topSignals) {
    if (signal.id.includes("_moon_lordship_")) continue;
    items.push(signal.message);
  }

  if (items.length < 3) {
    items.push(judgement.practicalAdvice);
  }

  return dedupe(items).slice(0, 3);
}

function buildCautions(judgement: AscendantJudgement): string[] {
  const cautions = judgement.cautions.map((x) => x.advice ?? x.message);

  if (cautions.length === 0) {
    return ["Avoid rushing decisions. Stay practical and emotionally aware."];
  }

  return dedupe(cautions).slice(0, 2);
}

function dedupe(items: string[]): string[] {
  return [...new Set(items)];
}
function buildOpening(params: {
  ascendant: string;
  moonHouse: number;
  houseName: string;
}): string {
  switch (params.moonHouse) {
    case 1:
      return `${params.ascendant}'s focus turns inward today as the Moon activates self and direction.`;
    case 2:
      return `Money, family and important conversations take centre stage today.`;
    case 3:
      return `Communication, effort and follow-ups become important today.`;
    case 4:
      return `Home, comfort and emotional stability take focus today.`;
    case 5:
      return `Creativity, learning and heartfelt expression become more active today.`;
    case 6:
      return `Workload, routine and small responsibilities need practical attention today.`;
    case 7:
      return `Relationships, clients and one-to-one conversations need maturity today.`;
    case 8:
      return `Private emotions and deeper matters need careful handling today.`;
    case 9:
      return `Guidance, learning and broader perspective become important today.`;
    case 10:
      return `Career, responsibility and public decisions take focus today.`;
    case 11:
      return `Networks, gains and long-term goals become more active today.`;
    case 12:
      return `Rest, reflection and emotional release become important today.`;
    default:
      return `${params.houseName} becomes active today.`;
  }
}