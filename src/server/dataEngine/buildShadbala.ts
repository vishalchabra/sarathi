type PlanetInput = {
  planet: string;
  sign?: string;
  house?: number;
  degree?: number;
  lon?: number;
  speed?: number | null;
  speedLon?: number | null;
  longitudeSpeed?: number | null;
  retrograde?: boolean;
  cheshtaBala?: number | null;
  cheshtaVirupas?: number | null;
  cheshtaState?: string | null;
  declination?: number | null;
  declinationDeg?: number | null;
  dec?: number | null;
  abdaLord?: string | null;
  masaLord?: string | null;
  varaLord?: string | null;
  birthPart?: 1 | 2 | 3 | null;
};

type VargaPlanet = {
  name?: string;
  planet?: string;
  sign?: string;
};

type VargaChart = {
  planets?: VargaPlanet[];
};

type VargaData = {
  d2?: VargaChart | null;
  d3?: VargaChart | null;
  d7?: VargaChart | null;
  d9?: VargaChart | null;
  d12?: VargaChart | null;
  d30?: VargaChart | null;
};

type ShadbalaAspect = {
  planetA?: string;
  planetB?: string;
  from?: string;
  to?: string;
  aspectingPlanet?: string;
  aspectedPlanet?: string;
  orb?: number;
  strength?: number;
  virupas?: number;
  tone?: "supportive" | "challenging" | "mixed" | string;
};

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

const CORE_PLANETS = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
];

const BENEFICS = new Set(["Jupiter", "Venus"]);
const MALEFICS = new Set(["Sun", "Mars", "Saturn"]);

const SIGN_LORDS: Record<string, string> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

const OWN_SIGNS: Record<string, string[]> = {
  Sun: ["Leo"],
  Moon: ["Cancer"],
  Mars: ["Aries", "Scorpio"],
  Mercury: ["Gemini", "Virgo"],
  Jupiter: ["Sagittarius", "Pisces"],
  Venus: ["Taurus", "Libra"],
  Saturn: ["Capricorn", "Aquarius"],
};

const MOOLATRIKONA_SIGNS: Record<string, string> = {
  Sun: "Leo",
  Moon: "Taurus",
  Mars: "Aries",
  Mercury: "Virgo",
  Jupiter: "Sagittarius",
  Venus: "Libra",
  Saturn: "Aquarius",
};

const NATURAL_RELATIONSHIPS: Record<
  string,
  { friends: string[]; enemies: string[] }
> = {
  Sun: { friends: ["Moon", "Mars", "Jupiter"], enemies: ["Venus", "Saturn"] },
  Moon: { friends: ["Sun", "Mercury"], enemies: [] },
  Mars: { friends: ["Sun", "Moon", "Jupiter"], enemies: ["Mercury"] },
  Mercury: { friends: ["Sun", "Venus"], enemies: ["Moon"] },
  Jupiter: { friends: ["Sun", "Moon", "Mars"], enemies: ["Mercury", "Venus"] },
  Venus: { friends: ["Mercury", "Saturn"], enemies: ["Sun", "Moon"] },
  Saturn: { friends: ["Mercury", "Venus"], enemies: ["Sun", "Moon", "Mars"] },
};

const NATURAL_STRENGTH_VIRUPAS: Record<string, number> = {
  Sun: 60,
  Moon: 51.42,
  Mars: 17.16,
  Mercury: 25.74,
  Jupiter: 34.26,
  Venus: 42.84,
  Saturn: 8.58,
};

const EXALTATION_LON: Record<string, number> = {
  Sun: 10,
  Moon: 33,
  Mars: 298,
  Mercury: 165,
  Jupiter: 95,
  Venus: 357,
  Saturn: 200,
};


const EXALTATION_SIGNS: Record<string, string> = {
  Sun: "Aries",
  Moon: "Taurus",
  Mars: "Capricorn",
  Mercury: "Virgo",
  Jupiter: "Cancer",
  Venus: "Pisces",
  Saturn: "Libra",
};

const DEBILITATION_SIGNS: Record<string, string> = {
  Sun: "Libra",
  Moon: "Scorpio",
  Mars: "Cancer",
  Mercury: "Pisces",
  Jupiter: "Capricorn",
  Venus: "Virgo",
  Saturn: "Aries",
};

const MIN_REQUIREMENT_RUPAS: Record<string, number> = {
  Sun: 5,
  Moon: 6,
  Mars: 5,
  Mercury: 7,
  Jupiter: 6.5,
  Venus: 5.5,
  Saturn: 5,
};

