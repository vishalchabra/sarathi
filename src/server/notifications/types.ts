// FILE: src/server/notifications/types.ts

export type NotificationDomain =
  | "emotional"
  | "money"
  | "food"
  | "fasting"
  | "transit"
  | "myth"
  | "generic";

/**
 * Facts for a given user+day that the notification engine will see.
 * Later we’ll map your Daily Guide / life-engine output into this.
 */
export type NotificationFacts = {
  userId?: string;
  dateISO: string; // e.g. "2025-12-04"

  /**
   * High-level tags summarising the day.
   * Examples:
   *  - "money_caution"
   *  - "money_supportive"
   *  - "emotional_sensitive"
   *  - "emotional_steady"
   *  - "fasting_good_day"
   *  - "fasting_rest_day"
   *  - "transit_strong_mars"
   *  - "transit_ketu_cleanup"
   */
  tags: string[];

  /**
   * Time windows for special conditions – used for
   * Rahu Kaal, Abhijit, strong transit hits, etc.
   */
  windows?: Array<{
    id: string; // "rahu_kaal", "abhijit", "mars_hit_career", etc.
    tag?: string; // "avoid_new_beginnings", "good_for_actions", etc.
    startISO: string;
    endISO: string;
  }>;

  /**
   * Optional numeric scores (0–100) per domain.
   * These help us choose between “soft hint” vs “strong nudge”.
   */
  scores?: Partial<{
    emotional: number;
    money: number;
    fasting: number;
    food: number;
  }>;

  /**
   * Any short “why” notes we may want to reuse inside templates.
   * Example: { money: "Rahu MD + Saturn transit over 10th house", ... }
   */
  reasons?: Partial<Record<NotificationDomain, string>>;
};

export type TimeOfDay = "morning" | "midday" | "evening" | "night";

/**
 * Context at the **moment** we are picking notifications.
 * Same facts, plus what time-of-day bucket we’re in.
 */
export type NotificationContext = {
  facts: NotificationFacts;
  timeOfDay: TimeOfDay;
};

export type NotificationTemplateId = string;

export type NotificationTemplate = {
  id: NotificationTemplateId;
  domain: NotificationDomain;

  /**
   * Higher priority wins when there is a conflict.
   * Range convention: 1–100 (but not enforced by type)
   */
  priority: number;

  /**
   * Conditions for this template to be eligible.
   * All conditions that are present must pass.
   */
  when: {
    hasAnyTag?: string[]; // at least one of these tags must be present
    hasAllTags?: string[]; // all of these tags must be present
    missingTags?: string[]; // none of these tags may be present

    /**
     * Optional time-of-day filter – e.g. morning-only message.
     */
    timeOfDay?: TimeOfDay | TimeOfDay[];

    /**
     * Domain score ranges, if relevant.
     */
    minScore?: Partial<Record<NotificationDomain, number>>;
    maxScore?: Partial<Record<NotificationDomain, number>>;
  };

  /**
   * Render function for the final user-facing text.
   * This is where we keep the “Sarathi voice”.
   */
  render: (ctx: NotificationContext) => string;
};

export type Notification = {
  id: string; // unique id for this concrete notification instance
  domain: NotificationDomain;
  text: string;
};
