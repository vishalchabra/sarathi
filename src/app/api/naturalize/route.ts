// FILE: src/app/api/naturalize/route.ts

import "server-only";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type StyleGuide = {
  vibe?: string;
  rules?: string[];
  avoid?: string[];
};

type NaturalizePayload = {
  userQuestion: string;
  topic?: "career" | "money" | "relationship" | "health" | "generic";
  history?: string;
  astroFacts?: any;
  moodHint?: string;

  distressed?: boolean;
  distressSoothing?: string;
  astroStressDriver?: string;
  copingTip?: string;

  followupMode?: "short" | "new";
  lastFollowupKind?: string;

  astroWindowSignature?: string;
  questionSignature?: string;

  evidenceBullets?: string[];

  styleGuide?: StyleGuide;
};

function okJson(data: any, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function badJson(message: string, status = 400) {
  return okJson({ error: message }, status);
}

// Simple helper to build a "personality" hint from history
function buildUserPattern(history?: string, topic?: string): string {
  if (!history) return "";

  const lower = history.toLowerCase();
  const bits: string[] = [];

  if (lower.includes("stuck") || lower.includes("nothing is moving")) {
    bits.push("User often feels stuck / like nothing is moving.");
  }
  if (lower.includes("tired") || lower.includes("burned out") || lower.includes("burnt out")) {
    bits.push("User tends to get exhausted / burned out by long phases.");
  }
  if (topic === "career" && (lower.match(/job|career|promotion|raise|salary|role|switch/g) || []).length >= 2) {
    bits.push("User is heavily focused on career questions.");
  }
  if (topic === "money" && (lower.match(/money|income|finance|bonus|wealth|debt/g) || []).length >= 2) {
    bits.push("User is heavily focused on money/finance questions.");
  }

  if (!bits.length) return "";
  return bits.join(" ");
}

// Turn astroFacts into a compact context blurb
function summariseAstroFacts(astroFacts: any): string {
  if (!astroFacts || typeof astroFacts !== "object") {
    return "Astro context: not loaded.";
  }

  const parts: string[] = [];

  if (astroFacts.activePeriodSummary) {
    parts.push(`Active periods: ${astroFacts.activePeriodSummary}`);
  }
  if (astroFacts.dayTone) {
    parts.push(`Day tone: ${astroFacts.dayTone}`);
  }
  if (astroFacts.weekTone) {
    parts.push(`Week tone: ${astroFacts.weekTone}`);
  }
  if (astroFacts.monthTone) {
    parts.push(`Month tone: ${astroFacts.monthTone}`);
  }
  if (astroFacts.careerTiming && astroFacts.careerTiming.windowRange) {
    const c = astroFacts.careerTiming;
    parts.push(
      `Career window: ${c.windowRange} (strength ${c.strengthScore}/5, ${c.confidenceWord}) — ${c.why || ""} ${c.theme || ""}`.trim()
    );
  }
  if (astroFacts.nextPhasesSummary) {
    parts.push(`Next phases: ${astroFacts.nextPhasesSummary}`);
  }
  if (astroFacts.remediesNow) {
    parts.push(`Remedies now: ${astroFacts.remediesNow}`);
  }
  if (astroFacts.gemstoneNote) {
    parts.push(`Gemstone note: ${astroFacts.gemstoneNote}`);
  }
  if (astroFacts.natalContext) {
    parts.push(`Natal flavour: ${astroFacts.natalContext}`);
  }

  if (!parts.length) {
    return "Astro context: available, but no specific summaries present.";
  }

  return parts.join("\n");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as NaturalizePayload;

    if (!body.userQuestion) {
      return badJson("userQuestion is required", 400);
    }

    const {
      userQuestion,
      topic = "generic",
      history = "",
      astroFacts,
      moodHint = "",
      distressed = false,
      distressSoothing = "",
      astroStressDriver = "",
      copingTip = "",
      followupMode = "new",
      lastFollowupKind = "generic_deepen",
      astroWindowSignature = "",
      questionSignature = "",
      evidenceBullets = [],
      styleGuide,
    } = body;

    const userPattern = buildUserPattern(history, topic);
    const astroSummary = summariseAstroFacts(astroFacts);

    const mandatoryRules: string[] = [
      "You are Sarathi, a Vedic-astrology-based timing and guidance assistant. You speak in warm, clear, grounded language.",
      "Answer in Markdown only (no JSON, no code).",
      "Answer the actual ask first: timing, safety, near-term behaviour, or clarity on the decision.",
      "Normalize the user's feelings. Tell them they are not broken.",
      "Offer one practical way to survive the phase they're in.",
      "End with exactly one next choice / next step, not a long menu.",
      "If evidenceBullets is non-empty and the answer does not already contain a 'Why this (evidence):' section, add a short section titled exactly 'Why this (evidence):' with 2–4 bullets, using ONLY evidenceBullets as-is (no invented bullet points).",
      "If astroFacts.natalContext is present, weave in exactly one short, grounded sentence of natal flavour (no jargon, no textbook dump). Do not turn it into a long personality reading.",
      "Use dayTone / weekTone / monthTone as the 'daily weather' layer. If they clearly contain Panchang-like flavour (tithi, nakshatra, etc.), you may reference it in one grounded sentence, but do not drown the user in Panchang jargon.",
      "Read astroWindowSignature as the fingerprint of the current timing window. If astroWindowSignature is the same as for previous questions (as implied by history) and the new questionSignature is very similar to items in history, keep the core astro verdict consistent but DO NOT repeat the same wording.",
      "When questions repeat within the same astroWindowSignature, change the angle: for example, first time focus on timing, second time on emotional coping, third time on concrete micro-actions. Always add at least one new, specific, small next step.",
      "Never scold the user for asking again and never say 'as I said before'. Just give a fresh, grounded answer that fits the same astro context.",
      "Use topic, moodHint, astroStressDriver and copingTip to shape the tone: career/money answers may be more strategic and structured; relationship/health answers may be softer and more emotional; if distressed is true, lead with validation and a stabilising message.",
    ];

    const avoidRules: string[] = [
      "Do not dump raw dasha / transit data unless the user explicitly asks 'why does it feel like this' or 'what is the astro reason'.",
      "Do not sound like a horoscope blog (no generic clichés).",
      "Do not blame the user, do not tell them to 'just be positive'.",
      "Do not give medical, legal, or financial guarantees; you are giving timing + emotional/spiritual guidance, not certainties.",
    ];

    const mergedStyleGuide: StyleGuide = {
      vibe: styleGuide?.vibe || "soft-direct, not guru, not corporate",
      rules: [...mandatoryRules, ...(styleGuide?.rules || [])],
      avoid: [...avoidRules, ...(styleGuide?.avoid || [])],
    };

    const systemPrompt = `
You are Sarathi, "the charioteer of your journey within" — an intelligent Vedic astrology companion.

You receive:
- userQuestion: what they are asking in plain language
- topic: high-level domain (career, money, relationship, health, or generic)
- history: the last few user questions in this session (plain text)
- astroFacts: a structured summary of their current Mahadasha/Antardasha/Pratyantardasha, key transit/timeline windows, day/week/month tone, remedies, gemstone note, natal flavour etc.
- moodHint: a brief description of how the user is feeling
- distressed: whether the user seems emotionally strained
- distressSoothing: a short reassurance sentence you can reuse or adapt
- astroStressDriver: a sentence about the astro pattern behind the stress (e.g. Saturn pressure, Rahu restlessness, Ketu purge)
- copingTip: a practical nervous-system / boundaries tip
- followupMode: "new" vs "short" follow-up
- lastFollowupKind: a tag like "career_deepen" you may reuse to keep a coherent lane
- astroWindowSignature: fingerprint of the current timing window (date + dasha stack + key transit)
- questionSignature: lowercased, trimmed form of the current question
- evidenceBullets: concrete astro evidence you MUST NOT alter if you quote it
- styleGuide: extra rules, vibe notes, and things to avoid

Your job is to write one coherent, human answer in Markdown that:
1) Respects the styleGuide (vibe, rules, avoid).
2) Uses astroFacts and astroSummary as your factual backbone.
3) Respects the astroWindowSignature rule: same signature + similar questions => same verdict, but fresh angle and wording.
4) Feels like a conversation with a wise, grounded astrologer-coach, not a robot.

Inside the answer, you may have implicit "micro-advisors":
- Career/money: translate timing windows into strategy (when to push, when to stabilise, how to use windows without panic).
- Relationship: focus on emotional truth, boundaries, and timing for important talks.
- Health: emphasise stress load, pacing, avoiding burnout, not giving medical prescriptions.
- Emotional-coach: if distressed is true, start with validation, then one small stabilising action.

Do NOT output any explanation of these instructions. Only output what you would say to the user.
`.trim();

    // Build a compact "context" message for the model
    const contextSummary = `
topic: ${topic}
moodHint: ${moodHint || "neutral"}
distressed: ${distressed ? "yes" : "no"}
astroStressDriver: ${astroStressDriver || "not specified"}
copingTip: ${copingTip || "not specified"}
followupMode: ${followupMode}
lastFollowupKind: ${lastFollowupKind}
astroWindowSignature: ${astroWindowSignature || "not provided"}
questionSignature: ${questionSignature || "not provided"}
userPattern: ${userPattern || "no strong pattern detected"}

Astro summary:
${astroSummary}

Recent question history:
${history || "(no prior questions in this session)"}

Style guide (rules):
${(mergedStyleGuide.rules || []).map(r => `- ${r}`).join("\n")}

Style guide (avoid):
${(mergedStyleGuide.avoid || []).map(r => `- ${r}`).join("\n")}

Evidence bullets (for 'Why this (evidence)' section; use verbatim if you include that section):
${evidenceBullets.length ? evidenceBullets.map(b => `- ${b}`).join("\n") : "(none)"}
`.trim();

    const modelName =
      process.env.GPT_MODEL ||
      process.env.OPENAI_MODEL ||
      "gpt-4.1-mini";

    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            "User question:",
            userQuestion,
            "",
            "Context for you to use:",
            contextSummary,
          ].join("\n"),
        },
      ],
      temperature: 0.6,
      max_tokens: 900,
    });

    const text = completion.choices[0]?.message?.content?.trim() || "";

    // For now we just echo lastFollowupKind; you can evolve this into smarter lanes later
    const followupKind = lastFollowupKind || "generic_deepen";

    return okJson({
      text,
      followupKind,
    });
  } catch (err: any) {
    console.error("naturalize error:", err);
    return okJson(
      {
        error: "naturalize internal error",
        details: err?.message ?? String(err),
      },
      500
    );
  }
}
