import { analyzeMoon } from "./analyzers/moonAnalyzer";
import { analyzeAscendantMoonTransit } from "./analyzers/ascendantAnalyzer";

const moon = analyzeMoon({
  sign: "Pisces",
  nakshatra: "Uttara Bhadrapada",
  nextNakshatra: {
    name: "Revati",
    time: "5:10 PM",
  },
  conjunctions: ["Saturn"],
});

console.log("MOON ANALYSIS");
console.log(JSON.stringify(moon, null, 2));

console.log("ARIES ANALYSIS");
console.log(
  JSON.stringify(
    analyzeAscendantMoonTransit({
      ascendant: "Aries",
      moonSign: "Pisces",
    }),
    null,
    2
  )
);