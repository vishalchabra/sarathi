import { NextResponse } from "next/server";
import { buildTransitResponse } from "@/server/astro/buildTransitResponse";

export type {
  TransitHit,
  TransitRequestBirth,
  DailyMoonRow,
  TransitNowPlanet,
  MoonNow,
} from "@/server/astro/buildTransitResponse";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const result = await buildTransitResponse(body);

    return NextResponse.json(result.data, {
      status: result.status,
    });
  } catch (e) {
    console.error("[transits] error", e);

    return NextResponse.json(
      { error: "Failed to compute transits" },
      { status: 500 }
    );
  }
}
