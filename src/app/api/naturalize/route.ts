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
    questionType === "diagnosis"
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

  const depthLine =
    depth === "micro"
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
    "Use astrology only to support the insight, not to dominate the wording.",
    "Avoid labels like Verdict, Confidence, Timing read, Summary, or Why Sārathi said this.",
    "Avoid therapy-speak, motivational fluff, and generic life-coach phrasing.",
    "Use natural connectors like: 'What’s actually happening is…', 'This looks more like…', 'That’s why this feels…'.",
    "Keep it tight and non-repetitive.",
    "Do not explain the same point twice.",
    "Do not structure the answer in sections.",
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

  const dashaLine = [currentDasha?.md, currentDasha?.ad, currentDasha?.pd]
    .filter(Boolean)
    .join(" • ");
  if (dashaLine) out.push(`Current dasha: ${dashaLine}`);
  if (answerSummary) out.push(`Synthesis: ${answerSummary}`);

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
  const rows = Array.isArray(astroFacts?.timingWindows) ? astroFacts.timingWindows : [];
  return rows.slice(0, 3).map((row: any) => {
    const label = safeStr(row?.label);
    const start = row?.start ? String(row.start) : "";
    const end = row?.end ? String(row.end) : "";
    const peak = row?.peak ? String(row.peak) : "";
    const why = Array.isArray(row?.why) ? row.why.join("; ") : "";

    const prettyPeak = peak && /^\d{4}-\d{2}$/.test(peak) ? formatMonthLabel(peak) : peak;
    const prettyStart = start && /^\d{4}-\d{2}$/.test(start) ? formatMonthLabel(start) : start;
    const prettyEnd = end && /^\d{4}-\d{2}$/.test(end) ? formatMonthLabel(end) : end;

    return [
      label ? `Window: ${label}` : "",
      prettyStart || prettyEnd ? `Range: ${prettyStart || "—"} to ${prettyEnd || "—"}` : "",
      prettyPeak ? `Peak: ${prettyPeak}` : "",
      why ? `Why: ${why}` : "",
    ]
      .filter(Boolean)
      .join(" • ");
  });
}

