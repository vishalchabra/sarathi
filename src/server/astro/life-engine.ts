// FILE: src/server/astro/life-engine.ts
import "server-only";

import { getSwe } from "@/server/astro/swe";
import { getFullPanchang } from "@/server/astro/panchang-full";
import { buildAllVargas } from "@/server/astro/varga";
import { getNakshatra } from "@/server/astro/nakshatra";
import { vimshottariMDTable } from "@/server/astro/vimshottari";
import { AstroConfig } from "@/server/astro/astro-config";
import { buildLifeMilestonesFromMD } from "@/server/astro/life-milestones";
import { buildFoodGuidance, type FoodSuggestion } from "@/server/astro/food-guide";

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

function signIndexFromName(name?: string | null) {
  if (!name) return -1;
  const low = name.toLowerCase();
  return SIGNS.findIndex((s) => s.toLowerCase() === low);
}

/**
 * Attach whole-sign houses from ascendant sign:
 * - Asc sign = House 1
 * - Next sign = House 2, etc.
 */
function attachWholeSignHouses(planets: any[], ascSign?: string | null) {
  const ascIdx = ascSign ? signIndexFromName(ascSign) : -1;
  if (ascIdx < 0) return planets;

  return planets.map((p) => {
    const pIdx = signIndexFromName(p.sign);
    if (pIdx < 0) return p;
    const house = ((pIdx - ascIdx + 12) % 12) + 1; // 1..12
    return { ...p, house };
  });
}

/* -------------------------------------------------------
   PLANET LIST
   (SwissEphemeris numeric codes)
------------------------------------------------------- */

const PLANETS = [
  { name: "Sun", code: 0 },
  { name: "Moon", code: 1 },
  { name: "Mercury", code: 2 },
  { name: "Venus", code: 3 },
  { name: "Mars", code: 4 },
  { name: "Jupiter", code: 5 },
  { name: "Saturn", code: 6 },
  { name: "Rahu", code: 11 }, // True Node
  { name: "Ketu", code: 11 }, // will flip by 180°
];
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
 * We use the proportional rule: each sub-period gets (years(P) / 120) of
 * the parent span in time.
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

  const rows: Array<{
    planet: VimLord;
    startISO: string;
    endISO: string;
  }> = [];

  let cursor = parentStart.getTime();

  for (let i = 0; i < VIMSHOTTARI_ORDER.length; i++) {
    const lord = VIMSHOTTARI_ORDER[(startIdx + i) % VIMSHOTTARI_ORDER.length];
    const weight = VIM_YEARS[lord];
    const spanMs = (totalMs * weight) / 120;

    const segStart = cursor;
    let segEnd = segStart + spanMs;

    // Clamp last segment exactly to parent end to avoid rounding drift
    if (i === VIMSHOTTARI_ORDER.length - 1) {
      segEnd = parentEnd.getTime();
    }

    const startDate = new Date(segStart);
    const endDate = new Date(segEnd);

    rows.push({
      planet: lord,
      startISO: startDate.toISOString().slice(0, 10),
      endISO: endDate.toISOString().slice(0, 10),
    });

    cursor = segEnd;
  }

  return rows;
}

/* -------------------------------------------------------
   TIME / JD HELPERS
------------------------------------------------------- */

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

function makeUtcInstant(dateISO: string, time: string, tz: string): Date {
  const [H, M] = time.split(":").map(Number);

  const pretendUtc = new Date(
    Date.UTC(
      +dateISO.slice(0, 4),
      +dateISO.slice(5, 7) - 1,
      +dateISO.slice(8, 10),
      H,
      M,
      0,
      0
    )
  );

  const off = tzOffsetMinutesAt(tz, pretendUtc);
  return new Date(pretendUtc.getTime() - off * 60_000);
}

function jdFromDate(d: Date, swe: any) {
  return swe.swe_julday(
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600,
    swe.SE_GREG_CAL
  );
}

