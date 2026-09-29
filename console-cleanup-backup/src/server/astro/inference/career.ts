/*
  Sārathi Career Inference Module

  Goal:
  Build deterministic career logic BEFORE GPT writes the answer.

  What this file gives you:
  1. A clear topic rule for career
  2. A scoring pipeline for:
     - natal promise
     - divisional support (D10)
     - karakas
     - dasha activation
     - transit activation
  3. A final inference layer for:
     - job vs business
     - domain inference
     - role style inference
  4. A single final object you can pass into astro-chat / naturalize

  IMPORTANT:
  - This is intentionally self-contained so you can start fast.
  - Later you can split shared helpers into separate files.
*/

export type CareerDomain =
  | "finance_banking"
  | "construction_real_estate"
  | "operations_administration"
  | "consulting_advisory"
  | "technical_it"
  | "government_institutional"
  | "sales_business_development"
  | "trading_commercial"
  | "manufacturing_infrastructure"
  | "general_structured_work";

export type CareerModeHint = "independent" | "employment" | "mixed";

export type CareerRoleStyle =
  | "owner_operator"
  | "manager_operator"
  | "advisor_consultant"
  | "backend_structural"
  | "client_facing"
  | "decision_maker"
  | "technical_executor";

export type ScoreBand = "strong" | "moderate" | "mixed" | "weak" | "unclear";

export type CareerInference = {
  topic: "career";
  workType: CareerDomain;
  roleStyle: CareerRoleStyle;
  modeHint: CareerModeHint;
  confidence: number;
  confidenceBand: ScoreBand;
  promiseScore: number;
  timingScore: number;
  independenceScore: number;
  employmentScore: number;
  domainScores: Record<CareerDomain, number>;
  roleScores: Record<CareerRoleStyle, number>;
  topDomainGap: number;
  topRoleGap: number;
  drivers: string[];
  blockers: string[];
  evidenceBullets: string[];
  summaryLine: string;
};

export type CareerTopicRule = {
  topic: "career";
  houses: number[];
  supportHouses: number[];
  karakas: string[];
  divisionalCharts: string[];
  weights: {
    natal: number;
    divisional: number;
    karaka: number;
    dasha: number;
    transit: number;
  };
};

export const careerTopicRule: CareerTopicRule = {
  topic: "career",
  houses: [10, 6],
  supportHouses: [2, 11],
  karakas: ["Sun", "Saturn", "Mercury", "Jupiter"],
  divisionalCharts: ["D10"],
  weights: {
    natal: 0.30,
    divisional: 0.20,
    karaka: 0.15,
    dasha: 0.20,
    transit: 0.15,
  },
};

/* --------------------------------------------------
   Public entry point
-------------------------------------------------- */

