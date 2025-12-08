import type { PlanetPos } from "./types";
import { degDiff } from "./math";
import { aspectsOnto } from "./aspects";

// ------------------------------------------------------------
// Ketu Traits
// ------------------------------------------------------------
export const KETU_TRAITS = {
  role: "Ketu represents detachment, past-life mastery, moksha, spirituality, renunciation, and insight through loss.",
  strengths: [
    "Intuition, psychic awareness, deep analysis, past-life wisdom.",
    "Ability to let go, move inward, see truth beyond illusion.",
  ],
  weaknesses: [
    "Isolation, confusion, escapism, sudden separation, self-doubt.",
    "Lack of motivation for worldly success, melancholy.",
  ],
};

// ------------------------------------------------------------
// House meanings (1–12)
// ------------------------------------------------------------
export const KETU_HOUSE_MEANINGS: Record<number, string> = {
  1: "Detached personality; spiritual presence; unpredictable self-image.",
  2: "Breaks family patterns; detachment from wealth or possessions.",
  3: "Courageous yet solitary communicator; inner warrior.",
  4: "Separation from home; inner peace through solitude.",
  5: "Spiritual creativity; past-life mastery in intellect or arts.",
  6: "Detached service; wins hidden battles; immune strength.",
  7: "Detached or karmic partnerships; unusual spouse dynamics.",
  8: "Occult depth; mystical researcher; sudden transformations.",
  9: "Spiritual pilgrim; unusual faith; non-traditional beliefs.",
  10: "Detachment from authority; prefers spiritual vocation.",
  11: "Unusual friends; solitary benefactor; detachment from gains.",
  12: "Ultimate moksha; mystical seclusion; liberation through loss.",
};

// ------------------------------------------------------------
// Nakshatra meanings (27)
// ------------------------------------------------------------
export const KETU_NAKSHATRA_MEANINGS: Record<string, string> = {
  Ashwini: "Healing from past karma; intuitive action.",
  Bharani: "Endurance; releases attachments through pain.",
  Krittika: "Cuts illusions; disciplined detachment.",
  Rohini: "Releases desire for beauty; learns self-worth.",
  Mrigashira: "Curiosity turns inward; seeker of truth.",
  Ardra: "Purifies emotions; surrender through storms.",
  Punarvasu: "Spiritual renewal; cyclical awakening.",
  Pushya: "Service with humility; patience under pressure.",
  Ashlesha: "Psychic healing; mastery of emotional bindings.",
  Magha: "Ancestral liberation; ends ego lineage.",
  "Purva Phalguni": "Detachment from pleasure; self-reflection.",
  "Uttara Phalguni": "Service without expectation; renunciation.",
  Hasta: "Karmic healer; skill used for spiritual purpose.",
  Chitra: "Silent builder; creates sacred beauty.",
  Swati: "Independent mystic; free from attachments.",
  Vishakha: "Path of inner devotion; duality resolved.",
  Anuradha: "Deep devotion; friendship through spirit.",
  Jyeshtha: "Wisdom of withdrawal; elder mystic.",
  Mula: "Root detachment; dissolves illusion completely.",
  "Purva Ashadha": "Tests of pride; release leads to victory.",
  "Uttara Ashadha": "Righteous detachment; universal compassion.",
  Shravana: "Silent listener; spiritual learner.",
  Dhanishta: "Spiritual musician; liberation through rhythm.",
  Shatabhisha: "Healer of souls; isolation brings revelation.",
  "Purva Bhadrapada": "Mystic ascetic; intense tapas.",
  "Uttara Bhadrapada": "Calm sage; patient liberation.",
  Revati: "Compassionate ending; guidance to others’ peace.",
};

// ------------------------------------------------------------
// Ketu “aspects” (mirror Rahu’s 5th, 7th, 9th)
// ------------------------------------------------------------
function ketuOwnAspects(ke: PlanetPos) {
  const to = (offset: number) => ((ke.house + offset - 1 - 1 + 12) % 12) + 1;
  return [
    `Ketu aspects House ${to(5)} (5th)`,
    `Ketu aspects House ${to(7)} (7th)`,
    `Ketu aspects House ${to(9)} (9th)`,
  ];
}

