import type {
  CapabilityOntologyDefinition,
  CapabilityRelationshipDefinition,
} from "./types";

export const CAPABILITY_ONTOLOGY_DEFINITIONS:
  CapabilityOntologyDefinition[] = [
  {
    key: "knowledge",
    label: "Knowledge",
    description:
      "The ability to acquire, organise, retain, explain, and apply structured understanding.",
    category: "cognitive",
    expressions: [
      {
        label: "Consulting",
        description:
          "Applies specialised knowledge to diagnose problems and recommend action.",
        domains: [
          "business",
          "career",
          "wealth",
        ],
        minimumScore: 55,
        supportingCapabilityKeys: [
          "communication",
          "analysis",
          "strategic_thinking",
        ],
      },
      {
        label: "Teaching",
        description:
          "Structures knowledge so that others can understand and use it.",
        domains: [
          "career",
          "education",
          "business",
          "spiritual",
        ],
        minimumScore: 55,
        supportingCapabilityKeys: [
          "communication",
          "empathy",
        ],
      },
      {
        label: "Knowledge Products",
        description:
          "Converts expertise into reports, courses, software, books, or advisory products.",
        domains: [
          "business",
          "wealth",
          "creativity",
        ],
        minimumScore: 60,
        supportingCapabilityKeys: [
          "commerce",
          "communication",
          "innovation",
        ],
      },
    ],
    developmentActions: [
      "Build depth in one field before expanding into adjacent areas.",
      "Convert learning into repeatable frameworks, notes, or teaching material.",
      "Test knowledge through practical application rather than theory alone.",
    ],
    overuseRisks: [
      "Excessive theorising",
      "Intellectual superiority",
      "Giving advice without practical validation",
    ],
    underuseRisks: [
      "Unused expertise",
      "Dependence on external authority",
      "Failure to monetise or communicate knowledge",
    ],
  },
  {
    key: "analysis",
    label: "Analysis",
    description:
      "The ability to separate complex information into meaningful parts and identify the most relevant pattern.",
    category: "cognitive",
    expressions: [
      {
        label: "Diagnostics",
        description:
          "Identifies causes, weaknesses, inconsistencies, and hidden operating problems.",
        domains: [
          "career",
          "business",
          "health",
          "general",
        ],
        minimumScore: 55,
        supportingCapabilityKeys: [
          "research",
          "discipline",
        ],
      },
      {
        label: "Audit and Review",
        description:
          "Tests evidence, controls, processes, and claims for accuracy and reliability.",
        domains: [
          "career",
          "business",
          "wealth",
        ],
        minimumScore: 58,
        supportingCapabilityKeys: [
          "governance",
          "operations",
        ],
      },
      {
        label: "Strategic Diagnosis",
        description:
          "Links evidence to decisions, priorities, and future direction.",
        domains: [
          "business",
          "career",
          "leadership",
        ],
        minimumScore: 60,
        supportingCapabilityKeys: [
          "strategic_thinking",
          "decision_making",
        ],
      },
    ],
    developmentActions: [
      "Separate observation from interpretation.",
      "Use structured comparison and evidence weighting.",
      "Finish analysis with a decision or practical recommendation.",
    ],
    overuseRisks: [
      "Overanalysis",
      "Delayed decisions",
      "Focusing on weaknesses without action",
    ],
    underuseRisks: [
      "Superficial judgement",
      "Repeated mistakes",
      "Failure to identify root causes",
    ],
  },
  {
    key: "research",
    label: "Research",
    description:
      "The ability to investigate deeply, discover hidden patterns, and build specialist understanding.",
    category: "cognitive",
    expressions: [
      {
        label: "Specialist Research",
        description:
          "Develops rare or deep expertise within a focused field.",
        domains: [
          "career",
          "education",
          "business",
        ],
        minimumScore: 55,
        supportingCapabilityKeys: [
          "knowledge",
          "analysis",
        ],
      },
      {
        label: "Occult and Symbolic Inquiry",
        description:
          "Investigates hidden, symbolic, spiritual, psychological, or metaphysical systems.",
        domains: [
          "spiritual",
          "general",
          "education",
        ],
        minimumScore: 58,
        supportingCapabilityKeys: [
          "intuition",
          "mysticism",
        ],
      },
      {
        label: "Technical Investigation",
        description:
          "Examines systems, code, data, or process behaviour to discover hidden causes.",
        domains: [
          "career",
          "business",
          "general",
        ],
        minimumScore: 58,
        supportingCapabilityKeys: [
          "analysis",
          "innovation",
          "discipline",
        ],
      },
    ],
    developmentActions: [
      "Choose a clear research question before collecting information.",
      "Document methods, evidence, and conclusions.",
      "Translate findings into usable insight.",
    ],
    overuseRisks: [
      "Isolation",
      "Endless investigation",
      "Difficulty communicating findings",
    ],
    underuseRisks: [
      "Shallow expertise",
      "Reliance on assumptions",
      "Missed hidden opportunities",
    ],
  },
  {
    key: "strategic_thinking",
    label: "Strategic Thinking",
    description:
      "The ability to understand the wider system, anticipate consequences, and sequence action toward a larger objective.",
    category: "cognitive",
    expressions: [
      {
        label: "Business Strategy",
        description:
          "Defines positioning, priorities, resource allocation, and competitive direction.",
        domains: [
          "business",
          "leadership",
          "wealth",
        ],
        minimumScore: 58,
        supportingCapabilityKeys: [
          "analysis",
          "decision_making",
          "commerce",
        ],
      },
      {
        label: "Career Strategy",
        description:
          "Aligns skill development, visibility, role choices, and timing with long-term professional goals.",
        domains: [
          "career",
          "leadership",
        ],
        minimumScore: 55,
        supportingCapabilityKeys: [
          "knowledge",
          "decision_making",
        ],
      },
      {
        label: "Life Planning",
        description:
          "Connects present choices with longer-term purpose, risk, and growth.",
        domains: [
          "general",
          "wealth",
          "relationships",
          "spiritual",
        ],
        minimumScore: 55,
        supportingCapabilityKeys: [
          "responsibility",
          "dharma",
        ],
      },
    ],
    developmentActions: [
      "Define the objective before selecting tactics.",
      "Separate urgent activity from high-value activity.",
      "Review assumptions and second-order consequences.",
    ],
    overuseRisks: [
      "Excessive planning",
      "Manipulation",
      "Detachment from execution",
    ],
    underuseRisks: [
      "Reactive decisions",
      "Scattered effort",
      "Short-term thinking",
    ],
  },
  {
    key: "leadership",
    label: "Leadership",
    description:
      "The ability to provide direction, influence others, accept responsibility, and coordinate effort toward an outcome.",
    category: "leadership",
    expressions: [
      {
        label: "Team Leadership",
        description:
          "Aligns people, clarifies priorities, and creates accountability.",
        domains: [
          "career",
          "business",
          "leadership",
        ],
        minimumScore: 55,
        supportingCapabilityKeys: [
          "communication",
          "responsibility",
          "empathy",
        ],
      },
      {
        label: "Thought Leadership",
        description:
          "Influences others through ideas, expertise, frameworks, and public guidance.",
        domains: [
          "career",
          "business",
          "education",
          "spiritual",
        ],
        minimumScore: 58,
        supportingCapabilityKeys: [
          "knowledge",
          "communication",
          "teaching",
        ],
      },
      {
        label: "Institutional Leadership",
        description:
          "Leads within regulated, complex, or high-responsibility systems.",
        domains: [
          "career",
          "leadership",
          "business",
        ],
        minimumScore: 60,
        supportingCapabilityKeys: [
          "authority",
          "governance",
          "operations",
        ],
      },
    ],
    developmentActions: [
      "Make expectations and decision rights explicit.",
      "Balance direction with listening.",
      "Develop successors instead of centralising every decision.",
    ],
    overuseRisks: [
      "Domination",
      "Status dependence",
      "Excessive control",
    ],
    underuseRisks: [
      "Avoidance of responsibility",
      "Weak direction",
      "Unclear accountability",
    ],
  },
  {
    key: "communication",
    label: "Communication",
    description:
      "The ability to express, explain, listen, adapt messages, and create mutual understanding.",
    category: "creative",
    expressions: [
      {
        label: "Professional Communication",
        description:
          "Explains ideas, decisions, evidence, and expectations clearly in work settings.",
        domains: [
          "career",
          "business",
          "leadership",
        ],
        minimumScore: 50,
        supportingCapabilityKeys: [
          "knowledge",
          "strategic_thinking",
        ],
      },
      {
        label: "Public Communication",
        description:
          "Presents ideas to larger audiences through speaking, media, or publishing.",
        domains: [
          "career",
          "business",
          "creativity",
          "education",
        ],
        minimumScore: 58,
        supportingCapabilityKeys: [
          "storytelling",
          "media",
          "leadership",
        ],
      },
      {
        label: "Relationship Communication",
        description:
          "Expresses needs, listens, and resolves misunderstanding in personal relationships.",
        domains: [
          "relationships",
          "general",
        ],
        minimumScore: 50,
        supportingCapabilityKeys: [
          "empathy",
          "relationships",
        ],
      },
    ],
    developmentActions: [
      "Match the message to the listener's context.",
      "Distinguish facts, interpretation, and request.",
      "Confirm understanding before assuming agreement.",
    ],
    overuseRisks: [
      "Overexplaining",
      "Talking without listening",
      "Using communication to avoid action",
    ],
    underuseRisks: [
      "Misunderstanding",
      "Unexpressed needs",
      "Weak visibility",
    ],
  },
  {
    key: "execution",
    label: "Execution",
    description:
      "The ability to convert intention into practical action and completed outcomes.",
    category: "execution",
    expressions: [
      {
        label: "Project Delivery",
        description:
          "Moves work from plan to completion through ownership, sequencing, and follow-through.",
        domains: [
          "career",
          "business",
          "leadership",
        ],
        minimumScore: 55,
        supportingCapabilityKeys: [
          "operations",
          "discipline",
          "decision_making",
        ],
      },
      {
        label: "Entrepreneurial Action",
        description:
          "Tests ideas, enters markets, and creates momentum under uncertainty.",
        domains: [
          "business",
          "wealth",
        ],
        minimumScore: 58,
        supportingCapabilityKeys: [
          "initiative",
          "entrepreneurship",
          "commerce",
        ],
      },
      {
        label: "Personal Implementation",
        description:
          "Turns goals, routines, and intentions into consistent behaviour.",
        domains: [
          "general",
          "health",
          "spiritual",
        ],
        minimumScore: 50,
        supportingCapabilityKeys: [
          "discipline",
          "endurance",
        ],
      },
    ],
    developmentActions: [
      "Break outcomes into visible next actions.",
      "Define completion criteria.",
      "Review blockers without abandoning momentum.",
    ],
    overuseRisks: [
      "Action without reflection",
      "Burnout",
      "Forcing progress before conditions are ready",
    ],
    underuseRisks: [
      "Unfinished plans",
      "Low confidence",
      "Missed opportunities",
    ],
  },
  {
    key: "commerce",
    label: "Commerce",
    description:
      "The ability to identify value, understand exchange, and convert usefulness into sustainable revenue.",
    category: "commercial",
    expressions: [
      {
        label: "Advisory Commerce",
        description:
          "Monetises expertise through consulting, guidance, or professional services.",
        domains: [
          "business",
          "wealth",
          "career",
        ],
        minimumScore: 55,
        supportingCapabilityKeys: [
          "knowledge",
          "communication",
          "negotiation",
        ],
      },
      {
        label: "Product Commerce",
        description:
          "Creates, positions, and sells products or repeatable services.",
        domains: [
          "business",
          "wealth",
        ],
        minimumScore: 58,
        supportingCapabilityKeys: [
          "customer_understanding",
          "sales",
          "operations",
        ],
      },
      {
        label: "Digital Commerce",
        description:
          "Uses platforms, software, media, or networks to deliver and scale value.",
        domains: [
          "business",
          "wealth",
          "creativity",
        ],
        minimumScore: 60,
        supportingCapabilityKeys: [
          "innovation",
          "scale",
          "media",
        ],
      },
    ],
    developmentActions: [
      "Define the customer problem before refining the offer.",
      "Test willingness to pay rather than relying on interest alone.",
      "Protect margins, cash flow, and delivery quality.",
    ],
    overuseRisks: [
      "Over-commercialisation",
      "Short-term profit focus",
      "Compromising trust for conversion",
    ],
    underuseRisks: [
      "Undervaluing expertise",
      "Weak pricing",
      "Failure to convert value into income",
    ],
  },
  {
    key: "customer_understanding",
    label: "Customer Understanding",
    description:
      "The ability to recognise needs, emotion, trust, behaviour, and perceived value in others.",
    category: "commercial",
    expressions: [
      {
        label: "Customer Experience",
        description:
          "Designs service journeys that feel clear, responsive, and trustworthy.",
        domains: [
          "business",
          "career",
        ],
        minimumScore: 55,
        supportingCapabilityKeys: [
          "empathy",
          "communication",
          "operations",
        ],
      },
      {
        label: "Market Insight",
        description:
          "Identifies customer segments, motivations, objections, and unmet needs.",
        domains: [
          "business",
          "wealth",
        ],
        minimumScore: 55,
        supportingCapabilityKeys: [
          "analysis",
          "research",
          "commerce",
        ],
      },
      {
        label: "Relationship Sensitivity",
        description:
          "Recognises emotional needs and adapts behaviour without losing boundaries.",
        domains: [
          "relationships",
          "general",
        ],
        minimumScore: 50,
        supportingCapabilityKeys: [
          "empathy",
          "relationships",
        ],
      },
    ],
    developmentActions: [
      "Observe behaviour rather than relying only on stated preference.",
      "Ask direct questions about needs and friction.",
      "Balance responsiveness with clear boundaries.",
    ],
    overuseRisks: [
      "People pleasing",
      "Excessive adaptation",
      "Confusing attention with loyalty",
    ],
    underuseRisks: [
      "Poor product-market fit",
      "Weak relationships",
      "Misreading emotional expectations",
    ],
  },
  {
    key: "entrepreneurship",
    label: "Entrepreneurship",
    description:
      "The ability to identify opportunity, assume calculated risk, organise resources, and build independent value.",
    category: "commercial",
    expressions: [
      {
        label: "Founder Capability",
        description:
          "Creates and leads a new venture from idea through early market validation.",
        domains: [
          "business",
          "wealth",
          "leadership",
        ],
        minimumScore: 58,
        supportingCapabilityKeys: [
          "initiative",
          "commerce",
          "execution",
          "strategic_thinking",
        ],
      },
      {
        label: "Independent Professional",
        description:
          "Builds income through personal expertise, reputation, and client relationships.",
        domains: [
          "business",
          "career",
          "wealth",
        ],
        minimumScore: 55,
        supportingCapabilityKeys: [
          "knowledge",
          "communication",
          "sales",
        ],
      },
      {
        label: "Venture Builder",
        description:
          "Creates repeatable systems, teams, or platforms that can grow beyond the founder.",
        domains: [
          "business",
          "wealth",
          "leadership",
        ],
        minimumScore: 65,
        supportingCapabilityKeys: [
          "scale",
          "operations",
          "leadership",
          "innovation",
        ],
      },
    ],
    developmentActions: [
      "Validate demand before making large commitments.",
      "Separate founder energy from repeatable operating systems.",
      "Use staged risk instead of all-or-nothing decisions.",
    ],
    overuseRisks: [
      "Overreach",
      "Impulsive investment",
      "Founder control becoming a bottleneck",
    ],
    underuseRisks: [
      "Dependence on fixed structures",
      "Unused commercial potential",
      "Avoidance of calculated risk",
    ],
  },
  {
    key: "relationships",
    label: "Relationships",
    description:
      "The ability to form, sustain, understand, and repair interpersonal bonds.",
    category: "human",
    expressions: [
      {
        label: "Partnership",
        description:
          "Builds mutuality, trust, responsibility, and shared decision-making.",
        domains: [
          "relationships",
          "business",
          "general",
        ],
        minimumScore: 52,
        supportingCapabilityKeys: [
          "communication",
          "empathy",
          "responsibility",
        ],
      },
      {
        label: "Collaboration",
        description:
          "Works productively with others while balancing individual and shared goals.",
        domains: [
          "career",
          "business",
          "leadership",
        ],
        minimumScore: 52,
        supportingCapabilityKeys: [
          "communication",
          "negotiation",
          "empathy",
        ],
      },
      {
        label: "Supportive Bonding",
        description:
          "Creates emotional safety, care, loyalty, and sustained presence.",
        domains: [
          "relationships",
          "health",
          "general",
        ],
        minimumScore: 50,
        supportingCapabilityKeys: [
          "empathy",
          "healing",
        ],
      },
    ],
    developmentActions: [
      "Make expectations explicit.",
      "Balance care with boundaries.",
      "Repair misunderstandings before resentment becomes fixed.",
    ],
    overuseRisks: [
      "Dependency",
      "Loss of boundaries",
      "Avoiding necessary conflict",
    ],
    underuseRisks: [
      "Isolation",
      "Weak support systems",
      "Difficulty sustaining trust",
    ],
  },
  {
    key: "intuition",
    label: "Intuition",
    description:
      "The ability to perceive subtle patterns, emotional signals, and non-linear connections.",
    category: "spiritual",
    expressions: [
      {
        label: "Pattern Intuition",
        description:
          "Recognises meaningful patterns before they are fully explained analytically.",
        domains: [
          "general",
          "career",
          "business",
          "spiritual",
        ],
        minimumScore: 55,
        supportingCapabilityKeys: [
          "analysis",
          "research",
        ],
      },
      {
        label: "Emotional Intuition",
        description:
          "Perceives mood, trust, tension, and emotional shifts in people.",
        domains: [
          "relationships",
          "health",
          "general",
        ],
        minimumScore: 52,
        supportingCapabilityKeys: [
          "empathy",
          "customer_understanding",
        ],
      },
      {
        label: "Spiritual Intuition",
        description:
          "Perceives symbolic, contemplative, or subtle spiritual meaning.",
        domains: [
          "spiritual",
          "general",
        ],
        minimumScore: 58,
        supportingCapabilityKeys: [
          "mysticism",
          "dharma",
          "detachment",
        ],
      },
    ],
    developmentActions: [
      "Test intuition against evidence and outcomes.",
      "Distinguish calm perception from anxiety or wishful thinking.",
      "Record patterns before drawing conclusions.",
    ],
    overuseRisks: [
      "Projection",
      "Magical thinking",
      "Avoiding evidence",
    ],
    underuseRisks: [
      "Ignoring subtle warning signs",
      "Overdependence on logic",
      "Difficulty integrating emotional information",
    ],
  },
  {
    key: "dharma",
    label: "Dharma",
    description:
      "The ability to orient choices around purpose, ethics, responsibility, and meaningful contribution.",
    category: "spiritual",
    expressions: [
      {
        label: "Purpose-Led Work",
        description:
          "Aligns professional or business activity with meaningful contribution.",
        domains: [
          "career",
          "business",
          "spiritual",
          "general",
        ],
        minimumScore: 55,
        supportingCapabilityKeys: [
          "knowledge",
          "leadership",
          "responsibility",
        ],
      },
      {
        label: "Ethical Judgement",
        description:
          "Balances opportunity with fairness, consequence, and responsibility.",
        domains: [
          "leadership",
          "business",
          "career",
          "wealth",
        ],
        minimumScore: 55,
        supportingCapabilityKeys: [
          "governance",
          "decision_making",
        ],
      },
      {
        label: "Spiritual Direction",
        description:
          "Uses philosophy, reflection, or faith to orient life choices.",
        domains: [
          "spiritual",
          "general",
          "relationships",
        ],
        minimumScore: 55,
        supportingCapabilityKeys: [
          "mysticism",
          "intuition",
          "detachment",
        ],
      },
    ],
    developmentActions: [
      "Define what meaningful contribution looks like in practical terms.",
      "Review whether methods are consistent with stated values.",
      "Balance duty with sustainable personal boundaries.",
    ],
    overuseRisks: [
      "Moral superiority",
      "Rigid idealism",
      "Neglect of practical needs",
    ],
    underuseRisks: [
      "Meaninglessness",
      "Ethical compromise",
      "Long-term regret",
    ],
  },

  {
    key: "teaching",
    label: "Teaching",
    description:
      "The ability to structure understanding and help others learn, apply, and grow.",
    category: "human",
    expressions: [
      {
        label: "Formal Teaching",
        description:
          "Delivers structured learning through classes, courses, or programmes.",
        domains: ["career", "education", "business"],
        minimumScore: 55,
        supportingCapabilityKeys: ["knowledge", "communication"],
      },
      {
        label: "Advisory Teaching",
        description:
          "Teaches through consulting, mentoring, explanation, or practical guidance.",
        domains: ["business", "career", "spiritual"],
        minimumScore: 52,
        supportingCapabilityKeys: ["knowledge", "mentoring"],
      },
    ],
    developmentActions: [
      "Structure learning outcomes before presenting material.",
      "Use examples, feedback, and repetition.",
    ],
    overuseRisks: ["Preaching", "Overexplaining"],
    underuseRisks: ["Unused expertise", "Weak knowledge transfer"],
  },
  {
    key: "mentoring",
    label: "Mentoring",
    description:
      "The ability to guide development through experience, judgement, encouragement, and practical advice.",
    category: "human",
    expressions: [
      {
        label: "Professional Mentoring",
        description:
          "Supports another person's growth in work, leadership, or expertise.",
        domains: ["career", "leadership", "business"],
        minimumScore: 52,
        supportingCapabilityKeys: ["knowledge", "empathy", "communication"],
      },
      {
        label: "Personal Guidance",
        description:
          "Offers grounded support during life, relationship, or spiritual development.",
        domains: ["relationships", "spiritual", "general"],
        minimumScore: 52,
        supportingCapabilityKeys: ["empathy", "dharma"],
      },
    ],
    developmentActions: [
      "Guide without taking over another person's decisions.",
      "Combine encouragement with practical accountability.",
    ],
    overuseRisks: ["Preaching", "Dependency creation"],
    underuseRisks: ["Withholding useful guidance", "Low developmental impact"],
  },
  {
    key: "scale",
    label: "Scale",
    description:
      "The ability to expand reach, impact, capacity, or delivery beyond an individual effort.",
    category: "commercial",
    expressions: [
      {
        label: "Operational Scale",
        description:
          "Expands output through systems, teams, processes, and repeatability.",
        domains: ["business", "career", "leadership"],
        minimumScore: 58,
        supportingCapabilityKeys: ["operations", "leadership"],
      },
      {
        label: "Digital Scale",
        description:
          "Expands reach through software, media, platforms, or networks.",
        domains: ["business", "wealth", "creativity"],
        minimumScore: 58,
        supportingCapabilityKeys: ["innovation", "media", "communication"],
      },
    ],
    developmentActions: [
      "Standardise delivery before increasing volume.",
      "Separate founder-dependent work from repeatable systems.",
    ],
    overuseRisks: ["Overreach", "Loss of quality"],
    underuseRisks: ["Growth bottlenecks", "Excessive dependence on personal effort"],
  },
  {
    key: "mysticism",
    label: "Mysticism",
    description:
      "The ability to engage with symbolic, contemplative, occult, or spiritual systems in a structured way.",
    category: "spiritual",
    expressions: [
      {
        label: "Occult Study",
        description:
          "Studies hidden, symbolic, astrological, or metaphysical systems.",
        domains: ["spiritual", "education", "career", "business"],
        minimumScore: 55,
        supportingCapabilityKeys: ["research", "intuition", "analysis"],
      },
      {
        label: "Contemplative Insight",
        description:
          "Uses reflection, meditation, or symbolism to deepen understanding.",
        domains: ["spiritual", "general"],
        minimumScore: 55,
        supportingCapabilityKeys: ["intuition", "detachment", "dharma"],
      },
    ],
    developmentActions: [
      "Ground symbolic insight in disciplined study.",
      "Distinguish spiritual intuition from projection.",
    ],
    overuseRisks: ["Escapism", "Dogmatism"],
    underuseRisks: ["Ignoring symbolic insight", "Shallow spiritual understanding"],
  },
  {
  key: "operations",
  label: "Operations",
  description:
    "The ability to organise people, processes, resources, and repeatable delivery systems.",
  category: "execution",

  expressions: [
    {
      label: "Operational Management",
      description:
        "Coordinates workflows, resources, responsibilities, and service delivery.",
      domains: [
        "career",
        "business",
        "leadership",
      ],
      minimumScore: 52,
      supportingCapabilityKeys: [
        "execution",
        "discipline",
        "responsibility",
      ],
    },
    {
      label: "Process Design",
      description:
        "Creates repeatable processes that improve consistency, control, and efficiency.",
      domains: [
        "career",
        "business",
      ],
      minimumScore: 55,
      supportingCapabilityKeys: [
        "analysis",
        "governance",
        "strategic_thinking",
      ],
    },
    {
      label: "Scalable Delivery",
      description:
        "Builds operating systems that support larger volume without losing quality.",
      domains: [
        "business",
        "leadership",
        "wealth",
      ],
      minimumScore: 58,
      supportingCapabilityKeys: [
        "scale",
        "execution",
        "leadership",
      ],
    },
  ],

  developmentActions: [
    "Document repeatable processes and ownership.",
    "Measure quality, capacity, and operating bottlenecks.",
    "Separate urgent activity from system improvement.",
  ],

  overuseRisks: [
    "Excessive control",
    "Bureaucracy",
    "Prioritising process over purpose",
  ],

  underuseRisks: [
    "Inconsistent delivery",
    "Founder dependency",
    "Repeated operational errors",
  ],
},
{
  key: "empathy",
  label: "Empathy",
  description:
    "The ability to recognise another person's emotional experience and respond with appropriate understanding.",
  category: "human",

  expressions: [
    {
      label: "Emotional Understanding",
      description:
        "Recognises feelings, needs, sensitivities, and emotional context.",
      domains: [
        "relationships",
        "health",
        "general",
      ],
      minimumScore: 48,
      supportingCapabilityKeys: [
        "relationships",
        "communication",
      ],
    },
    {
      label: "Client Empathy",
      description:
        "Understands customer concerns and adapts service without losing boundaries.",
      domains: [
        "business",
        "career",
      ],
      minimumScore: 50,
      supportingCapabilityKeys: [
        "customer_understanding",
        "communication",
      ],
    },
    {
      label: "Supportive Guidance",
      description:
        "Combines understanding with practical support and encouragement.",
      domains: [
        "relationships",
        "career",
        "spiritual",
        "health",
      ],
      minimumScore: 52,
      supportingCapabilityKeys: [
        "mentoring",
        "healing",
        "communication",
      ],
    },
  ],

  developmentActions: [
    "Listen before interpreting or advising.",
    "Distinguish empathy from agreement.",
    "Maintain boundaries while remaining emotionally responsive.",
  ],

  overuseRisks: [
    "Emotional absorption",
    "Weak boundaries",
    "People pleasing",
  ],

  underuseRisks: [
    "Emotional distance",
    "Poor relationship repair",
    "Misreading customer or team needs",
  ],
},
{
  key: "innovation",
  label: "Innovation",
  description:
    "The ability to create new approaches, tools, systems, or combinations that solve problems differently.",
  category: "cognitive",

  expressions: [
    {
      label: "Product Innovation",
      description:
        "Creates new or meaningfully improved products and services.",
      domains: [
        "business",
        "wealth",
        "creativity",
      ],
      minimumScore: 55,
      supportingCapabilityKeys: [
        "research",
        "customer_understanding",
        "commerce",
      ],
    },
    {
      label: "Technical Innovation",
      description:
        "Uses technology, software, or systems thinking to improve capability.",
      domains: [
        "career",
        "business",
        "education",
      ],
      minimumScore: 55,
      supportingCapabilityKeys: [
        "analysis",
        "learning",
        "execution",
      ],
    },
    {
      label: "Process Innovation",
      description:
        "Improves how work is organised, delivered, or scaled.",
      domains: [
        "career",
        "business",
        "leadership",
      ],
      minimumScore: 52,
      supportingCapabilityKeys: [
        "operations",
        "strategic_thinking",
      ],
    },
  ],

  developmentActions: [
    "Begin with a real problem rather than novelty alone.",
    "Prototype before making large commitments.",
    "Combine experimentation with operating discipline.",
  ],

  overuseRisks: [
    "Constant disruption",
    "Unproven complexity",
    "Abandoning useful systems too early",
  ],

  underuseRisks: [
    "Obsolescence",
    "Rigid thinking",
    "Missed technical opportunities",
  ],
},
{
  key: "governance",
  label: "Governance",
  description:
    "The ability to establish standards, accountability, controls, and responsible institutional decision-making.",
  category: "leadership",

  expressions: [
    {
      label: "Corporate Governance",
      description:
        "Creates accountability, oversight, policy, and decision controls.",
      domains: [
        "career",
        "business",
        "leadership",
      ],
      minimumScore: 55,
      supportingCapabilityKeys: [
        "responsibility",
        "authority",
        "strategic_thinking",
      ],
    },
    {
      label: "Risk and Compliance",
      description:
        "Maintains standards, controls exposure, and supports regulatory discipline.",
      domains: [
        "career",
        "business",
        "wealth",
      ],
      minimumScore: 55,
      supportingCapabilityKeys: [
        "analysis",
        "discipline",
        "operations",
      ],
    },
    {
      label: "Ethical Oversight",
      description:
        "Balances authority and opportunity with fairness, duty, and consequence.",
      domains: [
        "leadership",
        "business",
        "spiritual",
      ],
      minimumScore: 55,
      supportingCapabilityKeys: [
        "dharma",
        "responsibility",
        "decision_making",
      ],
    },
  ],

  developmentActions: [
    "Define ownership and decision rights clearly.",
    "Build controls proportional to actual risk.",
    "Review whether standards are producing the intended outcome.",
  ],

  overuseRisks: [
    "Bureaucracy",
    "Rigidity",
    "Control without trust",
  ],

  underuseRisks: [
    "Unclear accountability",
    "Compliance failures",
    "Unmanaged institutional risk",
  ],
},
{
  key: "responsibility",
  label: "Responsibility",
  description:
    "The ability to accept duty, remain accountable, and sustain commitments over time.",
  category: "leadership",

  expressions: [
    {
      label: "Professional Accountability",
      description:
        "Accepts ownership for decisions, delivery, and consequences.",
      domains: [
        "career",
        "business",
        "leadership",
      ],
      minimumScore: 50,
      supportingCapabilityKeys: [
        "discipline",
        "execution",
      ],
    },
    {
      label: "Relationship Responsibility",
      description:
        "Maintains dependability, honesty, and shared obligations in close bonds.",
      domains: [
        "relationships",
        "general",
      ],
      minimumScore: 50,
      supportingCapabilityKeys: [
        "relationships",
        "empathy",
        "communication",
      ],
    },
    {
      label: "Institutional Duty",
      description:
        "Carries long-term responsibility within organisations and regulated systems.",
      domains: [
        "career",
        "leadership",
        "business",
      ],
      minimumScore: 55,
      supportingCapabilityKeys: [
        "governance",
        "authority",
        "operations",
      ],
    },
  ],

  developmentActions: [
    "Make commitments explicit and measurable.",
    "Communicate risks before commitments fail.",
    "Balance duty with sustainable boundaries.",
  ],

  overuseRisks: [
    "Carrying every burden personally",
    "Harsh self-judgement",
    "Difficulty delegating",
  ],

  underuseRisks: [
    "Unreliability",
    "Avoidance of consequences",
    "Weak long-term trust",
  ],
},
{
  key: "decision_making",
  label: "Decision Making",
  description:
    "The ability to evaluate options, manage uncertainty, commit, and act with appropriate judgement.",
  category: "leadership",

  expressions: [
    {
      label: "Strategic Decisions",
      description:
        "Selects priorities and direction based on evidence and long-term consequences.",
      domains: [
        "business",
        "career",
        "leadership",
      ],
      minimumScore: 52,
      supportingCapabilityKeys: [
        "analysis",
        "strategic_thinking",
      ],
    },
    {
      label: "Operational Decisions",
      description:
        "Makes timely practical choices during execution and delivery.",
      domains: [
        "career",
        "business",
      ],
      minimumScore: 50,
      supportingCapabilityKeys: [
        "execution",
        "operations",
      ],
    },
    {
      label: "Personal Judgement",
      description:
        "Balances logic, values, timing, and consequence in personal choices.",
      domains: [
        "general",
        "relationships",
        "wealth",
        "health",
      ],
      minimumScore: 50,
      supportingCapabilityKeys: [
        "dharma",
        "responsibility",
        "intuition",
      ],
    },
  ],

  developmentActions: [
    "Define the decision and available choices clearly.",
    "Separate reversible from irreversible decisions.",
    "Set a decision deadline when more analysis has little value.",
  ],

  overuseRisks: [
    "Premature certainty",
    "Control",
    "Ignoring new evidence",
  ],

  underuseRisks: [
    "Indecision",
    "Lost opportunities",
    "Dependence on others for direction",
  ],
},
];

