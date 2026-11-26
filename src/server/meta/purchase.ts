import "server-only";

import type Stripe from "stripe";

export type VerifiedPurchase = {
  reference: string;
  eventTime: number;
  value: number;
  currency: string;
};

export function getVerifiedDataEnginePurchase(
  session: Stripe.Checkout.Session,
  eventTime: number
): VerifiedPurchase | null {
  if (
    session.metadata?.productCode !==
      "data_engine_monthly" ||
    session.mode !== "subscription" ||
    session.payment_status !== "paid" ||
    session.status !== "complete" ||
    !session.subscription ||
    typeof session.amount_total !== "number" ||
    !Number.isSafeInteger(session.amount_total) ||
    session.amount_total <= 0 ||
    !session.currency ||
    !["inr", "aed", "usd"].includes(session.currency) ||
    !Number.isInteger(eventTime) ||
    eventTime < session.created
  ) {
    return null;
  }

  return {
    reference: session.id,
    eventTime,
    value: session.amount_total / 100,
    currency: session.currency.toUpperCase(),
  };
}