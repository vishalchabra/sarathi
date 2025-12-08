import "server-only";
import { DateTime } from "luxon";
import { getSwe } from "@/server/astro/swe";

export type BirthInput = {
  dateISO: string; time: string; tz: string; lat: number; lon: number;
};

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
] as const;

function toUTC(b: BirthInput): Date {
  return DateTime.fromISO(`${b.dateISO}T${b.time}`, { zone: b.tz }).toUTC().toJSDate();
}
function norm360(x: number) { let v = x % 360; return v < 0 ? v + 360 : v; }
function signFromDeg(longitude: number) {
  const lon = norm360(longitude);
  return SIGNS[Math.floor(lon / 30)] ?? "—";
}

/** Returns sidereal Ascendant (Lahiri) { lon, sign } */
export function getAscendant(birth: BirthInput) {
  const swe = getSwe();
  const d = toUTC(birth);

  const ut = d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600;
  const jd = swe.swe_julday(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), ut, swe.SE_GREG_CAL);

  // Houses/Asc LONGITUDES from Swiss are **tropical** by default.
  // Convert to sidereal by subtracting ayanāṁśa.
  const hs = swe.swe_houses?.(jd, birth.lat, birth.lon, "P");
  const ascTrop = (hs?.ascmc?.[0] ?? hs?.asc ?? hs?.ascendant ?? hs?.Asc ?? NaN);

  if (typeof ascTrop === "number" && !Number.isNaN(ascTrop)) {
    const ayan = swe.swe_get_ayanamsa_ut?.(jd) ?? 0;        // degrees
    const ascSid = norm360(ascTrop - ayan);                 // apply Lahiri (set in getSwe)
    return { lon: ascSid, sign: signFromDeg(ascSid) };
  }
  return { lon: NaN, sign: "—" };
}

export async function getAscendantSign(birth: BirthInput) {
  return getAscendant(birth).sign;
}

export default getAscendantSign;
