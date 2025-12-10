// FILE: src/server/notifications/engine.ts

import "server-only";

import type {
  NotificationContext,
  NotificationTemplate,
  
} from "./types";
import { NOTIFICATION_TEMPLATES } from "./templates";
// Temporary alias – relax typing until types.ts exports this formally
type SarathiNotification = any;

/* ---------------- Condition checks ---------------- */

function hasAnyTag(ctx: NotificationContext, tags?: string[]): boolean {
  if (!tags || tags.length === 0) return true;
  const set = new Set(ctx.facts.tags || []);
  return tags.some((t) => set.has(t));
}

function hasAllTags(ctx: NotificationContext, tags?: string[]): boolean {
  if (!tags || tags.length === 0) return true;
  const set = new Set(ctx.facts.tags || []);
  return tags.every((t) => set.has(t));
}

function missingTags(ctx: NotificationContext, tags?: string[]): boolean {
  if (!tags || tags.length === 0) return true;
  const set = new Set(ctx.facts.tags || []);
  return tags.every((t) => !set.has(t));
}

function timeOfDayMatches(
  ctx: NotificationContext,
  timeOfDay?: NotificationTemplate["when"]["timeOfDay"]
): boolean {
  if (!timeOfDay) return true;
  const allowed = Array.isArray(timeOfDay) ? timeOfDay : [timeOfDay];
  return allowed.includes(ctx.timeOfDay);
}

function scoreWithinRange(
  ctx: NotificationContext,
  minScore?: NotificationTemplate["when"]["minScore"],
  maxScore?: NotificationTemplate["when"]["maxScore"]
): boolean {
  if (!minScore && !maxScore) return true;
  const scores = ctx.facts.scores || {};

  if (minScore) {
    for (const [domain, min] of Object.entries(minScore)) {
      const val = scores[domain as keyof typeof scores];
      if (typeof val === "number" && val < (min ?? 0)) return false;
    }
  }

  if (maxScore) {
    for (const [domain, max] of Object.entries(maxScore)) {
      const val = scores[domain as keyof typeof scores];
      if (typeof val === "number" && val > (max ?? 100)) return false;
    }
  }

  return true;
}

function templateMatches(
  template: NotificationTemplate,
  ctx: NotificationContext
): boolean {
  const w = template.when;

  if (!hasAnyTag(ctx, w.hasAnyTag)) return false;
  if (!hasAllTags(ctx, w.hasAllTags)) return false;
  if (!missingTags(ctx, w.missingTags)) return false;
  if (!timeOfDayMatches(ctx, w.timeOfDay)) return false;
  if (!scoreWithinRange(ctx, w.minScore, w.maxScore)) return false;

  return true;
}

/* ---------------- Main engine ---------------- */

export type PickOptions = {
  /**
   * Max notifications to send at once.
   * Default: 3
   */
  maxPerBatch?: number;

  /**
   * Optional domains to include; if empty, all are allowed.
   */
  allowedDomains?: NotificationTemplate["domain"][];
};

/**
 * Main selection function.
 * Given the daily facts + time-of-day bucket, choose
 * a small set of notifications and render their text.
 */
