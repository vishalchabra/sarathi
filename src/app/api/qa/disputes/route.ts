import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Placeholder endpoint — disabled for MVP.
 */
export async function POST() {
  return NextResponse.json(
    { error: "This endpoint is not active in this build." },
    { status: 501 }
  );
}
