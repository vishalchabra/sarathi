"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductEditor({ product }: { product: any }) {
  const router = useRouter();

  const [price, setPrice] = useState(String(product.price_inr ?? 0));
  const [status, setStatus] = useState(product.status ?? "active");
  const [description, setDescription] = useState(product.description ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function saveProduct() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          price_inr: Number(price),
          status,
          description,
        }),
      });

      const json = await res.json();

      if (!res.ok || json?.ok === false) {
        throw new Error(json?.error || "Failed to update product.");
      }

      setMessage("Saved.");
      router.refresh();
    } catch (e: any) {
      setMessage(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="text-lg font-semibold text-slate-900">
            {product.name}
          </div>

          <div className="mt-1 text-xs text-slate-500">
            {product.product_code} · {product.product_type}
          </div>

          {product.credits_granted ? (
            <div className="mt-2 text-xs text-slate-600">
              Credits: {product.credits_granted}
            </div>
          ) : null}

          {product.duration_minutes ? (
            <div className="mt-2 text-xs text-slate-600">
              Duration: {product.duration_minutes} minutes
            </div>
          ) : null}

          {product.billing_interval ? (
            <div className="mt-2 text-xs text-slate-600">
              Billing: {product.billing_interval}
            </div>
          ) : null}
        </div>

        <div className="grid gap-3 md:w-[440px] md:grid-cols-[120px_140px_1fr]">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Price INR
            </label>
            <input
              type="number"
              min="0"
              className="w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Status
            </label>
            <select
              className="w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={saveProduct}
              disabled={loading}
              className="w-full rounded-xl bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs font-medium text-slate-700">
          Description
        </label>
        <textarea
          className="min-h-20 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {message ? (
        <div className="mt-3 text-sm text-slate-700">{message}</div>
      ) : null}
    </div>
  );
}