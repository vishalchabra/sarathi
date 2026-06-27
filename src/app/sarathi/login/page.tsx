"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function safeNextPath(value: string | null) {
  if (!value) return "/sarathi/life-report";

  // only allow internal Sarathi routes
  if (!value.startsWith("/sarathi")) return "/sarathi/life-report";

  // avoid redirecting back to login
  if (value.startsWith("/sarathi/login")) return "/sarathi/life-report";

  return value;
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextPath = useMemo(
    () => safeNextPath(searchParams?.get("next") ?? null),
    [searchParams]
  );

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const supabase = createClient();

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo:
  typeof window !== "undefined"
    ? `${window.location.origin}/sarathi/auth/confirmed?next=${encodeURIComponent(nextPath)}`
    : undefined,
          },
        });

        if (error) {
          setMessage(error.message);
        } else {
          setMessage(
  "Account created. Please check your email to confirm your account."
);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setMessage(error.message);
        } else {
          router.push(nextPath);
          router.refresh();
        }
      }
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

 return (
  <main className="astro-bg fixed inset-0 overflow-hidden text-foreground">
    <section className="mx-auto h-full w-full max-w-6xl px-4 pt-16">
      <div className="grid w-full gap-8 md:grid-cols-[1fr_420px] md:items-start">
          <div className="hidden md:block">
            <Link href="/sarathi" className="text-sm astro-text-soft hover:text-foreground">
              ← Back to Sārathi
            </Link>

            <h1 className="mt-8 text-5xl font-semibold leading-tight">
              Welcome to{" "}
              <span className="text-[color:var(--primary)]">Sārathi.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed astro-text-soft">
              Sign in to continue to your Sārathi workspace.
            </p>
          </div>

          <div className="rounded-3xl astro-card p-6 shadow-xl">
            <div className="md:hidden">
              <Link href="/sarathi" className="text-sm astro-text-soft hover:text-foreground">
                ← Back to Sārathi
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 rounded-2xl bg-white/50 p-1 md:mt-0">
  <button
    type="button"
    onClick={() => {
      setMode("login");
      setMessage("");
    }}
    className={
      "rounded-xl px-4 py-2 text-sm font-semibold transition " +
      (mode === "login"
        ? "bg-[color:var(--primary)] text-white shadow-sm"
        : "text-slate-500 hover:text-slate-900")
    }
  >
    Sign in
  </button>

  <button
    type="button"
    onClick={() => {
      setMode("signup");
      setMessage("");
    }}
    className={
      "rounded-xl px-4 py-2 text-sm font-semibold transition " +
      (mode === "signup"
        ? "bg-[color:var(--primary)] text-white shadow-sm"
        : "text-slate-500 hover:text-slate-900")
    }
  >
    Create account
  </button>
</div>

<h2 className="mt-5 text-2xl font-semibold text-foreground">
  {mode === "login" ? "Welcome back" : "Create your account"}
</h2>

<p className="mt-2 text-sm astro-text-soft">
  {mode === "login"
    ? "Sign in to continue to your selected Sārathi tool."
    : "Create your account. We’ll send you an email confirmation link."}
</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-[color:var(--border)] bg-white/70 px-3 py-2 text-foreground outline-none focus:border-[color:var(--primary)]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-xl border border-[color:var(--border)] bg-white/70 px-3 py-2 text-foreground outline-none focus:border-[color:var(--primary)]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[color:var(--primary)] py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {loading
                  ? "Please wait..."
                  : mode === "login"
                  ? "Sign in"
                  : "Create account"}
              </button>
            </form>

            {message ? (
              <p className="mt-4 rounded-xl border border-[color:var(--border)] bg-white/50 p-3 text-sm astro-text-soft">
                {message}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}