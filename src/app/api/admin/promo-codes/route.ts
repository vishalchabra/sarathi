import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserEntitlements } from "@/server/auth/getUserEntitlements";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Please sign in." },
        { status: 401 }
      );
    }

    const entitlements = await getUserEntitlements(user.id);

   if (entitlements.role !== "admin") {
  return NextResponse.json(
    { ok: false, error: "Admin access required." },
    { status: 403 }
  );
}

    const body = await req.json();

    const { error } = await supabase.from("promo_codes").insert({
      code: String(body.code || "").trim().toUpperCase(),
      description: body.description || null,
      discount_type: body.discount_type || "percent",
      discount_value: Number(body.discount_value),
      applies_to: body.applies_to || "all",
      max_redemptions: body.max_redemptions ?? null,
      expires_at: body.expires_at ?? null,
      status: "active",
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}