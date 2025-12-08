"use client";

import type { Place, Panchang } from "@/lib/providers/grahaguru.types";
export type { Place, Panchang } from "@/lib/providers/grahaguru.types";

// client-safe chart helper (pure)
export { computeChart } from "@/lib/astro/computeChart";

// client wrapper that calls your API route (no server-only imports)
export async function getPanchang(place: Place, dateISO?: string): Promise<Panchang> {
  const res = await fetch("/api/panchang", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ place, dateISO }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`getPanchang failed: ${res.status}`);
  return res.json();
}

// lightweight placeholder so imports compile; replace with your real logic later
export async function generateVerdicts(chart: any): Promise<any[]> {
  const planets = chart?.planets ?? {};
  const out: any[] = [];
  if (planets.Mercury) out.push({ key: "learning", title: "Learning", text: "Good time for study & writing." });
  if (planets.Venus) out.push({ key: "relationships", title: "Relationships", text: "Favors harmony & creativity." });
  if (!out.length) out.push({ key: "general", title: "General", text: "Steady day. Focus on basics." });
  return out;
}