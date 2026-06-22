import "server-only";

type BuildHouseDataParams = {
  ascendant: {
    sign: string;
    signNum: number;
    degree: number;
    house: number;
  };
  natalPlanets: Array<{
    planet: string;
    sign: string;
    signNum: number;
    degree: number;
    house: number;
  }>;
};

const SIGN_NAMES = [
  "",
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

const SIGN_LORDS: Record<number, string> = {
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

function wrapSignNum(n: number): number {
  const x = ((n - 1) % 12 + 12) % 12;
  return x + 1;
}

function getRelativeHouse(signNum: number, ascSignNum: number): number {
  return ((signNum - ascSignNum + 12) % 12) + 1;
}

export async function buildHouseData(params: BuildHouseDataParams) {
  const { ascendant, natalPlanets } = params;

  const out: Array<{
    house: number;
    sign: string;
    signNum: number;
    lord: string;
    lordPlacedHouse: number | null;
    lordPlacedSign: string | null;
  }> = [];

  for (let house = 1; house <= 12; house += 1) {
    const signNum = wrapSignNum(ascendant.signNum + (house - 1));
    const sign = SIGN_NAMES[signNum];
    const lord = SIGN_LORDS[signNum];

    const lordPlanet =
  natalPlanets.find(
    (p) => String(p.planet).toLowerCase() === lord.toLowerCase()
  ) ?? null;

    out.push({
      house,
      sign,
      signNum,
      lord,
      lordPlacedHouse:
        lordPlanet && typeof lordPlanet.signNum === "number"
          ? getRelativeHouse(lordPlanet.signNum, ascendant.signNum)
          : null,
      lordPlacedSign: lordPlanet?.sign ?? null,
    });
  }

  return out;
}