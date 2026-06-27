// FILE: src/server/astro/transits.ts

import "server-only";
import { sweCall, getSweConstants } from "@/server/astro/swe-remote";
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
  orb?: number; // degrees away from exact aspect
  // ✅ NEW: transit placement at the strongest hit day (sidereal)
  transitLon?: number;     // 0..360 sidereal (sample at startISO)
  transitSign?: string;    // Capricorn, etc.
  transitHouse?: number;   // 1..12 from Lagna (if ascDeg provided)
  natalLon?: number;       // for the natal target planet (for debugging)
  natalHouse?: number;
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
function houseMeaning(h?: number): string {
  return h === 1 ? "Self & direction" :
    h === 2 ? "Money & resources" :
    h === 3 ? "Communication & effort" :
    h === 4 ? "Home & foundations" :
    h === 5 ? "Creativity & children" :
    h === 6 ? "Work & routines" :
    h === 7 ? "Relationships & agreements" :
    h === 8 ? "Shared finances & transformation" :
    h === 9 ? "Learning & travel" :
    h === 10 ? "Career & reputation" :
    h === 11 ? "Friends & gains" :
    h === 12 ? "Rest & release" :
    "General activation";
}
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




export function wrap360(deg: number): number {
  let x = deg % 360;
  if (x < 0) x += 360;
  return x;
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

export function toSiderealLon(tropicalDeg: number, ayanDeg: number): number {
  return wrap360(tropicalDeg - ayanDeg);
}
function tropicalToSidereal(lonDegTropical: number, ayanDeg: number): number {
  return wrap360(lonDegTropical - ayanDeg);
}
function baseSweFlags(constants: any): number {
  return (constants.SEFLG_SWIEPH ?? 2) | (constants.SEFLG_SPEED ?? 256);
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
function padaFromDegSidereal(deg: number): number {
  const span = 360 / 27; // 13°20'
  const withinNak = wrap360(deg) % span;
  return Math.floor(withinNak / (span / 4)) + 1; // 1..4
}
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
  house?: number;
};

type TransitPlanet = {
  name: string;
  lon: number;
  speedLon?: number;
  retrograde?: boolean;
};

/**
 * Compute natal longitudes (sidereal) using the remote engine.
 */
async function computeNatalPlanets(
  birth: TransitEngineBirth,
  constants: any,
  opts?: { ascDeg?: number; ascSign?: string }
): Promise<NatalPlanet[]> {
  // NOTE: with your current swe-remote stub, swe_set_sid_mode is a no-op.
  // We do manual tropical->sidereal conversion consistently below.
  await ensureSiderealMode(constants);

  const birthUtc = makeUtcInstant(birth.dateISO, birth.time, birth.tz);
  const jdUt = await jdFromDateUTC(birthUtc, constants.SE_GREG_CAL);

  const flags =
    (constants.SEFLG_SWIEPH ?? 2) |
    (constants.SEFLG_SPEED ?? 256); // NO SIDEREAL FLAG (we convert ourselves)

  const ayanDeg = await lahiriAyanamsaDeg(jdUt);

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

    const res = await sweCall<any>("swe_calc_ut", jdUt, p.code, flags);
    const lonRaw = extractLongitude(res);
if (typeof lonRaw !== "number" || !isFinite(lonRaw)) continue;

const lonDeg = wrap360(lonRaw);
let lonSid = toSiderealLon(lonDeg, ayanDeg);

if (p.name === "Ketu") lonSid = wrap360(lonSid + 180);

let natalHouse: number | undefined = undefined;

// Prefer whole-sign houses from ascSign for consistency with the rest of the app
if (opts?.ascSign) {
  const natalSign = signFromLonSidereal(lonSid);
  natalHouse = houseFromLagnaWholeSign(natalSign, opts.ascSign);
}

// Fallback only if ascSign is missing
if (
  !natalHouse &&
  typeof opts?.ascDeg === "number" &&
  Number.isFinite(opts.ascDeg)
) {
  natalHouse = houseFromAsc(opts.ascDeg, lonSid);
}

out.push({
  name: p.name,
  lon: lonSid,
  house: natalHouse,
});
  }
  // (guard must live INSIDE the defs loop, because it uses `p`)


  return out;
}
function signedAngleDeltaDeg(fromDeg: number, toDeg: number): number {
  let d = ((toDeg - fromDeg + 540) % 360) - 180;
  return d;
}

