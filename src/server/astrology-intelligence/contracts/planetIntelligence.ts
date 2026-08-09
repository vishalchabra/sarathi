import type {
  AstrologyEvidence,
} from "./evidence";

import type {
  PlanetFact,
  PlanetName,
} from "./facts";

export type IntelligenceStrength =
  | "very_strong"
  | "strong"
  | "moderate"
  | "weak"
  | "damaged";

export type IntelligenceTheme = {
  key: string;
  label: string;

  score: number;
  confidence: number;

  reasons: string[];
  evidenceIds: string[];
};

export type PlanetIdentity = {
  functionalRole: string[];
  dominantMotivation: string[];
  expressionStyle: string[];
};

export type PlanetActivation = {
  currentlyActive: boolean;

  currentThemes: IntelligenceTheme[];
  futureThemes: IntelligenceTheme[];
};

export type PlanetStrengthAssessment = {
  score: number;
  confidence: number;

  verdict: IntelligenceStrength;

  // This comes directly from buildStrength.ts.
  summary: string;
};

export type PlanetIntelligenceSummary = {
  headline: string;
  strongestThemes: string[];
  shadowThemes: string[];
  narrative: string;
};

export type PlanetIntelligence = {
  planet: PlanetName;

  facts: PlanetFact;

  identity: PlanetIdentity;

  strength: PlanetStrengthAssessment;

  talents: IntelligenceTheme[];
  limitations: IntelligenceTheme[];

  businessThemes: IntelligenceTheme[];
  careerThemes: IntelligenceTheme[];
  wealthThemes: IntelligenceTheme[];
  relationshipThemes: IntelligenceTheme[];
  healthThemes: IntelligenceTheme[];
  spiritualThemes: IntelligenceTheme[];

  activation: PlanetActivation;

  contradictions: string[];

  evidence: AstrologyEvidence[];

  overallConfidence: number;

  summary: PlanetIntelligenceSummary;
};

export type PlanetIntelligenceStore = {
  planets: PlanetIntelligence[];

  byPlanet: Record<
    PlanetName,
    PlanetIntelligence | undefined
  >;

  warnings: string[];
};

export function buildPlanetIntelligenceStore(
  planets: PlanetIntelligence[]
): PlanetIntelligenceStore {
  const byPlanet: Record<
    PlanetName,
    PlanetIntelligence | undefined
  > = {
    Sun: undefined,
    Moon: undefined,
    Mars: undefined,
    Mercury: undefined,
    Jupiter: undefined,
    Venus: undefined,
    Saturn: undefined,
    Rahu: undefined,
    Ketu: undefined,
  };

  const warnings: string[] = [];

  for (const planet of planets) {
    if (byPlanet[planet.planet]) {
      warnings.push(
        `Duplicate intelligence for ${planet.planet}`
      );

      continue;
    }

    byPlanet[planet.planet] =
      planet;
  }

  return {
    planets,
    byPlanet,
    warnings,
  };
}