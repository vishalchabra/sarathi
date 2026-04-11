type AnyObj = Record<string, any>;

export type NakshatraPlanetRow = {
  planet: string;
  nakshatra: string | null;
  pada: number | null;
  nakshatraLord: string | null;

  nakshatraLordSign: string | null;
  nakshatraLordHouse: number | null;
  nakshatraLordNakshatra: string | null;
  nakshatraLordChain: string[];
  finalNakshatraDispositor: string | null;
  sign: string | null;
  signNum: number | null;
  house: number | null;
  dispositor: string | null;
  finalDispositor: string | null;
  dispositorChain: string[];
  d9Sign: string | null;
  d10Sign: string | null;
};

export type NakshatraContext = {
  natal: NakshatraPlanetRow[];
  dasha: {
    md: NakshatraPlanetRow | null;
    ad: NakshatraPlanetRow | null;
    pd: NakshatraPlanetRow | null;
  };
  moonToday: {
    nakshatra: string | null;
    pada: number | null;
    nakshatraLord: string | null;
    sign: string | null;
    houseFromLagna: number | null;
    houseFromMoon: number | null;
  } | null;
};

type BuildParams = {
  natal?: AnyObj | null;
  vargas?: Record<string, any> | null;
  dasha?: AnyObj | null;
  transitNow?: AnyObj | null;
};

const PLANET_NAMES = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
] as const;

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

const SIGN_NAME_TO_NUM: Record<string, number> = {
  aries: 1,
  taurus: 2,
  gemini: 3,
  cancer: 4,
  leo: 5,
  virgo: 6,
  libra: 7,
  scorpio: 8,
  sagittarius: 9,
  capricorn: 10,
  aquarius: 11,
  pisces: 12,
};

const NAKSHATRA_LORDS: Record<string, string> = {
  ashwini: "Ketu",
  bharani: "Venus",
  krittika: "Sun",
  rohini: "Moon",
  mrigashira: "Mars",
  ardra: "Rahu",
  punarvasu: "Jupiter",
  pushya: "Saturn",
  ashlesha: "Mercury",
  magha: "Ketu",

  "purva phalguni": "Venus",
  purvaphalguni: "Venus",

  "uttara phalguni": "Sun",
  uttaraphalguni: "Sun",

  hasta: "Moon",
  chitra: "Mars",
  swati: "Rahu",
  vishakha: "Jupiter",
  anuradha: "Saturn",
  jyeshtha: "Mercury",
  jyestha: "Mercury",
  mula: "Ketu",

  "purva ashadha": "Venus",
  purvashadha: "Venus",

  "uttara ashadha": "Sun",
  uttarashadha: "Sun",

  shravana: "Moon",
  dhanishtha: "Mars",
  shatabhisha: "Rahu",
  satabhisha: "Rahu",

  "purva bhadrapada": "Jupiter",
  purvabhadrapada: "Jupiter",

  "uttara bhadrapada": "Saturn",
  uttarabhadrapada: "Saturn",

  revati: "Mercury",
};

function normPlanetName(value: any): string | null {
  if (!value) return null;
  const raw = String(value).trim().toLowerCase();

  const found = PLANET_NAMES.find((p) => p.toLowerCase() === raw);
  if (found) return found;

  if (raw === "north node") return "Rahu";
  if (raw === "south node") return "Ketu";

  return null;
}

function toSignNum(value: any): number | null {
  if (typeof value === "number" && value >= 1 && value <= 12) return value;
  if (!value) return null;

  const raw = String(value).trim().toLowerCase();
  if (SIGN_NAME_TO_NUM[raw]) return SIGN_NAME_TO_NUM[raw];

  const abbrMap: Record<string, number> = {
    ar: 1,
    ta: 2,
    ge: 3,
    cn: 4,
    ca: 4,
    le: 5,
    vi: 6,
    li: 7,
    sc: 8,
    sg: 9,
    sa: 9,
    cp: 10,
    aq: 11,
    pi: 12,
  };

  return abbrMap[raw] ?? null;
}

function signNumToName(signNum: number | null): string | null {
  if (!signNum) return null;

  const map: Record<number, string> = {
    1: "Aries",
    2: "Taurus",
    3: "Gemini",
    4: "Cancer",
    5: "Leo",
    6: "Virgo",
    7: "Libra",
    8: "Scorpio",
    9: "Sagittarius",
    10: "Capricorn",
    11: "Aquarius",
    12: "Pisces",
  };

  return map[signNum] ?? null;
}

function getPlanetRowsFromVarga(vargaValue: any): AnyObj[] {
  if (!vargaValue || typeof vargaValue !== "object") return [];

  if (Array.isArray(vargaValue?.planets)) return vargaValue.planets;
  if (Array.isArray(vargaValue?.rows)) return vargaValue.rows;
  if (Array.isArray(vargaValue?.data?.planets)) return vargaValue.data.planets;

  return [];
}

