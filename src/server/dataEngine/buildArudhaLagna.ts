const SIGN_ORDER = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];

function getSignIndex(sign: string) {
  return SIGN_ORDER.indexOf(sign);
}

function getSignFromIndex(i: number) {
  return SIGN_ORDER[(i + 12) % 12];
}

// Planet lords
const LORDS: Record<number, string> = {
  1: "Mars", 2: "Venus", 3: "Mercury", 4: "Moon",
  5: "Sun", 6: "Mercury", 7: "Venus", 8: "Mars",
  9: "Jupiter", 10: "Saturn", 11: "Saturn", 12: "Jupiter"
};

export function buildArudhas({
  ascSign,
  planets,
}: {
  ascSign: string;
  planets: any[];
}) {
  function getHouseSign(house: number) {
    const ascIdx = getSignIndex(ascSign);
    return getSignFromIndex(ascIdx + house - 1);
  }

  function getPlanetSign(name: string) {
    const p = planets.find((x) => x.planet === name);
    return p?.sign ?? null;
  }

  function computeArudha(house: number) {
    const houseSign = getHouseSign(house);
    const lord = LORDS[house];
    const lordSign = getPlanetSign(lord);

    if (!lordSign) return null;

    const hIdx = getSignIndex(houseSign);
    const lIdx = getSignIndex(lordSign);

    const distance = (lIdx - hIdx + 12) % 12;
    let resultIdx = (lIdx + distance) % 12;

    // Exception rule
  if (resultIdx === hIdx || resultIdx === (hIdx + 6) % 12) {
  resultIdx = (lIdx + 9) % 12;
}

    return getSignFromIndex(resultIdx);
  }

  const arudhas: Record<string, any> = {};

  for (let i = 1; i <= 12; i++) {
    const key = i === 1 ? "AL" : `A${i}`;
    const sign = computeArudha(i);

    if (sign) {
      arudhas[key] = { sign };
    }
  }

  // UL = A12
  arudhas["UL"] = arudhas["A12"];

  return arudhas;
}