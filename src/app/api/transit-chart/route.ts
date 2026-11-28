import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { computeTransitPlanetsNow } from "@/server/astro/transits";
import { NODE_CALCULATION_VERSION } from "@/server/astro/lunarNodes";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const requestedNodeMode = body?.nodeMode;

    if (
      requestedNodeMode !== undefined &&
      requestedNodeMode !== null &&
      requestedNodeMode !== "mean" &&
      requestedNodeMode !== "true"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid lunar node convention.",
        },
        { status: 400 }
      );
    }

    const nodeMode: "mean" | "true" =
      requestedNodeMode ?? "mean";

    const rawDateISO = String(body?.dateISO ?? "").trim();
    const rawTime = String(body?.time ?? "12:00").trim() || "12:00";
    const rawTimezone = String(body?.timezone ?? "UTC").trim() || "UTC";

    const dt =
      DateTime.fromISO(`${rawDateISO}T${rawTime}`, { zone: rawTimezone })
        .toUTC()
        .toISO({ suppressMilliseconds: true });

    if (!dt || !rawDateISO) {
      return NextResponse.json(
        { ok: false, error: "Invalid date/time for transit chart" },
        { status: 400 }
      );
    }

    const planets = await computeTransitPlanetsNow(
      {
        dateISO: rawDateISO,
        time: rawTime,
        tz: rawTimezone,
        nodeMode,
        lat: Number(body?.lat),
        lon: Number(body?.lon),
      },
      undefined,
      {
        dateISO: rawDateISO,
        time: rawTime,
        tz: rawTimezone,
      }
    );

    return NextResponse.json({
      ok: true,
      planets,
      nodeMode,
      nodeCalculationVersion: NODE_CALCULATION_VERSION,
      resolvedDateTimeUTC: dt,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: err?.message || "Transit chart failed",
      },
      { status: 500 }
    );
  }
}