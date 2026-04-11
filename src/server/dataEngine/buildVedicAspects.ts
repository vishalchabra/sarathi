type AnyObj = Record<string, any>;

export type VedicPlanetAspectGiven = {
  fromPlanet: string;
  fromHouse: number | null;
  toHouse: number;
  aspectType: string;
  housesAway: number;
};

export type VedicPlanetAspectReceived = {
  toPlanet: string;
  fromPlanet: string;
  fromHouse: number | null;
  toHouse: number | null;
  aspectType: string;
  housesAway: number;
};

export type VedicHouseAspect = {
  house: number;
  aspectedBy: Array<{
    planet: string;
    fromHouse: number | null;
    aspectType: string;
    housesAway: number;
  }>;
};

export type VedicPlanetAspectSummary = {
  planet: string;
  house: number | null;
  sign: string | null;
  given: VedicPlanetAspectGiven[];
  received: VedicPlanetAspectReceived[];
};

export type VedicAspectsOutput = {
  planets: VedicPlanetAspectSummary[];
  houses: VedicHouseAspect[];
  allAspects: Array<{
    fromPlanet: string;
    toHouse: number;
    toPlanet: string | null;
    fromHouse: number | null;
    aspectType: string;
    housesAway: number;
  }>;
};

type BuildParams = {
  natalPlanets?: AnyObj[] | null;
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

function normPlanetName(value: any): string | null {
  if (!value) return null;
  const raw = String(value).trim().toLowerCase();

  const found = PLANET_NAMES.find((p) => p.toLowerCase() === raw);
  if (found) return found;

  if (raw === "north node") return "Rahu";
  if (raw === "south node") return "Ketu";

  return null;
}

function uniqBy<T>(arr: T[], keyFn: (item: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];

  for (const item of arr) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  return out;
}

function getHouse(row: AnyObj | null | undefined): number | null {
  if (!row) return null;

  if (typeof row.house === "number") return row.house;
  if (typeof row.houseNum === "number") return row.houseNum;
  if (typeof row.bhava === "number") return row.bhava;

  return null;
}

function getSign(row: AnyObj | null | undefined): string | null {
  if (!row) return null;
  return row.sign ?? row.rashi ?? null;
}

function normalizePlanets(natalPlanets: AnyObj[] | null | undefined): AnyObj[] {
  return (Array.isArray(natalPlanets) ? natalPlanets : [])
    .map((p) => {
      const planet =
        normPlanetName(p?.planet ?? p?.name) ??
        String(p?.planet ?? p?.name ?? "").trim();

      return {
        ...p,
        planet,
        house: getHouse(p),
        sign: getSign(p),
      };
    })
    .filter((p) =>
  Boolean(p.planet) &&
  PLANET_NAMES.includes(p.planet as (typeof PLANET_NAMES)[number])
);
}

function housesAway(fromHouse: number, toHouse: number): number {
  return ((toHouse - fromHouse + 12) % 12) + 1;
}

function houseFromOffset(fromHouse: number, offset: number): number {
  return ((fromHouse + offset - 2) % 12) + 1;
}

function getAspectRules(planet: string): Array<{ offset: number; aspectType: string }> {
  switch (planet) {
    case "Mars":
      return [
        { offset: 4, aspectType: "special 4th" },
        { offset: 7, aspectType: "7th" },
        { offset: 8, aspectType: "special 8th" },
      ];

    case "Jupiter":
      return [
        { offset: 5, aspectType: "special 5th" },
        { offset: 7, aspectType: "7th" },
        { offset: 9, aspectType: "special 9th" },
      ];

    case "Saturn":
      return [
        { offset: 3, aspectType: "special 3rd" },
        { offset: 7, aspectType: "7th" },
        { offset: 10, aspectType: "special 10th" },
      ];

    case "Rahu":
    case "Ketu":
      return [
        { offset: 5, aspectType: "node 5th" },
        { offset: 7, aspectType: "7th" },
        { offset: 9, aspectType: "node 9th" },
      ];

    default:
      return [{ offset: 7, aspectType: "7th" }];
  }
}

export function buildVedicAspects(params: BuildParams): VedicAspectsOutput {
  const planets = normalizePlanets(params?.natalPlanets);

  const houseMap = new Map<number, string[]>();
  for (let h = 1; h <= 12; h += 1) {
    houseMap.set(h, []);
  }

  for (const p of planets) {
    if (typeof p.house === "number") {
      houseMap.set(p.house, [...(houseMap.get(p.house) ?? []), p.planet]);
    }
  }

  const allAspects: VedicAspectsOutput["allAspects"] = [];

  for (const fromPlanet of planets) {
    const fromHouse = fromPlanet.house;
    if (typeof fromHouse !== "number") continue;

    const rules = getAspectRules(fromPlanet.planet);

    for (const rule of rules) {
      const toHouse = houseFromOffset(fromHouse, rule.offset);
      const planetsInTargetHouse = houseMap.get(toHouse) ?? [];

      if (!planetsInTargetHouse.length) {
        allAspects.push({
          fromPlanet: fromPlanet.planet,
          toHouse,
          toPlanet: null,
          fromHouse,
          aspectType: rule.aspectType,
          housesAway: housesAway(fromHouse, toHouse),
        });
        continue;
      }

      for (const targetPlanet of planetsInTargetHouse) {
        if (targetPlanet === fromPlanet.planet && fromHouse === toHouse) continue;

        allAspects.push({
          fromPlanet: fromPlanet.planet,
          toHouse,
          toPlanet: targetPlanet,
          fromHouse,
          aspectType: rule.aspectType,
          housesAway: housesAway(fromHouse, toHouse),
        });
      }
    }
  }

  const planetSummaries: VedicPlanetAspectSummary[] = planets.map((planetRow) => {
    const givenRaw = allAspects.filter((a) => a.fromPlanet === planetRow.planet);

    const given: VedicPlanetAspectGiven[] = uniqBy(
      givenRaw.map((a) => ({
        fromPlanet: a.fromPlanet,
        fromHouse: a.fromHouse,
        toHouse: a.toHouse,
        aspectType: a.aspectType,
        housesAway: a.housesAway,
      })),
      (x) => `${x.fromPlanet}|${x.fromHouse}|${x.toHouse}|${x.aspectType}`
    );

    const received: VedicPlanetAspectReceived[] = allAspects
      .filter((a) => a.toPlanet === planetRow.planet)
      .map((a) => ({
        toPlanet: planetRow.planet,
        fromPlanet: a.fromPlanet,
        fromHouse: a.fromHouse,
        toHouse: planetRow.house ?? null,
        aspectType: a.aspectType,
        housesAway: a.housesAway,
      }));

    return {
      planet: planetRow.planet,
      house: planetRow.house ?? null,
      sign: planetRow.sign ?? null,
      given,
      received: uniqBy(
        received,
        (x) =>
          `${x.toPlanet}|${x.fromPlanet}|${x.fromHouse}|${x.toHouse}|${x.aspectType}`
      ),
    };
  });

  const houses: VedicHouseAspect[] = Array.from({ length: 12 }, (_, idx) => {
    const house = idx + 1;

    const aspectedBy = allAspects
      .filter((a) => a.toHouse === house)
      .map((a) => ({
        planet: a.fromPlanet,
        fromHouse: a.fromHouse,
        aspectType: a.aspectType,
        housesAway: a.housesAway,
      }));

    return {
      house,
      aspectedBy: uniqBy(
        aspectedBy,
        (x) => `${house}|${x.planet}|${x.fromHouse}|${x.aspectType}`
      ),
    };
  });

  return {
    planets: planetSummaries,
    houses,
    allAspects: uniqBy(
      allAspects,
      (x) =>
        `${x.fromPlanet}|${x.fromHouse}|${x.toHouse}|${x.toPlanet ?? "house"}|${x.aspectType}`
    ),
  };
}

export default buildVedicAspects;