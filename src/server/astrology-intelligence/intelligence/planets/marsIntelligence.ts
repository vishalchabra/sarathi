import type {
  ChartFacts,
  PlanetFact,
} from "../../contracts/facts";

import type {
  PlanetIntelligence,
} from "../../contracts/planetIntelligence";

import {
  MarsKnowledge,
} from "../../knowledge/mars";

import {
  buildPlanetIntelligence,
} from "../buildPlanetIntelligence";

function getMarsFacts(
  chartFacts: ChartFacts
): PlanetFact {
  const mars =
    chartFacts.planets.find(
      (planet) =>
        planet.planet ===
        "Mars"
    );

  if (!mars) {
    throw new Error(
      "Mars facts are missing from the canonical chart facts."
    );
  }

  return mars;
}

export function buildMarsIntelligence(
  chartFacts: ChartFacts
): PlanetIntelligence {
  const marsFacts =
    getMarsFacts(
      chartFacts
    );

  return buildPlanetIntelligence({
    facts:
      marsFacts,

    knowledge:
      MarsKnowledge,

    evidence:
      chartFacts.evidence,
  });
}
