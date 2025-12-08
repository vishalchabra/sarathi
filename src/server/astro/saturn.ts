import type { PlanetPos } from "./types";
import { degDiff } from "./math";
import { aspectsOnto } from "./aspects";

// ------------------------------------------------------------
// Saturn Traits
// ------------------------------------------------------------
export const SATURN_TRAITS = {
  role: "Saturn represents karma, discipline, responsibility, endurance, justice, and humility. It teaches through delay and perseverance.",
  strengths: [
    "Patience, endurance, structure, resilience, hard work.",
    "Ability to sustain efforts, organize, and accept responsibility.",
  ],
  weaknesses: [
    "Fear, pessimism, rigidity, loneliness, procrastination.",
    "Harsh lessons, detachment, excessive seriousness.",
  ],
};

// ------------------------------------------------------------
// House meanings (1–12)
// ------------------------------------------------------------
export const SATURN_HOUSE_MEANINGS: Record<number, string> = {
  1: "Serious personality, hardworking, mature; slow to blossom.",
  2: "Cautious with wealth; disciplined speech; delayed family gains.",
  3: "Persistence in communication; hardworking siblings.",
  4: "Responsibilities at home; slow but steady property/building growth.",
  5: "Disciplined creativity; late success in education or children.",
  6: "Strong worker; conquers enemies through patience.",
  7: "Late marriage; mature spouse; long-term relationships through duty.",
  8: "Longevity; intense transformation; disciplined research.",
  9: "Slow faith growth; hard-earned wisdom and dharma.",
  10: "Excellent for career; leadership through persistence and structure.",
  11: "Gradual material growth; dependable network; loyal friends.",
  12: "Spiritual detachment; karmic debts; isolation for higher learning.",
};

// ------------------------------------------------------------
// Nakshatra meanings (27)
// ------------------------------------------------------------
export const SATURN_NAKSHATRA_MEANINGS: Record<string, string> = {
  Ashwini: "Structured healing; learns patience in helping others.",
  Bharani: "Endurance under pressure; karmic responsibility.",
  Krittika: "Sharp discipline; cutting attachments for duty.",
  Rohini: "Stable builder; beautifies through persistence.",
  Mrigashira: "Curious worker; quiet persistence.",
  Ardra: "Faces storms calmly; lessons through endurance.",
  Punarvasu: "Rebuilding after hardship; hope restored.",
  Pushya: "Most auspicious; spiritual maturity and duty.",
  Ashlesha: "Karmic insight; deep transformative endurance.",
  Magha: "Legacy and service to ancestors; authority with humility.",
  "Purva Phalguni": "Leisure earned after toil; patient pleasure.",
  "Uttara Phalguni": "Commitment and justice; long-term success.",
  Hasta: "Skilled hands; service-oriented labor.",
  Chitra: "Architecture and design; building with patience.",
  Swati: "Lonely path; independence through maturity.",
  Vishakha: "Goal through perseverance; sustained focus.",
  Anuradha: "Devotion and loyalty; disciplined friendship.",
  Jyeshtha: "Responsible leadership; elder wisdom.",
  Mula: "Root karma; detachment from past patterns.",
  "Purva Ashadha": "Tests of faith; patient victory.",
  "Uttara Ashadha": "Righteous effort; timeless endurance.",
  Shravana: "Listens and serves; obedience to law and order.",
  Dhanishta: "Material builder; karmic provider.",
  Shatabhisha: "Healer through service; reformer with patience.",
  "Purva Bhadrapada": "Spiritual reformer; endurance through crisis.",
  "Uttara Bhadrapada": "Inner stability; deep karmic strength.",
  Revati: "Gentle discipline; detached compassion.",
};

// ------------------------------------------------------------
// Saturn’s own aspects → 3rd, 7th, 10th
// ------------------------------------------------------------
function saturnOwnAspects(sa: PlanetPos) {
  const to = (offset: number) => ((sa.house + offset - 1 - 1 + 12) % 12) + 1;
  return [
    `Saturn aspects House ${to(3)} (3rd)`,
    `Saturn aspects House ${to(7)} (7th)`,
    `Saturn aspects House ${to(10)} (10th)`,
  ];
}

