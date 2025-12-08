import { clamp } from "../../lib/astro/math";
import type { TransitPoint } from "@/server/providers/transits";
import type { Window } from "@/types";


export function windowsFromSignals(points: TransitPoint[],
opts: { threshold?: number; minDays?: number; maxDays?: number } = {}
): Window[] {
const thr = opts.threshold ?? 0.55; // favorability threshold
const minD = opts.minDays ?? 5;
const maxD = opts.maxDays ?? 28;


const res: Window[] = [];
let i = 0;
while (i < points.length) {
if (points[i].signal < thr) { i++; continue; }
const startIdx = i;
let endIdx = i;
let bestIdx = i;
let bestScore = points[i].signal;
while (endIdx + 1 < points.length && points[endIdx + 1].signal >= thr) {
endIdx++;
if (points[endIdx].signal > bestScore) { bestScore = points[endIdx].signal; bestIdx = endIdx; }
}
// Clamp span
const span = endIdx - startIdx + 1;
const clampedSpan = Math.max(minD, Math.min(maxD, span));
endIdx = startIdx + clampedSpan - 1;


const take = points.slice(startIdx, Math.min(endIdx + 1, points.length));
const avg = take.reduce((s, p) => s + p.signal, 0) / take.length;
const score = Math.round(clamp(avg) * 100);
const why = [...(points[bestIdx].facts ?? [])];


res.push({
start: `${take[0].date}T00:00:00.000Z`,
end: `${take[take.length - 1].date}T23:59:59.000Z`,
score,
why,
});
i = endIdx + 1;
}
return res.sort((a, b) => b.score - a.score);
}