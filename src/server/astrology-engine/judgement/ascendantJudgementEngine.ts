import type {
  AstrologyInfluence,
  LifeArea,
  PlanetName,
  ZodiacSign,
} from "../types";

import {
  houseFromAscendant,
  type DailySkyInput,
} from "../core/reasoningEngine";
import { analyzeMoon } from "../analyzers/moonAnalyzer";
import { analyzeAscendantMoonTransit } from "../analyzers/ascendantAnalyzer";
import { judgeSky, type SkyJudgement } from "./skyJudgementEngine";
import { HOUSE_KNOWLEDGE } from "../knowledge/houses";
import { MOON_LORDSHIP_KNOWLEDGE } from "../knowledge/moonLordship";
import { PLANET_NATURE } from "../knowledge/planetNature";
import { PLANET_HOUSE_PLACEMENTS } from "../knowledge/planetHousePlacements";
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
import { getPlanetLordships } from "../knowledge/planetLordships";
import {
  getPlanetDignityInterpretation,
} from "../knowledge/planetDignity";
import {
  getPlanetContactInterpretation,
} from "../knowledge/planetContacts";
import {
  getFunctionalPlanetRole,
} from "../knowledge/functionalPlanetRoles";
export type ImportanceSource =
  | "sky_judgement"
  | "moon_house"
  | "moon_lordship"
  | "moon_condition"
  | "moon_nakshatra"
  | "planet_house"
  | "planet_lordship"
  | "planet_contact"
  | "planet_synthesis";

