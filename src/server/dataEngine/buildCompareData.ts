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

  for (const rowA of snapA.planets || []) {
    const rowB = (snapB.planets || []).find((x: any) => x.planet === rowA.planet);
    if (!rowB) continue;

    changes.push({
      planet: rowA.planet,
      fromSign: rowA.sign,
      toSign: rowB.sign,
      fromHouse: rowA.houseFromLagna,
      toHouse: rowB.houseFromLagna,
      changed:
        rowA.sign !== rowB.sign ||
        rowA.houseFromLagna !== rowB.houseFromLagna,
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
    moonA: snapA.moonToday,
    moonB: snapB.moonToday,
  };
}