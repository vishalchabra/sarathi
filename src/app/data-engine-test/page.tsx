"use client";

import { useState } from "react";

export default function DataEngineTestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTest() {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await fetch("/api/data-engine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          birth: {
            name: "Vishal",
            dateISO: "1984-01-21",
            time: "23:35",
            timezone: "Asia/Kolkata",
            lat: 29.99,
            lon: 77.50,
          },
          plan: "light",
          selectedDateISO: "2026-03-28",
          compareDateISO: "2026-06-15",
        }),
      });

      const json = await res.json();
      setResult(json);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Data Engine Test</h1>
      <button onClick={handleTest} disabled={loading}>
        {loading ? "Testing..." : "Run Test"}
      </button>

      {error ? <pre style={{ color: "red" }}>{error}</pre> : null}
      {result ? (
        <pre style={{ whiteSpace: "pre-wrap", marginTop: 16 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      ) : null}
    </main>
  );
}