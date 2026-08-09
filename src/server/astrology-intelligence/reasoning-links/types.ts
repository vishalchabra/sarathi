export type ReasoningLinkType =
  | "fact_capability"
  | "capability_expression"
  | "expression_target";

export type ReasoningLink = {
  id: string;

  type: ReasoningLinkType;

  from: string;
  to: string;

  weight: number;
  confidence: number;

  evidenceIds: string[];
  reasons: string[];

  metadata: Record<
    string,
    unknown
  >;
};

export type ReasoningLinkStore = {
  links: ReasoningLink[];

  byId: Record<
    string,
    ReasoningLink | undefined
  >;

  byFrom: Record<
    string,
    ReasoningLink[]
  >;

  byTo: Record<
    string,
    ReasoningLink[]
  >;

  byType: Partial<
    Record<
      ReasoningLinkType,
      ReasoningLink[]
    >
  >;

  warnings: string[];
};