function findPlanetRow(planets: AnyObj[] | null | undefined, planet: string | null): AnyObj | null {
  if (!planet || !Array.isArray(planets)) return null;

  return (
    planets.find((p) => normPlanetName(p?.planet) === planet) ??
    planets.find((p) => normPlanetName(p?.name) === planet) ??
    null
  );
}

function getDispositor(signNum: number | null): string | null {
  if (!signNum) return null;
  return SIGN_LORDS[signNum] ?? null;
}

function getDispositorChain(
  planets: AnyObj[] | null | undefined,
  startPlanet: string | null,
  maxDepth = 10
): { chain: string[]; finalDispositor: string | null } {
  if (!startPlanet) return { chain: [], finalDispositor: null };

  const chain: string[] = [];
  const visited = new Set<string>();
  let current = startPlanet;

  for (let i = 0; i < maxDepth; i += 1) {
    const row = findPlanetRow(planets, current);
    const signNum =
      row?.signNum ??
      toSignNum(row?.sign) ??
      toSignNum(row?.rashi);

    const dispositor = getDispositor(signNum);
    if (!dispositor) break;

    chain.push(dispositor);

    if (visited.has(dispositor)) {
      return { chain, finalDispositor: dispositor };
    }

    visited.add(dispositor);

    if (dispositor === current) {
      return { chain, finalDispositor: dispositor };
    }

    current = dispositor;
  }

  return {
    chain,
    finalDispositor: chain.length ? chain[chain.length - 1] : null,
  };
}

function getNakshatraLord(nakshatra: any, fallback: any = null): string | null {
  const fallbackPlanet = normPlanetName(fallback);
  if (fallbackPlanet) return fallbackPlanet;

  if (!nakshatra) return null;
  const raw = String(nakshatra).trim().toLowerCase();

  return NAKSHATRA_LORDS[raw] ?? null;
}

function toPada(value: any): number | null {
  if (typeof value === "number" && value >= 1 && value <= 4) return value;
  if (!value) return null;

  const n = Number(value);
  return Number.isFinite(n) && n >= 1 && n <= 4 ? n : null;
}

function buildPlanetNakshatraRow(
  planet: string | null,
  natal: AnyObj | null,
  vargas: Record<string, any> | null | undefined
): NakshatraPlanetRow | null {
  if (!planet) return null;

  const natalPlanets = Array.isArray(natal?.planets) ? natal.planets : [];
  const row = findPlanetRow(natalPlanets, planet);

  if (!row) {
    return {
      planet,
      nakshatra: null,
      pada: null,
      nakshatraLord: null,
      nakshatraLordSign: null,
      nakshatraLordHouse: null,
      nakshatraLordNakshatra: null,
      nakshatraLordChain: [],
      finalNakshatraDispositor: null,
      sign: null,
      signNum: null,
      house: null,
      dispositor: null,
      finalDispositor: null,
      dispositorChain: [],
      d9Sign: null,
      d10Sign: null,
    };
  }

  const signNum =
    row?.signNum ??
    toSignNum(row?.sign) ??
    toSignNum(row?.rashi);

  const sign =
    row?.sign ??
    row?.rashi ??
    signNumToName(signNum);

  const house =
    typeof row?.house === "number"
      ? row.house
      : typeof row?.houseNum === "number"
      ? row.houseNum
      : typeof row?.bhava === "number"
      ? row.bhava
      : null;

  const nakshatra =
    row?.nakshatra ??
    row?.star ??
    null;

  const pada =
    toPada(row?.pada) ??
    toPada(row?.nakshatraPada) ??
    null;

  const nakshatraLord =
    normPlanetName(row?.nakshatraLord) ??
    normPlanetName(row?.starLord) ??
    getNakshatraLord(nakshatra);
  const nakshatraLordRow = findPlanetRow(natalPlanets, nakshatraLord);

const nakshatraLordSignNum =
  nakshatraLordRow?.signNum ??
  toSignNum(nakshatraLordRow?.sign) ??
  toSignNum(nakshatraLordRow?.rashi);

const nakshatraLordSign =
  nakshatraLordRow?.sign ??
  nakshatraLordRow?.rashi ??
  signNumToName(nakshatraLordSignNum);

const nakshatraLordHouse =
  typeof nakshatraLordRow?.house === "number"
    ? nakshatraLordRow.house
    : typeof nakshatraLordRow?.houseNum === "number"
    ? nakshatraLordRow.houseNum
    : typeof nakshatraLordRow?.bhava === "number"
    ? nakshatraLordRow.bhava
    : null;

const nakshatraLordNakshatra =
  nakshatraLordRow?.nakshatra ??
  nakshatraLordRow?.star ??
  null;
  const nakshatraLordDispositorChainResult = getDispositorChain(
  natalPlanets,
  nakshatraLord
);

const nakshatraLordChain = [
  nakshatraLord,
  ...nakshatraLordDispositorChainResult.chain,
].filter(Boolean) as string[];

const finalNakshatraDispositor =
  nakshatraLordDispositorChainResult.finalDispositor ?? null;
  const dispositor = getDispositor(signNum);
  const dispositorChainResult = getDispositorChain(natalPlanets, planet);

  const d9Row = findPlanetRow(getPlanetRowsFromVarga(vargas?.d9), planet);
  const d10Row = findPlanetRow(getPlanetRowsFromVarga(vargas?.d10), planet);

  const d9Sign =
    d9Row?.sign ??
    d9Row?.rashi ??
    signNumToName(d9Row?.signNum ?? toSignNum(d9Row?.sign) ?? toSignNum(d9Row?.rashi));

  const d10Sign =
    d10Row?.sign ??
    d10Row?.rashi ??
    signNumToName(d10Row?.signNum ?? toSignNum(d10Row?.sign) ?? toSignNum(d10Row?.rashi));

  return {
    planet,
    nakshatra: nakshatra ?? null,
    pada,
    nakshatraLord,
    nakshatraLordSign: nakshatraLordSign ?? null,
    nakshatraLordHouse: nakshatraLordHouse ?? null,
    nakshatraLordNakshatra: nakshatraLordNakshatra ?? null,
    nakshatraLordChain,
    finalNakshatraDispositor,
    sign: sign ?? null,
    signNum: signNum ?? null,
    house: house ?? null,
    dispositor,
    finalDispositor: dispositorChainResult.finalDispositor,
    dispositorChain: dispositorChainResult.chain,
    d9Sign: d9Sign ?? null,
    d10Sign: d10Sign ?? null,
  };
}

