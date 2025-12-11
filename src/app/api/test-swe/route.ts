// FILE: src/app/api/test-swe/route.ts
export const runtime = "nodejs";

import "server-only";
import { NextResponse } from "next/server";
import { getSwe } from "@/server/astro/swe";

export async function GET() {
  try {
    const swe = await getSwe();

    // Simple JD for 2024-01-01 00:00 UT
    const jd = swe.swe_julday(2024, 1, 1, 0, swe.SE_GREG_CAL);

    const flags =
      (swe.SEFLG_SWIEPH ?? 2) |
      (swe.SEFLG_SIDEREAL ?? 64) |
      (swe.SEFLG_SPEED ?? 256);

    // Example: Moon position
    const res = await swe.swe_calc_ut(jd, swe.SE_MOON, flags);

    return NextResponse.json({
      ok: true,
      jd,
      raw: res,
    });
  } catch (err: any) {
    console.error("[test-swe] error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: String(err?.message ?? err),
      },
      { status: 500 }
    );
  }
}
