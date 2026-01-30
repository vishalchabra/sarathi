// FILE: src/server/astro/transits.ts

import "server-only";
import {
  sweJulday,
  sweCall,
  getSweConstants,
} from "@/server/astro/swe-remote";
const DEBUG_TRANSITS = process.env.DEBUG_TRANSITS === "1";

export type TransitEngineBirth = {
  dateISO: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  tz: string; // IANA tz, e.g. "Asia/Dubai"
  lat: number;
  lon: number;
};

export type TransitHit = {
  id: string;
  startISO: string;
  endISO: string;

  planet: string; // transiting planet
  target: string; // e.g. "conjunction natal Rahu"

  category: "career" | "relationships" | "health" | "inner" | "general";
  strength: number;

  // ✅ NEW: transit placement at the strongest hit day (sidereal)
  transitLon?: number;     // 0..360 sidereal (sample at startISO)
  transitSign?: string;    // Capricorn, etc.
  transitHouse?: number;   // 1..12 from Lagna (if ascDeg provided)
  natalLon?: number;       // for the natal target planet (for debugging)

  title: string;
  description: string;
};


// NEW: daily Moon sample for horizon
export type DailyMoonSample = {
  dateISO: string;
  lon: number; // sidereal longitude 0..360
  nakshatra: string; // Moon's nakshatra that day
  houseFromMoon?: number; // 1..12 from natal Moon (Chandra Lagna)
};

/* -------------------------------------------------------
   BASIC DATE / DEGREE HELPERS
-------------------------------------------------------- */

function startOfDayUTC(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
}


function addDaysUTC(d: Date, days: number): Date {
  return new Date(d.getTime() + days * 86_400_000);
}


function fmtISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function dateISOInTz(d: Date, tz: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}
function lonToDegreesMaybe(x: number): number {
  // Radians will always be between 0 and 2π (~6.28318)
  if (x >= 0 && x <= 6.283185307179586) {
    return (x * 180) / Math.PI;
  }
  return x; // assume degrees already
}


function wrap360(x: number): number {
  let v = x % 360;
  if (v < 0) v += 360;
  return v;
}

// smallest angular distance between two longitudes, 0..180
function angleDiff(a: number, b: number): number {
  const d = Math.abs(wrap360(a) - wrap360(b));
  return d > 180 ? 360 - d : d;
}

/* -------------------------------------------------------
   TIME → JULIAN DAY HELPERS (same semantics as before)
-------------------------------------------------------- */

function parseGmtOffsetMinutes(label: string): number | undefined {
  const m = /GMT([+-]\d{1,2})(?::?(\d{2}))?/.exec(label);
  if (!m) return;
  const h = parseInt(m[1], 10);
  const min = m[2] ? parseInt(m[2], 10) : 0;
  return h * 60 + (h >= 0 ? min : -min);
}

function tzOffsetMinutesAt(tz: string, probeUtc: Date): number {
  const s = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    timeZoneName: "shortOffset",
  }).format(probeUtc);
  return parseGmtOffsetMinutes(s) ?? 0;
}

function makeUtcInstant(dateISO: string, time: string, tz: string): Date {
  const [H, M] = time.split(":").map(Number);

  const pretendUtc = new Date(
    Date.UTC(
      +dateISO.slice(0, 4),
      +dateISO.slice(5, 7) - 1,
      +dateISO.slice(8, 10),
      H,
      M,
      0,
      0
    )
  );

  const off = tzOffsetMinutesAt(tz, pretendUtc);
  return new Date(pretendUtc.getTime() - off * 60_000);
}

async function jdFromDateUTC(date: Date, SE_GREG_CAL: number): Promise<number> {
  // Use UTC pieces only
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1; // JS month is 0-11, Swiss needs 1-12
  const d = date.getUTCDate();

  const hour =
    date.getUTCHours() +
    date.getUTCMinutes() / 60 +
    date.getUTCSeconds() / 3600 +
    date.getUTCMilliseconds() / 3600000;

  // Swiss: swe_julday(year, month, day, hour, gregflag)
  const jd = await sweCall<number>("swe_julday", y, m, d, hour, SE_GREG_CAL);

  // Debug once
  // console.log("[JD_UTC]", date.toISOString(), { y, m, d, hour, jd });

  return jd;
}

