import type {
  CandidateEventTheme,
} from "./eventActivationEngine";

export type EventConvergencePathway =
  | "exact_planetary"
  | "functional_lordship"
  | "sambandha"
  | "house_convergence";

export type EventConvergenceResult = {
  eventId: CandidateEventTheme["id"];

  exactPlanetary: {
    supported: boolean;
    planets: string[];
  };

  functionalLordship: {
    supported: boolean;
    matches: {
      planet: string;
      house: number;
    }[];
  };

  sambandha: {
    supported: boolean;
    connections: {
      connectionId: string;
      activePlanet: string;
      transitPlanet: string;
    }[];
  };

  houseConvergence: {
    supported: boolean;
    existingHouses: number[];
    transitPrimaryHouses: number[];
    combinedHouses: number[];
    sharedPrimaryHouses: number[];
    additionalPrimaryHouses: number[];
    independentTransitPlanets: string[];
  };

  moonConfirmation: {
    supported: boolean;
    directDashaConnection: boolean;
  };

  supportedPathways: EventConvergencePathway[];
};

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function uniqueHouses(values: readonly number[]): number[] {
  return unique(values).sort((a, b) => a - b);
}

export function resolveEventConvergence(
  candidate: CandidateEventTheme
): EventConvergenceResult {
  const primaryHouses = uniqueHouses(
    candidate.matchedPrimaryHouses
  );

  const supportingHouses = uniqueHouses(
    candidate.matchedSupportingHouses
  );

  const existingHouses = uniqueHouses([
    ...primaryHouses,
    ...supportingHouses,
  ]);

  // Exclude Moon-derived evidence from the independent
  // transit layer to avoid reusing the daily trigger.
  const independentTransits =
    candidate.matchedEventHouseTransits.filter(
      (transit) =>
        transit.planet !== "Moon" &&
        !transit.source.startsWith("moon_")
    );

  const primaryTransits = independentTransits.filter(
    (transit) => transit.houseRole === "primary"
  );

  const transitPrimaryHouses = uniqueHouses(
    primaryTransits.map((transit) => transit.house)
  );

  const independentTransitPlanets = unique(
    primaryTransits.map((transit) => transit.planet)
  );

  const combinedHouses = uniqueHouses([
    ...existingHouses,
    ...transitPrimaryHouses,
  ]);

  const sharedPrimaryHouses = transitPrimaryHouses.filter(
    (house) => primaryHouses.includes(house)
  );

  const additionalPrimaryHouses = transitPrimaryHouses.filter(
    (house) => !existingHouses.includes(house)
  );

  // Pathway 1: existing exact planetary convergence.
  const natalDiscriminators = unique(
    candidate.matchedDiscriminatorEvidence.map(
      (evidence) => evidence.planet
    )
  );

  const transitDiscriminators = unique(
    candidate.matchedTransitDiscriminatorEvidence.map(
      (evidence) => evidence.planet
    )
  );

  const exactPlanets = natalDiscriminators.filter(
    (planet) => transitDiscriminators.includes(planet)
  );

  // Pathway 2: direct functional lordship.
  // Indirect dispositors and aspects are deliberately
  // excluded from this initial pathway.
  const functionalMatches = new Map<
    string,
    { planet: string; house: number }
  >();

  for (
    const evidence of
    candidate.eventFunctionalHouseEvidence ?? []
  ) {
    if (
      evidence.source !== "lordship" ||
      evidence.houseRole !== "primary"
    ) {
      continue;
    }

    const transitMatch = primaryTransits.some(
      (transit) =>
        transit.planet === evidence.planet &&
        transit.house === evidence.house
    );

    if (!transitMatch) {
      continue;
    }

    functionalMatches.set(
      `${evidence.planet}:${evidence.house}`,
      {
        planet: evidence.planet,
        house: evidence.house,
      }
    );
  }

  // Pathway 3: event-specific natal Sambandha.
  // Require different planetary identities on the
  // active and transit sides of the relationship.
  const sambandhaMatches = new Map<
    string,
    {
      connectionId: string;
      activePlanet: string;
      transitPlanet: string;
    }
  >();

  for (
    const connection of
    candidate.eventSambandhaEvidence ?? []
  ) {
    if (
      !connection.connectsDistinctPrimaryHouses &&
      !connection.connectsPrimaryToSupporting
    ) {
      continue;
    }

    for (const activePlanet of connection.activePlanets) {
      for (const transitPlanet of connection.planets) {
        if (activePlanet === transitPlanet) {
          continue;
        }

        const activeIndex = connection.planets.indexOf(activePlanet);
        const transitIndex = connection.planets.indexOf(transitPlanet);

        if (
          activeIndex < 0 ||
          transitIndex < 0 ||
          connection.relationshipTypes.length === 0
        ) {
          continue;
        }

        const activePlanetHouses =
          activeIndex === 0
            ? connection.firstPlanetHouses
            : connection.secondPlanetHouses;

        const transitPlanetHouses =
          transitIndex === 0
            ? connection.firstPlanetHouses
            : connection.secondPlanetHouses;

        const transitMatch = primaryTransits.some(
          (transit) =>
            transit.planet === transitPlanet &&
            transitPlanetHouses.includes(transit.house) &&
            activePlanetHouses.some(
              (house) => house !== transit.house
            )
        );

        if (!transitMatch) {
          continue;
        }

        const connectionId = String(
          connection.connectionId
        );

        const key =
          `${connectionId}:${activePlanet}:${transitPlanet}`;

        sambandhaMatches.set(key, {
          connectionId,
          activePlanet,
          transitPlanet,
        });
      }
    }
  }

  // Pathway 4: complementary primary house coverage.
  const houseSupported =
    primaryHouses.length > 0 &&
    sharedPrimaryHouses.length > 0 &&
    additionalPrimaryHouses.length > 0 &&
    combinedHouses.length >= 2 &&
    independentTransitPlanets.length >= 2;

  const eventSpecificMoonEvidence =
    (candidate.moonEvidence ?? []).filter(
      (evidence) =>
        evidence.matchesEventDiscriminator &&
        evidence.matchedPrimaryHouses.length > 0
    );

  const directDashaMoonConnection =
    eventSpecificMoonEvidence.some(
      (evidence) => evidence.connectsDashaDirectly
    );

  const supportedPathways: EventConvergencePathway[] = [];

  if (exactPlanets.length > 0) {
    supportedPathways.push("exact_planetary");
  }

  if (functionalMatches.size > 0) {
    supportedPathways.push("functional_lordship");
  }

  if (sambandhaMatches.size > 0) {
    supportedPathways.push("sambandha");
  }

  if (houseSupported) {
    supportedPathways.push("house_convergence");
  }

  return {
    eventId: candidate.id,

    exactPlanetary: {
      supported: exactPlanets.length > 0,
      planets: exactPlanets,
    },

    functionalLordship: {
      supported: functionalMatches.size > 0,
      matches: [...functionalMatches.values()],
    },

    sambandha: {
      supported: sambandhaMatches.size > 0,
      connections: [...sambandhaMatches.values()],
    },

    houseConvergence: {
      supported: houseSupported,
      existingHouses,
      transitPrimaryHouses,
      combinedHouses,
      sharedPrimaryHouses,
      additionalPrimaryHouses,
      independentTransitPlanets,
    },

    moonConfirmation: {
      supported:
        candidate.hasMoonSambandhaConfirmation === true,
      directDashaConnection: directDashaMoonConnection,
    },

    supportedPathways,
  };
}
