import type {
  BaseReasoningResult,
} from "./baseReasoningEngine";

export type BusinessArchetypeKey =
  | "knowledge_advisory"
  | "technology_platform"
  | "education_training"
  | "financial_advisory"
  | "marketing_branding"
  | "structured_b2b_services"
  | "digital_commerce"
  | "research_analytics"
  | "spiritual_guidance"
  | "manufacturing_operations"
  | "hospitality_food"
  | "speculative_trading";

export type BusinessArchetypeFinding = {
  key: BusinessArchetypeKey;
  label: string;
  score: number;
  fit: "strong" | "moderate" | "low";
  reasons: string[];
  cautions: string[];
};

export type BusinessArchetypeResult = {
  dominantPlanets: Array<{
    planet: string;
    score: number;
    roles: string[];
    placement: string | null;
  }>;

  dominantCommercialThemes: string[];

  strongestArchetypes: BusinessArchetypeFinding[];
  moderateArchetypes: BusinessArchetypeFinding[];
  lowerFitArchetypes: BusinessArchetypeFinding[];

  preferredBusinessModels: string[];
  preferredOperatingStyle: string[];
  preferredRole: string;

  evidence: string[];
};

type BundleLike = any;

type PlanetSignal = {
  planet: string;
  score: number;
  roles: string[];
  placement: string | null;
};

const BUSINESS_HOUSES = [2, 3, 7, 10, 11] as const;

function normalize(value: unknown): string {
  return String(value ?? "").trim();
}

function normalizeLower(value: unknown): string {
  return normalize(value).toLowerCase();
}

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => normalize(value))
        .filter(Boolean)
    )
  );
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getCanonicalContext(bundle: BundleLike): any {
  return bundle?.canonicalChartContext ?? null;
}

function getPlanet(bundle: BundleLike, planetName: string): any | null {
  const planets = getCanonicalContext(bundle)?.planets ?? [];

  return (
    planets.find(
      (planet: any) =>
        normalizeLower(planet?.planet) === normalizeLower(planetName)
    ) ?? null
  );
}

function getHouseLord(bundle: BundleLike, house: number): string | null {
  return (
    getCanonicalContext(bundle)?.houseLords?.[house] ??
    null
  );
}

function getHouseSign(bundle: BundleLike, house: number): string | null {
  return (
    getCanonicalContext(bundle)?.houseSigns?.[house] ??
    null
  );
}

function placementText(bundle: BundleLike, planetName: string): string | null {
  const placement = getPlanet(bundle, planetName);

  if (!placement) {
    return null;
  }

  const parts = [
    placement.sign ? `${planetName} in ${placement.sign}` : planetName,
    placement.house ? `house ${placement.house}` : null,
    placement.nakshatra ? `${placement.nakshatra} nakshatra` : null,
  ].filter(Boolean);

  return parts.join(", ");
}

function getOwnedBusinessHouses(bundle: BundleLike, planetName: string): number[] {
  return BUSINESS_HOUSES.filter(
    (house) =>
      normalizeLower(getHouseLord(bundle, house)) ===
      normalizeLower(planetName)
  );
}

function getSambandhaReasons(bundle: BundleLike, planetName: string): string[] {
  const links =
    bundle?.sambandhaAnalysis?.relationships ??
    bundle?.sambandhaAnalysis?.supportiveLinks ??
    [];

  return uniqueStrings(
    links
      .filter(
        (link: any) =>
          normalizeLower(link?.planetA) === normalizeLower(planetName) ||
          normalizeLower(link?.planetB) === normalizeLower(planetName)
      )
      .map((link: any) => link?.reason)
  );
}

