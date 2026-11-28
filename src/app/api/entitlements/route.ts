import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getUserEntitlements } from "@/server/auth/getUserEntitlements";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const headers = {
    "Cache-Control": "private, no-store",
  };

  try {
    const cookieClient = await createClient();

    const authorization = req.headers.get("authorization");

    const bearerToken =
      /^Bearer\s+(\S+)$/i.exec(authorization ?? "")?.[1];

    if (authorization !== null && !bearerToken) {
      return NextResponse.json(
        { ok: false, reason: "not_authenticated" },
        { status: 401, headers }
      );
    }

    const supabase = bearerToken
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
      : cookieClient;

    const {
      data: { user },
      error,
    } = bearerToken
      ? await supabase.auth.getUser(bearerToken)
      : await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { ok: false, reason: "not_authenticated" },
        { status: 401, headers }
      );
    }

    const entitlements = await getUserEntitlements(
      user.id,
      supabase
    );

    return NextResponse.json(
      {
        ok: true,
        entitlements,
      },
      { headers }
    );
  } catch {
    return NextResponse.json(
      { ok: false, reason: "entitlement_check_failed" },
      { status: 500, headers }
    );
  }
}
