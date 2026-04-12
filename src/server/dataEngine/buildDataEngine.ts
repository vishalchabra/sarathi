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
import { buildPanchangData } from "./buildPanchangData";
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
  };

  timing: {
    dasha: any;
    selectedDate: any;
    panchang: any;
    moonContext: any;
    dashaContext: any;
    nakshatraContext: any;
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

  // backward compatibility
  birthMeta: BirthMeta;
  natal: any;
  houses: any;
  roles: any;
  vedicAspects: any;
  houseJudgement: any;
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
}) {
  const { birthDateISO, birthTime, timezone, sunrise, sunset } = params;

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

  if (!sunriseDT || !sunsetDT) {
    return {
      horaLord: null,
      horaNumber: null,
      phase: null,
      startsAt: null,
      endsAt: null,
    };
  }

  // IMPORTANT:
  // If birth is before sunrise, Hora still belongs to the previous sunrise-based day
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

  // Day hora: sunrise -> sunset
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

  // Night hora: sunset -> next day's sunrise
  const nextSunriseDT = sunriseDT.plus({ days: 1 });
  const nightStartIndex = (startIndex + 12) % 7;

  const nightMinutes = nextSunriseDT.diff(sunsetDT, "minutes").minutes;
  const horaLength = nightMinutes / 12;

  let effectiveBirthDT = birthDT;
  if (birthDT < sunriseDT) {
    effectiveBirthDT = birthDT.plus({ days: 1 });
  }

  const safeElapsed = effectiveBirthDT.diff(sunsetDT, "minutes").minutes;
  const horaNumber = Math.min(
    12,
    Math.max(1, Math.floor(safeElapsed / horaLength) + 1)
  );
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

export async function buildDataEngine(
  params: BuildDataEngineParams
): Promise<DataEngineOutput> {
  const plan = normalizePlan(params.plan);
  const selectedDateISO = resolveSelectedDateISO(params.selectedDateISO);
  const compareDateISO = String(params.compareDateISO || "").trim() || null;
  const birth = params.birth;

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

  const reportPlanets = (Array.isArray(rawPlacements) ? rawPlacements : []).map((p: any) => {
    if (p.planet === "Rahu") {
      return {
        ...p,
        lon:
          typeof rawNodeLonMap.get("Rahu") === "number"
            ? rawNodeLonMap.get("Rahu")
            : trueNodeLons.rahuLonSid,
        degree:
          typeof rawNodeLonMap.get("Rahu") === "number"
            ? Number((rawNodeLonMap.get("Rahu") % 30).toFixed(2))
            : Number((trueNodeLons.rahuLonSid % 30).toFixed(2)),
        signNum: SIGN_TO_NUM[p.sign] ?? 0,
        nakshatra: null,
        pada: null,
        retrograde: true,
        combust: false,
        lordships: [],
      };
    }

    if (p.planet === "Ketu") {
      return {
        ...p,
        lon:
          typeof rawNodeLonMap.get("Ketu") === "number"
            ? rawNodeLonMap.get("Ketu")
            : trueNodeLons.ketuLonSid,
        degree:
          typeof rawNodeLonMap.get("Ketu") === "number"
            ? Number((rawNodeLonMap.get("Ketu") % 30).toFixed(2))
            : Number((trueNodeLons.ketuLonSid % 30).toFixed(2)),
        signNum: SIGN_TO_NUM[p.sign] ?? 0,
        nakshatra: null,
        pada: null,
        retrograde: true,
        combust: false,
        lordships: [],
      };
    }

    return {
      ...p,
      signNum: SIGN_TO_NUM[p.sign] ?? 0,
      nakshatra: null,
      pada: null,
      retrograde: false,
      combust: false,
      lordships: [],
    };
  });

  const ascSign = String(asc?.sign ?? "—");
  const ascLon =
    typeof asc?.lon === "number" && !Number.isNaN(asc.lon) ? asc.lon : null;
  const ascSignNum = SIGN_TO_NUM[ascSign] ?? 0;

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

  const shadbala = buildShadbala({
    natalPlanets: natalWithStrengths.planets,
    aspects: (natalWithStrengths.aspects ?? []) as any[],
    isDayBirth: true,
  });

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

  const vedicAspects = buildVedicAspects({
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

  const birthPanchang = await buildPanchangData({
    dateISO: birth.dateISO,
    timezone: birth.timezone,
    lat: birth.lat,
    lon: birth.lon,
    transitNow: null,
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

  const horaInfo = getAccurateHoraLord({
    birthDateISO: birth.dateISO,
    birthTime: birth.time,
    timezone: birth.timezone,
    sunrise: birthPanchang?._sunriseDT ?? null,
    sunset: birthPanchang?._sunsetDT ?? null,
  });

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
    },

    timing: {
      dasha,
      selectedDate,
      panchang,
      moonContext,
      dashaContext,
      nakshatraContext,
    },

    transits: {
      transitNow,
      transitContacts,
      transitInteractions,
      upcomingEvents: upcomingTransits,
      transitWindows,
      compare,
    },

    strength: {
      shadbala,
      ashtakvarga,
      prasthara,
      bhavMadhya,
      fiveFoldFriendship,
      avakhada,
    },

    vargas,

    birthMeta,
    natal: natalWithStrengths,
    houses,
    roles,
    vedicAspects,
    houseJudgement,
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
  };
}