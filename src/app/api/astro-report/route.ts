// TEMP STUB - DO NOT REMOVE
// FILE: src/app/api/astro-report/route.ts
import { NextResponse } from "next/server";

// Temporary placeholder so Vercel can build.
// We will wire the real astro-report logic later.
export async function POST(req: Request) {
  return NextResponse.json(
    {
      ok: true,
      message: "astro-report endpoint is temporarily disabled for deployment.",
    },
    { status: 200 }
  );
}
