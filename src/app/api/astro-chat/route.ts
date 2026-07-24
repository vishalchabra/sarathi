export const runtime = "nodejs";

import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserEntitlements } from "@/server/auth/getUserEntitlements";
import { logQuestionUsage } from "@/server/access/logQuestionUsage";
import { inferCareer } from "@/server/astro/inference/career";
import { buildPanchangData } from "@/server/dataEngine/buildPanchangData";
import { buildSarathiChatContext } from "@/server/astro-chat/buildSarathiChatContext";
/*
  Sārathi astro chat route — simplified generic pipeline

  Goal:
  1) Understand the question
  2) Map it to houses / karakas / divisional charts / remedy rules
  3) Build ONE generic astrology judgement bundle
  4) Send that bundle to /api/naturalize
  5) Keep the current response structure, but remove domain-specific answer builders

  IMPORTANT:
  - This rewrite intentionally removes the separate reading engines such as
    buildMarriageReading / buildPropertyReading / buildCareerReading / buildRelocationReading.
  - It keeps the good part of the current architecture: topic detection, question type,
    evidence bullets, structured response payload, naturalize step.
  - It assumes your life-report already contains most of the chart/timing/transit data.
*/

/* --------------------------------------------------
   Types
-------------------------------------------------- */

type BirthData = {
  name?: string;
  dateISO: string;
  time: string;
  tz: string;
  lat: number;
  lon: number;
};

type LifeReportLike = {
  activePeriods?: any;
  timeline?: any[];
  transitWindows?: any[];
  topTransits?: any[];
  natal?: any;
  divisionalCharts?: Record<string, any>;
  vargas?: Record<string, any>;
  houseLords?: Record<string, any>;
  houses?: Record<string, any>;
  birth?: BirthData;
};

type AskSarathiDomain =
  | "career"
  | "money"
  | "relationships"
  | "marriage"
  | "health"
  | "property"
  | "relocation"
  | "vehicle"
  | "disputes"
  | "child"
  | "education"
  | "parents"
  | "siblings"
  | "business"
  | "travel"
  | "spiritual"
  | "reputation"
  | "debt"
  | "inheritance"
  | "mental_health"
  | "pets"
  | "inner"
  | "generic";

type AskSarathiQuestionType =
  | "daily_micro"
  | "daily_outlook"
  | "transit_analysis"
  | "timing"
  | "decision"
  | "prediction"
  | "remedy"
  | "explainer"
  | "diagnosis"
  | "comparison"
  | "action_plan"
  | "emotional_support"
  | "type_profile"
  | "generic";
type AnswerMode =
  | "TIMING_FIRST"
  | "CONTINUATION_TIMING"
  | "DIAGNOSTIC_FIRST"
  | "DECISION_FIRST"
  | "PROFILE_FIRST"
  | "STRATEGY_FIRST"
  | "DAILY_GUIDANCE";
type TimeDirection = "past" | "present" | "future" | "identity" | "mixed";
type EventScale = "major" | "medium" | "micro";

type TopicRule = {
  topic: AskSarathiDomain;
  houses: number[];
  supportHouses?: number[];
  karakas: string[];
  divisionalCharts: string[];
  remediesAllowed: boolean;
  timingImportant: boolean;
  keywords: string[];
};

type NormalizedProfile = {
  name?: string;
  dobISO?: string;
  tob?: string;
  place?: {
    name?: string;
    tz: string;
    lat: number;
    lon: number;
  };
};

type AnalysisLayer = {
  title: string;
  verdict: "strong" | "moderate" | "weak" | "mixed" | "unclear";
  summary: string;
  bullets: string[];
};

type TimingWindow = {
  label: string;
  start?: string | null;
  end?: string | null;
  peak?: string | null;
  why: string[];
  dashaLord?: string | null;
  dashaLevel?: "md" | "ad" | "pd" | null;
  dashaChainLabel?: string | null;
};
type TimingWindowClass =
  | "preparation"
  | "visibility"
  | "discussion"
  | "review"
  | "movement"
  | "paperwork"
  | "negotiation"
  | "conversion"
  | "outcome";

type RankedTimingWindow = TimingWindow & {
  score: number;
  confidence: "high" | "medium" | "low";
  windowClass: TimingWindowClass;
  practicalMeaning: string;
};
type EventTriggerType =
  | "dasha_activation"
  | "transit_conjunction"
  | "transit_aspect"
  | "transit_ingress"
  | "nakshatra_ingress"
  | "degree_hit"
  | "divisional_trigger";

type UniversalEventTrigger = {
  date: string;
  topic: AskSarathiDomain;
  eventType?: AskSarathiEventType;
  label: string;
  score: number;
  confidence: "high" | "medium" | "low";
  triggerType: EventTriggerType;
  planet?: string | null;
  target?: string | null;
  houses: number[];
  why: string[];
  practicalMeaning: string;
};
type GenericAstroBundle = {
  question: string;
  topic: AskSarathiDomain;
  questionType: AskSarathiQuestionType;
  timeDirection: TimeDirection;
  eventScale: EventScale;
  eventHints: string[];
  focusHouses: number[];
  supportHouses: number[];
  dailyAstroContext?: DailyAstroContext;
  karakas: string[];
  divisionalCharts: string[];
  currentDasha: {
    md?: string | null;
    ad?: string | null;
    pd?: string | null;
    line: string;
  };
  careerInference?: any;
  careerEventType: CareerEventType;
  eventType?: AskSarathiEventType;
  diagnosticProfile?: HolisticDiagnosticProfile;
  chartRealityProfile?: ChartRealityProfile;
  pastActivationProfile?: PastActivationProfile;
  evidenceNarrative?: EvidenceNarrative;
  astroReasonMap?: AstroReasonMap;
  astroInterpretationPacket?: AstroInterpretationPacket;
  astroJudgement?: UniversalAstroJudgement;
  promiseLayer: AnalysisLayer;
  divisionalLayer: AnalysisLayer;
  divisionalBreakdown?: {
    chart: string;
    strength: AnalysisLayer["verdict"];
    weight: number;
  }[];
  karakaLayer: AnalysisLayer;
  timingLayer: AnalysisLayer;
  remediesLayer: AnalysisLayer | null;
  timingWindows: TimingWindow[];
  rankedTimingWindows: any[];
nearestWindow: any | null;
strongestWindow: any | null;
bestAvailableWindow: any | null;
selectedTimingWindow: any | null;
eventTriggers: UniversalEventTrigger[];
bestEventTrigger: UniversalEventTrigger | null;
winningEvidence?: {
  primaryReason: string | null;
  supportingReasons: string[];
  blockingReasons: string[];
  strongestSupport?: string | null;
  strongestBlocker?: string | null;
};

whyNotNow?: string[];
conversionDiagnosisV2?: {
  verdict: "conversion_favored" | "movement_favored" | "blocked";
  movementStrength: number;
  conversionStrength: number;
  blockageStrength: number;
  movementReasons: string[];
  conversionReasons: string[];
  blockageReasons: string[];
};
promotionConversionEngine?: ReturnType<typeof buildPromotionConversionEngine> | null;
  timingPolicy: {
    dashaStrength: "strong" | "moderate" | "mixed" | "weak";
    transitStrength: "strong" | "moderate" | "mixed" | "weak";
    allowSharpWindow: boolean;
    note: string;
  };
  themeSignal?: {
  score: number;
  strength: "strong" | "moderate" | "mixed" | "weak";
  activeSignals: string[];
  missingSignals: string[];
  bestUse: string;
  caution: string;
  timingStyle: "event" | "phase" | "preparation";
};
  actionBias: {
  bestUse: string;
  watchFor: string;
};
  evidenceBullets: string[];
  confidence: "High" | "Medium" | "Low";
  timingConfidenceNote: string;
  answerSummary: string;

  phasePsychology?: {
    title: string;
    text: string;
  };
astroTimeline?: Array<{
  label: string;
  confidence: "high" | "medium" | "low";
  reason: string;
  score?: number;
}>;

majorWindows?: Array<{
  label: string;
  confidence: "high" | "medium" | "low";
  reason: string;
  score?: number;
}>;
nearTermWindows?: Array<{
  label: string;
  confidence: "high" | "medium" | "low";
  reason: string;
  score?: number;
}>;
triggerWindows?: Array<{
  label: string;
  confidence: "high" | "medium" | "low";
  reason: string;
  score?: number;
}>;
  strategy?: {
    title: string;
    focus: string;
    push: string[];
    avoid: string[];
  };

  remediesDetailed?: {
    title: string;
    items: Array<{
      remedy: string;
      why: string;
    }>;
  };

  hiddenOpportunity?: {
    title: string;
    text: string;
  };
responseState?: {
  emotionalTone: string;
  energyState: string;
  guidanceStyle: string;
  confidenceStyle: string;
  dominantPlanet: string;
};  
conversationPsychology?: ConversationPsychology;
verdict?: string;
humanReason?: string;
astroReason?: string;
answerMode: AnswerMode;
insightProfile?: InsightProfile;
};

type CareerEventType =
  | "profession_identity"
  | "promotion"
  | "job_change"
  | "career_movement"
  | "internal_shift"
  | "stability_check"
  | "generic";
type AskSarathiEventType =
  | CareerEventType
  | "buy_property"
  | "sell_property"
  | "move_home"
  | "buy_vehicle"
  | "upgrade_vehicle"
  | "salary_increase"
  | "bonus"
  | "side_income"
  | "new_relationship"
  | "marriage_commitment"
  | "reconciliation"
  | "health_recovery"
  | "health_checkup"
  | "foreign_move"
  | "local_move"
  | "generic_event";
type DashaAtTime = {
  md?: string | null;
  ad?: string | null;
  pd?: string | null;
  start?: string | null;
  end?: string | null;
};

type PastEventWindow = {
  startYear: number;
  endYear: number;
  peakYear: number;
  score: number;
  reasons: string[];
};
type DivisionalChartBreakdown = {
  chart: string;
  strength: AnalysisLayer["verdict"];
  weight: number;
};

type DivisionalAnalysisLayer = AnalysisLayer & {
  chartBreakdown: DivisionalChartBreakdown[];
};
type PredictionScore = {
  score: number;
  confidence: "high" | "medium" | "low";
  reasons: string[];
  missing: string[];
};

type HolisticDiagnosticItem = {
  area: string;
  level: "high" | "medium" | "low";
  why: string;
  watchFor: string;
  helpfulAction: string;
};

type HolisticDiagnosticProfile = {
  mode: "diagnostic" | "timing" | "strategy" | "mixed";
  title: string;
  summary: string;
  topConcerns: HolisticDiagnosticItem[];
  strengths: HolisticDiagnosticItem[];
  blockers: HolisticDiagnosticItem[];
  timingWindows: {
    nearTerm?: string | null;
    structural?: string | null;
    note: string;
  };
  bestUse: string;
  caution: string;
};
type LifeOverviewProfile = {
  title: string;
  opportunities: Array<{
    area: string;
    level: "high" | "medium" | "low";
    why: string;
    action: string;
  }>;
  challenges: Array<{
    area: string;
    level: "high" | "medium" | "low";
    why: string;
    watchFor: string;
  }>;
  timing: {
    nearTerm?: string;
    structural?: string;
    note: string;
  };
  focusAdvice: string;
};
type InsightProfile = {
  topic: AskSarathiDomain;
  answerMode: AnswerMode;
  eventType?: AskSarathiEventType;
  headline: string;
  coreMessage: string;
  strengths: string[];
  blockers: string[];
  opportunities: string[];
  risks: string[];
  nearTermWindows: string[];
  majorWindows: string[];
  bestUse: string;
  caution: string;
  evidence: string[];
  astrologicalDrivers: string[];
  confidence: "High" | "Medium" | "Low";
};
type ConversationState = {
  lastTopic?: AskSarathiDomain;
  lastEventType?: AskSarathiEventType;
  lastCareerEventType?: CareerEventType;
  lastAnswerMode?: AnswerMode;
  lastAnswerSummary?: string | null;
};
type UniversalAstroJudgement = {
  verdict: string;
  humanReason: string;
  astroReason: string;
  strongestReason: string;
  why: string[];
  action: string;
  caution: string;
  bestUse: string;
  confidence: "High" | "Medium" | "Low";
};
type EvidenceNarrative = {
  why: string[];
  supports: string[];
  blockers: string[];
};
type AstroReason = {
  factor: string;
  role: string;
  impact: "support" | "block" | "mixed";
};

type AstroReasonMap = Partial<Record<AskSarathiDomain, AstroReason[]>>;
type ConversationPsychology = {
  surfaceIntent:
    | "astrology_question"
    | "daily_guidance"
    | "personal_advice"
    | "remedy_request"
    | "casual_chat"
    | "followup"
    | "unknown";

  emotionalTone:
    | "neutral"
    | "anxious"
    | "frustrated"
    | "confused"
    | "hopeful"
    | "low"
    | "urgent";

  userNeed:
    | "answer"
    | "timing"
    | "diagnosis"
    | "decision"
    | "comfort"
    | "strategy"
    | "simple_guidance";

  shouldUsePreviousTopic: boolean;
  shouldUseFullAstrology: boolean;
  answerStyle: "conversational" | "direct" | "soft" | "strategic" | "simple";
  oneLineIntent: string;
};
type ChartRealityProfile = {
  age?: number;

  lifeEvidence: {
    likelyMarried: boolean;
    likelyChildren: boolean;
    likelyCareerEstablished: boolean;
    likelyPropertyExposure: boolean;
  };
  lifeEvidenceReasons: {
  marriage: string[];
  children: string[];
  career: string[];
  property: string[];
};
  likelyAlreadyExperienced: string[];

  pastWindows: Array<{
    topic: AskSarathiDomain;
    event: string;
    window: string;
    reason: string;
  }>;

  currentLifeStage: string;
  contradictions: string[];
  cautionFlags: string[];
};
type PastActivationProfile = {
  relationships: Array<{
    window: string;
    ageAtStart?: number;
    ageAtEnd?: number;
    reason: string;
  }>;

  career: Array<{
    window: string;
    ageAtStart?: number;
    ageAtEnd?: number;
    reason: string;
  }>;

  property: Array<{
    window: string;
    ageAtStart?: number;
    ageAtEnd?: number;
    reason: string;
  }>;

  wealth: Array<{
    window: string;
    ageAtStart?: number;
    ageAtEnd?: number;
    reason: string;
  }>;
};
type AstroInterpretationPacket = {
  question: string;
  topic: AskSarathiDomain;
  eventType?: AskSarathiEventType;
  answerMode: AnswerMode;

  userContext: {
    age?: number;
    lifeStage?: string;
  };

  promise: {
    strength: "strong" | "moderate" | "mixed" | "weak" | "unclear";
    reasons: string[];
  };

 timing: {
  dashaStrength: string;
  transitStrength: string;
  nearTermWindows: string[];
  majorWindows: string[];
  nearTermScore?: number;
  majorScore?: number;
  timingNote: string;
};

  astrology: {
    houses: number[];
    supportHouses: number[];
    karakas: string[];
    divisionalCharts: string[];
    houseLordReasons: string[];
    currentDasha: {
      md?: string | null;
      ad?: string | null;
      pd?: string | null;
      line: string;
    };
  };
 planetContributions: PlanetContribution[];
 moneyReasonMap?: MoneyReasonMap;
 careerReasonMap?: CareerReasonMap;
 relationshipReasonMap?: RelationshipReasonMap;
 conversionDiagnosis?: ConversionDiagnosis;
 whyChain?: WhyChain;
  interpretation: {
    supports: string[];
    blockers: string[];
    conversionIssue: string;
    realLifeManifestations: string[];
    bestUse: string;
    caution: string;
  };

  realityCheck?: ChartRealityProfile;
};
type PlanetContribution = {
  planet: string;
  role: string;
  contribution: string;
  impact: "support" | "block" | "mixed";
  strength: number;
};
type MoneyReasonMap = {
  incomeDrivers: string[];
  savingsDrivers: string[];
  leakageDrivers: string[];
  wealthBlockers: string[];
};
type CareerReasonMap = {
  titleSupport: string[];
  responsibilitySupport: string[];
  mobilitySupport: string[];
  promotionBlockers: string[];
  d10Reasons: string[];
};
type RelationshipReasonMap = {
  attractionDrivers: string[];
  bondingDrivers: string[];
  commitmentDrivers: string[];
  relationshipBlockers: string[];
  d9Reasons: string[];
};
type ConversionDiagnosis = {
  promise: string;
  trigger: string;
  blocker: string;
  outcome: string;
};

type WhyChain = {
  level1: string;
  level2: string;
  level3: string;
};
type DailyAstroContext = {
  dateISO: string;
  label: "today" | "tomorrow" | "specific_date";
  location?: string;

  panchang?: {
    tithi?: string | null;
    nakshatra?: string | null;
    yoga?: string | null;
    karana?: string | null;
    rahuKaal?: string | null;
    abhijitMuhurta?: string | null;
  };

  moon?: {
    sign?: string | null;
    nakshatra?: string | null;
    houseFromLagna?: number | null;
    moodTheme?: string | null;
  };

  activeDasha?: {
    md?: string | null;
    ad?: string | null;
    pd?: string | null;
    line?: string | null;
  };

  dailyJudgement: {
    verdict: string;
    bestUse: string;
    avoid: string;
    astrologyReason: string;
    confidence: "High" | "Medium" | "Low";
  };
};

/* --------------------------------------------------
   Constants
-------------------------------------------------- */

const TOPIC_RULES: TopicRule[] = [
  {
    topic: "marriage",
    houses: [7],
    supportHouses: [2, 11],
    karakas: ["Venus", "Jupiter"],
    divisionalCharts: ["D9"],
    remediesAllowed: true,
    timingImportant: true,
    keywords: ["marriage", "marry", "wedding", "spouse"],
  },
  {
    topic: "relationships",
    houses: [5, 7],
    supportHouses: [11],
    karakas: ["Venus", "Moon"],
    divisionalCharts: ["D9"],
    remediesAllowed: true,
    timingImportant: true,
    keywords: ["relationship", "partner", "love", "boyfriend", "girlfriend"],
  },
  {
    topic: "child",
    houses: [5],
    supportHouses: [9, 11],
    karakas: ["Jupiter"],
    divisionalCharts: ["D7"],
    remediesAllowed: true,
    timingImportant: true,
    keywords: ["child", "children", "baby", "pregnancy", "conceive"],
  },
  {
    topic: "property",
    houses: [4],
    supportHouses: [11, 12],
    karakas: ["Mars", "Venus", "Moon"],
    divisionalCharts: ["D4"],
    remediesAllowed: true,
    timingImportant: true,
    keywords: ["property", "house", "home", "flat", "land", "plot", "real estate"],
  },
  {
    topic: "career",
    houses: [10, 6],
    supportHouses: [2, 11],
    karakas: ["Sun", "Saturn", "Mercury", "Jupiter"],
    divisionalCharts: ["D10"],
    remediesAllowed: true,
    timingImportant: true,
    keywords: ["career", "job", "work", "promotion", "profession", "role", "boss"],
  },
  {
    topic: "money",
    houses: [2, 11],
    supportHouses: [5, 9],
    karakas: ["Jupiter", "Venus", "Mercury"],
    divisionalCharts: ["D2"],
    remediesAllowed: true,
    timingImportant: true,
    keywords: ["money", "wealth", "income", "finance", "salary", "bonus"],
  },
  {
    topic: "relocation",
    houses: [4, 12],
    supportHouses: [3, 9],
    karakas: ["Moon", "Rahu", "Saturn"],
    divisionalCharts: ["D4", "D9"],
    remediesAllowed: true,
    timingImportant: true,
    keywords: ["relocation", "relocate", "move", "abroad", "foreign"],
  },
  {
    topic: "health",
    houses: [6, 8],
    supportHouses: [1, 12],
    karakas: ["Sun", "Moon", "Mars", "Saturn"],
    divisionalCharts: ["D30"],
    remediesAllowed: true,
    timingImportant: true,
    keywords: ["health", "body", "illness", "recovery", "stress", "sleep"],
  },
  {
    topic: "vehicle",
    houses: [4],
    supportHouses: [11],
    karakas: ["Venus", "Mars"],
    divisionalCharts: ["D16"],
    remediesAllowed: true,
    timingImportant: true,
    keywords: ["vehicle", "car", "bike", "automobile"],
  },
  {
    topic: "disputes",
    houses: [6, 8],
    supportHouses: [3, 7],
    karakas: ["Mars", "Saturn", "Rahu"],
    divisionalCharts: ["D6"],
    remediesAllowed: true,
    timingImportant: true,
    keywords: ["dispute", "legal", "court", "case", "conflict"],
  },
  {
    topic: "education",
    houses: [4, 5],
    supportHouses: [9, 11],
    karakas: ["Mercury", "Jupiter"],
    divisionalCharts: ["D24", "D9"],
    remediesAllowed: true,
    timingImportant: true,
    keywords: ["education", "study", "studies", "exam", "college", "university", "degree", "learning"],
  },
  {
    topic: "parents",
    houses: [4, 9],
    supportHouses: [1, 10],
    karakas: ["Sun", "Moon", "Jupiter"],
    divisionalCharts: ["D12", "D9"],
    remediesAllowed: true,
    timingImportant: true,
    keywords: ["mother", "father", "parents", "parent", "family elder"],
  },
  {
    topic: "siblings",
    houses: [3, 11],
    supportHouses: [2, 6],
    karakas: ["Mars", "Mercury"],
    divisionalCharts: ["D3"],
    remediesAllowed: true,
    timingImportant: true,
    keywords: ["brother", "sister", "sibling", "siblings"],
  },
  {
    topic: "business",
    houses: [7, 10],
    supportHouses: [2, 3, 11],
    karakas: ["Mercury", "Saturn", "Jupiter", "Rahu"],
    divisionalCharts: ["D10", "D9", "D2"],
    remediesAllowed: true,
    timingImportant: true,
    keywords: ["business", "startup", "entrepreneur", "self employed", "partnership business", "own business"],
  },
  {
    topic: "travel",
    houses: [3, 9, 12],
    supportHouses: [4],
    karakas: ["Moon", "Rahu", "Jupiter"],
    divisionalCharts: ["D9", "D4"],
    remediesAllowed: true,
    timingImportant: true,
    keywords: ["travel", "trip", "journey", "visa", "overseas travel", "pilgrimage"],
  },
  {
    topic: "spiritual",
    houses: [5, 8, 9, 12],
    supportHouses: [1],
    karakas: ["Jupiter", "Ketu", "Moon"],
    divisionalCharts: ["D9", "D20"],
    remediesAllowed: true,
    timingImportant: false,
    keywords: ["spiritual", "sadhana", "mantra", "meditation", "moksha", "guru", "temple"],
  },
  {
    topic: "reputation",
    houses: [10, 11],
    supportHouses: [1, 5, 9],
    karakas: ["Sun", "Jupiter", "Rahu"],
    divisionalCharts: ["D10", "D9"],
    remediesAllowed: true,
    timingImportant: true,
    keywords: ["reputation", "fame", "recognition", "public image", "status", "visibility"],
  },
  {
    topic: "debt",
    houses: [6, 8, 12],
    supportHouses: [2, 11],
    karakas: ["Saturn", "Mars", "Rahu"],
    divisionalCharts: ["D2", "D6"],
    remediesAllowed: true,
    timingImportant: true,
    keywords: ["loan", "debt", "emi", "mortgage", "liability", "borrowing", "repayment"],
  },
  {
    topic: "inheritance",
    houses: [8],
    supportHouses: [2, 4, 11],
    karakas: ["Saturn", "Jupiter", "Ketu"],
    divisionalCharts: ["D8", "D12"],
    remediesAllowed: true,
    timingImportant: true,
    keywords: ["inheritance", "legacy", "will", "ancestral", "insurance settlement"],
  },
  {
    topic: "mental_health",
    houses: [1, 4, 8, 12],
    supportHouses: [5],
    karakas: ["Moon", "Mercury", "Saturn", "Ketu"],
    divisionalCharts: ["D9", "D30"],
    remediesAllowed: true,
    timingImportant: true,
    keywords: ["anxiety", "depression", "mental health", "overthinking", "restless", "panic", "mood"],
  },
  {
    topic: "pets",
    houses: [6],
    supportHouses: [4, 12],
    karakas: ["Moon", "Mercury", "Ketu"],
    divisionalCharts: ["D6", "D30"],
    remediesAllowed: false,
    timingImportant: false,
    keywords: ["pet", "dog", "cat", "animal"],
  },
  {
    topic: "inner",
    houses: [8, 12],
    supportHouses: [1, 9],
    karakas: ["Moon", "Ketu", "Jupiter"],
    divisionalCharts: ["D9"],
    remediesAllowed: true,
    timingImportant: false,
    keywords: ["purpose", "meaning", "inner", "direction", "lost", "confused"],
  },
];
const EVENT_CONVERSION_RULES: Partial<
  Record<
    AskSarathiEventType,
    {
      houses: number[];
      supportHouses: number[];
      karakas: string[];
      divisionalCharts: string[];
      language: string;
    }
  >
> = {
  promotion: {
    houses: [10, 11, 2],
    supportHouses: [6],
    karakas: ["Sun", "Saturn", "Jupiter"],
    divisionalCharts: ["D10"],
    language: "promotion, title elevation, recognition, salary increment, formal reward",
  },

  job_change: {
    houses: [3, 6, 10, 12],
    supportHouses: [2, 11],
    karakas: ["Rahu", "Mercury", "Saturn"],
    divisionalCharts: ["D10"],
    language: "applications, interviews, resignation thinking, offer movement, employer change",
  },

  buy_property: {
    houses: [4, 11, 12],
    supportHouses: [2],
    karakas: ["Mars", "Venus", "Moon"],
    divisionalCharts: ["D4"],
    language: "property search, agreement, registration, loan approval, possession",
  },

  buy_vehicle: {
    houses: [4, 11, 2],
    supportHouses: [12],
    karakas: ["Venus", "Mars"],
    divisionalCharts: ["D16"],
    language: "vehicle purchase, booking, delivery, financing, upgrade",
  },

  marriage_commitment: {
    houses: [7, 2, 11],
    supportHouses: [5, 9],
    karakas: ["Venus", "Jupiter"],
    divisionalCharts: ["D9"],
    language: "commitment, proposal, family discussion, engagement, marriage movement",
  },

  salary_increase: {
    houses: [2, 11, 10],
    supportHouses: [6],
    karakas: ["Jupiter", "Venus", "Sun"],
    divisionalCharts: ["D2", "D10"],
    language: "salary increment, bonus, payout, income improvement",
  },

  foreign_move: {
    houses: [12, 9, 4],
    supportHouses: [3],
    karakas: ["Rahu", "Moon", "Saturn"],
    divisionalCharts: ["D4", "D9"],
    language: "foreign relocation, visa movement, settlement shift, overseas move",
  },

  health_recovery: {
    houses: [1, 6],
    supportHouses: [8, 12],
    karakas: ["Sun", "Moon", "Saturn"],
    divisionalCharts: ["D30"],
    language: "health recovery, routine correction, diagnosis clarity, improvement",
  },
};
/* --------------------------------------------------
   Small helpers
-------------------------------------------------- */
const SIGN_TO_NUM: Record<string, number> = {
  Aries: 1,
  Taurus: 2,
  Gemini: 3,
  Cancer: 4,
  Leo: 5,
  Virgo: 6,
  Libra: 7,
  Scorpio: 8,
  Sagittarius: 9,
  Capricorn: 10,
  Aquarius: 11,
  Pisces: 12,
};

function getHouseFromLagnaSign(
  lagnaSign: string | null | undefined,
  transitSign: string | null | undefined
): number | null {
  const lagnaNum = SIGN_TO_NUM[String(lagnaSign ?? "").trim()];
  const transitNum = SIGN_TO_NUM[String(transitSign ?? "").trim()];

  if (!lagnaNum || !transitNum) return null;

  return ((transitNum - lagnaNum + 12) % 12) + 1;
}
function sameISODate(a: any, b: string): boolean {
  return String(a ?? "").slice(0, 10) === b;
}

function pickDailyRowForDate(report: any, dateISO: string): any {
  const candidates = [
    report?.dailyPanchang,
    report?.todayPanchang,
    report?.tomorrowPanchang,
    report?.panchang,
    report?.panchangToday,
    report?.panchangTomorrow,
  ].filter(Boolean);

  for (const row of candidates) {
    const rowDate =
      row?.dateISO ??
      row?.date ??
      row?.dayISO ??
      row?.forDate ??
      row?.resolvedDateISO;

    if (sameISODate(rowDate, dateISO)) return row;
  }

  const arrays = [
    report?.dailyPanchangList,
    report?.panchangDays,
    report?.panchangTimeline,
    report?.dailyGuides,
  ].filter(Array.isArray);

  for (const arr of arrays) {
    const found = arr.find((row: any) =>
      sameISODate(
        row?.dateISO ?? row?.date ?? row?.dayISO ?? row?.forDate,
        dateISO
      )
    );
    if (found) return found;
  }

  return null;
}
function getNakshatraDailyTheme(nakshatra: string | null): string | null {
  const n = String(nakshatra ?? "").trim();

  const map: Record<string, string> = {
    "Uttara Bhadrapada":
      "Uttara Bhadrapada supports patience, depth, emotional maturity, and steady completion rather than impulsive action.",
    Revati:
      "Revati supports closure, safe movement, guidance, travel, compassion, and finishing things cleanly.",
    "Purva Bhadrapada":
      "Purva Bhadrapada can bring intensity, conviction, and deep thinking, but it is better handled with emotional control.",
    "Purva Phalguni":
      "Purva Phalguni supports comfort, creativity, enjoyment, relationships, and ease, but can reduce discipline if overindulged.",
  };

  return map[n] ?? null;
}
function addDaysISO(baseISO: string, days: number): string {
  const [y, m, d] = String(baseISO)
    .slice(0, 10)
    .split("-")
    .map(Number);

  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);
}

function resolveDailyDate(question: string, report: any): {
  dateISO: string;
  label: "today" | "tomorrow" | "specific_date";
} {
  const q = question.toLowerCase();

  const todayISO =
    safeStr(report?.todayISO) ||
    safeStr(report?.resolvedTodayISO) ||
    new Date().toISOString().slice(0, 10);

  if (/\btomorrow\b/.test(q)) {
    return {
      dateISO: addDaysISO(todayISO, 1),
      label: "tomorrow",
    };
  }

  return {
    dateISO: todayISO,
    label: "today",
  };
}
function getMoonHouseDailyTheme(house: number): string {
  const map: Record<number, string> = {
    1: "Use the day for self-focus, personal clarity, health rhythm, and emotional grounding.",
    2: "Use the day for money decisions, food discipline, family conversations, and careful speech.",
    3: "Use the day for communication, writing, short tasks, calls, courage, and follow-ups.",
    4: "Use the day for home matters, emotional stability, rest, mother/family themes, and inner peace.",
    5: "Use the day for learning, children, creativity, planning, and intelligent decision-making.",
    6: "Use the day for work discipline, routine correction, health habits, problem-solving, and clearing pending issues.",
    7: "Use the day for conversations, partnerships, client matters, agreements, and relationship balance.",
    8: "Use the day for research, introspection, caution, hidden matters, and avoiding unnecessary risks.",
    9: "Use the day for guidance, learning, spiritual practice, long-term thinking, and blessings from mentors.",
    10: "Use the day for career, responsibility, visibility, decisions, and public-facing work.",
    11: "Use the day for gains, networking, friends, visibility, and long-term plans.",
    12: "Use the day for rest, closure, spiritual practice, reduced noise, and conserving energy.",
  };

  return map[house] ?? "Use the day for steady, practical action.";
}
async function buildDailyAstroContext(
  question: string,
  report: any,
  profile: NormalizedProfile | null
): Promise<DailyAstroContext> {
  const resolved = resolveDailyDate(question, report);
  const activeDasha = getActiveDashaAnyShape(report);

 const timezone =
  profile?.place?.tz ||
  report?.birth?.tz ||
  report?.birthData?.tz ||
  "Asia/Dubai";

const lat =
  Number(profile?.place?.lat ?? report?.birth?.lat ?? report?.birthData?.lat);

const lon =
  Number(profile?.place?.lon ?? report?.birth?.lon ?? report?.birthData?.lon);

let panchangSource: any = null;

if (Number.isFinite(lat) && Number.isFinite(lon)) {
  panchangSource = await buildPanchangData({
    dateISO: resolved.dateISO,
    timezone,
    lat,
    lon,
  });
}
if (!panchangSource) {
  console.warn(
    "[DAILY_ASTRO_CONTEXT] No date-matched panchang found for",
    resolved.dateISO
  );
}
 const moonTransit =
  report?.dailyTransit?.moon ??
  report?.dailyTransits?.moon ??
  report?.transits?.Moon ??
  report?.transits?.moon ??
  report?.currentTransits?.Moon ??
  report?.currentTransits?.moon ??
  report?.todayTransits?.Moon ??
  report?.todayTransits?.moon ??
  report?.moonTransit ??
  report?.panchang?.moon ??
  report?.dailyPanchang?.moon ??
  null;
  const moonSign =
  safeStr(moonTransit?.sign) ||
  safeStr(moonTransit?.rashi) ||
  safeStr(moonTransit?.moonSign) ||
  safeStr(panchangSource?.moonSign) ||
  safeStr(panchangSource?.rashi) ||
  null;
  
const p: any = profile;

const lagnaSign =
  safeStr(p?.ascendant?.sign) ||
  safeStr(p?.ascendantSign) ||
  safeStr(p?.lagnaSign) ||
  safeStr(report?.ascendant?.sign) ||
  safeStr(report?.ascendantSign) ||
  safeStr(report?.lagnaSign) ||
  safeStr(report?.natal?.ascendant?.sign) ||
  safeStr(report?.natal?.ascendantSign) ||
  safeStr(report?.lagna?.sign) ||
  safeStr(report?.lagna?.rashi) ||
  safeStr(report?.birthChart?.ascendant?.sign) ||
  safeStr(report?.birthChart?.lagna?.sign) ||
  safeStr(report?.chart?.ascendant?.sign) ||
  safeStr(report?.chart?.lagna?.sign) ||
  safeStr(report?.birth?.ascendantSign) ||
  safeStr(report?.birth?.lagnaSign) ||
  null;
  const fallbackLagnaSign =
  lagnaSign ||
  safeStr(report?.baseChartFactors?.ascendant?.sign) ||
  safeStr(report?.baseChartFactors?.lagnaSign) ||
  safeStr(report?.baseChartFactors?.identity?.ascSign) ||
  null;
const moonHouseFromLagna =
  getHouseFromLagnaSign(fallbackLagnaSign, moonSign);
  const moonHouse =
  moonHouseFromLagna ??
  Number(moonTransit?.houseFromLagna ?? moonTransit?.house ?? NaN);

  const moonTheme =
    Number.isFinite(moonHouse)
      ? getMoonHouseDailyTheme(moonHouse)
      : "The day is better read through steady pacing and emotional balance.";


const moonNakshatra =
  safeStr(moonTransit?.nakshatra) ||
  safeStr(moonTransit?.nakshatraName) ||
  safeStr(moonTransit?.star) ||
  safeStr(panchangSource?.nakshatra) ||
  safeStr(panchangSource?.nakshatraName) ||
  null;

const nakshatraTheme =
  getNakshatraDailyTheme(moonNakshatra);

  return {
    dateISO: resolved.dateISO,
    label: resolved.label,
    location:
      safeStr(report?.birth?.placeName) ||
      safeStr(report?.birth?.location) ||
      undefined,

  panchang: {
  tithi: safeStr(panchangSource?.tithi) || null,
  nakshatra: safeStr(panchangSource?.nakshatra) || null,
  yoga: safeStr(panchangSource?.yoga) || null,
  karana: safeStr(panchangSource?.karana) || null,
  rahuKaal: panchangSource?.rahuKaal
    ? `${panchangSource.rahuKaal.start} – ${panchangSource.rahuKaal.end}`
    : null,
  abhijitMuhurta: panchangSource?.abhijitMuhurat
    ? `${panchangSource.abhijitMuhurat.start} – ${panchangSource.abhijitMuhurat.end}`
    : null,
},

   moon: {
  sign: moonSign,
  nakshatra: moonNakshatra,
  houseFromLagna: Number.isFinite(moonHouse) ? moonHouse : null,
  moodTheme: moonTheme,
},

    activeDasha: {
      md: activeDasha.md ?? null,
      ad: activeDasha.ad ?? null,
      pd: activeDasha.pd ?? null,
      line: activeDasha.line ?? null,
    },

    dailyJudgement: {
      verdict:
        resolved.label === "tomorrow"
          ? "Tomorrow looks steady and manageable rather than dramatic."
          : "Today looks steady and manageable rather than dramatic.",
      bestUse:
  nakshatraTheme || moonTheme,
      avoid: "Avoid rushing decisions, emotional overreaction, or scattering your attention.",
      astrologyReason:
  [
    moonNakshatra ? `Moon nakshatra: ${moonNakshatra}` : "",
    nakshatraTheme ? `Nakshatra theme: ${nakshatraTheme}` : "",
    moonSign ? `Moon sign: ${moonSign}` : "",
    Number.isFinite(moonHouse)
      ? `Moon is influencing house ${moonHouse} from the ascendant.`
      : "",
    activeDasha.line ? `Dasha sequence: ${activeDasha.line}` : "",
    panchangSource?.tithi ? `Tithi: ${panchangSource.tithi}` : "",
  ]
    .filter(Boolean)
    .join(" "),
      confidence:
        moonTransit || panchangSource
          ? fallbackLagnaSign
            ? "Medium"
            : "Low"
          : "Low",
    },
  };
}
function getDecisionHumanReason(topic: string, verdict: string): string {
  const t = topic.toLowerCase();

  const reasons: Record<string, string> = {
    vehicle:
      "This period favors research, comparison, negotiation, and preparation more than final commitment.",

    property:
      "This period favors searching, shortlisting, paperwork, and planning more than final closure.",

    career:
      "This period favors visibility, preparation, and responsibility-building more than a clean external jump.",

    money:
      "This period favors improving cash flow, negotiating carefully, and controlling leakage more than expecting one sudden financial jump.",

    relationships:
      "This period favors emotional clarity, steady conversations, and observing consistency more than forcing a final commitment.",

    marriage:
      "This period favors family discussions, clarity, and emotional maturity more than rushing into a final commitment.",

    health:
      "This period favors routine correction, rest, and preventive care more than aggressive action or quick fixes.",

    relocation:
      "This period favors planning, paperwork, and comparing options more than forcing a sudden move.",

    disputes:
      "This period favors documentation, negotiation, and calm handling more than direct confrontation.",

    child:
      "This period favors preparation, medical clarity, and family planning more than forcing quick outcomes.",

    inner:
      "This period favors reflection, grounding, and inner clarity more than forcing immediate answers.",

    generic:
      "This period favors preparation, clarity, and steady action more than rushing into a final decision.",
  };

  return reasons[t] ?? reasons.generic;
}
function buildUniversalAstroJudgement(
  topic: AskSarathiDomain,
  questionType: AskSarathiQuestionType,
  answerMode: AnswerMode,
  astroBundle: GenericAstroBundle
): UniversalAstroJudgement {
  const timingText = [
    astroBundle.timingLayer?.summary,
    astroBundle.timingPolicy?.note,
    astroBundle.timingConfidenceNote,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const confidence = astroBundle.confidence ?? "Medium";
  const why: string[] = [];

if (astroBundle.promiseLayer?.summary) {
  why.push(`Promise layer: ${astroBundle.promiseLayer.summary}`);
}

if (astroBundle.divisionalLayer?.summary) {
  why.push(`Divisional support: ${astroBundle.divisionalLayer.summary}`);
}

if (astroBundle.karakaLayer?.summary) {
  why.push(`Karaka support: ${astroBundle.karakaLayer.summary}`);
}

if (astroBundle.timingLayer?.summary) {
  why.push(`Timing layer: ${astroBundle.timingLayer.summary}`);
}

if (astroBundle.timingPolicy?.note) {
  why.push(`Timing policy: ${astroBundle.timingPolicy.note}`);
}

if (astroBundle.timingConfidenceNote) {
  why.push(`Timing confidence: ${astroBundle.timingConfidenceNote}`);
}

if (astroBundle.currentDasha?.line) {
  why.push(`Current dasha: ${astroBundle.currentDasha.line}`);
}
  let verdict = astroBundle.answerSummary || "The chart supports a cautious, steady approach.";
let action = "Move steadily.";
let humanReason = getDecisionHumanReason(topic, verdict);
let astroReason =
  "The chart shows mixed but usable support, so the result depends on timing and practical handling.";

let strongestReason =
  "The timing signals are mixed, so the result is more likely to develop gradually than suddenly.";

if (astroBundle.currentDasha?.line) {
  strongestReason =
    `${getDashaPhrase(astroBundle)} is the background cycle, and it is not showing a sudden change by itself.`;
}

let caution = astroBundle.actionBias?.watchFor || "Avoid rushing the decision.";
let bestUse = astroBundle.actionBias?.bestUse || "Use this phase for preparation and clarity.";

  if (answerMode === "DECISION_FIRST") {
    if (
      timingText.includes("weak") ||
      timingText.includes("not strong") ||
      timingText.includes("mixed") ||
      timingText.includes("building") ||
      timingText.includes("preparation")
    ) {
      verdict = "I would not rush this.";
      action = "Prepare, compare, and wait for clearer confirmation.";
      humanReason = getDecisionHumanReason(topic, verdict);
      astroReason =
        "The relevant indicators are active, but the stronger timing signals still look like they are developing rather than peaking.";
    } else if (
      timingText.includes("strong") ||
      timingText.includes("sharp") ||
      timingText.includes("supported")
    ) {
      verdict = "Yes, this looks reasonable if the practical details are clear.";
      action = "Proceed carefully, but do the final checks first.";
      humanReason = getDecisionHumanReason(topic, verdict);
      astroReason =
        "The relevant chart indicators and timing signals are supporting movement in this area.";
    }
  }

  if (questionType === "timing") {
    verdict = astroBundle.timingWindows?.[0]?.label
      ? `The clearest visible window is ${astroBundle.timingWindows[0].label}.`
      : astroBundle.answerSummary || "The timing is not sharply clear yet.";

    action = "Use the window as guidance, not as a guarantee.";
    humanReason =
      "This looks more like a phase-based timing pattern than a single guaranteed date.";
    astroReason =
      `The timing judgement is based on ${getDashaPhrase(astroBundle)}, relevant houses, divisional support, and transit triggers.`;
  }

  if (questionType === "diagnosis") {
    verdict =
      astroBundle.insightProfile?.headline ||
      astroBundle.answerSummary ||
      "The chart shows a pattern that needs diagnosis rather than a yes-or-no answer.";

    action = "Understand the blocker first, then act with better timing.";
    humanReason =
      astroBundle.insightProfile?.coreMessage ||
      "The issue is less about one event and more about how promise, timing, and blockers are interacting.";
    astroReason =
      "The diagnosis comes from the promise layer, timing layer, dasha-period support, divisional confirmation, and conversion blockers.";
  }

  return {
    verdict,
    humanReason,
    astroReason,
    strongestReason,
    why: why.slice(0, 5),
    action,
    caution,
    bestUse,
    confidence,
  };
}
function buildJudgementLayer(
  topic: string,
  questionType: string,
  astroBundle: GenericAstroBundle
) {
  if (questionType !== "decision") {
    return null;
  }

  const timingSummary =
    astroBundle.timingLayer?.summary ?? "";

  let verdict = "Proceed carefully";
  let humanReason = "";
  let astroReason = "";

  if (
    timingSummary.toLowerCase().includes("building") ||
    timingSummary.toLowerCase().includes("mixed")
  ) {
    verdict = "I would wait.";
    humanReason =
  getDecisionHumanReason(topic, verdict);
    astroReason =
      "The relevant indicators are active, but the stronger timing signals are still developing.";
  }

  return {
    verdict,
    humanReason,
    astroReason,
  };
}
function buildConversationPsychology(
  question: string,
  history: any[] = []
): ConversationPsychology {
  const q = question.toLowerCase().trim();

  const explicitFollowup =
    /^(and|also|what about|then|next|same|continue|for this|what about this|when|why|how about)\b/.test(q) ||
    /\b(previous|above|same topic|that question|this period|this window)\b/.test(q);

  const casual =
    /\b(hi|hello|thanks|thank you|ok|okay|got it)\b/.test(q);

  const dailyGuidance =
    /\b(today|tomorrow|daily|wear|color|colour|food|eat|avoid|lucky|mantra|remedy for today|focus today)\b/.test(q);

  const fullAstrology =
    /\b(chart|birth chart|dasha|transit|house|planet|lagna|ascendant|nakshatra|marriage|career|job|promotion|money|property|health|relationship|child|relocation|vehicle)\b/.test(q);

  const anxious =
    /\b(worried|anxious|scared|fear|afraid|stress|stressed|panic)\b/.test(q);

  const frustrated =
    /\b(stuck|delayed|not happening|why not|fed up|tired|ignored|blocked)\b/.test(q);

  const confused =
    /\b(confused|don't understand|not clear|what is happening|lost)\b/.test(q);

  const urgent =
    /\b(urgent|now|immediately|today itself|asap)\b/.test(q);

  let emotionalTone: ConversationPsychology["emotionalTone"] = "neutral";
  if (urgent) emotionalTone = "urgent";
  else if (anxious) emotionalTone = "anxious";
  else if (frustrated) emotionalTone = "frustrated";
  else if (confused) emotionalTone = "confused";

  let userNeed: ConversationPsychology["userNeed"] = "answer";
  if (/\bwhen|timing|which month|which year|window\b/.test(q)) userNeed = "timing";
  else if (/\bwhy|blocked|stuck|delayed|problem|issue\b/.test(q)) userNeed = "diagnosis";
  else if (
  /\bshould i\b/.test(q) ||
  /\bcan i\b/.test(q) ||
  /\bis it a good time\b/.test(q) ||
  /\bworth it\b/.test(q) ||
  /\bbook\b/.test(q) ||
  /\bbuy\b/.test(q) ||
  /\bproceed\b/.test(q)
) userNeed = "decision";
  else if (dailyGuidance) userNeed = "simple_guidance";
  else if (anxious || frustrated || confused) userNeed = "comfort";

  let surfaceIntent: ConversationPsychology["surfaceIntent"] = "unknown";
  if (explicitFollowup) surfaceIntent = "followup";
  else if (dailyGuidance) surfaceIntent = "daily_guidance";
  else if (fullAstrology) surfaceIntent = "astrology_question";
  else if (casual) surfaceIntent = "casual_chat";
  else surfaceIntent = "personal_advice";

  const shouldUsePreviousTopic = explicitFollowup && !dailyGuidance;

  return {
    surfaceIntent,
    emotionalTone,
    userNeed,
    shouldUsePreviousTopic,
    shouldUseFullAstrology: fullAstrology || explicitFollowup,
    answerStyle:
      emotionalTone === "anxious" 
        ? "soft"
        : emotionalTone === "frustrated"
        ? "strategic"
        : dailyGuidance
        ? "simple"
        : "conversational",
    oneLineIntent: dailyGuidance
      ? "User wants simple daily guidance, not a full chart reading."
      : explicitFollowup
      ? "User is continuing the previous topic."
      : fullAstrology
      ? "User wants astrology-backed interpretation."
      : "User wants a natural conversational answer.",
  };
}
function normalizeRoleStyleLabel(roleStyle: string | null | undefined): string {
  const r = String(roleStyle ?? "").trim().toLowerCase();

  if (r === "manager_operator") return "managerial or operational";
  if (r === "advisor_consultant") return "advisory or consultative";
  if (r === "backend_structural") return "backend, structural, or systems-oriented";
  if (r === "decision_maker") return "decision-making";
  if (r === "owner_operator") return "ownership-led or entrepreneurial";
  if (r === "client_facing") return "client-facing";
  if (r === "manager") return "managerial";

  return r.replace(/_/g, " ");
}
function buildActionBias(params: {
  topic: AskSarathiDomain;
  timingLayer: AnalysisLayer;
  timingPolicy?: {
    dashaStrength: "strong" | "moderate" | "mixed" | "weak";
    transitStrength: "strong" | "moderate" | "mixed" | "weak";
    allowSharpWindow: boolean;
  };
  divisionalBreakdown?: {
    chart: string;
    strength: AnalysisLayer["verdict"];
    weight: number;
  }[];
}): { bestUse: string; watchFor: string } {
  const { topic, timingPolicy } = params;

  if (topic === "money") {
    return {
      bestUse: "Use this phase to increase income through additional work, negotiate better terms, or improve consistency in earnings.",
      watchFor: "Avoid expecting a sudden financial jump or relying on one big opportunity.",
    };
  }

  if (topic === "career") {
    return {
      bestUse: "Take on visibility, accept added responsibility, and position yourself for future growth.",
      watchFor: "Avoid pushing aggressively for promotion if the signal is not strong yet.",
    };
  }

  if (topic === "relationships" || topic === "marriage") {
    return {
      bestUse: "Stay open to connection, deepen conversations, and allow bonds to develop naturally.",
      watchFor: "Avoid forcing commitment or overinterpreting early signals.",
    };
  }

  if (topic === "health") {
    return {
      bestUse: "Focus on routine correction, rest, and consistency in sleep, diet, and stress management.",
      watchFor: "Avoid ignoring small symptoms or overreacting to temporary fluctuations.",
    };
  }

  if (topic === "property") {
    return {
      bestUse: "Use this phase for research, planning, and preparation rather than rushing into decisions.",
      watchFor: "Avoid committing too quickly without clarity or proper groundwork.",
    };
  }

  return {
    bestUse: "Use this phase to move forward steadily and stay responsive to opportunities.",
    watchFor: "Avoid rushing decisions or expecting immediate results.",
  };
}
function buildHumanEvidenceLine(
  topic: AskSarathiDomain,
  rule: TopicRule,
  timingPolicy?: {
    dashaStrength: "strong" | "moderate" | "mixed" | "weak";
    transitStrength: "strong" | "moderate" | "mixed" | "weak";
    allowSharpWindow: boolean;
    note: string;
  }
): string {
  const houseText = `${rule.houses.join(", ")}${
    rule.supportHouses?.length ? ` with support from ${rule.supportHouses.join(", ")}` : ""
  }`;

  if (topic === "career") {
    return "Career growth houses are active, but title-elevation and reward signals are still developing.";
  }

  if (topic === "money") {
    return "Income and gains houses are being checked for cash flow, stability, and reward potential.";
  }

  if (topic === "relationships") {
    return "Relationship houses are being checked for attraction, emotional stability, and long-term compatibility.";
  }

  if (topic === "marriage") {
    return "Marriage houses are being checked for commitment potential, family support, and timing readiness.";
  }

  if (topic === "health") {
    return "Health houses are being checked for stress patterns, recovery capacity, and routine correction.";
  }

  if (topic === "property") {
    return "Property and home indicators are being checked for settlement, comfort, asset movement, and timing support.";
  }

  if (topic === "relocation") {
    return "Relocation indicators are being checked for movement, settlement change, foreign links, and emotional readiness.";
  }

  if (topic === "vehicle") {
    return "Vehicle indicators are being checked for comfort, purchase timing, and practical readiness.";
  }

  if (topic === "disputes") {
    return "Dispute houses are being checked for conflict pressure, negotiation strength, and resolution potential.";
  }

  if (topic === "child") {
    return "Children-related houses are being checked for family expansion, responsibility, and supportive timing.";
  }

  if (topic === "inner") {
    return "Inner-growth houses are being checked for emotional release, spiritual direction, and clarity of purpose.";
  }

  return houseText
  ? `Relevant houses checked → ${houseText}`
  : "Relevant life areas are being checked for timing, emotional patterns, and practical activation.";
}
function buildEventHints(
  topic: AskSarathiDomain,
  questionType: AskSarathiQuestionType,
  timingLayer: AnalysisLayer,
  timingPolicy?: {
    dashaStrength: "strong" | "moderate" | "mixed" | "weak";
    transitStrength: "strong" | "moderate" | "mixed" | "weak";
    allowSharpWindow: boolean;
    note: string;
  },
  divisionalBreakdown?: {
    chart: string;
    strength: AnalysisLayer["verdict"];
    weight: number;
  }[]
): string[] {
  if (topic === "career") {
    return [
      "role change or expanded responsibility",
      "internal movement or team shift",
      "higher visibility without immediate title change",
    ];
  }

  if (topic === "relationships" || topic === "marriage") {
    return [
      "meeting someone or opening a new connection",
      "deeper conversations or emotional closeness",
      "commitment discussions or relationship uncertainty",
    ];
  }

  if (topic === "money") {
    return [
      "gradual increase in income or cash flow",
      "extra income through side work, bonus, or delayed payout",
      "financial pressure easing slowly rather than suddenly",
    ];
  }

  if (topic === "health") {
    return [
      "low energy or sleep disruption",
      "stress-related imbalance or fluctuating symptoms",
      "need for routine correction and recovery",
    ];
  }

  if (topic === "property") {
    return [
      "active search or shortlisting",
      "paperwork or delay before closure",
      "movement around home, settlement, or relocation decisions",
    ];
  }

  return ["movement in this area of life", "gradual change rather than sudden event"];
}
function getHouseLordMap(report: any): Record<string, any> {
  return (
    report?.houseLords ??
    report?.natal?.houseLords ??
    {}
  );
}
function safePlanetName(x: any): string | null {
  const s = safeStr(x);
  if (!s) return null;

  // normalize capitalization
  const p = s.toLowerCase();

  const map: Record<string, string> = {
    sun: "Sun",
    moon: "Moon",
    mars: "Mars",
    mercury: "Mercury",
    venus: "Venus",
    jupiter: "Jupiter",
    saturn: "Saturn",
    rahu: "Rahu",
    ketu: "Ketu",
  };

  return map[p] ?? s;
}
function getCurrentAge(report: any): number | undefined {
  const birthYear = getBirthYear(report);
  if (!birthYear) return undefined;

  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}
function getBirthYear(report: any): number | null {
  const candidates = [
    report?.birth?.dateISO,
    report?.birth?.dobISO,
    report?.birthData?.dateISO,
    report?.birthData?.dobISO,
    report?.profile?.dobISO,
    report?.profile?.dateISO,
    report?.native?.dobISO,
    report?.dobISO,
    report?.dateISO,
  ];

  for (const raw of candidates) {
    const s = safeStr(raw);
    const year = Number(s.slice(0, 4));
    if (Number.isFinite(year) && year > 1900 && year < 2100) {
      return year;
    }
  }

  return null;
}
function getAgeAtYear(report: any, year: number): number | null {
  const birthYear = getBirthYear(report);
  if (!Number.isFinite(birthYear as number)) return null;
  return year - (birthYear as number);
}

function getMarriageAgeWeight(age: number | null): number {
  if (age == null) return 0.8;
  if (age >= 24 && age <= 36) return 1.0;
  if (age >= 20 && age <= 40) return 0.85;
  if (age >= 18 && age <= 45) return 0.65;
  return 0.25;
}
function getTodayISOForTiming(report: any): string {
  const raw =
    safeStr(report?.todayISO) ||
    safeStr(report?.resolvedTodayISO) ||
    new Date().toISOString().slice(0, 10);

  return raw;
}
function normalizeTimeKey(x: any): string {
  const s = String(x ?? "").trim();
  if (!s) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (/^\d{4}-\d{2}$/.test(s)) return `${s}-01`;
  if (/^\d{4}$/.test(s)) return `${s}-01-01`;

  const d = new Date(s);
  if (!Number.isNaN(+d)) return d.toISOString().slice(0, 10);

  return "";
}

function isPastWindow(row: any, todayISO: string): boolean {
  const todayKey = normalizeTimeKey(todayISO);
  const endKey = normalizeTimeKey(row?.end ?? row?.to ?? row?.endISO ?? row?.peak ?? row?.start);
  if (!todayKey || !endKey) return false;
  return endKey < todayKey;
}

function isFutureWindow(row: any, todayISO: string): boolean {
  const todayKey = normalizeTimeKey(todayISO);
  const startKey = normalizeTimeKey(row?.start ?? row?.from ?? row?.startISO ?? row?.peak ?? row?.end);
  if (!todayKey || !startKey) return false;
  return startKey >= todayKey;
}
function buildBroadFutureWindows(
  report: any,
  topic: AskSarathiDomain,
  eventScale: EventScale
): TimingWindow[] {
  const out: TimingWindow[] = [];
  const todayISO = getTodayISOForTiming(report);

  const eventMonthTimeline = Array.isArray(report?.eventMonthTimeline)
    ? report.eventMonthTimeline.filter((row: any) => isFutureWindow(row, todayISO))
    : [];

  const eventTimeline = Array.isArray(report?.eventTimeline)
    ? report.eventTimeline.filter((row: any) => isFutureWindow(row, todayISO))
    : [];

  for (const row of eventTimeline.slice(0, 2)) {
    out.push({
      label: `${row.start} to ${row.end}`,
      start: row.start != null ? String(row.start) : null,
      end: row.end != null ? String(row.end) : null,
      peak: row.peak != null ? String(row.peak) : null,
      why: [row.peak ? `Peak year around ${row.peak}` : "Broader event phase"],
    });
  }

  if (!out.length) {
    for (const row of eventMonthTimeline.slice(0, 2)) {
      out.push({
        label: `${formatMonthLabel(row.start)} to ${formatMonthLabel(row.end)}`,
        start: row.start,
        end: row.end,
        peak: row.peak,
        why: [`Peak trigger around ${formatMonthLabel(row.peak)}`],
      });
    }
  }

  return out.slice(0, 2);
}
function buildNextLogicalTimingWindows(params: {
  report: any;
  topic: AskSarathiDomain;
  rule: TopicRule;
  eventType?: AskSarathiEventType;
  careerEventType?: CareerEventType;
  eventScale: EventScale;
}): TimingWindow[] {
  const { report, topic, rule, eventType, careerEventType, eventScale } = params;
  const todayISO = getTodayISOForTiming(report);
  const todayKey = normalizeTimeKey(todayISO);

  const out: TimingWindow[] = [];

  const addWindow = (w: TimingWindow | null) => {
    if (!w?.label) return;
    const startKey = normalizeTimeKey(w.start ?? w.peak ?? w.end);
    if (startKey && todayKey && startKey < todayKey) return;

    const exists = out.some((x) => x.label === w.label);
    if (!exists) out.push(w);
  };

  const active = getActiveDashaAnyShape(report);

  const normalizeDashaRows = (rows: any[], level: "md" | "ad" | "pd") =>
  rows.map((row) => ({
    ...row,
    _level: level,
    _sortDate: normalizeTimeKey(row?.startISO ?? row?.start ?? row?.from),
  }));

const dashaRoot =
  report?.dasha ??
  report?.chartContext?.dasha ??
  report?.dataEngine?.dasha ??
  null;

const dashaRows = [
  ...normalizeDashaRows(
    Array.isArray(dashaRoot?.timelines?.pd) ? dashaRoot.timelines.pd : [],
    "pd"
  ),
  ...normalizeDashaRows(
    Array.isArray(dashaRoot?.timelines?.ad) ? dashaRoot.timelines.ad : [],
    "ad"
  ),
  ...normalizeDashaRows(
    Array.isArray(dashaRoot?.timelines?.md) ? dashaRoot.timelines.md : [],
    "md"
  ),
].sort((a, b) => {
  const aDate = a._sortDate || "9999-12-31";
  const bDate = b._sortDate || "9999-12-31";

  const levelWeight: Record<string, number> = {
    pd: 1,
    ad: 2,
    md: 3,
  };

  if (aDate === bDate) {
    return levelWeight[a._level] - levelWeight[b._level];
  }

  return aDate.localeCompare(bDate);
});



  const relevantPlanets = uniq([
    ...(rule.karakas ?? []),
    active?.md,
    active?.ad,
    active?.pd,
  ].filter(Boolean) as string[]);

  for (const row of dashaRows) {
  const start = row?.startISO ?? row?.start ?? row?.from;
  const end = row?.endISO ?? row?.end ?? row?.to;

  const startKey = normalizeTimeKey(start);
  if (!startKey || startKey < todayKey) continue;

  // Do not let very far future dasha rows crowd timing logic.
  // For normal timing questions, keep the next 3 years only.
  const maxFutureKey = addDaysISO(todayISO, 365 * 3);
  if (startKey > maxFutureKey) continue;

  const planet =
    row?._level === "pd"
      ? safePlanetName(
          row?.pratyantarLord ??
            row?.pdLord ??
            row?.pd ??
            row?.lord
        )
      : row?._level === "ad"
      ? safePlanetName(
          row?.antarLord ??
            row?.adLord ??
            row?.ad ??
            row?.lord
        )
      : safePlanetName(
          row?.mahaLord ??
            row?.mdLord ??
            row?.md ??
            row?.lord
        );

  if (!planet || !relevantPlanets.includes(planet)) continue;

  // Temporary focused debug only for Jan-Feb 2027.
  // Remove after confirming dasha row accuracy.
  const isJanFeb2027Window =
    startKey >= "2027-01-01" && startKey <= "2027-02-28";

  if (isJanFeb2027Window) {
    console.log(
      "[JAN/FEB 2027 DASHA WINDOW PICK]",
      JSON.stringify(
        {
          level: row?._level,
          label: row?.label,
          mahaLord: row?.mahaLord,
          antarLord: row?.antarLord,
          pratyantarLord: row?.pratyantarLord,
          md: row?.md,
          ad: row?.ad,
          pd: row?.pd,
          lord: row?.lord,
          pickedPlanet: planet,
          start,
          end,
        },
        null,
        2
      )
    );
  }

  // Avoid using very broad MD rows when nearer AD/PD rows already exist.
  if (row?._level === "md" && out.length > 0) continue;

  addWindow({
  label: `${fmtDateShort(start)} to ${fmtDateShort(end)} ${planet} ${String(row?._level ?? "").toUpperCase()} timing shift`,
  start: start ? String(start) : null,
  end: end ? String(end) : null,
  peak: start ? String(start) : null,
  why: [
    `${planet} is relevant to ${topic} through karaka/dasha linkage.`,
    "Upcoming dasha or sub-period change can reopen timing discussion.",
  ],

  dashaLord: planet,

  dashaLevel:
    row?._level === "md" || row?._level === "ad" || row?._level === "pd"
      ? row._level
      : null,

  dashaChainLabel:
    row?.label ??
    [row?.mahaLord, row?.antarLord, planet]
      .filter(Boolean)
      .join(" / "),
});
}
  const monthRows = [
  ...(Array.isArray(report?.triggerEngine?.degreeHitWindows)
    ? report.triggerEngine.degreeHitWindows
    : []),

  ...(Array.isArray(report?.triggerEngine?.microTriggerDays)
    ? report.triggerEngine.microTriggerDays
    : []),

  ...(Array.isArray(report?.transits?.transitWindows)
    ? report.transits.transitWindows
    : []),
];

  const topicWords = [
    topic,
    eventType,
    careerEventType,
    ...rule.karakas,
    ...rule.houses.map((h) => `H${h}`),
    ...(rule.supportHouses ?? []).map((h) => `H${h}`),
  ]
    .filter(Boolean)
    .map((x) => String(x).toLowerCase());

  for (const row of monthRows) {
    const rawText = JSON.stringify(row).toLowerCase();

    const hasTopicSignal = topicWords.some((w) => rawText.includes(w));
    if (!hasTopicSignal) continue;

    const start = row?.start ?? row?.from ?? row?.startISO ?? row?.month ?? row?.date;
    const end = row?.end ?? row?.to ?? row?.endISO ?? row?.month ?? row?.date;
    const peak = row?.peak ?? row?.peakISO ?? row?.month ?? row?.date;

    const startKey = normalizeTimeKey(start ?? peak);
    if (!startKey || startKey < todayKey) continue;

    const label =
      row?.label ||
      (start && end
        ? `${formatMonthLabel(String(start))} to ${formatMonthLabel(String(end))}`
        : peak
        ? `${formatMonthLabel(String(peak))}`
        : "Future watch window");

    addWindow({
      label,
      start: start ? String(start) : null,
      end: end ? String(end) : null,
      peak: peak ? String(peak) : null,
      why: [
        "Future timeline/transit data contains relevant topic, house, or karaka signal.",
        `Relevant factors checked: ${topicWords.slice(0, 8).join(", ")}.`,
      ],
    });
  }

  return out.slice(0, eventScale === "major" ? 2 : 3);
}

function buildUniversalEventTriggers(params: {
  report: any;
  topic: AskSarathiDomain;
  eventType?: AskSarathiEventType;
  rule: TopicRule;
  timingPolicy: GenericAstroBundle["timingPolicy"];
  promiseLayer: AnalysisLayer;
  divisionalLayer: AnalysisLayer;
  karakaLayer: AnalysisLayer;
}): UniversalEventTrigger[] {
  const {
    report,
    topic,
    eventType,
    rule,
    timingPolicy,
    promiseLayer,
    divisionalLayer,
    karakaLayer,
  } = params;

  const todayISO = getTodayISOForTiming(report);
  const todayKey = normalizeTimeKey(todayISO);
  const conversionRule = resolveEventConversionRule(topic, eventType, rule);

  const sourceRows = [
    ...(Array.isArray(report?.triggerEngine?.degreeHitWindows)
      ? report.triggerEngine.degreeHitWindows
      : []),
    ...(Array.isArray(report?.triggerEngine?.microTriggerDays)
      ? report.triggerEngine.microTriggerDays
      : []),
    ...(Array.isArray(report?.transits?.transitWindows)
      ? report.transits.transitWindows
      : []),
    ...(Array.isArray(report?.transitWindows)
      ? report.transitWindows
      : []),
    ...(Array.isArray(report?.topTransits)
      ? report.topTransits
      : []),
  ];

  const out: UniversalEventTrigger[] = [];

  for (const row of sourceRows) {
    const raw = JSON.stringify(row).toLowerCase();

    const date =
      row?.date ??
      row?.dateISO ??
      row?.peak ??
      row?.peakISO ??
      row?.start ??
      row?.startISO ??
      row?.month;

    const dateKey = normalizeTimeKey(date);
    if (!dateKey || dateKey < todayKey) continue;

    const rowHouseSignals = [
  row?.house,
  row?.houseFromLagna,
  row?.houseFromMoon,
  row?.transitHouse,
  row?.natalHouse,
  row?.fromHouse,
  row?.toHouse,
]
  .map((x) => Number(x))
  .filter((x) => Number.isFinite(x));

const requiredHouses = [
  ...conversionRule.houses,
  ...conversionRule.supportHouses,
];

const hasHouseSignal =
  rowHouseSignals.some((h) => requiredHouses.includes(h)) ||
  requiredHouses.some(
    (h) =>
      raw.includes(`"h${h}"`) ||
      raw.includes(`"house":${h}`) ||
      raw.includes(`"housefromlagna":${h}`) ||
      raw.includes(`house ${h}`)
  );

    const hasKarakaSignal = conversionRule.karakas.some((p) =>
      raw.includes(String(p).toLowerCase())
    );

    const hasDivisionalSignal = conversionRule.divisionalCharts.some((d) =>
      raw.includes(String(d).toLowerCase())
    );

    if (!hasHouseSignal && !hasKarakaSignal && !hasDivisionalSignal) continue;

    let score = 0;

if (hasHouseSignal) score += 35;
if (hasKarakaSignal) score += 15;
if (hasDivisionalSignal) score += 20;
const hasCareerHouse =
  raw.includes("housefromlagna\":10") ||
  raw.includes("housefromlagna\":11") ||
  raw.includes("\"house\":10") ||
  raw.includes("\"house\":11");

if (
  topic === "career" &&
  eventType === "promotion" &&
  !hasCareerHouse
) {
  continue;
}
const promotionPlanetMatch =
  ["Sun", "Jupiter"].includes(
    String(row?.planet || row?.transitPlanet || "")
  );

if (
  topic === "career" &&
  eventType === "promotion"
) {
  if (!hasCareerHouse) continue;

  if (!promotionPlanetMatch) continue;
}
    if (timingPolicy.dashaStrength === "strong") score += 15;
    else if (timingPolicy.dashaStrength === "moderate") score += 10;
    else if (timingPolicy.dashaStrength === "mixed") score += 5;

    if (timingPolicy.transitStrength === "strong") score += 15;
    else if (timingPolicy.transitStrength === "moderate") score += 10;
    else if (timingPolicy.transitStrength === "mixed") score += 5;

    if (promiseLayer.verdict === "strong") score += 8;
    if (divisionalLayer.verdict === "strong") score += 8;
    if (karakaLayer.verdict === "strong") score += 5;

    const confidence =
      score >= 78 ? "high" : score >= 58 ? "medium" : "low";

    out.push({
      date: String(date),
      topic,
      eventType,
      label:
        row?.label ||
        `${fmtDateShort(String(date))} ${conversionRule.language} trigger`,
      score,
      confidence,
      triggerType: raw.includes("nakshatra")
        ? "nakshatra_ingress"
        : raw.includes("ingress")
        ? "transit_ingress"
        : raw.includes("degree")
        ? "degree_hit"
        : raw.includes("aspect")
        ? "transit_aspect"
        : "transit_conjunction",
      planet:
        safePlanetName(row?.planet) ||
        safePlanetName(row?.transitPlanet) ||
        safePlanetName(row?.lord) ||
        null,
      target:
        safeStr(row?.target) ||
        safeStr(row?.natalPlanet) ||
        safeStr(row?.point) ||
        null,
      houses: conversionRule.houses,
      why: [
        `This trigger matches ${conversionRule.language}.`,
        hasHouseSignal
          ? `Relevant houses activated: ${conversionRule.houses.join(", ")}.`
          : "",
        hasKarakaSignal
          ? `Relevant karakas involved: ${conversionRule.karakas.join(", ")}.`
          : "",
        hasDivisionalSignal
          ? `Relevant divisional chart involved: ${conversionRule.divisionalCharts.join(", ")}.`
          : "",
        `Dasha strength: ${timingPolicy.dashaStrength}. Transit strength: ${timingPolicy.transitStrength}.`,
      ].filter(Boolean),
      practicalMeaning:
        confidence === "high"
          ? `This can support visible ${conversionRule.language}.`
          : confidence === "medium"
          ? `This can support movement, discussion, or activation around ${conversionRule.language}.`
          : `This is a watch trigger for ${conversionRule.language}, not a guaranteed outcome.`,
    });
  }

  return out.sort((a, b) => b.score - a.score).slice(0, 5);
}
function buildWinningEvidence(params: {
  topic: AskSarathiDomain;
  eventType?: AskSarathiEventType;
  bestAvailableWindow?: any;
  strongestWindow?: any;
  nearestWindow?: any;
  promiseLayer: AnalysisLayer;
  divisionalLayer: AnalysisLayer;
  karakaLayer: AnalysisLayer;
  timingLayer: AnalysisLayer;
}) {
  const selectedWindow =
    params.bestAvailableWindow ??
    params.strongestWindow ??
    params.nearestWindow ??
    null;
    const selectedDashaChain =
  selectedWindow?.dashaChainLabel ?? null;
const selectedDashaText =
  selectedWindow?.dashaLord && selectedWindow?.dashaLevel
    ? `${selectedWindow.dashaLord} ${String(selectedWindow.dashaLevel).toUpperCase()}`
    : selectedWindow?.dashaLord
    ? `${selectedWindow.dashaLord}-linked timing`
    : "selected timing";
  const supportingReasons: string[] = [];
  const blockingReasons: string[] = [];

  let primaryReason: string | null = selectedWindow?.label
    ? `This window stands out as the strongest available ${params.topic} timing period: ${selectedWindow.label}.`
    : null;

  if (params.topic === "career" && params.eventType === "promotion") {
    primaryReason = selectedWindow?.label
  ? `This period stands out because the ${selectedDashaChain} window is more supportive for recognition, title movement, and salary review than the periods immediately before it: ${selectedWindow.label}.`
  : `This period stands out because the ${selectedDashaChain} window is more supportive for recognition, title movement, and salary review than the periods immediately before it.`;

    supportingReasons.push(
      "The selected period is more relevant for recognition, title discussion, and salary review than the current phase."
    );
  }

  if (params.topic === "career" && params.eventType === "job_change") {
    primaryReason = selectedWindow?.label
      ? `This period stands out because it shows stronger career mobility and job-change movement than the surrounding periods: ${selectedWindow.label}.`
      : "This period stands out because it shows stronger career mobility and job-change movement than the surrounding periods.";

    supportingReasons.push(
      "The selected period is more relevant for applications, recruiter contact, interviews, or employer movement than the current phase."
    );
  }

  if (params.topic === "vehicle" && params.eventType === "buy_vehicle") {
    primaryReason = selectedWindow?.label
      ? `This period stands out because it shows stronger vehicle-related movement than the surrounding periods: ${selectedWindow.label}.`
      : "This period stands out because it shows stronger vehicle-related movement than the surrounding periods.";

    supportingReasons.push(
      "The selected period is more relevant for shortlisting, negotiation, booking, financing, or delivery movement than the current phase."
    );
  }

  if (params.topic === "property" && params.eventType === "buy_property") {
    primaryReason = selectedWindow?.label
      ? `This period stands out because it shows stronger property-related movement than the surrounding periods: ${selectedWindow.label}.`
      : "This period stands out because it shows stronger property-related movement than the surrounding periods.";

    supportingReasons.push(
      "The selected period is more relevant for property search, paperwork, negotiation, registration, or possession movement than the current phase."
    );
  }

  if (params.promiseLayer?.summary) {
    supportingReasons.push(params.promiseLayer.summary);
  }

  if (
    params.divisionalLayer?.verdict === "strong" ||
    params.divisionalLayer?.verdict === "moderate"
  ) {
    supportingReasons.push(params.divisionalLayer.summary);
  }

  if (
    params.karakaLayer?.verdict === "strong" ||
    params.karakaLayer?.verdict === "moderate"
  ) {
    supportingReasons.push(params.karakaLayer.summary);
  }

  if (
    params.timingLayer?.verdict === "weak" ||
    params.timingLayer?.verdict === "mixed"
  ) {
    blockingReasons.push(
      "The selected window is active, but timing support is not strong enough to call it a guaranteed outcome."
    );
  }

  if (
    params.divisionalLayer?.verdict === "weak" ||
    params.divisionalLayer?.verdict === "unclear"
  ) {
    blockingReasons.push(
      "Divisional confirmation is not strong enough yet for a confident final event."
    );
  }
let strongestSupport: string | null = null;
let strongestBlocker: string | null = null;

if (params.promiseLayer?.bullets?.length) {
  strongestSupport = params.promiseLayer.bullets[0];
}

if (
  !strongestSupport &&
  params.karakaLayer?.bullets?.length
) {
  strongestSupport = params.karakaLayer.bullets[0];
}

if (
  params.divisionalLayer?.verdict === "weak" ||
  params.divisionalLayer?.verdict === "unclear"
) {
  strongestBlocker =
    params.divisionalLayer?.bullets?.[0] ??
    "Divisional confirmation remains incomplete.";
}
  return {
    primaryReason,
    supportingReasons: supportingReasons.slice(0, 3),
    blockingReasons: blockingReasons.slice(0, 3),
    strongestSupport,
    strongestBlocker,
  };
}

function buildWhyNotNow(params: {
  topic: AskSarathiDomain;
  timingLayer: AnalysisLayer;
  promiseLayer: AnalysisLayer;
  divisionalLayer: AnalysisLayer;
  currentDashaLine?: string;
}) {
  const reasons: string[] = [];

  if (
    params.promiseLayer?.verdict === "strong" &&
    (params.timingLayer?.verdict === "weak" ||
      params.timingLayer?.verdict === "mixed")
  ) {
    reasons.push(
      "The chart promise exists, but the current timing layer is not yet strong enough to convert it into a visible outcome."
    );
  }

  if (
    params.divisionalLayer?.verdict === "weak" ||
    params.divisionalLayer?.verdict === "unclear"
  ) {
    reasons.push(
      "The divisional chart confirmation is not clear enough yet for a confident final result."
    );
  }

  if (params.currentDashaLine) {
    reasons.push(
      `The current dasha background is ${params.currentDashaLine}, so the selected future window should be treated as the stronger timing reference.`
    );
  }

  return reasons.slice(0, 3);
}
function buildConversionDiagnosisV2(params: {
  topic: AskSarathiDomain;
  eventType?: AskSarathiEventType;
  promiseLayer: AnalysisLayer;
  divisionalLayer: AnalysisLayer;
  karakaLayer: AnalysisLayer;
  timingLayer: AnalysisLayer;
  bestAvailableWindow?: any;
}) {
  let movementStrength = 0;
  let conversionStrength = 0;
  let blockageStrength = 0;

  const movementReasons: string[] = [];
  const conversionReasons: string[] = [];
  const blockageReasons: string[] = [];

  if (["strong", "moderate"].includes(params.timingLayer.verdict)) {
    movementStrength += 30;
    movementReasons.push("Timing support is active enough to create visible movement.");
  }

  if (["strong", "moderate"].includes(params.promiseLayer.verdict)) {
    movementStrength += 25;
    movementReasons.push("The natal chart supports movement in this area.");
  }

  if (["strong", "moderate"].includes(params.karakaLayer.verdict)) {
    movementStrength += 20;
    movementReasons.push("Relevant karaka support is present.");
  }

  if (params.divisionalLayer.verdict === "strong") {
    conversionStrength += 40;
    conversionReasons.push("Divisional chart confirmation is strong.");
  }

  if (params.promiseLayer.verdict === "strong") {
    conversionStrength += 25;
    conversionReasons.push("The underlying promise can produce a visible outcome.");
  }

  if (params.bestAvailableWindow?.windowClass === "outcome") {
    conversionStrength += 30;
    conversionReasons.push("The selected timing window is classified as an outcome window.");
  }

  if (["weak", "unclear"].includes(params.divisionalLayer.verdict)) {
    blockageStrength += 35;
    blockageReasons.push("Divisional confirmation remains incomplete.");
  }

  if (params.timingLayer.verdict === "mixed") {
  blockageStrength += 20;

  blockageReasons.push(
    "Timing support is not fully aligned with the underlying chart promise."
  );
}

if (params.timingLayer.verdict === "weak") {
  blockageStrength += params.bestAvailableWindow ? 10 : 25;

  blockageReasons.push(
    "Timing support is weaker than the underlying chart promise."
  );
}

if (params.bestAvailableWindow?.windowClass === "movement") {
  movementStrength += 20;
  blockageStrength += 10;

  movementReasons.push(
    "The selected window supports visible movement, discussion, and activation even if final conversion remains incomplete."
  );

  blockageReasons.push(
    "The selected window supports movement more than final conversion."
  );
}

  if (params.topic === "career" && params.eventType === "promotion") {
    movementReasons.unshift(
      "The chart is showing recognition, salary-review, and responsibility movement more clearly than confirmed promotion conversion."
    );
  }

 const verdict: "conversion_favored" | "movement_favored" | "blocked" =
  conversionStrength > blockageStrength
    ? "conversion_favored"
    : movementStrength > conversionStrength
    ? "movement_favored"
    : "blocked";

  return {
    verdict,
    movementStrength,
    conversionStrength,
    blockageStrength,
    movementReasons: movementReasons.slice(0, 4),
    conversionReasons: conversionReasons.slice(0, 4),
    blockageReasons: blockageReasons.slice(0, 4),
  };
}
function buildPromotionConversionEngine(params: {
  promiseLayer: AnalysisLayer;
  divisionalLayer: AnalysisLayer;
  karakaLayer: AnalysisLayer;
  timingLayer: AnalysisLayer;
  bestAvailableWindow?: any;
}) {
  let titleScore = 0;
  let salaryScore = 0;
  let conversionScore = 0;
  let blockerScore = 0;

  const titleReasons: string[] = [];
  const salaryReasons: string[] = [];
  const conversionReasons: string[] = [];
  const blockerReasons: string[] = [];

  if (params.bestAvailableWindow?.windowClass === "movement") {
    titleScore += 25;
    salaryScore += 20;
    titleReasons.push(
  "The selected window supports promotion consideration, title discussion, recognition, management review, and role movement."
);
    salaryReasons.push(
  "The selected window can support salary review, increment discussion, compensation review, or reward conversations."
);  }

  if (params.bestAvailableWindow?.windowClass === "outcome") {
    titleScore += 40;
    salaryScore += 35;
    conversionScore += 35;
    conversionReasons.push("The selected window is strong enough to support formal promotion conversion.");
  }

  if (["strong", "moderate"].includes(params.promiseLayer.verdict)) {
    titleScore += 20;
    salaryScore += 15;
    conversionScore += 15;
    conversionReasons.push("The natal promise supports career growth and reward potential.");
  }

  if (params.divisionalLayer.verdict === "strong") {
    conversionScore += 35;
    conversionReasons.push("D10 confirmation is strong enough to support formal career outcome.");
  }

  if (params.divisionalLayer.verdict === "moderate") {
    conversionScore += 20;
    conversionReasons.push("D10 support is usable but not decisive.");
  }

  if (["weak", "unclear"].includes(params.divisionalLayer.verdict)) {
    blockerScore += 35;
    blockerReasons.push("D10 confirmation is not strong enough for confident title conversion.");
  }

  if (["weak", "mixed"].includes(params.timingLayer.verdict)) {
    blockerScore += 20;
    blockerReasons.push("Timing support is not strong enough to guarantee final promotion or pay conversion.");
  }

  const verdict =
    conversionScore > blockerScore
      ? "promotion_conversion_possible"
      : titleScore > conversionScore || salaryScore > conversionScore
      ? "promotion_movement_likely"
      : "promotion_blocked";

  return {
    verdict,
    titleScore,
    salaryScore,
    conversionScore,
    blockerScore,
    titleReasons,
    salaryReasons,
    conversionReasons,
    blockerReasons,
  };
}
  function classifyTimingWindow(params: {
  topic: AskSarathiDomain;
  eventType?: AskSarathiEventType;
  score: number;
  promiseLayer: AnalysisLayer;
  divisionalLayer: AnalysisLayer;
  karakaLayer: AnalysisLayer;
}): {
  windowClass: TimingWindowClass;
  practicalMeaning: string;
} {
  const { topic, eventType, score } = params;

  const strong = score >= 70;
  const medium = score >= 50;
const hasOutcomeSupport =
  params.promiseLayer.verdict === "strong" ||
  params.divisionalLayer.verdict === "strong";

const hasModerateOutcomeSupport =
  params.promiseLayer.verdict === "moderate" ||
  params.divisionalLayer.verdict === "moderate" ||
  params.karakaLayer.verdict === "moderate";
  if (topic === "career") {
  const isPromotion =
    eventType === "promotion" ||
    eventType === "salary_increase";

  const isJobChange =
    eventType === "job_change" ||
    eventType === "career_movement";

  if (strong && hasOutcomeSupport) {
    return {
      windowClass: "outcome",
      practicalMeaning: isPromotion
        ? "This can support formal promotion conversion such as title elevation, recognition, salary increment, or role upgrade."
        : isJobChange
        ? "This can support external job movement such as interviews, offer movement, resignation thinking, or employer change."
        : "This can support formal career conversion such as promotion, title change, role upgrade, or recognized movement.",
    };
  }

  if (medium) {
    return {
      windowClass: "movement",
      practicalMeaning: isPromotion
        ? "This can support promotion movement such as recognition, title discussion, salary review, responsibility increase, or promotion consideration."
        : isJobChange
        ? "This can support interviews, recruiter activity, internal transfer, role discussion, or employer movement."
        : "This can support meaningful career movement and should not be treated as a purely passive review period.",
    };
  }

  if (hasModerateOutcomeSupport) {
    return {
      windowClass: "review",
      practicalMeaning: isPromotion
        ? "This can bring visibility and recognition signals, but timing support remains incomplete."
        : isJobChange
        ? "This can bring applications, recruiter contact, or role-change discussion, but timing support remains incomplete."
        : "This can bring review, visibility, added responsibility, or internal movement, but timing support remains incomplete.",
    };
  }

  return {
    windowClass: "visibility",
    practicalMeaning: isPromotion
      ? "This is better for visibility, responsibility-building, and positioning than final promotion."
      : isJobChange
      ? "This is better for preparing, applying quietly, and testing the market than final job change."
      : "This is better for visibility, responsibility-building, and positioning than final career conversion.",
  };
}

  if (topic === "vehicle") {
    if (strong && hasOutcomeSupport) {
      return {
        windowClass: "outcome",
        practicalMeaning:
          "This can support vehicle purchase, delivery, financing closure, or final decision.",
      };
    }

    if (medium || hasModerateOutcomeSupport) {
      return {
        windowClass: "negotiation",
        practicalMeaning:
          "This can support shortlisting, pricing, loan checks, dealership contact, or negotiation.",
      };
    }

    return {
      windowClass: "preparation",
      practicalMeaning:
        "This is better for research and comparison than final purchase.",
    };
  }

  if (topic === "property") {
    if (strong && hasOutcomeSupport) {
      return {
        windowClass: "outcome",
        practicalMeaning:
          "This can support property closure, registration, agreement signing, or possession movement.",
      };
    }

    if (medium || hasModerateOutcomeSupport) {
      return {
        windowClass: "paperwork",
        practicalMeaning:
          "This can support paperwork, loan processing, shortlisting, valuation, or negotiation.",
      };
    }

    return {
      windowClass: "preparation",
      practicalMeaning:
        "This is better for search, planning, and comparison than final closure.",
    };
  }

  if (topic === "relationships" || topic === "marriage") {
    if (strong && hasOutcomeSupport) {
      return {
        windowClass: "outcome",
        practicalMeaning:
          "This can support commitment, family discussion, proposal, engagement, or formal relationship movement.",
      };
    }

    if (medium || hasModerateOutcomeSupport) {
      return {
        windowClass: "discussion",
        practicalMeaning:
          "This can bring emotional opening, conversations, meetings, or relationship clarity.",
      };
    }

    return {
      windowClass: "preparation",
      practicalMeaning:
        "This is better for emotional clarity and observation than final commitment.",
    };
  }

  if (topic === "money") {
    if (strong && hasOutcomeSupport) {
      return {
        windowClass: "outcome",
        practicalMeaning:
          "This can support salary increase, bonus, payout, gain, or stronger income movement.",
      };
    }

    if (medium || hasModerateOutcomeSupport) {
      return {
        windowClass: "movement",
        practicalMeaning:
          "This can bring discussions, delayed payments, incremental gains, or cash-flow improvement.",
      };
    }

    return {
      windowClass: "preparation",
      practicalMeaning:
        "This is better for budgeting, negotiation preparation, and reducing leakage than major gain.",
    };
  }

  if (topic === "relocation") {
    if (strong && hasOutcomeSupport) {
      return {
        windowClass: "outcome",
        practicalMeaning:
          "This can support actual move, visa approval, settlement change, or relocation execution.",
      };
    }

    if (medium || hasModerateOutcomeSupport) {
      return {
        windowClass: "paperwork",
        practicalMeaning:
          "This can bring documentation, visa steps, planning, interviews, or location discussions.",
      };
    }

    return {
      windowClass: "preparation",
      practicalMeaning:
        "This is better for research and planning than actual relocation.",
    };
  }

  return {
    windowClass: strong ? "outcome" : medium ? "movement" : "preparation",
    practicalMeaning: strong
      ? "This can support actual outcome movement."
      : medium
      ? "This can support movement or discussion, but not guaranteed outcome."
      : "This is better for preparation than final outcome.",
  };
}
function getPlanetEventRelevanceScore(params: {
  topic: AskSarathiDomain;
  planet?: string | null;
}): number {
  const planet = safePlanetName(params.planet) ?? "";
  if (!planet) return 0;

  const weights =
    TOPIC_TRIGGER_WEIGHTS[params.topic] ??
    TOPIC_TRIGGER_WEIGHTS.generic;

  if (weights.primary.includes(planet)) return 18;
  if (weights.secondary.includes(planet)) return 10;
  if (weights.context.includes(planet)) return 5;

  return 0;
}
function rankTimingWindows(params: {
  windows: TimingWindow[];
  topic: AskSarathiDomain;
  eventType?: AskSarathiEventType;
  timingPolicy: GenericAstroBundle["timingPolicy"];
  promiseLayer: AnalysisLayer;
  divisionalLayer: AnalysisLayer;
  karakaLayer: AnalysisLayer;
}): RankedTimingWindow[] {
  const {
    windows,
    topic,
    eventType,
    timingPolicy,
    promiseLayer,
    divisionalLayer,
    karakaLayer,
  } = params;

  return windows
    .map((w, index) => {
      let score = 30;
const windowText = JSON.stringify(w);
const planetMatch =
  windowText.match(/\b(Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)\b/)?.[1] ?? null;

score += getPlanetEventRelevanceScore({
  topic,
  planet: planetMatch,
});
      if (timingPolicy.dashaStrength === "strong") score += 25;
      else if (timingPolicy.dashaStrength === "moderate") score += 15;
      else if (timingPolicy.dashaStrength === "mixed") score += 8;

      if (timingPolicy.transitStrength === "strong") score += 20;
      else if (timingPolicy.transitStrength === "moderate") score += 12;
      else if (timingPolicy.transitStrength === "mixed") score += 6;

      if (promiseLayer.verdict === "strong") score += 10;
      else if (promiseLayer.verdict === "moderate") score += 6;

      if (divisionalLayer.verdict === "strong") score += 10;
      else if (divisionalLayer.verdict === "moderate") score += 6;

      if (karakaLayer.verdict === "strong") score += 5;
      else if (karakaLayer.verdict === "moderate") score += 3;

      // nearer window gets slight practical priority
      score -= index * 3;

      score = Math.max(10, Math.min(95, score));

      const classified = classifyTimingWindow({
  topic,
  eventType,
  score,
  promiseLayer,
  divisionalLayer,
  karakaLayer,
});

const confidence: "high" | "medium" | "low" =
  score >= 70 ? "high" : score >= 50 ? "medium" : "low";

return {
  ...w,
  score,
  confidence,
  ...classified,
};
    })
    .sort((a, b) => b.score - a.score);
}
function detectEventType(
  question: string,
  topic: AskSarathiDomain,
  timeDirection?: TimeDirection
): AskSarathiEventType {
  const q = question.toLowerCase();
  if (
  topic === "career" &&
  /\b(promotion|promoted|promote|get promoted|salary increment|increment)\b/.test(q) &&
  /\b(job change|change my job|switch job|new job|external move|change company)\b/.test(q)
) {
  return "career_movement";
}
  if (topic === "career") {
    return detectCareerEventType(question, topic, timeDirection ?? "mixed") ?? "generic_event";
  }

  if (topic === "property") {
    if (/\bsell|selling|dispose|exit\b/.test(q)) return "sell_property";
    if (/\bmove|shift|relocate|change home\b/.test(q)) return "move_home";
    return "buy_property";
  }

  if (topic === "vehicle") {
    if (/\bupgrade|better car|bigger car|luxury\b/.test(q)) return "upgrade_vehicle";
    return "buy_vehicle";
  }

  if (topic === "money") {
    if (/\bbonus|incentive|variable pay\b/.test(q)) return "bonus";
    if (/\bside income|side hustle|extra income|business income\b/.test(q)) return "side_income";
    return "salary_increase";
  }

  if (topic === "relationships") {
    if (/\breconcile|come back|ex|patch up\b/.test(q)) return "reconciliation";
    if (/\bmarry|marriage|commitment|wedding\b/.test(q)) return "marriage_commitment";
    return "new_relationship";
  }

  if (topic === "marriage") return "marriage_commitment";

  if (topic === "health") {
    if (/\brecover|recovery|heal|improve\b/.test(q)) return "health_recovery";
    return "health_checkup";
  }

  if (topic === "relocation") {
    if (/\babroad|foreign|overseas|country\b/.test(q)) return "foreign_move";
    return "local_move";
  }

  return "generic_event";
}
function detectCareerEventType(
  question: string,
  topic: AskSarathiDomain,
  timeDirection: TimeDirection
): CareerEventType {
  if (topic !== "career") return "generic";

  const q = question.toLowerCase().trim();

  // identity first (strongest)
  if (
    /\b(what is my profession|what is my current profession|what do i do|what kind of work|line of work|career type|job type)\b/.test(q)
  ) {
    return "profession_identity";
  }

  // promotion
  if (/\b(get promoted|promotion|promote)\b/.test(q)) {
    return "promotion";
  }

  // job change
  if (/\b(job change|change my job|switch job|switch my job|new job)\b/.test(q)) {
    return "job_change";
  }

  // internal shift
  if (/\b(role change|role shift|transfer|department change|internal move)\b/.test(q)) {
    return "internal_shift";
  }

  // stability / check
  if (
    /\b(stay in my job|leave my job|quit|resign|continue in job|job stability)\b/.test(q)
  ) {
    return "stability_check";
  }

  // fallback by time direction
  if (timeDirection === "identity") return "profession_identity";
  if (timeDirection === "future") return "job_change";

  return "generic";
}
function isCareerMovementQuestion(
  question: string,
  topic: AskSarathiDomain
): boolean {
  if (topic !== "career") return false;
  const q = question.toLowerCase().trim();

  return /\b(get promoted|promotion|promote|job change|change my job|switch job|switch my job|career move|role change|role shift|transfer|department change|move in my career|career change)\b/.test(q);
}
function buildTimingConfidenceNote(
  question: string,
  topic: AskSarathiDomain,
  timeDirection: TimeDirection,
  timingLayer: AnalysisLayer,
  currentDasha: {
    md?: string | null;
    ad?: string | null;
    pd?: string | null;
    line: string;
  },
  timingWindows: TimingWindow[],
  careerEventType: CareerEventType,
  timingPolicy: {
    dashaStrength: "strong" | "moderate" | "mixed" | "weak";
    transitStrength: "strong" | "moderate" | "mixed" | "weak";
    allowSharpWindow: boolean;
    note: string;
  }
): string {
  if (topic === "marriage" && timeDirection === "past") {
    return "Past timing is judged from dasha activation, marriage houses, Venus/Jupiter indicators, and divisional support rather than current transits.";
  }

    if (
    topic === "career" &&
    ["promotion", "job_change", "internal_shift", "stability_check"].includes(careerEventType ?? "")
  ) {
    if (timingPolicy.dashaStrength === "strong") {
      return "Career movement is supported, but it should still be read as a broader professional phase first. Short-term triggers only refine timing; they do not guarantee the event by themselves.";
    }

    if (timingPolicy.dashaStrength === "moderate") {
      return "This looks more like a phase of movement, visibility, review, or repositioning than a clean guaranteed career shift.";
    }

    return "Current signals are not strong enough to present this as a reliable promotion or job-change window.";
  }
  
  return timingPolicy.note;
}

function okJson(data: any, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function badJson(message: string, status = 400) {
  return okJson({ error: message }, status);
}

function safeInternalURL(req: Request, path: string) {
  try {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const u = new URL(req.url);
    return u.origin + cleanPath;
  } catch {
    return `http://localhost:3000${path.startsWith("/") ? path : `/${path}`}`;
  }
}

function safeStr(x: any): string {
  return typeof x === "string" ? x.trim() : "";
}

function getDashaLine(astroBundle: Pick<GenericAstroBundle, "currentDasha">): string {
  const parts = [
    astroBundle.currentDasha?.md,
    astroBundle.currentDasha?.ad,
    astroBundle.currentDasha?.pd,
  ]
    .map((x) => safeStr(x))
    .filter(Boolean);

  if (parts.length) return parts.join("–");
  return safeStr(astroBundle.currentDasha?.line) || "the current dasha";
}

function getDashaPhrase(astroBundle: Pick<GenericAstroBundle, "currentDasha">): string {
  const line = getDashaLine(astroBundle);
  return line === "the current dasha" ? line : `${line} dasha`;
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function fmtDateShort(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(+d)) return String(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function getDashaTimingStrength(
  report: any,
  houses: number[],
  karakas: string[]
): "strong" | "moderate" | "mixed" | "weak" {
  const active = getActiveDashaAnyShape(report);
  const activeLords = [active.md, active.ad, active.pd].filter(Boolean) as string[];

  if (!activeLords.length) return "weak";

  const houseLords = report?.houseLords ?? report?.natal?.houseLords ?? {};
  const relevantHouseLords = houses
    .map((h) => houseLords?.[`H${h}`] ?? houseLords?.[String(h)] ?? null)
    .map((x: any) => safeStr(x?.lord || x))
    .filter(Boolean);

  const houseHits = activeLords.filter((x) => relevantHouseLords.includes(x));
  const karakaHits = activeLords.filter((x) => karakas.includes(String(x)));

  const totalHits = uniq([...houseHits, ...karakaHits]).length;

  if (totalHits >= 2) return "strong";
  if (totalHits === 1 && active.ad) return "moderate";
  if (active.md || active.ad) return "mixed";
  return "weak";
}
function getTransitTimingStrength(
  report: any,
  topic: AskSarathiDomain
): "strong" | "moderate" | "mixed" | "weak" {
  const relevant = getRelevantTransits(report, topic);

  if (!relevant.length) return "weak";
  if (relevant.length >= 3) return "strong";
  if (relevant.length === 2) return "moderate";
  return "mixed";
}
function getTimingPolicy(
  report: any,
  rule: TopicRule,
  topic: AskSarathiDomain,
  question: string,
  careerEventType?: CareerEventType
): {
  dashaStrength: "strong" | "moderate" | "mixed" | "weak";
  transitStrength: "strong" | "moderate" | "mixed" | "weak";
  allowSharpWindow: boolean;
  note: string;
} {
  const dashaStrength = getDashaTimingStrength(report, [...rule.houses, ...(rule.supportHouses ?? [])], rule.karakas);
  const transitStrength = getTransitTimingStrength(report, topic);

  const isCareerMovement =
    topic === "career" &&
    ["promotion", "job_change", "internal_shift"].includes(careerEventType ?? "");

  if (isCareerMovement) {
    if (dashaStrength === "strong" && (transitStrength === "strong" || transitStrength === "moderate")) {
      return {
        dashaStrength,
        transitStrength,
        allowSharpWindow: false,
        note: "Career movement is supported, but it should still be presented as a broader phase rather than a guaranteed short-term event.",
      };
    }

    if (dashaStrength === "moderate" || dashaStrength === "mixed") {
      return {
        dashaStrength,
        transitStrength,
        allowSharpWindow: false,
        note: "This looks more like a career-movement or visibility-building phase than a clean guaranteed change window.",
      };
    }

    return {
      dashaStrength,
      transitStrength,
      allowSharpWindow: false,
      note: "Dasha-period support is not strong enough to present this as a reliable career-change window.",
    };
  }

  if (dashaStrength === "strong" && transitStrength !== "weak") {
    return {
      dashaStrength,
      transitStrength,
      allowSharpWindow: true,
      note: "Dasha-period support is strong enough for a real timing discussion, with transits acting as triggers inside the broader phase.",
    };
  }

  if (dashaStrength === "moderate") {
    return {
      dashaStrength,
      transitStrength,
      allowSharpWindow: false,
      note: "The broader phase is usable, but timing should be presented with caution rather than as a fixed event promise.",
    };
  }

  if (dashaStrength === "mixed") {
    return {
      dashaStrength,
      transitStrength,
      allowSharpWindow: false,
      note: "Timing support is mixed, so this is better read as a possibility-building phase than a sharply defined event window.",
    };
  }

  return {
    dashaStrength,
    transitStrength,
    allowSharpWindow: false,
    note: "Dasha-period support is too weak for a confident event window, even if some transit activity is present.",
  };
}
function formatMonthLabel(label?: string | null): string {
  if (!label) return "—";
  const [yearStr, monthStr] = String(label).split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return String(label);
  }
  return `${months[month - 1]} ${year}`;
}

function scoreToVerdict(score: number): AnalysisLayer["verdict"] {
  if (score >= 75) return "strong";
  if (score >= 58) return "moderate";
  if (score >= 42) return "mixed";
  if (score >= 25) return "weak";
  return "unclear";
}

function confidenceFromScores(scores: number[]): "High" | "Medium" | "Low" {
  const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  if (avg >= 68) return "High";
  if (avg >= 42) return "Medium";
  return "Low";
}
function getEventInterpretation(eventType?: AskSarathiEventType) {
  switch (eventType) {
    case "promotion":
      return "This period is more likely to build promotion conditions first — higher visibility, leadership responsibility, and recognition — with formal title elevation becoming stronger as the window matures.";

    case "job_change":
      return "This period can bring recruiter activity, interviews, employer-change discussions, or a shift in work environment.";

    case "internal_shift":
      return "This period can bring team movement, role restructuring, responsibility expansion, or internal repositioning.";

    case "buy_property":
      return "This period can bring property search, shortlisting, negotiation, loan checks, paperwork, or movement toward purchase.";

    case "sell_property":
      return "This period can bring buyer interest, valuation discussions, negotiation, paperwork, or movement toward sale closure.";

    case "move_home":
      return "This period can bring home-shift discussions, settlement changes, planning, packing, or movement within the current environment.";

    case "buy_vehicle":
      return "This period can bring shortlisting, financing checks, dealership contact, negotiation, or movement toward vehicle purchase.";

    case "upgrade_vehicle":
      return "This period can bring upgrade thoughts, premium options, comparison, exchange-value checks, or movement toward a better vehicle.";

    case "salary_increase":
      return "This period can bring salary discussions, income improvement, negotiation, or gradual earning growth.";

    case "bonus":
      return "This period can bring bonus movement, incentive discussions, delayed payout, or performance-linked gains.";

    case "side_income":
      return "This period can bring extra-income openings, business income, consulting work, or side opportunities.";

    case "new_relationship":
      return "This period can bring new communication, attraction, emotional opening, or a fresh connection.";

    case "marriage_commitment":
      return "This period can bring commitment talks, family discussions, meetings, or movement toward formal relationship decisions.";

    case "reconciliation":
      return "This period can bring communication reopening, emotional clarity, or a chance to resolve distance.";

    case "health_recovery":
      return "This period can bring recovery effort, routine correction, healing momentum, or lifestyle improvement.";

    case "health_checkup":
      return "This period can bring symptoms into awareness, checkups, routine correction, or preventive health action.";

    case "foreign_move":
      return "This period can bring visa movement, foreign links, travel planning, overseas discussions, or relocation groundwork.";

    case "local_move":
      return "This period can bring local movement, home/location discussions, paperwork, or settlement changes.";

    default:
      return "";
  }
}

function getEventLabel(topic: AskSarathiDomain, eventType?: AskSarathiEventType): string {
  const eventLabelByType: Record<string, string> = {
    promotion: "promotion",
    job_change: "career-change",
    internal_shift: "internal role-shift",
    stability_check: "career stability",
    buy_vehicle: "vehicle purchase",
    upgrade_vehicle: "vehicle upgrade",
    buy_property: "property purchase",
    sell_property: "property sale",
    move_home: "home movement",
    salary_increase: "salary/income increase",
    bonus: "bonus/incentive",
    side_income: "side-income",
    new_relationship: "relationship opening",
    marriage_commitment: "marriage/commitment",
    reconciliation: "reconciliation",
    health_recovery: "health recovery",
    health_checkup: "health checkup/routine correction",
    foreign_move: "foreign relocation",
    local_move: "relocation/movement",
  };

  const fallback: Record<string, string> = {
    career: "work/career",
    money: "money/income",
    relationships: "relationship",
    marriage: "marriage/commitment",
    health: "health/routine correction",
    property: "property/home",
    relocation: "relocation/movement",
    vehicle: "vehicle",
    disputes: "dispute resolution",
    child: "children/family expansion",
    inner: "inner clarity",
    generic: "life theme",
  };

  return eventType ? eventLabelByType[eventType] ?? fallback[topic] ?? "this matter" : fallback[topic] ?? "this matter";
}

function getNearTermActivityLabel(topic: AskSarathiDomain, eventType?: AskSarathiEventType): string {
  return `Near-term ${getEventLabel(topic, eventType)} activity`;
}
function getKarakaRole(topic: AskSarathiDomain, planet: string): string {
  const p = planet.toLowerCase();

if (topic === "property") {
  if (p === "mars") {
    return "Mars supports land, construction, physical property action, and the courage to make an asset decision.";
  }

  if (p === "venus") {
    return "Venus supports comfort, home quality, lifestyle assets, funding readiness, and the desire to upgrade living conditions.";
  }

  if (p === "moon") {
    return "Moon shows emotional need for home, settlement, family comfort, and feeling rooted.";
  }

  if (p === "jupiter") {
    return "Jupiter supports expansion of assets, family settlement, property wisdom, and long-term security.";
  }
}

  if (topic === "money") {
    if (p === "jupiter") return "Supports wealth expansion, savings wisdom, and long-term financial growth.";
    if (p === "venus") return "Supports income, comforts, liquidity, and material gains.";
    if (p === "mercury") return "Supports earnings through commerce, negotiation, communication, and skill.";
  }

  if (topic === "career") {
    if (p === "sun") return "Supports authority, title, leadership, and recognition.";
    if (p === "saturn") return "Supports responsibility, structure, endurance, and slow professional growth.";
    if (p === "mercury") return "Supports business thinking, communication, analysis, and role mobility.";
    if (p === "jupiter") return "Supports guidance, advisory capacity, growth, and seniority.";
  }

  if (topic === "relationships" || topic === "marriage") {
    if (p === "venus") return "Supports attraction, affection, partnership desire, and relationship harmony.";
    if (p === "jupiter") return "Supports commitment, wisdom, family blessing, and marriage stability.";
    if (p === "moon") return "Shows emotional bonding, sensitivity, and need for connection.";
  }

  if (topic === "health") {
    if (p === "sun") return "Shows vitality, immunity, heart, energy, and recovery capacity.";
    if (p === "moon") return "Shows emotional health, sleep, fluids, mind, and recovery rhythm.";
    if (p === "mars") return "Shows inflammation, heat, injuries, strain, and physical pressure.";
    if (p === "saturn") return "Shows chronic load, fatigue, stiffness, discipline, and long-term recovery.";
  }

  return `${planet} is a relevant significator for this area.`;
}

function getDivisionalRole(topic: AskSarathiDomain, chart: string): string {
  if (chart === "D4") {
  return "D4 is the key divisional chart for property, home, fixed assets, and settlement; strong D4 support means the chart has property promise, while weak or mixed D4 delays closure.";
}
  if (chart === "D10") return "Confirms career status, professional rise, authority, and work outcomes.";
  if (chart === "D2") return "Confirms wealth flow, savings, income capacity, and financial accumulation.";
  if (chart === "D9") return "Confirms relationship maturity, marriage strength, dharma, and long-term stability.";
  if (chart === "D16") return "Confirms vehicle, comfort, luxury, and mobility-related outcomes.";
  if (chart === "D30") return "Confirms health sensitivity, stress load, imbalance, and recovery pressure.";

  return `${chart} gives divisional confirmation for this topic.`;
}
function getMovementMeaning(
  topic: AskSarathiDomain,
  eventType?: AskSarathiEventType
): string {
  if (topic === "career") {
    if (eventType === "promotion") return "visibility, leadership responsibility, recognition, title discussions, or decision-maker attention";
    if (eventType === "job_change") return "recruiter contact, interviews, employer-change discussions, networking, or role-market movement";
    if (eventType === "internal_shift") return "team movement, responsibility expansion, restructuring, or internal repositioning";
    return "role change, responsibility expansion, visibility, interviews, recruiter contact, or internal discussions";
  }

  if (topic === "vehicle") {
    if (eventType === "upgrade_vehicle") return "research, comparison, exchange-value checks, financing discussions, dealership contact, or movement toward an upgrade";
    return "research, shortlisting, financing checks, dealership contact, negotiation, or movement toward purchase";
  }

  if (topic === "property") {
    if (eventType === "sell_property") return "buyer interest, valuation discussions, negotiations, paperwork, or movement toward sale";
    if (eventType === "move_home") return "home-shift discussions, settlement planning, packing, paperwork, or location decisions";
    return "search activity, shortlisting, paperwork, negotiations, loan checks, family discussions, or movement toward purchase";
  }

  if (topic === "money") {
    if (eventType === "bonus") return "bonus discussions, incentive movement, delayed payouts, approvals, or compensation review";
    if (eventType === "salary_increase") return "salary discussions, compensation review, negotiations, recognition, or income improvement";
    if (eventType === "side_income") return "consulting leads, extra-income openings, side work, business income, or monetization opportunities";
    return "income discussions, delayed payments, bonus movement, side-income openings, expense planning, or cash-flow improvement";
  }

  if (topic === "relationships") {
    if (eventType === "new_relationship") return "communication, emotional opening, attraction, introductions, or relationship opportunities";
    if (eventType === "reconciliation") return "reconnection, renewed communication, emotional clarity, or relationship repair";
    return "communication, emotional opening, attraction, reconnection, commitment talk, or clarity in an existing bond";
  }

  if (topic === "marriage") return "family discussions, meetings, proposal movement, commitment talks, or formal relationship decisions";
  if (topic === "health") return "routine correction, symptoms becoming noticeable, recovery effort, medical checkups, or lifestyle adjustment";
  if (topic === "relocation") return eventType === "foreign_move" ? "travel planning, paperwork, visa movement, foreign opportunities, or settlement decisions" : "location discussions, paperwork, travel planning, or settlement changes";
  if (topic === "disputes") return "negotiation, legal movement, confrontation, documentation, or resolution attempts";
  if (topic === "child") return "family planning, responsibility discussions, medical checks, or child-related developments";

  return "movement, preparation, discussions, or groundwork";
}

function strengthToLevel(verdict?: AnalysisLayer["verdict"]): "high" | "medium" | "low" {
  if (verdict === "strong") return "high";
  if (verdict === "moderate" || verdict === "mixed") return "medium";
  return "low";
}

function buildHolisticDiagnosticProfile(params: {
  question: string;
  topic: AskSarathiDomain;
  eventType?: AskSarathiEventType;
  report: any;
  astroBundle: Pick<GenericAstroBundle, "promiseLayer" | "divisionalLayer" | "karakaLayer" | "timingLayer" | "timingPolicy" | "majorWindows" | "nearTermWindows" | "themeSignal" | "actionBias" | "focusHouses" | "supportHouses" | "karakas" | "divisionalCharts">;
}): HolisticDiagnosticProfile {
  const { topic, eventType, astroBundle } = params;
  const label = getEventLabel(topic, eventType);
  const nearTerm = astroBundle.nearTermWindows?.length
    ? formatWindowRangeFromLabels(astroBundle.nearTermWindows.slice(0, 3).map((w) => w.label))
    : null;
  const structural = astroBundle.majorWindows?.[0]?.label
    ? formatWindowLabel(astroBundle.majorWindows[0].label)
    : null;

  const baseByTopic: Partial<Record<AskSarathiDomain, {
    title: string;
    summary: string;
    concerns: HolisticDiagnosticItem[];
    strengths: HolisticDiagnosticItem[];
    blockers: HolisticDiagnosticItem[];
    bestUse: string;
    caution: string;
  }>> = {
    health: {
      title: "Health sensitivity map",
      summary: "This is a diagnostic health reading: it should identify likely sensitivity zones and timing pressure, not make medical claims or diagnosis.",
      concerns: [
        { area: "Stress, sleep, and recovery rhythm", level: "high", why: "Health houses and Moon/Saturn-style signals often show vulnerability through irregular rest, mental load, and poor recovery rhythm.", watchFor: "sleep disruption, fatigue, overthinking, low recovery after work, or stress-driven symptoms", helpfulAction: "keep sleep, hydration, food timing, and recovery routine consistent" },
        { area: "Inflammation, strain, or heat build-up", level: "medium", why: "Mars/Sun-style health triggers can show pressure through heat, inflammation, impatience, or overexertion.", watchFor: "acidity, inflammation, muscular strain, headaches, or pushing exercise too hard", helpfulAction: "pace workouts, avoid excess heat/spice/alcohol, and use preventive checkups" },
        { area: "Routine imbalance", level: "medium", why: "6th/12th-house emphasis often shows that small habits decide whether the body feels stable or unsettled.", watchFor: "skipped meals, inconsistent sleep, too much caffeine, or stress eating", helpfulAction: "use a simple routine rather than extreme changes" },
      ],
      strengths: [
        { area: "Recovery through structure", level: "medium", why: "The chart supports improvement when lifestyle is disciplined and predictable.", watchFor: "energy improves when routine is stable", helpfulAction: "make routine the remedy" },
      ],
      blockers: [
        { area: "Ignoring small symptoms", level: "medium", why: "The risk is not necessarily one dramatic issue; it is accumulation through repeated imbalance.", watchFor: "minor symptoms repeating", helpfulAction: "address patterns early and consult a doctor for persistent symptoms" },
      ],
      bestUse: "Use this phase for prevention, checkups, and routine correction rather than fear-based interpretation.",
      caution: "Sārathi should never replace medical advice; persistent symptoms require a qualified doctor.",
    },
    career: {
      title: "Career diagnostic map",
      summary: "This is a work-pattern reading: it should explain blockers, strengths, and timing for movement rather than only giving a date.",
      concerns: [
        { area: "Visibility and title alignment", level: "medium", why: "Career growth may be active, but recognition/title conversion depends on stronger authority and reward signals.", watchFor: "extra responsibility without matching title/pay", helpfulAction: "document wins and build decision-maker visibility" },
        { area: "Role-market movement", level: "medium", why: "Mercury/Rahu/Saturn-style signals can create interviews, restructuring, and role discussions.", watchFor: "internal shifts, recruiter activity, or new accountability", helpfulAction: "prepare CV, network, and clarify target role" },
      ],
      strengths: [
        { area: "Structured responsibility", level: "high", why: "The career pattern rewards reliability, process ownership, and advisory judgment.", watchFor: "people seeking your decision support", helpfulAction: "lean into visible ownership" },
      ],
      blockers: [
        { area: "Pushing before politics/timing matures", level: "medium", why: "Career timing often builds through groundwork before formal elevation.", watchFor: "frustration or impatience", helpfulAction: "position strategically before demanding outcome" },
      ],
      bestUse: "Use near-term movement for visibility and groundwork; treat structural windows as bigger career-cycle markers.",
      caution: "Do not read a distant structural window as ‘nothing happens before then’. Near-term movement still matters.",
    },
    money: {
      title: "Money diagnostic map",
      summary: "This reading separates income improvement, bonus timing, cash-flow stability, and wealth leakage.",
      concerns: [
        { area: "Cash-flow consistency", level: "medium", why: "2nd/11th/D2 signals decide whether gains become stable or remain irregular.", watchFor: "delayed payments, bonus uncertainty, or expenses rising with income", helpfulAction: "tighten budgeting and negotiate with evidence" },
        { area: "One-off gain dependency", level: "medium", why: "Bonus/incentive signals can show spikes, but stable wealth needs repeatable income channels.", watchFor: "waiting for one payout", helpfulAction: "build steady increments and side channels" },
      ],
      strengths: [
        { area: "Earning through knowledge and relationships", level: "medium", why: "Jupiter/Venus/Mercury-style signals support income through advisory, finance, communication, and relationship capital.", watchFor: "opportunities through network or expertise", helpfulAction: "monetize expertise steadily" },
      ],
      blockers: [
        { area: "Leakage through lifestyle or timing mismatch", level: "medium", why: "Gains can get diluted if expenses and commitments expand before income stabilizes.", watchFor: "overcommitting based on expected money", helpfulAction: "avoid counting money before approval" },
      ],
      bestUse: "Focus on consistency, negotiation, and cash-flow protection.",
      caution: "Avoid relying on one big payout as the whole plan.",
    },
    relationships: {
      title: "Relationship diagnostic map",
      summary: "This reading separates attraction, emotional readiness, commitment potential, and timing windows.",
      concerns: [
        { area: "Emotional clarity", level: "medium", why: "Relationship signals may open communication before commitment becomes stable.", watchFor: "mixed signals, overthinking, or unclear expectations", helpfulAction: "prioritize honest conversation and emotional pacing" },
        { area: "Commitment timing", level: "medium", why: "Venus/Jupiter/D9 and 7th-house factors decide whether attraction matures into a formal bond.", watchFor: "strong connection without structure", helpfulAction: "let consistency prove itself" },
      ],
      strengths: [
        { area: "Meaningful connection over casual drift", level: "medium", why: "The chart favors bonds that grow through values, maturity, and steadiness.", watchFor: "deeper conversations", helpfulAction: "choose quality over speed" },
      ],
      blockers: [
        { area: "Reading early signals too heavily", level: "medium", why: "Early attraction may not equal long-term clarity.", watchFor: "attachment before evidence", helpfulAction: "observe actions over time" },
      ],
      bestUse: "Stay open, but let the relationship prove consistency before naming it as destiny.",
      caution: "Avoid forcing commitment before timing and emotional clarity align.",
    },
    marriage: {
      title: "Marriage diagnostic map",
      summary: "This reading separates meeting, family discussion, commitment readiness, and formal marriage timing.",
      concerns: [
        { area: "Commitment readiness", level: "medium", why: "7th house, Venus/Jupiter, and D9 must align for formal commitment.", watchFor: "talks without closure", helpfulAction: "check values, family alignment, and timing" },
      ],
      strengths: [
        { area: "Formal bond potential", level: "medium", why: "Marriage grows stronger when relationship factors move from attraction into structure.", watchFor: "clear family or commitment conversations", helpfulAction: "seek clarity without pressure" },
      ],
      blockers: [
        { area: "Timing mismatch", level: "medium", why: "Commitment can delay when emotional and practical layers are not synchronized.", watchFor: "unclear promises", helpfulAction: "ground decisions in practical readiness" },
      ],
      bestUse: "Use the period for clarity, family alignment, and commitment readiness.",
      caution: "Avoid treating attraction alone as marriage confirmation.",
    },
    property: {
      title: "Property diagnostic map",
      summary: "This reading separates search, funding, paperwork, and ownership/closure timing.",
      concerns: [
        { area: "Funding and paperwork", level: "medium", why: "Property needs 4th-house/D4 support plus 2nd/11th funding signals.", watchFor: "loan delays, unclear paperwork, or family decision delays", helpfulAction: "prepare documents and affordability checks early" },
        { area: "Closure readiness", level: "medium", why: "Search can start before closure is astrologically strong.", watchFor: "shortlisting without final agreement", helpfulAction: "separate exploration from commitment" },
      ],
      strengths: [
        { area: "Asset-building potential", level: "medium", why: "When Jupiter/Mars/Venus and D4 align, the chart supports concrete property movement.", watchFor: "better options and clearer finances", helpfulAction: "use near-term movement for due diligence" },
      ],
      blockers: [
        { area: "Confusing home desire with purchase timing", level: "medium", why: "Moon/home comfort alone should not be treated as purchase confirmation.", watchFor: "emotional urgency", helpfulAction: "wait for funding and paperwork clarity" },
      ],
      bestUse: "Research, shortlist, and prepare funding before final commitment.",
      caution: "Do not let emotional comfort alone drive a property decision.",
    },
    vehicle: {
      title: "Vehicle diagnostic map",
      summary: "This reading separates desire, research, affordability, and purchase/upgrade timing.",
      concerns: [
        { area: "Affordability and timing", level: "medium", why: "Vehicle movement needs Venus/D16/H4 support plus practical affordability.", watchFor: "impulse upgrade, stretching budget, or unclear financing", helpfulAction: "compare total ownership cost before deciding" },
      ],
      strengths: [
        { area: "Clear preference formation", level: "medium", why: "Near-term windows can clarify model, budget, and upgrade preference before purchase.", watchFor: "stronger shortlist", helpfulAction: "research and compare calmly" },
      ],
      blockers: [
        { area: "Restlessness-driven decision", level: "medium", why: "Desire for change can arrive before the best purchase window.", watchFor: "rushed commitment", helpfulAction: "let timing and deal quality align" },
      ],
      bestUse: "Use near-term movement to research and prepare; act when the structural window supports commitment.",
      caution: "Avoid stretching budget for emotional urgency.",
    },
    relocation: {
      title: "Relocation diagnostic map",
      summary: "This reading separates travel interest, paperwork, visa/work opportunity, and actual settlement movement.",
      concerns: [
        { area: "Paperwork and opportunity alignment", level: "medium", why: "Relocation needs 4th/9th/12th links, Rahu/Moon/Saturn factors, and D4/D9 support.", watchFor: "paperwork without firm offer, or desire without logistics", helpfulAction: "keep documents and network ready" },
      ],
      strengths: [
        { area: "Foreign/link movement", level: "medium", why: "Rahu and 9th/12th activation can open foreign links and settlement discussions.", watchFor: "travel, visa, foreign contacts", helpfulAction: "respond to genuine opportunities" },
      ],
      blockers: [
        { area: "Impatience before logistics mature", level: "medium", why: "Movement can be visible before physical relocation locks in.", watchFor: "uncertain offers", helpfulAction: "avoid impulsive commitments" },
      ],
      bestUse: "Prepare paperwork, build networks, and stay flexible.",
      caution: "Do not confuse desire to move with confirmed settlement timing.",
    },
    disputes: {
      title: "Dispute diagnostic map",
      summary: "This reading separates pressure, confrontation, paperwork, negotiation, and resolution potential.",
      concerns: [
        { area: "Conflict escalation", level: "medium", why: "Mars/Saturn/Rahu and 6th/8th factors can increase pressure if handled reactively.", watchFor: "anger, documentation gaps, legal delays", helpfulAction: "document facts and avoid impulsive confrontation" },
      ],
      strengths: [
        { area: "Structured resolution", level: "medium", why: "Saturn-style discipline helps resolve disputes through process.", watchFor: "formal negotiation", helpfulAction: "use evidence and patience" },
      ],
      blockers: [
        { area: "Emotional reaction", level: "medium", why: "Reactive Mars/Rahu patterns can worsen conflict.", watchFor: "provocation", helpfulAction: "respond through structure" },
      ],
      bestUse: "Use documentation, calm negotiation, and process discipline.",
      caution: "Avoid emotional escalation.",
    },
    child: {
      title: "Children/family diagnostic map",
      summary: "This reading separates family planning, responsibility, support, and child-related timing.",
      concerns: [
        { area: "Responsibility timing", level: "medium", why: "Child-related matters need 5th house, Jupiter, D7, and supportive family timing.", watchFor: "pressure without readiness", helpfulAction: "align timing, health, and family support" },
      ],
      strengths: [
        { area: "Family expansion support", level: "medium", why: "Jupiter and D7 support can strengthen family-related outcomes.", watchFor: "supportive family developments", helpfulAction: "plan responsibly" },
      ],
      blockers: [
        { area: "Timing pressure", level: "medium", why: "Emotional pressure can distort practical readiness.", watchFor: "rushed decisions", helpfulAction: "use clear planning" },
      ],
      bestUse: "Plan patiently and practically.",
      caution: "Avoid pressure-led decisions.",
    },
    inner: {
      title: "Inner clarity diagnostic map",
      summary: "This reading identifies emotional patterns, direction, and spiritual growth themes.",
      concerns: [
        { area: "Mental/emotional overload", level: "medium", why: "Moon/Ketu/8th/12th factors can bring deep inner processing.", watchFor: "overthinking, detachment, confusion", helpfulAction: "ground through routine and reflection" },
      ],
      strengths: [
        { area: "Spiritual insight", level: "medium", why: "Inner-growth houses can bring clarity after surrender and reflection.", watchFor: "meaningful realizations", helpfulAction: "journal, meditate, simplify" },
      ],
      blockers: [
        { area: "Trying to force certainty", level: "medium", why: "This area matures through patience rather than control.", watchFor: "restlessness", helpfulAction: "allow clarity to unfold" },
      ],
      bestUse: "Use this phase for reflection, simplicity, and emotional grounding.",
      caution: "Avoid making fear-based decisions during inner fog.",
    },
    generic: {
      title: "Life-area diagnostic map",
      summary: "This reading identifies the main concern, strength, blocker, and timing emphasis from the available chart signals.",
      concerns: [{ area: "Main pressure area", level: "medium", why: "The question points to a life area needing clarity.", watchFor: "repeating patterns", helpfulAction: "observe the pattern before acting" }],
      strengths: [{ area: "Steady improvement", level: "medium", why: "The chart favors gradual clarity.", watchFor: "small openings", helpfulAction: "move steadily" }],
      blockers: [{ area: "Unclear focus", level: "medium", why: "The topic needs more specificity for sharper analysis.", watchFor: "scattered decisions", helpfulAction: "narrow the question" }],
      bestUse: "Use this as a broad diagnostic snapshot.",
      caution: "Ask a more specific question for sharper timing.",
    },
  };

  const base = baseByTopic[topic] ?? baseByTopic.generic;

if (!base) {
  return {
    mode: "diagnostic",
    title: "Diagnostic Overview",
    summary: "Not enough diagnostic context available.",
    topConcerns: [],
    strengths: [],
    blockers: [],
    timingWindows: {
      nearTerm: null,
      structural: null,
      note: "No diagnostic timing available.",
    },
    bestUse: "Use this as a general reflection point.",
    caution: "Avoid making major decisions from incomplete chart context.",
  };
}

  const topConcerns = base.concerns.map((item, idx) => ({
    ...item,
    level:
      idx === 0 && (astroBundle.promiseLayer?.verdict === "strong" || astroBundle.timingLayer?.verdict === "strong")
        ? "high"
        : item.level,
  }));

  return {
    mode: "diagnostic",
    title: base.title,
    summary: base.summary,
    topConcerns,
    strengths: base.strengths,
    blockers: base.blockers,
    timingWindows: {
      nearTerm,
      structural,
      note: nearTerm && structural
        ? "Near-term windows show practical activation; structural windows show the bigger cycle."
        : nearTerm
        ? "Near-term windows show practical activation."
        : structural
        ? "Structural windows show the bigger cycle."
        : "Timing is not sharp from the current scan, so use this as a diagnostic pattern first.",
    },
    bestUse: base.bestUse,
    caution: base.caution,
  };
}
function buildAstroReasonMap(
  astroBundle: GenericAstroBundle
): AstroReasonMap {
  const topic = astroBundle.topic;

  const map: AstroReasonMap = {};

  const commonReasons: AstroReason[] = [];

  for (const planet of astroBundle.karakas ?? []) {
    commonReasons.push({
      factor: planet,
      role: getKarakaRole(topic, planet),
      impact: "support",
    });
  }

  for (const chart of astroBundle.divisionalCharts ?? []) {
    commonReasons.push({
      factor: chart,
      role: getDivisionalRole(topic, chart),
      impact:
        astroBundle.divisionalLayer?.verdict === "strong" ||
        astroBundle.divisionalLayer?.verdict === "moderate"
          ? "support"
          : "mixed",
    });
  }

  if (
    astroBundle.timingPolicy?.transitStrength === "weak" ||
    astroBundle.timingPolicy?.transitStrength === "mixed"
  ) {
    commonReasons.push({
      factor: "Current transit support",
      role: "Shows whether the broader promise is ready to convert into visible real-world action.",
      impact: "block",
    });
  }

  if (
    astroBundle.timingPolicy?.dashaStrength === "weak" ||
    astroBundle.timingPolicy?.dashaStrength === "mixed"
  ) {
    commonReasons.push({
      factor: `${getDashaPhrase(astroBundle)} support`,
      role: "Shows whether the life period is strongly carrying this topic right now.",
      impact: "block",
    });
  }
if (astroBundle.majorWindows?.[0]?.reason) {
  commonReasons.push({
    factor: "Major structural window",
    role: `Shows when the topic has stronger outcome-level support: ${astroBundle.majorWindows[0].reason}`,
    impact: "support",
  });
}

if (astroBundle.nearTermWindows?.[0]?.reason) {
  commonReasons.push({
    factor: "Near-term movement window",
    role: `Shows preparation or practical movement before final outcome: ${astroBundle.nearTermWindows[0].reason}`,
    impact: "mixed",
  });
}
  map[topic] = commonReasons.slice(0, 8);

  return map;
}
function buildEvidenceNarrative(
  astroBundle: GenericAstroBundle
): EvidenceNarrative {
  const why: string[] = [];
  const supports: string[] = [];
  const blockers: string[] = [];

  const topic = astroBundle.topic;

  astroBundle.evidenceBullets?.forEach((b) => {
    if (!b) return;

    const lower = b.toLowerCase();

    if (
      lower.includes("supports") ||
      lower.includes("activation") ||
      lower.includes("confirmed")
    ) {
      supports.push(b);
    }

   const isDivisionalWeakness =
  /divisional confirmation.*(weak|unclear|mixed)|d4.*(weak|unclear|mixed)/i.test(b);

const hasTopicDivisionalConfirmation =
  astroBundle.divisionalCharts?.includes("D4") ||
  astroBundle.divisionalCharts?.includes("D10") ||
  astroBundle.divisionalCharts?.includes("D2") ||
  astroBundle.divisionalCharts?.includes("D9") ||
  astroBundle.divisionalCharts?.includes("D16") ||
  astroBundle.divisionalCharts?.includes("D30");

if (
  (
    lower.includes("weak") ||
    lower.includes("mixed") ||
    lower.includes("delay") ||
    lower.includes("block")
  ) &&
  !(isDivisionalWeakness && hasTopicDivisionalConfirmation)
) {
  blockers.push(b);
}

    why.push(b);
  });

  astroBundle.karakas?.forEach((k) => {
    why.push(`Relevant karaka involved: ${k}`);
  });

  astroBundle.divisionalCharts?.forEach((d) => {
    supports.push(`Divisional confirmation through ${d}`);
  });

  if (
    astroBundle.timingPolicy?.dashaStrength === "weak" ||
    astroBundle.timingPolicy?.dashaStrength === "mixed"
  ) {
    blockers.push(
      `${getDashaPhrase(astroBundle)} support is ${astroBundle.timingPolicy.dashaStrength}`
    );
  }

  if (
    astroBundle.timingPolicy?.transitStrength === "weak" ||
    astroBundle.timingPolicy?.transitStrength === "mixed"
  ) {
    blockers.push(
      `Current transit support is ${astroBundle.timingPolicy.transitStrength}`
    );
  }

  return {
    why: [...new Set(why)].slice(0, 8),
    supports: [...new Set(supports)].slice(0, 6),
    blockers: [...new Set(blockers)].slice(0, 6),
  };
}
function buildPastActivationProfile(
  report: any,
  profile?: NormalizedProfile | null
): PastActivationProfile {
  const rows = [
    ...(Array.isArray(report?.dashaTimeline) ? report.dashaTimeline : []),
    ...(Array.isArray(report?.timeline) ? report.timeline : []),
    ...(Array.isArray(report?.eventTimeline) ? report.eventTimeline : []),
  ];

  const today = getTodayISOForTiming(report);

  const profileYear = Number(String(profile?.dobISO ?? "").slice(0, 4));
  const reportBirthYear = getBirthYear(report);

  const birthYear =
    Number.isFinite(profileYear) && profileYear > 1900
      ? profileYear
      : reportBirthYear ?? undefined;

  function yearFromAnyDate(raw: any): number | undefined {
    const s = String(raw ?? "");
    const y = Number(s.slice(0, 4));
    return Number.isFinite(y) && y > 1900 && y < 2100 ? y : undefined;
  }

  function getStart(row: any): string {
    return String(row?.start ?? row?.from ?? row?.startISO ?? row?.date ?? "");
  }

  function getEnd(row: any): string {
    return String(row?.end ?? row?.to ?? row?.endISO ?? row?.date ?? "");
  }

  const pastRows = rows.filter((row: any) => {
    const start = getStart(row);
    const end = getEnd(row);
    if (!start || !end) return false;

    const startKey = normalizeTimeKey(start);
    const endKey = normalizeTimeKey(end);

    if (!endKey || endKey >= today) return false;

    const startYear = yearFromAnyDate(startKey);
    const endYear = yearFromAnyDate(endKey);

    if (!birthYear || !startYear || !endYear) return false;

    // Remove impossible birth/childhood rows.
    if (endYear < birthYear + 16) return false;

    // Remove impossible/zero-length malformed rows.
    if (endYear < startYear) return false;

    return true;
  });

  function makeWindow(row: any) {
    const start = getStart(row);
    const end = getEnd(row);
    return `${start} to ${end}`;
  }

  function ageAt(raw: any): number | undefined {
    const y = yearFromAnyDate(raw);
    return y && birthYear ? y - birthYear : undefined;
  }

  function pickRows(
    keywords: string[],
    minAge: number
  ): Array<{
    window: string;
    ageAtStart?: number;
    ageAtEnd?: number;
    reason: string;
  }> {
    return pastRows
      .filter((row: any) => {
        const start = getStart(row);
        const end = getEnd(row);

        const a1 = ageAt(start);
        const a2 = ageAt(end);

        if ((a2 ?? 0) < minAge) return false;

        const txt = JSON.stringify(row).toLowerCase();
        return keywords.some((kw) => txt.includes(kw));
      })
      .slice(0, 4)
      .map((row: any) => {
        const start = getStart(row);
        const end = getEnd(row);

        return {
          window: makeWindow(row),
          ageAtStart: ageAt(start),
          ageAtEnd: ageAt(end),
          reason:
            row?.reason ??
            row?.why ??
            `Past activation found through ${keywords.slice(0, 3).join(", ")} indicators.`,
        };
      });
  }

  return {
    relationships: pickRows(
  ["venus", "jupiter", "relationship", "marriage", "d9", "7th"],
  18
),

career: pickRows(
  ["sun", "saturn", "mercury", "career", "job", "promotion", "d10", "10th"],
  25
),

property: pickRows(
  ["mars", "venus", "property", "home", "d4", "4th"],
  28
),

wealth: pickRows(
  ["jupiter", "venus", "money", "income", "wealth", "d2", "2nd", "11th"],
  25
),
  };
}
function buildChartRealityProfile(
  report: any,
  astroBundle: GenericAstroBundle,
  profile?: NormalizedProfile | null
): ChartRealityProfile {
  const profileYear = Number(String(profile?.dobISO ?? "").slice(0, 4));
const reportAge = getCurrentAge(report);

const age =
  Number.isFinite(profileYear) && profileYear > 1900
    ? new Date().getFullYear() - profileYear
    : reportAge;
  const pastWindows: ChartRealityProfile["pastWindows"] = [];
  const contradictions: string[] = [];
  const likelyAlreadyExperienced: string[] = [];
  const cautionFlags: string[] = [];
  const lifeEvidenceReasons = {
  marriage: [] as string[],
  children: [] as string[],
  career: [] as string[],
  property: [] as string[],
};
  const question = astroBundle.question.toLowerCase();

  if (age && age >= 35) {
    cautionFlags.push(
      "User is in mature life stage, so questions about marriage, children, career, or property should check past activation before assuming the event never happened."
    );
  }

  const pastActivationProfile = buildPastActivationProfile(report, profile);
const pastRelationshipWindows = pastActivationProfile.relationships ?? [];

  if (pastRelationshipWindows.length && age && age >= 35) {
    likelyAlreadyExperienced.push(
      "Marriage/relationship activation appears to have had past windows, so do not assume the person has never had commitment opportunities."
    );
lifeEvidenceReasons.marriage.push(
  `Past relationship/marriage activation windows were found around ${
    pastRelationshipWindows
      .slice(0, 2)
      .map((w) => w.ageAtStart != null ? `age ${w.ageAtStart}` : w.window)
      .join(" and ")
  }.`
);

lifeEvidenceReasons.marriage.push(
  "Age and life-stage suggest commitment opportunities should already have appeared."
);
if (age && age >= 35) {
  lifeEvidenceReasons.career.push(
    "Career establishment themes are normally active by this life stage."
  );

  lifeEvidenceReasons.children.push(
    "Family and child-related themes are normally relevant by this life stage."
  );

  lifeEvidenceReasons.property.push(
    "Property and settlement decisions are commonly activated by this life stage."
  );
}
  pastRelationshipWindows.slice(0, 3).forEach((w) => {
  pastWindows.push({
    topic: "relationships",
    event: "relationship/marriage activation",
    window: w.window,
    reason: `${w.reason}${
      w.ageAtStart != null
        ? ` This was around age ${w.ageAtStart}${w.ageAtEnd != null && w.ageAtEnd !== w.ageAtStart ? `-${w.ageAtEnd}` : ""}.`
        : ""
    }`,
  });
});
  }

  if (
    /\bstill single\b|\bwhy am i single\b|\bwhy am i still single\b/.test(question) &&
    pastRelationshipWindows.length &&
    age &&
    age >= 35
  ) {
    contradictions.push(
      "Question asks as if no relationship/marriage activation has happened, but chart history suggests past relationship/commitment windows may already have been active."
    );
  }

const lifeEvidence = {
 likelyMarried: !!(
  age &&
  age >= 35 &&
  pastRelationshipWindows.length > 0
),

  likelyChildren: !!(
    age &&
    age >= 35
  ),

  likelyCareerEstablished: !!(
    age &&
    age >= 30
  ),

  likelyPropertyExposure: !!(
    age &&
    age >= 35
  ),
};
  return {
    age,
    lifeEvidence,
    lifeEvidenceReasons,
    likelyAlreadyExperienced,
    pastWindows,
    currentLifeStage:
      age && age >= 40
        ? "Mature life stage: answers should consider past events, accumulated responsibilities, and current refinement rather than assuming first-time experience."
        : age && age >= 30
        ? "Adult consolidation stage: answers should check both past opportunities and future windows."
        : "Early life stage: first-time event assumptions may be more reasonable.",
    contradictions,
    cautionFlags,
  };
}
function buildWhyChain(
  astroBundle: GenericAstroBundle,
  conversion?: ConversionDiagnosis
): WhyChain {
  const topic = astroBundle.topic;

  let level1 = "";
  let level2 = "";
  let level3 = "";

  switch (topic) {
    case "property":
      level1 =
        "Property purchase has not completed because timing support is weak.";

      level2 =
        "Timing support is weak because current transits are not strongly activating the property promise.";

      level3 =
        "The chart promise exists through D4, Jupiter, Venus, and property indicators, but activation and closure belong to a later cycle.";
      break;

    case "career":
      level1 =
        "Career progress feels slow because responsibility is not converting into formal recognition.";

      level2 =
        "Recognition is delayed because timing support is weaker than responsibility support.";

      level3 =
        "D10, Sun, Jupiter, and Saturn support career growth, but current cycles are building leverage before reward.";
      break;

    case "money":
      level1 =
        "Savings are not growing because income is not converting into retained wealth.";

      level2 =
        "Retention is weak because expenses, obligations, or lifestyle expansion absorb gains.";

      level3 =
        "The chart supports earning through Jupiter, Venus, and Mercury, but current timing is not strongly supporting accumulation.";
      break;

    case "relationships":
    case "marriage":
      level1 =
        "Relationships feel delayed because attraction is not converting into commitment.";

      level2 =
        "Commitment conversion is weak because timing support is weaker than relationship promise.";

      level3 =
        "Venus, Moon, and D9 support partnership capacity, but current cycles are not strongly activating stable commitment.";
      break;

    default:
      level1 =
        conversion?.outcome ??
        "The topic is active but not fully converting into visible results.";

      level2 =
        conversion?.blocker ??
        "Timing support remains weaker than promise.";

      level3 =
        conversion?.promise ??
        "The chart contains the underlying potential.";
  }

  return {
    level1,
    level2,
    level3,
  };
}
function buildConversionDiagnosis(
  astroBundle: GenericAstroBundle
): ConversionDiagnosis {
  const promise =
  astroBundle.topic === "property" && astroBundle.divisionalCharts?.includes("D4")
    ? "Property promise exists because D4 is involved and the property/home theme is supported in the chart, but the promise requires timing support to convert into purchase."
    : astroBundle.topic === "career" && astroBundle.divisionalCharts?.includes("D10")
    ? "Career promise exists because D10 is involved and professional status/growth is part of the chart story, but recognition depends on timing support."
    : astroBundle.topic === "money" && astroBundle.divisionalCharts?.includes("D2")
    ? "Money promise exists because D2 is involved and wealth flow is part of the chart story, but income must convert into retained savings."
    : (astroBundle.topic === "relationships" || astroBundle.topic === "marriage") &&
      astroBundle.divisionalCharts?.includes("D9")
    ? "Relationship promise exists because D9 is involved and partnership maturity is part of the chart story, but attraction must convert into stable commitment."
    : astroBundle.promiseLayer?.summary ??
      `${astroBundle.topic} has some level of promise in the chart.`;

  let trigger = "No clear trigger identified yet.";

  if (astroBundle.majorWindows?.[0]?.reason) {
    trigger = astroBundle.majorWindows[0].reason;
  } else if (astroBundle.nearTermWindows?.[0]?.reason) {
    trigger = astroBundle.nearTermWindows[0].reason;
  }

  let blocker =
    "Timing maturity and real-world readiness are still developing.";

  if (
    astroBundle.timingPolicy?.transitStrength === "weak"
  ) {
    blocker =
      `Current transit support is weak, so the promise shown by ${getDashaPhrase(astroBundle)} is not converting easily into visible outcomes.`;
  } else if (
    astroBundle.timingPolicy?.dashaStrength === "weak"
  ) {
    blocker =
      `${getDashaPhrase(astroBundle)} is not strongly carrying this topic right now, so results remain partial or delayed.`;
  } else if (
    astroBundle.timingPolicy?.transitStrength === "mixed"
  ) {
    blocker =
      `Current transit support is mixed, so ${getDashaPhrase(astroBundle)} may create movement but not consistent conversion.`;
  }

  let outcome = "";

  switch (astroBundle.topic) {
    case "property":
      outcome =
        "Property themes may appear as search activity, paperwork, planning, or relocation discussions before actual purchase.";
      break;

    case "career":
      outcome =
        "Career themes may appear as increased responsibility, visibility, advisory influence, or internal movement before formal promotion.";
      break;

    case "money":
      outcome =
        "Money themes may appear as income growth, bonuses, or side earnings before stable wealth accumulation.";
      break;

    case "relationships":
    case "marriage":
      outcome =
        "Relationship themes may appear as attraction, conversation, emotional closeness, or interest before stable commitment.";
      break;

    default:
      outcome =
        "The theme is active, but visible outcomes may require stronger timing support.";
  }

  return {
    promise,
    trigger,
    blocker,
    outcome,
  };
}
function buildRelationshipReasonMap(
  astroBundle: GenericAstroBundle
): RelationshipReasonMap | undefined {
  if (astroBundle.topic !== "relationships" && astroBundle.topic !== "marriage") {
    return undefined;
  }

  const attractionDrivers: string[] = [];
  const bondingDrivers: string[] = [];
  const commitmentDrivers: string[] = [];
  const relationshipBlockers: string[] = [];
  const d9Reasons: string[] = [];

  const karakas = astroBundle.karakas ?? [];
  const charts = astroBundle.divisionalCharts ?? [];
  const dasha = astroBundle.currentDasha;

  if (karakas.includes("Venus")) {
    attractionDrivers.push(
      "Venus supports attraction, affection, relationship desire, harmony, and the ability to draw connection."
    );
  }

  if (karakas.includes("Moon")) {
    bondingDrivers.push(
      "Moon supports emotional bonding, sensitivity, closeness, and the need to feel emotionally safe."
    );
  }

  if (karakas.includes("Jupiter")) {
    commitmentDrivers.push(
      "Jupiter supports commitment, wisdom, family blessing, long-term stability, and mature partnership."
    );
  }

  if (charts.includes("D9")) {
    d9Reasons.push(
      "D9 is the key divisional chart for marriage, partnership maturity, dharma, and long-term relationship stability."
    );
  }

  if (dasha?.md === "Rahu") {
    relationshipBlockers.push(
      "Rahu Mahadasha can create unconventional attraction, confusion, distance, or non-linear relationship patterns."
    );
  }

  if (dasha?.ad === "Venus") {
    attractionDrivers.push(
      "Venus Antardasha activates relationship desire, attraction, pleasure, and the wish for emotional or romantic connection."
    );
  }

  if (dasha?.pd === "Venus") {
    attractionDrivers.push(
      "Venus Pratyantar Dasha can bring short-term relationship activation, interest, attraction, or renewed desire for connection."
    );
  }

  if (
    astroBundle.timingPolicy?.transitStrength === "weak" ||
    astroBundle.timingPolicy?.transitStrength === "mixed"
  ) {
    relationshipBlockers.push(
      `Current transit support is ${astroBundle.timingPolicy.transitStrength}, so ${getDashaPhrase(astroBundle)} may bring attraction or emotional openness without clean conversion into commitment yet.`
    );
  }

  relationshipBlockers.push(
    "The key issue is not absence of relationship potential; it is conversion of attraction or emotional connection into stable commitment."
  );

  return {
    attractionDrivers: [...new Set(attractionDrivers)].slice(0, 5),
    bondingDrivers: [...new Set(bondingDrivers)].slice(0, 5),
    commitmentDrivers: [...new Set(commitmentDrivers)].slice(0, 5),
    relationshipBlockers: [...new Set(relationshipBlockers)].slice(0, 6),
    d9Reasons: [...new Set(d9Reasons)].slice(0, 4),
  };
}
function buildCareerReasonMap(
  astroBundle: GenericAstroBundle
): CareerReasonMap | undefined {
  if (astroBundle.topic !== "career") return undefined;

  const titleSupport: string[] = [];
  const responsibilitySupport: string[] = [];
  const mobilitySupport: string[] = [];
  const promotionBlockers: string[] = [];
  const d10Reasons: string[] = [];

  const karakas = astroBundle.karakas ?? [];
  const charts = astroBundle.divisionalCharts ?? [];
  const dasha = astroBundle.currentDasha;

  if (karakas.includes("Sun")) {
    titleSupport.push(
      "Sun supports title, authority, leadership, recognition, and formal visibility."
    );
  }

  if (karakas.includes("Saturn")) {
    responsibilitySupport.push(
      "Saturn supports responsibility, workload, process ownership, seniority through endurance, and slow professional growth."
    );

    promotionBlockers.push(
      "Saturn can increase responsibility before it gives formal reward, so workload may rise before title or pay catches up."
    );
  }

  if (karakas.includes("Mercury")) {
    mobilitySupport.push(
      "Mercury supports role movement, communication, analysis, negotiation, business thinking, and internal mobility."
    );
  }

  if (karakas.includes("Jupiter")) {
    titleSupport.push(
      "Jupiter supports seniority, advisory capacity, guidance, expansion, and being trusted for judgment."
    );
  }

  if (charts.includes("D10")) {
    d10Reasons.push(
      "D10 is the career divisional chart; its involvement confirms that career status, authority, and professional outcomes are part of the chart story."
    );
  }

  if (dasha?.md === "Rahu") {
    mobilitySupport.push(
      "Rahu Mahadasha can create unconventional growth, role shifts, political complexity, ambition, and non-linear career movement."
    );
  }

  if (dasha?.ad === "Venus") {
    mobilitySupport.push(
      "Venus Antardasha can support relationship-based opportunities, visibility through networks, stakeholder alignment, and comfort-seeking career choices."
    );
  }

  if (
    astroBundle.timingPolicy?.transitStrength === "weak" ||
    astroBundle.timingPolicy?.transitStrength === "mixed"
  ) {
    promotionBlockers.push(
      `Current transit support is ${astroBundle.timingPolicy.transitStrength}, so ${getDashaPhrase(astroBundle)} may bring responsibility without clean conversion into title, pay, or formal promotion yet.`
    );
  }

  if (
    astroBundle.timingPolicy?.dashaStrength === "weak" ||
    astroBundle.timingPolicy?.dashaStrength === "mixed"
  ) {
    promotionBlockers.push(
      `${getDashaPhrase(astroBundle)} support is ${astroBundle.timingPolicy.dashaStrength}, so career progress may feel delayed, partial, or dependent on groundwork.`
    );
  }

  promotionBlockers.push(
    "The key issue is not absence of work or capability; it is conversion of responsibility and visibility into formal recognition."
  );

  return {
    titleSupport: [...new Set(titleSupport)].slice(0, 5),
    responsibilitySupport: [...new Set(responsibilitySupport)].slice(0, 5),
    mobilitySupport: [...new Set(mobilitySupport)].slice(0, 5),
    promotionBlockers: [...new Set(promotionBlockers)].slice(0, 6),
    d10Reasons: [...new Set(d10Reasons)].slice(0, 4),
  };
}
function buildMoneyReasonMap(
  astroBundle: GenericAstroBundle
): MoneyReasonMap | undefined {
  if (astroBundle.topic !== "money") return undefined;

  const incomeDrivers: string[] = [];
  const savingsDrivers: string[] = [];
  const leakageDrivers: string[] = [];
  const wealthBlockers: string[] = [];

  const karakas = astroBundle.karakas ?? [];
  const charts = astroBundle.divisionalCharts ?? [];
  const dasha = astroBundle.currentDasha;

  if (karakas.includes("Jupiter")) {
    incomeDrivers.push(
      "Jupiter supports financial growth, wisdom with money, long-term accumulation, and wealth expansion."
    );
    savingsDrivers.push(
      "Jupiter can support saving and wealth-building when discipline is present."
    );
  }

  if (karakas.includes("Venus")) {
    incomeDrivers.push(
      "Venus supports income, comforts, material gains, liquidity, and earning through relationship capital."
    );
    leakageDrivers.push(
      "Venus can also increase lifestyle spending, comfort expenses, upgrades, and enjoyment-led outflow."
    );
  }

  if (karakas.includes("Mercury")) {
    incomeDrivers.push(
      "Mercury supports income through skill, communication, commerce, negotiation, analysis, and advisory work."
    );
  }

  if (charts.includes("D2")) {
    savingsDrivers.push(
      "D2 is the wealth divisional chart; its involvement confirms that money flow and accumulation are part of the chart story."
    );
  }

  if (dasha?.md === "Rahu") {
    leakageDrivers.push(
      "Rahu Mahadasha can create expansion, ambition, and irregular money movement, so gains may come with sudden expenses or unstable priorities."
    );
  }

  if (dasha?.ad === "Venus") {
    incomeDrivers.push(
      "Venus Antardasha supports material growth, comforts, income opportunities, and financial desire."
    );
    leakageDrivers.push(
      "Venus Antardasha can also increase spending on lifestyle, comfort, family needs, vehicles, home, or upgrades."
    );
  }

  if (
    astroBundle.timingPolicy?.transitStrength === "weak" ||
    astroBundle.timingPolicy?.transitStrength === "mixed"
  ) {
    wealthBlockers.push(
      `Current transit support is ${astroBundle.timingPolicy.transitStrength}, so ${getDashaPhrase(astroBundle)} may bring income potential without clean conversion into visible savings yet.`
    );
  }

  if (
    astroBundle.timingPolicy?.dashaStrength === "weak" ||
    astroBundle.timingPolicy?.dashaStrength === "mixed"
  ) {
    wealthBlockers.push(
      `${getDashaPhrase(astroBundle)} support is ${astroBundle.timingPolicy.dashaStrength}, so wealth growth may remain uneven or delayed.`
    );
  }

  wealthBlockers.push(
    "The core issue is not necessarily earning capacity; it is converting income into retained wealth."
  );

  return {
    incomeDrivers: [...new Set(incomeDrivers)].slice(0, 6),
    savingsDrivers: [...new Set(savingsDrivers)].slice(0, 5),
    leakageDrivers: [...new Set(leakageDrivers)].slice(0, 5),
    wealthBlockers: [...new Set(wealthBlockers)].slice(0, 5),
  };
}
function topicKarakas(topic: AskSarathiDomain): string[] {
  if (topic === "property") return ["Mars", "Venus", "Moon", "Jupiter"];
  if (topic === "career") return ["Sun", "Saturn", "Mercury", "Jupiter"];
  if (topic === "money") return ["Jupiter", "Venus", "Mercury"];
  if (topic === "relationships" || topic === "marriage") return ["Venus", "Moon", "Jupiter"];
  if (topic === "health") return ["Sun", "Moon", "Mars", "Saturn"];
  return [];
}

function topicDivisionalChart(topic: AskSarathiDomain): string | null {
  if (topic === "property") return "D4";
  if (topic === "career") return "D10";
  if (topic === "money") return "D2";
  if (topic === "relationships" || topic === "marriage") return "D9";
  if (topic === "health") return "D30";
  if (topic === "vehicle") return "D16";
  return null;
}

function scorePlanetForTopic(
  planet: string,
  astroBundle: GenericAstroBundle
): number {
  let score = 50;

  const topic = astroBundle.topic;
  const dasha = astroBundle.currentDasha;

  if (dasha?.md === planet) score += 15;
  if (dasha?.ad === planet) score += 20;
  if (dasha?.pd === planet) score += 25;

  if (topicKarakas(topic).includes(planet)) score += 10;
  const houseLordReasons = extractHouseLordReasons(astroBundle);

if (houseLordReasons.some((r) => r.includes(`lord ${planet}`))) {
  score += 15;
}
  const topicChart = topicDivisionalChart(topic);
  if (topicChart && astroBundle.divisionalCharts?.includes(topicChart)) {
    score += 10;
  }

  const promise = astroBundle.promiseLayer?.verdict;
  if (promise === "strong") score += 10;
  else if (promise === "moderate") score += 7;
  else if (promise === "mixed") score += 3;
  else if (promise === "weak") score -= 10;

  const transit = astroBundle.timingPolicy?.transitStrength;
  if (transit === "strong") score += 10;
  else if (transit === "mixed") score += 0;
  else if (transit === "weak") score -= 15;
  const majorScore = astroBundle.majorWindows?.[0]?.score;
const nearScore = astroBundle.nearTermWindows?.[0]?.score;

const bestWindowScore =
  typeof majorScore === "number"
    ? majorScore
    : typeof nearScore === "number"
    ? nearScore
    : undefined;

if (typeof bestWindowScore === "number") {
  if (bestWindowScore >= 75) score += 10;
  else if (bestWindowScore >= 60) score += 5;
  else if (bestWindowScore < 40) score -= 5;
}
  if (astroBundle.timingPolicy?.transitStrength === "weak") {
  score = Math.min(score, 88);
}

return Math.max(0, Math.min(100, score));
}
function buildPlanetContributions(
  astroBundle: GenericAstroBundle
): PlanetContribution[] {
  const topic = astroBundle.topic;
  const dasha = astroBundle.currentDasha;

  const out: PlanetContribution[] = [];

 function add(
  planet: string,
  role: string,
  contribution: string,
  impact: "support" | "block" | "mixed",
  strength: number
) {
  out.push({ planet, role, contribution, impact, strength });
}

  if (topic === "property") {
    if (astroBundle.karakas.includes("Mars")) {
      add(
        "Mars",
        "Property karaka",
        "Supports land, construction, physical property action, and the courage to make an asset decision.",
        "support",
        scorePlanetForTopic("Mars", astroBundle)
      );
    }

    if (astroBundle.karakas.includes("Venus")) {
      add(
        "Venus",
        "Asset comfort and funding significator",
        "Supports comfort, home quality, lifestyle assets, liquidity, and readiness to spend on property.",
        "support",
        scorePlanetForTopic("Venus", astroBundle)
      );
    }

    if (astroBundle.karakas.includes("Moon")) {
      add(
        "Moon",
        "Home and settlement significator",
        "Shows emotional need for home, domestic comfort, family settlement, and rootedness.",
        "support",
        scorePlanetForTopic("Moon", astroBundle)
      );
    }

    if (astroBundle.majorWindows?.[0]?.reason?.includes("Jupiter")) {
      add(
        "Jupiter",
        "Major property trigger",
        "Activates property, settlement, family expansion, and long-term asset security in the stronger structural window.",
        "support",
        scorePlanetForTopic("Jupiter", astroBundle)
      );
    }

    if (dasha?.md === "Rahu") {
      add(
        "Rahu",
        "Mahadasha background",
        "Creates movement, desire for change, and non-linear progress, but does not always give clean closure by itself.",
        "mixed",
        scorePlanetForTopic("Rahu", astroBundle)
      );
    }
  }

  if (topic === "career") {
    if (astroBundle.karakas.includes("Sun")) {
      add("Sun", "Authority significator", "Supports title, recognition, leadership, and formal authority.", "support", scorePlanetForTopic("Sun", astroBundle));
    }
    if (astroBundle.karakas.includes("Saturn")) {
      add("Saturn", "Responsibility significator", "Supports workload, structure, accountability, and slow professional growth.", "mixed", scorePlanetForTopic("Saturn", astroBundle));
    }
    if (astroBundle.karakas.includes("Mercury")) {
      add("Mercury", "Role mobility significator", "Supports communication, analysis, business thinking, and role movement.", "support", scorePlanetForTopic("Mercury", astroBundle));
    }
    if (astroBundle.karakas.includes("Jupiter")) {
      add("Jupiter", "Growth significator", "Supports seniority, advisory capacity, guidance, and expansion.", "support", scorePlanetForTopic("Jupiter", astroBundle));
    }
  }

  if (topic === "money") {
    if (astroBundle.karakas.includes("Jupiter")) {
      add("Jupiter", "Wealth expansion significator", "Supports savings wisdom, financial growth, and long-term accumulation.", "support", scorePlanetForTopic("Jupiter", astroBundle));
    }
    if (astroBundle.karakas.includes("Venus")) {
      add("Venus", "Income and liquidity significator", "Supports income, comforts, liquidity, and material gains.", "support", scorePlanetForTopic("Venus", astroBundle));
    }
    if (astroBundle.karakas.includes("Mercury")) {
      add("Mercury", "Commerce and negotiation significator", "Supports earnings through skill, trade, negotiation, and communication.", "support", scorePlanetForTopic("Mercury", astroBundle));
    }
  }

  if (topic === "relationships" || topic === "marriage") {
    if (astroBundle.karakas.includes("Venus")) {
      add("Venus", "Relationship karaka", "Supports attraction, affection, harmony, and relationship desire.", "support", scorePlanetForTopic("Venus", astroBundle));
    }
    if (astroBundle.karakas.includes("Jupiter")) {
      add("Jupiter", "Commitment stabilizer", "Supports wisdom, family blessing, commitment, and long-term stability.", "support", scorePlanetForTopic("Jupiter", astroBundle));
    }
    if (astroBundle.karakas.includes("Moon")) {
      add("Moon", "Emotional bonding significator", "Shows emotional connection, sensitivity, and need for closeness.", "support", scorePlanetForTopic("Moon", astroBundle));
    }
  }

  return out.slice(0, 8);
}
function extractHouseLordReasons(
  astroBundle: GenericAstroBundle
): string[] {
  const sources = [
    astroBundle.majorWindows?.[0]?.reason,
    astroBundle.nearTermWindows?.[0]?.reason,
    astroBundle.answerSummary,
    ...(astroBundle.evidenceBullets ?? []),
  ]
    .filter(Boolean)
    .map(String);

  const found: string[] = [];

  for (const s of sources) {
    const matches = s.match(/H\d+\s+lord\s+[A-Za-z]+/g);
    if (matches?.length) found.push(...matches);
  }

  return [...new Set(found)].slice(0, 8);
}
function buildAstroInterpretationPacket(
  astroBundle: GenericAstroBundle
): AstroInterpretationPacket {
  const nearTermWindows =
    astroBundle.nearTermWindows?.slice(0, 3).map((w) => formatWindowLabel(w.label)) ?? [];

  const majorWindows =
    astroBundle.majorWindows?.slice(0, 3).map((w) => formatWindowLabel(w.label)) ?? [];

  const reasonItems =
  astroBundle.astroReasonMap?.[astroBundle.topic] ?? [];

const reasonSupports = reasonItems
  .filter((x) => x.impact === "support")
  .map((x) => `${x.factor}: ${x.role}`);

const reasonBlockers = reasonItems
  .filter((x) => x.impact === "block")
  .map((x) => `${x.factor}: ${x.role}`);

const supports = [
  ...reasonSupports,
  ...(astroBundle.evidenceNarrative?.supports ?? []),
  ...(astroBundle.insightProfile?.strengths ?? []),
  ...(astroBundle.themeSignal?.activeSignals ?? []),
]
  .filter(Boolean)
  .filter((x) => !/weak|unclear|not strong|delay/i.test(x))
  .slice(0, 10);

const blockers = [
  ...reasonBlockers,
  ...(astroBundle.evidenceNarrative?.blockers ?? []),
  ...(astroBundle.insightProfile?.blockers ?? []),
  ...(astroBundle.themeSignal?.missingSignals ?? []),
]
  .filter(Boolean)
  .filter((x) => !/confirmation through/i.test(String(x)))
  .filter((x) => {
    const s = String(x).toLowerCase();

    if (
      astroBundle.divisionalCharts?.includes("D4") &&
      /divisional confirmation is still weak|d4.*weak|d4.*unclear/i.test(s)
    ) {
      return false;
    }

    return true;
  })
  .slice(0, 10);

  const realLifeManifestations =
    astroBundle.eventHints?.length
      ? astroBundle.eventHints
      : [getMovementMeaning(astroBundle.topic, astroBundle.eventType)];

  const conversionIssue =
  astroBundle.promiseLayer?.verdict === "strong" ||
  astroBundle.promiseLayer?.verdict === "moderate" ||
  astroBundle.promiseLayer?.verdict === "mixed"
    ? `There is some promise for ${astroBundle.topic}, but the issue is conversion: ${getDashaPhrase(astroBundle)} support is ${astroBundle.timingPolicy?.dashaStrength}, while transit support is ${astroBundle.timingPolicy?.transitStrength}. This means the theme exists, but the timing may not yet be strong enough for final outcome.`
    : `The basic promise for ${astroBundle.topic} itself is not very clear, so the answer should be cautious.`;
    const conversionDiagnosis =
  buildConversionDiagnosis(astroBundle);
  return {
    question: astroBundle.question,
    topic: astroBundle.topic,
    eventType: astroBundle.eventType,
    answerMode: astroBundle.answerMode,

    userContext: {
      age: astroBundle.chartRealityProfile?.age,
      lifeStage: astroBundle.chartRealityProfile?.currentLifeStage,
    },

   promise: {
  strength: astroBundle.promiseLayer?.verdict ?? "unclear",
  reasons: [
    astroBundle.promiseLayer?.summary,
    ...(astroBundle.promiseLayer?.bullets ?? []),
    ...(astroBundle.majorWindows?.[0]?.reason
      ? [`Timing engine says: ${astroBundle.majorWindows[0].reason}`]
      : []),
  ].filter(Boolean),
},

    timing: {
  dashaStrength: astroBundle.timingPolicy?.dashaStrength ?? "unclear",
  transitStrength: astroBundle.timingPolicy?.transitStrength ?? "unclear",
  nearTermWindows,
  majorWindows,
  nearTermScore: astroBundle.nearTermWindows?.[0]?.score,
  majorScore: astroBundle.majorWindows?.[0]?.score,
  timingNote: astroBundle.timingConfidenceNote ?? astroBundle.timingPolicy?.note ?? "",
},

    astrology: {
      houses: astroBundle.focusHouses,
      supportHouses: astroBundle.supportHouses,
      karakas: astroBundle.karakas,
      divisionalCharts: astroBundle.divisionalCharts,
      houseLordReasons: extractHouseLordReasons(astroBundle),
      currentDasha: astroBundle.currentDasha,
    },
   planetContributions: buildPlanetContributions(astroBundle),
   moneyReasonMap: buildMoneyReasonMap(astroBundle),
   careerReasonMap: buildCareerReasonMap(astroBundle),
   relationshipReasonMap: buildRelationshipReasonMap(astroBundle),
   conversionDiagnosis,
   whyChain:
  buildWhyChain(
    astroBundle,
    conversionDiagnosis
  ),
    interpretation: {
      supports,
      blockers,
      conversionIssue,
      realLifeManifestations,
      bestUse: astroBundle.actionBias?.bestUse ?? "",
      caution: astroBundle.actionBias?.watchFor ?? "",
    },

    realityCheck: astroBundle.chartRealityProfile,
  };
}
function buildInsightProfile(
  astroBundle: GenericAstroBundle,
  eventType?: AskSarathiEventType
): InsightProfile {
  const diagnostic = astroBundle.diagnosticProfile;

  const nearTermWindows =
    astroBundle.nearTermWindows
      ?.slice(0, 3)
      .map((w) => formatWindowLabel(w.label)) ?? [];

  const majorWindows =
    astroBundle.majorWindows
      ?.slice(0, 2)
      .map((w) => formatWindowLabel(w.label)) ?? [];

  const strengths =
    diagnostic?.strengths?.map((x) => `${x.area}: ${x.why}`) ??
    astroBundle.evidenceBullets?.slice(0, 3) ??
    [];

  const blockers =
    diagnostic?.blockers?.map((x) => `${x.area}: ${x.why}`) ??
    astroBundle.themeSignal?.missingSignals ??
    [];

  const opportunities =
    diagnostic?.topConcerns?.map(
      (x) => `${x.area}: ${x.helpfulAction}`
    ) ??
    astroBundle.eventHints ??
    [];

  const risks =
    diagnostic?.topConcerns?.map(
      (x) => `${x.area}: ${x.watchFor}`
    ) ??
    [astroBundle.actionBias.watchFor];

  const eventLabel = getEventLabel(astroBundle.topic, eventType);

  return {
    topic: astroBundle.topic,
    answerMode: astroBundle.answerMode,
    eventType,
    headline:
      astroBundle.answerMode === "TIMING_FIRST"
        ? `${eventLabel} timing profile`
        : astroBundle.answerMode === "DIAGNOSTIC_FIRST"
        ? `${eventLabel} diagnostic profile`
        : `${eventLabel} guidance profile`,
    coreMessage:
      astroBundle.answerMode === "TIMING_FIRST"
        ? "The chart should be read through both near-term movement and larger structural windows."
        : "The chart should be read through strengths, blockers, risks, and timing rather than a single yes/no answer.",
    strengths,
    blockers,
    opportunities,
    risks,
    nearTermWindows,
    majorWindows,
    bestUse:
      diagnostic?.bestUse ??
      astroBundle.actionBias.bestUse,
    caution:
      diagnostic?.caution ??
      astroBundle.actionBias.watchFor,
    evidence: astroBundle.evidenceBullets ?? [],
    astrologicalDrivers: [
  ...(astroBundle.evidenceBullets ?? []),
  ...(astroBundle.themeSignal?.activeSignals ?? []),
  ...(astroBundle.majorWindows?.[0]?.reason
    ? [`Major window reason: ${astroBundle.majorWindows[0].reason}`]
    : []),
  ...(astroBundle.nearTermWindows?.[0]?.reason
    ? [`Near-term window reason: ${astroBundle.nearTermWindows[0].reason}`]
    : []),
].slice(0, 8),
    confidence: astroBundle.confidence,
  };
}
function buildLifeOverviewProfile(
  astroBundle: GenericAstroBundle,
  report: any
): LifeOverviewProfile {
  const dasha = astroBundle.currentDasha;
  const nearTerm = astroBundle.nearTermWindows?.[0]?.label
    ? formatWindowLabel(astroBundle.nearTermWindows[0].label)
    : undefined;

  const structural = astroBundle.majorWindows?.[0]?.label
    ? formatWindowLabel(astroBundle.majorWindows[0].label)
    : undefined;

  const opportunities: LifeOverviewProfile["opportunities"] = [
    {
      area: "Career visibility and responsibility",
      level: "high",
      why: "The current pattern supports role visibility, responsibility growth, and strategic positioning rather than passive waiting.",
      action: "Take visible ownership, document wins, and build decision-maker relationships.",
    },
    {
      area: "Income stability and practical gains",
      level: "medium",
      why: "Money themes show gradual improvement through consistency, negotiation, and disciplined cash-flow handling.",
      action: "Improve savings rhythm, negotiate with evidence, and avoid relying on one-off payouts.",
    },
    {
      area: "Long-term repositioning",
      level: "medium",
      why: "The dasha/transit pattern supports groundwork, preparation, and alignment before larger structural movement.",
      action: "Use this phase to prepare documents, sharpen skills, and keep options warm.",
    },
  ];

  const challenges: LifeOverviewProfile["challenges"] = [
    {
      area: "Impatience with slow visible results",
      level: "high",
      why: "The chart shows movement building in layers, but external confirmation may come slower than internal pressure expects.",
      watchFor: "Avoid forcing outcomes before timing, people, and paperwork are aligned.",
    },
    {
      area: "Mental load and recovery rhythm",
      level: "medium",
      why: "Health and emotional signals suggest stress, sleep, and recovery rhythm need consistent management.",
      watchFor: "Do not ignore fatigue, scattered focus, or stress-driven habits.",
    },
    {
      area: "Over-dependence on one breakthrough",
      level: "medium",
      why: "Several themes improve through steady compounding rather than one dramatic event.",
      watchFor: "Avoid waiting for one perfect promotion, payout, deal, or opportunity.",
    },
  ];

  return {
    title: "Life overview map",
    opportunities,
    challenges,
    timing: {
      nearTerm,
      structural,
      note:
        "Near-term windows show practical movement; structural windows show the bigger life-cycle shift.",
    },
    focusAdvice:
      "Focus on visibility, disciplined execution, health rhythm, and financial consistency. This is a phase for intelligent preparation and selective action, not scattered effort.",
  };
}
function buildLifeOverviewAnswer(
  astroBundle: GenericAstroBundle,
  report: any
): string {
  const profile = buildLifeOverviewProfile(astroBundle, report);

  const opps = profile.opportunities
    .map(
      (x, i) =>
        `${i + 1}. ${x.area} (${x.level}) — ${x.why} Best use: ${x.action}`
    )
    .join("\n\n")

  const challenges = profile.challenges
    .map(
      (x, i) =>
        `${i + 1}. ${x.area} (${x.level}) — ${x.why} Watch for: ${x.watchFor}`
    )
    .join("\n\n")

  const timingLine = [
    profile.timing.nearTerm
      ? `Near-term movement: ${profile.timing.nearTerm}.`
      : null,
    profile.timing.structural
      ? `Bigger structural window: ${profile.timing.structural}.`
      : null,
    profile.timing.note,
  ]
    .filter(Boolean)
    .join(" ");

 return `${profile.title}

Biggest opportunities:

${opps}

Biggest challenges:

${challenges}

Timing:

${timingLine}

Focus now:

${profile.focusAdvice}`;
}
function buildHolisticDiagnosticAnswer(
  astroBundle: GenericAstroBundle,
  report: any,
  eventType?: AskSarathiEventType
): string {
  const profile = astroBundle.diagnosticProfile ?? buildHolisticDiagnosticProfile({
    question: astroBundle.question,
    topic: astroBundle.topic,
    eventType,
    report,
    astroBundle,
  });
  const diagnosticTitleByTopic: Record<string, string> = {
  money: "Wealth growth diagnostic map",
  career: "Career diagnostic map",
  health: "Health sensitivity map",
  property: "Property readiness map",
  relationships: "Relationship readiness map",
  marriage: "Marriage readiness map",
  relocation: "Relocation readiness map",
  vehicle: "Vehicle decision map",
};

const diagnosticTitle =
  diagnosticTitleByTopic[astroBundle.topic] ?? "Life-area diagnostic map";
  const topicLabel = getEventLabel(astroBundle.topic, eventType);
  const diagnosticContextByTopic: Record<string, string> = {
  money: "The chart is pointing to these main wealth-growth themes rather than one single yes/no event.",
  career: "The chart is pointing to these main career-development themes rather than one single yes/no event.",
  health: "The chart is pointing to these main health sensitivities rather than one single diagnosis.",
  property: "The chart is pointing to these main property-readiness themes rather than one single yes/no event.",
  relationships: "The chart is pointing to these main relationship patterns rather than one single yes/no event.",
  marriage: "The chart is pointing to these main marriage-readiness themes rather than one single yes/no event.",
  relocation: "The chart is pointing to these main relocation factors rather than one single yes/no event.",
  vehicle: "The chart is pointing to these main vehicle-decision factors rather than one single yes/no event.",
  disputes: "The chart is pointing to these main conflict-resolution themes rather than one single yes/no event.",
  child: "The chart is pointing to these main child/family themes rather than one single yes/no event.",
  inner: "The chart is pointing to these main inner-growth themes rather than one single yes/no event.",
};

const contextLine =
  diagnosticContextByTopic[astroBundle.topic] ??
  `For ${topicLabel}, the chart is pointing to these main areas rather than one single yes/no event.`;
  const concernLines = profile.topConcerns
    .slice(0, 3)
    .map(
  (x, i) =>
    `${i + 1}. ${x.area} (${x.level}) — ${x.why}\n\nWatch for: ${x.watchFor}. Best use: ${x.helpfulAction}.`
)
.join("\n\n");

  const strengthLines = profile.strengths
    .slice(0, 2)
    .map((x) => `• ${x.area}: ${x.why}`)
    .join("\n\n");

  const blockerLines = profile.blockers
    .slice(0, 2)
    .map((x) => `• ${x.area}: ${x.why}`)
    .join("\n\n");

  const timingLine = [
    profile.timingWindows.nearTerm ? `Near-term watch window: ${profile.timingWindows.nearTerm}.` : null,
    profile.timingWindows.structural ? `Bigger structural window: ${profile.timingWindows.structural}.` : null,
    profile.timingWindows.note,
  ]
    .filter(Boolean)
    .join(" ");

  const medicalNote = astroBundle.topic === "health"
    ? "\n\nMedical note: this is an astrology-based sensitivity map, not a diagnosis. Please use a doctor for symptoms, tests, medication, or urgent concerns."
    : "";

  return `${diagnosticTitle}

${contextLine}

Top areas to watch:
${concernLines}

Strengths/support:
${strengthLines}

Likely blockers:
${blockerLines}

Timing:
${timingLine}

Best use: ${profile.bestUse}

Watch for: ${profile.caution}${medicalNote}`;
}

function normalizeProfile(p: any): NormalizedProfile | null {
  if (!p || typeof p !== "object") return null;

  const name = p.name ?? p.fullName ?? p.profileName ?? undefined;
  const dobISO =
    p.dobISO ??
    p.dateISO ??
    p.birthDateISO ??
    p.birth?.dateISO ??
    p.birth?.birthDateISO ??
    p.profile?.birthDateISO ??
    undefined;

  const tob =
    p.tob ??
    p.time ??
    p.birthTime ??
    p.birth?.time ??
    p.birth?.birthTime ??
    p.profile?.birthTime ??
    undefined;

  const placeObj = p.place ?? p.birth?.place ?? p.profile?.place ?? null;
  const tz =
    placeObj?.tz ??
    p.tz ??
    p.birthTz ??
    p.birth?.tz ??
    p.profile?.birthTz ??
    undefined;

  const lat =
    placeObj?.lat ??
    p.lat ??
    p.birthLat ??
    p.birth?.lat ??
    p.profile?.lat ??
    undefined;

  const lon =
    placeObj?.lon ??
    p.lon ??
    p.birthLon ??
    p.birth?.lon ??
    p.profile?.lon ??
    undefined;

  return {
    name,
    dobISO,
    tob,
    place:
      tz != null || lat != null || lon != null
        ? {
            name: placeObj?.name ?? p.placeName ?? p.birthPlace ?? "",
            tz: String(tz ?? ""),
            lat: Number(lat),
            lon: Number(lon),
          }
        : undefined,
  };
}
function getDashaAtYear(report: any, year: number): DashaAtTime | null {
  const rows = Array.isArray(report?.dashaTimeline)
  ? report.dashaTimeline
  : Array.isArray(report?.timeline)
  ? report.timeline
  : [];
  if (!rows.length) return null;

  for (const row of rows) {
    const startKey = normalizeTimeKey(
      row?.start ?? row?.from ?? row?.startISO ?? row?.mahadasha?.start ?? row?.range?.start
    );
    const endKey = normalizeTimeKey(
      row?.end ?? row?.to ?? row?.endISO ?? row?.mahadasha?.end ?? row?.range?.end
    );

    if (!startKey || !endKey) continue;

    const startYear = Number(startKey.slice(0, 4));
    const endYear = Number(endKey.slice(0, 4));

    if (!Number.isFinite(startYear) || !Number.isFinite(endYear)) continue;

    if (year >= startYear && year <= endYear) {
      const md =
        safePlanetName(
          row?.md ??
          row?.mahadasha?.lord ??
          row?.mahadasha ??
          row?.majorLord ??
          row?.lord
        ) ?? null;

      const ad =
        safePlanetName(
          row?.ad ??
          row?.antardasha?.lord ??
          row?.antardasha?.subLord ??
          row?.subLord ??
          row?.sub
        ) ?? null;

      const pd =
        safePlanetName(
          row?.pd ??
          row?.pratyantardasha?.lord ??
          row?.pratyantardasha?.subLord ??
          row?.pratyantar ??
          row?.pratyantardashaLord
        ) ?? null;

      return {
        md,
        ad,
        pd,
        start: startKey,
        end: endKey,
      };
    }
  }

  return null;
}
function getActiveDashaAnyShape(report: any) {
  const ap = report?.activePeriods ?? {};
  const md = ap?.mahadasha?.lord ?? report?.activeDasha?.md ?? null;
  const ad = ap?.antardasha?.subLord ?? report?.activeDasha?.ad ?? null;
  const pd = ap?.pratyantardasha?.lord ?? report?.activeDasha?.pd ?? null;

  const line =
    [md, ad, pd]
      .filter(Boolean)
      .join(" • ") || null;

  return {
    md,
    ad,
    pd,
    line,
    ranges: {
      md: ap?.mahadasha
        ? `${fmtDateShort(ap.mahadasha.start)} – ${fmtDateShort(ap.mahadasha.end)}`
        : null,
      ad: ap?.antardasha
        ? `${fmtDateShort(ap.antardasha.start)} – ${fmtDateShort(ap.antardasha.end)}`
        : null,
      pd: ap?.pratyantardasha
        ? `${fmtDateShort(ap.pratyantardasha.start)} – ${fmtDateShort(ap.pratyantardasha.end)}`
        : null,
    },
  };
}

function detectTopic(question: string): AskSarathiDomain {
  const q = question.toLowerCase().trim();

  if (/\b(education|study|studies|exam|college|university|degree|learning)\b/.test(q)) return "education";
  if (/\b(mother|father|parents|parent|family elder)\b/.test(q)) return "parents";
  if (/\b(brother|sister|sibling|siblings)\b/.test(q)) return "siblings";
  if (/\b(business|startup|entrepreneur|self employed|own business|partnership business)\b/.test(q)) return "business";
  if (/\b(travel|trip|journey|visa|overseas travel|pilgrimage)\b/.test(q)) return "travel";
  if (/\b(spiritual|sadhana|mantra|meditation|moksha|guru|temple)\b/.test(q)) return "spiritual";
  if (/\b(reputation|fame|recognition|public image|status|visibility)\b/.test(q)) return "reputation";
  if (/\b(loan|debt|emi|mortgage|liability|borrowing|repayment)\b/.test(q)) return "debt";
  if (/\b(inheritance|legacy|will|ancestral|insurance settlement)\b/.test(q)) return "inheritance";
  if (/\b(anxiety|depression|mental health|overthinking|restless|panic|mood)\b/.test(q)) return "mental_health";
  if (/\b(pet|dog|cat|animal)\b/.test(q)) return "pets";

  if (/\b(marriage|married|spouse|wedding)\b/.test(q)) {
    return "marriage";
  }

  if (/\b(relationship|partner|love|boyfriend|girlfriend|meet someone|meet somebody|dating|date someone|new person|someone new)\b/.test(q)) {
  return "relationships";
}

  if (/\b(job|career|profession|promotion|promoted|work|boss|get promoted|role change|switch job|change my job)\b/.test(q)) {
    return "career";
  }

  if (/\b(money|wealth|income|finance|salary|bonus)\b/.test(q)) {
    return "money";
  }

  if (/\b(property|house|home|flat|land|plot|real estate)\b/.test(q)) {
    return "property";
  }

  if (/\b(relocation|relocate|move|abroad|foreign)\b/.test(q)) {
    return "relocation";
  }

 if (/\b(child|children|baby|pregnancy|conceive|father|mother|became a father|became father|became a mother|became mother|parenthood)\b/.test(q)) {
  return "child";
}

  if (/\b(health|body|illness|recovery|stress|sleep)\b/.test(q)) {
    return "health";
  }

  if (/\b(vehicle|car|bike|automobile)\b/.test(q)) {
    return "vehicle";
  }

  if (/\b(dispute|legal|court|case|conflict)\b/.test(q)) {
    return "disputes";
  }

  if (/\b(purpose|meaning|inner|direction|lost|confused)\b/.test(q)) {
    return "inner";
  }
  if (
  /\bbusiness\b|\bstart a business\b|\bown business\b|\bentrepreneur\b|\bself employed\b/.test(q)
) {
  return "career";
}
  for (const rule of TOPIC_RULES) {
    if (rule.keywords.some((kw) => q.includes(kw))) return rule.topic;
  }
if (/\b(single|still single|why am i single|why am i still single|dating|date someone|meet someone|someone new)\b/.test(q)) {
  return "relationships";
}

if (/\bwealth growth|wealth|financial growth|income growth|money growth|cash flow|earning growth\b/.test(q)) {
  return "money";
}

if (/\bpreventing me from buying|buying a house|buy my own house|house purchase|home purchase\b/.test(q)) {
  return "property";
}
  return "generic";
}
function isFollowupContinuationQuestion(question: string): boolean {
  const q = question.toLowerCase().trim();

  return (
    /\btill when\b/.test(q) ||
    /\buntil when\b/.test(q) ||
    /\bhow long\b/.test(q) ||
    /\bwhen will this end\b/.test(q) ||
    /\bwhen does this end\b/.test(q) ||
    /\bhow long will this continue\b/.test(q) ||
    /\bwhat happens after that\b/.test(q) ||
    /\bthen what\b/.test(q)
  );
}

function extractConversationState(historyInput: any = []): ConversationState {
  const history: Array<{ role: string; content: string }> = Array.isArray(historyInput)
    ? historyInput
    : [];

  const reversed = [...history].reverse();

  // 1) First pass: ONLY most recent user intent.
  // This prevents assistant wording from hijacking the topic.
  for (const msg of reversed) {
    if (msg.role !== "user") continue;

    const t = msg.content?.toLowerCase?.() || "";

    if (/\b(promotion|promoted|salary increase|salary increment|increment|title change|career elevation|formal elevation)\b/.test(t)) {
      return {
        lastTopic: "career",
        lastEventType: "promotion",
        lastCareerEventType: "promotion",
        lastAnswerMode: "TIMING_FIRST",
      };
    }

    if (/\b(job change|change my job|switch job|switch my job|new job|external move|employer change|interview|recruiter|offer|resign|resignation)\b/.test(t)) {
      return {
        lastTopic: "career",
        lastEventType: "generic_event",
        lastCareerEventType: "job_change",
        lastAnswerMode: "TIMING_FIRST",
      };
    }

    if (/\bcareer|work|role|boss|responsibility|visibility\b/.test(t)) {
      return {
        lastTopic: "career",
        lastEventType: "generic_event",
        lastCareerEventType: "generic",
        lastAnswerMode: "DIAGNOSTIC_FIRST",
      };
    }

    if (/\b(car|vehicle|bike|automobile|purchase.*car|buy.*car|buying.*car|car purchase|vehicle purchase)\b/.test(t)) {
      return {
        lastTopic: "vehicle",
        lastEventType: "buy_vehicle",
        lastAnswerMode: "TIMING_FIRST",
      };
    }

    if (/\bhouse|property|home|flat|land|real estate|registration|possession\b/.test(t)) {
      return {
        lastTopic: "property",
        lastEventType: "buy_property",
        lastAnswerMode: "DIAGNOSTIC_FIRST",
      };
    }

    if (/\bwealth|money|income|salary|bonus|cash flow|financial|finance\b/.test(t)) {
      return {
        lastTopic: "money",
        lastEventType: "salary_increase",
        lastAnswerMode: "DIAGNOSTIC_FIRST",
      };
    }

    if (/\bsingle|relationship|love|partner|dating|marriage|spouse|wedding\b/.test(t)) {
      return {
        lastTopic: "relationships",
        lastEventType: "new_relationship",
        lastAnswerMode: "DIAGNOSTIC_FIRST",
      };
    }

    if (/\bhealth|sleep|stress|fatigue|recovery|illness|symptom\b/.test(t)) {
      return {
        lastTopic: "health",
        lastEventType: "health_checkup",
        lastAnswerMode: "DIAGNOSTIC_FIRST",
      };
    }

    if (/\babroad|foreign|relocation|move abroad|visa|overseas\b/.test(t)) {
      return {
        lastTopic: "relocation",
        lastEventType: "foreign_move",
        lastAnswerMode: "TIMING_FIRST",
      };
    }
  }

  // 2) Second pass: assistant fallback only if no recent user intent found.
  // Keep this conservative.
  for (const msg of reversed) {
    if (msg.role !== "assistant") continue;

    const t = msg.content?.toLowerCase?.() || "";

    if (/\bpromotion|promoted|title change|formal elevation|salary increment\b/.test(t)) {
      return {
        lastTopic: "career",
        lastEventType: "promotion",
        lastCareerEventType: "promotion",
        lastAnswerMode: "TIMING_FIRST",
      };
    }

    if (/\bjob change|external move|employer change|interview|recruiter|offer movement|resignation\b/.test(t)) {
      return {
        lastTopic: "career",
        lastEventType: "generic_event",
        lastCareerEventType: "job_change",
        lastAnswerMode: "TIMING_FIRST",
      };
    }

    if (/\bvehicle purchase|car purchase|buying a car|buy a car\b/.test(t)) {
      return {
        lastTopic: "vehicle",
        lastEventType: "buy_vehicle",
        lastAnswerMode: "TIMING_FIRST",
      };
    }

    if (/\bproperty purchase|buying property|registration|possession|real estate\b/.test(t)) {
      return {
        lastTopic: "property",
        lastEventType: "buy_property",
        lastAnswerMode: "DIAGNOSTIC_FIRST",
      };
    }
  }

  return {};
}
function inferFollowupTopic(
  question: string,
  historyInput: any = []
): AskSarathiDomain | null {
  const q = question.toLowerCase();
  const history: Array<{ role: string; content: string }> = Array.isArray(historyInput)
  ? historyInput
  : [];
  // If user already explicitly asked new topic
  if (
    /\bcareer|job|promotion|promoted|salary|work|boss|role\b/.test(q)
  ) return "career";

  if (
    /\bcar|vehicle|drive\b/.test(q)
  ) return "vehicle";

  if (
    /\bproperty|house|home|real estate\b/.test(q)
  ) return "property";

  if (
    /\bmarriage|relationship|partner|love\b/.test(q)
  ) return "relationships";

  // FOLLOW-UP DETECTION
  if (
    /\bwhen|timeline|date|next window|next phase|exactly when\b/.test(q)
  ) {
    const reversed = [...history].reverse();

    for (const msg of reversed) {
      const t = msg.content?.toLowerCase?.() || "";

      if (/\bcar|vehicle\b/.test(t)) return "vehicle";
      if (/\bcareer|job|promotion\b/.test(t)) return "career";
      if (/\bproperty|home\b/.test(t)) return "property";
      if (/\brelationship|marriage|partner\b/.test(t)) return "relationships";
      if (/\bmoney|finance|income\b/.test(t)) return "money";
    }
  }

  return null;
}
function isLifeOverviewQuestion(question: string): boolean {
  const q = question.toLowerCase().trim();

  return (
    /\bbiggest opportunities\b/.test(q) ||
    /\bbiggest challenges\b/.test(q) ||
    /\bopportunities and challenges\b/.test(q) ||
    /\bwhat should i focus on\b/.test(q) ||
    /\bwhat is happening in my life\b/.test(q) ||
    /\blife right now\b/.test(q) ||
    /\bmain themes\b/.test(q) ||
    /\bcurrent life theme\b/.test(q)
  );
}
function detectDiagnosticIntent(question: string): boolean {
  const q = question.toLowerCase().trim();

  return (
    /\bwhat is blocking\b/.test(q) ||
    /\bwhat is stopping\b/.test(q) ||
    /\bwhat is preventing\b/.test(q) ||
    /\bwhy am i\b/.test(q) ||
    /\bwhy is\b/.test(q) ||
    /\bwhy do i\b/.test(q) ||
    /\bwhat kind of\b/.test(q) ||
    /\bwhat type of\b/.test(q) ||
    /\bconcerned about\b/.test(q) ||
    /\bwhat should i be careful\b/.test(q) ||
    /\bbiggest challenge\b/.test(q) ||
    /\bbiggest challenges\b/.test(q) ||
    /\bbiggest opportunity\b/.test(q) ||
    /\bbiggest opportunities\b/.test(q) ||
    /\bweakness\b/.test(q) ||
    /\bwhy have i not\b/.test(q) ||
/\bwhy haven't i\b/.test(q) ||
/\bwhy did i not\b/.test(q) ||
/\bwhy didn(?:'|’)t i\b/.test(q) ||
    /\bstrength\b/.test(q)
  );
}
function detectAnswerMode(
  question: string,
  topic: AskSarathiDomain,
  questionType: AskSarathiQuestionType
): AnswerMode {
  const q = question.toLowerCase().trim();
  if (isLifeOverviewQuestion(question)) {
  return "DIAGNOSTIC_FIRST";
}
  if (detectDiagnosticIntent(question)) {
  return "DIAGNOSTIC_FIRST";
}
  if (
    questionType === "diagnosis" ||
    /\bwhat kind of\b/.test(q) ||
    /\bwhat type of\b/.test(q) ||
    /\bconcerned about\b/.test(q) ||
    /\bwhat should i be careful\b/.test(q) ||
    /\bwhat is blocking\b/.test(q) ||
    /\bwhat is stopping\b/.test(q) ||
    /\bwhy am i\b/.test(q) ||
    /\bwhy is\b/.test(q)
  ) {
    return "DIAGNOSTIC_FIRST";
  }

  if (
    questionType === "decision" ||
    /\bshould i\b/.test(q) ||
    /\bis it good to\b/.test(q)
  ) {
    return "DECISION_FIRST";
  }

  if (
    questionType === "action_plan" ||
    /\bhow can i\b/.test(q) ||
    /\bhow should i\b/.test(q) ||
    /\bwhat should i do\b/.test(q)
  ) {
    return "STRATEGY_FIRST";
  }

  if (
    questionType === "type_profile" ||
    /\btell me about\b/.test(q) ||
    /\bwhat does my chart say\b/.test(q)
  ) {
    return "PROFILE_FIRST";
  }

  return "TIMING_FIRST";
}
function detectQuestionType(question: string): AskSarathiQuestionType {
  const q = question.toLowerCase().trim();

  // Diagnostic / "what and why" questions must be detected before type_profile.
  // Example: "what kind of health issues should I be concerned about and when"
  if (
    /\bwhat kind of (health |career |money |relationship |property |vehicle |relocation )?(issue|issues|problem|problems|risk|risks|blockage|blockages|challenge|challenges|concern|concerns)\b/.test(q) ||
    /\b(what|which) (health )?(issue|issues|problem|problems|risk|risks|concern|concerns|blockage|blockages|challenge|challenges)\b/.test(q) ||
    /\bshould i be concerned\b|\bconcerned about\b|\bwatch out for\b|\bwhat is blocking\b|\bmain blocker\b|\bwhy am i stuck\b/.test(q) ||
    /\bwhy is\b|\bwhy am i\b|\bwhy does\b|\bwhy stuck\b|\bwhy delayed\b|\bwhat is happening\b/.test(q)
  ) {
    return "diagnosis";
  }

  // TYPE PROFILE: used for "what kind/type" outputs, not diagnostic risk/blocker questions.
  if (
    /\bwhat kind\b|\bwhich type\b|\bwhat type\b|\bwhich one\b|\bwhat car\b|\bwhich car\b|\bwhat house\b|\bwhich house\b|\bwhat job\b|\bwhich career\b/.test(q)
  ) {
    return "type_profile";
  }

  if (
    /\bcompare\b|\bvs\b|\bversus\b|\bor wait\b|\bor stay\b|\bor switch\b|\bstay employed\b|\bstart a business\b|\bbusiness or job\b|\bjob or business\b|\bemployment or business\b/.test(q)
  ) {
    return "comparison";
  }

  if (
    /\bwhen\b|\bwhich month\b|\bwhich year\b|\btiming\b|\bwindow\b|\bdate\b/.test(q)
  ) {
    return "timing";
  }

  if (
    /\bshould i\b|\bcan i\b|\bis it good to\b|\bis this a good time\b/.test(q)
  ) {
    return "decision";
  }

  if (
    /\bwill i\b|\bwill my\b|\bis it likely\b|\bcan this happen\b/.test(q)
  ) {
    return "prediction";
  }

  if (
    /\bremedy\b|\bremedies\b|\bupaya\b|\bmantra\b|\bpooja\b|\bgem\b|\bstone\b|\bwear\b/.test(q)
  ) {
    return "remedy";
  }

  if (
    /\bwhat should i do\b|\bwhat to do\b|\bnext step\b|\baction plan\b|\bhow should i move\b/.test(q)
  ) {
    return "action_plan";
  }

  if (
    /\banxious\b|\bworried\b|\bscared\b|\bstressed\b|\blost\b|\bhopeless\b|\bemotionally\b/.test(q)
  ) {
    return "emotional_support";
  }

  if (
    /\b(how is|how's|hows)\s+my\s+day\b|\b(how is|how's|hows)\s+today\b|\btoday\s+looking\b|\bfocus\s+on\s+today\b|\bhow\s+will\s+today\s+be\b/.test(q)
  ) {
    return "daily_outlook";
  }

  if (/jupiter transit|saturn transit|transit/i.test(q)) {
    return "transit_analysis";
  }

  return "generic";
}
function detectTimeDirection(
  question: string,
  topic: AskSarathiDomain
): TimeDirection {
  const q = question.toLowerCase().trim();

  // profession / identity questions first
  // these should not get hijacked by "current"
  if (
    topic === "career" &&
    /\b(what is my profession|what is my current profession|current profession|current job|what do i do|what kind of work|line of work|industry|field|career type|am i in|do i work in|job type|businessman|self employed|service or business)\b/.test(q)
  ) {
    return "identity";
  }

  // past questions
  if (
    /\b(when did|when was|what year did|in which year did|have i already|did i already|past|earlier|previously|first job|got married|married|my first job)\b/.test(q)
  ) {
    return "past";
  }

  // future questions
  // keep this before present so "when will" always wins
  if (
    /\b(will i|when will|upcoming|future|next|later|going to|get promoted|promotion|change my job|job change|switch job|switch my job)\b/.test(q)
  ) {
    return "future";
  }

  // present questions
  if (
    /\b(now|currently|at present|right now|what is happening|what's happening|current phase|these days|today)\b/.test(q)
  ) {
    return "present";
  }

  return "mixed";
}
type FuturePhaseStrength = "strong" | "moderate" | "weak";

function getFuturePhaseStrength(
  topic: AskSarathiDomain,
  timingPolicy?: {
    dashaStrength: "strong" | "moderate" | "mixed" | "weak";
    transitStrength: "strong" | "moderate" | "mixed" | "weak";
    allowSharpWindow: boolean;
    note: string;
  },
  careerEventType?: CareerEventType
): FuturePhaseStrength {
  if (!timingPolicy) return "weak";

  const isCareerMovement =
    topic === "career" &&
    ["promotion", "job_change", "internal_shift", "stability_check"].includes(
      careerEventType ?? ""
    );

  if (isCareerMovement) {
    if (timingPolicy.dashaStrength === "strong" && timingPolicy.transitStrength !== "weak") {
      return "moderate";
    }
    if (timingPolicy.dashaStrength === "moderate") {
      return "moderate";
    }
    return "weak";
  }

  if (timingPolicy.dashaStrength === "strong" && timingPolicy.transitStrength !== "weak") {
    return "strong";
  }

  if (timingPolicy.dashaStrength === "moderate") {
    return "moderate";
  }

  return "weak";
}
function detectEventScale(
  question: string,
  topic: AskSarathiDomain
): EventScale {
  const q = question.toLowerCase().trim();

  if (
    /\b(marriage|married|wedding|spouse|first job|career start|buy a house|property purchase|child birth|relocation abroad)\b/.test(q)
  ) {
    return "major";
  }

    if (
    /\b(job change|change my job|switch job|switch my job|get promoted|promotion|role change|role shift|transfer|department change|career move|career change)\b/.test(q)
  ) {
    return "major";
  }

  if (
    /\b(relationship start|vehicle purchase|move abroad|shift abroad)\b/.test(q)
  ) {
    return "medium";
  }

  if (
    topic === "career" &&
    /\b(what is my profession|what is my current profession|current profession|current job|job type|line of work|industry|field|what do i do)\b/.test(q)
  ) {
    return "major";
  }

  return "micro";
}
function isProfessionIdentityQuestion(
  question: string,
  topic: AskSarathiDomain
): boolean {
  if (topic !== "career") return false;

  const q = question.toLowerCase().trim();

  const strongIdentityPatterns = [
    /\bwhat is my profession\b/i,
    /\bwhat is my current profession\b/i,
    /\bcurrent profession\b/i,
    /\bwhat do i do\b/i,
    /\bwhat kind of work\b/i,
    /\bline of work\b/i,
    /\bcareer type\b/i,
    /\bjob type\b/i,
    /\bam i in finance\b/i,
    /\bam i in banking\b/i,
    /\bam i a businessman\b/i,
    /\bself employed\b/i,
    /\bservice or business\b/i,
  ];

  const negativeTimingPatterns = [
    /\bwhen will\b/i,
    /\bwill i\b/i,
    /\bwhen did\b/i,
    /\bwhen was\b/i,
    /\bget promoted\b/i,
    /\bpromotion\b/i,
    /\bchange my job\b/i,
    /\bjob change\b/i,
    /\bswitch job\b/i,
    /\bswitch my job\b/i,
    /\bleave my job\b/i,
    /\bcurrent phase\b/i,
    /\btoday\b/i,
    /\bcurrently\b/i,
    /\bright now\b/i,
  ];

  const strongHits = strongIdentityPatterns.filter((re) => re.test(q)).length;
  const negativeHits = negativeTimingPatterns.filter((re) => re.test(q)).length;

  return strongHits > 0 && negativeHits === 0;
}
function resolveEventConversionRule(
  topic: AskSarathiDomain,
  eventType?: AskSarathiEventType,
  baseRule?: TopicRule
) {
  if (eventType && EVENT_CONVERSION_RULES[eventType]) {
    return EVENT_CONVERSION_RULES[eventType]!;
  }

  const rule = baseRule ?? resolveTopicRule(topic);

  return {
    houses: rule.houses,
    supportHouses: rule.supportHouses ?? [],
    karakas: rule.karakas,
    divisionalCharts: rule.divisionalCharts,
    language: `${topic} movement or visible outcome`,
  };
}
function resolveTopicRule(topic: AskSarathiDomain): TopicRule {
  return (
    TOPIC_RULES.find((x) => x.topic === topic) ?? {
      topic: "generic",
      houses: [],
      supportHouses: [],
      karakas: [],
      divisionalCharts: ["D1"],
      remediesAllowed: false,
      timingImportant: false,
      keywords: [],
    }
  );
}
const CAREER_EVENT_RULES: Partial<
  Record<
    CareerEventType,
    {
      houses: number[];
      supportHouses: number[];
      karakas: string[];
      windowLanguage: string;
    }
  >
> = {
  promotion: {
    houses: [10, 11],
    supportHouses: [2, 6],
    karakas: ["Sun", "Saturn", "Jupiter"],
    windowLanguage:
      "promotion, title elevation, recognition, reward, formal role upgrade",
  },
  career_movement: {
  houses: [10, 6, 11, 3, 12, 2],
  supportHouses: [9],
  karakas: ["Sun", "Saturn", "Mercury", "Jupiter", "Rahu"],
  windowLanguage:
    "promotion, salary review, internal movement, interviews, offer movement, resignation thinking, or employer change",
},
  job_change: {
    houses: [3, 6, 10, 12],
    supportHouses: [2, 11],
    karakas: ["Rahu", "Mercury", "Saturn"],
    windowLanguage:
      "applications, recruiter contact, interviews, resignation thinking, offer movement, employer change",
  },
 
  internal_shift: {
    houses: [6, 10, 11],
    supportHouses: [3],
    karakas: ["Saturn", "Mercury", "Sun"],
    windowLanguage:
      "team change, role reshuffle, reporting-line movement, internal repositioning",
  },

  stability_check: {
    houses: [6, 10],
    supportHouses: [2, 11],
    karakas: ["Saturn", "Sun", "Mercury"],
    windowLanguage:
      "job stability, workload, role continuity, risk of disruption",
  },
};
function hasValidProfile(profile: NormalizedProfile | null): boolean {
  return !!(
    profile?.dobISO &&
    profile?.tob &&
    Number.isFinite(Number(profile?.place?.lat)) &&
    Number.isFinite(Number(profile?.place?.lon)) &&
    profile?.place?.tz
  );
}
function sameBirth(profile: NormalizedProfile | null, report: any): boolean {
  if (!profile || !report) return false;

  const rb = report?.birth ?? {};

  return (
    String(profile?.dobISO ?? "") === String(rb?.dateISO ?? "") &&
    String(profile?.tob ?? "") === String(rb?.time ?? "") &&
    String(profile?.place?.tz ?? "") === String(rb?.tz ?? "") &&
    Number(profile?.place?.lat ?? NaN) === Number(rb?.lat ?? NaN) &&
    Number(profile?.place?.lon ?? NaN) === Number(rb?.lon ?? NaN)
  );
}
/* --------------------------------------------------
   Generic analysis helpers
-------------------------------------------------- */
function formatWindowRangeFromLabels(labels: string[]) {
  const dates = labels
    .map((label) => String(label).match(/(\d{4})-(\d{2})-(\d{2})/)?.[0])
    .filter(Boolean) as string[];

  if (!dates.length) return labels.map(formatWindowLabel).join(", ");

  dates.sort();

  const first = formatWindowLabel(dates[0]);
  const last = formatWindowLabel(dates[dates.length - 1]);

  return first === last ? first : `${first} to ${last}`;
}
function formatWindowLabel(label: string) {
  return label.replace(
    /(\d{4})-(\d{2})-(\d{2})/g,
    (_m, y, m, d) => `${d}-${m}-${y}`
  );
}
function getRelevantTransits(report: any, topic: AskSarathiDomain) {
  const topicText = topic.toLowerCase();
  const windows = [
    ...(Array.isArray(report?.topTransits) ? report.topTransits : []),
    ...(Array.isArray(report?.transitWindows) ? report.transitWindows : []),
  ];

  return windows
    .map((x: any) => ({
      title: safeStr(x?.title || x?.driver || x?.target || x?.planet),
      summary: safeStr(x?.description || x?.summary),
      category: safeStr(x?.category || x?.focusArea),
      start: x?.startISO || x?.from || null,
      end: x?.endISO || x?.to || null,
      strength: typeof x?.strength === "number" ? x.strength : null,
    }))
    .filter((x: any) => {
      const blob = `${x.title} ${x.summary} ${x.category}`.toLowerCase();
      return !topicText || blob.includes(topicText) || x.category === "general" || blob.includes("h4") || blob.includes("h5") || blob.includes("h7") || blob.includes("h10");
    })
    .slice(0, 6);
}
function buildPastMarriageWindows(report: any): TimingWindow[] {
  const birthYear = getBirthYear(report);
  const todayISO = getTodayISOForTiming(report);
  const todayYear = Number(todayISO.slice(0, 4));

  if (!Number.isFinite(birthYear as number) || !Number.isFinite(todayYear)) {
    return buildPastWindows(report);
  }

  const scored: Array<{
    year: number;
    score: number;
    reasons: string[];
  }> = [];

  for (let year = (birthYear as number) + 18; year <= todayYear; year++) {
    const row = scoreMarriagePastYear(report, year);
    if (row.score <= 0) continue;

    scored.push({
      year,
      score: row.score,
      reasons: row.reasons,
    });
  }

  if (!scored.length) {
    return buildPastWindows(report);
  }

  // build clusters of adjacent strong years
  const threshold = 55;
  const strong = scored.filter((x) => x.score >= threshold).sort((a, b) => a.year - b.year);

  const clusters: Array<{
    startYear: number;
    endYear: number;
    peakYear: number;
    peakScore: number;
    totalScore: number;
    reasons: string[];
  }> = [];

  for (const row of strong) {
    const last = clusters[clusters.length - 1];
    if (!last || row.year > last.endYear + 1) {
      clusters.push({
        startYear: row.year,
        endYear: row.year,
        peakYear: row.year,
        peakScore: row.score,
        totalScore: row.score,
        reasons: [...row.reasons],
      });
    } else {
      last.endYear = row.year;
      last.totalScore += row.score;
      if (row.score > last.peakScore) {
        last.peakScore = row.score;
        last.peakYear = row.year;
        last.reasons = [...row.reasons];
      }
    }
  }

  // prefer earliest strong plausible cluster, not just highest late spike
  const ranked = clusters
    .map((c) => {
      let rankScore = c.totalScore;

const peakAge = getAgeAtYear(report, c.peakYear);

// prefer realistic first marriage age window
if (peakAge != null) {
  if (peakAge >= 24 && peakAge <= 31) {
    rankScore += 25; // ideal first marriage band
  } else if (peakAge >= 22 && peakAge <= 34) {
    rankScore += 15;
  } else if (peakAge < 22) {
    rankScore -= 25; // too early → unlikely
  } else if (peakAge > 34) {
    rankScore -= 12; // later repeat window → slightly penalized
  }
}

      return { ...c, rankScore };
    })
    .sort((a, b) => b.rankScore - a.rankScore)
    .slice(0, 3);

 return ranked.map((row) => {
  const span = row.endYear - row.startYear;

  let label = `${row.peakYear}`;
  if (span === 1 || span === 2) {
    label = `${row.startYear} to ${row.endYear}`;
  } else if (span > 2) {
    label = `${row.peakYear - 1} to ${row.peakYear + 1}`;
  }

  return {
    label,
    start: String(row.startYear),
    end: String(row.endYear),
    peak: String(row.peakYear),
    why: row.reasons,
  };
});
}
function buildPastWindows(report: any): TimingWindow[] {
  const out: TimingWindow[] = [];
  const todayISO = getTodayISOForTiming(report);

  const eventTimeline = Array.isArray(report?.eventTimeline)
    ? report.eventTimeline.filter((row: any) => isPastWindow(row, todayISO))
    : [];

  const eventMonthTimeline = Array.isArray(report?.eventMonthTimeline)
    ? report.eventMonthTimeline.filter((row: any) => isPastWindow(row, todayISO))
    : [];

  const historicalTimeline = Array.isArray(report?.dashaTimeline)
    ? report.dashaTimeline
    : Array.isArray(report?.timeline)
    ? report.timeline
    : [];

  // 1. Best source: eventTimeline with year-style windows
  for (const row of eventTimeline.slice(0, 3)) {
    out.push({
      label: `${row.start} to ${row.end}`,
      start: row.start != null ? String(row.start) : null,
      end: row.end != null ? String(row.end) : null,
      peak: row.peak != null ? String(row.peak) : null,
      why: [row.peak ? `Peak year around ${row.peak}` : "Historical event activation"],
    });
  }

  // 2. Second source: eventMonthTimeline
  if (!out.length) {
    for (const row of eventMonthTimeline.slice(0, 3)) {
      out.push({
        label: `${formatMonthLabel(row.start)} to ${formatMonthLabel(row.end)}`,
        start: row.start != null ? String(row.start) : null,
        end: row.end != null ? String(row.end) : null,
        peak: row.peak != null ? String(row.peak) : null,
        why: [
          row.peak
            ? `Peak trigger around ${formatMonthLabel(row.peak)}`
            : "Historical monthly activation",
        ],
      });
    }
  }

  // 3. Final fallback: build year windows from dasha/timeline rows
  if (!out.length && historicalTimeline.length) {
  const birthYear = getBirthYear(report);

  const filteredTimeline = historicalTimeline.filter((row: any) => {
    const start =
      row?.start ??
      row?.from ??
      row?.startISO ??
      row?.mahadasha?.start ??
      row?.range?.start ??
      null;

    const end =
      row?.end ??
      row?.to ??
      row?.endISO ??
      row?.mahadasha?.end ??
      row?.range?.end ??
      null;

    const startYearMatch = String(start ?? "").match(/\b(19|20)\d{2}\b/);
    const endYearMatch = String(end ?? "").match(/\b(19|20)\d{2}\b/);

    const startYear = startYearMatch ? Number(startYearMatch[0]) : null;
    const endYear = endYearMatch ? Number(endYearMatch[0]) : null;

    if (!birthYear) return true;

    const minAge = 18;
    const maxAge = 60;

    const validStart = startYear != null ? startYear >= birthYear + minAge : false;
    const validEnd = endYear != null ? endYear <= birthYear + maxAge : false;

    return validStart || validEnd;
  });

  for (const row of filteredTimeline.slice(0, 3)) {
    }
  }

  return out.slice(0, 3);
}

function buildPresentWindows(report: any, topic: AskSarathiDomain): TimingWindow[] {
  const out: TimingWindow[] = [];
  const relevant = getRelevantTransits(report, topic);

  for (const tr of relevant.slice(0, 3)) {
    out.push({
      label: `${fmtDateShort(tr.start)} to ${fmtDateShort(tr.end)}`,
      start: tr.start,
      end: tr.end,
      peak: null,
      why: [tr.title || tr.summary || "Relevant transit activation"],
    });
  }

  return out.slice(0, 3);
}

function buildFutureWindows(report: any, topic: AskSarathiDomain, eventScale: EventScale): TimingWindow[] {
  const out: TimingWindow[] = [];

  const eventMonthTimeline = Array.isArray(report?.eventMonthTimeline)
    ? report.eventMonthTimeline
    : [];

  const eventTimeline = Array.isArray(report?.eventTimeline)
    ? report.eventTimeline
    : [];

  if (eventScale === "major") {
    for (const row of eventTimeline.slice(0, 2)) {
      out.push({
        label: `${row.start} to ${row.end}`,
        start: row.start != null ? String(row.start) : null,
        end: row.end != null ? String(row.end) : null,
        peak: row.peak != null ? String(row.peak) : null,
        why: [row.peak ? `Peak year around ${row.peak}` : "Broader event phase"],
      });
    }
  }

  if (!out.length) {
    for (const row of eventMonthTimeline.slice(0, 2)) {
      out.push({
        label: `${formatMonthLabel(row.start)} to ${formatMonthLabel(row.end)}`,
        start: row.start,
        end: row.end,
        peak: row.peak,
        why: [`Peak trigger around ${formatMonthLabel(row.peak)}`],
      });
    }
  }

  const relevant = getRelevantTransits(report, topic);
  for (const tr of relevant.slice(0, out.length ? 1 : 2)) {
    out.push({
      label: `${fmtDateShort(tr.start)} to ${fmtDateShort(tr.end)}`,
      start: tr.start,
      end: tr.end,
      peak: null,
      why: [tr.title || tr.summary || "Relevant transit activation"],
    });
  }

  return out.slice(0, 3);
}
function pickBestPastWindows(windows: TimingWindow[]): TimingWindow[] {
  if (!Array.isArray(windows) || !windows.length) return [];

  const scored = windows
    .map((w) => {
      let score = 0;
      if (w?.peak) score += 3;
      if (w?.start && w?.end) score += 2;
      if (Array.isArray(w?.why) && w.why.length) score += 2;
      if (w?.label) score += 1;
      return { window: w, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.window);

  return scored.slice(0, 2);
}
function extractYearFromWindow(window: TimingWindow, report: any): string | null {
  if (!window) return null;

  const tryExtractYear = (value: any): string | null => {
    const s = String(value ?? "").trim();
    if (!s) return null;

    const match = s.match(/\b(19|20)\d{2}\b/);
    return match ? match[0] : null;
  };

  // 1. peak
  const fromPeak = tryExtractYear(window?.peak);
  if (fromPeak) return fromPeak;

  // 2. label
  const fromLabel = tryExtractYear(window?.label);
  if (fromLabel) return fromLabel;

  // 3. start
  const fromStart = tryExtractYear(window?.start);
  if (fromStart) return fromStart;

  // 4. end
  const fromEnd = tryExtractYear(window?.end);
  if (fromEnd) return fromEnd;

  // 5. dashaTimeline fallback
  const dashaTimeline = Array.isArray(report?.dashaTimeline) ? report.dashaTimeline : [];
  for (const row of dashaTimeline) {
    const y =
      tryExtractYear(row?.year) ||
      tryExtractYear(row?.start) ||
      tryExtractYear(row?.end) ||
      tryExtractYear(row?.startISO) ||
      tryExtractYear(row?.endISO);
    if (y) return y;
  }

  // 6. timeline fallback
  const timeline = Array.isArray(report?.timeline) ? report.timeline : [];
  for (const row of timeline) {
    const y =
      tryExtractYear(row?.year) ||
      tryExtractYear(row?.start) ||
      tryExtractYear(row?.end) ||
      tryExtractYear(row?.startISO) ||
      tryExtractYear(row?.endISO);
    if (y) return y;
  }

  return null;
}
function buildPastChildWindows(report: any): TimingWindow[] {
  const birthYear = getBirthYear(report);
  const todayISO = getTodayISOForTiming(report);
  const todayYearMatch = String(todayISO).match(/\b(19|20)\d{2}\b/);
  const todayYear = todayYearMatch ? Number(todayYearMatch[0]) : new Date().getFullYear();

  const out: Array<TimingWindow & { _score?: number }> = [];

  const historicalTimeline = Array.isArray(report?.dashaTimeline)
    ? report.dashaTimeline
    : Array.isArray(report?.timeline)
    ? report.timeline
    : [];

  for (const row of historicalTimeline) {
    const start =
      row?.start ??
      row?.from ??
      row?.startISO ??
      row?.mahadasha?.start ??
      row?.range?.start ??
      null;

    const end =
      row?.end ??
      row?.to ??
      row?.endISO ??
      row?.mahadasha?.end ??
      row?.range?.end ??
      null;

    const md =
      row?.md ??
      row?.mahadasha?.lord ??
      row?.mahadasha ??
      row?.majorLord ??
      row?.lord ??
      null;

    const ad =
      row?.ad ??
      row?.antardasha?.lord ??
      row?.antardasha?.subLord ??
      row?.subLord ??
      row?.sub ??
      null;

    const startYearMatch = String(start ?? "").match(/\b(19|20)\d{2}\b/);
    const endYearMatch = String(end ?? "").match(/\b(19|20)\d{2}\b/);

    const startYear = startYearMatch ? Number(startYearMatch[0]) : null;
    const endYear = endYearMatch ? Number(endYearMatch[0]) : null;

    if (!birthYear || !startYear) continue;

    // ✅ MUST be in the past
    if ((startYear && startYear > todayYear) || (endYear && endYear > todayYear)) continue;

    const age = startYear - birthYear;

    // realistic fatherhood band
    if (age < 24 || age > 60) continue;

    let score = 0;

    // prefer realistic fatherhood ages
    if (age >= 28 && age <= 42) score += 5;
    else if (age >= 24 && age <= 48) score += 3;
    else score += 1;

    // later adult windows okay, but not future
    if (age >= 30) score += 2;

    const mdText = String(md ?? "").toLowerCase();
    const adText = String(ad ?? "").toLowerCase();

    if (mdText.includes("jupiter")) score += 3;
    if (adText.includes("jupiter")) score += 2;
    if (mdText.includes("venus")) score += 2;
    if (adText.includes("venus")) score += 1;
    if (mdText.includes("moon")) score += 1;
    if (adText.includes("moon")) score += 1;

    out.push({
      label:
        startYear && endYear
          ? `${startYear} to ${endYear}`
          : String(startYear),
      start: startYear ? String(startYear) : null,
      end: endYear ? String(endYear) : null,
      peak: startYear ? String(startYear) : null,
      why: [
        [md, ad].filter(Boolean).length
          ? `Child-related timing judged during ${[md, ad].filter(Boolean).join(" / ")}`
          : "Child-related historical activation",
      ],
      _score: score,
    });
  }

  return out
    .sort((a, b) => (b._score ?? 0) - (a._score ?? 0))
    .slice(0, 3)
    .map(({ _score, ...rest }) => rest);
}
function buildTimingWindows(
  report: any,
  topic: AskSarathiDomain,
  timeDirection: TimeDirection,
  eventScale: EventScale,
  careerEventType?: CareerEventType,
  timingPolicy?: {
    dashaStrength: "strong" | "moderate" | "mixed" | "weak";
    transitStrength: "strong" | "moderate" | "mixed" | "weak";
    allowSharpWindow: boolean;
    note: string;
  }
): TimingWindow[] {
  if (timeDirection === "identity") return [];

 if (timeDirection === "past") {
  let pastWindows: TimingWindow[] = [];

  if (topic === "marriage") {
    pastWindows = buildPastMarriageWindows(report);
  } else if (topic === "child") {
    pastWindows = buildPastChildWindows(report);
  } else {
    pastWindows = buildPastWindows(report);
  }

  const best = pickBestPastWindows(pastWindows);

  if (!best.length) {
    return [];
  }

  return best;
}
  if (timeDirection === "present") {
    return buildPresentWindows(report, topic);
  }

  const isCareerMovement =
    topic === "career" &&
    ["promotion", "job_change", "internal_shift", "stability_check"].includes(
      careerEventType ?? ""
    );

  if (timeDirection === "future") {
    if (isCareerMovement) {
      const phaseStrength = getFuturePhaseStrength(
        topic,
        timingPolicy,
        careerEventType
      );

      if (phaseStrength === "weak") {
        return [];
      }

      return buildBroadFutureWindows(report, topic, "major");
    }

    return buildFutureWindows(report, topic, eventScale);
  }

  return [];
}

function readHouseSupport(report: any, houses: number[]) {
  const bullets: string[] = [];
  const source = report?.houses ?? report?.natal?.houses ?? {};

  for (const h of houses) {
    const keyA = `H${h}`;
    const keyB = String(h);
    const row = source?.[keyA] ?? source?.[keyB] ?? null;
    if (!row) continue;

    const lord = safeStr(row?.lord);
    const sign = safeStr(row?.sign);
    const occupants = Array.isArray(row?.occupants) ? row.occupants.join(", ") : safeStr(row?.occupants);

    const line = [
      `House ${h}`,
      lord ? `lord ${lord}` : "",
      sign ? `in ${sign}` : "",
      occupants ? `occupants: ${occupants}` : "",
    ]
      .filter(Boolean)
      .join(" • ");

    if (line) bullets.push(line);
  }

  return bullets;
}

function readKarakaSupport(report: any, karakas: string[]) {
  const placements = report?.natal?.planets ?? report?.planets ?? {};
  const out: string[] = [];

  for (const karaka of karakas) {
    const row = placements?.[karaka] ?? placements?.[karaka.toLowerCase()] ?? null;
    if (!row) continue;

    const sign = safeStr(row?.sign);
    const house = row?.house != null ? `H${row.house}` : safeStr(row?.houseLabel);
    const dignity = safeStr(row?.dignity);
    const retro = row?.retrograde ? "retrograde" : "";
    const aspects = Array.isArray(row?.aspects) ? row.aspects.slice(0, 3).join(", ") : "";

    const line = [
      `${karaka}`,
      sign,
      house,
      dignity,
      retro,
      aspects ? `aspects: ${aspects}` : "",
    ]
      .filter(Boolean)
      .join(" • ");

    if (line) out.push(line);
  }

  return out;
}

function readDivisionalSupport(report: any, charts: string[], houses: number[], karakas: string[]) {
  const out: string[] = [];
  const source = report?.divisionalCharts ?? report?.vargas ?? {};

  for (const chart of charts) {
    const row = source?.[chart] ?? source?.[chart.toLowerCase()] ?? null;
    if (!row) continue;

    if (typeof row?.summary === "string" && row.summary.trim()) {
      out.push(`${chart}: ${row.summary.trim()}`);
      continue;
    }

    const chartHouses = Array.isArray(row?.activatedHouses) ? row.activatedHouses : [];
    const matchingHouses = chartHouses.filter((x: any) => houses.includes(Number(x)));
    const matchingKarakas = Array.isArray(row?.strongPlanets)
      ? row.strongPlanets.filter((x: string) => karakas.includes(String(x)))
      : [];

    const line = [
      chart,
      matchingHouses.length ? `supports houses ${matchingHouses.join(", ")}` : "",
      matchingKarakas.length ? `supports karakas ${matchingKarakas.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join(" • ");

    if (line && line !== chart) out.push(line);
  }

  return out;
}

function readDashaSupport(report: any, houses: number[], karakas: string[]) {
  const active = getActiveDashaAnyShape(report);
  const line = [active.md, active.ad, active.pd].filter(Boolean).join(" • ");
  const bullets: string[] = [];

  if (line) bullets.push(`Dasha sequence checked → ${line}`);

  const houseLords = report?.houseLords ?? report?.natal?.houseLords ?? {};
  const relatedLords = houses
    .map((h) => houseLords?.[`H${h}`] ?? houseLords?.[String(h)] ?? null)
    .map((x: any) => safeStr(x?.lord || x))
    .filter(Boolean);

  if (relatedLords.length) {
    const activeLords = [active.md, active.ad, active.pd].filter(Boolean) as string[];
    const hit = activeLords.filter((x) => relatedLords.includes(x));
    if (hit.length) {
      bullets.push(`Relevant house lords activated in dasha → ${uniq(hit).join(", ")}`);
    }
  }

  const karakaHit = [active.md, active.ad, active.pd].filter((x) => x && karakas.includes(String(x)));
  if (karakaHit.length) {
    bullets.push(`Relevant karakas activated in dasha → ${uniq(karakaHit as string[]).join(", ")}`);
  }

  return bullets;
}
function getMarriageActivators(report: any): string[] {
  const out = new Set<string>();

  const houseLords = getHouseLordMap(report);

  const addPlanet = (x: any) => {
    const p = safePlanetName(x);
    if (p) out.add(p);
  };

  // primary marriage houses
  addPlanet(houseLords?.H7?.lord ?? houseLords?.[7]?.lord ?? houseLords?.H7 ?? houseLords?.[7]);
  addPlanet(houseLords?.H2?.lord ?? houseLords?.[2]?.lord ?? houseLords?.H2 ?? houseLords?.[2]);
  addPlanet(houseLords?.H11?.lord ?? houseLords?.[11]?.lord ?? houseLords?.H11 ?? houseLords?.[11]);

  // classic marriage karakas
  addPlanet("Venus");
  addPlanet("Jupiter");

  const planets = Array.isArray(report?.planets)
    ? report.planets
    : Array.isArray(report?.natal?.planets)
    ? report.natal.planets
    : [];

  // add occupants of marriage houses
  for (const p of planets) {
    const house = Number(p?.house);
    if ([7, 2, 11].includes(house)) {
      addPlanet(p?.name);
    }
  }

  // add planets aspecting the 7th house or Venus/Jupiter if your aspect data exists
  const aspects = Array.isArray(report?.aspects) ? report.aspects : [];
  for (const a of aspects) {
    const from = safePlanetName(a?.from);
    const to = safePlanetName(a?.to);

    if (!from) continue;
    if (to === "Venus" || to === "Jupiter") {
      out.add(from);
    }
  }

  return Array.from(out);
}
function scoreMarriagePastYear(report: any, year: number): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  const activators = getMarriageActivators(report);
  if (!activators.length) return { score: 0, reasons: [] };

  const dashaAtYear = getDashaAtYear(report, year);
  const md = safePlanetName(dashaAtYear?.md);
  const ad = safePlanetName(dashaAtYear?.ad);
  const pd = safePlanetName(dashaAtYear?.pd);

  const active = [md, ad, pd].filter(Boolean) as string[];
  if (!active.length) return { score: 0, reasons: [] };

  reasons.push(`Historical dasha at ${year} → ${active.join(" • ")}`);

  // chart-specific activator hits
  const mdAct = md && activators.includes(md) ? 1 : 0;
  const adAct = ad && activators.includes(ad) ? 1 : 0;
  const pdAct = pd && activators.includes(pd) ? 1 : 0;

  // AD/PD matter more for actual event timing
  score += mdAct * 10;
  score += adAct * 22;
  score += pdAct * 26;

  if (mdAct || adAct || pdAct) {
    reasons.push(
      `Marriage activators active → ${uniq(
        [mdAct ? md : null, adAct ? ad : null, pdAct ? pd : null].filter(Boolean) as string[]
      ).join(", ")}`
    );
  }

  // extra reward when AD/PD both activate marriage factors
  if (adAct && pdAct) {
    score += 20;
    reasons.push("AD/PD both activate marriage factors");
  }

  // classic karaka boost
  const mdKaraka = md && ["Venus", "Jupiter"].includes(md) ? 1 : 0;
  const adKaraka = ad && ["Venus", "Jupiter"].includes(ad) ? 1 : 0;
  const pdKaraka = pd && ["Venus", "Jupiter"].includes(pd) ? 1 : 0;

  score += mdKaraka * 6;
  score += adKaraka * 12;
  score += pdKaraka * 14;

  if (mdKaraka || adKaraka || pdKaraka) {
    reasons.push(
      `Marriage karakas active → ${uniq(
        [mdKaraka ? md : null, adKaraka ? ad : null, pdKaraka ? pd : null].filter(Boolean) as string[]
      ).join(", ")}`
    );
  }

  // if Mars is a chart-specific activator, reward it strongly as an event trigger
  if (activators.includes("Mars")) {
    if (ad === "Mars") {
      score += 18;
      reasons.push("Mars AD activates marriage in this chart");
    }
    if (pd === "Mars") {
      score += 14;
      reasons.push("Mars PD activates marriage in this chart");
    }
  }

  // D9 support
  const d9 =
    report?.divisionalCharts?.D9 ??
    report?.divisionalCharts?.d9 ??
    report?.vargas?.D9 ??
    report?.vargas?.d9 ??
    null;

  if (d9) {
    score += 8;
    reasons.push("D9 support available");
  }

  const age = getAgeAtYear(report, year);
  reasons.push(`Age at ${year} → ${age}`);

  let ageWeight = 0.35;
  if (age != null) {
    if (age >= 24 && age <= 31) ageWeight = 1.18;
    else if (age >= 22 && age <= 34) ageWeight = 1.0;
    else if (age >= 20 && age <= 36) ageWeight = 0.82;
    else if (age >= 18 && age <= 40) ageWeight = 0.6;
  }

  score = Math.round(score * ageWeight);

  // later windows should not automatically beat an earlier valid one
  if (age != null && age >= 33) {
    score -= 10;
    reasons.push("Later-age repeat window slightly downweighted");
  }

  return { score: Math.max(0, score), reasons };
}
function scoreLayerFromBullets(bullets: string[], base = 20) {
  return Math.min(95, base + bullets.length * 12);
}

function buildPromiseLayer(report: any, rule: TopicRule): AnalysisLayer {
  const houseBullets = readHouseSupport(report, rule.houses);
  const supportBullets = readHouseSupport(report, rule.supportHouses ?? []);
  const bullets = [...houseBullets, ...supportBullets].slice(0, 6);
  const score = scoreLayerFromBullets(bullets, 24);
  const verdict = scoreToVerdict(score);

  const summary =
    verdict === "strong"
      ? "The D1 chart shows a clear natal promise for this area."
      : verdict === "moderate"
      ? "The D1 chart supports this area, though not in an extreme way."
      : verdict === "mixed"
      ? "The D1 chart shows some support here, but it is mixed rather than clean."
      : verdict === "weak"
      ? "The D1 chart does not show this area as strongly supported on its own."
      : "The D1 promise is not clear enough from the current data alone.";

  return { title: "D1 promise", verdict, summary, bullets };
}
type DivisionalSignalProfile = {
  chart: string;
  weight: number;
  role: string;
};

const DIVISIONAL_PROFILES: Partial<Record<AskSarathiDomain, DivisionalSignalProfile[]>> = {
  career: [
    { chart: "D1", weight: 0.8, role: "base promise" },
    { chart: "D10", weight: 1.0, role: "career execution" },
    { chart: "D9", weight: 0.6, role: "planetary strength behind outcomes" },
    { chart: "D60", weight: 0.4, role: "deep karmic support" },
  ],
  money: [
    { chart: "D1", weight: 0.8, role: "base promise" },
    { chart: "D2", weight: 1.0, role: "wealth and resources" },
    { chart: "D9", weight: 0.6, role: "strength of wealth-giving planets" },
    { chart: "D10", weight: 0.5, role: "income through work" },
    { chart: "D4", weight: 0.4, role: "asset/property support" },
    { chart: "D12", weight: 0.3, role: "family resource pattern" },
    { chart: "D60", weight: 0.4, role: "deep karmic support" },
  ],
  marriage: [
    { chart: "D1", weight: 0.8, role: "base promise" },
    { chart: "D9", weight: 1.0, role: "marriage and spouse pattern" },
    { chart: "D60", weight: 0.4, role: "deep karmic support" },
  ],
  relationships: [
    { chart: "D1", weight: 0.8, role: "base promise" },
    { chart: "D9", weight: 0.9, role: "bond and partnership maturity" },
    { chart: "D60", weight: 0.4, role: "deep karmic tone" },
  ],
  property: [
    { chart: "D1", weight: 0.8, role: "base promise" },
    { chart: "D4", weight: 1.0, role: "property and settlement" },
    { chart: "D9", weight: 0.5, role: "supporting strength" },
    { chart: "D12", weight: 0.3, role: "family/home roots" },
    { chart: "D60", weight: 0.4, role: "deep karmic support" },
  ],
  relocation: [
    { chart: "D1", weight: 0.8, role: "base promise" },
    { chart: "D4", weight: 0.9, role: "residence and settlement" },
    { chart: "D9", weight: 0.4, role: "life-direction support" },
    { chart: "D12", weight: 0.3, role: "roots/family displacement pattern" },
    { chart: "D60", weight: 0.4, role: "deep karmic support" },
  ],
  health: [
    { chart: "D1", weight: 0.8, role: "base constitution" },
    { chart: "D30", weight: 1.0, role: "stress and suffering pattern" },
    { chart: "D9", weight: 0.4, role: "resilience/support" },
    { chart: "D60", weight: 0.4, role: "deep karmic burden" },
  ],
  child: [
    { chart: "D1", weight: 0.8, role: "base promise" },
    { chart: "D7", weight: 1.0, role: "children and lineage" },
    { chart: "D9", weight: 0.4, role: "fruitfulness of promise" },
    { chart: "D60", weight: 0.4, role: "deep karmic support" },
  ],
  vehicle: [
    { chart: "D1", weight: 0.8, role: "base promise" },
    { chart: "D16", weight: 1.0, role: "vehicles and comforts" },
    { chart: "D4", weight: 0.3, role: "asset context" },
    { chart: "D9", weight: 0.3, role: "supporting strength" },
  ],
  disputes: [
    { chart: "D1", weight: 0.8, role: "base promise" },
    { chart: "D6", weight: 1.0, role: "conflict and litigation pattern" },
    { chart: "D9", weight: 0.4, role: "support behind outcome" },
    { chart: "D60", weight: 0.4, role: "deep karmic support" },
  ],
  inner: [
    { chart: "D1", weight: 0.8, role: "base promise" },
    { chart: "D9", weight: 1.0, role: "inner dharma and maturity" },
    { chart: "D60", weight: 0.4, role: "deep karmic tone" },
  ],
  generic: [
    { chart: "D1", weight: 1.0, role: "base promise" },
    { chart: "D9", weight: 0.5, role: "supporting strength" },
  ],
};
function buildDivisionalLayer(
  report: any,
  topic: AskSarathiDomain,
  rule: TopicRule
): DivisionalAnalysisLayer {
  const profile =
  DIVISIONAL_PROFILES[topic] ??
  DIVISIONAL_PROFILES.generic ??
  [];

  const chartResults = profile.map((entry) => {
    const rawBullets = readDivisionalSupport(
      report,
      [entry.chart],
      rule.houses,
      rule.karakas
    ).slice(0, 3);

    const rawScore = scoreLayerFromBullets(rawBullets, 18);
    const weightedScore = rawScore * entry.weight;

    return {
      chart: entry.chart,
      role: entry.role,
      weight: entry.weight,
      rawBullets,
      rawScore,
      weightedScore,
    };
  });

  const usableCharts = chartResults.filter((x) => x.rawBullets.length > 0);

  const bullets = usableCharts
    .flatMap((x) => x.rawBullets.map((b) => `${x.chart} → ${b}`))
    .slice(0, 8);

  const totalWeight = usableCharts.reduce((sum, x) => sum + x.weight, 0) || 1;
  const weightedAverage =
    usableCharts.reduce((sum, x) => sum + x.weightedScore, 0) / totalWeight;

  const score = Math.round(weightedAverage);
  const verdict = scoreToVerdict(score);

  const chartsUsed = usableCharts.map((x) => x.chart);

  const primaryCharts = profile
    .filter((x) => x.weight >= 0.8)
    .map((x) => x.chart);

  const summary =
    chartsUsed.length > 0
      ? `Relevant divisional support is being judged through ${chartsUsed.join(
          ", "
        )}, with ${primaryCharts.join(", ")} carrying the most weight for this topic.`
      : `Relevant divisional chart support is not clearly available from the current payload.`;

  return {
    title: "Divisional support",
    verdict,
    summary,
    bullets,
    chartBreakdown: chartResults.map((x) => ({
  chart: x.chart,
  strength: scoreToVerdict(x.rawScore),
  weight: x.weight,
}))
  };
}

function buildKarakaLayer(report: any, rule: TopicRule): AnalysisLayer {
  const bullets = readKarakaSupport(report, rule.karakas).slice(0, 5);
  const score = scoreLayerFromBullets(bullets, 20);
  const verdict = scoreToVerdict(score);

  const summary =
    bullets.length
      ? `The karaka layer is being checked through ${rule.karakas.join(", ")}.`
      : "Karaka support is not clear enough from the current payload.";

  return { title: "Karaka support", verdict, summary, bullets };
}

function buildTimingLayer(report: any, rule: TopicRule, topic: AskSarathiDomain): AnalysisLayer {
  const dashaBullets = readDashaSupport(
    report,
    [...rule.houses, ...(rule.supportHouses ?? [])],
    rule.karakas
  );

  const transitBullets = getRelevantTransits(report, topic)
    .slice(0, 3)
    .map((tr) => {
      const range =
        tr.start || tr.end
          ? ` (${fmtDateShort(tr.start)} – ${fmtDateShort(tr.end)})`
          : "";
      return `Transit support: ${tr.title || tr.summary || "Relevant transit"}${range}`;
    });

  const bullets = [...dashaBullets, ...transitBullets].slice(0, 6);

  const dashaStrength = getDashaTimingStrength(
    report,
    [...rule.houses, ...(rule.supportHouses ?? [])],
    rule.karakas
  );

  const transitStrength = getTransitTimingStrength(report, topic);

  let verdict: AnalysisLayer["verdict"] = "weak";

  if (dashaStrength === "strong" && (transitStrength === "strong" || transitStrength === "moderate")) {
    verdict = "strong";
  } else if (dashaStrength === "strong") {
    verdict = "moderate";
  } else if (dashaStrength === "moderate" && transitStrength !== "weak") {
    verdict = "moderate";
  } else if (dashaStrength === "moderate") {
    verdict = "mixed";
  } else if (dashaStrength === "mixed" && (transitStrength === "strong" || transitStrength === "moderate")) {
    verdict = "mixed";
  } else if (dashaStrength === "mixed") {
    verdict = "weak";
  } else {
    verdict = "weak";
  }

  const summary =
    dashaStrength === "strong"
      ? "The broader dasha phase is supportive, and current transits can act as triggers inside it."
      : dashaStrength === "moderate"
      ? "The broader dasha phase is usable, but timing should be read with caution rather than as a fixed promise."
      : dashaStrength === "mixed"
      ? "Transit activity may be visible, but the broader dasha phase is not clean enough for a strong timing claim."
      : "Dasha-period support is too weak to treat current transit activity as a reliable event window.";

  return { title: "Timing support", verdict, summary, bullets };
}

function buildRemediesLayer(report: any, rule: TopicRule, questionType: AskSarathiQuestionType): AnalysisLayer | null {
  if (!rule.remediesAllowed && questionType !== "remedy") return null;

  const active = getActiveDashaAnyShape(report);
  const lord = safeStr(active.ad || active.pd || active.md);

  const bullets: string[] = [];
  if (lord) bullets.push(`Remedies should be aligned with the active ${lord} period.`);
  if (rule.karakas.length) bullets.push(`Primary remedy planets to consider: ${rule.karakas.join(", ")}.`);
  if (rule.houses.length) bullets.push(`Remedies should support houses ${rule.houses.join(", ")} first, not random planets.`);

  return {
    title: "Remedies",
    verdict: bullets.length ? "moderate" : "unclear",
    summary: bullets.length
      ? "Remedies can be suggested, but they should follow the actual chart promise and timing."
      : "No specific remedy direction is clear from the current payload.",
    bullets,
  };
}
function getConfidencePrefix(confidence: "High" | "Medium" | "Low"): string {
  if (confidence === "High") {
    return "This is a strong phase for";
  }

  if (confidence === "Medium") {
    return "There is a real possibility of";
  }

  return "There are some signs of";
}
function buildFinalAnswerDecision(params: {
  topic: AskSarathiDomain;
  questionType?: AskSarathiQuestionType;
  timeDirection: TimeDirection;
  careerEventType?: CareerEventType;
  windows: TimingWindow[];
  timingLayer: AnalysisLayer;
  confidence: "High" | "Medium" | "Low";
  timingPolicy?: {
    dashaStrength: "strong" | "moderate" | "mixed" | "weak";
    transitStrength: "strong" | "moderate" | "mixed" | "weak";
    allowSharpWindow: boolean;
    note: string;
  };
}) {
  const {
  topic,
  questionType,
  timeDirection,
    careerEventType,
    windows,
    timingLayer,
    timingPolicy,
    confidence,
  } = params;

  const first = windows?.[0];
  const prefix = getConfidencePrefix(confidence);

  const isCareerMovement =
    topic === "career" &&
    ["promotion", "job_change", "internal_shift", "stability_check"].includes(
      careerEventType ?? ""
    );

  if (timeDirection === "identity") {
    return {
      verdict: "IDENTITY",
      line: "This question is showing more as a profession-pattern reading than a timing question.",
    };
  }

  if (timeDirection === "present") {
    if (timingLayer.verdict === "strong" || timingLayer.verdict === "moderate") {
      return {
        verdict: "ACTIVE_NOW",
        line: "This area is active now and is already showing through the current phase.",
      };
    }

    return {
      verdict: "NOT_ACTIVE_NOW",
      line: "This area is not showing a strong event pattern right now, but there may still be background movement or buildup.",
    };
  }

  if (timeDirection === "future" && isCareerMovement) {
    if (timingPolicy?.dashaStrength === "strong") {
      if (first?.label) {
        return {
          verdict: "YES_PHASE",
          line: `This is a career-movement phase around ${first.label}, but it is better read as a broader career shift than as a guaranteed instant promotion.`,
        };
      }

      return {
        verdict: "YES_PHASE",
        line: "This is a career-movement phase, but not a sharply timed promotion window.",
      };
    }

    if (
      timingPolicy?.dashaStrength === "moderate" ||
      timingPolicy?.dashaStrength === "mixed"
    ) {
      return {
        verdict: "MOVEMENT_PHASE",
        line: `${prefix} career movement, but not a clean promotion or job-change signal yet.`,
      };
    }

    return {
      verdict: "NO_PHASE",
      line: "Current timing is stronger for visibility-building and responsibility expansion than immediate external elevation.",
    };
  }

  if (timeDirection === "future") {
    if (first?.label && timingPolicy?.allowSharpWindow) {
      return {
        verdict: "SHARP_WINDOW",
        line: `A usable future window is active around ${first.label}.`,
      };
    }

    if (first?.label) {
      const broadLine =
        topic === "relationships" || topic === "marriage"
          ? "Your relationship area is opening up over the coming weeks or months, but this is better read as a broader phase than as a sharply timed event."
          : topic === "money"
          ? "Your money area is entering a more supportive phase over the coming weeks or months, but this is better read as gradual improvement than as a sharply timed jump."
          : topic === "health"
          ? "Your health pattern is entering a more noticeable phase over the coming weeks or months, but this is better read as a broader trend than as a sharply timed event."
          : topic === "property"
          ? "Your property area is entering a more active phase over the coming weeks or months, but this is better read as preparation and movement than as a sharply timed closure."
          : "This area is opening up over the coming weeks or months, but it is better read as a broader phase than as a sharply timed event.";

      return {
        verdict: "BROAD_PHASE",
        line: broadLine,
      };
    }

    return {
      verdict: "NO_WINDOW",
      line: "No clear future timing window is visible from the current scan.",
    };
  }

  if (timeDirection === "past") {
    if (first?.label) {
      return {
        verdict: "PAST_WINDOW",
        line: `The most likely past period for this area falls around ${first.label}.`,
      };
    }

   return {
  verdict: "PAST_UNCLEAR",
  line: "The strongest past indicators are being judged from historical dasha activation and supporting chart factors.",
};
  }

if (questionType === "comparison") {
  return {
    verdict: "COMPARISON",
    line: "",
  };
}

return {
  verdict: "GENERIC",
  line: "The current scan does not show a clear timing verdict yet.",
};
}
function buildDailyMoodAnswer(question: string) {
  const q = question.toLowerCase();

  if (/restless|overthinking|mentally|anxious|stressed/.test(q)) {
    return pickOne([
      "The chart today looks mentally overactive rather than externally chaotic. This usually creates a feeling where the mind keeps jumping ahead, replaying unfinished thoughts, or searching for clarity before things are emotionally settled.",

      "Today’s energy looks more mentally stimulating than emotionally calming. You may notice overthinking, impatience, or difficulty fully relaxing even if nothing major is actually going wrong externally.",

      "The current pattern suggests mental overstimulation and internal pressure rather than a major external problem. The mind may feel busy, unsettled, or future-focused today.",
    ]);
  }

  if (/how.*day|today looking|today going/.test(q)) {
    return pickOne([
      "Today looks more mentally active than externally dramatic. It’s a good day for handling practical responsibilities steadily rather than forcing major decisions or emotional reactions.",

      "The day appears moderate and manageable overall, but mentally a bit fast-moving. Staying grounded and avoiding overreaction will help the day flow more smoothly.",

      "This looks like a steady but mentally active day. Focus on clearing pending tasks, organizing priorities, and avoiding unnecessary emotional pressure.",
    ]);
  }

  return null;
}
function buildAnswerSummary(
  report: any,
  topic: AskSarathiDomain,
  timingLayer: AnalysisLayer,
  windows: TimingWindow[],
  timeDirection: TimeDirection,
  confidence: "High" | "Medium" | "Low",
  careerEventType?: CareerEventType,
  timingPolicy?: {
    dashaStrength: "strong" | "moderate" | "mixed" | "weak";
    transitStrength: "strong" | "moderate" | "mixed" | "weak";
    allowSharpWindow: boolean;
    note: string;
  },
  answerMode?: AnswerMode
): string {
  const topicLabel =
    typeof topic === "string"
      ? topic
      : typeof (topic as any)?.label === "string"
      ? (topic as any).label
      : "area";

  const area =
    topicLabel === "generic" ? "This area" : `This ${topicLabel} matter`;

  const first = windows?.[0];
  const second = windows?.[1];

  const decision = buildFinalAnswerDecision({
    topic,
    timeDirection,
    careerEventType,
    windows,
    timingLayer,
    timingPolicy,
    confidence,
  });
  if (answerMode === "CONTINUATION_TIMING") {
  const near = windows?.[0]?.label;
  const major = windows?.[1]?.label;

  return `The current pattern should continue for now, but the first meaningful improvement begins around ${
    near ?? "the next activation window"
  }. The stronger and more structural shift appears around ${
    major ?? "the larger structural window"
  }.`;
}
  if (timeDirection === "identity") {
    return decision.line;
  }

 if (timeDirection === "past") {
  if (first?.label) {
    const year = extractYearFromWindow(first, report);
    const age =
      year && !isNaN(Number(year))
        ? getAgeAtYear(report, Number(year))
        : null;

    return `The most likely period for this area falls around ${year || first.label}${
      age ? ` (around age ${age})` : ""
    }.${
      second?.label ? ` A secondary but weaker period appears around ${second.label}.` : ""
    } This is the closest chart-supported match based on historical dasha activation and child-related timing factors, so it is better read as the strongest likely timing rather than an exact pinpoint date.`;
  }

  return `The strongest past indicators for this area are present, but they do not narrow cleanly to a single year from the available chart timing data.`;
}

  if (timeDirection === "present") {
    if (decision.verdict === "ACTIVE_NOW") {
      return `${decision.line} This is already showing up in lived reality, not just as background potential.`;
    }

    return `${decision.line} What is active here looks subtle, gradual, or background-led rather than sharply event-driven right now.`;
  }

  const isCareerMovement =
    topic === "career" &&
    ["promotion", "job_change", "internal_shift", "stability_check"].includes(
      careerEventType ?? ""
    );

  if (timeDirection === "future") {
    if (isCareerMovement) {
      if (decision.verdict === "YES_PHASE") {
        return `${decision.line}${
          first?.peak ? ` The strongest momentum looks closer to ${first.peak}.` : ""
        }`;
      }

     if (decision.verdict === "MOVEMENT_PHASE") {
  return decision.line;
}

      if (decision.verdict === "NO_PHASE") {
        return decision.line;
      }
    }

    if (decision.verdict === "SHARP_WINDOW") {
      return `${area} is showing a usable future window around ${first?.label}.`;
    }

    if (decision.verdict === "BROAD_PHASE") {
      return decision.line;
    }

    if (decision.verdict === "NO_WINDOW") {
      return decision.line;
    }
  }

  return decision.line;
}
function normalizeWorkTypeLabel(workType: string | null | undefined): string {
  const t = String(workType ?? "").trim().toLowerCase();

  if (t === "finance_banking") return "finance, banking, or structured financial operations";
  if (t === "consulting_advisory") return "consulting, advisory, or guidance-based work";
  if (t === "operations_administration") return "operations, administration, or structured process management";
  if (t === "government_institutional") return "institutional, regulatory, or government-linked work";
  if (t === "construction_real_estate") return "real estate, construction, or asset-linked work";
  if (t === "technical_it") return "technical, systems, or IT-linked work";
  if (t === "general_structured_work") return "structured corporate or process-driven work";

  return t.replace(/_/g, " ");
}
function confidenceFromPredictionScore(score: number): "high" | "medium" | "low" {
  if (score >= 75) return "high";
  if (score >= 45) return "medium";
  return "low";
}
const TOPIC_TRIGGER_WEIGHTS: Record<
  AskSarathiDomain,
  {
    primary: string[];
    secondary: string[];
    context: string[];
  }
> = {
  career: {
    primary: ["Sun", "Saturn", "Mercury"],
    secondary: ["Jupiter", "Venus"],
    context: ["Rahu", "Moon"],
  },
  property: {
    primary: ["Jupiter", "Mars"],
    secondary: ["Venus"],
    context: ["Moon", "Rahu", "Ketu"],
  },
  vehicle: {
    primary: ["Venus"],
    secondary: ["Mars"],
    context: ["Moon", "Rahu"],
  },
  money: {
    primary: ["Jupiter", "Venus"],
    secondary: ["Mercury"],
    context: ["Moon", "Rahu"],
  },
  marriage: {
    primary: ["Venus", "Jupiter"],
    secondary: ["Moon"],
    context: ["Rahu", "Ketu"],
  },
  relationships: {
    primary: ["Venus", "Moon"],
    secondary: ["Jupiter"],
    context: ["Rahu", "Ketu"],
  },
  health: {
    primary: ["Sun", "Saturn", "Mars"],
    secondary: ["Moon"],
    context: ["Rahu", "Ketu"],
  },
  relocation: {
    primary: ["Moon", "Rahu"],
    secondary: ["Saturn"],
    context: ["Ketu", "Jupiter"],
  },
  disputes: {
    primary: ["Mars", "Saturn"],
    secondary: ["Rahu"],
    context: ["Ketu"],
  },
  child: {
    primary: ["Jupiter"],
    secondary: ["Moon", "Venus"],
    context: ["Rahu", "Ketu"],
  },
  inner: {
    primary: ["Moon", "Ketu", "Jupiter"],
    secondary: ["Saturn"],
    context: ["Rahu"],
  },

  education: {
    primary: ["Mercury", "Jupiter"],
    secondary: ["Moon"],
    context: ["Rahu", "Ketu"],
  },
  parents: {
    primary: ["Sun", "Moon"],
    secondary: ["Saturn", "Jupiter"],
    context: ["Rahu", "Ketu"],
  },
  siblings: {
    primary: ["Mars", "Mercury"],
    secondary: ["Moon"],
    context: ["Rahu", "Ketu"],
  },
  business: {
    primary: ["Mercury", "Venus", "Saturn"],
    secondary: ["Jupiter", "Rahu"],
    context: ["Sun", "Mars"],
  },
  travel: {
    primary: ["Moon", "Rahu", "Jupiter"],
    secondary: ["Mercury"],
    context: ["Ketu", "Saturn"],
  },
  mental_health: {
    primary: ["Moon", "Mercury", "Saturn"],
    secondary: ["Ketu"],
    context: ["Rahu", "Mars"],
  },
  reputation: {
    primary: ["Sun", "Saturn", "Jupiter"],
    secondary: ["Mercury"],
    context: ["Rahu", "Moon"],
  },
  debt: {
    primary: ["Saturn", "Mars", "Rahu"],
    secondary: ["Mercury"],
    context: ["Jupiter", "Venus"],
  },
  inheritance: {
    primary: ["Saturn", "Ketu", "Mars"],
    secondary: ["Jupiter"],
    context: ["Rahu", "Moon"],
  },

  generic: {
    primary: [],
    secondary: [],
    context: [],
  },
  spiritual: {
  primary: ["Jupiter", "Ketu", "Moon"],
  secondary: ["Saturn"],
  context: ["Rahu"],
},
pets: {
  primary: ["Moon", "Mercury"],
  secondary: ["Venus"],
  context: ["Ketu", "Rahu"],
},
};
function scorePredictionWindow({
  topic,
  row,
  report,
  careerEventType,
}: {
  topic: AskSarathiDomain;
  row: any;
  report: any;
  careerEventType?: CareerEventType;
}): PredictionScore {
  let score = 0;
  const reasons: string[] = [];
  const missing: string[] = [];

  const readableTopic: Record<string, string> = {
    vehicle: "vehicle and comfort-related matters",
    career: "career growth and professional movement",
    property: "property and home matters",
    money: "financial growth and income matters",
    marriage: "marriage and commitment matters",
    relationships: "relationship and emotional matters",
    health: "health and recovery matters",
    relocation: "movement, relocation, and settlement matters",
    disputes: "conflict resolution and legal matters",
    child: "children and family expansion matters",
  };

  const topicLabel = readableTopic[topic] ?? `${topic} matters`;

  const md = String(row?.md ?? "");
  const ad = String(row?.ad ?? "");
  const pd = String(row?.pd ?? "");

  const rowStart = String(row?.start ?? row?.startISO ?? "").slice(0, 10);
  const rowEnd = String(row?.end ?? row?.endISO ?? "").slice(0, 10);

  function overlapsRowWindow(start?: string | null, end?: string | null) {
    const s = String(start ?? "").slice(0, 10);
    const e = String(end ?? start ?? "").slice(0, 10);

    if (!rowStart || !rowEnd || !s) return false;

    return s <= rowEnd && e >= rowStart;
  }

  const triggerConfig =
    TOPIC_TRIGGER_WEIGHTS[topic] ?? TOPIC_TRIGGER_WEIGHTS.generic;

  const activePlanets = Array.from(new Set([md, ad, pd].filter(Boolean).map(String)));

  const primaryHits = activePlanets.filter((p) =>
    triggerConfig.primary.includes(p)
  );

  const secondaryHits = activePlanets.filter((p) =>
    triggerConfig.secondary.includes(p)
  );

  const contextHits = activePlanets.filter((p) =>
    triggerConfig.context.includes(p)
  );

  for (const p of primaryHits) {
    if (p === md) {
      score += 12;
      reasons.push(`${p} Mahadasha gives primary support for ${topicLabel}`);
    }

    if (p === ad) {
      score += 22;
      reasons.push(`${p} Antardasha strongly activates ${topicLabel}`);
    }

    if (p === pd) {
      score += 28;
      reasons.push(`${p} Pratyantar Dasha creates a direct trigger for ${topicLabel}`);
    }
  }

  for (const p of secondaryHits) {
    if (p === md) {
      score += 6;
      reasons.push(`${p} Mahadasha gives secondary support for ${topicLabel}`);
    }

    if (p === ad) {
      score += 10;
      reasons.push(`${p} Antardasha supports ${topicLabel}`);
    }

    if (p === pd) {
      score += 14;
      reasons.push(`${p} Pratyantar Dasha adds supportive movement for ${topicLabel}`);
    }
  }

  for (const p of contextHits) {
    if (p === md) {
      score += 3;
      reasons.push(`${p} Mahadasha gives background context for ${topicLabel}`);
    }

    if (p === ad) {
      score += 5;
      reasons.push(`${p} Antardasha gives background movement for ${topicLabel}`);
    }

    if (p === pd) {
      score += 6;
      reasons.push(`${p} Pratyantar Dasha gives a minor trigger for ${topicLabel}`);
    }
  }

  const hasPrimaryHit = primaryHits.length > 0;

  if (!hasPrimaryHit && (secondaryHits.length || contextHits.length)) {
    score = Math.round(score * 0.65);
    missing.push(`Primary ${topicLabel} trigger is not strong enough yet`);
  }

  const topicHouses: Record<string, number[]> = {
    vehicle: [4, 11],
    career: [10, 6, 2, 11],
    money: [2, 11, 5, 9],
    marriage: [7, 2, 11],
    relationships: [5, 7, 11],
    property: [4, 2, 11, 12],
    health: [1, 6, 8, 12],
    relocation: [4, 9, 12],
    disputes: [6, 8, 3],
    child: [5, 9, 11],
  };

  const houseLords = report?.houseLords ?? report?.natal?.houseLords ?? {};
  const relevantHouses = topicHouses[topic] ?? [];

  const activeLords = [md, ad, pd].filter(Boolean);
  const activatedHouseLords: string[] = [];

  for (const h of relevantHouses) {
    const lordRaw =
      houseLords?.[`H${h}`]?.lord ??
      houseLords?.[`H${h}`] ??
      houseLords?.[String(h)]?.lord ??
      houseLords?.[String(h)] ??
      null;

    const lord = String(lordRaw ?? "").trim();

    if (lord && activeLords.includes(lord)) {
      activatedHouseLords.push(`H${h} lord ${lord}`);
    }
  }

  if (activatedHouseLords.length) {
    let houseLordScore = 0;

    for (const item of activatedHouseLords) {
      if (/H10/.test(item)) houseLordScore += 14;
      else if (/H4/.test(item)) houseLordScore += 14;
      else if (/H7/.test(item)) houseLordScore += 12;
      else if (/H11/.test(item)) houseLordScore += 10;
      else if (/H6/.test(item)) houseLordScore += 8;
      else if (/H2/.test(item)) houseLordScore += 8;
      else if (/H5/.test(item)) houseLordScore += 8;
      else houseLordScore += 5;
    }

    score += Math.min(25, houseLordScore);

    reasons.push(
      `Relevant house-lord activation is present through ${activatedHouseLords.join(", ")}`
    );
  } else {
    missing.push("Relevant house-lord activation is not clearly present");
  }

  const divisionalText = JSON.stringify(
    report?.divisionalCharts ?? report?.vargas ?? {}
  ).toLowerCase();

  const topicVargas: Record<string, string[]> = {
    vehicle: ["d16", "d4"],
    career: ["d10"],
    property: ["d4"],
    marriage: ["d9"],
    relationships: ["d9"],
    money: ["d2"],
    health: ["d30"],
    child: ["d7"],
    relocation: ["d4", "d9"],
    disputes: ["d6"],
  };

  const vargaHits = (topicVargas[topic] ?? []).filter((v) =>
    divisionalText.includes(v)
  );

  if (vargaHits.length) {
    score += 15;
    reasons.push(
      `Divisional confirmation is present through ${vargaHits
        .join(" / ")
        .toUpperCase()}`
    );
  } else {
    missing.push("Divisional confirmation is still limited");
  }

  const degreeHits = Array.isArray(report?.degreeHits)
    ? report.degreeHits
    : Array.isArray(report?.triggerEngine?.degreeHits)
    ? report.triggerEngine.degreeHits
    : [];

  const topicDegreeKeywords: Record<string, string[]> = {
    vehicle: ["venus", "mars", "4", "vehicle", "comfort", "d16"],
    career: ["sun", "saturn", "mercury", "jupiter", "10", "career", "d10"],
    money: ["jupiter", "venus", "mercury", "2", "11", "money"],
    property: ["jupiter", "mars", "venus", "4", "property", "home", "d4"],
    marriage: ["venus", "jupiter", "7", "marriage", "d9"],
    relationships: ["venus", "moon", "5", "7", "relationship", "d9"],
    health: ["sun", "moon", "mars", "saturn", "6", "8", "health"],
    relocation: ["moon", "rahu", "saturn", "4", "9", "12", "relocation"],
    disputes: ["mars", "saturn", "rahu", "6", "8", "dispute"],
    child: ["jupiter", "5", "child", "d7"],
  };

  const degreeKeywords = topicDegreeKeywords[topic] ?? [];

  const matchedDegreeHits = degreeHits.filter((hit: any) => {
    const txt = JSON.stringify(hit).toLowerCase();

    const start =
      hit?.windowStart ??
      hit?.startISO ??
      hit?.start ??
      hit?.dateISO ??
      hit?.peakDate ??
      null;

    const end =
      hit?.windowEnd ??
      hit?.endISO ??
      hit?.end ??
      hit?.dateISO ??
      hit?.peakDate ??
      start;

    return (
      overlapsRowWindow(start, end) &&
      degreeKeywords.some((kw) => txt.includes(String(kw).toLowerCase()))
    );
  });

  if (matchedDegreeHits.length) {
    const degreeScore = Math.min(20, matchedDegreeHits.length * 6);
    score += degreeScore;

    reasons.push(
      `Degree-sensitive triggers support this window through ${matchedDegreeHits
        .slice(0, 2)
        .map((x: any) =>
          x?.title ??
          x?.label ??
          [x?.transitPlanet, "to", x?.natalPlanet].filter(Boolean).join(" ") ??
          "exact degree contact"
        )
        .filter(Boolean)
        .filter((v: string, i: number, arr: string[]) => arr.indexOf(v) === i)
        .join(", ")}`
    );
  } else {
    missing.push("No strong degree-sensitive trigger is visible for this topic yet");
  }

  const transitWindows = [
    ...(Array.isArray(report?.transitWindows) ? report.transitWindows : []),
    ...(Array.isArray(report?.topTransits) ? report.topTransits : []),
    ...(Array.isArray(report?.transits?.transitWindows)
      ? report.transits.transitWindows
      : []),
  ];

  const transitKeywords = topicDegreeKeywords[topic] ?? [];

  const matchedTransitWindows = transitWindows.filter((tr: any) => {
    const txt = JSON.stringify(tr).toLowerCase();

    const start =
      tr?.startISO ??
      tr?.start ??
      tr?.from ??
      tr?.dateISO ??
      null;

    const end =
      tr?.endISO ??
      tr?.end ??
      tr?.to ??
      tr?.dateISO ??
      start;

    return (
      overlapsRowWindow(start, end) &&
      transitKeywords.some((kw) => txt.includes(String(kw).toLowerCase()))
    );
  });

  if (matchedTransitWindows.length) {
    const transitScore = Math.min(20, matchedTransitWindows.length * 7);
    score += transitScore;

    reasons.push(
      `Transit confirmation is visible through ${matchedTransitWindows
        .slice(0, 2)
        .map((x: any) =>
          x?.title ??
          x?.label ??
          [x?.transitPlanet, x?.type, x?.houseFromLagna ? `H${x.houseFromLagna}` : ""]
            .filter(Boolean)
            .join(" ") ??
          "relevant transit window"
        )
        .filter(Boolean)
        .filter((v: string, i: number, arr: string[]) => arr.indexOf(v) === i)
        .join(", ")}`
    );
  } else {
    missing.push("Transit confirmation is not strong yet");
  }

  if (topic === "career" && careerEventType) {
    const active = [md, ad, pd].filter(Boolean).map(String);

    if (careerEventType === "promotion") {
      if (active.includes("Sun")) {
        score += 10;
        reasons.push("Promotion-specific support is present through Sun activation");
      }

      if (active.includes("Jupiter")) {
        score += 6;
        reasons.push("Recognition and growth support is present through Jupiter activation");
      }

      if (active.includes("Saturn")) {
        score += 5;
        reasons.push("Responsibility and authority support is present through Saturn activation");
      }
    }

    if (careerEventType === "job_change") {
      if (ad === "Mercury" || pd === "Mercury") {
        score += 10;
        reasons.push("Mercury sub-period gives stronger job-change support");
      } else if (md === "Mercury") {
        score += 5;
        reasons.push("Mercury Mahadasha supports career mobility in the background");
      }

      if (md === "Rahu") {
        score += 3;
        reasons.push("Rahu Mahadasha gives a background theme of change");
      }

      if (ad === "Rahu" || pd === "Rahu") {
        score += 8;
        reasons.push("Rahu sub-period gives a sharper job-change trigger");
      }

      if (active.includes("Saturn")) {
        score += 5;
        reasons.push("Work-structure change support is present through Saturn activation");
      }
    }

    if (careerEventType === "internal_shift") {
      if (active.includes("Mercury")) {
        score += 7;
        reasons.push("Internal movement support is present through Mercury activation");
      }

      if (active.includes("Saturn")) {
        score += 7;
        reasons.push("Role restructuring support is present through Saturn activation");
      }

      if (active.includes("Venus")) {
        score += 4;
        reasons.push("Relationship and team alignment support is present through Venus activation");
      }
    }
  }

  score = Math.max(0, Math.min(100, score));

  if (topic === "property") {
  }

  return {
    score,
    confidence: confidenceFromPredictionScore(score),
    reasons,
    missing,
  };
}
type AstroTimelineWindow = {
  label: string;
  score: number;
  confidence: "high" | "medium" | "low";
  reason: string;
};

function splitTimingWindows(windows: AstroTimelineWindow[]) {
  const today = new Date();
  const next12Months = new Date(today);
  next12Months.setMonth(next12Months.getMonth() + 12);

  function getFirstDate(label: string): Date | null {
    const m = String(label).match(/(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return null;
    return new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00`);
  }

  const majorWindows: AstroTimelineWindow[] = windows.filter(
    (w) => w.score >= 70
  );

  const nearTermWindows: AstroTimelineWindow[] = windows
  .filter((w) => {
    const d = getFirstDate(w.label);
    if (!d) return false;

    const isNearTerm = d >= today && d <= next12Months;
    const isMeaningful = w.score >= 35 && w.score < 70;

    return isNearTerm && isMeaningful;
  })
  .sort((a, b) => {
    const ar = String(a.reason ?? "").toLowerCase();
    const br = String(b.reason ?? "").toLowerCase();

    const aTransit =
      ar.includes("transit") ||
      ar.includes("ingress") ||
      ar.includes("retrograde") ||
      ar.includes("natal contact");

    const bTransit =
      br.includes("transit") ||
      br.includes("ingress") ||
      br.includes("retrograde") ||
      br.includes("natal contact");

    if (aTransit !== bTransit) return aTransit ? -1 : 1;

    const ad = getFirstDate(a.label)?.getTime() ?? 0;
    const bd = getFirstDate(b.label)?.getTime() ?? 0;

    return ad - bd;
  });

  const triggerWindows: AstroTimelineWindow[] = windows.filter((w) => {
    const reason = String(w.reason ?? "").toLowerCase();

    const isTransitTrigger =
      reason.includes("transit") ||
      reason.includes("ingress") ||
      reason.includes("retrograde") ||
      reason.includes("natal contact");

    return w.score >= 25 && w.score < 70 && isTransitTrigger;
  });

  return {
    majorWindows,
    nearTermWindows,
    triggerWindows,
  };
}
function buildAstroTimelineFromSignals(
  topic: AskSarathiDomain,
  report: any,
  themeSignal: GenericAstroBundle["themeSignal"],
  careerEventType?: CareerEventType
) {
  const candidates: Array<{
    label: string;
    confidence: "high" | "medium" | "low";
    reason: string;
    score: number;
  }> = [];

  const scoreToConfidence = (score: number): "high" | "medium" | "low" => {
    if (score >= 10) return "high";
    if (score >= 6) return "medium";
    return "low";
  };

  const windows = Array.isArray(report?.eventTimeline)
    ? report.eventTimeline
    : [];

  const transitWindows = Array.isArray(report?.transitWindows)
    ? report.transitWindows
    : [];
   const transitOpportunityCandidates: typeof candidates = [];
   for (const tr of transitWindows) {
  const transitPlanet = String(tr?.transitPlanet ?? tr?.planet ?? "").toLowerCase();
  const type = String(tr?.type ?? "").toLowerCase();
  const houseFromLagna = Number(tr?.houseFromLagna);
  const date =
    tr?.dateISO ??
    tr?.startISO ??
    tr?.start ??
    tr?.from ??
    null;

  if (!date) continue;

  let match = false;
  let score = 25;
  let reason = "Transit activity is creating a short-term activation phase.";

  if (topic === "career") {
    if (["mercury", "jupiter", "saturn", "sun", "rahu"].includes(transitPlanet)) {
      match = true;
      score += 5;
    }

    if ([10, 11, 6].includes(houseFromLagna)) {
      match = true;
      score += 8;
    }

    if (type.includes("sign_ingress") || type.includes("retrograde") || type.includes("nakshatra")) {
      score += 4;
    }

    reason = `${String(tr?.transitPlanet ?? "Transit")} ${String(
      tr?.type ?? "activation"
    ).replace(/_/g, " ")} activates career-related timing.`;
  }

  if (topic === "vehicle") {
    if (["venus", "mars"].includes(transitPlanet)) {
      match = true;
      score += 6;
    }

    if ([4, 11].includes(houseFromLagna)) {
      match = true;
      score += 6;
    }

    reason = `${String(tr?.transitPlanet ?? "Transit")} ${String(
      tr?.type ?? "activation"
    ).replace(/_/g, " ")} activates vehicle-related timing.`;
  }

  if (!match) continue;

  transitOpportunityCandidates.push({
    label: String(date).slice(0, 10),
    confidence: score >= 35 ? "medium" : "low",
    score,
    reason,
  });
}
   
  for (const t of transitWindows) {
    const txt = JSON.stringify(t).toLowerCase();

    if (
      topic === "vehicle" &&
      /\bvenus|mars|4th|h4|vehicle|car|comfort|luxury|d16\b/.test(txt)
    ) {
      const score =
        themeSignal?.strength === "strong"
          ? 10
          : themeSignal?.strength === "moderate"
          ? 7
          : 4;

      candidates.push({
        label:
          t?.label ||
          t?.window ||
          t?.title ||
          [t?.startISO || t?.from, t?.endISO || t?.to]
            .filter(Boolean)
            .join(" to ") ||
          "Upcoming supportive vehicle phase",
        confidence: scoreToConfidence(score),
        reason:
          "Vehicle-related transit triggers appear more active during this phase.",
        score,
      });
    }
  }

  for (const w of windows) {
    const title = String(w?.title || w?.label || "").toLowerCase();

    if (
      topic === "vehicle" &&
      /\bvehicle|car|purchase|comfort|luxury|transport\b/.test(title)
    ) {
      const score =
        themeSignal?.strength === "strong"
          ? 10
          : themeSignal?.strength === "moderate"
          ? 7
          : 4;

      candidates.push({
        label: w?.label || w?.title || "Upcoming window",
        confidence: scoreToConfidence(score),
        reason:
          "This window appears relevant because vehicle-related themes are becoming more active through current timing layers.",
        score,
      });
    }

    if (
      topic === "career" &&
      /\bcareer|promotion|job|visibility|leadership\b/.test(title)
    ) {
      const score =
        themeSignal?.strength === "strong"
          ? 10
          : themeSignal?.strength === "moderate"
          ? 7
          : 4;

      candidates.push({
        label: w?.label || w?.title || "Upcoming window",
        confidence: scoreToConfidence(score),
        reason:
          "This window appears relevant because career activation is increasing through dasha and transit support.",
        score,
      });
    }
  }

  const dashaTimeline = Array.isArray(report?.dashaTimeline)
    ? report.dashaTimeline
    : Array.isArray(report?.timeline)
    ? report.timeline
    : [];

  const todayISO = new Date().toISOString().slice(0, 10);

  const topicPlanets: Record<string, string[]> = Object.fromEntries(
  Object.entries(TOPIC_TRIGGER_WEIGHTS).map(([topicKey, config]) => [
    topicKey,
    [...config.primary, ...config.secondary, ...config.context],
  ])
);

  const relevantPlanets = topicPlanets[topic] ?? [];

  for (const row of dashaTimeline) {
    const start = String(row?.start ?? row?.startISO ?? "").slice(0, 10);
    const end = String(row?.end ?? row?.endISO ?? "").slice(0, 10);

    if (!start || start < todayISO) continue;

    const active = [row?.md, row?.ad, row?.pd]
      .filter(Boolean)
      .map((x: any) => String(x));

    const hits = active.filter((p) => relevantPlanets.includes(p));

    if (hits.length) {
      const scored = scorePredictionWindow({
  topic,
  row,
  report,
  careerEventType,
});

      candidates.push({
        label: `${start} to ${end}`,
        confidence: scored.confidence,
        reason: scored.reasons.join(". "),
        score: scored.score,
      });
    }

    if (candidates.length >= 12) break;
  }
  candidates.push(...transitOpportunityCandidates);
  candidates.sort((a, b) => b.score - a.score);



const topDashaCandidates = candidates
  .filter((c) => {
    const r = String(c.reason ?? "").toLowerCase();
    return !(
      r.includes("ingress") ||
      r.includes("retrograde") ||
      r.includes("natal contact") ||
      r.includes("transit")
    );
  })
  .slice(0, 8);

const topTransitCandidates = transitOpportunityCandidates.slice(0, 6);

return [...topDashaCandidates, ...topTransitCandidates];
}
function buildThemeSignal(
  topic: AskSarathiDomain,
  report: any,
  rule: TopicRule,
  timingPolicy: GenericAstroBundle["timingPolicy"],
  timingLayer: AnalysisLayer,
  divisionalLayer: AnalysisLayer,
  karakaLayer: AnalysisLayer
): GenericAstroBundle["themeSignal"] {
  const activeSignals: string[] = [];
  const missingSignals: string[] = [];
  let score = 0;

  if (timingPolicy.dashaStrength === "strong") {
    score += 35;
    activeSignals.push("Dasha-period support is strong for this theme.");
  } else if (timingPolicy.dashaStrength === "moderate") {
    score += 22;
    activeSignals.push("Dasha-period support gives partial support for this theme.");
  } else {
    missingSignals.push("Dasha-period support is not strong yet.");
  }

  if (timingPolicy.transitStrength === "strong") {
    score += 25;
    activeSignals.push("Current transits are actively triggering this theme.");
  } else if (timingPolicy.transitStrength === "moderate") {
    score += 15;
    activeSignals.push("Current transits give some support.");
  } else {
    missingSignals.push("Transit triggers are not strong enough yet.");
  }

  if (divisionalLayer.verdict === "strong" || divisionalLayer.verdict === "moderate") {
    score += 20;
    activeSignals.push(`Divisional support is ${divisionalLayer.verdict}.`);
  } else {
    missingSignals.push("Divisional confirmation is still weak or unclear.");
  }

  if (karakaLayer.verdict === "strong" || karakaLayer.verdict === "moderate") {
    score += 15;
    activeSignals.push(`Relevant karakas are ${karakaLayer.verdict}.`);
  } else {
    missingSignals.push("Relevant karakas are not strongly supporting yet.");
  }

  if (timingLayer.verdict === "strong" || timingLayer.verdict === "moderate") {
    score += 5;
  }

  const strength =
    score >= 70 ? "strong" :
    score >= 50 ? "moderate" :
    score >= 30 ? "mixed" :
    "weak";

  const timingStyle =
    strength === "strong" ? "event" :
    strength === "moderate" || strength === "mixed" ? "phase" :
    "preparation";

  const topicAdvice: Record<string, { bestUse: string; caution: string }> = {
    career: {
      bestUse: "Build visibility, strengthen decision-maker relationships, and take on responsibility that improves future positioning.",
      caution: "Avoid forcing title or salary outcomes before timing support becomes stronger.",
    },
    vehicle: {
      bestUse: "Research options, compare financing, check practical needs, and prepare documentation before committing.",
      caution: "Avoid impulsive purchase decisions or stretching affordability just because desire is high.",
    },
    property: {
      bestUse: "Use this phase for research, negotiation, documents, and financial readiness.",
      caution: "Avoid rushing into commitment before timing and affordability both support the move.",
    },
    marriage: {
      bestUse: "Focus on clarity, family alignment, emotional maturity, and realistic commitment discussions.",
      caution: "Avoid forcing commitment if timing or emotional readiness is unclear.",
    },
    relationships: {
      bestUse: "Observe consistency, communicate clearly, and allow emotional clarity to develop naturally.",
      caution: "Avoid overreading mixed signals or forcing certainty too early.",
    },
    money: {
      bestUse: "Improve cash-flow discipline, negotiate carefully, and strengthen income consistency.",
      caution: "Avoid depending on one sudden gain or speculative shortcut.",
    },
    health: {
      bestUse: "Strengthen routine, sleep, diet, stress management, and recovery discipline.",
      caution: "Avoid ignoring small symptoms or letting stress accumulate.",
    },
    generic: {
      bestUse: "Move steadily, keep decisions practical, and let clarity develop through action.",
      caution: "Avoid rushing decisions while signals are still forming.",
    },
  };

  const advice = topicAdvice[topic] ?? topicAdvice.generic;

  return {
    score,
    strength,
    activeSignals,
    missingSignals,
    bestUse: advice.bestUse,
    caution: advice.caution,
    timingStyle,
  };
}

function buildGenericAstroBundle(
  question: string,
  topic: AskSarathiDomain,
  questionType: AskSarathiQuestionType,
  answerMode: AnswerMode,
  report: any,
  careerEventTypeOverride?: CareerEventType
): GenericAstroBundle {
  let rule = resolveTopicRule(topic);

const dasha = getActiveDashaAnyShape(report);
const timeDirection = detectTimeDirection(question, topic);
const eventScale = detectEventScale(question, topic);

const eventType = detectEventType(question, topic, timeDirection);

const careerEventType =
  topic === "career"
    ? careerEventTypeOverride ?? (eventType as CareerEventType)
    : "generic";

if (topic === "career") {
  const careerRule = CAREER_EVENT_RULES[careerEventType];

  if (careerRule) {
    rule = {
      ...rule,
      houses: careerRule.houses,
      supportHouses: careerRule.supportHouses,
      karakas: careerRule.karakas,
    };
  }
}

  const careerInference = topic === "career" ? inferCareer(report) : null;
  const promiseLayer = buildPromiseLayer(report, rule);
  const divisionalLayer = buildDivisionalLayer(report, topic, rule);
  const karakaLayer = buildKarakaLayer(report, rule);
  const timingLayer = buildTimingLayer(report, rule, topic);
  const remediesLayer = buildRemediesLayer(report, rule, questionType);

  const timingPolicy = getTimingPolicy(
    report,
    rule,
    topic,
    question,
    careerEventType
  );
const eventTriggers = buildUniversalEventTriggers({
  report,
  topic,
  eventType,
  rule,
  timingPolicy,
  promiseLayer,
  divisionalLayer,
  karakaLayer,
});

const bestEventTrigger = eventTriggers[0] ?? null;

  const eventHints = buildEventHints(
    topic,
    questionType,
    timingLayer,
    timingPolicy,
    divisionalLayer.chartBreakdown
  );
  const actionBias = buildActionBias({
  topic,
  timingLayer,
  timingPolicy,
  divisionalBreakdown: divisionalLayer.chartBreakdown,
});
  const timingWindows = buildTimingWindows(
    report,
    topic,
    timeDirection,
    eventScale,
    careerEventType,
    timingPolicy
  );

  const timingConfidenceNote = buildTimingConfidenceNote(
    question,
    topic,
    timeDirection,
    timingLayer,
    {
      md: dasha.md,
      ad: dasha.ad,
      pd: dasha.pd,
      line: [dasha.md, dasha.ad, dasha.pd].filter(Boolean).join(" • ") || "Not clear",
    },
    timingWindows,
    careerEventType,
    timingPolicy
  );
  
  const topicEvidenceLabel =
    topic === "career"
      ? "Career houses checked"
      : topic === "marriage"
      ? "Marriage houses checked"
      : topic === "relationships"
      ? "Relationship houses checked"
      : topic === "property"
      ? "Property houses checked"
      : topic === "money"
      ? "Money houses checked"
      : topic === "health"
      ? "Health houses checked"
      : topic === "relocation"
      ? "Relocation houses checked"
      : "Relevant houses checked";

   const activeDashaLine = [dasha.md, dasha.ad, dasha.pd].filter(Boolean).join(" • ");

  const historicalDashaCount = Array.isArray(report?.dashaTimeline)
    ? report.dashaTimeline.length
    : Array.isArray(report?.timeline)
    ? report.timeline.length
    : 0;

const natalPlanets = Array.isArray(report?.natal?.planets)
  ? report.natal.planets
  : [];

const describeNatalPlanet = (planet: string) => {
  const p = natalPlanets.find((x: any) => x?.planet === planet);
  if (!p) return "";

  const houseText =
    typeof p.house === "number" ? `house ${p.house}` : "an unclear house";

  const signText = p.sign ? `${p.sign}` : "an unclear sign";

  const nakText = p.nakshatra ? `, ${p.nakshatra} nakshatra` : "";

  return `${planet} is placed in ${signText} in ${houseText}${nakText}.`;
};
const housesArray = Array.isArray(report?.houses)
  ? report.houses
  : Array.isArray(report?.chartContext?.houses)
  ? report.chartContext.houses
  : [];

const getLordshipsForPlanet = (planet: string) => {
  return housesArray
    .filter((h: any) => h?.lord === planet)
    .map((h: any) => h?.house)
    .filter(Boolean);
};
const describePlanetWithLordship = (planet: string) => {
  const p = natalPlanets.find((x: any) => x?.planet === planet);
  if (!p) return "";

  const lordships = Array.isArray(p.lordships) && p.lordships.length
  ? p.lordships
  : getLordshipsForPlanet(planet);

  const lordshipText = lordships.length
    ? `${planet} rules house ${lordships.join(" and house ")}`
    : `${planet}'s house lordship is not clearly available`;

  const placementText =
    `${planet} is placed in ${p.sign ?? "an unclear sign"} in house ${
      typeof p.house === "number" ? p.house : "unclear"
    }${p.nakshatra ? `, ${p.nakshatra} nakshatra` : ""}`;

  return `${lordshipText}; ${placementText}.`;
};

const dashaCandidates: any[] = [
  getActiveDashaAnyShape(report),
  getActiveDashaAnyShape(report?.dasha),
  getActiveDashaAnyShape(report?.timing?.dasha),
  getActiveDashaAnyShape(report?.chartContext),
  getActiveDashaAnyShape(report?.chartContext?.dasha),
  report?.dasha?.current,
  report?.chartContext?.dasha?.current,
];

const dashaSource = dashaCandidates.find(
  (d) => d?.md || d?.ad || d?.pd
);

const dashaParts = [
  dashaSource?.md,
  dashaSource?.ad,
  dashaSource?.pd,
].filter(Boolean);

const dashaLine = dashaParts.length
  ? dashaParts.join("–")
  : activeDashaLine;


const divisionalChartsForTopic =
  DIVISIONAL_PROFILES[topic] ??
  DIVISIONAL_PROFILES.generic ??
  [];

const triggerEngine = report?.triggerEngine ?? null;
const dashaContext = report?.dashaContext ?? null;

const careerTriggerFacts = Array.isArray(triggerEngine?.facts)
  ? triggerEngine.facts
      .filter((f: any) => f?.area === "career")
      .slice(0, 6)
  : [];

const careerScore = Array.isArray(triggerEngine?.scores)
  ? triggerEngine.scores.find((s: any) => s?.area === "career")
  : null;

const microCareerDays = Array.isArray(triggerEngine?.microTriggerDays)
  ? triggerEngine.microTriggerDays
      .filter((d: any) =>
        String(d?.title ?? "").toLowerCase().includes("career")
      )
      .slice(0, 4)
  : [];

const mdContext = dashaContext?.md;
const adContext = dashaContext?.ad;
const pdContext = dashaContext?.pd;

const evidenceBullets = uniq([
  dashaLine
    ? `Current dasha chain → ${dashaLine}.`
    : "Current dasha data is not clearly available yet.",

  mdContext
    ? `Mahadasha context → ${mdContext.planet} is in house ${mdContext.house} in ${mdContext.sign}; dispositor chain: ${
        Array.isArray(mdContext.dispositorChain)
          ? mdContext.dispositorChain.join(" → ")
          : "not clear"
      }.`
    : "",

  adContext
    ? `Antardasha context → ${adContext.planet} rules houses ${
        Array.isArray(adContext.ruledHouses) && adContext.ruledHouses.length
          ? adContext.ruledHouses.join(", ")
          : "not clear"
      } and is placed in house ${adContext.house} in ${adContext.sign}.`
    : "",

  pdContext
    ? `Pratyantardasha context → ${pdContext.planet} is placed in house ${pdContext.house} in ${pdContext.sign}.`
    : "",

  Array.isArray(dashaContext?.activatedHouses) &&
  dashaContext.activatedHouses.length
    ? `Current dasha activates houses → ${dashaContext.activatedHouses.join(", ")}.`
    : "",

  topic === "career" && CAREER_EVENT_RULES[careerEventType]
  ? `Career judgement is being read specifically for ${careerEventType}. Relevant indicators checked → houses ${rule.houses.join(
      ", "
    )}, support houses ${(rule.supportHouses ?? []).join(
      ", "
    )}, D10, current dasha, and transit triggers. This event type can show as ${
      CAREER_EVENT_RULES[careerEventType]?.windowLanguage
    }.`
  : topic === "career"
  ? "Career judgement is being read from the 10th house, 6th house, 2nd house, 11th house, D10, and the current dasha/transit trigger."
  : buildHumanEvidenceLine(topic, rule, timingPolicy),

  ...rule.karakas
    .map((planet) => describePlanetWithLordship(planet))
    .filter(Boolean),

  careerScore
    ? `Trigger engine career score → ${careerScore.score}/100 (${careerScore.level}).`
    : "",

  ...careerTriggerFacts.map(
    (f: any) =>
      `Career trigger → ${f.title}: ${f.explanation}${
        f.strength ? ` Strength ${f.strength}/100.` : ""
      }`
  ),

  microCareerDays.length
    ? `Short-term career trigger days → ${microCareerDays
        .map((d: any) => `${d.dateISO} (${d.title}, strength ${d.strength})`)
        .join(" | ")}.`
    : "",

  ...(topic === "career"
    ? [
        "For promotion, the key question is whether responsibility is converting into 10th/11th house recognition and reward.",
      ]
    : []),

  ...(topic === "marriage" && timeDirection === "past"
    ? [
        `Marriage activators checked → ${
          getMarriageActivators(report).join(", ") || "Not clear"
        }`,
      ]
    : []),

  `Divisional charts checked → ${divisionalChartsForTopic
    .map((x) => x.chart)
    .join(", ")}`,

  ...(divisionalLayer.chartBreakdown?.some(
    (x) => x.strength && x.strength !== "unclear"
  )
    ? [
        `Divisional strength mix → ${divisionalLayer.chartBreakdown
          .map((x) =>
            x.strength && x.strength !== "unclear"
              ? `${x.chart}:${x.strength}`
              : null
          )
          .filter(Boolean)
          .join(", ")}`,
      ]
    : []),

  timingPolicy?.note ? `Timing judgement → ${timingPolicy.note}` : "",

  ...(historicalDashaCount > 0
    ? [`Historical dasha timeline scanned → ${historicalDashaCount} periods`]
    : []),

  ...(timingWindows[0]
    ? [
        `Strongest visible timing window → ${
          timingWindows[0].peak || timingWindows[0].label
        }`,
      ]
    : []),
].filter(Boolean));
  const responseState = detectResponseState({
  topic,
  timingLayer,
  timingPolicy,
  report,
  currentDasha: dasha,
});
const themeSignal = buildThemeSignal(
  topic,
  report,
  rule,
  timingPolicy,
  timingLayer,
  divisionalLayer,
  karakaLayer
);
const astroTimeline = buildAstroTimelineFromSignals(
  topic,
  report,
  themeSignal,
  careerEventType
);
const {
  majorWindows,
  nearTermWindows,
  triggerWindows,
} = splitTimingWindows(astroTimeline);
const needsNextLogicalWindow =
  questionType === "timing" &&
  timeDirection === "future" &&
  timingWindows.length === 0 &&
  majorWindows.length === 0 &&
  triggerWindows.length === 0;
  
const broadFutureWindows = needsNextLogicalWindow
  ? buildBroadFutureWindows(report, topic, eventScale)
  : [];

const logicalTimingWindows = needsNextLogicalWindow
  ? buildNextLogicalTimingWindows({
      report,
      topic,
      rule,
      eventType,
      careerEventType,
      eventScale,
    })
  : [];

const fallbackTimingWindows =
  logicalTimingWindows.length > 0
    ? logicalTimingWindows
    : broadFutureWindows;

const finalTimingWindows =
  timingWindows.length > 0 ? timingWindows : fallbackTimingWindows;

const finalMajorWindows =
  majorWindows.length > 0
    ? majorWindows
    : fallbackTimingWindows.map((w) => ({
        label: w.label,
        confidence: "low" as const,
        reason:
  w.why?.filter(Boolean).join(" ") ||
  "Broad future window used because no sharper timing was found.",
        score: 35,
      }));
      const rankedTimingWindows = rankTimingWindows({
  windows: finalTimingWindows,
  topic,
  eventType,
  timingPolicy,
  promiseLayer,
  divisionalLayer,
  karakaLayer,
});

const nearestWindow =
  finalTimingWindows.length > 0
    ? finalTimingWindows[0]
    : null;

const strongestWindow =
  rankedTimingWindows.length > 0
    ? rankedTimingWindows[0]
    : null;

const bestAvailableWindow =
  bestEventTrigger && bestEventTrigger.confidence !== "low"
    ? {
        label: fmtDateShort(bestEventTrigger.date),
        start: bestEventTrigger.date,
        end: bestEventTrigger.date,
        peak: bestEventTrigger.date,
        why: bestEventTrigger.why,
        score: bestEventTrigger.score,
        confidence: bestEventTrigger.confidence,
        windowClass:
          bestEventTrigger.confidence === "high"
            ? "outcome"
            : "movement",
        practicalMeaning: bestEventTrigger.practicalMeaning,
      }
    : rankedTimingWindows.find(
        (w) =>
          w.windowClass === "outcome" ||
          w.windowClass === "conversion" ||
          w.windowClass === "movement"
      ) ??
      rankedTimingWindows[0] ??
      null;
const activeDashaForDebug = getActiveDashaAnyShape(report);
const selectedTimingWindow =
  bestAvailableWindow ??
  strongestWindow ??
  nearestWindow ??
  null;
console.log(
  "[PROPERTY WINDOW DEBUG]",
  JSON.stringify(
    {
      topic,
      eventType,

      nearestWindow,
      strongestWindow,
      bestAvailableWindow,
    },
    null,
    2
  )
);
const preferredTimingWindow =
  bestAvailableWindow ??
  strongestWindow ??
  nearestWindow ??
  null;

const finalTimingLayer: AnalysisLayer =
  needsNextLogicalWindow && timingLayer.verdict === "weak"
    ? {
        ...timingLayer,
        summary: preferredTimingWindow
          ? `Current timing is ${
              preferredTimingWindow.confidence === "medium" ||
              preferredTimingWindow.confidence === "high"
                ? "usable but not guaranteed"
                : "weak for immediate conversion"
            }. The strongest available timing clue is ${preferredTimingWindow.label}, and it should be read as a ${preferredTimingWindow.confidence}-confidence ${preferredTimingWindow.windowClass} window, not a guaranteed final outcome.`
          : "Current timing is weak for immediate conversion, and no reliable future window is visible from the available dasha, transit, or timeline data.",
        bullets: preferredTimingWindow
          ? [
              `Best available timing clue: ${preferredTimingWindow.label}`,
              ...(preferredTimingWindow.why ?? []).slice(0, 2),
              preferredTimingWindow.practicalMeaning ??
                "Use this as activation timing, not a guaranteed outcome.",
            ]
          : [],
      }
    : timingLayer;  
    
    const winningEvidence = buildWinningEvidence({
  topic,
  eventType,
  bestAvailableWindow: selectedTimingWindow,
  strongestWindow: null,
  nearestWindow: null,
  promiseLayer,
  divisionalLayer,
  karakaLayer,
  timingLayer: finalTimingLayer,
});

const whyNotNow = buildWhyNotNow({
  topic,
  timingLayer: finalTimingLayer,
  promiseLayer,
  divisionalLayer,
  currentDashaLine: [dasha.md, dasha.ad, dasha.pd]
    .filter(Boolean)
    .join("–"),
});
const conversionDiagnosisV2 = buildConversionDiagnosisV2({
  topic,
  eventType,
  promiseLayer,
  divisionalLayer,
  karakaLayer,
  timingLayer: finalTimingLayer,
  bestAvailableWindow,
});

const promotionConversionEngine =
  topic === "career" && eventType === "promotion"
    ? buildPromotionConversionEngine({
        promiseLayer,
        divisionalLayer,
        karakaLayer,
        timingLayer: finalTimingLayer,
        bestAvailableWindow,
      })
    : null;
    console.log(
  "[PROMOTION ENGINE DEBUG]",
  JSON.stringify(promotionConversionEngine, null, 2)
);
const diagnosticProfile =
  questionType === "diagnosis" ||
  questionType === "action_plan" ||
  questionType === "decision"
    ? buildHolisticDiagnosticProfile({
        question,
        topic,
        eventType,
        report,
        astroBundle: {
          promiseLayer,
          divisionalLayer,
          karakaLayer,
          timingLayer: finalTimingLayer,
timingPolicy,
majorWindows: finalMajorWindows,
nearTermWindows,
          themeSignal,
          actionBias,
          focusHouses: rule.houses,
          supportHouses: rule.supportHouses ?? [],
          karakas: rule.karakas,
          divisionalCharts: rule.divisionalCharts,
        },
      })
    : undefined;

  const phasePsychology = buildPhasePsychology(
  topic,
  finalTimingLayer,
  timingPolicy,
  responseState,
);
  const strategy = buildStrategyLayer(topic, responseState);
  const remediesDetailed = buildDetailedRemedies(topic);
  const hiddenOpportunity = buildHiddenOpportunity(topic);
  
  const confidence = confidenceFromScores([
    promiseLayer.verdict === "strong" ? 80 : promiseLayer.verdict === "moderate" ? 65 : promiseLayer.verdict === "mixed" ? 48 : 28,
    divisionalLayer.verdict === "strong" ? 78 : divisionalLayer.verdict === "moderate" ? 62 : divisionalLayer.verdict === "mixed" ? 45 : 25,
    karakaLayer.verdict === "strong" ? 78 : karakaLayer.verdict === "moderate" ? 62 : karakaLayer.verdict === "mixed" ? 45 : 25,
    finalTimingLayer.verdict === "strong" ? 84 : finalTimingLayer.verdict === "moderate" ? 66 : finalTimingLayer.verdict === "mixed" ? 46 : 24,
  ]);
  return {
    question,
    topic,
    questionType,
    eventType,
    diagnosticProfile,
    timeDirection,
    astroTimeline,
    majorWindows: finalMajorWindows,
nearTermWindows,
triggerWindows,
    eventScale,
    eventHints,
    actionBias,
    careerEventType,
    focusHouses: rule.houses,
    supportHouses: rule.supportHouses ?? [],
    karakas: rule.karakas,
    divisionalCharts: rule.divisionalCharts,
    currentDasha: {
      md: dasha.md,
      ad: dasha.ad,
      pd: dasha.pd,
      line: [dasha.md, dasha.ad, dasha.pd].filter(Boolean).join(" • ") || "Not clear",
    },
    careerInference,
    promiseLayer,
    divisionalLayer,
    divisionalBreakdown: divisionalLayer.chartBreakdown,
    karakaLayer,
    timingLayer: finalTimingLayer,
    timingPolicy,
    remediesLayer,
    timingWindows: finalTimingWindows,
    rankedTimingWindows,
nearestWindow,
strongestWindow,
bestAvailableWindow,
selectedTimingWindow,
eventTriggers,
bestEventTrigger,
winningEvidence,
whyNotNow,
conversionDiagnosisV2,
promotionConversionEngine,
    themeSignal,
    evidenceBullets,
    confidence,
       timingConfidenceNote,
    answerSummary: buildAnswerSummary(
  report,
  topic,
  finalTimingLayer,
  finalTimingWindows,
  timeDirection,
  confidence,
  careerEventType,
  timingPolicy,
  answerMode
),
    phasePsychology,
    strategy,
    remediesDetailed,
    hiddenOpportunity,
    responseState,
    answerMode,
  };
}
/* --------------------------------------------------
   Response enhancement layer
-------------------------------------------------- */

function buildPhasePsychology(
  topic: AskSarathiDomain,
  timingLayer: AnalysisLayer,
  timingPolicy: any,
  responseState?: any
) {
  const tone = responseState?.emotionalTone;
const energy = responseState?.energyState;
  if (topic === "career") {
    if (tone === "grounded") {
  return {
    title: "Why this phase feels heavier",
    text: pickOne([
      "This phase is demanding patience, consistency, and long-term restructuring. Progress may feel slower externally because the chart is emphasizing stability before visible reward.",

      "The chart is currently slowing external momentum so deeper restructuring can happen first. This often creates phases where effort feels heavier than recognition.",

      "Right now the chart is prioritizing endurance, discipline, and sustainable progress rather than fast external breakthroughs.",
    ]),
  };
}

if (tone === "intense") {
  return {
    title: "Why this phase feels intense",
    text: pickOne([
      "The chart is currently amplifying ambition, uncertainty, and the desire for movement. This can create periods of restlessness where growth is happening before clarity stabilizes.",

      "This phase carries strong movement energy, but not always stable direction. You may feel pulled toward rapid change while still seeking certainty.",

      "The current planetary pattern increases intensity, urgency, and internal pressure for progress, even while outcomes are still developing.",
    ]),
  };
}

return {
  title: "Why this phase feels this way",
  text:
  timingPolicy?.dashaStrength === "strong"
    ? pickOne([
        "This phase is creating pressure around direction, recognition, and long-term responsibility. The chart is pushing professional restructuring and visibility growth at the same time, which is why effort may currently feel heavier than reward.",

        "The chart is currently emphasizing responsibility, visibility, and long-term positioning. This can create phases where expectations rise faster than external rewards.",

        "Professional pressure is increasing because the chart is trying to strengthen long-term structure, authority, and consistency before larger recognition arrives.",
      ])
    : pickOne([
        "This phase can feel slower externally because the chart is prioritizing restructuring, patience, and long-term positioning before stronger outward movement becomes visible.",

        "The chart currently favors gradual positioning and internal strengthening over rapid external breakthroughs.",

        "This is a quieter rebuilding phase where stability and strategic growth matter more than immediate external recognition.",
      ]),
    };
  }

  if (topic === "relationships" || topic === "marriage") {
    return {
      title: "Why emotions feel amplified",
      text:
        "The current chart activation is increasing emotional sensitivity, expectations, and attachment patterns. This phase is helping clarify which connections genuinely support your emotional peace and long-term stability.",
    };
  }

  if (topic === "money") {
    return {
      title: "Why finances may feel inconsistent",
      text:
        "The chart currently shows a transition between stability and expansion. This often creates phases where effort increases before financial confidence fully returns.",
    };
  }

  return {
    title: "Current phase",
    text:
      "Your chart is currently moving through a transition phase where internal adjustments are happening before external clarity fully emerges.",
  };
}

function buildStrategyLayer(
  topic: AskSarathiDomain,
  responseState?: any
) {
  const dominant = responseState?.dominantPlanet;
  if (dominant === "saturn") {
  return {
    title: "Best strategy right now",
    focus:
      "Slow, disciplined consistency will create better long-term results than emotionally forcing outcomes.",

    push: [
      "Strengthen systems and routines",
      "Focus on reliability and reputation",
      "Build long-term credibility",
    ],

    avoid: [
      "Avoid frustration with slow progress",
      "Avoid comparing timelines with others",
    ],
  };
}

if (dominant === "rahu") {
  return {
    title: "Best strategy right now",
    focus:
      "Clarity and grounded decision-making are more important than rapid expansion right now.",

    push: [
      "Double-check important decisions",
      "Focus on strategic networking",
      "Pause before impulsive commitments",
    ],

    avoid: [
      "Avoid emotionally driven decisions",
      "Avoid chasing unrealistic shortcuts",
    ],
  };
}
  if (topic === "career") {
    return {
      title: "Best strategy right now",
      focus:
        "This is a phase for strategic positioning rather than emotional decision-making.",

      push: [
        "Increase professional visibility gradually",
        "Reconnect with useful contacts and networks",
        "Focus on consistency over intensity",
        "Strengthen communication with authority figures",
      ],

      avoid: [
        "Avoid impulsive resignations",
        "Avoid reacting emotionally to delays",
        "Avoid burnout through overwork",
      ],
    };
  }

  if (topic === "relationships") {
    return {
      title: "Best strategy right now",
      focus:
        "Allow emotional clarity to develop naturally instead of forcing certainty immediately.",

      push: [
        "Focus on honest communication",
        "Observe consistency rather than intensity",
        "Allow emotional space where needed",
      ],

      avoid: [
        "Avoid overanalyzing mixed signals",
        "Avoid emotional pressure or ultimatums",
      ],
    };
  }

  return {
    title: "Best strategy right now",
    focus:
      "Steady progress and emotional balance are more beneficial right now than forceful action.",

    push: [
      "Stay consistent",
      "Focus on sustainable progress",
    ],

    avoid: [
      "Avoid rushing major decisions",
    ],
  };
}

function buildDetailedRemedies(topic: AskSarathiDomain) {
  if (topic === "career") {
    return {
      title: "Remedies & alignment",
      items: [
        {
          remedy: "Structured sunrise routine",
          why: "Supports Sun stability, improves mental clarity, and helps strengthen consistency in professional visibility.",
        },
        {
          remedy: "Grounding physical activity",
          why: "Helps stabilize Mars energy and reduces frustration, impatience, and internal pressure created by delayed momentum.",
        },
      ],
    };
  }

  if (topic === "relationships") {
    return {
      title: "Remedies & alignment",
      items: [
        {
          remedy: "Emotional grounding practices",
          why: "Helps reduce emotional overreaction and improves clarity in relationships.",
        },
      ],
    };
  }

  return {
    title: "Remedies & alignment",
    items: [
      {
        remedy: "Consistency in routine",
        why: "Helps stabilize emotional and mental fluctuations during uncertain phases.",
      },
    ],
  };
}

function buildHiddenOpportunity(topic: AskSarathiDomain) {
  if (topic === "career") {
    return {
      title: "Hidden opportunity in this phase",
      text:
        "Although this phase may feel slower externally, the chart strongly supports long-term repositioning, skill strengthening, and strategic visibility growth.",
    };
  }

  if (topic === "relationships") {
    return {
      title: "Hidden opportunity in this phase",
      text:
        "This phase can help you understand the difference between emotional attachment and genuine emotional compatibility.",
    };
  }

  return {
    title: "Hidden opportunity in this phase",
    text:
      "The current phase is helping build long-term clarity even if immediate answers still feel incomplete.",
  };
}
/* --------------------------------------------------
   Dynamic response state engine
-------------------------------------------------- */

function detectResponseState({
  topic,
  timingLayer,
  timingPolicy,
  currentDasha,
}: any) {
  const md = currentDasha?.md?.toLowerCase?.() || "";
  const ad = currentDasha?.ad?.toLowerCase?.() || "";

  const combined = `${md} ${ad}`;

  // Saturn pressure
  if (combined.includes("saturn")) {
    return {
      emotionalTone: "grounded",
      energyState: "slow_rebuild",
      guidanceStyle: "strategic_patience",
      confidenceStyle: "measured",
      dominantPlanet: "saturn",
    };
  }

  // Rahu intensity
  if (combined.includes("rahu")) {
    return {
      emotionalTone: "intense",
      energyState: "unstable_growth",
      guidanceStyle: "careful_expansion",
      confidenceStyle: "adaptive",
      dominantPlanet: "rahu",
    };
  }

  // Moon sensitivity
  if (combined.includes("moon")) {
    return {
      emotionalTone: "sensitive",
      energyState: "emotionally_active",
      guidanceStyle: "emotional_balance",
      confidenceStyle: "gentle",
      dominantPlanet: "moon",
    };
  }

  // Jupiter expansion
  if (combined.includes("jupiter")) {
    return {
      emotionalTone: "hopeful",
      energyState: "growth_phase",
      guidanceStyle: "expansion",
      confidenceStyle: "optimistic",
      dominantPlanet: "jupiter",
    };
  }

  return {
    emotionalTone: "balanced",
    energyState: "steady",
    guidanceStyle: "measured_progress",
    confidenceStyle: "neutral",
    dominantPlanet: "balanced",
  };
}
/* --------------------------------------------------
   Tone / formatting
-------------------------------------------------- */

function detectDistress(q: string): boolean {
  const l = q.toLowerCase();
  const triggers = [
    "stuck", "nothing is moving", "nothing is happening", "why is nothing",
    "tired", "exhausted", "burned out", "burnt out", "frustrated",
    "losing hope", "scared", "worried", "anxious", "panic", "why me",
  ];
  return triggers.some((t) => l.includes(t));
}

function inferMood(q: string): string {
  const l = q.toLowerCase();
  if (/anxious|scared|worried|stressed|tired|exhausted|stuck|losing hope/.test(l)) {
    return "the user sounds emotionally loaded and needs clarity, not fluff";
  }
  if (/when|timing|window|which month|which year/.test(l)) {
    return "the user wants timing truth first";
  }
  if (/should i|can i|good time/.test(l)) {
    return "the user wants a decision-oriented answer";
  }
  return "neutral curiosity, answer naturally and directly";
}

function pickToneAndDepth(question: string, topic: AskSarathiDomain) {
  const q = question.toLowerCase();
  if (/when|timing|window|which month|which year/.test(q)) {
    return { tone: "direct", depth: "standard" };
  }
  if (topic === "inner" || /why is|why am i|what is happening/.test(q)) {
    return { tone: "calm_protector", depth: "deep" };
  }
  if (topic === "career" || topic === "money") {
    return { tone: "strategist", depth: "standard" };
  }
  return { tone: "practical", depth: "standard" };
}

function buildFormatRules(questionType: AskSarathiQuestionType): string {
  if (questionType === "timing") {
    return [
      "Keep the answer compact.",
      "Lead with timing truth in the first sentence.",
      "Use broader window first, then peak trigger.",
      "Do not over-explain unless the data is weak and needs qualification.",
    ].join(" ");
  }

  if (questionType === "decision") {
    return [
      "Answer the decision clearly first.",
      "Then explain why from chart promise + dasha + transits.",
      "End with one practical line.",
    ].join(" ");
  }

  if (questionType === "remedy") {
    return [
      "Only suggest remedies that follow the actual chart logic.",
      "Do not recommend random gemstones or rituals.",
      "Tie remedy suggestions to the named dasha chain and the relevant houses/karakas.",
    ].join(" ");
  }

  return [
    "Answer like Sārathi, not like a report.",
    "Use the structured analysis but speak in real-life language.",
    "Do not repeat the same point twice.",
  ].join(" ");
}
function detectInteractionIntent(
  question: string,
  questionType: AskSarathiQuestionType,
  topic: AskSarathiDomain
) {
  const q = question.toLowerCase();

  if (
    questionType === "daily_micro" ||
    questionType === "daily_outlook"
  ) {
    return "day_briefing";
  }

  if (questionType === "decision") {
    return "decision_support";
  }

  if (questionType === "timing") {
    return "timing_request";
  }

  if (questionType === "diagnosis") {
    return "root_cause";
  }

  if (questionType === "comparison") {
    return "comparison";
  }

  return "general_guidance";
}
/* --------------------------------------------------
   Naturalize payload builder
-------------------------------------------------- */

function buildNaturalizeChartSnapshot(report: any) {
  const chart = report?.chartContext ?? report ?? null;
  if (!chart || typeof chart !== "object") return null;

  return {
    ascendant:
      chart?.ascendant ??
      chart?.natal?.ascendant ??
      chart?.birthChart?.ascendant ??
      chart?.baseChartFactors?.ascendant ??
      null,
    planets:
      chart?.planets ??
      chart?.natal?.planets ??
      chart?.birthChart?.planets ??
      null,
    houses:
      chart?.houses ??
      chart?.natal?.houses ??
      chart?.birthChart?.houses ??
      null,
    houseLords:
      chart?.houseLords ??
      chart?.natal?.houseLords ??
      null,
    activePeriods:
      chart?.activePeriods ??
      chart?.dashaContext?.activePeriods ??
      chart?.chartContext?.dashaContext?.activePeriods ??
      null,
    currentTransits:
      chart?.currentTransits ??
      chart?.transits ??
      chart?.topTransits ??
      null,
  };
}

function buildAstrologySafetyLayer(topic: AskSarathiDomain, question: string) {
  const q = question.toLowerCase();
  const isHealthLike =
    topic === "health" ||
    topic === "mental_health" ||
    /\b(symptom|pain|illness|medicine|medication|doctor|diagnosis|anxiety|depression|panic|self harm|suicide)\b/.test(q);

  return {
    noDeterminism: true,
    noGuarantees: true,
    avoidFearLanguage: true,
    remediesAreSupportiveOnly: true,
    healthGuardrail: isHealthLike
      ? "Do not diagnose, do not suggest stopping medication, and do not present astrology/remedies/gemstones/mantras as a substitute for medical or mental-health care. For serious, persistent, or urgent symptoms, advise professional help."
      : null,
    sensitiveTopics: ["health", "mental_health", "longevity", "death", "pregnancy", "legal", "financial risk"],
  };
}

function buildNaturalizePayload(params: {
  question: string;
  topic: AskSarathiDomain;
  questionType: AskSarathiQuestionType;
  report: any;
  astroBundle: GenericAstroBundle;
  distressed: boolean;
  finalDecisionLine?: string;
  finalDecisionVerdict?: string;
  simpleGuidanceMode?: boolean;
}) {
  const {
  question,
  topic,
  questionType,
  simpleGuidanceMode,
  report,
  astroBundle,
  distressed,
  finalDecisionLine,
  finalDecisionVerdict,
} = params;
  const { tone, depth } = pickToneAndDepth(question, topic);

  return {
    userQuestion: question,
    topic,
    questionType,
    verdict: astroBundle.verdict ?? null,
humanReason: astroBundle.humanReason ?? null,
astroReason: astroBundle.astroReason ?? null,
dailyAstroContext:
  astroBundle.dailyAstroContext ?? null,
    simpleGuidanceMode,
    tone,
    depth,
    conversationPsychology:
  astroBundle.conversationPsychology ?? null,
   astroJudgement:
    astroBundle.astroJudgement ?? null,
    distressed,
    finalDecisionLine,
    finalDecisionVerdict,
    moodHint: inferMood(question),
    confidenceLevel: astroBundle.confidence.toLowerCase(),
    formatTier:
  astroBundle.answerMode === "DIAGNOSTIC_FIRST"
    ? "deep"
    : questionType === "timing"
    ? "micro"
    : "standard",
    formatRules: buildFormatRules(questionType),

    // generic structured payload only
    astroFacts: {
      topic: astroBundle.topic,
      questionType: astroBundle.questionType,
      timeDirection: astroBundle.timeDirection,
      eventScale: astroBundle.eventScale,
      eventHints: astroBundle.eventHints ?? [],
      actionBias: astroBundle.actionBias ?? null,
      focusHouses: astroBundle.focusHouses,
      supportHouses: astroBundle.supportHouses,
      karakas: astroBundle.karakas,
      divisionalCharts: astroBundle.divisionalCharts,
      currentDasha: astroBundle.currentDasha,
      careerInference: astroBundle.careerInference ?? null,
      answerSummary: astroBundle.answerSummary,
      eventType: astroBundle.eventType ?? null,
      diagnosticProfile: astroBundle.diagnosticProfile ?? null,
      insightProfile: astroBundle.insightProfile ?? null,
      chartRealityProfile: astroBundle.chartRealityProfile ?? null,
      pastActivationProfile: astroBundle.pastActivationProfile ?? null,
      evidenceNarrative:
  astroBundle.evidenceNarrative ?? null,
      themeSignal: astroBundle.themeSignal,
      phasePsychology: astroBundle.phasePsychology,
      astroInterpretationPacket:
  astroBundle.astroInterpretationPacket ?? null,
  astroJudgement: astroBundle.astroJudgement ?? null,
  dailyAstroContext:
  astroBundle.dailyAstroContext ?? null,
strategy: astroBundle.strategy,
astroReasonMap: astroBundle.astroReasonMap ?? null,
remediesDetailed: astroBundle.remediesDetailed,
hiddenOpportunity: astroBundle.hiddenOpportunity,
      promiseLayer: astroBundle.promiseLayer,
      divisionalLayer: astroBundle.divisionalLayer,
      divisionalBreakdown: astroBundle.divisionalBreakdown ?? [],
      karakaLayer: astroBundle.karakaLayer,
      timingLayer: astroBundle.timingLayer,
      remediesLayer: astroBundle.remediesLayer,
      timingWindows: astroBundle.timingWindows,
astroTimeline: astroBundle.astroTimeline ?? [],
majorWindows: astroBundle.majorWindows ?? [],
winningEvidence: astroBundle.winningEvidence ?? null,
whyNotNow: astroBundle.whyNotNow ?? [],
strongestSupport: astroBundle.winningEvidence?.strongestSupport ?? null,
strongestBlocker: astroBundle.winningEvidence?.strongestBlocker ?? null,
conversionDiagnosisV2: astroBundle.conversionDiagnosisV2 ?? null,
promotionConversionEngine: astroBundle.promotionConversionEngine ?? null,
rankedTimingWindows: astroBundle.rankedTimingWindows ?? [],
nearestWindow: astroBundle.nearestWindow ?? null,
strongestWindow: astroBundle.strongestWindow ?? null,
bestAvailableWindow: astroBundle.bestAvailableWindow ?? null,
selectedTimingWindow: astroBundle.selectedTimingWindow ?? null,
eventTriggers: astroBundle.eventTriggers ?? [],
bestEventTrigger: astroBundle.bestEventTrigger ?? null,
nearTermWindows: astroBundle.nearTermWindows ?? [],
triggerWindows: astroBundle.triggerWindows ?? [],
timingConfidenceNote: astroBundle.timingConfidenceNote,
      natal: report?.natal ?? null,
      houseLords: report?.houseLords ?? report?.natal?.houseLords ?? null,
      baseChartFactors: report?.baseChartFactors ?? null,
chartContext: buildNaturalizeChartSnapshot(report),
dataEngine: null,
safetyLayer: buildAstrologySafetyLayer(astroBundle.topic, question),
      timingPolicy: astroBundle.timingPolicy,
    },
interactionIntent: detectInteractionIntent(
  question,
  questionType,
  topic
),

    evidenceBullets: astroBundle.evidenceBullets,
  };
}
function formatCareerLabel(value: string | null | undefined): string {
  return String(value ?? "")
    .replace(/_/g, " ")
    .trim();
}

function buildProfessionHeadline(careerInference: any): string {
  const workType = normalizeWorkTypeLabel(careerInference?.workType);
  const roleStyle = normalizeRoleStyleLabel(careerInference?.roleStyle);

  if (workType && roleStyle) {
    return `You are most likely working in ${workType}, with a ${roleStyle} role in a structured, organization-led environment.`;
  }

  if (workType) {
    return `You are most likely working in ${workType} within a structured, responsibility-led environment.`;
  }

  if (roleStyle) {
    return `You are most likely in a ${roleStyle} type of role within structured work.`;
  }

  return "Your profession is showing as structured, responsibility-based work rather than a highly fluid or undefined path.";
}

function buildProfessionSupportLine(careerInference: any): string {
  const modeHint = formatCareerLabel(careerInference?.modeHint);

  if (modeHint === "employment" || modeHint === "institution_led" || modeHint === "institution led") {
    return "This typically involves handling processes, managing responsibilities, or supporting decision-making within a structured organization rather than working in a fully independent way.";
  }

  if (modeHint === "mixed") {
    return "This looks like structured work with a mix of process ownership, responsibility, and some advisory or managerial weight.";
  }

  if (modeHint === "independent") {
    return "This looks more self-directed, ownership-led, or independently driven than purely institution-bound work.";
  }

  return "This typically involves responsibility, process management, or structured decision support rather than highly unstructured work.";
}

function buildDirectProfessionAnswer(careerInference: any): string {
  const headline = buildProfessionHeadline(careerInference);
  const support = buildProfessionSupportLine(careerInference);

  return `${headline} ${support}`;
}
function formatReasonText(reason: string) {
  return String(reason || "")
    .replace(/\s+/g, " ")
    .replace(/\bmd\b/gi, "Mahadasha")
    .replace(/\bad\b/gi, "Antardasha")
    .replace(/\bpd\b/gi, "Pratyantar Dasha")
    .replace(/\bvenus\b/gi, "Venus")
    .replace(/\bmars\b/gi, "Mars")
    .replace(/\bsun\b/gi, "Sun")
    .replace(/\bmoon\b/gi, "Moon")
    .replace(/\bmercury\b/gi, "Mercury")
    .replace(/\bjupiter\b/gi, "Jupiter")
    .replace(/\bsaturn\b/gi, "Saturn")
    .replace(/\brahu\b/gi, "Rahu")
    .replace(/\bketu\b/gi, "Ketu")
    .replace(/\. (?=[a-z])/g, ". ")
    .trim()
    .replace(/([^.!?])$/, "$1.");
}
function getPlanetHouse(report: any, planet: string): number | null {
  const planets = Array.isArray(report?.planets) ? report.planets : [];
  const p = planets.find(
    (x: any) => String(x?.name ?? "").toLowerCase() === planet.toLowerCase()
  );

  const house = Number(p?.house);
  return Number.isFinite(house) ? house : null;
}

function hasPlanet(report: any, planet: string): boolean {
  const planets = Array.isArray(report?.planets) ? report.planets : [];
  return planets.some(
    (x: any) => String(x?.name ?? "").toLowerCase() === planet.toLowerCase()
  );
}
function buildTypeProfileAnswer(
  topic: AskSarathiDomain,
  question: string,
  report: any
) {
  const venusHouse = getPlanetHouse(report, "Venus");
  const marsHouse = getPlanetHouse(report, "Mars");
  const saturnHouse = getPlanetHouse(report, "Saturn");
  const jupiterHouse = getPlanetHouse(report, "Jupiter");
  const mercuryHouse = getPlanetHouse(report, "Mercury");
  const moonHouse = getPlanetHouse(report, "Moon");

  if (topic === "vehicle") {
    const premium = hasPlanet(report, "Venus");
    const performance = hasPlanet(report, "Mars");

    if (premium && performance) {
      return "Your chart leans toward a premium but performance-oriented vehicle. You may prefer something refined, comfortable, and status-conscious, but not dull — a car with presence, strong drive quality, and a slightly sporty feel.";
    }

    if (premium) {
      return "Your chart leans toward a comfortable, refined, and premium vehicle. Smoothness, aesthetics, interior quality, and brand feel may matter more than raw speed.";
    }

    if (performance) {
      return "Your chart leans toward a sporty or performance-focused vehicle. Power, control, handling, and driving feel may matter more than pure comfort.";
    }

    return "Your chart leans toward a practical and reliable vehicle, chosen more for usefulness, comfort, and long-term value than flash.";
  }

  if (topic === "career") {
    if (mercuryHouse || jupiterHouse) {
      return "Your chart supports structured advisory, finance, analysis, management, or decision-heavy work. You are better suited to roles where judgment, systems, responsibility, and experience matter.";
    }

    if (saturnHouse) {
      return "Your career pattern suits disciplined, stable, institution-linked work. You may do better in structured environments where patience, responsibility, and long-term credibility matter.";
    }

    return "Your chart favors practical, responsibility-oriented work rather than unstable or purely experimental roles.";
  }

  if (topic === "relationships" || topic === "marriage") {
    if (saturnHouse && venusHouse) {
      return "Your chart suggests attraction toward someone mature, steady, responsible, and emotionally reliable. The relationship pattern favors loyalty and long-term stability over drama.";
    }

    if (jupiterHouse) {
      return "Your chart suggests attraction toward someone wise, supportive, principled, and growth-oriented. Emotional maturity and shared values matter strongly.";
    }

    return "Your chart favors a partner who is steady, practical, emotionally clear, and supportive rather than overly dramatic or inconsistent.";
  }

  if (topic === "property") {
    if (moonHouse || venusHouse) {
      return "Your chart suggests preference for a comfortable, peaceful, and emotionally secure home. You may care about the feeling of the space, family comfort, and overall harmony.";
    }

    if (marsHouse) {
      return "Your chart may favor property with practical strength — good structure, usable space, and long-term asset value.";
    }

    return "Your chart favors a practical, stable, and long-term usable home rather than something chosen only for status.";
  }

  if (topic === "money") {
    if (jupiterHouse || mercuryHouse) {
      return "Your financial pattern favors structured growth through knowledge, advisory ability, finance, analysis, negotiation, and steady accumulation.";
    }

    if (venusHouse) {
      return "Your money pattern can improve through comfort, lifestyle, relationships, client-facing value, or refined skills.";
    }

    return "Your money pattern favors discipline, steady saving, and practical decision-making over risky speculation.";
  }

  if (topic === "health") {
    if (moonHouse || saturnHouse) {
      return "Your chart suggests health sensitivity may show through stress, sleep, emotional load, fatigue, or routine imbalance. Consistency and recovery rhythm matter strongly.";
    }

    if (marsHouse) {
      return "Your chart suggests inflammation, heat, strain, impatience, or overexertion may need attention. Physical activity helps, but balance matters.";
    }

    return "Your health pattern favors preventive routine, sleep discipline, stress management, and steady lifestyle correction.";
  }

  return "This area of your chart looks practical and gradual. The pattern favors steady development, clearer choices, and long-term stability over sudden dramatic outcomes.";
}
function buildVehicleProfileAnswer(report: any) {
  const planets = Array.isArray(report?.planets)
    ? report.planets
    : [];

  const text = JSON.stringify(planets).toLowerCase();

  let profile = "practical and comfort-oriented";
  let details =
    "Your chart leans more toward a balanced, reliable, and comfortable vehicle rather than something extremely flashy or aggressive.";

  if (/venus/.test(text) && /mars/.test(text)) {
    profile = "premium yet performance-oriented";
    details =
      "Your chart shows a mix of comfort, aesthetics, and driving excitement. You may prefer a vehicle that feels refined and premium but still has strong performance or sporty character.";
  } else if (/venus/.test(text)) {
    profile = "comfortable and premium";
    details =
      "The chart leans toward comfort, smooth driving experience, aesthetics, and overall refinement over raw performance.";
  } else if (/mars/.test(text)) {
    profile = "sporty and performance-driven";
    details =
      "The chart shows stronger Mars influence around vehicles, which usually brings preference toward speed, control, performance, or a more aggressive driving feel.";
  } else if (/saturn/.test(text)) {
    profile = "practical, durable, and long-term focused";
    details =
      "The chart appears more practical than luxury-oriented here. Reliability, long-term value, maintenance, and durability are likely to matter more than status.";
  }

  return `Your chart suggests you are more likely to choose a ${profile} vehicle. ${details}`;
}

function cleanContradictoryFallbackText(answer: string): string {
  return answer
    .replace(/No clear future timing window is visible from the current scan\.?\s*/gi, "")
    .replace(/The current scan does not show a clear timing verdict yet\.?\s*/gi, "")
    .replace(/The chart does not show an immediate final event yet, but.*?\.\s*/gi, "")
    .replace(/There are some signs of career movement, but not a clean promotion or job-change signal yet\.?\s*/gi, "")
    .replace(/This means there(?:'|’)s no strong.*?\.\s*/gi, "")
    .replace(/This means there is no strong.*?\.\s*/gi, "")
    .replace(/This means there isn(?:'|’)t a strong.*?\.\s*/gi, "")
    .replace(/This means there is not a strong.*?\.\s*/gi, "")
    .replace(/There(?:'|’)s no strong.*?\.\s*/gi, "")
    .replace(/There is no strong.*?\.\s*/gi, "")
    .replace(/A car purchase is not showing as an immediate event yet.*?\.\s*/gi, "")
    .replace(/formal title or salary elevation is not fully activated\.?\s*/gi, "")
    .replace(/The strongest structural window for a real promotion is late 2029.*?\.\s*/gi, "")
    .replace(/actual closure or ownership is likely to remain out of reach for now\.?\s*/gi, "")
    .replace(/but the actual decision or transaction is not locked in by timing right now\.?\s*/gi, "")
    .replace(/Right now, you(?:'|’)re probably seeing slow improvement in cash flow.*?\.\s*/gi, "")
    .replace(/if anything, small gains may come through side work or careful negotiation.*?\.\s*/gi, "")
    .replace(/nothing points to a decisive shift or physical move yet\.?\s*/gi, "")
    .replace(/This means you may notice background changes.*?\.\s*/gi, "")
    .replace(/There(?:'|’)s movement in this area, but nothing points to a reliable or decisive .*?ahead.*?\.\s*/gi, "")
    .replace(/signals are too mixed.*?\.\s*/gi, "")
    .replace(/This means your salary is unlikely to see a sharp or guaranteed increase.*?\.\s*/gi, "")
    .replace(/If you(?:'|’)re waiting for a one-time bonus or lump sum, it(?:'|’)s more likely to be delayed.*?\.\s*/gi, "")
    .replace(/Right now, the signals for moving abroad are mixed.*?\.\s*/gi, "")
    .replace(/there isn(?:'|’)t a strong enough pattern to point to a definite period.*?\.\s*/gi, "")
    .replace(/You might notice that connections feel slow to develop.*?\.\s*/gi, "")
    .replace(/Stay open and present, but don’t push for commitment.*?\.\s*/gi, "")
    .replace(/there isn(?:'|’)t a strong enough signal for a decisive relocation abroad yet.*?\.\s*/gi, "")
    .replace(/this means you(?:'|’)re likely experiencing a sense of transition.*?\.\s*/gi, "")
    .replace(/The underlying support is mixed, so you could find yourself exploring options, but\s*/gi, "")
    .replace(/The signals for actually buying your own house are too mixed and weak right now.*?\.\s*/gi, "")
    .replace(/This looks more like a phase for research, shortlisting, or exploring options rather than making a final purchase.*?\.\s*/gi, "")
    .replace(/if you(?:'|’)re already searching or negotiating, expect the process to stretch out or stall before anything is finalized\.?\s*/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function applyThemeTimelinePolish(
  answer: string,
  topic: AskSarathiDomain,
  astroBundle: GenericAstroBundle,
  eventType?: AskSarathiEventType
) {
  const signal = astroBundle.themeSignal;
  if (!signal) return answer;

  const major = astroBundle.majorWindows?.[0] ?? astroBundle.astroTimeline?.[0];
  const nearTerms = astroBundle.nearTermWindows ?? [];
  const triggers = astroBundle.triggerWindows ?? [];

  if (major) {
    const reason = major.reason
      ? ` This window is being picked because ${formatReasonText(major.reason)}`
      : "";

    const movementMeaning = getMovementMeaning(topic, eventType);
    const majorLabel = formatWindowLabel(major.label);
    const smartLabel = getEventLabel(topic, eventType);

    const nearTermLine = nearTerms.length
      ? ` ${getNearTermActivityLabel(topic, eventType)} is visible around ${formatWindowRangeFromLabels(
          nearTerms.slice(0, 3).map((w) => w.label)
        )}. These periods can bring ${movementMeaning}. The larger structural window shows the bigger cycle, while the near-term window shows practical movement.`
      : "";

    const triggerLine =
      !nearTerms.length && triggers.length
        ? ` Before the larger window, the chart shows activation periods around ${formatWindowRangeFromLabels(
            triggers.slice(0, 3).map((w) => w.label)
          )}. These periods can bring ${movementMeaning}; they should not be treated as final outcome windows.`
        : "";

    const cleanedAnswer = cleanContradictoryFallbackText(answer);

// Do not prepend raw timing narration for timing-window answers.
// Naturalize already explains the selected timing window cleanly.
if (
  topic === "career" ||
  astroBundle.selectedTimingWindow ||
  astroBundle.bestAvailableWindow
) {
  return cleanedAnswer || answer;
}

const replacement =
  `The major structural ${smartLabel} window appears around ${majorLabel}.${reason}${nearTermLine}${triggerLine}`;

return cleanedAnswer ? `${replacement}\n\n${cleanedAnswer}` : replacement;
  }

  return answer.replace(
    /No clear future timing window is visible from the current scan\.|The current scan does not show a clear timing verdict yet\./gi,
    `The chart does not show a sharp immediate event yet; the current signal is stronger for preparation and positioning.`
  );
}

async function ensureAstroContext({
  req,
  profile,
  incomingReport,
}: {
  req: Request;
  profile: any;
  incomingReport: any;
}) {
  let report = incomingReport ?? null;

  const hasProfile =
    !!profile?.dobISO &&
    !!profile?.tob &&
    !!profile?.place?.tz &&
    Number.isFinite(Number(profile?.place?.lat)) &&
    Number.isFinite(Number(profile?.place?.lon));

  const hasDashaTimeline =
    Array.isArray(report?.dashaTimeline) && report.dashaTimeline.length > 0;

  const hasPlanets =
    Array.isArray(report?.planets) && report.planets.length > 0;

  const needsRebuild = hasProfile && (!hasDashaTimeline || !hasPlanets);

  if (!needsRebuild) {
    return {
      report,
      source: report ? "incoming_or_cache" : "missing",
      rebuilt: false,
    };
  }

  try {
    const lifeReportURL = safeInternalURL(req, "/api/life-report");

    const lrRes = await fetch(lifeReportURL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: profile?.name ?? "User",
        birthDateISO: profile.dobISO,
        birthTime: profile.tob,
        birthTz: profile.place.tz,
        birthLat: profile.place.lat,
        birthLon: profile.place.lon,
      }),
    });

    if (!lrRes.ok) {
      return {
        report,
        source: "incoming_only_life_report_failed",
        rebuilt: false,
      };
    }

    const lrJson = await lrRes.json();

    const rebuiltReport =
      lrJson?.data && typeof lrJson.data === "object"
        ? lrJson.data
        : lrJson?.report && typeof lrJson.report === "object"
        ? lrJson.report
        : lrJson;

    return {
      report: rebuiltReport,
      source: "rebuilt_life_report",
      rebuilt: true,
    };
  } catch (e) {
    return {
      report,
      source: "incoming_only_exception",
      rebuilt: false,
    };
  }
}
function hasExplicitTopicKeyword(question: string): boolean {
  const q = question.toLowerCase();

  return TOPIC_RULES.some((rule) =>
    rule.keywords.some((kw) => q.includes(kw.toLowerCase()))
  );
}

function isVagueTimingFollowup(question: string): boolean {
  const q = question.toLowerCase().trim();
  const wordCount = q.split(/\s+/).filter(Boolean).length;

  return (
    wordCount <= 9 &&
    /\b(date|when|exact|exactly|window|period|timing|possible|give me)\b/.test(q) &&
    !hasExplicitTopicKeyword(q)
  );
}
/* --------------------------------------------------
   Main POST handler
-------------------------------------------------- */

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          locked: true,
          reason: "login_required",
          message: "Please sign in to ask Sārathi.",
        },
        { status: 401 }
      );
    }

    const entitlements = await getUserEntitlements(user.id);

    if (!entitlements.askSarathi.allowed) {
      return NextResponse.json(
        {
          ok: false,
          locked: true,
          reason: "ask_limit_reached",
          message:
  "You’ve used your complimentary Ask Sārathi question. Please upgrade to continue.",
          entitlements,
        },
        { status: 403 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as any;

    const question = safeStr(body?.question ?? body?.message);

    if (!question) {
      return badJson("No question provided", 400);
    }

    const rawProfile =
      body?.profile ??
      body?.birthProfile ??
      body?.birth ??
      null;

    const profile = normalizeProfile(rawProfile);
    const profileOk = hasValidProfile(profile);
    const resolvedProfile = profile;

    let report: LifeReportLike | any =
      body?.report ?? body?.reportData ?? null;

    if (
      report &&
      typeof report === "object" &&
      report.data &&
      typeof report.data === "object"
    ) {
      report = report.data;
    }

    const history = Array.isArray(body?.history) ? body.history : [];
    const conversationState = extractConversationState(history);
    const continuation = isFollowupContinuationQuestion(question);
    const vagueTimingFollowup = isVagueTimingFollowup(question);
    const detectedTopic = detectTopic(question);

const inferredFollowupTopic = inferFollowupTopic(
  question,
  history
);

const psychology = buildConversationPsychology(question, history);

const simpleGuidanceMode =
  psychology.surfaceIntent === "daily_guidance" &&
  !psychology.shouldUseFullAstrology;
const isStrongFollowup =
  psychology.shouldUsePreviousTopic ||
  /^(and|also|then|so|what about|when|why|how|how about|what if)\b/i.test(question.trim()) ||
  /\b(that|this|same|signal|window|period|timing|above|previous)\b/i.test(question.toLowerCase());

let topic: AskSarathiDomain =
  (vagueTimingFollowup || isStrongFollowup || continuation) &&
  conversationState.lastTopic
    ? conversationState.lastTopic
    : detectedTopic !== "generic"
    ? detectedTopic
    : inferredFollowupTopic
    ? inferredFollowupTopic
    : "generic";

const questionType: AskSarathiQuestionType =
  continuation || vagueTimingFollowup ? "timing" : detectQuestionType(question);

let answerMode: AnswerMode =
  continuation || vagueTimingFollowup
    ? "CONTINUATION_TIMING"
    : detectAnswerMode(question, topic, questionType);

const isDayBriefing =
  questionType === "daily_outlook" ||
  questionType === "daily_micro";

if (isDayBriefing) {
  topic = "generic";
  answerMode = "DAILY_GUIDANCE";
}

if (psychology.userNeed === "decision") {
  answerMode = "DECISION_FIRST";
}

const distressed = detectDistress(question);

const timeDirection = isDayBriefing
  ? "present"
  : continuation || vagueTimingFollowup
  ? "future"
  : detectTimeDirection(question, topic);

const eventType: AskSarathiEventType =
  isDayBriefing
    ? "generic_event"
    : (vagueTimingFollowup || continuation) && conversationState.lastEventType
    ? conversationState.lastEventType
    : detectEventType(question, topic, timeDirection);

const careerEventType: CareerEventType | undefined =
  (vagueTimingFollowup || continuation) &&
  conversationState.lastCareerEventType
    ? conversationState.lastCareerEventType
    : topic === "career"
    ? detectCareerEventType(question, topic, timeDirection)
    : undefined;
const hasHistoricalDashaTimeline =
  (Array.isArray(report?.dashaTimeline) && report.dashaTimeline.length > 0) ||
  (Array.isArray(report?.timeline) && report.timeline.length > 0);

const reportHasTiming =
  !!report?.activePeriods ||
  hasHistoricalDashaTimeline ||
  (Array.isArray(report?.transitWindows) && report.transitWindows.length > 0) ||
  (Array.isArray(report?.topTransits) && report.topTransits.length > 0);

const reportMatchesProfile = sameBirth(profile, report);

// force rebuild for past questions if historical timeline is missing
const needsPastHistory = timeDirection === "past" && !hasHistoricalDashaTimeline;

let sarathiContext: any = null;

if (
  profileOk &&
  resolvedProfile?.place?.tz &&
  resolvedProfile?.place?.lat != null &&
  resolvedProfile?.place?.lon != null
) {
  sarathiContext = await buildSarathiChatContext({
    birth: {
      name: resolvedProfile?.name ?? "User",
      dateISO: resolvedProfile?.dobISO ?? "",
      time: resolvedProfile?.tob ?? "",
      timezone: resolvedProfile.place.tz,
      lat: Number(resolvedProfile.place.lat),
      lon: Number(resolvedProfile.place.lon),
    },
    selectedDateISO:
      body?.selectedDateISO ||
      body?.dateISO ||
      new Date().toISOString().slice(0, 10),
  });

  report = sarathiContext.chart;
  
}

 const eventScale = detectEventScale(question, topic);

    // optional chart foundation, but no domain-specific reading builders
    const enrichedReport = {
  ...(report ?? {}),
  chartContext: sarathiContext?.chart ?? report ?? null,

  // Do not send full dataEngine to naturalize yet.
  // It contains DateTime objects and heavy raw structures.
  dataEngine: null,
};
    const interactionIntent = detectInteractionIntent(
  question,
  questionType,
  topic
);
if (/\b(promoted|promotion|promote|get promoted)\b/i.test(question)) {
  topic = "career";
}

const astroBundle = buildGenericAstroBundle(
  question,
  topic,
  questionType,
  answerMode,
  enrichedReport,
  careerEventType
);
astroBundle.conversationPsychology = psychology;
if (
  questionType === "daily_outlook" ||
  questionType === "daily_micro" ||
  psychology.surfaceIntent === "daily_guidance"
) {
  astroBundle.dailyAstroContext =
  await buildDailyAstroContext(
    question,
    enrichedReport,
    profile
  );
}

astroBundle.astroJudgement = buildUniversalAstroJudgement(
  topic,
  questionType,
  answerMode,
  astroBundle
);
const judgement = buildJudgementLayer(
  topic,
  questionType,
  astroBundle
);

if (judgement) {
  astroBundle.verdict = judgement.verdict;
  astroBundle.humanReason = judgement.humanReason;
  astroBundle.astroReason = judgement.astroReason;
}
try {
  
  astroBundle.pastActivationProfile =
    buildPastActivationProfile(enrichedReport, profile);


  astroBundle.evidenceNarrative =
    buildEvidenceNarrative(astroBundle);

 
  astroBundle.astroReasonMap =
    buildAstroReasonMap(astroBundle);

 
  astroBundle.astroInterpretationPacket =
    buildAstroInterpretationPacket(astroBundle);
   astroBundle.evidenceBullets = [
  ...(astroBundle.evidenceBullets ?? []),

  [astroBundle.currentDasha?.md, astroBundle.currentDasha?.ad, astroBundle.currentDasha?.pd]
  .filter(Boolean)
  .length
  ? `Current dasha chain: ${[
      astroBundle.currentDasha?.md,
      astroBundle.currentDasha?.ad,
      astroBundle.currentDasha?.pd,
    ]
      .filter(Boolean)
      .join("–")}`
  : "",

  astroBundle.timingPolicy?.note
    ? `Timing policy: ${astroBundle.timingPolicy.note}`
    : "",

  astroBundle.divisionalLayer?.summary
    ? `Divisional support: ${astroBundle.divisionalLayer.summary}`
    : "",

  astroBundle.karakaLayer?.summary
    ? `Karaka support: ${astroBundle.karakaLayer.summary}`
    : "",

  astroBundle.promiseLayer?.summary
    ? `Promise layer: ${astroBundle.promiseLayer.summary}`
    : "",

  astroBundle.careerInference?.summaryLine
    ? `Career inference: ${astroBundle.careerInference.summaryLine}`
    : "",

  astroBundle.majorWindows?.length
    ? `Major windows: ${astroBundle.majorWindows
        .slice(0, 3)
        .map((w: any) => w.label)
        .join(", ")}`
    : "",

  astroBundle.triggerWindows?.length
    ? `Trigger windows: ${astroBundle.triggerWindows
        .slice(0, 3)
        .map((w: any) => w.label)
        .join(", ")}`
    : "",
].filter(Boolean);
} catch (e) {
  

  return okJson({
    answer:
      "Debug: astro-chat failed while building the post-analysis bundle. Check server console for [POST BUNDLE STEP FAILED].",
    debug: true,
  });
}
 
       const isProfessionQuestion =
  astroBundle.careerEventType === "profession_identity";

if (
  astroBundle.careerEventType === "profession_identity" &&
  astroBundle.careerInference
) {
  const answer = buildDirectProfessionAnswer(astroBundle.careerInference);
 
  return okJson({
    answer,
    evidenceBullets: astroBundle.evidenceBullets,
    themeSignal: astroBundle.themeSignal,
    distressed,
    copy: {
      answer,
      long: answer,
    },
    core: {
      prose: {
        short: answer,
        full: answer,
      },
      timing: {
        summary: "Profession answer uses career inference directly.",
        windows: [],
      },
      verdict: {
        line: astroBundle.careerInference.summaryLine ?? answer,
      },
      meta: {
        topic,
        questionType,
        confidence: astroBundle.confidence,
      },
    },
       debug: {
      topic,
      questionType,
      timeDirection: astroBundle.timeDirection,
      eventScale: astroBundle.eventScale,
      isProfessionQuestion,
      focusHouses: astroBundle.focusHouses,
      karakas: astroBundle.karakas,
      divisionalCharts: astroBundle.divisionalCharts,
      reportBirth: report?.birth ?? null,
      reportName: report?.birth?.name ?? report?.name ?? null,
      careerInference: astroBundle.careerInference ?? null,
      activeDasha: astroBundle.currentDasha ?? null,
      topTransits: Array.isArray(report?.topTransits)
        ? report.topTransits.slice(0, 3).map((x: any) => ({
            title: x?.title ?? x?.driver ?? x?.target ?? null,
            category: x?.category ?? x?.focusArea ?? null,
          }))
        : [],
    },
  });
}

const finalDecision = buildFinalAnswerDecision({
  topic,
  questionType,
  timeDirection,
  careerEventType: astroBundle.careerEventType,
  windows: astroBundle.timingWindows,
  timingLayer: astroBundle.timingLayer,
  timingPolicy: astroBundle.timingPolicy,
  confidence: astroBundle.confidence,
});

       const natPayload = buildNaturalizePayload({
      question,
      topic,
      questionType,
      report: enrichedReport,
      astroBundle,
      distressed,
      simpleGuidanceMode,
      finalDecisionLine: finalDecision.line,
      finalDecisionVerdict: finalDecision.verdict,
    });
    
    const safeNatPayload = {
  userQuestion: natPayload?.userQuestion ?? question,
  topic: natPayload?.topic ?? topic,
  questionType: natPayload?.questionType ?? questionType,
  conversationContinuationSummary:
    conversationState?.lastAnswerSummary ?? null,
  tone: natPayload?.tone,
  depth: natPayload?.depth,
  interactionIntent: natPayload?.interactionIntent,
  confidenceLevel: natPayload?.confidenceLevel,
  formatTier: natPayload?.formatTier,
  formatRules: natPayload?.formatRules,
  distressed: natPayload?.distressed,
  moodHint: natPayload?.moodHint,
  simpleGuidanceMode: natPayload?.simpleGuidanceMode,
  conversionDiagnosisV2: astroBundle?.conversionDiagnosisV2 ?? null,
  astroFacts: natPayload?.astroFacts ?? astroBundle,
  nearestWindow: astroBundle?.nearestWindow ?? null,
strongestWindow: astroBundle?.strongestWindow ?? null,
rankedTimingWindows:
  astroBundle?.rankedTimingWindows ?? [],
  bestAvailableWindow:
  astroBundle?.bestAvailableWindow ?? null,
  astroJudgement: natPayload?.astroJudgement ?? astroBundle?.astroJudgement ?? null,
  dailyAstroContext:
    natPayload?.dailyAstroContext ??
    astroBundle?.dailyAstroContext ??
    null,

  evidenceBullets:
    natPayload?.evidenceBullets ??
    astroBundle?.evidenceBullets ??
    [],

  finalDecisionLine: natPayload?.finalDecisionLine,
  finalDecisionVerdict: natPayload?.finalDecisionVerdict,
  verdict: natPayload?.verdict,
  humanReason: natPayload?.humanReason,
  astroReason: natPayload?.astroReason,

  // explicitly block heavy objects
  report: null,
  chartContext: null,
  dataEngine: null,
  baseChartFactors: null,
};
    const naturalizeURL = safeInternalURL(req, "/api/naturalize");
    
    const naturalRes = await fetch(naturalizeURL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(safeNatPayload),
    });

    if (!naturalRes.ok) {
      const errText = await naturalRes.text();
      return okJson({
        answer:
          `⚠️ GPT call failed (naturalize ${naturalRes.status}).\n\n` +
          `Server said:\n${errText}`,
        evidenceBullets: astroBundle.evidenceBullets,
        distressed,
        debug: true,
      });
    }

        const naturalJson = await naturalRes.json();
    let answer =
      safeStr(naturalJson?.text ?? naturalJson?.answer ?? naturalJson?.output) ||
      astroBundle.answerSummary;
      const dailyMoodAnswer = buildDailyMoodAnswer(question);
if (
  questionType === "daily_outlook" &&
  /current scan does not show a clear timing verdict/i.test(answer)
) {
  answer = buildDailyMoodAnswer(question) || pickOne([
    "Today looks more mentally active than externally dramatic. It is a good day for handling practical responsibilities steadily rather than forcing major decisions.",
    "This looks like a steady but mentally active day. Focus on clearing pending tasks, organizing priorities, and avoiding unnecessary emotional pressure.",
  ]);
}
if (
  dailyMoodAnswer &&
  !astroBundle.dailyAstroContext &&
  (
    questionType === "daily_outlook" ||
    questionType === "emotional_support" ||
    questionType === "diagnosis"
  )
) {
  answer = dailyMoodAnswer;

  answer += pickOne([
    "\n\nFocus on pacing yourself steadily rather than forcing clarity too quickly.",

    "\n\nThis is better handled through calm structure and grounded routine than emotional overreaction.",

    "\n\nTry to keep the day simple, steady, and mentally uncluttered.",
  ]);
}
if (questionType === "type_profile") {
  answer = buildTypeProfileAnswer(topic, question, report);
}
if (questionType === "transit_analysis") {
  if (/jupiter/i.test(question)) {
    answer = pickOne([
      "This Jupiter transit appears to be working more gradually and internally rather than through immediate external breakthroughs. The chart is supporting perspective shifts, learning, and long-term growth more than sudden visible change right now.",
      "Jupiter’s current movement is expanding awareness and future possibilities slowly rather than creating instant external results. This is more of a preparation and alignment phase than a dramatic breakthrough period.",
      "The current Jupiter transit is helping build long-term direction, optimism, and gradual expansion. You may notice subtle improvements in thinking, opportunities, or planning before major outward movement becomes visible.",
    ]);
  } else if (/saturn/i.test(question)) {
    answer = pickOne([
      "This Saturn transit is emphasizing patience, restructuring, and long-term stability. Progress may feel slower externally because the chart is prioritizing sustainable growth over quick outcomes.",
      "Saturn’s current movement is asking for discipline, consistency, and emotional maturity. This phase tends to reward endurance more than aggressive pushing.",
      "The current Saturn transit is helping restructure priorities, responsibilities, and long-term direction. Although progress may feel heavy, the chart is building stronger foundations underneath.",
    ]);
  } else {
    answer = pickOne([
      "This transit appears to be working more through gradual energetic and psychological shifts than immediate external events.",
      "The current transit pattern is influencing mindset, direction, and inner readiness more than producing a sharp external event right now.",
    ]);
  }
}
if (
  answerMode === "DIAGNOSTIC_FIRST" &&
  (
    answer.trim().length < 120 ||
    /what.?s actually happening is\s*$/i.test(answer) ||
    /because\s*$/i.test(answer)
  )
) {
  if (isLifeOverviewQuestion(question)) {
    answer = buildLifeOverviewAnswer(astroBundle, enrichedReport);
  } else {
    answer = buildHolisticDiagnosticAnswer(
      astroBundle,
      enrichedReport,
      eventType
    );
  }
}
if (
  answerMode === "DIAGNOSTIC_FIRST" &&
  (answer.trim().length < 120 || /what.?s actually happening is\s*$/i.test(answer))
) {
  answer =
    astroBundle.diagnosticProfile
      ? buildHolisticDiagnosticAnswer(astroBundle, enrichedReport, eventType)
      : `Diagnostic map\n\nThis area needs a deeper pattern reading rather than a simple timing answer. The chart is pointing to blockers, strengths, and timing layers, but the diagnostic profile did not generate cleanly for this question.`;
}
if (
  answer.trim().length < 80 ||
  /because\s*$/i.test(answer.trim())
) {
  if (
    questionType === "emotional_support" ||
    questionType === "diagnosis" ||
    /\b(restless|anxious|worried|stressed|mentally|overthinking|confused|exhausted)\b/i.test(question)
  ) {
    answer = pickOne([
      "Your chart currently shows mental overstimulation and difficulty settling into clarity. This usually happens when the mind is carrying too many parallel concerns, expectations, or unresolved decisions at once. The best use of this phase is grounding, routine, and reducing inner pressure rather than constantly trying to solve everything mentally.",

      "This restlessness looks less like a single external problem and more like internal pressure building up. The chart is showing a need for grounding, emotional regulation, and simpler daily rhythm. Avoid overloading yourself with too many decisions at the same time.",

      "The mental restlessness is coming from scattered focus and inner pressure. This phase asks you to slow the mind down, create routine, reduce overstimulation, and give yourself clearer emotional space before making big decisions.",
    ]);
  } else {
    answer = astroBundle.answerSummary || "The current chart signals are mixed, so this is better read as a gradual phase rather than a sharply defined event.";
  }
}
       if (!/[.!?]$/.test(answer.trim())) {
      answer = astroBundle.answerSummary;
    }

  if (
  answerMode === "TIMING_FIRST" &&
  topic === "career" &&
  ["promotion", "job_change", "internal_shift", "stability_check"].includes(astroBundle.careerEventType)
) {
      answer = answer
        .replace(
          /A clear promotion or job-change window is not visible in your chart right now\./gi,
          "Current timing is stronger for visibility-building and responsibility expansion than immediate external elevation."
        )
        .replace(
          /This period looks more like steady work with gradual responsibility rather than a sharp rise in title or pay/gi,
          "This phase appears more focused on visibility building, reputation strengthening, and strategic positioning before the next major career elevation"
        );

    // Legacy career phase append removed.
// Naturalize now generates the conclusion.
    }
if (
  answerMode === "TIMING_FIRST" &&
  questionType !== "type_profile" &&
  questionType !== "comparison"
) {
  answer = applyThemeTimelinePolish(
    answer,
    topic,
    astroBundle,
    eventType
  );
}

    answer = answer
  .replace(/\. For example,/g, ".\n\nFor example,")
  .replace(/\. Best use this period/g, ".\n\nBest use this period")
  .replace(/\. Watch for/g, ".\n\nWatch for")
  .replace(/\. The chart is currently rewarding/g, ".\n\nThe chart is currently rewarding")
  .replace(/\. This does not look like a stagnant phase/g, ".\n\nThis does not look like a stagnant phase")
  .trim();
  await logQuestionUsage({
  userId: user.id,
  question,
  topic,
});
    return okJson({
      answer,
      evidenceBullets: astroBundle.evidenceBullets,
      distressed,
            phasePsychology: astroBundle.phasePsychology,
      strategy: astroBundle.strategy,
      remediesDetailed: astroBundle.remediesDetailed,
      hiddenOpportunity: astroBundle.hiddenOpportunity,
      themeSignal: astroBundle.themeSignal,
      copy: {
        answer,
        long: answer,
      },
      core: {
        prose: {
          short: answer,
          full: answer,
        },
                  timing: {
  summary:
    questionType === "transit_analysis"
      ? "This transit is working more through gradual energetic and psychological shifts than sharply timed external events."
      : astroBundle.timeDirection === "past"
      ? astroBundle.timingWindows[0]?.label
        ? `Past timing focus: ${astroBundle.timingWindows[0].label}`
        : "Past timing is being judged from historical dasha activation, relevant houses, karakas, and divisional support rather than current transits."
      : astroBundle.timeDirection === "present"
      ? astroBundle.timingWindows[0]?.label
        ? `Current timing focus: ${astroBundle.timingWindows[0].label}`
        : astroBundle.timingLayer.summary
      : astroBundle.timeDirection === "future"
      ? isCareerMovementQuestion(question, topic)
        ? finalDecision.line
        : astroBundle.timingWindows[0]?.label
        ? astroBundle.timingPolicy?.allowSharpWindow
          ? `Future timing focus: ${astroBundle.timingWindows[0].label}`
          : "This is a broader phase building over the coming weeks or months, not a sharply timed event window."
        : astroBundle.timingLayer.summary
      : astroBundle.timingLayer.summary || "No clear timing pattern is active right now.",
  windows: astroBundle.timingWindows,
},
        verdict: {
          line: astroBundle.answerSummary,
        },
        meta: {
          topic,
          questionType,
          confidence: astroBundle.confidence,
        },
        themeSignal: astroBundle.themeSignal,
      },
        debug: {
        topic,
        questionType,
        timeDirection: astroBundle.timeDirection,
        eventScale: astroBundle.eventScale,
        isProfessionQuestion,
        focusHouses: astroBundle.focusHouses,
        karakas: astroBundle.karakas,
        divisionalCharts: astroBundle.divisionalCharts,
        reportBirth: report?.birth ?? null,
reportName: report?.birth?.name ?? report?.name ?? null,
careerInference: astroBundle.careerInference ?? null,
activeDasha: astroBundle.currentDasha ?? null,
topTransits: Array.isArray(report?.topTransits)
  ? report.topTransits.slice(0, 3).map((x: any) => ({
      title: x?.title ?? x?.driver ?? x?.target ?? null,
      category: x?.category ?? x?.focusArea ?? null,
    }))
  : [],
      },
    });
  } catch (e: any) {
    return badJson(String(e?.message || e || "Unknown astro-chat error"), 500);
  }
}
