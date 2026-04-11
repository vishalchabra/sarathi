import "server-only";

type Planet = {
  planet: string;
  sign: string;
  signNum: number;
  degree: number;
  house: number; // rashi house
};

type Params = {
  ascendant: {
    sign: string;
    signNum: number;
  };
  natalPlanets: Planet[];
};

function wrapHouse(h: number) {
  if (h < 1) return h + 12;
  if (h > 12) return h - 12;
  return h;
}

function getShiftedHouse(rashiHouse: number, degree: number) {
  // narrow boundary zones (more realistic)
  if (degree < 8) {
    return wrapHouse(rashiHouse - 1);
  }

  if (degree > 23) {
    return wrapHouse(rashiHouse + 1);
  }

  return rashiHouse;
}

export async function buildClassicChalit(params: Params) {
  const { ascendant, natalPlanets } = params;

  const planets = natalPlanets.map((p) => {
    const chalitHouse = getShiftedHouse(p.house, p.degree);

    return {
      ...p,
      house: chalitHouse,
      rashiHouse: p.house,
    };
  });

  return {
    ascendant: {
      sign: ascendant.sign,
      signNum: ascendant.signNum,
      house: 1,
    },
    system: "classic",
    planets,
  };
}

export default buildClassicChalit;