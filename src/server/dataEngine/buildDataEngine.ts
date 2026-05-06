import "server-only";

import { DateTime } from "luxon";
import { buildHouseData } from "@/server/dataEngine/buildHouseData";
import { buildFunctionalRoles } from "@/server/dataEngine/buildFunctionalRoles";
import { buildVargaData } from "@/server/dataEngine/buildVargaData";
import { buildDashaData } from "@/server/dataEngine/buildDashaData";
import { buildTransitSnapshot } from "@/server/dataEngine/buildTransitSnapshot";
import { buildCompareData } from "@/server/dataEngine/buildCompareData";
import { getAscendant } from "@/server/astro/asc";
import { computePlacements } from "@/server/astro/placements";
import { sweJulday, sweCall, getSweConstants } from "@/server/astro/swe-remote";
import { buildTransitContacts } from "./buildTransitContacts";
import { buildUpcomingTransits } from "./buildUpcomingTransits";
import { buildTransitWindows } from "./buildTransitWindows";
import { computeDegreeHits } from "./triggerEngine/degreeHits";
import { buildPanchangData } from "./buildPanchangData";
import { buildTriggerFacts } from "./triggerEngine/buildFacts";
import { scoreAllTriggerAreas } from "./triggerEngine/scoring";
import { getTopAreas } from "./triggerEngine/selectTop";
import { buildMicroTriggerDays } from "./triggerEngine/microTriggerDays";
import { buildNatalAspects } from "./buildNatalAspects";
import { buildPlanetStrength } from "./buildPlanetStrength";
import { buildTransitNatalInteractions } from "./buildTransitNatalInteractions";
import buildDashaLordContext from "@/server/dataEngine/buildDashaLordContext";
import buildNakshatraContext from "@/server/dataEngine/buildNakshatraContext";
import buildVedicAspects from "@/server/dataEngine/buildVedicAspects";
import buildHouseJudgement from "@/server/dataEngine/buildHouseJudgement";
import { buildBhavaChalitData } from "./buildBhavaChalitData";
import { buildHouseCusps } from "./buildHouseCusps";
import { buildClassicChalit } from "./buildClassicChalit";
import { buildShadbala } from "./buildShadbala";
import { buildAshtakvarga } from "./buildAshtakvarga";
import { buildPrasthara } from "./buildPrasthara";
import { buildBhavMadhya } from "./buildBhavMadhya";
import { buildFiveFoldFriendship } from "./buildFiveFoldFriendship";
import { buildAvakhada } from "./buildAvakhada";
import tzLookup from "tz-lookup";
import { buildArudhas } from "./buildArudhaLagna";
import { buildUpagrahaData } from "./buildUpagrahaData";
import { buildSolarShadowPoints } from "./buildSolarShadowPoints";
import { buildKpPlanetOnCusp } from "@/lib/astrology/kp/buildKpPlanetOnCusp";
import { buildShadbalaInsights } from "./interpretShadbala";
import { getAffliction } from "./affliction";

import {
  sweJulday as sweWasmJulday,
  sweCalcUt as sweWasmCalcUt,
  sweGetAyanamsaUt as sweWasmGetAyanamsaUt,
} from "../astro/swe-wasm";
export type DataEnginePlan = "light" | "pro";

export type BirthInput = {
  name?: string;
  dateISO: string;
  time: string;
  timezone: string;
  lat: number;
  lon: number;
};

export type BuildDataEngineParams = {
  birth: BirthInput;
  plan?: DataEnginePlan;
  selectedDateISO?: string;
  compareDateISO?: string;
  utilityDateISO?: string;
  utilityHoraDateISO?: string;
  utilityTime?: string;
  utilityPlace?: {
    name?: string;
    lat: number;
    lon: number;
    timezone?: string;
  };
};

type BirthMeta = {
  name?: string;
  dateISO: string;
  time: string;
  timezone: string;
  lat: number;
  lon: number;
  ayanamsa: string;
  panchang?: any;
  hora?: string | null;
  horaNumber?: number | null;
  horaPhase?: string | null;
  horaStartsAt?: string | null;
  horaEndsAt?: string | null;
};
type ArudhaMap = Record<
  string,
  {
    sign: string;
  }
