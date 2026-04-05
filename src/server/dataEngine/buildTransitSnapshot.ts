import "server-only";

import type { BirthInput, DataEnginePlan } from "./types";
import { computeTransitPlanetsNow } from "@/server/astro/transits";
import { computeDailyMoonNakshatras } from "@/server/astro/sweDailyMoon";

type BuildTransitSnapshotParams = {
  birth: BirthInput;
  dateISO: string;
  natalAscendant: {
    sign: string;
    signNum: number;
    degree: number;
    house: number;
  };
  natalPlanets: Array<{
    planet: string;
    sign: string;
    signNum: number;
    degree: number;
    house: number;
  }>;
  plan: DataEnginePlan;
};

const SIGN_TO_NUM: Record<string, number> = {
  Aries: 1,
  Taurus: 2,
  Gemini: 3,
  Cancer: 4,
  Leo: 5,
  Virgo: 6,
  Libra: 7,
  Scorpio: 8,
  Sagittarius: 9,
  Capricorn: 10,
  Aquarius: 11,
  Pisces: 12,
};
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
];

function wrap360(x: number) {
  let v = x % 360;
  return v < 0 ? v + 360 : v;
}

function getNakshatraFromLon(lon: number | null | undefined): string | null {
  if (typeof lon !== "number" || !Number.isFinite(lon)) return null;
  const idx = Math.floor(wrap360(lon) / (360 / 27));
  return NAKSHATRAS_27[idx] ?? null;
}
function houseFromLagna(lagnaSignNum: number, transitSignNum: number): number {
  return ((transitSignNum - lagnaSignNum + 12) % 12) + 1;
}

function toEngineBirth(birth: BirthInput) {
  return {
    dateISO: birth.dateISO,
    time: birth.time,
    tz: birth.timezone,
    lat: birth.lat,
    lon: birth.lon,
  };
}

function hhmmInTzForDate(dateISO: string, tz: string): string {
  const now = new Date(`${dateISO}T12:00:00Z`);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const hh = parts.find((p) => p.type === "hour")?.value ?? "12";
  const mm = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${hh}:${mm}`;
}

export async function buildTransitSnapshot(
  params: BuildTransitSnapshotParams
) {
  const { dateISO, natalAscendant, plan, birth } = params;

  const engineBirth = toEngineBirth(birth);

  // 1) Transit planets for the selected date
  const transitNowRaw = await computeTransitPlanetsNow(
    engineBirth,
    natalAscendant.sign,
    {
      dateISO,
      time: "12:00",
      tz: birth.timezone,
    }
  );
const allowedPlanets = new Set([
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Rahu",
  "Ketu",
]);
 const mapped = (Array.isArray(transitNowRaw) ? transitNowRaw : []).map((p: any) => {
  const planetName = String(p?.name ?? p?.planet ?? "").trim();
  const lon = typeof p?.lon === "number" ? p.lon : null;
  const sign = String(p?.sign ?? "");
  const signNum = SIGN_TO_NUM[sign] ?? 0;

  return {
    planet: planetName,
    sign,
    signNum,
    degree: typeof lon === "number" ? Number((lon % 30).toFixed(2)) : null,
    houseFromLagna:
      typeof p?.house === "number"
        ? p.house
        : houseFromLagna(natalAscendant.signNum, signNum),
    retrograde:
      typeof p?.retrograde === "boolean"
        ? p.retrograde
        : planetName === "Rahu" || planetName === "Ketu",
    nakshatra: getNakshatraFromLon(lon),
    lon,
  };
});

const byPlanet = new Map(
  mapped.map((p: any) => [p.planet, p])
);

const planets = [
  byPlanet.get("Sun"),
  byPlanet.get("Moon"),
  byPlanet.get("Mercury"),
  byPlanet.get("Venus"),
  byPlanet.get("Mars"),
  byPlanet.get("Jupiter"),
  byPlanet.get("Saturn"),
  byPlanet.get("Rahu"),
  byPlanet.get("Ketu"),
].filter(Boolean);

  // 2) Daily Moon rows anchored on selected date
  const dailyMoon = await computeDailyMoonNakshatras(
    {
      dateISO: birth.dateISO,
      time: birth.time,
      baseDateISO: dateISO,
      baseTime: hhmmInTzForDate(dateISO, birth.timezone),
      tz: birth.timezone,
      lat: birth.lat,
      lon: birth.lon,
    },
    14
  );

  const moonPlanet = planets.find((p: any) => p.planet === "Moon") ?? null;
  const firstMoon =
  Array.isArray(dailyMoon) && dailyMoon.length > 0
    ? dailyMoon[0]
    : null;
return {
  dateISO,
  planets,
  moonToday: firstMoon
    ? {
        sign: moonPlanet?.sign ?? null,
        signNum: moonPlanet?.signNum ?? null,
        degree: moonPlanet?.degree ?? null,
        houseFromLagna: moonPlanet?.houseFromLagna ?? null,
        nakshatra:
          firstMoon.moonNakshatra ??
          moonPlanet?.nakshatra ??
          null,
        pada: null,
        houseFromMoon: firstMoon.houseFromMoon ?? null,
      }
    : {
        sign: moonPlanet?.sign ?? null,
        signNum: moonPlanet?.signNum ?? null,
        degree: moonPlanet?.degree ?? null,
        houseFromLagna: moonPlanet?.houseFromLagna ?? null,
        nakshatra: moonPlanet?.nakshatra ?? null,
        pada: null,
        houseFromMoon: null,
      },
  dailyMoon,
  ...(plan === "pro"
    ? {
        contacts: [],
      }
    : {}),
  sourceNote: `Real transit snapshot for ${dateISO}`,
};
}