async function lahiriAyanamsaDeg(jdUt: number): Promise<number> {
  try {
    const res = await sweCall<any>("swe_get_ayanamsa_ut", jdUt);

    // Most engines return a number or { ayanamsa: number }
    if (typeof res === "number") return res;
    if (res && typeof res.ayanamsa === "number") return res.ayanamsa;

    // fallback: try common formats
    if (Array.isArray(res) && typeof res[0] === "number") return res[0];

    return 0;
  } catch (e) {
    // SWE remote disabled in this build → use approximation so transits don't become empty.
    return approxLahiriAyanamsaDegFromJdUt(jdUt);
  }
}

function approxLahiriAyanamsaDegFromJdUt(jdUt: number): number {
  // Convert JD to approximate Gregorian year fraction (good enough for fallback)
  // JD 2451545.0 = 2000-01-01 12:00 UT (J2000)
  const yearsSince2000 = (jdUt - 2451545.0) / 365.2425;

  // Lahiri around J2000 is ~23.856° and increases ~0.013969° per year
  const base = 23.856;
  const rate = 0.013969;

  return base + yearsSince2000 * rate;
}

function toSiderealLon(tropicalLon: number, ayanDeg: number): number {
  return wrap360(tropicalLon - ayanDeg);
}

/* -------------------------------------------------------
   REMOTE SWE HELPERS
-------------------------------------------------------- */

function extractLongitude(res: any): number {
  // 1) Direct object shape
  if (res && typeof res === "object") {
    // Common: { longitude, latitude, distance, speedLongitude... }
    if (typeof res.longitude === "number") return res.longitude;

    // Common: { lon, lat, ... }
    if (typeof res.lon === "number") return res.lon;

    // Common: { xx: [lon, lat, dist, speedLon, ...] }
    if (Array.isArray(res.xx) && typeof res.xx[0] === "number") return res.xx[0];

    // Common: { data: [lon, lat, ...] }
    if (Array.isArray(res.data) && typeof res.data[0] === "number") return res.data[0];

    // Common: { position: { lon: ... } }
    if (res.position && typeof res.position.lon === "number") return res.position.lon;
    if (res.position && typeof res.position.longitude === "number") return res.position.longitude;
  }

  // 2) Raw array shape: [lon, lat, dist, ...]
  if (Array.isArray(res) && typeof res[0] === "number") return res[0];

  throw new Error("Unable to extract longitude from swe response");
}


async function ensureSiderealMode(constants: any) {
  try {
    if (constants.SE_SIDM_LAHIRI != null) {
      await sweCall(
        "swe_set_sid_mode",
        constants.SE_SIDM_LAHIRI,
        0,
        0
      );
    }
  } catch {
    // best-effort, engine may already be set
  }
}

/* -------------------------------------------------------
   NAKSHATRA LIST FOR MOON DAILY
-------------------------------------------------------- */

const NAKS_27 = [
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
];

function nakIndexFromDeg(deg: number): number {
  const span = 360 / 27;
  return Math.floor(wrap360(deg) / span);
}

function nakFromDegSidereal(deg: number): string {
  return NAKS_27[nakIndexFromDeg(deg)];
}
const SIGNS_12 = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];

function signIndexFromDegSidereal(deg: number): number {
  return Math.floor(wrap360(deg) / 30); // 0..11
}

function signFromDegSidereal(deg: number): string {
  return SIGNS_12[signIndexFromDegSidereal(deg)];
}
function signFromLonSidereal(lon: number): string {
  return SIGNS_12[Math.floor(wrap360(lon) / 30)];
}

function houseFromAsc(ascDeg: number, lon: number): number {
  const rel = wrap360(lon - ascDeg);
  return Math.floor(rel / 30) + 1; // 1..12
}
function houseFromLagnaWholeSign(transitSign: string, ascSign?: string): number | undefined {
  if (!ascSign) return undefined;
  const a = SIGNS_12.findIndex((s) => s.toLowerCase() === String(ascSign).toLowerCase());
  const t = SIGNS_12.findIndex((s) => s.toLowerCase() === String(transitSign).toLowerCase());
  if (a < 0 || t < 0) return undefined;
  return ((t - a + 12) % 12) + 1; // 1..12
}

