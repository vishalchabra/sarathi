"use client";

import React, { useMemo, useState } from "react";

type Props = {
  natal?: any;
  planets?: any[];
  houses?: any[];
  roles?: any;
  currentDasha?: any;
  transitNow?: any;
  triggerEngine?: any;
  vargas?: Record<string, any>;
  houseJudgement?: any[];
  natalStrengths?: any[];
  classicYogas?: any;
nabhasaYogas?: any;
};

type RuleKey =
  | "lagna"
  | "lagnaLord"
  | "moon"
  | "sun"
  | "functionalRoles"
  | "houseReview"
  | "coreHouses"
  | "dharmaArthaKamaMoksha"
  | "planetStrength"
  | "yogas"
  | "nodes"
  | "nakshatra"
  | "repetition"
  | "divisionalCharts"
  | "dasha"
  | "transit"
  | "houseActivation"
  | "upachaya"
  | "chartTheme"
  | "finalFramework"
  | "career"
  | "wealth"
  | "relationship"
  | "property"
  | "health"
  | "foreign"
  | "spiritual";
type SambandhType =
  | "Yuti"
  | "Lordship"
  | "Dasha"
  | "Transit"
  | "House Link";

type SambandhRow = {
  id: string;
  type: SambandhType;
  source: string;
  target: string;
  strength: "Strong" | "Medium" | "Subtle";
  reason: string;
  houses?: number[];
  planets?: string[];
};
type Rule = {
  key: RuleKey;
  number: string;
  title: string;
  subtitle: string;
  category: "Foundation" | "Judgement" | "Timing" | "Life Area";
  checks: string[];
  relatedHouses?: number[];
  relatedPlanets?: string[];
  relatedVargas?: string[];
};

const RULES: Rule[] = [
  {
    key: "lagna",
    number: "1",
    title: "Start With Lagna",
    subtitle: "The person’s core reality, body, identity, and starting point.",
    category: "Foundation",
    checks: [
      "Which sign is rising?",
      "Is the sign movable, fixed, or dual?",
      "What is the element of the sign?",
      "Are there planets in Lagna?",
      "Is Lagna receiving benefic or malefic influence?",
      "Check strength and condition of Lagna.",
    ],
    relatedHouses: [1],
  },
  {
    key: "lagnaLord",
    number: "2",
    title: "Analyze Lagna Lord",
    subtitle: "The main planet carrying the direction of life.",
    category: "Foundation",
    checks: [
      "Which house is Lagna lord placed in?",
      "Which sign is it in?",
      "Check dignity: own, exalted, debilitated, friendly, enemy.",
      "Check combustion, retrogression, and affliction.",
      "Check aspects and conjunctions.",
      "Check nakshatra placement.",
    ],
    relatedHouses: [1],
  },
  {
    key: "moon",
    number: "3",
    title: "Judge the Moon",
    subtitle: "Mind, emotional state, inner experience, and public connection.",
    category: "Foundation",
    checks: [
      "Moon sign and house.",
      "Moon nakshatra and pada.",
      "Waxing or waning condition.",
      "Affliction from Saturn, Rahu, Ketu, Mars.",
      "Benefic influences on Moon.",
      "Check Moon as reference for transits.",
    ],
    relatedPlanets: ["Moon"],
  },
  {
    key: "sun",
    number: "4",
    title: "Evaluate the Sun",
    subtitle: "Soul, authority, confidence, father, and leadership markers.",
    category: "Foundation",
    checks: [
      "Sun house and sign.",
      "Dignity of Sun.",
      "Affliction from Saturn, Rahu, Ketu.",
      "Connection with 9th or 10th house.",
      "Authority, father, government, status indicators.",
    ],
    relatedPlanets: ["Sun"],
  },
  {
    key: "functionalRoles",
    number: "5",
    title: "Functional Benefics & Malefics",
    subtitle: "Planetary roles change for every ascendant.",
    category: "Judgement",
    checks: [
      "Identify functional benefics.",
      "Identify functional malefics.",
      "Identify yogakaraka or supporting planets.",
      "Identify maraka planets.",
      "Identify badhaka influence where applicable.",
    ],
  },
  {
    key: "houseReview",
    number: "6",
    title: "House-by-House Review",
    subtitle: "Every house must be checked through sign, lord, occupants, and aspects.",
    category: "Judgement",
    checks: [
      "Sign in each house.",
      "House lord and its placement.",
      "Planets placed in the house.",
      "Aspects received by the house.",
      "Strength of house lord.",
      "Karaka of the house.",
      "Benefic/malefic balance.",
    ],
    relatedHouses: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
 
  {
    key: "planetStrength",
    number: "7",
    title: "Analyze Planetary Strength",
    subtitle: "A planet must be capable of delivering its promise.",
    category: "Judgement",
    checks: [
      "Exaltation/debilitation.",
      "Own sign or mooltrikona.",
      "Combustion.",
      "Retrogression.",
      "Shadbala.",
      "Ashtakavarga.",
      "Vargottama or divisional support.",
    ],
  },
  {
    key: "yogas",
    number: "8",
    title: "Check Yogas Carefully",
    subtitle: "Yogas need strength, activation, and repetition.",
    category: "Judgement",
    checks: [
      "Raj Yoga.",
      "Dhana Yoga.",
      "Vipareeta Raja Yoga.",
      "Neecha Bhanga Raja Yoga.",
      "Gaja Kesari Yoga.",
      "Dharma-Karmadhipati Yoga.",
      "Parivartana Yoga.",
      "Check if yoga is activated by dasha or transit.",
    ],
  },
  {
    key: "nodes",
    number: "9",
    title: "Judge Rahu & Ketu Properly",
    subtitle: "Nodes behave through sign lord, nakshatra lord, and association.",
    category: "Judgement",
    checks: [
      "House placement of Rahu and Ketu.",
      "Sign and nakshatra.",
      "Dispositor strength.",
      "Conjunctions and aspects.",
      "Check if Rahu/Ketu are active by dasha or transit.",
    ],
    relatedPlanets: ["Rahu", "Ketu"],
  },
  {
    key: "nakshatra",
    number: "10",
    title: "Analyze Nakshatras",
    subtitle: "Nakshatra-level analysis gives depth beyond sign placement.",
    category: "Judgement",
    checks: [
      "Planet nakshatra.",
      "Nakshatra lord.",
      "Pada.",
      "Dasha lord nakshatra.",
      "Repeated nakshatra themes.",
      "Transit nakshatra activation.",
    ],
  },
  {
    key: "repetition",
    number: "11",
    title: "Understand Repetition",
    subtitle: "One indication is not enough. Repetition creates reliability.",
    category: "Judgement",
    checks: [
      "Natal promise.",
      "House strength.",
      "Planet strength.",
      "Dasha activation.",
      "Divisional confirmation.",
      "Transit trigger.",
      "Degree-level contact.",
    ],
  },
  {
    key: "divisionalCharts",
    number: "12",
    title: "Use Divisional Charts",
    subtitle: "Divisional charts refine the promise of the birth chart.",
    category: "Judgement",
    checks: [
      "D9 for marriage, dharma, planet strength.",
      "D10 for career.",
      "D7 for children.",
      "D12 for parents.",
      "D16 for vehicles/luxury.",
      "D20 for spirituality.",
      "D24 for education.",
      "D60 for deeper karmic patterns.",
    ],
    relatedVargas: ["d9", "d10", "d7", "d12", "d16", "d20", "d24", "d60"],
  },
  {
    key: "dasha",
    number: "13",
    title: "Dasha Analysis Framework",
    subtitle: "Dasha shows which karma is currently active.",
    category: "Timing",
    checks: [
      "Mahadasha lord.",
      "Antardasha lord.",
      "Pratyantar lord.",
      "House ownership.",
      "Placement.",
      "Nakshatra lord.",
      "Divisional strength.",
      "Transit condition of dasha lords.",
    ],
  },
  {
    key: "transit",
    number: "14",
    title: "Transit Analysis Framework",
    subtitle: "Transits trigger what the chart and dasha already promise.",
    category: "Timing",
    checks: [
      "Slow planets first: Saturn, Jupiter, Rahu/Ketu.",
      "Then Mars, Sun, Venus, Mercury.",
      "Transit over natal planets.",
      "Transit over house cusps.",
      "Degree conjunctions.",
      "Nakshatra activation.",
      "Transit from Lagna and Moon.",
    ],
  },
  {
    key: "houseActivation",
    number: "15",
    title: "House Activation Logic",
    subtitle: "A planet activates placement, ownership, aspects, and nakshatra links.",
    category: "Timing",
    checks: [
      "Planet placement house.",
      "Planet-owned houses.",
      "Conjunctions.",
      "Aspected houses.",
      "Nakshatra lord connection.",
      "Dasha and transit overlap.",
    ],
  },
  {
    key: "upachaya",
    number: "16",
    title: "Observe Upachaya Houses",
    subtitle: "Growth houses show effort, competition, and improvement over time.",
    category: "Judgement",
    checks: [
      "Check H3, H6, H10, H11.",
      "Malefics can perform well in upachaya houses.",
      "Check growth through struggle.",
      "Check competition, effort, ambition, and gains.",
    ],
    relatedHouses: [3, 6, 10, 11],
  },
  {
    key: "chartTheme",
    number: "17",
    title: "Identify Chart Theme",
    subtitle: "Find the dominant pattern of the chart.",
    category: "Judgement",
    checks: [
      "Which houses dominate?",
      "Which planets dominate?",
      "Which vargas repeat?",
      "Which dasha is active?",
      "Which life areas are repeatedly activated?",
    ],
  },
  {
    key: "finalFramework",
    number: "18",
    title: "Final Judgement Checklist",
    subtitle: "Before judgement, confirm promise, timing, trigger, and repetition.",
    category: "Timing",
    checks: [
      "Is it promised natally?",
      "Is dasha supporting it?",
      "Are transits activating it?",
      "Is the divisional chart confirming it?",
      "Are multiple repetitions present?",
      "Are there gaps or contradictions?",
    ],
  },
  {
    key: "career",
    number: "A",
    title: "Career Lens",
    subtitle: "Professional life, work, karma, service, and gains.",
    category: "Life Area",
    checks: [
      "Check H10, H6, H2, H11.",
      "Check 10th lord.",
      "Check Saturn, Sun, Mercury.",
      "Check D10.",
      "Check current dasha link.",
      "Check transit activation.",
    ],
    relatedHouses: [10, 6, 2, 11],
    relatedPlanets: ["Saturn", "Sun", "Mercury", "Jupiter"],
    relatedVargas: ["d10"],
  },
  {
    key: "wealth",
    number: "B",
    title: "Wealth Lens",
    subtitle: "Accumulated wealth, income, gains, and financial support.",
    category: "Life Area",
    checks: [
      "Check H2 and H11.",
      "Check 2nd and 11th lords.",
      "Check H5 and H9 for fortune support.",
      "Check Jupiter, Venus, Mercury.",
      "Check D2 where available.",
      "Check dasha and transit activation.",
    ],
    relatedHouses: [2, 11, 5, 9],
    relatedPlanets: ["Jupiter", "Venus", "Mercury"],
    relatedVargas: ["d2", "d9"],
  },
  {
    key: "relationship",
    number: "C",
    title: "Relationship Lens",
    subtitle: "Marriage, partnership, union, and relationship support.",
    category: "Life Area",
    checks: [
      "Check H7.",
      "Check 7th lord.",
      "Check Venus/Jupiter.",
      "Check D9.",
      "Check H2 and H11 support.",
      "Check dasha and transit activation.",
    ],
    relatedHouses: [7, 2, 11, 5],
    relatedPlanets: ["Venus", "Jupiter", "Moon"],
    relatedVargas: ["d9"],
  },
  {
    key: "property",
    number: "D",
    title: "Property / Home Lens",
    subtitle: "Home, property, comfort, vehicles, and domestic stability.",
    category: "Life Area",
    checks: [
      "Check H4.",
      "Check 4th lord.",
      "Check Moon, Mars, Venus.",
      "Check D4 and D16.",
      "Check H2/H11 affordability.",
      "Check H12 for relocation/expense.",
    ],
    relatedHouses: [4, 2, 11, 12],
    relatedPlanets: ["Moon", "Mars", "Venus"],
    relatedVargas: ["d4", "d16"],
  },
  {
    key: "health",
    number: "E",
    title: "Health Lens",
    subtitle: "Body, disease, vitality, chronic pressure, and recovery capacity.",
    category: "Life Area",
    checks: [
      "Check Lagna and Lagna lord.",
      "Check H6, H8, H12.",
      "Check Sun and Moon.",
      "Check Mars/Saturn affliction.",
      "Check D30 where available.",
      "Check current dasha and transit pressure.",
    ],
    relatedHouses: [1, 6, 8, 12],
    relatedPlanets: ["Sun", "Moon", "Mars", "Saturn"],
    relatedVargas: ["d30"],
  },
  {
    key: "foreign",
    number: "F",
    title: "Foreign / Relocation Lens",
    subtitle: "Foreign lands, relocation, distance from birthplace, and movement.",
    category: "Life Area",
    checks: [
      "Check H12, H9, H7.",
      "Check H4 displacement.",
      "Check Rahu, Moon, Saturn.",
      "Check D4/D9 support.",
      "Check dasha and transit activation.",
    ],
    relatedHouses: [12, 9, 7, 4],
    relatedPlanets: ["Rahu", "Moon", "Saturn"],
    relatedVargas: ["d4", "d9"],
  },
  {
    key: "spiritual",
    number: "G",
    title: "Spiritual / Karmic Lens",
    subtitle: "Inner life, detachment, occult, dharma, and liberation.",
    category: "Life Area",
    checks: [
      "Check H8, H9, H12.",
      "Check Ketu, Jupiter, Moon, Saturn.",
      "Check D20.",
      "Check dasha and transit activation.",
    ],
    relatedHouses: [8, 9, 12, 5],
    relatedPlanets: ["Ketu", "Jupiter", "Moon", "Saturn"],
    relatedVargas: ["d20", "d9"],
  },
];

function show(value: any) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
  }
  return String(value);
}

