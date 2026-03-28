import type {
  Birth,
  HistoricalSnapshot,
  HouseNumber,
  PlanetId,
} from "@/server/astro/types";
import { buildSubPeriodDashaAtDate } from "@/server/astro/buildSubPeriodDashaAtDate";
type NatalPlanet = {
  name?: string;
  id?: string;
  sign?: string;
  house?: number;
  siderealLongitude?: number;
  deg?: number;
};

type NatalInput = {
  ascSign?: string | null;
  planets?: NatalPlanet[] | null;
};

type DashaTimelineRow = {
  planet?: string;
  md?: string;
  ad?: string;
  pd?: string;
  label?: string;
  fromISO?: string;
  toISO?: string;
  startISO?: string;
  endISO?: string;
};

type Input = {
  birth: Birth;
  natal?: NatalInput | null;
  dashaTimeline?: DashaTimelineRow[] | null;
  transitPlanets?: Array<any> | null;
  topTransits?: Array<any> | null;
  degreeHits?: Array<any> | null;
  targetDateISO: string;
};

export function buildHistoricalSnapshot(input: Input): HistoricalSnapshot {
  const targetDateISO = String(input.targetDateISO).slice(0, 10);

  const natalPlanets = normalizeNatalPlanets(input.natal?.planets ?? []);
  const activeDasha = getActiveDashaAtDate(input.dashaTimeline ?? [], targetDateISO);

  const transitPlanets = normalizeTransitPlanets(input.transitPlanets ?? []);
  const activeNatalHouses = getActiveNatalHousesFromDasha(natalPlanets, activeDasha);
  const activatedNatalPlanets = getActivatedNatalPlanets(transitPlanets, natalPlanets);
  const topTransitHits = buildTopTransitHits(input.topTransits ?? [], targetDateISO);
  const degreeHits = Array.isArray(input.degreeHits) ? input.degreeHits : [];

  const summary = {
    relationshipActive: activeNatalHouses.some((h) => [2, 5, 7, 8].includes(h)),
    careerActive: activeNatalHouses.some((h) => [1, 6, 10, 11].includes(h)),
    moneyActive: activeNatalHouses.some((h) => [2, 5, 9, 11].includes(h)),
    healthActive: activeNatalHouses.some((h) => [6, 8, 12].includes(h)),
  };

  return {
    targetDateISO,
    dasha: activeDasha,
    transitPlanets,
    activeNatalHouses,
    activatedNatalPlanets,
    topTransitHits,
    degreeHits,
    summary,
  };
}

/* ---------------- helpers ---------------- */

function normalizeNatalPlanets(planets: NatalPlanet[]) {
  return planets
    .map((p) => ({
      id: asPlanetId(p?.id ?? p?.name),
      sign: p?.sign,
      house: Number(p?.house),
      deg: Number(p?.deg ?? p?.siderealLongitude ?? 0),
    }))
    .filter((p) => p.id && Number.isFinite(p.house)) as Array<{
      id: PlanetId;
      sign?: string;
      house: number;
      deg: number;
    }>;
}

function normalizeTransitPlanets(planets: any[]) {
  return planets
    .map((p) => ({
      id: asPlanetId(p?.id ?? p?.name ?? p?.planet),
      sign: p?.sign,
      house: Number(p?.house),
      deg: Number(p?.deg ?? p?.siderealLongitude ?? 0),
    }))
    .filter((p) => p.id && Number.isFinite(p.house)) as Array<{
      id: PlanetId;
      sign?: string;
      house: number;
      deg: number;
    }>;
}

function getActiveDashaAtDate(
  rows: DashaTimelineRow[],
  targetDateISO: string
): HistoricalSnapshot["dasha"] {
  for (const row of rows) {
    const fromISO = String(row?.fromISO ?? row?.startISO ?? "").slice(0, 10);
    const toISO = String(row?.toISO ?? row?.endISO ?? "").slice(0, 10);
    const md = asPlanetId(row?.md ?? row?.planet);

    if (fromISO && toISO && fromISO <= targetDateISO && targetDateISO <= toISO) {
      // if AD/PD already exist, use them directly
      const adDirect = asPlanetId(row?.ad);
      const pdDirect = asPlanetId(row?.pd);

      if (adDirect || pdDirect) {
        return {
          md,
          ad: adDirect,
          pd: pdDirect,
        };
      }

      // otherwise derive AD/PD from MD window
      return buildSubPeriodDashaAtDate({
        md,
        mdStartISO: fromISO,
        mdEndISO: toISO,
        targetDateISO,
      });
    }
  }

  return {
    md: null,
    ad: null,
    pd: null,
  };
}

function getActiveNatalHousesFromDasha(
  natalPlanets: Array<{ id: PlanetId; house: number }>,
  dasha: HistoricalSnapshot["dasha"]
): HouseNumber[] {
  const out: HouseNumber[] = [];

  for (const pid of [dasha.md, dasha.ad, dasha.pd].filter(Boolean) as PlanetId[]) {
    const house = natalPlanets.find((p) => p.id === pid)?.house;
    if (house && house >= 1 && house <= 12) {
      out.push(house as HouseNumber);
    }
  }

  return uniqHouseNumbers(out);
}

function getActivatedNatalPlanets(
  transitPlanets: Array<{ id: PlanetId; house: number }>,
  natalPlanets: Array<{ id: PlanetId; house: number }>
): PlanetId[] {
  const out: PlanetId[] = [];

  for (const tp of transitPlanets) {
    for (const np of natalPlanets) {
      if (tp.house === np.house) {
        out.push(np.id);
      }
    }
  }

  return uniqPlanetIds(out);
}

function buildTopTransitHits(topTransits: any[], targetDateISO: string): string[] {
  const out: string[] = [];

  for (const t of topTransits) {
    const fromISO = String(t?.fromISO ?? t?.startISO ?? "").slice(0, 10);
    const toISO = String(t?.toISO ?? t?.endISO ?? "").slice(0, 10);

    if (fromISO && toISO && fromISO <= targetDateISO && targetDateISO <= toISO) {
      const label = String(t?.label ?? t?.title ?? t?.driver ?? "").trim();
      if (label) out.push(label);
    }
  }

  return uniqStrings(out).slice(0, 6);
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

function uniqPlanetIds(arr: PlanetId[]) {
  return Array.from(new Set(arr));
}

function uniqHouseNumbers(arr: HouseNumber[]) {
  return Array.from(new Set(arr));
}

function uniqStrings(arr: string[]) {
  return Array.from(new Set(arr.map((x) => String(x).trim()).filter(Boolean)));
}