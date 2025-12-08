// FILE: src/lib/notifications/timezone.ts
export type NotificationTzSettings = {
  tz: string;
  lastUpdatedISO: string; // when we last set/changed it
};

const STORAGE_KEY = "sarathi_notification_tz_v1";

export function detectBrowserTz(): string | null {
  if (typeof Intl === "undefined") return null;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return typeof tz === "string" && tz ? tz : null;
  } catch {
    return null;
  }
}

export function loadNotificationTz():
  | NotificationTzSettings
  | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.tz !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveNotificationTz(
  tz: string
): NotificationTzSettings {
  const settings: NotificationTzSettings = {
    tz,
    lastUpdatedISO: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(settings)
      );
    } catch {
      // ignore
    }
  }
  return settings;
}

/**
 * Ensure we have a notification timezone:
 * 1) Use stored value if present.
 * 2) Else detect from browser and store.
 * 3) Else fall back to provided default.
 */
export function ensureNotificationTz(
  fallback: string = "Asia/Dubai"
): NotificationTzSettings {
  if (typeof window === "undefined") {
    return { tz: fallback, lastUpdatedISO: new Date().toISOString() };
  }

  const stored = loadNotificationTz();
  if (stored?.tz) return stored;

  const detected = detectBrowserTz();
  if (detected) return saveNotificationTz(detected);

  return saveNotificationTz(fallback);
}