export const CAPABILITY_RELATIONSHIP_DEFINITIONS:
  CapabilityRelationshipDefinition[] = [
  {
    key: "teaching_expression",
    label: "Teaching Expression",
    sourceCapabilityKeys: [
      "knowledge",
      "communication",
    ],
    resultCapabilityKey: "teaching",
    kind: "converts_into",
    minimumSourceScore: 55,
    minimumConfidence: 60,
    scoreBonus: 8,
    domains: [
      "career",
      "education",
      "business",
      "spiritual",
    ],
    description:
      "Knowledge becomes teachable when it is supported by clear communication.",
  },
  {
    key: "research_expression",
    label: "Research Expression",
    sourceCapabilityKeys: [
      "knowledge",
      "analysis",
    ],
    resultCapabilityKey: "research",
    kind: "converts_into",
    minimumSourceScore: 55,
    minimumConfidence: 60,
    scoreBonus: 8,
    domains: [
      "career",
      "education",
      "business",
      "spiritual",
    ],
    description:
      "Knowledge becomes research capability when analytical depth is also present.",
  },
  {
    key: "management_expression",
    label: "Management Expression",
    sourceCapabilityKeys: [
      "leadership",
      "execution",
      "operations",
    ],
    resultCapabilityKey: "leadership",
    kind: "specialises",
    minimumSourceScore: 52,
    minimumConfidence: 60,
    scoreBonus: 7,
    domains: [
      "career",
      "business",
      "leadership",
    ],
    description:
      "Leadership becomes practical management when execution and operations are strong enough to support it.",
  },
  {
    key: "counselling_expression",
    label: "Counselling Expression",
    sourceCapabilityKeys: [
      "communication",
      "empathy",
      "knowledge",
    ],
    resultCapabilityKey: "mentoring",
    kind: "converts_into",
    minimumSourceScore: 52,
    minimumConfidence: 60,
    scoreBonus: 7,
    domains: [
      "career",
      "relationships",
      "health",
      "spiritual",
    ],
    description:
      "Communication and empathy convert knowledge into supportive guidance.",
  },
  {
    key: "astrology_expression",
    label: "Astrology Expression",
    sourceCapabilityKeys: [
      "research",
      "intuition",
      "mysticism",
      "analysis",
    ],
    resultCapabilityKey: "mysticism",
    kind: "specialises",
    minimumSourceScore: 52,
    minimumConfidence: 60,
    scoreBonus: 8,
    domains: [
      "spiritual",
      "business",
      "career",
      "education",
    ],
    description:
      "Research, intuition, mystical understanding, and analysis combine into structured astrological capability.",
  },
  {
    key: "entrepreneurial_knowledge_expression",
    label: "Knowledge Entrepreneurship",
    sourceCapabilityKeys: [
      "knowledge",
      "commerce",
      "entrepreneurship",
      "communication",
    ],
    resultCapabilityKey: "entrepreneurship",
    kind: "specialises",
    minimumSourceScore: 55,
    minimumConfidence: 60,
    scoreBonus: 9,
    domains: [
      "business",
      "wealth",
      "career",
    ],
    description:
      "Knowledge becomes an independent commercial model when commerce, communication, and entrepreneurial action are present.",
  },
  {
    key: "digital_scale_expression",
    label: "Digital Scale",
    sourceCapabilityKeys: [
      "innovation",
      "scale",
      "communication",
      "operations",
    ],
    resultCapabilityKey: "scale",
    kind: "specialises",
    minimumSourceScore: 52,
    minimumConfidence: 60,
    scoreBonus: 8,
    domains: [
      "business",
      "wealth",
      "career",
      "creativity",
    ],
    description:
      "Innovation becomes scalable when communication reach and operating discipline support it.",
  },
  {
    key: "ethical_leadership_expression",
    label: "Ethical Leadership",
    sourceCapabilityKeys: [
      "leadership",
      "dharma",
      "governance",
      "responsibility",
    ],
    resultCapabilityKey: "leadership",
    kind: "balances",
    minimumSourceScore: 55,
    minimumConfidence: 60,
    scoreBonus: 8,
    domains: [
      "leadership",
      "career",
      "business",
      "spiritual",
    ],
    description:
      "Leadership becomes more trustworthy and sustainable when guided by dharma, governance, and responsibility.",
  },
];
