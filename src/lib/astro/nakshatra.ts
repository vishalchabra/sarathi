// FILE: src/lib/astro/nakshatra.ts

// Basic Vimshottari nakshatra data, Lahiri ayanamsa context.
// Each nakshatra spans exactly 13°20' = 13.333... degrees sidereal.
// We store:
//  - name
//  - startDeg / endDeg in SIDEREAL ecliptic longitude (0° Aries = 0)
//  - lord (dasha ruler)
//  - keywords (tone we can surface in UI)

// Order of lords is the same 9-planet Vimshottari cycle
// Ketu → Venus → Sun → Moon → Mars → Rahu → Jupiter → Saturn → Mercury
// That sequence repeats every 9 nakshatras.

export type NakshatraInfo = {
  name: string;
  startDeg: number;   // inclusive
  endDeg: number;     // exclusive
  lord: "Ketu" | "Venus" | "Sun" | "Moon" | "Mars" | "Rahu" | "Jupiter" | "Saturn" | "Mercury";
  keywords: string;
};

// 27 nakshatras, 13°20' each.
// We'll define them in order from 0° Aries sidereal.
const NAKSHATRAS: NakshatraInfo[] = [
  // 0
  {
    name: "Ashwini",
    startDeg: 0,
    endDeg: 13.3333333333,
    lord: "Ketu",
    keywords: "fast healing, new starts, urgent desire to move forward",
  },
  // 1
  {
    name: "Bharani",
    startDeg: 13.3333333333,
    endDeg: 26.6666666667,
    lord: "Venus",
    keywords: "duty, intensity, life/death thresholds, personal power",
  },
  // 2
  {
    name: "Krittika",
    startDeg: 26.6666666667,
    endDeg: 40,
    lord: "Sun",
    keywords: "purification, pride, cutting away what’s not true",
  },
  // 3
  {
    name: "Rohini",
    startDeg: 40,
    endDeg: 53.3333333333,
    lord: "Moon",
    keywords: "nurturing, attraction, beauty, sensual growth",
  },
  // 4
  {
    name: "Mrigashira",
    startDeg: 53.3333333333,
    endDeg: 66.6666666667,
    lord: "Mars",
    keywords: "searching, curiosity, pursuit, restless desire",
  },
  // 5
  {
    name: "Ardra",
    startDeg: 66.6666666667,
    endDeg: 80,
    lord: "Rahu",
    keywords: "storm energy, emotional catharsis, radical change",
  },
  // 6
  {
    name: "Punarvasu",
    startDeg: 80,
    endDeg: 93.3333333333,
    lord: "Jupiter",
    keywords: "renewal, return to center, faith after difficulty",
  },
  // 7
  {
    name: "Pushya",
    startDeg: 93.3333333333,
    endDeg: 106.6666666667,
    lord: "Saturn",
    keywords: "duty, service, commitment, structured care",
  },
  // 8
  {
    name: "Ashlesha",
    startDeg: 106.6666666667,
    endDeg: 120,
    lord: "Mercury",
    keywords: "mental grip, strategy, charisma, subtle influence",
  },
  // 9
  {
    name: "Magha",
    startDeg: 120,
    endDeg: 133.3333333333,
    lord: "Ketu",
    keywords: "ancestry, status, honor, throne, legacy obligations",
  },
  // 10
  {
    name: "Purva Phalguni",
    startDeg: 133.3333333333,
    endDeg: 146.6666666667,
    lord: "Venus",
    keywords: "pleasure, charisma, romance, ease, creative shine",
  },
  // 11
  {
    name: "Uttara Phalguni",
    startDeg: 146.6666666667,
    endDeg: 160,
    lord: "Sun",
    keywords: "agreements, loyalty, vows, sustaining partnership",
  },
  // 12
  {
    name: "Hasta",
    startDeg: 160,
    endDeg: 173.3333333333,
    lord: "Moon",
    keywords: "craft, skill with hands, control through care",
  },
  // 13
  {
    name: "Chitra",
    startDeg: 173.3333333333,
    endDeg: 186.6666666667,
    lord: "Mars",
    keywords: "design, beauty through effort, visible impact",
  },
  // 14
  {
    name: "Swati",
    startDeg: 186.6666666667,
    endDeg: 200,
    lord: "Rahu",
    keywords: "independence, self-direction, wind, freedom",
  },
  // 15
  {
    name: "Vishakha",
    startDeg: 200,
    endDeg: 213.3333333333,
    lord: "Jupiter",
    keywords: "focus, oath, chosen goal, stepping toward destiny",
  },
  // 16
  {
    name: "Anuradha",
    startDeg: 213.3333333333,
    endDeg: 226.6666666667,
    lord: "Saturn",
    keywords: "loyalty, devotion, disciplined love, persistence",
  },
  // 17
  {
    name: "Jyeshtha",
    startDeg: 226.6666666667,
    endDeg: 240,
    lord: "Mercury",
    keywords: "power ranking, seniority, clever survival",
  },
  // 18
  {
    name: "Mula",
    startDeg: 240,
    endDeg: 253.3333333333,
    lord: "Ketu",
    keywords: "root cause, destruction for truth, going to the core",
  },
  // 19
  {
    name: "Purva Ashadha",
    startDeg: 253.3333333333,
    endDeg: 266.6666666667,
    lord: "Venus",
    keywords: "victory drive, persuasion, spreading influence",
  },
  // 20
  {
    name: "Uttara Ashadha",
    startDeg: 266.6666666667,
    endDeg: 280,
    lord: "Sun",
    keywords: "authority, oath to purpose, long-range responsibility",
  },
  // 21
  {
    name: "Shravana",
    startDeg: 280,
    endDeg: 293.3333333333,
    lord: "Moon",
    keywords: "listening, learning through stories, reputation",
  },
  // 22
  {
    name: "Dhanishta",
    startDeg: 293.3333333333,
    endDeg: 306.6666666667,
    lord: "Mars",
    keywords: "rhythm, resourcefulness, group power, status",
  },
  // 23
  {
    name: "Shatabhisha",
    startDeg: 306.6666666667,
    endDeg: 320,
    lord: "Rahu",
    keywords: "detox, secrecy, radical healing, outsider vision",
  },
  // 24
  {
    name: "Purva Bhadrapada",
    startDeg: 320,
    endDeg: 333.3333333333,
    lord: "Jupiter",
    keywords: "intensity, vows, transformation, deep conviction",
  },
  // 25
  {
    name: "Uttara Bhadrapada",
    startDeg: 333.3333333333,
    endDeg: 346.6666666667,
    lord: "Saturn",
    keywords: "stability, endurance, carrying karmic weight with grace",
  },
  // 26
  {
    name: "Revati",
    startDeg: 346.6666666667,
    endDeg: 360,
    lord: "Mercury",
    keywords: "safe passage, completion, compassion, guidance",
  },
];

