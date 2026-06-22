import "server-only";

import type { BirthInput, DataEnginePlan } from "./types";
import {
  getMahadashaTimeline,
  getAntardashaTimeline,
  getPratyantardashaTimeline,
  getSookshmaDashaTimeline,
  getPranaDashaTimeline,
  getDehaDashaTimeline,
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

type DashaTreeNode = {
  level: "md" | "ad" | "pd" | "sd" | "pr" | "de";
  lord: string | null;
  label: string | null;
  startISO: string | null;
  endISO: string | null;
  isActive?: boolean;
  children?: DashaTreeNode[];
};

function fmtISO(d?: Date | null): string | null {
  if (!d || !(d instanceof Date) || Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function isDateInRange(
  dateISO: string,
  startISO?: string | null,
  endISO?: string | null
) {
  if (!startISO || !endISO) return false;
  return dateISO >= startISO && dateISO < endISO;
}

function mapMdRows(mahaList: Array<any>) {
  return (Array.isArray(mahaList) ? mahaList : []).map((m) => ({
    lord: m.lord ?? null,
    label: m.lord ?? null,
    startISO: fmtISO(m.start),
    endISO: fmtISO(m.end),
  }));
}

function mapAdRows(antarList: Array<any>) {
  return (Array.isArray(antarList) ? antarList : []).map((a) => ({
    lord: a.subLord ?? null,
    mahaLord: a.mahaLord ?? null,
    label:
      a.mahaLord && a.subLord ? `${a.mahaLord} / ${a.subLord}` : a.subLord ?? null,
    startISO: fmtISO(a.start),
    endISO: fmtISO(a.end),
  }));
}
function buildAllAdRows(mahaList: Array<any>) {
  return (Array.isArray(mahaList) ? mahaList : []).flatMap((md) =>
    mapAdRows(getAntardashaTimeline(md))
  );
}

function buildAllPdRows(mahaList: Array<any>) {
  return (Array.isArray(mahaList) ? mahaList : []).flatMap((md) => {
    const adList = getAntardashaTimeline(md);

    return (Array.isArray(adList) ? adList : []).flatMap((ad) =>
      mapPdRows(getPratyantardashaTimeline(ad))
    );
  });
}
function mapPdRows(pdList: Array<any>) {
  return (Array.isArray(pdList) ? pdList : []).map((p) => ({
    lord: p.subSubLord ?? null,
    mahaLord: p.mahaLord ?? null,
    antarLord: p.antarLord ?? null,
    label:
      p.mahaLord && p.antarLord && p.subSubLord
        ? `${p.mahaLord} / ${p.antarLord} / ${p.subSubLord}`
        : p.subSubLord ?? null,
    startISO: fmtISO(p.start),
    endISO: fmtISO(p.end),
  }));
}

function buildFullDashaTree(
  mahaList: Array<any>,
  selectedDateISO: string,
  plan: DataEnginePlan
): DashaTreeNode[] {
  return (Array.isArray(mahaList) ? mahaList : []).map((md) => {
    const mdStartISO = fmtISO(md.start);
    const mdEndISO = fmtISO(md.end);

    const adList = getAntardashaTimeline(md);

    const adChildren: DashaTreeNode[] = (Array.isArray(adList) ? adList : []).map((ad) => {
      const adStartISO = fmtISO(ad.start);
      const adEndISO = fmtISO(ad.end);

      const pdList =
        plan === "pro" ? getPratyantardashaTimeline(ad) : [];

      const pdChildren: DashaTreeNode[] = (Array.isArray(pdList) ? pdList : []).map((pd) => {
  const pdStartISO = fmtISO(pd.start);
  const pdEndISO = fmtISO(pd.end);

  const sookshmaList =
  plan === "pro" ? getSookshmaDashaTimeline(pd) : [];

const sookshmaChildren: DashaTreeNode[] = sookshmaList.map((s) => {
  const sStart = fmtISO(s.start);
  const sEnd = fmtISO(s.end);

  const pranaList = plan === "pro" ? getPranaDashaTimeline(s) : [];

const pranaChildren: DashaTreeNode[] = pranaList.map((pr) => {
  const prStart = fmtISO(pr.start);
  const prEnd = fmtISO(pr.end);

  const dehaList = plan === "pro" ? getDehaDashaTimeline(pr) : [];

  const dehaChildren: DashaTreeNode[] = dehaList.map((d) => ({
    level: "de",
    lord: d.dehaLord ?? null,
    label: d.dehaLord ?? null,
    startISO: fmtISO(d.start),
    endISO: fmtISO(d.end),
    isActive: isDateInRange(
      selectedDateISO,
      fmtISO(d.start),
      fmtISO(d.end)
    ),
  }));

  return {
    level: "pr",
    lord: pr.pranaLord ?? null,
    label: pr.pranaLord ?? null,
    startISO: prStart,
    endISO: prEnd,
    isActive: isDateInRange(selectedDateISO, prStart, prEnd),
    children: dehaChildren,
  };
});

  return {
    level: "sd",
    lord: s.sookshmaLord ?? null,
    label: s.sookshmaLord ?? null,
    startISO: sStart,
    endISO: sEnd,
    isActive: isDateInRange(selectedDateISO, sStart, sEnd),
    children: pranaChildren,
  };
});

  return {
    level: "pd",
    lord: pd.subSubLord ?? null,
    label:
      pd.mahaLord && pd.antarLord && pd.subSubLord
        ? `${pd.mahaLord} / ${pd.antarLord} / ${pd.subSubLord}`
        : pd.subSubLord ?? null,
    startISO: pdStartISO,
    endISO: pdEndISO,
    isActive: isDateInRange(selectedDateISO, pdStartISO, pdEndISO),
    children: sookshmaChildren,
  };
});

return {
  level: "ad",
  lord: ad.subLord ?? null,
  label:
    ad.mahaLord && ad.subLord
      ? `${ad.mahaLord} / ${ad.subLord}`
      : ad.subLord ?? null,
  startISO: adStartISO,
  endISO: adEndISO,
  isActive: isDateInRange(selectedDateISO, adStartISO, adEndISO),
  children: pdChildren,
};
});

    return {
      level: "md",
      lord: md.lord ?? null,
      label: md.lord ?? null,
      startISO: mdStartISO,
      endISO: mdEndISO,
      isActive: isDateInRange(selectedDateISO, mdStartISO, mdEndISO),
      children: adChildren,
    };
  });
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
        mdStartISO: null,
        mdEndISO: null,
        adStartISO: null,
        adEndISO: null,
        ...(plan === "pro"
          ? {
              pdStartISO: null,
              pdEndISO: null,
            }
          : {}),
      },

      stack: {
        md: { lord: null, startISO: null, endISO: null },
        ad: { lord: null, startISO: null, endISO: null },
        ...(plan === "pro"
          ? { pd: { lord: null, startISO: null, endISO: null } }
          : {}),
      },

      timelines: {
        md: [],
        adInCurrentMd: [],
        ...(plan === "pro" ? { pdInCurrentAd: [] } : {}),
      },

      tree: [],
      sourceNote: "Dasha unavailable: natal birthUTCISO or moonLonSidDeg missing",
    };
  }

  const birthUTC = new Date(birthUTCISO);
  const when = new Date(`${selectedDateISO}T12:00:00.000Z`);
  const jdBirth = 0; // currently unused by getMahadashaTimeline()

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

  const current = {
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
  };

  const stack = {
    md: {
      lord: currentMahadasha?.lord ?? null,
      startISO: fmtISO(currentMahadasha?.start),
      endISO: fmtISO(currentMahadasha?.end),
    },
    ad: {
      lord: currentAntardasha?.subLord ?? null,
      startISO: fmtISO(currentAntardasha?.start),
      endISO: fmtISO(currentAntardasha?.end),
    },
    ...(plan === "pro"
      ? {
          pd: {
            lord: currentPratyantardasha?.subSubLord ?? null,
            startISO: fmtISO(currentPratyantardasha?.start),
            endISO: fmtISO(currentPratyantardasha?.end),
          },
        }
      : {}),
  };

  const tree = buildFullDashaTree(mahaList, selectedDateISO, plan);

  return {
    current,
    stack,
    timelines: {
  md: mapMdRows(mahaList),

  // Full lifetime lookup timelines
  ad: buildAllAdRows(mahaList),
  ...(plan === "pro"
    ? { pd: buildAllPdRows(mahaList) }
    : {}),

  // Keep existing current-context timelines for timing cards
  adInCurrentMd: mapAdRows(adInCurrentMd),
  ...(plan === "pro"
    ? { pdInCurrentAd: mapPdRows(pdInCurrentAd) }
    : {}),
},
    tree,
    sourceNote: `Real dasha data for ${birth.dateISO}`,
  };
}