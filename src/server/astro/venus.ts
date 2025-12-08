import type { PlanetPos } from "./types";
import { degDiff } from "./math";
import { aspectsOnto } from "./aspects";

// ------------------------------------------------------------
// Venus Traits
// ------------------------------------------------------------
export const VENUS_TRAITS = {
  role: "Venus is love, beauty, relationships, art, luxury, comfort, creativity, and attraction.",
  strengths: [
    "Artistic sense, diplomacy, charm, creativity, relationship harmony",
    "Financial acumen, sensual enjoyment, aesthetic refinement",
  ],
  weaknesses: [
    "Overindulgence, laziness, dependency, vanity",
    "Attachment, escapism, excessive desire for pleasure",
  ],
};

// ------------------------------------------------------------
// House meanings (1–12)
// ------------------------------------------------------------
export const VENUS_HOUSE_MEANINGS: Record<number, string> = {
  1: "Charming personality, attractive, artistic aura.",
  2: "Sweet speech, love for luxury, material gains through family.",
  3: "Grace in communication, writing, and arts; affectionate siblings.",
  4: "Comfortable home, love for decoration, emotional security.",
  5: "Romantic creativity, artistic children, passion in love.",
  6: "Conflicts in relationships; artistic healing; love at workplace.",
  7: "Strong partnerships; focus on marriage, sensual pleasures.",
  8: "Hidden desires, transformation through love, occult charm.",
  9: "Love for travel, learning, and philosophy; teaching arts.",
  10: "Creative professions; fame through beauty/art; balance in authority.",
  11: "Profits through art, networks, or romantic associations.",
  12: "Love in foreign lands; spiritualized pleasure; indulgent dreams.",
};

// ------------------------------------------------------------
// Nakshatra meanings (27)
// ------------------------------------------------------------
export const VENUS_NAKSHATRA_MEANINGS: Record<string, string> = {
  Ashwini: "Playful affection; fast romantic impulses.",
  Bharani: "Sensual depth, endurance in relationships.",
  Krittika: "Fiery attraction; beauty with intensity.",
  Rohini: "Ultimate charm; artistic fertility and allure.",
  Mrigashira: "Flirtatious curiosity; aesthetic experimentation.",
  Ardra: "Emotional intensity; love transforms through pain.",
  Punarvasu: "Renewal of affection; comforting bonds.",
  Pushya: "Nourishing love; grounded care and service.",
  Ashlesha: "Magnetic attraction; binding emotional intensity.",
  Magha: "Regal charm; pride in relationships.",
  "Purva Phalguni": "Pleasure, luxury, relaxation; love of life.",
  "Uttara Phalguni": "Partnership duty; affection through responsibility.",
  Hasta: "Skillful hands; creative crafts and romance.",
  Chitra: "Beauty and design brilliance; magnetic expression.",
  Swati: "Independent charm; free-spirited love.",
  Vishakha: "Focused attraction; persuasive charm.",
  Anuradha: "Devotional love; loyalty and friendship.",
  Jyeshtha: "Mature love; protective affection.",
  Mula: "Intense desires; karmic attraction and detachment.",
  "Purva Ashadha": "Celebration of beauty; victory in relationships.",
  "Uttara Ashadha": "Grace through truth; noble love.",
  Shravana: "Listening partner; musical/artistic skill.",
  Dhanishta: "Rhythmic expression; wealth through creativity.",
  Shatabhisha: "Healing love; detached compassion.",
  "Purva Bhadrapada": "Transformative love; self-sacrifice.",
  "Uttara Bhadrapada": "Deep patience; emotional endurance.",
  Revati: "Kindness, empathy, artistic generosity.",
};

// ------------------------------------------------------------
// Venus’ own aspect → only 7th
// ------------------------------------------------------------
function venusOwnAspect(ve: PlanetPos) {
  const to7 = ((ve.house + 6 - 1) % 12) + 1;
  return [`Venus aspects House ${to7} (7th)`];
}

