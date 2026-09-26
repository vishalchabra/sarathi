import type { PlanetName, ZodiacSign } from "../types";

export type PlanetDignity =
  | "exalted"
  | "moolatrikona"
  | "own_sign"
  | "friendly_sign"
  | "neutral_sign"
  | "enemy_sign"
  | "debilitated"
  | "special";

export type PlanetDignityKnowledge = {
  planet: PlanetName;
  sign: ZodiacSign;
  dignity: PlanetDignity;

  strength: number; // 1–10

  principle: string;
  expression: string;

  supportiveEffects: string[];
  cautionEffects: string[];

  dailyExpression: string;
  lifeReportInterpretation: string;

  confidence: number;
};

export const PLANET_DIGNITY: Record<
  string,
  PlanetDignityKnowledge
> = {};
export function planetDignityKey(
  planet: PlanetName,
  sign: ZodiacSign
): string {
  return `${planet.toLowerCase()}_in_${sign.toLowerCase()}`;
}
export const PLANET_DIGNITY_SIGNS = {
  Sun: {
    exalted: "Aries",
    debilitated: "Libra",
    ownSigns: ["Leo"],
    moolatrikona: ["Leo"],
    friendlySigns: ["Aries", "Cancer", "Scorpio", "Sagittarius", "Pisces"],
    neutralSigns: ["Gemini", "Virgo"],
    enemySigns: ["Taurus", "Libra", "Capricorn", "Aquarius"],
  },

  Moon: {
    exalted: "Taurus",
    debilitated: "Scorpio",
    ownSigns: ["Cancer"],
    moolatrikona: ["Taurus"],
    friendlySigns: ["Leo", "Gemini", "Virgo"],
    neutralSigns: [
      "Aries",
      "Taurus",
      "Libra",
      "Scorpio",
      "Sagittarius",
      "Capricorn",
      "Aquarius",
      "Pisces",
    ],
    enemySigns: [],
  },

  Mars: {
    exalted: "Capricorn",
    debilitated: "Cancer",
    ownSigns: ["Aries", "Scorpio"],
    moolatrikona: ["Aries"],
    friendlySigns: ["Leo", "Sagittarius", "Pisces"],
    neutralSigns: ["Taurus", "Libra", "Aquarius"],
    enemySigns: ["Gemini", "Virgo"],
  },

  Mercury: {
    exalted: "Virgo",
    debilitated: "Pisces",
    ownSigns: ["Gemini", "Virgo"],
    moolatrikona: ["Virgo"],
    friendlySigns: ["Taurus", "Leo", "Libra"],
    neutralSigns: [
      "Aries",
      "Scorpio",
      "Sagittarius",
      "Capricorn",
      "Aquarius",
    ],
    enemySigns: ["Cancer"],
  },

  Jupiter: {
    exalted: "Cancer",
    debilitated: "Capricorn",
    ownSigns: ["Sagittarius", "Pisces"],
    moolatrikona: ["Sagittarius"],
    friendlySigns: ["Aries", "Leo", "Scorpio"],
    neutralSigns: ["Aquarius"],
    enemySigns: ["Taurus", "Gemini", "Virgo", "Libra"],
  },

  Venus: {
    exalted: "Pisces",
    debilitated: "Virgo",
    ownSigns: ["Taurus", "Libra"],
    moolatrikona: ["Libra"],
    friendlySigns: ["Gemini", "Virgo", "Capricorn", "Aquarius"],
    neutralSigns: ["Aries", "Scorpio", "Sagittarius"],
    enemySigns: ["Cancer", "Leo"],
  },

  Saturn: {
    exalted: "Libra",
    debilitated: "Aries",
    ownSigns: ["Capricorn", "Aquarius"],
    moolatrikona: ["Aquarius"],
    friendlySigns: ["Taurus", "Gemini", "Virgo"],
    neutralSigns: ["Sagittarius", "Pisces"],
    enemySigns: ["Cancer", "Leo", "Scorpio"],
  },
} as const;
export function getPlanetDignity(
  planet: PlanetName,
  sign: ZodiacSign
): PlanetDignity {
  if (planet === "Rahu" || planet === "Ketu") {
    return "special";
  }

  const dignityMap =
    PLANET_DIGNITY_SIGNS[
      planet as keyof typeof PLANET_DIGNITY_SIGNS
    ];

  if (!dignityMap) {
    return "special";
  }

  // Exact conditions must be checked first.
  if (sign === dignityMap.exalted) {
    return "exalted";
  }

  if (sign === dignityMap.debilitated) {
    return "debilitated";
  }

  if (
    (dignityMap.moolatrikona as readonly string[]).includes(sign)
  ) {
    return "moolatrikona";
  }

  if (
    (dignityMap.ownSigns as readonly string[]).includes(sign)
  ) {
    return "own_sign";
  }

  if (
    (dignityMap.friendlySigns as readonly string[]).includes(sign)
  ) {
    return "friendly_sign";
  }

  if (
    (dignityMap.neutralSigns as readonly string[]).includes(sign)
  ) {
    return "neutral_sign";
  }

  if (
    (dignityMap.enemySigns as readonly string[]).includes(sign)
  ) {
    return "enemy_sign";
  }

  return "neutral_sign";
}
export type DignityInterpretation = {
  strength: number;
  principle: string;
  supportiveEffects: string[];
  cautionEffects: string[];
};

