import type {
  LifeArea,
  PlanetName,
} from "../types";

export type EventThemeId =
  | "career_movement"
  | "career_responsibility"
  | "career_recognition"
  | "career_change"
  | "workload_service"
  | "mental_pressure"
  | "emotional_stability"
  | "home_change"
  | "home_attention"
  | "home_stability"
  | "family_responsibility"
  | "family_support"
  | "family_discussion"
  | "family_tension"
  | "health_attention"
  | "money_inflow"
  | "money_outflow"
  | "money_planning"
  | "money_accumulation"
  | "money_settlement"
  | "spiritual_practice"
  | "spiritual_introspection"
  | "spiritual_learning"
  | "spiritual_detachment"
  | "spiritual_guidance"
  | "children_attention"
  | "children_progress"
  | "children_responsibility"
  | "children_concern"
  | "children_milestone"
  | "relationship_attention"
  | "relationship_harmony"
  | "relationship_discussion"
  | "relationship_tension"
  | "relationship_commitment"
  | "travel_planning"
  | "travel_movement"
  | "travel_disruption"
  | "education_focus"
  | "education_progress"
  | "education_challenge"
  | "communication_activity"
  | "communication_clarity"
  | "communication_friction"
  | "public_image_visibility"
  | "public_image_recognition"
  | "public_image_pressure"
  | "hidden_matters_revelation"
  | "hidden_matters_introspection"
  | "hidden_matters_complication"
  | "property_attention"
  | "property_progress"
  | "property_complication";

export type EventDiscriminatorSignature = {
  planet: PlanetName;

  sources?: (
    | "lordship"
    | "natal_placement"
    | "dispositor"
  )[];
};

export type EventDiscriminator = {
  signatures?: EventDiscriminatorSignature[];

  polarity?: (
    | "supportive"
    | "challenging"
    | "mixed"
    | "neutral"
  )[];
};

export type EventThemeDefinition = {
  id: EventThemeId;

  area: LifeArea;

  label: string;

  primaryHouses: number[];

  supportingHouses: number[];

  description: string;

  discriminators?: EventDiscriminator;
};