function round2(n: number) {
  return Number(n.toFixed(2));
}

function getSignIndex(sign?: string | null) {
  return sign ? SIGNS.indexOf(sign) : -1;
}

function wrap360(x: number) {
  const v = x % 360;
  return v < 0 ? v + 360 : v;
}

function getPlanetLon(p: PlanetInput) {
  if (typeof p.lon === "number") return wrap360(p.lon);

  const signIndex = getSignIndex(p.sign);
  if (signIndex < 0 || typeof p.degree !== "number") return null;

  return wrap360(signIndex * 30 + p.degree);
}

function circularDistance(a: number, b: number) {
  const d = Math.abs(wrap360(a) - wrap360(b)) % 360;
  return d > 180 ? 360 - d : d;
}

function getDistanceFromPlanetSign(planetSign?: string, lordSign?: string) {
  const pIndex = getSignIndex(planetSign);
  const lIndex = getSignIndex(lordSign);

  if (pIndex < 0 || lIndex < 0) return null;

  return ((lIndex - pIndex + 12) % 12) + 1;
}

function getNaturalRelationship(planet: string, otherPlanet: string) {
  if (planet === otherPlanet) return "self";

  const rel = NATURAL_RELATIONSHIPS[planet];
  if (!rel) return "neutral";

  if (rel.friends.includes(otherPlanet)) return "friend";
  if (rel.enemies.includes(otherPlanet)) return "enemy";

  return "neutral";
}

function getTemporaryRelationship(planetSign?: string, lordSign?: string) {
  const distance = getDistanceFromPlanetSign(planetSign, lordSign);

  if (!distance) return "neutral";

  if ([2, 3, 4, 10, 11, 12].includes(distance)) return "friend";
  return "enemy";
}

function combineFiveFoldRelationship(
  natural: string,
  temporary: string
):
  | "exalted"
  | "moolatrikona"
  | "own"
  | "greatFriend"
  | "friend"
  | "neutral"
  | "enemy"
  | "greatEnemy"
  | "debilitated" {
  if (natural === "self") return "own";
  if (natural === "friend" && temporary === "friend") return "greatFriend";
  if (natural === "friend" && temporary === "enemy") return "neutral";
  if (natural === "neutral" && temporary === "friend") return "friend";
  if (natural === "neutral" && temporary === "enemy") return "enemy";
  if (natural === "enemy" && temporary === "friend") return "neutral";
  if (natural === "enemy" && temporary === "enemy") return "greatEnemy";
  return "neutral";
}

function findPlanetSignInList(planets: PlanetInput[], planet: string) {
  return planets.find((p) => p.planet === planet)?.sign ?? null;
}

function getPlanetSignInVarga(
  varga: VargaChart | null | undefined,
  planet: string
): string | null {
  return (
    varga?.planets?.find((p) => p?.name === planet || p?.planet === planet)
      ?.sign ?? null
  );
}

function getSaptavargajaRelationship(params: {
  planet: string;
  planetSign?: string | null;
  signLordSign?: string | null;
}) {
  const { planet, planetSign, signLordSign } = params;

  if (!planetSign) return "n/a";

  // Classical Sapta-vargaja Bala first checks varga dignity.
  // This is closer to JHora/AstroSage than using only natural + temporary friendship.
  
  if (MOOLATRIKONA_SIGNS[planet] === planetSign) return "moolatrikona";
  if (OWN_SIGNS[planet]?.includes(planetSign)) return "own";

  const signLord = SIGN_LORDS[planetSign];
  if (!signLord) return "neutral";

  const natural = getNaturalRelationship(planet, signLord);
  const temporary = getTemporaryRelationship(
    planetSign,
    signLordSign ?? undefined
  );

  return combineFiveFoldRelationship(natural, temporary);
}

function getVirupasForRelationship(relationship: string): number {
  switch (relationship) {
    case "exalted":
      return 45;
    case "moolatrikona":
      return 30;
    case "own":
      return 30;
    case "greatFriend":
      return 22.5;
    case "friend":
      return 15;
    case "neutral":
      return 15;
    case "enemy":
      return 7.5;
    case "greatEnemy":
      return 3.75;
    case "debilitated":
      return 0;
    default:
      return 0;
  }
}

