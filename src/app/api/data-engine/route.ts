import { NextRequest, NextResponse } from "next/server";
import { buildDataEngine } from "@/server/dataEngine/buildDataEngine";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await buildDataEngine({
      birth: body.birth,
      plan: body.plan,
      selectedDateISO: body.selectedDateISO,
      compareDateISO: body.compareDateISO,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: err?.message || "Failed to build data engine payload",
      },
      { status: 500 }
    );
  }
}