// ------------------------------------------------------------
// Conjunctions & clusters
// ------------------------------------------------------------
function detectConjunctionsAndClusters(positions: PlanetPos[]) {
  const ve = positions.find(p => p.id === "Venus")!;
  const conj: string[] = [];

  for (const p of positions) {
    if (p.id !== "Venus" && degDiff(p.lon, ve.lon) < 8) conj.push(p.id);
  }

  const clusters: string[] = [];
  const has = (id: string) => conj.includes(id);

  if (has("Sun")) clusters.push("Venus+Sun");
  if (has("Mercury")) clusters.push("Venus+Mercury");
  if (has("Moon")) clusters.push("Venus+Moon");
  if (has("Mars")) clusters.push("Venus+Mars");
  if (has("Jupiter")) clusters.push("Venus+Jupiter");
  if (has("Saturn")) clusters.push("Venus+Saturn");

  if (has("Sun") && has("Mercury")) clusters.push("Sun+Mercury+Venus");
  if (has("Moon") && has("Mars")) clusters.push("Moon+Mars+Venus");
  if (has("Venus") && has("Jupiter")) clusters.push("Venus+Jupiter+Mercury");

  return { conj, clusters };
}

// ------------------------------------------------------------
// Yogas
// ------------------------------------------------------------
function detectYogas(ve: PlanetPos, conj: string[]) {
  const yogas: string[] = [];

  if (conj.includes("Mercury")) yogas.push("Shukra-Budha Yoga (art + intellect)");
  if (conj.includes("Moon")) yogas.push("Chandra-Shukra Yoga (emotional artistry)");
  if (conj.includes("Mars")) yogas.push("Shukra-Mangal Yoga (passionate creativity)");

  // Malavya Mahapurusha: Venus in own/exalt (Taurus/Libra/Pisces) in Kendra
  const own = ve.sign === "Taurus" || ve.sign === "Libra";
  const exalt = ve.sign === "Pisces";
  const kendra = [1, 4, 7, 10].includes(ve.house);
  if ((own || exalt) && kendra) yogas.push("Malavya Mahapurusha");

  return yogas;
}

// ------------------------------------------------------------
// Remedies
// ------------------------------------------------------------
function venusRemedies() {
  return [
    "Avoid overindulgence; cultivate gratitude in relationships.",
    "Offer white flowers or sweets on Fridays.",
    "Chant 'Om Shukraya Namah' or help artists/teachers.",
  ];
}

// ------------------------------------------------------------
// Builder
// ------------------------------------------------------------
export function buildVenusPack(positions: PlanetPos[]) {
  const ve = positions.find(p => p.id === "Venus");
  if (!ve) throw new Error("Venus not found in positions");

  const { conj, clusters } = detectConjunctionsAndClusters(positions);
  const yogas = detectYogas(ve, conj);
  const aspects_on_venus = aspectsOnto("Venus", positions);
  const ownAspect = venusOwnAspect(ve);

  const houseText = VENUS_HOUSE_MEANINGS[ve.house] || "";
  const nakText = ve.nakName ? VENUS_NAKSHATRA_MEANINGS[ve.nakName] || "" : "";

  const scores = {
    love: 85,
    beauty: 90,
    finance: 75,
    attachment: 65,
  };

  return {
    planet: "Venus",
    natal: {
      sign: ve.sign,
      house: ve.house,
      deg: ve.deg,
      nak: ve.nakName ? { name: ve.nakName, pada: ve.pada! } : undefined,
    },
    features: { yogas, conjunctions: conj, clusters, aspects_on_venus },
    scores,
    windows: [],
    explain: [
      `♀ Traits: ${VENUS_TRAITS.role}`,
      `Strengths: ${VENUS_TRAITS.strengths.join("; ")}`,
      `Weaknesses: ${VENUS_TRAITS.weaknesses.join("; ")}`,
      `House → ${houseText}`,
      ve.nakName ? `Nakshatra → ${ve.nakName}: ${nakText}` : "",
      yogas.length ? `Yogas → ${yogas.join(", ")}` : "",
      conj.length ? `Conjunctions → ${conj.join(", ")}` : "",
      clusters.length ? `Clusters → ${clusters.join("; ")}` : "",
      aspects_on_venus.length ? `Aspected by → ${aspects_on_venus.map(a => `${a.from} (${a.kind})`).join(", ")}` : "",
      ...ownAspect,
    ].filter(Boolean),
    remedies: venusRemedies(),
  };
}
