export type CareerCertificationScenario = {
  id: string;

  label: string;

  question: string;

  ageGroup:
    | "child"
    | "student"
    | "early_career"
    | "mid_career"
    | "late_career";

  expected: {
    eventType:
      | "profession_identity"
      | "job_change"
      | "promotion"
      | "comparison"
      | "timing";

    shouldMentionTiming:
      boolean;

    shouldMentionDasha:
      boolean;

    shouldMentionDates:
      boolean;

    shouldBeLifeStageAdapted:
      boolean;

    shouldMentionAny?: string[];

    shouldNotMention?: string[];
  };
};

export const CAREER_CERTIFICATION_SCENARIOS:
  CareerCertificationScenario[] = [
  {
    id: "career_001",
    label: "Child profession suitability",
    question:
      "Should I become a criminal lawyer?",
    ageGroup:
      "child",

    expected: {
      eventType:
        "profession_identity",

      shouldMentionTiming:
        false,

      shouldMentionDasha:
        false,

      shouldMentionDates:
        false,

      shouldBeLifeStageAdapted:
        true,

      shouldMentionAny: [
        "law",
        "analysis",
        "reasoning",
        "communication",
        "education",
        "learning",
      ],

      shouldNotMention: [
        "promotion",
        "employer",
        "salary",
        "networking",
        "client acquisition",
        "career movement",
        "visibility cycle",
      ],
    },
  },

  {
    id: "career_002",
    label: "Student profession suitability",
    question:
      "Should I become a doctor?",
    ageGroup:
      "student",

    expected: {
      eventType:
        "profession_identity",

      shouldMentionTiming:
        false,

      shouldMentionDasha:
        false,

      shouldMentionDates:
        false,

      shouldBeLifeStageAdapted:
        true,

      shouldMentionAny: [
        "medicine",
        "healing",
        "knowledge",
        "study",
        "education",
      ],

      shouldNotMention: [
        "promotion",
        "employer change",
        "salary increase",
        "career breakthrough",
      ],
    },
  },

  {
    id: "career_003",
    label: "Adult profession suitability",
    question:
      "Should I become a banker?",
    ageGroup:
      "mid_career",

    expected: {
      eventType:
        "profession_identity",

      shouldMentionTiming:
        false,

      shouldMentionDasha:
        false,

      shouldMentionDates:
        false,

      shouldBeLifeStageAdapted:
        true,

      shouldMentionAny: [
        "finance",
        "analysis",
        "governance",
        "responsibility",
        "commerce",
      ],
    },
  },

  {
    id: "career_004",
    label: "Astrologer suitability",
    question:
      "Should I become an astrologer?",
    ageGroup:
      "mid_career",

    expected: {
      eventType:
        "profession_identity",

      shouldMentionTiming:
        false,

      shouldMentionDasha:
        false,

      shouldMentionDates:
        false,

      shouldBeLifeStageAdapted:
        true,

      shouldMentionAny: [
        "intuition",
        "mysticism",
        "research",
        "analysis",
        "communication",
      ],
    },
  },

  {
    id: "career_005",
    label: "Software engineering suitability",
    question:
      "Would software engineering suit me?",
    ageGroup:
      "student",

    expected: {
      eventType:
        "profession_identity",

      shouldMentionTiming:
        false,

      shouldMentionDasha:
        false,

      shouldMentionDates:
        false,

      shouldBeLifeStageAdapted:
        true,

      shouldMentionAny: [
        "analysis",
        "learning",
        "innovation",
        "execution",
        "discipline",
      ],
    },
  },

  {
    id: "career_006",
    label: "Teacher suitability",
    question:
      "Would teaching suit me?",
    ageGroup:
      "early_career",

    expected: {
      eventType:
        "profession_identity",

      shouldMentionTiming:
        false,

      shouldMentionDasha:
        false,

      shouldMentionDates:
        false,

      shouldBeLifeStageAdapted:
        true,

      shouldMentionAny: [
        "teaching",
        "communication",
        "knowledge",
        "empathy",
      ],
    },
  },

  {
    id: "career_007",
    label: "Entrepreneur suitability",
    question:
      "Am I suited to entrepreneurship?",
    ageGroup:
      "early_career",

    expected: {
      eventType:
        "profession_identity",

      shouldMentionTiming:
        false,

      shouldMentionDasha:
        false,

      shouldMentionDates:
        false,

      shouldBeLifeStageAdapted:
        true,

      shouldMentionAny: [
        "entrepreneurship",
        "leadership",
        "commerce",
        "negotiation",
      ],
    },
  },

  {
    id: "career_008",
    label: "Writer suitability",
    question:
      "Should I become a writer?",
    ageGroup:
      "student",

    expected: {
      eventType:
        "profession_identity",

      shouldMentionTiming:
        false,

      shouldMentionDasha:
        false,

      shouldMentionDates:
        false,

      shouldBeLifeStageAdapted:
        true,

      shouldMentionAny: [
        "communication",
        "storytelling",
        "creativity",
        "writing",
      ],
    },
  },

  {
    id: "career_009",
    label: "Psychologist suitability",
    question:
      "Would psychology suit me as a profession?",
    ageGroup:
      "student",

    expected: {
      eventType:
        "profession_identity",

      shouldMentionTiming:
        false,

      shouldMentionDasha:
        false,

      shouldMentionDates:
        false,

      shouldBeLifeStageAdapted:
        true,

      shouldMentionAny: [
        "empathy",
        "analysis",
        "communication",
        "psychology",
      ],
    },
  },

  {
    id: "career_010",
    label: "Political career suitability",
    question:
      "Would politics suit me?",
    ageGroup:
      "mid_career",

    expected: {
      eventType:
        "profession_identity",

      shouldMentionTiming:
        false,

      shouldMentionDasha:
        false,

      shouldMentionDates:
        false,

      shouldBeLifeStageAdapted:
        true,

      shouldMentionAny: [
        "leadership",
        "communication",
        "governance",
        "authority",
      ],
    },
  },

  {
    id: "career_011",
    label: "Career timing",
    question:
      "When is a good time for me to change jobs?",
    ageGroup:
      "mid_career",

    expected: {
      eventType:
        "job_change",

      shouldMentionTiming:
        true,

      shouldMentionDasha:
        true,

      shouldMentionDates:
        true,

      shouldBeLifeStageAdapted:
        true,
    },
  },

  {
    id: "career_012",
    label: "Promotion timing",
    question:
      "When am I likely to get promoted?",
    ageGroup:
      "mid_career",

    expected: {
      eventType:
        "promotion",

      shouldMentionTiming:
        true,

      shouldMentionDasha:
        true,

      shouldMentionDates:
        true,

      shouldBeLifeStageAdapted:
        true,
    },
  },

  {
    id: "career_013",
    label: "Profession comparison",
    question:
      "Would I be better suited to teaching or writing?",
    ageGroup:
      "student",

    expected: {
      eventType:
        "comparison",

      shouldMentionTiming:
        false,

      shouldMentionDasha:
        false,

      shouldMentionDates:
        false,

      shouldBeLifeStageAdapted:
        true,

      shouldMentionAny: [
        "teaching",
        "writing",
        "communication",
        "creativity",
      ],
    },
  },

  {
    id: "career_014",
    label: "Business versus job",
    question:
      "Am I better suited to business or employment?",
    ageGroup:
      "early_career",

    expected: {
      eventType:
        "comparison",

      shouldMentionTiming:
        false,

      shouldMentionDasha:
        false,

      shouldMentionDates:
        false,

      shouldBeLifeStageAdapted:
        true,

      shouldMentionAny: [
        "business",
        "employment",
        "leadership",
        "execution",
      ],
    },
  },

  {
    id: "career_015",
    label: "Child broad career direction",
    question:
      "What kind of career would suit me best?",
    ageGroup:
      "child",

    expected: {
      eventType:
        "profession_identity",

      shouldMentionTiming:
        false,

      shouldMentionDasha:
        false,

      shouldMentionDates:
        false,

      shouldBeLifeStageAdapted:
        true,

      shouldNotMention: [
        "promotion",
        "salary",
        "employer",
        "client acquisition",
        "job change",
      ],
    },
  },
];