import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

import TopNav from "../TopNav";
import ConsultationForm from "./consultation-form";
import ConsultationPurchaseButton from "./consultation-purchase-button";
export const metadata: Metadata = {
  title: "Personal Astrology Consultation",
  description:
    "Access your Sārathi consultation booking and submit your birth details, preferred schedule and consultation question.",
  robots: {
    index: false,
    follow: false,
  },
};
export default async function ConsultationPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/sarathi/individual/login?next=/sarathi/consultation"
    );
  }

  const initialName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    "";

  const initialEmail = user.email ?? "";

  /*
   * Find one unused paid consultation.
   * Only an available entitlement allows the user to see the form.
   */
  const {
    data: consultationEntitlement,
    error: entitlementError,
  } = await supabaseAdmin
    .from("consultation_entitlements")
    .select("id, status, purchased_at")
    .eq("user_id", user.id)
    .eq("status", "available")
    .order("purchased_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (entitlementError) {
    console.error(
      "Unable to check consultation entitlement:",
      entitlementError
    );
  }

  const hasAvailableConsultation =
    Boolean(consultationEntitlement) && !entitlementError;

  return (
    <div className="min-h-screen astro-bg text-foreground">
      <TopNav />

      <main className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <section className="rounded-3xl astro-card p-6 shadow-sm md:p-10">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-widest astro-text-muted">
              Personal guidance
            </div>

            <h1 className="mt-4 text-3xl font-semibold leading-tight text-foreground md:text-5xl">
              One-on-One Consultation
            </h1>

            <p className="mt-5 text-base leading-relaxed astro-text-soft md:text-lg">
              A focused personal consultation to help you understand your birth
              chart, current dasha, important life decisions and the timing of
              opportunities and challenges ahead.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Career and professional growth",
              "Marriage and relationships",
              "Business and financial decisions",
              "Property and relocation",
              "Important timing periods",
              "Personal and spiritual direction",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[color:var(--border)] bg-white/60 px-4 py-4 text-sm astro-text-soft"
              >
                <div className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[color:var(--primary)]" />
                  <span>{item}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {hasAvailableConsultation && consultationEntitlement ? (
          <section className="mt-8">
            <ConsultationForm
              initialName={initialName}
              initialEmail={initialEmail}
              entitlementId={consultationEntitlement.id}
            />
          </section>
        ) : (
          <section className="mt-8 rounded-3xl astro-card p-6 shadow-sm md:p-10">
            <div className="mx-auto max-w-2xl text-center">
              <div className="text-xs font-semibold uppercase tracking-widest astro-text-muted">
                Book your consultation
              </div>

              <h2 className="mt-3 text-2xl font-semibold text-foreground md:text-3xl">
                Personal Astrology Consultation
              </h2>

              <p className="mt-4 leading-relaxed astro-text-soft">
                Complete the payment to unlock the consultation form. You will
                then be able to provide your birth details, preferred schedule
                and the main question you would like to discuss.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[color:var(--border)] bg-white/60 px-4 py-4">
                  <div className="text-xs astro-text-muted">India</div>
                  <div className="mt-1 text-xl font-semibold text-foreground">
                    ₹1,999
                  </div>
                </div>

                <div className="rounded-2xl border border-[color:var(--border)] bg-white/60 px-4 py-4">
                  <div className="text-xs astro-text-muted">UAE</div>
                  <div className="mt-1 text-xl font-semibold text-foreground">
                    AED 99
                  </div>
                </div>

                <div className="rounded-2xl border border-[color:var(--border)] bg-white/60 px-4 py-4">
                  <div className="text-xs astro-text-muted">
                    International
                  </div>
                  <div className="mt-1 text-xl font-semibold text-foreground">
                    USD 20
                  </div>
                </div>
              </div>

              <div className="mt-7">
                <ConsultationPurchaseButton />
              </div>

              <p className="mt-4 text-xs leading-relaxed astro-text-muted">
                After successful payment, you will return here to complete your
                consultation request.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}