function buildDivisionRow(params: {
  key: string;
  planet: string;
  planetSign?: string | null;
  signLordSign?: string | null;
}) {
  const relationship = getSaptavargajaRelationship({
    planet: params.planet,
    planetSign: params.planetSign,
    signLordSign: params.signLordSign,
  });

  return {
    division: params.key,
    sign: params.planetSign ?? null,
    signLord: params.planetSign ? SIGN_LORDS[params.planetSign] ?? null : null,
    signLordSign: params.signLordSign ?? null,
    relationship,
    virupas: getVirupasForRelationship(relationship),
  };
}

function getSaptavargajaBala(
  p: PlanetInput,
  natalPlanets: PlanetInput[],
  vargaData?: VargaData
) {
  function getD1SignLordPosition(planetSign?: string | null) {
    const signLord = planetSign ? SIGN_LORDS[planetSign] : null;
    return signLord ? findPlanetSignInList(natalPlanets, signLord) : null;
  }

  function getVargaSignLordPosition(
    varga: VargaChart | null | undefined,
    planetSign?: string | null
  ) {
    const signLord = planetSign ? SIGN_LORDS[planetSign] : null;
    return signLord ? getPlanetSignInVarga(varga, signLord) : null;
  }

  const d1PlanetSign = p.sign ?? null;
  const d2PlanetSign = getPlanetSignInVarga(vargaData?.d2, p.planet);
  const d3PlanetSign = getPlanetSignInVarga(vargaData?.d3, p.planet);
  const d7PlanetSign = getPlanetSignInVarga(vargaData?.d7, p.planet);
  const d9PlanetSign = getPlanetSignInVarga(vargaData?.d9, p.planet);
  const d12PlanetSign = getPlanetSignInVarga(vargaData?.d12, p.planet);
  const d30PlanetSign = getPlanetSignInVarga(vargaData?.d30, p.planet);

  const breakdown = [
    buildDivisionRow({
      key: "D1",
      planet: p.planet,
      planetSign: d1PlanetSign,
      signLordSign: getD1SignLordPosition(d1PlanetSign),
    }),
    buildDivisionRow({
      key: "D2",
      planet: p.planet,
      planetSign: d2PlanetSign,
      signLordSign: getVargaSignLordPosition(vargaData?.d2, d2PlanetSign),
    }),
    buildDivisionRow({
      key: "D3",
      planet: p.planet,
      planetSign: d3PlanetSign,
      signLordSign: getVargaSignLordPosition(vargaData?.d3, d3PlanetSign),
    }),
    buildDivisionRow({
      key: "D7",
      planet: p.planet,
      planetSign: d7PlanetSign,
      signLordSign: getVargaSignLordPosition(vargaData?.d7, d7PlanetSign),
    }),
    buildDivisionRow({
      key: "D9",
      planet: p.planet,
      planetSign: d9PlanetSign,
      signLordSign: getVargaSignLordPosition(vargaData?.d9, d9PlanetSign),
    }),
    buildDivisionRow({
      key: "D12",
      planet: p.planet,
      planetSign: d12PlanetSign,
      signLordSign: getVargaSignLordPosition(vargaData?.d12, d12PlanetSign),
    }),
    buildDivisionRow({
      key: "D30",
      planet: p.planet,
      planetSign: d30PlanetSign,
      signLordSign: getVargaSignLordPosition(vargaData?.d30, d30PlanetSign),
    }),
  ];

  const rawVirupas = breakdown.reduce((sum, x) => sum + x.virupas, 0);
  
  return {
    virupas: round2(rawVirupas),
    breakdown,
  };
}

function getUchchaBala(p: PlanetInput) {
  const lon = getPlanetLon(p);
  const exaltLon = EXALTATION_LON[p.planet];

  if (lon === null || typeof exaltLon !== "number") return 0;

  const debilLon = wrap360(exaltLon + 180);
  const distanceFromDebil = circularDistance(lon, debilLon);

  return round2(distanceFromDebil / 3);
}

function getOjhayugmaBala(p: PlanetInput, vargaData?: VargaData) {
  const d1SignIndex = getSignIndex(p.sign);
  const d9SignIndex = getSignIndex(getPlanetSignInVarga(vargaData?.d9, p.planet));

  const isMoonVenus = ["Moon", "Venus"].includes(p.planet);

  function score(signIndex: number) {
    if (signIndex < 0) return 0;
    const isOddSign = signIndex % 2 === 0;
    return isMoonVenus ? (!isOddSign ? 15 : 0) : isOddSign ? 15 : 0;
  }

  return score(d1SignIndex) + score(d9SignIndex);
}

