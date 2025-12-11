// FILE: src/server/astro/transits.ts

import "server-only";
import {
  sweJulday,
  sweCall,
  getSweConstants,
} from "@/server/astro/swe-remote";

export type TransitEngineBirth = {
  dateISO: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  tz: string; // IANA tz, e.g. "Asia/Dubai"
  lat: number;
  lon: number;
};

export type TransitHit = {
  id: string;
  startISO: string;
  endISO: string;
  planet: string; // transiting planet
  target: string; // e.g. "conjunct natal Sun" or "square natal Venus"
  category: "career" | "relationships" | "health" | "inner" | "general";
  strength: number; // 0–1
  title: string;
  description: string;
  // later: scoreBreakdown, whyFacts, etc.
};

// NEW: daily Moon sample for horizon
export type DailyMoonSample = {
  dateISO: string;
  lon: number; // sidereal longitude 0..360
  nakshatra: string; // Moon's nakshatra that day
  houseFromMoon?: number; // 1..12 from natal Moon (Chandra Lagna)
};

/* -------------------------------------------------------
   BASIC DATE / DEGREE HELPERS
-------------------------------------------------------- */

function startOfDay(d: Date): Date {
  const nd = new Date(d.getTime());
  nd.setHours(0, 0, 0, 0);
  return nd;
}

function addDays(d: Date, days: number): Date {
  const nd = new Date(d.getTime());
  nd.setDate(nd.getDate() + days);
  return nd;
}

function fmtISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function wrap360(x: number): number {
  let v = x % 360;
  if (v < 0) v += 360;
  return v;
}

// smallest angular distance between two longitudes, 0..180
function angleDiff(a: number, b: number): number {
  const d = Math.abs(wrap360(a) - wrap360(b));
  return d > 180 ? 360 - d : d;
}

/* -------------------------------------------------------
   TIME → JULIAN DAY HELPERS (same semantics as before)
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

/* -------------------------------------------------------
   REMOTE SWE HELPERS
-------------------------------------------------------- */

