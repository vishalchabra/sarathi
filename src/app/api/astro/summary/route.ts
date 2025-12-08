// FILE: src/app/api/astro/summary/route.ts
import { NextResponse } from "next/server";

// Temporary placeholder so Vercel can build.
// We will wire real astro summary logic later.
export async function POST(req: Request) {
  return NextResponse.json(
    {
      ok: true,
      message: "astro/summary endpoint is temporarily disabled for deployment.",
    },
    { status: 200 }
  );
}
