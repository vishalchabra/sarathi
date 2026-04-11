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

export type DataEngineOutput = {
  meta: {
    generatedAtISO: string;
    plan: DataEnginePlan;
    selectedDateISO: string;
    compareDateISO: string | null;
  };

  foundations: {
  birthMeta: {
    name?: string;
    dateISO: string;
    time: string;
    timezone: string;
    lat: number;
    lon: number;
    ayanamsa: string;
    panchang?: any;
  };
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
  prasthara: Record<
  string,
  Record<string, number[]>
>;
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
birthMeta: {
  name?: string;
  dateISO: string;
  time: string;
  timezone: string;
  lat: number;
  lon: number;
  ayanamsa: string;
  panchang?: any;
};
natal: any;
houses: any;
roles: any;
vedicAspects: any;
houseJudgement: any;
bhavaChalit: any;
classicChalit: any;
dasha: any;
transitNow: any;
debugLifeReport: any;
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

  await getAscendant({
    dateISO: birth.dateISO,
    time: birth.time,
    tz: birth.timezone,
    lat: birth.lat,
    lon: birth.lon,
  });

  const reportData = await fetchTrustedLifeReport(birth);
  console.log("🔥 BUILD DATA ENGINE CALLED");
 console.log("LIFE REPORT TOP LEVEL KEYS", Object.keys(reportData || {}));
console.log("LIFE REPORT CORE KEYS", Object.keys(reportData?.core || {}));
console.log("LIFE REPORT DEBUG ASC KEYS", Object.keys(reportData?._debugAsc || {}));
console.log("LIFE REPORT PLANETS SAMPLE", reportData?.planets?.[0]);
console.log("LIFE REPORT PLANETSBYNAME MOON", reportData?.planetsByName?.Moon);
console.log(
  "LIFE REPORT SNAPSHOT",
  JSON.stringify(reportData, null, 2).slice(0, 12000)
);
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
        lon:
          typeof rawNodeLonMap.get("Rahu") === "number"
            ? rawNodeLonMap.get("Rahu")
            : trueNodeLons.rahuLonSid,
        degree:
          typeof rawNodeLonMap.get("Rahu") === "number"
            ? Number((rawNodeLonMap.get("Rahu") % 30).toFixed(2))
            : Number((trueNodeLons.rahuLonSid % 30).toFixed(2)),
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
        ? ascDegRaw
        : ascSignNum > 0
        ? (ascSignNum - 1) * 30 + ascDegRaw
        : null
      : null;

  const natalAspects = buildNatalAspects({
    natalPlanets: reportPlanets,
  });

  const natalBase = {
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
    aspects: natalAspects,
    sourceNote: "Mapped from trusted life-engine buildLifeReport",
  };

  const natalData = natalBase as any;

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
    natalAscendant: {
  sign: natalData?.ascendant?.sign ?? null,
  lon: natalData?.ascendant?.lon ?? null,
},
  });

  const planetStrength = buildPlanetStrength({
    natalPlanets: reportPlanets,
    vargaData: vargas,
  });

  const natal = {
  ...natalBase,
  strengths: planetStrength,
};
const shadbala = buildShadbala({
  natalPlanets: natal.planets,
  aspects: (natal.aspects ?? []) as any[],
  isDayBirth: true,
});
const ashtakvarga = buildAshtakvarga({
  natalPlanets: natal.planets,
});
const prasthara = buildPrasthara();
const houseCusps = await buildHouseCusps({
  birth,
  ascLon: natal.ascendant?.lon ?? 0,
  coreHouses: reportData?.core?.houses ?? [],
});
const bhavMadhya = buildBhavMadhya({
  cusps: houseCusps.cusps ?? [],
});
const fiveFoldFriendship = buildFiveFoldFriendship({
  natalPlanets: natal.planets,
});
const avakhada = buildAvakhada({
  natalPlanets: natal.planets,
});
const bhavaChalit = await buildBhavaChalitData({
  ascendant: {
    sign: natal.ascendant?.sign ?? "—",
    signNum: natal.ascendant?.signNum ?? 0,
    degree: natal.ascendant?.degree ?? 0,
    house: 1,
  },
  natalPlanets: natal.planets,
  cusps: houseCusps.cusps,
  system: houseCusps.system,
});
const classicChalit = await buildClassicChalit({
  ascendant: {
    sign: natal.ascendant?.sign ?? "—",
    signNum: natal.ascendant?.signNum ?? 0,
  },
  natalPlanets: natal.planets,
});
const vedicAspects = buildVedicAspects({
  natalPlanets: natal.planets,
});

