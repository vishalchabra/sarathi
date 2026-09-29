
const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces",
] as const;

export function getNavamsaSignFromLon(
  lon: number | null | undefined
): string | null {
  if (typeof lon !== "number" || !Number.isFinite(lon)) {
    return null;
  }

  const normalizedLon = ((lon % 360) + 360) % 360;
  const navamsaIndex =
    Math.floor(normalizedLon / (30 / 9)) % 12;

  return SIGNS[navamsaIndex] ?? null;
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
  if (typeof lon !== "number" || !Number.isFinite(lon)) {
    return null;
  }

  const normalizedLon = ((lon % 360) + 360) % 360;
  const nakshatraSpan = 360 / 27;
  const padaSpan = nakshatraSpan / 4;

  const nakshatraIndex = Math.floor(
    normalizedLon / nakshatraSpan
  );

  const degreeInNakshatra =
    normalizedLon - nakshatraIndex * nakshatraSpan;

  const pada = Math.floor(
    degreeInNakshatra / padaSpan
  ) + 1;

  const nakshatra = NAKSHATRAS[nakshatraIndex];
  const navamsaSign = getNavamsaSignFromLon(normalizedLon);

  const signLords: Record<string, string> = {
    Aries: "Mars",
    Taurus: "Venus",
    Gemini: "Mercury",
    Cancer: "Moon",
    Leo: "Sun",
    Virgo: "Mercury",
    Libra: "Venus",
    Scorpio: "Mars",
    Sagittarius: "Jupiter",
    Capricorn: "Saturn",
    Aquarius: "Saturn",
    Pisces: "Jupiter",
  };

  return {
    nakshatra: nakshatra[0],
    nakshatraLord: nakshatra[1],
    pada,
    navamsaSign,
    navamsaLord: navamsaSign
      ? signLords[navamsaSign]
      : null,
  };
}