export function inferCareer(report: any): CareerInference {
  const natalEval = scoreCareerNatalPromise(report);
  const divisionalEval = scoreCareerDivisionalSupport(report);
  const karakaEval = scoreCareerKarakas(report);
  const dashaEval = scoreCareerDasha(report);
  const transitEval = scoreCareerTransits(report);

  const planets = getPlanetMap(report);
  const houseLords = getHouseLordMap(report);
  const hasD10 = !!(
    report?.divisionalCharts?.D10 ??
    report?.divisionalCharts?.d10 ??
    report?.vargas?.D10 ??
    report?.vargas?.d10
  );

  const dataCompleteness =
    (Object.keys(planets).length >= 7 ? 1 : 0) +
    (Object.keys(houseLords).length >= 6 ? 1 : 0) +
    (hasD10 ? 1 : 0);
  const lowStructuredData = dataCompleteness <= 1;
  const promiseScore = weightedScore([
    [natalEval.score, careerTopicRule.weights.natal],
    [divisionalEval.score, careerTopicRule.weights.divisional],
    [karakaEval.score, careerTopicRule.weights.karaka],
  ]);

  const timingScore = weightedScore([
    [dashaEval.score, careerTopicRule.weights.dasha],
    [transitEval.score, careerTopicRule.weights.transit],
  ]);

  const modeHintEval = inferCareerModeHint(report, {
    natalEval,
    divisionalEval,
    karakaEval,
    dashaEval,
    transitEval,
  });

  const domainScores = inferCareerDomainScores(report, {
    natalEval,
    divisionalEval,
    karakaEval,
    dashaEval,
    transitEval,
    modeHint: modeHintEval.modeHint,
  });

  const roleScores = inferCareerRoleStyleScores(report, {
    modeHint: modeHintEval.modeHint,
    domainScores,
    natalEval,
    karakaEval,
    dashaEval,
  });
  if (lowStructuredData) {
  // stop overconfident niche classification when structured career data is weak
  domainScores.consulting_advisory = Math.max(0, domainScores.consulting_advisory - 8);
  domainScores.construction_real_estate = Math.max(0, domainScores.construction_real_estate - 4);
  domainScores.finance_banking = Math.max(0, domainScores.finance_banking - 4);
  domainScores.operations_administration = Math.max(0, domainScores.operations_administration - 4);
  domainScores.government_institutional = Math.max(0, domainScores.government_institutional - 4);

  domainScores.general_structured_work += 15;

  roleScores.advisor_consultant = Math.max(0, roleScores.advisor_consultant - 10);
  roleScores.manager_operator = Math.max(0, roleScores.manager_operator - 4);
  roleScores.owner_operator = Math.max(0, roleScores.owner_operator - 4);
}
  if (dataCompleteness <= 1) {
    domainScores.general_structured_work += 10;
  }

    const sortedDomainScores = Object.values(domainScores).sort((a, b) => b - a);
  const topDomainScore = sortedDomainScores[0] ?? 0;
  const secondDomainScore = sortedDomainScores[1] ?? 0;
  const topDomainGap = topDomainScore - secondDomainScore;

  if (topDomainGap < 6) {
    domainScores.general_structured_work += 8;
  }

  const sortedRoleScores = Object.values(roleScores).sort((a, b) => b - a);
  const topRoleScore = sortedRoleScores[0] ?? 0;
  const secondRoleScore = sortedRoleScores[1] ?? 0;
  const topRoleGap = topRoleScore - secondRoleScore;

let workType: CareerDomain = pickHighest<CareerDomain>(
  domainScores,
  "general_structured_work"
);

// banking-style override:
// if finance and operations are very close, and the chart is clearly employment-led,
// prefer finance_banking as the user-facing profession label
if (
  modeHintEval.modeHint === "employment" &&
  (domainScores.finance_banking ?? 0) >= (domainScores.operations_administration ?? 0) - 3 &&
  (domainScores.finance_banking ?? 0) >= 30
) {
  workType = "finance_banking";
}

const roleStyle: CareerRoleStyle = pickHighest<CareerRoleStyle>(
  roleScores,
  modeHintEval.modeHint === "independent"
    ? "owner_operator"
    : modeHintEval.modeHint === "employment"
    ? "manager_operator"
    : "advisor_consultant"
);

let finalModeHint: CareerModeHint = modeHintEval.modeHint;

// Post-classification correction: domain + role style are more trustworthy
if (
  workType === "construction_real_estate" &&
  (roleStyle === "owner_operator" || roleStyle === "technical_executor")
) {
  finalModeHint = "independent";
} else if (
  workType === "consulting_advisory" &&
  roleStyle === "advisor_consultant"
) {
  finalModeHint = "mixed";
} else if (
  workType === "finance_banking" &&
  (roleStyle === "manager_operator" || roleStyle === "backend_structural")
) {
  finalModeHint = "employment";
}
  const drivers = uniq([
    ...natalEval.drivers,
    ...divisionalEval.drivers,
    ...karakaEval.drivers,
    ...dashaEval.drivers,
    ...transitEval.drivers,
    ...modeHintEval.drivers,
    domainDriver(workType),
    roleDriver(roleStyle),
  ])
    .filter(Boolean)
    .slice(0, 10);

  const blockers = uniq([
    ...natalEval.blockers,
    ...divisionalEval.blockers,
    ...karakaEval.blockers,
    ...dashaEval.blockers,
    ...transitEval.blockers,
  ])
    .filter(Boolean)
    .slice(0, 6);

  const completenessPenalty =
    dataCompleteness <= 1 ? 18 : dataCompleteness === 2 ? 8 : 0;

  const confidence = clamp(
    Math.round(
      promiseScore * 0.45 +
        timingScore * 0.15 +
        modeHintEval.confidence * 0.20 +
        highestScore(domainScores) * 0.10 +
        highestScore(roleScores) * 0.10
    ) - completenessPenalty,
    0,
    100
  );

  const evidenceBullets = uniq([
    `Career promise score → ${promiseScore}`,
    `Career timing score → ${timingScore}`,
    `Mode hint → ${finalModeHint} (${modeHintEval.independenceScore}/${modeHintEval.employmentScore})`,
    `Work type inference → ${workType}`,
    `Role style → ${roleStyle}`,
    ...drivers.map((x) => `Career driver → ${x}`),
    ...blockers.map((x) => `Career blocker → ${x}`),
  ]).slice(0, 14);

    console.log("[inferCareer] summary", {
    birth: report?.birth ?? null,
    modeHint: finalModeHint,
    independenceScore: modeHintEval.independenceScore,
    employmentScore: modeHintEval.employmentScore,
    workType,
    domainScores,
    roleScores,
    planetsSeen: Object.keys(planets),
    houseLordKeys: Object.keys(houseLords),
    hasD10,
    dataCompleteness,
    h4Occupants: getPlanetsInHouse(report, 4),
    h6Occupants: getPlanetsInHouse(report, 6),
    h7Occupants: getPlanetsInHouse(report, 7),
    h9Occupants: getPlanetsInHouse(report, 9),
    h10Occupants: getPlanetsInHouse(report, 10),
    h11Occupants: getPlanetsInHouse(report, 11),
    topDomainGap,
    topRoleGap,
  });

    return {
    topic: "career",
    workType,
    roleStyle,
    modeHint: finalModeHint,
    confidence,
    confidenceBand: toBand(confidence),
    promiseScore,
    timingScore,
    independenceScore: modeHintEval.independenceScore,
    employmentScore: modeHintEval.employmentScore,
    domainScores,
    roleScores,
    topDomainGap,
    topRoleGap,
    drivers,
    blockers,
    evidenceBullets,
    summaryLine: buildCareerSummaryLine(workType, roleStyle, finalModeHint, domainScores),
  };
}
/* --------------------------------------------------
   Layer 1: natal promise
-------------------------------------------------- */

type EvalResult = {
  score: number;
  drivers: string[];
  blockers: string[];
};

function scoreCareerNatalPromise(report: any): EvalResult {
  const drivers: string[] = [];
  const blockers: string[] = [];
  let score = 20;


  const houseLords = getHouseLordMap(report);
  const planets = getPlanetMap(report);

  // H10
const h10 = getHouseRow(report, 10);
const h6 = getHouseRow(report, 6);
const h2 = getHouseRow(report, 2);
const h11 = getHouseRow(report, 11);

  if (h10) {
    score += 14;
    drivers.push("10th house career axis is available for evaluation");
    if (hasOccupants(h10)) {
      score += 8;
      drivers.push(`10th house occupied by ${joinOccupants(h10)}`);
    }
  }

  if (h6) {
    score += 8;
    drivers.push("6th house work-routine layer is visible");
  }

  if (h2 || h11) {
    score += 6;
    drivers.push("Income and gains houses connect to career reading");
  }

  // lord strength hints
  const tenthLord = safePlanetName(houseLords?.H10?.lord ?? houseLords?.[10]?.lord ?? houseLords?.H10 ?? houseLords?.[10]);
  const sixthLord = safePlanetName(houseLords?.H6?.lord ?? houseLords?.[6]?.lord ?? houseLords?.H6 ?? houseLords?.[6]);

  if (tenthLord && planets?.[tenthLord]) {
    score += 10;
    drivers.push(`10th lord ${tenthLord} is available for judgment`);
    if (isStrongPlanet(planets[tenthLord])) {
      score += 8;
      drivers.push(`10th lord ${tenthLord} shows workable strength`);
    }
  } else {
    blockers.push("10th lord details are weak or missing");
  }

  if (sixthLord && planets?.[sixthLord]) {
    score += 6;
    drivers.push(`6th lord ${sixthLord} adds work-style context`);
  }

  // key planets visible
  for (const p of ["Sun", "Saturn", "Mercury", "Jupiter"]) {
    if (planets?.[p] || planets?.[p.toLowerCase()]) {
      score += 3;
      drivers.push(`${p} is available in natal profession logic`);
    }
  }

  return {
    score: clamp(score, 0, 100),
    drivers,
    blockers,
  };
}
type CareerFactors = {
  planets: Record<string, any>;
  houses: Record<string, any>;
  houseLords: Record<string, any>;
  d10: any;
  d9: any;
  activeDasha: { md?: string | null; ad?: string | null; pd?: string | null };

  h2Blob: string;
  h6Blob: string;
  h7Blob: string;
  h9Blob: string;
  h10Blob: string;
  h11Blob: string;

  tenthLord: string;
  sixthLord: string;
  seventhLord: string;
  secondLord: string;
  eleventhLord: string;

  hasD10: boolean;
  hasD9: boolean;
  dataCompleteness: number;
};
/* --------------------------------------------------
   Layer 2: D10
-------------------------------------------------- */