function getPlanet(planets: any[] = [], name: string) {
  return planets.find((p) => String(p?.planet) === name) ?? null;
}

function getHouseRow(houses: any[] = [], house: number) {
  return houses.find((h) => Number(h?.house) === house) ?? null;
}

function getJudgementRow(rows: any[] = [], house: number) {
  return rows.find((h) => Number(h?.house) === house) ?? null;
}

function getHouseFromPlanet(row: any) {
  return row?.house ?? row?.houseFromLagna ?? "—";
}

function supportLabel(value: any) {
  const raw = String(value ?? "").toLowerCase();
  if (raw === "strong") return "supportive";
  if (raw === "mixed") return "moderate support";
  if (raw === "challenged" || raw === "weak") return "under pressure";
  return show(value);
}
const CLASSICAL_PLANETS = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
];

function isClassicalPlanet(name: any) {
  return CLASSICAL_PLANETS.includes(String(name ?? ""));
}
function getDashaPlanets(currentDasha: any) {
  const md =
    currentDasha?.md?.planet ??
    currentDasha?.mahadasha?.planet ??
    currentDasha?.md ??
    null;

  const ad =
    currentDasha?.ad?.planet ??
    currentDasha?.antardasha?.planet ??
    currentDasha?.ad ??
    null;

  const pd =
    currentDasha?.pd?.planet ??
    currentDasha?.pratyantardasha?.planet ??
    currentDasha?.pd ??
    null;

  return [md, ad, pd].filter(Boolean).map(String);
}
function relativeHouseDistance(fromHouse: any, toHouse: any) {
  const from = Number(fromHouse);
  const to = Number(toHouse);

  if (!Number.isFinite(from) || !Number.isFinite(to)) return null;

  return ((to - from + 12) % 12) + 1;
}

