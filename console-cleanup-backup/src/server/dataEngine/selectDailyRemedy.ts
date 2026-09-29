
import type { LifeArea } from "../astrology-engine/types";
import {
  DAILY_REMEDY_LIBRARY,
  type DailyRemedy,
} from "./dailyRemedyLibrary";
import { DAILY_REMEDY_AREA_MAP } from "./dailyRemedyAreaMap";

type Prediction = {
  primaryTheme?: {
    area: LifeArea;
    manifestationId?: string | null;
  } | null;
  explanation?: {
    activatedHouses?: number[];
    manifestation?: {
      matchedPrimaryHouses?: number[];
      primaryDiscriminatorPlanetMatches?: string[];
      transitDiscriminatorPlanetMatches?: string[];
    } | null;
  } | null;
};

type NatalPlanet = {
  planet: string;
  house?: number | null;
  sign?: string | null;
};

type FunctionalRoles = {
  functionalBenefics?: string[];
  functionalMalefics?: string[];
};
function ordinalSuffix(value?: number | null): string {
  if (value == null) return "";

  if (value % 100 >= 11 && value % 100 <= 13) return "th";

  switch (value % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}
export type SelectedDailyRemedy = {
  remedy: DailyRemedy;
  reason: string;
};

export function selectDailyRemedy(params: {
  prediction: Prediction;
  natalPlanets: NatalPlanet[];
  roles: FunctionalRoles;
}): SelectedDailyRemedy | null {
  const { prediction, natalPlanets, roles } = params;
  const primary = prediction.primaryTheme;
  const explanation = prediction.explanation;
  const manifestation = explanation?.manifestation;

  if (!primary?.manifestationId || !manifestation) {
    return null;
  }

  const primaryPlanets =
    manifestation.primaryDiscriminatorPlanetMatches ?? [];
  const transitPlanets =
    manifestation.transitDiscriminatorPlanetMatches ?? [];
  const eventHouses =
    manifestation.matchedPrimaryHouses ?? [];

  const supportedPlanets = primaryPlanets.filter(
    (planet) => transitPlanets.includes(planet)
  );

  const eligiblePlanets = supportedPlanets.filter((planet) => {
    const natal = natalPlanets.find(
      (item) => item.planet === planet
    );

    return (
      natal &&
      typeof natal.house === "number" &&
      natal.house >= 1 &&
      natal.house <= 12 &&
      roles.functionalBenefics?.includes(planet) &&
      !roles.functionalMalefics?.includes(planet)
    );
  });
console.log("[daily-remedy] planet eligibility", {
  area: primary.area,
  eventHouses,
  primaryPlanets,
  transitPlanets,
  supportedPlanets,
  eligiblePlanets,
});
  if (eligiblePlanets.length !== 1) {
    return null;
  }

  const planet = eligiblePlanets[0];
  const natalPlanet = natalPlanets.find(
  (item) => item.planet === planet
);

const matchingHouses = eventHouses.filter((house) =>
  DAILY_REMEDY_LIBRARY.some(
    (item) =>
      item.planet === planet &&
      item.relevantHouses.includes(house)
  )
);
  const compatibleAreas =
    DAILY_REMEDY_AREA_MAP[primary.area] ?? [];

  const candidates = DAILY_REMEDY_LIBRARY.filter(
    (remedy) =>
      remedy.planet === planet &&
      remedy.lifeAreas.some((area) =>
        compatibleAreas.includes(area)
      ) &&
      remedy.relevantHouses.some((house) =>
        eventHouses.includes(house)
      )
  );
console.log("[daily-remedy] selection", {
  area: primary.area,
  manifestationId: primary.manifestationId,
  eventHouses,
  primaryPlanets,
  transitPlanets,
  supportedPlanets,
  eligiblePlanets,
  functionalBenefics: roles.functionalBenefics,
  functionalMalefics: roles.functionalMalefics,
  candidateRemedies: candidates.map((item) => item.id),
});
  // Do not arbitrarily choose between equally eligible remedies.
  if (candidates.length !== 1) {
    return null;
  }

  const remedy = candidates[0];

 
return {
  remedy,
  reason: [
  `${planet} has both primary-event evidence and transit confirmation. ` +
  `In your birth chart, ${planet} is placed in ` +
  `${natalPlanet?.sign ?? "its recorded sign"} ` +
  `in the ${natalPlanet?.house}${ordinalSuffix(natalPlanet?.house)} house. ` +
  `The selected event activates ` +
  `${matchingHouses.map(
    (house) => `${house}${ordinalSuffix(house)}`
  ).join(" and ")} house${matchingHouses.length === 1 ? "" : "s"}. ` +
  `This optional practice reflects traditional ${planet} associations.`,
  ].join(" "),
};
}