>;
export type DataEngineOutput = {
  meta: {
    generatedAtISO: string;
    plan: DataEnginePlan;
    selectedDateISO: string;
    compareDateISO: string | null;
  };

  foundations: {
    birthMeta: BirthMeta;
    ascendant: any;
    natal: any;
    houses: any;
    roles: any;
    vedicAspects: any;
    houseJudgement: any;
    upagrahas: any;
    solarShadowPoints: any;
    personalStrength: any;
  };

timing: {
  dasha: any;
  selectedDate: any;
  panchang: any;
  moonContext: any;
  dashaContext: any;
  nakshatraContext: any;
  utilities: {
    dateISO: string;
    horaDateISO: string;
    time: string;
    place: {
      name?: string;
      lat: number;
      lon: number;
      timezone?: string;
    };
    timezone: string;
    panchang: any;
    hora: {
      horaLord: string | null;
      horaNumber: number | null;
      phase: string | null;
      startsAt: string | null;
      endsAt: string | null;
    };
  };
  personalStrength: {
    tarabalam: {
      tara: string;
      favorable: boolean;
      challenging: boolean;
      distance: number;
    } | null;
    chandrabalam: {
      transitMoonSign: string;
      houseFromNatalMoon: number;
      favorable: boolean;
    } | null;
    natalMoonNakshatra: string | null;
    natalMoonSign: string | null;
    transitMoonNakshatra: string | null;
    transitMoonSign: string | null;
  };
};

  transits: {
    transitNow: any;
    transitContacts: any[];
    transitInteractions: any[];
    upcomingEvents: {
      moonTransits: any[];
      planetaryTransits: any[];
      allEvents: any[];
    };
    transitWindows: any[];
    compare: any | null;
  };
triggerEngine: {
  topAreas: any[];
  facts: any[];
  scores: any[];
  degreeHits: any[];
  microTriggerDays: any[];
};
   strength: {
  shadbala: Array<{
    planet: string;
    total: number;
    sthana: number;
    dig: number;
    kala: number;
    chestha: number;
    naisargika: number;
    drik: number;
  }>;

  shadbalaInsights: Array<{
    planet: string;
    strength: "strong" | "medium" | "weak";
    tone: "support" | "mixed" | "pressure";
    summary: string;
    usageNote: string;
  }>;
    afflictions?: Array<{
    planet: string;
    level: "clean" | "mild" | "afflicted";
    score: number;
    reasons: string[];
  }>;
    ashtakvarga: {
      planets: Array<{
        planet: string;
        houses: number[];
        total: number;
      }>;
      sarva: number[];
    };
    prasthara: Record<string, Record<string, number[]>>;
    bhavMadhya: Array<{
      house: number;
      cusp: {
        lon: number;
        sign: string;
        degree: number;
      } | null;
      start: {
        lon: number;
        sign: string;
        degree: number;
      } | null;
      end: {
        lon: number;
        sign: string;
        degree: number;
      } | null;
    }>;
    kpPlanetOnCusp: any;
    fiveFoldFriendship: Array<{
      planet: string;
      relationships: Array<{
        withPlanet: string;
        natural: string;
        temporary: string;
        final: string;
      }>;
    }>;
    avakhada: {
      nakshatra: string;
      pada: number | null;
      rashi: string | null;
      gana: string;
      yoni: string;
      nadi: string;
      varna: string;
    } | null;
  };

  vargas: any;
  arudhas: ArudhaMap;
  // backward compatibility
  birthMeta: BirthMeta;
  natal: any;
  houses: any;
  roles: any;
  vedicAspects: any;
  houseJudgement: any;
  upagrahas: any;
  solarShadowPoints: any;
  kpPlanetOnCusp: any;
  bhavaChalit: any;
  classicChalit: any;
  dasha: any;
  transitNow: any;
  transitContacts: any[];
  transitInteractions: any[];
  upcomingTransits: {
    moonTransits: any[];
    planetaryTransits: any[];
    allEvents: any[];
  };
  transitWindows: any[];
  selectedDate: any;
  compare: any | null;
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

function normalizePlan(plan?: string): DataEnginePlan {
  return plan === "pro" ? "pro" : "light";
}

function resolveSelectedDateISO(selectedDateISO?: string): string {
  const raw = String(selectedDateISO || "").trim();
  if (raw) return raw;
  return new Date().toISOString().slice(0, 10);
}

function toBirthUTCISO(birth: BirthInput): string {
  return (
    DateTime.fromISO(`${birth.dateISO}T${birth.time}`, {
      zone: birth.timezone,
    })
      .toUTC()
      .toISO({ suppressMilliseconds: false }) ?? ""
  );
}

const HORA_SEQUENCE = [
  "Sun",
  "Venus",
  "Mercury",
  "Moon",
  "Saturn",
  "Jupiter",
  "Mars",
] as const;

const WEEKDAY_LORDS = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
] as const;

function getHoraIndexForPlanet(planet: string) {
  return HORA_SEQUENCE.findIndex((p) => p === planet);
}