/* -------------------------------------------------------
   PLANET COMPUTATION (SIDEREAL LAHIRI)
------------------------------------------------------- */

async function computePlanets(jdUt: number) {
  const swe = getSwe();

  // ensure sidereal Lahiri mode
  try {
    if (swe.swe_set_sid_mode) {
      swe.swe_set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);
    }
  } catch {}

  const flags = swe.SEFLG_SWIEPH | swe.SEFLG_SPEED | swe.SEFLG_SIDEREAL;
  const out: any[] = [];

  const nakSpan = 360 / 27; // 13°20'
  const padaSpan = nakSpan / 4; // 3°20'

  for (const p of PLANETS) {
    const r = swe.swe_calc_ut(jdUt, p.code, flags);
    if (!r) continue;

    let lon = wrap360(r.longitude);
    if (p.name === "Ketu") {
      lon = wrap360(lon + 180);
    }

    const sign = signOfDeg(lon);
    const nak = getNakshatra(lon);

    const posInNak = ((lon % nakSpan) + nakSpan) % nakSpan;
    const pada = Math.floor(posInNak / padaSpan) + 1; // 1..4

    out.push({
      name: p.name,
      siderealLongitude: lon,
      sign,
      nakshatra: nak.name,
      nakshatraMeta: nak,
      pada,
    });
  }

  return out;
}

/* -------------------------------------------------------
   HOUSES (ASC + CUSPS) – **SIDEREAL ASC SIGN**
------------------------------------------------------- */

function computeHouses(jdUt: number, lat: number, lon: number) {
  const swe = getSwe();
  const H = swe.swe_houses(jdUt, lat, lon, "P");

  // Ascendant degree from swe_houses is tropical by default
  const ascTrop = wrap360(H.ascendant);

  // Get ayanāṁśa to convert to sidereal
  let ayan = 0;
  try {
    if (typeof (swe as any).swe_get_ayanamsa_ut === "function") {
      ayan = (swe as any).swe_get_ayanamsa_ut(jdUt);
    } else if (AstroConfig && typeof (AstroConfig as any).ayanamsaDeg === "number") {
      ayan = (AstroConfig as any).ayanamsaDeg;
    }
  } catch {
    // fallback ~Lahiri 24°
    ayan = 24;
  }

  const ascSid = wrap360(ascTrop - ayan);
  const ascSign = signOfDeg(ascSid);

  // We don’t really use cusps heavily; keep as-is (tropical degrees)
  const houses = (H.cusps || []).map((d: number) => wrap360(d));

  return { ascDeg: ascSid, ascSign, houses };
}

/* -------------------------------------------------------
   VEDIC GRAHA DRISHTI (HOUSE-BASED)
   - All planets: 7th house
   - Mars: 4th, 7th, 8th
   - Jupiter: 5th, 7th, 9th
   - Saturn: 3rd, 7th, 10th
   - Rahu / Ketu: simple Saturn+Jupiter style (3/5/7/9/10)
------------------------------------------------------- */

