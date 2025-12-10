// FILE: src/app/api/ai-daily/route.ts
import { NextResponse } from "next/server";

async function handle() {
  return NextResponse.json({
    ok: true,
    disabled: true,
    message:
      "AI Daily route is currently disabled on this deployment (no OpenAI configured).",
  });
}

export const GET = handle;
export const POST = handle;