function buildStructuredPrompt(body: any): string {
  const userQuestion = safeStr(body?.userQuestion);
  const topic = safeStr(body?.topic);
  const history = safeStr(body?.history);
  const questionType = safeStr(body?.questionType);
  const tone = safeStr(body?.tone);
  const depth = safeStr(body?.depth);
  const distressed = Boolean(body?.distressed);
  const moodHint = safeStr(body?.moodHint);
  const confidenceLevel = safeStr(body?.confidenceLevel || body?.confidence);
  const voiceBrief = buildVoiceBrief(body);
  const signatureBrief = buildSarathiSignature(body);
  const astroFacts = body?.astroFacts ?? {};
  const evidenceBullets = Array.isArray(body?.evidenceBullets) ? body.evidenceBullets : [];
  const styleGuide = body?.styleGuide ?? null;
  const timeDirection = safeStr(astroFacts?.timeDirection || body?.timeDirection);
  const eventScale = safeStr(astroFacts?.eventScale || body?.eventScale);
  const formatTier = safeStr(body?.formatTier);
  const formatRules = safeStr(body?.formatRules ?? body?.rules ?? body?.premiumFormatRules);
  const careerEventType = safeStr(astroFacts?.careerEventType || body?.careerEventType);
  const finalDecisionLine = safeStr(body?.finalDecisionLine);
  const finalDecisionVerdict = safeStr(body?.finalDecisionVerdict);

  const lines: string[] = [];

  if (userQuestion) lines.push(`USER_QUESTION:\n${userQuestion}`);
  if (topic) lines.push(`\nTOPIC:\n${topic}`);
  if (questionType) lines.push(`\nQUESTION_TYPE:\n${questionType}`);
  if (timeDirection) lines.push(`\nTIME_DIRECTION:\n${timeDirection}`);
  if (eventScale) lines.push(`\nEVENT_SCALE:\n${eventScale}`);

  if (finalDecisionVerdict) {
    lines.push(`\nFINAL_DECISION_VERDICT:\n${finalDecisionVerdict}`);
  }
  if (finalDecisionLine) {
    lines.push(`\nFINAL_DECISION_LINE:\n${finalDecisionLine}`);
  }

  if (tone) lines.push(`\nTONE:\n${tone}`);
  if (depth) lines.push(`\nDEPTH:\n${depth}`);
  if (confidenceLevel) lines.push(`\nCONFIDENCE_LEVEL:\n${confidenceLevel}`);
  lines.push(`\nDISTRESSED:\n${distressed ? "yes" : "no"}`);
  if (moodHint) lines.push(`\nMOOD_HINT:\n${moodHint}`);
  if (history) lines.push(`\nHISTORY:\n${history}`);
  if (formatTier) lines.push(`\nFORMAT_TIER:\n${formatTier}`);
  if (formatRules) lines.push(`\nFORMAT_RULES:\n${formatRules}`);
  if (voiceBrief) lines.push(`\nVOICE_BRIEF:\n${voiceBrief}`);
  if (signatureBrief) lines.push(`\nSIGNATURE_BRIEF:\n${signatureBrief}`);
  if (careerEventType) lines.push(`\nCAREER_EVENT_TYPE:\n${careerEventType}`);

  const astroSummary = buildGenericAstroFactsSummary(astroFacts);
  if (astroSummary.length) {
    lines.push(`\nASTRO_SUMMARY_BULLETS:\n${JSON.stringify(astroSummary, null, 2)}`);
  }

  const timingSummary = buildTimingWindowsSummary(astroFacts);
  if (timingSummary.length) {
    lines.push(`\nTIMING_WINDOWS_BULLETS:\n${JSON.stringify(timingSummary, null, 2)}`);
  }

  lines.push(`\nASTRO_FACTS_JSON:\n${JSON.stringify(astroFacts ?? {}, null, 2)}`);
  lines.push(`\nEVIDENCE_BULLETS_JSON:\n${JSON.stringify(evidenceBullets ?? [], null, 2)}`);

  if (styleGuide) {
    lines.push(`\nSTYLE_GUIDE_JSON:\n${JSON.stringify(styleGuide, null, 2)}`);
  }

  return lines.join("\n");
}

