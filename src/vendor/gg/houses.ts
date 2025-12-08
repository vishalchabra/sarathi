// src/vendor/gg/houses.ts
// TEMP: working stubs so Charts + Vargas run end-to-end.
// Replace these with your real GrahaGuru functions when ready.

/** Return ascendant absolute sidereal degree (0..360). */
export function ascDetails(
  _dobISO: string,
  _tob: string,
  _lat: number,
  _lon: number,
  _tz: string
): number {
  // Virgo 0° (150° absolute) as placeholder
  return 150.0;
}

/** Return absolute sidereal longitudes (0..360) for planets. */
export function planetLongitudes(
  _dobISO: string,
  _tob: string,
  _lat: number,
  _lon: number,
  _tz: string
): Record<string, number> {
  const signBase: Record<
    | "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo"
    | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces",
    number
  > = {
    Aries: 0, Taurus: 30, Gemini: 60, Cancer: 90, Leo: 120, Virgo: 150,
    Libra: 180, Scorpio: 210, Sagittarius: 240, Capricorn: 270, Aquarius: 300, Pisces: 330,
  };
  const abs = (sign: keyof typeof signBase, deg: number) => signBase[sign] + deg;

  // Matches your current stubbed D1 chart
  return {
    Sun:     abs("Leo",        12.5), // 132.5
    Moon:    abs("Taurus",      3.1), // 33.1
    Mars:    abs("Aries",      18.9), // 18.9
    Mercury: abs("Virgo",       2.0), // 152.0
    Venus:   abs("Libra",       9.0), // 189.0
    Jupiter: abs("Sagittarius", 5.0), // 245.0
    Saturn:  abs("Aquarius",   21.0), // 321.0
    Rahu:    abs("Pisces",     14.0), // 344.0
    Ketu:    abs("Virgo",      14.0), // 164.0
  };
}
