// FILE: src/app/api/life-report/route.ts

import "server-only";
import { NextResponse } from "next/server";
import { buildLifeReport } from "@/server/astro/life-engine";
import { cacheGet, cacheSet, makeCacheKey } from "@/server/cache/simpleCache";
import { buildNotificationFactsFromDailyGuide } from "@/server/notifications/daily-facts";
import { pickNotificationsForMoment } from "@/server/notifications/engine";
import type { NotificationContext } from "@/server/notifications/types";
import type { CoreSignals } from "@/server/guides/types";
import { buildDailyGuideFromCore } from "@/server/guides/daily-core";
import { todayISOForNotificationTz } from "@/server/notifications/today";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

    // Defensive coercion (avoid "string" lat/lon bugs)
    const lat = typeof body.lat === "string" ? Number(body.lat) : body.lat;
    const lon = typeof body.lon === "string" ? Number(body.lon) : body.lon;
    const cacheBuster = Date.now(); // temp
    // Cache key: tie to birth details + engine version
    // IMPORTANT: bump this when astro engine changes so we don't serve stale charts
    const baseKey = makeCacheKey({
  name: body.name ?? "User",
  birthDateISO: body.birthDateISO,
  birthTime: body.birthTime,
  birthTz: body.birthTz,
  lat,
  lon,
  version: "engine-v2b-asc-sidereal-1", // bump on engine changes
  cacheBuster,
});

const cacheKey = `v2:${baseKey}`;


    let report: any;
    let cacheFlag: "hit" | "miss" | "miss-dev" = "miss";

    // ✅ DEV: always rebuild so fixes show immediately
    if (process.env.NODE_ENV !== "production") {
      report = await buildLifeReport({
        name: body.name,
        birthDateISO: body.birthDateISO,
        birthTime: body.birthTime,
        birthTz: body.birthTz,
        lat, // ✅ use coerced values
        lon, // ✅ use coerced values
      });
      cacheFlag = "miss-dev";
    } else {
      // ✅ PROD: use cache
      const cached = await cacheGet<any>(cacheKey);
      if (cached) {
        report = cached;
        cacheFlag = "hit";
      } else {
        report = await buildLifeReport({
          name: body.name,
          birthDateISO: body.birthDateISO,
          birthTime: body.birthTime,
          birthTz: body.birthTz,
          lat, // ✅ use coerced values
          lon, // ✅ use coerced values
        });
        await cacheSet(cacheKey, report, 60 * 60); // 1 hour
        cacheFlag = "miss";
      }
    }

    const enriched = enrichWithActivePeriods(report);

    // Pull asc sign from the correct place (life-engine returns it under core)
    const lagnaSign =
      (enriched as any)?.core?.ascSign ?? (enriched as any)?.ascSign ?? undefined;

    // ---------- Build CoreSignals for Daily Guide ----------
    const core: CoreSignals = {
      birth: {
        dateISO: body.birthDateISO, // ✅ keep birth date as birth date
        time: body.birthTime,
        tz: body.birthTz,
        lat,
        lon,
      },
      lagnaSign, // ✅ put at top-level (more consistent with rest of engine)
      dashaStack: [],
      transits: [],
      moonToday: {
        sign: (enriched as any).moonSign ?? "Unknown",
        // Prefer today's Panchang nakshatra (transit) over natal
        nakshatra:
          (enriched as any).panchang?.moonNakshatraName ??
          (enriched as any).panchangToday?.nakshatraName ??
          (enriched as any).moonNakshatraName ??
          "Unknown",
      },
      panchang: (enriched as any).panchang ?? {},
    };

    const ap = (enriched as any).activePeriods;
    if (ap?.mahadasha) core.dashaStack.push(ap.mahadasha as any);
    if (ap?.antardasha) core.dashaStack.push(ap.antardasha as any);
    if (ap?.pratyantardasha) core.dashaStack.push(ap.pratyantardasha as any);

    // Build Daily Guide (it internally uses "today" + panchang; no need to mutate birth date)
    const dailyGuide = await buildDailyGuideFromCore(core);

    const enrichedWithDaily = {
      ...enriched,
      dailyGuide,
    };

    // ---------- Notifications ----------
    const notificationTz = body.notificationTz || body.birthTz || "Asia/Dubai";
    const todayISO = todayISOForNotificationTz(notificationTz);

    const dailyForNotifications = {
      dateISO: todayISO,
      emotional: dailyGuide?.emotionalWeather ?? null,
      money: dailyGuide?.moneyTip ?? null,
      fasting: dailyGuide?.fasting ?? null,
      food: dailyGuide?.food ?? null,
      panchang: report.panchangToday ?? report.panchang ?? null,
      transits: report.transits ?? [],
    };

    const userId = undefined;

    const notificationFacts = buildNotificationFactsFromDailyGuide(
      dailyForNotifications,
      userId
    );

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
      _debugAsc: {
        ascDeg: report?.core?.ascDeg,
        ascSign: report?.core?.ascSign,
      },
    });
  } catch (e: any) {
    console.error("life-report API error:", e);
    const msg = String(e?.message ?? e);

    if (msg.includes("swisseph unavailable")) {
      return NextResponse.json(
        {
          error: "astro_engine_unavailable",
          message:
            "High-precision chart engine is not available on this server environment yet. Full Life Report will be enabled soon.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "internal_error",
        message: msg || "Unknown error",
      },
      { status: 500 }
    );
  }
}
