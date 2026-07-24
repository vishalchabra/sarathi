import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TopNav from "../TopNav";
import ConsultationForm from "./consultation-form";

export default async function ConsultationPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sarathi/login?next=/sarathi/consultation");
  }

  return (
    <div className="min-h-screen astro-bg text-foreground">
      <TopNav />
      <main className="mx-auto max-w-4xl px-4 py-8 md:py-10">
        <ConsultationForm />
      </main>
    </div>
  );
}