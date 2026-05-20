import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import TopNav from "../TopNav";
import LifeReportShell from "./_shell";

export default async function LifeReportPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
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