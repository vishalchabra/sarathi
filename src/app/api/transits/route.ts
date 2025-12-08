// FILE: src/app/api/transits/route.ts
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
  // optional house info (future)
  house?: number;
  houseArea?: string;
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

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const birth: TransitRequestBirth | undefined = body?.birth;
    const horizonDays = Number(body?.horizonDays ?? 365);

    if (!birth) {
      return NextResponse.json({ transits: [], dailyMoon: [] });
    }

    let transits: TransitHit[] = [];
    let dailyMoon: DailyMoonRow[] = [];

    // 1) Real/skeleton transit engine (same as before)
    try {
      const mod = await import("@/server/astro/transits").catch(() => null);
      if (mod && typeof mod.computeTransitWindows === "function") {
        transits = await mod.computeTransitWindows(birth, horizonDays);
      }
    } catch (e) {
      console.warn("[transits] backend transit engine failed", e);
    }

    if (!Array.isArray(transits)) transits = [];

    // 2) NEW: Daily Moon nakshatras (next 14 days)
    try {
      const sweDaily = await import("@/server/astro/sweDailyMoon").catch(
        () => null
      );
      if (
        sweDaily &&
        typeof sweDaily.computeDailyMoonNakshatras === "function"
      ) {
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

    return NextResponse.json({ transits, dailyMoon });
  } catch (e) {
    console.error("[transits] error", e);
    return NextResponse.json(
      { error: "Failed to compute transits" },
      { status: 500 }
    );
  }
}
