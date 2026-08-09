import type {
  CapabilityMatchResult,
} from "../capability-matcher/types";

import type {
  ReasoningFact,
} from "../reasoning-facts/types";

import type {
  ReasoningLink,
} from "../reasoning-links/types";

export type ReasoningTraceNodeType =
  | "fact"
  | "capability"
  | "expression"
  | "target"
  | "verdict";

export type ReasoningTraceNode = {
  id: string;
  type: ReasoningTraceNodeType;
  label: string;

  score: number | null;
  confidence: number | null;

  evidenceIds: string[];
  reasons: string[];

  metadata: Record<
    string,
    unknown
  >;
};

export type ReasoningTraceStep = {
  from: ReasoningTraceNode;
  link: ReasoningLink;
  to: ReasoningTraceNode;
};

export type ReasoningPath = {
  id: string;

  targetKey: string;
  targetLabel: string;

  capabilityKey: string;
  capabilityLabel: string;

  expressionId: string;
  expressionLabel: string;

  factId: string;
  factLabel: string;

  weight: number;
  confidence: number;

  required: boolean;
  thresholdMet: boolean;

  steps: ReasoningTraceStep[];

  evidenceIds: string[];
  reasons: string[];
};

export type ReasoningContradiction = {
  capabilityKey: string;
  capabilityLabel: string;

  score: number;
  minimumScore: number;
  gap: number;

  reasons: string[];
  evidenceIds: string[];
};

export type ReasoningTrace = {
  targetKey: string;
  targetLabel: string;
  targetKind: string;

  matchScore: number;
  matchConfidence: number;
  verdict: string;

  supportingPaths: ReasoningPath[];
  strongestPaths: ReasoningPath[];

  contradictions:
    ReasoningContradiction[];

  strengths: string[];
  gaps: string[];
  cautions: string[];

  evidenceIds: string[];

  summary: string;
  warnings: string[];

  match:
    CapabilityMatchResult;
};

export type TraversalOptions = {
  maxPaths?: number;
  maxFactsPerCapability?: number;
  minimumLinkWeight?: number;
  includeOptionalCapabilities?: boolean;
};

export type FactLookup = {
  byId: Record<
    string,
    ReasoningFact | undefined
  >;
};