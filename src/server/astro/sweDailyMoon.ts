// FILE: src/server/astro/sweDailyMoon.ts
import "server-only";
import { sweJulday, sweCall, getSweConstants } from "@/server/astro/swe-remote";

export type DailyMoonBirth = {
  // natal birth (used for “house from Moon” reference)
  dateISO: string;
  time: string;

  // optional explicit natal fields (if you prefer these names)
  birthDateISO?: string;
  birthTime?: string;

  // base date/time for the daily series
  baseDateISO?: string;
  baseTime?: string;

  tz: string;
  lat: number;
  lon: number;
};

export type DailyMoonRow = {
  dateISO: string;
  moonNakshatra: string | null;
  houseFromMoon: number | null;
  relativeHouseFromMoon?: number | null;
};

/* -------------------------------------------------------
   Helpers
-------------------------------------------------------- */

function wrap360(x: number): number {
  let v = x % 360;
  if (v < 0) v += 360;
  return v;
}

function addDaysUTC(d: Date, days: number): Date {
  const nd = new Date(d.getTime());
  nd.setUTCDate(nd.getUTCDate() + days);
  return nd;
}

function fmtISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function parseISOToUtcMidnight(dISO: string): Date {
  return new Date(Date.UTC(+dISO.slice(0, 4), +dISO.slice(5, 7) - 1, +dISO.slice(8, 10), 0, 0, 0, 0));
}

/* -------------------------------------------------------
   Nakshatra table (sidereal)
-------------------------------------------------------- */

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

function nakFromDegSidereal(degSid: number): string {
  const d = wrap360(degSid);
  const part = 360 / 27;
  const idx = Math.floor(d / part) % 27;
  return NAKSHATRAS_27[idx] ?? "Unknown";
}

/* -------------------------------------------------------
   Timezone helpers
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

function makeUtcInstant(dISO: string, hhmm: string, tz: string): Date {
  const [H, M] = hhmm.split(":").map(Number);
  const pretendedUtc = new Date(Date.UTC(+dISO.slice(0, 4), +dISO.slice(5, 7) - 1, +dISO.slice(8, 10), H, M, 0, 0));
  const off = tzOffsetMinutesAt(tz, pretendedUtc);
  return new Date(pretendedUtc.getTime() - off * 60_000);
}

async function jdFromUtcDate(d: Date, gregCal: number): Promise<number> {
  return sweJulday(
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600,
    gregCal
  );
}

function extractLongitude(res: any): number | null {
  if (!res) return null;
  if (typeof res.longitude === "number") return res.longitude;
  if (Array.isArray(res) && typeof res[0] === "number") return res[0];
  if (res && Array.isArray(res.x) && typeof res.x[0] === "number") return res.x[0];
  if (res && Array.isArray(res.xx) && typeof res.xx[0] === "number") return res.xx[0];
  return null;
}

/* -------------------------------------------------------
   Main
-------------------------------------------------------- */
export type MoonNowResult = {
  atISO: string;           // UTC ISO instant used
  tz: string;
  lonTrop: number | null;
  lonSid: number | null;
  ayanamsa: number | null;
  nakshatra: string | null;
};

export async function computeMoonNakshatraNow(
  tz: string,
  lat: number,
  lon: number
): Promise<MoonNowResult> {
  const constants = await getSweConstants();
  const flagsTropical = constants.SEFLG_SWIEPH;

  // use real “now” instant
  const now = new Date();
  const jdUt = await jdFromUtcDate(now, constants.SE_GREG_CAL);
  
  const moonTropRes = await sweCall<any>("swe_calc_ut", jdUt, constants.SE_MOON, flagsTropical);
  const lonTrop = extractLongitude(moonTropRes);

  const ay = await sweCall<number>("swe_get_ayanamsa_ut", jdUt);
  const lonSid = typeof lonTrop === "number" ? wrap360(lonTrop - ay) : null;

  const nak = typeof lonSid === "number" ? nakFromDegSidereal(lonSid) : null;

  if (process.env.NODE_ENV !== "production") {
    console.log("[moonNow] debug", {
      nowISO: now.toISOString(),
      jdUt,
      ayanamsa: ay,
      lonTrop,
      lonSid,
      nakSid: nak,
    });
  }

  return {
    atISO: now.toISOString(),
    tz,
    lonTrop: typeof lonTrop === "number" ? lonTrop : null,
    lonSid,
    ayanamsa: typeof ay === "number" ? ay : null,
    nakshatra: nak,
  };
}

