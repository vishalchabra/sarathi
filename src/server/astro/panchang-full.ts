// FILE: src/server/astro/panchang-full.ts
import "server-only";

import { getNakshatra } from "@/server/astro/nakshatra";
import { getPanchang } from "@/server/astro/panchang";
import { DateTime } from "luxon";
import { julianDayUTC } from "@/server/astro/core";

// ✅ Astro Engine v2 (pure JS)
import { computePlacementsV2 } from "@/server/astro-v2/placements";

type PanchangRequest = {
  dobISO: string; // "YYYY-MM-DD"
  tob: string; // "HH:mm"
  place: {
    tz: string; // IANA TZ
    lat: number;
    lon: number;
  };
};

function wrap360(x: number) {
  x = x % 360;
  return x < 0 ? x + 360 : x;
}

function parseGmtOffsetMinutes(label: string): number | undefined {
  const m = /GMT([+-]\d{1,2})(?::?(\d{2}))?/.exec(label);
  if (!m) return;
  const h = parseInt(m[1], 10);
  const min = m[2] ? parseInt(m[2], 10) : 0;
  return h * 60 + (h >= 0 ? min : -min);
}

function tzOffsetMinutesAt(tz: string, probeUtc: Date): number {
  const s = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    timeZoneName: "shortOffset",
  }).format(probeUtc);
  return parseGmtOffsetMinutes(s) ?? 0;
}

function makeUtcInstant(dISO: string, hhmm: string, tz: string): Date {
  const safeDate = typeof dISO === "string" ? dISO.trim() : "";
  const safeTime = typeof hhmm === "string" ? hhmm.trim() : "";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(safeDate)) {
    throw new Error(`Invalid dobISO in getFullPanchang: "${dISO}"`);
  }

  const parts = safeTime.split(":");
  if (parts.length < 2) {
    throw new Error(`Invalid tob in getFullPanchang: "${hhmm}"`);
  }

  const [Hraw, Mraw] = parts;
  const H = Number(Hraw) || 0;
  const M = Number(Mraw) || 0;

  const pretendedUtc = new Date(
    Date.UTC(
      +safeDate.slice(0, 4),
      +safeDate.slice(5, 7) - 1,
      +safeDate.slice(8, 10),
      H,
      M,
      0,
      0
    )
  );

  const off = tzOffsetMinutesAt(tz, pretendedUtc);
  return new Date(pretendedUtc.getTime() - off * 60_000);
}

function weekdayFromISO(localISO: string): string {
  const d = new Date(
    Date.UTC(
      +localISO.slice(0, 4),
      +localISO.slice(5, 7) - 1,
      +localISO.slice(8, 10)
    )
  );
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(d);
}

function computeTithiName(sunSid: number, moonSid: number): string {
  const diff = wrap360(moonSid - sunSid);
  const tithiIndex = Math.floor(diff / 12);
  const half = tithiIndex < 15 ? "Shukla" : "Krishna";
  const num = (tithiIndex % 15) + 1;
  return `${half} ${num}`;
}

const YOGAS_27 = [
  "Vishkambha",
  "Preeti",
  "Ayushman",
  "Saubhagya",
  "Shobhana",
  "Atiganda",
  "Sukarma",
  "Dhriti",
  "Shoola",
  "Ganda",
  "Vriddhi",
  "Dhruva",
  "Vyaghata",
  "Harshana",
  "Vajra",
  "Siddhi",
  "Vyatipata",
  "Variyan",
  "Parigha",
  "Shiva",
  "Siddha",
  "Sadhya",
  "Shubha",
  "Shukla",
  "Brahma",
  "Indra",
  "Vaidhriti",
];

function computeYogaName(sunSid: number, moonSid: number): string {
  const sum = wrap360(sunSid + moonSid);
  const idx = Math.floor(sum / (360 / 27));
  return YOGAS_27[idx];
}

const KARANA_MOVABLE = [
  "Bava",
  "Balava",
  "Kaulava",
  "Taitila",
  "Gara",
  "Vanija",
  "Vishti",
] as const;

function computeKaranaName(sunSid: number, moonSid: number): string {
  const D = wrap360(moonSid - sunSid);
  const K = Math.floor(D / 6);

  if (K === 57) return "Shakuni";
  if (K === 58) return "Chatushpada";
  if (K === 59) return "Naga";
  if (K === 0) return "Kimstughna";

  return KARANA_MOVABLE[(K - 1 + 7) % 7];
}

/** Approximate sunrise/sunset (NOAA-style) in local time "HH:mm". */
function computeSunTimesApprox(
  dateISO: string,
  tz: string,
  lat: number,
  lon: number
): { sunrise: string; sunset: string } {
  const dt = DateTime.fromISO(dateISO, { zone: tz });
  if (!dt.isValid) return { sunrise: "06:00", sunset: "18:00" };

  const N = dt.ordinal; // day of year
  const deg2rad = Math.PI / 180;
  const rad2deg = 180 / Math.PI;

  const gamma = ((2 * Math.PI) / 365) * (N - 1);

  const eqTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  const solarDec =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  const latRad = lat * deg2rad;
  const zenith = 90.833 * deg2rad;

  const cosH =
    (Math.cos(zenith) - Math.sin(latRad) * Math.sin(solarDec)) /
    (Math.cos(latRad) * Math.cos(solarDec));

  if (cosH <= -1) return { sunrise: "00:00", sunset: "23:59" };
  if (cosH >= 1) return { sunrise: "—", sunset: "—" };

  const H = Math.acos(cosH);
  const Hdeg = H * rad2deg;

  const solarNoonUTC = 720 - 4 * lon - eqTime; // minutes from midnight
  const sunriseUTC = solarNoonUTC - 4 * Hdeg;
  const sunsetUTC = solarNoonUTC + 4 * Hdeg;

  const offsetMinutes = dt.offset;
  const sunriseLocal = sunriseUTC + offsetMinutes;
  const sunsetLocal = sunsetUTC + offsetMinutes;

  function toHHMM(mins: number) {
    let m = Math.round(mins);
    while (m < 0) m += 1440;
    while (m >= 1440) m -= 1440;
    const hh = Math.floor(m / 60);
    const mm = m % 60;
    return `${hh.toString().padStart(2, "0")}:${mm
      .toString()
      .padStart(2, "0")}`;
  }

  return { sunrise: toHHMM(sunriseLocal), sunset: toHHMM(sunsetLocal) };
}

