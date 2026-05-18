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
async function findNakshatraChangeTime(params: {
  dateISO: string;
  timezone: string;
  lat: number;
  lon: number;
  currentNakshatra: string | null;
}) {
  if (!params.currentNakshatra) return null;

  async function getNakshatraAt(localDateTime: string) {
    const transit = await getPlanetPositions({
      dateISO: localDateTime,
      tz: params.timezone,
      lat: params.lat,
      lon: params.lon,
    });

    const planets = Array.isArray((transit as any)?.planets)
      ? (transit as any).planets
      : [];

    const moonLon = getPlanetLon(planets, "Moon");
    return getNakshatraFromLon(moonLon);
  }

  const startDay = DateTime.fromISO(params.dateISO, { zone: params.timezone });

  let changePoint: ReturnType<typeof DateTime.fromISO> | null = null;

  for (let dayOffset = 0; dayOffset <= 1; dayOffset++) {
    const day = startDay.plus({ days: dayOffset }).toFormat("yyyy-MM-dd");
    const startHour = dayOffset === 0 ? 6 : 0;
    const endHour = dayOffset === 0 ? 23 : 12;

    for (let h = startHour; h <= endHour; h++) {
      const probe = DateTime.fromISO(
        `${day}T${String(h).padStart(2, "0")}:00:00`,
        { zone: params.timezone }
      ).toFormat("yyyy-MM-dd'T'HH:mm:ss");

      const nk = await getNakshatraAt(probe);

      if (nk && nk !== params.currentNakshatra) {
        changePoint = DateTime.fromISO(probe, { zone: params.timezone });
        break;
      }
    }

    if (changePoint) break;
  }

  if (!changePoint) return null;

  const windowStart = changePoint.minus({ hours: 1 });

  for (let totalMinutes = 0; totalMinutes <= 60; totalMinutes++) {
    const probeDt = windowStart.plus({ minutes: totalMinutes });
    const probe = probeDt.toFormat("yyyy-MM-dd'T'HH:mm:ss");

    const nk = await getNakshatraAt(probe);

    if (nk && nk !== params.currentNakshatra) {
      const sameDay = probeDt.toFormat("yyyy-MM-dd") === params.dateISO;
      return sameDay
        ? probeDt.toFormat("hh:mm a")
        : `${probeDt.toFormat("dd LLL")} ${probeDt.toFormat("hh:mm a")}`;
    }
  }

  return null;
}
async function findNextNakshatra(params: {
  dateISO: string;
  timezone: string;
  lat: number;
  lon: number;
  currentNakshatra: string | null;
}) {
  if (!params.currentNakshatra) return null;

  async function getNakshatraAt(localDateTime: string) {
    const transit = await getPlanetPositions({
      dateISO: localDateTime,
      tz: params.timezone,
      lat: params.lat,
      lon: params.lon,
    });

    const planets = Array.isArray((transit as any)?.planets)
      ? (transit as any).planets
      : [];

    const moonLon = getPlanetLon(planets, "Moon");
    return getNakshatraFromLon(moonLon);
  }

  const startDay = DateTime.fromISO(params.dateISO, { zone: params.timezone });

  for (let dayOffset = 0; dayOffset <= 1; dayOffset++) {
    const day = startDay.plus({ days: dayOffset }).toFormat("yyyy-MM-dd");
    const startHour = dayOffset === 0 ? 6 : 0;
    const endHour = dayOffset === 0 ? 23 : 12;

    for (let h = startHour; h <= endHour; h++) {
      const probe = DateTime.fromISO(
        `${day}T${String(h).padStart(2, "0")}:00:00`,
        { zone: params.timezone }
      ).toFormat("yyyy-MM-dd'T'HH:mm:ss");

      const nk = await getNakshatraAt(probe);

      if (nk && nk !== params.currentNakshatra) {
        return nk;
      }
    }
  }

  return null;
}
async function findTithiChangeTime(params: {
  dateISO: string;
  timezone: string;
  lat: number;
  lon: number;
  currentTithi: string | null;
}) {
  if (!params.currentTithi) return null;

  async function getTithiAt(localDateTime: string) {
    const transit = await getPlanetPositions({
      dateISO: localDateTime,
      tz: params.timezone,
      lat: params.lat,
      lon: params.lon,
    });

    const planets = Array.isArray((transit as any)?.planets)
      ? (transit as any).planets
      : [];

    const sunLon = getPlanetLon(planets, "Sun");
    const moonLon = getPlanetLon(planets, "Moon");
    return getTithiFromSunMoon(sunLon, moonLon);
  }

  let changeHour: number | null = null;

  for (let h = 6; h <= 23; h++) {
    const probe = DateTime.fromISO(
      `${params.dateISO}T${String(h).padStart(2, "0")}:00:00`,
      { zone: params.timezone }
    ).toFormat("yyyy-MM-dd'T'HH:mm:ss");

    const tithi = await getTithiAt(probe);

    if (tithi && tithi !== params.currentTithi) {
      changeHour = h;
      break;
    }
  }

  if (changeHour === null) return null;

  const startMinute = Math.max(0, (changeHour - 1) * 60);
  const endMinute = changeHour * 60;

  for (let totalMinutes = startMinute; totalMinutes <= endMinute; totalMinutes++) {
    const hh = Math.floor(totalMinutes / 60);
    const mm = totalMinutes % 60;

    const probe = DateTime.fromISO(
      `${params.dateISO}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`,
      { zone: params.timezone }
    ).toFormat("yyyy-MM-dd'T'HH:mm:ss");

    const tithi = await getTithiAt(probe);

    if (tithi && tithi !== params.currentTithi) {
      return DateTime.fromISO(probe, { zone: params.timezone }).toFormat("hh:mm a");
    }
  }

  return null;
}

