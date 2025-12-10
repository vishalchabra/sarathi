import type { PlanetPos, MarsPack } from "./types";
import { degDiff } from "./math";
import { aspectsOnto } from "./aspects"; // generic helper already exported

// ------------------------------------------------------------------
// Mars Traits
// ------------------------------------------------------------------
export const MARS_TRAITS = {
  role: "Mars is energy, courage, drive, competition, engineering, surgery, athletics, assertion.",
  strengths: [
    "Initiative, bravery, sharp focus, technical skill",
    "Decisiveness, ability to fight obstacles, endurance"
  ],
  weaknesses: [
    "Anger, impulsiveness, accidents, conflicts",
    "Harsh speech, impatience, burns/inflammations"
  ]
};

// ------------------------------------------------------------------
// House meanings (1–12) — seed text
// ------------------------------------------------------------------
export const MARS_HOUSE_MEANINGS: Record<number, string> = {
  1: "Bold presence, athletic drive; watch impatience.",
  2: "Direct speech, assertive earning; expenses on gear/tools.",
  3: "Courage in communication, siblings; short trips, sales.",
  4: "Heat at home/vehicles; strong will in property matters.",
  5: "Competitive creativity, sports, romance with intensity.",
  6: "Excellent for competition/service; fights diseases/enemies.",
  7: "Passionate partnerships; manage arguments/ego clashes.",
  8: "Intense transformations; research/surgery/occult drive.",
  9: "Adventurous dharma; direct views; pilgrimages/long travel.",
  10: "Career leadership; engineering/defense/operations roles.",
  11: "Results via action; friends are doers; gains from projects.",
  12: "Hidden battles; foreign lands; expenses on action/health."
};

// ------------------------------------------------------------------
// Nakshatra meanings (27) — seed text
// ------------------------------------------------------------------
export const MARS_NAKSHATRA_MEANINGS: Record<string, string> = {
  Ashwini: "Fast starts, healing through action, pioneering moves.",
  Bharani: "Endurance under pressure; disciplined aggression.",
  Krittika: "Surgical precision; cutting through obstacles.",
  Rohini: "Productive drive in building/creation; possessive heat.",
  Mrigashira: "Explorer-warrior; questing, tactical moves.",
  Ardra: "Storm force; cathartic breakthroughs, raw power.",
  Punarvasu: "Reset after battle; resilience, regrouping.",
  Pushya: "Disciplined effort, service-oriented action.",
  Ashlesha: "Covert/tactical action; binding strategies.",
  Magha: "Lineage pride; protective, royal command.",
  "Purva Phalguni": "Playful competitiveness; charm + heat.",
  "Uttara Phalguni": "Contracts executed; duty-driven action.",
  Hasta: "Skilled hands; craftsmanship, martial arts.",
  Chitra: "Designer-engineer; structure + aesthetics.",
  Swati: "Independent mover; wind-like adaptability.",
  Vishakha: "Goal-locked perseverance; split-path tactics.",
  Anuradha: "Devoted fighter; loyalty, strategic alliances.",
  Jyeshtha: "Elite commander vibe; protective heat.",
  Mula: "Root-cutter; radical actions, deep surgery.",
  "Purva Ashadha": "Victorious surge; morale booster.",
  "Uttara Ashadha": "Righteous action; disciplined victory.",
  Shravana: "Operates by intel; listens then strikes.",
  Dhanishta: "Rhythm + coordination; team operations.",
  Shatabhisha: "Diagnostic/repair force; tech & healing.",
  "Purva Bhadrapada": "Intense tapas; transformative fire.",
  "Uttara Bhadrapada": "Contained power; patient endurance.",
  Revati: "Protective travels; finishing strong."
};

// ------------------------------------------------------------------
// Mars own aspects: 4th, 7th, 8th
// ------------------------------------------------------------------
function marsOwnAspects(mars: PlanetPos) {
  const to = (offset: number) => ((mars.house + offset - 1 - 1 + 12) % 12) + 1;
  return [
    `Mars aspects House ${to(4)} (4th)`,
    `Mars aspects House ${to(7)} (7th)`,
    `Mars aspects House ${to(8)} (8th)`
  ];
}

