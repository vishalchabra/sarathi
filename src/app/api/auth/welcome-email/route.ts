// FILE: src/app/api/auth/welcome-email/route.ts

import "server-only";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/mailer";
import { buildWelcomeEmail } from "@/lib/emails/welcomeEmail";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.email) {
      return NextResponse.json(
        {
          ok: false,
          error: "You must be signed in.",
        },
        { status: 401 }
      );
    }

    /*
     * Do not send the welcome email again on later logins.
     */
    if (user.user_metadata?.welcome_email_sent_at) {
      return NextResponse.json({
        ok: true,
        alreadySent: true,
      });
    }

    const name =
      typeof user.user_metadata?.full_name === "string" &&
      user.user_metadata.full_name.trim()
        ? user.user_metadata.full_name.trim()
        : typeof user.user_metadata?.name === "string" &&
            user.user_metadata.name.trim()
          ? user.user_metadata.name.trim()
          : "Sārathi member";

    const requestUrl = new URL(req.url);

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
      requestUrl.origin;

    const email = buildWelcomeEmail({
      name,
      appUrl: `${appUrl}/sarathi`,
    });

    await sendEmail({
      to: user.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });

    const sentAt = new Date().toISOString();

    const { error: metadataError } =
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: {
          ...user.user_metadata,
          welcome_email_sent_at: sentAt,
        },
      });

    if (metadataError) {
      /*
       * The email was successfully sent, so do not fail the login flow.
       * Log the metadata issue for investigation.
       */
      console.error(
        "Welcome email metadata update failed:",
        metadataError
      );
    }

    return NextResponse.json({
      ok: true,
      sent: true,
    });
  } catch (error: unknown) {
    console.error("Welcome email failed:", error);

    /*
     * Email failure must never stop the customer from signing in.
     */
    return NextResponse.json(
      {
        ok: false,
        error: "Welcome email could not be sent.",
      },
      { status: 500 }
    );
  }
}