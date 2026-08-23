export const runtime = "nodejs";

import "server-only";
import { NextResponse } from "next/server";
import OpenAI from "openai";

/*
  Sārathi naturalize route — rewritten to match the new generic astro-chat pipeline.

  What changed:
  - Removes dependence on old domain-specific payload blocks like CAREER_READING_JSON,
    MARRIAGE_READING_JSON, PROFESSION_FACTS_JSON, etc.
  - Prefers ONE generic structured bundle coming from astro-chat:
      - userQuestion
      - topic
      - questionType
      - astroFacts
      - evidenceBullets
      - tone / depth / confidence / formatRules
  - Keeps a plain text cleaner mode for other callers.
  - Produces a natural, direct Sārathi-style answer.
*/

/* ---------------- OpenAI setup (lazy) ---------------- */

const GPT_MODEL = process.env.GPT_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini";

let cachedClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (cachedClient) return cachedClient;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  cachedClient = new OpenAI({ apiKey });
  return cachedClient;
}

/* ---------------- helpers ---------------- */

function okJson(data: any, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function badJson(message: string, status = 400) {
  return okJson({ error: message, modelUsed: GPT_MODEL }, status);
}

function isNonEmptyString(x: any): x is string {
  return typeof x === "string" && x.trim().length > 0;
}

function safeStr(x: any): string {
  return typeof x === "string" ? x.trim() : "";
}

function looksTruncated(text?: string | null): boolean {
  const t = String(text ?? "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!t) return true;
  if (t.length < 20) return true;

  // clearly unfinished endings
  if (/[,:;(\-–]$/.test(t)) return true;

  // cut-off sentence patterns
  if (
  /\b(and|but|because|with|which|that|so|then|around|during|especially|showing)\s*$/i.test(t)
) {
  return true;
}

if (/what(?:'|’)s actually happening is\s*$/i.test(t)) return true;

if (/\bright now,?\s*$/i.test(t)) return true;
if (
  /\b(the main blocker.*is that|the main reason.*is that|this is because|right now,?)\s*$/i.test(t)
) {
  return true;
}
if (
  /\b(this means|which means|meaning that|therefore|so that)\s*$/i.test(t)
) {
  return true;
}
if (
  /\b(in real life,?\s*this means|practically,?\s*this means|this can show up as|which means)\s*$/i.test(t)
) {
  return true;
}

if (
  /\b(in real life,?\s*this means|practically,?\s*this means)\s+[a-z]{0,20}$/i.test(t)
) {
  return true;
}
if (
  /\b(in practical|in practical terms|practically|in real life|in real terms)\.?$/i.test(
    t
  )
) {
  return true;
}

if (
  /\b(if you act|if you use|if you prepare|if you move|the practical takeaway|the key takeaway)\s+[a-z\s]{0,40}$/i.test(
    t
  )
) {
  return true;
}
return false;
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

function buildVoiceBrief(body: any): string {
  const tone = safeStr(body?.tone || "neutral").toLowerCase();
  const questionType = safeStr(body?.questionType || "general").toLowerCase();
  const topic = safeStr(body?.topic || "general").toLowerCase();
  const distressed = Boolean(body?.distressed);
  const moodHint = safeStr(body?.moodHint);
  const depth = safeStr(body?.depth || "standard").toLowerCase();
  const confidenceLevel = safeStr(body?.confidenceLevel || body?.confidence).toLowerCase();
  const interactionIntent = safeStr(body?.interactionIntent).toLowerCase();
  const toneLine =
    tone === "strategist"
      ? "Voice: calm, sharp, perceptive, and timing-aware."
      : tone === "coach"
      ? "Voice: warm, encouraging, and human."
      : tone === "calm_protector"
      ? "Voice: grounding, gentle, and reassuring without sounding dramatic."
      : tone === "practical"
      ? "Voice: practical, clean, and useful."
      : tone === "direct"
      ? "Voice: direct, natural, emotionally intelligent, and slightly crisp."
      : "Voice: natural, intelligent, calm, and personal.";

 const questionLine =
  interactionIntent === "day_briefing"
    ? "Answer like a personal morning briefing: what the day feels like, what to use it for, and what to avoid."
    : interactionIntent === "decision_support"
    ? "Answer the practical decision first, then explain the astrology behind it."
    : interactionIntent === "timing_request"
    ? "Lead with the timing truth first. Keep it clean and avoid raw timing dumps."
    : interactionIntent === "root_cause"
    ? "Answer by naming the real cause first, then explain why it is happening."
    : interactionIntent === "comparison"
    ? "Compare the options directly first, then explain the astrology."
    : questionType === "diagnosis"
    ? "Answer by naming what is happening, then why it feels this way, then what it means."
    : questionType === "decision"
    ? "Answer clearly first, then explain the reasoning, then give the practical next step."
    : questionType === "timing"
    ? "Lead with the timing truth first. State whether the window is active, building, mixed, or delayed. Mention the broader phase before any shorter trigger inside it."
    : questionType === "emotional_support"
    ? "Acknowledge the feeling briefly, then interpret it, then ground the user."
    : questionType === "daily_outlook"
    ? "Keep it immediate, practical, and grounded in the next step."
    : "Answer like a real conversation, not like a report.";

  const topicLine =
    topic === "career"
      ? "Keep the answer strategic, practical, and decisive."
      : topic === "relationships" || topic === "marriage"
      ? "Keep the answer emotionally aware, nuanced, and non-dramatic."
      : topic === "health"
      ? "Keep the answer gentle, grounded, and non-alarming."
      : topic === "money"
      ? "Keep the answer sober, practical, and clear."
      : topic === "inner"
      ? "Keep the answer reflective, calm, and emotionally precise."
      : "Keep the answer natural and relevant.";

  const empathyLine = distressed
    ? "The user sounds emotionally loaded. Use one line of reassurance, but do not become melodramatic."
    : "Do not overdo empathy.";

  const insightAnswerMode = safeStr(body?.astroFacts?.insightProfile?.answerMode).toUpperCase();

const depthLine =
  insightAnswerMode === "DIAGNOSTIC_FIRST"
    ? "For diagnostic answers, write 120-180 words. Do not give a one-line answer. Include: what is blocking it, why it is happening, what the user may notice in real life, best use, and watch for."
    : depth === "micro"
    ? "Keep it short and punchy. Usually 60-100 words."
    : depth === "deep" || depth === "premium"
    ? "Go deeper, but stay tight. Usually 140-220 words."
    : "Keep it concise but complete. Usually 100-170 words.";

  const confidenceLine =
    confidenceLevel === "high"
      ? "Sound clear and assured. Do not hedge too much."
      : confidenceLevel === "medium"
      ? "Sound balanced and grounded. Be clear, but allow some nuance."
      : confidenceLevel === "low"
      ? "Sound careful and honest. Avoid overclaiming."
      : "Match confidence to the strength of the evidence.";

  const openingLine =
    questionType === "timing"
      ? "Open with the timing truth first."
      : questionType === "decision"
      ? "Open with the decision truth first."
      : "Open with a sharp insight, not a long setup.";

  return [
    toneLine,
    questionLine,
    topicLine,
    empathyLine,
    depthLine,
    confidenceLine,
    openingLine,
    moodHint ? `Mood signal: ${moodHint}.` : "",
    "Write like a highly perceptive astrology guide.",
    "Do not sound like a template, dashboard, report, or bot.",
    "Insight first, astrology second.",
    "Use astrology clearly enough that the user understands exactly why the answer was given. Do not hide the chart logic behind generic wording.",
    "Avoid labels like Verdict, Confidence, Timing read, Summary, or Why Sārathi said this.",
    "Avoid therapy-speak, motivational fluff, and generic life-coach phrasing.",
    "Use natural connectors sparingly, such as: 'This looks more like…', 'That’s why this feels…', or 'In real life, this can show up as…'.",
    "Keep it tight and non-repetitive.",
    "Do not explain the same point twice.",
    "For diagnostic answers, you may use short natural paragraphs. Do not collapse the answer into one line.",
    "Do not use bullet points or numbered lists unless FORMAT_RULES explicitly require them.",
    "Blend practical guidance naturally into the answer instead of listing it.",
    "Land the point and stop.",
  ]
    .filter(Boolean)
    .join(" ");
}

function buildSarathiSignature(body: any): string {
  const questionType = safeStr(body?.questionType || "general").toLowerCase();
  const topic = safeStr(body?.topic || "general").toLowerCase();

  const signatureBase = [
    "Sārathi voice should feel calm, clear, perceptive, and quietly confident.",
    "It should feel like a guide who sees what is really happening beneath the surface.",
    "Do not sound mystical, theatrical, preachy, or overly soft.",
    "Do not overuse astrology words when plain human language is stronger.",
    "The answer should feel intelligent enough to be trusted, but natural enough to feel personal.",
  ];

  const signatureByType =
    questionType === "timing"
      ? [
          "For timing questions, be decisive early.",
          "Say whether the window is open, building, mixed, or delayed within the first two lines.",
          "Give the broader phase early, then place shorter trigger windows inside it, and keep the answer lean.",
          "Do not present a single-day promise unless the evidence explicitly supports that level of precision.",
        ]
      : questionType === "decision"
      ? [
          "For decision questions, reduce ambiguity.",
          "Do not circle the point for too long before answering.",
        ]
      : questionType === "diagnosis"
      ? [
          "For diagnosis questions, name the hidden pattern clearly.",
          "Make the user feel understood before explaining the astrology.",
        ]
      : questionType === "emotional_support"
      ? [
          "For emotional questions, be grounding and precise.",
          "Comfort the user through clarity, not through excessive soothing language.",
        ]
      : ["Keep the answer clear, human, and useful."];

  const signatureByTopic =
    topic === "career"
      ? ["Career answers should feel strategic, sober, and practical."]
      : topic === "relationships" || topic === "marriage"
      ? ["Relationship answers should feel nuanced, emotionally intelligent, and non-dramatic."]
      : topic === "money"
      ? ["Money answers should feel measured, realistic, and clean."]
      : topic === "health"
      ? ["Health answers should feel gentle, calm, and non-alarming."]
      : ["Keep the answer grounded in real life."];

  return [...signatureBase, ...signatureByType, ...signatureByTopic].join(" ");
}

function buildGenericAstroFactsSummary(astroFacts: any): string[] {
  const out: string[] = [];

  const topic = safeStr(astroFacts?.topic);
  const questionType = safeStr(astroFacts?.questionType);
  const timeDirection = safeStr(astroFacts?.timeDirection);
  const eventScale = safeStr(astroFacts?.eventScale);
  const focusHouses = Array.isArray(astroFacts?.focusHouses)
    ? astroFacts.focusHouses
    : [];
  const supportHouses = Array.isArray(astroFacts?.supportHouses)
    ? astroFacts.supportHouses
    : [];
  const karakas = Array.isArray(astroFacts?.karakas)
    ? astroFacts.karakas
    : [];
  const divisionalCharts = Array.isArray(astroFacts?.divisionalCharts)
    ? astroFacts.divisionalCharts
    : [];
  const divisionalBreakdown = Array.isArray(astroFacts?.divisionalBreakdown)
    ? astroFacts.divisionalBreakdown
    : [];

  if (topic === "money" && divisionalBreakdown.length) {
    const hasStrongD2 = divisionalBreakdown.some(
      (x: any) => x?.chart === "D2" && x?.strength === "strong"
    );

    const hasModerateD10 = divisionalBreakdown.some(
      (x: any) =>
        x?.chart === "D10" &&
        (x?.strength === "moderate" || x?.strength === "mixed")
    );

    const hasWeakD10 = divisionalBreakdown.some(
      (x: any) =>
        x?.chart === "D10" &&
        (x?.strength === "weak" || x?.strength === "unclear")
    );

    if (hasStrongD2 && hasModerateD10) {
      out.push(
        "Money synthesis: wealth support exists, but gains depend more on effort and work than on a sudden jump."
      );
    } else if (hasStrongD2 && hasWeakD10) {
      out.push(
        "Money synthesis: wealth support exists, but income growth may be uneven or slower than expected."
      );
    } else {
      out.push(
        "Money synthesis: financial improvement looks gradual rather than sharp."
      );
    }
  }
if (topic === "health" && divisionalBreakdown.length) {
  const hasStrongD30 = divisionalBreakdown.some(
    (x: any) => x?.chart === "D30" && x?.strength === "strong"
  );
  const hasWeakD30 = divisionalBreakdown.some(
    (x: any) => x?.chart === "D30" && (x?.strength === "weak" || x?.strength === "unclear")
  );
  const hasStrongD9 = divisionalBreakdown.some(
    (x: any) => x?.chart === "D9" && x?.strength === "strong"
  );

  if (hasStrongD30 && hasStrongD9) {
    out.push("Health synthesis: stress or imbalance is active, but recovery strength is also present.");
  } else if (hasStrongD30) {
    out.push("Health synthesis: the chart shows a stronger stress or health-burden pattern, so symptoms may feel more persistent.");
  } else if (hasWeakD30) {
    out.push("Health synthesis: the chart does not show a major health-burden pattern, so this looks more fluctuating or routine-related than severe.");
  } else {
    out.push("Health synthesis: health patterns look mixed, so this is better read as imbalance or sensitivity rather than a sharp event.");
  }
}
  const currentDasha = astroFacts?.currentDasha ?? {};
  const answerSummary = safeStr(astroFacts?.answerSummary);
  const timingPolicy = astroFacts?.timingPolicy ?? null;

  if (timingPolicy?.dashaStrength) {
    out.push(`Dasha timing strength: ${timingPolicy.dashaStrength}`);
  }
  if (timingPolicy?.transitStrength) {
    out.push(`Transit timing strength: ${timingPolicy.transitStrength}`);
  }
  if (typeof timingPolicy?.allowSharpWindow === "boolean") {
    out.push(`Allow sharp window: ${timingPolicy.allowSharpWindow ? "yes" : "no"}`);
  }

  if (topic) out.push(`Topic: ${topic}`);
  if (questionType) out.push(`Question type: ${questionType}`);
  if (timeDirection) out.push(`Time direction: ${timeDirection}`);
  if (eventScale) out.push(`Event scale: ${eventScale}`);
  if (focusHouses.length) out.push(`Primary houses: ${focusHouses.join(", ")}`);
  if (supportHouses.length) out.push(`Support houses: ${supportHouses.join(", ")}`);
  if (karakas.length) out.push(`Karakas: ${karakas.join(", ")}`);
  if (divisionalCharts.length) {
    out.push(`Divisional charts: ${divisionalCharts.join(", ")}`);
  }

  const dashaParts = [
  currentDasha?.md,
  currentDasha?.ad,
  currentDasha?.pd,
].filter(Boolean);

const dashaLine = dashaParts.join("–");

if (dashaLine) {
  out.push(`Current dasha chain: ${dashaLine}`);
  out.push(
    `When explaining timing, refer to this as the user's ${dashaLine} dasha, not as generic active dasha.`
  );
}
  if (answerSummary && !astroFacts?.insightProfile) {
  out.push(`Synthesis: ${answerSummary}`);
}

  const promiseLayer = astroFacts?.promiseLayer;
  if (promiseLayer?.summary) {
    out.push(`D1 promise: ${promiseLayer.summary}`);
  }

  const divisionalLayer = astroFacts?.divisionalLayer;
  if (divisionalLayer?.summary) {
    out.push(`Divisional support: ${divisionalLayer.summary}`);
  }

  if (divisionalBreakdown.length) {
    const strong = divisionalBreakdown
      .filter((x: any) => x?.strength === "strong")
      .map((x: any) => x.chart);

    const moderate = divisionalBreakdown
      .filter((x: any) => x?.strength === "moderate" || x?.strength === "mixed")
      .map((x: any) => x.chart);

    const weak = divisionalBreakdown
      .filter((x: any) => x?.strength === "weak" || x?.strength === "unclear")
      .map((x: any) => x.chart);

    if (strong.length) {
      out.push(`Strong divisional support → ${strong.join(", ")}`);
    }
    if (moderate.length) {
      out.push(`Moderate divisional support → ${moderate.join(", ")}`);
    }
    if (weak.length) {
      out.push(`Weaker divisional support → ${weak.join(", ")}`);
    }
  }

  const karakaLayer = astroFacts?.karakaLayer;
  if (karakaLayer?.summary) {
    out.push(`Karaka support: ${karakaLayer.summary}`);
  }

  const timingLayer = astroFacts?.timingLayer;
  if (timingLayer?.summary) {
    out.push(`Timing: ${timingLayer.summary}`);
  }

  const timingConfidenceNote = safeStr(astroFacts?.timingConfidenceNote);
  if (timingConfidenceNote) {
    out.push(`Timing confidence note: ${timingConfidenceNote}`);
  }

  const remediesLayer = astroFacts?.remediesLayer;
  if (remediesLayer?.summary) {
    out.push(`Remedies: ${remediesLayer.summary}`);
  }

  const careerInference = astroFacts?.careerInference ?? null;
  if (careerInference) {
    if (careerInference.workType) {
      out.push(`Career work type: ${careerInference.workType}`);
    }
    if (careerInference.roleStyle) {
      out.push(`Career role style: ${careerInference.roleStyle}`);
    }
    if (careerInference.modeHint) {
      out.push(`Career mode hint: ${careerInference.modeHint}`);
    }
    if (careerInference.summaryLine) {
      out.push(`Career inference: ${careerInference.summaryLine}`);
    }
  }

  return out;
}

function buildTimingWindowsSummary(astroFacts: any): string[] {
  const rows =
    Array.isArray(astroFacts?.rankedTimingWindows) &&
    astroFacts.rankedTimingWindows.length
      ? astroFacts.rankedTimingWindows
      : Array.isArray(astroFacts?.timingWindows)
      ? astroFacts.timingWindows
      : [];

  return rows.slice(0, 3).map((row: any) => {
    const label = safeStr(row?.label);
    const start = row?.start ? String(row.start) : "";
    const end = row?.end ? String(row.end) : "";
    const peak = row?.peak ? String(row.peak) : "";
    const why = Array.isArray(row?.why) ? row.why.join("; ") : "";
    const confidence = safeStr(row?.confidence);
    const windowClass = safeStr(row?.windowClass);
    const practicalMeaning = safeStr(row?.practicalMeaning);

    const prettyPeak =
      peak && /^\d{4}-\d{2}$/.test(peak) ? formatMonthLabel(peak) : peak;
    const prettyStart =
      start && /^\d{4}-\d{2}$/.test(start) ? formatMonthLabel(start) : start;
    const prettyEnd =
      end && /^\d{4}-\d{2}$/.test(end) ? formatMonthLabel(end) : end;

    return [
      label ? `Window: ${label}` : "",
      prettyStart || prettyEnd
        ? `Range: ${prettyStart || "—"} to ${prettyEnd || "—"}`
        : "",
      prettyPeak ? `Peak: ${prettyPeak}` : "",
      confidence ? `Confidence: ${confidence}` : "",
      windowClass ? `Class: ${windowClass}` : "",
      practicalMeaning ? `Meaning: ${practicalMeaning}` : "",
      why ? `Why: ${why}` : "",
    ]
      .filter(Boolean)
      .join(" • ");
  });
}
function buildMajorTriggerTimingSummary(astroFacts: any): string[] {
  const majorWindows = Array.isArray(astroFacts?.majorWindows)
    ? astroFacts.majorWindows
    : [];

  const triggerWindows = Array.isArray(astroFacts?.triggerWindows)
    ? astroFacts.triggerWindows
    : [];

  const out: string[] = [];

  if (majorWindows.length) {
    out.push(
      `Primary structural windows: ${majorWindows
        .slice(0, 3)
        .map((w: any) => `${w.label} (${w.confidence}, score ${w.score ?? "—"}): ${w.reason}`)
        .join(" | ")}`
    );
  }

  if (triggerWindows.length) {
    out.push(
      `Near-term activation windows: ${triggerWindows
        .slice(0, 5)
        .map((w: any) => `${w.label} (${w.confidence}, score ${w.score ?? "—"}): ${w.reason}`)
        .join(" | ")}`
    );
  }

  return out;
}
function removeStaleTimingText(value: any): any {
  const staleTimingPattern =
    /major structural|structural .*window|appears around|timing shift|timing engine says|upcoming dasha or sub-period/i;

  if (typeof value === "string") {
    return staleTimingPattern.test(value) ? "" : value;
  }

  if (Array.isArray(value)) {
    return value
      .map(removeStaleTimingText)
      .filter((x) => x !== "" && x !== null && x !== undefined);
  }

  if (value && typeof value === "object") {
  if (
    staleTimingPattern.test(String(value?.factor ?? "")) ||
    staleTimingPattern.test(String(value?.role ?? ""))
  ) {
    return null;
  }

  const cleaned: any = {};

  for (const [key, val] of Object.entries(value)) {
    if (
      [
        "majorWindows",
        "nearTermWindows",
        "timingWindows",
        "astroTimeline",
        "nearestWindow",
        "strongestWindow",
      ].includes(key)
    ) {
      cleaned[key] = [];
      continue;
    }

    cleaned[key] = removeStaleTimingText(val);
  }

  return cleaned;
}

  return value;
}
function buildStructuredPrompt(body: any): string {
  const userQuestion = safeStr(body?.userQuestion);
  const topic = safeStr(body?.topic);
  const history = safeStr(body?.history);
  const questionType = safeStr(body?.questionType);
  const tone = safeStr(body?.tone);
  const depth = safeStr(body?.depth);
  const interactionIntent = safeStr(body?.interactionIntent);
  const distressed = Boolean(body?.distressed);
  const moodHint = safeStr(body?.moodHint);
  const confidenceLevel = safeStr(body?.confidenceLevel || body?.confidence);
  const voiceBrief = buildVoiceBrief(body);
  const signatureBrief = buildSarathiSignature(body);
  const isTimingPrompt =
  questionType === "timing";
  const astroFacts = body?.astroFacts ?? {};
  const domainIntelligence =
  body?.domainIntelligence ??
  null;
  const lines: string[] = [];
  const staleTimingPattern =
  /major structural|structural .*window|appears around|timing shift|timing engine says|upcoming dasha or sub-period/i;
  const astroJudgement =
    body?.astroJudgement ??
    astroFacts?.astroJudgement ??
    null;

 const rawEvidenceBullets = Array.isArray(body?.evidenceBullets)
  ? body.evidenceBullets
  : [];

const evidenceBullets =
  body?.selectedTimingWindow || body?.astroFacts?.selectedTimingWindow
    ? rawEvidenceBullets.filter(
        (x: any) =>
          !/major windows|major structural|structural .*window|appears around|timing shift|upcoming dasha or sub-period/i.test(
            String(x)
          )
      )
    : rawEvidenceBullets;

  const conversationPsychology = body?.conversationPsychology ?? null;
  const styleGuide = body?.styleGuide ?? null;

  const timeDirection = safeStr(astroFacts?.timeDirection || body?.timeDirection);
  const eventScale = safeStr(astroFacts?.eventScale || body?.eventScale);
  const formatTier = safeStr(body?.formatTier);
  const simpleGuidanceMode = Boolean(body?.simpleGuidanceMode);
  const formatRules = safeStr(body?.formatRules ?? body?.rules ?? body?.premiumFormatRules);
  const careerEventType = safeStr(astroFacts?.careerEventType || body?.careerEventType);

  const finalDecisionLine = safeStr(body?.finalDecisionLine);
  const finalDecisionVerdict = safeStr(body?.finalDecisionVerdict);
  const decisionSummary =
  body?.decisionSummary ?? null;

const timingHierarchy =
  body?.timingHierarchy ?? null;

const eventLifecycle =
  body?.eventLifecycle ?? null;
const planetReasoning =
  body?.planetReasoning ?? null;
  console.log("========== EVENT LIFECYCLE ==========");
console.log(JSON.stringify(eventLifecycle, null, 2));
console.log("=====================================");
  console.log("========== DECISION SUMMARY ==========");
console.log(JSON.stringify(decisionSummary, null, 2));
console.log("======================================");

  const verdict = safeStr(body?.verdict);
  const humanReason = safeStr(body?.humanReason);
  const astroReason = safeStr(body?.astroReason);

  const astroInterpretationPacket =
    astroFacts?.astroInterpretationPacket ?? null;

  const evidenceNarrative = astroFacts?.evidenceNarrative ?? null;
  const dailyAstroContext =
    body?.dailyAstroContext ??
    astroFacts?.dailyAstroContext ??
    null;

  const conversationContinuationSummary =
    body?.conversationContinuationSummary ?? null;

  const selectedTimingWindow =
    body?.selectedTimingWindow ?? astroFacts?.selectedTimingWindow ?? null;

  const nearestWindow =
    body?.nearestWindow ?? astroFacts?.nearestWindow ?? null;

  const strongestWindow =
    body?.strongestWindow ?? astroFacts?.strongestWindow ?? null;

  const bestAvailableWindow =
    body?.bestAvailableWindow ?? astroFacts?.bestAvailableWindow ?? null;

  const bestEventTrigger =
    body?.bestEventTrigger ?? astroFacts?.bestEventTrigger ?? null;

  const eventTriggers = Array.isArray(astroFacts?.eventTriggers)
    ? astroFacts.eventTriggers
    : [];

  const winningEvidence =
    body?.winningEvidence ?? astroFacts?.winningEvidence ?? null;

  const whyNotNow = Array.isArray(body?.whyNotNow)
    ? body.whyNotNow
    : Array.isArray(astroFacts?.whyNotNow)
    ? astroFacts.whyNotNow
    : [];

  const conversionDiagnosisV2 =
    body?.conversionDiagnosisV2 ??
    astroFacts?.conversionDiagnosisV2 ??
    null;

  const promotionConversionEngine =
    body?.promotionConversionEngine ??
    astroFacts?.promotionConversionEngine ??
    null;

  const strongestSupport =
    safeStr(body?.strongestSupport ?? astroFacts?.strongestSupport);

  const strongestBlocker =
    safeStr(body?.strongestBlocker ?? astroFacts?.strongestBlocker);

  const chartRealityProfile = astroFacts?.chartRealityProfile ?? null;
  const pastActivationProfile = astroFacts?.pastActivationProfile ?? null;
  const insightProfile = astroFacts?.insightProfile ?? null;
  const astroReasonMap = astroFacts?.astroReasonMap ?? null;
  const conversionDiagnosis =
  !selectedTimingWindow && !bestAvailableWindow
    ? astroInterpretationPacket?.conversionDiagnosis ?? null
    : null;

  const whyChain = astroInterpretationPacket?.whyChain ?? null;

  if (userQuestion) lines.push(`USER_QUESTION:\n${userQuestion}`);
  if (topic) lines.push(`\nTOPIC:\n${topic}`);
  if (questionType) lines.push(`\nQUESTION_TYPE:\n${questionType}`);
  if (careerEventType) lines.push(`\nCAREER_EVENT_TYPE:\n${careerEventType}`);
  if (timeDirection) lines.push(`\nTIME_DIRECTION:\n${timeDirection}`);
  if (eventScale) lines.push(`\nEVENT_SCALE:\n${eventScale}`);

  if (interactionIntent) {
    lines.push(`\nINTERACTION_INTENT:\n${interactionIntent}`);
  }

  if (conversationPsychology) {
    lines.push(
      `\nCONVERSATION_PSYCHOLOGY:\n${JSON.stringify(
        conversationPsychology,
        null,
        2
      )}`
    );
  }

  if (history) lines.push(`\nHISTORY:\n${history}`);
  if (conversationContinuationSummary) {
    lines.push(`\nPREVIOUS_REASONING:\n${conversationContinuationSummary}`);
  }

  if (tone) lines.push(`\nTONE:\n${tone}`);
  if (depth) lines.push(`\nDEPTH:\n${depth}`);
  if (confidenceLevel) lines.push(`\nCONFIDENCE_LEVEL:\n${confidenceLevel}`);
  lines.push(`\nDISTRESSED:\n${distressed ? "yes" : "no"}`);
  if (moodHint) lines.push(`\nMOOD_HINT:\n${moodHint}`);
  if (formatTier) lines.push(`\nFORMAT_TIER:\n${formatTier}`);

  if (simpleGuidanceMode) {
    lines.push("\nSIMPLE_GUIDANCE_MODE:\ntrue");
    body.formatTier = "micro";
  }

  if (formatRules) lines.push(`\nFORMAT_RULES:\n${formatRules}`);
  if (voiceBrief) lines.push(`\nVOICE_BRIEF:\n${voiceBrief}`);
  if (signatureBrief) lines.push(`\nSIGNATURE_BRIEF:\n${signatureBrief}`);

  if (finalDecisionVerdict) {
    lines.push(`\nFINAL_DECISION_VERDICT:\n${finalDecisionVerdict}`);
  }

  if (finalDecisionLine) {
    lines.push(`\nFINAL_DECISION_LINE:\n${finalDecisionLine}`);
  }
  if (decisionSummary) {
  lines.push(
    `\nDECISION_SUMMARY:\n${JSON.stringify(
      decisionSummary,
      null,
      2
    )}`
  );
}
if (timingHierarchy) {
  lines.push(
    `\nTIMING_HIERARCHY:\n${JSON.stringify(
      timingHierarchy,
      null,
      2
    )}`
  );
}
if (eventLifecycle) {
  lines.push(
    `\nEVENT_LIFECYCLE:\n${JSON.stringify(
      eventLifecycle,
      null,
      2
    )}`
  );
}
if (
  Array.isArray(planetReasoning) &&
  planetReasoning.length
) {
  lines.push(
    `\nPLANET_REASONING:\n${JSON.stringify(
      planetReasoning,
      null,
      2
    )}`
  );
}
  if (
  domainIntelligence?.available
) {
  lines.push(
    `\nDOMAIN_INTELLIGENCE:\n${JSON.stringify(
      domainIntelligence,
      null,
      2
    )}`
  );
}
  if (dailyAstroContext) {
    lines.push(
      `\nDAILY_ASTRO_CONTEXT:\n${JSON.stringify(dailyAstroContext, null, 2)}`
    );
  }

  if (evidenceBullets.length) {
    lines.push(
      `\nMANDATORY_CHART_EVIDENCE:\n${JSON.stringify(evidenceBullets, null, 2)}`
    );
  }

  /*
    Timing priority:
    1. BEST_EVENT_TRIGGER
    2. SELECTED_TIMING_WINDOW
    3. BEST_AVAILABLE_WINDOW
    4. nearest/strongest only if no selected window exists
  */

  if (bestEventTrigger && bestEventTrigger.confidence !== "low") {
    lines.push(
      `\nBEST_EVENT_TRIGGER:\n${JSON.stringify(bestEventTrigger, null, 2)}`
    );
  }

  if (selectedTimingWindow) {
    lines.push(
      `\nSELECTED_TIMING_WINDOW:\n${JSON.stringify(
        selectedTimingWindow,
        null,
        2
      )}`
    );
  } else if (bestAvailableWindow) {
    lines.push(
      `\nBEST_AVAILABLE_WINDOW:\n${JSON.stringify(
        bestAvailableWindow,
        null,
        2
      )}`
    );
  }

  if (!selectedTimingWindow && !bestAvailableWindow) {
    if (strongestWindow) {
      lines.push(
        `\nSTRONGEST_WINDOW:\n${JSON.stringify(strongestWindow, null, 2)}`
      );
    }

    if (nearestWindow) {
      lines.push(
        `\nNEAREST_WINDOW:\n${JSON.stringify(nearestWindow, null, 2)}`
      );
    }
  }

  if (winningEvidence) {
    lines.push(
      `\nWINNING_EVIDENCE:\n${JSON.stringify(winningEvidence, null, 2)}`
    );
  }

  if (strongestSupport) {
    lines.push(`\nSTRONGEST_SUPPORT:\n${strongestSupport}`);
  }

  if (strongestBlocker) {
    lines.push(`\nSTRONGEST_BLOCKER:\n${strongestBlocker}`);
  }

  if (whyNotNow.length) {
    lines.push(`\nWHY_NOT_NOW:\n${JSON.stringify(whyNotNow, null, 2)}`);
  }

  if (conversionDiagnosisV2) {
    lines.push(
      `\nCONVERSION_DIAGNOSIS_V2:\n${JSON.stringify(
        conversionDiagnosisV2,
        null,
        2
      )}`
    );
  }

  if (promotionConversionEngine) {
    lines.push(
      `\nPROMOTION_CONVERSION_ENGINE:\n${JSON.stringify(
        promotionConversionEngine,
        null,
        2
      )}`
    );
  }

  if (evidenceNarrative) {
    lines.push(
      `\nEVIDENCE_NARRATIVE:\n${JSON.stringify(evidenceNarrative, null, 2)}`
    );
  }

const astroJudgementForPrompt =
  astroJudgement && (selectedTimingWindow || bestAvailableWindow)
    ? {
        ...astroJudgement,
        verdict:
          astroJudgement.verdict &&
          /major structural|structural .*window|appears around|timing shift/i.test(
            String(astroJudgement.verdict)
          )
            ? ""
            : astroJudgement.verdict,
        strongestReason:
          astroJudgement.strongestReason &&
          /major structural|structural .*window|appears around|timing shift/i.test(
            String(astroJudgement.strongestReason)
          )
            ? ""
            : astroJudgement.strongestReason,
        why: Array.isArray(astroJudgement.why)
          ? astroJudgement.why.filter(
              (x: any) =>
                !/major structural|structural .*window|appears around|timing shift/i.test(
                  String(x)
                )
            )
          : astroJudgement.why,
      }
    : astroJudgement;

if (astroJudgementForPrompt) {
  lines.push(
    `\nASTRO_JUDGEMENT:\n${JSON.stringify(
      astroJudgementForPrompt,
      null,
      2
    )}`
  );
}

 
const astroInterpretationPacketForPrompt =
  astroInterpretationPacket && (selectedTimingWindow || bestAvailableWindow)
    ? {
        ...astroInterpretationPacket,

        promise: {
          ...astroInterpretationPacket.promise,
          reasons: Array.isArray(astroInterpretationPacket.promise?.reasons)
            ? astroInterpretationPacket.promise.reasons.filter(
                (x: any) => !staleTimingPattern.test(String(x))
              )
            : astroInterpretationPacket.promise?.reasons,
        },

        timing: {
          ...astroInterpretationPacket.timing,
          nearTermWindows: [],
          majorWindows: [],
          nearTermScore: undefined,
          majorScore: undefined,
          timingNote:
  "Use TIMING_HIERARCHY as the timing structure when available. practicalWindow is the main actionable period, broaderWindow is context, and activationWindow is only a narrower trigger. Use SELECTED_TIMING_WINDOW only as fallback evidence when TIMING_HIERARCHY is unavailable.",
        },
      }
    : astroInterpretationPacket;
if (
  JSON.stringify(astroInterpretationPacketForPrompt).includes(
    "major structural"
  )
) {
  
}
if (
  !isTimingPrompt &&
  astroInterpretationPacketForPrompt
) {
  lines.push(
    `\nASTRO_INTERPRETATION_PACKET:\n${JSON.stringify(
      removeStaleTimingText(astroInterpretationPacketForPrompt),
      null,
      2
    )}`
  );
}

  if (whyChain) {
    lines.push(`\nWHY_CHAIN:\n${JSON.stringify(whyChain, null, 2)}`);
  }

  if (insightProfile) {
    lines.push(
      `\nINSIGHT_PROFILE_JSON:\n${JSON.stringify(insightProfile, null, 2)}`
    );
  }

  const astroReasonMapForPrompt =
  selectedTimingWindow || bestAvailableWindow
    ? removeStaleTimingText(astroReasonMap)
    : astroReasonMap;

if (
  !isTimingPrompt &&
  astroReasonMapForPrompt
) {
  lines.push(
    `\nASTRO_REASON_MAP:\n${JSON.stringify(
      astroReasonMapForPrompt,
      null,
      2
    )}`
  );
}

  if (conversionDiagnosis) {
    lines.push(
      `\nCONVERSION_DIAGNOSIS:\n${JSON.stringify(
        conversionDiagnosis,
        null,
        2
      )}`
    );
  }

  if (chartRealityProfile) {
    lines.push(
      `\nCHART_REALITY_PROFILE:\n${JSON.stringify(
        chartRealityProfile,
        null,
        2
      )}`
    );
  }

  if (chartRealityProfile?.lifeEvidenceReasons) {
    lines.push(
      `\nLIFE_EVIDENCE_REASONS:\n${JSON.stringify(
        chartRealityProfile.lifeEvidenceReasons,
        null,
        2
      )}`
    );
  }

  if (chartRealityProfile?.contradictions?.length) {
    lines.push(
      `\nIMPORTANT_REALITY_CHECK:\n${chartRealityProfile.contradictions.join(
        "\n"
      )}`
    );
  }

  if (
  !isTimingPrompt &&
  pastActivationProfile
) {
    lines.push(
      `\nPAST_ACTIVATION_PROFILE:\n${JSON.stringify(
        pastActivationProfile,
        null,
        2
      )}`
    );
  }


const safeVerdict =
  selectedTimingWindow || bestAvailableWindow
    ? staleTimingPattern.test(verdict)
      ? ""
      : verdict
    : verdict;

const safeHumanReason =
  selectedTimingWindow || bestAvailableWindow
    ? staleTimingPattern.test(humanReason)
      ? ""
      : humanReason
    : humanReason;

const safeAstroReason =
  selectedTimingWindow || bestAvailableWindow
    ? staleTimingPattern.test(astroReason)
      ? ""
      : astroReason
    : astroReason;

if (safeVerdict) lines.push(`\nVERDICT:\n${safeVerdict}`);
if (safeHumanReason) lines.push(`\nHUMAN_REASON:\n${safeHumanReason}`);
if (safeAstroReason) lines.push(`\nASTRO_REASON:\n${safeAstroReason}`);

  if (!selectedTimingWindow && !bestAvailableWindow) {
    const astroSummary = buildGenericAstroFactsSummary(astroFacts);
    if (astroSummary.length) {
      lines.push(
        `\nASTRO_SUMMARY_BULLETS:\n${JSON.stringify(astroSummary, null, 2)}`
      );
    }

    const timingSummary = buildTimingWindowsSummary(astroFacts);
    if (timingSummary.length && !bestEventTrigger) {
      lines.push(
        `\nTIMING_WINDOWS:\n${JSON.stringify(timingSummary, null, 2)}`
      );
    }
  }

  

const astroFactsForPrompt =
  isTimingPrompt
    ? {
        topic:
          astroFacts?.topic ?? null,

        questionType:
          astroFacts?.questionType ?? null,

        timeDirection:
          astroFacts?.timeDirection ?? null,

        eventType:
          astroFacts?.eventType ?? null,

        careerEventType:
          astroFacts?.careerEventType ?? null,

        eventScale:
          astroFacts?.eventScale ?? null,

        focusHouses:
          Array.isArray(astroFacts?.focusHouses)
            ? astroFacts.focusHouses
            : [],

        supportHouses:
          Array.isArray(astroFacts?.supportHouses)
            ? astroFacts.supportHouses
            : [],

        karakas:
          Array.isArray(astroFacts?.karakas)
            ? astroFacts.karakas
            : [],

        divisionalCharts:
          Array.isArray(
            astroFacts?.divisionalCharts
          )
            ? astroFacts.divisionalCharts
            : [],

        currentDasha:
          astroFacts?.currentDasha ?? null,

        promiseLayer:
          astroFacts?.promiseLayer ?? null,

        sambandhaAnalysis:
          astroFacts?.sambandhaAnalysis
            ? {
                summary:
                  astroFacts.sambandhaAnalysis
                    .summary ?? null,

                connectivityScore:
                  astroFacts.sambandhaAnalysis
                    .connectivityScore ?? null,

                dashaConnectivityScore:
                  astroFacts.sambandhaAnalysis
                    .dashaConnectivityScore ??
                  null,

                supportiveLinks:
                  Array.isArray(
                    astroFacts.sambandhaAnalysis
                      .supportiveLinks
                  )
                    ? astroFacts.sambandhaAnalysis
                        .supportiveLinks
                        .slice(0, 4)
                    : [],
              }
            : null,

        divisionalLayer:
          astroFacts?.divisionalLayer ?? null,

        karakaLayer:
          astroFacts?.karakaLayer ?? null,

        timingPolicy:
          astroFacts?.timingPolicy ?? null,

        selectedTimingWindow:
          selectedTimingWindow ?? null,
      }
    : astroFacts;

lines.push(
  `\nASTRO_FACTS_JSON:\n${JSON.stringify(
    astroFactsForPrompt ?? {},
    null,
    2
  )}`
);

  if (eventTriggers.length && !selectedTimingWindow && !bestAvailableWindow) {
    lines.push(
      `\nEVENT_TRIGGERS:\n${JSON.stringify(eventTriggers.slice(0, 5), null, 2)}`
    );
  }

  if (styleGuide) {
    lines.push(`\nSTYLE_GUIDE_JSON:\n${JSON.stringify(styleGuide, null, 2)}`);
  }
const finalPrompt = lines.join("\n");
console.log(
  "========== NATURALIZER V3.5 PROMPT CHECK =========="
);

console.log(
  "Has PLANET_REASONING:",
  finalPrompt.includes(
    "PLANET_REASONING:"
  )
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
  "Prompt length:",
  finalPrompt.length
);

console.log(
  "===================================================="
);
const staleNeedles = [
  "The major structural property purchase window",
  "Major windows:",
  "Major structural window",
  "6 Dec 2026 to 27 Jan 2027",
  "Venus PD timing shift",
  "Venus is relevant to property through karaka/dasha linkage",
];

for (const needle of staleNeedles) {
  let idx = finalPrompt.indexOf(needle);

  while (idx !== -1) {
    const before = finalPrompt.slice(Math.max(0, idx - 1200), idx);
    const after = finalPrompt.slice(idx, idx + 1200);

    const sectionMatch = before.match(/\n[A-Z_]+:\n/g);
    const section =
      sectionMatch && sectionMatch.length
        ? sectionMatch[sectionMatch.length - 1].trim()
        : "UNKNOWN_SECTION";

   

    idx = finalPrompt.indexOf(needle, idx + needle.length);
  }
}

return finalPrompt;

}

function buildStructuredSystemPrompt(): string {
  const contract = {
    role: {
      identity: "Sārathi",
      function:
        "Explain the supplied Vedic astrology conclusions naturally, accurately, and practically. Do not independently recalculate or reinterpret the astrology.",
    },

    authority: [
      "DECISION_SUMMARY",
      "TIMING_HIERARCHY",
      "EVENT_LIFECYCLE",
      "PLANET_REASONING",
      "DOMAIN_INTELLIGENCE",
      "PROMOTION_CONVERSION_ENGINE",
      "CONVERSION_DIAGNOSIS_V2",
      "WINNING_EVIDENCE",
      "MANDATORY_CHART_EVIDENCE",
      "SELECTED_TIMING_WINDOW",
      "BEST_EVENT_TRIGGER",
      "BEST_AVAILABLE_WINDOW",
      "ASTRO_INTERPRETATION_PACKET",
      "ASTRO_FACTS_JSON",
    ],

    timingHierarchy: {
  authority:
    "TIMING_HIERARCHY is the single source of truth for timing structure.",

  broaderWindow:
    "The broader dasha-backed opportunity season. Use as context, not usually as the direct answer when a practicalWindow exists.",

  practicalWindow:
    "The main actionable timing window. This is the direct answer to 'when' for major life events whenever present.",

  activationWindow:
    "A narrower trigger or peak inside the practical window. Never present this as the overall timing answer when practicalWindow exists.",

  stage:
    "Use this to explain whether the native is in preparation, opportunity, activation, conversion, completion, or stabilization.",

  rules: [
    "For major life events, practicalWindow is the primary user-facing timing answer whenever present.",
    "broaderWindow provides the larger dasha context.",
    "activationWindow is only a narrower trigger, peak, or catalyst.",
    "Never collapse practicalWindow into activationWindow.",
    "Never present activationWindow as the strongest overall window when practicalWindow exists.",
    "Never replace TIMING_HIERARCHY with SELECTED_TIMING_WINDOW or BEST_EVENT_TRIGGER.",
    "DECISION_SUMMARY must agree with TIMING_HIERARCHY and remains authoritative for the final conclusion.",
    "If practicalWindow is null, use broaderWindow.",
    "If both practicalWindow and broaderWindow are null, only then fall back to lower-priority timing sources.",
  ],
},

    domainPolicy: {
      profession:
        "Use DOMAIN_INTELLIGENCE for permanent profession suitability and career fit.",

      business:
        "Separate permanent entrepreneurial suitability from launch timing.",

      promotion:
        "Use PROMOTION_CONVERSION_ENGINE when available.",

      marriage:
        "Use natal promise, D9 confirmation, dasha activation, lifecycle, and transit triggers.",

      property:
        "Distinguish search, planning, finance, negotiation, registration, possession, and completion.",

      vehicle:
        "Distinguish purchase intent, finance, booking, delivery, and ownership.",

      health:
        "Remain non-diagnostic and do not substitute astrology for medical care.",
    },

    explanationPolicy: {
      order: [
        "direct answer",
        "strongest chart reason",
        "broader supporting astrology",
        "real-world meaning",
        "practical takeaway",
      ],

      chartLogic: [
        "Natal promise establishes whether the event is structurally supported.",
        "Dasha establishes whether the theme is active.",
        "Planetary relationships explain how the theme operates.",
        "Divisional charts confirm or qualify the promise.",
        "Transits act as triggers.",
        "Conversion analysis distinguishes movement from durable outcome.",
      ],

      rules: [
        "Do not merely list planets or houses.",
        "Explain why each cited factor matters.",
        "Use exact supplied chart evidence when available.",
        "Do not invent placements, dignities, yogas, aspects, or dates.",
      ],
    },

    responseStyle: {
      directAnswerFirst: true,
      humanAstrologerTone: true,
      calm: true,
      practical: true,
      conciseButSubstantive: true,

      sequence: [
        "answer",
        "why",
        "what it means in real life",
        "what to do",
      ],

      bannedInternalTerms: [
        "DECISION_SUMMARY",
        "EVENT_LIFECYCLE",
        "SELECTED_TIMING_WINDOW",
        "BEST_AVAILABLE_WINDOW",
        "BEST_EVENT_TRIGGER",
        "ASTRO_FACTS_JSON",
        "engine",
        "packet",
        "score",
        "verdict",
      ],

      bannedGenericPhrases: [
        "trust the process",
        "stay positive",
        "things take time",
        "everything happens for a reason",
        "the universe is guiding you",
      ],
    },
  };

  return `
You are Sārathi, an experienced Vedic astrologer.

The astrology engine has already completed the calculation and judgement.
Your role is to explain the supplied conclusion clearly, naturally, and practically.

Follow this behavioral contract exactly:

${JSON.stringify(contract, null, 2)}

Additional hard rules:

- DECISION_SUMMARY is the final authoritative conclusion when present.
- Never override a higher-priority source using a lower-priority source.
- Do not perform independent astrology reasoning when the engine has already supplied the conclusion.
- For major life-event timing, broader dasha-backed opportunity periods outrank isolated transit dates.
- A transit date may be described as an activation point, trigger, peak, or movement date, but not as a guaranteed completion date unless explicitly supplied as such.
- If a lifecycle stage is null, do not invent it.
- Translate technical astrology into real-life consequences.
- When PLANET_REASONING is provided, use it as the authoritative explanation of why the planets support or weaken the prediction. Do not invent alternative planetary reasoning.
- Do not merely list planets, houses or dasha factors.
- Explain what each important planet means in the user's real-life situation.
- For example, instead of saying Mercury, Mars and Jupiter are active, explain that Mercury supports thinking, communication or commercial judgement, Mars adds initiative and execution, and Jupiter expands opportunity or growth.
- Use astrology evidence to explain the mechanism behind the prediction rather than simply proving calculations were performed.
- Avoid repetitive phrases such as "relevant houses activated", "relevant karakas involved" or "this timing is based on" unless the user specifically requests technical reasoning.
- Keep technical evidence in supporting explanations, while the main narrative should read like an experienced astrologer speaking to a client.
- If activationWindow occurs before the practicalWindow, describe it as an early signal, preparatory trigger, opening conversation or momentum-building point rather than as the launch date.
- If activationWindow falls inside the practicalWindow, describe it as a catalyst or sharper peak within the main actionable period.
- Never make the activationWindow appear more important than the practicalWindow.
- Answer the user's actual question first.
- Return only the final user-facing answer.
- For major-event timing, TIMING_HIERARCHY.practicalWindow is the direct answer whenever present.
- TIMING_HIERARCHY.broaderWindow is the broader dasha opportunity context.
- TIMING_HIERARCHY.activationWindow is only a trigger or peak inside the practical window.
- Never reduce a practical date range to a single activation date.
- Never call the activation date the main window when a practical window exists.
`.trim();
}
function buildCleanerSystemPrompt(): string {
  return [
    "You are Sārathi's language cleaner.",
    "Your job is to gently rewrite short texts so they sound natural, clear, and human.",
    "Keep the meaning the same, just smoother and easier to read.",
    "No emojis, no hashtags, no bullet lists unless the input already uses them.",
    "Do not add new ideas or advice.",
    "Reply with the improved text only.",
  ].join(" ");
}

function buildStyleHint(style: "casual" | "formal" | "neutral") {
  return style === "casual"
    ? "Tone: warm, conversational, but still respectful."
    : style === "formal"
    ? "Tone: polite, professional, and clear."
    : "Tone: balanced, simple, and neutral.";
}
function buildProfessionFallbackAnswer(body: any): string | null {
  const astroFacts = body?.astroFacts ?? {};
  const careerInference = astroFacts?.careerInference ?? null;

  if (!careerInference) return null;

  const workMap: Record<string, string> = {
    consulting_advisory: "consulting, guidance, or advisory work",
    finance_banking: "finance or banking-related work",
    construction_real_estate: "construction, building, or real-estate-linked work",
    technical_it: "technical or IT work",
    operations_administration: "operations or administrative work",
    government_institutional: "government or institutional work",
    trading_commercial: "trading or commercial work",
    sales_business_development: "sales or business-development work",
    manufacturing_infrastructure: "manufacturing or infrastructure-linked work",
    general_structured_work: "structured professional work",
  };

  const roleMap: Record<string, string> = {
    advisor_consultant: "with an advisor or consultant style",
    owner_operator: "with a hands-on owner-operator style",
    manager_operator: "with a manager/operator style",
    backend_structural: "with a backend or structural role style",
    client_facing: "with a client-facing role style",
    decision_maker: "with a decision-making role style",
    technical_executor: "with a technical execution style",
  };

  const modeMap: Record<string, string> = {
    independent: "This looks more self-directed than institution-led.",
    employment: "This looks more institution-led than fully independent.",
    mixed: "This looks like a mixed professional pattern.",
  };

  const workText =
    workMap[String(careerInference?.workType ?? "")] ?? "professional work";
  const roleText =
    roleMap[String(careerInference?.roleStyle ?? "")] ?? "with a structured role style";
  const modeText =
    modeMap[String(careerInference?.modeHint ?? "")] ?? "";

  return `Your work points most strongly to ${workText}, ${roleText}. ${modeText}`.trim();
}
function buildFallbackStructuredAnswer(body: any): string {
  const userQuestion = safeStr(body?.userQuestion);
  const questionType = safeStr(body?.questionType).toLowerCase();
  const astroFacts = body?.astroFacts ?? {};
  const topic = safeStr(astroFacts?.topic || body?.topic).toLowerCase();
  const timeDirection = safeStr(astroFacts?.timeDirection).toLowerCase();
  const answerSummary = safeStr(astroFacts?.answerSummary);
  const timingLayerSummary = safeStr(astroFacts?.timingLayer?.summary);
  const promiseLayerSummary = safeStr(astroFacts?.promiseLayer?.summary);
  const timingHierarchy =
  body?.timingHierarchy ??
  null;

const practicalWindow =
  timingHierarchy?.practicalWindow ??
  null;

const broaderWindow =
  timingHierarchy?.broaderWindow ??
  null;

const activationWindow =
  timingHierarchy?.activationWindow ??
  null;

const bestAvailableWindow =
  body?.bestAvailableWindow ??
  astroFacts?.bestAvailableWindow ??
  null;

const fallbackWindow =
  practicalWindow ??
  broaderWindow ??
  bestAvailableWindow ??
  null;

  const professionFallback = buildProfessionFallbackAnswer(body);
  if (topic === "career" && timeDirection === "identity" && professionFallback) {
    return professionFallback;
  }

  if (questionType === "timing") {
  const practicalLabel =
    practicalWindow?.start &&
    practicalWindow?.end
      ? `${fmtDateShort(
          practicalWindow.start
        )} to ${fmtDateShort(
          practicalWindow.end
        )}`
      : null;

  const broaderLabel =
    broaderWindow?.start &&
    broaderWindow?.end
      ? `${fmtDateShort(
          broaderWindow.start
        )} to ${fmtDateShort(
          broaderWindow.end
        )}`
      : null;

  const activationLabel =
    activationWindow?.peak ??
    activationWindow?.start ??
    null;

  const activationText =
    activationLabel
      ? ` Around ${fmtDateShort(
          activationLabel
        )} there may be a sharper activation point within that phase.`
      : "";

  if (practicalLabel) {
    return (
      `The most actionable timing window runs from ${practicalLabel}.` +
      (broaderLabel
        ? ` This sits within a broader opportunity period from ${broaderLabel}.`
        : "") +
      activationText
    );
  }

  if (broaderLabel) {
    return (
      `The broader opportunity period runs from ${broaderLabel}.` +
      activationText
    );
  }

  if (fallbackWindow?.label) {
    return `The clearest available timing window is ${fallbackWindow.label}.`;
  }

  return (
    answerSummary ||
    timingLayerSummary ||
    "A reliable timing window is not clearly available from the current data."
  );
}

  if (questionType === "decision") {
    return `${answerSummary || "The chart supports a measured approach here."} ${timingLayerSummary || "Timing is not completely closed, but it should be handled with realism."}`.trim();
  }

  if (questionType === "remedy") {
    const remediesLayer = astroFacts?.remediesLayer;
    const bullets = Array.isArray(remediesLayer?.bullets) ? remediesLayer.bullets : [];
    if (bullets.length) {
      return `The remedy direction should follow the actual chart logic, not a random fix. ${bullets[0]}${bullets[1] ? ` ${bullets[1]}` : ""}`.trim();
    }
    return "A remedy should only be suggested if it matches the actual chart promise, relevant houses, and active dasha.";
  }

  return [
    answerSummary || "Here is the clearest chart-based reading from the current data.",
    promiseLayerSummary,
    timingLayerSummary,
    userQuestion ? "That is the main chart-based answer to your question." : "",
  ]
    .filter(Boolean)
    .join(" ")
    .trim();
}

/* ---------------- route ---------------- */

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as any;

    const style = (body?.style as "casual" | "formal" | "neutral") ?? "neutral";

    const rawA = body?.text ?? body?.input;
    const hasStructured =
      isNonEmptyString(body?.userQuestion) ||
      body?.astroFacts != null ||
      Array.isArray(body?.evidenceBullets);

    const useStructuredPrompt = hasStructured;
    const raw = useStructuredPrompt
      ? buildStructuredPrompt(body)
      : isNonEmptyString(rawA)
      ? String(rawA)
      : "";

    if (!isNonEmptyString(raw)) {
      return badJson(
        "Missing 'text' (or 'input'). If calling from astro-chat, send userQuestion + astroFacts/evidenceBullets.",
        400
      );
    }
    
    const styleHint = buildStyleHint(style);
    const systemPrompt = useStructuredPrompt
      ? buildStructuredSystemPrompt()
      : buildCleanerSystemPrompt();

    const formatTier = safeStr(body?.formatTier || body?.tier).toLowerCase();
        const maxTokens =
  formatTier === "micro"
    ? 350
    : formatTier === "deep"
    ? 2200
    : 1800;

    try {
      const client = getOpenAIClient();

      const completion = await client.chat.completions.create({
        model: GPT_MODEL,
        temperature: useStructuredPrompt ? 0.35 : 0.2,
        max_tokens: maxTokens,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `${styleHint}\n\n${useStructuredPrompt ? "INPUT_BUNDLE:" : "Original text:"}\n${raw}`,
          },
        ],
      });
const finishReason =
  completion.choices[0]?.finish_reason ??
  null;

console.log(
  "[NATURALIZE COMPLETION]",
  {
    finishReason,
    outputLength:
      completion.choices[0]?.message?.content?.length ?? 0,
    maxTokens,
  }
);
               const textRaw = completion.choices[0]?.message?.content ?? raw;
 

      let text = String(textRaw ?? "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

  if (
  useStructuredPrompt &&
  (
    finishReason === "length" ||
    looksTruncated(text)
  )
) {
  const insight = body?.astroFacts?.insightProfile;
  const diagnosticProfile = body?.astroFacts?.diagnosticProfile;

  if (insight?.answerMode === "DIAGNOSTIC_FIRST" && diagnosticProfile) {
    text = buildFallbackStructuredAnswer(body);
  } else {
    const retry = await client.chat.completions.create({
      model: GPT_MODEL,
      temperature: 0.25,
      max_tokens:
  Math.max(
    maxTokens,
    2000
  ),
      messages: [
        {
          role: "system",
          content:
  systemPrompt +
  "\n\nYour previous answer was cut off. Rewrite fully and complete the final sentence. Keep it 100–150 words. Do not stop mid-sentence. End with one clear practical timing takeaway.",
        },
        {
          role: "user",
          content: `${styleHint}\n\nINPUT_BUNDLE:\n${raw}`,
        },
      ],
    });
   const retryFinishReason =
  retry.choices[0]?.finish_reason ??
  null;
    const retryText = String(retry.choices[0]?.message?.content ?? "").trim();

    text =
  retryFinishReason !== "length" &&
  !looksTruncated(retryText)
    ? retryText
    : buildFallbackStructuredAnswer(body);

if (looksTruncated(text)) {
  text =
    buildFallbackStructuredAnswer(body) ||
    "The current timing does not show a strong confirmed window, so this is better treated as a preparation phase rather than a final decision period.";
}
  }
}

      return okJson({ text, modelUsed: GPT_MODEL });
    } catch (err) {
      console.error("[api/naturalize] OpenAI error, using fallback", err);

      if (useStructuredPrompt) {
        const fallback = buildFallbackStructuredAnswer(body);
        return okJson({ text: fallback, modelUsed: `${GPT_MODEL} (fallback-local)` });
      }

           const fallback = String(rawA ?? raw ?? "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      return okJson({ text: fallback, modelUsed: `${GPT_MODEL} (fallback-local)` });
    }
  } catch (err: any) {
    console.error("[api/naturalize] outer error", err);

    return okJson(
      {
        error: "naturalize_failed",
        details: String(err),
        modelUsed: GPT_MODEL,
      },
      502
    );
  }
}
