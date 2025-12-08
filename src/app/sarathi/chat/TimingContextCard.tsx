// FILE: src/app/sarathi/chat/TimingContextCard.tsx
"use client";

type TimingResult = {
  ok: boolean;
  windows?: Array<any>;
  context?: string;
  now?: { label: string; fromISO: string; toISO: string };
  spans?: Array<{ fromISO: string; toISO: string; label: string }>;
};

export default function TimingContextCard({ data }: { data: TimingResult }) {
  const count = data.windows?.length ?? 0;
  const label =
    data.now?.label ??
    (() => {
      // ultra-safe fallback: compute from spans if present
      const t = new Date().toISOString().slice(0, 10);
      const hit = data.spans?.find((s) => s.fromISO <= t && t <= s.toISO);
      return hit?.label;
    })() ??
    "MD/AD unavailable";

  return (
    <div className="rounded-xl border p-3">
      <div className="text-sm font-medium">Context</div>
      <div className="text-sm">
        Job timing: dasha-aligned windows ({count})
        <br />
        {`You’re in ${label}. Proceed methodically; patience multiplies outcomes. Keep decisions documented.`}
      </div>
    </div>
  );
}
