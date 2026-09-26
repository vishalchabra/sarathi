
"use client";

import { useEffect, useState } from "react";

type Signal = {
  source: string;
  planet: string | null;
  importance: number;
  polarity: string;
};

type Preview = {
  date: string;
  periodTheme: {
    area: string;
    score: number;
    polarity: string;
    prediction: string;
action: string;
avoid: string;
  } | null;
  todayFocus: {
    area: string;
    importance: number;
    dashaScore: number;
    moonSign: string;
    moonNakshatra: string;
    signals: Signal[];
  } | null;
  alignment: "aligned" | "different";
};

const areaLabels: Record<string, string> = {
  money: "Money & Financial Matters",
  career: "Career & Professional Life",
  children: "Children",
  education: "Learning & Education",
  communication: "Communication",
  home: "Home & Family Life",
  relationships: "Relationships",
  hiddenMatters: "Private & Unresolved Matters",
  spirituality: "Spirituality",
  mind: "Emotional Well-being",
  travel: "Travel",
};

function areaLabel(area: string) {
  return (
    areaLabels[area] ??
    area
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (letter) => letter.toUpperCase())
  );
}

const dailyDescriptions: Record<string, string> = {
  money:
    "Financial priorities, spending decisions or practical opportunities may draw your attention today.",
  career:
    "Your professional responsibilities, ongoing work or career plans may need your attention today.",
  children:
    "Children, their needs or related responsibilities may draw your attention today.",
  education:
    "Learning, research or developing a new skill may be particularly relevant today.",
  communication:
    "Conversations, correspondence or important information may need your attention.",
  home:
    "Domestic responsibilities, family arrangements or matters concerning your home may come into focus.",
  relationships:
    "Personal relationships, cooperation and understanding others may deserve attention today.",
  hiddenMatters:
    "Private concerns, unresolved questions or matters requiring careful investigation may come into focus.",
  spirituality:
    "Reflection, spiritual practices or taking time for yourself may be meaningful today.",
  mind:
    "Your emotional responses and mental well-being may deserve additional attention.",
  travel:
    "Travel arrangements, journeys or plans involving distant places may need attention.",
};

function periodDescription(area: string, polarity: string) {
  const subject = areaLabel(area).toLowerCase();

  if (polarity === "supportive") {
    return `${subject} remain prominent during this period, with indications of supportive conditions. Consider opportunities carefully and take practical steps where appropriate.`;
  }

  if (polarity === "challenging") {
    return `${subject} remain prominent during this period and may require patience, preparation and careful decisions.`;
  }

  return `${subject} remain prominent during this period, with a mixture of opportunities and practical considerations.`;
}

