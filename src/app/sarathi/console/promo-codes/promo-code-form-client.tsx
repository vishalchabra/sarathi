"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PromoCodeForm() {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [appliesTo, setAppliesTo] = useState("all");
  const [maxRedemptions, setMaxRedemptions] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          description,
          discount_type: discountType,
          discount_value: Number(discountValue),
          applies_to: appliesTo,
          max_redemptions: maxRedemptions ? Number(maxRedemptions) : null,
          expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
        }),
      });

      const json = await res.json();

      if (!res.ok || json?.ok === false) {
        throw new Error(json?.error || "Failed to create promo code.");
      }

      setMessage("Promo code created.");
      setCode("");
      setDescription("");
      setDiscountType("percent");
      setDiscountValue("");
      setAppliesTo("all");
      setMaxRedemptions("");
      setExpiresAt("");

      router.refresh();
    } catch (e: any) {
      setMessage(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Create Promo Code
      </h2>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-900">
            Code
          </label>
          <input
            className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm uppercase text-slate-900 outline-none focus:border-[color:var(--primary)]"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="SARATHI25"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-900">
            Description
          </label>
          <input
            className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Launch offer"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-900">
              Discount Type
            </label>
            <select
              className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
            >
              <option value="percent">Percent</option>
              <option value="fixed">Fixed INR</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-900">
              Value
            </label>
            <input
              type="number"
              min="1"
              className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder="25"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-900">
            Applies To
          </label>
          <select
  className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
  value={appliesTo}
  onChange={(e) => setAppliesTo(e.target.value)}
>
            <option value="all">All Products</option>
<option value="life_report">Life Report</option>
<option value="ask_3">Ask Sārathi — 3 Insights</option>
<option value="ask_5">Ask Sārathi — 5 Insights</option>
<option value="ask_10">Ask Sārathi — 10 Insights</option>
<option value="ask_25">Ask Sārathi — 25 Insights</option>
<option value="data_engine_monthly">
  Data Engine — Monthly Subscription
</option>
<option value="consultation">Consultation</option>

          </select>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-900">
              Max Redemptions
            </label>
            <input
              type="number"
              min="1"
              className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
              value={maxRedemptions}
              onChange={(e) => setMaxRedemptions(e.target.value)}
              placeholder="100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-900">
              Expires At
            </label>
            <input
              type="datetime-local"
              className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[color:var(--primary)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Promo Code"}
        </button>
      </form>

      {message ? (
        <div className="mt-4 rounded-xl border border-[color:var(--border)] bg-white/70 p-3 text-sm text-slate-800">
          {message}
        </div>
      ) : null}
    </div>
  );
}