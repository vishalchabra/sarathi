import type {
  PlanetName,
  ZodiacSign,
} from "../types";

import type {
  PersonalizedDailyPredictionInput,
} from "../personalizedDailyPredictionGenerator";

import {
  VEDIC_ASPECT_RULES,
  getAspectHouseBetweenSigns,
} from "../core/aspectResolver";

import {
  getPlanetLordships,
} from "../knowledge/planetLordships";

const SIGNS: readonly ZodiacSign[] = [
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

const PLANETS: readonly PlanetName[] = [
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

export type TransitGeometryInput = Pick<
  PersonalizedDailyPredictionInput,
  "sky" | "ascendant" | "natalPositions"
>;

export type TransitDegreeBand =
  | "exact"
  | "close"
  | "moderate"
  | "wide"
  | "unknown";

export type IndependentTransitPosition = {
  planet: PlanetName;
  sign: ZodiacSign;
  house: number;
  longitude: number | null;
  ruledHouses: number[];
  aspectedHouses: number[];
  retrograde: boolean | null;
};

export type TransitNatalContact = {
  transitPlanet: PlanetName;
  natalPlanet: PlanetName;

  contactType:
    | "conjunction"
    | "vedic_aspect";

  transitHouse: number;
  natalHouse: number;

  transitRuledHouses: number[];
  natalRuledHouses: number[];

  aspectHouse: number;
  exactAngle: number;

  orb: number | null;
  degreeBand: TransitDegreeBand;

  signBased: true;

  applying: null;
};

export type EventTransitGeometry = {
  independentPositions: IndependentTransitPosition[];
  moonPosition: IndependentTransitPosition | null;

  independentNatalContacts: TransitNatalContact[];
  moonNatalContacts: TransitNatalContact[];

  missingTransitPlanets: PlanetName[];
  missingNatalPlanets: PlanetName[];
};

function normalize360(value: number): number {
  return ((value % 360) + 360) % 360;
}

function isFiniteNumber(
  value: unknown
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

function uniqueHouses(
  houses: readonly number[]
): number[] {
  return [...new Set(houses)].sort(
    (a, b) => a - b
  );
}

function houseFromSign(
  ascendant: ZodiacSign,
  sign: ZodiacSign
): number {
  const ascendantIndex = SIGNS.indexOf(ascendant);
  const signIndex = SIGNS.indexOf(sign);

  if (
    ascendantIndex < 0 ||
    signIndex < 0
  ) {
    throw new Error("Invalid zodiac sign.");
  }

  return (
    (signIndex - ascendantIndex + 12) % 12
  ) + 1;
}

function longitudeFromSignDegree(
  sign: ZodiacSign,
  degree: unknown
): number | null {

  const index = SIGNS.indexOf(sign);

  if (
    index < 0 ||
    !isFiniteNumber(degree) ||
    degree < 0 ||
    degree >= 30
  ) {
    return null;
  }

  return normalize360(
    index * 30 + degree
  );
}

function validNatalLongitude(
  sign: ZodiacSign,
  longitude: unknown
): number | null {

  if (!isFiniteNumber(longitude)) {
    return null;
  }

  const normalized =
    normalize360(longitude);

  const longitudeSign =
    SIGNS[Math.floor(normalized / 30)];

  return longitudeSign === sign
    ? normalized
    : null;
}

export function calculateTransitContactOrb(
  transitLongitude: number | null,
  natalLongitude: number | null,
  exactAngle: number
): number | null {

  if (
    !isFiniteNumber(transitLongitude) ||
    !isFiniteNumber(natalLongitude) ||
    !isFiniteNumber(exactAngle)
  ) {
    return null;
  }

  const directionalDistance =
    normalize360(
      natalLongitude - transitLongitude
    );

  const difference =
    normalize360(
      directionalDistance - exactAngle
    );

  return Math.min(
    difference,
    360 - difference
  );
}

export function classifyTransitDegreeBand(
  orb: number | null
): TransitDegreeBand {

  if (
    !isFiniteNumber(orb) ||
    orb < 0
  ) {
    return "unknown";
  }

  if (orb <= 0.5) return "exact";
  if (orb <= 1) return "close";
  if (orb <= 3) return "moderate";

  return "wide";
}

function buildPosition(
  planet: PlanetName,
  sign: ZodiacSign,
  longitude: number | null,
  retrograde: boolean | null,
  ascendant: ZodiacSign
): IndependentTransitPosition {

  const house =
    houseFromSign(ascendant, sign);

  const aspectRules =
    VEDIC_ASPECT_RULES[planet] ?? [];

  return {
    planet,
    sign,
    house,
    longitude,

    ruledHouses: uniqueHouses(
      getPlanetLordships(
        ascendant,
        planet
      )
    ),

    aspectedHouses: uniqueHouses(
      aspectRules.map(
        (distance) =>
          ((house + distance - 2) % 12) + 1
      )
    ),

    retrograde,
  };
}

export function resolveEventTransitGeometry(
  input: TransitGeometryInput
): EventTransitGeometry {

  const positions:
    IndependentTransitPosition[] = [];

  const missingTransitPlanets:
    PlanetName[] = [];

  const missingNatalPlanets:
    PlanetName[] = [];

  for (const planet of PLANETS) {

    if (planet === "Moon") {

      const moon = input.sky.moon;

      if (
        !moon ||
        !SIGNS.includes(moon.sign)
      ) {
        missingTransitPlanets.push(planet);
        continue;
      }

      const moonLongitude =
        validNatalLongitude(
          moon.sign,
          moon.siderealLongitude
        ) ??
        longitudeFromSignDegree(
          moon.sign,
          moon.degree
        );

      positions.push(
        buildPosition(
          planet,
          moon.sign,
          moonLongitude,
          null,
          input.ascendant
        )
      );

      continue;
    }

    const transit =
      input.sky.planets?.[planet];

    if (
      !transit ||
      !SIGNS.includes(transit.sign)
    ) {
      missingTransitPlanets.push(planet);
      continue;
    }

    positions.push(
      buildPosition(
        planet,
        transit.sign,
        longitudeFromSignDegree(
          transit.sign,
          transit.degree
        ),
        typeof transit.retrograde === "boolean"
          ? transit.retrograde
          : null,
        input.ascendant
      )
    );
  }

  const contacts: TransitNatalContact[] = [];

  for (const natalPlanet of PLANETS) {

    const natal =
      input.natalPositions[natalPlanet];

    if (
      !natal ||
      !SIGNS.includes(natal.sign)
    ) {
      missingNatalPlanets.push(natalPlanet);
      continue;
    }

    const natalHouse =
      houseFromSign(
        input.ascendant,
        natal.sign
      );

    const natalLongitude =
      validNatalLongitude(
        natal.sign,
        natal.longitude
      );

    const natalRuledHouses =
      uniqueHouses(
        getPlanetLordships(
          input.ascendant,
          natalPlanet
        )
      );

    for (const transit of positions) {

      const aspectHouse =
        getAspectHouseBetweenSigns(
          transit.sign,
          natal.sign
        );

      const isConjunction =
        aspectHouse === 1;

      const isVedicAspect =
        (
          VEDIC_ASPECT_RULES[
            transit.planet
          ] ?? []
        ).includes(aspectHouse);

      if (
        !isConjunction &&
        !isVedicAspect
      ) {
        continue;
      }

      const exactAngle =
        (aspectHouse - 1) * 30;

      const orb =
        calculateTransitContactOrb(
          transit.longitude,
          natalLongitude,
          exactAngle
        );

      contacts.push({
        transitPlanet: transit.planet,
        natalPlanet,

        contactType: isConjunction
          ? "conjunction"
          : "vedic_aspect",

        transitHouse: transit.house,
        natalHouse,

        transitRuledHouses: [
          ...transit.ruledHouses,
        ],

        natalRuledHouses: [
          ...natalRuledHouses,
        ],

        aspectHouse,
        exactAngle,
        orb,

        degreeBand:
          classifyTransitDegreeBand(orb),

        signBased: true,

        applying: null,
      });
    }
  }

  return {

    independentPositions:
      positions.filter(
        (position) =>
          position.planet !== "Moon"
      ),

    moonPosition:
      positions.find(
        (position) =>
          position.planet === "Moon"
      ) ?? null,

    independentNatalContacts:
      contacts.filter(
        (contact) =>
          contact.transitPlanet !== "Moon"
      ),

    moonNatalContacts:
      contacts.filter(
        (contact) =>
          contact.transitPlanet === "Moon"
      ),

    missingTransitPlanets,
    missingNatalPlanets,
  };
}