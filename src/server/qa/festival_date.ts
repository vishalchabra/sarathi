// FILE: src/server/qa/festival_date.ts
import { type Place } from "./astro";

export type FestivalHit = {
  name: string;
  date: string;
  weekday: string;
  note?: string;
  method: "scan_panchang";
};

// Stability patch: disable date resolution entirely.
// Handlers will fall back to wiki summaries.
export async function findFestivalDateGeneric(
  _query: string,
  _year: number,
  _place: Place
): Promise<FestivalHit | null> {
  return null;
}
