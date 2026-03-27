import type {
  BaseChartFactors,
  CareerReading,
  ProfessionFacts,
  PlanetId,
} from "@/server/astro/types";

type Input = {
  baseChartFactors?: BaseChartFactors | null;
  professionFacts?: ProfessionFacts | null;
};

export function buildCareerReading(input: Input): CareerReading {
  const base = input.baseChartFactors ?? null;
  const profession = input.professionFacts ?? null;

  const likelyIndustries = uniq([
    ...(profession?.likelyDomains ?? []),
  ]).slice(0, 5);

  const likelyRoles = uniq([
    ...(profession?.likelyRoles ?? []),
  ]).slice(0, 5);
  
  const workStyle = uniq([
    ...(profession?.workStyle ?? []),
  ]).slice(0, 6);

  const strongestSignals: string[] = [];
  const blockers: string[] = [];
  const dissatisfactionPattern: string[] = [];
  const currentPhaseModifier: string[] = [];

  const serviceVsBusiness = profession?.serviceVsBusiness ?? "hybrid";
  const publicVsBackend = profession?.publicVsBackend ?? "hybrid";

  let confidence = Number(profession?.confidence ?? 50);

  const dominantPlanets = base?.strengths?.dominantPlanets ?? [];
  // 🔥 INTERPRETIVE ROLE OVERRIDE (VERY IMPORTANT)
const hasGuidancePattern =
  dominantPlanets.includes("Jupiter") ||
  dominantPlanets.includes("Moon");

const hasAnalyticalPattern =
  dominantPlanets.includes("Mercury") ||
  dominantPlanets.includes("Saturn");

const hasVisibilityPattern =
  base?.planets?.some((p) => p.house === 10);

if (hasGuidancePattern && hasAnalyticalPattern && hasVisibilityPattern) {
  // Add interpretive/advisory professions
  likelyRoles.unshift(
    "advisor",
    "consultant",
    "specialist guide",
    "astrologer"
  );

  strongestSignals.push(
    "Combination of guidance (Jupiter/Moon), analysis (Mercury/Saturn), and visibility (10th house) supports advisory or interpretive professions."
  );

  confidence += 10;
}
  const md = base?.activeTiming?.md ?? null;
  const ad = base?.activeTiming?.ad ?? null;
  const pd = base?.activeTiming?.pd ?? null;

  // Strongest signals
  strongestSignals.push(...(profession?.strongestCareerSignals ?? []));
  strongestSignals.push(...(profession?.supportingDivisionalSignals ?? []));

  if (dominantPlanets.includes("Mercury")) {
    strongestSignals.push("Mercury dominance supports analytical, systems, finance, and information-heavy work.");
  }
  if (dominantPlanets.includes("Saturn")) {
    strongestSignals.push("Saturn dominance supports process, structure, institutional work, and compliance.");
  }
  if (dominantPlanets.includes("Sun")) {
    strongestSignals.push("Sun influence supports authority, visibility, or responsibility-bearing roles.");
  }
  if (dominantPlanets.includes("Rahu")) {
    currentPhaseModifier.push("There is restlessness, ambition, and a push toward experimentation or scale.");
    dissatisfactionPattern.push("May feel underused, impatient, or eager to break routine faster than the structure allows.");
  }
  if (dominantPlanets.includes("Jupiter")) {
    currentPhaseModifier.push("Growth, learning, guidance, or strategic thinking are coloring the current work phase.");
  }
  if (dominantPlanets.includes("Venus")) {
    currentPhaseModifier.push("Current work may demand better relationship handling, polish, or presentation.");
  }

  // Dasha modifiers
  for (const pid of [md, ad, pd].filter(Boolean) as PlanetId[]) {
    if (pid === "Rahu") {
      currentPhaseModifier.push("Rahu adds ambition, disruption, and hunger for something bigger or less conventional.");
      dissatisfactionPattern.push("Can create role dissatisfaction or a temptation to jump before the next step is ready.");
    }
    if (pid === "Saturn") {
      currentPhaseModifier.push("Saturn adds responsibility, pressure, and institutional heaviness.");
    }
    if (pid === "Mercury") {
      currentPhaseModifier.push("Mercury sharpens analysis, communication, and systems work.");
    }
    if (pid === "Jupiter") {
      currentPhaseModifier.push("Jupiter adds growth, learning, broader scope, or strategic perspective.");
    }
    if (pid === "Venus") {
      currentPhaseModifier.push("Venus adds client handling, diplomacy, or polished delivery.");
    }
  }

  // Leadership style
  const leadershipStyle = getLeadershipStyle({
    dominantPlanets,
    publicVsBackend,
    serviceVsBusiness,
  });

  // Core pattern
  const coreCareerPattern = getCoreCareerPattern({
    likelyIndustries,
    likelyRoles,
    dominantPlanets,
    serviceVsBusiness,
    publicVsBackend,
  });

  // Blockers
  blockers.push(...(profession?.obstacles ?? []));
  blockers.push(...(profession?.modifiers ?? []));

  // Confidence tuning
  if (
    dominantPlanets.includes("Mercury") &&
    dominantPlanets.includes("Saturn")
  ) {
    confidence += 8;
  }

  if (
    likelyRoles.some((r) =>
      ["banker", "finance professional", "analyst", "auditor", "compliance officer", "operations professional", "operations manager"].includes(
        r.toLowerCase()
      )
    )
  ) {
    confidence += 6;
  }

  if (serviceVsBusiness === "service") confidence += 3;
  if (publicVsBackend === "backend") confidence += 3;

  confidence = clamp(confidence, 0, 100);

  return {
    coreCareerPattern,
    likelyIndustries: uniq(likelyIndustries).slice(0, 4),
    likelyRoles: uniq(likelyRoles).slice(0, 4),
    workStyle: uniq(workStyle).slice(0, 6),
    serviceVsBusiness,
    publicVsBackend,
    leadershipStyle,
    dissatisfactionPattern: uniq(dissatisfactionPattern).slice(0, 4),
    currentPhaseModifier: uniq(currentPhaseModifier).slice(0, 4),
    strongestSignals: uniq(strongestSignals).slice(0, 6),
    blockers: uniq(blockers).slice(0, 5),
    confidence,
  };
}

