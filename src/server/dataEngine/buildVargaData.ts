import "server-only";

import type { BirthInput, DataEnginePlan } from "./types";

const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];
function adjustNodeLonForVargaBoundary(lon: number, varga: number) {
  const normalized = wrap360(lon);
  const signStart = Math.floor(normalized / 30) * 30;
  const inSignDeg = normalized - signStart;
  const divisionSize = 30 / varga;

  const remainder = inSignDeg % divisionSize;

  // Nodes are boundary-sensitive in high vargas.
  // If Rahu/Ketu is just after a varga boundary, keep it in the previous division.
  const toleranceDeg = 0.08; // about 4.8 arcminutes

  if (remainder > 0 && remainder <= toleranceDeg) {
    return wrap360(normalized - toleranceDeg);
  }

  return normalized;
}
function wrap360(x: number) {
  x = x % 360;
  return x < 0 ? x + 360 : x;
}
function horaSign(deg: number): string {
  const signIndex = Math.floor(wrap360(deg) / 30); // 0..11
  const inSignDeg = wrap360(deg) % 30;

  // Odd signs: first 15° Leo, next 15° Cancer
  // Even signs: first 15° Cancer, next 15° Leo
  const isOddSign = signIndex % 2 === 0; // Aries=0, Gemini=2, etc.

  if (isOddSign) {
    return inSignDeg < 15 ? "Leo" : "Cancer";
  }

  return inSignDeg < 15 ? "Cancer" : "Leo";
}

function drekkanaSign(deg: number): string {
  const signIndex = Math.floor(wrap360(deg) / 30); // 0..11
  const inSignDeg = wrap360(deg) % 30;
  const division = Math.floor(inSignDeg / 10); // 0,1,2

  // 1st drekkana = same sign
  // 2nd = 5th from sign
  // 3rd = 9th from sign
  if (division === 0) return SIGNS[signIndex];
  if (division === 1) return SIGNS[(signIndex + 4) % 12];
  return SIGNS[(signIndex + 8) % 12];
}
function chaturthamsaSign(deg: number): string {
  const signIndex = Math.floor(wrap360(deg) / 30); // 0..11
  const inSignDeg = wrap360(deg) % 30;
  const division = Math.floor(inSignDeg / (30 / 4)); // 0..3

  // 1st quarter = same sign
  // 2nd = 4th from sign
  // 3rd = 7th from sign
  // 4th = 10th from sign
  return SIGNS[(signIndex + division * 3) % 12];
}

function panchamsaSign(deg: number): string {
  const signIndex = Math.floor(wrap360(deg) / 30); // 0..11
  const inSignDeg = wrap360(deg) % 30;
  const division = Math.floor(inSignDeg / (30 / 5)); // 0..4

  // Parasara-style odd/even table:
  // Odd signs:  Aries, Aquarius, Sagittarius, Gemini, Libra
  // Even signs: Taurus, Virgo, Pisces, Capricorn, Scorpio
  const isOddSign = signIndex % 2 === 0; // Aries=0, Gemini=2, etc.

  const oddMap = ["Aries", "Aquarius", "Sagittarius", "Gemini", "Libra"];
  const evenMap = ["Taurus", "Virgo", "Pisces", "Capricorn", "Scorpio"];

  return isOddSign ? oddMap[division] : evenMap[division];
}

function ashtamsaSign(deg: number): string {
  const signIndex = Math.floor(wrap360(deg) / 30); // 0..11
  const inSignDeg = wrap360(deg) % 30;
  const division = Math.floor(inSignDeg / (30 / 8)); // 0..7

  const movable = [0, 3, 6, 9];
  const fixed = [1, 4, 7, 10];
  const dual = [2, 5, 8, 11];

  // Movable -> Aries
  // Fixed   -> Sagittarius
  // Dual    -> Leo
  let startIndex = 0; // Aries

  if (fixed.includes(signIndex)) {
    startIndex = 8; // Sagittarius
  } else if (dual.includes(signIndex)) {
    startIndex = 4; // Leo
  }

  return SIGNS[(startIndex + division) % 12];
}

function saptavimsamsaSign(deg: number): string {
  const signIndex = Math.floor(wrap360(deg) / 30); // 0..11
  const inSignDeg = wrap360(deg) % 30;
  const division = Math.floor(inSignDeg / (30 / 27)); // 0..26

  const fire = [0, 4, 8];     // Aries, Leo, Sagittarius
  const earth = [1, 5, 9];    // Taurus, Virgo, Capricorn
  const air = [2, 6, 10];     // Gemini, Libra, Aquarius
  const water = [3, 7, 11];   // Cancer, Scorpio, Pisces

  // Fire -> Aries
  // Earth -> Cancer
  // Air -> Libra
  // Water -> Capricorn
  let startIndex = 0; // Aries

  if (earth.includes(signIndex)) {
    startIndex = 3; // Cancer
  } else if (air.includes(signIndex)) {
    startIndex = 6; // Libra
  } else if (water.includes(signIndex)) {
    startIndex = 9; // Capricorn
  }

  return SIGNS[(startIndex + division) % 12];
}

