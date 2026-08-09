import type {
  CapabilityCategory,
} from "../capabilities/types";

export type CapabilityDomain =
  | "business"
  | "career"
  | "wealth"
  | "relationships"
  | "health"
  | "education"
  | "spiritual"
  | "leadership"
  | "creativity"
  | "general";

export type CapabilityExpression = {
  label: string;
  description: string;

  domains: CapabilityDomain[];

  minimumScore?: number;
  supportingCapabilityKeys?: string[];
};

export type CapabilityMaturityProfile = {
  potential: number;
  practicalExpression: number;
  activation: number;
  stability: number;
  longTermGrowth: number;
};

export type CapabilityOntologyDefinition = {
  key: string;
  label: string;
  description: string;

  category: CapabilityCategory;

  expressions: CapabilityExpression[];

  developmentActions: string[];
  overuseRisks: string[];
  underuseRisks: string[];
};

export type CapabilityRelationshipKind =
  | "reinforces"
  | "enables"
  | "balances"
  | "specialises"
  | "converts_into";

export type CapabilityRelationshipDefinition = {
  key: string;
  label: string;

  sourceCapabilityKeys: string[];
  resultCapabilityKey: string;

  kind: CapabilityRelationshipKind;

  minimumSourceScore: number;
  minimumConfidence: number;

  scoreBonus: number;

  domains: CapabilityDomain[];

  description: string;
};

export type ResolvedCapabilityExpression = {
  capabilityKey: string;
  capabilityLabel: string;

  expressionLabel: string;
  description: string;

  domains: CapabilityDomain[];

  score: number;
  confidence: number;

  supportingCapabilityKeys: string[];
};

export type ResolvedCapabilityRelationship = {
  key: string;
  label: string;

  sourceCapabilityKeys: string[];
  resultCapabilityKey: string;

  kind: CapabilityRelationshipKind;

  score: number;
  confidence: number;

  domains: CapabilityDomain[];

  description: string;
};

export type CapabilityOntologyStore = {
  definitions:
    CapabilityOntologyDefinition[];

  relationships:
    CapabilityRelationshipDefinition[];

  byKey:
    Record<
      string,
      CapabilityOntologyDefinition | undefined
    >;

  warnings: string[];
};