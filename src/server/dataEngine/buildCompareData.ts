import "server-only";

import { buildTransitSnapshot } from "./buildTransitSnapshot";
import { buildDashaData } from "./buildDashaData";
import type { BirthInput, DataEnginePlan } from "./types";

type BuildCompareDataParams = {
  birth: BirthInput;
  dateAISO: string;
  dateBISO: string;
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
  natal?: {
    birthUTCISO?: string;
    moonLonSidDeg?: number | null;
  } | null;
  plan: DataEnginePlan;
};
function normalizePlanetName(v: any): string {
  return String(v ?? "").trim().toLowerCase();
}
export async function buildCompareData(params: BuildCompareDataParams) {
  const {
    birth,
    dateAISO,
    dateBISO,
    natalAscendant,
    natalPlanets,
    natal,
    plan,
  } = params;

  const snapA = await buildTransitSnapshot({
    birth,
    dateISO: dateAISO,
    natalAscendant,
    natalPlanets,
    plan,
  });

  const snapB = await buildTransitSnapshot({
    birth,
    dateISO: dateBISO,
    natalAscendant,
    natalPlanets,
    plan,
  });
// Debug logs removed for production.
  const dashaA = await buildDashaData({
    birth,
    selectedDateISO: dateAISO,
    plan,
    natal,
  });

  const dashaB = await buildDashaData({
    birth,
    selectedDateISO: dateBISO,
    plan,
    natal,
  });

  const changes: Array<{
  planet: string;
  fromSign: string;
  toSign: string;
  fromHouse: number | null;
toHouse: number | null;
  changed: boolean;
}> = [];

const natalRows: Array<{
  planet: string;
  natalSign: string;
  natalHouse: number | null;
  dateASign: string;
  dateAHouse: number | null;
  dateBSign: string;
  dateBHouse: number | null;
}> = [];

for (const rowA of snapA.planets || []) {
  const planetName = rowA.planet;
const normalizedName = normalizePlanetName(planetName);

const rowB = (snapB.planets || []).find(
  (x: any) => normalizePlanetName(x.planet) === normalizedName
);

const natalRow = (natalPlanets || []).find(
  (x: any) => normalizePlanetName(x.planet) === normalizedName
);

if (!rowB) continue;

  changes.push({
    planet: planetName,
    fromSign: rowA.sign,
    toSign: rowB.sign,
    fromHouse: rowA.houseFromLagna ?? null,
toHouse: rowB.houseFromLagna ?? null,
    changed:
      rowA.sign !== rowB.sign ||
      rowA.houseFromLagna !== rowB.houseFromLagna,
  });

  natalRows.push({
    planet: planetName,
natalSign: natalRow?.sign ?? "—",
natalHouse: natalRow?.house ?? null,
    dateASign: rowA.sign,
    dateAHouse: rowA.houseFromLagna ?? null,
    dateBSign: rowB.sign,
    dateBHouse: rowB.houseFromLagna ?? null,
  });
}

  return {
  dateAISO,
  dateBISO,
  dashaChanged:
    JSON.stringify(dashaA.current) !== JSON.stringify(dashaB.current),
  dashaA: dashaA.current,
  dashaB: dashaB.current,
  transitChanges: changes.filter((x) => x.changed),
  natalRows,
  moonA: snapA.moonToday,
  moonB: snapB.moonToday,
};
}