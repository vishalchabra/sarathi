export const runtime = "nodejs";

import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserEntitlements } from "@/server/auth/getUserEntitlements";
import { logQuestionUsage } from "@/server/access/logQuestionUsage";
import { inferCareer } from "@/server/astro/inference/career";
import { buildPanchangData } from "@/server/dataEngine/buildPanchangData";
import { buildSarathiChatContext } from "@/server/astro-chat/buildSarathiChatContext";
import {
  buildSixPillarExplainabilityProfile,
  type SixPillarExplainabilityProfile,
} from "@/server/astro-chat/explainabilityEngine";
import { buildStructuredEvidence } from "@/server/astro-chat/evidenceFormatter";
import { buildSeniorAstrologerResponse } from "@/server/astro-chat/seniorAstrologerResponse";
import { buildCanonicalChartContext, type CanonicalChartContext } from "@/server/astro-chat/chartContext";
import { buildAstroDecision, type AstroDecision } from "@/server/astro-chat/decisionEngine";
import { tryRunAstroChatV2 } from "@/server/astro-chat-v2/orchestrator";
import {
  buildChartFacts,
} from "@/server/astrology-intelligence/chart/buildChartFacts";

import {
  buildAstrologyIntelligenceEngine,
} from "@/server/astrology-intelligence/buildAstrologyIntelligenceEngine";
import {
  buildBusinessIntelligenceSummary,
} from "@/server/astrology-intelligence/presenters/buildBusinessIntelligenceSummary";
import {
  buildDomainIntelligenceContext,
} from "@/server/astrology-intelligence/presenters/buildDomainIntelligenceContext";
import {
  buildUserContext,
} from "@/server/astro-chat/buildUserContext";
import {
  buildDecisionSummary,
  type DecisionSummary,
} from "@/server/sarathi/decisionEngine";
import {
  buildEventLifecycle,
  type EventLifecycle,
} from "@/server/sarathi/eventLifecycle";
import { timingForTopic } from "@/server/timing/engine";
import { fetchDashaSpans } from "@/server/qa/dasha";
import {
  buildTimingHierarchy,
} from "@/server/sarathi/timingHierarchy";
import {
  buildPlanetReasoning,
} from "@/server/sarathi/planetReasoning";
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

scoreBreakdown?: {
  baseScore: number;
  natalPromise: number;
  sambandhaSupport: number;
  divisionalSupport: number;
  dashaSupport: number;
  transitSupport: number;
  karakaSupport: number;
  eventSupport: number;
  confidenceBonus: number;
  penalties: number;
};
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
  canonicalChartContext?: CanonicalChartContext;
  decision?: AstroDecision;
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
  sambandhaAnalysis: SambandhaAnalysis;
  explainabilityProfile?: SixPillarExplainabilityProfile;
  divisionalLayer: AnalysisLayer;
  divisionalBreakdown?: {
    chart: string;
    strength: AnalysisLayer["verdict"];
    weight: number;
  }[];
  divisionalAnalysis?: DivisionalAnalysis;
  astrologyEvidencePacket?: AstrologyEvidencePacket;
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
  type RelationshipEventType =
  | "relationship_suitability"
  | "partner_profile"
  | "relationship_pattern"
  | "love_vs_arranged"
  | "new_relationship"
  | "meeting_partner"
  | "reconciliation"
  | "marriage_commitment"
  | "marriage_timing"
  | "generic";
  type WealthEventType =
  | "wealth_potential"
  | "earning_style"
  | "wealth_pattern"
  | "saving_capacity"
  | "investment_suitability"
  | "multiple_income"
  | "salary_increase"
  | "bonus"
  | "side_income"
  | "financial_improvement"
  | "wealth_timing"
  | "generic";
  type BusinessEventType =
  | "business_suitability"
  | "business_style"
  | "business_vs_job"
  | "partnership_suitability"
  | "entrepreneurial_pattern"
  | "business_launch"
  | "business_growth"
  | "client_growth"
  | "partnership_timing"
  | "business_timing"
  | "generic";
type EducationEventType =
  | "education_suitability"
  | "subject_fit"
  | "stream_choice"
  | "higher_education"
  | "study_pattern"
  | "exam_performance"
  | "education_timing"
  | "generic";

type SpiritualEventType =
  | "spiritual_inclination"
  | "spiritual_path"
  | "devotional_style"
  | "meditation_suitability"
  | "mantra_suitability"
  | "guru_pattern"
  | "spiritual_growth"
  | "spiritual_timing"
  | "generic";

type HealthEventType =
  | "health_constitution"
  | "health_sensitivity"
  | "stress_pattern"
  | "recovery_capacity"
  | "lifestyle_pattern"
  | "health_recovery"
  | "health_checkup"
  | "health_timing"
  | "generic";
type ChildrenEventType =
  | "parenthood_potential"
  | "parenting_style"
  | "child_relationship_pattern"
  | "child_aptitude"
  | "conception_timing"
  | "childbirth_timing"
  | "child_development_timing"
  | "generic";
type PropertyEventType =
  | "property_potential"
  | "property_investment_suitability"
  | "property_pattern"
  | "home_stability"
  | "buy_property"
  | "sell_property"
  | "move_home"
  | "property_timing"
  | "generic";
type VehicleEventType =
  | "vehicle_potential"
  | "vehicle_preference"
  | "vehicle_pattern"
  | "buy_vehicle"
  | "upgrade_vehicle"
  | "vehicle_timing"
  | "generic";
type RelocationEventType =
  | "relocation_potential"
  | "foreign_settlement_potential"
  | "relocation_pattern"
  | "location_preference"
  | "foreign_move"
  | "local_move"
  | "relocation_timing"
  | "generic";
type DisputeEventType =
  | "conflict_pattern"
  | "legal_suitability"
  | "negotiation_style"
  | "litigation_pattern"
  | "dispute_resolution"
  | "legal_case_timing"
  | "settlement_timing"
  | "generic";
type ParentsEventType =
  | "parent_relationship_pattern"
  | "mother_relationship"
  | "father_relationship"
  | "parental_influence"
  | "family_elder_pattern"
  | "parent_support_timing"
  | "parent_responsibility_timing"
  | "generic";
type SiblingsEventType =
  | "sibling_relationship_pattern"
  | "elder_sibling_pattern"
  | "younger_sibling_pattern"
  | "sibling_support"
  | "sibling_conflict_timing"
  | "sibling_support_timing"
  | "generic";
type TravelEventType =
  | "travel_inclination"
  | "foreign_travel_pattern"
  | "frequent_travel_pattern"
  | "pilgrimage_pattern"
  | "travel_timing"
  | "foreign_travel_timing"
  | "pilgrimage_timing"
  | "generic";
type ReputationEventType =
  | "reputation_potential"
  | "public_image_pattern"
  | "recognition_pattern"
  | "visibility_style"
  | "reputation_growth"
  | "recognition_timing"
  | "reputation_recovery"
  | "generic";
type DebtEventType =
  | "debt_pattern"
  | "borrowing_tendency"
  | "repayment_capacity"
  | "liability_pattern"
  | "debt_reduction"
  | "loan_timing"
  | "repayment_timing"
  | "generic";
type InheritanceEventType =
  | "inheritance_potential"
  | "ancestral_pattern"
  | "legacy_pattern"
  | "inheritance_conflict_pattern"
  | "inheritance_timing"
  | "inheritance_settlement"
  | "legacy_transfer_timing"
  | "generic";
type MentalHealthEventType =
  | "mental_emotional_pattern"
  | "overthinking_pattern"
  | "mood_sensitivity"
  | "stress_resilience"
  | "emotional_regulation_pattern"
  | "mental_health_recovery"
  | "mental_health_timing"
  | "support_timing"
  | "generic";
type PetsEventType =
  | "pet_relationship_pattern"
  | "pet_caregiving_style"
  | "pet_responsibility_pattern"
  | "generic";

type InnerEventType =
  | "life_direction_pattern"
  | "purpose_pattern"
  | "inner_conflict_pattern"
  | "self_understanding_pattern"
  | "meaning_pattern"
  | "generic";
type AskSarathiEventType =
  | CareerEventType
  | ParentsEventType
  | SiblingsEventType
  | TravelEventType
  | ReputationEventType
  | DebtEventType
  | InheritanceEventType
  | MentalHealthEventType
  | PetsEventType
  | InnerEventType
  // Property
  | "buy_property"
  | "sell_property"
  | "move_home"
  | "property_potential"
  | "property_investment_suitability"
  | "property_pattern"
  | "home_stability"
  | "property_timing"

  // Vehicle
  | "buy_vehicle"
  | "upgrade_vehicle"
  | "vehicle_potential"
  | "vehicle_preference"
  | "vehicle_pattern"
  | "vehicle_timing"

  // Wealth / Money
  | "salary_increase"
  | "bonus"
  | "side_income"
  | "wealth_potential"
  | "earning_style"
  | "wealth_pattern"
  | "saving_capacity"
  | "investment_suitability"
  | "multiple_income"
  | "financial_improvement"
  | "wealth_timing"

  // Business
  | "business_suitability"
  | "business_style"
  | "business_vs_job"
  | "partnership_suitability"
  | "entrepreneurial_pattern"
  | "business_launch"
  | "business_growth"
  | "client_growth"
  | "partnership_timing"
  | "business_timing"

  // Relationships / Marriage
  | "relationship_suitability"
  | "partner_profile"
  | "relationship_pattern"
  | "love_vs_arranged"
  | "new_relationship"
  | "meeting_partner"
  | "reconciliation"
  | "marriage_commitment"
  | "marriage_timing"

  // Education
  | "education_suitability"
  | "subject_fit"
  | "stream_choice"
  | "higher_education"
  | "study_pattern"
  | "exam_performance"
  | "education_timing"

  // Spirituality
  | "spiritual_inclination"
  | "spiritual_path"
  | "devotional_style"
  | "meditation_suitability"
  | "mantra_suitability"
  | "guru_pattern"
  | "spiritual_growth"
  | "spiritual_timing"

  // Health
  | "health_recovery"
  | "health_checkup"
  | "health_constitution"
  | "health_sensitivity"
  | "stress_pattern"
  | "recovery_capacity"
  | "lifestyle_pattern"
  | "health_timing"
  // Children
  | "parenthood_potential"
  | "parenting_style"
  | "child_relationship_pattern"
  | "child_aptitude"
  | "conception_timing"
  | "childbirth_timing"
  | "child_development_timing"
  // Relocation
  | "foreign_move"
  | "local_move"
  | "relocation_potential"
  | "foreign_settlement_potential"
  | "relocation_pattern"
  | "location_preference"
  | "relocation_timing"
  // Disputes
  | "conflict_pattern"
  | "legal_suitability"
  | "negotiation_style"
  | "litigation_pattern"
  | "dispute_resolution"
  | "legal_case_timing"
  | "settlement_timing"
  
  // Generic
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

type EvidenceImpact = "support" | "block" | "mixed" | "neutral";

type StructuredEvidenceItem = {
  source: string;
  factor: string;
  detail: string;
  impact: EvidenceImpact;
  weight: number;
};

type DivisionalPlanetEvidence = {
  planet: string;
  sign?: string | null;
  house?: number | null;
  dignity?: string | null;
  retrograde?: boolean;
  combust?: boolean;
  vargottama?: boolean;
  aspects: string[];
  lordships: number[];
  interpretation?: string | null;
};

type DivisionalHouseEvidence = {
  house: number;
  sign?: string | null;
  lord?: string | null;
  occupants: string[];
  aspects: string[];
  interpretation?: string | null;
};

type DivisionalChartEvidence = {
  chart: string;
  role: string;
  relevance: "primary" | "supporting" | "optional";
  available: boolean;
  weight: number;
  ascendant: {
    sign?: string | null;
    lord?: string | null;
    degree?: number | null;
  } | null;
  focusHouses: DivisionalHouseEvidence[];
  relevantPlanets: DivisionalPlanetEvidence[];
  yogas: string[];
  supports: string[];
  blockers: string[];
  contradictions: string[];
  rawSignals: string[];
  verdict: AnalysisLayer["verdict"];
};

type DivisionalAnalysis = {
  requiredCharts: string[];
  availableCharts: string[];
  missingCharts: string[];
  charts: DivisionalChartEvidence[];
  combinedVerdict: AnalysisLayer["verdict"];
  supports: string[];
  blockers: string[];
  contradictions: string[];
  completeness: "complete" | "partial" | "insufficient";
};

type ContradictionResolution = {
  natalPromise: AnalysisLayer["verdict"];
  divisionalConfirmation: AnalysisLayer["verdict"];
  dashaActivation: AnalysisLayer["verdict"];
  transitTrigger: AnalysisLayer["verdict"];
  dominantLayer: "natal" | "divisional" | "dasha" | "transit";
  resolvedMeaning: string;
};

type AstrologyEvidencePacket = {
  version: "sarathi-evidence-v1";
  topic: AskSarathiDomain;
  eventType?: AskSarathiEventType;
  questionType: AskSarathiQuestionType;
  natal: {
    promise: AnalysisLayer;
    focusHouses: number[];
    supportHouses: number[];
    karakas: string[];
    houseEvidence: string[];
    karakaEvidence: string[];
  };
  sambandha: {
    verdict: SambandhaAnalysis["verdict"];
    connectivityScore: number;
    dashaConnectivityScore: number;
    conversionScore: number;
    relationships: PlanetarySambandha[];
    missingRequiredLinks: string[];
  };
  divisionalAnalysis: DivisionalAnalysis;
  timing: {
    currentDasha: GenericAstroBundle["currentDasha"];
    dashaStrength: GenericAstroBundle["timingPolicy"]["dashaStrength"];
    transitStrength: GenericAstroBundle["timingPolicy"]["transitStrength"];
    timingLayer: AnalysisLayer;
    windows: RankedTimingWindow[];
    triggers: UniversalEventTrigger[];
  };
  support: StructuredEvidenceItem[];
  blockers: StructuredEvidenceItem[];
  contradictions: StructuredEvidenceItem[];
  contradictionResolution: ContradictionResolution;
  missingData: string[];
  completeness: {
    complete: boolean;
    errors: string[];
    warnings: string[];
  };
  synthesis: {
    promiseStrength: AnalysisLayer["verdict"];
    timingStrength: AnalysisLayer["verdict"];
    conversionStrength: AnalysisLayer["verdict"];
    dominantFactor: string;
    instruction: string;
  };
};

type DivisionalAnalysisLayer = AnalysisLayer & {
  chartBreakdown: DivisionalChartBreakdown[];
  analysis: DivisionalAnalysis;
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
  sambandhaReasons: string[];
  sambandhaVerdict: SambandhaAnalysis["verdict"];
  sambandhaScore: number;
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
type SambandhaType =
  | "conjunction"
  | "mutual_aspect"
  | "one_way_aspect"
  | "sign_exchange"
  | "same_dispositor"
  | "house_occupation"
  | "house_aspect"
  | "dasha_to_event_lord"
  | "dasha_to_karaka";

type SambandhaImpact =
  | "support"
  | "block"
  | "mixed"
  | "neutral";

type PlanetarySambandha = {
  id: string;

  planetA: string;
  planetB?: string | null;

  type: SambandhaType;

  reciprocal: boolean;
  direct: boolean;

  planetAHouse?: number | null;
  planetBHouse?: number | null;

  planetASign?: string | null;
  planetBSign?: string | null;

  orb?: number | null;

  relatedHouses: number[];

  score: number;
  impact: SambandhaImpact;

  reason: string;
};

type SambandhaAnalysis = {
  topic: AskSarathiDomain;
  eventType?: AskSarathiEventType;

  focusHouses: number[];
  supportHouses: number[];

  eventHouseLords: string[];
  supportHouseLords: string[];
  relevantKarakas: string[];
  activeDashaLords: string[];

  relationships: PlanetarySambandha[];

  supportiveLinks: PlanetarySambandha[];
  mixedLinks: PlanetarySambandha[];
  blockingLinks: PlanetarySambandha[];

  missingRequiredLinks: string[];

  connectivityScore: number;
  dashaConnectivityScore: number;
  conversionScore: number;

  verdict:
    | "strongly_connected"
    | "connected"
    | "partially_connected"
    | "disconnected"
    | "insufficient_data";

  summary: string;
  bullets: string[];
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
    keywords: [
  "inheritance",
  "legacy",
  "ancestral",
  "insurance settlement",
  "inherit",
  "inherited",
  "legal will",
  "last will",
  "family will",
  "testament",
],
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
const SIGN_LORDS: Record<string, string> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};
const PLANET_NAMES = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
] as const;
function getHouseFromLagnaSign(
  lagnaSign: string | null | undefined,
  transitSign: string | null | undefined
): number | null {
  const lagnaNum = SIGN_TO_NUM[String(lagnaSign ?? "").trim()];
  const transitNum = SIGN_TO_NUM[String(transitSign ?? "").trim()];

  if (!lagnaNum || !transitNum) return null;

  return ((transitNum - lagnaNum + 12) % 12) + 1;
}
type NormalizedNatalPlanet = {
  planet: string;
  sign: string | null;
  house: number | null;
  degree: number | null;
  nakshatra: string | null;
};

function normalizePlanetName(value: unknown): string | null {
  const raw = String(value ?? "").trim().toLowerCase();

  if (!raw) return null;

  const match = PLANET_NAMES.find(
    (planet) => planet.toLowerCase() === raw
  );

  return match ?? null;
}

function normalizeSignName(value: unknown): string | null {
  const raw = String(value ?? "").trim().toLowerCase();

  if (!raw) return null;

  const match = Object.keys(SIGN_TO_NUM).find(
    (sign) => sign.toLowerCase() === raw
  );

  return match ?? null;
}

function normalizeHouseNumber(value: unknown): number | null {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return null;
  if (parsed < 1 || parsed > 12) return null;

  return Math.trunc(parsed);
}

function normalizeDegree(value: unknown): number | null {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return null;

  /*
   * Accept either degree within sign or absolute longitude.
   */
  const normalized =
    parsed >= 30
      ? parsed % 30
      : parsed;

  if (normalized < 0 || normalized >= 30) {
    return null;
  }

  return normalized;
}

function getNatalPlanetsForSambandha(
  report: any
): NormalizedNatalPlanet[] {
  const candidates = [
    report?.natal?.planets,
    report?.planets,
    report?.chartContext?.planets,
    report?.birthChart?.planets,
    report?.baseChartFactors?.planets,
  ];

  const source =
    candidates.find(Array.isArray) ?? [];

  return source
    .map((row: any): NormalizedNatalPlanet | null => {
      const planet =
        normalizePlanetName(
          row?.planet ??
          row?.name ??
          row?.graha
        );

      if (!planet) return null;

      return {
        planet,
        sign: normalizeSignName(
          row?.sign ??
          row?.rashi ??
          row?.signName
        ),
        house: normalizeHouseNumber(
          row?.house ??
          row?.houseNumber ??
          row?.bhava
        ),
        degree: normalizeDegree(
          row?.degree ??
          row?.degreeInSign ??
          row?.longitude
        ),
        nakshatra:
          safeStr(
            row?.nakshatra ??
            row?.nakshatraName ??
            row?.star
          ) || null,
      };
    })
    .filter(
      (
        row: NormalizedNatalPlanet | null
      ): row is NormalizedNatalPlanet =>
        Boolean(row)
    );
}

function getLagnaSignForSambandha(
  report: any
): string | null {
  const canonicalLagna = buildCanonicalChartContext(report).lagnaSign;
  if (canonicalLagna) return canonicalLagna;

  const candidates = [
    report?.ascendant?.sign,
    report?.ascendantSign,
    report?.lagna?.sign,
    report?.lagnaSign,
    report?.natal?.ascendant?.sign,
    report?.natal?.ascendantSign,
    report?.birthChart?.ascendant?.sign,
    report?.birthChart?.lagna?.sign,
    report?.chartContext?.ascendant?.sign,
    report?.baseChartFactors?.ascendant?.sign,
    report?.baseChartFactors?.lagnaSign,
  ];

  for (const candidate of candidates) {
    const sign = normalizeSignName(candidate);

    if (sign) return sign;
  }

  return null;
}

function getSignForHouse(
  lagnaSign: string,
  house: number
): string | null {
  const lagnaNumber = SIGN_TO_NUM[lagnaSign];

  if (!lagnaNumber) return null;
  if (house < 1 || house > 12) return null;

  const targetSignNumber =
    ((lagnaNumber + house - 2) % 12) + 1;

  return (
    Object.entries(SIGN_TO_NUM).find(
      ([, number]) => number === targetSignNumber
    )?.[0] ?? null
  );
}

function getLordOfHouse(
  lagnaSign: string,
  house: number
): string | null {
  const sign = getSignForHouse(
    lagnaSign,
    house
  );

  return sign
    ? SIGN_LORDS[sign] ?? null
    : null;
}

function circularDegreeDistance(
  first: number | null,
  second: number | null
): number | null {
  if (
    first === null ||
    second === null
  ) {
    return null;
  }

  const direct = Math.abs(first - second);

  return Math.min(
    direct,
    30 - direct
  );
}

function houseDistance(
  fromHouse: number,
  toHouse: number
): number {
  return (
    ((toHouse - fromHouse + 12) % 12) + 1
  );
}

function getParashariAspectDistances(
  planet: string
): number[] {
  const distances = [7];

  if (planet === "Mars") {
    distances.push(4, 8);
  }

  if (planet === "Jupiter") {
    distances.push(5, 9);
  }

  if (planet === "Saturn") {
    distances.push(3, 10);
  }

  /*
   * Rahu/Ketu special aspects are deliberately excluded
   * from version one because traditions differ.
   */
  return distances;
}

function planetAspectsPlanet(
  from: NormalizedNatalPlanet,
  to: NormalizedNatalPlanet
): boolean {
  if (
    from.house === null ||
    to.house === null
  ) {
    return false;
  }

  const distance = houseDistance(
    from.house,
    to.house
  );

  return getParashariAspectDistances(
    from.planet
  ).includes(distance);
}

function uniqueStrings(
  values: Array<string | null | undefined>
): string[] {
  return Array.from(
    new Set(
      values.filter(
        (value): value is string =>
          Boolean(value)
      )
    )
  );
}

function makeSambandhaId(
  planetA: string,
  planetB: string,
  type: SambandhaType
): string {
  return [
    planetA,
    planetB,
    type,
  ]
    .sort()
    .join(":");
}

function buildPlanetPairSambandhas(
  first: NormalizedNatalPlanet,
  second: NormalizedNatalPlanet,
  eventPlanets: Set<string>,
  planetHouseRoles: Map<string, number[]>
): PlanetarySambandha[] {
  const relationships: PlanetarySambandha[] = [];

  const firstIsRelevant =
    eventPlanets.has(first.planet);

  const secondIsRelevant =
    eventPlanets.has(second.planet);

  if (
    !firstIsRelevant &&
    !secondIsRelevant
  ) {
    return relationships;
  }

  const relatedHouses = uniqueStrings([
    ...(planetHouseRoles.get(first.planet) ?? []).map(String),
    ...(planetHouseRoles.get(second.planet) ?? []).map(String),
  ]).map(Number);

  const bothRelevant =
    firstIsRelevant &&
    secondIsRelevant;

  const impact: SambandhaImpact =
    bothRelevant
      ? "support"
      : "mixed";

  if (
    first.sign &&
    second.sign &&
    first.sign === second.sign
  ) {
    const orb = circularDegreeDistance(
      first.degree,
      second.degree
    );

    let score = 7;

    if (orb !== null && orb <= 3) {
      score += 3;
    } else if (
      orb !== null &&
      orb <= 8
    ) {
      score += 2;
    } else if (
      orb !== null &&
      orb >= 20
    ) {
      score -= 1;
    }

    relationships.push({
      id: makeSambandhaId(
        first.planet,
        second.planet,
        "conjunction"
      ),
      planetA: first.planet,
      planetB: second.planet,
      type: "conjunction",
      reciprocal: true,
      direct: true,
      planetAHouse: first.house,
      planetBHouse: second.house,
      planetASign: first.sign,
      planetBSign: second.sign,
      orb,
      relatedHouses,
      score,
      impact,
      reason:
        orb !== null
          ? `${first.planet} and ${second.planet} are conjunct in ${first.sign} with approximately ${orb.toFixed(
              1
            )}° separation.`
          : `${first.planet} and ${second.planet} are conjunct in ${first.sign}.`,
    });
  }

  const firstAspectsSecond =
    planetAspectsPlanet(
      first,
      second
    );

  const secondAspectsFirst =
    planetAspectsPlanet(
      second,
      first
    );

  if (
    firstAspectsSecond &&
    secondAspectsFirst
  ) {
    relationships.push({
      id: makeSambandhaId(
        first.planet,
        second.planet,
        "mutual_aspect"
      ),
      planetA: first.planet,
      planetB: second.planet,
      type: "mutual_aspect",
      reciprocal: true,
      direct: true,
      planetAHouse: first.house,
      planetBHouse: second.house,
      planetASign: first.sign,
      planetBSign: second.sign,
      relatedHouses,
      score: 7,
      impact,
      reason: `${first.planet} and ${second.planet} mutually aspect one another.`,
    });
  } else if (
    firstAspectsSecond ||
    secondAspectsFirst
  ) {
    const from =
      firstAspectsSecond
        ? first
        : second;

    const to =
      firstAspectsSecond
        ? second
        : first;

    relationships.push({
      id: `${from.planet}:${to.planet}:one_way_aspect`,
      planetA: from.planet,
      planetB: to.planet,
      type: "one_way_aspect",
      reciprocal: false,
      direct: true,
      planetAHouse: from.house,
      planetBHouse: to.house,
      planetASign: from.sign,
      planetBSign: to.sign,
      relatedHouses,
      score: 4,
      impact,
      reason: `${from.planet} aspects ${to.planet}.`,
    });
  }

  const firstDispositor =
    first.sign
      ? SIGN_LORDS[first.sign]
      : null;

  const secondDispositor =
    second.sign
      ? SIGN_LORDS[second.sign]
      : null;

  if (
    firstDispositor &&
    secondDispositor &&
    firstDispositor === secondDispositor &&
    firstDispositor !== first.planet &&
    firstDispositor !== second.planet
  ) {
    relationships.push({
      id: makeSambandhaId(
        first.planet,
        second.planet,
        "same_dispositor"
      ),
      planetA: first.planet,
      planetB: second.planet,
      type: "same_dispositor",
      reciprocal: true,
      direct: false,
      planetAHouse: first.house,
      planetBHouse: second.house,
      planetASign: first.sign,
      planetBSign: second.sign,
      relatedHouses,
      score: 3,
      impact,
      reason: `${first.planet} and ${second.planet} are connected through their common dispositor ${firstDispositor}.`,
    });
  }

  if (
    firstDispositor === second.planet &&
    secondDispositor === first.planet
  ) {
    relationships.push({
      id: makeSambandhaId(
        first.planet,
        second.planet,
        "sign_exchange"
      ),
      planetA: first.planet,
      planetB: second.planet,
      type: "sign_exchange",
      reciprocal: true,
      direct: true,
      planetAHouse: first.house,
      planetBHouse: second.house,
      planetASign: first.sign,
      planetBSign: second.sign,
      relatedHouses,
      score: 9,
      impact,
      reason: `${first.planet} and ${second.planet} are in sign exchange, creating a strong reciprocal sambandha.`,
    });
  }

  return relationships;
}

function buildSambandhaAnalysis(params: {
  report: any;
  topic: AskSarathiDomain;
  eventType?: AskSarathiEventType;
  rule: TopicRule;
  activeDasha: {
    md?: string | null;
    ad?: string | null;
    pd?: string | null;
  };
}): SambandhaAnalysis {
  const {
    report,
    topic,
    eventType,
    rule,
    activeDasha,
  } = params;

  const planets =
    getNatalPlanetsForSambandha(report);

  const lagnaSign =
    getLagnaSignForSambandha(report);

  const focusHouses =
    uniqueStrings(
      (rule.houses ?? []).map(String)
    ).map(Number);

  const supportHouses =
    uniqueStrings(
      (rule.supportHouses ?? []).map(String)
    ).map(Number);

  if (
    !lagnaSign ||
    planets.length === 0
  ) {
    return {
      topic,
      eventType,
      focusHouses,
      supportHouses,
      eventHouseLords: [],
      supportHouseLords: [],
      relevantKarakas: rule.karakas,
      activeDashaLords: uniqueStrings([
        activeDasha.md,
        activeDasha.ad,
        activeDasha.pd,
      ]),
      relationships: [],
      supportiveLinks: [],
      mixedLinks: [],
      blockingLinks: [],
      missingRequiredLinks: [
        !lagnaSign
          ? "Ascendant sign is unavailable."
          : "",
        planets.length === 0
          ? "Natal planet placements are unavailable."
          : "",
      ].filter(Boolean),
      connectivityScore: 0,
      dashaConnectivityScore: 0,
      conversionScore: 0,
      verdict: "insufficient_data",
      summary:
        "Sambandha could not be judged because the ascendant or natal planet placements were unavailable.",
      bullets: [],
    };
  }

  const eventHouseLords =
    uniqueStrings(
      focusHouses.map((house) =>
        getLordOfHouse(
          lagnaSign,
          house
        )
      )
    );

  const supportHouseLords =
    uniqueStrings(
      supportHouses.map((house) =>
        getLordOfHouse(
          lagnaSign,
          house
        )
      )
    );

  const relevantKarakas =
    uniqueStrings(rule.karakas);

  const activeDashaLords =
    uniqueStrings([
      normalizePlanetName(activeDasha.md),
      normalizePlanetName(activeDasha.ad),
      normalizePlanetName(activeDasha.pd),
    ]);

  const eventPlanets = new Set(
    uniqueStrings([
      ...eventHouseLords,
      ...supportHouseLords,
      ...relevantKarakas,
      ...activeDashaLords,
    ])
  );

  const planetHouseRoles =
    new Map<string, number[]>();

  for (const house of focusHouses) {
    const lord =
      getLordOfHouse(
        lagnaSign,
        house
      );

    if (!lord) continue;

    planetHouseRoles.set(
      lord,
      uniqueStrings([
        ...(planetHouseRoles.get(lord) ?? []).map(String),
        String(house),
      ]).map(Number)
    );
  }

  for (const house of supportHouses) {
    const lord =
      getLordOfHouse(
        lagnaSign,
        house
      );

    if (!lord) continue;

    planetHouseRoles.set(
      lord,
      uniqueStrings([
        ...(planetHouseRoles.get(lord) ?? []).map(String),
        String(house),
      ]).map(Number)
    );
  }

  const relationships: PlanetarySambandha[] = [];

  for (
    let firstIndex = 0;
    firstIndex < planets.length;
    firstIndex += 1
  ) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < planets.length;
      secondIndex += 1
    ) {
      relationships.push(
        ...buildPlanetPairSambandhas(
          planets[firstIndex],
          planets[secondIndex],
          eventPlanets,
          planetHouseRoles
        )
      );
    }
  }

  const deduplicatedRelationships =
    Array.from(
      new Map(
        relationships.map((relationship) => [
          relationship.id,
          relationship,
        ])
      ).values()
    );

  const supportiveLinks =
    deduplicatedRelationships.filter(
      (relationship) =>
        relationship.impact === "support"
    );

  const mixedLinks =
    deduplicatedRelationships.filter(
      (relationship) =>
        relationship.impact === "mixed"
    );

  const blockingLinks =
    deduplicatedRelationships.filter(
      (relationship) =>
        relationship.impact === "block"
    );

  const requiredEventPlanets =
    uniqueStrings([
      ...eventHouseLords,
      ...supportHouseLords,
    ]);

  const connectedPlanets = new Set<string>();

  for (const relationship of supportiveLinks) {
    connectedPlanets.add(
      relationship.planetA
    );

    if (relationship.planetB) {
      connectedPlanets.add(
        relationship.planetB
      );
    }
  }

  const missingRequiredLinks =
    requiredEventPlanets
      .filter(
        (planet) =>
          !connectedPlanets.has(planet)
      )
      .map(
        (planet) =>
          `${planet} is relevant to the event but has no direct supporting relationship with the other required event factors.`
      );

  const rawConnectivity =
    supportiveLinks.reduce(
      (total, relationship) =>
        total + relationship.score,
      0
    );

  const possibleRelationshipBase =
    Math.max(
      1,
      requiredEventPlanets.length * 7
    );

  const connectivityScore =
    Math.max(
      0,
      Math.min(
        100,
        Math.round(
          (rawConnectivity /
            possibleRelationshipBase) *
            100
        )
      )
    );

  const dashaLinks =
    supportiveLinks.filter(
      (relationship) =>
        activeDashaLords.includes(
          relationship.planetA
        ) ||
        Boolean(
          relationship.planetB &&
          activeDashaLords.includes(
            relationship.planetB
          )
        )
    );

  const dashaConnectivityScore =
    activeDashaLords.length === 0
      ? 0
      : Math.max(
          0,
          Math.min(
            100,
            Math.round(
              dashaLinks.reduce(
                (total, relationship) =>
                  total +
                  relationship.score,
                0
              ) /
                Math.max(
                  1,
                  activeDashaLords.length * 7
                ) *
                100
            )
          )
        );

  const conversionScore =
    Math.round(
      connectivityScore * 0.7 +
      dashaConnectivityScore * 0.3
    );

  const verdict:
    SambandhaAnalysis["verdict"] =
      conversionScore >= 75
        ? "strongly_connected"
        : conversionScore >= 55
        ? "connected"
        : conversionScore >= 30
        ? "partially_connected"
        : "disconnected";

  const strongestRelationships =
    [...supportiveLinks]
      .sort(
        (first, second) =>
          second.score - first.score
      )
      .slice(0, 5);

  const summary =
    verdict === "strongly_connected"
      ? "The required event houses, their lords, relevant karakas and active period lords are strongly interconnected."
      : verdict === "connected"
      ? "The event-producing factors have meaningful planetary connectivity, giving the promise a usable route toward manifestation."
      : verdict === "partially_connected"
      ? "Some required event factors are connected, but the chain is incomplete; movement may occur more easily than final conversion."
      : "The relevant event factors are present but insufficiently connected for a clean or dependable conversion.";

  const bullets = [
    ...strongestRelationships.map(
      (relationship) =>
        relationship.reason
    ),
    ...missingRequiredLinks.slice(0, 3),
  ];

  return {
    topic,
    eventType,
    focusHouses,
    supportHouses,
    eventHouseLords,
    supportHouseLords,
    relevantKarakas,
    activeDashaLords,
    relationships:
      deduplicatedRelationships,
    supportiveLinks,
    mixedLinks,
    blockingLinks,
    missingRequiredLinks,
    connectivityScore,
    dashaConnectivityScore,
    conversionScore,
    verdict,
    summary,
    bullets,
  };
}
function sameISODate(a: any, b: string): boolean {
  return String(a ?? "").slice(0, 10) === b;
}
function extractISODate(value: unknown): string | null {
  const text = String(value ?? "").trim();
  if (!text) return null;

  const directMatch = text.match(/\b\d{4}-\d{2}-\d{2}\b/);
  if (directMatch) return directMatch[0];

  const parsed = new Date(text);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString().slice(0, 10);
}

function sameTimingDate(
  first: unknown,
  second: unknown
): boolean {
  const firstISO = extractISODate(first);
  const secondISO = extractISODate(second);

  return !!firstISO && !!secondISO && firstISO === secondISO;
}

function replaceRawISODates(text: string): string {
  return String(text ?? "").replace(
    /\b(\d{4}-\d{2}-\d{2})\b/g,
    (_, iso: string) => fmtDateShort(iso)
  );
}

function removeRepeatedTimingDate(text: string): string {
  let output = String(text ?? "");

  /*
    Example:
    "around 6 Aug 2026, with stronger activation around 2026-08-06"

    After raw ISO formatting this can become:
    "around 6 Aug 2026, with stronger activation around 6 Aug 2026"
  */
  output = output.replace(
    /around\s+(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}),?\s+with\s+(?:a\s+)?stronger\s+activation\s+around\s+\1/gi,
    "around $1"
  );

  output = output.replace(
    /around\s+(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}),?\s+with\s+(?:a\s+)?sharper\s+activation\s+around\s+\1/gi,
    "around $1"
  );

  output = output.replace(
    /(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})\s*(?:,|;)?\s*(?:again\s+)?around\s+\1/gi,
    "$1"
  );

  return output
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.!?])/g, "$1")
    .trim();
}

function polishUserFacingDates(text: string): string {
  return removeRepeatedTimingDate(
    replaceRawISODates(text)
  );
}
function describeBroaderChartSupport(
  verdict: AnalysisLayer["verdict"]
): string {
  switch (verdict) {
    case "strong":
      return "The broader chart picture strongly reinforces this indication.";

    case "moderate":
      return "The broader chart picture provides meaningful support for this indication.";

    case "mixed":
      return "The broader chart picture supports parts of this theme, although its expression may be uneven.";

    case "weak":
      return "The broader chart picture places only limited emphasis on this indication.";

    case "unclear":
    default:
      return "The available supporting factors do not clearly emphasize this indication.";
  }
}
function getTimingTopicCopy(
  topic: AskSarathiDomain,
  eventType?: AskSarathiEventType
) {
  switch (topic) {
    case "vehicle":
  return {
    eventName:
      eventType === "upgrade_vehicle"
        ? "vehicle-upgrade"
        : "vehicle-purchase",

    outcomeName:
      eventType === "upgrade_vehicle"
        ? "vehicle upgrade"
        : "new-car purchase",

    movementName:
      "vehicle-related movement",

    activationMeaning:
      eventType === "upgrade_vehicle"
        ? "research, exchange-value checks, test drives, financing discussions, dealership contact, or serious movement toward an upgrade"
        : "research, shortlisting, test drives, financing checks, dealership contact, negotiation, or serious movement toward purchasing a car",

    conversionMeaning:
      eventType === "upgrade_vehicle"
        ? "final selection, financing approval, booking, exchange, registration, or delivery"
        : "final selection, financing approval, booking, registration, or delivery",

    weakOpening:
      "An immediate vehicle purchase is not strongly confirmed by the current timing.",

    preparationAction:
      "Use the preparation phase to compare models, calculate the full ownership cost, check financing, and understand the resale or exchange value of your present vehicle.",

    activationAction:
      "During the active window, shortlist seriously, take test drives, negotiate with dealers, and keep financing documents ready.",

    caution:
      "Avoid booking only because an attractive deal appears; confirm affordability, delivery timing, insurance, registration, and the final on-road cost first.",
  };

    case "property":
      return {
        eventName: "property-purchase",
        outcomeName: "property purchase",
        movementName: "property-related movement",
        activationMeaning:
          "search activity, shortlisting, viewings, loan checks, negotiations, paperwork, or family discussions",
        conversionMeaning:
          "agreement, mortgage approval, registration, payment, or possession",
        weakOpening:
          "An immediate property purchase is not strongly confirmed by the current timing.",
        preparationAction:
          "Use the preparation phase to clarify your budget, financing eligibility, preferred areas, and legal requirements.",
        activationAction:
          "During the active window, arrange viewings, negotiate seriously, verify documents, and keep financing ready.",
        caution:
          "Do not commit until legal checks, valuation, financing terms, and total transaction costs are clear.",
      };

    case "marriage":
      return {
        eventName: "marriage",
        outcomeName: "marriage or formal commitment",
        movementName: "relationship and commitment movement",
        activationMeaning:
          "introductions, family discussions, meetings, proposal movement, or serious commitment conversations",
        conversionMeaning:
          "formal commitment, engagement, final agreement, or marriage",
        weakOpening:
          "An immediate marriage outcome is not strongly confirmed by the current timing.",
        preparationAction:
          "Use the preparation phase to clarify expectations, relationship readiness, and the practical conditions needed for commitment.",
        activationAction:
          "During the active window, remain open to introductions, serious conversations, and family-supported progress.",
        caution:
          "Do not force commitment merely because the period is active; emotional compatibility and practical readiness still matter.",
      };

    case "relationships":
      return {
        eventName: "relationship",
        outcomeName: "relationship development",
        movementName: "relationship movement",
        activationMeaning:
          "communication, attraction, introductions, reconnection, emotional opening, or commitment discussions",
        conversionMeaning:
          "a stable relationship, reconciliation, exclusivity, or deeper commitment",
        weakOpening:
          "An immediate relationship outcome is not strongly confirmed by the current timing.",
        preparationAction:
          "Use the preparation phase to become clear about your emotional needs, boundaries, and relationship expectations.",
        activationAction:
          "During the active window, communicate openly and respond to genuine opportunities for connection.",
        caution:
          "Do not mistake attention or temporary attraction for stable commitment without consistent real-world behaviour.",
      };

    case "money":
      return {
        eventName: "financial",
        outcomeName: "financial improvement",
        movementName: "financial movement",
        activationMeaning:
          "income discussions, delayed payments, bonus movement, negotiations, side-income openings, or improved cash flow",
        conversionMeaning:
          "confirmed income growth, payment receipt, bonus, salary improvement, or sustainable additional income",
        weakOpening:
          "An immediate financial outcome is not strongly confirmed by the current timing.",
        preparationAction:
          "Use the preparation phase to organise cash flow, document your value, reduce avoidable expenses, and prepare for negotiations.",
        activationAction:
          "During the active window, pursue income opportunities, follow up on pending payments, and negotiate with evidence.",
        caution:
          "Avoid taking large financial risks until the expected income or payment has actually been confirmed.",
      };

    case "relocation":
      return {
        eventName: "relocation",
        outcomeName: "relocation",
        movementName: "relocation-related movement",
        activationMeaning:
          "location research, applications, visa or documentation activity, housing discussions, or logistical planning",
        conversionMeaning:
          "approval, confirmed move, travel, housing closure, or physical relocation",
        weakOpening:
          "An immediate relocation is not strongly confirmed by the current timing.",
        preparationAction:
          "Use the preparation phase to organise documents, finances, housing options, and practical relocation requirements.",
        activationAction:
          "During the active window, submit applications, follow up actively, and respond quickly to viable movement.",
        caution:
          "Do not make irreversible arrangements until approvals, employment, housing, and financial conditions are sufficiently clear.",
      };
          case "health":
    case "mental_health":
      return {
        eventName:
          "health-improvement",

        outcomeName:
          "health improvement",

        movementName:
          "health-related improvement",

        activationMeaning:
          "greater clarity about symptoms, medical consultation, routine correction, treatment review, rest, or the beginning of gradual improvement",

        conversionMeaning:
          "sustained improvement, better stability, clearer diagnosis, or a more manageable health routine",

        weakOpening:
          "An immediate or guaranteed health outcome is not strongly confirmed by the current timing.",

        preparationAction:
          "Use the preparation phase to organise medical information, improve sleep and routine, and seek qualified professional guidance where needed.",

        activationAction:
          "During the supportive period, remain consistent with professional advice, follow-up appointments, rest, nutrition, and the recommended care plan.",

        caution:
          "Astrological timing cannot diagnose illness or replace qualified medical or mental-health care. Do not delay urgent or necessary treatment because of an astrological indication.",
      };
          case "education":
      return {
        eventName:
          "education",

        outcomeName:
          "educational progress",

        movementName:
          "education-related movement",

        activationMeaning:
          "course research, applications, exam preparation, interviews, admissions communication, or documentation",

        conversionMeaning:
          "admission, enrolment, exam success, course commencement, or completion of an important academic milestone",

        weakOpening:
          "An immediate final educational outcome is not strongly confirmed by the current timing.",

        preparationAction:
          "Use the preparation phase to shortlist suitable courses, understand eligibility, organise documents, and strengthen academic preparation.",

        activationAction:
          "During the active window, submit applications, prepare seriously for assessments, and follow up promptly on admissions or documentation.",

        caution:
          "Do not select a course only because admission is available; confirm its quality, cost, recognition, and relevance to your longer-term goals.",
      };
    case "business":
      return {
        eventName:
          "business",

        outcomeName:
          "business progress",

        movementName:
          "business-related movement",

        activationMeaning:
          "planning, market research, partner discussions, client enquiries, registrations, funding conversations, or early commercial activity",

        conversionMeaning:
          "a formal launch, signed client, confirmed partnership, stable revenue, or measurable business growth",

        weakOpening:
          "An immediate major business outcome is not strongly confirmed by the current timing.",

        preparationAction:
          "Use the preparation phase to validate demand, clarify the business model, calculate costs, prepare compliance requirements, and define the first customer segment.",

        activationAction:
          "During the active window, begin client outreach, test the offer, complete registrations, and pursue viable commercial discussions.",

        caution:
          "Avoid committing large capital or entering partnerships until the commercial terms, responsibilities, cash requirements, and exit conditions are clear.",
      };
    case "career":
  return {
        eventName:
          eventType === "job_change"
            ? "job-change"
            : eventType === "promotion"
            ? "promotion"
            : "career",

        outcomeName:
          eventType === "job_change"
            ? "job change"
            : eventType === "promotion"
            ? "promotion"
            : "career outcome",

        movementName: "career movement",

        activationMeaning:
          getMovementMeaning(topic, eventType),

        conversionMeaning:
          eventType === "job_change"
            ? "a confirmed offer, resignation, employer change, or joining"
            : eventType === "promotion"
            ? "formal approval, title change, salary revision, or announced promotion"
            : "a confirmed professional outcome",

        weakOpening:
          "An immediate career outcome is not strongly indicated from the current signals.",

        preparationAction:
          "Use the preparation phase to strengthen your profile, visibility, network, and evidence of performance.",

        activationAction:
          "During the active window, pursue conversations, applications, interviews, and internal opportunities actively.",

        caution:
          "Avoid making an irreversible career decision until the practical outcome is confirmed.",
      };
      default:
  return {
    eventName: "event",

    outcomeName: "desired outcome",

    movementName: "movement in this area",

    activationMeaning:
      "early conversations, planning, practical activity, decisions, documentation, or visible movement connected with this matter",

    conversionMeaning:
      "a confirmed and practically completed outcome",

    weakOpening:
      "An immediate final outcome is not strongly confirmed by the current timing.",

    preparationAction:
      "Use the preparation phase to clarify what you want, organise the practical requirements, and remove avoidable obstacles.",

    activationAction:
      "During the active window, respond to genuine opportunities and take practical action when real-world movement begins.",

    caution:
      "Do not treat an active astrological period as a guarantee; confirm the practical conditions before making an irreversible commitment.",
  };
  }
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
if (
  astroBundle.sambandhaAnalysis?.summary
) {
  why.push(
    `Planetary connectivity: ${astroBundle.sambandhaAnalysis.summary}`
  );
}
if (astroBundle.divisionalLayer?.summary) {
  why.push(
  describeBroaderChartSupport(
    astroBundle.divisionalLayer.verdict
  )
);
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
  astroBundle.sambandhaAnalysis.verdict ===
    "strongly_connected"
    ? "The required event houses, their lords and the active period planets are strongly connected."
    : astroBundle.sambandhaAnalysis.verdict ===
      "connected"
    ? "The event-producing planets have a meaningful relationship that can support manifestation."
    : astroBundle.sambandhaAnalysis.verdict ===
      "partially_connected"
    ? "The chart can create movement, but the planetary relationship chain is incomplete."
    : astroBundle.sambandhaAnalysis.verdict ===
      "disconnected"
    ? "The relevant factors are present but insufficiently connected for a clean result."
    : "The available timing signals require cautious interpretation because planetary connectivity is incomplete.";
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
  `The timing judgement is based on ${getDashaPhrase(
    astroBundle
  )}, the relevant houses, the broader chart pattern, and current transit triggers.`;
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
  "The diagnosis comes from the underlying chart pattern, the current dasha, supporting chart factors, timing conditions, and any factors delaying full expression.";
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

  

  // Avoid using very broad MD rows when nearer AD/PD rows already exist.
  if (row?._level === "md" && out.length > 0) continue;

  const dashaLevel =
  row?._level === "md" ||
  row?._level === "ad" ||
  row?._level === "pd"
    ? row._level
    : null;

const dashaChainLabel =
  row?.label ??
  [row?.mahaLord, row?.antarLord, planet]
    .filter(Boolean)
    .join(" / ");

const dashaLevelText =
  dashaLevel === "md"
    ? "Mahadasha"
    : dashaLevel === "ad"
      ? "Antardasha"
      : dashaLevel === "pd"
        ? "Pratyantardasha"
        : "dasha";

addWindow({
  label: `${fmtDateShort(start)} to ${fmtDateShort(end)} ${planet} ${String(
    row?._level ?? ""
  ).toUpperCase()} timing shift`,

  start: start ? String(start) : null,
  end: end ? String(end) : null,
  peak: start ? String(start) : null,

  why: [
    `${dashaChainLabel} activates ${planet} at the ${dashaLevelText} level.`,
    `${planet} is relevant to ${topic} through event and dasha linkage.`,
    "This identifies a possible timing phase, but final outcome confirmation still depends on supporting transits.",
  ],

  dashaLord: planet,
  dashaLevel,
  dashaChainLabel,
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
  describeBroaderChartSupport(
    params.divisionalLayer.verdict
  )
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
  describeBroaderChartSupport(
    params.divisionalLayer.verdict
  );
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
  describeBroaderChartSupport(
    params.divisionalLayer.verdict
  )
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
  sambandhaAnalysis: SambandhaAnalysis;
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
    conversionReasons.push(
  "The broader chart picture strongly reinforces the possibility of a visible outcome."
);
  }

  if (params.promiseLayer.verdict === "strong") {
    conversionStrength += 25;
    conversionReasons.push("The underlying promise can produce a visible outcome.");
  }
  if (
  params.sambandhaAnalysis.verdict ===
  "strongly_connected"
) {
  movementStrength += 15;
  conversionStrength += 25;

  movementReasons.push(
    "The relevant event lords, karakas and active period lords form a strong planetary relationship chain."
  );

  conversionReasons.push(
    "The event-producing factors are strongly connected, giving the natal promise a clear route toward manifestation."
  );
} else if (
  params.sambandhaAnalysis.verdict ===
  "connected"
) {
  movementStrength += 10;
  conversionStrength += 15;

  conversionReasons.push(
    "The required event factors have meaningful planetary connectivity."
  );
} else if (
  params.sambandhaAnalysis.verdict ===
  "partially_connected"
) {
  movementStrength += 10;
  blockageStrength += 10;

  movementReasons.push(
    "Some event factors are connected, which can produce activity or discussion."
  );

  blockageReasons.push(
    "The planetary relationship chain is incomplete, so movement may not convert cleanly into the final outcome."
  );
} else if (
  params.sambandhaAnalysis.verdict ===
  "disconnected"
) {
  blockageStrength += 30;

  blockageReasons.push(
    "The required event factors are individually present but insufficiently connected for dependable conversion."
  );
} else {
  blockageStrength += 5;

  blockageReasons.push(
    "Planetary connectivity could not be fully assessed because chart relationship data is incomplete."
  );
}
  if (params.bestAvailableWindow?.windowClass === "outcome") {
    conversionStrength += 30;
    conversionReasons.push("The selected timing window is classified as an outcome window.");
  }

  if (["weak", "unclear"].includes(params.divisionalLayer.verdict)) {
    blockageStrength += 35;
    blockageReasons.push(
  describeBroaderChartSupport(
    params.divisionalLayer.verdict
  )
);
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

 const hasTransitConfirmation =
  Number(
    params.bestAvailableWindow
      ?.scoreBreakdown
      ?.transitSupport ?? 0
  ) > 0;

const isOutcomeWindow =
  params.bestAvailableWindow
    ?.windowClass === "outcome";

const hasConversionSambandha =
  params.sambandhaAnalysis.verdict ===
    "strongly_connected" ||
  params.sambandhaAnalysis.verdict ===
    "connected";

const canFavorConversion =
  isOutcomeWindow &&
  hasTransitConfirmation &&
  hasConversionSambandha;

const verdict:
  | "conversion_favored"
  | "movement_favored"
  | "blocked" =
  canFavorConversion &&
  conversionStrength > blockageStrength
    ? "conversion_favored"
    : movementStrength > blockageStrength
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
  sambandhaAnalysis: SambandhaAnalysis;
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
  if (
  params.sambandhaAnalysis.verdict ===
    "strongly_connected" ||
  params.sambandhaAnalysis.verdict ===
    "connected"
) {
  conversionScore +=
    params.sambandhaAnalysis.verdict ===
    "strongly_connected"
      ? 25
      : 15;

  conversionReasons.push(
    "The promotion houses, their lords and relevant career significators form an operative planetary relationship."
  );
}

if (
  params.sambandhaAnalysis.verdict ===
  "partially_connected"
) {
  titleScore += 10;
  blockerScore += 10;

  titleReasons.push(
    "The relationship pattern can produce recognition or discussion."
  );

  blockerReasons.push(
    "The incomplete planetary relationship chain may delay formal title conversion."
  );
}

if (
  params.sambandhaAnalysis.verdict ===
  "disconnected"
) {
  blockerScore += 25;

  blockerReasons.push(
    "The promotion-producing houses are insufficiently connected for clean formal conversion."
  );
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
  hasTransitConfirmation: boolean;
}): {
  windowClass: TimingWindowClass;
  practicalMeaning: string;
} {
  const {
  topic,
  eventType,
  score,
  hasTransitConfirmation,
} = params;

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

  if (
  strong &&
  hasOutcomeSupport &&
  hasTransitConfirmation
) {
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
    if (
  strong &&
  hasOutcomeSupport &&
  hasTransitConfirmation
) {
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
    if (
  strong &&
  hasOutcomeSupport &&
  hasTransitConfirmation
) {
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
    if (
  strong &&
  hasOutcomeSupport &&
  hasTransitConfirmation
) {
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
    if (
  strong &&
  hasOutcomeSupport &&
  hasTransitConfirmation
) {
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
    if (
  strong &&
  hasOutcomeSupport &&
  hasTransitConfirmation
) {
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

 const genericOutcome =
  strong &&
  hasOutcomeSupport &&
  hasTransitConfirmation;

return {
  windowClass: genericOutcome
    ? "outcome"
    : medium
      ? "movement"
      : "preparation",

  practicalMeaning: genericOutcome
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

  if (weights.primary.includes(planet)) return 8;
  if (weights.secondary.includes(planet)) return 5;
  if (weights.context.includes(planet)) return 3;

  return 0;
}
function rankTimingWindows(params: {
  windows: TimingWindow[];
  topic: AskSarathiDomain;
  eventType?: AskSarathiEventType;

  activeDasha?: {
    md?: string | null;
    ad?: string | null;
    pd?: string | null;
  } | null;

  timingPolicy: GenericAstroBundle["timingPolicy"];

  promiseLayer: AnalysisLayer;
  sambandhaAnalysis: SambandhaAnalysis;
  divisionalLayer: AnalysisLayer;
  karakaLayer: AnalysisLayer;
}): RankedTimingWindow[] {
  const {
    windows,
    topic,
    eventType,
    activeDasha,
    timingPolicy,
    promiseLayer,
    sambandhaAnalysis,
    divisionalLayer,
    karakaLayer,
  } = params;

  return windows
   .map((w, index) => {
 const scoreBreakdown = {
  baseScore: 30,
  natalPromise: 0,
  sambandhaSupport: 0,
  divisionalSupport: 0,
  dashaSupport: 0,
  transitSupport: 0,
  karakaSupport: 0,
  eventSupport: 0,
  confidenceBonus: 0,
  penalties: 0,
};

let score = scoreBreakdown.baseScore;


  const windowText = JSON.stringify(w);

  const planetMatch =
    windowText.match(
      /\b(Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)\b/
    )?.[1] ?? null;

  const eventSupportScore =
    getPlanetEventRelevanceScore({
      topic,
      planet: planetMatch,
    });

  scoreBreakdown.eventSupport +=
    eventSupportScore;

  score += eventSupportScore;

  const activeMd = safePlanetName(
    activeDasha?.md
  );

  const activeAd = safePlanetName(
    activeDasha?.ad
  );

  const activePd = safePlanetName(
    activeDasha?.pd
  );

  const windowDashaLord = safePlanetName(
    w?.dashaLord ??
    planetMatch
  );

  const windowChainText = String(
    w?.dashaChainLabel ??
    ""
  ).toLowerCase();

  const activeMdMatchesWindow = Boolean(
    activeMd &&
    windowChainText.includes(
      activeMd.toLowerCase()
    )
  );

  const activeAdMatchesWindow = Boolean(
    activeAd &&
    windowChainText.includes(
      activeAd.toLowerCase()
    )
  );

  const activePdMatchesWindow = Boolean(
    activePd &&
    windowDashaLord === activePd
  );

  if (activeMdMatchesWindow) {
    scoreBreakdown.dashaSupport += 6;
    score += 6;
  }

  if (activeAdMatchesWindow) {
    scoreBreakdown.dashaSupport += 7;
    score += 7;
  }

  if (activePdMatchesWindow) {
    scoreBreakdown.dashaSupport += 8;
    score += 8;
  }

  if (
    timingPolicy.dashaStrength ===
    "strong"
  ) {
    scoreBreakdown.dashaSupport += 25;
    score += 25;
  } else if (
    timingPolicy.dashaStrength ===
    "moderate"
  ) {
    scoreBreakdown.dashaSupport += 15;
    score += 15;
  } else if (
    timingPolicy.dashaStrength ===
    "mixed"
  ) {
    scoreBreakdown.dashaSupport += 8;
    score += 8;
  }

  if (
    timingPolicy.transitStrength ===
    "strong"
  ) {
    scoreBreakdown.transitSupport += 20;
    score += 20;
  } else if (
    timingPolicy.transitStrength ===
    "moderate"
  ) {
    scoreBreakdown.transitSupport += 12;
    score += 12;
  } else if (
    timingPolicy.transitStrength ===
    "mixed"
  ) {
    scoreBreakdown.transitSupport += 6;
    score += 6;
  }

  if (
    promiseLayer.verdict ===
    "strong"
  ) {
    scoreBreakdown.natalPromise += 10;
    score += 10;
  } else if (
    promiseLayer.verdict ===
    "moderate"
  ) {
    scoreBreakdown.natalPromise += 6;
    score += 6;
  }

  if (
    sambandhaAnalysis.verdict ===
    "strongly_connected"
  ) {
    scoreBreakdown.sambandhaSupport += 8;
    score += 8;
  } else if (
    sambandhaAnalysis.verdict ===
    "connected"
  ) {
    scoreBreakdown.sambandhaSupport += 5;
    score += 5;
  } else if (
    sambandhaAnalysis.verdict ===
    "partially_connected"
  ) {
    scoreBreakdown.sambandhaSupport += 2;
    score += 2;
  } else if (
    sambandhaAnalysis.verdict ===
    "disconnected"
  ) {
    scoreBreakdown.penalties -= 8;
    score -= 8;
  }

  if (
    divisionalLayer.verdict ===
    "strong"
  ) {
    scoreBreakdown.divisionalSupport += 10;
    score += 10;
  } else if (
    divisionalLayer.verdict ===
    "moderate"
  ) {
    scoreBreakdown.divisionalSupport += 6;
    score += 6;
  }

  if (
    karakaLayer.verdict ===
    "strong"
  ) {
    scoreBreakdown.karakaSupport += 5;
    score += 5;
  } else if (
    karakaLayer.verdict ===
    "moderate"
  ) {
    scoreBreakdown.karakaSupport += 3;
    score += 3;
  }

  const proximityPenalty =
    index * 3;

  if (proximityPenalty > 0) {
    scoreBreakdown.penalties -=
      proximityPenalty;

    score -= proximityPenalty;
  }

  const rawScore = score;

  score = Math.max(
    10,
    Math.min(95, score)
  );

  if (score !== rawScore) {
    scoreBreakdown.penalties +=
      score - rawScore;
  }
const hasTransitConfirmation =
  scoreBreakdown.transitSupport > 0;
  const classified =
  classifyTimingWindow({
    topic,
    eventType,
    score,
    promiseLayer,
    divisionalLayer,
    karakaLayer,
    hasTransitConfirmation,
  });

const confidence:
  | "high"
  | "medium"
  | "low" =
  score >= 70 &&
  hasTransitConfirmation
    ? "high"
    : score >= 50
      ? "medium"
      : "low";

  return {
    ...w,
    score,
    confidence,
    ...classified,
    scoreBreakdown,
  };
})
    .sort(
      (a, b) =>
        b.score - a.score
    );
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
if (topic === "business") {
  return detectBusinessEventType(
    question,
    topic,
    timeDirection ?? "mixed"
  );
}
if (topic === "education") {
  return detectEducationEventType(
    question,
    topic,
    timeDirection ?? "mixed"
  );
}
if (topic === "property") {
  return detectPropertyEventType(
    question,
    topic,
    timeDirection ?? "mixed"
  );
}

if (topic === "vehicle") {
  return detectVehicleEventType(
    question,
    topic,
    timeDirection ?? "mixed"
  );
}

if (topic === "money") {
  return detectWealthEventType(
    question,
    topic,
    timeDirection ?? "mixed"
  );
}

if (
  topic === "relationships" ||
  topic === "marriage"
) {
  return detectRelationshipEventType(
    question,
    topic,
    timeDirection ?? "mixed"
  );
}

if (topic === "health") {
  return detectHealthEventType(
    question,
    topic,
    timeDirection ?? "mixed"
  );
}

 if (topic === "relocation") {
  return detectRelocationEventType(
    question,
    topic,
    timeDirection ?? "mixed"
  );
}
if (topic === "spiritual") {
  return detectSpiritualEventType(
    question,
    topic,
    timeDirection ?? "mixed"
  );
}
if (topic === "child") {
  return detectChildrenEventType(
    question,
    topic,
    timeDirection ?? "mixed"
  );
}
if (topic === "disputes") {
  return detectDisputeEventType(
    question,
    topic,
    timeDirection ?? "mixed"
  );
}
if (topic === "parents") {
  return detectParentsEventType(
    question,
    topic,
    timeDirection ?? "mixed"
  );
}

if (topic === "siblings") {
  return detectSiblingsEventType(
    question,
    topic,
    timeDirection ?? "mixed"
  );
}
if (topic === "travel") {
  return detectTravelEventType(
    question,
    topic,
    timeDirection ?? "mixed"
  );
}
if (topic === "reputation") {
  return detectReputationEventType(
    question,
    topic,
    timeDirection ?? "mixed"
  );
}
if (topic === "debt") {
  return detectDebtEventType(
    question,
    topic,
    timeDirection ?? "mixed"
  );
}
if (topic === "inheritance") {
  return detectInheritanceEventType(
    question,
    topic,
    timeDirection ?? "mixed"
  );
}
if (topic === "mental_health") {
  return detectMentalHealthEventType(
    question,
    topic,
    timeDirection ?? "mixed"
  );
}
if (topic === "pets") {
  return detectPetsEventType(
    question,
    topic
  );
}

if (topic === "inner") {
  return detectInnerEventType(
    question,
    topic
  );
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
if (
  /\b(what profession|which profession|what will be my profession|what could be my profession|what can be my profession|profession should i|profession can i|profession suits me|profession suit me|what career|which career|career suits me|career suit me|career direction|professional direction|what field should i|which field should i|what kind of work|which occupation|what occupation)\b/i.test(q)
) {
  return "profession_identity";
}
// profession identity / suitability first
if (
  /\b(what is my profession|what is my current profession|what do i do|what kind of work|line of work|career type|job type|what profession suits me|which profession suits me|what career suits me|which career suits me|should i become|can i become|would i be good as|am i suited for|am i suitable for|is .* suitable for me)\b/.test(
    q
  )
) {
  return "profession_identity";
}

  // promotion
 if (/\b(get promoted|promotion|promotions|promote|promoted)\b/.test(q)) {
  return "promotion";
}

  // job change
if (
  /\b(job change|change my job|change jobs|switch job|switch jobs|switch my job|new job|another job|different employer|change employer|switch employer|switch company|change company|changing companies|new employer)\b/.test(q)
) {
  return "job_change";
}

  // internal shift
  if (/\b(role change|role shift|transfer|department change|internal move)\b/.test(q)) {
    return "internal_shift";
  }

  // stability / check
if (
  /\b(stay in my job|stay in my current job|leave my job|leave my current job|quit|resign|resignation|continue in job|continue in my job|job stability|stuck in my career|career feels stuck|career is stuck|feeling stuck in my career)\b/.test(q)
) {
  return "stability_check";
}

// fallback by time direction
if (timeDirection === "identity") {
  return "profession_identity";
}

// Future tense alone does NOT imply a job change.
// Explicit job-change wording is handled above.
if (timeDirection === "future") {
  return "profession_identity";
}

return "generic";
}
function detectRelationshipEventType(
  question: string,
  topic: AskSarathiDomain,
  timeDirection: TimeDirection
): RelationshipEventType {
  if (
    topic !== "relationships" &&
    topic !== "marriage"
  ) {
    return "generic";
  }

  const q =
    question.toLowerCase().trim();

  if (
    /\b(what kind of partner|what type of partner|what sort of partner|who would suit me|who suits me|ideal partner|suitable partner|partner profile)\b/.test(q)
  ) {
    return "partner_profile";
  }

  if (
    /\b(am i suited for marriage|am i suitable for marriage|would marriage suit me|is marriage suitable for me|am i suited for relationships|am i suitable for relationships|relationship suitability|marriage suitability)\b/.test(q)
  ) {
    return "relationship_suitability";
  }

  if (
    /\b(why do my relationships|why are my relationships|why do relationships|relationship pattern|relationship patterns|why am i unlucky in love|why do i struggle in relationships|why do i struggle with relationships|why do my relationships fail)\b/.test(q)
  ) {
    return "relationship_pattern";
  }

  if (
    /\b(love marriage or arranged marriage|arranged marriage or love marriage|love or arranged marriage|arranged or love marriage|love vs arranged|love versus arranged)\b/.test(q)
  ) {
    return "love_vs_arranged";
  }

  if (
    /\b(reconcile|reconciliation|patch up|get back together|come back|return to me|ex return|ex come back|former partner return)\b/.test(q)
  ) {
    return "reconciliation";
  }

  if (
    /\b(when will i meet|when am i likely to meet|when will i find|when am i likely to find|meet a serious partner|meet my partner|meet my spouse|meet someone serious|meet someone special)\b/.test(q)
  ) {
    return "meeting_partner";
  }

  if (
    /\b(when will i marry|when will i get married|when am i likely to marry|when am i likely to get married|marriage timing|timing of marriage|when is marriage likely)\b/.test(q)
  ) {
    return "marriage_timing";
  }

  if (
    /\b(will we marry|will i marry|will this relationship lead to marriage|will this relationship become serious|commitment|engagement|wedding|marriage)\b/.test(q)
  ) {
    return "marriage_commitment";
  }

  if (
    /\b(new relationship|new partner|new love|someone new|start dating|dating someone|new person|find love)\b/.test(q)
  ) {
    return "new_relationship";
  }

  if (timeDirection === "identity") {
    return "relationship_suitability";
  }

  if (timeDirection === "future") {
    return topic === "marriage"
      ? "marriage_timing"
      : "new_relationship";
  }

  return "generic";
}
function detectWealthEventType(
  question: string,
  topic: AskSarathiDomain,
  timeDirection: TimeDirection
): WealthEventType {
 if (topic !== "money") {
  return "generic";
}

  const q =
    question.toLowerCase().trim();

  // Permanent wealth potential
if (
  /\b(am i naturally wealthy|do i have wealth potential|can i become wealthy|will i be wealthy|wealth potential|financial potential|money potential|wealth strongly promised|wealth promised|wealth promised in my chart|strong wealth promise)\b/.test(q)
) {
  return "wealth_potential";
}

  // Permanent earning style
  if (
    /\b(how do i earn money best|how should i earn money|best way for me to earn|what is my earning style|earning style|how can i make money|how do i make money best)\b/.test(q)
  ) {
    return "earning_style";
  }

  // Permanent wealth pattern / retention
  if (
    /\b(why do i struggle with money|why can't i save|why can i not save|why does money not stay|money does not stay|wealth pattern|financial pattern|why do i lose money|why am i bad with money)\b/.test(q)
  ) {
    return "wealth_pattern";
  }

  // Permanent saving capacity
  if (
    /\b(am i good at saving|can i build savings|saving capacity|savings potential|wealth retention|retain money|hold on to money)\b/.test(q)
  ) {
    return "saving_capacity";
  }

  // Permanent investment suitability
  if (
    /\b(am i suited to investing|am i suitable for investing|should i invest|investment suitability|am i good at investing|would investing suit me)\b/.test(q)
  ) {
    return "investment_suitability";
  }

  // Permanent multiple-income potential
  if (
    /\b(multiple income streams|multiple sources of income|more than one income|second income|can i have multiple incomes|can i earn from multiple sources)\b/.test(q)
  ) {
    return "multiple_income";
  }

  // Bonus
  if (
    /\b(bonus|incentive|variable pay)\b/.test(q)
  ) {
    return "bonus";
  }

  // Salary increase
  if (
    /\b(salary increase|salary increment|pay rise|pay raise|increase in salary|increase my salary|higher salary)\b/.test(q)
  ) {
    return "salary_increase";
  }

  // Side income
  if (
    /\b(side income|side hustle|extra income|additional income|consulting income|freelance income)\b/.test(q)
  ) {
    return "side_income";
  }

  // Explicit financial improvement timing
  if (
    /\b(when will my finances improve|when will money improve|when will my financial situation improve|when will income improve|financial improvement)\b/.test(q)
  ) {
    return "financial_improvement";
  }

  // Explicit wealth timing
  if (
    /\b(when will i become wealthy|when will i become rich|when will wealth increase|wealth timing|when will i have more money|when will i earn more)\b/.test(q)
  ) {
    return "wealth_timing";
  }

  // Fallback by time direction
  if (timeDirection === "identity") {
    return "wealth_potential";
  }

  if (timeDirection === "future") {
    return "financial_improvement";
  }

  return "generic";
}
function detectBusinessEventType(
  question: string,
  topic: AskSarathiDomain,
  timeDirection: TimeDirection
): BusinessEventType {
  if (topic !== "business") {
    return "generic";
  }

  const q = question.toLowerCase().trim();

  // Permanent business suitability
  if (
    /\b(am i suited for business|am i suitable for business|should i do business|would business suit me|business suitability|entrepreneurship suit me|am i entrepreneurial)\b/.test(q)
  ) {
    return "business_suitability";
  }

  // Permanent business style / business type
  if (
    /\b(what kind of business suits me|what kind of business will suit me|which business suits me|which business suits me best|what type of business suits me|business style|what business should i do|what business should i start|which business should i start|best business for me)\b/.test(q)
  ) {
    return "business_style";
  }

  // Permanent business vs employment
  if (
    /\b(business or job|job or business|business vs job|business versus job|employment or business|business or employment|business or salary|salary or business|business versus salary|salary versus business)\b/.test(q)
  ) {
    return "business_vs_job";
  }

  // Permanent partnership suitability
  if (
    /\b(am i suited for a business partnership|am i suitable for partnership|should i have a business partner|business partnership suit me|partnership suitability)\b/.test(q)
  ) {
    return "partnership_suitability";
  }

  // Permanent entrepreneurial pattern
  if (
    /\b(entrepreneurial pattern|entrepreneurial nature|business temperament|business personality|how entrepreneurial am i|what is my entrepreneurial style)\b/.test(q)
  ) {
    return "entrepreneurial_pattern";
  }

  // Business launch / starting a business
  if (
    /\b(when should i start my business|when should i launch my business|when can i start a business|when can i start my business|when is a good time to start a business|will i ever start my own business|will i start my own business|will i start a business|can i start my own business|business launch|launch my business)\b/.test(q)
  ) {
    return "business_launch";
  }

  // Business growth timing
  if (
    /\b(when will my business grow|when will business improve|when will my business improve|business growth|when will business pick up|when will sales improve)\b/.test(q)
  ) {
    return "business_growth";
  }

  // Client growth
  if (
    /\b(when will i get more clients|when will clients increase|client growth|customer growth|more customers|increase clients)\b/.test(q)
  ) {
    return "client_growth";
  }

  // Partnership timing
  if (
    /\b(when should i enter a partnership|when should i take a partner|when will i get a business partner|partnership timing)\b/.test(q)
  ) {
    return "partnership_timing";
  }

  // Generic business timing
  if (
    /\b(when is business favorable|when is business favourable|business timing|when is a good time for business|when will business become successful)\b/.test(q)
  ) {
    return "business_timing";
  }

  // Natural-language semantic fallback.
  // Exact rules above still win when they match.
  const semanticIntent = inferBusinessSemanticIntent(
    question,
    timeDirection
  );

  if (semanticIntent !== "generic") {
    return semanticIntent;
  }

  // Final broad fallbacks
  if (timeDirection === "identity") {
    return "business_suitability";
  }

  if (timeDirection === "future") {
    return "business_timing";
  }

  return "generic";
}

function inferBusinessSemanticIntent(
  question: string,
  timeDirection: TimeDirection
): BusinessEventType {
  const q = question.toLowerCase().trim();

  const scores: Partial<Record<BusinessEventType, number>> = {};

  const add = (
    event: BusinessEventType,
    points: number
  ) => {
    scores[event] = (scores[event] ?? 0) + points;
  };

  // --------------------------------------------------
  // 1. Business vs employment
  // Highest priority because these questions may also
  // contain suitability / entrepreneurship language.
  // --------------------------------------------------
  const hasBusinessConcept =
    /\b(business|entrepreneur|entrepreneurship|self employed|self-employed|work for myself|working for myself|own company|own business)\b/.test(
      q
    );

  const hasEmploymentConcept =
    /\b(job|employment|employed|salary|salaried|service|work for someone|working for someone)\b/.test(
      q
    );

  if (hasBusinessConcept && hasEmploymentConcept) {
    add("business_vs_job", 14);
  }

  // --------------------------------------------------
  // 2. Business type / style
  // "What business should I do?"
  // "Which industry fits me?"
  // --------------------------------------------------
  if (
    /\b(what kind|what type|which business|what business|which industry|what industry|business line|line of business|industry|sector|field|best business|business suits me|business fits me|fits my strengths|matches my strengths)\b/.test(
      q
    )
  ) {
    add("business_style", 12);
  }

  // Question asks WHAT to start rather than WHETHER to start.
  if (
    /\b(what|which)\b/.test(q) &&
    /\b(business|industry|sector|venture|enterprise|company)\b/.test(q)
  ) {
    add("business_style", 5);
  }

  // --------------------------------------------------
  // 3. Business suitability
  // --------------------------------------------------
 if (
  /\b(suited|suitable|suit me|fit for me|right for me|good for me|good at business|good at running a business|good at running my own business|capable of running a business|entrepreneurial|entrepreneurship for me|entrepreneurship right for me|can i succeed in business)\b/.test(
    q
  )
) {
  add("business_suitability", 10);
}

  // --------------------------------------------------
  // 4. Entrepreneurial nature / pattern
  // --------------------------------------------------
  if (
    /\b(entrepreneurial nature|entrepreneurial personality|entrepreneurial style|business temperament|business personality|natural entrepreneur|entrepreneurial am i)\b/.test(
      q
    )
  ) {
    add("entrepreneurial_pattern", 11);
  }

  // --------------------------------------------------
  // 5. Starting / launching / owning
  // --------------------------------------------------
  if (
    /\b(start|starting|launch|launching|open|opening|set up|setup|begin|build my own|own business|own company|run my own company|run my own business|something of my own|venture of my own|work for myself|working for myself|self employment|self-employment)\b/.test(
      q
    )
  ) {
    add("business_launch", 10);
  }

  // --------------------------------------------------
  // 6. Partnership suitability
  // --------------------------------------------------
  if (
    /\b(business partner|partner in business|partnership|cofounder|co-founder|joint venture)\b/.test(
      q
    )
  ) {
    add("partnership_suitability", 11);
  }

  // --------------------------------------------------
  // 7. Partnership timing
  // --------------------------------------------------
  if (
    /\b(when|timing|when should|when will)\b/.test(q) &&
    /\b(partner|partnership|cofounder|co-founder|joint venture)\b/.test(q)
  ) {
    add("partnership_timing", 14);
  }

  // --------------------------------------------------
  // 8. Client/customer growth
  // --------------------------------------------------
 if (
  /\b(client|clients|customer|customers|customer numbers|client numbers|customer base|client base)\b/.test(q) &&
  /\b(more|increase|improve|improving|grow|growth|get|gain|acquire)\b/.test(q)
) {
  add("client_growth", 12);
}

  // --------------------------------------------------
  // 9. Business growth
  // --------------------------------------------------
  if (
    /\b(grow|growth|expand|expansion|scale|scaling|pick up|improve|bigger|successful|success|increase sales|sales improve)\b/.test(
      q
    )
  ) {
    add("business_growth", 10);
  }

  // --------------------------------------------------
  // 10. Timing signal
  // This deliberately gets fewer points.
  // "Will" alone should NOT overpower the real intent.
  // --------------------------------------------------
  if (
    timeDirection === "future" &&
    /\b(will|when|future|later|soon|eventually|ever|this year|next year)\b/.test(
      q
    )
  ) {
    add("business_timing", 3);
  }

  // --------------------------------------------------
  // Select strongest semantic intent
  // --------------------------------------------------
  const ranked = Object.entries(scores).sort(
    (a, b) => Number(b[1]) - Number(a[1])
  );

  const winner = ranked[0]?.[0] as
    | BusinessEventType
    | undefined;

  return winner ?? "generic";
}

function detectEducationEventType(
  question: string,
  topic: AskSarathiDomain,
  timeDirection: TimeDirection
): EducationEventType {
  if (topic !== "education") {
    return "generic";
  }

  const q =
    question.toLowerCase().trim();

  // Permanent overall education suitability
  if (
    /\b(am i good at studies|am i suited for higher education|am i suitable for higher education|education suitability|do i have strong education potential|academic potential)\b/.test(q)
  ) {
    return "education_suitability";
  }

  // Permanent subject fit
  if (
    /\b(what subjects suit me|which subjects suit me|what subject suits me|which subject should i choose|best subjects for me|what should i study|what field should i study)\b/.test(q)
  ) {
    return "subject_fit";
  }

  // Permanent stream choice
  if (
    /\b(science or commerce|commerce or science|science vs commerce|science versus commerce|arts or science|science or arts|commerce or arts|arts or commerce|which stream should i choose|best stream for me)\b/.test(q)
  ) {
    return "stream_choice";
  }

  // Permanent study / learning pattern
  if (
    /\b(why do i struggle to study|why can't i study|why can i not study|why do i lose focus while studying|study pattern|learning pattern|how do i learn best|what is my learning style|why am i distracted in studies)\b/.test(q)
  ) {
    return "study_pattern";
  }

  // Higher-education timing
  if (
    /\b(when should i pursue higher education|when should i study abroad|when is a good time for higher studies|when should i do masters|when should i do my masters|when should i go to university|higher education timing)\b/.test(q)
  ) {
    return "higher_education";
  }

  // Exam performance / timed academic result
  if (
    /\b(will i do well in my exam|will i pass my exam|will i pass the exam|how will my exams go|exam performance|will i clear my exam|will i clear the exam|will i succeed in my exams)\b/.test(q)
  ) {
    return "exam_performance";
  }

  // Generic education timing
  if (
    /\b(when will studies improve|when will my studies improve|when will education improve|education timing|when is a good time to study|when will academic performance improve)\b/.test(q)
  ) {
    return "education_timing";
  }

  if (timeDirection === "identity") {
    return "education_suitability";
  }

  if (timeDirection === "future") {
    return "education_timing";
  }

  return "generic";
}
function detectSpiritualEventType(
  question: string,
  topic: AskSarathiDomain,
  timeDirection: TimeDirection
): SpiritualEventType {
  if (topic !== "spiritual") {
    return "generic";
  }

  const q =
    question.toLowerCase().trim();

  if (
    /\b(am i naturally spiritual|am i spiritual|do i have spiritual inclination|spiritual inclination|spiritual nature|spiritual potential)\b/.test(q)
  ) {
    return "spiritual_inclination";
  }

  if (
    /\b(what spiritual path suits me|which spiritual path suits me|what path should i follow|bhakti or jnana|jnana or bhakti|bhakti or meditation|what form of spirituality suits me)\b/.test(q)
  ) {
    return "spiritual_path";
  }

  if (
    /\b(devotional style|bhakti style|am i devotional|does bhakti suit me|devotion suit me|prayer suit me)\b/.test(q)
  ) {
    return "devotional_style";
  }

  if (
    /\b(am i suited to meditation|is meditation suitable for me|does meditation suit me|meditation suitability|should i meditate)\b/.test(q)
  ) {
    return "meditation_suitability";
  }

  if (
    /\b(am i suited to mantra|does mantra suit me|mantra suitability|should i chant mantra|mantra practice suit me|which practice suits me)\b/.test(q)
  ) {
    return "mantra_suitability";
  }

  if (
    /\b(guru pattern|guru connection|relationship with guru|do i need a guru|am i likely to have a guru|spiritual teacher pattern)\b/.test(q)
  ) {
    return "guru_pattern";
  }

  if (
    /\b(when will my spiritual growth deepen|when will i become more spiritual|when will spirituality increase|when will my spiritual life deepen|spiritual growth)\b/.test(q)
  ) {
    return "spiritual_growth";
  }

  if (
    /\b(spiritual timing|when is a good time for spiritual practice|when should i deepen my practice|when should i start serious sadhana)\b/.test(q)
  ) {
    return "spiritual_timing";
  }

  if (timeDirection === "identity") {
    return "spiritual_inclination";
  }

  if (timeDirection === "future") {
    return "spiritual_growth";
  }

  return "generic";
}
function detectHealthEventType(
  question: string,
  topic: AskSarathiDomain,
  timeDirection: TimeDirection
): HealthEventType {
  if (topic !== "health") {
    return "generic";
  }

  const q =
    question.toLowerCase().trim();

  // Permanent constitution
  if (
    /\b(health constitution|my constitution|overall health pattern|natural health pattern|health tendency|health tendencies)\b/.test(q)
  ) {
    return "health_constitution";
  }

  // Permanent sensitivities
  if (
    /\b(health sensitivities|health sensitivity|what am i sensitive to|weak health areas|vulnerable health areas|recurring health issues|recurring health pattern)\b/.test(q)
  ) {
    return "health_sensitivity";
  }

  // Permanent stress pattern
  if (
    /\b(stress pattern|why do i get stressed|why am i stressed easily|why do i feel stressed|why do i overreact to stress|stress sensitivity)\b/.test(q)
  ) {
    return "stress_pattern";
  }

  // Permanent recovery capacity
  if (
    /\b(recovery capacity|how resilient is my health|health resilience|do i recover quickly|how well do i recover|recovery pattern)\b/.test(q)
  ) {
    return "recovery_capacity";
  }

  // Permanent lifestyle pattern
  if (
    /\b(lifestyle pattern|what lifestyle suits me|best lifestyle for my health|health routine|what routine suits my health|how should i manage my health)\b/.test(q)
  ) {
    return "lifestyle_pattern";
  }

  // Recovery timing
  if (
    /\b(when will my health improve|when will i recover|when will recovery happen|health recovery|recovery timing)\b/.test(q)
  ) {
    return "health_recovery";
  }

  // Check-up / caution period
  if (
    /\b(health checkup|should i get checked|sensitive health period|health caution period|should i be careful about my health)\b/.test(q)
  ) {
    return "health_checkup";
  }

  // General health timing
  if (
    /\b(health timing|when is my health sensitive|when will health improve|when should i be more careful about health)\b/.test(q)
  ) {
    return "health_timing";
  }

  if (timeDirection === "identity") {
    return "health_constitution";
  }

  if (timeDirection === "future") {
    return "health_timing";
  }

  return "generic";
}
function detectChildrenEventType(
  question: string,
  topic: AskSarathiDomain,
  timeDirection: TimeDirection
): ChildrenEventType {
  if (topic !== "child") {
    return "generic";
  }

  const q =
    question.toLowerCase().trim();

  // Permanent parenthood potential
  if (
    /\b(am i suited to parenthood|am i suitable for parenthood|would i be a good parent|parenthood potential|am i meant to be a parent|parenting potential)\b/.test(q)
  ) {
    return "parenthood_potential";
  }

  // Permanent parenting style
  if (
    /\b(what kind of parent am i|what kind of parent will i be|parenting style|how will i parent|what is my parenting style)\b/.test(q)
  ) {
    return "parenting_style";
  }

  // Permanent parent-child relationship pattern
  if (
    /\b(why is my relationship with my child difficult|why do i struggle with my child|relationship with my child|child relationship pattern|parent child relationship|parent-child relationship)\b/.test(q)
  ) {
    return "child_relationship_pattern";
  }

  // Child aptitude / natural strengths
  if (
    /\b(what are my child's strengths|what are my childs strengths|what is my child good at|what will my child be good at|child aptitude|child's natural abilities|childs natural abilities)\b/.test(q)
  ) {
    return "child_aptitude";
  }

  // Conception timing
  if (
    /\b(when will i conceive|when am i likely to conceive|when can i conceive|conception timing|when is pregnancy likely|when will i get pregnant)\b/.test(q)
  ) {
    return "conception_timing";
  }

  // Childbirth timing
  if (
    /\b(when will i have a child|when will i have children|when will childbirth happen|childbirth timing|when is childbirth likely|when will i become a parent)\b/.test(q)
  ) {
    return "childbirth_timing";
  }

  // Child-development timing
  if (
    /\b(when will my child improve|when will my child become more settled|child development timing|when will things improve for my child|when will my child's development improve|when will my childs development improve)\b/.test(q)
  ) {
    return "child_development_timing";
  }

  if (timeDirection === "identity") {
    return "parenthood_potential";
  }

  if (timeDirection === "future") {
    return "childbirth_timing";
  }

  return "generic";
}
function detectPropertyEventType(
  question: string,
  topic: AskSarathiDomain,
  timeDirection: TimeDirection
): PropertyEventType {
  if (topic !== "property") {
    return "generic";
  }

  const q =
    question.toLowerCase().trim();

  // Permanent property potential
  if (
    /\b(am i suited to property|am i suitable for property|do i have property potential|property potential|real estate potential|can i build property wealth)\b/.test(q)
  ) {
    return "property_potential";
  }

  // Permanent investment suitability
  if (
    /\b(am i suited to property investment|am i suitable for real estate investment|should i invest in property|property investment suitability|real estate investment suit me)\b/.test(q)
  ) {
    return "property_investment_suitability";
  }

  // Permanent property / home pattern
  if (
    /\b(property pattern|home pattern|why do i keep changing homes|why is property difficult for me|why do property matters become difficult|property issues keep repeating)\b/.test(q)
  ) {
    return "property_pattern";
  }

  // Permanent home stability
  if (
    /\b(home stability|am i likely to have a stable home|stable home pattern|settled home life|residential stability)\b/.test(q)
  ) {
    return "home_stability";
  }

  // Explicit selling
  if (
    /\b(sell|selling|dispose|exit property|sell my property|sell my house|sell my home)\b/.test(q)
  ) {
    return "sell_property";
  }

  // Moving home
  if (
    /\b(move home|move house|shift home|change home|relocate home|move residence)\b/.test(q)
  ) {
    return "move_home";
  }

  // Explicit timing
  if (
    /\b(when should i buy property|when will i buy property|when can i buy a house|when should i invest in property|property timing|when is a good time to buy property)\b/.test(q)
  ) {
    return "property_timing";
  }

  // Explicit purchase
  if (
    /\b(buy property|buy a house|buy a home|purchase property|purchase a house|purchase a home)\b/.test(q)
  ) {
    return "buy_property";
  }

  if (timeDirection === "identity") {
    return "property_potential";
  }

  if (timeDirection === "future") {
    return "property_timing";
  }

  return "generic";
}
function detectVehicleEventType(
  question: string,
  topic: AskSarathiDomain,
  timeDirection: TimeDirection
): VehicleEventType {
  if (topic !== "vehicle") {
    return "generic";
  }

  const q =
    question.toLowerCase().trim();

  // Permanent ownership potential
  if (
    /\b(do i have strong vehicle potential|vehicle ownership potential|am i likely to own good vehicles|vehicle potential|car ownership potential)\b/.test(q)
  ) {
    return "vehicle_potential";
  }

  // Permanent preference / suitability
  if (
    /\b(what kind of vehicle suits me|which car suits me|what car suits me|vehicle preference|what type of car suits me|which vehicle is suitable for me)\b/.test(q)
  ) {
    return "vehicle_preference";
  }

  // Permanent recurring pattern
  if (
    /\b(why do i keep changing cars|why do i change vehicles often|vehicle pattern|car pattern|why do vehicle issues repeat|why do i have repeated vehicle problems)\b/.test(q)
  ) {
    return "vehicle_pattern";
  }

  // Explicit upgrade
  if (
    /\b(upgrade my car|upgrade my vehicle|better car|bigger car|luxury car|should i upgrade|vehicle upgrade)\b/.test(q)
  ) {
    return "upgrade_vehicle";
  }

  // Explicit timing
  if (
    /\b(when should i buy a car|when should i buy a vehicle|when will i buy a car|when can i buy a car|vehicle timing|car purchase timing|when is a good time to buy a car)\b/.test(q)
  ) {
    return "vehicle_timing";
  }

  // Explicit purchase
  if (
    /\b(buy a car|buy a vehicle|purchase a car|purchase a vehicle|get a new car|get a new vehicle)\b/.test(q)
  ) {
    return "buy_vehicle";
  }

  if (timeDirection === "identity") {
    return "vehicle_potential";
  }

  if (timeDirection === "future") {
    return "vehicle_timing";
  }

  return "generic";
}
function detectRelocationEventType(
  question: string,
  topic: AskSarathiDomain,
  timeDirection: TimeDirection
): RelocationEventType {
  if (topic !== "relocation") {
    return "generic";
  }

  const q =
    question.toLowerCase().trim();

  // Permanent relocation potential
  if (
    /\b(am i suited to relocation|am i suitable for relocation|do i have relocation potential|relocation potential|am i likely to move often|strong relocation pattern)\b/.test(q)
  ) {
    return "relocation_potential";
  }

  // Permanent foreign settlement potential
  if (
    /\b(am i suited to living abroad|am i suitable for living abroad|foreign settlement potential|can i settle abroad|do i have foreign settlement potential|am i meant to live abroad)\b/.test(q)
  ) {
    return "foreign_settlement_potential";
  }

  // Permanent movement pattern
  if (
    /\b(why do i keep moving|why do i change places often|relocation pattern|movement pattern|why is my life so unsettled geographically|why do i keep changing cities)\b/.test(q)
  ) {
    return "relocation_pattern";
  }

  // Permanent location preference
  if (
    /\b(what kind of place suits me|which place suits me|what type of city suits me|location preference|where would i feel most settled|what environment suits me)\b/.test(q)
  ) {
    return "location_preference";
  }

  // Explicit foreign move
  if (
    /\b(move abroad|relocate abroad|foreign move|move overseas|settle abroad|go abroad|shift abroad)\b/.test(q)
  ) {
    return "foreign_move";
  }

  // Explicit local move
  if (
    /\b(move locally|move within the country|change city|shift city|local move|move to another city|relocate locally)\b/.test(q)
  ) {
    return "local_move";
  }

  // Explicit timing
  if (
    /\b(when will i relocate|when should i relocate|when will i move|when is a good time to relocate|relocation timing|when will i change location)\b/.test(q)
  ) {
    return "relocation_timing";
  }

  if (timeDirection === "identity") {
    return "relocation_potential";
  }

  if (timeDirection === "future") {
    return "relocation_timing";
  }

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
function detectDisputeEventType(
  question: string,
  topic: AskSarathiDomain,
  timeDirection: TimeDirection
): DisputeEventType {
  if (topic !== "disputes") {
    return "generic";
  }

  const q =
    question.toLowerCase().trim();

  // Permanent conflict pattern
  if (
    /\b(why do i keep getting into conflicts|why do disputes repeat|conflict pattern|dispute pattern|why do i attract conflict|why do arguments keep happening)\b/.test(q)
  ) {
    return "conflict_pattern";
  }

  // Permanent legal/dispute handling suitability
  if (
    /\b(am i good at handling disputes|am i suited to legal matters|am i suitable for litigation|legal suitability|dispute handling ability|am i good in conflicts)\b/.test(q)
  ) {
    return "legal_suitability";
  }

  // Permanent negotiation style
  if (
    /\b(negotiation style|how do i handle negotiation|am i good at negotiation|how do i resolve conflict|conflict resolution style)\b/.test(q)
  ) {
    return "negotiation_style";
  }

  // Permanent litigation tendency
  if (
    /\b(litigation pattern|do i have litigation in my chart|legal dispute pattern|court case tendency|do legal disputes repeat in my life)\b/.test(q)
  ) {
    return "litigation_pattern";
  }

  // Resolution timing
  if (
    /\b(when will this dispute resolve|when will the dispute end|when will conflict resolve|dispute resolution|when will this matter settle)\b/.test(q)
  ) {
    return "dispute_resolution";
  }

  // Legal case timing
  if (
    /\b(when will my court case resolve|when will my legal case end|legal case timing|court case timing|when will the case move)\b/.test(q)
  ) {
    return "legal_case_timing";
  }

  // Settlement timing
  if (
    /\b(when will settlement happen|when is settlement likely|settlement timing|when should i settle|when will we reach settlement)\b/.test(q)
  ) {
    return "settlement_timing";
  }

  if (timeDirection === "identity") {
    return "conflict_pattern";
  }

  if (timeDirection === "future") {
    return "dispute_resolution";
  }

  return "generic";
}
function detectParentsEventType(
  question: string,
  topic: AskSarathiDomain,
  timeDirection: TimeDirection
): ParentsEventType {
  if (topic !== "parents") {
    return "generic";
  }

  const q = question.toLowerCase().trim();

  if (
    /\b(relationship with my parents|parent relationship|why is my relationship with my parents difficult|why do i struggle with my parents|parent relationship pattern)\b/.test(q)
  ) {
    return "parent_relationship_pattern";
  }

  if (
    /\b(relationship with my mother|mother relationship|why is my relationship with my mother difficult|mother pattern|maternal relationship)\b/.test(q)
  ) {
    return "mother_relationship";
  }

  if (
    /\b(relationship with my father|father relationship|why is my relationship with my father difficult|father pattern|paternal relationship)\b/.test(q)
  ) {
    return "father_relationship";
  }

  if (
    /\b(parental influence|how have my parents influenced me|parents influence|family influence|effect of my parents on me)\b/.test(q)
  ) {
    return "parental_influence";
  }

  if (
    /\b(family elder pattern|relationship with family elders|elder relationship|family elders)\b/.test(q)
  ) {
    return "family_elder_pattern";
  }

  if (
    /\b(when will my parents support me|when will parental support improve|parent support timing|when will family support improve)\b/.test(q)
  ) {
    return "parent_support_timing";
  }

  if (
    /\b(when will responsibility for my parents increase|parent responsibility timing|when will i need to take care of my parents|when will parental responsibility increase)\b/.test(q)
  ) {
    return "parent_responsibility_timing";
  }

  if (timeDirection === "identity") {
    return "parent_relationship_pattern";
  }

  if (timeDirection === "future") {
    return "parent_support_timing";
  }

  return "generic";
}
function detectSiblingsEventType(
  question: string,
  topic: AskSarathiDomain,
  timeDirection: TimeDirection
): SiblingsEventType {
  if (topic !== "siblings") {
    return "generic";
  }

  const q = question.toLowerCase().trim();

  if (
    /\b(relationship with my siblings|sibling relationship|why is my relationship with my sibling difficult|why do i struggle with my siblings|sibling relationship pattern)\b/.test(q)
  ) {
    return "sibling_relationship_pattern";
  }

  if (
    /\b(elder sibling|older sibling|older brother|older sister|elder brother|elder sister)\b/.test(q)
  ) {
    return "elder_sibling_pattern";
  }

  if (
    /\b(younger sibling|younger brother|younger sister)\b/.test(q)
  ) {
    return "younger_sibling_pattern";
  }

  if (
    /\b(will my sibling support me|sibling support|support from my brother|support from my sister|are my siblings supportive)\b/.test(q)
  ) {
    return "sibling_support";
  }

  if (
    /\b(when will conflict with my sibling end|when will sibling conflict improve|sibling conflict timing|when will things improve with my brother|when will things improve with my sister)\b/.test(q)
  ) {
    return "sibling_conflict_timing";
  }

  if (
    /\b(when will my sibling support me|when will sibling support improve|sibling support timing)\b/.test(q)
  ) {
    return "sibling_support_timing";
  }

  if (timeDirection === "identity") {
    return "sibling_relationship_pattern";
  }

  if (timeDirection === "future") {
    return "sibling_support_timing";
  }

  return "generic";
}
function detectTravelEventType(
  question: string,
  topic: AskSarathiDomain,
  timeDirection: TimeDirection
): TravelEventType {
  if (topic !== "travel") {
    return "generic";
  }

  const q = question.toLowerCase().trim();

  if (
    /\b(am i naturally inclined to travel|do i have strong travel potential|travel inclination|do i travel a lot|am i meant to travel)\b/.test(q)
  ) {
    return "travel_inclination";
  }

  if (
    /\b(foreign travel pattern|do i have foreign travel|overseas travel pattern|international travel potential|am i likely to travel abroad often)\b/.test(q)
  ) {
    return "foreign_travel_pattern";
  }

  if (
    /\b(why do i travel so much|why do i keep travelling|frequent travel pattern|why am i always travelling|constant travel)\b/.test(q)
  ) {
    return "frequent_travel_pattern";
  }

  if (
    /\b(pilgrimage pattern|am i suited to pilgrimage|does pilgrimage suit me|spiritual travel suit me|religious travel pattern)\b/.test(q)
  ) {
    return "pilgrimage_pattern";
  }

  if (
    /\b(when will i travel abroad|when will foreign travel happen|foreign travel timing|when can i travel overseas|when will i go overseas)\b/.test(q)
  ) {
    return "foreign_travel_timing";
  }

  if (
    /\b(when should i go on pilgrimage|when will pilgrimage happen|pilgrimage timing|good time for pilgrimage)\b/.test(q)
  ) {
    return "pilgrimage_timing";
  }

  if (
    /\b(when will i travel|when should i travel|travel timing|when is a good time to travel|when will my trip happen)\b/.test(q)
  ) {
    return "travel_timing";
  }

  if (timeDirection === "identity") {
    return "travel_inclination";
  }

  if (timeDirection === "future") {
    return "travel_timing";
  }

  return "generic";
}
function detectReputationEventType(
  question: string,
  topic: AskSarathiDomain,
  timeDirection: TimeDirection
): ReputationEventType {
  if (topic !== "reputation") {
    return "generic";
  }

  const q = question.toLowerCase().trim();

  if (
    /\b(do i have potential for recognition|do i have recognition potential|reputation potential|public recognition potential|fame potential|status potential)\b/.test(q)
  ) {
    return "reputation_potential";
  }

  if (
    /\b(how am i perceived publicly|public image|how do people see me|what is my public image|how am i seen professionally|reputation pattern)\b/.test(q)
  ) {
    return "public_image_pattern";
  }

  if (
    /\b(why do i struggle to get recognition|why am i not recognised|why am i not recognized|recognition pattern|why does recognition come late|why do others get credit)\b/.test(q)
  ) {
    return "recognition_pattern";
  }

  if (
    /\b(am i naturally visible|am i more private or visible|visibility style|public visibility|do i like recognition|am i suited to public roles)\b/.test(q)
  ) {
    return "visibility_style";
  }

  if (
    /\b(when will my reputation grow|when will my public image improve|reputation growth|when will my status improve|when will visibility increase)\b/.test(q)
  ) {
    return "reputation_growth";
  }

  if (
    /\b(when will i get recognition|when will i be recognised|when will i be recognized|recognition timing|when will i get visibility|when will i get public recognition)\b/.test(q)
  ) {
    return "recognition_timing";
  }

  if (
    /\b(when will my reputation recover|reputation recovery|when will my image improve|when will public perception improve|when will my name recover)\b/.test(q)
  ) {
    return "reputation_recovery";
  }

  if (timeDirection === "identity") {
    return "reputation_potential";
  }

  if (timeDirection === "future") {
    return "recognition_timing";
  }

  return "generic";
}
function detectDebtEventType(
  question: string,
  topic: AskSarathiDomain,
  timeDirection: TimeDirection
): DebtEventType {
  if (topic !== "debt") {
    return "generic";
  }

  const q = question.toLowerCase().trim();

  if (
    /\b(why do i keep getting into debt|debt pattern|why does debt keep returning|why do i struggle with debt|recurring debt)\b/.test(q)
  ) {
    return "debt_pattern";
  }

  if (
    /\b(am i prone to borrowing|borrowing tendency|do i borrow too much|am i likely to take loans|loan tendency|debt tendency)\b/.test(q)
  ) {
    return "borrowing_tendency";
  }

  if (
    /\b(am i good at repaying debt|repayment capacity|can i manage debt well|debt repayment ability|ability to repay loans)\b/.test(q)
  ) {
    return "repayment_capacity";
  }

  if (
    /\b(liability pattern|why do liabilities keep building|why do my liabilities increase|financial liabilities pattern|why do loans accumulate)\b/.test(q)
  ) {
    return "liability_pattern";
  }

  if (
    /\b(when will my debt reduce|when will debt decrease|debt reduction|when will i become debt free|when will loans reduce)\b/.test(q)
  ) {
    return "debt_reduction";
  }

  if (
    /\b(when should i take a loan|when is a good time for a loan|loan timing|when can i borrow|when should i borrow)\b/.test(q)
  ) {
    return "loan_timing";
  }

  if (
    /\b(when should i repay debt|when is a good time to repay|repayment timing|when will i repay my loan|when will my loan be repaid)\b/.test(q)
  ) {
    return "repayment_timing";
  }

  if (timeDirection === "identity") {
    return "debt_pattern";
  }

  if (timeDirection === "future") {
    return "debt_reduction";
  }

  return "generic";
}
function detectInheritanceEventType(
  question: string,
  topic: AskSarathiDomain,
  timeDirection: TimeDirection
): InheritanceEventType {
  if (topic !== "inheritance") {
    return "generic";
  }

  const q = question.toLowerCase().trim();

  if (
    /\b(do i have inheritance potential|inheritance potential|am i likely to receive inheritance|legacy potential|ancestral wealth potential)\b/.test(q)
  ) {
    return "inheritance_potential";
  }

  if (
    /\b(ancestral pattern|ancestral family pattern|family karma around inheritance|ancestral wealth pattern|inheritance from ancestors)\b/.test(q)
  ) {
    return "ancestral_pattern";
  }

  if (
    /\b(legacy pattern|family legacy|wealth legacy|what kind of legacy do i inherit|legacy influence)\b/.test(q)
  ) {
    return "legacy_pattern";
  }

  if (
    /\b(why are inheritance matters difficult|inheritance conflict pattern|family dispute over inheritance|inheritance disputes|why is inheritance complicated in my family)\b/.test(q)
  ) {
    return "inheritance_conflict_pattern";
  }

  if (
    /\b(when will i receive inheritance|when am i likely to receive inheritance|inheritance timing|when will inheritance come|when will ancestral property come to me)\b/.test(q)
  ) {
    return "inheritance_timing";
  }

  if (
    /\b(when will inheritance settle|when will the estate settle|inheritance settlement|estate settlement timing|when will probate finish)\b/.test(q)
  ) {
    return "inheritance_settlement";
  }

  if (
    /\b(when will legacy transfer happen|legacy transfer timing|when will assets be transferred|when will ancestral assets transfer)\b/.test(q)
  ) {
    return "legacy_transfer_timing";
  }

  if (timeDirection === "identity") {
    return "inheritance_potential";
  }

  if (timeDirection === "future") {
    return "inheritance_timing";
  }

  return "generic";
}
function detectMentalHealthEventType(
  question: string,
  topic: AskSarathiDomain,
  timeDirection: TimeDirection
): MentalHealthEventType {
  if (topic !== "mental_health") {
    return "generic";
  }

  const q = question.toLowerCase().trim();

  if (
    /\b(mental emotional pattern|mental pattern|emotional pattern|why do i feel mentally overwhelmed|why do i feel emotionally overwhelmed)\b/.test(q)
  ) {
    return "mental_emotional_pattern";
  }

  if (
    /\b(why do i overthink|overthinking pattern|why is my mind always active|why can't i stop thinking|why can i not stop thinking|mental restlessness)\b/.test(q)
  ) {
    return "overthinking_pattern";
  }

  if (
    /\b(why am i emotionally sensitive|mood sensitivity|why are my moods sensitive|why do things affect me deeply|emotional sensitivity)\b/.test(q)
  ) {
    return "mood_sensitivity";
  }

  if (
    /\b(how resilient am i under stress|stress resilience|mental resilience|how do i handle stress|why does stress affect me so much)\b/.test(q)
  ) {
    return "stress_resilience";
  }

  if (
    /\b(why do my moods fluctuate|emotional regulation pattern|why do my emotions fluctuate|why is it hard to regulate my emotions|emotional regulation)\b/.test(q)
  ) {
    return "emotional_regulation_pattern";
  }

  if (
    /\b(when will i feel mentally better|when will my mental health improve|mental health recovery|when will i feel emotionally better|when will my mind feel calmer)\b/.test(q)
  ) {
    return "mental_health_recovery";
  }

  if (
    /\b(is this a mentally sensitive period|mental health timing|when is my mind more sensitive|when should i be more careful mentally|mental sensitivity period)\b/.test(q)
  ) {
    return "mental_health_timing";
  }

  if (
    /\b(when will i get more emotional support|when will support improve|support timing|when will i feel more supported)\b/.test(q)
  ) {
    return "support_timing";
  }

  if (timeDirection === "identity") {
    return "mental_emotional_pattern";
  }

  if (timeDirection === "future") {
    return "mental_health_timing";
  }

  return "generic";
}
function detectPetsEventType(
  question: string,
  topic: AskSarathiDomain
): PetsEventType {
  if (topic !== "pets") {
    return "generic";
  }

  const q = question.toLowerCase().trim();

  if (
    /\b(relationship with my pet|pet relationship|bond with my pet|why am i so attached to my pet|pet bond)\b/.test(q)
  ) {
    return "pet_relationship_pattern";
  }

  if (
    /\b(pet caregiving style|how do i care for pets|what kind of pet owner am i|pet owner style|caregiving with animals)\b/.test(q)
  ) {
    return "pet_caregiving_style";
  }

  if (
    /\b(pet responsibility pattern|why do pets become a responsibility for me|responsibility for animals|pet responsibility)\b/.test(q)
  ) {
    return "pet_responsibility_pattern";
  }

  return "pet_relationship_pattern";
}
function detectInnerEventType(
  question: string,
  topic: AskSarathiDomain
): InnerEventType {
  if (topic !== "inner") {
    return "generic";
  }

  const q = question.toLowerCase().trim();

  if (
    /\b(what direction should my life take|life direction|why do i feel directionless|where is my life going|what direction suits me)\b/.test(q)
  ) {
    return "life_direction_pattern";
  }

  if (
    /\b(what is my purpose|life purpose|purpose pattern|what am i meant to do|what gives my life purpose)\b/.test(q)
  ) {
    return "purpose_pattern";
  }

  if (
    /\b(inner conflict|why do i feel conflicted inside|why am i internally confused|inner struggle|internal conflict)\b/.test(q)
  ) {
    return "inner_conflict_pattern";
  }

  if (
    /\b(understand myself|self understanding|why am i like this|what is my inner nature|who am i really)\b/.test(q)
  ) {
    return "self_understanding_pattern";
  }

  if (
    /\b(meaning of my life|why does life feel meaningless|meaning pattern|what gives my life meaning|searching for meaning)\b/.test(q)
  ) {
    return "meaning_pattern";
  }

  return "self_understanding_pattern";
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

    if (careerEventType === "job_change") {
  return "The current period is not strong enough for me to call an immediate job change, but a more supportive career-movement phase is approaching.";
}

if (careerEventType === "promotion") {
  return "The current period is not strong enough for me to call an immediate promotion, but a more supportive recognition and advancement phase is approaching.";
}

if (careerEventType === "internal_shift") {
  return "The current period is not strong enough for me to call an immediate internal move, but the chart shows a more supportive phase for role discussions and restructuring ahead.";
}

return "The current period is not strong enough for me to call an immediate career change, but a more supportive professional phase is approaching.";
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
  if (eventType === "reconciliation") {
    return "renewed contact, emotional reopening, conversation, clarification, or movement toward reconnecting";
  }

  if (eventType === "meeting_partner") {
    return "meeting someone significant, introductions, attraction, or early relationship development";
  }

  if (eventType === "new_relationship") {
    return "new introductions, dating activity, attraction, communication, or movement toward a new relationship";
  }

  if (eventType === "marriage_commitment") {
    return "commitment discussions, relationship definition, family involvement, engagement, or movement toward marriage";
  }

  return "relationship discussions, emotional clarification, new introductions, commitment development, or movement in an existing bond";
}

if (topic === "marriage") {
  if (eventType === "marriage_timing") {
    return "commitment discussions, family involvement, engagement, wedding planning, or movement toward marriage";
  }

  if (eventType === "marriage_commitment") {
    return "formal commitment, engagement, family discussions, agreement, or movement toward marriage";
  }

  return "commitment development, family discussions, relationship formalisation, or movement toward marriage";
}
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
function normalizeRankedTimingWindow(
  window: any
): RankedTimingWindow | null {
  if (!window?.label) {
    return null;
  }

  return {
    label: String(window.label),

    start:
      window.start ??
      window.from ??
      window.startISO ??
      null,

    end:
      window.end ??
      window.to ??
      window.endISO ??
      null,

    peak:
      window.peak ??
      null,

    why: Array.isArray(window.why)
      ? window.why.map(String)
      : [],

    dashaLord:
      window.dashaLord ??
      null,

    dashaLevel:
      window.dashaLevel ??
      null,

    dashaChainLabel:
      window.dashaChainLabel ??
      null,

    score:
      typeof window.score === "number"
        ? window.score
        : 0,

    confidence:
      window.confidence === "high" ||
      window.confidence === "medium" ||
      window.confidence === "low"
        ? window.confidence
        : "low",

    windowClass:
      window.windowClass ??
      "movement",

    practicalMeaning:
      window.practicalMeaning ??
      "Use this as activation timing, not a guaranteed outcome.",
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
      sambandhaReasons:
    astroBundle.sambandhaAnalysis.bullets,

  sambandhaVerdict:
    astroBundle.sambandhaAnalysis.verdict,

  sambandhaScore:
    astroBundle.sambandhaAnalysis.conversionScore,
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
function getActiveDashaAnyShape(
  report: any
): {
  md: string | null;
  ad: string | null;
  pd: string | null;
  line: string | null;
  ranges: {
    md: string | null;
    ad: string | null;
    pd: string | null;
  };
} {
  const source =
    report ?? {};

  const activePeriods =
    source?.activePeriods ??
    source?.dasha?.activePeriods ??
    source?.timing?.activePeriods ??
    source?.timing?.dasha?.activePeriods ??
    source?.chartContext?.activePeriods ??
    source?.chartContext?.dasha?.activePeriods ??
    {};

  const activeDasha =
    source?.activeDasha ??
    source?.currentDasha ??
    source?.dasha?.current ??
    source?.timing?.dasha?.current ??
    source?.chartContext?.currentDasha ??
    source?.chartContext?.dasha?.current ??
    {};

  const md =
    safePlanetName(
      activePeriods?.mahadasha?.lord ??
      activePeriods?.mahadasha?.planet ??
      activePeriods?.md?.lord ??
      activePeriods?.md?.planet ??
      activeDasha?.md ??
      activeDasha?.mdLord ??
      activeDasha?.mahadasha?.lord ??
      activeDasha?.mahadasha ??
      source?.md ??
      source?.mdLord
    ) ?? null;

  const ad =
    safePlanetName(
      activePeriods?.antardasha?.lord ??
      activePeriods?.antardasha?.subLord ??
      activePeriods?.antardasha?.planet ??
      activePeriods?.ad?.lord ??
      activePeriods?.ad?.planet ??
      activeDasha?.ad ??
      activeDasha?.adLord ??
      activeDasha?.antardasha?.lord ??
      activeDasha?.antardasha?.subLord ??
      activeDasha?.antardasha ??
      source?.ad ??
      source?.adLord
    ) ?? null;

  const pd =
    safePlanetName(
      activePeriods?.pratyantardasha?.lord ??
      activePeriods?.pratyantardasha?.subLord ??
      activePeriods?.pratyantardasha?.planet ??
      activePeriods?.pd?.lord ??
      activePeriods?.pd?.planet ??
      activeDasha?.pd ??
      activeDasha?.pdLord ??
      activeDasha?.pratyantardasha?.lord ??
      activeDasha?.pratyantardasha?.subLord ??
      activeDasha?.pratyantardasha ??
      activeDasha?.pratyantar ??
      source?.pd ??
      source?.pdLord
    ) ?? null;

  const line =
    [md, ad, pd]
      .filter(Boolean)
      .join(" • ") ||
    null;

  const formatRange = (
    period: any
  ): string | null => {
    const start =
      period?.start ??
      period?.from ??
      period?.startISO ??
      period?.fromISO ??
      null;

    const end =
      period?.end ??
      period?.to ??
      period?.endISO ??
      period?.toISO ??
      null;

    if (!start || !end) {
      return null;
    }

    return `${fmtDateShort(
      String(start)
    )} – ${fmtDateShort(
      String(end)
    )}`;
  };

  return {
    md,
    ad,
    pd,
    line,

    ranges: {
      md:
        formatRange(
          activePeriods?.mahadasha ??
          activePeriods?.md
        ),

      ad:
        formatRange(
          activePeriods?.antardasha ??
          activePeriods?.ad
        ),

      pd:
        formatRange(
          activePeriods?.pratyantardasha ??
          activePeriods?.pd
        ),
    },
  };
}

function detectTopic(question: string): AskSarathiDomain {
  const q = question.toLowerCase().trim();

  if (/\b(education|study|studies|exam|college|university|degree|learning)\b/.test(q)) return "education";
  if (
  /\b(become a father|become father|became a father|became father|become a mother|become mother|became a mother|became mother|parenthood|pregnancy|conceive|conception|have a baby|have a child)\b/.test(q)
) {
  return "child";
}
  if (/\b(mother|father|parents|parent|family elder)\b/.test(q)) return "parents";
  if (/\b(brother|sister|sibling|siblings)\b/.test(q)) return "siblings";
  if (/\b(business|startup|entrepreneur|self employed|own business|partnership business)\b/.test(q)) return "business";
  if (/\b(travel|trip|journey|visa|overseas travel|pilgrimage)\b/.test(q)) return "travel";
  if (/\b(spiritual|sadhana|mantra|meditation|moksha|guru|temple)\b/.test(q)) return "spiritual";
  if (/\b(reputation|fame|recognition|public image|status|visibility)\b/.test(q)) return "reputation";
  if (/\b(loan|debt|emi|mortgage|liability|borrowing|repayment)\b/.test(q)) return "debt";
  // Cross-domain: relocation impact on career/work
if (
  /\b(relocation|relocate|moving abroad|move abroad|another country|foreign move)\b/.test(q) &&
  /\b(career|job|work|profession|employment)\b/.test(q)
) {
  return "relocation";
}
// Broad business / entrepreneurship intent
if (
  /\b(entrepreneur|entrepreneurship|business|own company|own business|work for myself|working for myself|self employment|self-employment|self employed|self-employed|running a business|run a business|run my own company|build my own business|start something of my own|something of my own|business partner|business partnership|clients|customers|customer numbers|client numbers|customer base|client base|scale my business)\b/.test(q)
) {
  return "business";
}
  if (
  /\b(profession|career|occupation|vocational|vocation|professional path|career path|field of work|line of work|resign|resignation|promotion|promotions|promoted|job|employment|employer|company|work)\b/i.test(q) &&
  !/\b(spouse|husband|wife|partner|boyfriend|girlfriend|child|son|daughter)\b/i.test(q)
) {
  return "career";
}
  if (
  /\b(inheritance|legacy|ancestral|insurance settlement|inherit|inherited|legal will|last will|family will|testament)\b/.test(q)
) {
  return "inheritance";
}
  if (
  /\b(anxiety|depression|mental health|overthinking|restless|panic|mood|mentally exhausted|mental exhaustion|mental fatigue|emotionally exhausted)\b/.test(q)
) {
  return "mental_health";
}
  if (/\b(pet|dog|cat|animal)\b/.test(q)) return "pets";

  if (/\b(marriage|married|spouse|wedding)\b/.test(q)) {
    return "marriage";
  }

  if (/\b(relationship|partner|love|boyfriend|girlfriend|meet someone|meet somebody|dating|date someone|new person|someone new)\b/.test(q)) {
  return "relationships";
}

  if (
  /\b(job|career|profession|promotion|promoted|work|boss|get promoted|role change|switch job|change my job|astrologer|teacher|software engineer|software developer|banker|doctor|physician|lawyer|attorney|politician|consultant|researcher|psychologist|accountant|journalist|writer|salesperson|sales person|architect|designer|scientist|military officer|army officer|spiritual teacher)\b/.test(
    q
  )
) {
  return "career";
}

 if (
  /\b(money|wealth|income|finance|financial|finances|salary|bonus|rich|wealthy)\b/.test(q)
) {
  return "money";
}

  if (/\b(property|house|home|flat|land|plot|real estate)\b/.test(q)) {
    return "property";
  }

  if (/\b(relocation|relocate|move|abroad|foreign)\b/.test(q)) {
    return "relocation";
  }

if (
  /\b(child|children|baby|pregnancy|conceive|conception|parenthood)\b/.test(q)
) {
  return "child";
}

 if (
  /\b(health|body|illness|recovery|stress|sleep|vitality|physical wellbeing|physical well-being)\b/.test(q)
) {
  return "health";
}

  if (/\b(vehicle|car|bike|automobile)\b/.test(q)) {
    return "vehicle";
  }

  if (/\b(dispute|legal|court|case|conflict)\b/.test(q)) {
    return "disputes";
  }

if (
  /\b(purpose|meaning|inner|direction|lost|confused|holding me back|holds me back|self understanding|life direction|what should i focus on|what should my focus be|focus on over the next|focus on in the next)\b/.test(q)
) {
  return "inner";
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
    /\bwhy is\b|\bwhy am i\b|\bwhy does\b|\bwhy stuck\b|\bwhy delayed\b|\bwhat is happening\b/.test(q) ||
    /\bwhy\b.*\b(stuck|delayed|struggling|failing|not improving|not working|exhausted)\b/.test(q) ||
    /\b(feeling stuck|feel stuck|stuck in my career|career feels stuck|career is stuck)\b/.test(q)
  ) {
    return "diagnosis";
  }

  // TYPE PROFILE: used for "what kind/type" outputs, not diagnostic risk/blocker questions.
  if (
    /\bwhat kind\b|\bwhich type\b|\bwhat type\b|\bwhich one\b|\bwhat car\b|\bwhich car\b|\bwhat house\b|\bwhich house\b|\bwhat job\b|\bwhich career\b/.test(q)
  ) {
    return "type_profile";
  }
// Career suitability / profession identity
if (
  /\b(what profession suits me|which profession suits me|what career suits me|which career suits me|what field suits me|which field suits me)\b/.test(q)
) {
  return "decision";
}
if (
  /\bcompare\b|\bvs\b|\bversus\b|\bor wait\b|\bor stay\b|\bor switch\b|\bstay employed\b|\bbusiness or job\b|\bjob or business\b|\bemployment or business\b|\bbusiness or salary\b|\bsalary or business\b/.test(q)
) {
  return "comparison";
}

  if (
    /\bwhen\b|\bwhich month\b|\bwhich year\b|\btiming\b|\bwindow\b|\bdate\b/.test(q)
  ) {
    return "timing";
  }

 if (
  /\bshould i\b|\bcan i\b|\bis it good to\b|\bis this a good time\b|\bam i suited for\b|\bam i suitable for\b/.test(q)
) {
  return "decision";
}

  if (
  /^will\b|\bwill i\b|\bwill my\b|\bis it likely\b|\bcan this happen\b/.test(q)
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
// Avoid standalone "married" because it also appears in future
// questions such as "When will I get married?"
// past questions
if (
  /\b(when did|when was|what year did|in which year did|have i already|did i already|past|earlier|previously|got married)\b/.test(q)
) {
  return "past";
}

  // future questions
  // keep this before present so "when will" always wins
 if (
  /^will\b/.test(q) ||
  /\b(when will|upcoming|future|next|later|going to|get promoted|promotion|change my job|job change|switch job|switch my job)\b/.test(q)
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
const RELATIONSHIP_EVENT_RULES: Partial<
  Record<
    RelationshipEventType,
    {
      houses: number[];
      supportHouses: number[];
      karakas: string[];
      divisionalCharts: string[];
    }
  >
> = {
  relationship_suitability: {
    houses: [7],
    supportHouses: [2, 4, 5, 8, 11],
    karakas: ["Venus", "Jupiter", "Moon"],
    divisionalCharts: ["D9"],
  },

  partner_profile: {
    houses: [7],
    supportHouses: [1, 5, 9, 11],
    karakas: ["Venus", "Jupiter", "Moon"],
    divisionalCharts: ["D9"],
  },

  relationship_pattern: {
    houses: [7],
    supportHouses: [1, 4, 5, 8, 12],
    karakas: ["Venus", "Moon", "Mars", "Saturn"],
    divisionalCharts: ["D9"],
  },

  love_vs_arranged: {
    houses: [5, 7],
    supportHouses: [2, 9, 11],
    karakas: ["Venus", "Moon", "Jupiter", "Rahu"],
    divisionalCharts: ["D9"],
  },

  new_relationship: {
    houses: [5, 7],
    supportHouses: [11],
    karakas: ["Venus", "Moon", "Jupiter"],
    divisionalCharts: ["D9"],
  },

  meeting_partner: {
    houses: [5, 7],
    supportHouses: [9, 11],
    karakas: ["Venus", "Jupiter", "Moon"],
    divisionalCharts: ["D9"],
  },

  reconciliation: {
    houses: [5, 7],
    supportHouses: [4, 8, 11],
    karakas: ["Venus", "Moon", "Mercury"],
    divisionalCharts: ["D9"],
  },

  marriage_commitment: {
    houses: [7],
    supportHouses: [2, 8, 11],
    karakas: ["Venus", "Jupiter"],
    divisionalCharts: ["D9"],
  },

  marriage_timing: {
    houses: [7],
    supportHouses: [2, 5, 8, 11],
    karakas: ["Venus", "Jupiter"],
    divisionalCharts: ["D9"],
  },
};
const WEALTH_EVENT_RULES: Partial<
  Record<
    WealthEventType,
    {
      houses: number[];
      supportHouses: number[];
      karakas: string[];
      divisionalCharts: string[];
    }
  >
> = {
  wealth_potential: {
    houses: [2, 11],
    supportHouses: [5, 9],
    karakas: ["Jupiter", "Venus", "Mercury"],
    divisionalCharts: ["D2"],
  },

  earning_style: {
    houses: [2, 10, 11],
    supportHouses: [3, 5, 6],
    karakas: ["Mercury", "Jupiter", "Venus"],
    divisionalCharts: ["D2", "D10"],
  },

  wealth_pattern: {
    houses: [2, 11],
    supportHouses: [5, 8, 12],
    karakas: ["Jupiter", "Venus", "Saturn"],
    divisionalCharts: ["D2"],
  },

  saving_capacity: {
    houses: [2],
    supportHouses: [4, 11, 12],
    karakas: ["Jupiter", "Saturn", "Venus"],
    divisionalCharts: ["D2"],
  },

  investment_suitability: {
    houses: [2, 5, 8, 11],
    supportHouses: [9],
    karakas: ["Mercury", "Jupiter", "Rahu"],
    divisionalCharts: ["D2"],
  },

  multiple_income: {
    houses: [2, 3, 11],
    supportHouses: [5, 7, 10],
    karakas: ["Mercury", "Jupiter", "Rahu"],
    divisionalCharts: ["D2", "D10"],
  },

  salary_increase: {
    houses: [2, 6, 10, 11],
    supportHouses: [9],
    karakas: ["Jupiter", "Sun", "Mercury"],
    divisionalCharts: ["D2", "D10"],
  },

  bonus: {
    houses: [2, 5, 11],
    supportHouses: [8],
    karakas: ["Jupiter", "Venus"],
    divisionalCharts: ["D2"],
  },

  side_income: {
    houses: [2, 3, 7, 11],
    supportHouses: [5, 10],
    karakas: ["Mercury", "Jupiter", "Rahu"],
    divisionalCharts: ["D2", "D10"],
  },

  financial_improvement: {
    houses: [2, 11],
    supportHouses: [5, 9, 10],
    karakas: ["Jupiter", "Venus"],
    divisionalCharts: ["D2"],
  },

  wealth_timing: {
    houses: [2, 11],
    supportHouses: [5, 9],
    karakas: ["Jupiter", "Venus"],
    divisionalCharts: ["D2"],
  },
};
const BUSINESS_EVENT_RULES: Partial<
  Record<
    BusinessEventType,
    {
      houses: number[];
      supportHouses: number[];
      karakas: string[];
      divisionalCharts: string[];
    }
  >
> = {
  business_suitability: {
    houses: [7, 10],
    supportHouses: [2, 3, 5, 11],
    karakas: ["Mercury", "Mars", "Jupiter", "Saturn"],
    divisionalCharts: ["D10"],
  },

  business_style: {
    houses: [3, 7, 10],
    supportHouses: [2, 5, 11],
    karakas: ["Mercury", "Mars", "Jupiter", "Venus"],
    divisionalCharts: ["D10"],
  },

  business_vs_job: {
    houses: [6, 7, 10],
    supportHouses: [2, 3, 11],
    karakas: ["Mercury", "Mars", "Saturn", "Jupiter"],
    divisionalCharts: ["D10"],
  },

  partnership_suitability: {
    houses: [7],
    supportHouses: [2, 3, 8, 11],
    karakas: ["Mercury", "Venus", "Jupiter", "Saturn"],
    divisionalCharts: ["D10"],
  },

  entrepreneurial_pattern: {
    houses: [3, 7, 10],
    supportHouses: [1, 2, 5, 11],
    karakas: ["Mars", "Mercury", "Jupiter", "Rahu"],
    divisionalCharts: ["D10"],
  },

  business_launch: {
    houses: [3, 7, 10, 11],
    supportHouses: [2, 5, 9],
    karakas: ["Mercury", "Mars", "Jupiter"],
    divisionalCharts: ["D10"],
  },

  business_growth: {
    houses: [7, 10, 11],
    supportHouses: [2, 3, 5, 9],
    karakas: ["Jupiter", "Mercury", "Venus"],
    divisionalCharts: ["D10"],
  },

  client_growth: {
    houses: [7, 11],
    supportHouses: [3, 10],
    karakas: ["Mercury", "Venus", "Jupiter"],
    divisionalCharts: ["D10"],
  },

  partnership_timing: {
    houses: [7],
    supportHouses: [2, 8, 10, 11],
    karakas: ["Mercury", "Venus", "Jupiter", "Saturn"],
    divisionalCharts: ["D10"],
  },

  business_timing: {
    houses: [3, 7, 10, 11],
    supportHouses: [2, 5, 9],
    karakas: ["Mercury", "Mars", "Jupiter"],
    divisionalCharts: ["D10"],
  },
};
const EDUCATION_EVENT_RULES: Partial<
  Record<
    EducationEventType,
    {
      houses: number[];
      supportHouses: number[];
      karakas: string[];
      divisionalCharts: string[];
    }
  >
> = {
  education_suitability: {
    houses: [4, 5],
    supportHouses: [2, 9],
    karakas: ["Mercury", "Jupiter", "Moon"],
    divisionalCharts: ["D24"],
  },

  subject_fit: {
    houses: [2, 4, 5],
    supportHouses: [3, 9, 10],
    karakas: ["Mercury", "Jupiter", "Moon"],
    divisionalCharts: ["D24"],
  },

  stream_choice: {
    houses: [4, 5],
    supportHouses: [2, 3, 9, 10],
    karakas: ["Mercury", "Jupiter", "Mars", "Venus"],
    divisionalCharts: ["D24"],
  },

  study_pattern: {
    houses: [4, 5],
    supportHouses: [1, 2, 3, 6],
    karakas: ["Mercury", "Moon", "Saturn"],
    divisionalCharts: ["D24"],
  },

  higher_education: {
    houses: [5, 9],
    supportHouses: [4, 12],
    karakas: ["Jupiter", "Mercury"],
    divisionalCharts: ["D24"],
  },

  exam_performance: {
    houses: [4, 5, 6],
    supportHouses: [3, 9],
    karakas: ["Mercury", "Jupiter", "Saturn"],
    divisionalCharts: ["D24"],
  },

  education_timing: {
    houses: [4, 5, 9],
    supportHouses: [3, 6],
    karakas: ["Mercury", "Jupiter"],
    divisionalCharts: ["D24"],
  },
};
const SPIRITUAL_EVENT_RULES: Partial<
  Record<
    SpiritualEventType,
    {
      houses: number[];
      supportHouses: number[];
      karakas: string[];
      divisionalCharts: string[];
    }
  >
> = {
  spiritual_inclination: {
    houses: [5, 9, 12],
    supportHouses: [4, 8],
    karakas: ["Jupiter", "Ketu", "Moon"],
    divisionalCharts: ["D20"],
  },

  spiritual_path: {
    houses: [5, 9, 12],
    supportHouses: [4, 8],
    karakas: ["Jupiter", "Ketu", "Moon", "Sun"],
    divisionalCharts: ["D20", "D9"],
  },

  devotional_style: {
    houses: [4, 5, 9],
    supportHouses: [12],
    karakas: ["Moon", "Jupiter", "Venus"],
    divisionalCharts: ["D20"],
  },

  meditation_suitability: {
    houses: [5, 8, 12],
    supportHouses: [4, 9],
    karakas: ["Moon", "Ketu", "Saturn", "Jupiter"],
    divisionalCharts: ["D20"],
  },

  mantra_suitability: {
    houses: [2, 5, 9, 12],
    supportHouses: [8],
    karakas: ["Mercury", "Jupiter", "Ketu"],
    divisionalCharts: ["D20"],
  },

  guru_pattern: {
    houses: [5, 9],
    supportHouses: [1, 12],
    karakas: ["Jupiter", "Sun", "Ketu"],
    divisionalCharts: ["D20", "D9"],
  },

  spiritual_growth: {
    houses: [5, 9, 12],
    supportHouses: [8],
    karakas: ["Jupiter", "Ketu", "Saturn"],
    divisionalCharts: ["D20"],
  },

  spiritual_timing: {
    houses: [5, 9, 12],
    supportHouses: [8],
    karakas: ["Jupiter", "Ketu", "Saturn"],
    divisionalCharts: ["D20"],
  },
};
const CHILD_EVENT_RULES: Partial<
  Record<
    ChildrenEventType,
    {
      houses: number[];
      supportHouses: number[];
      karakas: string[];
      divisionalCharts: string[];
    }
  >
> = {
  parenthood_potential: {
    houses: [5],
    supportHouses: [2, 9, 11],
    karakas: ["Jupiter", "Moon"],
    divisionalCharts: ["D7"],
  },

  parenting_style: {
    houses: [5],
    supportHouses: [1, 4, 9],
    karakas: ["Moon", "Jupiter", "Sun"],
    divisionalCharts: ["D7"],
  },

  child_relationship_pattern: {
    houses: [5],
    supportHouses: [1, 4, 9],
    karakas: ["Moon", "Jupiter", "Mercury", "Saturn"],
    divisionalCharts: ["D7"],
  },

  child_aptitude: {
    houses: [5],
    supportHouses: [2, 3, 4, 9],
    karakas: ["Mercury", "Jupiter", "Moon"],
    divisionalCharts: ["D7"],
  },

  conception_timing: {
    houses: [5],
    supportHouses: [2, 8, 9, 11],
    karakas: ["Jupiter", "Venus", "Moon"],
    divisionalCharts: ["D7"],
  },

  childbirth_timing: {
    houses: [5],
    supportHouses: [2, 8, 9, 11],
    karakas: ["Jupiter", "Moon", "Venus"],
    divisionalCharts: ["D7"],
  },

  child_development_timing: {
    houses: [5],
    supportHouses: [4, 9, 11],
    karakas: ["Jupiter", "Moon", "Mercury"],
    divisionalCharts: ["D7"],
  },
};
const HEALTH_EVENT_RULES: Partial<
  Record<
    HealthEventType,
    {
      houses: number[];
      supportHouses: number[];
      karakas: string[];
      divisionalCharts: string[];
    }
  >
> = {
  health_constitution: {
    houses: [1, 6],
    supportHouses: [8, 12],
    karakas: ["Sun", "Moon", "Saturn"],
    divisionalCharts: ["D6", "D30"],
  },

  health_sensitivity: {
    houses: [1, 6, 8],
    supportHouses: [12],
    karakas: ["Moon", "Saturn", "Mars", "Rahu", "Ketu"],
    divisionalCharts: ["D6", "D30"],
  },

  stress_pattern: {
    houses: [1, 4, 6],
    supportHouses: [8, 12],
    karakas: ["Moon", "Mercury", "Saturn"],
    divisionalCharts: ["D30"],
  },

  recovery_capacity: {
    houses: [1, 6],
    supportHouses: [5, 8, 11],
    karakas: ["Sun", "Jupiter", "Mars"],
    divisionalCharts: ["D6", "D30"],
  },

  lifestyle_pattern: {
    houses: [1, 6],
    supportHouses: [4, 5, 12],
    karakas: ["Sun", "Moon", "Saturn", "Mercury"],
    divisionalCharts: ["D6"],
  },

  health_recovery: {
    houses: [1, 6, 8],
    supportHouses: [5, 11],
    karakas: ["Sun", "Jupiter", "Mars"],
    divisionalCharts: ["D6", "D30"],
  },

  health_checkup: {
    houses: [1, 6, 8],
    supportHouses: [12],
    karakas: ["Moon", "Saturn", "Mars"],
    divisionalCharts: ["D6", "D30"],
  },

  health_timing: {
    houses: [1, 6, 8],
    supportHouses: [11, 12],
    karakas: ["Sun", "Moon", "Saturn", "Jupiter"],
    divisionalCharts: ["D6", "D30"],
  },
};
const PROPERTY_EVENT_RULES: Partial<
  Record<
    PropertyEventType,
    {
      houses: number[];
      supportHouses: number[];
      karakas: string[];
      divisionalCharts: string[];
    }
  >
> = {
  property_potential: {
    houses: [4],
    supportHouses: [2, 9, 11],
    karakas: ["Mars", "Venus", "Moon", "Jupiter"],
    divisionalCharts: ["D4"],
  },

  property_investment_suitability: {
    houses: [4, 5, 11],
    supportHouses: [2, 8, 9],
    karakas: ["Mars", "Jupiter", "Venus", "Mercury"],
    divisionalCharts: ["D4", "D2"],
  },

  property_pattern: {
    houses: [4],
    supportHouses: [2, 8, 12],
    karakas: ["Moon", "Mars", "Saturn", "Rahu"],
    divisionalCharts: ["D4"],
  },

  home_stability: {
    houses: [4],
    supportHouses: [1, 2, 9],
    karakas: ["Moon", "Venus", "Saturn"],
    divisionalCharts: ["D4"],
  },

  buy_property: {
    houses: [4, 11, 12],
    supportHouses: [2],
    karakas: ["Mars", "Venus", "Moon"],
    divisionalCharts: ["D4"],
  },

  sell_property: {
    houses: [4, 8, 12],
    supportHouses: [2, 11],
    karakas: ["Mars", "Saturn", "Mercury"],
    divisionalCharts: ["D4"],
  },

  move_home: {
    houses: [4, 12],
    supportHouses: [3, 9],
    karakas: ["Moon", "Rahu", "Saturn"],
    divisionalCharts: ["D4"],
  },

  property_timing: {
    houses: [4, 11, 12],
    supportHouses: [2, 9],
    karakas: ["Mars", "Venus", "Jupiter"],
    divisionalCharts: ["D4"],
  },
};
const VEHICLE_EVENT_RULES: Partial<
  Record<
    VehicleEventType,
    {
      houses: number[];
      supportHouses: number[];
      karakas: string[];
      divisionalCharts: string[];
    }
  >
> = {
  vehicle_potential: {
    houses: [4],
    supportHouses: [2, 11],
    karakas: ["Venus", "Mars", "Moon"],
    divisionalCharts: ["D16"],
  },

  vehicle_preference: {
    houses: [4],
    supportHouses: [2, 3, 11],
    karakas: ["Venus", "Mars", "Moon", "Mercury"],
    divisionalCharts: ["D16"],
  },

  vehicle_pattern: {
    houses: [4],
    supportHouses: [3, 8, 12],
    karakas: ["Venus", "Mars", "Saturn", "Rahu"],
    divisionalCharts: ["D16"],
  },

  buy_vehicle: {
    houses: [4, 11, 2],
    supportHouses: [12],
    karakas: ["Venus", "Mars"],
    divisionalCharts: ["D16"],
  },

  upgrade_vehicle: {
    houses: [4, 11, 2],
    supportHouses: [5, 12],
    karakas: ["Venus", "Mars", "Jupiter"],
    divisionalCharts: ["D16"],
  },

  vehicle_timing: {
    houses: [4, 11, 2],
    supportHouses: [12],
    karakas: ["Venus", "Mars", "Jupiter"],
    divisionalCharts: ["D16"],
  },
};
const RELOCATION_EVENT_RULES: Partial<
  Record<
    RelocationEventType,
    {
      houses: number[];
      supportHouses: number[];
      karakas: string[];
      divisionalCharts: string[];
    }
  >
> = {
  relocation_potential: {
    houses: [4, 9, 12],
    supportHouses: [3],
    karakas: ["Moon", "Rahu", "Saturn"],
    divisionalCharts: ["D4", "D9"],
  },

  foreign_settlement_potential: {
    houses: [9, 12, 4],
    supportHouses: [3, 7],
    karakas: ["Rahu", "Moon", "Saturn", "Jupiter"],
    divisionalCharts: ["D4", "D9"],
  },

  relocation_pattern: {
    houses: [4, 12],
    supportHouses: [3, 9],
    karakas: ["Moon", "Rahu", "Saturn"],
    divisionalCharts: ["D4"],
  },

  location_preference: {
    houses: [4],
    supportHouses: [1, 9, 12],
    karakas: ["Moon", "Venus", "Jupiter"],
    divisionalCharts: ["D4"],
  },

  foreign_move: {
    houses: [12, 9, 4],
    supportHouses: [3],
    karakas: ["Rahu", "Moon", "Saturn"],
    divisionalCharts: ["D4", "D9"],
  },

  local_move: {
    houses: [4, 3],
    supportHouses: [9, 12],
    karakas: ["Moon", "Mercury", "Saturn"],
    divisionalCharts: ["D4"],
  },

  relocation_timing: {
    houses: [4, 9, 12],
    supportHouses: [3],
    karakas: ["Moon", "Rahu", "Saturn", "Jupiter"],
    divisionalCharts: ["D4", "D9"],
  },
};
const DISPUTE_EVENT_RULES: Partial<
  Record<
    DisputeEventType,
    {
      houses: number[];
      supportHouses: number[];
      karakas: string[];
      divisionalCharts: string[];
    }
  >
> = {
  conflict_pattern: {
    houses: [6, 8],
    supportHouses: [3, 7, 12],
    karakas: ["Mars", "Saturn", "Rahu", "Mercury"],
    divisionalCharts: ["D6", "D30"],
  },

  legal_suitability: {
    houses: [6, 7, 8],
    supportHouses: [3, 9, 10],
    karakas: ["Mars", "Saturn", "Mercury", "Jupiter"],
    divisionalCharts: ["D6", "D10"],
  },

  negotiation_style: {
    houses: [3, 7],
    supportHouses: [6, 11],
    karakas: ["Mercury", "Venus", "Mars", "Jupiter"],
    divisionalCharts: ["D6"],
  },

  litigation_pattern: {
    houses: [6, 8],
    supportHouses: [7, 12],
    karakas: ["Mars", "Saturn", "Rahu", "Ketu"],
    divisionalCharts: ["D6", "D30"],
  },

  dispute_resolution: {
    houses: [6, 8, 11],
    supportHouses: [3, 7],
    karakas: ["Mars", "Saturn", "Mercury", "Jupiter"],
    divisionalCharts: ["D6"],
  },

  legal_case_timing: {
    houses: [6, 8, 11],
    supportHouses: [3, 7, 9],
    karakas: ["Mars", "Saturn", "Mercury", "Jupiter"],
    divisionalCharts: ["D6", "D30"],
  },

  settlement_timing: {
    houses: [6, 7, 11],
    supportHouses: [3, 8],
    karakas: ["Mercury", "Venus", "Jupiter", "Saturn"],
    divisionalCharts: ["D6"],
  },
};
const PARENTS_EVENT_RULES: Partial<
  Record<
    ParentsEventType,
    {
      houses: number[];
      supportHouses: number[];
      karakas: string[];
      divisionalCharts: string[];
    }
  >
> = {
  parent_relationship_pattern: {
    houses: [4, 9],
    supportHouses: [1, 10],
    karakas: ["Sun", "Moon", "Jupiter", "Saturn"],
    divisionalCharts: ["D12", "D9"],
  },

  mother_relationship: {
    houses: [4],
    supportHouses: [1, 9],
    karakas: ["Moon", "Venus", "Jupiter"],
    divisionalCharts: ["D12"],
  },

  father_relationship: {
    houses: [9],
    supportHouses: [1, 10],
    karakas: ["Sun", "Jupiter", "Saturn"],
    divisionalCharts: ["D12"],
  },

  parental_influence: {
    houses: [4, 9],
    supportHouses: [1, 10],
    karakas: ["Sun", "Moon", "Jupiter", "Saturn"],
    divisionalCharts: ["D12", "D9"],
  },

  family_elder_pattern: {
    houses: [9, 10],
    supportHouses: [4],
    karakas: ["Sun", "Jupiter", "Saturn"],
    divisionalCharts: ["D12"],
  },

  parent_support_timing: {
    houses: [4, 9],
    supportHouses: [1, 10, 11],
    karakas: ["Sun", "Moon", "Jupiter"],
    divisionalCharts: ["D12", "D9"],
  },

  parent_responsibility_timing: {
    houses: [4, 9],
    supportHouses: [6, 10, 12],
    karakas: ["Sun", "Moon", "Saturn"],
    divisionalCharts: ["D12"],
  },
};
const SIBLINGS_EVENT_RULES: Partial<
  Record<
    SiblingsEventType,
    {
      houses: number[];
      supportHouses: number[];
      karakas: string[];
      divisionalCharts: string[];
    }
  >
> = {
  sibling_relationship_pattern: {
    houses: [3, 11],
    supportHouses: [2, 6],
    karakas: ["Mars", "Mercury", "Moon"],
    divisionalCharts: ["D3"],
  },

  elder_sibling_pattern: {
    houses: [11],
    supportHouses: [3, 2],
    karakas: ["Saturn", "Jupiter", "Mercury"],
    divisionalCharts: ["D3"],
  },

  younger_sibling_pattern: {
    houses: [3],
    supportHouses: [11, 2],
    karakas: ["Mars", "Mercury", "Moon"],
    divisionalCharts: ["D3"],
  },

  sibling_support: {
    houses: [3, 11],
    supportHouses: [2, 6],
    karakas: ["Mars", "Mercury", "Jupiter"],
    divisionalCharts: ["D3"],
  },

  sibling_conflict_timing: {
    houses: [3, 6, 11],
    supportHouses: [8],
    karakas: ["Mars", "Mercury", "Saturn"],
    divisionalCharts: ["D3"],
  },

  sibling_support_timing: {
    houses: [3, 11],
    supportHouses: [2, 6],
    karakas: ["Mercury", "Jupiter", "Mars"],
    divisionalCharts: ["D3"],
  },
};
const TRAVEL_EVENT_RULES: Partial<
  Record<
    TravelEventType,
    {
      houses: number[];
      supportHouses: number[];
      karakas: string[];
      divisionalCharts: string[];
    }
  >
> = {
  travel_inclination: {
    houses: [3, 9, 12],
    supportHouses: [4],
    karakas: ["Moon", "Rahu", "Jupiter", "Mercury"],
    divisionalCharts: ["D9", "D4"],
  },

  foreign_travel_pattern: {
    houses: [9, 12],
    supportHouses: [3, 4],
    karakas: ["Rahu", "Moon", "Jupiter"],
    divisionalCharts: ["D9", "D4"],
  },

  frequent_travel_pattern: {
    houses: [3, 9, 12],
    supportHouses: [4],
    karakas: ["Moon", "Rahu", "Mercury", "Saturn"],
    divisionalCharts: ["D9", "D4"],
  },

  pilgrimage_pattern: {
    houses: [9, 12],
    supportHouses: [5],
    karakas: ["Jupiter", "Moon", "Ketu"],
    divisionalCharts: ["D9", "D20"],
  },

  travel_timing: {
    houses: [3, 9, 12],
    supportHouses: [4],
    karakas: ["Moon", "Rahu", "Jupiter"],
    divisionalCharts: ["D9", "D4"],
  },

  foreign_travel_timing: {
    houses: [9, 12],
    supportHouses: [3, 4],
    karakas: ["Rahu", "Moon", "Jupiter"],
    divisionalCharts: ["D9", "D4"],
  },

  pilgrimage_timing: {
    houses: [9, 12],
    supportHouses: [5],
    karakas: ["Jupiter", "Moon", "Ketu"],
    divisionalCharts: ["D9", "D20"],
  },
};
const REPUTATION_EVENT_RULES: Partial<
  Record<
    ReputationEventType,
    {
      houses: number[];
      supportHouses: number[];
      karakas: string[];
      divisionalCharts: string[];
    }
  >
> = {
  reputation_potential: {
    houses: [10, 11],
    supportHouses: [1, 5, 9],
    karakas: ["Sun", "Jupiter", "Rahu", "Saturn"],
    divisionalCharts: ["D10", "D9"],
  },

  public_image_pattern: {
    houses: [1, 10],
    supportHouses: [5, 9, 11],
    karakas: ["Sun", "Moon", "Rahu", "Mercury"],
    divisionalCharts: ["D10", "D9"],
  },

  recognition_pattern: {
    houses: [10, 11],
    supportHouses: [1, 5, 9],
    karakas: ["Sun", "Saturn", "Jupiter", "Rahu"],
    divisionalCharts: ["D10", "D9"],
  },

  visibility_style: {
    houses: [1, 10, 11],
    supportHouses: [3, 5, 9],
    karakas: ["Sun", "Rahu", "Mercury", "Moon"],
    divisionalCharts: ["D10"],
  },

  reputation_growth: {
    houses: [10, 11],
    supportHouses: [1, 5, 9],
    karakas: ["Sun", "Jupiter", "Rahu"],
    divisionalCharts: ["D10", "D9"],
  },

  recognition_timing: {
    houses: [10, 11],
    supportHouses: [1, 5, 9],
    karakas: ["Sun", "Jupiter", "Saturn"],
    divisionalCharts: ["D10", "D9"],
  },

  reputation_recovery: {
    houses: [1, 10, 11],
    supportHouses: [6, 9],
    karakas: ["Sun", "Saturn", "Jupiter", "Mercury"],
    divisionalCharts: ["D10", "D9"],
  },
};
const DEBT_EVENT_RULES: Partial<
  Record<
    DebtEventType,
    {
      houses: number[];
      supportHouses: number[];
      karakas: string[];
      divisionalCharts: string[];
    }
  >
> = {
  debt_pattern: {
    houses: [6, 8, 12],
    supportHouses: [2, 11],
    karakas: ["Saturn", "Mars", "Rahu", "Mercury"],
    divisionalCharts: ["D2", "D6"],
  },

  borrowing_tendency: {
    houses: [6, 8, 12],
    supportHouses: [2],
    karakas: ["Saturn", "Rahu", "Mars", "Mercury"],
    divisionalCharts: ["D2", "D6"],
  },

  repayment_capacity: {
    houses: [2, 6, 11],
    supportHouses: [8, 12],
    karakas: ["Saturn", "Jupiter", "Mercury"],
    divisionalCharts: ["D2", "D6"],
  },

  liability_pattern: {
    houses: [6, 8, 12],
    supportHouses: [2, 11],
    karakas: ["Saturn", "Mars", "Rahu"],
    divisionalCharts: ["D2", "D6"],
  },

  debt_reduction: {
    houses: [2, 6, 11],
    supportHouses: [8, 12],
    karakas: ["Saturn", "Jupiter", "Mercury"],
    divisionalCharts: ["D2", "D6"],
  },

  loan_timing: {
    houses: [2, 6, 8, 11],
    supportHouses: [12],
    karakas: ["Saturn", "Mercury", "Jupiter"],
    divisionalCharts: ["D2", "D6"],
  },

  repayment_timing: {
    houses: [2, 6, 11],
    supportHouses: [8, 12],
    karakas: ["Saturn", "Jupiter", "Mercury"],
    divisionalCharts: ["D2", "D6"],
  },
};
const INHERITANCE_EVENT_RULES: Partial<
  Record<
    InheritanceEventType,
    {
      houses: number[];
      supportHouses: number[];
      karakas: string[];
      divisionalCharts: string[];
    }
  >
> = {
  inheritance_potential: {
    houses: [8],
    supportHouses: [2, 4, 11],
    karakas: ["Saturn", "Jupiter", "Ketu"],
    divisionalCharts: ["D8", "D12"],
  },

  ancestral_pattern: {
    houses: [8],
    supportHouses: [2, 4, 9],
    karakas: ["Ketu", "Saturn", "Jupiter"],
    divisionalCharts: ["D8", "D12"],
  },

  legacy_pattern: {
    houses: [8],
    supportHouses: [2, 4, 9, 11],
    karakas: ["Jupiter", "Saturn", "Ketu", "Sun"],
    divisionalCharts: ["D8", "D12"],
  },

  inheritance_conflict_pattern: {
    houses: [6, 8],
    supportHouses: [2, 4, 11],
    karakas: ["Saturn", "Mars", "Ketu", "Mercury"],
    divisionalCharts: ["D8", "D12"],
  },

  inheritance_timing: {
    houses: [8],
    supportHouses: [2, 4, 11],
    karakas: ["Saturn", "Jupiter", "Ketu"],
    divisionalCharts: ["D8", "D12"],
  },

  inheritance_settlement: {
    houses: [6, 8, 11],
    supportHouses: [2, 4],
    karakas: ["Saturn", "Mercury", "Jupiter"],
    divisionalCharts: ["D8", "D12"],
  },

  legacy_transfer_timing: {
    houses: [8, 11],
    supportHouses: [2, 4],
    karakas: ["Saturn", "Jupiter", "Mercury"],
    divisionalCharts: ["D8", "D12"],
  },
};
const MENTAL_HEALTH_EVENT_RULES: Partial<
  Record<
    MentalHealthEventType,
    {
      houses: number[];
      supportHouses: number[];
      karakas: string[];
      divisionalCharts: string[];
    }
  >
> = {
  mental_emotional_pattern: {
    houses: [1, 4, 8, 12],
    supportHouses: [5],
    karakas: ["Moon", "Mercury", "Saturn", "Ketu"],
    divisionalCharts: ["D9", "D30"],
  },

  overthinking_pattern: {
    houses: [1, 4, 8, 12],
    supportHouses: [3, 5, 6],
    karakas: ["Mercury", "Moon", "Saturn", "Rahu"],
    divisionalCharts: ["D9", "D30"],
  },

  mood_sensitivity: {
    houses: [1, 4, 8, 12],
    supportHouses: [5],
    karakas: ["Moon", "Venus", "Saturn", "Ketu"],
    divisionalCharts: ["D9", "D30"],
  },

  stress_resilience: {
    houses: [1, 4, 6],
    supportHouses: [5, 8, 12],
    karakas: ["Moon", "Saturn", "Mercury", "Jupiter"],
    divisionalCharts: ["D9", "D30"],
  },

  emotional_regulation_pattern: {
    houses: [1, 4, 8, 12],
    supportHouses: [5, 6],
    karakas: ["Moon", "Mercury", "Saturn", "Mars"],
    divisionalCharts: ["D9", "D30"],
  },

  mental_health_recovery: {
    houses: [1, 4, 6, 11],
    supportHouses: [5, 8, 12],
    karakas: ["Moon", "Jupiter", "Mercury", "Saturn"],
    divisionalCharts: ["D9", "D30"],
  },

  mental_health_timing: {
    houses: [1, 4, 8, 12],
    supportHouses: [5, 6, 11],
    karakas: ["Moon", "Mercury", "Saturn", "Jupiter"],
    divisionalCharts: ["D9", "D30"],
  },

  support_timing: {
    houses: [4, 5, 11],
    supportHouses: [1, 7],
    karakas: ["Moon", "Jupiter", "Venus", "Mercury"],
    divisionalCharts: ["D9"],
  },
};
const PETS_EVENT_RULES: Partial<
  Record<
    PetsEventType,
    {
      houses: number[];
      supportHouses: number[];
      karakas: string[];
      divisionalCharts: string[];
    }
  >
> = {
  pet_relationship_pattern: {
    houses: [6],
    supportHouses: [4, 12],
    karakas: ["Moon", "Mercury", "Ketu"],
    divisionalCharts: ["D6", "D30"],
  },

  pet_caregiving_style: {
    houses: [6],
    supportHouses: [4, 12],
    karakas: ["Moon", "Mercury", "Venus"],
    divisionalCharts: ["D6"],
  },

  pet_responsibility_pattern: {
    houses: [6],
    supportHouses: [4, 12],
    karakas: ["Saturn", "Moon", "Mercury", "Ketu"],
    divisionalCharts: ["D6", "D30"],
  },
};

const INNER_EVENT_RULES: Partial<
  Record<
    InnerEventType,
    {
      houses: number[];
      supportHouses: number[];
      karakas: string[];
      divisionalCharts: string[];
    }
  >
> = {
  life_direction_pattern: {
    houses: [1, 9, 12],
    supportHouses: [8],
    karakas: ["Jupiter", "Moon", "Ketu", "Sun"],
    divisionalCharts: ["D9"],
  },

  purpose_pattern: {
    houses: [1, 9, 12],
    supportHouses: [5, 8],
    karakas: ["Jupiter", "Sun", "Ketu", "Moon"],
    divisionalCharts: ["D9"],
  },

  inner_conflict_pattern: {
    houses: [8, 12],
    supportHouses: [1, 4],
    karakas: ["Moon", "Ketu", "Saturn", "Mercury"],
    divisionalCharts: ["D9"],
  },

  self_understanding_pattern: {
    houses: [1, 8, 12],
    supportHouses: [4, 9],
    karakas: ["Moon", "Ketu", "Jupiter", "Mercury"],
    divisionalCharts: ["D9"],
  },

  meaning_pattern: {
    houses: [9, 12],
    supportHouses: [1, 5, 8],
    karakas: ["Jupiter", "Ketu", "Moon"],
    divisionalCharts: ["D9"],
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

  const source =
    report?.houses ??
    report?.natal?.houses ??
    {};

  for (const h of houses) {
    let row: any = null;

    // Array-shaped houses:
    // find the actual house number instead of using
    // the house number as a zero-based array index.
    if (Array.isArray(source)) {
      row =
        source.find(
          (item: any) =>
            Number(item?.house) === h
        ) ??
        source[h - 1] ??
        null;
    } else {
      // Object-shaped houses: H10 / "10"
      row =
        source?.[`H${h}`] ??
        source?.[String(h)] ??
        null;
    }

    if (!row) continue;

    const lord =
      safeStr(row?.lord);

    const sign =
      safeStr(row?.sign);

    const occupants =
      Array.isArray(row?.occupants)
        ? row.occupants.join(", ")
        : safeStr(row?.occupants);

    const lordPlacedHouse =
      Number.isFinite(
        Number(row?.lordPlacedHouse)
      )
        ? Number(row.lordPlacedHouse)
        : null;

    const lordPlacedSign =
      safeStr(row?.lordPlacedSign);

    const line = [
      `House ${h}`,
      sign
        ? `sign ${sign}`
        : "",
      lord
        ? `lord ${lord}`
        : "",
      lord &&
      lordPlacedSign &&
      lordPlacedHouse
        ? `${lord} placed in ${lordPlacedSign} in house ${lordPlacedHouse}`
        : "",
      occupants
        ? `occupants: ${occupants}`
        : "",
    ]
      .filter(Boolean)
      .join(" • ");

    if (line) {
      bullets.push(line);
    }
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
console.log("Career house lords", houseLords);
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
  education: [
  { chart: "D1", weight: 0.8, role: "base learning promise" },
  { chart: "D24", weight: 1.0, role: "education, learning and academic development" },
  { chart: "D9", weight: 0.4, role: "supporting planetary maturity" },
],

parents: [
  { chart: "D1", weight: 0.8, role: "base parent and family pattern" },
  { chart: "D12", weight: 1.0, role: "parents, ancestry and inherited family pattern" },
  { chart: "D9", weight: 0.4, role: "family dharma and maturity" },
],

siblings: [
  { chart: "D1", weight: 0.8, role: "base sibling pattern" },
  { chart: "D3", weight: 1.0, role: "siblings, courage and sibling dynamics" },
],

business: [
  { chart: "D1", weight: 0.8, role: "base commercial promise" },
  { chart: "D10", weight: 1.0, role: "professional and business execution" },
  { chart: "D2", weight: 0.5, role: "commercial resources and financial results" },
  { chart: "D9", weight: 0.4, role: "supporting planetary strength" },
],

travel: [
  { chart: "D1", weight: 0.8, role: "base travel and movement pattern" },
  { chart: "D9", weight: 0.7, role: "long-distance and dharmic movement support" },
  { chart: "D4", weight: 0.5, role: "residential and location context" },
  { chart: "D20", weight: 0.3, role: "spiritual travel and pilgrimage context" },
],

spiritual: [
  { chart: "D1", weight: 0.8, role: "base spiritual inclination" },
  { chart: "D20", weight: 1.0, role: "spiritual practice and sadhana" },
  { chart: "D9", weight: 0.6, role: "dharma and spiritual maturity" },
],

reputation: [
  { chart: "D1", weight: 0.8, role: "base public-image promise" },
  { chart: "D10", weight: 1.0, role: "status, visibility and professional recognition" },
  { chart: "D9", weight: 0.4, role: "supporting strength behind recognition" },
],

debt: [
  { chart: "D1", weight: 0.8, role: "base liability pattern" },
  { chart: "D2", weight: 1.0, role: "financial resources and repayment capacity" },
  { chart: "D6", weight: 0.7, role: "debt, obstacles and financial pressure" },
],

inheritance: [
  { chart: "D1", weight: 0.8, role: "base inheritance promise" },
  { chart: "D8", weight: 1.0, role: "inheritance, shared assets and transformational events" },
  { chart: "D12", weight: 0.7, role: "ancestry and family legacy" },
],

mental_health: [
  { chart: "D1", weight: 0.8, role: "base mental and emotional constitution" },
  { chart: "D30", weight: 1.0, role: "stress, pressure and vulnerability pattern" },
  { chart: "D9", weight: 0.4, role: "resilience and supporting maturity" },
],

pets: [
  { chart: "D1", weight: 0.8, role: "base pet and caregiving pattern" },
  { chart: "D6", weight: 1.0, role: "pets, care, service and responsibility" },
  { chart: "D30", weight: 0.4, role: "health and difficulty context involving pets" },
],
  generic: [
    { chart: "D1", weight: 1.0, role: "base promise" },
    { chart: "D9", weight: 0.5, role: "supporting strength" },
  ],
};
function getDivisionalSource(report: any): Record<string, any> {
  return (
    report?.divisionalCharts ??
    report?.vargas ??
    report?.chartContext?.divisionalCharts ??
    report?.chartContext?.vargas ??
    {}
  );
}

function getChartRecord(report: any, chart: string): any {
  if (chart === "D1") {
    return (
      report?.natal ??
      report?.birthChart ??
      report?.chart ??
      report?.chartContext?.natal ??
      report?.chartContext?.birthChart ??
      null
    );
  }

  const source = getDivisionalSource(report);
  return source?.[chart] ?? source?.[chart.toLowerCase()] ?? null;
}

function normalizePlanetRows(chartRow: any): any[] {
  const raw =
    chartRow?.planets ??
    chartRow?.placements ??
    chartRow?.planetPlacements ??
    chartRow?.grahas ??
    [];

  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    return Object.entries(raw).map(([planet, value]: [string, any]) => ({
      planet,
      ...(value && typeof value === "object" ? value : { value }),
    }));
  }
  return [];
}

function normalizeHouseRows(chartRow: any): any[] {
  const raw = chartRow?.houses ?? chartRow?.houseData ?? chartRow?.bhavas ?? [];
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    return Object.entries(raw).map(([house, value]: [string, any]) => ({
      house: Number(String(house).replace(/\D/g, "")),
      ...(value && typeof value === "object" ? value : { value }),
    }));
  }
  return [];
}

function evidenceImpactFromText(text: string): EvidenceImpact {
  const t = String(text ?? "").toLowerCase();
  const supportive = /strong|support|own sign|exalt|vargottama|benefic|yoga|gain|well placed|dignified|friend/.test(t);
  const blocking = /weak|block|debil|combust|afflict|enemy|fall|delay|challeng|malefic|damaged/.test(t);
  if (supportive && blocking) return "mixed";
  if (supportive) return "support";
  if (blocking) return "block";
  return "neutral";
}

function buildDivisionalChartEvidence(params: {
  report: any;
  chart: string;
  role: string;
  weight: number;
  houses: number[];
  karakas: string[];
}): DivisionalChartEvidence {
  const { report, chart, role, weight, houses, karakas } = params;
  const row = getChartRecord(report, chart);
  const rawSignals = readDivisionalSupport(report, [chart], houses, karakas).slice(0, 8);

  if (!row) {
    return {
      chart,
      role,
      relevance: weight >= 0.8 ? "primary" : weight >= 0.5 ? "supporting" : "optional",
      available: false,
      weight,
      ascendant: null,
      focusHouses: [],
      relevantPlanets: [],
      yogas: [],
      supports: [],
      blockers: [],
      contradictions: [],
      rawSignals,
      verdict: "unclear",
    };
  }

  const planetRows = normalizePlanetRows(row);
  const houseRows = normalizeHouseRows(row);
  const relevantPlanetRows = planetRows.filter((p: any) => {
    const name = safePlanetName(p?.planet ?? p?.name ?? p?.graha);
    const house = Number(p?.house ?? p?.houseNumber ?? p?.bhava);
    return Boolean(name && (karakas.includes(name) || houses.includes(house)));
  });

  const relevantPlanets: DivisionalPlanetEvidence[] = relevantPlanetRows.map((p: any) => ({
    planet: safePlanetName(p?.planet ?? p?.name ?? p?.graha) ?? "Unknown",
    sign: safeStr(p?.sign ?? p?.rashi) || null,
    house: Number.isFinite(Number(p?.house ?? p?.houseNumber ?? p?.bhava))
      ? Number(p?.house ?? p?.houseNumber ?? p?.bhava)
      : null,
    dignity: safeStr(p?.dignity ?? p?.status ?? p?.avastha) || null,
    retrograde: Boolean(p?.retrograde ?? p?.isRetrograde),
    combust: Boolean(p?.combust ?? p?.isCombust),
    vargottama: Boolean(p?.vargottama ?? p?.isVargottama),
    aspects: Array.isArray(p?.aspects) ? p.aspects.map(String).slice(0, 6) : [],
    lordships: Array.isArray(p?.lordships)
      ? p.lordships.map(Number).filter(Number.isFinite)
      : [],
    interpretation: safeStr(p?.interpretation ?? p?.summary ?? p?.meaning) || null,
  }));

  const focusHouses: DivisionalHouseEvidence[] = houses.map((house) => {
    const h = houseRows.find((x: any) => Number(x?.house ?? x?.houseNumber ?? x?.bhava) === house);
    const occupants = planetRows
      .filter((p: any) => Number(p?.house ?? p?.houseNumber ?? p?.bhava) === house)
      .map((p: any) => safePlanetName(p?.planet ?? p?.name ?? p?.graha))
      .filter(Boolean) as string[];

    return {
      house,
      sign: safeStr(h?.sign ?? h?.rashi) || null,
      lord: safePlanetName(h?.lord ?? h?.houseLord) || null,
      occupants,
      aspects: Array.isArray(h?.aspects) ? h.aspects.map(String).slice(0, 6) : [],
      interpretation: safeStr(h?.interpretation ?? h?.summary ?? h?.meaning) || null,
    };
  });

  const yogas: string[] = (
  Array.isArray(row?.yogas)
    ? row.yogas
    : Array.isArray(row?.yogaList)
      ? row.yogaList
      : []
)
  .map((y: any) => safeStr(y?.name ?? y?.title ?? y))
  .filter((y: string | null | undefined): y is string => Boolean(y))
  .slice(0, 10);

const explicitTexts: string[] = [
  ...rawSignals,
  safeStr(row?.summary),

  ...relevantPlanets.map((p) =>
    [
      p.planet,
      p.sign,
      p.house ? `H${p.house}` : "",
      p.dignity,
      p.interpretation,
    ]
      .filter(
        (value: string | null | undefined): value is string =>
          Boolean(value)
      )
      .join(" • ")
  ),

  ...focusHouses.map((h) =>
    [
      `H${h.house}`,
      h.sign,
      h.lord ? `lord ${h.lord}` : "",
      h.occupants.length
        ? `occupants ${h.occupants.join(", ")}`
        : "",
      h.interpretation,
    ]
      .filter(
        (value: string | null | undefined): value is string =>
          Boolean(value)
      )
      .join(" • ")
  ),

  ...yogas.map((y: string) => `Yoga: ${y}`),
].filter(
  (value: string | null | undefined): value is string =>
    Boolean(value)
);

const supports = uniq(
  explicitTexts.filter(
    (x: string) => evidenceImpactFromText(x) === "support"
  )
).slice(0, 8);

const blockers = uniq(
  explicitTexts.filter(
    (x: string) => evidenceImpactFromText(x) === "block"
  )
).slice(0, 8);

const mixed = uniq(
  explicitTexts.filter(
    (x: string) => evidenceImpactFromText(x) === "mixed"
  )
).slice(0, 6);

  let score = 30 + rawSignals.length * 8 + relevantPlanets.length * 5 + focusHouses.filter((h) => h.lord || h.occupants.length).length * 4;
  score += supports.length * 5;
  score -= blockers.length * 5;
  score = Math.max(10, Math.min(95, score));

  return {
    chart,
    role,
    relevance: weight >= 0.8 ? "primary" : weight >= 0.5 ? "supporting" : "optional",
    available: true,
    weight,
    ascendant: {
      sign: safeStr(row?.ascendant?.sign ?? row?.ascendantSign ?? row?.lagna?.sign ?? row?.lagnaSign) || null,
      lord: safePlanetName(row?.ascendant?.lord ?? row?.lagnaLord) || null,
      degree: Number.isFinite(Number(row?.ascendant?.degree ?? row?.lagna?.degree))
        ? Number(row?.ascendant?.degree ?? row?.lagna?.degree)
        : null,
    },
    focusHouses,
    relevantPlanets,
    yogas,
    supports,
    blockers,
    contradictions: mixed,
    rawSignals,
    verdict: scoreToVerdict(score),
  };
}

function buildDivisionalLayer(
  report: any,
  topic: AskSarathiDomain,
  rule: TopicRule
): DivisionalAnalysisLayer {
  const topicProfile =
  DIVISIONAL_PROFILES[topic] ??
  DIVISIONAL_PROFILES.generic ??
  [];

const requestedCharts =
  Array.isArray(rule.divisionalCharts) &&
  rule.divisionalCharts.length
    ? rule.divisionalCharts
    : topicProfile.map((entry) => entry.chart);

const profile: DivisionalSignalProfile[] =
  requestedCharts.map((chart) => {
    const existing =
      topicProfile.find(
        (entry) => entry.chart === chart
      );

    if (existing) {
      return existing;
    }

    return {
      chart,
      weight: 1.0,
      role: `${chart} confirmation for this event`,
    };
  });

  const charts = profile.map((entry) =>
    buildDivisionalChartEvidence({
      report,
      chart: entry.chart,
      role: entry.role,
      weight: entry.weight,
      houses: rule.houses,
      karakas: rule.karakas,
    })
  );

  const usableCharts = charts.filter((x) => x.available);
  const requiredCharts = uniq(
    profile.filter((x) => x.weight >= 0.8).map((x) => x.chart)
  );
  const availableCharts = usableCharts.map((x) => x.chart);
  const missingCharts = requiredCharts.filter((chart) => !availableCharts.includes(chart));

  const scoreForVerdict: Record<AnalysisLayer["verdict"], number> = {
    strong: 82,
    moderate: 65,
    mixed: 48,
    weak: 28,
    unclear: 15,
  };
  const totalWeight = usableCharts.reduce((sum, x) => sum + x.weight, 0) || 1;
  const weightedAverage = usableCharts.reduce(
    (sum, x) => sum + scoreForVerdict[x.verdict] * x.weight,
    0
  ) / totalWeight;
  const verdict = usableCharts.length ? scoreToVerdict(Math.round(weightedAverage)) : "unclear";

  const supports = uniq(usableCharts.flatMap((x) => x.supports.map((v) => `${x.chart}: ${v}`))).slice(0, 12);
  const blockers = uniq(usableCharts.flatMap((x) => x.blockers.map((v) => `${x.chart}: ${v}`))).slice(0, 12);
  const contradictions = uniq([
    ...usableCharts.flatMap((x) => x.contradictions.map((v) => `${x.chart}: ${v}`)),
    ...(usableCharts.some((x) => x.verdict === "strong") && usableCharts.some((x) => ["weak", "unclear"].includes(x.verdict))
      ? ["The supporting chart factors are not fully aligned, so a strong indication in one part of the chart may express only partially or unevenly."]
      : []),
  ]).slice(0, 10);

  const completeness: DivisionalAnalysis["completeness"] =
    missingCharts.length === 0
      ? "complete"
      : availableCharts.length > 0
      ? "partial"
      : "insufficient";

  const analysis: DivisionalAnalysis = {
    requiredCharts,
    availableCharts,
    missingCharts,
    charts,
    combinedVerdict: verdict,
    supports,
    blockers,
    contradictions,
    completeness,
  };

  const bullets = uniq([
    ...supports,
    ...blockers,
    ...contradictions,
    ...usableCharts.flatMap((x) => x.rawSignals.map((v) => `${x.chart}: ${v}`)),
  ]).slice(0, 12);

  const summary =
    completeness === "complete"
      ? `Full divisional evidence is available through ${availableCharts.join(", ")}. The combined confirmation is ${verdict}.`
      : completeness === "partial"
      ? `Divisional evidence is available through ${availableCharts.join(", ")}, while ${missingCharts.join(", ")} is missing from the current payload. The available confirmation is ${verdict}.`
      : `Required divisional chart records (${requiredCharts.join(", ")}) are not available in the current payload.`;

  return {
    title: "Divisional support",
    verdict,
    summary,
    bullets,
    chartBreakdown: charts.map((x) => ({
      chart: x.chart,
      strength: x.verdict,
      weight: x.weight,
    })),
    analysis,
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
  decisionSummary?: any;
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
  decisionSummary,
} = params;
if (
  questionType === "timing" &&
  decisionSummary?.headline
) {
  return {
    verdict: "STRUCTURED_TIMING",
    line:
      decisionSummary.summary ??
      decisionSummary.practicalMeaning ??
      decisionSummary.headline,
  };
}
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
    missing.push("The broader chart picture offers only limited additional emphasis.");
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
  confidence: "high" | "medium" | "low";
  reason: string;
  score: number;

  start?: string | null;
  end?: string | null;

  dashaLevel?: "md" | "ad" | "pd" | null;
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

  const rankDashaLevel = (
    level?: "md" | "ad" | "pd" | null
  ) => {
    if (level === "md") return 3;
    if (level === "ad") return 2;
    if (level === "pd") return 1;
    return 0;
  };

  const majorWindows: AstroTimelineWindow[] = windows
  .filter((w) => {
    return w.dashaLevel === "ad";
  })
  .sort((a, b) => {
    const aStart = a.start ?? "";
    const bStart = b.start ?? "";

    const dateDiff =
      String(aStart).localeCompare(
        String(bStart)
      );

    if (dateDiff !== 0) {
      return dateDiff;
    }

    return (
      Number(b.score ?? 0) -
      Number(a.score ?? 0)
    );
  });
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

  const triggerWindows: AstroTimelineWindow[] = windows
  .filter((w) => {
    const reason =
      String(
        w.reason ??
        ""
      ).toLowerCase();

    const isPdWindow =
      w.dashaLevel === "pd";

    const isTransitTrigger =
      reason.includes("transit") ||
      reason.includes("ingress") ||
      reason.includes("retrograde") ||
      reason.includes("natal contact");

    return (
      isPdWindow ||
      isTransitTrigger
    );
  })
  .sort((a, b) => {
    // Prefer stronger activation first.
    const scoreDiff =
      Number(b.score ?? 0) -
      Number(a.score ?? 0);

    if (scoreDiff !== 0) {
      return scoreDiff;
    }

    const aStart =
      a.start ??
      "";

    const bStart =
      b.start ??
      "";

    return String(aStart).localeCompare(
      String(bStart)
    );
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
 const candidates: AstroTimelineWindow[] = [];

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

 const dashaTimeline =
  Array.isArray(report?.dashaTimeline) &&
  report.dashaTimeline.length
    ? report.dashaTimeline

    : Array.isArray(report?.timeline) &&
      report.timeline.length
    ? report.timeline

    : Array.isArray(report?.activePeriods?.timeline) &&
      report.activePeriods.timeline.length
    ? report.activePeriods.timeline

    : Array.isArray(report?.dasha?.timeline) &&
      report.dasha.timeline.length
    ? report.dasha.timeline

    : Array.isArray(report?.timing?.dashaTimeline) &&
      report.timing.dashaTimeline.length
    ? report.timing.dashaTimeline

    : Array.isArray(report?.timing?.timeline) &&
      report.timing.timeline.length
    ? report.timing.timeline

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
  const start = String(
    row?.start ??
    row?.startISO ??
    ""
  ).slice(0, 10);

  const end = String(
    row?.end ??
    row?.endISO ??
    ""
  ).slice(0, 10);

  if (
  !start ||
  !end ||
  end < todayISO
) {
  continue;
}

  const md =
    row?.md ??
    row?.mahadasha ??
    null;

  const ad =
    row?.ad ??
    row?.antardasha ??
    null;

  const pd =
    row?.pd ??
    row?.pratyantardasha ??
    null;

  const active = [md, ad, pd]
    .filter(Boolean)
    .map((x: any) => String(x));

  const hits = active.filter(
    (p) => relevantPlanets.includes(p)
  );

  if (hits.length) {
    const scored = scorePredictionWindow({
      topic,
      row,
      report,
      careerEventType,
    });

    const dashaLevel: "md" | "ad" | "pd" | null =
      pd
        ? "pd"
        : ad
        ? "ad"
        : md
        ? "md"
        : null;

    candidates.push({
      label: `${start} to ${end}`,

      start,
      end,

      dashaLevel,

      confidence: scored.confidence,

      reason:
        scored.reasons.join(". "),

      score:
        scored.score,
    });
  }

  if (candidates.length >= 12) {
    break;
  }
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
    activeSignals.push(
  describeBroaderChartSupport(
    divisionalLayer.verdict
  )
);
  } else {
    missingSignals.push("The supporting chart factors do not clearly reinforce this theme.");
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

function resolveContradictions(params: {
  promiseLayer: AnalysisLayer;
  divisionalLayer: DivisionalAnalysisLayer;
  timingLayer: AnalysisLayer;
  timingPolicy: GenericAstroBundle["timingPolicy"];
}): ContradictionResolution {
  const { promiseLayer, divisionalLayer, timingLayer, timingPolicy } = params;
  let dominantLayer: ContradictionResolution["dominantLayer"] = "natal";
  let resolvedMeaning = "The natal promise, divisional confirmation, and timing should be read together rather than averaged.";

  if (["strong", "moderate"].includes(promiseLayer.verdict) && ["weak", "unclear"].includes(divisionalLayer.verdict)) {
    dominantLayer = "divisional";
    resolvedMeaning = "The natal chart contains potential, but the relevant divisional chart does not confirm clean execution or durable conversion. Expect partial expression, delay, or uneven results rather than treating the promise as fully available.";
  } else if (["strong", "moderate"].includes(promiseLayer.verdict) && ["strong", "moderate"].includes(divisionalLayer.verdict) && ["weak", "mixed"].includes(timingLayer.verdict)) {
    dominantLayer = "dasha";
    resolvedMeaning = "The event is promised and divisionally supported, but the current period is better for preparation or movement than final conversion.";
  } else if (["weak", "unclear"].includes(promiseLayer.verdict) && timingPolicy.transitStrength === "strong") {
    dominantLayer = "natal";
    resolvedMeaning = "The transit can create temporary activity, but weak natal promise reduces the likelihood of a durable or fully satisfying outcome.";
  } else if (timingPolicy.dashaStrength === "strong" && timingPolicy.transitStrength === "weak") {
    dominantLayer = "transit";
    resolvedMeaning = "The broader dasha supports the theme, but the immediate trigger is weak; timing is developing rather than peaking now.";
  } else if (["strong", "moderate"].includes(timingLayer.verdict)) {
    dominantLayer = timingPolicy.dashaStrength === "strong" ? "dasha" : "transit";
    resolvedMeaning = "Promise and timing are sufficiently aligned for movement, but the final outcome should still be judged from conversion and stability signals.";
  }

  return {
    natalPromise: promiseLayer.verdict,
    divisionalConfirmation: divisionalLayer.verdict,
    dashaActivation: timingPolicy.dashaStrength,
    transitTrigger: timingPolicy.transitStrength,
    dominantLayer,
    resolvedMeaning,
  };
}

function validateAstrologyEvidencePacket(packet: Omit<AstrologyEvidencePacket, "completeness">): AstrologyEvidencePacket["completeness"] {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!packet.natal.houseEvidence.length && !packet.natal.promise.bullets.length) {
    errors.push("Natal promise evidence is unavailable.");
  }
  if (packet.divisionalAnalysis.completeness === "insufficient") {
    errors.push(`Required divisional charts are unavailable: ${packet.divisionalAnalysis.requiredCharts.join(", ")}.`);
  } else if (packet.divisionalAnalysis.missingCharts.length) {
    warnings.push(`Missing primary divisional charts: ${packet.divisionalAnalysis.missingCharts.join(", ")}.`);
  }
  if (!packet.timing.currentDasha.md && !packet.timing.currentDasha.ad && !packet.timing.currentDasha.pd) {
    warnings.push("Current dasha chain is unavailable.");
  }
  if (!packet.support.length && !packet.blockers.length) {
    warnings.push("No structured supporting or blocking evidence was extracted.");
  }

  return { complete: errors.length === 0, errors, warnings };
}

function buildAstrologyEvidencePacket(params: {
  topic: AskSarathiDomain;
  eventType?: AskSarathiEventType;
  questionType: AskSarathiQuestionType;
  rule: TopicRule;
  report: any;
  promiseLayer: AnalysisLayer;
  sambandhaAnalysis: SambandhaAnalysis;
  divisionalLayer: DivisionalAnalysisLayer;
  karakaLayer: AnalysisLayer;
  timingLayer: AnalysisLayer;
  timingPolicy: GenericAstroBundle["timingPolicy"];
  currentDasha: GenericAstroBundle["currentDasha"];
  rankedTimingWindows: RankedTimingWindow[];
  eventTriggers: UniversalEventTrigger[];
  conversionDiagnosisV2?: GenericAstroBundle["conversionDiagnosisV2"];
}): AstrologyEvidencePacket {
  const houseEvidence = uniq([
    ...readHouseSupport(params.report, params.rule.houses),
    ...readHouseSupport(params.report, params.rule.supportHouses ?? []),
  ]).slice(0, 12);
 
  
  const karakaEvidence = readKarakaSupport(params.report, params.rule.karakas).slice(0, 12);

  const support: StructuredEvidenceItem[] = [
    ...params.promiseLayer.bullets
      .filter((x) => evidenceImpactFromText(x) !== "block")
      .map((detail) => ({ source: "D1", factor: "Natal promise", detail, impact: evidenceImpactFromText(detail), weight: 1 })),
    ...params.sambandhaAnalysis.supportiveLinks.map((relationship) => ({
      source: "Sambandha",
      factor: relationship.type,
      detail: relationship.reason,
      impact: "support" as const,
      weight: Math.max(0.5, Math.min(1.2, relationship.score / 8)),
    })),
    ...params.divisionalLayer.analysis.supports.map((detail) => ({ source: "Divisional", factor: "Divisional confirmation", detail, impact: "support" as const, weight: 1 })),
    ...params.karakaLayer.bullets
      .filter((x) => evidenceImpactFromText(x) !== "block")
      .map((detail) => ({ source: "Karaka", factor: "Karaka condition", detail, impact: evidenceImpactFromText(detail), weight: 0.8 })),
    ...params.timingLayer.bullets
      .filter((x) => evidenceImpactFromText(x) !== "block")
      .map((detail) => ({ source: "Timing", factor: "Dasha/transit activation", detail, impact: evidenceImpactFromText(detail), weight: 0.9 })),
  ].slice(0, 20);

  const blockers: StructuredEvidenceItem[] = [
    ...params.promiseLayer.bullets
      .filter((x) => evidenceImpactFromText(x) === "block")
      .map((detail) => ({ source: "D1", factor: "Natal blocker", detail, impact: "block" as const, weight: 1 })),
    ...params.sambandhaAnalysis.missingRequiredLinks.map((detail) => ({
      source: "Sambandha",
      factor: "Missing event connection",
      detail,
      impact: "block" as const,
      weight: 1,
    })),
    ...params.divisionalLayer.analysis.blockers.map((detail) => ({ source: "Divisional", factor: "Divisional blocker", detail, impact: "block" as const, weight: 1 })),
    ...params.karakaLayer.bullets
      .filter((x) => evidenceImpactFromText(x) === "block")
      .map((detail) => ({ source: "Karaka", factor: "Karaka blocker", detail, impact: "block" as const, weight: 0.8 })),
    ...params.timingLayer.bullets
      .filter((x) => evidenceImpactFromText(x) === "block")
      .map((detail) => ({ source: "Timing", factor: "Timing blocker", detail, impact: "block" as const, weight: 0.9 })),
  ].slice(0, 20);

  const contradictionResolution = resolveContradictions({
    promiseLayer: params.promiseLayer,
    divisionalLayer: params.divisionalLayer,
    timingLayer: params.timingLayer,
    timingPolicy: params.timingPolicy,
  });
  const contradictions: StructuredEvidenceItem[] = params.divisionalLayer.analysis.contradictions
    .map((detail) => ({ source: "Cross-chart", factor: "Contradiction", detail, impact: "mixed" as const, weight: 1 }))
    .concat({ source: "Synthesis", factor: "Contradiction resolution", detail: contradictionResolution.resolvedMeaning, impact: "mixed", weight: 1 });

  const conversionStrength: AnalysisLayer["verdict"] =
    params.conversionDiagnosisV2?.verdict === "conversion_favored"
      ? "strong"
      : params.conversionDiagnosisV2?.verdict === "movement_favored"
      ? "moderate"
      : params.conversionDiagnosisV2?.verdict === "blocked"
      ? "weak"
      : "mixed";

  const missingData = uniq([
    ...params.divisionalLayer.analysis.missingCharts.map((chart) => `${chart} chart record`),
    ...(!params.currentDasha.md && !params.currentDasha.ad && !params.currentDasha.pd ? ["current dasha chain"] : []),
  ]);

  const packetWithoutCompleteness = {
    version: "sarathi-evidence-v1" as const,
    topic: params.topic,
    eventType: params.eventType,
    questionType: params.questionType,
    natal: {
      promise: params.promiseLayer,
      focusHouses: params.rule.houses,
      supportHouses: params.rule.supportHouses ?? [],
      karakas: params.rule.karakas,
      houseEvidence,
      karakaEvidence,
    },
    sambandha: {
      verdict: params.sambandhaAnalysis.verdict,
      connectivityScore: params.sambandhaAnalysis.connectivityScore,
      dashaConnectivityScore: params.sambandhaAnalysis.dashaConnectivityScore,
      conversionScore: params.sambandhaAnalysis.conversionScore,
      relationships: params.sambandhaAnalysis.relationships,
      missingRequiredLinks: params.sambandhaAnalysis.missingRequiredLinks,
    },
    divisionalAnalysis: params.divisionalLayer.analysis,
    timing: {
      currentDasha: params.currentDasha,
      dashaStrength: params.timingPolicy.dashaStrength,
      transitStrength: params.timingPolicy.transitStrength,
      timingLayer: params.timingLayer,
      windows: params.rankedTimingWindows,
      triggers: params.eventTriggers,
    },
    support,
    blockers,
    contradictions,
    contradictionResolution,
    missingData,
    synthesis: {
      promiseStrength: params.promiseLayer.verdict,
      timingStrength: params.timingLayer.verdict,
      conversionStrength,
      dominantFactor: contradictionResolution.dominantLayer,
      instruction:
        "Judge natal promise first, planetary connectivity second, divisional confirmation third, dasha activation fourth, transit triggering fifth, and final conversion last. A strong transit must not create an event that lacks natal promise or an operative sambandha chain. Resolve contradictions explicitly; never average them into a vague answer.",
    },
  };

  return {
    ...packetWithoutCompleteness,
    completeness: validateAstrologyEvidencePacket(packetWithoutCompleteness),
  };
}

function buildGenericAstroBundle(
  question: string,
  topic: AskSarathiDomain,
  questionType: AskSarathiQuestionType,
  answerMode: AnswerMode,
  report: any,
  careerEventTypeOverride?: CareerEventType,
  userContext?: {
    age?: number | null;
    lifeStage?: string | null;
    careerStage?: string | null;
    adviceStyle?: string | null;
  }
): GenericAstroBundle {
  let rule = resolveTopicRule(topic);

const dasha = getActiveDashaAnyShape(report);
const timeDirection = detectTimeDirection(question, topic);
const eventScale = detectEventScale(question, topic);

const eventType = detectEventType(question, topic, timeDirection);
console.log("[QUESTION ROUTING DEBUG]", {
  question,
  topic,
  questionType,
  timeDirection,
  eventType,
  careerEventTypeOverride:
    typeof careerEventTypeOverride !== "undefined"
      ? careerEventTypeOverride
      : null,
});
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
if (
  topic === "relationships" ||
  topic === "marriage"
) {
  const relationshipEventType =
    eventType as RelationshipEventType;

  const relationshipRule =
    RELATIONSHIP_EVENT_RULES[
      relationshipEventType
    ];

  if (relationshipRule) {
    rule = {
      ...rule,
      houses:
        relationshipRule.houses,

      supportHouses:
        relationshipRule.supportHouses,

      karakas:
        relationshipRule.karakas,

      divisionalCharts:
        relationshipRule.divisionalCharts,
    };
  }
}
if (topic === "money") {
  const wealthEventType =
    eventType as WealthEventType;

  const wealthRule =
    WEALTH_EVENT_RULES[
      wealthEventType
    ];

  if (wealthRule) {
    rule = {
      ...rule,

      houses:
        wealthRule.houses,

      supportHouses:
        wealthRule.supportHouses,

      karakas:
        wealthRule.karakas,

      divisionalCharts:
        wealthRule.divisionalCharts,
    };
  }
}
if (topic === "business") {
  const businessEventType =
    eventType as BusinessEventType;

  const businessRule =
    BUSINESS_EVENT_RULES[
      businessEventType
    ];

  if (businessRule) {
    rule = {
      ...rule,

      houses:
        businessRule.houses,

      supportHouses:
        businessRule.supportHouses,

      karakas:
        businessRule.karakas,

      divisionalCharts:
        businessRule.divisionalCharts,
    };
  }
}
if (topic === "education") {
  const educationEventType =
    eventType as EducationEventType;

  const educationRule =
    EDUCATION_EVENT_RULES[
      educationEventType
    ];

  if (educationRule) {
    rule = {
      ...rule,

      houses:
        educationRule.houses,

      supportHouses:
        educationRule.supportHouses,

      karakas:
        educationRule.karakas,

      divisionalCharts:
        educationRule.divisionalCharts,
    };
  }
}
if (topic === "spiritual") {
  const spiritualEventType =
    eventType as SpiritualEventType;

  const spiritualRule =
    SPIRITUAL_EVENT_RULES[
      spiritualEventType
    ];

  if (spiritualRule) {
    rule = {
      ...rule,

      houses:
        spiritualRule.houses,

      supportHouses:
        spiritualRule.supportHouses,

      karakas:
        spiritualRule.karakas,

      divisionalCharts:
        spiritualRule.divisionalCharts,
    };
  }
}
if (topic === "health") {
  const healthEventType =
    eventType as HealthEventType;

  const healthRule =
    HEALTH_EVENT_RULES[
      healthEventType
    ];

  if (healthRule) {
    rule = {
      ...rule,

      houses:
        healthRule.houses,

      supportHouses:
        healthRule.supportHouses,

      karakas:
        healthRule.karakas,

      divisionalCharts:
        healthRule.divisionalCharts,
    };
  }
}
if (topic === "child") {
  const childEventType =
    eventType as ChildrenEventType;

  const childRule =
    CHILD_EVENT_RULES[
      childEventType
    ];

  if (childRule) {
    rule = {
      ...rule,

      houses:
        childRule.houses,

      supportHouses:
        childRule.supportHouses,

      karakas:
        childRule.karakas,

      divisionalCharts:
        childRule.divisionalCharts,
    };
  }
}
if (topic === "property") {
  const propertyEventType =
    eventType as PropertyEventType;

  const propertyRule =
    PROPERTY_EVENT_RULES[propertyEventType];

  if (propertyRule) {
    rule = {
      ...rule,
      houses: propertyRule.houses,
      supportHouses: propertyRule.supportHouses,
      karakas: propertyRule.karakas,
      divisionalCharts: propertyRule.divisionalCharts,
    };
  }
}
if (topic === "vehicle") {
  const vehicleEventType =
    eventType as VehicleEventType;

  const vehicleRule =
    VEHICLE_EVENT_RULES[
      vehicleEventType
    ];

  if (vehicleRule) {
    rule = {
      ...rule,
      houses: vehicleRule.houses,
      supportHouses: vehicleRule.supportHouses,
      karakas: vehicleRule.karakas,
      divisionalCharts: vehicleRule.divisionalCharts,
    };
  }
}
if (topic === "relocation") {
  const relocationEventType =
    eventType as RelocationEventType;

  const relocationRule =
    RELOCATION_EVENT_RULES[
      relocationEventType
    ];

  if (relocationRule) {
    rule = {
      ...rule,
      houses: relocationRule.houses,
      supportHouses: relocationRule.supportHouses,
      karakas: relocationRule.karakas,
      divisionalCharts: relocationRule.divisionalCharts,
    };
  }
}
if (topic === "disputes") {
  const disputeEventType =
    eventType as DisputeEventType;

  const disputeRule =
    DISPUTE_EVENT_RULES[
      disputeEventType
    ];

  if (disputeRule) {
    rule = {
      ...rule,
      houses: disputeRule.houses,
      supportHouses: disputeRule.supportHouses,
      karakas: disputeRule.karakas,
      divisionalCharts: disputeRule.divisionalCharts,
    };
  }
}
if (topic === "parents") {
  const parentsEventType =
    eventType as ParentsEventType;

  const parentsRule =
    PARENTS_EVENT_RULES[
      parentsEventType
    ];

  if (parentsRule) {
    rule = {
      ...rule,
      houses: parentsRule.houses,
      supportHouses: parentsRule.supportHouses,
      karakas: parentsRule.karakas,
      divisionalCharts: parentsRule.divisionalCharts,
    };
  }
}

if (topic === "siblings") {
  const siblingsEventType =
    eventType as SiblingsEventType;

  const siblingsRule =
    SIBLINGS_EVENT_RULES[
      siblingsEventType
    ];

  if (siblingsRule) {
    rule = {
      ...rule,
      houses: siblingsRule.houses,
      supportHouses: siblingsRule.supportHouses,
      karakas: siblingsRule.karakas,
      divisionalCharts: siblingsRule.divisionalCharts,
    };
  }
}
if (topic === "travel") {
  const travelEventType =
    eventType as TravelEventType;

  const travelRule =
    TRAVEL_EVENT_RULES[
      travelEventType
    ];

  if (travelRule) {
    rule = {
      ...rule,
      houses: travelRule.houses,
      supportHouses: travelRule.supportHouses,
      karakas: travelRule.karakas,
      divisionalCharts: travelRule.divisionalCharts,
    };
  }
}
if (topic === "reputation") {
  const reputationEventType =
    eventType as ReputationEventType;

  const reputationRule =
    REPUTATION_EVENT_RULES[
      reputationEventType
    ];

  if (reputationRule) {
    rule = {
      ...rule,
      houses: reputationRule.houses,
      supportHouses: reputationRule.supportHouses,
      karakas: reputationRule.karakas,
      divisionalCharts: reputationRule.divisionalCharts,
    };
  }
}
if (topic === "debt") {
  const debtEventType =
    eventType as DebtEventType;

  const debtRule =
    DEBT_EVENT_RULES[
      debtEventType
    ];

  if (debtRule) {
    rule = {
      ...rule,
      houses: debtRule.houses,
      supportHouses: debtRule.supportHouses,
      karakas: debtRule.karakas,
      divisionalCharts: debtRule.divisionalCharts,
    };
  }
}
if (topic === "inheritance") {
  const inheritanceEventType =
    eventType as InheritanceEventType;

  const inheritanceRule =
    INHERITANCE_EVENT_RULES[
      inheritanceEventType
    ];

  if (inheritanceRule) {
    rule = {
      ...rule,
      houses: inheritanceRule.houses,
      supportHouses: inheritanceRule.supportHouses,
      karakas: inheritanceRule.karakas,
      divisionalCharts: inheritanceRule.divisionalCharts,
    };
  }
}
if (topic === "mental_health") {
  const mentalHealthEventType =
    eventType as MentalHealthEventType;

  const mentalHealthRule =
    MENTAL_HEALTH_EVENT_RULES[
      mentalHealthEventType
    ];

  if (mentalHealthRule) {
    rule = {
      ...rule,
      houses: mentalHealthRule.houses,
      supportHouses: mentalHealthRule.supportHouses,
      karakas: mentalHealthRule.karakas,
      divisionalCharts: mentalHealthRule.divisionalCharts,
    };
  }
}
if (topic === "pets") {
  const petsEventType =
    eventType as PetsEventType;

  const petsRule =
    PETS_EVENT_RULES[
      petsEventType
    ];

  if (petsRule) {
    rule = {
      ...rule,
      houses: petsRule.houses,
      supportHouses: petsRule.supportHouses,
      karakas: petsRule.karakas,
      divisionalCharts: petsRule.divisionalCharts,
    };
  }
}

if (topic === "inner") {
  const innerEventType =
    eventType as InnerEventType;

  const innerRule =
    INNER_EVENT_RULES[
      innerEventType
    ];

  if (innerRule) {
    rule = {
      ...rule,
      houses: innerRule.houses,
      supportHouses: innerRule.supportHouses,
      karakas: innerRule.karakas,
      divisionalCharts: innerRule.divisionalCharts,
    };
  }
}
const suppressAdultCareerInference =
  userContext?.lifeStage === "child" &&
  topic === "career" &&
  [
    "job_change",
    "promotion",
    "internal_shift",
    "stability_check",
  ].includes(String(eventType ?? ""));
console.log("========== INFER CAREER INPUT DEBUG ==========");

console.log(
  "report.birth:",
  JSON.stringify(report?.birth ?? null, null, 2)
);

console.log(
  "report.ascendant:",
  JSON.stringify(
    report?.ascendant ??
    report?.lagna ??
    report?.asc ??
    null,
    null,
    2
  )
);

console.log(
  "report.houseLords:",
  JSON.stringify(
    report?.houseLords ??
    report?.lords ??
    null,
    null,
    2
  )
);
console.log(
  "report.natal.houseLords:",
  JSON.stringify(
    report?.natal?.houseLords ?? null,
    null,
    2
  )
);
console.log(
  "report.natal.ascendant:",
  JSON.stringify(
    report?.natal?.ascendant ??
    report?.natal?.lagna ??
    report?.natal?.asc ??
    null,
    null,
    2
  )
);
console.log(
  "report.houses.H6:",
  JSON.stringify(
    report?.houses?.H6 ??
    report?.houses?.[6] ??
    null,
    null,
    2
  )
);

console.log(
  "report.houses.H10:",
  JSON.stringify(
    report?.houses?.H10 ??
    report?.houses?.[10] ??
    null,
    null,
    2
  )
);
console.log(
  "report.natal.houses.H6:",
  JSON.stringify(
    report?.natal?.houses?.H6 ??
    report?.natal?.houses?.[6] ??
    null,
    null,
    2
  )
);

console.log(
  "report.natal.houses.H10:",
  JSON.stringify(
    report?.natal?.houses?.H10 ??
    report?.natal?.houses?.[10] ??
    null,
    null,
    2
  )
);
console.log(
  "report.chartContext ascendant:",
  JSON.stringify(
    report?.chartContext?.ascendant ??
    report?.chartContext?.lagna ??
    report?.chartContext?.asc ??
    null,
    null,
    2
  )
);

console.log(
  "report.chartContext houseLords:",
  JSON.stringify(
    report?.chartContext?.houseLords ??
    report?.chartContext?.lords ??
    null,
    null,
    2
  )
);
console.log(
  "HOUSE KEY CHECK:",
  Object.entries(report?.houses ?? {}).map(([key, value]: [string, any]) => ({
    key,
    actualHouse: value?.house,
    sign: value?.sign,
    lord: value?.lord,
  }))
);
console.log("==============================================");
const careerInference =
  topic === "career" &&
  !suppressAdultCareerInference
    ? inferCareer(report)
    : null;

const promiseLayer =
  buildPromiseLayer(
    report,
    rule
  );

const sambandhaAnalysis =
  buildSambandhaAnalysis({
    report,
    topic,
    eventType,
    rule,
    activeDasha: {
      md: dasha.md,
      ad: dasha.ad,
      pd: dasha.pd,
    },
  });

const divisionalLayer =
  buildDivisionalLayer(
    report,
    topic,
    rule
  );

const karakaLayer =
  buildKarakaLayer(
    report,
    rule
  );

const timingLayer =
  buildTimingLayer(
    report,
    rule,
    topic
  );
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
console.log(
  "========== ASTRO TIMELINE STRUCTURED =========="
);

console.log(
  JSON.stringify(
    astroTimeline.slice(0, 10),
    null,
    2
  )
);

console.log(
  "==============================================="
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
      const rankedTimingWindows =
  rankTimingWindows({
    windows:
      finalTimingWindows,

    topic,

    eventType,

    activeDasha:
      dashaSource ?? null,

    timingPolicy,

    promiseLayer,

    sambandhaAnalysis,

    divisionalLayer,

    karakaLayer,
  });
const activeDashaForDebug =
  dashaSource ??
  getActiveDashaAnyShape(
    report
  );
const nearestWindow =
  finalTimingWindows.length > 0
    ? finalTimingWindows[0]
    : null;

const strongestWindow =
  rankedTimingWindows.length > 0
    ? rankedTimingWindows[0]
    : null;
if (
  topic === "career" &&
  (
    eventType === "job_change" ||
    careerEventType === "job_change"
  )
) {
  
}
const bestRangeWindow =
  rankedTimingWindows.find((w: any) => {
    const start = normalizeTimeKey(
      w?.start ??
      w?.from ??
      w?.startISO
    );

    const end = normalizeTimeKey(
      w?.end ??
      w?.to ??
      w?.endISO
    );

    return (
      start &&
      end &&
      start !== end &&
      (
        w?.windowClass === "outcome" ||
        w?.windowClass === "conversion" ||
        w?.windowClass === "movement" ||
        w?.windowClass === "negotiation" ||
        w?.windowClass === "discussion"
      )
    );
  }) ??
  rankedTimingWindows.find((w: any) => {
    const start = normalizeTimeKey(
      w?.start ??
      w?.from ??
      w?.startISO
    );

    const end = normalizeTimeKey(
      w?.end ??
      w?.to ??
      w?.endISO
    );

    return start && end && start !== end;
  }) ??
  null;

const triggerOnlyWindow =
  bestEventTrigger &&
  bestEventTrigger.confidence !== "low"
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
        practicalMeaning:
          bestEventTrigger.practicalMeaning,
      }
    : null;

const bestAvailableWindow =
  rankedTimingWindows.find(
    (window: any) =>
      window.confidence !== "low" &&
      (
        window.windowClass === "conversion" ||
        window.windowClass === "outcome"
      )
  ) ??
  rankedTimingWindows.find(
    (window: any) =>
      window.confidence !== "low" &&
      window.windowClass === "movement"
  ) ??
  strongestWindow ??
  nearestWindow ??
  triggerOnlyWindow ??
  null;

const selectedTimingWindow =
  bestAvailableWindow ??
  strongestWindow ??
  nearestWindow ??
  null;

const preferredTimingWindow =
  normalizeRankedTimingWindow(
    bestRangeWindow ??
    strongestWindow ??
    nearestWindow ??
    bestAvailableWindow
  );

const finalTimingLayer: AnalysisLayer =
  needsNextLogicalWindow &&
  timingLayer.verdict === "weak"
    ? {
        ...timingLayer,

        summary: preferredTimingWindow
          ? `Current timing is ${
              preferredTimingWindow.confidence === "medium" ||
              preferredTimingWindow.confidence === "high"
                ? "usable but not guaranteed"
                : "weak for immediate conversion"
            }. The strongest available timing clue is ${
              preferredTimingWindow.label
            }, and it should be read as a ${
              preferredTimingWindow.confidence ?? "low"
            }-confidence ${
              preferredTimingWindow.windowClass ?? "movement"
            } window, not a guaranteed final outcome.`
          : "Current timing is weak for immediate conversion, and no reliable future window is visible from the available dasha, transit, or timeline data.",

        bullets: preferredTimingWindow
          ? [
              `Best available timing clue: ${
                preferredTimingWindow.label
              }`,

              ...(preferredTimingWindow.why ?? [])
                .slice(0, 2),

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
  sambandhaAnalysis,
  divisionalLayer,
  karakaLayer,
  timingLayer: finalTimingLayer,
  bestAvailableWindow,
});

const promotionConversionEngine =
  topic === "career" && eventType === "promotion"
    ? buildPromotionConversionEngine({
        promiseLayer,
        sambandhaAnalysis,
        divisionalLayer,
        karakaLayer,
        timingLayer: finalTimingLayer,
        bestAvailableWindow,
      })
    : null;
 
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
  
  const currentDashaPacket = {
    md: dasha.md,
    ad: dasha.ad,
    pd: dasha.pd,
    line: [dasha.md, dasha.ad, dasha.pd].filter(Boolean).join(" • ") || "Not clear",
  };

  const astrologyEvidencePacket = buildAstrologyEvidencePacket({
    topic,
    eventType,
    questionType,
    rule,
    report,
    promiseLayer,
    sambandhaAnalysis,
    divisionalLayer,
    karakaLayer,
    timingLayer: finalTimingLayer,
    timingPolicy,
    currentDasha: currentDashaPacket,
    rankedTimingWindows,
    eventTriggers,
    conversionDiagnosisV2,
  });

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
    sambandhaAnalysis,
    divisionalLayer,
    divisionalBreakdown: divisionalLayer.chartBreakdown,
    divisionalAnalysis: divisionalLayer.analysis,
    astrologyEvidencePacket,
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

  decisionSummary?: any;
  timingHierarchy?: any;
  eventLifecycle?: any;
  planetReasoning?: any;
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
  decisionSummary, 
  timingHierarchy,
  eventLifecycle,
  planetReasoning,
  distressed,
  finalDecisionLine,
  finalDecisionVerdict,
} = params;
  const { tone, depth } = pickToneAndDepth(question, topic);

  return {
  userQuestion: question,
  topic,
  questionType,

  decisionSummary:
    decisionSummary ?? null,

  timingHierarchy:
    timingHierarchy ?? null,

  eventLifecycle:
    eventLifecycle ?? null,
   planetReasoning:
    planetReasoning ?? null,

  verdict:
    astroBundle.verdict ?? null,

  humanReason:
    astroBundle.humanReason ?? null,

  astroReason:
    astroBundle.astroReason ?? null,
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
      sambandhaAnalysis: astroBundle.sambandhaAnalysis,
      explainabilityProfile: astroBundle.explainabilityProfile ?? null,
      divisionalLayer: astroBundle.divisionalLayer,
      divisionalBreakdown: astroBundle.divisionalBreakdown ?? [],
      divisionalAnalysis:
  astroBundle.divisionalAnalysis ??
  astroBundle.divisionalLayer ??
  null,
      astrologyEvidencePacket: astroBundle.astrologyEvidencePacket ?? null,
      reasoningInstructions: {
        hierarchy: [
          "Judge the D1 natal promise first.",
          "Judge planetary relationships (Sambandha) second and state the exact supplied links.",
          "Use the relevant divisional chart as confirmation, not as a replacement for D1.",
          "Use dasha activation fourth and transit triggering fifth.",
          "Use the six-pillar explainability profile to distinguish movement from final conversion.",
          "Separate preparation, activation, movement, conversion, and stable outcome.",
          "Resolve contradictions explicitly instead of averaging them.",
        ],
        prohibitions: [
          "Do not invent placements, aspects, yogas, dignities, dashas, or dates.",
          "Do not say divisional analysis is incomplete unless astrologyEvidencePacket.completeness or missingData explicitly shows missing required data.",
          "Do not treat transit activity as a guaranteed durable outcome.",
          "Do not give a sharp date when the timing packet has low confidence.",
          "Never describe a divisional chart, divisional support, or divisional confirmation as weak, poor, bad, incomplete, or insufficient in user-facing language.",
          "Translate low or unclear divisional support into holistic language such as: the broader chart picture places limited emphasis on this theme, the supporting factors do not strongly reinforce it, or its expression may be uneven.",
          "Do not expose implementation variable names or raw JSON labels.",
          "Do show user-friendly headings for Natal Promise, Planetary Relationships, Divisional Confirmation, Current Dasha, Transit Trigger, and Conversion Assessment.",
          "Do not use generic phrases such as natal and divisional charts support this when exact supplied references are available.",
        ],
        answerOrder: [
          "Direct answer",
          "Strongest supporting and blocking evidence",
          "Broader supporting chart picture",
          "Timing and event stage",
          "Practical guidance and caution",
        ],
      },
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
    const requestURL = new URL(req.url);

const matcherDevMode =
  process.env.NODE_ENV !== "production" &&
  requestURL.searchParams.get("matcherDev") === "1";
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

    if (
  !matcherDevMode &&
  !entitlements.askSarathi.allowed
) {
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
    console.log("[PROFILE DEBUG]", {
  rawProfile,
  profile,
  profileOk,
});
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
  detectedTopic !== "generic"
    ? detectedTopic
    : (vagueTimingFollowup || isStrongFollowup || continuation) &&
      conversationState.lastTopic
    ? conversationState.lastTopic
    : inferredFollowupTopic
    ? inferredFollowupTopic
    : "generic";
    if (!matcherDevMode) {
await logQuestionUsage({
  userId: user.id,
  question,
  topic,
});
}
console.log("[TOPIC PRIORITY DEBUG]", {
  question,
  detectedTopic,
  inferredFollowupTopic,
  lastTopic: conversationState.lastTopic ?? null,
  vagueTimingFollowup,
  isStrongFollowup,
  continuation,
  finalTopic: topic,
});
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
    

const enrichedReport: any = {
  ...(report ?? {}),

  chartContext:
    sarathiContext?.chart ??
    report ??
    null,

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
const userContext =
  buildUserContext(
    enrichedReport?.birth?.dateISO ??
    enrichedReport?.birth?.date ??
    report?.birth?.dateISO ??
    report?.birth?.date ??
    null
  );
  if (body.qaRoutingOnly === true) {
  return Response.json({
    question,
    topic,
    questionType,
    timeDirection,
    eventType,
    userContext,
  });
}
  console.log(
  "[USER CONTEXT]",
  JSON.stringify(userContext, null, 2)
);
const astroBundle = buildGenericAstroBundle(
  question,
  topic,
  questionType,
  answerMode,
  enrichedReport,
  careerEventType,
  userContext
);

console.log("==================================================");
console.log("========== ASTRO BUNDLE DEBUG ==========");

console.log("Topic:", astroBundle.topic);
console.log("Event:", astroBundle.eventType);
console.log("Career Event:", astroBundle.careerEventType);

console.log(
  "Canonical Context:",
  JSON.stringify(astroBundle.canonicalChartContext, null, 2)
);

console.log(
  "Career Inference:",
  JSON.stringify(astroBundle.careerInference, null, 2)
);

console.log(
  "Answer Summary:",
  astroBundle.answerSummary
);

console.log("========================================");
astroBundle.canonicalChartContext =
  buildCanonicalChartContext(enrichedReport);
astroBundle.decision = buildAstroDecision({
  bundle: astroBundle,
  chartContext: astroBundle.canonicalChartContext,
});
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
console.log("========== DASHA OPPORTUNITY DEBUG ==========");

console.log(
  "Current Dasha:",
  JSON.stringify(
    astroBundle?.currentDasha ?? null,
    null,
    2
  )
);

console.log(
  "Timing Policy:",
  JSON.stringify(
    astroBundle?.timingPolicy ?? null,
    null,
    2
  )
);

console.log(
  "Major Windows:",
  JSON.stringify(
    astroBundle?.majorWindows ?? null,
    null,
    2
  )
);

console.log(
  "Astro Timeline:",
  JSON.stringify(
    astroBundle?.astroTimeline ?? null,
    null,
    2
  )
);

console.log(
  "Timing Layer:",
  JSON.stringify(
    astroBundle?.timingLayer ?? null,
    null,
    2
  )
);

console.log(
  "Promise Layer:",
  JSON.stringify(
    astroBundle?.promiseLayer ?? null,
    null,
    2
  )
);

console.log("============================================");
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

  astroBundle.explainabilityProfile =
    buildSixPillarExplainabilityProfile(astroBundle);

  const structuredExplainabilityEvidence =
    buildStructuredEvidence(
      astroBundle,
      astroBundle.explainabilityProfile
    );

   astroBundle.evidenceBullets = [
  ...(astroBundle.evidenceBullets ?? []),
  ...structuredExplainabilityEvidence,

  astroBundle.decision
    ? `Decision guidance — ${astroBundle.decision.headline} ${astroBundle.decision.rationale}`
    : "",

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

  astroBundle.explainabilityProfile
    ? `Astrological evidence strength: ${astroBundle.explainabilityProfile.overallScore}/100; near-term movement support: ${astroBundle.explainabilityProfile.movementScore}/100; final conversion support: ${astroBundle.explainabilityProfile.conversionScore}/100.`
    : "",

  ...(astroBundle.explainabilityProfile?.evidenceReferences ?? [])
    .slice(0, 12)
    .map((reference) => `Evidence reference: ${reference}`),

  astroBundle.sambandhaAnalysis?.summary
    ? `Planetary connectivity: ${astroBundle.sambandhaAnalysis.summary} Connectivity score: ${astroBundle.sambandhaAnalysis.connectivityScore}/100; dasha connectivity: ${astroBundle.sambandhaAnalysis.dashaConnectivityScore}/100.`
    : "",

  ...(astroBundle.sambandhaAnalysis?.supportiveLinks ?? [])
    .slice(0, 4)
    .map(
      (relationship) =>
        `Sambandha evidence: ${relationship.reason}`
    ),

  astroBundle.divisionalLayer?.summary
    ? `Divisional support: ${astroBundle.divisionalLayer.summary}`
    : "",

  astroBundle.astrologyEvidencePacket
    ? `Evidence packet completeness: ${
        astroBundle.astrologyEvidencePacket.completeness.complete
          ? "complete"
          : "limited"
      }; missing data: ${
        astroBundle.astrologyEvidencePacket.missingData.join(", ") || "none"
      }.`
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
 const astroChatV2Preview =
  tryRunAstroChatV2({
    question,
    bundle: astroBundle,
  });


const chartFactsPreview =
  buildChartFacts(
    astroBundle
  );

const intelligencePreview =
  buildAstrologyIntelligenceEngine(
    chartFactsPreview
  );

const businessIntelligenceSummary =
  buildBusinessIntelligenceSummary(
    intelligencePreview
  );


       const isProfessionQuestion =
  astroBundle.careerEventType === "profession_identity";

/*

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

*/


const domainIntelligenceContext =
  buildDomainIntelligenceContext({
    domain:
      topic,

    intelligence:
      intelligencePreview,
  });
 
  

const isProfessionIdentity =
  astroBundle.careerEventType === "profession_identity";

const isRelationshipPermanent =
  (
    astroBundle.topic === "relationships" ||
    astroBundle.topic === "marriage"
  ) &&
  [
    "relationship_suitability",
    "partner_profile",
    "relationship_pattern",
    "love_vs_arranged",
  ].includes(
    String(astroBundle.eventType ?? "")
  );
const isWealthPermanent =
  astroBundle.topic === "money" &&
  [
    "wealth_potential",
    "earning_style",
    "wealth_pattern",
    "saving_capacity",
    "investment_suitability",
    "multiple_income",
  ].includes(
    String(astroBundle.eventType ?? "")
  );
const isBusinessPermanent =
  astroBundle.topic === "business" &&
  [
    "business_suitability",
    "business_style",
    "business_vs_job",
    "partnership_suitability",
    "entrepreneurial_pattern",
  ].includes(
    String(astroBundle.eventType ?? "")
  );
const isEducationPermanent =
  astroBundle.topic === "education" &&
  [
    "education_suitability",
    "subject_fit",
    "stream_choice",
    "study_pattern",
  ].includes(
    String(astroBundle.eventType ?? "")
  );
const isSpiritualPermanent =
  astroBundle.topic === "spiritual" &&
  [
    "spiritual_inclination",
    "spiritual_path",
    "devotional_style",
    "meditation_suitability",
    "mantra_suitability",
    "guru_pattern",
  ].includes(
    String(astroBundle.eventType ?? "")
  );
const isHealthPermanent =
  astroBundle.topic === "health" &&
  [
    "health_constitution",
    "health_sensitivity",
    "stress_pattern",
    "recovery_capacity",
    "lifestyle_pattern",
  ].includes(
    String(astroBundle.eventType ?? "")
  );
const isChildPermanent =
  astroBundle.topic === "child" &&
  [
    "parenthood_potential",
    "parenting_style",
    "child_relationship_pattern",
    "child_aptitude",
  ].includes(
    String(astroBundle.eventType ?? "")
  );
  const isPropertyPermanent =
  astroBundle.topic === "property" &&
  [
    "property_potential",
    "property_investment_suitability",
    "property_pattern",
    "home_stability",
  ].includes(
    String(astroBundle.eventType ?? "")
  );
  const isVehiclePermanent =
  astroBundle.topic === "vehicle" &&
  [
    "vehicle_potential",
    "vehicle_preference",
    "vehicle_pattern",
  ].includes(
    String(astroBundle.eventType ?? "")
  );
const isRelocationPermanent =
  astroBundle.topic === "relocation" &&
  [
    "relocation_potential",
    "foreign_settlement_potential",
    "relocation_pattern",
    "location_preference",
  ].includes(
    String(astroBundle.eventType ?? "")
  );
const isDisputePermanent =
  astroBundle.topic === "disputes" &&
  [
    "conflict_pattern",
    "legal_suitability",
    "negotiation_style",
    "litigation_pattern",
  ].includes(
    String(astroBundle.eventType ?? "")
  );
const isParentsPermanent =
  astroBundle.topic === "parents" &&
  [
    "parent_relationship_pattern",
    "mother_relationship",
    "father_relationship",
    "parental_influence",
    "family_elder_pattern",
  ].includes(
    String(astroBundle.eventType ?? "")
  );

const isSiblingsPermanent =
  astroBundle.topic === "siblings" &&
  [
    "sibling_relationship_pattern",
    "elder_sibling_pattern",
    "younger_sibling_pattern",
    "sibling_support",
  ].includes(
    String(astroBundle.eventType ?? "")
  );
const isTravelPermanent =
  astroBundle.topic === "travel" &&
  [
    "travel_inclination",
    "foreign_travel_pattern",
    "frequent_travel_pattern",
    "pilgrimage_pattern",
  ].includes(
    String(astroBundle.eventType ?? "")
  );
const isReputationPermanent =
  astroBundle.topic === "reputation" &&
  [
    "reputation_potential",
    "public_image_pattern",
    "recognition_pattern",
    "visibility_style",
  ].includes(
    String(astroBundle.eventType ?? "")
  );  
  const isDebtPermanent =
  astroBundle.topic === "debt" &&
  [
    "debt_pattern",
    "borrowing_tendency",
    "repayment_capacity",
    "liability_pattern",
  ].includes(
    String(astroBundle.eventType ?? "")
  );
const isInheritancePermanent =
  astroBundle.topic === "inheritance" &&
  [
    "inheritance_potential",
    "ancestral_pattern",
    "legacy_pattern",
    "inheritance_conflict_pattern",
  ].includes(
    String(astroBundle.eventType ?? "")
  );
  const isMentalHealthPermanent =
  astroBundle.topic === "mental_health" &&
  [
    "mental_emotional_pattern",
    "overthinking_pattern",
    "mood_sensitivity",
    "stress_resilience",
    "emotional_regulation_pattern",
  ].includes(
    String(astroBundle.eventType ?? "")
  );
const isPetsPermanent =
  astroBundle.topic === "pets" &&
  [
    "pet_relationship_pattern",
    "pet_caregiving_style",
    "pet_responsibility_pattern",
  ].includes(
    String(astroBundle.eventType ?? "")
  );

const isInnerPermanent =
  astroBundle.topic === "inner" &&
  [
    "life_direction_pattern",
    "purpose_pattern",
    "inner_conflict_pattern",
    "self_understanding_pattern",
    "meaning_pattern",
  ].includes(
    String(astroBundle.eventType ?? "")
  );
const isChildCareerTimingGuard =
  userContext?.lifeStage === "child" &&
  topic === "career" &&
  [
    "job_change",
    "promotion",
    "internal_shift",
    "stability_check",
  ].includes(
    String(astroBundle?.eventType ?? eventType ?? "")
  );
const isChildParenthoodTimingGuard =
  userContext?.lifeStage === "child" &&
  topic === "child" &&
  [
    "conception_timing",
    "childbirth_timing",
    "child_development_timing",
  ].includes(
    String(astroBundle?.eventType ?? eventType ?? "")
  );
const isChildMarriageTimingGuard =
  userContext?.lifeStage === "child" &&
  (
    topic === "marriage" ||
    topic === "relationships"
  ) &&
  [
    "marriage_timing",
    "marriage_commitment",
    "meeting_partner",
    "new_relationship",
  ].includes(
    String(astroBundle?.eventType ?? eventType ?? "")
  );
const shouldSuppressTiming =
  isProfessionIdentity ||
  isRelationshipPermanent ||
  isWealthPermanent ||
  isBusinessPermanent ||
  isEducationPermanent ||
  isSpiritualPermanent ||
  isHealthPermanent ||
  isChildPermanent ||
  isPropertyPermanent ||
  isVehiclePermanent ||
  isRelocationPermanent ||
  isDisputePermanent ||
  isParentsPermanent ||
  isSiblingsPermanent ||
  isTravelPermanent ||
  isReputationPermanent ||
  isDebtPermanent ||
  isInheritancePermanent ||
  isMentalHealthPermanent ||
  isPetsPermanent ||
  isInnerPermanent ||
 isChildCareerTimingGuard ||
  isChildParenthoodTimingGuard ||
  isChildMarriageTimingGuard;
const timingHierarchy =
  buildTimingHierarchy(
    astroBundle
  );
  console.log(
  "========== TIMING HIERARCHY =========="
);

console.log(
  JSON.stringify(
    timingHierarchy,
    null,
    2
  )
);

console.log(
  "======================================"
);
const eventLifecycle =
  buildEventLifecycle(
    astroBundle,
    timingHierarchy
  );

const decisionSummary =
  buildDecisionSummary({
    astroBundle,
    questionType,
    topic,
    eventType,
    shouldSuppressTiming,
    eventLifecycle,
  });
if (body?.lifecycleDebugOnly === true) {
  return Response.json({
    ok: true,
    question,
    topic,
    questionType,
    timeDirection,
    eventType,
    eventLifecycle,
    decisionSummary,
  });
}
const planetReasoning =
  buildPlanetReasoning({
    planets:
      astroBundle?.karakas ?? [],

    primaryPlanets:
      Array.isArray(astroBundle?.karakas)
        ? astroBundle.karakas.slice(0, 2)
        : [],

    source:
      "event karakas and active timing factors",
  });
const finalDecision = buildFinalAnswerDecision({
  topic,
  questionType,
  timeDirection,
  careerEventType: astroBundle.careerEventType,
  windows: astroBundle.timingWindows,
  timingLayer: astroBundle.timingLayer,
  timingPolicy: astroBundle.timingPolicy,
  confidence: astroBundle.confidence,
  decisionSummary,
});
  const natPayload = buildNaturalizePayload({
  question,
  topic,
  questionType,
  decisionSummary,
  timingHierarchy,
  eventLifecycle,
  planetReasoning,
  report: enrichedReport,
  astroBundle,
  distressed,
  simpleGuidanceMode,
  finalDecisionLine: finalDecision.line,
  finalDecisionVerdict: finalDecision.verdict,
});
console.log("[CHILD CAREER GUARD DEBUG]", {
  age: userContext?.age ?? null,
  lifeStage: userContext?.lifeStage ?? null,
  topic,
  eventType,
  astroBundleEventType: astroBundle?.eventType ?? null,
  isChildCareerTimingGuard,
  shouldSuppressTiming,
});
console.log("[CHILD MARRIAGE GUARD DEBUG]", {
  age: userContext?.age ?? null,
  lifeStage: userContext?.lifeStage ?? null,
  topic,
  eventType,
  astroBundleEventType: astroBundle?.eventType ?? null,
  isChildMarriageTimingGuard,
  shouldSuppressTiming,
});
console.log("[CHILD MARRIAGE GUARD DEBUG]", {
  age: userContext?.age ?? null,
  lifeStage: userContext?.lifeStage ?? null,
  topic,
  eventType,
  astroBundleEventType: astroBundle?.eventType ?? null,
  isChildMarriageTimingGuard,
  shouldSuppressTiming,
});
/*
  Profession suitability must use permanent vocational evidence only.
  Do not pass event timing, dasha timing, transit timing, conversion,
  trigger windows, or timing explainability into Naturalize.
*/
const professionCareerInference =
  isProfessionIdentity &&
  astroBundle?.careerInference
    ? {
        ...astroBundle.careerInference,

        blockers:
          Array.isArray(
            astroBundle.careerInference.blockers
          )
            ? astroBundle.careerInference.blockers.filter(
                (item: string) =>
                  !/\b(dasha|transit|timing|window|activation)\b/i.test(
                    item
                  )
              )
            : [],
      }
    : astroBundle?.careerInference ?? null;
const professionAstroFacts =
  isProfessionIdentity
    ? {
        topic:
          astroBundle?.topic ?? topic,

        questionType,

        eventType:
          astroBundle?.careerEventType ?? null,

        careerInference:
  professionCareerInference,

        promiseLayer:
          astroBundle?.promiseLayer ?? null,

        sambandhaAnalysis:
          astroBundle?.sambandhaAnalysis ?? null,

        divisionalLayer:
          astroBundle?.divisionalLayer ?? null,

        divisionalAnalysis:
          astroBundle?.divisionalAnalysis ?? null,

        karakaLayer:
          astroBundle?.karakaLayer ?? null,

        chartRealityProfile:
          astroBundle?.chartRealityProfile ?? null,
      }
    : null;
const relationshipAstroFacts =
  isRelationshipPermanent
    ? {
        topic:
          astroBundle?.topic ?? topic,

        questionType,

        eventType:
          astroBundle?.eventType ?? null,

        promiseLayer:
          astroBundle?.promiseLayer ?? null,

        sambandhaAnalysis:
          astroBundle?.sambandhaAnalysis ?? null,

        divisionalLayer:
          astroBundle?.divisionalLayer ?? null,

        divisionalAnalysis:
          astroBundle?.divisionalAnalysis ?? null,

        karakaLayer:
          astroBundle?.karakaLayer ?? null,

        chartRealityProfile:
          astroBundle?.chartRealityProfile ?? null,
      }
    : null;
const wealthAstroFacts =
  isWealthPermanent
    ? {
        topic:
          astroBundle?.topic ?? topic,

        questionType,

        eventType:
          astroBundle?.eventType ?? null,

        promiseLayer:
          astroBundle?.promiseLayer ?? null,

        sambandhaAnalysis:
          astroBundle?.sambandhaAnalysis ?? null,

        divisionalLayer:
          astroBundle?.divisionalLayer ?? null,

        divisionalAnalysis:
          astroBundle?.divisionalAnalysis ?? null,

        karakaLayer:
          astroBundle?.karakaLayer ?? null,

        chartRealityProfile:
          astroBundle?.chartRealityProfile ?? null,
      }
    : null;
const businessAstroFacts =
  isBusinessPermanent
    ? {
        topic:
          astroBundle?.topic ?? topic,

        questionType,

        eventType:
          astroBundle?.eventType ?? null,

        promiseLayer:
          astroBundle?.promiseLayer ?? null,

        sambandhaAnalysis:
          astroBundle?.sambandhaAnalysis ?? null,

        divisionalLayer:
          astroBundle?.divisionalLayer ?? null,

        divisionalAnalysis:
          astroBundle?.divisionalAnalysis ?? null,

        karakaLayer:
          astroBundle?.karakaLayer ?? null,

        chartRealityProfile:
          astroBundle?.chartRealityProfile ?? null,
      }
    : null;
const educationAstroFacts =
  isEducationPermanent
    ? {
        topic:
          astroBundle?.topic ?? topic,

        questionType,

        eventType:
          astroBundle?.eventType ?? null,

        promiseLayer:
          astroBundle?.promiseLayer ?? null,

        sambandhaAnalysis:
          astroBundle?.sambandhaAnalysis ?? null,

        divisionalLayer:
          astroBundle?.divisionalLayer ?? null,

        divisionalAnalysis:
          astroBundle?.divisionalAnalysis ?? null,

        karakaLayer:
          astroBundle?.karakaLayer ?? null,

        chartRealityProfile:
          astroBundle?.chartRealityProfile ?? null,
      }
    : null;
const spiritualAstroFacts =
  isSpiritualPermanent
    ? {
        topic:
          astroBundle?.topic ?? topic,

        questionType,

        eventType:
          astroBundle?.eventType ?? null,

        promiseLayer:
          astroBundle?.promiseLayer ?? null,

        sambandhaAnalysis:
          astroBundle?.sambandhaAnalysis ?? null,

        divisionalLayer:
          astroBundle?.divisionalLayer ?? null,

        divisionalAnalysis:
          astroBundle?.divisionalAnalysis ?? null,

        karakaLayer:
          astroBundle?.karakaLayer ?? null,

        chartRealityProfile:
          astroBundle?.chartRealityProfile ?? null,
      }
    : null;
const healthAstroFacts =
  isHealthPermanent
    ? {
        topic:
          astroBundle?.topic ?? topic,

        questionType,

        eventType:
          astroBundle?.eventType ?? null,

        promiseLayer:
          astroBundle?.promiseLayer ?? null,

        sambandhaAnalysis:
          astroBundle?.sambandhaAnalysis ?? null,

        divisionalLayer:
          astroBundle?.divisionalLayer ?? null,

        divisionalAnalysis:
          astroBundle?.divisionalAnalysis ?? null,

        karakaLayer:
          astroBundle?.karakaLayer ?? null,

        chartRealityProfile:
          astroBundle?.chartRealityProfile ?? null,
      }
    : null;
const childAstroFacts =
  isChildPermanent
    ? {
        topic:
          astroBundle?.topic ?? topic,

        questionType,

        eventType:
          astroBundle?.eventType ?? null,

        promiseLayer:
          astroBundle?.promiseLayer ?? null,

        sambandhaAnalysis:
          astroBundle?.sambandhaAnalysis ?? null,

        divisionalLayer:
          astroBundle?.divisionalLayer ?? null,

        divisionalAnalysis:
          astroBundle?.divisionalAnalysis ?? null,

        karakaLayer:
          astroBundle?.karakaLayer ?? null,

        chartRealityProfile:
          astroBundle?.chartRealityProfile ?? null,
      }
    : null;
const propertyAstroFacts =
  isPropertyPermanent
    ? {
        topic:
          astroBundle?.topic ?? topic,

        questionType,

        eventType:
          astroBundle?.eventType ?? null,

        promiseLayer:
          astroBundle?.promiseLayer ?? null,

        sambandhaAnalysis:
          astroBundle?.sambandhaAnalysis ?? null,

        divisionalLayer:
          astroBundle?.divisionalLayer ?? null,

        divisionalAnalysis:
          astroBundle?.divisionalAnalysis ?? null,

        karakaLayer:
          astroBundle?.karakaLayer ?? null,

        chartRealityProfile:
          astroBundle?.chartRealityProfile ?? null,
      }
    : null;
const vehicleAstroFacts =
  isVehiclePermanent
    ? {
        topic:
          astroBundle?.topic ?? topic,

        questionType,

        eventType:
          astroBundle?.eventType ?? null,

        promiseLayer:
          astroBundle?.promiseLayer ?? null,

        sambandhaAnalysis:
          astroBundle?.sambandhaAnalysis ?? null,

        divisionalLayer:
          astroBundle?.divisionalLayer ?? null,

        divisionalAnalysis:
          astroBundle?.divisionalAnalysis ?? null,

        karakaLayer:
          astroBundle?.karakaLayer ?? null,

        chartRealityProfile:
          astroBundle?.chartRealityProfile ?? null,
      }
    : null;
const relocationAstroFacts =
  isRelocationPermanent
    ? {
        topic:
          astroBundle?.topic ?? topic,

        questionType,

        eventType:
          astroBundle?.eventType ?? null,

        promiseLayer:
          astroBundle?.promiseLayer ?? null,

        sambandhaAnalysis:
          astroBundle?.sambandhaAnalysis ?? null,

        divisionalLayer:
          astroBundle?.divisionalLayer ?? null,

        divisionalAnalysis:
          astroBundle?.divisionalAnalysis ?? null,

        karakaLayer:
          astroBundle?.karakaLayer ?? null,

        chartRealityProfile:
          astroBundle?.chartRealityProfile ?? null,
      }
    : null;
const disputeAstroFacts =
  isDisputePermanent
    ? {
        topic:
          astroBundle?.topic ?? topic,

        questionType,

        eventType:
          astroBundle?.eventType ?? null,

        promiseLayer:
          astroBundle?.promiseLayer ?? null,

        sambandhaAnalysis:
          astroBundle?.sambandhaAnalysis ?? null,

        divisionalLayer:
          astroBundle?.divisionalLayer ?? null,

        divisionalAnalysis:
          astroBundle?.divisionalAnalysis ?? null,

        karakaLayer:
          astroBundle?.karakaLayer ?? null,

        chartRealityProfile:
          astroBundle?.chartRealityProfile ?? null,
      }
    : null;
const parentsAstroFacts =
  isParentsPermanent
    ? {
        topic:
          astroBundle?.topic ?? topic,

        questionType,

        eventType:
          astroBundle?.eventType ?? null,

        promiseLayer:
          astroBundle?.promiseLayer ?? null,

        sambandhaAnalysis:
          astroBundle?.sambandhaAnalysis ?? null,

        divisionalLayer:
          astroBundle?.divisionalLayer ?? null,

        divisionalAnalysis:
          astroBundle?.divisionalAnalysis ?? null,

        karakaLayer:
          astroBundle?.karakaLayer ?? null,

        chartRealityProfile:
          astroBundle?.chartRealityProfile ?? null,
      }
    : null;

const siblingsAstroFacts =
  isSiblingsPermanent
    ? {
        topic:
          astroBundle?.topic ?? topic,

        questionType,

        eventType:
          astroBundle?.eventType ?? null,

        promiseLayer:
          astroBundle?.promiseLayer ?? null,

        sambandhaAnalysis:
          astroBundle?.sambandhaAnalysis ?? null,

        divisionalLayer:
          astroBundle?.divisionalLayer ?? null,

        divisionalAnalysis:
          astroBundle?.divisionalAnalysis ?? null,

        karakaLayer:
          astroBundle?.karakaLayer ?? null,

        chartRealityProfile:
          astroBundle?.chartRealityProfile ?? null,
      }
    : null;
const travelAstroFacts =
  isTravelPermanent
    ? {
        topic:
          astroBundle?.topic ?? topic,

        questionType,

        eventType:
          astroBundle?.eventType ?? null,

        promiseLayer:
          astroBundle?.promiseLayer ?? null,

        sambandhaAnalysis:
          astroBundle?.sambandhaAnalysis ?? null,

        divisionalLayer:
          astroBundle?.divisionalLayer ?? null,

        divisionalAnalysis:
          astroBundle?.divisionalAnalysis ?? null,

        karakaLayer:
          astroBundle?.karakaLayer ?? null,

        chartRealityProfile:
          astroBundle?.chartRealityProfile ?? null,
      }
    : null;
const reputationAstroFacts =
  isReputationPermanent
    ? {
        topic:
          astroBundle?.topic ?? topic,

        questionType,

        eventType:
          astroBundle?.eventType ?? null,

        promiseLayer:
          astroBundle?.promiseLayer ?? null,

        sambandhaAnalysis:
          astroBundle?.sambandhaAnalysis ?? null,

        divisionalLayer:
          astroBundle?.divisionalLayer ?? null,

        divisionalAnalysis:
          astroBundle?.divisionalAnalysis ?? null,

        karakaLayer:
          astroBundle?.karakaLayer ?? null,

        chartRealityProfile:
          astroBundle?.chartRealityProfile ?? null,
      }
    : null;
const debtAstroFacts =
  isDebtPermanent
    ? {
        topic:
          astroBundle?.topic ?? topic,

        questionType,

        eventType:
          astroBundle?.eventType ?? null,

        promiseLayer:
          astroBundle?.promiseLayer ?? null,

        sambandhaAnalysis:
          astroBundle?.sambandhaAnalysis ?? null,

        divisionalLayer:
          astroBundle?.divisionalLayer ?? null,

        divisionalAnalysis:
          astroBundle?.divisionalAnalysis ?? null,

        karakaLayer:
          astroBundle?.karakaLayer ?? null,

        chartRealityProfile:
          astroBundle?.chartRealityProfile ?? null,
      }
    : null;
const inheritanceAstroFacts =
  isInheritancePermanent
    ? {
        topic:
          astroBundle?.topic ?? topic,

        questionType,

        eventType:
          astroBundle?.eventType ?? null,

        promiseLayer:
          astroBundle?.promiseLayer ?? null,

        sambandhaAnalysis:
          astroBundle?.sambandhaAnalysis ?? null,

        divisionalLayer:
          astroBundle?.divisionalLayer ?? null,

        divisionalAnalysis:
          astroBundle?.divisionalAnalysis ?? null,

        karakaLayer:
          astroBundle?.karakaLayer ?? null,

        chartRealityProfile:
          astroBundle?.chartRealityProfile ?? null,
      }
    : null;
const mentalHealthAstroFacts =
  isMentalHealthPermanent
    ? {
        topic:
          astroBundle?.topic ?? topic,

        questionType,

        eventType:
          astroBundle?.eventType ?? null,

        promiseLayer:
          astroBundle?.promiseLayer ?? null,

        sambandhaAnalysis:
          astroBundle?.sambandhaAnalysis ?? null,

        divisionalLayer:
          astroBundle?.divisionalLayer ?? null,

        divisionalAnalysis:
          astroBundle?.divisionalAnalysis ?? null,

        karakaLayer:
          astroBundle?.karakaLayer ?? null,

        chartRealityProfile:
          astroBundle?.chartRealityProfile ?? null,
      }
    : null;
const petsAstroFacts =
  isPetsPermanent
    ? {
        topic:
          astroBundle?.topic ?? topic,

        questionType,

        eventType:
          astroBundle?.eventType ?? null,

        promiseLayer:
          astroBundle?.promiseLayer ?? null,

        sambandhaAnalysis:
          astroBundle?.sambandhaAnalysis ?? null,

        divisionalLayer:
          astroBundle?.divisionalLayer ?? null,

        divisionalAnalysis:
          astroBundle?.divisionalAnalysis ?? null,

        karakaLayer:
          astroBundle?.karakaLayer ?? null,

        chartRealityProfile:
          astroBundle?.chartRealityProfile ?? null,
      }
    : null;

const innerAstroFacts =
  isInnerPermanent
    ? {
        topic:
          astroBundle?.topic ?? topic,

        questionType,

        eventType:
          astroBundle?.eventType ?? null,

        promiseLayer:
          astroBundle?.promiseLayer ?? null,

        sambandhaAnalysis:
          astroBundle?.sambandhaAnalysis ?? null,

        divisionalLayer:
          astroBundle?.divisionalLayer ?? null,

        divisionalAnalysis:
          astroBundle?.divisionalAnalysis ?? null,

        karakaLayer:
          astroBundle?.karakaLayer ?? null,

        chartRealityProfile:
          astroBundle?.chartRealityProfile ?? null,
      }
    : null;
const normalAstroFacts =
  natPayload?.astroFacts ??
  astroBundle;

const normalEvidencePacket =
  astroBundle?.astrologyEvidencePacket ??
  natPayload?.astroFacts?.astrologyEvidencePacket ??
  null;

/*
  Domain intelligence itself is useful for profession suitability,
  but its generic instructions currently mention dasha/transit.
  Replace those instructions with profession-only instructions.
*/
const domainIntelligenceForNaturalize =
  domainIntelligenceContext.available
    ? isProfessionIdentity
      ? {
          ...domainIntelligenceContext,

          instructions: [
            "Judge the requested profession from long-term natural suitability.",
            "Use capability fit, natal career promise, planetary relationships, and divisional confirmation.",
            "Explain the strongest capabilities supporting the requested profession.",
            "Explain meaningful capability gaps or cautions.",
            "Compare stronger alternative professions only when that comparison helps clarify the result.",
            "Do not use current dasha, transits, timing windows, activation periods, career movement, promotion timing, or trigger dates.",
            "Do not treat present timing as evidence for or against permanent professional suitability.",
            "Do not expose internal engine names, JSON fields, or implementation details.",
            "Do not expose raw internal scores unless the user explicitly asks for scoring.",
          ],
        }
      : domainIntelligenceContext
    : null;

const professionReasoningInstructions = {
  directAnswerFirst: true,

  resolveContradictions: true,

  neverInventAstrology: true,

  onlyClaimMissingDivisionalDataWhenExplicitlyMissing:
    true,

  suitabilityOnly: true,

  timingSuppressed: true,

  rules: [
    "Answer profession suitability as a long-term vocational question.",
    "Judge enduring aptitude before any temporary timing condition.",
    "Use only supplied natal, capability, Sambandha, karaka, and divisional evidence.",
    "Do not discuss dasha, transit, timing windows, trigger dates, current career movement, promotion, visibility cycles, or breakthrough periods.",
    "Do not turn a profession-suitability question into a timing or career-change answer.",
    "If the user wants timing, wait until they explicitly ask when to study, qualify, transition, launch, or practise professionally.",
    "Adapt practical guidance to userContext.age, userContext.lifeStage, userContext.careerStage, and userContext.adviceStyle.",
    "For a child, discuss aptitude, subjects, reading, debate, writing, reasoning, hobbies, values, and skill development. Do not speak as though the child is already employed or making an immediate professional move.",
    "For a student, discuss education choices, degree paths, competitions, internships, certifications, and skill development.",
    "For an early-career adult, discuss entry routes, specialization, practical experience, and career development.",
    "For a mid-career adult, discuss leadership, specialization, strategic transitions, entrepreneurship, or advancement where relevant.",
    "For a late-career adult, discuss consulting, mentoring, teaching, selective work, succession, and legacy where relevant.", 
  ],
};
const relationshipReasoningInstructions = {
  directAnswerFirst: true,

  resolveContradictions: true,

  neverInventAstrology: true,

  onlyClaimMissingDivisionalDataWhenExplicitlyMissing:
    true,

  relationshipPatternOnly: true,

  timingSuppressed: true,

  rules: [
    "Answer permanent relationship and marriage-pattern questions from enduring relationship capacity and partnership style.",
    "Judge natal promise, the 7th house and 7th lord, Venus, Moon, Jupiter, relevant Sambandha, and D9 confirmation before considering temporary timing.",
    "Use the 5th house when romance, attraction, love marriage, or dating style is relevant.",
    "Use the 8th house when intimacy, trust, shared vulnerability, or deeper bonding patterns are relevant.",
    "Explain relationship strengths, emotional needs, commitment style, communication patterns, and meaningful cautions.",
    "For partner-profile questions, describe the qualities and relationship dynamics likely to suit the native rather than predicting a specific person's identity.",
    "For relationship-pattern questions, explain recurring tendencies without blaming the user or treating difficult placements as inevitable failure.",
    "For love-versus-arranged questions, compare the chart's relationship pattern and family/choice dynamics without presenting one path as guaranteed.",
    "Do not discuss current dasha, transits, timing windows, trigger dates, marriage dates, meeting dates, reconciliation timing, or activation periods unless the user explicitly asks when.",
    "Do not convert a permanent relationship-pattern question into a marriage-timing answer.",
    "Adapt practical guidance to userContext.age, userContext.lifeStage, and userContext.adviceStyle.",
    "For a child, do not discuss imminent marriage, sexual relationships, adult commitment decisions, or partner-search advice. Focus on emotional development, communication, boundaries, empathy, trust, and healthy relationship skills.",
    "For a student, keep guidance developmental and age-appropriate; do not assume immediate marriage or long-term commitment unless the user explicitly asks as an adult.",
  ],
};
const wealthReasoningInstructions = {
  directAnswerFirst: true,

  resolveContradictions: true,

  neverInventAstrology: true,

  onlyClaimMissingDivisionalDataWhenExplicitlyMissing:
    true,

  wealthPatternOnly: true,

  timingSuppressed: true,

  rules: [
    "Answer permanent wealth questions from enduring financial capacity, earning style, accumulation pattern, saving behaviour, investment temperament, and income structure.",
    "Judge natal promise first using the 2nd and 11th houses, their lords, relevant supporting houses, Jupiter, Venus, Mercury, Saturn, Rahu where relevant, Sambandha, and D2 confirmation.",
    "Use D10 only when the question specifically involves earning through profession, salary, work structure, or multiple income streams.",
    "For wealth-potential questions, distinguish earning capacity from wealth retention and accumulation.",
    "For earning-style questions, explain how the native is most naturally suited to generate income rather than predicting a specific salary or employer.",
    "For wealth-pattern questions, explain recurring financial tendencies such as accumulation, leakage, volatility, dependence on effort, or delayed consolidation without presenting them as inevitable.",
    "For saving-capacity questions, distinguish income generation from the ability to retain and compound wealth.",
    "For investment-suitability questions, discuss temperament, discipline, analytical ability, risk sensitivity, and suitability for structured investing. Do not recommend specific financial products or speculative trades.",
    "For multiple-income questions, distinguish natural capacity for diversified income from timing of when a second or third income source will begin.",
    "Do not discuss current dasha, transits, timing windows, trigger dates, salary-rise dates, bonus dates, financial-improvement periods, or wealth-activation periods unless the user explicitly asks when.",
    "Do not turn permanent wealth potential into a timing forecast.",
    "Adapt practical guidance to userContext.age, userContext.lifeStage, and userContext.adviceStyle.",
    "For a child, focus on financial habits, learning, discipline, numeracy, entrepreneurship aptitude, delayed gratification, and responsible money behaviour. Do not discuss investments, salary progression, speculative trading, or wealth targets as immediate actions.",
    "For a student, focus on financial literacy, skill development, earning aptitude, education choices, internships, and responsible saving habits.",
  ],
};
const businessReasoningInstructions = {
  directAnswerFirst: true,

  resolveContradictions: true,

  neverInventAstrology: true,

  onlyClaimMissingDivisionalDataWhenExplicitlyMissing: true,

  businessPatternOnly: true,

  timingSuppressed: true,

  rules: [
    "Answer permanent business questions from enduring entrepreneurial capacity, business style, commercial temperament, partnership suitability, and execution pattern.",

    "Judge natal promise first using the 3rd, 7th, 10th, and 11th houses as relevant, their lords, Mercury, Mars, Jupiter, Saturn, Venus, Rahu where relevant, Sambandha, and D10 confirmation.",

    "For business-suitability questions, distinguish entrepreneurial capacity from current business timing.",

    "For business-style questions, explain the kinds of business models, operating styles, customer relationships, and commercial roles that fit the native naturally.",

    "For business-versus-job questions, compare independence, execution, structure, risk tolerance, responsibility, and commercial orientation without allowing current dasha or transit timing to decide permanent suitability.",

    "For partnership-suitability questions, explain whether the native is better suited to solo ownership, equal partnership, specialist partnership, or clearly defined role-based collaboration.",

    "For entrepreneurial-pattern questions, explain initiative, risk tolerance, persistence, commercial judgement, delegation, leadership, and adaptability.",

    "Distinguish natural capacity for business from the timing of launch, growth, clients, or commercial conversion.",

    "Do not discuss current dasha, transits, timing windows, trigger dates, launch dates, client-growth periods, business-growth periods, or partnership timing unless the user explicitly asks when.",

    "When the user explicitly asks a timing question (for example: 'When should I start my business?', 'When should I launch?', 'When will my business grow?', 'When will I get more clients?'), always answer the timing question first.",

"For timing questions, TIMING_HIERARCHY is the authoritative timing structure whenever available.",

"If TIMING_HIERARCHY.practicalWindow exists, begin with the complete practicalWindow date range. This is the primary actionable answer to 'when'.",

"If TIMING_HIERARCHY.broaderWindow exists, explain it as the broader dasha-backed opportunity phase surrounding the practical window.",

"If TIMING_HIERARCHY.activationWindow exists, present it only as a narrower trigger, catalyst, or peak inside the timing structure. Never present it as the overall answer when practicalWindow exists.",

"Do not collapse a practicalWindow date range into a single activation date.",

"Use DECISION_SUMMARY to describe the conclusion, confidence, classification, and practical meaning. Do not independently re-rank timing windows.",

"If practicalWindow is unavailable but broaderWindow exists, use broaderWindow as the timing answer and explain that no narrower actionable period is currently established.",

"Only when TIMING_HIERARCHY is unavailable may selectedTimingWindow or other legacy timing fields be used as fallback evidence.",

"Never invent dates, windows, hierarchy, or confidence. Use only timing supplied by the astrology engine.",

"After answering the timing question, explain why the timing exists using natal promise, dasha support, practical sub-period support, transit activation, and relevant chart evidence.",
"Do not merely list planets, houses, or dasha factors. Translate each important astrological factor into what it means in the user's real situation.",

"For every important planet you mention, immediately explain what it means in practical human terms rather than assuming the reader understands astrology.",

"For example, Mercury often relates to thinking, communication and negotiation, Mars to initiative and decisive action, Jupiter to growth and opportunity, Saturn to discipline and long-term effort, and Venus to relationships, harmony or value depending on context.",

"Use astrology evidence to explain the mechanism of the prediction rather than simply proving that calculations were performed.",

"Avoid repetitive phrases such as 'this timing is based on', 'relevant houses activated', or 'relevant karakas involved' in the main narrative unless they materially improve understanding.",

"Keep technical astrology evidence for the evidence sections. The primary answer should read like an experienced astrologer explaining the chart to a client.",
"Keep timing conditional when the supplied overall confidence is medium or low.",

    "Do not turn permanent business suitability into a business-launch forecast.",

    "Adapt practical guidance to userContext.age, userContext.lifeStage, userContext.careerStage, and userContext.adviceStyle.",

    "For a child, discuss entrepreneurial aptitude through initiative, problem-solving, creativity, responsibility, communication, small projects, teamwork, and financial literacy. Do not advise immediate business launch, capital commitment, hiring, clients, or commercial risk.",

    "For a student, focus on entrepreneurship education, competitions, internships, projects, commercial skills, customer understanding, and experimentation before major financial commitment."
  ],
};
const educationReasoningInstructions = {
  directAnswerFirst: true,

  resolveContradictions: true,

  neverInventAstrology: true,

  onlyClaimMissingDivisionalDataWhenExplicitlyMissing:
    true,

  educationPatternOnly: true,

  timingSuppressed: true,

  rules: [
    "Answer permanent education questions from enduring learning capacity, subject aptitude, stream suitability, study pattern, concentration style, and academic development.",
    "Judge natal promise first using the 2nd, 4th, 5th, and 9th houses as relevant, their lords, Mercury, Jupiter, Moon, Saturn, Mars or Venus where relevant, Sambandha, and D24 confirmation.",
    "For subject-fit questions, explain the strongest intellectual, analytical, creative, linguistic, practical, or research-oriented tendencies rather than forcing one narrow subject.",
    "For stream-choice questions, compare the requested streams on long-term aptitude, learning style, and capability fit rather than current timing.",
    "For study-pattern questions, explain concentration, memory, discipline, curiosity, distraction, learning pace, and preferred study structure without treating difficult placements as permanent academic failure.",
    "Distinguish natural academic aptitude from current exam performance or temporary study pressure.",
    "Do not discuss current dasha, transits, timing windows, exam-result dates, admission dates, higher-education timing, or academic-improvement periods unless the user explicitly asks when.",
    "Do not turn permanent subject or stream suitability into an exam or admission forecast.",
    "Adapt practical guidance to userContext.age, userContext.lifeStage, and userContext.adviceStyle.",
    "For a child, focus on interests, curiosity, reading, numeracy, creativity, concentration, learning habits, confidence, and exposure to different subjects.",
    "For a student, focus on subject selection, study methods, skill development, competitions, projects, internships, and academic planning appropriate to their stage.",
    "For an adult, distinguish formal education, professional qualifications, reskilling, and higher study according to the user's actual life stage.",
  ],
};
const spiritualReasoningInstructions = {
  directAnswerFirst: true,

  resolveContradictions: true,

  neverInventAstrology: true,

  onlyClaimMissingDivisionalDataWhenExplicitlyMissing:
    true,

  spiritualPatternOnly: true,

  timingSuppressed: true,

  rules: [
    "Answer permanent spiritual questions from enduring spiritual inclination, devotional temperament, meditative capacity, mantra affinity, guru pattern, and deeper dharmic orientation.",
    "Judge natal promise first using the 5th, 9th, and 12th houses as primary spiritual houses, with the 4th and 8th as supporting houses where relevant.",
    "Use Jupiter, Ketu, Moon, Sun, Saturn, Mercury, or Venus according to the specific spiritual question, together with Sambandha and D20 confirmation.",
    "Use D9 only when dharma, guru connection, or deeper maturity materially helps clarify the spiritual pattern.",
    "For spiritual-path questions, compare paths such as devotion, knowledge, meditation, mantra, service, or contemplative practice without forcing one path when multiple are supported.",
    "For devotional-style questions, explain the native's natural relationship with devotion, prayer, surrender, ritual, and emotional connection to the divine.",
    "For meditation-suitability questions, discuss concentration, inwardness, discipline, emotional regulation, and tolerance for silence or solitude.",
    "For mantra-suitability questions, discuss sound, repetition, discipline, devotion, concentration, and symbolic affinity without prescribing a specific mantra unless the supplied evidence explicitly supports it.",
    "For guru-pattern questions, explain openness to guidance, teacher relationships, discernment, surrender, independence, and dharmic learning without claiming a specific guru will appear.",
    "Do not discuss current dasha, transits, timing windows, trigger dates, spiritual activation periods, guru-arrival dates, or spiritual-growth timing unless the user explicitly asks when.",
    "Do not convert a permanent spiritual question into a timing forecast.",
    "Adapt practical guidance to userContext.age, userContext.lifeStage, and userContext.adviceStyle.",
    "For a child, focus on values, kindness, reflection, prayer, discipline, gratitude, curiosity, and simple spiritual habits rather than intense sadhana or renunciation.",
    "For a student, focus on balanced practice, study, reflection, discipline, and healthy integration with education and daily responsibilities.",
  ],
};
const healthReasoningInstructions = {
  directAnswerFirst: true,

  resolveContradictions: true,

  neverInventAstrology: true,

  onlyClaimMissingDivisionalDataWhenExplicitlyMissing:
    true,

  healthPatternOnly: true,

  timingSuppressed: true,

  rules: [
    "Answer permanent health questions as astrological health-pattern guidance, not medical diagnosis.",
    "Judge enduring constitutional tendencies, stress patterns, recovery capacity, lifestyle sensitivity, and resilience from relevant natal houses and lords, planetary relationships, karakas, and D6/D30 confirmation.",
    "Use the 1st house for constitution and vitality, the 6th for health challenges and routines, the 8th for deeper vulnerability and recovery themes, and the 12th for depletion, rest, isolation, or recovery context where relevant.",
    "For health-sensitivity questions, describe tendencies or areas that may deserve attention without claiming that a specific disease is present.",
    "For stress-pattern questions, discuss emotional load, mental overstimulation, discipline, rest, routine, and recovery without diagnosing anxiety, depression, or another condition.",
    "For recovery-capacity questions, discuss resilience, pacing, rest, support, routine, and how recovery may be experienced without guaranteeing recovery from a specific illness.",
    "For lifestyle-pattern questions, give general wellbeing guidance such as sleep, routine, hydration, movement, stress reduction, and consistency, but do not prescribe treatment.",
    "Do not discuss current dasha, transits, timing windows, trigger dates, sensitive periods, recovery dates, or health-improvement timing unless the user explicitly asks when.",
    "Do not convert a permanent health-pattern question into a disease prediction or health-timing forecast.",
    "Never diagnose a medical condition, claim that astrology confirms or rules out disease, or recommend stopping or replacing professional medical care.",
    "Never advise medication changes, dosage changes, medical procedures, or treatment plans based on astrology.",
    "When the question concerns symptoms, diagnosis, treatment, medication, or urgent health concerns, clearly frame astrology as supplementary and advise appropriate professional medical evaluation.",
    "Adapt practical guidance to userContext.age, userContext.lifeStage, and userContext.adviceStyle.",
    "For a child, focus on healthy routines, sleep, nutrition, movement, stress management, parental support, and age-appropriate wellbeing habits. Do not predict disease or long-term medical outcomes.",
    "For an older adult, keep guidance conservative and avoid implying that astrological resilience replaces screening, monitoring, or medical follow-up.",
  ],
};
const childReasoningInstructions = {
  directAnswerFirst: true,

  resolveContradictions: true,

  neverInventAstrology: true,

  onlyClaimMissingDivisionalDataWhenExplicitlyMissing:
    true,

  childPatternOnly: true,

  timingSuppressed: true,

  rules: [
    "Answer permanent child and parenthood questions from enduring parenthood potential, parenting style, parent-child relationship patterns, and the child's natural aptitude.",
    "Judge natal promise first using the 5th house and 5th lord, Jupiter, Moon, relevant supporting houses, Sambandha, and D7 confirmation.",
    "For parenthood-potential questions, distinguish emotional readiness, nurturing capacity, responsibility, and family orientation from timing of conception or childbirth.",
    "For parenting-style questions, explain nurturing, discipline, communication, expectations, emotional responsiveness, structure, and guidance style without presenting one pattern as fixed or inevitable.",
    "For parent-child relationship questions, explain recurring interaction patterns, communication dynamics, emotional needs, expectations, boundaries, and areas requiring patience without blaming either parent or child.",
    "For child-aptitude questions, focus on the child's natural strengths, learning style, creativity, communication, reasoning, interests, temperament, and developmental potential.",
    "Do not discuss current dasha, transits, timing windows, conception dates, childbirth dates, child-development windows, or family-expansion timing unless the user explicitly asks when.",
    "Do not turn permanent parenthood or child-aptitude questions into conception or childbirth forecasts.",
    "Do not present difficult parent-child patterns as inevitable conflict.",
    "Adapt practical guidance to userContext.age, userContext.lifeStage, and userContext.adviceStyle.",
    "When the subject is a child, keep guidance developmental and age-appropriate. Focus on learning, emotional support, communication, confidence, interests, routine, and healthy development rather than adult outcomes.",
    "Do not make deterministic claims about a child's future profession, marriage, finances, health, or life outcome from a child-aptitude question.",
  ],
};
const propertyReasoningInstructions = {
  directAnswerFirst: true,

  resolveContradictions: true,

  neverInventAstrology: true,

  onlyClaimMissingDivisionalDataWhenExplicitlyMissing:
    true,

  propertyPatternOnly: true,

  timingSuppressed: true,

  rules: [
    "Answer permanent property questions from enduring property potential, home stability, ownership pattern, real-estate temperament, and asset-building capacity.",
    "Judge natal promise first using the 4th house and 4th lord, relevant supporting houses, Mars, Venus, Moon, Jupiter, Saturn or Rahu where relevant, Sambandha, and D4 confirmation.",
    "For property-potential questions, distinguish the capacity to own or build property assets from the timing of an actual purchase.",
    "For property-investment-suitability questions, explain long-term suitability for real-estate ownership, asset accumulation, patience, leverage sensitivity, and decision style without recommending a specific property or transaction.",
    "For property-pattern questions, explain recurring themes such as stability, movement, delay, attachment to home, renovation, ownership pressure, or repeated property complications without presenting them as inevitable.",
    "For home-stability questions, explain residential stability, emotional attachment to home, settlement pattern, and need for security without predicting a specific address or location.",
    "Do not discuss current dasha, transits, timing windows, trigger dates, purchase dates, sale dates, possession dates, relocation dates, or property-activation periods unless the user explicitly asks when.",
    "Do not convert permanent property potential into a purchase or sale forecast.",
    "Do not treat current timing as proof for or against permanent property potential.",
    "Adapt practical guidance to userContext.age, userContext.lifeStage, and userContext.adviceStyle.",
    "For a child or student, frame property themes as future attitudes toward stability, home, responsibility, and asset-building rather than immediate purchase or investment advice.",
  ],
};
const vehicleReasoningInstructions = {
  directAnswerFirst: true,

  resolveContradictions: true,

  neverInventAstrology: true,

  onlyClaimMissingDivisionalDataWhenExplicitlyMissing:
    true,

  vehiclePatternOnly: true,

  timingSuppressed: true,

  rules: [
    "Answer permanent vehicle questions from enduring vehicle ownership potential, comfort preferences, mobility pattern, attachment to vehicles, and recurring vehicle tendencies.",
    "Judge natal promise first using the 4th house and 4th lord, relevant supporting houses, Venus, Mars, Moon, Saturn, Rahu or Jupiter where relevant, Sambandha, and D16 confirmation.",
    "For vehicle-potential questions, distinguish long-term ownership and comfort potential from the timing of an actual purchase.",
    "For vehicle-preference questions, describe the qualities, comfort level, practicality, performance orientation, luxury preference, or usage pattern that may suit the native rather than recommending one specific make or model.",
    "For vehicle-pattern questions, explain recurring themes such as frequent upgrades, attachment, maintenance pressure, impulsive changes, comfort seeking, or practical mobility needs without presenting them as inevitable.",
    "Do not discuss current dasha, transits, timing windows, trigger dates, purchase dates, upgrade periods, delivery dates, financing windows, or vehicle-activation periods unless the user explicitly asks when.",
    "Do not convert permanent vehicle potential or preference into a purchase-timing forecast.",
    "Do not treat temporary timing conditions as proof for or against permanent vehicle ownership potential.",
    "Adapt practical guidance to userContext.age, userContext.lifeStage, and userContext.adviceStyle.",
    "For a child or student, frame vehicle themes as future preferences, comfort orientation, mobility habits, responsibility, and practicality rather than immediate purchase or financing advice.",
  ],
};
const relocationReasoningInstructions = {
  directAnswerFirst: true,

  resolveContradictions: true,

  neverInventAstrology: true,

  onlyClaimMissingDivisionalDataWhenExplicitlyMissing:
    true,

  relocationPatternOnly: true,

  timingSuppressed: true,

  rules: [
    "Answer permanent relocation questions from enduring movement potential, foreign-settlement potential, residential stability, adaptability, and location preference.",
    "Judge natal promise first using the 4th, 9th, and 12th houses as relevant, their lords, Moon, Rahu, Saturn, Jupiter or Mercury where relevant, Sambandha, and D4/D9 confirmation.",
    "For relocation-potential questions, distinguish the native's long-term tendency to move or resettle from the timing of an actual move.",
    "For foreign-settlement questions, explain whether living abroad or away from the place of origin is a meaningful long-term pattern without claiming that permanent settlement is guaranteed.",
    "For relocation-pattern questions, explain recurring themes such as restlessness, repeated moves, adaptation, instability, exploration, or the need for environmental change without presenting them as inevitable.",
    "For location-preference questions, describe the kinds of environments, cities, cultures, pace, community, or lifestyle settings that may suit the native rather than predicting one exact country or city.",
    "Do not discuss current dasha, transits, timing windows, trigger dates, visa dates, move dates, settlement windows, or relocation-activation periods unless the user explicitly asks when.",
    "Do not convert permanent relocation potential into a move-timing forecast.",
    "Do not treat temporary timing conditions as proof for or against permanent foreign-settlement potential.",
    "Adapt practical guidance to userContext.age, userContext.lifeStage, and userContext.adviceStyle.",
    "For a child or student, frame relocation themes as adaptability, exposure to different environments, future mobility, education abroad, and cultural openness rather than immediate relocation planning.",
  ],
};
const disputeReasoningInstructions = {
  directAnswerFirst: true,

  resolveContradictions: true,

  neverInventAstrology: true,

  onlyClaimMissingDivisionalDataWhenExplicitlyMissing:
    true,

  disputePatternOnly: true,

  timingSuppressed: true,

  rules: [
    "Answer permanent dispute and legal-pattern questions from enduring conflict style, negotiation pattern, litigation tendency, strategic temperament, and resolution style.",
    "Judge natal promise first using the 3rd, 6th, 7th, and 8th houses as relevant, their lords, Mars, Saturn, Mercury, Jupiter, Venus, Rahu or Ketu where relevant, Sambandha, and D6/D30 confirmation.",
    "For conflict-pattern questions, explain recurring triggers, defensiveness, assertiveness, escalation tendencies, communication style, and boundary patterns without blaming the user or another person.",
    "For legal-suitability questions, discuss analytical ability, argument, persistence, judgement, negotiation, procedure, and pressure tolerance without guaranteeing success in litigation.",
    "For negotiation-style questions, explain whether the native tends toward direct confrontation, compromise, strategic patience, persuasion, documentation, or structured resolution.",
    "For litigation-pattern questions, explain recurring dispute or legal-pressure tendencies without predicting that court cases are inevitable.",
    "Do not discuss current dasha, transits, timing windows, trigger dates, court dates, settlement dates, case-resolution periods, or legal activation unless the user explicitly asks when.",
    "Do not convert a permanent dispute-pattern question into a case-outcome or legal-timing forecast.",
    "Never guarantee that the user will win or lose a legal matter based on astrology.",
    "Never present astrology as a substitute for legal advice, legal representation, evidence, documentation, or procedural deadlines.",
    "If the user is asking about an actual legal matter, clearly distinguish astrological interpretation from legal strategy and encourage appropriate professional legal advice where needed.",
    "Adapt practical guidance to userContext.age, userContext.lifeStage, and userContext.adviceStyle.",
    "For a child or student, frame conflict themes as communication, boundaries, fairness, negotiation, self-control, debate, and problem-solving rather than litigation or court strategy.",
  ],
};
const parentsReasoningInstructions = {
  directAnswerFirst: true,
  resolveContradictions: true,
  neverInventAstrology: true,
  onlyClaimMissingDivisionalDataWhenExplicitlyMissing: true,
  familyPatternOnly: true,
  timingSuppressed: true,

  rules: [
    "Answer permanent parent-related questions from enduring parent-child relationship patterns, maternal and paternal influence, family expectations, emotional inheritance, responsibility, and elder dynamics.",
    "Judge natal promise using the 4th and 9th houses and their lords, Sun, Moon, Jupiter, Saturn where relevant, Sambandha, D12, and D9 where maturity or family dharma is relevant.",
    "For mother-relationship questions, focus primarily on the 4th house, Moon, emotional security, care, attachment, expectations, and maternal influence.",
    "For father-relationship questions, focus primarily on the 9th house, Sun, guidance, authority, values, expectations, approval, and paternal influence.",
    "For parental-influence questions, explain how family conditioning, values, expectations, security, authority, and responsibility may shape the native without blaming either parent.",
    "For family-elder questions, discuss authority, tradition, guidance, duty, respect, generational expectations, and boundaries.",
    "Do not discuss current dasha, transits, timing windows, trigger dates, parental-support periods, elder-responsibility periods, or family timing unless the user explicitly asks when.",
    "Do not convert a permanent parent-relationship question into a prediction about a parent's future.",
    "Adapt practical guidance to userContext.age, userContext.lifeStage, and userContext.adviceStyle.",
    "For a child, keep the answer focused on communication, emotional security, trust, expectations, boundaries, support, and healthy family relationships.",
  ],
};

const siblingsReasoningInstructions = {
  directAnswerFirst: true,
  resolveContradictions: true,
  neverInventAstrology: true,
  onlyClaimMissingDivisionalDataWhenExplicitlyMissing: true,
  siblingPatternOnly: true,
  timingSuppressed: true,

  rules: [
    "Answer permanent sibling questions from enduring sibling dynamics, communication, rivalry, support, cooperation, expectations, and family roles.",
    "Judge natal promise using the 3rd and 11th houses and their lords, Mars, Mercury, Moon, Jupiter or Saturn where relevant, Sambandha, and D3 confirmation.",
    "For younger-sibling questions, give primary emphasis to the 3rd house and its lord.",
    "For elder-sibling questions, give primary emphasis to the 11th house and its lord.",
    "For sibling-relationship questions, explain communication style, closeness, rivalry, emotional expectations, cooperation, boundaries, and recurring interaction patterns.",
    "For sibling-support questions, distinguish emotional, practical, financial, advisory, and family support rather than treating support as one fixed outcome.",
    "Do not discuss current dasha, transits, timing windows, trigger dates, sibling-conflict periods, or support timing unless the user explicitly asks when.",
    "Do not convert permanent sibling dynamics into a timing forecast.",
    "Do not present rivalry or distance as inevitable estrangement.",
    "Adapt practical guidance to userContext.age, userContext.lifeStage, and userContext.adviceStyle.",
    "For a child, focus on sharing, communication, rivalry, fairness, support, boundaries, teamwork, and emotional understanding.",
  ],
};
const travelReasoningInstructions = {
  directAnswerFirst: true,
  resolveContradictions: true,
  neverInventAstrology: true,
  onlyClaimMissingDivisionalDataWhenExplicitlyMissing: true,
  travelPatternOnly: true,
  timingSuppressed: true,

  rules: [
    "Answer permanent travel questions from enduring travel inclination, foreign-travel pattern, frequency of movement, adaptability, and pilgrimage orientation.",
    "Judge natal promise using the 3rd, 9th, and 12th houses and their lords, Moon, Rahu, Jupiter, Mercury, Saturn or Ketu where relevant, Sambandha, and D9/D4 confirmation.",
    "Use D20 only when pilgrimage or explicitly spiritual travel is relevant.",
    "For travel-inclination questions, distinguish natural movement and curiosity from the timing of an actual journey.",
    "For foreign-travel questions, explain whether overseas travel is a meaningful recurring pattern without converting it into settlement or relocation unless the user specifically asks about living abroad.",
    "For frequent-travel questions, explain mobility, restlessness, adaptability, work or learning movement, and the need for environmental change without presenting constant travel as inevitable.",
    "For pilgrimage questions, explain affinity for sacred journeys, spiritual travel, reflection, and dharmic movement without forcing a specific pilgrimage or destination.",
    "Do not discuss current dasha, transits, timing windows, trigger dates, visa dates, departure dates, travel windows, or pilgrimage timing unless the user explicitly asks when.",
    "Do not convert permanent travel inclination into a travel-timing forecast.",
    "Do not confuse travel with relocation: travel concerns journeys and movement without necessarily changing the native's residential base.",
    "Adapt practical guidance to userContext.age, userContext.lifeStage, and userContext.adviceStyle.",
    "For a child or student, frame travel themes as curiosity, exposure, learning, adaptability, school trips, family travel, cultural openness, and future mobility rather than independent travel planning.",
  ],
};
const reputationReasoningInstructions = {
  directAnswerFirst: true,
  resolveContradictions: true,
  neverInventAstrology: true,
  onlyClaimMissingDivisionalDataWhenExplicitlyMissing: true,
  reputationPatternOnly: true,
  timingSuppressed: true,

  rules: [
    "Answer permanent reputation questions from enduring public-image pattern, recognition potential, visibility style, status orientation, credibility, and how the native is perceived over time.",
    "Judge natal promise using the 1st, 10th, and 11th houses as relevant, their lords, Sun, Jupiter, Saturn, Rahu, Mercury or Moon where relevant, Sambandha, and D10/D9 confirmation.",
    "For reputation-potential questions, distinguish the capacity for recognition, influence, credibility, or visibility from the timing of when recognition may arrive.",
    "For public-image questions, explain how the native may naturally project authority, warmth, seriousness, intellect, ambition, unconventionality, privacy, or visibility without claiming that everyone will perceive them identically.",
    "For recognition-pattern questions, explain recurring themes such as delayed credit, visibility before reward, responsibility before recognition, public validation, competition for status, or periodic image pressure without presenting them as inevitable.",
    "For visibility-style questions, distinguish public-facing, selective, private, leadership-oriented, intellectual, social, or behind-the-scenes visibility patterns.",
    "Do not discuss current dasha, transits, timing windows, trigger dates, recognition periods, reputation-growth periods, or recovery timing unless the user explicitly asks when.",
    "Do not convert permanent reputation potential into a timing forecast.",
    "Do not treat temporary timing conditions as proof for or against permanent recognition potential.",
    "Adapt practical guidance to userContext.age, userContext.lifeStage, userContext.careerStage, and userContext.adviceStyle.",
    "For a child or student, frame reputation themes as confidence, reliability, leadership, communication, responsibility, peer perception, and healthy self-expression rather than professional status or public fame.",
  ],
};
const debtReasoningInstructions = {
  directAnswerFirst: true,
  resolveContradictions: true,
  neverInventAstrology: true,
  onlyClaimMissingDivisionalDataWhenExplicitlyMissing: true,
  debtPatternOnly: true,
  timingSuppressed: true,

  rules: [
    "Answer permanent debt questions from enduring borrowing tendencies, repayment discipline, liability patterns, financial pressure, and debt-management style.",
    "Judge natal promise using the 2nd, 6th, 8th, 11th, and 12th houses as relevant, their lords, Saturn, Mars, Rahu, Mercury, Jupiter or Venus where relevant, Sambandha, and D2/D6 confirmation.",
    "For debt-pattern questions, explain recurring themes such as borrowing under pressure, repayment discipline, cash-flow mismatch, overextension, dependency on future income, or difficulty closing liabilities without presenting them as inevitable.",
    "For borrowing-tendency questions, distinguish practical use of credit from impulsive, pressured, habitual, or leveraged borrowing.",
    "For repayment-capacity questions, distinguish income generation from repayment discipline, liquidity, consistency, and the ability to reduce liabilities over time.",
    "For liability-pattern questions, explain how obligations may build through lifestyle, property, business, family responsibility, emergencies, or poor cash-flow structure without assuming one cause unless supported by evidence.",
    "Do not discuss current dasha, transits, timing windows, trigger dates, loan dates, repayment dates, debt-reduction periods, or borrowing windows unless the user explicitly asks when.",
    "Do not convert permanent debt patterns into a timing forecast.",
    "Do not treat temporary timing conditions as proof for or against permanent repayment capacity.",
    "Never recommend borrowing, leverage, refinancing, debt consolidation, a specific loan, credit product, interest structure, or repayment strategy based only on astrology.",
    "If the user is dealing with actual financial distress, clearly distinguish astrological interpretation from financial advice and encourage appropriate professional financial guidance where needed.",
    "Adapt practical guidance to userContext.age, userContext.lifeStage, and userContext.adviceStyle.",
    "For a child or student, frame debt themes as financial literacy, delayed gratification, budgeting, responsible use of money, saving habits, and caution around future borrowing rather than actual loan decisions.",
  ],
};
const inheritanceReasoningInstructions = {
  directAnswerFirst: true,
  resolveContradictions: true,
  neverInventAstrology: true,
  onlyClaimMissingDivisionalDataWhenExplicitlyMissing: true,
  inheritancePatternOnly: true,
  timingSuppressed: true,

  rules: [
    "Answer permanent inheritance questions from enduring inheritance potential, ancestral patterns, legacy themes, family asset dynamics, and inheritance-related conflict tendencies.",
    "Judge natal promise using the 8th house and 8th lord, with the 2nd, 4th, 9th, and 11th houses as relevant support, together with Saturn, Jupiter, Ketu, Mars, Mercury or Sun where relevant, Sambandha, and D8/D12 confirmation.",
    "For inheritance-potential questions, distinguish the existence of inheritance or legacy potential from whether assets will definitely be received, their value, and when transfer may occur.",
    "For ancestral-pattern questions, explain recurring family themes around shared resources, property, legacy, responsibility, attachment, secrecy, obligation, or unresolved family matters without presenting them as unavoidable karma.",
    "For legacy-pattern questions, distinguish material inheritance from values, responsibilities, family identity, knowledge, property, status, or other forms of legacy.",
    "For inheritance-conflict questions, explain tendencies toward delay, disagreement, ambiguity, documentation issues, competing expectations, or family tension without assuming that litigation is inevitable.",
    "Do not discuss current dasha, transits, timing windows, trigger dates, inheritance dates, probate timing, settlement periods, asset-transfer dates, or legacy-transfer timing unless the user explicitly asks when.",
    "Do not convert permanent inheritance potential into a timing or monetary forecast.",
    "Do not treat temporary timing conditions as proof that inheritance will or will not occur.",
    "Never guarantee receipt of inheritance, a particular asset, a particular amount, estate settlement, probate outcome, or legal entitlement based on astrology.",
    "Do not present astrology as a substitute for a will, estate planning, probate advice, legal representation, tax advice, documentation, or professional financial advice.",
    "If the user is dealing with an actual inheritance, estate, probate, insurance, or family-property matter, clearly distinguish astrological interpretation from legal and financial advice.",
    "Adapt practical guidance to userContext.age, userContext.lifeStage, and userContext.adviceStyle.",
    "For a child or student, frame inheritance themes as family legacy, values, responsibility, ancestry, and attitudes toward shared resources rather than expected future assets or financial entitlement.",
  ],
};
const mentalHealthReasoningInstructions = {
  directAnswerFirst: true,
  resolveContradictions: true,
  neverInventAstrology: true,
  onlyClaimMissingDivisionalDataWhenExplicitlyMissing: true,
  mentalHealthPatternOnly: true,
  timingSuppressed: true,

  rules: [
    "Answer permanent mental-health questions as astrological emotional and cognitive pattern guidance, not psychiatric diagnosis.",
    "Judge enduring patterns using the 1st, 4th, 8th, and 12th houses as relevant, their lords, Moon, Mercury, Saturn, Ketu, Rahu, Mars or Jupiter where relevant, Sambandha, and D9/D30 confirmation.",
    "For overthinking questions, discuss mental activity, rumination tendency, sensitivity, concentration, stimulation, uncertainty, and grounding without diagnosing anxiety or another disorder.",
    "For mood-sensitivity questions, discuss emotional responsiveness, sensitivity, environmental influence, attachment, recovery, and regulation without diagnosing depression, bipolar disorder, or another psychiatric condition.",
    "For stress-resilience questions, discuss coping style, pressure tolerance, rest, structure, support, boundaries, and recovery without claiming clinical resilience or vulnerability.",
    "For emotional-regulation questions, explain emotional intensity, reactivity, suppression, expression, processing, and recovery patterns without labelling the native as unstable.",
    "Do not discuss current dasha, transits, timing windows, trigger dates, sensitive periods, recovery periods, or support timing unless the user explicitly asks when.",
    "Do not convert permanent mental or emotional patterns into psychiatric predictions.",
    "Never diagnose depression, anxiety disorder, bipolar disorder, panic disorder, psychosis, ADHD, personality disorder, trauma disorder, or any other psychiatric condition from astrology.",
    "Never claim that astrology confirms or rules out a psychiatric diagnosis.",
    "Never recommend starting, stopping, changing, or avoiding psychiatric medication or therapy based on astrology.",
    "Never present spiritual practice, mantra, remedy, fasting, meditation, or astrology as a replacement for professional mental-health care.",
    "If the user describes severe symptoms, self-harm thoughts, suicidal thoughts, psychosis, inability to function, or immediate danger, prioritize safety and appropriate professional support rather than astrological interpretation.",
    "Adapt practical guidance to userContext.age, userContext.lifeStage, and userContext.adviceStyle.",
    "For a child or teenager, keep guidance developmental and supportive, focusing on emotional literacy, routine, sleep, communication, trusted adults, school support, coping skills, and healthy expression rather than psychiatric labels.",
  ],
};
const petsReasoningInstructions = {
  directAnswerFirst: true,
  resolveContradictions: true,
  neverInventAstrology: true,
  onlyClaimMissingDivisionalDataWhenExplicitlyMissing: true,
  petsPatternOnly: true,
  timingSuppressed: true,

  rules: [
    "Answer permanent pet-related questions from enduring caregiving style, emotional bond with animals, responsibility pattern, sensitivity, service, and attachment.",
    "Judge natal promise using the 6th house and 6th lord, with the 4th and 12th houses as relevant support, together with Moon, Mercury, Venus, Saturn or Ketu where relevant, Sambandha, and D6/D30 confirmation.",
    "For pet-relationship questions, explain bonding, attachment, emotional comfort, companionship, sensitivity, and mutual dependence without projecting human motives onto the animal.",
    "For caregiving-style questions, explain patience, routine, attentiveness, responsibility, emotional responsiveness, and consistency.",
    "For responsibility-pattern questions, explain how pet care may become a source of duty, structure, emotional commitment, or practical responsibility without presenting difficulties as inevitable.",
    "Do not discuss current dasha, transits, timing windows, illness periods, loss periods, or pet-related timing unless the user explicitly asks when.",
    "Do not predict a pet's illness, death, lifespan, diagnosis, or medical outcome from astrology.",
    "Do not present astrology as a substitute for veterinary advice or treatment.",
    "Adapt practical guidance to userContext.age, userContext.lifeStage, and userContext.adviceStyle.",
    "For a child, focus on kindness, responsibility, routine, empathy, boundaries, hygiene, and age-appropriate animal care.",
  ],
};

const innerReasoningInstructions = {
  directAnswerFirst: true,
  resolveContradictions: true,
  neverInventAstrology: true,
  onlyClaimMissingDivisionalDataWhenExplicitlyMissing: true,
  innerPatternOnly: true,
  timingSuppressed: true,

  rules: [
    "Answer permanent inner-life questions from enduring purpose, meaning, self-understanding, inner conflict, values, dharma, and psychological-spiritual orientation.",
    "Judge natal promise using the 1st, 8th, 9th, and 12th houses as relevant, their lords, Moon, Ketu, Jupiter, Sun, Saturn or Mercury where relevant, Sambandha, and D9 confirmation.",
    "For life-direction questions, explain values, temperament, meaning, growth direction, and inner priorities rather than giving one rigid life instruction.",
    "For purpose questions, distinguish broad purpose themes from a single profession, relationship, or achievement.",
    "For inner-conflict questions, explain competing needs, values, fears, attachments, expectations, control, surrender, or uncertainty without diagnosing a psychiatric condition.",
    "For self-understanding questions, explain recurring motivations, emotional needs, identity themes, values, and inner contradictions without presenting personality as fixed.",
    "For meaning questions, explain what kinds of contribution, learning, connection, spirituality, creativity, responsibility, or service may create fulfilment.",
    "Do not discuss current dasha, transits, timing windows, trigger dates, spiritual activation, or life-direction timing unless the user explicitly asks when.",
    "Do not convert purpose or meaning questions into deterministic fate statements.",
    "Do not claim that the chart reveals one compulsory destiny, one soulmate, one profession, one guru, or one unavoidable path.",
    "Adapt practical guidance to userContext.age, userContext.lifeStage, and userContext.adviceStyle.",
    "For a child or student, frame purpose as interests, values, curiosity, character development, learning, relationships, creativity, contribution, and gradual self-discovery.",
  ],
};
const childCareerTimingReasoningInstructions = {
  directAnswerFirst: true,
  resolveContradictions: true,
  neverInventAstrology: true,
  timingSuppressed: true,

  rules: [
    "The user is a child, so adult employment timing is not applicable.",
    "Do not discuss job changes, employers, recruiters, interviews, promotion, resignation, salary negotiation, networking, joining dates, or workplace movement.",
    "Do not provide career-event timing merely because the wording asks when.",
    "Reframe the question developmentally toward natural aptitude, interests, learning strengths, confidence, communication, creativity, reasoning, discipline, and age-appropriate skill development.",
    "If useful, explain that meaningful profession or employment timing belongs to a later life stage.",
    "Use the natal career promise and relevant divisional confirmation only to discuss future potential, not imminent employment.",
  ],
};
const childParenthoodTimingReasoningInstructions = {
  directAnswerFirst: true,
  resolveContradictions: true,
  neverInventAstrology: true,
  timingSuppressed: true,

  rules: [
    "The user is a child, so conception, childbirth, or parenthood timing is not meaningful at this life stage.",
    "Do not provide dates, dashas, transits, timing windows, conception periods, childbirth periods, or family-expansion predictions.",
    "Do not speak as though the child is currently planning marriage, pregnancy, or parenthood.",
    "Redirect toward age-appropriate development, emotional maturity, responsibility, empathy, relationships, learning, and future parenting potential only if relevant.",
    "Explain that parenthood timing becomes meaningful only much later in life.",
  ],
};
const childMarriageTimingReasoningInstructions = {
  directAnswerFirst: true,
  resolveContradictions: true,
  neverInventAstrology: true,
  timingSuppressed: true,

  rules: [
    "The user is a child, so marriage, partner-meeting, commitment, or romantic timing is not meaningful at this life stage.",
    "Do not provide marriage dates, meeting windows, relationship timing, engagement timing, dashas, transits, or trigger periods.",
    "Do not speak as though the child is currently dating, seeking a spouse, engaged, or planning marriage.",
    "Redirect toward age-appropriate emotional development, friendship, communication, boundaries, empathy, self-understanding, and healthy relationship skills.",
    "Explain that marriage and partner timing becomes meaningful only much later in life.",
  ],
};
const standardReasoningInstructions = {
  ...(
    natPayload?.astroFacts
      ?.reasoningInstructions ??
    {
      directAnswerFirst: true,
      resolveContradictions: true,
      distinguishMovementFromOutcome: true,
      neverInventAstrology: true,
      onlyClaimMissingDivisionalDataWhenExplicitlyMissing:
        true,
    }
  ),

  domainIntelligenceInstructions:
    domainIntelligenceContext.instructions,
};
const timingSummary =
  shouldSuppressTiming
    ? null
    : astroBundle?.selectedTimingWindow
      ? {
          headline:
            astroBundle.selectedTimingWindow.label,
          start:
            astroBundle.selectedTimingWindow.start,
          end:
            astroBundle.selectedTimingWindow.end,
          confidence:
            astroBundle.selectedTimingWindow.confidence,
          score:
            astroBundle.selectedTimingWindow.score,
          windowClass:
            astroBundle.selectedTimingWindow.windowClass,
          practicalMeaning:
            astroBundle.selectedTimingWindow.practicalMeaning,
          why:
            astroBundle.selectedTimingWindow.why,
        }
      : null;
const safeNatPayload = {
  userQuestion:
    natPayload?.userQuestion ??
    question,

  topic:
    natPayload?.topic ??
    astroBundle?.topic ??
    topic,
  userContext,
  domainIntelligence:
    domainIntelligenceForNaturalize,

  questionType:
  natPayload?.questionType ??
  questionType,

decisionSummary:
  natPayload?.decisionSummary ??
  decisionSummary ??
  null,

timingHierarchy:
  natPayload?.timingHierarchy ??
  timingHierarchy ??
  null,

eventLifecycle:
  natPayload?.eventLifecycle ??
  eventLifecycle ??
  null,

planetReasoning:
  natPayload?.planetReasoning ??
  planetReasoning ??
  null,

eventType:
  astroBundle?.eventType ??
  astroBundle?.careerEventType ??
  null,

  topicCopy:
    isProfessionIdentity
      ? null
      : getTimingTopicCopy(
          astroBundle?.topic ?? topic,
          astroBundle?.eventType ??
            astroBundle?.careerEventType
        ),

  conversationContinuationSummary:
    conversationState?.lastAnswerSummary ??
    null,

  tone:
    natPayload?.tone,

  depth:
    natPayload?.depth,

  interactionIntent:
    natPayload?.interactionIntent,

  confidenceLevel:
    natPayload?.confidenceLevel,

  formatTier:
    natPayload?.formatTier,

 formatRules:
  isChildCareerTimingGuard
    ? [
        "Do not answer with adult career timing.",
        "State clearly that job-change, promotion, employer, resignation, salary, or joining timing is not meaningful for a child.",
        "Redirect the answer toward future aptitude, strengths, interests, learning style, and age-appropriate development.",
        "Do not mention dasha, transits, dates, timing windows, recruiters, interviews, employers, promotion, resignation, or salary negotiation.",
      ].join(" ")
    : isChildParenthoodTimingGuard
? [
    "Do not answer with conception, childbirth, or parenthood timing for a child.",
    "State clearly that parenthood timing is not meaningful at this age.",
    "Redirect toward age-appropriate development, responsibility, empathy, relationships, and future potential.",
    "Do not mention dasha, transits, dates, timing windows, conception, pregnancy, childbirth dates, or family-expansion periods.",
  ].join(" ")
: isChildMarriageTimingGuard
? [
    "Do not answer with marriage, partner-meeting, or relationship timing for a child.",
    "State clearly that marriage timing is not meaningful at this age.",
    "Redirect toward emotional maturity, friendship, communication, boundaries, empathy, and healthy relationship development.",
    "Do not mention dasha, transits, dates, timing windows, engagement periods, marriage dates, or partner-meeting windows.",
  ].join(" ")
    : isProfessionIdentity
    ? [
        "Answer the profession suitability question directly.",
        "Focus on long-term natural aptitude and vocational fit.",
        "Explain the result from capabilities, natal career promise, planetary relationships, and relevant divisional confirmation.",
        "Do not discuss current dasha, transits, dates, timing windows, career movement, visibility cycles, promotion timing, or breakthrough periods.",
      ].join(" ")
    : isRelationshipPermanent
    ? [
        "Answer the relationship or marriage-pattern question directly.",
        "Focus on enduring relationship capacity, partner style, emotional needs, commitment pattern, communication, and compatibility.",
        "Use natal relationship promise, relevant houses and lords, planetary relationships, karakas, and D9 confirmation.",
        "Do not discuss current dasha, transits, dates, marriage timing, meeting windows, reconciliation timing, or activation periods unless the user explicitly asks when.",
        "Keep practical guidance appropriate to the user's age and life stage.",
      ].join(" ")
        : isWealthPermanent
    ? [
        "Answer the permanent wealth question directly.",
        "Focus on enduring earning capacity, wealth accumulation, financial retention, saving behaviour, investment temperament, and income structure.",
        "Use relevant natal houses and lords, planetary relationships, karakas, D2 confirmation, and D10 only where professional earning is relevant.",
        "Distinguish earning potential from wealth retention and accumulation.",
        "Do not discuss current dasha, transits, dates, salary timing, bonus timing, financial-improvement windows, or wealth activation unless the user explicitly asks when.",
        "Keep practical guidance appropriate to the user's age and life stage.",
      ].join(" ")
    : isBusinessPermanent
? [
    "Answer the permanent business question directly.",
    "Focus on enduring entrepreneurial capacity, business style, commercial temperament, partnership suitability, execution ability, and risk pattern.",
    "Use relevant natal houses and lords, planetary relationships, karakas, and D10 confirmation.",
    "Distinguish natural business capacity from current launch or growth timing.",
    "Do not discuss current dasha, transits, dates, launch windows, client-growth periods, partnership timing, or business-growth periods unless the user explicitly asks when.",
    "Keep practical guidance appropriate to the user's age and life stage.",
  ].join(" ")
: isEducationPermanent
? [
    "Answer the permanent education question directly.",
    "Focus on enduring learning capacity, subject aptitude, stream suitability, study pattern, concentration style, and academic development.",
    "Use relevant natal houses and lords, planetary relationships, karakas, and D24 confirmation.",
    "Distinguish natural learning aptitude from current exam performance or temporary academic pressure.",
    "Do not discuss current dasha, transits, dates, exam-result timing, admission windows, higher-education timing, or academic-improvement periods unless the user explicitly asks when.",
    "Keep practical guidance appropriate to the user's age and life stage.",
  ].join(" ")
: isSpiritualPermanent
? [
    "Answer the permanent spiritual question directly.",
    "Focus on enduring spiritual inclination, devotional temperament, meditative capacity, mantra affinity, guru pattern, and dharmic orientation.",
    "Use relevant natal houses and lords, planetary relationships, karakas, D20 confirmation, and D9 only where dharma or guru maturity is relevant.",
    "Distinguish natural spiritual inclination from temporary spiritual activation or current timing.",
    "Do not discuss current dasha, transits, dates, spiritual-growth periods, guru-arrival timing, activation windows, or timing predictions unless the user explicitly asks when.",
    "Keep practical guidance appropriate to the user's age and life stage.",
  ].join(" ")
  : isHealthPermanent
? [
    "Answer the permanent health-pattern question directly.",
    "Focus on enduring constitution, resilience, stress pattern, lifestyle sensitivity, recovery capacity, and wellbeing tendencies.",
    "Use relevant natal houses and lords, planetary relationships, karakas, and D6/D30 confirmation.",
    "Describe astrological tendencies, not medical diagnoses.",
    "Do not discuss current dasha, transits, dates, sensitive periods, recovery windows, or health-improvement timing unless the user explicitly asks when.",
    "Do not recommend medication, treatment changes, procedures, or replacement of professional medical care.",
    "Keep practical guidance appropriate to the user's age and life stage.",
  ].join(" ")
: isChildPermanent
? [
    "Answer the permanent child or parenthood question directly.",
    "Focus on enduring parenthood potential, parenting style, parent-child dynamics, or the child's natural aptitude.",
    "Use the 5th house and 5th lord, relevant supporting houses, Jupiter, Moon, planetary relationships, and D7 confirmation.",
    "Distinguish permanent parenting or child-development patterns from conception, childbirth, or child-related timing.",
    "Do not discuss current dasha, transits, dates, conception windows, childbirth timing, child-development periods, or family-expansion timing unless the user explicitly asks when.",
    "Keep practical guidance appropriate to the age and life stage of both the user and the child being discussed.",
  ].join(" ")
: isPropertyPermanent
? [
    "Answer the permanent property question directly.",
    "Focus on enduring property potential, home stability, ownership pattern, real-estate temperament, and asset-building capacity.",
    "Use the 4th house and 4th lord, relevant supporting houses, planetary relationships, karakas, and D4 confirmation.",
    "Distinguish permanent property potential from the timing of an actual purchase, sale, possession, or move.",
    "Do not discuss current dasha, transits, dates, purchase windows, sale windows, possession dates, relocation timing, or property-activation periods unless the user explicitly asks when.",
    "Keep practical guidance appropriate to the user's age and life stage.",
  ].join(" ")
: isVehiclePermanent
? [
    "Answer the permanent vehicle question directly.",
    "Focus on enduring vehicle ownership potential, mobility style, comfort preference, practicality, performance orientation, and recurring vehicle patterns.",
    "Use the 4th house and 4th lord, relevant supporting houses, planetary relationships, karakas, and D16 confirmation.",
    "Distinguish permanent vehicle potential or preference from the timing of an actual purchase or upgrade.",
    "Do not discuss current dasha, transits, dates, purchase windows, upgrade periods, delivery dates, financing windows, or vehicle-activation periods unless the user explicitly asks when.",
    "Keep practical guidance appropriate to the user's age and life stage.",
  ].join(" ")
: isRelocationPermanent
? [
    "Answer the permanent relocation question directly.",
    "Focus on enduring relocation potential, foreign-settlement potential, residential stability, adaptability, and location preference.",
    "Use the 4th, 9th, and 12th houses and their lords as relevant, planetary relationships, karakas, and D4/D9 confirmation.",
    "Distinguish permanent relocation or foreign-settlement potential from the timing of an actual move.",
    "Do not discuss current dasha, transits, dates, visa timing, move windows, settlement periods, or relocation-activation periods unless the user explicitly asks when.",
    "Keep practical guidance appropriate to the user's age and life stage.",
  ].join(" ")
: isDisputePermanent
? [
    "Answer the permanent dispute or legal-pattern question directly.",
    "Focus on enduring conflict style, negotiation pattern, litigation tendency, strategic temperament, and resolution style.",
    "Use the 3rd, 6th, 7th, and 8th houses and their lords as relevant, planetary relationships, karakas, and D6/D30 confirmation.",
    "Distinguish permanent dispute or negotiation patterns from the timing or outcome of an actual legal matter.",
    "Do not discuss current dasha, transits, dates, court timing, settlement windows, case-resolution periods, or legal activation unless the user explicitly asks when.",
    "Do not present astrology as legal advice or guarantee a legal outcome.",
    "Keep practical guidance appropriate to the user's age and life stage.",
  ].join(" ")
: isParentsPermanent
? [
    "Answer the permanent parent-related question directly.",
    "Focus on enduring parent-child dynamics, maternal or paternal influence, emotional inheritance, expectations, values, authority, responsibility, and family-elder patterns.",
    "Use the 4th and 9th houses and lords as relevant, Sun, Moon, Jupiter, Saturn, planetary relationships, D12, and D9 where relevant.",
    "Distinguish permanent family patterns from timing of parental support or responsibility.",
    "Do not discuss current dasha, transits, dates, parental-support periods, responsibility windows, or family timing unless explicitly asked when.",
    "Keep practical guidance appropriate to the user's age and life stage.",
  ].join(" ")

: isSiblingsPermanent
? [
    "Answer the permanent sibling question directly.",
    "Focus on enduring sibling dynamics, communication, rivalry, support, cooperation, expectations, and family roles.",
    "Use the 3rd and 11th houses and lords as relevant, Mars, Mercury, planetary relationships, and D3 confirmation.",
    "Distinguish permanent sibling patterns from conflict or support timing.",
    "Do not discuss current dasha, transits, dates, sibling-conflict periods, or support windows unless explicitly asked when.",
    "Keep practical guidance appropriate to the user's age and life stage.",
  ].join(" ")
  : isTravelPermanent
? [
    "Answer the permanent travel question directly.",
    "Focus on enduring travel inclination, foreign-travel pattern, mobility, adaptability, frequency of movement, and pilgrimage orientation.",
    "Use the 3rd, 9th, and 12th houses and their lords as relevant, planetary relationships, karakas, and D9/D4 confirmation.",
    "Use D20 only when pilgrimage or explicitly spiritual travel is relevant.",
    "Distinguish permanent travel inclination from the timing of an actual journey.",
    "Do not discuss current dasha, transits, dates, visa timing, departure dates, travel windows, or pilgrimage timing unless the user explicitly asks when.",
    "Keep practical guidance appropriate to the user's age and life stage.",
  ].join(" ")
  : isReputationPermanent
? [
    "Answer the permanent reputation question directly.",
    "Focus on enduring public-image pattern, recognition potential, visibility style, credibility, influence, and status orientation.",
    "Use the 1st, 10th, and 11th houses and their lords as relevant, planetary relationships, karakas, and D10/D9 confirmation.",
    "Distinguish permanent recognition potential from the timing of when visibility or public acknowledgement may increase.",
    "Do not discuss current dasha, transits, dates, recognition windows, reputation-growth periods, recovery periods, or visibility timing unless the user explicitly asks when.",
    "Keep practical guidance appropriate to the user's age and life stage.",
  ].join(" ")
  : isDebtPermanent
? [
    "Answer the permanent debt question directly.",
    "Focus on enduring borrowing tendency, repayment discipline, liability pattern, financial pressure, liquidity behaviour, and debt-management style.",
    "Use the 2nd, 6th, 8th, 11th, and 12th houses and their lords as relevant, planetary relationships, karakas, and D2/D6 confirmation.",
    "Distinguish permanent debt or repayment patterns from the timing of a loan, repayment, refinancing, or debt reduction.",
    "Do not discuss current dasha, transits, dates, borrowing windows, repayment periods, debt-reduction timing, or loan timing unless the user explicitly asks when.",
    "Do not present astrology as financial advice or recommend borrowing based only on the chart.",
    "Keep practical guidance appropriate to the user's age and life stage.",
  ].join(" ")
  : isInheritancePermanent
? [
    "Answer the permanent inheritance question directly.",
    "Focus on enduring inheritance potential, ancestral patterns, legacy themes, shared-resource dynamics, and inheritance-related family patterns.",
    "Use the 8th house and 8th lord, relevant supporting houses, planetary relationships, karakas, and D8/D12 confirmation.",
    "Distinguish permanent inheritance or legacy potential from the timing, value, legal entitlement, or transfer of an actual asset.",
    "Do not discuss current dasha, transits, dates, probate timing, settlement windows, inheritance dates, or asset-transfer timing unless the user explicitly asks when.",
    "Do not present astrology as legal, tax, estate-planning, or financial advice.",
    "Keep practical guidance appropriate to the user's age and life stage.",
  ].join(" ")
  : isMentalHealthPermanent
? [
    "Answer the permanent mental or emotional pattern question directly.",
    "Focus on enduring cognitive style, emotional sensitivity, stress response, regulation pattern, resilience, and coping tendencies.",
    "Use the 1st, 4th, 8th, and 12th houses and their lords as relevant, planetary relationships, karakas, and D9/D30 confirmation.",
    "Describe astrological tendencies, not psychiatric diagnoses.",
    "Do not discuss current dasha, transits, dates, sensitive periods, recovery windows, or mental-health timing unless the user explicitly asks when.",
    "Do not recommend medication or treatment changes and do not present astrology as a substitute for mental-health care.",
    "Keep practical guidance appropriate to the user's age and life stage.",
  ].join(" ")
  : isPetsPermanent
? [
    "Answer the permanent pet-related question directly.",
    "Focus on enduring caregiving style, emotional bond with animals, responsibility, sensitivity, attachment, and service.",
    "Use the 6th house and lord, relevant supporting houses, planetary relationships, karakas, and D6/D30 confirmation.",
    "Do not discuss current dasha, transits, dates, illness periods, loss periods, or pet-related timing unless the user explicitly asks when.",
    "Do not present astrology as veterinary advice.",
    "Keep practical guidance appropriate to the user's age and life stage.",
  ].join(" ")

: isInnerPermanent
? [
    "Answer the permanent inner-life question directly.",
    "Focus on enduring purpose, meaning, self-understanding, values, inner conflict, dharma, and growth orientation.",
    "Use the 1st, 8th, 9th, and 12th houses and lords as relevant, planetary relationships, karakas, and D9 confirmation.",
    "Distinguish broad inner direction from one fixed destiny or compulsory life path.",
    "Do not discuss current dasha, transits, dates, activation periods, or life-direction timing unless explicitly asked when.",
    "Keep practical guidance appropriate to the user's age and life stage.",
  ].join(" ")
    : natPayload?.formatRules,

  distressed:
    natPayload?.distressed,

  moodHint:
    natPayload?.moodHint,

  simpleGuidanceMode:
    natPayload?.simpleGuidanceMode,

 astroFacts:
  isProfessionIdentity
    ? professionAstroFacts
    : isRelationshipPermanent
    ? relationshipAstroFacts
    : isWealthPermanent
    ? wealthAstroFacts
    : isBusinessPermanent
    ? businessAstroFacts
    : isEducationPermanent
    ? educationAstroFacts
    : isSpiritualPermanent
    ? spiritualAstroFacts
    : isHealthPermanent
    ? healthAstroFacts
    : isChildPermanent
    ? childAstroFacts
    : isPropertyPermanent
    ? propertyAstroFacts
    : isVehiclePermanent
    ? vehicleAstroFacts
    : isRelocationPermanent
    ? relocationAstroFacts
    : isDisputePermanent
    ? disputeAstroFacts
    : isParentsPermanent
    ? parentsAstroFacts
    : isSiblingsPermanent
    ? siblingsAstroFacts
    : isTravelPermanent
    ? travelAstroFacts
    : isReputationPermanent
    ? reputationAstroFacts
    : isDebtPermanent
    ? debtAstroFacts
    : isInheritancePermanent
    ? inheritanceAstroFacts
    : isMentalHealthPermanent
? mentalHealthAstroFacts
: isPetsPermanent
? petsAstroFacts
: isInnerPermanent
? innerAstroFacts
: normalAstroFacts,


  astrologyEvidencePacket:
  shouldSuppressTiming
    ? null
    : normalEvidencePacket,

  divisionalAnalysis:
    astroBundle?.divisionalAnalysis ??
    null,

reasoningInstructions:
  isChildCareerTimingGuard
    ? childCareerTimingReasoningInstructions
    : isChildParenthoodTimingGuard
    ? childParenthoodTimingReasoningInstructions
    : isChildMarriageTimingGuard
    ? childMarriageTimingReasoningInstructions
    : isProfessionIdentity
    ? professionReasoningInstructions
    : isRelationshipPermanent
    ? relationshipReasoningInstructions
    : isWealthPermanent
    ? wealthReasoningInstructions
    : isBusinessPermanent
    ? businessReasoningInstructions
    : isEducationPermanent
    ? educationReasoningInstructions
    : isSpiritualPermanent
? spiritualReasoningInstructions
: isHealthPermanent
? healthReasoningInstructions
: isChildPermanent
? childReasoningInstructions
: isPropertyPermanent
? propertyReasoningInstructions
: isVehiclePermanent
? vehicleReasoningInstructions
: isRelocationPermanent
? relocationReasoningInstructions
: isDisputePermanent
? disputeReasoningInstructions
: isParentsPermanent
? parentsReasoningInstructions
: isSiblingsPermanent
? siblingsReasoningInstructions
: isTravelPermanent
? travelReasoningInstructions
: isReputationPermanent
? reputationReasoningInstructions
: isDebtPermanent
? debtReasoningInstructions
: isInheritancePermanent
? inheritanceReasoningInstructions
: isMentalHealthPermanent
? mentalHealthReasoningInstructions
: isPetsPermanent
? petsReasoningInstructions
: isInnerPermanent
? innerReasoningInstructions
: standardReasoningInstructions,

  nearestWindow:
    shouldSuppressTiming
      ? null
      : astroBundle?.nearestWindow ?? null,

  strongestWindow:
    shouldSuppressTiming
      ? null
      : astroBundle?.strongestWindow ?? null,

  rankedTimingWindows:
    shouldSuppressTiming
      ? []
      : astroBundle?.rankedTimingWindows ?? [],

  bestAvailableWindow:
    shouldSuppressTiming
      ? null
      : astroBundle?.bestAvailableWindow ?? null,

  selectedTimingWindow:
    shouldSuppressTiming
      ? null
      : astroBundle?.selectedTimingWindow ?? null,
  timingSummary,
  eventTriggers:
    shouldSuppressTiming
      ? []
      : astroBundle?.eventTriggers ?? [],

  bestEventTrigger:
    shouldSuppressTiming
      ? null
      : astroBundle?.bestEventTrigger ?? null,

  winningEvidence:
    shouldSuppressTiming
      ? null
      : astroBundle?.winningEvidence ?? null,

  whyNotNow:
    shouldSuppressTiming
      ? []
      : astroBundle?.whyNotNow ?? [],

  conversionDiagnosisV2:
    shouldSuppressTiming
      ? null
      : astroBundle?.conversionDiagnosisV2 ?? null,

  explainabilityProfile:
    shouldSuppressTiming
      ? null
      : astroBundle?.explainabilityProfile ?? null,

  decision:
    shouldSuppressTiming
      ? null
      : astroBundle?.decision ?? null,

  sambandhaAnalysis:
    astroBundle?.sambandhaAnalysis ??
    null,

  astroJudgement:
    shouldSuppressTiming
      ? null
      : natPayload?.astroJudgement ??
        astroBundle?.astroJudgement ??
        null,

  dailyAstroContext:
    shouldSuppressTiming
      ? null
      : natPayload?.dailyAstroContext ??
        astroBundle?.dailyAstroContext ??
        null,

  evidenceBullets:
    shouldSuppressTiming
      ? []
      : natPayload?.evidenceBullets ??
        astroBundle?.evidenceBullets ??
        [],

  finalDecisionLine:
    shouldSuppressTiming
      ? null
      : natPayload?.finalDecisionLine,

  finalDecisionVerdict:
    shouldSuppressTiming
      ? null
      : natPayload?.finalDecisionVerdict,

  verdict:
    natPayload?.verdict,

  humanReason:
    shouldSuppressTiming
      ? null
      : natPayload?.humanReason,

  astroReason:
    shouldSuppressTiming
      ? null
      : natPayload?.astroReason,

  answerRequirements: {
    productTier:
      "paid_astrology_answer",

    minimumUsefulLength:
      questionType === "timing"
        ? 280
        : 180,

    directAnswerFirst:
      true,

    mustAnswerExactEvent:
      astroBundle?.eventType ??
      astroBundle?.careerEventType ??
      topic,

    timingRules:
  shouldSuppressTiming
    ? null
    : {
            explainWhetherDateMeans:
              "preparation, activation, movement, conversion, or final outcome",

            distinguishActivationFromOutcome:
              true,

            headlineMustUseRangeWhenAvailable:
              true,

            topicLanguageRule:
              "Use language belonging to the detected topic and event type. Never use career, promotion, job-change, recruiter, networking, résumé, employer, professional, visibility, or workplace language unless the detected topic is career.",

            actionRule:
              "Practical guidance must match the detected topic. Vehicle questions require vehicle-purchase guidance, property questions require property guidance, relationship questions require relationship guidance, and career questions require career guidance.",

            singleDateRole:
              "A single date is only a peak or activation point inside the broader timing window, never the guaranteed event date.",

            rangePriority:
  "When TIMING_HIERARCHY.practicalWindow exists, headline its complete start-to-end range. Mention activationWindow only as a supporting trigger or peak inside the larger timing structure.",

mustUseTimingHierarchy:
  "If TIMING_HIERARCHY exists, the first paragraph MUST follow it. practicalWindow is primary, broaderWindow is context, and activationWindow is only a narrower trigger.",

            doNotRepeatSameDate:
              true,

            doNotShowRawISODate:
              true,

            doNotGuaranteeExactOutcome:
              true,

            describeWhatMayHappenInTheWindow:
              true,

            includePracticalPreparation:
              true,
            
          },

    structure:
  questionType === "timing"
  ? [
      "Answer the timing question directly in the first sentence.",

      "TIMING_HIERARCHY is the authoritative source for timing structure whenever it is available.",

      "If TIMING_HIERARCHY.practicalWindow exists, the FIRST sentence MUST state the full practicalWindow date range.",

      "If TIMING_HIERARCHY.broaderWindow exists, mention it after the practical window as the broader opportunity phase.",

      "If TIMING_HIERARCHY.activationWindow exists, describe it only as a narrower activation trigger, catalyst, or peak within the larger timing structure.",
      "If activationWindow occurs materially before practicalWindow, describe it as an early signal, preparatory trigger, opening conversation, or momentum-building point rather than as a launch or completion date.",

"If activationWindow falls inside practicalWindow, it may be described as a sharper peak or catalyst within the main actionable period.",

"Never make the activationWindow appear more important than the practicalWindow.",
      "Never replace a practicalWindow range with the activationWindow date.",

      "Never call activationWindow the main, strongest, or overall window when practicalWindow exists.",

      "Use DECISION_SUMMARY for the final timing conclusion, confidence, classification, and practical meaning.",

      "If practicalWindow is null but broaderWindow exists, answer with the broaderWindow and explain that no narrower actionable period is established.",

      "If TIMING_HIERARCHY is unavailable, only then use selectedTimingWindow or other supplied timing fields as fallback evidence.",

      "Do not invent dates, timing windows, confidence, or astrological reasons.",

      "Explain WHY the timing exists using supplied natal promise, planetary relationships, divisional confirmation, dasha support, transit activation, and conversion evidence.",
      "Translate astrology into practical meaning. Do not merely list planets, houses or yogas.",

"When mentioning planets, immediately explain what practical influence they represent in the user's life.",

"Prefer explanations over terminology. Readers should understand why the chart produces the prediction, not simply which combinations were found.",
      "Explain the likely practical developments during the actionable window.",

      "Finish with practical actions appropriate before, during, and after the window."
    ]
  : isProfessionIdentity
  ? [
      "Answer whether the requested profession is a strong, moderate, conditional, or weak long-term fit.",
      "Explain the strongest capabilities supporting the profession.",
      "Explain the most important capability gaps or cautions.",
      "Support the conclusion using natal career promise, planetary relationships, and relevant divisional confirmation.",
      "Mention stronger alternative career directions only when they materially clarify the result.",
      "Give practical long-term developmental guidance appropriate to the question.",
      "Do not discuss current timing unless the user explicitly asks when to pursue the profession.",
    ]
  : isRelationshipPermanent
  ? [
      "Answer the exact relationship-pattern question directly.",
      "Explain the strongest relationship strengths and needs.",
      "Explain the most important cautions or recurring patterns.",
      "Support the conclusion using relevant natal houses and lords, planetary relationships, karakas, and D9 confirmation.",
      "For partner-profile questions, describe suitable qualities and dynamics rather than predicting a specific person.",
      "For love-versus-arranged questions, compare both patterns without claiming certainty.",
      "Give practical age-appropriate relationship guidance.",
      "Do not discuss timing unless the user explicitly asks when.",
    ]
    : isWealthPermanent
? [
    "Answer the exact wealth question directly.",
    "Explain the strongest financial strengths and capacities.",
    "Explain the most important weaknesses, leakage patterns, or cautions.",
    "Distinguish earning capacity from saving, retention, and accumulation.",
    "Support the conclusion using relevant natal houses and lords, planetary relationships, karakas, and D2 confirmation.",
    "Use D10 only when professional earning or income structure is relevant.",
    "For investment-suitability questions, discuss temperament and discipline rather than specific products or trades.",
    "Give practical age-appropriate financial-development guidance.",
    "Do not discuss timing unless the user explicitly asks when.",
  ]
  : isBusinessPermanent
? [
    "Answer the exact business question directly.",
    "Explain the strongest entrepreneurial and commercial strengths.",
    "Explain the most important execution, risk, partnership, or operational cautions.",
    "Support the conclusion using relevant natal houses and lords, planetary relationships, karakas, and D10 confirmation.",
    "For business-versus-job questions, compare both paths on long-term suitability rather than present timing.",
    "For partnership-suitability questions, explain the best ownership or collaboration structure.",
    "Give practical age-appropriate business-development guidance.",
    "Do not discuss timing unless the user explicitly asks when.",
  ]
: isEducationPermanent
? [
    "Answer the exact education question directly.",
    "Explain the strongest learning strengths and aptitudes.",
    "Explain the most important concentration, discipline, memory, or learning-style cautions.",
    "Support the conclusion using relevant natal houses and lords, planetary relationships, karakas, and D24 confirmation.",
    "For subject-fit questions, explain the strongest suitable subject families rather than forcing one narrow choice.",
    "For stream-choice questions, compare the requested streams on long-term aptitude.",
    "For study-pattern questions, explain how the user learns best and what may obstruct consistency.",
    "Give practical age-appropriate educational guidance.",
    "Do not discuss timing unless the user explicitly asks when.",
  ]
  : isSpiritualPermanent
? [
    "Answer the exact spiritual question directly.",
    "Explain the strongest spiritual inclinations and capacities.",
    "Explain the most important cautions, imbalances, or developmental needs.",
    "Support the conclusion using relevant natal houses and lords, planetary relationships, karakas, and D20 confirmation.",
    "Use D9 only when dharma, guru connection, or spiritual maturity materially clarifies the answer.",
    "For spiritual-path questions, compare supported paths without forcing one exclusive path.",
    "For meditation, mantra, devotion, or guru questions, explain natural suitability and developmental style rather than timing.",
    "Give practical age-appropriate spiritual guidance.",
    "Do not discuss timing unless the user explicitly asks when.",
  ]
  : isHealthPermanent
? [
    "Answer the exact health-pattern question directly.",
    "Explain the strongest constitutional or resilience factors.",
    "Explain the most important sensitivities, stress patterns, or lifestyle cautions.",
    "Support the conclusion using relevant natal houses and lords, planetary relationships, karakas, and D6/D30 confirmation.",
    "Clearly distinguish astrological health tendencies from medical diagnosis.",
    "For lifestyle questions, give only general wellbeing guidance such as routine, sleep, movement, hydration, recovery, and stress management.",
    "If the question involves actual symptoms, diagnosis, treatment, medication, or an ongoing medical condition, advise appropriate professional medical evaluation.",
    "Give practical age-appropriate wellbeing guidance.",
    "Do not discuss timing unless the user explicitly asks when.",
  ]
  : isChildPermanent
? [
    "Answer the exact child or parenthood question directly.",
    "Explain the strongest parenting, nurturing, communication, or child-development strengths.",
    "Explain the most important emotional, behavioural, expectation, discipline, or communication cautions.",
    "Support the conclusion using the 5th house and lord, relevant planetary relationships, karakas, and D7 confirmation.",
    "For parenting-style questions, explain nurturing, structure, discipline, expectations, and communication style.",
    "For parent-child relationship questions, explain interaction patterns without blaming either the parent or child.",
    "For child-aptitude questions, describe natural strengths and developmental potential rather than fixed adult outcomes.",
    "Give practical age-appropriate developmental guidance.",
    "Do not discuss timing unless the user explicitly asks when.",
  ]
  : isPropertyPermanent
? [
    "Answer the exact property question directly.",
    "Explain the strongest property, ownership, home-stability, or asset-building factors.",
    "Explain the most important delays, volatility, leverage sensitivity, movement patterns, or property-related cautions.",
    "Support the conclusion using the 4th house and lord, relevant planetary relationships, karakas, and D4 confirmation.",
    "For property-investment-suitability questions, explain long-term suitability rather than recommending a specific property or transaction.",
    "For home-stability questions, explain settlement and residential patterns without predicting a specific place.",
    "Give practical age-appropriate long-term property guidance.",
    "Do not discuss timing unless the user explicitly asks when.",
  ]
  : isVehiclePermanent
? [
    "Answer the exact vehicle question directly.",
    "Explain the strongest vehicle, comfort, mobility, or ownership factors.",
    "Explain the most important cautions such as impulsive upgrading, maintenance pressure, practicality, comfort-seeking, or repeated change.",
    "Support the conclusion using the 4th house and lord, relevant planetary relationships, karakas, and D16 confirmation.",
    "For vehicle-preference questions, describe suitable qualities or usage style rather than recommending a specific make or model.",
    "For vehicle-pattern questions, explain recurring tendencies without presenting them as inevitable.",
    "Give practical age-appropriate long-term vehicle guidance.",
    "Do not discuss timing unless the user explicitly asks when.",
  ]
: isRelocationPermanent
? [
    "Answer the exact relocation question directly.",
    "Explain the strongest movement, settlement, adaptability, or foreign-living factors.",
    "Explain the most important stability, restlessness, adjustment, attachment-to-home, or relocation cautions.",
    "Support the conclusion using the 4th, 9th, and 12th houses and lords, relevant planetary relationships, karakas, and D4/D9 confirmation.",
    "For foreign-settlement questions, explain long-term suitability without guaranteeing permanent settlement.",
    "For location-preference questions, describe suitable environments or lifestyle settings rather than predicting one exact city or country.",
    "Give practical age-appropriate long-term relocation guidance.",
    "Do not discuss timing unless the user explicitly asks when.",
  ]
: isDisputePermanent
? [
    "Answer the exact dispute or legal-pattern question directly.",
    "Explain the strongest negotiation, strategy, persistence, communication, or conflict-resolution strengths.",
    "Explain the most important escalation, rigidity, impulsiveness, avoidance, documentation, or boundary cautions.",
    "Support the conclusion using the 3rd, 6th, 7th, and 8th houses and lords, relevant planetary relationships, karakas, and D6/D30 confirmation.",
    "For legal-suitability questions, explain analytical and strategic capacity without guaranteeing litigation success.",
    "For negotiation-style questions, explain the user's natural resolution style and where balance is needed.",
    "If an actual legal matter is involved, distinguish astrological interpretation from legal strategy.",
    "Give practical age-appropriate conflict-management guidance.",
    "Do not discuss timing unless the user explicitly asks when.",
  ]
  : isParentsPermanent
? [
    "Answer the exact parent-related question directly.",
    "Explain the strongest emotional, supportive, authority, guidance, or family-conditioning factors.",
    "Explain the most important expectation, boundary, approval, emotional-security, responsibility, or generational cautions.",
    "Support the conclusion using the 4th and 9th houses and lords, relevant karakas, planetary relationships, D12, and D9 where appropriate.",
    "For mother or father questions, keep the analysis specific to that parental relationship.",
    "Give practical age-appropriate family guidance.",
    "Do not discuss timing unless explicitly asked when.",
  ]

: isSiblingsPermanent
? [
    "Answer the exact sibling question directly.",
    "Explain the strongest communication, support, cooperation, closeness, or family-role factors.",
    "Explain the most important rivalry, misunderstanding, distance, expectation, fairness, or boundary cautions.",
    "Support the conclusion using the 3rd and 11th houses and lords, relevant karakas, planetary relationships, and D3 confirmation.",
    "Distinguish elder-sibling and younger-sibling patterns when relevant.",
    "Give practical age-appropriate sibling guidance.",
    "Do not discuss timing unless explicitly asked when.",
  ]
  : isTravelPermanent
? [
    "Answer the exact travel question directly.",
    "Explain the strongest movement, adaptability, curiosity, foreign-travel, or pilgrimage factors.",
    "Explain the most important restlessness, instability, overstimulation, attachment-to-home, or travel-related cautions.",
    "Support the conclusion using the 3rd, 9th, and 12th houses and lords, relevant planetary relationships, karakas, and D9/D4 confirmation.",
    "Use D20 only when pilgrimage or spiritual travel is relevant.",
    "For foreign-travel questions, keep the answer about journeys rather than permanent settlement unless the user explicitly asks about relocation.",
    "Give practical age-appropriate travel guidance.",
    "Do not discuss timing unless the user explicitly asks when.",
  ]
  : isReputationPermanent
? [
    "Answer the exact reputation question directly.",
    "Explain the strongest credibility, recognition, leadership, visibility, influence, or public-image factors.",
    "Explain the most important delayed-recognition, image-pressure, competition, privacy, inconsistency, or validation-related cautions.",
    "Support the conclusion using the 1st, 10th, and 11th houses and lords, relevant planetary relationships, karakas, and D10/D9 confirmation.",
    "For public-image questions, explain likely projection and perception patterns without claiming that everyone will see the native in the same way.",
    "For recognition-pattern questions, distinguish recognition potential from how quickly recognition arrives.",
    "Give practical age-appropriate reputation and visibility guidance.",
    "Do not discuss timing unless the user explicitly asks when.",
  ]
  : isDebtPermanent
? [
    "Answer the exact debt question directly.",
    "Explain the strongest repayment, discipline, liquidity, financial-management, or liability-control factors.",
    "Explain the most important borrowing, overextension, cash-flow mismatch, obligation, or repayment cautions.",
    "Support the conclusion using the 2nd, 6th, 8th, 11th, and 12th houses and lords, relevant planetary relationships, karakas, and D2/D6 confirmation.",
    "For borrowing-tendency questions, distinguish responsible credit use from pressured, habitual, or leveraged borrowing.",
    "For repayment-capacity questions, distinguish earning ability from repayment discipline and liquidity.",
    "If an actual debt problem is involved, distinguish astrological interpretation from financial advice.",
    "Give practical age-appropriate financial-discipline guidance.",
    "Do not discuss timing unless the user explicitly asks when.",
  ]
  : isInheritancePermanent
? [
    "Answer the exact inheritance or legacy question directly.",
    "Explain the strongest inheritance, legacy, ancestral, shared-resource, or family-asset factors.",
    "Explain the most important delay, ambiguity, documentation, competing-expectation, family-conflict, or responsibility cautions.",
    "Support the conclusion using the 8th house and lord, relevant supporting houses, planetary relationships, karakas, and D8/D12 confirmation.",
    "For inheritance-potential questions, distinguish potential from guaranteed receipt, amount, or legal entitlement.",
    "For ancestral-pattern questions, distinguish material inheritance from family values, responsibilities, identity, property, knowledge, or other forms of legacy.",
    "If an actual estate, probate, inheritance, insurance, or family-property matter is involved, distinguish astrological interpretation from legal and financial advice.",
    "Give practical age-appropriate legacy and family-resource guidance.",
    "Do not discuss timing unless the user explicitly asks when.",
  ]
  : isMentalHealthPermanent
? [
    "Answer the exact mental or emotional pattern question directly.",
    "Explain the strongest emotional-awareness, cognitive, coping, resilience, regulation, or support factors.",
    "Explain the most important rumination, overstimulation, emotional-reactivity, withdrawal, stress-load, or regulation cautions.",
    "Support the conclusion using the 1st, 4th, 8th, and 12th houses and lords, relevant planetary relationships, karakas, and D9/D30 confirmation.",
    "Clearly distinguish astrological mental and emotional tendencies from psychiatric diagnosis.",
    "For overthinking or mood-sensitivity questions, discuss patterns and coping needs without assigning a clinical label.",
    "If the user describes actual symptoms, functional impairment, treatment, medication, self-harm thoughts, suicidal thoughts, psychosis, or immediate danger, prioritize appropriate professional support rather than astrological interpretation.",
    "Give practical age-appropriate emotional wellbeing guidance.",
    "Do not discuss timing unless the user explicitly asks when.",
  ]
  : isPetsPermanent
? [
    "Answer the exact pet-related question directly.",
    "Explain the strongest caregiving, bonding, empathy, responsibility, companionship, or sensitivity factors.",
    "Explain the most important routine, boundary, attachment, responsibility, or practical-care cautions.",
    "Support the conclusion using the 6th house and lord, relevant planetary relationships, karakas, and D6/D30 confirmation.",
    "Give practical age-appropriate pet-care guidance.",
    "Do not discuss timing unless explicitly asked when.",
  ]

: isInnerPermanent
? [
    "Answer the exact inner-life question directly.",
    "Explain the strongest purpose, meaning, values, self-understanding, dharma, or growth factors.",
    "Explain the most important inner conflict, uncertainty, attachment, fear, control, expectation, or direction-related cautions.",
    "Support the conclusion using the 1st, 8th, 9th, and 12th houses and lords, relevant planetary relationships, karakas, and D9 confirmation.",
    "For purpose questions, give broad themes rather than one compulsory destiny.",
    "For self-understanding questions, explain recurring patterns without presenting personality as fixed.",
    "Give practical age-appropriate reflection and growth guidance.",
    "Do not discuss timing unless explicitly asked when.",
  ]
  : [
      "Answer the exact question directly.",
      "Explain the main reason.",
      "Give practical guidance.",
    ],

    forbiddenPatterns: [
  ...(isChildCareerTimingGuard
    ? [
        "Do not mention job change, employer change, recruiters, applications, interviews, promotion, resignation, joining, salary negotiation, networking, workplace visibility, or professional movement.",
        "Do not provide adult career timing to a child.",
        "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, trigger dates, or employment dates.",
        "Do not speak as though the child is currently employed.",
      ]
    : isChildParenthoodTimingGuard
? [
    "Do not provide conception, pregnancy, childbirth, or parenthood timing to a child.",
    "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, trigger dates, conception dates, pregnancy periods, or childbirth dates.",
    "Do not speak as though the child is currently married, sexually active, pregnant, trying to conceive, or planning parenthood.",
    "Do not give reproductive or family-planning advice to a child.",
  ]
  : isChildMarriageTimingGuard
? [
    "Do not provide marriage, engagement, partner-meeting, dating, or commitment timing to a child.",
    "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, marriage dates, engagement dates, or partner-meeting dates.",
    "Do not speak as though the child is currently dating, engaged, seeking a spouse, or planning marriage.",
    "Do not give adult romantic or marital advice to a child.",
  ]
    : isProfessionIdentity
  ? [
      "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, trigger dates, current career movement, promotion timing, visibility cycles, or breakthrough periods.",
      "Do not convert a profession-suitability question into a current career-decision or timing answer.",
      "Do not advise the user to wait for, act during, or prepare for a timing window unless the user explicitly asks when to act.",
      "Do not treat temporary timing conditions as proof for or against permanent professional suitability.",
      "Do not give adult workplace advice to a child or student when userContext shows they are not yet in that life stage.",
      "Do not discuss promotions, salaries, employer changes, networking for job movement, professional visibility, client acquisition, or business launch for a child.",
    ]
  : isRelationshipPermanent
  ? [
      "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, trigger dates, marriage dates, meeting dates, reconciliation timing, or activation periods.",
      "Do not convert a permanent relationship-pattern question into a marriage-timing prediction.",
      "Do not treat temporary timing conditions as proof for or against permanent relationship suitability.",
      "Do not predict a specific future partner's identity, profession, appearance, caste, nationality, or exact circumstances unless that information is explicitly supported by supplied astrology evidence.",
      "Do not present difficult relationship patterns as inevitable failure.",
      "Do not give adult marriage or partner-search advice to a child.",
    ]
    : isWealthPermanent
? [
    "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, trigger dates, salary-rise dates, bonus dates, financial-improvement periods, or wealth-activation periods.",
    "Do not convert a permanent wealth question into a timing prediction.",
    "Do not treat temporary timing conditions as proof for or against permanent wealth potential.",
    "Do not equate high earning capacity with guaranteed wealth accumulation.",
    "Do not equate weak saving capacity with inability to earn.",
    "Do not recommend specific investments, securities, cryptocurrencies, trades, leverage, or speculative products.",
    "Do not present financial tendencies as guaranteed financial outcomes.",
    "Do not give adult salary, investment, trading, or wealth-target advice to a child.",
  ]
  : isBusinessPermanent
? [
    "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, trigger dates, business-launch dates, client-growth periods, business-growth periods, or partnership timing.",
    "Do not convert a permanent business question into a launch or growth forecast.",
    "Do not treat temporary timing conditions as proof for or against permanent entrepreneurial capacity.",
    "Do not equate strong business aptitude with guaranteed commercial success.",
    "Do not recommend immediate resignation from employment solely because business suitability is strong.",
    "Do not recommend specific capital commitments, leverage, borrowing, investments, or commercial risks based only on astrology.",
    "Do not give adult launch, hiring, client-acquisition, funding, or capital-allocation advice to a child.",
  ]
  : isEducationPermanent
? [
    "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, trigger dates, exam-result dates, admission timing, higher-education timing, or academic-improvement periods.",
    "Do not convert a permanent education question into an exam, admission, or timing prediction.",
    "Do not treat temporary timing conditions as proof for or against permanent academic ability.",
    "Do not present difficult learning patterns as permanent intellectual weakness or academic failure.",
    "Do not force one subject or stream when the evidence supports multiple strong directions.",
    "Do not give adult university, career, or professional-qualification advice to a child unless it is framed as a future developmental direction.",
  ]
  : isSpiritualPermanent
? [
    "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, trigger dates, spiritual-growth periods, guru-arrival dates, or activation periods.",
    "Do not convert a permanent spiritual question into a timing forecast.",
    "Do not treat temporary timing conditions as proof for or against permanent spiritual inclination.",
    "Do not claim guaranteed enlightenment, moksha, siddhis, supernatural powers, divine selection, or spiritual superiority.",
    "Do not predict the identity or arrival of a specific guru unless explicitly supported by supplied evidence.",
    "Do not prescribe intense austerities, renunciation, extreme fasting, or advanced spiritual practices to a child.",
  ]
  : isHealthPermanent
? [
    "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, trigger dates, sensitive health periods, recovery dates, or health-improvement timing.",
    "Do not convert a permanent health-pattern question into a disease or timing prediction.",
    "Do not diagnose or claim that the chart confirms a specific medical condition.",
    "Do not claim that astrology rules out disease or guarantees recovery.",
    "Do not recommend medication changes, dosage changes, medical procedures, supplements, or treatment plans based only on astrology.",
    "Do not advise stopping or delaying professional medical care.",
    "Do not present constitutional sensitivity as inevitable illness.",
    "Do not predict disease, severe illness, death, or long-term medical outcomes for a child.",
  ]
: isChildPermanent
? [
    "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, trigger dates, conception timing, childbirth timing, child-development windows, or family-expansion timing.",
    "Do not convert a permanent parenthood or child-aptitude question into a conception or childbirth prediction.",
    "Do not treat temporary timing conditions as proof for or against permanent parenting capacity or a child's aptitude.",
    "Do not present difficult parent-child patterns as inevitable conflict or failure.",
    "Do not make deterministic claims about a child's future profession, marriage, wealth, health, or life outcome.",
    "Do not label a child negatively from astrological placements.",
    "Do not give adult advice to a child when the question concerns the child's own development.",
  ]
  : isPropertyPermanent
? [
    "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, trigger dates, purchase dates, sale dates, possession dates, relocation timing, or property-activation periods.",
    "Do not convert permanent property potential into a purchase, sale, or move prediction.",
    "Do not treat temporary timing conditions as proof for or against permanent property potential.",
    "Do not equate strong property potential with guaranteed ownership or financial gain.",
    "Do not recommend a specific property, location, mortgage, leverage level, investment amount, or transaction based only on astrology.",
    "Do not give immediate property-investment advice to a child or student.",
  ]
: isVehiclePermanent
? [
    "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, trigger dates, purchase dates, upgrade periods, delivery dates, financing windows, or vehicle-activation periods.",
    "Do not convert permanent vehicle potential or preference into a purchase or upgrade prediction.",
    "Do not treat temporary timing conditions as proof for or against permanent vehicle ownership potential.",
    "Do not equate strong vehicle potential with guaranteed ownership or luxury.",
    "Do not recommend a specific vehicle make, model, financing structure, loan amount, or purchase price based only on astrology.",
    "Do not give immediate vehicle-purchase or financing advice to a child or student.",
  ]
: isRelocationPermanent
? [
    "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, trigger dates, visa dates, move dates, settlement windows, or relocation-activation periods.",
    "Do not convert permanent relocation or foreign-settlement potential into a move-timing forecast.",
    "Do not treat temporary timing conditions as proof for or against permanent relocation potential.",
    "Do not guarantee foreign settlement, permanent residency, citizenship, visa approval, or migration success.",
    "Do not predict one exact city or country unless explicitly supported by supplied evidence.",
    "Do not give immediate relocation, visa, or settlement advice to a child or student.",
  ]
: isDisputePermanent
? [
    "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, trigger dates, court dates, settlement dates, case-resolution periods, or legal activation.",
    "Do not convert a permanent dispute or negotiation question into a case-outcome or legal-timing forecast.",
    "Do not treat temporary timing conditions as proof for or against permanent legal or negotiation ability.",
    "Do not guarantee that the user will win or lose a legal matter.",
    "Do not claim that astrology can replace legal advice, evidence, documentation, representation, or procedural deadlines.",
    "Do not advise ignoring or delaying professional legal help when an actual legal matter requires it.",
    "Do not frame a child or student as litigation-prone; use communication, fairness, boundaries, debate, and self-control language instead.",
  ]
  : isParentsPermanent
? [
    "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, trigger dates, parental-support periods, elder-responsibility periods, or family timing.",
    "Do not convert a permanent parent-relationship question into a prediction about a parent's future.",
    "Do not present difficult parental patterns as proof that a parent does not care or that reconciliation is impossible.",
    "Do not blame the user, mother, father, or family elder based only on astrology.",
    "Do not predict a parent's illness, death, or major life event from a permanent relationship question.",
  ]

: isSiblingsPermanent
? [
    "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, trigger dates, sibling-conflict periods, or support timing.",
    "Do not convert permanent sibling dynamics into a timing forecast.",
    "Do not present rivalry, distance, or disagreement as inevitable estrangement.",
    "Do not claim a sibling will or will not provide financial or practical support as a certainty.",
    "Do not negatively label a child or sibling from astrological placements.",
  ]
  : isTravelPermanent
? [
    "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, trigger dates, visa dates, departure dates, travel windows, or pilgrimage timing.",
    "Do not convert permanent travel inclination into a travel-timing forecast.",
    "Do not treat temporary timing conditions as proof for or against permanent travel potential.",
    "Do not confuse travel with relocation or permanent settlement.",
    "Do not guarantee visa approval, international travel, pilgrimage completion, or a specific destination.",
    "Do not give independent international-travel planning advice to a child.",
  ]
  : isReputationPermanent
? [
    "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, trigger dates, recognition periods, reputation-growth periods, recovery periods, or visibility timing.",
    "Do not convert permanent reputation or recognition potential into a timing forecast.",
    "Do not treat temporary timing conditions as proof for or against permanent recognition potential.",
    "Do not guarantee fame, status, public recognition, promotion, influence, or social approval.",
    "Do not claim that all people will perceive the native in one fixed way.",
    "Do not frame a child or student in terms of professional fame or status; use confidence, reliability, leadership, peer perception, responsibility, and self-expression instead.",
  ]
  : isDebtPermanent
? [
    "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, trigger dates, borrowing windows, repayment dates, debt-reduction periods, or loan timing.",
    "Do not convert a permanent debt or repayment-pattern question into a timing forecast.",
    "Do not treat temporary timing conditions as proof for or against permanent repayment capacity.",
    "Do not recommend taking a loan, increasing leverage, refinancing, consolidating debt, or choosing a specific financial product based only on astrology.",
    "Do not guarantee that debt will be repaid, reduced, or eliminated.",
    "Do not present astrology as a substitute for professional financial advice.",
    "Do not give immediate borrowing or credit advice to a child or student.",
  ]
  : isInheritancePermanent
? [
    "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, trigger dates, inheritance dates, probate timing, settlement periods, asset-transfer dates, or legacy-transfer timing.",
    "Do not convert permanent inheritance potential into a timing or monetary forecast.",
    "Do not treat temporary timing conditions as proof that inheritance will or will not occur.",
    "Do not guarantee receipt of inheritance, a particular asset, a particular amount, probate success, estate settlement, insurance proceeds, or legal entitlement.",
    "Do not present astrology as a substitute for legal advice, estate planning, probate advice, tax advice, documentation, or professional financial advice.",
    "Do not encourage disputes, concealment, pressure on relatives, or assumptions of entitlement based on astrology.",
    "Do not frame a child or student as entitled to expected future assets; use family legacy, values, responsibility, ancestry, and shared-resource language instead.",
  ]
  : isMentalHealthPermanent
? [
    "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, trigger dates, sensitive mental-health periods, recovery dates, or support timing.",
    "Do not convert a permanent mental or emotional pattern question into a psychiatric or timing prediction.",
    "Do not diagnose depression, anxiety disorder, bipolar disorder, panic disorder, psychosis, ADHD, personality disorder, trauma disorder, or any other psychiatric condition from astrology.",
    "Do not claim that astrology confirms or rules out a psychiatric diagnosis.",
    "Do not recommend starting, stopping, changing, or avoiding psychiatric medication, therapy, or professional care based on astrology.",
    "Do not present mantra, remedy, fasting, meditation, spiritual practice, or astrology as a replacement for mental-health treatment.",
    "Do not label the user as unstable, mentally weak, damaged, dangerous, or permanently impaired from astrological placements.",
    "Do not make psychiatric predictions about a child or teenager.",
  ]
  : isPetsPermanent
? [
    "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, illness periods, loss periods, or pet-related timing.",
    "Do not predict a pet's illness, death, lifespan, diagnosis, or medical outcome from astrology.",
    "Do not present astrology as a substitute for veterinary examination, diagnosis, treatment, medication, or emergency care.",
    "Do not project human motives or moral judgement onto an animal from astrological factors.",
  ]

: isInnerPermanent
? [
    "Do not mention current dasha, antardasha, pratyantardasha, transits, timing windows, trigger dates, spiritual activation, or life-direction timing.",
    "Do not convert permanent purpose or meaning questions into a timing forecast.",
    "Do not claim one compulsory destiny, one inevitable profession, one soulmate, one guru, or one unavoidable spiritual path.",
    "Do not present temporary confusion as permanent failure, lack of purpose, or spiritual deficiency.",
    "Do not diagnose psychiatric conditions from inner-conflict or self-understanding questions.",
  ]
  : [
      "Do not combine promotion and job change unless the user asked about both.",
      "Do not repeat the same date in two different formats.",
      "Do not return only one or two generic sentences when timing evidence is available.",
      "Do not say only that natal and divisional charts provide support. Name the exact supplied house, lord, Sambandha, divisional-chart, dasha, and transit references.",
      "Do not headline one exact date when a broader start-and-end timing window is available.",
      "Do not claim that a trigger date falls within a date range unless it is actually between the range start and end dates.",
    ]),

      "Do not copy raw technical astrology data without interpreting it.",

      "Do not omit the Planetary Relationships section when sambandhaAnalysis is available.",

      "Do not invent planetary placements, dashas, divisional-chart findings, or dates.",

      "Do not use career terminology when the detected topic is not career.",

      "Do not mention recruiters, applications, promotion, résumé, networking, employer change, professional outcomes, visibility, or workplace responsibility unless the detected topic is career.",
    ],
  },

  // explicitly block heavy objects
  report:
    null,

  chartContext:
    null,

  dataEngine:
    null,

  baseChartFactors:
    null,
};
const safeAstroFacts =
  safeNatPayload.astroFacts as any;

const safeEvidencePacket =
  safeNatPayload.astrologyEvidencePacket as any;

function findTextPaths(
  value: any,
  pattern: RegExp,
  path = "root",
  results: string[] = []
): string[] {
  if (typeof value === "string") {
    if (pattern.test(value)) {
      results.push(`${path}: ${value}`);
    }

    return results;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      findTextPaths(
        item,
        pattern,
        `${path}[${index}]`,
        results
      )
    );

    return results;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(
      ([key, item]) =>
        findTextPaths(
          item,
          pattern,
          `${path}.${key}`,
          results
        )
    );
  }

  return results;
}
console.log(
  "========== V3.5 NATURALIZE PAYLOAD CHECK =========="
);

console.log(
  "Planet Reasoning:",
  JSON.stringify(
    planetReasoning ?? null,
    null,
    2
  )
);

console.log(
  "Timing Hierarchy:",
  JSON.stringify(
    timingHierarchy ?? null,
    null,
    2
  )
);

console.log(
  "Decision Summary:",
  JSON.stringify(
    decisionSummary ?? null,
    null,
    2
  )
);

console.log(
  "==================================================="
);
    const naturalizeURL =
  safeInternalURL(
    req,
    "/api/naturalize"
  );

const naturalizeController =
  new AbortController();

const naturalizeTimeout =
  setTimeout(() => {
    naturalizeController.abort();
  }, 30000);

let naturalRes: Response | null =
  null;
console.log(
  "[NATURALIZE USER CONTEXT]",
  safeNatPayload.userContext
);
try {
  naturalRes = await fetch(
    naturalizeURL,
    {
      method: "POST",

      headers: {
        "content-type":
          "application/json",
      },

      body: JSON.stringify(
        safeNatPayload
      ),

      signal:
        naturalizeController.signal,
    }
  );
} catch (error) {
 
} finally {
  clearTimeout(
    naturalizeTimeout
  );
}

if (
  !naturalRes ||
  !naturalRes.ok
) {
  let naturalizeErrorText =
    "";

  if (naturalRes) {
    try {
      naturalizeErrorText =
        await naturalRes.text();
    } catch {
      naturalizeErrorText =
        "Unable to read the naturalizer error response.";
    }
  }



const shouldUseFallbackSeniorResponse =
  !shouldSuppressTiming &&
  (
    questionType === "timing" ||
    questionType === "decision" ||
    questionType === "prediction" ||
    questionType === "comparison" ||
    questionType === "action_plan"
  );

const fallbackPremiumAnswer =
  shouldUseFallbackSeniorResponse
    ? buildSeniorAstrologerResponse(
        astroBundle
      )
    : null;

const fallbackAnswer =
  fallbackPremiumAnswer?.full ??
  astroBundle
    .astroJudgement
    ?.verdict ??
  astroBundle.answerSummary ??
  "Sārathi could not fully refine the response, but the available chart evidence suggests taking a steady and practical approach.";

const fallbackShortAnswer =
  fallbackPremiumAnswer?.short ??
  fallbackAnswer;

const fallbackFullAnswer =
  fallbackPremiumAnswer?.full ??
  fallbackAnswer;

const fallbackDecisionDo =
  astroBundle.decision?.do ?? [];

const fallbackDecisionAvoid =
  astroBundle.decision?.avoid ?? [];

const fallbackActionAnswer =
  fallbackPremiumAnswer?.action
    ? fallbackPremiumAnswer.action
    : [
        ...fallbackDecisionDo,
        ...fallbackDecisionAvoid.map(
          (item: string) =>
            `Avoid: ${item}`
        ),
      ].join("\n");

const fallbackWhyThisWorks = [
  astroBundle.decision?.rationale,
  astroBundle.sambandhaAnalysis?.summary,
  astroBundle.divisionalLayer?.summary,
  astroBundle.timingPolicy?.note,
]
  .filter(
    (
      item: string | null | undefined
    ): item is string =>
      Boolean(item?.trim())
  )
  .filter(
    (
      item: string,
      index: number,
      items: string[]
    ) =>
      items.indexOf(item) === index
  )
  .slice(0, 4);

return okJson({
  answer:
    polishUserFacingDates(
      fallbackFullAnswer
    ),

  shortAnswer:
    polishUserFacingDates(
      fallbackShortAnswer
    ),

  fullAnswer:
    polishUserFacingDates(
      fallbackFullAnswer
    ),

  currentTiming:
    astroBundle.timingPolicy?.note ||
    astroBundle.timingLayer?.summary ||
    "",

  actionPlan: {
    do:
      fallbackDecisionDo.slice(0, 4),

    avoid:
      fallbackDecisionAvoid.slice(0, 3),
  },

  whyThisWorks:
    fallbackWhyThisWorks,

  decision:
    astroBundle.decision ?? null,

  guidance:
    fallbackActionAnswer
      .split("\n")
      .map(
        (item: string) =>
          item.trim()
      )
      .filter(
        (item: string) =>
          item.length > 0
      ),

  copy: {
    answer:
      polishUserFacingDates(
        fallbackShortAnswer
      ),

    long:
      polishUserFacingDates(
        fallbackFullAnswer
      ),

    how:
      polishUserFacingDates(
        fallbackActionAnswer
      ),
  },

  evidenceBullets:
    astroBundle
      .evidenceBullets ??
    [],

  distressed,

  fallbackUsed:
    true,
});
}

const naturalJson =
  await naturalRes.json();

const shouldUseSeniorResponse =
  !shouldSuppressTiming &&
  (
    questionType === "timing" ||
    questionType === "decision" ||
    questionType === "prediction" ||
    questionType === "comparison" ||
    questionType === "action_plan"
  );
const shouldShowDecisionSections =
  questionType === "decision" ||
  questionType === "comparison" ||
  questionType === "action_plan";
const premiumTimingAnswer =
  shouldUseSeniorResponse
    ? buildSeniorAstrologerResponse(astroBundle)
    : null;
console.log("========== TIMING OUTPUT DEBUG ==========");

console.log("Question:", question);
console.log("Topic:", astroBundle?.topic);
console.log("Event type:", astroBundle?.eventType);
console.log("Question type:", questionType);
console.log("Should suppress timing:", shouldSuppressTiming);

console.log(
  "Selected timing window:",
  JSON.stringify(
    astroBundle?.selectedTimingWindow ?? null,
    null,
    2
  )
);

console.log(
  "Best available window:",
  JSON.stringify(
    astroBundle?.bestAvailableWindow ?? null,
    null,
    2
  )
);

console.log(
  "Strongest window:",
  JSON.stringify(
    astroBundle?.strongestWindow ?? null,
    null,
    2
  )
);

console.log(
  "Ranked timing windows:",
  JSON.stringify(
    astroBundle?.rankedTimingWindows ?? null,
    null,
    2
  )
);

console.log(
  "Timing windows:",
  JSON.stringify(
    astroBundle?.timingWindows ?? null,
    null,
    2
  )
);

console.log("=========================================");
const naturalizedAnswer =
  safeStr(
    naturalJson?.text ??
    naturalJson?.answer ??
    naturalJson?.output
  );

console.log("========== FINAL ANSWER SOURCE DEBUG ==========");

console.log(
  "Naturalized Answer:",
  naturalizedAnswer
);

console.log(
  "Premium Timing Answer:",
  premiumTimingAnswer?.full ?? premiumTimingAnswer
);

console.log(
  "Question Type:",
  questionType
);

console.log(
  "Decision Summary:",
  JSON.stringify(decisionSummary, null, 2)
);

console.log("===============================================");
const hasDecisionSummary =
  decisionSummary != null &&
  (
    Boolean(decisionSummary.headline) ||
    Boolean(decisionSummary.summary)
  );
const shouldPreferSeniorResponse =
  !hasDecisionSummary &&
  !shouldSuppressTiming &&
  !isProfessionIdentity &&
  Boolean(premiumTimingAnswer) &&
  (
    questionType === "timing" ||
    questionType === "decision" ||
    questionType === "prediction" ||
    questionType === "comparison" ||
    questionType === "action_plan"
  );
let answer =
  shouldPreferSeniorResponse
    ? premiumTimingAnswer?.full ??
      naturalizedAnswer ??
      astroBundle.answerSummary
    : naturalizedAnswer ||
      astroBundle.answerSummary;

answer = polishUserFacingDates(answer);
console.log(
  "Should Prefer Senior Response:",
  shouldPreferSeniorResponse
);
const answerWordCount = answer
  .split(/\s+/)
  .filter(Boolean)
  .length;

const answerLooksTooThin =
  questionType === "timing" &&
  (
    answer.length < 240 ||
    answerWordCount < 40 ||
    !/[.!?].*[.!?]/s.test(answer)
  );

if (
  !hasDecisionSummary &&
  answerLooksTooThin &&
  premiumTimingAnswer
) {
  answer = premiumTimingAnswer.full;
}
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
   if (
  answer.trim() &&
  !/[.!?]$/.test(answer.trim())
) {
  answer = `${answer.trim()}.`;
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
  answer = polishUserFacingDates(answer);

const premiumResponse =
  hasDecisionSummary || isProfessionIdentity
    ? null
    : premiumTimingAnswer;

const shortAnswer =
  premiumResponse?.short
    ? premiumResponse.short
    : answer
        .split(/\n\n+/)
        .filter(Boolean)
        .slice(0, 2)
        .join("\n\n");

const fullAnswer =
  premiumResponse?.full
    ? premiumResponse.full
    : answer;

const decisionActionLines =
  shouldShowDecisionSections
    ? astroBundle.decision?.do ?? []
    : [];

const decisionAvoidLines =
  shouldShowDecisionSections
    ? astroBundle.decision?.avoid ?? []
    : [];

const actionAnswer =
  shouldShowDecisionSections
    ? premiumResponse?.action
      ? premiumResponse.action
      : [
          ...decisionActionLines,
          ...decisionAvoidLines.map(
            (item: string) =>
              `Avoid: ${item}`
          ),
        ].join("\n")
    : "";

const shouldShowCurrentTiming =
  !shouldSuppressTiming &&
  (
    questionType === "timing" ||
    questionType === "prediction" ||
    questionType === "decision"
  );

const currentTimingAnswer =
  shouldShowCurrentTiming
    ? timingHierarchy?.stage === "activation"
      ? "You are currently inside an active timing phase. Use this period for visible action while allowing results to develop progressively."
      : timingHierarchy?.stage === "opportunity"
      ? "You are already inside the broader opportunity phase, with the stronger actionable period identified in the main answer."
      : timingHierarchy?.stage === "preparation"
      ? "You are currently in the preparation phase. Use this period to position yourself for the stronger actionable window ahead."
      : timingHierarchy?.explanation ||
        astroBundle.timingPolicy?.note ||
        astroBundle.timingLayer?.summary ||
        ""
    : "";

const whyThisWorks =
  shouldShowCurrentTiming
    ? [
        astroBundle.promiseLayer?.summary
          ? astroBundle.promiseLayer.summary
          : null,

        timingHierarchy?.broaderWindow
          ? `The broader dasha cycle creates an opportunity phase from ${fmtDateShort(
              timingHierarchy.broaderWindow.start
            )} to ${fmtDateShort(
              timingHierarchy.broaderWindow.end
            )}.`
          : null,

        timingHierarchy?.practicalWindow
          ? `The stronger actionable sub-period runs from ${fmtDateShort(
              timingHierarchy.practicalWindow.start
            )} to ${fmtDateShort(
              timingHierarchy.practicalWindow.end
            )}.`
          : null,

        timingHierarchy?.activationWindow
          ? `A narrower activation signal appears around ${fmtDateShort(
              timingHierarchy.activationWindow.peak ??
                timingHierarchy.activationWindow.start
            )}.`
          : null,
      ]
        .filter(
          (item: string | null | undefined): item is string =>
            Boolean(item?.trim())
        )
        .slice(0, 4)
    : [];

const polishedShortAnswer =
  polishUserFacingDates(shortAnswer);

const polishedFullAnswer =
  polishUserFacingDates(fullAnswer);

const polishedActionAnswer =
  polishUserFacingDates(actionAnswer);
 const responseWindowSource =
  shouldSuppressTiming
    ? []
    : Array.isArray(astroBundle.rankedTimingWindows) &&
      astroBundle.rankedTimingWindows.length
    ? astroBundle.rankedTimingWindows
    : [
        astroBundle.selectedTimingWindow,
        astroBundle.bestAvailableWindow,
        astroBundle.strongestWindow,
        astroBundle.nearestWindow,
      ].filter(Boolean);

const responseWindows =
  responseWindowSource
    .filter(
      (
        window: any,
        index: number,
        array: any[]
      ) =>
        array.findIndex(
          (item: any) =>
            String(item?.start ?? "") ===
              String(window?.start ?? "") &&
            String(item?.end ?? "") ===
              String(window?.end ?? "")
        ) === index
    )
    .slice(0, 3)
    .map((window: any) => {
    const fromISO =
      window?.start ??
      window?.peak ??
      undefined;

    const toISO =
      window?.end ??
      window?.peak ??
      undefined;

    return {
      fromISO,
      toISO,

      label: window?.label
        ? formatWindowLabel(
            String(window.label)
          )
        : fromISO
        ? fmtDateShort(String(fromISO))
        : "Timing window",

      tag:
        window?.windowClass ??
        "movement",

      why: Array.isArray(window?.why)
        ? window.why.slice(0, 3)
        : [],

      do: actionAnswer
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 4),

      score:
        typeof window?.score === "number"
          ? window.score
          : undefined,

      notes:
        window?.practicalMeaning ??
        undefined,
    };
  });
   return okJson({
  answer: polishedFullAnswer,
  shortAnswer:
  polishedShortAnswer,

fullAnswer:
  polishedFullAnswer,
 timingHierarchy,

  decisionSummary,

  eventLifecycle,

currentTiming:
  currentTimingAnswer || null,

actionPlan:
  shouldShowDecisionSections
    ? {
        do:
          decisionActionLines.slice(0, 4),

        avoid:
          decisionAvoidLines.slice(0, 3),
      }
    : null,

whyThisWorks:
  whyThisWorks.length
    ? whyThisWorks
    : null,

decision:
  shouldShowDecisionSections
    ? astroBundle.decision ?? null
    : null,
  evidenceBullets:
    astroBundle.evidenceBullets,

  themeSignal:
    astroBundle.themeSignal,

  distressed,

  windows: responseWindows,

  guidance: polishedActionAnswer
    ? polishedActionAnswer
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
    : [],

  copy: {
    answer: polishedShortAnswer,
    long: polishedFullAnswer,
    how: polishedActionAnswer,
  },

  core: {
    prose: {
      short: polishedShortAnswer,
      full: polishedFullAnswer,
    },

    timing: {
      summary:
        astroBundle.timingLayer?.summary ??
        "Timing is based on the selected astrological windows.",

      windows: responseWindows,
    },

    verdict: {
      line:
        polishedShortAnswer ||
        astroBundle.astroJudgement?.verdict ||
        polishedFullAnswer,
    },

    meta: {
      topic,
      questionType,
      confidence:
        astroBundle.confidence,
    },
  },

  debug: {
    topic,
    questionType,

    timeDirection:
      astroBundle.timeDirection,

    eventScale:
      astroBundle.eventScale,

    focusHouses:
      astroBundle.focusHouses,

    karakas:
      astroBundle.karakas,

    divisionalCharts:
      astroBundle.divisionalCharts,

    selectedTimingWindow:
      astroBundle.selectedTimingWindow ??
      null,

    bestEventTrigger:
      astroBundle.bestEventTrigger ??
      null,

    conversionDiagnosisV2:
      astroBundle.conversionDiagnosisV2 ??
      null,
  },
});
} catch (e: any) {
  return badJson(
    String(
      e?.message ||
      e ||
      "Unknown astro-chat error"
    ),
    500
  );
}
}
