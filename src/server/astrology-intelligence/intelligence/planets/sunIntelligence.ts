import type {
  ChartFacts,
  PlanetFact,
} from "../../contracts/facts";

import type {
  PlanetIntelligence,
} from "../../contracts/planetIntelligence";

import {
  SunKnowledge,
} from "../../knowledge/sun";

import {
  buildPlanetIntelligence,
} from "../buildPlanetIntelligence";

function getSunFacts(
  chartFacts: ChartFacts
): PlanetFact {
  const value =
    chartFacts.planets.find(
      (item) =>
        item.planet ===
        "Sun"
    );

  if (!value) {
    throw new Error(
      "Sun facts are missing from the canonical chart facts."
    );
  }

  return value;
}

export function buildSunIntelligence(
  chartFacts: ChartFacts
): PlanetIntelligence {
  const facts =
    getSunFacts(
      chartFacts
    );

  return buildPlanetIntelligence({
    facts,
    knowledge:
      SunKnowledge,
    evidence:
      chartFacts.evidence,
  });
}