export async function computeDailyMoonNakshatras(
  birth: DailyMoonBirth,
  days: number
): Promise<DailyMoonRow[]> {
  const constants = await getSweConstants();
  const flagsTropical = constants.SEFLG_SWIEPH;

  // --- Natal (birth) inputs ---
  const natalDateISO = (birth as any).birthDateISO ?? birth.dateISO;
  const natalTime = (birth as any).birthTime ?? birth.time;

  // --- Series (base) inputs ---
  const baseDateISO = (birth as any).baseDateISO ?? birth.dateISO;
  const baseTime = (birth as any).baseTime ?? "12:00"; // keep stable default

  if (!natalDateISO || !natalTime) {
    throw new Error(
      `[dailyMoon] Missing natal birth inputs. natalDateISO=${String(natalDateISO)} natalTime=${String(natalTime)}`
    );
  }

  // 1) Natal Moon sign (sidereal) — reference point for “houseFromMoon”
  const natalUtc = makeUtcInstant(natalDateISO, natalTime, birth.tz);
  const jdNatal = await jdFromUtcDate(natalUtc, constants.SE_GREG_CAL);

  const natalMoonTropRes = await sweCall<any>(
    "swe_calc_ut",
    jdNatal,
    constants.SE_MOON,
    flagsTropical
  );
  const natalMoonLonTrop = extractLongitude(natalMoonTropRes);

  const ayNatal = await sweCall<number>("swe_get_ayanamsa_ut", jdNatal);
  const natalMoonLonSid =
    typeof natalMoonLonTrop === "number"
      ? wrap360(natalMoonLonTrop - ayNatal)
      : null;

  const natalSignIndex =
    typeof natalMoonLonSid === "number" ? Math.floor(natalMoonLonSid / 30) : null;

  if (process.env.NODE_ENV !== "production") {
    console.log("[dailyMoon] inputs", {
      natalDateISO,
      natalTime,
      baseDateISO,
      baseTime,
      tz: birth.tz,
      lat: birth.lat,
      lon: birth.lon,
      horizon: days,
    });
    console.log("[dailyMoon] natalMoon (trop->sid)", {
      jdNatal,
      ayanamsa: ayNatal,
      lonTrop: natalMoonLonTrop,
      lonSid: natalMoonLonSid,
      nakSid:
        typeof natalMoonLonSid === "number" ? nakFromDegSidereal(natalMoonLonSid) : null,
    });
  }

  // 2) Series start date: use baseDateISO
  const startUtcMidnight = parseISOToUtcMidnight(baseDateISO);
  const horizon = Math.max(1, Math.min(Number(days) || 14, 60));

  const out: DailyMoonRow[] = [];

  for (let i = 0; i < horizon; i++) {
    const dayDate = addDaysUTC(startUtcMidnight, i);
    const dayISO = fmtISO(dayDate);

    // Compute UT for (dayISO + baseTime) in tz
    const dayUtc = makeUtcInstant(dayISO, baseTime, birth.tz);
    const jdUt = await jdFromUtcDate(dayUtc, constants.SE_GREG_CAL);

    const moonTropRes = await sweCall<any>(
      "swe_calc_ut",
      jdUt,
      constants.SE_MOON,
      flagsTropical
    );
    const lonTrop = extractLongitude(moonTropRes);

    const ay = await sweCall<number>("swe_get_ayanamsa_ut", jdUt);
    const lonSid = typeof lonTrop === "number" ? wrap360(lonTrop - ay) : null;

    const moonNakshatra =
      typeof lonSid === "number" ? nakFromDegSidereal(lonSid) : null;

    let houseFromMoon: number | null = null;
    if (typeof lonSid === "number" && typeof natalSignIndex === "number") {
      const signIndex = Math.floor(lonSid / 30);
      const rel = (signIndex - natalSignIndex + 12) % 12;
      houseFromMoon = rel + 1;
    }

    if (process.env.NODE_ENV !== "production" && i < 2) {
      console.log("[dailyMoon] day debug (trop->sid)", {
        i,
        dayISO,
        baseTime,
        tz: birth.tz,
        dayUtcInstant: dayUtc.toISOString(),
        jdUt,
        ayanamsa: ay,
        lonTrop,
        lonSid,
        nakSid: moonNakshatra,
      });
    }

    out.push({
      dateISO: dayISO,
      moonNakshatra,
      houseFromMoon,
    });
  }

  return out;
}
