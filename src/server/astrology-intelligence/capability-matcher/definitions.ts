import type {
  TargetProfile,
} from "./types";

export const TARGET_PROFILES:
  TargetProfile[] = [
  {
    key: "software_engineer",
    label: "Software Engineer",
    description:
      "Builds, tests, improves, and maintains software systems using logic, technical learning, and disciplined execution.",
    kind: "career",
    domains: [
      "career",
      "education",
      "general",
    ],
    requirements: [
      {
        capabilityKey: "analysis",
        weight: 1,
        minimumScore: 58,
        required: true,
        reason:
          "Software engineering requires structured problem decomposition and logical diagnosis.",
      },
      {
        capabilityKey: "learning",
        weight: 0.9,
        minimumScore: 55,
        required: true,
        reason:
          "Technical tools, languages, and systems require continuous learning.",
      },
      {
        capabilityKey: "execution",
        weight: 0.9,
        minimumScore: 55,
        required: true,
        reason:
          "Technical ability must convert into working, tested output.",
      },
      {
        capabilityKey: "discipline",
        weight: 0.8,
        minimumScore: 52,
        required: true,
        reason:
          "Debugging, testing, and maintenance require consistency and patience.",
      },
      {
        capabilityKey: "innovation",
        weight: 0.7,
        minimumScore: 48,
        required: false,
        reason:
          "Innovation improves architecture, automation, and solution quality.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "research",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Research supports specialist, platform, AI, and systems work.",
      },
      {
        capabilityKey: "communication",
        weight: 0.4,
        minimumScore: 45,
        required: false,
        reason:
          "Communication improves collaboration and technical explanation.",
      },
    ],
    constraints: [
      {
        capabilityKey: "analysis",
        minimumStabilityScore: 45,
        reason:
          "Strong analysis should remain sufficiently stable under pressure.",
      },
    ],
    practicalExpressions: [
      "Application development",
      "Platform engineering",
      "Systems architecture",
      "Data engineering",
      "AI and automation",
    ],
    cautions: [
      "Avoid choosing software only for income if sustained technical learning feels unnatural.",
      "Strong analysis without execution can produce endless design without delivery.",
    ],
  },
  {
    key: "consultant",
    label: "Consultant",
    description:
      "Diagnoses problems, structures insight, communicates recommendations, and guides clients toward action.",
    kind: "career",
    domains: [
      "career",
      "business",
      "wealth",
    ],
    requirements: [
      {
        capabilityKey: "knowledge",
        weight: 1,
        minimumScore: 58,
        required: true,
        reason:
          "Consulting requires credible subject expertise.",
      },
      {
        capabilityKey: "analysis",
        weight: 0.9,
        minimumScore: 55,
        required: true,
        reason:
          "Consultants must distinguish symptoms from root causes.",
      },
      {
        capabilityKey: "communication",
        weight: 0.9,
        minimumScore: 55,
        required: true,
        reason:
          "Recommendations must be understood and accepted.",
      },
      {
        capabilityKey: "strategic_thinking",
        weight: 0.8,
        minimumScore: 52,
        required: true,
        reason:
          "Advice must connect evidence with priorities and consequences.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "negotiation",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Negotiation supports stakeholder alignment and commercial closure.",
      },
      {
        capabilityKey: "teaching",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Teaching helps clients understand and adopt recommendations.",
      },
    ],
    constraints: [
      {
        capabilityKey: "knowledge",
        minimumStabilityScore: 50,
        reason:
          "Expertise must remain reliable rather than purely theoretical.",
      },
    ],
    practicalExpressions: [
      "Management consulting",
      "Technology consulting",
      "Financial advisory",
      "Strategy consulting",
      "Independent specialist advisory",
    ],
    cautions: [
      "Avoid advice without implementation awareness.",
      "Do not confuse confidence with evidence.",
    ],
  },
  {
    key: "teacher",
    label: "Teacher",
    description:
      "Structures knowledge, understands learners, communicates clearly, and supports development over time.",
    kind: "career",
    domains: [
      "career",
      "education",
      "spiritual",
    ],
    requirements: [
      {
        capabilityKey: "knowledge",
        weight: 1,
        minimumScore: 55,
        required: true,
        reason:
          "Teaching requires sufficient command of the subject.",
      },
      {
        capabilityKey: "communication",
        weight: 1,
        minimumScore: 55,
        required: true,
        reason:
          "Knowledge must be translated into understandable form.",
      },
      {
        capabilityKey: "teaching",
        weight: 1,
        minimumScore: 55,
        required: true,
        reason:
          "Teaching capability reflects the ability to structure learning.",
      },
      {
        capabilityKey: "empathy",
        weight: 0.7,
        minimumScore: 48,
        required: true,
        reason:
          "Learners need adjustment, patience, and emotional understanding.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "storytelling",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Storytelling improves engagement and memory.",
      },
      {
        capabilityKey: "leadership",
        weight: 0.4,
        minimumScore: 45,
        required: false,
        reason:
          "Leadership supports classroom direction and academic responsibility.",
      },
    ],
    constraints: [],
    practicalExpressions: [
      "School or university teaching",
      "Corporate training",
      "Online education",
      "Spiritual instruction",
      "Course creation",
    ],
    cautions: [
      "Avoid preaching or overexplaining.",
      "Subject expertise alone does not guarantee learner understanding.",
    ],
  },
  {
    key: "lawyer",
    label: "Lawyer",
    description:
      "Interprets rules, analyses evidence, communicates arguments, negotiates, and exercises judgement within legal systems.",
    kind: "career",
    domains: [
      "career",
      "leadership",
      "business",
    ],
    requirements: [
      {
        capabilityKey: "knowledge",
        weight: 0.9,
        minimumScore: 55,
        required: true,
        reason:
          "Law requires sustained learning and rule interpretation.",
      },
      {
        capabilityKey: "analysis",
        weight: 1,
        minimumScore: 58,
        required: true,
        reason:
          "Legal work depends on evidence, precedent, and structured reasoning.",
      },
      {
        capabilityKey: "communication",
        weight: 0.9,
        minimumScore: 55,
        required: true,
        reason:
          "Arguments must be expressed precisely.",
      },
      {
        capabilityKey: "negotiation",
        weight: 0.8,
        minimumScore: 52,
        required: true,
        reason:
          "Many legal outcomes depend on settlement and stakeholder alignment.",
      },
      {
        capabilityKey: "governance",
        weight: 0.7,
        minimumScore: 50,
        required: false,
        reason:
          "Governance supports regulatory and institutional legal work.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "leadership",
        weight: 0.4,
        minimumScore: 45,
        required: false,
        reason:
          "Leadership supports advocacy, authority, and senior responsibility.",
      },
    ],
    constraints: [
      {
        capabilityKey: "decision_making",
        minimumStabilityScore: 50,
        reason:
          "Legal judgement should remain stable under conflict and pressure.",
      },
    ],
    practicalExpressions: [
      "Litigation",
      "Corporate law",
      "Compliance and regulation",
      "Contracts",
      "Legal advisory",
    ],
    cautions: [
      "Avoid excessive argumentativeness outside professional contexts.",
      "Strong analysis must be balanced with ethical judgement.",
    ],
  },
  {
    key: "doctor",
    label: "Doctor",
    description:
      "Applies scientific knowledge, diagnosis, responsibility, communication, and care to health decisions.",
    kind: "career",
    domains: [
      "career",
      "health",
      "education",
    ],
    requirements: [
      {
        capabilityKey: "knowledge",
        weight: 1,
        minimumScore: 62,
        required: true,
        reason:
          "Medicine requires extensive technical knowledge.",
      },
      {
        capabilityKey: "analysis",
        weight: 0.9,
        minimumScore: 58,
        required: true,
        reason:
          "Diagnosis requires evidence-based reasoning.",
      },
      {
        capabilityKey: "healing",
        weight: 0.9,
        minimumScore: 52,
        required: true,
        reason:
          "Healing reflects orientation toward care and recovery.",
      },
      {
        capabilityKey: "responsibility",
        weight: 0.9,
        minimumScore: 58,
        required: true,
        reason:
          "Medical decisions carry high responsibility.",
      },
      {
        capabilityKey: "communication",
        weight: 0.7,
        minimumScore: 50,
        required: true,
        reason:
          "Patients require clear explanation and trust.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "research",
        weight: 0.5,
        minimumScore: 48,
        required: false,
        reason:
          "Research supports specialist and academic medicine.",
      },
      {
        capabilityKey: "empathy",
        weight: 0.5,
        minimumScore: 48,
        required: false,
        reason:
          "Empathy improves patient care.",
      },
    ],
    constraints: [
      {
        capabilityKey: "responsibility",
        minimumStabilityScore: 55,
        reason:
          "Responsibility must remain dependable under pressure.",
      },
    ],
    practicalExpressions: [
      "Clinical medicine",
      "Surgery",
      "Diagnostics",
      "Medical research",
      "Health administration",
    ],
    cautions: [
      "Astrological suitability cannot replace academic ability, licensing, or medical training.",
      "High empathy without boundaries can lead to burnout.",
    ],
  },
  {
    key: "astrologer",
    label: "Astrologer",
    description:
      "Combines symbolic systems, research, intuition, analysis, communication, and ethical guidance.",
    kind: "career",
    domains: [
      "career",
      "business",
      "spiritual",
      "education",
    ],
    requirements: [
      {
        capabilityKey: "research",
        weight: 1,
        minimumScore: 55,
        required: true,
        reason:
          "Astrology requires disciplined study of complex symbolic systems.",
      },
      {
        capabilityKey: "analysis",
        weight: 0.9,
        minimumScore: 55,
        required: true,
        reason:
          "Chart interpretation requires structured synthesis.",
      },
      {
        capabilityKey: "intuition",
        weight: 0.8,
        minimumScore: 50,
        required: true,
        reason:
          "Intuition supports non-linear pattern recognition.",
      },
      {
        capabilityKey: "mysticism",
        weight: 0.9,
        minimumScore: 52,
        required: true,
        reason:
          "Mysticism supports symbolic and spiritual understanding.",
      },
      {
        capabilityKey: "communication",
        weight: 0.8,
        minimumScore: 50,
        required: true,
        reason:
          "Interpretation must be communicated responsibly.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "teaching",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Teaching supports courses, content, and public education.",
      },
      {
        capabilityKey: "dharma",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Dharma supports ethical guidance and purpose.",
      },
    ],
    constraints: [
      {
        capabilityKey: "intuition",
        minimumStabilityScore: 45,
        reason:
          "Intuition should remain grounded rather than unstable.",
      },
    ],
    practicalExpressions: [
      "Consultation",
      "Research astrology",
      "Astrology education",
      "Astrology software",
      "Spiritual guidance",
    ],
    cautions: [
      "Avoid unsupported certainty.",
      "Do not replace medical, legal, or financial professionals.",
    ],
  },
  {
    key: "saas_business",
    label: "SaaS Business",
    description:
      "Builds repeatable software value delivered through a scalable subscription or platform model.",
    kind: "business",
    domains: [
      "business",
      "wealth",
      "career",
    ],
    requirements: [
      {
        capabilityKey: "innovation",
        weight: 0.9,
        minimumScore: 55,
        required: true,
        reason:
          "SaaS requires useful technical or product innovation.",
      },
      {
        capabilityKey: "scale",
        weight: 1,
        minimumScore: 58,
        required: true,
        reason:
          "The model depends on repeatable delivery to many users.",
      },
      {
        capabilityKey: "commerce",
        weight: 0.9,
        minimumScore: 55,
        required: true,
        reason:
          "A product must convert value into recurring revenue.",
      },
      {
        capabilityKey: "customer_understanding",
        weight: 0.8,
        minimumScore: 52,
        required: true,
        reason:
          "Retention depends on solving a real customer problem.",
      },
      {
        capabilityKey: "operations",
        weight: 0.7,
        minimumScore: 50,
        required: true,
        reason:
          "Reliable delivery requires repeatable systems and support.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "communication",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Communication supports product education and sales.",
      },
      {
        capabilityKey: "entrepreneurship",
        weight: 0.6,
        minimumScore: 50,
        required: false,
        reason:
          "Entrepreneurship supports uncertainty, ownership, and growth.",
      },
    ],
    constraints: [
      {
        capabilityKey: "scale",
        maximumRiskScore: 75,
        reason:
          "Scale pressure should not be dominated by overreach or instability.",
      },
    ],
    practicalExpressions: [
      "Vertical SaaS",
      "AI software",
      "Subscription platform",
      "Workflow automation",
      "Expert knowledge platform",
    ],
    cautions: [
      "Validate retention, not only initial interest.",
      "Do not scale before product and operations are stable.",
    ],
  },
  {
    key: "consulting_business",
    label: "Consulting Business",
    description:
      "Monetises specialised knowledge through diagnosis, advice, implementation support, and trusted client relationships.",
    kind: "business",
    domains: [
      "business",
      "wealth",
      "career",
    ],
    requirements: [
      {
        capabilityKey: "knowledge",
        weight: 1,
        minimumScore: 58,
        required: true,
        reason:
          "Consulting requires credible expertise.",
      },
      {
        capabilityKey: "analysis",
        weight: 0.9,
        minimumScore: 55,
        required: true,
        reason:
          "Client problems require diagnosis.",
      },
      {
        capabilityKey: "communication",
        weight: 0.9,
        minimumScore: 55,
        required: true,
        reason:
          "Clients must understand and trust recommendations.",
      },
      {
        capabilityKey: "commerce",
        weight: 0.8,
        minimumScore: 52,
        required: true,
        reason:
          "Expertise must be packaged, priced, and sold.",
      },
      {
        capabilityKey: "relationships",
        weight: 0.6,
        minimumScore: 48,
        required: false,
        reason:
          "Trust and referrals support long-term growth.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "teaching",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Teaching supports workshops and knowledge products.",
      },
      {
        capabilityKey: "operations",
        weight: 0.4,
        minimumScore: 45,
        required: false,
        reason:
          "Operations help the business grow beyond personal effort.",
      },
    ],
    constraints: [],
    practicalExpressions: [
      "Independent consulting",
      "Boutique advisory firm",
      "Implementation consulting",
      "Training and advisory",
      "Retainer-based specialist services",
    ],
    cautions: [
      "Avoid relying entirely on personal time.",
      "Build repeatable methods and evidence of outcomes.",
    ],
  },
  {
    key: "premium_consumer_brand",
    label: "Premium Consumer Brand",
    description:
      "Creates perceived value through design, trust, customer experience, storytelling, and consistent delivery.",
    kind: "business",
    domains: [
      "business",
      "wealth",
      "creativity",
    ],
    requirements: [
      {
        capabilityKey: "customer_understanding",
        weight: 1,
        minimumScore: 55,
        required: true,
        reason:
          "Premium brands must understand customer desire and trust.",
      },
      {
        capabilityKey: "creativity",
        weight: 0.9,
        minimumScore: 52,
        required: true,
        reason:
          "Distinctive design and positioning support premium perception.",
      },
      {
        capabilityKey: "storytelling",
        weight: 0.8,
        minimumScore: 50,
        required: true,
        reason:
          "Storytelling shapes emotional value.",
      },
      {
        capabilityKey: "commerce",
        weight: 0.8,
        minimumScore: 52,
        required: true,
        reason:
          "Brand value must convert into profitable exchange.",
      },
      {
        capabilityKey: "operations",
        weight: 0.7,
        minimumScore: 48,
        required: true,
        reason:
          "Premium positioning fails without consistent delivery.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "media",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Media supports visibility and audience growth.",
      },
      {
        capabilityKey: "scale",
        weight: 0.4,
        minimumScore: 45,
        required: false,
        reason:
          "Scale supports broader distribution.",
      },
    ],
    constraints: [],
    practicalExpressions: [
      "Luxury products",
      "Hospitality",
      "Beauty and wellness",
      "Premium education",
      "Specialist lifestyle services",
    ],
    cautions: [
      "Do not substitute image for product quality.",
      "Control customer-acquisition cost and fulfilment quality.",
    ],
  },
  {
    key: "marriage_partnership",
    label: "Marriage Partnership",
    description:
      "Builds a stable long-term personal partnership through communication, empathy, responsibility, and repair.",
    kind: "relationship",
    domains: [
      "relationships",
      "general",
    ],
    requirements: [
      {
        capabilityKey: "relationships",
        weight: 1,
        minimumScore: 52,
        required: true,
        reason:
          "Marriage requires sustained partnership capability.",
      },
      {
        capabilityKey: "communication",
        weight: 0.9,
        minimumScore: 50,
        required: true,
        reason:
          "Needs and conflict must be expressed clearly.",
      },
      {
        capabilityKey: "empathy",
        weight: 0.8,
        minimumScore: 48,
        required: true,
        reason:
          "Empathy supports emotional understanding.",
      },
      {
        capabilityKey: "responsibility",
        weight: 0.8,
        minimumScore: 50,
        required: true,
        reason:
          "Long-term partnership requires dependability.",
      },
      {
        capabilityKey: "negotiation",
        weight: 0.6,
        minimumScore: 45,
        required: false,
        reason:
          "Shared decisions require balanced agreement.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "healing",
        weight: 0.4,
        minimumScore: 42,
        required: false,
        reason:
          "Healing supports repair after emotional difficulty.",
      },
    ],
    constraints: [
      {
        capabilityKey: "relationships",
        minimumStabilityScore: 48,
        reason:
          "Relationship capacity should remain sufficiently stable.",
      },
    ],
    practicalExpressions: [
      "Emotional partnership",
      "Shared responsibility",
      "Conflict repair",
      "Family collaboration",
    ],
    cautions: [
      "Suitability does not guarantee compatibility with a specific person.",
      "Strong relationship potential still requires boundaries and mutual effort.",
    ],
  },
  {
    key: "meditation_path",
    label: "Meditation Path",
    description:
      "Develops sustained inner observation through discipline, detachment, intuition, and spiritual orientation.",
    kind: "spiritual",
    domains: [
      "spiritual",
      "health",
      "general",
    ],
    requirements: [
      {
        capabilityKey: "detachment",
        weight: 0.9,
        minimumScore: 50,
        required: true,
        reason:
          "Meditation requires reduced attachment to passing thoughts.",
      },
      {
        capabilityKey: "discipline",
        weight: 0.8,
        minimumScore: 48,
        required: true,
        reason:
          "Benefit depends on regular practice.",
      },
      {
        capabilityKey: "intuition",
        weight: 0.6,
        minimumScore: 45,
        required: false,
        reason:
          "Intuition supports subtle awareness.",
      },
      {
        capabilityKey: "dharma",
        weight: 0.6,
        minimumScore: 45,
        required: false,
        reason:
          "Dharma provides meaningful spiritual direction.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "mysticism",
        weight: 0.5,
        minimumScore: 42,
        required: false,
        reason:
          "Mysticism supports contemplative depth.",
      },
      {
        capabilityKey: "endurance",
        weight: 0.4,
        minimumScore: 42,
        required: false,
        reason:
          "Endurance supports sustained practice.",
      },
    ],
    constraints: [],
    practicalExpressions: [
      "Daily meditation",
      "Mantra practice",
      "Contemplative study",
      "Retreat practice",
    ],
    cautions: [
      "Meditation should not replace mental-health care.",
      "Avoid using spirituality to escape practical responsibilities.",
    ],
  },

  {
    key: "banker",
    label: "Banker",
    description:
      "Works with financial decisions, institutional responsibility, risk discipline, commercial judgement, and client or stakeholder communication.",
    kind: "career",
    domains: [
      "career",
      "wealth",
      "business",
    ],
    requirements: [
      {
        capabilityKey: "analysis",
        weight: 1,
        minimumScore: 55,
        required: true,
        reason:
          "Banking requires careful analysis of financial information and risk.",
      },
      {
        capabilityKey: "governance",
        weight: 0.9,
        minimumScore: 52,
        required: true,
        reason:
          "Regulation, controls, and institutional processes are central to banking.",
      },
      {
        capabilityKey: "responsibility",
        weight: 0.9,
        minimumScore: 52,
        required: true,
        reason:
          "Financial decisions require dependable judgement and accountability.",
      },
      {
        capabilityKey: "commerce",
        weight: 0.7,
        minimumScore: 48,
        required: false,
        reason:
          "Commercial awareness supports client acquisition and product decisions.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "negotiation",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Negotiation supports pricing, structuring, and stakeholder alignment.",
      },
      {
        capabilityKey: "discipline",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Discipline supports controls, documentation, and consistent execution.",
      },
    ],
    constraints: [],
    practicalExpressions: [
      "Corporate banking",
      "Business banking",
      "Credit and risk",
      "Relationship management",
      "Financial advisory",
    ],
    cautions: [
      "Strong commercial ability should remain balanced with risk discipline.",
    ],
  },
  {
    key: "politician",
    label: "Politician",
    description:
      "Builds public influence through leadership, communication, governance, strategy, alliances, and sustained visibility.",
    kind: "career",
    domains: [
      "career",
      "leadership",
      "general",
    ],
    requirements: [
      {
        capabilityKey: "leadership",
        weight: 1,
        minimumScore: 55,
        required: true,
        reason:
          "Political work requires the ability to lead groups and represent direction.",
      },
      {
        capabilityKey: "communication",
        weight: 0.9,
        minimumScore: 52,
        required: true,
        reason:
          "Public persuasion and message discipline are essential.",
      },
      {
        capabilityKey: "governance",
        weight: 0.9,
        minimumScore: 52,
        required: true,
        reason:
          "Political responsibility involves institutions, policy, and public systems.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "authority",
        weight: 0.6,
        minimumScore: 45,
        required: false,
        reason:
          "Authority supports public responsibility and executive presence.",
      },
      {
        capabilityKey: "strategic_thinking",
        weight: 0.6,
        minimumScore: 45,
        required: false,
        reason:
          "Strategy supports coalition building and long-range positioning.",
      },
      {
        capabilityKey: "negotiation",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Negotiation supports alliances and compromise.",
      },
    ],
    constraints: [],
    practicalExpressions: [
      "Elected office",
      "Public leadership",
      "Policy advocacy",
      "Political organisation",
    ],
    cautions: [
      "Public influence should remain grounded in responsibility rather than visibility alone.",
    ],
  },
  {
    key: "entrepreneur",
    label: "Entrepreneur",
    description:
      "Creates and grows opportunities through initiative, commerce, leadership, uncertainty tolerance, and repeated execution.",
    kind: "career",
    domains: [
      "career",
      "business",
      "wealth",
    ],
    requirements: [
      {
        capabilityKey: "entrepreneurship",
        weight: 1,
        minimumScore: 55,
        required: true,
        reason:
          "Entrepreneurship requires ownership under uncertainty.",
      },
      {
        capabilityKey: "leadership",
        weight: 0.8,
        minimumScore: 50,
        required: true,
        reason:
          "Founders must direct people, priorities, and resources.",
      },
      {
        capabilityKey: "commerce",
        weight: 0.9,
        minimumScore: 52,
        required: true,
        reason:
          "A venture must convert value into sustainable commercial exchange.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "initiative",
        weight: 0.6,
        minimumScore: 45,
        required: false,
        reason:
          "Initiative supports action before certainty is complete.",
      },
      {
        capabilityKey: "negotiation",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Negotiation supports customers, partners, and capital.",
      },
      {
        capabilityKey: "innovation",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Innovation can create differentiated value.",
      },
    ],
    constraints: [],
    practicalExpressions: [
      "Founder",
      "Owner-managed business",
      "Startup leadership",
      "Independent venture",
    ],
    cautions: [
      "Ambition should be matched by execution and commercial validation.",
    ],
  },
  {
    key: "researcher",
    label: "Researcher",
    description:
      "Investigates questions through disciplined inquiry, analysis, learning, evidence, and sustained depth.",
    kind: "career",
    domains: [
      "career",
      "education",
      "general",
    ],
    requirements: [
      {
        capabilityKey: "research",
        weight: 1,
        minimumScore: 55,
        required: true,
        reason:
          "Research requires sustained investigation.",
      },
      {
        capabilityKey: "analysis",
        weight: 0.9,
        minimumScore: 52,
        required: true,
        reason:
          "Evidence must be interpreted carefully.",
      },
      {
        capabilityKey: "learning",
        weight: 0.8,
        minimumScore: 50,
        required: true,
        reason:
          "Research depends on continued acquisition of knowledge.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "knowledge",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Domain expertise improves research quality.",
      },
      {
        capabilityKey: "discipline",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Discipline supports long investigation cycles.",
      },
      {
        capabilityKey: "innovation",
        weight: 0.4,
        minimumScore: 45,
        required: false,
        reason:
          "Innovation supports new hypotheses and methods.",
      },
    ],
    constraints: [],
    practicalExpressions: [
      "Academic research",
      "Industry research",
      "Policy research",
      "Specialist investigation",
    ],
    cautions: [
      "Avoid endless investigation without synthesis or conclusion.",
    ],
  },
  {
    key: "psychologist",
    label: "Psychologist",
    description:
      "Understands behaviour and emotional patterns through empathy, analysis, communication, observation, and healing-oriented work.",
    kind: "career",
    domains: [
      "career",
      "health",
      "relationships",
    ],
    requirements: [
      {
        capabilityKey: "empathy",
        weight: 1,
        minimumScore: 52,
        required: true,
        reason:
          "Psychological work requires emotional understanding.",
      },
      {
        capabilityKey: "analysis",
        weight: 0.9,
        minimumScore: 52,
        required: true,
        reason:
          "Behavioural patterns must be interpreted carefully.",
      },
      {
        capabilityKey: "communication",
        weight: 0.8,
        minimumScore: 50,
        required: true,
        reason:
          "Therapeutic and assessment work depends on communication.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "healing",
        weight: 0.6,
        minimumScore: 45,
        required: false,
        reason:
          "Healing orientation supports therapeutic work.",
      },
      {
        capabilityKey: "research",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Research supports evidence-based psychology.",
      },
      {
        capabilityKey: "intuition",
        weight: 0.4,
        minimumScore: 42,
        required: false,
        reason:
          "Intuition can support subtle pattern recognition when grounded.",
      },
    ],
    constraints: [],
    practicalExpressions: [
      "Clinical psychology",
      "Counselling psychology",
      "Organisational psychology",
      "Behavioural research",
    ],
    cautions: [
      "Astrological suitability cannot replace professional qualification or licensing.",
    ],
  },
  {
    key: "accountant",
    label: "Accountant",
    description:
      "Works with structured financial records, controls, review, precision, responsibility, and disciplined analysis.",
    kind: "career",
    domains: [
      "career",
      "wealth",
      "business",
    ],
    requirements: [
      {
        capabilityKey: "analysis",
        weight: 1,
        minimumScore: 55,
        required: true,
        reason:
          "Accounting requires accurate interpretation of financial records.",
      },
      {
        capabilityKey: "governance",
        weight: 0.8,
        minimumScore: 50,
        required: true,
        reason:
          "Accounting operates within standards, controls, and reporting rules.",
      },
      {
        capabilityKey: "discipline",
        weight: 0.9,
        minimumScore: 52,
        required: true,
        reason:
          "Consistency and precision are essential.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "responsibility",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Responsibility supports dependable reporting.",
      },
      {
        capabilityKey: "operations",
        weight: 0.4,
        minimumScore: 45,
        required: false,
        reason:
          "Operations supports process-oriented finance roles.",
      },
    ],
    constraints: [],
    practicalExpressions: [
      "Financial accounting",
      "Audit support",
      "Management accounting",
      "Controls and reporting",
    ],
    cautions: [
      "Precision should not become paralysis or excessive conservatism.",
    ],
  },
  {
    key: "journalist",
    label: "Journalist",
    description:
      "Finds, verifies, structures, and communicates information for public audiences.",
    kind: "career",
    domains: [
      "career",
      "creativity",
      "general",
    ],
    requirements: [
      {
        capabilityKey: "communication",
        weight: 1,
        minimumScore: 55,
        required: true,
        reason:
          "Journalism requires clear public communication.",
      },
      {
        capabilityKey: "media",
        weight: 0.9,
        minimumScore: 50,
        required: true,
        reason:
          "Journalism operates through media channels and audience awareness.",
      },
      {
        capabilityKey: "research",
        weight: 0.8,
        minimumScore: 50,
        required: true,
        reason:
          "Claims require investigation and verification.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "storytelling",
        weight: 0.6,
        minimumScore: 45,
        required: false,
        reason:
          "Storytelling improves structure and audience engagement.",
      },
      {
        capabilityKey: "analysis",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Analysis supports interpretation of complex issues.",
      },
    ],
    constraints: [],
    practicalExpressions: [
      "News reporting",
      "Investigative journalism",
      "Editorial work",
      "Digital media",
    ],
    cautions: [
      "Speed should not replace verification.",
    ],
  },
  {
    key: "writer",
    label: "Writer",
    description:
      "Creates meaning through language, narrative, observation, communication, and creative structure.",
    kind: "career",
    domains: [
      "career",
      "creativity",
      "education",
    ],
    requirements: [
      {
        capabilityKey: "communication",
        weight: 1,
        minimumScore: 52,
        required: true,
        reason:
          "Writing is fundamentally structured communication.",
      },
      {
        capabilityKey: "storytelling",
        weight: 0.9,
        minimumScore: 50,
        required: true,
        reason:
          "Narrative ability supports engaging and coherent writing.",
      },
      {
        capabilityKey: "creativity",
        weight: 0.8,
        minimumScore: 48,
        required: true,
        reason:
          "Creative synthesis supports original expression.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "research",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Research supports factual and specialist writing.",
      },
      {
        capabilityKey: "learning",
        weight: 0.4,
        minimumScore: 45,
        required: false,
        reason:
          "Learning expands subject range and depth.",
      },
    ],
    constraints: [],
    practicalExpressions: [
      "Books",
      "Articles",
      "Scripts",
      "Educational content",
      "Long-form commentary",
    ],
    cautions: [
      "Creative range still requires disciplined editing and completion.",
    ],
  },
  {
    key: "salesperson",
    label: "Salesperson",
    description:
      "Converts customer need into commercial action through communication, negotiation, persuasion, and relationship awareness.",
    kind: "career",
    domains: [
      "career",
      "business",
      "wealth",
    ],
    requirements: [
      {
        capabilityKey: "communication",
        weight: 0.9,
        minimumScore: 52,
        required: true,
        reason:
          "Sales requires clear and adaptive communication.",
      },
      {
        capabilityKey: "negotiation",
        weight: 1,
        minimumScore: 55,
        required: true,
        reason:
          "Commercial closure depends on negotiation.",
      },
      {
        capabilityKey: "sales",
        weight: 1,
        minimumScore: 55,
        required: true,
        reason:
          "Sales capability reflects persuasion and conversion.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "commerce",
        weight: 0.6,
        minimumScore: 45,
        required: false,
        reason:
          "Commerce supports pricing and value exchange.",
      },
      {
        capabilityKey: "customer_understanding",
        weight: 0.6,
        minimumScore: 45,
        required: false,
        reason:
          "Customer understanding improves relevance and trust.",
      },
      {
        capabilityKey: "initiative",
        weight: 0.4,
        minimumScore: 42,
        required: false,
        reason:
          "Initiative supports prospecting and follow-up.",
      },
    ],
    constraints: [],
    practicalExpressions: [
      "B2B sales",
      "Relationship sales",
      "Business development",
      "Account management",
    ],
    cautions: [
      "Persuasion should not replace product fit or customer trust.",
    ],
  },
  {
    key: "architect",
    label: "Architect",
    description:
      "Combines creative design, structured analysis, planning, technical execution, and disciplined responsibility.",
    kind: "career",
    domains: [
      "career",
      "creativity",
      "general",
    ],
    requirements: [
      {
        capabilityKey: "creativity",
        weight: 0.9,
        minimumScore: 50,
        required: true,
        reason:
          "Architecture requires design imagination.",
      },
      {
        capabilityKey: "analysis",
        weight: 0.9,
        minimumScore: 52,
        required: true,
        reason:
          "Design must satisfy functional and structural constraints.",
      },
      {
        capabilityKey: "execution",
        weight: 0.8,
        minimumScore: 50,
        required: true,
        reason:
          "Concepts must translate into workable plans and delivery.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "strategic_thinking",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Strategy supports complex design trade-offs.",
      },
      {
        capabilityKey: "discipline",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Discipline supports technical detail and project consistency.",
      },
      {
        capabilityKey: "innovation",
        weight: 0.4,
        minimumScore: 45,
        required: false,
        reason:
          "Innovation supports distinctive design solutions.",
      },
    ],
    constraints: [],
    practicalExpressions: [
      "Architecture",
      "Urban design",
      "Spatial planning",
      "Design consultancy",
    ],
    cautions: [
      "Creative vision must remain compatible with technical and regulatory reality.",
    ],
  },
  {
    key: "designer",
    label: "Designer",
    description:
      "Creates useful and attractive solutions through creativity, customer understanding, communication, and iteration.",
    kind: "career",
    domains: [
      "career",
      "creativity",
      "business",
    ],
    requirements: [
      {
        capabilityKey: "creativity",
        weight: 1,
        minimumScore: 52,
        required: true,
        reason:
          "Design requires original visual or functional synthesis.",
      },
      {
        capabilityKey: "customer_understanding",
        weight: 0.9,
        minimumScore: 50,
        required: true,
        reason:
          "Useful design responds to human needs.",
      },
      {
        capabilityKey: "communication",
        weight: 0.7,
        minimumScore: 48,
        required: true,
        reason:
          "Design ideas must be explained and refined with stakeholders.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "storytelling",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Storytelling supports brand and experience design.",
      },
      {
        capabilityKey: "innovation",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Innovation supports differentiated solutions.",
      },
      {
        capabilityKey: "media",
        weight: 0.4,
        minimumScore: 42,
        required: false,
        reason:
          "Media capability supports digital and visual work.",
      },
    ],
    constraints: [],
    practicalExpressions: [
      "Graphic design",
      "Product design",
      "UX/UI design",
      "Brand design",
    ],
    cautions: [
      "Aesthetic strength should remain connected to usability and customer need.",
    ],
  },
  {
    key: "scientist",
    label: "Scientist",
    description:
      "Builds knowledge through research, analysis, disciplined learning, evidence, experimentation, and intellectual persistence.",
    kind: "career",
    domains: [
      "career",
      "education",
      "general",
    ],
    requirements: [
      {
        capabilityKey: "research",
        weight: 1,
        minimumScore: 58,
        required: true,
        reason:
          "Scientific work requires systematic investigation.",
      },
      {
        capabilityKey: "analysis",
        weight: 1,
        minimumScore: 58,
        required: true,
        reason:
          "Evidence must be interpreted rigorously.",
      },
      {
        capabilityKey: "learning",
        weight: 0.8,
        minimumScore: 52,
        required: true,
        reason:
          "Scientific work requires continued technical learning.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "innovation",
        weight: 0.6,
        minimumScore: 45,
        required: false,
        reason:
          "Innovation supports new methods and hypotheses.",
      },
      {
        capabilityKey: "discipline",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Discipline supports repeatable method.",
      },
      {
        capabilityKey: "knowledge",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Knowledge supports specialist depth.",
      },
    ],
    constraints: [],
    practicalExpressions: [
      "Laboratory science",
      "Applied research",
      "Data-driven research",
      "Scientific development",
    ],
    cautions: [
      "Strong theory should remain connected to evidence and reproducibility.",
    ],
  },
  {
    key: "military_officer",
    label: "Military Officer",
    description:
      "Operates through leadership, discipline, execution, responsibility, authority, and strategic judgement under pressure.",
    kind: "career",
    domains: [
      "career",
      "leadership",
      "general",
    ],
    requirements: [
      {
        capabilityKey: "leadership",
        weight: 1,
        minimumScore: 55,
        required: true,
        reason:
          "Military officers must lead people and decisions.",
      },
      {
        capabilityKey: "execution",
        weight: 0.9,
        minimumScore: 55,
        required: true,
        reason:
          "Plans must convert into disciplined action.",
      },
      {
        capabilityKey: "discipline",
        weight: 1,
        minimumScore: 55,
        required: true,
        reason:
          "Military responsibility depends on consistent discipline.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "authority",
        weight: 0.6,
        minimumScore: 45,
        required: false,
        reason:
          "Authority supports command responsibility.",
      },
      {
        capabilityKey: "strategic_thinking",
        weight: 0.6,
        minimumScore: 45,
        required: false,
        reason:
          "Strategic thinking supports planning under uncertainty.",
      },
      {
        capabilityKey: "responsibility",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Responsibility supports dependable command.",
      },
    ],
    constraints: [],
    practicalExpressions: [
      "Command",
      "Operations",
      "Planning",
      "Military administration",
    ],
    cautions: [
      "Astrological suitability cannot replace physical, legal, or professional eligibility.",
    ],
  },
  {
    key: "spiritual_teacher",
    label: "Spiritual Teacher",
    description:
      "Guides others through knowledge, teaching, spiritual depth, dharma, communication, and mature mentorship.",
    kind: "career",
    domains: [
      "career",
      "spiritual",
      "education",
    ],
    requirements: [
      {
        capabilityKey: "teaching",
        weight: 1,
        minimumScore: 55,
        required: true,
        reason:
          "Spiritual teaching requires the ability to structure and transmit knowledge.",
      },
      {
        capabilityKey: "mysticism",
        weight: 0.9,
        minimumScore: 52,
        required: true,
        reason:
          "Spiritual teaching requires genuine orientation toward deeper symbolic or contemplative understanding.",
      },
      {
        capabilityKey: "dharma",
        weight: 0.9,
        minimumScore: 52,
        required: true,
        reason:
          "Dharma supports ethical and meaningful guidance.",
      },
    ],
    optionalCapabilities: [
      {
        capabilityKey: "knowledge",
        weight: 0.6,
        minimumScore: 45,
        required: false,
        reason:
          "Knowledge supports scriptural or philosophical depth.",
      },
      {
        capabilityKey: "communication",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Communication supports responsible guidance.",
      },
      {
        capabilityKey: "mentoring",
        weight: 0.5,
        minimumScore: 45,
        required: false,
        reason:
          "Mentoring supports individual development.",
      },
    ],
    constraints: [],
    practicalExpressions: [
      "Spiritual education",
      "Scriptural teaching",
      "Meditation instruction",
      "Philosophical guidance",
    ],
    cautions: [
      "Spiritual authority should remain grounded in ethics, humility, and responsible boundaries.",
    ],
  },
];