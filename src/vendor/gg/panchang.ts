// src/vendor/gg/panchang.ts
// TEMP: working Panchang with computed Rahu/Gulika from sunrise/sunset + weekday.
// Swap calcPanchang body with your real logic later; keep the same return keys.

export type RawPanchang = {
  tithi: { name: string; phase: "Waxing" | "Waning"; endTime?: string };
  nakshatra: { name: string; pada: 1|2|3|4; endTime?: string };
  yoga: { name: string; endTime?: string };
  karana: { name: string; endTime?: string };
  sun: { sunrise: string; sunset: string };
  moon: { moonrise?: string; moonset?: string };
  kaal: { rahu: { start: string; end: string }, gulika:{ start: string; end: string } };
  muhurtas: { abhijit?: { start: string; end: string } };
  festivals?: string[];
};

// ---------- helpers ----------
function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }
function hhmmToMin(hhmm: string) {
  const [h,m] = hhmm.split(":").map(Number);
  return (clamp(h||0,0,23) * 60) + clamp(m||0,0,59);
}
function minToHHMM(mins: number) {
  const m = ((mins % (24*60)) + 24*60) % (24*60);
  const h = Math.floor(m / 60), mm = Math.round(m % 60);
  const s = (x:number)=> String(x).padStart(2,"0");
  return `${s(h)}:${s(mm)}`;
}

/**
 * Compute Rahu/Gulika Kālam windows for the given date using sunrise/sunset.
 * Daytime (sunrise→sunset) is split into 8 equal parts.
 *
 * Segment indexes (0-based) by weekday (Sun..Sat):
 *  - Rahu:   [7,1,6,4,5,3,2]  => Sun 8th, Mon 2nd, Tue 7th, Wed 5th, Thu 6th, Fri 4th, Sat 3rd
 *  - Gulika: [6,5,4,3,2,1,0]  => Sun 7th, Mon 6th, Tue 5th, Wed 4th, Thu 3rd, Fri 2nd, Sat 1st
 */
function computeDayKaalam(date: Date, sunrise: string, sunset: string) {
  const wd = date.getDay(); // 0=Sun..6=Sat
  const sr = hhmmToMin(sunrise || "06:00");
  const ss = hhmmToMin(sunset  || "18:00");
  const dayLen = Math.max(1, ss - sr); // minutes
  const seg = dayLen / 8;

  // 0-based segment indexes for Sun..Sat
  const RAHU_INDEX     = [7, 1, 6, 4, 5, 3, 2] as const;
  const GULIKA_INDEX   = [6, 5, 4, 3, 2, 1, 0] as const;
  const YAMAGANDA_INDEX= [4, 3, 2, 1, 0, 6, 5] as const; // ← new

  const rahuStart = sr + seg * RAHU_INDEX[wd];
  const guliStart = sr + seg * GULIKA_INDEX[wd];
  const yamaStart = sr + seg * YAMAGANDA_INDEX[wd];

  return {
    rahu:       { start: minToHHMM(rahuStart), end: minToHHMM(rahuStart + seg) },
    gulika:     { start: minToHHMM(guliStart), end: minToHHMM(guliStart + seg) },
    yamagandam: { start: minToHHMM(yamaStart), end: minToHHMM(yamaStart + seg) }, // ← new
  };
}

// ---------- main (stub + computed kaal) ----------
export async function calcPanchang(
  date: Date,
  _lat: number,
  _lon: number,
  _tz: string
): Promise<RawPanchang> {
  // For now we use simple stub sunrise/sunset (replace with real sun calc/API later)
  const sunrise = "06:06";
  const sunset  = "18:29";

   const kaal = computeDayKaalam(date, sunrise, sunset);

  // Stub values for the rest; replace when you wire your real GG Panchang.
  // This shape is enough for now and is explicitly cast to RawPanchang.
  return {
    tithi: {
      name: "Shukla Dwitiya",
      phase: "Waxing",
      endTime: "13:42",
    },
    nakshatra: {
      name: "Rohini",
      endTime: "19:05",
    },
    yoga: {
      name: "Siddhi",
      endTime: "21:30",
    },
    karana: {
      name: "Bava",
      endTime: "10:15",
    },
    sun: {
      sunrise,
      sunset,
    },
    moon: {
      moonrise: "--",
      moonset: "--",
    },
    kaal,
  } as unknown as RawPanchang;
}
