import "server-only";

import {
  buildDataEngine,
  type BirthInput,
  type DataEngineOutput,
} from "@/server/dataEngine/buildDataEngine";

export type SarathiChatContext = {
  engine: DataEngineOutput;
  chart: {
    meta: DataEngineOutput["meta"];
    birth: any;
    ascendant: any;
    natal: any;
    houses: any;
    roles: any;
    vargas: any;
    arudhas: any;
    dasha: any;
    dashaContext: any;
    nakshatraContext: any;
    panchang: any;
    moonContext: any;
    transits: any;
    triggerEngine: any;
    strength: any;
    yogas: {
      classic: any;
      nabhasa: any;
    };
    bhavaChalit: any;
    classicChalit: any;
    houseJudgement: any;
    vedicAspects: any;
  };
};

export async function buildSarathiChatContext(params: {
  birth: BirthInput;
  selectedDateISO?: string;
  compareDateISO?: string | null;
}): Promise<SarathiChatContext> {
  const engine = await buildDataEngine({
    birth: params.birth,
    plan: "pro",
    selectedDateISO: params.selectedDateISO,
    compareDateISO: params.compareDateISO ?? undefined,
  });

  return {
    engine,

    chart: {
      meta: engine.meta,
      birth: engine.foundations.birthMeta,
      ascendant: engine.foundations.ascendant,
      natal: engine.foundations.natal,
      houses: engine.foundations.houses,
      roles: engine.foundations.roles,

      vargas: engine.vargas,
      arudhas: engine.arudhas,

      dasha: engine.timing.dasha,
      dashaContext: engine.timing.dashaContext,
      nakshatraContext: engine.timing.nakshatraContext,
      panchang: engine.timing.panchang,
      moonContext: engine.timing.moonContext,

      transits: engine.transits,
      triggerEngine: engine.triggerEngine,
      strength: engine.strength,

      yogas: {
        classic: engine.classicYogas,
        nabhasa: engine.nabhasaYogas,
      },

      bhavaChalit: engine.bhavaChalit,
      classicChalit: engine.classicChalit,
      houseJudgement: engine.foundations.houseJudgement,
      vedicAspects: engine.foundations.vedicAspects,
    },
  };
}