function sambandhTheme(distance: number | null) {
  switch (distance) {
    case 1:
      return "same house / direct activation";
    case 2:
      return "resources / speech / family";
    case 3:
      return "effort / courage / communication";
    case 4:
      return "home / peace / foundations";
    case 5:
      return "intelligence / creativity / purva punya";
    case 6:
      return "service / conflict / competition";
    case 7:
      return "partnership / opposition / public interaction";
    case 8:
      return "transformation / disruption / hidden matters";
    case 9:
      return "dharma / fortune / guidance";
    case 10:
      return "karma / action / profession";
    case 11:
      return "gains / networks / fulfilment";
    case 12:
      return "expense / isolation / foreign / moksha";
    default:
      return "—";
  }
}

function sambandhStrength(distance: number | null): SambandhRow["strength"] {
  if ([1, 5, 7, 9, 10, 11].includes(Number(distance))) return "Strong";
  if ([2, 3, 4, 6].includes(Number(distance))) return "Medium";
  return "Subtle";
}

function dedupeSambandhRows(rows: SambandhRow[]) {
  const seen = new Set<string>();

  return rows.filter((row) => {
    const key = `${row.type}|${row.source}|${row.target}|${row.reason}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function sortSambandhRowsByDashaPriority(
  rows: SambandhRow[],
  dashaPlanets: string[]
) {
  const priority = new Map<string, number>();

  dashaPlanets.forEach((planet, index) => {
    priority.set(planet, index);
  });

  return [...rows].sort((a, b) => {
    const aPlanets = a.planets ?? [];
    const bPlanets = b.planets ?? [];

    const aPriority = Math.min(
      ...aPlanets.map((p) => priority.get(p) ?? 999)
    );

    const bPriority = Math.min(
      ...bPlanets.map((p) => priority.get(p) ?? 999)
    );

    if (aPriority !== bPriority) return aPriority - bPriority;

    const typeOrder: Record<string, number> = {
      Dasha: 0,
      Transit: 1,
      Yuti: 2,
      Lordship: 3,
      "House Link": 4,
    };

    return (typeOrder[a.type] ?? 99) - (typeOrder[b.type] ?? 99);
  });
}
function buildSambandhRows({
  planets = [],
  houses = [],
  currentDasha,
  transitNow,
}: {
  planets?: any[];
  houses?: any[];
  currentDasha?: any;
  transitNow?: any;
}): SambandhRow[] {
  const rows: SambandhRow[] = [];
const dashaPlanets = getDashaPlanets(currentDasha).filter(isClassicalPlanet);

const natalPlanets = (planets ?? []).filter((p) =>
  isClassicalPlanet(p?.planet)
);

const transitPlanets = (transitNow?.planets ?? []).filter((p: any) =>
  isClassicalPlanet(p?.planet)
);

  // 1. Yuti Sambandh — natal planets in same house
  const byHouse = new Map<number, any[]>();

  for (const planet of natalPlanets) {
    const house = Number(getHouseFromPlanet(planet));
    if (!Number.isFinite(house)) continue;

    const list = byHouse.get(house) ?? [];
    list.push(planet);
    byHouse.set(house, list);
  }

  for (const [house, list] of byHouse.entries()) {
    if (list.length < 2) continue;

    rows.push({
      id: `yuti-house-${house}`,
      type: "Yuti",
      source: list.map((p) => p?.planet).filter(Boolean).join(" + "),
      target: `House ${house}`,
      strength: "Strong",
      reason: `Planets are placed together in House ${house}.`,
      houses: [house],
      planets: list.map((p) => String(p?.planet ?? "")).filter(Boolean),
    });
  }

  // 2. Yuti Sambandh — natal planets in same sign
  const bySign = new Map<string, any[]>();

  for (const planet of natalPlanets) {
    const sign = String(planet?.sign ?? "");
    if (!sign) continue;

    const list = bySign.get(sign) ?? [];
    list.push(planet);
    bySign.set(sign, list);
  }

  for (const [sign, list] of bySign.entries()) {
    if (list.length < 2) continue;

    rows.push({
      id: `yuti-sign-${sign}`,
      type: "Yuti",
      source: list.map((p) => p?.planet).filter(Boolean).join(" + "),
      target: sign,
      strength: "Strong",
      reason: `Planets share the same rashi: ${sign}.`,
      planets: list.map((p) => String(p?.planet ?? "")).filter(Boolean),
    });
  }

  // 3. Lordship Sambandh — house lord placed in another house
  for (const house of houses ?? []) {
    const houseNum = Number(house?.house);
    const lord = String(house?.lord ?? "");
    const lordHouse = Number(house?.lordHouse);

    if (!Number.isFinite(houseNum) || !lord || !Number.isFinite(lordHouse)) {
      continue;
    }

    rows.push({
      id: `lordship-${houseNum}-${lord}-${lordHouse}`,
      type: "Lordship",
      source: `${lord} as lord of House ${houseNum}`,
      target: `House ${lordHouse}`,
      strength: houseNum === lordHouse ? "Strong" : "Medium",
      reason:
        houseNum === lordHouse
          ? `${lord} owns and occupies House ${houseNum}.`
          : `${lord}, lord of House ${houseNum}, is placed in House ${lordHouse}.`,
      houses: [houseNum, lordHouse],
      planets: [lord],
    });
  }

  // 4. Dasha Sambandh — active dasha planets and their natal placement
  for (const planetName of dashaPlanets) {
    const natalPlanet = planets.find(
      (p) => String(p?.planet ?? "") === String(planetName)
    );

    if (!natalPlanet) continue;

    const house = Number(getHouseFromPlanet(natalPlanet));

    rows.push({
      id: `dasha-${planetName}-${house}`,
      type: "Dasha",
      source: `${planetName} dasha active`,
      target: Number.isFinite(house) ? `House ${house}` : "Natal placement",
      strength: "Strong",
      reason: `${planetName} is active by dasha and activates its natal placement.`,
      houses: Number.isFinite(house) ? [house] : [],
      planets: [planetName],
    });
  }

// 5. Dynamic Transit Sambandh — same planet natal house to transit house
for (const natalPlanet of natalPlanets) {
  const planetName = String(natalPlanet?.planet ?? "");
  if (!planetName) continue;

  const transitPlanet = transitPlanets.find(
    (p: any) => String(p?.planet ?? "") === planetName
  );

  if (!transitPlanet) continue;

  const natalHouse = Number(getHouseFromPlanet(natalPlanet));
  const transitHouse = Number(
    transitPlanet?.houseFromLagna ?? transitPlanet?.house
  );

  const distance = relativeHouseDistance(natalHouse, transitHouse);

  if (!distance) continue;

  rows.push({
    id: `dynamic-transit-${planetName}-${natalHouse}-${transitHouse}`,
    type: "Transit",
    source: `${planetName}: natal H${natalHouse}`,
    target: `Transit H${transitHouse}`,
    strength: sambandhStrength(distance),
    reason: `${planetName} is making ${ordinalSuffix(distance)} sambandh from natal H${natalHouse} to transit H${transitHouse} — ${sambandhTheme(distance)}.`,
    houses: [natalHouse, transitHouse],
    planets: [planetName],
  });
}

// 6. Dasha lord to dasha lord sambandh by natal placement
const activeDashaRows = dashaPlanets
  .map((planetName) => {
    const row = natalPlanets.find(
      (p) => String(p?.planet ?? "") === String(planetName)
    );

    const house = Number(getHouseFromPlanet(row));

    return {
      planet: planetName,
      house,
    };
  })
  .filter((row) => row.planet && Number.isFinite(row.house));

for (let i = 0; i < activeDashaRows.length; i++) {
  for (let j = i + 1; j < activeDashaRows.length; j++) {
    const from = activeDashaRows[i];
    const to = activeDashaRows[j];

    const forward = relativeHouseDistance(from.house, to.house);
    const reverse = relativeHouseDistance(to.house, from.house);

    rows.push({
      id: `dasha-relative-${from.planet}-${to.planet}-${from.house}-${to.house}`,
      type: "Dasha",
      source: `${from.planet} H${from.house}`,
      target: `${to.planet} H${to.house}`,
      strength: sambandhStrength(forward),
      reason: `${from.planet} to ${to.planet}: ${ordinalSuffix(Number(forward))} sambandh. ${to.planet} to ${from.planet}: ${ordinalSuffix(Number(reverse))} sambandh. Theme: ${sambandhTheme(forward)} / ${sambandhTheme(reverse)}.`,
      houses: [from.house, to.house],
      planets: [from.planet, to.planet],
    });
  }
}

  return sortSambandhRowsByDashaPriority(
  dedupeSambandhRows(rows),
  dashaPlanets
).slice(0, 80);
}
function getDashaPlanetStages(currentDasha: any) {
  const md =
    currentDasha?.md?.planet ??
    currentDasha?.mahadasha?.planet ??
    currentDasha?.md ??
    null;

  const ad =
    currentDasha?.ad?.planet ??
    currentDasha?.antardasha?.planet ??
    currentDasha?.ad ??
    null;

  const pd =
    currentDasha?.pd?.planet ??
    currentDasha?.pratyantardasha?.planet ??
    currentDasha?.pd ??
    null;

  const stages: Array<{
    label: string;
    planet: string;
  }> = [];

  if (md) {
    stages.push({
      label: "MD",
      planet: String(md),
    });
  }

  if (ad && ad !== md) {
    stages.push({
      label: "AD",
      planet: String(ad),
    });
  }

  if (pd) {
    const existing = stages.find(
      (item) => item.planet === String(pd)
    );

    if (existing) {
      existing.label = `${existing.label}/PD`;
    } else {
      stages.push({
        label: "PD",
        planet: String(pd),
      });
    }
  }

  return stages;
}
function ordinalSuffix(n: number) {
  const j = n % 10;
  const k = n % 100;

  if (j === 1 && k !== 11) return `${n}st`;
  if (j === 2 && k !== 12) return `${n}nd`;
  if (j === 3 && k !== 13) return `${n}rd`;

  return `${n}th`;
}
function SmallBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[color:var(--border)] bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
      {children}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 text-sm">
      <div className="text-slate-500">{label}</div>
      <div className="font-medium text-slate-900">{show(value)}</div>
    </div>
  );
}

function MiniChart({
  natal,
  planets,
}: {
  natal?: any;
  planets: any[];
}) {
  const ascSign = natal?.ascendant?.sign ?? "—";

  const housePlanets = useMemo(() => {
    const map = new Map<number, string[]>();

    for (const p of planets) {
      const house = Number(getHouseFromPlanet(p));
      if (!Number.isFinite(house)) continue;

      const existing = map.get(house) ?? [];
      existing.push(String(p?.planet ?? ""));
      map.set(house, existing);
    }

    return map;
  }, [planets]);

  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Natal Chart Snapshot
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Quick house-wise visual reference for analysis.
          </p>
        </div>

        <SmallBadge>Asc: {ascSign}</SmallBadge>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {Array.from({ length: 12 }, (_, idx) => {
          const house = idx + 1;
          const planetsInHouse = housePlanets.get(house) ?? [];
          const isLagna = house === 1;

          return (
            <div
              key={`mini-house-${house}`}
              className={`min-h-[86px] rounded-2xl border p-3 ${
                isLagna
                  ? "border-[color:var(--primary)] bg-[color:var(--primary)]/5"
                  : "border-slate-200 bg-slate-50/60"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-semibold text-slate-500">
                  H{house}
                </div>
                {isLagna ? (
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-[color:var(--primary)]">
                    Lagna
                  </span>
                ) : null}
              </div>

              <div className="mt-2 text-xs leading-relaxed text-slate-800">
                {planetsInHouse.length ? planetsInHouse.join(", ") : "—"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RuleButton({
  rule,
  active,
  onClick,
}: {
  rule: Rule;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-3 text-left shadow-sm transition ${
        active
          ? "border-[color:var(--primary)] bg-[color:var(--primary)]/5"
          : "border-slate-200 bg-white hover:border-[color:var(--primary)]/60 hover:bg-slate-50"
      }`}
    >
      <div className="flex gap-3">
        <div
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
            active
              ? "bg-[color:var(--primary)] text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {rule.number}
        </div>

        <div>
          <div className="font-semibold text-slate-900">{rule.title}</div>
          <div className="mt-1 text-xs leading-relaxed text-slate-500">
            {rule.subtitle}
          </div>
          <div className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {rule.category}
          </div>
        </div>
      </div>
    </button>
  );
}
function SambandhEngineCard({
  planets = [],
  houses = [],
  currentDasha,
  transitNow,
}: {
  planets?: any[];
  houses?: any[];
  currentDasha?: any;
  transitNow?: any;
}) {
  

  const rows = useMemo(
    () =>
      buildSambandhRows({
        planets,
        houses,
        currentDasha,
        transitNow,
      }),
    [planets, houses, currentDasha, transitNow]
  );

  
  
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Sambandh Engine
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            Shows static and dynamic sambandh between planets, houses, dasha lords,
and current transits using relative house relationships.
          </p>
        </div>

        <SmallBadge>{rows.length} links</SmallBadge>
      </div>

     <div className="mt-5 space-y-4">
  {getDashaPlanetStages(currentDasha).map((stage) => {
    const planetRows = rows.filter((row) =>
      (row.planets ?? []).includes(stage.planet)
    );

    const natalRow = planets.find(
      (p) => String(p?.planet ?? "") === stage.planet
    );

    const transitRow = transitNow?.planets?.find(
      (p: any) => String(p?.planet ?? "") === stage.planet
    );

    const natalHouse = getHouseFromPlanet(natalRow);
    const transitHouse =
      transitRow?.houseFromLagna ?? transitRow?.house ?? "—";

    const distance = relativeHouseDistance(natalHouse, transitHouse);

    return (
      <div
        key={`${stage.label}-${stage.planet}`}
        className="rounded-2xl border border-[color:var(--border)] bg-white p-4 shadow-sm"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-[color:var(--primary)]">
              {stage.label} Lord
            </div>

            <h4 className="mt-1 text-lg font-semibold text-slate-900">
              {stage.planet}
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Natal H{show(natalHouse)} → Transit H{show(transitHouse)}
            </p>
          </div>

          {distance ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
               {ordinalSuffix(distance)} sambandh
              <div className="mt-1 text-xs font-medium text-emerald-700">
                {sambandhTheme(distance)}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Natal
            </div>
            <div className="mt-1 font-semibold text-slate-900">
              H{show(natalHouse)} • {show(natalRow?.sign)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {show(natalRow?.degree)}° • {show(natalRow?.nakshatra)}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Transit
            </div>
            <div className="mt-1 font-semibold text-slate-900">
              H{show(transitHouse)} • {show(transitRow?.sign)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {show(transitRow?.degree)}° • {show(transitRow?.nakshatra)}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Dynamic Meaning
            </div>
            <div className="mt-1 font-semibold text-slate-900">
              {distance ? `${ordinalSuffix(distance)} sambandh` : "—"}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {sambandhTheme(distance)}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Connected Sambandh Rows
          </div>

          {planetRows.length ? (
            planetRows.slice(0, 8).map((row, idx) => (
              <div
                key={`${stage.label}-${stage.planet}-${row.id}-${idx}`}
                className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-sm"
              >
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <div className="font-medium text-slate-900">
                    {row.source} → {row.target}
                  </div>

                  <span
                    className={`w-fit rounded-full px-2 py-1 text-xs font-semibold ${
                      row.strength === "Strong"
                        ? "bg-emerald-100 text-emerald-700"
                        : row.strength === "Medium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {row.strength}
                  </span>
                </div>

                <div className="mt-1 text-xs leading-relaxed text-slate-500">
                  {row.reason}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-sm text-slate-500">
              No sambandh rows found for {stage.planet}.
            </div>
          )}
        </div>
      </div>
    );
  })}

  {getDashaPlanetStages(currentDasha).length === 0 ? (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
      No active dasha planets found.
    </div>
  ) : null}
</div>
    </div>
  );
}
function DataCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      <div className="mt-3">{children}</div>
    </div>
  );
}
const NAKSHATRA_LORDS: Record<string, string> = {
  Ashwini: "Ketu",
  Bharani: "Venus",
  Krittika: "Sun",
  Rohini: "Moon",
  Mrigashira: "Mars",
  Ardra: "Rahu",
  Punarvasu: "Jupiter",
  Pushya: "Saturn",
  Ashlesha: "Mercury",
  Magha: "Ketu",
  "Purva Phalguni": "Venus",
  "Uttara Phalguni": "Sun",
  Hasta: "Moon",
  Chitra: "Mars",
  Swati: "Rahu",
  Vishakha: "Jupiter",
  Anuradha: "Saturn",
  Jyeshtha: "Mercury",
  Mula: "Ketu",
  "Purva Ashadha": "Venus",
  "Uttara Ashadha": "Sun",
  Shravana: "Moon",
  Dhanishta: "Mars",
  Shatabhisha: "Rahu",
  "Purva Bhadrapada": "Jupiter",
  "Uttara Bhadrapada": "Saturn",
  Revati: "Mercury",
};