function computeAspects(planets: any[]) {
  const out: any[] = [];

  const hasHouse = (p: any): p is any & { house: number } =>
    typeof p?.house === "number" && p.house >= 1 && p.house <= 12;

  const all = planets.filter(hasHouse);

  function aspectTypesFor(fromName: string, dist: number): string[] {
    const n = fromName.toLowerCase();
    const types: string[] = [];

    // everyone aspects the 7th
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
      // 7th handled above
    }

    return types;
  }

  for (const from of all) {
    for (const to of all) {
      if (from === to) continue;

      // house distance counting FROM the planet’s house as 1
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
  const swe = getSwe();
  const todayISO = new Date().toISOString().slice(0, 10);
  const birthUtc = makeUtcInstant(
    input.birthDateISO,
    input.birthTime,
    input.birthTz
  );
  const jdUt = jdFromDate(birthUtc, swe);

  /* 1) Planets (sign, nakshatra, etc.) */
  const planetsRaw = await computePlanets(jdUt);

  /* 2) Houses (now with SIDEREAL asc sign) */
  const houseData = computeHouses(jdUt, input.lat, input.lon);

  /* 2b) Attach whole-sign houses to planets using ascendant sign */
  const planets = attachWholeSignHouses(planetsRaw, houseData.ascSign);

  /* 3) Panchang (your richer engine) */
const fullPanchang: any = await getFullPanchang({
  dobISO: todayISO,  // 👈 use today's date, not birthDateISO
  tob: input.birthTime,
  place: { tz: input.birthTz, lat: input.lat, lon: input.lon },
});


  /* 4) Aspects (Vedic graha dṛṣṭi, house-based) */
  const aspects = computeAspects(planets);

   /* 5) Vimshottari Mahadasha timeline */
  const dashaTimeline = await vimshottariMDTable({
    dateISO: input.birthDateISO,
    time: input.birthTime,
    tz: input.birthTz,
    lat: input.lat,
    lon: input.lon,
  });

  /* Determine current Mahadasha + derive AD & PD */
    const currentMD =
    dashaTimeline.find(
      (row) => row.startISO <= todayISO && todayISO <= row.endISO
    ) || null;

  // Derive current Antardasha (AD) inside the current Mahadasha
  let currentAD:
    | { planet: VimLord; startISO: string; endISO: string }
    | null = null;

  // Derive current Pratyantardasha (PD) inside the current AD
  let currentPD:
    | { planet: VimLord; startISO: string; endISO: string }
    | null = null;

  if (currentMD) {
    const adTimeline = buildSubDashaTimeline(
      currentMD.startISO,
      currentMD.endISO,
      currentMD.planet as VimLord
    );

    currentAD =
      adTimeline.find(
        (row) => row.startISO <= todayISO && todayISO <= row.endISO
      ) || null;

    if (currentAD) {
      const pdTimeline = buildSubDashaTimeline(
        currentAD.startISO,
        currentAD.endISO,
        currentAD.planet
      );

      currentPD =
        pdTimeline.find(
          (row) => row.startISO <= todayISO && todayISO <= row.endISO
        ) || null;
    }
  }

  const activePeriods = {
    mahadasha: currentMD
      ? {
          lord: currentMD.planet,
          start: currentMD.startISO,
          end: currentMD.endISO,
          summary: "",
        }
      : null,
    antardasha: currentAD
      ? {
          mahaLord: currentMD?.planet ?? "",
          subLord: currentAD.planet,
          start: currentAD.startISO,
          end: currentAD.endISO,
        }
      : null,
    pratyantardasha: currentPD
      ? {
          mahaLord: currentMD?.planet ?? "",
          antarLord: currentAD?.planet ?? "",
          lord: currentPD.planet,
          start: currentPD.startISO,
          end: currentPD.endISO,
        }
      : null,
  };

  /* 6) Life Milestones (Narration Engine input) */
  const lifeMilestones = buildLifeMilestonesFromMD(
    dashaTimeline,
    input.birthDateISO
  );

  /* 7) Vargas (D2..D60 etc.) */
  const vargas = await buildAllVargas({
    jdUt,
    lat: input.lat,
    lon: input.lon,
    planets,
  });
   // 🆕 Food guidance for today (using today's Panchang + dashas + planets)
  const foodToday = buildFoodGuidance({
    todayISO,
    panchangToday: fullPanchang,
    activePeriods,
    planets,
  } as any);

   /* FINAL STRUCTURE */
  return {
    meta: {
      name: input.name,
      birthDateISO: input.birthDateISO,
      birthTime: input.birthTime,
      birthTz: input.birthTz,
      birthLat: input.lat,
      birthLon: input.lon,
    },

    core: {
      ascDeg: houseData.ascDeg,
      ascSign: houseData.ascSign,
      houses: houseData.houses,
    },
   
    planets,
    aspects,

    // Normalised Panchang for UI (snapshot + “today”)
    panchang: {
      // keep the full object around in case you need it
      ...fullPanchang,

      // summary fields used by “Panchang Snapshot”
      tithiName:
        fullPanchang.tithiName ||
        fullPanchang.tithi?.name ||
        null,
      yogaName:
        fullPanchang.yogaName ||
        fullPanchang.yoga?.name ||
        null,
      karanaName:
        fullPanchang.karanaName ||
        fullPanchang.karana?.name ||
        null,
      moonNakshatraName:
        fullPanchang.moonNakshatraName ||
        fullPanchang.moon?.nakshatraName ||
        null,
      weekday: fullPanchang.weekday || null,
      meanings: fullPanchang.meanings || undefined,

      // 🆕 “today” sub-block used by Daily Guide Panchang card
      today: {
        // spread full object so nested sun/moon/rahu etc. are available
        ...fullPanchang,

        tithiName:
          fullPanchang.tithiName ||
          fullPanchang.tithi?.name ||
          null,

        nakshatraName:
          fullPanchang.nakshatraName ||
          fullPanchang.moonNakshatraName ||
          fullPanchang.moon?.nakshatraName ||
          null,

        yoga: {
          name:
            fullPanchang.yogaName ||
            fullPanchang.yoga?.name ||
            null,
        },

        karana: {
          name:
            fullPanchang.karanaName ||
            fullPanchang.karana?.name ||
            null,
        },

        // Sun & Moon timings (we support several possible shapes)
        sunriseISO:
  fullPanchang.sunriseISO ||
  fullPanchang.sunrise ||
  fullPanchang.sun?.riseISO ||
  fullPanchang.sun?.rise ||
  fullPanchang.sun?.sunrise ||
  // 👉 common pattern: sunTimes.{sunriseISO | riseISO | sunrise}
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
  // 👉 common pattern: sunTimes.{sunsetISO | setISO | sunset}
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
  // 👉 common pattern: moonTimes.{moonriseISO | riseISO | moonrise}
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
  // 👉 common pattern: moonTimes.{moonsetISO | setISO | moonset}
  fullPanchang.moonTimes?.moonsetISO ||
  fullPanchang.moonTimes?.setISO ||
  fullPanchang.moonTimes?.moonset ||
  null,

        // Kaal windows
        // Kaal windows
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


        // Festivals / vrats + tip if you later add it
        festivals: fullPanchang.festivals || [],
        tip: fullPanchang.tip || null,
      },
    },

    // Mirror “today” at top level so your Daily Guide can also use report.panchangToday
    panchangToday: {
      // mirror full object so TabDailyGuide pt.sun / pt.moon also work
      ...fullPanchang,

      tithiName:
        fullPanchang.tithiName ||
        fullPanchang.tithi?.name ||
        null,

      nakshatraName:
        fullPanchang.nakshatraName ||
        fullPanchang.moonNakshatraName ||
        fullPanchang.moon?.nakshatraName ||
        null,

      yoga: {
        name:
          fullPanchang.yogaName ||
          fullPanchang.yoga?.name ||
          null,
      },

      karana: {
        name:
          fullPanchang.karanaName ||
          fullPanchang.karana?.name ||
          null,
      },

      sunriseISO:
  fullPanchang.sunriseISO ||
  fullPanchang.sunrise ||
  fullPanchang.sun?.riseISO ||
  fullPanchang.sun?.rise ||
  fullPanchang.sun?.sunrise ||
  // 👉 common pattern: sunTimes.{sunriseISO | riseISO | sunrise}
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
  // 👉 common pattern: sunTimes.{sunsetISO | setISO | sunset}
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
  // 👉 common pattern: moonTimes.{moonriseISO | riseISO | moonrise}
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
  // 👉 common pattern: moonTimes.{moonsetISO | setISO | moonset}
  fullPanchang.moonTimes?.moonsetISO ||
  fullPanchang.moonTimes?.setISO ||
  fullPanchang.moonTimes?.moonset ||
  null,


      // Kaal windows
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