function scoreCareerDivisionalSupport(report: any): EvalResult {
  const drivers: string[] = [];
  const blockers: string[] = [];
  let score = 18;

  const d10 =
    report?.divisionalCharts?.D10 ??
    report?.divisionalCharts?.d10 ??
    report?.vargas?.D10 ??
    report?.vargas?.d10 ??
    null;

  if (!d10) {
    blockers.push("D10 is missing or weakly populated");
    return { score: 12, drivers, blockers };
  }

  score += 18;
  drivers.push("D10 is available for profession validation");

  if (safeStr(d10?.summary)) {
    score += 8;
    drivers.push("D10 includes a usable summary layer");
  }

  const strongPlanets = arrayOfStrings(d10?.strongPlanets);
  if (strongPlanets.length) {
    score += 8;
    drivers.push(`D10 strong planets: ${strongPlanets.slice(0, 3).join(", ")}`);
  }

  const activatedHouses = arrayOfNumbers(d10?.activatedHouses);
  if (activatedHouses.includes(10) || activatedHouses.includes(6)) {
    score += 8;
    drivers.push("D10 activates core career houses");
  }

  return {
    score: clamp(score, 0, 100),
    drivers,
    blockers,
  };
}

/* --------------------------------------------------
   Layer 3: karakas
-------------------------------------------------- */

function scoreCareerKarakas(report: any): EvalResult {
  const drivers: string[] = [];
  const blockers: string[] = [];
  let score = 18;

  const planets = getPlanetMap(report);

  for (const name of ["Sun", "Saturn", "Mercury", "Jupiter"]) {
    const row = planets?.[name] ?? planets?.[name.toLowerCase()] ?? null;
    if (!row) {
      blockers.push(`${name} is weakly represented in payload`);
      continue;
    }
    score += 6;
    drivers.push(`${name} contributes to profession reading`);

    if (isStrongPlanet(row)) {
      score += 4;
      drivers.push(`${name} shows workable dignity/strength`);
    }
  }

  return {
    score: clamp(score, 0, 100),
    drivers,
    blockers,
  };
}

/* --------------------------------------------------
   Layer 4: dasha
-------------------------------------------------- */

function scoreCareerDasha(report: any): EvalResult {
  const drivers: string[] = [];
  const blockers: string[] = [];
  let score = 16;

  const { md, ad, pd } = getActiveDashaAnyShape(report);
  const active = [md, ad, pd].filter(Boolean) as string[];

  if (!active.length) {
    blockers.push("Active dasha stack is weak or missing");
    return { score: 10, drivers, blockers };
  }

  score += 14;
  drivers.push(`Active dasha stack: ${active.join(" • ")}`);

  const houseLords = getHouseLordMap(report);
  const careerLords = uniq(
    [10, 6, 2, 11]
      .map((h) => safePlanetName(houseLords?.[`H${h}`]?.lord ?? houseLords?.[h]?.lord ?? houseLords?.[`H${h}`] ?? houseLords?.[h]))
      .filter(Boolean)
  );

  const hits = active.filter((x) => careerLords.includes(x));
  if (hits.length) {
    score += 18;
    drivers.push(`Dasha activates career lords: ${uniq(hits).join(", ")}`);
  }

  return {
    score: clamp(score, 0, 100),
    drivers,
    blockers,
  };
}

/* --------------------------------------------------
   Layer 5: transits
-------------------------------------------------- */

function scoreCareerTransits(report: any): EvalResult {
  const drivers: string[] = [];
  const blockers: string[] = [];
  let score = 12;

  const transits = [
    ...(Array.isArray(report?.topTransits) ? report.topTransits : []),
    ...(Array.isArray(report?.transitWindows) ? report.transitWindows : []),
  ];

  const careerHits = transits.filter((tr: any) => {
    const blob = `${safeStr(tr?.title || tr?.driver)} ${safeStr(tr?.description || tr?.summary)} ${safeStr(tr?.category || tr?.focusArea)}`.toLowerCase();
    return /career|work|profession|job|visibility|responsibilit|direction|h10|h6|income|gains/.test(blob);
  });

  if (!careerHits.length) {
    blockers.push("No clearly tagged career transit windows found");
    return { score, drivers, blockers };
  }

  score += 18;
  drivers.push(`Career transits available: ${careerHits.length}`);

  for (const tr of careerHits.slice(0, 2)) {
    const title = safeStr(tr?.title || tr?.driver || tr?.target || tr?.planet || "Relevant transit");
    const start = tr?.startISO ?? tr?.from;
    const end = tr?.endISO ?? tr?.to;
    drivers.push(`${title}${start || end ? ` (${fmtDate(start)} – ${fmtDate(end)})` : ""}`);
  }

  return {
    score: clamp(score, 0, 100),
    drivers,
    blockers,
  };
}

/* --------------------------------------------------
   Inference: job vs business
-------------------------------------------------- */

