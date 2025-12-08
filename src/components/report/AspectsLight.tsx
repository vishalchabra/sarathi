// FILE: /src/components/Report/AspectsLight.tsx
"use client";
import React from "react";
import { canonicalPlanets, norm360 } from "@/lib/astro/canonical";

type Row = { a: string; b: string; aspect: string; orb: string };

const ORDER = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"]; // compact

const ASPECTS = [
  { name: "Conjunction", deg: 0,  orbLum: 8, orbOther: 6, sign: 0 },
  { name: "Sextile",     deg: 60, orbLum: 5, orbOther: 4, sign: +1 },
  { name: "Square",      deg: 90, orbLum: 6, orbOther: 5, sign: -1 },
  { name: "Trine",       deg: 120,orbLum: 7, orbOther: 6, sign: +1 },
  { name: "Opposition",  deg: 180,orbLum: 8, orbOther: 6, sign: -1 },
];

function delta(a: number, b: number) {
  const d = Math.abs(((a - b + 540) % 360) - 180);
  return Math.min(d, 180 - d);
}

export default function AspectsLight({
  planets,
}: {
  planets: Record<string, any>;
}) {
  const P = canonicalPlanets(planets);
  const out: Row[] = [];

  for (let i = 0; i < ORDER.length; i++) {
    for (let j = i + 1; j < ORDER.length; j++) {
      const A = ORDER[i], B = ORDER[j];
      const da = P[A as keyof typeof P], db = P[B as keyof typeof P];
      if (typeof da !== "number" || typeof db !== "number") continue;

      const sep = Math.abs(((da - db + 540) % 360) - 180);
      for (const asp of ASPECTS) {
        const target = asp.deg;
        const d = Math.abs(sep - target);
        const orb = (A === "Sun" || A === "Moon" || B === "Sun" || B === "Moon") ? asp.orbLum : asp.orbOther;
        if (d <= orb) {
          out.push({ a: A, b: B, aspect: asp.name, orb: `${d.toFixed(1)}°` });
          break;
        }
      }
    }
  }

  if (!out.length) return null;

  return (
    <section className="rounded-xl border bg-white p-4" style={{ breakInside: "avoid" }}>
      <h3 className="text-lg font-semibold mb-2">Aspects (light)</h3>
      <div className="overflow-x-auto">
        <table className="min-w-[480px] w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2 pr-3">Planet A</th>
              <th className="py-2 pr-3">Aspect</th>
              <th className="py-2 pr-3">Planet B</th>
              <th className="py-2 pr-3">Orb</th>
            </tr>
          </thead>
          <tbody>
            {out.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="py-2 pr-3 font-medium">{r.a}</td>
                <td className="py-2 pr-3">{r.aspect}</td>
                <td className="py-2 pr-3 font-medium">{r.b}</td>
                <td className="py-2 pr-3">{r.orb}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Ptolemaic aspects with simple orbs; nodes included.
      </p>
    </section>
  );
}
