import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: "Promo-code validation is not yet available.",
    },
    { status: 501 }
  );
}