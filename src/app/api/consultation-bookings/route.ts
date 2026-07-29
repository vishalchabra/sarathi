import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/mailer";
import { buildConsultationEmail } from "@/lib/emails/consultationEmail";
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please sign in before requesting a consultation.",
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const entitlementId =
  typeof body.entitlement_id === "string"
    ? body.entitlement_id.trim()
    : "";
    if (!entitlementId) {
  return NextResponse.json(
    {
      ok: false,
      error:
        "No paid consultation was found. Please complete the payment first.",
    },
    { status: 400 }
  );
}
    const customerName =
      typeof body.customer_name === "string"
        ? body.customer_name.trim()
        : "";

    const customerPhone =
      typeof body.customer_phone === "string"
        ? body.customer_phone.trim()
        : "";

    const birthDate =
      typeof body.birth_date === "string" ? body.birth_date : "";

    const birthTime =
      typeof body.birth_time === "string" ? body.birth_time : "";

    const birthPlace =
      typeof body.birth_place === "string"
        ? body.birth_place.trim()
        : "";

    const birthTimeAccuracy =
      typeof body.birth_time_accuracy === "string"
        ? body.birth_time_accuracy
        : "";

    const consultationArea =
      typeof body.consultation_area === "string"
        ? body.consultation_area
        : "";

    const questionOrFocus =
      typeof body.question_or_focus === "string"
        ? body.question_or_focus.trim()
        : "";

    const backgroundContext =
      typeof body.background_context === "string"
        ? body.background_context.trim()
        : "";

    

    if (!customerPhone) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please enter your phone or WhatsApp number.",
        },
        { status: 400 }
      );
    }

    if (!birthDate || !birthTime || !birthPlace) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please provide the complete birth details.",
        },
        { status: 400 }
      );
    }

    if (!birthTimeAccuracy) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please indicate how accurate the birth time is.",
        },
        { status: 400 }
      );
    }

    if (!consultationArea) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please select the main consultation area.",
        },
        { status: 400 }
      );
    }

    if (!questionOrFocus) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please tell us what you would like to understand.",
        },
        { status: 400 }
      );
    }

    
    const {
  data: consultationEntitlement,
  error: entitlementCheckError,
} = await supabaseAdmin
  .from("consultation_entitlements")
  .select("id, status")
  .eq("id", entitlementId)
  .eq("user_id", user.id)
  .eq("status", "available")
  .maybeSingle();

if (entitlementCheckError) {
  console.error(
    "Consultation entitlement check failed:",
    entitlementCheckError
  );

  return NextResponse.json(
    {
      ok: false,
      error:
        "We could not verify your consultation payment. Please try again.",
    },
    { status: 500 }
  );
}

if (!consultationEntitlement) {
  return NextResponse.json(
    {
      ok: false,
      error:
        "This consultation payment is unavailable or has already been used.",
    },
    { status: 403 }
  );
}
    const authenticatedEmail = user.email ?? "";

    if (!authenticatedEmail) {
      return NextResponse.json(
        {
          ok: false,
          error: "Your account does not have a valid email address.",
        },
        { status: 400 }
      );
    }

    const finalCustomerName =
      customerName ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      "Sārathi user";

    const {
  data: insertedBooking,
  error: bookingInsertError,
} = await supabase
  .from("consultation_bookings")
  .insert({
    user_id: user.id,
    consultation_type: "one_on_one",

    customer_name: finalCustomerName,
    customer_email: authenticatedEmail,
    customer_phone: customerPhone,

    birth_date: birthDate,
    birth_time: birthTime,
    birth_place: birthPlace,
    birth_time_accuracy: birthTimeAccuracy,

    consultation_area: consultationArea,
    question_or_focus: questionOrFocus,
    background_context: backgroundContext || null,
  })
  .select("id")
  .single();

if (bookingInsertError || !insertedBooking) {
  console.error(
    "Consultation booking insert failed:",
    bookingInsertError
  );

  return NextResponse.json(
    {
      ok: false,
      error: "We could not save your request. Please try again.",
    },
    { status: 400 }
  );
}
const usedAt = new Date().toISOString();

const {
  data: consumedEntitlement,
  error: entitlementConsumeError,
} = await supabaseAdmin
  .from("consultation_entitlements")
  .update({
    status: "used",
    used_at: usedAt,
  })
  .eq("id", entitlementId)
  .eq("user_id", user.id)
  .eq("status", "available")
  .select("id")
  .maybeSingle();

