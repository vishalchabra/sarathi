import { NextResponse } from "next/server";
import { getSwe } from "@/server/astro/swe";

export async function GET() {
  const swe = getSwe();

  const jd = swe.swe_julday(2024, 1, 1, 0, swe.SE_GREG_CAL);

  try {
    // Try callback version
    swe.swe_rise_trans(
      jd,
      swe.SE_SUN,
      "",
      swe.SE_CALC_RISE,
      0,
      25.2,
      55.3,
      (res: any) => {
        return NextResponse.json({ type: "callback" });
      }
    );
  } catch (e) {
    // Try return-object version
    try {
      const r = swe.swe_rise_trans(
        jd,
        swe.SE_SUN,
        "",
        swe.SE_CALC_RISE,
        0,
        25.2,
        55.3
      );
      return NextResponse.json({ type: "return-object" });
    } catch (e2) {
      return NextResponse.json({ type: "unknown", error: String(e2) });
    }
  }

  return NextResponse.json({ type: "callback" });
}
