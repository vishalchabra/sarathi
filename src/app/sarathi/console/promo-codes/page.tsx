import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserEntitlements } from "@/server/auth/getUserEntitlements";
import TopNav from "../../TopNav";
import PromoCodeForm from "./promo-code-form-client";

export default async function ConsolePromoCodesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sarathi/login?next=/sarathi/console/promo-codes");
  }

  const entitlements = await getUserEntitlements(user.id);

 if (entitlements.role !== "admin") {
  redirect("/sarathi");
}

  const { data: promoCodes } = await supabase
    .from("promo_codes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen astro-bg text-foreground">
      <TopNav />

      <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <div className="rounded-3xl astro-card p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--primary)]">
            Sārathi Console
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            Promo Codes
          </h1>

          <p className="mt-2 text-sm text-slate-700">
            Create and manage promotional discounts for Sārathi products.
          </p>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[380px_1fr]">
          <PromoCodeForm />

          <div className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white/80 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[color:var(--border)] bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Discount</th>
                  <th className="px-4 py-3">Applies To</th>
                  <th className="px-4 py-3">Usage</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {(promoCodes ?? []).map((code: any) => (
                  <tr
                    key={code.id}
                    className="border-b border-[color:var(--border)] last:border-b-0"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">
                        {code.code}
                      </div>
                      <div className="text-xs text-slate-500">
                        {code.description || "—"}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {code.discount_type === "percent"
                        ? `${code.discount_value}%`
                        : `₹${code.discount_value}`}
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {code.applies_to}
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {code.redeemed_count ?? 0}
                      {code.max_redemptions
                        ? ` / ${code.max_redemptions}`
                        : ""}
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
                        {code.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {!promoCodes?.length ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      No promo codes yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}