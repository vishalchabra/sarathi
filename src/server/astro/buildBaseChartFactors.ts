import type {
  BaseChartFactors,
  HouseNumber,
  PlanetId,
  PlanetStrengthLabel,
} from "@/server/astro/types";

type SimplePlanet = {
  id?: PlanetId | string;
  name?: PlanetId | string;
  sign?: string;
  house?: number;
  deg?: number;
  siderealLongitude?: number;
  retro?: boolean;
  combust?: boolean;
  vargottama?: boolean;
  nakName?: string;
  nakshatra?: string;
};

type SimpleHouse = {
  house?: number;
  index?: number;
  num?: number;
  h?: number;
  sign?: string;
  lord?: PlanetId | string;
  strength?: "strong" | "average" | "weak";
};

type SimpleChart = {
  ascSign?: string | null;
  moonSign?: string | null;
  moonNakshatra?: string | null;
  planets?: SimplePlanet[];
  houses?: Record<string, any> | SimpleHouse[];
};

type ActivePeriodsLike = {
  mahadasha?: { lord?: string | null };
  antardasha?: { subLord?: string | null; lord?: string | null };
  pratyantardasha?: { lord?: string | null };
};

type Input = {
  natal?: SimpleChart | null;
  d9?: SimpleChart | null;
  d10?: SimpleChart | null;
  activePeriods?: ActivePeriodsLike | null;
  topTransits?: any[] | null;
};

export function buildBaseChartFactors(input: Input): BaseChartFactors {
  const natal = normalizeChart(input.natal);
  const d9 = normalizeChart(input.d9);
  const d10 = normalizeChart(input.d10);

  const ascLord = getAscLord(natal.ascSign);
  const houseLords = buildHouseLords(natal);

  const planets = natal.planets.map((p) => ({
    id: p.id,
    sign: p.sign,
    house: p.house,
    deg: p.deg,
    dignity: getDignity(p.id, p.sign),
    retro: !!p.retro,
    combust: !!p.combust,
    vargottama: !!p.vargottama,
  }));

  const dominantPlanets = getDominantPlanets(natal);
  const weakPlanets = planets
    .filter((p) => p.dignity === "debilitated" || p.combust)
    .map((p) => p.id);

  const vargottamaPlanets = planets.filter((p) => p.vargottama).map((p) => p.id);
  const combustPlanets = planets.filter((p) => p.combust).map((p) => p.id);
  const retroPlanets = planets.filter((p) => p.retro).map((p) => p.id);

  return {
    identity: {
      ascSign: natal.ascSign,
      ascLord,
      moonSign: natal.moonSign,
      moonNakshatra: natal.moonNakshatra,
    },
    houseLords,
    planets,
    strengths: {
      dominantPlanets,
      weakPlanets,
      vargottamaPlanets,
      combustPlanets,
      retroPlanets,
    },
    houseThemes: {
      strongHouses: [],
      weakHouses: [],
      activatedHouses: [],
    },
    specialFactors: {
      badhakHouse: null,
      badhakLord: null,
      marakaLords: [],
      yogas: [],
    },
    divisionalSupport: {
      d9: {
        ascSign: d9.ascSign,
        reinforcedPlanets: [],
      },
      d10: {
        ascSign: d10.ascSign,
        reinforcedPlanets: [],
        careerPlanets: [],
      },
    },
    activeTiming: {
      md: asPlanetId(input.activePeriods?.mahadasha?.lord),
      ad: asPlanetId(
        input.activePeriods?.antardasha?.subLord ||
          input.activePeriods?.antardasha?.lord
      ),
      pd: asPlanetId(input.activePeriods?.pratyantardasha?.lord),
      activeNatalHouses: [],
      modifiers: [],
    },
    transitContext: {
      topHits: [],
      activatedNatalPlanets: [],
      activatedNatalHouses: [],
    },
  };
}

