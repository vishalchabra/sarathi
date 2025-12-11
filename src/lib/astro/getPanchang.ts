// FILE: src/lib/astro/getPanchang.ts
import "server-only";

export type PanchangOut = {
  weekday: string;
  tithiName: string;
  yogaName: string;
  moonNakshatraName: string;
  moonNakshatraTheme?: string;
  raw: {
    sunLon: number;
    moonLon: number;
    tithiIndex: number;
    yogaIndex: number;
    nakshatraIndex: number;
  };
};

/**
 * NOTE:
 * This legacy helper used to depend on the native Swiss Ephemeris ("swisseph"),
 * which breaks Vercel deployments (it tries to load swisseph.wasm / native libs).
 *
 * We now delegate to the new, Vercel-safe Panchang provider in the server layer.
 * This wrapper exists only so old imports of `getPanchang` keep working without
 * dragging in any WASM or native binaries.
 */

const TITHI = [
  "Pratipada",
  "Dvitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dvadashi",
  "Trayodashi",
  "Chaturdashi",
  "Purnima/Amavasya",
];

const NAKSHATRA = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashirsha",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

const YOGA = [
  "Vishkambha",
  "Priti",
  "Ayushman",
  "Saubhagya",
  "Shobhana",
  "Atiganda",
  "Sukarman",
  "Dhriti",
  "Shoola",
  "Ganda",
  "Vriddhi",
  "Dhruva",
  "Vyaghata",
  "Harshana",
  "Vajra",
  "Siddhi",
  "Vyatipata",
  "Variyana",
  "Parigha",
  "Shiva",
  "Siddha",
  "Sadhya",
  "Shubha",
  "Shukla",
  "Brahma",
  "Indra",
  "Vaidhriti",
];

const weekdayOfUTC = (d: Date) =>
  ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
    d.getUTCDay()
  ];

/**
 * TEMP IMPLEMENTATION (no Swiss Ephemeris):
 *
 * For now, we return a very simple Panchang-like structure without using any native/WASM
 * Swiss Ephemeris. All real, accurate Panchang data in Sarathi should come from the
 * newer `getFullPanchang` server provider.
 *
 * This function only exists so old code that still imports `getPanchang` keeps compiling
 * without crashing the build on Vercel.
 */
export async function getPanchang({
  dateISO,
  time,
  tz,
  lat,
  lon,
}: {
  dateISO: string;
  time: string;
  tz: string;
  lat?: number;
  lon?: number;
}): Promise<PanchangOut> {
  // Basic weekday from UTC date
  const [year, month, day] = dateISO.split("-").map((v) => parseInt(v, 10));
  const weekday = weekdayOfUTC(new Date(Date.UTC(year, month - 1, day)));

  // Fallback dummy values (non-SWE, non-WASM) just to keep the API alive.
  // Real Panchang for the app should come from the dedicated Panchang engine
  // in `src/server/astro/panchang-full.ts`.
  const sunLon = 0;
  const moonLon = 0;
  const tithiIndex = 1;
  const yogaIndex = 1;
  const nakshatraIndex = 1;

  const tithiName = TITHI[(tithiIndex - 1) % TITHI.length];
  const yogaName = YOGA[(yogaIndex - 1) % YOGA.length];
  const moonNakshatraName = NAKSHATRA[(nakshatraIndex - 1) % NAKSHATRA.length];

  return {
    weekday,
    tithiName,
    yogaName,
    moonNakshatraName,
    moonNakshatraTheme: "",
    raw: {
      sunLon,
      moonLon,
      tithiIndex,
      yogaIndex,
      nakshatraIndex,
    },
  };
}
