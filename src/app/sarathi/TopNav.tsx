"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/sarathi/chat", label: "Ask Sārathi" },
  { href: "/sarathi/focused-reports", label: "Guidance" },
  { href: "/sarathi/about", label: "About" },
];

export default function TopNav() {
  const pathname = usePathname() ?? "";

  return (
    <header 
    className="flex items-center justify-between border-b border-[color:var(--border)] bg-white/70 backdrop-blur-xl px-6 py-3 text-foreground">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-sm font-semibold tracking-wide text-foreground">
          <span className="text-[color:var(--primary)] drop-shadow-[0_0_12px_rgba(99,102,241,0.35)]">
            Sārathi
          </span>
        </Link>
        
        <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--primary)]/10 px-2 py-0.5 text-[10px] font-medium text-[color:var(--primary)]">
          Beta
        </span>
      </div>

      <nav className="flex items-center gap-4 text-xs sm:text-sm text-foreground/70">
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
  ? "text-[color:var(--primary)] border-b border-[color:var(--primary)] pb-0.5"
  : "hover:text-foreground")
              }
            >
              {link.label}
            </Link>
          );
        })}

        {/* Single CTA button (so it doesn't feel duplicated as a menu item) */}
        <Link
          href="/sarathi/life-report"
          className="ml-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--primary)] px-3 py-1 text-xs font-medium text-white shadow-sm hover:opacity-90"
        >
          Life Report
        </Link>
      </nav>
    </header>
  );
}
