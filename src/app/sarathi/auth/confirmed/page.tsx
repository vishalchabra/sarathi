"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function safeNextPath(value: string | null) {
  if (!value) return "/sarathi/life-report";
  if (!value.startsWith("/sarathi")) return "/sarathi/life-report";
  if (value.startsWith("/sarathi/login")) return "/sarathi/life-report";
  return value;
}

function ConfirmedContent() {
  const searchParams = useSearchParams();

  const nextPath = useMemo(
    () => safeNextPath(searchParams?.get("next") ?? null),
    [searchParams]
  );

  return (
    <main className="astro-bg min-h-screen text-foreground">
      <section className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
        <div className="rounded-3xl astro-card p-8 text-center shadow-xl">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[color:var(--primary)] text-white">
            ✓
          </div>

          <h1 className="mt-5 text-2xl font-semibold">
            Account confirmed
          </h1>

          <p className="mt-3 text-sm leading-relaxed astro-text-soft">
            Your Sārathi account has been activated. You can now sign in and continue.
          </p>

          <Link
  href={`${
    nextPath.startsWith("/sarathi/data-engine")
      ? "/sarathi/astrologers/login"
      : "/sarathi/individual/login"
  }?next=${encodeURIComponent(nextPath)}`}
  className="mt-6 inline-flex rounded-full bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
>
  Continue to sign in
</Link>
        </div>
      </section>
    </main>
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmedContent />
    </Suspense>
  );
}