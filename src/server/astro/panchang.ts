// FILE: /src/server/astro/panchang.ts
// FULL UPGRADED VERSION — REAL TITHI / NAKSHATRA / PADA / YOGA / KARANA
// Sunrise/Sunset via JS approximation (no swe_rise_trans)

import { DateTime } from "luxon";
import { getSwe } from "@/server/astro/swe";

// --- ensure nakshatra module (with lord/theme) is loaded before we compute
let _getNakshatra:
  | ((deg: number) => { name: string; lord?: string; theme?: string })
  | null = null;

async function ensureNakModule() {
  if (_getNakshatra) return;
  try {
    const mod = await import("@/server/astro/nakshatra");
    _getNakshatra = mod.getNakshatra || null;
  } catch {
    _getNakshatra = null;
  }
}

type Place = { tz?: string; lat?: number; lon?: number; name?: string };
type BirthLike = { dobISO: any; tob: any; place?: Place };

const NAK_SIZE = 360 / 27;
const PADA_SIZE = 360 / 108;

// fixed 7 karanas
const MOVABLE_KARANAS = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"];

// full list for safety:
const FIXED_KARANAS: Record<number, string> = {
  0: "Kimstughna",
  57: "Shakuni",
  58: "Chatushpada",
  59: "Naga",
};

// ---------- helpers ----------
function wrap360(x: number) {
  return ((x % 360) + 360) % 360;
}

// ---------- Date helpers ----------
function normalizeDate(input: any) {
  const dt = DateTime.fromISO(String(input));
  if (!dt.isValid) throw new Error("Invalid date " + input);
  return { y: dt.year, m: dt.month, d: dt.day };
}

function normalizeTime(input: any) {
  if (typeof input !== "string") throw new Error("Invalid time");
  const m = input.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) throw new Error("Invalid HH:mm");
  return { hh: +m[1], mm: +m[2] };
}

function jdUTFromLocal(dobISO: any, tobHHmm: any, tz: string) {
  const { y, m, d } = normalizeDate(dobISO);
  const { hh, mm } = normalizeTime(tobHHmm);

  const dtLocal = DateTime.fromObject(
    { year: y, month: m, day: d, hour: hh, minute: mm, second: 0, millisecond: 0 },
    { zone: tz }
  );
  if (!dtLocal.isValid) throw new Error("Invalid local date/time");

  const dtUTC = dtLocal.toUTC();
  const swe = getSwe();
  const jd = swe.swe_julday(
    dtUTC.year,
    dtUTC.month,
    dtUTC.day,
    dtUTC.hour + dtUTC.minute / 60 + dtUTC.second / 3600,
    swe.SE_GREG_CAL
  );
  return { jdUT: jd, dtLocal, dtUTC };
}

// ---------- Sun / Moon (sidereal Lahiri) ----------
function getSiderealPositions(jdUT: number) {
  const swe = getSwe();
  // getSwe already sets sidereal mode once; just in case:
  try {
    if (typeof swe.swe_set_sid_mode === "function") {
      swe.swe_set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);
    }
  } catch {}

  const flags =
    (swe.SEFLG_SWIEPH ?? 2) |
    (swe.SEFLG_SIDEREAL ?? 64) |
    (swe.SEFLG_SPEED ?? 256);

  const s = swe.swe_calc_ut(jdUT, swe.SE_SUN, flags);
  const m = swe.swe_calc_ut(jdUT, swe.SE_MOON, flags);

  const pick = (res: any) =>
    typeof res?.longitude === "number"
      ? res.longitude
      : Array.isArray(res?.x) && typeof res.x[0] === "number"
      ? res.x[0]
      : 0;

  return {
    sun: wrap360(pick(s)),
    moon: wrap360(pick(m)),
  };
}

/** Approximate sunrise/sunset (NOAA-style) in local time "HH:mm". */
function computeSunTimesApprox(
  dateISO: string,
  tz: string,
  lat: number,
  lon: number
): { sunrise: string; sunset: string } {
  const dt = DateTime.fromISO(String(dateISO), { zone: tz });
  if (!dt.isValid) {
    return { sunrise: "06:00", sunset: "18:00" };
  }

  const N = dt.ordinal; // day of year
  const deg2rad = Math.PI / 180;
  const rad2deg = 180 / Math.PI;

  const gamma = (2 * Math.PI / 365) * (N - 1);

  const eqTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  const solarDec =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  const latRad = lat * deg2rad;
  const zenith = 90.833 * deg2rad; // official sunrise/sunset

  const cosH =
    (Math.cos(zenith) - Math.sin(latRad) * Math.sin(solarDec)) /
    (Math.cos(latRad) * Math.cos(solarDec));

  if (cosH <= -1) {
    // sun above horizon all day (polar) – not our use case, but keep safe
    return { sunrise: "00:00", sunset: "23:59" };
  }
  if (cosH >= 1) {
    // sun below horizon all day
    return { sunrise: "—", sunset: "—" };
  }

  const H = Math.acos(cosH);
  const Hdeg = H * rad2deg;

  const solarNoonUTC = 720 - 4 * lon - eqTime; // minutes from midnight
  const sunriseUTC = solarNoonUTC - 4 * Hdeg;
  const sunsetUTC = solarNoonUTC + 4 * Hdeg;

  const offsetMinutes = dt.offset; // zone offset vs UTC in minutes
  const sunriseLocal = sunriseUTC + offsetMinutes;
  const sunsetLocal = sunsetUTC + offsetMinutes;

  function toHHMM(mins: number) {
    let m = Math.round(mins);
    while (m < 0) m += 1440;
    while (m >= 1440) m -= 1440;
    const hh = Math.floor(m / 60);
    const mm = m % 60;
    return `${hh.toString().padStart(2, "0")}:${mm
      .toString()
      .padStart(2, "0")}`;
  }

  return {
    sunrise: toHHMM(sunriseLocal),
    sunset: toHHMM(sunsetLocal),
  };
}

