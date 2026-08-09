import type {
  AstrologyEvidence,
} from "../contracts/evidence";

import type {
  PlanetIntelligenceStore,
} from "../contracts/planetIntelligence";

import type {
  PlanetaryInfluenceGraph,
} from "../influence/types";

export type SignalStrength =
  | "very_strong"
  | "strong"
  | "moderate"
  | "weak"
  | "unclear";

export type SignalTheme = {
  key: string;
  label: string;

  score: number;
  confidence: number;

  contributors: string[];
  reasons: string[];
  evidenceIds: string[];
};

export type SignalLimitation = {
  key: string;
  label: string;

  score: number;
  confidence: number;

  contributors: string[];
  reasons: string[];
  evidenceIds: string[];
};

export type AstrologySignal = {
  key: string;
  label: string;

  score: number;
  confidence: number;
  strength: SignalStrength;

  themes: SignalTheme[];
  limitations: SignalLimitation[];

  evidence: AstrologyEvidence[];
  evidenceIds: string[];

  summary: string;
  warnings: string[];
};

export type SignalBuildContext = {
  planets:
    PlanetIntelligenceStore;

  influenceGraph:
    PlanetaryInfluenceGraph;
};