function buildPlanetSignal(bundle: BundleLike, planetName: string): PlanetSignal {
  const placement = getPlanet(bundle, planetName);
  const ownedHouses = getOwnedBusinessHouses(bundle, planetName);
  const sambandhaReasons = getSambandhaReasons(bundle, planetName);

  let score = 0;
  const roles: string[] = [];

  if (placement) {
    score += 10;
  }

  if (ownedHouses.length > 0) {
    score += ownedHouses.length * 14;
    roles.push(
      ...ownedHouses.map(
        (house) => `lord of business-relevant house ${house}`
      )
    );
  }

  if (placement?.house && BUSINESS_HOUSES.includes(placement.house)) {
    score += 14;
    roles.push(`placed in business-relevant house ${placement.house}`);
  }

  if (sambandhaReasons.length > 0) {
    score += Math.min(22, sambandhaReasons.length * 6);
    roles.push("connected with other business-producing factors");
  }

  const activeDashaLords = [
    bundle?.currentDasha?.md,
    bundle?.currentDasha?.ad,
    bundle?.currentDasha?.pd,
  ]
    .map((value) => normalizeLower(value))
    .filter(Boolean);

  if (activeDashaLords.includes(normalizeLower(planetName))) {
    score += 10;
    roles.push("active in the current dasha chain");
  }

  return {
    planet: planetName,
    score: clamp(score),
    roles: uniqueStrings(roles),
    placement: placementText(bundle, planetName),
  };
}

function addReason(
  reasons: string[],
  condition: boolean,
  reason: string
): void {
  if (condition) {
    reasons.push(reason);
  }
}

function planetScore(
  signals: Record<string, PlanetSignal>,
  planet: string
): number {
  return signals[planet]?.score ?? 0;
}

function makeArchetype(params: {
  key: BusinessArchetypeKey;
  label: string;
  score: number;
  reasons: string[];
  cautions?: string[];
}): BusinessArchetypeFinding {
  const score = clamp(params.score);

  return {
    key: params.key,
    label: params.label,
    score,
    fit:
      score >= 70
        ? "strong"
        : score >= 45
        ? "moderate"
        : "low",
    reasons: uniqueStrings(params.reasons).slice(0, 6),
    cautions: uniqueStrings(params.cautions ?? []).slice(0, 4),
  };
}

