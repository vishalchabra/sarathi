import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createSEO } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { getUserEntitlements } from "@/server/auth/getUserEntitlements";

import TopNav from "../TopNav";
import LifeReportShell from "./_shell";
export const metadata: Metadata = createSEO({
  title: "AI Vedic Astrology Life Report",
  description:
    "Generate your personalised AI-powered Vedic Astrology Life Report. Understand your birth chart, dashas, transits, strengths, challenges and upcoming life phases with practical guidance.",
  path: "/sarathi/life-report",
  keywords: [
    "Vedic Astrology Life Report",
    "AI Life Report",
    "Birth Chart Report",
    "Personalised Kundli Report",
    "Dasha Analysis",
    "Transit Analysis",
    "Astrology Report",
    "Jyotish Report",
  ],
});
export default async function LifeReportPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sarathi/individual/login?next=/sarathi/life-report");
  }

  const entitlements = await getUserEntitlements(user.id);

  if (!entitlements.lifeReport.allowed) {
    redirect("/sarathi/upgrade?feature=life-report");
  }

  return (
    <div className="min-h-screen astro-bg text-foreground">
      <TopNav />
      <main className="mx-auto max-w-5xl px-4 py-8 md:py-10">
        <LifeReportShell />
      </main>
    </div>
  );
}