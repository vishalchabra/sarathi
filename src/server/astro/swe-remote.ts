// FILE: src/server/astro/swe-remote.ts
import "server-only";

/**
 * swe-remote.ts (REAL ephemeris via astronomy-engine)
 *
 * Implements a small subset of Swiss Ephemeris-like calls used by Sarathi:
 *  - swe_julday
 *  - swe_calc_ut       (NOW uses astronomy-engine EclipticLongitude)
 *  - swe_get_ayanamsa_ut (approx Lahiri, stable)
 *  - swe_set_sid_mode  (no-op, compatibility)
 *  - swe_houses        (simple 30° cusps, compatibility)
 *
 * IMPORTANT:
 *  - We ALWAYS return tropical longitude from swe_calc_ut.
 *  - Sidereal conversion (subtract ayanamsa) is handled in transits.ts and sweDailyMoon.ts.
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
// Stub constants (IDs + flags) - keep stable for the rest of the codebase
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

    // compatibility
    SE_SIDM_LAHIRI: 1,
  };

  return cachedConstants;
}

export type { SweConstants as SweConstantsType };

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

function wrap360(x: number): number {
  let v = x % 360;
  if (v < 0) v += 360;
  return v;
}

// Approx Lahiri ayanamsa from JD (same model you used earlier)
function approxLahiriAyanamsaDegFromJdUt(jdUt: number): number {
  // JD 2451545.0 = 2000-01-01 12:00 UT (J2000)
  const yearsSince2000 = (jdUt - 2451545.0) / 365.2425;
  const base = 23.856; // approx Lahiri around J2000
  const rate = 0.013969; // deg/year
  return base + yearsSince2000 * rate;
}

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
  const B = gregFlag === 1 ? 2 - A + Math.floor(A / 4) : 0;

  const jd =
    Math.floor(365.25 * (Y + 4716)) +
    Math.floor(30.6001 * (M + 1)) +
    D +
    B -
    1524.5;

  return jd;
}

/**
 * Convert Julian Day (UT) to a JS Date (UTC).
 * JD 2440587.5 = 1970-01-01T00:00:00Z
 */
function jdToDateUtc(jdUt: number): Date {
  const ms = (jdUt - 2440587.5) * 86400_000;
  return new Date(ms);
}

// ---------------------------------------------------------------------
// astronomy-engine loader + body mapping
// ---------------------------------------------------------------------

let _astronomyMod: any | null = null;
let _astronomyLoadTried = false;

async function getAstronomy(): Promise<any | null> {
  if (_astronomyMod) return _astronomyMod;
  if (_astronomyLoadTried) return null;

  _astronomyLoadTried = true;

  try {
    const mod = await import("astronomy-engine");
    // Some bundlers put it under default; be defensive:
    _astronomyMod = (mod as any)?.default ?? mod;

    if (process.env.NODE_ENV !== "production") {
      const keys = _astronomyMod && typeof _astronomyMod === "object" ? Object.keys(_astronomyMod) : [];
      console.log("[swe-remote] astronomy-engine loaded; keys sample:", keys.slice(0, 12));
    }

    return _astronomyMod;
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[swe-remote] astronomy-engine import failed; falling back to stub", e);
    }
    return null;
  }
}

function iplToBodyName(ipl: number): string | null {
  // Nodes are not reliably supported the same way; handle separately below.
  switch (ipl) {
    case 0: return "Sun";
    case 1: return "Moon";
    case 2: return "Mercury";
    case 3: return "Venus";
    case 4: return "Mars";
    case 5: return "Jupiter";
    case 6: return "Saturn";
    default: return null;
  }
}

function resolveBody(Astronomy: any, name: string): any {
  // astronomy-engine accepts either a string ("Moon") or enum value (Astronomy.Body.Moon).
  // Prefer enum if present.
  const BodyEnum = Astronomy?.Body;
  if (BodyEnum && typeof BodyEnum === "object") {
    return BodyEnum[name] ?? name;
  }
  return name;
}

// ---------------------------------------------------------------------
// Fallback (ONLY used if astronomy-engine is missing)
// ---------------------------------------------------------------------

function computePlanetLongitudeTropicalFallback(jdUt: number, ipl: number): number {
  const daysFromJ2000 = jdUt - 2451545.0;

  const meanMotions: Record<number, number> = {
    0: 0.985647, // Sun
    1: 13.176358, // Moon
    2: 4.092385, // Mercury
    3: 1.602159, // Venus
    4: 0.524039, // Mars
    5: 0.083056, // Jupiter
    6: 0.033477, // Saturn
    10: -0.052954, // Mean Node (retrograde) - rough
    11: -0.052954, // True Node (rough)
  };

  const baseLonJ2000: Record<number, number> = {
    0: 280.1470,
    1: 218.3160,
    2: 252.2500,
    3: 181.9798,
    4: 355.4330,
    5: 34.3515,
    6: 50.0774,
    10: 125.0445,
    11: 125.0445,
  };

  const motion = meanMotions[ipl] ?? 0.5;
  const base0 = baseLonJ2000[ipl] ?? 0;

  const wobble =
    ipl === 2 ? 6 * Math.sin(daysFromJ2000 / 12) :
    ipl === 3 ? 3 * Math.sin(daysFromJ2000 / 30) :
    0;

  return wrap360(base0 + motion * daysFromJ2000 + wobble);
}

