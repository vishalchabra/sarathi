// FILE: src/server/astro/placements.ts
import "server-only";
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
  { name: "Rahu", key: "SE_MEAN_NODE" as const }, // use SE_TRUE_NODE if you prefer
  // Ketu handled after Rahu as opposite point
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

export async function computePlacements(birth: BirthInput) {
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

  // house system just to compute whole-sign house relative to Asc
  const hs = await sweCall<any>(
    "swe_houses",
    jd,
    birth.lat,
    birth.lon,
    "P"
  );

  const ayan =
    (await sweCall<number>("swe_get_ayanamsa_ut", jd)) ?? 0;

  const ascTrop =
    hs?.ascmc?.[0] ??
    hs?.asc ??
    hs?.ascendant ??
    hs?.Asc ??
    NaN;

  const ascSid =
    typeof ascTrop === "number"
      ? norm360(ascTrop - ayan)
      : NaN;

  const ascIdx = isNaN(ascSid)
    ? null
    : Math.floor(ascSid / 30);

  // sidereal flags
  const flags =
    (constants.SEFLG_SWIEPH ?? 2) |
    (constants.SEFLG_SIDEREAL ?? 64) |
    (constants.SEFLG_SPEED ?? 256);

  let rahuLon: number | null = null;
  const out: Array<{
    planet: string;
    sign: string;
    house: number | null;
    degree: number;
    lon: number;
  }> = [];

  for (const P of PLANETS) {
    const pid = (constants as any)[P.key] as number | undefined;
    if (pid == null) continue;

    const res = await sweCall<any>("swe_calc_ut", jd, pid, flags);

    let lon =
      typeof res?.longitude === "number"
        ? res.longitude
        : Array.isArray(res?.x) && typeof res.x[0] === "number"
        ? res.x[0]
        : NaN;

    if (isNaN(lon)) continue;

    lon = norm360(lon);
    if (P.name === "Rahu") rahuLon = lon;

    const sign = signFromDeg(lon);
    const degree = lon % 30;
    let house: number | null = null;

    if (ascIdx != null) {
      const signIdx = Math.floor(lon / 30);
      house = ((signIdx - ascIdx + 12) % 12) + 1; // 1..12
    }

    out.push({ planet: P.name, sign, house, degree, lon });
  }

  // Ketu as opposite of Rahu
  if (rahuLon != null) {
    const lon = norm360(rahuLon + 180);
    const sign = signFromDeg(lon);
    const degree = lon % 30;
    let house: number | null = null;

    if (ascIdx != null) {
      const signIdx = Math.floor(lon / 30);
      house = ((signIdx - ascIdx + 12) % 12) + 1;
    }

    out.push({ planet: "Ketu", sign, house, degree, lon });
  }

  return out;
}

export default computePlacements;
