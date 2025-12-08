// src/server/astro/dignity.ts

// Return a normalized dignity label for the Sun given its sign.
// Keep the labels consistent with what your UI expects.
export type Dignity =
  | "exalted" | "own" | "debilitated" | "friendly" | "neutral" | "enemy";

// If you already have a Sign type elsewhere, you can swap `string` with it.
export function sunDignity(sign: string): Dignity {
  // Normalize input just in case
  const s = String(sign || "").trim();

  // Map per classical Vedic relationships
  switch (s) {
    case "Aries":        return "exalted";     // Exaltation
    case "Leo":          return "own";         // Own sign
    case "Libra":        return "debilitated"; // Debilitation

    // Friends
    case "Gemini":
    case "Cancer":
    case "Sagittarius":
    case "Pisces":
      return "friendly";

    // Enemies
    case "Capricorn":
    case "Aquarius":
      return "enemy";

    // Neutrals
    case "Taurus":
    case "Virgo":
    case "Scorpio":
    default:
      return "neutral";
  }
}