function inferCareerModeHint(
  report: any,
  ctx: {
    natalEval: EvalResult;
    divisionalEval: EvalResult;
    karakaEval: EvalResult;
    dashaEval: EvalResult;
    transitEval: EvalResult;
  }
): {
  modeHint: CareerModeHint;
  independenceScore: number;
  employmentScore: number;
  confidence: number;
  drivers: string[];
} {
  const drivers: string[] = [];

  let independenceScore = 14;
  let employmentScore = 18;

  const planets = getPlanetMap(report);
  const houseLords = getHouseLordMap(report);
  const houses = report?.houses ?? report?.natal?.houses ?? {};

  const mars = planets?.Mars ?? planets?.mars ?? null;
  const saturn = planets?.Saturn ?? planets?.saturn ?? null;
  const rahu = planets?.Rahu ?? planets?.rahu ?? null;
  const mercury = planets?.Mercury ?? planets?.mercury ?? null;
  const sun = planets?.Sun ?? planets?.sun ?? null;
  const jupiter = planets?.Jupiter ?? planets?.jupiter ?? null;

  const h7Blob = JSON.stringify(
  getHouseRow(report, 7) ?? {}
).toLowerCase();

const h10Blob = JSON.stringify(
  getHouseRow(report, 10) ?? {}
).toLowerCase();

const h11Blob = JSON.stringify(
  getHouseRow(report, 11) ?? {}
).toLowerCase();

const h6Blob = JSON.stringify(
  getHouseRow(report, 6) ?? {}
).toLowerCase();

  const active = Object.values(getActiveDashaAnyShape(report)).filter(
    (x) => typeof x === "string" && x
  ) as string[];

  const independentLords = uniq(
    [1, 7, 10, 2, 11]
      .map((h) =>
        safePlanetName(
          houseLords?.[`H${h}`]?.lord ??
            houseLords?.[h]?.lord ??
            houseLords?.[`H${h}`] ??
            houseLords?.[h]
        )
      )
      .filter(Boolean)
  );

  const employmentLords = uniq(
    [6, 10, 2, 11]
      .map((h) =>
        safePlanetName(
          houseLords?.[`H${h}`]?.lord ??
            houseLords?.[h]?.lord ??
            houseLords?.[`H${h}`] ??
            houseLords?.[h]
        )
      )
      .filter(Boolean)
  );

  const activeIndependentHits = active.filter((x) => independentLords.includes(x));
  const activeEmploymentHits = active.filter((x) => employmentLords.includes(x));

  if (/mars|saturn|rahu|sun/.test(h7Blob)) {
    independenceScore += 10;
    drivers.push("7th house supports independent or business-led work");
  }

  if (/mars|saturn|rahu/.test(h10Blob) && /mars|saturn|rahu|sun/.test(h7Blob)) {
    independenceScore += 8;
    drivers.push("Career and independent-work houses connect strongly");
  }

  if (/saturn|mercury|sun/.test(h6Blob)) {
    employmentScore += 6;
    drivers.push("6th house supports structured employment or service work");
  }

  if (activeIndependentHits.length >= 2) {
    independenceScore += 10;
    drivers.push(`Independent-work dasha activation through ${uniq(activeIndependentHits).join(", ")}`);
  } else if (activeIndependentHits.length === 1) {
    independenceScore += 5;
    drivers.push(`Partial independent-work dasha activation through ${uniq(activeIndependentHits).join(", ")}`);
  }

  if (activeEmploymentHits.length >= 2) {
    employmentScore += 10;
    drivers.push(`Employment-linked dasha activation through ${uniq(activeEmploymentHits).join(", ")}`);
  } else if (activeEmploymentHits.length === 1) {
    employmentScore += 5;
    drivers.push(`Partial employment-linked dasha activation through ${uniq(activeEmploymentHits).join(", ")}`);
  }

  if (mars && saturn) {
    const strength = getCombinedStrength(mars, saturn);
    if (strength > 0.6 && (/mars|saturn/.test(h10Blob) || /mars|saturn/.test(h7Blob))) {
      independenceScore += 8;
      drivers.push("Mars + Saturn support independent, project-led, or asset-led work");
    }
  }

  if (rahu && (/rahu|mars|saturn/.test(h7Blob) || /rahu|mars|saturn/.test(h11Blob))) {
    independenceScore += 5;
    drivers.push("Rahu supports scale, independence, or commercial appetite");
  }

  if (mercury && saturn) {
    employmentScore += 7;
    drivers.push("Mercury + Saturn support structured professional work");
  }

  if (sun && saturn) {
    employmentScore += 5;
    drivers.push("Sun + Saturn support responsibility inside formal systems");
  }

  if (jupiter && mercury) {
    independenceScore += 3;
    employmentScore += 3;
    drivers.push("Jupiter + Mercury support advisory, teaching, or consulting intelligence");
  }

  if (
  ctx.natalEval.score >= 50 &&
  ctx.divisionalEval.score >= 35 &&
  ctx.karakaEval.score >= 40
) {
  employmentScore += 3;
  drivers.push("Chart supports stable professional structure");
}

  const h10Occupants = getPlanetsInHouse(report, 10);
const h7Occupants = getPlanetsInHouse(report, 7);

// Strong direct career-execution signal should push toward independence
if (h10Occupants.includes("Mars")) {
  independenceScore += 10;
  drivers.push("Mars in the 10th supports self-driven, project-led work");
}

// If 7th has business-linked planets, add more independence
if (
  h7Occupants.includes("Mars") ||
  h7Occupants.includes("Mercury") ||
  h7Occupants.includes("Rahu") ||
  h7Occupants.includes("Sun")
) {
  independenceScore += 6;
  drivers.push("7th house supports independent or business-led work");
}

independenceScore = clamp(independenceScore, 0, 100);
employmentScore = clamp(employmentScore, 0, 100);

const gap = independenceScore - employmentScore;

console.log("[inferCareerModeHint] gap check", {
  independenceScore,
  employmentScore,
  gap,
});

let modeHint: CareerModeHint = "mixed";

if (gap >= 6) {
  modeHint = "independent";
} else if (gap <= -12) {
  modeHint = "employment";
} else {
  modeHint = "mixed";
}

console.log("[inferCareerModeHint] final modeHint", { modeHint });

return {
  modeHint,
  independenceScore,
  employmentScore,
  confidence: clamp(Math.abs(gap) + 55, 0, 100),
  drivers,
};
}
/* --------------------------------------------------
   Inference: domain
-------------------------------------------------- */

