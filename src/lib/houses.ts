// lib/houses.ts — verified Ascendant & houses (Lahiri, Whole/Equal)
// - Two methods for Asc: (A) Meeus/LST formula, (B) horizon EAST scan
// - Try +lon and −lon; pick the most "east" & consistent result
// - Exposes ascDetails() for on-screen debugging
// - Includes Rahu/Ketu (mean nodes)

import * as Astronomy from "astronomy-engine";
import type { Observer } from "astronomy-engine";
import { DateTime } from "luxon";
type AstroObserver = {
  latitude: number;
  longitude: number;
  height: number;
};

export type Place = { lat: number; lon: number; tz: string };

function norm360(x: number) { const a = x % 360; return a < 0 ? a + 360 : a; }
function deg2rad(d: number) { return (d * Math.PI) / 180; }
function rad2deg(r: number) { return (r * 180) / Math.PI; }

// Approximate Lahiri ayanamsa (good for signs/houses).
function approxLahiri(dateUTC: Date): number {
  const y = dateUTC.getUTCFullYear() + (dateUTC.getUTCMonth() + 0.5) / 12;
  return 23.85 + 0.013969 * (y - 2000);
}

// Local ISO in IANA tz -> UTC Date
function birthLocalToUTC(localISO: string, tz: string): Date {
  const dt = DateTime.fromISO(localISO, { zone: tz });
  if (!dt.isValid) throw new Error("Invalid DOB/time");
  return dt.toUTC().toJSDate();
}

// ---------- Method A: Meeus/LST tropical Asc ----------
function ascMeeusTropical(dateUTC: Date, latDeg: number, lonDegEast: number) {
  const gmstHours = Astronomy.SiderealTime(dateUTC);      // Greenwich sidereal (hours)
  const lstDeg = norm360(gmstHours * 15 + lonDegEast);    // Local sidereal (deg)
  const R = Astronomy.Rotation_EQD_ECL(dateUTC);          // true obliquity
  const epsRad = Math.atan2(R.rot[1][2], R.rot[1][1]);

  const theta = deg2rad(lstDeg);
  const phi   = deg2rad(latDeg);
  const y = -Math.cos(theta);
  const x = Math.sin(theta) * Math.cos(epsRad) + Math.tan(phi) * Math.sin(epsRad);
  const lambdaTrop = norm360(rad2deg(Math.atan2(y, x)));
  return { lambdaTrop, lstDeg, epsRad };
}

// ---------- Method B: horizon EAST scan (β=0) ----------
function eclToRADec(lambdaDeg: number, epsRad: number) {
  const L = deg2rad(lambdaDeg);
  const sinL = Math.sin(L), cosL = Math.cos(L);
  const dec = Math.asin(sinL * Math.sin(epsRad));
  let ra  = Math.atan2(sinL * Math.cos(epsRad), cosL);
  if (ra < 0) ra += 2 * Math.PI;
  return { raHours: rad2deg(ra) / 15, decDeg: rad2deg(dec) };
}
function altAzAt(dateUTC: Date, obs: AstroObserver, lambdaDeg: number, epsRad: number) {

  const { raHours, decDeg } = eclToRADec(lambdaDeg, epsRad);
  const h = Astronomy.Horizon(dateUTC, obs, raHours, decDeg, "normal");
  return { alt: h.altitude, az: h.azimuth };
}
function ascScanTropical(dateUTC: Date, latDeg: number, lonDegEast: number) {
  const R = Astronomy.Rotation_EQD_ECL(dateUTC);
  const epsRad = Math.atan2(R.rot[1][2], R.rot[1][1]);
  const obs = new Astronomy.Observer(latDeg, lonDegEast, 0);

  let prevLam = 0;
  let prev = altAzAt(dateUTC, obs, 0, epsRad);
  for (let lam = 10; lam <= 360; lam += 10) {
    const cur = altAzAt(dateUTC, obs, lam, epsRad);
    const crossed = (prev.alt <= 0 && cur.alt >= 0) || (prev.alt >= 0 && cur.alt <= 0);
    if (crossed) {
      let lo = prevLam, hi = lam, alo = prev.alt;
      for (let i = 0; i < 28; i++) {
        const mid = (lo + hi) / 2;
        const am = altAzAt(dateUTC, obs, mid, epsRad);
        if (Math.sign(alo) === Math.sign(am.alt)) { lo = mid; alo = am.alt; } else { hi = mid; }
      }
      const mid = (lo + hi) / 2;
      const am = altAzAt(dateUTC, obs, mid, epsRad);
      if (am.az < 180) {
        const eastScore = Math.abs(am.az - 90) + Math.abs(am.alt);
        return { lambdaTrop: mid, eastScore, epsRad };
      }
    }
    prevLam = lam; prev = cur;
  }
  return { lambdaTrop: 0, eastScore: 1e9, epsRad: deg2rad(23.4392911) }; // fallback
}

