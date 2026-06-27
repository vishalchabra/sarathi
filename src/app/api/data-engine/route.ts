import { NextRequest, NextResponse } from "next/server";
import { buildDataEngine } from "@/server/dataEngine/buildDataEngine";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
   console.log("=== DATA_ENGINE_HIT ===");
  try {
    
    const body = await req.json();
    console.log("=== DATA_ENGINE_HIT ===", {
  time: new Date().toISOString(),
  selectedDateISO: body?.selectedDateISO,
  compareDateISO: body?.compareDateISO ?? null,
  name: body?.birth?.name ?? null,
  city: body?.birth?.city ?? null,
});
 const result = await buildDataEngine({
  birth: body?.birth,
  plan: body?.plan ?? "light",
  selectedDateISO: body?.selectedDateISO,
  compareDateISO: body?.compareDateISO ?? null,

  // 🔥 ADD THESE
  utilityDateISO: body?.utilityDateISO ?? null,
  utilityHoraDateISO: body?.utilityHoraDateISO ?? null,
  utilityTime: body?.utilityTime ?? null,
  utilityPlace: body?.utilityPlace ?? null,
});

    return NextResponse.json(result);
    } catch (err: any) {
    console.error("DATA_ENGINE_ERROR", {
      message: err?.message,
      stack: err?.stack,
      error: err,
    });

    return NextResponse.json(
      {
        ok: false,
        error: err?.message || "Failed to build data engine payload",
      },
      { status: 500 }
    );
  }
}