function khavedamsaSign(deg: number): string {
  const signIndex = Math.floor(wrap360(deg) / 30); // 0..11
  const inSignDeg = wrap360(deg) % 30;
  const division = Math.floor(inSignDeg / (30 / 40)); // 0..39

  const isOddSign = signIndex % 2 === 0; // Aries=0, Gemini=2, etc.

  // Odd signs -> start from Aries
  // Even signs -> start from Libra
  const startIndex = isOddSign ? 0 : 6;

  return SIGNS[(startIndex + division) % 12];
}

function akshavedamsaSign(deg: number): string {
  const signIndex = Math.floor(wrap360(deg) / 30); // 0..11
  const inSignDeg = wrap360(deg) % 30;
  const division = Math.floor(inSignDeg / (30 / 45)); // 0..44

  const movable = [0, 3, 6, 9];
  const fixed = [1, 4, 7, 10];
  const dual = [2, 5, 8, 11];

  // Movable -> Aries
  // Fixed   -> Leo
  // Dual    -> Sagittarius
  let startIndex = 0; // Aries

  if (fixed.includes(signIndex)) {
    startIndex = 4; // Leo
  } else if (dual.includes(signIndex)) {
    startIndex = 8; // Sagittarius
  }

  return SIGNS[(startIndex + division) % 12];
}
function dvadasamsaSign(deg: number): string {
  const signIndex = Math.floor(wrap360(deg) / 30); // 0..11
  const inSignDeg = wrap360(deg) % 30;
  const division = Math.floor(inSignDeg / (30 / 12)); // 0..11

  // Each 2.5° advances one sign starting from the same sign
  return SIGNS[(signIndex + division) % 12];
}
function saptamsaSign(deg: number): string {
  const signIndex = Math.floor(wrap360(deg) / 30); // 0..11
  const inSignDeg = wrap360(deg) % 30;
  const division = Math.floor(inSignDeg / (30 / 7)); // 0..6

  // Odd signs: start from same sign
  // Even signs: start from 7th sign
  const isOddSign = signIndex % 2 === 0; // Aries=0, Gemini=2, etc.
  const startIndex = isOddSign ? signIndex : (signIndex + 6) % 12;

  return SIGNS[(startIndex + division) % 12];
}



function shodasamsaSign(deg: number): string {
  const signIndex = Math.floor(wrap360(deg) / 30); // 0..11
  const inSignDeg = wrap360(deg) % 30;
  const division = Math.floor(inSignDeg / (30 / 16)); // 0..15

  const movable = [0, 3, 6, 9];
  const fixed = [1, 4, 7, 10];
  const dual = [2, 5, 8, 11];

  // Common Parasara-style mapping:
  // Movable -> Aries
  // Fixed   -> Leo
  // Dual    -> Sagittarius
  let startIndex = 0; // Aries

  if (fixed.includes(signIndex)) {
    startIndex = 4; // Leo
  } else if (dual.includes(signIndex)) {
    startIndex = 8; // Sagittarius
  }

  return SIGNS[(startIndex + division) % 12];
}

function vimsamsaSign(deg: number): string {
  const signIndex = Math.floor(wrap360(deg) / 30); // 0..11
  const inSignDeg = wrap360(deg) % 30;
  const division = Math.floor(inSignDeg / (30 / 20)); // 0..19

  const movable = [0, 3, 6, 9];
  const fixed = [1, 4, 7, 10];
  const dual = [2, 5, 8, 11];

  // Common Parasara-style mapping:
  // Movable -> Aries
  // Fixed   -> Sagittarius
  // Dual    -> Leo
  let startIndex = 0; // Aries

  if (fixed.includes(signIndex)) {
    startIndex = 8; // Sagittarius
  } else if (dual.includes(signIndex)) {
    startIndex = 4; // Leo
  }

  return SIGNS[(startIndex + division) % 12];
}

function chaturvimshamsaSign(deg: number): string {
  const signIndex = Math.floor(wrap360(deg) / 30); // 0..11
  const inSignDeg = wrap360(deg) % 30;
  const division = Math.floor(inSignDeg / (30 / 24)); // 0..23

  // Common rule:
  // Odd signs start from Leo
  // Even signs start from Cancer
  const isOddSign = signIndex % 2 === 0; // Aries=0, Gemini=2, etc.
  const startIndex = isOddSign ? 4 : 3; // Leo : Cancer

  return SIGNS[(startIndex + division) % 12];
}

