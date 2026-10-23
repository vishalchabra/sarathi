
import { NextRequest, NextResponse } from "next/server";
import { buildDataEngine } from "@/server/dataEngine/buildDataEngine";
import {
  testRealLifeEventResolver,
  testPositiveRealLifeEventResolver,
  testRealLifeEventRepetition,
  testEqualStrengthEventRepetition,
  testSupportedSituationAssessment,
} from "../../../../server/astrology-engine/narrative/realLifeEventNarrative";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Development only" },
      { status: 403 }
    );
  }

  const date =
    request.nextUrl.searchParams.get("date") ??
    "2026-10-20";

 if (
  !/^2026-(09-(2[7-9]|30)|10-(0[1-9]|[12][0-9]|3[01]))$/.test(date)
) {
  return NextResponse.json(
    {
      error:
        "Select a date from 2026-09-27 to 2026-10-31.",
    },
    { status: 400 }
  );
}
  const params = request.nextUrl.searchParams;

  const birth = {
    dateISO: params.get("birthDate") ?? "1984-01-21",
    time: params.get("birthTime") ?? "23:35",
    timezone: params.get("timezone") ?? "Asia/Kolkata",
    lat: Number(params.get("lat") ?? "29.968"),
    lon: Number(params.get("lon") ?? "77.546"),
  };

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(birth.dateISO) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(birth.time) ||
    !Number.isFinite(birth.lat) ||
    !Number.isFinite(birth.lon) ||
    Math.abs(birth.lat) > 90 ||
    Math.abs(birth.lon) > 180
  ) {
    return NextResponse.json(
      { error: "Invalid birth parameters" },
      { status: 400 }
    );
  }
  const result = await buildDataEngine({
    birth,
    plan: "pro",
    selectedDateISO: date,
  });

  const prediction = result.prediction.personalizedDaily;
  const daily = prediction.dailyComparison;
  const focus = daily?.dailyAreas[0] ?? null;

 return NextResponse.json({
  date,
  realLifeEventTest: testRealLifeEventResolver(),
  realLifeEventPositiveTest: testPositiveRealLifeEventResolver(),
  realLifeEventRepetitionTest: testRealLifeEventRepetition(),
  realLifeEventEqualStrengthTest: testEqualStrengthEventRepetition(),
  realLifeEventSupportedSituationTest: testSupportedSituationAssessment(),
   fullPrediction: {
    overallTone: prediction.overallTone,
    primaryTheme: prediction.primaryTheme,
    secondaryThemes: prediction.secondaryThemes,
    suppressedAreas: prediction.suppressedAreas,
  },
  moonDailyThemes: prediction.moonDailyThemes ?? null,
  moonFirstGuidance: prediction.moonFirstGuidance ?? null,
  moonAllAreaEventCandidates:
  prediction.moonAllAreaEventCandidates ?? null,
  realLifeEducationNarrativePreview:
  prediction.realLifeEducationNarrativePreview ?? null,
  realLifeCareerGuidancePreview:
  prediction.realLifeCareerGuidancePreview ?? null,
  primaryAreaPracticalGuidancePreview:
  prediction.primaryAreaPracticalGuidancePreview ?? null,
  moonMoneyHouseEvidence:
  prediction.moonMoneyHouseEvidence ?? null,
  moonMoneyTransitEvidence:
  prediction.moonMoneyTransitEvidence ?? null,
  moonDashaHouseConnections:
  prediction.moonDashaHouseConnections ?? null,
   moonTriggerNatalD9: prediction.moonTriggerNatalD9 ?? null,
    periodTheme: prediction.primaryTheme
  ? {
      area: prediction.primaryTheme.area,
      score: prediction.primaryTheme.priorityScore,
      polarity: prediction.primaryTheme.polarity,
      prediction: prediction.primaryTheme.prediction,
      action: prediction.primaryTheme.action,
      avoid: prediction.primaryTheme.avoid,
    }
  : null,
    todayFocus: focus
      ? {
          area: focus.area,
          importance: focus.strongestImportance,
          dashaScore: focus.dashaScore,
          moonSign: daily?.moonSign,
          moonNakshatra: daily?.moonNakshatra,
          signals: focus.signals,
        }
      : null,
    alignment:
      prediction.primaryTheme?.area === focus?.area
        ? "aligned"
        : "different",
  });
}