// FILE: src/server/astro/life-engine.ts
import "server-only";

import { getFullPanchang } from "@/server/astro/panchang-full";
import { getNakshatra } from "@/server/astro/nakshatra";
import { vimshottariMDTable } from "@/server/astro/vimshottari";
import { julianDayUTC as julianDayUTCV2 } from "@/server/astro-v2/sidereal-time";

import { buildLifeMilestonesFromMD } from "@/server/astro/life-milestones";
import { buildFoodGuidance } from "@/server/astro/food-guide";
import { computeRahuKetuSidereal } from "@/server/astro-v2/nodes";
import { computeAscendant } from "@/server/astro-v2/ascendant";
// ✅ Astro Engine v2 (pure JS ephemeris)
import { computePlacementsV2 } from "@/server/astro-v2/placements";
import { ayanamsaLahiriDegrees } from "@/server/astro-v2/ayanamsa";
import { getWholeSignHouse } from "@/server/astro/houses";
import { DateTime } from "luxon"; // ✅ add near top with other imports
import { astroDebug } from "@/server/astro/debug";
/* -------------------------------------------------------
   BASIC HELPERS
------------------------------------------------------- */

const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

function wrap360(x: number) {
  x = x % 360;
  return x < 0 ? x + 360 : x;
}

function signOfDeg(deg: number) {
  return SIGNS[Math.floor(wrap360(deg) / 30)];
}
function julianDayUTC(dateUtc: Date): number {
  // Uses UTC calendar fields only (no server timezone leakage)
  const Y = dateUtc.getUTCFullYear();
  const M0 = dateUtc.getUTCMonth() + 1; // 1..12
  const D = dateUtc.getUTCDate();

  const h = dateUtc.getUTCHours();
  const min = dateUtc.getUTCMinutes();
  const s = dateUtc.getUTCSeconds();
  const ms = dateUtc.getUTCMilliseconds();

  const dayFrac = (h + min / 60 + (s + ms / 1000) / 3600) / 24;

  let y = Y;
  let m = M0;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  const jd =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    D +
    B -
    1524.5 +
    dayFrac;

  return jd;
}

/* -------------------------------------------------------
   VIMSHOTTARI HELPERS (MD → AD → PD splits)
------------------------------------------------------- */