export type JudgementSignal = {
  id: string;
  source: ImportanceSource;
  area: LifeArea;

  planet?: PlanetName;
  transitHouse?: number;
  polarity: "supportive" | "challenging" | "mixed" | "neutral";
  importance: number; // 1-100
  confidence: number; // 1-10
  message: string;
  advice?: string;
  reasons: string[];
};
export type PlanetSynthesis = {
  planet: PlanetName;

  house: number;

  baseSignal: JudgementSignal | null;
  lordshipSignals: JudgementSignal[];
  contactSignals: JudgementSignal[];

  polarity:
    | "supportive"
    | "challenging"
    | "mixed"
    | "neutral";

  score: number;
  importance: number;
  message: string;
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
  signals: JudgementSignal[];
  planetSyntheses: PlanetSynthesis[];
  rankedSignals: JudgementSignal[];
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
  const moonDignity =
  getPlanetDignityInterpretation(
    "Moon",
    input.moon.sign
  );
  const ascAnalysis = analyzeAscendantMoonTransit({
    ascendant,
    moonSign: input.moon.sign,
  });

  const house = HOUSE_KNOWLEDGE[ascAnalysis.moonHouse];
  const lordship = MOON_LORDSHIP_KNOWLEDGE[ascendant];
  const nakshatra = NAKSHATRA_KNOWLEDGE[input.moon.nakshatra];

  const signals: JudgementSignal[] = [];
  const processedConjunctions = new Set<string>();
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
  planet: "Moon",
  transitHouse: ascAnalysis.moonHouse,
    polarity: getHousePolarity(ascAnalysis.moonHouse),
    importance: getMoonHouseImportance(ascAnalysis.moonHouse),
    confidence: 8,
    message: `The Moon activates ${house.name.toLowerCase()}.`,
    advice: house.bestUse,
    reasons: [
      `Moon is transiting ${input.moon.sign}.`,
      `${input.moon.sign} is the ${ordinal(ascAnalysis.moonHouse)} house from ${ascendant}.`,
      `Moon is ${moonDignity.dignity.replace(
  /_/g,
  " "
)} in ${input.moon.sign}, with dignity strength ${moonDignity.strength}/10.`,
moonDignity.principle,
      `This activates ${house.keywords.slice(0, 4).join(", ")}.`,
    ],
  });


  if (nakshatra) {
  for (
    const area of
    nakshatra.primaryAreas
  ) {
    signals.push({
      id:
        `${ascendant}_moon_nakshatra_` +
        `${input.moon.nakshatra}_` +
        `${area}`,

      source:
        "moon_nakshatra",

      area,

      planet:
        "Moon",

      polarity:
        "mixed",

      importance:
        12,

      confidence:
        7,

      message:
        `${input.moon.nakshatra} adds ` +
        `${nakshatra.keywords
          .slice(0, 3)
          .join(", ")} to the day.`,

      advice:
        nakshatra.bestUse,

      reasons: [
        `Moon is moving through ${input.moon.nakshatra}.`,
        `This nakshatra emphasizes ${nakshatra.supportiveThemes
          .slice(0, 3)
          .join(", ")}.`,
      ],
    });
  }
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
  planet: "Moon",
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
for (const [planetName, planetData] of Object.entries(input.planets ?? {})) {
  const planet = planetName as PlanetName;

  // Moon already has its own dedicated logic in this engine.
  if (planet === "Moon") continue;

  if (!planetData?.sign) continue;

  const planetHouse = houseFromAscendant(ascendant, planetData.sign);
  const functionalRole = getFunctionalPlanetRole(
  ascendant,
  planet as PlanetName
);

  const ruledHouses = getPlanetLordships(ascendant, planet);
  const placementKey = `${planet.toLowerCase()}_in_${planetHouse}`;

  const placementKnowledge =
    PLANET_HOUSE_PLACEMENTS[placementKey];

  const planetNature =
    PLANET_NATURE[planet.toLowerCase()];
  const dignity =
  getPlanetDignityInterpretation(
    planet,
    planetData.sign
  );
  const planetHouseBasePolarity =
  getPlanetHouseBasePolarity({
    planet: planet as PlanetName,
    functionalRoles:
      functionalRole?.roles ?? [],
    dignityStrength: dignity.strength,
    house: planetHouse,
  });
  const conjunctionContacts =
  (planetData.conjunctions ?? [])
    .filter(
  (contactPlanet) =>
    contactPlanet !== planet &&
    contactPlanet !== "Moon"
)
    .map((contactPlanet) =>
      getPlanetContactInterpretation(
        planet,
        contactPlanet,
        "conjunction"
      )
    );
    const aspectContacts =
  (planetData.aspectsFrom ?? [])
    .filter(
  (contactPlanet) =>
    contactPlanet !== planet &&
    contactPlanet !== "Moon"
)
    .map((contactPlanet) =>
      getPlanetContactInterpretation(
        planet,
        contactPlanet,
        "aspect"
      )
    );
  const lordshipPlacements = ruledHouses
  .map((ruledHouse) => {
    const key = lordshipPlacementKey(
      ruledHouse,
      planetHouse
    );

    return LORDSHIP_PLACEMENT_KNOWLEDGE[key];
  })
  .filter(Boolean);
  if (!placementKnowledge) continue;

  signals.push({
    id: `${ascendant}_${placementKey}`,
    source: "planet_house",
    area: placementKnowledge.areas[0],
    polarity: planetHouseBasePolarity.polarity,
    importance: getPlanetHouseImportance(
  planet as PlanetName,
  planetHouse,
  dignity.strength,
  getFunctionalRoleImportanceModifier(
    functionalRole?.roles ?? []
  )
),
    confidence: placementKnowledge.confidence,

    message: placementKnowledge.dailyExpression,

    advice: placementKnowledge.bestUse,

    reasons: [
  `${planet} is transiting ${planetData.sign}, which is the ${ordinal(
    planetHouse
  )} house from ${ascendant}.`,
  planetNature?.coreNature
    ? `${planet} naturally represents ${planetNature.coreNature}.`
    : `${planet} is active in this house.`,
  `${planet} is ${dignity.dignity.replace(
    /_/g,
    " "
  )} in ${planetData.sign}, with dignity strength ${dignity.strength}/10.`,
  placementKnowledge.principle,
  placementKnowledge.synthesis,

  describeFunctionalPlanetRoles(
    planet as PlanetName,
    ascendant,
    functionalRole?.roles ?? []
  ),
  describePlanetHouseBasePolarity({
  planet: planet as PlanetName,
  functionalRoles:
    functionalRole?.roles ?? [],
  dignityStrength: dignity.strength,
  house: planetHouse,
}),
].filter((reason): reason is string => Boolean(reason)),
  });
  for (const contact of conjunctionContacts) {
  const conjunctionKey = [planet, contact.contactPlanet]
    .map((name) => name.toLowerCase())
    .sort()
    .join("_conjunction_");

  if (processedConjunctions.has(conjunctionKey)) {
    continue;
  }

  processedConjunctions.add(conjunctionKey);

  signals.push({
  id: `${ascendant}_${conjunctionKey}`,
  source: "planet_contact",
  area: placementKnowledge.areas[0],
  polarity: contact.effect,
  importance: 14,
  confidence: contact.confidence,

  message: contact.dailyExpression,
  advice: contact.bestUse,

  reasons: [
    `${planet} is conjunct ${contact.contactPlanet}.`,
    contact.principle,
    contact.synthesis,
  ],
});
}
for (const contact of aspectContacts) {
  signals.push({
    id: `${ascendant}_${planet.toLowerCase()}_aspected_by_${contact.contactPlanet.toLowerCase()}`,
    source: "planet_contact",
    area: placementKnowledge.areas[0],
    polarity: contact.effect,
    importance: 13,
    confidence: contact.confidence,

    message: contact.dailyExpression,
    advice: contact.bestUse,

    reasons: [
      `${planet} receives an aspect from ${contact.contactPlanet}.`,
      contact.principle,
      contact.synthesis,
    ],
  });
}
  for (const lordshipPlacement of lordshipPlacements) {
    const planetLordshipPolarity =
  getPlanetLordshipPolarity({
    planet: planet as PlanetName,
    dignityStrength: dignity.strength,
    lordshipHouse:
      lordshipPlacement.lordshipHouse,
    placementHouse: planetHouse,
  });
  signals.push({
    id: `${ascendant}_${planet.toLowerCase()}_${lordshipPlacement.key}`,
    source: "planet_lordship",
    area: lordshipPlacement.areas[0],
    polarity: planetLordshipPolarity.polarity,
    importance: 20,
    confidence: 8,

    message: lordshipPlacement.synthesis,

    advice: lordshipPlacement.advice,

    reasons: [
  `${planet} rules the ${ordinal(
    lordshipPlacement.lordshipHouse
  )} house for ${ascendant}.`,
  `${planet} is transiting the ${ordinal(
    planetHouse
  )} house from ${ascendant}.`,
  lordshipPlacement.principle,
  lordshipPlacement.synthesis,

  describePlanetLordshipPolarity({
    planet: planet as PlanetName,
    dignityStrength: dignity.strength,
    lordshipHouse:
      lordshipPlacement.lordshipHouse,
    placementHouse: planetHouse,
  }),
],
  });
}
}

  for (const planet of moon.pressurePlanets) {
    signals.push(buildMoonConditionSignal(ascendant, planet, "challenging"));
  }

  for (const planet of moon.supportPlanets) {
    signals.push(buildMoonConditionSignal(ascendant, planet, "supportive"));
  }
  const planetSyntheses: PlanetSynthesis[] = [];

for (const [planetName, planetData] of Object.entries(
  input.planets ?? {}
)) {
  const planet = planetName as PlanetName;

  if (planet === "Moon") continue;
  if (!planetData?.sign) continue;

  const planetHouse =
    houseFromAscendant(
      ascendant,
      planetData.sign
    );

  planetSyntheses.push(
    buildPlanetSynthesis({
      planet,
      house: planetHouse,
      signals,
    })
  );
}
const planetSynthesisSignals =
  planetSyntheses.map(
    planetSynthesisToSignal
  );

const rankingSignals = [
  ...signals.filter(
    (signal) =>
      signal.source !== "planet_house" &&
      signal.source !== "planet_lordship" &&
      signal.source !== "planet_contact"
  ),
  ...planetSynthesisSignals,
];
  const rankedSignals =
  rankingSignals.sort(
    (a, b) => b.importance - a.importance
  );

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
  hasSupport: moon.supportPlanets.length > 0,
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
    signals,
    planetSyntheses,
    rankedSignals,
  };
}

