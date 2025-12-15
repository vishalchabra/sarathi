"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/sarathi/life-report", label: "Life Report" },
  { href: "/sarathi/life-guidance", label: "Life Guidance" },
  { href: "/sarathi/chat", label: "Chat" },
  { href: "/sarathi/about", label: "About" },
];

export default function TopNav() {
  const pathname = usePathname() ?? "";

  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-3 text-slate-50">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold tracking-wide">
          AstroSÄrathi
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
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
      </nav>
    </header>
  );
}

