// FILE: src/app/api/ai-monthly/route.ts
import { NextResponse } from "next/server";

async function handle() {
  return NextResponse.json({
    ok: true,
    disabled: true,
    message:
      "AI Monthly route is currently disabled on this deployment (no OpenAI configured).",
  });
}

export const GET = handle;
export const POST = handle;
