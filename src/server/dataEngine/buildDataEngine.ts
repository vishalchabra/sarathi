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

export type DataEngineOutput = {
  meta: {
    generatedAtISO: string;
    plan: DataEnginePlan;
    selectedDateISO: string;
    compareDateISO: string | null;
  };
  birthMeta: {
    name?: string;
    dateISO: string;
    time: string;
    timezone: string;
    lat: number;
    lon: number;
    ayanamsa: string;
  };
  natal: any;
  houses: any;
  roles: any;
  vargas: any;
  dasha: any;
  transitNow: any;
  transitContacts: any[];
  upcomingTransits: any[];
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

function normalizeReportPlanets(planets: any[], planetsByName?: Record<string, any>): any[] {
  return (Array.isArray(planets) ? planets : []).map((p) => {
    const planet = String(p?.planet ?? p?.name ?? "Unknown");
    const byName = planetsByName?.[planet] ?? null;

    const lon =
      typeof p?.lon === "number"
        ? p.lon
        : typeof p?.siderealLongitude === "number"
        ? p.siderealLongitude
        : typeof byName?.lon === "number"
        ? byName.lon
        : typeof byName?.siderealLongitude === "number"
        ? byName.siderealLongitude
        : null;

    const sign =
      String(
        p?.sign ??
          byName?.sign ??
          "—"
      );

    const signNum = SIGN_TO_NUM[sign] ?? 0;

    return {
      planet,
      sign,
      signNum,
      degree:
        typeof p?.degree === "number"
          ? p.degree
          : typeof p?.deg === "number"
          ? p.deg
          : typeof lon === "number"
          ? lon % 30
          : null,
      house:
        typeof p?.house === "number"
          ? p.house
          : typeof byName?.house === "number"
          ? byName.house
          : null,
      nakshatra: p?.nakshatra ?? byName?.nakshatra ?? null,
      pada: p?.pada ?? byName?.pada ?? null,
      retrograde:
        typeof p?.retrograde === "boolean"
          ? p.retrograde
          : ["Rahu", "Ketu"].includes(planet),
      combust:
        typeof p?.combust === "boolean"
          ? p.combust
          : false,
      lon,
      lordships: Array.isArray(p?.lordships) ? p.lordships : [],
    };
  });
}
function getServerBaseUrl() {
  const explicit = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`.replace(/\/$/, "");

  return "http://localhost:3000";
}

async function fetchTrustedLifeReport(birth: BirthInput) {
  const base = getServerBaseUrl();

  const res = await fetch(`${base}/api/life-report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: birth.name,
      birthDateISO: birth.dateISO,
      birthTime: birth.time,
      birthTz: birth.timezone,
      birthLat: birth.lat,
      birthLon: birth.lon,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`life-report fetch failed: ${res.status} ${text.slice(0, 200)}`);
  }

  return res.json();
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
  const reportData = await fetchTrustedLifeReport(birth);
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
const reportPlanets = normalizeReportPlanets(
  reportData?.planets ?? [],
  reportData?.planetsByName ?? {}
).map((p: any) => {
  if (p.planet === "Rahu") {
    return {
      ...p,
      lon: trueNodeLons.rahuLonSid,
      degree: trueNodeLons.rahuLonSid % 30,
    };
  }

  if (p.planet === "Ketu") {
    return {
      ...p,
      lon: trueNodeLons.ketuLonSid,
      degree: trueNodeLons.ketuLonSid % 30,
    };
  }

  return p;
});
  const ascSign = String(
  reportData?.core?.ascSign ??
    reportData?._debugAsc?.ascSign ??
    reportData?.ascSign ??
    reportData?.ascendant?.ascSign ??
    "—"
);

const ascSignNum = SIGN_TO_NUM[ascSign] ?? 0;

const ascDegRaw =
  typeof reportData?.core?.ascDeg === "number"
    ? reportData.core.ascDeg
    : typeof reportData?._debugAsc?.ascDeg === "number"
    ? reportData._debugAsc.ascDeg
    : null;

const ascLon =
  typeof reportData?.core?.ascLon === "number"
    ? reportData.core.ascLon
    : typeof reportData?._debugAsc?.ascLon === "number"
    ? reportData._debugAsc.ascLon
    : typeof ascDegRaw === "number"
    ? ascDegRaw > 30
      ? ascDegRaw // already absolute longitude
      : ascSignNum > 0
      ? (ascSignNum - 1) * 30 + ascDegRaw // degree within sign
      : null
    : null;
  const natal = {
    ayanamsa: "Lahiri",
    birthUTCISO: toBirthUTCISO(birth),
    moonLonSidDeg:
      reportData?.planetsByName?.Moon?.lon ??
      reportPlanets.find((p: any) => p.planet === "Moon")?.lon ??
      null,

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
    sourceNote: "Mapped from trusted life-engine buildLifeReport",
  };
console.log("ASC DEBUG", {
  ascSign,
  ascDegRaw,
  ascLon,
});

console.log(
  "NODE DEBUG",
  reportPlanets.filter((p: any) => p.planet === "Rahu" || p.planet === "Ketu")
);
  const natalData = natal as any;

  const houses = await buildHouseData({
    ascendant: natalData?.ascendant,
    natalPlanets: natalData?.planets,
  });

  const roles = await buildFunctionalRoles({
    ascendant: natalData?.ascendant,
    houses,
    natalPlanets: natalData?.planets,
  });

const vargas = await buildVargaData({
  birth,
  plan,
  natalPlanets: natalData?.planets,
  natalAscendant: natalData?.ascendant,
});

  const dasha = await buildDashaData({
    birth,
    selectedDateISO,
    plan,
    natal: {
      birthUTCISO: natalData?.birthUTCISO,
      moonLonSidDeg: natalData?.moonLonSidDeg,
    },
  });

  const transitNow = await buildTransitSnapshot({
    birth,
    dateISO: selectedDateISO,
    natalAscendant: natalData?.ascendant,
    natalPlanets: natalData?.planets,
    plan,
  });

  const selectedDate = transitNow;
 const transitContacts = buildTransitContacts({
  natalPlanets: natalData.planets,
  transitPlanets: transitNow.planets.map((p: any) => ({
    name: p.planet,
    lon: p.lon,
  })),
});

const upcomingTransits = await buildUpcomingTransits({
  birth,
  natalPlanets: natalData.planets,
  natalAscendant: natalData.ascendant,
});
const transitWindows = buildTransitWindows(upcomingTransits);
  const compare = compareDateISO
    ? await buildCompareData({
        birth,
        dateAISO: selectedDateISO,
        dateBISO: compareDateISO,
        natalAscendant: natalData?.ascendant,
        natalPlanets: natalData?.planets,
        natal: {
          birthUTCISO: natalData?.birthUTCISO,
          moonLonSidDeg: natalData?.moonLonSidDeg,
        },
        plan,
      })
    : null;

  return {
    meta: {
      generatedAtISO: new Date().toISOString(),
      plan,
      selectedDateISO,
      compareDateISO,
    },
    birthMeta: {
      name: birth.name,
      dateISO: birth.dateISO,
      time: birth.time,
      timezone: birth.timezone,
      lat: birth.lat,
      lon: birth.lon,
      ayanamsa: natalData?.ayanamsa || "Lahiri",
    },
    natal,
    houses,
    roles,
    vargas,
    dasha,
    transitNow,
    selectedDate,
    compare,
    transitContacts,
    upcomingTransits,
    transitWindows,
  };
}