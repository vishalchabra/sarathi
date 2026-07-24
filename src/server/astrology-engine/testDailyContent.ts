import { generateDailyPredictionContent } from "./generators/dailyPredictionGenerator";

const output = generateDailyPredictionContent({
  date: "7 July 2026",
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

console.log(JSON.stringify(output, null, 2));