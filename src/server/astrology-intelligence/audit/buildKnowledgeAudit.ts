import type {
  PlanetName,
} from "../contracts/facts";

import type {
  KnowledgeRule,
  PlanetKnowledge,
} from "../knowledge/types";

import {
  SunKnowledge,
} from "../knowledge/sun";

import {
  MoonKnowledge,
} from "../knowledge/moon";

import {
  MarsKnowledge,
} from "../knowledge/mars";

import {
  MercuryKnowledge,
} from "../knowledge/mercury";

import {
  JupiterKnowledge,
} from "../knowledge/jupiter";

import {
  VenusKnowledge,
} from "../knowledge/venus";

import {
  SaturnKnowledge,
} from "../knowledge/saturn";

import {
  RahuKnowledge,
} from "../knowledge/rahu";

import {
  KetuKnowledge,
} from "../knowledge/ketu";

import {
  NAKSHATRA_PROFILES,
} from "../knowledge/nakshatras";

import {
  DIVISIONAL_CHART_PROFILES,
} from "../knowledge/divisionalCharts";

import {
  DASHA_ACTIVATION_PROFILES,
} from "../knowledge/dashas";

import {
  TRANSIT_ACTIVATION_PROFILES,
} from "../knowledge/transits";

type RuleGroupKey =
  | "identity"
  | "signRules"
  | "houseRules"
  | "dignityRules"
  | "conjunctionRules"
  | "aspectRules"
  | "dispositorRules"
  | "nakshatraRules"
  | "avasthaRules"
  | "vargaRules"
  | "dashaRules"
  | "transitRules"
  | "careerRules"
  | "businessRules"
  | "wealthRules"
  | "relationshipRules"
  | "healthRules"
  | "spiritualityRules"
  | "shadowRules";

export type KnowledgeGroupAudit = {
  group: RuleGroupKey;
  ruleCount: number;
  empty: boolean;
};

export type PlanetKnowledgeAudit = {
  planet: PlanetName;

  totalRules: number;

  groups:
    KnowledgeGroupAudit[];

  signCoverage: {
    covered: number;
    expected: 12;
    missing: string[];
  };

  houseCoverage: {
    covered: number;
    expected: 12;
    missing: number[];
  };

  dignityCoverage: {
    values: string[];
    count: number;
  };

  conjunctionCoverage: {
    planets: PlanetName[];
    count: number;
  };

  aspectCoverage: {
    fromPlanets: PlanetName[];
    toPlanets: PlanetName[];
    count: number;
  };

  dispositorCoverage: {
    planets: PlanetName[];
    count: number;
  };

  vargaCoverage: {
    charts: string[];
    count: number;
  };

  activationCoverage: {
    dashaRules: number;
    transitRules: number;
  };

  domainCoverage: {
    career: number;
    business: number;
    wealth: number;
    relationships: number;
    health: number;
    spirituality: number;
    shadow: number;
  };

  emptyGroups: RuleGroupKey[];

  duplicateRuleIds: string[];

  warnings: string[];
};

export type KnowledgeAudit = {
  generatedAt: string;

  planets:
    PlanetKnowledgeAudit[];

  sharedNakshatras: {
    totalProfiles: number;
    expected: 27;
    complete: boolean;
    missingCapabilityThemes: string[];
    duplicateKeys: string[];
    duplicateLabels: string[];
  };

  sharedVargas: {
    totalProfiles: number;
    expected: 7;
    complete: boolean;
    charts: string[];
    missingCapabilityThemes: string[];
    duplicateCharts: string[];
  };

  sharedDashas: {
    totalProfiles: number;
    expected: 9;
    complete: boolean;
    planets: PlanetName[];
    missingCapabilityThemes: PlanetName[];
  };

  sharedTransits: {
    totalProfiles: number;
    expected: 9;
    complete: boolean;
    planets: PlanetName[];
    missingCapabilityThemes: PlanetName[];
  };

  global: {
    totalPlanetRules: number;
    duplicateRuleIds: string[];
    warnings: string[];
  };
};

const PLANET_KNOWLEDGE:
  Record<
    PlanetName,
    PlanetKnowledge
  > = {
  Sun: SunKnowledge,
  Moon: MoonKnowledge,
  Mars: MarsKnowledge,
  Mercury: MercuryKnowledge,
  Jupiter: JupiterKnowledge,
  Venus: VenusKnowledge,
  Saturn: SaturnKnowledge,
  Rahu: RahuKnowledge,
  Ketu: KetuKnowledge,
};

