import type { AstrologyEvidence } from "../contracts/evidence";
import type {
  SignalLimitation,
  SignalStrength,
  SignalTheme,
} from "./contracts";

export type BusinessDimensionKey =
  | "commercial_intelligence"
  | "knowledge_advantage"
  | "customer_appeal"
  | "execution_capacity"
  | "operational_durability"
  | "leadership_capacity"
  | "scale_potential"
  | "risk_pressure"
  | "current_activation";

export type BusinessDimension = {
  key: BusinessDimensionKey;
  label: string;
  score: number;
  confidence: number;
  strength: SignalStrength;
  contributors: string[];
  reasons: string[];
  evidenceIds: string[];
};

export type BusinessModelFit = {
  key: string;
  label: string;
  score: number;
  confidence: number;
  supportingDimensions: BusinessDimensionKey[];
  supportingThemes: string[];
  contributors: string[];
};

export type BusinessSignal = {
  key: "business";
  label: "Business Signal";
  score: number;
  confidence: number;
  strength: SignalStrength;
  dimensions: Record<BusinessDimensionKey, BusinessDimension>;
  suitableModels: BusinessModelFit[];
  themes: SignalTheme[];
  cautions: SignalLimitation[];
  evidence: AstrologyEvidence[];
  evidenceIds: string[];
  summary: string;
  warnings: string[];
};
