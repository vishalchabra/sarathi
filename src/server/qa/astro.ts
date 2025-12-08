// FILE: src/server/qa/astro.ts
import { DateTime } from "luxon";

export type Place = { name: string; tz: string; lat: number; lon: number };

export type PanchangResp = {
  at?: string;
  weekday?: string;  // e.g., Monday
  tithi?: string;    // e.g., Shukla Ekadashi / Amavasya
  nakshatra?: string;
  yoga?: string;
  masa?: string;     // some APIs expose lunar month here
  month?: string;    // or here
  error?: string;
};

function resolveBaseUrl() {
  // Prefer explicit base; then Vercel URL; then localhost for dev
  const env =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";
  return env.replace(/\/+$/, "");
}

async function fetchJsonWithTimeout<T>(url: string, init: RequestInit = {}, ms = 5000): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal, cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(t);
  }
}

// Calls your /api/panchang endpoint with an absolute URL (works on server) + timeout
export async function getPanchang(dateISO: string, place: Place): Promise<PanchangResp | null> {
  try {
    const url = `${resolveBaseUrl()}/api/panchang`;
    return await fetchJsonWithTimeout<PanchangResp>(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ dateISO, tz: place.tz, lat: place.lat, lon: place.lon }),
    }, 5000);
  } catch {
    return null;
  }
}

// Scan forward to find the next Ekadashi (by tithi text). Keep horizon modest.
export async function findNextEkadashi(
  startISO: string,
  place: Place,
  horizonDays: number = 365
): Promise<{ weekday: string; date: string; name: string } | null> {
  const tz = place?.tz || "UTC";

  // Start from the user's local "today" at start of day
  let cur = DateTime.fromISO(startISO, { zone: "utc" }).setZone(tz).startOf("day");

  for (let i = 0; i <= horizonDays; i++) {
    // Sample panchang at local midday to avoid sunrise/edge issues
    const sample = cur.set({ hour: 12, minute: 0, second: 0, millisecond: 0 });

    try {
      const p = await getPanchang(sample.toISO(), place);
      const tithiStr = String(p?.tithi ?? "").toLowerCase();

      // Match both "ekadashi" and "ekadasi"
      if (/\bekadash/i.test(tithiStr) || /\bekadasi\b/.test(tithiStr)) {
        return {
          weekday: p?.weekday ?? sample.toFormat("cccc"),
          date: sample.toFormat("d LLL yyyy"),
          name: p?.tithi ?? "Ekadashi",
        };
      }
    } catch {
      // swallow and continue scanning
    }

    cur = cur.plus({ days: 1 });
  }

  return null;
}

/**
 * Fast Diwali finder for a given Gregorian year:
 * 1) Parallel scan Oct 10 → Nov 25 (±~23 days around Nov 1) with a 5s timeout per day.
 * 2) Pick Amavasya whose masa/month mentions "Kartik/Kartika" if present.
 * 3) Else pick the Amavasya closest to Nov 1 (practical, accurate in most almanacs).
 * 4) If Panchang is totally unavailable, return null (handlers will show a helpful approx).
 */
export async function findDiwali(year: number, place: Place) {
  const zone = place.tz;
  const start = DateTime.fromObject({ year, month: 10, day: 10 }, { zone });
  const end   = DateTime.fromObject({ year, month: 11, day: 25 }, { zone });

  // Build the date list once
  const days: DateTime[] = [];
  for (let d = start; d <= end; d = d.plus({ days: 1 })) days.push(d);

  // Fetch all days in parallel (fast)
  const results = await Promise.allSettled(
    days.map((d) => getPanchang(d.toISO()!, place).then((p) => ({ d, p })))
  );

  const hits = results
    .flatMap((r) => (r.status === "fulfilled" && r.value?.p ? [r.value] : []))
    .filter(({ p }) => (p?.tithi ?? "").toLowerCase().includes("amavasya"));

  if (hits.length === 0) return null;

  // Prefer Kartik/Kartika masa if available
  const kartik = hits.find(({ p }) => /kartik/.test(((p?.masa ?? p?.month) ?? "").toLowerCase()));
  if (kartik) {
    return {
      date: kartik.d.toISODate(),
      tithi: kartik.p?.tithi ?? "Amavasya",
      weekday: kartik.p?.weekday ?? "",
    };
  }

  // Otherwise choose the Amavasya closest to Nov 1
  const target = DateTime.fromObject({ year, month: 11, day: 1 }, { zone });
  hits.sort(
    (a, b) =>
      Math.abs(a.d.diff(target, "days").days) - Math.abs(b.d.diff(target, "days").days)
  );
  const best = hits[0];
  return {
    date: best.d.toISODate(),
    tithi: best.p?.tithi ?? "Amavasya",
    weekday: best.p?.weekday ?? "",
    // Inform handlers this came from a practical fallback (optional)
    // @ts-ignore
    note: "Approx (closest to early Nov)",
  } as any;
}

// Simple weekday → color mapping (can be personalized later)
export function colorForWeekday(tz: string) {
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: tz }).format(new Date());
  const map: Record<string, string> = {
    Monday: "white/silver",
    Tuesday: "red",
    Wednesday: "green",
    Thursday: "yellow",
    Friday: "pastel/cream",
    Saturday: "blue/black",
    Sunday: "orange/gold",
  };
  return { weekday, color: map[weekday] ?? "light, calm tones" };
}