const GROUPS:
  RuleGroupKey[] = [
  "identity",
  "signRules",
  "houseRules",
  "dignityRules",
  "conjunctionRules",
  "aspectRules",
  "dispositorRules",
  "nakshatraRules",
  "avasthaRules",
  "vargaRules",
  "dashaRules",
  "transitRules",
  "careerRules",
  "businessRules",
  "wealthRules",
  "relationshipRules",
  "healthRules",
  "spiritualityRules",
  "shadowRules",
];

const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

const HOUSES =
  Array.from(
    {
      length: 12,
    },
    (
      _,
      index
    ) =>
      index + 1
  );

function unique<T>(
  values: T[]
): T[] {
  return Array.from(
    new Set(values)
  );
}

function flattenKnowledge(
  knowledge: PlanetKnowledge
): KnowledgeRule[] {
  return GROUPS.flatMap(
    (group) =>
      knowledge[group]
  );
}

function findDuplicates(
  values: string[]
): string[] {
  const seen =
    new Set<string>();

  const duplicates =
    new Set<string>();

  for (
    const value of
    values
  ) {
    if (
      seen.has(value)
    ) {
      duplicates.add(
        value
      );
    }

    seen.add(
      value
    );
  }

  return Array.from(
    duplicates
  ).sort();
}

