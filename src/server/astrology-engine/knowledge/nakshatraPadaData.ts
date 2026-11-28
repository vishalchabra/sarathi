import { tryCalculateNakshatraPosition } from "../../../lib/astrology/nakshatraCalculator";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces",
] as const;

export function getNavamsaSignFromLon(
  lon: number | null | undefined
): string | null {
  const position = tryCalculateNakshatraPosition(lon);
  return position?.navamsaSign ?? null;
}

export const NAKSHATRAS = [
  ["Ashwini", "Ketu"],
  ["Bharani", "Venus"],
  ["Krittika", "Sun"],
  ["Rohini", "Moon"],
  ["Mrigashira", "Mars"],
  ["Ardra", "Rahu"],
  ["Punarvasu", "Jupiter"],
  ["Pushya", "Saturn"],
  ["Ashlesha", "Mercury"],
  ["Magha", "Ketu"],
  ["Purva Phalguni", "Venus"],
  ["Uttara Phalguni", "Sun"],
  ["Hasta", "Moon"],
  ["Chitra", "Mars"],
  ["Swati", "Rahu"],
  ["Vishakha", "Jupiter"],
  ["Anuradha", "Saturn"],
  ["Jyeshtha", "Mercury"],
  ["Mula", "Ketu"],
  ["Purva Ashadha", "Venus"],
  ["Uttara Ashadha", "Sun"],
  ["Shravana", "Moon"],
  ["Dhanishta", "Mars"],
  ["Shatabhisha", "Rahu"],
  ["Purva Bhadrapada", "Jupiter"],
  ["Uttara Bhadrapada", "Saturn"],
  ["Revati", "Mercury"],
] as const;

export function getNakshatraPadaData(
  lon: number | null | undefined
) {
  const position = tryCalculateNakshatraPosition(lon);

  if (!position) return null;

  return {
    nakshatra: position.nakshatra,
    nakshatraLord: position.nakshatraLord,
    pada: position.pada,
    navamsaSign: position.navamsaSign,
    navamsaLord: position.navamsaLord,
  };
}
