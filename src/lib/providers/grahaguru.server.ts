import "server-only";
import type { Place, Panchang, TransitSummary } from "./grahaguru.types";

// Minimal, safe implementations so your app compiles and the UI has something to show.
// Replace with real provider calls later.

export async function fetchPanchang(place: Place, dateISO?: string): Promise<Panchang> {
  const day = (dateISO ?? new Date().toISOString()).slice(0, 10); // YYYY-MM-DD
  return {
    // leave tithi/nakshatra empty if you don't have a provider yet
    sunrise: `${day}T06:00:00`,
    sunset: `${day}T18:00:00`,
    moonrise: `${day}T15:00:00`,
    moonset: `${day}T03:00:00`,
    rahuKaal: { start: `${day}T13:30:00`, end: `${day}T15:00:00` },
    gulikaKaal: { start: `${day}T09:30:00`, end: `${day}T11:00:00` },
    abhijit: { start: `${day}T11:45:00`, end: `${day}T12:15:00` },
  };
}

// NOTE: Keep the param order (place, dateISO) to match callers (facts.ts/orchestrator.ts).
export async function fetchTransitSummary(place: Place, dateISO?: string): Promise<TransitSummary> {
  const now = new Date();
  const day = (dateISO ?? now.toISOString()).slice(0, 10); // YYYY-MM-DD
  return {
    hits: [
      {
        name: "General momentum",
        strength: "ok",
        exact: now.toISOString(),
        orbDays: 0,
        note: "Placeholder provider",
      },
    ],
    bestDay: day,
    bestWindow: { start: `${day}T10:00:00`, end: `${day}T12:00:00`, reason: "Midday clarity" },
    notes: ["Using placeholder transit provider."],
  };
}

// Re-export the types for convenience in server code
export type { Place, Panchang, TransitSummary };