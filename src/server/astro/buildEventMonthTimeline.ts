import type {
  BaseChartFactors,
  EventType,
  HistoricalSnapshot,
  MarriageFacts,
  ProfessionFacts,
} from "@/server/astro/types";

import { buildEventVerification } from "@/server/astro/buildEventVerification";
import { buildHistoricalSnapshot } from "@/server/astro/buildHistoricalSnapshot";
import { buildTransitSnapshotForDate } from "@/server/astro/buildTransitSnapshotForDate";
import { buildDegreeHitsForDate } from "@/server/astro/buildDegreeHitsForDate";

type Input = {
  eventType: EventType;
  baseChartFactors: BaseChartFactors;
  marriageFacts?: MarriageFacts | null;
  professionFacts?: ProfessionFacts | null;
  report: any;
  startYear: number;
  endYear: number;
};

type MonthScore = {
  label: string; // YYYY-MM
  year: number;
  month: number;
  score: number;
  verdict: string;
};

export async function buildEventMonthTimeline(input: Input) {
  const {
    eventType,
    baseChartFactors,
    marriageFacts,
    professionFacts,
    report,
    startYear,
    endYear,
  } = input;

  const scores: MonthScore[] = [];

  for (let year = startYear; year <= endYear; year++) {
    for (let month = 1; month <= 12; month++) {
      const mm = String(month).padStart(2, "0");
      const targetDateISO = `${year}-${mm}-01`;

      const transitPlanets = await buildTransitSnapshotForDate({
        birth: {
          dateISO: report?.birthDateISO,
          tz: report?.birthTz,
          lat: report?.birthLat,
          lon: report?.birthLon,
        },
        targetDateISO,
      });

      const degreeHits = buildDegreeHitsForDate({
        natalPlanets: report?.planets,
        transitPlanets,
      });

      const snapshot: HistoricalSnapshot = buildHistoricalSnapshot({
        birth: {
          dateISO: report?.birthDateISO,
          tz: report?.birthTz,
          lat: report?.birthLat,
          lon: report?.birthLon,
        },
        natal: {
          ascSign: report?.ascSign,
          planets: report?.planets,
        },
        dashaTimeline: report?.dashaTimeline,
        transitPlanets,
        degreeHits,
        topTransits: [],
        targetDateISO,
      });

      const v = buildEventVerification({
        eventType,
        baseChartFactors,
        historicalSnapshot: snapshot,
        marriageFacts,
        professionFacts,
      });

      scores.push({
        label: `${year}-${mm}`,
        year,
        month,
        score: v.score,
        verdict: v.verdict,
      });
    }
  }

  return extractMonthWindows(scores);
}

function extractMonthWindows(scores: MonthScore[]) {
  const strongMonths = scores.filter(
    (m) => m.score >= 75 && m.verdict === "strong_match"
  );

  const windows: Array<{
    start: string;
    end: string;
    peak: string;
  }> = [];

  let current:
    | { start: string; end: string; peak: string; peakScore: number; year: number; month: number }
    | null = null;

  for (const m of strongMonths) {
    if (!current) {
      current = {
        start: m.label,
        end: m.label,
        peak: m.label,
        peakScore: m.score,
        year: m.year,
        month: m.month,
      };
      continue;
    }

    const prevIndex = current.year * 12 + current.month;
    const currIndex = m.year * 12 + m.month;

    if (currIndex === prevIndex + 1) {
      current.end = m.label;
      current.year = m.year;
      current.month = m.month;

      if (m.score > current.peakScore) {
        current.peak = m.label;
        current.peakScore = m.score;
      }
    } else {
      windows.push({
        start: current.start,
        end: current.end,
        peak: current.peak,
      });

      current = {
        start: m.label,
        end: m.label,
        peak: m.label,
        peakScore: m.score,
        year: m.year,
        month: m.month,
      };
    }
  }

  if (current) {
    windows.push({
      start: current.start,
      end: current.end,
      peak: current.peak,
    });
  }

  return windows.slice(0, 5);
}