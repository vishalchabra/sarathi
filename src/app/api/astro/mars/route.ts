import { NextResponse } from "next/server";
import { buildMarsPack } from "@/server/astro/mars";
import type { PlanetPos, Birth } from "@/server/astro/types";
import { getNatal } from "@/server/ephemeris";
import { getNakshatra } from "@/server/astro/nakshatra";

function enrichNak(pos: PlanetPos): PlanetPos {
  if (!pos.nakName) {
  const nk = getNakshatra(pos.lon);
  return {
    ...pos,
    nakName: nk.name,
    pada: nk.pada as 1 | 2 | 3 | 4,
  };
}

return pos as any;

}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    let positions: PlanetPos[] | undefined = body.positions;
    const birth: Birth | undefined = body.birth;

    if (!positions && birth) positions = await getNatal(birth) as PlanetPos[];
    if (!Array.isArray(positions) || positions.length === 0) {
      return NextResponse.json({ error: "Provide either positions[] or birth{}" }, { status: 400 });
    }

    positions = positions.map(enrichNak);

    const pack = buildMarsPack(positions);
    return NextResponse.json(pack);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Mars API error" }, { status: 500 });
  }
}
