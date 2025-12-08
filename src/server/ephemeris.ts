// src/server/ephemeris.ts
import type { Birth, PlanetPos } from "@/server/astro/types";

// Example: already existed in your file
export async function getTransitsDaily(_dateISO: string, _tz: string) {
  // Return whatever your app expects for daily transits
  return [];
}

// ✅ Add this named export (stub) so qa/route.ts compiles
export async function getNatal(birth: Birth): Promise<PlanetPos[]> {
  // TODO: replace with real Swiss Ephemeris → sign/house/nakshatra, etc.
  // Minimal mock so the app compiles and downstream code can run:
  return [
    { id: "Sun",    lon: 140, sign: "Leo",       house: 10, deg: 20, nakName: "Uttara Phalguni", pada: 2 },
    { id: "Moon",   lon:  46, sign: "Taurus",    house:  1, deg: 16, nakName: "Rohini",          pada: 2 },
    { id: "Mars",   lon: 190, sign: "Libra",     house:  4, deg: 10 },
    { id: "Mercury",lon: 144, sign: "Leo",       house: 10, deg: 24 },
    { id: "Jupiter",lon: 226, sign: "Scorpio",   house:  7, deg: 16 },
    { id: "Venus",  lon: 200, sign: "Virgo",     house: 11, deg: 15 },
    { id: "Saturn", lon: 136, sign: "Leo",       house:  4, deg: 16 },
    { id: "Rahu",   lon:  80, sign: "Gemini",    house: 12, deg: 10 },
    { id: "Ketu",   lon: 260, sign: "Sagittarius",house: 6, deg: 10 }
  ];
}
