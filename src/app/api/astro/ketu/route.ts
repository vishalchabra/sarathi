// FILE: src/app/api/astro/ketu/route.ts
import { NextResponse } from "next/server";
import { buildKetuPack } from "@/server/astro/ketu";
import type { PlanetPos, Birth } from "@/server/astro/types";
import { getNatal } from "@/server/ephemeris";
import { getNakshatra } from "@/server/astro/nakshatra";

/** --- Simple helpers to compute nakshatra quarter (pada) from longitude --- */
const NAK_LEN = 13 + 1 / 3;   // 13°20' = 13.333333...
const PADA_LEN = 3 + 1 / 3;   // 3°20'  = 3.333333...

function norm360(x: number) {
  return ((x % 360) + 360) % 360;
}

/** Returns 1..4 based on where within the nakshatra the longitude falls */
function getPadaFromLongitude(lon: number): 1 | 2 | 3 | 4 {
  const deg = norm360(lon);
  const withinNak = deg % NAK_LEN;
  const pad = Math.floor(withinNak / PADA_LEN) + 1; // 1..4
  return (Math.min(4, Math.max(1, pad)) as 1 | 2 | 3 | 4);
}

/** Ensure pos has nakName and pada; compute pada locally (no reliance on nk.pada). */
function enrichNak(pos: PlanetPos): PlanetPos {
  // If longitude is missing or invalid, just return as-is
  if (typeof (pos as any).lon !== "number" || !Number.isFinite((pos as any).lon)) {
    return pos;
  }

  // Always compute pada from longitude; add nakName if missing
  const lon: number = (pos as any).lon;
  const nk = getNakshatra(lon); // expected to have at least { name, lord, theme, ... }
  const pada = getPadaFromLongitude(lon);

  return {
    ...pos,
    nakName: pos.nakName || nk.name,
    // Force a well-typed pada (1|2|3|4); avoid relying on nk.pada
    pada: (pos as any).pada ?? pada,
  } as PlanetPos;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let positions: PlanetPos[] | undefined = body.positions;
    const birth: Birth | undefined = body.birth;

    if (!positions && birth) {
      positions = (await getNatal(birth)) as PlanetPos[];
    }
    if (!Array.isArray(positions) || positions.length === 0) {
      return NextResponse.json(
        { error: "Provide either positions[] or birth{}" },
        { status: 400 }
      );
    }

    const enriched = positions.map(enrichNak);
    const pack = buildKetuPack(enriched);
    return NextResponse.json(pack);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Ketu API error" },
      { status: 500 }
    );
  }
}
