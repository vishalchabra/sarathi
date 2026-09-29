import "server-only";
import { buildDataEngine } from "../dataEngine/buildDataEngine";

const dates = [
  "2026-09-27",
  "2026-09-28",
  "2026-09-29",
  "2026-09-30",
  "2026-10-01",
  "2026-10-02",
  "2026-10-03",
];
const birth = {
  dateISO: "1984-01-21",
  time: "23:35",
  timezone: "Asia/Kolkata",
  lat: 29.9679,
  lon: 77.5452,
};

const currentPlace = {
  name: "Dubai",
  lat: 25.2048,
  lon: 55.2708,
  timezone: "Asia/Dubai",
};
async function main() {
  for (const selectedDateISO of dates) {
    const result = await buildDataEngine({
      birth,
      currentPlace,
      selectedDateISO,
      plan: "light",
    });

    console.log(
      "\n[SEVEN DAY RESULT]",
      JSON.stringify(
        {
          date: selectedDateISO,
          moon: result.transits.transitNow?.moonToday,
          dasha: result.timing.dasha?.activeForPrediction,
          prediction: result.prediction.personalizedDaily,
        },
        null,
        2
      )
    );
  }
}

main().catch(console.error);