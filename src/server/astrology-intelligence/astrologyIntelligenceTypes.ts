import type { ChartFacts } from "./contracts/facts";
import type { PlanetIntelligenceStore } from "./contracts/planetIntelligence";
import type { PlanetaryInfluenceGraph } from "./influence/types";
import type { SignalStore } from "./signals/buildSignalStore";
import type {
  CapabilityStore,
} from "./capabilities/types";
import type {
  CapabilityOntologyStore,
} from "./capability-ontology/types";
import type {
  CapabilityMatcherStore,
} from "./capability-matcher/types";
import type {
  ReasoningFactStore,
} from "./reasoning-facts/types";
import type {
  ReasoningLinkStore,
} from "./reasoning-links/types";
export type AstrologyIntelligenceEngineResult = {
  chartFacts: ChartFacts;
  planets: PlanetIntelligenceStore;
  influenceGraph: PlanetaryInfluenceGraph;
  signals: SignalStore;
  warnings: string[];
  capabilities:
  CapabilityStore;
  capabilityOntology:
  CapabilityOntologyStore;
  capabilityMatcher:
  CapabilityMatcherStore;
  reasoningFacts:
  ReasoningFactStore;
  reasoningLinks:
  ReasoningLinkStore;
};