async function findYogaChangeTime(params: {
  dateISO: string;
  timezone: string;
  lat: number;
  lon: number;
  currentYoga: string | null;
}) {
  if (!params.currentYoga) return null;

  async function getYogaAt(localDateTime: string) {
    const transit = await getPlanetPositions({
      dateISO: localDateTime,
      tz: params.timezone,
      lat: params.lat,
      lon: params.lon,
    });

    const planets = Array.isArray((transit as any)?.planets)
      ? (transit as any).planets
      : [];

    const sunLon = getPlanetLon(planets, "Sun");
    const moonLon = getPlanetLon(planets, "Moon");
    return getYogaFromSunMoon(sunLon, moonLon);
  }

  const startDay = DateTime.fromISO(params.dateISO, { zone: params.timezone });

  let changePoint = null as ReturnType<typeof DateTime.fromISO> | null;

  for (let dayOffset = 0; dayOffset <= 1; dayOffset++) {
    const day = startDay.plus({ days: dayOffset }).toFormat("yyyy-MM-dd");
    const startHour = dayOffset === 0 ? 6 : 0;
    const endHour = dayOffset === 0 ? 23 : 12;

    for (let h = startHour; h <= endHour; h++) {
      const probe = DateTime.fromISO(
        `${day}T${String(h).padStart(2, "0")}:00:00`,
        { zone: params.timezone }
      ).toFormat("yyyy-MM-dd'T'HH:mm:ss");

      const yoga = await getYogaAt(probe);

      if (yoga && yoga !== params.currentYoga) {
        changePoint = DateTime.fromISO(probe, { zone: params.timezone });
        break;
      }
    }

    if (changePoint) break;
  }

  if (!changePoint) return null;

  const windowStart = changePoint.minus({ hours: 1 });

  for (let totalMinutes = 0; totalMinutes <= 60; totalMinutes++) {
    const probeDt = windowStart.plus({ minutes: totalMinutes });
    const probe = probeDt.toFormat("yyyy-MM-dd'T'HH:mm:ss");

    const yoga = await getYogaAt(probe);

    if (yoga && yoga !== params.currentYoga) {
      const sameDay = probeDt.toFormat("yyyy-MM-dd") === params.dateISO;
      return sameDay
        ? probeDt.toFormat("hh:mm a")
        : `${probeDt.toFormat("dd LLL")} ${probeDt.toFormat("hh:mm a")}`;
    }
  }

  return null;
}
async function findKaranaChangeTime(params: {
  dateISO: string;
  timezone: string;
  lat: number;
  lon: number;
  currentKarana: string | null;
}) {
  if (!params.currentKarana) return null;

  async function getKaranaAt(localDateTime: string) {
    const transit = await getPlanetPositions({
      dateISO: localDateTime,
      tz: params.timezone,
      lat: params.lat,
      lon: params.lon,
    });

    const planets = Array.isArray((transit as any)?.planets)
      ? (transit as any).planets
      : [];

    const sunLon = getPlanetLon(planets, "Sun");
    const moonLon = getPlanetLon(planets, "Moon");
    return getKaranaFromSunMoon(sunLon, moonLon);
  }

  let changeHour: number | null = null;

  for (let h = 6; h <= 23; h++) {
    const probe = DateTime.fromISO(
      `${params.dateISO}T${String(h).padStart(2, "0")}:00:00`,
      { zone: params.timezone }
    ).toFormat("yyyy-MM-dd'T'HH:mm:ss");

    const karana = await getKaranaAt(probe);

    if (karana && karana !== params.currentKarana) {
      changeHour = h;
      break;
    }
  }

  if (changeHour === null) return null;

  const startMinute = Math.max(0, (changeHour - 1) * 60);
  const endMinute = changeHour * 60;

  for (let totalMinutes = startMinute; totalMinutes <= endMinute; totalMinutes++) {
    const hh = Math.floor(totalMinutes / 60);
    const mm = totalMinutes % 60;

    const probe = DateTime.fromISO(
      `${params.dateISO}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`,
      { zone: params.timezone }
    ).toFormat("yyyy-MM-dd'T'HH:mm:ss");

    const karana = await getKaranaAt(probe);

    if (karana && karana !== params.currentKarana) {
      return DateTime.fromISO(probe, { zone: params.timezone }).toFormat("hh:mm a");
    }
  }

  return null;
}
function getDaySegmentTimes(
  sunriseDT: any,
  sunsetDT: any,
  slot: number
) {
  if (!sunriseDT || !sunsetDT || !sunriseDT.isValid || !sunsetDT.isValid) {
    return null;
  }

  const dayMinutes = sunsetDT.diff(sunriseDT, "minutes").minutes;
  const segment = dayMinutes / 8;

  const start = sunriseDT.plus({ minutes: segment * (slot - 1) });
  const end = sunriseDT.plus({ minutes: segment * slot });

  return {
    start: start.toFormat("hh:mm a"),
    end: end.toFormat("hh:mm a"),
  };
}

