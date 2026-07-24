"use client";

import { useState } from "react";

export default function ConsultationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [duration, setDuration] = useState("60");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [timezone, setTimezone] = useState("Asia/Dubai");
  const [focus, setFocus] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/consultation-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          duration_minutes: Number(duration),
          preferred_date: preferredDate,
          preferred_time: preferredTime,
          timezone,
          question_or_focus: focus,
        }),
      });

      const json = await res.json();

      if (!res.ok || json?.ok === false) {
        throw new Error(json?.error || "Failed to submit booking request.");
      }

      setMessage(
        "Your consultation request has been received. We’ll contact you shortly to confirm the slot."
      );

      setName("");
      setEmail("");
      setPhone("");
      setDuration("60");
      setPreferredDate("");
      setPreferredTime("");
      setTimezone("Asia/Dubai");
      setFocus("");
    } catch (e: any) {
      setMessage(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl astro-card p-6 shadow-sm ring-1 ring-black/5">
      <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--primary)]">
        One-on-One Consultation
      </p>

      <h1 className="mt-3 text-3xl font-semibold text-slate-900">
        Book a personal Sārathi consultation
      </h1>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
        Share your preferred date, time and focus area. Once payments are live,
        this flow will collect payment before confirmation. For now, it records
        the request so we can manage bookings manually.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-900">
              Name
            </label>
            <input
              className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-900">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-900">
              Phone / WhatsApp
            </label>
            <input
              className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+971..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-900">
              Duration
            </label>
            <select
              className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-900">
              Preferred Date
            </label>
            <input
              type="date"
              className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-900">
              Preferred Time
            </label>
            <input
              type="time"
              className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-900">
              Timezone
            </label>
            <select
              className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option value="Asia/Dubai">Dubai / UAE</option>
              <option value="Asia/Kolkata">India</option>
              <option value="Europe/London">UK</option>
              <option value="America/New_York">US Eastern</option>
              <option value="America/Los_Angeles">US Pacific</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-900">
              What would you like to discuss?
            </label>
            <textarea
              className="min-h-28 w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              placeholder="Career, marriage, relationship, health, finance, timing, relocation, etc."
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[color:var(--primary)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Request Consultation"}
        </button>
      </form>

      {message ? (
        <div className="mt-5 rounded-2xl border border-[color:var(--border)] bg-white/70 p-4 text-sm text-slate-800">
          {message}
        </div>
      ) : null}
    </div>
  );
}