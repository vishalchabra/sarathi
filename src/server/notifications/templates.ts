// FILE: src/server/notifications/templates.ts

import {
  NotificationTemplate,
  NotificationContext,
} from "./types";

/**
 * Helper: convert single value or array to an array.
 */
function arr<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * Starter template list.
 * We keep these very generic; later we’ll add Food, Money, Fasting, etc.
 */
export const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  /* ---------------- EMOTIONAL ---------------- */

  {
    id: "emotional_sensitive_morning",
    domain: "emotional",
    priority: 90,
    when: {
      hasAnyTag: ["emotional_sensitive"],
      timeOfDay: "morning",
    },
    render: ({ facts }: NotificationContext) => {
      const reason =
        facts.reasons?.emotional ??
        "Today’s emotional weather is more sensitive than usual.";
      return (
        reason +
        " Give yourself a softer start: fewer big conversations before lunch, more space to arrive in your own energy."
      );
    },
  },

  {
    id: "emotional_steady_anytime",
    domain: "emotional",
    priority: 40,
    when: {
      hasAnyTag: ["emotional_steady"],
    },
    render: () =>
      "Emotional tone is steady today. This is a good day to clear one or two pending conversations without forcing outcomes.",
  },

  /* ---------------- MONEY ---------------- */

  {
    id: "money_caution_morning",
    domain: "money",
    priority: 95,
    when: {
      hasAnyTag: ["money_caution"],
      timeOfDay: "morning",
      minScore: { money: 0 }, // just to show usage; can tune later
    },
    render: ({ facts }: NotificationContext) => {
      const reason =
        facts.reasons?.money ??
        "Key transits are asking for patience around money.";
      return (
        reason +
        " Treat today as an ‘observation’ day for money decisions: review, reflect, but avoid fresh high-risk commitments if you can."
      );
    },
  },

  {
    id: "money_supportive_midday",
    domain: "money",
    priority: 80,
    when: {
      hasAnyTag: ["money_supportive"],
      timeOfDay: ["morning", "midday"],
    },
    render: ({ facts }: NotificationContext) => {
      const reason =
        facts.reasons?.money ??
        "The financial tone today supports steady, sensible progress.";
      return (
        reason +
        " Take one concrete, low-drama step toward your financial goals—send that email, review that plan, or set up that call."
      );
    },
  },

  /* ---------------- FASTING & DISCIPLINE ---------------- */

  {
    id: "fasting_good_day_morning",
    domain: "fasting",
    priority: 70,
    when: {
      hasAllTags: ["fasting_good_day"],
      timeOfDay: "morning",
    },
    render: () =>
      "Discipline window is strong today. If you’ve been planning a light fast or a digital detox, this is a supportive day to try a simple, realistic version of it.",
  },

  {
    id: "fasting_rest_day",
    domain: "fasting",
    priority: 60,
    when: {
      hasAnyTag: ["fasting_rest_day"],
    },
    render: () =>
      "Today is better used as a recovery and grounding day rather than pushing extreme discipline. Honour your body’s signals.",
  },

  /* ---------------- TRANSIT WINDOWS ---------------- */

  {
    id: "transit_rahu_kaal_warning",
    domain: "transit",
    priority: 85,
    when: {
      hasAnyTag: ["rahu_kaal_active"],
    },
    render: () =>
      "Rahu Kaal is active. This is traditionally avoided for new beginnings—use this window for routine tasks, not big launches or fresh commitments.",
  },

  {
    id: "transit_strong_mars_career",
    domain: "transit",
    priority: 88,
    when: {
      hasAllTags: ["transit_strong_mars", "career_focus"],
    },
    render: () =>
      "Mars is strongly influencing your work zone. Channel this into focused action, not conflict: tackle one demanding task, avoid impulsive reactions with colleagues.",
  },

  /* ---------------- GENERIC FALLBACK ---------------- */

  {
    id: "generic_fallback_anytime",
    domain: "generic",
    priority: 10,
    when: {},
    render: () =>
      "Stay close to your inner compass today: one honest action, one honest conversation, and one honest promise to yourself are enough.",
  },
];
