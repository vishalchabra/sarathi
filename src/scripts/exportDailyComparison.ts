
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { buildDataEngine } from "../server/dataEngine/buildDataEngine";

// Use the same birth details as your saved profile.
const birth = {
  dateISO: "1984-01-21",
  time: "23:35",
  timezone: "Asia/Kolkata",
  lat: 29.968,
  lon: 77.546,
};

const YEAR = 2026;
const MONTH = 10;

type ComparisonRow = {
  date: string;
  primaryArea: string;
  primaryScore: number | null;
  primaryPolarity: string;
  secondaryAreas: string;
};

function csvCell(value: unknown): string {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

async function main() {
  const rows: ComparisonRow[] = [];

  const daysInMonth = new Date(
    Date.UTC(YEAR, MONTH, 0)
  ).getUTCDate();

  for (const day of [3, 10, 20]) {
    const date = [
      YEAR,
      String(MONTH).padStart(2, "0"),
      String(day).padStart(2, "0"),
    ].join("-");

    ;

    const result = await buildDataEngine({
      birth,
      plan: "pro",
      selectedDateISO: date,
    });

    const prediction = result.prediction.personalizedDaily;

    rows.push({
      date,
      primaryArea: prediction.primaryTheme?.area ?? "",
      primaryScore:
        prediction.primaryTheme?.priorityScore ?? null,
      primaryPolarity:
        prediction.primaryTheme?.polarity ?? "",
      secondaryAreas: prediction.secondaryThemes
        .map((theme) => theme.area)
        .join("; "),
    });
  }

  const headers: (keyof ComparisonRow)[] = [
    "date",
    "primaryArea",
    "primaryScore",
    "primaryPolarity",
    "secondaryAreas",
  ];

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((header) => csvCell(row[header])).join(",")
    ),
  ].join("\n");

  const outputDir = path.join(process.cwd(), "reports");
  await mkdir(outputDir, { recursive: true });

  const outputPath = path.join(
    outputDir,
    "october-2026-daily-comparison.csv"
  );

  await writeFile(outputPath, csv, "utf8");
  ;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});