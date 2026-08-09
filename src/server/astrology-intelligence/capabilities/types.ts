import type {
  PlanetName,
} from "../contracts/facts";

export type CapabilityStrength =
  | "very_strong"
  | "strong"
  | "moderate"
  | "weak"
  | "unclear";

export type CapabilityCategory =
  | "cognitive"
  | "leadership"
  | "execution"
  | "commercial"
  | "creative"
  | "human"
  | "spiritual";

export type CapabilityActivation = {
  currentlyActive: boolean;

  score: number;
  confidence: number;

  activePlanets: PlanetName[];
  activeThemes: string[];
  evidenceIds: string[];
};

export type CapabilityLimitation = {
  key: string;
  label: string;

  score: number;
  confidence: number;

  contributors: PlanetName[];
  reasons: string[];
  evidenceIds: string[];
};

export type Capability = {
  key: string;
  label: string;
  description: string;

  category: CapabilityCategory;

  score: number;
  confidence: number;
  strength: CapabilityStrength;

  contributors: PlanetName[];
  supportingThemes: string[];
  supportingInfluenceEdgeIds: string[];

  reasons: string[];
  evidenceIds: string[];

  limitations: CapabilityLimitation[];

  activation: CapabilityActivation;

  summary: string;
};

export type CapabilityStore = {
  capabilities: Capability[];

  byKey: Record<
    string,
    Capability | undefined
  >;

  strongest: Capability[];

  warnings: string[];
};