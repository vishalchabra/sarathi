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
function julianCenturiesSinceJ2000(jdUt: number): number {
  return (jdUt - 2451545.0) / 36525.0;
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180.0;
}

function computeLunarMeanNodeLongitudeTropical(jdUt: number): number {
  const t = julianCenturiesSinceJ2000(jdUt);

  const omega =
    125.0445479 +
    (-1934.1362891 +
      (0.0020754 +
        (1.0 / 476441.0 - t / 60616000.0) * t) *
        t) *
      t;

  return wrap360(omega);
}

function computeLunarTrueNodeLongitudeTropical(jdUt: number): number {
  const t = julianCenturiesSinceJ2000(jdUt);

  const omegaMean = computeLunarMeanNodeLongitudeTropical(jdUt);

  const D =
    297.8501921 +
    (445267.1114034 +
      (-0.0018819 +
        (1.0 / 545868.0 - t / 113065000.0) * t) *
        t) *
      t;

  const M =
    357.5291092 +
    (35999.0502909 + (-0.0001536 + t / 24490000.0) * t) * t;

  const Mprime =
    134.9633964 +
    (477198.8675055 +
      (0.0087414 +
        (1.0 / 69699.9 + t / 14712000.0) * t) *
        t) *
      t;

  const F =
    93.2720950 +
    (483202.0175233 +
      (-0.0036539 +
        (-1.0 / 3526000.0 + t / 863310000.0) * t) *
        t) *
      t;

  const Dr = degToRad(wrap360(D));
  const Mr = degToRad(wrap360(M));
  const Mprimer = degToRad(wrap360(Mprime));
  const Fr = degToRad(wrap360(F));

  const corr =
    -1.4979 * Math.sin(2.0 * (Dr - Fr)) -
    0.15 * Math.sin(Mr) -
    0.1226 * Math.sin(2.0 * Dr) +
    0.1176 * Math.sin(2.0 * Fr) -
    0.0801 * Math.sin(2.0 * (Mprimer - Fr));

  return wrap360(omegaMean + corr);
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
  // ✅ Handle Rahu (true node) using astronomy-engine
if (ipl === 10 || ipl === 11) {
  // 10 = SE_MEAN_NODE, 11 = SE_TRUE_NODE
  const lon =
    ipl === 11
      ? computeLunarTrueNodeLongitudeTropical(jdUt)
      : computeLunarMeanNodeLongitudeTropical(jdUt);

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
const NAKSHATRA_NAMES = [
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
  "Dhanishtha",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

function getNakshatraFromLon(lon: number) {
  const x = wrap360(lon);
  const nakSpan = 360 / 27; // 13°20'
  const idx = Math.floor(x / nakSpan);
  const withinNak = x % nakSpan;
  const pada = Math.floor(withinNak / (nakSpan / 4)) + 1;

  return {
    nakshatra: NAKSHATRA_NAMES[idx] ?? null,
    pada,
  };
}
export async function getPlanetPositions(input: {
  dateISO: string;
  tz?: string;
  lat: number;
  lon: number;
}) {
  const { dateISO, lat, lon } = input;

  const d = new Date(dateISO);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid dateISO passed to getPlanetPositions: ${dateISO}`);
  }

  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const hour =
    d.getUTCHours() +
    d.getUTCMinutes() / 60 +
    d.getUTCSeconds() / 3600;

  const C = await getSweConstants();
  const jdUt = await sweJulday(year, month, day, hour, C.SE_GREG_CAL);

  const houseData = await sweCall<any>("swe_houses", jdUt, lat, lon, "P");
  const cusps: number[] =
    houseData?.cusps || houseData?.houseCusps || [];

  const planetMap: Array<{ id: keyof SweConstants | string; name: string; ipl: number }> = [
    { id: "SE_SUN", name: "Sun", ipl: C.SE_SUN },
    { id: "SE_MOON", name: "Moon", ipl: C.SE_MOON },
    { id: "SE_MERCURY", name: "Mercury", ipl: C.SE_MERCURY },
    { id: "SE_VENUS", name: "Venus", ipl: C.SE_VENUS },
    { id: "SE_MARS", name: "Mars", ipl: C.SE_MARS },
    { id: "SE_JUPITER", name: "Jupiter", ipl: C.SE_JUPITER },
    { id: "SE_SATURN", name: "Saturn", ipl: C.SE_SATURN },
    { id: "SE_MEAN_NODE", name: "Rahu", ipl: C.SE_MEAN_NODE },
  ];

  const ayanamsa = await sweCall<number>("swe_get_ayanamsa_ut", jdUt);

  const planets = [];
  for (const p of planetMap) {
    const calc = await sweCall<any>(
      "swe_calc_ut",
      jdUt,
      p.ipl,
      C.SEFLG_SWIEPH | C.SEFLG_SPEED
    );

    const tropicalLon = Number(calc?.longitude ?? 0);
    const siderealLon = wrap360(tropicalLon - ayanamsa);
    const sign = zodiacSignFromLon(siderealLon);
    const house = houseFromLon(siderealLon, cusps);
    const deg = siderealLon % 30;

    const nak = getNakshatraFromLon(siderealLon);

planets.push({
  id: p.name,
  name: p.name,
  sign,
  house,
  deg,
  siderealLongitude: siderealLon,
  nakshatra: nak.nakshatra,
  pada: nak.pada,
});
  }

  // Ketu from Rahu
  const rahu = planets.find((p) => p.name === "Rahu");
  if (rahu) {
    const ketuLon = wrap360(Number(rahu.siderealLongitude) + 180);
    const ketuNak = getNakshatraFromLon(ketuLon);

planets.push({
  id: "Ketu",
  name: "Ketu",
  sign: zodiacSignFromLon(ketuLon),
  house: houseFromLon(ketuLon, cusps),
  deg: ketuLon % 30,
  siderealLongitude: ketuLon,
  nakshatra: ketuNak.nakshatra,
  pada: ketuNak.pada,
});
  }

  return { planets, houseCusps: cusps };
}

function zodiacSignFromLon(lon: number): string {
  const signs = [
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
  return signs[Math.floor(wrap360(lon) / 30)] ?? "Aries";
}

function houseFromLon(lon: number, cusps: number[]): number {
  if (!Array.isArray(cusps) || cusps.length < 12) return 1;

  const x = wrap360(lon);

  for (let i = 0; i < 12; i++) {
    const start = wrap360(cusps[i]);
    const end = wrap360(cusps[(i + 1) % 12]);

    if (start <= end) {
      if (x >= start && x < end) return i + 1;
    } else {
      if (x >= start || x < end) return i + 1;
    }
  }

  return 1;
}