// RUNTIME
export const runtime = "nodejs";
import "server-only";
import { NextResponse } from "next/server";

// --- import your Swiss-Eph helpers ---
import * as SWE from "@/server/astro/swe";
import * as Placements from "@/server/astro/placements";
import * as Panchang from "@/server/astro/panchang";

type Body = {
  dob: string;             // "21-01-1984" or "1984-01-21"
  time?: string;           // "23:35"
  tz?: string;             // "Asia/Kolkata"
  lat: number;             // 29.968
  lon: number;             // 77.545
  name?: string;
};

function ensureISO(dateStr: string) {
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec((dateStr || "").trim());
  return m ? `${m[3]}-${m[2]}-${m[1]}` : dateStr;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    if (!body?.dob || body.lat == null || body.lon == null) {
      return NextResponse.json({ error: "Missing dob/lat/lon" }, { status: 400 });
    }

    const iso = ensureISO(body.dob); // fixes "21-01-1984"
    const time = body.time || "00:00";
    const tz = body.tz || "UTC";
    const dtLocal = `${iso}T${time}:00`;

    // Swiss-Eph expects Julian Day etc. Use your swe helper to prepare context.
    const ctx = await SWE.makeContext({
      datetimeLocal: dtLocal, // local wall time
      timezone: tz,
      lat: body.lat,
      lon: body.lon,
    });

    const planets = await Placements.getPlacements(ctx);     // [{name, sign, degree, speed, house}]
    const panchang = await Panchang.getPanchang(ctx);        // {weekday,tithiName,yoga,moonNakshatraName,...}

    // (If you have aspects/house calcs, add them here)
    const houses = ctx?.houses ?? []; // many swe helpers put houses on ctx

    return NextResponse.json({
      profile: { name: body.name, dob: iso, time, tz, lat: body.lat, lon: body.lon },
      planets,
      houses,
      panchang,
      aspects: [],              // fill in when you wire aspects
      summary: {},
    });
  } catch (err: any) {
    console.error("astro-report error:", err);
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
