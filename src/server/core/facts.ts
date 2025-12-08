import "server-only";
import { DateTime } from "luxon";
import type { BirthInput, Category } from "@/types";
import { getPanchang } from "@/server/providers/panchang";
import { dailyTransitSignals } from "@/server/providers/transits";
import { windowsFromSignals } from "@/server/core/windows";
import { PER_CAT, actionHints, riskHints } from "@/server/core/scoring";
import { dashaGate } from "@/server/providers/dasha";


export type FactsOut = {
windows: ReturnType<typeof windowsFromSignals>;
panchangNote?: string;
actions: string[];
risks: string[];
debug?: Record<string, unknown>;
};


export async function getFacts(
question: string,
category: Category,
birth?: BirthInput
): Promise<FactsOut> {
const place = birth?.place ?? { tz: "Asia/Dubai", lat: 25.2048, lon: 55.2708, name: "Dubai" };
const startISO = DateTime.now().setZone(place.tz).startOf("day").toISO();
const catCfg = PER_CAT[category];


let points = [] as Awaited<ReturnType<typeof dailyTransitSignals>>;
try {
points = await dailyTransitSignals(startISO!, catCfg.horizonDays, place, category, birth);
} catch (e) {
points = await dailyTransitSignals(startISO!, Math.max(90, catCfg.horizonDays), place, category, birth);
}


// Dasha gating (0.75..1 range)
const gated = points.map(p => ({ ...p, signal: Math.min(1, p.signal * dashaGate(p.date, birth, category)) }));


const windows = windowsFromSignals(gated, { minDays: catCfg.minDays, maxDays: catCfg.maxDays });


// Panchang (non‑blocking)
let panchangNote: string | undefined;
try {
const p = await getPanchang(new Date(), place);
if (p?.abhijit) panchangNote = "Prefer Abhijit for paperwork or token payments.";
} catch {}


return {
windows,
panchangNote,
actions: actionHints(category),
risks: riskHints(category),
debug: process.env.NEXT_PUBLIC_SARATHI_DEBUG ? { question, category, startISO, horizon: catCfg.horizonDays, dashaGate: true } : undefined,
};
}