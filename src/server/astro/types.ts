// src/server/astro/types.ts

/* --------------------------- Core identity/types --------------------------- */

export type PlanetId =
  | "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn" | "Rahu" | "Ketu";

export type Birth = {
  /** ISO local date-time string, e.g. "1997-05-18T14:22:00" */
  dateISO: string;
  /** IANA TZ, e.g. "Asia/Kolkata" */
  tz: string;
  /** Latitude and Longitude in decimal degrees */
  lat: number;
  lon: number;
};

/** Minimal position shape used by all planet builders */
export type PlanetPos = {
  id: PlanetId;
  /** Ecliptic longitude (0..360) */
  lon: number;
  /** Sign label you already generate, e.g. "Leo" */
  sign: string;
  /** Whole-sign/house number (1..12) */
  house: number;
  /** Degree within sign (0..29.xx) or normalized 0..360 — your choice */
  deg: number;
  /** Optional nakshatra info; routes can enrich if missing */
  nakName?: string;
  pada?: 1 | 2 | 3 | 4;
};

/* ------------------------------ Aspect typing ------------------------------ */

export type AspectKind = "7th" | "3rd" | "4th" | "5th" | "8th" | "9th" | "10th";
export type AspectHit = { from: PlanetId; kind: AspectKind };

/* ------------------------------ Common pieces ------------------------------ */

export type NatalSummary = {
  sign: string;
  house: number;
  deg: number;
  nak?: { name: string; pada: 1 | 2 | 3 | 4 };
};

export type ScoreBag = Record<string, number>;

export type WindowHit = {
  from: string; // ISO date
  to: string;   // ISO date
  label: string;
  confidence: number; // 0..1
  hits?: string[];
};

/* ---------------------------- Planet pack shapes --------------------------- */
/* Keep these light and permissive; we can tighten later if needed. */

export type SunPack = {
  planet: "Sun";
  natal: NatalSummary;
  features: {
    yogas: string[];
    conjunctions: string[];
    clusters: string[];
    aspects_on_sun: AspectHit[];
  };
  scores: ScoreBag;
  windows: WindowHit[];
  explain: string[];
  remedies: string[];
};

export type MoonPack = {
  planet: "Moon";
  natal: NatalSummary;
  features: {
    yogas: string[];
    conjunctions: string[];
    clusters: string[];
    aspects_on_moon: AspectHit[];
  };
  scores: ScoreBag;
  windows: WindowHit[];
  explain: string[];
  remedies: string[];
};

export type MarsPack = {
  planet: "Mars";
  natal: NatalSummary;
  features: {
    yogas: string[];
    conjunctions: string[];
    clusters: string[];
    aspects_on_mars: AspectHit[];
  };
  scores: ScoreBag;
  windows: WindowHit[];
  explain: string[];
  remedies: string[];
};

export type MercuryPack = {
  planet: "Mercury";
  natal: NatalSummary;
  features: {
    yogas: string[];
    conjunctions: string[];
    clusters: string[];
    aspects_on_mercury: AspectHit[];
  };
  scores: ScoreBag;
  windows: WindowHit[];
  explain: string[];
  remedies: string[];
};

export type VenusPack = {
  planet: "Venus";
  natal: NatalSummary;
  features: {
    yogas: string[];
    conjunctions: string[];
    clusters: string[];
    aspects_on_venus: AspectHit[];
  };
  scores: ScoreBag;
  windows: WindowHit[];
  explain: string[];
  remedies: string[];
};

export type JupiterPack = {
  planet: "Jupiter";
  natal: NatalSummary;
  features: {
    yogas: string[];
    conjunctions: string[];
    clusters: string[];
    aspects_on_jupiter: AspectHit[];
  };
  scores: ScoreBag;
  windows: WindowHit[];
  explain: string[];
  remedies: string[];
};

export type SaturnPack = {
  planet: "Saturn";
  natal: NatalSummary;
  features: {
    yogas: string[];
    conjunctions: string[];
    clusters: string[];
    aspects_on_saturn: AspectHit[];
  };
  scores: ScoreBag;
  windows: WindowHit[];
  explain: string[];
  remedies: string[];
};

export type RahuPack = {
  planet: "Rahu";
  natal: NatalSummary;
  features: {
    yogas: string[];
    conjunctions: string[];
    clusters: string[];
    aspects_on_rahu: AspectHit[];
  };
  scores: ScoreBag;
  windows: WindowHit[];
  explain: string[];
  remedies: string[];
};

export type KetuPack = {
  planet: "Ketu";
  natal: NatalSummary;
  features: {
    yogas: string[];
    conjunctions: string[];
    clusters: string[];
    aspects_on_ketu: AspectHit[];
  };
  scores: ScoreBag;
  windows: WindowHit[];
  explain: string[];
  remedies: string[];
};

/* ------------------------------ Convenience ------------------------------- */

export type AnyPlanetPack =
  | SunPack
  | MoonPack
  | MarsPack
  | MercuryPack
  | VenusPack
  | JupiterPack
  | SaturnPack
  | RahuPack
  | KetuPack;

export type PlanetPackMap = {
  sun?: SunPack;
  moon?: MoonPack;
  mars?: MarsPack;
  mercury?: MercuryPack;
  venus?: VenusPack;
  jupiter?: JupiterPack;
  saturn?: SaturnPack;
  rahu?: RahuPack;
  ketu?: KetuPack;
};
/* ------------------------- Profession engine types ------------------------- */