function hhmmToMinutes(str?: string | null): number | null {
  if (!str || typeof str !== "string") return null;
  const m = str.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const hh = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  return hh * 60 + mm;
}

function minutesToHHMM(total: number): string {
  let mins = Math.round(total);
  while (mins < 0) mins += 1440;
  while (mins >= 1440) mins -= 1440;
  const hh = Math.floor(mins / 60);
  const mm = mins % 60;
  return `${hh.toString().padStart(2, "0")}:${mm
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Main Panchang API used by life-engine.
 */
export async function getFullPanchang(req: PanchangRequest) {
  const { dobISO, tob, place } = req;
  const { tz, lat, lon } = place;

  // Build UTC instant for the requested local date/time
  const utc = makeUtcInstant(dobISO, tob, tz);

  // Keep JD around for meta/debug/compat
  const jdUt = await julianDayUTC(utc);

  // ✅ Sun/Moon from Astro Engine v2 (same engine as Life Report)
  const v2Rows = computePlacementsV2(utc);
  const sunRow = v2Rows.find((r) => r.key === "Sun");
  const moonRow = v2Rows.find((r) => r.key === "Moon");

  const sunSid = wrap360(sunRow?.siderealLon ?? 0);
  const moonSid = wrap360(moonRow?.siderealLon ?? 0);

  // Rich Panchang engine (now also upgraded in panchang.ts, see below)
  let rich: any = null;
  try {
    rich = await getPanchang({
      dobISO,
      tob,
      place: { tz, lat, lon },
    });
  } catch {
    rich = null;
  }

  const weekday = rich?.weekday ?? weekdayFromISO(dobISO);

  const tithiName = rich?.tithi
    ? `${rich.tithi.paksha} ${rich.tithi.day}`
    : computeTithiName(sunSid, moonSid);

  const yogaName = rich?.yoga?.name ?? computeYogaName(sunSid, moonSid);

  const karanaName =
    rich?.karana?.name ?? computeKaranaName(sunSid, moonSid);

  const moonNakshatraName =
    rich?.nakshatra?.name ?? getNakshatra(moonSid)?.name ?? "—";

  // --- Times ---
  let sunrise: string | null = rich?.sunrise ?? null;
  let sunset: string | null = rich?.sunset ?? null;
  let moonrise: string | null = rich?.moonrise ?? null;
  let moonset: string | null = rich?.moonset ?? null;

  if (!sunrise || sunrise === "—" || !sunset || sunset === "—") {
    const approx = computeSunTimesApprox(dobISO, tz, lat, lon);
    if (!sunrise || sunrise === "—") sunrise = approx.sunrise;
    if (!sunset || sunset === "—") sunset = approx.sunset;
  }

  if (!moonrise) moonrise = "—";
  if (!moonset) moonset = "—";

  // --- Kaal windows (approx) ---
  let rahuKaalStr = "— – —";
  let gulikaKaalStr = "— – —";
  let abhijitStr = "— – —";

  const startMinutes = hhmmToMinutes(sunrise);
  const endMinutes = hhmmToMinutes(sunset);

  if (startMinutes !== null && endMinutes !== null && endMinutes > startMinutes) {
    const dayLen = endMinutes - startMinutes;
    const segment = dayLen / 8;

    const rahuStart = startMinutes + 2 * segment;
    const rahuEnd = rahuStart + segment;

    const gulikaStart = startMinutes + 5 * segment;
    const gulikaEnd = gulikaStart + segment;

    rahuKaalStr = `${minutesToHHMM(rahuStart)} – ${minutesToHHMM(rahuEnd)}`;
    gulikaKaalStr = `${minutesToHHMM(gulikaStart)} – ${minutesToHHMM(gulikaEnd)}`;

    const mid = startMinutes + dayLen / 2;
    const halfWidth = dayLen / 30;
    const abhStart = mid - halfWidth;
    const abhEnd = mid + halfWidth;

    abhijitStr = `${minutesToHHMM(abhStart)} – ${minutesToHHMM(abhEnd)}`;
  }

  return {
    weekday,
    tithiName,
    yogaName,
    karanaName,
    moonNakshatraName,
    nakshatraName: moonNakshatraName,
    meanings: rich?.meanings ?? {},

    meta: {
      jdUt,
      lat,
      lon,
      tz,
      engine: "astro-v2",
    },

    sunrise,
    sunriseISO: sunrise,
    sunset,
    sunsetISO: sunset,
    moonrise,
    moonriseISO: moonrise,
    moonset,
    moonsetISO: moonset,

    rahuKaal: rahuKaalStr,
    gulikaKaal: gulikaKaalStr,
    abhijit: abhijitStr,

    tip: rich?.guidanceLine,
  };
}
