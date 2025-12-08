// src/server/qa/features.ts
import { TransitSample, Graha } from "@/types/timing";

export function jobFeatures(sample: TransitSample, natal: {
  tenthHouse: number; tenthLord: Graha; tenthLordDeg: number;
}) {
  // crude examples; replace with your exact calcs:
  const J = sample.planets.Jupiter;
  const S = sample.planets.Saturn;
  const V = sample.planets.Venus;
  const Me = sample.planets.Mercury;

  const mercRetro = !!Me.retro;

  const jupTo10 = angleHit(J.deg, natal.tenthLordDeg, 0, 6) || houseAngle(J.deg, natal.tenthHouse, [1,5,9,10]); // orb 6°
  const satTo10 = houseAngle(S.deg, natal.tenthHouse, [1,7,10]); // pressure
  const venAngle10 = houseAngle(V.deg, natal.tenthHouse, [1,5,9,10]);

  const starOf10Lord = J.nakshatra === lordStar(natal.tenthLord) || V.nakshatra === lordStar(natal.tenthLord);
  const taraBad = isTaraBad(sample.planets.Moon.nakshatra, natal.tenthLord); // basic tara check

  return { mercRetro, jupTo10, satTo10, venAngle10, starOf10Lord, taraBad };
}

// Helpers (sketches)
function angleHit(a: number, b: number, exact: number, orb: number){ /* aspect math */ return false; }
function houseAngle(deg: number, house: number, goodAngles: number[]){ /* house mapping */ return false; }
function lordStar(lord: Graha): string { /* map planet -> preferred nakshatras */ return ""; }
function isTaraBad(moonStar: string, refLord: Graha) { return false; }
