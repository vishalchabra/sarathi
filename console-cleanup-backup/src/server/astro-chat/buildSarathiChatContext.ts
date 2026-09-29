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

  activePeriods: any;
  dashaTimeline: any[];
  mahadashaTimeline: any[];

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
const currentDasha =
  engine?.timing?.dasha?.current ??
  null;

const activePeriods =
  currentDasha
    ? {
        mahadasha:
          currentDasha.md
            ? {
                lord: currentDasha.md,
                start: currentDasha.mdStartISO ?? null,
                end: currentDasha.mdEndISO ?? null,
                summary: "",
              }
            : null,

        antardasha:
          currentDasha.ad
            ? {
                mahaLord: currentDasha.md ?? "",
                subLord: currentDasha.ad,
                start: currentDasha.adStartISO ?? null,
                end: currentDasha.adEndISO ?? null,
              }
            : null,

        pratyantardasha:
          currentDasha.pd
            ? {
                mahaLord: currentDasha.md ?? "",
                antarLord: currentDasha.ad ?? "",
                lord: currentDasha.pd,
                start: currentDasha.pdStartISO ?? null,
                end: currentDasha.pdEndISO ?? null,
              }
            : null,
      }
    : null;
    const mahadashaTimeline =
  Array.isArray(
    engine?.timing?.dasha?.timelines?.md
  )
    ? engine.timing.dasha.timelines.md
    : [];
  const dashaTimelines =
  engine?.timing?.dasha?.timelines ??
  {};

const mdRows =
  Array.isArray(dashaTimelines.md)
    ? dashaTimelines.md
    : [];

const adRows =
  Array.isArray(dashaTimelines.adInCurrentMd) &&
  dashaTimelines.adInCurrentMd.length
    ? dashaTimelines.adInCurrentMd
    : Array.isArray(dashaTimelines.ad)
    ? dashaTimelines.ad
    : [];

const pdRows =
  Array.isArray(dashaTimelines.pdInCurrentAd) &&
  dashaTimelines.pdInCurrentAd.length
    ? dashaTimelines.pdInCurrentAd
    : Array.isArray(dashaTimelines.pd)
    ? dashaTimelines.pd
    : [];

const dashaTimeline = [
  ...mdRows.map((row: any) => ({
    start: row.startISO ?? null,
    end: row.endISO ?? null,

    startISO: row.startISO ?? null,
    endISO: row.endISO ?? null,

    md: row.lord ?? null,
    ad: null,
    pd: null,

    dashaLevel: "md" as const,

    label:
      row.label ??
      `${row.lord ?? ""} Mahadasha`,
  })),

  ...adRows.map((row: any) => ({
    start: row.startISO ?? null,
    end: row.endISO ?? null,

    startISO: row.startISO ?? null,
    endISO: row.endISO ?? null,

    md:
      row.mahaLord ??
      null,

    ad:
      row.lord ??
      null,

    pd: null,

    dashaLevel: "ad" as const,

    label:
      row.label ??
      `${row.mahaLord ?? ""} / ${row.lord ?? ""}`,
  })),

  ...pdRows.map((row: any) => ({
    start: row.startISO ?? null,
    end: row.endISO ?? null,

    startISO: row.startISO ?? null,
    endISO: row.endISO ?? null,

    md:
      row.mahaLord ??
      null,

    ad:
      row.antarLord ??
      null,

    pd:
      row.lord ??
      null,

    dashaLevel: "pd" as const,

    label:
      row.label ??
      `${row.mahaLord ?? ""} / ${row.antarLord ?? ""} / ${row.lord ?? ""}`,
  })),
]
  .filter(
    (row) =>
      row.start &&
      row.end
  )
  .sort(
    (a, b) =>
      String(a.start).localeCompare(
        String(b.start)
      )
  );
    console.log(
  "========== REAL DASHA TIMELINE SHAPE =========="
);

console.log({
  mdFirst:
    engine?.timing?.dasha?.timelines?.md?.[0] ??
    null,

  adFirst:
    engine?.timing?.dasha?.timelines?.ad?.[0] ??
    null,

  pdFirst:
    engine?.timing?.dasha?.timelines?.pd?.[0] ??
    null,

  adCurrentMdFirst:
    engine?.timing?.dasha?.timelines
      ?.adInCurrentMd?.[0] ??
    null,

  pdCurrentAdFirst:
    engine?.timing?.dasha?.timelines
      ?.pdInCurrentAd?.[0] ??
    null,
});

console.log(
  "==============================================="
);
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

activePeriods,
dashaTimeline,
mahadashaTimeline,
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