// FILE: src/app/api/panchang/route.ts
import { NextResponse } from "next/server";

/** ---------------- Time / TZ helpers ---------------- */
function isValidHHMM(t: string) {
  const m = t.match(/^(\d{2}):?(\d{2})$/);
  if (!m) return false;
  const hh = +m[1], mm = +m[2];
  return hh >= 0 && hh < 24 && mm >= 0 && mm < 60;
}

/** Offset (minutes) for a given IANA TZ at a UTC instant */
function getOffsetMinutes(timeZone: string, atUtc: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(atUtc);
  const o = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const tzAsUTC = Date.UTC(+o.year, +o.month - 1, +o.day, +o.hour, +o.minute, +o.second);
  return (tzAsUTC - atUtc.getTime()) / 60000;
}

/** Convert local wall time in TZ → UTC ms (DST-safe, two-pass) */
function zonedLocalToUtcMillis(
  y: number, m: number, d: number, hh: number, mm: number, timeZone: string
) {
  const guess = Date.UTC(y, m - 1, d, hh, mm, 0);
  const off1 = getOffsetMinutes(timeZone, new Date(guess));
  const t1 = guess - off1 * 60000;
  const off2 = getOffsetMinutes(timeZone, new Date(t1));
  return guess - off2 * 60000;
}

/** ---------------- Math / Astro utils (lightweight) ---------------- */
const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const mod360 = (x: number) => ((x % 360) + 360) % 360;

/** Julian Day (UTC) from Date */
function julianDay(date: Date) {
  const y = date.getUTCFullYear();
  let m = date.getUTCMonth() + 1;
  const D = date.getUTCDate()
    + date.getUTCHours() / 24
    + date.getUTCMinutes() / 1440
    + date.getUTCSeconds() / 86400
    + date.getUTCMilliseconds() / 86400000;

  let Y = y;
  let M = m;
  if (m <= 2) { Y = y - 1; M = m + 12; }

  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;
  return JD;
}

/** Approx tropical Sun ecliptic longitude (deg) — good to ~0.5° */
function sunLonApproxTropical(jd: number) {
  const d = jd - 2451545.0; // days since J2000
  // mean longitude & anomaly
  const L = mod360(280.460 + 0.9856474 * d);
  const g = mod360(357.528 + 0.9856003 * d) * D2R;
  // ecliptic longitude (apparent)
  const lambda = L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g);
  return mod360(lambda);
}

/** Approx tropical Moon ecliptic longitude (deg) — good to ~1° */
function moonLonApproxTropical(jd: number) {
  const d = jd - 2451545.0;
  const Lm = mod360(218.316 + 13.176396 * d);        // mean longitude
  const Mm = mod360(134.963 + 13.064993 * d) * D2R;  // mean anomaly
  const D  = mod360(297.850 + 12.190749 * d) * D2R;  // elongation
  // simplified periodic terms
  const lon =
    Lm +
    6.289 * Math.sin(Mm) +
    1.274 * Math.sin(2 * D - Mm) +
    0.658 * Math.sin(2 * D) +
    0.214 * Math.sin(2 * Mm) +
    0.110 * Math.sin(D);
  return mod360(lon);
}

/**
 * Lahiri (Chitrapaksha) ayanamsa (deg), simple linearization around J2000:
 * ~23.856526° at J2000.0; precession rate ≈ 50.290966″/yr.
 * For production, prefer your Swiss Ephemeris function if available.
 */
function lahiriAyanamsaDeg(jd: number) {
  const years = (jd - 2451545.0) / 365.2425;
  return 23.856526 + (50.290966 / 3600) * years;
}

/** Try to get high-precision sidereal longitudes from your ephemeris, else fall back to approx */
async function getSiderealSunMoonLongitudes(dateUtc: Date): Promise<{ sun: number; moon: number; ayan: number; source: "ephemeris" | "approx" }> {
  const jd = julianDay(dateUtc);
  try {
    // Dynamically load your ephemeris if present; avoids build errors if not available.
    const ephem: any = await import("@/server/ephemeris").catch(() => null);
    const fn =
      ephem?.getSiderealLongitudesLahiri ||
      ephem?.getSiderealLongitudes ||
      ephem?.getLongitudesSidereal ||
      null;
    if (typeof fn === "function") {
      const out = await fn(dateUtc);
      // expected { sunLon, moonLon } or { sun:deg, moon:deg }
      const sun = out?.sunLon ?? out?.sun ?? null;
      const moon = out?.moonLon ?? out?.moon ?? null;
      if (typeof sun === "number" && typeof moon === "number") {
        const ayan = out?.ayan ?? lahiriAyanamsaDeg(jd);
        return { sun: mod360(sun), moon: mod360(moon), ayan, source: "ephemeris" };
      }
    }
  } catch { /* ignore and fall back */ }

  // Fallback: compute tropical → subtract Lahiri
  const sunT = sunLonApproxTropical(jd);
  const moonT = moonLonApproxTropical(jd);
  const ayan = lahiriAyanamsaDeg(jd);
  return { sun: mod360(sunT - ayan), moon: mod360(moonT - ayan), ayan, source: "approx" };
}

