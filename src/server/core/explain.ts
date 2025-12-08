import { DateTime } from "luxon";
import type { Window } from "@/types";


export function explainSummary(cat: string, best: Window | null, confidence: number) {
if (!best) return "I couldn’t form a confident window yet. Try re‑asking with your birth details.";
const s = DateTime.fromISO(best.start).toFormat("dd MMM yyyy");
const e = DateTime.fromISO(best.end).toFormat("dd MMM yyyy");
const tier = confidence >= 0.75 ? "High" : confidence >= 0.5 ? "Moderate" : "Emerging";
return `${tier} alignment for ${cat}: ${s} – ${e}.`;
}