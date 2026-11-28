import {
  DAILY_REMEDY_LIBRARY,
  type DailyRemedy,
  type RemedyPlanet,
} from "../dataEngine/dailyRemedyLibrary";

export type PhaseRemedyInput = {
  periods: {
    mahadasha?: string | null;
    antardasha?: string | null;
    pratyantardasha?: string | null;
  };

  natalPlanets: {
    planet: string;
    house?: number | null;
    sign?: string | null;
  }[];

  roles: {
    functionalBenefics?: string[];
    functionalMalefics?: string[];
  };

  activations: {
    planet: string;
    lifeAreas: string[];
    houses: number[];
  }[];
};

export type SelectedPhaseRemedy = {
  remedy: DailyRemedy;
  planet: RemedyPlanet;
  periodLevels: string[];
  natalHouse: number;
  natalSign: string | null;
  matchedHouses: number[];
  matchedLifeAreas: string[];
  reason: string;
  category: "traditional-service";
};

function normalize(value: unknown): string {
  return typeof value === "string"
    ? value.trim().toLowerCase()
    : "";
}

function validHouse(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 12
  );
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

export function selectPhaseRemedies(
  input: PhaseRemedyInput
): SelectedPhaseRemedy[] {
  const periods = [
    {
      level: "Antardasha",
      planet: normalize(input.periods.antardasha),
    },
    {
      level: "Mahadasha",
      planet: normalize(input.periods.mahadasha),
    },
    {
      level: "Pratyantardasha",
      planet: normalize(input.periods.pratyantardasha),
    },
  ].filter((item) => item.planet);

  const benefics = (
    input.roles.functionalBenefics ?? []
  ).map(normalize);

  const malefics = (
    input.roles.functionalMalefics ?? []
  ).map(normalize);

  const activePlanets = unique(
    periods.map((item) => item.planet)
  );

  const selected: SelectedPhaseRemedy[] = [];

  for (const planet of activePlanets) {
    if (
      !benefics.includes(planet) ||
      malefics.includes(planet)
    ) {
      continue;
    }

    const natal = input.natalPlanets.find(
      (item) => normalize(item.planet) === planet
    );

    if (!natal || !validHouse(natal.house)) {
      continue;
    }

    const evidence = input.activations.filter(
      (item) => normalize(item.planet) === planet
    );

    if (!evidence.length) continue;

    const candidates = DAILY_REMEDY_LIBRARY
      .filter((remedy) => {
        if (normalize(remedy.planet) !== planet) {
          return false;
        }

        // Exclude practices that may be interpreted
        // as direct planetary strengthening.
        if (remedy.id === "sun-morning-water") {
          return false;
        }

        return true;
      })
      .map((remedy) => {
        const matchingEvidence = evidence.filter(
          (activation) =>
            activation.houses.some(
              (house) =>
                validHouse(house) &&
                remedy.relevantHouses.includes(house)
            ) &&
            activation.lifeAreas.some(
              (area) =>
                remedy.lifeAreas
                  .map(normalize)
                  .includes(normalize(area))
            )
        );

        const matchedHouses = unique(
          matchingEvidence.flatMap(
            (activation) =>
              activation.houses.filter(
                (house) =>
                  validHouse(house) &&
                  remedy.relevantHouses.includes(house)
              )
          )
        );

        const matchedLifeAreas = unique(
          matchingEvidence.flatMap(
            (activation) =>
              activation.lifeAreas
                .map(normalize)
                .filter((area) =>
                  remedy.lifeAreas
                    .map(normalize)
                    .includes(area)
                )
          )
        );

        return {
          remedy,
          matchedHouses,
          matchedLifeAreas,
        };
      })
      .filter(
        (item) =>
          item.matchedHouses.length > 0 &&
          item.matchedLifeAreas.length > 0
      );

    // Rank eligible remedies using their existing
    // planet-specific activation evidence.
    const ranked = candidates
      .map((item) => {
        const natalHouseMatch =
          item.matchedHouses.includes(natal.house as number);

        const selectionScore =
          (natalHouseMatch ? 4 : 0) +
          item.matchedHouses.length * 2 +
          item.matchedLifeAreas.length;

        return {
          ...item,
          selectionScore,
        };
      })
      .sort(
        (a, b) => b.selectionScore - a.selectionScore
      );

    if (!ranked.length) {
      continue;
    }

    // Preserve ambiguity protection when the
    // strongest candidates have equal evidence.
    if (
      ranked.length > 1 &&
      ranked[0].selectionScore ===
        ranked[1].selectionScore
    ) {
      continue;
    }

    const candidate = ranked[0];

    const periodLevels = periods
      .filter((item) => item.planet === planet)
      .map((item) => item.level);

    const natalSign =
      typeof natal.sign === "string" &&
      natal.sign.trim()
        ? natal.sign.trim()
        : null;

    const reason = [
      `${candidate.remedy.planet} is active in your ` +
        `${periodLevels.join(" and ")}.`,
      `${candidate.remedy.planet} is classified as a ` +
        `functional benefic by the chart engine.`,
      `Its natal placement is in house ${natal.house}` +
        `${natalSign ? ` in ${natalSign}` : ""}.`,
      `The supplied activation evidence connects this ` +
        `planet with house(s) ` +
        `${candidate.matchedHouses.join(", ")} and ` +
        `${candidate.matchedLifeAreas.join(", ")}.`,
      candidate.remedy.traditionalRationale,
      "This is an optional traditional service practice, " +
        "not a prescription to strengthen a planet " +
        "or a guarantee of any outcome.",
    ].join(" ");

    selected.push({
      remedy: candidate.remedy,
      planet: candidate.remedy.planet,
      periodLevels,
      natalHouse: natal.house,
      natalSign,
      matchedHouses: candidate.matchedHouses,
      matchedLifeAreas: candidate.matchedLifeAreas,
      reason,
      category: "traditional-service",
    });
  }

  return selected.slice(0, 3);
}