// FILE: src/server/astro/vimshottari.ts
// Proper Vimshottari Mahadasha table based on sidereal Moon (Lahiri)

import "server-only";
import { getNakshatra } from "@/server/astro/nakshatra";
import {
  sweJulday,
  sweCall,
  getSweConstants,
} from "@/server/astro/swe-remote";

export type Birth = {
  dateISO: string;  // "YYYY-MM-DD"
  time: string;     // "HH:mm"
  tz: string;       // IANA TZ, e.g. "Asia/Kolkata"
  lat: number;
  lon: number;
};

export type MDT = { planet: string; startISO: string; endISO: string };

// Standard Vimshottari MD order + durations (years)
const MD_ORDER = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
] as const;

const MD_YEARS: Record<string, number> = {
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

function norm360(x: number) {
  x = x % 360;
  return x < 0 ? x + 360 : x;
}

/* ---------------------- time helpers ---------------------- */

function parseGmtOffsetMinutes(label: string): number | undefined {
  const m = /GMT([+-]\d{1,2})(?::?(\d{2}))?/.exec(label);
  if (!m) return;
  const h = parseInt(m[1], 10);
  const min = m[2] ? parseInt(m[2], 10) : 0;
  return h * 60 + (h >= 0 ? min : -min);
}

function tzOffsetMinutesAt(tz: string, probeUtc: Date): number {
  const s = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    timeZoneName: "shortOffset",
  }).format(probeUtc);
  return parseGmtOffsetMinutes(s) ?? 0;
}

/** Local birth (dateISO + HH:mm in tz) → real UTC instant */
function makeUtcInstant(b: Birth): Date {
  const [H, M] = b.time.split(":").map(Number);
  const pretendUtc = new Date(
    Date.UTC(
      +b.dateISO.slice(0, 4),
      +b.dateISO.slice(5, 7) - 1,
      +b.dateISO.slice(8, 10),
      H,
      M,
      0,
      0
    )
  );
  const off = tzOffsetMinutesAt(b.tz, pretendUtc);
  return new Date(pretendUtc.getTime() - off * 60_000);
}

/* ---------------------- Swe helpers (remote) ---------------------- */

function extractLongitude(res: any): number | null {
  if (!res) return null;

  // 1) Direct property
  if (typeof res.longitude === "number") return res.longitude;

  // 2) Bare array [lon, ...]
  if (Array.isArray(res) && typeof res[0] === "number") return res[0];

  // 3) Common container keys
  const candidates = [res.x, res.xx, res.result, res.r];
  for (const c of candidates) {
    if (Array.isArray(c) && typeof c[0] === "number") return c[0];
  }

  // 4) Heuristic: any numeric field that looks like a longitude
  if (res && typeof res === "object") {
    for (const k of Object.keys(res)) {
      const v = (res as any)[k];
      if (
        typeof v === "number" &&
        isFinite(v) &&
        Math.abs(v) <= 720
      ) {
        return v;
      }
    }
  }

  return null;
}

async function jdFromDateUTC(d: Date, gregCal: number): Promise<number> {
  const hour =
    d.getUTCHours() +
    d.getUTCMinutes() / 60 +
    d.getUTCSeconds() / 3600;
  return sweJulday(
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    hour,
    gregCal
  );
}

/* ---------------------- Moon degree (remote sidereal) ---------------------- */

async function moonSiderealDegAtBirth(birth: Birth): Promise<number> {
  const constants = await getSweConstants();

   // Ensure sidereal Lahiri mode on the engine (best-effort)
  try {
    const lahiri = (constants as any).SE_SIDM_LAHIRI;

    if (typeof lahiri === "number") {
      await sweCall(
        "swe_set_sid_mode",
        lahiri,
        0,
        0
      );
    }
  } catch {
    // ignore; engine may already be in sidereal mode
  }

  const birthUtc = makeUtcInstant(birth);
  const jdUt = await jdFromDateUTC(birthUtc, constants.SE_GREG_CAL);

  const flags =
    (constants.SEFLG_SWIEPH ?? 2) |
    (constants.SEFLG_SIDEREAL ?? 64) |
    (constants.SEFLG_SPEED ?? 256);

  const res = await sweCall<any>(
    "swe_calc_ut",
    jdUt,
    constants.SE_MOON,
    flags
  );

  const lonRaw = extractLongitude(res);
  const lon = typeof lonRaw === "number" ? lonRaw : 0;

  return norm360(lon);
}

/* ---------------------- date math ---------------------- */

const DAY_MS = 86400_000;
const YEAR_DAYS = 365.25; // Vimshottari uses 120 * 365.25 days total

function addYears(base: Date, years: number): Date {
  const ms = years * YEAR_DAYS * DAY_MS;
  return new Date(base.getTime() + ms);
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/* ---------------------- core Vimshottari ---------------------- */

function buildMDFromMoonDeg(birth: Birth, moonDeg: number): MDT[] {
  const seg = 360 / 27; // 13°20′ per nakshatra
  const pos = moonDeg % seg; // degrees inside nakshatra
  const fracElapsed = pos / seg; // part already elapsed
  const nk = getNakshatra(moonDeg); // from nakshatra.ts
  const startLord = nk.lord; // "Ketu", "Venus", etc.

  if (!MD_YEARS[startLord]) {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "[vimshottari] Unknown start lord from nakshatra:",
        nk,
        "deg=",
        moonDeg
      );
    }
    return [];
  }

  const startIndex = MD_ORDER.indexOf(startLord as any);
  if (startIndex === -1) return [];

  const birthUtc = makeUtcInstant(birth);
  const rows: MDT[] = [];

  // 1) Initial (balance) MD
  const totalYears = MD_YEARS[startLord];
  const remainingYears = totalYears * (1 - fracElapsed);

  const firstStart = birthUtc;
  const firstEnd = addYears(firstStart, remainingYears);

  rows.push({
    planet: startLord,
    startISO: toISODate(firstStart),
    endISO: toISODate(firstEnd),
  });

  // 2) Subsequent full MDs (loop for one full 120-year cycle)
  let cursor = firstEnd;
  let idx = (startIndex + 1) % MD_ORDER.length;

  for (let k = 0; k < MD_ORDER.length * 2; k++) {
    const lord = MD_ORDER[idx];
    const yrs = MD_YEARS[lord];
    const nextEnd = addYears(cursor, yrs);

    rows.push({
      planet: lord,
      startISO: toISODate(cursor),
      endISO: toISODate(nextEnd),
    });

    cursor = nextEnd;
    idx = (idx + 1) % MD_ORDER.length;
  }

  return rows;
}

/* ---------------------- PUBLIC API ---------------------- */

/**
 * Return normalized Mahadasha rows: [{ planet, startISO, endISO }, ...]
 * Based purely on:
 *  - Sidereal (Lahiri) Moon longitude
 *  - Moon's nakshatra lord at birth
 *  - Remaining balance of that nakshatra
 */
export async function vimshottariMDTable(birth: Birth): Promise<MDT[]> {
  try {
    const moonDeg = await moonSiderealDegAtBirth(birth);
    const rows = buildMDFromMoonDeg(birth, moonDeg);

    if (process.env.NODE_ENV !== "production") {
      console.log(
        "[vimshottari] Moon°=",
        moonDeg.toFixed(2),
        "MD rows:",
        rows.length,
        rows.slice(0, 3),
        "…"
      );
    }
    return rows;
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[vimshottari] failed:", e);
    }
    return [];
  }
}
