import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserEntitlements } from "@/server/auth/getUserEntitlements";

import ChatClient from "./ChatClient";

export default async function SarathiChatPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sarathi/individual/login?next=/sarathi/chat");
  }

  const entitlements = await getUserEntitlements(user.id);

  if (!entitlements.individualAccess) {
    redirect("/sarathi/upgrade?feature=ask-sarathi");
  }

  return (
    <main className="min-h-screen astro-card text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-8">
        <ChatClient />
      </div>
    </main>
  );
}