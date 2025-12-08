import type { Place } from "@/lib/types";

export type PlanetDeg = { sign: string; degree: number }; // 0–30 within sign
export type Ephemeris = { dateISO: string; mercury: PlanetDeg /* add more later */ };

export async function fetchEphemeris(date: Date, place: Place): Promise<Ephemeris> {
  const api = process.env.ASTRO_API_URL;
  if (api) {
    // Expected API: GET {api}/ephemeris?date=YYYY-MM-DD&lat=&lon=&tz=
    const d = date.toISOString().slice(0, 10);
    const url = `${api}/ephemeris?date=${d}&lat=${place.lat}&lon=${place.lon}&tz=${encodeURIComponent(place.tz ?? "")}`;
    const r = await fetch(url, { method: "GET", cache: "no-store" });
    if (!r.ok) throw new Error("Ephemeris HTTP " + r.status);
    const j = await r.json();
    // Map your API to our shape:
    return {
      dateISO: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).toISOString(),
      mercury: { sign: j.mercury.sign_sidereal, degree: j.mercury.degree_in_sign }, // adjust to your API fields
    };
  }
  
  // Fallback stub (deterministic; what you already had)
  const day = Math.floor(date.getTime() / 86400000);
  const deg = ((day % 30) + 12) % 30;
  return {
    dateISO: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).toISOString(),
    mercury: { sign: "Virgo", degree: deg },
  };
}
// TEMPORARY STUB FOR NATAL CALCULATION
// Replace with your Swiss Ephemeris or real astro logic later.
import type { Birth } from "@/server/astro/types";
import type { PlanetPos } from "@/server/astro/types";

export async function getNatal(birth: Birth): Promise<PlanetPos[]> {
  // Just returns fake sample positions for now
  return [
    { id: "Sun", lon: 120, sign: "Leo", house: 10, deg: 0, nakName: "Magha", pada: 1 },
    { id: "Moon", lon: 46, sign: "Taurus", house: 1, deg: 16, nakName: "Rohini", pada: 2 },
    { id: "Mars", lon: 190, sign: "Libra", house: 4, deg: 10 },
    { id: "Mercury", lon: 140, sign: "Leo", house: 10, deg: 20 },
    { id: "Jupiter", lon: 226, sign: "Scorpio", house: 7, deg: 16 },
    { id: "Venus", lon: 200, sign: "Virgo", house: 11, deg: 15 },
    { id: "Saturn", lon: 136, sign: "Leo", house: 4, deg: 16 },
    { id: "Rahu", lon: 80, sign: "Gemini", house: 12, deg: 10 },
    { id: "Ketu", lon: 260, sign: "Sagittarius", house: 6, deg: 10 }
  ];
}
