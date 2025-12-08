"use client";

import { useEffect, useState } from "react";

type PanchangResp = {
  at: string;
  weekday: string;
  tithi: string;
  paksha: string;
  nakshatra: string;
  yoga: string;
  error?: string;
};

export function PanchangAtBirthBlock({
  dobISO,
  tob,
  tz,
}: {
  dobISO: string;
  tob: string; // "23:35"
  tz: string;  // e.g. "Asia/Kolkata"
}) {
  const [p, setP] = useState<PanchangResp | null>(null);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/panchang", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ dobISO, tob, place: { tz } }),
      });
      const j = (await r.json()) as PanchangResp;
      setP(j);
    })();
  }, [dobISO, tob, tz]);

  if (!p) return <div>Loading Panchang…</div>;
  if (p.error) return <div className="text-red-600">Error: {p.error}</div>;

  return (
    <div>
      <div className="text-sm text-muted-foreground">
        {dobISO} {tob} {tz}
      </div>
      <div>Weekday: {p.weekday || "—"}</div>
      <div>Tithi: {p.tithi ? `${p.tithi} (${p.paksha})` : "—"}</div>
      <div>Nakshatra: {p.nakshatra || "—"}</div>
      <div>Yoga: {p.yoga || "—"}</div>
    </div>
  );
}
