"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setSessionReady(true);
      }
    }

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setSessionReady(true);
        setInvalidLink(false);
      }

      if (session) {
        setSessionReady(true);
      }
    });

    const timeout = window.setTimeout(() => {
      setSessionReady((ready) => {
        if (!ready) {
          setInvalidLink(true);
        }

        return ready;
      });
    }, 4000);

    return () => {
      window.clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("Your password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      router.replace(
        "/sarathi/login?message=" +
          encodeURIComponent(
            "Your password has been updated. Please sign in."
          )
      );
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="astro-bg fixed inset-0 overflow-y-auto text-foreground">
      <section className="mx-auto flex min-h-full w-full max-w-md items-center px-4 py-12">
        <div className="w-full rounded-3xl astro-card p-6 shadow-xl sm:p-8">
          <Link
            href="/sarathi"
            className="text-sm astro-text-soft hover:text-foreground"
          >
            ← Back to Sārathi
          </Link>

          <h1 className="mt-6 text-3xl font-semibold text-foreground">
            Create a new password
          </h1>

          <p className="mt-3 text-sm leading-relaxed astro-text-soft">
            Choose a secure password for your Sārathi account.
          </p>

          {!sessionReady && !invalidLink ? (
            <p className="mt-6 rounded-xl border border-[color:var(--border)] bg-white/50 p-3 text-sm astro-text-soft">
              Verifying your reset link...
            </p>
          ) : null}

          {invalidLink ? (
            <div className="mt-6">
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                This password reset link is invalid or has expired.
              </p>

              <Link
                href="/sarathi/forgot-password"
                className="mt-4 inline-flex w-full justify-center rounded-xl bg-[color:var(--primary)] px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Request another link
              </Link>
            </div>
          ) : null}

          {sessionReady ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  New password
                </label>

                <input
                  type="password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-[color:var(--border)] bg-white/70 px-3 py-2 text-foreground outline-none focus:border-[color:var(--primary)]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Confirm new password
                </label>

                <input
                  type="password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-[color:var(--border)] bg-white/70 px-3 py-2 text-foreground outline-none focus:border-[color:var(--primary)]"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[color:var(--primary)] py-2.5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Updating..." : "Update password"}
              </button>
            </form>
          ) : null}

          {message ? (
            <p className="mt-4 rounded-xl border border-[color:var(--border)] bg-white/50 p-3 text-sm astro-text-soft">
              {message}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}