function getKendraBala(p: PlanetInput) {
  const house = p.house ?? 0;
  if ([1, 4, 7, 10].includes(house)) return 60;
  if ([2, 5, 8, 11].includes(house)) return 30;
  if ([3, 6, 9, 12].includes(house)) return 15;
  return 0;
}

function getDrekkanaBala(p: PlanetInput) {
  const lon = getPlanetLon(p);
  if (lon === null) return 0;

  const degreeInSign = lon % 30;
  const drekkana = Math.floor(degreeInSign / 10) + 1;

  if (["Sun", "Mars", "Jupiter"].includes(p.planet)) {
    return drekkana === 1 ? 15 : 0;
  }

  if (["Mercury", "Saturn"].includes(p.planet)) {
    return drekkana === 2 ? 15 : 0;
  }

  if (["Moon", "Venus"].includes(p.planet)) {
    return drekkana === 3 ? 15 : 0;
  }

  return 0;
}

function getTotalSthanaBala(params: {
  uchcha: number;
  saptavargaja: number;
  ojhayugma: number;
  kendra: number;
  drekkana: number;
}) {
  return round2(
    params.uchcha +
      params.saptavargaja +
      params.ojhayugma +
      params.kendra +
      params.drekkana
  );
}

function estimateAscendantLonFromHouse(p: PlanetInput) {
  const lon = getPlanetLon(p);
  if (lon === null || !p.house) return null;

  // Fallback only. For professional matching, pass exact ascendantLon into buildShadbala.
  return wrap360(lon - (p.house - 1) * 30);
}

function getDigBalaVirupas(p: PlanetInput, ascendantLon?: number | null) {
  const lon = getPlanetLon(p);
  if (lon === null) return 0;

  const ascLon =
    typeof ascendantLon === "number"
      ? wrap360(ascendantLon)
      : estimateAscendantLonFromHouse(p);

  if (ascLon === null) return 0;

  const idealHouse: Record<string, number> = {
    Sun: 10,
    Mars: 10,
    Moon: 4,
    Venus: 4,
    Mercury: 1,
    Jupiter: 1,
    Saturn: 7,
  };

  const house = idealHouse[p.planet];
  if (!house) return 0;

  const idealLon = wrap360(ascLon + (house - 1) * 30);
  const distanceFromIdeal = circularDistance(lon, idealLon);

  return round2(Math.max(0, (180 - distanceFromIdeal) / 3));
}

function getNatonnathaBala(
  p: PlanetInput,
  natalPlanets: PlanetInput[],
  mcLon?: number | null
) {
  if (p.planet === "Mercury") return 60;

  const sun = natalPlanets.find((x) => x.planet === "Sun");
  const sunLon = sun ? getPlanetLon(sun) : null;

  if (sunLon === null || typeof mcLon !== "number") return 0;

  const distanceFromMc = circularDistance(sunLon, mcLon);

  const unnata = round2(Math.max(0, Math.min(60, (180 - distanceFromMc) / 3)));
  const nata = round2(60 - unnata);

  if (["Sun", "Jupiter", "Venus"].includes(p.planet)) return unnata;
if (["Moon", "Mars", "Saturn"].includes(p.planet)) return nata;

  return 0;
}

function isMercuryMalefic(natalPlanets: PlanetInput[]) {
  const mercury = natalPlanets.find((x) => x.planet === "Mercury");
  if (!mercury) return false;

  // Basic classical approximation: Mercury behaves more malefic when joined with natural malefics.
  // This uses sign conjunction because this file does not receive exact conjunction/aspect data here.
  return natalPlanets.some(
    (x) => x.planet !== "Mercury" && MALEFICS.has(x.planet) && x.sign === mercury.sign
  );
}

function getPakshaBala(p: PlanetInput, natalPlanets: PlanetInput[]) {
  const sun = natalPlanets.find((x) => x.planet === "Sun");
  const moon = natalPlanets.find((x) => x.planet === "Moon");

  if (!sun || !moon) return 0;

  const sunLon = getPlanetLon(sun);
  const moonLon = getPlanetLon(moon);

  if (sunLon === null || moonLon === null) return 0;

  const forwardAngle = wrap360(moonLon - sunLon);
  const phaseAngle =
    forwardAngle <= 180 ? forwardAngle : 360 - forwardAngle;

  const beneficStrength = round2((phaseAngle / 180) * 60);
  const maleficStrength = round2(60 - beneficStrength);


 if (p.planet === "Moon") {
  return round2(beneficStrength * 2);
}

  if (p.planet === "Mercury") {
    return isMercuryMalefic(natalPlanets)
      ? maleficStrength
      : beneficStrength;
  }

  if (p.planet === "Jupiter" || p.planet === "Venus") {
    return beneficStrength;
  }

  return maleficStrength;
}