/* -------------------------------------------------------
   NATAL & TRANSIT PLANETS (SIDEREAL)
-------------------------------------------------------- */

type NatalPlanet = {
  name: string;
  lon: number; // sidereal longitude 0..360
};

type TransitPlanet = {
  name: string;
  lon: number; // sidereal longitude 0..360
};

/**
 * Compute natal longitudes (sidereal) using the remote engine.
 */
async function computeNatalPlanets(
  birth: TransitEngineBirth,
  constants: any
): Promise<NatalPlanet[]> {
  await ensureSiderealMode(constants);

  const birthUtc = makeUtcInstant(birth.dateISO, birth.time, birth.tz);
  const jdUt = await jdFromDateUTC(birthUtc, constants.SE_GREG_CAL);
  
// Use SIDEREAL flag (stub now supports it); do NOT manually subtract ayanamsa here.
const flags =
  (constants.SEFLG_SWIEPH ?? 2) |
  (constants.SEFLG_SPEED ?? 256) |
  (constants.SEFLG_SIDEREAL ?? 64);


  const defs = [
    { name: "Sun", code: constants.SE_SUN },
    { name: "Moon", code: constants.SE_MOON },
    { name: "Mercury", code: constants.SE_MERCURY },
    { name: "Venus", code: constants.SE_VENUS },
    { name: "Mars", code: constants.SE_MARS },
    { name: "Jupiter", code: constants.SE_JUPITER },
    { name: "Saturn", code: constants.SE_SATURN },
    { name: "Rahu", code: constants.SE_TRUE_NODE },
    { name: "Ketu", code: constants.SE_TRUE_NODE }, // +180°
  ];

  const out: NatalPlanet[] = [];

  for (const p of defs) {
    if (p.code == null) continue;
    const res = await sweCall<any>(
      "swe_calc_ut",
      jdUt,
      p.code,
      flags
    );
    const lonRaw = extractLongitude(res);
if (typeof lonRaw !== "number" || !isFinite(lonRaw)) continue;

// ✅ normalize radians → degrees if needed
const lonDeg = lonToDegreesMaybe(lonRaw);

let lon = wrap360(lonDeg);
if (p.name === "Ketu") {
  lon = wrap360(lon + 180);
}
out.push({ name: p.name, lon });

  }

  return out;
}

/**
 * Transit planets (Sun, Mercury, Venus, Mars, Jupiter, Saturn)
 * for a specific UTC date.
 */
async function computeTransitPlanetsForDay(
  date: Date,
  constants: any
): Promise<TransitPlanet[]> {
  await ensureSiderealMode(constants);

    const jdUt = await jdFromDateUTC(date, constants.SE_GREG_CAL);

  // Use SIDEREAL flag (stub now supports it); do NOT manually subtract ayanamsa.
  const flags =
    (constants.SEFLG_SWIEPH ?? 2) |
    (constants.SEFLG_SPEED ?? 256) |
    (constants.SEFLG_SIDEREAL ?? 64);

  const defs = [
    { name: "Sun", code: constants.SE_SUN },
    { name: "Mercury", code: constants.SE_MERCURY },
    { name: "Venus", code: constants.SE_VENUS },
    { name: "Mars", code: constants.SE_MARS },
    { name: "Jupiter", code: constants.SE_JUPITER },
    { name: "Saturn", code: constants.SE_SATURN },
  ];

  const out: TransitPlanet[] = [];

  for (const p of defs) {
    if (p.code == null) continue;

    const res = await sweCall<any>("swe_calc_ut", jdUt, p.code, flags);
    const lonRaw = extractLongitude(res);
    if (typeof lonRaw !== "number" || !isFinite(lonRaw)) continue;
    
    // Engine returns degrees; with SIDEREAL flag it is already sidereal (Lahiri approx in stub).
    const lonSidereal = wrap360(lonRaw);
    out.push({ name: p.name, lon: lonSidereal });

  }

  return out;
}
/* -------------------------------------------------------
   ASPECT DETECTION (Hybrid Vedic + Western degree aspects)
-------------------------------------------------------- */

