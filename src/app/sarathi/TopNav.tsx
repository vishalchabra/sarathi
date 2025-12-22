"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/sarathi/chat", label: "Ask Sārathi" },
  { href: "/sarathi/life-guidance", label: "Guidance" },
  { href: "/sarathi/about", label: "About" },
];

export default function TopNav() {
  const pathname = usePathname() ?? "";

  return (
    <header 
    className="flex items-center justify-between border-b border-white/10 bg-slate-950/60 backdrop-blur px-6 py-3 text-slate-50">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-sm font-semibold tracking-wide text-indigo-100">
          <span className="text-indigo-300 drop-shadow-[0_0_12px_rgba(99,102,241,0.35)]">
            Sārathi
          </span>
        </Link>
        <span className="ml-3 text-[10px] text-rose-300">TOPNAV_V2</span>
        <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-200">
          Beta
        </span>
      </div>

      <nav className="flex items-center gap-4 text-xs sm:text-sm text-slate-200">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/sarathi/about" && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                "transition-colors " +
                (isActive
                  ? "text-indigo-200 border-b border-indigo-300 pb-0.5"
                  : "hover:text-indigo-200")
              }
            >
              {link.label}
            </Link>
          );
        })}

        {/* Single CTA button (so it doesn't feel duplicated as a menu item) */}
        <Link
          href="/sarathi/life-report"
          className="ml-2 rounded-xl border border-indigo-400/25 bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-100 hover:bg-indigo-500/20"
        >
          Life Report
        </Link>
      </nav>
    </header>
  );
}
