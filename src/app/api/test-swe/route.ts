// FILE: src/app/api/test-swe/route.ts
import "server-only";
import { NextResponse } from "next/server";

/**
 * Test endpoint for verifying the server can run without Swiss Ephemeris.
 * We intentionally DO NOT call any swisseph / SWE functions here anymore.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    message:
      "Swiss Ephemeris (native/WASM) is disabled in this Sarathi build. All astro logic now uses our pure TypeScript providers.",
  });
}
