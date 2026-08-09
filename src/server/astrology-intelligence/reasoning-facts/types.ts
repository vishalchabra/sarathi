import type { AstrologyEvidence } from "../contracts/evidence";
import type { PlanetName } from "../contracts/facts";

export type ReasoningFactSource =
  | "natal"
  | "house"
  | "lordship"
  | "aspect"
  | "sambandha"
  | "varga"
  | "dasha"
  | "transit"
  | "yoga";

export type ReasoningFactKind =
  | "placement"
  | "ownership"
  | "relationship"
  | "condition"
  | "strength"
  | "activation"
  | "timing"
  | "pattern";

export type ReasoningFact = {
  id: string;
  kind: ReasoningFactKind;
  source: ReasoningFactSource;
  label: string;
  detail: string;
  planets: PlanetName[];
  houses: number[];
  signs: string[];
  charts: string[];
  weight: number;
  confidence: number;
  polarity: "supportive" | "challenging" | "mixed" | "neutral";
  evidenceIds: string[];
  metadata: Record<string, unknown>;
};

export type ReasoningFactStore = {
  facts: ReasoningFact[];
  byId: Record<string, ReasoningFact | undefined>;
  byPlanet: Partial<Record<PlanetName, ReasoningFact[]>>;
  byKind: Partial<Record<ReasoningFactKind, ReasoningFact[]>>;
  evidence: AstrologyEvidence[];
  warnings: string[];
};