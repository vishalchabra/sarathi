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
console.log("COMPARE DEBUG — NATAL PLANETS:",
  (natalPlanets || []).map((p: any) => p.planet)
);

console.log("COMPARE DEBUG — SNAP A PLANETS:",
  (snapA.planets || []).map((p: any) => p.planet)
);

console.log("COMPARE DEBUG — SNAP B PLANETS:",
  (snapB.planets || []).map((p: any) => p.planet)
);
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
  fromHouse: number;
  toHouse: number;
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

for (const natalRow of natalPlanets || []) {
  const natalName = normalizePlanetName(natalRow.planet);

  const rowA = (snapA.planets || []).find(
    (x: any) => normalizePlanetName(x.planet) === natalName
  );

  const rowB = (snapB.planets || []).find(
    (x: any) => normalizePlanetName(x.planet) === natalName
  );

  if (!rowA || !rowB) continue;

  changes.push({
    planet: natalRow.planet,
    fromSign: rowA.sign,
    toSign: rowB.sign,
    fromHouse: rowA.houseFromLagna,
    toHouse: rowB.houseFromLagna,
    changed:
      rowA.sign !== rowB.sign ||
      rowA.houseFromLagna !== rowB.houseFromLagna,
  });

  natalRows.push({
    planet: natalRow.planet,
    natalSign: natalRow.sign,
    natalHouse: natalRow.house ?? null,
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