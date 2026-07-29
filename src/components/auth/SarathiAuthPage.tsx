"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type AccountType = "individual" | "astrologer";

type SarathiAuthPageProps = {
  accountType: AccountType;
  defaultNext: string;
  title: string;
  description: string;
  loginDescription: string;
  signupDescription: string;
};

function safeNextPath(value: string | null, fallback: string) {
  if (!value) return fallback;

  // Only allow internal Sārathi routes.
  if (!value.startsWith("/sarathi")) return fallback;

  // Prevent login redirect loops.
  if (
    value.startsWith("/sarathi/login") ||
    value.startsWith("/sarathi/individual/login") ||
    value.startsWith("/sarathi/astrologers/login")
  ) {
    return fallback;
  }

  return value;
}

function AuthContent({
  accountType,
  defaultNext,
  title,
  description,
  loginDescription,
  signupDescription,
}: SarathiAuthPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextPath = safeNextPath(
  searchParams?.get("next") ?? null,
  defaultNext
);

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const supabase = createClient();

      if (mode === "signup") {
        const emailRedirectTo =
          typeof window !== "undefined"
            ? `${window.location.origin}/sarathi/auth/confirmed?next=${encodeURIComponent(
                nextPath
              )}`
            : undefined;

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo,
            data: {
              account_type: accountType,
            },
          },
        });

        if (error) {
          setMessage(error.message);
          return;
        }

        setMessage(
          "Account created. Please check your email to confirm your account."
        );

        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

     if (error) {
  setMessage(error.message);
  return;
}

/*
 * Send the welcome email after the user's first successful sign-in.
 * This request is deliberately non-blocking for the login experience:
 * an email failure must not prevent access to Sārathi.
 */
try {
  const welcomeResponse = await fetch("/api/auth/welcome-email", {
    method: "POST",
  });

  if (!welcomeResponse.ok) {
    console.error(
      "Welcome email request failed:",
      await welcomeResponse.text()
    );
  }
} catch (welcomeEmailError) {
  console.error(
    "Welcome email request failed:",
    welcomeEmailError
  );
}

router.replace(nextPath);
router.refresh();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="astro-bg fixed inset-0 overflow-y-auto text-foreground">
      <section className="mx-auto min-h-full w-full max-w-6xl px-4 py-16">
        <div className="grid w-full gap-8 md:grid-cols-[1fr_420px] md:items-start">
          <div className="hidden md:block">
            <Link
              href="/sarathi"
              className="text-sm astro-text-soft hover:text-foreground"
            >
              ← Back to Sārathi
            </Link>

            <h1 className="mt-8 text-5xl font-semibold leading-tight">
              {title}{" "}
              <span className="text-[color:var(--primary)]">Sārathi.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed astro-text-soft">
              {description}
            </p>
          </div>

          <div className="rounded-3xl astro-card p-6 shadow-xl">
            <div className="md:hidden">
              <Link
                href="/sarathi"
                className="text-sm astro-text-soft hover:text-foreground"
              >
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
              {mode === "login" ? loginDescription : signupDescription}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Email
                </label>

                <input
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-xl border border-[color:var(--border)] bg-white/70 px-3 py-2 text-foreground outline-none focus:border-[color:var(--primary)]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="block text-sm font-medium text-foreground">
                    Password
                  </label>

                  {mode === "login" ? (
                    <Link
                      href="/sarathi/forgot-password"
                      className="text-xs font-medium text-[color:var(--primary)] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  ) : null}
                </div>

                <input
                  type="password"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  minLength={6}
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

export default function SarathiAuthPage(props: SarathiAuthPageProps) {
  return (
    <Suspense fallback={null}>
      <AuthContent {...props} />
    </Suspense>
  );
}