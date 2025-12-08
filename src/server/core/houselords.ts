import "server-only";
import { getSwe } from "@/server/astro/swe";
const swe = getSwe();


// Ruler per sign index 0..11 (Aries..Pisces)
export const SIGN_RULER: number[] = [
swe.SE_MARS, // Aries
swe.SE_VENUS, // Taurus
swe.SE_MERCURY, // Gemini
swe.SE_MOON, // Cancer
swe.SE_SUN, // Leo
swe.SE_MERCURY, // Virgo
swe.SE_VENUS, // Libra
swe.SE_MARS, // Scorpio
swe.SE_JUPITER, // Sagittarius
swe.SE_SATURN, // Capricorn
swe.SE_SATURN, // Aquarius
swe.SE_JUPITER // Pisces
];