function inferCareerDomainScores(
  report: any,
  ctx: {
    natalEval: EvalResult;
    divisionalEval: EvalResult;
    karakaEval: EvalResult;
    dashaEval: EvalResult;
    transitEval: EvalResult;
    modeHint: CareerModeHint;
  }
): Record<CareerDomain, number> {
  const f = collectCareerFactors(report);

  const mars = f.planets?.Mars ?? null;
  const saturn = f.planets?.Saturn ?? null;
  const mercury = f.planets?.Mercury ?? null;
  const jupiter = f.planets?.Jupiter ?? null;
  const sun = f.planets?.Sun ?? null;
  const venus = f.planets?.Venus ?? null;
  const rahu = f.planets?.Rahu ?? null;
  const h2Occupants = getPlanetsInHouse(report, 2);
const h4Occupants = getPlanetsInHouse(report, 4);
const h6Occupants = getPlanetsInHouse(report, 6);
const h7Occupants = getPlanetsInHouse(report, 7);
const h9Occupants = getPlanetsInHouse(report, 9);
const h10Occupants = getPlanetsInHouse(report, 10);
const h11Occupants = getPlanetsInHouse(report, 11);  
  const scores: Record<CareerDomain, number> = {
    finance_banking: 4,
    construction_real_estate: 4,
    operations_administration: 4,
    consulting_advisory: 4,
    technical_it: 4,
    government_institutional: 4,
    sales_business_development: 3,
    trading_commercial: 3,
    manufacturing_infrastructure: 3,
    general_structured_work: 2,
  };

  // 1) 10th house + 10th lord
  if (f.tenthLord === "Jupiter" || f.tenthLord === "Mercury") {
  scores.consulting_advisory += 6;
  scores.finance_banking += 3;
}

    if (/mars|saturn|venus/.test(f.h10Blob) || f.tenthLord === "Mars" || f.tenthLord === "Saturn" || f.tenthLord === "Venus") {
    scores.construction_real_estate += 6;
    scores.manufacturing_infrastructure += 6;
  }

  if (/mercury|saturn/.test(f.h10Blob) || f.tenthLord === "Mercury" || f.tenthLord === "Saturn") {
    scores.operations_administration += 6;
    scores.technical_it += 6;
  }

  if (/sun|saturn/.test(f.h10Blob) || f.tenthLord === "Sun" || f.tenthLord === "Saturn") {
    scores.government_institutional += 7;
  }

  // 2) 7th + 9th for advisory / consulting / practice
    if (/jupiter|mercury/.test(f.h7Blob) || /jupiter|mercury/.test(f.h9Blob)) {
    scores.consulting_advisory += 10;
    scores.finance_banking += 2;
  }

  if (f.seventhLord === "Jupiter" || f.seventhLord === "Mercury") {
  scores.consulting_advisory += 4;
}

  // 3) money houses: 2 and 11
  if (/jupiter|mercury|venus/.test(f.h2Blob) || /jupiter|mercury|venus/.test(f.h11Blob)) {
    scores.finance_banking += 8;
    scores.consulting_advisory += 6;
    scores.trading_commercial += 4;
  }

  if (/mars|venus/.test(f.h2Blob) || /mars|venus/.test(f.h11Blob)) {
    scores.construction_real_estate += 6;
    scores.sales_business_development += 5;
  }

  // 4) career karakas
  if (jupiter) scores.consulting_advisory += 4;
  if (mercury) scores.consulting_advisory += 2;
if (jupiter && mercury) {
    scores.consulting_advisory += 4;
    scores.finance_banking += 2;
    scores.operations_administration += 1;
  }

    if (mercury && saturn) {
    scores.operations_administration += 6;
    scores.technical_it += 4;
    scores.finance_banking += 5;
  }

  const constructionContext =
    /mars|saturn|venus/.test(f.h10Blob) ||
    /mars|saturn|venus/.test(f.h2Blob) ||
    /mars|saturn|venus/.test(f.h11Blob);

  if (mars && saturn && constructionContext) {
    const strength = getCombinedStrength(mars, saturn);
    if (strength > 0.6) {
      scores.construction_real_estate += 16;
      scores.manufacturing_infrastructure += 10;
    } else if (strength > 0.4) {
      scores.construction_real_estate += 8;
      scores.manufacturing_infrastructure += 5;
    }
  }

  if (mars && rahu && constructionContext) {
    scores.trading_commercial += 6;
    scores.construction_real_estate += 5;
  }

  if (sun && saturn) {
  scores.government_institutional += 4;
  scores.operations_administration += 3;
}

  // 5) D10 validation
  if (f.hasD10) {
    const d10Blob = JSON.stringify(f.d10 || {}).toLowerCase();

       if (/jupiter|mercury/.test(d10Blob)) {
      scores.consulting_advisory += 6;
      scores.finance_banking += 5;
      scores.operations_administration += 2;
    }

    if (/mars|saturn|venus/.test(d10Blob)) {
      scores.construction_real_estate += 8;
      scores.manufacturing_infrastructure += 6;
    }

    if (/mercury|saturn/.test(d10Blob)) {
      scores.operations_administration += 4;
      scores.technical_it += 4;
    }
  }

  // 6) D9 support
  if (f.hasD9) {
    const d9Blob = JSON.stringify(f.d9 || {}).toLowerCase();

    if (/jupiter|mercury/.test(d9Blob)) {
      scores.consulting_advisory += 6;
    }

    if (/mars|saturn|venus/.test(d9Blob)) {
      scores.construction_real_estate += 4;
    }
  }
// --- house occupant scoring: much more reliable than empty house blobs ---

if (h10Occupants.includes("Jupiter") || h10Occupants.includes("Mercury")) {
  scores.consulting_advisory += 12;
  scores.finance_banking += 4;
}

if (h7Occupants.includes("Jupiter") || h7Occupants.includes("Mercury")) {
  scores.consulting_advisory += 6;
  scores.finance_banking += 2;
}

if (h9Occupants.includes("Jupiter") || h9Occupants.includes("Mercury")) {
  scores.consulting_advisory += 6;
  scores.finance_banking += 2;
}

if (h10Occupants.includes("Mars")) {
  scores.construction_real_estate += 14;
  scores.manufacturing_infrastructure += 8;
}

if (h10Occupants.includes("Saturn")) {
  scores.construction_real_estate += 6;
  scores.manufacturing_infrastructure += 6;
}

if (h4Occupants.includes("Mars") || h4Occupants.includes("Saturn") || h4Occupants.includes("Venus")) {
  scores.construction_real_estate += 6;
}
if (h9Occupants.includes("Rahu") && !h9Occupants.includes("Jupiter") && !h9Occupants.includes("Mercury")) {
  scores.consulting_advisory -= 4;
  scores.trading_commercial += 3;
}
if (h2Occupants.includes("Mercury") || h11Occupants.includes("Mercury") || h11Occupants.includes("Jupiter")) {
  scores.finance_banking += 8;
  scores.consulting_advisory += 4;
}

if (h6Occupants.includes("Saturn") || h6Occupants.includes("Mercury") || h6Occupants.includes("Sun")) {
  scores.operations_administration += 10;
  scores.government_institutional += 4;
  scores.finance_banking += 3;
}

  // 7) mode hint only as support
  if (ctx.modeHint === "independent") {
    scores.consulting_advisory += 5;
    scores.trading_commercial += 5;
    if (constructionContext) scores.construction_real_estate += 4;
  } else if (ctx.modeHint === "employment") {
    scores.finance_banking += 8;
    scores.operations_administration += 8;
    scores.government_institutional += 4;
    scores.general_structured_work += 3;
  } else {
    scores.consulting_advisory += 3;
    scores.general_structured_work += 3;
  }

    // 8) structured finance / admin stabilizer
  const structuredServiceSignal =
    (f.tenthLord === "Mercury" || f.tenthLord === "Saturn" || f.tenthLord === "Jupiter") &&
    (h6Occupants.includes("Saturn") || h6Occupants.includes("Mercury") || h10Occupants.includes("Mercury"));

  if (structuredServiceSignal) {
    scores.finance_banking += 6;
    scores.operations_administration += 6;
    scores.general_structured_work += 4;
  }

  // 9) reduce fake specificity when data is thin
  scores.general_structured_work += Math.round(
    (ctx.natalEval.score + ctx.divisionalEval.score) / 40
  );

  for (const key of Object.keys(scores) as CareerDomain[]) {
    scores[key] = Math.max(0, scores[key]);
  }

   if (scores.construction_real_estate > 22 && f.dataCompleteness <= 1) {
    scores.construction_real_estate -= 8;
  }

  if (!f.hasD10 && h10Occupants.length === 0) {
    scores.construction_real_estate -= 10;
    scores.manufacturing_infrastructure -= 4;
  }

  if (!f.hasD10 && h10Occupants.length === 0 && ctx.modeHint === "employment") {
    scores.finance_banking += 6;
    scores.operations_administration += 6;
    scores.general_structured_work += 4;
  }
  // prefer asset/project work when Mars is actually in the 10th
if (h10Occupants.includes("Mars")) {
  scores.construction_real_estate += 4;
}

// if government and construction are very close, prefer construction when Mars is in H10
if (
  h10Occupants.includes("Mars") &&
  scores.government_institutional - scores.construction_real_estate <= 3
) {
  scores.construction_real_estate += 4;
}
  if (ctx.modeHint === "employment" && !f.hasD10 && h10Occupants.length === 0) {
    scores.finance_banking += 4;
    scores.operations_administration += 4;
    scores.construction_real_estate -= 6;
  }
   const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top = sorted[0];
  const second = sorted[1];

  if (top && second && top[1] - second[1] < 4) {
    scores.general_structured_work += 8;
  }

    // if consulting is only slightly ahead of finance/ops, pull back from over-specific advisory labeling
  const consultingScore = scores.consulting_advisory ?? 0;
  const financeOpsScore = Math.max(scores.finance_banking ?? 0, scores.operations_administration ?? 0);

  if (consultingScore > 0 && consultingScore - financeOpsScore <= 4) {
    scores.finance_banking += 3;
    scores.operations_administration += 3;
    scores.general_structured_work += 4;
  }

  // if construction is only slightly ahead of finance/ops on thin data, pull it back
  const constructionScore = scores.construction_real_estate ?? 0;
  if (!f.hasD10 && constructionScore - financeOpsScore <= 6) {
    scores.finance_banking += 4;
    scores.operations_administration += 4;
    scores.construction_real_estate -= 5;
    scores.general_structured_work += 3;
  }

  return clampScoreMap(scores);
}