function buildPlanetAudit(
  knowledge: PlanetKnowledge
): PlanetKnowledgeAudit {
  const rules =
    flattenKnowledge(
      knowledge
    );

  const groups =
    GROUPS.map(
      (
        group
      ): KnowledgeGroupAudit => ({
        group,

        ruleCount:
          knowledge[
            group
          ].length,

        empty:
          knowledge[
            group
          ].length ===
          0,
      })
    );

  const coveredSigns =
    unique(
      rules
        .map(
          (rule) =>
            rule.trigger
              .sign
        )
        .filter(
          (
            sign
          ): sign is string =>
            Boolean(sign)
        )
    );

  const missingSigns =
    SIGNS.filter(
      (sign) =>
        !coveredSigns.includes(
          sign
        )
    );

  const coveredHouses =
    unique(
      rules
        .map(
          (rule) =>
            rule.trigger
              .house
        )
        .filter(
          (
            house
          ): house is number =>
            typeof house ===
            "number"
        )
    );

  const missingHouses =
    HOUSES.filter(
      (house) =>
        !coveredHouses.includes(
          house
        )
    );

  const dignityValues =
    unique(
      rules
        .map(
          (rule) =>
            rule.trigger
              .dignity
        )
        .filter(
          (
            dignity
          ): dignity is string =>
            Boolean(
              dignity
            )
        )
    ).sort();

  const conjunctionPlanets =
    unique(
      rules
        .map(
          (rule) =>
            rule.trigger
              .conjunction
        )
        .filter(
          (
            planet
          ): planet is PlanetName =>
            Boolean(
              planet
            )
        )
    ).sort();

  const aspectFromPlanets =
    unique(
      rules
        .map(
          (rule) =>
            rule.trigger
              .aspectFrom
        )
        .filter(
          (
            planet
          ): planet is PlanetName =>
            Boolean(
              planet
            )
        )
    ).sort();

  const aspectToPlanets =
    unique(
      rules
        .map(
          (rule) =>
            rule.trigger
              .aspectTo
        )
        .filter(
          (
            planet
          ): planet is PlanetName =>
            Boolean(
              planet
            )
        )
    ).sort();

  const dispositorPlanets =
    unique(
      rules
        .map(
          (rule) =>
            rule.trigger
              .dispositor
        )
        .filter(
          (
            planet
          ): planet is PlanetName =>
            Boolean(
              planet
            )
        )
    ).sort();

  const planetSpecificVargaCharts =
    unique(
      rules
        .map(
          (rule) =>
            rule.trigger
              .varga
              ?.chart
        )
        .filter(
          (
            chart
          ): chart is string =>
            Boolean(
              chart
            )
        )
    ).sort();

  const vargaCharts =
    unique([
      ...DIVISIONAL_CHART_PROFILES.map(
        (profile) =>
          profile.chart
      ),
      ...planetSpecificVargaCharts,
    ]).sort();

  const duplicateRuleIds =
    findDuplicates(
      rules.map(
        (rule) =>
          rule.id
      )
    );

  const emptyGroups =
    groups
      .filter(
        (group) =>
          group.empty
      )
      .map(
        (group) =>
          group.group
      );

  const warnings:
    string[] = [];

  if (
    missingSigns.length >
    0
  ) {
    warnings.push(
      `Missing sign coverage: ${missingSigns.join(
        ", "
      )}.`
    );
  }

  if (
    missingHouses.length >
    0
  ) {
    warnings.push(
      `Missing house coverage: ${missingHouses.join(
        ", "
      )}.`
    );
  }

  if (
    duplicateRuleIds.length >
    0
  ) {
    warnings.push(
      `Duplicate rule IDs: ${duplicateRuleIds.join(
        ", "
      )}.`
    );
  }

  /*
   * Nakshatra meaning is now shared globally, so an empty
   * planet-specific nakshatraRules array is not automatically
   * a defect.
   */
  const meaningfulEmptyGroups =
    emptyGroups.filter(
      (group) =>
        group !==
        "nakshatraRules" &&
        group !==
        "avasthaRules" &&
        group !==
        "vargaRules" &&
        group !==
        "dashaRules" &&
        group !==
        "transitRules"
    );

  if (
    meaningfulEmptyGroups.length >
    0
  ) {
    warnings.push(
      `Empty rule groups: ${meaningfulEmptyGroups.join(
        ", "
      )}.`
    );
  }

  return {
    planet:
      knowledge.planet,

    totalRules:
      rules.length,

    groups,

    signCoverage: {
      covered:
        coveredSigns.length,

      expected:
        12,

      missing:
        missingSigns,
    },

    houseCoverage: {
      covered:
        coveredHouses.length,

      expected:
        12,

      missing:
        missingHouses,
    },

    dignityCoverage: {
      values:
        dignityValues,

      count:
        dignityValues.length,
    },

    conjunctionCoverage: {
      planets:
        conjunctionPlanets,

      count:
        conjunctionPlanets.length,
    },

    aspectCoverage: {
      fromPlanets:
        aspectFromPlanets,

      toPlanets:
        aspectToPlanets,

      count:
        unique([
          ...aspectFromPlanets,
          ...aspectToPlanets,
        ]).length,
    },

    dispositorCoverage: {
      planets:
        dispositorPlanets,

      count:
        dispositorPlanets.length,
    },

    vargaCoverage: {
      charts:
        vargaCharts,

      count:
        vargaCharts.length,
    },

    activationCoverage: {
      /*
       * Dasha activation is now shared for all nine planets.
       * Planet-specific dashaRules remain optional overrides.
       */
      dashaRules:
        DASHA_ACTIVATION_PROFILES[
          knowledge.planet
        ]
          ? Math.max(
              1,
              knowledge
                .dashaRules
                .length
            )
          : knowledge
              .dashaRules
              .length,

      /*
       * Transit activation is shared for all nine planets.
       * Planet-specific transitRules remain optional overrides.
       */
      transitRules:
        TRANSIT_ACTIVATION_PROFILES[
          knowledge.planet
        ]
          ? Math.max(
              1,
              knowledge
                .transitRules
                .length
            )
          : knowledge
              .transitRules
              .length,
    },

    domainCoverage: {
      career:
        knowledge
          .careerRules
          .length,

      business:
        knowledge
          .businessRules
          .length,

      wealth:
        knowledge
          .wealthRules
          .length,

      relationships:
        knowledge
          .relationshipRules
          .length,

      health:
        knowledge
          .healthRules
          .length,

      spirituality:
        knowledge
          .spiritualityRules
          .length,

      shadow:
        knowledge
          .shadowRules
          .length,
    },

    emptyGroups,

    duplicateRuleIds,

    warnings,
  };
}

function buildSharedNakshatraAudit() {
  const keys =
    NAKSHATRA_PROFILES.map(
      (profile) =>
        profile.key
    );

  const labels =
    NAKSHATRA_PROFILES.map(
      (profile) =>
        profile.label
    );

  const missingCapabilityThemes =
    NAKSHATRA_PROFILES
      .filter(
        (profile) =>
          !Array.isArray(
            profile
              .capabilityThemes
          ) ||
          profile
            .capabilityThemes
            .length ===
            0
      )
      .map(
        (profile) =>
          profile.label
      );

  return {
    totalProfiles:
      NAKSHATRA_PROFILES
        .length,

    expected:
      27 as const,

    complete:
      NAKSHATRA_PROFILES
        .length ===
        27 &&
      missingCapabilityThemes
        .length ===
        0,

    missingCapabilityThemes,

    duplicateKeys:
      findDuplicates(
        keys
      ),

    duplicateLabels:
      findDuplicates(
        labels
      ),
  };
}

