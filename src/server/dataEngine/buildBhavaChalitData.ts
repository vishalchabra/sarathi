import "server-only";

type Planet = {
  planet: string;
  sign: string;
  signNum: number;
  degree: number;
  house: number;
  lon?: number | null;
  siderealLongitude?: number | null;
  nakshatra?: string | null;
  pada?: number | null;
  retrograde?: boolean;
  combust?: boolean;
};

type Params = {
  ascendant: {
    sign: string;
    signNum: number;
    degree: number;
    house: number;
  };
  natalPlanets: Planet[];
  cusps: number[];
  system?: string;
};

function wrap360(x: number) {
  let v = x % 360;
  if (v < 0) v += 360;
  return v;
}

function getHouseFromCusps(lon: number, cusps: number[]) {
  const x = wrap360(lon);

  if (!Array.isArray(cusps) || cusps.length < 12) return null;

  for (let i = 0; i < 12; i += 1) {
    const start = wrap360(cusps[i]);
    const end = wrap360(cusps[(i + 1) % 12]);

    if (start < end) {
      if (x >= start && x < end) return i + 1;
    } else {
      if (x >= start || x < end) return i + 1;
    }
  }

  return null;
}

export async function buildBhavaChalitData(params: Params) {
  const { ascendant, natalPlanets, cusps, system = "equal" } = params;

  const planets = (Array.isArray(natalPlanets) ? natalPlanets : []).map((p) => {
    const lon =
  typeof p.siderealLongitude === "number"
    ? p.siderealLongitude
    : typeof p.lon === "number"
    ? p.lon
    : (p.signNum - 1) * 30 + p.degree;

const chalitHouse = getHouseFromCusps(lon, cusps);

    return {
      planet: p.planet,
      sign: p.sign,
      signNum: p.signNum,
      degree: p.degree,
      house: chalitHouse,
      lon,
      siderealLongitude: lon,
      nakshatra: p.nakshatra ?? null,
      pada: p.pada ?? null,
      retrograde: p.retrograde ?? false,
      combust: p.combust ?? false,
      rashiHouse: p.house ?? null,
    };
  });

  return {
    ascendant: {
      ...ascendant,
      house: 1,
    },
    system,
    cusps,
    planets,
  };
}

export default buildBhavaChalitData;