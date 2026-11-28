export const runtime = "nodejs";
import "server-only";
import { NextResponse } from "next/server";

// App-wide birth type used by getNatal (dobISO, tob, place, etc.)
import type { BirthInput } from "@/types";

// Ascendant module birth type (dateISO, time, tz, lat, lon)
import type { BirthInput as AscBirthInput } from "@/server/astro/asc";
import { getAscendant } from "@/server/astro/asc";

import { DateTime } from "luxon";
import { computePlacements } from "@/server/astro/placements";
import { NODE_CALCULATION_VERSION } from "@/server/astro/lunarNodes";
import {
  renderChartSVG,
  svgDataUrl,
  navamsaLon,
  dasamsaLon,

} from "@/server/astro/chart-svg";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const birth: BirthInput = body?.birth;

    if (!birth || !birth.place) {
      return NextResponse.json(
        { error: "Missing birth details." },
        { status: 400 }
      );
    }

    const requestedNodeMode =
      body?.nodeMode ??
      (birth as any).nodeMode ??
      "mean";

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

    const ascInput: AscBirthInput = {
      dateISO: birth.dobISO,
      time: birth.tob,
      tz: (birth as any).tz ?? birth.place.tz,
      lat: birth.place.lat,
      lon: birth.place.lon,
    };

    const local = DateTime.fromISO(
      `${ascInput.dateISO}T${ascInput.time}`,
      { zone: ascInput.tz }
    );

    if (
      !ascInput.tz ||
      !local.isValid ||
      !Number.isFinite(ascInput.lat) ||
      !Number.isFinite(ascInput.lon) ||
      Math.abs(ascInput.lat) > 90 ||
      Math.abs(ascInput.lon) > 180
    ) {
      return NextResponse.json(
        { error: "Invalid birth date, time or location." },
        { status: 400 }
      );
    }

    const asc = await getAscendant(ascInput);

    const placements = await computePlacements(
      ascInput,
      nodeMode
    );

    if (
      !Number.isFinite(asc.lon) ||
      placements.length !== 9
    ) {
      throw new Error("Incomplete chart calculation.");
    }

    const ascLon = asc.lon;

    // Preserve the numeric planet identifiers
    // expected by the existing SVG renderer.
    const planetCodes: Record<string, string> = {
      Sun: "0",
      Moon: "1",
      Mercury: "2",
      Venus: "3",
      Mars: "4",
      Jupiter: "5",
      Saturn: "6",
      Rahu: "10",
      Ketu: "-1",
    };

    const planets: Record<string | number, number> = {};

    for (const p of placements) {
      const code = planetCodes[p.planet];

      if (
        code === undefined ||
        !Number.isFinite(p.lon)
      ) {
        throw new Error("Invalid planetary calculation.");
      }

      planets[code] = p.lon;
    }

    if (Object.keys(planets).length !== 9) {
      throw new Error("Incomplete planetary calculation.");
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
      nodeMode,
      nodeCalculationVersion: NODE_CALCULATION_VERSION,
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