type AspectKind =
  | "conjunction"
  | "opposition"
  | "trine"
  | "square"
  | "sextile";

type AspectHit = {
  aspect: AspectKind;
  exactDiff: number; // degrees off exact aspect
  strength: number; // 0..1 basic
};

const ASPECT_DEFS: {
  aspect: AspectKind;
  angle: number;
  orb: number;
}[] = [
  { aspect: "conjunction", angle: 0, orb: 6 },
  { aspect: "opposition", angle: 180, orb: 6 },
  { aspect: "trine", angle: 120, orb: 5 },
  { aspect: "square", angle: 90, orb: 4 },
  { aspect: "sextile", angle: 60, orb: 3 },
];

function detectAspect(
  transitLon: number,
  natalLon: number
): AspectHit | null {
  const diff = angleDiff(transitLon, natalLon);
  let best: AspectHit | null = null;

  for (const def of ASPECT_DEFS) {
    const delta = Math.abs(diff - def.angle);
    if (delta <= def.orb) {
      const base =
        def.aspect === "conjunction"
          ? 1
          : def.aspect === "opposition"
          ? 0.9
          : def.aspect === "trine"
          ? 0.85
          : def.aspect === "square"
          ? 0.8
          : 0.7;
      const proximity = 1 - delta / def.orb; // 1 at exact, 0 at edge
      const strength = Math.max(0.1, base * (0.6 + 0.4 * proximity));

      if (!best || strength > best.strength) {
        best = { aspect: def.aspect, exactDiff: delta, strength };
      }
    }
  }

  return best;
}

/* -------------------------------------------------------
   CATEGORY CLASSIFIER (high-level, by transit planet)
-------------------------------------------------------- */

type TransitCategory =
  | "career"
  | "relationships"
  | "health"
  | "inner"
  | "general";

function classifyCategory(
  transitName: string,
  natalName: string
): TransitCategory {
  const t = transitName.toLowerCase();
  const n = natalName.toLowerCase();

  if (t === "jupiter" || (t === "sun" && n !== "moon")) {
    return "career";
  }
  if (t === "saturn") {
    if (n === "moon" || n === "sun") return "health";
    return "inner";
  }
  if (t === "venus" || n === "venus" || n === "moon") {
    return "relationships";
  }
  if (t === "mars") {
    if (n === "moon" || n === "ascendant") return "health";
    return "career";
  }
  if (t === "mercury") {
    return "general";
  }
  return "general";
}

/* -------------------------------------------------------
   CORE: BUILD RAW DAILY HITS FOR HORIZON (for transits)
-------------------------------------------------------- */

type RawDailyHit = {
  dateISO: string;
  transitPlanet: string;
  transitLon: number;   // ✅
  natalPlanet: string;
  natalLon: number;     // ✅ (optional but useful)
  aspect: AspectKind;
  category: TransitCategory;
  strength: number;
  
};


async function buildRawDailyHits(
  birth: TransitEngineBirth,
  horizonDays: number
): Promise<RawDailyHit[]> {
  const constants = await getSweConstants();
  const natal = await computeNatalPlanets(birth, constants);

  // Anchor "today" to the user's timezone midnight, then convert to UTC.
const tz = birth.tz; // you can also pass notification tz via opts if you want
const now = new Date();
const parts = new Intl.DateTimeFormat("en-CA", {
  timeZone: tz,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour12: false,
}).formatToParts(now);

const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
const todayISO = `${get("year")}-${get("month")}-${get("day")}`;

// midnight in that tz -> UTC instant
const today = makeUtcInstant(todayISO, "00:00", tz);

  const horizon = Math.max(7, Math.min(horizonDays, 730)); // clamp

  const hits: RawDailyHit[] = [];

  for (let i = 0; i < horizon; i++) {
    const day = addDaysUTC(today, i);
    const dateISO = dateISOInTz(day, tz);


    const tPlanets = await computeTransitPlanetsForDay(
      day,
      constants
    );

    for (const tp of tPlanets) {
      for (const np of natal) {
        const asp = detectAspect(tp.lon, np.lon);
        if (!asp) continue;

        const category = classifyCategory(tp.name, np.name);

        hits.push({
  dateISO,
  transitPlanet: tp.name,
  transitLon: tp.lon,     // ✅
  natalPlanet: np.name,
  natalLon: np.lon,       // ✅
  aspect: asp.aspect,
  category,
  strength: asp.strength,
});

      }
    }
  }

  return hits;
}

