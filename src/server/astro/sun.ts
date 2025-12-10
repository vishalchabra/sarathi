import type { PlanetPos, SunPack } from "./types";
import { degDiff } from "./math";
import { aspectsOntoSun } from "./aspects";
import { sunDignity } from "./dignity";

// ------------------------------------------------------------------
// 1. Sun General Traits
// ------------------------------------------------------------------
export const SUN_TRAITS = {
  role: "The Sun is the soul (Atmakaraka), giver of vitality, ego, authority, father, and recognition.",
  strengths: [
    "Leadership, confidence, clarity of purpose",
    "Vitality, ambition, self-expression",
    "Capacity to guide and inspire"
  ],
  weaknesses: [
    "Ego, arrogance, domination",
    "Rigidity, lack of humility",
    "Over-identification with status"
  ]
};

// ------------------------------------------------------------------
// 2. Sun House Placement Meanings (1–12)
// ------------------------------------------------------------------
export const SUN_HOUSE_MEANINGS: Record<number, string> = {
  1: "Strong personality, vitality, natural authority; may face ego challenges.",
  2: "Focus on wealth, family pride, and authoritative speech.",
  3: "Courage, siblings, communication; adventurous and restless authority.",
  4: "Influence on home, mother, real estate, and inner security.",
  5: "Creativity, children, intelligence, romance; pride in expression.",
  6: "Service, health, enemies; competitive but health vulnerable.",
  7: "Partnerships, spouse, business alliances; ego clashes possible.",
  8: "Transformation, occult, inheritance; sudden intense changes.",
  9: "Religion, dharma, father, higher learning; noble and guiding.",
  10: "Career, authority, reputation; strong leadership role.",
  11: "Gains, networks, ambitions, fulfillment of desires.",
  12: "Spirituality, foreign lands, detachment, expenditure."
};

// ------------------------------------------------------------------
// 3. Sun Nakshatra Placement Meanings (27)
// ------------------------------------------------------------------
export const SUN_NAKSHATRA_MEANINGS: Record<string, string> = {
  Ashwini: "Pioneering authority, quick healing energy.",
  Bharani: "Leadership tested through endurance and responsibility.",
  Krittika: "Fiery determination, sharp authority, cleansing role.",
  Rohini: "Creative authority, charm, fertility of ideas.",
  Mrigashira: "Curious leader, exploratory vision, restless drive.",
  Ardra: "Transformative authority, storms leading to renewal.",
  Punarvasu: "Resilient leader, nurturing, return to light.",
  Pushya: "Disciplined authority, nourishing, spiritual maturity.",
  Ashlesha: "Penetrating authority, secretive, binding influence.",
  Magha: "Ancestral pride, throne, dignified leadership.",
  "Purva Phalguni": "Pleasure-oriented leader, charm, creativity.",
  "Uttara Phalguni": "Contracts, noble service, responsible authority.",
  Hasta: "Skillful authority, persuasive charm, manual brilliance.",
  Chitra: "Designer-leader, aesthetic vision, charisma.",
  Swati: "Independent authority, adaptable, freedom-seeking.",
  Vishakha: "Ambitious leader, dual paths, perseverance to goals.",
  Anuradha: "Devoted authority, loyalty, spiritual friendship.",
  Jyeshtha: "Elder authority, responsibility, inner strength.",
  Mula: "Root-seeker, transformative authority, truth-piercing.",
  "Purva Ashadha": "Victorious authority, enthusiastic, social warmth.",
  "Uttara Ashadha": "Dignified leadership, unyielding truth.",
  Shravana: "Listening authority, wisdom from traditions.",
  Dhanishta: "Rhythmic authority, prosperity, fame.",
  Shatabhisha: "Healing authority, mystical, individuality.",
  "Purva Bhadrapada": "Visionary authority, tapas, transformation.",
  "Uttara Bhadrapada": "Stable authority, depth, patience.",
  Revati: "Compassionate leader, protector, safe journeys."
};

// ------------------------------------------------------------------
// 4. Sun’s Own Aspect (always 7th house from placement)
// ------------------------------------------------------------------
function sunAspects(sun: PlanetPos) {
  const aspectHouse = ((sun.house + 6 - 1) % 12) + 1; // 7th from Sun
  return [`Sun aspects House ${aspectHouse}`];
}