function getPlanetFromDashaSlot(slot: any): string | null {
  if (!slot) return null;

  const candidates = [
    slot.planet,
    slot.lord,
    slot.name,
    slot.key,
    slot.code,
    slot.label,
  ];

  for (const c of candidates) {
    const p = normPlanetName(c);
    if (p) return p;
  }

  if (typeof slot === "string") {
    return normPlanetName(slot);
  }

  return null;
}

function getCurrentDashaPlanet(current: AnyObj | null | undefined, keys: string[]): string | null {
  if (!current) return null;

  for (const key of keys) {
    const p = getPlanetFromDashaSlot(current[key]);
    if (p) return p;
  }

  for (const key of keys) {
    const p = normPlanetName(current[key]);
    if (p) return p;
  }

  return null;
}

function buildMoonToday(transitNow: AnyObj | null | undefined): NakshatraContext["moonToday"] {
  const moon = transitNow?.moonToday ?? null;
  if (!moon) return null;

  return {
    nakshatra: moon?.nakshatra ?? null,
    pada: toPada(moon?.pada ?? moon?.nakshatraPada),
    nakshatraLord:
      normPlanetName(moon?.nakshatraLord) ??
      normPlanetName(moon?.starLord) ??
      getNakshatraLord(moon?.nakshatra),
    sign: moon?.sign ?? null,
    houseFromLagna:
      typeof moon?.houseFromLagna === "number" ? moon.houseFromLagna : null,
    houseFromMoon:
      typeof moon?.houseFromMoon === "number" ? moon.houseFromMoon : null,
  };
}

export function buildNakshatraContext(params: BuildParams): NakshatraContext {
  const natal = params?.natal ?? null;
  const vargas = params?.vargas ?? {};
  const dashaCurrent = params?.dasha?.current ?? params?.dasha ?? null;

  const natalPlanets = Array.isArray(natal?.planets) ? natal.planets : [];

  const natalRows: NakshatraPlanetRow[] = natalPlanets
    .map((p: AnyObj) =>
      buildPlanetNakshatraRow(
        normPlanetName(p?.planet ?? p?.name),
        natal,
        vargas
      )
    )
    .filter(Boolean) as NakshatraPlanetRow[];

  const mdPlanet = getCurrentDashaPlanet(dashaCurrent, ["md", "mahadasha", "maha"]);
  const adPlanet = getCurrentDashaPlanet(dashaCurrent, ["ad", "antardasha", "antar"]);
  const pdPlanet = getCurrentDashaPlanet(dashaCurrent, ["pd", "pratyantardasha", "pratyantar"]);

  return {
    natal: natalRows,
    dasha: {
      md: buildPlanetNakshatraRow(mdPlanet, natal, vargas),
      ad: buildPlanetNakshatraRow(adPlanet, natal, vargas),
      pd: buildPlanetNakshatraRow(pdPlanet, natal, vargas),
    },
    moonToday: buildMoonToday(params?.transitNow ?? null),
  };
}

export default buildNakshatraContext;