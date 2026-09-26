import type { LifeArea } from "../types";

export type PlanetNatureKnowledge = {
  planet: string;

  coreNature: string;
  principle: string;
  psychology: string;

  naturalKarakatwas: string[];
  supportiveThemes: string[];
  challengingThemes: string[];

  primaryAreas: LifeArea[];

  higherExpression: string;
  lowerExpression: string;

  dailyExpression: string;
  lifeReportInterpretation: string;

  confidence: number;
};

export const PLANET_NATURE: Record<string, PlanetNatureKnowledge> = {
  sun: {
    planet: "sun",

    coreNature:
      "Identity, vitality, authority, purpose, confidence and the capacity to lead.",

    principle:
      "The Sun represents the central organising force of the individual: identity, vitality, authority, dignity, purpose and the desire to act from a clear sense of self.",

    psychology:
      "The Sun seeks significance, self-respect and purposeful expression. It wants the individual to know who they are, stand behind their decisions and develop the confidence to take responsibility.",

    naturalKarakatwas: [
      "self and identity",
      "father",
      "authority",
      "government",
      "leadership",
      "status",
      "reputation",
      "vitality",
      "confidence",
      "purpose",
      "recognition",
      "dignity"
    ],

    supportiveThemes: [
      "leadership",
      "confidence",
      "clarity of purpose",
      "independence",
      "decisiveness",
      "responsibility",
      "visibility",
      "integrity"
    ],

    challengingThemes: [
      "ego",
      "pride",
      "dominance",
      "rigidity",
      "need for recognition",
      "conflict with authority",
      "self-centred decisions"
    ],

    primaryAreas: [
      "career",
      "publicImage",
      "health",
      "mind"
    ],

    higherExpression:
      "Confident leadership, integrity, responsibility and the ability to use authority for a meaningful purpose.",

    lowerExpression:
      "Pride, excessive need for recognition, domination, rigidity or allowing ego to interfere with sound judgement.",

    dailyExpression:
      "The Sun highlights where confidence, visibility, leadership or an important decision may require conscious attention.",

    lifeReportInterpretation:
      "The Sun describes how identity, confidence, authority and life purpose develop, including the areas where the person seeks recognition and learns to stand firmly behind their own direction.",

    confidence: 10,
  },
  moon: {
  planet: "moon",

  coreNature:
    "Mind, emotions, receptivity, nourishment, adaptability and the instinctive response to life.",

  principle:
    "The Moon represents the mind and emotional experience: how the individual receives circumstances, responds instinctively, seeks security and adapts to changing conditions.",

  psychology:
    "The Moon seeks emotional safety, belonging and inner comfort. It reflects what the person needs in order to feel settled, supported and emotionally connected.",

  naturalKarakatwas: [
    "mind",
    "emotions",
    "mother",
    "nurturing",
    "emotional security",
    "home and comfort",
    "receptivity",
    "adaptability",
    "memory",
    "habits",
    "public connection",
    "care and nourishment"
  ],

  supportiveThemes: [
    "emotional awareness",
    "adaptability",
    "empathy",
    "nurturing",
    "intuition",
    "responsiveness",
    "emotional connection",
    "care"
  ],

  challengingThemes: [
    "emotional fluctuation",
    "insecurity",
    "over-sensitivity",
    "dependency",
    "restlessness",
    "mood-driven decisions",
    "difficulty maintaining emotional boundaries"
  ],

  primaryAreas: [
    "mind",
    "family",
    "home",
    "relationships"
  ],

  higherExpression:
    "Emotional intelligence, adaptability, empathy and the ability to understand and respond sensitively to changing circumstances.",

  lowerExpression:
    "Emotional instability, excessive dependence on external reassurance, mood-driven reactions or difficulty maintaining inner balance.",

  dailyExpression:
    "The Moon shows where attention naturally moves today and which experiences are most likely to affect the person's mood, priorities and immediate responses.",

  lifeReportInterpretation:
    "The Moon describes the person's emotional nature, instinctive responses, need for security and the conditions that support psychological comfort and inner stability.",

  confidence: 10,
},
mars: {
  planet: "mars",

  coreNature:
    "Action, courage, drive, competition, assertion, technical ability and the instinct to overcome obstacles.",

  principle:
    "Mars represents directed energy: the capacity to act, defend, compete, separate, initiate and push through resistance.",

  psychology:
    "Mars seeks movement, challenge and decisive action. It reflects how the person handles pressure, conflict, desire and the need to assert themselves.",

  naturalKarakatwas: [
    "courage",
    "action",
    "competition",
    "initiative",
    "strength",
    "brothers and siblings",
    "property and land",
    "technical ability",
    "engineering",
    "weapons",
    "conflict",
    "physical energy"
  ],

  supportiveThemes: [
    "courage",
    "decisiveness",
    "initiative",
    "leadership",
    "problem-solving",
    "competitiveness",
    "physical stamina",
    "technical skill"
  ],

  challengingThemes: [
    "anger",
    "impatience",
    "aggression",
    "conflict",
    "recklessness",
    "domination",
    "impulsive decisions"
  ],

  primaryAreas: [
    "career",
    "health",
    "property",
    "communication"
  ],

  higherExpression:
    "Courageous action, disciplined strength, constructive competition and the ability to solve difficult problems quickly.",

  lowerExpression:
    "Anger, aggression, impatience, destructive competition or acting before considering consequences.",

  dailyExpression:
    "Mars shows where immediate action, courage, confrontation or decisive problem-solving may be required.",

  lifeReportInterpretation:
    "Mars describes how the person uses energy, courage and assertiveness, including how they respond to competition, conflict and situations requiring decisive action.",

  confidence: 10,
},
mercury: {
  planet: "mercury",

  coreNature:
    "Intelligence, communication, analysis, learning, adaptability, commerce and the ability to process information.",

  principle:
    "Mercury represents the analytical and communicative faculty: how the individual learns, reasons, speaks, exchanges information and adapts mentally to changing situations.",

  psychology:
    "Mercury seeks understanding, stimulation and mental flexibility. It reflects how the person interprets experience, solves problems and connects ideas through communication.",

  naturalKarakatwas: [
    "intelligence",
    "speech",
    "communication",
    "learning",
    "analysis",
    "logic",
    "writing",
    "commerce",
    "trade",
    "calculation",
    "skills",
    "adaptability"
  ],

  supportiveThemes: [
    "clarity",
    "curiosity",
    "learning",
    "communication",
    "analytical thinking",
    "adaptability",
    "negotiation",
    "problem-solving"
  ],

  challengingThemes: [
    "overthinking",
    "nervousness",
    "indecision",
    "restlessness",
    "cleverness without depth",
    "miscommunication",
    "mental inconsistency"
  ],

  primaryAreas: [
    "communication",
    "education",
    "career",
    "money"
  ],

  higherExpression:
    "Clear thinking, effective communication, intelligent adaptation and the ability to solve problems through knowledge and reason.",

  lowerExpression:
    "Over-analysis, inconsistency, nervous thinking, manipulative communication or difficulty committing to a clear decision.",

  dailyExpression:
    "Mercury shows where communication, learning, analysis, planning or practical decision-making may require attention.",

  lifeReportInterpretation:
    "Mercury describes how the person thinks, learns, communicates and adapts, including the skills through which intelligence becomes useful in practical life.",

  confidence: 10,
},
jupiter: {
  planet: "jupiter",

  coreNature:
    "Wisdom, expansion, guidance, knowledge, faith, ethics, prosperity and the capacity to understand the larger meaning of life.",

  principle:
    "Jupiter represents wisdom and expansion: the capacity to learn, teach, guide, judge wisely and grow through knowledge, faith and meaningful experience.",

  psychology:
    "Jupiter seeks meaning, understanding and growth. It reflects the person's need to develop perspective, trust in possibilities and make decisions according to principles larger than immediate circumstances.",

  naturalKarakatwas: [
    "wisdom",
    "higher knowledge",
    "teachers and mentors",
    "children",
    "dharma",
    "faith",
    "ethics",
    "prosperity",
    "counsel",
    "judgement",
    "expansion",
    "spiritual knowledge"
  ],

  supportiveThemes: [
    "wisdom",
    "growth",
    "optimism",
    "guidance",
    "generosity",
    "ethical judgement",
    "learning",
    "long-term perspective"
  ],

  challengingThemes: [
    "overconfidence",
    "excess",
    "over-promising",
    "self-righteousness",
    "unrealistic optimism",
    "complacency",
    "poor judgement through excessive confidence"
  ],

  primaryAreas: [
    "education",
    "children",
    "spirituality",
    "money"
  ],

  higherExpression:
    "Wisdom, generosity, ethical judgement and the ability to guide growth through knowledge, perspective and sound counsel.",

  lowerExpression:
    "Excess, complacency, overconfidence, moral superiority or assuming that optimism alone will produce results.",

  dailyExpression:
    "Jupiter shows where growth, guidance, learning or a broader perspective may create an opportunity or improve judgement.",

  lifeReportInterpretation:
    "Jupiter describes how the person develops wisdom, faith and perspective, including the areas through which knowledge, guidance and expansion become important sources of growth.",

  confidence: 10,
},
venus: {
  planet: "venus",

  coreNature:
    "Relationships, harmony, attraction, pleasure, beauty, comfort, creativity and the ability to experience and create value.",

  principle:
    "Venus represents attraction and harmony: the capacity to relate, appreciate, enjoy, create beauty and establish balance between personal desires and shared experience.",

  psychology:
    "Venus seeks connection, appreciation and enjoyment. It reflects what the person values, what attracts them and how they create harmony, affection and satisfaction in relationships and material life.",

  naturalKarakatwas: [
    "relationships",
    "marriage",
    "love",
    "attraction",
    "pleasure",
    "beauty",
    "art",
    "comfort",
    "luxury",
    "vehicles",
    "sensual enjoyment",
    "material refinement"
  ],

  supportiveThemes: [
    "harmony",
    "affection",
    "diplomacy",
    "creativity",
    "appreciation",
    "cooperation",
    "refinement",
    "relationship building"
  ],

  challengingThemes: [
    "overindulgence",
    "dependency on approval",
    "excessive attachment",
    "avoidance of necessary conflict",
    "vanity",
    "material excess",
    "pleasure-seeking without restraint"
  ],

  primaryAreas: [
    "relationships",
    "money",
    "home",
    "publicImage"
  ],

  higherExpression:
    "Healthy relationships, diplomacy, refined values, creative expression and the ability to create harmony without sacrificing sound judgement.",

  lowerExpression:
    "Overindulgence, excessive attachment, dependence on approval or choosing immediate pleasure over longer-term wellbeing.",

  dailyExpression:
    "Venus shows where relationships, agreements, enjoyment, creativity or questions of value and balance may require attention.",

  lifeReportInterpretation:
    "Venus describes how the person experiences relationships, attraction, pleasure and material comfort, including what they value and how they develop harmony with others.",

  confidence: 10,
},
saturn: {
  planet: "saturn",

  coreNature:
    "Discipline, responsibility, structure, endurance, limitation, time and the capacity to build lasting results through sustained effort.",

  principle:
    "Saturn represents structure and consequence: the capacity to accept responsibility, work within limitations, endure difficulty and create stability through patience and consistent effort.",

  psychology:
    "Saturn seeks security through structure, competence and self-reliance. It reveals where the person may initially experience pressure, caution or inadequacy, but can gradually develop maturity and lasting strength.",

  naturalKarakatwas: [
    "discipline",
    "responsibility",
    "hard work",
    "time",
    "delay",
    "longevity",
    "service",
    "labour",
    "limitations",
    "endurance",
    "old age",
    "structure"
  ],

  supportiveThemes: [
    "discipline",
    "patience",
    "responsibility",
    "endurance",
    "consistency",
    "realism",
    "organisation",
    "long-term achievement"
  ],

  challengingThemes: [
    "delay",
    "fear",
    "restriction",
    "pessimism",
    "loneliness",
    "excessive burden",
    "rigidity",
    "resistance to change"
  ],

  primaryAreas: [
    "career",
    "health",
    "money",
    "mind"
  ],

  higherExpression:
    "Discipline, patience, maturity, accountability and the ability to create durable results through sustained effort.",

  lowerExpression:
    "Fear, pessimism, rigidity, excessive caution or feeling overwhelmed by responsibility and limitation.",

  dailyExpression:
    "Saturn shows where patience, responsibility, boundaries or sustained effort may be necessary before meaningful progress becomes visible.",

  lifeReportInterpretation:
    "Saturn describes where the person develops maturity through responsibility, limitation and time, including the areas where sustained effort can eventually become a source of exceptional strength and stability.",

  confidence: 10,
},
rahu: {
  planet: "rahu",

  coreNature:
    "Desire, amplification, ambition, disruption, unconventionality, obsession and the drive to experience what feels unfamiliar or beyond ordinary limits.",

  principle:
    "Rahu represents expansion through desire and disruption: it intensifies whatever it touches, creates hunger for experience and pushes the individual toward unfamiliar, unconventional or worldly territory.",

  psychology:
    "Rahu seeks more. It reflects where the person feels unusually driven, curious or dissatisfied with ordinary limits, often creating strong ambition alongside restlessness or uncertainty.",

  naturalKarakatwas: [
    "desire",
    "ambition",
    "foreign influences",
    "unconventional paths",
    "technology",
    "mass influence",
    "status seeking",
    "obsession",
    "illusion",
    "disruption",
    "experimentation",
    "worldly achievement"
  ],

  supportiveThemes: [
    "ambition",
    "innovation",
    "adaptability",
    "unconventional thinking",
    "breakthroughs",
    "foreign opportunities",
    "strategic experimentation",
    "large-scale influence"
  ],

  challengingThemes: [
    "obsession",
    "confusion",
    "excessive desire",
    "restlessness",
    "illusion",
    "shortcuts",
    "boundary crossing",
    "difficulty feeling satisfied"
  ],

  primaryAreas: [
    "career",
    "publicImage",
    "mind",
    "travel"
  ],

  higherExpression:
    "Bold innovation, strategic ambition, adaptability and the courage to move beyond conventional limitations without losing judgement.",

  lowerExpression:
    "Obsession, excessive ambition, confusion, manipulation or pursuing desire without regard for consequences.",

  dailyExpression:
    "Rahu shows where desire, ambition, uncertainty or an unconventional opportunity may intensify attention and push events beyond their usual pattern.",

  lifeReportInterpretation:
    "Rahu describes where the person experiences powerful desire, ambition and experimentation, including the areas where unconventional experiences can produce both rapid growth and important lessons in discernment.",

  confidence: 10,
},
ketu: {
  planet: "ketu",

  coreNature:
    "Detachment, introspection, separation, refinement, spiritual insight and the tendency to look beyond ordinary material satisfaction.",

  principle:
    "Ketu represents separation and inward refinement: it reduces attachment to conventional outcomes, exposes what no longer provides fulfilment and directs awareness toward deeper understanding.",

  psychology:
    "Ketu seeks freedom from attachment. It reflects where the person may feel unusually detached, dissatisfied or inwardly focused, often creating a need to understand experience at a deeper level rather than simply acquire more.",

  naturalKarakatwas: [
    "detachment",
    "spiritual insight",
    "introspection",
    "separation",
    "liberation",
    "research",
    "intuition",
    "past conditioning",
    "isolation",
    "refinement",
    "mysticism",
    "non-attachment"
  ],

  supportiveThemes: [
    "spiritual insight",
    "discernment",
    "research",
    "intuition",
    "independence",
    "simplicity",
    "deep concentration",
    "freedom from unnecessary attachment"
  ],

  challengingThemes: [
    "disconnection",
    "dissatisfaction",
    "withdrawal",
    "confusion about direction",
    "excessive isolation",
    "loss of interest",
    "difficulty engaging with practical matters"
  ],

  primaryAreas: [
    "spirituality",
    "mind",
    "hiddenMatters",
    "education"
  ],

  higherExpression:
    "Discernment, spiritual insight, focused investigation and the ability to release attachments that no longer serve meaningful growth.",

  lowerExpression:
    "Withdrawal, disconnection, aimlessness or rejecting practical responsibilities because they no longer feel emotionally satisfying.",

  dailyExpression:
    "Ketu shows where detachment, introspection or an unexpected loss of interest may encourage a deeper reassessment of what genuinely matters.",

  lifeReportInterpretation:
    "Ketu describes where the person gradually develops detachment and deeper insight, including the areas where conventional achievement may eventually give way to introspection, refinement and a search for greater meaning.",

  confidence: 10,
},
};