function extractLongitude(res: any): number | null {
  if (!res) return null;

  // 1) Direct property
  if (typeof res.longitude === "number") return res.longitude;

  // 2) Bare array [lon, ...]
  if (Array.isArray(res) && typeof res[0] === "number") return res[0];

  // 3) Common embedded arrays
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

async function ensureSiderealMode(constants: any) {
  try {
    if (constants.SE_SIDM_LAHIRI != null) {
      await sweCall(
        "swe_set_sid_mode",
        constants.SE_SIDM_LAHIRI,
        0,
        0
      );
    }
  } catch {
    // best-effort, engine may already be set
  }
}

/* -------------------------------------------------------
   NAKSHATRA LIST FOR MOON DAILY
-------------------------------------------------------- */

const NAKS_27 = [
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

function nakIndexFromDeg(deg: number): number {
  const span = 360 / 27;
  return Math.floor(wrap360(deg) / span);
}

function nakFromDegSidereal(deg: number): string {
  return NAKS_27[nakIndexFromDeg(deg)];
}

/* -------------------------------------------------------
   NATAL & TRANSIT PLANETS (SIDEREAL)
-------------------------------------------------------- */

type NatalPlanet = {
  name: string;
  lon: number; // sidereal longitude 0..360
};

type TransitPlanet = {
  name: string;
  lon: number; // sidereal longitude 0..360
};

/**
 * Compute natal longitudes (sidereal) using the remote engine.
 */
async function computeNatalPlanets(
  birth: TransitEngineBirth,
  constants: any
): Promise<NatalPlanet[]> {
  await ensureSiderealMode(constants);

  const birthUtc = makeUtcInstant(birth.dateISO, birth.time, birth.tz);
  const jdUt = await jdFromDateUTC(birthUtc, constants.SE_GREG_CAL);

  const flags =
    (constants.SEFLG_SWIEPH ?? 2) |
    (constants.SEFLG_SPEED ?? 256) |
    (constants.SEFLG_SIDEREAL ?? 64);

  const defs = [
    { name: "Sun", code: constants.SE_SUN },
    { name: "Moon", code: constants.SE_MOON },
    { name: "Mercury", code: constants.SE_MERCURY },
    { name: "Venus", code: constants.SE_VENUS },
    { name: "Mars", code: constants.SE_MARS },
    { name: "Jupiter", code: constants.SE_JUPITER },
    { name: "Saturn", code: constants.SE_SATURN },
    { name: "Rahu", code: constants.SE_TRUE_NODE },
    { name: "Ketu", code: constants.SE_TRUE_NODE }, // +180°
  ];

  const out: NatalPlanet[] = [];

  for (const p of defs) {
    if (p.code == null) continue;
    const res = await sweCall<any>(
      "swe_calc_ut",
      jdUt,
      p.code,
      flags
    );
    const lonRaw = extractLongitude(res);
    if (typeof lonRaw !== "number" || !isFinite(lonRaw)) continue;

    let lon = wrap360(lonRaw);
    if (p.name === "Ketu") {
      lon = wrap360(lon + 180);
    }
    out.push({ name: p.name, lon });
  }

  return out;
}

/**
 * Transit planets (Sun, Mercury, Venus, Mars, Jupiter, Saturn)
 * for a specific UTC date.
 */
async function computeTransitPlanetsForDay(
  date: Date,
  constants: any
): Promise<TransitPlanet[]> {
  await ensureSiderealMode(constants);

  const jdUt = await jdFromDateUTC(date, constants.SE_GREG_CAL);
  const flags =
    (constants.SEFLG_SWIEPH ?? 2) |
    (constants.SEFLG_SPEED ?? 256) |
    (constants.SEFLG_SIDEREAL ?? 64);

  const defs = [
    { name: "Sun", code: constants.SE_SUN },
    { name: "Mercury", code: constants.SE_MERCURY },
    { name: "Venus", code: constants.SE_VENUS },
    { name: "Mars", code: constants.SE_MARS },
    { name: "Jupiter", code: constants.SE_JUPITER },
    { name: "Saturn", code: constants.SE_SATURN },
  ];

  const out: TransitPlanet[] = [];

  for (const p of defs) {
    if (p.code == null) continue;

    const res = await sweCall<any>(
      "swe_calc_ut",
      jdUt,
      p.code,
      flags
    );
    const lonRaw = extractLongitude(res);
    if (typeof lonRaw !== "number" || !isFinite(lonRaw)) continue;

    const lon = wrap360(lonRaw);
    out.push({ name: p.name, lon });
  }

  return out;
}

/* -------------------------------------------------------
   ASPECT DETECTION (Hybrid Vedic + Western degree aspects)
-------------------------------------------------------- */

type AspectKind =
  | "conjunction"
  | "opposition"
  | "trine"
  | "square"
  | "sextile";

type AspectHit = {
  aspect: AspectKind;
  exactDiff: number; // degrees off exact aspect
  strength: number; // 0..1 basic
};

const ASPECT_DEFS: {
  aspect: AspectKind;
  angle: number;
  orb: number;
}[] = [
  { aspect: "conjunction", angle: 0, orb: 6 },
  { aspect: "opposition", angle: 180, orb: 6 },
  { aspect: "trine", angle: 120, orb: 5 },
  { aspect: "square", angle: 90, orb: 4 },
  { aspect: "sextile", angle: 60, orb: 3 },
];

function detectAspect(
  transitLon: number,
  natalLon: number
): AspectHit | null {
  const diff = angleDiff(transitLon, natalLon);
  let best: AspectHit | null = null;

  for (const def of ASPECT_DEFS) {
    const delta = Math.abs(diff - def.angle);
    if (delta <= def.orb) {
      const base =
        def.aspect === "conjunction"
          ? 1
          : def.aspect === "opposition"
          ? 0.9
          : def.aspect === "trine"
          ? 0.85
          : def.aspect === "square"
          ? 0.8
          : 0.7;
      const proximity = 1 - delta / def.orb; // 1 at exact, 0 at edge
      const strength = Math.max(0.1, base * (0.6 + 0.4 * proximity));

      if (!best || strength > best.strength) {
        best = { aspect: def.aspect, exactDiff: delta, strength };
      }
    }
  }

  return best;
}

/* -------------------------------------------------------
   CATEGORY CLASSIFIER (high-level, by transit planet)
-------------------------------------------------------- */

type TransitCategory =
  | "career"
  | "relationships"
  | "health"
  | "inner"
  | "general";

function classifyCategory(
  transitName: string,
  natalName: string
): TransitCategory {
  const t = transitName.toLowerCase();
  const n = natalName.toLowerCase();

  if (t === "jupiter" || (t === "sun" && n !== "moon")) {
    return "career";
  }
  if (t === "saturn") {
    if (n === "moon" || n === "sun") return "health";
    return "inner";
  }
  if (t === "venus" || n === "venus" || n === "moon") {
    return "relationships";
  }
  if (t === "mars") {
    if (n === "moon" || n === "ascendant") return "health";
    return "career";
  }
  if (t === "mercury") {
    return "general";
  }
  return "general";
}

/* -------------------------------------------------------
   CORE: BUILD RAW DAILY HITS FOR HORIZON (for transits)
-------------------------------------------------------- */

type RawDailyHit = {
  dateISO: string;
  transitPlanet: string;
  natalPlanet: string;
  aspect: AspectKind;
  category: TransitCategory;
  strength: number;
};

async function buildRawDailyHits(
  birth: TransitEngineBirth,
  horizonDays: number
): Promise<RawDailyHit[]> {
  const constants = await getSweConstants();
  const natal = await computeNatalPlanets(birth, constants);

  const today = startOfDay(new Date());
  const horizon = Math.max(7, Math.min(horizonDays, 730)); // clamp

  const hits: RawDailyHit[] = [];

  for (let i = 0; i < horizon; i++) {
    const day = addDays(today, i);
    const dateISO = fmtISO(day);

    const tPlanets = await computeTransitPlanetsForDay(
      day,
      constants
    );

    for (const tp of tPlanets) {
      for (const np of natal) {
        const asp = detectAspect(tp.lon, np.lon);
        if (!asp) continue;

        const category = classifyCategory(tp.name, np.name);

        hits.push({
          dateISO,
          transitPlanet: tp.name,
          natalPlanet: np.name,
          aspect: asp.aspect,
          category,
          strength: asp.strength,
        });
      }
    }
  }

  return hits;
}

/* -------------------------------------------------------
   MOON DAILY PATH (nakshatra + house from natal Moon)
-------------------------------------------------------- */

export async function computeDailyMoonForHorizon(
  birth: TransitEngineBirth,
  horizonDays: number
): Promise<DailyMoonSample[]> {
  const constants = await getSweConstants();
  await ensureSiderealMode(constants);

  const natal = await computeNatalPlanets(birth, constants);
  const natalMoon = natal.find((p) => p.name === "Moon") || null;

  const today = startOfDay(new Date());
  const horizon = Math.max(7, Math.min(horizonDays, 730)); // clamp

  const flags =
    (constants.SEFLG_SWIEPH ?? 2) |
    (constants.SEFLG_SPEED ?? 256) |
    (constants.SEFLG_SIDEREAL ?? 64);

  const out: DailyMoonSample[] = [];

  for (let i = 0; i < horizon; i++) {
    const day = addDays(today, i);
    const dateISO = fmtISO(day);

    const jdUt = await jdFromDateUTC(day, constants.SE_GREG_CAL);
    const res = await sweCall<any>(
      "swe_calc_ut",
      jdUt,
      constants.SE_MOON,
      flags
    );

    const lonRaw = extractLongitude(res);
    if (typeof lonRaw !== "number" || !isFinite(lonRaw)) continue;

    const lon = wrap360(lonRaw);
    const nakshatra = nakFromDegSidereal(lon);

    let houseFromMoon: number | undefined = undefined;
    if (natalMoon) {
      const rel = wrap360(lon - natalMoon.lon); // 0–360 from natal Moon
      houseFromMoon = Math.floor(rel / 30) + 1; // 1..12
    }

    out.push({
      dateISO,
      lon,
      nakshatra,
      houseFromMoon,
    });
  }

  return out;
}

/* -------------------------------------------------------
   WINDOW BUILDER – MERGE DAILY HITS INTO WINDOWS
-------------------------------------------------------- */

type WindowAccumulator = {
  category: TransitCategory;
  planet: string; // transiting planet
  startISO: string;
  endISO: string;
  maxStrength: number;
  hits: RawDailyHit[];
};

function daysBetweenISO(a: string, b: string): number {
  const d1 = new Date(a + "T00:00:00Z").getTime();
  const d2 = new Date(b + "T00:00:00Z").getTime();
  return Math.round((d2 - d1) / 86_400_000);
}

function buildWindowsFromHits(hits: RawDailyHit[]): TransitHit[] {
  if (!hits.length) return [];

  // Sort by date
  hits.sort((a, b) =>
    a.dateISO < b.dateISO ? -1 : a.dateISO > b.dateISO ? 1 : 0
  );

  const windows: WindowAccumulator[] = [];

  const MAX_GAP_DAYS = 5; // merge hits if they are close in time

  for (const h of hits) {
    const keyCat = h.category;
    const keyPlanet = h.transitPlanet;

    let attached = false;

    for (const w of windows) {
      if (w.category !== keyCat) continue;
      if (w.planet !== keyPlanet) continue;

      const gap = daysBetweenISO(w.endISO, h.dateISO);
      if (gap >= 0 && gap <= MAX_GAP_DAYS) {
        // extend window
        if (h.dateISO > w.endISO) {
          w.endISO = h.dateISO;
        }
        w.maxStrength = Math.max(w.maxStrength, h.strength);
        w.hits.push(h);
        attached = true;
        break;
      }
    }

    if (!attached) {
      windows.push({
        category: keyCat,
        planet: keyPlanet,
        startISO: h.dateISO,
        endISO: h.dateISO,
        maxStrength: h.strength,
        hits: [h],
      });
    }
  }

  // Convert accumulators → TransitHit[]
  const out: TransitHit[] = windows.map((w, idx) => {
    // Pick a representative hit (strongest)
    const strongest = w.hits.reduce(
      (best, cur) => (cur.strength > best.strength ? cur : best),
      w.hits[0]
    );

    const target = `${strongest.aspect} natal ${strongest.natalPlanet}`;
    const id = `win-${idx}-${w.planet.toLowerCase()}-${w.category}`;

    const title = buildWindowTitle(w.category, w.planet, strongest);
    const description = buildWindowDescription(w, strongest);

    return {
      id,
      startISO: w.startISO,
      endISO: w.endISO,
      planet: w.planet,
      target,
      category: w.category,
      strength: Math.min(1, w.maxStrength),
      title,
      description,
    };
  });

  // Sort by start date
  out.sort((a, b) =>
    a.startISO < b.startISO ? -1 : a.startISO > b.startISO ? 1 : 0
  );

  return out;
}

/* -------------------------------------------------------
   WINDOW TITLES & DESCRIPTIONS (HIGH-LEVEL TEMPLATES)
-------------------------------------------------------- */

function buildWindowTitle(
  category: TransitCategory,
  planet: string,
  h: RawDailyHit
): string {
  const p = planet;
  switch (category) {
    case "career":
      return `${p} boost for career & direction`;
    case "relationships":
      return `${p} focus on relationships & harmony`;
    case "health":
      return `${p} tests for health & routines`;
    case "inner":
      return `${p} phase of inner work & reflection`;
    case "general":
    default:
      return `${p} general life activation`;
  }
}

function buildWindowDescription(
  w: WindowAccumulator,
  strongest: RawDailyHit
): string {
  const { category, planet } = w;
  const { natalPlanet, aspect } = strongest;

  const range =
    w.startISO === w.endISO
      ? w.startISO
      : `${w.startISO} → ${w.endISO}`;

  const coreLine = (() => {
    const aspWord =
      aspect === "conjunction"
        ? "aligns with"
        : aspect === "opposition"
        ? "faces"
        : aspect === "trine"
        ? "flows with"
        : aspect === "square"
        ? "challenges"
        : "supports";

    return `${planet} ${aspWord} your natal ${natalPlanet}, activating this area from ${range}.`;
  })();

  if (category === "career") {
    return [
      coreLine,
      "This window can bring shifts in work, responsibilities, visibility or long-term direction.",
      "Use it for steady effort, learning, networking and conscious choices about your path.",
    ].join(" ");
  }

  if (category === "relationships") {
    return [
      coreLine,
      "Relationships, partnerships or key one-to-one dynamics may feel more highlighted now.",
      "Communicate with patience and openness; this is a good time to strengthen or rebalance bonds.",
    ].join(" ");
  }

  if (category === "health") {
    return [
      coreLine,
      "Energy levels, routines and stress management are important themes in this phase.",
      "Prioritise rest, boundaries and simple, sustainable habits to support your body.",
    ].join(" ");
  }

  if (category === "inner") {
    return [
      coreLine,
      "Inner processing, questions of meaning and emotional or spiritual growth come into focus.",
      "Gentle reflection, journaling or contemplative practices can help you integrate this period.",
    ].join(" ");
  }

  // general
  return [
    coreLine,
    "Multiple life areas may be gently activated; stay observant and make mindful adjustments where needed.",
  ].join(" ");
}

/* -------------------------------------------------------
   PUBLIC API – USED BY /api/transits
-------------------------------------------------------- */

export async function computeTransitWindows(
  birth: TransitEngineBirth,
  horizonDays: number
): Promise<TransitHit[]> {
  if (!horizonDays || horizonDays <= 0) return [];

  try {
    const raw = await buildRawDailyHits(birth, horizonDays);
    if (!raw.length) return [];

    const windows = buildWindowsFromHits(raw);
    return windows;
  } catch (e) {
    console.error("[transits] computeTransitWindows failed", e);
    return [];
  }
}
