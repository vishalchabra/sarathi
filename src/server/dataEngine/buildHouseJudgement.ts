type AnyObj = Record<string, any>;

export type HouseJudgementRow = {
  house: number;
  sign: string | null;
  lord: string | null;
  lordHouse: number | null;
  lordSign: string | null;

  occupants: string[];
  occupantCount: number;

  aspectedBy: string[];
  aspectingPlanetsDetailed: Array<{
    planet: string;
    fromHouse: number | null;
    aspectType: string;
  }>;

  beneficCount: number;
  maleficCount: number;

  houseLordStrengthBand: "strong" | "medium" | "weak";
  houseStrengthLabel: "strong" | "mixed" | "challenged";
  summaryLine: string;
};

type BuildParams = {
  houses?: AnyObj[] | null;
  natal?: AnyObj | null;
  vedicAspects?: AnyObj | null;
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

const SIGN_NUM_TO_NAME: Record<number, string> = {
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

  const abbr: Record<string, number> = {
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

  return abbr[raw] ?? null;
}

function signNumToName(signNum: number | null): string | null {
  if (!signNum) return null;
  return SIGN_NUM_TO_NAME[signNum] ?? null;
}

function uniqStrings(arr: string[]): string[] {
  return Array.from(new Set(arr.filter(Boolean)));
}

function getPlanetRow(natal: AnyObj | null, planet: string | null): AnyObj | null {
  if (!planet) return null;
  const planets = Array.isArray(natal?.planets) ? natal.planets : [];

  return (
    planets.find((p: AnyObj) => normPlanetName(p?.planet ?? p?.name) === planet) ?? null
  );
}

function getStrengthRow(natal: AnyObj | null, planet: string | null): AnyObj | null {
  if (!planet) return null;
  const rows = Array.isArray(natal?.strengths) ? natal.strengths : [];

  return (
    rows.find((r: AnyObj) => normPlanetName(r?.planet ?? r?.name) === planet) ?? null
  );
}

function getHouseNumber(row: AnyObj | null | undefined): number | null {
  if (!row) return null;
  if (typeof row.house === "number") return row.house;
  if (typeof row.houseNum === "number") return row.houseNum;
  if (typeof row.number === "number") return row.number;
  if (typeof row.bhava === "number") return row.bhava;
  return null;
}

function getHouseSign(row: AnyObj | null | undefined): string | null {
  if (!row) return null;
  const raw = row.sign ?? row.rashi ?? null;
  if (raw) return String(raw);
  const signNum =
    typeof row.signNum === "number" ? row.signNum : null;
  return signNumToName(signNum);
}

function getHouseLord(row: AnyObj | null | undefined, house: number): string | null {
  const explicit =
    normPlanetName(row?.lord) ??
    normPlanetName(row?.houseLord) ??
    normPlanetName(row?.owner);

  if (explicit) return explicit;

  const signNum =
    typeof row?.signNum === "number"
      ? row.signNum
      : toSignNum(row?.sign ?? row?.rashi);

  if (!signNum) return null;

  return SIGN_LORDS[signNum] ?? null;
}

function getStrengthBand(natal: AnyObj | null, planet: string | null): "strong" | "medium" | "weak" {
  const row = getStrengthRow(natal, planet);
  const candidates = [
    row?.strengthBand,
    row?.band,
    row?.strength,
    row?.strengthLabel,
    row?.status,
    row?.dignity,
  ];

  for (const c of candidates) {
    const raw = String(c ?? "").toLowerCase();
    if (!raw) continue;
    if (raw.includes("strong")) return "strong";
    if (raw.includes("weak")) return "weak";
    if (raw.includes("medium") || raw.includes("moderate") || raw.includes("average")) {
      return "medium";
    }
    if (/exalt|own|mool|vargottama/.test(raw)) return "strong";
    if (/debil|enemy|fallen/.test(raw)) return "weak";
  }

  return "medium";
}
function isWaxingMoon(moonLon: number | null, sunLon: number | null) {
  if (typeof moonLon !== "number" || typeof sunLon !== "number") {
    return null;
  }

  const diff = ((moonLon - sunLon + 360) % 360);
  return diff > 0 && diff < 180;
}

function isMercuryBenefic(natal: AnyObj | null) {
  const conjunctions = getConjunctions(natal, "Mercury");

  const hasMaleficAssociation = conjunctions.some((p) =>
    ["Sun", "Mars", "Saturn", "Rahu", "Ketu"].includes(p)
  );

  return !hasMaleficAssociation;
}
function isBenefic(planet: string | null, natal: AnyObj | null): boolean {
  if (!planet) return false;

  if (planet === "Jupiter" || planet === "Venus") return true;
  if (planet === "Rahu" || planet === "Ketu" || planet === "Saturn" || planet === "Mars" || planet === "Sun") {
    return false;
  }

if (planet === "Moon") {
  const moon = getPlanetRow(natal, "Moon");
  const sun = getPlanetRow(natal, "Sun");

  const waxing = isWaxingMoon(
    moon?.siderealLongitude ?? moon?.lon ?? null,
    sun?.siderealLongitude ?? sun?.lon ?? null
  );

  return waxing === true;
}

if (planet === "Mercury") {
  return isMercuryBenefic(natal);
}
  return false;
}

function isMalefic(planet: string | null, natal?: AnyObj | null): boolean {
  if (!planet) return false;

  if (["Sun", "Mars", "Saturn", "Rahu", "Ketu"].includes(planet)) {
    return true;
  }

  if (planet === "Moon") {
    const moon = getPlanetRow(natal ?? null, "Moon");
    const sun = getPlanetRow(natal ?? null, "Sun");

    const waxing = isWaxingMoon(
      moon?.siderealLongitude ?? moon?.lon ?? null,
      sun?.siderealLongitude ?? sun?.lon ?? null
    );

    return waxing === false;
  }

  if (planet === "Mercury") {
    return !isMercuryBenefic(natal ?? null);
  }

  return false;
}

function buildOccupants(natal: AnyObj | null, house: number): string[] {
  const planets = Array.isArray(natal?.planets) ? natal.planets : [];

  return uniqStrings(
    planets
      .filter((p: AnyObj) => getHouseNumber(p) === house)
      .map((p: AnyObj) => normPlanetName(p?.planet ?? p?.name) ?? "")
      .filter(Boolean)
  );
}
function angularDistance(a: number, b: number) {
  const diff = Math.abs((((a - b) % 360) + 540) % 360 - 180);
  return diff;
}

function getPlanetLongitude(row: AnyObj | null | undefined): number | null {
  const lon =
    typeof row?.siderealLongitude === "number"
      ? row.siderealLongitude
      : typeof row?.lon === "number"
      ? row.lon
      : typeof row?.longitude === "number"
      ? row.longitude
      : null;

  return typeof lon === "number" && Number.isFinite(lon) ? lon : null;
}

function getConjunctions(
  natal: AnyObj | null,
  planet: string,
  orb = 8
): string[] {
  const result: string[] = [];

  const aspects = Array.isArray(natal?.aspects) ? natal.aspects : [];

  for (const a of aspects) {
    const type = String(a?.aspectType ?? a?.type ?? a?.label ?? "").toLowerCase();

    if (!type.includes("conj")) continue;

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

  const planets = Array.isArray(natal?.planets) ? natal.planets : [];
  const targetRow = getPlanetRow(natal, planet);
  const targetLon = getPlanetLongitude(targetRow);

  if (targetLon !== null) {
    for (const row of planets) {
      const other = normPlanetName(row?.planet ?? row?.name);
      if (!other || other === planet) continue;

      const otherLon = getPlanetLongitude(row);
      if (otherLon === null) continue;

      if (angularDistance(targetLon, otherLon) <= orb) {
        result.push(other);
      }
    }
  }

  return uniqStrings(result);
}
function buildAspectDetails(vedicAspects: AnyObj | null, house: number) {
  const rows = Array.isArray(vedicAspects?.houses) ? vedicAspects.houses : [];
  const target = rows.find((r: AnyObj) => r?.house === house);

  const detailed = Array.isArray(target?.aspectedBy)
    ? target.aspectedBy
        .map((r: AnyObj) => ({
          planet: normPlanetName(r?.planet) ?? String(r?.planet ?? ""),
          fromHouse:
            typeof r?.fromHouse === "number" ? r.fromHouse : null,
          aspectType: String(r?.aspectType ?? "aspect"),
        }))
        .filter((r: any) => r.planet)
    : [];

  return {
    detailed,
    simple: uniqStrings(detailed.map((r: any) => r.planet)),
  };
}

function getHouseStrengthLabel(params: {
  occupantCount: number;
  beneficCount: number;
  maleficCount: number;
  lordStrengthBand: "strong" | "medium" | "weak";
}): "strong" | "mixed" | "challenged" {
  const { beneficCount, maleficCount, lordStrengthBand, occupantCount } = params;

  let score = 0;

  if (lordStrengthBand === "strong") score += 2;
  if (lordStrengthBand === "medium") score += 1;
  if (lordStrengthBand === "weak") score -= 2;

  score += beneficCount;
  score -= maleficCount;

  if (occupantCount >= 2) score += 1;

  if (score >= 2) return "strong";
  if (score <= -1) return "challenged";
  return "mixed";
}
function buildSummaryLine(params: {
  lord: string | null;
  lordHouse: number | null;
  houseStrengthLabel: "strong" | "mixed" | "challenged";
  beneficCount: number;
  maleficCount: number;
  occupants: string[];
  aspects: string[];
}) {
  const {
    lord,
    lordHouse,
    houseStrengthLabel,
    beneficCount,
    maleficCount,
    occupants,
    aspects,
  } = params;

  let parts: string[] = [];

  // 1. base tone
  if (houseStrengthLabel === "strong") {
    parts.push("This house is strong");
  } else if (houseStrengthLabel === "challenged") {
    parts.push("This house faces pressure");
  } else {
    parts.push("This house shows mixed influences");
  }

  // 2. lord placement
  if (lord && lordHouse) {
    parts.push(`with its lord ${lord} placed in house ${lordHouse}`);
  }

  // 3. occupants
  if (occupants.length === 1) {
    parts.push(`and influenced by ${occupants[0]}`);
  } else if (occupants.length > 1) {
    parts.push(`and influenced by ${occupants.join(", ")}`);
  }

  // 4. aspects
  if (aspects.length === 1) {
    parts.push(`along with influence from ${aspects[0]}`);
  } else if (aspects.length > 1) {
    parts.push(`along with influence from ${aspects.slice(0, 2).join(", ")}`);
  }

  // 5. balance
  if (maleficCount > beneficCount) {
    parts.push("creating pressure");
  } else if (beneficCount > maleficCount) {
    parts.push("providing support");
  }

  return parts.join(" ") + ".";
}
export function buildHouseJudgement(params: BuildParams): HouseJudgementRow[] {
  const houses = Array.isArray(params?.houses) ? params.houses : [];

  return Array.from({ length: 12 }, (_, idx) => {
    const house = idx + 1;
    const houseRow =
      houses.find((h: AnyObj) => getHouseNumber(h) === house) ?? null;

    const sign = getHouseSign(houseRow);
    const lord = getHouseLord(houseRow, house);

    const lordRow = getPlanetRow(params?.natal ?? null, lord);
    const lordHouse = getHouseNumber(lordRow);
    const lordSign =
      (lordRow?.sign ?? lordRow?.rashi ?? null) ||
      signNumToName(
        typeof lordRow?.signNum === "number"
          ? lordRow.signNum
          : toSignNum(lordRow?.sign ?? lordRow?.rashi)
      );

    const occupants = buildOccupants(params?.natal ?? null, house);
    const aspectInfo = buildAspectDetails(params?.vedicAspects ?? null, house);

    const beneficCount = uniqStrings([
  ...occupants.filter((p) => isBenefic(p, params?.natal ?? null)),
  ...aspectInfo.simple.filter((p) => isBenefic(p, params?.natal ?? null)),
]).length;

const maleficCount = uniqStrings([
  ...occupants.filter((p) => isMalefic(p, params?.natal ?? null)),
...aspectInfo.simple.filter((p) => isMalefic(p, params?.natal ?? null)),
]).length;

    const houseLordStrengthBand = getStrengthBand(params?.natal ?? null, lord);

    const houseStrengthLabel = getHouseStrengthLabel({
      occupantCount: occupants.length,
      beneficCount,
      maleficCount,
      lordStrengthBand: houseLordStrengthBand,
    });
    const summaryLine = buildSummaryLine({
  lord,
  lordHouse,
  houseStrengthLabel,
  beneficCount,
  maleficCount,
  occupants,
  aspects: aspectInfo.simple,
});
    return {
      house,
      sign,
      lord,
      lordHouse,
      lordSign,

      occupants,
      occupantCount: occupants.length,

      aspectedBy: aspectInfo.simple,
      aspectingPlanetsDetailed: aspectInfo.detailed,

      beneficCount,
      maleficCount,

      houseLordStrengthBand,
      houseStrengthLabel,
      summaryLine,
    };
  });
}

export default buildHouseJudgement;