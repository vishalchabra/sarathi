import type { Window } from "@/types";


export type CatParams = { horizonDays: number; minDays: number; maxDays: number };


export const PER_CAT: Record<string, CatParams> = {
vehicle: { horizonDays: 180, minDays: 7, maxDays: 35 },
property: { horizonDays: 240, minDays: 9, maxDays: 42 },
job: { horizonDays: 180, minDays: 7, maxDays: 35 },
wealth: { horizonDays: 210, minDays: 7, maxDays: 35 },
health: { horizonDays: 120, minDays: 5, maxDays: 21 },
relationship: { horizonDays: 210, minDays: 7, maxDays: 35 },
};


export function actionHints(cat: string): string[] {
if (cat === "vehicle") return [
"Shortlist 2–3 models and book a test drive",
"Complete RTA checks and insurance comparison",
"Avoid inauspicious daytime windows (Rahu/Gulika)",
];
if (cat === "property") return [
"Finalize mortgage pre‑approval",
"Do a site visit in daylight; check Vastu basics",
"Time token booking within your best window",
];
if (cat === "job") return [
"Refresh CV + LinkedIn, schedule 3 outreach emails",
"Target interviews in the first half of a strong window",
];
return ["Use the top window for key steps", "Document decisions for learning"];
}


export function riskHints(cat: string): string[] {
if (cat === "vehicle") return [
"Impulsive upgrades (Rahu) → overbudget",
"Avoid deliveries during Mercury Rx paperwork days",
];
if (cat === "property") return [
"Hidden fees or unclear titles",
"Delays in loan disbursal during Saturn peaks",
];
return ["Watch for overcommitment", "Verify documents twice"];
}


export function pickBest(windows: Window | undefined | null, all: Window[]): Window | null {
if (windows) return windows;
return all.length ? all[0] : null;
}