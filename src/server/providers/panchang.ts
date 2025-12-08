    import "server-only";
import { DateTime } from "luxon";
import type { Place } from "@/types";


export type Panchang = {
dateISO: string;
sunrise?: string;
sunset?: string;
rahu?: { start: string; end: string };
gulika?: { start: string; end: string };
abhijit?: { start: string; end: string };
tithi?: string;
nakshatra?: string;
yoga?: string;
karana?: string;
festivals?: string[];
};


// Placeholder-only: wire to your real Panchang source when ready.
export async function getPanchang(today: Date, place: Place): Promise<Panchang> {
// Minimal safe fallback so app never crashes in dev
const base = DateTime.fromJSDate(today).setZone(place.tz ?? "UTC");
const sunrise = base.set({ hour: 6, minute: 5, second: 0 }).toISO();
const sunset = base.set({ hour: 18, minute: 25, second: 0 }).toISO();
return {
dateISO: base.startOf("day").toISO(),
sunrise,
sunset,
rahu: { start: base.set({ hour: 16 }).toISO(), end: base.set({ hour: 17, minute: 30 }).toISO() },
gulika: { start: base.set({ hour: 12 }).toISO(), end: base.set({ hour: 13, minute: 30 }).toISO() },
abhijit: { start: base.set({ hour: 11, minute: 45 }).toISO(), end: base.set({ hour: 12, minute: 30 }).toISO() },
tithi: "Fallback Tithi",
nakshatra: "Fallback Nakshatra",
yoga: "Fallback Yoga",
karana: "Fallback Karana",
festivals: [],
};
}