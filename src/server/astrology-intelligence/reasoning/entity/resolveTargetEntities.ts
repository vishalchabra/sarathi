import type {
  ResolvedEntity,
} from "../types";

type EntityDefinition = {
  key: string;
  label: string;
  aliases: string[];
};

const ENTITY_DEFINITIONS:
  EntityDefinition[] = [
  {
    key: "software_engineer",
    label: "Software Engineer",
    aliases: [
      "software engineer",
      "software developer",
      "developer",
      "programmer",
      "coding career",
      "tech engineer",
    ],
  },

  {
    key: "consultant",
    label: "Consultant",
    aliases: [
      "consultant",
      "consulting",
      "advisor",
      "adviser",
      "strategy consultant",
      "management consultant",
    ],
  },

  {
    key: "teacher",
    label: "Teacher",
    aliases: [
      "teacher",
      "teaching",
      "professor",
      "trainer",
      "educator",
      "instructor",
    ],
  },

  {
    key: "lawyer",
    label: "Lawyer",
    aliases: [
      "lawyer",
      "advocate",
      "attorney",
      "legal career",
      "legal profession",
      "practice law",
    ],
  },

  {
    key: "doctor",
    label: "Doctor",
    aliases: [
      "doctor",
      "physician",
      "medicine",
      "medical career",
      "medical profession",
    ],
  },

  {
    key: "astrologer",
    label: "Astrologer",
    aliases: [
      "astrologer",
      "astrology practice",
      "astrology career",
      "vedic astrologer",
      "astrology teacher",
    ],
  },

  {
    key: "banker",
    label: "Banker",
    aliases: [
      "banker",
      "banking",
      "banking career",
      "banking profession",
      "work in banking",
      "bank job",
    ],
  },

  {
    key: "politician",
    label: "Politician",
    aliases: [
      "politician",
      "politics",
      "political career",
      "political leader",
      "public office",
      "elected office",
    ],
  },

  {
    key: "entrepreneur",
    label: "Entrepreneur",
    aliases: [
      "entrepreneur",
      "entrepreneurship",
      "become an entrepreneur",
      "start my own business",
      "start a business",
      "founder career",
    ],
  },

  {
    key: "researcher",
    label: "Researcher",
    aliases: [
      "researcher",
      "research career",
      "research profession",
      "work in research",
      "academic researcher",
    ],
  },

  {
    key: "psychologist",
    label: "Psychologist",
    aliases: [
      "psychologist",
      "psychology career",
      "psychology profession",
      "work in psychology",
      "clinical psychologist",
    ],
  },

  {
    key: "accountant",
    label: "Accountant",
    aliases: [
      "accountant",
      "accounting",
      "accounting career",
      "accounting profession",
      "work in accounting",
    ],
  },

  {
    key: "journalist",
    label: "Journalist",
    aliases: [
      "journalist",
      "journalism",
      "journalism career",
      "news reporter",
      "reporter",
      "work in journalism",
    ],
  },

  {
    key: "writer",
    label: "Writer",
    aliases: [
      "writer",
      "writing career",
      "professional writer",
      "author career",
      "become an author",
      "work as a writer",
    ],
  },

  {
    key: "salesperson",
    label: "Salesperson",
    aliases: [
      "salesperson",
      "sales person",
      "sales career",
      "work in sales",
      "sales professional",
      "sales job",
    ],
  },

  {
    key: "architect",
    label: "Architect",
    aliases: [
      "architect",
      "architecture",
      "architecture career",
      "work in architecture",
      "architectural career",
    ],
  },

  {
    key: "designer",
    label: "Designer",
    aliases: [
      "designer",
      "design career",
      "work in design",
      "graphic designer",
      "product designer",
      "ux designer",
      "ui designer",
    ],
  },

  {
    key: "scientist",
    label: "Scientist",
    aliases: [
      "scientist",
      "science career",
      "scientific career",
      "research scientist",
      "work as a scientist",
    ],
  },

  {
    key: "military_officer",
    label: "Military Officer",
    aliases: [
      "military officer",
      "army officer",
      "armed forces officer",
      "military career",
      "career in the military",
      "defence officer",
      "defense officer",
    ],
  },

  /*
   * Keep this profile distinct from generic "teacher".
   * The resolver below ranks longer/more-specific aliases
   * before generic aliases, so "spiritual teacher" wins
   * over the substring "teacher".
   */
  {
    key: "spiritual_teacher",
    label: "Spiritual Teacher",
    aliases: [
      "spiritual teacher",
      "spiritual teaching",
      "spiritual educator",
      "spiritual guide",
      "religious teacher",
      "scriptural teacher",
      "meditation teacher",
    ],
  },

  {
    key: "saas_business",
    label: "SaaS Business",
    aliases: [
      "saas",
      "software company",
      "software business",
      "ai company",
      "ai startup",
      "technology platform",
      "subscription software",
      "digital platform",
    ],
  },

  {
    key: "consulting_business",
    label: "Consulting Business",
    aliases: [
      "consulting business",
      "consulting company",
      "advisory business",
      "advisory firm",
      "professional services business",
    ],
  },

  {
    key: "premium_consumer_brand",
    label: "Premium Consumer Brand",
    aliases: [
      "premium brand",
      "luxury brand",
      "consumer brand",
      "lifestyle brand",
      "beauty brand",
      "hospitality brand",
    ],
  },

  {
    key: "marriage_partnership",
    label: "Marriage Partnership",
    aliases: [
      "marriage",
      "married life",
      "long term relationship",
      "life partnership",
      "committed relationship",
    ],
  },

  {
    key: "meditation_path",
    label: "Meditation Path",
    aliases: [
      "meditation",
      "meditation path",
      "mantra practice",
      "spiritual practice",
      "sadhana",
      "contemplative path",
    ],
  },
];

