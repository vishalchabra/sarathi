// src/server/qa/scoring.ts
import { Graha, VimshottariSpan, TransitSample, TransitWindow, TimingWindow } from "@/types/timing";

export const W = {
  // dasha
  MD_JOB: { Rahu: +0.5, Jupiter: +0.6, Saturn: +0.2, Venus: +0.3, Sun: +0.2, Mercury: +0.4, Mars: +0.2, Moon: +0.1, Ketu: +0.1 },
  AD_JOB: { Venus: +0.45, Mercury: +0.35, Sun: +0.25, Jupiter: +0.35, Rahu: +0.25, Mars: +0.15, Moon: +0.15, Saturn: +0.15, Ketu: +0.15 },

  // transits (per day)
  JUP_TO_10TH: +0.35,
  VENUS_ANGLE_10TH: +0.18,
  MERC_DIRECT: +0.1,
  SATURN_PRESSURE_10TH: -0.25,
  MARS_CONFLICT_10TH: -0.15,

  // nakshatra overlays
  STAR_OF_10LORD: +0.15,
  TARA_BALA_BAD: -0.1,
};

export type Topic = "job"|"vehicle"|"property"|"wealth"|"health"|"relationships"|"marriage"|"disputes";

export function dashaScore(topic: Topic, md: Graha, ad: Graha) {
  if (topic !== "job") return 0; // add maps per topic later
  const mdw = (W.MD_JOB as any)[md] ?? 0;
  const adw = (W.AD_JOB as any)[ad] ?? 0;
  return mdw + adw;
}
