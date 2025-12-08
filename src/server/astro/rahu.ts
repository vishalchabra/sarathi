import type { PlanetPos } from "./types";
import { degDiff } from "./math";
import { aspectsOnto } from "./aspects";

// ------------------------------------------------------------
// Rahu Traits
// ------------------------------------------------------------
export const RAHU_TRAITS = {
  role: "Rahu represents obsession, desire, illusion, material ambition, foreign elements, innovation, and worldly success.",
  strengths: [
    "Courage to break boundaries, fascination with the new, worldly influence.",
    "Innovation, political savvy, survival skills, foreign connections.",
  ],
  weaknesses: [
    "Illusion, deception, anxiety, addictions, material attachment.",
    "Sudden rises and falls, obsession with control or recognition.",
  ],
};

// ------------------------------------------------------------
// House meanings (1–12)
// ------------------------------------------------------------
export const RAHU_HOUSE_MEANINGS: Record<number, string> = {
  1: "Charismatic yet unconventional personality; fame, eccentricity.",
  2: "Foreign wealth, unusual family patterns; skill in speech.",
  3: "Fearless communicator; success through media or tech.",
  4: "Foreign residence, emotional restlessness, unusual home life.",
  5: "Creative risk-taker; attraction to fame, speculative gains.",
  6: "Master of strategy; success over enemies through manipulation.",
  7: "Intense relationships; unconventional marriage or foreign spouse.",
  8: "Interest in occult, hidden knowledge, or risky ventures.",
  9: "Unorthodox beliefs; distant travel, new philosophies.",
  10: "Huge ambition; fame through innovation or controversy.",
  11: "Mass influence; social media power; material fulfillment.",
  12: "Foreign lands; escapism or enlightenment through extremes.",
};

// ------------------------------------------------------------
// Nakshatra meanings (27)
// ------------------------------------------------------------
export const RAHU_NAKSHATRA_MEANINGS: Record<string, string> = {
  Ashwini: "Rebellious healer; impatient for change.",
  Bharani: "Explores limits of morality; passion and indulgence.",
  Krittika: "Sharp strategist; uses intensity to dominate.",
  Rohini: "Material magnetism; charm with worldly focus.",
  Mrigashira: "Restless pursuit of novelty and stimulation.",
  Ardra: "Storm-maker; transforms chaos into new realities.",
  Punarvasu: "Restless return; repeats cycles to learn detachment.",
  Pushya: "Manipulates systems with discipline; influence via structure.",
  Ashlesha: "Hypnotic allure; hidden manipulative power.",
  Magha: "Political ambitions; leadership through lineage or influence.",
  "Purva Phalguni": "Pleasure-seeker; charm, fame, and indulgence.",
  "Uttara Phalguni": "Contracts and status; manipulates authority structures.",
  Hasta: "Dexterous planner; skilled trickster energy.",
  Chitra: "Designer of illusion; creative influencer.",
  Swati: "Free-spirited rebel; thrives in foreign or new systems.",
  Vishakha: "Ambitious conqueror; dual path of material success.",
  Anuradha: "Unorthodox loyalty; global friendships.",
  Jyeshtha: "Elite strategist; power through knowledge and secrecy.",
  Mula: "Karmic destroyer; rebuilds identity from ruins.",
  "Purva Ashadha": "Self-promoter; influencer through charm.",
  "Uttara Ashadha": "Unshakable will; fame through endurance.",
  Shravana: "Public speaker; persuasive communicator.",
  Dhanishta: "Rhythmic charisma; celebrity vibration.",
  Shatabhisha: "Scientific reformer; mystic innovator.",
  "Purva Bhadrapada": "Occult influencer; revolutionary spirit.",
  "Uttara Bhadrapada": "World reformer; insight into systems.",
  Revati: "Charming mystic; spiritual materialist duality.",
};

// ------------------------------------------------------------
// Rahu’s “aspects” (non-traditional but observed 5th, 7th, 9th in Vedic texts)
// ------------------------------------------------------------
function rahuOwnAspects(ra: PlanetPos) {
  const to = (offset: number) => ((ra.house + offset - 1 - 1 + 12) % 12) + 1;
  return [
    `Rahu aspects House ${to(5)} (5th)`,
    `Rahu aspects House ${to(7)} (7th)`,
    `Rahu aspects House ${to(9)} (9th)`,
  ];
}

