import {
  generateDailyPredictions,
  type DailySkyInput,
} from "./dailyPredictionEngine";

const input: DailySkyInput = {
  date: "2026-07-07",
  moon: {
    sign: "Pisces",
    nakshatra: "Uttara Bhadrapada",
    nextNakshatra: {
      name: "Revati",
      time: "5:10 PM",
    },
    conjunctions: ["Saturn"],
  },
  planets: {
    Mars: {
      sign: "Taurus",
      nakshatra: "Rohini",
    },
    Venus: {
      sign: "Leo",
    },
    Ketu: {
      sign: "Leo",
    },
    Saturn: {
      sign: "Pisces",
    },
  },
  specialNotes: [
    "Moon remains in Pisces all day.",
    "Only nakshatra changes after 5:10 PM.",
  ],
};

const predictions = generateDailyPredictions(input);

console.log(JSON.stringify(predictions, null, 2));