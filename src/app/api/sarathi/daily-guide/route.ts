// FILE: src/app/api/sarathi/daily-guide/route.ts
import { NextRequest } from "next/server";
import type { CoreSignals } from "@/server/guides/types";
import { cacheGet, cacheSet, makeCacheKey } from "@/server/cache/simpleCache";
import { buildDailyGuideFromCore, resolveDailyGuideDate } from "@/server/guides/daily-core";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));

    let core = body.core as CoreSignals | undefined;

    // If client didn't send a proper core, build a very safe fallback
    if (!core || typeof core !== "object") {
      core = {
        birth: {
          dateISO: new Date().toISOString().slice(0, 10),
          time: "00:00",
          tz: "Asia/Dubai",
          lat: 0,
          lon: 0,
          lagnaSign: undefined,
        },
        dashaStack: [],
        transits: [],
        moonToday: {
          sign: "Unknown",
          nakshatra: "Unknown",
        },
        panchang: {},
      };
    }

    // Ensure birth & moonToday exist even if partially missing
    if (!core.birth) {
      core.birth = {
        dateISO: new Date().toISOString().slice(0, 10),
        time: "00:00",
        tz: "Asia/Dubai",
        lat: 0,
        lon: 0,
        lagnaSign: undefined,
      };
    }

    if (!core.moonToday) {
      core.moonToday = {
        sign: "Unknown",
        nakshatra: "Unknown",
      };
    }

    // Resolve the forecast date once for caching and interpretation.
    core = {
      ...core,
      forecastDateISO:
        body.forecastDateISO ?? core.forecastDateISO,
      forecastTimezone:
        body.forecastTimezone ?? core.forecastTimezone,
    };

    const forecastDateISO = resolveDailyGuideDate(core);

    core.forecastDateISO = forecastDateISO;

    // Include all interpretation inputs in the cache identity.
    const cacheKey = makeCacheKey({
      feature: "daily-guide",
      version: "v2",
      dayISO: forecastDateISO,
      core,
    });

    // 2) Try cache first
    const cached = cacheGet<any>(cacheKey);
    if (cached) {
      return new Response(
        JSON.stringify({
          ...cached,
          _cache: "hit",
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        }
      );
    }

    // 3) Compute the guide using shared helper
    const result = await buildDailyGuideFromCore(core);

    // 4) Save to cache for 1 day
    cacheSet(cacheKey, result, 24 * 60 * 60 * 1000);

    return new Response(
      JSON.stringify({
        ...result,
        _cache: "miss",
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  } catch (e: any) {
    console.error("daily-guide API error:", e);
    return new Response(
      JSON.stringify({
        error: e?.message ?? "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }
}
