import "server-only";

import { DateTime } from "luxon";
import { getPlanetPositions } from "@/server/astro/swe-remote";
import { buildSolarTimes } from "./buildSolarTimes";
const NAKSHATRAS_27 = [
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
] as const;

const YOGAS_27 = [
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
  "Variyana",
  "Parigha",
  "Shiva",
  "Siddha",
  "Sadhya",
  "Shubha",
  "Shukla",
  "Brahma",
  "Indra",
  "Vaidhriti",
] as const;

const KARANAS = [
  "Bava",
  "Balava",
  "Kaulava",
  "Taitila",
  "Gara",
  "Vanija",
  "Vishti",
] as const;

function wrap360(x: number) {
  let v = x % 360;
  return v < 0 ? v + 360 : v;
}

function formatHm(dt: any) {
  if (!dt || !dt.isValid) return null;
  return dt.toFormat("HH:mm");
}

function getPlanetLon(planets: any[], name: string): number | null {
  const row = Array.isArray(planets)
    ? planets.find((p: any) => String(p?.id ?? p?.name ?? "").trim() === name)
    : null;

  const lon = Number(row?.siderealLongitude);
  return Number.isFinite(lon) ? wrap360(lon) : null;
}

function getNakshatraFromLon(lon: number | null) {
  if (typeof lon !== "number" || !Number.isFinite(lon)) return null;
  const idx = Math.floor(wrap360(lon) / (360 / 27));
  return NAKSHATRAS_27[idx] ?? null;
}

function getTithiFromSunMoon(sunLon: number | null, moonLon: number | null) {
  if (
    typeof sunLon !== "number" ||
    !Number.isFinite(sunLon) ||
    typeof moonLon !== "number" ||
    !Number.isFinite(moonLon)
  ) {
    return null;
  }

  const diff = wrap360(moonLon - sunLon);
  const tithiIndex = Math.floor(diff / 12) + 1;

  const paksha = tithiIndex <= 15 ? "Shukla" : "Krishna";
  const tithiNum = tithiIndex <= 15 ? tithiIndex : tithiIndex - 15;

  const names = [
    "",
    "Pratipada",
    "Dvitiya",
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
    "Purnima/Amavasya",
  ];

  const terminal =
    tithiNum === 15
      ? paksha === "Shukla"
        ? "Purnima"
        : "Amavasya"
      : names[tithiNum];

  return `${paksha} ${terminal}`;
}

function getYogaFromSunMoon(sunLon: number | null, moonLon: number | null) {
  if (
    typeof sunLon !== "number" ||
    !Number.isFinite(sunLon) ||
    typeof moonLon !== "number" ||
    !Number.isFinite(moonLon)
  ) {
    return null;
  }

  const sum = wrap360(sunLon + moonLon);
  const idx = Math.floor(sum / (360 / 27));
  return YOGAS_27[idx] ?? null;
}

function getKaranaFromSunMoon(sunLon: number | null, moonLon: number | null) {
  if (
    typeof sunLon !== "number" ||
    !Number.isFinite(sunLon) ||
    typeof moonLon !== "number" ||
    !Number.isFinite(moonLon)
  ) {
    return null;
  }

  const diff = wrap360(moonLon - sunLon);
  const halfTithiIndex = Math.floor(diff / 6) + 1;

  if (halfTithiIndex === 1) return "Kimstughna";
  if (halfTithiIndex >= 58) {
    const fixed = ["Shakuni", "Chatushpada", "Naga"];
    return fixed[halfTithiIndex - 58] ?? "Kimstughna";
  }

  const repeatingIndex = (halfTithiIndex - 2) % 7;
  return KARANAS[repeatingIndex] ?? null;
}

export async function buildPanchangData(params: {
  dateISO: string;
  timezone: string;
  lat: number;
  lon: number;
  transitNow?: {
    moonToday?: {
      nakshatra?: string | null;
      sign?: string | null;
    };
  } | null;
}) {
  const noonLocal = `${params.dateISO}T12:00:00`;

  const transit = await getPlanetPositions({
    dateISO: noonLocal,
    tz: params.timezone,
    lat: params.lat,
    lon: params.lon,
  });

  const planets = Array.isArray((transit as any)?.planets)
    ? (transit as any).planets
    : [];

  const sunLon = getPlanetLon(planets, "Sun");
  const moonLon = getPlanetLon(planets, "Moon");

  const nakshatra =
    params.transitNow?.moonToday?.nakshatra ?? getNakshatraFromLon(moonLon);

  const dt = DateTime.fromISO(params.dateISO, { zone: params.timezone });

const solarTimes = await buildSolarTimes({
  dateISO: params.dateISO,
  timezone: params.timezone,
  lat: params.lat,
  lon: params.lon,
});

return {
  dateISO: params.dateISO,
  weekday: dt.isValid ? dt.toFormat("cccc") : "—",
  tithi: getTithiFromSunMoon(sunLon, moonLon),
  nakshatra,
  yoga: getYogaFromSunMoon(sunLon, moonLon),
  karana: getKaranaFromSunMoon(sunLon, moonLon),
  sunrise: solarTimes.sunrise,
  sunset: solarTimes.sunset,
};
}