import { ordinal } from "./utils/ordinal";
export type PlanetName =
  | "Sun"
  | "Moon"
  | "Mars"
  | "Mercury"
  | "Jupiter"
  | "Venus"
  | "Saturn"
  | "Rahu"
  | "Ketu";

export type Ascendant =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

export type DailySkyInput = {
  date: string;
  moon: {
    sign: Ascendant;
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
        sign: Ascendant;
        nakshatra?: string;
        degree?: number;
        retrograde?: boolean;
      }
    >
  >;
  specialNotes?: string[];
};

export type AscendantPrediction = {
  ascendant: Ascendant;
  moonHouse: number;
  moonLordship: number;
  theme: string[];
  pressure: string[];
  support: string[];
  headline: string;
  prediction: string;
  bestUse: string;
};

const SIGNS: Ascendant[] = [
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

const MOON_LORDSHIP_BY_ASC: Record<Ascendant, number> = {
  Aries: 4,
  Taurus: 3,
  Gemini: 2,
  Cancer: 1,
  Leo: 12,
  Virgo: 11,
  Libra: 10,
  Scorpio: 9,
  Sagittarius: 8,
  Capricorn: 7,
  Aquarius: 6,
  Pisces: 5,
};

const HOUSE_THEMES: Record<number, string[]> = {
  1: ["self", "body", "mood", "confidence", "personal direction"],
  2: ["money", "speech", "family", "food", "values"],
  3: ["communication", "effort", "siblings", "courage", "short travel"],
  4: ["home", "mother", "comfort", "property", "emotional security"],
  5: ["children", "creativity", "learning", "romance", "intelligence"],
  6: ["workload", "health", "competition", "conflict", "discipline"],
  7: ["relationships", "clients", "partnerships", "public dealings"],
  8: ["sudden changes", "deep emotions", "research", "hidden matters"],
  9: ["luck", "beliefs", "teachers", "father", "long-distance matters"],
  10: ["career", "status", "responsibility", "visibility", "decisions"],
  11: ["gains", "network", "friends", "income", "wish fulfilment"],
  12: ["rest", "sleep", "expenses", "foreign matters", "letting go"],
};

const MALefics: PlanetName[] = ["Saturn", "Mars", "Rahu", "Ketu"];
const BENEFICS: PlanetName[] = ["Jupiter", "Venus", "Mercury"];

function houseFromAscendant(asc: Ascendant, transitSign: Ascendant): number {
  const ascIndex = SIGNS.indexOf(asc);
  const signIndex = SIGNS.indexOf(transitSign);

  if (ascIndex === -1 || signIndex === -1) {
    throw new Error(`Invalid ascendant or sign: ${asc}, ${transitSign}`);
  }

  return ((signIndex - ascIndex + 12) % 12) + 1;
}

function getMoonPressure(input: DailySkyInput, moonHouse: number): string[] {
  const pressure: string[] = [];

  if ([6, 8, 12].includes(moonHouse)) {
    pressure.push(`Moon activates the ${ordinal(moonHouse)} house, so the day needs more caution.`);
  }

  for (const planet of input.moon.conjunctions ?? []) {
    if (MALefics.includes(planet)) {
      pressure.push(`Moon is influenced by ${planet}, adding seriousness or pressure.`);
    }
  }

  for (const planet of input.moon.aspectsFrom ?? []) {
    if (MALefics.includes(planet)) {
      pressure.push(`${planet} aspects the Moon, increasing emotional pressure.`);
    }
  }

  return pressure;
}

function getMoonSupport(input: DailySkyInput): string[] {
  const support: string[] = [];

  for (const planet of input.moon.conjunctions ?? []) {
    if (BENEFICS.includes(planet)) {
      support.push(`Moon is supported by ${planet}.`);
    }
  }

  for (const planet of input.moon.aspectsFrom ?? []) {
    if (BENEFICS.includes(planet)) {
      support.push(`${planet} supports the Moon by aspect.`);
    }
  }

  return support;
}

function buildHeadline(asc: Ascendant, house: number): string {
  const primaryTheme = HOUSE_THEMES[house][0];

  return `${asc}: ${capitalize(primaryTheme)} takes focus`;
}

function buildPredictionText(params: {
  ascendant: Ascendant;
  moonHouse: number;
  moonLordship: number;
  theme: string[];
  pressure: string[];
  support: string[];
  input: DailySkyInput;
}): string {
  const {
    ascendant,
    moonHouse,
    moonLordship,
    theme,
    pressure,
    support,
    input,
  } = params;

  const moonLine = `For ${ascendant} ascendant, Moon rules the ${ordinal(moonLordship)} house and is transiting the ${ordinal(moonHouse)} house, activating ${theme
    .slice(0, 3)
    .join(", ")}.`;

  const nakshatraLine = input.moon.nextNakshatra
    ? `The day starts with Moon in ${input.moon.nakshatra} and shifts to ${input.moon.nextNakshatra.name} around ${input.moon.nextNakshatra.time}, so the tone may become more reflective later.`
    : `Moon remains in ${input.moon.nakshatra}, giving the day a consistent emotional tone.`;

  const conditionLine =
    pressure.length > 0
      ? pressure[0]
      : support.length > 0
        ? support[0]
        : "The Moon is not showing extreme pressure, so results may depend more on how consciously the day is handled.";

  return `${moonLine} ${nakshatraLine} ${conditionLine} Keep decisions practical and avoid reacting only from emotion.`;
}

function buildBestUse(house: number): string {
  const map: Record<number, string> = {
    1: "Use the day to reset your energy and take care of your body.",
    2: "Use the day to manage money, speech, and family matters carefully.",
    3: "Use the day for communication, follow-ups, writing, or short travel.",
    4: "Use the day to handle home, comfort, property, or emotional matters.",
    5: "Use the day for learning, creativity, children, or thoughtful planning.",
    6: "Use the day to finish pending work and avoid unnecessary arguments.",
    7: "Use the day to handle relationships and client matters with maturity.",
    8: "Use the day for research, inner work, and avoiding impulsive moves.",
    9: "Use the day for guidance, learning, travel planning, or spiritual clarity.",
    10: "Use the day to focus on responsibility, career visibility, and decisions.",
    11: "Use the day to connect with people and work toward gains.",
    12: "Use the day to rest, reduce clutter, and avoid wasteful expenses.",
  };

  return map[house];
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function generateDailyPredictions(
  input: DailySkyInput
): AscendantPrediction[] {
  return SIGNS.map((ascendant) => {
    const moonHouse = houseFromAscendant(ascendant, input.moon.sign);
    const moonLordship = MOON_LORDSHIP_BY_ASC[ascendant];
    const theme = HOUSE_THEMES[moonHouse];
    const pressure = getMoonPressure(input, moonHouse);
    const support = getMoonSupport(input);

    return {
      ascendant,
      moonHouse,
      moonLordship,
      theme,
      pressure,
      support,
      headline: buildHeadline(ascendant, moonHouse),
      prediction: buildPredictionText({
        ascendant,
        moonHouse,
        moonLordship,
        theme,
        pressure,
        support,
        input,
      }),
      bestUse: buildBestUse(moonHouse),
    };
  });
}