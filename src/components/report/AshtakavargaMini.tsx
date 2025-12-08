"use client";
import React from "react";

const SIGNS = ["Ar","Ta","Ge","Cn","Le","Vi","Li","Sc","Sg","Cp","Aq","Pi"];

export default function AshtakavargaMini({
  av,
  planets,
}: {
  av?: { sarva?: number[] | Record<string, number> } | Record<string, number>;
  planets: Record<string, number>;
}) {
  // normalize Sarva points into a 12-length array
  let pts: number[] | null = null;

  const fromObj = (obj: Record<string, number>) => {
    const out = new Array(12).fill(0);
    for (const [k, v] of Object.entries(obj)) {
      // allow numeric keys (0..11) or sign abbreviations ("Ar","Ta",...)
      let i = Number.isFinite(+k) ? ((+k % 12) + 12) % 12 : -1;
      if (i < 0) {
        const idx = SIGNS.findIndex((s) => s.toLowerCase() === k.slice(0,2).toLowerCase());
        if (idx >= 0) i = idx;
      }
      if (i >= 0) out[i] = Number(v) || 0;
    }
    return out;
  };

  if (av && typeof av === "object" && "sarva" in (av as any)) {
    const s = (av as any).sarva;
    if (Array.isArray(s) && s.length === 12) pts = s.map((n) => +n || 0);
    else if (s && typeof s === "object") pts = fromObj(s as Record<string, number>);
  } else if (av && typeof av === "object") {
    // if caller passed already a 12-key object (fallback)
    pts = fromObj(av as Record<string, number>);
  }

  // Fallback heuristic: planet density per sign (0..8 cap)
  if (!pts) {
    pts = new Array(12).fill(0);
    Object.values(planets).forEach((deg) => {
      if (typeof deg !== "number") return;
      const i = Math.floor((((deg % 360) + 360) % 360) / 30);
      pts![i] += 1;
    });
    pts = pts.map((n) => Math.min(8, n));
  }

  const total = pts.reduce((a, b) => a + b, 0);
  const max = Math.max(...pts, 8);

  return (
    <>
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <span>Sarva (mini)</span>
        <span>Total: {total}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {pts.map((v, i) => (
          <div key={i} className="rounded border p-2">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>{SIGNS[i]}</span>
              <span>{v}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded overflow-hidden">
              <div
                className="h-2 bg-indigo-500"
                style={{ width: `${max > 0 ? (100 * v) / max : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
