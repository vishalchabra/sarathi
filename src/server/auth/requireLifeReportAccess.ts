import "server-only";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createClient as createSupabaseClient,
} from "@supabase/supabase-js";
import { getUserEntitlements } from "./getUserEntitlements";

function deny(
  status: number,
  reason: string,
  error: string
): NextResponse {
  return NextResponse.json(
    { ok: false, reason, error },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function requireLifeReportAccess(
  req: Request
): Promise<NextResponse | null> {
  try {
    const authorization = req.headers.get("authorization");

    let bearerToken: string | null = null;

    if (authorization !== null) {
      const match = /^Bearer ([^\s]+)$/i.exec(
        authorization.trim()
      );

      if (!match) {
        return deny(
          401,
          "not_authenticated",
          "Invalid authorization header."
        );
      }

      bearerToken = match[1];
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
      : await createClient();

    const { data, error } = bearerToken
      ? await supabase.auth.getUser(bearerToken)
      : await supabase.auth.getUser();

    if (error || !data.user) {
      return deny(
        401,
        "not_authenticated",
        "Please sign in to access Life Report insights."
      );
    }

    const entitlements = await getUserEntitlements(
      data.user.id,
      supabase
    );

    if (entitlements.lifeReport.allowed !== true) {
      return deny(
        403,
        "life_report_access_required",
        "Your account does not have access to Life Reports."
      );
    }

    return null;
  } catch {
    console.error("[life-report-access] Access verification failed");

    return deny(
      503,
      "access_verification_unavailable",
      "Unable to verify access. Please try again."
    );
  }
}