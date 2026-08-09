import type {
  ChartFacts,
  PlanetFact,
} from "../../contracts/facts";

import type {
  PlanetIntelligence,
} from "../../contracts/planetIntelligence";

import {
  KetuKnowledge,
} from "../../knowledge/ketu";

import {
  buildPlanetIntelligence,
} from "../buildPlanetIntelligence";

function getKetuFacts(
  chartFacts: ChartFacts
): PlanetFact {
  const value =
    chartFacts.planets.find(
      (item) =>
        item.planet ===
        "Ketu"
    );

  if (!value) {
    throw new Error(
      "Ketu facts are missing from the canonical chart facts."
    );
  }

  return value;
}

export function buildKetuIntelligence(
  chartFacts: ChartFacts
): PlanetIntelligence {
  const facts =
    getKetuFacts(
      chartFacts
    );

  return buildPlanetIntelligence({
    facts,
    knowledge:
      KetuKnowledge,
    evidence:
      chartFacts.evidence,
  });
}
