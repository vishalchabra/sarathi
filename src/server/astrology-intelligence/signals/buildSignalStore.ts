import type {
  PlanetIntelligenceStore,
} from "../contracts/planetIntelligence";

import type {
  PlanetaryInfluenceGraph,
} from "../influence/types";

import type {
  CapabilityStore,
} from "../capabilities/types";

import {
  buildKnowledgeSignal,
} from "./buildKnowledgeSignal";

import {
  buildBusinessSignal,
} from "./buildBusinessSignal";

import {
  buildBusinessArchetypeStore,
} from "../archetypes/buildBusinessArchetypeStore";

import type {
  AstrologySignal,
} from "./contracts";

import type {
  BusinessSignal,
} from "./businessSignalTypes";

import type {
  BusinessArchetypeStore,
} from "../archetypes/types";

export type SignalStore = {
  influenceGraph:
    PlanetaryInfluenceGraph;

  capabilities:
    CapabilityStore;

  knowledge:
    AstrologySignal;

  business:
    BusinessSignal;

  businessArchetypes:
    BusinessArchetypeStore;
};

export function buildSignalStore(params: {
  planets:
    PlanetIntelligenceStore;

  influenceGraph:
    PlanetaryInfluenceGraph;

  capabilities:
    CapabilityStore;
}): SignalStore {
  const {
    planets,
    influenceGraph,
    capabilities,
  } = params;

  const business =
    buildBusinessSignal({
      planets,
      influenceGraph,
      capabilities,
    });

  const businessArchetypes =
    buildBusinessArchetypeStore({
      business,
      influenceGraph,
    });

  return {
    influenceGraph,
    capabilities,

    knowledge:
      buildKnowledgeSignal({
        planets,
        influenceGraph,
      }),

    business,

    businessArchetypes,
  };
}