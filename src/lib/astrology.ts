// lib/astrology.ts
type Place = { name: string; lat: number; lon: number; tz?: string };

export async function getPanchangForDate(date: Date, place: Place) {
  return {
    tithi: { name: "Shukla Dwitiya", phase: "Waxing" },
    nakshatra: { name: "Rohini", pada: 2 },
    yoga: { name: "Siddhi" },
    karana: { name: "Bava" },
    sun: { sunrise: "06:06", sunset: "18:29" },
    moon: { moonrise: "10:45", moonset: "22:18" },
    kaal: { rahu: { start: "15:30", end: "17:00" }, gulika: { start: "12:00", end: "13:30" } },
    muhurtas: { abhijit: { start: "12:12", end: "12:59" } },
    festivals: ["—"],
    personalTip: "Focus on consistent effort over outcomes today.",
  } as const;
}

export function computeChartFromInput({ dob, tob, place }:{ dob: string; tob: string; place: any }) {
  return {
    dob,
    tob,
    place,
    asc: "Virgo",
    ascendant: "Virgo",   // ✅ add this
    moonSign: "Taurus",
    planets: {}
  } as const;
}

export function buildNarrative(chart: any) {
  const asc = chart.ascendant ?? chart.asc ?? "—";
  const moon = chart.moonSign ?? chart.moon?.sign ?? "—";

  return [
    `Ascendant: ${asc}. Your temperament values order and service.`,
    `Moon Sign: ${moon}. Emotional needs lean toward comfort and stability.`,
    `Professional signal: steady progress > quick wins this cycle.`,
  ];
}
