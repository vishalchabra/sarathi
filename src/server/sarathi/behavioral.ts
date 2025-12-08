/**
 * Sārathi — Behavioral Analysis & Empathic Engine (lightweight heuristics)
 * Safe for server or client (no Node globals).
 */

export type Topic =
  | "vehicle"
  | "property"
  | "job"
  | "wealth"
  | "health"
  | "relationships"
  | "disputes"
  | "marriage";

export type ChatTurn = { role: "user" | "assistant"; text: string };

export interface BehaviorInput {
  query?: string;
  topic?: Topic;
  profile?: {
    name?: string;
    roleTitle?: string;
    role?: string;
    stack?: string;
    lang?: "en" | "hi";
  };
  history?: ChatTurn[];
}

export type Mood = "upbeat" | "neutral" | "anxious" | "frustrated" | "urgent";
export type Style = "gentle" | "structured" | "direct" | "brief";

export interface Persona {
  mood: Mood;
  style: Style;
  risks: Array<
    | "timePressure"
    | "financialStress"
    | "healthConcern"
    | "legalRisk"
    | "burnout"
    | "relationshipFragile"
  >;
  language: "en" | "hi";
  flavor?: "frontend" | "backend" | "data" | "general";
}

export interface ToneHints {
  opener: string;
  closer: string;
  bulletsTone: "encouraging" | "calm" | "decisive";
}

export function detectLanguage(input?: BehaviorInput): "en" | "hi" {
  if (input?.profile?.lang) return input.profile.lang;
  const q = input?.query || "";
  if (/[ऀ-ॿ]/.test(q)) return "hi";
  return "en";
}

function inferFlavor(profile?: BehaviorInput["profile"]): Persona["flavor"] {
  const blob = `${profile?.roleTitle || ""} ${profile?.role || ""} ${profile?.stack || ""}`.toLowerCase();
  if (/(front.*end|react|vue|next|angular|design system|ui)/.test(blob)) return "frontend";
  if (/(backend|api|node|go|java|spring|python|django|fastapi)/.test(blob)) return "backend";
  if (/(data|ml|ai|analytics|sql|pandas|spark)/.test(blob)) return "data";
  return "general";
}

export function analyzeBehavior(input: BehaviorInput): { persona: Persona; tone: ToneHints } {
  const lang = detectLanguage(input);
  const q = (input?.query || "").toLowerCase();
  const history = input?.history || [];

  let mood: Mood = "neutral";
  const risks: Persona["risks"] = [];

  if (/(urgent|asap|now|immediately|tomorrow|today)/.test(q)) {
    mood = "urgent"; risks.push("timePressure");
  }
  if (/(anxious|worry|worried|nervous|confus|fear|scared|stress)/.test(q)) mood = "anxious";
  if (/(angry|frustrat|doesn.?t work|not working|why.*not)/.test(q)) mood = "frustrated";
  if (/(loan|salary|hike|raise|increment|money|finance|income|expense|debt)/.test(q)) risks.push("financialStress");
  if (/(health|surgery|illness|recovery|pain)/.test(q)) risks.push("healthConcern");
  if (/(court|case|legal|litigation|dispute)/.test(q)) risks.push("legalRisk");
  if (/(burnout|exhaust|overwhelmed|tired all the time)/.test(q)) risks.push("burnout");
  if (/(breakup|fight|separation|marriage.*issue)/.test(q)) risks.push("relationshipFragile");

  const lastUser = history.slice().reverse().find(t => t.role === "user");
  if (lastUser && /(sorry|confused|help)/i.test(lastUser.text) && mood === "neutral") mood = "anxious";

  let style: Style = "structured";
  if (mood === "anxious") style = "gentle";
  if (mood === "frustrated") style = "direct";
  if (mood === "urgent") style = "brief";

  const persona: Persona = {
    mood,
    style,
    risks: Array.from(new Set(risks)),
    language: lang,
    flavor: inferFlavor(input?.profile),
  };

  const opener =
    lang === "hi"
      ? mood === "anxious"
        ? "समझ रहा हूँ—हम इसे कदम-दर-कदम संभालते हैं।"
        : mood === "frustrated"
        ? "ठीक है—सीधे काम की बात करते हैं।"
        : "चलिये स्पष्ट योजना बनाते हैं।"
      : mood === "anxious"
      ? "I’ve got you—let’s work this calmly, step by step."
      : mood === "frustrated"
      ? "Got it—let’s tackle this head-on."
      : "Let’s make a clear plan you can act on.";

  const closer = lang === "hi" ? "कदम छोटे रखें, निरंतरता जीतती है।" : "Keep the steps small—consistency wins.";

  const bulletsTone: ToneHints["bulletsTone"] =
    mood === "frustrated" || mood === "urgent" ? "decisive" : mood === "anxious" ? "calm" : "encouraging";

  return { persona, tone: { opener, closer, bulletsTone } };
}

export function openerFor(_p: Persona, t: ToneHints) { return t.opener; }
export function closerFor(_p: Persona, t: ToneHints) { return t.closer; }
