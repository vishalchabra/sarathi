import "server-only";

export type BillingCurrency = "inr" | "aed" | "usd";

export type BillingProductCode =
  | "life_report"
  | "ask_1"
  | "ask_3"
  | "ask_5"
  | "ask_10"
  | "data_engine_monthly"
  | "consultation";

export type BillingMode = "payment" | "subscription";

type ProductPrice = {
  currency: BillingCurrency;
  unitAmount: number;
};

export type BillingProduct = {
  code: BillingProductCode;
  name: string;
  description: string;
  mode: BillingMode;

  /**
   * One Stripe Price ID containing INR, AED and USD currency options.
   */
  stripePriceId: string;

  /**
   * Number of Ask Sārathi credits granted after payment.
   */
  credits?: number;

  /**
   * Prices in the smallest currency unit:
   * INR ₹999 = 99900
   * AED 49 = 4900
   * USD $14.99 = 1499
   */
  prices: Record<BillingCurrency, ProductPrice>;
};

export const BILLING_CATALOG: Record<
  BillingProductCode,
  BillingProduct
> = {
  life_report: {
    code: "life_report",
    name: "Sārathi Full Life Report",
    description:
      "One-time access to your complete personalised Sārathi Life Report.",
    mode: "payment",
    stripePriceId: "price_1TzccgRyK8MNzHdLWo7nIje5",
    prices: {
      inr: {
        currency: "inr",
        unitAmount: 99900,
      },
      aed: {
        currency: "aed",
        unitAmount: 4900,
      },
      usd: {
        currency: "usd",
        unitAmount: 1499,
      },
    },
  },

  ask_1: {
    code: "ask_1",
    name: "Ask Sārathi — 1 Question",
    description: "One additional Ask Sārathi question credit.",
    mode: "payment",
    stripePriceId: "price_1Tzcf5RyK8MNzHdL1e2qPQ5F",
    credits: 1,
    prices: {
      inr: {
        currency: "inr",
        unitAmount: 9900,
      },
      aed: {
        currency: "aed",
        unitAmount: 500,
      },
      usd: {
        currency: "usd",
        unitAmount: 199,
      },
    },
  },

  ask_3: {
    code: "ask_3",
    name: "Ask Sārathi — 3 Questions",
    description: "Three additional Ask Sārathi question credits.",
    mode: "payment",
    stripePriceId: "price_1TzcgcRyK8MNzHdLjNNra9q8",
    credits: 3,
    prices: {
      inr: {
        currency: "inr",
        unitAmount: 24900,
      },
      aed: {
        currency: "aed",
        unitAmount: 1200,
      },
      usd: {
        currency: "usd",
        unitAmount: 399,
      },
    },
  },

  ask_5: {
    code: "ask_5",
    name: "Ask Sārathi — 5 Questions",
    description: "Five additional Ask Sārathi question credits.",
    mode: "payment",
    stripePriceId: "price_1TzchlRyK8MNzHdLQ2ZL1Yoa",
    credits: 5,
    prices: {
      inr: {
        currency: "inr",
        unitAmount: 39900,
      },
      aed: {
        currency: "aed",
        unitAmount: 1900,
      },
      usd: {
        currency: "usd",
        unitAmount: 599,
      },
    },
  },

  ask_10: {
    code: "ask_10",
    name: "Ask Sārathi — 10 Questions",
    description: "Ten additional Ask Sārathi question credits.",
    mode: "payment",
    stripePriceId: "price_1Tzcj0RyK8MNzHdLGXJNFxKc",
    credits: 10,
    prices: {
      inr: {
        currency: "inr",
        unitAmount: 79900,
      },
      aed: {
        currency: "aed",
        unitAmount: 3900,
      },
      usd: {
        currency: "usd",
        unitAmount: 1099,
      },
    },
  },

  data_engine_monthly: {
    code: "data_engine_monthly",
    name: "Sārathi Data Engine Professional",
    description:
      "Monthly access to Sārathi’s professional astrology Data Engine.",
    mode: "subscription",
    stripePriceId: "price_1TzckDRyK8MNzHdLKPlF5smG",
    prices: {
      inr: {
        currency: "inr",
        unitAmount: 149900,
      },
      aed: {
        currency: "aed",
        unitAmount: 6900,
      },
      usd: {
        currency: "usd",
        unitAmount: 1999,
      },
    },
  },
    consultation: {
    code: "consultation",
    name: "Personal Astrology Consultation",
    description:
      "A personalised one-on-one Vedic astrology consultation based on your birth chart, life circumstances and specific questions.",
    mode: "payment",
    stripePriceId: "price_1Tzcm5RyK8MNzHdLwASPTBPn",
    prices: {
      inr: {
        currency: "inr",
        unitAmount: 199900,
      },
      aed: {
        currency: "aed",
        unitAmount: 9900,
      },
      usd: {
        currency: "usd",
        unitAmount: 2500,
      },
    },
  },
};

export function isBillingProductCode(
  value: unknown
): value is BillingProductCode {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(BILLING_CATALOG, value)
  );
}

export function isBillingCurrency(
  value: unknown
): value is BillingCurrency {
  return value === "inr" || value === "aed" || value === "usd";
}

export function getBillingProduct(
  productCode: BillingProductCode
): BillingProduct {
  return BILLING_CATALOG[productCode];
}

export function getBillingPrice(
  productCode: BillingProductCode,
  currency: BillingCurrency
): ProductPrice {
  return BILLING_CATALOG[productCode].prices[currency];
}