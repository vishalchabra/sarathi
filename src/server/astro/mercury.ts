import type { PlanetPos } from "./types"; // only using PlanetPos (you already have this)
import { degDiff } from "./math";
import { aspectsOnto } from "./aspects"; // generic Vedic-aspect helper

// ------------------------------------------------------------------
// Mercury Traits
// ------------------------------------------------------------------
export const MERCURY_TRAITS = {
  role: "Mercury is intellect, speech, analysis, commerce, writing, coding, negotiation, adaptability.",
  strengths: [
    "Sharp mind, quick learning, communication skill",
    "Business sense, networking, dexterity, humor",
  ],
  weaknesses: [
    "Overthinking, nervousness, inconsistency",
    "Trickster tendencies, scattered focus",
  ],
};

// ------------------------------------------------------------------
// House meanings (1–12) — seed text
// ------------------------------------------------------------------
export const MERCURY_HOUSE_MEANINGS: Record<number, string> = {
  1: "Smart presence; witty, youthful, quick speech.",
  2: "Business/finance speech; careful with sarcasm.",
  3: "Writing, marketing, siblings, short travel; sales.",
  4: "Study at home; property paperwork; restless mind.",
  5: "Intellect + creativity; children’s education focus.",
  6: "Analysis at work; litigation/accounts; health nerves.",
  7: "Negotiator in partnerships; business contracts.",
  8: "Research mind; occult/investigation; secrets.",
  9: "Teaching, publishing, long-study; beliefs debated.",
  10: "Career in comms/tech/trade; visible analyst.",
  11: "Networks, communities, social media; gains via info.",
  12: "Foreign comms; retreats; quiet study; expenses on learning.",
};

// ------------------------------------------------------------------
// Nakshatra meanings (27) — seed text
// ------------------------------------------------------------------
export const MERCURY_NAKSHATRA_MEANINGS: Record<string, string> = {
  Ashwini: "Fast learner; quick decisions, witty starts.",
  Bharani: "Mental endurance; tough negotiations.",
  Krittika: "Sharp speech; precise analysis.",
  Rohini: "Pleasant voice; creative communication.",
  Mrigashira: "Curious seeker; research & scouting.",
  Ardra: "Bold ideas; cathartic conversations.",
  Punarvasu: "Reframing; returns to clarity/light.",
  Pushya: "Disciplined study; teaching/care.",
  Ashlesha: "Penetrating intellect; occult speech.",
  Magha: "Ancestral knowledge; dignified talk.",
  "Purva Phalguni": "Charming storyteller; playful speech.",
  "Uttara Phalguni": "Contracts, agreements, service speech.",
  Hasta: "Skill of hands; craftsmanship + comms.",
  Chitra: "Design thinking; aesthetic logic.",
  Swati: "Independent voice; flexible messaging.",
  Vishakha: "Goal-focused rhetoric; persuasive splits.",
  Anuradha: "Devoted communicator; loyal networks.",
  Jyeshtha: "Senior voice; responsible counsel.",
  Mula: "Root-cause analysis; radical thinking.",
  "Purva Ashadha": "Victorious messaging; morale raising.",
  "Uttara Ashadha": "Truth-oriented speech; constancy.",
  Shravana: "Listening + learning; oral traditions.",
  Dhanishta: "Rhythmic/ musical intelligence; teamwork comms.",
  Shatabhisha: "Diagnostic/technical comms; healing words.",
  "Purva Bhadrapada": "Intense rhetoric; tapas in study.",
  "Uttara Bhadrapada": "Calm counsel; stable intellect.",
  Revati: "Gentle guide; protective communication.",
};

// ------------------------------------------------------------------
// Mercury’s own aspect: only 7th
// ------------------------------------------------------------------
function mercuryOwnAspect(mer: PlanetPos) {
  const to7 = ((mer.house + 6 - 1) % 12) + 1;
  return [`Mercury aspects House ${to7} (7th)`];
}

