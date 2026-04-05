export type AskSarathiDomain =
  | "career"
  | "money"
  | "relationships"
  | "health"
  | "property"
  | "relocation"
  | "vehicle"
  | "disputes"
  | "marriage"
  | "inner"
  | "generic";
  

export type AskSarathiQuestionType =
  | "decision"
  | "timing"
  | "diagnosis"
  | "comparison"
  | "action_plan"
  | "remedy"
  | "emotional_support"
  | "explainer"
  | "daily_outlook"
  | "daily_micro";

export type AskSarathiVerdictType =
  | "favorable"
  | "supportive"
  | "mixed"
  | "caution"
  | "not_advised"
  | "needs_patience";

export type AskSarathiConfidence = "Low" | "Medium" | "High";

export type AskSarathiWindowStrength =
  | "Strong"
  | "Supportive"
  | "Mixed"
  | "Caution";

export type AskSarathiTimingWindow = {
  fromISO?: string;
  toISO?: string;
  label: string;
  strength: AskSarathiWindowStrength;
  why: string[];
  do: string[];
  avoid: string[];
};

export type AskSarathiCoreAnswer = {
  ok: boolean;
  mode: "personalized" | "generic";

  domain: AskSarathiDomain;
  questionType: AskSarathiQuestionType;

  title: string;

  verdict: {
    type: AskSarathiVerdictType;
    line: string;
  };

  currentPhase: {
    label?: string;
    summary: string;
  };

  timing: {
    hasTiming: boolean;
    summary: string;
    windows: AskSarathiTimingWindow[];
  };

  reasons: string[];
  actions: string[];
  avoid: string[];

  confidence: {
    level: AskSarathiConfidence;
    reason: string;
  };

  followUps: string[];

  emotionalSupport?: string;

  evidenceBullets: string[];

  prose: {
    short: string;
    full: string;
  };
};