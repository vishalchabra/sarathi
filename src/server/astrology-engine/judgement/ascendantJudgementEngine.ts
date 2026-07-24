import type {
  AstrologyInfluence,
  LifeArea,
  PlanetName,
  ZodiacSign,
} from "../types";

import type { DailySkyInput } from "../core/reasoningEngine";
import { analyzeMoon } from "../analyzers/moonAnalyzer";
import { analyzeAscendantMoonTransit } from "../analyzers/ascendantAnalyzer";
import { judgeSky, type SkyJudgement } from "./skyJudgementEngine";
import { HOUSE_KNOWLEDGE } from "../knowledge/houses";
import { MOON_LORDSHIP_KNOWLEDGE } from "../knowledge/moonLordship";
import { NAKSHATRA_KNOWLEDGE } from "../knowledge/nakshatras";
import { MOON_CONDITION_RULES } from "../knowledge/moonCondition";
import { ordinal } from "../utils/ordinal";
import {
  LORDSHIP_PLACEMENT_KNOWLEDGE,
  lordshipPlacementKey,
} from "../knowledge/lordshipPlacements";
import {
  MOON_LORDSHIP_PLACEMENTS,
} from "../knowledge/moonLordshipPlacements";
export type ImportanceSource =
  | "sky_judgement"
  | "moon_house"
  | "moon_lordship"
  | "moon_condition"
  | "moon_nakshatra";

export type JudgementSignal = {
  id: string;
  source: ImportanceSource;
  area: LifeArea;
  polarity: "supportive" | "challenging" | "mixed" | "neutral";
  importance: number; // 1-100
  confidence: number; // 1-10
  message: string;
  advice?: string;
  reasons: string[];
};

export type AscendantJudgement = {
  ascendant: ZodiacSign;
  date: string;
  moonHouse: number;
  moonLordshipHouse: number;

  dominantMessage: string;
  dominantAreas: LifeArea[];

  opportunities: JudgementSignal[];
  cautions: JudgementSignal[];
  mixedThemes: JudgementSignal[];

  emotionalTheme: string;
  practicalAdvice: string;

  importanceBreakdown: {
    moonHouse: number;
    moonLordship: number;
    moonCondition: number;
    nakshatra: number;
    skyJudgement: number;
  };

  reasons: string[];
};

const SIGNS: ZodiacSign[] = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