/* --------------------------------------------------
   Inference: role style
-------------------------------------------------- */

function inferCareerRoleStyleScores(
  report: any,
  ctx: {
    modeHint: CareerModeHint;
    domainScores: Record<CareerDomain, number>;
    natalEval: EvalResult;
    karakaEval: EvalResult;
    dashaEval: EvalResult;
  }
): Record<CareerRoleStyle, number> {
  const scores: Record<CareerRoleStyle, number> = {
    owner_operator: 20,
    manager_operator: 20,
    advisor_consultant: 18,
    backend_structural: 18,
    client_facing: 16,
    decision_maker: 18,
    technical_executor: 18,
  };

  const planets = getPlanetMap(report);
  const mercury = planets?.Mercury ?? planets?.mercury ?? null;
  const saturn = planets?.Saturn ?? planets?.saturn ?? null;
  const sun = planets?.Sun ?? planets?.sun ?? null;
  const jupiter = planets?.Jupiter ?? planets?.jupiter ?? null;
  const mars = planets?.Mars ?? planets?.mars ?? null;
  const houses = report?.houses ?? report?.natal?.houses ?? {};
const h7Blob = JSON.stringify(
  getHouseRow(report, 7) ?? {}
).toLowerCase();

const h9Blob = JSON.stringify(
  getHouseRow(report, 9) ?? {}
).toLowerCase();

const h10Blob = JSON.stringify(
  getHouseRow(report, 10) ?? {}
).toLowerCase();

if (jupiter && mercury) {
  scores.advisor_consultant += 5;
  scores.manager_operator += 2;
  scores.backend_structural += 1;
}
const h10Occupants = getPlanetsInHouse(report, 10);
const h4Occupants = getPlanetsInHouse(report, 4);

if (h10Occupants.includes("Mars")) {
  scores.owner_operator += 6;
  scores.technical_executor += 4;
  scores.advisor_consultant -= 4;
}

if (h4Occupants.includes("Mars") || h4Occupants.includes("Saturn")) {
  scores.owner_operator += 6;
  scores.manager_operator += 4;
}

if (h10Occupants.includes("Mars")) {
  scores.owner_operator += 4;
  scores.manager_operator -= 2;
}
if (
  /jupiter|mercury/.test(h7Blob) ||
  /jupiter|mercury/.test(h9Blob) ||
  /jupiter|mercury/.test(h10Blob)
) {
  scores.advisor_consultant += 8;
  scores.manager_operator += 2;
}

  if (ctx.modeHint === "independent") {
    scores.owner_operator += 16;
    scores.decision_maker += 10;
  } else if (ctx.modeHint === "employment") {
    scores.manager_operator += 12;
    scores.backend_structural += 10;
  }
else {
  scores.advisor_consultant += 4;
  scores.manager_operator += 4;
}
  if (mercury && saturn) {
    scores.backend_structural += 4;
    scores.manager_operator += 4;
  }

  if (sun && jupiter) {
    scores.advisor_consultant += 12;
    scores.decision_maker += 8;
  }

  if (mars) {
    scores.technical_executor += 8;
    scores.owner_operator += 6;
  }

  if (highestKey(ctx.domainScores) === "construction_real_estate") {
    scores.owner_operator += 10;
    scores.manager_operator += 8;
    scores.technical_executor += 8;
  }

  if (highestKey(ctx.domainScores) === "finance_banking") {
    scores.manager_operator += 8;
    scores.decision_maker += 6;
    scores.backend_structural += 6;
  }

    if (highestKey(ctx.domainScores) === "consulting_advisory") {
    scores.advisor_consultant += 8;
    scores.client_facing += 5;
  }

  return clampScoreMap(scores);
}

