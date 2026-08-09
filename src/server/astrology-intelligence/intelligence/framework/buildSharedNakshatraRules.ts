import type {
  PlanetFact,
  PlanetName,
} from "../../contracts/facts";

import type {
  KnowledgeCategory,
  KnowledgeRule,
} from "../../knowledge/types";

import {
  NAKSHATRA_PROFILE_BY_LABEL,
} from "../../knowledge/nakshatras";

type PlanetLens = {
  categories:
    KnowledgeCategory[];

  themes:
    string[];

  strengths:
    string[];

  shadows:
    string[];
};

/*
 * These are planetary lenses only.
 *
 * They do not contain nakshatra-specific interpretations.
 * The same lens is combined with whichever nakshatra is
 * present in PlanetFact.
 */
const PLANET_LENSES:
  Record<
    PlanetName,
    PlanetLens
  > = {
  Sun: {
    categories: [
      "identity",
      "career",
      "psychology",
    ],
    themes: [
      "leadership",
      "authority",
      "visibility",
      "purpose",
      "self-expression",
    ],
    strengths: [
      "confidence",
      "direction",
      "leadership",
    ],
    shadows: [
      "ego",
      "pride",
      "over-identification",
    ],
  },

  Moon: {
    categories: [
      "psychology",
      "relationships",
      "communication",
    ],
    themes: [
      "emotion",
      "memory",
      "receptivity",
      "care",
      "public response",
    ],
    strengths: [
      "empathy",
      "adaptability",
      "emotional intelligence",
    ],
    shadows: [
      "mood fluctuation",
      "subjectivity",
      "emotional reactivity",
    ],
  },

  Mars: {
    categories: [
      "career",
      "business",
      "strength",
    ],
    themes: [
      "action",
      "courage",
      "competition",
      "technical execution",
      "initiative",
    ],
    strengths: [
      "decisiveness",
      "execution",
      "courage",
    ],
    shadows: [
      "impatience",
      "conflict",
      "overreaction",
    ],
  },

  Mercury: {
    categories: [
      "communication",
      "education",
      "business",
      "career",
    ],
    themes: [
      "analysis",
      "communication",
      "learning",
      "commerce",
      "pattern recognition",
    ],
    strengths: [
      "reasoning",
      "adaptability",
      "explanation",
    ],
    shadows: [
      "overthinking",
      "scattered attention",
      "excess analysis",
    ],
  },

  Jupiter: {
    categories: [
      "education",
      "spirituality",
      "wealth",
      "career",
    ],
    themes: [
      "wisdom",
      "teaching",
      "guidance",
      "ethics",
      "knowledge synthesis",
    ],
    strengths: [
      "judgement",
      "meaning",
      "long-range thinking",
    ],
    shadows: [
      "overconfidence",
      "dogmatism",
      "excess",
    ],
  },

  Venus: {
    categories: [
      "relationships",
      "business",
      "wealth",
      "communication",
    ],
    themes: [
      "relationships",
      "value",
      "attraction",
      "creativity",
      "negotiation",
    ],
    strengths: [
      "diplomacy",
      "aesthetic judgement",
      "relationship building",
    ],
    shadows: [
      "indulgence",
      "avoidance",
      "attachment",
    ],
  },

  Saturn: {
    categories: [
      "career",
      "business",
      "strength",
      "psychology",
    ],
    themes: [
      "discipline",
      "structure",
      "responsibility",
      "systems",
      "endurance",
    ],
    strengths: [
      "persistence",
      "process",
      "long-term execution",
    ],
    shadows: [
      "fear",
      "rigidity",
      "delay",
    ],
  },

  Rahu: {
    categories: [
      "business",
      "career",
      "psychology",
      "communication",
    ],
    themes: [
      "innovation",
      "technology",
      "foreign influence",
      "scale",
      "unconventional thinking",
    ],
    strengths: [
      "ambition",
      "experimentation",
      "market awareness",
    ],
    shadows: [
      "obsession",
      "distortion",
      "overreach",
    ],
  },

  Ketu: {
    categories: [
      "spirituality",
      "psychology",
      "career",
      "education",
    ],
    themes: [
      "detachment",
      "research",
      "specialisation",
      "hidden knowledge",
      "pattern isolation",
    ],
    strengths: [
      "depth",
      "discrimination",
      "specialist focus",
    ],
    shadows: [
      "withdrawal",
      "fragmentation",
      "disconnection",
    ],
  },
};

function unique(
  values: string[]
): string[] {
  return Array.from(
    new Set(
      values
        .map(
          (value) =>
            value.trim()
        )
        .filter(Boolean)
    )
  );
}

