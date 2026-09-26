import type { PlanetName, ZodiacSign } from "../types";

export type PlanetLordshipMap = Record<
  ZodiacSign,
  Partial<Record<PlanetName, number[]>>
>;
export const PLANET_LORDSHIPS: PlanetLordshipMap = {
  Aries: {
    Sun: [5],
    Moon: [4],
    Mars: [1, 8],
    Mercury: [3, 6],
    Jupiter: [9, 12],
    Venus: [2, 7],
    Saturn: [10, 11],
  },

  Taurus: {
    Sun: [4],
    Moon: [3],
    Mars: [7, 12],
    Mercury: [2, 5],
    Jupiter: [8, 11],
    Venus: [1, 6],
    Saturn: [9, 10],
  },

  Gemini: {
    Sun: [3],
    Moon: [2],
    Mars: [6, 11],
    Mercury: [1, 4],
    Jupiter: [7, 10],
    Venus: [5, 12],
    Saturn: [8, 9],
  },

  Cancer: {
    Sun: [2],
    Moon: [1],
    Mars: [5, 10],
    Mercury: [3, 12],
    Jupiter: [6, 9],
    Venus: [4, 11],
    Saturn: [7, 8],
  },
    Leo: {
    Sun: [1],
    Moon: [12],
    Mars: [4, 9],
    Mercury: [2, 11],
    Jupiter: [5, 8],
    Venus: [3, 10],
    Saturn: [6, 7],
  },

  Virgo: {
    Sun: [12],
    Moon: [11],
    Mars: [3, 8],
    Mercury: [1, 10],
    Jupiter: [4, 7],
    Venus: [2, 9],
    Saturn: [5, 6],
  },

  Libra: {
    Sun: [11],
    Moon: [10],
    Mars: [2, 7],
    Mercury: [9, 12],
    Jupiter: [3, 6],
    Venus: [1, 8],
    Saturn: [4, 5],
  },

  Scorpio: {
    Sun: [10],
    Moon: [9],
    Mars: [1, 6],
    Mercury: [8, 11],
    Jupiter: [2, 5],
    Venus: [7, 12],
    Saturn: [3, 4],
  },
    Sagittarius: {
    Sun: [9],
    Moon: [8],
    Mars: [5, 12],
    Mercury: [7, 10],
    Jupiter: [1, 4],
    Venus: [6, 11],
    Saturn: [2, 3],
  },

  Capricorn: {
    Sun: [8],
    Moon: [7],
    Mars: [4, 11],
    Mercury: [6, 9],
    Jupiter: [3, 12],
    Venus: [5, 10],
    Saturn: [1, 2],
  },

  Aquarius: {
    Sun: [7],
    Moon: [6],
    Mars: [3, 10],
    Mercury: [5, 8],
    Jupiter: [2, 11],
    Venus: [4, 9],
    Saturn: [1, 12],
  },

  Pisces: {
    Sun: [6],
    Moon: [5],
    Mars: [2, 9],
    Mercury: [4, 7],
    Jupiter: [1, 10],
    Venus: [3, 8],
    Saturn: [11, 12],
  },
};
export function getPlanetLordships(
  ascendant: ZodiacSign,
  planet: PlanetName
): number[] {
  return PLANET_LORDSHIPS[ascendant][planet] ?? [];
}