// ---------- TITHI ----------
function computeTithi(moon: number, sun: number) {
  const diff = wrap360(moon - sun);
  const index = Math.floor(diff / 12); // 0..29
  const paksha = index < 15 ? "Shukla" : "Krishna";
  const day = (index % 15) + 1;

  const TITHI_NAMES = [
    "Pratipada",
    "Dwitiya",
    "Tritiya",
    "Chaturthi",
    "Panchami",
    "Shashthi",
    "Saptami",
    "Ashtami",
    "Navami",
    "Dashami",
    "Ekadashi",
    "Dwadashi",
    "Trayodashi",
    "Chaturdashi",
    paksha === "Shukla" ? "Purnima" : "Amavasya",
  ];

  return {
    name: TITHI_NAMES[day - 1],
    paksha,
    day,
    index,
  };
}

// ---------- NAKSHATRA + PADA ----------
function computeNakshatraPad(deg: number) {
  const nakIndex = Math.floor(wrap360(deg) / NAK_SIZE);
  const padaIndex = Math.floor((wrap360(deg) % NAK_SIZE) / PADA_SIZE) + 1;

  return {
    nakIndex,
    pada: padaIndex, // 1–4
  };
}

// ---------- YOGA ----------
const YOGA_NAMES_27 = [
  "Vishkambha",
  "Priti",
  "Ayushman",
  "Saubhagya",
  "Shobhana",
  "Atiganda",
  "Sukarma",
  "Dhriti",
  "Shoola",
  "Ganda",
  "Vriddhi",
  "Dhruva",
  "Vyaghata",
  "Harshana",
  "Vajra",
  "Siddhi",
  "Vyatipata",
  "Variyan",
  "Parigha",
  "Shiva",
  "Siddha",
  "Sadhya",
  "Shubha",
  "Shukla",
  "Brahma",
  "Indra",
  "Vaidhriti",
];

function computeYoga(moon: number, sun: number) {
  const sum = wrap360(moon + sun);
  const index = Math.floor(sum / NAK_SIZE);
  return { name: YOGA_NAMES_27[index], index };
}

// ---------- KARANA ----------
function computeKarana(moon: number, sun: number) {
  const diff = wrap360(moon - sun);
  const K = Math.floor(diff / 6); // 0..59

  // fixed karanas
  if (FIXED_KARANAS[K]) return { name: FIXED_KARANAS[K] };

  // movable set
  return { name: MOVABLE_KARANAS[(K - 1 + 7) % 7] };
}

// ---------- MAIN API ----------
export async function getPanchang(birth: BirthLike) {
  const tz = birth.place?.tz || "UTC";
  const lat = birth.place?.lat ?? 0;
  const lon = birth.place?.lon ?? 0;

  const { jdUT, dtLocal } = jdUTFromLocal(birth.dobISO, birth.tob, tz);
  const { sun, moon } = getSiderealPositions(jdUT);

  // load nakshatra metadata
  await ensureNakModule();

  const weekday = dtLocal.setZone(tz).toFormat("cccc");
  const tithi = computeTithi(moon, sun);
  const yoga = computeYoga(moon, sun);
  const karana = computeKarana(moon, sun);

  // Nakshatra + Pada
  const nakBase = _getNakshatra ? _getNakshatra(moon) : { name: "Unknown" };
  const { nakIndex, pada } = computeNakshatraPad(moon);

  const nakshatra = {
    ...nakBase,
    pada,
    index: nakIndex,
  };

  // Sunrise/Sunset via approximation (no swe_rise_trans)
  const approx = computeSunTimesApprox(birth.dobISO, tz, lat, lon);
  const sunriseStr = approx.sunrise || "06:00";
  const sunsetStr = approx.sunset || "18:00";

  // For now we don’t attempt Moonrise/Moonset at all
  const moonriseStr = "—";
  const moonsetStr = "—";

  const baseLocal = dtLocal.setZone(tz);

  return {
    at: baseLocal.toISO(),
    weekday,
    tithi,
    nakshatra,
    yoga,
    karana,

    sunrise: sunriseStr,
    sunset: sunsetStr,
    moonrise: moonriseStr,
    moonset: moonsetStr,

    rahuKaal: "—",
    gulikaKaal: "—",
    abhijitMuhurat: "—",
    guidanceLine: "Birth energy favors clarity, steadiness, and inner alignment.",
  };
}

export default getPanchang;
