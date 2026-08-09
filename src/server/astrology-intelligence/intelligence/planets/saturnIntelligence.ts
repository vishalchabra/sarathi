import type {
  ChartFacts,
  PlanetFact,
} from "../../contracts/facts";

import type {
  PlanetIntelligence,
} from "../../contracts/planetIntelligence";

import {
  SaturnKnowledge,
} from "../../knowledge/saturn";

import {
  buildPlanetIntelligence,
} from "../buildPlanetIntelligence";

function getSaturnFacts(
  chartFacts: ChartFacts
): PlanetFact {
  const saturn =
    chartFacts.planets.find(
      (planet) =>
        planet.planet ===
        "Saturn"
    );

  if (!saturn) {
    throw new Error(
      "Saturn facts are missing from the canonical chart facts."
    );
  }

  return saturn;
}

export function buildSaturnIntelligence(
  chartFacts: ChartFacts
): PlanetIntelligence {
  const saturnFacts =
    getSaturnFacts(
      chartFacts
    );

  return buildPlanetIntelligence({
    facts:
      saturnFacts,

    knowledge:
      SaturnKnowledge,

    evidence:
      chartFacts.evidence,
  });
}
