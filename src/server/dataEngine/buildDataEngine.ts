import "server-only";

import { DateTime } from "luxon";
import { buildHouseData } from "@/server/dataEngine/buildHouseData";
import { buildFunctionalRoles } from "@/server/dataEngine/buildFunctionalRoles";
import { buildVargaData } from "@/server/dataEngine/buildVargaData";
import { buildDashaData } from "@/server/dataEngine/buildDashaData";
import { buildTransitSnapshot } from "@/server/dataEngine/buildTransitSnapshot";
import { buildCompareData } from "@/server/dataEngine/buildCompareData";
import { buildLifeReport } from "@/server/astro/life-engine";

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

function normalizeReportPlanets(planets: any[]): any[] {
  return (Array.isArray(planets) ? planets : []).map((p) => {
    const sign = String(p?.sign ?? "—");
    const signNum = SIGN_TO_NUM[sign] ?? 0;

    return {
      planet: String(p?.planet ?? p?.name ?? "Unknown"),
      sign,
      signNum,
      degree:
        typeof p?.degree === "number"
          ? p.degree
          : typeof p?.deg === "number"
          ? p.deg
          : null,
      house: typeof p?.house === "number" ? p.house : null,
      nakshatra: p?.nakshatra ?? null,
      pada: p?.pada ?? null,
      retrograde:
        typeof p?.retrograde === "boolean"
          ? p.retrograde
          : ["Rahu", "Ketu"].includes(String(p?.planet ?? p?.name ?? "")),
      combust: typeof p?.combust === "boolean" ? p.combust : false,
      lon:
        typeof p?.lon === "number"
          ? p.lon
          : typeof p?.siderealLongitude === "number"
          ? p.siderealLongitude
          : null,
      lordships: Array.isArray(p?.lordships) ? p.lordships : [],
    };
  });
}

export async function buildDataEngine(
  params: BuildDataEngineParams
): Promise<DataEngineOutput> {
  const plan = normalizePlan(params.plan);
  const selectedDateISO = resolveSelectedDateISO(params.selectedDateISO);
  const compareDateISO = String(params.compareDateISO || "").trim() || null;

  const birth = params.birth;

  const report = await (buildLifeReport as any)({
    name: birth.name,
    birthDateISO: birth.dateISO,
    birthTime: birth.time,
    birthTz: birth.timezone,
    lat: birth.lat,
    lon: birth.lon,
  });

  const reportData = report as any;
  const reportPlanets = normalizeReportPlanets(reportData?.planets ?? []);
  const ascSign = String(
    reportData?.core?.ascSign ??
      reportData?.ascSign ??
      reportData?.ascendant?.ascSign ??
      "—"
  );
  const ascSignNum = SIGN_TO_NUM[ascSign] ?? 0;

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
      degree: null,
      house: 1,
      lon: null,
    },

    planets: reportPlanets,
    sourceNote: "Mapped from trusted life-engine buildLifeReport",
  };

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
  };
}