/* --------------------------------------------------
   Human summary
-------------------------------------------------- */

function buildCareerSummaryLine(
  workType: CareerDomain,
  roleStyle: CareerRoleStyle,
  modeHint: CareerModeHint,
  domainScores?: Record<CareerDomain, number>
): string {
  let workText = careerDomainLabel(workType);
  const roleText = careerRoleLabel(roleStyle);

  const financeScore = Number(domainScores?.finance_banking ?? 0);
  const opsScore = Number(domainScores?.operations_administration ?? 0);

  if (
    modeHint === "employment" &&
    financeScore >= 30 &&
    opsScore >= 30 &&
    Math.abs(financeScore - opsScore) <= 4
  ) {
    workText = "banking, finance, or financial operations";
  }

  const modeText =
    modeHint === "independent"
      ? "The pattern looks more self-directed than institution-led."
      : modeHint === "employment"
      ? "The pattern looks more institution-led than fully independent."
      : "The pattern looks professionally mixed.";

  return `The strongest career pattern points to ${workText}, with a ${roleText} style. ${modeText}`;
}

function careerDomainLabel(domain: CareerDomain): string {
  switch (domain) {
    case "finance_banking":
      return "finance or banking";
    case "construction_real_estate":
      return "construction, building, or real estate";
    case "operations_administration":
      return "operations or administration";
    case "consulting_advisory":
      return "consulting or advisory work";
    case "technical_it":
      return "technical or IT work";
    case "government_institutional":
      return "government or institutional work";
    case "sales_business_development":
      return "sales or business development";
    case "trading_commercial":
      return "trading or commercial business";
    case "manufacturing_infrastructure":
      return "manufacturing or infrastructure";
    default:
      return "structured professional work";
  }
}

function careerRoleLabel(role: CareerRoleStyle): string {
  switch (role) {
    case "owner_operator":
      return "owner-operator";
    case "manager_operator":
      return "manager/operator";
    case "advisor_consultant":
      return "advisor/consultant";
    case "backend_structural":
      return "backend/structural";
    case "client_facing":
      return "client-facing";
    case "decision_maker":
      return "decision-making";
    case "technical_executor":
      return "technical/execution-heavy";
    default:
      return "structured";
  }
}

function domainDriver(domain: CareerDomain): string {
  return `Domain leans toward ${careerDomainLabel(domain)}`;
}

function roleDriver(role: CareerRoleStyle): string {
  return `Role style leans toward ${careerRoleLabel(role)}`;
}

/* --------------------------------------------------
   Utilities
-------------------------------------------------- */
function getHouseRow(report: any, houseNum: number): any {
  const houses =
    report?.houses ??
    report?.natal?.houses ??
    {};

  // Array shape: index 0 = house 1
  if (Array.isArray(houses)) {
    return (
      houses.find(
        (row: any) =>
          Number(row?.house) === Number(houseNum)
      ) ??
      houses[houseNum - 1] ??
      null
    );
  }

  // Object shapes: H10, "10", 10, etc.
  return (
    houses?.[`H${houseNum}`] ??
    houses?.[String(houseNum)] ??
    houses?.[houseNum] ??
    Object.values(houses).find(
      (row: any) =>
        Number(row?.house) === Number(houseNum)
    ) ??
    null
  );
}
function getPlanetsInHouse(report: any, houseNum: number): string[] {
  const planets = Object.values(getPlanetMap(report) ?? {});
  return planets
    .filter((p: any) => Number(p?.house) === Number(houseNum))
    .map((p: any) => safePlanetName(p?.name ?? p?.planet ?? p?.graha ?? ""))
    .filter(Boolean);
}
function getHouseLordMap(
  report: any
): Record<string, any> {
  const raw =
    report?.houseLords ??
    report?.natal?.houseLords ??
    null;

  if (raw && Object.keys(raw).length) {
    return raw;
  }

  const out: Record<string, any> = {};

  for (let houseNum = 1; houseNum <= 12; houseNum++) {
    const row = getHouseRow(report, houseNum);

    if (!row) continue;

    if (row?.lord) {
      out[`H${houseNum}`] = {
        lord: row.lord,
      };
    }
  }

  return out;
}
function getPlanetMap(report: any): Record<string, any> {
  const raw = report?.natal?.planets ?? report?.planets ?? null;
  if (!raw) return {};

  // already keyed object
  if (!Array.isArray(raw)) {
    return raw;
  }

  const out: Record<string, any> = {};
  const fallbackOrder = [
    "Sun",
    "Moon",
    "Mars",
    "Mercury",
    "Jupiter",
    "Venus",
    "Saturn",
    "Rahu",
    "Ketu",
    "Uranus",
    "Neptune",
    "Pluto",
  ];

  raw.forEach((row: any, idx: number) => {
    const explicitName =
      safeStr(row?.name) ||
      safeStr(row?.planet) ||
      safeStr(row?.graha) ||
      safeStr(row?.label);

    const name = explicitName || fallbackOrder[idx] || `Planet${idx}`;
    out[name] = row;
  });

  return out;
}
function getActiveDashaAnyShape(report: any): { md?: string | null; ad?: string | null; pd?: string | null } {
  const ap = report?.activePeriods ?? {};
  return {
    md: ap?.mahadasha?.lord ?? report?.activeDasha?.md ?? null,
    ad: ap?.antardasha?.subLord ?? report?.activeDasha?.ad ?? null,
    pd: ap?.pratyantardasha?.lord ?? report?.activeDasha?.pd ?? null,
  };
}

