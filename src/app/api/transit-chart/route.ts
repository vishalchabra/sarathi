import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { getPlanetPositions } from "@/server/astro/swe-remote";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const rawDateISO = String(body?.dateISO ?? "").trim();
    const rawTime = String(body?.time ?? "12:00").trim() || "12:00";
    const rawTimezone = String(body?.timezone ?? "UTC").trim() || "UTC";

    const dt =
      DateTime.fromISO(`${rawDateISO}T${rawTime}`, { zone: rawTimezone })
        .toUTC()
        .toISO({ suppressMilliseconds: true });

    if (!dt) {
      return NextResponse.json(
        { ok: false, error: "Invalid date/time for transit chart" },
        { status: 400 }
      );
    }

    const result = await getPlanetPositions({
      dateISO: dt,
      lat: Number(body?.lat),
      lon: Number(body?.lon),
    });

    return NextResponse.json({
      ok: true,
      planets: result?.planets ?? [],
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