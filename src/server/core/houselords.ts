// FILE: src/server/astro/signRulers.ts
// No swisseph import here – just raw numeric IDs that match Swiss Ephemeris

// Swiss planet codes (node-swisseph / Swiss Ephemeris)
// 0 = Sun, 1 = Moon, 2 = Mercury, 3 = Venus, 4 = Mars, 5 = Jupiter, 6 = Saturn
const SE_SUN = 0;
const SE_MOON = 1;
const SE_MERCURY = 2;
const SE_VENUS = 3;
const SE_MARS = 4;
const SE_JUPITER = 5;
const SE_SATURN = 6;

// Ruler per sign index 0..11 (Aries..Pisces)
export const SIGN_RULER: number[] = [
  SE_MARS,    // Aries
  SE_VENUS,   // Taurus
  SE_MERCURY, // Gemini
  SE_MOON,    // Cancer
  SE_SUN,     // Leo
  SE_MERCURY, // Virgo
  SE_VENUS,   // Libra
  SE_MARS,    // Scorpio
  SE_JUPITER, // Sagittarius
  SE_SATURN,  // Capricorn
  SE_SATURN,  // Aquarius
  SE_JUPITER, // Pisces
];
