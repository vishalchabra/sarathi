"use client";

export default function DiagPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>✅ Diag Page Rendered</h1>
      <p>If you can see this, the app shell is healthy. If this is also blank, the problem is in layout/middleware.</p>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('error', e => {
              const box = document.getElementById('diag-errors');
              if (box) {
                box.textContent += "\\n" + (e.message || e.error?.toString() || "Unknown error");
              }
            });
            window.addEventListener('unhandledrejection', e => {
              const box = document.getElementById('diag-errors');
              if (box) {
                box.textContent += "\\nUnhandled rejection: " + (e.reason?.message || e.reason?.toString() || "Unknown");
              }
            });
          `,
        }}
      />
      <pre id="diag-errors" style={{ whiteSpace: "pre-wrap", color: "#b91c1c", marginTop: 16 }} />
    </div>
  );
}