function buildArchetypes(
  bundle: BundleLike,
  base: BaseReasoningResult,
  signals: Record<string, PlanetSignal>
): BusinessArchetypeFinding[] {
  const mercury = planetScore(signals, "Mercury");
  const jupiter = planetScore(signals, "Jupiter");
  const saturn = planetScore(signals, "Saturn");
  const rahu = planetScore(signals, "Rahu");
  const venus = planetScore(signals, "Venus");
  const mars = planetScore(signals, "Mars");
  const moon = planetScore(signals, "Moon");
  const sun = planetScore(signals, "Sun");

  const knowledgeReasons: string[] = [];
  addReason(
    knowledgeReasons,
    mercury >= 45,
    "Mercury is commercially significant, supporting analysis, communication, systems, and advisory work."
  );
  addReason(
    knowledgeReasons,
    jupiter >= 45,
    "Jupiter is commercially significant, supporting guidance, education, finance, and knowledge-led services."
  );
  addReason(
    knowledgeReasons,
    base.layers.sambandha.score >= 55,
    "The business-producing factors are sufficiently connected to convert knowledge into commercial value."
  );

  const technologyReasons: string[] = [];
  addReason(
    technologyReasons,
    mercury >= 45,
    "Mercury supports software, analytics, communication, and digital systems."
  );
  addReason(
    technologyReasons,
    rahu >= 35,
    "Rahu supports unconventional, digital, foreign-facing, or technology-led models."
  );
  addReason(
    technologyReasons,
    saturn >= 40,
    "Saturn supports scalable systems, process discipline, and long-term platform building."
  );

  const educationReasons: string[] = [];
  addReason(
    educationReasons,
    jupiter >= 45,
    "Jupiter supports teaching, mentoring, structured knowledge, and institutional credibility."
  );
  addReason(
    educationReasons,
    mercury >= 40,
    "Mercury supports explanation, curriculum, communication, and digital learning."
  );

  const financeReasons: string[] = [];
  addReason(
    financeReasons,
    jupiter >= 45,
    "Jupiter supports advisory judgement, finance, governance, and trust-based guidance."
  );
  addReason(
    financeReasons,
    mercury >= 40,
    "Mercury supports numbers, analysis, reporting, and commercial decision-making."
  );
  addReason(
    financeReasons,
    saturn >= 35,
    "Saturn supports compliance, structure, controls, and long-term financial discipline."
  );

  const brandingReasons: string[] = [];
  addReason(
    brandingReasons,
    venus >= 40,
    "Venus supports branding, aesthetics, client experience, and relationship-led commerce."
  );
  addReason(
    brandingReasons,
    mercury >= 35,
    "Mercury supports messaging, content, campaigns, and commercial communication."
  );
  addReason(
    brandingReasons,
    moon >= 30,
    "Moon supports audience sensitivity and emotional understanding."
  );

  const b2bReasons: string[] = [];
  addReason(
    b2bReasons,
    saturn >= 45,
    "Saturn supports process-heavy, contract-led, recurring B2B services."
  );
  addReason(
    b2bReasons,
    mercury >= 35,
    "Mercury supports service design, documentation, account management, and systems."
  );
  addReason(
    b2bReasons,
    base.layers.divisional.score >= 48,
    "The divisional picture provides at least moderate support for professional execution."
  );

  const commerceReasons: string[] = [];
  addReason(
    commerceReasons,
    mercury >= 40,
    "Mercury supports trade, pricing, negotiation, brokerage, and exchange."
  );
  addReason(
    commerceReasons,
    rahu >= 35,
    "Rahu supports digital reach, marketplaces, foreign links, and non-traditional channels."
  );
  addReason(
    commerceReasons,
    venus >= 30,
    "Venus supports customer appeal and marketability."
  );

  const researchReasons: string[] = [];
  addReason(
    researchReasons,
    mercury >= 45,
    "Mercury supports analysis, research, writing, and data interpretation."
  );
  addReason(
    researchReasons,
    saturn >= 35,
    "Saturn supports method, rigour, repeatable frameworks, and long-form work."
  );
  addReason(
    researchReasons,
    jupiter >= 35,
    "Jupiter supports synthesis, judgement, and meaning-making."
  );

  const spiritualReasons: string[] = [];
  addReason(
    spiritualReasons,
    jupiter >= 45,
    "Jupiter supports counselling, philosophy, teaching, and spiritual guidance."
  );
  addReason(
    spiritualReasons,
    mercury >= 35,
    "Mercury supports interpretation, explanation, and advisory delivery."
  );
  addReason(
    spiritualReasons,
    rahu >= 30,
    "Rahu can support technology-enabled or globally accessible spiritual services."
  );

  const manufacturingReasons: string[] = [];
  addReason(
    manufacturingReasons,
    mars >= 50,
    "Mars supports machinery, production, engineering, and execution."
  );
  addReason(
    manufacturingReasons,
    saturn >= 55,
    "Saturn supports industrial discipline, process, labour, and scale."
  );

  const hospitalityReasons: string[] = [];
  addReason(
    hospitalityReasons,
    venus >= 50,
    "Venus supports hospitality, luxury, presentation, and customer experience."
  );
  addReason(
    hospitalityReasons,
    moon >= 45,
    "Moon supports nourishment, public response, and service sensitivity."
  );
  addReason(
    hospitalityReasons,
    mars >= 35,
    "Mars supports kitchen, execution, and operational intensity."
  );

  const speculativeReasons: string[] = [];
  addReason(
    speculativeReasons,
    rahu >= 60,
    "Rahu can support unconventional markets and risk-taking."
  );
  addReason(
    speculativeReasons,
    mercury >= 50,
    "Mercury supports speed, analysis, and trading judgement."
  );
  addReason(
    speculativeReasons,
    mars >= 45,
    "Mars supports decisiveness and risk appetite."
  );

  const conversionPenalty =
    base.layers.conversion.score < 48 ? 12 : 0;

  return [
    makeArchetype({
      key: "knowledge_advisory",
      label: "Knowledge-led advisory and consulting",
      score: mercury * 0.38 + jupiter * 0.42 + saturn * 0.12 + sun * 0.08,
      reasons: knowledgeReasons,
      cautions: [
        "The offer must solve a specific client problem rather than remain broad or abstract.",
      ],
    }),

    makeArchetype({
      key: "technology_platform",
      label: "Technology, AI, software, SaaS, or digital platforms",
      score: mercury * 0.36 + rahu * 0.34 + saturn * 0.2 + jupiter * 0.1,
      reasons: technologyReasons,
      cautions: [
        "Technology should serve a validated use case; avoid building before confirming demand.",
      ],
    }),

    makeArchetype({
      key: "education_training",
      label: "Education, training, research, or digital learning",
      score: jupiter * 0.46 + mercury * 0.4 + saturn * 0.08 + moon * 0.06,
      reasons: educationReasons,
      cautions: [
        "Commercial viability improves when the knowledge is packaged into a clear outcome or curriculum.",
      ],
    }),

    makeArchetype({
      key: "financial_advisory",
      label: "Financial, banking, compliance, or business advisory",
      score: jupiter * 0.36 + mercury * 0.32 + saturn * 0.24 + sun * 0.08,
      reasons: financeReasons,
      cautions: [
        "Regulated services require appropriate licensing, controls, and professional boundaries.",
      ],
    }),

    makeArchetype({
      key: "marketing_branding",
      label: "Marketing, branding, content, or client-experience services",
      score: venus * 0.42 + mercury * 0.34 + moon * 0.16 + rahu * 0.08,
      reasons: brandingReasons,
      cautions: [
        "The service must be tied to measurable business outcomes, not aesthetics alone.",
      ],
    }),

    makeArchetype({
      key: "structured_b2b_services",
      label: "Structured B2B, operational, compliance, or managed services",
      score: saturn * 0.44 + mercury * 0.28 + jupiter * 0.16 + sun * 0.12,
      reasons: b2bReasons,
      cautions: [
        "Documented service standards and dependable delivery are essential.",
      ],
    }),

    makeArchetype({
      key: "digital_commerce",
      label: "Digital commerce, brokerage, marketplace, or distribution",
      score: mercury * 0.36 + rahu * 0.3 + venus * 0.2 + mars * 0.14,
      reasons: commerceReasons,
      cautions: [
        "Prefer low-inventory and lower-leverage models until demand is established.",
      ],
    }),

    makeArchetype({
      key: "research_analytics",
      label: "Research, analytics, intelligence, or specialised information services",
      score: mercury * 0.42 + saturn * 0.25 + jupiter * 0.25 + rahu * 0.08,
      reasons: researchReasons,
      cautions: [
        "The research must be converted into a usable decision product for clients.",
      ],
    }),

    makeArchetype({
      key: "spiritual_guidance",
      label: "Astrology, spiritual guidance, counselling, or wisdom platforms",
      score: jupiter * 0.42 + mercury * 0.28 + rahu * 0.18 + moon * 0.12,
      reasons: spiritualReasons,
      cautions: [
        "Trust, ethics, consistency, and clear boundaries are central to long-term credibility.",
      ],
    }),

    makeArchetype({
      key: "manufacturing_operations",
      label: "Manufacturing, industrial, engineering, or heavy operations",
      score: Math.max(0, mars * 0.44 + saturn * 0.46 + mercury * 0.1 - conversionPenalty),
      reasons: manufacturingReasons,
      cautions: [
        "Capital intensity, labour, infrastructure, and operational risk require strong execution support.",
      ],
    }),

    makeArchetype({
      key: "hospitality_food",
      label: "Hospitality, food, luxury, or customer-experience ventures",
      score: Math.max(0, venus * 0.4 + moon * 0.32 + mars * 0.18 + mercury * 0.1 - conversionPenalty),
      reasons: hospitalityReasons,
      cautions: [
        "Margins, location, staffing, and operational consistency can become major pressure points.",
      ],
    }),

    makeArchetype({
      key: "speculative_trading",
      label: "Highly speculative trading or leveraged ventures",
      score: Math.max(0, rahu * 0.4 + mercury * 0.28 + mars * 0.22 + jupiter * 0.1 - 25),
      reasons: speculativeReasons,
      cautions: [
        "Avoid treating astrological potential as a substitute for risk controls, capital discipline, or market expertise.",
        "Leverage and concentration risk should remain limited.",
      ],
    }),
  ];
}

