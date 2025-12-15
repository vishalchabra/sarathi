// FILE: src/server/astro-v2/ephemeris.ts
import * as Astronomy from "astronomy-engine";
import { PLANETS, type PlanetKey } from "./bodies";
import { norm360 } from "./math";
import { toUtcDate } from "./time";

/**
 * Tropical (apparent) ecliptic longitude (0..360).
 * This is the raw astronomy output before sidereal ayanamsa subtraction.
 */
export type TropLonRow = {
  key: PlanetKey;
  lon: number; // degrees 0..360
  lat: number; // degrees
  distAU?: number;
};

export function computeTropicalEclipticLongitudes(
  when: string | Date
): TropLonRow[] {
  const date = toUtcDate(when);

  // ✅ Use Astronomy Engine's Time object (handles UT + TT internally)
  const time = Astronomy.MakeTime(date);

  return PLANETS.map((key) => {
    const body = (Astronomy.Body as any)[key];

    // Geocentric position of body as seen from Earth; aberration=true (apparent)
    const vec = Astronomy.GeoVector(body, time, false);

    // Convert vector to ecliptic coordinates
    const ecl = Astronomy.Ecliptic(vec);

    const lon = norm360(ecl.elon);
    const lat = ecl.elat;

    return { key, lon, lat, distAU: vec.length };
  });
}
