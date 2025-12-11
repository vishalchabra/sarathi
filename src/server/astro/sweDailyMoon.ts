// FILE: src/server/astro/sweDailyMoon.ts

import "server-only";
import {
  sweJulday,
  sweCall,
  getSweConstants,
} from "@/server/astro/swe-remote";

/**
 * Input shape – we mostly care about tz & birth data so we can
 * compute the house from natal Moon (Moon as Lagna).
 */
export type DailyMoonBirth = {
  dateISO: string; // "YYYY-MM-DD"
  time: string;    // "HH:mm"
  tz: string;      // IANA tz, e.g. "Asia/Dubai"
  lat: number;
  lon: number;
};

export type DailyMoonRow = {
  dateISO: string;               // calendar date for that day
  moonNakshatra: string | null;  // e.g. "Swati", "Anuradha"
  houseFromMoon: number | null;  // 1..12 from natal Moon (Moon as Lagna)
  // alias so older client code that expects this name still works
  relativeHouseFromMoon?: number | null;
};

/* -------------------------------------------------------
   BASIC DATE HELPERS
-------------------------------------------------------- */

function startOfDayUTC(d: Date): Date {
  const nd = new Date(d.getTime());
  nd.setUTCHours(0, 0, 0, 0);
  return nd;
}

function addDays(d: Date, days: number): Date {
  const nd = new Date(d.getTime());
  nd.setUTCDate(nd.getUTCDate() + days);
  return nd;
}

function fmtISO(d: Date): string {
  // just the date part
  return d.toISOString().slice(0, 10);
}

/* -------------------------------------------------------
   ANGLE + NAKSHATRA HELPERS
-------------------------------------------------------- */

function wrap360(x: number): number {
  let v = x % 360;
  if (v < 0) v += 360;
  return v;
}

// 27 nakshatras in order (Lahiri style)
const NAKSHATRAS_27 = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

function nakFromDeg(deg: number): string {
  const d = wrap360(deg);
  const part = 360 / 27;
  const idx = Math.floor(d / part) % 27;
  return NAKSHATRAS_27[idx] ?? "Unknown";
}

/* -------------------------------------------------------
   TIMEZONE HELPERS (to compute natal Moon correctly)
-------------------------------------------------------- */

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

/** Build the UTC Date that corresponds to local dISO + HH:mm in tz. */
function makeUtcInstant(dISO: string, hhmm: string, tz: string): Date {
  const [H, M] = hhmm.split(":").map(Number);
  const pretendedUtc = new Date(
    Date.UTC(
      +dISO.slice(0, 4),
      +dISO.slice(5, 7) - 1,
      +dISO.slice(8, 10),
      H,
      M,
      0,
      0
    )
  );
  const off = tzOffsetMinutesAt(tz, pretendedUtc);
  return new Date(pretendedUtc.getTime() - off * 60_000);
}

/* -------------------------------------------------------
   JULIAN DAY + LONGITUDE HELPERS (remote Swisseph)
-------------------------------------------------------- */

async function jdFromDate(d: Date, gregCal: number): Promise<number> {
  return sweJulday(
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours() +
      d.getUTCMinutes() / 60 +
      d.getUTCSeconds() / 3600,
    gregCal
  );
}

function extractLongitude(res: any): number | null {
  if (!res) return null;

  // 1) named property
  if (typeof res.longitude === "number") return res.longitude;

  // 2) bare array [lon, ...]
  if (Array.isArray(res) && typeof res[0] === "number") return res[0];

  // 3) look at common containers
  const candidates = [res.x, res.xx, res.result, res.r];
  for (const c of candidates) {
    if (Array.isArray(c) && typeof c[0] === "number") return c[0];
  }

  // 4) heuristic fallback
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

/* -------------------------------------------------------
   CORE: DAILY MOON NAKSHATRAS + HOUSE FROM NATAL MOON
-------------------------------------------------------- */

/**
 * Compute the Moon's nakshatra for the next `days` calendar days
 * starting from "today" (server-side today), and also:
 * - houseFromMoon = house number (1..12) from natal Moon (Moon as Lagna)
 *
 * We:
 * - use Swiss Ephemeris in sidereal mode (via remote engine)
 * - compute natal Moon sign from birth
 * - then for each day's Moon, compute which sign/house it falls in
 *   relative to natal Moon.
 */
export async function computeDailyMoonNakshatras(
  birth: DailyMoonBirth,
  days: number
): Promise<DailyMoonRow[]> {
  const constants = await getSweConstants();

  const flags =
    (constants.SEFLG_SWIEPH ?? 2) |
    (constants.SEFLG_SPEED ?? 256) |
    (constants.SEFLG_SIDEREAL ?? 64);

  // 1) Natal Moon: get its sign index (0..11) from birth data
  const birthUtc = makeUtcInstant(
    birth.dateISO,
    birth.time,
    birth.tz
  );
  const jdNatal = await jdFromDate(
    birthUtc,
    constants.SE_GREG_CAL
  );

  const natalRes = await sweCall<any>(
    "swe_calc_ut",
    jdNatal,
    constants.SE_MOON,
    flags
  );

  const natalLonRaw = extractLongitude(natalRes);
  let natalSignIndex: number | null = null;

  if (typeof natalLonRaw === "number") {
    const natalLon = wrap360(natalLonRaw);
    natalSignIndex = Math.floor(natalLon / 30); // 0=Aries, 1=Taurus, ...
  }

  const today = startOfDayUTC(new Date());
  const horizon = Math.max(1, Math.min(days || 7, 60)); // safety clamp

  const out: DailyMoonRow[] = [];

  for (let i = 0; i < horizon; i++) {
    const day = addDays(today, i);
    const jdUt = await jdFromDate(day, constants.SE_GREG_CAL);

    const result = await sweCall<any>(
      "swe_calc_ut",
      jdUt,
      constants.SE_MOON,
      flags
    );
    const lonRaw = extractLongitude(result);

    if (lonRaw == null) {
      out.push({
        dateISO: fmtISO(day),
        moonNakshatra: null,
        houseFromMoon: null,
        relativeHouseFromMoon: null,
      });
      continue;
    }

    const lon = wrap360(lonRaw);
    const nak = nakFromDeg(lon);

    let houseFromMoon: number | null = null;
    if (natalSignIndex != null) {
      const transitSignIndex = Math.floor(lon / 30); // 0..11
      // house = distance in signs from natal Moon + 1
      houseFromMoon =
        ((transitSignIndex - natalSignIndex + 12) % 12) + 1; // 1..12
    }

    out.push({
      dateISO: fmtISO(day),
      moonNakshatra: nak,
      houseFromMoon,
      relativeHouseFromMoon: houseFromMoon,
    });
  }

  return out;
}
