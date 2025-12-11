export const runtime = "nodejs"; // keep server-only

import "server-only";
import path from "node:path";
import { DateTime } from "luxon";
import type { Place, BirthInput } from "@/types";
import { createRequire } from "module";
// Temporary no-op; Swiss is already configured sidereal elsewhere.
function ensureSidereal(): void {
  // Intentionally empty
}
// Temporary no-op; ephemeris path is already set at process level or elsewhere.
function setEphePath(): void {
  // Intentionally empty
}

const require = createRequire(import.meta.url);

// Public shape used elsewhere
export type TransitPoint = { date: string; signal: number; facts?: string[] };

/* =========================
   Synthetic fallback (always works)
========================= */
async function syntheticSignals(
  startISO: string,
  horizonDays: number,
  place: Place,
  topic: "vehicle" | "property" | "job" | "wealth" | "health" | "relationship"
): Promise<TransitPoint[]> {
  const start = DateTime.fromISO(startISO).setZone(place.tz ?? "UTC");
  const arr: TransitPoint[] = [];
  for (let i = 0; i < horizonDays; i++) {
    const phase = Math.sin((i / Math.max(12, horizonDays / 4)) * Math.PI);
    const bias = topic === "vehicle" || topic === "property" ? 0.15 : 0.1;
    const sig = Math.max(0, phase) + bias;
    arr.push({
      date: start.plus({ days: i }).toISODate()!,
      signal: Math.min(1, sig),
      facts: [`Synthetic ${topic} favorability ~${Math.round(sig * 100)}%`],
    });
  }
  return arr;
}

/* =========================
   Swiss loader (safe)
========================= */
let _swe: any | null = null;
function getSwe() {
  if (_swe) return _swe;
try {
  // Node-style require; typed as any so TS doesn't complain
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  _swe = (require as any)("swisseph");
  return _swe;
} catch {
  return null;
}

}
  
/* =========================
   Small helpers
========================= */
function normDeg(x: number) {
  let v = x % 360;
  return v < 0 ? v + 360 : v;
}
function diffDeg(a: number, b: number) {
  let d = Math.abs(normDeg(a) - normDeg(b));
  return d > 180 ? 360 - d : d;
}
function withinOrb(delta: number, orb = 2) {
  return Math.max(0, 1 - delta / orb);
}
function signIndex(deg: number) {
  return Math.floor(normDeg(deg) / 30); // 0..11
}
const RULERS: Record<number, number> = {
  0: 4,  // Aries → Mars
  1: 3,  // Taurus → Venus
  2: 2,  // Gemini → Mercury
  3: 1,  // Cancer → Moon
  4: 0,  // Leo → Sun
  5: 2,  // Virgo → Mercury
  6: 3,  // Libra → Venus
  7: 4,  // Scorpio → Mars
  8: 5,  // Sagittarius → Jupiter
  9: 6,  // Capricorn → Saturn
  10: 6, // Aquarius → Saturn
  11: 5, // Pisces → Jupiter
};
function dignityBoost(planet: number, lon: number) {
  const ruler = RULERS[signIndex(lon)];
  return planet === ruler ? 0.1 : 0;
}

// REPLACE your existing siderealLon with this:
function siderealLon(utc: Date, planet: number): number | null {
  const swe = await getSwe();
  if (!swe) return null;
  try {
    // Always set sidereal mode (Lahiri) before each calc
    try { swe.swe_set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0); } catch {}

    const jd = swe.swe_julday(
      utc.getUTCFullYear(),
      utc.getUTCMonth() + 1,
      utc.getUTCDate(),
      12.0,
      swe.SE_GREG_CAL
    );

    // Use MOSEPH so no ephemeris data files are required
    const flags = swe.SEFLG_SIDEREAL | swe.SEFLG_MOSEPH;
    const r = swe.swe_calc_ut(jd, planet, flags);
    if (!r || typeof r.longitude !== "number") return null;
    return normDeg(r.longitude);
  } catch {
    return null;
  }
}
/* =========================
   Natal essentials
========================= */
type Natal = { planets: Partial<Record<number, number>> };

async function getNatal(birth?: BirthInput): Promise<Natal> {
  const swe = await getSwe();
  if (!swe || !birth) return { planets: {} };

  const dt = DateTime.fromISO(`${birth.dobISO}T${birth.tob}`, { zone: birth.place.tz }).toUTC();
  const date = dt.toJSDate();

  const PLANETS = [
    swe.SE_SUN, swe.SE_MOON, swe.SE_MERCURY, swe.SE_VENUS,
    swe.SE_MARS, swe.SE_JUPITER, swe.SE_SATURN, swe.SE_TRUE_NODE,
  ];

  const out: Natal = { planets: {} };
  for (const pl of PLANETS) {
    const v = siderealLon(date, pl);
    if (typeof v === "number") out.planets[pl] = v;
  }
  if (out.planets[swe.SE_TRUE_NODE] != null) {
    out.planets[-1] = normDeg((out.planets[swe.SE_TRUE_NODE] as number) + 180); // Ketu
  }
  return out;
}
/* =========================
   Ascendant + house lords (whole-sign)
========================= */
function ascAndHouseLords(birth?: BirthInput) {
  try {
    if (!birth) return null;
// These are your own modules; keep them try/catch
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { computeAscendant, houseSign } = (require as any)("@/server/astro/asc");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SIGN_RULER } = (require as any)("@/server/core/houselords");

const asc = computeAscendant(birth);

    if (!asc || typeof asc.ascSign !== "number") return null;

    const l1 = SIGN_RULER[asc.ascSign];
    const fourth = houseSign(asc.ascSign, 4);
    const tenth  = houseSign(asc.ascSign, 10);
    const l4 = SIGN_RULER[fourth];
    const l10 = SIGN_RULER[tenth];
    return { asc, l1, l4, l10 };
  } catch {
    return null;
  }
}
/* =========================
   Aspects + topic config
========================= */
const ASPECTS = [
  // positive
  { name: "conj",   angle: 0,   orb: 2, weight: 1.0 },
  { name: "trine",  angle: 120, orb: 2, weight: 0.7 },
  { name: "sextile",angle: 60,  orb: 2, weight: 0.5 },
  // negative (new)
  { name: "square", angle: 90,  orb: 2, weight: -0.40 },
  { name: "opp",    angle: 180, orb: 2, weight: -0.60 },
];

