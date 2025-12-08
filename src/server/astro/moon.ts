import type { PlanetPos, MoonPack } from "./types";
import { degDiff } from "./math";
import { aspectsOntoMoon } from "./aspects";
import { NAKSHATRAS } from "./nakshatra";

// ------------------------------------------------------------------
// 1. Moon General Traits
// ------------------------------------------------------------------
export const MOON_TRAITS = {
  role: "The Moon is the mind, emotions, mother, nourishment, receptivity, public, and daily fluctuations.",
  strengths: [
    "Emotional intelligence, adaptability, caring nature",
    "Creativity, imagination, empathy",
    "Strong connection with masses and public life"
  ],
  weaknesses: [
    "Mood swings, instability, over-sensitivity",
    "Dependency, lack of grounding",
    "Easily influenced by environment"
  ]
};

// ------------------------------------------------------------------
// 2. Moon House Placement Meanings (1–12)
// ------------------------------------------------------------------
export const MOON_HOUSE_MEANINGS: Record<number, string> = {
  1: "Strong emotions visible; personality shaped by sensitivity.",
  2: "Emotional connection with family, speech, food, and wealth.",
  3: "Emotional courage; connection with siblings and communication.",
  4: "Strong attachment to mother, home, property, education.",
  5: "Emotional creativity, love for children, artistic expression.",
  6: "Fluctuations in health, service; emotional stress with enemies.",
  7: "Emotional partnerships, marriage deeply felt.",
  8: "Emotional intensity; sudden transformations, mysticism.",
  9: "Faith, dharma, emotional bond with father, long travels.",
  10: "Career fluctuations, public life influenced by emotions.",
  11: "Emotional gains, friendships, group affiliations.",
  12: "Detachment, subconscious, dreams, foreign connections."
};

// ------------------------------------------------------------------
// 3. Moon Nakshatra Placement Meanings (27)
// ------------------------------------------------------------------
export const MOON_NAKSHATRA_MEANINGS: Record<string, string> = {
  Ashwini: "Quick emotions, pioneering but restless mind.",
  Bharani: "Emotional endurance; deep transformative feelings.",
  Krittika: "Sharp emotions, nurturing yet fiery.",
  Rohini: "Artistic, fertile, sensual and charming emotions.",
  Mrigashira: "Restless, seeking, curious emotions.",
  Ardra: "Stormy emotions, cathartic healing through tears.",
  Punarvasu: "Resilient, hopeful, emotionally nurturing.",
  Pushya: "Nourishing emotions, disciplined care.",
  Ashlesha: "Intense emotions, secretive, binding influence.",
  Magha: "Emotional pride in ancestors, dignity, respect.",
  "Purva Phalguni": "Pleasure-loving, indulgent, affectionate emotions.",
  "Uttara Phalguni": "Responsible emotions, duty in relationships.",
  Hasta: "Crafty, skillful emotions, charm and persuasion.",
  Chitra: "Creative, aesthetic, emotionally magnetic.",
  Swati: "Independent, free-moving, airy emotions.",
  Vishakha: "Ambitious, dual emotional paths, perseverance.",
  Anuradha: "Devoted emotions, loyal, spiritual friendships.",
  Jyeshtha: "Authority in emotions, elder role, responsibility.",
  Mula: "Emotionally piercing, root-seeking, transformative.",
  "Purva Ashadha": "Victorious emotions, enthusiasm, warm-hearted.",
  "Uttara Ashadha": "Stable, truth-oriented, emotionally dignified.",
  Shravana: "Listening, wise emotions, love for stories.",
  Dhanishta: "Generous, rhythmic, emotionally prosperous.",
  Shatabhisha: "Healing, mystical emotions, individuality.",
  "Purva Bhadrapada": "Intense, transformative emotional vision.",
  "Uttara Bhadrapada": "Stable emotions, patience, hidden depth.",
  Revati: "Compassionate, protective, kind-hearted emotions."
};

// ------------------------------------------------------------------
// 4. Moon’s Own Aspect (7th house)
// ------------------------------------------------------------------
function moonAspects(moon: PlanetPos) {
  const aspectHouse = ((moon.house + 6 - 1) % 12) + 1;
  return [`Moon aspects House ${aspectHouse}`];
}