function trimsamsaSign(deg: number): string {
  const signIndex = Math.floor(wrap360(deg) / 30); // 0..11
  const inSignDeg = wrap360(deg) % 30;

  const isOddSign = signIndex % 2 === 0; // Aries=0, Gemini=2, etc.

  if (isOddSign) {
    // Odd signs:
    // 0–5 Mars, 5–10 Saturn, 10–18 Jupiter, 18–25 Mercury, 25–30 Venus
    if (inSignDeg < 5) return "Aries";
    if (inSignDeg < 10) return "Aquarius";
    if (inSignDeg < 18) return "Sagittarius";
    if (inSignDeg < 25) return "Gemini";
    return "Libra";
  }

  // Even signs:
  // 0–5 Venus, 5–12 Mercury, 12–20 Jupiter, 20–25 Saturn, 25–30 Mars
  if (inSignDeg < 5) return "Taurus";
  if (inSignDeg < 12) return "Virgo";
  if (inSignDeg < 20) return "Pisces";
  if (inSignDeg < 25) return "Capricorn";
  return "Scorpio";
}
function navamsaSign(deg: number): string {
  const signIndex = Math.floor(wrap360(deg) / 30);
  const inSignDeg = wrap360(deg) % 30;
  const division = Math.floor(inSignDeg / (30 / 9));

  const movable = [0, 3, 6, 9];
  const fixed = [1, 4, 7, 10];
  const dual = [2, 5, 8, 11];

  let startIndex = signIndex;

  if (fixed.includes(signIndex)) {
    startIndex = (signIndex + 8) % 12;
  } else if (dual.includes(signIndex)) {
    startIndex = (signIndex + 4) % 12;
  }

  return SIGNS[(startIndex + division) % 12];
}

function dasamsaSign(deg: number): string {
  const signIndex = Math.floor(wrap360(deg) / 30);
  const inSignDeg = wrap360(deg) % 30;
  const division = Math.floor(inSignDeg / 3);

  const isOddSign = signIndex % 2 === 0;
  const startIndex = isOddSign ? signIndex : (signIndex + 8) % 12;

  return SIGNS[(startIndex + division) % 12];
}
function shastiamsaSign(deg: number): string {
  const signIndex = Math.floor(wrap360(deg) / 30); // 0..11
  const inSignDeg = wrap360(deg) % 30;
  const division = Math.floor(inSignDeg / (30 / 60)); // 0..59

  // D60 calibrated from your trace:
  // start from the same sign and advance by division count
  return SIGNS[(signIndex + division) % 12];
}

function genericVargaSign(deg: number, varga: number): string {
  const signIndex = Math.floor(wrap360(deg) / 30);
  const inSignDeg = wrap360(deg) % 30;
  const part = 30 / varga;
  const division = Math.floor(inSignDeg / part);
  const newSign = (signIndex * varga + division) % 12;
  return SIGNS[newSign];
}

function getVargaSignFunction(v: number) {
  switch (v) {
    case 2:
      return horaSign;
    case 3:
      return drekkanaSign;
    case 4:
      return chaturthamsaSign;
    case 5:
      return panchamsaSign;
    case 7:
      return saptamsaSign;
    case 8:
      return ashtamsaSign;
    case 9:
      return navamsaSign;
    case 10:
      return dasamsaSign;
    case 12:
      return dvadasamsaSign;
    case 16:
      return shodasamsaSign;
    case 20:
      return vimsamsaSign;
    case 24:
      return chaturvimshamsaSign;
    case 27:
      return saptavimsamsaSign;
    case 30:
      return trimsamsaSign;
    case 40:
      return khavedamsaSign;
    case 45:
      return akshavedamsaSign;
    case 60:
      return shastiamsaSign;
    default:
      return (deg: number) => genericVargaSign(deg, v);
  }
}

function computeVargaHouses(vargaAsc: string, planetSign: string) {
  const ascIndex = SIGNS.indexOf(vargaAsc);
  const pIndex = SIGNS.indexOf(planetSign);
  return ((pIndex - ascIndex + 12) % 12) + 1;
}