// ------------------------------------------------------------
// Conjunctions & clusters
// ------------------------------------------------------------
function detectConjunctionsAndClusters(positions: PlanetPos[]) {
  const ra = positions.find(p => p.id === "Rahu")!;
  const conj: string[] = [];

  for (const p of positions) {
    if (p.id !== "Rahu" && degDiff(p.lon, ra.lon) < 8) conj.push(p.id);
  }

  const clusters: string[] = [];
  const has = (id: string) => conj.includes(id);

  if (has("Sun")) clusters.push("Rahu+Sun (illusion of power)");
  if (has("Moon")) clusters.push("Rahu+Moon (Grahan Yoga; emotional chaos)");
  if (has("Mercury")) clusters.push("Rahu+Mercury (smart manipulator)");
  if (has("Venus")) clusters.push("Rahu+Venus (glamour, attraction, addiction)");
  if (has("Mars")) clusters.push("Rahu+Mars (impulsive drive, accidents)");
  if (has("Jupiter")) clusters.push("Rahu+Jupiter (Guru-Chandal; wisdom distortion)");
  if (has("Saturn")) clusters.push("Rahu+Saturn (political endurance, delays)");

  return { conj, clusters };
}

// ------------------------------------------------------------
// Yogas
// ------------------------------------------------------------
function detectYogas(ra: PlanetPos, conj: string[]) {
  const yogas: string[] = [];

  if (conj.includes("Sun")) yogas.push("Rahu-Surya Yoga (fame & ego illusion)");
  if (conj.includes("Moon")) yogas.push("Grahan Yoga (mental restlessness)");
  if (conj.includes("Jupiter")) yogas.push("Guru-Chandal Yoga (distorted ethics)");
  if (conj.includes("Venus")) yogas.push("Rahu-Shukra Yoga (material seduction)");
  if (conj.includes("Mercury")) yogas.push("Rahu-Budha Yoga (strategic genius)");

  return yogas;
}

// ------------------------------------------------------------
// Remedies
// ------------------------------------------------------------
function rahuRemedies() {
  return [
    "Feed the poor or lepers; perform service without expectation.",
    "Meditate or fast on Saturdays; avoid addictions and excess.",
    "Chant 'Om Raahave Namah' and wear smoky quartz for grounding.",
  ];
}

// ------------------------------------------------------------
// Builder
// ------------------------------------------------------------
export function buildRahuPack(positions: PlanetPos[]) {
  const ra = positions.find(p => p.id === "Rahu");
  if (!ra) throw new Error("Rahu not found in positions");

  const { conj, clusters } = detectConjunctionsAndClusters(positions);
  const yogas = detectYogas(ra, conj);
  const aspects_on_rahu = aspectsOnto("Rahu", positions);
  const ownAspects = rahuOwnAspects(ra);

  const houseText = RAHU_HOUSE_MEANINGS[ra.house] || "";
  const nakText = ra.nakName ? RAHU_NAKSHATRA_MEANINGS[ra.nakName] || "" : "";

  const scores = { ambition: 90, illusion: 70, influence: 85, risk: 65 };

  return {
    planet: "Rahu",
    natal: {
      sign: ra.sign,
      house: ra.house,
      deg: ra.deg,
      nak: ra.nakName ? { name: ra.nakName, pada: ra.pada! } : undefined,
    },
    features: { yogas, conjunctions: conj, clusters, aspects_on_rahu },
    scores,
    windows: [],
    explain: [
      `☊ Traits: ${RAHU_TRAITS.role}`,
      `Strengths: ${RAHU_TRAITS.strengths.join("; ")}`,
      `Weaknesses: ${RAHU_TRAITS.weaknesses.join("; ")}`,
      `House → ${houseText}`,
      ra.nakName ? `Nakshatra → ${ra.nakName}: ${nakText}` : "",
      yogas.length ? `Yogas → ${yogas.join(", ")}` : "",
      conj.length ? `Conjunctions → ${conj.join(", ")}` : "",
      clusters.length ? `Clusters → ${clusters.join("; ")}` : "",
      aspects_on_rahu.length ? `Aspected by → ${aspects_on_rahu.map(a => `${a.from} (${a.kind})`).join(", ")}` : "",
      ...ownAspects,
    ].filter(Boolean),
    remedies: rahuRemedies(),
  };
}
