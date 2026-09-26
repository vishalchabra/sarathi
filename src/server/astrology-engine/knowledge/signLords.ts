import type {
  PlanetName,
  ZodiacSign,
} from "../types";

export const SIGN_LORDS: Record<
  ZodiacSign,
  PlanetName
> = {
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

export function getSignLord(
  sign: ZodiacSign
): PlanetName {
  return SIGN_LORDS[sign];
}