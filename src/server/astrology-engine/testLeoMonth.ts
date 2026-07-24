import { judgeAscendant } from "./judgement/ascendantJudgementEngine";
import { buildAscendantNarrative } from "./narrative/narrativeEngine";
import type { ZodiacSign } from "./types";
import { ordinal } from "./utils/ordinal";
const SIGNS: ZodiacSign[] = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

for (const moonSign of SIGNS) {
  const judgement = judgeAscendant({
    date: `Test Moon in ${moonSign}`,
    moon: {
      sign: moonSign,
      nakshatra: "Ashwini",
      conjunctions: [],
    },
  }, "Leo");

  const narrative = buildAscendantNarrative(judgement);

  console.log("\n=================================================");
  console.log(`Moon in ${moonSign}`);
  console.log(`Leo Ascendant | Moon House: ${judgement.moonHouse}`);
  console.log(`Moon Lordship: ${ordinal(judgement.moonLordshipHouse)} Lord`);
  console.log("=================================================");

  console.log(`\nHeadline:\n${narrative.headline}`);

  console.log(`\nStory:\n${narrative.story}`);

  console.log("\nWhat might happen:");
  for (const item of narrative.whatMightHappen) {
    console.log(`• ${item}`);
  }

  console.log("\nCautions:");
  for (const item of narrative.cautions) {
    console.log(`• ${item}`);
  }

  console.log(`\nBest use:\n${narrative.bestUse}`);

  console.log("\nWhy:");
  for (const item of narrative.why) {
    console.log(`• ${item}`);
  }
}