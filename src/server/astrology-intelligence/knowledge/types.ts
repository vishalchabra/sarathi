import type {
  PlanetName,
} from "../contracts/facts";

export type KnowledgeWeight =
  | "very_low"
  | "low"
  | "medium"
  | "high"
  | "very_high";

export type KnowledgeCategory =
  | "identity"
  | "strength"
  | "career"
  | "business"
  | "wealth"
  | "relationships"
  | "health"
  | "spirituality"
  | "psychology"
  | "communication"
  | "education";

export type KnowledgeTrigger = {
  sign?: string;
  house?: number;

  dignity?: string;

  conjunction?: PlanetName;
  aspectFrom?: PlanetName;
  aspectTo?: PlanetName;

  dispositor?: PlanetName;

  nakshatra?: string;
  pada?: number;

  retrograde?: boolean;
  combust?: boolean;
  vargottama?: boolean;

  ownsHouse?: number;

  currentDasha?: boolean;
  currentTransit?: boolean;

  varga?: {
    chart: string;
    sign?: string;
    house?: number;
    dignity?: string;
  };
};

export type KnowledgeEffect = {
  score: number;

  adds?: string[];
  removes?: string[];

  strengthens?: string[];
  weakens?: string[];

  shadowAdds?: string[];
  notes?: string[];
};

export type KnowledgeRule = {
  id: string;

  category: KnowledgeCategory;

  title: string;
  description: string;

  weight: KnowledgeWeight;
  priority: number;

  trigger: KnowledgeTrigger;
  effect: KnowledgeEffect;
};

export type PlanetKnowledge = {
  planet: PlanetName;

  identity: KnowledgeRule[];

  signRules: KnowledgeRule[];
  houseRules: KnowledgeRule[];
  dignityRules: KnowledgeRule[];
  conjunctionRules: KnowledgeRule[];
  aspectRules: KnowledgeRule[];
  dispositorRules: KnowledgeRule[];
  nakshatraRules: KnowledgeRule[];
  avasthaRules: KnowledgeRule[];
  vargaRules: KnowledgeRule[];
  dashaRules: KnowledgeRule[];
  transitRules: KnowledgeRule[];

  careerRules: KnowledgeRule[];
  businessRules: KnowledgeRule[];
  wealthRules: KnowledgeRule[];
  relationshipRules: KnowledgeRule[];
  healthRules: KnowledgeRule[];
  spiritualityRules: KnowledgeRule[];
  shadowRules: KnowledgeRule[];
};