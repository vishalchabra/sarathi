import type {
  ChartFacts,
  PlanetFact,
} from "../../contracts/facts";

import type {
  PlanetIntelligence,
} from "../../contracts/planetIntelligence";

import {
  MoonKnowledge,
} from "../../knowledge/moon";

import {
  buildPlanetIntelligence,
} from "../buildPlanetIntelligence";

function getMoonFacts(
  chartFacts: ChartFacts
): PlanetFact {
  const value =
    chartFacts.planets.find(
      (item) =>
        item.planet ===
        "Moon"
    );

  if (!value) {
    throw new Error(
      "Moon facts are missing from the canonical chart facts."
    );
  }

  return value;
}

export function buildMoonIntelligence(
  chartFacts: ChartFacts
): PlanetIntelligence {
  const facts =
    getMoonFacts(
      chartFacts
    );

  return buildPlanetIntelligence({
    facts,
    knowledge:
      MoonKnowledge,
    evidence:
      chartFacts.evidence,
  });
}
