import type { ProfessionFacts, PlanetId, PlanetPackMap } from "@/server/astro/types";

type HouseInfo = {
  sign?: string;
  lord?: PlanetId;
  strength?: "strong" | "average" | "weak";
};

type NatalLike = {
  ascSign?: string | null;
  houses?: Record<string, HouseInfo> | Array<any>;
  planets?: Array<{
    id?: PlanetId | string;
    name?: PlanetId | string;
    sign?: string;
    house?: number;
    deg?: number;
    siderealLongitude?: number;
  }>;
};

type D10Like = {
  ascSign?: string | null;
  houses?: Record<string, HouseInfo> | Array<any>;
  planets?: Array<{
    id?: PlanetId | string;
    name?: PlanetId | string;
    sign?: string;
    house?: number;
    deg?: number;
    siderealLongitude?: number;
  }>;
};

type ActivePeriodsLike = {
  mahadasha?: { lord?: string | null };
  antardasha?: { subLord?: string | null; lord?: string | null };
  pratyantardasha?: { lord?: string | null };
};

type Input = {
  natal?: NatalLike | null;
  d10?: D10Like | null;
  activePeriods?: ActivePeriodsLike | null;
  planetPacks?: PlanetPackMap | null;
};

type DomainScoreMap = Record<string, number>;

const PLANET_DOMAIN_MAP: Record<PlanetId, string[]> = {
  Sun: ["administration", "management", "government", "leadership"],
  Moon: ["public-facing roles", "hospitality", "community", "care"],
  Mars: ["engineering", "technical operations", "execution", "manufacturing"],
  Mercury: ["banking", "finance", "analytics", "operations", "audit", "advisory", "commerce"],
  Jupiter: ["advisory", "strategy", "finance", "teaching", "law"],
  Venus: ["branding", "design", "luxury", "hospitality", "relationship management"],
  Saturn: ["operations", "compliance", "administration", "process", "institutional work"],
  Rahu: ["technology", "digital", "foreign-linked work", "media", "scale-driven work"],
  Ketu: ["specialist roles", "research", "technical depth", "back-end expertise"],
};

const PLANET_ROLE_MAP: Record<PlanetId, string[]> = {
  Sun: ["manager", "administrator", "team lead"],
  Moon: ["public-facing professional", "hospitality professional"],
  Mars: ["engineer", "operations executor", "technical manager"],
  Mercury: ["banker", "finance professional", "analyst", "operations professional", "auditor", "advisor"],
  Jupiter: ["advisor", "strategist", "teacher", "financial advisor", "legal advisor"],
  Venus: ["brand professional", "relationship manager", "client-facing professional"],
  Saturn: ["operations manager", "compliance officer", "administrator", "process owner"],
  Rahu: ["technology professional", "digital strategist", "scale/growth professional"],
  Ketu: ["specialist", "researcher", "technical expert"],
};