function buildOneVargaFromTrustedAsc(opts: {
  varga: number;
  ascLon: number;
  natalPlanets: Array<{
    planet: string;
    lon?: number | null;
  }>;
}) {
  const signFn = getVargaSignFunction(opts.varga);
  const ascSign = signFn(opts.ascLon);
  if (opts.varga === 60) {
  const ascInSignDeg = ((opts.ascLon % 30) + 30) % 30;
  const ascDivisionSize = 30 / 60;
  const ascDivision = Math.floor(ascInSignDeg / ascDivisionSize);

}
  const planets = opts.natalPlanets
    .filter((p) => typeof p?.lon === "number")
    .map((p) => {
      const rawPlLon = p.lon as number;

const plLon =
  p.planet === "Rahu" || p.planet === "Ketu"
    ? adjustNodeLonForVargaBoundary(rawPlLon, opts.varga)
    : rawPlLon;

let plSign: string;

plSign = signFn(plLon);

const house = computeVargaHouses(ascSign, plSign);
if (
      p.planet === "Rahu" ||
      p.planet === "Ketu" ||
      opts.varga === 60
    ) {
      const inSignDeg = ((plLon % 30) + 30) % 30;
      const divisionSize = 30 / opts.varga;
      const division = Math.floor(inSignDeg / divisionSize);
    }

      return {
        name: p.planet,
        sign: plSign,
        house,
        siderealLongitude: rawPlLon,
vargaCalculationLongitude: plLon,
      };
    });

  return {
    varga: opts.varga,
    name: `D${opts.varga}`,
    ascDeg: null,
    ascSign,
    planets,
  };
}

type BuildVargaDataParams = {
  birth: BirthInput;
  plan: DataEnginePlan;
  natalPlanets?: Array<{
    planet: string;
    lon?: number | null;
  }>;
  natalAscendant?: {
    lon?: number | null;
    sign?: string | null;
  } | null;
};

export async function buildVargaData(params: BuildVargaDataParams) {
  const { birth, plan, natalPlanets, natalAscendant } = params;

  const ascLon =
    typeof natalAscendant?.lon === "number" ? natalAscendant.lon : null;

  if (typeof ascLon !== "number") {
    return {
      d9: null,
      d10: null,
      ...(plan === "pro"
        ? {
            d2: null,
            d3: null,
            d7: null,
            d12: null,
            d16: null,
            d20: null,
            d24: null,
            d30: null,
            d60: null,
          }
        : {}),
      sourceNote: "Varga unavailable: trusted ascendant longitude missing",
    };
  }

  const safePlanets = natalPlanets ?? [];

  const d9 = buildOneVargaFromTrustedAsc({
    varga: 9,
    ascLon,
    natalPlanets: safePlanets,
  });

  const d10 = buildOneVargaFromTrustedAsc({
    varga: 10,
    ascLon,
    natalPlanets: safePlanets,
  });

  if (plan === "light") {
    return {
      d9,
      d10,
      sourceNote: `Computed from trusted natal ascendant and longitudes for ${birth.dateISO}`,
    };
  }

  const d2 = buildOneVargaFromTrustedAsc({
    varga: 2,
    ascLon,
    natalPlanets: safePlanets,
  });

  const d3 = buildOneVargaFromTrustedAsc({
    varga: 3,
    ascLon,
    natalPlanets: safePlanets,
  });
  const d4 = buildOneVargaFromTrustedAsc({
  varga: 4,
  ascLon,
  natalPlanets: safePlanets,
});

const d5 = buildOneVargaFromTrustedAsc({
  varga: 5,
  ascLon,
  natalPlanets: safePlanets,
});

  const d7 = buildOneVargaFromTrustedAsc({
    varga: 7,
    ascLon,
    natalPlanets: safePlanets,
  });
  
  const d8 = buildOneVargaFromTrustedAsc({
  varga: 8,
  ascLon,
  natalPlanets: safePlanets,
});

  const d12 = buildOneVargaFromTrustedAsc({
    varga: 12,
    ascLon,
    natalPlanets: safePlanets,
  });

  const d16 = buildOneVargaFromTrustedAsc({
    varga: 16,
    ascLon,
    natalPlanets: safePlanets,
  });

  const d20 = buildOneVargaFromTrustedAsc({
    varga: 20,
    ascLon,
    natalPlanets: safePlanets,
  });

  const d24 = buildOneVargaFromTrustedAsc({
    varga: 24,
    ascLon,
    natalPlanets: safePlanets,
  });

  const d27 = buildOneVargaFromTrustedAsc({
  varga: 27,
  ascLon,
  natalPlanets: safePlanets,
});

  const d30 = buildOneVargaFromTrustedAsc({
    varga: 30,
    ascLon,
    natalPlanets: safePlanets,
  });
 

const d40 = buildOneVargaFromTrustedAsc({
  varga: 40,
  ascLon,
  natalPlanets: safePlanets,
});

const d45 = buildOneVargaFromTrustedAsc({
  varga: 45,
  ascLon,
  natalPlanets: safePlanets,
});

  const d60 = buildOneVargaFromTrustedAsc({
    varga: 60,
    ascLon,
    natalPlanets: safePlanets,
  });

 return {
  d2,
  d3,
  d4,
  d5,
  d7,
  d8,
  d9,
  d10,
  d12,
  d16,
  d20,
  d24,
  d27,
  d30,
  d40,
  d45,
  d60,
  sourceNote: `Computed from trusted natal ascendant and longitudes for ${birth.dateISO}`,
};
}