export default function DailyGuidancePreview() {
  const [date, setDate] = useState("2026-10-20");
  const [data, setData] = useState<Preview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDiagnostics, setShowDiagnostics] =
    useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");
      setData(null);

      try {
        const response = await fetch(
          `/api/dev/daily-guidance-preview?date=${date}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Could not generate the preview.");
        }

        const result: Preview = await response.json();

        if (!controller.signal.aborted) {
          setData(result);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unknown error"
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => controller.abort();
  }, [date]);

  const period = data?.periodTheme;
  const focus = data?.todayFocus;

  const aligned =
    Boolean(period && focus) &&
    period?.area === focus?.area;

const [year, month, day] = date.split("-").map(Number);

const formattedDate = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
][new Date(Date.UTC(year, month - 1, day)).getUTCDay()]
  + `, ${day} `
  + [
      "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December",
    ][month - 1]
  + ` ${year}`;

  return (
    <main className="mx-auto max-w-4xl space-y-6 bg-[#FFFCF8] p-5 text-[#19243A] md:p-8">
      <header className="border-b border-[#E8DFD3] pb-5">
        <p className="text-sm tracking-wide text-[#806F60]">
          Sārathi · Development preview
        </p>

        <h1 className="mt-2 font-serif text-4xl">
          Your Daily Guidance
        </h1>

        <p className="mt-2 text-[#687386]">
          {formattedDate}
        </p>
      </header>

      <label className="block space-y-2">
        <span className="text-sm font-semibold">
          Select date
        </span>

        <input
          type="date"
          min="2026-10-01"
          max="2026-10-31"
          value={date}
          onChange={(event) =>
            setDate(event.target.value)
          }
          className="block rounded-xl border border-[#E8DFD3] bg-white p-3"
        />
      </label>

      {loading && (
        <p className="rounded-xl bg-white p-5">
          Calculating your guidance...
        </p>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 p-5 text-red-700">
          {error}
        </p>
      )}

      {data && (
        <div className="space-y-5">
          {focus && (
            <div className="rounded-xl border border-[#E8DFD3] bg-white px-5 py-4">
              <p className="text-sm text-[#687386]">
                ☾ Moon in {focus.moonSign}
                {" · "}
                {focus.moonNakshatra}
              </p>
            </div>
          )}

          {aligned && period && focus ? (
            <section className="rounded-2xl border border-[#A8D7C5] bg-[#F5FCF8] p-6">
              <p className="text-sm font-bold uppercase tracking-wider text-[#246B55]">
                Focus of the day
              </p>

              <h2 className="mt-3 font-serif text-3xl">
                {areaLabel(period.area)}
              </h2>

              <span className="mt-4 inline-block rounded-full bg-[#DDF3E9] px-3 py-1 text-sm text-[#246B55]">
                Broader period and today align
              </span>

              <p className="mt-5 leading-7">
                {period.prediction}{" "}
Today's Moon reinforces this area.{" "}
                {dailyDescriptions[focus.area] ??
                  "This area may deserve your attention today."}
              </p>
            </section>
          ) : (
            <div className="space-y-5">
              {period && (
                <section className="rounded-2xl border border-[#EAD7B8] bg-[#FFF9F0] p-6">
                  <p className="text-sm font-bold uppercase tracking-wider text-[#89632B]">
                    Broader period
                  </p>

                  <h2 className="mt-3 font-serif text-3xl">
                    {areaLabel(period.area)}
                  </h2>

                  <span className="mt-4 inline-block rounded-full bg-[#F8EAD4] px-3 py-1 text-sm capitalize text-[#89632B]">
                    {period.polarity}
                  </span>

                  <p className="mt-5 leading-7">
                    {period.prediction}
                  </p>
                </section>
              )}

              {focus && (
                <section className="rounded-2xl border border-[#D9CDFB] bg-[#F9F6FF] p-6">
                  <p className="text-sm font-bold uppercase tracking-wider text-[#5841A3]">
                    Today's focus
                  </p>

                  <h2 className="mt-3 font-serif text-3xl">
                    {areaLabel(focus.area)}
                  </h2>

                  <p className="mt-5 leading-7">
                    {dailyDescriptions[focus.area] ??
                      "This area may deserve your attention today."}
                  </p>

                  {focus.dashaScore === 0 && (
                    <p className="mt-4 text-sm text-[#706589]">
                      This is a temporary area of
                      attention, rather than a
                      confirmed period-level event.
                    </p>
                  )}
                </section>
              )}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">

<section className="rounded-2xl bg-[#F0F8F4] p-5">
  <p className="text-sm font-bold uppercase tracking-wide text-[#246B55]">
    {aligned
      ? "Suggested action"
      : `Suggested action · ${
          period ? areaLabel(period.area) : "Broader period"
        }`}
  </p>

  <p className="mt-3 leading-7">
    {period?.action ||
      "Review your priorities and take a practical step where appropriate."}
  </p>
</section>

<section className="rounded-2xl bg-[#FFF2F0] p-5">
  <p className="text-sm font-bold uppercase tracking-wide text-[#9A3434]">
    {aligned
      ? "What to be mindful of"
      : `What to be mindful of · ${
          period ? areaLabel(period.area) : "Broader period"
        }`}
  </p>

  <p className="mt-3 leading-7">
    {period?.avoid ||
      "Avoid rushed decisions and give important matters careful consideration."}
  </p>
</section>
          </div>

          <p className="rounded-xl bg-[#F1F2F5] p-4 text-sm leading-6 text-[#596579]">
            This guidance uses Vedic astrology to
            highlight areas of focus. It does not
            establish that a specific event will occur.
          </p>

          <section className="rounded-xl border border-[#E8DFD3] bg-white p-5">
            <button
              type="button"
              onClick={() =>
                setShowDiagnostics(
                  !showDiagnostics
                )
              }
              className="text-sm font-semibold text-[#596579] underline"
            >
              {showDiagnostics
                ? "Hide diagnostic evidence"
                : "Show diagnostic evidence"}
            </button>

            {showDiagnostics && (
              <div className="mt-4 space-y-3 text-sm">
                <p>
                  Period score:{" "}
                  {period?.score ?? "N/A"}
                </p>

                <p>
                  Daily-focus dasha score:{" "}
                  {focus?.dashaScore ?? "N/A"}
                </p>

                <p>
                  Moon importance:{" "}
                  {focus?.importance ?? "N/A"}
                </p>

                {focus?.signals.map(
                  (signal, index) => (
                    <div
                      key={`${signal.source}-${index}`}
                      className="rounded-lg bg-[#F4F5F8] p-3"
                    >
                      {signal.source} ·{" "}
                      {signal.importance} ·{" "}
                      {signal.polarity}
                    </div>
                  )
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
