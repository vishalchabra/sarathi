import { NextRequest, NextResponse } from "next/server";
import { buildDataEngine } from "@/server/dataEngine/buildDataEngine";
import { createClient } from "@/lib/supabase/server";
import { getUserEntitlements } from "@/server/auth/getUserEntitlements";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const authorization = req.headers.get("authorization");

    const bearerToken = /^Bearer\s+(\S+)$/i.exec(
      authorization ?? ""
    )?.[1];

    let user = null;

    // Mobile authentication using a verified bearer token.
    if (authorization !== null) {
      if (bearerToken) {
        const {
          data: { user: tokenUser },
          error: tokenError,
        } = await supabase.auth.getUser(bearerToken);

        if (!tokenError) {
          user = tokenUser;
        }
      }
    } else {
      // Existing website cookie-based authentication.
      const {
        data: { user: cookieUser },
        error: cookieError,
      } = await supabase.auth.getUser();

      if (!cookieError) {
        user = cookieUser;
      }
    }

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

    // Preserve the authenticated user's context for RLS.
    const entitlementClient = bearerToken
      ? createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            global: {
              headers: {
                Authorization: `Bearer ${bearerToken}`,
              },
            },
            auth: {
              persistSession: false,
              autoRefreshToken: false,
            },
          }
        )
      : supabase;

    const entitlements = await getUserEntitlements(
      user.id,
      entitlementClient
    );

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

    // Validate utility requests before running calculations.
    if (
      body?.responseMode === "utility" &&
      body?.utilityType !== "hora" &&
      body?.utilityType !== "panchang"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid utility type.",
        },
        { status: 400 }
      );
    }

    const result = await buildDataEngine({
      birth: body?.birth,
      plan: body?.plan ?? "light",
      selectedDateISO: body?.selectedDateISO ?? null,
      compareDateISO: body?.compareDateISO ?? null,
      utilityDateISO: body?.utilityDateISO ?? null,
      utilityHoraDateISO: body?.utilityHoraDateISO ?? null,
      utilityTime: body?.utilityTime ?? null,
      utilityPlace: body?.utilityPlace ?? null,
    });

    // Return only the requested utility.
    if (body?.responseMode === "utility") {
      const utility: "hora" | "panchang" = body.utilityType;

      return NextResponse.json({
        ok: true,
        timing: {
          utilities: {
            [utility]:
              result.timing?.utilities?.[utility] ?? null,
          },
        },
      });
    }

    // Reduce the mobile payload by excluding the full Dasha tree.
    if (body?.responseMode === "mobile") {
      const { tree: _unusedTree, ...mobileDasha } = result.dasha;

      const mobileResult = {
        ...result,
        dasha: mobileDasha,
        timing: {
          ...result.timing,
          dasha: mobileDasha,
        },
      };

      return NextResponse.json(mobileResult);
    }

    // Preserve the full website response.
    return NextResponse.json(result);

  } catch (err: unknown) {
    console.error("[Data Engine] Request failed", {
      errorType: err instanceof Error ? err.name : "UnknownError",
    });

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to build data engine payload.",
      },
      { status: 500 }
    );
  }
}