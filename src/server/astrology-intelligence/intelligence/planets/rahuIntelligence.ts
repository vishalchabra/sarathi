import type {
  ChartFacts,
  PlanetFact,
} from "../../contracts/facts";

import type {
  PlanetIntelligence,
} from "../../contracts/planetIntelligence";

import {
  RahuKnowledge,
} from "../../knowledge/rahu";

import {
  buildPlanetIntelligence,
} from "../buildPlanetIntelligence";

function getRahuFacts(
  chartFacts: ChartFacts
): PlanetFact {
  const rahu =
    chartFacts.planets.find(
      (planet) =>
        planet.planet ===
        "Rahu"
    );

  if (!rahu) {
    throw new Error(
      "Rahu facts are missing from the canonical chart facts."
    );
  }

  return rahu;
}

export function buildRahuIntelligence(
  chartFacts: ChartFacts
): PlanetIntelligence {
  const rahuFacts =
    getRahuFacts(
      chartFacts
    );

  return buildPlanetIntelligence({
    facts:
      rahuFacts,

    knowledge:
      RahuKnowledge,

    evidence:
      chartFacts.evidence,
  });
}
