import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    const body = await req.json();

    const { error } = await supabase
      .from("consultation_bookings")
      .insert({
        user_id: user.id,
        consultation_type: "one_on_one",
        duration_minutes: body.duration_minutes,
        customer_name: body.customer_name,
        customer_email: body.customer_email,
        customer_phone: body.customer_phone,
        preferred_date: body.preferred_date,
        preferred_time: body.preferred_time,
        timezone: body.timezone,
        question_or_focus: body.question_or_focus,
      });

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        error: e.message,
      },
      { status: 500 }
    );
  }
}