function getTribhagaBala(
  p: PlanetInput,
  isDayBirth?: boolean,
  birthPart?: 1 | 2 | 3 | null
) {
  if (p.planet === "Jupiter") return 60;

  if (!birthPart) return 0;

  if (isDayBirth) {
    const dayLords: Record<number, string> = {
      1: "Mercury",
      2: "Sun",
      3: "Saturn",
    };

    return dayLords[birthPart] === p.planet ? 60 : 0;
  }

  const nightLords: Record<number, string> = {
    1: "Moon",
    2: "Venus",
    3: "Mars",
  };

  return nightLords[birthPart] === p.planet ? 60 : 0;
}

const WEEKDAY_LORDS: Record<number, string> = {
  1: "Moon",
  2: "Mars",
  3: "Mercury",
  4: "Jupiter",
  5: "Venus",
  6: "Saturn",
  7: "Sun",
};

const MONTH_LORDS: Record<number, string> = {
  1: "Saturn",
  2: "Saturn",
  3: "Jupiter",
  4: "Mars",
  5: "Venus",
  6: "Mercury",
  7: "Moon",
  8: "Sun",
  9: "Mercury",
  10: "Venus",
  11: "Mars",
  12: "Jupiter",
};
function getAbdaBala(p: PlanetInput, abdaLord?: string | null) {
  return abdaLord === p.planet ? 15 : 0;
}

function getMasaBala(p: PlanetInput, masaLord?: string | null) {
  return masaLord === p.planet ? 30 : 0;
}

function getVaraBala(p: PlanetInput, varaLord?: string | null) {
  return varaLord === p.planet ? 45 : 0;
}

function getHoraBala(p: PlanetInput, birthHoraLord?: string | null) {
  return birthHoraLord === p.planet ? 60 : 0;
}

function getAyanaBala(p: PlanetInput) {
  const declination =
    typeof p.declination === "number"
      ? p.declination
      : typeof p.declinationDeg === "number"
      ? p.declinationDeg
      : typeof p.dec === "number"
      ? p.dec
      : null;

  // Prefer true declination from Swiss Ephemeris if available.
  // This is the correct direction for AstroSage/JHora-style Ayana Bala.
  if (typeof declination === "number" && Number.isFinite(declination)) {
    const maxDeclination = 24; // close to obliquity; clamp keeps output 0..60
    const normalized = Math.max(
      -1,
      Math.min(1, declination / maxDeclination)
    );

    const northStrength = round2((normalized + 1) * 30);
    const southStrength = round2(60 - northStrength);

    if (["Sun", "Mars", "Jupiter", "Venus"].includes(p.planet)) {
      return northStrength;
    }

    return southStrength;
  }

  // Fallback only when declination is unavailable. This is intentionally simple
  // and should be replaced by passing declination from the Swiss layer.
  const lon = getPlanetLon(p);
  if (lon === null) return 0;

  const proxyDeclination = 23.44 * Math.sin((lon * Math.PI) / 180);
  const northStrength = round2(((proxyDeclination / 24) + 1) * 30);
  const southStrength = round2(60 - northStrength);

  if (["Sun", "Mars", "Jupiter", "Venus"].includes(p.planet)) {
    return northStrength;
  }

  return southStrength;
}

function getTotalKalaBala(parts: {
  natonnatha: number;
  paksha: number;
  tribhaga: number;
  abda: number;
  masa: number;
  vara: number;
  hora: number;
  ayana: number;
  yuddha: number;
}) {
  
  return round2(
    parts.natonnatha +
      parts.paksha +
      parts.tribhaga +
      parts.abda +
      parts.masa +
      parts.vara +
      parts.hora +
      parts.ayana +
      parts.yuddha
  );
}

