import type { PlanetPos } from "./types";
import { degDiff } from "./math";
import { aspectsOnto } from "./aspects";

// ------------------------------------------------------------
// Jupiter Traits
// ------------------------------------------------------------
export const JUPITER_TRAITS = {
  role: "Jupiter represents wisdom, expansion, dharma, optimism, learning, faith, and divine guidance.",
  strengths: [
    "Wisdom, optimism, leadership in teaching, generosity, faith, protection.",
    "Growth mindset, long-term vision, guiding others through counsel."
  ],
  weaknesses: [
    "Over-optimism, dogma, indulgence, procrastination.",
    "Attachment to ideals, lack of practicality at times."
  ]
};

// ------------------------------------------------------------
// House meanings (1–12)
// ------------------------------------------------------------
export const JUPITER_HOUSE_MEANINGS: Record<number, string> = {
  1: "Wise, learned, spiritual aura; natural teacher and advisor.",
  2: "Wealth through knowledge; family values; soft-spoken wisdom.",
  3: "Communication of higher truths; advisor to siblings.",
  4: "Peaceful home; divine grace in family; learned mother figure.",
  5: "Highly creative intellect; love for children, scriptures, mantras.",
  6: "Wisdom in service; good for healing professions; avoid arrogance.",
  7: "Virtuous spouse; balanced partnerships; ethics in business.",
  8: "Occult scholar; transformation through higher learning.",
  9: "Best placement—divine blessings, dharma, foreign learning.",
  10: "Leadership in teaching, law, finance, or religion.",
  11: "Expansion of networks; gains through wisdom and grace.",
  12: "Spiritual retreat; inner enlightenment; expenses on charity."
};

// ------------------------------------------------------------
// Nakshatra meanings (27)
// ------------------------------------------------------------
export const JUPITER_NAKSHATRA_MEANINGS: Record<string, string> = {
  Ashwini: "Healing through wisdom; quick to bless and guide.",
  Bharani: "Righteous discipline; endurance in teaching.",
  Krittika: "Fire of truth; courage to speak divine insight.",
  Rohini: "Nurturing knowledge; artistic and generous.",
  Mrigashira: "Curious seeker; gentle in exploration of truth.",
  Ardra: "Cleansing transformation through philosophy.",
  Punarvasu: "Return to light; natural teacher and guide.",
  Pushya: "Most auspicious; spiritual discipline and nourishment.",
  Ashlesha: "Penetrating understanding of hidden realities.",
  Magha: "Ancestral teacher; traditional wisdom bearer.",
  "Purva Phalguni": "Generosity; blessing others through art.",
  "Uttara Phalguni": "Leadership with integrity; wise contracts.",
  Hasta: "Healing touch; skillful in sacred rituals.",
  Chitra: "Architect of wisdom; blends logic with aesthetics.",
  Swati: "Freedom-loving philosopher; adaptable teacher.",
  Vishakha: "Goal-oriented dharma; twin paths of purpose.",
  Anuradha: "Devotion and friendship through faith.",
  Jyeshtha: "Protective guru; responsibility in guidance.",
  Mula: "Root teacher; cuts illusion; deep philosophical insight.",
  "Purva Ashadha": "Victory through wisdom; idealistic reformer.",
  "Uttara Ashadha": "Universal truth; disciplined preacher.",
  Shravana: "Excellent listener; preacher, orator, or counsellor.",
  Dhanishta: "Rhythmic expansion; leadership in prosperity.",
  Shatabhisha: "Healing science; wisdom in medicine.",
  "Purva Bhadrapada": "Sacrificial teacher; spiritual fire.",
  "Uttara Bhadrapada": "Deep contemplative wisdom; patient guide.",
  Revati: "Compassionate and protective mentor.",
};

// ------------------------------------------------------------
// Jupiter’s own aspects → 5th, 7th, 9th
// ------------------------------------------------------------
function jupiterOwnAspects(jp: PlanetPos) {
  const to = (offset: number) => ((jp.house + offset - 1 - 1 + 12) % 12) + 1;
  return [
    `Jupiter aspects House ${to(5)} (5th)`,
    `Jupiter aspects House ${to(7)} (7th)`,
    `Jupiter aspects House ${to(9)} (9th)`
  ];
}

