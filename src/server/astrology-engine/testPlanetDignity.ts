import {
  getPlanetDignityInterpretation,
} from "./knowledge/planetDignity";

const tests = [
  ["Jupiter", "Cancer"],
  ["Jupiter", "Capricorn"],
  ["Saturn", "Libra"],
  ["Saturn", "Aries"],
  ["Mercury", "Virgo"],
  ["Mercury", "Gemini"],
  ["Venus", "Pisces"],
  ["Venus", "Virgo"],
  ["Mars", "Capricorn"],
  ["Mars", "Cancer"],
  ["Sun", "Aries"],
  ["Sun", "Libra"],
  ["Moon", "Taurus"],
  ["Moon", "Scorpio"],
  ["Rahu", "Aquarius"],
  ["Ketu", "Leo"],
] as const;

for (const [planet, sign] of tests) {
  const result = getPlanetDignityInterpretation(
    planet,
    sign
  );

  console.log({
    planet: result.planet,
    sign: result.sign,
    dignity: result.dignity,
    strength: result.strength,
  });
}