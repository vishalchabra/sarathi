import { NextResponse } from "next/server";
import { buildSunPack } from "@/server/astro/sun";
import type { PlanetPos, Birth } from "@/server/astro/types";
import { getNatal } from "@/server/ephemeris";
import { getNakshatra } from "@/server/astro/nakshatra"; // your existing function

function enrichNak(pos: PlanetPos): PlanetPos {
  if (!pos.nakName) {
    const nk = getNakshatra(pos.lon);
    return {
      ...pos,
      nakName: nk.name,
      // no pada anymore – getNakshatra no longer exposes nk.pada
    };
  }

  return pos;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const requestedNodeMode =
      body?.nodeMode ?? body?.birth?.nodeMode ?? "mean";

    if (
      requestedNodeMode !== "mean" &&
      requestedNodeMode !== "true"
    ) {
      return NextResponse.json(
        { error: "Invalid lunar node convention." },
        { status: 400 }
      );
    }

    const nodeMode: "mean" | "true" = requestedNodeMode;

    let positions: PlanetPos[] | undefined = body.positions;
    const birth: Birth | undefined = body.birth;

    if (!positions && birth) {
      // compute positions from real birth data
      positions = await getNatal(birth, nodeMode) as PlanetPos[];
    }

    if (!Array.isArray(positions) || positions.length === 0) {
      return NextResponse.json(
        { error: "Provide either positions[] or birth{}" },
        { status: 400 }
      );
    }

    // make sure nakshatra fields exist
    positions = positions.map(enrichNak);

    const pack = buildSunPack(positions);
    return NextResponse.json(pack);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Sun API error" }, { status: 500 });
  }
}