// ---------------------------------------------------------------------
// Core "remote" call implementation
// ---------------------------------------------------------------------

async function callSwe<T = any>(payload: SweCallPayload): Promise<T> {
  const { method, args } = payload;

  if (method === "swe_julday") {
    const [y, m, d, h, gregFlag] = args as [number, number, number, number, number?];
    return computeJulday(y, m, d, h, gregFlag ?? 1) as T;
  }

  if (method === "swe_get_ayanamsa_ut") {
    const [jdUt] = args as [number];
    return approxLahiriAyanamsaDegFromJdUt(jdUt) as T;
  }

  // compatibility no-op
  if (method === "swe_set_sid_mode") {
    return (true as unknown) as T;
  }

  if (method === "swe_calc_ut") {
  const [jdUt, ipl, _flags] = args as [number, number, number?];

  // Nodes: astronomy-engine doesn't expose these as simple bodies the same way.
  // Keep a stable fallback for nodes so the rest of the engine doesn't crash.
  if (ipl === 10 || ipl === 11) {
    const lon = computePlanetLongitudeTropicalFallback(jdUt, ipl);
    return { longitude: lon } as T;
  }

  const Astronomy = await getAstronomy();
  const date = jdToDateUtc(jdUt);

  if (Astronomy) {
    const bodyName = iplToBodyName(ipl);

    if (!bodyName) {
      const lon = computePlanetLongitudeTropicalFallback(jdUt, ipl);
      if (process.env.NODE_ENV !== "production") {
        console.warn("[swe-remote] Unknown ipl; fallback used", { ipl, jdUt, lon });
      }
      return { longitude: lon } as T;
    }

    const body = resolveBody(Astronomy, bodyName);

          try {
        // Use AstroTime/MakeTime
const time =
  typeof (Astronomy as any).MakeTime === "function"
    ? (Astronomy as any).MakeTime(date)
    : new (Astronomy as any).AstroTime(date);

// ✅ Moon: prefer GeoMoon → Ecliptic (most reliable across builds)
// Fallback to EclipticGeoMoon if GeoMoon isn't available.
if (bodyName === "Moon") {
  // 1) Best: GeoMoon(time) → Ecliptic(vector)
  if (typeof (Astronomy as any).GeoMoon === "function") {
    const gv = (Astronomy as any).GeoMoon(time);
    const ecl = (Astronomy as any).Ecliptic(gv);
    const lon = Number(ecl?.elon ?? ecl?.lon);
    if (!Number.isFinite(lon)) throw new Error(`GeoMoon->Ecliptic non-finite: ${String(lon)}`);

    if (process.env.NODE_ENV !== "production") {
      console.log("[swe-remote] Moon via GeoMoon->Ecliptic", {
        date: date.toISOString(),
        lonTrop: lon,
      });
    }

    return { longitude: wrap360(lon) } as T;
  }

  // 2) Next best: EclipticGeoMoon(time)
  if (typeof (Astronomy as any).EclipticGeoMoon === "function") {
    const m = (Astronomy as any).EclipticGeoMoon(time);
    const lon = Number(m?.elon ?? m?.lon);
    if (!Number.isFinite(lon)) throw new Error(`EclipticGeoMoon non-finite: ${String(lon)}`);

    if (process.env.NODE_ENV !== "production") {
      console.log("[swe-remote] Moon via EclipticGeoMoon", {
        date: date.toISOString(),
        lonTrop: lon,
      });
    }

    return { longitude: wrap360(lon) } as T;
  }
}


// ✅ Generic: geocentric vector -> ecliptic longitude
const vec = (Astronomy as any).GeoVector(body, time, true);
const ecl = (Astronomy as any).Ecliptic(vec);
const lon = Number(ecl?.elon);

if (!Number.isFinite(lon)) throw new Error(`Ecliptic lon non-finite: ${String(lon)}`);
return { longitude: wrap360(lon) } as T;

      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[swe-remote] astronomy-engine failed; fallback used", {
            ipl,
            bodyName,
            date: date.toISOString(),
            err: String(e),
          });
        }
        const lon = computePlanetLongitudeTropicalFallback(jdUt, ipl);
        return { longitude: lon } as T;
      }
  }

  // No astronomy-engine => fallback
  const lon = computePlanetLongitudeTropicalFallback(jdUt, ipl);
  return { longitude: lon } as T;
}

  if (method === "swe_houses") {
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

  throw new Error(`swe-remote: method "${method}" is not supported`);
}

export async function sweCall<T = any>(method: string, ...args: any[]): Promise<T> {
  return callSwe<T>({ method, args });
}

export async function sweJulday(
  year: number,
  month: number,
  day: number,
  hour: number,
  gregFlag = 1
): Promise<number> {
  return sweCall<number>("swe_julday", year, month, day, hour, gregFlag);
}
