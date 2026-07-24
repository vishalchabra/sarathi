import { judgeSky } from "./judgement/skyJudgementEngine";

const judgement = judgeSky({
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
    Saturn: {
      sign: "Pisces",
    },
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
  },
});

console.log(JSON.stringify(judgement, null, 2));