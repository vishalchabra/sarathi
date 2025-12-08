"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
        App crashed while rendering
      </h1>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          background: "#f8fafc",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: 12,
          fontSize: 12,
          lineHeight: 1.4,
          maxWidth: 900,
          overflow: "auto",
        }}
      >
{String(error?.stack || error?.message || error)}
      </pre>
      <button
        onClick={() => reset()}
        style={{
          marginTop: 12,
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          background: "white",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}