/* -------------------------------------------------------
   MOON DAILY PATH (nakshatra + house from natal Moon)
-------------------------------------------------------- */

export async function computeDailyMoonForHorizon(
  birth: TransitEngineBirth,
  horizonDays: number
): Promise<DailyMoonSample[]> {
  const constants = await getSweConstants();
  await ensureSiderealMode(constants);

  const natal = await computeNatalPlanets(birth, constants);
  const natalMoon = natal.find((p) => p.name === "Moon") || null;

  // Anchor "today" to the user's timezone midnight, then convert to UTC.
const tz = birth.tz; // you can also pass notification tz via opts if you want
const now = new Date();
const parts = new Intl.DateTimeFormat("en-CA", {
  timeZone: tz,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour12: false,
}).formatToParts(now);

const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
const todayISO = `${get("year")}-${get("month")}-${get("day")}`;

// midnight in that tz -> UTC instant
const today = makeUtcInstant(todayISO, "00:00", tz);

  const horizon = Math.max(7, Math.min(horizonDays, 730)); // clamp

 const flags =
  (constants.SEFLG_SWIEPH ?? 2) |
  (constants.SEFLG_SPEED ?? 256) |
  (constants.SEFLG_SIDEREAL ?? 64);


  const out: DailyMoonSample[] = [];

  for (let i = 0; i < horizon; i++) {
    const day = addDaysUTC(today, i);
    const dateISO = dateISOInTz(day, tz);


    const jdUt = await jdFromDateUTC(day, constants.SE_GREG_CAL);

const res = await sweCall<any>(
  "swe_calc_ut",
  jdUt,
  constants.SE_MOON,
  flags
);

const lonRaw = extractLongitude(res);
if (typeof lonRaw !== "number" || !isFinite(lonRaw)) continue;

// ✅ normalize radians → degrees if needed
const lonDeg = lonToDegreesMaybe(lonRaw);

// With SIDEREAL flag, this is already sidereal for nakshatra usage.
const lon = wrap360(lonDeg);
const nakshatra = nakFromDegSidereal(lon);

    let houseFromMoon: number | undefined = undefined;
    if (natalMoon) {
      const rel = wrap360(lon - natalMoon.lon); // 0–360 from natal Moon
      houseFromMoon = Math.floor(rel / 30) + 1; // 1..12
    }

    out.push({
      dateISO,
      lon,
      nakshatra,
      houseFromMoon,
    });
  }

  return out;
}

/* -------------------------------------------------------
   WINDOW BUILDER – MERGE DAILY HITS INTO WINDOWS
-------------------------------------------------------- */

type WindowAccumulator = {
  category: TransitCategory;
  planet: string; // transiting planet
  natalPlanet: string; // ✅ keep hits separated by natal target
  aspect: AspectKind;   // ✅ keep hits separated by aspect kind
  startISO: string;
  endISO: string;
  maxStrength: number;
  hits: RawDailyHit[];
};


function daysBetweenISO(a: string, b: string): number {
  const d1 = new Date(a + "T00:00:00Z").getTime();
  const d2 = new Date(b + "T00:00:00Z").getTime();
  return Math.round((d2 - d1) / 86_400_000);
}

