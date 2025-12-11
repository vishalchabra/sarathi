// FILE: src/server/astro/core.ts
export const runtime = "nodejs";

import "server-only";
import type { BirthInput } from "@/types";

/** Normalize 0..360 */
function norm360(x: number): number {
  let v = x % 360;
  return v < 0 ? v + 360 : v;
}

/**
 * UT Julian day for a given Date (in UTC), implemented with a pure
 * TypeScript algorithm (no Swiss Ephemeris).
 *
 * Returned value is a Julian Day including fractional day for time of day.
 */
export async function julianDayUTC(date: Date): Promise<number> {
  let year = date.getUTCFullYear();
  let month = date.getUTCMonth() + 1;
  let day =
    date.getUTCDate() +
    (date.getUTCHours() +
      (date.getUTCMinutes() + date.getUTCSeconds() / 60) / 60) /
      24;

  // Shift Jan/Feb to month 13/14 of previous year
  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 100);

  const jd =
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5;

  return jd;
}

/**
 * Sidereal planet longitude (Lahiri) – LEGACY STUB.
 *
 * Swiss Ephemeris (native/WASM) has been removed from the build, so this
 * function no longer performs real planetary calculations. It exists only
 * so older code paths that still import `siderealLon` can compile without
 * pulling in swisseph.
 *
 * Any new astro logic should use the dedicated TS providers (transits,
 * placements, panchang, etc.) instead of this helper.
 */
export async function siderealLon(
  _utc: Date,
  _planet: number
): Promise<number | null> {
  // TODO: Wire to a pure TypeScript placements engine if still needed.
  return null;
}

/** Minimal natal shape used by life report / engine */
export type Natal = { planets: Partial<Record<number, number>> };

/**
 * LEGACY STUB: Compute D1 planet longitudes.
 *
 * The original implementation depended on Swiss Ephemeris. To keep the
 * Vercel build fully SWE-free, this now returns an empty planets map.
 *
 * Any real natal computations should come from the new astro providers
 * (e.g., a TS-based placements engine) rather than this function.
 */
export async function getNatal(_birth?: BirthInput): Promise<Natal> {
  return { planets: {} };
}
