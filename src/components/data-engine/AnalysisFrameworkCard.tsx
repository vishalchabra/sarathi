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
    key: "coreHouses",
    number: "7",
    title: "Core Houses to Never Ignore",
    subtitle: "The twelve life areas that structure the chart.",
    category: "Judgement",
    checks: [
      "H1 identity and health.",
      "H2 family, speech, accumulated wealth.",
      "H3 effort, courage, communication.",
      "H4 home, mother, property, peace.",
      "H5 intelligence, children, creativity.",
      "H6 debts, disease, disputes, service.",
      "H7 marriage and partnerships.",
      "H8 transformation, occult, sudden events.",
      "H9 dharma, fortune, guru.",
      "H10 career and karma.",
      "H11 gains and networks.",
      "H12 losses, moksha, foreign lands.",
    ],
    relatedHouses: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  {
    key: "dharmaArthaKamaMoksha",
    number: "8",
    title: "Dharma–Artha–Kama–Moksha Balance",
    subtitle: "Identify which life quadrant dominates the chart.",
    category: "Judgement",
    checks: [
      "Dharma houses: 1, 5, 9.",
      "Artha houses: 2, 6, 10.",
      "Kama houses: 3, 7, 11.",
      "Moksha houses: 4, 8, 12.",
      "Check which group has more planets, stronger lords, or current activation.",
    ],
    relatedHouses: [1, 5, 9, 2, 6, 10, 3, 7, 11, 4, 8, 12],
  },
  {
    key: "planetStrength",
    number: "9",
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
    number: "10",
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
    number: "11",
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
    number: "12",
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
    number: "13",
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
    number: "14",
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
    number: "15",
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
    number: "16",
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
    number: "17",
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
    number: "18",
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
    number: "19",
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
    number: "20",
    title: "Final Prediction Checklist",
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

  const repetitionLayers = [
    {
      label: "Natal",
      active: houseRows.length > 0 || planetRows.length > 0,
      detail:
        houseRows.length || planetRows.length
          ? "Natal structure available for this rule"
          : "No direct natal rows linked",
    },
    {
      label: "Dasha",
      active: relevantPlanets.some((p) => dashaPlanets.includes(p)),
      detail: relevantPlanets.filter((p) => dashaPlanets.includes(p)).length
        ? `${relevantPlanets.filter((p) => dashaPlanets.includes(p)).join(", ")} active`
        : "No direct dasha link",
    },
    {
      label: "Transit",
      active: matchingFacts.length > 0,
      detail: matchingFacts.length
        ? `${matchingFacts.length} activation fact(s)`
        : "No activation fact linked",
    },
    {
      label: "Divisional",
      active: availableVargas.length > 0,
      detail: availableVargas.length
        ? `${availableVargas.map((v) => v.toUpperCase()).join(", ")} available`
        : "No linked varga available",
    },
    {
      label: "Degree",
      active: matchingDegreeHits.length > 0,
      detail: matchingDegreeHits.length
        ? `${matchingDegreeHits.length} degree contact(s)`
        : "No degree contact linked",
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

        <DataCard title="Repetition Layer">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {repetitionLayers.map((layer) => (
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
                  <div>Dasha active: {row.dashaActive}</div>
                </div>
              ))}
            </div>
          </DataCard>
        ) : null}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
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

        <DataCard title="Current Activation Facts">
          <div className="space-y-2 text-sm text-slate-700">
            {matchingFacts.length ? (
              matchingFacts.map((fact: any, idx: number) => (
                <div key={`${rule.key}-fact-${idx}`}>
                  • {show(fact?.planet)} — {show(fact?.kind)} —{" "}
                  {show(fact?.target ?? fact?.house)}
                </div>
              ))
            ) : (
              <div>—</div>
            )}
          </div>
        </DataCard>

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
        />
      </div>
    </section>
  );
}