function normalize(
  value: string
): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9\s]+/g,
      " "
    )
    .replace(
      /\s+/g,
      " "
    );
}

export function resolveTargetEntities(
  question: string
): ResolvedEntity[] {
  const normalizedQuestion =
    normalize(
      question
    );

  const matches =
    ENTITY_DEFINITIONS.flatMap(
      (definition) => {
        const matchingAliases =
          definition.aliases
            .filter(
              (alias) =>
                normalizedQuestion.includes(
                  normalize(
                    alias
                  )
                )
            )
            .sort(
              (
                first,
                second
              ) =>
                normalize(
                  second
                ).length -
                normalize(
                  first
                ).length
            );

        if (
          matchingAliases.length ===
          0
        ) {
          return [];
        }

        const strongestAlias =
          matchingAliases[0];

        const aliasLength =
          normalize(
            strongestAlias
          ).length;

        const confidence =
          Math.min(
            100,
            70 +
              Math.min(
                20,
                aliasLength
              ) +
              Math.min(
                10,
                (
                  matchingAliases.length -
                  1
                ) *
                  4
              )
          );

        return [
          {
            key:
              definition.key,

            label:
              definition.label,

            confidence,

            aliases:
              definition.aliases,

            matchedText:
              strongestAlias,
          },
        ];
      }
    )
    .sort(
      (
        first,
        second
      ) => {
        /*
         * Specific phrase wins first.
         *
         * Example:
         * "spiritual teacher"
         * must rank ahead of
         * "teacher".
         */
        const lengthDifference =
          normalize(
            second.matchedText
          ).length -
          normalize(
            first.matchedText
          ).length;

        if (
          lengthDifference !==
          0
        ) {
          return lengthDifference;
        }

        return (
          second.confidence -
          first.confidence
        );
      }
    );

  const seen =
    new Set<string>();

  return matches.filter(
    (match) => {
      if (
        seen.has(
          match.key
        )
      ) {
        return false;
      }

      seen.add(
        match.key
      );

      return true;
    }
  );
}