// ------------------------------------------------------------------
// Conjunctions & clusters
// ------------------------------------------------------------------
function detectConjunctionsAndClusters(positions: PlanetPos[]) {
  const mer = positions.find(p => p.id === "Mercury")!;
  const conj: string[] = [];

  for (const p of positions) {
    if (p.id !== "Mercury" && degDiff(p.lon, mer.lon) < 8) conj.push(p.id);
  }

  const clusters: string[] = [];
  const has = (id: string) => conj.includes(id);

  // common pairs
  if (has("Sun"))    clusters.push("Mercury+Sun (Budha-Aditya)");
  if (has("Venus"))  clusters.push("Mercury+Venus");
  if (has("Moon"))   clusters.push("Mercury+Moon");
  if (has("Jupiter"))clusters.push("Mercury+Jupiter");
  if (has("Saturn")) clusters.push("Mercury+Saturn");

  // 3–4 planet examples (expand as needed)
  if (has("Sun") && has("Venus")) clusters.push("Sun+Mercury+Venus");
  if (has("Sun") && has("Jupiter")) clusters.push("Sun+Mercury+Jupiter");
  if (has("Moon") && has("Venus")) clusters.push("Moon+Mercury+Venus");

  return { conj, clusters };
}

// ------------------------------------------------------------------
// Yogas (seed)
// ------------------------------------------------------------------
function detectYogas(mer: PlanetPos, conj: string[]) {
  const yogas: string[] = [];
  if (conj.includes("Sun")) yogas.push("Budha-Aditya Yoga (intellect + authority)");
  if (conj.includes("Moon")) yogas.push("Chandra-Budha Yoga (mind + intellect)");
  if (conj.includes("Jupiter")) yogas.push("Guru-Budha mix (wisdom + analytics)");
  if (conj.includes("Venus")) yogas.push("Shukra-Budha mix (art + business)");
  // add Neechabhanga / Bhadra (Mahapurusha) rules later:
  // Bhadra: Mercury in own/exalt (Gemini/Virgo) in Kendra (1/4/7/10)
  const own = mer.sign === "Gemini" || mer.sign === "Virgo";
  const exalt = mer.sign === "Virgo";
  const kendra = [1,4,7,10].includes(mer.house);
  if ((own || exalt) && kendra) yogas.push("Bhadra Mahapurusha");
  return yogas;
}

// ------------------------------------------------------------------
// Remedies (seed)
// ------------------------------------------------------------------
function mercuryRemedies() {
  return [
    "Practice mindful speech; pause before replying.",
    "Strengthen routine: daily reading/writing.",
    "Offer green gram or help students on Wednesdays.",
  ];
}

// ------------------------------------------------------------------
// Main builder — returns a plain object (keep types light for now)
// ------------------------------------------------------------------
export function buildMercuryPack(positions: PlanetPos[]) /* : any */ {
  const mer = positions.find(p => p.id === "Mercury");
  if (!mer) throw new Error("Mercury not found in positions");

  const { conj, clusters } = detectConjunctionsAndClusters(positions);
  const yogas = detectYogas(mer, conj);
  const aspects_on_mercury = aspectsOnto("Mercury", positions);
  const ownAspect = mercuryOwnAspect(mer);

  const houseText = MERCURY_HOUSE_MEANINGS[mer.house] || "";
  const nakText = mer.nakName ? MERCURY_NAKSHATRA_MEANINGS[mer.nakName] || "" : "";

  const scores = { intellect: 80, business: 75, communication: 85, nerves: 60 };

  return {
    planet: "Mercury",
    natal: {
      sign: mer.sign,
      house: mer.house,
      deg: mer.deg,
      nak: mer.nakName ? { name: mer.nakName, pada: mer.pada! } : undefined,
    },
    features: { yogas, conjunctions: conj, clusters, aspects_on_mercury },
    scores,
    windows: [],
    explain: [
      `☿ Traits: ${MERCURY_TRAITS.role}`,
      `Strengths: ${MERCURY_TRAITS.strengths.join("; ")}`,
      `Weaknesses: ${MERCURY_TRAITS.weaknesses.join("; ")}`,
      `House → ${houseText}`,
      mer.nakName ? `Nakshatra → ${mer.nakName}: ${nakText}` : "",
      yogas.length ? `Yogas → ${yogas.join(", ")}` : "",
      conj.length ? `Conjunctions → ${conj.join(", ")}` : "",
      clusters.length ? `Clusters → ${clusters.join("; ")}` : "",
      aspects_on_mercury.length ? `Aspected by → ${aspects_on_mercury.map(a => `${a.from} (${a.kind})`).join(", ")}` : "",
      ...ownAspect,
    ].filter(Boolean),
    remedies: mercuryRemedies(),
  };
}