function weightedScore(parts: Array<[number, number]>): number {
  const totalWeight = parts.reduce((a, [, w]) => a + w, 0);
  if (!totalWeight) return 0;
  const total = parts.reduce((a, [score, weight]) => a + score * weight, 0);
  return Math.round(total / totalWeight);
}

function safePlanetName(x: any): string {
  const s = safeStr(x);
  if (!s) return "";
  const map: Record<string, string> = {
    sun: "Sun",
    moon: "Moon",
    mercury: "Mercury",
    venus: "Venus",
    mars: "Mars",
    jupiter: "Jupiter",
    saturn: "Saturn",
    rahu: "Rahu",
    ketu: "Ketu",
  };
  return map[s.toLowerCase()] ?? s;
}

function safeStr(x: any): string {
  return typeof x === "string" ? x.trim() : "";
}

function arrayOfStrings(x: any): string[] {
  return Array.isArray(x) ? x.map((v) => safeStr(v)).filter(Boolean) : [];
}

function arrayOfNumbers(x: any): number[] {
  return Array.isArray(x) ? x.map((v) => Number(v)).filter((n) => Number.isFinite(n)) : [];
}

function hasOccupants(h: any): boolean {
  return Array.isArray(h?.occupants) ? h.occupants.length > 0 : !!safeStr(h?.occupants);
}

function joinOccupants(h: any): string {
  return Array.isArray(h?.occupants) ? h.occupants.join(", ") : safeStr(h?.occupants);
}

function isStrongPlanet(row: any): boolean {
  const dignity = safeStr(row?.dignity).toLowerCase();
  return /own|exalt|mool|strong|friendly/.test(dignity);
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
function getCombinedStrength(p1: any, p2: any): number {
  return (planetStrength(p1) + planetStrength(p2)) / 2;
}

function planetStrength(p: any): number {
  const dignity = (p?.dignity || "").toLowerCase();

  if (/exalt|own|mool/.test(dignity)) return 0.9;
  if (/friendly/.test(dignity)) return 0.7;
  if (/neutral/.test(dignity)) return 0.5;
  if (/enemy/.test(dignity)) return 0.3;

  return 0.4;
}
function toBand(score: number): ScoreBand {
  if (score >= 75) return "strong";
  if (score >= 58) return "moderate";
  if (score >= 42) return "mixed";
  if (score >= 25) return "weak";
  return "unclear";
}

function highestKey<T extends string>(obj: Record<T, number>): T {
  let bestKey = Object.keys(obj)[0] as T;
  let bestVal = obj[bestKey];
  for (const key of Object.keys(obj) as T[]) {
    if (obj[key] > bestVal) {
      bestVal = obj[key];
      bestKey = key;
    }
  }
  return bestKey;
}

function highestScore<T extends string>(obj: Record<T, number>): number {
  return obj[highestKey(obj)] ?? 0;
}

function pickHighest<T extends string>(obj: Record<T, number>, fallback: T): T {
  if (!obj || !Object.keys(obj).length) return fallback;
  return highestKey(obj);
}

function clampScoreMap<T extends string>(obj: Record<T, number>): Record<T, number> {
  const out = {} as Record<T, number>;
  for (const key of Object.keys(obj) as T[]) {
    out[key] = clamp(Math.round(obj[key]), 0, 100);
  }
  return out;
}

function fmtDate(x: any): string {
  if (!x) return "—";
  const d = new Date(x);
  if (Number.isNaN(+d)) return String(x);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function collectCareerFactors(report: any): CareerFactors {
  const planets = getPlanetMap(report);
  const houses = report?.houses ?? report?.natal?.houses ?? {};
  const houseLords = getHouseLordMap(report);

  const d10 =
    report?.divisionalCharts?.D10 ??
    report?.divisionalCharts?.d10 ??
    report?.vargas?.D10 ??
    report?.vargas?.d10 ??
    null;

  const d9 =
    report?.divisionalCharts?.D9 ??
    report?.divisionalCharts?.d9 ??
    report?.vargas?.D9 ??
    report?.vargas?.d9 ??
    null;

  const h2Obj = getHouseRow(report, 2);
const h6Obj = getHouseRow(report, 6);
const h7Obj = getHouseRow(report, 7);
const h9Obj = getHouseRow(report, 9);
const h10Obj = getHouseRow(report, 10);
const h11Obj = getHouseRow(report, 11);

  const h2Blob = JSON.stringify(h2Obj || {}).toLowerCase();
  const h6Blob = JSON.stringify(h6Obj || {}).toLowerCase();
  const h7Blob = JSON.stringify(h7Obj || {}).toLowerCase();
  const h9Blob = JSON.stringify(h9Obj || {}).toLowerCase();
  const h10Blob = JSON.stringify(h10Obj || {}).toLowerCase();
  const h11Blob = JSON.stringify(h11Obj || {}).toLowerCase();

  const secondLord = safePlanetName(
    houseLords?.H2?.lord ?? houseLords?.[2]?.lord ?? houseLords?.H2 ?? houseLords?.[2]
  );
  const sixthLord = safePlanetName(
    houseLords?.H6?.lord ?? houseLords?.[6]?.lord ?? houseLords?.H6 ?? houseLords?.[6]
  );
  const seventhLord = safePlanetName(
    houseLords?.H7?.lord ?? houseLords?.[7]?.lord ?? houseLords?.H7 ?? houseLords?.[7]
  );
  const tenthLord = safePlanetName(
    houseLords?.H10?.lord ?? houseLords?.[10]?.lord ?? houseLords?.H10 ?? houseLords?.[10]
  );
  const eleventhLord = safePlanetName(
    houseLords?.H11?.lord ?? houseLords?.[11]?.lord ?? houseLords?.H11 ?? houseLords?.[11]
  );

  const hasD10 = !!d10;
  const hasD9 = !!d9;

  const dataCompleteness =
    (Object.keys(planets).length >= 7 ? 1 : 0) +
    (Object.keys(houseLords).length >= 6 ? 1 : 0) +
    (hasD10 ? 1 : 0) +
    (hasD9 ? 1 : 0);

  return {
    planets,
    houses,
    houseLords,
    d10,
    d9,
    activeDasha: getActiveDashaAnyShape(report),
    h2Blob,
    h6Blob,
    h7Blob,
    h9Blob,
    h10Blob,
    h11Blob,
    tenthLord,
    sixthLord,
    seventhLord,
    secondLord,
    eleventhLord,
    hasD10,
    hasD9,
    dataCompleteness,
  };
}