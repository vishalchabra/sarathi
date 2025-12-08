// FILE: src/app/dev/qa-playground/page.tsx
"use client";
import { useState } from "react";

export default function QATester() {
  const [query, setQuery] = useState("when will I change my job with increment");
  const [out, setOut] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      const res = await fetch("/api/qa", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          query,
          profile: { roleTitle: "Frontend Engineer", stack: "React/Next" }
        }),
      });
      const j = await res.json();
      setOut(j);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">QA Playground</h1>
      <textarea className="w-full border p-2 rounded" rows={3} value={query} onChange={e=>setQuery(e.target.value)} />
      <button onClick={run} className="px-4 py-2 bg-blue-600 text-white rounded">
        {loading ? "Running..." : "POST /api/qa"}
      </button>
      {out && (
        <div className="grid gap-3">
          <div className="rounded border p-3">
            <div className="font-medium mb-1">Answer</div>
            <div>{out.copy?.answer}</div>
          </div>
          <div className="rounded border p-3">
            <div className="font-medium mb-1">How</div>
            <div>{out.copy?.how}</div>
          </div>
          <div className="rounded border p-3">
            <div className="font-medium mb-1">Quarters</div>
            <ul className="list-disc pl-5">{out.copy?.quarters?.map((q:string,i:number)=><li key={i}>{q}</li>)}</ul>
          </div>
          <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(out, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
