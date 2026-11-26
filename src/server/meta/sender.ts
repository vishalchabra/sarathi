import "server-only";

import {
  isMetaPublicPath,
  type MetaEvent,
} from "@/lib/meta/events";

import {
  getMetaConfig,
  isMetaAllowedOrigin,
} from "./config";

export type MetaUserData = {
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbp?: string;
  fbc?: string;
};

export type MetaServerEvent = {
  eventName: MetaEvent;
  eventId: string;
  eventTime: number;
  sourceUrl: string;
  consentGranted: boolean;
  sourceSharingPermitted: boolean;
  userData: MetaUserData;
  value?: number;
  currency?: string;
};

export type MetaDeliveryResult = {
  status:
    | "accepted"
    | "disabled"
    | "no_consent"
    | "not_permitted"
    | "event_not_enabled"
    | "invalid_event"
    | "invalid_source"
    | "invalid_money"
    | "missing_matching_data"
    | "not_accepted"
    | "server_error";
  eventId?: string;
  httpStatus?: number;
  metaErrorCode?: number;
};

function validateSource(sourceUrl: string): boolean {
  try {
    const url = new URL(sourceUrl);

    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.port &&
      !url.search &&
      !url.hash &&
      isMetaAllowedOrigin(url.origin) &&
      isMetaPublicPath(url.pathname)
    );
  } catch {
    return false;
  }
}

function cleanCookie(value?: string): string | undefined {
  if (
    typeof value === "string" &&
    /^fb\.[0-9]+\.[0-9]+\.[A-Za-z0-9_.-]{1,350}$/.test(value)
  ) {
    return value;
  }

  return undefined;
}

function buildUserData(input: MetaUserData) {
  return {
    client_ip_address:
      input.clientIpAddress?.slice(0, 64) || undefined,

    client_user_agent:
      input.clientUserAgent?.slice(0, 1024) || undefined,

    fbp: cleanCookie(input.fbp),
    fbc: cleanCookie(input.fbc),
  };
}

export async function sendMetaEvent(
  event: MetaServerEvent
): Promise<MetaDeliveryResult> {
  const config = getMetaConfig();

  if (!config.enabled) {
    return { status: "disabled" };
  }

  if (event.consentGranted !== true) {
    return { status: "no_consent" };
  }

  if (event.sourceSharingPermitted !== true) {
    return { status: "not_permitted" };
  }

  if (!config.allowedEvents.has(event.eventName)) {
    return { status: "event_not_enabled" };
  }

  const now = Math.floor(Date.now() / 1000);

  if (
    !/^[A-Za-z0-9_-]{16,128}$/.test(event.eventId) ||
    !Number.isInteger(event.eventTime) ||
    event.eventTime > now + 60 ||
    event.eventTime < now - 604800
  ) {
    return { status: "invalid_event" };
  }

  if (!validateSource(event.sourceUrl)) {
    return { status: "invalid_source" };
  }

  const userData = buildUserData(event.userData);

  if (
    !userData.fbp &&
    !userData.fbc &&
    !(userData.client_ip_address && userData.client_user_agent)
  ) {
    return { status: "missing_matching_data" };
  }

  const payload: Record<string, unknown> = {
    event_name: event.eventName,
    event_time: event.eventTime,
    event_id: event.eventId,
    event_source_url: event.sourceUrl,
    action_source: "website",
    user_data: userData,
  };

  if (
    event.eventName === "Purchase" ||
    event.eventName === "InitiateCheckout"
  ) {
    if (
      typeof event.value !== "number" ||
      !Number.isFinite(event.value) ||
      event.value < 0 ||
      typeof event.currency !== "string" ||
      !/^[A-Z]{3}$/.test(event.currency)
    ) {
      return { status: "invalid_money" };
    }

    payload.custom_data = {
      value: event.value,
      currency: event.currency,
    };
  }

  const body: Record<string, unknown> = {
    data: [payload],
  };

  if (config.testEventCode) {
    body.test_event_code = config.testEventCode;
  }

  const endpoint =
    `https://graph.facebook.com/${config.apiVersion}/${config.pixelId}/events`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.accessToken}`,
      },

      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });

    const result = await response.json().catch(() => null);

    if (
      response.ok &&
      typeof result?.events_received === "number" &&
      result.events_received >= 1
    ) {
      return {
        status: "accepted",
        eventId: event.eventId,
        httpStatus: response.status,
      };
    }

    return {
      status: "not_accepted",
      httpStatus: response.status,
      metaErrorCode:
        typeof result?.error?.code === "number"
          ? result.error.code
          : undefined,
    };
  } catch {
    return {
      status: "server_error",
      eventId: event.eventId,
    };
  }
}