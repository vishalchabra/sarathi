import "server-only";

import {
  META_PIXEL_ID,
  isMetaDiscoveryEvent,
  isMetaConversionEvent,
  type MetaEvent,
} from "@/lib/meta/events";

const META_ALLOWED_ORIGINS = [
  "https://sarathiyourguide.com",
  "https://www.sarathiyourguide.com",
] as const;

function readAllowedEvents(): ReadonlySet<MetaEvent> {
  const raw = process.env.META_ALLOWED_EVENTS ?? "";

  const events = raw
    .split(",")
    .map((value) => value.trim())
    .filter(
      (value): value is MetaEvent =>
        isMetaDiscoveryEvent(value) ||
        isMetaConversionEvent(value)
    );

  return new Set(events);
}

export function getMetaConfig() {
  const requestedEnabled =
    process.env.META_CAPI_ENABLED === "true";

  const accessToken =
    process.env.META_CAPI_ACCESS_TOKEN?.trim() ?? "";

  const apiVersion =
    process.env.META_GRAPH_API_VERSION?.trim() ?? "";

  const testEventCode =
    process.env.META_TEST_EVENT_CODE?.trim() ?? "";

  const allowedEvents = readAllowedEvents();

  const configured =
    accessToken.length > 0 &&
    !accessToken.startsWith("PASTE_") &&
    /^v[0-9]+\.[0-9]+$/.test(apiVersion) &&
    allowedEvents.size > 0;

  return {
    enabled: requestedEnabled && configured,
    configured,
    pixelId: META_PIXEL_ID,
    accessToken,
    apiVersion,
    testEventCode,
    allowedEvents,
    allowedOrigins: META_ALLOWED_ORIGINS,
  };
}

export function isMetaEventEnabled(
  event: MetaEvent
): boolean {
  const config = getMetaConfig();

  return (
    config.enabled &&
    config.allowedEvents.has(event)
  );
}

export function isMetaAllowedOrigin(
  origin: string
): boolean {
  return (
    META_ALLOWED_ORIGINS as readonly string[]
  ).includes(origin);
}