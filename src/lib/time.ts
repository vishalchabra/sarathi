import { DateTime } from "luxon";


export function iso(d: Date | string) {
return typeof d === "string" ? d : DateTime.fromJSDate(d).toISO();
}


export function todayISO(tz: string) {
return DateTime.now().setZone(tz).startOf("day").toISO();
}


export function addDaysISO(fromISO: string, days: number) {
return DateTime.fromISO(fromISO).plus({ days }).toISO();
}


export function between(aISO: string, bISO: string, cISO: string) {
const a = DateTime.fromISO(aISO);
const b = DateTime.fromISO(bISO);
const c = DateTime.fromISO(cISO);
return c >= a && c <= b;
}