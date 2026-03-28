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

type YearScore = {
  year: number;
  score: number;
  verdict: string;
};

export async function buildEventTimeline(input: Input) {
  const {
    eventType,
    baseChartFactors,
    marriageFacts,
    professionFacts,
    report,
    startYear,
    endYear,
  } = input;

  const scores: YearScore[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const targetDateISO = `${year}-07-01`;

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
      year,
      score: v.score,
      verdict: v.verdict,
    });
  }

  return extractWindows(scores, eventType);
}

function extractWindows(
  scores: YearScore[],
  eventType?: string
) {
  const minScore =
    eventType === "marriage" ? 80 : 75;

  const strongYears = scores.filter(
    (y) => y.score >= minScore && y.verdict === "strong_match"
  );

  const windows: Array<{
    start: number;
    end: number;
    peak: number;
    peakScore: number;
  }> = [];

  let current:
    | { start: number; end: number; peak: number; peakScore: number }
    | null = null;

  for (const y of strongYears) {
    if (!current) {
      current = {
        start: y.year,
        end: y.year,
        peak: y.year,
        peakScore: y.score,
      };
      continue;
    }

    if (y.year === current.end + 1) {
      current.end = y.year;

      if (y.score > current.peakScore) {
        current.peak = y.year;
        current.peakScore = y.score;
      }
    } else {
      windows.push(current);
      current = {
        start: y.year,
        end: y.year,
        peak: y.year,
        peakScore: y.score,
      };
    }
  }

  if (current) {
    windows.push(current);
  }

  return windows
    .sort((a, b) => b.peakScore - a.peakScore || a.start - b.start)
    .slice(0, 3)
    .map(({ start, end, peak }) => ({ start, end, peak }));
}