export function judgeAscendant(
  input: DailySkyInput,
  ascendant: ZodiacSign,
  skyJudgement: SkyJudgement = judgeSky(input)
): AscendantJudgement {
  const moon = analyzeMoon(input.moon);
  const ascAnalysis = analyzeAscendantMoonTransit({
    ascendant,
    moonSign: input.moon.sign,
  });

  const house = HOUSE_KNOWLEDGE[ascAnalysis.moonHouse];
  const lordship = MOON_LORDSHIP_KNOWLEDGE[ascendant];
  const nakshatra = NAKSHATRA_KNOWLEDGE[input.moon.nakshatra];

  const signals: JudgementSignal[] = [];

  signals.push({
    id: `${ascendant}_sky_judgement`,
    source: "sky_judgement",
    area: skyJudgement.dominantThemes.includes("responsibility")
      ? "career"
      : "mind",
    polarity: skyJudgement.pressureScore > skyJudgement.supportScore ? "mixed" : "neutral",
    importance: 15,
    confidence: 8,
    message: skyJudgement.dominantEnergy,
    advice: skyJudgement.globalAdvice,
    reasons: skyJudgement.reasons,
  });

  signals.push({
    id: `${ascendant}_moon_house_${ascAnalysis.moonHouse}`,
    source: "moon_house",
    area: house.primaryAreas[0],
    polarity: getHousePolarity(ascAnalysis.moonHouse),
    importance: getMoonHouseImportance(ascAnalysis.moonHouse),
    confidence: 8,
    message: `The Moon activates ${house.name.toLowerCase()}.`,
    advice: house.bestUse,
    reasons: [
      `Moon is transiting ${input.moon.sign}.`,
      `${input.moon.sign} is the ${ordinal(ascAnalysis.moonHouse)} house from ${ascendant}.`,
      `This activates ${house.keywords.slice(0, 4).join(", ")}.`,
    ],
  });


  if (nakshatra) {
    signals.push({
      id: `${ascendant}_moon_nakshatra_${input.moon.nakshatra}`,
      source: "moon_nakshatra",
      area: nakshatra.primaryAreas[0],
      polarity: "mixed",
      importance: 12,
      confidence: 7,
      message: `${input.moon.nakshatra} adds ${nakshatra.keywords
        .slice(0, 3)
        .join(", ")} to the day.`,
      advice: nakshatra.bestUse,
      reasons: [
        `Moon is moving through ${input.moon.nakshatra}.`,
        `This nakshatra emphasizes ${nakshatra.supportiveThemes
          .slice(0, 3)
          .join(", ")}.`,
      ],
    });
  }
const placementKey = lordshipPlacementKey(
  lordship.moonLordshipHouse,
  ascAnalysis.moonHouse
);

const curatedPlacement =
  MOON_LORDSHIP_PLACEMENTS[placementKey];

const generatedPlacement =
  LORDSHIP_PLACEMENT_KNOWLEDGE[placementKey];

const lordshipPlacement =
  curatedPlacement ?? generatedPlacement;

if (lordshipPlacement) {
  const placementAny = lordshipPlacement as any;
  const isCurated = "dailyExpression" in placementAny;

  signals.push({
    id: `${ascendant}_lordship_placement_${placementKey}`,
    source: "moon_lordship",
    area: placementAny.areas[0],
    polarity: "mixed",
    importance: isCurated ? 40 : 36,
    confidence: placementAny.confidence ?? 8,

    message: placementAny.dailyExpression ?? placementAny.synthesis,

    advice: placementAny.bestUse ?? placementAny.advice,

    reasons: [
      `Moon rules the ${ordinal(lordship.moonLordshipHouse)} house for ${ascendant}.`,
      `Moon is transiting the ${ordinal(ascAnalysis.moonHouse)} house from ${ascendant}.`,
      placementAny.principle,
      placementAny.synthesis,
    ],
  });
}
  for (const planet of moon.pressurePlanets) {
    signals.push(buildMoonConditionSignal(ascendant, planet, "challenging"));
  }

  for (const planet of moon.supportPlanets) {
    signals.push(buildMoonConditionSignal(ascendant, planet, "supportive"));
  }

  const rankedSignals = signals.sort((a, b) => b.importance - a.importance);

  const opportunities = rankedSignals.filter((x) => x.polarity === "supportive");
  const cautions = rankedSignals.filter((x) => x.polarity === "challenging");
  const mixedThemes = rankedSignals.filter(
    (x) => x.polarity === "mixed" || x.polarity === "neutral"
  );

  const dominantAreas = getDominantAreas(rankedSignals);
  const dominantSignal = rankedSignals[0];

  return {
    ascendant,
    date: input.date,
    moonHouse: ascAnalysis.moonHouse,
    moonLordshipHouse: lordship.moonLordshipHouse,

    dominantMessage: buildDominantMessage({
      ascendant,
      dominantSignal,
      skyJudgement,
      houseName: house.name,
      moonHouse: ascAnalysis.moonHouse,
      nextNakshatra: input.moon.nextNakshatra,
    }),

    dominantAreas,

    opportunities,
    cautions,
    mixedThemes,

    emotionalTheme: buildEmotionalTheme({
      moonCondition: moon.condition,
      hasSaturn: moon.pressurePlanets.includes("Saturn"),
      moonHouse: ascAnalysis.moonHouse,
    }),

    practicalAdvice: choosePracticalAdvice({
      rankedSignals,
      skyJudgement,
      houseAdvice: house.bestUse,
    }),

    importanceBreakdown: {
      moonHouse: getSignalImportance(rankedSignals, "moon_house"),
      moonLordship: getSignalImportance(rankedSignals, "moon_lordship"),
      moonCondition: sumSignalImportance(rankedSignals, "moon_condition"),
      nakshatra: getSignalImportance(rankedSignals, "moon_nakshatra"),
      skyJudgement: getSignalImportance(rankedSignals, "sky_judgement"),
    },

    reasons: rankedSignals.flatMap((signal) => signal.reasons).slice(0, 8),
  };
}

export function judgeAllAscendants(input: DailySkyInput): AscendantJudgement[] {
  const sky = judgeSky(input);
  return SIGNS.map((ascendant) => judgeAscendant(input, ascendant, sky));
}