// ------------------------------------------------------------
// Conjunctions & clusters
// ------------------------------------------------------------
function detectConjunctionsAndClusters(positions: PlanetPos[]) {
  const sa = positions.find(p => p.id === "Saturn")!;
  const conj: string[] = [];

  for (const p of positions) {
    if (p.id !== "Saturn" && degDiff(p.lon, sa.lon) < 8) conj.push(p.id);
  }

  const clusters: string[] = [];
  const has = (id: string) => conj.includes(id);

  if (has("Sun")) clusters.push("Saturn+Sun (Authority challenges)");
  if (has("Moon")) clusters.push("Saturn+Moon (Emotional restraint)");
  if (has("Mercury")) clusters.push("Saturn+Mercury (Practical intellect)");
  if (has("Venus")) clusters.push("Saturn+Venus (Discipline in love)");
  if (has("Mars")) clusters.push("Saturn+Mars (Tension, endurance)");
  if (has("Jupiter")) clusters.push("Saturn+Jupiter (Moral structure)");

  if (has("Sun") && has("Mercury")) clusters.push("Sun+Mercury+Saturn");
  if (has("Moon") && has("Venus")) clusters.push("Moon+Venus+Saturn");

  return { conj, clusters };
}

// ------------------------------------------------------------
// Yogas
// ------------------------------------------------------------
function detectYogas(sa: PlanetPos, conj: string[]) {
  const yogas: string[] = [];

  if (conj.includes("Moon")) yogas.push("Vish Yoga (delay + endurance)");
  if (conj.includes("Sun")) yogas.push("Sun-Saturn Karma Clash (authority lessons)");
  if (conj.includes("Venus")) yogas.push("Shani-Shukra Yoga (discipline in pleasure)");
  if (conj.includes("Mercury")) yogas.push("Shani-Budha Yoga (practical intelligence)");

  // Mahapurusha: Shasha Yoga (own/exaltation in Kendra)
  const own = sa.sign === "Capricorn" || sa.sign === "Aquarius";
  const exalt = sa.sign === "Libra";
  const kendra = [1, 4, 7, 10].includes(sa.house);
  if ((own || exalt) && kendra) yogas.push("Shasha Mahapurusha");

  return yogas;
}

// ------------------------------------------------------------
// Remedies
// ------------------------------------------------------------
function saturnRemedies() {
  return [
    "Serve the poor or elderly on Saturdays.",
    "Chant 'Om Sham Shanicharaya Namah' regularly.",
    "Maintain humility; perform work with sincerity, not haste.",
  ];
}

// ------------------------------------------------------------
// Builder
// ------------------------------------------------------------
export function buildSaturnPack(positions: PlanetPos[]) {
  const sa = positions.find(p => p.id === "Saturn");
  if (!sa) throw new Error("Saturn not found in positions");

  const { conj, clusters } = detectConjunctionsAndClusters(positions);
  const yogas = detectYogas(sa, conj);
  const aspects_on_saturn = aspectsOnto("Saturn", positions);
  const ownAspects = saturnOwnAspects(sa);

  const houseText = SATURN_HOUSE_MEANINGS[sa.house] || "";
  const nakText = sa.nakName ? SATURN_NAKSHATRA_MEANINGS[sa.nakName] || "" : "";

  const scores = { discipline: 90, patience: 85, karma: 95, delay: 70 };

  return {
    planet: "Saturn",
    natal: {
      sign: sa.sign,
      house: sa.house,
      deg: sa.deg,
      nak: sa.nakName ? { name: sa.nakName, pada: sa.pada! } : undefined,
    },
    features: { yogas, conjunctions: conj, clusters, aspects_on_saturn },
    scores,
    windows: [],
    explain: [
      `♄ Traits: ${SATURN_TRAITS.role}`,
      `Strengths: ${SATURN_TRAITS.strengths.join("; ")}`,
      `Weaknesses: ${SATURN_TRAITS.weaknesses.join("; ")}`,
      `House → ${houseText}`,
      sa.nakName ? `Nakshatra → ${sa.nakName}: ${nakText}` : "",
      yogas.length ? `Yogas → ${yogas.join(", ")}` : "",
      conj.length ? `Conjunctions → ${conj.join(", ")}` : "",
      clusters.length ? `Clusters → ${clusters.join("; ")}` : "",
      aspects_on_saturn.length ? `Aspected by → ${aspects_on_saturn.map(a => `${a.from} (${a.kind})`).join(", ")}` : "",
      ...ownAspects,
    ].filter(Boolean),
    remedies: saturnRemedies(),
  };
}
