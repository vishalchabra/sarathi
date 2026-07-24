import Link from "next/link";
import type { ReactNode } from "react";

type ConsoleLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
};

const navItems = [
  {
    label: "Dashboard",
    href: "/sarathi/console",
  },
  {
    label: "Users",
    href: "/sarathi/console/users",
  },
  {
    label: "Products",
    href: "/sarathi/console/products",
  },
  {
    label: "Promo Codes",
    href: "/sarathi/console/promo-codes",
  },
  {
    label: "Payments",
    href: "/sarathi/console/payments",
  },
  {
    label: "Consultations",
    href: "/sarathi/console/consultations",
  },
  {
    label: "Wallets",
    href: "/sarathi/console/wallets",
  },
  {
    label: "Analytics",
    href: "/sarathi/console/analytics",
  },
  {
    label: "Settings",
    href: "/sarathi/console/settings",
  },
];

export default function ConsoleLayout({
  title,
  description,
  children,
  actions,
}: ConsoleLayoutProps) {
  return (
    <div className="min-h-screen astro-bg text-foreground">
      <div className="mx-auto grid min-h-screen max-w-[1500px] md:grid-cols-[240px_1fr]">
        <aside className="border-r border-[color:var(--border)] bg-white/80 p-4 backdrop-blur">
          <Link href="/sarathi" className="block rounded-2xl p-3">
            <div className="text-lg font-semibold text-slate-900">
              Sārathi Console
            </div>

            <div className="mt-1 text-xs text-slate-500">
              Operations and administration
            </div>
          </Link>

          <nav className="mt-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 border-t border-[color:var(--border)] pt-4">
            <Link
              href="/sarathi"
              className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Back to Sārathi
            </Link>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-[color:var(--border)] bg-white/85 backdrop-blur">
            <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 md:px-8">
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  {title}
                </h1>

                {description ? (
                  <p className="mt-1 text-sm text-slate-600">
                    {description}
                  </p>
                ) : null}
              </div>

              {actions ? (
                <div className="flex items-center gap-3">{actions}</div>
              ) : null}
            </div>
          </header>

          <main className="px-4 py-6 md:px-8 md:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}