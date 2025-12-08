export const runtime = "nodejs";

import "server-only";
import { NextResponse } from "next/server";

/**
 * Simple proxy to Open-Meteo Geocoding (no API key).
 * Usage: /api/geo/search?q=kolkata
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    if (!q) return NextResponse.json({ results: [] });

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      q
    )}&count=8&language=en&format=json`;

    const r = await fetch(url, { next: { revalidate: 60 } });
    if (!r.ok) throw new Error(`geocoding ${r.status}`);
    const json = await r.json();

    const results =
      (json?.results || []).map((x: any) => {
        const name = x.name as string;
        const admin1 = x.admin1 as string | undefined;
        const country = x.country || x.country_code;
        const lat = x.latitude as number;
        const lon = x.longitude as number;
        const tz = x.timezone as string | undefined;
        const label = [name, admin1, country].filter(Boolean).join(", ");
        return { id: `${lat},${lon}`, name, admin1, country, lat, lon, tz, label };
      }) ?? [];

    return NextResponse.json({ results });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e), results: [] }, { status: 500 });
  }
}