function getCheshtaBalaVirupas(p: PlanetInput) {
  const direct =
    typeof p.cheshtaBala === "number"
      ? p.cheshtaBala
      : typeof p.cheshtaVirupas === "number"
      ? p.cheshtaVirupas
      : null;

  if (typeof direct === "number" && Number.isFinite(direct)) {
    return round2(Math.max(0, Math.min(60, direct)));
  }

  const state = p.cheshtaState?.toLowerCase?.() ?? null;

  // Classical motion-state fallback. If your Swiss layer can provide the actual
  // cheshta state, this will be much closer than speed buckets.
  const stateVirupas: Record<string, number> = {
    vakra: 60,
    anuvakra: 30,
    vikala: 15,
    manda: 15,
    mandatara: 7.5,
    sama: 30,
    chara: 45,
    atichara: 30,
  };

  if (state && typeof stateVirupas[state] === "number") {
    return stateVirupas[state];
  }

    const speed =
    typeof p.speed === "number"
      ? p.speed
      : typeof p.speedLon === "number"
      ? p.speedLon
      : typeof p.longitudeSpeed === "number"
      ? p.longitudeSpeed
      : null;

  if (typeof speed !== "number" || !Number.isFinite(speed)) return 15;

const absSpeed = Math.abs(speed);

const cheshtaRef: Record<string, { mean: number; factor: number }> = {
  Sun: { mean: 0.9856, factor: 10 },
  Moon: { mean: 13.1764, factor: 45.21 },
  Mars: { mean: 0.524, factor: 36.32 },
  Mercury: { mean: 1.383, factor: 43.46 },
  Jupiter: { mean: 0.083, factor: 3.94 },
  Venus: { mean: 1.2, factor: 21.17 },
  Saturn: { mean: 0.0335, factor: 16.32 },
};

const ref = cheshtaRef[p.planet];
if (!ref) return 15;

const ratio = Math.abs(speed) / ref.mean;

return round2(Math.max(0, Math.min(60, ratio * ref.factor)));
}

function getAspectTarget(a: ShadbalaAspect) {
  return a.planetB ?? a.to ?? a.aspectedPlanet ?? null;
}

function getAspectSource(a: ShadbalaAspect) {
  return a.planetA ?? a.from ?? a.aspectingPlanet ?? null;
}

function getAspectVirupaFromAngle(source: string, angle: number) {
  // Classical graha drishti strength.
  // We keep the aspect model stable and conservative so Drik Bala does not dominate Shadbala.
  const candidates: Array<{ target: number; virupas: number }> = [
    { target: 180, virupas: 60 }, // 7th full
    { target: 90, virupas: 45 }, // 4th
    { target: 210, virupas: 45 }, // 8th
    { target: 120, virupas: 30 }, // 5th
    { target: 240, virupas: 30 }, // 9th
    { target: 60, virupas: 15 }, // 3rd
    { target: 270, virupas: 15 }, // 10th
  ];

  if (source === "Mars") {
    candidates.push(
      { target: 90, virupas: 60 },
      { target: 210, virupas: 60 }
    );
  }

  if (source === "Jupiter") {
    candidates.push(
      { target: 120, virupas: 60 },
      { target: 240, virupas: 60 }
    );
  }

  if (source === "Saturn") {
    candidates.push(
      { target: 60, virupas: 60 },
      { target: 270, virupas: 60 }
    );
  }

  let best = 0;

  for (const c of candidates) {
    const diff = circularDistance(angle, c.target);

    // Wider, smoother orb than before. This avoids cliff effects near exact/non-exact aspects.
    const exactness = Math.max(0, 1 - diff / 45);
    best = Math.max(best, c.virupas * exactness);
  }

  // Keep Drik Bala as a moderate correction, not a dominant Shadbala factor.
  return best / 6;
}

function getMoonPakshaNature(natalPlanets: PlanetInput[]) {
  const sun = natalPlanets.find((x) => x.planet === "Sun");
  const moon = natalPlanets.find((x) => x.planet === "Moon");

  const sunLon = sun ? getPlanetLon(sun) : null;
  const moonLon = moon ? getPlanetLon(moon) : null;

  if (sunLon === null || moonLon === null) return 0;

  const forwardAngle = wrap360(moonLon - sunLon);

  // Waxing Moon behaves benefic; waning Moon behaves malefic.
  return forwardAngle <= 180 ? 1 : -1;
}

function getDrikNatureMultiplier(
  source: PlanetInput,
  natalPlanets: PlanetInput[]
) {
  if (source.planet === "Jupiter" || source.planet === "Venus") return 1;

  if (
    source.planet === "Sun" ||
    source.planet === "Mars" ||
    source.planet === "Saturn"
  ) {
    return -1;
  }

  if (source.planet === "Mercury") {
    return isMercuryMalefic(natalPlanets) ? -1 : 1;
  }

  if (source.planet === "Moon") {
    return getMoonPakshaNature(natalPlanets);
  }

  return 0;
}

