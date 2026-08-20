// FILE: src/server/qa/dasha.ts
"use server";

export type Birth = {
  dateISO: string;
  time: string;
  tz: string;
  lat: number;
  lon: number;
};

export type DashaSpan = {
  fromISO: string;
  toISO: string;
  label: string;

  md?: string | null;
  ad?: string | null;
  pd?: string | null;
};

/**
 * IMPORTANT:
 *
 * Do not fabricate Vimshottari periods.
 *
 * The old version hardcoded Venus MD / Ketu AD
 * and created synthetic 45-day blocks.
 *
 * Until the real future Vimshottari schedule
 * is connected, return no future spans.
 */
export async function fetchDashaSpans(
  _birth: Birth,
  _yearsHorizon: number = 3
): Promise<DashaSpan[]> {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[QA DASHA] Real future Vimshottari schedule is not wired. Returning [] instead of synthetic periods."
    );
  }

  return [];
}

/**
 * Never return cosmetic/current dasha values.
 */
export async function currentNowLabel(): Promise<{
  md: string | null;
  ad: string | null;
  label: string;
}> {
  return {
    md: null,
    ad: null,
    label: "Dasha schedule unavailable",
  };
}