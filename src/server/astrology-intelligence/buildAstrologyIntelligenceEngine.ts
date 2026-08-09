import type {
  ChartFacts,
} from "./contracts/facts";

import {
  buildPlanetIntelligenceStore,
} from "./intelligence/buildPlanetIntelligenceStore";

import {
  buildPlanetaryInfluenceGraph,
} from "./influence/buildPlanetaryInfluenceGraph";

import {
  buildCapabilityStore,
} from "./capabilities/buildCapabilityStore";

import {
  buildSignalStore,
} from "./signals/buildSignalStore";

import type {
  AstrologyIntelligenceEngineResult,
} from "./astrologyIntelligenceTypes";

import {
  buildCapabilityOntologyStore,
} from "./capability-ontology/buildCapabilityOntologyStore";

import {
  buildCapabilityMatcherStore,
} from "./capability-matcher/buildCapabilityMatcherStore";
import {
  buildReasoningFactStore,
} from "./reasoning-facts/buildReasoningFactStore";
import {
  buildReasoningLinkStore,
} from "./reasoning-links/buildReasoningLinkStore";
function uniqueStrings(
  values: Array<string | null | undefined>
): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => String(value ?? "").trim())
        .filter(Boolean)
    )
  );
}

export function buildAstrologyIntelligenceEngine(
  chartFacts: ChartFacts
): AstrologyIntelligenceEngineResult {
    const reasoningFacts =
  buildReasoningFactStore(
    chartFacts
  );
  const planets =
    buildPlanetIntelligenceStore(
      chartFacts
    );

  const influenceGraph =
    buildPlanetaryInfluenceGraph(
      planets
    );
  const capabilityOntology =
  buildCapabilityOntologyStore();
  const capabilities =
    buildCapabilityStore({
      planets,
      influenceGraph,
    });

    const capabilityMatcher =
  buildCapabilityMatcherStore();
const reasoningLinks =
  buildReasoningLinkStore({
    facts:
      reasoningFacts,

    capabilities,

    ontology:
      capabilityOntology,

    matcher:
      capabilityMatcher,
  });
  const signals =
    buildSignalStore({
      planets,
      influenceGraph,
      capabilities,
    });

  const warnings =
    uniqueStrings([
      ...chartFacts.warnings,
      ...planets.warnings,
      ...influenceGraph.warnings,
      ...capabilities.warnings,
      ...signals.knowledge.warnings,
      ...signals.business.warnings,
      ...signals.businessArchetypes.warnings,
      ...capabilityOntology.warnings,
      ...capabilityMatcher.warnings,
      ...reasoningFacts.warnings,
      ...reasoningLinks.warnings,
    ]);

 return {
  chartFacts,
  reasoningFacts,
  planets,
  influenceGraph,
  capabilityOntology,
  capabilities,
  capabilityMatcher,
  reasoningLinks,
  signals,
  warnings,
};
}