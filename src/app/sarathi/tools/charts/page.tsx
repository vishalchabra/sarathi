"use client";

import React, { useState } from "react";

/** Tiny ErrorBoundary so the page never goes white */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message?: string }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(err: any) {
    return { hasError: true, message: String(err) };
  }
  componentDidCatch(err: any, info: any) {
    // eslint-disable-next-line no-console
    console.error("UI ErrorBoundary caught:", err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16 }}>
          <h2 style={{ fontWeight: 600 }}>Something broke in the UI</h2>
          <pre style={{ whiteSpace: "pre-wrap", color: "#b91c1c" }}>
            {this.state.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

/** Super-minimal ChatUI with robust /api/qa fetch */
function ChatUI() {
  const [message, setMessage] = useState("when will I get a new car");
  const [resp, setResp] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setLoading(true);
    try {
      const payload = {
        message,
        birth: { dobISO: "1984-01-21", tob: "23:35" },
        place: { tz: "Asia/Dubai", name: "Dubai" },
      };

      const r = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const ct = r.headers.get("content-type") || "";
      const text = await r.text();
      let raw: any;

      if (ct.includes("application/json")) {
        try {
          raw = text ? JSON.parse(text) : {};
        } catch (e) {
          raw = { error: "Invalid JSON from server", detail: String(e) };
        }
      } else {
        raw = { error: text || `HTTP ${r.status} ${r.statusText}` };
      }

      if (!r.ok || raw?.error) {
        setResp({
          answer: {
            headline: "Error",
            text:
              typeof raw?.error === "string"
                ? raw.error
                : "Something went wrong.",
            summary:
              typeof raw?.detail === "string" ? raw.detail : undefined,
            confidence: "Low",
          },
          why: { warnings: [] },
        });
        return;
      }

      const normalized = {
        ...raw,
        answer: {
          text:
            (raw?.answer?.text ?? "").trim() ||
            `${(raw?.answer?.headline ?? "").trim() || "Guidance"}\n\n${(
              raw?.answer?.summary ?? ""
            ).trim()}`.trim(),
          confidence: raw?.answer?.confidence ?? "Low",
          actions: raw?.answer?.actions ?? [],
          headline: raw?.answer?.headline,
          summary: raw?.answer?.summary,
        },
        why: {
          facts: raw?.why?.facts ?? [],
          rules: raw?.why?.rules ?? [],
          warnings: raw?.why?.warnings ?? [],
        },
        context: raw?.context ?? raw?.facts ?? {},
      };
      setResp(normalized);
    } catch (e: any) {
      setResp({
        answer: {
          headline: "Error",
          text: e?.message || "Client error",
          confidence: "Low",
        },
        why: { warnings: [] },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask…"
          style={{ flex: 1, border: "1px solid #e2e8f0", borderRadius: 6, padding: "8px 10px" }}
        />
        <button
          onClick={send}
          disabled={loading}
          style={{
            padding: "8px 12px",
            background: "#111827",
            color: "white",
            borderRadius: 6,
          }}
        >
          {loading ? "Asking…" : "Ask"}
        </button>
      </div>

      {resp && (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            {resp?.answer?.headline ?? "Result"}
          </div>
          {resp?.answer?.summary && (
            <div style={{ color: "#475569", whiteSpace: "pre-wrap", marginBottom: 6 }}>
              {resp.answer.summary}
            </div>
          )}
          <div style={{ whiteSpace: "pre-wrap" }}>{resp?.answer?.text}</div>
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <ErrorBoundary>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
          Sārathi — Chat (Diagnostic Minimal)
        </h1>
        <p style={{ color: "#475569", marginBottom: 20 }}>
          If this renders, the route is healthy. Next we add Charts back gradually.
        </p>
        <ChatUI />
      </div>
    </ErrorBoundary>
  );
}