function getYamaganda(
  weekdayName: string,
  sunriseDT: any,
  sunsetDT: any
) {
  const indexMap: Record<string, number> = {
    Sunday: 5,
    Monday: 4,
    Tuesday: 3,
    Wednesday: 2,
    Thursday: 1,
    Friday: 7,
    Saturday: 6,
  };

  const slot = indexMap[weekdayName];
  return slot ? getDaySegmentTimes(sunriseDT, sunsetDT, slot) : null;
}

function getGulika(
  weekdayName: string,
  sunriseDT: any,
  sunsetDT: any
) {
  const indexMap: Record<string, number> = {
    Sunday: 7,
    Monday: 6,
    Tuesday: 5,
    Wednesday: 4,
    Thursday: 3,
    Friday: 2,
    Saturday: 1,
  };

  const slot = indexMap[weekdayName];
  return slot ? getDaySegmentTimes(sunriseDT, sunsetDT, slot) : null;
}

function getAbhijitMuhurat(
  sunriseDT: any,
  sunsetDT: any
) {
  if (!sunriseDT || !sunsetDT || !sunriseDT.isValid || !sunsetDT.isValid) {
    return null;
  }

  const dayMinutes = sunsetDT.diff(sunriseDT, "minutes").minutes;
  const mid = sunriseDT.plus({ minutes: dayMinutes / 2 });

  const start = mid.minus({ minutes: 24 });
  const end = mid.plus({ minutes: 24 });

  return {
    start: start.toFormat("hh:mm a"),
    end: end.toFormat("hh:mm a"),
  };
}
const DAY_CHOGHADIYA_SEQUENCE: Record<string, string[]> = {
  Sunday: ["Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg"],
  Monday: ["Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit"],
  Tuesday: ["Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog"],
  Wednesday: ["Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh"],
  Thursday: ["Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh"],
  Friday: ["Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char"],
  Saturday: ["Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal"],
};

const NIGHT_CHOGHADIYA_SEQUENCE: Record<string, string[]> = {
  Sunday: ["Shubh", "Amrit", "Char", "Rog", "Kaal", "Labh", "Udveg", "Shubh"],
  Monday: ["Char", "Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Char"],
  Tuesday: ["Labh", "Udveg", "Shubh", "Amrit", "Char", "Rog", "Kaal", "Labh"],
  Wednesday: ["Amrit", "Char", "Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit"],
  Thursday: ["Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Char", "Rog"],
  Friday: ["Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Char", "Rog", "Kaal"],
  Saturday: ["Udveg", "Shubh", "Amrit", "Char", "Rog", "Kaal", "Labh", "Udveg"],
};

