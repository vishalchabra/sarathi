// FILE: src/server/astro/placements.ts
import "server-only";
import { getAscendant } from "@/server/astro/asc";
import {
  calculateLunarNodesAtDate,
  resolveNodeMode,
  type NodeMode,
} from "@/server/astro/lunarNodes";
import { DateTime } from "luxon";
import {
  sweJulday,
  sweCall,
  getSweConstants,
} from "@/server/astro/swe-remote";

export type BirthInput = {
  dateISO: string;
  time: string;
  tz: string;
  lat: number;
  lon: number;
};

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
] as const;

const PLANETS = [
  { name: "Sun", key: "SE_SUN" as const },
  { name: "Moon", key: "SE_MOON" as const },
  { name: "Mercury", key: "SE_MERCURY" as const },
  { name: "Venus", key: "SE_VENUS" as const },
  { name: "Mars", key: "SE_MARS" as const },
  { name: "Jupiter", key: "SE_JUPITER" as const },
  { name: "Saturn", key: "SE_SATURN" as const },

];

function toUTC(b: BirthInput): Date {
  return DateTime.fromISO(`${b.dateISO}T${b.time}`, { zone: b.tz })
    .toUTC()
    .toJSDate();
}
function norm360(x: number) {
  let v = x % 360;
  return v < 0 ? v + 360 : v;
}
function signFromDeg(lon: number) {
  const i = Math.floor(norm360(lon) / 30);
  return SIGNS[i] ?? "—";
}

export async function computePlacements(
  birth: BirthInput,
  requestedNodeMode: NodeMode = "mean"
) {
  const nodeMode = resolveNodeMode(requestedNodeMode);
  const constants = await getSweConstants();

  const d = toUTC(birth);
  const ut =
    d.getUTCHours() +
    d.getUTCMinutes() / 60 +
    d.getUTCSeconds() / 3600;

  const jd = await sweJulday(
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    ut,
    constants.SE_GREG_CAL
  );

  // Use the shared natal Ascendant for whole-sign houses.
  const asc = await getAscendant(birth);

  if (
    !asc ||
    typeof asc.lon !== "number" ||
    !Number.isFinite(asc.lon)
  ) {
    throw new Error("Ascendant calculation failed.");
  }

  const ascSid = norm360(asc.lon);
  const ascIdx = Math.floor(ascSid / 30);

  // Preserve the existing planetary longitude conversion.
  const ayan =
    (await sweCall<number>("swe_get_ayanamsa_ut", jd)) ?? 0;

  // sidereal flags
  const flags =
    (constants.SEFLG_SWIEPH ?? 2) |
    (constants.SEFLG_SIDEREAL ?? 64) |
    (constants.SEFLG_SPEED ?? 256);


  const out: Array<{
  planet: string;
  sign: string;
  house: number | null;
  degree: number;
  lon: number;
  speed?: number | null;
  speedLon?: number | null;
  retrograde?: boolean;
}> = [];

  for (const P of PLANETS) {
    const pid = (constants as any)[P.key] as number | undefined;
    if (pid == null) continue;

    const res = await sweCall<any>("swe_calc_ut", jd, pid, flags);

    let lonTrop =
  typeof res?.longitude === "number"
    ? res.longitude
    : Array.isArray(res?.x) && typeof res.x[0] === "number"
    ? res.x[0]
    : NaN;

if (isNaN(lonTrop)) continue;

let speedLon =
  typeof res?.speedLon === "number"
    ? res.speedLon
    : typeof res?.speed === "number"
    ? res.speed
    : Array.isArray(res?.x) && typeof res.x[3] === "number"
    ? res.x[3]
    : null;

// 👉 FIX MOON SPEED
if (P.name === "Moon" && speedLon === null) {
  speedLon = 13.176; // average daily motion
}

// convert tropical -> sidereal
const lonSid = norm360(lonTrop - ayan);



const sign = signFromDeg(lonSid);
const degree = lonSid % 30;
let house: number | null = null;

if (ascIdx != null) {
  const signIdx = Math.floor(lonSid / 30);
  house = ((signIdx - ascIdx + 12) % 12) + 1; // 1..12
}

out.push({
  planet: P.name,
  sign,
  house,
  degree,
  lon: lonSid,
  speed: speedLon,
  speedLon,
  retrograde: typeof speedLon === "number" ? speedLon < 0 : false,
});
  }

  // Canonical Lahiri Rahu and Ketu
  const nodes = await calculateLunarNodesAtDate(
    d,
    nodeMode
  );

  for (const node of [
    { planet: "Rahu", lon: nodes.rahuLonSid },
    { planet: "Ketu", lon: nodes.ketuLonSid },
  ]) {
    const lon = node.lon;
    const signIdx = Math.floor(lon / 30);

    out.push({
      planet: node.planet,
      sign: signFromDeg(lon),
      house:
        ascIdx == null
          ? null
          : ((signIdx - ascIdx + 12) % 12) + 1,
      degree: lon % 30,
      lon,
      speed: nodes.speedLon,
      speedLon: nodes.speedLon,
      retrograde: nodes.retrograde,
    });
  }

  return out;
}

export default computePlacements;
