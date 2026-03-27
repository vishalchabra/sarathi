// src/app/api/astro-chat/route.ts

export const runtime = "nodejs";

import "server-only";
import { NextResponse } from "next/server";
import { SARATHI_SYSTEM_PROMPT } from "@/lib/qa/systemPrompt";
import { nakshatraToneMap } from "@/server/askSarathi/nakshatraTone";
import type {
  AskSarathiCoreAnswer,
  AskSarathiDomain,
  AskSarathiQuestionType,
  AskSarathiVerdictType,
  AskSarathiConfidence,
  AskSarathiTimingWindow,
  AskSarathiWindowStrength,
} from "@/lib/ask-sarathi/types";
import { buildProfessionFacts } from "@/server/astro/buildProfessionFacts";
import { buildBaseChartFactors } from "@/server/astro/buildBaseChartFactors";
import { buildCareerReading } from "@/server/astro/buildCareerReading";
import { buildMarriageFacts } from "@/server/astro/buildMarriageFacts";
import { buildMarriageReading } from "@/server/astro/buildMarriageReading";
import { buildHistoricalSnapshot } from "@/server/astro/buildHistoricalSnapshot";
import { buildMarriageEventVerification } from "@/server/astro/buildMarriageEventVerification";
import { buildTransitSnapshotForDate } from "@/server/astro/buildTransitSnapshotForDate";
import { buildDegreeHitsForDate } from "@/server/astro/buildDegreeHitsForDate";
const chatContext = new Map<string, string[]>(); // memory of recent questions
const lastFollowup = new Map<string, string>();  // last followup lane we offered
const lastFacts = new Map<string, any>();        // last astroFacts bundle
const MAX_HISTORY = 6;
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

type ActivePeriods = {
  mahadasha?: {
    lord: string;
    start: string;
    end: string;
    summary?: string;
  };
  antardasha?: {
    mahaLord: string;
    subLord: string;
    start: string;
    end: string;
    summary?: string;
  };
  pratyantardasha?: {
    mahaLord: string;
    antarLord: string;
    lord: string;
    start: string;
    end: string;
    summary?: string;
  };
};

type TimelineWindow = {
  from: string;
  to: string;
  label: string;
  score: number;
  mdLord: string;
  adLord: string;
  pdLord: string;
  highlights: string[];
  blurb: string;
};

type TransitWindow = {
  from: string;
  to: string;
  focusArea: string;
  driver: string;
  riskFlag?: "caution" | "opportunity" | "mixed";
  summary: string;
  actions: string[];
};

type LifeReportLike = {
  activePeriods?: ActivePeriods;
  timeline?: TimelineWindow[];
  transitWindows?: TransitWindow[];
  birth?: BirthData;
  natal?: {
    ascSign?: string | null;
    moonSign?: string | null;
    moonNakshatra?: string | null;
  };
};
type DailyRhythm = {
  tone: string;
  focus: string;
  avoid: string;
  foodHint: string;
  relationshipHint: string;
  moneyHint: string;
  oneStep: string;
};
type AskSarathiQuestionFamily =
  | "daily_micro"
  | "daily_outlook"
  | "timing"
  | "decision"
  | "prediction"
  | "remedy"
  | "gemstone"
  | "explainer"
  | "diagnosis"
  | "emotional_support"
  | "calendar_event"
  | "comparison"
  | "action_plan"
  | "generic";

type TimeAnchorInfo = {
  kind: "festival" | "date" | "relative_period" | "none";
  label?: string;
  raw?: string;
};

type GemstoneInfo = {
  asked: boolean;
  stone?: string;
  planet?: string;
};

type AskSarathiRoutePlan = {
  family: AskSarathiQuestionFamily;
  domain: AskSarathiDomain;
  questionType: AskSarathiQuestionType;
  isMicro: boolean;
  needsTiming: boolean;
  needsDecisionLogic: boolean;
  needsRemedyLogic: boolean;
  needsGemstoneLogic: boolean;
  needsCalendarLogic: boolean;
  needsExplainerLogic: boolean;
  needsPredictionLogic: boolean;
  timeAnchor: TimeAnchorInfo;
  gemstone: GemstoneInfo;
};

type AstroChatRequest = {
  // frontend may send either "question" or "message"
  question?: string;
  message?: string;

  // frontend may send topic, but we can also infer it
  topic?: string;

  birth?: BirthData | null;

  // frontend may send either "report" or "reportData"
  report?: LifeReportLike | null;
  reportData?: LifeReportLike | null;
};


/* --------------------------------------------------
   Util
-------------------------------------------------- */
function cleanUnknown(s?: string) {
  if (!s) return "";
  return s
    .replace(/\b(unknown|not available|n\/a)\b/gi, "")
    // ✅ keep line breaks; only compress repeated spaces/tabs
    .replace(/[ \t]{2,}/g, " ")
    // ✅ avoid huge vertical gaps
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getNakshatraToneLine(report?: any): string {
  const rawNak =
    report?.natal?.moonNakshatra ??
    report?.moonNakshatra ??
    "";

  const moonNak = String(rawNak)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  if (!moonNak) return "";

  const tone =
    nakshatraToneMap[moonNak] ??
    nakshatraToneMap[moonNak.replace(/\s/g, "")];

  if (!tone?.message) return "";

  return tone.message;
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
    return "http://localhost:3000" + path;
  }
}

function fmtDateShort(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(+d)) return "—";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function fmtRange(fromISO?: string, toISO?: string) {
  return `${fmtDateShort(fromISO)} – ${fmtDateShort(toISO)}`;
}

function strengthBar(n: number): string {
  const full = "🔹";
  const empty = "⚪";
  const clamped = Math.min(5, Math.max(1, n));
  return full.repeat(clamped) + empty.repeat(5 - clamped);
}

/* --------------------------------------------------
   Topic + emotion sensing
-------------------------------------------------- */

