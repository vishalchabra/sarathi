// FILE: src/app/api/astro/placements/route.ts
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { computePlacements } from "@/server/astro/placements";
import { getAscendant } from "@/server/astro/asc";
import { getNakshatra } from "@/server/astro/nakshatra";
import { NODE_CALCULATION_VERSION } from "@/server/astro/lunarNodes";

export const runtime = "nodejs";

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

    const requestedNodeMode = body?.nodeMode ?? "mean";

    if (
      requestedNodeMode !== "mean" &&
      requestedNodeMode !== "true"
    ) {
      return NextResponse.json(
        { ok: false, error: "Invalid lunar node convention." },
        { status: 400 }
      );
    }

    const nodeMode: "mean" | "true" = requestedNodeMode;

    const birth = {
      dateISO: dobISO,
      time: tob,
      tz: place.tz,
      lat: Number(place.lat),
      lon: Number(place.lon),
    };

    const local = DateTime.fromISO(
      `${birth.dateISO}T${birth.time}`,
      { zone: birth.tz }
    );

    if (
      !local.isValid ||
      !Number.isFinite(birth.lat) ||
      !Number.isFinite(birth.lon) ||
      Math.abs(birth.lat) > 90 ||
      Math.abs(birth.lon) > 180
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid birth date, time or location.",
          placements: [],
          houses: null,
        },
        { status: 200 }
      );
    }

    const asc = await getAscendant(birth);

    const raw = await computePlacements(birth, nodeMode);

    if (
      !Number.isFinite(asc.lon) ||
      raw.length !== 9 ||
      raw.some(p =>
        !Number.isFinite(p.lon) ||
        typeof p.house !== "number" ||
        !Number.isInteger(p.house) ||
        p.house < 1 ||
        p.house > 12
      )
    ) {
      throw new Error("Incomplete chart calculation.");
    }

    const placements = raw.map(p => {
      const lon = ((p.lon % 360) + 360) % 360;
      const nk = getNakshatra(lon);

      return {
        ...p,
        name: p.planet,
        siderealLongitude: lon,
        degInSign: lon % 30,
        nakshatra: nk.name,
        pada: Math.floor(
          (lon % (360 / 27)) / (360 / 108)
        ) + 1,
      };
    });

    return NextResponse.json({
      ok: true,
      nodeMode,
      nodeCalculationVersion: NODE_CALCULATION_VERSION,
      placements,
      houses: {
        system: "W",
        asc: {
          lon: asc.lon,
          sign: asc.sign,
          degInSign: asc.lon % 30,
        },
      },
      panchang: null,
      dasha: null,
      warnings:
        body?.hsys && body.hsys !== "W"
          ? ["This endpoint currently supports whole-sign houses only."]
          : [],
    });
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
