export const runtime = "nodejs";

import "server-only";
import { NextResponse } from "next/server";
import { buildBaseChartFactors } from "@/server/astro/buildBaseChartFactors";
import { inferCareer } from "@/server/astro/inference/career";
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
  | "inner"
  | "generic";

type AskSarathiQuestionType =
  | "daily_micro"
  | "daily_outlook"
  | "timing"
  | "decision"
  | "prediction"
  | "remedy"
  | "explainer"
  | "diagnosis"
  | "comparison"
  | "action_plan"
  | "emotional_support"
  | "generic";
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
  timingPolicy: {
    dashaStrength: "strong" | "moderate" | "mixed" | "weak";
    transitStrength: "strong" | "moderate" | "mixed" | "weak";
    allowSharpWindow: boolean;
    note: string;
  };
  actionBias: {
  bestUse: string;
  watchFor: string;
};
  evidenceBullets: string[];
  confidence: "High" | "Medium" | "Low";
  timingConfidenceNote: string;
  answerSummary: string;
};

type CareerEventType =
  | "profession_identity"
  | "promotion"
  | "job_change"
  | "internal_shift"
  | "stability_check"
  | "generic";
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

/* --------------------------------------------------
   Small helpers
-------------------------------------------------- */

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
function getBirthYear(report: any): number | null {
  const dobISO = safeStr(report?.birth?.dateISO);
  const year = Number(dobISO.slice(0, 4));
  return Number.isFinite(year) ? year : null;
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

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
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
      note: "Dasha support is not strong enough to present this as a reliable career-change window.",
    };
  }

  if (dashaStrength === "strong" && transitStrength !== "weak") {
    return {
      dashaStrength,
      transitStrength,
      allowSharpWindow: true,
      note: "Dasha support is strong enough for a real timing discussion, with transits acting as triggers inside the broader phase.",
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
    note: "Dasha support is too weak for a confident event window, even if some transit activity is present.",
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

  return {
    md,
    ad,
    pd,
    ranges: {
      md: ap?.mahadasha ? `${fmtDateShort(ap.mahadasha.start)} – ${fmtDateShort(ap.mahadasha.end)}` : null,
      ad: ap?.antardasha ? `${fmtDateShort(ap.antardasha.start)} – ${fmtDateShort(ap.antardasha.end)}` : null,
      pd: ap?.pratyantardasha ? `${fmtDateShort(ap.pratyantardasha.start)} – ${fmtDateShort(ap.pratyantardasha.end)}` : null,
    },
  };
}

function detectTopic(question: string): AskSarathiDomain {
  const q = question.toLowerCase().trim();

  if (/\b(marriage|married|spouse|wedding)\b/.test(q)) {
    return "marriage";
  }

  if (/\b(relationship|partner|love|boyfriend|girlfriend)\b/.test(q)) {
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

  for (const rule of TOPIC_RULES) {
    if (rule.keywords.some((kw) => q.includes(kw))) return rule.topic;
  }

  return "generic";
}

function detectQuestionType(question: string): AskSarathiQuestionType {
  const q = question.toLowerCase().trim();
  if (/\bwhen|which month|which year|timing|window|date\b/.test(q)) return "timing";
  if (/\bshould i|can i|is it good to|is this a good time\b/.test(q)) return "decision";
  if (/\bwill i|will my|is it likely|can this happen\b/.test(q)) return "prediction";
  if (/\bremedy|remedies|upaya|mantra|pooja|gem|stone|wear\b/.test(q)) return "remedy";
  if (/\bwhy is|why am i|why does|why stuck|why delayed|what is happening\b/.test(q)) return "diagnosis";
  if (/\bcompare| vs | versus |or wait|or stay|or switch\b/.test(q)) return "comparison";
  if (/\bwhat should i do|what to do|next step|action plan|how should i move\b/.test(q)) return "action_plan";
  if (/\banxious|worried|scared|stressed|lost|hopeless|emotionally\b/.test(q)) return "emotional_support";
  if (/\bhow is my day|how is today|today looking|focus on today\b/.test(q)) return "daily_outlook";
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

  console.log("[pastMarriage] clustered windows", ranked);

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

  if (line) bullets.push(`Active dasha sequence checked → ${line}`);

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

const DIVISIONAL_PROFILES: Record<AskSarathiDomain, DivisionalSignalProfile[]> = {
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
  const profile = DIVISIONAL_PROFILES[topic] ?? DIVISIONAL_PROFILES.generic;

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
      : "Dasha support is too weak to treat current transit activity as a reliable event window.";

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
      line: "A clear promotion or job-change window is not visible in your chart right now.",
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

  return {
    verdict: "GENERIC",
    line: "The current scan does not show a clear timing verdict yet.",
  };
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
  }
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
        return `${decision.line} This should be read more as movement, role shift, or visibility-building than as a guaranteed promotion or clean external move.`;
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
function buildGenericAstroBundle(
  question: string,
  topic: AskSarathiDomain,
  questionType: AskSarathiQuestionType,
  report: any
): GenericAstroBundle {
  const rule = resolveTopicRule(topic);
  const dasha = getActiveDashaAnyShape(report);
  const timeDirection = detectTimeDirection(question, topic);
  const eventScale = detectEventScale(question, topic);

  const careerEventType = detectCareerEventType(
    question,
    topic,
    timeDirection
  );

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

  const evidenceBullets = uniq([
    `Dasha checked → ${[dasha.md, dasha.ad, dasha.pd].filter(Boolean).join(" • ") || "Not clear"}`,
    `${topicEvidenceLabel} → ${rule.houses.join(", ")}${
      rule.supportHouses?.length
        ? ` (support ${rule.supportHouses.join(", ")})`
        : ""
    }`,
    `Karakas checked → ${rule.karakas.join(", ") || "—"}`,
    ...(topic === "marriage" && timeDirection === "past"
      ? [`Marriage activators checked → ${getMarriageActivators(report).join(", ") || "Not clear"}`]
      : []),
    `Divisional charts checked → ${(DIVISIONAL_PROFILES[topic] ?? DIVISIONAL_PROFILES.generic)
      .map((x) => x.chart)
      .join(", ")}`,
    `Historical dasha timeline scanned → ${
      Array.isArray(report?.dashaTimeline)
        ? report.dashaTimeline.length
        : Array.isArray(report?.timeline)
        ? report.timeline.length
        : 0
    } periods`,
    ...(timingWindows[0]
      ? [`Strongest window → ${timingWindows[0].peak || timingWindows[0].label}`]
      : []),
    ...(divisionalLayer.chartBreakdown?.length
      ? [
          `Divisional strength mix → ${divisionalLayer.chartBreakdown
            .map((x) => `${x.chart}:${x.strength}`)
            .join(", ")}`
        ]
      : []),
  ]);

  const confidence = confidenceFromScores([
    promiseLayer.verdict === "strong" ? 80 : promiseLayer.verdict === "moderate" ? 65 : promiseLayer.verdict === "mixed" ? 48 : 28,
    divisionalLayer.verdict === "strong" ? 78 : divisionalLayer.verdict === "moderate" ? 62 : divisionalLayer.verdict === "mixed" ? 45 : 25,
    karakaLayer.verdict === "strong" ? 78 : karakaLayer.verdict === "moderate" ? 62 : karakaLayer.verdict === "mixed" ? 45 : 25,
    timingLayer.verdict === "strong" ? 84 : timingLayer.verdict === "moderate" ? 66 : timingLayer.verdict === "mixed" ? 46 : 24,
  ]);

  return {
    question,
    topic,
    questionType,
    timeDirection,
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
    timingLayer,
    timingPolicy,
    remediesLayer,
    timingWindows,
    evidenceBullets,
    confidence,
    timingConfidenceNote,
    answerSummary: buildAnswerSummary(
      report,
      topic,
      timingLayer,
      timingWindows,
      timeDirection,
      confidence,
      careerEventType,
      timingPolicy
    ),
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
      "Tie remedy suggestions to active dasha and the relevant houses/karakas.",
    ].join(" ");
  }

  return [
    "Answer like Sārathi, not like a report.",
    "Use the structured analysis but speak in real-life language.",
    "Do not repeat the same point twice.",
  ].join(" ");
}

/* --------------------------------------------------
   Naturalize payload builder
-------------------------------------------------- */

function buildNaturalizePayload(params: {
  question: string;
  topic: AskSarathiDomain;
  questionType: AskSarathiQuestionType;
  report: any;
  astroBundle: GenericAstroBundle;
  distressed: boolean;
  finalDecisionLine?: string;
  finalDecisionVerdict?: string;
}) {
  const {
  question,
  topic,
  questionType,
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
    tone,
    depth,
    distressed,
    finalDecisionLine,
    finalDecisionVerdict,
    moodHint: inferMood(question),
    confidenceLevel: astroBundle.confidence.toLowerCase(),
    formatTier: questionType === "timing" ? "micro" : "standard",
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
      promiseLayer: astroBundle.promiseLayer,
      divisionalLayer: astroBundle.divisionalLayer,
      divisionalBreakdown: astroBundle.divisionalBreakdown ?? [],
      karakaLayer: astroBundle.karakaLayer,
      timingLayer: astroBundle.timingLayer,
      remediesLayer: astroBundle.remediesLayer,
      timingWindows: astroBundle.timingWindows,
      timingConfidenceNote: astroBundle.timingConfidenceNote,
      natal: report?.natal ?? null,
      houseLords: report?.houseLords ?? report?.natal?.houseLords ?? null,
      baseChartFactors: null,
      timingPolicy: astroBundle.timingPolicy,
    },

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
/* --------------------------------------------------
   Main POST handler
-------------------------------------------------- */

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as any;

    const question = safeStr(body?.question ?? body?.message);
    if (!question) return badJson("No question provided", 400);

    const rawProfile = body?.profile ?? body?.birthProfile ?? null;
    const profile = normalizeProfile(rawProfile);
    const profileOk = hasValidProfile(profile);

    let report: LifeReportLike | any = body?.report ?? body?.reportData ?? null;
    if (report && typeof report === "object" && report.data && typeof report.data === "object") {
      report = report.data;
    }

   const topic = detectTopic(question);
const questionType = detectQuestionType(question);
const distressed = detectDistress(question);
const timeDirection = detectTimeDirection(question, topic);

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

const shouldRebuildReport =
  profileOk && (!reportHasTiming || !reportMatchesProfile || needsPastHistory);
// If profile is valid and report is missing, stale, or belongs to a different birth chart, rebuild report
if (shouldRebuildReport) {
      try {
        const lifeReportURL = safeInternalURL(req, "/api/life-report");
        const lrRes = await fetch(lifeReportURL, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: profile?.name ?? "User",
            birthDateISO: profile!.dobISO!,
            birthTime: profile!.tob!,
            birthTz: profile!.place!.tz,
            birthLat: profile!.place!.lat,
            birthLon: profile!.place!.lon,
          }),
        });

        if (lrRes.ok) {
          report = await lrRes.json();
        }
      } catch (e) {
        console.warn("[astro-chat] could not build life report", e);
      }
    }