export function pickNotificationsForMoment(
  ctx: NotificationContext,
  options?: { maxPerBatch?: number }
): SarathiNotification[] {
  const max = options?.maxPerBatch ?? 3;

  const { timeOfDay } = ctx;
  const facts: any = ctx.facts || {};

  const dateISO: string =
    typeof facts.dateISO === "string"
      ? facts.dateISO
      : new Date().toISOString().slice(0, 10);

  const tags: string[] = Array.isArray(facts.tags) ? facts.tags : [];
  const scores = facts.scores || {};
  const reasons = facts.reasons || {};
  const windows: any[] = Array.isArray(facts.windows) ? facts.windows : [];

  const notifications: SarathiNotification[] = [];

  const hasTag = (t: string) => tags.includes(t);

  const emotionalIntensity =
    typeof scores.emotionalIntensity === "number"
      ? scores.emotionalIntensity
      : 0;
  const moneyRisk =
    typeof scores.moneyRisk === "number" ? scores.moneyRisk : 0;
  const moneyOpportunity =
    typeof scores.moneyOpportunity === "number"
      ? scores.moneyOpportunity
      : 0;

  function pickWindowHint(domain: string): string | null {
    if (!windows.length) return null;

    const domainLower = domain.toLowerCase();

    const candidates = windows.filter((w) => {
      if (!w) return false;
      const dom = String(w.domain || "").toLowerCase();
      if (dom && dom !== domainLower) return false;

      const tod = (w.timeOfDay || "any") as
        | "morning"
        | "midday"
        | "evening"
        | "any";

      if (tod === "any") return true;
      return tod === timeOfDay;
    });

    if (!candidates.length) return null;

    candidates.sort((a, b) => {
      const ea =
        typeof a.emphasis === "number" && Number.isFinite(a.emphasis)
          ? a.emphasis
          : 0;
      const eb =
        typeof b.emphasis === "number" && Number.isFinite(b.emphasis)
          ? b.emphasis
          : 0;
      return eb - ea;
    });

    const best = candidates[0];

    const start =
      typeof best.startLocalTime === "string"
        ? best.startLocalTime.slice(0, 5)
        : "";
    const end =
      typeof best.endLocalTime === "string"
        ? best.endLocalTime.slice(0, 5)
        : "";

    if (start && end) {
      return ` Best used between ${start}–${end} (your local time).`;
    }

    if (typeof best.label === "string" && best.label.trim()) {
      return ` Focus this more around ${best.label.trim()}.`;
    }

    return null;
  }

  function add(domain: string, text: string) {
    if (!text || notifications.length >= max) return;

    const hint = pickWindowHint(domain);
    const fullText = hint ? text + hint : text;

    notifications.push({
      id: `${domain}:${timeOfDay}:${dateISO}:${notifications.length}`,
      domain,
      text: fullText,
    });
  }

  /* ---------------- Time-of-day strategy ---------------- */

  if (timeOfDay === "morning") {
    // 1) Emotional headline for the day
    if (reasons.emotional) {
      if (hasTag("emotional-strong-day")) {
        add(
          "emotional",
          "Emotional weather is louder than usual today. " +
            reasons.emotional +
            " Keep expectations realistic and choose one or two key conversations only."
        );
      } else if (hasTag("emotional-sensitive-day")) {
        add(
          "emotional",
          "You may feel a bit more sensitive today. " +
            reasons.emotional +
            " Start the day gently and avoid overloading your schedule."
        );
      } else {
        add(
          "emotional",
          "Emotionally, today looks steady. " +
            reasons.emotional +
            " Use the morning to choose 1–2 clear priorities."
        );
      }
    }

    // 2) Food guidance
    if (hasTag("food-guidance-available") && reasons.food) {
      add(
        "food",
        "Food for today: " +
          reasons.food +
          " Plan one or two simple, aligned meals now so you aren’t deciding from stress or hunger later."
      );
    }

    // 3) Money tone
    if (hasTag("money-caution") && reasons.money) {
      add(
        "money",
        "Money tone: Caution. " +
          reasons.money +
          " Avoid quick decisions or impulsive spending in the first half of the day."
      );
    } else if (hasTag("money-opportunity") && reasons.money) {
      add(
        "money",
        "Money tone: Subtle opportunity. " +
          reasons.money +
          " Take one well-researched, small step rather than chasing big moves."
      );
    }

    // 4) Fasting / discipline
    if (hasTag("fasting-suitable") && reasons.fasting) {
      add(
        "fasting",
        "Discipline window: Today is suitable for light fasting or cleaner food. " +
          reasons.fasting
      );
    }
  }

  if (timeOfDay === "midday") {
    // Check-in: are you following the emotional plan?
    if (emotionalIntensity >= 0.5 && reasons.emotional) {
      add(
        "emotional",
        "Midday check-in: Notice if your mood has shifted since morning. " +
          reasons.emotional +
          " Take a short pause before any emotionally loaded calls or messages."
      );
    }

    // Money caution / opportunity during market hours
    if (hasTag("money-caution") && reasons.money) {
      add(
        "money",
        "Midday money reminder: " +
          reasons.money +
          " If you’re about to commit money (spending, trades, loans), pause and re-check the basics."
      );
    } else if (hasTag("money-opportunity") && reasons.money) {
      add(
        "money",
        "Midday money reminder: " +
          reasons.money +
          " Use this window to make one small but meaningful adjustment to your money plan."
      );
    }

    // Discipline nudge
    if (hasTag("fasting-suitable") && reasons.fasting) {
      add(
        "fasting",
        "Discipline reminder: Stay a little mindful around lunch. " +
          reasons.fasting
      );
    }

    // Food check-in
    if (hasTag("food-guidance-available") && reasons.food) {
      add(
        "food",
        "Midday food check-in: " +
          reasons.food +
          " Even one aligned meal today counts; don’t chase perfection."
      );
    }
  }

  if (timeOfDay === "evening") {
    // Evening emotional reflection
    if (reasons.emotional) {
      add(
        "emotional",
        "Evening reflection: How did you actually live today’s emotional weather? " +
          reasons.emotional +
          " One small grounding ritual before sleep can help you close the day well."
      );
    }

    // Money reflection
    if (
      (hasTag("money-caution") || hasTag("money-opportunity")) &&
      reasons.money
    ) {
      add(
        "money",
        "Money reflection: " +
          reasons.money +
          " Make a quick note of any decisions you took today and whether they matched your longer-term plan."
      );
    }

    // Fasting / discipline wrap-up
    if (hasTag("fasting-suitable") && reasons.fasting) {
      add(
        "fasting",
        "Discipline wrap-up: " +
          reasons.fasting +
          " Even if the day wasn’t perfect, notice one choice you made that respected your body."
      );
    }

    // Food reflection
    if (hasTag("food-guidance-available") && reasons.food) {
      add(
        "food",
        "Evening food reflection: " +
          reasons.food +
          " Notice one food choice today that genuinely supported your body, and one you’d like to handle better next time."
      );
    }
  }

  /* ---------------- Fallback: generic notification ---------------- */

  if (notifications.length === 0) {
    const genericReason =
      reasons.emotional ||
      reasons.money ||
      "Today is a workable day. Stay simple, honest and consistent with yourself.";

    add(
      "generic",
      `Today’s overall tone is moderate. ${genericReason} Treat this as a day for small, consistent steps rather than dramatic moves.`
    );
  }

  // Respect max limit
  return notifications.slice(0, max);
}
