import "server-only";

import { NextRequest, NextResponse } from "next/server";
import tzlookup from "tz-lookup";

export const runtime = "nodejs";

type City = {
  name: string;
  lat: number;
  lon: number;
  timezone: string;
};

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
  addresstype?: string;
  address?: Record<string, string | undefined>;
};

const cache = new Map<string, { expires: number; cities: City[] }>();

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") ?? "").trim();

  if (query.length < 2 || query.length > 100) {
    return NextResponse.json(
      { ok: false, error: "Enter a city name between 2 and 100 characters." },
      { status: 400 }
    );
  }

  const key = query.toLocaleLowerCase("en");
  const cached = cache.get(key);

  if (cached && cached.expires > Date.now()) {
    return NextResponse.json({ ok: true, cities: cached.cities });
  }

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "10");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("accept-language", "en");
    url.searchParams.set("q", query);

    const response = await fetch(url, {
      headers: {
        "Accept-Language": "en",
        "User-Agent": "AskSarathi/1.0 (sarathiyourguide.com)",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error("Location provider unavailable");
    }

    const results = (await response.json()) as NominatimResult[];
    const seen = new Set<string>();
    const cities: City[] = [];

    const rankedResults = [...results].sort((a, b) => { const rank = (r: NominatimResult) => r.addresstype === "city" || r.type === "city" ? 0 : r.addresstype === "town" || r.type === "town" ? 1 : r.addresstype === "village" || r.type === "village" ? 2 : 3; return rank(a) - rank(b); });

    for (const result of rankedResults) {
      if (["administrative", "state"].includes(result.addresstype ?? "") || (!result.addresstype && ["administrative", "state"].includes(result.type ?? ""))) continue;
      const address = result.address ?? {};

      const city =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.hamlet ||
        address.county ||
        address.region;

      const state =
        address.state ||
        address.state_district ||
        address.province ||
        address.region ||
        "";

      const country = address.country || "";

      const name =
        [city, state, country]
          .filter(Boolean)
          .filter((value, index, values) => values.indexOf(value) === index)
          .join(", ") || result.display_name;

      const lat = Number(result.lat);
      const lon = Number(result.lon);

      if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
      if (lat < -90 || lat > 90 || lon < -180 || lon > 180) continue;

      const normalized = name.toLocaleLowerCase("en");

      if (seen.has(normalized)) continue;

      let timezone: string;

      try {
        timezone = tzlookup(lat, lon);
      } catch {
        continue;
      }

      seen.add(normalized);
      cities.push({ name, lat, lon, timezone });
    }

    cache.set(key, {
      expires: Date.now() + 24 * 60 * 60 * 1000,
      cities,
    });

    return NextResponse.json({ ok: true, cities });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to search cities right now." },
      { status: 502 }
    );
  }
}