const houseJudgement = buildHouseJudgement({
  houses,
  natal,
  vedicAspects,
});
const natalAscendantForEngine = {
  sign: natal.ascendant?.sign ?? null,
  signNum: natal.ascendant?.signNum ?? null,
  degree: natal.ascendant?.degree ?? null,
  house: natal.ascendant?.house ?? 1,
  lon: natal.ascendant?.lon ?? null,
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

  const dasha = await buildDashaData({
    birth,
    selectedDateISO,
    plan,
    natal: {
      birthUTCISO: natal.birthUTCISO,
      moonLonSidDeg: natal.moonLonSidDeg,
    },
  });
  console.log("BHAVA CHALIT SYSTEM", bhavaChalit?.system);
console.log("BHAVA CHALIT CUSPS", bhavaChalit?.cusps);
console.log(
  "BHAVA CHALIT PLANETS",
  (bhavaChalit?.planets ?? []).map((p: any) => ({
    planet: p.planet,
    rashiHouse: p.rashiHouse,
    chalitHouse: p.house,
    lon: p.lon,
  }))
);
const dashaContext = buildDashaLordContext({
  dasha,
  natal,
  houses,
  vargas,
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
    natalPlanets: natal.planets,
    plan,
  });
const nakshatraContext = buildNakshatraContext({
  natal,
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
  const birthPanchangSource = reportData?.panchang as any;

const birthPanchang = birthPanchangSource
  ? {
      dateISO: birth.dateISO,
      weekday:
        birthPanchangSource?.weekday ??
        birthPanchangSource?.weekdayName ??
        null,
      tithi:
        birthPanchangSource?.tithi ??
        birthPanchangSource?.tithiName ??
        null,
      nakshatra: (() => {
  const moonRow = reportPlanets.find((p: any) => p.planet === "Moon");

  const nak =
    moonRow?.nakshatra ??
    birthPanchangSource?.nakshatra ??
    birthPanchangSource?.moonNakshatraName ??
    null;

  const pada = moonRow?.pada ?? null;

  if (nak && pada) return `${nak} - ${pada}`;
  return nak;
})(),
      yoga:
        birthPanchangSource?.yoga ??
        birthPanchangSource?.yogaName ??
        null,
      karana:
        birthPanchangSource?.karana ??
        birthPanchangSource?.karanaName ??
        null,
      sunrise:
        birthPanchangSource?.sunrise ??
        birthPanchangSource?.sunriseISO ??
        null,
      sunset:
        birthPanchangSource?.sunset ??
        birthPanchangSource?.sunsetISO ??
        null,
    }
  : null;
  
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
    natalPlanets: natal.planets,
    transitPlanets: (transitNow?.planets ?? []).map((p: any) => ({
      name: p.planet,
      lon: p.lon,
    })),
  });
  const transitInteractions = buildTransitNatalInteractions({
  transitContacts,
  transitStrengths: transitNow?.planets ?? [],
  natalStrengths: natal.strengths ?? [],
});
  const upcomingTransits = await buildUpcomingTransits({
    birth,
    natalPlanets: natal.planets,
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
        natalPlanets: natal.planets,
        natal: {
          birthUTCISO: natal.birthUTCISO,
          moonLonSidDeg: natal.moonLonSidDeg,
        },
        plan,
      })
    : null;

const birthMeta = {
  name: birth.name,
  dateISO: birth.dateISO,
  time: birth.time,
  timezone: birth.timezone,
  lat: birth.lat,
  lon: birth.lon,
  ayanamsa: natal.ayanamsa || "Lahiri",
  panchang: birthPanchang,
};
const debugLifeReport = {
  topLevelKeys: Object.keys(reportData || {}),
  coreKeys: Object.keys(reportData?.core || {}),
  debugAscKeys: Object.keys(reportData?._debugAsc || {}),
  planetSample: reportData?.planets?.[0] ?? null,
  moonByName: reportData?.planetsByName?.Moon ?? null,
  snapshot: JSON.stringify(reportData, null, 2).slice(0, 12000),
};
  return {
    meta: {
      generatedAtISO: new Date().toISOString(),
      plan,
      selectedDateISO,
      compareDateISO,
    },

    foundations: {
  birthMeta,
  ascendant: natal.ascendant,
  natal,
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
    natal,
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
    debugLifeReport,
  };
}