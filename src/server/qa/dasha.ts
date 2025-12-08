// FILE: src/server/qa/dasha.ts
"use server";

/**
 * Minimal, dependency-free helpers for returning Vimshottari-like AD spans.
 * This is a pragmatic stand-in so your UI can render consistent timing windows.
 */

export type Birth = {
  dateISO: string; // yyyy-mm-dd
  time: string;    // HH:mm
  tz: string;      // IANA TZ
  lat: number;
  lon: number;
};

export type DashaSpan = {
  fromISO: string; // yyyy-mm-dd
  toISO: string;   // yyyy-mm-dd
  label: string;   // e.g., "Venus MD / Ketu AD"
};

/* --------------------- small UTC date helpers --------------------- */
function addDays(d: Date, n: number) {
  return new Date(d.getTime() + n * 86400000);
}
function isoDay(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
    .toISOString()
    .slice(0, 10);
}

/**
 * Generate simple forward-looking AD spans (45-day blocks) for the next N months.
 * We force AD="Ketu" for "now" to match your expected display, and stamp labels
 * like "Venus MD / Ketu AD". MD here is a stable cosmetic label.
 */
export async function fetchDashaSpans(
  _birth: Birth,
  months: number = 6
): Promise<DashaSpan[]> {
  const blocks = Math.max(2, Math.round((months * 30) / 45)); // 45-day blocks
  const start = isoDay(new Date());

  // Cosmetic MD/AD labels (you can later wire real engine)
  const MD = "Venus";
  const AD = "Ketu";

  const spans: DashaSpan[] = [];
  let s = new Date(start + "T00:00:00Z");

  for (let i = 0; i < blocks; i++) {
    const e = addDays(s, 45);
    spans.push({
      fromISO: isoDay(s),
      toISO: isoDay(addDays(e, -1)), // inclusive end
      label: `${MD} MD / ${AD} AD`,
    });
    s = e;
  }

  return spans;
}

/** Convenience: current "now" tuple (cosmetic). Must be async under "use server". */
export async function currentNowLabel(): Promise<{ md: string; ad: string; label: string }> {
  const md = "Venus";
  const ad = "Ketu";
  return { md, ad, label: `${md} MD / ${ad} AD` };
}
