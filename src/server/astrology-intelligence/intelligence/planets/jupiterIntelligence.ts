import type {
  ChartFacts,
  PlanetFact,
} from "../../contracts/facts";

import type {
  PlanetIntelligence,
} from "../../contracts/planetIntelligence";

import {
  JupiterKnowledge,
} from "../../knowledge/jupiter";

import {
  buildPlanetIntelligence,
} from "../buildPlanetIntelligence";

function getJupiterFacts(
  chartFacts: ChartFacts
): PlanetFact {
  const jupiter =
    chartFacts.planets.find(
      (planet) =>
        planet.planet ===
        "Jupiter"
    );

  if (!jupiter) {
    throw new Error(
      "Jupiter facts are missing from the canonical chart facts."
    );
  }

  return jupiter;
}

export function buildJupiterIntelligence(
  chartFacts: ChartFacts
): PlanetIntelligence {
  const jupiterFacts =
    getJupiterFacts(
      chartFacts
    );

  return buildPlanetIntelligence({
    facts:
      jupiterFacts,

    knowledge:
      JupiterKnowledge,

    evidence:
      chartFacts.evidence,
  });
}
