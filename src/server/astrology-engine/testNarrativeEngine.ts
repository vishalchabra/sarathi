import { judgeAllAscendants } from "./judgement/ascendantJudgementEngine";
import { buildAllAscendantNarratives } from "./narrative/narrativeEngine";

const judgements = judgeAllAscendants({
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

const narratives = buildAllAscendantNarratives(judgements);

console.log(JSON.stringify(narratives, null, 2));