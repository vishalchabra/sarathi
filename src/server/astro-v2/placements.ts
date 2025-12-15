import { computeTropicalEclipticLongitudes } from "./ephemeris";
import { ayanamsaLahiriDegrees, toSiderealLon } from "./ayanamsa";
import type { PlanetKey } from "./bodies";

export type PlacementRow = {
  key: PlanetKey;
  tropicalLon: number;
  siderealLon: number;
};

export function computePlacementsV2(when: string | Date): PlacementRow[] {
  const trop = computeTropicalEclipticLongitudes(when);
  const ayan = ayanamsaLahiriDegrees(when);

  return trop.map((p) => ({
    key: p.key,
    tropicalLon: p.lon,
    siderealLon: toSiderealLon(p.lon, ayan),
  }));
}
