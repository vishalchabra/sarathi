export type ConfidenceLabel = "Low" | "Medium" | "High";

export type GuidanceDomain = "Career" | "Money" | "Relationships" | "Health" | "Inner";

export type PredictionUnit = {
  domain: GuidanceDomain;
  startISO: string;
  endISO: string;
  event: string;            // one sentence outcome (no fluff)
  probability: number;      // 0-100
  confidence: ConfidenceLabel;
  triggers: string[];       // 2-4 max
  actions: string[];        // 2-4 max
  consequenceIfFollowed: string;
  consequenceIfIgnored: string;
  whyFacts: string[];       // short factual signals (no prose)
};
export type LifeArchitecture = {
  oneLine: string;
  corePattern: string;
  primaryTension: string;
  growthEngine: string;
  longTrajectory: string;
};

export type LifeChapterAD = {
  adPlanet: string;
  fromISO: string;
  toISO: string;
  theme: string;
  likelyEvents: string[];
  do: string[];
  avoid: string[];
  evidence: string[];
};

export type LifeChapterMD = {
  mdPlanet: string;
  fromISO: string;
  toISO: string;
  mdTheme: string;
  mdStory: string;
  adChapters: LifeChapterAD[];
};

export type CurrentChapter = {
  md: string;
  ad: string;
  pd?: string;
  executiveSummary: string;
  whatToBuild: string[];
  whatToStop: string[];
  doNow: string[];
  avoidNow: string[];
};
export type FullGuidanceBrief = {
  generatedForISO: string;
  overallConfidence: ConfidenceLabel;

  snapshot: {
    primaryVector: string;       // e.g., "Process stabilization + execution discipline"
    opportunity: string;         // e.g., "Reputation lift via precision"
    vulnerability: string;       // e.g., "Energy inconsistency → reactive decisions"
    reliability: {
      strongestDomain: GuidanceDomain;
      weakestDomain: GuidanceDomain;
    };
  };

  today: {
    directive: string;       // one tactical order
    avoid: string;           // one avoid order
    bestWindows: Array<{
      label: "Morning" | "Midday" | "Evening";
      bestFor: string;
      oneAction: string;
      avoid: string;
      whyFact?: string;      // 1 factual line max
    }>;
    caution: string[];       // 1-3 max
  };

  next14: {
    title: string;
    predictions: PredictionUnit[]; // 3-5 max, ranked
  };

  next30: {
    title: string;
    predictions: PredictionUnit[]; // 2-4 max
  };

  next60: {
    title: string;
    predictions: PredictionUnit[]; // 2-3 max
  };

  next90: {
    title: string;
    predictions: PredictionUnit[]; // 4 core units ideally
  };

  riskIndex: {
    likelyMistake: string;
    emotionalTrap: string;
    structuralTrap: string;
    financialTrap: string;
  };

  decisionProtocol: string[]; // 4-7 max

  // --- NEW: paid “life story” layer ---
  lifeArchitecture: LifeArchitecture;
  lifeChapters: LifeChapterMD[];   // MD → AD narrative
  currentChapter: CurrentChapter;  // what chapter you’re in now
  };