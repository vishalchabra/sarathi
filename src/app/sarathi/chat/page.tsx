// FILE: src/app/sarathi/chat/page.tsx
import ChatClient from "./ChatClient";

export default function SarathiChatPage() {
  return (
    <main className="min-h-screen astro-card text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-8">
        <ChatClient />
      </div>
    </main>
  );
}
