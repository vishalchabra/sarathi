"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontWeight: 600 }}>Something went wrong in Chat</h2>
      <p style={{ whiteSpace: "pre-wrap", color: "#b00020" }}>{String(error?.message || error)}</p>
      {error?.digest && <p style={{ fontSize: 12, color: "#666" }}>digest: {error.digest}</p>}
      <button
        onClick={() => reset()}
        style={{ marginTop: 8, padding: "8px 12px", borderRadius: 8, background: "#111", color: "#fff", border: "1px solid #000" }}
      >
        Try again
      </button>
    </div>
  );
}