export function buildProfessionFacts(input: Input): ProfessionFacts {
  const natal = normalizeChart(input.natal);
  const d10 = normalizeChart(input.d10);
  const active = input.activePeriods ?? null;

  const domainScores: DomainScoreMap = {};
  const roleScores: DomainScoreMap = {};

  const workStyle: string[] = [];
  const strongestCareerSignals: string[] = [];
  const supportingDivisionalSignals: string[] = [];
  const obstacles: string[] = [];
  const modifiers: string[] = [];
  const dominantCareerPlanets: PlanetId[] = [];

  let confidence = 50;
  let serviceVsBusiness: "service" | "business" | "hybrid" = "service";
  let publicVsBackend: "public" | "backend" | "hybrid" = "backend";
  let leadershipPotential: "low" | "medium" | "high" = "medium";
  let stabilityPattern: "stable" | "changing" | "mixed" = "mixed";

  const ascLord = getAscLord(natal.ascSign);
  const lord10 = getHouseLord(natal, 10);
  const lord6 = getHouseLord(natal, 6);
  const lord2 = getHouseLord(natal, 2);
  const lord11 = getHouseLord(natal, 11);

  const p10 = getPlanetsInHouse(natal, 10);
  const p6 = getPlanetsInHouse(natal, 6);
  const p2 = getPlanetsInHouse(natal, 2);
  const p11 = getPlanetsInHouse(natal, 11);

  const lord10Placement = getPlanetHouse(natal, lord10);
  const ascLordPlacement = getPlanetHouse(natal, ascLord);
  const lord6Placement = getPlanetHouse(natal, lord6);

  // Core: planets in 10th
  for (const pid of p10) {
    const tenthWeight =
  pid === "Moon" ? 3 :
  pid === "Venus" ? 3 :
  pid === "Mercury" ? 6 :
  pid === "Saturn" ? 6 :
  pid === "Sun" ? 5 :
  pid === "Mars" ? 5 :
  pid === "Jupiter" ? 4 :
  4;

addPlanetInfluence(pid, tenthWeight, domainScores, roleScores);
    addUnique(dominantCareerPlanets, pid);
    confidence += 4;
    strongestCareerSignals.push(`${pid} placed in 10th house directly shapes profession.`);
  }
const allNatalPlanets = natal.planets ?? [];

for (const p of allNatalPlanets) {
  if ([10, 6, 2, 11].includes(p.house)) {
    addPlanetInfluence(p.id, 4, domainScores, roleScores);
    addUnique(dominantCareerPlanets, p.id);
    strongestCareerSignals.push(`${p.id} in house ${p.house} contributes directly to profession pattern.`);
    confidence += 2;
  }
}
  // 10th lord placement
  if (lord10) {
    addPlanetInfluence(lord10, 5, domainScores, roleScores);
    addUnique(dominantCareerPlanets, lord10);
    strongestCareerSignals.push(`10th lord ${lord10} is a major profession driver.`);

    if ([1, 6, 10, 11].includes(lord10Placement)) {
      confidence += 8;
      strongestCareerSignals.push(`10th lord ${lord10} placed in house ${lord10Placement} strengthens career expression.`);
    } else if ([3, 5, 9].includes(lord10Placement)) {
      confidence += 4;
      modifiers.push(`10th lord ${lord10} in house ${lord10Placement} adds movement, skill, or growth themes.`);
    } else {
      confidence += 1;
    }
  }

  // 6th lord and 6th house -> job/service pattern
  if (lord6) {
    addPlanetInfluence(lord6, 3, domainScores, roleScores);
    if ([6, 10, 11, 2, 1].includes(lord6Placement)) {
      serviceVsBusiness = "service";
      confidence += 6;
      strongestCareerSignals.push(`6th lord ${lord6} supports structured employment/service work.`);
    }
  }

  if (p6.length > 0) {
    serviceVsBusiness = "service";
    workStyle.push("structured", "responsibility-heavy");
    strongestCareerSignals.push(`6th house activation points to duty, systems, and job-based work.`);
    confidence += 4;
  }

  // 2nd and 11th support livelihood / gains
  for (const pid of [...p2, ...p11]) {
    addPlanetInfluence(pid, 2, domainScores, roleScores);
    addUnique(dominantCareerPlanets, pid);
  }

  if (lord2) {
    addPlanetInfluence(lord2, 2, domainScores, roleScores);
  }
  if (lord11) {
    addPlanetInfluence(lord11, 2, domainScores, roleScores);
  }

  // Ascendant lord
  if (ascLord) {
  addPlanetInfluence(ascLord, 1, domainScores, roleScores);
  addUnique(dominantCareerPlanets, ascLord);
  strongestCareerSignals.push(`Ascendant lord ${ascLord} modifies work style, but does not define profession alone.`);

  if ([10, 6, 11, 1].includes(ascLordPlacement)) {
    confidence += 3;
    strongestCareerSignals.push(`Ascendant lord ${ascLord} connects self with work themes.`);
  }
}
  // Public vs backend
  if (hasAnyOf(p10, ["Sun", "Moon", "Venus", "Jupiter"]) || [7, 10, 11].includes(lord10Placement)) {
    publicVsBackend = "public";
  }
  if (hasAnyOf(p10, ["Mercury", "Saturn", "Ketu"]) || [6, 8, 12].includes(lord10Placement)) {
    publicVsBackend = publicVsBackend === "public" ? "hybrid" : "backend";
  }

  // Leadership
  if (hasAnyOf(p10, ["Sun", "Mars", "Jupiter"]) || lord10 === "Sun") {
    leadershipPotential = "high";
  } else if (hasAnyOf(p10, ["Saturn", "Mercury"])) {
    leadershipPotential = "medium";
  }

  // Stability
  if (hasAnyOf([...p10, ...p6], ["Saturn"])) {
    stabilityPattern = "stable";
  }
  if (hasAnyOf([...p10, ...p6], ["Rahu", "Moon"])) {
    stabilityPattern = stabilityPattern === "stable" ? "mixed" : "changing";
  }

  // Work style based on dominant planets
  const rawDominants = rankPlanetInfluence({
    ascLord,
    lord10,
    lord6,
    p10,
    p6,
    p11,
  });
const natalDominants = rankFullNatalCareerInfluence(natal);

for (const pid of natalDominants.slice(0, 4)) {
  addUnique(dominantCareerPlanets, pid);
}
  for (const pid of rawDominants.slice(0, 3)) {
    addUnique(dominantCareerPlanets, pid);
  }

  if (dominantCareerPlanets.includes("Mercury")) {
    pushMany(workStyle, ["analytical", "detail-oriented", "systems-minded"]);
  }
  if (dominantCareerPlanets.includes("Saturn")) {
    pushMany(workStyle, ["structured", "process-driven", "enduring"]);
  }
  if (dominantCareerPlanets.includes("Jupiter")) {
    pushMany(workStyle, ["strategic", "guidance-oriented"]);
  }
  if (dominantCareerPlanets.includes("Sun")) {
    pushMany(workStyle, ["visible", "responsibility-heavy"]);
  }
  if (dominantCareerPlanets.includes("Rahu")) {
    pushMany(workStyle, ["ambitious", "restless", "growth-seeking"]);
    obstacles.push("Rahu influence can create dissatisfaction or role restlessness.");
  }

  // D10 overlay
  const d10Lord10 = getHouseLord(d10, 10);
  const d10P10 = getPlanetsInHouse(d10, 10);

  if (d10Lord10) {
  addPlanetInfluence(d10Lord10, 7, domainScores, roleScores);
  addUnique(dominantCareerPlanets, d10Lord10);
  supportingDivisionalSignals.push(`D10 10th lord ${d10Lord10} strongly reinforces career style.`);
  confidence += 8;
}

for (const pid of d10P10) {
  addPlanetInfluence(pid, 6, domainScores, roleScores);
  addUnique(dominantCareerPlanets, pid);
  supportingDivisionalSignals.push(`D10 ${pid} in 10th strongly shapes professional execution.`);
  confidence += 5;
}

  if (lord10 && d10Lord10 && lord10 === d10Lord10) {
    confidence += 8;
    supportingDivisionalSignals.push(`Natal and D10 both emphasize ${lord10} as career driver.`);
  }

  // Dasha modifiers only
  const md = asPlanetId(active?.mahadasha?.lord);
  const ad = asPlanetId(active?.antardasha?.subLord || active?.antardasha?.lord);
  const pd = asPlanetId(active?.pratyantardasha?.lord);

  for (const pid of [md, ad, pd].filter(Boolean) as PlanetId[]) {
    modifiers.push(`${pid} is active in current dasha stack and modifies how work is experienced now.`);
    if (pid === lord10 || pid === ascLord || pid === lord6) {
      confidence += 3;
    }
    if (pid === "Venus") {
      modifiers.push("Venus adds polish, relationship handling, and presentation to current work.");
      if (publicVsBackend === "backend") publicVsBackend = "hybrid";
    }
    if (pid === "Rahu") {
      modifiers.push("Rahu adds ambition, impatience, experimentation, or foreign/digital flavor.");
      stabilityPattern = stabilityPattern === "stable" ? "mixed" : stabilityPattern;
    }
    if (pid === "Saturn") {
      modifiers.push("Saturn increases responsibility, pressure, and institutional structure.");
    }
  }

  // Strong correction rule: Mercury + Saturn dominance
 if (
  dominantCareerPlanets.includes("Mercury") &&
  dominantCareerPlanets.includes("Saturn")
) {
  boost(domainScores, ["banking", "finance", "operations", "audit", "compliance", "analytics"], 14);
  boost(roleScores, ["banker", "finance professional", "operations professional", "analyst", "compliance officer", "auditor"], 14);

  strongestCareerSignals.push(
    "Mercury + Saturn strongly favors structured analytical professions such as banking, finance, operations, audit, and compliance."
  );

  serviceVsBusiness = "service";
  publicVsBackend = "backend";
  confidence += 15;
}
if (
  dominantCareerPlanets.includes("Mercury") &&
  (lord10 === "Mercury" || lord6 === "Mercury" || ascLord === "Mercury")
) {
  boost(domainScores, ["banking", "finance", "analytics", "audit", "operations"], 10);
  boost(roleScores, ["banker", "finance professional", "analyst", "auditor", "operations professional"], 10);

  strongestCareerSignals.push(
    "Mercury as a core chart driver strengthens finance, analysis, audit, and systems-based work."
  );

  confidence += 10;
}
if (
  dominantCareerPlanets.includes("Venus") &&
  !dominantCareerPlanets.includes("Mercury") &&
  !dominantCareerPlanets.includes("Saturn") &&
  likelyRolesAreOnly(roleScores, ["brand professional", "relationship manager", "client-facing professional"])
) {
  confidence -= 8;
  modifiers.push("Venus alone is being over-read; treat it as style/presentation unless supported by stronger career factors.");
}
if (
  dominantCareerPlanets.includes("Saturn") ||
  dominantCareerPlanets.includes("Sun")
) {
  boost(
    domainScores,
    ["operations", "administration", "compliance", "institutional work", "management"],
    8
  );

  boost(
    roleScores,
    ["operations professional", "administrator", "compliance officer", "manager"],
    8
  );

  strongestCareerSignals.push(
    "Saturn/Sun influence shifts the profession toward structured institutional responsibility rather than purely soft public-facing roles."
  );

  confidence += 8;
}
if (
  p10.includes("Moon") &&
  dominantCareerPlanets.includes("Saturn")
) {
  modifiers.push(
    "Moon in 10th adds public visibility and responsiveness, but Saturn keeps the profession grounded in structured work."
  );

  boost(
    domainScores,
    ["operations", "administration", "compliance", "finance"],
    6
  );

  boost(
    roleScores,
    ["operations professional", "administrator", "compliance officer", "finance professional"],
    6
  );
}
  // Convert to ranked outputs
  const likelyDomains = topKeys(domainScores, 4);
  const likelyRoles = topKeys(roleScores, 4);

  return {
    likelyDomains,
    likelyRoles,
    workStyle: uniq(workStyle),
    serviceVsBusiness,
    publicVsBackend,
    leadershipPotential,
    stabilityPattern,
    dominantCareerPlanets: uniqPlanetIds(dominantCareerPlanets),
    strongestCareerSignals: uniq(strongestCareerSignals),
    supportingDivisionalSignals: uniq(supportingDivisionalSignals),
    obstacles: uniq(obstacles),
    modifiers: uniq(modifiers),
    confidence: clamp(confidence, 0, 100),
  };
}

