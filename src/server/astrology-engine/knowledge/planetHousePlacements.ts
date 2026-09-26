import type { LifeArea } from "../types";

export type PlanetHousePlacementKnowledge = {
  planet: string;
  placementHouse: number;
  key: string;

  principle: string;
  synthesis: string;
  psychology: string;

  areas: LifeArea[];

  practicalEffects: string[];
  opportunities: string[];
  cautions: string[];

  bestUse: string;
  dailyExpression: string;
  askSarathiExplanation: string;
  lifeReportInterpretation: string;

  confidence: number;
};

export const PLANET_HOUSE_PLACEMENTS: Record<
  string,
  PlanetHousePlacementKnowledge
> = {
  sun_in_1: {
    planet: "sun",
    placementHouse: 1,
    key: "sun_in_1",

    principle:
      "The Sun in the 1st house places identity, confidence, vitality and self-direction at the centre of experience.",

    synthesis:
      "The person is naturally driven to establish a clear sense of self and may feel most fulfilled when taking initiative, leading or acting independently.",

    psychology:
      "Self-respect and personal direction are especially important. The person often needs to feel that their choices reflect their own values and identity.",

    areas: ["mind", "health", "career", "publicImage"],

    practicalEffects: [
      "Confidence becomes more visible.",
      "Personal decisions carry greater importance.",
      "Leadership tendencies strengthen.",
      "Attention turns toward self-improvement."
    ],

    opportunities: [
      "Take initiative.",
      "Clarify personal goals.",
      "Lead confidently.",
      "Strengthen physical vitality."
    ],

    cautions: [
      "Avoid excessive pride.",
      "Do not dominate others.",
      "Avoid making every situation about yourself."
    ],

    bestUse:
      "Use confidence to create clear direction without losing awareness of others.",

    dailyExpression:
      "Today may bring a stronger need to take charge, make a personal decision or define your direction clearly.",

    askSarathiExplanation:
      "The Sun activates the 1st house, placing identity, confidence and personal direction at the forefront.",

    lifeReportInterpretation:
      "Throughout life, identity and self-confidence become major developmental themes, with leadership and self-definition playing an important role.",

    confidence: 10,
  },

  sun_in_2: {
    planet: "sun",
    placementHouse: 2,
    key: "sun_in_2",

    principle:
      "The Sun in the 2nd house directs identity and authority toward wealth, family values, speech and personal resources.",

    synthesis:
      "Self-worth becomes closely connected with financial independence, family responsibilities and the ability to communicate with conviction.",

    psychology:
      "The person often feels more secure when they can support themselves, protect their values and speak from a position of confidence.",

    areas: ["money", "family", "communication", "publicImage"],

    practicalEffects: [
      "Financial decisions gain importance.",
      "Speech becomes more authoritative.",
      "Family responsibilities may increase.",
      "Attention turns toward building stability."
    ],

    opportunities: [
      "Strengthen finances.",
      "Communicate clearly.",
      "Take responsibility for family matters.",
      "Define personal values."
    ],

    cautions: [
      "Avoid pride around money.",
      "Do not speak too harshly.",
      "Avoid defining self-worth only through possessions."
    ],

    bestUse:
      "Build confidence through responsible financial and personal values.",

    dailyExpression:
      "Money, family or an important conversation may require a clear and confident approach today.",

    askSarathiExplanation:
      "The Sun activates the 2nd house, bringing greater focus to wealth, values, speech and family responsibilities.",

    lifeReportInterpretation:
      "Throughout life, confidence often develops through financial independence, strong values and the ability to communicate with authority.",

    confidence: 10,
  },

  sun_in_3: {
    planet: "sun",
    placementHouse: 3,
    key: "sun_in_3",

    principle:
      "The Sun in the 3rd house directs confidence, initiative and self-expression toward communication, courage and personal effort.",

    synthesis:
      "The person is encouraged to develop confidence through action, communication and the willingness to take initiative rather than waiting for circumstances to change.",

    psychology:
      "Self-belief grows when the person proves their ability through effort, learning and direct engagement with challenges.",

    areas: ["communication", "career", "education", "travel"],

    practicalEffects: [
      "Communication becomes more assertive.",
      "Initiative increases.",
      "Learning supports confidence.",
      "Short journeys or follow-ups become important."
    ],

    opportunities: [
      "Speak with confidence.",
      "Take initiative.",
      "Develop practical skills.",
      "Follow up on important matters."
    ],

    cautions: [
      "Avoid forceful communication.",
      "Do not dismiss others' views.",
      "Avoid acting purely to prove yourself."
    ],

    bestUse:
      "Build confidence through courageous action and clear communication.",

    dailyExpression:
      "A conversation, message or practical initiative today may require you to speak and act with greater confidence.",

    askSarathiExplanation:
      "The Sun activates the 3rd house, strengthening initiative, communication and personal courage.",

    lifeReportInterpretation:
      "Throughout life, self-confidence grows through communication, learning, initiative and the willingness to act independently.",

    confidence: 10,
  },

  sun_in_4: {
    planet: "sun",
    placementHouse: 4,
    key: "sun_in_4",

    principle:
      "The Sun in the 4th house directs identity and authority toward home, family, emotional foundations and inner security.",

    synthesis:
      "A strong sense of personal stability develops through creating a secure home environment and taking responsibility for family or domestic matters.",

    psychology:
      "The person needs inner stability and a sense of belonging before external achievement feels truly satisfying.",

    areas: ["home", "family", "property", "mind"],

    practicalEffects: [
      "Home matters receive attention.",
      "Family responsibilities become important.",
      "Property decisions may require leadership.",
      "Inner stability influences confidence."
    ],

    opportunities: [
      "Strengthen family foundations.",
      "Organise the home.",
      "Take responsibility for property matters.",
      "Create emotional stability."
    ],

    cautions: [
      "Avoid controlling family members.",
      "Do not carry authority struggles into the home.",
      "Avoid neglecting emotional needs."
    ],

    bestUse:
      "Create a stable inner and domestic foundation from which confidence can grow.",

    dailyExpression:
      "A home, family or property matter may require you to take responsibility and provide clear direction today.",

    askSarathiExplanation:
      "The Sun activates the 4th house, bringing identity and responsibility into home, family and emotional security.",

    lifeReportInterpretation:
      "Throughout life, confidence and purpose are strongly influenced by family foundations, home life and the creation of emotional stability.",

    confidence: 10,
  },

  sun_in_5: {
    planet: "sun",
    placementHouse: 5,
    key: "sun_in_5",

    principle:
      "The Sun in the 5th house directs confidence and identity toward creativity, intelligence, children and self-expression.",

    synthesis:
      "The person is naturally encouraged to express individuality through creativity, leadership, learning and the desire to produce something personally meaningful.",

    psychology:
      "Recognition feels especially satisfying when it comes from genuine talent, creativity or the ability to inspire others.",

    areas: ["education", "children", "mind", "publicImage"],

    practicalEffects: [
      "Creative confidence increases.",
      "Ideas seek expression.",
      "Children or mentoring may require attention.",
      "Leadership through knowledge becomes stronger."
    ],

    opportunities: [
      "Create something meaningful.",
      "Share your knowledge.",
      "Mentor others.",
      "Express ideas confidently."
    ],

    cautions: [
      "Avoid seeking constant recognition.",
      "Do not become overly proud of your ideas.",
      "Avoid risky decisions made for excitement."
    ],

    bestUse:
      "Use confidence to create, teach and inspire without becoming attached to applause.",

    dailyExpression:
      "A creative idea, learning opportunity or matter involving children may bring you into a more visible role today.",

    askSarathiExplanation:
      "The Sun activates the 5th house, strengthening creativity, intelligence, leadership and self-expression.",

    lifeReportInterpretation:
      "Throughout life, confidence develops through creativity, learning, leadership and the ability to express personal intelligence meaningfully.",

    confidence: 10,
  },

  sun_in_6: {
    planet: "sun",
    placementHouse: 6,
    key: "sun_in_6",

    principle:
      "The Sun in the 6th house directs identity, authority and vitality toward work, service, discipline and overcoming practical challenges.",

    synthesis:
      "Confidence develops through competence, responsibility and the ability to handle difficult situations efficiently. The person may become strongest when solving problems others avoid.",

    psychology:
      "Self-respect grows through usefulness, discipline and the ability to remain capable under pressure.",

    areas: ["career", "health", "mind", "communication"],

    practicalEffects: [
      "Work responsibilities increase.",
      "Problem-solving becomes important.",
      "Health routines need attention.",
      "Professional competence becomes visible."
    ],

    opportunities: [
      "Take responsibility.",
      "Improve routines.",
      "Solve pending problems.",
      "Demonstrate professional competence."
    ],

    cautions: [
      "Avoid workplace ego clashes.",
      "Do not ignore physical limits.",
      "Avoid becoming overly critical."
    ],

    bestUse:
      "Build confidence through discipline, service and practical problem-solving.",

    dailyExpression:
      "A work, health or responsibility-related matter may require confident and disciplined action today.",

    askSarathiExplanation:
      "The Sun activates the 6th house, directing leadership and confidence toward work, service and practical challenges.",

    lifeReportInterpretation:
      "Throughout life, authority and confidence develop through discipline, service and the ability to overcome practical obstacles.",

    confidence: 10,
  },
  sun_in_7: {
  planet: "sun",
  placementHouse: 7,
  key: "sun_in_7",

  principle:
    "The Sun in the 7th house directs identity, authority and self-expression toward partnerships, relationships and one-to-one interactions.",

  synthesis:
    "Personal confidence develops through important relationships, collaboration and learning how to balance individual authority with the needs of others.",

  psychology:
    "The person wants to feel respected and recognised within relationships. Partnership becomes an important arena for developing confidence without losing individuality.",

  areas: ["relationships", "communication", "career", "publicImage"],

  practicalEffects: [
    "Partnership matters become prominent.",
    "Important one-to-one conversations arise.",
    "Clients or collaborators require attention.",
    "Relationship dynamics become more visible."
  ],

  opportunities: [
    "Strengthen important partnerships.",
    "Negotiate confidently.",
    "Clarify expectations.",
    "Lead through cooperation."
  ],

  cautions: [
    "Avoid dominating relationships.",
    "Do not turn disagreement into an ego contest.",
    "Avoid demanding recognition from others."
  ],

  bestUse:
    "Balance confidence with cooperation so that partnerships become mutually strengthening.",

  dailyExpression:
    "A partner, client or important one-to-one conversation may require confident but cooperative handling today.",

  askSarathiExplanation:
    "The Sun activates the 7th house, bringing greater focus to partnerships, agreements and the balance between self and others.",

  lifeReportInterpretation:
    "Throughout life, important relationships become a major arena for developing confidence, leadership and the ability to balance individuality with partnership.",

  confidence: 10,
},

sun_in_8: {
  planet: "sun",
  placementHouse: 8,
  key: "sun_in_8",

  principle:
    "The Sun in the 8th house directs identity and awareness toward transformation, shared resources, hidden matters and deeper investigation.",

  synthesis:
    "Confidence develops through confronting complexity, adapting to significant changes and understanding matters that are not immediately visible.",

  psychology:
    "The person may be drawn toward deeper understanding and feels stronger when uncertainty can be examined rather than avoided.",

  areas: ["hiddenMatters", "mind", "money", "spirituality"],

  practicalEffects: [
    "Private matters require attention.",
    "Shared financial issues may become important.",
    "Research reveals useful information.",
    "A deeper reassessment may become necessary."
  ],

  opportunities: [
    "Investigate carefully.",
    "Address unresolved matters.",
    "Review shared resources.",
    "Use change constructively."
  ],

  cautions: [
    "Avoid power struggles.",
    "Do not force answers prematurely.",
    "Avoid becoming controlling during uncertainty."
  ],

  bestUse:
    "Use courage and self-awareness to understand complex situations and manage change constructively.",

  dailyExpression:
    "A private, financial or unresolved matter may require deeper investigation and clear judgement today.",

  askSarathiExplanation:
    "The Sun activates the 8th house, directing awareness toward transformation, shared resources and matters beneath the surface.",

  lifeReportInterpretation:
    "Throughout life, confidence develops through periods of transformation, deeper investigation and learning to remain centred when circumstances change.",

  confidence: 10,
},

sun_in_9: {
  planet: "sun",
  placementHouse: 9,
  key: "sun_in_9",

  principle:
    "The Sun in the 9th house directs identity and purpose toward higher knowledge, principles, guidance and broader understanding.",

  synthesis:
    "Confidence grows through education, meaningful experience and the development of a clear personal philosophy. Knowledge becomes an important source of direction.",

  psychology:
    "The person needs life to have meaning and often feels strongest when actions are aligned with deeply held principles and a broader sense of purpose.",

  areas: ["education", "spirituality", "travel", "mind"],

  practicalEffects: [
    "Higher learning becomes important.",
    "Guidance may influence a decision.",
    "Travel can broaden perspective.",
    "Personal beliefs become clearer."
  ],

  opportunities: [
    "Seek deeper knowledge.",
    "Learn from a mentor.",
    "Clarify long-term principles.",
    "Broaden your perspective."
  ],

  cautions: [
    "Avoid self-righteousness.",
    "Do not assume your perspective is the only correct one.",
    "Avoid confidence without sufficient knowledge."
  ],

  bestUse:
    "Use knowledge and principle to give confidence a meaningful direction.",

  dailyExpression:
    "Advice, learning or a broader perspective may help clarify an important decision today.",

  askSarathiExplanation:
    "The Sun activates the 9th house, connecting confidence and purpose with higher learning, guidance and principles.",

  lifeReportInterpretation:
    "Throughout life, identity and purpose develop through knowledge, meaningful experiences, principles and the search for a broader understanding of life.",

  confidence: 10,
},

sun_in_10: {
  planet: "sun",
  placementHouse: 10,
  key: "sun_in_10",

  principle:
    "The Sun in the 10th house directs authority, identity and purpose toward career, responsibility, status and public contribution.",

  synthesis:
    "The need to accomplish something meaningful becomes highly visible. Leadership, responsibility and professional recognition can become important channels for self-expression.",

  psychology:
    "The person often derives confidence from achievement, responsibility and knowing that their contribution is recognised or respected.",

  areas: ["career", "publicImage", "money", "communication"],

  practicalEffects: [
    "Professional visibility increases.",
    "Leadership responsibilities become important.",
    "Career decisions require confidence.",
    "Authority figures may play a significant role."
  ],

  opportunities: [
    "Take professional responsibility.",
    "Lead visibly.",
    "Present important work.",
    "Clarify career direction."
  ],

  cautions: [
    "Avoid status-driven decisions.",
    "Do not create unnecessary authority conflicts.",
    "Avoid allowing work to define your entire identity."
  ],

  bestUse:
    "Use authority responsibly and allow professional achievement to serve a meaningful purpose.",

  dailyExpression:
    "Career visibility or an important professional responsibility may place you in a leadership position today.",

  askSarathiExplanation:
    "The Sun activates the 10th house, strongly emphasising career, authority, responsibility and public visibility.",

  lifeReportInterpretation:
    "Throughout life, career and public contribution become important arenas for developing authority, confidence and a clear sense of purpose.",

  confidence: 10,
},

sun_in_11: {
  planet: "sun",
  placementHouse: 11,
  key: "sun_in_11",

  principle:
    "The Sun in the 11th house directs confidence and purpose toward gains, networks, recognition and long-term ambitions.",

  synthesis:
    "Personal goals gain momentum through influential connections, leadership within groups and the ability to translate ambition into measurable achievement.",

  psychology:
    "The person feels motivated by progress toward meaningful goals and often wants their contribution to be recognised within a wider community or network.",

  areas: ["career", "money", "relationships", "publicImage"],

  practicalEffects: [
    "Long-term goals receive attention.",
    "Professional networks become important.",
    "Recognition may create opportunities.",
    "Progress toward an ambition becomes visible."
  ],

  opportunities: [
    "Strengthen valuable networks.",
    "Clarify long-term goals.",
    "Take leadership within a group.",
    "Use visibility constructively."
  ],

  cautions: [
    "Avoid treating relationships only as opportunities.",
    "Do not compete unnecessarily for recognition.",
    "Avoid unrealistic ambitions."
  ],

  bestUse:
    "Use leadership and strong networks to advance goals that have lasting value.",

  dailyExpression:
    "A connection, group or professional network may help move an important long-term goal forward today.",

  askSarathiExplanation:
    "The Sun activates the 11th house, bringing confidence and visibility into networks, gains and long-term ambitions.",

  lifeReportInterpretation:
    "Throughout life, confidence grows through achievement, influential networks and the pursuit of meaningful long-term goals.",

  confidence: 10,
},

sun_in_12: {
  planet: "sun",
  placementHouse: 12,
  key: "sun_in_12",

  principle:
    "The Sun in the 12th house directs identity and awareness toward solitude, release, foreign environments, private activity and inner development.",

  synthesis:
    "A quieter form of confidence develops through reflection, work performed away from immediate recognition and learning when to release excessive attachment to external validation.",

  psychology:
    "The person may periodically need distance from external expectations in order to reconnect with an internal sense of purpose.",

  areas: ["spirituality", "mind", "travel", "hiddenMatters"],

  practicalEffects: [
    "Private work becomes important.",
    "Rest and reflection improve clarity.",
    "Foreign matters may receive attention.",
    "A need for temporary withdrawal may arise."
  ],

  opportunities: [
    "Reflect on priorities.",
    "Complete work behind the scenes.",
    "Create space for rest.",
    "Develop inner clarity."
  ],

  cautions: [
    "Avoid unnecessary isolation.",
    "Do not escape responsibilities.",
    "Avoid allowing lack of recognition to weaken confidence."
  ],

  bestUse:
    "Develop confidence that does not depend entirely upon external recognition.",

  dailyExpression:
    "Quiet work, reflection or a matter handled behind the scenes may be more productive than seeking immediate visibility today.",

  askSarathiExplanation:
    "The Sun activates the 12th house, directing attention toward reflection, private matters, release and inner purpose.",

  lifeReportInterpretation:
    "Throughout life, a deeper sense of identity develops through reflection, periods of withdrawal and learning to find purpose beyond external recognition.",

  confidence: 10,
},
moon_in_1: {
  planet: "moon",
  placementHouse: 1,
  key: "moon_in_1",

  principle:
    "The Moon in the 1st house brings the mind, emotions and instinctive responses directly into the personality and self-expression.",

  synthesis:
    "The person experiences life personally and reacts strongly to changing circumstances. Emotional state can directly influence confidence, behaviour and physical presence.",

  psychology:
    "The person needs emotional responsiveness and a sense of personal connection to feel centred. Mood and identity can become closely linked.",

  areas: ["mind", "health", "relationships", "publicImage"],

  practicalEffects: [
    "Emotions become more visible.",
    "Personal needs receive greater attention.",
    "Sensitivity to surroundings increases.",
    "Mood influences decisions."
  ],

  opportunities: [
    "Acknowledge emotional needs.",
    "Respond rather than react.",
    "Prioritise self-care.",
    "Use intuition consciously."
  ],

  cautions: [
    "Avoid mood-driven decisions.",
    "Do not absorb every external influence.",
    "Avoid taking everything personally."
  ],

  bestUse:
    "Use emotional awareness to understand yourself clearly without allowing temporary moods to control direction.",

  dailyExpression:
    "Your mood may strongly shape how you experience the day, making emotional self-awareness especially useful.",

  askSarathiExplanation:
    "The Moon activates the 1st house, bringing the mind, emotions and instinctive responses directly into personal experience.",

  lifeReportInterpretation:
    "Throughout life, emotional awareness and adaptability become central to identity, confidence and the way the person responds to changing circumstances.",

  confidence: 10,
},

moon_in_2: {
  planet: "moon",
  placementHouse: 2,
  key: "moon_in_2",

  principle:
    "The Moon in the 2nd house directs emotional attention toward family, speech, wealth and personal security.",

  synthesis:
    "Emotional stability is often connected with financial security, family support and the ability to express feelings through speech.",

  psychology:
    "The person tends to feel secure when resources are stable and relationships with family provide emotional reassurance.",

  areas: ["money", "family", "communication", "mind"],

  practicalEffects: [
    "Financial security feels more important.",
    "Family matters affect mood.",
    "Speech becomes emotionally expressive.",
    "Spending may respond to emotional needs."
  ],

  opportunities: [
    "Review finances calmly.",
    "Strengthen family bonds.",
    "Communicate with sensitivity.",
    "Build practical security."
  ],

  cautions: [
    "Avoid emotional spending.",
    "Do not let mood affect financial judgement.",
    "Avoid sensitive or reactive speech."
  ],

  bestUse:
    "Create emotional security through responsible financial choices and supportive communication.",

  dailyExpression:
    "Money, family or an important conversation may have a stronger emotional impact than usual today.",

  askSarathiExplanation:
    "The Moon activates the 2nd house, linking emotional security with money, family, values and communication.",

  lifeReportInterpretation:
    "Throughout life, emotional stability is closely connected with family bonds, financial security and the ability to communicate feelings effectively.",

  confidence: 10,
},

moon_in_3: {
  planet: "moon",
  placementHouse: 3,
  key: "moon_in_3",

  principle:
    "The Moon in the 3rd house directs the mind and emotions toward communication, learning, initiative and everyday movement.",

  synthesis:
    "Thoughts and feelings are processed through conversation, writing and active engagement. Emotional clarity often improves through expression and movement.",

  psychology:
    "The person feels mentally settled when able to communicate freely, stay curious and remain engaged with the immediate environment.",

  areas: ["communication", "education", "travel", "mind"],

  practicalEffects: [
    "Communication becomes emotionally important.",
    "Messages and follow-ups increase.",
    "Short journeys may affect mood.",
    "Learning responds to curiosity."
  ],

  opportunities: [
    "Express your thoughts.",
    "Write or journal.",
    "Follow up on important matters.",
    "Learn through conversation."
  ],

  cautions: [
    "Avoid reactive communication.",
    "Do not change decisions with every mood.",
    "Avoid scattered thinking."
  ],

  bestUse:
    "Use communication to organise emotions and turn intuition into practical understanding.",

  dailyExpression:
    "A message, conversation or short journey may strongly influence your mood or priorities today.",

  askSarathiExplanation:
    "The Moon activates the 3rd house, connecting emotional awareness with communication, learning and immediate action.",

  lifeReportInterpretation:
    "Throughout life, emotional intelligence develops through communication, curiosity and the ability to express changing thoughts and feelings.",

  confidence: 10,
},

moon_in_4: {
  planet: "moon",
  placementHouse: 4,
  key: "moon_in_4",

  principle:
    "The Moon in the 4th house strongly connects the mind and emotions with home, family, comfort and inner security.",

  synthesis:
    "Emotional wellbeing is deeply influenced by the domestic environment. A supportive home and sense of belonging become important sources of stability.",

  psychology:
    "The person has a strong need for emotional safety and tends to recover best in familiar, supportive surroundings.",

  areas: ["home", "family", "mind", "property"],

  practicalEffects: [
    "Home life strongly affects mood.",
    "Family needs become more noticeable.",
    "Rest restores emotional balance.",
    "Domestic matters receive attention."
  ],

  opportunities: [
    "Create a peaceful environment.",
    "Spend time with family.",
    "Rest and recover.",
    "Strengthen emotional foundations."
  ],

  cautions: [
    "Avoid excessive withdrawal.",
    "Do not let family moods control your own.",
    "Avoid becoming overly attached to comfort."
  ],

  bestUse:
    "Strengthen inner stability by creating a supportive emotional and domestic environment.",

  dailyExpression:
    "Home, family or the need for emotional comfort may become especially important today.",

  askSarathiExplanation:
    "The Moon activates the 4th house, naturally emphasising home, family, comfort and emotional security.",

  lifeReportInterpretation:
    "Throughout life, home, family and emotional belonging play a central role in psychological wellbeing and inner stability.",

  confidence: 10,
},

moon_in_5: {
  planet: "moon",
  placementHouse: 5,
  key: "moon_in_5",

  principle:
    "The Moon in the 5th house directs emotional awareness toward creativity, learning, children, affection and self-expression.",

  synthesis:
    "Feelings seek creative expression. Emotional fulfilment may come through learning, romance, children, mentoring or activities that allow imagination to flow.",

  psychology:
    "The person feels emotionally nourished when able to create, express affection and receive a warm response to personal ideas or feelings.",

  areas: ["children", "education", "mind", "relationships"],

  practicalEffects: [
    "Creativity becomes emotionally rewarding.",
    "Children may receive more attention.",
    "Romantic feelings become more noticeable.",
    "Learning follows personal interest."
  ],

  opportunities: [
    "Create something.",
    "Spend time with children.",
    "Express affection.",
    "Learn through enjoyment."
  ],

  cautions: [
    "Avoid emotional speculation.",
    "Do not seek constant reassurance.",
    "Avoid making romantic decisions from temporary moods."
  ],

  bestUse:
    "Channel emotion into creativity, affection and meaningful self-expression.",

  dailyExpression:
    "A creative, romantic or children-related matter may bring stronger emotional involvement today.",

  askSarathiExplanation:
    "The Moon activates the 5th house, connecting emotions with creativity, learning, affection and children.",

  lifeReportInterpretation:
    "Throughout life, emotional fulfilment often comes through creativity, learning, children and the ability to express affection openly.",

  confidence: 10,
},

moon_in_6: {
  planet: "moon",
  placementHouse: 6,
  key: "moon_in_6",

  principle:
    "The Moon in the 6th house directs emotional attention toward work, health, routine, service and practical challenges.",

  synthesis:
    "The mind becomes highly responsive to workload and daily responsibilities. Emotional balance improves when routines are organised and practical problems are handled steadily.",

  psychology:
    "The person can become emotionally sensitive to disorder, unfinished work or health concerns and often feels calmer after restoring structure.",

  areas: ["health", "career", "mind", "communication"],

  practicalEffects: [
    "Workload affects mood.",
    "Health routines require attention.",
    "Small problems feel more noticeable.",
    "Helping others can feel emotionally rewarding."
  ],

  opportunities: [
    "Organise your routine.",
    "Address pending tasks.",
    "Take care of health.",
    "Be practically supportive."
  ],

  cautions: [
    "Avoid worrying over minor problems.",
    "Do not absorb workplace stress.",
    "Avoid neglecting rest."
  ],

  bestUse:
    "Use practical routines and steady problem-solving to create emotional stability.",

  dailyExpression:
    "Work, health or an unfinished responsibility may occupy more mental space than usual today.",

  askSarathiExplanation:
    "The Moon activates the 6th house, linking emotional wellbeing with work, health, service and daily routines.",

  lifeReportInterpretation:
    "Throughout life, emotional balance improves through useful routines, practical service and learning how to manage stress without becoming consumed by it.",

  confidence: 10,
},
moon_in_7: {
  planet: "moon",
  placementHouse: 7,
  key: "moon_in_7",

  principle:
    "The Moon in the 7th house directs emotional attention toward partnerships, relationships, clients and one-to-one interactions.",

  synthesis:
    "Emotional wellbeing becomes closely connected with the quality of important relationships. Cooperation, responsiveness and mutual understanding strongly influence the person's experience.",

  psychology:
    "The person feels emotionally secure when relationships provide responsiveness, companionship and a sense of being understood.",

  areas: ["relationships", "communication", "mind", "career"],

  practicalEffects: [
    "Relationship matters receive more attention.",
    "A partner's mood may influence your own.",
    "Client interactions become important.",
    "One-to-one conversations carry emotional weight."
  ],

  opportunities: [
    "Listen carefully.",
    "Strengthen important relationships.",
    "Respond with empathy.",
    "Discuss expectations openly."
  ],

  cautions: [
    "Avoid emotional dependency.",
    "Do not mirror another person's mood automatically.",
    "Avoid making relationship decisions from temporary feelings."
  ],

  bestUse:
    "Use emotional awareness to create greater understanding and balance within important relationships.",

  dailyExpression:
    "A partner, client or important conversation may have a stronger emotional influence on your day than usual.",

  askSarathiExplanation:
    "The Moon activates the 7th house, directing emotional attention toward partnerships, relationships and one-to-one interactions.",

  lifeReportInterpretation:
    "Throughout life, relationships become an important source of emotional learning, requiring a balance between responsiveness to others and inner stability.",

  confidence: 10,
},

moon_in_8: {
  planet: "moon",
  placementHouse: 8,
  key: "moon_in_8",

  principle:
    "The Moon in the 8th house directs the mind and emotions toward transformation, vulnerability, shared resources and matters beneath the surface.",

  synthesis:
    "Emotional experiences may be processed deeply rather than superficially. Change, uncertainty and private matters can stimulate introspection and psychological growth.",

  psychology:
    "The person needs emotional depth and may instinctively look beneath appearances, but must learn not to become overwhelmed by uncertainty or hidden concerns.",

  areas: ["hiddenMatters", "mind", "money", "spirituality"],

  practicalEffects: [
    "Private concerns occupy attention.",
    "Shared financial matters may become important.",
    "Emotions become more introspective.",
    "Previously hidden information may require consideration."
  ],

  opportunities: [
    "Reflect deeply.",
    "Address unresolved emotions.",
    "Review shared resources.",
    "Investigate before reacting."
  ],

  cautions: [
    "Avoid emotional suspicion.",
    "Do not assume the worst.",
    "Avoid becoming consumed by uncertainty."
  ],

  bestUse:
    "Use emotional depth to understand what needs transformation rather than fearing what is uncertain.",

  dailyExpression:
    "A private concern, shared financial matter or deeper emotional issue may require careful attention today.",

  askSarathiExplanation:
    "The Moon activates the 8th house, drawing emotional attention toward transformation, shared resources and matters that require deeper understanding.",

  lifeReportInterpretation:
    "Throughout life, emotional maturity develops through periods of change, deep introspection and learning to remain psychologically steady during uncertainty.",

  confidence: 10,
},

moon_in_9: {
  planet: "moon",
  placementHouse: 9,
  key: "moon_in_9",

  principle:
    "The Moon in the 9th house directs emotional attention toward higher learning, guidance, belief, travel and the search for meaning.",

  synthesis:
    "Emotional wellbeing improves when life feels meaningful and perspective continues to expand through learning, guidance and new experiences.",

  psychology:
    "The person feels emotionally nourished by knowledge, meaningful beliefs and experiences that provide a broader understanding of life.",

  areas: ["education", "spirituality", "travel", "mind"],

  practicalEffects: [
    "Learning influences mood positively.",
    "Guidance may feel especially meaningful.",
    "Travel can refresh perspective.",
    "Beliefs or long-term direction receive attention."
  ],

  opportunities: [
    "Learn something meaningful.",
    "Seek wise guidance.",
    "Broaden your perspective.",
    "Explore spiritual or philosophical interests."
  ],

  cautions: [
    "Avoid changing beliefs purely from emotion.",
    "Do not idealise mentors.",
    "Avoid using optimism to ignore practical realities."
  ],

  bestUse:
    "Use learning and broader perspective to create emotional clarity and meaningful direction.",

  dailyExpression:
    "Advice, learning, travel or a broader perspective may significantly improve emotional clarity today.",

  askSarathiExplanation:
    "The Moon activates the 9th house, connecting emotional wellbeing with learning, guidance, belief and broader perspective.",

  lifeReportInterpretation:
    "Throughout life, emotional growth is supported by education, meaningful beliefs, guidance and experiences that continually broaden perspective.",

  confidence: 10,
},

moon_in_10: {
  planet: "moon",
  placementHouse: 10,
  key: "moon_in_10",

  principle:
    "The Moon in the 10th house directs emotional attention toward career, responsibility, visibility and public contribution.",

  synthesis:
    "Professional circumstances strongly influence the emotional state. The person often needs to feel useful, recognised and responsive to changing responsibilities.",

  psychology:
    "The person feels emotionally fulfilled when work creates a sense of relevance and connection, although professional feedback can strongly affect mood.",

  areas: ["career", "publicImage", "mind", "communication"],

  practicalEffects: [
    "Career matters occupy the mind.",
    "Professional visibility increases.",
    "Changing responsibilities require adaptation.",
    "Public or workplace feedback carries greater emotional weight."
  ],

  opportunities: [
    "Respond flexibly at work.",
    "Strengthen professional relationships.",
    "Take responsibility calmly.",
    "Understand changing priorities."
  ],

  cautions: [
    "Avoid letting workplace moods control your wellbeing.",
    "Do not seek constant professional reassurance.",
    "Avoid reacting emotionally to feedback."
  ],

  bestUse:
    "Combine emotional intelligence with adaptability to manage professional responsibilities effectively.",

  dailyExpression:
    "A career development, responsibility or interaction with someone at work may become the main focus of your attention today.",

  askSarathiExplanation:
    "The Moon activates the 10th house, directing the mind and emotions toward career, responsibility and public activity.",

  lifeReportInterpretation:
    "Throughout life, career and public contribution strongly influence emotional fulfilment, requiring the person to develop adaptability without depending entirely on external recognition.",

  confidence: 10,
},

moon_in_11: {
  planet: "moon",
  placementHouse: 11,
  key: "moon_in_11",

  principle:
    "The Moon in the 11th house directs emotional attention toward gains, friendships, networks and long-term aspirations.",

  synthesis:
    "Emotional satisfaction grows through supportive connections, progress toward meaningful goals and feeling part of a wider community.",

  psychology:
    "The person feels encouraged when surrounded by people who understand their aspirations and when there is visible movement toward future goals.",

  areas: ["relationships", "career", "money", "mind"],

  practicalEffects: [
    "Friends or networks receive attention.",
    "Long-term goals occupy the mind.",
    "A useful connection may emerge.",
    "Progress toward an aspiration improves mood."
  ],

  opportunities: [
    "Reconnect with supportive people.",
    "Review long-term goals.",
    "Build meaningful networks.",
    "Accept constructive support."
  ],

  cautions: [
    "Avoid depending on group approval.",
    "Do not compare your progress constantly.",
    "Avoid changing goals to satisfy others."
  ],

  bestUse:
    "Use supportive relationships and clear goals to create meaningful progress without becoming dependent on external approval.",

  dailyExpression:
    "A friend, professional connection or development around a long-term goal may influence your priorities today.",

  askSarathiExplanation:
    "The Moon activates the 11th house, connecting emotional attention with friendships, networks, gains and future aspirations.",

  lifeReportInterpretation:
    "Throughout life, emotional fulfilment is often connected with meaningful friendships, supportive networks and progress toward long-term aspirations.",

  confidence: 10,
},

moon_in_12: {
  planet: "moon",
  placementHouse: 12,
  key: "moon_in_12",

  principle:
    "The Moon in the 12th house directs the mind and emotions toward rest, solitude, release, foreign environments and the inner world.",

  synthesis:
    "The mind periodically needs withdrawal from external stimulation. Rest, reflection and private emotional processing become important for maintaining balance.",

  psychology:
    "The person may absorb subtle emotional influences easily and therefore benefits from periods of solitude in which feelings can settle without external pressure.",

  areas: ["mind", "spirituality", "travel", "hiddenMatters"],

  practicalEffects: [
    "The need for rest increases.",
    "Private thoughts become more noticeable.",
    "Foreign or distant matters may occupy attention.",
    "Emotional processing happens quietly."
  ],

  opportunities: [
    "Rest intentionally.",
    "Reflect privately.",
    "Meditate or journal.",
    "Release unnecessary emotional burdens."
  ],

  cautions: [
    "Avoid emotional isolation.",
    "Do not escape practical responsibilities.",
    "Avoid allowing worry to grow privately without perspective."
  ],

  bestUse:
    "Create enough quiet space for emotions to settle while remaining connected to practical reality.",

  dailyExpression:
    "You may benefit from more privacy, rest or reflection today, especially if recent events have been emotionally demanding.",

  askSarathiExplanation:
    "The Moon activates the 12th house, directing emotional attention toward rest, reflection, release and matters handled away from immediate visibility.",

  lifeReportInterpretation:
    "Throughout life, emotional balance depends partly on developing a healthy relationship with solitude, rest and inner reflection without becoming disconnected from everyday life.",

  confidence: 10,
},
mars_in_1: {
  planet: "mars",
  placementHouse: 1,
  key: "mars_in_1",

  principle:
    "Mars in the 1st house directs action, courage, physical energy and assertiveness into the personality and personal direction.",

  synthesis:
    "The person approaches life actively and prefers to confront circumstances directly. Initiative and courage can become major strengths when energy is directed constructively.",

  psychology:
    "The person feels strongest when able to act independently and make visible progress. Frustration can build when movement is restricted or decisions remain unresolved.",

  areas: ["health", "career", "mind", "communication"],

  practicalEffects: [
    "Energy and initiative increase.",
    "Personal decisions become more decisive.",
    "Competitive instincts strengthen.",
    "Physical activity becomes useful."
  ],

  opportunities: [
    "Take initiative.",
    "Exercise or move physically.",
    "Address a pending challenge.",
    "Act decisively."
  ],

  cautions: [
    "Avoid impulsive reactions.",
    "Do not become unnecessarily confrontational.",
    "Avoid pushing beyond physical limits."
  ],

  bestUse:
    "Direct strong personal energy toward purposeful action rather than unnecessary confrontation.",

  dailyExpression:
    "You may feel a stronger urge to act, decide or confront something directly today.",

  askSarathiExplanation:
    "Mars activates the 1st house, bringing action, courage and assertiveness directly into personal behaviour and decision-making.",

  lifeReportInterpretation:
    "Throughout life, courage, independence and decisive action become important parts of identity, with maturity developing through learning how to use personal strength constructively.",

  confidence: 10,
},

mars_in_2: {
  planet: "mars",
  placementHouse: 2,
  key: "mars_in_2",

  principle:
    "Mars in the 2nd house directs action and assertiveness toward wealth, family, speech and personal resources.",

  synthesis:
    "Strong effort can be directed toward building financial security and protecting family interests, while communication may become direct and forceful.",

  psychology:
    "The person tends to defend personal values strongly and may feel driven to establish financial independence through their own effort.",

  areas: ["money", "family", "communication", "career"],

  practicalEffects: [
    "Financial action becomes necessary.",
    "Speech becomes more direct.",
    "Family matters may require decisive handling.",
    "Motivation to increase resources strengthens."
  ],

  opportunities: [
    "Take practical financial action.",
    "Negotiate confidently.",
    "Protect important resources.",
    "Address family responsibilities directly."
  ],

  cautions: [
    "Avoid harsh speech.",
    "Do not make impulsive financial decisions.",
    "Avoid arguments over money or values."
  ],

  bestUse:
    "Use determination to strengthen resources while keeping communication measured.",

  dailyExpression:
    "A financial, family or communication matter may require decisive but carefully measured action today.",

  askSarathiExplanation:
    "Mars activates the 2nd house, directing action and assertiveness toward money, family, values and speech.",

  lifeReportInterpretation:
    "Throughout life, determination can become a powerful tool for building financial independence, provided assertiveness in family and communication matters remains constructive.",

  confidence: 10,
},

mars_in_3: {
  planet: "mars",
  placementHouse: 3,
  key: "mars_in_3",

  principle:
    "Mars in the 3rd house directs courage, initiative and competitive energy toward communication, skills and personal effort.",

  synthesis:
    "The person is encouraged to create progress through initiative rather than waiting for circumstances to improve. Communication and practical effort become powerful channels for action.",

  psychology:
    "Confidence grows through doing. The person often feels mentally stronger after taking action on something that previously felt uncertain.",

  areas: ["communication", "career", "education", "travel"],

  practicalEffects: [
    "Initiative increases.",
    "Communication becomes assertive.",
    "Follow-ups move quickly.",
    "Practical skills become useful."
  ],

  opportunities: [
    "Make the call.",
    "Start the conversation.",
    "Develop a practical skill.",
    "Take the first step."
  ],

  cautions: [
    "Avoid argumentative communication.",
    "Do not act before understanding the facts.",
    "Avoid unnecessary competition."
  ],

  bestUse:
    "Turn courage into practical initiative and productive communication.",

  dailyExpression:
    "A message, meeting or pending follow-up may move forward because you decide to take the initiative today.",

  askSarathiExplanation:
    "Mars activates the 3rd house, strengthening courage, communication, initiative and personal effort.",

  lifeReportInterpretation:
    "Throughout life, progress comes through courage, initiative and the willingness to develop skills and act independently.",

  confidence: 10,
},

mars_in_4: {
  planet: "mars",
  placementHouse: 4,
  key: "mars_in_4",

  principle:
    "Mars in the 4th house directs energy and assertiveness toward home, property, family and emotional foundations.",

  synthesis:
    "Considerable energy may be invested in creating security, managing domestic responsibilities or dealing with property. Inner restlessness needs constructive expression.",

  psychology:
    "The person strongly protects their private space and family interests, but emotional frustration can surface quickly when the home environment feels unsettled.",

  areas: ["home", "property", "family", "mind"],

  practicalEffects: [
    "Domestic activity increases.",
    "Property matters require action.",
    "Family issues may need direct handling.",
    "Restlessness at home becomes noticeable."
  ],

  opportunities: [
    "Complete a home project.",
    "Address a property matter.",
    "Protect family interests constructively.",
    "Channel restlessness into useful activity."
  ],

  cautions: [
    "Avoid arguments at home.",
    "Do not make property decisions impulsively.",
    "Avoid carrying external frustration into family interactions."
  ],

  bestUse:
    "Direct strong energy toward creating a more secure and functional home environment.",

  dailyExpression:
    "A home, family or property matter may require practical action rather than further discussion today.",

  askSarathiExplanation:
    "Mars activates the 4th house, directing energy toward home, property, family and emotional security.",

  lifeReportInterpretation:
    "Throughout life, substantial energy may be invested in home, family and property, with emotional maturity developing through learning how to handle domestic pressure constructively.",

  confidence: 10,
},

mars_in_5: {
  planet: "mars",
  placementHouse: 5,
  key: "mars_in_5",

  principle:
    "Mars in the 5th house directs action, courage and competitive energy toward creativity, intelligence, children and self-expression.",

  synthesis:
    "Ideas are pursued energetically and creative interests can become highly competitive or entrepreneurial. The person prefers active learning and decisive expression.",

  psychology:
    "The person feels energised by challenge, creation and the opportunity to prove an idea through action rather than theory alone.",

  areas: ["education", "children", "career", "mind"],

  practicalEffects: [
    "Creative drive increases.",
    "Competitive learning becomes productive.",
    "Children may require active guidance.",
    "Ideas encourage immediate action."
  ],

  opportunities: [
    "Act on a creative idea.",
    "Learn through practice.",
    "Take constructive leadership.",
    "Channel competition into improvement."
  ],

  cautions: [
    "Avoid speculative impulsiveness.",
    "Do not become overly competitive.",
    "Avoid forcing your ideas on others."
  ],

  bestUse:
    "Use courage and energy to turn creative intelligence into something tangible.",

  dailyExpression:
    "A creative idea, learning opportunity or children-related matter may prompt decisive action today.",

  askSarathiExplanation:
    "Mars activates the 5th house, combining action and competitive energy with creativity, intelligence and self-expression.",

  lifeReportInterpretation:
    "Throughout life, creativity and intelligence gain strength through courage, practical experimentation and the willingness to act on original ideas.",

  confidence: 10,
},

mars_in_6: {
  planet: "mars",
  placementHouse: 6,
  key: "mars_in_6",

  principle:
    "Mars in the 6th house directs courage, competition and problem-solving energy toward work, health, service and overcoming obstacles.",

  synthesis:
    "Mars finds a practical arena for its fighting spirit here. Challenges can stimulate productivity, resilience and the determination to solve problems directly.",

  psychology:
    "The person often becomes more focused when there is a concrete challenge to overcome and may perform particularly well under competitive or demanding circumstances.",

  areas: ["career", "health", "mind", "communication"],

  practicalEffects: [
    "Problem-solving becomes effective.",
    "Work competition may increase.",
    "Physical routines gain momentum.",
    "Pending obstacles can be confronted directly."
  ],

  opportunities: [
    "Tackle difficult work.",
    "Exercise consistently.",
    "Resolve a pending problem.",
    "Use competition constructively."
  ],

  cautions: [
    "Avoid unnecessary workplace conflict.",
    "Do not push the body excessively.",
    "Avoid turning every disagreement into a battle."
  ],

  bestUse:
    "Channel competitive energy into solving problems, improving routines and overcoming genuine obstacles.",

  dailyExpression:
    "A work, health or practical challenge may respond well to decisive action and sustained effort today.",

  askSarathiExplanation:
    "Mars activates the 6th house, directing courage and competitive energy toward work, health and practical problem-solving.",

  lifeReportInterpretation:
    "Throughout life, resilience develops through confronting challenges directly, with strong potential for disciplined work and effective problem-solving when competitive energy is well directed.",

  confidence: 10,
},
mars_in_7: {
  planet: "mars",
  placementHouse: 7,
  key: "mars_in_7",

  principle:
    "Mars in the 7th house directs action, assertion and competitive energy toward partnerships, relationships, clients and agreements.",

  synthesis:
    "Partnerships become an active arena requiring direct engagement, clear boundaries and constructive cooperation. Strong relationship dynamics can motivate action but may also produce conflict when neither side is willing to compromise.",

  psychology:
    "The person seeks direct and dynamic relationships and may become frustrated when important issues remain unresolved or when a partner avoids taking a clear position.",

  areas: ["relationships", "communication", "career", "mind"],

  practicalEffects: [
    "Partnership matters require action.",
    "Negotiations become more direct.",
    "Client interactions may become demanding.",
    "Relationship boundaries need clarification."
  ],

  opportunities: [
    "Address relationship issues directly.",
    "Negotiate confidently.",
    "Establish clear boundaries.",
    "Channel differences into productive cooperation."
  ],

  cautions: [
    "Avoid turning disagreement into confrontation.",
    "Do not compete unnecessarily with a partner.",
    "Avoid forcing immediate resolution."
  ],

  bestUse:
    "Use assertiveness to create clarity in partnerships without turning differences into unnecessary conflict.",

  dailyExpression:
    "A partner, client or important one-to-one interaction may require decisive but cooperative handling today.",

  askSarathiExplanation:
    "Mars activates the 7th house, directing assertiveness and action toward partnerships, agreements and one-to-one interactions.",

  lifeReportInterpretation:
    "Throughout life, partnerships teach the constructive use of assertiveness, boundaries and compromise, with strong relationships developing when personal strength is balanced with cooperation.",

  confidence: 10,
},

mars_in_8: {
  planet: "mars",
  placementHouse: 8,
  key: "mars_in_8",

  principle:
    "Mars in the 8th house directs force, courage and investigative energy toward transformation, shared resources, vulnerability and hidden matters.",

  synthesis:
    "The person can confront difficult or complex situations with determination. Energy is well suited to investigation, crisis management and resolving matters that require courage beneath the surface.",

  psychology:
    "The person dislikes feeling powerless in uncertain situations and may instinctively investigate, confront or attempt to control what is not immediately understood.",

  areas: ["hiddenMatters", "money", "mind", "health"],

  practicalEffects: [
    "Complex problems require decisive attention.",
    "Shared financial matters may need action.",
    "Research becomes intensive.",
    "An unresolved issue may surface."
  ],

  opportunities: [
    "Investigate thoroughly.",
    "Resolve a difficult issue.",
    "Review shared resources.",
    "Use pressure constructively."
  ],

  cautions: [
    "Avoid power struggles.",
    "Do not act recklessly during uncertainty.",
    "Avoid forcing hidden matters before sufficient facts are available."
  ],

  bestUse:
    "Use courage and investigative strength to resolve complex matters without trying to control every uncertainty.",

  dailyExpression:
    "A shared financial, private or unresolved matter may require deeper investigation and decisive action today.",

  askSarathiExplanation:
    "Mars activates the 8th house, directing force and problem-solving ability toward transformation, shared resources and complex matters.",

  lifeReportInterpretation:
    "Throughout life, courage and resilience develop through confronting complexity, managing periods of change and learning to use personal power constructively.",

  confidence: 10,
},

mars_in_9: {
  planet: "mars",
  placementHouse: 9,
  key: "mars_in_9",

  principle:
    "Mars in the 9th house directs action, courage and conviction toward higher learning, principles, travel and the pursuit of meaning.",

  synthesis:
    "Beliefs encourage action rather than remaining theoretical. The person may pursue knowledge, travel or meaningful goals with considerable determination and independence.",

  psychology:
    "The person wants beliefs to have practical relevance and can strongly defend principles that provide direction and purpose.",

  areas: ["education", "spirituality", "travel", "mind"],

  practicalEffects: [
    "Learning encourages action.",
    "Travel may require initiative.",
    "Strong convictions influence decisions.",
    "A mentor or belief may motivate progress."
  ],

  opportunities: [
    "Act on meaningful knowledge.",
    "Pursue advanced learning.",
    "Explore a new perspective.",
    "Take purposeful action."
  ],

  cautions: [
    "Avoid becoming dogmatic.",
    "Do not argue simply to defend your beliefs.",
    "Avoid impulsive travel or major decisions."
  ],

  bestUse:
    "Direct conviction toward purposeful action while remaining open to knowledge that challenges existing beliefs.",

  dailyExpression:
    "Learning, advice or a matter involving travel may encourage you to take a more decisive step today.",

  askSarathiExplanation:
    "Mars activates the 9th house, combining action and conviction with learning, principles, guidance and broader experience.",

  lifeReportInterpretation:
    "Throughout life, courage is strengthened through knowledge, meaningful experience and the willingness to act upon deeply held principles.",

  confidence: 10,
},

mars_in_10: {
  planet: "mars",
  placementHouse: 10,
  key: "mars_in_10",

  principle:
    "Mars in the 10th house directs action, ambition, courage and competitive ability toward career, responsibility and public achievement.",

  synthesis:
    "Professional life becomes a major outlet for initiative and determination. The person is inclined to act decisively, take responsibility and pursue tangible results.",

  psychology:
    "The person feels professionally engaged when there is movement, challenge and the opportunity to make a measurable impact rather than simply maintain the status quo.",

  areas: ["career", "publicImage", "money", "communication"],

  practicalEffects: [
    "Professional initiative increases.",
    "Leadership may be required.",
    "Competition becomes more visible.",
    "Important work can move quickly."
  ],

  opportunities: [
    "Take professional initiative.",
    "Lead a difficult project.",
    "Resolve a workplace obstacle.",
    "Turn ambition into measurable action."
  ],

  cautions: [
    "Avoid conflicts with authority.",
    "Do not become overly aggressive professionally.",
    "Avoid sacrificing judgement for speed."
  ],

  bestUse:
    "Channel ambition into decisive professional action while maintaining strategic discipline.",

  dailyExpression:
    "A career matter may move forward quickly if you take initiative and handle professional pressure constructively today.",

  askSarathiExplanation:
    "Mars activates the 10th house, directing ambition, courage and action toward career, responsibility and public achievement.",

  lifeReportInterpretation:
    "Throughout life, career can become a powerful outlet for ambition and leadership, with success developing through decisive action combined with professional discipline.",

  confidence: 10,
},

mars_in_11: {
  planet: "mars",
  placementHouse: 11,
  key: "mars_in_11",

  principle:
    "Mars in the 11th house directs ambition, initiative and competitive energy toward gains, networks and long-term objectives.",

  synthesis:
    "Goals are pursued actively and the person may use networks, teamwork and strategic relationships to create tangible progress toward ambitions.",

  psychology:
    "The person is energised by measurable progress and can become highly motivated when there is a challenging goal worth pursuing.",

  areas: ["career", "money", "relationships", "publicImage"],

  practicalEffects: [
    "Long-term goals gain momentum.",
    "Professional networks become active.",
    "Competitive opportunities may emerge.",
    "Effort can produce measurable gains."
  ],

  opportunities: [
    "Act on an important goal.",
    "Strengthen strategic networks.",
    "Pursue a measurable opportunity.",
    "Take initiative within a group."
  ],

  cautions: [
    "Avoid competing unnecessarily with friends or colleagues.",
    "Do not pursue gains at any cost.",
    "Avoid impatience with long-term goals."
  ],

  bestUse:
    "Use ambition and strategic relationships to convert long-term goals into practical progress.",

  dailyExpression:
    "A professional connection or opportunity may help move an important goal forward if you act on it today.",

  askSarathiExplanation:
    "Mars activates the 11th house, directing ambition and initiative toward gains, networks and long-term objectives.",

  lifeReportInterpretation:
    "Throughout life, determination and strategic action can produce significant gains, especially when ambition is supported by constructive networks and clearly defined goals.",

  confidence: 10,
},

mars_in_12: {
  planet: "mars",
  placementHouse: 12,
  key: "mars_in_12",

  principle:
    "Mars in the 12th house directs action and physical energy toward private activity, foreign environments, expenditure, release and matters operating behind the scenes.",

  synthesis:
    "Strong energy may operate privately rather than visibly. Productive outlets include behind-the-scenes work, foreign environments, disciplined retreat and completing matters that require focused effort away from distraction.",

  psychology:
    "Frustration may build when anger or motivation is suppressed rather than expressed constructively. The person benefits from private outlets for physical and mental energy.",

  areas: ["health", "travel", "hiddenMatters", "mind"],

  practicalEffects: [
    "Behind-the-scenes work becomes active.",
    "Foreign matters may require action.",
    "Energy expenditure increases.",
    "Restlessness may interfere with recovery."
  ],

  opportunities: [
    "Complete private work.",
    "Exercise constructively.",
    "Handle foreign matters.",
    "Release accumulated frustration."
  ],

  cautions: [
    "Avoid suppressed anger.",
    "Do not waste energy on invisible conflicts.",
    "Avoid excessive expenditure or physical exhaustion."
  ],

  bestUse:
    "Direct private energy toward purposeful work, recovery and constructive release rather than allowing frustration to accumulate.",

  dailyExpression:
    "Work behind the scenes, a foreign matter or the need to release accumulated tension may require attention today.",

  askSarathiExplanation:
    "Mars activates the 12th house, directing action and physical energy toward private matters, expenditure, foreign environments and release.",

  lifeReportInterpretation:
    "Throughout life, learning to manage hidden frustration and direct energy constructively behind the scenes becomes important for both effectiveness and wellbeing.",

  confidence: 10,
},
mercury_in_1: {
  planet: "mercury",
  placementHouse: 1,
  key: "mercury_in_1",

  principle:
    "Mercury in the 1st house brings intelligence, communication, curiosity and adaptability directly into the personality and personal approach.",

  synthesis:
    "The person approaches life through observation, analysis and communication. Adaptability and the ability to understand situations quickly become important personal strengths.",

  psychology:
    "The person feels mentally engaged when learning, exchanging ideas and making sense of changing circumstances. Intellectual stimulation strongly influences confidence.",

  areas: ["communication", "education", "mind", "career"],

  practicalEffects: [
    "Thinking becomes more active.",
    "Communication gains importance.",
    "Curiosity encourages learning.",
    "Personal decisions require analysis."
  ],

  opportunities: [
    "Communicate clearly.",
    "Learn something useful.",
    "Ask questions.",
    "Adapt intelligently."
  ],

  cautions: [
    "Avoid overthinking.",
    "Do not change direction unnecessarily.",
    "Avoid talking more than listening."
  ],

  bestUse:
    "Use curiosity and clear thinking to understand circumstances before choosing your direction.",

  dailyExpression:
    "A conversation, decision or new piece of information may strongly influence your direction today.",

  askSarathiExplanation:
    "Mercury activates the 1st house, bringing communication, analysis and adaptability directly into personal decisions and behaviour.",

  lifeReportInterpretation:
    "Throughout life, intelligence, communication and adaptability become important parts of identity and the person's ability to navigate changing circumstances.",

  confidence: 10,
},

mercury_in_2: {
  planet: "mercury",
  placementHouse: 2,
  key: "mercury_in_2",

  principle:
    "Mercury in the 2nd house directs intelligence, communication and commercial ability toward wealth, family, speech and personal resources.",

  synthesis:
    "Knowledge and communication can become practical resources. Financial decisions benefit from analysis, while speech may play an important role in creating opportunities.",

  psychology:
    "The person feels more secure when finances make logical sense and when ideas or skills can be converted into practical value.",

  areas: ["money", "communication", "family", "career"],

  practicalEffects: [
    "Financial calculations become important.",
    "Commercial thinking strengthens.",
    "Important family conversations arise.",
    "Communication may create financial value."
  ],

  opportunities: [
    "Review finances.",
    "Negotiate intelligently.",
    "Use communication skills.",
    "Develop a monetisable skill."
  ],

  cautions: [
    "Avoid over-analysing every expense.",
    "Do not use cleverness instead of honesty.",
    "Avoid inconsistent financial decisions."
  ],

  bestUse:
    "Use knowledge, communication and analysis to create practical financial stability.",

  dailyExpression:
    "A financial discussion, negotiation or useful piece of information may help you make a better practical decision today.",

  askSarathiExplanation:
    "Mercury activates the 2nd house, connecting intelligence and communication with money, family, speech and resources.",

  lifeReportInterpretation:
    "Throughout life, communication, knowledge and commercial intelligence can become important tools for building financial security and practical value.",

  confidence: 10,
},

mercury_in_3: {
  planet: "mercury",
  placementHouse: 3,
  key: "mercury_in_3",

  principle:
    "Mercury in the 3rd house strongly directs intelligence and communication toward learning, writing, skills, initiative and everyday information exchange.",

  synthesis:
    "The mind thrives through active communication and continuous learning. Writing, speaking, networking and practical skill development become natural channels for intelligence.",

  psychology:
    "The person needs mental variety and regular exchange of ideas. Curiosity is strengthened through direct interaction with the immediate environment.",

  areas: ["communication", "education", "travel", "career"],

  practicalEffects: [
    "Messages and conversations increase.",
    "Writing becomes productive.",
    "New information arrives quickly.",
    "Practical skills develop."
  ],

  opportunities: [
    "Write or communicate.",
    "Follow up.",
    "Learn a practical skill.",
    "Exchange useful information."
  ],

  cautions: [
    "Avoid scattered attention.",
    "Do not communicate without verifying facts.",
    "Avoid unnecessary mental restlessness."
  ],

  bestUse:
    "Turn curiosity into useful knowledge through focused communication and practical learning.",

  dailyExpression:
    "A message, call, meeting or useful piece of information may become important today.",

  askSarathiExplanation:
    "Mercury activates the 3rd house, strongly emphasising communication, learning, information exchange and practical skills.",

  lifeReportInterpretation:
    "Throughout life, communication and continuous learning become major strengths, particularly when curiosity is developed into practical expertise.",

  confidence: 10,
},

mercury_in_4: {
  planet: "mercury",
  placementHouse: 4,
  key: "mercury_in_4",

  principle:
    "Mercury in the 4th house directs intelligence and communication toward home, family, property, education and emotional foundations.",

  synthesis:
    "Mental clarity is influenced by the home environment. Discussion, planning and information become important tools for managing domestic, educational and property matters.",

  psychology:
    "The person feels more settled when the home environment allows conversation, learning and intellectual freedom.",

  areas: ["home", "family", "property", "education"],

  practicalEffects: [
    "Family discussions become important.",
    "Property matters require analysis.",
    "Learning at home becomes productive.",
    "Domestic planning receives attention."
  ],

  opportunities: [
    "Discuss family matters calmly.",
    "Research property decisions.",
    "Organise the home.",
    "Create space for learning."
  ],

  cautions: [
    "Avoid overthinking domestic issues.",
    "Do not intellectualise every emotion.",
    "Avoid constant changes to settled plans."
  ],

  bestUse:
    "Use clear communication and practical planning to strengthen home and family stability.",

  dailyExpression:
    "A family discussion, home decision or property-related detail may require careful thinking today.",

  askSarathiExplanation:
    "Mercury activates the 4th house, directing communication and analysis toward home, family, property and education.",

  lifeReportInterpretation:
    "Throughout life, learning, communication and thoughtful planning contribute significantly to domestic stability and the person's sense of security.",

  confidence: 10,
},

mercury_in_5: {
  planet: "mercury",
  placementHouse: 5,
  key: "mercury_in_5",

  principle:
    "Mercury in the 5th house directs intelligence and communication toward creativity, learning, children, judgement and self-expression.",

  synthesis:
    "Intellectual creativity becomes prominent. The person may enjoy learning, teaching, writing, analysing ideas and expressing intelligence in original ways.",

  psychology:
    "The person feels mentally fulfilled when able to explore ideas creatively, solve intellectual problems and share knowledge with others.",

  areas: ["education", "children", "communication", "mind"],

  practicalEffects: [
    "Creative thinking improves.",
    "Learning becomes enjoyable.",
    "Teaching or mentoring becomes useful.",
    "Ideas seek expression."
  ],

  opportunities: [
    "Develop a creative idea.",
    "Study something interesting.",
    "Teach or mentor.",
    "Communicate your thinking."
  ],

  cautions: [
    "Avoid over-analysing creativity.",
    "Do not become intellectually competitive.",
    "Avoid speculative decisions without sufficient facts."
  ],

  bestUse:
    "Combine analytical intelligence with creativity to develop ideas that are both original and useful.",

  dailyExpression:
    "A creative idea, learning opportunity or conversation involving children may stimulate your thinking today.",

  askSarathiExplanation:
    "Mercury activates the 5th house, combining intelligence and communication with creativity, learning and judgement.",

  lifeReportInterpretation:
    "Throughout life, intellectual creativity, education and communication can become important sources of fulfilment and personal expression.",

  confidence: 10,
},

mercury_in_6: {
  planet: "mercury",
  placementHouse: 6,
  key: "mercury_in_6",

  principle:
    "Mercury in the 6th house directs intelligence, analysis and communication toward work, health, service and practical problem-solving.",

  synthesis:
    "The analytical mind becomes highly useful for identifying problems, organising details and improving systems. Practical intelligence can become a significant professional strength.",

  psychology:
    "The person feels mentally satisfied when problems can be understood and solved, but may become restless when surrounded by disorder or unresolved details.",

  areas: ["career", "health", "communication", "mind"],

  practicalEffects: [
    "Detailed work requires attention.",
    "Problem-solving becomes productive.",
    "Work communication increases.",
    "Health routines may require analysis."
  ],

  opportunities: [
    "Solve a practical problem.",
    "Organise your workload.",
    "Improve a system.",
    "Review health routines."
  ],

  cautions: [
    "Avoid excessive worry.",
    "Do not become obsessed with minor details.",
    "Avoid critical communication."
  ],

  bestUse:
    "Use analytical intelligence to simplify problems and improve practical systems without becoming trapped in unnecessary detail.",

  dailyExpression:
    "A work detail, health routine or unresolved practical issue may become easier to solve through careful analysis today.",

  askSarathiExplanation:
    "Mercury activates the 6th house, directing analysis and communication toward work, health, service and problem-solving.",

  lifeReportInterpretation:
    "Throughout life, analytical ability can become a major strength in work and problem-solving, provided attention to detail does not develop into excessive worry.",

  confidence: 10,
},
mercury_in_7: {
  planet: "mercury",
  placementHouse: 7,
  key: "mercury_in_7",

  principle:
    "Mercury in the 7th house directs intelligence, communication and negotiation toward partnerships, relationships, clients and agreements.",

  synthesis:
    "Relationships benefit from dialogue, mental compatibility and the ability to discuss differences openly. Communication becomes central to cooperation and decision-making.",

  psychology:
    "The person feels more secure in relationships when ideas can be exchanged freely and agreements are clear rather than assumed.",

  areas: ["relationships", "communication", "career", "mind"],

  practicalEffects: [
    "Important discussions arise.",
    "Negotiations become productive.",
    "Client communication increases.",
    "Relationship decisions require clarity."
  ],

  opportunities: [
    "Discuss expectations.",
    "Negotiate intelligently.",
    "Listen carefully.",
    "Clarify agreements."
  ],

  cautions: [
    "Avoid over-analysing relationships.",
    "Do not use cleverness to avoid emotional honesty.",
    "Avoid changing agreements too frequently."
  ],

  bestUse:
    "Use clear communication and intelligent negotiation to strengthen important partnerships.",

  dailyExpression:
    "A partner, client or important discussion may require careful wording and clear reasoning today.",

  askSarathiExplanation:
    "Mercury activates the 7th house, directing communication and analysis toward partnerships, agreements and one-to-one interactions.",

  lifeReportInterpretation:
    "Throughout life, communication and intellectual compatibility become important foundations for successful relationships and partnerships.",

  confidence: 10,
},

mercury_in_8: {
  planet: "mercury",
  placementHouse: 8,
  key: "mercury_in_8",

  principle:
    "Mercury in the 8th house directs intelligence and analysis toward research, hidden information, shared resources and complex matters.",

  synthesis:
    "The mind is encouraged to investigate beneath the surface. Research, analysis and careful questioning can reveal information that is not immediately obvious.",

  psychology:
    "The person is mentally stimulated by complexity and often wants to understand what lies behind appearances, motives or unexplained situations.",

  areas: ["hiddenMatters", "money", "education", "mind"],

  practicalEffects: [
    "Research becomes productive.",
    "Hidden details may surface.",
    "Shared financial matters require analysis.",
    "Complex information needs careful review."
  ],

  opportunities: [
    "Investigate thoroughly.",
    "Review shared finances.",
    "Study specialist subjects.",
    "Ask precise questions."
  ],

  cautions: [
    "Avoid obsessive analysis.",
    "Do not assume suspicion equals insight.",
    "Avoid sharing confidential information carelessly."
  ],

  bestUse:
    "Use analytical depth to understand complex matters without becoming mentally consumed by them.",

  dailyExpression:
    "A hidden detail, financial matter or deeper question may require careful investigation today.",

  askSarathiExplanation:
    "Mercury activates the 8th house, directing analysis and communication toward hidden, shared and complex matters.",

  lifeReportInterpretation:
    "Throughout life, deep research, investigation and the ability to understand complexity can become important intellectual strengths.",

  confidence: 10,
},

mercury_in_9: {
  planet: "mercury",
  placementHouse: 9,
  key: "mercury_in_9",

  principle:
    "Mercury in the 9th house directs intelligence, learning and communication toward higher knowledge, philosophy, guidance and travel.",

  synthesis:
    "The mind seeks broader understanding through education, exploration and exposure to different viewpoints. Knowledge becomes increasingly meaningful when it connects practical reasoning with larger ideas.",

  psychology:
    "The person feels mentally fulfilled when learning expands perspective rather than simply accumulating facts.",

  areas: ["education", "spirituality", "travel", "communication"],

  practicalEffects: [
    "Higher learning becomes important.",
    "Travel may stimulate ideas.",
    "Teaching or guidance becomes useful.",
    "A broader perspective improves decisions."
  ],

  opportunities: [
    "Study deeply.",
    "Explore a new viewpoint.",
    "Teach or share knowledge.",
    "Seek informed guidance."
  ],

  cautions: [
    "Avoid intellectual arrogance.",
    "Do not debate simply to prove a point.",
    "Avoid confusing information with wisdom."
  ],

  bestUse:
    "Use learning and communication to broaden understanding and improve long-term judgement.",

  dailyExpression:
    "Learning, advice or exposure to a different perspective may reshape how you think about an important matter today.",

  askSarathiExplanation:
    "Mercury activates the 9th house, connecting communication and intelligence with higher learning, guidance and broader perspective.",

  lifeReportInterpretation:
    "Throughout life, education, travel and exposure to diverse ideas expand intellectual understanding and strengthen judgement.",

  confidence: 10,
},

mercury_in_10: {
  planet: "mercury",
  placementHouse: 10,
  key: "mercury_in_10",

  principle:
    "Mercury in the 10th house directs intelligence, communication and adaptability toward career, responsibility and public contribution.",

  synthesis:
    "Professional success is supported by communication, analysis, negotiation and the ability to adapt quickly to changing information or responsibilities.",

  psychology:
    "The person feels professionally engaged when work requires thinking, communication and continuous problem-solving rather than repetitive activity alone.",

  areas: ["career", "communication", "publicImage", "money"],

  practicalEffects: [
    "Professional communication becomes important.",
    "Meetings and decisions increase.",
    "Analytical ability gains visibility.",
    "Career plans may require adjustment."
  ],

  opportunities: [
    "Present ideas clearly.",
    "Negotiate professionally.",
    "Improve a work process.",
    "Use information strategically."
  ],

  cautions: [
    "Avoid changing professional direction too quickly.",
    "Do not over-promise.",
    "Avoid excessive workplace analysis without action."
  ],

  bestUse:
    "Use communication and adaptable thinking to create practical professional progress.",

  dailyExpression:
    "A meeting, message or piece of information may influence an important career decision today.",

  askSarathiExplanation:
    "Mercury activates the 10th house, directing intelligence and communication toward career, responsibility and public activity.",

  lifeReportInterpretation:
    "Throughout life, communication, analytical ability and adaptability can become major professional strengths and important sources of career development.",

  confidence: 10,
},

mercury_in_11: {
  planet: "mercury",
  placementHouse: 11,
  key: "mercury_in_11",

  principle:
    "Mercury in the 11th house directs communication, intelligence and networking ability toward gains, friendships and long-term goals.",

  synthesis:
    "Ideas gain value through connection with others. Networking, information exchange and strategic communication can create meaningful opportunities and support future objectives.",

  psychology:
    "The person enjoys mentally stimulating friendships and feels motivated when ideas contribute to visible progress toward future goals.",

  areas: ["career", "money", "relationships", "communication"],

  practicalEffects: [
    "Networking becomes productive.",
    "Useful information may create opportunity.",
    "Long-term planning improves.",
    "Friends or colleagues stimulate new ideas."
  ],

  opportunities: [
    "Expand your network.",
    "Share useful ideas.",
    "Review long-term plans.",
    "Connect with knowledgeable people."
  ],

  cautions: [
    "Avoid superficial networking.",
    "Do not spread yourself across too many goals.",
    "Avoid relying on promises without details."
  ],

  bestUse:
    "Use communication and strategic relationships to move long-term goals forward.",

  dailyExpression:
    "A conversation or connection may provide useful information for an important future goal today.",

  askSarathiExplanation:
    "Mercury activates the 11th house, linking communication and intelligence with networks, gains and long-term aspirations.",

  lifeReportInterpretation:
    "Throughout life, intelligent networking, communication and strategic planning can become important sources of opportunity and achievement.",

  confidence: 10,
},

mercury_in_12: {
  planet: "mercury",
  placementHouse: 12,
  key: "mercury_in_12",

  principle:
    "Mercury in the 12th house directs intelligence and communication toward private thought, reflection, foreign environments and matters operating behind the scenes.",

  synthesis:
    "The mind may work best away from constant external stimulation. Reflection, research, private planning and communication across distance can become important channels for intelligence.",

  psychology:
    "The person processes many thoughts internally and benefits from quiet periods that allow mental activity to settle into clearer understanding.",

  areas: ["mind", "travel", "hiddenMatters", "education"],

  practicalEffects: [
    "Private thinking increases.",
    "Behind-the-scenes planning becomes useful.",
    "Foreign communication may require attention.",
    "Mental rest becomes important."
  ],

  opportunities: [
    "Plan privately.",
    "Journal or reflect.",
    "Complete background research.",
    "Handle distant communication carefully."
  ],

  cautions: [
    "Avoid excessive mental isolation.",
    "Do not allow worry to circulate without action.",
    "Avoid unclear or secretive communication."
  ],

  bestUse:
    "Create quiet mental space for reflection, research and thoughtful planning without becoming disconnected from practical reality.",

  dailyExpression:
    "Quiet planning, private research or a conversation involving distance or foreign matters may be useful today.",

  askSarathiExplanation:
    "Mercury activates the 12th house, directing thought and communication toward reflection, private activity and distant or hidden matters.",

  lifeReportInterpretation:
    "Throughout life, the mind benefits from periods of solitude and reflection, with strong potential for research, private planning and understanding matters that require subtle analysis.",

  confidence: 10,
},
jupiter_in_1: {
  planet: "jupiter",
  placementHouse: 1,
  key: "jupiter_in_1",

  principle:
    "Jupiter in the 1st house brings wisdom, expansion, optimism, guidance and ethical understanding directly into the personality and personal direction.",

  synthesis:
    "The person grows through knowledge, experience and an expanding understanding of life. Confidence tends to strengthen when decisions are guided by perspective, principles and meaningful learning.",

  psychology:
    "The person often needs to feel that life is moving toward greater understanding and possibility. A sense of purpose and faith in future growth can strongly influence personal confidence.",

  areas: ["mind", "education", "spirituality", "publicImage"],

  practicalEffects: [
    "Confidence and perspective increase.",
    "Learning influences personal decisions.",
    "Others may seek advice or guidance.",
    "A broader view helps resolve uncertainty."
  ],

  opportunities: [
    "Invest in personal growth.",
    "Share useful knowledge.",
    "Take a broader perspective.",
    "Act according to sound principles."
  ],

  cautions: [
    "Avoid overconfidence.",
    "Do not assume optimism guarantees results.",
    "Avoid giving advice without understanding the full situation."
  ],

  bestUse:
    "Use knowledge, perspective and sound judgement to guide personal growth and important decisions.",

  dailyExpression:
    "Advice, learning or a broader understanding of a situation may increase your confidence and clarify your direction today.",

  askSarathiExplanation:
    "Jupiter activates the 1st house, bringing expansion, wisdom and broader perspective directly into identity and personal decision-making.",

  lifeReportInterpretation:
    "Throughout life, personal growth is strongly supported by knowledge, meaningful experience and the development of wisdom, perspective and principled judgement.",

  confidence: 10,
},

jupiter_in_2: {
  planet: "jupiter",
  placementHouse: 2,
  key: "jupiter_in_2",

  principle:
    "Jupiter in the 2nd house directs expansion, knowledge and judgement toward wealth, family, speech and personal resources.",

  synthesis:
    "Resources can grow through knowledge, sound judgement and long-term thinking. Family values, education and constructive communication may contribute significantly to stability.",

  psychology:
    "The person tends to associate security with abundance, knowledge and the ability to provide support or stability for themselves and others.",

  areas: ["money", "family", "communication", "education"],

  practicalEffects: [
    "Financial planning receives attention.",
    "Knowledge may create financial opportunity.",
    "Family support becomes meaningful.",
    "Speech can carry greater influence."
  ],

  opportunities: [
    "Think long term financially.",
    "Invest in useful knowledge.",
    "Communicate constructively.",
    "Strengthen family resources."
  ],

  cautions: [
    "Avoid excessive spending.",
    "Do not assume resources will always expand.",
    "Avoid promising more than can realistically be provided."
  ],

  bestUse:
    "Combine sound judgement with long-term planning to build resources that create lasting security.",

  dailyExpression:
    "A financial discussion, family matter or useful piece of advice may help you make a more constructive long-term decision today.",

  askSarathiExplanation:
    "Jupiter activates the 2nd house, connecting growth and wisdom with wealth, family, speech and personal resources.",

  lifeReportInterpretation:
    "Throughout life, knowledge, judgement and constructive values can support financial growth and create a stronger foundation for family and material security.",

  confidence: 10,
},

jupiter_in_3: {
  planet: "jupiter",
  placementHouse: 3,
  key: "jupiter_in_3",

  principle:
    "Jupiter in the 3rd house directs knowledge, perspective and growth toward communication, learning, skills and personal effort.",

  synthesis:
    "Ideas expand through communication and practical experience. Writing, teaching, learning and exchanging knowledge can become important ways of creating progress.",

  psychology:
    "The person feels mentally encouraged when ideas can be explored and shared, especially when learning has practical relevance to everyday life.",

  areas: ["communication", "education", "travel", "career"],

  practicalEffects: [
    "Communication carries useful insight.",
    "Learning opportunities increase.",
    "Teaching or advising becomes productive.",
    "Personal effort benefits from broader perspective."
  ],

  opportunities: [
    "Share knowledge.",
    "Develop a useful skill.",
    "Write or teach.",
    "Take an informed initiative."
  ],

  cautions: [
    "Avoid talking more than acting.",
    "Do not assume every idea deserves expansion.",
    "Avoid overlooking practical details."
  ],

  bestUse:
    "Turn knowledge into practical progress through communication, learning and consistent personal effort.",

  dailyExpression:
    "A conversation, message or learning opportunity may provide a useful perspective that helps you take the next step today.",

  askSarathiExplanation:
    "Jupiter activates the 3rd house, directing knowledge and growth toward communication, skills, learning and personal initiative.",

  lifeReportInterpretation:
    "Throughout life, communication and practical learning become important channels for expanding knowledge and turning understanding into useful experience.",

  confidence: 10,
},

jupiter_in_4: {
  planet: "jupiter",
  placementHouse: 4,
  key: "jupiter_in_4",

  principle:
    "Jupiter in the 4th house directs growth, wisdom and support toward home, family, education, property and inner stability.",

  synthesis:
    "The foundations of life can expand through education, supportive family relationships and the development of a stable home environment. Inner security grows through perspective and understanding.",

  psychology:
    "The person often feels strongest when home provides space for growth, learning and emotional generosity rather than merely physical comfort.",

  areas: ["home", "family", "property", "education"],

  practicalEffects: [
    "Home or family matters may improve through guidance.",
    "Property decisions benefit from long-term thinking.",
    "Education receives support.",
    "Domestic stability becomes important."
  ],

  opportunities: [
    "Strengthen family foundations.",
    "Make thoughtful property plans.",
    "Create a supportive home environment.",
    "Invest in education."
  ],

  cautions: [
    "Avoid excessive expectations from family.",
    "Do not overextend on property or comfort.",
    "Avoid assuming goodwill replaces practical planning."
  ],

  bestUse:
    "Use wisdom and long-term thinking to create stable foundations for home, family and personal development.",

  dailyExpression:
    "A home, family, education or property matter may benefit from patient guidance and a longer-term perspective today.",

  askSarathiExplanation:
    "Jupiter activates the 4th house, directing growth and wisdom toward home, family, property, education and emotional foundations.",

  lifeReportInterpretation:
    "Throughout life, family, education and stable foundations can become important sources of growth, with wisdom developing through the creation of a supportive inner and domestic life.",

  confidence: 10,
},

jupiter_in_5: {
  planet: "jupiter",
  placementHouse: 5,
  key: "jupiter_in_5",

  principle:
    "Jupiter in the 5th house directs wisdom, expansion and guidance toward intelligence, education, creativity, children and judgement.",

  synthesis:
    "Knowledge seeks creative expression and can develop into teaching, mentoring or meaningful intellectual contribution. Learning and guiding others become powerful channels for growth.",

  psychology:
    "The person feels fulfilled when knowledge can be understood deeply, expressed creatively and passed on in a way that benefits others.",

  areas: ["education", "children", "mind", "spirituality"],

  practicalEffects: [
    "Learning becomes rewarding.",
    "Teaching or mentoring opportunities arise.",
    "Creative judgement strengthens.",
    "Children may become a source of learning or focus."
  ],

  opportunities: [
    "Study deeply.",
    "Teach or mentor.",
    "Develop a meaningful idea.",
    "Guide children constructively."
  ],

  cautions: [
    "Avoid intellectual overconfidence.",
    "Do not assume good judgement removes all risk.",
    "Avoid excessive expectations from children or students."
  ],

  bestUse:
    "Use knowledge creatively and share wisdom in ways that help both personal and intellectual growth.",

  dailyExpression:
    "A learning, teaching, creative or children-related matter may bring a useful opportunity for growth today.",

  askSarathiExplanation:
    "Jupiter activates the 5th house, combining wisdom and expansion with education, creativity, children and intelligent judgement.",

  lifeReportInterpretation:
    "Throughout life, education, creativity, teaching and guidance can become major sources of fulfilment and avenues through which wisdom is developed and shared.",

  confidence: 10,
},

jupiter_in_6: {
  planet: "jupiter",
  placementHouse: 6,
  key: "jupiter_in_6",

  principle:
    "Jupiter in the 6th house directs knowledge, growth and judgement toward work, service, health, routines and practical challenges.",

  synthesis:
    "Wisdom develops through solving real problems and becoming useful to others. Knowledge can improve work systems, health practices and the ability to handle everyday responsibilities constructively.",

  psychology:
    "The person often wants work and service to have meaning and may feel fulfilled when knowledge can be applied to improve a difficult situation.",

  areas: ["career", "health", "education", "mind"],

  practicalEffects: [
    "Work problems benefit from perspective.",
    "Knowledge becomes practically useful.",
    "Health routines may improve through better understanding.",
    "Service or guidance becomes important."
  ],

  opportunities: [
    "Improve a work system.",
    "Apply knowledge practically.",
    "Develop healthier routines.",
    "Help solve a meaningful problem."
  ],

  cautions: [
    "Avoid taking on too many responsibilities.",
    "Do not overlook small problems because of optimism.",
    "Avoid giving advice when practical action is needed."
  ],

  bestUse:
    "Apply knowledge practically to improve routines, solve problems and make everyday work more meaningful.",

  dailyExpression:
    "A work, health or practical problem may become easier to manage when approached with greater knowledge and perspective today.",

  askSarathiExplanation:
    "Jupiter activates the 6th house, directing wisdom and growth toward work, health, service and practical problem-solving.",

  lifeReportInterpretation:
    "Throughout life, wisdom develops through service, practical responsibility and the ability to apply knowledge to real-world problems and everyday challenges.",

  confidence: 10,
},
jupiter_in_7: {
  planet: "jupiter",
  placementHouse: 7,
  key: "jupiter_in_7",

  principle:
    "Jupiter in the 7th house directs wisdom, growth and guidance toward partnerships, relationships, clients and agreements.",

  synthesis:
    "Important relationships can become significant sources of growth, perspective and opportunity. Partnership works best when both people encourage development while maintaining fairness and mutual respect.",

  psychology:
    "The person often seeks relationships that provide meaning, perspective and room for growth, and may naturally take on the role of adviser or guide within partnerships.",

  areas: ["relationships", "communication", "career", "publicImage"],

  practicalEffects: [
    "Partnership opportunities may expand.",
    "Helpful advice may come through another person.",
    "Client relationships can become productive.",
    "Important agreements benefit from broader perspective."
  ],

  opportunities: [
    "Strengthen constructive partnerships.",
    "Seek mutually beneficial agreements.",
    "Learn from another perspective.",
    "Use diplomacy and sound judgement."
  ],

  cautions: [
    "Avoid unrealistic expectations from partners.",
    "Do not assume goodwill removes the need for clear agreements.",
    "Avoid becoming overly advisory or self-righteous."
  ],

  bestUse:
    "Use wisdom, fairness and mutual growth to build partnerships that create value for everyone involved.",

  dailyExpression:
    "A partner, client or adviser may provide useful perspective or open an opportunity for constructive cooperation today.",

  askSarathiExplanation:
    "Jupiter activates the 7th house, bringing growth, wisdom and opportunity into partnerships, agreements and one-to-one relationships.",

  lifeReportInterpretation:
    "Throughout life, important partnerships can become major sources of learning and opportunity, with relationship success strengthened by fairness, wisdom and shared growth.",

  confidence: 10,
},

jupiter_in_8: {
  planet: "jupiter",
  placementHouse: 8,
  key: "jupiter_in_8",

  principle:
    "Jupiter in the 8th house directs wisdom, growth and understanding toward transformation, shared resources, hidden knowledge and deeper investigation.",

  synthesis:
    "Growth often comes through understanding complexity rather than avoiding it. Research, shared resources and transformative experiences can expand perspective and develop deeper wisdom.",

  psychology:
    "The person may seek meaning beneath surface events and can develop considerable insight through experiences that require adaptation, trust and deeper understanding.",

  areas: ["hiddenMatters", "money", "spirituality", "education"],

  practicalEffects: [
    "Complex matters become easier to understand.",
    "Shared financial planning receives attention.",
    "Research may reveal useful insight.",
    "A period of change can produce learning."
  ],

  opportunities: [
    "Study a complex subject.",
    "Review shared resources carefully.",
    "Seek deeper understanding.",
    "Use change as an opportunity for growth."
  ],

  cautions: [
    "Avoid excessive confidence in shared finances.",
    "Do not assume every difficult experience has an immediate explanation.",
    "Avoid overlooking practical risks."
  ],

  bestUse:
    "Use wisdom and careful investigation to find constructive meaning and opportunity within complex circumstances.",

  dailyExpression:
    "A shared financial, private or complex matter may reveal useful information when examined from a broader perspective today.",

  askSarathiExplanation:
    "Jupiter activates the 8th house, directing wisdom and growth toward transformation, shared resources and deeper understanding.",

  lifeReportInterpretation:
    "Throughout life, significant growth can emerge through transformation, research and experiences that deepen understanding of complex or hidden dimensions of life.",

  confidence: 10,
},

jupiter_in_9: {
  planet: "jupiter",
  placementHouse: 9,
  key: "jupiter_in_9",

  principle:
    "Jupiter in the 9th house strongly directs wisdom, expansion and guidance toward higher learning, philosophy, ethics, teachers and broader experience.",

  synthesis:
    "Knowledge, principles and meaningful experiences become major sources of growth. Higher education, mentors, travel and philosophical understanding can significantly broaden the person's direction.",

  psychology:
    "The person seeks a coherent understanding of life and often feels strongest when actions are aligned with meaningful principles and a larger sense of purpose.",

  areas: ["education", "spirituality", "travel", "mind"],

  practicalEffects: [
    "Higher learning receives emphasis.",
    "Guidance becomes valuable.",
    "Travel may broaden perspective.",
    "Long-term beliefs become clearer."
  ],

  opportunities: [
    "Pursue higher knowledge.",
    "Learn from a capable mentor.",
    "Explore meaningful philosophy.",
    "Broaden your experience."
  ],

  cautions: [
    "Avoid intellectual or moral superiority.",
    "Do not follow teachers without discernment.",
    "Avoid assuming belief alone replaces practical effort."
  ],

  bestUse:
    "Develop wisdom through learning, experience and principles that can be applied meaningfully in real life.",

  dailyExpression:
    "Advice, study, travel or a broader perspective may help clarify an important long-term decision today.",

  askSarathiExplanation:
    "Jupiter activates the 9th house, strongly reinforcing higher knowledge, guidance, principles, travel and the search for meaning.",

  lifeReportInterpretation:
    "Throughout life, higher learning, meaningful guidance and a principled worldview can become central sources of wisdom, opportunity and personal growth.",

  confidence: 10,
},

jupiter_in_10: {
  planet: "jupiter",
  placementHouse: 10,
  key: "jupiter_in_10",

  principle:
    "Jupiter in the 10th house directs wisdom, growth and guidance toward career, responsibility, reputation and public contribution.",

  synthesis:
    "Professional growth can develop through knowledge, sound judgement and the ability to guide others. Career becomes an important arena for applying experience in ways that create broader value.",

  psychology:
    "The person often wants professional achievement to carry meaning and may feel most fulfilled when knowledge or judgement positively influences others.",

  areas: ["career", "publicImage", "money", "education"],

  practicalEffects: [
    "Professional responsibilities may expand.",
    "Knowledge gains recognition.",
    "Leadership or advisory opportunities arise.",
    "Career decisions benefit from long-term thinking."
  ],

  opportunities: [
    "Take on meaningful responsibility.",
    "Share professional knowledge.",
    "Think strategically about career growth.",
    "Guide others constructively."
  ],

  cautions: [
    "Avoid professional overconfidence.",
    "Do not promise more than can be delivered.",
    "Avoid assuming reputation replaces performance."
  ],

  bestUse:
    "Use knowledge and sound judgement to build professional growth that creates lasting value and credibility.",

  dailyExpression:
    "A career opportunity, responsibility or conversation with someone influential may benefit from your experience and judgement today.",

  askSarathiExplanation:
    "Jupiter activates the 10th house, directing growth, wisdom and guidance toward career, responsibility and public contribution.",

  lifeReportInterpretation:
    "Throughout life, professional growth can be supported by knowledge, ethical judgement and the ability to guide or educate others through meaningful work.",

  confidence: 10,
},

jupiter_in_11: {
  planet: "jupiter",
  placementHouse: 11,
  key: "jupiter_in_11",

  principle:
    "Jupiter in the 11th house directs expansion, opportunity and wisdom toward gains, networks, friendships and long-term aspirations.",

  synthesis:
    "Growth can occur through supportive networks, knowledgeable people and opportunities connected with long-term objectives. Ambitions benefit from broader thinking and constructive alliances.",

  psychology:
    "The person feels encouraged by future possibilities and often values friendships or networks that expand knowledge, opportunity and perspective.",

  areas: ["career", "money", "relationships", "publicImage"],

  practicalEffects: [
    "Networks may create opportunities.",
    "Long-term goals can expand.",
    "Supportive connections become valuable.",
    "Progress toward gains becomes visible."
  ],

  opportunities: [
    "Build meaningful networks.",
    "Think bigger about long-term goals.",
    "Seek knowledgeable collaborators.",
    "Share opportunities constructively."
  ],

  cautions: [
    "Avoid unrealistic expectations of gains.",
    "Do not overextend across too many goals.",
    "Avoid assuming every connection will produce opportunity."
  ],

  bestUse:
    "Combine ambitious goals with knowledgeable networks and realistic long-term planning.",

  dailyExpression:
    "A friend, professional network or useful connection may open a new possibility or help advance a longer-term goal today.",

  askSarathiExplanation:
    "Jupiter activates the 11th house, bringing expansion and opportunity into networks, gains and long-term aspirations.",

  lifeReportInterpretation:
    "Throughout life, meaningful networks and long-term goals can become important sources of opportunity, growth and material or professional progress.",

  confidence: 10,
},

jupiter_in_12: {
  planet: "jupiter",
  placementHouse: 12,
  key: "jupiter_in_12",

  principle:
    "Jupiter in the 12th house directs wisdom, growth and meaning toward reflection, spiritual development, foreign environments, release and matters beyond immediate visibility.",

  synthesis:
    "Growth may occur quietly through introspection, spiritual understanding, distant environments or work performed without immediate recognition. Perspective expands when the person learns to value inner development alongside external achievement.",

  psychology:
    "The person may seek meaning through reflection and experiences that extend beyond ordinary material goals, while periodically needing distance from external demands to regain perspective.",

  areas: ["spirituality", "travel", "mind", "hiddenMatters"],

  practicalEffects: [
    "Reflection produces useful insight.",
    "Foreign matters may create learning.",
    "Private study becomes meaningful.",
    "A need to release an outdated expectation may arise."
  ],

  opportunities: [
    "Reflect on larger priorities.",
    "Develop spiritual understanding.",
    "Learn through foreign or distant experiences.",
    "Support others without seeking recognition."
  ],

  cautions: [
    "Avoid excessive withdrawal.",
    "Do not use philosophy to escape practical responsibilities.",
    "Avoid unstructured generosity or expenditure."
  ],

  bestUse:
    "Use reflection and broader understanding to develop wisdom that is not dependent entirely on visible achievement.",

  dailyExpression:
    "Quiet reflection, private learning or a foreign or distant matter may provide an unexpectedly useful perspective today.",

  askSarathiExplanation:
    "Jupiter activates the 12th house, directing wisdom and growth toward reflection, foreign environments, release and inner development.",

  lifeReportInterpretation:
    "Throughout life, important wisdom can develop through reflection, spiritual exploration, foreign experiences and learning to find meaning beyond external recognition.",

  confidence: 10,
},
venus_in_1: {
  planet: "venus",
  placementHouse: 1,
  key: "venus_in_1",

  principle:
    "Venus in the 1st house brings harmony, attraction, relationship awareness, aesthetics and the search for balance directly into the personality and personal expression.",

  synthesis:
    "The person tends to approach life through diplomacy, refinement and sensitivity to how interactions feel. Personal charm can become an important social strength when supported by authenticity and clear values.",

  psychology:
    "The person often feels more confident when relationships are harmonious and when self-expression reflects beauty, balance or personal taste.",

  areas: ["relationships", "publicImage", "mind", "communication"],

  practicalEffects: [
    "Personal charm becomes more noticeable.",
    "Relationship awareness increases.",
    "Appearance or presentation receives attention.",
    "Diplomacy becomes useful."
  ],

  opportunities: [
    "Strengthen personal presentation.",
    "Use diplomacy.",
    "Build rapport.",
    "Express yourself gracefully."
  ],

  cautions: [
    "Avoid depending too heavily on approval.",
    "Do not avoid necessary disagreement.",
    "Avoid prioritising appearance over substance."
  ],

  bestUse:
    "Use charm, diplomacy and aesthetic awareness to strengthen relationships without losing personal authenticity.",

  dailyExpression:
    "A social interaction, relationship matter or issue of personal presentation may benefit from a more diplomatic and balanced approach today.",

  askSarathiExplanation:
    "Venus activates the 1st house, bringing harmony, attraction and relationship awareness directly into personal behaviour and self-expression.",

  lifeReportInterpretation:
    "Throughout life, relationships, diplomacy and aesthetic sensitivity become important parts of identity and can support strong social presence when balanced with self-respect.",

  confidence: 10,
},

venus_in_2: {
  planet: "venus",
  placementHouse: 2,
  key: "venus_in_2",

  principle:
    "Venus in the 2nd house directs harmony, comfort, value and attraction toward wealth, family, speech and personal resources.",

  synthesis:
    "The person may seek financial security through stable values, pleasant surroundings and resources that improve quality of life. Speech can become an important source of charm and connection.",

  psychology:
    "Security is often associated with comfort, supportive family relationships and the ability to enjoy the results of personal effort.",

  areas: ["money", "family", "communication", "relationships"],

  practicalEffects: [
    "Financial comfort becomes important.",
    "Speech may become persuasive or pleasant.",
    "Family relationships seek harmony.",
    "Spending may focus on quality or enjoyment."
  ],

  opportunities: [
    "Build financial stability.",
    "Use communication constructively.",
    "Strengthen family harmony.",
    "Clarify what you truly value."
  ],

  cautions: [
    "Avoid overspending on comfort.",
    "Do not confuse luxury with security.",
    "Avoid suppressing important family issues to preserve peace."
  ],

  bestUse:
    "Use sound values and balanced enjoyment to create financial and emotional security.",

  dailyExpression:
    "A financial, family or communication matter may benefit from a calmer and more value-conscious approach today.",

  askSarathiExplanation:
    "Venus activates the 2nd house, connecting harmony and value with money, family, speech and personal resources.",

  lifeReportInterpretation:
    "Throughout life, comfort, family harmony and refined values can contribute strongly to financial wellbeing and the person's sense of security.",

  confidence: 10,
},

venus_in_3: {
  planet: "venus",
  placementHouse: 3,
  key: "venus_in_3",

  principle:
    "Venus in the 3rd house directs harmony, creativity and relationship awareness toward communication, learning, skills and everyday interactions.",

  synthesis:
    "Communication tends to work best through diplomacy, creativity and social intelligence. Writing, design, media or interpersonal skills can become valuable forms of expression.",

  psychology:
    "The person enjoys pleasant mental stimulation and often feels more engaged when communication is both meaningful and aesthetically or socially satisfying.",

  areas: ["communication", "education", "relationships", "travel"],

  practicalEffects: [
    "Conversations become smoother.",
    "Creative communication improves.",
    "Short journeys may be enjoyable.",
    "Social connections become useful."
  ],

  opportunities: [
    "Communicate diplomatically.",
    "Develop a creative skill.",
    "Reconnect with someone.",
    "Use writing or presentation effectively."
  ],

  cautions: [
    "Avoid superficial communication.",
    "Do not say only what others want to hear.",
    "Avoid becoming distracted by social activity."
  ],

  bestUse:
    "Use creativity and diplomacy to make communication more effective and relationships more constructive.",

  dailyExpression:
    "A conversation, message or short interaction may go more smoothly when handled with tact and warmth today.",

  askSarathiExplanation:
    "Venus activates the 3rd house, directing harmony and creativity toward communication, learning and everyday interactions.",

  lifeReportInterpretation:
    "Throughout life, communication and creative skills can become important social strengths, especially when combined with diplomacy and genuine connection.",

  confidence: 10,
},

venus_in_4: {
  planet: "venus",
  placementHouse: 4,
  key: "venus_in_4",

  principle:
    "Venus in the 4th house directs harmony, comfort and aesthetic sensitivity toward home, family, property and emotional security.",

  synthesis:
    "The person seeks a peaceful and pleasant domestic environment and may invest significant energy in making home life comfortable, attractive and emotionally supportive.",

  psychology:
    "Inner wellbeing improves when the home environment feels harmonious and relationships with close family provide warmth rather than tension.",

  areas: ["home", "family", "property", "relationships"],

  practicalEffects: [
    "Home improvements may become attractive.",
    "Family harmony receives attention.",
    "Property matters may involve comfort or aesthetics.",
    "Domestic peace becomes important."
  ],

  opportunities: [
    "Improve the home environment.",
    "Strengthen family relationships.",
    "Create more emotional comfort.",
    "Handle property matters thoughtfully."
  ],

  cautions: [
    "Avoid excessive spending on comfort.",
    "Do not ignore domestic issues to preserve appearances.",
    "Avoid becoming overly attached to material ease."
  ],

  bestUse:
    "Create a home environment that supports both emotional harmony and practical stability.",

  dailyExpression:
    "A home, family or property matter may benefit from a more harmonious and considered approach today.",

  askSarathiExplanation:
    "Venus activates the 4th house, bringing comfort, harmony and aesthetic awareness into home, family and emotional foundations.",

  lifeReportInterpretation:
    "Throughout life, domestic harmony, comfort and supportive family relationships can become important sources of emotional stability and wellbeing.",

  confidence: 10,
},

venus_in_5: {
  planet: "venus",
  placementHouse: 5,
  key: "venus_in_5",

  principle:
    "Venus in the 5th house directs attraction, pleasure, creativity and affection toward romance, children, learning and self-expression.",

  synthesis:
    "Creative expression, affection and enjoyment become strong channels for fulfilment. The person may be drawn toward art, romance, performance, design or activities that combine pleasure with imagination.",

  psychology:
    "The person feels emotionally rewarded when able to express affection freely and create something that brings enjoyment or appreciation.",

  areas: ["relationships", "children", "education", "mind"],

  practicalEffects: [
    "Romantic energy becomes more noticeable.",
    "Creative inspiration increases.",
    "Children may bring enjoyment or focus.",
    "Learning becomes more engaging."
  ],

  opportunities: [
    "Express affection.",
    "Create something beautiful.",
    "Enjoy meaningful recreation.",
    "Encourage children or students."
  ],

  cautions: [
    "Avoid overindulgence.",
    "Do not idealise romance.",
    "Avoid making speculative decisions for excitement."
  ],

  bestUse:
    "Channel pleasure and affection into creative expression, meaningful relationships and constructive enjoyment.",

  dailyExpression:
    "A romantic, creative or children-related matter may bring enjoyment or inspiration today.",

  askSarathiExplanation:
    "Venus activates the 5th house, connecting affection, creativity and pleasure with romance, children, learning and self-expression.",

  lifeReportInterpretation:
    "Throughout life, creativity, affection, romance and the ability to enjoy meaningful self-expression can become major sources of fulfilment.",

  confidence: 10,
},

venus_in_6: {
  planet: "venus",
  placementHouse: 6,
  key: "venus_in_6",

  principle:
    "Venus in the 6th house directs harmony, cooperation and refinement toward work, service, health, routines and practical responsibilities.",

  synthesis:
    "The person often seeks smoother working relationships and more pleasant routines. Diplomacy can improve workplace cooperation, while wellbeing may benefit from balanced habits rather than extremes.",

  psychology:
    "The person functions better when daily life feels orderly, civil and manageable, and may become uncomfortable in environments marked by constant conflict or disorder.",

  areas: ["career", "health", "relationships", "mind"],

  practicalEffects: [
    "Work relationships require diplomacy.",
    "Routine improvements become attractive.",
    "Health may benefit from greater balance.",
    "Service becomes more cooperative."
  ],

  opportunities: [
    "Improve workplace harmony.",
    "Create sustainable routines.",
    "Resolve minor disagreements tactfully.",
    "Bring more balance into daily habits."
  ],

  cautions: [
    "Avoid people-pleasing at work.",
    "Do not ignore practical problems to keep the peace.",
    "Avoid comfort habits that weaken discipline."
  ],

  bestUse:
    "Use diplomacy and balance to improve work, health and everyday routines without avoiding necessary practical action.",

  dailyExpression:
    "A work, health or routine matter may improve when approached with greater balance and diplomacy today.",

  askSarathiExplanation:
    "Venus activates the 6th house, directing harmony and cooperation toward work, health, service and daily routines.",

  lifeReportInterpretation:
    "Throughout life, wellbeing improves through balanced routines and constructive working relationships, with diplomacy becoming an important practical strength.",

  confidence: 10,
},
venus_in_7: {
  planet: "venus",
  placementHouse: 7,
  key: "venus_in_7",

  principle:
    "Venus in the 7th house strongly directs harmony, attraction, affection and cooperation toward partnerships, relationships, clients and agreements.",

  synthesis:
    "Partnership becomes an important channel for connection, enjoyment and mutual support. Diplomacy and the ability to understand another person's needs can strengthen both personal and professional relationships.",

  psychology:
    "The person often values companionship and feels fulfilled when important relationships contain affection, fairness and mutual appreciation.",

  areas: ["relationships", "communication", "career", "publicImage"],

  practicalEffects: [
    "Partnership matters become prominent.",
    "Relationship harmony receives attention.",
    "Negotiations may become smoother.",
    "Client interactions benefit from diplomacy."
  ],

  opportunities: [
    "Strengthen an important relationship.",
    "Negotiate cooperatively.",
    "Express appreciation.",
    "Create mutually beneficial agreements."
  ],

  cautions: [
    "Avoid excessive compromise.",
    "Do not idealise a partner.",
    "Avoid preserving harmony at the cost of necessary boundaries."
  ],

  bestUse:
    "Use diplomacy and genuine appreciation to create balanced partnerships without losing clarity about your own needs.",

  dailyExpression:
    "A partner, client or important one-to-one interaction may become easier to manage through warmth and cooperation today.",

  askSarathiExplanation:
    "Venus activates the 7th house, strongly connecting harmony, attraction and cooperation with partnerships and agreements.",

  lifeReportInterpretation:
    "Throughout life, partnerships can become important sources of fulfilment, with relationship quality strengthened through affection, fairness, diplomacy and healthy boundaries.",

  confidence: 10,
},

venus_in_8: {
  planet: "venus",
  placementHouse: 8,
  key: "venus_in_8",

  principle:
    "Venus in the 8th house directs relationships, values and shared enjoyment toward intimacy, shared resources, transformation and deeper emotional bonds.",

  synthesis:
    "Relationships may seek depth rather than superficial connection. Trust, shared resources and emotional vulnerability become important areas through which values and attachments are understood more deeply.",

  psychology:
    "The person often wants meaningful emotional closeness and may become particularly sensitive to trust, loyalty and the balance of giving and receiving within intimate relationships.",

  areas: ["relationships", "money", "hiddenMatters", "mind"],

  practicalEffects: [
    "Shared financial matters receive attention.",
    "Emotional intimacy becomes important.",
    "Relationship dynamics may deepen.",
    "Questions of trust or shared values may surface."
  ],

  opportunities: [
    "Build deeper trust.",
    "Review shared finances.",
    "Discuss important relationship expectations.",
    "Understand emotional attachments more clearly."
  ],

  cautions: [
    "Avoid possessiveness.",
    "Do not use affection to control outcomes.",
    "Avoid ignoring financial details in shared arrangements."
  ],

  bestUse:
    "Use honesty and balanced sharing to deepen relationships while maintaining healthy emotional and financial boundaries.",

  dailyExpression:
    "A shared financial or emotionally sensitive relationship matter may benefit from an open and balanced conversation today.",

  askSarathiExplanation:
    "Venus activates the 8th house, connecting relationships and values with intimacy, shared resources and deeper emotional transformation.",

  lifeReportInterpretation:
    "Throughout life, relationships can become important vehicles for understanding trust, intimacy, shared resources and the deeper meaning of emotional attachment.",

  confidence: 10,
},

venus_in_9: {
  planet: "venus",
  placementHouse: 9,
  key: "venus_in_9",

  principle:
    "Venus in the 9th house directs harmony, relationships and appreciation toward higher learning, beliefs, travel and broader cultural experience.",

  synthesis:
    "Enjoyment and growth may come through education, travel, philosophy, culture and relationships that expand perspective. The person is often attracted to ideas and experiences that combine meaning with beauty or harmony.",

  psychology:
    "The person feels enriched by experiences that broaden both emotional and intellectual horizons and may seek shared values within important relationships.",

  areas: ["relationships", "education", "travel", "spirituality"],

  practicalEffects: [
    "Travel may become enjoyable or meaningful.",
    "Learning brings satisfaction.",
    "Shared beliefs influence relationships.",
    "Cultural or creative experiences broaden perspective."
  ],

  opportunities: [
    "Explore a new culture or perspective.",
    "Study something meaningful.",
    "Travel with purpose.",
    "Connect through shared values."
  ],

  cautions: [
    "Avoid idealising unfamiliar experiences.",
    "Do not assume shared attraction means shared values.",
    "Avoid choosing comfort over deeper understanding."
  ],

  bestUse:
    "Allow relationships, learning and broader experiences to expand your understanding of what you genuinely value.",

  dailyExpression:
    "Learning, travel or a conversation about beliefs and values may create an enjoyable or meaningful connection today.",

  askSarathiExplanation:
    "Venus activates the 9th house, connecting relationships, harmony and enjoyment with learning, beliefs, travel and broader experience.",

  lifeReportInterpretation:
    "Throughout life, relationships, education, travel and cultural experiences can broaden personal values and contribute significantly to emotional and intellectual fulfilment.",

  confidence: 10,
},

venus_in_10: {
  planet: "venus",
  placementHouse: 10,
  key: "venus_in_10",

  principle:
    "Venus in the 10th house directs harmony, diplomacy, relationships and aesthetic judgement toward career, reputation and public contribution.",

  synthesis:
    "Professional progress can benefit from diplomacy, relationship management and the ability to create cooperation. Careers involving people, creativity, aesthetics, negotiation or value creation may provide natural expression.",

  psychology:
    "The person often wants professional life to provide both achievement and a sense of harmony, appreciation or meaningful connection with others.",

  areas: ["career", "publicImage", "relationships", "money"],

  practicalEffects: [
    "Professional relationships become important.",
    "Diplomacy improves workplace outcomes.",
    "Public presentation receives attention.",
    "Creative or relationship-based work may gain visibility."
  ],

  opportunities: [
    "Strengthen professional relationships.",
    "Present work attractively.",
    "Negotiate diplomatically.",
    "Create greater cooperation at work."
  ],

  cautions: [
    "Avoid prioritising popularity over professional judgement.",
    "Do not avoid difficult decisions to preserve harmony.",
    "Avoid relying on charm without substance."
  ],

  bestUse:
    "Combine diplomacy and relationship intelligence with professional competence to build lasting credibility.",

  dailyExpression:
    "A professional relationship, presentation or negotiation may benefit from a diplomatic and polished approach today.",

  askSarathiExplanation:
    "Venus activates the 10th house, directing harmony, diplomacy and relationship awareness toward career and public reputation.",

  lifeReportInterpretation:
    "Throughout life, diplomacy, relationships and refined judgement can become significant professional strengths and contribute positively to public reputation.",

  confidence: 10,
},

venus_in_11: {
  planet: "venus",
  placementHouse: 11,
  key: "venus_in_11",

  principle:
    "Venus in the 11th house directs relationships, harmony and value toward friendships, networks, gains and long-term aspirations.",

  synthesis:
    "Supportive relationships and social networks can contribute meaningfully to opportunities and fulfilment. Goals may be advanced through cooperation rather than individual effort alone.",

  psychology:
    "The person often values friendships that provide warmth, enjoyment and mutual support and may feel fulfilled when personal aspirations are shared with others.",

  areas: ["relationships", "career", "money", "publicImage"],

  practicalEffects: [
    "Social networks become supportive.",
    "A relationship may create opportunity.",
    "Long-term goals receive encouragement.",
    "Collaborative gains become possible."
  ],

  opportunities: [
    "Strengthen useful relationships.",
    "Collaborate on a goal.",
    "Expand your social network.",
    "Share opportunities fairly."
  ],

  cautions: [
    "Avoid superficial networking.",
    "Do not value people only for what they can provide.",
    "Avoid excessive spending on social activity."
  ],

  bestUse:
    "Build genuine relationships and collaborative networks that support meaningful long-term goals.",

  dailyExpression:
    "A friend, colleague or professional connection may support an opportunity or long-term goal today.",

  askSarathiExplanation:
    "Venus activates the 11th house, connecting relationships and cooperation with networks, gains and long-term aspirations.",

  lifeReportInterpretation:
    "Throughout life, supportive friendships and collaborative networks can become important sources of opportunity, enjoyment and progress toward meaningful goals.",

  confidence: 10,
},

venus_in_12: {
  planet: "venus",
  placementHouse: 12,
  key: "venus_in_12",

  principle:
    "Venus in the 12th house directs relationships, pleasure, comfort and aesthetic sensitivity toward privacy, foreign environments, expenditure and inner experience.",

  synthesis:
    "Pleasure and affection may be experienced privately or through distant and foreign environments. Solitude, creativity and quiet connection can become restorative, while spending on comfort requires awareness.",

  psychology:
    "The person may have a private or idealistic side in relationships and can value forms of affection that feel emotionally subtle, compassionate or removed from everyday pressures.",

  areas: ["relationships", "travel", "money", "spirituality"],

  practicalEffects: [
    "Private relationship matters may receive attention.",
    "Foreign experiences may bring enjoyment.",
    "Spending on comfort may increase.",
    "Solitude can support creativity and emotional restoration."
  ],

  opportunities: [
    "Enjoy restorative solitude.",
    "Explore creative interests privately.",
    "Connect compassionately.",
    "Be intentional about discretionary spending."
  ],

  cautions: [
    "Avoid secretive relationship patterns.",
    "Do not escape problems through pleasure or spending.",
    "Avoid idealising unavailable people or situations."
  ],

  bestUse:
    "Use privacy, creativity and compassion constructively while maintaining clear boundaries around relationships and expenditure.",

  dailyExpression:
    "A private relationship matter, foreign connection or desire for quiet enjoyment may receive more attention today.",

  askSarathiExplanation:
    "Venus activates the 12th house, directing relationships, pleasure and comfort toward private matters, foreign environments, expenditure and inner experience.",

  lifeReportInterpretation:
    "Throughout life, relationships and personal values may develop through private reflection, foreign experiences and learning to balance compassion and enjoyment with clear boundaries.",

  confidence: 10,
},
saturn_in_1: {
  planet: "saturn",
  placementHouse: 1,
  key: "saturn_in_1",

  principle:
    "Saturn in the 1st house brings discipline, responsibility, endurance, restraint and long-term development directly into identity and personal direction.",

  synthesis:
    "Personal growth tends to occur through responsibility, patience and sustained effort. Confidence may develop gradually, but experience can produce considerable resilience, maturity and self-discipline.",

  psychology:
    "The person may take life and personal responsibilities seriously and can place demanding standards upon themselves. Inner confidence strengthens through competence and repeated evidence of what they can handle.",

  areas: ["mind", "health", "career", "publicImage"],

  practicalEffects: [
    "Responsibilities require personal attention.",
    "Progress may demand patience.",
    "Self-discipline becomes important.",
    "A serious decision may require maturity."
  ],

  opportunities: [
    "Take responsibility.",
    "Build consistent habits.",
    "Work patiently toward improvement.",
    "Strengthen personal discipline."
  ],

  cautions: [
    "Avoid excessive self-criticism.",
    "Do not interpret slow progress as failure.",
    "Avoid carrying every responsibility alone."
  ],

  bestUse:
    "Build confidence through consistency, competence and realistic long-term effort rather than immediate validation.",

  dailyExpression:
    "A personal responsibility or decision may require patience, discipline and a more measured approach today.",

  askSarathiExplanation:
    "Saturn activates the 1st house, bringing responsibility, discipline and gradual development directly into identity and personal action.",

  lifeReportInterpretation:
    "Throughout life, identity and confidence mature through responsibility, patience and sustained effort, often producing considerable resilience and self-mastery over time.",

  confidence: 10,
},

saturn_in_2: {
  planet: "saturn",
  placementHouse: 2,
  key: "saturn_in_2",

  principle:
    "Saturn in the 2nd house directs discipline, responsibility and long-term development toward money, family, speech and personal resources.",

  synthesis:
    "Financial security tends to benefit from patience, structure and careful accumulation rather than impulsive expansion. Family responsibilities and communication may also require maturity.",

  psychology:
    "The person may take financial security seriously and can feel uncomfortable with uncertainty around resources. Stability strengthens through planning, restraint and experience.",

  areas: ["money", "family", "communication", "career"],

  practicalEffects: [
    "Financial planning becomes important.",
    "Resources require careful management.",
    "Family responsibilities may increase.",
    "Communication becomes more measured."
  ],

  opportunities: [
    "Build long-term savings.",
    "Create financial structure.",
    "Speak carefully.",
    "Handle family responsibilities consistently."
  ],

  cautions: [
    "Avoid excessive financial fear.",
    "Do not become unnecessarily restrictive.",
    "Avoid harsh or overly reserved communication."
  ],

  bestUse:
    "Build lasting security through disciplined financial management, realistic planning and responsible use of resources.",

  dailyExpression:
    "A financial or family responsibility may require careful planning and a disciplined response today.",

  askSarathiExplanation:
    "Saturn activates the 2nd house, directing discipline and responsibility toward money, family, speech and material security.",

  lifeReportInterpretation:
    "Throughout life, financial stability and family security tend to strengthen through patience, disciplined accumulation and mature management of resources.",

  confidence: 10,
},

saturn_in_3: {
  planet: "saturn",
  placementHouse: 3,
  key: "saturn_in_3",

  principle:
    "Saturn in the 3rd house directs discipline, persistence and responsibility toward communication, skills, learning and personal effort.",

  synthesis:
    "Progress develops through repeated effort, careful communication and mastery of practical skills. What initially requires concentration can become a durable area of competence.",

  psychology:
    "The person may approach communication and learning seriously, preferring substance over speed. Confidence grows through preparation and repeated practice.",

  areas: ["communication", "education", "career", "travel"],

  practicalEffects: [
    "Communication requires preparation.",
    "Persistent effort produces progress.",
    "Skills improve through repetition.",
    "Follow-ups may require patience."
  ],

  opportunities: [
    "Develop a skill systematically.",
    "Communicate with precision.",
    "Complete a difficult follow-up.",
    "Stay consistent with personal effort."
  ],

  cautions: [
    "Avoid hesitation caused by overthinking.",
    "Do not become unnecessarily pessimistic.",
    "Avoid giving up because progress feels slow."
  ],

  bestUse:
    "Turn repeated effort into mastery by communicating carefully and developing skills consistently.",

  dailyExpression:
    "A message, task or pending follow-up may require patience and persistence before producing progress today.",

  askSarathiExplanation:
    "Saturn activates the 3rd house, directing discipline and persistence toward communication, skills and personal effort.",

  lifeReportInterpretation:
    "Throughout life, communication and practical abilities can become significant strengths through repetition, persistence and disciplined skill development.",

  confidence: 10,
},

saturn_in_4: {
  planet: "saturn",
  placementHouse: 4,
  key: "saturn_in_4",

  principle:
    "Saturn in the 4th house directs responsibility, structure and long-term development toward home, family, property and emotional foundations.",

  synthesis:
    "Domestic stability may require sustained effort and practical responsibility. Strong foundations are built gradually through consistency rather than relying only on comfort or emotional reassurance.",

  psychology:
    "The person may carry a strong sense of responsibility toward home or family and often needs dependable structures in private life before feeling fully settled.",

  areas: ["home", "family", "property", "mind"],

  practicalEffects: [
    "Home responsibilities require attention.",
    "Property matters favour careful planning.",
    "Family obligations may become important.",
    "Emotional stability benefits from structure."
  ],

  opportunities: [
    "Strengthen domestic foundations.",
    "Plan property matters carefully.",
    "Create reliable family routines.",
    "Build emotional stability gradually."
  ],

  cautions: [
    "Avoid carrying family burdens silently.",
    "Do not mistake emotional restraint for strength.",
    "Avoid postponing necessary home matters indefinitely."
  ],

  bestUse:
    "Create lasting emotional and domestic security through dependable structures, patience and responsible planning.",

  dailyExpression:
    "A home, family or property responsibility may require practical attention and patience today.",

  askSarathiExplanation:
    "Saturn activates the 4th house, directing responsibility and structure toward home, family, property and emotional foundations.",

  lifeReportInterpretation:
    "Throughout life, stable foundations develop through responsibility toward home and family, with inner security strengthening gradually through experience and dependable structures.",

  confidence: 10,
},

saturn_in_5: {
  planet: "saturn",
  placementHouse: 5,
  key: "saturn_in_5",

  principle:
    "Saturn in the 5th house directs discipline, patience and responsibility toward education, creativity, children, judgement and self-expression.",

  synthesis:
    "Creative and intellectual abilities develop through sustained practice rather than immediate expression. Learning, children or personal projects may require patience but can produce lasting competence.",

  psychology:
    "The person may take creativity, education or responsibilities toward children seriously and can hesitate to express themselves until they feel sufficiently prepared or capable.",

  areas: ["education", "children", "mind", "relationships"],

  practicalEffects: [
    "Learning requires concentration.",
    "Creative work benefits from structure.",
    "Children may require patient guidance.",
    "Long-term projects need sustained attention."
  ],

  opportunities: [
    "Study consistently.",
    "Develop creative mastery.",
    "Guide children patiently.",
    "Commit to a long-term project."
  ],

  cautions: [
    "Avoid excessive fear of making mistakes.",
    "Do not suppress creativity through perfectionism.",
    "Avoid becoming overly demanding with children or students."
  ],

  bestUse:
    "Turn creativity and intelligence into lasting capability through disciplined practice and patient development.",

  dailyExpression:
    "A learning, creative or children-related matter may require patience and sustained attention rather than a quick result today.",

  askSarathiExplanation:
    "Saturn activates the 5th house, directing discipline and responsibility toward education, creativity, children and intelligent judgement.",

  lifeReportInterpretation:
    "Throughout life, intellectual and creative confidence develops through patience and disciplined practice, often producing durable expertise and mature judgement.",

  confidence: 10,
},

saturn_in_6: {
  planet: "saturn",
  placementHouse: 6,
  key: "saturn_in_6",

  principle:
    "Saturn in the 6th house directs discipline, endurance and responsibility toward work, service, health, routines and practical challenges.",

  synthesis:
    "Persistent effort becomes a major strength in handling everyday responsibilities. Difficult problems can be managed through structure, patience and the willingness to improve systems over time.",

  psychology:
    "The person may have a strong sense of duty and can tolerate demanding workloads, but must learn to distinguish productive responsibility from carrying unnecessary burdens.",

  areas: ["career", "health", "mind", "communication"],

  practicalEffects: [
    "Work requires sustained effort.",
    "Routines become important.",
    "Persistent problems need systematic handling.",
    "Responsibilities may accumulate."
  ],

  opportunities: [
    "Create stronger routines.",
    "Resolve a long-standing problem.",
    "Work consistently.",
    "Build sustainable health habits."
  ],

  cautions: [
    "Avoid chronic overwork.",
    "Do not neglect recovery.",
    "Avoid accepting responsibilities that are not genuinely yours."
  ],

  bestUse:
    "Use patience and structure to solve practical problems and build routines that remain sustainable over time.",

  dailyExpression:
    "A work, health or routine responsibility may require steady effort and disciplined follow-through today.",

  askSarathiExplanation:
    "Saturn activates the 6th house, directing endurance and discipline toward work, health, service and practical challenges.",

  lifeReportInterpretation:
    "Throughout life, resilience and competence develop through disciplined work, service and the gradual mastery of practical challenges and routines.",

  confidence: 10,
},
saturn_in_7: {
  planet: "saturn",
  placementHouse: 7,
  key: "saturn_in_7",

  principle:
    "Saturn in the 7th house directs responsibility, commitment, patience and structure toward partnerships, relationships, clients and agreements.",

  synthesis:
    "Partnerships tend to require maturity, realistic expectations and sustained effort. Relationships can become durable when responsibility and commitment are balanced with emotional openness and mutual respect.",

  psychology:
    "The person may approach important relationships seriously and can take time to develop trust. Security grows through reliability, consistency and evidence that a partnership can withstand pressure.",

  areas: ["relationships", "communication", "career", "mind"],

  practicalEffects: [
    "Partnership responsibilities become important.",
    "Agreements require careful consideration.",
    "Relationship boundaries need clarity.",
    "Client commitments may require sustained follow-through."
  ],

  opportunities: [
    "Strengthen long-term commitments.",
    "Clarify responsibilities.",
    "Build trust through consistency.",
    "Negotiate realistic agreements."
  ],

  cautions: [
    "Avoid becoming emotionally distant.",
    "Do not remain in an arrangement only from obligation.",
    "Avoid expecting relationships to function without communication."
  ],

  bestUse:
    "Build dependable partnerships through commitment, realistic expectations and clearly shared responsibilities.",

  dailyExpression:
    "A partner, client or agreement may require patience, clear boundaries and dependable follow-through today.",

  askSarathiExplanation:
    "Saturn activates the 7th house, directing responsibility, commitment and structure toward partnerships and agreements.",

  lifeReportInterpretation:
    "Throughout life, relationships become an important arena for developing commitment, patience and mature boundaries, with enduring partnerships strengthened through consistency and shared responsibility.",

  confidence: 10,
},

saturn_in_8: {
  planet: "saturn",
  placementHouse: 8,
  key: "saturn_in_8",

  principle:
    "Saturn in the 8th house directs endurance, responsibility and structure toward transformation, shared resources, vulnerability and complex matters.",

  synthesis:
    "Complex situations may require patience and careful management rather than immediate resolution. The person can develop considerable resilience through learning how to handle uncertainty, shared obligations and long-term change.",

  psychology:
    "The person may prefer control and predictability when dealing with vulnerable or uncertain situations, but deeper strength develops through accepting what must be managed gradually rather than controlled completely.",

  areas: ["hiddenMatters", "money", "mind", "spirituality"],

  practicalEffects: [
    "Shared obligations require careful management.",
    "Complex matters may take time to resolve.",
    "Financial commitments need structure.",
    "Deeper concerns require patient examination."
  ],

  opportunities: [
    "Organise shared resources.",
    "Resolve long-standing issues gradually.",
    "Build resilience.",
    "Research complex matters carefully."
  ],

  cautions: [
    "Avoid excessive fear of uncertainty.",
    "Do not attempt to control every outcome.",
    "Avoid postponing difficult but necessary conversations."
  ],

  bestUse:
    "Use patience and structure to manage complexity while developing greater resilience toward circumstances that cannot be resolved immediately.",

  dailyExpression:
    "A shared financial, private or unresolved matter may require patience and careful management rather than a quick solution today.",

  askSarathiExplanation:
    "Saturn activates the 8th house, directing endurance and responsibility toward shared resources, transformation and complex matters.",

  lifeReportInterpretation:
    "Throughout life, resilience develops through learning to manage uncertainty, shared obligations and periods of transformation with patience and practical discipline.",

  confidence: 10,
},

saturn_in_9: {
  planet: "saturn",
  placementHouse: 9,
  key: "saturn_in_9",

  principle:
    "Saturn in the 9th house directs discipline, responsibility and long-term development toward higher learning, principles, guidance and broader understanding.",

  synthesis:
    "Knowledge becomes meaningful through disciplined study and practical application. Beliefs and principles may be tested through experience before becoming stable foundations for long-term judgement.",

  psychology:
    "The person may question ideas carefully rather than accepting them automatically and often develops conviction through experience, study and evidence.",

  areas: ["education", "spirituality", "travel", "mind"],

  practicalEffects: [
    "Higher learning requires commitment.",
    "Long-term beliefs may be reconsidered.",
    "Travel requires careful planning.",
    "Guidance is evaluated practically."
  ],

  opportunities: [
    "Commit to serious study.",
    "Develop principles through experience.",
    "Plan long-distance matters carefully.",
    "Build expertise over time."
  ],

  cautions: [
    "Avoid rigid beliefs.",
    "Do not become cynical about guidance.",
    "Avoid rejecting new perspectives simply because they challenge established views."
  ],

  bestUse:
    "Develop durable wisdom through disciplined learning, experience and principles that have been tested in practical life.",

  dailyExpression:
    "A learning, travel or long-term planning matter may require patience and a more realistic perspective today.",

  askSarathiExplanation:
    "Saturn activates the 9th house, directing discipline and maturity toward higher learning, principles, guidance and broader experience.",

  lifeReportInterpretation:
    "Throughout life, wisdom develops gradually through serious study, tested beliefs and experiences that transform abstract principles into mature understanding.",

  confidence: 10,
},

saturn_in_10: {
  planet: "saturn",
  placementHouse: 10,
  key: "saturn_in_10",

  principle:
    "Saturn in the 10th house strongly directs discipline, responsibility, endurance and structure toward career, authority and public contribution.",

  synthesis:
    "Professional development is built through sustained responsibility, competence and the ability to manage increasingly demanding roles. Progress may be gradual but can become durable when supported by consistent performance.",

  psychology:
    "The person often takes career responsibilities seriously and may place substantial pressure on themselves to prove competence, reliability and professional worth.",

  areas: ["career", "publicImage", "money", "communication"],

  practicalEffects: [
    "Professional responsibilities increase.",
    "Long-term career planning becomes important.",
    "Authority may require accountability.",
    "Consistent performance receives attention."
  ],

  opportunities: [
    "Take ownership of important work.",
    "Build professional credibility.",
    "Develop long-term career structure.",
    "Demonstrate reliability."
  ],

  cautions: [
    "Avoid chronic overwork.",
    "Do not measure progress only through status.",
    "Avoid becoming rigid with colleagues or authority figures."
  ],

  bestUse:
    "Build lasting professional authority through competence, consistency and responsible leadership.",

  dailyExpression:
    "A professional responsibility may require sustained focus, accountability and mature judgement today.",

  askSarathiExplanation:
    "Saturn activates the 10th house, strongly emphasising career responsibility, structure, authority and long-term achievement.",

  lifeReportInterpretation:
    "Throughout life, career authority and reputation can strengthen significantly through sustained effort, professional discipline and the gradual accumulation of responsibility and competence.",

  confidence: 10,
},

saturn_in_11: {
  planet: "saturn",
  placementHouse: 11,
  key: "saturn_in_11",

  principle:
    "Saturn in the 11th house directs discipline, patience and structure toward gains, networks, friendships and long-term aspirations.",

  synthesis:
    "Long-term goals tend to develop through realistic planning, consistent effort and dependable networks. Gains may be gradual, but disciplined ambition can create durable results.",

  psychology:
    "The person tends to take ambitions seriously and may prefer a smaller number of dependable connections over broad but superficial networks.",

  areas: ["career", "money", "relationships", "publicImage"],

  practicalEffects: [
    "Long-term goals require structure.",
    "Networks may become more selective.",
    "Gains develop through sustained effort.",
    "Group responsibilities may increase."
  ],

  opportunities: [
    "Create a realistic long-term plan.",
    "Strengthen dependable networks.",
    "Work consistently toward an important goal.",
    "Build sustainable sources of gain."
  ],

  cautions: [
    "Avoid discouragement from slow progress.",
    "Do not isolate yourself from useful networks.",
    "Avoid unrealistic expectations of immediate gains."
  ],

  bestUse:
    "Turn ambition into durable achievement through realistic goals, patient effort and dependable relationships.",

  dailyExpression:
    "A long-term goal or professional connection may require consistent follow-through rather than immediate results today.",

  askSarathiExplanation:
    "Saturn activates the 11th house, directing discipline and long-term effort toward gains, networks and future aspirations.",

  lifeReportInterpretation:
    "Throughout life, significant goals and gains can be built gradually through disciplined ambition, realistic planning and dependable networks.",

  confidence: 10,
},

saturn_in_12: {
  planet: "saturn",
  placementHouse: 12,
  key: "saturn_in_12",

  principle:
    "Saturn in the 12th house directs discipline, responsibility and endurance toward solitude, release, foreign environments, private work and inner development.",

  synthesis:
    "Periods of withdrawal or behind-the-scenes responsibility can require considerable patience. Constructive solitude and disciplined reflection may gradually strengthen inner stability and the ability to release what no longer serves a practical purpose.",

  psychology:
    "The person may carry responsibilities or concerns privately and can find it difficult to disengage mentally from burdens. Inner strength develops through healthy boundaries, reflection and acceptance of necessary endings.",

  areas: ["mind", "spirituality", "travel", "hiddenMatters"],

  practicalEffects: [
    "Private responsibilities require attention.",
    "Behind-the-scenes work may increase.",
    "Foreign or distant matters require patience.",
    "Rest and withdrawal need greater structure."
  ],

  opportunities: [
    "Complete unfinished matters.",
    "Create disciplined reflective practices.",
    "Establish healthier boundaries.",
    "Work patiently behind the scenes."
  ],

  cautions: [
    "Avoid prolonged isolation.",
    "Do not carry hidden burdens indefinitely.",
    "Avoid treating rest as unproductive."
  ],

  bestUse:
    "Use disciplined reflection and healthy boundaries to complete what is necessary and release burdens that no longer need to be carried.",

  dailyExpression:
    "A private responsibility, unfinished matter or need for quiet recovery may require patient attention today.",

  askSarathiExplanation:
    "Saturn activates the 12th house, directing discipline and endurance toward private responsibilities, release, foreign matters and inner development.",

  lifeReportInterpretation:
    "Throughout life, inner strength develops through periods of solitude, private responsibility and learning to distinguish meaningful duty from burdens that need to be released.",

  confidence: 10,
},
rahu_in_1: {
  planet: "rahu",
  placementHouse: 1,
  key: "rahu_in_1",

  principle:
    "Rahu in the 1st house amplifies attention toward identity, self-development, visibility and the desire to define life on one's own terms.",

  synthesis:
    "The person may feel a strong drive to distinguish themselves, experiment with identity and pursue experiences that expand personal possibilities. Reinvention can become an important theme.",

  psychology:
    "There can be a persistent desire to become more than the current version of oneself, creating ambition and adaptability but also periodic dissatisfaction with identity or personal progress.",

  areas: ["mind", "publicImage", "career", "health"],

  practicalEffects: [
    "Personal ambition becomes stronger.",
    "A desire for change or reinvention may emerge.",
    "Visibility receives greater attention.",
    "Unconventional choices may become attractive."
  ],

  opportunities: [
    "Explore new possibilities.",
    "Develop a distinctive identity.",
    "Use ambition constructively.",
    "Adapt confidently to unfamiliar situations."
  ],

  cautions: [
    "Avoid constant comparison with others.",
    "Do not reinvent yourself merely for recognition.",
    "Avoid impulsive decisions driven by dissatisfaction."
  ],

  bestUse:
    "Use ambition and experimentation to expand personal possibilities while maintaining a stable understanding of who you are.",

  dailyExpression:
    "A strong desire to change, improve or distinguish yourself may influence an important personal decision today.",

  askSarathiExplanation:
    "Rahu activates the 1st house, amplifying attention toward identity, visibility, ambition and personal reinvention.",

  lifeReportInterpretation:
    "Throughout life, identity may evolve through experimentation, ambition and unfamiliar experiences, with maturity developing as external recognition becomes balanced with a more stable sense of self.",

  confidence: 10,
},

rahu_in_2: {
  planet: "rahu",
  placementHouse: 2,
  key: "rahu_in_2",

  principle:
    "Rahu in the 2nd house amplifies desire around wealth, resources, family identity, speech and material security.",

  synthesis:
    "The drive to accumulate resources or improve financial circumstances can become strong. Unconventional income opportunities, persuasive communication or changing values may influence the path toward security.",

  psychology:
    "The person may feel that greater resources will provide greater security, creating significant financial ambition while requiring awareness of when enough is genuinely enough.",

  areas: ["money", "family", "communication", "career"],

  practicalEffects: [
    "Financial ambition increases.",
    "An unusual earning opportunity may attract attention.",
    "Speech can become highly persuasive.",
    "Material priorities may shift."
  ],

  opportunities: [
    "Explore new income possibilities.",
    "Develop commercially useful skills.",
    "Communicate strategically.",
    "Reassess financial goals."
  ],

  cautions: [
    "Avoid excessive financial risk.",
    "Do not exaggerate in communication.",
    "Avoid allowing accumulation to become the only measure of security."
  ],

  bestUse:
    "Use financial ambition and unconventional thinking to expand resources while maintaining realistic values and disciplined judgement.",

  dailyExpression:
    "A financial opportunity, purchase or conversation about money may appear especially compelling and deserves careful evaluation today.",

  askSarathiExplanation:
    "Rahu activates the 2nd house, amplifying desire and experimentation around money, resources, family values and communication.",

  lifeReportInterpretation:
    "Throughout life, strong material ambition can encourage significant resource-building, with stability improving as financial desire becomes guided by clear values and sound judgement.",

  confidence: 10,
},

rahu_in_3: {
  planet: "rahu",
  placementHouse: 3,
  key: "rahu_in_3",

  principle:
    "Rahu in the 3rd house amplifies initiative, communication, curiosity, skills and the willingness to experiment with unfamiliar methods.",

  synthesis:
    "The person may become highly resourceful in creating opportunities through communication, networking and self-directed effort. New technologies or unconventional approaches can become particularly attractive.",

  psychology:
    "There is often a strong desire to test personal capability through action, experimentation and increasingly ambitious forms of self-expression.",

  areas: ["communication", "career", "education", "travel"],

  practicalEffects: [
    "Communication activity increases.",
    "An unconventional idea may gain momentum.",
    "Networking can create opportunities.",
    "Personal initiative becomes stronger."
  ],

  opportunities: [
    "Experiment with a new approach.",
    "Develop modern or unusual skills.",
    "Expand communication networks.",
    "Take calculated initiative."
  ],

  cautions: [
    "Avoid exaggeration.",
    "Do not pursue every new idea simultaneously.",
    "Avoid taking unnecessary risks simply for excitement."
  ],

  bestUse:
    "Use curiosity and unconventional thinking to create opportunities through intelligent experimentation and persistent personal effort.",

  dailyExpression:
    "A message, connection or unconventional idea may encourage you to take a new initiative today.",

  askSarathiExplanation:
    "Rahu activates the 3rd house, amplifying communication, initiative, experimentation and the desire to develop new capabilities.",

  lifeReportInterpretation:
    "Throughout life, courage and capability can expand through experimentation, communication and self-directed effort, especially when unconventional ideas are supported by practical execution.",

  confidence: 10,
},

rahu_in_4: {
  planet: "rahu",
  placementHouse: 4,
  key: "rahu_in_4",

  principle:
    "Rahu in the 4th house amplifies desire around home, property, comfort, belonging and emotional security.",

  synthesis:
    "The person may continually seek to improve or redefine their living environment and sense of belonging. Home, property or residence in unfamiliar environments can become significant areas of experience.",

  psychology:
    "There can be a persistent search for the place, environment or level of comfort that finally feels completely satisfying, making inner stability especially important.",

  areas: ["home", "property", "family", "mind"],

  practicalEffects: [
    "Home or property ambitions increase.",
    "A change in living environment may become attractive.",
    "Domestic dissatisfaction may encourage improvement.",
    "Unconventional living arrangements may receive consideration."
  ],

  opportunities: [
    "Explore better living arrangements.",
    "Research property opportunities carefully.",
    "Modernise the home environment.",
    "Develop emotional stability independently of surroundings."
  ],

  cautions: [
    "Avoid believing the next home will solve every dissatisfaction.",
    "Do not make property decisions from restlessness alone.",
    "Avoid allowing external comfort to replace inner stability."
  ],

  bestUse:
    "Use the desire for improvement to create better living conditions while developing emotional security that does not depend entirely on external circumstances.",

  dailyExpression:
    "A home, property or family matter may create a strong desire to change or improve something today.",

  askSarathiExplanation:
    "Rahu activates the 4th house, amplifying attention toward home, property, comfort, belonging and emotional security.",

  lifeReportInterpretation:
    "Throughout life, home and belonging may evolve through significant changes or unconventional experiences, with deeper stability developing when inner security becomes less dependent on external circumstances.",

  confidence: 10,
},

rahu_in_5: {
  planet: "rahu",
  placementHouse: 5,
  key: "rahu_in_5",

  principle:
    "Rahu in the 5th house amplifies desire around creativity, intelligence, recognition, children, romance and speculative expression.",

  synthesis:
    "The mind may be drawn toward original ideas, unconventional learning and distinctive forms of creative expression. Recognition for intelligence or creativity can become particularly motivating.",

  psychology:
    "The person may strongly want their ideas, talents or personal expression to stand out, creating innovation but also a tendency to become overly invested in validation or outcomes.",

  areas: ["education", "children", "relationships", "mind"],

  practicalEffects: [
    "Creative ambition increases.",
    "Unusual ideas become attractive.",
    "Romantic interest may intensify.",
    "Recognition for knowledge or talent becomes important."
  ],

  opportunities: [
    "Develop an original idea.",
    "Explore unconventional learning.",
    "Use creativity boldly.",
    "Experiment intelligently."
  ],

  cautions: [
    "Avoid excessive speculation.",
    "Do not confuse attention with genuine achievement.",
    "Avoid becoming obsessive about romantic or creative outcomes."
  ],

  bestUse:
    "Use originality and ambition to develop meaningful creative intelligence without becoming dependent on recognition or excitement.",

  dailyExpression:
    "An unusual idea, creative opportunity or romantic development may feel especially compelling today.",

  askSarathiExplanation:
    "Rahu activates the 5th house, amplifying creativity, intelligence, recognition, romance and the desire for distinctive self-expression.",

  lifeReportInterpretation:
    "Throughout life, strong creative and intellectual ambition can encourage original achievement, with maturity developing through learning to distinguish meaningful expression from the pursuit of attention or excitement.",

  confidence: 10,
},

rahu_in_6: {
  planet: "rahu",
  placementHouse: 6,
  key: "rahu_in_6",

  principle:
    "Rahu in the 6th house amplifies attention toward work, competition, obstacles, health, service and the desire to overcome practical challenges.",

  synthesis:
    "The person may become highly resourceful when confronted with problems, competition or demanding work. Unconventional methods can help overcome obstacles when supported by discipline and clear judgement.",

  psychology:
    "Challenges can stimulate determination and strategic thinking. The person may become intensely focused on solving problems, but needs to recognise when vigilance has turned into unnecessary worry or conflict.",

  areas: ["career", "health", "mind", "communication"],

  practicalEffects: [
    "Competitive situations become prominent.",
    "Complex work problems demand attention.",
    "Unconventional solutions may prove useful.",
    "Health or routines may receive increased focus."
  ],

  opportunities: [
    "Solve a difficult problem.",
    "Use strategic thinking.",
    "Improve inefficient routines.",
    "Compete intelligently."
  ],

  cautions: [
    "Avoid creating enemies unnecessarily.",
    "Do not become obsessed with problems.",
    "Avoid extreme or poorly researched health approaches."
  ],

  bestUse:
    "Use strategic intelligence and persistence to overcome genuine obstacles without allowing competition or worry to dominate attention.",

  dailyExpression:
    "A work problem, competitive situation or practical obstacle may respond well to an unconventional but carefully considered solution today.",

  askSarathiExplanation:
    "Rahu activates the 6th house, amplifying competition, problem-solving and attention toward work, health and practical obstacles.",

  lifeReportInterpretation:
    "Throughout life, difficult circumstances can develop unusual resourcefulness and competitive strength, especially when ambition is channelled into disciplined problem-solving rather than constant conflict.",

  confidence: 10,
},
rahu_in_7: {
  planet: "rahu",
  placementHouse: 7,
  key: "rahu_in_7",

  principle:
    "Rahu in the 7th house amplifies desire, fascination and experimentation around partnerships, relationships, clients and agreements.",

  synthesis:
    "Relationships can become powerful arenas for growth through unfamiliar people, unconventional partnerships or experiences that challenge established expectations. Strong attraction toward partnership requires equally strong discernment.",

  psychology:
    "The person may feel intensely drawn toward certain people or partnerships and can project significant expectations onto relationships, especially when they represent something new, desirable or socially significant.",

  areas: ["relationships", "communication", "career", "publicImage"],

  practicalEffects: [
    "An important relationship may demand attention.",
    "Unusual partnerships can become attractive.",
    "Client or business opportunities may expand.",
    "Strong attraction or fascination may influence judgement."
  ],

  opportunities: [
    "Explore new partnerships carefully.",
    "Expand client relationships.",
    "Learn from unfamiliar people.",
    "Negotiate with clear expectations."
  ],

  cautions: [
    "Avoid idealising a partner or opportunity.",
    "Do not ignore warning signs because attraction is strong.",
    "Avoid agreements driven mainly by urgency or fascination."
  ],

  bestUse:
    "Use openness to unconventional partnerships while maintaining clear boundaries, realistic expectations and careful judgement.",

  dailyExpression:
    "A partner, client or unusual new connection may become especially compelling and deserves careful evaluation today.",

  askSarathiExplanation:
    "Rahu activates the 7th house, amplifying desire and experimentation around partnerships, agreements and one-to-one relationships.",

  lifeReportInterpretation:
    "Throughout life, partnerships may expose the person to unfamiliar people, environments and experiences, with relationship maturity developing through balancing strong attraction with discernment and clear boundaries.",

  confidence: 10,
},

rahu_in_8: {
  planet: "rahu",
  placementHouse: 8,
  key: "rahu_in_8",

  principle:
    "Rahu in the 8th house amplifies curiosity, desire and intensity around transformation, hidden knowledge, shared resources and matters beneath the surface.",

  synthesis:
    "The person may be strongly drawn toward complex subjects, hidden information and unconventional forms of investigation. Periods of change can stimulate resourcefulness and a desire to understand what others overlook.",

  psychology:
    "Uncertainty can create both fascination and restlessness. The person may feel compelled to uncover explanations, motives or hidden mechanisms behind complex situations.",

  areas: ["hiddenMatters", "money", "mind", "spirituality"],

  practicalEffects: [
    "Hidden information may attract attention.",
    "Research becomes unusually intensive.",
    "Shared financial matters require scrutiny.",
    "A complex situation may develop unexpectedly."
  ],

  opportunities: [
    "Investigate deeply.",
    "Develop specialist knowledge.",
    "Review shared resources carefully.",
    "Adapt intelligently to change."
  ],

  cautions: [
    "Avoid obsession with hidden explanations.",
    "Do not take poorly understood financial risks.",
    "Avoid allowing suspicion to replace evidence."
  ],

  bestUse:
    "Use curiosity and investigative intelligence to understand complexity while maintaining evidence, perspective and financial discipline.",

  dailyExpression:
    "A hidden detail, shared financial matter or unusual development may encourage deeper investigation today.",

  askSarathiExplanation:
    "Rahu activates the 8th house, amplifying curiosity and intensity around transformation, shared resources and matters beneath the surface.",

  lifeReportInterpretation:
    "Throughout life, complex and transformative experiences can develop considerable investigative ability and adaptability, especially when fascination with hidden matters remains grounded in evidence.",

  confidence: 10,
},

rahu_in_9: {
  planet: "rahu",
  placementHouse: 9,
  key: "rahu_in_9",

  principle:
    "Rahu in the 9th house amplifies desire for higher knowledge, unfamiliar philosophies, foreign experience and broader understanding.",

  synthesis:
    "The person may question inherited beliefs and seek knowledge beyond conventional boundaries. Foreign cultures, unusual teachers or alternative systems of thought can significantly expand perspective.",

  psychology:
    "There is often a strong desire to discover a worldview that feels larger or more compelling than what was originally inherited, encouraging exploration but also periodic dissatisfaction with established beliefs.",

  areas: ["education", "spirituality", "travel", "mind"],

  practicalEffects: [
    "Unconventional learning becomes attractive.",
    "Foreign influences may become important.",
    "Existing beliefs may be questioned.",
    "A new teacher or philosophy may attract attention."
  ],

  opportunities: [
    "Explore unfamiliar knowledge.",
    "Learn from different cultures.",
    "Question assumptions intelligently.",
    "Expand your worldview."
  ],

  cautions: [
    "Avoid blindly following unconventional teachers.",
    "Do not reject tradition simply because it is traditional.",
    "Avoid replacing one rigid belief with another."
  ],

  bestUse:
    "Explore knowledge beyond familiar boundaries while using discernment to distinguish genuine insight from novelty.",

  dailyExpression:
    "An unfamiliar idea, teacher, travel matter or different perspective may challenge an existing assumption today.",

  askSarathiExplanation:
    "Rahu activates the 9th house, amplifying exploration of higher knowledge, foreign experience, beliefs and unconventional perspectives.",

  lifeReportInterpretation:
    "Throughout life, knowledge and beliefs may evolve through exposure to foreign cultures, unconventional ideas and experiences that challenge inherited assumptions.",

  confidence: 10,
},

rahu_in_10: {
  planet: "rahu",
  placementHouse: 10,
  key: "rahu_in_10",

  principle:
    "Rahu in the 10th house amplifies ambition, visibility and the desire for professional achievement, influence and recognition.",

  synthesis:
    "Career can become a powerful arena for ambition and experimentation. The person may pursue rapid growth, unconventional professional paths or roles that provide visibility, influence or access to larger opportunities.",

  psychology:
    "There can be a strong desire to accomplish something significant and to be recognised for it, creating considerable professional drive but also making external achievement difficult to feel completely sufficient.",

  areas: ["career", "publicImage", "money", "communication"],

  practicalEffects: [
    "Career ambition intensifies.",
    "Visibility may increase.",
    "An unconventional professional opportunity may emerge.",
    "Recognition becomes more motivating."
  ],

  opportunities: [
    "Pursue ambitious career goals.",
    "Use modern or unconventional methods.",
    "Expand professional visibility.",
    "Take calculated professional risks."
  ],

  cautions: [
    "Avoid chasing status without substance.",
    "Do not compromise judgement for rapid advancement.",
    "Avoid allowing career ambition to consume every other priority."
  ],

  bestUse:
    "Use strong ambition to pursue meaningful professional growth while ensuring that visibility is supported by genuine capability and sound judgement.",

  dailyExpression:
    "An ambitious career opportunity, visibility moment or professional development may feel especially significant today.",

  askSarathiExplanation:
    "Rahu activates the 10th house, strongly amplifying career ambition, visibility, professional experimentation and the desire for achievement.",

  lifeReportInterpretation:
    "Throughout life, career can become a major field of ambition and reinvention, with significant progress possible when the desire for recognition is supported by competence, ethics and realistic judgement.",

  confidence: 10,
},

rahu_in_11: {
  planet: "rahu",
  placementHouse: 11,
  key: "rahu_in_11",

  principle:
    "Rahu in the 11th house amplifies desire for gains, achievement, influential networks and the fulfilment of long-term ambitions.",

  synthesis:
    "The person may think ambitiously about future possibilities and seek networks capable of opening doors beyond ordinary reach. Large organisations, diverse groups, technology or unconventional communities can become important sources of opportunity.",

  psychology:
    "Achievement can stimulate the desire for the next goal very quickly. The person may therefore be highly ambitious but needs clarity about which aspirations genuinely matter.",

  areas: ["career", "money", "relationships", "publicImage"],

  practicalEffects: [
    "Ambitions expand.",
    "New networks may create opportunities.",
    "Potential gains receive attention.",
    "Influential or unconventional connections may emerge."
  ],

  opportunities: [
    "Expand strategic networks.",
    "Pursue ambitious goals.",
    "Explore scalable opportunities.",
    "Connect with people outside familiar circles."
  ],

  cautions: [
    "Avoid endless pursuit of the next gain.",
    "Do not treat every relationship as strategic.",
    "Avoid unrealistic expectations from networks."
  ],

  bestUse:
    "Use ambitious thinking and broad networks to create meaningful gains while remaining clear about which goals are genuinely worth pursuing.",

  dailyExpression:
    "A network, new connection or ambitious opportunity may offer a possible route toward an important long-term goal today.",

  askSarathiExplanation:
    "Rahu activates the 11th house, amplifying gains, networks, opportunities and the desire to fulfil increasingly ambitious goals.",

  lifeReportInterpretation:
    "Throughout life, broad networks and ambitious objectives can create significant opportunities, while lasting fulfilment depends on distinguishing meaningful goals from the endless pursuit of more.",

  confidence: 10,
},

rahu_in_12: {
  planet: "rahu",
  placementHouse: 12,
  key: "rahu_in_12",

  principle:
    "Rahu in the 12th house amplifies interest in foreign environments, private experience, hidden activity, expenditure, imagination and realities beyond familiar boundaries.",

  synthesis:
    "The person may be strongly drawn toward foreign places, unusual inner experiences or activities operating away from ordinary visibility. Imagination can expand considerably, requiring grounding so that curiosity remains constructive.",

  psychology:
    "There can be fascination with what lies beyond familiar experience, together with periods when the mind becomes absorbed in possibilities, private concerns or desires that are difficult to define clearly.",

  areas: ["travel", "hiddenMatters", "mind", "spirituality"],

  practicalEffects: [
    "Foreign matters may become prominent.",
    "Private activity increases.",
    "Unusual interests may develop.",
    "Expenditure or mental restlessness may increase."
  ],

  opportunities: [
    "Explore foreign opportunities carefully.",
    "Develop reflective awareness.",
    "Research unfamiliar subjects.",
    "Use imagination creatively."
  ],

  cautions: [
    "Avoid escapism.",
    "Do not allow hidden expenses to accumulate.",
    "Avoid becoming consumed by unclear fears or fantasies."
  ],

  bestUse:
    "Use curiosity about unfamiliar worlds for learning, creativity and inner development while maintaining practical grounding and clear boundaries.",

  dailyExpression:
    "A foreign connection, private matter or unusual idea may occupy more attention than expected today.",

  askSarathiExplanation:
    "Rahu activates the 12th house, amplifying foreign influences, private experience, expenditure, imagination and exploration beyond familiar boundaries.",

  lifeReportInterpretation:
    "Throughout life, foreign environments and unconventional inner experiences may significantly expand perspective, with maturity developing through learning to distinguish genuine exploration from escape or restless dissatisfaction.",

  confidence: 10,
},
ketu_in_1: {
  planet: "ketu",
  placementHouse: 1,
  key: "ketu_in_1",

  principle:
    "Ketu in the 1st house directs detachment, introspection and refinement toward identity, self-expression and personal direction.",

  synthesis:
    "The person may periodically question conventional definitions of identity and become less satisfied with recognition based purely on appearance, status or personality. Self-understanding develops through introspection and simplification.",

  psychology:
    "There can be an unusual distance from one's own identity, creating periods of uncertainty about how to define oneself but also encouraging deeper awareness beyond external labels.",

  areas: ["mind", "spirituality", "health", "publicImage"],

  practicalEffects: [
    "Personal priorities may be reconsidered.",
    "A need for solitude or reflection may arise.",
    "External recognition may feel less satisfying.",
    "Self-observation becomes stronger."
  ],

  opportunities: [
    "Clarify what genuinely matters.",
    "Develop self-awareness.",
    "Simplify unnecessary priorities.",
    "Act without excessive concern for recognition."
  ],

  cautions: [
    "Avoid becoming disconnected from practical needs.",
    "Do not interpret temporary uncertainty as lack of direction.",
    "Avoid excessive withdrawal."
  ],

  bestUse:
    "Use introspection to develop an identity based on genuine priorities rather than dependence on external validation.",

  dailyExpression:
    "You may feel less interested in external approval and more inclined to reconsider what genuinely matters to you today.",

  askSarathiExplanation:
    "Ketu activates the 1st house, directing detachment and introspection toward identity, self-expression and personal priorities.",

  lifeReportInterpretation:
    "Throughout life, identity may undergo repeated refinement as external labels become less satisfying and deeper self-understanding becomes increasingly important.",

  confidence: 10,
},

ketu_in_2: {
  planet: "ketu",
  placementHouse: 2,
  key: "ketu_in_2",

  principle:
    "Ketu in the 2nd house directs detachment, refinement and introspection toward money, family values, speech and personal resources.",

  synthesis:
    "Material accumulation alone may not provide lasting satisfaction. The person can develop a more selective relationship with possessions, family expectations and financial priorities as deeper values become clearer.",

  psychology:
    "There may be periodic distance from conventional ideas of security, encouraging the person to question what they genuinely need rather than simply accumulating more.",

  areas: ["money", "family", "communication", "spirituality"],

  practicalEffects: [
    "Financial priorities may be reconsidered.",
    "Speech may become concise or reserved.",
    "Family values may be questioned.",
    "Unnecessary expenditure or possessions may lose appeal."
  ],

  opportunities: [
    "Simplify financial priorities.",
    "Clarify personal values.",
    "Communicate with greater precision.",
    "Distinguish genuine needs from habitual wants."
  ],

  cautions: [
    "Avoid becoming careless about finances.",
    "Do not withdraw from necessary family communication.",
    "Avoid assuming material planning is unimportant."
  ],

  bestUse:
    "Develop a simpler and more intentional relationship with resources while maintaining practical financial responsibility.",

  dailyExpression:
    "A financial or family matter may encourage you to reconsider what is genuinely necessary or valuable today.",

  askSarathiExplanation:
    "Ketu activates the 2nd house, directing detachment and refinement toward money, family values, speech and material security.",

  lifeReportInterpretation:
    "Throughout life, the meaning of security may gradually shift from accumulation toward clearer values, simplicity and more intentional use of resources.",

  confidence: 10,
},

ketu_in_3: {
  planet: "ketu",
  placementHouse: 3,
  key: "ketu_in_3",

  principle:
    "Ketu in the 3rd house directs refinement, independence and selective attention toward communication, skills, learning and personal effort.",

  synthesis:
    "The person may become highly selective about communication and may prefer meaningful action over constant interaction. Existing abilities can operate intuitively, while motivation grows when effort has genuine purpose.",

  psychology:
    "There may be less interest in proving courage or capability through external validation, with confidence developing through quiet competence and self-directed effort.",

  areas: ["communication", "education", "career", "mind"],

  practicalEffects: [
    "Communication becomes more selective.",
    "Independent work may be preferred.",
    "An existing skill may operate intuitively.",
    "Unnecessary interaction may feel distracting."
  ],

  opportunities: [
    "Refine an existing skill.",
    "Communicate only what matters.",
    "Work independently.",
    "Remove distractions from personal effort."
  ],

  cautions: [
    "Avoid withdrawing from useful communication.",
    "Do not assume others understand what has not been expressed.",
    "Avoid losing interest before completing important tasks."
  ],

  bestUse:
    "Use focused effort and selective communication to deepen practical skills without becoming unnecessarily disconnected from others.",

  dailyExpression:
    "You may prefer focused independent work or a concise conversation rather than unnecessary interaction today.",

  askSarathiExplanation:
    "Ketu activates the 3rd house, directing refinement and selective attention toward communication, skills and personal effort.",

  lifeReportInterpretation:
    "Throughout life, communication and personal effort may become increasingly selective, with genuine capability developing through focused practice rather than the need to constantly prove oneself.",

  confidence: 10,
},

ketu_in_4: {
  planet: "ketu",
  placementHouse: 4,
  key: "ketu_in_4",

  principle:
    "Ketu in the 4th house directs detachment, introspection and refinement toward home, family, property, belonging and emotional security.",

  synthesis:
    "External comfort may not always create complete inner satisfaction. The person may periodically reconsider where or what feels like home, developing emotional stability through deeper internal grounding.",

  psychology:
    "There can be a subtle sense that conventional forms of comfort or belonging are insufficient, encouraging a more inward search for emotional peace.",

  areas: ["home", "family", "property", "mind"],

  practicalEffects: [
    "Home priorities may be reconsidered.",
    "A need for private space may increase.",
    "Property or domestic matters may feel less emotionally compelling.",
    "Inner peace becomes more important than appearances."
  ],

  opportunities: [
    "Simplify the home environment.",
    "Develop inner emotional stability.",
    "Resolve unnecessary domestic attachments.",
    "Create meaningful private space."
  ],

  cautions: [
    "Avoid emotional withdrawal from family.",
    "Do not neglect practical property responsibilities.",
    "Avoid assuming a change of environment alone will create peace."
  ],

  bestUse:
    "Develop emotional security from within while maintaining practical responsibility toward home, family and property.",

  dailyExpression:
    "A home or family matter may make you more aware of the difference between external comfort and genuine inner peace today.",

  askSarathiExplanation:
    "Ketu activates the 4th house, directing detachment and introspection toward home, family, belonging and emotional security.",

  lifeReportInterpretation:
    "Throughout life, the meaning of home and belonging may become increasingly internal, with emotional stability developing through self-understanding rather than external comfort alone.",

  confidence: 10,
},

ketu_in_5: {
  planet: "ketu",
  placementHouse: 5,
  key: "ketu_in_5",

  principle:
    "Ketu in the 5th house directs refinement, introspection and intuitive understanding toward intelligence, creativity, education, children and personal expression.",

  synthesis:
    "The person may possess intuitive or highly specialised forms of intelligence while feeling less satisfied by conventional recognition for them. Creativity and learning become more meaningful when pursued for depth rather than applause.",

  psychology:
    "There can be a sense of familiarity with certain intellectual or creative abilities, creating natural competence but sometimes reducing motivation unless the subject offers deeper meaning.",

  areas: ["education", "children", "mind", "relationships"],

  practicalEffects: [
    "Intuitive understanding becomes useful.",
    "Interest in specialised learning may increase.",
    "Creative priorities may change.",
    "Recognition may feel less important."
  ],

  opportunities: [
    "Deepen specialised knowledge.",
    "Follow meaningful creative interests.",
    "Use intuition alongside analysis.",
    "Guide children or students without imposing expectations."
  ],

  cautions: [
    "Avoid disengaging from useful education.",
    "Do not assume intuition eliminates the need for verification.",
    "Avoid emotional distance in romantic or children-related matters."
  ],

  bestUse:
    "Refine intelligence and creativity through meaningful study and expression without becoming dependent on recognition.",

  dailyExpression:
    "An intuitive insight, learning matter or creative idea may become clearer when approached without concern for external approval today.",

  askSarathiExplanation:
    "Ketu activates the 5th house, directing refinement and intuitive understanding toward learning, creativity, children and self-expression.",

  lifeReportInterpretation:
    "Throughout life, intellectual and creative abilities may become increasingly specialised and inwardly motivated, with fulfilment growing when knowledge and expression serve deeper meaning rather than recognition alone.",

  confidence: 10,
},

ketu_in_6: {
  planet: "ketu",
  placementHouse: 6,
  key: "ketu_in_6",

  principle:
    "Ketu in the 6th house directs detachment, refinement and analytical focus toward work, service, health, routines and practical challenges.",

  synthesis:
    "The person may develop an unusual ability to isolate problems and work through them without becoming emotionally attached to competition. Routine responsibilities become more effective when simplified and approached with focused precision.",

  psychology:
    "There may be limited interest in unnecessary conflict or workplace politics, while genuine problems can trigger concentrated and surprisingly effective problem-solving.",

  areas: ["career", "health", "mind", "communication"],

  practicalEffects: [
    "A persistent problem may become easier to isolate.",
    "Work distractions may lose importance.",
    "Routine simplification becomes useful.",
    "Conflict may feel less worth pursuing."
  ],

  opportunities: [
    "Simplify inefficient routines.",
    "Focus on the actual problem.",
    "Remove unnecessary workplace distractions.",
    "Develop disciplined health awareness."
  ],

  cautions: [
    "Avoid ignoring practical problems because they seem unimportant.",
    "Do not become detached from necessary health routines.",
    "Avoid withdrawing from responsibilities that still require completion."
  ],

  bestUse:
    "Use detachment to separate genuine problems from unnecessary conflict and direct effort toward practical solutions.",

  dailyExpression:
    "A work, health or routine problem may become easier to solve once unnecessary complications are removed today.",

  askSarathiExplanation:
    "Ketu activates the 6th house, directing detachment and refinement toward work, health, routines and practical problem-solving.",

  lifeReportInterpretation:
    "Throughout life, practical challenges can develop strong analytical detachment and problem-solving ability, especially when attention remains focused on what genuinely needs resolution.",

  confidence: 10,
},
ketu_in_7: {
  planet: "ketu",
  placementHouse: 7,
  key: "ketu_in_7",

  principle:
    "Ketu in the 7th house directs detachment, refinement and introspection toward partnerships, relationships, clients and agreements.",

  synthesis:
    "Relationships may become important arenas for understanding attachment, expectations and genuine compatibility. Conventional partnership dynamics may feel insufficient unless the connection carries deeper meaning or authenticity.",

  psychology:
    "The person may periodically feel detached within relationships or question what partnership truly provides. This can encourage greater self-awareness but requires conscious communication so that introspection does not become emotional distance.",

  areas: ["relationships", "communication", "career", "mind"],

  practicalEffects: [
    "Relationship expectations may be reconsidered.",
    "A partnership may require greater clarity.",
    "Superficial interactions may feel less satisfying.",
    "Independent judgement becomes important."
  ],

  opportunities: [
    "Clarify relationship expectations.",
    "Develop healthier boundaries.",
    "Focus on genuine compatibility.",
    "Approach agreements objectively."
  ],

  cautions: [
    "Avoid emotional withdrawal without explanation.",
    "Do not disengage simply because a relationship feels temporarily unsatisfying.",
    "Avoid assuming independence removes the need for cooperation."
  ],

  bestUse:
    "Use introspection to understand what genuinely matters in partnership while maintaining communication, commitment and healthy boundaries.",

  dailyExpression:
    "A partner, client or agreement may make you reconsider what genuinely matters within the relationship today.",

  askSarathiExplanation:
    "Ketu activates the 7th house, directing detachment and refinement toward partnerships, agreements and relationship expectations.",

  lifeReportInterpretation:
    "Throughout life, partnerships can become important vehicles for understanding attachment and compatibility, with relationship maturity developing through balancing independence with genuine emotional participation.",

  confidence: 10,
},

ketu_in_8: {
  planet: "ketu",
  placementHouse: 8,
  key: "ketu_in_8",

  principle:
    "Ketu in the 8th house directs introspection, refinement and intuitive understanding toward transformation, hidden knowledge, shared resources and deeper realities.",

  synthesis:
    "The person may naturally investigate what lies beneath surface events and can develop unusual insight into complex or hidden matters. Transformation may encourage simplification and deeper understanding rather than attachment to control.",

  psychology:
    "There can be an instinctive awareness that circumstances are temporary and that deeper understanding often requires letting go of assumptions, expectations or attachments.",

  areas: ["hiddenMatters", "spirituality", "money", "mind"],

  practicalEffects: [
    "Hidden details may become clearer.",
    "Research can produce deeper insight.",
    "Shared financial arrangements may need reassessment.",
    "An old attachment may lose importance."
  ],

  opportunities: [
    "Investigate deeply.",
    "Develop specialised knowledge.",
    "Simplify shared obligations.",
    "Use change for inner growth."
  ],

  cautions: [
    "Avoid becoming excessively withdrawn.",
    "Do not neglect shared financial responsibilities.",
    "Avoid relying entirely on intuition without practical verification."
  ],

  bestUse:
    "Use investigative depth and detachment to understand complex situations while remaining practically engaged with shared responsibilities.",

  dailyExpression:
    "A hidden detail, private concern or shared financial matter may become clearer when examined without emotional attachment today.",

  askSarathiExplanation:
    "Ketu activates the 8th house, directing introspection and refinement toward transformation, hidden knowledge and shared resources.",

  lifeReportInterpretation:
    "Throughout life, transformative experiences can develop considerable depth, intuition and investigative understanding, particularly as attachment to controlling every outcome gradually decreases.",

  confidence: 10,
},

ketu_in_9: {
  planet: "ketu",
  placementHouse: 9,
  key: "ketu_in_9",

  principle:
    "Ketu in the 9th house directs introspection, refinement and independent understanding toward beliefs, higher knowledge, teachers, spirituality and broader meaning.",

  synthesis:
    "Inherited beliefs or conventional philosophies may not provide complete satisfaction. The person may seek direct understanding and become increasingly selective about teachers, doctrines and systems of knowledge.",

  psychology:
    "There can be a strong desire to understand truth through personal experience rather than accepting beliefs solely because they are culturally or intellectually established.",

  areas: ["education", "spirituality", "travel", "mind"],

  practicalEffects: [
    "Existing beliefs may be reconsidered.",
    "A teacher or philosophy may be evaluated more critically.",
    "Interest in specialised knowledge may deepen.",
    "Travel may encourage introspection."
  ],

  opportunities: [
    "Study deeply.",
    "Question assumptions thoughtfully.",
    "Develop independent understanding.",
    "Explore spiritual knowledge through experience."
  ],

  cautions: [
    "Avoid rejecting useful guidance automatically.",
    "Do not confuse scepticism with wisdom.",
    "Avoid becoming detached from practical learning."
  ],

  bestUse:
    "Develop independent wisdom by combining thoughtful questioning, serious study and direct experience.",

  dailyExpression:
    "A belief, teaching or piece of advice may prompt deeper questioning and independent reflection today.",

  askSarathiExplanation:
    "Ketu activates the 9th house, directing refinement and independent understanding toward beliefs, higher knowledge, guidance and spirituality.",

  lifeReportInterpretation:
    "Throughout life, beliefs may become increasingly refined through questioning and direct experience, producing a worldview based more on internal understanding than unquestioned convention.",

  confidence: 10,
},

ketu_in_10: {
  planet: "ketu",
  placementHouse: 10,
  key: "ketu_in_10",

  principle:
    "Ketu in the 10th house directs detachment, refinement and specialised ability toward career, responsibility, reputation and public contribution.",

  synthesis:
    "Professional competence may develop without complete satisfaction from status or recognition alone. The person may periodically reconsider career direction and seek work that provides deeper meaning, autonomy or specialised contribution.",

  psychology:
    "External achievement can feel less fulfilling once attained, encouraging the person to question whether professional success genuinely reflects personal purpose rather than social expectation.",

  areas: ["career", "publicImage", "mind", "spirituality"],

  practicalEffects: [
    "Career priorities may be reconsidered.",
    "Recognition may feel less important.",
    "Specialised work can receive greater focus.",
    "A desire for greater professional meaning may emerge."
  ],

  opportunities: [
    "Refine professional expertise.",
    "Focus on meaningful contribution.",
    "Reassess career priorities.",
    "Work without excessive dependence on recognition."
  ],

  cautions: [
    "Avoid disengaging from career responsibilities.",
    "Do not abandon useful progress merely because recognition feels unsatisfying.",
    "Avoid becoming invisible when visibility is practically necessary."
  ],

  bestUse:
    "Develop specialised professional competence while defining success through meaningful contribution rather than status alone.",

  dailyExpression:
    "A professional responsibility or achievement may make you reconsider what kind of work actually feels meaningful today.",

  askSarathiExplanation:
    "Ketu activates the 10th house, directing detachment and refinement toward career, reputation and the meaning of professional achievement.",

  lifeReportInterpretation:
    "Throughout life, career goals may undergo significant refinement as external recognition becomes less important than specialised competence, autonomy and meaningful contribution.",

  confidence: 10,
},

ketu_in_11: {
  planet: "ketu",
  placementHouse: 11,
  key: "ketu_in_11",

  principle:
    "Ketu in the 11th house directs detachment, selectivity and refinement toward gains, friendships, networks and long-term aspirations.",

  synthesis:
    "Not every gain or social connection remains satisfying simply because it produces opportunity. The person may become increasingly selective about networks and goals, preferring meaningful associations and worthwhile ambitions.",

  psychology:
    "Achievement can reveal that fulfilment does not automatically increase with every new gain, encouraging deeper examination of which goals and relationships genuinely matter.",

  areas: ["career", "money", "relationships", "publicImage"],

  practicalEffects: [
    "Long-term goals may be reassessed.",
    "Social networks may become more selective.",
    "A previous ambition may lose importance.",
    "Quality of connections becomes more important than quantity."
  ],

  opportunities: [
    "Refine long-term goals.",
    "Strengthen meaningful networks.",
    "Release outdated ambitions.",
    "Focus resources on priorities that genuinely matter."
  ],

  cautions: [
    "Avoid withdrawing from useful networks unnecessarily.",
    "Do not dismiss material gains as inherently meaningless.",
    "Avoid abandoning goals before understanding why motivation has changed."
  ],

  bestUse:
    "Focus ambition and relationships on goals that retain genuine meaning rather than pursuing gains simply because they are available.",

  dailyExpression:
    "A goal, friendship or professional network may make you reconsider whether it still deserves your time and attention today.",

  askSarathiExplanation:
    "Ketu activates the 11th house, directing detachment and selectivity toward gains, networks and long-term aspirations.",

  lifeReportInterpretation:
    "Throughout life, ambitions and social networks may become increasingly selective, with fulfilment growing as energy shifts toward meaningful goals and dependable relationships rather than accumulation alone.",

  confidence: 10,
},

ketu_in_12: {
  planet: "ketu",
  placementHouse: 12,
  key: "ketu_in_12",

  principle:
    "Ketu in the 12th house strongly directs detachment, introspection, release and refinement toward solitude, spirituality, foreign environments and inner experience.",

  synthesis:
    "The person may possess a natural capacity for introspection and may periodically seek distance from external demands. Solitude, spiritual enquiry and the release of unnecessary attachments can become meaningful forms of development.",

  psychology:
    "There can be an instinctive awareness that external achievement alone cannot provide complete fulfilment, encouraging exploration of quieter and more inward dimensions of experience.",

  areas: ["spirituality", "mind", "travel", "hiddenMatters"],

  practicalEffects: [
    "A need for solitude may increase.",
    "Spiritual or reflective interests deepen.",
    "An outdated attachment may become easier to release.",
    "Foreign or secluded environments may encourage introspection."
  ],

  opportunities: [
    "Develop reflective practices.",
    "Release unnecessary attachments.",
    "Explore meaningful spiritual knowledge.",
    "Use solitude constructively."
  ],

  cautions: [
    "Avoid excessive withdrawal.",
    "Do not use spirituality to escape practical responsibilities.",
    "Avoid becoming disconnected from everyday life."
  ],

  bestUse:
    "Use introspection and detachment to develop inner clarity while remaining practically engaged with responsibilities and relationships.",

  dailyExpression:
    "Quiet reflection or time away from external demands may help you recognise something that is ready to be released today.",

  askSarathiExplanation:
    "Ketu activates the 12th house, strongly directing detachment, introspection and release toward spirituality, solitude and inner development.",

  lifeReportInterpretation:
    "Throughout life, solitude, spiritual enquiry and the gradual release of unnecessary attachments can become important sources of inner understanding and perspective.",

  confidence: 10,
},
};
