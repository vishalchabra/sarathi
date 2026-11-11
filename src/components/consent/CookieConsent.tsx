"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export type ConsentPreferences = {
  analytics: boolean;
  marketing: boolean;
};

export const CONSENT_KEY = "sarathi_cookie_consent_v1";
export const CONSENT_EVENT = "sarathi:consent-updated";

export function readConsent(): ConsentPreferences | null {
  try {
    const saved = localStorage.getItem(CONSENT_KEY);
    if (!saved) return null;

    const parsed: unknown = JSON.parse(saved);

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "analytics" in parsed &&
      "marketing" in parsed &&
      typeof parsed.analytics === "boolean" &&
      typeof parsed.marketing === "boolean"
    ) {
      return {
        analytics: parsed.analytics,
        marketing: parsed.marketing,
      };
    }
  } catch {
    // Invalid or unavailable storage.
  }

  return null;
}

export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentPreferences | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [manage, setManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const saved = readConsent();

    setConsent(saved);
    setAnalytics(saved?.analytics ?? false);
    setMarketing(saved?.marketing ?? false);
    setReady(true);

    const openPreferences = () => {
      setManage(true);
      setOpen(true);
    };

    window.addEventListener("sarathi:open-cookie-preferences", openPreferences);

    return () => {
      window.removeEventListener(
        "sarathi:open-cookie-preferences",
        openPreferences
      );
    };
  }, []);

  function save(preferences: ConsentPreferences) {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(preferences));
    } catch {
      // Preferences still apply for this page session.
    }

    setConsent(preferences);
    setAnalytics(preferences.analytics);
    setMarketing(preferences.marketing);
    setOpen(false);
    setManage(false);

    window.dispatchEvent(
      new CustomEvent(CONSENT_EVENT, { detail: preferences })
    );
  }

  if (!ready) return null;

  if (consent && !open) {
    return (
      <button
        type="button"
        onClick={() => {
          setManage(true);
          setOpen(true);
        }}
        className="fixed bottom-3 left-3 z-[90] rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-lg"
      >
        Cookie preferences
      </button>
    );
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-2xl">
      <h2 className="text-base font-semibold">
        Your privacy matters
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Sārathi uses essential technologies to operate the website.
        With your permission, we also use Google Analytics to understand
        website usage and Meta Pixel to measure advertising performance.
        You can change your choices anytime.
      </p>

      <p className="mt-2 text-xs text-slate-500">
        Read our{" "}
        <Link
          href="/sarathi/privacy"
          className="font-medium text-indigo-700 underline"
        >
          Privacy Policy
        </Link>.
      </p>

      {manage && (
        <div className="mt-4 space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span>Essential cookies</span>
            <span className="text-xs text-slate-500">Always active</span>
          </div>

          <label className="flex items-center justify-between gap-3">
            <span>Analytics</span>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(event) => setAnalytics(event.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between gap-3">
            <span>Marketing</span>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(event) => setMarketing(event.target.checked)}
            />
          </label>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => save({ analytics: true, marketing: true })}
          className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white"
        >
          Accept All
        </button>

        <button
          type="button"
          onClick={() => save({ analytics: false, marketing: false })}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium"
        >
          Reject Optional
        </button>

        {manage ? (
          <button
            type="button"
            onClick={() => save({ analytics, marketing })}
            className="rounded-lg border border-indigo-300 px-4 py-2 text-sm font-medium text-indigo-700"
          >
            Save Preferences
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setManage(true)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium"
          >
            Manage Preferences
          </button>
        )}
      </div>
    </div>
  );
}