/* ---------------- helpers ---------------- */
function likelyRolesAreOnly(map: DomainScoreMap, roles: string[]): boolean {
  const top = topKeys(map, 3);
  return top.length > 0 && top.every((r) => roles.includes(r));
}
function normalizeChart(chart: NatalLike | D10Like | null | undefined) {
  const rawHouses = chart?.houses;
  const houses: Record<number, HouseInfo> = {};

  if (Array.isArray(rawHouses)) {
    for (const h of rawHouses) {
      const num = Number(h?.house ?? h?.index ?? h?.num ?? h?.h);
      if (!Number.isFinite(num) || num < 1 || num > 12) continue;
      houses[num] = {
        sign: h?.sign,
        lord: asPlanetId(h?.lord) ?? undefined,
        strength: h?.strength ?? "average",
      };
    }
  } else if (rawHouses && typeof rawHouses === "object") {
    for (const k of Object.keys(rawHouses)) {
      const num = Number(k);
      const v = (rawHouses as Record<string, any>)[k];
      if (!Number.isFinite(num) || num < 1 || num > 12) continue;
      houses[num] = {
        sign: v?.sign,
        lord: asPlanetId(v?.lord) ?? undefined,
        strength: v?.strength ?? "average",
      };
    }
  }

  const planets = Array.isArray(chart?.planets)
  ? chart!.planets
      .map((p) => ({
        id: asPlanetId(p?.id ?? p?.name),
        sign: p?.sign,
        house: Number(p?.house),
        deg: Number(p?.deg ?? p?.siderealLongitude ?? 0),
      }))
      .filter((p) => p.id && Number.isFinite(p.house))
  : [];

  return {
    ascSign: chart?.ascSign ?? null,
    houses,
    planets: planets as Array<{ id: PlanetId; sign?: string; house: number; deg: number }>,
  };
}