export const DIGNITY_INTERPRETATIONS: Record<
  PlanetDignity,
  DignityInterpretation
> = {
  exalted: {
    strength: 10,
    principle:
      "The planet has strong capacity to express its natural qualities in an elevated and effective manner.",
    supportiveEffects: [
      "Natural significations can operate with greater confidence and effectiveness.",
      "The planet can contribute strongly when supported by house ownership and other chart factors.",
    ],
    cautionEffects: [
      "Strength can become excessive if the planet is poorly directed or heavily afflicted.",
      "Exaltation does not automatically make every result beneficial.",
    ],
  },

  moolatrikona: {
    strength: 9,
    principle:
      "The planet operates from a highly natural and stable expression of its essential function.",
    supportiveEffects: [
      "The planet can express its core qualities with consistency and clarity.",
      "Its significations often become dependable areas of strength.",
    ],
    cautionEffects: [
      "Strong planetary expression still depends on house ownership, aspects and activation.",
    ],
  },

  own_sign: {
    strength: 8,
    principle:
      "The planet operates in an environment it naturally governs and therefore has good control over its expression.",
    supportiveEffects: [
      "The planet can express its natural qualities with stability and familiarity.",
      "Its house-related responsibilities can be handled with greater internal control.",
    ],
    cautionEffects: [
      "Strength does not guarantee ease if the planet governs difficult houses or receives challenging influences.",
    ],
  },

  friendly_sign: {
    strength: 7,
    principle:
      "The planet operates in a supportive environment that generally allows its natural qualities to function comfortably.",
    supportiveEffects: [
      "Planetary qualities can express with reasonable cooperation and effectiveness.",
      "The placement generally supports constructive use of the planet.",
    ],
    cautionEffects: [
      "Results still depend strongly on house placement and functional lordship.",
    ],
  },

  neutral_sign: {
    strength: 5,
    principle:
      "The planet operates in a relatively neutral environment without strong support or resistance.",
    supportiveEffects: [
      "The planet can produce workable results when supported by other chart factors.",
    ],
    cautionEffects: [
      "Its expression may depend more heavily on aspects, conjunctions, house placement and activation.",
    ],
  },

  enemy_sign: {
    strength: 4,
    principle:
      "The planet operates in an environment that is less naturally supportive of its preferred mode of expression.",
    supportiveEffects: [
      "Growth can occur through adaptation, effort and conscious use of the planet.",
    ],
    cautionEffects: [
      "The planet may express with greater friction, inconsistency or internal conflict.",
      "Its natural significations may require more deliberate management.",
    ],
  },

  debilitated: {
    strength: 3,
    principle:
      "The planet may find it harder to express its natural qualities smoothly or consistently in this sign.",
    supportiveEffects: [
      "The placement can develop maturity through conscious effort, experience and corrective factors.",
      "Cancellation or other supportive conditions can substantially modify the result.",
    ],
    cautionEffects: [
      "Natural planetary functions may require greater awareness and deliberate management.",
      "Debilitation should never be interpreted in isolation.",
    ],
  },

  special: {
    strength: 5,
    principle:
      "This planet requires a separate interpretive framework rather than the standard classical dignity relationship used for the seven visible grahas.",
    supportiveEffects: [
      "Its results should be judged through sign, house, dispositor, conjunctions and overall chart context.",
    ],
    cautionEffects: [
      "Avoid assigning conventional exaltation or debilitation status without choosing a specific interpretive tradition.",
    ],
  },
};
export function getPlanetDignityInterpretation(
  planet: PlanetName,
  sign: ZodiacSign
) {
  const dignity = getPlanetDignity(planet, sign);
  const interpretation = DIGNITY_INTERPRETATIONS[dignity];

  return {
    planet,
    sign,
    dignity,
    ...interpretation,
  };
}