export type ProfessionFacts = {
  likelyDomains: string[];
  likelyRoles: string[];
  workStyle: string[];
  serviceVsBusiness: "service" | "business" | "hybrid";
  publicVsBackend: "public" | "backend" | "hybrid";
  leadershipPotential: "low" | "medium" | "high";
  stabilityPattern: "stable" | "changing" | "mixed";
  dominantCareerPlanets: PlanetId[];
  strongestCareerSignals: string[];
  supportingDivisionalSignals: string[];
  obstacles: string[];
  modifiers: string[];
  confidence: number; // 0..100
};
/* ------------------------ Base intelligence layer ------------------------ */

export type HouseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type PlanetStrengthLabel =
  | "exalted"
  | "own"
  | "friendly"
  | "neutral"
  | "enemy"
  | "debilitated";

export type BaseChartPlanetFactor = {
  id: PlanetId;
  sign?: string;
  house?: number;
  deg?: number;
  dignity?: PlanetStrengthLabel;
  retro?: boolean;
  combust?: boolean;
  vargottama?: boolean;
};

export type BaseChartFactors = {
  identity: {
    ascSign?: string | null;
    ascLord?: PlanetId | null;
    moonSign?: string | null;
    moonNakshatra?: string | null;
  };

  houseLords: Partial<Record<HouseNumber, PlanetId>>;

  planets: BaseChartPlanetFactor[];

  strengths: {
    dominantPlanets: PlanetId[];
    weakPlanets: PlanetId[];
    vargottamaPlanets: PlanetId[];
    combustPlanets: PlanetId[];
    retroPlanets: PlanetId[];
  };

  houseThemes: {
    strongHouses: HouseNumber[];
    weakHouses: HouseNumber[];
    activatedHouses: HouseNumber[];
  };

  specialFactors: {
    badhakHouse?: HouseNumber | null;
    badhakLord?: PlanetId | null;
    marakaLords: PlanetId[];
    yogas: string[];
  };

  divisionalSupport: {
    d9?: {
      ascSign?: string | null;
      reinforcedPlanets: PlanetId[];
    };
    d10?: {
      ascSign?: string | null;
      reinforcedPlanets: PlanetId[];
      careerPlanets: PlanetId[];
    };
  };

  activeTiming: {
    md?: PlanetId | null;
    ad?: PlanetId | null;
    pd?: PlanetId | null;
    activeNatalHouses: HouseNumber[];
    modifiers: string[];
  };

  transitContext: {
    topHits: string[];
    activatedNatalPlanets: PlanetId[];
    activatedNatalHouses: HouseNumber[];
  };
};
/* ------------------------- Career reading engine ------------------------- */

export type CareerReading = {
  coreCareerPattern: string;
  likelyIndustries: string[];
  likelyRoles: string[];
  workStyle: string[];
  serviceVsBusiness: "service" | "business" | "hybrid";
  publicVsBackend: "public" | "backend" | "hybrid";
  leadershipStyle: string;
  dissatisfactionPattern: string[];
  currentPhaseModifier: string[];
  strongestSignals: string[];
  blockers: string[];
  confidence: number; // 0..100
};
/* ------------------------ Marriage reading engine ------------------------ */

export type MarriageFacts = {
  partnershipStyle: string[];
  commitmentStyle: string[];
  spouseQualities: string[];
  likelyMarriagePattern: "steady" | "delayed" | "mixed" | "unconventional";
  loveVsArranged: "love" | "arranged" | "mixed";
  dominantMarriagePlanets: PlanetId[];
  strongestMarriageSignals: string[];
  d9Signals: string[];
  obstacles: string[];
  modifiers: string[];
  confidence: number;
};

export type MarriageReading = {
  relationshipPattern: string;
  commitmentPattern: string;
  spouseType: string[];
  likelyMarriagePattern: "steady" | "delayed" | "mixed" | "unconventional";
  loveVsArranged: "love" | "arranged" | "mixed";
  strengths: string[];
  blockers: string[];
  currentPhaseModifier: string[];
  strongestSignals: string[];
  confidence: number;
};
/* --------------------- Historical event snapshot engine --------------------- */

export type HistoricalSnapshot = {
  targetDateISO: string;

  dasha: {
    md?: PlanetId | null;
    ad?: PlanetId | null;
    pd?: PlanetId | null;
  };

  transitPlanets: Array<{
    id: PlanetId;
    sign?: string;
    house?: number;
    deg?: number;
  }>;

  activeNatalHouses: HouseNumber[];
  activatedNatalPlanets: PlanetId[];
  topTransitHits: string[];
  degreeHits?: DegreeHit[];
  summary: {
    relationshipActive: boolean;
    careerActive: boolean;
    moneyActive: boolean;
    healthActive: boolean;
  };
};
/* ------------------------ Event verification layer ------------------------ */

export type EventType =
  | "marriage"
  | "career_change"
  | "business_start"
  | "property"
  | "child_birth"
  | "relocation"
  | "health"
  | "transformation";

export type EventVerdict = "strong_match" | "possible_match" | "weak_match";

export type EventVerification = {
  eventType: EventType;
  verdict: EventVerdict;
  score: number; // 0..100
  reasons: string[];
  natalSupport: string[];
  divisionalSupport: string[];
  dashaSupport: string[];
  transitSupport: string[];
  blockers: string[];
};
/* ------------------------- Degree hit engine ------------------------- */

export type DegreeHit = {
  transitPlanet: PlanetId;
  natalPlanet: PlanetId;
  orb: number;
  sameHouse: boolean;
  strength: number; // 0..1
  note: string;
};