// ------------------------------------------------------------------
// 5. Detect Conjunctions & Clusters
// ------------------------------------------------------------------
function detectConjunctionsAndClusters(positions: PlanetPos[]) {
  const sun = positions.find(p => p.id === "Sun")!;
  const conj: string[] = [];

  for (const p of positions) {
    if (p.id !== "Sun" && degDiff(p.lon, sun.lon) < 8) conj.push(p.id);
  }

  const clusters: string[] = [];
  if (conj.includes("Mercury") && conj.includes("Venus"))
    clusters.push("Sun+Mercury+Venus");
  if (conj.includes("Mars") && conj.includes("Saturn"))
    clusters.push("Sun+Mars+Saturn");
  if (conj.includes("Jupiter") && conj.includes("Saturn"))
    clusters.push("Sun+Jupiter+Saturn");
  if (conj.includes("Mercury") && conj.includes("Jupiter") && conj.includes("Venus"))
    clusters.push("Sun+Mercury+Venus+Jupiter");
  // add more cluster rules as needed

  return { conj, clusters };
}

// ------------------------------------------------------------------
// 6. Detect Yogas
// ------------------------------------------------------------------
function detectYogas(conj: string[]) {
  const yogas: string[] = [];
  if (conj.includes("Mercury")) yogas.push("Buddha Aditya Yoga");
  if (conj.includes("Jupiter")) yogas.push("Guru Aditya Yoga");
  if (conj.includes("Venus")) yogas.push("Surya-Shukra Yoga");
  if (conj.includes("Mars")) yogas.push("Surya-Mangal Yoga");
  if (conj.includes("Saturn")) yogas.push("Surya-Shani Yoga");
  if (conj.includes("Rahu")) yogas.push("Surya-Rahu (Grahan Yoga)");
  if (conj.includes("Ketu")) yogas.push("Surya-Ketu (Grahan Yoga)");
  return yogas;
}

// ------------------------------------------------------------------
// 7. Remedies
// ------------------------------------------------------------------
function sunRemedies(dignity: string) {
  const remedies = [
    "Perform Surya Namaskar at sunrise.",
    "Offer water (Arghya) to the Sun on Sundays.",
    "Chant Aditya Hridayam or Gayatri Mantra.",
  ];
  if (dignity === "debilitated") {
    remedies.push("Avoid arrogance, lead with service and humility.");
  }
  return remedies;
}

// ------------------------------------------------------------------
// 8. Main Builder
// ------------------------------------------------------------------
export function buildSunPack(positions: PlanetPos[]): SunPack {
  const sun = positions.find(p => p.id === "Sun");
  if (!sun) throw new Error("Sun not found in positions");

  const dignity = sunDignity(sun.sign);
  const { conj, clusters } = detectConjunctionsAndClusters(positions);
  const yogas = detectYogas(conj);
  const aspects_on_sun = aspectsOntoSun(positions);
  const sunOwnAspect = sunAspects(sun);

  const houseText = SUN_HOUSE_MEANINGS[sun.house] || "";
  const nakText = sun.nakName ? SUN_NAKSHATRA_MEANINGS[sun.nakName] || "" : "";

  return {
    planet: "Sun",
    natal: {
      sign: sun.sign,
      house: sun.house,
      deg: sun.deg,
      nak: sun.nakName ? { name: sun.nakName, pada: sun.pada! } : undefined,
    },
    features: { dignity, yogas, conjunctions: conj, clusters, aspects_on_sun } as any,
    scores: {
      career: dignity === "exalted" ? 90 : dignity === "own" ? 80 : dignity === "debilitated" ? 40 : 65,
      status: 75,
      vitality: 70,
      relationships: 55
    },
    windows: [], // fill with transits/dasha later
    explain: [
      `☀ Traits: ${SUN_TRAITS.role}`,
      `Strengths: ${SUN_TRAITS.strengths.join("; ")}`,
      `Weaknesses: ${SUN_TRAITS.weaknesses.join("; ")}`,
      `House placement → ${houseText}`,
      sun.nakName ? `Nakshatra → ${sun.nakName}: ${nakText}` : "",
      yogas.length ? `Yogas → ${yogas.join(", ")}` : "",
      conj.length ? `Conjunctions → ${conj.join(", ")}` : "",
      clusters.length ? `Clusters → ${clusters.join("; ")}` : "",
      aspects_on_sun.length ? `Aspected by → ${aspects_on_sun.map(a => `${a.from} (${a.kind})`).join(", ")}` : "",
      sunOwnAspect[0]
    ].filter(Boolean),
    remedies: sunRemedies(dignity),
  };
}