function getAscLord(sign?: string | null): PlanetId | null {
  const map: Record<string, PlanetId> = {
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
  return sign && map[sign] ? map[sign] : null;
}

function getHouseLord(chart: ReturnType<typeof normalizeChart>, houseNum: number): PlanetId | null {
  const direct = chart.houses[houseNum]?.lord ?? null;
  if (direct) return direct;

  const derivedSign = getHouseSignFromAsc(chart.ascSign, houseNum);
  return getSignLord(derivedSign);
}

function getPlanetsInHouse(chart: ReturnType<typeof normalizeChart>, houseNum: number): PlanetId[] {
  return chart.planets.filter((p) => p.house === houseNum).map((p) => p.id);
}

function getPlanetHouse(chart: ReturnType<typeof normalizeChart>, pid: PlanetId | null): number {
  if (!pid) return 0;
  return chart.planets.find((p) => p.id === pid)?.house ?? 0;
}

function addPlanetInfluence(
  pid: PlanetId,
  weight: number,
  domainScores: DomainScoreMap,
  roleScores: DomainScoreMap
) {
  for (const d of PLANET_DOMAIN_MAP[pid] ?? []) {
    domainScores[d] = (domainScores[d] ?? 0) + weight;
  }
  for (const r of PLANET_ROLE_MAP[pid] ?? []) {
    roleScores[r] = (roleScores[r] ?? 0) + weight;
  }
}

function rankPlanetInfluence(input: {
  ascLord: PlanetId | null;
  lord10: PlanetId | null;
  lord6: PlanetId | null;
  p10: PlanetId[];
  p6: PlanetId[];
  p11: PlanetId[];
}): PlanetId[] {
  const score: Partial<Record<PlanetId, number>> = {};

  for (const pid of [input.ascLord, input.lord10, input.lord6].filter(Boolean) as PlanetId[]) {
    score[pid] = (score[pid] ?? 0) + 5;
  }
  for (const pid of input.p10) score[pid] = (score[pid] ?? 0) + 5;
  for (const pid of input.p6) score[pid] = (score[pid] ?? 0) + 3;
  for (const pid of input.p11) score[pid] = (score[pid] ?? 0) + 2;

  return (Object.entries(score) as Array<[PlanetId, number]>)
    .sort((a, b) => b[1] - a[1])
    .map(([pid]) => pid);
}
function getSimpleDignity(pid: PlanetId, sign?: string): "exalted" | "own" | "debilitated" | "neutral" {
  if (!sign) return "neutral";

  const exalted: Partial<Record<PlanetId, string>> = {
    Sun: "Aries",
    Moon: "Taurus",
    Mars: "Capricorn",
    Mercury: "Virgo",
    Jupiter: "Cancer",
    Venus: "Pisces",
    Saturn: "Libra",
  };

  const debilitated: Partial<Record<PlanetId, string>> = {
    Sun: "Libra",
    Moon: "Scorpio",
    Mars: "Cancer",
    Mercury: "Pisces",
    Jupiter: "Capricorn",
    Venus: "Virgo",
    Saturn: "Aries",
  };

  const ownSigns: Partial<Record<PlanetId, string[]>> = {
    Sun: ["Leo"],
    Moon: ["Cancer"],
    Mars: ["Aries", "Scorpio"],
    Mercury: ["Gemini", "Virgo"],
    Jupiter: ["Sagittarius", "Pisces"],
    Venus: ["Taurus", "Libra"],
    Saturn: ["Capricorn", "Aquarius"],
  };

  if (exalted[pid] === sign) return "exalted";
  if (debilitated[pid] === sign) return "debilitated";
  if ((ownSigns[pid] ?? []).includes(sign)) return "own";

  return "neutral";
}
function rankFullNatalCareerInfluence(
  chart: ReturnType<typeof normalizeChart>
): PlanetId[] {
  const score: Partial<Record<PlanetId, number>> = {};

  for (const p of chart.planets) {
    score[p.id] = (score[p.id] ?? 0) + 1;

    // profession-relevant houses
    if (p.house === 10) score[p.id] = (score[p.id] ?? 0) + 6;
    if (p.house === 6) score[p.id] = (score[p.id] ?? 0) + 4;
    if (p.house === 11) score[p.id] = (score[p.id] ?? 0) + 3;
    if (p.house === 2) score[p.id] = (score[p.id] ?? 0) + 3;
    if (p.house === 1) score[p.id] = (score[p.id] ?? 0) + 2;
    if (p.house === 9) score[p.id] = (score[p.id] ?? 0) + 2;

    // dignity
    if (p.sign) {
      const dignity = getSimpleDignity(p.id, p.sign);
      if (dignity === "own") score[p.id] = (score[p.id] ?? 0) + 3;
      if (dignity === "exalted") score[p.id] = (score[p.id] ?? 0) + 4;
      if (dignity === "debilitated") score[p.id] = (score[p.id] ?? 0) - 2;
    }
  }

  return (Object.entries(score) as Array<[PlanetId, number]>)
    .sort((a, b) => b[1] - a[1])
    .map(([pid]) => pid);
}
function hasAnyOf(arr: PlanetId[], targets: PlanetId[]): boolean {
  return arr.some((x) => targets.includes(x));
}

function pushMany(target: string[], items: string[]) {
  for (const item of items) {
    if (!target.includes(item)) target.push(item);
  }
}

function boost(map: DomainScoreMap, keys: string[], amount: number) {
  for (const key of keys) {
    map[key] = (map[key] ?? 0) + amount;
  }
}

function topKeys(map: DomainScoreMap, n: number): string[] {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key]) => key);
}

function addUnique(target: PlanetId[], pid: PlanetId) {
  if (!target.includes(pid)) target.push(pid);
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr.map((x) => String(x).trim()).filter(Boolean)));
}

function uniqPlanetIds(arr: PlanetId[]) {
  return Array.from(new Set(arr));
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
const SIGN_ORDER = [
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
] as const;

function getHouseSignFromAsc(ascSign?: string | null, houseNum?: number): string | null {
  if (!ascSign || !houseNum || houseNum < 1 || houseNum > 12) return null;
  const start = SIGN_ORDER.indexOf(ascSign as any);
  if (start < 0) return null;
  return SIGN_ORDER[(start + houseNum - 1) % 12];
}

function getSignLord(sign?: string | null): PlanetId | null {
  const map: Record<string, PlanetId> = {
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
  return sign && map[sign] ? map[sign] : null;
}
function asPlanetId(x: any): PlanetId | null {
  const s = String(x ?? "").trim();
  if (
    s === "Sun" ||
    s === "Moon" ||
    s === "Mars" ||
    s === "Mercury" ||
    s === "Jupiter" ||
    s === "Venus" ||
    s === "Saturn" ||
    s === "Rahu" ||
    s === "Ketu"
  ) {
    return s;
  }
  return null;
}