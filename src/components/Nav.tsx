"use client";

import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex gap-4 p-4 text-sm">
      <Link href="/">Home</Link>
      <Link href="/sarathi/life-report">Life Report</Link>
      <Link href="/sarathi/life-guidance">Life Guidance</Link>
      <Link href="/sarathi/chat">Chat</Link>
      {/* Keep tools reachable later if you want, but hide from main nav for now */}
      {/* <Link href="/sarathi/tools/birth-chart-reader">Birth-Chart Reader</Link>
      <Link href="/sarathi/tools/charts">Charts (D1/D9)</Link> */}
    </nav>
  );
}
