export const runtime = "nodejs";

import "server-only";
import { NextResponse } from "next/server";
import OpenAI from "openai";

/* ---------------- OpenAI setup (lazy) ---------------- */

const GPT_MODEL = process.env.GPT_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini";

let cachedClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (cachedClient) return cachedClient;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Only throws if this route is actually called at runtime
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
function buildVoiceBrief(body: any): string {
  const tone = String(body?.tone ?? "neutral").trim().toLowerCase();
  const questionType = String(body?.questionType ?? "general").trim().toLowerCase();
  const topic = String(body?.topic ?? "general").trim().toLowerCase();
  const distressed = Boolean(body?.distressed);
  const moodHint = String(body?.moodHint ?? "").trim();
  const depth = String(body?.depth ?? "standard").trim().toLowerCase();
  const confidenceLevel = String(body?.confidenceLevel ?? body?.confidence ?? "").trim().toLowerCase();
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
      ? "Answer by first naming what is actually happening, then why it feels this way, then what it means."
      : questionType === "decision"
      ? "Answer clearly first, then explain the reasoning, then give the practical next step."
      : questionType === "timing"
      ? "Lead with whether timing looks open, delayed, mixed, or building. Name the key window early. Keep it concise, practical, and front-loaded."
      : questionType === "emotional_support"
      ? "Acknowledge the feeling briefly, then interpret it, then ground the user."
      : questionType === "decision"
      ? "Keep decision answers to 3 tight paragraphs maximum."
      : questionType === "daily_outlook"
      ? "Keep it immediate, practical, and grounded in the next step."
      : "Answer like a real conversation, not like a report.";
      
  const topicLine =
    topic === "career"
      ? "Keep the answer strategic, practical, and decisive."
      : topic === "relationships"
      ? "Keep the answer emotionally aware, nuanced, and relational."
      : topic === "health"
      ? "Keep the answer gentle, grounded, and non-alarming."
      : topic === "money"
      ? "Keep the answer sober, practical, and clear."
      : topic === "inner" || topic === "inner_guidance"
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
      : "Keep it concise but complete. Usually 100-160 words.";
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
  const decisionShapeLine =
  questionType === "decision"
    ? "Keep decision answers to 3 tight paragraphs maximum."
    : "";
  return [
    toneLine,
    questionLine,
    topicLine,
    empathyLine,
    depthLine,
    confidenceLine,
    openingLine,
    decisionShapeLine,
    moodHint ? `Mood signal: ${moodHint}.` : "",
    "Write like a highly perceptive astrology guide.",
    "Do not sound like a template, dashboard, report, or bot.",
    "Insight first, astrology second.",
    "Use astrology only to support the insight, not to dominate the wording.",
    "Avoid labels like Verdict, Confidence, Timing read, Summary, or Why Sārathi said this.",
    "Avoid therapy-speak, motivational fluff, and generic life-coach phrasing.",
    "Use natural connectors like: 'What’s actually happening is…', 'This looks more like…', 'That’s why this feels…'",
    "Keep it tight and non-repetitive.",
    "Do not explain the same emotional point twice.",
    "Do not restate the main conclusion at the end unless adding a new angle.",
    "Do not structure the answer in sections.",
    "Do not use bullet points or numbered lists unless FORMAT_RULES explicitly require them.",
    "Blend practical guidance naturally into the answer instead of listing it.",
    "Avoid mini-section phrasing inside paragraphs such as 'What works now:' or 'What to avoid:'.",
    "Do not restate the main conclusion at the end unless adding a new angle.",
    "Land the point and stop.",
    "It is okay to sound slightly conversational and imperfect, as long as the answer is clear.",
    "Do not structure the answer in sections. Keep it as a natural flowing explanation.",
    "Avoid ending with reassurance that sounds like coaching unless it adds real diagnostic value.",
    "Avoid mini-section phrasing inside paragraphs such as 'What works now:' or 'What to avoid:'.",
  ]
    .filter(Boolean)
    .join(" ");
}
function buildSarathiSignature(body: any): string {
  const questionType = String(body?.questionType ?? "general").trim().toLowerCase();
  const topic = String(body?.topic ?? "general").trim().toLowerCase();

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
      "Give the main date window early and keep the answer lean.",
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
      : topic === "relationships"
      ? ["Relationship answers should feel nuanced, emotionally intelligent, and non-dramatic."]
      : topic === "money"
      ? ["Money answers should feel measured, realistic, and clean."]
      : topic === "health"
      ? ["Health answers should feel gentle, calm, and non-alarming."]
      : ["Keep the answer grounded in real life."];

  return [...signatureBase, ...signatureByType, ...signatureByTopic].join(" ");
}
function buildStructuredPrompt(body: any): string {
  // Structured bundle for astro-chat -> naturalize
  const userQuestion = String(body?.userQuestion ?? "").trim();
  const topic = String(body?.topic ?? "").trim();
  const followupMode = String(body?.followupMode ?? "").trim();
  const history = String(body?.history ?? "").trim();
  const questionType = String(body?.questionType ?? "").trim();
  const tone = String(body?.tone ?? "").trim();
  const depth = String(body?.depth ?? "").trim();
  const voiceBrief = buildVoiceBrief(body);
  const distressed = Boolean(body?.distressed);
  const moodHint = String(body?.moodHint ?? "").trim();
  const distressSoothing = String(body?.distressSoothing ?? "").trim();
  const astroStressDriver = String(body?.astroStressDriver ?? "").trim();
  const copingTip = String(body?.copingTip ?? "").trim();
  const signatureBrief = buildSarathiSignature(body);
  const astroFacts = body?.astroFacts ?? {};
  const evidenceBullets = Array.isArray(body?.evidenceBullets) ? body.evidenceBullets : [];
  const styleGuide = body?.styleGuide ?? null;

  const formatTier = String(body?.formatTier ?? "").trim();
  const formatRules = String(
    body?.formatRules ?? body?.rules ?? body?.premiumFormatRules ?? ""
  ).trim();

  const lines: string[] = [];

  if (userQuestion) lines.push(`USER_QUESTION:\n${userQuestion}`);
  if (topic) lines.push(`\nTOPIC:\n${topic}`);
  if (followupMode) lines.push(`\nFOLLOWUP_MODE:\n${followupMode}`);

  lines.push(`\nDISTRESSED:\n${distressed ? "yes" : "no"}`);
  if (moodHint) lines.push(`\nMOOD_HINT:\n${moodHint}`);
  if (distressSoothing) lines.push(`\nSOOTHING:\n${distressSoothing}`);
  if (astroStressDriver) lines.push(`\nASTRO_STRESS_DRIVER:\n${astroStressDriver}`);
  if (copingTip) lines.push(`\nCOPING_TIP:\n${copingTip}`);
  if (signatureBrief) lines.push(`\nSIGNATURE_BRIEF:\n${signatureBrief}`);
  if (history) lines.push(`\nHISTORY:\n${history}`);

  lines.push(`\nASTRO_FACTS_JSON:\n${JSON.stringify(astroFacts ?? {}, null, 2)}`);
  // 🔥 ADD THIS BLOCK
if (body?.natalSummary) {
  lines.push(`\nNATAL_SUMMARY:\n${body.natalSummary}`);
}

if (body?.natalPlacements) {
  lines.push(`\nNATAL_PLACEMENTS:\n${JSON.stringify(body.natalPlacements, null, 2)}`);
}
if (body?.professionFacts) {
  lines.push(`\nPROFESSION_FACTS_JSON:\n${JSON.stringify(body.professionFacts, null, 2)}`);
}
if (body?.houseLords) {
  lines.push(`\nHOUSE_LORDS:\n${JSON.stringify(body.houseLords, null, 2)}`);
}
if (body?.professionAnswerHint) {
  lines.push(`\nPROFESSION_ANSWER_HINT:\n${body.professionAnswerHint}`);
}
if (body?.baseChartFactors) {
  lines.push(`\nBASE_CHART_FACTORS_JSON:\n${JSON.stringify(body.baseChartFactors, null, 2)}`);
}
if (body?.careerReading) {
  lines.push(
    `\nCAREER_READING_JSON:\n${JSON.stringify(body.careerReading, null, 2)}`
  );
}
if (body?.marriageFacts) {
  lines.push(
    `\nMARRIAGE_FACTS_JSON:\n${JSON.stringify(body.marriageFacts, null, 2)}`
  );
}

if (body?.marriageReading) {
  lines.push(
    `\nMARRIAGE_READING_JSON:\n${JSON.stringify(body.marriageReading, null, 2)}`
  );
}
if (body?.historicalSnapshot) {
  lines.push(
    `\nHISTORICAL_SNAPSHOT_JSON:\n${JSON.stringify(body.historicalSnapshot, null, 2)}`
  );
}

if (body?.marriageEventVerification) {
  lines.push(
    `\nMARRIAGE_EVENT_VERIFICATION_JSON:\n${JSON.stringify(body.marriageEventVerification, null, 2)}`
  );
}
  lines.push(
    `\nEVIDENCE_BULLETS_JSON:\n${JSON.stringify(evidenceBullets ?? [], null, 2)}`
  );

  if (formatTier) lines.push(`\nFORMAT_TIER:\n${formatTier}`);
  if (formatRules) lines.push(`\nFORMAT_RULES:\n${formatRules}`);

  if (styleGuide) {
    lines.push(`\nSTYLE_GUIDE_JSON:\n${JSON.stringify(styleGuide, null, 2)}`);
  }
  if (questionType) lines.push(`\nQUESTION_TYPE:\n${questionType}`);
  if (tone) lines.push(`\nTONE:\n${tone}`);
  if (depth) lines.push(`\nDEPTH:\n${depth}`);
  if (voiceBrief) lines.push(`\nVOICE_BRIEF:\n${voiceBrief}`);
  return lines.join("\n");
}

