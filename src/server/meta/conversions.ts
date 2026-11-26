import "server-only";

import type {
  MetaConversionEvent,
} from "@/lib/meta/events";

import {
  getMetaConfig,
  isMetaAllowedOrigin,
} from "./config";

import {
  META_CONSENT_COOKIE,
  parseMetaConsentToken,
} from "./consent";

import {
  getMetaRegionalPermission,
  getMetaClientIp,
  getMetaClientUserAgent,
} from "./permissions";

import {
  createConversionEventId,
  type ConversionAttribution,
} from "./attribution";

import {
  claimMetaEvent,
  finishMetaEvent,
} from "./dispatch";

import { verifyMetaSession } from "./store";
import { sendMetaEvent } from "./sender";
import { hasAstrologerAcquisition } from "./acquisition";
import { hasAllowedCampaignQuery } from "@/lib/meta/campaign";

export type ConversionContext = {
  attribution: ConversionAttribution;
  sourceUrl: string;
  clientIpAddress: string;
  clientUserAgent: string;
};

export async function getConversionContext(
  request: Request,
  consentToken: string | undefined
): Promise<ConversionContext | null> {
  try {
    const config = getMetaConfig();

    if (
      !config.enabled ||
      process.env.META_CONVERSIONS_ENABLED !== "true"
    ) return null;

    const origin = new URL(request.url).origin;

    if (
      !isMetaAllowedOrigin(origin) ||
      request.headers.get("origin") !== origin ||
      request.headers.get("sec-fetch-site") !==
        "same-origin"
    ) {
      return null;
    }

    const referer = request.headers.get("referer");

    if (!referer) return null;

    const source = new URL(referer);

    if (
      source.origin !== origin ||
      source.pathname.replace(/\/+$/, "") !==
        "/sarathi/astrologers" ||
      source.username ||
      source.password ||
      source.hash ||
      !hasAllowedCampaignQuery(source.search)
    ) {
      return null;
    }

    const regional = getMetaRegionalPermission(
      request.headers
    );

    if (!regional.permitted) return null;

    const consent =
      parseMetaConsentToken(consentToken);

    if (!consent) return null;

    if (
      !(await verifyMetaSession(
        consent.sessionId,
        consent.revision
      ))
    ) {
      return null;
    }

    if (
      !(await hasAstrologerAcquisition(
        consent.sessionId,
        consent.revision
      ))
    ) {
      return null;
    }

    const clientIpAddress =
      getMetaClientIp(request.headers);

    const clientUserAgent =
      getMetaClientUserAgent(request.headers);

    if (!clientIpAddress || !clientUserAgent) {
      return null;
    }

    return {
      attribution: {
        sessionId: consent.sessionId,
        revision: consent.revision,
      },
      sourceUrl: source.origin + source.pathname.replace(/\/+$/, ""),
      clientIpAddress,
      clientUserAgent,
    };
  } catch {
    return null;
  }
}

export async function sendConfirmedConversion(
  input: {
    eventName: MetaConversionEvent;
    reference: string;
    context: ConversionContext;
    eventTime: number;
    value?: number;
    currency?: string;
  }
): Promise<boolean> {
  try {
    const config = getMetaConfig();

    if (
      !config.enabled ||
      !config.allowedEvents.has(input.eventName)
    ) {
      return false;
    }

    // Require explicit approval for conversion sharing.
    if (
      process.env.META_CONVERSIONS_ENABLED !== "true"
    ) {
      return false;
    }

    const eventId = createConversionEventId(
      input.eventName,
      input.reference
    );

    if (!eventId) return false;

    const { sessionId, revision } =
      input.context.attribution;

    if (
      !(await verifyMetaSession(sessionId, revision))
    ) {
      return false;
    }

    const claim = await claimMetaEvent(
      eventId,
      input.eventName,
      sessionId
    );

    if (claim !== "claimed") return false;

    if (
      !(await verifyMetaSession(sessionId, revision))
    ) {
      await finishMetaEvent(
        eventId,
        sessionId,
        "cancelled"
      );

      return false;
    }

    const result = await sendMetaEvent({
      eventName: input.eventName,
      eventId,
      eventTime: input.eventTime,
      sourceUrl: input.context.sourceUrl,
      consentGranted: true,
      sourceSharingPermitted: true,
      userData: {
        clientIpAddress:
          input.context.clientIpAddress,
        clientUserAgent:
          input.context.clientUserAgent,
      },
      value: input.value,
      currency: input.currency,
    });

    const accepted =
      result.status === "accepted";

    const recorded = await finishMetaEvent(
      eventId,
      sessionId,
      accepted ? "sent" : "failed"
    );

    return accepted && recorded;
  } catch {
    return false;
  }
}

export { META_CONSENT_COOKIE };