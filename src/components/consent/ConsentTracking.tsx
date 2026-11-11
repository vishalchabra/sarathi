"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  CONSENT_EVENT,
  readConsent,
  type ConsentPreferences,
} from "./CookieConsent";

const GA_ID = "G-WKFJ595D05";
const PIXEL_ID = "1143945841442638";

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

  fbq("init", PIXEL_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src =
    "https://connect.facebook.net/en_US/fbevents.js";

  document.head.appendChild(script);
  pixelLoaded = true;
}

function trackCurrentPage() {
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

  if (
    preferences.marketing &&
    win.fbq &&
    lastMarketingPath !== path
  ) {
    win.fbq("track", "PageView");
    lastMarketingPath = path;
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

  if (next.marketing && !pixelLoaded) {
    setupPixel(win);
  }

  if (previous.analytics && !next.analytics) {
    lastAnalyticsPath = "";
  }

  if (previous.marketing && !next.marketing) {
    lastMarketingPath = "";
  }

  if (pixelLoaded && win.fbq) {
    if (next.marketing) {
      win.fbq("consent", "grant");
    } else {
      win.fbq("consent", "revoke");
    }
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

    window.addEventListener(CONSENT_EVENT, handleConsent);

    return () => {
      window.removeEventListener(CONSENT_EVENT, handleConsent);
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
