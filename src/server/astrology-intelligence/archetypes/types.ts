import type {
  BusinessDimensionKey,
} from "../signals/businessSignalTypes";

import type {
  PlanetName,
} from "../contracts/facts";

export type BusinessArchetypeStrength =
  | "dominant"
  | "strong"
  | "supporting"
  | "weak";

export type BusinessArchetype = {
  key: string;
  label: string;
  description: string;
  score: number;
  confidence: number;
  strength: BusinessArchetypeStrength;
  primaryPlanets: PlanetName[];
  supportingPlanets: PlanetName[];
  requiredDimensions: BusinessDimensionKey[];
  supportingDimensions: BusinessDimensionKey[];
  matchedThemes: string[];
  matchedInfluenceEdgeIds: string[];
  reasons: string[];
  evidenceIds: string[];
};

export type BusinessArchetypeStore = {
  archetypes: BusinessArchetype[];
  primary: BusinessArchetype | null;
  secondary: BusinessArchetype[];
  warnings: string[];
};
