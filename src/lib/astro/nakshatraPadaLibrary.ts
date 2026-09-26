
import { getNakshatraForLongitude } from "./nakshatra";

export const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces",
] as const;

export type ZodiacSign = (typeof ZODIAC_SIGNS)[number];
export type PadaNumber = 1 | 2 | 3 | 4;

export type NakshatraPadaProfile = {
  nakshatra: string;
  nakshatraLord: string;
  pada: PadaNumber;
  startLongitude: number;
  endLongitude: number;
  rashi: ZodiacSign;
  navamsa: ZodiacSign;
};

// Each pada spans exactly 3°20' of sidereal longitude.
const PADA_WIDTH = 360 / 108;

export const NAKSHATRA_PADA_LIBRARY: NakshatraPadaProfile[] =
  Array.from({ length: 108 }, (_, index) => {
    const startLongitude = index * PADA_WIDTH;
    const endLongitude = (index + 1) * PADA_WIDTH;

    // Sample the midpoint to avoid boundary rounding issues.
    const midpoint = (startLongitude + endLongitude) / 2;
    const nakshatra = getNakshatraForLongitude(midpoint);

    const rashiIndex = Math.floor(midpoint / 30);
    const navamsaIndex = index % 12;

    return {
      nakshatra: nakshatra.name,
      nakshatraLord: nakshatra.lord,
      pada: ((index % 4) + 1) as PadaNumber,
      startLongitude,
      endLongitude,
      rashi: ZODIAC_SIGNS[rashiIndex],
      navamsa: ZODIAC_SIGNS[navamsaIndex],
    };
  });

export function getNakshatraPadaProfile(
  siderealLongitude: number
): NakshatraPadaProfile | null {
  if (!Number.isFinite(siderealLongitude)) return null;

  const normalized =
    ((siderealLongitude % 360) + 360) % 360;

  const index = Math.min(
    107,
    Math.floor(normalized / PADA_WIDTH)
  );

  return NAKSHATRA_PADA_LIBRARY[index] ?? null;
}