
import type { PlanetName, ZodiacSign } from "../types";

import {
  getPlanetLordships,
} from "./planetLordships";

import {
  resolvePlanetAspects,
  resolvePlanetConjunctions,
} from "../core/aspectResolver";

export type NatalPlanetPosition = {
  sign: ZodiacSign;
  house: number;
  degree?: number;
};

export type SambandhaType =
  | "conjunction"
  | "aspect"
  | "mutual_aspect"
  | "exchange"
  | "dispositor";


export type NatalSambandha = {
  type: SambandhaType;
  planets: [PlanetName, PlanetName];

  // Individual lordships of the two connected planets.
  planetLordships: {
    first: number[];
    second: number[];
  };

  // Combined houses, retained for existing consumers.
  houses: number[];
  // Shared by all relationship types involving the same
// two planets, preventing duplicate planet-pair scoring.
connectionId: string;
  directed: boolean;
};

export type NatalSambandhaResult = {
  relationships: NatalSambandha[];
  connectedHouses: number[];
};

const SIGN_LORDS: Record<ZodiacSign, PlanetName> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

export function resolveNatalSambandha(params: {
  ascendant: ZodiacSign;
  planets: Partial<Record<PlanetName, NatalPlanetPosition>>;
}): NatalSambandhaResult {
  const { ascendant, planets } = params;

  const relationships: NatalSambandha[] = [];
  const seen = new Set<string>();

  const entries = Object.entries(planets).filter(
    (entry): entry is [PlanetName, NatalPlanetPosition] =>
      Boolean(entry[1])
  );

  const lordships = (planet: PlanetName) =>
    getPlanetLordships(ascendant, planet);

  const add = (
    type: SambandhaType,
    first: PlanetName,
    second: PlanetName,
    directed: boolean
  ) => {
    if (first === second) return;

    const pair = directed
      ? `${first}:${second}`
      : [first, second].sort().join(":");

    const key = `${type}:${pair}`;
    if (seen.has(key)) return;

    seen.add(key);


relationships.push({
  type,
  planets: [first, second],

  planetLordships: {
    first: lordships(first),
    second: lordships(second),
  },

  houses: Array.from(
    new Set([...lordships(first), ...lordships(second)])
  ).sort((a, b) => a - b),
  connectionId: [first, second].sort().join(":"),
  directed,
});
  };

  const aspects = resolvePlanetAspects(planets);
  const conjunctions = resolvePlanetConjunctions(planets);

  for (const conjunction of conjunctions) {
    add(
      "conjunction",
      conjunction.planet,
      conjunction.conjunctPlanet,
      false
    );
  }

  for (const aspect of aspects) {
    const reciprocal = aspects.some(
      (other) =>
        other.aspectingPlanet === aspect.receivingPlanet &&
        other.receivingPlanet === aspect.aspectingPlanet
    );

    if (reciprocal) {
      add(
        "mutual_aspect",
        aspect.aspectingPlanet,
        aspect.receivingPlanet,
        false
      );
    } else {
      add(
        "aspect",
        aspect.aspectingPlanet,
        aspect.receivingPlanet,
        true
      );
    }
  }

  for (const [planet, position] of entries) {
    const dispositor = SIGN_LORDS[position.sign];

    if (dispositor !== planet) {
      add("dispositor", planet, dispositor, true);
    }

    const dispositorPosition = planets[dispositor];
    if (!dispositorPosition) continue;

    if (
      SIGN_LORDS[dispositorPosition.sign] === planet &&
      planet !== dispositor
    ) {
      add("exchange", planet, dispositor, false);
    }
  }

  return {
    relationships,
    connectedHouses: Array.from(
      new Set(relationships.flatMap((item) => item.houses))
    ).sort((a, b) => a - b),
  };
}