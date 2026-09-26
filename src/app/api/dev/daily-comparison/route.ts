
import { NextResponse } from "next/server";
import { buildDataEngine } from "@/server/dataEngine/buildDataEngine";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Development only" },
      { status: 403 }
    );
  }

  const birth = {
    dateISO: "1984-01-21",
    time: "23:35",
    timezone: "Asia/Kolkata",
    lat: 29.968,
    lon: 77.546,
  };

  const rows = [];

  for (let day = 1; day <= 31; day++) {
    const date = `2026-10-${String(day).padStart(2, "0")}`;

    const result = await buildDataEngine({
      birth,
      plan: "pro",
      selectedDateISO: date,
    });

    const prediction = result.prediction.personalizedDaily;

    rows.push({
      date,
      primaryArea: prediction.primaryTheme?.area ?? null,
      primaryScore: prediction.primaryTheme?.priorityScore ?? null,
      primaryPolarity: prediction.primaryTheme?.polarity ?? null,
      secondaryAreas: prediction.secondaryThemes.map(
        (theme) => theme.area
      ),
      moonSign: prediction.dailyComparison?.moonSign ?? "",
moonNakshatra: prediction.dailyComparison?.moonNakshatra ?? "",
dailyFocus:
  prediction.dailyComparison?.dailyAreas[0]?.area ?? "",
dailyFocusImportance:
  prediction.dailyComparison?.dailyAreas[0]?.strongestImportance ?? "",
dailyFocusDashaScore:
  prediction.dailyComparison?.dailyAreas[0]?.dashaScore ?? "",
dailySignals:
  prediction.dailyComparison?.dailyAreas
    .map((item) =>
      `${item.area}: ${item.signals
        .map(
          (signal) =>
            `${signal.source}(${signal.importance},${signal.polarity})`
        )
        .join("|")}`
    )
    .join("; ") ?? "",
    });
  }

  const headers = [
  "date",
  "primaryArea",
  "primaryScore",
  "primaryPolarity",
  "secondaryAreas",
  "moonSign",
"moonNakshatra",
"dailyFocus",
"dailyFocusImportance",
"dailyFocusDashaScore",
"dailySignals",
];

const escapeCsv = (value: unknown): string =>
  `"${String(value ?? "").replace(/"/g, '""')}"`;

const csv = [
  headers.join(","),
  ...rows.map((row) =>
    [
      row.date,
      row.primaryArea,
      row.primaryScore,
      row.primaryPolarity,
      row.secondaryAreas.join("; "),
      row.moonSign,
row.moonNakshatra,
row.dailyFocus,
row.dailyFocusImportance,
row.dailyFocusDashaScore,
row.dailySignals,
    ]
      .map(escapeCsv)
      .join(",")
  ),
].join("\r\n");

return new Response(csv, {
  headers: {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition":
      'attachment; filename="october-2026-daily-comparison.csv"',
    "Cache-Control": "no-store",
  },
});
}