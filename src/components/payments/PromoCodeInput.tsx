"use client";

import { useState } from "react";

type AppliedPromo = {
  code: string;
  discountAmount: number;
  finalAmount: number;
};

type PromoCodeInputProps = {
  product: string;
  amount: number;
  onApplied: (promo: AppliedPromo | null) => void;
};

export default function PromoCodeInput({
  product,
  amount,
  onApplied,
}: PromoCodeInputProps) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [appliedCode, setAppliedCode] = useState("");

  async function applyPromoCode() {
    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode) {
      setMessage("Enter a promo code.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/promo-codes/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: normalizedCode,
          product,
          amount,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "This promo code is not valid.");
      }

      setAppliedCode(normalizedCode);
      setMessage(`Promo code applied. You save ₹${result.discountAmount}.`);

      onApplied({
        code: normalizedCode,
        discountAmount: result.discountAmount,
        finalAmount: result.finalAmount,
      });
    } catch (error) {
      setAppliedCode("");
      onApplied(null);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to apply the promo code."
      );
    } finally {
      setLoading(false);
    }
  }

  function removePromoCode() {
    setCode("");
    setAppliedCode("");
    setMessage("");
    onApplied(null);
  }

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/50 p-4">
      <label
        htmlFor="promo-code"
        className="text-sm font-semibold text-foreground"
      >
        Have a promo code?
      </label>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          id="promo-code"
          type="text"
          value={code}
          onChange={(event) => {
            setCode(event.target.value.toUpperCase());

            if (appliedCode) {
              setAppliedCode("");
              setMessage("");
              onApplied(null);
            }
          }}
          placeholder="Enter promo code"
          disabled={loading || Boolean(appliedCode)}
          className="min-w-0 flex-1 rounded-xl border border-[color:var(--border)] bg-white px-4 py-2.5 text-sm uppercase text-foreground outline-none focus:border-[color:var(--primary)] disabled:opacity-60"
        />

        {appliedCode ? (
          <button
            type="button"
            onClick={removePromoCode}
            className="rounded-xl border border-[color:var(--border)] px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-white"
          >
            Remove
          </button>
        ) : (
          <button
            type="button"
            onClick={applyPromoCode}
            disabled={loading}
            className="rounded-xl bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Applying..." : "Apply"}
          </button>
        )}
      </div>

      {message && (
        <p
          className={
            "mt-2 text-xs " +
            (appliedCode ? "text-emerald-700" : "text-red-600")
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}