function buildSharedVargaAudit() {
  const charts =
    DIVISIONAL_CHART_PROFILES.map(
      (profile) =>
        profile.chart
    );

  const missingCapabilityThemes =
    DIVISIONAL_CHART_PROFILES
      .filter(
        (profile) =>
          !Array.isArray(
            profile
              .capabilityThemes
          ) ||
          profile
            .capabilityThemes
            .length ===
            0
      )
      .map(
        (profile) =>
          profile.chart
      );

  const duplicateCharts =
    findDuplicates(
      charts
    );

  return {
    totalProfiles:
      DIVISIONAL_CHART_PROFILES
        .length,

    expected:
      7 as const,

    complete:
      DIVISIONAL_CHART_PROFILES
        .length ===
        7 &&
      missingCapabilityThemes
        .length ===
        0 &&
      duplicateCharts.length ===
        0,

    charts:
      unique(
        charts
      ).sort(),

    missingCapabilityThemes,

    duplicateCharts,
  };
}

function buildSharedDashaAudit() {
  const planets =
    Object.keys(
      DASHA_ACTIVATION_PROFILES
    ) as PlanetName[];

  const missingCapabilityThemes =
    planets.filter(
      (planet) =>
        !Array.isArray(
          DASHA_ACTIVATION_PROFILES[
            planet
          ].capabilityThemes
        ) ||
        DASHA_ACTIVATION_PROFILES[
          planet
        ].capabilityThemes
          .length ===
          0
    );

  return {
    totalProfiles:
      planets.length,

    expected:
      9 as const,

    complete:
      planets.length ===
        9 &&
      missingCapabilityThemes
        .length ===
        0,

    planets:
      [...planets].sort(),

    missingCapabilityThemes,
  };
}

function buildSharedTransitAudit() {
  const planets =
    Object.keys(
      TRANSIT_ACTIVATION_PROFILES
    ) as PlanetName[];

  const missingCapabilityThemes =
    planets.filter(
      (planet) =>
        !Array.isArray(
          TRANSIT_ACTIVATION_PROFILES[
            planet
          ].capabilityThemes
        ) ||
        TRANSIT_ACTIVATION_PROFILES[
          planet
        ].capabilityThemes
          .length ===
          0
    );

  return {
    totalProfiles:
      planets.length,

    expected:
      9 as const,

    complete:
      planets.length ===
        9 &&
      missingCapabilityThemes
        .length ===
        0,

    planets:
      [...planets].sort(),

    missingCapabilityThemes,
  };
}

export function buildKnowledgeAudit(): KnowledgeAudit {
  const planets =
    (
      Object.values(
        PLANET_KNOWLEDGE
      )
    ).map(
      buildPlanetAudit
    );

  const allRules =
    (
      Object.values(
        PLANET_KNOWLEDGE
      )
    ).flatMap(
      flattenKnowledge
    );

  const duplicateRuleIds =
    findDuplicates(
      allRules.map(
        (rule) =>
          rule.id
      )
    );

  const sharedNakshatras =
    buildSharedNakshatraAudit();

  const sharedVargas =
    buildSharedVargaAudit();

  const sharedDashas =
    buildSharedDashaAudit();

  const sharedTransits =
    buildSharedTransitAudit();

  const globalWarnings:
    string[] = [];

  if (
    duplicateRuleIds.length >
    0
  ) {
    globalWarnings.push(
      `Duplicate rule IDs exist across planet knowledge: ${duplicateRuleIds.join(
        ", "
      )}.`
    );
  }

  if (
    !sharedNakshatras
      .complete
  ) {
    globalWarnings.push(
      "Shared nakshatra knowledge is incomplete."
    );
  }

  if (
    !sharedVargas
      .complete
  ) {
    globalWarnings.push(
      "Shared divisional-chart knowledge is incomplete."
    );
  }

  if (
    !sharedDashas
      .complete
  ) {
    globalWarnings.push(
      "Shared dasha activation knowledge is incomplete."
    );
  }

  if (
    !sharedTransits
      .complete
  ) {
    globalWarnings.push(
      "Shared transit activation knowledge is incomplete."
    );
  }

  for (
    const planet of
    planets
  ) {
    for (
      const warning of
      planet.warnings
    ) {
      globalWarnings.push(
        `${planet.planet}: ${warning}`
      );
    }
  }

  return {
    generatedAt:
      new Date()
        .toISOString(),

    planets,

    sharedNakshatras,

    sharedVargas,

    sharedDashas,

    sharedTransits,

    global: {
      totalPlanetRules:
        allRules.length,

      duplicateRuleIds,

      warnings:
        unique(
          globalWarnings
        ),
    },
  };
}