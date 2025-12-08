// FILE: src/server/notifications/daily-facts.ts

/**
 * This helper converts a Daily Guide object into a compact notification facts
 * bundle for the notification engine.
 *
 * Shape returned:
 * {
 *   dateISO: string;
 *   tags: string[];
 *   scores: Record<string, number>;
 *   reasons: Record<string, string>;
 *   windows: Array<any>;
 * }
 *
 * We intentionally keep types loose (any) so it can be used flexibly.
 */

export type NotificationFacts = {
  dateISO: string;
  tags: string[];
  scores: Record<string, number>;
  reasons: Record<string, string>;
  windows: any[];
};

type DailyInput = {
  dateISO?: string;
  emotional?: any; // EmotionalWeather
  money?: any; // MoneyTip
  fasting?: any; // FastingGuide
  food?: any; // FoodGuide
  focus?: any;
  panchang?: any;
  transits?: any[];
};

/**
 * Safe number helper.
 */
function num(x: any, fallback = 0): number {
  const n = typeof x === "number" ? x : Number(x);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Main builder
 */
export function buildNotificationFactsFromDailyGuide(
  dailyRaw: DailyInput,
  _userId?: string | undefined
): NotificationFacts {
  const daily: DailyInput = dailyRaw || {};

  const dateISO =
    (daily.dateISO && String(daily.dateISO).slice(0, 10)) ||
    new Date().toISOString().slice(0, 10);

  const emotional = daily.emotional || {};
  const money = daily.money || {};
  const fasting = daily.fasting || {};
  const food = daily.food || {};

  const scores: Record<string, number> = {};
  const tags: string[] = [];
  const reasons: Record<string, string> = {};
  const windows: any[] = [];

  /* ---------------- Emotional scoring ---------------- */

  const emotionalQuality = (emotional.quality || emotional.tone || "")
    .toString()
    .toLowerCase()
    .trim();

  let emotionalIntensity = 0;

  // Map quality → intensity score
  if (emotionalQuality === "intense") {
    emotionalIntensity = 0.9;
  } else if (emotionalQuality === "sensitive") {
    emotionalIntensity = 0.6;
  } else if (emotionalQuality === "low") {
    emotionalIntensity = 0.5;
  } else if (emotionalQuality === "steady") {
    emotionalIntensity = 0.2;
  }

  scores.emotionalIntensity = emotionalIntensity;

  if (emotional.summary) {
    reasons.emotional = String(emotional.summary);
  }

  if (emotionalIntensity >= 0.8) {
    tags.push("emotional-strong-day");
  } else if (emotionalIntensity >= 0.5) {
    tags.push("emotional-sensitive-day");
  } else {
    tags.push("emotional-steady-day");
  }

  /* ---------------- Money scoring ---------------- */

  const moneyTone = (money.tone || "")
    .toString()
    .toLowerCase()
    .trim();

  let moneyOpportunity = 0;
  let moneyRisk = 0;

  if (moneyTone === "opportunity") {
    moneyOpportunity = 0.9;
    moneyRisk = -0.1;
  } else if (moneyTone === "cautious") {
    moneyOpportunity = 0.1;
    moneyRisk = -0.8;
  } else if (moneyTone === "balanced") {
    moneyOpportunity = 0.4;
    moneyRisk = -0.3;
  }

  scores.moneyOpportunity = moneyOpportunity;
  scores.moneyRisk = moneyRisk;

  if (money.summary) {
    reasons.money = String(money.summary);
  }

  if (moneyOpportunity >= 0.75) {
    tags.push("money-opportunity");
  } else if (moneyRisk <= -0.6) {
    tags.push("money-caution");
  } else {
    tags.push("money-balanced");
  }

  /* ---------------- Fasting / discipline scoring ---------------- */

  // fasting: { suitableToday: boolean; type: 'light' | 'partial' | 'strong'; ... }
  const suitableToday =
    typeof fasting.suitableToday === "boolean"
      ? fasting.suitableToday
      : false;

  const fastingType = (fasting.type || "")
    .toString()
    .toLowerCase()
    .trim();

  let fastingStrength = 0;
  if (fastingType === "strong") {
    fastingStrength = 0.9;
  } else if (fastingType === "partial") {
    fastingStrength = 0.6;
  } else if (fastingType === "light") {
    fastingStrength = 0.3;
  }

  scores.fastingSuitability = suitableToday ? fastingStrength : 0;

  if (fasting.suggestion) {
    reasons.fasting = String(fasting.suggestion);
  }

  if (suitableToday) {
    tags.push("fasting-suitable");
  }

  /* ---------------- Food guidance scoring ---------------- */

  // FoodGuide shape: { suggestedFocus: string; do: string[]; avoid: string[] }
  const suggestedFocus =
    (food && food.suggestedFocus) || (food && food.focus) || "";

  const hasFoodFocus =
    (typeof suggestedFocus === "string" && suggestedFocus.trim().length > 0) ||
    (Array.isArray(food.do) && food.do.length > 0);

  if (hasFoodFocus) {
    // very light score – we mostly care about tag + reason
    scores.foodSupport = 0.4;

    let reason = "";
    if (typeof suggestedFocus === "string" && suggestedFocus.trim()) {
      reason = String(suggestedFocus).trim();
    }

    const firstDo =
      Array.isArray(food.do) && food.do.length > 0
        ? String(food.do[0])
        : "";

    if (firstDo) {
      reason = reason
        ? `${reason} Favour: ${firstDo}.`
        : `Favour: ${firstDo}.`;
    }

    if (reason) {
      reasons.food = reason;
      tags.push("food-guidance-available");

      // Optional “all-day” food window
      const fromISO = `${dateISO}T00:00:00`;
      const toISO = `${dateISO}T23:59:00`;

      windows.push({
        id: `food:${dateISO}`,
        kind: "food",
        fromISO,
        toISO,
        strength: 0.4,
        label: "Food & diet focus",
        reason,
      });
    }
  }

  /* ---------------- Priority scoring & meta tags ---------------- */

  const magnitude =
    Math.max(
      Math.abs(emotionalIntensity),
      Math.abs(moneyOpportunity),
      Math.abs(moneyRisk),
      Math.abs(scores.fastingSuitability || 0),
      Math.abs(scores.foodSupport || 0)
    ) || 0;

  scores.priority = magnitude;

  if (magnitude >= 0.8) {
    tags.push("high-priority-day");
  } else if (magnitude >= 0.5) {
    tags.push("medium-priority-day");
  } else {
    tags.push("low-priority-day");
  }

  /* ---------------- Time windows (existing v1 logic) ---------------- */

  // If fasting is suitable today, treat it as an all-day “discipline” window
  if (suitableToday) {
    const fromISO = `${dateISO}T00:00:00`;
    const toISO = `${dateISO}T23:59:00`;

    windows.push({
      id: `fasting:${dateISO}`,
      kind: "fasting",
      fromISO,
      toISO,
      strength: fastingStrength,
      label: "Discipline / fasting focus",
      reason:
        fasting.suggestion ||
        "Good day for gentle discipline and simplicity.",
    });
  }

  // Money “attention window” – v1: entire day if risk or opportunity is notable
  if (Math.max(Math.abs(moneyOpportunity), Math.abs(moneyRisk)) >= 0.6) {
    const fromISO = `${dateISO}T00:00:00`;
    const toISO = `${dateISO}T23:59:00`;

    windows.push({
      id: `money:${dateISO}`,
      kind: "money",
      fromISO,
      toISO,
      strength: Math.max(
        Math.abs(moneyOpportunity),
        Math.abs(moneyRisk)
      ),
      label:
        moneyOpportunity > Math.abs(moneyRisk)
          ? "Money opportunity focus"
          : "Money caution focus",
      reason:
        money.summary ||
        "Pay a bit more conscious attention to your financial decisions today.",
    });
  }

  /* ---------------- Return facts bundle ---------------- */

  return {
    dateISO,
    tags,
    scores,
    reasons,
    windows,
  };
}
