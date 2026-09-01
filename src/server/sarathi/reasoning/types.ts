export type ReasoningConfidence =
  | "low"
  | "medium"
  | "high";

export type ReasoningRole =
  | "primary"
  | "supporting"
  | "challenging";

export type ReasoningItem = {
  id: string;

  title: string;

  explanation: string;

  practicalMeaning: string;

  role: ReasoningRole;

  confidence: ReasoningConfidence;

  source?: string;
};

export type ReasoningSection<T = ReasoningItem> = {
  id: string;

  heading: string;

  summary: string;

  confidence: ReasoningConfidence;

  source: string;

  items: T[];
};