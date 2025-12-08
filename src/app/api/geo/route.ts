export const runtime = "nodejs";

import "server-only";
import { NextResponse } from "next/server";
import tzlookup from "tz-lookup";

/**
 * GET /api/geo?q=delhi            → forward geocode (top 5)
 * GET /api/geo?lat=28.6&lon=77.2  → reverse geocode (single)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    // Reverse geocode (lat/lon → place)
    if (lat && lon) {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(
        lat
      )}&lon=${encodeURIComponent(lon)}&zoom=10&addressdetails=1`;
      const r = await fetch(url, {
        headers: { "User-Agent": "Sarathi/1.0 (contact: support@sarathi.app)" },
        cache: "no-store",
      });
      if (!r.ok) return NextResponse.json({ error: "Reverse geocode failed" }, { status: 502 });
      const j: any = await r.json();
      const latNum = Number(j?.lat);
      const lonNum = Number(j?.lon);
      const tz = tzlookup(latNum, lonNum);
      return NextResponse.json({
        result: {
          name:
            j?.address?.city ||
            j?.address?.town ||
            j?.address?.village ||
            j?.address?.state ||
            j?.display_name ||
            "Unknown place",
          displayName: j?.display_name,
          lat: latNum,
          lon: lonNum,
          tz,
        },
      });
    }

    // Forward geocode (query → suggestions)
    if (!q || q.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
      q
    )}`;
    const r = await fetch(url, {
      headers: { "User-Agent": "Sarathi/1.0 (contact: support@sarathi.app)" },
      cache: "no-store",
    });
    if (!r.ok) return NextResponse.json({ error: "Geocode failed" }, { status: 502 });
    const arr: any[] = await r.json();

    const results = arr.map((it) => {
      const latNum = Number(it.lat);
      const lonNum = Number(it.lon);
      let tz = "UTC";
      try { tz = tzlookup(latNum, lonNum); } catch {}
      return {
        name: it.display_name?.split(",")[0] || it.display_name,
        displayName: it.display_name,
        lat: latNum,
        lon: lonNum,
        tz,
      };
    });

    return NextResponse.json({ results });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Geo error" }, { status: 500 });
  }
}
