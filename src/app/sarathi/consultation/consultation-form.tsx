"use client";

import { useState } from "react";

type ConsultationFormProps = {
  initialName: string;
  initialEmail: string;
  entitlementId: string;
};

export default function ConsultationForm({
  initialName,
  initialEmail,
  entitlementId,
}: ConsultationFormProps) {
  const [phone, setPhone] = useState("");

  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthTimeAccuracy, setBirthTimeAccuracy] = useState("exact");

  const [consultationArea, setConsultationArea] = useState("");
  const [focus, setFocus] = useState("");
  const [backgroundContext, setBackgroundContext] = useState("");


  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setSuccess(false);
    setErrorMessage("");

    try {
      const res = await fetch("/api/consultation-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: initialName,
          customer_email: initialEmail,
          customer_phone: phone.trim(),

          birth_date: birthDate,
          birth_time: birthTime,
          birth_place: birthPlace.trim(),
          birth_time_accuracy: birthTimeAccuracy,

          consultation_area: consultationArea,
          question_or_focus: focus.trim(),
          background_context: backgroundContext.trim(),
          entitlement_id: entitlementId,
        }),
      });

      const json = await res.json();

      if (!res.ok || json?.ok === false) {
        throw new Error(
          json?.error || "Failed to submit consultation request."
        );
      }

      setSuccess(true);

      setPhone("");

      setBirthDate("");
      setBirthTime("");
      setBirthPlace("");
      setBirthTimeAccuracy("exact");

      setConsultationArea("");
      setFocus("");
      setBackgroundContext("");

    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl astro-card p-6 shadow-sm ring-1 ring-black/5 md:p-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--primary)]">
        Request your session
      </p>

      <h2 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">
        Tell us how we can help
      </h2>

      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">
        Share your birth details and the area you would like to explore.
        We will review your request and contact you with the earliest
        available consultation slot.
      </p>

      <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-white/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Booking for
        </p>

        <p className="mt-2 text-sm font-semibold text-slate-900">
          {initialName || "Sārathi user"}
        </p>

        <p className="mt-1 text-sm text-slate-600">{initialEmail}</p>
      </div>

      {success ? (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h3 className="text-lg font-semibold text-emerald-900">
            Your request has been received
          </h3>

          <p className="mt-2 text-sm leading-6 text-emerald-800">
            Thank you. We will review your birth details and consultation
            focus, then contact you within one business day with the earliest
            available consultation slot.
          </p>

          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="mt-5 rounded-full border border-emerald-300 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
          >
            Submit another request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <section>
            <h3 className="text-lg font-semibold text-slate-900">
              Contact details
            </h3>

            <div className="mt-4">
              <label
                htmlFor="consultation-phone"
                className="mb-1 block text-sm font-medium text-slate-900"
              >
                Phone / WhatsApp
              </label>

              <input
                id="consultation-phone"
                type="tel"
                autoComplete="tel"
                className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+971..."
                required
              />
            </div>
          </section>

          <section className="border-t border-[color:var(--border)] pt-8">
            <h3 className="text-lg font-semibold text-slate-900">
              Birth details
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Please enter the birth details of the person whose chart will be
              discussed.
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="birth-date"
                  className="mb-1 block text-sm font-medium text-slate-900"
                >
                  Date of birth
                </label>

                <input
                  id="birth-date"
                  type="date"
                  className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="birth-time"
                  className="mb-1 block text-sm font-medium text-slate-900"
                >
                  Time of birth
                </label>

                <input
                  id="birth-time"
                  type="time"
                  className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="birth-place"
                  className="mb-1 block text-sm font-medium text-slate-900"
                >
                  Place of birth
                </label>

                <input
                  id="birth-place"
                  type="text"
                  className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  placeholder="City, State and Country"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="birth-time-accuracy"
                  className="mb-1 block text-sm font-medium text-slate-900"
                >
                  How accurate is the birth time?
                </label>

                <select
                  id="birth-time-accuracy"
                  className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
                  value={birthTimeAccuracy}
                  onChange={(e) => setBirthTimeAccuracy(e.target.value)}
                >
                  <option value="exact">
                    Exact — from birth certificate or hospital record
                  </option>

                  <option value="family-confirmed">
                    Confirmed by family
                  </option>

                  <option value="approximate">
                    Approximate — may differ by a few minutes
                  </option>

                  <option value="uncertain">
                    Uncertain — may require birth-time rectification
                  </option>
                </select>
              </div>
            </div>
          </section>

          <section className="border-t border-[color:var(--border)] pt-8">
            <h3 className="text-lg font-semibold text-slate-900">
              Consultation focus
            </h3>

            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="consultation-area"
                  className="mb-1 block text-sm font-medium text-slate-900"
                >
                  Main area you would like to discuss
                </label>

                <select
                  id="consultation-area"
                  className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
                  value={consultationArea}
                  onChange={(e) => setConsultationArea(e.target.value)}
                  required
                >
                  <option value="">Select an area</option>
                  <option value="career">Career and professional growth</option>
                  <option value="business">Business and entrepreneurship</option>
                  <option value="marriage">
                    Marriage and relationships
                  </option>
                  <option value="finance">Finance and wealth</option>
                  <option value="property">
                    Property, home and relocation
                  </option>
                  <option value="education">Education and children</option>
                  <option value="health">Health and wellbeing</option>
                  <option value="timing">
                    Timing of an important decision
                  </option>
                  <option value="spiritual">
                    Personal and spiritual direction
                  </option>
                  <option value="complete-chart">
                    Complete birth-chart consultation
                  </option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="consultation-focus"
                  className="mb-1 block text-sm font-medium text-slate-900"
                >
                  What would you specifically like to understand?
                </label>

                <textarea
                  id="consultation-focus"
                  className="min-h-32 w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  placeholder="Describe the main question or decision for which you are seeking guidance."
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="background-context"
                  className="mb-1 block text-sm font-medium text-slate-900"
                >
                  Relevant background or recent events
                  <span className="ml-1 font-normal text-slate-500">
                    (optional)
                  </span>
                </label>

                <textarea
                  id="background-context"
                  className="min-h-28 w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
                  value={backgroundContext}
                  onChange={(e) => setBackgroundContext(e.target.value)}
                  placeholder="Share any recent developments, dates or circumstances that may help us prepare for the consultation."
                />
              </div>
            </div>
          </section>

          {errorMessage ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
            >
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[color:var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting request..." : "Submit Consultation Request"}
          </button>

          <p className="text-center text-xs leading-5 text-slate-500">
            We will contact you by email or WhatsApp with the earliest
            available consultation slot.
          </p>
        </form>
      )}
    </div>
  );
}