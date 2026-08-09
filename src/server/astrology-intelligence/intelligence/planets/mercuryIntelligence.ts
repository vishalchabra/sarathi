import type {
  ChartFacts,
  PlanetFact,
} from "../../contracts/facts";

import type {
  PlanetIntelligence,
} from "../../contracts/planetIntelligence";

import {
  MercuryKnowledge,
} from "../../knowledge/mercury";

import {
  buildPlanetIntelligence,
} from "../buildPlanetIntelligence";

function getMercuryFacts(
  chartFacts: ChartFacts
): PlanetFact {
  const mercury =
    chartFacts.planets.find(
      (planet) =>
        planet.planet ===
        "Mercury"
    );

  if (!mercury) {
    throw new Error(
      "Mercury facts are missing from the canonical chart facts."
    );
  }

  return mercury;
}

export function buildMercuryIntelligence(
  chartFacts: ChartFacts
): PlanetIntelligence {
  const mercuryFacts =
    getMercuryFacts(
      chartFacts
    );

  return buildPlanetIntelligence({
    facts:
      mercuryFacts,

    knowledge:
      MercuryKnowledge,

    evidence:
      chartFacts.evidence,
  });
}
