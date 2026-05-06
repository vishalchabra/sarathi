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
  | "greatFriend"
  | "friend"
  | "neutral"
  | "enemy"
  | "greatEnemy"
  | "own" {
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
    case "moolatrikona":
      return 45;
    case "own":
      return 30;
    case "greatFriend":
      return 20;
    case "friend":
      return 15;
    case "neutral":
      return 10;
    case "enemy":
      return 4;
    case "greatEnemy":
      return 2;
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

function getDrekkanaBala(_p: PlanetInput) {
  return 1;
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

function getDigBalaVirupas(p: PlanetInput) {
  const house = p.house ?? 0;

  const ideal: Record<string, number> = {
    Sun: 10,
    Moon: 4,
    Mars: 10,
    Mercury: 1,
    Jupiter: 1,
    Venus: 4,
    Saturn: 7,
  };

  const target = ideal[p.planet];
  if (typeof target !== "number" || house <= 0) return 0;

  const distance = Math.abs(house - target);
  const shortest = Math.min(distance, 12 - distance);

  return round2(Math.max(0, 60 - shortest * 15));
}

function getNatonnathaBala(p: PlanetInput, isDayBirth?: boolean) {
  if (isDayBirth === undefined) return 30;

  const dayPlanets = ["Sun", "Jupiter", "Venus"];
  const nightPlanets = ["Moon", "Mars", "Saturn"];

  if (dayPlanets.includes(p.planet)) return isDayBirth ? 60 : 0;
  if (nightPlanets.includes(p.planet)) return isDayBirth ? 0 : 60;

  return 60;
}

function getPakshaBala(p: PlanetInput, natalPlanets: PlanetInput[]) {
  const sun = natalPlanets.find(x => x.planet === "Sun");
  const moon = natalPlanets.find(x => x.planet === "Moon");

  if (!sun || !moon) return 30;

  const sunLon = getPlanetLon(sun);
  const moonLon = getPlanetLon(moon);

  if (sunLon === null || moonLon === null) return 30;

  const diff = Math.abs(sunLon - moonLon);
  const angle = diff > 180 ? 360 - diff : diff;

  const strength = angle / 3; // max 60

  if (p.planet === "Moon") return round2(strength);

  if (["Venus", "Jupiter", "Mercury"].includes(p.planet)) {
    return round2(strength * 0.8);
  }

  return round2(60 - strength);
}

function getTribhagaBala(p: PlanetInput, isDayBirth?: boolean) {
  if (isDayBirth === undefined) return 0;
  if (isDayBirth && p.planet === "Mercury") return 60;
  if (!isDayBirth && p.planet === "Moon") return 60;
  return 0;
}

const WEEKDAY_LORDS: Record<number, string> = {
  1: "Moon",     // Monday
  2: "Mars",     // Tuesday
  3: "Mercury",  // Wednesday
  4: "Jupiter",  // Thursday
  5: "Venus",    // Friday
  6: "Saturn",   // Saturday
  7: "Sun",      // Sunday
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

function getAbdaBala(p: PlanetInput, birthWeekday?: number) {
  const lord = birthWeekday ? WEEKDAY_LORDS[birthWeekday] : null;
  return lord === p.planet ? 15 : 0;
}

function getMasaBala(p: PlanetInput, birthMonth?: number) {
  const lord = birthMonth ? MONTH_LORDS[birthMonth] : null;
  return lord === p.planet ? 30 : 0;
}

function getVaraBala(p: PlanetInput, birthWeekday?: number) {
  const lord = birthWeekday ? WEEKDAY_LORDS[birthWeekday] : null;
  return lord === p.planet ? 45 : 0;
}

function getHoraBala(p: PlanetInput, birthHoraLord?: string | null) {
  return birthHoraLord === p.planet ? 60 : 0;
}

function getAyanaBala(p: PlanetInput) {
  const lon = getPlanetLon(p);
  if (lon === null) return 0;

  const declinationProxy = Math.abs(Math.sin((lon * Math.PI) / 180));
  const base = declinationProxy * 60;

  if (["Sun", "Mars", "Jupiter", "Venus"].includes(p.planet)) {
    return round2(base);
  }

  return round2(60 - base);
}

function getYuddhaBala() {
  return 0;
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
  const speed =
    typeof p.speed === "number"
      ? p.speed
      : typeof p.speedLon === "number"
      ? p.speedLon
      : typeof p.longitudeSpeed === "number"
      ? p.longitudeSpeed
      : null;

  if (p.planet === "Sun" || p.planet === "Moon") {
    return 15;
  }

  if (p.retrograde || (typeof speed === "number" && speed < 0)) {
    return 60;
  }

  if (typeof speed !== "number" || !Number.isFinite(speed)) {
    return 15;
  }

  const absSpeed = Math.abs(speed);

  if (absSpeed >= 1.2) return 45;
  if (absSpeed >= 0.8) return 30;
  if (absSpeed >= 0.3) return 15;
  return 7.5;
}
function getDrikBalaVirupas(
  p: PlanetInput,
  aspects?: any[]
) {
  if (!aspects || !aspects.length) return 0;

  let score = 0;

  for (const a of aspects) {
    // 👇 use YOUR real structure
    if (a.planetB !== p.planet) continue;
    if (
  (a.planetA === "Rahu" && a.planetB === "Ketu") ||
  (a.planetA === "Ketu" && a.planetB === "Rahu")
) {
  continue;
}
    const strengthFactor = Math.max(0.2, 1 - a.orb / 12);

// 👇 stronger aspect = higher impact

if (a.tone === "supportive") {
  score += 15 * strengthFactor;
} else if (a.tone === "challenging") {
  score -= 15 * strengthFactor;
} else if (a.tone === "mixed") {
  score -= 7.5 * strengthFactor;
}
  }

  // Clamp between -60 to +60
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
  aspects,
  isDayBirth,
  vargaData,
  birthWeekday,
  birthMonth,
  birthHoraLord,
}: {
  natalPlanets: PlanetInput[];
  aspects?: Array<{ to?: string }>;
  isDayBirth?: boolean;
  vargaData?: VargaData;
  birthWeekday?: number;
  birthMonth?: number;
  birthHoraLord?: string | null;
}) {
  const rows = CORE_PLANETS.map((planetName) => {
    const p: PlanetInput =
      natalPlanets.find((x) => x.planet === planetName) ?? {
        planet: planetName,
      };

    const saptavargaja = getSaptavargajaBala(p, natalPlanets, vargaData);

    const uchchaBala = getUchchaBala(p);
    const rawSaptavargajaBala = saptavargaja.virupas;

// Normalized display scale for classical Shadbala table
const saptavargajaBala = round2(rawSaptavargajaBala * 0.72);
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

    const totalDigBala = getDigBalaVirupas(p);

    const natonnathaBala = getNatonnathaBala(p, isDayBirth);
    const pakshaBala = getPakshaBala(p, natalPlanets);
    const tribhagaBala = getTribhagaBala(p, isDayBirth);
    const abdaBala = getAbdaBala(p, birthWeekday);
const masaBala = getMasaBala(p, birthMonth);
const varaBala = getVaraBala(p, birthWeekday);
const horaBala = getHoraBala(p, birthHoraLord);
    const ayanaBala = getAyanaBala(p);
    const yuddhaBala = getYuddhaBala();

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
    const totalDrikBala = getDrikBalaVirupas(p, aspects);

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

  const ranked = rows
    .slice()
    .sort((a, b) => b.shadbalaRupas - a.shadbalaRupas)
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