function buildChoghadiyaTable(params: {
  weekdayName: string;
  sunriseDT: any;
  sunsetDT: any;
}) {
  const { weekdayName, sunriseDT, sunsetDT } = params;

  if (!sunriseDT || !sunsetDT || !sunriseDT.isValid || !sunsetDT.isValid) {
    return { day: [], night: [] };
  }

  const daySeq = DAY_CHOGHADIYA_SEQUENCE[weekdayName] ?? [];
  const nightSeq = NIGHT_CHOGHADIYA_SEQUENCE[weekdayName] ?? [];

  const dayMinutes = sunsetDT.diff(sunriseDT, "minutes").minutes;
  const daySlot = dayMinutes / 8;

  const nextSunriseDT = sunriseDT.plus({ days: 1 });
  const nightMinutes = nextSunriseDT.diff(sunsetDT, "minutes").minutes;
  const nightSlot = nightMinutes / 8;

  const day = daySeq.map((label, i) => {
    const start = sunriseDT.plus({ minutes: i * daySlot });
    const end = sunriseDT.plus({ minutes: (i + 1) * daySlot });
    return {
      label,
      start: start.toFormat("hh:mm a"),
      end: end.toFormat("hh:mm a"),
    };
  });

  const night = nightSeq.map((label, i) => {
    const start = sunsetDT.plus({ minutes: i * nightSlot });
    const end = sunsetDT.plus({ minutes: (i + 1) * nightSlot });
    return {
      label,
      start: start.toFormat("hh:mm a"),
      end: end.toFormat("hh:mm a"),
    };
  });

  return { day, night };
}
function getPanchakStatus(moonLon: number | null) {
  const nk = getNakshatraFromLon(moonLon);
  const PANCHAK_NAKSHATRAS = [
    "Dhanishtha",
    "Shatabhisha",
    "Purva Bhadrapada",
    "Uttara Bhadrapada",
    "Revati",
  ];

  return {
    active: nk ? PANCHAK_NAKSHATRAS.includes(nk) : false,
    nakshatra: nk,
  };
}
async function findNextYoga(params: {
  dateISO: string;
  timezone: string;
  lat: number;
  lon: number;
  currentYoga: string | null;
}) {
  if (!params.currentYoga) return null;

  async function getYogaAt(localDateTime: string) {
    const transit = await getPlanetPositions({
      dateISO: localDateTime,
      tz: params.timezone,
      lat: params.lat,
      lon: params.lon,
    });

    const planets = Array.isArray((transit as any)?.planets)
      ? (transit as any).planets
      : [];

    const sunLon = getPlanetLon(planets, "Sun");
    const moonLon = getPlanetLon(planets, "Moon");
    return getYogaFromSunMoon(sunLon, moonLon);
  }

  for (let h = 6; h <= 23; h++) {
    const probe = DateTime.fromISO(
      `${params.dateISO}T${String(h).padStart(2, "0")}:00:00`,
      { zone: params.timezone }
    ).toFormat("yyyy-MM-dd'T'HH:mm:ss");

    const yg = await getYogaAt(probe);

    if (yg && yg !== params.currentYoga) {
      return yg;
    }
  }

  const nextDay = DateTime.fromISO(params.dateISO, {
    zone: params.timezone,
  }).plus({ days: 1 }).toFormat("yyyy-MM-dd");

  for (let h = 0; h <= 12; h++) {
    const probe = DateTime.fromISO(
      `${nextDay}T${String(h).padStart(2, "0")}:00:00`,
      { zone: params.timezone }
    ).toFormat("yyyy-MM-dd'T'HH:mm:ss");

    const yg = await getYogaAt(probe);

    if (yg && yg !== params.currentYoga) {
      return yg;
    }
  }

  return null;
}
async function findMoonSignChangeTime(params: {
  dateISO: string;
  timezone: string;
  lat: number;
  lon: number;
  currentMoonSign: string | null;
}) {
  if (!params.currentMoonSign) return null;

  async function getMoonSignAt(localDateTime: string) {
    const transit = await getPlanetPositions({
      dateISO: localDateTime,
      tz: params.timezone,
      lat: params.lat,
      lon: params.lon,
    });

    const planets = Array.isArray((transit as any)?.planets)
      ? (transit as any).planets
      : [];

    const moonLon = getPlanetLon(planets, "Moon");
    return getRashiFromLon(moonLon);
  }

  const startDay = DateTime.fromISO(params.dateISO, { zone: params.timezone });

  let changePoint: ReturnType<typeof DateTime.fromISO> | null = null;

  for (let dayOffset = 0; dayOffset <= 1; dayOffset++) {
    const day = startDay.plus({ days: dayOffset }).toFormat("yyyy-MM-dd");
    const startHour = dayOffset === 0 ? 6 : 0;
    const endHour = dayOffset === 0 ? 23 : 12;

    for (let h = startHour; h <= endHour; h++) {
      const probe = DateTime.fromISO(
        `${day}T${String(h).padStart(2, "0")}:00:00`,
        { zone: params.timezone }
      ).toFormat("yyyy-MM-dd'T'HH:mm:ss");

      const sign = await getMoonSignAt(probe);

      if (sign && sign !== params.currentMoonSign) {
        changePoint = DateTime.fromISO(probe, { zone: params.timezone });
        break;
      }
    }

    if (changePoint) break;
  }

  if (!changePoint) return null;

  const windowStart = changePoint.minus({ hours: 1 });

  for (let totalMinutes = 0; totalMinutes <= 60; totalMinutes++) {
    const probeDt = windowStart.plus({ minutes: totalMinutes });
    const probe = probeDt.toFormat("yyyy-MM-dd'T'HH:mm:ss");

    const sign = await getMoonSignAt(probe);

    if (sign && sign !== params.currentMoonSign) {
      const sameDay = probeDt.toFormat("yyyy-MM-dd") === params.dateISO;
      return sameDay
        ? probeDt.toFormat("hh:mm a")
        : `${probeDt.toFormat("dd LLL")} ${probeDt.toFormat("hh:mm a")}`;
    }
  }

  return null;
}