/** ---------------- Panchang pieces ---------------- */
const TITHI_NAMES_1_14 = [
  "Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami",
  "Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi"
] as const;

const NAKSHATRA_27 = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha",
  "Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
  "Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"
] as const;

const YOGA_27 = [
  "Vishkambha","Priti","Ayushman","Saubhagya","Shobhana","Atiganda","Sukarma","Dhriti","Shoola",
  "Ganda","Vriddhi","Dhruva","Vyaghata","Harshana","Vajra","Siddhi","Vyatipata","Variyan","Parigha",
  "Shiva","Siddha","Sadhya","Shubha","Shukla","Brahma","Indra","Vaidhriti"
] as const;

function computeTithiPaksha(sidMoon: number, sidSun: number) {
  const diff = mod360(sidMoon - sidSun);
  const tithiNum = Math.floor(diff / 12) + 1; // 1..30
  // Paksha and name
  let name: string;
  let paksha: "Shukla" | "Krishna";
  if (tithiNum === 15) {
    name = "Purnima"; paksha = "Shukla";
  } else if (tithiNum === 30) {
    name = "Amavasya"; paksha = "Krishna";
  } else if (tithiNum <= 15) {
    name = TITHI_NAMES_1_14[tithiNum - 1]; paksha = "Shukla";
  } else {
    // 16..29 map to 1..14 again
    name = TITHI_NAMES_1_14[tithiNum - 16]; paksha = "Krishna";
  }
  return { name, paksha, tithiNum };
}

function computeNakshatra(sidMoon: number) {
  const seg = 360 / 27; // 13°20'
  const idx = Math.floor(sidMoon / seg); // 0..26
  return { name: NAKSHATRA_27[idx], index1: idx + 1 };
}

function computeYoga(sidMoon: number, sidSun: number) {
  const sum = mod360(sidMoon + sidSun);
  const seg = 360 / 27;
  const idx = Math.floor(sum / seg); // 0..26
  return { name: YOGA_27[idx], index1: idx + 1 };
}

/** ---------------- Route handlers ---------------- */
export async function POST(req: Request) {
  try {
    const ctype = req.headers.get("content-type") || "";
    if (!ctype.includes("application/json")) {
      return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 415 });
    }

    const body = (await req.json().catch(() => null)) as
      | { dobISO?: string; tob?: string; place?: { tz?: string; lat?: number; lon?: number } }
      | null;

    const dobISO = body?.dobISO || "";
    const tob = body?.tob || "";
    const tz = body?.place?.tz || "Asia/Kolkata";

    if (!dobISO || !isValidHHMM(tob)) {
      return NextResponse.json({ error: "Invalid dobISO or tob" }, { status: 400 });
    }

    const [Y, M, D] = dobISO.split("-").map(Number);
    const [H, Min] = tob.includes(":") ? tob.split(":").map(Number) : [Number(tob.slice(0, 2)), Number(tob.slice(2, 4))];

    // Local → UTC
    const utcMillis = zonedLocalToUtcMillis(Y, M, D, H, Min, tz);
    const utcDate = new Date(utcMillis);

    // Weekday (in local zone)
    const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "long", timeZone: tz }).format(utcDate);

    // Sidereal longitudes (Sun & Moon)
    const { sun, moon, ayan, source } = await getSiderealSunMoonLongitudes(utcDate);

    // Panchang bits
    const tithi = computeTithiPaksha(moon, sun);
    const nak = computeNakshatra(moon);
    const yoga = computeYoga(moon, sun);

    const atLocal = `${dobISO} ${String(H).padStart(2, "0")}:${String(Min).padStart(2, "0")} ${tz}`;

    return NextResponse.json(
      {
        at: atLocal,
        weekday,
        tithi: tithi.name,
        paksha: tithi.paksha,
        nakshatra: nak.name,
        yoga: yoga.name,
        // debug fields (handy during verification; remove if you prefer)
        _debug: { sunSid: +sun.toFixed(4), moonSid: +moon.toFixed(4), ayan: +ayan.toFixed(4), src: source },
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Internal error (panchang)" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, hint: "POST with { dobISO, tob, place: { tz } }" });
}
