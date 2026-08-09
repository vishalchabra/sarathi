export type ReasoningIntent =
  | "career_suitability"
  | "business_suitability"
  | "education_suitability"
  | "role_suitability"
  | "relationship_suitability"
  | "health_suitability"
  | "spiritual_path"
  | "general";

export type ResolvedEntity = {
  key: string;
  label: string;

  confidence: number;

  aliases: string[];
  matchedText: string;
};

export type ResolvedTarget = {
  profileKey: string;
  profileLabel: string;

  confidence: number;

  matchedEntityKeys: string[];
  reasons: string[];
};

export type ReasoningRequest = {
  question: string;

  intent: ReasoningIntent;

  entities: ResolvedEntity[];
};

export type ReasoningResult = {
  question: string;

  intent: ReasoningIntent;

  entities: ResolvedEntity[];
  targets: ResolvedTarget[];

  warnings: string[];
};