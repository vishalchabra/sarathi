import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import {
  getBillingProduct,
  isBillingCurrency,
  isBillingProductCode,
} from "@/server/billing/catalog";

export const runtime = "nodejs";

type CheckoutRequestBody = {
  productCode?: unknown;
  currency?: unknown;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "You must be logged in to continue to payment.",
        },
        { status: 401 }
      );
    }

    let body: CheckoutRequestBody;

    try {
      body = (await request.json()) as CheckoutRequestBody;
    } catch {
      return NextResponse.json(
        {
          error: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const { productCode, currency } = body;

    if (!isBillingProductCode(productCode)) {
      return NextResponse.json(
        {
          error: "Invalid billing product.",
        },
        { status: 400 }
      );
    }

    if (!isBillingCurrency(currency)) {
      return NextResponse.json(
        {
          error: "Invalid billing currency.",
        },
        { status: 400 }
      );
    }

    const product = getBillingProduct(productCode);

    const configuredAppUrl =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

    const requestOrigin = new URL(request.url).origin;

    const appUrl = configuredAppUrl || requestOrigin;

    const metadata = {
      userId: user.id,
      productCode: product.code,
      currency,
    };
    const successPath =
  product.code === "life_report"
    ? "/sarathi/life-report"
    : product.code === "data_engine_monthly"
      ? "/sarathi/data-engine"
      : "/sarathi/chat";

const cancelPath =
  product.code === "life_report"
    ? "/sarathi/upgrade?feature=life-report"
    : product.code === "data_engine_monthly"
      ? "/sarathi/upgrade?feature=data-engine"
      : "/sarathi/upgrade?feature=ask-sarathi";

    const session = await stripe.checkout.sessions.create({
      mode: product.mode,

      line_items: [
        {
          price: product.stripePriceId,
          quantity: 1,
        },
      ],

      /*
       * The Stripe Price contains INR, AED and USD currency options.
       * This tells Checkout which one the customer selected in Sārathi.
       */
      currency,

      customer_email: user.email ?? undefined,

      client_reference_id: user.id,

      metadata,
      success_url: `${appUrl}${successPath}?payment=success&session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${appUrl}${cancelPath}`,

      /*
       * Session metadata is sufficient for checkout.session.completed.
       * We also copy it to the resulting PaymentIntent or Subscription
       * so later Stripe events can be linked back to the Sārathi user.
       */
      ...(product.mode === "payment"
        ? {
            payment_intent_data: {
              metadata,
            },
          }
        : {
            subscription_data: {
              metadata,
            },
          }),
    });

    if (!session.url) {
      return NextResponse.json(
        {
          error: "Stripe did not return a Checkout URL.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Checkout creation failed:", error);

    return NextResponse.json(
      {
        error: "Unable to start Stripe Checkout.",
      },
      { status: 500 }
    );
  }
}