export const SIGN_TO_NUMBER: Record<string, number> = {
  Aries: 1,
  Taurus: 2,
  Gemini: 3,
  Cancer: 4,
  Leo: 5,
  Virgo: 6,
  Libra: 7,
  Scorpio: 8,
  Sagittarius: 9,
  Capricorn: 10,
  Aquarius: 11,
  Pisces: 12,
};

export const SIGN_LORDS: Record<string, string> = {
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

export type CanonicalPlanet = {
  planet: string;
  sign: string | null;
  house: number | null;
  degree: number | null;
  nakshatra: string | null;
};

export type CanonicalHouse = {
  house: number;
  sign: string;
  lord: string;
  occupants: string[];
};

export type CanonicalChartContext = {
  lagnaSign: string | null;
  lagnaSource: string | null;
  houses: CanonicalHouse[];
  houseSigns: Record<number, string>;
  houseLords: Record<number, string>;
  planets: CanonicalPlanet[];
  warnings: string[];
};

const PLANETS = [
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

function normalizeSign(value: unknown): string | null {
  const raw = String(value ?? "").trim().toLowerCase();
  if (!raw) return null;
  return Object.keys(SIGN_TO_NUMBER).find((sign) => sign.toLowerCase() === raw) ?? null;
}

function normalizePlanet(value: unknown): string | null {
  const raw = String(value ?? "").trim().toLowerCase();
  if (!raw) return null;
  return PLANETS.find((planet) => planet.toLowerCase() === raw) ?? null;
}

function normalizeHouse(value: unknown): number | null {
  const number = Number(value);
  return Number.isFinite(number) && number >= 1 && number <= 12 ? Math.trunc(number) : null;
}

function normalizeDegree(value: unknown): number | null {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  const withinSign = ((number % 30) + 30) % 30;
  return withinSign >= 0 && withinSign < 30 ? withinSign : null;
}

function readD1(report: any): any {
  return (
    report?.divisionalCharts?.D1 ??
    report?.vargas?.D1 ??
    report?.chartContext?.divisionalCharts?.D1 ??
    report?.chartContext?.vargas?.D1 ??
    report?.dataEngine?.divisionalCharts?.D1 ??
    report?.dataEngine?.vargas?.D1 ??
    null
  );
}

function resolveLagna(report: any): { sign: string | null; source: string | null } {
  const d1 = readD1(report);
  const candidates: Array<[string, unknown]> = [
    ["D1 ascendant", d1?.ascendant?.sign],
    ["D1 ascendantSign", d1?.ascendantSign],
    ["D1 lagna", d1?.lagna?.sign],
    ["chartContext ascendant", report?.chartContext?.ascendant?.sign],
    ["chartContext ascendantSign", report?.chartContext?.ascendantSign],
    ["natal ascendant", report?.natal?.ascendant?.sign],
    ["natal ascendantSign", report?.natal?.ascendantSign],
    ["birthChart ascendant", report?.birthChart?.ascendant?.sign],
    ["report ascendant", report?.ascendant?.sign],
    ["report ascendantSign", report?.ascendantSign],
    ["report lagna", report?.lagna?.sign],
    ["report lagnaSign", report?.lagnaSign],
  ];

  for (const [source, value] of candidates) {
    const sign = normalizeSign(value);
    if (sign) return { sign, source };
  }

  return { sign: null, source: null };
}

function resolvePlanetRows(report: any): any[] {
  const d1 = readD1(report);
  const candidates = [
    d1?.planets,
    d1?.planetaryPositions,
    report?.chartContext?.planets,
    report?.natal?.planets,
    report?.birthChart?.planets,
    report?.planets,
    report?.baseChartFactors?.planets,
  ];
  return candidates.find(Array.isArray) ?? [];
}

function signForHouse(lagnaSign: string, house: number): string {
  const signNumber = ((SIGN_TO_NUMBER[lagnaSign] + house - 2) % 12) + 1;
  return Object.entries(SIGN_TO_NUMBER).find(([, number]) => number === signNumber)?.[0] ?? lagnaSign;
}

export function buildCanonicalChartContext(report: any): CanonicalChartContext {
  const warnings: string[] = [];
  const { sign: lagnaSign, source: lagnaSource } = resolveLagna(report);

  const planets: CanonicalPlanet[] = resolvePlanetRows(report)
    .map((row: any): CanonicalPlanet | null => {
      const planet = normalizePlanet(row?.planet ?? row?.name ?? row?.graha);
      if (!planet) return null;
      return {
        planet,
        sign: normalizeSign(row?.sign ?? row?.rashi ?? row?.signName),
        house: normalizeHouse(row?.house ?? row?.houseNumber ?? row?.bhava),
        degree: normalizeDegree(row?.degree ?? row?.degreeInSign ?? row?.longitude),
        nakshatra: String(row?.nakshatra ?? row?.nakshatraName ?? row?.star ?? "").trim() || null,
      };
    })
    .filter((row: CanonicalPlanet | null): row is CanonicalPlanet => Boolean(row));

  if (!lagnaSign) warnings.push("Canonical D1 ascendant could not be resolved.");
  if (planets.length === 0) warnings.push("Canonical D1 planet placements could not be resolved.");

  const houseSigns: Record<number, string> = {};
  const houseLords: Record<number, string> = {};
  const houses: CanonicalHouse[] = [];

  if (lagnaSign) {
    for (let house = 1; house <= 12; house += 1) {
      const sign = signForHouse(lagnaSign, house);
      const lord = SIGN_LORDS[sign];
      houseSigns[house] = sign;
      houseLords[house] = lord;
      houses.push({
        house,
        sign,
        lord,
        occupants: planets.filter((planet) => planet.house === house).map((planet) => planet.planet),
      });
    }
  }

  return { lagnaSign, lagnaSource, houses, houseSigns, houseLords, planets, warnings };
}

export function describeHouseReference(context: CanonicalChartContext, house: number): string {
  const sign = context.houseSigns[house];
  const lord = context.houseLords[house];
  if (!sign || !lord) return `House ${house}`;
  const lordPlacement = context.planets.find((planet) => planet.planet === lord);
  const placement = lordPlacement?.house
    ? `${lord} placed in house ${lordPlacement.house}${lordPlacement.sign ? ` in ${lordPlacement.sign}` : ""}`
    : `${lord}`;
  return `House ${house} is ${sign}, ruled by ${placement}`;
}