/* ---------------- route ---------------- */

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as any;

    const style = (body?.style as "casual" | "formal" | "neutral") ?? "neutral";

// Mode A: simple "clean this text"
const rawA = body?.text ?? body?.input;

// Mode B: structured payload (astro-chat)
const hasStructured =
  isNonEmptyString(body?.userQuestion) ||
  body?.astroFacts != null ||
  Array.isArray(body?.evidenceBullets);

// IMPORTANT: if structured fields exist, ALWAYS use structured mode
const useStructuredPrompt = hasStructured;

// Build the actual input to the model
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

    const styleHint =
      style === "casual"
        ? "Tone: warm, conversational, but still respectful."
        : style === "formal"
        ? "Tone: polite, professional, and clear."
        : "Tone: balanced, simple, and neutral.";

    // If this came from astro-chat (structured), we want a FULL answer, not a "cleaner".
  const systemPromptStructured =
  "You are Sārathi — a sharp, perceptive, and practical astrology guide. " +

  "You answer using the user’s chart, but speak in clear real-life language. " +

  "You will receive USER_QUESTION, ASTRO_FACTS_JSON, EVIDENCE_BULLETS_JSON, CAREER_READING_JSON, and PROFESSION_FACTS_JSON. " +

  // 🔥 CORE PRIORITY
  "Use CAREER_READING_JSON as the primary source for profession and career answers. Use PROFESSION_FACTS_JSON as supporting detail. " +

  // 🔥 CRITICAL FIX (THIS WAS MISSING)
  "Do not treat career outputs as rigid categories. Translate them into real-life professions intelligently. If the chart supports advisory, guidance, interpretation, or communication-based work, you may express that naturally even if not explicitly listed. " +

  // 🔥 REMOVE OVER-RIGIDITY
  "Do not force only literal role labels. Combine structure with interpretation. The goal is accuracy, not mechanical listing. " +

  // 🔥 DIRECTNESS
  "Always answer the question directly in the first sentence. " +

  // 🔥 PROFESSION RULE
  "For profession questions: " +
  "- Name 2–3 clear real-world roles. " +
  "- You may include roles that combine multiple signals (e.g. advisor, consultant, strategist, analyst). " +
  "- If the chart shows guidance, interpretation, or knowledge-sharing patterns, include roles like advisor, consultant, teacher, or specialist. " +
  "- Do not restrict to only institutional roles unless the chart clearly excludes other paths. " +
  "For profession questions in micro mode, answer in 1–2 short sentences only, maximum 45 words total. Give the profession directly and stop. Do not add phase commentary, modifiers, or emotional explanation. " +
  "If the question is a short factual profession question, do not continue after naming the likely profession cluster. " +
  "For profession questions in micro mode, do not explain. Give only the profession cluster in 1–2 sentences and stop." +
  "For past marriage timing questions, prefer MARRIAGE_EVENT_VERIFICATION_JSON first, then HISTORICAL_SNAPSHOT_JSON, then MARRIAGE_READING_JSON. Answer whether the given year/date was a strong match, possible match, or weak match, and explain briefly why. " +
  // 🔥 BALANCE RULE
  "Use this balance when answering: " +
  "- Natal chart defines the profession. " +
  "- Divisional charts refine it. " +
  "- Dasha modifies how it feels now. " +

  // 🔥 SHORT ANSWERS
  "For short questions (profession, personality, today, color): " +
  "- One paragraph only (max 80 words). " +
  "- No over-explanation. " +

  // 🔥 LONG ANSWERS
  "For deeper questions: " +
  "- Give the answer first. " +
  "- Then explain briefly. " +

  // 🔥 STYLE
  "Style: clear, grounded, slightly sharp. No fluff. No generic motivational tone. " +

  // 🔥 HARD RULES
  "Hard rules: " +
  "- Do not invent astrology facts not present. " +
  "- Do not give vague answers. " +
  "- Do not over-restrict to literal labels if the chart clearly suggests a broader real-life role. " +

  "Reply with the final answer only.";

    // Your original text-cleaner prompt (keep it intact)
    const systemPromptCleaner =
      "You are Sārathi's language cleaner. " +
      "Your job is to gently rewrite short texts so they sound natural, clear, and human. " +
      "Keep the meaning the same, just smoother and easier to read. " +
      "No emojis, no hashtags, no bullet lists unless the input already uses them. " +
      "Do not add new ideas or advice. " +
      "Reply with the improved text only, no explanations or commentary.";

    