// ------------------------------------------------------------
// Conjunctions & clusters
// ------------------------------------------------------------
function detectConjunctionsAndClusters(positions: PlanetPos[]) {
  const ke = positions.find(p => p.id === "Ketu")!;
  const conj: string[] = [];

  for (const p of positions) {
    if (p.id !== "Ketu" && degDiff(p.lon, ke.lon) < 8) conj.push(p.id);
  }

  const clusters: string[] = [];
  const has = (id: string) => conj.includes(id);

  if (has("Sun")) clusters.push("Ketu+Sun (detached ego)");
  if (has("Moon")) clusters.push("Ketu+Moon (Grahan Yoga; past emotional release)");
  if (has("Mercury")) clusters.push("Ketu+Mercury (intuitive intellect)");
  if (has("Venus")) clusters.push("Ketu+Venus (spiritual love, renunciation)");
  if (has("Mars")) clusters.push("Ketu+Mars (spiritual warrior)");
  if (has("Jupiter")) clusters.push("Ketu+Jupiter (moksha-oriented wisdom)");
  if (has("Saturn")) clusters.push("Ketu+Saturn (austerity, detachment from duty)");

  return { conj, clusters };
}

// ------------------------------------------------------------
// Yogas
// ------------------------------------------------------------
function detectYogas(ke: PlanetPos, conj: string[]) {
  const yogas: string[] = [];

  if (conj.includes("Sun")) yogas.push("Ketu-Surya Yoga (ego purification)");
  if (conj.includes("Moon")) yogas.push("Grahan Yoga (emotional detachment)");
  if (conj.includes("Jupiter")) yogas.push("Ketu-Guru Yoga (spiritual teacher)");
  if (conj.includes("Mars")) yogas.push("Ketu-Mangal Yoga (yogi-warrior)");
  if (conj.includes("Venus")) yogas.push("Ketu-Shukra Yoga (divine love)");

  return yogas;
}

// ------------------------------------------------------------
// Remedies
// ------------------------------------------------------------
function ketuRemedies() {
  return [
    "Meditate daily; silence is Ketu’s mantra.",
    "Offer blankets, sesame seeds, or coconut on Tuesdays/Saturdays.",
    "Chant 'Om Ketave Namah' and focus on forgiveness.",
  ];
}

// ------------------------------------------------------------
// Builder
// ------------------------------------------------------------
export function buildKetuPack(positions: PlanetPos[]) {
  const ke = positions.find(p => p.id === "Ketu");
  if (!ke) throw new Error("Ketu not found in positions");

  const { conj, clusters } = detectConjunctionsAndClusters(positions);
  const yogas = detectYogas(ke, conj);
  const aspects_on_ketu = aspectsOnto("Ketu", positions);
  const ownAspects = ketuOwnAspects(ke);

  const houseText = KETU_HOUSE_MEANINGS[ke.house] || "";
  const nakText = ke.nakName ? KETU_NAKSHATRA_MEANINGS[ke.nakName] || "" : "";

  const scores = { detachment: 90, spirituality: 85, insight: 80, loss: 60 };

  return {
    planet: "Ketu",
    natal: {
      sign: ke.sign,
      house: ke.house,
      deg: ke.deg,
      nak: ke.nakName ? { name: ke.nakName, pada: ke.pada! } : undefined,
    },
    features: { yogas, conjunctions: conj, clusters, aspects_on_ketu },
    scores,
    windows: [],
    explain: [
      `☋ Traits: ${KETU_TRAITS.role}`,
      `Strengths: ${KETU_TRAITS.strengths.join("; ")}`,
      `Weaknesses: ${KETU_TRAITS.weaknesses.join("; ")}`,
      `House → ${houseText}`,
      ke.nakName ? `Nakshatra → ${ke.nakName}: ${nakText}` : "",
      yogas.length ? `Yogas → ${yogas.join(", ")}` : "",
      conj.length ? `Conjunctions → ${conj.join(", ")}` : "",
      clusters.length ? `Clusters → ${clusters.join("; ")}` : "",
      aspects_on_ketu.length ? `Aspected by → ${aspects_on_ketu.map(a => `${a.from} (${a.kind})`).join(", ")}` : "",
      ...ownAspects,
    ].filter(Boolean),
    remedies: ketuRemedies(),
  };
}
