import { NextResponse } from "next/server";

export type TransitHit = {
  id: string;
  startISO: string;
  endISO: string;
  planet: string;
  target: string;
  category: "career" | "relationships" | "health" | "inner" | "general";
  strength: number; // 0–1
  title: string;
  description: string;

  // optional extra computed fields from engine (safe if present)
  transitLon?: number;
  transitSign?: string;
  transitHouse?: number;
  natalLon?: number;
};

export type TransitRequestBirth = {
  dateISO: string;
  time: string;
  tz: string;
  lat: number;
  lon: number;
};

export type DailyMoonRow = {
  dateISO: string;
  moonNakshatra: string | null;
  houseFromMoon?: number | null;
};

export type TransitNowPlanet = {
  name: string;
  lon: number;
  sign: string;
  house?: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));

    const birth: TransitRequestBirth | undefined = body?.birth;
    const horizonDays = Number(body?.horizonDays ?? 365);

    // Optional (for house computation in windows + transitNow)
    const ascDeg =
      body?.ascDeg != null && Number.isFinite(Number(body.ascDeg))
        ? Number(body.ascDeg)
        : undefined;

    const ascSign =
      typeof body?.ascSign === "string" && body.ascSign.trim()
        ? body.ascSign.trim()
        : undefined;

    if (!birth) {
      return NextResponse.json({
        transits: [],
        topTransits: [],
        transitNow: [],
        dailyMoon: [],
      });
    }

    let transits: TransitHit[] = [];
    let dailyMoon: DailyMoonRow[] = [];
    let transitNow: TransitNowPlanet[] = [];

    // 1) Transit windows (FULL LIST)
    try {
      const mod = await import("@/server/astro/transits").catch(() => null as any);

      if (mod && typeof mod.computeTransitWindows === "function") {
        transits = await mod.computeTransitWindows(birth, horizonDays, {
          ascDeg,
          ascSign,
        });
      }
    } catch (e) {
      console.warn("[transits] computeTransitWindows failed", e);
      transits = [];
    }

    if (!Array.isArray(transits)) transits = [];

    // 2) Today transit planets snapshot (for "Now" UI)
    try {
      const mod = await import("@/server/astro/transits").catch(() => null as any);

      if (mod && typeof mod.computeTransitPlanetsNow === "function") {
        transitNow = await mod.computeTransitPlanetsNow(birth, ascSign);
      }
    } catch (e) {
      console.warn("[transits] computeTransitPlanetsNow failed", e);
      transitNow = [];
    }

    if (!Array.isArray(transitNow)) transitNow = [];

    // 3) Daily Moon nakshatras (next 14 days)
    try {
      const sweDaily = await import("@/server/astro/sweDailyMoon").catch(() => null as any);

      if (sweDaily && typeof sweDaily.computeDailyMoonNakshatras === "function") {
        dailyMoon = await sweDaily.computeDailyMoonNakshatras(
          {
            dateISO: birth.dateISO,
            time: birth.time,
            tz: birth.tz,
            lat: birth.lat,
            lon: birth.lon,
          },
          14
        );
      }
    } catch (e) {
      console.warn("[transits] daily moon engine failed", e);
      dailyMoon = [];
    }

    if (!Array.isArray(dailyMoon)) dailyMoon = [];

    // 4) Convenience: topTransits (sorted/trimmed)
    const topTransits = transits
      .slice()
      .sort((a: any, b: any) => Number(b?.strength ?? 0) - Number(a?.strength ?? 0))
      .slice(0, 12);

    return NextResponse.json({
      transits,     // full list (backwards compatible)
      topTransits,  // pre-trimmed list
      transitNow,   // today snapshot
      dailyMoon,
      _debug: {
        ascDeg: ascDeg ?? null,
        ascSign: ascSign ?? null,
        transitsCount: transits.length,
        transitNowCount: transitNow.length,
      },
    });
  } catch (e) {
    console.error("[transits] error", e);
    return NextResponse.json(
      { error: "Failed to compute transits" },
      { status: 500 }
    );
  }
}
