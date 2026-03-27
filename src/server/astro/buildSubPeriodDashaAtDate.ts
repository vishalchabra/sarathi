import type { PlanetId } from "@/server/astro/types";

type DashaTriple = {
  md: PlanetId | null;
  ad: PlanetId | null;
  pd: PlanetId | null;
};

type Input = {
  md: PlanetId | null;
  mdStartISO: string;
  mdEndISO: string;
  targetDateISO: string;
};

const VIMSOTTARI_YEARS: Record<PlanetId, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

const VIMSOTTARI_ORDER: PlanetId[] = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
];

export function buildSubPeriodDashaAtDate(input: Input): DashaTriple {
  const { md, mdStartISO, mdEndISO, targetDateISO } = input;

  if (!md || !mdStartISO || !mdEndISO || !targetDateISO) {
    return { md: md ?? null, ad: null, pd: null };
  }

  const mdStart = toDate(mdStartISO);
  const mdEnd = toDate(mdEndISO);
  const target = toDate(targetDateISO);

  if (!mdStart || !mdEnd || !target) {
    return { md, ad: null, pd: null };
  }

  if (target < mdStart || target > mdEnd) {
    return { md, ad: null, pd: null };
  }

  // 1. Find AD inside MD
  const adWindows = buildSubPeriods({
    parentLord: md,
    parentStart: mdStart,
    parentEnd: mdEnd,
  });

  const activeAD = adWindows.find((w) => target >= w.start && target <= w.end);

  if (!activeAD) {
    return { md, ad: null, pd: null };
  }

  // 2. Find PD inside AD
  const pdWindows = buildSubPeriods({
    parentLord: activeAD.lord,
    parentStart: activeAD.start,
    parentEnd: activeAD.end,
  });

  const activePD = pdWindows.find((w) => target >= w.start && target <= w.end);

  return {
    md,
    ad: activeAD.lord,
    pd: activePD?.lord ?? null,
  };
}

/* ---------------- helpers ---------------- */

function buildSubPeriods(opts: {
  parentLord: PlanetId;
  parentStart: Date;
  parentEnd: Date;
}) {
  const { parentLord, parentStart, parentEnd } = opts;

  const totalMs = parentEnd.getTime() - parentStart.getTime();
  if (totalMs <= 0) return [];

  const startIndex = VIMSOTTARI_ORDER.indexOf(parentLord);
  if (startIndex < 0) return [];

  const ordered = rotateFrom(startIndex, VIMSOTTARI_ORDER);

  const out: Array<{ lord: PlanetId; start: Date; end: Date }> = [];

  let cursor = parentStart.getTime();

  for (const lord of ordered) {
    const frac = VIMSOTTARI_YEARS[lord] / 120;
    const lengthMs = totalMs * frac;

    const start = new Date(cursor);
    const end = new Date(cursor + lengthMs);

    out.push({
      lord,
      start,
      end,
    });

    cursor += lengthMs;
  }

  // force last end to align exactly with parentEnd
  if (out.length > 0) {
    out[out.length - 1].end = new Date(parentEnd.getTime());
  }

  return out;
}

function rotateFrom<T>(startIndex: number, arr: T[]): T[] {
  return [...arr.slice(startIndex), ...arr.slice(0, startIndex)];
}

function toDate(iso: string): Date | null {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}