function getClassicalDrikBalaFromPlanets(
  p: PlanetInput,
  natalPlanets: PlanetInput[]
) {
  const targetLon = getPlanetLon(p);
  if (targetLon === null) return 0;

  let score = 0;

  for (const source of natalPlanets) {
    if (source.planet === p.planet) continue;
    if (!CORE_PLANETS.includes(source.planet)) continue;

    const sourceLon = getPlanetLon(source);
    if (sourceLon === null) continue;

    const forwardAngle = wrap360(targetLon - sourceLon);
    const virupas = getAspectVirupaFromAngle(source.planet, forwardAngle);
    const nature = getDrikNatureMultiplier(source, natalPlanets);

    score += virupas * nature;
  }

  return round2(Math.max(-60, Math.min(60, score)));
}

function getDrikBalaVirupas(
  p: PlanetInput,
  natalPlanets: PlanetInput[],
  aspects?: ShadbalaAspect[]
) {
  const computed = getClassicalDrikBalaFromPlanets(p, natalPlanets);

  // Always prefer longitude-based Drik Bala when planetary longitudes are available.
  if (computed !== 0) return computed;

  if (!aspects || !aspects.length) return 0;

  let score = 0;

  for (const a of aspects) {
    const target = getAspectTarget(a);
    const source = getAspectSource(a);

    if (target !== p.planet || !source) continue;
    if (["Rahu", "Ketu", "Uranus", "Neptune", "Pluto"].includes(source)) continue;

    const rawStrength =
      typeof a.strength === "number"
        ? Math.max(0, Math.min(1, a.strength > 1 ? a.strength / 100 : a.strength))
        : typeof a.orb === "number"
        ? Math.max(0, 1 - Math.abs(a.orb) / 12)
        : 0.5;

    const aspectVirupas = 10 * rawStrength;

    if (source === "Jupiter" || source === "Venus") score += aspectVirupas;
    else if (source === "Sun" || source === "Mars" || source === "Saturn") {
      score -= aspectVirupas;
    } else if (source === "Mercury") {
      score += isMercuryMalefic(natalPlanets) ? -aspectVirupas : aspectVirupas;
    }
  }

  return round2(Math.max(-60, Math.min(60, score)));
}

function getIshtaKashta(params: {
  uchchaBala: number;
  cheshtaBala: number;
}) {
  const ishta = Math.sqrt(
    Math.max(0, params.uchchaBala) * Math.max(0, params.cheshtaBala)
  );

  const kashta = Math.sqrt(
    Math.max(0, 60 - params.uchchaBala) *
      Math.max(0, 60 - params.cheshtaBala)
  );

  return {
    ishtaPhala: round2(ishta),
    kashtaPhala: round2(kashta),
  };
}

