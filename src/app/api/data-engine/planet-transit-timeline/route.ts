import { NextResponse } from "next/server";
import { buildPlanetTransitTimeline } from "@/server/astro/transits";

const ALLOWED = new Set([
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
]);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const planet = String(body?.planet ?? "");
    const fromDateISO = String(body?.fromDateISO ?? "");
    const toDateISO = String(body?.toDateISO ?? "");

    if (!ALLOWED.has(planet)) {
      return NextResponse.json(
        { ok: false, error: "Invalid planet selected." },
        { status: 400 }
      );
    }

    if (!fromDateISO || !toDateISO) {
      return NextResponse.json(
        { ok: false, error: "Please select date range." },
        { status: 400 }
      );
    }

    const intervals = await buildPlanetTransitTimeline({
      planet,
      fromDateISO,
      toDateISO,
      timezone: body?.timezone ?? "Asia/Kolkata",
    });

    return NextResponse.json({
      ok: true,
      planet,
      fromDateISO,
      toDateISO,
      intervals,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        error: e?.message || "Failed to generate timeline.",
      },
      { status: 500 }
    );
  }
}