import type {
  DailySkyInput,
} from "../core/reasoningEngine";

import type {
  PlanetName,
  ZodiacSign,
} from "../types";

import type {
  PersonalizedDailyPredictionInput,
} from "../personalizedDailyPredictionGenerator";

const PLANETS: PlanetName[] = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
];

const ZODIAC_SIGNS: ZodiacSign[] = [
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

function isPlanetName(
  value: unknown
): value is PlanetName {
  return (
    typeof value === "string" &&
    PLANETS.includes(
      value as PlanetName
    )
  );
}

function isZodiacSign(
  value: unknown
): value is ZodiacSign {
  return (
    typeof value === "string" &&
    ZODIAC_SIGNS.includes(
      value as ZodiacSign
    )
  );
}

function buildSkyInput(params: {
  selectedDateISO: string;
  transitNow: any;
}): DailySkyInput {
  const {
    selectedDateISO,
    transitNow,
  } = params;

  const moonToday =
    transitNow?.moonToday;
  if (
    !moonToday ||
    !isZodiacSign(moonToday.sign) ||
    !moonToday.nakshatra
  ) {
    throw new Error(
      "Cannot build personalized daily prediction: valid transit Moon data is missing."
    );
  }

  const planets: DailySkyInput["planets"] =
    {};

  for (
    const row of
      Array.isArray(transitNow?.planets)
        ? transitNow.planets
        : []
  ) {
    if (
      !isPlanetName(row?.planet) ||
      !isZodiacSign(row?.sign)
    ) {
      continue;
    }

    const planet =
  row.planet as PlanetName;

const sign =
  row.sign as ZodiacSign;

planets[planet] = {
  sign,
  nakshatra:
    row.nakshatra ?? undefined,
  degree:
    typeof row.degree === "number"
      ? row.degree
      : undefined,
  retrograde:
    typeof row.retrograde === "boolean"
      ? row.retrograde
      : undefined,
};
  }

  return {
    date: selectedDateISO,

    moon: {
      sign: moonToday.sign,
      degree:
        typeof moonToday.degree ===
        "number"
          ? moonToday.degree
          : undefined,
      nakshatra:
        moonToday.nakshatra,
      pada:
        typeof moonToday.pada ===
        "number"
          ? moonToday.pada
          : undefined,
    },

    planets,
  };
}

export function buildPersonalizedPredictionInputFromDataEngine(
  params: {
    selectedDateISO: string;
    natal: any;
    dasha: any;
    transitNow: any;
  }
): PersonalizedDailyPredictionInput {
  const {
    selectedDateISO,
    natal,
    dasha,
    transitNow,
  } = params;

  const ascendant =
    natal?.ascendant?.sign;

  if (!isZodiacSign(ascendant)) {
    throw new Error(
      "Cannot build personalized daily prediction: valid natal ascendant is missing."
    );
  }

  const md =
  dasha?.activeForPrediction?.md;

const ad =
  dasha?.activeForPrediction?.ad;

const pd =
  dasha?.activeForPrediction?.pd;

  if (
    !isPlanetName(md) ||
    !isPlanetName(ad) ||
    !isPlanetName(pd)
  ) {
    throw new Error(
      "Cannot build personalized daily prediction: active MD/AD/PD is incomplete."
    );
  }

  const natalPositions:
    PersonalizedDailyPredictionInput["natalPositions"] =
      {};

  for (
    const row of
      Array.isArray(natal?.planets)
        ? natal.planets
        : []
  ) {
    if (
      !isPlanetName(row?.planet) ||
      !isZodiacSign(row?.sign) ||
      typeof row?.house !== "number"
    ) {
      continue;
    }

    const planet =
  row.planet as PlanetName;

const sign =
  row.sign as ZodiacSign;

natalPositions[planet] = {
  sign,
  house: row.house,

  // Additional context for narrative refinement only.
  nakshatra:
    typeof row.nakshatra === "string"
      ? row.nakshatra
      : null,

  pada:
    Number.isInteger(Number(row.pada)) &&
    Number(row.pada) >= 1 &&
    Number(row.pada) <= 4
      ? (Number(row.pada) as 1 | 2 | 3 | 4)
      : null,
};
  }

  const sky =
    buildSkyInput({
      selectedDateISO,
      transitNow,
    });

const profileKey = [
  ascendant,
  ...PLANETS.map((planet) => {
    const position = natalPositions[planet];

    return position
      ? [
          planet,
          position.sign,
          position.house,
          position.nakshatra ?? "",
          position.pada ?? "",
        ].join(":")
      : `${planet}:missing`;
  }),
].join("|");
  return {
  sky,
  ascendant,
  selectedDateISO,
  profileKey,

    dasha: {
      mahadasha: md,
      antardasha: ad,
      pratyantardasha: pd,
    },

    natalPositions,
  };
}
