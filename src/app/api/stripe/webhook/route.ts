import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  getBillingProduct,
  isBillingProductCode,
} from "@/server/billing/catalog";

export const runtime = "nodejs";

function getStripeObjectId(
  value: string | { id: string } | null
): string | null {
  if (!value) {
    return null;
  }

  return typeof value === "string" ? value : value.id;
}

async function fulfilCheckoutSession(
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.userId;
  const productCode = session.metadata?.productCode;

  if (!userId) {
    throw new Error(
      `Missing userId metadata on Checkout Session ${session.id}.`
    );
  }

  if (!isBillingProductCode(productCode)) {
    throw new Error(
      `Invalid productCode metadata on Checkout Session ${session.id}.`
    );
  }

  const product = getBillingProduct(productCode);

  /*
   * Handle one-time purchases:
   * - Life Report
   * - Ask Sārathi question credits
   */
  if (product.mode === "payment") {
    /*
     * Do not fulfil an unpaid Checkout Session.
     * This matters if delayed payment methods are enabled later.
     */
    if (
      session.payment_status !== "paid" &&
      session.payment_status !== "no_payment_required"
    ) {
      console.log(
        `Checkout Session ${session.id} is not paid yet.`
      );

      return;
    }

    const paymentIntentId =
      getStripeObjectId(session.payment_intent) ?? session.id;

    const amount =
      typeof session.amount_total === "number"
        ? session.amount_total / 100
        : null;

    const currency =
      session.currency?.toUpperCase() ??
      session.metadata?.currency?.toUpperCase() ??
      "INR";

    const { data, error } = await supabaseAdmin.rpc(
      "record_stripe_purchase",
      {
        p_user_id: userId,
        p_product: product.code,
        p_payment_id: paymentIntentId,
        p_amount: amount,
        p_currency: currency,
        p_credits: product.credits ?? 0,
      }
    );

    if (error) {
      throw new Error(
        `Unable to record Stripe purchase: ${error.message}`
      );
    }

    if (data === false) {
      console.log(
        `Stripe purchase ${paymentIntentId} was already fulfilled.`
      );
    } else {
      console.log(
        `Stripe purchase ${paymentIntentId} fulfilled successfully.`
      );
    }

    return;
  }

  /*
   * Handle Sārathi monthly subscription.
   */
  const subscriptionId = getStripeObjectId(
    session.subscription
  );

  if (!subscriptionId) {
    throw new Error(
      `Missing Stripe subscription ID on Checkout Session ${session.id}.`
    );
  }

  const now = new Date().toISOString();

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        plan: "pro",
        status: "active",
        provider: "stripe",
        provider_subscription_id: subscriptionId,
        starts_at: now,
        ends_at: null,
        updated_at: now,
      },
      {
        onConflict: "provider_subscription_id",
      }
    );

  if (error) {
    throw new Error(
      `Unable to record Stripe subscription: ${error.message}`
    );
  }

  console.log(
    `Stripe subscription ${subscriptionId} activated successfully.`
  );
}

export async function POST(request: Request) {
  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      "Missing STRIPE_WEBHOOK_SECRET environment variable."
    );

    return NextResponse.json(
      {
        error: "Stripe webhook is not configured.",
      },
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      {
        error: "Missing Stripe signature.",
      },
      { status: 400 }
    );
  }

  /*
   * Stripe requires the original unmodified request body
   * to verify the webhook signature.
   */
  const rawBody = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown signature verification error.";

    console.error(
      "Stripe webhook signature verification failed:",
      message
    );

    return NextResponse.json(
      {
        error: `Invalid Stripe webhook signature: ${message}`,
      },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        await fulfilCheckoutSession(session);
        break;
      }

      default:
        console.log(
          `Unhandled Stripe event type: ${event.type}`
        );
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      `Stripe webhook processing failed for ${event.id}:`,
      error
    );

    return NextResponse.json(
      {
        error: "Stripe webhook processing failed.",
      },
      { status: 500 }
    );
  }
}