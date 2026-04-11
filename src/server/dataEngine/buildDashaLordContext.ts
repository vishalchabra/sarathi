type AnyObj = Record<string, any>;

export type DashaLordProfile = {
  planet: string;

  sign: string | null;
  signNum: number | null;
  house: number | null;

  ruledHouses: number[];

  nakshatra: string | null;
  nakshatraLord: string | null;
  nakshatraLordSign: string | null;
  nakshatraLordHouse: number | null;
  nakshatraLordChain: string[];
  finalNakshatraDispositor: string | null;

  dignity: string | null;
  strengthBand: "strong" | "medium" | "weak";

  retrograde: boolean;
  combust: boolean;
  vargottama: boolean;

  aspectsReceived: string[];
  conjunctions: string[];

  dispositor: string | null;
  finalDispositor: string | null;
  dispositorChain: string[];

  d9Sign: string | null;
  d10Sign: string | null;
};

export type DashaContext = {
  md: DashaLordProfile | null;
  ad: DashaLordProfile | null;
  pd: DashaLordProfile | null;

  relationships: {
    mdToAd: string | null;
    adToPd: string | null;
    mdToPd: string | null;
  };

  activatedHouses: number[];
};

type BuildParams = {
  dasha?: AnyObj | null;
  natal?: AnyObj | null;
  houses?: AnyObj[] | null;
  vargas?: Record<string, any> | null;
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
  1: "Mars",     // Aries
  2: "Venus",    // Taurus
  3: "Mercury",  // Gemini
  4: "Moon",     // Cancer
  5: "Sun",      // Leo
  6: "Mercury",  // Virgo
  7: "Venus",    // Libra
  8: "Mars",     // Scorpio
  9: "Jupiter",  // Sagittarius
  10: "Saturn",  // Capricorn
  11: "Saturn",  // Aquarius
  12: "Jupiter", // Pisces
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

const PLANET_FRIENDSHIPS: Record<string, { friends: string[]; enemies: string[] }> = {
  Sun: {
    friends: ["Moon", "Mars", "Jupiter"],
    enemies: ["Venus", "Saturn"],
  },
  Moon: {
    friends: ["Sun", "Mercury"],
    enemies: [],
  },
  Mars: {
    friends: ["Sun", "Moon", "Jupiter"],
    enemies: ["Mercury"],
  },
  Mercury: {
    friends: ["Sun", "Venus"],
    enemies: ["Moon"],
  },
  Jupiter: {
    friends: ["Sun", "Moon", "Mars"],
    enemies: ["Mercury", "Venus"],
  },
  Venus: {
    friends: ["Mercury", "Saturn"],
    enemies: ["Sun", "Moon"],
  },
  Saturn: {
    friends: ["Mercury", "Venus"],
    enemies: ["Sun", "Moon", "Mars"],
  },
  Rahu: {
    friends: ["Venus", "Saturn", "Mercury"],
    enemies: ["Sun", "Moon", "Mars"],
  },
  Ketu: {
    friends: ["Mars", "Jupiter", "Sun"],
    enemies: ["Moon", "Venus"],
  },
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

function toSignNum(value: any): number | null {
  if (typeof value === "number" && value >= 1 && value <= 12) return value;

  if (!value) return null;

  const raw = String(value).trim().toLowerCase();

  if (SIGN_NAME_TO_NUM[raw]) return SIGN_NAME_TO_NUM[raw];

  const abbrMap: Record<string, number> = {
    ar: 1, ta: 2, ge: 3, cn: 4, ca: 4, le: 5, vi: 6,
    li: 7, sc: 8, sg: 9, sa: 9, cp: 10, aq: 11, pi: 12,
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

function uniqNumbers(arr: number[]): number[] {
  return Array.from(new Set(arr.filter((n) => Number.isFinite(n)))).sort((a, b) => a - b);
}

function uniqStrings(arr: string[]): string[] {
  return Array.from(new Set(arr.filter(Boolean)));
}

function findPlanetRow(planets: AnyObj[] | null | undefined, planet: string | null): AnyObj | null {
  if (!planet || !Array.isArray(planets)) return null;

  return (
    planets.find((p) => normPlanetName(p?.planet) === planet) ??
    planets.find((p) => normPlanetName(p?.name) === planet) ??
    null
  );
}

function getPlanetRowsFromVarga(vargaValue: any): AnyObj[] {
  if (!vargaValue || typeof vargaValue !== "object") return [];

  if (Array.isArray(vargaValue?.planets)) return vargaValue.planets;
  if (Array.isArray(vargaValue?.rows)) return vargaValue.rows;
  if (Array.isArray(vargaValue?.data?.planets)) return vargaValue.data.planets;

  return [];
}

function getRuledHousesFromHouses(houses: AnyObj[] | null | undefined, planet: string | null): number[] {
  if (!planet || !Array.isArray(houses)) return [];

  const results: number[] = [];

  for (const h of houses) {
    const lord =
      normPlanetName(h?.lord) ??
      normPlanetName(h?.houseLord) ??
      normPlanetName(h?.owner);

    const houseNum =
      typeof h?.house === "number" ? h.house :
      typeof h?.houseNum === "number" ? h.houseNum :
      typeof h?.number === "number" ? h.number :
      null;

    if (lord === planet && houseNum) {
      results.push(houseNum);
    }
  }

  return uniqNumbers(results);
}

function inferRuledHousesFromAsc(
  ascSignNum: number | null,
  planet: string | null
): number[] {
  if (!ascSignNum || !planet) return [];

  const results: number[] = [];

  for (let house = 1; house <= 12; house += 1) {
    const signNum = ((ascSignNum + house - 2) % 12) + 1;
    const lord = SIGN_LORDS[signNum];
    if (lord === planet) results.push(house);
  }

  return results;
}

function getStrengthBand(row: AnyObj | null, natal: AnyObj | null): "strong" | "medium" | "weak" {
  const strengths = natal?.strengths;
  const planet = normPlanetName(row?.planet ?? row?.name);

  let strengthRow: AnyObj | null = null;
  if (planet && Array.isArray(strengths)) {
    strengthRow =
      strengths.find((r: AnyObj) => normPlanetName(r?.planet ?? r?.name) === planet) ?? null;
  }

  const candidates = [
    strengthRow?.strengthBand,
    strengthRow?.band,
    row?.strengthBand,
    row?.band,
    row?.strength,
    row?.strengthLabel,
    row?.status,
  ];

  for (const c of candidates) {
    const raw = String(c ?? "").toLowerCase();
    if (!raw) continue;
    if (raw.includes("strong")) return "strong";
    if (raw.includes("weak")) return "weak";
    if (raw.includes("medium") || raw.includes("moderate") || raw.includes("average")) return "medium";
  }

  const dignity = String(
    strengthRow?.dignity ?? row?.dignity ?? row?.status ?? ""
  ).toLowerCase();

  if (/exalt|own|mool|vargottama/.test(dignity)) return "strong";
  if (/debil|enemy|fallen/.test(dignity)) return "weak";

  return "medium";
}

function getDignity(row: AnyObj | null, natal: AnyObj | null): string | null {
  const strengths = natal?.strengths;
  const planet = normPlanetName(row?.planet ?? row?.name);

  let strengthRow: AnyObj | null = null;
  if (planet && Array.isArray(strengths)) {
    strengthRow =
      strengths.find((r: AnyObj) => normPlanetName(r?.planet ?? r?.name) === planet) ?? null;
  }

  return (
    strengthRow?.dignity ??
    row?.dignity ??
    row?.status ??
    row?.placementStatus ??
    null
  );
}

function getAspectsReceived(natal: AnyObj | null, planet: string | null): string[] {
  if (!planet) return [];

  const aspects = Array.isArray(natal?.aspects) ? natal.aspects : [];
  const result: string[] = [];

  for (const a of aspects) {
    const toPlanet =
      normPlanetName(a?.toPlanet) ??
      normPlanetName(a?.targetPlanet) ??
      normPlanetName(a?.planetB) ??
      normPlanetName(a?.receiver);

    const fromPlanet =
      normPlanetName(a?.fromPlanet) ??
      normPlanetName(a?.sourcePlanet) ??
      normPlanetName(a?.planetA) ??
      normPlanetName(a?.giver);

    if (toPlanet === planet && fromPlanet) {
      const label =
        a?.aspectType ??
        a?.type ??
        a?.label ??
        a?.name ??
        "aspect";
      result.push(`${fromPlanet} (${label})`);
    }
  }

  return uniqStrings(result);
}

function getConjunctions(natal: AnyObj | null, planet: string | null): string[] {
  if (!planet) return [];

  const aspects = Array.isArray(natal?.aspects) ? natal.aspects : [];
  const result: string[] = [];

  for (const a of aspects) {
    const typeRaw = String(a?.aspectType ?? a?.type ?? a?.label ?? "").toLowerCase();

    if (!typeRaw.includes("conj")) continue;

    const p1 =
      normPlanetName(a?.fromPlanet) ??
      normPlanetName(a?.planetA) ??
      normPlanetName(a?.sourcePlanet);

    const p2 =
      normPlanetName(a?.toPlanet) ??
      normPlanetName(a?.planetB) ??
      normPlanetName(a?.targetPlanet);

    if (p1 === planet && p2) result.push(p2);
    if (p2 === planet && p1) result.push(p1);
  }

  return uniqStrings(result);
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
function getNakshatraLordChain(
  planets: AnyObj[] | null | undefined,
  startPlanet: string | null,
  maxDepth = 10
): { chain: string[]; finalNakshatraDispositor: string | null } {
  if (!startPlanet) {
    return { chain: [], finalNakshatraDispositor: null };
  }

  const chain: string[] = [];
  const visited = new Set<string>();
  let current = startPlanet;

  for (let i = 0; i < maxDepth; i += 1) {
    chain.push(current);

    if (visited.has(current)) {
      return {
        chain,
        finalNakshatraDispositor: current,
      };
    }

    visited.add(current);

    const row = findPlanetRow(planets, current);
    const signNum =
      row?.signNum ??
      toSignNum(row?.sign) ??
      toSignNum(row?.rashi);

    const next = getDispositor(signNum);

    if (!next) {
      return {
        chain,
        finalNakshatraDispositor: current,
      };
    }

    if (next === current) {
      chain.push(next);
      return {
        chain,
        finalNakshatraDispositor: next,
      };
    }

    current = next;
  }

  return {
    chain,
    finalNakshatraDispositor: chain.length ? chain[chain.length - 1] : null,
  };
}
function getPlanetFriendship(p1: string | null, p2: string | null): string | null {
  if (!p1 || !p2) return null;
  if (p1 === p2) return "same planet";

  const info = PLANET_FRIENDSHIPS[p1];
  if (!info) return "neutral";

  if (info.friends.includes(p2)) return "friendly";
  if (info.enemies.includes(p2)) return "enemy";

  return "neutral";
}

function pickBoolean(...values: any[]): boolean {
  for (const v of values) {
    if (typeof v === "boolean") return v;
    if (typeof v === "string") {
      const raw = v.trim().toLowerCase();
      if (raw === "true" || raw === "yes") return true;
      if (raw === "false" || raw === "no") return false;
    }
  }
  return false;
}

function buildLordProfile(
  planet: string | null,
  natal: AnyObj | null,
  houses: AnyObj[] | null | undefined,
  vargas: Record<string, any> | null | undefined
): DashaLordProfile | null {
  if (!planet) return null;

  const natalPlanets = Array.isArray(natal?.planets) ? natal.planets : [];
  const row = findPlanetRow(natalPlanets, planet);

  const signNum =
    row?.signNum ??
    toSignNum(row?.sign) ??
    toSignNum(row?.rashi);

  const sign = row?.sign ?? row?.rashi ?? signNumToName(signNum);

  const house =
    typeof row?.house === "number" ? row.house :
    typeof row?.houseNum === "number" ? row.houseNum :
    typeof row?.bhava === "number" ? row.bhava :
    null;

  const ascSignNum =
    natal?.ascendant?.signNum ??
    toSignNum(natal?.ascendant?.sign) ??
    toSignNum(natal?.ascendant?.rashi) ??
    null;

  const ruledHouses =
    getRuledHousesFromHouses(houses, planet).length
      ? getRuledHousesFromHouses(houses, planet)
      : inferRuledHousesFromAsc(ascSignNum, planet);

  const nakshatra =
    row?.nakshatra ??
    row?.star ??
    null;

  const nakshatraLord =
    normPlanetName(row?.nakshatraLord) ??
    normPlanetName(row?.starLord) ??
    null;
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

  const nakshatraChainResult = getNakshatraLordChain(
    natalPlanets,
    nakshatraLord
  );
  const dignity = getDignity(row, natal);
  const strengthBand = getStrengthBand(row, natal);

  const retrograde = pickBoolean(
    row?.retrograde,
    row?.isRetrograde,
    row?.retro
  );

  const combust = pickBoolean(
    row?.combust,
    row?.isCombust
  );

  const vargottama = pickBoolean(
    row?.vargottama,
    row?.isVargottama
  );

  const aspectsReceived = getAspectsReceived(natal, planet);
  const conjunctions = getConjunctions(natal, planet);

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

    sign: sign ?? null,
    signNum: signNum ?? null,
    house: house ?? null,

    ruledHouses,

    nakshatra: nakshatra ?? null,
    nakshatraLord: nakshatraLord ?? null,
    nakshatraLordSign: nakshatraLordSign ?? null,
    nakshatraLordHouse: nakshatraLordHouse ?? null,
    nakshatraLordChain: nakshatraChainResult.chain,
    finalNakshatraDispositor: nakshatraChainResult.finalNakshatraDispositor,

    dignity: dignity ?? null,
    strengthBand,

    retrograde,
    combust,
    vargottama,

    aspectsReceived,
    conjunctions,

    dispositor,
    finalDispositor: dispositorChainResult.finalDispositor,
    dispositorChain: dispositorChainResult.chain,

    d9Sign: d9Sign ?? null,
    d10Sign: d10Sign ?? null,
  };
}

function collectActivatedHouses(
  md: DashaLordProfile | null,
  ad: DashaLordProfile | null,
  pd: DashaLordProfile | null
): number[] {
  const values = [
    ...(md?.ruledHouses ?? []),
    ...(ad?.ruledHouses ?? []),
    ...(pd?.ruledHouses ?? []),
  ];

  return uniqNumbers(values);
}

export function buildDashaLordContext(params: BuildParams): DashaContext {
  const dashaCurrent = params?.dasha?.current ?? params?.dasha ?? null;

  const mdPlanet = getCurrentDashaPlanet(dashaCurrent, ["md", "mahadasha", "maha"]);
  const adPlanet = getCurrentDashaPlanet(dashaCurrent, ["ad", "antardasha", "antar"]);
  const pdPlanet = getCurrentDashaPlanet(dashaCurrent, ["pd", "pratyantardasha", "pratyantar"]);

  const md = buildLordProfile(mdPlanet, params?.natal ?? null, params?.houses ?? [], params?.vargas ?? {});
  const ad = buildLordProfile(adPlanet, params?.natal ?? null, params?.houses ?? [], params?.vargas ?? {});
  const pd = buildLordProfile(pdPlanet, params?.natal ?? null, params?.houses ?? [], params?.vargas ?? {});

  return {
    md,
    ad,
    pd,

    relationships: {
      mdToAd: getPlanetFriendship(md?.planet ?? null, ad?.planet ?? null),
      adToPd: getPlanetFriendship(ad?.planet ?? null, pd?.planet ?? null),
      mdToPd: getPlanetFriendship(md?.planet ?? null, pd?.planet ?? null),
    },

    activatedHouses: collectActivatedHouses(md, ad, pd),
  };
}

export default buildDashaLordContext;