function buildStructuredSystemPrompt(): string {
  return [
    // IDENTITY
    "You are Sārathi, a sharp, practical, and high-clarity astrology advisor.",
    "You think like a strategist, not a storyteller.",
    "You translate astrology into real-life decisions and outcomes.",

    // CORE STYLE
    "Be direct, clear, and grounded.",
    "Avoid fluff, repetition, and over-explanation.",
    "Do not sound like a report, template, or horoscope.",
    "Reply with the final answer only.",

    // FIRST SENTENCE RULE (CRITICAL)
    "The first sentence must answer the user's question directly.",
    "It must be short, decisive, and clear.",
    "Do not write long or layered opening sentences.",

    // DECISION CONTROL
    "If FINAL_DECISION_LINE is provided, you MUST preserve its meaning exactly.",
    "You may rephrase for tone, but never weaken or reinterpret it.",
    "Do not change a clear answer into vague language.",
    "Clarity is more important than nuance.",

    // STRUCTURE (MANDATORY)
    "Answer structure:",
    "1. Clear verdict (1 short sentence)",
    "2. Real-life explanation (1–2 sentences)",
    "3. Example (optional, 1 line)",
    "4. Best use",
    "5. Watch for",

    // REAL-LIFE TRANSLATION (CORE DIFFERENTIATOR)
    "Always translate astrology into real-life situations.",
    "Avoid abstract words like 'energy', 'movement', or 'repositioning' without examples.",

    // TOPIC-SPECIFIC TRANSLATION
    "Career → role change, promotion, reporting changes, team shifts, visibility.",
    "Relationships → meeting someone, bond deepening, emotional distance, commitment, conflict.",
    "Money → income increase, delayed payments, side income, expenses, savings.",
    "Health → fatigue, sleep issues, stress, recovery, routine imbalance.",
    "Property → search, delays, paperwork, relocation, settlement.",
    "Inner → confusion, clarity, emotional heaviness, mindset shifts.",

    // EVENT LAYER (CRITICAL)
    "When eventHints are available, use 1–2 naturally in the answer.",
    "Prefer concrete real-life manifestations over abstract statements.",

    // DIVISIONAL INTELLIGENCE (CRITICAL)
    "You MUST use divisional chart strength when available.",
    "Do not just list charts — explain what their mix means in real life.",
    "Translate strength into outcomes:",
    "Strong → clear support",
    "Moderate → effort required",
    "Weak → delay, fluctuation, or inconsistency",

    "For money:",
    "Strong D2 → wealth flow exists",
    "Moderate D10 → income depends on effort",
    "Weak charts → no sudden breakthrough",

    "For health:",
    "Strong D30 → stress/imbalance pattern",
    "Strong D9 → recovery ability",
    "Weak signals → fluctuation, not crisis",

    "Never say 'charts are not strong enough' without explaining what that means.",
    "For present questions, describe what is happening RIGHT NOW, not just the phase.",
    "Answer like a snapshot of current reality.",
    "Include 1–2 concrete situations the person is likely experiencing right now.",
    "Avoid repeating 'phase' language unless necessary.",
    "For past-event questions, always identify the strongest possible period from the chart.",
    "Do not say 'cannot be established' unless absolutely no signal exists.",
    "Even if confidence is moderate, give the best matching time window.",
    "Phrase it as 'most likely period' instead of refusing.",
    "For profession questions, always combine domain + role style.",
    "Do not give generic labels like 'operations' or 'administration' alone.",
    "Use real-world phrasing like:",
    "'finance operations with managerial responsibility'",
    "'consulting or advisory work with decision-making role'",
    "'structured corporate role with process ownership'",
    "For present questions, describe what the person is already experiencing right now.",
    "Include 1–2 concrete situations already happening.",
    "Do not only describe the phase — describe lived reality.",
    "For profession questions, always combine domain + role style.",
    "Do not give generic labels like 'operations' or 'administration' alone.",
    "Use real-world phrasing like 'finance operations with managerial responsibility' or 'consulting/advisory work with structured decision-making'.",
    "For present questions, describe what the person is already experiencing right now.",
    "Include 1–2 concrete situations already happening in real life.",
    "Avoid only describing the phase. Describe lived reality.",
    "For past-event questions, always identify the strongest possible matching period when any signal exists.",
    "Do not refuse the answer if a moderate-confidence past window is available.",
    "Use phrases like 'most likely period' when confidence is moderate.",
    "For past-event questions, do not include advice, best use, watch for, or self-help language.",
    "For past-event questions, only state the most likely timing and why it stands out.",
    "Only explain the timing and what likely happened.",
    "For past-event questions, do not say 'if this happened' or 'if you became'.",
    "State the most likely timing window directly.",
    "For past-event questions, state the strongest likely year or period directly.",
    "Do not use reflective phrases like 'if you look back' or 'you may notice'.",
    "Do not explain past answers with soft narrative language; keep them factual, concise, and timing-focused.",
    "For past-event questions, avoid phrases like 'signals are not strong' and instead say 'the timing is moderate rather than exact' when needed.",
    // PATTERN LANGUAGE (UPGRADE)
    "Always describe patterns:",
    "Money → gradual growth, effort-linked gains, delayed payouts, uneven gains.",
    "Health → fluctuation, stress sensitivity, routine imbalance, recovery phase.",
    "Relationships → opening, deepening, instability, delay.",

    // ACTION BIAS (MANDATORY)
    "When actionBias is present, always include BOTH:",
    "Best use → what to do",
    "Watch for → what to avoid",

    "Do not skip either.",
    "Keep it practical and situation-specific.",

    // TONE CONTROL (PREMIUM FEEL)
    "Avoid phrases like:",
    "'What’s actually happening is'",
    "'the chart shows'",
    "'the astrology suggests'",

    "Speak directly in real-world terms.",

    // CONFIDENCE CONTROL
    "High confidence → decisive",
    "Medium → balanced",
    "Low → cautious but useful",

    // TIMING RULES
    "Respect TIME_DIRECTION strictly.",
    "For future: check promise → dasha → transits (in that order).",
    "Do not give sharp timing unless clearly supported.",
    "Prefer broader phases over exact dates when evidence is mixed.",

    // CAREER SPECIAL RULES
    "Always check CAREER_EVENT_TYPE.",
    "Do not overpromise promotions or job change without strong support.",
    "Profession questions → answer work type, not timing.",
    "For profession questions, be highly specific and concrete.",
    "Do not give generic labels like 'administration' or 'operations' alone.",
    "Combine domain + role style.",
    "For example: 'finance operations with a managerial role', 'consulting/advisory work with decision-making responsibility'.",
    "The first sentence must clearly state the profession in a real-world way.",

    // EVIDENCE STYLE
    "Mention evidence naturally (dasha, houses, charts) without sounding technical.",
    "Do not expose internal labels or system logic.",

    // FINAL CONTROL
    "Do not repeat the same idea multiple times.",
    "Prefer one strong explanation over three weak ones.",
    "End with a grounded, practical conclusion.",
  ].join(" ");
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
  const windows = Array.isArray(astroFacts?.timingWindows) ? astroFacts.timingWindows : [];
  const first = windows[0] ?? null;

  const professionFallback = buildProfessionFallbackAnswer(body);
  if (topic === "career" && timeDirection === "identity" && professionFallback) {
    return professionFallback;
  }

  if (questionType === "timing") {
            const q = userQuestion.toLowerCase();
    const isCareerMovement =
      /\b(get promoted|promotion|promote|job change|change my job|switch job|switch my job|career move|role change|role shift|transfer|department change|move in my career|career change)\b/.test(q);

    if (isCareerMovement) {
      const timingConfidenceNote = safeStr(astroFacts?.timingConfidenceNote);

          if (timeDirection === "future") {
        if (first?.label) {
          return `${timingConfidenceNote || answerSummary || "This looks more like a broader career-movement phase than a guaranteed change signal."} The clearest visible phase is ${first.label}${first?.peak ? `, with stronger activation around ${/^\d{4}-\d{2}$/.test(String(first.peak)) ? formatMonthLabel(String(first.peak)) : String(first.peak)}` : ""}.`;
        }

        return `${timingConfidenceNote || answerSummary || "This does not look like a clean career-change window yet. It is better read as background professional movement than as a confirmed shift."}`;
      }
    }
    if (timeDirection === "past") {
      if (first?.label) {
        return `${answerSummary || "The strongest past window visible in the chart can be read."} The clearest historical period appears around ${first.label}${first?.peak ? `, with peak activation around ${/^\d{4}-\d{2}$/.test(String(first.peak)) ? formatMonthLabel(String(first.peak)) : String(first.peak)}` : ""}.`;
      }
      return `${answerSummary || "The past timing can be assessed, but it is not clean enough to state with confidence from the current scan."}`;
    }

    if (timeDirection === "present") {
      if (first?.label) {
        return `${answerSummary || "This area is active now."} The clearest active window is ${first.label}.`;
      }
      return `${answerSummary || timingLayerSummary || "The present-time activation is not sharply defined from the current scan."}`;
    }

    if (first?.label) {
      return `${answerSummary || "The clearest timing window is visible."} The strongest visible window is ${first.label}${first?.peak ? `, with the main trigger around ${/^\d{4}-\d{2}$/.test(String(first.peak)) ? formatMonthLabel(String(first.peak)) : String(first.peak)}` : ""}.`;
    }
    return `${answerSummary || timingLayerSummary || "A sharply defined timing window is not fully clear from the current scan."}`;
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
        const maxTokens = formatTier === "micro" ? 140 : formatTier === "standard" ? 260 : 520;

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

               const textRaw = completion.choices[0]?.message?.content ?? raw;

      let text = String(textRaw ?? "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      if (useStructuredPrompt) {
        if (looksTruncated(text)) {
          text = buildFallbackStructuredAnswer(body);
          return okJson({
            text,
            modelUsed: `${GPT_MODEL} (fallback-after-truncation)`,
          });
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
