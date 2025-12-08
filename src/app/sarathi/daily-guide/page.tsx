// src/app/sarathi/daily-guide/page.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import type { QAAnswer, QAQuery, BirthInput } from "@/types";
type SavedProfile = {
  id: string;
  label: string;
  name: string;
  birthDateISO: string;
  birthTime: string;
  birthTz: string;
  lat: number;
  lon: number;
  placeName: string;
};

function ScoreBar({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score));
  return (
    <div className="w-full h-2 rounded bg-gray-200 overflow-hidden">
      <div className="h-full bg-green-600" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function Page() {
  const [q, setQ] = useState("When will I get a new car?");
  const [category, setCategory] = useState<string>("");
  const [answer, setAnswer] = useState<QAAnswer | null>(null);
  const [loading, setLoading] = useState(false);

  // Birth form fields
  const [dobISO, setDobISO] = useState("");
  const [tob, setTob] = useState("");
  const [tz, setTz] = useState("Asia/Kolkata");
  const [lat, setLat] = useState("26.85");
  const [lon, setLon] = useState("80.95");
  const [placeName, setPlaceName] = useState("Lucknow");

  const birth: BirthInput | undefined = useMemo(() => {
    if (!dobISO || !tob || !tz) return undefined;
    const la = Number(lat),
      lo = Number(lon);
    if (Number.isNaN(la) || Number.isNaN(lo)) return undefined;
    return { dobISO, tob, place: { tz, lat: la, lon: lo, name: placeName || "" } };
  }, [dobISO, tob, tz, lat, lon, placeName]);

  async function ask() {
    setLoading(true);
    try {
      const payload: QAQuery = { question: q } as any;
      if (category) (payload as any).category = category as any;
      if (birth) payload.birth = birth;
      const r = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      setAnswer(j);
    } finally {
      setLoading(false);
    }
  }
   // Auto-fill from default profile saved in Life Report
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem("sarathi_default_profile_v1");
      if (!raw) return;

      const prof: SavedProfile = JSON.parse(raw);

      // Only auto-fill fields that are still empty,
      // so we don’t override the user if they already typed something
      if (!dobISO) setDobISO(prof.birthDateISO);
      if (!tob) setTob(prof.birthTime);
      if (!tz) setTz(prof.birthTz);

      if (!lat) setLat(String(prof.lat));
      if (!lon) setLon(String(prof.lon));
      if (!placeName) setPlaceName(prof.placeName);
    } catch (e) {
      console.warn("Could not load default profile", e);
    }
  }, [dobISO, tob, tz, lat, lon, placeName]);

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Sārathi — Daily Guide</h1>

      {/* Query + category */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
        <div className="md:col-span-2 flex gap-2">
          <input
            className="border rounded px-3 py-2 flex-1"
            placeholder="Ask anything… e.g., When will I buy a car?"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="rounded px-4 py-2 bg-black text-white" onClick={ask} disabled={loading}>
            {loading ? "Thinking…" : "Ask"}
          </button>
        </div>
        <select
          className="border rounded px-3 py-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Auto-detect category</option>
          <option value="vehicle">Vehicle</option>
          <option value="property">Property</option>
          <option value="job">Job</option>
          <option value="wealth">Wealth</option>
          <option value="health">Health</option>
          <option value="relationship">Relationship</option>
        </select>
      </div>

      {/* Birth form */}
      <div className="rounded-2xl border p-4 space-y-3">
        <div className="font-semibold">Birth details (optional but recommended)</div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <input
            className="border rounded px-3 py-2"
            placeholder="YYYY-MM-DD"
            value={dobISO}
            onChange={(e) => setDobISO(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="HH:MM (24h)"
            value={tob}
            onChange={(e) => setTob(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2 md:col-span-2"
            placeholder="IANA TZ e.g. Asia/Kolkata"
            value={tz}
            onChange={(e) => setTz(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Lat"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Lon"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2 md:col-span-3"
            placeholder="Place name"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
          />
        </div>
        <div className="text-xs opacity-70">
          Fill these to enable precise Asc/house lords and Vimshottari gating.
        </div>
      </div>

      {/* Answer block */}
      {answer && (
        <div className="rounded-2xl border p-5 space-y-5">
          {/* Summary header */}
          <div className="space-y-1">
            <div className="text-lg">{answer.summary}</div>
            {answer.best && <ScoreBar score={answer.best.score} />}
            {answer.dasha && (
              <div className="text-sm opacity-80">
                Current Dasha:{" "}
                <span className="font-medium">
                  {answer.dasha.maha}–{answer.dasha.antara}
                </span>
                {answer.dasha.until ? ` · until ${answer.dasha.until.slice(0, 10)}` : ""}
              </div>
            )}
          </div>

          {/* Best window details */}
          {answer.best && (
            <div className="space-y-3">
              <div className="text-sm opacity-80">
                Best window score: {answer.best.score}/100 · {answer.best.start.slice(0, 10)} →{" "}
                {answer.best.end.slice(0, 10)}
              </div>

              {answer.panchangNote && (
                <div className="inline-flex items-center gap-2 text-xs bg-yellow-50 border border-yellow-200 rounded px-2 py-1">
                  <span className="font-semibold">Panchang</span>
                  <span>{answer.panchangNote}</span>
                </div>
              )}

              {answer.best.why?.length ? (
                <div>
                  <div className="font-semibold">Why this window</div>
                  <ul className="list-disc ml-5 text-sm">
                    {answer.best.why.slice(0, 6).map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {answer.actions?.length ? (
                  <div>
                    <div className="font-semibold">Suggested actions</div>
                    <ul className="list-disc ml-5 text-sm">
                      {answer.actions.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {answer.risks?.length ? (
                  <div>
                    <div className="font-semibold">Watch-outs</div>
                    <ul className="list-disc ml-5 text-sm">
                      {answer.risks.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Other windows */}
                    {answer.windows?.length ? (
            <div>
              <div className="font-semibold">Other favorable windows</div>
              <ul className="list-disc ml-5 text-sm">
                {answer.windows
                  .slice(1, 5)
                  .filter((w) => w && w.start && w.end)
                  .map((w, i) => {
                    const startLabel = (w.start ?? "").slice(0, 10);
                    const endLabel = (w.end ?? "").slice(0, 10);
                    const scoreLabel =
                      typeof w.score === "number" ? w.score : "?";

                    return (
                      <li key={i}>
                        {startLabel} → {endLabel} · {scoreLabel}/100
                      </li>
                    );
                  })}
              </ul>
            </div>
          ) : null}


          {process.env.NEXT_PUBLIC_SARATHI_DEBUG && (
            <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">
              {JSON.stringify(answer.debug ?? {}, null, 2)}
            </pre>
          )}
        </div>
      )}
    </main>
  );
}
