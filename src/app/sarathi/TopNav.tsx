"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    href: "/sarathi/about",
    label: "About Us",
  },
  {
    href: "/sarathi/why-sarathi",
    label: "Why Sārathi",
  },
  {
    href: "/sarathi/learn",
    label: "Knowledge Centre",
  },
  {
    href: "/sarathi/consultation",
    label: "Consultation",
    highlight: true,
  },
  {
    href: "/sarathi/faqs",
    label: "FAQs",
  },
  {
    href: "/sarathi/contact",
    label: "Contact",
  },
  {
    href: "/sarathi/privacy",
    label: "Privacy",
  },
  {
    href: "/sarathi/terms",
    label: "Terms",
  },
];

export default function TopNav() {
  const pathname = usePathname() ?? "";

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-start gap-12 px-4 py-4">
        <Link href="/sarathi" className="flex shrink-0 items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl astro-card">
            <span className="text-lg">✧</span>
          </div>

          <div className="leading-tight">
            <div className="font-semibold">Sārathi</div>
            <div className="text-xs astro-text-muted">
              The charioteer of your journey within
            </div>
          </div>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-5 text-sm text-foreground/75 lg:flex"
        >
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  link.highlight
                    ? "font-medium text-[color:var(--primary)] hover:opacity-80"
                    : active
                      ? "font-medium text-[color:var(--primary)]"
                      : "hover:text-foreground"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}