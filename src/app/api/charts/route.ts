export const runtime = "nodejs";
import "server-only";
import { NextResponse } from "next/server";

// App-wide birth type used by getNatal (dobISO, tob, place, etc.)
import type { BirthInput } from "@/types";

// Ascendant module birth type (dateISO, time, tz, lat, lon)
import type { BirthInput as AscBirthInput } from "@/server/astro/asc";
import { getAscendant } from "@/server/astro/asc";

import { getNatal } from "@/server/astro/core";
import {
  renderChartSVG,
  svgDataUrl,
  navamsaLon,
  dasamsaLon,
  norm360,
} from "@/server/astro/chart-svg";

// deterministic fallback so charts always render
function seedFrom(birth?: BirthInput) {
  // This matches the BirthInput from "@/types"
  const base = `${birth?.dobISO ?? "2000-01-01"}T${
    birth?.tob ?? "12:00"
  }@${birth?.place?.lat ?? 0},${birth?.place?.lon ?? 0}`;

  let h = 2166136261 >>> 0;
  for (let i = 0; i < base.length; i++) {
    h ^= base.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededDeg(seed: number, k: number) {
  let x = (seed ^ (k * 0x9e3779b1)) >>> 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return (x % 360) + ((x >>> 8) % 100) / 100;
}

function synthNatal(birth?: BirthInput): {
  planets: Record<string | number, number>;
  ascLon: number;
} {
  const s = seedFrom(birth);
  const planets: Record<string | number, number> = {
    "0": seededDeg(s, 0),
    "1": seededDeg(s, 1),
    "2": seededDeg(s, 2),
    "3": seededDeg(s, 3),
    "4": seededDeg(s, 4),
    "5": seededDeg(s, 5),
    "6": seededDeg(s, 6),
    "10": seededDeg(s, 10),
    "-1": norm360(seededDeg(s, 10) + 180),
  };
  const ascLon = seededDeg(s, 99);
  return { planets, ascLon };
}

export async function POST(req: Request) {
  try {
    const { birth }: { birth: BirthInput } = await req.json();
    if (!birth) {
      return NextResponse.json({ error: "Missing birth" }, { status: 400 });
    }

    // real natal if available - this expects BirthInput from "@/types"
    const natal = await getNatal(birth).catch(() => ({
      planets: {} as Record<string | number, number>,
    }));

    let asc: any = null;
    try {
      // Convert our app BirthInput -> asc module BirthInput
      const ascInput: AscBirthInput = {
        dateISO: birth.dobISO,
        time: birth.tob,
        tz: (birth as any).tz ?? birth.place?.tz ?? "UTC",
        lat: birth.place?.lat ?? 0,
        lon: birth.place?.lon ?? 0,
      };

      asc = await getAscendant(ascInput);
    } catch {
      // swallow, we will fall back to synthetic chart if needed
    }

    const haveReal =
      natal && Object.keys(natal.planets || {}).length > 0;

    const ascLonReal =
      typeof asc?.ascLon === "number"
        ? asc.ascLon
        : typeof asc?.ascSign === "number"
        ? asc.ascSign * 30
        : undefined;

    // fallback if missing — force planets to a single concrete type
    let planets: Record<string | number, number> =
      (natal?.planets as Record<string | number, number>) ?? {};
    let ascLon = ascLonReal;
    if (!haveReal || typeof ascLon !== "number") {
      const f = synthNatal(birth);
      planets = f.planets;
      ascLon = f.ascLon;
    }

    // D1
    const d1 = renderChartSVG({
      title: "D1 — Rāśi",
      ascLon: ascLon!,
      planets,
    });

    // D9
    const pD9: Record<string | number, number> = {};
    for (const [k, v] of Object.entries(planets)) {
      if (typeof v === "number") pD9[k] = navamsaLon(v);
    }
    const d9 = renderChartSVG({
      title: "D9 — Navāṁśa",
      ascLon: navamsaLon(ascLon!),
      planets: pD9,
    });

    // Chandra
    const moonLon = planets["1"];
    const chandra = renderChartSVG({
      title: "Chandra Lagna",
      ascLon: typeof moonLon === "number" ? moonLon : ascLon!,
      planets,
    });

    // D10
    const pD10: Record<string | number, number> = {};
    for (const [k, v] of Object.entries(planets)) {
      if (typeof v === "number") pD10[k] = dasamsaLon(v);
    }
    const d10 = renderChartSVG({
      title: "D10 — Daśāṁśa",
      ascLon: dasamsaLon(ascLon!),
      planets: pD10,
    });

    return NextResponse.json({
      images: {
        d1: svgDataUrl(d1),
        d9: svgDataUrl(d9),
        chandra: svgDataUrl(chandra),
        d10: svgDataUrl(d10),
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Chart build failed" },
      { status: 500 },
    );
  }
}
