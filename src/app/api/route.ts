import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Transit orchestrator temporarily disabled for MVP.
 */
export async function POST() {
  return NextResponse.json(
    { error: "Transit endpoint not active in this build." },
    { status: 501 }
  );
}