// ------------------------------------------------------------------
// Conjunctions & clusters
// ------------------------------------------------------------------
function detectConjunctionsAndClusters(positions: PlanetPos[]) {
  const mars = positions.find(p => p.id === "Mars")!;
  const conj: string[] = [];

  for (const p of positions) {
    if (p.id !== "Mars" && degDiff(p.lon, mars.lon) < 8) conj.push(p.id);
  }

  const clusters: string[] = [];
  const has = (id: string) => conj.includes(id);

  if (has("Saturn")) clusters.push("Mars+Saturn");
  if (has("Rahu"))   clusters.push("Mars+Rahu");
  if (has("Ketu"))   clusters.push("Mars+Ketu");
  if (has("Venus"))  clusters.push("Mars+Venus");
  if (has("Mercury"))clusters.push("Mars+Mercury");
  if (has("Moon"))   clusters.push("Mars+Moon");

  // 3–4 planet examples (expand as needed)
  if (has("Saturn") && has("Rahu")) clusters.push("Mars+Saturn+Rahu");
  if (has("Venus") && has("Mercury")) clusters.push("Mars+Venus+Mercury");
  if (has("Moon") && has("Jupiter")) clusters.push("Mars+Moon+Jupiter");

  return { conj, clusters };
}

// ------------------------------------------------------------------
// Yogas
// ------------------------------------------------------------------
function detectYogas(mars: PlanetPos, conj: string[]) {
  const yogas: string[] = [];

  // Mahapurusha: Ruchaka (Mars in own/exaltation in Kendra)
  const own = mars.sign === "Aries" || mars.sign === "Scorpio";
  const exalt = mars.sign === "Capricorn";
  const kendra = [1,4,7,10].includes(mars.house);
  if ((own || exalt) && kendra) yogas.push("Ruchaka Mahapurusha");

  // Chandra-Mangal (with Moon)
  if (conj.includes("Moon")) yogas.push("Chandra-Mangal Yoga (finance/enterprise)");

  // Neechbhang possibilities etc. (leave for later detailed rules)
  // Add more as you expand.

  return yogas;
}

// ------------------------------------------------------------------
// Remedies
// ------------------------------------------------------------------
function marsRemedies() {
  return [
    "Channel energy into disciplined exercise or martial arts.",
    "Avoid impulsive speech; count to 10 before reacting.",
    "Tuesdays: offer red lentils or work of service.",
  ];
}

// ------------------------------------------------------------------
// Main builder
// ------------------------------------------------------------------
export function buildMarsPack(positions: PlanetPos[]): MarsPack {
  const mars = positions.find(p => p.id === "Mars");
  if (!mars) throw new Error("Mars not found in positions");

  const { conj, clusters } = detectConjunctionsAndClusters(positions);
  const yogas = detectYogas(mars, conj);
  const aspects_on_mars = aspectsOnto("Mars", positions); // from others onto Mars
  const marsAspectLines = marsOwnAspects(mars);

  const houseText = MARS_HOUSE_MEANINGS[mars.house] || "";
  const nakText = mars.nakName ? MARS_NAKSHATRA_MEANINGS[mars.nakName] || "" : "";

  // primitive scores (tune later)
  const scores = {
    drive: 75,
    courage: 80,
    conflict: 55, // lower is better; indicates friction potential
    health: 65
  };

  return {
    planet: "Mars",
    natal: {
      sign: mars.sign,
      house: mars.house,
      deg: mars.deg,
      nak: mars.nakName ? { name: mars.nakName, pada: mars.pada! } : undefined,
    },
    features: { yogas, conjunctions: conj, clusters, aspects_on_mars } as any,
    scores,
    windows: [],
    explain: [
      `♂ Traits: ${MARS_TRAITS.role}`,
      `Strengths: ${MARS_TRAITS.strengths.join("; ")}`,
      `Weaknesses: ${MARS_TRAITS.weaknesses.join("; ")}`,
      `House → ${houseText}`,
      mars.nakName ? `Nakshatra → ${mars.nakName}: ${nakText}` : "",
      yogas.length ? `Yogas → ${yogas.join(", ")}` : "",
      conj.length ? `Conjunctions → ${conj.join(", ")}` : "",
      clusters.length ? `Clusters → ${clusters.join("; ")}` : "",
      aspects_on_mars.length ? `Aspected by → ${aspects_on_mars.map(a => `${a.from} (${a.kind})`).join(", ")}` : "",
      ...marsAspectLines
    ].filter(Boolean),
    remedies: marsRemedies(),
  };
}