/* ---------------- helpers ---------------- */

function getCoreCareerPattern(opts: {
  likelyIndustries: string[];
  likelyRoles: string[];
  dominantPlanets: PlanetId[];
  serviceVsBusiness: "service" | "business" | "hybrid";
  publicVsBackend: "public" | "backend" | "hybrid";
}): string {
  const roles = opts.likelyRoles.map((x) => x.toLowerCase());
  const industries = opts.likelyIndustries.map((x) => x.toLowerCase());

  if (
    roles.some((r) =>
      ["banker", "finance professional", "analyst", "auditor", "compliance officer", "operations professional", "operations manager"].includes(r)
    ) ||
    industries.some((d) =>
      ["banking", "finance", "analytics", "audit", "compliance", "operations"].includes(d)
    )
  ) {
    return "Structured analytical institutional work";
  }

  if (
    industries.some((d) =>
      ["technology", "digital", "media", "scale-driven work"].includes(d)
    )
  ) {
    return "Modern systems-oriented work with a digital or scale-driven edge";
  }

  if (
    industries.some((d) =>
      ["advisory", "strategy", "law", "teaching"].includes(d)
    )
  ) {
    return "Knowledge-driven advisory or strategic work";
  }

  if (
    opts.serviceVsBusiness === "service" &&
    opts.publicVsBackend === "backend"
  ) {
    return "Structured backend service work";
  }

  if (
    opts.serviceVsBusiness === "service" &&
    opts.publicVsBackend === "public"
  ) {
    return "Structured client-facing service work";
  }

  return "Structured professional work with mixed execution modes";
}

function getLeadershipStyle(opts: {
  dominantPlanets: PlanetId[];
  publicVsBackend: "public" | "backend" | "hybrid";
  serviceVsBusiness: "service" | "business" | "hybrid";
}): string {
  const d = opts.dominantPlanets;

  if (d.includes("Sun") || d.includes("Mars")) {
    return "Direct, responsibility-taking, and action-oriented.";
  }

  if (d.includes("Mercury") && d.includes("Saturn")) {
    return "Process-led, analytical, and systems-oriented rather than charismatic.";
  }

  if (d.includes("Jupiter")) {
    return "Advisory, mentoring, and guidance-based.";
  }

  if (opts.publicVsBackend === "backend") {
    return "Quiet, execution-heavy, and stronger through competence than display.";
  }

  if (opts.serviceVsBusiness === "service") {
    return "Reliable, structured, and team/system-oriented.";
  }

  return "Balanced and situational.";
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr.map((x) => String(x).trim()).filter(Boolean)));
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}