export function judgeAllAscendants(input: DailySkyInput): AscendantJudgement[] {
  const sky = judgeSky(input);
  return SIGNS.map((ascendant) => judgeAscendant(input, ascendant, sky));
}
function polarityToScore(
  polarity: JudgementSignal["polarity"]
): number {
  if (polarity === "supportive") {
    return 1;
  }

  if (polarity === "challenging") {
    return -1;
  }

  return 0;
}
function getPlanetContactSynthesisScore(
  signal: JudgementSignal
): number {
  if (signal.source !== "planet_contact") {
    return 0;
  }

  return polarityToScore(signal.polarity);
}
const PLANET_SYNTHESIS_WEIGHTS = {
  base: 3,
  lordship: 1,
  contact: 1,
} as const;
function buildPlanetSynthesisMessage(params: {
  planet: PlanetName;
  house: number;
  polarity: PlanetSynthesis["polarity"];
  baseSignal: JudgementSignal | null;
  lordshipSignals: JudgementSignal[];
  contactSignals: JudgementSignal[];
}): string {
  const baseMessage =
    params.baseSignal?.message ??
    `${params.planet} is active in the ${ordinal(
      params.house
    )} house.`;

  if (
    params.lordshipSignals.length === 0 &&
    params.contactSignals.length === 0
  ) {
    return baseMessage;
  }

  if (params.polarity === "supportive") {
    return `${baseMessage} The wider planetary context supports a constructive expression of this transit.`;
  }

  if (params.polarity === "challenging") {
    return `${baseMessage} The wider planetary context adds pressure, so this transit needs more deliberate handling.`;
  }

  if (params.contactSignals.some(
  (signal) => signal.polarity === "supportive"
)) {
  return `${baseMessage} A supportive planetary interaction adds perspective or opportunity, although the overall transit remains balanced rather than strongly favourable.`;
}

if (params.contactSignals.some(
  (signal) => signal.polarity === "challenging"
)) {
  return `${baseMessage} Additional planetary pressure makes careful judgement important, although the overall transit remains mixed rather than strongly difficult.`;
}

return `${baseMessage} The broader context remains balanced, so the outcome will depend more on how the situation is handled than on a strongly supportive or difficult trend.`;
}
function planetSynthesisToSignal(
  synthesis: PlanetSynthesis
): JudgementSignal {
  return {
    id: `planet_synthesis_${synthesis.planet.toLowerCase()}`,
    source: "planet_synthesis",

    planet: synthesis.planet,
    transitHouse: synthesis.house,
    area:
      synthesis.baseSignal?.area ??
      "mind",
    polarity: synthesis.polarity,
    importance: synthesis.importance,
    confidence:
      synthesis.baseSignal?.confidence ?? 8,
    message: synthesis.message,
    advice:
      synthesis.baseSignal?.advice,
    reasons: synthesis.reasons,
  };
}
function buildPlanetSynthesis(params: {
  planet: PlanetName;
  house: number;
  signals: JudgementSignal[];
}): PlanetSynthesis {
  const planetPrefix =
    `_${params.planet.toLowerCase()}_`;

  const planetSignals = params.signals.filter(
    (signal) =>
      signal.id.includes(planetPrefix)
  );

  const baseSignal =
    planetSignals.find(
      (signal) =>
        signal.source === "planet_house"
    ) ?? null;

  const lordshipSignals =
    planetSignals.filter(
      (signal) =>
        signal.source === "planet_lordship"
    );

  const contactSignals =
  params.signals.filter((signal) => {
    if (signal.source !== "planet_contact") {
      return false;
    }

    const signalId = signal.id.toLowerCase();
    const planetName =
      params.planet.toLowerCase();

    // Directional aspects belong to the planet
    // receiving the aspect.
    if (signalId.includes("_aspected_by_")) {
      return signalId.includes(
        `_${planetName}_aspected_by_`
      );
    }

    // Conjunctions belong to both planets,
    // regardless of alphabetical ID normalization.
    if (signalId.includes("_conjunction_")) {
      const conjunctionPart =
        signalId.split("_").slice(1);

      return conjunctionPart.includes(
        planetName
      );
    }

    return false;
  });
const baseScore =
  baseSignal
    ? polarityToScore(baseSignal.polarity) *
      PLANET_SYNTHESIS_WEIGHTS.base
    : 0;

const lordshipScore =
  lordshipSignals.reduce(
    (total, signal) =>
      total +
      polarityToScore(signal.polarity) *
        PLANET_SYNTHESIS_WEIGHTS.lordship,
    0
  );

const contactScore =
  contactSignals.reduce(
    (total, signal) =>
      total +
      getPlanetContactSynthesisScore(signal) *
        PLANET_SYNTHESIS_WEIGHTS.contact,
    0
  );

const score =
  baseScore +
  lordshipScore +
  contactScore;
  let polarity: PlanetSynthesis["polarity"] =
  "mixed";

if (score >= 3) {
  polarity = "supportive";
} else if (score <= -3) {
  polarity = "challenging";
}
const message =
  buildPlanetSynthesisMessage({
    planet: params.planet,
    house: params.house,
    polarity,
    baseSignal,
    lordshipSignals,
    contactSignals,
  });
  const baseImportance =
  baseSignal?.importance ?? 0;

const strongestLordshipImportance =
  lordshipSignals.length > 0
    ? Math.max(
        ...lordshipSignals.map(
          (signal) => signal.importance
        )
      )
    : 0;

const strongestContactImportance =
  contactSignals.length > 0
    ? Math.max(
        ...contactSignals.map(
          (signal) => signal.importance
        )
      )
    : 0;

const lordshipBoost =
  strongestLordshipImportance >= 20
    ? 3
    : strongestLordshipImportance >= 15
    ? 2
    : strongestLordshipImportance > 0
    ? 1
    : 0;

const contactBoost =
  strongestContactImportance >= 14
    ? 2
    : strongestContactImportance > 0
    ? 1
    : 0;

const importance =
  Math.min(
    100,
    baseImportance +
      lordshipBoost +
      contactBoost
  );
const reasons = [
  `Base planet contribution: ${baseScore}.`,
  `Lordship contribution: ${lordshipScore}.`,
  `Contact contribution: ${contactScore}.`,
  `Planet synthesis score: ${score}.`,
  `${params.planet} is judged ${polarity} overall in the current transit synthesis.`,
];
  return {
    planet: params.planet,
    house: params.house,

    baseSignal,
    lordshipSignals,
    contactSignals,

    polarity,
    score,
    importance,
    message,
    reasons,
  };
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
function describeFunctionalPlanetRoles(
  planet: PlanetName,
  ascendant: ZodiacSign,
  roles: string[]
): string | null {
  if (roles.length === 0) {
    return null;
  }

  const descriptions: string[] = [];

  if (roles.includes("yogakaraka")) {
    descriptions.push("a yogakaraka");
  }

  if (roles.includes("lagna_lord")) {
    descriptions.push("the ascendant lord");
  }

  if (roles.includes("functional_benefic")) {
    descriptions.push("functionally benefic");
  }

  if (roles.includes("functional_malefic")) {
    descriptions.push("functionally challenging");
  }

  if (roles.includes("maraka")) {
    descriptions.push("connected with classical maraka houses");
  }

  if (descriptions.length === 0) {
    return null;
  }

  return `${planet} is ${descriptions.join(
    ", "
  )} for ${ascendant} ascendant.`;
}
function getFunctionalRoleImportanceModifier(
  roles: string[]
): number {
  let modifier = 0;

  if (roles.includes("yogakaraka")) {
    modifier += 4;
  }

  if (roles.includes("lagna_lord")) {
    modifier += 3;
  }

  if (roles.includes("functional_benefic")) {
    modifier += 2;
  }

  if (roles.includes("functional_malefic")) {
    modifier += 2;
  }

  if (roles.includes("maraka")) {
    modifier += 1;
  }

  return modifier;
}
function getFunctionalRolePolarityScore(
  roles: string[]
): number {
  let score = 0;

  if (roles.includes("yogakaraka")) {
    score += 2;
  }

  if (roles.includes("functional_benefic")) {
    score += 1;
  }

  if (roles.includes("functional_malefic")) {
    score -= 1;
  }

  // Lagna lord increases significance,
  // but is not automatically positive or negative.
  if (roles.includes("lagna_lord")) {
    score += 0;
  }

  // Maraka status is structurally important,
  // but should not automatically make a daily transit negative.
  if (roles.includes("maraka")) {
    score += 0;
  }

  return score;
}
function getDignityPolarityScore(
  dignityStrength: number
): number {
  if (dignityStrength >= 9) {
    return 2;
  }

  if (dignityStrength >= 7) {
    return 1;
  }

  if (dignityStrength <= 3) {
    return -2;
  }

  if (dignityStrength <= 4) {
    return -1;
  }

  return 0;
}
function getHousePlacementPolarityScore(
  house: number
): number {
  if ([5, 9, 11].includes(house)) {
    return 2;
  }

  if ([1, 3, 4, 7, 10].includes(house)) {
    return 1;
  }

  if ([8, 12].includes(house)) {
    return -2;
  }

  // 2nd and 6th are deliberately neutral here.
  // Their manifestation depends more heavily on
  // lordship, dignity, planet nature and contacts.
  return 0;
}
function getLordshipPlacementPolarityScore(
  lordshipHouse: number,
  placementHouse: number
): number {
  let score = 0;

  // Trinal lordships generally carry constructive potential.
  if ([5, 9].includes(lordshipHouse)) {
    score += 2;
  }

  // Lagna lordship is personally significant,
  // but not automatically strongly positive.
  if (lordshipHouse === 1) {
    score += 1;
  }

  // Dusthana ownership introduces challenge or
  // problem-solving themes.
  if ([6, 8, 12].includes(lordshipHouse)) {
    score -= 1;
  }

  // Placement into trinal or gain-oriented houses
  // gives the lordship a more constructive outlet.
  if ([5, 9, 11].includes(placementHouse)) {
    score += 1;
  }

  // Placement into transformative or withdrawal houses
  // makes manifestation more demanding.
  if ([8, 12].includes(placementHouse)) {
    score -= 1;
  }

  return score;
}
function getPlanetLordshipPolarity(params: {
  planet: PlanetName;
  dignityStrength: number;
  lordshipHouse: number;
  placementHouse: number;
}): {
  polarity: JudgementSignal["polarity"];
  score: number;
} {
  // Rahu and Ketu do not participate in the
  // classical house-lordship model used here.
  if (
    params.planet === "Rahu" ||
    params.planet === "Ketu"
  ) {
    return {
      polarity: "mixed",
      score: 0,
    };
  }



  const dignityScore =
    getDignityPolarityScore(
      params.dignityStrength
    );

  const lordshipPlacementScore =
    getLordshipPlacementPolarityScore(
      params.lordshipHouse,
      params.placementHouse
    );

  const score =
  dignityScore +
  lordshipPlacementScore;

  let polarity: JudgementSignal["polarity"] =
    "mixed";

  if (score >= 3) {
    polarity = "supportive";
  } else if (score <= -3) {
    polarity = "challenging";
  }

  return {
    polarity,
    score,
  };
}
function describePlanetLordshipPolarity(params: {
  planet: PlanetName;
  dignityStrength: number;
  lordshipHouse: number;
  placementHouse: number;
}): string {


  const dignityScore =
    getDignityPolarityScore(
      params.dignityStrength
    );

  const lordshipPlacementScore =
    getLordshipPlacementPolarityScore(
      params.lordshipHouse,
      params.placementHouse
    );

  const totalScore =
  dignityScore +
  lordshipPlacementScore;

  return `Lordship polarity score: dignity ${dignityScore}, lordship placement ${lordshipPlacementScore}, total ${totalScore}.`;
}
function getPlanetHouseBasePolarity(params: {
  planet: PlanetName;
  functionalRoles: string[];
  dignityStrength: number;
  house: number;
}): {
  polarity: JudgementSignal["polarity"];
  score: number;
} {
  // Rahu and Ketu need their own synthesis model.
  // Keep their base polarity mixed for now.
  if (
    params.planet === "Rahu" ||
    params.planet === "Ketu"
  ) {
    return {
      polarity: "mixed",
      score: 0,
    };
  }

  const functionalScore =
    getFunctionalRolePolarityScore(
      params.functionalRoles
    );

  const dignityScore =
    getDignityPolarityScore(
      params.dignityStrength
    );

  const houseScore =
    getHousePlacementPolarityScore(
      params.house
    );

  const score =
    functionalScore +
    dignityScore +
    houseScore;

  let polarity: JudgementSignal["polarity"] =
    "mixed";

  if (score >= 3) {
    polarity = "supportive";
  } else if (score <= -3) {
    polarity = "challenging";
  }

  return {
    polarity,
    score,
  };
}
function describePlanetHouseBasePolarity(params: {
  planet: PlanetName;
  functionalRoles: string[];
  dignityStrength: number;
  house: number;
}): string {
  if (
    params.planet === "Rahu" ||
    params.planet === "Ketu"
  ) {
    return `${params.planet} uses a separate nodal judgement model, so its base transit polarity remains mixed at this stage.`;
  }

  const functionalScore =
    getFunctionalRolePolarityScore(
      params.functionalRoles
    );

  const dignityScore =
    getDignityPolarityScore(
      params.dignityStrength
    );

  const houseScore =
    getHousePlacementPolarityScore(
      params.house
    );

  const totalScore =
    functionalScore +
    dignityScore +
    houseScore;

  return `Base polarity score: functional role ${functionalScore}, dignity ${dignityScore}, house placement ${houseScore}, total ${totalScore}.`;
}
function getPlanetHouseImportance(
  planet: PlanetName,
  house: number,
  dignityStrength: number,
  functionalRoleModifier: number
): number {
  let importance = 18;

  if ([1, 4, 7, 10].includes(house)) {
    importance += 4;
  } else if ([5, 9, 11].includes(house)) {
    importance += 3;
  } else if ([6, 8, 12].includes(house)) {
    importance += 2;
  }

  if (["Saturn", "Jupiter", "Rahu", "Ketu"].includes(planet)) {
    importance += 2;
  }
  if (dignityStrength >= 9) {
  importance += 3;
} else if (dignityStrength >= 7) {
  importance += 2;
} else if (dignityStrength <= 3) {
  importance -= 2;
} else if (dignityStrength <= 4) {
  importance -= 1;
}
  return importance + functionalRoleModifier;
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
  planet,
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
  hasSupport: boolean;
  moonHouse: number;
}): string {
  if (params.hasSaturn && params.hasSupport) {
    return "Emotionally, the day carries seriousness and responsibility, but supportive influences provide perspective and steadiness. Patience combined with sound judgement can help you handle matters constructively.";
  }

  if (params.hasSaturn) {
    return "Emotionally, the day feels more serious and reflective. Patience will work better than quick reactions.";
  }

  if (params.moonCondition === "mixed") {
    return "Emotionally, the day contains both pressure and support. Avoid reacting too quickly and use the constructive influences available to regain perspective.";
  }

  if (params.moonCondition === "supported") {
    return "Emotionally, the day is relatively supported, making it easier to maintain perspective, steadiness and constructive judgement.";
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