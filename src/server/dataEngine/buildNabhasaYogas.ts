type PlanetRow = {
  planet?: string;
  name?: string;
  sign?: string;
  house?: number;
};

const CLASSICAL_PLANETS = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
];

const MOVABLE = ["Aries", "Cancer", "Libra", "Capricorn"];
const FIXED = ["Taurus", "Leo", "Scorpio", "Aquarius"];
const DUAL = ["Gemini", "Virgo", "Sagittarius", "Pisces"];
const sankhyaMeaning: Record<number, string> = {
  1: "Highly concentrated energy — life revolves around one dominant theme.",
  2: "Dual focus — life oscillates between two key areas.",
  3: "Focused effort across a few areas — moderate stability.",
  4: "Structured life with clear focus areas and steady growth.",
  5: "Diverse experiences — balance between stability and variety.",
  6: "Energy is spread across many areas of life — steady progress comes through consistency rather than quick gains.",
  7: "Fully distributed energy — versatile, adaptive, but less concentrated power.",
};
function onlyClassical(planets: PlanetRow[]) {
  return planets.filter((p) =>
    CLASSICAL_PLANETS.includes(String(p.planet ?? p.name ?? ""))
  );
}

function allIn(houses: number[], allowed: number[]) {
  return houses.length > 0 && houses.every((h) => allowed.includes(h));
}

function sameSetOnly(houses: number[], allowed: number[]) {
  return allIn(houses, allowed);
}

function hasAllWithinContinuousBlock(houses: number[], start: number, length: number) {
  const allowed = Array.from({ length }, (_, i) => ((start + i - 1) % 12) + 1);
  return houses.every((h) => allowed.includes(h));
}

