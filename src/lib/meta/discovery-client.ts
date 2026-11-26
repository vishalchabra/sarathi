"use client";

import { hasAllowedCampaignQuery } from "@/lib/meta/campaign";

import {
  isMetaPublicPath,
  type MetaDiscoveryEvent,
} from "./events";

import {
  waitForMetaConsentSync,
} from "./consent-client";

function locallyPermitted(): boolean {
  try {
    const raw = localStorage.getItem(
      "sarathi_cookie_consent_v1"
    );

    return (
      !!raw &&
      JSON.parse(raw).marketing === true &&
      localStorage.getItem(
        "sarathi_meta_withdrawal_pending"
      ) !== "true" &&
      isMetaPublicPath(window.location.pathname)
    );
  } catch {
    return false;
  }
}

export async function trackMetaDiscovery(
  eventName: MetaDiscoveryEvent
): Promise<void> {
  if (!locallyPermitted()) return;

  const sourcePath = window.location.pathname;

  // Only recognised campaign query parameters are accepted
  // Raw campaign values are not transmitted to Meta.
  if (!hasAllowedCampaignQuery(window.location.search)) return;

  try {
    if (!(await waitForMetaConsentSync())) return;

    if (
      !locallyPermitted() ||
      window.location.pathname !== sourcePath ||
      !hasAllowedCampaignQuery(window.location.search)
    ) {
      return;
    }

    const eventId = crypto.randomUUID();

    await fetch("/api/meta/discovery", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      keepalive: true,
      referrerPolicy: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventName,
        eventId,
      }),
      signal: AbortSignal.timeout(12000),
    });
  } catch {
    // Tracking must never interrupt navigation
    // or other website functionality.
  }
}