function getHousePolarity(
  house: number
): JudgementSignal["polarity"] {
  if ([6, 8, 12].includes(house)) return "challenging";
  if ([1, 5, 9, 10, 11].includes(house)) return "supportive";
  return "mixed";
}

function getMoonHouseImportance(house: number): number {
  if (house === 8) return 38;
  if ([6, 12].includes(house)) return 34;
  if ([1, 10].includes(house)) return 32;
  if ([5, 9, 11].includes(house)) return 30;
  return 26;
}

function getMoonLordshipImportance(
  nature: "supportive" | "challenging" | "mixed"
): number {
  if (nature === "supportive") return 22;
  if (nature === "challenging") return 24;
  return 20;
}

function buildMoonConditionSignal(
  ascendant: ZodiacSign,
  planet: PlanetName,
  polarity: "supportive" | "challenging"
): JudgementSignal {
  const rule =
    planet === "Saturn"
      ? MOON_CONDITION_RULES.saturnMoonContact
      : planet === "Mars"
        ? MOON_CONDITION_RULES.marsMoonContact
        : planet === "Rahu"
          ? MOON_CONDITION_RULES.rahuMoonContact
          : planet === "Ketu"
            ? MOON_CONDITION_RULES.ketuMoonContact
            : planet === "Jupiter"
              ? MOON_CONDITION_RULES.jupiterMoonContact
              : planet === "Venus"
                ? MOON_CONDITION_RULES.venusMoonContact
                : MOON_CONDITION_RULES.mercuryMoonContact;

  return {
    id: `${ascendant}_moon_${planet}_condition`,
    source: "moon_condition",
    area: planet === "Saturn" || planet === "Rahu" || planet === "Ketu" ? "mind" : "career",
    polarity,
    importance: planet === "Saturn" ? 18 : 16,
    confidence: rule.confidence,
    message: rule.interpretation,
    advice: rule.advice,
    reasons: [
      `${planet} is influencing the Moon.`,
      rule.interpretation,
    ],
  };
}

function getDominantAreas(signals: JudgementSignal[]): LifeArea[] {
  const score = new Map<LifeArea, number>();

  for (const signal of signals) {
    score.set(signal.area, (score.get(signal.area) ?? 0) + signal.importance);
  }

  return [...score.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([area]) => area);
}

function buildDominantMessage(params: {
  ascendant: ZodiacSign;
  dominantSignal: JudgementSignal;
  skyJudgement: SkyJudgement;
  houseName: string;
  moonHouse: number;
  nextNakshatra?: {
    name: string;
    time: string;
    pada?: number;
  };
}): string {
  const shift = params.nextNakshatra
    ? ` The tone shifts after ${params.nextNakshatra.time}, but the same life area remains active.`
    : "";

  return `${params.ascendant} experiences today's ${params.skyJudgement.dominantEnergy.toLowerCase()} through the ${ordinal(params.moonHouse)} house of ${params.houseName.toLowerCase()}.${shift}`;
}

function buildEmotionalTheme(params: {
  moonCondition: "supported" | "pressured" | "mixed" | "neutral";
  hasSaturn: boolean;
  moonHouse: number;
}): string {
  if (params.hasSaturn) {
    return "Emotionally, the day feels more serious and reflective. Patience will work better than quick reactions.";
  }

  if (params.moonCondition === "pressured") {
    return "Emotionally, the day needs conscious handling. Avoid reacting before you understand the full situation.";
  }

  if ([6, 8, 12].includes(params.moonHouse)) {
    return "Emotionally, the day may feel slightly inward or demanding, so avoid overextending yourself.";
  }

  return "Emotionally, the day is manageable when handled with awareness and steadiness.";
}

function choosePracticalAdvice(params: {
  rankedSignals: JudgementSignal[];
  skyJudgement: SkyJudgement;
  houseAdvice: string;
}): string {
  const topAdvice = params.rankedSignals.find((x) => x.advice)?.advice;

  if (topAdvice) return topAdvice;

  return params.skyJudgement.globalAdvice || params.houseAdvice;
}

function getSignalImportance(
  signals: JudgementSignal[],
  source: ImportanceSource
): number {
  return signals.find((x) => x.source === source)?.importance ?? 0;
}

function sumSignalImportance(
  signals: JudgementSignal[],
  source: ImportanceSource
): number {
  return signals
    .filter((x) => x.source === source)
    .reduce((sum, signal) => sum + signal.importance, 0);
}