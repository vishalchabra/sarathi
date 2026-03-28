import type {
  BaseChartFactors,
  EventType,
  EventVerification,
  HistoricalSnapshot,
  MarriageFacts,
  ProfessionFacts,
} from "@/server/astro/types";
import { buildMarriageEventVerification } from "@/server/astro/buildMarriageEventVerification";
import { buildCareerChangeEventVerification } from "@/server/astro/buildCareerChangeEventVerification";
type Input = {
  eventType: EventType;
  baseChartFactors?: BaseChartFactors | null;
  historicalSnapshot?: HistoricalSnapshot | null;
  marriageFacts?: MarriageFacts | null;
  professionFacts?: ProfessionFacts | null;
};

export function buildEventVerification(input: Input): EventVerification {
  const { eventType } = input;

  switch (eventType) {
    case "marriage":
      return buildMarriageEventVerification({
        baseChartFactors: input.baseChartFactors,
        marriageFacts: input.marriageFacts,
        historicalSnapshot: input.historicalSnapshot,
      });

    case "career_change":
      return buildCareerChangeEventVerification({
        baseChartFactors: input.baseChartFactors,
        professionFacts: input.professionFacts,
        historicalSnapshot: input.historicalSnapshot,
      });

    case "business_start":
      return buildBusinessStartEventVerification({
        baseChartFactors: input.baseChartFactors,
        professionFacts: input.professionFacts,
        historicalSnapshot: input.historicalSnapshot,
      });

    case "property":
      return buildPropertyEventVerification({
        baseChartFactors: input.baseChartFactors,
        historicalSnapshot: input.historicalSnapshot,
      });

    case "child_birth":
      return buildChildBirthEventVerification({
        baseChartFactors: input.baseChartFactors,
        historicalSnapshot: input.historicalSnapshot,
      });

    case "relocation":
      return buildRelocationEventVerification({
        baseChartFactors: input.baseChartFactors,
        historicalSnapshot: input.historicalSnapshot,
      });

    case "health":
      return buildHealthEventVerification({
        baseChartFactors: input.baseChartFactors,
        historicalSnapshot: input.historicalSnapshot,
      });

    case "transformation":
      return buildTransformationEventVerification({
        baseChartFactors: input.baseChartFactors,
        historicalSnapshot: input.historicalSnapshot,
      });

    default:
      return weakFallback(eventType);
  }
}

function weakFallback(eventType: EventType): EventVerification {
  return {
    eventType,
    verdict: "weak_match",
    score: 20,
    reasons: ["This event type is not fully implemented yet."],
    natalSupport: [],
    divisionalSupport: [],
    dashaSupport: [],
    transitSupport: [],
    blockers: ["No dedicated verifier exists yet for this event type."],
  };
}

/* ---------------- placeholder verifiers for next phases ---------------- */



function buildBusinessStartEventVerification(_: any): EventVerification {
  return weakFallback("business_start");
}

function buildPropertyEventVerification(_: any): EventVerification {
  return weakFallback("property");
}

function buildChildBirthEventVerification(_: any): EventVerification {
  return weakFallback("child_birth");
}

function buildRelocationEventVerification(_: any): EventVerification {
  return weakFallback("relocation");
}

function buildHealthEventVerification(_: any): EventVerification {
  return weakFallback("health");
}

function buildTransformationEventVerification(_: any): EventVerification {
  return weakFallback("transformation");
}