function buildWindowsFromHits(
  hits: RawDailyHit[],
  opts?: { ascDeg?: number; ascSign?: string }
): TransitHit[] {

  if (!hits.length) return [];

  
  // Sort by date
  hits.sort((a, b) =>
    a.dateISO < b.dateISO ? -1 : a.dateISO > b.dateISO ? 1 : 0
  );

  const windows: WindowAccumulator[] = [];
  const MAX_GAP_DAYS = 5;

  for (const h of hits) {
    const keyCat = h.category;
    const keyPlanet = h.transitPlanet;
    const keyNatal = h.natalPlanet;
    const keyAspect = h.aspect;

    let attached = false;

    for (const w of windows) {
      if (w.category !== keyCat) continue;
      if (w.planet !== keyPlanet) continue;
      if (w.natalPlanet !== keyNatal) continue;
      if (w.aspect !== keyAspect) continue;

      const gap = daysBetweenISO(w.endISO, h.dateISO);
      if (gap >= 0 && gap <= MAX_GAP_DAYS) {
        if (h.dateISO > w.endISO) w.endISO = h.dateISO;
        w.maxStrength = Math.max(w.maxStrength, h.strength);
        w.hits.push(h);
        attached = true;
        break;
      }
    }

    if (!attached) {
      windows.push({
  category: keyCat,
  planet: keyPlanet,
  natalPlanet: keyNatal,
  aspect: keyAspect,
  startISO: h.dateISO,
  endISO: h.dateISO,
  maxStrength: h.strength,
  hits: [h],
});
    }
  }

  // Convert accumulators → TransitHit[]
  const out: TransitHit[] = windows.map((w, idx) => {
    const strongest = w.hits.reduce(
      (best, cur) => (cur.strength > best.strength ? cur : best),
      w.hits[0]
    );

    const tLon =
      typeof (strongest as any).transitLon === "number"
        ? wrap360((strongest as any).transitLon)
        : undefined;

    const tSign = typeof tLon === "number" ? signFromLonSidereal(tLon) : undefined;

    let tHouse: number | undefined = undefined;

if (typeof tLon === "number") {
  // Whole Sign house from Lagna sign (preferred)
  if (tSign && opts?.ascSign) {
    tHouse = houseFromLagnaWholeSign(tSign, opts.ascSign);
  }

  // Fallback: equal-house from Asc degree if ascSign missing
  if (!tHouse && typeof opts?.ascDeg === "number" && Number.isFinite(opts.ascDeg)) {
    tHouse = houseFromAsc(opts.ascDeg, tLon);
  }
}


    const target = `${strongest.aspect} natal ${strongest.natalPlanet}`;
    const id = `win-${idx}-${w.planet.toLowerCase()}-${w.category}-${w.aspect}-${w.natalPlanet.toLowerCase()}`;

    const title = buildWindowTitle(w.category, w.planet, strongest);
    const description = buildWindowDescription(w, strongest);

    return {
      id,
      startISO: w.startISO,
      endISO: w.endISO,
      planet: w.planet,
      target,
      category: w.category,
      strength: Math.min(1, w.maxStrength),

      transitLon: tLon,
      transitSign: tSign,
      transitHouse: tHouse,

      title,
      description,
    };
  });

  out.sort((a, b) =>
    a.startISO < b.startISO ? -1 : a.startISO > b.startISO ? 1 : 0
  );

  return out;
}

/* -------------------------------------------------------
   WINDOW TITLES & DESCRIPTIONS (HIGH-LEVEL TEMPLATES)
-------------------------------------------------------- */

function buildWindowTitle(
  category: TransitCategory,
  planet: string,
  h: RawDailyHit
): string {
  const p = planet;
  switch (category) {
    case "career":
      return `${p} boost for career & direction`;
    case "relationships":
      return `${p} focus on relationships & harmony`;
    case "health":
      return `${p} tests for health & routines`;
    case "inner":
      return `${p} phase of inner work & reflection`;
    case "general":
    default:
      return `${p} general life activation`;
  }
}