function normalizeChart(chart: SimpleChart | null | undefined) {
  const rawHouses = chart?.houses;
  const houses: Record<number, { sign?: string; lord?: PlanetId; strength?: "strong" | "average" | "weak" }> = {};

  if (Array.isArray(rawHouses)) {
    for (const h of rawHouses) {
      const num = Number(h?.house ?? h?.index ?? h?.num ?? h?.h);
      if (!Number.isFinite(num) || num < 1 || num > 12) continue;
      houses[num] = {
        sign: h?.sign,
        lord: asPlanetId(h?.lord) ?? undefined,
        strength: h?.strength ?? "average",
      };
    }
  } else if (rawHouses && typeof rawHouses === "object") {
    for (const k of Object.keys(rawHouses)) {
      const num = Number(k);
      const v = (rawHouses as Record<string, any>)[k];
      if (!Number.isFinite(num) || num < 1 || num > 12) continue;
      houses[num] = {
        sign: v?.sign,
        lord: asPlanetId(v?.lord) ?? undefined,
        strength: v?.strength ?? "average",
      };
    }
  }

  const planets = Array.isArray(chart?.planets)
  ? chart!.planets
      .map((p) => ({
        id: asPlanetId(p?.id ?? p?.name),
        sign: p?.sign,
        house: Number(p?.house),
        deg: Number(p?.deg ?? p?.siderealLongitude ?? 0),
        retro: !!p?.retro,
        combust: !!p?.combust,
        vargottama: !!p?.vargottama,
        nakName: p?.nakName ?? p?.nakshatra,
      }))
      .filter((p) => p.id && Number.isFinite(p.house))
  : [];

  return {
    ascSign: chart?.ascSign ?? null,
    moonSign: chart?.moonSign ?? null,
    moonNakshatra: chart?.moonNakshatra ?? null,
    houses,
    planets: planets as Array<{
      id: PlanetId;
      sign?: string;
      house: number;
      deg: number;
      retro: boolean;
      combust: boolean;
      vargottama: boolean;
      nakName?: string;
    }>,
  };
}

function getAscLord(sign?: string | null): PlanetId | null {
  const map: Record<string, PlanetId> = {
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
  return sign && map[sign] ? map[sign] : null;
}

function buildHouseLords(
  natal: ReturnType<typeof normalizeChart>
): Partial<Record<HouseNumber, PlanetId>> {
  const out: Partial<Record<HouseNumber, PlanetId>> = {};
  for (let i = 1; i <= 12; i++) {
    const lord = natal.houses[i]?.lord;
    if (lord) out[i as HouseNumber] = lord;
  }
  return out;
}

function getDignity(pid: PlanetId, sign?: string): PlanetStrengthLabel {
  if (!sign) return "neutral";

  const exalted: Partial<Record<PlanetId, string>> = {
    Sun: "Aries",
    Moon: "Taurus",
    Mars: "Capricorn",
    Mercury: "Virgo",
    Jupiter: "Cancer",
    Venus: "Pisces",
    Saturn: "Libra",
  };

  const debilitated: Partial<Record<PlanetId, string>> = {
    Sun: "Libra",
    Moon: "Scorpio",
    Mars: "Cancer",
    Mercury: "Pisces",
    Jupiter: "Capricorn",
    Venus: "Virgo",
    Saturn: "Aries",
  };

  const ownSigns: Partial<Record<PlanetId, string[]>> = {
    Sun: ["Leo"],
    Moon: ["Cancer"],
    Mars: ["Aries", "Scorpio"],
    Mercury: ["Gemini", "Virgo"],
    Jupiter: ["Sagittarius", "Pisces"],
    Venus: ["Taurus", "Libra"],
    Saturn: ["Capricorn", "Aquarius"],
  };

  if (exalted[pid] === sign) return "exalted";
  if (debilitated[pid] === sign) return "debilitated";
  if ((ownSigns[pid] ?? []).includes(sign)) return "own";

  return "neutral";
}

function getDominantPlanets(natal: ReturnType<typeof normalizeChart>): PlanetId[] {
  const score: Partial<Record<PlanetId, number>> = {};

  for (const p of natal.planets) {
    score[p.id] = (score[p.id] ?? 0) + 1;
    if ([1, 5, 9, 10].includes(p.house)) score[p.id] = (score[p.id] ?? 0) + 2;
    if ([6, 11].includes(p.house)) score[p.id] = (score[p.id] ?? 0) + 1;
    if (p.vargottama) score[p.id] = (score[p.id] ?? 0) + 2;
    if (getDignity(p.id, p.sign) === "own") score[p.id] = (score[p.id] ?? 0) + 2;
    if (getDignity(p.id, p.sign) === "exalted") score[p.id] = (score[p.id] ?? 0) + 3;
  }

  return (Object.entries(score) as Array<[PlanetId, number]>)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([pid]) => pid);
}

function asPlanetId(x: any): PlanetId | null {
  const s = String(x ?? "").trim();
  if (
    s === "Sun" ||
    s === "Moon" ||
    s === "Mars" ||
    s === "Mercury" ||
    s === "Jupiter" ||
    s === "Venus" ||
    s === "Saturn" ||
    s === "Rahu" ||
    s === "Ketu"
  ) {
    return s;
  }
  return null;
}