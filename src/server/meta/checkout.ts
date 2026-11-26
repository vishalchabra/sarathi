import "server-only";

import type Stripe from "stripe";


import {
  getConversionContext,
  sendConfirmedConversion,

} from "./conversions";

import {
  saveConversionAttribution,
} from "./attribution";

export async function trackDataEngineCheckout(
  request: Request,
  session: Stripe.Checkout.Session,
  consentToken: string | undefined
): Promise<void> {
  try {
    if (
      process.env.META_CONVERSIONS_ENABLED !== "true"
    ) return;

    if (
      session.metadata?.productCode !==
        "data_engine_monthly" ||
      session.mode !== "subscription" ||
      !session.url ||
      typeof session.amount_total !== "number" ||
      session.amount_total < 0 ||
      !session.currency ||
      !["inr", "aed", "usd"].includes(session.currency)
    ) {
      return;
    }



    const context = await getConversionContext(
      request,
      consentToken
    );

    if (!context) return;

    const saved = await saveConversionAttribution(
      "checkout",
      session.id,
      context.attribution
    );

    if (!saved) return;

    await sendConfirmedConversion({
      eventName: "InitiateCheckout",
      reference: session.id,
      context,
      eventTime: session.created,
      value: session.amount_total / 100,
      currency: session.currency.toUpperCase(),
    });
  } catch {
    // Advertising measurement must never block checkout.
  }
}