export function buildShadbala({
  natalPlanets,
  isDayBirth,
  birthPart,
  vargaData,
  birthHoraLord,
  abdaLord,
  masaLord,
  varaLord,
  ascendantLon,
  mcLon,
}: {
   natalPlanets: PlanetInput[];
  aspects?: ShadbalaAspect[];
  isDayBirth?: boolean;
  birthPart?: 1 | 2 | 3 | null;
  vargaData?: VargaData;
  birthWeekday?: number;
  birthMonth?: number;
  birthHoraLord?: string | null;
  abdaLord?: string | null;
  masaLord?: string | null;
  varaLord?: string | null;
  ascendantLon?: number | null;
  mcLon?: number | null;
}) {
  const rows = CORE_PLANETS.map((planetName) => {
    const p: PlanetInput =
      natalPlanets.find((x) => x.planet === planetName) ?? {
        planet: planetName,
      };

    const saptavargaja = getSaptavargajaBala(p, natalPlanets, vargaData);

    const uchchaBala = getUchchaBala(p);
    
    const rawSaptavargajaBala = saptavargaja.virupas;

    // Generic classical mode: no chart-specific / planet-specific calibration.
    // Keep this raw so rankings remain stable across different charts.
    const saptavargajaBala = round2(rawSaptavargajaBala);
    const ojhayugmaBala = getOjhayugmaBala(p, vargaData);
    const kendraBala = getKendraBala(p);
    const drekkanaBala = getDrekkanaBala(p);

    const totalSthanaBala = getTotalSthanaBala({
      uchcha: uchchaBala,
      saptavargaja: saptavargajaBala,
      ojhayugma: ojhayugmaBala,
      kendra: kendraBala,
      drekkana: drekkanaBala,
    });
   
    const totalDigBala = getDigBalaVirupas(p, ascendantLon);
    
    const natonnathaBala = getNatonnathaBala(p, natalPlanets, mcLon);
    
    const pakshaBala = getPakshaBala(p, natalPlanets);
    const tribhagaBala = getTribhagaBala(p, isDayBirth, birthPart);
    const abdaBala = getAbdaBala(p, abdaLord);
const masaBala = getMasaBala(p, masaLord);
const varaBala = getVaraBala(p, varaLord);
    const horaBala = getHoraBala(p, birthHoraLord);
    const ayanaBala = getAyanaBala(p);
    const yuddhaBala = 0;
    
    const totalKalaBala = getTotalKalaBala({
      natonnatha: natonnathaBala,
      paksha: pakshaBala,
      tribhaga: tribhagaBala,
      abda: abdaBala,
      masa: masaBala,
      vara: varaBala,
      hora: horaBala,
      ayana: ayanaBala,
      yuddha: yuddhaBala,
    });
    
    const totalCheshtaBala = getCheshtaBalaVirupas(p);
    const totalNaisargikaBala = NATURAL_STRENGTH_VIRUPAS[planetName] ?? 0;
    const totalDrikBala = getDrikBalaVirupas(p, natalPlanets);

    const totalShadbalaVirupas = round2(
      totalSthanaBala +
        totalDigBala +
        totalKalaBala +
        totalCheshtaBala +
        totalNaisargikaBala +
        totalDrikBala
    );

    const shadbalaRupas = round2(totalShadbalaVirupas / 60);
    const minimumRequirement = MIN_REQUIREMENT_RUPAS[planetName] ?? 5;
    const ratio = round2(shadbalaRupas / minimumRequirement);
    
    const { ishtaPhala, kashtaPhala } = getIshtaKashta({
      uchchaBala,
      cheshtaBala: totalCheshtaBala,
    });

    return {
      planet: planetName,

      uchchaBala,
      saptavargajaBala,
      ojhayugmaBala,
      kendraBala,
      drekkanaBala,
      totalSthanaBala,

      totalDigBala,

      natonnathaBala,
      pakshaBala,
      tribhagaBala,
      abdaBala,
      masaBala,
      varaBala,
      horaBala,
      ayanaBala,
      yuddhaBala,
      totalKalaBala,

      totalCheshtaBala,
      totalNaisargikaBala,
      totalDrikBala,

      totalShadbalaVirupas,
      shadbalaRupas,
      minimumRequirement,
      ratio,
      relativeRank: 0,
      ishtaPhala,
      kashtaPhala,

      total: shadbalaRupas,
      sthana: round2(totalSthanaBala / 60),
      sthanaVirupas: rawSaptavargajaBala,
      sthanaBreakdown: saptavargaja.breakdown,
      dig: round2(totalDigBala / 60),
      kala: round2(totalKalaBala / 60),
      chestha: round2(totalCheshtaBala / 60),
      naisargika: round2(totalNaisargikaBala / 60),
      drik: round2(totalDrikBala / 60),
    };
  });

  const RANK_TIE_TOLERANCE = 1; // virupa

const ranked = rows
  .slice()
  .sort((a, b) => {
    const scoreA = a.totalShadbalaVirupas / (a.minimumRequirement * 60);
    const scoreB = b.totalShadbalaVirupas / (b.minimumRequirement * 60);

    if (
      Math.abs(b.totalShadbalaVirupas - a.totalShadbalaVirupas) <=
      RANK_TIE_TOLERANCE
    ) {
      return CORE_PLANETS.indexOf(a.planet) - CORE_PLANETS.indexOf(b.planet);
    }

    return scoreB - scoreA;
  })
  .map((row, index) => ({
    ...row,
    relativeRank: index + 1,
  }));

  const rankMap = new Map(ranked.map((row) => [row.planet, row.relativeRank]));

  const totals = rows.map((r) => r.shadbalaRupas);
  const max = Math.max(...totals);
  const min = Math.min(...totals);
  const range = max - min || 1;

  function getStatus(value: number): "Strong" | "Medium" | "Weak" {
    if (value >= max - range * 0.2) return "Strong";
    if (value <= min + range * 0.25) return "Weak";
    return "Medium";
  }

  return rows.map((row) => ({
    ...row,
    relativeRank: rankMap.get(row.planet) ?? 0,
    status: getStatus(row.shadbalaRupas),
  }));
}


