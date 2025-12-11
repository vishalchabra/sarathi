// FILE: src/app/api/test-swe/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { getSwe } from "@/server/astro/swe";

export const runtime = "nodejs";

export async function GET() {
  const swe = getSwe();

  // Simple JD for 2024-01-01 00:00 UT
  const jd = swe.swe_julday(2024, 1, 1, 0, swe.SE_GREG_CAL);

  try {
    // Swiss Ephemeris expects [longitude, latitude, altitude]
    const geopos = [55.3, 25.2, 0]; // Dubai-ish: lon, lat, 0m

    const epheflag = swe.SEFLG_SWIEPH;      // normal ephemeris
    const rsmi = swe.SE_CALC_RISE;          // tell it we want rise time

    // Call the "return-object" version (no callback)
    const res = swe.swe_rise_trans(
      jd,
      swe.SE_SUN,   // Sun
      "",           // no star name
      epheflag,
      rsmi,
      geopos,
      0,            // atpress (0 = standard)
      0             // attemp  (0 = standard)
    );

    return NextResponse.json({
      type: "return-object",
      ok: true,
      result: res,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        type: "error",
        ok: false,
        error: String(e),
      },
      { status: 500 }
    );
  }
}
