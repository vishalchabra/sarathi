// lib/astro.ts
// Real Nakshatra + Vimshottari (Lahiri) calculator
// Uses: astronomy-engine (Moon ecliptic longitude of date) + date-fns-tz for timezone handling
// Install: npm i astronomy-engine date-fns-tz

import * as Astronomy from "astronomy-engine";
import { DateTime } from "luxon";

export type Place = {
  name: string;
  lat: number;
  lon: number;
  tz: string; // IANA time zone, e.g. "Asia/Kolkata"
};

export type CalcOutput = {
  nakshatra: string;
  pada: number; // 1..4
  nakIndex: number; // 0..26
  moon: {
    tropicalLon: number;
    siderealLon: number;
    ayanamsa: number;
  };
  dasha: {
    mdLord: Graha;
    mdYears: number;
    mdStartISO: string;
    mdEndISO: string;
    ad: { lord: Graha; startISO: string; endISO: string; years: number }[];
  };
};

export type Graha =
  | "Ketu"
  | "Venus"
  | "Sun"
  | "Moon"
  | "Mars"
  | "Rahu"
  | "Jupiter"
  | "Saturn"
  | "Mercury";

const NAKSHATRA_NAMES = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashirsha","Ardra",
  "Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni",
  "Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
  "Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha",
  "Purva Bhadrapada","Uttara Bhadrapada","Revati"
];

const NAK_LORDS: Graha[] = (
  ["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"]
)
  .concat(["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"])
  .concat(["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"]);

const MD_YEARS: Record<Graha, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

const NAK_SIZE = 360 / 27;     // 13°20'
const PADA_SIZE = NAK_SIZE / 4; // 3°20'
const DAYS_PER_YEAR = 365.25;

function norm360(x: number): number {
  const v = x % 360;
  return v < 0 ? v + 360 : v;
}

function decimalYearUTC(d: Date): number {
  const y = d.getUTCFullYear();
  const start = Date.UTC(y, 0, 1);
  const next = Date.UTC(y + 1, 0, 1);
  const frac = (d.getTime() - start) / (next - start);
  return y + frac;
}

// Lahiri (Chitrapaksha) ayanamsa in degrees
export function lahiriAyanamsa(dateUTC: Date): number {
  const L0 = 23 + 51 / 60 + 11 / 3600; // 23°51'11" at 2000-01-01
  const years = decimalYearUTC(dateUTC) - 2000;
  const rateDegPerYear = 50.290966 / 3600; // deg/year
  const ay = L0 + years * rateDegPerYear;
  return norm360(ay);
}

export function birthLocalToUTC(naiveLocalISO: string, timeZone: string): Date {
  // naiveLocalISO like "YYYY-MM-DDTHH:mm" in the selected IANA zone
  const dt = DateTime.fromISO(naiveLocalISO, { zone: timeZone });
  if (!dt.isValid) {
    throw new Error(`Invalid date/time or timezone: ${naiveLocalISO} @ ${timeZone} (${dt.invalidReason})`);
  }
  return dt.toUTC().toJSDate();
}

export function moonTropicalLongitude(dateUTC: Date): number {
  const t = new Astronomy.AstroTime(dateUTC);
  const lib = Astronomy.Libration(t);
  return norm360(lib.mlon);
}

export function toSiderealLongitudeLahiri(tropicalLon: number, dateUTC: Date): number {
  return norm360(tropicalLon - lahiriAyanamsa(dateUTC));
}

export function nakshatraFromLongitude(siderealLon: number) {
  const idx = Math.floor(siderealLon / NAK_SIZE);
  const pada = Math.floor((siderealLon - idx * NAK_SIZE) / PADA_SIZE) + 1;
  return {
    index: idx,
    name: NAKSHATRA_NAMES[idx],
    pada,
    lord: NAK_LORDS[idx] as Graha,
  };
}

export function buildAntardashaSchedule(mdLord: Graha, mdStartUTC: Date) {
  const order: Graha[] = ["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"];
  const mdLenYears = MD_YEARS[mdLord];
  const mdDurationDays = mdLenYears * DAYS_PER_YEAR;
  const startIdx = order.indexOf(mdLord);
  const seq = Array.from({ length: 9 }, (_, i) => order[(startIdx + i) % 9]);
  let cursor = new Date(mdStartUTC.getTime());
  const ad: { lord: Graha; startISO: string; endISO: string; years: number }[] = [];
  for (const lord of seq) {
    const fraction = MD_YEARS[lord] / 120;
    const spanDays = mdDurationDays * fraction;
    const startISO = cursor.toISOString();
    const end = new Date(cursor.getTime() + spanDays * 24 * 3600 * 1000);
    ad.push({ lord, startISO, endISO: end.toISOString(), years: MD_YEARS[lord] * (mdLenYears / 120) });
    cursor = end;
  }
  const mdEndISO = cursor.toISOString();
  return { ad, mdEndISO };
}

