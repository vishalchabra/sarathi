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

function wrap360(x: number) {
  x = x % 360;
  return x < 0 ? x + 360 : x;
}

function navamsaSign(deg: number): string {
  const signIndex = Math.floor(wrap360(deg) / 30); // 0..11
  const inSignDeg = wrap360(deg) % 30;
  const division = Math.floor(inSignDeg / (30 / 9)); // 0..8

  // Movable: start from same sign
  // Fixed: start from 9th from sign
  // Dual: start from 5th from sign
  const movable = [0, 3, 6, 9];   // Aries, Cancer, Libra, Capricorn
  const fixed   = [1, 4, 7, 10];  // Taurus, Leo, Scorpio, Aquarius
  const dual    = [2, 5, 8, 11];  // Gemini, Virgo, Sagittarius, Pisces

  let startIndex = signIndex;

  if (fixed.includes(signIndex)) {
    startIndex = (signIndex + 8) % 12; // 9th from sign
  } else if (dual.includes(signIndex)) {
    startIndex = (signIndex + 4) % 12; // 5th from sign
  }

  return SIGNS[(startIndex + division) % 12];
}

function dasamsaSign(deg: number): string {
  const signIndex = Math.floor(wrap360(deg) / 30); // 0..11
  const inSignDeg = wrap360(deg) % 30;
  const division = Math.floor(inSignDeg / 3); // 0..9

  // Odd signs: start from same sign
  // Even signs: start from 9th from sign
  const isOddSign = signIndex % 2 === 0; // Aries=0, Gemini=2, etc.

  const startIndex = isOddSign
    ? signIndex
    : (signIndex + 8) % 12; // 9th from sign

  return SIGNS[(startIndex + division) % 12];
}

function getVargaSignFunction(v: number) {
  switch (v) {
    case 9:
      return navamsaSign;
    case 10:
      return dasamsaSign;
    default:
      return (deg: number) => {
        const signIndex = Math.floor(wrap360(deg) / 30);
        const inSignDeg = wrap360(deg) % 30;
        const part = 30 / v;
        const division = Math.floor(inSignDeg / part);
        const newSign = (signIndex * v + division) % 12;
        return SIGNS[newSign];
      };
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

  // Ascendant from trusted asc longitude
  const ascSign = signFn(opts.ascLon);

  const planets = opts.natalPlanets
    .filter((p) => typeof p?.lon === "number")
    .map((p) => {
      const plLon = p.lon as number;

      // IMPORTANT:
      // Each planet, including Rahu and Ketu, must be mapped independently
      const plSign = signFn(plLon);
      const house = computeVargaHouses(ascSign, plSign);

      return {
        name: p.planet,
        sign: plSign,
        house,
        siderealLongitude: plLon,
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

  const ascLon = typeof natalAscendant?.lon === "number" ? natalAscendant.lon : null;

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

  const d9 = buildOneVargaFromTrustedAsc({
    varga: 9,
    ascLon,
    natalPlanets: natalPlanets ?? [],
  });

  const d10 = buildOneVargaFromTrustedAsc({
    varga: 10,
    ascLon,
    natalPlanets: natalPlanets ?? [],
  });

  if (plan === "light") {
    return {
      d9,
      d10,
      sourceNote: `Computed from trusted natal ascendant and longitudes for ${birth.dateISO}`,
    };
  }

  return {
    d2: buildOneVargaFromTrustedAsc({ varga: 2, ascLon, natalPlanets: natalPlanets ?? [] }),
    d3: buildOneVargaFromTrustedAsc({ varga: 3, ascLon, natalPlanets: natalPlanets ?? [] }),
    d7: buildOneVargaFromTrustedAsc({ varga: 7, ascLon, natalPlanets: natalPlanets ?? [] }),
    d9,
    d10,
    d12: buildOneVargaFromTrustedAsc({ varga: 12, ascLon, natalPlanets: natalPlanets ?? [] }),
    d16: buildOneVargaFromTrustedAsc({ varga: 16, ascLon, natalPlanets: natalPlanets ?? [] }),
    d20: buildOneVargaFromTrustedAsc({ varga: 20, ascLon, natalPlanets: natalPlanets ?? [] }),
    d24: buildOneVargaFromTrustedAsc({ varga: 24, ascLon, natalPlanets: natalPlanets ?? [] }),
    d30: buildOneVargaFromTrustedAsc({ varga: 30, ascLon, natalPlanets: natalPlanets ?? [] }),
    d60: buildOneVargaFromTrustedAsc({ varga: 60, ascLon, natalPlanets: natalPlanets ?? [] }),
    sourceNote: `Computed from trusted natal ascendant and longitudes for ${birth.dateISO}`,
  };
}