function roleFromArchetypes(archetypes: BusinessArchetypeFinding[]): string {
  const top = archetypes[0]?.key;

  switch (top) {
    case "knowledge_advisory":
    case "financial_advisory":
    case "spiritual_guidance":
      return "advisor, strategist, and trusted subject-matter guide";

    case "technology_platform":
      return "product owner, platform builder, or domain-led technology founder";

    case "structured_b2b_services":
    case "manufacturing_operations":
      return "operator, systems builder, and execution leader";

    case "marketing_branding":
      return "brand strategist, relationship builder, and commercial storyteller";

    case "digital_commerce":
      return "commercial connector, marketplace builder, or distribution strategist";

    case "research_analytics":
      return "researcher, analyst, and intelligence-led advisor";

    default:
      return "hybrid strategist and operator";
  }
}

export function buildBusinessArchetypes(params: {
  bundle: BundleLike;
  base: BaseReasoningResult;
}): BusinessArchetypeResult {
  const { bundle, base } = params;

  const planetNames = [
    "Mercury",
    "Jupiter",
    "Saturn",
    "Rahu",
    "Venus",
    "Mars",
    "Moon",
    "Sun",
  ];

  const planetSignals = Object.fromEntries(
    planetNames.map((planet) => [
      planet,
      buildPlanetSignal(bundle, planet),
    ])
  ) as Record<string, PlanetSignal>;

  const dominantPlanets = Object.values(planetSignals)
    .sort((first, second) => second.score - first.score)
    .slice(0, 5);

  const allArchetypes = buildArchetypes(bundle, base, planetSignals)
    .sort((first, second) => second.score - first.score);

  const strongestArchetypes = allArchetypes
    .filter((archetype) => archetype.fit === "strong")
    .slice(0, 4);

  const moderateArchetypes = allArchetypes
    .filter((archetype) => archetype.fit === "moderate")
    .slice(0, 5);

  const lowerFitArchetypes = allArchetypes
    .filter((archetype) => archetype.fit === "low")
    .sort((first, second) => first.score - second.score)
    .slice(0, 4);

  const dominantCommercialThemes = uniqueStrings(
    strongestArchetypes.flatMap((archetype) => archetype.reasons)
  ).slice(0, 6);

  const preferredBusinessModels = uniqueStrings([
    strongestArchetypes.some((item) =>
      ["knowledge_advisory", "financial_advisory", "spiritual_guidance"].includes(item.key)
    )
      ? "advisory, consulting, or expert-service model"
      : null,

    strongestArchetypes.some((item) =>
      ["technology_platform", "education_training", "research_analytics"].includes(item.key)
    )
      ? "digital product, subscription, platform, or content-led model"
      : null,

    strongestArchetypes.some((item) =>
      ["structured_b2b_services"].includes(item.key)
    )
      ? "recurring B2B service or managed-service model"
      : null,

    "low fixed-cost validation before scaling",
  ]);

  const preferredOperatingStyle = uniqueStrings([
    dominantPlanets.some((item) => item.planet === "Mercury")
      ? "analysis-led and communication-heavy"
      : null,

    dominantPlanets.some((item) => item.planet === "Jupiter")
      ? "trust-led, advisory, and knowledge-based"
      : null,

    dominantPlanets.some((item) => item.planet === "Saturn")
      ? "structured, process-driven, and long-term"
      : null,

    dominantPlanets.some((item) => item.planet === "Rahu")
      ? "digital-first, unconventional, or internationally scalable"
      : null,

    "evidence-led commercial expansion",
  ]);

  return {
    dominantPlanets,
    dominantCommercialThemes,
    strongestArchetypes,
    moderateArchetypes,
    lowerFitArchetypes,
    preferredBusinessModels,
    preferredOperatingStyle,
    preferredRole: roleFromArchetypes(allArchetypes),
    evidence: uniqueStrings([
      ...dominantPlanets.flatMap((planet) => [
        planet.placement,
        ...planet.roles,
      ]),
      ...strongestArchetypes.flatMap((archetype) => archetype.reasons),
    ]).slice(0, 16),
  };
}
