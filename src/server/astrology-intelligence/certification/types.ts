export type CertificationQuestion = {
  id: string;

  category:
    | "profession"
    | "business"
    | "wealth"
    | "marriage"
    | "health"
    | "spirituality"
    | "timing";

  question: string;

  expectedCapabilities: string[];

  preferredCapabilities: string[];

  forbiddenCapabilities: string[];

  expectedPlanets: string[];

  expectedEvidence: string[];

  expectedThemes: string[];

  minimumConfidence: number;

  notes?: string;
};