// ------------------------------------------------------------
// Conjunctions & clusters
// ------------------------------------------------------------
function detectConjunctionsAndClusters(positions: PlanetPos[]) {
  const jp = positions.find(p => p.id === "Jupiter")!;
  const conj: string[] = [];

  for (const p of positions) {
    if (p.id !== "Jupiter" && degDiff(p.lon, jp.lon) < 8) conj.push(p.id);
  }

  const clusters: string[] = [];
  const has = (id: string) => conj.includes(id);

  if (has("Sun")) clusters.push("Jupiter+Sun (spiritual leadership)");
  if (has("Moon")) clusters.push("Jupiter+Moon (Gaja-Kesari)");
  if (has("Mercury")) clusters.push("Jupiter+Mercury");
  if (has("Venus")) clusters.push("Jupiter+Venus");
  if (has("Saturn")) clusters.push("Jupiter+Saturn");
  if (has("Mars")) clusters.push("Jupiter+Mars");

  if (has("Moon") && has("Venus")) clusters.push("Moon+Venus+Jupiter");
  if (has("Sun") && has("Mercury")) clusters.push("Sun+Mercury+Jupiter");

  return { conj, clusters };
}

// ------------------------------------------------------------
// Yogas
// ------------------------------------------------------------
function detectYogas(jp: PlanetPos, conj: string[]) {
  const yogas: string[] = [];

  if (conj.includes("Moon")) yogas.push("Gaja-Kesari Yoga (fame, wisdom, leadership)");
  if (conj.includes("Sun")) yogas.push("Guru-Surya Yoga (guidance to rulers)");
  if (conj.includes("Mercury")) yogas.push("Guru-Budha Yoga (teaching + intellect)");
  if (conj.includes("Venus")) yogas.push("Guru-Shukra Yoga (wealth + grace)");
  if (conj.includes("Saturn")) yogas.push("Guru-Shani Yoga (discipline + morality)");

  // Mahapurusha: Hamsa Yoga (Jupiter in own/exalt sign in Kendra)
  const own = jp.sign === "Sagittarius" || jp.sign === "Pisces";
  const exalt = jp.sign === "Cancer";
  const kendra = [1,4,7,10].includes(jp.house);
  if ((own || exalt) && kendra) yogas.push("Hamsa Mahapurusha");

  return yogas;
}

// ------------------------------------------------------------
// Remedies
// ------------------------------------------------------------
function jupiterRemedies() {
  return [
    "Offer yellow flowers or turmeric on Thursdays.",
    "Help teachers, mentors, or underprivileged children.",
    "Chant 'Om Gurave Namah' or study sacred texts regularly."
  ];
}

// ------------------------------------------------------------
// Builder
// ------------------------------------------------------------
export function buildJupiterPack(positions: PlanetPos[]) {
  const jp = positions.find(p => p.id === "Jupiter");
  if (!jp) throw new Error("Jupiter not found in positions");

  const { conj, clusters } = detectConjunctionsAndClusters(positions);
  const yogas = detectYogas(jp, conj);
  const aspects_on_jupiter = aspectsOnto("Jupiter", positions);
  const ownAspects = jupiterOwnAspects(jp);

  const houseText = JUPITER_HOUSE_MEANINGS[jp.house] || "";
  const nakText = jp.nakName ? JUPITER_NAKSHATRA_MEANINGS[jp.nakName] || "" : "";

  const scores = { wisdom: 90, dharma: 85, wealth: 75, faith: 80 };

  return {
    planet: "Jupiter",
    natal: {
      sign: jp.sign,
      house: jp.house,
      deg: jp.deg,
      nak: jp.nakName ? { name: jp.nakName, pada: jp.pada! } : undefined,
    },
    features: { yogas, conjunctions: conj, clusters, aspects_on_jupiter },
    scores,
    windows: [],
    explain: [
      `♃ Traits: ${JUPITER_TRAITS.role}`,
      `Strengths: ${JUPITER_TRAITS.strengths.join("; ")}`,
      `Weaknesses: ${JUPITER_TRAITS.weaknesses.join("; ")}`,
      `House → ${houseText}`,
      jp.nakName ? `Nakshatra → ${jp.nakName}: ${nakText}` : "",
      yogas.length ? `Yogas → ${yogas.join(", ")}` : "",
      conj.length ? `Conjunctions → ${conj.join(", ")}` : "",
      clusters.length ? `Clusters → ${clusters.join("; ")}` : "",
      aspects_on_jupiter.length ? `Aspected by → ${aspects_on_jupiter.map(a => `${a.from} (${a.kind})`).join(", ")}` : "",
      ...ownAspects,
    ].filter(Boolean),
    remedies: jupiterRemedies(),
  };
}