// ---------- Choose between +lon and −lon; pick best & consistent ----------
function bestAscendant(dateUTC: Date, latDeg: number, lonDeg: number) {
  const ay = approxLahiri(dateUTC);

  function candidate(lonUse: number) {
    const A = ascMeeusTropical(dateUTC, latDeg, lonUse);
    const B = ascScanTropical(dateUTC, latDeg, lonUse);

    const sidA = norm360(A.lambdaTrop - ay);
    const sidB = norm360(B.lambdaTrop - ay);
    const diff = Math.min(Math.abs(sidA - sidB), 360 - Math.abs(sidA - sidB));

    // Prefer scan (explicit EAST), but keep metadata for debug.
    return {
      ascTropical: B.lambdaTrop,
      ascSidereal: sidB,
      lstDeg: A.lstDeg,
      epsRad: B.epsRad,
      eastScore: B.eastScore,
      agreeDiff: diff,
      lonUsed: lonUse
    };
  }

  const plus  = candidate(+lonDeg);
  const minus = candidate(-lonDeg);

  const best =
    (plus.eastScore < minus.eastScore) ? plus :
    (minus.eastScore < plus.eastScore) ? minus :
    (plus.agreeDiff <= minus.agreeDiff ? plus : minus);

  return best;
}

/** Public: Ascendant (sidereal, Lahiri), sign, ayanamsa. */
export function computeAscendant(dobLocalISO: string, place: { lat: number; lon: number; tz: string }) {
  const dateUTC = birthLocalToUTC(dobLocalISO, place.tz);
  const A = bestAscendant(dateUTC, place.lat, place.lon);

  const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
  const signIndex = Math.floor(A.ascSidereal / 30);
  const signName  = SIGNS[signIndex];
  const ay = approxLahiri(dateUTC);

  return { ascTropical: A.ascTropical, ascSidereal: A.ascSidereal, signIndex, signName, ayanamsa: ay };
}

/** Debug: full details shown on UI panel (UTC, LST, lon sign chosen, etc). */
export function ascDetails(dobLocalISO: string, place: { lat: number; lon: number; tz: string }) {
  const utc = birthLocalToUTC(dobLocalISO, place.tz);
  const A = bestAscendant(utc, place.lat, place.lon);
  const ay = approxLahiri(utc);
  const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
  return {
    utcISO: utc.toISOString(),
    lstDeg: A.lstDeg,
    lonUsed: A.lonUsed,               // +lon or −lon
    epsDeg: rad2deg(A.epsRad),
    ayanamsa: ay,
    ascTropical: A.ascTropical,
    ascSidereal: A.ascSidereal,
    ascSign: SIGNS[Math.floor(A.ascSidereal / 30)]
  };
}

/** Sidereal (Lahiri) longitudes of Sun..Saturn + Rahu/Ketu (mean nodes), degrees 0..360. */
export function siderealPlanetLongitudes(dobLocalISO: string, place: { tz: string }) {
  const dateUTC = birthLocalToUTC(dobLocalISO, place.tz);
  const ay = approxLahiri(dateUTC);

  const out: Record<string, number> = {};
  const bodies = ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn"] as const;

  for (const b of bodies) {
    const vec = Astronomy.GeoVector(b, dateUTC, true);
    const ecl = Astronomy.Ecliptic(vec);
    out[b] = norm360(ecl.elon - ay);
  }

  // Mean nodes (ascending node Ω, tropical)
  const jd = dateUTC.getTime() / 86400000 + 2440587.5;
  const T  = (jd - 2451545.0) / 36525;
  const omega =
    125.04455501
    - 1934.1361849 * T
    + 0.0020762 * T*T
    + (T*T*T) / 467410
    - (T*T*T*T) / 60616000;
  const rahuSid = norm360(omega - ay);
  out["Rahu"] = rahuSid;
  out["Ketu"] = norm360(rahuSid + 180);

  return out;
}

/** Equal Houses from sidereal Ascendant → 1..12 */
export function houseNumberEqual(sidLon: number, ascSidereal: number) {
  const delta = norm360(sidLon - ascSidereal);
  return Math.floor(delta / 30) + 1;
}

/** Whole Sign: house by sign distance from Asc sign. */
export function houseNumberWhole(sidLon: number, ascSidereal: number) {
  const pSign = Math.floor(sidLon / 30);
  const aSign = Math.floor(ascSidereal / 30);
  return ((pSign - aSign + 12) % 12) + 1;
}

export type HouseSystem = "whole" | "equal";

/** Planet→house placements (Lahiri). */
export function computeHousePlacements(
  dobLocalISO: string,
  place: Place,
  system: HouseSystem = "whole"
) {
  const asc = computeAscendant(dobLocalISO, place);
  const longs = siderealPlanetLongitudes(dobLocalISO, place);

  const houses: Record<number, string[]> = Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [i + 1, [] as string[]])
  );

  for (const [planet, lon] of Object.entries(longs)) {
    const L = lon as number;
    const h = system === "whole"
      ? houseNumberWhole(L, asc.ascSidereal)
      : houseNumberEqual(L, asc.ascSidereal);
    houses[h].push(planet);
  }

  return { asc, houses, longs, signName: asc.signName };
}
