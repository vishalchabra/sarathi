// src/lib/astro/interpret.ts

export const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
] as const;

export function normalize360(x: number) {
  return ((x % 360) + 360) % 360;
}
export function deltaDeg(a: number, b: number) {
  const d = Math.abs(normalize360(a) - normalize360(b));
  return Math.min(d, 360 - d); // 0..180
}
export function signFromDeg(deg: number) {
  return SIGNS[Math.floor(normalize360(deg) / 30)];
}

/** House number (1..12) from a degree + 12 cusps (sidereal). */
export function houseFromDeg(deg: number, cuspsSidereal: number[]): number {
  const d = normalize360(deg);
  let bestIdx = 0;
  let bestDist = 1e9;
  for (let i = 0; i < 12; i++) {
    const c = normalize360(cuspsSidereal[i]);
    const dist = normalize360(d - c);
    if (dist < bestDist) { bestDist = dist; bestIdx = i; }
  }
  return bestIdx + 1;
}

/** Sign lords (classical). */
export const SIGN_LORD: Record<string, string> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter",
};

/** Nakshatra lords (27) */
export const NAK_LORD: Record<string, string> = {
  Ashwini:"Ketu", Bharani:"Venus", Krittika:"Sun", Rohini:"Moon", Mrigashira:"Mars", Ardra:"Rahu",
  Punarvasu:"Jupiter", Pushya:"Saturn", Ashlesha:"Mercury", Magha:"Ketu", "Purva Phalguni":"Venus",
  "Uttara Phalguni":"Sun", Hasta:"Moon", Chitra:"Mars", Swati:"Rahu", Vishakha:"Jupiter", Anuradha:"Saturn",
  Jyeshtha:"Mercury", Moola:"Ketu", "Purva Ashadha":"Venus", "Uttara Ashadha":"Sun", Shravana:"Moon",
  Dhanishta:"Mars", Shatabhisha:"Rahu", "Purva Bhadrapada":"Jupiter", "Uttara Bhadrapada":"Saturn", Revati:"Mercury",
};

/** Simple dignities (own/exalt/debilitate) for quick scoring. */
const OWN_SIGNS: Record<string, string[]> = {
  Sun: ["Leo"],
  Moon: ["Cancer"],
  Mars: ["Aries","Scorpio"],
  Mercury: ["Gemini","Virgo"],
  Jupiter: ["Sagittarius","Pisces"],
  Venus: ["Taurus","Libra"],
  Saturn: ["Capricorn","Aquarius"],
};
const EXALTATION: Record<string, string> = {
  Sun: "Aries", Moon: "Taurus", Mars: "Capricorn", Mercury: "Virgo",
  Jupiter: "Cancer", Venus: "Pisces", Saturn: "Libra",
};
const DEBILITATION: Record<string, string> = {
  Sun: "Libra", Moon: "Scorpio", Mars: "Cancer", Mercury: "Pisces",
  Jupiter: "Capricorn", Venus: "Virgo", Saturn: "Aries",
};

export function dignityScore(planet: string, sign: string) {
  if (EXALTATION[planet] === sign) return +0.5;
  if ((OWN_SIGNS[planet] ?? []).includes(sign)) return +0.35;
  if (DEBILITATION[planet] === sign) return -0.5;
  return 0;
}

/** Full Vedic aspect types with a small orb (deg). */
export function vedicAspectType(planet: string, sepDeg: number, orb = 5): string | null {
  const near = (x: number) => Math.abs(sepDeg - x) <= orb;
  if (near(180)) return "7th aspect";

  if (planet === "Mars" && (near(90) || near(150))) return near(90) ? "4th aspect" : "8th aspect";
  if (planet === "Jupiter" && near(120)) return "5th/9th aspect";
  if (planet === "Saturn" && near(60)) return "3rd/10th aspect";
  return null;
}
export function hasVedicAspect(planet: string, a: number, b: number, orb = 5): string | null {
  const sep = deltaDeg(a, b);
  return vedicAspectType(planet, sep, orb);
}
