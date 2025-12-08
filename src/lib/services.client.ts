"use client";
import type { Place, Panchang, TransitSummary } from "@/lib/providers/grahaguru.types";

export async function fetchPanchang(place: Place, dateISO?: string): Promise<Panchang> {
  const res = await fetch("/api/panchang", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ place, dateISO }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch panchang");
  return res.json();
}

export async function fetchTransitSummary(place: Place, dateISO?: string): Promise<TransitSummary> {
  const res = await fetch("/api/transit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ place, dateISO }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch transit");
  return res.json();
}

export { computeChart } from "@/lib/astro/computeChart";
export type { Place, Panchang, TransitSummary };