function buildUniversalRule(
  facts: PlanetFact
): KnowledgeRule | null {
  const profile =
    NAKSHATRA_PROFILE_BY_LABEL[
      facts.nakshatra
    ];

  if (!profile) {
    return null;
  }

  return {
    id:
      `${facts.planet.toLowerCase()}_shared_nakshatra_${profile.key}`,

    category:
      profile.primaryCategory,

    title:
      `${facts.planet} in ${profile.label}`,

    description:
      `${profile.label} contributes themes of ${profile.themes
        .slice(0, 5)
        .join(", ")} to ${facts.planet}'s expression.`,

    weight:
      profile.score >= 9
        ? "high"
        : "medium",

    priority:
      78,

    trigger: {
      nakshatra:
        profile.label,
    },

    effect: {
      score:
        profile.score,

      adds:
        profile.themes,

      strengthens:
        unique([
          ...profile.strengthens,
          ...profile.capabilityThemes,
        ]),

      shadowAdds:
        profile.shadows,

      notes: [
        `Nakshatra ruler: ${profile.ruler}.`,
        `Nakshatra deity: ${profile.deity}.`,
        `Nakshatra motivation: ${profile.motivation}.`,
        `Intelligence style: ${profile.intelligenceStyle.join(", ")}.`,
        `Learning style: ${profile.learningStyle.join(", ")}.`,
        `Communication style: ${profile.communicationStyle.join(", ")}.`,
        `Business style: ${profile.businessStyle.join(", ")}.`,
        `Relationship style: ${profile.relationshipStyle.join(", ")}.`,
        `Spiritual style: ${profile.spiritualStyle.join(", ")}.`,
        `Decision style: ${profile.decisionStyle.join(", ")}.`,
        "Universal nakshatra meaning is being applied.",
      ],
    },
  };
}

function buildInteractionRule(
  facts: PlanetFact
): KnowledgeRule | null {
  const profile =
    NAKSHATRA_PROFILE_BY_LABEL[
      facts.nakshatra
    ];

  if (!profile) {
    return null;
  }

  const lens =
    PLANET_LENSES[
      facts.planet
    ];

  const categoryAligned =
    lens.categories.includes(
      profile.primaryCategory
    );

  const rulerResonance =
    profile.ruler ===
    facts.planet;

  const score =
    profile.score +
    (
      categoryAligned
        ? 2
        : 0
    ) +
    (
      rulerResonance
        ? 2
        : 0
    );

  const combinedThemes =
    unique([
      ...lens.themes,
      ...profile.themes,
    ]);

  const combinedStrengths =
    unique([
      ...lens.strengths,
      ...profile.strengthens,
      ...profile.capabilityThemes,
    ]);

  const combinedShadows =
    unique([
      ...lens.shadows,
      ...profile.shadows,
    ]);

  return {
    id:
      `${facts.planet.toLowerCase()}_nakshatra_interaction_${profile.key}`,

    category:
      categoryAligned
        ? profile.primaryCategory
        : lens.categories[0],

    title:
      `${facts.planet} expressing through ${profile.label}`,

    description:
      `${facts.planet}'s natural themes of ${lens.themes
        .slice(0, 3)
        .join(", ")} are filtered through ${profile.label}'s themes of ${profile.themes
        .slice(0, 3)
        .join(", ")}.`,

    weight:
      score >= 11
        ? "high"
        : "medium",

    priority:
      rulerResonance
        ? 86
        : categoryAligned
          ? 84
          : 80,

    trigger: {
      nakshatra:
        profile.label,
    },

    effect: {
      score:
        Math.min(
          12,
          score
        ),

      /*
       * Do not duplicate the complete universal nakshatra
       * profile here. The interaction rule adds the planet's
       * own lens and strengthens the combined expression.
       */
      adds:
        lens.themes,

      strengthens:
        combinedStrengths,

      shadowAdds:
        combinedShadows,

      notes: [
        `Planet lens: ${lens.themes.join(", ")}.`,
        `Nakshatra lens: ${profile.themes.join(", ")}.`,
        `Capability vocabulary: ${profile.capabilityThemes.join(", ")}.`,
        `Through ${facts.planet}, the nakshatra's intelligence style is ${profile.intelligenceStyle.join(", ")}.`,
        `Through ${facts.planet}, learning tends toward ${profile.learningStyle.join(", ")}.`,
        `Through ${facts.planet}, communication tends toward ${profile.communicationStyle.join(", ")}.`,
        `Through ${facts.planet}, business expression tends toward ${profile.businessStyle.join(", ")}.`,
        categoryAligned
          ? `${facts.planet}'s natural expression aligns with ${profile.label}'s primary ${profile.primaryCategory} domain.`
          : `${facts.planet} modifies ${profile.label}'s primary ${profile.primaryCategory} domain through its own planetary nature.`,
        rulerResonance
          ? `${facts.planet} also rules ${profile.label}, strengthening the planet-nakshatra resonance.`
          : `${profile.label} is ruled by ${profile.ruler}.`,
        `Combined themes available to downstream reasoning: ${combinedThemes
          .slice(0, 8)
          .join(", ")}.`,
        "House, dignity, lordship, sambandha, varga and activation factors remain independent modifiers.",
      ],
    },
  };
}

export function buildSharedNakshatraRules(
  facts: PlanetFact
): KnowledgeRule[] {
  const universalRule =
    buildUniversalRule(
      facts
    );

  const interactionRule =
    buildInteractionRule(
      facts
    );

  return [
    universalRule,
    interactionRule,
  ].filter(
    (
      rule
    ): rule is KnowledgeRule =>
      rule !== null
  );
}