// normalize degree to [0,360)
function normDeg360(d: number) {
  const x = d % 360;
  return x < 0 ? x + 360 : x;
}

/**
 * getNakshatraForLongitude
 * siderealLonDeg: sidereal ecliptic longitude in degrees [0,360)
 *
 * returns the nakshatra info that covers that longitude
 */
export function getNakshatraForLongitude(siderealLonDeg: number): {
  name: string;
  keywords: string;
  lord: NakshatraInfo["lord"];
  startDeg: number;
  endDeg: number;
  // extra convenience for dasha math:
  spanDeg: number;        // usually 13.333...
  offsetWithinNak: number; // degrees from startDeg
  fractionElapsed: number; // 0..1 how much of nakshatra is DONE
  fractionRemaining: number; // 0..1 how much is LEFT
} {
  const lon = normDeg360(siderealLonDeg);

  const nak = NAKSHATRAS.find(
    (n) =>
      (lon >= n.startDeg && lon < n.endDeg) ||
      // guard last interval wrapping 360 (Revati)
      (n.endDeg === 360 && lon >= n.startDeg && lon < 360)
  );
  if (!nak) {
    // should never happen, but fallback defensively
    return {
      name: "Unknown",
      keywords: "",
      lord: "Ketu",
      startDeg: 0,
      endDeg: 0,
      spanDeg: 13.3333333333,
      offsetWithinNak: 0,
      fractionElapsed: 0,
      fractionRemaining: 1,
    };
  }

  const span = nak.endDeg - nak.startDeg; // should be ~13.3333
  const offset = lon - nak.startDeg;
  const fracElapsed = span > 0 ? offset / span : 0;
  const fracRemain = 1 - fracElapsed;

  return {
    name: nak.name,
    keywords: nak.keywords,
    lord: nak.lord,
    startDeg: nak.startDeg,
    endDeg: nak.endDeg,
    spanDeg: span,
    offsetWithinNak: offset,
    fractionElapsed: fracElapsed,
    fractionRemaining: fracRemain,
  };
}

// also useful for Vimshottari sequence math
export function getNakshatraLordForLongitude(siderealLonDeg: number) {
  return getNakshatraForLongitude(siderealLonDeg).lord;
}
