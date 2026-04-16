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
  "Dhanishtha",
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
const RASHIS = [
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
] as const;

function getRashiFromLon(lon: number | null) {
  if (typeof lon !== "number" || !Number.isFinite(lon)) return null;
  const idx = Math.floor(wrap360(lon) / 30);
  return RASHIS[idx] ?? null;
}

function getPakshaFromTithi(tithi: string | null) {
  if (!tithi) return null;
  if (tithi.startsWith("Shukla")) return "Shukla Paksha";
  if (tithi.startsWith("Krishna")) return "Krishna Paksha";
  return null;
}

function getRahuKaal(
  weekdayName: string,
  sunriseDT: any,
sunsetDT: any
) {
  if (!sunriseDT || !sunsetDT || !sunriseDT.isValid || !sunsetDT.isValid) {
    return null;
  }

  const dayMinutes = sunsetDT.diff(sunriseDT, "minutes").minutes;
  if (!Number.isFinite(dayMinutes) || dayMinutes <= 0) return null;

  const segment = dayMinutes / 8;

  const indexMap: Record<string, number> = {
    Sunday: 8,
    Monday: 2,
    Tuesday: 7,
    Wednesday: 5,
    Thursday: 6,
    Friday: 4,
    Saturday: 3,
  };

  const slot = indexMap[weekdayName];
  if (!slot) return null;

  const start = sunriseDT.plus({ minutes: segment * (slot - 1) });
  const end = sunriseDT.plus({ minutes: segment * slot });

  return {
    start: start.toFormat("hh:mm:ss a"),
    end: end.toFormat("hh:mm:ss a"),
  };
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
  const dt = DateTime.fromISO(params.dateISO, { zone: params.timezone });

  const solarTimes = await buildSolarTimes({
    dateISO: params.dateISO,
    timezone: params.timezone,
    lat: params.lat,
    lon: params.lon,
  });

  const sunriseDT =
    solarTimes?.sunriseDT && solarTimes.sunriseDT.isValid
      ? solarTimes.sunriseDT
      : null;

  const sunsetDT =
    solarTimes?.sunsetDT && solarTimes.sunsetDT.isValid
      ? solarTimes.sunsetDT
      : null;

  const panchangMoment = sunriseDT
  ? sunriseDT.toFormat("yyyy-MM-dd'T'HH:mm:ss")
  : DateTime.fromISO(`${params.dateISO}T06:00:00`, {
      zone: params.timezone,
    }).toFormat("yyyy-MM-dd'T'HH:mm:ss");

const transit = await getPlanetPositions({
  dateISO: panchangMoment,
  tz: params.timezone,
  lat: params.lat,
  lon: params.lon,
});
const noonTransit = await getPlanetPositions({
  dateISO: `${params.dateISO}T12:00:00`,
  tz: params.timezone,
  lat: params.lat,
  lon: params.lon,
});

const noonPlanets = Array.isArray((noonTransit as any)?.planets)
  ? (noonTransit as any).planets
  : [];

const noonMoonLon = getPlanetLon(noonPlanets, "Moon");
const nakshatraNow = getNakshatraFromLon(noonMoonLon);
const eveningMoment = DateTime.fromISO(`${params.dateISO}T17:30:00`, {
  zone: params.timezone,
}).toFormat("yyyy-MM-dd'T'HH:mm:ss");

const eveningTransit = await getPlanetPositions({
  dateISO: eveningMoment,
  tz: params.timezone,
  lat: params.lat,
  lon: params.lon,
});

const eveningPlanets = Array.isArray((eveningTransit as any)?.planets)
  ? (eveningTransit as any).planets
  : [];

const eveningMoonLon = getPlanetLon(eveningPlanets, "Moon");
const nextNakshatra = getNakshatraFromLon(eveningMoonLon);
  const planets = Array.isArray((transit as any)?.planets)
    ? (transit as any).planets
    : [];

  const sunLon = getPlanetLon(planets, "Sun");
  const moonLon = getPlanetLon(planets, "Moon");

  const tithi = getTithiFromSunMoon(sunLon, moonLon);
  const nakshatra = getNakshatraFromLon(moonLon);

const yoga = getYogaFromSunMoon(sunLon, moonLon);
const karana = getKaranaFromSunMoon(sunLon, moonLon);

const weekday = dt.isValid ? dt.toFormat("cccc") : "—";

const sunSign = getRashiFromLon(sunLon);
const moonSign = getRashiFromLon(moonLon);

  const rahuKaal = getRahuKaal(weekday, sunriseDT, sunsetDT);
console.log("UTILITY PANCHANG DEBUG", {
  dateISO: params.dateISO,
  timezone: params.timezone,
  lat: params.lat,
  lon: params.lon,
  panchangMoment,
  sunriseMoonLon: moonLon,
  noonMoonLon,
  nakshatraAtSunrise: nakshatra,
  nakshatraNow,
});
  return {
    dateISO: params.dateISO,
    dateLabel: dt.isValid ? dt.toFormat("EEEE, dd LLLL yyyy") : params.dateISO,
    weekday,
    tithi,
    paksha: getPakshaFromTithi(tithi),
    nakshatra,
    nakshatraTill: null,
    yoga,
    yogaTill: null,
    karana,
    sunrise: solarTimes?.sunrise ?? formatHm(sunriseDT) ?? "—",
    sunset: solarTimes?.sunset ?? formatHm(sunsetDT) ?? "—",
    moonrise: null,
    nakshatraAtSunrise: nakshatra,
    nakshatraNow,
    nextNakshatra,
    sunSign,
    moonSign,
    rahuKaal,
    _sunriseDT: sunriseDT,
    _sunsetDT: sunsetDT,
  };
}