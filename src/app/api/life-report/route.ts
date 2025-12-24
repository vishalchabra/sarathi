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
import { openai, GPT_MODEL } from "@/lib/ai";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

/* -------------------------------------------------------
   Enrich with MD / AD / PD
------------------------------------------------------- */
function fixWeirdEncoding(s: string) {
  return String(s)
    .replace(/\u00a0/g, " ")
    .replace(/â€™/g, "’")
    .replace(/â€œ|â€/g, '"')
    .replace(/â€”/g, "—")
    .replace(/â€“/g, "–")
    .replace(/â€˜/g, "‘")
    .replace(/â€¢/g, "•")
    .replace(/â€¦/g, "…")
    .replace(/âˆ’/g, "-")
    .replace(/â€\s?/g, "");
}

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
async function buildLifeGuidanceSummary(enriched: any) {
  try {
    const asc = enriched?.core?.ascSign ?? enriched?.ascSign ?? "Unknown";
    const moon = enriched?.moonSign ?? enriched?.core?.moonSign ?? "Unknown";
    const sun = enriched?.sunSign ?? enriched?.core?.sunSign ?? "Unknown";

    const md = enriched?.activePeriods?.mahadasha?.lord ?? "Unknown";
    const ad =
      enriched?.activePeriods?.antardasha?.subLord ??
      enriched?.activePeriods?.antardasha?.lord ??
      "Unknown";

    const today = enriched?.panchangToday ?? enriched?.panchang ?? {};
    const daily = enriched?.dailyGuide ?? {};

const prompt = `
You are Sārathi — the charioteer guiding how a person should LIVE during this phase of life.

You are not predicting events.
You are identifying patterns, risks, and the right way to respond.

Write a LIFE GUIDANCE BRIEF that feels unmistakably personal.

Return STRICT JSON ONLY in this exact structure (no extra keys, no markdown):

{
  "headline": "6–10 words, specific to THIS phase (not generic)",
  "posture": "2–3 sentences: the inner posture + the core lesson of the current MD/AD",
  "deepInsight": "2–3 sentences: a specific blind-spot/pattern + the cost + the correction",
  "evidence": "1 short line quoting the most specific astro signals used (MD/AD + 1–2 chart facts)",

  "nonNegotiables": [
    "5 bullets. Each must be measurable and realistic for the next 14 days. Not generic motivation."
  ],

  "now": [
    "3 bullets for next 7 days: actions + what to avoid. Must reflect current timing (MD/AD)."
  ],

  "next30": [
    "3 bullets for next 30–60 days: focus areas + how to win. Must be coherent with the same timing."
  ],

  "do": [
    "3 bullets: what to lean into (practical, specific)."
  ],

  "dont": [
    "3 bullets: what to avoid (behavioral and practical)."
  ],

  "remedies": {
    "daily": [
      "3 bullets: simple daily remedies (mantra/charity/discipline/breathwork) with <=10 min each"
    ],
    "shortTerm": [
      "3 bullets: for 7–14 days (fasting/light food, routine change, declutter, digital discipline etc.)"
    ],
    "longTerm": [
      "3 bullets: for 40–90 days (habit/system changes)."
    ],
    "optional": [
      "2 bullets: OPTIONAL colour / fasting day / donation type. Must not be risky."
    ]
  },

  "closing": "1 calm line that feels personal, not generic"
}

Hard rules:
- Use ONLY the facts you are given. Do not invent birth facts or events.
- Make it precise enough that it feels written for one person.
- No fear language, no fatalism. Actionable guidance only.
- If you cannot support a claim from facts, keep it general and say 'may' or 'likely'.

USER CONTEXT (DO NOT REPEAT VERBATIM):
- Core nature: Asc ${asc}, Moon ${moon}, Sun ${sun}
- Current life phase: ${md}/${ad}
- Major life themes: ${JSON.stringify(
  (enriched?.dashaTimeline ??
    enriched?.lifeMilestones ??
    []).slice(0, 6)
)}
- Current emotional & practical signals: ${JSON.stringify({
  emotional: daily?.emotionalWeather?.summary ?? null,
  money: daily?.moneyTip?.summary ?? null,
  food: daily?.food?.headline ?? null,
})}

Remember:
You are speaking to one person, not an audience.
Make it precise enough that it could only apply to them.
`;


    const completion = await openai.chat.completions.create({
  model: GPT_MODEL,
  messages: [
    { role: "system", content: "You output only valid JSON." },
    { role: "user", content: prompt },
  ],
  temperature: 0.5,
});

const raw = fixWeirdEncoding(completion.choices?.[0]?.message?.content ?? "");
return raw;

  } catch {
    return "";
  }
}

/* -------------------------------------------------------
   Route
------------------------------------------------------- */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Defensive coercion (avoid "string" lat/lon bugs)
    // Accept BOTH schemas:
// - old: { lat, lon, name }
// - new: { birthLat, birthLon, placeName }
const rawLat = body.birthLat ?? body.lat;
const rawLon = body.birthLon ?? body.lon;

const lat = typeof rawLat === "string" ? Number(rawLat) : Number(rawLat);
const lon = typeof rawLon === "string" ? Number(rawLon) : Number(rawLon);

if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
  throw new Error("Invalid latitude/longitude. Please pick a place from dropdown.");
}

    const cacheBuster = 0;
    // Cache key: tie to birth details + engine version
    // IMPORTANT: bump this when astro engine changes so we don't serve stale charts
   const baseKey = makeCacheKey({
  name: body.name ?? body.placeName ?? "User",
  birthDateISO: body.birthDateISO,
  birthTime: body.birthTime,
  birthTz: body.birthTz,
  lat,
  lon,
  version: "engine-v2b-asc-sidereal-1",
  cacheBuster,
});

const cacheKey = `v2:${baseKey}`;



    let report: any;
    let cacheFlag: "hit" | "miss" | "miss-dev" = "miss";

    // ✅ DEV: always rebuild so fixes show immediately
    if (process.env.NODE_ENV !== "production") {
      report = await buildLifeReport({
        name: body.name ?? body.placeName,
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
          name: body.name ?? body.placeName,
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
const aiSummary = await buildLifeGuidanceSummary(enrichedWithDaily);
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
      aiSummary,
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