function getNextWeekdayLord(date: any) {
  const nextDay = date.plus({ days: 1 });
  return WEEKDAY_LORDS[nextDay.weekday % 7];
}
function normalizeSolarDateTime(
  value: any,
  baseDateISO: string,
  timezone: string
) {
  if (!value) return null;

  // Luxon DateTime
  if (typeof value === "object" && typeof value.isValid === "boolean") {
    return value.isValid ? value : null;
  }

  // JS Date
  if (value instanceof Date) {
    const dt = DateTime.fromJSDate(value, { zone: timezone });
    return dt.isValid ? dt : null;
  }

  // String
  const raw = String(value).trim();

  // HH:mm or HH:mm:ss
  const hhmmMatch = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (hhmmMatch) {
    const hh = hhmmMatch[1].padStart(2, "0");
    const mm = hhmmMatch[2];
    const ss = hhmmMatch[3] ?? "00";
    const dt = DateTime.fromISO(`${baseDateISO}T${hh}:${mm}:${ss}`, {
      zone: timezone,
    });
    return dt.isValid ? dt : null;
  }

  // ISO-like string
  const iso = DateTime.fromISO(raw, { zone: timezone });
  if (iso.isValid) return iso;

  return null;
}
function getAccurateHoraLord(params: {
  birthDateISO: string;
  birthTime: string;
  timezone: string;
  sunrise: any | null;
  sunset: any | null;
  previousSunset?: any | null;
  nextSunrise?: any | null;
}) {
  const {
    birthDateISO,
    birthTime,
    timezone,
    sunrise,
    sunset,
    previousSunset,
    nextSunrise,
  } = params;

  const birthDT = DateTime.fromISO(`${birthDateISO}T${birthTime}`, {
    zone: timezone,
  });

  if (!birthDT.isValid) {
    return {
      horaLord: null,
      horaNumber: null,
      phase: null,
      startsAt: null,
      endsAt: null,
    };
  }

  const sunriseDT = normalizeSolarDateTime(sunrise, birthDateISO, timezone);
  const sunsetDT = normalizeSolarDateTime(sunset, birthDateISO, timezone);
  const previousSunsetDT = normalizeSolarDateTime(
    previousSunset ?? null,
    DateTime.fromISO(birthDateISO, { zone: timezone })
      .minus({ days: 1 })
      .toFormat("yyyy-MM-dd"),
    timezone
  );
  const nextSunriseDT = normalizeSolarDateTime(
    nextSunrise ?? null,
    DateTime.fromISO(birthDateISO, { zone: timezone })
      .plus({ days: 1 })
      .toFormat("yyyy-MM-dd"),
    timezone
  );

  if (!sunriseDT || !sunsetDT) {
    return {
      horaLord: null,
      horaNumber: null,
      phase: null,
      startsAt: null,
      endsAt: null,
    };
  }

  // Determine which sunrise-based weekday owns the Hora cycle
  const horaDayDT = birthDT < sunriseDT ? birthDT.minus({ days: 1 }) : birthDT;
  const weekdayLord = WEEKDAY_LORDS[horaDayDT.weekday % 7];
  const startIndex = getHoraIndexForPlanet(weekdayLord);

  if (startIndex < 0) {
    return {
      horaLord: null,
      horaNumber: null,
      phase: null,
      startsAt: null,
      endsAt: null,
    };
  }

  // Day Hora
  if (birthDT >= sunriseDT && birthDT < sunsetDT) {
    const dayMinutes = sunsetDT.diff(sunriseDT, "minutes").minutes;
    const horaLength = dayMinutes / 12;
    const elapsed = birthDT.diff(sunriseDT, "minutes").minutes;

    const horaNumber = Math.min(12, Math.floor(elapsed / horaLength) + 1);
    const sequenceIndex = (startIndex + (horaNumber - 1)) % 7;
    const horaLord = HORA_SEQUENCE[sequenceIndex];

    const startsAt = sunriseDT.plus({ minutes: (horaNumber - 1) * horaLength });
    const endsAt = sunriseDT.plus({ minutes: horaNumber * horaLength });

    return {
      horaLord,
      horaNumber,
      phase: "day",
      startsAt: startsAt.toFormat("HH:mm"),
      endsAt: endsAt.toFormat("HH:mm"),
    };
  }

  // Night Hora after sunset -> next sunrise
  if (birthDT >= sunsetDT) {
    if (!nextSunriseDT) {
      return {
        horaLord: null,
        horaNumber: null,
        phase: null,
        startsAt: null,
        endsAt: null,
      };
    }

    const nightStartIndex = (startIndex + 12) % 7;
    const nightMinutes = nextSunriseDT.diff(sunsetDT, "minutes").minutes;
    const horaLength = nightMinutes / 12;
    const elapsed = birthDT.diff(sunsetDT, "minutes").minutes;

    const horaNumber = Math.min(12, Math.max(1, Math.floor(elapsed / horaLength) + 1));
    const sequenceIndex = (nightStartIndex + (horaNumber - 1)) % 7;
    const horaLord = HORA_SEQUENCE[sequenceIndex];

    const startsAt = sunsetDT.plus({ minutes: (horaNumber - 1) * horaLength });
    const endsAt = sunsetDT.plus({ minutes: horaNumber * horaLength });

    return {
      horaLord,
      horaNumber,
      phase: "night",
      startsAt: startsAt.toFormat("HH:mm"),
      endsAt: endsAt.toFormat("HH:mm"),
    };
  }

  // Night Hora before sunrise -> previous sunset to current sunrise
  if (birthDT < sunriseDT) {
    if (!previousSunsetDT) {
      return {
        horaLord: null,
        horaNumber: null,
        phase: null,
        startsAt: null,
        endsAt: null,
      };
    }

    const nightStartIndex = (startIndex + 12) % 7;
    const nightMinutes = sunriseDT.diff(previousSunsetDT, "minutes").minutes;
    const horaLength = nightMinutes / 12;
    const elapsed = birthDT.diff(previousSunsetDT, "minutes").minutes;

    const horaNumber = Math.min(12, Math.max(1, Math.floor(elapsed / horaLength) + 1));
    const sequenceIndex = (nightStartIndex + (horaNumber - 1)) % 7;
    const horaLord = HORA_SEQUENCE[sequenceIndex];

    const startsAt = previousSunsetDT.plus({ minutes: (horaNumber - 1) * horaLength });
    const endsAt = previousSunsetDT.plus({ minutes: horaNumber * horaLength });

    return {
      horaLord,
      horaNumber,
      phase: "night",
      startsAt: startsAt.toFormat("HH:mm"),
      endsAt: endsAt.toFormat("HH:mm"),
    };
  }

  return {
    horaLord: null,
    horaNumber: null,
    phase: null,
    startsAt: null,
    endsAt: null,
  };
}
function normalizeBirthTimezone(birth: BirthInput): BirthInput {
  try {
    const derivedTimezone = tzLookup(birth.lat, birth.lon);

    return {
      ...birth,
      timezone: derivedTimezone,
    };
  } catch {
    return birth;
  }
}
async function getTrueNodeSiderealLongitudes(birth: BirthInput) {
  const d = DateTime.fromISO(`${birth.dateISO}T${birth.time}`, {
    zone: birth.timezone,
  })
    .toUTC()
    .toJSDate();

  const ut =
    d.getUTCHours() +
    d.getUTCMinutes() / 60 +
    d.getUTCSeconds() / 3600;

  const constants = await getSweConstants();

  const jdUt = await sweJulday(
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    ut,
    constants.SE_GREG_CAL
  );

  const ayanamsa = await sweCall<number>("swe_get_ayanamsa_ut", jdUt);

  const trueNodeTropical = await sweCall<any>(
    "swe_calc_ut",
    jdUt,
    constants.SE_TRUE_NODE,
    constants.SEFLG_SWIEPH | constants.SEFLG_SPEED
  );

  const rahuLonSid = ((Number(trueNodeTropical?.longitude ?? 0) - ayanamsa) % 360 + 360) % 360;
  const ketuLonSid = (rahuLonSid + 180) % 360;

  return {
    rahuLonSid,
    ketuLonSid,
  };
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
] as const;

