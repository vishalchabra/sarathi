import type {
  ChartFacts,
  PlanetFact,
} from "../../contracts/facts";

import type {
  PlanetIntelligence,
} from "../../contracts/planetIntelligence";

import {
  VenusKnowledge,
} from "../../knowledge/venus";

import {
  buildPlanetIntelligence,
} from "../buildPlanetIntelligence";

function getVenusFacts(
  chartFacts: ChartFacts
): PlanetFact {
  const venus =
    chartFacts.planets.find(
      (planet) =>
        planet.planet ===
        "Venus"
    );

  if (!venus) {
    throw new Error(
      "Venus facts are missing from the canonical chart facts."
    );
  }

  return venus;
}

export function buildVenusIntelligence(
  chartFacts: ChartFacts
): PlanetIntelligence {
  const venusFacts =
    getVenusFacts(
      chartFacts
    );

  return buildPlanetIntelligence({
    facts:
      venusFacts,

    knowledge:
      VenusKnowledge,

    evidence:
      chartFacts.evidence,
  });
}