function topicConfig(
  topic: string,
  house: ReturnType<typeof ascAndHouseLords>,
  sweRef: any
) {
  if (!sweRef) {
    return {
      targets: [] as { name: string; planet: number; orb: number }[],
      transiting: [] as number[],
    };
  }

  const targets: { name: string; planet: number; orb: number }[] = [];

  // ✅ Always include Lagna lord
  if (house?.l1 != null) {
    targets.push({ name: "Lagna lord natal", planet: house.l1, orb: 2 });
  }

  // ✅ Base karakas
  if (topic === "vehicle") {
    targets.push({ name: "Venus natal (karaka)", planet: sweRef.SE_VENUS, orb: 2 });
  }
  if (topic === "property") {
    targets.push({
      name: "Jupiter natal (home/prosperity)",
      planet: sweRef.SE_JUPITER,
      orb: 2,
    });
  }
  if (topic === "job") {
    targets.push({
      name: "Saturn natal (10th discipline)",
      planet: sweRef.SE_SATURN,
      orb: 2,
    });
  }

  // ✅ House lords
  if (house) {
    if (topic === "vehicle" || topic === "property") {
      targets.push({ name: "4th lord natal", planet: house.l4, orb: 2 });
    }
    if (topic === "job") {
      targets.push({ name: "10th lord natal", planet: house.l10, orb: 2 });
    }
  }

  // ✅ Transiting planets per topic
  let transiting: number[] = [
    sweRef.SE_JUPITER,
    sweRef.SE_VENUS,
    sweRef.SE_MERCURY,
    sweRef.SE_SATURN,
  ];
  if (topic === "job") {
    transiting = [sweRef.SE_SATURN, sweRef.SE_JUPITER, sweRef.SE_MERCURY];
  }
  if (topic === "property") {
    transiting = [sweRef.SE_JUPITER, sweRef.SE_SATURN, sweRef.SE_MARS];
  }
  if (topic === "vehicle") {
    transiting = [sweRef.SE_VENUS, sweRef.SE_JUPITER, sweRef.SE_MERCURY];
  }

  return { targets, transiting };
}
/* =========================
   Public API
========================= */
export async function dailyTransitSignals(
  startISO: string,
  horizonDays: number,
  place: Place,
  topic: "vehicle" | "property" | "job" | "wealth" | "health" | "relationship",
  birth?: BirthInput
): Promise<TransitPoint[]> {
  const swe = await getSwe();

  // Fallback if Swiss unavailable
  if (!swe) return syntheticSignals(startISO, horizonDays, place, topic);

  try {
    ensureSidereal();
    setEphePath();

    const start = DateTime.fromISO(startISO)
      .setZone(place.tz ?? "UTC")
      .startOf("day");

    const natal = await getNatal(birth);
    const house = ascAndHouseLords(birth as any);
    const sweRef = swe;
    const cfg = topicConfig(topic, house, sweRef);

    console.log("[SARATHI DEBUG] swe?", !!sweRef);
    console.log("[SARATHI DEBUG] natal planets keys", Object.keys(natal.planets));
    console.log("[SARATHI DEBUG] targets", cfg.targets.length);
    console.log("[SARATHI DEBUG] transiting", cfg.transiting.length);

    if (
      !cfg.transiting.length ||
      !cfg.targets.length ||
      !Object.keys(natal.planets).length
    ) {
      return syntheticSignals(startISO, horizonDays, place, topic);
    }

    const out: TransitPoint[] = [];

    for (let i = 0; i < horizonDays; i++) {
      const d = start.plus({ days: i }).toUTC().toJSDate();

      // Transit longitudes
      const tLon: Record<number, number> = {};
      for (const pl of cfg.transiting) {
        const v = siderealLon(d, pl);
        if (typeof v === "number") tLon[pl] = v; // only include if Swiss returned a value
      }

      let dayScore = 0;
      const facts: string[] = [];

      // Compare transiting planets to natal targets for supported aspects
      for (const tgt of cfg.targets) {
        const natalLon = natal.planets[tgt.planet];
        if (natalLon == null) continue;

        for (const pl of cfg.transiting) {
          const lon = tLon[pl];
          if (lon == null) continue;

          for (const asp of ASPECTS) {
            const delta = Math.min(
              diffDeg(lon, natalLon + asp.angle),
              diffDeg(lon, natalLon - asp.angle)
            );
            const prox = withinOrb(delta, asp.orb);
            if (prox > 0) {
              let gain = prox * asp.weight;
              gain += dignityBoost(pl, lon);
              dayScore += gain;
              facts.push(
                `${swe.get_planet_name(pl)} ${asp.name} ${swe.get_planet_name(
                  tgt.planet
                )} natal ~Δ${delta.toFixed(2)}°`
              );
            }
          }
        }
      }

      const signal = Math.min(1, dayScore / 3.2); // scale into 0..1
      out.push({
        date: start.plus({ days: i }).toISODate()!,
        signal,
        facts,
      });
    }

    return out;
  } catch {
    // any runtime issue → fallback, not crash
    return syntheticSignals(startISO, horizonDays, place, topic);
  }
}
