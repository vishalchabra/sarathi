// FILE: src/app/api/_tests/asc/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { buildLifeReport } from "@/server/astro/life-engine";

export const runtime = "nodejs";

export async function GET() {
  const input = {
    name: "AscRegression",
    birthDateISO: "1985-01-21",
    birthTime: "23:35",
    birthTz: "Asia/Kolkata",
    lat: 29.968,
    lon: 77.5552,
  };

  const report = await buildLifeReport(input);

  const planets = Array.isArray(report?.planets) ? report.planets : [];
  const sun = planets.find((p: any) => p?.name === "Sun");
  const moon = planets.find((p: any) => p?.name === "Moon");

  const got = {
    ascSign: report?.ascSign,
    ascDeg: report?.ascDeg,
    sunHouse: sun?.house ?? null,
    moonHouse: moon?.house ?? null,
  };

  const expected = { ascSign: "Virgo", sunHouse: 5 };

const ok = got.ascSign === expected.ascSign && got.sunHouse === expected.sunHouse;

  if (!ok) {
    return NextResponse.json(
      {
        ok: false,
        expected,
        got,
        message: "Ascendant regression FAILED",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    expected,
    got,
    message: "Ascendant regression PASSED",
  });
}
