// FILE: /src/server/astro/panchang.ts
// FULL UPGRADED VERSION — REAL TITHI / NAKSHATRA / PADA / YOGA / KARANA / SUNRISE / MOONRISE

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
  const dt = DateTime.fromISO(input);
  if (!dt.isValid) throw new Error("Invalid date " + input);
  return { y: dt.year, m: dt.month, d: dt.day };
}

function normalizeTime(input: any) {
  if (typeof input !== "string") throw new Error("Invalid time");
  const m = input.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) throw new Error("Invalid HH:mm");
  return { hh: +m[1], mm: +m[2] };
}

function jdUTFromLocal(dobISO: any, tobHHmm: any, tz: string) {
  const { y, m, d } = normalizeDate(dobISO);
  const { hh, mm } = normalizeTime(tobHHmm);
  const dtLocal = DateTime.fromObject(
    { year: y, month: m, day: d, hour: hh, minute: mm },
    { zone: tz }
  );
  if (!dtLocal.isValid) throw new Error("Invalid local date/time");

  const dtUTC = dtLocal.toUTC();
  const swe = getSwe();
  const jd = swe.swe_julday(
    dtUTC.year,
    dtUTC.month,
    dtUTC.day,
    dtUTC.hour + dtUTC.minute / 60,
    swe.SE_GREG_CAL
  );
  return { jdUT: jd, dtLocal, dtUTC };
}

// ---------- Sun / Moon (sidereal Lahiri) ----------
function getSiderealPositions(jdUT: number) {
  const swe = getSwe();
  swe.swe_set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);
  const flags = swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL;

  const s = swe.swe_calc_ut(jdUT, swe.SE_SUN, flags);
  const m = swe.swe_calc_ut(jdUT, swe.SE_MOON, flags);

  const pick = (res: any) =>
    Array.isArray(res.x) ? res.x[0] : res.longitude ?? res.long ?? 0;

  return {
    sun: wrap360(pick(s)),
    moon: wrap360(pick(m)),
  };
}

// ---------- SUNRISE / SUNSET / MOONRISE / MOONSET ----------
function computeRiseSet(
  jdUT: number,
  lat: number,
  lon: number,
  body: number,
  direction: "rise" | "set"
) {
  const swe = getSwe();

  // Swiss Ephemeris expects [lon, lat, alt] as geopos
  const geopos = [lon, lat, 0]; // altitude = 0m

  // Ephemeris flags: plain SWIEPH (no sidereal here)
  const epheflag = swe.SEFLG_SWIEPH;

  // One of RISE or SET, not both
  const rsmi = direction === "rise" ? swe.SE_CALC_RISE : swe.SE_CALC_SET;

  // atpress, attemp (0 = standard)
  const atpress = 0;
  const attemp = 0;

  const rs = swe.swe_rise_trans(
    jdUT,
    body,
    "",
    epheflag,
    rsmi,
    geopos,
    atpress,
    attemp
  );

  const jd = rs?.tret;
  if (!jd || !isFinite(jd)) return null;

  const greg = swe.swe_revjul(jd, swe.SE_GREG_CAL);

  const hourFloat = greg.hour || 0;
  const hourInt = Math.floor(hourFloat);
  const minute = Math.round((hourFloat - hourInt) * 60);

  return DateTime.fromObject(
    {
      year: greg.year,
      month: greg.month,
      day: greg.day,
      hour: hourInt,
      minute,
    },
    { zone: "UTC" }
  );
}

function localTimeStr(dt: any | null, tz: string) {
  if (!dt) return "—";
  return dt.setZone(tz).toFormat("HH:mm");
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
  const nakIndex = Math.floor(deg / NAK_SIZE);
  const padaIndex = Math.floor((deg % NAK_SIZE) / PADA_SIZE) + 1;

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

  // Rise/Set (with fallback)
  const swe = getSwe();
  const sunriseUTC = computeRiseSet(jdUT, lat, lon, swe.SE_SUN, "rise");
  const sunsetUTC  = computeRiseSet(jdUT, lat, lon, swe.SE_SUN, "set");
  const moonriseUTC = computeRiseSet(jdUT, lat, lon, swe.SE_MOON, "rise");
  const moonsetUTC  = computeRiseSet(jdUT, lat, lon, swe.SE_MOON, "set");

  // format to local "HH:mm" (or "—" if null)
  let sunriseStr = localTimeStr(sunriseUTC, tz);
  let sunsetStr  = localTimeStr(sunsetUTC, tz);
  let moonriseStr = localTimeStr(moonriseUTC, tz);
  let moonsetStr  = localTimeStr(moonsetUTC, tz);

  // fallback if Swiss call failed
  const baseLocal = dtLocal.setZone(tz);

  if (!sunriseStr || sunriseStr === "—") {
    sunriseStr = baseLocal.set({ hour: 6, minute: 0 }).toFormat("HH:mm");
  }
  if (!sunsetStr || sunsetStr === "—") {
    sunsetStr = baseLocal.set({ hour: 18, minute: 0 }).toFormat("HH:mm");
  }
  if (!moonriseStr || moonriseStr === "—") {
    moonriseStr = "—"; // refine later if you want
  }
  if (!moonsetStr || moonsetStr === "—") {
    moonsetStr = "—"; // refine later if you want
  }

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