export const EVENT_THEMES:
  EventThemeDefinition[] = [
   {
  id: "career_movement",
  area: "career",
  label: "Career movement",
  primaryHouses: [10],
  supportingHouses: [1, 6, 9],
  description:
    "Movement in professional direction, role, responsibilities or career path.",

  discriminators: {
    signatures: [
      {
        planet: "Sun",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Mars",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Rahu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
      "neutral",
    ],
  },
},
    {
  id: "career_responsibility",
  area: "career",
  label: "Career responsibility",
  primaryHouses: [6, 10],
  supportingHouses: [1],
  description:
    "Greater workload, responsibility, service obligations or operational demands.",

  discriminators: {
  signatures: [
    {
      planet: "Saturn",
      sources: [
  "lordship",
  "natal_placement",
  "dispositor",
],
    },
    {
      planet: "Mars",
      sources: [
  "lordship",
  "natal_placement",
  "dispositor",
],
    },
    {
      planet: "Sun",
      sources: [
  "lordship",
  "natal_placement",
  "dispositor",
],
    },
  ],

  polarity: [
    "supportive",
    "challenging",
    "mixed",
  ],
},
},

    {
  id: "career_recognition",
  area: "career",
  label: "Career recognition",
  primaryHouses: [10],
  supportingHouses: [1, 9],
  description:
    "Visibility, acknowledgement, authority or professional recognition.",

  discriminators: {
    signatures: [
      {
        planet: "Sun",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Venus",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
    ],
  },
},

   {
  id: "career_change",
  area: "career",
  label: "Career change",
  primaryHouses: [10],
  supportingHouses: [6, 9],
  description:
    "A change in professional structure, role, employer or working direction.",

  discriminators: {
  signatures: [
    {
      planet: "Rahu",
      sources: [
        "lordship",
        "natal_placement",
        "dispositor",
      ],
    },
    {
      planet: "Ketu",
      sources: [
        "lordship",
        "natal_placement",
        "dispositor",
      ],
    },
    {
      planet: "Saturn",
      sources: [
        "lordship",
        "natal_placement",
        "dispositor",
      ],
    },
    {
      planet: "Mars",
      sources: [
        "lordship",
        "natal_placement",
        "dispositor",
      ],
    },
  ],

  polarity: [
    "supportive",
    "challenging",
    "mixed",
  ],
},
},

    {
  id: "workload_service",
  area: "career",
  label: "Workload and service",
  primaryHouses: [6],
  supportingHouses: [1, 10],
  description:
    "Daily work demands, service, routines, problem-solving or increased workload.",

  discriminators: {
    signatures: [
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Mars",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Mercury",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "challenging",
      "mixed",
      "neutral",
    ],
  },
},

    {
  id: "mental_pressure",
  area: "mind",
  label: "Mental pressure",
  primaryHouses: [1, 4, 6],
  supportingHouses: [],
  description:
    "Increased mental load, emotional pressure, internal processing or worry.",

  discriminators: {
    signatures: [
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Rahu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Mars",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "challenging",
      "mixed",
    ],
  },
},

    {
  id: "emotional_stability",
  area: "mind",
  label: "Emotional stability",
  primaryHouses: [4],
  supportingHouses: [1],
  description:
    "Attention to emotional grounding, inner stability and peace of mind.",

  discriminators: {
    signatures: [
      {
        planet: "Moon",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Venus",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
      "neutral",
    ],
  },
},

    {
  id: "home_change",
  area: "home",
  label: "Change involving home",
  primaryHouses: [4],
  supportingHouses: [8, 12],
  description:
    "A change, adjustment or decision connected with the home or living environment may come into focus.",

  discriminators: {
    signatures: [
      {
        planet: "Mars",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Rahu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Ketu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "challenging",
      "mixed",
      "neutral",
    ],
  },
},

{
  id: "home_attention",
  area: "home",
  label: "Attention toward home",
  primaryHouses: [4],
  supportingHouses: [1],
  description:
    "Home, living arrangements or domestic matters may require more of your attention or involvement.",

  discriminators: {
    signatures: [
      {
        planet: "Moon",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Venus",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Mars",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "challenging",
      "mixed",
      "neutral",
    ],
  },
},

{
  id: "home_stability",
  area: "home",
  label: "Home stability",
  primaryHouses: [4],
  supportingHouses: [2, 11],
  description:
    "Greater stability, comfort or constructive progress may develop around the home or living environment.",

  discriminators: {
    signatures: [
      {
        planet: "Moon",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Venus",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
    ],
  },
},

{
  id: "family_responsibility",
  area: "family",
  label: "Family responsibility",
  primaryHouses: [4],
  supportingHouses: [2, 6],
  description:
    "Greater responsibility, practical involvement or attention may be required in matters involving family.",

  discriminators: {
    signatures: [
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Moon",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Sun",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "challenging",
      "mixed",
      "neutral",
    ],
  },
},

{
  id: "family_support",
  area: "family",
  label: "Family support",
  primaryHouses: [2, 4],
  supportingHouses: [9, 11],
  description:
    "Support, cooperation or constructive involvement from family may become more noticeable.",

  discriminators: {
    signatures: [
      {
        planet: "Moon",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Venus",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
    ],
  },
},

{
  id: "family_discussion",
  area: "family",
  label: "Important family discussion",
  primaryHouses: [2, 4],
  supportingHouses: [3],
  description:
    "A meaningful conversation, clarification or practical decision involving family may require attention.",

  discriminators: {
    signatures: [
      {
        planet: "Mercury",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Moon",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Sun",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "challenging",
      "mixed",
      "neutral",
    ],
  },
},

{
  id: "family_tension",
  area: "family",
  label: "Family tension",
  primaryHouses: [2, 4],
  supportingHouses: [6, 8, 12],
  description:
    "Differences, pressure or emotional strain within family matters may require careful handling.",

  discriminators: {
    signatures: [
      {
        planet: "Mars",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Rahu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Ketu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "challenging",
      "mixed",
    ],
  },
},

    {
  id: "health_attention",
  area: "health",
  label: "Health attention",
  primaryHouses: [1, 6],
  supportingHouses: [],
  description:
    "Greater attention to health, physical condition, routines or recovery.",

  discriminators: {
    signatures: [
      {
        planet: "Sun",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Mars",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "challenging",
      "mixed",
      "neutral",
    ],
  },
},
 {
  id: "money_inflow",
  area: "money",
  label: "Financial inflow",
  primaryHouses: [2, 11],
  supportingHouses: [5, 9, 10],
  description:
    "Potential receipt, income, financial gain or improvement in available resources.",

  discriminators: {
    signatures: [
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Venus",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],

    polarity: [
      "supportive",
      "mixed",
    ],
  },
},

{
  id: "money_outflow",
  area: "money",
  label: "Financial outflow",
  primaryHouses: [12],
  supportingHouses: [2, 6, 8],
  description:
    "Expenses, payments, financial obligations or increased movement of money outward.",

  discriminators: {
    signatures: [
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Mars",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Rahu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],

    polarity: [
      "challenging",
      "mixed",
      "neutral",
    ],
  },
},

{
  id: "money_planning",
  area: "money",
  label: "Financial planning",
  primaryHouses: [2],
  supportingHouses: [6, 10, 11],
  description:
    "Reviewing, organising or making practical decisions about money and financial resources.",

  discriminators: {
    signatures: [
      {
        planet: "Mercury",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],

    polarity: [
      "supportive",
      "mixed",
      "neutral",
    ],
  },
},

{
  id: "money_accumulation",
  area: "money",
  label: "Savings and accumulation",
  primaryHouses: [2, 11],
  supportingHouses: [5, 9],
  description:
    "Building savings, reserves, financial security or longer-term resource stability.",

  discriminators: {
    signatures: [
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],

    polarity: [
      "supportive",
      "mixed",
    ],
  },
},

{
  id: "money_settlement",
  area: "money",
  label: "Financial settlement",
  primaryHouses: [6, 8],
  supportingHouses: [2, 11, 12],
  description:
    "Resolving dues, repayments, liabilities, reimbursements or another pending financial matter.",

  discriminators: {
    signatures: [
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Mercury",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],

    polarity: [
      "supportive",
      "challenging",
      "mixed",
      "neutral",
    ],
  },
},
{
  id: "spiritual_practice",
  area: "spirituality",
  label: "Spiritual practice",
  primaryHouses: [5, 9, 12],
  supportingHouses: [8],
  description:
    "Greater inclination toward prayer, meditation, ritual, devotion or another spiritual practice.",

  discriminators: {
    signatures: [
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Ketu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Venus",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],

    polarity: [
      "supportive",
      "mixed",
      "neutral",
    ],
  },
},

{
  id: "spiritual_introspection",
  area: "spirituality",
  label: "Spiritual introspection",
  primaryHouses: [8, 12],
  supportingHouses: [4, 9],
  description:
    "A stronger inward focus, contemplation, solitude or deeper examination of inner patterns.",

  discriminators: {
    signatures: [
      {
        planet: "Ketu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Moon",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],

    polarity: [
      "mixed",
      "neutral",
      "challenging",
    ],
  },
},

{
  id: "spiritual_learning",
  area: "spirituality",
  label: "Spiritual learning",
  primaryHouses: [5, 9],
  supportingHouses: [8, 12],
  description:
    "Learning, studying or exploring philosophy, scripture, astrology or higher spiritual knowledge.",

  discriminators: {
    signatures: [
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Mercury",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Rahu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],

    polarity: [
      "supportive",
      "mixed",
      "neutral",
    ],
  },
},

{
  id: "spiritual_detachment",
  area: "spirituality",
  label: "Spiritual detachment",
  primaryHouses: [8, 12],
  supportingHouses: [9],
  description:
    "A period of withdrawal, release, reduced attachment or letting go of something that no longer feels meaningful.",

  discriminators: {
    signatures: [
      {
        planet: "Ketu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Rahu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],

    polarity: [
      "challenging",
      "mixed",
      "neutral",
    ],
  },
},

{
  id: "spiritual_guidance",
  area: "spirituality",
  label: "Spiritual guidance",
  primaryHouses: [9],
  supportingHouses: [5, 8, 12],
  description:
    "Seeking or receiving guidance through a teacher, mentor, tradition, belief system or meaningful source of wisdom.",

  discriminators: {
    signatures: [
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Sun",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],

    polarity: [
      "supportive",
      "mixed",
      "neutral",
    ],
  },
},
{
  id: "children_attention",
  area: "children",
  label: "Attention toward children",
  primaryHouses: [5],
  supportingHouses: [4, 9],
  description:
    "A child or matters connected with children may require more of your time, involvement or attention.",

  discriminators: {
    signatures: [
      {
        planet: "Moon",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Sun",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
      "neutral",
      "challenging",
    ],
  },
},

{
  id: "children_progress",
  area: "children",
  label: "Progress involving children",
  primaryHouses: [5],
  supportingHouses: [9, 11],
  description:
    "Constructive development, improvement or encouraging progress may emerge in matters involving children.",

  discriminators: {
    signatures: [
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Mercury",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Venus",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
      "neutral",
    ],
  },
},

{
  id: "children_responsibility",
  area: "children",
  label: "Responsibility involving children",
  primaryHouses: [5],
  supportingHouses: [6, 10],
  description:
    "Practical duties, decisions or responsibilities connected with a child may require attention.",

  discriminators: {
    signatures: [
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Sun",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Mars",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
      "neutral",
      "challenging",
    ],
  },
},

{
  id: "children_concern",
  area: "children",
  label: "Concern involving children",
  primaryHouses: [5],
  supportingHouses: [6, 8, 12],
  description:
    "A matter involving a child may require greater care, patience or closer attention.",

  discriminators: {
    signatures: [
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Mars",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Rahu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "challenging",
      "mixed",
      "neutral",
    ],
  },
},

{
  id: "children_milestone",
  area: "children",
  label: "Milestone involving children",
  primaryHouses: [5],
  supportingHouses: [9, 10, 11],
  description:
    "A meaningful development, achievement or important stage involving a child may come into focus.",

  discriminators: {
    signatures: [
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Sun",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Mercury",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
      "neutral",
    ],
  },
},
{
  id: "relationship_attention",
  area: "relationships",
  label: "Attention toward relationships",
  primaryHouses: [7],
  supportingHouses: [5, 11],
  description:
    "A relationship or important one-to-one interaction may require more of your attention or involvement.",

  discriminators: {
    signatures: [
      {
        planet: "Venus",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Moon",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
      "neutral",
      "challenging",
    ],
  },
},

{
  id: "relationship_harmony",
  area: "relationships",
  label: "Relationship harmony",
  primaryHouses: [7],
  supportingHouses: [5, 11],
  description:
    "Greater warmth, cooperation or mutual understanding may develop in an important relationship.",

  discriminators: {
    signatures: [
      {
        planet: "Venus",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Moon",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
    ],
  },
},

{
  id: "relationship_discussion",
  area: "relationships",
  label: "Important relationship discussion",
  primaryHouses: [7],
  supportingHouses: [3, 5],
  description:
    "An important conversation, clarification or decision may arise within a relationship.",

  discriminators: {
    signatures: [
      {
        planet: "Mercury",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Moon",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Venus",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
      "neutral",
      "challenging",
    ],
  },
},

{
  id: "relationship_tension",
  area: "relationships",
  label: "Relationship tension",
  primaryHouses: [7],
  supportingHouses: [6, 8, 12],
  description:
    "Differences, friction or emotional distance may require more careful handling in an important relationship.",

  discriminators: {
    signatures: [
      {
        planet: "Mars",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Rahu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Ketu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "challenging",
      "mixed",
    ],
  },
},

{
  id: "relationship_commitment",
  area: "relationships",
  label: "Relationship commitment",
  primaryHouses: [7],
  supportingHouses: [2, 11],
  description:
    "A relationship may move toward greater seriousness, agreement or shared commitment.",

  discriminators: {
    signatures: [
      {
        planet: "Venus",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
      "neutral",
    ],
  },
},
{
  id: "travel_planning",
  area: "travel",
  label: "Travel planning",
  primaryHouses: [3, 9],
  supportingHouses: [12],
  description:
    "Planning, organising or making practical decisions connected with travel or movement.",

  discriminators: {
    signatures: [
      {
        planet: "Mercury",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
      "neutral",
    ],
  },
},

{
  id: "travel_movement",
  area: "travel",
  label: "Travel or movement",
  primaryHouses: [3, 9],
  supportingHouses: [12],
  description:
    "Travel, movement or a journey may become a more active part of the day.",

  discriminators: {
    signatures: [
      {
        planet: "Mercury",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Mars",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Rahu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
      "neutral",
    ],
  },
},

{
  id: "travel_disruption",
  area: "travel",
  label: "Travel disruption",
  primaryHouses: [3, 9, 12],
  supportingHouses: [6, 8],
  description:
    "Travel or movement may require extra flexibility because of delays, changes or practical complications.",

  discriminators: {
    signatures: [
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Mars",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Rahu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Ketu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "challenging",
      "mixed",
    ],
  },
},

{
  id: "education_focus",
  area: "education",
  label: "Focus on learning",
  primaryHouses: [4, 5, 9],
  supportingHouses: [3],
  description:
    "Study, learning or another educational matter may require greater concentration and attention.",

  discriminators: {
    signatures: [
      {
        planet: "Mercury",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
      "neutral",
      "challenging",
    ],
  },
},

{
  id: "education_progress",
  area: "education",
  label: "Educational progress",
  primaryHouses: [4, 5, 9],
  supportingHouses: [11],
  description:
    "Constructive progress, understanding or achievement may develop through study, learning or education.",

  discriminators: {
    signatures: [
      {
        planet: "Mercury",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
    ],
  },
},

{
  id: "education_challenge",
  area: "education",
  label: "Educational challenge",
  primaryHouses: [4, 5, 9],
  supportingHouses: [6, 8, 12],
  description:
    "Study, learning or an educational matter may require additional patience, effort or adjustment.",

  discriminators: {
    signatures: [
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Mars",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Rahu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "challenging",
      "mixed",
    ],
  },
},

{
  id: "communication_activity",
  area: "communication",
  label: "Active communication",
  primaryHouses: [3],
  supportingHouses: [1, 11],
  description:
    "Conversations, messages, correspondence or exchange of information may become more active.",

  discriminators: {
    signatures: [
      {
        planet: "Mercury",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Moon",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
      "neutral",
      "challenging",
    ],
  },
},

{
  id: "communication_clarity",
  area: "communication",
  label: "Clear communication",
  primaryHouses: [3],
  supportingHouses: [1, 9],
  description:
    "Communication may become clearer or more constructive, helping important information or intentions come across effectively.",

  discriminators: {
    signatures: [
      {
        planet: "Mercury",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
    ],
  },
},

{
  id: "communication_friction",
  area: "communication",
  label: "Communication friction",
  primaryHouses: [3],
  supportingHouses: [6, 8],
  description:
    "Conversations or messages may require extra care because of disagreement, misunderstanding or sharper exchanges.",

  discriminators: {
    signatures: [
      {
        planet: "Mars",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Rahu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "challenging",
      "mixed",
    ],
  },
},
{
  id: "public_image_visibility",
  area: "publicImage",
  label: "Greater visibility",
  primaryHouses: [10],
  supportingHouses: [1, 11],
  description:
    "Your actions, contribution or presence may become more visible to others.",

  discriminators: {
    signatures: [
      {
        planet: "Sun",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Mercury",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Rahu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
      "neutral",
    ],
  },
},

{
  id: "public_image_recognition",
  area: "publicImage",
  label: "Recognition",
  primaryHouses: [10],
  supportingHouses: [1, 9, 11],
  description:
    "Acknowledgement, appreciation or a constructive response to your contribution may become more noticeable.",

  discriminators: {
    signatures: [
      {
        planet: "Sun",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Venus",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
    ],
  },
},

{
  id: "public_image_pressure",
  area: "publicImage",
  label: "Public image pressure",
  primaryHouses: [10],
  supportingHouses: [6, 8],
  description:
    "Greater scrutiny, expectation or sensitivity around reputation and how your actions are perceived may require care.",

  discriminators: {
    signatures: [
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Mars",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Rahu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "challenging",
      "mixed",
    ],
  },
},

{
  id: "hidden_matters_revelation",
  area: "hiddenMatters",
  label: "Hidden matter becoming clearer",
  primaryHouses: [8],
  supportingHouses: [12],
  description:
    "Something previously unclear, private or beneath the surface may become easier to understand.",

  discriminators: {
    signatures: [
      {
        planet: "Mercury",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Ketu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
      "neutral",
    ],
  },
},

{
  id: "hidden_matters_introspection",
  area: "hiddenMatters",
  label: "Deeper introspection",
  primaryHouses: [8, 12],
  supportingHouses: [4],
  description:
    "A deeper private matter, internal pattern or unresolved issue may draw your attention inward.",

  discriminators: {
    signatures: [
      {
        planet: "Ketu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Moon",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "challenging",
      "mixed",
      "neutral",
    ],
  },
},

{
  id: "hidden_matters_complication",
  area: "hiddenMatters",
  label: "Hidden complication",
  primaryHouses: [8, 12],
  supportingHouses: [6],
  description:
    "A private, unresolved or previously overlooked matter may require more careful attention.",

  discriminators: {
    signatures: [
      {
        planet: "Rahu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Mars",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Ketu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "challenging",
      "mixed",
    ],
  },
},

{
  id: "property_attention",
  area: "property",
  label: "Property attention",
  primaryHouses: [4],
  supportingHouses: [2, 8],
  description:
    "A property, housing, ownership or related practical matter may require greater attention.",

  discriminators: {
    signatures: [
      {
        planet: "Mars",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Venus",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "challenging",
      "mixed",
      "neutral",
    ],
  },
},

{
  id: "property_progress",
  area: "property",
  label: "Property progress",
  primaryHouses: [4],
  supportingHouses: [2, 11],
  description:
    "A property or housing matter may move forward constructively or become easier to organise.",

  discriminators: {
    signatures: [
      {
        planet: "Mars",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Venus",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Jupiter",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "supportive",
      "mixed",
    ],
  },
},

{
  id: "property_complication",
  area: "property",
  label: "Property complication",
  primaryHouses: [4],
  supportingHouses: [6, 8, 12],
  description:
    "A property or housing matter may require extra patience because of delays, obligations or practical complications.",

  discriminators: {
    signatures: [
      {
        planet: "Saturn",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Mars",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
      {
        planet: "Rahu",
        sources: [
          "lordship",
          "natal_placement",
          "dispositor",
        ],
      },
    ],
    polarity: [
      "challenging",
      "mixed",
    ],
  },
},
  ];