if (entitlementConsumeError || !consumedEntitlement) {
  console.error(
    "Consultation entitlement consumption failed:",
    entitlementConsumeError
  );

  /*
   * Remove the booking because its paid entitlement could not be consumed.
   * This also protects against two simultaneous submissions using the same
   * entitlement.
   */
  const { error: rollbackError } = await supabaseAdmin
    .from("consultation_bookings")
    .delete()
    .eq("id", insertedBooking.id)
    .eq("user_id", user.id);

  if (rollbackError) {
    console.error(
      "Consultation booking rollback failed:",
      rollbackError
    );
  }

  return NextResponse.json(
    {
      ok: false,
      error:
        "This consultation payment has already been used. Please refresh the page.",
    },
    { status: 409 }
  );
}
    const adminEmail = process.env.CONSULTATION_ADMIN_EMAIL;

    const safeName = escapeHtml(finalCustomerName);
    const safeEmail = escapeHtml(authenticatedEmail);
    const safePhone = escapeHtml(customerPhone);

    const safeBirthDate = escapeHtml(birthDate);
    const safeBirthTime = escapeHtml(birthTime);
    const safeBirthPlace = escapeHtml(birthPlace);
    const safeBirthTimeAccuracy = escapeHtml(birthTimeAccuracy);

    const safeConsultationArea = escapeHtml(consultationArea);
    const safeFocus = escapeHtml(questionOrFocus);
    const safeBackgroundContext = escapeHtml(
      backgroundContext || "Not provided"
    );

    const appUrl = (
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://sarathiyourguide.com"
).replace(/\/$/, "");

const consultationEmail = buildConsultationEmail({
  name: finalCustomerName,
  appUrl,
  consultationDate: null,
  consultationTime: null,
  timezone: null,
});
    const adminEmailPromise = adminEmail
      ? sendEmail({
          to: adminEmail,
          replyTo: authenticatedEmail,
          subject: `New consultation request from ${finalCustomerName}`,
          text: [
            "A new consultation request has been received.",
            "",
            "Customer details",
            `Name: ${finalCustomerName}`,
            `Email: ${authenticatedEmail}`,
            `Phone / WhatsApp: ${customerPhone}`,
            "",
            "Birth details",
            `Date of birth: ${birthDate}`,
            `Time of birth: ${birthTime}`,
            `Place of birth: ${birthPlace}`,
            `Birth-time accuracy: ${birthTimeAccuracy}`,
            "",
            "Consultation focus",
            `Main area: ${consultationArea}`,
            "",
            "Main question:",
            questionOrFocus,
            "",
            "Relevant background:",
            backgroundContext || "Not provided",
            "",
            "",
"Scheduling",
"The customer will be contacted with the earliest available consultation slot.",
          ].join("\n"),
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
              <h2>New consultation request</h2>

              <h3>Customer details</h3>
              <p><strong>Name:</strong> ${safeName}</p>
              <p><strong>Email:</strong> ${safeEmail}</p>
              <p><strong>Phone / WhatsApp:</strong> ${safePhone}</p>

              <h3>Birth details</h3>
              <p><strong>Date of birth:</strong> ${safeBirthDate}</p>
              <p><strong>Time of birth:</strong> ${safeBirthTime}</p>
              <p><strong>Place of birth:</strong> ${safeBirthPlace}</p>
              <p>
                <strong>Birth-time accuracy:</strong>
                ${safeBirthTimeAccuracy}
              </p>

              <h3>Consultation focus</h3>
              <p>
                <strong>Main area:</strong>
                ${safeConsultationArea}
              </p>

              <p><strong>Main question:</strong></p>
              <p>${safeFocus.replace(/\n/g, "<br />")}</p>

              <p><strong>Relevant background:</strong></p>
              <p>${safeBackgroundContext.replace(/\n/g, "<br />")}</p>
              <h3>Scheduling</h3>

<p>
This customer is awaiting scheduling.
Please contact them with the earliest available consultation slot.
</p>
            </div>
          `,
        })
      : Promise.resolve();

    const customerEmailPromise = sendEmail({
  to: authenticatedEmail,
  subject: consultationEmail.subject,
  text: consultationEmail.text,
  html: consultationEmail.html,
});

    const emailResults = await Promise.allSettled([
      adminEmailPromise,
      customerEmailPromise,
    ]);

    emailResults.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          index === 0
            ? "Admin consultation email failed:"
            : "Customer consultation email failed:",
          result.reason
        );
      }
    });

    return NextResponse.json({
      ok: true,
    });
  } catch (error: unknown) {
    console.error("Consultation booking error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}