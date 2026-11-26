import { hasAllowedCampaignQuery } from "@/lib/meta/campaign";
import { NextRequest, NextResponse } from "next/server";

import {
  isMetaDiscoveryEvent,
  type MetaDiscoveryEvent,
} from "@/lib/meta/events";

import {
  getMetaConfig,
  isMetaAllowedOrigin,
} from "@/server/meta/config";

import {
  META_CONSENT_COOKIE,
  parseMetaConsentToken,
  verifyMetaConsentToken,
} from "@/server/meta/consent";

import {
  getMetaRegionalPermission,
  getMetaClientIp,
  getMetaClientUserAgent,
} from "@/server/meta/permissions";

import {
  checkMetaRateLimit,
  checkMetaIpRateLimit,
} from "@/server/meta/rate-limit";

import {
  claimMetaEvent,
  finishMetaEvent,
} from "@/server/meta/dispatch";

import { sendMetaEvent } from "@/server/meta/sender";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HOME_EVENTS = new Set<MetaDiscoveryEvent>([
  "PageView",
  "AstrologerExploreClick",
  "AstrologerEngineClick",
]);

const LANDING_EVENTS = new Set<MetaDiscoveryEvent>([
  "PageView",
  "ViewContent",
  "AstrologerEngineClick",
  "AstrologerPricingClick",
  "AstrologerPricingView",
  "AstrologerTrialIntent",
  "AstrologerPlanIntent",
  "AstrologerWaitlistIntent",
]);

function reply(status = 204) {
  return new NextResponse(null, {
    status,
    headers: {
      "Cache-Control": "no-store, private",
    },
  });
}

async function readBody(
  request: NextRequest
): Promise<unknown> {
  const reader = request.body?.getReader();

  if (!reader) throw new Error("Missing body");

  const decoder = new TextDecoder();

  let size = 0;
  let raw = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    size += value.byteLength;

    if (size > 1024) {
      await reader.cancel();
      throw new Error("Body too large");
    }

    raw += decoder.decode(value, { stream: true });
  }

  raw += decoder.decode();

  return JSON.parse(raw);
}

export async function POST(request: NextRequest) {
  const config = getMetaConfig();

  if (!config.enabled) return reply();

  const origin = request.headers.get("origin");

  if (
    !origin ||
    !isMetaAllowedOrigin(origin) ||
    origin !== request.nextUrl.origin ||
    request.headers.get("sec-fetch-site") !== "same-origin"
  ) {
    return reply(403);
  }

  const contentType =
    request.headers.get("content-type") ?? "";

  if (
    contentType.split(";")[0].trim().toLowerCase() !==
    "application/json"
  ) {
    return reply(415);
  }

  const referer = request.headers.get("referer");

  if (!referer) return reply(403);

  let source: URL;

  try {
    source = new URL(referer);
  } catch {
    return reply(403);
  }

  const path = source.pathname.replace(/\/+$/, "");

  if (
    source.origin !== origin ||
    source.username ||
    source.password ||
    !hasAllowedCampaignQuery(source.search) ||
    source.hash ||
    !["/sarathi", "/sarathi/astrologers"].includes(path)
  ) {
    return reply(403);
  }

  const regional = getMetaRegionalPermission(
    request.headers
  );

  if (!regional.permitted) return reply();

  const token =
    request.cookies.get(META_CONSENT_COOKIE)?.value;

  const consent = parseMetaConsentToken(token);

  if (!consent) return reply();

  const ipLimit = await checkMetaIpRateLimit(
    "discovery_ip",
    request.headers
  );

  if (ipLimit !== "allowed") {
    return reply(ipLimit === "limited" ? 429 : 503);
  }

  if (!(await verifyMetaConsentToken(token))) {
    return reply();
  }

  const sessionLimit = await checkMetaRateLimit(
    "discovery_session",
    consent.sessionId
  );

  if (sessionLimit !== "allowed") {
    return reply(sessionLimit === "limited" ? 429 : 503);
  }

  // The homepage contains personalised guidance
  // for authenticated users. Never track that version.
  if (path === "/sarathi") {
    try {
      const supabase = await createClient();

      const { data, error } =
        await supabase.auth.getUser();

      if (data.user) return reply();

      if (
        error &&
        error.name !== "AuthSessionMissingError"
      ) {
        return reply();
      }
    } catch {
      return reply();
    }
  }

  let body: unknown;

  try {
    body = await readBody(request);
  } catch {
    return reply(400);
  }

  if (!body || typeof body !== "object") {
    return reply(400);
  }

  const input = body as Record<string, unknown>;

  if (
    Object.keys(input).length !== 2 ||
    !isMetaDiscoveryEvent(input.eventName) ||
    typeof input.eventId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      .test(input.eventId)
  ) {
    return reply(400);
  }

  const eventName = input.eventName;
  const eventId = input.eventId;

  const allowed =
    path === "/sarathi"
      ? HOME_EVENTS
      : LANDING_EVENTS;

  if (!allowed.has(eventName)) return reply(403);

  if (!config.allowedEvents.has(eventName)) {
    return reply();
  }

  const ip = getMetaClientIp(request.headers);
  const userAgent = getMetaClientUserAgent(
    request.headers
  );

  if (!ip || !userAgent) return reply();

  const claim = await claimMetaEvent(
    eventId,
    eventName,
    consent.sessionId
  );

  if (claim === "duplicate") return reply();

  if (claim !== "claimed") return reply(503);

  // Recheck consent immediately before transmission.
  if (!(await verifyMetaConsentToken(token))) {
    await finishMetaEvent(
      eventId,
      consent.sessionId,
      "cancelled"
    );

    return reply();
  }

  const delivery = await sendMetaEvent({
    eventName,
    eventId,
    eventTime: Math.floor(Date.now() / 1000),
    sourceUrl: origin + path,
    consentGranted: true,
    sourceSharingPermitted: true,
    userData: {
      clientIpAddress: ip,
      clientUserAgent: userAgent,
    },
  });

  const recorded = await finishMetaEvent(
    eventId,
    consent.sessionId,
    delivery.status === "accepted" ? "sent" : "failed"
  );

  if (!recorded) return reply(503);

  return reply();
}