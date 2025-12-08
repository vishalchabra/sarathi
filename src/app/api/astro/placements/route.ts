// FILE: src/app/api/astro/placements/route.ts
import { NextResponse } from "next/server";

/**
 * Very defensive handler:
 * - If DOB/TOB/place missing ⇒ return 200 with a friendly error message.
 * - Never throw 400 for “missing birth details”.
 * - This keeps the UI quiet unless the user explicitly computes with all fields.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const dobISO = body?.dobISO?.trim?.();
    const tob    = body?.tob?.trim?.();
    const place  = body?.place ?? null;

    const hasBirth = !!(dobISO && tob);
    const hasPlace =
      !!place && place.lat != null && place.lon != null && ("" + place.tz).length > 0;

    if (!hasBirth || !hasPlace) {
      // NOTE: 200 with error text (so no hard red line from a 400)
      return NextResponse.json(
        {
          ok: false,
          error:
            "Please enter DOB, TOB and pick a city (with coordinates) before computing placements.",
          placements: [],
          houses: null,
          panchang: null,
          dasha: null,
          warnings: [],
        },
        { status: 200 }
      );
    }

    // TODO: call your real ephemeris logic here.
    // For now, return a minimal happy payload so UI renders.
    const demo = {
      ok: true,
      placements: [],
      houses: { system: body?.hsys ?? "W", asc: { sign: "Virgo", degInSign: 12.34 } },
      panchang: { weekday: "—" },
      dasha: null,
      warnings: [],
    };

    return NextResponse.json(demo);
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "Placements failed to compute." },
      { status: 200 } // keep it soft
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, hint: "POST dobISO, tob, place{tz,lat,lon}" });
}
