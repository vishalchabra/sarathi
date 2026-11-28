
import {
  calculateNakshatraPosition,
  tryCalculateNakshatraPosition,
} from "../astrology/nakshatraCalculator";

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

// Generate all 108 profiles from the shared calculator.
export const NAKSHATRA_PADA_LIBRARY: NakshatraPadaProfile[] =
  Array.from({ length: 108 }, (_, index) => {
    const midpoint = (index + 0.5) * 10 / 3;
    const position = calculateNakshatraPosition(midpoint);

    if (position.globalPadaIndex !== index) {
      throw new Error(
        `Nakshatra pada library index mismatch: ${index}`
      );
    }

    return {
      nakshatra: position.nakshatra,
      nakshatraLord: position.nakshatraLord,
      pada: position.pada,
      startLongitude: position.padaStartLongitude,
      endLongitude: position.padaEndLongitude,
      rashi: position.rashi,
      navamsa: position.navamsaSign,
    };
  });

export function getNakshatraPadaProfile(
  siderealLongitude: number
): NakshatraPadaProfile | null {
  const position =
    tryCalculateNakshatraPosition(siderealLongitude);

  if (!position) return null;

  return NAKSHATRA_PADA_LIBRARY[
    position.globalPadaIndex
  ] ?? null;
}
