
import { NextRequest, NextResponse } from "next/server";
import { buildDataEngine } from "@/server/dataEngine/buildDataEngine";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Development only" },
      { status: 403 }
    );
  }

  const date =
    request.nextUrl.searchParams.get("date") ??
    "2026-10-20";

  if (!/^2026-10-(0[1-9]|[12]\d|3[01])$/.test(date)) {
    return NextResponse.json(
      { error: "Select a date in October 2026." },
      { status: 400 }
    );
  }

  const result = await buildDataEngine({
    birth: {
      // Use the same birth input as the comparison route.
      dateISO: "1984-01-21",
      time: "23:35",
      timezone: "Asia/Kolkata",
      lat: 29.968,
      lon: 77.546,
    },
    plan: "pro",
    selectedDateISO: date,
  });

  const prediction = result.prediction.personalizedDaily;
  const daily = prediction.dailyComparison;
  const focus = daily?.dailyAreas[0] ?? null;

  return NextResponse.json({
    date,
    periodTheme: prediction.primaryTheme
  ? {
      area: prediction.primaryTheme.area,
      score: prediction.primaryTheme.priorityScore,
      polarity: prediction.primaryTheme.polarity,
      prediction: prediction.primaryTheme.prediction,
      action: prediction.primaryTheme.action,
      avoid: prediction.primaryTheme.avoid,
    }
  : null,
    todayFocus: focus
      ? {
          area: focus.area,
          importance: focus.strongestImportance,
          dashaScore: focus.dashaScore,
          moonSign: daily?.moonSign,
          moonNakshatra: daily?.moonNakshatra,
          signals: focus.signals,
        }
      : null,
    alignment:
      prediction.primaryTheme?.area === focus?.area
        ? "aligned"
        : "different",
  });
}