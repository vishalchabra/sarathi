import { NextRequest, NextResponse } from "next/server";
import { buildDataEngine } from "@/server/dataEngine/buildDataEngine";
import { createClient } from "@/lib/supabase/server";
import { getUserEntitlements } from "@/server/auth/getUserEntitlements";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  console.log("=== DATA_ENGINE_HIT ===");

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          reason: "not_authenticated",
          error: "You must sign in to use the Data Engine.",
        },
        { status: 401 }
      );
    }

    const entitlements = await getUserEntitlements(user.id);

    if (!entitlements.dataEngine.allowed) {
      return NextResponse.json(
        {
          ok: false,
          reason: "data_engine_access_required",
          error: "Your account does not have access to the Data Engine.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();

   console.log("=== DATA_ENGINE_HIT ===", {
  time: new Date().toISOString(),
  selectedDateISO: body?.selectedDateISO,
  compareDateISO: body?.compareDateISO ?? null,
  userId: user.id,
});

    const result = await buildDataEngine({
      birth: body?.birth,
      plan: body?.plan ?? "light",
      selectedDateISO: body?.selectedDateISO,
      compareDateISO: body?.compareDateISO ?? null,
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