// ------------------------------------------------------------------
// 5. Detect Conjunctions & Clusters
// ------------------------------------------------------------------
function detectConjunctionsAndClusters(positions: PlanetPos[]) {
  const moon = positions.find(p => p.id === "Moon")!;
  const conj: string[] = [];

  for (const p of positions) {
    if (p.id !== "Moon" && degDiff(p.lon, moon.lon) < 8) conj.push(p.id);
  }

  const clusters: string[] = [];
  if (conj.includes("Mercury") && conj.includes("Venus"))
    clusters.push("Moon+Mercury+Venus");
  if (conj.includes("Mars") && conj.includes("Saturn"))
    clusters.push("Moon+Mars+Saturn");
  if (conj.includes("Jupiter") && conj.includes("Venus"))
    clusters.push("Moon+Jupiter+Venus");
  if (conj.includes("Mercury") && conj.includes("Jupiter") && conj.includes("Venus"))
    clusters.push("Moon+Mercury+Venus+Jupiter");

  return { conj, clusters };
}

// ------------------------------------------------------------------
// 6. Detect Yogas (basic ones with Moon)
// ------------------------------------------------------------------
function detectYogas(conj: string[]) {
  const yogas: string[] = [];
  if (conj.includes("Sun")) yogas.push("Chandra-Aditya Yoga (balance of ego and mind)");
  if (conj.includes("Jupiter")) yogas.push("Gajakesari Yoga (prosperity, wisdom, popularity)");
  if (conj.includes("Mercury")) yogas.push("Moon-Mercury Yoga (intellect + emotions)");
  if (conj.includes("Venus")) yogas.push("Moon-Venus Yoga (artistic, romantic, luxury)");
  if (conj.includes("Saturn")) yogas.push("Moon-Saturn Yoga (stress, detachment, discipline)");
  if (conj.includes("Rahu")) yogas.push("Chandra-Rahu (Grahan Yoga, illusions)");
  if (conj.includes("Ketu")) yogas.push("Chandra-Ketu (Grahan Yoga, spiritual detachment)");
  return yogas;
}

// ------------------------------------------------------------------
// 7. Remedies
// ------------------------------------------------------------------
function moonRemedies() {
  return [
    "Offer milk, rice, or white sweets on Mondays.",
    "Chant Chandra mantra (Om Somaya Namah).",
    "Practice meditation for emotional balance.",
    "Respect and care for your mother."
  ];
}

// ------------------------------------------------------------------
// 8. Main Builder
// ------------------------------------------------------------------
export function buildMoonPack(positions: PlanetPos[]): MoonPack {
  const moon = positions.find(p => p.id === "Moon");
  if (!moon) throw new Error("Moon not found in positions");

  const { conj, clusters } = detectConjunctionsAndClusters(positions);
  const yogas = detectYogas(conj);
  const aspects_on_moon = aspectsOntoMoon(positions);
  const moonOwnAspect = moonAspects(moon);

  const houseText = MOON_HOUSE_MEANINGS[moon.house] || "";
  const nakText = moon.nakName ? MOON_NAKSHATRA_MEANINGS[moon.nakName] || "" : "";

  return {
    planet: "Moon",
    natal: {
      sign: moon.sign,
      house: moon.house,
      deg: moon.deg,
      nak: moon.nakName ? { name: moon.nakName, pada: moon.pada! } : undefined,
    },
    features: { yogas, conjunctions: conj, clusters, aspects_on_moon },
    scores: {
      mind: 75,
      emotions: 80,
      relationships: 70,
      public: 65
    },
    windows: [], // fill later with transit/dasha
    explain: [
      `🌙 Traits: ${MOON_TRAITS.role}`,
      `Strengths: ${MOON_TRAITS.strengths.join("; ")}`,
      `Weaknesses: ${MOON_TRAITS.weaknesses.join("; ")}`,
      `House placement → ${houseText}`,
      moon.nakName ? `Nakshatra → ${moon.nakName}: ${nakText}` : "",
      yogas.length ? `Yogas → ${yogas.join(", ")}` : "",
      conj.length ? `Conjunctions → ${conj.join(", ")}` : "",
      clusters.length ? `Clusters → ${clusters.join("; ")}` : "",
      aspects_on_moon.length ? `Aspected by → ${aspects_on_moon.map(a => `${a.from} (${a.kind})`).join(", ")}` : "",
      moonOwnAspect[0]
    ].filter(Boolean),
    remedies: moonRemedies(),
  };
}
