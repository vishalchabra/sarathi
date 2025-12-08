// FILE: /src/components/Report/HouseLords.tsx
"use client";
import React from "react";
import { SIGNS_FULL, SIGN_LORD, sIdx, wrap360 } from "@/lib/astro/canonical";

const HOUSE_NOTES = [
  "Self, vitality, beginnings",
  "Wealth, speech, family",
  "Courage, skills, media",
  "Home, mother, property",
  "Creativity, children, mantra",
  "Service, health, obstacles",
  "Relationships, contracts",
  "Transformation, research, hidden",
  "Dharma, teachers, long journeys",
  "Career, authority, status",
  "Gains, network, ambitions",
  "Release, sleep, foreign/retreat",
];

export default function HouseLords({
  ascDeg,
}: {
  ascDeg?: number;
}) {
  if (typeof ascDeg !== "number" || !Number.isFinite(ascDeg)) return null;

  const ascSign = sIdx(ascDeg);
  const rows = Array.from({ length: 12 }).map((_, i) => {
    const house = i + 1;
    const sign = (ascSign + i) % 12;
    const lord = SIGN_LORD[sign];
    return {
      house,
      signName: SIGNS_FULL[sign],
      lord,
      note: HOUSE_NOTES[i],
    };
  });

  return (
    <section className="rounded-xl border bg-white p-4">
      <h3 className="text-lg font-semibold mb-2">House Lords from Lagna</h3>
      <div className="overflow-x-auto">
        <table className="min-w-[520px] w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2 pr-3">House</th>
              <th className="py-2 pr-3">Sign</th>
              <th className="py-2 pr-3">Lord</th>
              <th className="py-2 pr-3">Focus</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.house} className="border-t">
                <td className="py-2 pr-3 font-medium">{r.house}</td>
                <td className="py-2 pr-3">{r.signName}</td>
                <td className="py-2 pr-3">{r.lord}</td>
                <td className="py-2 pr-3 text-gray-700">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
