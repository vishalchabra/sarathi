import { synthesizeDailyPredictions } from "./core/reasoningEngine";

const predictions = synthesizeDailyPredictions({
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
});

console.log(JSON.stringify(predictions, null, 2));