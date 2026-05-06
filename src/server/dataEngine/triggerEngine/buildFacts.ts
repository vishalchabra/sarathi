import type { EventArea, TriggerFact } from "./types";

type Input = {
  transitPlanets: any[];
  natal: any;
  dasha: any;
  shadbala?: any[];
  afflictions?: any[];
};

const AREA_HOUSES: Record<EventArea, number[]> = {
  career: [10, 6, 2],
  money: [2, 11, 5],
  health: [1, 6, 8, 12],
  relationship: [7, 5, 11],
  property: [4, 2, 11],
  travel: [3, 9, 12],
  education: [4, 5, 9],
  spiritual: [5, 9, 12],
};

const AREA_LABELS: Record<EventArea, string> = {
  career: "career",
  money: "money/wealth",
  health: "health",
  relationship: "relationship",
  property: "property/assets",
  travel: "travel/relocation",
  education: "education/learning",
  spiritual: "spiritual/inner work",
};

function getPlanetName(p: any) {
  return p?.planet ?? p?.id ?? p?.name ?? "";
}

function getTransitHouse(planet: any) {
  return planet?.houseFromLagna ?? planet?.house ?? planet?.transitHouse ?? null;
}

function isPlanetInHouse(planet: any, house: number) {
  return Number(getTransitHouse(planet)) === Number(house);
}

function isAspecting(targetHouse: number, planet: any) {
  const fromHouse = getTransitHouse(planet);
  if (!fromHouse) return false;

  const planetName = getPlanetName(planet);
  const diff = (targetHouse - fromHouse + 12) % 12;

  if (diff === 7) return true;

  if (planetName === "Mars" && (diff === 4 || diff === 8)) return true;
  if (planetName === "Jupiter" && (diff === 5 || diff === 9)) return true;
  if (planetName === "Saturn" && (diff === 3 || diff === 10)) return true;

  return false;
}

function getDashaPlanet(value: any) {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value?.planet ?? value?.name ?? null;
}

function toneForPlanet(planetName: string): TriggerFact["tone"] {
  if (planetName === "Jupiter") return "opportunity";
  if (planetName === "Mars") return "action";
  if (planetName === "Saturn") return "pressure";
  if (planetName === "Rahu") return "disruption";
  if (planetName === "Ketu") return "risk";
  return "support";
}