async function estimateSiderealMotionDegPerHour(
  jdUt: number,
  code: number,
  flags: number
): Promise<number | undefined> {
  const prevJd = jdUt - 1 / 24;
  const nextJd = jdUt + 1 / 24;

  const prevRes = await sweCall<any>("swe_calc_ut", prevJd, code, flags);
  const nextRes = await sweCall<any>("swe_calc_ut", nextJd, code, flags);

  const prevLonRaw = extractLongitude(prevRes);
  const nextLonRaw = extractLongitude(nextRes);

  if (
    typeof prevLonRaw !== "number" ||
    !isFinite(prevLonRaw) ||
    typeof nextLonRaw !== "number" ||
    !isFinite(nextLonRaw)
  ) {
    return undefined;
  }

  const prevAyan = await lahiriAyanamsaDeg(prevJd);
  const nextAyan = await lahiriAyanamsaDeg(nextJd);

  const prevSid = toSiderealLon(wrap360(prevLonRaw), prevAyan);
  const nextSid = toSiderealLon(wrap360(nextLonRaw), nextAyan);

  const delta = signedAngleDeltaDeg(prevSid, nextSid);

  // 2-hour span total, so convert to per-hour
  return delta / 2;
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

  const flags =
    (constants.SEFLG_SWIEPH ?? 2) |
    (constants.SEFLG_SPEED ?? 256);

  const ayanDeg = await lahiriAyanamsaDeg(jdUt);

  const defs = [
    { name: "Sun", code: constants.SE_SUN },
    { name: "Moon", code: constants.SE_MOON },
    { name: "Mercury", code: constants.SE_MERCURY },
    { name: "Venus", code: constants.SE_VENUS },
    { name: "Mars", code: constants.SE_MARS },
    { name: "Jupiter", code: constants.SE_JUPITER },
    { name: "Saturn", code: constants.SE_SATURN },
    { name: "Rahu", code: constants.SE_TRUE_NODE ?? constants.SE_MEAN_NODE },
  ];

  const out: TransitPlanet[] = [];

  for (const p of defs) {
    if (p.code == null) continue;

    const res = await sweCall<any>("swe_calc_ut", jdUt, p.code, flags);

    const lonRaw = extractLongitude(res);
    if (typeof lonRaw !== "number" || !isFinite(lonRaw)) continue;

    const lonDeg = wrap360(Number(lonRaw));
    const lonSid = toSiderealLon(lonDeg, ayanDeg);

   let speedLon =
  Array.isArray(res?.xx) && typeof res.xx[3] === "number"
    ? res.xx[3]
    : Array.isArray(res?.data) && typeof res.data[3] === "number"
    ? res.data[3]
    : typeof res?.speedLon === "number"
    ? res.speedLon
    : typeof res?.speedLongitude === "number"
    ? res.speedLongitude
    : typeof res?.longitudeSpeed === "number"
    ? res.longitudeSpeed
    : typeof res?.speed === "number"
    ? res.speed
    : undefined;

    if (typeof speedLon !== "number" || !isFinite(speedLon)) {
      speedLon = await estimateSiderealMotionDegPerHour(jdUt, p.code, flags);
    }

    const retrograde =
  p.name === "Rahu"
    ? true
    : p.name === "Sun" || p.name === "Moon"
    ? false
    : typeof speedLon === "number" && Number.isFinite(speedLon)
    ? speedLon < 0
    : false;

    out.push({
      name: p.name,
      lon: lonSid,
      speedLon,
      retrograde,
    });
  }

  const rahu = out.find((p) => p.name === "Rahu");

  if (rahu && typeof rahu.lon === "number") {
    const ketuLon = wrap360(rahu.lon + 180);

    out.push({
      name: "Ketu",
      lon: ketuLon,
      speedLon: typeof rahu.speedLon === "number" ? rahu.speedLon : undefined,
      retrograde: true,
    });
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
  natalLon: number,
  transitSpeed?: number
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
      const proximity = 1 - delta / def.orb;

// applying vs separating logic
let applyingBoost = 1;

if (typeof transitSpeed === "number") {
  const futureLon = wrap360(transitLon + transitSpeed);
  const futureDiff = angleDiff(futureLon, natalLon);

  if (futureDiff < diff) {
    applyingBoost = 1.15; // approaching aspect
  } else {
    applyingBoost = 0.85; // separating aspect
  }
}

const strength = Math.max(
  0.1,
  base * (0.6 + 0.4 * proximity) * applyingBoost
);

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
  transitLon: number;
  transitHouse?: number;
  natalPlanet: string;
  natalLon: number;
  natalHouse?: number;
  aspect: AspectKind;
  category: TransitCategory;
  strength: number;
  exactDiff: number;
};


async function buildRawDailyHits(
  birth: TransitEngineBirth,
  horizonDays: number,
  opts?: { ascDeg?: number; ascSign?: string }
): Promise<RawDailyHit[]> {
  const constants = await getSweConstants();
  const natal = await computeNatalPlanets(birth, constants, opts);

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
  const transitSign = signFromLonSidereal(tp.lon);

  let transitHouse: number | undefined = undefined;

  if (opts?.ascSign) {
    transitHouse = houseFromLagnaWholeSign(transitSign, opts.ascSign);
  }

  if (
    !transitHouse &&
    typeof opts?.ascDeg === "number" &&
    Number.isFinite(opts.ascDeg)
  ) {
    transitHouse = houseFromAsc(opts.ascDeg, tp.lon);
  }

  for (const np of natal) {
    const asp = detectAspect(tp.lon, np.lon, tp.speedLon);
    if (!asp) continue;

    const category = classifyCategory(tp.name, np.name);

    hits.push({
      dateISO,
      transitPlanet: tp.name,
      transitLon: tp.lon,
      transitHouse,
      natalPlanet: np.name,
      natalLon: np.lon,
      natalHouse: np.house,
      aspect: asp.aspect,
      category,
      strength: asp.strength,
      exactDiff: asp.exactDiff,
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
  (constants.SEFLG_SPEED ?? 256); // ✅ NO SIDEREAL flag (we’ll convert ourselves)


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

const lonDeg = wrap360(Number(lonRaw)); // radians-safe

// ✅ convert tropical -> sidereal (Lahiri) same as the rest of engine
const ayanDeg = await lahiriAyanamsaDeg(jdUt);
const lon = toSiderealLon(lonDeg, ayanDeg);

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
  typeof strongest.transitLon === "number"
    ? wrap360(strongest.transitLon)
    : undefined;

const tSign = typeof tLon === "number" ? signFromLonSidereal(tLon) : undefined;

let tHouse: number | undefined =
  typeof strongest.transitHouse === "number" ? strongest.transitHouse : undefined;

if (!tHouse && typeof tLon === "number") {
  if (tSign && opts?.ascSign) {
    tHouse = houseFromLagnaWholeSign(tSign, opts.ascSign);
  }

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
  orb: strongest.exactDiff,

  transitLon: tLon,
  transitSign: tSign,
  transitHouse: tHouse,
  natalLon: strongest.natalLon,
  natalHouse: strongest.natalHouse,
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

  const transitHouseTag =
    typeof h?.transitHouse === "number"
      ? `H${h.transitHouse}`
      : null;

  const natalHouseTag =
    typeof h?.natalHouse === "number"
      ? `H${h.natalHouse}`
      : null;

  const aspectWord =
    h.aspect === "conjunction"
      ? "conjunct"
      : h.aspect === "opposition"
      ? "opposing"
      : h.aspect === "trine"
      ? "trine"
      : h.aspect === "square"
      ? "square"
      : "sextile";

  if (transitHouseTag && natalHouseTag) {
    return `${p} in ${transitHouseTag} ${aspectWord} natal ${h.natalPlanet} (${natalHouseTag})`;
  }

  if (transitHouseTag) {
    return `${p} in ${transitHouseTag} activation`;
  }

  if (natalHouseTag) {
    return `${p} activating natal ${h.natalPlanet} (${natalHouseTag})`;
  }

  switch (category) {
    case "career":
      return `${p} career activation`;
    case "relationships":
      return `${p} relationship activation`;
    case "health":
      return `${p} health activation`;
    case "inner":
      return `${p} inner-work activation`;
    case "general":
    default:
      return `${p} general activation`;
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
        ? "opposes"
        : aspect === "trine"
        ? "flows with"
        : aspect === "square"
        ? "challenges"
        : "supports";

    const transitTag =
      typeof strongest?.transitHouse === "number"
        ? `${planet} is moving through H${strongest.transitHouse} ${houseMeaning(strongest.transitHouse)}`
        : `${planet} is active by transit`;

    const natalTag =
      typeof strongest?.natalHouse === "number"
        ? ` while ${aspWord} natal ${natalPlanet} in H${strongest.natalHouse} ${houseMeaning(strongest.natalHouse)}`
        : ` while ${aspWord} natal ${natalPlanet}`;

    return `${transitTag}${natalTag} from ${range}.`;
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


export type TransitNowPlanet = {
  name: string;
  lon: number;
  sign: string;
  house?: number;
  degree?: number;
  deg?: number;
  retrograde?: boolean;
  speedLon?: number;
  nakshatra?: string | null;
  pada?: number | null;
};

export async function computeTransitPlanetsNow(
  birth: TransitEngineBirth,
  ascSign?: string,
  asOf?: { dateISO: string; time: string; tz: string }
): Promise<TransitNowPlanet[]> {
  const constants = await getSweConstants();
  
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
  
const tPlanets = await computeTransitPlanetsForDay(nowUtc, constants);

return tPlanets.map((p) => {
  const sidLon = p.lon; // ✅ already sidereal now
  const sign = signFromLonSidereal(sidLon);
  const house = houseFromLagnaWholeSign(sign, ascSign);
// if (process.env.NODE_ENV !== "production") {
//   const m = tPlanets.find(p => p.name === "Mercury");
//   if (m) console.log("[sanity] Mercury sidereal lon:", m.lon);
// }

 return {
  name: p.name,
  lon: sidLon,
  sign,
  degree: Number((wrap360(sidLon) % 30).toFixed(2)),
  deg: Number((wrap360(sidLon) % 30).toFixed(2)),
  house,
  nakshatra: nakFromDegSidereal(sidLon),
  pada: padaFromDegSidereal(sidLon),
  retrograde:
    typeof (p as any).retrograde === "boolean"
      ? (p as any).retrograde
      : false,
  speedLon:
    typeof (p as any).speedLon === "number"
      ? (p as any).speedLon
      : undefined,
};
});
}

export type PlanetTimelineRow = {
  from: string;
  to: string;
  sign: string;
  nakshatra: string;
  pada: number;
  retrograde: boolean;
};

export async function buildPlanetTransitTimeline(params: {
  planet: string;
  fromDateISO: string;
  toDateISO: string;
  timezone?: string;
}) {
  const { planet, fromDateISO, toDateISO } = params;

  const constants = await getSweConstants();

  const start = new Date(`${fromDateISO}T00:00:00Z`);
  const end = new Date(`${toDateISO}T00:00:00Z`);

  const rows: PlanetTimelineRow[] = [];

  let cursor = new Date(start);

  let active: PlanetTimelineRow | null = null;

  while (cursor.getTime() <= end.getTime()) {
    const planets = await computeTransitPlanetsForDay(cursor, constants);

    const p = planets.find(
      (x) => x.name.toLowerCase() === planet.toLowerCase()
    );

    if (!p) {
      cursor = new Date(cursor.getTime() + 86400000);
      continue;
    }

    const sign = signFromLonSidereal(p.lon);
    const nak = nakFromDegSidereal(p.lon);
    const pada = padaFromDegSidereal(p.lon);
    const retrograde = !!p.retrograde;

    const dayISO = cursor.toISOString().slice(0, 10);

    const sameAsCurrent =
      active &&
      active.sign === sign &&
      active.nakshatra === nak &&
      active.pada === pada &&
      active.retrograde === retrograde;

    if (sameAsCurrent && active) {
      active.to = dayISO;
    } else {
      if (active) rows.push(active);

      active = {
        from: dayISO,
        to: dayISO,
        sign,
        nakshatra: nak,
        pada,
        retrograde,
      };
    }

    cursor = new Date(cursor.getTime() + 86400000);
  }

  if (active) rows.push(active);

  return rows;
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
    const raw = await buildRawDailyHits(birth, horizonDays, opts);
    if (!raw.length) return [];

    // ✅ pass ascDeg into the window builder so transitHouse is computed correctly
    const windows = buildWindowsFromHits(raw, opts);


    return windows;
  } catch (e) {
    console.error("[transits] computeTransitWindows failed", e);
    return [];
  }
}