export function buildNabhasaYogas(input: { natalPlanets: PlanetRow[] }) {
  const planets = onlyClassical(input.natalPlanets ?? []);

  const houses = planets
    .map((p) => Number(p.house))
    .filter((h) => Number.isFinite(h) && h >= 1 && h <= 12);

  const signs = planets
    .map((p) => String(p.sign ?? ""))
    .filter(Boolean);

  const occupiedHouses = Array.from(new Set(houses)).sort((a, b) => a - b);
  const occupiedSigns = Array.from(new Set(signs));

  const detected: any[] = [];

  const push = (yoga: any) => {
    detected.push({
      detected: true,
      planetsChecked: CLASSICAL_PLANETS,
      occupiedHouses,
      occupiedSigns,
      ...yoga,
    });
  };

  if (planets.length < 7) {
    return {
      detected: [],
      summary: {
        checkedPlanets: planets.map((p) => p.planet ?? p.name),
        note: "Nabhasa Yoga check needs all 7 classical planets.",
      },
    };
  }

  // Ashraya Yogas
  if (signs.every((s) => MOVABLE.includes(s))) {
    push({
      id: "rajju",
      name: "Rajju Yoga",
      group: "Ashraya",
      rule: "All classical planets are in movable signs.",
      theme: "Movement, travel, action, foreign connections.",
    });
  }

  if (signs.every((s) => FIXED.includes(s))) {
    push({
      id: "musala",
      name: "Musala Yoga",
      group: "Ashraya",
      rule: "All classical planets are in fixed signs.",
      theme: "Stability, authority, wealth, recognition.",
    });
  }

  if (signs.every((s) => DUAL.includes(s))) {
    push({
      id: "nala",
      name: "Nala Yoga",
      group: "Ashraya",
      rule: "All classical planets are in dual signs.",
      theme: "Skill, intelligence, adaptability, earning focus.",
    });
  }

  // Core Akriti / Dala-style patterns
  if (sameSetOnly(houses, [1, 4, 7, 10])) {
  push({
    id: "kamala",
    name: "Kamala Yoga",
    group: "Akriti",
    rule: "All classical planets are placed only in kendras: 1, 4, 7, 10.",
    theme: "Status, balance, comfort, recognition.",
  });
}

  if (sameSetOnly(houses, [2, 5, 8, 11])) {
    push({
      id: "sarpa",
      name: "Sarpa Yoga",
      group: "Dala",
      rule: "All classical planets are placed only in panaphara houses: 2, 5, 8, 11.",
      theme: "Struggle, dependency, ups and downs.",
    });
  }

  if (sameSetOnly(houses, [2, 5, 8, 11]) || sameSetOnly(houses, [3, 6, 9, 12])) {
    push({
      id: "vapi",
      name: "Vapi Yoga",
      group: "Akriti",
      rule: "All classical planets are placed only in 2/5/8/11 or 3/6/9/12.",
      theme: "Savings, wealth stability, family support.",
    });
  }

  if (sameSetOnly(houses, [1, 5, 9])) {
    push({
      id: "sringataka",
      name: "Sringataka Yoga",
      group: "Akriti",
      rule: "All classical planets are placed only in trines: 1, 5, 9.",
      theme: "Support, growth, power, competitive strength.",
    });
  }

  // Hala Yoga needs a more specific classical pattern.
// Removed to avoid false positives.

  if (sameSetOnly(houses, [1, 7])) {
    push({
      id: "sakata",
      name: "Sakata Yoga",
      group: "Akriti",
      rule: "All classical planets are placed only in 1st and 7th houses.",
      theme: "Life fluctuations, rise and fall pattern.",
    });
  }

  if (sameSetOnly(houses, [4, 10])) {
    push({
      id: "vihaga",
      name: "Vihaga Yoga",
      group: "Akriti",
      rule: "All classical planets are placed only in 4th and 10th houses.",
      theme: "Movement, travel, change, restless activity.",
    });
  }

  // 4-house blocks
  if (hasAllWithinContinuousBlock(houses, 1, 4)) {
    push({
      id: "yupa",
      name: "Yupa Yoga",
      group: "Akriti",
      rule: "All classical planets are within houses 1 to 4.",
      theme: "Spiritual discipline, rituals, reputation.",
    });
  }

  if (hasAllWithinContinuousBlock(houses, 5, 4)) {
    push({
      id: "sara",
      name: "Sara Yoga",
      group: "Akriti",
      rule: "All classical planets are within houses 5 to 8.",
      theme: "Strict environments, harsh work, toughness.",
    });
  }

  if (hasAllWithinContinuousBlock(houses, 10, 4)) {
    push({
      id: "danda",
      name: "Danda Yoga",
      group: "Akriti",
      rule: "All classical planets are within houses 10, 11, 12 and 1.",
      theme: "Hardship, isolation, pressure in family/emotional life.",
    });
  }

  // 7 continuous houses
  if (hasAllWithinContinuousBlock(houses, 1, 7)) {
    push({
      id: "nauka",
      name: "Nauka Yoga",
      group: "Akriti",
      rule: "All classical planets occupy the 7-house span starting from 1st house.",
      theme: "Travel, water/trade themes, wealth potential.",
    });
  }

  if (hasAllWithinContinuousBlock(houses, 4, 7)) {
    push({
      id: "koota",
      name: "Koota Yoga",
      group: "Akriti",
      rule: "All classical planets occupy the 7-house span starting from 4th house.",
      theme: "Strategy, secrecy, strict or isolated environments.",
    });
  }

  if (hasAllWithinContinuousBlock(houses, 7, 7)) {
    push({
      id: "chatra",
      name: "Chatra Yoga",
      group: "Akriti",
      rule: "All classical planets occupy the 7-house span starting from 7th house.",
      theme: "Protection, support, intelligence, respect.",
    });
  }

  if (hasAllWithinContinuousBlock(houses, 10, 7)) {
    push({
      id: "chapa",
      name: "Chapa Yoga",
      group: "Akriti",
      rule: "All classical planets occupy the 7-house span starting from 10th house.",
      theme: "Travel, secrecy, improvement in middle life.",
    });
  }

  // Sankhya Yogas
  const sankhyaMap: Record<number, string> = {
    1: "Gola Yoga",
    2: "Yuga Yoga",
    3: "Soola Yoga",
    4: "Kedara Yoga",
    5: "Paasa Yoga",
    6: "Dama Yoga",
    7: "Veena / Vallaki Yoga",
  };

  const hasHigherOrderNabhasa = detected.some((y) =>
  ["Ashraya", "Dala", "Akriti"].includes(y.group)
);

if (!hasHigherOrderNabhasa && sankhyaMap[occupiedHouses.length]) {
  push({
    id: `sankhya_${occupiedHouses.length}`,
    name: sankhyaMap[occupiedHouses.length],
    group: "Sankhya",
    rule: `The 7 classical planets occupy ${occupiedHouses.length} house(s).`,
    theme:
      sankhyaMeaning[occupiedHouses.length] ||
      "Numerical distribution pattern of planets.",
  });
}

  return {
    detected,
    summary: {
      totalDetected: detected.length,
      occupiedHouses,
      occupiedSigns,
      checkedPlanets: planets.map((p) => p.planet ?? p.name),
    },
  };
}