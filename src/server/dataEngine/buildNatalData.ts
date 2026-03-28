import "server-only";

import { DateTime } from "luxon";
import type { BirthInput, DataEnginePlan } from "./types";
import { getAscendant } from "@/server/astro/asc";
import { computePlacements } from "@/server/astro/placements";

type BuildNatalDataParams = {
  birth: BirthInput;
  plan: DataEnginePlan;
};

const SIGN_TO_NUM: Record<string, number> = {
  Aries: 1,
  Taurus: 2,
  Gemini: 3,
  Cancer: 4,
  Leo: 5,
  Virgo: 6,
  Libra: 7,
  Scorpio: 8,
  Sagittarius: 9,
  Capricorn: 10,
  Aquarius: 11,
  Pisces: 12,
};

const NAKSHATRAS_27 = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
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

function wrap360(x: number) {
  let v = x % 360;
  return v < 0 ? v + 360 : v;
}

function getNakshatraPadaFromLon(lon: number): {
  nakshatra: string;
  pada: number;
} {
  const safeLon = wrap360(lon);
  const nakSize = 360 / 27; // 13°20'
  const nakIndex = Math.floor(safeLon / nakSize);
  const nakshatra = NAKSHATRAS_27[nakIndex] ?? "Unknown";

  const withinNak = safeLon % nakSize;
  const padaSize = nakSize / 4; // 3°20'
  const pada = Math.floor(withinNak / padaSize) + 1;

  return {
    nakshatra,
    pada,
  };
}

function toBirthUTCISO(birth: BirthInput): string {
  return DateTime.fromISO(`${birth.dateISO}T${birth.time}`, {
    zone: birth.timezone,
  })
    .toUTC()
    .toISO({ suppressMilliseconds: false })!;
}

function getLordshipsForVirgoStyleWholeSign(
  ascSignNum: number,
  planet: string
): number[] {
  const houseToSignNum = (house: number) => ((ascSignNum + (house - 2) + 12) % 12) + 1;

  const signLord: Record<number, string> = {
    1: "Mars",
    2: "Venus",
    3: "Mercury",
    4: "Moon",
    5: "Sun",
    6: "Mercury",
    7: "Venus",
    8: "Mars",
    9: "Jupiter",
    10: "Saturn",
    11: "Saturn",
    12: "Jupiter",
  };

  const out: number[] = [];
  for (let house = 1; house <= 12; house++) {
    const signNum = houseToSignNum(house);
    if (signLord[signNum] === planet) out.push(house);
  }
  return out;
}

export async function buildNatalData(params: BuildNatalDataParams) {
  const { birth } = params;

  const astroBirth = {
    dateISO: birth.dateISO,
    time: birth.time,
    tz: birth.timezone,
    lat: birth.lat,
    lon: birth.lon,
  };

  const asc = await getAscendant(astroBirth);
  const placements = await computePlacements(astroBirth);

  const ascSignNum = SIGN_TO_NUM[asc.sign] ?? 0;
  const ascDegree = Number((wrap360(asc.lon) % 30).toFixed(2));

  const planets = (Array.isArray(placements) ? placements : []).map((p) => {
    const signNum = SIGN_TO_NUM[p.sign] ?? 0;
    const lon = Number(p.lon);
    const nk = getNakshatraPadaFromLon(lon);

    return {
      planet: p.planet,
      sign: p.sign,
      signNum,
      degree: Number(Number(p.degree).toFixed(2)),
      house: typeof p.house === "number" ? p.house : null,
      nakshatra: nk.nakshatra,
      pada: nk.pada,
      retrograde: p.planet === "Rahu" || p.planet === "Ketu",
      combust: false,
      lon,
      lordships:
        ascSignNum > 0
          ? getLordshipsForVirgoStyleWholeSign(ascSignNum, p.planet)
          : [],
    };
  });

  const moon = planets.find((p) => p.planet === "Moon") || null;

  return {
    ayanamsa: "Lahiri",
    birthUTCISO: toBirthUTCISO(birth),
    moonLonSidDeg: moon?.lon ?? null,
    ascendant: {
      sign: asc.sign,
      signNum: ascSignNum,
      degree: ascDegree,
      house: 1,
      lon: Number(wrap360(asc.lon).toFixed(4)),
    },
    planets,
    sourceNote: `Real natal data for ${birth.dateISO} ${birth.time} ${birth.timezone}`,
  };
}