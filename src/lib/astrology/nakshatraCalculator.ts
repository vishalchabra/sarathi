import {
  calculateNavamsa,
  type DivisionalSign,
} from "./divisionalCalculator";

/**
 * Shared mathematical foundation for the standard
 * 27-nakshatra, 108-pada sidereal zodiac.
 *
 * All subdivision boundaries use the same convention
 * as the shared D9 calculator.
 *
 * This module performs calculations only.
 * It does not provide astrological interpretations.
 */

export const NAKSHATRA_NAMES = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
] as const;

export const NAKSHATRA_LORD_SEQUENCE = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
] as const;

export type NakshatraName =
  (typeof NAKSHATRA_NAMES)[number];

export type NakshatraLord =
  (typeof NAKSHATRA_LORD_SEQUENCE)[number];

export type PadaNumber = 1 | 2 | 3 | 4;

export type NavamsaLord =
  Exclude<NakshatraLord, "Rahu" | "Ketu">;

export const NAKSHATRA_WIDTH = 40 / 3;
export const PADA_WIDTH = 10 / 3;

export const NAVAMSA_SIGN_LORDS = {
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
} as const satisfies Record<DivisionalSign, NavamsaLord>;

export type NakshatraPosition = {
  longitude: number;

  nakshatraIndex: number;
  nakshatraNumber: number;
  nakshatra: NakshatraName;
  nakshatraLord: NakshatraLord;

  padaIndex: number;
  pada: PadaNumber;

  globalPadaIndex: number;
  globalPadaNumber: number;

  rashi: DivisionalSign;
  rashiIndex: number;
  degreeInRashi: number;

  navamsaSign: DivisionalSign;
  navamsaSignIndex: number;
  navamsaLord: NavamsaLord;
  navamsaDegree: number;
  navamsaLongitude: number;

  nakshatraStartLongitude: number;
  nakshatraEndLongitude: number;

  padaStartLongitude: number;
  padaEndLongitude: number;

  offsetWithinNak: number;
  offsetWithinPada: number;

  padaProgress: number;
  fractionElapsed: number;
  fractionRemaining: number;

  boundaryAdjusted: boolean;
};

/**
 * Calculate a nakshatra position from an absolute
 * sidereal longitude in degrees.
 *
 * Finite longitudes are normalized by calculateNavamsa.
 * Non-finite inputs are rejected by the shared calculator.
 *
 * Boundary intervals are start-inclusive and end-exclusive.
 */
export function calculateNakshatraPosition(
  longitude: number
): NakshatraPosition {
  const d9 = calculateNavamsa(longitude);

  // Nine padas per zodiac sign.
  // The shared D9 calculator already resolves the
  // correct subdivision, including exact boundaries.
  const globalPadaIndex =
    d9.natalSignIndex * 9 + d9.subdivisionIndex;

  const nakshatraIndex =
    Math.floor(globalPadaIndex / 4);

  const padaIndex = globalPadaIndex % 4;

  const pada = (padaIndex + 1) as PadaNumber;

  // Each D9 subdivision expands to 30 degrees.
  // Its degree therefore supplies the same fractional
  // progress as the original natal pada.
  const padaProgress = d9.degree / 30;

  const fractionElapsed =
    (padaIndex + padaProgress) / 4;

  const fractionRemaining = 1 - fractionElapsed;

  return {
    longitude: d9.natalLongitude,

    nakshatraIndex,
    nakshatraNumber: nakshatraIndex + 1,

    nakshatra: NAKSHATRA_NAMES[nakshatraIndex],

    nakshatraLord:
      NAKSHATRA_LORD_SEQUENCE[nakshatraIndex % 9],

    padaIndex,
    pada,

    globalPadaIndex,
    globalPadaNumber: globalPadaIndex + 1,

    rashi: d9.natalSign,
    rashiIndex: d9.natalSignIndex,
    degreeInRashi: d9.natalDegree,

    navamsaSign: d9.sign,
    navamsaSignIndex: d9.signIndex,
    navamsaLord: NAVAMSA_SIGN_LORDS[d9.sign],
    navamsaDegree: d9.degree,
    navamsaLongitude: d9.longitude,

    nakshatraStartLongitude:
      nakshatraIndex * 40 / 3,

    nakshatraEndLongitude:
      (nakshatraIndex + 1) * 40 / 3,

    padaStartLongitude:
      globalPadaIndex * 10 / 3,

    padaEndLongitude:
      (globalPadaIndex + 1) * 10 / 3,

    offsetWithinNak:
      fractionElapsed * NAKSHATRA_WIDTH,

    offsetWithinPada:
      padaProgress * PADA_WIDTH,

    padaProgress,
    fractionElapsed,
    fractionRemaining,

    boundaryAdjusted: d9.boundaryAdjusted,
  };
}

/**
 * Nullable adapter for consumers that treat invalid
 * or unavailable longitudes as missing information.
 */
export function tryCalculateNakshatraPosition(
  longitude: number | null | undefined
): NakshatraPosition | null {
  if (
    typeof longitude !== "number" ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  return calculateNakshatraPosition(longitude);
}