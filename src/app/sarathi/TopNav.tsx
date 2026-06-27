"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/sarathi", label: "Home", public: true },
  { href: "/sarathi/individual", label: "Individuals", public: true },
  { href: "/sarathi/astrologers", label: "Astrologers", public: true },
  { href: "/sarathi/about", label: "About", public: true },
];

export default function TopNav() {
  const pathname = usePathname() ?? "";

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-white/75 px-4 py-3 text-foreground backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            href="/sarathi"
            className="text-sm font-semibold tracking-wide text-foreground"
          >
            <span className="text-[color:var(--primary)]">
              Sārathi
            </span>
          </Link>

          <span className="rounded-full bg-[#6E4BC6] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#5F3FB0]">
            Beta
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/sarathi/login?next=/sarathi/chat"
            className="hidden rounded-full astro-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-white/80 sm:inline-flex"
          >
            Ask Sārathi
          </Link>

          <Link
            href="/sarathi/login?next=/sarathi/life-report"
            className="rounded-full bg-[#6E4BC6] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#5F3FB0]"
          >
            Life Report
          </Link>
        </div>
      </div>
    </header>
  );
}