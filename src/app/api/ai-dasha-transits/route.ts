// FILE: src/app/api/ai-dasha-transits/route.ts
import { NextResponse } from "next/server";

// TEMP: disable AI logic for this route in this environment.
// Later, when you're ready, we can add OpenAI calls here.

async function handle() {
  return NextResponse.json({
    ok: true,
    disabled: true,
    message:
      "AI Dasha + Transits route is currently disabled on this deployment (no OpenAI configured).",
  });
}

export const GET = handle;
export const POST = handle;
