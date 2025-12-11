// FILE: src/server/astro/ascendant.ts (or wherever this lives)
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

function toUTC(b: BirthInput): Date {
  return DateTime.fromISO(`${b.dateISO}T${b.time}`, { zone: b.tz })
    .toUTC()
    .toJSDate();
}
function norm360(x: number) {
  let v = x % 360;
  return v < 0 ? v + 360 : v;
}
function signFromDeg(longitude: number) {
  const lon = norm360(longitude);
  return SIGNS[Math.floor(lon / 30)] ?? "—";
}

/** Returns sidereal Ascendant (Lahiri) { lon, sign } */
export async function getAscendant(birth: BirthInput) {
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

  // Houses/Asc LONGITUDES from Swiss are **tropical** by default.
  // Convert to sidereal by subtracting ayanāṁśa.
  const hs = await sweCall<any>(
    "swe_houses",
    jd,
    birth.lat,
    birth.lon,
    "P"
  );

  const ascTrop =
    hs?.ascmc?.[0] ??
    hs?.asc ??
    hs?.ascendant ??
    hs?.Asc ??
    NaN;

  if (typeof ascTrop === "number" && !Number.isNaN(ascTrop)) {
    const ayan =
      (await sweCall<number>("swe_get_ayanamsa_ut", jd)) ?? 0; // degrees
    const ascSid = norm360(ascTrop - ayan); // apply Lahiri (set in engine)
    return { lon: ascSid, sign: signFromDeg(ascSid) };
  }
  return { lon: NaN, sign: "—" };
}

export async function getAscendantSign(birth: BirthInput) {
  const asc = await getAscendant(birth);
  return asc.sign;
}

export default getAscendantSign;