const VIMSHOTTARI_ORDER = [
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

type VimLord = (typeof VIMSHOTTARI_ORDER)[number];

const VIM_YEARS: Record<VimLord, number> = {
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

/**
 * Split a parent dasha span (MD or AD) into 9 Vimshottari sub-periods.
 */
function buildSubDashaTimeline(
  parentStartISO: string,
  parentEndISO: string,
  startLord: VimLord
) {
  const startIdx = VIMSHOTTARI_ORDER.indexOf(startLord);
  if (startIdx === -1) return [];

  const parentStart = new Date(parentStartISO + "T00:00:00Z");
  const parentEnd = new Date(parentEndISO + "T00:00:00Z");
  const totalMs = parentEnd.getTime() - parentStart.getTime();
  if (!Number.isFinite(totalMs) || totalMs <= 0) return [];

  const rows: Array<{ planet: VimLord; startISO: string; endISO: string }> = [];
  let cursor = parentStart.getTime();

  for (let i = 0; i < VIMSHOTTARI_ORDER.length; i++) {
    const lord = VIMSHOTTARI_ORDER[(startIdx + i) % VIMSHOTTARI_ORDER.length];
    const weight = VIM_YEARS[lord];
    const spanMs = (totalMs * weight) / 120;

    const segStart = cursor;
    let segEnd = segStart + spanMs;

    if (i === VIMSHOTTARI_ORDER.length - 1) {
      segEnd = parentEnd.getTime();
    }

    rows.push({
      planet: lord,
      startISO: new Date(segStart).toISOString().slice(0, 10),
      endISO: new Date(segEnd).toISOString().slice(0, 10),
    });

    cursor = segEnd;
  }

  return rows;
}

/* -------------------------------------------------------
   TIME HELPERS
------------------------------------------------------- */

function parseGmtOffsetMinutes(label: string): number | undefined {
  // Handles "GMT+05:30", "UTC+05:30", "GMT+0530"
  const m = /(?:GMT|UTC)([+-]\d{1,2})(?::?(\d{2}))?/.exec(label);
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



function makeUtcInstant(dateISO: string, time: string, tz: string): Date {
  // Luxon handles GMT offsets + DST correctly
  const dt = DateTime.fromISO(`${dateISO}T${time}`, { zone: tz });
  if (!dt.isValid) {
    throw new Error(`Invalid date/time/tz: ${dateISO} ${time} ${tz} (${dt.invalidReason ?? "unknown"})`);
  }
  return dt.toUTC().toJSDate();
}

function dateISOInTz(tz: string, d = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);

  const y = parts.find((p) => p.type === "year")?.value ?? "1970";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const day = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${y}-${m}-${day}`;
}

function timeHHMMInTz(tz: string, d = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);

  const hh = parts.find((p) => p.type === "hour")?.value ?? "12";
  const mm = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${hh}:${mm}`;
}

/* -------------------------------------------------------
   PLANETS (ASTRO ENGINE V2)
------------------------------------------------------- */

function buildPlanetsFromV2(whenISO: string) {
  const out: any[] = [];

  const nakSpan = 360 / 27; // 13°20'
  const padaSpan = nakSpan / 4; // 3°20'

  // 1) Sun..Pluto from Astro v2
  const rows = computePlacementsV2(whenISO);

  for (const row of rows) {
    const lon = wrap360(row.siderealLon);

    const sign = signOfDeg(lon);
    const nak = getNakshatra(lon);

    const posInNak = ((lon % nakSpan) + nakSpan) % nakSpan;
    const pada = Math.floor(posInNak / padaSpan) + 1;

    out.push({
      name: row.key,
      siderealLongitude: lon,
      sign,
      nakshatra: nak.name,
      nakshatraMeta: nak,
      pada,
    });
  }

  // 2) Rahu/Ketu from real node (v2)
  const { rahuSid, ketuSid } = computeRahuKetuSidereal(whenISO);

  for (const node of [
    { name: "Rahu", lon: rahuSid },
    { name: "Ketu", lon: ketuSid },
  ]) {
    const lon = wrap360(node.lon);
    const nak = getNakshatra(lon);
    const posInNak = ((lon % nakSpan) + nakSpan) % nakSpan;
    const pada = Math.floor(posInNak / padaSpan) + 1;

    out.push({
      name: node.name,
      siderealLongitude: lon,
      sign: signOfDeg(lon),
      nakshatra: nak.name,
      nakshatraMeta: nak,
      pada,
    });
  }

  // Optional: debug Moon boundary
  const moon = out.find((p) => p.name === "Moon");
  if (moon) {
    astroDebug("[life-engine] MOON siderealLon:", moon.siderealLongitude, "nak:", moon.nakshatra);
  }

  return out;
}

/* -------------------------------------------------------
   VEDIC GRAHA DRISHTI (HOUSE-BASED)
------------------------------------------------------- */

function computeAspects(planets: any[]) {
  const out: any[] = [];

  const hasHouse = (p: any): p is any & { house: number } =>
    typeof p?.house === "number" && p.house >= 1 && p.house <= 12;

  const all = planets.filter(hasHouse);

  function aspectTypesFor(fromName: string, dist: number): string[] {
    const n = fromName.toLowerCase();
    const types: string[] = [];

    if (dist === 7) types.push("7th aspect");

    if (n === "mars") {
      if (dist === 4) types.push("4th aspect");
      if (dist === 8) types.push("8th aspect");
    } else if (n === "jupiter") {
      if (dist === 5) types.push("5th aspect");
      if (dist === 9) types.push("9th aspect");
    } else if (n === "saturn") {
      if (dist === 3) types.push("3rd aspect");
      if (dist === 10) types.push("10th aspect");
    } else if (n === "rahu" || n === "ketu") {
      if (dist === 3) types.push("3rd aspect (Rahu/Ketu)");
      if (dist === 5) types.push("5th aspect (Rahu/Ketu)");
      if (dist === 9) types.push("9th aspect (Rahu/Ketu)");
      if (dist === 10) types.push("10th aspect (Rahu/Ketu)");
    }

    return types;
  }

  for (const from of all) {
    for (const to of all) {
      if (from === to) continue;

      const dist = ((to.house - from.house + 12) % 12) + 1; // 1..12
      const types = aspectTypesFor(from.name, dist);

      for (const type of types) {
        out.push({
          from: from.name,
          to: to.name,
          type,
          houseDiff: dist,
        });
      }
    }
  }

  return out;
}

/* -------------------------------------------------------
   MAIN ENGINE
------------------------------------------------------- */

export async function buildLifeReport(input: {
  name: string;
  birthDateISO: string; // "1990-01-01"
  birthTime: string; // "14:25"
  birthTz: string; // "Asia/Dubai"
  lat: number;
  lon: number;
}) {
  // ✅ Use the user's timezone for "today" + a real current time for Panchang
  const todayISO = dateISOInTz(input.birthTz);
  const nowHHMM = timeHHMMInTz(input.birthTz);

  const birthUtc = makeUtcInstant(input.birthDateISO, input.birthTime, input.birthTz);

  astroDebug("[TZ DEBUG]", {
  tz: input.birthTz,
  local: `${input.birthDateISO} ${input.birthTime}`,
  birthUtc: birthUtc.toISOString(),
});
astroDebug("[INPUT CHECK]", {
  birthDateISO: input.birthDateISO,
  birthTime: input.birthTime,
  birthTz: input.birthTz,
  lat: input.lat,
  lon: input.lon,
  birthUtcISO: birthUtc.toISOString(),
});



  // --- JD (FIX: you imported julianDayUTCV2 but were calling julianDayUTC)
  const jdUt = julianDayUTC(birthUtc);
astroDebug("[JD CHECK FIXED]", { jdUt, birthUtcISO: birthUtc.toISOString() });

    // ✅ PLANETS: v2
  const birthUtcISO = birthUtc.toISOString();
  const planetsRaw = buildPlanetsFromV2(birthUtcISO);
  

  // ✅ Vargas disabled for now (module not present). v2 fallback handles Asc + houses safely.
  const vargas: any = null;

  // ✅ Ascendant: prefer Swiss/D1 if available, else fallback to v2 ascendant
  let ascDeg: number;
  let ascSign: string;

  const d1 = vargas?.D1;
  if (d1?.ascendantDeg != null && d1?.ascendantSign) {
    ascDeg = wrap360(d1.ascendantDeg);
    ascSign = d1.ascendantSign;
    astroDebug("[ASC] using D1/Swiss", { ascDeg, ascSign });
  } else {
    const ascTropical = computeAscendant(jdUt, input.lat, input.lon);
    const ayanDeg = ayanamsaLahiriDegrees(birthUtc);
    ascDeg = wrap360(ascTropical - ayanDeg);
    ascSign = signOfDeg(ascDeg);
    astroDebug("[ASC] using v2 fallback", { ascTropical, ayanDeg, ascDeg, ascSign });
  }
const ascDegFlipped = wrap360(ascDeg + 180);
astroDebug("[ASC FLIP TEST]", {
  ascDeg,
  ascSign,
  ascDegFlipped,
  ascSignFlipped: signOfDeg(ascDegFlipped),
});
astroDebug("[ASC INPUTS]", {
  lat: input.lat,
  lon: input.lon,
  birthUtcISO: birthUtc.toISOString(),
  jdUt,
});

  // ✅ Whole sign houses
  const houses = Array.from({ length: 12 }, (_, i) => wrap360(ascDeg + i * 30));
  const houseData = { ascDeg, ascSign, houses };

  // ✅ Attach houses
  // ✅ Planets + Whole Sign houses (single source of truth)
const planetsWholeSign = (planetsRaw || []).map((p: any) => {
  const lon =
    typeof p.siderealLongitude === "number"
      ? p.siderealLongitude
      : typeof p.lon === "number"
      ? p.lon
      : typeof p.longitude === "number"
      ? p.longitude
      : null;

  const house =
    typeof lon === "number" && typeof ascDeg === "number"
      ? getWholeSignHouse(lon, ascDeg)
      : null;

  return { ...p, house };
});


  /* 3) Panchang (FIX: don't use birthTime for "today" panchang) */
  const fullPanchang: any = await getFullPanchang({
    dobISO: todayISO,
    tob: nowHHMM,
    place: { tz: input.birthTz, lat: input.lat, lon: input.lon },
  });

  /* 4) Aspects */
  const aspects = computeAspects(planetsWholeSign);

  const moonBirth = (planetsWholeSign ?? []).find(
  (p) => (p.name || "").toLowerCase() === "moon"
);

const moonSid = typeof moonBirth?.siderealLongitude === "number"
  ? moonBirth.siderealLongitude
  : null;

  /* 5) Vimshottari Mahadasha timeline */
  const dashaTimeline = await vimshottariMDTable({
  dateISO: input.birthDateISO,
  time: input.birthTime,
  tz: input.birthTz,
  lat: input.lat,
  lon: input.lon,
  moonSiderealLongitude: moonSid ?? undefined,
});



  const currentMD =
    dashaTimeline.find((row) => row.startISO <= todayISO && todayISO <= row.endISO) || null;

  let currentAD: { planet: VimLord; startISO: string; endISO: string } | null = null;
  let currentPD: { planet: VimLord; startISO: string; endISO: string } | null = null;

  if (currentMD) {
    const adTimeline = buildSubDashaTimeline(
      currentMD.startISO,
      currentMD.endISO,
      currentMD.planet as VimLord
    );

    currentAD = adTimeline.find((row) => row.startISO <= todayISO && todayISO <= row.endISO) || null;

    if (currentAD) {
      const pdTimeline = buildSubDashaTimeline(currentAD.startISO, currentAD.endISO, currentAD.planet);
      currentPD = pdTimeline.find((row) => row.startISO <= todayISO && todayISO <= row.endISO) || null;
    }
  }

  const activePeriods = {
    mahadasha: currentMD
      ? { lord: currentMD.planet, start: currentMD.startISO, end: currentMD.endISO, summary: "" }
      : null,
    antardasha: currentAD
      ? { mahaLord: currentMD?.planet ?? "", subLord: currentAD.planet, start: currentAD.startISO, end: currentAD.endISO }
      : null,
    pratyantardasha: currentPD
      ? { mahaLord: currentMD?.planet ?? "", antarLord: currentAD?.planet ?? "", lord: currentPD.planet, start: currentPD.startISO, end: currentPD.endISO }
      : null,
  };

  /* 6) Life Milestones */
  const lifeMilestones = buildLifeMilestonesFromMD(dashaTimeline, input.birthDateISO);

  /* 8) Food guidance */
  const foodToday = buildFoodGuidance({
    todayISO,
    panchangToday: fullPanchang,
    activePeriods,
    planets: planetsWholeSign,
  } as any);

  astroDebug("[LIFE-ENGINE RUN]", new Date().toISOString());
  astroDebug("[ASC CHECK]", { ascDeg, ascSign });
  astroDebug("[HOUSE DEBUG ASC]", { ascDeg, ascSign });
  return {
    meta: {
      name: input.name,
      birthDateISO: input.birthDateISO,
      birthTime: input.birthTime,
      birthTz: input.birthTz,
      birthLat: input.lat,
      birthLon: input.lon,
    },

    ascDeg: houseData.ascDeg,
    ascSign: houseData.ascSign,
    core: {
      ascDeg: houseData.ascDeg,
      ascSign: houseData.ascSign,
      houses: houseData.houses,
    },

    planets: planetsWholeSign,

    aspects,

    panchang: {
      ...fullPanchang,

      tithiName: fullPanchang.tithiName || fullPanchang.tithi?.name || null,
      yogaName: fullPanchang.yogaName || fullPanchang.yoga?.name || null,
      karanaName: fullPanchang.karanaName || fullPanchang.karana?.name || null,

      moonNakshatraName:
        planetsWholeSign.find((p: any) => p.name === "Moon")?.nakshatra ??

        fullPanchang.moonNakshatraName ??
        fullPanchang.moon?.nakshatraName ??
        null,

      weekday: fullPanchang.weekday || null,
      meanings: fullPanchang.meanings || undefined,

      today: {
        ...fullPanchang,

        tithiName: fullPanchang.tithiName || fullPanchang.tithi?.name || null,

        nakshatraName:
          fullPanchang.nakshatraName ||
          fullPanchang.moonNakshatraName ||
          fullPanchang.moon?.nakshatraName ||
          null,

        yoga: { name: fullPanchang.yogaName || fullPanchang.yoga?.name || null },
        karana: { name: fullPanchang.karanaName || fullPanchang.karana?.name || null },

        sunriseISO:
          fullPanchang.sunriseISO ||
          fullPanchang.sunrise ||
          fullPanchang.sun?.riseISO ||
          fullPanchang.sun?.rise ||
          fullPanchang.sun?.sunrise ||
          fullPanchang.sunTimes?.sunriseISO ||
          fullPanchang.sunTimes?.riseISO ||
          fullPanchang.sunTimes?.sunrise ||
          null,

        sunsetISO:
          fullPanchang.sunsetISO ||
          fullPanchang.sunset ||
          fullPanchang.sun?.setISO ||
          fullPanchang.sun?.set ||
          fullPanchang.sun?.sunset ||
          fullPanchang.sunTimes?.sunsetISO ||
          fullPanchang.sunTimes?.setISO ||
          fullPanchang.sunTimes?.sunset ||
          null,

        // You said you removed moonrise/moonset earlier — keep if you want, but safe here:
        moonriseISO:
          fullPanchang.moonriseISO ||
          fullPanchang.moonrise ||
          fullPanchang.moon?.riseISO ||
          fullPanchang.moon?.rise ||
          fullPanchang.moon?.moonrise ||
          fullPanchang.moonTimes?.moonriseISO ||
          fullPanchang.moonTimes?.riseISO ||
          fullPanchang.moonTimes?.moonrise ||
          null,

        moonsetISO:
          fullPanchang.moonsetISO ||
          fullPanchang.moonset ||
          fullPanchang.moon?.setISO ||
          fullPanchang.moon?.set ||
          fullPanchang.moon?.moonset ||
          fullPanchang.moonTimes?.moonsetISO ||
          fullPanchang.moonTimes?.setISO ||
          fullPanchang.moonTimes?.moonset ||
          null,

        rahuKaal:
          fullPanchang.rahuKaal ||
          fullPanchang.rahu ||
          fullPanchang.kaals?.rahu ||
          fullPanchang.kaalWindows?.rahu ||
          null,

        gulikaKaal:
          fullPanchang.gulikaKaal ||
          fullPanchang.gulika ||
          fullPanchang.kaals?.gulika ||
          fullPanchang.kaalWindows?.gulika ||
          null,

        abhijit:
          fullPanchang.abhijit ||
          fullPanchang.kaals?.abhijit ||
          fullPanchang.kaalWindows?.abhijit ||
          null,

        festivals: fullPanchang.festivals || [],
        tip: fullPanchang.tip || null,
      },
    },

    // Keeping this for backward compat if your UI reads it:
    panchangToday: {
      ...fullPanchang,

      tithiName: fullPanchang.tithiName || fullPanchang.tithi?.name || null,

      nakshatraName:
        fullPanchang.nakshatraName ||
        fullPanchang.moonNakshatraName ||
        fullPanchang.moon?.nakshatraName ||
        null,

      yoga: { name: fullPanchang.yogaName || fullPanchang.yoga?.name || null },
      karana: { name: fullPanchang.karanaName || fullPanchang.karana?.name || null },

      sunriseISO:
        fullPanchang.sunriseISO ||
        fullPanchang.sunrise ||
        fullPanchang.sun?.riseISO ||
        fullPanchang.sun?.rise ||
        fullPanchang.sun?.sunrise ||
        fullPanchang.sunTimes?.sunriseISO ||
        fullPanchang.sunTimes?.riseISO ||
        fullPanchang.sunTimes?.sunrise ||
        null,

      sunsetISO:
        fullPanchang.sunsetISO ||
        fullPanchang.sunset ||
        fullPanchang.sun?.setISO ||
        fullPanchang.sun?.set ||
        fullPanchang.sun?.sunset ||
        fullPanchang.sunTimes?.sunsetISO ||
        fullPanchang.sunTimes?.setISO ||
        fullPanchang.sunTimes?.sunset ||
        null,

      moonriseISO:
        fullPanchang.moonriseISO ||
        fullPanchang.moonrise ||
        fullPanchang.moon?.riseISO ||
        fullPanchang.moon?.rise ||
        fullPanchang.moon?.moonrise ||
        fullPanchang.moonTimes?.moonriseISO ||
        fullPanchang.moonTimes?.riseISO ||
        fullPanchang.moonTimes?.moonrise ||
        null,

      moonsetISO:
        fullPanchang.moonsetISO ||
        fullPanchang.moonset ||
        fullPanchang.moon?.setISO ||
        fullPanchang.moon?.set ||
        fullPanchang.moon?.moonset ||
        fullPanchang.moonTimes?.moonsetISO ||
        fullPanchang.moonTimes?.setISO ||
        fullPanchang.moonTimes?.moonset ||
        null,

      rahuKaal:
        fullPanchang.rahuKaal ||
        fullPanchang.rahu ||
        fullPanchang.kaals?.rahu ||
        fullPanchang.kaalWindows?.rahu ||
        null,

      gulikaKaal:
        fullPanchang.gulikaKaal ||
        fullPanchang.gulika ||
        fullPanchang.kaals?.gulika ||
        fullPanchang.kaalWindows?.gulika ||
        null,

      abhijit:
        fullPanchang.abhijit ||
        fullPanchang.kaals?.abhijit ||
        fullPanchang.kaalWindows?.abhijit ||
        null,

      festivals: fullPanchang.festivals || [],
      tip: fullPanchang.tip || null,
    },

    dashaTimeline,
    activePeriods,
    vargas,
    lifeMilestones,
        foodToday,

    version: "sarathi-v1.0",
  };
}
