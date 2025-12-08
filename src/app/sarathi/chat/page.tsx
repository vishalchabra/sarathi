// FILE: src/app/sarathi/chat/page.tsx
"use client";

import dynamic from "next/dynamic";

// Load the banner only on the client
const LANBanner = dynamic(() => import("@/components/LANBanner"), {
  ssr: false,
});

// Load the ChatClient only on the client as well
const ChatClient = dynamic(() => import("./ChatClient"), {
  ssr: false,
  loading: () => (
    <div className="p-6 text-sm text-gray-600">Loading chat…</div>
  ),
});

export default function Page() {
  return (
    <>
      {/* Top of the page: your LAN / beta banner */}
      <LANBanner />

      {/* Main chat experience */}
      <ChatClient />
    </>
  );
}
