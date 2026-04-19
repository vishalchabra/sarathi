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

const SIGN_LORDS: Record<string, string> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

const EXALTATION_SIGNS: Record<string, string | null> = {
  Sun: "Aries",
  Moon: "Taurus",
  Mars: "Capricorn",
  Mercury: "Virgo",
  Jupiter: "Cancer",
  Venus: "Pisces",
  Saturn: "Libra",
  Rahu: null,
  Ketu: null,
};

const DEBILITATION_SIGNS: Record<string, string | null> = {
  Sun: "Libra",
  Moon: "Scorpio",
  Mars: "Cancer",
  Mercury: "Pisces",
  Jupiter: "Capricorn",
  Venus: "Virgo",
  Saturn: "Aries",
  Rahu: null,
  Ketu: null,
};

const OWN_SIGNS: Record<string, string[]> = {
  Sun: ["Leo"],
  Moon: ["Cancer"],
  Mars: ["Aries", "Scorpio"],
  Mercury: ["Gemini", "Virgo"],
  Jupiter: ["Sagittarius", "Pisces"],
  Venus: ["Taurus", "Libra"],
  Saturn: ["Capricorn", "Aquarius"],
  Rahu: [],
  Ketu: [],
};

const NATURAL_RELATIONSHIPS: Record<string, { friends: string[]; enemies: string[] }> = {
  Sun: { friends: ["Moon", "Mars", "Jupiter"], enemies: ["Venus", "Saturn"] },
  Moon: { friends: ["Sun", "Mercury"], enemies: [] },
  Mars: { friends: ["Sun", "Moon", "Jupiter"], enemies: ["Mercury"] },
  Mercury: { friends: ["Sun", "Venus"], enemies: ["Moon"] },
  Jupiter: { friends: ["Sun", "Moon", "Mars"], enemies: ["Mercury", "Venus"] },
  Venus: { friends: ["Mercury", "Saturn"], enemies: ["Sun", "Moon"] },
  Saturn: { friends: ["Mercury", "Venus"], enemies: ["Sun", "Moon", "Mars"] },
  Rahu: { friends: [], enemies: [] },
  Ketu: { friends: [], enemies: [] },
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
const SIGN_NAMES = [
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

function signFromLongitude(lon: number | null | undefined): {
  sign: string;
  signNum: number;
  degree: number | null;
} {
  if (typeof lon !== "number" || !Number.isFinite(lon)) {
    return { sign: "", signNum: 0, degree: null };
  }

  const normalized = wrap360(lon);
  const signIndex = Math.floor(normalized / 30);
  const sign = SIGN_NAMES[signIndex] ?? "";
  const signNum = signIndex + 1;
  const degree = Number((normalized % 30).toFixed(2));

  return { sign, signNum, degree };
}




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

function houseFromMoon(moonSignNum: number, planetSignNum: number): number {
  return ((planetSignNum - moonSignNum + 12) % 12) + 1;
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

function getCurrentHHMMInTimezone(tz: string): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const hh = parts.find((p) => p.type === "hour")?.value ?? "12";
  const mm = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${hh}:${mm}`;
}

function getCurrentDateISOInTimezone(tz: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((p) => p.type === "year")?.value ?? "1970";
  const month = parts.find((p) => p.type === "month")?.value ?? "01";
  const day = parts.find((p) => p.type === "day")?.value ?? "01";

  return `${year}-${month}-${day}`;
}

function resolveTransitSnapshotTime(dateISO: string, tz: string): string {
  const todayInTz = getCurrentDateISOInTimezone(tz);

  // Live current time for today's transits
  if (dateISO === todayInTz) {
    return getCurrentHHMMInTimezone(tz);
  }

  // Stable reference time for past/future dates
  return "12:00";
}

function getRelationship(planet: string, signLord: string | null) {
  if (!signLord) return "n/a";
  if (planet === signLord) return "self";

  const rel = NATURAL_RELATIONSHIPS[planet];
  if (!rel) return "n/a";

  if (rel.friends.includes(signLord)) return "friend";
  if (rel.enemies.includes(signLord)) return "enemy";
  return "neutral";
}

function getDignity(p: string, sign: string, rel: string) {
  if (EXALTATION_SIGNS[p] === sign) return "Exalted";
  if (DEBILITATION_SIGNS[p] === sign) return "Debilitated";
  if ((OWN_SIGNS[p] ?? []).includes(sign)) return "Own Sign";
  if (rel === "friend") return "Friend Sign";
  if (rel === "enemy") return "Enemy Sign";
  return "Neutral Sign";
}

function getStrengthBand(dignity: string) {
  if (dignity === "Exalted") return "very_strong";
  if (dignity === "Own Sign") return "strong";
  if (dignity === "Friend Sign") return "strong";
  if (dignity === "Enemy Sign") return "weak";
  if (dignity === "Debilitated") return "weak";
  return "mixed";
}

export async function buildTransitSnapshot(
  params: BuildTransitSnapshotParams
) {
  const { dateISO, natalAscendant, plan, birth } = params;

  const engineBirth = toEngineBirth(birth);
  const transitTime = resolveTransitSnapshotTime(dateISO, birth.timezone);



const transitNowRaw = await computeTransitPlanetsNow(
  engineBirth,
  natalAscendant.sign,
  {
    dateISO,
    time: transitTime,
    tz: birth.timezone,
  }
);

const mapped = (Array.isArray(transitNowRaw) ? transitNowRaw : []).map((p: any) => {
  const planetName = String(p?.name ?? p?.planet ?? "").trim();
  const lon = typeof p?.lon === "number" ? p.lon : null;

  const derived = signFromLongitude(lon);
  const sign = derived.sign;
  const signNum = derived.signNum;
  const degree = derived.degree;

  const signLord = SIGN_LORDS[sign] ?? null;
  const relationship = getRelationship(planetName, signLord);
  const dignity = getDignity(planetName, sign, relationship);
  const strengthBand = getStrengthBand(dignity);

  return {
    planet: planetName,
    sign,
    signNum,
    degree,
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
    signLord,
    relationshipToSignLord: relationship,
    dignity,
    strengthBand,
  };
});

  const byPlanet = new Map(mapped.map((p: any) => [p.planet, p]));

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

  const moonPlanet = planets.find((p: any) => p.planet === "Moon") ?? null;
  const moonSignNum = moonPlanet?.signNum ?? null;

  const planetsWithMoon = planets.map((p: any) => {
    return {
      ...p,
      houseFromMoon:
        typeof moonSignNum === "number" && typeof p.signNum === "number"
          ? houseFromMoon(moonSignNum, p.signNum)
          : null,
    };
  });

  const dailyMoon = await computeDailyMoonNakshatras(
    {
      dateISO: birth.dateISO,
      time: birth.time,
      baseDateISO: dateISO,
      baseTime: transitTime,
      tz: birth.timezone,
      lat: birth.lat,
      lon: birth.lon,
    },
    14
  );

  const firstMoon =
    Array.isArray(dailyMoon) && dailyMoon.length > 0
      ? dailyMoon[0]
      : null;

  return {
    dateISO,
    snapshotTime: transitTime,
    snapshotMode: dateISO === getCurrentDateISOInTimezone(birth.timezone) ? "live_now" : "fixed_noon",
    planets: planetsWithMoon,
    moonToday: firstMoon
      ? {
          sign: moonPlanet?.sign ?? null,
          signNum: moonPlanet?.signNum ?? null,
          degree: moonPlanet?.degree ?? null,
          houseFromLagna: moonPlanet?.houseFromLagna ?? null,
          nakshatra: firstMoon.moonNakshatra ?? moonPlanet?.nakshatra ?? null,
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
    sourceNote: `Real transit snapshot for ${dateISO} at ${transitTime} (${birth.timezone})`,
  };
}