async function findNextMoonSign(params: {
  dateISO: string;
  timezone: string;
  lat: number;
  lon: number;
  currentMoonSign: string | null;
}) {
  if (!params.currentMoonSign) return null;

  async function getMoonSignAt(localDateTime: string) {
    const transit = await getPlanetPositions({
      dateISO: localDateTime,
      tz: params.timezone,
      lat: params.lat,
      lon: params.lon,
    });

    const planets = Array.isArray((transit as any)?.planets)
      ? (transit as any).planets
      : [];

    const moonLon = getPlanetLon(planets, "Moon");
    return getRashiFromLon(moonLon);
  }

  const startDay = DateTime.fromISO(params.dateISO, { zone: params.timezone });

  for (let dayOffset = 0; dayOffset <= 1; dayOffset++) {
    const day = startDay.plus({ days: dayOffset }).toFormat("yyyy-MM-dd");
    const startHour = dayOffset === 0 ? 6 : 0;
    const endHour = dayOffset === 0 ? 23 : 12;

    for (let h = startHour; h <= endHour; h++) {
      const probe = DateTime.fromISO(
        `${day}T${String(h).padStart(2, "0")}:00:00`,
        { zone: params.timezone }
      ).toFormat("yyyy-MM-dd'T'HH:mm:ss");

      const sign = await getMoonSignAt(probe);

      if (sign && sign !== params.currentMoonSign) {
        return sign;
      }
    }
  }

  return null;
}
export async function buildPanchangData(params: {
  dateISO: string;
  time?: string;
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

  const previousSunsetDT =
    solarTimes?.previousSunsetDT && solarTimes.previousSunsetDT.isValid
      ? solarTimes.previousSunsetDT
      : null;

  const nextSunriseDT =
    solarTimes?.nextSunriseDT && solarTimes.nextSunriseDT.isValid
      ? solarTimes.nextSunriseDT
      : null;

  const effectiveTime =
  params.time && String(params.time).trim()
    ? String(params.time).trim()
    : null;

const panchangMoment = effectiveTime
  ? DateTime.fromISO(`${params.dateISO}T${effectiveTime}`, {
      zone: params.timezone,
    }).toFormat("yyyy-MM-dd'T'HH:mm:ss")
  : sunriseDT
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


  const planets = Array.isArray((transit as any)?.planets)
    ? (transit as any).planets
    : [];

  const sunLon = getPlanetLon(planets, "Sun");
  const moonLon = getPlanetLon(planets, "Moon");

  const tithi = getTithiFromSunMoon(sunLon, moonLon);
  const tithiTill = await findTithiChangeTime({
  dateISO: params.dateISO,
  timezone: params.timezone,
  lat: params.lat,
  lon: params.lon,
  currentTithi: tithi,
});
const endDayTransit = await getPlanetPositions({
  dateISO: DateTime.fromISO(`${params.dateISO}T23:59:00`, {
    zone: params.timezone,
  }).toFormat("yyyy-MM-dd'T'HH:mm:ss"),
  tz: params.timezone,
  lat: params.lat,
  lon: params.lon,
});

const endDayPlanets = Array.isArray((endDayTransit as any)?.planets)
  ? (endDayTransit as any).planets
  : [];

const endDaySunLon = getPlanetLon(endDayPlanets, "Sun");
const endDayMoonLon = getPlanetLon(endDayPlanets, "Moon");
const nextTithi = getTithiFromSunMoon(endDaySunLon, endDayMoonLon);
  const nakshatra = getNakshatraFromLon(moonLon);

const nakshatraTill = await findNakshatraChangeTime({
  dateISO: params.dateISO,
  timezone: params.timezone,
  lat: params.lat,
  lon: params.lon,
  currentNakshatra: nakshatra,
});

const nextNakshatra = await findNextNakshatra({
  dateISO: params.dateISO,
  timezone: params.timezone,
  lat: params.lat,
  lon: params.lon,
  currentNakshatra: nakshatra,
});
const yoga = getYogaFromSunMoon(sunLon, moonLon);
const yogaTill = await findYogaChangeTime({
  dateISO: params.dateISO,
  timezone: params.timezone,
  lat: params.lat,
  lon: params.lon,
  currentYoga: yoga,
});

const nextYoga = await findNextYoga({
  dateISO: params.dateISO,
  timezone: params.timezone,
  lat: params.lat,
  lon: params.lon,
  currentYoga: yoga,
});
const karana = getKaranaFromSunMoon(sunLon, moonLon);
const karanaTill = await findKaranaChangeTime({
  dateISO: params.dateISO,
  timezone: params.timezone,
  lat: params.lat,
  lon: params.lon,
  currentKarana: karana,
});
const nextKarana = getKaranaFromSunMoon(endDaySunLon, endDayMoonLon);

const weekday = dt.isValid ? dt.toFormat("cccc") : "—";

const sunSign = getRashiFromLon(sunLon);
const moonSign = getRashiFromLon(moonLon);
const moonSignTill = await findMoonSignChangeTime({
  dateISO: params.dateISO,
  timezone: params.timezone,
  lat: params.lat,
  lon: params.lon,
  currentMoonSign: moonSign,
});

const nextMoonSign = await findNextMoonSign({
  dateISO: params.dateISO,
  timezone: params.timezone,
  lat: params.lat,
  lon: params.lon,
  currentMoonSign: moonSign,
});
const panchak = getPanchakStatus(moonLon);
  const rahuKaal = getRahuKaal(weekday, sunriseDT, sunsetDT);
  const yamaganda = getYamaganda(weekday, sunriseDT, sunsetDT);
const gulika = getGulika(weekday, sunriseDT, sunsetDT);
const abhijitMuhurat = getAbhijitMuhurat(sunriseDT, sunsetDT);
const choghadiya = buildChoghadiyaTable({
  weekdayName: weekday,
  sunriseDT,
  sunsetDT,
});
  return {
    dateISO: params.dateISO,
    dateLabel: dt.isValid ? dt.toFormat("EEEE, dd LLLL yyyy") : params.dateISO,
    weekday,
    tithi,
    paksha: getPakshaFromTithi(tithi),
    nakshatra,
    nakshatraTill,
    yoga,
    yogaTill,
    nextYoga,
    karana,
    karanaTill,
    nextKarana,
    sunrise: solarTimes?.sunrise ?? formatHm(sunriseDT) ?? "—",
    sunset: solarTimes?.sunset ?? formatHm(sunsetDT) ?? "—",
    moonrise: null,
    nakshatraAtSunrise: nakshatra,
    nakshatraNow,
    nextNakshatra,
    tithiTill,
    nextTithi,
    sunSign,
    moonSign,
    moonSignTill,
    nextMoonSign,
    rahuKaal,
    yamaganda,
    gulika,
    abhijitMuhurat,
    choghadiya,
    panchak,
    _sunriseDT: sunriseDT,
    _sunsetDT: sunsetDT,
    _previousSunsetDT: previousSunsetDT,
    _nextSunriseDT: nextSunriseDT,
  };
}