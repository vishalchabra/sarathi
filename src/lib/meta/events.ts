/**
 * Sārathi Meta tracking definitions.
 *
 * Public acquisition events only.
 * Private astrology data must never be included.
 */

export const META_PIXEL_ID = "1143945841442638";

export const META_PUBLIC_PATHS = [
  "/sarathi",
  "/sarathi/astrologers",
] as const;

export const META_DISCOVERY_EVENTS = [
  "PageView",
  "ViewContent",
  "AstrologerExploreClick",
  "AstrologerEngineClick",
  "AstrologerPricingClick",
  "AstrologerPricingView",
  "AstrologerTrialIntent",
  "AstrologerPlanIntent",
  "AstrologerWaitlistIntent",
] as const;

export const META_CONVERSION_EVENTS = [
  "Lead",
  "CompleteRegistration",
  "StartTrial",
  "InitiateCheckout",
  "Purchase",
] as const;

export type MetaDiscoveryEvent =
  (typeof META_DISCOVERY_EVENTS)[number];

export type MetaConversionEvent =
  (typeof META_CONVERSION_EVENTS)[number];

export type MetaEvent =
  | MetaDiscoveryEvent
  | MetaConversionEvent;

export const META_ACTION_EVENTS = {
  explore: "AstrologerExploreClick",
  engine: "AstrologerEngineClick",
  pricing: "AstrologerPricingClick",
  trial: "AstrologerTrialIntent",
  professional: "AstrologerPlanIntent",
  waitlist: "AstrologerWaitlistIntent",
} as const satisfies Record<string, MetaDiscoveryEvent>;

export function isMetaPublicPath(path: string): boolean {
  const normalized = path.replace(/\/+$/, "") || "/";

  return (META_PUBLIC_PATHS as readonly string[])
    .includes(normalized);
}

export function isMetaDiscoveryEvent(
  value: unknown
): value is MetaDiscoveryEvent {
  return (
    typeof value === "string" &&
    (META_DISCOVERY_EVENTS as readonly string[])
      .includes(value)
  );
}

export function isMetaConversionEvent(
  value: unknown
): value is MetaConversionEvent {
  return (
    typeof value === "string" &&
    (META_CONVERSION_EVENTS as readonly string[])
      .includes(value)
  );
}