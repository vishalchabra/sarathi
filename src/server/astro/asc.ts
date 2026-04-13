// FILE: src/server/astro/ascendant.ts (or wherever this lives)
console.log("ASC TS FILE LOADED")
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
  console.error("GET ASCENDANT CALLED", birth);

  const d = toUTC(birth);

  const Astronomy = await import("astronomy-engine");

  const time = (Astronomy as any).MakeTime
    ? (Astronomy as any).MakeTime(d)
    : new (Astronomy as any).AstroTime(d);

  // Astronomy Engine sidereal time is used as the base.
  // Convert it to LOCAL sidereal time by adding longitude (east positive).
  const gstDeg = (Astronomy as any).SiderealTime(time) * 15;
  const lstDeg = norm360(gstDeg + birth.lon);

  const theta = (lstDeg * Math.PI) / 180;
  const eps = (23.4393 * Math.PI) / 180; // mean obliquity
  const phi = (birth.lat * Math.PI) / 180;

  // Standard ascendant formula:
  // y = -cos(theta)
  // x = sin(theta) * cos(eps) + tan(phi) * sin(eps)
  let ascTrop =
    (Math.atan2(
      -Math.cos(theta),
      Math.sin(theta) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps)
    ) *
      180) /
    Math.PI;

  ascTrop = norm360(ascTrop);

  // Final "easterly/rising point" correction
  if (ascTrop < 180) {
    ascTrop += 180;
  } else {
    ascTrop -= 180;
  }

  const ut =
    d.getUTCHours() +
    d.getUTCMinutes() / 60 +
    d.getUTCSeconds() / 3600;

  const jd = await sweJulday(
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    ut,
    1
  );

  const ayan = await sweCall<number>("swe_get_ayanamsa_ut", jd);
  const ascSid = norm360(ascTrop - ayan);



  return {
    lon: ascSid,
    sign: signFromDeg(ascSid),
  };
}

export async function getAscendantSign(birth: BirthInput) {
  const asc = await getAscendant(birth);
  return asc.sign;
}

export default getAscendantSign;