function strengthForPlanet(planetName: string, kind: "house" | "aspect") {
  if (planetName === "Jupiter") return kind === "house" ? 90 : 80;
  if (planetName === "Rahu") return kind === "house" ? 80 : 75;
  if (planetName === "Mars") return 70;
  if (planetName === "Saturn") return 65;
  if (planetName === "Venus") return 65;
  if (planetName === "Mercury") return 60;
  if (planetName === "Sun") return 55;
  if (planetName === "Moon") return 55;
  return 50;
}
function getPlanetStrengthContext(
  planetName: string,
  shadbala: any[] = [],
  afflictions: any[] = []
) {
  const bala = shadbala.find((x) => x?.planet === planetName);
  const aff = afflictions.find((x) => x?.planet === planetName);

  const shadbalaStatus =
    bala?.status ??
    (Number(bala?.shadbalaRupas ?? bala?.total ?? 0) >= 6
      ? "Strong"
      : Number(bala?.shadbalaRupas ?? bala?.total ?? 0) < 5
      ? "Weak"
      : "Medium");

  const afflictionLevel = aff?.level ?? "clean";

  let note = `${planetName} is ${String(shadbalaStatus).toLowerCase()} by Shadbala.`;

  if (afflictionLevel === "afflicted") {
    note += ` It is afflicted (${(aff?.reasons ?? []).join(", ")}), so results may come with pressure, delay, conflict, or distortion.`;
  } else if (afflictionLevel === "mild") {
    note += ` It has mild affliction (${(aff?.reasons ?? []).join(", ")}), so results may need effort or adjustment.`;
  } else {
    note += ` No major affliction is flagged in the current rules.`;
  }

  return {
    shadbalaStatus,
    afflictionLevel,
    reasons: aff?.reasons ?? [],
    note,
  };
}
export function buildTriggerFacts(input: Input): TriggerFact[] {
  const { transitPlanets, dasha, shadbala = [], afflictions = [] } = input;

  const facts: TriggerFact[] = [];

  const currentDasha = dasha?.current ?? dasha ?? {};

  const md = getDashaPlanet(
    currentDasha?.md ?? currentDasha?.mahadasha ?? dasha?.mahadasha
  );

  const ad = getDashaPlanet(
    currentDasha?.ad ?? currentDasha?.antardasha ?? dasha?.antardasha
  );
 const activeDashaPlanets = [md, ad].filter(Boolean);
 const dashaRelatedPlanets = new Set<string>(activeDashaPlanets);

for (const p of transitPlanets ?? []) {
  const planetName = getPlanetName(p);
  if (!planetName) continue;

  // include planets in same sign as dasha planets
  const dashaPlanetObjects = transitPlanets.filter(tp =>
    activeDashaPlanets.includes(getPlanetName(tp))
  );

  const isSameSign = dashaPlanetObjects.some(
    dp => dp.sign === p.sign
  );

  const isSameHouse = dashaPlanetObjects.some(
    dp => dp.houseFromLagna === p.houseFromLagna
  );

  if (isSameSign || isSameHouse) {
    dashaRelatedPlanets.add(planetName);
  }
}
  const areas = Object.keys(AREA_HOUSES) as EventArea[];

  if (md) {
  facts.push({
    id: `dasha-md`,
    area: "career",
    kind: "dasha",
    planet: md,
    strength: 70,
    strengthContext: getPlanetStrengthContext(md, shadbala, afflictions),
    tone: md === "Rahu" ? "disruption" : "support",
    title: `${md} Mahadasha active`,
    explanation: `${md} Mahadasha is active. Review its natal placement, lordships, dignity and house ownership.`,
  });
}

if (ad) {
  facts.push({
    id: `dasha-ad`,
    area: "career",
    kind: "dasha",
    planet: ad,
    strength: 65,
    strengthContext: getPlanetStrengthContext(ad, shadbala, afflictions),
    tone: "support",
    title: `${ad} Antardasha active`,
    explanation: `${ad} Antardasha is active. Review its house connections and transits.`,
  });
}

  for (const area of areas) {
    const houses = AREA_HOUSES[area];

    for (const p of transitPlanets ?? []) {
      const planetName = getPlanetName(p);
      if (!planetName) continue;
    const majorTransitPlanets = ["Jupiter", "Saturn", "Mars", "Rahu", "Ketu"];

const isDashaRelated =
  dashaRelatedPlanets.has(planetName) || majorTransitPlanets.includes(planetName);
      for (const house of houses) {
        if (isPlanetInHouse(p, house) && isDashaRelated) {
          facts.push({
            id: `${area}-transit-${planetName}-h${house}`,
            area,
            kind: "transit_house",
            planet: planetName,
            house,
            strength: strengthForPlanet(planetName, "house"),
            strengthContext: getPlanetStrengthContext(planetName, shadbala, afflictions),
            priority: dashaRelatedPlanets.has(planetName) ? "primary" : "secondary",
            tone: toneForPlanet(planetName),
            title: `${planetName} in house ${house}`,
            explanation: `${planetName} is transiting house ${house}.`,
          });
        }
      }
    }
  }

  const importantAspectPlanets = ["Mars", "Saturn", "Jupiter"];

  for (const area of areas) {
    const houses = AREA_HOUSES[area];

    for (const p of transitPlanets ?? []) {
      const planetName = getPlanetName(p);
      if (!planetName) continue;
      if (!importantAspectPlanets.includes(planetName)) continue;
     const isDashaRelated = dashaRelatedPlanets.has(planetName);
      for (const house of houses) {
        if (isAspecting(house, p) && isDashaRelated) {
          facts.push({
            id: `${area}-aspect-${planetName}-h${house}`,
            area,
            kind: "transit_aspect",
            planet: planetName,
            target: `house ${house}`,
            strength: strengthForPlanet(planetName, "aspect"),
            strengthContext: getPlanetStrengthContext(planetName, shadbala, afflictions),
            tone: toneForPlanet(planetName),
            title: `${planetName} aspecting house ${house}`,
            explanation: `${planetName} is aspecting house ${house}. Review this connection for ${AREA_LABELS[area]} matters.`,
          });
        }
      }
    }
  }

  return facts;
}