// src/server/astro/navamsa.ts
import { PLANET_NAMES } from "./nakshatra";

/* ---------- basics ---------- */
function norm360(x: number) {
  let v = x % 360;
  return v < 0 ? v + 360 : v;
}

export const SIGN_NAMES = [
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

/** D1 sign + in-sign degrees for a longitude */
export function signOf(deg: number) {
  const n = norm360(deg);
  const sign = Math.floor(n / 30);
  const inSign = n - sign * 30;
  return { sign, signName: SIGN_NAMES[sign], deg: inSign };
}

/**
 * Compute Navamsha (D9) sign/degree for a given ecliptic longitude.
 * Rule:
 * - Movable (0,3,6,9): sequence starts from same sign
 * - Fixed   (1,4,7,10): starts from 9th from sign
 * - Dual    (2,5,8,11): starts from 5th from sign
 */
export function navamsaOf(deg: number) {
  const base = signOf(deg);
  const step = 30 / 9; // 3°20' = 3.333...°
  const which = Math.floor(base.deg / step); // 0..8

  const s = base.sign;
  let start = s; // movable
  if (s === 1 || s === 4 || s === 7 || s === 10) start = (s + 8) % 12; // fixed → 9th
  if (s === 2 || s === 5 || s === 8 || s === 11) start = (s + 4) % 12; // dual  → 5th

  const d9Sign = (start + which) % 12;
  const d9Deg = (base.deg - which * step) * 9; // scale 3.333..° → 30°

  return { sign: d9Sign, signName: SIGN_NAMES[d9Sign], deg: d9Deg };
}

/* ---------- lightweight insights for UI ---------- */

const SIGN_TRAITS: Record<string, string> = {
  Aries: "direct, bold, self-led",
  Taurus: "grounded, steady, pleasure-seeking",
  Gemini: "curious, conversational, adaptable",
  Cancer: "nurturing, protective, intuitive",
  Leo: "expressive, dignified, magnanimous",
  Virgo: "precise, analytical, service-minded",
  Libra: "harmonizing, aesthetic, relational",
  Scorpio: "intense, investigative, transforming",
  Sagittarius: "philosophical, exploratory, candid",
  Capricorn: "ambitious, dutiful, enduring",
  Aquarius: "innovative, principled, future-focused",
  Pisces: "compassionate, imaginative, devotional",
};

function trait(signName: string) {
  return SIGN_TRAITS[signName] ?? "expressive";
}

/**
 * Build a few readable Navamsha highlights.
 * Expects natal: { planets: Record<number, number> }
 */
export function buildNavamshaInsights(natal: { planets: Record<number, number> } | any) {
  const pl = natal?.planets || {};
  const rows: string[] = [];

  // Venus & Jupiter in D9 (partnership / dharma)
  if (typeof pl[3] === "number") {
    const v9 = navamsaOf(pl[3]);
    rows.push(`Venus D9 → ${v9.signName} (${trait(v9.signName)}).`);
  }
  if (typeof pl[5] === "number") {
    const j9 = navamsaOf(pl[5]);
    rows.push(`Jupiter D9 → ${j9.signName} (${trait(j9.signName)}).`);
  }

  // Atmakaraka (max longitude in sign among 7 classical planets)
  const AK_CANDIDATES = [0, 1, 2, 3, 4, 5, 6]; // Sun..Saturn
  let akPlanet = null as null | number;
  let akLong = -1;
  for (const p of AK_CANDIDATES) {
    const v = pl[p];
    if (typeof v !== "number") continue;
    const within = signOf(v).deg; // 0..30 within sign
    if (within > akLong) {
      akLong = within;
      akPlanet = p;
    }
  }

  let atmaKaraka: null | { planet: string; sign: string; desc: string } = null;
  if (akPlanet != null) {
    const d9 = navamsaOf(pl[akPlanet]);
    atmaKaraka = {
      planet: PLANET_NAMES[akPlanet] || `#${akPlanet}`,
      sign: d9.signName,
      desc: trait(d9.signName),
    };
    rows.push(`Atmakaraka (${atmaKaraka.planet}) D9 → ${atmaKaraka.sign} (${atmaKaraka.desc}).`);
  }

  // Venus sign string (for convenient display in relationships)
  let venusSign: string | undefined;
  if (typeof pl[3] === "number") {
    venusSign = navamsaOf(pl[3]).signName;
  }

  return {
    lines: rows,
    atmaKaraka,
    venusSign,
  };
}

/* ---------- D1 → D9 table ---------- */

export function buildD9Table(natal: { planets: Record<number, number> } | any) {
  const include = new Set([0, 1, 2, 3, 4, 5, 6, 7, -1]); // Sun..Saturn, Rahu, Ketu
  const rows: { planet: string; d1Sign: string; d1Deg: number; d9Sign: string; d9Deg: number }[] =
    [];

  for (const [k, v] of Object.entries(natal?.planets || {})) {
    const code = Number(k);
    const lon = Number(v);
    if (!include.has(code) || !Number.isFinite(lon)) continue;

    const pName = PLANET_NAMES[code] || `#${code}`;
    const d1 = signOf(lon);
    const d9 = navamsaOf(lon);

    rows.push({
      planet: pName,
      d1Sign: d1.signName,
      d1Deg: d1.deg,
      d9Sign: d9.signName,
      d9Deg: d9.deg,
    });
  }

  const order = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  rows.sort((a, b) => order.indexOf(a.planet) - order.indexOf(b.planet));

  return rows;
}