const formatTier = String(body?.formatTier || body?.tier || "").toLowerCase();
const formatRules =
  String(body?.formatRules || body?.rules || body?.premiumFormatRules || "").trim();

    // 1) Try OpenAI
    try {
      const client = getOpenAIClient();

      const completion = await client.chat.completions.create({
        model: GPT_MODEL,
        temperature: useStructuredPrompt ? 0.35 : 0.2,
        max_tokens: formatTier === "micro" ? 160 : formatTier === "standard" ? 400 : 1400,

        messages: [
          {
            role: "system",
            content: useStructuredPrompt ? systemPromptStructured : systemPromptCleaner,
          },
          {
            role: "user",
            content: `${styleHint}\n\n${useStructuredPrompt ? "INPUT_BUNDLE:" : "Original text:"}\n${raw}`,
          },
        ],
      });

      const text = completion.choices[0]?.message?.content?.trim() || raw.trim();
      return okJson({ text, modelUsed: GPT_MODEL });
    } catch (err) {
      console.error("[api/naturalize] OpenAI error, using fallback", err);

      // Simple deterministic fallback:
      // - If structured: return a minimal safe response
      // - Else: normalise whitespace
      if (!isNonEmptyString(rawA) && hasStructured) {
        const uq = String(body?.userQuestion ?? "").trim();
        const fallback =
  (uq ? `I hear you. Here’s a grounded next step: ` : "") +
  "Focus on one small, practical action today, and avoid making irreversible decisions from a spike in emotion. " +
  "Tell me the one outcome you want in the next 7 days, and I’ll help shape a clear plan.";
        return okJson({ text: fallback, modelUsed: `${GPT_MODEL} (fallback-local)` });
      }

      const fallback = raw.replace(/\s+/g, " ").trim();
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

