import "server-only";

import type { BirthInput, DataEnginePlan } from "./types";
import {
  getMahadashaTimeline,
  getAntardashaTimeline,
  getPratyantardashaTimeline,
  getActiveDashaStateAt,
} from "@/lib/astro/dasha";

type BuildDashaDataParams = {
  birth: BirthInput;
  selectedDateISO: string;
  plan: DataEnginePlan;
  natal?: {
    birthUTCISO?: string;
    moonLonSidDeg?: number | null;
  } | null;
};

function fmtISO(d?: Date | null): string | null {
  if (!d || !(d instanceof Date) || Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function mapMdRows(mahaList: Array<any>) {
  return (Array.isArray(mahaList) ? mahaList : []).map((m) => ({
    lord: m.lord,
    startISO: fmtISO(m.start),
    endISO: fmtISO(m.end),
  }));
}

function mapAdRows(antarList: Array<any>) {
  return (Array.isArray(antarList) ? antarList : []).map((a) => ({
    lord: a.subLord,
    mahaLord: a.mahaLord,
    startISO: fmtISO(a.start),
    endISO: fmtISO(a.end),
  }));
}

function mapPdRows(pdList: Array<any>) {
  return (Array.isArray(pdList) ? pdList : []).map((p) => ({
    lord: p.subSubLord,
    mahaLord: p.mahaLord,
    antarLord: p.antarLord,
    startISO: fmtISO(p.start),
    endISO: fmtISO(p.end),
  }));
}

export async function buildDashaData(params: BuildDashaDataParams) {
  const { selectedDateISO, plan, birth, natal } = params;

  const birthUTCISO =
    typeof natal?.birthUTCISO === "string" ? natal.birthUTCISO.trim() : "";

  const moonLonSidDeg =
    typeof natal?.moonLonSidDeg === "number"
      ? natal.moonLonSidDeg
      : Number.NaN;

  if (!birthUTCISO || !Number.isFinite(moonLonSidDeg)) {
    return {
      current: {
        md: null,
        ad: null,
        ...(plan === "pro" ? { pd: null } : {}),
        activeOn: selectedDateISO,
      },
      timelines: {
        md: [],
        adInCurrentMd: [],
        ...(plan === "pro" ? { pdInCurrentAd: [] } : {}),
      },
      sourceNote: "Dasha unavailable: natal birthUTCISO or moonLonSidDeg missing",
    };
  }

  const birthUTC = new Date(birthUTCISO);
  const when = new Date(`${selectedDateISO}T12:00:00.000Z`);
  const jdBirth = 0;

  const mahaList = getMahadashaTimeline(
    birthUTC,
    jdBirth,
    moonLonSidDeg,
    120
  );

  const active = getActiveDashaStateAt(when, mahaList);

  const currentMahadasha = active.currentMahadasha;
  const currentAntardasha = active.currentAntardasha;
  const currentPratyantardasha = active.currentPratyantardasha;

  const adInCurrentMd = currentMahadasha
    ? getAntardashaTimeline(currentMahadasha)
    : [];

  const pdInCurrentAd =
    plan === "pro" && currentAntardasha
      ? getPratyantardashaTimeline(currentAntardasha)
      : [];

  return {
    current: {
      md: currentMahadasha?.lord ?? null,
      ad: currentAntardasha?.subLord ?? null,
      ...(plan === "pro"
        ? { pd: currentPratyantardasha?.subSubLord ?? null }
        : {}),
      activeOn: selectedDateISO,
      mdStartISO: fmtISO(currentMahadasha?.start),
      mdEndISO: fmtISO(currentMahadasha?.end),
      adStartISO: fmtISO(currentAntardasha?.start),
      adEndISO: fmtISO(currentAntardasha?.end),
      ...(plan === "pro"
        ? {
            pdStartISO: fmtISO(currentPratyantardasha?.start),
            pdEndISO: fmtISO(currentPratyantardasha?.end),
          }
        : {}),
    },
    timelines: {
      md: mapMdRows(mahaList),
      adInCurrentMd: mapAdRows(adInCurrentMd),
      ...(plan === "pro"
        ? { pdInCurrentAd: mapPdRows(pdInCurrentAd) }
        : {}),
    },
    sourceNote: `Real dasha data for ${birth.dateISO}`,
  };
}