function buildWindowDescription(
  w: WindowAccumulator,
  strongest: RawDailyHit
): string {
  const { category, planet } = w;
  const { natalPlanet, aspect } = strongest;

  const range =
    w.startISO === w.endISO
      ? w.startISO
      : `${w.startISO} → ${w.endISO}`;

  const coreLine = (() => {
    const aspWord =
      aspect === "conjunction"
        ? "aligns with"
        : aspect === "opposition"
        ? "faces"
        : aspect === "trine"
        ? "flows with"
        : aspect === "square"
        ? "challenges"
        : "supports";

    return `${planet} ${aspWord} your natal ${natalPlanet}, activating this area from ${range}.`;
  })();

  if (category === "career") {
    return [
      coreLine,
      "This window can bring shifts in work, responsibilities, visibility or long-term direction.",
      "Use it for steady effort, learning, networking and conscious choices about your path.",
    ].join(" ");
  }

  if (category === "relationships") {
    return [
      coreLine,
      "Relationships, partnerships or key one-to-one dynamics may feel more highlighted now.",
      "Communicate with patience and openness; this is a good time to strengthen or rebalance bonds.",
    ].join(" ");
  }

  if (category === "health") {
    return [
      coreLine,
      "Energy levels, routines and stress management are important themes in this phase.",
      "Prioritise rest, boundaries and simple, sustainable habits to support your body.",
    ].join(" ");
  }

  if (category === "inner") {
    return [
      coreLine,
      "Inner processing, questions of meaning and emotional or spiritual growth come into focus.",
      "Gentle reflection, journaling or contemplative practices can help you integrate this period.",
    ].join(" ");
  }

  // general
  return [
    coreLine,
    "Multiple life areas may be gently activated; stay observant and make mindful adjustments where needed.",
  ].join(" ");
}
const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];


export type TransitNowPlanet = {
  name: string;
  lon: number;         // sidereal longitude 0..360
  sign: string;        // sidereal sign
  house?: number;      // whole sign house from Asc
};

export async function computeTransitPlanetsNow(
  birth: TransitEngineBirth,
  ascSign?: string,
  asOf?: { dateISO: string; time: string; tz: string }
): Promise<TransitNowPlanet[]> {
  const constants = await getSweConstants();
  console.log("[TRANSITS_VERSION] 2026-01-27 A");

  // Use explicit "as-of" moment (preferred), else fall back to birth tz + current clock.
  const tz = asOf?.tz ?? birth.tz;

  // If caller didn't pass a moment, derive "now" in the given tz.
  const nowUtc = (() => {
    if (asOf?.dateISO && asOf?.time) {
      return makeUtcInstant(asOf.dateISO, asOf.time, tz);
    }

    // derive current date/time in tz (no external libs)
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(now);

    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
    const dateISO = `${get("year")}-${get("month")}-${get("day")}`;
    const time = `${get("hour")}:${get("minute")}`;
    return makeUtcInstant(dateISO, time, tz);
  })();

  // IMPORTANT: compute at the actual instant, not start-of-day UTC
  console.log("[transitsNow] tz:", tz);
console.log("[transitsNow] nowUtc ISO:", nowUtc.toISOString());
console.log("[transitsNow] nowUtc UTC date:", nowUtc.toISOString().slice(0, 10));

const tPlanets = await computeTransitPlanetsForDay(nowUtc, constants);
console.log(
  "[transitsNow] sample",
  tPlanets.map(p => `${p.name}:${p.lon.toFixed(2)}° ${signFromDegSidereal(p.lon)}`).join(" | ")
);


    const sun = tPlanets.find(p => p.name === "Sun");

  return tPlanets.map((p) => {
    let lon = p.lon;
    let sign = signFromDegSidereal(lon);

    // 🔒 Mercury boundary correction (stub safety)
    if (p.name === "Mercury" && sun) {
      const diff = Math.abs(wrap360(lon - sun.lon));
      if (diff < 30) {
        // force Mercury into Sun's sign if close
        sign = signFromDegSidereal(sun.lon);
      }
    }

    const house = houseFromLagnaWholeSign(sign, ascSign);
    return { name: p.name, lon, sign, house };
  });

}


/* -------------------------------------------------------
   PUBLIC API – USED BY /api/transits
-------------------------------------------------------- */

export async function computeTransitWindows(
  birth: TransitEngineBirth,
  horizonDays: number,
  opts?: { ascDeg?: number; ascSign?: string }
): Promise<TransitHit[]> {

  if (!horizonDays || horizonDays <= 0) return [];

  try {
    const raw = await buildRawDailyHits(birth, horizonDays);
    if (!raw.length) return [];

    // ✅ pass ascDeg into the window builder so transitHouse is computed correctly
    const windows = buildWindowsFromHits(raw, opts);


    return windows;
  } catch (e) {
    console.error("[transits] computeTransitWindows failed", e);
    return [];
  }
}
