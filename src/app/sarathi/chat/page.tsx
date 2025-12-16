// FILE: src/app/sarathi/chat/page.tsx

import TopNav from "../TopNav";
import AstroChatPage from "@/app/chat/page";

export default function SarathiChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950 text-slate-50">
      <TopNav />

      <main className="mx-auto max-w-5xl px-4 py-6 md:py-8">
        <AstroChatPage />
      </main>
    </div>
  );
}