function getNakshatraLord(row: any) {
  const nakshatra = String(row?.nakshatra ?? "").trim();

  return (
    row?.nakshatraLord ??
    row?.nakshatra_lord ??
    row?.starLord ??
    row?.star_lord ??
    row?.nakLord ??
    row?.nl ??
    row?.nakshatraData?.lord ??
    NAKSHATRA_LORDS[nakshatra] ??
    "—"
  );
}
const HOUSE_THEMES: Record<number, string> = {
  1: "self / identity",
  2: "money / family / speech",
  3: "effort / communication",
  4: "home / emotional foundation",
  5: "creativity / intelligence",
  6: "service / competition / health",
  7: "relationships / public",
  8: "transformation / hidden matters",
  9: "fortune / dharma / guidance",
  10: "career / karma / visibility",
  11: "gains / networks",
  12: "loss / moksha / foreign",
};
function getVargaPlanet(vargas: any, vargaKey: string, planetName: string) {
  const vargaData = vargas?.[vargaKey];
  if (!vargaData) return null;

  const possibleSources = [
    vargaData?.planets,
    vargaData?.chart?.planets,
    vargaData?.data?.planets,
    vargaData?.placements,
    vargaData?.planetPlacements,
    vargaData?.rows,
  ];

  for (const source of possibleSources) {
    if (!source) continue;

    const rows = Array.isArray(source)
      ? source
      : Object.entries(source).map(([key, value]: any) => ({
          planet: value?.planet ?? value?.name ?? key,
          ...value,
        }));

    const match = rows.find(
      (p: any) =>
        String(p?.planet ?? p?.name ?? "").toLowerCase() ===
        planetName.toLowerCase()
    );

    if (match) return match;
  }

  return null;
}
function RuleDetail({
  rule,
  natal,
  planets,
  houses,
  roles,
  currentDasha,
  transitNow,
  triggerEngine,
  vargas,
  houseJudgement,
  natalStrengths = [],
  classicYogas,
nabhasaYogas,
}: Props & { rule: Rule }) {
  const dashaPlanets = getDashaPlanets(currentDasha);
  const transitPlanets = transitNow?.planets ?? [];
  const facts = triggerEngine?.facts ?? [];
  const degreeHits = triggerEngine?.degreeHits ?? [];

  const relevantHouses =
    rule.relatedHouses?.length
      ? rule.relatedHouses
      : rule.key === "lagna"
      ? [1]
      : [];

  const relevantPlanets =
    rule.relatedPlanets?.length
      ? rule.relatedPlanets
      : rule.key === "lagnaLord"
      ? [
          getHouseRow(houses, 1)?.lord ??
            roles?.lagnaLord ??
            "",
        ].filter(Boolean)
      : [];

  const availableVargas = (rule.relatedVargas ?? []).filter((v) => vargas?.[v]);

  const houseRows = relevantHouses.map((house) => {
    const row = getHouseRow(houses, house);
    const judgement = getJudgementRow(houseJudgement, house);

    return {
      house,
      sign: row?.sign ?? judgement?.sign ?? "—",
      lord: row?.lord ?? judgement?.lord ?? "—",
      lordHouse: row?.lordHouse ?? judgement?.lordHouse ?? "—",
      occupants:
        judgement?.occupants?.length
          ? judgement.occupants.join(", ")
          : row?.occupants?.length
          ? row.occupants.join(", ")
          : "—",
      support: supportLabel(judgement?.houseStrengthLabel),
      lordSupport: supportLabel(judgement?.houseLordStrengthBand),
    };
  });

  const planetRows = relevantPlanets.map((planet) => {
    const natalPlanet = getPlanet(planets, planet);
    const transitPlanet = transitPlanets.find((p: any) => p?.planet === planet);

    return {
      planet,
      natalHouse: getHouseFromPlanet(natalPlanet),
      natalSign: natalPlanet?.sign ?? "—",
      natalDegree: natalPlanet?.degree ?? "—",
      natalNakshatra: natalPlanet?.nakshatra ?? "—",
      natalPada: natalPlanet?.pada ?? "—",
      transitHouse: getHouseFromPlanet(transitPlanet),
      transitSign: transitPlanet?.sign ?? "—",
      transitNakshatra: transitPlanet?.nakshatra ?? "—",
      dashaActive: dashaPlanets.includes(planet) ? "Yes" : "No",
    };
  });

  const matchingFacts = Array.from(
  new Map(
    facts
      .filter((fact: any) => {
        const raw = `${fact?.planet ?? ""} ${fact?.house ?? ""} ${fact?.target ?? ""}`;

        return (
          relevantPlanets.some((p) => raw.includes(p)) ||
          relevantHouses.some((h) => raw.includes(String(h)))
        );
      })
      .map((fact: any) => {
        const key = `${fact?.planet}-${fact?.kind}-${fact?.target}-${fact?.house}`;
        return [key, fact];
      })
  ).values()
).slice(0, 5);

  const matchingDegreeHits = degreeHits
    .filter((hit: any) => {
      const raw = `${hit?.planet ?? ""} ${hit?.transitPlanet ?? ""} ${hit?.natalPlanet ?? ""} ${hit?.target ?? ""}`;
      return relevantPlanets.some((p) => raw.includes(p));
    })
    .slice(0, 6);

const evidenceStack = [
  {
    label: "Natal Promise",
    active: houseRows.length > 0 || planetRows.length > 0,
    detail:
      houseRows.length || planetRows.length
        ? "Relevant natal houses or planets are linked to this rule."
        : "No direct natal house or planet link found.",
  },
  {
    label: "Dasha Activation",
    active: relevantPlanets.some((p) => dashaPlanets.includes(p)),
    detail: relevantPlanets.filter((p) => dashaPlanets.includes(p)).length
      ? `${relevantPlanets
          .filter((p) => dashaPlanets.includes(p))
          .join(", ")} active in current dasha.`
      : "No linked planet active in current dasha.",
  },
  {
    label: "Transit Trigger",
    active: matchingFacts.length > 0,
    detail: matchingFacts.length
      ? `${matchingFacts.length} current transit activation link(s) found.`
      : "No current transit trigger linked.",
  },
  {
    label: "Divisional Support",
    active: availableVargas.length > 0,
    detail: availableVargas.length
      ? `${availableVargas.map((v) => v.toUpperCase()).join(", ")} available for cross-check.`
      : "No specific divisional chart linked to this rule.",
  },
  {
    label: "Degree Contact",
    active: matchingDegreeHits.length > 0,
    detail: matchingDegreeHits.length
      ? `${matchingDegreeHits.length} exact/near degree contact(s) found.`
      : "No degree-level contact found.",
  },
];

  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--primary)]">
            Rule {rule.number}
          </div>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">
            {rule.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            {rule.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {relevantHouses.map((h) => (
            <SmallBadge key={`rule-house-${h}`}>H{h}</SmallBadge>
          ))}
          {relevantPlanets.map((p) => (
            <SmallBadge key={`rule-planet-${p}`}>{p}</SmallBadge>
          ))}
          {(rule.relatedVargas ?? []).map((v) => (
            <SmallBadge key={`rule-varga-${v}`}>{v.toUpperCase()}</SmallBadge>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DataCard title="What to Check">
          <div className="grid grid-cols-1 gap-2 text-sm text-slate-700 md:grid-cols-2">
            {rule.checks.map((item) => (
              <div key={`${rule.key}-check-${item}`}>✓ {item}</div>
            ))}
          </div>
        </DataCard>

        <DataCard title="Evidence Stack">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {evidenceStack.map((layer) => (
              <div
                key={`${rule.key}-layer-${layer.label}`}
                className={`rounded-xl border p-3 ${
                  layer.active
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div
                  className={`text-xs font-semibold ${
                    layer.active ? "text-emerald-800" : "text-slate-500"
                  }`}
                >
                  {layer.active ? "✓ " : "○ "}
                  {layer.label}
                </div>
                <div className="mt-1 text-[11px] leading-relaxed text-slate-600">
                  {layer.detail}
                </div>
              </div>
            ))}
          </div>
        </DataCard>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {houseRows.length ? (
          <DataCard title="Linked House Data">
            <div className="space-y-3">
              {houseRows.map((row) => (
                <div
                  key={`${rule.key}-house-${row.house}`}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-sm text-slate-700"
                >
                  <div className="font-semibold text-slate-900">
                    H{row.house} — {show(row.sign)}
                  </div>
                  <div className="mt-1">
                    Lord {show(row.lord)} in H{show(row.lordHouse)}
                  </div>
                  <div>Occupants: {show(row.occupants)}</div>
                  <div>House support: {row.support}</div>
                  <div>Lord support: {row.lordSupport}</div>
                </div>
              ))}
            </div>
          </DataCard>
        ) : null}

        {planetRows.length ? (
          <DataCard title="Linked Planet Data">
            <div className="space-y-3">
              {planetRows.map((row) => (
                <div
                  key={`${rule.key}-planet-${row.planet}`}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-sm text-slate-700"
                >
                  <div className="font-semibold text-slate-900">
                    {row.planet}
                  </div>
                  <div className="mt-1">
                    Natal: H{show(row.natalHouse)} • {show(row.natalSign)} •{" "}
                    {show(row.natalDegree)}°
                  </div>
                  <div>
                    Nakshatra: {show(row.natalNakshatra)}{" "}
                    {row.natalPada !== "—" ? `• Pada ${row.natalPada}` : ""}
                  </div>
                  <div>
                    Transit: H{show(row.transitHouse)} • {show(row.transitSign)}{" "}
                    • {show(row.transitNakshatra)}
                  </div>
                  {row.dashaActive === "Yes" ? (
  <div className="text-emerald-700">
    Dasha active
  </div>
) : null}
                </div>
              ))}
            </div>
          </DataCard>
              ) : null}
{rule.key === "dasha" ? (
  <div className="mt-5 max-w-4xl">
  <DataCard title="Active Dasha Lord Analysis">
      <div className="space-y-3">
        {Array.from(new Set(dashaPlanets)).map((planet) => {
          const natalPlanet = getPlanet(planets, planet);
          const transitPlanet = transitNow?.planets?.find(
            (p: any) => String(p?.planet ?? "") === planet
          );

          return (
            <div
              key={`dasha-analysis-${planet}`}
              className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"
            >
              <div className="font-semibold text-slate-900">{planet}</div>

              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-white p-3 text-sm">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Natal Placement
                  </div>
                  <div className="mt-1">
                    H{show(getHouseFromPlanet(natalPlanet))} •{" "}
                    {show(natalPlanet?.sign)} • {show(natalPlanet?.degree)}°
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {show(natalPlanet?.nakshatra)}{" "}
                    {natalPlanet?.pada ? `• Pada ${natalPlanet.pada}` : ""}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-white p-3 text-sm">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Current Transit
                  </div>
                  <div className="mt-1">
                    H{show(transitPlanet?.houseFromLagna ?? transitPlanet?.house)} •{" "}
                    {show(transitPlanet?.sign)} • {show(transitPlanet?.degree)}°
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {show(transitPlanet?.nakshatra)}{" "}
                    {transitPlanet?.pada ? `• Pada ${transitPlanet.pada}` : ""}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DataCard>
  </div>
) : null}
{planetRows.length && rule.relatedVargas?.length ? (
  <DataCard title="Varga Placement Snapshot">
    <div className="space-y-3">
      {CLASSICAL_PLANETS.map((planetName) => (
        <div
          key={`${rule.key}-varga-snapshot-${planetName}`}
          className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-sm"
        >
          <div className="font-semibold text-slate-900">{planetName}</div>

          <div className="mt-2 grid grid-cols-1 gap-2">
            {(rule.relatedVargas ?? []).map((vargaKey) => {
              const vargaPlanet = getVargaPlanet(vargas, vargaKey, planetName);

              return (
                <div
                  key={`${rule.key}-${planetName}-${vargaKey}`}
                  className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-xs text-slate-600"
                >
                  <span className="font-semibold text-slate-800">
                    {vargaKey.toUpperCase()}:
                  </span>{" "}
                  {vargaPlanet ? (
                    <>
                      H{show(getHouseFromPlanet(vargaPlanet))} • {show(vargaPlanet?.sign)}
                    </>
                  ) : (
                    "not available"
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </DataCard>
) : null}
{rule.key === "transit" ? (
  <div className="mt-5 max-w-5xl">
    <DataCard title="Current Transit Snapshot">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {(transitNow?.planets ?? [])
          .filter((p: any) => isClassicalPlanet(p?.planet))
          .map((p: any) => (
            <div
              key={`transit-rule-${p?.planet}`}
              className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-sm"
            >
              <div className="font-semibold text-slate-900">
                {show(p?.planet)}
              </div>

              <div className="mt-1 text-slate-600">
                H{show(p?.houseFromLagna ?? p?.house)} • {show(p?.sign)} •{" "}
                {show(p?.degree)}°
              </div>

              <div className="mt-1 text-xs text-slate-500">
                {show(p?.nakshatra)}{" "}
                {p?.pada ? `• Pada ${p.pada}` : ""}
                {p?.retrograde ? " • Retrograde" : ""}
              </div>
            </div>
          ))}
      </div>
    </DataCard>
  </div>
) : null}
{rule.key === "houseActivation" ? (
  <div className="mt-5 max-w-5xl">
    <DataCard title="Current House Activation Map">
      <div className="grid grid-cols-1 gap-3">
        {Array.from({ length: 12 }, (_, idx) => idx + 1)
          .map((house) => {
            const natalHits = (planets ?? []).filter(
              (p: any) =>
                isClassicalPlanet(p?.planet) &&
                Number(getHouseFromPlanet(p)) === house
            );

            const transitHits = (transitNow?.planets ?? []).filter(
              (p: any) =>
                isClassicalPlanet(p?.planet) &&
                Number(p?.houseFromLagna ?? p?.house) === house
            );

            const total = natalHits.length + transitHits.length;

            if (!total) return null;

            return (
              <div
                key={`house-activation-${house}`}
                className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">
                      House {house}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {HOUSE_THEMES[house]}
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                    {total} activations
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  {natalHits.length ? (
                    <div>
                      Natal:{" "}
                      {natalHits.map((x: any) => x?.planet).join(", ")}
                    </div>
                  ) : null}

                  {transitHits.length ? (
                    <div>
                      Transit:{" "}
                      {transitHits.map((x: any) => x?.planet).join(", ")}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })
          .filter(Boolean)}
      </div>
    </DataCard>
  </div>
) : null}
{rule.key === "chartTheme" ? (
  <div className="mt-5 max-w-5xl">
    <DataCard title="Dominant Chart Themes">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {Array.from({ length: 12 }, (_, idx) => idx + 1)
          .map((house) => {
            const natalHits = (planets ?? []).filter(
              (p: any) =>
                isClassicalPlanet(p?.planet) &&
                Number(getHouseFromPlanet(p)) === house
            );

            const transitHits = (transitNow?.planets ?? []).filter(
              (p: any) =>
                isClassicalPlanet(p?.planet) &&
                Number(p?.houseFromLagna ?? p?.house) === house
            );

            const dashaHits = dashaPlanets.filter((planet) => {
              const natalPlanet = getPlanet(planets, planet);

              return (
                Number(getHouseFromPlanet(natalPlanet)) === house
              );
            });

            const score =
              natalHits.length +
              transitHits.length +
              dashaHits.length;

            return {
              house,
              natalHits,
              transitHits,
              dashaHits,
              score,
            };
          })
          .filter((x) => x.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 6)
          .map((row, idx) => (
            <div
              key={`chart-theme-${row.house}`}
              className={`rounded-xl p-4 ${
                idx === 0
                  ? "border border-indigo-300 bg-indigo-50/70 ring-1 ring-indigo-200"
                  : "border border-slate-100 bg-slate-50/70"
              }`}
            >
              <div className="flex flex-col gap-2">
                <div>
                  <div className="font-semibold text-slate-900">
                    House {row.house}
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    {HOUSE_THEMES[row.house]}
                  </div>
                </div>

               <span className="w-fit rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">
  Score {row.score}
</span>
              </div>

              <div className="mt-3 space-y-1 text-sm text-slate-600">
                {row.natalHits.length ? (
                  <div>
                    Natal:{" "}
                    {row.natalHits
                      .map((x: any) => x?.planet)
                      .join(", ")}
                  </div>
                ) : null}

                {row.transitHits.length ? (
                  <div>
                    Transit:{" "}
                    {row.transitHits
                      .map((x: any) => x?.planet)
                      .join(", ")}
                  </div>
                ) : null}

                {row.dashaHits.length ? (
                  <div>
                    Dasha: {row.dashaHits.join(", ")}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
      </div>
    </DataCard>
  </div>
) : null}
        {rule.key === "planetStrength" ? (
          <DataCard title="Planet Status Matrix">
            <div className="space-y-3">
              {(planets ?? [])
                .filter((p: any) =>
                  [
                    "Sun",
                    "Moon",
                    "Mars",
                    "Mercury",
                    "Jupiter",
                    "Venus",
                    "Saturn",
                    "Rahu",
                    "Ketu",
                  ].includes(String(p?.planet ?? ""))
                )
                .map((p: any) => {
                  const planet = String(p?.planet ?? "");
                  const strengthRow = natalStrengths.find(
  (s: any) => String(s?.planet ?? "") === planet
);
                  const flags = [
  strengthRow?.isVargottama ? "Vargottama" : null,
  strengthRow?.combust ? "Combust" : null,
  strengthRow?.retrograde ? "Retrograde" : null,
  strengthRow?.isExalted ? "Exalted" : null,
  strengthRow?.isDebilitated ? "Debilitated" : null,
  strengthRow?.isOwnSign ? "Own Sign" : null,
  strengthRow?.strengthBand
    ? `Strength: ${strengthRow.strengthBand}`
    : null,
  strengthRow?.dignity
    ? `Dignity: ${strengthRow.dignity}`
    : null,
].filter(Boolean);

                  return (
                    <div
                      key={`planet-strength-status-${planet}`}
                      className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-sm"
                    >
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="font-semibold text-slate-900">
                            {planet}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            H{show(getHouseFromPlanet(p))} • {show(p?.sign)} •{" "}
                            {show(p?.degree)}°
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {flags.length ? (
                            flags.map((flag) => (
                              <span
                                key={`${planet}-${flag}`}
                                className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700"
                              >
                                {flag}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400">
                              No flags
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </DataCard>
        ) : null}
      </div>
{rule.key === "yogas" ? (
  <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
    <DataCard title="Detected Classic Yogas">
      <div className="space-y-3 text-sm text-slate-700">
        {classicYogas && typeof classicYogas === "object" ? (
          Object.entries(classicYogas).map(([key, value]: any) => {
            const detected =
              value?.detected === true ||
              value?.present === true ||
              value?.exists === true;

            return (
              <div
                key={`classic-yoga-${key}`}
                className={`rounded-xl border p-3 ${
                  detected
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-slate-100 bg-slate-50/70"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-slate-900">
                    {show(value?.name ?? key)}
                  </div>

                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      detected
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {detected ? "Detected" : "Not detected"}
                  </span>
                </div>

                <div className="mt-2 text-xs leading-relaxed text-slate-500">
                  {show(value?.reason ?? value?.rule ?? value?.description ?? "—")}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-slate-500">No classic yoga data available.</div>
        )}
      </div>
    </DataCard>

    <DataCard title="Detected Nabhasa Yogas">
      <div className="space-y-3 text-sm text-slate-700">
       {nabhasaYogas?.detected ? (() => {
  const detectedNabhasa = Array.isArray(nabhasaYogas.detected)
  ? nabhasaYogas.detected[0]
  : typeof nabhasaYogas.detected === "object"
  ? nabhasaYogas.detected
  : nabhasaYogas;

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-slate-900">
                {show(detectedNabhasa?.name ?? detectedNabhasa?.id ?? "Nabhasa Yoga")}
              </div>

              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                Detected
              </span>
            </div>

            <div className="mt-2 text-xs leading-relaxed text-slate-600">
              {show(detectedNabhasa?.theme)}
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-600">
              <div>
                <span className="font-semibold text-slate-700">
                  Occupied Houses:
                </span>{" "}
                {Array.isArray(detectedNabhasa?.occupiedHouses)
  ? detectedNabhasa.occupiedHouses.join(", ")
  : "—"}
              </div>

              <div>
                <span className="font-semibold text-slate-700">
                  Occupied Signs:
                </span>{" "}
                {Array.isArray(detectedNabhasa?.occupiedSigns)
  ? detectedNabhasa.occupiedSigns.join(", ")
  : "—"}
              </div>

              <div>
                <span className="font-semibold text-slate-700">
                  Checked Planets:
                </span>{" "}
                {Array.isArray(detectedNabhasa?.planetsChecked)
  ? detectedNabhasa.planetsChecked.join(", ")
  : "—"}
              </div>
            </div>
           </div>
  );
})() : nabhasaYogas?.summary ? (
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="font-semibold text-slate-900">Summary</div>
            <div className="mt-2 text-xs leading-relaxed text-slate-500">
              Total detected: {show(nabhasaYogas.summary?.totalDetected)}
            </div>
          </div>
        ) : (
          <div className="text-slate-500">No Nabhasa yoga data available.</div>
        )}
      </div>
    </DataCard>
  </div>
) : null}
{rule.key === "nakshatra" ? (
  <div className="mt-5">
    <DataCard title="Nakshatra Pattern Matrix">
      <div className="space-y-3">
        {(planets ?? [])
          .filter((p: any) =>
            [
              "Sun",
              "Moon",
              "Mars",
              "Mercury",
              "Jupiter",
              "Venus",
              "Saturn",
              "Rahu",
              "Ketu",
            ].includes(String(p?.planet ?? ""))
          )
          .map((p: any) => {
            const planet = String(p?.planet ?? "");

            const matchingNakshatraPlanets = (planets ?? []).filter(
              (x: any) =>
                x?.planet !== planet &&
                String(x?.nakshatra ?? "") ===
                  String(p?.nakshatra ?? "")
            );

            return (
              <div
                key={`nakshatra-pattern-${planet}`}
                className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {planet}
                    </div>

                    <div className="mt-1 text-sm text-slate-600">
                      {show(p?.nakshatra)}{" "}
                      {p?.pada ? `• Pada ${p?.pada}` : ""}
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      H{show(getHouseFromPlanet(p))} •{" "}
                      {show(p?.sign)} • {show(p?.degree)}°
                    </div>
                  </div>

                  <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700">
                    Nakshatra Lord:{" "}
                   {show(getNakshatraLord(p))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-100 bg-white p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Repeated Nakshatra Theme
                    </div>

                    <div className="mt-2 text-sm text-slate-700">
                      {matchingNakshatraPlanets.length ? (
                        <>
                          Shared with:{" "}
                          <span className="font-semibold">
                            {matchingNakshatraPlanets
                              .map((x: any) => x?.planet)
                              .join(", ")}
                          </span>
                        </>
                      ) : (
                        "Unique nakshatra placement."
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Dasha Activation
                    </div>

                    <div className="mt-2 text-sm text-slate-700">
                      {dashaPlanets.includes(planet)
                        ? `${planet} active in current dasha sequence.`
                        : "Not active in current dasha."}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </DataCard>
  </div>
) : null}
{rule.key === "repetition" ? (
  <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
    <DataCard title="Repeated Planet Focus">
      <div className="space-y-3">
        {Array.from(new Set(dashaPlanets)).map((planet) => {
          const natalMatches = (planets ?? []).filter(
            (p: any) => String(p?.planet ?? "") === planet
          );

          const transitMatches = (transitNow?.planets ?? []).filter(
            (p: any) => String(p?.planet ?? "") === planet
          );

          const repeatedNakshatra = (planets ?? []).filter(
  (p: any) =>
    isClassicalPlanet(p?.planet) &&
    p?.planet !== planet &&
    String(p?.nakshatra ?? "") ===
      String(natalMatches?.[0]?.nakshatra ?? "")
);

          const score =
            natalMatches.length +
            transitMatches.length +
            repeatedNakshatra.length +
            1;

          return (
            <div
              key={`repetition-planet-${planet}`}
              className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold text-slate-900">
                  {planet}
                </div>

                <span
  className={`rounded-full px-2 py-1 text-xs font-semibold ${
    score >= 5
      ? "bg-emerald-100 text-emerald-700"
      : score >= 3
      ? "bg-amber-100 text-amber-700"
      : "bg-slate-200 text-slate-700"
  }`}
>
  {score >= 5
    ? "High Repetition"
    : score >= 3
    ? "Moderate Repetition"
    : "Focused Activation"}
</span>
              </div>

              <div className="mt-3 space-y-1 text-sm text-slate-600">
                <div>• Active in current dasha</div>

                {natalMatches.length ? (
                  <div>
                    • Natal placement in H
                    {show(getHouseFromPlanet(natalMatches[0]))}
                  </div>
                ) : null}

                {transitMatches.length ? (
                  <div>
                    • Transit activation in H
                    {show(
                      transitMatches[0]?.houseFromLagna ??
                        transitMatches[0]?.house
                    )}
                  </div>
                ) : null}

                {repeatedNakshatra.length ? (
                  <div>
                    • Shared nakshatra with{" "}
                    <div className="pt-2 text-xs italic text-slate-500">
  {planet} repeatedly activates themes of{" "}
  {HOUSE_THEMES[
    Number(getHouseFromPlanet(natalMatches?.[0]))
  ] ?? "core life focus"}.
</div>
                    {repeatedNakshatra
                      .map((x: any) => x?.planet)
                      .join(", ")}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </DataCard>

   <DataCard title="Repeated House Focus">
  <div className="space-y-3">
    {Array.from({ length: 12 }, (_, idx) => {
      const house = idx + 1;

      const natalHits = (planets ?? []).filter(
        (p: any) =>
          isClassicalPlanet(p?.planet) &&
          Number(getHouseFromPlanet(p)) === house
      );

      const transitHits = (transitNow?.planets ?? []).filter(
        (p: any) =>
          isClassicalPlanet(p?.planet) &&
          Number(p?.houseFromLagna ?? p?.house) === house
      );

      const total = natalHits.length + transitHits.length;

      return {
        house,
        natalHits,
        transitHits,
        total,
      };
    })
      .filter((row) => row.total > 0)
      .sort((a, b) => b.total - a.total)
      .map((row, idx) => (
        <div
          key={`house-repeat-${row.house}`}
          className={`rounded-xl p-4 ${
  idx === 0
    ? "border border-emerald-300 bg-emerald-50/70 ring-1 ring-emerald-200"
    : "border border-slate-100 bg-slate-50/70"
}`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-slate-900">
                House {row.house}
              </div>

              <div className="mt-1 text-xs text-slate-500">
                {HOUSE_THEMES[row.house]}
              </div>
            </div>

            <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
              {row.total} activations
            </span>
          </div>

          <div className="mt-3 space-y-1 text-sm text-slate-600">
            {row.natalHits.length ? (
              <div>
                • Natal:{" "}
                {row.natalHits.map((x: any) => x?.planet).join(", ")}
              </div>
            ) : null}

            {row.transitHits.length ? (
              <div>
                • Transit:{" "}
                {row.transitHits.map((x: any) => x?.planet).join(", ")}
              </div>
            ) : null}
          </div>
        </div>
      ))}
  </div>
</DataCard>
  </div>
) : null}
      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {rule.key !== "dasha" ? (
        <DataCard title="Current Dasha">
          <div className="space-y-2 text-sm text-slate-700">
            {dashaPlanets.length ? (
              dashaPlanets.map((p, idx) => (
  <div key={`${rule.key}-dasha-${p}-${idx}`}>• {p}</div>
))
            ) : (
              <div>—</div>
            )}
          </div>
        </DataCard>
) : null}
        {matchingFacts.length ? (
  <DataCard title="Current Activation Facts">
    <div className="space-y-2 text-sm text-slate-700">
      {matchingFacts.map((fact: any, idx: number) => (
        <div key={`${rule.key}-fact-${idx}`}>
          • {show(fact?.planet)} — {show(fact?.kind)} —{" "}
          {show(fact?.target ?? fact?.house)}
        </div>
      ))}
    </div>
  </DataCard>
) : null}

        <DataCard title="Divisional Cross-Check">
          <div className="space-y-2 text-sm text-slate-700">
            {(rule.relatedVargas ?? []).length ? (
              (rule.relatedVargas ?? []).map((v) => (
                <div key={`${rule.key}-varga-${v}`}>
                  • {v.toUpperCase()}: {vargas?.[v] ? "available" : "not available"}
                </div>
              ))
            ) : (
              <div className="text-slate-500">
  No specific divisional chart required for this rule.
</div>
            )}
          </div>
        </DataCard>
      </div>
    </div>
  );
}

export default function AnalysisFrameworkCard({
  natal,
  planets = [],
  houses = [],
  roles,
  currentDasha,
  transitNow,
  triggerEngine,
  vargas = {},
  houseJudgement = [],
  natalStrengths = [],
  classicYogas,
nabhasaYogas,
}: Props) {
  const [openRule, setOpenRule] = useState<RuleKey>("lagna");
  const [category, setCategory] = useState<
    "All" | "Foundation" | "Judgement" | "Timing" | "Life Area"
  >("All");

  const activeRule = RULES.find((rule) => rule.key === openRule) ?? RULES[0];
  const dashaPlanets = getDashaPlanets(currentDasha);

  const filteredRules =
    category === "All"
      ? RULES
      : RULES.filter((rule) => rule.category === category);

  return (
    <section className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Analysis Framework
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-500">
            A rule-based chart analysis workspace. It does not predict or
            interpret — it organizes the exact factors astrologers should check
            before forming judgement.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {dashaPlanets.length ? (
            <SmallBadge>Dasha: {dashaPlanets.join(" / ")}</SmallBadge>
          ) : null}
          <SmallBadge>Data-only</SmallBadge>
          <SmallBadge>Rule-based</SmallBadge>
        </div>
      </div>
      <div className="mt-6">
  <SambandhEngineCard
    planets={planets}
    houses={houses}
    currentDasha={currentDasha}
    transitNow={transitNow}
  />
</div>
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <MiniChart natal={natal} planets={planets} />

        <div className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            How to Use This Framework
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Start from the foundation rules, then move to judgement rules, then
            timing rules. Life-area lenses can be opened when the client asks a
            specific question.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Step 1
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                Establish Promise
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Lagna, lord, Moon, Sun, houses, strength.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Step 2
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                Check Repetition
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Natal, varga, dasha, transit, degree.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Step 3
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                Time the Trigger
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Dasha activates, transit triggers.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {["All", "Foundation", "Judgement", "Timing", "Life Area"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item as any)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              category === item
                ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-white"
                : "border-[color:var(--border)] bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[360px_1fr]">
        <div className="space-y-3">
          {filteredRules.map((rule) => (
            <RuleButton
              key={rule.key}
              rule={rule}
              active={openRule === rule.key}
              onClick={() => setOpenRule(rule.key)}
            />
          ))}
        </div>
        
        <RuleDetail
          rule={activeRule}
          natal={natal}
          planets={planets}
          houses={houses}
          roles={roles}
          currentDasha={currentDasha}
          transitNow={transitNow}
          triggerEngine={triggerEngine}
          vargas={vargas}
          houseJudgement={houseJudgement}
          natalStrengths={natalStrengths}
          classicYogas={classicYogas}
nabhasaYogas={nabhasaYogas}
        />
      </div>
    </section>
  );
}