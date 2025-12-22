"use client";

import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex items-center gap-4 p-4 text-sm text-slate-300">
      {/* Info pages first */}
      <Link href="/about" className="hover:text-slate-50">
        About
      </Link>
      <Link href="/my-story" className="hover:text-slate-50">
        My Story
      </Link>
      <Link href="/why-sarathi" className="hover:text-slate-50">
        Why Sārathi
      </Link>
      <Link href="/faqs" className="hover:text-slate-50">
        FAQs
      </Link>

      <span className="mx-1 h-4 w-px bg-slate-800/80" />

      {/* Product pages next */}
      <Link href="/sarathi/life-report" className="hover:text-slate-50">
        Life Report
      </Link>
      <Link href="/sarathi/chat" className="hover:text-slate-50">
        Ask Sārathi
      </Link>

      {/* Optional: keep guidance hidden from main nav for now */}
      {/* <Link href="/sarathi/life-guidance" className="hover:text-slate-50">
        Guidance
      </Link> */}
    </nav>
  );
}
