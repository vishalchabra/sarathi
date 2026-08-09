import type {
  CapabilityDomain,
} from "../capability-ontology/types";

export type TargetProfileKind =
  | "career"
  | "business"
  | "education"
  | "relationship"
  | "health"
  | "spiritual"
  | "leadership"
  | "creative"
  | "general";

export type TargetCapabilityRequirement = {
  capabilityKey: string;

  weight: number;
  minimumScore: number;

  required: boolean;

  reason: string;
};

export type TargetCapabilityConstraint = {
  capabilityKey: string;

  maximumRiskScore?: number;
  minimumStabilityScore?: number;

  reason: string;
};

export type TargetProfile = {
  key: string;
  label: string;
  description: string;

  kind: TargetProfileKind;
  domains: CapabilityDomain[];

  requirements: TargetCapabilityRequirement[];
  optionalCapabilities: TargetCapabilityRequirement[];
  constraints: TargetCapabilityConstraint[];

  practicalExpressions: string[];
  cautions: string[];
};

export type CapabilityMatchContribution = {
  capabilityKey: string;
  capabilityLabel: string;

  required: boolean;
  weight: number;

  actualScore: number;
  minimumScore: number;

  confidence: number;

  fitScore: number;
  gap: number;

  reasons: string[];
  evidenceIds: string[];
};

export type CapabilityMatchConstraintResult = {
  capabilityKey: string;
  capabilityLabel: string;

  passed: boolean;

  actualRiskScore: number;
  allowedRiskScore: number | null;

  actualStabilityScore: number;
  requiredStabilityScore: number | null;

  reason: string;
};

export type CapabilityMatchVerdict =
  | "excellent_fit"
  | "strong_fit"
  | "moderate_fit"
  | "conditional_fit"
  | "weak_fit"
  | "insufficient_data";

export type CapabilityMatchResult = {
  targetKey: string;
  targetLabel: string;
  targetKind: TargetProfileKind;

  score: number;
  confidence: number;

  verdict: CapabilityMatchVerdict;

  requiredContributions:
    CapabilityMatchContribution[];

  optionalContributions:
    CapabilityMatchContribution[];

  constraintResults:
    CapabilityMatchConstraintResult[];

  strengths: string[];
  gaps: string[];
  cautions: string[];

  practicalExpressions: string[];

  evidenceIds: string[];

  summary: string;
  warnings: string[];
};

export type CapabilityMatcherStore = {
  profiles: TargetProfile[];

  byKey:
    Record<
      string,
      TargetProfile | undefined
    >;

  warnings: string[];
};