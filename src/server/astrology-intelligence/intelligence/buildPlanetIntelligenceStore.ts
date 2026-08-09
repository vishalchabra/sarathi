import type {
  ChartFacts,
} from "../contracts/facts";

import type {
  PlanetIntelligenceStore,
} from "../contracts/planetIntelligence";

import {
  buildPlanetIntelligenceStore as createPlanetIntelligenceStore,
} from "../contracts/planetIntelligence";

import {
  buildMercuryIntelligence,
} from "./planets/mercuryIntelligence";

import {
  buildJupiterIntelligence,
} from "./planets/jupiterIntelligence";

import {
  buildVenusIntelligence,
} from "./planets/venusIntelligence";

import {
  buildMarsIntelligence,
} from "./planets/marsIntelligence";

import {
  buildSaturnIntelligence,
} from "./planets/saturnIntelligence";

import {
  buildRahuIntelligence,
} from "./planets/rahuIntelligence";
import {
  buildSunIntelligence,
} from "./planets/sunIntelligence";

import {
  buildMoonIntelligence,
} from "./planets/moonIntelligence";

import {
  buildKetuIntelligence,
} from "./planets/ketuIntelligence";
export function buildPlanetIntelligenceStore(
  chartFacts: ChartFacts
): PlanetIntelligenceStore {
  const mercury =
    buildMercuryIntelligence(
      chartFacts
    );

  const jupiter =
    buildJupiterIntelligence(
      chartFacts
    );
   const venus =
  buildVenusIntelligence(
    chartFacts
  );
  const mars =
  buildMarsIntelligence(
    chartFacts
  );
  const saturn =
  buildSaturnIntelligence(
    chartFacts
  );
  const rahu =
  buildRahuIntelligence(
    chartFacts
  );
  const sun =
  buildSunIntelligence(
    chartFacts
  );

const moon =
  buildMoonIntelligence(
    chartFacts
  );

const ketu =
  buildKetuIntelligence(
    chartFacts
  );
  return createPlanetIntelligenceStore([
  sun,
  moon,
  mars,
  mercury,
  jupiter,
  venus,
  saturn,
  rahu,
  ketu,
]);
}