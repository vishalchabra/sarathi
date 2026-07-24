import type {
  AstrologyInfluence,
  PlanetName,
  SynthesizedPrediction,
  ZodiacSign,
} from "../types";

import { HOUSE_KNOWLEDGE } from "../knowledge/houses";
import { MOON_LORDSHIP_KNOWLEDGE } from "../knowledge/moonLordship";
import { MOON_CONDITION_RULES } from "../knowledge/moonCondition";
import { NAKSHATRA_KNOWLEDGE } from "../knowledge/nakshatras";
import { ordinal } from "../utils/ordinal";

export type DailySkyInput = {
  date: string;
  moon: {
    sign: ZodiacSign;
    degree?: number;
    nakshatra: string;
    pada?: number;
    nextNakshatra?: {
      name: string;
      time: string;
      pada?: number;
    };
    conjunctions?: PlanetName[];
    aspectsFrom?: PlanetName[];
  };
  planets?: Partial<
    Record<
      PlanetName,
      {
        sign: ZodiacSign;
        nakshatra?: string;
        degree?: number;
        retrograde?: boolean;
      }
    >
  >;
  specialNotes?: string[];
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

export function houseFromAscendant(
  ascendant: ZodiacSign,
  transitSign: ZodiacSign
): number {
  const ascIndex = SIGNS.indexOf(ascendant);
  const signIndex = SIGNS.indexOf(transitSign);

  if (ascIndex === -1 || signIndex === -1) {
    throw new Error(`Invalid ascendant/sign: ${ascendant}, ${transitSign}`);
  }

  return ((signIndex - ascIndex + 12) % 12) + 1;
}

export function synthesizeDailyPredictionForAscendant(
  input: DailySkyInput,
  ascendant: ZodiacSign
): SynthesizedPrediction {
  const moonHouse = houseFromAscendant(ascendant, input.moon.sign);
  const houseKnowledge = HOUSE_KNOWLEDGE[moonHouse];
  const moonLordship = MOON_LORDSHIP_KNOWLEDGE[ascendant];

  const influences: AstrologyInfluence[] = [];

  influences.push({
    id: `${ascendant}_moon_house_${moonHouse}`,
    source: "moon_house",
    area: houseKnowledge.primaryAreas[0],
    polarity: [6, 8, 12].includes(moonHouse) ? "challenging" : "mixed",
    intensity: [8].includes(moonHouse) ? 8 : [6, 12].includes(moonHouse) ? 6 : 7,
    confidence: 8,
    keywords: houseKnowledge.keywords,
    reasoning: `Moon transits the ${ordinal(moonHouse)} house for ${ascendant}, activating ${houseKnowledge.name}.`,
    advice: houseKnowledge.bestUse,
  });

  influences.push({
    id: `${ascendant}_moon_lordship_${moonLordship.moonLordshipHouse}`,
    source: "moon_lordship",
    area: moonLordship.primaryAreas[0],
    polarity: moonLordship.functionalNature,
    intensity: moonLordship.functionalNature === "supportive" ? 7 : 6,
    confidence: 8,
    keywords: moonLordship.ruledThemes,
    reasoning: moonLordship.interpretation,
  });

  const nakshatra = NAKSHATRA_KNOWLEDGE[input.moon.nakshatra];
  if (nakshatra) {
    influences.push({
      id: `${ascendant}_moon_nakshatra_${input.moon.nakshatra}`,
      source: "moon_nakshatra",
      area: nakshatra.primaryAreas[0],
      polarity: "mixed",
      intensity: 5,
      confidence: 7,
      keywords: nakshatra.keywords,
      reasoning: `Moon is in ${nakshatra.name}, bringing themes of ${nakshatra.keywords
        .slice(0, 3)
        .join(", ")}.`,
      advice: nakshatra.bestUse,
    });
  }

  for (const planet of input.moon.conjunctions ?? []) {
    addMoonContactInfluence(influences, ascendant, planet, "conjunction");
  }

  for (const planet of input.moon.aspectsFrom ?? []) {
    addMoonContactInfluence(influences, ascendant, planet, "aspect");
  }

  const opportunities = influences.filter((x) => x.polarity === "supportive");
  const cautions = influences.filter((x) => x.polarity === "challenging");
  const neutralThemes = influences.filter(
    (x) => x.polarity === "mixed" || x.polarity === "neutral"
  );

  const dominantAreas = getDominantAreas(influences);

  return {
    ascendant,
    date: input.date,
    moonHouse,
    moonLordship: moonLordship.moonLordshipHouse,
    dominantAreas,
    emotionalTone: buildEmotionalTone(input, moonHouse),
    opportunities,
    cautions,
    neutralThemes,
    finalMessage: buildFinalMessage({
      ascendant,
      moonHouse,
      moonLordshipHouse: moonLordship.moonLordshipHouse,
      houseName: houseKnowledge.name,
      hasSaturnContact: (input.moon.conjunctions ?? []).includes("Saturn"),
      nextNakshatra: input.moon.nextNakshatra,
    }),
    bestUse: houseKnowledge.bestUse,
  };
}

export function synthesizeDailyPredictions(
  input: DailySkyInput
): SynthesizedPrediction[] {
  return SIGNS.map((ascendant) =>
    synthesizeDailyPredictionForAscendant(input, ascendant)
  );
}

function addMoonContactInfluence(
  influences: AstrologyInfluence[],
  ascendant: ZodiacSign,
  planet: PlanetName,
  contactType: "conjunction" | "aspect"
) {
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
                : planet === "Mercury"
                  ? MOON_CONDITION_RULES.mercuryMoonContact
                  : null;

  if (!rule) return;

  influences.push({
    id: `${ascendant}_moon_${planet}_${contactType}`,
    source: "moon_condition",
    area: planet === "Saturn" || planet === "Rahu" || planet === "Ketu" ? "mind" : "career",
    polarity: rule.type === "support" ? "supportive" : "challenging",
    intensity: rule.intensity,
    confidence: rule.confidence,
    keywords: [planet, contactType, "Moon condition"],
    reasoning: rule.interpretation,
    advice: rule.advice,
  });
}

function getDominantAreas(influences: AstrologyInfluence[]) {
  const score = new Map<string, number>();

  for (const influence of influences) {
    score.set(
      influence.area,
      (score.get(influence.area) ?? 0) + influence.intensity
    );
  }

  return [...score.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([area]) => area as SynthesizedPrediction["dominantAreas"][number]);
}

function buildEmotionalTone(input: DailySkyInput, moonHouse: number): string {
  const hasSaturn = (input.moon.conjunctions ?? []).includes("Saturn");

  if (hasSaturn) {
    return "The emotional tone is serious, reflective, and responsibility-oriented.";
  }

  if ([6, 8, 12].includes(moonHouse)) {
    return "The emotional tone needs patience, caution, and conscious handling.";
  }

  return "The emotional tone is active but manageable.";
}

function buildFinalMessage(params: {
  ascendant: ZodiacSign;
  moonHouse: number;
  moonLordshipHouse: number;
  houseName: string;
  hasSaturnContact: boolean;
  nextNakshatra?: { name: string; time: string };
}): string {
  const {
    ascendant,
    moonHouse,
    moonLordshipHouse,
    houseName,
    hasSaturnContact,
    nextNakshatra,
  } = params;

  const timeLine = nextNakshatra
    ? ` The tone shifts after ${nextNakshatra.time} as Moon moves into ${nextNakshatra.name}.`
    : "";

  const saturnLine = hasSaturnContact
    ? " Saturn's influence makes the day more serious, so patience and maturity matter."
    : "";

  return `For ${ascendant}, Moon rules the ${ordinal(moonLordshipHouse)} house and transits the ${ordinal(moonHouse)} house, activating ${houseName.toLowerCase()}.${timeLine}${saturnLine}`;
}