console.log("[astro-chat] report freshness check", {
  hasHistoricalDashaTimeline,
  reportHasTiming,
  reportMatchesProfile,
  needsPastHistory,
  shouldRebuildReport,
  incomingDashaTimelineCount: Array.isArray(report?.dashaTimeline) ? report.dashaTimeline.length : 0,
});
 const eventScale = detectEventScale(question, topic);

    // optional chart foundation, but no domain-specific reading builders
    let baseChartFactors: any = null;
    try {
      if (report) {
        baseChartFactors = await buildBaseChartFactors(report);
      }
    } catch (e) {
      console.warn("[astro-chat] buildBaseChartFactors failed", e);
    }

        const enrichedReport = {
      ...(report ?? {}),
      baseChartFactors,
    };

        const astroBundle = buildGenericAstroBundle(
      question,
      topic,
      questionType,
      enrichedReport
    );

    console.log("[astro-chat] routing", {
      question,
      topic,
      questionType,
      timeDirection,
      eventScale,
      bundleTimeDirection: astroBundle.timeDirection,
      bundleEventScale: astroBundle.eventScale,
    });
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
      finalDecisionLine: finalDecision.line,
      finalDecisionVerdict: finalDecision.verdict,
    });

    const naturalizeURL = safeInternalURL(req, "/api/naturalize");
    const naturalRes = await fetch(naturalizeURL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(natPayload),
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

    if (!/[.!?]$/.test(answer.trim())) {
      answer = astroBundle.answerSummary;
    }

    return okJson({
      answer,
      evidenceBullets: astroBundle.evidenceBullets,
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
          summary:
  astroBundle.timeDirection === "past"
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
