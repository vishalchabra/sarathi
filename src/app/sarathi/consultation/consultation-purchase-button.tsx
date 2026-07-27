"use client";

import { useState } from "react";

type BillingCurrency = "inr" | "aed" | "usd";

const CURRENCY_OPTIONS: Array<{
  value: BillingCurrency;
  label: string;
  price: string;
}> = [
  {
    value: "inr",
    label: "India",
    price: "₹1,999",
  },
  {
    value: "aed",
    label: "UAE",
    price: "AED 99",
  },
  {
    value: "usd",
    label: "International",
    price: "USD 20",
  },
];

export default function ConsultationPurchaseButton() {
  const [currency, setCurrency] =
    useState<BillingCurrency>("aed");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productCode: "consultation",
          currency,
        }),
      });

      const result = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !result.url) {
        throw new Error(
          result.error ?? "Unable to start payment."
        );
      }

      window.location.href = result.url;
    } catch (checkoutError) {
      const message =
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to start payment.";

      setError(message);
      setLoading(false);
    }
  }

  const selectedOption = CURRENCY_OPTIONS.find(
    (option) => option.value === currency
  );

  return (
    <div className="mx-auto max-w-md">
      <label
        htmlFor="consultation-currency"
        className="mb-2 block text-left text-sm font-medium text-foreground"
      >
        Select your payment currency
      </label>

      <select
        id="consultation-currency"
        value={currency}
        disabled={loading}
        onChange={(event) =>
          setCurrency(event.target.value as BillingCurrency)
        }
        className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-4 py-3 text-sm text-foreground outline-none focus:border-[color:var(--primary)]"
      >
        {CURRENCY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label} — {option.price}
          </option>
        ))}
      </select>

      <button
        type="button"
        disabled={loading}
        onClick={startCheckout}
        className="mt-4 w-full rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Redirecting to secure payment..."
          : `Book Consultation — ${
              selectedOption?.price ?? ""
            }`}
      </button>

      {error ? (
        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}