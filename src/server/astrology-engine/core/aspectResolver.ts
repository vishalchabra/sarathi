import type {
  PlanetName,
  ZodiacSign,
} from "../types";

import type {
  DailySkyInput,
} from "./reasoningEngine";

export type VedicAspectRule = {
  planet: PlanetName;
  aspectHouses: number[];
};
export type PlanetConjunction = {
  planet: PlanetName;
  conjunctPlanet: PlanetName;
  sign: ZodiacSign;
};
export type PlanetAspect = {
  aspectingPlanet: PlanetName;
  receivingPlanet: PlanetName;

  fromSign: ZodiacSign;
  toSign: ZodiacSign;

  aspectHouse: number;
};

/**
 * Classical graha drishti used by the engine.
 *
 * All seven visible grahas aspect the 7th house from themselves.
 *
 * Special aspects:
 * Mars    -> 4th, 7th, 8th
 * Jupiter -> 5th, 7th, 9th
 * Saturn  -> 3rd, 7th, 10th
 *
 * Rahu and Ketu are deliberately excluded for now.
 * Their special aspects will be handled separately once
 * we choose the tradition Sārathi should follow.
 */
export const VEDIC_ASPECT_RULES: Partial<
  Record<PlanetName, number[]>
> = {
  Sun: [7],
  Moon: [7],
  Mars: [4, 7, 8],
  Mercury: [7],
  Jupiter: [5, 7, 9],
  Venus: [7],
  Saturn: [3, 7, 10],
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

export function signAtAspectDistance(
  fromSign: ZodiacSign,
  aspectHouse: number
): ZodiacSign {
  const fromIndex = SIGNS.indexOf(fromSign);

  const targetIndex =
    (fromIndex + aspectHouse - 1) % 12;

  return SIGNS[targetIndex];
}
export function getAspectHouseBetweenSigns(
  fromSign: ZodiacSign,
  toSign: ZodiacSign
): number {
  const fromIndex = SIGNS.indexOf(fromSign);
  const toIndex = SIGNS.indexOf(toSign);

  return ((toIndex - fromIndex + 12) % 12) + 1;
}

export function doesPlanetAspectSign(
  aspectingPlanet: PlanetName,
  fromSign: ZodiacSign,
  toSign: ZodiacSign
): boolean {
  const aspectRules =
    VEDIC_ASPECT_RULES[aspectingPlanet] ?? [];

  const aspectHouse = getAspectHouseBetweenSigns(
    fromSign,
    toSign
  );

  return aspectRules.includes(aspectHouse);
}
export function resolvePlanetAspects(
  planets: Partial<
    Record<
      PlanetName,
      {
        sign: ZodiacSign;
      }
    >
  >
): PlanetAspect[] {
  const aspects: PlanetAspect[] = [];

  const entries = Object.entries(planets) as [
    PlanetName,
    { sign: ZodiacSign }
  ][];

  for (const [aspectingPlanet, aspectingData] of entries) {
    const aspectRules =
      VEDIC_ASPECT_RULES[aspectingPlanet] ?? [];

    if (aspectRules.length === 0) continue;

    for (const [receivingPlanet, receivingData] of entries) {
      if (aspectingPlanet === receivingPlanet) continue;

      const aspectHouse = getAspectHouseBetweenSigns(
        aspectingData.sign,
        receivingData.sign
      );

      if (!aspectRules.includes(aspectHouse)) continue;

      aspects.push({
        aspectingPlanet,
        receivingPlanet,

        fromSign: aspectingData.sign,
        toSign: receivingData.sign,

        aspectHouse,
      });
    }
  }

  return aspects;
}
export function resolvePlanetConjunctions(
  planets: Partial<
    Record<
      PlanetName,
      {
        sign: ZodiacSign;
      }
    >
  >
): PlanetConjunction[] {
  const conjunctions: PlanetConjunction[] = [];

  const entries = Object.entries(planets) as [
    PlanetName,
    { sign: ZodiacSign }
  ][];

  for (let i = 0; i < entries.length; i++) {
    const [planet, planetData] = entries[i];

    for (let j = i + 1; j < entries.length; j++) {
      const [otherPlanet, otherData] = entries[j];

      if (planetData.sign !== otherData.sign) {
        continue;
      }

      conjunctions.push({
        planet,
        conjunctPlanet: otherPlanet,
        sign: planetData.sign,
      });
    }
  }

  return conjunctions;
}
export function enrichSkyInputWithPlanetContacts(
  input: DailySkyInput
): DailySkyInput {
  const planets = input.planets ?? {};

const geometryPlanets = {
  ...planets,
  Moon: {
    sign: input.moon.sign,
  },
};

const aspects =
  resolvePlanetAspects(geometryPlanets);

const conjunctions =
  resolvePlanetConjunctions(geometryPlanets);
  const enrichedPlanets = Object.fromEntries(
    Object.entries(planets).map(
      ([planetName, planetData]) => {
        const planet = planetName as PlanetName;

        if (!planetData) {
          return [planetName, planetData];
        }

        const automaticAspectsFrom = aspects
          .filter(
            (aspect) =>
              aspect.receivingPlanet === planet
          )
          .map(
            (aspect) =>
              aspect.aspectingPlanet
          );
        const automaticConjunctions = conjunctions
  .filter(
    (conjunction) =>
      conjunction.planet === planet ||
      conjunction.conjunctPlanet === planet
  )
  .map((conjunction) =>
    conjunction.planet === planet
      ? conjunction.conjunctPlanet
      : conjunction.planet
  );
        return [
          planetName,
          {
            ...planetData,
           conjunctions: Array.from(
  new Set([
    ...(planetData.conjunctions ?? []),
    ...automaticConjunctions,
  ])
),
            aspectsFrom: Array.from(
              new Set([
                ...(planetData.aspectsFrom ?? []),
                ...automaticAspectsFrom,
              ])
            ),
          },
        ];
      }
    )
  ) as DailySkyInput["planets"];
const automaticMoonConjunctions = conjunctions
  .filter(
    (conjunction) =>
      conjunction.planet === "Moon" ||
      conjunction.conjunctPlanet === "Moon"
  )
  .map((conjunction) =>
    conjunction.planet === "Moon"
      ? conjunction.conjunctPlanet
      : conjunction.planet
  )
  .filter(
    (planet): planet is PlanetName =>
      planet !== "Moon"
  );

const automaticMoonAspectsFrom = aspects
  .filter(
    (aspect) =>
      aspect.receivingPlanet === "Moon"
  )
  .map(
    (aspect) =>
      aspect.aspectingPlanet
  )
  .filter(
    (planet): planet is PlanetName =>
      planet !== "Moon"
  );
 return {
  ...input,

  moon: {
    ...input.moon,

    conjunctions: Array.from(
      new Set([
        ...(input.moon.conjunctions ?? []),
        ...automaticMoonConjunctions,
      ])
    ),

    aspectsFrom: Array.from(
      new Set([
        ...(input.moon.aspectsFrom ?? []),
        ...automaticMoonAspectsFrom,
      ])
    ),
  },

  planets: enrichedPlanets,
};
}