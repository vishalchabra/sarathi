import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import TopNav from "../TopNav";
import DailyGuidanceShell from "./_shell";

export const metadata: Metadata = {
  title: "Today's Guidance",
  description:
    "See your personalised daily Vedic astrology guidance based on your birth chart, current dasha and planetary movements.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DailyGuidancePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/sarathi/individual/login?next=/sarathi/daily-guidance"
    );
  }

  return (
    <div className="min-h-screen astro-bg text-foreground">
      <TopNav />

      <main className="mx-auto max-w-5xl px-4 py-8 md:py-10">
        <DailyGuidanceShell />
      </main>
    </div>
  );
}