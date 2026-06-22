import "server-only";

type NatalAscendantInput = {
  sign: string | null;
  signNum: number | null;
  degree: number | null;
  house: number | null;
  lon: number | null;
};

type NatalPlanetInput = {
  planet: string;
  lon: number | null;
  sign?: string | null;
  degree?: number | null;
  nakshatra?: string | null;
  pada?: number | null;
  house?: number | null;
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

const NAKSHATRA_NAMES = [
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
] as const;

function normalize360(v: number) {
  const x = v % 360;
  return x < 0 ? x + 360 : x;
}

function getSignFromLon(lon: number | null | undefined) {
  if (typeof lon !== "number" || Number.isNaN(lon)) return null;

  const signs = [
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

  const idx = Math.floor(normalize360(lon) / 30);
  return signs[idx] ?? null;
}

function getDegreeInSign(lon: number | null | undefined) {
  if (typeof lon !== "number" || Number.isNaN(lon)) return null;
  return Number((normalize360(lon) % 30).toFixed(2));
}

function getNakshatraAndPadaFromLon(lon: number | null | undefined) {
  if (typeof lon !== "number" || Number.isNaN(lon)) {
    return { nakshatra: null, pada: null };
  }

  const x = normalize360(lon);
  const nakSpan = 360 / 27;
  const idx = Math.floor(x / nakSpan);
  const withinNak = x % nakSpan;
  const pada = Math.floor(withinNak / (nakSpan / 4)) + 1;

  return {
    nakshatra: NAKSHATRA_NAMES[idx] ?? null,
    pada,
  };
}

function getHouseFromAsc(pointSign: string | null, natalAscSign: string | null) {
  if (!pointSign || !natalAscSign) return null;

  const pointNum = SIGN_TO_NUM[pointSign] ?? 0;
  const ascNum = SIGN_TO_NUM[natalAscSign] ?? 0;

  if (!pointNum || !ascNum) return null;

  return ((pointNum - ascNum + 12) % 12) + 1;
}

function isDusthana(house: number | null) {
  return [6, 8, 12].includes(Number(house));
}

function isUpachaya(house: number | null) {
  return [3, 6, 10, 11].includes(Number(house));
}

function isKendra(house: number | null) {
  return [1, 4, 7, 10].includes(Number(house));
}

function isTrikona(house: number | null) {
  return [1, 5, 9].includes(Number(house));
}

function isMaraka(house: number | null) {
  return [2, 7].includes(Number(house));
}

function buildPointFromLongitude(params: {
  lon: number | null;
  natalAscendant: NatalAscendantInput;
  source: "solar_formula";
  formulaKey: string;
}) {
  const lon =
    typeof params.lon === "number" && Number.isFinite(params.lon)
      ? normalize360(params.lon)
      : null;

  const sign = getSignFromLon(lon);
  const degree = getDegreeInSign(lon);
  const nakInfo = getNakshatraAndPadaFromLon(lon);
  const houseFromAsc = getHouseFromAsc(sign, params.natalAscendant.sign);

  return {
    source: params.source,
    formulaKey: params.formulaKey,
    lon,
    sign,
    degree,
    nakshatra: nakInfo.nakshatra,
    pada: nakInfo.pada,
    houseFromAsc,
    flags: {
      isDusthana: isDusthana(houseFromAsc),
      isUpachaya: isUpachaya(houseFromAsc),
      isKendra: isKendra(houseFromAsc),
      isTrikona: isTrikona(houseFromAsc),
      isMaraka: isMaraka(houseFromAsc),
    },
  };
}

function getSunLongitude(natalPlanets: NatalPlanetInput[]) {
  const sunRow =
    Array.isArray(natalPlanets)
      ? natalPlanets.find((p) => p?.planet === "Sun") ?? null
      : null;

  return typeof sunRow?.lon === "number" ? normalize360(sunRow.lon) : null;
}

/**
 * Classical solar shadow-point chain used here:
 *
 * Dhuma      = Sun + 133°20'
 * Vyatipata  = 360° - Dhuma
 * Parivesha  = Vyatipata + 180°
 * Indrachapa = 360° - Parivesha
 * Upaketu    = Indrachapa + 16°40'
 *
 * All results normalized to 0°–360°.
 */
function computeSolarShadowLongitudes(sunLon: number) {
  const dhuma = normalize360(sunLon + 133 + 20 / 60); // 133°20'
  const vyatipata = normalize360(360 - dhuma);
  const parivesha = normalize360(vyatipata + 180);
  const indrachapa = normalize360(360 - parivesha);
  const upaketu = normalize360(indrachapa + 16 + 40 / 60); // 16°40'

  return {
    dhuma,
    vyatipata,
    parivesha,
    indrachapa,
    upaketu,
  };
}

export function buildSolarShadowPoints(params: {
  natalPlanets: NatalPlanetInput[];
  natalAscendant: NatalAscendantInput;
}) {
  const { natalPlanets, natalAscendant } = params;

  const emptyResponse = {
    methodId: "solar_shadow_points_v1",
    traditionLabel: "Sarathi Classical Solar Shadow Points",
    dhuma: null,
    vyatipata: null,
    parivesha: null,
    indrachapa: null,
    upaketu: null,
  };

  const sunLon = getSunLongitude(natalPlanets);
  if (sunLon == null) {
    return emptyResponse;
  }

  const computed = computeSolarShadowLongitudes(sunLon);

  return {
    methodId: "solar_shadow_points_v1",
    traditionLabel: "Sarathi Classical Solar Shadow Points",

    dhuma: buildPointFromLongitude({
      lon: computed.dhuma,
      natalAscendant,
      source: "solar_formula",
      formulaKey: "dhuma",
    }),

    vyatipata: buildPointFromLongitude({
      lon: computed.vyatipata,
      natalAscendant,
      source: "solar_formula",
      formulaKey: "vyatipata",
    }),

    parivesha: buildPointFromLongitude({
      lon: computed.parivesha,
      natalAscendant,
      source: "solar_formula",
      formulaKey: "parivesha",
    }),

    indrachapa: buildPointFromLongitude({
      lon: computed.indrachapa,
      natalAscendant,
      source: "solar_formula",
      formulaKey: "indrachapa",
    }),

    upaketu: buildPointFromLongitude({
      lon: computed.upaketu,
      natalAscendant,
      source: "solar_formula",
      formulaKey: "upaketu",
    }),
  };
}