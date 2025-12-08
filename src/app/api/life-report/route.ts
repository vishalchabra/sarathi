// FILE: src/app/api/life-report/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { buildLifeReport } from "@/server/astro/life-engine";
import { cacheGet, cacheSet, makeCacheKey } from "@/server/cache/simpleCache";
import { buildNotificationFactsFromDailyGuide } from "@/server/notifications/daily-facts";
import { pickNotificationsForMoment } from "@/server/notifications/engine";
import type { NotificationContext } from "@/server/notifications/types";
import type { CoreSignals } from "@/server/guides/types";
import { buildDailyGuideFromCore } from "@/app/api/sarathi/daily-guide/route";
import { todayISOForNotificationTz } from "@/server/notifications/today";
/* -------------------------------------------------------
   Enrich with MD / AD / PD
------------------------------------------------------- */

function enrichWithActivePeriods(report: any) {
  if (!report) return report;

  const existing = report.activePeriods ?? null;

  const timeline =
    report.dashaTimeline ??
    report.timelineWindows ??
    report.timeline ??
    [];

  const main =
    Array.isArray(timeline) && timeline.length > 0 ? timeline[0] : null;

  if (!main) {
    return {
      ...report,
      activePeriods: existing ?? null,
    };
  }

  const md = main.md ?? (main as any).mahadasha ?? null;
  const ad = main.ad ?? (main as any).antardasha ?? null;
  const pd = main.pd ?? (main as any).pratyantardasha ?? null;

  const mdLord =
    (md && ((md as any).planet ?? (md as any).lord ?? (md as any).name)) || "";
  const adLord =
    (ad && ((ad as any).planet ?? (ad as any).lord ?? (ad as any).name)) || "";
  const pdLord =
    (pd && ((pd as any).planet ?? (pd as any).lord ?? (pd as any).name)) || "";

  const activePeriods = {
    mahadasha:
      mdLord && md
        ? {
            lord: mdLord,
            start: (md as any).startISO ?? (md as any).start ?? "",
            end: (md as any).endISO ?? (md as any).end ?? "",
            summary: (existing as any)?.mahadasha?.summary ?? "",
          }
        : existing?.mahadasha ?? null,
    antardasha:
      adLord && ad
        ? {
            mahaLord: mdLord,
            subLord: adLord,
            start: (ad as any).startISO ?? (ad as any).start ?? "",
            end: (ad as any).endISO ?? (ad as any).end ?? "",
          }
        : existing?.antardasha ?? null,
    pratyantardasha:
      pdLord && pd
        ? {
            mahaLord: mdLord,
            antarLord: adLord,
            lord: pdLord,
            start: (pd as any).startISO ?? (pd as any).start ?? "",
            end: (pd as any).endISO ?? (pd as any).end ?? "",
          }
        : existing?.pratyantardasha ?? null,
  };

  return {
    ...report,
    activePeriods,
  };
}

/* -------------------------------------------------------
   Route
------------------------------------------------------- */

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Stable cache key: tie to birth details only
    const cacheKey = makeCacheKey({
      feature: "life-report",
      birthDateISO: body.birthDateISO,
      birthTime: body.birthTime,
      birthTz: body.birthTz,
      version: "v3-mdadpd+daily-v1",
    });

    let report: any;
    let cacheFlag: "hit" | "miss" = "miss";

    // Try cache first
    const cached = await cacheGet<any>(cacheKey);
    if (cached) {
      report = cached;
      cacheFlag = "hit";
    } else {
      // Build fresh report
      report = await buildLifeReport({
        name: body.name,
        birthDateISO: body.birthDateISO,
        birthTime: body.birthTime,
        birthTz: body.birthTz,
        lat: body.lat,
        lon: body.lon,
      });

      // Store in cache (30 days)
      await cacheSet(cacheKey, report, 60 * 60 * 24 * 30);
    }

    // Enrich with MD / AD / PD
    const enriched = enrichWithActivePeriods(report);

    // ---------- Build CoreSignals for Daily Guide ----------
    const core: CoreSignals = {
      birth: {
        dateISO: body.birthDateISO,
        time: body.birthTime,
        tz: body.birthTz,
        lat: body.lat,
        lon: body.lon,
        lagnaSign: (enriched as any).ascSign ?? undefined,
      },
      dashaStack: [],
      transits: [], // real transits can be wired later
     moonToday: {
        sign: (enriched as any).moonSign ?? "Unknown",
        // Prefer today's Panchang nakshatra (transit) over natal
        nakshatra:
          (enriched as any).panchang?.moonNakshatraName ??
          (enriched as any).moonNakshatraName ??
          "Unknown",
      },
      panchang: (enriched as any).panchang ?? {},
    };

    const ap = (enriched as any).activePeriods;
    if (ap?.mahadasha) core.dashaStack.push(ap.mahadasha as any);
    if (ap?.antardasha) core.dashaStack.push(ap.antardasha as any);
    if (ap?.pratyantardasha) core.dashaStack.push(ap.pratyantardasha as any);

    // Use TODAY as the “guide day”
    const guideDayISO = new Date().toISOString().slice(0, 10);
    core.birth.dateISO = guideDayISO;

    const dailyGuide = await buildDailyGuideFromCore(core);

    const enrichedWithDaily = {
      ...enriched,
      dailyGuide,
    };

        // ---------- Build daily-for-notifications view ----------
        // ---------- Build daily-for-notifications view ----------
    const notificationTz =
      body.notificationTz || body.birthTz || "Asia/Dubai";

    // ✅ Proper "today" for the user's notification timezone
    const todayISO = todayISOForNotificationTz(notificationTz);

   // Build compact facts bundle for notifications
const dailyForNotifications = {
  dateISO: todayISO, // or whatever variable you use for "today"
  emotional: dailyGuide?.emotionalWeather ?? null,
  money: dailyGuide?.moneyTip ?? null,
  fasting: dailyGuide?.fasting ?? null,
  food: dailyGuide?.food ?? null,           // 🆕 send food guidance
  panchang: report.panchangToday ?? report.panchang ?? null,
  transits: report.transits ?? [],
};



    const userId = undefined; // later: real user id from auth/session

    const notificationFacts = buildNotificationFactsFromDailyGuide(
      dailyForNotifications,
      userId
    );

    // Build previews for all 3 times of day
    const morningCtx: NotificationContext = {
      timeOfDay: "morning",
      facts: notificationFacts,
    };
    const middayCtx: NotificationContext = {
      timeOfDay: "midday",
      facts: notificationFacts,
    };
    const eveningCtx: NotificationContext = {
      timeOfDay: "evening",
      facts: notificationFacts,
    };

    const previewNotifications = {
      morning: pickNotificationsForMoment(morningCtx, { maxPerBatch: 3 }),
      midday: pickNotificationsForMoment(middayCtx, { maxPerBatch: 2 }),
      evening: pickNotificationsForMoment(eveningCtx, { maxPerBatch: 2 }),
    };

    return NextResponse.json({
      ...enrichedWithDaily,
      notificationFacts,
      previewNotifications,
      _cache: cacheFlag,
    });

  } catch (e: any) {
    console.error("life-report API error:", e);
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