function getNakshatraAndPadaFromLon(lon: number | null | undefined) {
  if (typeof lon !== "number" || Number.isNaN(lon)) {
    return { nakshatra: null, pada: null };
  }

  const x = ((lon % 360) + 360) % 360;
  const nakSpan = 360 / 27; // 13°20'
  const idx = Math.floor(x / nakSpan);
  const withinNak = x % nakSpan;
  const pada = Math.floor(withinNak / (nakSpan / 4)) + 1;

  return {
    nakshatra: NAKSHATRA_NAMES[idx] ?? null,
    pada,
  };
}
  const TARA_SEQUENCE = [
  "Janma",
  "Sampat",
  "Vipat",
  "Kshema",
  "Pratyari",
  "Sadhaka",
  "Naidhana",
  "Mitra",
  "Parama Mitra",
] as const;

function getTarabalam(natalNakshatra: string | null, transitNakshatra: string | null) {
  if (!natalNakshatra || !transitNakshatra) return null;

  const nakshatras = [
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

  const natalIndex = nakshatras.indexOf(natalNakshatra);
  const transitIndex = nakshatras.indexOf(transitNakshatra);

  if (natalIndex === -1 || transitIndex === -1) return null;

  const distance = (transitIndex - natalIndex + 27) % 27;
  const taraIndex = distance % 9;
  const tara = TARA_SEQUENCE[taraIndex];

  const favorable = ["Sampat", "Kshema", "Sadhaka", "Mitra", "Parama Mitra"].includes(tara);
  const challenging = ["Vipat", "Pratyari", "Naidhana"].includes(tara);

  return {
    tara,
    favorable,
    challenging,
    distance: distance + 1,
  };
}

function getChandrabalam(natalMoonSign: string | null, transitMoonSign: string | null) {
  const rashis = [
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

  if (!natalMoonSign || !transitMoonSign) return null;

  const natalIndex = rashis.indexOf(natalMoonSign);
  const transitIndex = rashis.indexOf(transitMoonSign);

  if (natalIndex === -1 || transitIndex === -1) return null;

  const houseFromMoon = ((transitIndex - natalIndex + 12) % 12) + 1;

  const favorableHouses = [1, 3, 6, 7, 10, 11];
  const favorable = favorableHouses.includes(houseFromMoon);

  return {
    transitMoonSign,
    houseFromNatalMoon: houseFromMoon,
    favorable,
  };
}
export async function buildDataEngine(
  params: BuildDataEngineParams
): Promise<DataEngineOutput> {
  const plan = normalizePlan(params.plan);
  const selectedDateISO = resolveSelectedDateISO(params.selectedDateISO);
  const compareDateISO = String(params.compareDateISO || "").trim() || null;
  const birth = normalizeBirthTimezone(params.birth);
  const utilityDateISO =
  String(params.utilityDateISO || selectedDateISO).trim() || selectedDateISO;

const utilityHoraDateISO =
  String(params.utilityHoraDateISO || utilityDateISO).trim() || utilityDateISO;

const utilityTime =
  String(params.utilityTime || "12:00").trim() || "12:00";
const utilityPlace = params.utilityPlace ?? {
  name: birth.name,
  lat: birth.lat,
  lon: birth.lon,
  timezone: birth.timezone,
};
const utilityTimezone = utilityPlace.timezone || birth.timezone;


const utilityPanchang = await buildPanchangData({
  dateISO: utilityDateISO,
  timezone: utilityTimezone,
  lat: utilityPlace.lat,
  lon: utilityPlace.lon,
  transitNow: null,
});
const utilityHoraPanchang = await buildPanchangData({
  dateISO: utilityHoraDateISO,
  timezone: utilityTimezone,
  lat: utilityPlace.lat,
  lon: utilityPlace.lon,
  transitNow: null,
});

const utilityHoraInfo = getAccurateHoraLord({
  birthDateISO: utilityHoraDateISO,
  birthTime: utilityTime,
  timezone: utilityTimezone,
  sunrise: utilityHoraPanchang?._sunriseDT ?? null,
  sunset: utilityHoraPanchang?._sunsetDT ?? null,
  previousSunset: utilityHoraPanchang?._previousSunsetDT ?? null,
  nextSunrise: utilityHoraPanchang?._nextSunriseDT ?? null,
});
  const asc = await getAscendant({
    dateISO: birth.dateISO,
    time: birth.time,
    tz: birth.timezone,
    lat: birth.lat,
    lon: birth.lon,
  });

  const trueNodeLons = await getTrueNodeSiderealLongitudes(birth);

  const rawPlacements = await computePlacements({
    dateISO: birth.dateISO,
    time: birth.time,
    tz: birth.timezone,
    lat: birth.lat,
    lon: birth.lon,
  });

  const rawNodeLonMap = new Map(
    (Array.isArray(rawPlacements) ? rawPlacements : [])
      .filter((p: any) => p?.planet === "Rahu" || p?.planet === "Ketu")
      .map((p: any) => [p.planet, p.lon])
  );
if (!asc || typeof asc.lon !== "number") {
  throw new Error("Ascendant calculation failed — invalid result");
}

const ascSign = asc.sign;
const ascLon = asc.lon;

if (asc.lon < 0 || asc.lon > 360) {
  throw new Error("Ascendant longitude out of bounds");
}

const ascSignNum = SIGN_TO_NUM[ascSign] ?? 0;

const classicalReportPlanets = (Array.isArray(rawPlacements) ? rawPlacements : []).map((p: any) => {

  if (p.planet === "Rahu") {
    const lon =
      typeof rawNodeLonMap.get("Rahu") === "number"
        ? rawNodeLonMap.get("Rahu")
        : trueNodeLons.rahuLonSid;

    const nakInfo = getNakshatraAndPadaFromLon(lon);
    const signNum = SIGN_TO_NUM[p.sign] ?? 0;
    const house =
      signNum && ascSignNum
        ? ((signNum - ascSignNum + 12) % 12) + 1
        : null;

   return {
  ...p,
  signNum,
  house,
  nakshatra: p.nakshatra ?? nakInfo.nakshatra,
  pada: p.pada ?? nakInfo.pada,
  speed:
    typeof p.speed === "number"
      ? p.speed
      : typeof p.speedLon === "number"
      ? p.speedLon
      : typeof p.longitudeSpeed === "number"
      ? p.longitudeSpeed
      : null,
  retrograde:
    typeof p.speed === "number"
      ? p.speed < 0
      : typeof p.speedLon === "number"
      ? p.speedLon < 0
      : typeof p.longitudeSpeed === "number"
      ? p.longitudeSpeed < 0
      : false,
  combust: false,
  lordships: [],
};
  }

  if (p.planet === "Ketu") {
    const lon =
      typeof rawNodeLonMap.get("Ketu") === "number"
        ? rawNodeLonMap.get("Ketu")
        : trueNodeLons.ketuLonSid;

    const nakInfo = getNakshatraAndPadaFromLon(lon);
    const signNum = SIGN_TO_NUM[p.sign] ?? 0;
    const house =
      signNum && ascSignNum
        ? ((signNum - ascSignNum + 12) % 12) + 1
        : null;

    return {
      ...p,
      lon,
      degree: Number((lon % 30).toFixed(2)),
      signNum,
      house,
      nakshatra: p.nakshatra ?? nakInfo.nakshatra,
      pada: p.pada ?? nakInfo.pada,
      retrograde: true,
      combust: false,
      lordships: [],
    };
  }

  const nakInfo = getNakshatraAndPadaFromLon(p.lon);
  const signNum = SIGN_TO_NUM[p.sign] ?? 0;
  const house =
    signNum && ascSignNum
      ? ((signNum - ascSignNum + 12) % 12) + 1
      : null;

  return {
    ...p,
    signNum,
    house,
    nakshatra: p.nakshatra ?? nakInfo.nakshatra,
    pada: p.pada ?? nakInfo.pada,
    retrograde: false,
    combust: false,
    lordships: [],
  };
});

const OUTER_PLANET_CODES = [
  { planet: "Uranus", code: 7 },
  { planet: "Neptune", code: 8 },
  { planet: "Pluto", code: 9 },
];

const birthDtUtc = DateTime.fromISO(`${birth.dateISO}T${birth.time}`, {
  zone: birth.timezone,
}).toUTC();

const birthHour =
  birthDtUtc.hour +
  birthDtUtc.minute / 60 +
  birthDtUtc.second / 3600;

const outerJdUt = await sweWasmJulday(
  birthDtUtc.year,
  birthDtUtc.month,
  birthDtUtc.day,
  birthHour,
  1
);

const outerAyanamsa = await sweWasmGetAyanamsaUt(outerJdUt);

const signNames = [
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

const outerPlanets = await Promise.all(
  OUTER_PLANET_CODES.map(async ({ planet, code }) => {
    const r: any = await sweWasmCalcUt(outerJdUt, code, 0);

    const lonTrop =
      r?.longitude ??
      r?.x?.[0] ??
      r?.xx?.[0] ??
      (Array.isArray(r) ? r[0] : null);

    if (typeof lonTrop !== "number" || !Number.isFinite(lonTrop)) {
      return null;
    }

    const lon = ((lonTrop - outerAyanamsa) % 360 + 360) % 360;
    const signNum = Math.floor(lon / 30) + 1;
    const sign = signNames[signNum - 1] ?? "Unknown";
    const nakInfo = getNakshatraAndPadaFromLon(lon);

    const house =
      signNum && ascSignNum
        ? ((signNum - ascSignNum + 12) % 12) + 1
        : null;

    return {
      planet,
      lon,
      longitude: lon,
      sign,
      signNum,
      degree: Number((lon % 30).toFixed(2)),
      house,
      nakshatra: nakInfo.nakshatra,
      pada: nakInfo.pada,
      retrograde: false,
      combust: false,
      lordships: [],
    };
  })
);

const reportPlanets = [
  ...classicalReportPlanets,
  ...outerPlanets.filter(Boolean),
];

const natalAspects = buildNatalAspects({
  natalPlanets: reportPlanets,
});

const natalBase = {
  ayanamsa: "Lahiri",
  birthUTCISO: toBirthUTCISO(birth),
  moonLonSidDeg:
    reportPlanets.find((p: any) => p.planet === "Moon")?.lon ?? null,

  ascendant: {
    sign: ascSign,
    signNum: ascSignNum,
    degree:
      typeof ascLon === "number"
        ? Number((ascLon % 30).toFixed(2))
        : null,
    house: 1,
    lon: typeof ascLon === "number" ? ascLon : null,
  },

  planets: reportPlanets,
  aspects: natalAspects,
  sourceNote: "Built directly from placements + ascendant",
};

const natal = {
  ...natalBase,
  strengths: buildPlanetStrength({
    natalPlanets: reportPlanets,
    vargaData: {},
  }),
};

const ascendantForBuilders = {
  sign: natalBase.ascendant?.sign ?? "—",
  signNum: natalBase.ascendant?.signNum ?? 0,
  degree: natalBase.ascendant?.degree ?? null,
  house: 1,
  lon: natalBase.ascendant?.lon ?? null,
} as any;

const houses = await buildHouseData({
  ascendant: ascendantForBuilders,
  natalPlanets: natalBase.planets,
});

const roles = await buildFunctionalRoles({
  ascendant: ascendantForBuilders,
  houses,
  natalPlanets: natalBase.planets,
});

const vargas = await buildVargaData({
  birth,
  plan,
  natalPlanets: natal.planets,
  natalAscendant: {
    sign: natal.ascendant?.sign ?? null,
    lon: natal.ascendant?.lon ?? null,
  },
});

const natalWithStrengths = {
  ...natalBase,
  strengths: buildPlanetStrength({
    natalPlanets: reportPlanets,
    vargaData: vargas,
  }),
};
const natalMoonRow =
  Array.isArray(natalWithStrengths.planets)
    ? natalWithStrengths.planets.find((p: any) => p?.planet === "Moon") ?? null
    : null;

const natalMoonNakshatra =
  natalMoonRow?.nakshatra ?? null;

const natalMoonSign =
  natalMoonRow?.sign ?? null;

const utilityTransitMoonNakshatra =
  utilityPanchang?.nakshatraAtSunrise ??
  utilityPanchang?.nakshatra ??
  null;

const utilityTransitMoonSign =
  utilityPanchang?.moonSign ?? null;

const tarabalam = getTarabalam(
  natalMoonNakshatra,
  utilityTransitMoonNakshatra
);

const chandrabalam = getChandrabalam(
  natalMoonSign,
  utilityTransitMoonSign
);
  const birthDateTime = DateTime.fromISO(`${birth.dateISO}T${birth.time}`, {
  zone: birth.timezone,
});
const birthPanchang = await buildPanchangData({
    dateISO: birth.dateISO,
    timezone: birth.timezone,
    lat: birth.lat,
    lon: birth.lon,
    transitNow: null,
  });
const horaInfo = getAccurateHoraLord({
  birthDateISO: birth.dateISO,
  birthTime: birth.time,
  timezone: birth.timezone,
  sunrise: birthPanchang?._sunriseDT ?? null,
  sunset: birthPanchang?._sunsetDT ?? null,
  previousSunset: birthPanchang?._previousSunsetDT ?? null,
  nextSunrise: birthPanchang?._nextSunriseDT ?? null,
});
const shadbala = buildShadbala({
  natalPlanets: natalWithStrengths.planets,
  aspects: (natalWithStrengths.aspects ?? []) as any[],
  isDayBirth: true,
  vargaData: vargas,
  birthWeekday: birthDateTime.weekday,
  birthMonth: birthDateTime.month,
  birthHoraLord: horaInfo?.horaLord ?? null,
});
  const vedicAspects = buildVedicAspects({
    natalPlanets: natalWithStrengths.planets,
  });
   const afflictionAspects = (natalWithStrengths.aspects ?? []) as any[];

const afflictions = natalWithStrengths.planets.map((p: any) =>
  getAffliction(
    p,
    afflictionAspects,
    natalWithStrengths.planets,
    natalWithStrengths.ascendant?.sign ?? null
  )
);
const shadbalaInsights = buildShadbalaInsights(shadbala, afflictions);

  const ashtakvarga = buildAshtakvarga({
    natalPlanets: natalWithStrengths.planets,
  });

  const prasthara = buildPrasthara();

  const houseCusps = await buildHouseCusps({
    birth,
    ascLon: natalWithStrengths.ascendant?.lon ?? 0,
    coreHouses: [],
  });

  const bhavMadhya = buildBhavMadhya({
    cusps: houseCusps.cusps ?? [],
  });
   
const kpPlanets = (natalWithStrengths.planets ?? []).map((p: any) => ({
  planet: p?.planet,
  lon: p?.lon ?? p?.longitude ?? null,
}));

const kpPlanetOnCusp = buildKpPlanetOnCusp({
  cusps: (houseCusps?.cusps ?? []).map((lon: number, index: number) => ({
    cusp: index + 1,
    lon,
  })),
  planets: kpPlanets,
  zodiac: "sidereal",
  ayanamsa: natalWithStrengths?.ayanamsa ?? "Lahiri",
});

  const fiveFoldFriendship = buildFiveFoldFriendship({
    natalPlanets: natalWithStrengths.planets,
  });

  const avakhada = buildAvakhada({
    natalPlanets: natalWithStrengths.planets,
  });

  const bhavaChalit = await buildBhavaChalitData({
    ascendant: {
      sign: natalWithStrengths.ascendant?.sign ?? "—",
      signNum: natalWithStrengths.ascendant?.signNum ?? 0,
      degree: natalWithStrengths.ascendant?.degree ?? 0,
      house: 1,
    },
    natalPlanets: natalWithStrengths.planets,
    cusps: houseCusps.cusps,
    system: houseCusps.system,
  });

  const classicChalit = await buildClassicChalit({
    ascendant: {
      sign: natalWithStrengths.ascendant?.sign ?? "—",
      signNum: natalWithStrengths.ascendant?.signNum ?? 0,
    },
    natalPlanets: natalWithStrengths.planets,
  });



  const houseJudgement = buildHouseJudgement({
    houses,
    natal: natalWithStrengths,
    vedicAspects,
  });

  const natalAscendantForEngine = {
    sign: natalWithStrengths.ascendant?.sign ?? null,
    signNum: natalWithStrengths.ascendant?.signNum ?? null,
    degree: natalWithStrengths.ascendant?.degree ?? null,
    house: natalWithStrengths.ascendant?.house ?? 1,
    lon: natalWithStrengths.ascendant?.lon ?? null,
  };
    const upagrahas = await buildUpagrahaData({
    birth,
    natalAscendant: natalAscendantForEngine,
  });
 
  const solarShadowPoints = buildSolarShadowPoints({
  natalPlanets: natalWithStrengths.planets,
  natalAscendant: natalAscendantForEngine,
});
  const arudhas = buildArudhas({
  ascSign: natalBase.ascendant.sign,
  planets: reportPlanets,
});
  const dasha = await buildDashaData({
    birth,
    selectedDateISO,
    plan,
    natal: {
      birthUTCISO: natalWithStrengths.birthUTCISO,
      moonLonSidDeg: natalWithStrengths.moonLonSidDeg,
    },
  });

  const transitNow = await buildTransitSnapshot({
    birth,
    dateISO: selectedDateISO,
    natalAscendant: {
      sign: natalAscendantForEngine.sign ?? "—",
      signNum: natalAscendantForEngine.signNum ?? 0,
      degree: natalAscendantForEngine.degree ?? 0,
      house: 1,
    },
    natalPlanets: natalWithStrengths.planets,
    plan,
  });

  const nakshatraContext = buildNakshatraContext({
    natal: natalWithStrengths,
    vargas,
    dasha,
    transitNow,
  });

  const panchang = await buildPanchangData({
    dateISO: selectedDateISO,
    timezone: birth.timezone,
    lat: birth.lat,
    lon: birth.lon,
    transitNow,
  });

  

  const moonContext = {
    sign: transitNow?.moonToday?.sign ?? null,
    nakshatra: transitNow?.moonToday?.nakshatra ?? null,
    houseFromLagna: transitNow?.moonToday?.houseFromLagna ?? null,
    houseFromMoon: transitNow?.moonToday?.houseFromMoon ?? null,
  };

  const selectedDate = {
    ...transitNow,
    panchang,
    moonContext,
  };

  const transitContacts = buildTransitContacts({
    natalPlanets: natalWithStrengths.planets,
    transitPlanets: (transitNow?.planets ?? []).map((p: any) => ({
      name: p.planet,
      lon: p.lon,
    })),
  });

  const transitInteractions = buildTransitNatalInteractions({
    transitContacts,
    transitStrengths: transitNow?.planets ?? [],
    natalStrengths: natalWithStrengths.strengths ?? [],
  });

  const upcomingTransits = await buildUpcomingTransits({
    birth,
    natalPlanets: natalWithStrengths.planets,
    natalAscendant: {
      sign: natalAscendantForEngine.sign ?? null,
      lon: natalAscendantForEngine.lon ?? null,
    },
  });

  const transitWindows = buildTransitWindows(
    Array.isArray(upcomingTransits?.planetaryTransits)
      ? upcomingTransits.planetaryTransits
      : []
  );
const triggerFacts = buildTriggerFacts({
  transitPlanets: transitNow?.planets ?? [],
  natal: {
    ...natalWithStrengths,
    lagnaSign: natalWithStrengths.ascendant?.signNum ?? null,
  },
  dasha,
  shadbala,
  afflictions,
});

  const triggerScores = scoreAllTriggerAreas(triggerFacts);
  

const topTriggerAreas = getTopAreas(triggerScores);
console.log("TRIGGER_DEBUG", {
  transitPlanets: transitNow?.planets,
  facts: triggerFacts,
  scores: triggerScores,
  topAreas: topTriggerAreas,
});
const degreeHits = computeDegreeHits({
  transitPlanets: transitNow?.planets ?? [],
  natalPlanets: natalWithStrengths.planets ?? [],
});
const microTriggerDays = buildMicroTriggerDays({
  moonTransits: upcomingTransits?.moonTransits ?? [],
  area: "career",
});
  const compare = compareDateISO
    ? await buildCompareData({
        birth,
        dateAISO: selectedDateISO,
        dateBISO: compareDateISO,
        natalAscendant: {
          sign: natalAscendantForEngine.sign ?? "—",
          signNum: natalAscendantForEngine.signNum ?? 0,
          degree: natalAscendantForEngine.degree ?? 0,
          house: 1,
        },
        natalPlanets: natalWithStrengths.planets,
        natal: {
          birthUTCISO: natalWithStrengths.birthUTCISO,
          moonLonSidDeg: natalWithStrengths.moonLonSidDeg,
        },
        plan,
      })
    : null;



  const birthMeta: BirthMeta = {
    name: birth.name,
    dateISO: birth.dateISO,
    time: birth.time,
    timezone: birth.timezone,
    lat: birth.lat,
    lon: birth.lon,
    ayanamsa: natalWithStrengths.ayanamsa || "Lahiri",
    panchang: birthPanchang,
    hora: horaInfo?.horaLord ?? null,
    horaNumber: horaInfo?.horaNumber ?? null,
    horaPhase: horaInfo?.phase ?? null,
    horaStartsAt: horaInfo?.startsAt ?? null,
    horaEndsAt: horaInfo?.endsAt ?? null,
  };

  const dashaContext = buildDashaLordContext({
    dasha,
    natal: natalWithStrengths,
    houses,
    vargas,
  });

  return {
    meta: {
      generatedAtISO: new Date().toISOString(),
      plan,
      selectedDateISO,
      compareDateISO,
    },

    foundations: {
  birthMeta,
  ascendant: natalWithStrengths.ascendant,
  natal: natalWithStrengths,
  houses,
  roles,
  vedicAspects,
  houseJudgement,
  upagrahas,
  solarShadowPoints,
  personalStrength: {
    tarabalam,
    chandrabalam,
    natalMoonNakshatra,
    natalMoonSign,
    transitMoonNakshatra: utilityTransitMoonNakshatra,
    transitMoonSign: utilityTransitMoonSign,
  },
},

    timing: {
      dasha,
      selectedDate,
      panchang,
      moonContext,
      dashaContext,
      nakshatraContext,
        utilities: {
  dateISO: utilityDateISO,
  horaDateISO: utilityHoraDateISO,
  time: utilityTime,
    place: utilityPlace,
    timezone: utilityTimezone,
    panchang: utilityPanchang,
    hora: utilityHoraInfo,
  },
   personalStrength: {
    tarabalam,
    chandrabalam,
    natalMoonNakshatra,
    natalMoonSign,
    transitMoonNakshatra: utilityTransitMoonNakshatra,
    transitMoonSign: utilityTransitMoonSign,
  },
    },

    transits: {
      transitNow,
      transitContacts,
      transitInteractions,
      upcomingEvents: upcomingTransits,
      transitWindows,
      compare,
    },
 triggerEngine: {
  topAreas: topTriggerAreas,
  scores: triggerScores,
  facts: triggerFacts,
  degreeHits,
  microTriggerDays,
},
    strength: {
      shadbala,
      shadbalaInsights,
      afflictions,
      ashtakvarga,
      prasthara,
      bhavMadhya,
      kpPlanetOnCusp,
      fiveFoldFriendship,
      avakhada,
    },

    vargas,
    arudhas,

    birthMeta,
    natal: natalWithStrengths,
    houses,
    roles,
    vedicAspects,
    houseJudgement,
    upagrahas,
    solarShadowPoints,
    dasha,
    transitNow,
    selectedDate,
    compare,
    transitContacts,
    transitInteractions,
    upcomingTransits,
    transitWindows,
    bhavaChalit,
    classicChalit,
    kpPlanetOnCusp,
  };
}