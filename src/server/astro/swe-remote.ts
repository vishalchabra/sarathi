// FILE: src/server/astro/swe-remote.ts
import "server-only";

/**
 * SWE-REMOTE STUB
 *
 * Originally this file proxied to a separate Swiss Ephemeris engine
 * over HTTP (ENGINE_URL /swe, /constants). That doesn't work on Vercel
 * when pointing to localhost, and we've removed all real SWE/WASM usage
 * from the app.
 *
 * This module now provides:
 * - A local `sweJulday` (no network, no SWE)
 * - A stub `swe_calc_ut` implemented via simple mean motions
 * - A generic `sweCall` dispatcher
 * - Stub constants so legacy callers compile
 */

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------

type SweCallPayload = { method: string; args: any[] };

export type SweConstants = {
  SE_GREG_CAL: number;
  SE_SUN: number;
  SE_MOON: number;
  SE_MERCURY: number;
  SE_VENUS: number;
  SE_MARS: number;
  SE_JUPITER: number;
  SE_SATURN: number;
  SE_MEAN_NODE: number;
  SE_TRUE_NODE: number;
  SEFLG_SWIEPH: number;
  SEFLG_SIDEREAL: number;
  SEFLG_SPEED: number;
};

// ---------------------------------------------------------------------
// Stub constants (IDs + flags)
// ---------------------------------------------------------------------

let cachedConstants: SweConstants | null = null;

export async function getSweConstants(): Promise<SweConstants> {
  if (cachedConstants) return cachedConstants;

  // Placeholder IDs & flags so legacy code can still refer to them.
  cachedConstants = {
    SE_GREG_CAL: 1,
    SE_SUN: 0,
    SE_MOON: 1,
    SE_MERCURY: 2,
    SE_VENUS: 3,
    SE_MARS: 4,
    SE_JUPITER: 5,
    SE_SATURN: 6,
    SE_MEAN_NODE: 10,
    SE_TRUE_NODE: 11,
    SEFLG_SWIEPH: 2,
    SEFLG_SIDEREAL: 64,
    SEFLG_SPEED: 256,
  };

  return cachedConstants;
}

// Convenience accessor so callers can do:
//   const { SE_SUN, ... } = await getSweConstants();
export type { SweConstants as SweConstantsType };

// ---------------------------------------------------------------------
// Local Julian Day calculator (no SWE, no network)
// ---------------------------------------------------------------------

function computeJulday(
  year: number,
  month: number,
  day: number,
  hour: number,
  gregFlag = 1
): number {
  // Standard astronomical JD formula; gregFlag is kept for API parity
  // but not treated differently here (we assume Gregorian dates).
  let Y = year;
  let M = month;
  let D = day + hour / 24;

  if (M <= 2) {
    Y -= 1;
    M += 12;
  }

  const A = Math.floor(Y / 100);
  const B = gregFlag === 1 ? 2 - A + Math.floor(A / 100) : 0;

  const jd =
    Math.floor(365.25 * (Y + 4716)) +
    Math.floor(30.6001 * (M + 1)) +
    D +
    B -
    1524.5;

  return jd;
}

// ---------------------------------------------------------------------
// Very rough swe_calc_ut substitute (mean motions)
// ---------------------------------------------------------------------

function computePlanetLongitude(jdUt: number, ipl: number): number {
  // Use J2000.0 as reference
  const daysFromJ2000 = jdUt - 2451545.0;

  // Simple mean daily motions (deg/day), VERY approximate:
  const meanMotions: Record<number, number> = {
    0: 0.985647, // Sun
    1: 13.176358, // Moon
    2: 4.092385, // Mercury
    3: 1.602159, // Venus
    4: 0.524039, // Mars
    5: 0.083056, // Jupiter
    6: 0.033477, // Saturn
    10: -0.052954, // Mean Node (retrograde)
    11: -0.052954, // True Node (retrograde-ish)
  };

  const motion = meanMotions[ipl] ?? 0.5;
  const baseLon = motion * daysFromJ2000;

  // Just wrap into 0..360; we don't bother with proper starting phases.
  const lon = ((baseLon % 360) + 360) % 360;
  return lon;
}

// ---------------------------------------------------------------------
// Core "remote" call stub
// ---------------------------------------------------------------------

async function callSwe<T = any>(payload: SweCallPayload): Promise<T> {
  const { method, args } = payload;

  if (method === "swe_julday") {
    const [y, m, d, h, gregFlag] = args as [
      number,
      number,
      number,
      number,
      number?
    ];
    return computeJulday(y, m, d, h, gregFlag ?? 1) as T;
  }

  if (method === "swe_calc_ut") {
    const [jdUt, ipl] = args as [number, number, number?];
    const lon = computePlanetLongitude(jdUt, ipl);
    // Shape modeled after common swisseph bindings: { longitude: number }
    return { longitude: lon } as T;
  }

  if (method === "swe_houses") {
    // Args: jdUt, lat, lon, hsys
    const [jdUt, lat, lon] = args as [number, number, number, string?];

    // Very rough ascendant:
    // - Use jdUt as time variable
    // - Add longitude so Eastern places rotate chart a bit
    const asc = ((jdUt * 0.985647 + lon) % 360 + 360) % 360;

    // Simple 12-house system: each cusp 30° from ascendant
    const cusps = Array.from({ length: 12 }, (_v, i) =>
      ((asc + i * 30) % 360 + 360) % 360
    );

    const result = {
      ascendant: asc,
      asc,
      cusps,
      houseCusps: cusps,
    };

    return result as T;
  }

  // Any other SWE methods are not supported in this stubbed, SWE-free build.
  throw new Error(
    `remote swisseph is disabled in this Sarathi build; method "${method}" is not supported`
  );
}


export async function sweCall<T = any>(
  method: string,
  ...args: any[]
): Promise<T> {
  return callSwe<T>({ method, args });
}

// Convenience wrapper for swe_julday
export async function sweJulday(
  year: number,
  month: number,
  day: number,
  hour: number,
  gregFlag = 1
): Promise<number> {
  return sweCall<number>("swe_julday", year, month, day, hour, gregFlag);
}
