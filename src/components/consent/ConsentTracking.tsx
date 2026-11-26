"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { META_PIXEL_ID, isMetaPublicPath } from "@/lib/meta/events";
import { waitForMetaConsentSync } from "@/lib/meta/consent-client";
import {
  CONSENT_EVENT,
  readConsent,
  type ConsentPreferences,
} from "./CookieConsent";

const GA_ID = "G-WKFJ595D05";
const PIXEL_ID = META_PIXEL_ID;

// Browser Pixel must remain disabled until public
// marketing pages are isolated from private app pages.
const META_BROWSER_ISOLATION_READY: boolean = false;

type TrackingWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: ((...args: unknown[]) => void) & {
    callMethod?: (...args: unknown[]) => void;
    queue?: unknown[][];
    loaded?: boolean;
    version?: string;
    push?: (...args: unknown[]) => void;
    disablePushState?: boolean;
  };
  _fbq?: (...args: unknown[]) => void;
};

let gaLoaded = false;
let pixelLoaded = false;
let metaPermissionRequestId = 0;
let metaServerPermitted = false;

let preferences: ConsentPreferences = {
  analytics: false,
  marketing: false,
};

let lastPath = "";
let lastAnalyticsPath = "";
let lastMarketingPath = "";

function setupGA(win: TrackingWindow) {
  win.dataLayer = win.dataLayer || [];

  win.gtag = (...args: unknown[]) => {
    win.dataLayer?.push(args);
  };

  win.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: preferences.marketing ? "granted" : "denied",
    ad_user_data: preferences.marketing ? "granted" : "denied",
    ad_personalization: preferences.marketing ? "granted" : "denied",
  });

  win.gtag("js", new Date());

  win.gtag("config", GA_ID, {
    send_page_view: false,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src =
    `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;

  document.head.appendChild(script);
  gaLoaded = true;
}

function setupPixel(win: TrackingWindow) {
  if (!META_BROWSER_ISOLATION_READY) {
    return;
  }

  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue?.push(args);
    }
  }) as NonNullable<TrackingWindow["fbq"]>;

  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = (...args: unknown[]) => fbq(...args);

  // Disable automatic SPA history tracking.
  fbq.disablePushState = true;

  win.fbq = fbq;
  win._fbq = fbq;

  fbq("consent", "revoke");
  fbq("set", "autoConfig", false, PIXEL_ID);
  fbq("init", PIXEL_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src =
    "https://connect.facebook.net/en_US/fbevents.js";

  document.head.appendChild(script);
  pixelLoaded = true;
}

function isMetaLocallyPermitted(): boolean {
  return (
    META_BROWSER_ISOLATION_READY &&
    preferences.marketing &&
    isMetaPublicPath(window.location.pathname) &&
    !window.location.search &&
    !window.location.hash
  );
}

async function updateMetaRoutePermission() {
  const requestId = ++metaPermissionRequestId;
  const sourceUrl = window.location.href;
  const win = window as TrackingWindow;

  metaServerPermitted = false;

  if (pixelLoaded && win.fbq) {
    win.fbq("consent", "revoke");
  }

  if (!isMetaLocallyPermitted()) {
    lastMarketingPath = "";
    return;
  }

  try {
    const consentSyncSuccessful =
      await waitForMetaConsentSync();

    if (!consentSyncSuccessful) {
      return;
    }

    if (
      requestId !== metaPermissionRequestId ||
      sourceUrl !== window.location.href ||
      !isMetaLocallyPermitted()
    ) {
      return;
    }

    const response = await fetch(
      "/api/meta/permission",
      {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
        referrerPolicy: "same-origin",
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      return;
    }

    const result = await response.json();

    if (
      requestId !== metaPermissionRequestId ||
      sourceUrl !== window.location.href ||
      !isMetaLocallyPermitted() ||
      result.permitted !== true
    ) {
      return;
    }

    metaServerPermitted = true;

    if (!pixelLoaded) {
      setupPixel(win);
    }

    if (win.fbq) {
      win.fbq("consent", "grant");

      const path = window.location.pathname;

      if (
        metaServerPermitted &&
        lastMarketingPath !== path
      ) {
        win.fbq("track", "PageView");
        lastMarketingPath = path;
      }
    }
  } catch {
    // Permission failures must not enable tracking.
  }
}

function trackCurrentPage() {
  void updateMetaRoutePermission();
  const win = window as TrackingWindow;
  const path = window.location.pathname;

  if (
    preferences.analytics &&
    win.gtag &&
    lastAnalyticsPath !== path
  ) {
    win.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.origin + path,
    });

    lastAnalyticsPath = path;
  }


}

function applyConsent(next: ConsentPreferences) {
  const previous = preferences;
  preferences = next;

  const win = window as TrackingWindow;

  if (win.gtag) {
    win.gtag("consent", "update", {
      analytics_storage: next.analytics ? "granted" : "denied",
      ad_storage: next.marketing ? "granted" : "denied",
      ad_user_data: next.marketing ? "granted" : "denied",
      ad_personalization: next.marketing ? "granted" : "denied",
    });
  }

  if (next.analytics && !gaLoaded) {
    setupGA(win);
  }



  if (previous.analytics && !next.analytics) {
    lastAnalyticsPath = "";
  }

  if (previous.marketing && !next.marketing) {
    lastMarketingPath = "";
  }



  trackCurrentPage();
}

export default function ConsentTracking() {
  const pathname = usePathname();

  useEffect(() => {
    applyConsent(
      readConsent() ?? {
        analytics: false,
        marketing: false,
      }
    );

    const handleConsent = (event: Event) => {
      const next =
        (event as CustomEvent<ConsentPreferences>).detail;

      applyConsent(next);
    };

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key !== null &&
        event.key !== "sarathi_cookie_consent_v1"
      ) {
        return;
      }

      const next = readConsent() ?? {
        analytics: false,
        marketing: false,
      };

      // Invalidate any pending Meta permission request.
      metaPermissionRequestId++;
      metaServerPermitted = false;

      const win = window as TrackingWindow;

      if (pixelLoaded && win.fbq) {
        win.fbq("consent", "revoke");
      }

      // Apply withdrawal immediately.
      // A grant from another tab must not automatically
      // authorise Meta tracking in this tab.
      applyConsent({
        analytics: next.analytics,
        marketing: false,
      });
    };

    window.addEventListener(CONSENT_EVENT, handleConsent);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(CONSENT_EVENT, handleConsent);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (pathname !== null && pathname !== lastPath) {
      lastPath = pathname;
      trackCurrentPage();
    }
  }, [pathname]);

  return null;
}
