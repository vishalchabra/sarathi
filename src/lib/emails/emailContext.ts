// FILE: src/lib/emails/emailContext.ts

import "server-only";

import type Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

type CheckoutEmailContextOptions = {
  userId: string;
  session: Stripe.Checkout.Session;
};

export type CheckoutEmailContext = {
  recipientEmail: string;
  name: string;
  appUrl: string;
};

/**
 * Resolves the shared information needed for Stripe purchase emails.
 *
 * Priority:
 * 1. Supabase account email/name
 * 2. Stripe customer details
 * 3. Safe fallback name
 */
export async function getCheckoutEmailContext({
  userId,
  session,
}: CheckoutEmailContextOptions): Promise<CheckoutEmailContext | null> {
  const {
    data: userData,
    error: userLookupError,
  } = await supabaseAdmin.auth.admin.getUserById(userId);

  if (userLookupError) {
    throw new Error(
      `Unable to retrieve customer for purchase email: ${userLookupError.message}`
    );
  }

  const user = userData.user;

  const recipientEmail =
    user?.email?.trim() ||
    session.customer_details?.email?.trim() ||
    session.customer_email?.trim() ||
    "";

  if (!recipientEmail) {
    return null;
  }

  const metadata = user?.user_metadata ?? {};

  const metadataFullName =
    typeof metadata.full_name === "string"
      ? metadata.full_name.trim()
      : "";

  const metadataName =
    typeof metadata.name === "string"
      ? metadata.name.trim()
      : "";

  const stripeCustomerName =
    session.customer_details?.name?.trim() ?? "";

  const name =
    metadataFullName ||
    metadataName ||
    stripeCustomerName ||
    "Sārathi member";

  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://sarathiyourguide.com"
  ).replace(/\/$/, "");

  return {
    recipientEmail,
    name,
    appUrl,
  };
}