export function computeReading(dobLocalISO: string, place: Place): CalcOutput {
  const dobUTC = birthLocalToUTC(dobLocalISO, place.tz);
  const tropicalLon = moonTropicalLongitude(dobUTC);
  const ay = lahiriAyanamsa(dobUTC);
  const siderealLon = toSiderealLongitudeLahiri(tropicalLon, dobUTC);
  const { index: nakIndex, name: nakshatra, pada, lord } = nakshatraFromLongitude(siderealLon);

  const intoNak = siderealLon - nakIndex * NAK_SIZE;
  const frac = intoNak / NAK_SIZE;
  const mdYears = MD_YEARS[lord];
  const elapsedYears = frac * mdYears;

  const mdStartUTC = new Date(dobUTC.getTime() - elapsedYears * DAYS_PER_YEAR * 24 * 3600 * 1000);
  const { ad, mdEndISO } = buildAntardashaSchedule(lord, mdStartUTC);

  return {
    nakshatra,
    pada,
    nakIndex,
    moon: { tropicalLon, siderealLon, ayanamsa: ay },
    dasha: {
      mdLord: lord,
      mdYears: mdYears,
      mdStartISO: mdStartUTC.toISOString(),
      mdEndISO,
      ad,
    },
  };
}

export function fmtDMS(deg: number): string {
  const d = Math.floor(deg);
  const mFloat = (deg - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.round((mFloat - m) * 60);
  return `${d}° ${m}' ${s}"`;
}
// ====== Ascendant & Houses helpers (no ObliqEq) ======


const SIGN_NAMES = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];

function deg2rad(d: number) { return (d * Math.PI) / 180; }
function rad2deg(r: number) { return (r * 180) / Math.PI; }

/** Get true obliquity of date in degrees using the EQD→ECT rotation matrix. */
function obliquityDegrees(dateUTC: Date): number {
  const R = Astronomy.Rotation_EQD_ECT(dateUTC); // rotation about x-axis by +ε
  // R.rot is 3x3. For x-axis rotation, tan(ε) = R[1][2] / R[1][1]
  const epsRad = Math.atan2(R.rot[1][2], R.rot[1][1]);
  return rad2deg(epsRad);
}

/**
 * Compute tropical Ascendant (ecliptic longitude) at given place/time,
 * then convert to Lahiri sidereal.
 * Requires helpers in this file: birthLocalToUTC(dateISO,tz), lahiriAyanamsa(date), norm360(x)
 */
export function computeAscendant(
  dobLocalISO: string,
  place: { lat: number; lon: number; tz: string }
) {
  const dateUTC = birthLocalToUTC(dobLocalISO, place.tz);

  // 1) Local Sidereal Time (degrees). Greenwich sidereal HOURS × 15 + longitude (east +).
  const gstHours = Astronomy.SiderealTime(dateUTC);
  const lstDeg = norm360(gstHours * 15 - place.lon);

  // 2) True obliquity (ε) using equator→ecliptic rotation matrix.
  const R = Astronomy.Rotation_EQD_ECL(dateUTC);
  const eps = rad2deg(Math.atan2(R.rot[1][2], R.rot[1][1]));

  // 3) Ascendant (tropical ecliptic longitude).
  const theta = deg2rad(lstDeg);
  const phi = deg2rad(place.lat);
  const epsRad = deg2rad(eps);
  // λ_A = atan2(-cos θ, sin θ·cos ε + tan φ·sin ε)
  const ascTropical = norm360(
    rad2deg(
      Math.atan2(
        -Math.cos(theta),
        Math.sin(theta) * Math.cos(epsRad) + Math.tan(phi) * Math.sin(epsRad)
      )
    )
  );

  // 4) Convert to Lahiri sidereal.
  const ay = lahiriAyanamsa(dateUTC);
  const ascSidereal = norm360(ascTropical - ay);

  const signIndex = Math.floor(ascSidereal / 30);
  const signName = [
    "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
    "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
  ][signIndex];

  return { ascTropical, ascSidereal, signIndex, signName, ayanamsa: ay, lstDeg, eps };
}

export function houseNumberFor(sidLon: number, ascSidereal: number): number {
  const delta = (sidLon - ascSidereal + 360) % 360;
  return Math.floor(delta / 30) + 1; // 1..12
}

/** Planet→house placements (Equal Houses, Lahiri). */
export function computeHousePlacements(dobLocalISO: string, place: { lat: number; lon: number; tz: string }) {
  const asc = computeAscendant(dobLocalISO, place);
  const longs = siderealPlanetLongitudes(dobLocalISO, place);
  const houses: Record<number, string[]> = Object.fromEntries(Array.from({ length: 12 }, (_, i) => [i + 1, []]));

  for (const [planet, lon] of Object.entries(longs)) {
    const h = houseNumberFor(lon as number, asc.ascSidereal);
    houses[h].push(planet);
  }
  return { asc, houses, longs, signName: asc.signName };
}
