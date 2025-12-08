// FILE: src/server/notifications/today.ts

/**
 * Return today's date as YYYY-MM-DD in a given IANA timezone.
 * Falls back to UTC date if anything goes wrong.
 */
export function todayISOForNotificationTz(tz: string): string {
  try {
    const now = new Date();

    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);

    const year = parts.find((p) => p.type === "year")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;

    if (!year || !month || !day) {
      throw new Error("Could not resolve date parts for timezone: " + tz);
    }

    return `${year}-${month}-${day}`; // e.g. "2025-12-05"
  } catch (err) {
    console.error("[notifications] todayISOForNotificationTz fallback", err);
    return new Date().toISOString().slice(0, 10); // fallback: UTC date
  }
}
