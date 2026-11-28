/**
 * Authoritative Parashari D2, D9 and D10 calculator.
 *
 * Input: absolute sidereal natal longitude.
 * House convention: whole sign.
 *
 * No ephemeris, server-only or runtime dependencies.
 */

export const DIVISIONAL_SIGNS = [
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
] as const;

export type DivisionalSign =
  (typeof DIVISIONAL_SIGNS)[number];

export type SupportedDivision = 2 | 9 | 10;

export type DivisionalPosition = {
  varga: SupportedDivision;
  natalLongitude: number;
  natalSignIndex: number;
  natalSign: DivisionalSign;
  natalDegree: number;
  subdivisionIndex: number;
  subdivisionNumber: number;
  signIndex: number;
  sign: DivisionalSign;
  degree: number;
  longitude: number;
  boundaryAdjusted: boolean;
};

/**
 * Tolerance in subdivision units, not degrees.
 * Resolves numerical noise at mathematical boundaries.
 */
export const DIVISIONAL_BOUNDARY_TOLERANCE = 1e-12;

export function normalizeDivisionalLongitude(
  longitude: number,
): number {
  if (!Number.isFinite(longitude)) {
    throw new RangeError(
      "Divisional longitude must be finite.",
    );
  }

  const remainder = longitude % 360;

  if (remainder === 0) return 0;

  const normalized =
    remainder < 0 ? remainder + 360 : remainder;

  return normalized === 360 ? 0 : normalized;
}

function getStartingSign(
  natalSignIndex: number,
  varga: SupportedDivision,
): number {
  if (varga === 9) {
    const modality = natalSignIndex % 3;

    if (modality === 0) {
      return natalSignIndex;
    }

    if (modality === 1) {
      return (natalSignIndex + 8) % 12;
    }

    return (natalSignIndex + 4) % 12;
  }

  // D10:
  // Odd signs begin from the natal sign.
  // Even signs begin from the ninth sign.
  return natalSignIndex % 2 === 0
    ? natalSignIndex
    : (natalSignIndex + 8) % 12;
}

export function calculateDivisionalPosition(
  longitude: number,
  varga: SupportedDivision,
): DivisionalPosition {
  if (varga !== 2 && varga !== 9 && varga !== 10) {
    throw new RangeError(
      "Only D2, D9 and D10 are currently supported.",
    );
  }

  const normalized =
    normalizeDivisionalLongitude(longitude);

  const rawSubdivision =
    (normalized * varga) / 30;

  const nearestBoundary =
    Math.round(rawSubdivision);

  const shouldSnap =
    Math.abs(rawSubdivision - nearestBoundary) <=
    DIVISIONAL_BOUNDARY_TOLERANCE;

  const adjustedSubdivision = shouldSnap
    ? nearestBoundary
    : rawSubdivision;

  const boundaryAdjusted =
    adjustedSubdivision !== rawSubdivision;

  const totalSubdivisions = 12 * varga;

  const globalSubdivision =
    Math.floor(adjustedSubdivision) %
    totalSubdivisions;

  const natalSignIndex =
    Math.floor(globalSubdivision / varga);

  const subdivisionIndex =
    globalSubdivision % varga;

  const fraction =
    adjustedSubdivision -
    Math.floor(adjustedSubdivision);

  const degree = fraction * 30;

  const signIndex =
    varga === 2
      ? natalSignIndex % 2 === 0
        ? subdivisionIndex === 0 ? 4 : 3
        : subdivisionIndex === 0 ? 3 : 4
      : (
          getStartingSign(natalSignIndex, varga) +
          subdivisionIndex
        ) % 12;

  const effectiveNatalLongitude = shouldSnap
    ? normalizeDivisionalLongitude(
        (adjustedSubdivision * 30) / varga,
      )
    : normalized;

  const natalDegree =
    effectiveNatalLongitude - natalSignIndex * 30;

  const divisionalLongitude =
    normalizeDivisionalLongitude(
      signIndex * 30 + degree,
    );

  return {
    varga,
    natalLongitude: effectiveNatalLongitude,
    natalSignIndex,
    natalSign: DIVISIONAL_SIGNS[natalSignIndex],
    natalDegree,
    subdivisionIndex,
    subdivisionNumber: subdivisionIndex + 1,
    signIndex,
    sign: DIVISIONAL_SIGNS[signIndex],
    degree,
    longitude: divisionalLongitude,
    boundaryAdjusted,
  };
}

export function calculateHora(
  longitude: number,
): DivisionalPosition {
  return calculateDivisionalPosition(longitude, 2);
}

export function calculateNavamsa(
  longitude: number,
): DivisionalPosition {
  return calculateDivisionalPosition(longitude, 9);
}

export function calculateDasamsa(
  longitude: number,
): DivisionalPosition {
  return calculateDivisionalPosition(longitude, 10);
}

export function calculateDivisionalHouse(
  ascendantSignIndex: number,
  planetSignIndex: number,
): number {
  for (const index of [
    ascendantSignIndex,
    planetSignIndex,
  ]) {
    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index > 11
    ) {
      throw new RangeError(
        "Divisional sign index must be an integer from 0 to 11.",
      );
    }
  }

  return (
    (planetSignIndex - ascendantSignIndex + 12) % 12
  ) + 1;
}