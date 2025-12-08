// FILE: src/app/sarathi/predict-debug/page.tsx
"use client";

import { useState } from "react";

type PredictionResponse = any;

const DEFAULT_BODY = {
  category: "job",
  birthDateISO: "1984-01-21",
  birthTime: "23:35",
  birthTz: "Asia/Dubai",
  lat: 25.2048,
  lon: 55.2708,
  placeName: "Dubai",
};

export default function SarathiPredictDebugPage() {
  const [body, setBody] = useState(DEFAULT_BODY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/sarathi/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        setError(`Error ${res.status}: ${txt || "Request failed"}`);
        return;
      }

      const json = await res.json();
      setResult(json);
    } catch (err: any) {
      console.error("predict-debug failed", err);
      setError(err?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    field: keyof typeof DEFAULT_BODY,
    value: string
  ) {
    setBody((prev) => ({
      ...prev,
      [field]:
        field === "lat" || field === "lon"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-50">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">
          Sārathi Prediction Debug
        </h1>
        <p className="text-sm text-slate-700">
          This page calls <code>/api/sarathi/predict</code> directly so
          you can inspect the raw JSON (windows, score, cache, etc.)
          without touching the main Life Report UI.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border bg-white p-4 shadow-sm"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium mb-1">
                Category
              </label>
              <select
                className="w-full rounded border px-2 py-1 text-sm"
                value={body.category}
                onChange={(e) =>
                  handleChange("category", e.target.value)
                }
              >
                <option value="job">job</option>
                <option value="business">business</option>
                <option value="money">money</option>
                <option value="property">property</option>
                <option value="vehicle">vehicle</option>
                <option value="relationships">relationships</option>
                <option value="disputes">disputes</option>
                <option value="general">general</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">
                Birth Date (ISO)
              </label>
              <input
                className="w-full rounded border px-2 py-1 text-sm"
                value={body.birthDateISO}
                onChange={(e) =>
                  handleChange("birthDateISO", e.target.value)
                }
                placeholder="1984-01-21"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">
                Birth Time (HH:MM)
              </label>
              <input
                className="w-full rounded border px-2 py-1 text-sm"
                value={body.birthTime}
                onChange={(e) =>
                  handleChange("birthTime", e.target.value)
                }
                placeholder="23:35"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">
                Birth Timezone (IANA)
              </label>
              <input
                className="w-full rounded border px-2 py-1 text-sm"
                value={body.birthTz}
                onChange={(e) =>
                  handleChange("birthTz", e.target.value)
                }
                placeholder="Asia/Dubai"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">
                Latitude (optional)
              </label>
              <input
                className="w-full rounded border px-2 py-1 text-sm"
                value={body.lat ?? ""}
                onChange={(e) => handleChange("lat", e.target.value)}
                placeholder="25.2048"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">
                Longitude (optional)
              </label>
              <input
                className="w-full rounded border px-2 py-1 text-sm"
                value={body.lon ?? ""}
                onChange={(e) => handleChange("lon", e.target.value)}
                placeholder="55.2708"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1">
                Place name (optional)
              </label>
              <input
                className="w-full rounded border px-2 py-1 text-sm"
                value={body.placeName}
                onChange={(e) =>
                  handleChange("placeName", e.target.value)
                }
                placeholder="Dubai"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Predicting..." : "Run prediction"}
          </button>

          {error && (
            <p className="mt-2 text-xs text-red-600 whitespace-pre-wrap">
              {error}
            </p>
          )}
        </form>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Raw response</h2>
            {result && (
              <span className="text-xs text-slate-500">
                cache: {result._cache ?? "n/a"}
              </span>
            )}
          </div>

          {!result && !error && (
            <p className="text-xs text-slate-500">
              Run a prediction to see JSON here.
            </p>
          )}

          {result && (
            <pre className="mt-2 max-h-[400px] overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-50">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
