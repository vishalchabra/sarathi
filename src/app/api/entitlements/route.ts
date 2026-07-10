import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserEntitlements } from "@/server/auth/getUserEntitlements";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, reason: "not_authenticated" },
      { status: 401 }
    );
  }

  const entitlements = await getUserEntitlements(user.id);

  return NextResponse.json({
    ok: true,
    entitlements,
  });
}