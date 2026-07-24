"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const supabase = createClient();

      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/sarathi/reset-password`
          : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setSuccess(true);
      setMessage(
        "We’ve sent you a password reset link. Please check your email."
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
            href="/sarathi/login"
            className="text-sm astro-text-soft hover:text-foreground"
          >
            ← Back to sign in
          </Link>

          <h1 className="mt-6 text-3xl font-semibold text-foreground">
            Reset your password
          </h1>

          <p className="mt-3 text-sm leading-relaxed astro-text-soft">
            Enter the email address linked to your Sārathi account. We’ll send
            you a secure link to create a new password.
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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[color:var(--primary)] py-2.5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>

          {message ? (
            <p
              role="status"
              className={`mt-4 rounded-xl border p-3 text-sm ${
                success
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-[color:var(--border)] bg-white/50 astro-text-soft"
              }`}
            >
              {message}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}