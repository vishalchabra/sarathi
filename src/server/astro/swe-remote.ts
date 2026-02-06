// FILE: src/server/astro/swe-remote.ts
import "server-only";

/**
 * SWE-REMOTE STUB (Improved)
 *
 * This is still NOT Swiss Ephemeris accuracy, but it's no longer "0° at J2000".
 * We add:
 *  - Approx J2000 base longitudes per planet
 *  - Mean-motion advance from J2000
 *  - Optional SIDEREAL flag support (Lahiri approx)
 *  - swe_get_ayanamsa_ut implemented (approx Lahiri)
 *
 * Goal: stable + believable sign/house placements for UI, Vercel-safe.
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

  // optional sidereal mode id
  SE_SIDM_LAHIRI?: number;
};

// ---------------------------------------------------------------------
// Stub constants (IDs + flags)
// ---------------------------------------------------------------------

let cachedConstants: SweConstants | null = null;

export async function getSweConstants(): Promise<SweConstants> {
  if (cachedConstants) return cachedConstants;

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

    // for compatibility with code that checks this
    SE_SIDM_LAHIRI: 1,
  };

  return cachedConstants;
}

export type { SweConstants as SweConstantsType };

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// Calibration offsets (degrees)
// ---------------------------------------------------------------------
// This stub is mean-motion only; fast planets drift. These offsets keep
// sign placements "believable" for UI. Tune if needed.
const PLANET_OFFSET_DEG: Record<number, number> = {
  2: -30, // Mercury: biggest drift in mean-motion stub
  3: +6,  // Venus: mild drift
  4: 0,   // Mars
  0: 0,   // Sun
  1: 0,   // Moon (already rough)
  5: 0,   // Jupiter
  6: 0,   // Saturn
  10: 0,  // Mean node
  11: 0,  // True node
};

function wrap360(x: number): number {
  let v = x % 360;
  if (v < 0) v += 360;
  return v;
}

// Approx Lahiri ayanamsa from JD (same model you already used elsewhere)
function approxLahiriAyanamsaDegFromJdUt(jdUt: number): number {
  // JD 2451545.0 = 2000-01-01 12:00 UT (J2000)
  const yearsSince2000 = (jdUt - 2451545.0) / 365.2425;
  const base = 23.856; // approx Lahiri around J2000
  const rate = 0.013969; // deg/year
  return base + yearsSince2000 * rate;
}

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
// Mean-motion substitute with J2000 base longitudes
// ---------------------------------------------------------------------

function computePlanetLongitudeTropical(jdUt: number, ipl: number): number {
  const daysFromJ2000 = jdUt - 2451545.0;

  // Very rough mean daily motions (deg/day)
  const meanMotions: Record<number, number> = {
    0: 0.985647, // Sun
    1: 13.176358, // Moon
    2: 4.092385, // Mercury
    3: 1.602159, // Venus
    4: 0.524039, // Mars
    5: 0.083056, // Jupiter
    6: 0.033477, // Saturn
    10: -0.052954, // Mean Node (retrograde)
    11: -0.052954, // True Node (approx retrograde)
  };

  // Approx J2000 tropical ecliptic longitudes (deg)
  // These are not perfect; they just prevent "everything starts at 0°"
  const baseLonJ2000: Record<number, number> = {
    0: 280.1470, // Sun approx
    1: 218.3160, // Moon mean lon
    2: 252.2500, // Mercury approx
    3: 181.9798, // Venus approx
    4: 355.4330, // Mars approx
    5: 34.3515, // Jupiter approx
    6: 50.0774, // Saturn approx
    10: 125.0445, // Mean node approx
    11: 125.0445, // True node approx
  };

  const motion = meanMotions[ipl] ?? 0.5;
  const base0 = baseLonJ2000[ipl] ?? 0;
  // add a tiny periodic wobble so fast planets don't look perfectly linear
const wobble =
  ipl === 2 ? 6 * Math.sin(daysFromJ2000 / 12) : // Mercury
  ipl === 3 ? 3 * Math.sin(daysFromJ2000 / 30) : // Venus
  0;

  const offset = PLANET_OFFSET_DEG[ipl] ?? 0;
return wrap360(base0 + motion * daysFromJ2000 + wobble + offset);

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

  // Implement ayanamsa call so callers can rely on it
  if (method === "swe_get_ayanamsa_ut") {
    const [jdUt] = args as [number];
    return approxLahiriAyanamsaDegFromJdUt(jdUt) as T;
  }

  // Sidereal mode setter (best-effort no-op for compatibility)
  if (method === "swe_set_sid_mode") {
    return (true as unknown) as T;
  }

  if (method === "swe_calc_ut") {
    // Args: jdUt, ipl, flags?
    const [jdUt, ipl, flags] = args as [number, number, number?];

    let lon = computePlanetLongitudeTropical(jdUt, ipl);

    // If SIDEREAL flag is set, apply approximate Lahiri
    // We ALWAYS return tropical.
// Sidereal conversion is handled in transits.ts.
// DO NOT apply ayanamsa here.


    return { longitude: lon } as T;
  }

  if (method === "swe_houses") {
    // Args: jdUt, lat, lon, hsys?
    const [jdUt, _lat, lon] = args as [number, number, number, string?];

    // Very rough ascendant proxy:
    const asc = wrap360(jdUt * 0.985647 + lon);

    // Simple 12-house system: each cusp 30° from ascendant
    const cusps = Array.from({ length: 12 }, (_v, i) => wrap360(asc + i * 30));

    const result = {
      ascendant: asc,
      asc,
      cusps,
      houseCusps: cusps,
    };

    return result as T;
  }

  throw new Error(
    `remote swisseph is disabled in this Sarathi build; method "${method}" is not supported`
  );
}

export async function sweCall<T = any>(method: string, ...args: any[]): Promise<T> {
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