function detectTopic(q: string): AskSarathiDomain {
  const lower = q.toLowerCase();

  if (
    lower.includes("promotion") ||
    lower.includes("job") ||
    lower.includes("role") ||
    lower.includes("title") ||
    lower.includes("boss") ||
    lower.includes("career") ||
    lower.includes("work") ||
    lower.includes("office") ||
    lower.includes("job change") ||
    lower.includes("job switch") ||
    lower.includes("new job") ||
    lower.includes("resign") ||
    lower.includes("quit")
  ) return "career";

  if (
    lower.includes("money") ||
    lower.includes("income") ||
    lower.includes("wealth") ||
    lower.includes("finance") ||
    lower.includes("salary") ||
    lower.includes("bonus") ||
    lower.includes("raise") ||
    lower.includes("investment") ||
    lower.includes("invest") ||
    lower.includes("cashflow")
  ) return "money";

  if (
    lower.includes("relationship") ||
    lower.includes("partner") ||
    lower.includes("love") ||
    lower.includes("spouse") ||
    lower.includes("boyfriend") ||
    lower.includes("girlfriend")
  ) return "relationships";

  if (
    lower.includes("marriage") ||
    lower.includes("marry") ||
    lower.includes("wedding")
  ) return "marriage";

  if (
    lower.includes("health") ||
    lower.includes("body") ||
    lower.includes("stress") ||
    lower.includes("energy") ||
    lower.includes("fatigue") ||
    lower.includes("sleep") ||
    lower.includes("burnout") ||
    lower.includes("illness") ||
    lower.includes("recovery")
  ) return "health";

  if (
    lower.includes("property") ||
    lower.includes("house") ||
    lower.includes("home purchase") ||
    lower.includes("real estate") ||
    lower.includes("plot") ||
    lower.includes("land")
  ) return "property";

  if (
    lower.includes("vehicle") ||
    lower.includes("car") ||
    lower.includes("bike") ||
    lower.includes("automobile")
  ) return "vehicle";

  if (
    lower.includes("dispute") ||
    lower.includes("legal") ||
    lower.includes("court") ||
    lower.includes("case") ||
    lower.includes("conflict")
  ) return "disputes";

  if (
    lower.includes("purpose") ||
    lower.includes("direction") ||
    lower.includes("confused") ||
    lower.includes("lost") ||
    lower.includes("inner") ||
    lower.includes("meaning")
  ) return "inner";

  if (
  /\b(life|phase|future|direction|next phase|next step|purpose|meaning)\b/.test(q)
) {
  return "inner";
}

return "generic";
}
function detectQuestionType(q: string): AskSarathiQuestionType {
  const lower = q.toLowerCase().trim();

  const normalized = lower
    .replace(/['’]/g, "")
    .replace(/\?/g, "")
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim();
     // DAILY MICRO — tiny daily/lifestyle questions
    if (
    normalized.includes("what color is best for today") ||
    normalized.includes("what colour is best for today") ||
    normalized.includes("what color is good today") ||
    normalized.includes("what colour is good today") ||
    normalized.includes("what color should i wear today") ||
    normalized.includes("what colour should i wear today") ||
    normalized.includes("best color for today") ||
    normalized.includes("best colour for today") ||

    normalized.includes("what color is good for me") ||
    normalized.includes("what colour is good for me") ||
    normalized.includes("which color is good for me") ||
    normalized.includes("which colour is good for me") ||
    normalized.includes("what color suits me") ||
    normalized.includes("what colour suits me") ||
    normalized.includes("which color suits me") ||
    normalized.includes("which colour suits me") ||
    normalized.includes("what color should i wear") ||
    normalized.includes("what colour should i wear") ||
    normalized.includes("which color should i wear") ||
    normalized.includes("which colour should i wear") ||
    normalized.includes("best color for me") ||
    normalized.includes("best colour for me") ||

    normalized.includes("what should i eat today") ||
    normalized.includes("what to eat today") ||
    normalized.includes("is today good for a meeting") ||
    normalized.includes("is today good for meeting") ||
    normalized.includes("is today good for an interview") ||
    normalized.includes("is today good for an important conversation") ||
    normalized.includes("is today good for a call") ||
    normalized.includes("gym today") ||
    normalized.includes("workout today") ||
    normalized.includes("run today")
  ) {
    return "daily_micro";
  }
  // DAILY OUTLOOK — must be checked first
  if (
    normalized.includes("hows my day looking") ||
    normalized.includes("how is my day looking") ||
    normalized.includes("hows my day") ||
    normalized.includes("how is my day") ||
    normalized.includes("how does my day look") ||
    normalized.includes("how is today looking") ||
    normalized.includes("hows today looking") ||
    normalized.includes("today looking") ||
    normalized.includes("what is today like") ||
    normalized.includes("whats today like") ||
    normalized.includes("what should i focus on today") ||
    normalized.includes("what is today good for") ||
    normalized.includes("is today good for") ||
    normalized.includes("how is my day going")
  ) {
    return "daily_outlook";
  }

  if (
    normalized.startsWith("what is ") ||
    normalized.startsWith("whats ") ||
    normalized.startsWith("what's ") ||
    normalized.includes("meaning of ") ||
    normalized.includes("explain ") ||
    normalized.includes("what does") ||
    normalized.includes("how does")
  ) {
    return "explainer";
  }

  if (
    normalized.includes("remedy") ||
    normalized.includes("remedies") ||
    normalized.includes("upaya") ||
    normalized.includes("mantra") ||
    normalized.includes("pooja") ||
    normalized.includes("gem") ||
    normalized.includes("stone") ||
    normalized.includes("wear")
  ) {
    return "remedy";
  }

  if (
    normalized.includes("compare") ||
    normalized.includes(" vs ") ||
    normalized.includes(" versus ") ||
    normalized.includes("or wait") ||
    normalized.includes("or stay") ||
    normalized.includes("or switch")
  ) {
    return "comparison";
  }

  if (
    normalized.includes("when") ||
    normalized.includes("which month") ||
    normalized.includes("what time") ||
    normalized.includes("timing") ||
    normalized.includes("window") ||
    normalized.includes("date") ||
    normalized.includes("dates")
  ) {
    return "timing";
  }

  if (
    normalized.includes("should i") ||
    normalized.includes("can i") ||
    normalized.includes("is it good to") ||
    normalized.includes("is it right to") ||
    normalized.includes("is this a good time")
  ) {
    return "decision";
  }

  if (
    normalized.includes("why is") ||
    normalized.includes("why am i") ||
    normalized.includes("why does") ||
    normalized.includes("what is happening") ||
    normalized.includes("why delayed") ||
    normalized.includes("why stuck")
  ) {
    return "diagnosis";
  }

  if (
    normalized.includes("what should i do") ||
    normalized.includes("what to do") ||
    normalized.includes("how should i move") ||
    normalized.includes("next step") ||
    normalized.includes("action plan")
  ) {
    return "action_plan";
  }

  if (
    normalized.includes("anxious") ||
    normalized.includes("worried") ||
    normalized.includes("scared") ||
    normalized.includes("stressed") ||
    normalized.includes("lost") ||
    normalized.includes("confused") ||
    normalized.includes("emotionally") ||
    normalized.includes("hopeless")
  ) {
    return "emotional_support";
  }

  return "decision";
}
function detectTimeAnchor(q: string): TimeAnchorInfo {
  const lower = String(q || "").toLowerCase().trim();

  // festival anchors
  if (/\bdiwali\b/.test(lower)) {
    return { kind: "festival", label: "Diwali", raw: "diwali" };
  }
  if (/\bholi\b/.test(lower)) {
    return { kind: "festival", label: "Holi", raw: "holi" };
  }
  if (/\bnavratri\b/.test(lower)) {
    return { kind: "festival", label: "Navratri", raw: "navratri" };
  }
  if (/\bdussehra\b|\bvijayadashami\b/.test(lower)) {
    return { kind: "festival", label: "Dussehra", raw: "dussehra" };
  }
  if (/\bguru purnima\b/.test(lower)) {
    return { kind: "festival", label: "Guru Purnima", raw: "guru purnima" };
  }
  if (/\bjanmashtami\b/.test(lower)) {
    return { kind: "festival", label: "Janmashtami", raw: "janmashtami" };
  }
  if (/\bmahashivratri\b|\bshivratri\b/.test(lower)) {
    return { kind: "festival", label: "Maha Shivratri", raw: "shivratri" };
  }

  // relative timing anchors
  if (/\bafter\b|\bfrom\b|\bby\b|\bbefore\b/.test(lower)) {
    if (/\bnext month\b/.test(lower)) {
      return { kind: "relative_period", label: "next month", raw: "next month" };
    }
    if (/\bthis month\b/.test(lower)) {
      return { kind: "relative_period", label: "this month", raw: "this month" };
    }
    if (/\bnext year\b/.test(lower)) {
      return { kind: "relative_period", label: "next year", raw: "next year" };
    }
    if (/\bthis year\b/.test(lower)) {
      return { kind: "relative_period", label: "this year", raw: "this year" };
    }
  }

  // simple explicit date patterns
  if (/\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/.test(lower)) {
    const m = lower.match(/\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/);
    return { kind: "date", label: m?.[0], raw: m?.[0] };
  }

  return { kind: "none" };
}
function extractYearFromQuestion(question: string): number | null {
  const m = question.match(/\b(19|20)\d{2}\b/);
  if (!m) return null;
  const y = Number(m[0]);
  return Number.isFinite(y) ? y : null;
}
function detectGemstoneIntent(q: string): GemstoneInfo {
  const lower = String(q || "").toLowerCase().trim();

  const map: Array<{ stone: string; planet: string; patterns: RegExp[] }> = [
    {
      stone: "Yellow Sapphire",
      planet: "Jupiter",
      patterns: [/\byellow sapphire\b/, /\bpukhraj\b/],
    },
    {
      stone: "Blue Sapphire",
      planet: "Saturn",
      patterns: [/\bblue sapphire\b/, /\bneelam\b/],
    },
    {
      stone: "Emerald",
      planet: "Mercury",
      patterns: [/\bemerald\b/, /\bpanna\b/],
    },
    {
      stone: "Ruby",
      planet: "Sun",
      patterns: [/\bruby\b/, /\bmanik\b/],
    },
    {
      stone: "Pearl",
      planet: "Moon",
      patterns: [/\bpearl\b/, /\bmoti\b/],
    },
    {
      stone: "Red Coral",
      planet: "Mars",
      patterns: [/\bred coral\b/, /\bcoral\b/, /\bmoonga\b/, /\bmunga\b/],
    },
    {
      stone: "Diamond",
      planet: "Venus",
      patterns: [/\bdiamond\b/, /\bheera\b/],
    },
    {
      stone: "Opal",
      planet: "Venus",
      patterns: [/\bopal\b/],
    },
    {
      stone: "Cat's Eye",
      planet: "Ketu",
      patterns: [/\bcat'?s eye\b/, /\blehsunia\b/, /\bvaidurya\b/],
    },
    {
      stone: "Hessonite",
      planet: "Rahu",
      patterns: [/\bhessonite\b/, /\bgomed\b/],
    },
  ];

  const asked =
    /\b(gem|gemstone|stone|wear|wearing|suit|suits|suitable|safe to wear|can i wear|should i wear)\b/.test(lower);

  for (const item of map) {
    if (item.patterns.some((re) => re.test(lower))) {
      return {
        asked: true,
        stone: item.stone,
        planet: item.planet,
      };
    }
  }

  return { asked, stone: undefined, planet: undefined };
}
function detectQuestionFamily(question: string): AskSarathiQuestionFamily {
  const q = String(question || "").toLowerCase().trim();

  // calendar / event anchored questions
    if (
    (/\bwhen is\b/.test(q) || /\bdate of\b/.test(q) || /\bon what date\b/.test(q)) &&
    /\b(diwali|holi|navratri|dussehra|vijayadashami|guru purnima|janmashtami|shivratri)\b/.test(q)
  ) {
    return "calendar_event";
  }

  if (
    /\b(after|from|before|by)\b/.test(q) &&
    /\b(diwali|holi|navratri|dussehra|vijayadashami|guru purnima|janmashtami|shivratri)\b/.test(q)
  ) {
    return "calendar_event";
  }

  // gemstone / remedy
  if (
    /\b(yellow sapphire|blue sapphire|emerald|ruby|pearl|coral|red coral|diamond|opal|cat'?s eye|hessonite|pukhraj|neelam|panna|manik|moti|moonga|munga|heera|gomed|lehsunia)\b/.test(q) ||
    /\b(gemstone|gem stone|stone|which stone|what stone|which gemstone|what gemstone)\b/.test(q)
  ) {
    return "gemstone";
  }

  if (
    /\b(remedy|remedies|upaya|upay|mantra|pooja|puja|totka)\b/.test(q)
  ) {
    return "remedy";
  }

  // daily
  if (
    /\b(how is my day|how's my day|how is today|today looking|what should i focus on today|what is today good for)\b/.test(q)
  ) {
    return "daily_outlook";
  }

  if (
    /\b(what color|which color|what colour|which colour|wear today|what should i wear|what to eat today|meeting today|call today|gym today|workout today|run today)\b/.test(q)
  ) {
    return "daily_micro";
  }

  // explainers
  if (
    /\b(what is|what's|whats|meaning of|explain|what does)\b/.test(q)
  ) {
    return "explainer";
  }
 if (
    /\b(when will things improve|when will my life improve|when will things get better|when will my situation improve)\b/.test(q)
  ) {
    return "timing";
  }
  if (
    /\b(when will things change|when will my time change|will my time improve|what is coming next|what is next for me|is this phase changing|why is nothing changing|why is everything stuck)\b/.test(q)
  ) {
    return "diagnosis";
  }
  // diagnosis
  if (
  /\b(why am i|why is|why does|why stuck|why delayed|why life|why nothing|why everything|why feels|why feel|what is happening)\b/.test(q)
) {
  return "diagnosis";
}
if (
  /\b(stuck|blocked|nothing changing|no progress|life stuck|life stagnant)\b/.test(q)
) {
  return "diagnosis";
}
  // emotional support
  if (
    /\b(anxious|worried|scared|stressed|lost|hopeless|emotionally)\b/.test(q)
  ) {
    return "emotional_support";
  }

  // comparison
  if (/\b(compare| vs | versus |or wait|or stay|or switch)\b/.test(q)) {
    return "comparison";
  }

  // timing
  if (/\bwhen|which month|what time|timing|window|date|dates\b/.test(q)) {
    return "timing";
  }
 
  // decision
  if (/\bshould i|can i|is it good to|is it right to|is this a good time\b/.test(q)) {
    return "decision";
  }

  // action plan
  if (/\b(what should i do|what to do|next step|action plan|how should i move)\b/.test(q)) {
    return "action_plan";
  }

  // prediction
  if (
    /\b(will i|will my|am i going to|is it likely|can this happen)\b/.test(q)
  ) {
    return "prediction";
  }
  
  return "generic";
}

function buildRoutePlan(question: string): AskSarathiRoutePlan {
  const domain = detectTopic(question);
  const timeAnchor = detectTimeAnchor(question);
  const gemstone = detectGemstoneIntent(question);
  const family = detectQuestionFamily(question);

  let questionType: AskSarathiQuestionType = detectQuestionType(question);

  // family can override legacy questionType when needed
  if (family === "gemstone" || family === "remedy") questionType = "remedy";
  if (family === "calendar_event") questionType = "timing";
  if (family === "prediction") questionType = "decision";
  if (family === "daily_micro") questionType = "daily_micro";
  if (family === "daily_outlook") questionType = "daily_outlook";
  if (family === "explainer") questionType = "explainer";
  if (family === "diagnosis") questionType = "diagnosis";
  if (family === "comparison") questionType = "comparison";
  if (family === "action_plan") questionType = "action_plan";
  if (family === "emotional_support") questionType = "emotional_support";

  const isMicro = family === "daily_micro";

  return {
    family,
    domain,
    questionType,
    isMicro,
    needsTiming:
      family === "timing" ||
      family === "decision" ||
      family === "prediction" ||
      family === "calendar_event" ||
      family === "comparison",
    needsDecisionLogic:
      family === "decision" ||
      family === "prediction" ||
      family === "comparison",
    needsRemedyLogic:
      family === "remedy" || family === "gemstone",
    needsGemstoneLogic:
      family === "gemstone" || !!gemstone.stone,
    needsCalendarLogic:
      family === "calendar_event" || timeAnchor.kind !== "none",
    needsExplainerLogic:
      family === "explainer",
    needsPredictionLogic:
      family === "prediction" ||
      family === "timing" ||
      family === "decision",
    timeAnchor,
    gemstone,
  };
}
// ================= OPEN CHART MODE HELPERS =================



function isFoodQuestion(q: string): boolean {
  const l = q.toLowerCase();

  // direct food/eating keywords
  if (
    /\b(what should i eat|kya khau|kya khana hai|what to eat|eat today|diet|food|khana|khaana|meal|lunch|dinner)\b/.test(
      l
    )
  ) {
    return true;
  }

  // softer forms like "is this food ok", "should I avoid X"
  if (/(is .* good for (me|health)|should i avoid .* food|healthy to eat)/.test(l)) {
    return true;
  }

  return false;
}

function inferMood(q: string): string {
  const l = q.toLowerCase();

  if (
    l.includes("anxious") || l.includes("anxiety") || l.includes("scared") ||
    l.includes("worried") || l.includes("worry") || l.includes("stressed") ||
    l.includes("burnout") || l.includes("burned out") ||
    l.includes("tired") || l.includes("exhausted") ||
    l.includes("nothing is moving") || l.includes("stuck") ||
    l.includes("losing hope")
  ) {
    return "the user sounds worried / stressed and needs reassurance and clarity";
  }

  if (
    l.includes("promotion") || l.includes("next role") ||
    l.includes("when will i get") || l.includes("when can i move") ||
    l.includes("job change") || l.includes("career window") ||
    l.includes("raise") || l.includes("money") ||
    l.includes("when do i get a new job") || l.includes("when will i get a new job")
  ) {
    return "the user wants clear timing and practical next steps";  }

  if (
    l.includes("relationship") || l.includes("love") || l.includes("marriage") ||
    l.includes("heart") || l.includes("feel") || l.includes("feelings")
  ) {
    return "the user sounds emotionally vulnerable and wants emotional context, not just dates";
  }

  return "neutral curiosity, just answer naturally and be supportive";
}

function detectDistress(q: string): boolean {
  const l = q.toLowerCase();
  const triggers = [
    "stuck","nothing is moving","nothing is happening","why is nothing",
    "i'm tired","i am tired","tired of this","exhausted","burned out","burnt out",
    "frustrated","frustration","losing hope","lose hope","scared","worried","anxious","anxiety",
    "panic","am i cursed","am i screwed","is this bad","when will this end","why me",
    "fed up","give up","too far","that's too far","too long",
  ];
  return triggers.some((t) => l.includes(t));
}

function reassureUser(topic: AskSarathiDomain): string {
  if (topic === "career")
    return "You're not failing. This timing is slow-build, not dead. The chart is saying 'stack proof and be seen', not 'you're done'.";
  if (topic === "health")
    return "Your chart does not say permanent damage. It says 'watch stress load, protect sleep, don't self-abandon'.";
  if (topic === "relationships" || topic === "marriage")
    return "This isn't 'you're unlovable'. It's a boundary-and-truth chapter, not permanent loneliness.";
  if (topic === "money")
    return "This is 'delayed inflow', not 'no inflow'. It's timing, not doom.";
  return "I can feel how heavy this is. This is shaping energy, not punishment. You're not broken.";
}
function isMicroIntentQuestion(q: string): boolean {
  const l = (q || "").toLowerCase().trim();

  // very short = usually micro
  if (l.length <= 18) return true;

  // daily/lifestyle quick intents
   if (
    /\b(what color|which color|what colour|which colour|what to wear|should i wear|wear today|outfit|dress|suits me)\b/.test(l) ||
    /\b(what should i eat|what to eat|eat today|diet today|khana|khaana)\b/.test(l) ||
    /\b(is today good|is it good today|good day for|should i go|should i do)\b/.test(l) ||
    /\b(meeting today|good for meeting|call today|presentation today)\b/.test(l) ||
    /\b(gym today|workout today|run today)\b/.test(l) ||
    /\b(travel today|drive today|go out today)\b/.test(l)
  ) {
    return true;
  }

  return false;
}

/* --------------------------------------------------
   Follow-up classifier
-------------------------------------------------- */

function isShortFollowup(q: string): boolean {
  const t = q.trim().toLowerCase();

  if (
    t.length <= 14 &&
    ["yes","yeah","yep","ok","okay","sure","go on","tell me more","continue","keep going","right","correct","hmm","hm"].includes(t)
  ) return true;

  if (/(near\s*term|near\s*fut|current|right now|this week|this month|today|short term|in the meantime|for now|too far|is too far|closer)/i.test(t))
    return true;

  if (/(safe|stability|stable|secure|risk|jump|leave|quit|should i leave|should i quit|safe to move)/i.test(t))
    return true;

  return false;
}
function canonicalTopic(t: string): "career" | "money" | "relationships" | "health" | "property" | "vehicle" | "disputes" | "generic" {
  const x = String(t || "").toLowerCase().trim();

  // normalize synonyms
  if (x === "job" || x === "career") return "career";
  if (x === "wealth" || x === "money" || x === "finance") return "money";
  if (x === "relationship" || x === "relationships" || x === "marriage") return "relationships";
  if (x === "health") return "health";
  if (x === "property") return "property";
  if (x === "vehicle") return "vehicle";
  if (x === "disputes" || x === "dispute" || x === "legal") return "disputes";

  return "generic";
}

/* --------------------------------------------------
   Timing helpers
-------------------------------------------------- */
function buildCareerMicroAnswer(careerReading: any): string {
  const roles: string[] = Array.isArray(careerReading?.likelyRoles)
    ? careerReading.likelyRoles.slice(0, 3).map((x: any) => String(x))
    : [];

  const pattern = String(careerReading?.coreCareerPattern ?? "").toLowerCase();

  const advisory = roles.filter((r: string) =>
    /astrologer|advisor|consultant|specialist guide/i.test(r)
  );

 if (advisory.some((r: string) => /astrologer/i.test(r))) {
  return "You are most likely in advisory or interpretive work — this looks closer to an astrologer, consultant, or specialist guide than a routine backend role.";
}

if (advisory.length) {
  return "You are most likely in advisory or consultative work rather than a routine backend role.";
}

  if (roles.length) {
    return `You are most likely in ${roles.join(", ")} work within a structured professional setting.`;
  }

  if (pattern.includes("institutional")) {
    return "You are most likely in a structured institutional role involving responsibility, systems, and analytical work.";
  }

  return "Your chart points to structured professional work, but the exact role cluster is not clear enough from the current chart inputs alone.";
}
function buildJobVsBusinessMicroAnswer(careerReading: any): string {
  const serviceVsBusiness = String(careerReading?.serviceVsBusiness ?? "hybrid");
  const roles: string[] = Array.isArray(careerReading?.likelyRoles)
    ? careerReading.likelyRoles.slice(0, 4).map((x: any) => String(x))
    : [];

  const advisory = roles.some((r) =>
    /astrologer|advisor|consultant|specialist guide/i.test(r)
  );

  if (serviceVsBusiness === "service" && advisory) {
    return "You are better suited to structured service work than pure business, but independent work can suit you if it is built around advisory, consulting, or interpretive expertise.";
  }

  if (serviceVsBusiness === "service") {
  return "You are more naturally suited to structured service or expertise-based work than pure business. Independent work can still suit you if it is built around consulting, guidance, or specialist knowledge rather than high-risk entrepreneurship.";
}
  if (serviceVsBusiness === "business") {
    return "You are more naturally suited to independent business or self-directed work than fixed service roles, especially where initiative and ownership matter.";
  }

  return "Your chart supports a hybrid path — stable service or job-based work suits you, but independent work can also succeed if built gradually around your expertise.";
}
function toneForLord(lord?: string): string {
  if (!lord) return "";
  const L = lord.toLowerCase();
  if (L === "jupiter") return "growth and guidance, mentors, fortunate openings if you step forward";
  if (L === "venus")   return "charisma, attraction, comfort-seeking, polishing how you present yourself";
  if (L === "saturn")  return "pressure, responsibility, audit-and-build mode; slow work that actually lasts";
  if (L === "rahu")    return "risk appetite, hungry ambition, edgy moves that bend rules";
  if (L === "ketu")    return "cutting noise, spiritual cleanup, detaching from drama and fake obligations";
  if (L === "mercury") return "communication, documents, logistics, getting clarity in plans";
  if (L === "mars")    return "action, confrontation, decisive movement, protect your energy";
  if (L === "sun")     return "visibility and authority; you’re being seen and judged, so stand tall";
  if (L === "moon")    return "emotional flow, instincts, comfort and security needs";
  return "activation around a key theme.";
}
function pickActiveTransitNow(report: any): TransitWindow | null {
  const now = Date.now();

  const pool: TransitWindow[] = [];

  if (Array.isArray(report?.transitWindows)) {
    for (const w of report.transitWindows) {
      pool.push(w);
    }
  }

  if (Array.isArray(report?.topTransits)) {
    for (const tr of report.topTransits) {
      pool.push({
        from: tr.startISO,
        to: tr.endISO,
        focusArea: tr.category || "",
        driver: tr.title || tr.target || tr.planet || "",
        riskFlag:
          typeof tr.strength === "number"
            ? tr.strength >= 0.82
              ? "opportunity"
              : tr.strength >= 0.7
              ? "mixed"
              : "caution"
            : "mixed",
        summary: tr.description || tr.title || "",
        actions: [],
      });
    }
  }

  const tagged = pool
    .map((w) => {
      const from = new Date(w.from).getTime();
      const to = new Date(w.to).getTime();
      return { w, from, to };
    })
    .filter((x) => Number.isFinite(x.from) && Number.isFinite(x.to));

  if (!tagged.length) return null;

  let active = tagged.find((x) => now >= x.from && now <= x.to);
  if (!active) {
    active = [...tagged]
      .filter((x) => x.from >= now)
      .sort((a, b) => a.from - b.from)[0];
  }
  if (!active) {
    active = [...tagged].sort((a, b) => b.to - a.to)[0];
  }

  return active ? active.w : null;
}

function buildShortHorizon(
  report?: LifeReportLike | null,
  span: "day" | "week" | "month" = "day"
): string {
  const activeAny = getActiveDashaAnyShape(report);

const maha = activeAny.md || "—";
const antar = activeAny.ad || "—";
const praty = activeAny.pd || "—";


  const antarTone = toneForLord(antar);
  const pratyTone = toneForLord(praty);

  let label = "Today's tone";
  if (span === "week")  label = "This week’s tone";
  if (span === "month") label = "This month’s tone";

  let guidance = "";
  const P = praty.toLowerCase();
  if (P === "saturn")       guidance = "Do the boring thing properly; slow progress counts.";
  else if (P === "venus")   guidance = "Be likable and visible; charm beats force.";
  else if (P === "mars")    guidance = "Take initiative but don't start pointless fights.";
  else if (P === "ketu")    guidance = "Detach from drama and keep priorities clean.";
  else if (P === "rahu")    guidance = "Chase bold opportunities, but stay grounded and ethical. Don't panic-grab.";
  else if (P === "jupiter") guidance = "Seek mentorship; good advice lands easily now.";
  else if (P === "mercury") guidance = "Communicate clearly; organize your plans/papers.";
  else if (P === "sun")     guidance = "Take ownership; visibility brings growth.";
  else if (P === "moon")    guidance = "Honor emotions; don't override your body.";
  else                      guidance = "Stay steady; ignore noise.";

  // 🔹 Natal Moon flavour (uses sarathi.lifeReportCache.v2 → .natal)
    const natal = (report as any)?.natal;
  let natalLine = "";

  if (span === "day" && natal?.moonNakshatra) {
    const theme =
      natal.moonNakshatraTheme &&
      String(natal.moonNakshatraTheme).trim().length
        ? ` (${natal.moonNakshatraTheme})`
        : "";

    natalLine =
      `Natal flavour: Moon in ${natal.moonNakshatra}${theme} — today feels better if you add a small moment of joy/creativity instead of running only on duty and pressure.`;
  }


  return [
    `${label}: ${antar} → ${antarTone}.`,
    `Right-now trigger: ${praty} → ${pratyTone}.`,
    natalLine,
    `Use it like this: ${guidance}`,
    `Active stack: ${maha} / ${antar} / ${praty}`,
  ]
    .filter(Boolean)
    .join(" ");
}


/* -------------------- Topic scoring -------------------- */
function normalizeProfile(p: any) {
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

  const place =
    tz != null || lat != null || lon != null
      ? {
          name: placeObj?.name ?? p.placeName ?? p.birthPlace ?? "",
          tz: String(tz ?? ""),
          lat: Number(lat),
          lon: Number(lon),
        }
      : undefined;

  return { name, dobISO, tob, place };
}
function buildMarriageEventVerificationAnswer(v: any, year: number): string {
  if (!v) {
    return `I could not verify ${year} clearly from the available timing data.`;
  }

  if (v.verdict === "strong_match") {
    return `${year} was a strong marriage match in your chart. The active ${v.dashaSupport?.[0]?.includes("Mars") ? "Mars–Jupiter" : "dasha"} timing supported commitment and family formation, so this fits your chart well.`;
  }

  if (v.verdict === "possible_match") {
    return `${year} was a possible marriage period in your chart. The support was present, but it was not the strongest timing window.`;
  }

  return `${year} was not a strong marriage period in your chart. The timing support looks weak compared with better windows.`;
}
function pickBestTransitWindows(
  report: any,
  topic: string
): TransitWindow[] {
  const t = canonicalTopic(topic);

  const out: TransitWindow[] = [];

  // 1) Existing explicit transitWindows, if present
  if (Array.isArray(report?.transitWindows)) {
    for (const tw of report.transitWindows) {
      out.push({
        from: tw.from,
        to: tw.to,
        focusArea: tw.focusArea,
        driver: tw.driver,
        riskFlag: tw.riskFlag,
        summary: tw.summary,
        actions: Array.isArray(tw.actions) ? tw.actions : [],
      });
    }
  }

  // 2) Normalize topTransits from life-report into transit windows
  if (Array.isArray(report?.topTransits)) {
    for (const tr of report.topTransits) {
      out.push({
        from: tr.startISO,
        to: tr.endISO,
        focusArea: tr.category || "",
        driver: tr.title || tr.target || tr.planet || "",
        riskFlag:
          typeof tr.strength === "number"
            ? tr.strength >= 0.82
              ? "opportunity"
              : tr.strength >= 0.7
              ? "mixed"
              : "caution"
            : "mixed",
        summary: tr.description || tr.title || "",
        actions: [],
      });
    }
  }

  function scoreTransitForTopic(tw: TransitWindow, topic2: string): number {
    const area = (tw.focusArea || "").toLowerCase();
    const driver = (tw.driver || "").toLowerCase();
    const summary = (tw.summary || "").toLowerCase();

    if (topic2 === "career") {
      if (
        area.includes("career") ||
        summary.includes("career") ||
        summary.includes("work") ||
        summary.includes("responsibilities") ||
        summary.includes("visibility") ||
        summary.includes("direction") ||
        driver.includes("h10") ||
        driver.includes("self & direction")
      ) return 10;
    }

    if (topic2 === "money") {
      if (
        area.includes("money") ||
        summary.includes("money") ||
        summary.includes("resources") ||
        summary.includes("gains") ||
        driver.includes("money") ||
        driver.includes("resources")
      ) return 10;
    }

    if (topic2 === "relationships") {
      if (
        area.includes("relationship") ||
        area.includes("relationships") ||
        summary.includes("relationships") ||
        summary.includes("partnership") ||
        summary.includes("one-to-one")
      ) return 10;
    }

    if (topic2 === "health") {
      if (
        area.includes("health") ||
        summary.includes("health") ||
        summary.includes("stress") ||
        summary.includes("recovery") ||
        summary.includes("body")
      ) return 10;
    }

    if (topic2 === "property") {
      if (
        summary.includes("home") ||
        summary.includes("property") ||
        summary.includes("stability")
      ) return 10;
    }

    if (topic2 === "vehicle") {
      if (
        summary.includes("vehicle") ||
        summary.includes("movement") ||
        summary.includes("purchase")
      ) return 10;
    }

    if (topic2 === "disputes") {
      if (
        summary.includes("conflict") ||
        summary.includes("legal") ||
        summary.includes("pressure") ||
        summary.includes("rebalance")
      ) return 10;
    }

    if (topic2 === "inner") {
      if (
        area.includes("inner") ||
        summary.includes("clarity") ||
        summary.includes("direction") ||
        summary.includes("inner")
      ) return 10;
    }

    return topic2 === "generic" ? 2 : 1;
  }

  const ranked = out
    .map((tw) => ({ win: tw, s: scoreTransitForTopic(tw, t) }))
    .sort((a, b) => b.s - a.s);

  if (!ranked.length) return [];

  if (t === "generic") return ranked.slice(0, 2).map((r) => r.win);

  return ranked
    .filter((r) => r.s >= 5)
    .slice(0, 3)
    .map((r) => r.win);
}
function pickFromTimeline(
  report: LifeReportLike | null | undefined,
  topic: string
): TimelineWindow | null {
  if (!report?.timeline || !Array.isArray(report.timeline)) return null;

  const t = canonicalTopic(topic);

  const scored = report.timeline.map((w) => {
    const hay = `${w.label} ${w.blurb} ${(w.highlights || []).join(" ")}`.toLowerCase();
    let score = 0;

    const topicKeys: Record<string, string[]> = {
      career: ["career", "status", "recognition", "authority", "promotion", "visibility", "leadership"],
      money: ["money", "income", "finance", "wealth", "bonus", "gain", "raise"],
      relationships: ["relationship", "partner", "marriage", "union", "partnership"],
      health: ["health", "body", "stress", "vitality", "energy", "wellbeing"],
      generic: [],
      property: ["property", "house", "real estate", "land"],
      vehicle: ["vehicle", "car", "bike"],
      disputes: ["dispute", "legal", "case", "court"],
    };

    for (const k of topicKeys[t] ?? []) if (hay.includes(k)) score += 2;

    const ad = (w.adLord || "").toLowerCase();
    const pd = (w.pdLord || "").toLowerCase();

    if (t === "career" && /(sun|mars|jupiter|saturn|venus|rahu)/.test(ad + pd)) score += 2;
    if (t === "money" && /(venus|mercury|jupiter|rahu)/.test(ad + pd)) score += 2;
    if (t === "health" && /(venus|moon|mercury|sun)/.test(ad + pd)) score += 2;
    if (t === "relationships" && /(venus|moon|jupiter)/.test(ad + pd)) score += 2;

    return { w, score };
  });

  const best = scored.sort((a, b) => b.score - a.score)[0];
  return best?.score ? best.w : null;
}


function scoreTransitCareerWindow(win: TransitWindow): number {
  let s = 3;
  const driver = (win.driver || "").toLowerCase();
  const area = (win.focusArea || "").toLowerCase();

  if (area.includes("career") || area.includes("status") || area.includes("recognition") ||
      driver.includes("10th") || driver.includes("11th") ||
      driver.includes("reputation") || driver.includes("visibility")) s += 1;

  if (win.riskFlag === "opportunity") s += 1;
  if (win.riskFlag === "caution") s -= 1;

  if (s < 1) s = 1;
  if (s > 5) s = 5;
  return s;
}
function cleanValue(v?: string) {
  return !v || v.toLowerCase() === "unknown" ? null : v;
}

function scoreCareerWindow(
  adLord: string | undefined,
  pdLord: string | undefined,
  baseScore?: number
): number {
  let s = 0;
  if (typeof baseScore === "number") s += baseScore / 2;

  const combo = `${adLord || ""} ${pdLord || ""}`.toLowerCase();
  if (/(sun|venus|jupiter)/.test(combo)) s += 2;
  if (/(mars|rahu)/.test(combo)) s += 1;
  if (/(saturn)/.test(combo)) s += 1;

  if (s < 1) s = 1;
  if (s > 5) s = 5;
  return Math.round(s);
}

function buildCareerBriefStructured(opts: { report?: LifeReportLike | null }) {
  const { report } = opts;

  const bestTransit = pickBestTransitWindows(report, "career");
  const bestTimeline = pickFromTimeline(report, "career");

  // ✅ 1) Prefer transit window if present
  if (bestTransit.length > 0) {
    const w = bestTransit[0];
    const strengthScore = scoreTransitCareerWindow(w);
    const confidenceWord = strengthScore >= 4 ? "high" : strengthScore === 3 ? "medium" : "low";

    return {
      topic: "career",
      type: "career_window",
      hasWindow: true,
      windowRange: fmtRange(w.from, w.to),
      strengthScore,
      confidenceWord,
      strengthBar: strengthBar(strengthScore),
      why: w.driver ? `Transit driver: ${w.driver}` : "",
      theme: w.summary || "Career movement window",
      actions: Array.isArray(w.actions) ? w.actions.slice(0, 3) : [],
      risk: w.riskFlag || "mixed",
      message:
        `Next career movement window: ${fmtRange(w.from, w.to)}. ` +
        `Strength: ${confidenceWord}.`,
    };
  }

  // ✅ 2) Else use best timeline window
  if (bestTimeline) {
    const strengthScore = scoreCareerWindow(bestTimeline.adLord, bestTimeline.pdLord, bestTimeline.score);
    const confidenceWord = strengthScore >= 4 ? "high" : strengthScore === 3 ? "medium" : "low";

    return {
      topic: "career",
      type: "career_window",
      hasWindow: true,
      windowRange: fmtRange(bestTimeline.from, bestTimeline.to),
      strengthScore,
      confidenceWord,
      strengthBar: strengthBar(strengthScore),
      why: `Dasha timeline: AD ${bestTimeline.adLord}, PD ${bestTimeline.pdLord}`,
      theme: (bestTimeline.blurb || bestTimeline.label || "Career phase").trim(),
      actions: [],
      risk: "mixed",
      message:
        `Career phase: ${fmtRange(bestTimeline.from, bestTimeline.to)}. ` +
        `Strength: ${confidenceWord}.`,
    };
  }

  // ✅ 3) Fallback: no window tagged
  return {
    topic: "career",
    type: "career_window",
    hasWindow: false,
    windowRange: null,
    strengthScore: null,
    confidenceWord: null,
    strengthBar: null,
    why: "",
    theme: "",
    actions: [],
    risk: "mixed",
    message:
      "Right now there isn’t a sharply defined career shift window. This period is more about preparation and positioning. The next change activates when your sub-period shifts.",
  };
}
function getActiveDashaAnyShape(report: any) {
  const a = report?.activePeriods ?? report?.dasha ?? {};
  const md = a?.mahadasha?.lord ?? a?.md?.lord ?? a?.mdLord ?? a?.md ?? "";
  const ad = a?.antardasha?.subLord ?? a?.ad?.lord ?? a?.adLord ?? a?.ad ?? "";
  const pd = a?.pratyantardasha?.lord ?? a?.pd?.lord ?? a?.pdLord ?? a?.pd ?? "";
  return {
    md: String(md || "Unknown"),
    ad: String(ad || "Unknown"),
    pd: String(pd || "Unknown"),
  };
}

function scoreGenericWindow(
  topic: string,
  winTimeline?: TimelineWindow | null,
  winTransit?: TransitWindow | null
): number {
  const t = canonicalTopic(topic);

  if (winTransit) {
    let base = 3;
    if (winTransit.riskFlag === "opportunity") base += 1;
    if (winTransit.riskFlag === "caution") base -= 1;
    if (base < 1) base = 1;
    if (base > 5) base = 5;
    return base;
  }

  if (winTimeline) {
    let base = typeof winTimeline.score === "number" ? winTimeline.score / 2 : 3;

    const ad = (winTimeline.adLord || "").toLowerCase();
    const pd = (winTimeline.pdLord || "").toLowerCase();

    if (t === "health" && /(moon|venus|sun|mercury)/.test(ad + pd)) base += 1;
    if (t === "money"  && /(venus|jupiter|mercury|rahu)/.test(ad + pd)) base += 1;
    if (t === "relationships" && /(venus|moon|jupiter)/.test(ad + pd)) base += 1;

    if (base < 1) base = 1;
    if (base > 5) base = 5;
    return Math.round(base);
  }

  return 3;
}

function buildGenericBrief(opts: {
  topic: string;
  question: string;
  report?: LifeReportLike | null;
}): string {
  const { topic, report } = opts;

  const bestTransit = pickBestTransitWindows(report, topic);
  const bestTimeline = pickFromTimeline(report, topic);
  const strongestTransit = bestTransit?.[0];
  const transitInterpretation = interpretTransitTrigger(strongestTransit?.driver);
  // 1) If we have transit windows, use them first
  if (bestTransit.length) {
    const w = bestTransit[0];
    const strength = scoreGenericWindow(topic, null, w);
    const bar = strengthBar(strength);

    return [
      `${fmtRange(w.from, w.to)} is the key window for ${topic}.`,
      `Strength: ${strength}/5 ${bar}`,
      w.driver ? `Driver: ${w.driver}.` : null,
      w.summary ? `Theme: ${w.summary}` : null,
      w.actions && w.actions.length ? `Action: ${w.actions[0]}` : null,
    ]
      .filter(Boolean)
      .join(" ");
  }

  // 2) Else fall back to timeline window
  if (bestTimeline) {
    const strength = scoreGenericWindow(topic, bestTimeline, null);
    const bar = strengthBar(strength);

    return [
      `${fmtRange(bestTimeline.from, bestTimeline.to)} is a key phase for ${topic}.`,
      `Strength: ${strength}/5 ${bar}`,
      bestTimeline.blurb ? `Theme: ${bestTimeline.blurb.trim().replace(/\s+/g, " ")}` : null,
      bestTimeline.adLord ? `Active sub-lord: ${bestTimeline.adLord}.` : null,
    ]
      .filter(Boolean)
      .join(" ");
  }

  // 3) If no future window, anchor to current AD
  const runningSubLord =
    report?.activePeriods?.antardasha?.subLord || "your current sub-lord";

  return `No specific future window tagged, but ${runningSubLord} is setting the tone. Watch the next sub-lord change for the next real shift in ${topic}.`;
}
type Tone =
  | "strategist"      // timing + decision clarity
  | "coach"           // motivation + step-by-step
  | "calm_protector"  // health/anxiety sensitive
  | "practical"       // purchases, logistics, money hygiene
  | "direct";         // crisp, no fluff

type Depth = "quick" | "standard" | "premium";
type FormatTier = "micro" | "standard" | "premium";
function hasLowConfidenceSignal(text: string): boolean {
  const q = text.toLowerCase();

  return (
    // uncertainty / doubt
    /\b(should i|should i be|is it right|is it wrong|am i doing|am i on the right|what if|what should i do)\b/.test(q) ||

    // anxiety / instability
    /\b(confused|stuck|lost|unsure|anxious|worried|scared|afraid|overthinking)\b/.test(q) ||

    // life-direction signals
    /\b(change|switch|leave|quit|move on|next step|future|path|direction)\b/.test(q)
  );
}

function pickFormatTier(question: string): FormatTier {
  const q = question.toLowerCase();
  if (
    q.includes("how's my day") ||
    q.includes("how is my day") ||
    q.includes("how is today looking") ||
    q.includes("what should i focus on today") ||
    q.includes("what is today good for")
  ) {
    return "standard";
  }
  // emotional / uncertainty → premium
  if (hasLowConfidenceSignal(q)) {
    return "premium";
  }

  // decision or timing → premium
  if (
    /(when|should i|can i|is it good|is it right|start|change|switch|resign|quit|business)/.test(q)
  ) {
    return "premium";
  }

  // small lifestyle questions
  if (
    /(what color|what should i wear|what to eat|eat today|diet)/.test(q)
  ) {
    return "micro";
  }

  return "standard";
}

function pickToneAndDepth(question: string, topic?: string): { tone: Tone; depth: Depth } {
  const q = (question || "").toLowerCase();

  // Depth (paid default = premium unless user asks short)
  const wantsQuick =
    /\b(short|brief|quick|one line|in 1 sentence|tldr)\b/.test(q);

  const depth: Depth = wantsQuick ? "quick" : "premium";

  // Tone by topic + keywords
  const isHealth = topic === "health" || /\b(health|sick|pain|stress|anxiety|panic|sleep)\b/.test(q);
  if (isHealth) return { tone: "calm_protector", depth };

  const isRelationship =
    topic === "relationships" || topic === "marriage" || /\b(relationship|marriage|love|breakup|fight)\b/.test(q);
  if (isRelationship) return { tone: "coach", depth };

  const isTiming =
    /\b(when|timing|date|month|window|should i|switch|change|job|offer|promotion)\b/.test(q);
  if (isTiming) return { tone: "strategist", depth };

  const isPractical =
    /\b(buy|purchase|vehicle|property|loan|rent|invest|money|finance|budget)\b/.test(q);
  if (isPractical) return { tone: "practical", depth };

  return { tone: "direct", depth };
}

function ensurePremiumMeat(answer: string, extras: {
  nowLabel?: string;
  windows?: Array<{ fromISO?: string; toISO?: string; label?: string; why?: string[]; do?: string[] }>;
}): string {
  let out = (answer || "").trim();
  if (!out) return out;

  const hasActionPlan = /7\s*day|30\s*day|90\s*day/i.test(out);
  const hasRisks = /risk|avoid/i.test(out);
  const hasTiming = /timing|window|from|to|oct|nov|202/i.test(out);

  const w = (extras.windows || []).slice(0, 3).map((x) => {
    const range = `${x.fromISO || "?"} → ${x.toISO || "?"}`;
    const label = x.label || "Window";
    return `- ${label}: ${range}`;
  });

  // If the model forgot key paid sections, we append cleanly.
  if (!hasTiming && w.length) {
    out += `\n\nTiming (next windows)\n${w.join("\n")}`;
  }

  if (!hasActionPlan) {
    out += `\n\nAction plan\n- Next 7 days: tidy your basics (CV/portfolio, referrals, shortlist).\n- Next 30 days: run 6–10 high-quality applications + 2 warm intros weekly.\n- Next 90 days: commit to one skill upgrade + interview reps + negotiation prep.`;
  }

  if (!hasRisks) {
    out += `\n\nRisks to avoid\n- Big decisions in frustration.\n- Comparing your pace to others.\n- Overthinking instead of executing weekly steps.`;
  }

  if (extras.nowLabel && !out.toLowerCase().includes(extras.nowLabel.toLowerCase())) {
    out += `\n\nCurrent timing\n- ${extras.nowLabel}`;
  }

  return out;
}


/* --------------------------------------------------
   Evidence / Why section
-------------------------------------------------- */
function titleFromDomain(domain: AskSarathiDomain): string {
  switch (domain) {
    case "career":
      return "Career Guidance";
    case "money":
      return "Money Guidance";
    case "relationships":
      return "Relationship Guidance";
    case "marriage":
      return "Marriage Guidance";
    case "health":
      return "Health Guidance";
    case "property":
      return "Property Guidance";
    case "vehicle":
      return "Vehicle Guidance";
    case "disputes":
      return "Dispute Guidance";
    case "inner":
      return "";
    default:
      return "";
  }
}

function verdictTypeFromSignals(opts: {
  hasTiming: boolean;
  windows: AskSarathiTimingWindow[];
  distressed: boolean;
  questionType: AskSarathiQuestionType;
}): AskSarathiVerdictType {
  const first = opts.windows[0];

  if (first?.strength === "Strong") return "favorable";
  if (first?.strength === "Supportive") return "supportive";
  if (first?.strength === "Caution") return "caution";

  if (opts.questionType === "timing" && !opts.hasTiming) return "needs_patience";
  if (opts.distressed) return "needs_patience";

  return "mixed";
}

function confidenceFromSignals(opts: {
  mode: "personalized" | "generic";
  evidenceCount: number;
  hasTiming: boolean;
  windows: AskSarathiTimingWindow[];
}): { level: AskSarathiConfidence; reason: string } {
  if (
    opts.mode === "personalized" &&
    opts.hasTiming &&
    opts.evidenceCount >= 2 &&
    opts.windows.length > 0
  ) {
    return {
      level: "High",
      reason: "Current timing and supporting chart signals are both available.",
    };
  }

  if (
    opts.mode === "personalized" &&
    (opts.hasTiming || opts.evidenceCount >= 1)
  ) {
    return {
      level: "Medium",
      reason: "The answer is personalized, but the timing picture is only partly defined.",
    };
  }

  return {
    level: "Low",
    reason: "This answer is based on limited timing evidence or general context.",
  };
}

function followUpsFor(domain: AskSarathiDomain, questionType: AskSarathiQuestionType): string[] {
  if (questionType === "timing") {
    return [
      "Show me the next 90-day window.",
      "Tell me the caution period too.",
      "Break this into next 30, 60, and 90 days.",
    ];
  }

  if (questionType === "comparison") {
    return [
      "Compare option A vs option B more directly.",
      "Which path is safer right now?",
      "Which option has better long-term growth?",
    ];
  }

  if (questionType === "diagnosis") {
    return [
      "Why does this phase feel like this emotionally?",
      "What lesson is active right now?",
      "What behaviour helps most in this phase?",
    ];
  }

  if (questionType === "remedy") {
    return [
      "Give me practical remedies only.",
      "What should I avoid strengthening right now?",
      "Keep the remedies aligned to my current dasha.",
    ];
  }

  if (questionType === "emotional_support") {
    return [
      "What is this phase trying to teach me?",
      "How do I stabilize myself right now?",
      "What should I stop forcing?",
    ];
  }

  switch (domain) {
    case "career":
      return [
        "Show me the next job-change window.",
        "Compare staying vs switching.",
        "What type of role suits this phase best?",
      ];
    case "money":
      return [
        "Is this better for saving or investing?",
        "Show me the next stronger money window.",
        "What money mistakes should I avoid now?",
      ];
    case "relationships":
    case "marriage":
      return [
        "Is this a repair phase or a commitment phase?",
        "What should I avoid in communication now?",
        "Show me the next relationship-supportive window.",
      ];
    case "health":
      return [
        "What should I prioritize this week for stability?",
        "What lifestyle mistake is hurting this phase?",
        "How do I protect energy right now?",
      ];
    default:
      return [
        "Show me the next 90-day pattern.",
        "Tell me what to focus on now.",
        "What should I avoid in this phase?",
      ];
  }
}
function buildDomainVerdictLine(opts: {
  topic: AskSarathiDomain;
  verdictType: AskSarathiVerdictType;
  routeFamily?: AskSarathiQuestionFamily;
}): string {
  const { topic, verdictType, routeFamily = "generic" } = opts;

  const isTimingLike =
    routeFamily === "timing" ||
    routeFamily === "prediction" ||
    routeFamily === "comparison";

  const isDecisionLike = routeFamily === "decision";
  
  const isEmotionalLike = routeFamily === "emotional_support";
 if (routeFamily === "diagnosis") {
  return "Pressure is building faster than visible movement.";
}
  if (topic === "career") {
    if (verdictType === "favorable") {
      return isTimingLike
        ? "Yes — career movement looks favorable, and the current phase can support visible progress, role movement, or a stronger opening."
        : "Yes — this phase supports meaningful career movement, especially through visibility, readiness, and disciplined action.";
    }
    if (verdictType === "supportive") {
      return isDecisionLike
        ? "Yes — career movement is possible now, but it should be done selectively and with a practical strategy."
        : "Yes — career movement is possible now, and the current phase is supportive enough for positioning, outreach, and steady forward action.";
    }
    if (verdictType === "mixed") {
      return "Career movement is possible, but this phase looks mixed — better for selective progress and better positioning than an impulsive leap.";
    }
    if (verdictType === "caution") {
      return "Career matters should be handled carefully right now. This phase is better for preparation, review, and measured action than a rushed jump.";
    }
    if (verdictType === "needs_patience") {
      return "This is more of a career-positioning phase than a clean breakthrough phase right now, so patience and preparation matter.";
    }
    if (verdictType === "not_advised") {
      return "This is not a strong phase for forcing a career move right now.";
    }
  }

  if (topic === "marriage") {
    if (verdictType === "favorable") {
      return "Yes — marriage or formal commitment timing looks favorable, provided the emotional and practical factors are both aligned.";
    }
    if (verdictType === "supportive") {
      return "Yes — relationship or marriage movement is visible, but this phase favors sincerity, clarity, and seriousness over rushing.";
    }
    if (verdictType === "mixed") {
      return "Marriage-related movement is possible, but the phase looks mixed — more supportive for clarity and alignment than a forced commitment.";
    }
    if (verdictType === "caution") {
      return "This is not the cleanest phase for forcing marriage decisions. Move carefully and judge stability before commitment.";
    }
    if (verdictType === "needs_patience") {
      return "This phase is better for understanding readiness and compatibility than pushing for a final marriage outcome immediately.";
    }
    if (verdictType === "not_advised") {
      return "This is not a strong phase for forcing marriage decisions right now.";
    }
  }

  if (topic === "relationships") {
    if (verdictType === "favorable") {
      return "Yes — relationship movement looks favorable, especially where sincerity, honesty, and emotional maturity are present.";
    }
    if (verdictType === "supportive") {
      return "Yes — relationship progress is possible now, though it works better through calm clarity than emotional pressure.";
    }
    if (verdictType === "mixed") {
      return "Relationship movement is possible, but mixed signals are present, so this phase is better for clarity than force.";
    }
    if (verdictType === "caution") {
      return "Relationship matters need careful handling right now. Do not force certainty where the phase still looks unstable.";
    }
    if (verdictType === "needs_patience") {
      return "This is more of a relationship-understanding phase than a clean emotional breakthrough phase right now.";
    }
    if (verdictType === "not_advised") {
      return "This is not a strong phase for forcing relationship decisions right now.";
    }
  }

  if (topic === "money") {
    if (verdictType === "favorable") {
      return "Yes — the chart supports money movement, growth, or a stronger financial opening, provided decisions stay grounded.";
    }
    if (verdictType === "supportive") {
      return "Yes — financial movement is possible now, especially through steady planning, structured action, and intelligent restraint.";
    }
    if (verdictType === "mixed") {
      return "Money movement is possible, but this phase is mixed — better for correction and structure than dramatic risk.";
    }
    if (verdictType === "caution") {
      return "Financial decisions need caution right now. This phase is better for control, discipline, and review than bold experimentation.";
    }
    if (verdictType === "needs_patience") {
      return "This is more of a financial-structuring phase than a clean gain window right now.";
    }
    if (verdictType === "not_advised") {
      return "This is not a strong phase for forcing big money decisions right now.";
    }
  }

  if (topic === "property") {
    if (verdictType === "favorable") {
      return "Yes — property or home-related movement looks favorable, provided the decision is supported by practical readiness.";
    }
    if (verdictType === "supportive") {
      return "Yes — this phase is usable for property planning or movement, but decisions should still be made carefully and cleanly.";
    }
    if (verdictType === "mixed") {
      return "Property movement is possible, but this phase is mixed — better for planning, research, and paperwork than a rushed commitment.";
    }
    if (verdictType === "caution") {
      return "Property decisions should be handled carefully right now. This phase favors preparation more than pressure-based commitment.";
    }
    if (verdictType === "needs_patience") {
      return "This is more of a property-planning phase than a clean finalization window right now.";
    }
    if (verdictType === "not_advised") {
      return "This is not a strong phase for forcing a major property decision right now.";
    }
  }

  if (topic === "vehicle") {
    if (verdictType === "favorable") {
      return "Yes — a vehicle-related move or purchase can be supported now, provided it is matched by practical readiness.";
    }
    if (verdictType === "supportive") {
      return "Yes — this phase is usable for vehicle decisions, but it is better for intelligent timing than emotional impulse.";
    }
    if (verdictType === "mixed") {
      return "Vehicle movement is possible, but this phase is mixed — better for comparison and planning than impulsive purchase.";
    }
    if (verdictType === "caution") {
      return "Vehicle decisions should be handled carefully right now. Avoid buying just to release restlessness or pressure.";
    }
    if (verdictType === "needs_patience") {
      return "This is more of a vehicle-planning phase than a clean purchase window right now.";
    }
    if (verdictType === "not_advised") {
      return "This is not a strong phase for forcing a vehicle decision right now.";
    }
  }

  if (topic === "health") {
    if (verdictType === "favorable") {
      return "Yes — improvement is possible, and the chart supports stabilizing the body and routine more effectively in this phase.";
    }
    if (verdictType === "supportive") {
      return "Yes — health improvement is possible now, especially through routine, consistency, and not overloading yourself.";
    }
    if (verdictType === "mixed") {
      return "Improvement is possible, but the phase is mixed — better for stabilization and correction than expecting instant recovery.";
    }
    if (verdictType === "caution") {
      return "Health needs careful handling right now. This phase rewards rest, discipline, and body awareness more than pushing through.";
    }
    if (verdictType === "needs_patience") {
      return "This is more of a stabilization phase than a dramatic recovery phase right now.";
    }
    if (verdictType === "not_advised") {
      return "This is not a strong phase for ignoring body signals or forcing extreme changes right now.";
    }
  }

  if (topic === "inner") {
    if (verdictType === "favorable") {
      return "Yes — this phase can bring meaningful inner clarity and a stronger sense of direction, if you work with it consciously.";
    }
    if (verdictType === "supportive") {
      return "Yes — inner movement is possible now, though it may come through slow clarity rather than dramatic external change.";
    }
    if (verdictType === "mixed") {
      return "This phase is mixed internally — it can still bring insight, but not through force or over-control.";
    }
    if (verdictType === "caution") {
      return "This phase needs patience and reflection. Avoid forcing meaning when the lesson is still unfolding.";
    }
    if (verdictType === "needs_patience") {
      return "This is more of an inner-reset phase than a fast external breakthrough.";
    }
    if (verdictType === "not_advised") {
      return "This is not a strong phase for forcing certainty about everything right now.";
    }
  }

 
if (routeFamily === "timing" && topic === "generic") {
  return "Yes — the phase does shift over time, but improvement usually appears gradually as the current timing cycle matures rather than through an overnight change.";
}

  if (isEmotionalLike) {
    return "What you are feeling is connected to a real phase pattern in the chart, and it should be handled with steadiness rather than fear.";
  }

  const defaultMap: Record<AskSarathiVerdictType, string> = {
    favorable: "Yes — this is a favorable phase to move ahead, provided you act with discipline.",
    supportive: "Yes — selective movement is possible now, and the current phase is supportive enough to act intelligently.",
    mixed: "Yes — movement is possible, but this phase is better for selective action than a rushed leap.",
    caution: "You can move, but carefully — this timing rewards restraint and measured judgment more than force.",
    not_advised: "This is not a strong phase for forcing this move right now.",
    needs_patience: "This phase is better for positioning and selective progress than a forced final move right now.",
  };

  return defaultMap[verdictType];
}
function buildDomainActionGuidance(opts: {
  topic: AskSarathiDomain;
  questionType: AskSarathiQuestionType;
  routeFamily?: AskSarathiQuestionFamily;
  timingDirective: string;
  windowDo?: string[];
  windowAvoid?: string[];
}): { actions: string[]; avoid: string[] } {
  const {
    topic,
    questionType,
    routeFamily = "generic",
    timingDirective,
    windowDo = [],
    windowAvoid = [],
  } = opts;

  if (windowDo.length || windowAvoid.length) {
    return {
      actions: windowDo.length
        ? windowDo.slice(0, 3)
        : [timingDirective, "Use the current phase with steady judgment."],
      avoid: windowAvoid.length
        ? windowAvoid.slice(0, 3)
        : ["Avoid forcing outcomes before timing becomes cleaner."],
    };
  }

  if (topic === "career") {
    return {
      actions: [
        timingDirective,
        "Improve visibility, outreach, and role-readiness instead of waiting passively.",
        "Take practical steps that increase interview, promotion, or movement probability.",
      ],
      avoid: [
        "Avoid resigning purely from frustration.",
        "Avoid confusing slow progress with no progress.",
        "Avoid scattered effort without a clear career direction.",
      ],
    };
  }

  if (topic === "marriage") {
    return {
      actions: [
        timingDirective,
        "Use this phase to judge seriousness, emotional clarity, and long-term fit.",
        "Let commitment grow through clarity rather than pressure.",
      ],
      avoid: [
        "Avoid rushing marriage decisions because of fear or age pressure alone.",
        "Avoid reading temporary emotional movement as permanent certainty.",
        "Avoid forcing a final outcome before stability is visible.",
      ],
    };
  }

  if (topic === "relationships") {
    return {
      actions: [
        timingDirective,
        "Focus on honesty, emotional steadiness, and quality of interaction.",
        "Let communication reveal what is sustainable.",
      ],
      avoid: [
        "Avoid emotional overreaction to mixed signals.",
        "Avoid forcing clarity from someone who is still inconsistent.",
        "Avoid confusing chemistry with stability.",
      ],
    };
  }

  if (topic === "money") {
    return {
      actions: [
        timingDirective,
        "Use the phase for structure, cash discipline, and intelligent financial planning.",
        "Prefer measured decisions over dramatic money moves.",
      ],
      avoid: [
        "Avoid impulsive financial risks.",
        "Avoid overcommitting because of short-term optimism.",
        "Avoid using money decisions to escape emotional pressure.",
      ],
    };
  }

  if (topic === "property") {
    return {
      actions: [
        timingDirective,
        "Use this phase for research, paperwork, financial readiness, and practical comparison.",
        "Move when the foundation feels stable, not just emotionally attractive.",
      ],
      avoid: [
        "Avoid rushed property commitment.",
        "Avoid ignoring funding, paperwork, or long-term stability concerns.",
        "Avoid taking a major home decision only to release restlessness.",
      ],
    };
  }

  if (topic === "vehicle") {
    return {
      actions: [
        timingDirective,
        "Use this phase to compare options, budget properly, and judge practical need.",
        "Treat purchase timing as a decision of readiness, not only desire.",
      ],
      avoid: [
        "Avoid impulse buying.",
        "Avoid using a vehicle purchase as an emotional release.",
        "Avoid stretching finances for appearance or urgency.",
      ],
    };
  }

  if (topic === "health") {
    return {
      actions: [
        timingDirective,
        "Protect routine, recovery, sleep, and consistency.",
        "Use the phase to stabilize energy before expecting big performance.",
      ],
      avoid: [
        "Avoid ignoring body signals.",
        "Avoid extreme routines started from anxiety.",
        "Avoid treating exhaustion as weakness instead of data.",
      ],
    };
  }

  if (topic === "inner") {
    return {
      actions: [
        timingDirective,
        "Use this phase for reflection, simplification, and regaining direction.",
        "Let clarity come through steady observation and honest self-review.",
      ],
      avoid: [
        "Avoid forcing instant meaning from a slow inner phase.",
        "Avoid assuming delay means failure.",
        "Avoid filling uncertainty with panic decisions.",
      ],
    };
  }

  if (routeFamily === "diagnosis") {
  return {
    actions: [
      timingDirective,
      "Treat this phase as a restructuring period rather than a permanent blockage.",
      "Focus on correcting patterns and strengthening foundations so the next timing window can work fully.",
    ],
    avoid: [
      "Avoid assuming delay means failure.",
      "Avoid reacting to temporary stagnation with drastic decisions.",
      "Avoid comparing your timing with someone else's life path.",
    ],
  };
}

  if (routeFamily === "emotional_support") {
    return {
      actions: [
        timingDirective,
        "Slow the pace enough to hear what the phase is really doing.",
        "Protect your energy and return to one or two stabilizing routines.",
      ],
      avoid: [
        "Avoid fear-based conclusions.",
        "Avoid comparing your timeline to others.",
        "Avoid interpreting a heavy phase as proof that nothing is working.",
      ],
    };
  }

  return {
    actions: [
      timingDirective,
      "Keep your next step realistic and specific.",
      "Use this phase for clarity and steady movement.",
    ],
    avoid: [
      "Avoid making decisions only from frustration.",
      "Avoid comparing your pace with someone else’s timing.",
      "Avoid forcing certainty where the phase still needs observation.",
    ],
  };
}
function interpretTransitTrigger(trigger?: string): string | null {
  const t = String(trigger || "").toLowerCase();

  if (t.includes("mars")) {
    return "Mars activation often increases urgency, restlessness, competitiveness, or impatience. It pushes action but can also create friction if handled impulsively.";
  }

  if (t.includes("saturn")) {
    return "Saturn activation tends to bring pressure, responsibility, delays, or a feeling of heaviness. It usually indicates a period of discipline and structural correction.";
  }

  if (t.includes("rahu")) {
    return "Rahu activation often amplifies ambition, uncertainty, or mental restlessness. It can create sudden opportunities but also confusion if clarity is weak.";
  }

  if (t.includes("ketu")) {
    return "Ketu activation can create detachment, withdrawal, or internal questioning. It often pushes people toward reflection rather than external expansion.";
  }

  if (t.includes("venus")) {
    return "Venus activation increases attention toward relationships, comfort, beauty, and emotional harmony.";
  }

  if (t.includes("jupiter")) {
    return "Jupiter activation often expands opportunity, learning, and growth, but it works best when discipline supports the expansion.";
  }

  if (t.includes("mercury")) {
    return "Mercury activation increases thinking, communication, planning, and decision activity.";
  }

  if (t.includes("sun")) {
    return "Sun activation highlights identity, leadership, authority issues, and visibility.";
  }

  if (t.includes("moon")) {
    return "Moon activation heightens emotional sensitivity, mood fluctuation, and responsiveness to surrounding situations.";
  }

  return null;
}
function buildMultiTransitNarrative(bestTransit: any[]): string | null {
  if (!Array.isArray(bestTransit) || bestTransit.length === 0) return null;

  const top = bestTransit.slice(0, 3);

  const names = top
    .map((w) => String(w?.driver || w?.summary || "").toLowerCase())
    .join(" | ");

  const hasMars = names.includes("mars");
  const hasSaturn = names.includes("saturn");
  const hasJupiter = names.includes("jupiter");
  const hasVenus = names.includes("venus");
  const hasMercury = names.includes("mercury");
  const hasRahu = names.includes("rahu");
  const hasKetu = names.includes("ketu");
  const hasMoon = names.includes("moon");
  const hasSun = names.includes("sun");

  if (hasSaturn && hasJupiter) {
    return "Saturn is adding pressure and seriousness, while Jupiter is still trying to open growth, support, or expansion. This usually creates a phase where progress is possible, but only through maturity and disciplined action.";
  }

  if (hasMars && hasVenus) {
    return "Mars is increasing action and urgency, while Venus is softening the tone through relationships, comfort, or harmony. This can create a push-pull between force and ease.";
  }

  if (hasRahu && hasMercury) {
    return "Rahu is amplifying urgency or ambition, while Mercury is increasing mental activity, planning, and analysis. This can make the phase feel mentally busy, sharp, and slightly restless.";
  }

  if (hasSaturn && hasMoon) {
    return "Saturn is adding emotional heaviness or responsibility, while Moon-linked sensitivity makes the phase feel more personal internally. This often feels like pressure that lands emotionally as well as practically.";
  }

  if (hasSun && hasSaturn) {
    return "Sun is highlighting visibility, identity, or authority, while Saturn is testing endurance and responsibility. This often brings a phase of being seen more, but also judged more seriously.";
  }

  if (hasMars && hasMercury) {
    return "Mars is pushing speed and decisive movement, while Mercury is increasing thought, communication, and planning. This can feel productive, but it can also create sharpness or impatience in speech and decisions.";
  }

  if (hasKetu && hasMoon) {
    return "Ketu is pulling energy inward and cutting attachment, while Moon sensitivity makes the emotional experience feel quieter, more detached, or more introspective than usual.";
  }

  return null;
}
function interpretPlanetInNatalChart(planet: string, report?: any): string | null {
  if (!planet || !report?.planets) return null;

  const p = String(planet).toLowerCase();

  const natal = report.planets.find(
    (pl: any) => String(pl?.name || "").toLowerCase() === p
  );

  if (!natal) return null;

  const house = natal.house;
  const sign = natal.sign;

  if (!house) return null;

  const areaMap: Record<number, string> = {
    1: "identity, self-direction, and how you show up in life",
    2: "money, speech, and family stability",
    3: "effort, communication, and initiative",
    4: "home, emotional security, and inner comfort",
    5: "creativity, romance, and personal expression",
    6: "work routines, service, and daily pressure",
    7: "relationships, agreements, and partnerships",
    8: "deep change, vulnerability, and psychological transformation",
    9: "beliefs, learning, and long-distance perspective",
    10: "career direction, reputation, and public role",
    11: "goals, networks, and long-term aspirations",
    12: "rest, retreat, and subconscious processing",
  };

  const area = areaMap[house] || "important life areas";

  return `${planet} in your natal chart sits in the ${house} house (${sign}), which means its activation often shows up through ${area}.`;
}
function interpretDegreeTrigger(hit?: any): string | null {
  if (!hit || typeof hit !== "object") return null;

  const orb =
    typeof hit?.orb === "number"
      ? hit.orb
      : typeof hit?.distanceDeg === "number"
      ? hit.distanceDeg
      : typeof hit?.deltaDeg === "number"
      ? hit.deltaDeg
      : null;

  const phaseRaw = String(
    hit?.phase ?? hit?.motionPhase ?? hit?.approachState ?? ""
  )
    .trim()
    .toLowerCase();

  const target =
    String(
      hit?.target ??
      hit?.targetLabel ??
      hit?.natalPoint ??
      hit?.point ??
      ""
    ).trim();

  const planet =
    String(
      hit?.planet ??
      hit?.transitPlanet ??
      hit?.driver ??
      ""
    ).trim();

  if (!planet && !target && orb == null && !phaseRaw) return null;

  const subject =
    [planet, target].filter(Boolean).join(" → ") || "This transit";

  const orbText =
    orb == null
      ? ""
      : orb <= 1
      ? `The orb is very tight (${orb.toFixed(2)}°), so the effect is stronger than usual.`
      : orb <= 2
      ? `The orb is fairly tight (${orb.toFixed(2)}°), so the trigger is active and noticeable.`
      : orb <= 3
      ? `The orb is moderate (${orb.toFixed(2)}°), so the trigger is present but not yet at maximum strength.`
      : `The orb is wider (${orb.toFixed(2)}°), so this acts more like a background influence than an exact spike.`;

  let phaseText = "";
  if (phaseRaw.includes("approach") || phaseRaw.includes("applying")) {
    phaseText = `${subject} is still approaching exactness, so the pressure or theme may keep building.`;
  } else if (phaseRaw.includes("exact")) {
    phaseText = `${subject} is at or near exact activation, which usually makes the theme feel strongest right now.`;
  } else if (phaseRaw.includes("separat") || phaseRaw.includes("reced")) {
    phaseText = `${subject} is separating from exactness, so the lesson may still be present, but the peak pressure is likely easing.`;
  }

  return [phaseText, orbText].filter(Boolean).join(" ");
}
function buildProfessionAnswerHint(professionFacts: any): string {
  const roles = Array.isArray(professionFacts?.likelyRoles)
    ? professionFacts.likelyRoles.slice(0, 3)
    : [];

  const domains = Array.isArray(professionFacts?.likelyDomains)
    ? professionFacts.likelyDomains.slice(0, 3)
    : [];

  const confidence = Number(professionFacts?.confidence ?? 0);

  const parts: string[] = [];

  if (roles.length) {
    parts.push(`Top likely roles: ${roles.join(", ")}.`);
  }

  if (domains.length) {
    parts.push(`Top likely domains: ${domains.join(", ")}.`);
  }

  parts.push(`Confidence: ${confidence}/100.`);

  if (professionFacts?.serviceVsBusiness) {
    parts.push(`Service vs business: ${professionFacts.serviceVsBusiness}.`);
  }

  if (professionFacts?.publicVsBackend) {
    parts.push(`Public vs backend: ${professionFacts.publicVsBackend}.`);
  }

  return parts.join(" ");
}
function detectPressurePattern(
  report: any,
  strongestTransit: any,
  dasha: any
): string | null {

  const driver = String(
    strongestTransit?.driver ??
    strongestTransit?.planet ??
    ""
  ).toLowerCase();

  const target = String(
    strongestTransit?.target ??
    strongestTransit?.targetLabel ??
    ""
  ).toLowerCase();

  const md = String(dasha?.md ?? "").toLowerCase();
  const ad = String(dasha?.ad ?? "").toLowerCase();

  if (driver.includes("mars") && target.includes("moon")) {
    return "Mars activating your Moon can create emotional restlessness and impatience, which often makes life feel blocked even when movement is building underneath.";
  }

  if (driver.includes("saturn") && target.includes("moon")) {
    return "Saturn influencing the Moon often creates emotional heaviness or responsibility pressure, which can make progress feel slower than it actually is.";
  }

  if (md === "rahu" || ad === "rahu") {
    return "Rahu phases often create periods where direction feels uncertain while new ambitions are forming, which can temporarily feel like stagnation.";
  }

  if (driver.includes("saturn")) {
    return "Saturn periods frequently slow external progress so that structure and discipline can rebuild underneath.";
  }

  return null;
}
const dignityMap: Record<string, { exalt?: string; debil?: string; own?: string[] }> = {
  sun: { exalt: "aries", debil: "libra", own: ["leo"] },
  moon: { exalt: "taurus", debil: "scorpio", own: ["cancer"] },
  mars: { exalt: "capricorn", debil: "cancer", own: ["aries", "scorpio"] },
  mercury: { exalt: "virgo", debil: "pisces", own: ["gemini", "virgo"] },
  jupiter: { exalt: "cancer", debil: "capricorn", own: ["sagittarius", "pisces"] },
  venus: { exalt: "pisces", debil: "virgo", own: ["taurus", "libra"] },
  saturn: { exalt: "libra", debil: "aries", own: ["capricorn", "aquarius"] },
};
function interpretPlanetDignity(planet: string, report?: any): string | null {
  if (!planet || !report?.planets) return null;

  const p = String(planet).toLowerCase();

  const natal = report.planets.find(
    (pl: any) => String(pl?.name || "").toLowerCase() === p
  );

  if (!natal?.sign) return null;

  const sign = String(natal.sign).toLowerCase();

  const dignity = dignityMap[p];
  if (!dignity) return null;

  if (dignity.exalt === sign) {
    return `${planet} operates with strong natural dignity in ${sign}, which often makes its themes clearer and more effective in your life.`;
  }

  if (dignity.debil === sign) {
    return `${planet} operates with reduced strength in ${sign}, so its themes sometimes require extra patience, maturity, or conscious handling.`;
  }

  if (dignity.own?.includes(sign)) {
    return `${planet} sits in its own sign (${sign}), which generally allows it to express its natural qualities more comfortably in your chart.`;
  }

  return null;
}
const houseLordMap: Record<string, Record<string, number[]>> = {
  aries: {
    mars: [1],
    venus: [2, 7],
    mercury: [3, 6],
    moon: [4],
    sun: [5],
    jupiter: [9, 12],
    saturn: [10, 11],
  },

  taurus: {
    venus: [1, 6],
    mercury: [2, 5],
    moon: [3],
    sun: [4],
    mars: [7, 12],
    jupiter: [8, 11],
    saturn: [9, 10],
  },

  gemini: {
    mercury: [1, 4],
    moon: [2],
    sun: [3],
    venus: [5, 12],
    mars: [6, 11],
    jupiter: [7, 10],
    saturn: [8, 9],
  },

  cancer: {
    moon: [1],
    sun: [2],
    mercury: [3, 12],
    venus: [4, 11],
    mars: [5, 10],
    jupiter: [6, 9],
    saturn: [7, 8],
  },

  leo: {
    sun: [1],
    mercury: [2, 11],
    venus: [3, 10],
    mars: [4, 9],
    jupiter: [5, 8],
    saturn: [6, 7],
  },

  virgo: {
    mercury: [1, 10],
    venus: [2, 9],
    mars: [3, 8],
    jupiter: [4, 7],
    saturn: [5, 6],
    moon: [11],
    sun: [12],
  },

  libra: {
    venus: [1, 8],
    mars: [2, 7],
    jupiter: [3, 6],
    saturn: [4, 5],
    mercury: [9, 12],
    moon: [10],
    sun: [11],
  },

  scorpio: {
    mars: [1, 6],
    jupiter: [2, 5],
    saturn: [3, 4],
    venus: [7, 12],
    mercury: [8, 11],
    moon: [9],
    sun: [10],
  },

  sagittarius: {
    jupiter: [1, 4],
    saturn: [2, 3],
    venus: [6, 11],
    mercury: [7, 10],
    moon: [8],
    sun: [9],
    mars: [5, 12],
  },

  capricorn: {
    saturn: [1, 2],
    jupiter: [3, 12],
    mars: [4, 11],
    venus: [5, 10],
    mercury: [6, 9],
    moon: [7],
    sun: [8],
  },

  aquarius: {
    saturn: [1, 12],
    jupiter: [2, 11],
    mars: [3, 10],
    venus: [4, 9],
    mercury: [5, 8],
    moon: [6],
    sun: [7],
  },

  pisces: {
    jupiter: [1, 10],
    mars: [2, 9],
    venus: [3, 8],
    mercury: [4, 7],
    moon: [5],
    sun: [6],
    saturn: [11, 12],
  },
};

function interpretHouseLordRole(planet: string, report?: any): string | null {
  if (!planet || !report?.ascendantSign) return null;

  const asc = String(report.ascendantSign).toLowerCase();
  const p = String(planet).toLowerCase();

  const lordData = houseLordMap[asc]?.[p];
  if (!lordData || !lordData.length) return null;

  const houseMeaning: Record<number, string> = {
    1: "identity and personal direction",
    2: "money, speech, and family stability",
    3: "effort, courage, and communication",
    4: "home, emotional security, and inner comfort",
    5: "creativity, romance, and intelligence",
    6: "work routines, pressure, and competition",
    7: "relationships and agreements",
    8: "deep change, vulnerability, and transformation",
    9: "beliefs, luck, and higher learning",
    10: "career direction and public reputation",
    11: "goals, networks, and gains",
    12: "rest, retreat, and subconscious processing",
  };

  const houseDescriptions = lordData
    .map((h) => houseMeaning[h])
    .filter(Boolean);

  if (!houseDescriptions.length) return null;

  return `${planet} rules ${lordData
    .map((h) => `${h}${h === 1 ? "st" : h === 2 ? "nd" : h === 3 ? "rd" : "th"}`)
    .join(" and ")} houses in your chart, so when it activates it often influences ${houseDescriptions.join(
    " and "
  )}.`;
}
function pickDegreeAwareTransit(report: any, strongestTransit: any): any | null {
  if (!report || typeof report !== "object") return null;

  const pools: any[] = [];

  if (Array.isArray(report?.topTransits)) {
    pools.push(...report.topTransits);
  }
  if (Array.isArray(report?.transitHits)) {
    pools.push(...report.transitHits);
  }
  if (Array.isArray(report?.transitNowFactsDetailed)) {
    pools.push(...report.transitNowFactsDetailed);
  }

  if (!pools.length) return strongestTransit || null;

  const strongestDriver = String(
    strongestTransit?.driver ??
    strongestTransit?.planet ??
    strongestTransit?.title ??
    ""
  ).toLowerCase();

  if (!strongestDriver) {
    return pools[0] ?? strongestTransit ?? null;
  }

  const matched =
    pools.find((x) => {
      const hay = [
        x?.driver,
        x?.planet,
        x?.transitPlanet,
        x?.title,
        x?.target,
        x?.targetLabel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(strongestDriver);
    }) ?? null;

  return matched || strongestTransit || null;
}
function windowStrengthFromRiskFlag(flag?: string): AskSarathiWindowStrength {
  const f = String(flag || "").toLowerCase();
  if (f === "opportunity") return "Strong";
  if (f === "caution") return "Caution";
  if (f === "mixed") return "Mixed";
  return "Supportive";
}
function windowStrengthScore(flag?: string): number {
  const strength = windowStrengthFromRiskFlag(flag);
  if (strength === "Strong") return 4;
  if (strength === "Supportive") return 3;
  if (strength === "Mixed") return 2;
  if (strength === "Caution") return 1;
  return 0;
}
function fallbackWindowFromActivePeriod(
  report?: LifeReportLike | null,
  topic?: AskSarathiDomain
): AskSarathiTimingWindow | null {

  const act = getActiveDashaAnyShape(report);
  const md = act.md;
  const ad = act.ad;
  const pd = act.pd;

  const adEnd =
    report?.activePeriods?.antardasha?.end ||
    report?.activePeriods?.antardasha?.end ||
    undefined;

  if ((!md || md === "Unknown") && (!ad || ad === "Unknown") && (!pd || pd === "Unknown")) {
    return null;
  }

  const topicLabelMap: Record<AskSarathiDomain, string> = {
    career: "Career positioning phase",
    money: "Money structuring phase",
    relationships: "Relationship clarity phase",
    marriage: "Marriage timing phase",
    health: "Health stabilization phase",
    property: "Property planning phase",
    vehicle: "Vehicle planning phase",
    disputes: "Dispute management phase",
    inner: "Inner reset phase",
    generic: "Current active phase",
  };

  const why: string[] = [
    md && md !== "Unknown" ? `MD ${md} sets the main background.` : "",
    ad && ad !== "Unknown" ? `AD ${ad} sets the current working tone.` : "",
    pd && pd !== "Unknown" ? `PD ${pd} acts as the immediate trigger.` : "",
  ].filter(Boolean);

  const doMap: Record<AskSarathiDomain, string[]> = {
    career: [
      "Use this phase to improve visibility, outreach, and readiness.",
      "Take selective action instead of waiting passively.",
      "Prepare for a cleaner opening as timing strengthens.",
    ],
    money: [
      "Use this phase for planning, cash discipline, and selective decisions.",
      "Strengthen structure before taking major risk.",
      "Watch for practical openings rather than emotional moves.",
    ],
    relationships: [
      "Use this phase to improve clarity, honesty, and emotional steadiness.",
      "Focus on quality of interaction before forcing outcomes.",
      "Let timing reveal what is sustainable.",
    ],
    marriage: [
      "Use this phase to assess seriousness, timing, and compatibility.",
      "Avoid rushing because of pressure alone.",
      "Let clarity build before commitment.",
    ],
    health: [
      "Use this phase for consistency, routine, and recovery.",
      "Protect sleep, energy, and stress load.",
      "Build stability before expecting dramatic change.",
    ],
    property: [
      "Use this phase for research, paperwork, and timing assessment.",
      "Strengthen the foundation before final commitment.",
      "Move selectively, not emotionally.",
    ],
    vehicle: [
      "Use this phase for planning, budget clarity, and practical comparison.",
      "Check need versus impulse before purchase.",
      "Act when the path feels cleaner and better supported.",
    ],
    disputes: [
      "Use this phase for strategy, documentation, and controlled response.",
      "Avoid reacting from anger alone.",
      "Let timing support stronger positioning.",
    ],
    inner: [
      "Use this phase for reflection, simplification, and regaining direction.",
      "Let clarity grow through observation and steady action.",
      "Do not confuse transition with failure.",
    ],
    generic: [
      "Use this phase for steady preparation and selective action.",
      "Let timing build instead of forcing certainty.",
      "Stay ready for the next cleaner opening.",
    ],
  };

  const avoidMap: Record<AskSarathiDomain, string[]> = {
    career: ["Avoid quitting purely from frustration."],
    money: ["Avoid impulsive money moves."],
    relationships: ["Avoid forcing emotional certainty too quickly."],
    marriage: ["Avoid commitment from pressure rather than clarity."],
    health: ["Avoid neglecting body signals."],
    property: ["Avoid rushed commitment without clean readiness."],
    vehicle: ["Avoid buying just to release restlessness."],
    disputes: ["Avoid emotionally reactive escalation."],
    inner: ["Avoid assuming this phase means nothing is happening."],
    generic: ["Avoid forceful moves made from confusion."],
  };

  return {
    fromISO: undefined,
    toISO: adEnd || undefined,
    label: topicLabelMap[topic || "generic"],
    strength: "Supportive",
    why,
    do: doMap[topic || "generic"],
    avoid: avoidMap[topic || "generic"],
  };
}
function buildWhyEvidence(opts: {
  report?: LifeReportLike | null;
  topic: AskSarathiDomain;
})
 {

  const { report, topic } = opts;
  const bullets: string[] = [];
  if (!report) return bullets;

  const act = getActiveDashaAnyShape(report);

if (act.md !== "Unknown" || act.ad !== "Unknown" || act.pd !== "Unknown") {
  bullets.push(`Active dasha stack → MD ${act.md} • AD ${act.ad} • PD ${act.pd}`);
}


  const bestTransit = pickBestTransitWindows(report, topic);
  if (bestTransit.length) {
    for (const w of bestTransit.slice(0, 2)) {
      const toneText =
  w.riskFlag === "opportunity"
    ? "tone: opportunity-leaning"
    : w.riskFlag === "caution"
    ? "tone: caution/learning"
    : w.riskFlag === "mixed"
    ? "tone: balanced / mixed signals"
    : "";

bullets.push(
  `Transit window ${fmtRange(w.from, w.to)} → ${w.focusArea || "focus"}; driver: ${w.driver}${toneText ? `; ${toneText}` : ""}`
);

    }
  }

  const bestTimeline = pickFromTimeline(report, topic);
  if (bestTimeline) {
    bullets.push(
      `Dasha timeline ${fmtRange(bestTimeline.from, bestTimeline.to)} → AD ${bestTimeline.adLord}, PD ${bestTimeline.pdLord}${typeof bestTimeline.score === "number" ? `; score ${bestTimeline.score}` : ""}`
    );
  }

  const adLord = report?.activePeriods?.antardasha?.subLord;
const adEnd = report?.activePeriods?.antardasha?.end;

if (!bullets.length && adLord) {
  bullets.push(
    `Tone set by ${adLord} Antardasha${adEnd ? ` until ${fmtDateShort(adEnd)}.` : "."}`
  );
}


  return bullets;
}
function buildDomainAstroEvidence(opts: {
  topic: AskSarathiDomain;
  report?: any;
}): {
  natalFactors: string[];
  dashaFactors: string[];
  transitFactors: string[];
  synthesis: string[];
} {
  const { topic, report } = opts;

  const natalFactors: string[] = [];
  const dashaFactors: string[] = [];
  const transitFactors: string[] = [];
  const synthesis: string[] = [];
  
  const ascSign = report?.ascSign;
  if (ascSign) natalFactors.push(`Ascendant baseline: ${ascSign}.`);

  if (Array.isArray(report?.planets)) {
    const p = report.planets;
    const byName = (name: string) =>
      p.find((x: any) => String(x?.name || "").toLowerCase() === name.toLowerCase());

    const moon = byName("Moon");
    const venus = byName("Venus");
    const jupiter = byName("Jupiter");
    const mercury = byName("Mercury");
    const saturn = byName("Saturn");
    const mars = byName("Mars");

    if (topic === "career") {
      if (saturn?.house != null) natalFactors.push(`Natal Saturn links to house ${saturn.house}, adding responsibility and structure themes.`);
      if (mercury?.house != null) natalFactors.push(`Natal Mercury in house ${mercury.house} highlights communication, coordination, and role-fit decisions.`);
      if (jupiter?.house != null) natalFactors.push(`Natal Jupiter in house ${jupiter.house} shows where growth and opportunity can support career choices.`);
    }

    if (topic === "money") {
      if (venus?.house != null) natalFactors.push(`Natal Venus in house ${venus.house} influences comfort, value, and financial preferences.`);
      if (jupiter?.house != null) natalFactors.push(`Natal Jupiter in house ${jupiter.house} contributes to growth and resource expansion themes.`);
    }

    if (topic === "relationships" || topic === "marriage") {
      if (venus?.house != null) natalFactors.push(`Natal Venus in house ${venus.house} colors attraction, bonding, and relationship style.`);
      if (moon?.house != null) natalFactors.push(`Natal Moon in house ${moon.house} shows emotional needs and relational sensitivity.`);
      if (jupiter?.house != null) natalFactors.push(`Natal Jupiter in house ${jupiter.house} adds guidance and maturity to partnership themes.`);
    }

    if (topic === "health") {
      if (moon?.house != null) natalFactors.push(`Natal Moon in house ${moon.house} affects emotional resilience and recovery rhythm.`);
      if (saturn?.house != null) natalFactors.push(`Natal Saturn in house ${saturn.house} points to where pressure can accumulate if routines slip.`);
      if (mars?.house != null) natalFactors.push(`Natal Mars in house ${mars.house} shows where energy must be channeled carefully.`);
    }
  }

  const act = getActiveDashaAnyShape(report);
  if (act.md && act.md !== "Unknown") dashaFactors.push(`MD ${act.md} sets the main life chapter.`);
  if (act.ad && act.ad !== "Unknown") dashaFactors.push(`AD ${act.ad} sets the current operating tone.`);
  if (act.pd && act.pd !== "Unknown") dashaFactors.push(`PD ${act.pd} acts as the immediate trigger.`);

  const bestTransit = pickBestTransitWindows(report, topic);
  for (const w of bestTransit.slice(0, 2)) {
    transitFactors.push(
      `${fmtRange(w.from, w.to)} → ${w.driver || "Transit trigger"}${w.summary ? `: ${w.summary}` : ""}`
    );
  }

  if (topic === "career") {
    synthesis.push("Career timing should be read from natal direction + current dasha + active work/growth transits together.");
  } else if (topic === "money") {
    synthesis.push("Money timing should be read from resource themes + current dasha + near-term gain/support windows together.");
  } else if (topic === "relationships" || topic === "marriage") {
    synthesis.push("Relationship timing should be read from natal bonding patterns + current emotional chapter + active transit triggers together.");
  } else if (topic === "health") {
    synthesis.push("Health timing should be read from baseline resilience + current stress/load chapter + recovery-supportive triggers together.");
  } else {
    synthesis.push("This answer should be read from natal baseline + current dasha + near-term transit triggers together.");
  }

  return {
    natalFactors,
    dashaFactors,
    transitFactors,
    synthesis,
  };
}
/* --------------------------------------------------
   Remedies / next phases / concept explainers
-------------------------------------------------- */

function remedyForPlanet(p: string): string {
  const key = p.toLowerCase();
  if (key === "sun")    return "Respect father/mentors, offer water to the rising Sun, ruby only if Sun actually supports your chart.";
  if (key === "moon")   return "Protect sleep + nervous system, show care to mother energy, pearl only if Moon is safe for you.";
  if (key === "mars")   return "Move your body, burn anger cleanly, avoid impulsive fights. Coral only if Mars won't overheat you.";
  if (key === "mercury")return "Write things down, speak clearly, avoid gossip. Emerald only if Mercury is friendly to your lagna.";
  if (key === "jupiter")return "Seek advice from real mentors, support education, 'Om Gurave Namah'. Yellow sapphire only if Jupiter is benefic for you.";
  if (key === "venus")  return "Keep your space kind and aesthetic, practice soft diplomacy, rein in overindulgence. Diamond/opal only if Venus truly helps you.";
  if (key === "saturn") return "Do the responsible thing consistently, help elderly/poor, 'Om Sham Shanicharaya Namah'. Blue sapphire ONLY if Saturn is genuinely protective for you.";
  if (key === "rahu")   return "Avoid panic moves / shortcuts, ground yourself, donate darker clothes/food on Saturdays.";
  if (key === "ketu")   return "Cut fake obligations, feed/comfort stray dogs, allow emotional detox. Cat’s eye ONLY if it's actually aligned.";
  return "Serve honestly, stay clean, protect your peace — that supports any planet.";
}
function gemstonePlanetMeaning(planet?: string): string {
  const p = String(planet || "").toLowerCase();

  if (p === "sun") return "identity, authority, confidence, visibility";
  if (p === "moon") return "emotions, stability, sensitivity, inner comfort";
  if (p === "mars") return "drive, courage, aggression, action";
  if (p === "mercury") return "thinking, speech, trade, planning";
  if (p === "jupiter") return "wisdom, expansion, guidance, fortune";
  if (p === "venus") return "love, comfort, beauty, harmony, pleasure";
  if (p === "saturn") return "discipline, responsibility, pressure, endurance";
  if (p === "rahu") return "ambition, obsession, amplification, restlessness";
  if (p === "ketu") return "detachment, spiritualization, cutting, inner withdrawal";

  return "a planetary theme in the chart";
}

function gemstoneRiskLine(planet?: string): string {
  const p = String(planet || "").toLowerCase();

  if (p === "saturn") {
    return "Saturn stones should never be worn casually. If Saturn is difficult in the chart, strengthening it can increase pressure, heaviness, or delays.";
  }
  if (p === "rahu") {
    return "Rahu stones should be handled very carefully. If misused, they can amplify confusion, obsession, anxiety, or risky decision-making.";
  }
  if (p === "ketu") {
    return "Ketu stones should not be worn casually. They can increase detachment, isolation, or emotional disconnection if not properly suited.";
  }
  if (p === "mars") {
    return "Mars stones can increase heat, irritability, impatience, or confrontation if Mars is not safe to strengthen.";
  }
  if (p === "sun") {
    return "Sun stones can increase ego friction or authority conflicts if the Sun is not supportive in the chart.";
  }
  if (p === "venus") {
    return "Venus stones can increase indulgence, emotional entanglement, or comfort-seeking if Venus is not well placed for the native.";
  }
  if (p === "jupiter") {
    return "Jupiter stones are not automatically safe for everyone. They should be worn only if Jupiter is truly supportive for the chart and the current objective.";
  }
  if (p === "mercury") {
    return "Mercury stones should match both chart support and present need. Otherwise they can create overthinking, nervousness, or scattered focus.";
  }
  if (p === "moon") {
    return "Moon stones should not be worn blindly. If Moon-related sensitivity is already high, they can increase emotional fluctuation.";
  }

  return "No gemstone should be worn blindly just because it sounds positive.";
}

function buildGemstoneEngineAnswer(opts: {
  question: string;
  report?: LifeReportLike | null;
  gemstone: GemstoneInfo;
}): string {
  const { question, report, gemstone } = opts;

  const stone = gemstone.stone || "This stone";
  const planet = gemstone.planet || "";
  const meaning = gemstonePlanetMeaning(planet);
  const riskLine = gemstoneRiskLine(planet);

  const act = getActiveDashaAnyShape(report);
  const md = act.md && act.md !== "Unknown" ? act.md : "";
  const ad = act.ad && act.ad !== "Unknown" ? act.ad : "";
  const pd = act.pd && act.pd !== "Unknown" ? act.pd : "";

  const activeStack = [md, ad, pd].filter(Boolean);
  const lowerStack = activeStack.map((x) => x.toLowerCase());

  const planetActive = planet
    ? lowerStack.includes(String(planet).toLowerCase())
    : false;

  const askedSafety =
    /\b(safe|can i wear|should i wear|suitable|suits me|okay to wear|ok to wear)\b/i.test(question);

  const askedNow =
    /\b(now|right now|currently|at present|this time)\b/i.test(question);

  let verdict = "";
  if (planet && planetActive) {
    verdict =
      `${stone} is linked to ${planet}, and ${planet} is active in your current dasha stack, so this is a stone that deserves serious chart-specific judgment right now — not a casual yes.`;
  } else if (planet) {
    verdict =
      `${stone} strengthens ${planet}, so the real question is not whether the stone is generally good, but whether ${planet} is safe and useful to strengthen in your chart.`;
  } else {
    verdict =
      `A gemstone should only be recommended after checking which planet it strengthens and whether that planet should actually be amplified in your chart.`;
  }

  const dashaLine =
    activeStack.length
      ? `Current timing context: ${activeStack.join(" / ")}.`
      : `I do not have a strong dasha context loaded yet, so I would avoid giving a blind gemstone yes.`;

  const planetLine =
    planet
      ? `${stone} is used to strengthen ${planet} themes: ${meaning}.`
      : "";

  let timingLine = "";
  if (planet && planetActive) {
    timingLine =
      `${planet} is active in your present timing stack, which makes gemstone decisions more sensitive and more important than usual.`;
  } else if (planet && askedNow) {
    timingLine =
      `${planet} is not clearly visible as the main active dasha trigger right now, so the timing question becomes more about chart suitability than urgency.`;
  } else if (planet) {
    timingLine =
      `This should be judged from chart suitability first, and timing second.`;
  }

  const actionLines: string[] = [];

  if (askedSafety) {
    actionLines.push(`Do not wear ${stone} purely because someone suggested it or because it sounds favorable.`);
  }

  if (planetActive) {
    actionLines.push(`Because ${planet} is active now, get this checked specifically as a strength-or-risk decision, not as a generic remedy.`);
  } else {
    actionLines.push(`First confirm whether ${planet} is actually beneficial to strengthen in your chart.`);
  }

  actionLines.push("Judge the stone from lagna support, house rulership, natal placement, and current dasha relevance together.");

  return [
    verdict,
    "",
    planetLine,
    dashaLine,
    timingLine,
    "",
    "What matters before wearing it:",
    ...actionLines.map((x) => `- ${x}`),
    "",
    "Caution:",
    `- ${riskLine}`,
  ]
    .filter(Boolean)
    .join("\n");
}
function getFestivalDateLabel(anchor?: TimeAnchorInfo): string {
  if (!anchor || anchor.kind !== "festival") return "";

  const raw = String(anchor.raw || "").toLowerCase();

  // We are keeping this version simple and non-astronomical:
  // it gives the user a practical anchor, not a Panchang engine yet.
  if (raw === "diwali") return "Diwali";
  if (raw === "holi") return "Holi";
  if (raw === "navratri") return "Navratri";
  if (raw === "dussehra") return "Dussehra";
  if (raw === "guru purnima") return "Guru Purnima";
  if (raw === "janmashtami") return "Janmashtami";
  if (raw === "shivratri") return "Maha Shivratri";

  return anchor.label || "";
}

function isPureCalendarDateQuestion(question: string, anchor?: TimeAnchorInfo): boolean {
  const q = String(question || "").toLowerCase().trim();

  if (!anchor || anchor.kind !== "festival") return false;

  return (
    /\bwhen is\b/.test(q) ||
    /\bdate of\b/.test(q) ||
    /\bon what date\b/.test(q)
  );
}

function buildCalendarAnchorEngineAnswer(opts: {
  question: string;
  report?: LifeReportLike | null;
  anchor: TimeAnchorInfo;
  topic: AskSarathiDomain;
}): string {
  const { question, report, anchor, topic } = opts;

  const festivalLabel = getFestivalDateLabel(anchor);
  const q = String(question || "").toLowerCase().trim();

  // 1) Pure date-style question
  if (isPureCalendarDateQuestion(question, anchor)) {
    return `${festivalLabel} timing depends on the lunar calendar each year. In this version of Ask Sārathi, I can recognize ${festivalLabel} as a timing anchor, but the exact festival date should come from Panchang/calendar data rather than guessed text.`;
  }

  // 2) Astrology question anchored to festival / event
  const act = getActiveDashaAnyShape(report);
  const activeStack = [act.md, act.ad, act.pd].filter((x) => x && x !== "Unknown");
  const stackLabel = activeStack.length ? activeStack.join(" / ") : "current phase";

  const bestTransit = pickBestTransitWindows(report, topic);
  const bestTimeline = pickFromTimeline(report, topic);

  const hasTransit = bestTransit.length > 0;
  const topTransit = hasTransit ? bestTransit[0] : null;

  let verdict =
    `${festivalLabel} can be used as a psychological or timing marker, but your actual shift should be judged from dasha and transit activation, not from the festival alone.`;

  if (topTransit?.riskFlag === "opportunity") {
    verdict =
      `Yes, the period around or after ${festivalLabel} can coincide with improvement, but the real reason is that your timing looks supportive rather than the festival itself magically changing things.`;
  } else if (topTransit?.riskFlag === "mixed") {
    verdict =
      `${festivalLabel} may bring a noticeable shift in mood or movement, but the chart suggests a mixed phase rather than an instant clean breakthrough.`;
  } else if (topTransit?.riskFlag === "caution") {
    verdict =
      `${festivalLabel} itself should not be treated as an automatic turning point. The chart still suggests caution, preparation, and selective movement rather than a dramatic immediate shift.`;
  } else if (bestTimeline) {
    verdict =
      `${festivalLabel} may feel like a useful emotional marker, but the bigger story is your running dasha phase and timeline window.`;
  }

  const whyLines: string[] = [];

  if (activeStack.length) {
    whyLines.push(`Current dasha stack: ${stackLabel}.`);
  }

  if (topTransit) {
    whyLines.push(
      `Best visible timing window: ${fmtRange(topTransit.from, topTransit.to)}${topTransit.driver ? ` • driver: ${topTransit.driver}` : ""}.`
    );
  } else if (bestTimeline) {
    whyLines.push(
      `Relevant timeline window: ${fmtRange(bestTimeline.from, bestTimeline.to)}${bestTimeline.adLord ? ` • AD ${bestTimeline.adLord}` : ""}${bestTimeline.pdLord ? ` • PD ${bestTimeline.pdLord}` : ""}.`
    );
  } else {
    whyLines.push("No sharply tagged external window is visible right now, so the answer should be read through the active phase more than a calendar anchor.");
  }

  let actionLine = "Use the festival as a reflection point, not as blind proof that life will change on that exact day.";
  if (/\b(job|career|work|promotion)\b/.test(q)) {
    actionLine = `Use the period around ${festivalLabel} to review career movement, outreach, and readiness — but act from timing quality, not symbolic hope alone.`;
  } else if (/\b(marriage|relationship|partner|love)\b/.test(q)) {
    actionLine = `Use the period around ${festivalLabel} to notice whether relationship momentum is actually improving, rather than projecting meaning onto the festival itself.`;
  } else if (/\b(property|house|home|move house|shift)\b/.test(q)) {
    actionLine = `Treat ${festivalLabel} as a planning marker for property or moving decisions, but still judge the move from actual support in timing.`;
  } else if (/\b(car|vehicle)\b/.test(q)) {
    actionLine = `Use ${festivalLabel} as a decision checkpoint for vehicle matters, but not as the only reason to buy.`;
  }

  return [
    verdict,
    "",
    "Why this is the right way to read it:",
    ...whyLines.map((x) => `- ${x}`),
    "",
    "How to use this anchor:",
    `- ${actionLine}`,
  ].join("\n");
}
function buildRemedyAnswer(report?: LifeReportLike | null): string {
  const act = getActiveDashaAnyShape(report);
const md = act.md === "Unknown" ? "" : act.md;
const ad = act.ad === "Unknown" ? "" : act.ad;
const pd = act.pd === "Unknown" ? "" : act.pd;

if (!md && !ad && !pd) return "I'd need your dasha context to suggest safe remedies. Open Life Report first.";


  const uniquePlanets = Array.from(new Set([md, ad, pd].filter(Boolean)));
  if (!uniquePlanets.length) return "I can't see your active dasha rulers clearly, so I'd be guessing remedies — not safe.";

  const tips = uniquePlanets.map((p) => `• ${p} → ${remedyForPlanet(p)}`).join("\n");
  return `Practical stuff aligned with your *right now* planets:\n\n${tips}\n\nDo these from sincerity, not fear.`;
}

function buildNextPhases(report?: LifeReportLike | null): string {
  if (!report?.activePeriods) return "I need your dasha timeline to forecast next phases. Open Life Report first so I can cache it.";

  const { antardasha } = report.activePeriods;
  const nowMs = Date.now();

  const futureWins = (report.timeline ?? []).filter((w) => {
    const start = new Date(w.from).getTime();
    return Number.isFinite(start) && start > nowMs;
  });

  if (!futureWins.length) {
    if (antardasha?.subLord && antardasha?.end) {
      return `Right now you're in ${antardasha.subLord} Antardasha. That chapter ends around ${new Date(antardasha.end).toLocaleDateString()}. Your next pivot is when that sub-period changes — that's when tone and opportunity actually flip.`;
    }
    return "You're still in this active Antardasha. The next sub-period change is your real pivot.";
  }

  futureWins.sort((a, b) => new Date(a.from).getTime() - new Date(b.from).getTime());
  const picks = futureWins.slice(0, 2);

  const bullets = picks.map((w) => {
    const rng = `${fmtDateShort(w.from)} → ${fmtDateShort(w.to)}`;
    const tone = w.blurb ? w.blurb.trim().replace(/\s+/g, " ") : w.label;
    return `• ${rng}: ${tone} (AD ${w.adLord}, PD ${w.pdLord})`;
  });

  return "Your next phases:\n" + bullets.join("\n") + "\nThese are legit pivot windows where life changes tone.";
}

function explainPlanet(p: string): string | null {
  const key = p.toLowerCase();
  if (key === "sun")    return "Sun = ego, identity, authority, visibility, father-energy. Strong Sun = 'I show up', weak Sun = 'I chase validation'.";
  if (key === "moon")   return "Moon = emotional needs, comfort, mood, intuition, mother-energy. It's how you self-soothe and feel safe.";
  if (key === "mars")   return "Mars = drive, action, anger, courage. Strong Mars = momentum. Unbalanced Mars = conflict or burnout.";
  if (key === "mercury")return "Mercury = thinking, speech, logistics, deals. It's how you organize chaos and negotiate reality.";
  if (key === "jupiter")return "Jupiter = wisdom, growth, teachers, faith, protection. It opens doors when you're aligned.";
  if (key === "venus")  return "Venus = love, charm, pleasure, taste, beauty. It's how you attract and bond.";
  if (key === "saturn") return "Saturn = responsibility, structure, time. It's pressure that matures you and gives durable results.";
  if (key === "rahu")   return "Rahu = obsession, ambition, 'I want more now'. Big gains + anxiety in the same package.";
  if (key === "ketu")   return "Ketu = detachment, spiritual cleanup, cutting fake obligations. Feels like loss because it's cleanup.";
  return null;
}

function explainHouse(num: string): string | null {
  if (num === "1" || /1st|first/.test(num))  return "1st house = self, body, how you show up, how you initiate.";
  if (num === "2" || /2nd|second/.test(num)) return "2nd house = money you earn, voice, values, stability.";
  if (num === "3" || /3rd|third/.test(num))  return "3rd house = hustle, self-made effort, siblings, communication.";
  if (num === "4" || /4th|fourth/.test(num)) return "4th house = home, inner peace, mother, real emotional safety.";
  if (num === "5" || /5th|fifth/.test(num))  return "5th house = romance, creativity, playful confidence, speculative luck.";
  if (num === "6" || /6th|sixth/.test(num))  return "6th house = stress, grind, routine work, health maintenance, discipline.";
  if (num === "7" || /7th|seventh/.test(num))return "7th house = partner, marriage, PR, one-on-one bonding, contracts.";
  if (num === "8" || /8th|eighth/.test(num)) return "8th house = shared resources, crisis alchemy, taboo power, rebirth.";
  if (num === "9" || /9th|ninth/.test(num))  return "9th house = meaning, mentorship, long journeys, lucky alignment.";
  if (num === "10" || /10th|tenth/.test(num))return "10th house = public status, career, leadership, visible success.";
  if (num === "11" || /11th|eleventh/.test(num))return "11th house = gains, network, audience, social proof, payout from long grind.";
  if (num === "12" || /12th|twelfth/.test(num))return "12th house = isolation, sleep, surrender, letting go, foreign lands.";
  return null;
}

function explainTimingTerm(q: string): string | null {
  const l = q.toLowerCase();
  if (l.includes("mahadasha") || l.includes("maha dasha"))
    return "Mahadasha = the main multi-year chapter. It's the big storyline you're living inside.";
  if (l.includes("antardasha") || l.includes("antar dasha") || l.includes("sub period"))
    return "Antardasha = the sub-chapter running the day-to-day tone right now.";
  if (l.includes("pratyantardasha") || l.includes("pratyantar") || l.includes("pd"))
    return "Pratyantardasha = the micro-spike timing. That's why this month feels like THIS.";
  if (l.includes("transit"))
    return "Transit = planets in the sky hitting your chart. Transit says 'ok but when does it show in real life'.";
  return null;
}

function lookupAstroConcept(question: string): string | null {
  const q = question.toLowerCase().trim();

  const planets = ["sun","moon","mars","mercury","jupiter","venus","saturn","rahu","ketu"];
  for (const p of planets) {
    if (q.includes(p)) {
      const expl = explainPlanet(p);
      if (expl) return expl;
    }
  }

  const houseMatch = q.match(/(\d+)(st|nd|rd|th)?\s+house/) || q.match(/house\s+(\d+)/);
  if (houseMatch) {
    const hNum = houseMatch[1];
    const expl = explainHouse(hNum);
    if (expl) return expl;
  }

  const termExpl = explainTimingTerm(q);
  if (termExpl) return termExpl;

  if (q.startsWith("what is") || q.startsWith("what's") || q.startsWith("whats") ||
      q.includes("explain") || q.includes("meaning of") || q.includes("what does it mean")) {
    return "In Vedic terms: planets = actors, houses = areas of life, dasha = timing engine, transits = real-world trigger. I map those to you, not in generic textbook form.";
  }

  return null;
}
function buildFoodAnswer(report: LifeReportLike | null): string {
  // --- 1) Read dasha stack safely ---
  const act = getActiveDashaAnyShape(report);
const md = act.md === "Unknown" ? "" : act.md;
const ad = act.ad === "Unknown" ? "" : act.ad;
const pd = act.pd === "Unknown" ? "" : act.pd;

  const stack = `${md} ${ad} ${pd}`.toLowerCase();

  const saturnActive = stack.includes("saturn");
  const ketuActive = stack.includes("ketu");
  const rahuActive = stack.includes("rahu");

  // --- 2) Natal flavour (Moon nakshatra) ---
  const moonNak = report?.natal?.moonNakshatra || "";
  const nakLower = moonNak.toLowerCase();
  const isPurvaPhalguni =
    nakLower.includes("purva") && nakLower.includes("phalg");

  // default joy line, tweaked if Purva Phalguni
  let joyLine =
    "Add a small, intentional pleasure to your plate — a date, a bite of jaggery, or a nicely plated meal. Not indulgence, just a gentle reminder that you’re allowed small joys.";

  if (isPurvaPhalguni) {
    joyLine =
      "Add a small, intentional pleasure to your plate — a date, a bit of jaggery, or a nicely plated dish. Your Purva Phalguni Moon feels better when there is a touch of beauty and enjoyment.";
  }

  // --- 3) Theme text based on stack ---
  let themeLine =
    "Today has a quiet, grounding tone — the kind of day that benefits from simple, warm, comforting food that keeps your system steady.";

  if (saturnActive || ketuActive) {
    themeLine =
      "Today has a quiet, grounding tone — Saturn and Ketu favour simple, warm, comforting food that keeps your system steady without adding extra drama.";
  } else if (rahuActive) {
    themeLine =
      "Today’s energy can tilt towards restlessness or craving extremes, so food works best when it is simple, warm, and not too stimulating.";
  }

  // --- 4) If we have no dasha context at all, fall back gracefully ---
  const hasAnyDasha = Boolean(md || ad || pd);

  const whyParts: string[] = [];
  if (md) whyParts.push(`MD ${md}`);
  if (ad) whyParts.push(`AD ${ad}`);
  if (pd) whyParts.push(`PD ${pd}`);

  const whyLine = hasAnyDasha
    ? `Why this (evidence):\n- Active dasha stack → ${whyParts.join(" • ")}`
    : "";

  // --- 5) Main food guidance text (template) ---
  const favourLines = [
    "- Warm, cooked meals (avoid overloading on cold/raw items).",
    "- Dal–chawal, khichdi, simple veg pulao, or roti–sabzi type meals.",
    "- Light dals like moong or masoor.",
    "- Soft, cooked vegetables (lauki, tori, pumpkin, beans, bhindi, etc.).",
    "- A little ghee for grounding, if it suits you.",
    "- Herbal tea or warm water through the day instead of too many chilled drinks.",
  ];

  const avoidLines = [
    "- Very heavy fried foods or greasy snacks.",
    "- Too much chilli or extreme spice that overheats the system.",
    "- Ice-cold drinks and heavy desserts late at night.",
    "- Mindless ‘timepass’ snacking when you feel emotionally stuck.",
  ];

  const simpleRule =
    "Choose one main meal today that is warm, simple, and eaten without multitasking.";

  if (!hasAnyDasha) {
    // no report / no dasha context – generic but still useful answer
    return [
      "🥗 What you should eat today",
      "",
      "Your system will feel better today with warm, simple, home-style food rather than heavy or hyper-stimulating options.",
      "",
      "Eat more of (favour today)",
      ...favourLines,
      "",
      "Go easy on",
      ...avoidLines,
      "",
      "One simple rule for today",
      `${simpleRule}`,
      "",
      "Joy element",
      joyLine,
    ]
      .filter(Boolean)
      .join("\n");
  }

  // --- 6) Dasha-aware answer ---
  return [
    "🥗 What you should eat today",
    "",
    themeLine,
    "",
    "Eat more of (favour today)",
    ...favourLines,
    "",
    "Go easy on",
    ...avoidLines,
    "",
    "One simple rule for today",
    `${simpleRule}`,
    "",
    "Joy element",
    joyLine,
    "",
    whyLine,
  ]
    .filter(Boolean)
    .join("\n");
}

/* --------------------------------------------------
   Stress + coping
-------------------------------------------------- */

function inferAstroStressDriver(report: LifeReportLike | null): string {
  const act = getActiveDashaAnyShape(report);
const sub = (act.ad || "").toLowerCase();
const trigger = (act.pd || "").toLowerCase();

  if (sub.includes("saturn") || trigger.includes("saturn"))
    return "Saturn pressure = long grind, heavy responsibility, 'prove yourself' energy. Slow doesn't mean failing.";
  if (sub.includes("rahu") || trigger.includes("rahu"))
    return "Rahu restlessness = 'why isn't it happening already'. Hunger + anxiety in the same package.";
  if (sub.includes("ketu") || trigger.includes("ketu"))
    return "Ketu purge = cutting fake obligations, emotional detox. It can feel like loss because it's cleanup.";
  if (sub.includes("mars") || trigger.includes("mars"))
    return "Mars spike = irritability and 'I need change now'. Watch impulsive reactions.";
  if (sub.includes("moon") || trigger.includes("moon"))
    return "Moon sensitivity = emotional heaviness + sleep swings. Your system is asking for care, not 'tough it out'.";
  return "";
}

const sootheTips = {
  patience: [
    "Pick one thing you can finish cleanly today. Control that, not the entire future.",
    "Slow build isn't 'stuck'. It's stacking proof. Write down what you've quietly held together — that's leverage.",
  ],
  self_trust: [
    "Your body saying 'this isn't okay' is data, not drama.",
    "Name one thing you handle better now vs last year. That's proof you're not actually in the same place.",
  ],
  nervous_system: [
    "Unclench jaw / drop shoulders for 10 seconds. Tiny, but it interrupts the stress loop.",
    "Water + long exhale. Calm body first so choices aren't panic-driven.",
  ],
  boundaries_release: [
    "You are allowed to pull back from people who drain you.",
    "If someone always shrinks you, reduce their access. Protecting your energy is valid action.",
  ],
};

function pickCopingTip(stressDriver: string): string {
  if (!stressDriver) {
    const arr = sootheTips.self_trust;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  const lower = stressDriver.toLowerCase();
  let bucket: keyof typeof sootheTips = "self_trust";
  if (lower.includes("saturn")) bucket = "patience";
  else if (lower.includes("rahu")) bucket = "nervous_system";
  else if (lower.includes("ketu")) bucket = "boundaries_release";
  else if (lower.includes("mars")) bucket = "nervous_system";
  else if (lower.includes("moon")) bucket = "self_trust";
  const tips = sootheTips[bucket];
  return tips[Math.floor(Math.random() * tips.length)];
}

/* --------------------------------------------------
   Fact bundle used by /api/naturalize
-------------------------------------------------- */

function buildCurrentSummary(report?: LifeReportLike | null): string {
  if (!report?.activePeriods) {
    return "Current period information is not available.";
  }

  const { mahadasha, antardasha, pratyantardasha } = report.activePeriods;

  const md = mahadasha?.lord ?? "Unknown";
  const ad = antardasha?.subLord ?? "Unknown";
  const pd = pratyantardasha?.lord ?? "Unknown";

  return `You are currently running ${md} Mahadasha, ${ad} Antardasha, and ${pd} Pratyantardasha.`;
}

function gemstoneAdvice(report: LifeReportLike | null | undefined, question: string): string {
  const q = question.toLowerCase();
  const mentionsGem = /gem|stone|wear|ruby|pearl|blue sapphire|cat's eye|cats eye/i.test(q);
  if (!mentionsGem) return "";

  if (!report?.activePeriods) {
    return "Gemstones are powerful and can backfire. I need to confirm your current dasha rulers before I tell you to wear anything.";
  }
  const ad = report.activePeriods.antardasha?.subLord || "";
  if (!ad) {
    return "You only boost a gem if it supports your active Antardasha lord AND doesn't fight your base chart. It's not 'everyone wear blue sapphire'.";
  }
  return `You're in ${ad} Antardasha. You only wear a stone that helps that planet AND doesn't fight your base chart. It's case-by-case, not generic shopping advice.`;
}
function buildNatalFlavor(report?: LifeReportLike | null): string {
  if (!report?.natal) return "";

  const asc = report.natal.ascSign || "";
  const moon = report.natal.moonSign || "";
  const nak  = report.natal.moonNakshatra || "";

  const parts: string[] = [];

  if (asc) {
    parts.push(
      `Baseline wiring: ${asc} rising — you tend to process life through that sign’s style (how you show up and act).`
    );
  }

  if (moon) {
    if (nak) {
      parts.push(
        `Emotional layer: Moon in ${moon}, ${nak} nakshatra — your mood and gut reactions follow this pattern, so notice what your body says before your mind argues.`
      );
    } else {
      parts.push(
        `Emotional layer: Moon in ${moon} — your feelings and decisions often move in that sign’s style.`
      );
    }
  }

  if (!parts.length) return "";

  parts.push(
    "Use today’s timing in a way that fits this wiring instead of copying someone else’s style."
  );

  return parts.join(" ");
}
type FoodGuide = {
  keyPlanets: string[];
  favour: string[];
  moderate: string[];
  note: string;
};

function buildFoodGuide(report?: LifeReportLike | null): FoodGuide | null {
  if (!report?.activePeriods) return null;

  const { mahadasha, antardasha, pratyantardasha } = report.activePeriods;
  const planets = Array.from(
    new Set(
      [mahadasha?.lord, antardasha?.subLord, pratyantardasha?.lord]
        .filter(Boolean)
        .map((p) => String(p))
    )
  );

  if (!planets.length) return null;

  const baseMap: Record<string, { favour: string[]; moderate: string[]; note: string }> = {
    Sun: {
      favour: ["warm simple foods", "a little ghee", "fresh seasonal fruits"],
      moderate: ["very spicy oily food", "heavy fried items"],
      note: "Support digestion and vitality without overloading heat.",
    },
    Moon: {
      favour: ["hydrating foods", "soups", "cooked grains", "milk or plant milk if tolerated"],
      moderate: ["excessive caffeine", "very dry salty snacks"],
      note: "Support emotional stability and fluids.",
    },
    Mars: {
      favour: ["light protein", "lentils", "grilled foods", "warm spices like ginger"],
      moderate: ["chilli overload", "red meat late at night"],
      note: "Give clean fuel without overheating.",
    },
    Mercury: {
      favour: ["fresh greens", "light grains", "a few nuts/seeds"],
      moderate: ["processed snacks", "too much sugar"],
      note: "Keep nerves and focus steady, not jittery.",
    },
    Jupiter: {
      favour: ["satvic home-cooked meals", "simple dals", "fresh fruits"],
      moderate: ["over-eating sweets", "very heavy dinners"],
      note: "Support wisdom and optimism without lethargy.",
    },
    Venus: {
      favour: ["nicely presented meals", "lightly sweet foods", "fruits"],
      moderate: ["excess desserts", "late-night heavy meals"],
      note: "Enjoy pleasure in balance, not excess.",
    },
    Saturn: {
      favour: ["simple rustic meals", "millets", "warm cooked vegetables"],
      moderate: ["cold, stale food", "overeating late at night"],
      note: "Support long-term stamina and digestion.",
    },
    Rahu: {
      favour: ["clean home-style food", "grounding root vegetables"],
      moderate: ["junk/packaged food", "energy drinks"],
      note: "Reduce scattered, restless energy.",
    },
    Ketu: {
      favour: ["light, easy-to-digest meals", "warm herbal teas"],
      moderate: ["mindless snacking", "festival-style heavy meals"],
      note: "Support emotional detox and clarity.",
    },
  };

  const favourSet = new Set<string>();
  const moderateSet = new Set<string>();
  const notes: string[] = [];
  
  for (const p of planets) {
    const cfg = baseMap[p as keyof typeof baseMap];
    if (!cfg) continue;
    cfg.favour.forEach((f) => favourSet.add(f));
    cfg.moderate.forEach((m) => moderateSet.add(m));
    notes.push(`${p}: ${cfg.note}`);
  }

  return {
    keyPlanets: planets,
    favour: Array.from(favourSet),
    moderate: Array.from(moderateSet),
    note: notes.join(" "),
  };
}
function buildDailyRhythmTone(report?: LifeReportLike | null): {
  tone: string;
  focus: string;
  avoid: string;
} {
  if (!report?.activePeriods) {
    return {
      tone: "Neutral, usable day — nothing extreme, focus on simple progress.",
      focus: "Handle 1–2 important responsibilities without overloading yourself.",
      avoid: "Avoid overthinking timing or comparing yourself to others.",
    };
  }

  const { antardasha, pratyantardasha } = report.activePeriods;
  const antar = (antardasha?.subLord || "").toLowerCase();
  const praty = (pratyantardasha?.lord || "").toLowerCase();
  const stack = antar + " " + praty;

  // defaults
  let tone = "Steady but sensitive — progress is possible if you pace yourself.";
  let focus = "Pick one meaningful task and complete it with full attention.";
  let avoid = "Avoid forcing big decisions or spiraling in worry.";

  if (stack.includes("saturn")) {
    tone = "Slow, serious, but constructive — this is a 'brick by brick' kind of day.";
    focus = "Finish one responsibility properly; honour deadlines and commitments.";
    avoid = "Avoid taking on too much or judging yourself for slow progress.";
  } else if (stack.includes("rahu")) {
    tone = "Restless and ambitious — energy wants change, but can become scattered.";
    focus = "Channel the urge to change into structured outreach or planning.";
    avoid = "Avoid impulsive career jumps or money risks just to escape discomfort.";
  } else if (stack.includes("ketu")) {
    tone = "Decluttering and detaching — good for cleaning up old obligations.";
    focus = "Wrap up loose ends and quietly step away from drains on your energy.";
    avoid = "Avoid emotional over-engagement in drama or pointless debates.";
  } else if (stack.includes("mars")) {
    tone = "Active and assertive — good for action, but watch impatience.";
    focus = "Take decisive steps on 1–2 pending tasks that need courage or initiative.";
    avoid = "Avoid fights, ultimatums, or ‘all or nothing’ reactions.";
  } else if (stack.includes("jupiter")) {
    tone = "Expansive and growth-oriented — good for learning and guidance.";
    focus = "Seek advice, study, or work on something that grows your long-term path.";
    avoid = "Avoid over-promising or assuming things will work without effort.";
  } else if (stack.includes("venus")) {
    tone = "Pleasant and connective — good for people work and aesthetics.";
    focus = "Bring warmth and polish to communication or your environment.";
    avoid = "Avoid overindulgence in comfort, sweets, or pure pleasure distractions.";
  } else if (stack.includes("mercury")) {
    tone = "Thinking and communication-focused — good for planning and paperwork.";
    focus = "Clarify plans, fix documents, send messages, and get facts straight.";
    avoid = "Avoid gossip, over-analyzing, or changing decisions every hour.";
  } else if (stack.includes("moon")) {
    tone = "Emotionally sensitive — intuition is high but so is mood fluctuation.";
    focus = "Honour how you feel; choose tasks that match your emotional capacity.";
    avoid = "Avoid suppressing emotions or pushing yourself to look ‘strong’.";
  } else if (stack.includes("sun")) {
    tone = "Visible and evaluative — you are more ‘on stage’ than usual.";
    focus = "Show up where it matters; take ownership in one visible area.";
    avoid = "Avoid ego battles or overreacting to feedback.";
  }

  return { tone, focus, avoid };
}

function buildDailyRhythmFoodHint(report?: LifeReportLike | null): string {
  if (!report?.activePeriods) {
    return "Prefer warm, simple, cooked meals over cold or heavy junk today.";
  }

  const stack =
    (report.activePeriods.antardasha?.subLord || "").toLowerCase() +
    " " +
    (report.activePeriods.pratyantardasha?.lord || "").toLowerCase();

  if (stack.includes("saturn") || stack.includes("ketu")) {
    return "Go for grounding, warm, simple food (dal, khichdi, roti–sabzi) and avoid overeating or very heavy fried items.";
  }
  if (stack.includes("rahu") || stack.includes("mars")) {
    return "Support your system with clean, energising food — avoid too much spice, caffeine, or random snacking when restless.";
  }
  if (stack.includes("moon") || stack.includes("venus")) {
    return "Eat comforting but not excessive meals; hydrate well and allow a small, intentional treat if you like.";
  }
  if (stack.includes("jupiter")) {
    return "Favour sattvic, clean food — fruits, simple grains, moderate ghee; avoid overindulgence ‘just because it feels good’.";
  }
  if (stack.includes("mercury")) {
    return "Keep meals light and clear so your mind stays sharp — avoid very heavy or sleepy-making foods in the daytime.";
  }

  return "Aim for warm, cooked meals and minimise junk or emotional snacking.";
}

function buildDailyRhythmRelationshipHint(report?: LifeReportLike | null): string {
  if (!report?.activePeriods) {
    return "Keep conversations simple and honest; avoid over-explaining or reacting from stress.";
  }

  const stack =
    (report.activePeriods.antardasha?.subLord || "").toLowerCase() +
    " " +
    (report.activePeriods.pratyantardasha?.lord || "").toLowerCase();

  if (stack.includes("saturn")) {
    return "Show reliability more than drama — follow through on what you’ve already promised.";
  }
  if (stack.includes("venus") || stack.includes("moon")) {
    return "Good for gentle connection — a kind message, shared meal, or small gesture goes far.";
  }
  if (stack.includes("mars") || stack.includes("rahu")) {
    return "Watch tone and impatience; if a topic is heated, pause instead of escalating.";
  }
  if (stack.includes("ketu")) {
    return "Detach slightly from emotionally draining dynamics; protect your peace without guilt.";
  }

  return "Lead with clarity and kindness; keep boundaries clean.";
}

function buildDailyRhythmMoneyHint(report?: LifeReportLike | null): string {
  if (!report?.activePeriods) {
    return "Use today to review money, not for big impulsive decisions.";
  }

  const stack =
    (report.activePeriods.antardasha?.subLord || "").toLowerCase() +
    " " +
    (report.activePeriods.pratyantardasha?.lord || "").toLowerCase();

  if (stack.includes("rahu")) {
    return "Avoid impulsive spending or speculative bets; channel ambition into planning and skill-building.";
  }
  if (stack.includes("saturn")) {
    return "Good for budgeting, clearing dues, or organising documents — slow, responsible money steps.";
  }
  if (stack.includes("jupiter")) {
    return "Look at long-term growth moves (learning, planning, advice), not just short-term gains.";
  }
  if (stack.includes("venus")) {
    return "You may feel like spending on comfort or beauty; allow a little, but stay within a clear limit.";
  }
  if (stack.includes("mercury")) {
    return "Ideal for paperwork, negotiations, or comparing options rather than finalising big commitments.";
  }

  return "Keep money moves simple and deliberate today; avoid big risks made from emotion.";
}

function buildDailyRhythmOneStep(
  tone: string,
  focus: string,
  report?: LifeReportLike | null
): string {
  const nak = (report as any)?.natal?.moonNakshatra || "";
  if (nak && typeof nak === "string" && nak.toLowerCase().includes("phalguni")) {
    return "Pick one responsibility you can complete today, then add one small moment of beauty or joy for yourself afterward.";
  }
  return "Choose one realistic task that matches today’s tone and finish it fully before you touch anything else.";
}

function buildDailyRhythm(
  report?: LifeReportLike | null
): DailyRhythm | null {
  if (!report) return null;

  const { tone, focus, avoid } = buildDailyRhythmTone(report);
  const foodHint = buildDailyRhythmFoodHint(report);
  const relationshipHint = buildDailyRhythmRelationshipHint(report);
  const moneyHint = buildDailyRhythmMoneyHint(report);
  const oneStep = buildDailyRhythmOneStep(tone, focus, report);

  return {
    tone,
    focus,
    avoid,
    foodHint,
    relationshipHint,
    moneyHint,
    oneStep,
  };
}
  function buildUniversalTimingGuidance(opts: {
  report?: LifeReportLike | null;
  topic: AskSarathiDomain;
  windows: AskSarathiTimingWindow[];
}): {
  strongestStrength: AskSarathiWindowStrength | null;
  primaryWindow: AskSarathiTimingWindow | null;
  timingSummary: string;
  timingDirective: string;
  distantPivotNote?: string;
} {
  const { report, topic, windows } = opts;

  const primaryWindow = windows.length ? windows[0] : null;
  const strongestStrength = primaryWindow?.strength ?? null;

  const adEnd =
    report?.activePeriods?.antardasha?.end ||
    undefined;

  const domainLabelMap: Record<AskSarathiDomain, string> = {
    career: "career movement",
    money: "money movement",
    relationships: "relationship movement",
    marriage: "marriage progress",
    health: "health improvement",
    property: "property action",
    vehicle: "vehicle action",
    disputes: "dispute movement",
    inner: "inner clarity",
    generic: "movement",
  };

  const domainLabel = domainLabelMap[topic] || "movement";

  let timingSummary = "";
  let timingDirective = "";

    if (strongestStrength === "Strong") {
    timingSummary = `A strong near-term window is active for ${domainLabel}.`;
    timingDirective = "Treat the current phase as actionable. Move with preparation, not hesitation.";
  } else if (strongestStrength === "Supportive") {
    timingSummary = `A supportive near-term window is active for ${domainLabel}, so selective movement is possible now.`;
    timingDirective = "This phase is usable now. Move selectively and intelligently instead of waiting passively.";
  } else if (strongestStrength === "Mixed") {
    timingSummary = `The best available timing is mixed, but still usable for selective ${domainLabel}.`;
    timingDirective = "Use this phase for positioning, testing options, and measured action rather than forcing a final leap.";
  } else if (strongestStrength === "Caution") {
    timingSummary = `The best visible timing carries caution for ${domainLabel}.`;
    timingDirective = "Move carefully. Use the phase for preparation, clarity, and damage control rather than force.";
  } else {
    timingSummary = `No tagged window is visible, but the current phase still gives a usable opening for ${domainLabel}.`;
    timingDirective = "Do not treat this as a dead phase. Use it for preparation, visibility, and readiness.";
  }

  const distantPivotNote = adEnd
    ? `A larger background pivot may come closer to ${fmtDateShort(adEnd)}, but that should not be treated as the only time something can happen.`
    : undefined;

  return {
    strongestStrength,
    primaryWindow,
    timingSummary,
    timingDirective,
    distantPivotNote,
  };
}
function buildDailyOutlookCoreAnswer(opts: {
  mode: "personalized" | "generic";
  report?: any;
  evidenceBullets: string[];
}): AskSarathiCoreAnswer {
  const { mode, report, evidenceBullets } = opts;

  const dailyGuide = report?.dailyGuide ?? {};
  const todayMoon = Array.isArray(report?.dailyMoon) ? report.dailyMoon[0] : null;
  const transitNowFacts = Array.isArray(report?.transitNowFacts) ? report.transitNowFacts : [];
  const topTransits = Array.isArray(report?.topTransits) ? report.topTransits : [];

  const act = getActiveDashaAnyShape(report);
  const currentPhaseLabel =
    [act.md, act.ad, act.pd].filter((x) => x && x !== "Unknown").join(" / ") || undefined;
  const nakshatraToneLine = getNakshatraToneLine(report);
  const emotional =
    String(dailyGuide?.emotionalWeather?.summary ?? "").trim();
  const money =
    String(dailyGuide?.moneyTip?.summary ?? "").trim();
  const food =
    String(dailyGuide?.food?.headline ?? "").trim();

  const moonNak = String(
  todayMoon?.moonNakshatra ??
    report?.moonNakshatraTodayFact ??
    ""
)
  .replace(/^Moon nakshatra today:\s*/i, "")
  .trim();

  const moonHouse =
    typeof todayMoon?.houseFromMoon === "number" ? todayMoon.houseFromMoon : null;

  const moonLine = moonNak
    ? `The Moon today is in ${moonNak}${moonHouse ? `, activating H${moonHouse} from your natal Moon` : ""}. This shapes the emotional tone of the day.`
    : "The Moon is setting the emotional tone of the day, so mood and timing matter more than force.";

  const transitLine =
    transitNowFacts.length > 0
      ? `Current transits active today: ${transitNowFacts.slice(0, 3).join(" • ")}.`
      : "Today carries active movement, but the day is best read through tone and pacing rather than force.";

  const strongestNow = topTransits[0];
  const strongestWindowLine =
    strongestNow?.title && strongestNow?.startISO && strongestNow?.endISO
      ? `The strongest active backdrop right now is ${strongestNow.title} (${strongestNow.startISO} → ${strongestNow.endISO}).`
      : "";

  const dashaLine = currentPhaseLabel
    ? `Your active phase (${currentPhaseLabel}) colors how these daily signals are experienced, but the day itself should be read mainly from the Moon and current transits.`
    : "";

  const usableSummary = [
    moonLine,
    transitLine,
    strongestWindowLine,
    dashaLine,
  ]
    .filter(Boolean)
    .join(" ");

   const actions = [
    "Use the day for practical tasks, follow-through, and clearing small pending items.",
    "Handle important conversations with calm clarity rather than emotional speed.",
    moonHouse === 6
      ? "Prioritize work, routines, or unfinished responsibilities before moving to less important things."
      : emotional || "Keep your energy focused on one or two meaningful priorities instead of scattering it.",
  ]
    .filter(Boolean)
    .slice(0, 3);

  const avoid = [
    "Avoid overloading the day with too many priorities.",
    "Avoid reacting emotionally to small irritations or delays.",
    food || "Avoid comfort-seeking habits that break your rhythm or focus.",
  ]
    .filter(Boolean)
    .slice(0, 3);

   const reasons = [
    moonLine,
    nakshatraToneLine ? `Natal Moon pattern: ${nakshatraToneLine}` : "",
    transitLine,
    strongestWindowLine,
    dashaLine,
  ]
    .filter(Boolean)
    .slice(0, 4);
    let verdictLine =
    "Today looks usable and productive, especially if you stay intentional and do not scatter your energy.";

  if (moonHouse === 6) {
    verdictLine =
      "Today has a practical and task-oriented tone. You may feel mentally busy or slightly pressured to handle responsibilities, but this energy can help you organize things and move work forward.";
  } else if (moonHouse === 12) {
    verdictLine =
      "Today has a quieter and more inward tone. You may feel reflective, slightly withdrawn, or less interested in noise, and the day works better for calm progress than outward push.";
  } else if (moonHouse === 7) {
    verdictLine =
      "Today puts more emphasis on people, conversations, and one-to-one dynamics. You may feel more aware of how others are responding, and interactions can shape the tone of the day.";
  } else if (moonHouse === 10) {
    verdictLine =
      "Today has a visible and action-oriented tone. You may feel a push to handle responsibilities properly and make tangible progress in something important.";
  }

  const feelingLine =
    moonHouse === 6
      ? "Emotionally, you may feel mentally active, duty-focused, or slightly restless. The mind may keep returning to work, pending tasks, or things that need fixing."
      : moonHouse === 12
      ? "Emotionally, the day may feel quieter or more inward than usual. You may prefer space, slower pacing, or time away from unnecessary noise."
      : moonHouse === 7
      ? "Emotionally, the day may feel more relational. You may notice yourself reacting more to conversations, tone, or the behavior of other people."
      : moonHouse === 10
      ? "Emotionally, the day may feel purposeful and responsibility-driven. You may want to get things done properly rather than leave them hanging."
      : "Emotionally, the day carries a steady but observant tone. You may do best when you stay aware of your pace and don’t let small irritations take over.";

  const likelyEventLine =
    moonHouse === 6
      ? "A practical situation related to work, routines, health, coordination, or a pending responsibility may need your attention today. This is more likely to be a manageable task than a dramatic disruption."
      : moonHouse === 12
      ? "The day may bring quieter progress, background thinking, or a need to step back from noise. You may also find yourself revisiting something internally before acting outwardly."
      : moonHouse === 7
      ? "A conversation, clarification, or one-to-one interaction may become one of the main shaping events of the day. How calmly you handle it will matter."
      : moonHouse === 10
      ? "A visible responsibility, work matter, or decision about direction may ask for your attention today. There is more benefit in handling it cleanly than delaying it."
      : "A small but meaningful situation may arise that asks for practical attention, emotional balance, or clearer communication.";
  return {
    ok: true,
    mode,
    domain: "generic",
    questionType: "daily_outlook",
    title: "Today’s Outlook",
    verdict: {
      type: "supportive",
      line: verdictLine,
    },
    currentPhase: {
      label: currentPhaseLabel,
      summary: usableSummary,
    },
    timing: {
      hasTiming: true,
      summary: "This is a same-day guidance read, so the focus is on today’s Moon tone, current transits, and how you use the day.",
      windows: [],
    },
    reasons,
    actions,
    avoid,
    confidence: {
      level: mode === "personalized" ? "High" : "Medium",
      reason:
        mode === "personalized"
          ? "Today’s reading is grounded in Moon nakshatra, current transits, and your active phase."
          : "This is based on general daily guidance with limited personalization.",
    },
    followUps: [
      "What should I focus on most today?",
      "What should I avoid today?",
      "Is today good for an important conversation?",
    ],
    evidenceBullets,
    prose: {
      short: verdictLine,
              full: [
        verdictLine,
        "",
        feelingLine,
        ...(nakshatraToneLine
          ? ["", `Because of your natal Moon pattern: ${nakshatraToneLine}`]
          : []),
        "",
        likelyEventLine,
        "",
        usableSummary,
        "",
        "What to focus on now:",
        ...actions.map((x) => `- ${x}`),
        "",
        "What to avoid:",
        ...avoid.map((x) => `- ${x}`),
        ...(money ? ["", `Money tone: ${money}`] : []),
      ].join("\n"),
    },
  };
}
function buildDailyMicroCoreAnswer(opts: {
  mode: "personalized" | "generic";
  report?: any;
  question: string;
  evidenceBullets: string[];
}): AskSarathiCoreAnswer {
  const { mode, report, question, evidenceBullets } = opts;

  const q = String(question || "").toLowerCase();
  const todayMoon = Array.isArray(report?.dailyMoon) ? report.dailyMoon[0] : null;
  const transitNowFacts = Array.isArray(report?.transitNowFacts) ? report.transitNowFacts : [];
  const act = getActiveDashaAnyShape(report);
  const currentPhaseLabel =
    [act.md, act.ad, act.pd].filter((x) => x && x !== "Unknown").join(" / ") || undefined;
  const nakshatraToneLine = getNakshatraToneLine(report);
  const moonNak = String(
    todayMoon?.moonNakshatra ||
      report?.moonNakshatraTodayFact ||
      ""
  ).replace(/^Moon nakshatra today:\s*/i, "").trim();

  const houseFromMoon =
    typeof todayMoon?.houseFromMoon === "number" ? todayMoon.houseFromMoon : null;

  const moonLine = moonNak
    ? `Moon tone today: ${moonNak}${houseFromMoon ? ` • H${houseFromMoon} from natal Moon` : ""}.`
    : "Moon tone today supports staying aware and intentional.";

  let title = "Today’s Guidance";
  let verdict = "Today is usable, but the best results will come from staying intentional and choosing simply.";
  let actions: string[] = [];
  let avoid: string[] = [];
  let extraLine = "";

   if (
    q.includes("color") ||
    q.includes("colour") ||
    q.includes("wear") ||
    q.includes("suits me")
  ) {
    title = "Today’s Best Color";
    verdict =
      "For today, softer, cleaner, and balanced tones are likely to work better than loud or aggressive colors.";
    actions = [
      "Choose calm, polished shades like white, cream, pastel blue, soft grey, or light green.",
      "If you want presence without heaviness, go for elegant rather than flashy.",
      "Use color to feel composed and clear rather than overstimulated.",
    ];
    avoid = [
      "Avoid overly harsh or aggressive colors if you already feel mentally loaded.",
      "Avoid dressing in a way that increases restlessness or emotional noise.",
    ];
    extraLine = moonNak
      ? `Because today’s Moon is in ${moonNak}, the day responds better to balance and rhythm than visual excess.`
      : "";
  } else if (q.includes("eat")) {
    title = "What to Eat Today";
    verdict =
      "Today is better supported by simple, grounding, and steady food choices than excess or stimulation.";
    actions = [
      "Choose warm, practical meals that keep energy stable.",
      "Eat in a way that supports focus rather than heaviness.",
      "Prefer clean, moderate food over random cravings.",
    ];
    avoid = [
      "Avoid overeating or comfort-driven snacking.",
      "Avoid foods that make you dull, agitated, or overly heavy.",
    ];
  } else if (
    q.includes("meeting") ||
    q.includes("interview") ||
    q.includes("conversation") ||
    q.includes("call")
  ) {
    title = "Today for Conversations";
    verdict =
      "Yes, today can be used for an important conversation, provided you stay calm, clear, and measured.";
    actions = [
      "Keep your communication direct but composed.",
      "Use the day for clarification, alignment, and practical discussion.",
      "Prepare your key points before the conversation starts.",
    ];
    avoid = [
      "Avoid emotionally reactive wording.",
      "Avoid going into the conversation unprepared or scattered.",
    ];
  } else if (
    q.includes("gym") ||
    q.includes("workout") ||
    q.includes("run")
  ) {
    title = "Today for Exercise";
    verdict =
      "Yes, today is usable for movement, but it is better for structured effort than overexertion.";
    actions = [
      "Choose a focused workout over an extreme one.",
      "Let consistency matter more than intensity.",
      "Use exercise to stabilize the mind as well as the body.",
    ];
    avoid = [
      "Avoid pushing too hard if energy feels uneven.",
      "Avoid turning movement into pressure rather than support.",
    ];
  } else {
    title = "Today’s Guidance";
    verdict =
      "Today is usable, and it will work best if you keep things simple, focused, and well-paced.";
    actions = [
      "Use the day with intention.",
      "Prefer clarity over speed.",
      "Choose steady action over scattered effort.",
    ];
    avoid = [
      "Avoid overcomplicating the day.",
      "Avoid emotional overreaction to small things.",
    ];
  }

  const summary = [
    moonLine,
    nakshatraToneLine ? `Natal Moon pattern: ${nakshatraToneLine}` : "",
    transitNowFacts.length ? `Active transits today: ${transitNowFacts.slice(0, 2).join(" • ")}.` : "",
    currentPhaseLabel ? `Background phase: ${currentPhaseLabel}.` : "",
    extraLine,
  ]
    .filter(Boolean)
    .join(" ");

  const reasons = [
    moonLine,
    nakshatraToneLine ? `Natal Moon pattern: ${nakshatraToneLine}` : "",
    transitNowFacts.length ? `Today’s active transits: ${transitNowFacts.slice(0, 2).join(" • ")}.` : "",
    currentPhaseLabel ? `Active phase: ${currentPhaseLabel}.` : "",
    ...evidenceBullets.slice(0, 1),
  ]
    .filter(Boolean)
    .slice(0, 4);

  return {
    ok: true,
    mode,
    domain: "generic",
    questionType: "daily_micro",
    title,
    verdict: {
      type: "supportive",
      line: verdict,
    },
    currentPhase: {
      label: currentPhaseLabel,
      summary,
    },
    timing: {
      hasTiming: true,
      summary: "This is a same-day micro guidance read based mainly on Moon tone and active transits today.",
      windows: [],
    },
    reasons,
    actions,
    avoid,
    confidence: {
      level: mode === "personalized" ? "High" : "Medium",
      reason:
        mode === "personalized"
          ? "This answer uses today’s Moon tone, current transits, and your active phase."
          : "This answer uses general daily guidance with light personalization.",
    },
    followUps: [
      "What should I avoid today?",
      "Is today good for a conversation?",
      "What should I focus on today?",
    ],
    evidenceBullets: reasons,
    prose: {
      short: verdict,
      full: [
        verdict,
        "",
        summary,
        "",
        "What works well today:",
        ...actions.map((x) => `- ${x}`),
        "",
        "What to avoid:",
        ...avoid.map((x) => `- ${x}`),
      ].join("\n"),
    },
  };
}
function buildAskSarathiCoreAnswer(opts: {
  question: string;
  mode: "personalized" | "generic";
  report?: LifeReportLike | null;
  topic: AskSarathiDomain;
  questionType: AskSarathiQuestionType;
  routeFamily?: AskSarathiQuestionFamily;
  distressed: boolean;
  distressSoothing: string;
  evidenceBullets: string[];
}): AskSarathiCoreAnswer {
   const {
    question,
    mode,
    report,
    topic,
    questionType,
    routeFamily = "generic",
    distressed,
    distressSoothing,
    evidenceBullets,
  } = opts;

  const act = getActiveDashaAnyShape(report);
  const currentPhaseLabel =
    [act.md, act.ad, act.pd]
      .filter((x) => x && x !== "Unknown")
      .join(" / ") || undefined;
  const nakshatraToneLine = getNakshatraToneLine(report); 
  const currentPhaseSummary =
    mode === "personalized"
      ? buildShortHorizon(report, "month")
      : "This answer is based on general guidance because full personalized timing is not fully available.";
  const questionIntentLabel = routeFamily || questionType;
  const bestTransit = pickBestTransitWindows(report, topic);
  const bestTimeline = pickFromTimeline(report, topic);

      const strongestTransit = bestTransit?.[0];
  const degreeAwareTransit = pickDegreeAwareTransit(report, strongestTransit);
  const transitInterpretation = interpretTransitTrigger(
    strongestTransit?.driver ?? degreeAwareTransit?.driver ?? degreeAwareTransit?.planet
  );
  const multiTransitNarrative = buildMultiTransitNarrative(bestTransit);
  const natalPlanetContext = interpretPlanetInNatalChart(
    strongestTransit?.driver ?? degreeAwareTransit?.driver ?? degreeAwareTransit?.planet,
    report
  );
  const degreeTriggerNarrative = interpretDegreeTrigger(degreeAwareTransit);
  const houseLordNarrative = interpretHouseLordRole(
  strongestTransit?.driver ?? degreeAwareTransit?.planet,
  report
);
const dignityNarrative = interpretPlanetDignity(
  strongestTransit?.driver ?? degreeAwareTransit?.planet,
  report
);
const pressureNarrative = detectPressurePattern(
  report,
  strongestTransit,
  act
);
  const windows: AskSarathiTimingWindow[] = [];
  if (bestTransit.length) {  

  // 1️⃣ Score windows using topic relevance + strength
  const scored = bestTransit
  .map((w: any) => {
    const strength = windowStrengthScore(w.riskFlag);
    const category = String(w.focusArea || "").toLowerCase();

    const weight = topicWeight(topic, category);

    const score = strength + weight * 0.5;

    return {
      ...w,
      _score: score,
    };
  })
    .sort((a, b) => b._score - a._score);

  // 2️⃣ Select the best 2 windows AFTER scoring
  for (const w of scored.slice(0, 2)) {
    windows.push({
      fromISO: w.from || undefined,
      toISO: w.to || undefined,
      label: w.summary || w.focusArea || "Active window",
      strength: windowStrengthFromRiskFlag(w.riskFlag),
      why: [
        w.driver ? `Driver: ${w.driver}` : "",
        w.summary ? w.summary : "",
      ].filter(Boolean),

      do:
        Array.isArray(w.actions) && w.actions.length
          ? w.actions.slice(0, 3)
          : [
              "Use this window for targeted movement and practical action.",
              "Act selectively rather than impulsively.",
            ],

      avoid:
        w.riskFlag === "caution"
          ? ["Avoid rushed or emotionally reactive decisions."]
          : w.riskFlag === "mixed"
          ? ["Avoid forcing outcomes before timing becomes cleaner."]
          : [],
    });
  }
}
  if (!windows.length && bestTimeline) {
    const timelineStrength: AskSarathiWindowStrength =
      typeof bestTimeline.score === "number" && bestTimeline.score >= 8
        ? "Strong"
        : typeof bestTimeline.score === "number" && bestTimeline.score >= 5
        ? "Supportive"
        : "Mixed";

    windows.push({
      fromISO: bestTimeline.from || undefined,
      toISO: bestTimeline.to || undefined,
      label: bestTimeline.label || bestTimeline.blurb || "Important phase",
      strength: timelineStrength,
      why: [
        bestTimeline.blurb || "",
        bestTimeline.adLord ? `AD ${bestTimeline.adLord}` : "",
        bestTimeline.pdLord ? `PD ${bestTimeline.pdLord}` : "",
      ].filter(Boolean),
      do: [
        "Use this phase for structured progress aligned to the topic.",
        "Treat this as the best currently visible timing path.",
      ],
      avoid: timelineStrength === "Mixed" ? ["Avoid forcing a final decision too early."] : [],
    });
  }

  if (!windows.length) {
    const fallbackWindow = fallbackWindowFromActivePeriod(report, topic);
    if (fallbackWindow) windows.push(fallbackWindow);
  }

    const timingGuide = buildUniversalTimingGuidance({
    report,
    topic,
    windows,
  });

  const hasTiming = windows.length > 0;

  const verdictType = verdictTypeFromSignals({
    hasTiming,
    windows,
    distressed,
    questionType,
  });

    const verdictLine = buildDomainVerdictLine({
    topic,
    verdictType,
    routeFamily,
  });
  
  const confidence = confidenceFromSignals({
    mode,
    evidenceCount: evidenceBullets.length,
    hasTiming,
    windows,
  });

   const domainEvidence = buildDomainAstroEvidence({
    topic,
    report,
  });

      const reasons = [
  ...(nakshatraToneLine ? [`Natal Moon pattern: ${nakshatraToneLine}`] : []),
  ...domainEvidence.natalFactors.slice(0, 1),
  ...domainEvidence.dashaFactors.slice(0, 1),
  ...domainEvidence.transitFactors.slice(0, 1),
  ...(pressureNarrative ? [pressureNarrative] : []),
  ...(transitInterpretation ? [transitInterpretation] : []),
  ...(multiTransitNarrative ? [multiTransitNarrative] : []),
  ...(natalPlanetContext ? [natalPlanetContext] : []),
  ...(degreeTriggerNarrative ? [degreeTriggerNarrative] : []),
  ...(houseLordNarrative ? [houseLordNarrative] : []),
  ...(dignityNarrative ? [dignityNarrative] : []),
  ...domainEvidence.synthesis.slice(0, 1),
  ...evidenceBullets.slice(0, 1),
].slice(0, 4);
    const domainGuidance = buildDomainActionGuidance({
    topic,
    questionType,
    routeFamily,
    timingDirective: timingGuide.timingDirective,
    windowDo: windows[0]?.do,
    windowAvoid: windows[0]?.avoid,
  });

  const actions: string[] = domainGuidance.actions.slice(0, 3);
  const avoid: string[] = domainGuidance.avoid.slice(0, 3);
     const strongestWindow = timingGuide.primaryWindow;
  const strongestStrength = timingGuide.strongestStrength;
  const timingSummary =
    routeFamily === "diagnosis"
      ? "This is not a dead phase. The chart shows active pressure and restructuring, which can feel like stagnation from the inside even when movement is building underneath."
      : timingGuide.timingSummary;

  const emotionalSupport =
    distressed || questionType === "emotional_support"
      ? distressSoothing || "This phase is not punishment. It is pressure shaping clarity."
      : undefined;
     const diagnosisExplainer =
    routeFamily === "diagnosis"
      ? {
          cause: [
            pressureNarrative,
            transitInterpretation,
          ]
            .filter(Boolean)
            .slice(0, 2)
            .join(" "),
          phase: [
            multiTransitNarrative,
            natalPlanetContext,
            houseLordNarrative,
            dignityNarrative,
          ]
            .filter(Boolean)
            .slice(0, 2)
            .join(" "),
        }
      : null;
    const followUps = followUpsFor(
    topic,
    routeFamily === "prediction" ? "timing" : questionType
  );

  const shortProse = verdictLine;
   const timingLines = hasTiming
    ? windows.map((w) => {
        const range =
          w.fromISO && w.toISO ? `${w.fromISO} → ${w.toISO}` : "Timing active";
        return `- ${w.label}: ${range}`;
      })
    : ["- Use the current phase for preparation, visibility, and readiness."];

  if (timingGuide.distantPivotNote) {
    timingLines.push(`- ${timingGuide.distantPivotNote}`);
  }
       const fullProse =
    routeFamily === "diagnosis"
      ? [
          verdictLine,
          ...(diagnosisExplainer?.cause
            ? ["", `Why it feels this way: ${diagnosisExplainer.cause}`]
            : []),
          ...(diagnosisExplainer?.phase
            ? ["", `What this phase is doing: ${diagnosisExplainer.phase}`]
            : []),
          "",
          currentPhaseSummary,
          "",
          "What to focus on now:",
          ...actions.map((x) => `- ${x}`),
          "",
          "What to avoid:",
          ...avoid.map((x) => `- ${x}`),
          emotionalSupport ? "" : null,
          emotionalSupport ? emotionalSupport : null,
        ]
          .filter(Boolean)
          .join("\n")
      : [
          verdictLine,
          "",
          currentPhaseSummary,
          ...(multiTransitNarrative ? ["", multiTransitNarrative] : []),
          ...(natalPlanetContext ? ["", natalPlanetContext] : []),
          ...(degreeTriggerNarrative ? ["", degreeTriggerNarrative] : []),
          ...(houseLordNarrative ? ["", houseLordNarrative] : []),
          ...(dignityNarrative ? ["", dignityNarrative] : []),
          ...(nakshatraToneLine
            ? ["", `Because of your natal Moon pattern: ${nakshatraToneLine}`]
            : []),
          "",
          "What to focus on now:",
          ...actions.map((x) => `- ${x}`),
          "",
          "What to avoid:",
          ...avoid.map((x) => `- ${x}`),
          "",
          "Timing insight:",
          ...timingLines,
          emotionalSupport ? "" : null,
          emotionalSupport ? emotionalSupport : null,
        ]
          .filter(Boolean)
          .join("\n");
  return {
    ok: true,
    mode,
    domain: topic,
    questionType,
    title: titleFromDomain(topic),
      verdict: {
      type: verdictType,
      line: verdictLine,
    },
    currentPhase: {
      label: currentPhaseLabel,
      summary: currentPhaseSummary,
    },
    timing: {
      hasTiming,
      summary: timingSummary,
      windows,
    },
    reasons,
    actions,
    avoid,
    confidence,
    followUps,
    emotionalSupport,
    evidenceBullets,
    prose: {
      short: shortProse,
      full: fullProse,
    },
  };
}
function buildAstroFacts(question: string, report: LifeReportLike | null) {
  // ---------- helpers ----------
  const safeStr = (v: any) => (typeof v === "string" ? v.trim() : "");
  const isoDay = () => new Date().toISOString().slice(0, 10);

  const getActive = (r: any) => {
  const a = r?.activePeriods ?? r?.periods ?? r?.dasha ?? {};

  // Try both naming styles
  const md =
    a?.mahadasha?.lord ??
    a?.md?.lord ??
    a?.mdLord ??
    a?.md ??
    "";

  const ad =
    a?.antardasha?.subLord ??
    a?.antardasha?.lord ??
    a?.ad?.lord ??
    a?.adLord ??
    a?.ad ??
    "";

  const pd =
    a?.pratyantardasha?.lord ??
    a?.pd?.lord ??
    a?.pdLord ??
    a?.pd ??
    "";

  const mdRange = {
    start: a?.mahadasha?.start ?? a?.md?.start ?? a?.mdStart ?? null,
    end:   a?.mahadasha?.end   ?? a?.md?.end   ?? a?.mdEnd   ?? null,
  };
  const adRange = {
    start: a?.antardasha?.start ?? a?.ad?.start ?? a?.adStart ?? null,
    end:   a?.antardasha?.end   ?? a?.ad?.end   ?? a?.adEnd   ?? null,
  };
  const pdRange = {
    start: a?.pratyantardasha?.start ?? a?.pd?.start ?? a?.pdStart ?? null,
    end:   a?.pratyantardasha?.end   ?? a?.pd?.end   ?? a?.pdEnd   ?? null,
  };

  return {
    md: safeStr(md) || "Unknown",
    ad: safeStr(ad) || "Unknown",
    pd: safeStr(pd) || "Unknown",
    ranges: { md: mdRange, ad: adRange, pd: pdRange },
  };
};


  const pickBestWindow = (windows: any[], topic: string) => {
    if (!Array.isArray(windows) || windows.length === 0) return null;

    const q = (topic || "").toLowerCase();
    const scoreWin = (w: any) => {
      let s = 0;
      const focus = safeStr(w?.focusArea).toLowerCase();
      const driver = safeStr(w?.driver).toLowerCase();
      const summary = safeStr(w?.summary).toLowerCase();
      const tag = safeStr(w?.riskFlag).toLowerCase();

      // topic match boost
      if (q.includes("job") || q.includes("career")) {
        if (focus.includes("career") || focus.includes("status") || summary.includes("career")) s += 3;
        if (driver.includes("10") || driver.includes("sun") || driver.includes("saturn")) s += 1;
      }
      if (q.includes("relationship")) {
        if (focus.includes("relationship") || summary.includes("relationship")) s += 3;
      }
      if (q.includes("health")) {
        if (focus.includes("health") || summary.includes("health") || summary.includes("stress")) s += 3;
      }
      if (q.includes("money") || q.includes("wealth")) {
        if (focus.includes("money") || summary.includes("gains") || summary.includes("income")) s += 3;
      }

      // prefer windows with dates
      if (w?.from && w?.to) s += 1;
      // slight preference for opportunity over caution if equal
      if (tag === "opportunity") s += 0.25;
      return s;
    };

    return [...windows].sort((a, b) => scoreWin(b) - scoreWin(a))[0];
  };

  const normalizeTransitWindows = (r: any) => {
    const wins = Array.isArray(r?.transitWindows) ? r.transitWindows : [];
    // support both shapes:
    // {from,to,focusArea,driver,riskFlag,summary,actions}
    // OR {fromISO,toISO,label,tag,why,do}
    return wins.map((w: any) => {
      const from = w?.from ?? w?.fromISO ?? w?.startISO ?? w?.start ?? null;
      const to = w?.to ?? w?.toISO ?? w?.endISO ?? w?.end ?? null;
      return {
        from,
        to,
        focusArea: w?.focusArea ?? "",
        driver: w?.driver ?? "",
        riskFlag: w?.riskFlag ?? w?.tag ?? "",
        summary: w?.summary ?? w?.label ?? "",
        actions: Array.isArray(w?.actions) ? w.actions : Array.isArray(w?.do) ? w.do : [],
        why: Array.isArray(w?.why) ? w.why : [],
      };
    });
  };

  // ---------- base ----------
  if (!report) {
    return {
      question,
      hasReport: false,
      todayISO: isoDay(),
      note: "No life report / dasha context loaded.",
    };
  }

  const topic = detectTopic(question); // if detectTopic exists in this file
  const active = getActive(report);

  // natal flavour (Moon nakshatra etc.)
  const natal = (report as any)?.natal;
  let natalContext = "";
  if (natal?.moonNakshatra) {
    const theme =
      natal.moonNakshatraTheme && String(natal.moonNakshatraTheme).trim().length
        ? ` (${natal.moonNakshatraTheme})`
        : "";
    natalContext =
      `Moon nakshatra: ${natal.moonNakshatra}${theme}. ` +
      `Use this as the emotional “operating style” for the advice.`;
  }

  // Daily engines (you already have these)
  const foodGuide = buildFoodGuide(report);
  const dailyRhythm = buildDailyRhythm(report);

  // Timing windows: prefer report.transitWindows (most useful), then career brief, then next phases
  const transitWindows = normalizeTransitWindows(report);
  const bestWindow = pickBestWindow(transitWindows, String(topic));
  const bestWindowRange =
    bestWindow?.from && bestWindow?.to ? `${bestWindow.from} → ${bestWindow.to}` : "";

  // Evidence bullets: keep it factual (no invented claims)
  const evidence: string[] = [];
  evidence.push(`Active dasha: MD ${active.md}, AD ${active.ad}, PD ${active.pd}.`);

  if (bestWindowRange) {
    const driver = safeStr(bestWindow?.driver);
    const focus = safeStr(bestWindow?.focusArea);
    evidence.push(`Main window: ${bestWindowRange}${focus ? ` (${focus})` : ""}${driver ? ` — driver: ${driver}` : ""}.`);
  }

  // pull from your existing structured builders too
  const careerBrief = buildCareerBriefStructured({ report });
if (careerBrief?.type === "career_window" && (careerBrief as any)?.windowRange) {
  evidence.push(`Career timing: ${(careerBrief as any).windowRange}.`);
}

  const currentSummary = buildCurrentSummary(report);
  const nextPhases = buildNextPhases(report);

  // if your structured career brief has a windowRange, add it to evidence so model stops guessing
  const cbRange = safeStr((careerBrief as any)?.windowRange || "");
  if (cbRange) evidence.push(`Career timing (engine): ${cbRange}.`);

  // Add up to 2 “why” bullets if present in best window
  const why = Array.isArray(bestWindow?.why) ? bestWindow.why.slice(0, 3) : [];
  for (const w of why) {
    const s = safeStr(w);
    if (s) evidence.push(`Why: ${s}`);
  }

  // Output: make it explicit + compact
  return {
    question,
    topic,
    hasReport: true,
    todayISO: isoDay(),

    // Structured dasha (VERY important)
    activeDasha: {
      md: active.md,
      ad: active.ad,
      pd: active.pd,
      ranges: active.ranges,
    },

    // Existing summaries you already trust
    activePeriodSummary: currentSummary,
    nextPhasesSummary: nextPhases,
    careerTiming: careerBrief,

    // Short horizon tones
    dayTone: buildShortHorizon(report, "day"),
    weekTone: buildShortHorizon(report, "week"),
    monthTone: buildShortHorizon(report, "month"),

    // Windows for the model to reference (instead of “eclipses / jupiter / uranus” generic text)
    transitWindows: transitWindows.slice(0, 6),
    bestWindow: bestWindow
      ? {
          range: bestWindowRange || null,
          focusArea: safeStr(bestWindow.focusArea) || null,
          driver: safeStr(bestWindow.driver) || null,
          riskFlag: safeStr(bestWindow.riskFlag) || null,
          summary: safeStr(bestWindow.summary) || null,
          actions: Array.isArray(bestWindow.actions) ? bestWindow.actions.slice(0, 4) : [],
        }
      : null,

    // Remedies etc.
    remediesNow: buildRemedyAnswer(report),
    gemstoneNote: gemstoneAdvice(report, question),
    conceptExplainer: lookupAstroConcept(question),

    // Natal hint
    natalContext,

    // Daily engines
    foodGuide,
    dailyRhythm,

    // Key: evidence bullets the naturalizer can cite
    evidenceBullets: evidence.slice(0, 7),
  };
}
function topicWeight(topic: string, category?: string) {
  if (!category) return 0;

  const t = topic.toLowerCase();
  const c = category.toLowerCase();

  if (t === "career") {
    if (c === "career") return 3;
    if (c === "general") return 1;
  }

  if (t === "money") {
    if (c === "career") return 2;
    if (c === "general") return 1;
  }

  if (t === "relationships") {
    if (c === "relationships") return 3;
    if (c === "general") return 1;
  }

  if (t === "health") {
    if (c === "health") return 3;
  }

  if (t === "inner") {
    if (c === "inner") return 3;
  }

  return 0;
}
/* --------------------------------------------------
   POST handler
-------------------------------------------------- */

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as any;

    const question = String(body?.question ?? body?.message ?? "").trim();
    if (!question) return badJson("No question provided", 400);

    // Accept profile under either key
    const rawProfile = body?.profile ?? body?.birthProfile ?? null;
    const profile = normalizeProfile(rawProfile);

    console.log("[astro-chat] incoming profile", {
      hasProfile: !!rawProfile,
      rawKeys: rawProfile ? Object.keys(rawProfile) : [],
      normalized: profile
        ? {
            name: profile?.name,
            dobISO: profile?.dobISO,
            tob: profile?.tob,
            tz: profile?.place?.tz,
            lat: profile?.place?.lat,
            lon: profile?.place?.lon,
          }
        : null,
    });

    // report might be sent by client OR we can compute it from profile
    let report: any = body?.report ?? body?.reportData ?? null;

    // ✅ Some callers send { data, profile } wrapper. Unwrap to the actual report.
    if (report && typeof report === "object" && report.data && typeof report.data === "object") {
      report = report.data;
    }

    console.log("[astro-chat] incoming keys", Object.keys(body || {}));
    console.log("[astro-chat] has report?", !!report, report ? Object.keys(report) : null);

    console.log("[astro-chat] report timing snapshot", {
      hasActivePeriods: !!report?.activePeriods,
      timelineLen: Array.isArray(report?.timeline) ? report.timeline.length : 0,
      transitLen: Array.isArray(report?.transitWindows) ? report.transitWindows.length : 0,
    });

    // Minimum profile validation (only needed for PERSONALIZED mode)
    const profileOk =
      !!profile?.dobISO &&
      !!profile?.tob &&
      Number.isFinite(Number(profile?.place?.lat)) &&
      Number.isFinite(Number(profile?.place?.lon)) &&
      !!profile?.place?.tz;

    const reportHasTiming =
      !!report?.activePeriods ||
      (Array.isArray(report?.timeline) && report.timeline.length > 0) ||
      (Array.isArray(report?.transitWindows) && report.transitWindows.length > 0);

    // If we have a profile but no report/timing, build the report (personalized mode)
    if (profileOk && !reportHasTiming) {
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
        } else {
          const t = await lrRes.text();
          console.warn("[astro-chat] /api/life-report failed:", lrRes.status, t);
          report = null;
        }
      } catch (e: any) {
        console.warn("[astro-chat] could not build report:", e?.message || e);
        report = null;
      }
    }

    console.log("[astro-chat] profileOk:", profileOk, {
      name: profile?.name,
      dobISO: profile?.dobISO,
      tob: profile?.tob,
      tz: profile?.place?.tz,
      lat: profile?.place?.lat,
      lon: profile?.place?.lon,
    });
    console.log("[astro-chat] report keys", report ? Object.keys(report) : null);
    console.log("[astro-chat] has activePeriods?", !!report?.activePeriods, report?.activePeriods);
    console.log("[astro-chat] timeline len", Array.isArray(report?.timeline) ? report.timeline.length : null);
    console.log(
      "[astro-chat] transitWindows len",
      Array.isArray(report?.transitWindows) ? report.transitWindows.length : null
    );

    // Core mode switch
    const actAny = getActiveDashaAnyShape(report);
    const mdAny = actAny.md;
    const adAny = actAny.ad;

    const hasTiming =
      (mdAny && mdAny !== "Unknown") ||
      (adAny && adAny !== "Unknown") ||
      (Array.isArray(report?.timeline) && report.timeline.length > 0) ||
      (Array.isArray(report?.transitWindows) && report.transitWindows.length > 0);

    // ✅ If profile is valid, we are personalized even if report/timing didn't load
    const mode: "personalized" | "generic" = profileOk || hasTiming ? "personalized" : "generic";

    console.log("MODE CHECK", {
      hasProfile: !!profile,
      hasDOB: !!profile?.dobISO,
      hasTime: !!profile?.tob,
      hasPlace: !!profile?.place,
      hasReport: !!report,
      mode,
    });

   const routePlan = buildRoutePlan(question);
   
const topic = routePlan.domain;
const questionType = routePlan.questionType;

const { tone, depth } = pickToneAndDepth(question, topic);

console.log("[astro-chat] detected", {
  question,
  topic,
  questionType,
  family: routePlan.family,
  timeAnchor: routePlan.timeAnchor,
  gemstone: routePlan.gemstone,
});

// decide response size early
const formatTier: FormatTier =
  routePlan.isMicro ? "micro" : pickFormatTier(question);

console.log("[astro-chat] formatTier:", formatTier, "question:", question);


// 🔹 Food Engine (works in both modes)
if (
  isFoodQuestion(question) ||
  (routePlan.family === "daily_micro" &&
    /\b(eat|food|diet|khana|khaana)\b/i.test(question))
) {
  const foodText = buildFoodAnswer(report);
  
  return okJson({
    answer: foodText,
    copy: { answer: foodText, long: foodText },
    followupMode: "new",
    distressed: false,
  });
}
    // 🔹 Gemstone Engine
    if (routePlan.needsGemstoneLogic) {
      const gemText = buildGemstoneEngineAnswer({
        question,
        report,
        gemstone: routePlan.gemstone,
      });

      return okJson({
        answer: gemText,
        copy: { answer: gemText, long: gemText },
        followupMode: "new",
        distressed: false,
      });
    }
        // 🔹 Calendar Anchor Engine
    if (routePlan.needsCalendarLogic) {
      const calText = buildCalendarAnchorEngineAnswer({
        question,
        report,
        anchor: routePlan.timeAnchor,
        topic,
      });

      return okJson({
        answer: calText,
        copy: { answer: calText, long: calText },
        followupMode: "new",
        distressed: false,
      });
    }
    const moodHint = inferMood(question);
    const distressed = detectDistress(question);
    const distressSoothing = distressed ? reassureUser(topic) : "";
    const astroStressDriver = inferAstroStressDriver(report);
    const copingTip = pickCopingTip(astroStressDriver);

    const userId = "default";

    // memory of last few questions
    const prevArr = chatContext.get(userId) || [];
    prevArr.push(question);
    if (prevArr.length > MAX_HISTORY) prevArr.shift();
    chatContext.set(userId, prevArr);
    const history = prevArr.slice(-4).join("\n");

    // gather astro data
    const astroFacts = buildAstroFacts(question, report);
    lastFacts.set(userId, astroFacts);

    const followupMode = isShortFollowup(question) ? "short" : "new";

    const prevFollowKind = lastFollowup.get(userId) || "generic_deepen";
    const baseEvidence = buildWhyEvidence({ report, topic });

    // only build careerBrief if the question is actually career
const careerBrief = topic === "career" ? buildCareerBriefStructured({ report }) : null;

const evidenceBullets = [...(Array.isArray(baseEvidence) ? baseEvidence : [])];

// Keep evidence premium-facing: do not inject raw meta labels like Career window / Strength / Theme
// into the compact Q&A evidence block. Those belong in deeper views, not the main answer card.

const weightedTransitEvidence = pickBestTransitWindows(report, topic);

for (const w of weightedTransitEvidence.slice(0, 2)) {
  evidenceBullets.push(
    `Transit window ${fmtRange(w.from, w.to)} → ${w.focusArea || "general"}; driver: ${w.driver || "Transit"}${
      w.riskFlag ? `; tone: ${w.riskFlag}-leaning` : ""
    }`
  );
}

const dedupedEvidenceBullets = Array.from(new Set(evidenceBullets));

const dailyEvidenceBullets =
  questionType === "daily_outlook" || questionType === "daily_micro"
    ? Array.from(
        new Set(
          [
            report?.moonNakshatraTodayFact
              ? String(report.moonNakshatraTodayFact)
              : "",
            Array.isArray(report?.transitNowFacts) && report.transitNowFacts.length
              ? `Transit snapshot: ${report.transitNowFacts.slice(0, 3).join(" • ")}`
              : "",
            report?.activePeriods?.mahadasha?.lord || report?.activePeriods?.antardasha?.subLord
              ? `Active dasha stack → MD ${actAny.md} • AD ${actAny.ad} • PD ${actAny.pd}`
              : "",
          ].filter(Boolean)
        )
      )
    : dedupedEvidenceBullets;

const core =
  questionType === "daily_outlook"
    ? buildDailyOutlookCoreAnswer({
        mode,
        report,
        evidenceBullets: dailyEvidenceBullets,
      })
    : questionType === "daily_micro"
    ? buildDailyMicroCoreAnswer({
        mode,
        report,
        question,
        evidenceBullets: dailyEvidenceBullets,
      })
        : buildAskSarathiCoreAnswer({
        question,
        mode,
        report,
        topic,
        questionType,
        routeFamily: routePlan.family,
        distressed,
        distressSoothing,
        evidenceBullets: dedupedEvidenceBullets,
      });
    // signature of "today's astro window"
    const todayISO = new Date().toISOString().slice(0, 10);

    const actSig = getActiveDashaAnyShape(report);
    const maha = actSig.md === "Unknown" ? "" : actSig.md;
    const antar = actSig.ad === "Unknown" ? "" : actSig.ad;
    const praty = actSig.pd === "Unknown" ? "" : actSig.pd;

    const timingLoaded = Boolean(hasTiming);
    const activeTransit = pickActiveTransitNow(report);
    const transitKey = activeTransit ? `${activeTransit.driver || ""}|${activeTransit.focusArea || ""}` : "";

    const astroWindowSignature = [todayISO, maha, antar, praty, transitKey]
      .map((x) => String(x || "").toLowerCase().trim())
      .join("|");

    const questionSignature = question.toLowerCase().trim();
    
    const styleGuide = {
      vibe: "clear, warm, direct; modern astrology guide; no fluff",
      coreRules: [
  "Answer the user's question immediately. Do NOT stall with phrases like 'while I refresh...' or 'let me pull your chart'.",
  "If MODE=generic: answer as an astrology expert in general terms. Offer personalization in ONE short sentence at the end.",
  "If MODE=personalized: NEVER ask for birth details. Use astroFacts/report if present. If report is missing, answer using natal basics from profile (no excuses).",
  "If MODE=personalized and report/timing is missing: do NOT ask for birth details. Say: 'Open Life Report once so I can load your timing windows' (one short line).",
  "No psychoanalysis. No moral judgment. No doom. No fear messaging.",
  "If user asks timing: give a window + 2 actions + 1 risk to avoid. Keep it compact.",
  "Do NOT output the heading 'Why this (evidence)'. If the user explicitly asks why, use heading: 'Why (astro):'.",
  "Never say you're 'refreshing' or 'loading' timing windows.",
  "If MODE=personalized: do NOT mention any planet/transit unless it appears in EVIDENCE_BULLETS_JSON or ASTRO_FACTS_JSON.",
  "If user asks 'why': add a short 'Why (astro):' section with 2-4 bullets, grounded in the provided evidence only.",
  "The response must align with VERDICT_LINE and CORE_TIMING_SUMMARY. Do not contradict them.",
  "Never say that nothing will happen until a distant sub-period change. Always present the best available near-term window or positioning phase.",
  "If TIMING_STRENGTH is Supportive or Strong, describe the phase as usable now and explicitly say that selective movement is possible now.",
  "Do not describe a Supportive or Strong phase as blocked, inactive, or delayed until a distant date.",
  "Do not use phrases like 'next real shift', 'only after', or 'nothing meaningful until' unless TIMING_STRENGTH is Caution and no usable window exists.",
  "If a distant pivot date exists, mention it only as secondary background context, never as the main answer.",
  "Do not open the answer with 'there isn't a window right now' when TIMING_STRENGTH is Supportive or Strong.",
  "If DOMAIN_ASTRO_EVIDENCE is present, the answer should reflect natal baseline, dasha activation, and transit trigger together rather than sounding dasha-only.",
  "If QUESTION_TYPE is daily_outlook, answer like a practical daily astrology guide: describe today's tone, focus, and caution clearly without forcing a decision-window style answer.",
],
      formatting: ["Prefer short paragraphs and bullets.", "Never include placeholders like 'refreshing windows'."],
      avoid: ["No dumping raw dasha / transit data unless user asked 'why does it feel like this'.", "Don't sound like a horoscope blog.", "Don't blame them or say 'be positive'."],
    };

    const premiumFormatRules = `
TONE=${tone}
DEPTH=${depth}

Write like a trusted human advisor speaking directly to the user.

Use VERDICT_LINE as the anchor for the opening.
Use CORE_TIMING_SUMMARY as the anchor for the timing section.
If PRIMARY_TIMING_WINDOW exists, treat it as the best available window now.
If a distant pivot is mentioned anywhere in the evidence, treat it as background context only.

Structure the response using these sections:

Verdict  
Use the engine verdict directly in natural language.

What this phase means  
Explain the current phase simply and concretely.

What to focus on now  
Give 2–3 practical actions.

What to avoid  
Give 2–3 mistakes or risks.

Timing insight  
State the best available timing now. If supportive, say it is usable now. If mixed, say selective movement is possible. If caution, say move carefully.

Closing guidance  
End with calm, practical direction.

Hard rules:
- Never contradict VERDICT_LINE.
- Never contradict CORE_TIMING_SUMMARY.
- Never turn a supportive phase into a dead waiting phase.
- Never say 'next real shift' or 'only after' unless timing is clearly cautionary and no usable window exists.
- Never invent astrology not present in ASTRO_FACTS_JSON, EVIDENCE_BULLETS_JSON, or CORE.
- Keep the response under 190 words.
- If TIMING_STRENGTH is Supportive, say that selective movement is possible now.
- Do not begin the answer by denying current movement when timing is Supportive or Strong.
`.trim();

    const standardRules = `
Answer in 6-10 short lines.
No section headings unless truly needed.
Be direct and practical.
If you mention astrology, it must be supported by EVIDENCE_BULLETS_JSON or ASTRO_FACTS_JSON.
`.trim();

    const microRules = `
Answer in 1–2 short lines.
Do NOT use headings.
Give one clear suggestion + one short reason.
If you mention astrology, it must be supported by EVIDENCE_BULLETS_JSON or ASTRO_FACTS_JSON.
`.trim();

    const rules = formatTier === "premium" ? premiumFormatRules : formatTier === "micro" ? microRules : standardRules;
const baseChartFactors = buildBaseChartFactors({
  natal: {
    planets: report?.planets,
    houses: report?.houses, // if exists, else null
    ascSign: report?.ascSign,
    moonSign: report?.core?.moonSign,
    moonNakshatra: report?.core?.moonNakshatra,
  },
  d9: report?.vargas?.d9 || null,
  d10: report?.vargas?.d10 || null,
  activePeriods: report?.activePeriods,
  topTransits: report?.topTransits,
});

const professionFacts = buildProfessionFacts({
  natal: {
    planets: report?.planets,
    houses: report?.houses,
    ascSign: report?.ascSign,
  },
  d10: report?.vargas?.d10 || null,
  activePeriods: report?.activePeriods,
});
const careerReading = buildCareerReading({
  baseChartFactors,
  professionFacts,
});

console.log("FULL REPORT:", JSON.stringify(report, null, 2));
console.log("FULL REPORT KEYS:", report ? Object.keys(report) : null);
console.log("PROFESSION_FACTS:", professionFacts);
console.log("CAREER_READING:", careerReading);
console.log("REPORT PLANETS:", JSON.stringify(report?.planets, null, 2));
console.log("REPORT VARGAS:", JSON.stringify(report?.vargas, null, 2));
console.log("REPORT VARGAS D10:", JSON.stringify(report?.vargas?.d10, null, 2));
console.log("REPORT VARGAS D9:", JSON.stringify(report?.vargas?.d9, null, 2));

const isProfessionMicro =
  routePlan.family !== "timing" &&
  routePlan.family !== "decision" &&
  /\b(profession|current profession|what do i do|what kind of work)\b/i.test(question);
  const isJobVsBusinessMicro =
  routePlan.family !== "timing" &&
  routePlan.family !== "decision" &&
  /\b(job|service|business|job or business|service or business)\b/i.test(question);
  const marriageFacts = buildMarriageFacts({
  baseChartFactors,
});

const marriageReading = buildMarriageReading({
  baseChartFactors,
  marriageFacts,
});
const targetYear = extractYearFromQuestion(question);
const targetDateISO = targetYear ? `${targetYear}-07-01` : null;

const historicalTransitPlanets = targetDateISO
  ? await buildTransitSnapshotForDate({
      birth: {
        dateISO: report?.birthDateISO,
        tz: report?.birthTz,
        lat: report?.birthLat,
        lon: report?.birthLon,
      },
      targetDateISO,
    })
  : null;
  const historicalDegreeHits = historicalTransitPlanets
  ? buildDegreeHitsForDate({
      natalPlanets: report?.planets,
      transitPlanets: historicalTransitPlanets,
    })
  : [];
const historicalSnapshot = targetDateISO
  ? buildHistoricalSnapshot({
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
      transitPlanets: historicalTransitPlanets,
      topTransits: [],
      degreeHits: historicalDegreeHits,
      targetDateISO,
    })
  : null; 

  console.log("HISTORICAL TRANSIT PLANETS:", historicalTransitPlanets);
  console.log("HISTORICAL SNAPSHOT:", historicalSnapshot);
  console.log("HISTORICAL DEGREE HITS:", historicalDegreeHits);
const marriageEventVerification = historicalSnapshot
  ? buildMarriageEventVerification({
      baseChartFactors,
      marriageFacts,
      historicalSnapshot,
    })
  : null;
  const isMarriageVerification =
  /\bmarried\b/i.test(question) &&
  /\b(19|20)\d{2}\b/.test(question);
  console.log("TARGET YEAR:", targetYear);
console.log("HISTORICAL SNAPSHOT:", historicalSnapshot);
console.log("DASHA TIMELINE:", JSON.stringify(report?.dashaTimeline, null, 2));
console.log("MARRIAGE EVENT VERIFICATION:", marriageEventVerification);
    // payload for /api/naturalize
    const natPayload = {
  userQuestion: question,
  topic,
  questionType,
  routeFamily: routePlan.family,
  timeAnchor: routePlan.timeAnchor,
  gemstone: routePlan.gemstone,
  history,
  astroFacts,
  moodHint,
  mode,
  distressed,
  distressSoothing,
  astroStressDriver,
  copingTip,
  followupMode,
  lastFollowupKind: prevFollowKind,
  astroWindowSignature,
  questionSignature,
  evidenceBullets: questionType === "daily_outlook" || questionType === "daily_micro"
  ? dailyEvidenceBullets
  : dedupedEvidenceBullets,
  styleGuide,
  formatTier,
  formatRules: rules,
  tone,
  depth,
  timingLoaded,
  core,
  baseChartFactors,
  professionFacts,
  careerReading,
  marriageFacts,
  marriageReading,
  historicalSnapshot,
  marriageEventVerification,
  domainAstroEvidence: buildDomainAstroEvidence({ topic, report }),
  coreTimingSummary: core.timing.summary,
  timingStrength: core.timing.windows?.[0]?.strength || null,
  verdictLine: core.verdict.line,
  primaryTimingWindow: core.timing.windows?.[0] || null,
  natalSummary: `
Ascendant: ${report?.ascSign}
Moon: ${report?.core?.moonSign}
Nakshatra: ${report?.core?.moonNakshatra}
`,

natalPlacements: report?.planets || null,
houseLords: null,
};
if (
  questionType === "daily_outlook" ||
  questionType === "daily_micro"
) {
  const outText = cleanUnknown(
    core?.prose?.full || core?.prose?.short || "This phase is active."
  );

  return okJson({
    answer: outText,
    evidenceBullets: dailyEvidenceBullets,
    followupMode,
    distressed,
    copy: { answer: outText, long: outText },
    core: {
      ...core,
      prose: {
        short: core?.prose?.short || outText,
        full: outText,
      },
    },
  });
}
if (isProfessionMicro) {
  const outText = buildCareerMicroAnswer(careerReading);

  return okJson({
    answer: outText,
    evidenceBullets: dedupedEvidenceBullets,
    followupMode,
    distressed,
    copy: { answer: outText, long: outText },
    core: {
      ...core,
      prose: {
        short: outText,
        full: outText,
      },
    },
  });
}
if (isJobVsBusinessMicro) {
  const outText = buildJobVsBusinessMicroAnswer(careerReading);

  return okJson({
    answer: outText,
    evidenceBullets: dedupedEvidenceBullets,
    followupMode,
    distressed,
    copy: { answer: outText, long: outText },
    core: {
      ...core,
      prose: {
        short: outText,
        full: outText,
      },
    },
  });
}
if (isMarriageVerification && marriageEventVerification && targetYear) {
  const outText = buildMarriageEventVerificationAnswer(
    marriageEventVerification,
    targetYear
  );

  return okJson({
    answer: outText,
    evidenceBullets: [
      `Historical check year: ${targetYear}`,
      `Verdict: ${marriageEventVerification.verdict}`,
      ...marriageEventVerification.dashaSupport,
      ...marriageEventVerification.natalSupport,
      ...marriageEventVerification.divisionalSupport,
      ...marriageEventVerification.transitSupport,
    ].slice(0, 8),
    followupMode,
    distressed,
    copy: { answer: outText, long: outText },
    core: {
      prose: {
        short: outText,
        full: outText,
      },
      timing: {
        summary: `Historical verification for ${targetYear}`,
        windows: [],
      },
      verdict: {
        line: `${targetYear}: ${marriageEventVerification.verdict}`,
      },
    },
    historicalSnapshot,
    marriageEventVerification,
  });
}
   // ---- call /api/naturalize ----
let naturalJson: any = null;

try {
  const naturalizeURL = safeInternalURL(req, "/api/naturalize");
  console.log("[astro-chat] natPayload keys:", Object.keys(natPayload || {}));

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
        `Server said:\n${errText}\n\n` +
        `Tip: Check OPENAI_API_KEY / GPT_MODEL in .env.local, then restart dev server.`,
      followupMode,
      distressed,
      debug: true,
    });
  }

  naturalJson = await naturalRes.json();
} catch (e: any) {
  return okJson({
    answer:
      `⚠️ Could not reach /api/naturalize.\n\n${String(e?.message || e)}\n\n` +
      `Tip: Is the route file at src/app/api/naturalize/route.ts and exported as POST?`,
    followupMode,
    distressed,
    debug: true,
  });
}

// ✅ If we got a styled, human answer, return that as the MAIN visible answer
if (naturalJson?.text) {
  lastFollowup.set(userId, naturalJson.followupKind || "generic_deepen");

  const finalText = String(naturalJson.text || "").trim();

  const anchoredText =
  formatTier === "premium"
    ? finalText
        .replace(/^Verdict\s*$/im, "")
        .replace(/^Verdict\s*/i, "")
        .replace(/^Timing read\s*$/im, "")
        .replace(/^Timing read\s*/i, "")
        .replace(/^Confidence note\s*$/im, "")
        .replace(/^Confidence note\s*/i, "")
        .replace(/^There isn['’]t a sharply defined.*$/gim, "")
        .trim()
    : finalText;

  const outText = cleanUnknown(anchoredText)
    .replace(/The next real activation comes when your sub-period shifts.*$/gim, "")
    .replace(/The next sub-period change.*$/gim, "")
    .replace(/The next real shift.*$/gim, "")
    .replace(/There isn['’]t a sharply defined career shift window at this moment\.\s*/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // If model returned empty, fall back gracefully
  if (!outText) {
    const fallback =
      mode === "personalized"
        ? "I can answer this, but open Life Report once so I can load your timing windows."
        : "Ask your question with your birth details (DOB/TOB/City) for a precise timing-based answer.";

    return okJson({
      answer: fallback,
      evidenceBullets: dedupedEvidenceBullets,
      followupMode,
      distressed,
      copy: { answer: fallback, long: fallback },
      core: {
        ...core,
        prose: {
          short: core?.prose?.short || fallback,
          full: fallback,
        },
      },
    });
  }

  return okJson({
    answer: outText,
    evidenceBullets:
      routePlan.family === "daily_outlook" || routePlan.family === "daily_micro"
        ? dailyEvidenceBullets
        : dedupedEvidenceBullets,
    followupMode,
    distressed,
    copy: { answer: outText, long: outText },
    core: {
      ...core,
      prose: {
        short: outText,
        full: outText,
      },
    },
  });
}

// ✅ If /api/naturalize returned no text, do a safe fallback using astroFacts
const fallbackText =
  mode === "personalized"
    ? [
        "I can answer this, but I need one thing:",
        "Open Life Report once so I can load your timing windows and give precise dates.",
      ].join(" ")
    : "I can answer generally, but for precise timing I need your birth details (DOB, time, city).";

return okJson({
  answer: fallbackText,
  evidenceBullets: dedupedEvidenceBullets,
  followupMode,
  distressed,
  copy: { answer: fallbackText, long: fallbackText },
  core: {
    ...core,
    prose: {
      short: fallbackText,
      full: fallbackText,
    },
  },
  debug: true,
});
} catch (e: any) {
    console.error("[astro-chat] POST failed:", e?.message || e);
    return badJson(`Server error: ${String(e?.message || e)}`, 500);
  }
}
