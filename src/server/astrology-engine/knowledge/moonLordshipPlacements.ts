/**
 * =====================================================
 * Moon Lordship Knowledge
 *
 * ✅ Chapter 1 Complete
 * Moon as 4th Lord (Aries Ascendant)
 *
 * Version: 1.0
 * Status: Locked
 * =====================================================
 */
import type { LifeArea } from "../types";

export type CuratedLordshipPlacementKnowledge = {
  lordshipHouse: number;
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
  keywords?: string[];

  examples?: string[];
  confidence: number;
};

export const MOON_LORDSHIP_PLACEMENTS: Record<
  string,
  CuratedLordshipPlacementKnowledge
> = {
  "4_lord_in_1": {
    lordshipHouse: 4,
    placementHouse: 1,
    key: "4_lord_in_1",

    principle:
      "The matters of the 4th house become central to the native's identity and daily experience.",

    synthesis:
      "Home, emotional wellbeing, inner peace, family responsibilities and personal comfort strongly influence the person's thoughts, behaviour and decisions.",

    psychology:
      "The person naturally seeks emotional security before taking action. Peace of mind directly affects confidence and productivity.",

    areas: ["home", "mind", "family", "health"],

    practicalEffects: [
      "Home matters become personally important.",
      "Mother or family may require attention.",
      "Comfort influences decision making.",
      "Property matters become more visible.",
    ],

    opportunities: [
      "Reconnect with family.",
      "Improve emotional wellbeing.",
      "Spend time at home.",
      "Organise personal space.",
    ],

    cautions: [
      "Avoid becoming emotionally reactive.",
      "Do not let mood control decisions.",
      "Avoid carrying family stress everywhere.",
    ],

    bestUse:
      "Strengthen emotional foundations before pursuing external goals.",

    dailyExpression:
      "Emotional balance directly affects confidence, productivity and personal decisions today.",

    askSarathiExplanation:
      "Because Moon rules the 4th house, its transit connects emotional wellbeing, home and inner peace with the person's immediate mindset and actions.",

    lifeReportInterpretation:
      "Throughout life, emotional stability, family atmosphere and inner security become major drivers of personal success and decision making.",

    confidence: 10,
  },
  "4_lord_in_2": {
  lordshipHouse: 4,
  placementHouse: 2,
  key: "4_lord_in_2",

  principle:
    "The matters of home, emotional wellbeing and inner security express through wealth, speech, family and values.",

  synthesis:
    "Family responsibilities, emotional comfort or domestic matters influence financial decisions, speech and interactions with close relatives.",

  psychology:
    "The person seeks emotional security through financial stability and harmonious family relationships.",

  areas: ["money", "family", "home", "mind"],

  practicalEffects: [
    "Family discussions may revolve around finances.",
    "Home expenses may increase.",
    "Food and comfort become emotionally significant.",
    "Speech reflects emotional state."
  ],

  opportunities: [
    "Resolve family financial matters.",
    "Invest in home improvements.",
    "Have meaningful family conversations.",
    "Review savings and household budgets."
  ],

  cautions: [
    "Avoid emotional spending.",
    "Avoid harsh speech with family.",
    "Do not seek comfort only through material purchases."
  ],

  bestUse:
    "Build emotional security through sensible financial planning and calm communication.",

  dailyExpression:
    "Home and family matters may influence your financial choices or conversations today.",

  askSarathiExplanation:
    "The Moon rules your 4th house and currently activates the 2nd, linking emotional security with money, speech and family values.",

  lifeReportInterpretation:
    "Throughout life, financial decisions are often closely connected to family responsibilities and emotional wellbeing.",

  confidence: 10,
},
"4_lord_in_3": {
  lordshipHouse: 4,
  placementHouse: 3,
  key: "4_lord_in_3",

  principle:
    "Home, comfort and emotional foundations express through communication, courage and personal effort.",

  synthesis:
    "Domestic matters motivate action. Communication with siblings, neighbours or close contacts may revolve around family or property.",

  psychology:
    "The person feels emotionally stronger when taking initiative rather than remaining passive.",

  areas: ["communication", "home", "travel", "family"],

  practicalEffects: [
    "Conversations about property or home.",
    "Short journeys connected to family.",
    "Helping siblings or relatives.",
    "Taking initiative for domestic matters."
  ],

  opportunities: [
    "Resolve family communication.",
    "Complete pending home tasks.",
    "Reconnect with siblings.",
    "Take practical action instead of worrying."
  ],

  cautions: [
    "Avoid emotional arguments.",
    "Don't overreact to small issues.",
    "Avoid impulsive communication."
  ],

  bestUse:
    "Use communication and practical effort to improve domestic harmony.",

  dailyExpression:
    "Taking initiative can help resolve home or family matters today.",

  askSarathiExplanation:
    "The Moon links emotional security with communication and effort, making practical conversations especially important.",

  lifeReportInterpretation:
    "Family responsibilities often require initiative, adaptability and effective communication throughout life.",

  confidence: 10,
},
"4_lord_in_4": {
  lordshipHouse: 4,
  placementHouse: 4,
  key: "4_lord_in_4",

  principle:
    "The lord occupies its own domain, strengthening home, emotional wellbeing, family and inner peace.",

  synthesis:
    "Emotional stability, domestic life, property and family become central themes. The person naturally seeks peace and security.",

  psychology:
    "A stable emotional foundation becomes the source of confidence and resilience.",

  areas: ["home", "family", "mind", "property"],

  practicalEffects: [
    "Peace at home improves productivity.",
    "Property matters gain importance.",
    "Closer connection with family.",
    "Improved emotional awareness."
  ],

  opportunities: [
    "Create a stable home environment.",
    "Strengthen family bonds.",
    "Focus on personal comfort and healing.",
    "Plan for long-term security."
  ],

  cautions: [
    "Avoid overattachment to comfort.",
    "Do not neglect outside responsibilities.",
    "Avoid emotional withdrawal."
  ],

  bestUse:
    "Use stability at home to build inner resilience and long-term plans.",

  dailyExpression:
    "A calm home life provides a strong foundation for decisions today.",

  askSarathiExplanation:
    "With Moon ruling its own house, domestic wellbeing and emotional security become the centerpiece of daily life.",

  lifeReportInterpretation:
    "A stable home and secure emotional base support growth and resilience throughout life.",

  confidence: 10,
},
"4_lord_in_5": {
  lordshipHouse: 4,
  placementHouse: 5,
  key: "4_lord_in_5",

  principle:
    "The matters of the 4th house express through intelligence, creativity, children and emotional expression.",

  synthesis:
    "Emotional wellbeing becomes closely connected with creativity, learning, children and personal inspiration. Home becomes a place of growth rather than simply comfort.",

  psychology:
    "The person feels emotionally fulfilled when creating, teaching, learning or spending meaningful time with children and loved ones.",

  areas: ["children", "home", "mind", "education"],

  practicalEffects: [
    "Children may require more emotional attention.",
    "Creative work becomes emotionally satisfying.",
    "Home may become a place for study or learning.",
    "Education and emotional wellbeing support each other."
  ],

  opportunities: [
    "Spend quality time with children.",
    "Start a creative project.",
    "Study something meaningful.",
    "Express emotions constructively."
  ],

  cautions: [
    "Avoid emotional drama.",
    "Do not overprotect children.",
    "Avoid making emotional decisions in speculative matters."
  ],

  bestUse:
    "Channel emotions into creativity, learning and meaningful relationships.",

  dailyExpression:
    "Creative thinking and emotional expression can bring greater satisfaction today.",

  askSarathiExplanation:
    "The Moon connects emotional security with creativity, children and higher learning, making heartfelt expression especially important today.",

  lifeReportInterpretation:
    "Throughout life, emotional fulfilment often comes through children, education, creativity and sharing knowledge.",

  confidence: 10,
},
"4_lord_in_6": {
  lordshipHouse: 4,
  placementHouse: 6,
  key: "4_lord_in_6",

  principle:
    "The matters of home and emotional wellbeing express through service, discipline, health and daily responsibilities.",

  synthesis:
    "Domestic responsibilities may require practical effort. Emotional peace is built through discipline, routine and solving everyday problems rather than avoiding them.",

  psychology:
    "The person often feels emotionally secure when life is organised, productive and under control, but may worry excessively about family responsibilities.",

  areas: ["health", "home", "family", "mind"],

  practicalEffects: [
    "Household duties increase.",
    "Health routines become important.",
    "Family responsibilities may demand practical attention.",
    "Emotional stress can affect physical wellbeing."
  ],

  opportunities: [
    "Improve daily routines.",
    "Resolve household issues.",
    "Support family through practical actions.",
    "Strengthen health habits."
  ],

  cautions: [
    "Avoid worrying over small domestic issues.",
    "Do not neglect your own health while caring for others.",
    "Avoid turning responsibilities into emotional burdens."
  ],

  bestUse:
    "Build emotional stability through disciplined routines and practical service.",

  dailyExpression:
    "Practical responsibilities at home may require patience, but steady effort brings peace.",

  askSarathiExplanation:
    "The Moon links emotional wellbeing with the 6th house of service, making discipline and routine important for maintaining inner balance.",

  lifeReportInterpretation:
    "Throughout life, emotional security is strengthened by responsibility, healthy routines and consistent practical effort.",

  confidence: 10,
},
"4_lord_in_7": {
  lordshipHouse: 4,
  placementHouse: 7,
  key: "4_lord_in_7",

  principle:
    "The matters of home and emotional wellbeing express through partnerships, marriage and public interactions.",

  synthesis:
    "Relationships become an important source of emotional security. Domestic harmony depends on cooperation, mutual understanding and balanced communication.",

  psychology:
    "The person naturally seeks emotional support through close partnerships and meaningful one-to-one relationships.",

  areas: ["relationships", "home", "family", "mind"],

  practicalEffects: [
    "Spouse or partner may need emotional support.",
    "Relationship discussions may focus on home or family.",
    "Joint decisions become important.",
    "Public interactions influence emotional wellbeing."
  ],

  opportunities: [
    "Strengthen communication with your partner.",
    "Resolve domestic disagreements.",
    "Work together on family goals.",
    "Build trust through openness."
  ],

  cautions: [
    "Avoid emotional dependence on others.",
    "Don't expect your partner to solve every emotional issue.",
    "Avoid unnecessary arguments over domestic matters."
  ],

  bestUse:
    "Create emotional stability through cooperation, empathy and balanced relationships.",

  dailyExpression:
    "Meaningful conversations with your partner or close allies can improve emotional balance today.",

  askSarathiExplanation:
    "The Moon connects emotional wellbeing with partnerships, making relationships a major influence on today's decisions and emotional state.",

  lifeReportInterpretation:
    "Throughout life, emotional fulfilment often depends on the quality of close partnerships and the ability to create harmony in relationships.",

  confidence: 10,
},
"4_lord_in_8": {
  lordshipHouse: 4,
  placementHouse: 8,
  key: "4_lord_in_8",

  principle:
    "The 4th lord carries emotional security, home and inner peace into the transformative environment of the 8th house.",

  synthesis:
    "Emotional peace develops through inner transformation rather than external comfort. Family matters may undergo change, requiring maturity and acceptance.",

  psychology:
    "The person often keeps emotions private and grows emotionally through life's challenges. Security comes from resilience rather than stability.",

  areas: ["mind", "home", "hiddenMatters", "family"],

  practicalEffects: [
    "Hidden family matters may surface.",
    "Property or inheritance discussions may arise.",
    "Emotional healing becomes important.",
    "Old memories may return for closure."
  ],

  opportunities: [
    "Heal old emotional wounds.",
    "Understand family patterns.",
    "Research property or financial matters carefully.",
    "Develop emotional resilience."
  ],

  cautions: [
    "Avoid reacting from fear or insecurity.",
    "Don't suppress emotions for too long.",
    "Avoid unnecessary secrecy within the family."
  ],

  bestUse:
    "Accept change with maturity and use emotional challenges as opportunities for growth.",

  dailyExpression:
    "Private emotions or family matters may need quiet reflection rather than immediate action today.",

  askSarathiExplanation:
    "The Moon links emotional wellbeing with transformation, making today's lessons more internal than external.",

  lifeReportInterpretation:
    "Throughout life, emotional maturity develops through periods of deep change, making inner strength one of your greatest assets.",

  confidence: 10,
},
"4_lord_in_9": {
  lordshipHouse: 4,
  placementHouse: 9,
  key: "4_lord_in_9",

  principle:
    "The 4th lord connects emotional wellbeing with higher wisdom, guidance, dharma and long-distance experiences.",

  synthesis:
    "Peace of mind grows through faith, learning, travel and guidance from mentors. Family values strongly influence beliefs and life philosophy.",

  psychology:
    "The person seeks emotional security through meaning, wisdom and a sense of purpose.",

  areas: ["spirituality", "education", "home", "travel"],

  practicalEffects: [
    "Conversations with teachers or elders.",
    "Planning travel with family.",
    "Interest in spiritual learning.",
    "Family traditions become important."
  ],

  opportunities: [
    "Seek guidance.",
    "Study spiritual subjects.",
    "Reconnect with family values.",
    "Travel with purpose."
  ],

  cautions: [
    "Avoid becoming rigid in beliefs.",
    "Don't ignore practical realities.",
    "Avoid judging others' viewpoints."
  ],

  bestUse:
    "Allow wisdom and perspective to guide emotional decisions.",

  dailyExpression:
    "A broader perspective can help resolve emotional concerns today.",

  askSarathiExplanation:
    "Today's Moon connects emotional wellbeing with higher learning and guidance, encouraging thoughtful decisions.",

  lifeReportInterpretation:
    "Throughout life, faith, learning and meaningful experiences become important sources of emotional stability.",

  confidence: 10,
},
"4_lord_in_10": {
  lordshipHouse: 4,
  placementHouse: 10,
  key: "4_lord_in_10",

  principle:
    "The 4th lord brings emotional security into the sphere of career, responsibility and public reputation.",

  synthesis:
    "Professional responsibilities directly influence emotional wellbeing. Success at work often depends on maintaining inner balance.",

  psychology:
    "The person feels emotionally fulfilled when contributing meaningfully through work and responsibility.",

  areas: ["career", "home", "publicImage", "mind"],

  practicalEffects: [
    "Career decisions affect family life.",
    "Professional recognition improves confidence.",
    "Balancing work and home becomes important.",
    "Authority figures influence emotions."
  ],

  opportunities: [
    "Strengthen your professional reputation.",
    "Lead calmly.",
    "Create work-life balance.",
    "Take responsibility with confidence."
  ],

  cautions: [
    "Don't neglect family for career.",
    "Avoid carrying workplace stress home.",
    "Don't seek emotional validation only through achievement."
  ],

  bestUse:
    "Build lasting success by balancing professional ambition with emotional wellbeing.",

  dailyExpression:
    "Career responsibilities may shape your emotional state more than usual today.",

  askSarathiExplanation:
    "The Moon connects home and emotional wellbeing with career, making professional responsibilities especially significant.",

  lifeReportInterpretation:
    "Throughout life, career and emotional fulfilment remain closely linked, requiring conscious balance.",

  confidence: 10,
},
"4_lord_in_11": {
  lordshipHouse: 4,
  placementHouse: 11,
  key: "4_lord_in_11",

  principle:
    "The 4th lord connects emotional wellbeing with gains, networks and long-term aspirations.",

  synthesis:
    "Friends, communities and long-term goals become important sources of emotional satisfaction. Family support often contributes to future success.",

  psychology:
    "The person feels emotionally secure when surrounded by supportive people working toward shared goals.",

  areas: ["money", "relationships", "home", "career"],

  practicalEffects: [
    "Support from friends.",
    "Family helps long-term plans.",
    "Networking improves confidence.",
    "Income may support domestic improvements."
  ],

  opportunities: [
    "Expand your network.",
    "Work toward long-term goals.",
    "Accept support from trusted people.",
    "Strengthen friendships."
  ],

  cautions: [
    "Avoid unrealistic expectations from friends.",
    "Don't neglect family while chasing ambitions.",
    "Avoid measuring happiness only through gains."
  ],

  bestUse:
    "Build meaningful relationships that support both emotional and practical growth.",

  dailyExpression:
    "Friends or networks may positively influence your emotional outlook today.",

  askSarathiExplanation:
    "Today's Moon links emotional wellbeing with future goals and supportive relationships.",

  lifeReportInterpretation:
    "Throughout life, meaningful friendships and long-term aspirations contribute significantly to emotional fulfilment.",

  confidence: 10,
},
"4_lord_in_12": {
  lordshipHouse: 4,
  placementHouse: 12,
  key: "4_lord_in_12",

  principle:
    "The 4th lord directs emotional security toward solitude, rest, spiritual reflection, foreign connections and release.",

  synthesis:
    "Inner peace is found through withdrawal from unnecessary noise. Home, family or emotional matters may require quiet reflection rather than immediate action.",

  psychology:
    "The person periodically needs solitude to restore emotional balance. External comfort alone rarely satisfies; deeper inner peace becomes the true goal.",

  areas: ["mind", "home", "spirituality", "money"],

  practicalEffects: [
    "Desire for solitude increases.",
    "Home-related expenses may arise.",
    "Sleep and rest become important.",
    "Foreign or distant family connections may become relevant."
  ],

  opportunities: [
    "Recharge emotionally.",
    "Practice meditation or prayer.",
    "Declutter your home and mind.",
    "Complete unfinished emotional matters."
  ],

  cautions: [
    "Avoid emotional isolation.",
    "Avoid unnecessary comfort-related spending.",
    "Don't ignore emotional needs while escaping into distractions."
  ],

  bestUse:
    "Choose quiet reflection over emotional reaction and allow yourself time to recharge.",

  dailyExpression:
    "Today is better suited for slowing down, completing unfinished emotional matters and protecting your inner peace.",

  askSarathiExplanation:
    "Because the Moon rules your 4th house and activates the 12th, emotional security is best found through rest, reflection and releasing unnecessary burdens today.",

  lifeReportInterpretation:
    "Throughout life, true emotional fulfilment develops through inner growth, spiritual maturity and learning when to let go rather than hold on.",

  confidence: 10,
},
"3_lord_in_1": {
  lordshipHouse: 3,
  placementHouse: 1,
  key: "3_lord_in_1",

  principle:
    "The 3rd lord brings courage, initiative and communication directly into the personality and identity.",

  synthesis:
    "The person naturally takes initiative, prefers learning through experience and influences others through communication and personal effort.",

  psychology:
    "Confidence grows by taking action. Remaining inactive often creates frustration, while progress comes through movement and self-expression.",

  areas: ["communication", "career", "mind", "travel"],

  practicalEffects: [
    "Important conversations may shape the day.",
    "Taking initiative produces better outcomes.",
    "Short trips or follow-ups become important.",
    "Personal efforts receive recognition."
  ],

  opportunities: [
    "Start something you've been postponing.",
    "Speak with confidence.",
    "Take ownership of pending work.",
    "Learn a practical skill."
  ],

  cautions: [
    "Avoid impatience.",
    "Don't dominate conversations.",
    "Think before reacting."
  ],

  bestUse:
    "Trust your initiative while communicating with patience and clarity.",

  dailyExpression:
    "Today rewards action more than waiting, especially where communication and initiative are involved.",

  askSarathiExplanation:
    "The Moon connects the house of effort with your identity, making personal initiative the strongest catalyst for today's progress.",

  lifeReportInterpretation:
    "Throughout life, success tends to come through self-effort, adaptability and the willingness to take the first step.",

  confidence: 10,
},
"3_lord_in_2": {
  lordshipHouse: 3,
  placementHouse: 2,
  key: "3_lord_in_2",

  principle:
    "The 3rd lord carries courage, communication and initiative into wealth, family, speech and values.",

  synthesis:
    "Communication directly influences financial growth and family relationships. Income often improves through personal skills, writing, sales, marketing or business initiatives.",

  psychology:
    "The person gains confidence when their ideas are appreciated. Speech becomes a powerful tool for creating opportunities.",

  areas: ["money", "communication", "family", "career"],

  practicalEffects: [
    "Important financial discussions may arise.",
    "Negotiation skills become valuable.",
    "Family conversations influence decisions.",
    "Personal skills may create earning opportunities."
  ],

  opportunities: [
    "Negotiate confidently.",
    "Present your ideas clearly.",
    "Learn a skill that increases income.",
    "Review financial plans with family."
  ],

  cautions: [
    "Avoid impulsive financial decisions.",
    "Do not use harsh speech.",
    "Avoid arguing over money."
  ],

  bestUse:
    "Use thoughtful communication to strengthen both finances and relationships.",

  dailyExpression:
    "Today's conversations may open financial opportunities if handled with patience and clarity.",

  askSarathiExplanation:
    "The Moon connects effort with wealth, making communication one of today's greatest assets.",

  lifeReportInterpretation:
    "Throughout life, financial progress often comes through communication, self-effort and practical skills.",

  confidence: 10,
},
"3_lord_in_3": {
  lordshipHouse: 3,
  placementHouse: 3,
  key: "3_lord_in_3",

  principle:
    "The lord occupies its own house, strengthening courage, initiative, communication and personal effort.",

  synthesis:
    "The person naturally prefers action over hesitation. Confidence grows through experience, communication and continuous learning.",

  psychology:
    "Self-belief develops by taking initiative rather than waiting for ideal circumstances.",

  areas: ["communication", "career", "travel", "education"],

  practicalEffects: [
    "Excellent day for networking.",
    "Writing and communication become productive.",
    "Short journeys prove beneficial.",
    "Projects move forward through personal effort."
  ],

  opportunities: [
    "Launch a new initiative.",
    "Reconnect with siblings.",
    "Complete pending communications.",
    "Promote your work."
  ],

  cautions: [
    "Avoid impatience.",
    "Don't become argumentative.",
    "Avoid scattering your energy across too many tasks."
  ],

  bestUse:
    "Trust your initiative and allow consistent effort to create momentum.",

  dailyExpression:
    "Today's energy strongly supports communication, learning and decisive action.",

  askSarathiExplanation:
    "With the Moon activating its own house, initiative and communication become the day's strongest assets.",

  lifeReportInterpretation:
    "Throughout life, courage, adaptability and continuous learning become major drivers of success.",

  confidence: 10,
},
"3_lord_in_4": {
  lordshipHouse: 3,
  placementHouse: 4,
  key: "3_lord_in_4",

  principle:
    "The 3rd lord brings communication, initiative and effort into home, family and emotional wellbeing.",

  synthesis:
    "Domestic matters require discussion and practical action. Emotional security grows when problems are addressed directly rather than avoided.",

  psychology:
    "The person prefers solving family matters through conversation and practical involvement rather than emotional withdrawal.",

  areas: ["home", "family", "communication", "mind"],

  practicalEffects: [
    "Family discussions become important.",
    "Home improvement projects gain momentum.",
    "Communication with parents improves.",
    "Planning brings emotional clarity."
  ],

  opportunities: [
    "Resolve domestic misunderstandings.",
    "Organise your living space.",
    "Reconnect with family members.",
    "Take initiative in household matters."
  ],

  cautions: [
    "Avoid emotional arguments at home.",
    "Don't suppress important conversations.",
    "Avoid unnecessary stubbornness."
  ],

  bestUse:
    "Bring patience and open communication into family matters.",

  dailyExpression:
    "Constructive conversations at home can improve emotional wellbeing today.",

  askSarathiExplanation:
    "The Moon connects effort with home, encouraging practical communication instead of emotional reactions.",

  lifeReportInterpretation:
    "Throughout life, family harmony is strengthened through honest communication and consistent effort.",

  confidence: 10,
},
"3_lord_in_5": {
  lordshipHouse: 3,
  placementHouse: 5,
  key: "3_lord_in_5",

  principle:
    "The 3rd lord directs initiative and communication toward creativity, intelligence and children.",

  synthesis:
    "Creative expression becomes a powerful tool for growth. Ideas, teaching, content creation and learning flourish through consistent effort.",

  psychology:
    "The person enjoys expressing ideas creatively and gains confidence through intellectual achievement.",

  areas: ["children","education","communication","career"],

  practicalEffects: [
    "Creative projects gain momentum.",
    "Meaningful conversations with children.",
    "Learning becomes enjoyable.",
    "Ideas receive appreciation."
  ],

  opportunities: [
    "Write or create content.",
    "Study a new subject.",
    "Teach or mentor someone.",
    "Share your ideas confidently."
  ],

  cautions: [
    "Avoid overconfidence.",
    "Don't rush speculative decisions.",
    "Avoid intellectual arrogance."
  ],

  bestUse:
    "Express your ideas creatively while remaining open to learning.",

  dailyExpression:
    "Creative thinking and communication can open unexpected opportunities today.",

  askSarathiExplanation:
    "The Moon connects effort with creativity, making expression and learning today's strongest strengths.",

  lifeReportInterpretation:
    "Throughout life, success comes through combining creativity with disciplined effort.",

  confidence: 10,
},
"3_lord_in_6": {
  lordshipHouse: 3,
  placementHouse: 6,
  key: "3_lord_in_6",

  principle:
    "The 3rd lord channels courage into work, discipline, service and overcoming obstacles.",

  synthesis:
    "Persistent effort solves problems. Progress comes through discipline rather than shortcuts.",

  psychology:
    "Challenges motivate rather than discourage the person when confidence is maintained.",

  areas: ["health","career","communication","mind"],

  practicalEffects: [
    "Pending work moves forward.",
    "Important follow-ups succeed.",
    "Competition increases.",
    "Health routines need attention."
  ],

  opportunities: [
    "Finish pending tasks.",
    "Resolve workplace issues.",
    "Improve daily habits.",
    "Stand your ground calmly."
  ],

  cautions: [
    "Avoid unnecessary conflicts.",
    "Don't overwork.",
    "Avoid reacting impulsively."
  ],

  bestUse:
    "Stay disciplined and let steady effort overcome obstacles.",

  dailyExpression:
    "Today's progress comes through persistence rather than speed.",

  askSarathiExplanation:
    "The Moon joins initiative with service, making disciplined action especially productive today.",

  lifeReportInterpretation:
    "Throughout life, consistent effort becomes your greatest competitive advantage.",

  confidence: 10,
},
"3_lord_in_7": {
  lordshipHouse: 3,
  placementHouse: 7,
  key: "3_lord_in_7",

  principle:
    "The 3rd lord directs communication toward partnerships, agreements and public interactions.",

  synthesis:
    "Relationships thrive through honest communication and shared initiative.",

  psychology:
    "The person values active dialogue and intellectual connection in relationships.",

  areas: ["relationships","communication","career","travel"],

  practicalEffects: [
    "Partnership discussions increase.",
    "Client interactions become important.",
    "Negotiations move forward.",
    "Travel with partners is possible."
  ],

  opportunities: [
    "Strengthen partnerships.",
    "Resolve disagreements.",
    "Network confidently.",
    "Collaborate on shared goals."
  ],

  cautions: [
    "Avoid arguments.",
    "Don't dominate discussions.",
    "Avoid making promises too quickly."
  ],

  bestUse:
    "Use communication to strengthen trust and cooperation.",

  dailyExpression:
    "Meaningful conversations create progress today.",

  askSarathiExplanation:
    "The Moon connects initiative with partnerships, making communication the key to success.",

  lifeReportInterpretation:
    "Throughout life, relationships become stronger through mutual effort and honest dialogue.",

  confidence: 10,
},
"3_lord_in_8": {
  lordshipHouse: 3,
  placementHouse: 8,
  key: "3_lord_in_8",

  principle:
    "The 3rd lord carries initiative into transformation, research and hidden matters.",

  synthesis:
    "Progress comes through patience, investigation and adapting to change.",

  psychology:
    "The person prefers understanding situations deeply before taking action.",

  areas: ["hiddenMatters","communication","mind","spirituality"],

  practicalEffects: [
    "Research becomes productive.",
    "Unexpected news arrives.",
    "Hidden information surfaces.",
    "Private discussions gain importance."
  ],

  opportunities: [
    "Investigate carefully.",
    "Learn hidden skills.",
    "Transform old habits.",
    "Reflect before acting."
  ],

  cautions: [
    "Avoid gossip.",
    "Don't react emotionally to surprises.",
    "Avoid unnecessary secrecy."
  ],

  bestUse:
    "Allow careful observation to guide your actions.",

  dailyExpression:
    "Patience reveals opportunities that impulsiveness would miss.",

  askSarathiExplanation:
    "The Moon links initiative with transformation, encouraging thoughtful rather than reactive decisions.",

  lifeReportInterpretation:
    "Throughout life, wisdom develops through adapting to change and understanding deeper patterns.",

  confidence: 10,
},
"3_lord_in_9": {
  lordshipHouse: 3,
  placementHouse: 9,
  key: "3_lord_in_9",

  principle:
    "The 3rd lord connects effort with higher learning, philosophy and guidance.",

  synthesis:
    "Success comes when initiative is aligned with wisdom and purpose.",

  psychology:
    "The person enjoys learning, travelling and broadening perspectives.",

  areas: ["education","travel","spirituality","communication"],

  practicalEffects: [
    "Learning opportunities arise.",
    "Travel planning succeeds.",
    "Guidance from mentors helps.",
    "Faith strengthens confidence."
  ],

  opportunities: [
    "Study.",
    "Travel.",
    "Seek advice.",
    "Share knowledge."
  ],

  cautions: [
    "Avoid rigid thinking.",
    "Don't ignore experienced advice.",
    "Avoid acting without perspective."
  ],

  bestUse:
    "Allow wisdom to guide your initiative.",

  dailyExpression:
    "Learning something new may unlock an important opportunity today.",

  askSarathiExplanation:
    "The Moon joins effort with wisdom, making thoughtful action especially rewarding.",

  lifeReportInterpretation:
    "Throughout life, knowledge and experience become the foundation of success.",

  confidence: 10,
},
"3_lord_in_10": {
  lordshipHouse: 3,
  placementHouse: 10,
  key: "3_lord_in_10",

  principle:
    "The 3rd lord directs initiative toward career, responsibility and achievement.",

  synthesis:
    "Professional growth comes through communication, visibility and taking initiative.",

  psychology:
    "The person enjoys being recognised for effort and practical achievements.",

  areas: ["career","communication","publicImage","money"],

  practicalEffects: [
    "Career conversations increase.",
    "Leadership opportunities arise.",
    "Visibility improves.",
    "Projects move ahead."
  ],

  opportunities: [
    "Lead.",
    "Present ideas.",
    "Network professionally.",
    "Accept responsibility."
  ],

  cautions: [
    "Avoid ego clashes.",
    "Don't overpromise.",
    "Avoid neglecting personal life."
  ],

  bestUse:
    "Take initiative confidently while remaining dependable.",

  dailyExpression:
    "Career progress favours proactive communication today.",

  askSarathiExplanation:
    "The Moon combines initiative with professional responsibility, making visible action rewarding.",

  lifeReportInterpretation:
    "Throughout life, professional success grows through courage, communication and consistent effort.",

  confidence: 10,
},
"3_lord_in_11": {
  lordshipHouse: 3,
  placementHouse: 11,
  key: "3_lord_in_11",

  principle:
    "The 3rd lord connects communication with gains, friendships and long-term ambitions.",

  synthesis:
    "Networking and consistent effort create opportunities for growth and fulfilment.",

  psychology:
    "The person enjoys collaborating with like-minded people to achieve goals.",

  areas: ["money","relationships","career","communication"],

  practicalEffects: [
    "Friends provide opportunities.",
    "Networking expands.",
    "Income grows through effort.",
    "Goals become clearer."
  ],

  opportunities: [
    "Collaborate.",
    "Expand your network.",
    "Reconnect with useful contacts.",
    "Plan future goals."
  ],

  cautions: [
    "Avoid unrealistic expectations.",
    "Don't neglect close relationships.",
    "Avoid chasing every opportunity."
  ],

  bestUse:
    "Use communication to build lasting opportunities.",

  dailyExpression:
    "Supportive conversations may open new doors today.",

  askSarathiExplanation:
    "The Moon links initiative with gains, making networking especially productive.",

  lifeReportInterpretation:
    "Throughout life, friendships and communication become valuable sources of opportunity.",

  confidence: 10,
},
"3_lord_in_12": {
  lordshipHouse: 3,
  placementHouse: 12,
  key: "3_lord_in_12",

  principle:
    "The 3rd lord directs effort toward reflection, solitude, foreign connections and inner growth.",

  synthesis:
    "Not every action needs immediate expression. Sometimes progress comes through planning, observation and quiet preparation.",

  psychology:
    "The person periodically withdraws to reorganise thoughts before taking decisive action.",

  areas: ["mind","travel","spirituality","communication"],

  practicalEffects: [
    "Quiet planning becomes productive.",
    "Foreign contacts become important.",
    "Sleep and reflection improve clarity.",
    "Communication slows but deepens."
  ],

  opportunities: [
    "Plan behind the scenes.",
    "Meditate.",
    "Reconnect with distant contacts.",
    "Complete unfinished work."
  ],

  cautions: [
    "Avoid isolation.",
    "Don't overthink every decision.",
    "Avoid wasting energy on distractions."
  ],

  bestUse:
    "Use solitude to prepare for meaningful action rather than escaping responsibility.",

  dailyExpression:
    "Today's progress comes from thoughtful preparation rather than immediate action.",

  askSarathiExplanation:
    "The Moon joins initiative with reflection, encouraging careful preparation before acting.",

  lifeReportInterpretation:
    "Throughout life, quiet preparation often produces stronger results than impulsive action.",

  confidence: 10,
},
"2_lord_in_1": {
  lordshipHouse: 2,
  placementHouse: 1,
  key: "2_lord_in_1",

  principle:
    "The 2nd lord brings wealth, values, family and speech directly into the personality and identity.",

  synthesis:
    "The person's confidence is closely connected to financial security, family values and the ability to communicate effectively. Personal effort naturally influences income and reputation.",

  psychology:
    "Feeling financially secure and respected for one's words creates emotional confidence. The person naturally values stability and credibility.",

  areas: ["money", "family", "communication", "mind"],

  practicalEffects: [
    "Financial matters become personally important.",
    "People pay closer attention to your words.",
    "Family responsibilities may influence decisions.",
    "Confidence improves through practical achievements."
  ],

  opportunities: [
    "Present your ideas confidently.",
    "Review personal finances.",
    "Strengthen family relationships.",
    "Build long-term financial stability."
  ],

  cautions: [
    "Avoid speaking impulsively.",
    "Don't let financial worries affect confidence.",
    "Avoid becoming overly attached to status."
  ],

  bestUse:
    "Let your values guide your decisions while communicating with clarity and confidence.",

  dailyExpression:
    "Today's choices around communication and finances can have a lasting impact.",

  askSarathiExplanation:
    "The Moon rules your 2nd house and activates the 1st, bringing money, family values and communication directly into today's decisions and self-expression.",

  lifeReportInterpretation:
    "Throughout life, your identity becomes closely linked with your values, financial habits and the way you communicate with others.",

  confidence: 10,
},
"2_lord_in_2": {
  lordshipHouse: 2,
  placementHouse: 2,
  key: "2_lord_in_2",

  principle:
    "The lord occupies its own house, strengthening wealth, family, speech and accumulated resources.",

  synthesis:
    "Financial stability and family values become central themes. The person naturally seeks security through careful planning and responsible resource management.",

  psychology:
    "Confidence grows when life feels financially stable and relationships within the family remain harmonious.",

  areas: ["money","family","communication","mind"],

  practicalEffects: [
    "Financial planning becomes productive.",
    "Family discussions bring clarity.",
    "Speech carries greater influence.",
    "Savings receive attention."
  ],

  opportunities: [
    "Review investments.",
    "Strengthen family relationships.",
    "Communicate thoughtfully.",
    "Build long-term security."
  ],

  cautions: [
    "Avoid stubbornness regarding money.",
    "Don't allow financial concerns to create unnecessary anxiety.",
    "Avoid harsh speech."
  ],

  bestUse:
    "Strengthen long-term stability through thoughtful financial and family decisions.",

  dailyExpression:
    "Today's practical decisions can strengthen both financial and emotional security.",

  askSarathiExplanation:
    "The Moon activates its own house, making finances, family and speech especially significant today.",

  lifeReportInterpretation:
    "Throughout life, stable finances and strong family values become major foundations of success.",

  confidence: 10,
},
"2_lord_in_3": {
  lordshipHouse: 2,
  placementHouse: 3,
  key: "2_lord_in_3",

  principle:
    "The 2nd lord carries wealth and values into communication, initiative and self-effort.",

  synthesis:
    "Income improves through communication, practical skills and personal initiative.",

  psychology:
    "The person feels secure when actively creating opportunities rather than waiting for them.",

  areas:["communication","money","career","travel"],

  practicalEffects:[
    "Important conversations.",
    "Writing or sales activities improve.",
    "Short journeys prove useful.",
    "Skills create income."
  ],

  opportunities:[
    "Promote yourself.",
    "Learn a valuable skill.",
    "Negotiate confidently.",
    "Take initiative."
  ],

  cautions:[
    "Avoid impulsive speech.",
    "Don't underestimate preparation.",
    "Avoid unnecessary arguments."
  ],

  bestUse:
    "Use communication as your greatest financial asset.",

  dailyExpression:
    "Today's conversations may directly influence future opportunities.",

  askSarathiExplanation:
    "The Moon links wealth with communication, making initiative especially rewarding today.",

  lifeReportInterpretation:
    "Throughout life, personal skills and communication become important sources of prosperity.",

  confidence:10,
},
"2_lord_in_4": {
  lordshipHouse:2,
  placementHouse:4,
  key:"2_lord_in_4",

  principle:
    "The 2nd lord connects wealth with home, family and emotional security.",

  synthesis:
    "Financial stability contributes directly to peace of mind and family wellbeing.",

  psychology:
    "The person naturally seeks emotional comfort through stability and responsible planning.",

  areas:["home","money","family","property"],

  practicalEffects:[
    "Property matters gain attention.",
    "Family finances improve.",
    "Home-related purchases.",
    "Planning creates peace."
  ],

  opportunities:[
    "Improve your home.",
    "Review property matters.",
    "Strengthen family support.",
    "Save for future goals."
  ],

  cautions:[
    "Avoid emotional spending.",
    "Don't mix financial stress with family relationships.",
    "Avoid unnecessary luxury purchases."
  ],

  bestUse:
    "Build lasting security through wise financial planning.",

  dailyExpression:
    "Financial decisions made today can improve long-term stability.",

  askSarathiExplanation:
    "The Moon connects wealth with home and emotional wellbeing.",

  lifeReportInterpretation:
    "Throughout life, financial security becomes closely linked with family happiness.",

  confidence:10,
},
"2_lord_in_5": {
  lordshipHouse:2,
  placementHouse:5,
  key:"2_lord_in_5",

  principle:"The 2nd lord directs wealth toward creativity, education and children.",

  synthesis:"Creative talents and knowledge become important assets for financial growth.",

  psychology:"The person enjoys investing in learning and sharing knowledge.",

  areas:["children","education","money","communication"],

  practicalEffects:[
    "Creative ideas generate opportunities.",
    "Educational pursuits prove valuable.",
    "Children require financial planning.",
    "Ideas gain appreciation."
  ],

  opportunities:[
    "Teach.",
    "Create.",
    "Invest in education.",
    "Share knowledge."
  ],

  cautions:[
    "Avoid risky speculation.",
    "Don't ignore practical planning.",
    "Avoid ego-driven decisions."
  ],

  bestUse:"Turn knowledge into long-term value.",

  dailyExpression:"Creative thinking can improve financial prospects today.",

  askSarathiExplanation:"The Moon combines wealth with creativity and learning.",

  lifeReportInterpretation:"Throughout life, education and creativity become valuable financial resources.",

  confidence:10,
},
"2_lord_in_6": {
  lordshipHouse:2,
  placementHouse:6,
  key:"2_lord_in_6",

  principle:"The 2nd lord directs wealth toward service, discipline and problem solving.",

  synthesis:"Financial stability grows through consistent work and disciplined routines.",

  psychology:"Security comes from knowing responsibilities are under control.",

  areas:["money","career","health","communication"],

  practicalEffects:[
    "Workplace discussions increase.",
    "Bills or repayments need attention.",
    "Health spending may arise.",
    "Routine improves efficiency."
  ],

  opportunities:[
    "Organise finances.",
    "Improve productivity.",
    "Finish pending work.",
    "Resolve disputes."
  ],

  cautions:[
    "Avoid unnecessary borrowing.",
    "Don't neglect health.",
    "Avoid workplace conflicts."
  ],

  bestUse:"Discipline today creates stability tomorrow.",

  dailyExpression:"Careful planning helps prevent unnecessary financial pressure.",

  askSarathiExplanation:"The Moon links wealth with practical service and discipline.",

  lifeReportInterpretation:"Throughout life, prosperity develops through consistent effort.",

  confidence:10,
},
"2_lord_in_7": {
  lordshipHouse:2,
  placementHouse:7,
  key:"2_lord_in_7",

  principle:"The 2nd lord connects wealth with partnerships and agreements.",

  synthesis:"Relationships and collaborations influence financial growth.",

  psychology:"The person values dependable partnerships and mutual trust.",

  areas:["relationships","money","communication","career"],

  practicalEffects:[
    "Financial discussions with partners.",
    "Business opportunities arise.",
    "Negotiations succeed.",
    "Relationships influence decisions."
  ],

  opportunities:[
    "Collaborate.",
    "Negotiate fairly.",
    "Strengthen partnerships.",
    "Build trust."
  ],

  cautions:[
    "Avoid financial misunderstandings.",
    "Don't dominate discussions.",
    "Avoid unrealistic expectations."
  ],

  bestUse:"Build prosperity through cooperation.",

  dailyExpression:"Working with others brings better results today.",

  askSarathiExplanation:"The Moon combines finances with partnerships.",

  lifeReportInterpretation:"Throughout life, relationships become important contributors to prosperity.",

  confidence:10,
},
"2_lord_in_8": {
  lordshipHouse:2,
  placementHouse:8,
  key:"2_lord_in_8",

  principle:"The 2nd lord carries wealth into transformation and shared resources.",

  synthesis:"Financial change encourages deeper planning and long-term thinking.",

  psychology:"Security develops through resilience rather than certainty.",

  areas:["money","hiddenMatters","family","mind"],

  practicalEffects:[
    "Unexpected expenses.",
    "Insurance or tax matters.",
    "Inheritance discussions.",
    "Financial review."
  ],

  opportunities:[
    "Review investments.",
    "Reduce financial risk.",
    "Plan carefully.",
    "Research thoroughly."
  ],

  cautions:[
    "Avoid speculation.",
    "Don't panic over sudden changes.",
    "Avoid secrecy in finances."
  ],

  bestUse:"Use change as an opportunity to build stronger foundations.",

  dailyExpression:"Today's adjustments can improve long-term financial stability.",

  askSarathiExplanation:"The Moon encourages thoughtful management of shared resources.",

  lifeReportInterpretation:"Throughout life, financial wisdom develops through experience.",

  confidence:10,
},
"2_lord_in_9": {
  lordshipHouse:2,
  placementHouse:9,
  key:"2_lord_in_9",

  principle:"The 2nd lord connects wealth with wisdom, higher learning and fortune.",

  synthesis:"Knowledge and ethics become important contributors to prosperity.",

  psychology:"The person feels secure when acting according to values and principles.",

  areas:["education","money","spirituality","travel"],

  practicalEffects:[
    "Learning improves income.",
    "Mentors provide guidance.",
    "Travel opportunities.",
    "Long-term planning succeeds."
  ],

  opportunities:[
    "Study.",
    "Seek guidance.",
    "Travel.",
    "Expand knowledge."
  ],

  cautions:[
    "Avoid arrogance.",
    "Don't ignore good advice.",
    "Avoid short-term thinking."
  ],

  bestUse:"Invest in knowledge before expecting financial returns.",

  dailyExpression:"A broader perspective helps improve financial decisions today.",

  askSarathiExplanation:"The Moon combines wealth with higher wisdom.",

  lifeReportInterpretation:"Throughout life, prosperity grows through learning and ethical conduct.",

  confidence:10,
},
"2_lord_in_10": {
  lordshipHouse:2,
  placementHouse:10,
  key:"2_lord_in_10",

  principle:"The 2nd lord directs wealth toward career and public achievement.",

  synthesis:"Career becomes the primary source of financial stability.",

  psychology:"Professional success strongly influences confidence.",

  areas:["career","money","publicImage","communication"],

  practicalEffects:[
    "Career recognition.",
    "Income opportunities.",
    "Leadership responsibilities.",
    "Professional visibility."
  ],

  opportunities:[
    "Lead.",
    "Present ideas.",
    "Take responsibility.",
    "Strengthen reputation."
  ],

  cautions:[
    "Avoid chasing status alone.",
    "Don't neglect family.",
    "Avoid overworking."
  ],

  bestUse:"Let consistent professional excellence create lasting prosperity.",

  dailyExpression:"Career decisions today may have lasting financial benefits.",

  askSarathiExplanation:"The Moon links financial stability with professional responsibilities.",

  lifeReportInterpretation:"Throughout life, career becomes the strongest pillar of wealth.",

  confidence:10,
},
"2_lord_in_11": {
  lordshipHouse:2,
  placementHouse:11,
  key:"2_lord_in_11",

  principle:"The 2nd lord connects accumulated wealth with gains and fulfilment of ambitions.",

  synthesis:"Income grows through networks, collaboration and long-term planning.",

  psychology:"The person enjoys building prosperity through meaningful relationships.",

  areas:["money","career","relationships","communication"],

  practicalEffects:[
    "Networking creates opportunities.",
    "Income improves.",
    "Goals become achievable.",
    "Support from friends."
  ],

  opportunities:[
    "Expand your network.",
    "Work toward long-term goals.",
    "Accept collaboration.",
    "Review investments."
  ],

  cautions:[
    "Avoid unrealistic expectations.",
    "Don't depend entirely on others.",
    "Avoid chasing quick profits."
  ],

  bestUse:"Build lasting prosperity through strong relationships.",

  dailyExpression:"Supportive people may contribute to today's financial progress.",

  askSarathiExplanation:"The Moon combines wealth with gains and networks.",

  lifeReportInterpretation:"Throughout life, friendships and alliances contribute significantly to prosperity.",

  confidence:10,
},
"2_lord_in_12": {
  lordshipHouse:2,
  placementHouse:12,
  key:"2_lord_in_12",

  principle:"The 2nd lord directs wealth toward expenses, charity, foreign lands and inner growth.",

  synthesis:"Financial wisdom comes through understanding the balance between spending and preserving resources.",

  psychology:"The person gradually learns that security is created through mindful choices rather than accumulation alone.",

  areas:["money","spirituality","travel","mind"],

  practicalEffects:[
    "Unexpected expenses.",
    "Foreign transactions.",
    "Charitable giving.",
    "Financial reflection."
  ],

  opportunities:[
    "Review spending.",
    "Donate wisely.",
    "Plan international matters.",
    "Simplify finances."
  ],

  cautions:[
    "Avoid unnecessary expenses.",
    "Don't ignore budgeting.",
    "Avoid emotional spending."
  ],

  bestUse:"Spend consciously while protecting long-term financial stability.",

  dailyExpression:"Today's financial choices deserve extra attention.",

  askSarathiExplanation:"The Moon directs attention toward expenses and the wiser use of resources.",

  lifeReportInterpretation:"Throughout life, financial maturity develops through learning balance, generosity and disciplined resource management.",

  confidence:10,
},
"12_lord_in_1": {
  lordshipHouse: 12,
  placementHouse: 1,
  key: "12_lord_in_1",
  principle: "The 12th lord brings rest, expenses, foreign matters and inner release into the self and body.",
  synthesis: "The person may feel more inward, sensitive or reflective. Energy is best used for rest, private planning and emotional reset.",
  psychology: "The mind seeks space before acting. Overexertion can reduce clarity.",
  areas: ["mind", "health", "spirituality", "travel"],
  practicalEffects: [
    "Energy may feel lower than usual.",
    "Sleep and rest become important.",
    "Private matters influence decisions.",
    "Foreign or distant matters may come up."
  ],
  opportunities: [
    "Rest and reset.",
    "Reflect before acting.",
    "Plan privately.",
    "Reduce unnecessary noise."
  ],
  cautions: [
    "Avoid emotional withdrawal.",
    "Do not overextend physically.",
    "Avoid unnecessary expenses."
  ],
  bestUse: "Use the day to recharge and make decisions from a calm state.",
  dailyExpression: "Your energy may need protection today, so move slowly and avoid unnecessary pressure.",
  askSarathiExplanation: "The Moon rules the 12th house and activates the self, bringing rest, release and private reflection into personal decisions.",
  lifeReportInterpretation: "Throughout life, inner growth, solitude, foreign links and emotional release strongly shape identity and direction.",
  confidence: 10,
},

"12_lord_in_2": {
  lordshipHouse: 12,
  placementHouse: 2,
  key: "12_lord_in_2",
  principle: "The 12th lord connects expenses, release and foreign matters with money, speech and family.",
  synthesis: "Financial choices require care. Family conversations, spending habits or private concerns may influence emotional security.",
  psychology: "The person learns to balance generosity with financial discipline.",
  areas: ["money", "family", "communication", "mind"],
  practicalEffects: [
    "Expenses may increase.",
    "Family conversations require patience.",
    "Speech may reveal emotional tiredness.",
    "Foreign payments or distant family matters may arise."
  ],
  opportunities: [
    "Review spending.",
    "Speak gently.",
    "Simplify finances.",
    "Resolve family concerns calmly."
  ],
  cautions: [
    "Avoid emotional spending.",
    "Avoid harsh speech.",
    "Do not ignore budgeting."
  ],
  bestUse: "Spend consciously and speak with emotional maturity.",
  dailyExpression: "Money and family matters need careful handling today, especially where expenses or emotional speech are involved.",
  askSarathiExplanation: "The Moon links the 12th house of expenses and release with the 2nd house of money, speech and family.",
  lifeReportInterpretation: "Throughout life, financial maturity develops through learning when to spend, save, speak and let go.",
  confidence: 10,
},

"12_lord_in_3": {
  lordshipHouse: 12,
  placementHouse: 3,
  key: "12_lord_in_3",
  principle: "The 12th lord directs rest, solitude and foreign matters into communication, effort and short movement.",
  synthesis: "Progress comes through quiet planning, thoughtful communication and behind-the-scenes effort.",
  psychology: "The person may need private preparation before expressing ideas confidently.",
  areas: ["communication", "travel", "mind", "spirituality"],
  practicalEffects: [
    "Private conversations become important.",
    "Short travel may feel tiring.",
    "Writing or planning works better than confrontation.",
    "Distant communication may arise."
  ],
  opportunities: [
    "Plan quietly.",
    "Write or document ideas.",
    "Reconnect with distant contacts.",
    "Use solitude for preparation."
  ],
  cautions: [
    "Avoid scattered communication.",
    "Do not force conversations.",
    "Avoid wasting energy on minor issues."
  ],
  bestUse: "Prepare carefully before speaking or acting.",
  dailyExpression: "Quiet planning and thoughtful communication bring better results than rushing today.",
  askSarathiExplanation: "The Moon connects the 12th house with the 3rd, so effort works best when supported by reflection and preparation.",
  lifeReportInterpretation: "Throughout life, private effort, writing, foreign links and quiet preparation support meaningful progress.",
  confidence: 10,
},

"12_lord_in_4": {
  lordshipHouse: 12,
  placementHouse: 4,
  key: "12_lord_in_4",
  principle: "The 12th lord carries release, rest and inner withdrawal into home, mother and emotional security.",
  synthesis: "Home becomes a place of rest and emotional release. Domestic expenses or private family matters may require attention.",
  psychology: "The person seeks peace through emotional retreat and a calm home environment.",
  areas: ["home", "mind", "family", "money"],
  practicalEffects: [
    "Home-related expenses may arise.",
    "You may prefer staying private.",
    "Family matters may need quiet handling.",
    "Rest at home becomes important."
  ],
  opportunities: [
    "Declutter your space.",
    "Rest at home.",
    "Handle family concerns gently.",
    "Create emotional calm."
  ],
  cautions: [
    "Avoid withdrawing from loved ones.",
    "Avoid unnecessary comfort spending.",
    "Do not suppress family concerns."
  ],
  bestUse: "Create peace at home and avoid reacting emotionally.",
  dailyExpression: "Home and emotional matters may need quiet attention rather than immediate reaction.",
  askSarathiExplanation: "The Moon links the 12th house of release with the 4th house of home and emotional peace.",
  lifeReportInterpretation: "Throughout life, emotional security develops through solitude, inner work and creating a peaceful private space.",
  confidence: 10,
},

"12_lord_in_5": {
  lordshipHouse: 12,
  placementHouse: 5,
  key: "12_lord_in_5",
  principle: "The 12th lord directs inner reflection into creativity, children, learning and emotional expression.",
  synthesis: "Creativity becomes more private and introspective. Learning, children or romantic matters may require emotional sensitivity.",
  psychology: "The person processes emotions through imagination, creativity and private reflection.",
  areas: ["children", "education", "mind", "spirituality"],
  practicalEffects: [
    "Creative work may happen quietly.",
    "Children may need emotional attention.",
    "Romantic expectations need balance.",
    "Study or spiritual learning is supported."
  ],
  opportunities: [
    "Create privately.",
    "Study spiritual or creative subjects.",
    "Spend gentle time with children.",
    "Reflect before expressing emotions."
  ],
  cautions: [
    "Avoid emotional speculation.",
    "Do not escape into fantasy.",
    "Avoid overthinking romance."
  ],
  bestUse: "Channel emotions into creativity and learning.",
  dailyExpression: "Private creativity and thoughtful expression are favoured today.",
  askSarathiExplanation: "The Moon connects the 12th house of reflection with the 5th house of creativity, children and intelligence.",
  lifeReportInterpretation: "Throughout life, creativity and wisdom deepen through solitude, imagination and inner emotional processing.",
  confidence: 10,
},

"12_lord_in_6": {
  lordshipHouse: 12,
  placementHouse: 6,
  key: "12_lord_in_6",
  principle: "The 12th lord brings expenses, rest and release into work, health, service and conflict resolution.",
  synthesis: "Workload, health routines or pending duties may require practical attention. Discipline helps prevent energy drain.",
  psychology: "The person learns to manage stress by creating healthy routines and boundaries.",
  areas: ["health", "career", "money", "mind"],
  practicalEffects: [
    "Work may feel tiring.",
    "Health routines need attention.",
    "Expenses related to service or health may arise.",
    "Pending tasks need completion."
  ],
  opportunities: [
    "Finish pending work.",
    "Improve health habits.",
    "Set better boundaries.",
    "Reduce wasteful effort."
  ],
  cautions: [
    "Avoid overworking.",
    "Do not ignore health signals.",
    "Avoid unnecessary conflicts."
  ],
  bestUse: "Protect your energy while completing practical responsibilities.",
  dailyExpression: "Discipline is needed today to avoid stress, waste and unnecessary conflict.",
  askSarathiExplanation: "The Moon links the 12th house of loss and rest with the 6th house of work, health and discipline.",
  lifeReportInterpretation: "Throughout life, balance between service, health and rest becomes essential for stability.",
  confidence: 10,
},

"12_lord_in_7": {
  lordshipHouse: 12,
  placementHouse: 7,
  key: "12_lord_in_7",
  principle: "The 12th lord connects release, distance and private emotions with partnerships and public interactions.",
  synthesis: "Relationships require sensitivity, patience and space. Private emotions may influence one-to-one conversations.",
  psychology: "The person may need emotional room within relationships and learns not to disappear during conflict.",
  areas: ["relationships", "mind", "communication", "travel"],
  practicalEffects: [
    "Partner may need patience.",
    "Private relationship concerns may surface.",
    "Foreign clients or distant contacts may arise.",
    "One-to-one discussions need softness."
  ],
  opportunities: [
    "Listen deeply.",
    "Give space where needed.",
    "Resolve private concerns calmly.",
    "Work with foreign or distant connections."
  ],
  cautions: [
    "Avoid emotional withdrawal.",
    "Do not assume distance means rejection.",
    "Avoid unclear communication."
  ],
  bestUse: "Bring patience and compassion into relationships.",
  dailyExpression: "Relationships need gentle communication and emotional space today.",
  askSarathiExplanation: "The Moon links the 12th house of distance and release with the 7th house of partnerships.",
  lifeReportInterpretation: "Throughout life, relationships teach emotional surrender, compassion and the balance between closeness and space.",
  confidence: 10,
},

"12_lord_in_8": {
  lordshipHouse: 12,
  placementHouse: 8,
  key: "12_lord_in_8",
  principle: "The 12th lord carries loss, release and hidden matters into transformation, uncertainty and deep emotional processing.",
  synthesis: "This is a highly introspective placement. Sudden emotional insights, expenses or hidden matters may require calm handling.",
  psychology: "The person grows through deep inner release and learning not to fear uncertainty.",
  areas: ["hiddenMatters", "mind", "money", "spirituality"],
  practicalEffects: [
    "Hidden emotions may surface.",
    "Unexpected expenses may arise.",
    "Research or investigation is favoured.",
    "Old fears may need release."
  ],
  opportunities: [
    "Do inner work.",
    "Research carefully.",
    "Release old burdens.",
    "Understand hidden patterns."
  ],
  cautions: [
    "Avoid risky decisions.",
    "Do not act from fear.",
    "Avoid secrecy in sensitive matters."
  ],
  bestUse: "Use quiet observation to understand what needs to be released.",
  dailyExpression: "Private matters and deeper emotions need patience today.",
  askSarathiExplanation: "The Moon links the 12th house of release with the 8th house of transformation and hidden matters.",
  lifeReportInterpretation: "Throughout life, deep emotional transformation and spiritual release become major themes.",
  confidence: 10,
},

"12_lord_in_9": {
  lordshipHouse: 12,
  placementHouse: 9,
  key: "12_lord_in_9",
  principle: "The 12th lord connects release, foreign lands and spirituality with dharma, guidance and higher wisdom.",
  synthesis: "Spiritual learning, long-distance matters and guidance can help release confusion and restore perspective.",
  psychology: "The person seeks meaning through faith, retreat, travel or philosophical reflection.",
  areas: ["spirituality", "travel", "education", "mind"],
  practicalEffects: [
    "Spiritual guidance may help.",
    "Long-distance travel planning may arise.",
    "Foreign connections become relevant.",
    "Learning brings emotional relief."
  ],
  opportunities: [
    "Seek guidance.",
    "Study spiritual subjects.",
    "Plan meaningful travel.",
    "Reflect on beliefs."
  ],
  cautions: [
    "Avoid blind faith.",
    "Do not ignore practical responsibilities.",
    "Avoid escaping through ideology."
  ],
  bestUse: "Use wisdom and faith to release unnecessary emotional weight.",
  dailyExpression: "A broader perspective can help you let go of unnecessary worry today.",
  askSarathiExplanation: "The Moon connects the 12th house of release with the 9th house of wisdom, teachers and faith.",
  lifeReportInterpretation: "Throughout life, spiritual growth, travel and higher learning help transform private struggles into wisdom.",
  confidence: 10,
},

"12_lord_in_10": {
  lordshipHouse: 12,
  placementHouse: 10,
  key: "12_lord_in_10",
  principle: "The 12th lord directs expenses, foreign links and private work into career, responsibility and public action.",
  synthesis: "Career may involve hidden effort, foreign connections, institutions or behind-the-scenes responsibilities.",
  psychology: "The person may work hard privately before receiving visible recognition.",
  areas: ["career", "travel", "money", "publicImage"],
  practicalEffects: [
    "Behind-the-scenes work increases.",
    "Foreign or institutional work may arise.",
    "Career expenses may need planning.",
    "Responsibilities may feel draining."
  ],
  opportunities: [
    "Work quietly and consistently.",
    "Handle foreign or remote work.",
    "Complete pending professional tasks.",
    "Build discipline behind the scenes."
  ],
  cautions: [
    "Avoid burnout.",
    "Do not let invisible work go untracked.",
    "Avoid careless professional expenses."
  ],
  bestUse: "Do the necessary work quietly without expecting immediate recognition.",
  dailyExpression: "Professional responsibilities may require behind-the-scenes effort today.",
  askSarathiExplanation: "The Moon links the 12th house of hidden effort and foreign matters with the 10th house of career.",
  lifeReportInterpretation: "Throughout life, success may come through service, institutions, foreign links or private disciplined work.",
  confidence: 10,
},

"12_lord_in_11": {
  lordshipHouse: 12,
  placementHouse: 11,
  key: "12_lord_in_11",
  principle: "The 12th lord connects expenses, release and foreign matters with gains, networks and long-term goals.",
  synthesis: "Networks may involve distant people, foreign connections or spiritual communities. Gains require wise management of expenses.",
  psychology: "The person learns that not every gain is material; some support comes through meaningful or distant connections.",
  areas: ["money", "relationships", "travel", "spirituality"],
  practicalEffects: [
    "Foreign contacts may help.",
    "Social spending may increase.",
    "Long-term goals need financial review.",
    "Friends may need support."
  ],
  opportunities: [
    "Connect with distant networks.",
    "Review long-term goals.",
    "Build meaningful alliances.",
    "Use networks wisely."
  ],
  cautions: [
    "Avoid overspending socially.",
    "Do not depend on uncertain gains.",
    "Avoid unrealistic expectations from friends."
  ],
  bestUse: "Use networks thoughtfully while managing resources carefully.",
  dailyExpression: "Distant connections or networks may help, but expenses need control today.",
  askSarathiExplanation: "The Moon links the 12th house of expenses and foreign matters with the 11th house of gains and networks.",
  lifeReportInterpretation: "Throughout life, foreign links, spiritual communities and distant networks may become important sources of support.",
  confidence: 10,
},

"12_lord_in_12": {
  lordshipHouse: 12,
  placementHouse: 12,
  key: "12_lord_in_12",
  principle: "The lord occupies its own house, strengthening rest, release, foreign matters, solitude and spiritual growth.",
  synthesis: "This placement supports retreat, reflection, closure and inner healing. It is best used for rest rather than external pressure.",
  psychology: "The person periodically needs solitude to restore emotional balance and understand deeper motivations.",
  areas: ["spirituality", "mind", "travel", "money"],
  practicalEffects: [
    "Rest becomes essential.",
    "Foreign or spiritual matters gain importance.",
    "Expenses need awareness.",
    "Private reflection brings clarity."
  ],
  opportunities: [
    "Rest deeply.",
    "Meditate or pray.",
    "Complete unfinished matters.",
    "Plan foreign or retreat-related work."
  ],
  cautions: [
    "Avoid escapism.",
    "Do not overspend.",
    "Avoid isolating without purpose."
  ],
  bestUse: "Use solitude for healing, closure and spiritual clarity.",
  dailyExpression: "Today supports rest, closure and quiet inner reflection.",
  askSarathiExplanation: "The Moon activates its own 12th house, making rest, release, solitude and spiritual awareness especially important.",
  lifeReportInterpretation: "Throughout life, solitude, foreign experiences and spiritual growth become powerful forces of inner development.",
  confidence: 10,
},
"11_lord_in_1": {
  lordshipHouse: 11,
  placementHouse: 1,
  key: "11_lord_in_1",
  principle: "The 11th lord brings gains, networks, friendships and long-term goals into the self and identity.",
  synthesis: "The person becomes strongly goal-oriented and gains confidence through social support, recognition and progress toward ambitions.",
  psychology: "Confidence grows when efforts are acknowledged and future goals feel achievable.",
  areas: ["money", "career", "relationships", "mind"],
  practicalEffects: [
    "Support from friends or networks becomes important.",
    "Long-term goals influence personal decisions.",
    "Confidence improves through recognition.",
    "Income-related matters may gain attention."
  ],
  opportunities: [
    "Connect with useful people.",
    "Review long-term goals.",
    "Accept support.",
    "Act with confidence."
  ],
  cautions: [
    "Avoid depending too much on validation.",
    "Do not chase every opportunity.",
    "Avoid overexpecting from friends."
  ],
  bestUse: "Use supportive networks to strengthen personal direction.",
  dailyExpression: "Support from people or progress toward a goal can boost your confidence today.",
  askSarathiExplanation: "The Moon rules the 11th house and activates the self, linking gains, networks and long-term goals with personal confidence.",
  lifeReportInterpretation: "Throughout life, friendships, networks and ambitions play a major role in shaping identity and success.",
  confidence: 10,
},

"11_lord_in_2": {
  lordshipHouse: 11,
  placementHouse: 2,
  key: "11_lord_in_2",
  principle: "The 11th lord connects gains and networks with wealth, speech, family and accumulated resources.",
  synthesis: "Financial gains may come through networks, friendships, business circles or long-term planning. Speech and family values influence prosperity.",
  psychology: "The person feels secure when social support and financial stability are aligned.",
  areas: ["money", "family", "communication", "relationships"],
  practicalEffects: [
    "Income or savings receive attention.",
    "Family discussions may involve future goals.",
    "Networking can support financial growth.",
    "Speech influences opportunities."
  ],
  opportunities: [
    "Discuss financial plans.",
    "Use contacts wisely.",
    "Communicate your goals clearly.",
    "Strengthen family support."
  ],
  cautions: [
    "Avoid unrealistic income expectations.",
    "Do not mix money and emotions carelessly.",
    "Avoid harsh speech in financial matters."
  ],
  bestUse: "Use practical communication to turn opportunities into stable gains.",
  dailyExpression: "A conversation or contact may support financial progress today.",
  askSarathiExplanation: "The Moon links the 11th house of gains with the 2nd house of money, speech and family.",
  lifeReportInterpretation: "Throughout life, networks and communication become important contributors to financial stability.",
  confidence: 10,
},

"11_lord_in_3": {
  lordshipHouse: 11,
  placementHouse: 3,
  key: "11_lord_in_3",
  principle: "The 11th lord directs gains and ambitions into communication, courage and self-effort.",
  synthesis: "Opportunities grow through consistent effort, communication, marketing, writing and practical initiative.",
  psychology: "The person feels motivated when effort produces visible progress toward long-term goals.",
  areas: ["communication", "career", "money", "travel"],
  practicalEffects: [
    "Follow-ups become productive.",
    "Networking through communication improves.",
    "Short travel may support goals.",
    "Effort creates income opportunities."
  ],
  opportunities: [
    "Send important messages.",
    "Promote your work.",
    "Take initiative.",
    "Reconnect with useful contacts."
  ],
  cautions: [
    "Avoid scattered effort.",
    "Do not rush communication.",
    "Avoid expecting gains without effort."
  ],
  bestUse: "Use communication and initiative to move long-term goals forward.",
  dailyExpression: "Consistent communication can open useful opportunities today.",
  askSarathiExplanation: "The Moon links gains with effort, making self-initiative and communication especially productive.",
  lifeReportInterpretation: "Throughout life, gains often come through self-effort, communication skills and consistent initiative.",
  confidence: 10,
},

"11_lord_in_4": {
  lordshipHouse: 11,
  placementHouse: 4,
  key: "11_lord_in_4",
  principle: "The 11th lord connects gains, networks and ambitions with home, family and emotional security.",
  synthesis: "Family support, property matters or emotional stability may contribute to progress toward long-term goals.",
  psychology: "The person feels emotionally secure when future goals are supported by family or a stable home environment.",
  areas: ["home", "money", "family", "property"],
  practicalEffects: [
    "Family may support a goal.",
    "Property or home matters may connect with gains.",
    "Income may be used for domestic comfort.",
    "Emotional stability improves planning."
  ],
  opportunities: [
    "Discuss goals with family.",
    "Improve your home environment.",
    "Plan property or savings matters.",
    "Use family support wisely."
  ],
  cautions: [
    "Avoid expecting too much from family.",
    "Do not let comfort reduce ambition.",
    "Avoid emotional decisions about money."
  ],
  bestUse: "Use emotional stability and family support to plan long-term growth.",
  dailyExpression: "Family or home-related support may help you move closer to a goal today.",
  askSarathiExplanation: "The Moon links gains with the 4th house of home, property and emotional security.",
  lifeReportInterpretation: "Throughout life, family support, property and emotional stability can contribute to fulfilment of ambitions.",
  confidence: 10,
},

"11_lord_in_5": {
  lordshipHouse: 11,
  placementHouse: 5,
  key: "11_lord_in_5",
  principle: "The 11th lord directs gains and ambitions toward creativity, intelligence, children and learning.",
  synthesis: "Creative ideas, education, children or intelligent planning may contribute to gains and future success.",
  psychology: "The person feels fulfilled when ideas are appreciated and long-term hopes feel creatively meaningful.",
  areas: ["children", "education", "money", "career"],
  practicalEffects: [
    "Creative work may bring recognition.",
    "Children or students may need attention.",
    "Learning supports future goals.",
    "Ideas may become income opportunities."
  ],
  opportunities: [
    "Share creative ideas.",
    "Study or teach.",
    "Plan intelligently.",
    "Invest in skill-building."
  ],
  cautions: [
    "Avoid speculation without planning.",
    "Do not overexpect from creative outcomes.",
    "Avoid ego-driven decisions."
  ],
  bestUse: "Use creativity and learning to support long-term progress.",
  dailyExpression: "Creative thinking may help you move closer to an important goal today.",
  askSarathiExplanation: "The Moon links gains with creativity and intelligence, making thoughtful ideas valuable.",
  lifeReportInterpretation: "Throughout life, creativity, education and intelligent planning become important sources of fulfilment and gains.",
  confidence: 10,
},

"11_lord_in_6": {
  lordshipHouse: 11,
  placementHouse: 6,
  key: "11_lord_in_6",
  principle: "The 11th lord brings gains and ambitions into work, service, competition and problem-solving.",
  synthesis: "Progress comes through discipline, routine and solving practical problems. Gains require effort and responsibility.",
  psychology: "The person feels fulfilled when hard work produces measurable results.",
  areas: ["career", "health", "money", "mind"],
  practicalEffects: [
    "Workload may increase.",
    "Competition can lead to gains.",
    "Health routines need attention.",
    "Pending work affects future goals."
  ],
  opportunities: [
    "Finish important tasks.",
    "Improve discipline.",
    "Solve workplace issues.",
    "Use competition constructively."
  ],
  cautions: [
    "Avoid stress from overwork.",
    "Do not argue over small matters.",
    "Avoid neglecting health for ambition."
  ],
  bestUse: "Let discipline and service move your goals forward.",
  dailyExpression: "Steady effort and problem-solving can bring useful progress today.",
  askSarathiExplanation: "The Moon links gains with the 6th house of work, discipline and competition.",
  lifeReportInterpretation: "Throughout life, gains often come through consistent work, service and the ability to overcome obstacles.",
  confidence: 10,
},

"11_lord_in_7": {
  lordshipHouse: 11,
  placementHouse: 7,
  key: "11_lord_in_7",
  principle: "The 11th lord connects gains and ambitions with partnerships, clients and public dealings.",
  synthesis: "Relationships, collaborations and clients may directly support gains and long-term goals.",
  psychology: "The person values partnerships that support future growth and mutual benefit.",
  areas: ["relationships", "career", "money", "communication"],
  practicalEffects: [
    "Client interactions may improve.",
    "Partnerships support goals.",
    "Public dealings become important.",
    "Collaboration may bring gains."
  ],
  opportunities: [
    "Strengthen partnerships.",
    "Network through one-to-one interactions.",
    "Negotiate fairly.",
    "Build mutually beneficial alliances."
  ],
  cautions: [
    "Avoid overexpecting from partners.",
    "Do not become transactional in relationships.",
    "Avoid people-pleasing for gains."
  ],
  bestUse: "Build relationships that support shared growth.",
  dailyExpression: "Partnerships or client conversations may help move a goal forward today.",
  askSarathiExplanation: "The Moon links gains with partnerships, making cooperation especially important.",
  lifeReportInterpretation: "Throughout life, alliances, clients and public relationships become important channels for gains.",
  confidence: 10,
},

"11_lord_in_8": {
  lordshipHouse: 11,
  placementHouse: 8,
  key: "11_lord_in_8",
  principle: "The 11th lord carries gains and ambitions into transformation, uncertainty and hidden matters.",
  synthesis: "Long-term goals may require adjustment. Gains can come through research, shared resources or deeper strategy, but impulsive expectations should be avoided.",
  psychology: "The person learns to adapt ambitions when circumstances change.",
  areas: ["hiddenMatters", "money", "mind", "career"],
  practicalEffects: [
    "Sudden changes affect plans.",
    "Shared resources may need review.",
    "Research supports gains.",
    "Hidden information may influence decisions."
  ],
  opportunities: [
    "Review long-term goals.",
    "Research before acting.",
    "Adapt strategy.",
    "Understand deeper patterns."
  ],
  cautions: [
    "Avoid risky investments.",
    "Do not panic over delays.",
    "Avoid secrecy in financial matters."
  ],
  bestUse: "Adjust expectations and use careful research before pursuing gains.",
  dailyExpression: "A deeper look at your goals may reveal what needs to change today.",
  askSarathiExplanation: "The Moon links gains with the 8th house of transformation and hidden factors.",
  lifeReportInterpretation: "Throughout life, gains may come through adaptation, research and learning to handle uncertainty wisely.",
  confidence: 10,
},

"11_lord_in_9": {
  lordshipHouse: 11,
  placementHouse: 9,
  key: "11_lord_in_9",
  principle: "The 11th lord connects gains and long-term goals with wisdom, guidance, dharma and higher learning.",
  synthesis: "Mentors, teachers, learning, travel or ethical choices may support fulfilment of ambitions.",
  psychology: "The person feels fulfilled when goals are aligned with meaning and higher principles.",
  areas: ["education", "spirituality", "money", "travel"],
  practicalEffects: [
    "Guidance supports goals.",
    "Learning improves opportunities.",
    "Long-distance connections may help.",
    "Beliefs influence ambitions."
  ],
  opportunities: [
    "Seek guidance.",
    "Study something useful.",
    "Connect with mentors.",
    "Align goals with values."
  ],
  cautions: [
    "Avoid blind optimism.",
    "Do not ignore practical steps.",
    "Avoid expecting luck without effort."
  ],
  bestUse: "Let wisdom and guidance shape long-term goals.",
  dailyExpression: "A mentor, idea or broader perspective may support your progress today.",
  askSarathiExplanation: "The Moon links gains with wisdom and higher learning, making guidance valuable.",
  lifeReportInterpretation: "Throughout life, mentors, learning and ethical direction help fulfil ambitions.",
  confidence: 10,
},

"11_lord_in_10": {
  lordshipHouse: 11,
  placementHouse: 10,
  key: "11_lord_in_10",
  principle: "The 11th lord directs gains, networks and ambitions into career, responsibility and public recognition.",
  synthesis: "Career becomes a major channel for gains. Professional visibility, responsibility and networks can support long-term ambitions.",
  psychology: "The person feels fulfilled when work produces recognition and measurable growth.",
  areas: ["career", "money", "publicImage", "relationships"],
  practicalEffects: [
    "Career gains may arise.",
    "Professional visibility improves.",
    "Networks support work.",
    "Leadership responsibilities increase."
  ],
  opportunities: [
    "Take professional initiative.",
    "Build visibility.",
    "Use networks at work.",
    "Focus on measurable goals."
  ],
  cautions: [
    "Avoid overidentifying with status.",
    "Do not chase recognition without substance.",
    "Avoid neglecting personal balance."
  ],
  bestUse: "Use professional responsibility to create long-term gains.",
  dailyExpression: "Career visibility may support progress toward a long-term goal today.",
  askSarathiExplanation: "The Moon links gains with career, making professional action and visibility important.",
  lifeReportInterpretation: "Throughout life, career and networks become major drivers of gains and fulfilment.",
  confidence: 10,
},

"11_lord_in_11": {
  lordshipHouse: 11,
  placementHouse: 11,
  key: "11_lord_in_11",
  principle: "The lord occupies its own house, strengthening gains, networks, friendships and fulfilment of ambitions.",
  synthesis: "This is a strong placement for long-term goals, income, social support and recognition from groups.",
  psychology: "The person feels encouraged when surrounded by supportive communities and meaningful goals.",
  areas: ["money", "relationships", "career", "mind"],
  practicalEffects: [
    "Networks become active.",
    "Income-related matters improve.",
    "Friends may provide support.",
    "Long-term goals gain clarity."
  ],
  opportunities: [
    "Expand your network.",
    "Work toward a major goal.",
    "Accept support.",
    "Strengthen useful friendships."
  ],
  cautions: [
    "Avoid overexpecting from others.",
    "Do not become overly socially distracted.",
    "Avoid measuring worth only by gains."
  ],
  bestUse: "Use supportive networks to make meaningful progress.",
  dailyExpression: "Support from friends or networks can help you move closer to a goal today.",
  askSarathiExplanation: "The Moon activates its own 11th house, making gains, networks and long-term goals especially important.",
  lifeReportInterpretation: "Throughout life, networks, friendships and long-term ambitions become major sources of fulfilment.",
  confidence: 10,
},

"11_lord_in_12": {
  lordshipHouse: 11,
  placementHouse: 12,
  key: "11_lord_in_12",
  principle: "The 11th lord directs gains, networks and ambitions toward expenses, foreign lands, solitude and release.",
  synthesis: "Long-term goals may involve foreign connections, spiritual communities or behind-the-scenes planning. Gains require careful management of expenses.",
  psychology: "The person learns that fulfilment is not always material and may come through meaningful service or distant connections.",
  areas: ["money", "travel", "spirituality", "relationships"],
  practicalEffects: [
    "Foreign networks may become important.",
    "Expenses connected to goals may arise.",
    "Private planning supports future gains.",
    "Distant friendships may provide support."
  ],
  opportunities: [
    "Connect with foreign or distant networks.",
    "Plan long-term goals privately.",
    "Review expenses.",
    "Support meaningful causes."
  ],
  cautions: [
    "Avoid overspending on ambitions.",
    "Do not chase uncertain gains.",
    "Avoid isolation from useful networks."
  ],
  bestUse: "Balance ambition with wise resource management and quiet planning.",
  dailyExpression: "Behind-the-scenes planning or distant connections may support future goals today.",
  askSarathiExplanation: "The Moon links gains with the 12th house of expenses, foreign links and private preparation.",
  lifeReportInterpretation: "Throughout life, distant networks, foreign links and quiet planning may contribute to fulfilment.",
  confidence: 10,
},
"1_lord_in_1": {
  lordshipHouse: 1,
  placementHouse: 1,
  key: "1_lord_in_1",

  principle:
    "The ascendant lord occupies its own house, strengthening vitality, confidence, identity and emotional awareness.",

  synthesis:
    "Mind, body and personal direction work together naturally. The person feels aligned with their instincts and responds confidently to changing circumstances.",

  psychology:
    "Self-confidence grows when emotions are acknowledged rather than suppressed. The person trusts intuition while remaining adaptable.",

  areas: ["health","mind","career","relationships"],

  practicalEffects: [
    "Confidence improves naturally.",
    "Health and energy receive attention.",
    "People respond positively to your presence.",
    "Personal decisions become clearer."
  ],

  opportunities: [
    "Start something important.",
    "Trust your intuition.",
    "Focus on personal wellbeing.",
    "Lead by example."
  ],

  cautions: [
    "Avoid acting purely on emotion.",
    "Don't become overly self-focused.",
    "Avoid neglecting rest."
  ],

  bestUse:
    "Use today's emotional clarity to make confident and balanced decisions.",

  dailyExpression:
    "Today supports confidence, emotional balance and taking ownership of important decisions.",

  askSarathiExplanation:
    "The Moon rules your ascendant and activates the 1st house, making your mindset, vitality and personal direction the strongest influence today.",

  lifeReportInterpretation:
    "Throughout life, emotional intelligence, adaptability and self-awareness become the foundation of your success and wellbeing.",

  confidence: 10,
},
"1_lord_in_2": {
  lordshipHouse: 1,
  placementHouse: 2,
  key: "1_lord_in_2",

  principle:
    "The ascendant lord directs personal identity toward wealth, family, speech and values.",

  synthesis:
    "Personal confidence is closely connected to financial stability, family relationships and clear communication.",

  psychology:
    "The person feels emotionally secure when life is stable and their values are respected.",

  areas:["money","family","communication","mind"],

  practicalEffects:[
    "Money receives attention.",
    "Family conversations become important.",
    "Speech carries greater influence.",
    "Personal values guide decisions."
  ],

  opportunities:[
    "Review finances.",
    "Strengthen family ties.",
    "Communicate calmly.",
    "Make practical decisions."
  ],

  cautions:[
    "Avoid emotional spending.",
    "Don't speak impulsively.",
    "Avoid letting finances determine self-worth."
  ],

  bestUse:
    "Let your values shape your financial and personal decisions.",

  dailyExpression:
    "Today's financial and family choices can strengthen your sense of stability.",

  askSarathiExplanation:
    "The Moon links your identity with the 2nd house, making money, family and communication central themes today.",

  lifeReportInterpretation:
    "Throughout life, confidence grows through financial responsibility, meaningful relationships and living according to your values.",

  confidence:10,
},
"1_lord_in_3": {
  lordshipHouse:1,
  placementHouse:3,
  key:"1_lord_in_3",

  principle:
    "The ascendant lord channels identity into communication, courage and personal effort.",

  synthesis:
    "Progress comes through initiative, learning and practical communication rather than waiting for circumstances to change.",

  psychology:
    "The person gains confidence by taking action and expressing ideas openly.",

  areas:["communication","career","travel","mind"],

  practicalEffects:[
    "Important conversations arise.",
    "Short journeys become productive.",
    "Confidence grows through action.",
    "Learning feels rewarding."
  ],

  opportunities:[
    "Take initiative.",
    "Share your ideas.",
    "Complete follow-ups.",
    "Learn something useful."
  ],

  cautions:[
    "Avoid impatience.",
    "Don't react before thinking.",
    "Avoid unnecessary arguments."
  ],

  bestUse:
    "Use communication and initiative to move important matters forward.",

  dailyExpression:
    "Action and communication bring greater confidence today.",

  askSarathiExplanation:
    "The Moon links your identity with the 3rd house of courage and communication, encouraging practical action.",

  lifeReportInterpretation:
    "Throughout life, success develops through adaptability, learning and the willingness to take initiative.",

  confidence:10,
},
"1_lord_in_4": {
  lordshipHouse:1,
  placementHouse:4,
  key:"1_lord_in_4",

  principle:
    "The ascendant lord connects identity with home, emotional security and inner peace.",

  synthesis:
    "Personal wellbeing depends strongly on emotional balance, family harmony and a stable home environment.",

  psychology:
    "The person performs best when emotionally settled and surrounded by supportive relationships.",

  areas:["home","family","mind","health"],

  practicalEffects:[
    "Home matters become important.",
    "Family interactions influence mood.",
    "Rest improves productivity.",
    "Property matters may require attention."
  ],

  opportunities:[
    "Spend time with family.",
    "Improve your living space.",
    "Rest properly.",
    "Resolve domestic concerns."
  ],

  cautions:[
    "Avoid emotional withdrawal.",
    "Don't carry family stress everywhere.",
    "Avoid ignoring your own emotional needs."
  ],

  bestUse:
    "Strengthen your emotional foundation before tackling external responsibilities.",

  dailyExpression:
    "A peaceful home and emotional balance create the best conditions for success today.",

  askSarathiExplanation:
    "The Moon links your identity with the 4th house, making emotional wellbeing and family life especially influential today.",

  lifeReportInterpretation:
    "Throughout life, emotional security, home and family become the foundation from which lasting success grows.",

  confidence:10,
},
"1_lord_in_5": {
  lordshipHouse: 1,
  placementHouse: 5,
  key: "1_lord_in_5",

  principle:
    "The ascendant lord directs identity toward creativity, intelligence, children and self-expression.",

  synthesis:
    "Personal confidence grows through learning, creativity and sharing ideas. The person naturally expresses emotions through knowledge, teaching or creative pursuits.",

  psychology:
    "Feeling appreciated for creativity and intelligence strengthens self-belief.",

  areas: ["children", "education", "mind", "career"],

  practicalEffects: [
    "Creative ideas gain momentum.",
    "Children may require attention.",
    "Learning feels rewarding.",
    "Recognition for your ideas is possible."
  ],

  opportunities: [
    "Create something meaningful.",
    "Study a new subject.",
    "Guide or mentor someone.",
    "Express yourself confidently."
  ],

  cautions: [
    "Avoid ego-driven decisions.",
    "Do not speculate impulsively.",
    "Avoid seeking constant approval."
  ],

  bestUse:
    "Use creativity and knowledge to express your authentic self.",

  dailyExpression:
    "Creative thinking and learning can strengthen your confidence today.",

  askSarathiExplanation:
    "The Moon links your identity with the 5th house, making creativity, learning and self-expression especially important.",

  lifeReportInterpretation:
    "Throughout life, your confidence grows through creativity, education and inspiring others.",

  confidence: 10,
},
"1_lord_in_6": {
  lordshipHouse: 1,
  placementHouse: 6,
  key: "1_lord_in_6",

  principle:
    "The ascendant lord directs identity toward service, discipline, health and overcoming challenges.",

  synthesis:
    "Personal growth comes through responsibility, routine and solving practical problems rather than avoiding them.",

  psychology:
    "The person feels strongest when maintaining discipline despite obstacles.",

  areas: ["health", "career", "mind", "money"],

  practicalEffects: [
    "Workload may increase.",
    "Health deserves attention.",
    "Problem-solving becomes important.",
    "Routine determines productivity."
  ],

  opportunities: [
    "Improve daily habits.",
    "Finish pending work.",
    "Strengthen health routines.",
    "Solve practical issues."
  ],

  cautions: [
    "Avoid overworking.",
    "Do not neglect physical wellbeing.",
    "Avoid unnecessary arguments."
  ],

  bestUse:
    "Let discipline become the source of confidence rather than pressure.",

  dailyExpression:
    "Steady effort and healthy routines help you regain control today.",

  askSarathiExplanation:
    "The Moon connects your identity with the 6th house, making discipline, service and health the focus.",

  lifeReportInterpretation:
    "Throughout life, resilience develops through discipline, service and overcoming adversity.",

  confidence: 10,
},
"1_lord_in_7": {
  lordshipHouse: 1,
  placementHouse: 7,
  key: "1_lord_in_7",

  principle:
    "The ascendant lord directs identity toward partnerships, relationships and public interactions.",

  synthesis:
    "Personal growth comes through meaningful relationships, collaboration and learning from others.",

  psychology:
    "The person understands themselves more clearly through partnership and honest dialogue.",

  areas: ["relationships", "communication", "career", "mind"],

  practicalEffects: [
    "Important conversations occur.",
    "Partnerships become central.",
    "Client interactions increase.",
    "Relationship dynamics shape decisions."
  ],

  opportunities: [
    "Strengthen partnerships.",
    "Listen carefully.",
    "Negotiate fairly.",
    "Collaborate on shared goals."
  ],

  cautions: [
    "Avoid emotional reactions.",
    "Do not dominate conversations.",
    "Avoid unrealistic expectations."
  ],

  bestUse:
    "Grow through cooperation rather than confrontation.",

  dailyExpression:
    "Relationships and meaningful conversations shape today's progress.",

  askSarathiExplanation:
    "The Moon connects your identity with the 7th house, making relationships and cooperation especially influential.",

  lifeReportInterpretation:
    "Throughout life, partnerships become powerful catalysts for personal growth.",

  confidence: 10,
},
"1_lord_in_8": {
  lordshipHouse: 1,
  placementHouse: 8,
  key: "1_lord_in_8",

  principle:
    "The ascendant lord directs identity toward transformation, hidden matters and deep emotional growth.",

  synthesis:
    "Personal evolution comes through adapting to change, understanding deeper motivations and letting go of outdated patterns.",

  psychology:
    "The person develops confidence by facing uncertainty rather than resisting it.",

  areas: ["hiddenMatters", "mind", "spirituality", "health"],

  practicalEffects: [
    "Unexpected changes require flexibility.",
    "Research becomes productive.",
    "Private emotions become clearer.",
    "Old issues may resurface for resolution."
  ],

  opportunities: [
    "Reflect deeply.",
    "Research carefully.",
    "Release emotional baggage.",
    "Accept necessary change."
  ],

  cautions: [
    "Avoid fear-based decisions.",
    "Do not resist change.",
    "Avoid unnecessary secrecy."
  ],

  bestUse:
    "Allow transformation to strengthen your confidence.",

  dailyExpression:
    "Today's challenges can become opportunities for personal growth.",

  askSarathiExplanation:
    "The Moon links your identity with the 8th house, encouraging emotional transformation and deeper understanding.",

  lifeReportInterpretation:
    "Throughout life, profound personal growth comes through embracing change and emotional resilience.",

  confidence: 10,
},
"1_lord_in_9": {
  lordshipHouse: 1,
  placementHouse: 9,
  key: "1_lord_in_9",

  principle:
    "The ascendant lord directs identity toward wisdom, higher learning, faith and purpose.",

  synthesis:
    "Personal confidence grows through learning, travel, mentors and aligning life with meaningful principles.",

  psychology:
    "The person feels emotionally secure when actions reflect deeper values and purpose.",

  areas: ["education", "spirituality", "travel", "mind"],

  practicalEffects: [
    "Learning opportunities arise.",
    "Guidance proves valuable.",
    "Travel planning progresses.",
    "Beliefs influence decisions."
  ],

  opportunities: [
    "Seek guidance.",
    "Study something meaningful.",
    "Expand your perspective.",
    "Travel if appropriate."
  ],

  cautions: [
    "Avoid becoming self-righteous.",
    "Do not ignore practical realities.",
    "Avoid blind optimism."
  ],

  bestUse:
    "Allow wisdom to guide your personal direction.",

  dailyExpression:
    "A broader perspective helps you make better decisions today.",

  askSarathiExplanation:
    "The Moon links your identity with the 9th house, making learning, wisdom and purpose especially important.",

  lifeReportInterpretation:
    "Throughout life, personal growth comes through education, travel and spiritual development.",

  confidence: 10,
},
"1_lord_in_10": {
  lordshipHouse: 1,
  placementHouse: 10,
  key: "1_lord_in_10",

  principle:
    "The ascendant lord directs identity toward career, responsibility and public achievement.",

  synthesis:
    "Professional life becomes a major expression of personal identity. Recognition grows through responsibility and consistent effort.",

  psychology:
    "The person feels fulfilled when work reflects personal values and competence.",

  areas: ["career", "publicImage", "money", "mind"],

  practicalEffects: [
    "Career takes priority.",
    "Leadership opportunities arise.",
    "Professional visibility improves.",
    "Important responsibilities increase."
  ],

  opportunities: [
    "Lead confidently.",
    "Take responsibility.",
    "Strengthen your reputation.",
    "Focus on long-term goals."
  ],

  cautions: [
    "Avoid overworking.",
    "Do not seek recognition at any cost.",
    "Avoid neglecting personal wellbeing."
  ],

  bestUse:
    "Let responsible leadership strengthen your confidence.",

  dailyExpression:
    "Professional actions today can strengthen your long-term reputation.",

  askSarathiExplanation:
    "The Moon links your identity with the 10th house, making career and responsibility central themes.",

  lifeReportInterpretation:
    "Throughout life, career becomes one of the strongest expressions of your personal identity.",

  confidence: 10,
},
"1_lord_in_11": {
  lordshipHouse: 1,
  placementHouse: 11,
  key: "1_lord_in_11",

  principle:
    "The ascendant lord directs identity toward gains, friendships and long-term ambitions.",

  synthesis:
    "Confidence grows through supportive networks, meaningful friendships and measurable progress toward future goals.",

  psychology:
    "The person feels happiest when contributing to a community while pursuing meaningful ambitions.",

  areas: ["money", "relationships", "career", "mind"],

  practicalEffects: [
    "Friends become supportive.",
    "Networking creates opportunities.",
    "Long-term goals gain momentum.",
    "Recognition increases."
  ],

  opportunities: [
    "Expand your network.",
    "Work toward an important goal.",
    "Collaborate with trusted people.",
    "Accept support."
  ],

  cautions: [
    "Avoid comparing yourself with others.",
    "Do not chase popularity.",
    "Avoid unrealistic expectations."
  ],

 bestUse:
    "Use meaningful relationships to support long-term success.",

  dailyExpression:
    "Supportive people may help you move closer to an important goal today.",

  askSarathiExplanation:
    "The Moon links your identity with the 11th house, making networks and long-term aspirations especially important.",

  lifeReportInterpretation:
    "Throughout life, friendships and ambitions become major contributors to fulfilment and success.",

  confidence: 10,
},
"1_lord_in_12": {
  lordshipHouse: 1,
  placementHouse: 12,
  key: "1_lord_in_12",

  principle:
    "The ascendant lord directs identity toward solitude, spiritual growth, foreign lands and inner healing.",

  synthesis:
    "Personal development comes through reflection, emotional release and learning when to withdraw from unnecessary noise.",

  psychology:
    "The person periodically needs solitude to reconnect with inner clarity and emotional balance.",

  areas: ["spirituality", "mind", "travel", "health"],

  practicalEffects: [
    "Rest becomes important.",
    "Foreign or distant matters gain attention.",
    "Private reflection improves clarity.",
    "Energy needs careful management."
  ],

  opportunities: [
    "Meditate or pray.",
    "Rest properly.",
    "Plan quietly.",
    "Reconnect with your inner priorities."
  ],

  cautions: [
    "Avoid escapism.",
    "Do not isolate unnecessarily.",
    "Avoid neglecting physical health."
  ],

  bestUse:
    "Use quiet reflection to strengthen your emotional resilience.",

  dailyExpression:
    "A slower pace and thoughtful reflection will help you make better decisions today.",

  askSarathiExplanation:
    "The Moon links your identity with the 12th house, encouraging rest, spiritual reflection and emotional renewal.",

  lifeReportInterpretation:
    "Throughout life, your greatest personal growth often comes through inner work, compassion and periods of quiet reflection.",

  confidence: 10,
},
"10_lord_in_1": {
  lordshipHouse: 10,
  placementHouse: 1,
  key: "10_lord_in_1",

  principle:
    "The 10th lord brings career, responsibility and public reputation directly into the personality.",

  synthesis:
    "Professional identity becomes closely linked with personal identity. Leadership, visibility and responsibility naturally shape decisions.",

  psychology:
    "The person feels fulfilled when contributing meaningfully and being recognised for competence rather than status alone.",

  areas: ["career","publicImage","mind","relationships"],

  practicalEffects: [
    "Career matters become personally important.",
    "Leadership opportunities may arise.",
    "People notice your actions more than usual.",
    "Professional confidence increases."
  ],

  opportunities: [
    "Take initiative.",
    "Lead by example.",
    "Strengthen your reputation.",
    "Accept responsibility confidently."
  ],

  cautions: [
    "Avoid defining yourself only through work.",
    "Do not seek recognition at any cost.",
    "Avoid neglecting personal wellbeing."
  ],

  bestUse:
    "Lead with integrity and allow your actions to speak for themselves.",

  dailyExpression:
    "Today's decisions can strengthen both your confidence and professional reputation.",

  askSarathiExplanation:
    "The Moon rules the 10th house and activates the 1st, making career and personal identity closely connected today.",

  lifeReportInterpretation:
    "Throughout life, your reputation develops through consistent leadership, responsibility and authentic action.",

  confidence: 10,
},
"10_lord_in_2": {
  lordshipHouse: 10,
  placementHouse: 2,
  key: "10_lord_in_2",

  principle:
    "The 10th lord directs career and public responsibility toward wealth, family, speech and accumulated resources.",

  synthesis:
    "Professional success directly influences financial stability. Reputation is built through integrity, communication and responsible financial management.",

  psychology:
    "The person feels accomplished when work creates lasting financial security and benefits the family.",

  areas: ["career","money","family","communication"],

  practicalEffects: [
    "Career discussions may affect income.",
    "Professional reputation influences financial opportunities.",
    "Important family decisions may involve work.",
    "Communication at work becomes influential."
  ],

  opportunities: [
    "Negotiate professionally.",
    "Review long-term finances.",
    "Strengthen your professional reputation.",
    "Communicate with maturity."
  ],

  cautions: [
    "Avoid mixing ego with financial decisions.",
    "Do not make promises you cannot keep.",
    "Avoid careless speech at work."
  ],

  bestUse:
    "Use professional credibility to create long-term financial stability.",

  dailyExpression:
    "Career decisions today may positively influence your financial future.",

  askSarathiExplanation:
    "The Moon links the 10th house of career with the 2nd house of wealth and family.",

  lifeReportInterpretation:
    "Throughout life, career becomes one of the strongest foundations of financial security and family stability.",

  confidence: 10,
},
"10_lord_in_3": {
  lordshipHouse: 10,
  placementHouse: 3,
  key: "10_lord_in_3",

  principle:
    "The 10th lord channels career growth through communication, initiative and practical effort.",

  synthesis:
    "Professional success develops through communication, networking, writing, presentations and consistent self-effort.",

  psychology:
    "The person gains confidence by taking initiative instead of waiting for opportunities.",

  areas: ["career","communication","travel","publicImage"],

  practicalEffects: [
    "Important emails or meetings arise.",
    "Short business travel becomes productive.",
    "Follow-ups create momentum.",
    "Visibility increases through communication."
  ],

  opportunities: [
    "Present your ideas.",
    "Take initiative.",
    "Expand professional contacts.",
    "Finish important follow-ups."
  ],

  cautions: [
    "Avoid hesitation.",
    "Do not communicate emotionally.",
    "Avoid scattered effort."
  ],

  bestUse:
    "Allow confident communication to move your career forward.",

  dailyExpression:
    "A conversation or message could significantly advance your professional goals today.",

  askSarathiExplanation:
    "The Moon combines career with communication, making initiative one of today's strongest assets.",

  lifeReportInterpretation:
    "Throughout life, communication skills become a major driver of professional success.",

  confidence: 10,
},
"10_lord_in_4": {
  lordshipHouse: 10,
  placementHouse: 4,
  key: "10_lord_in_4",

  principle:
    "The 10th lord connects career with home, emotional wellbeing and inner stability.",

  synthesis:
    "Professional success depends on emotional balance and a supportive home environment. Property or domestic responsibilities may influence career decisions.",

  psychology:
    "The person performs best when personal life and professional responsibilities remain balanced.",

  areas: ["career","home","family","property"],

  practicalEffects: [
    "Home responsibilities influence work.",
    "Career decisions affect family.",
    "Property discussions become important.",
    "Work-life balance requires attention."
  ],

  opportunities: [
    "Create better routines.",
    "Organise your workspace.",
    "Resolve family concerns.",
    "Strengthen emotional stability."
  ],

  cautions: [
    "Avoid taking work stress home.",
    "Do not neglect family.",
    "Avoid emotional career decisions."
  ],

  bestUse:
    "Build professional success upon emotional stability.",

  dailyExpression:
    "A balanced approach to home and work creates the best results today.",

  askSarathiExplanation:
    "The Moon links career with emotional security, making home and work closely connected today.",

  lifeReportInterpretation:
    "Throughout life, professional success is strengthened by emotional maturity and a stable home environment.",

  confidence: 10,
},
"10_lord_in_5": {
  lordshipHouse: 10,
  placementHouse: 5,
  key: "10_lord_in_5",

  principle:
    "The 10th lord directs career toward creativity, intelligence, education and leadership.",

  synthesis:
    "Professional growth comes through innovation, creative thinking, teaching, mentoring or intellectual ability.",

  psychology:
    "The person feels recognised when creative ideas receive appreciation and practical application.",

  areas: ["career","education","children","publicImage"],

  practicalEffects: [
    "Creative work receives attention.",
    "Recognition for ideas increases.",
    "Teaching or mentoring becomes important.",
    "Leadership opportunities emerge."
  ],

  opportunities: [
    "Share your expertise.",
    "Present innovative ideas.",
    "Teach or mentor others.",
    "Develop creative solutions."
  ],

  cautions: [
    "Avoid arrogance.",
    "Do not speculate recklessly.",
    "Avoid dismissing others' ideas."
  ],

  bestUse:
    "Use creativity and knowledge to strengthen your professional standing.",

  dailyExpression:
    "Creative thinking may significantly improve your professional visibility today.",

  askSarathiExplanation:
    "The Moon links career with creativity and intelligence, making innovative thinking especially valuable.",

  lifeReportInterpretation:
    "Throughout life, professional recognition comes through creativity, knowledge and the ability to inspire others.",

  confidence: 10,
},
"10_lord_in_6": {
  lordshipHouse: 10,
  placementHouse: 6,
  key: "10_lord_in_6",

  principle:
    "The 10th lord directs career into service, discipline, competition and daily work.",

  synthesis:
    "Professional growth comes through persistence, disciplined routines and solving difficult problems rather than seeking shortcuts.",

  psychology:
    "The person gains confidence by mastering responsibilities and remaining dependable under pressure.",

  areas: ["career","health","publicImage","money"],

  practicalEffects: [
    "Workload increases.",
    "Professional competition becomes visible.",
    "Routine determines productivity.",
    "Colleagues may require cooperation."
  ],

  opportunities: [
    "Complete pending work.",
    "Improve efficiency.",
    "Develop healthier routines.",
    "Solve difficult problems calmly."
  ],

  cautions: [
    "Avoid workplace conflict.",
    "Don't neglect health for career.",
    "Avoid perfectionism."
  ],

  bestUse:
    "Let discipline become your competitive advantage.",

  dailyExpression:
    "Steady work and practical problem-solving strengthen your professional standing today.",

  askSarathiExplanation:
    "The Moon links career with the 6th house, making discipline, service and consistency the keys to progress.",

  lifeReportInterpretation:
    "Throughout life, lasting professional success comes through reliability, resilience and disciplined effort.",

  confidence: 10,
},
"10_lord_in_7": {
  lordshipHouse: 10,
  placementHouse: 7,
  key: "10_lord_in_7",

  principle:
    "The 10th lord directs career toward partnerships, clients and public relationships.",

  synthesis:
    "Professional success depends upon cooperation, trust and building strong external relationships.",

  psychology:
    "The person enjoys working with people and gains confidence through successful partnerships.",

  areas: ["career","relationships","communication","publicImage"],

  practicalEffects: [
    "Client meetings become important.",
    "Partnership discussions progress.",
    "Negotiations influence career.",
    "Public visibility increases."
  ],

  opportunities: [
    "Strengthen partnerships.",
    "Negotiate confidently.",
    "Network professionally.",
    "Resolve disagreements."
  ],

  cautions: [
    "Avoid dominating discussions.",
    "Don't ignore others' perspectives.",
    "Avoid unrealistic expectations."
  ],

  bestUse:
    "Build lasting success through cooperation and trust.",

  dailyExpression:
    "Today's conversations and partnerships can significantly influence your professional progress.",

  askSarathiExplanation:
    "The Moon connects career with partnerships, making collaboration today's strongest professional asset.",

  lifeReportInterpretation:
    "Throughout life, relationships and partnerships become major contributors to career success.",

  confidence: 10,
},
"10_lord_in_8": {
  lordshipHouse: 10,
  placementHouse: 8,
  key: "10_lord_in_8",

  principle:
    "The 10th lord directs career into transformation, research and hidden processes.",

  synthesis:
    "Professional life evolves through major transitions, strategic thinking and adapting to changing circumstances.",

  psychology:
    "The person becomes stronger professionally after overcoming uncertainty and learning from setbacks.",

  areas: ["career","hiddenMatters","publicImage","mind"],

  practicalEffects: [
    "Unexpected career developments.",
    "Research becomes valuable.",
    "Private discussions influence work.",
    "Strategy becomes more important than speed."
  ],

  opportunities: [
    "Investigate thoroughly.",
    "Adapt to change.",
    "Review long-term plans.",
    "Develop specialist expertise."
  ],

  cautions: [
    "Avoid impulsive career decisions.",
    "Don't fear necessary change.",
    "Avoid office politics."
  ],

  bestUse:
    "Treat change as an opportunity to strengthen your professional foundation.",

  dailyExpression:
    "A thoughtful response to changing circumstances will strengthen your career today.",

  askSarathiExplanation:
    "The Moon links career with transformation, encouraging strategic thinking over quick reactions.",

  lifeReportInterpretation:
    "Throughout life, career growth comes through reinvention, resilience and deep expertise.",

  confidence: 10,
},
"10_lord_in_9": {
  lordshipHouse: 10,
  placementHouse: 9,
  key: "10_lord_in_9",

  principle:
    "The 10th lord directs career toward wisdom, higher learning, mentors and purpose.",

  synthesis:
    "Professional growth is supported by education, ethical leadership, mentors and expanding perspective.",

  psychology:
    "The person feels fulfilled when work aligns with personal values and contributes positively to others.",

  areas: ["career","education","travel","publicImage"],

  practicalEffects: [
    "Mentors provide guidance.",
    "Learning improves career prospects.",
    "Travel supports work.",
    "Professional decisions require ethics."
  ],

  opportunities: [
    "Seek advice.",
    "Develop new skills.",
    "Teach others.",
    "Think long term."
  ],

  cautions: [
    "Avoid arrogance.",
    "Don't ignore practical realities.",
    "Avoid becoming overly idealistic."
  ],

  bestUse:
    "Allow wisdom and integrity to shape professional decisions.",

  dailyExpression:
    "Learning something new or receiving guidance may significantly improve your career today.",

  askSarathiExplanation:
    "The Moon links career with wisdom, making education and mentorship powerful influences today.",

  lifeReportInterpretation:
    "Throughout life, professional success grows through continuous learning, ethical leadership and meaningful guidance.",

  confidence: 10,
},
"10_lord_in_10": {
  lordshipHouse: 10,
  placementHouse: 10,
  key: "10_lord_in_10",

  principle:
    "The lord occupies its own house, strongly reinforcing career, authority, reputation and professional responsibility.",

  synthesis:
    "Professional life becomes the primary channel for achievement, recognition and long-term legacy.",

  psychology:
    "The person naturally seeks excellence and feels most fulfilled when making a meaningful contribution through work.",

  areas: ["career","publicImage","money","mind"],

  practicalEffects: [
    "Career visibility increases.",
    "Leadership opportunities arise.",
    "Recognition becomes possible.",
    "Responsibilities expand."
  ],

  opportunities: [
    "Lead confidently.",
    "Take ownership.",
    "Build long-term reputation.",
    "Demonstrate professionalism."
  ],

  cautions: [
    "Avoid workaholism.",
    "Don't become overly status-conscious.",
    "Avoid neglecting personal relationships."
  ],

  bestUse:
    "Lead with competence, humility and consistency.",

  dailyExpression:
    "Professional visibility and recognition are strongly supported today.",

  askSarathiExplanation:
    "The Moon activates its own 10th house, making career, authority and reputation today's dominant themes.",

  lifeReportInterpretation:
    "Throughout life, professional achievement becomes one of the defining expressions of personal purpose.",

  confidence: 10,
},
"10_lord_in_11": {
  lordshipHouse: 10,
  placementHouse: 11,
  key: "10_lord_in_11",

  principle:
    "The 10th lord directs career toward gains, networks and fulfilment of ambitions.",

  synthesis:
    "Professional success creates financial rewards, influential networks and progress toward long-term aspirations.",

  psychology:
    "The person enjoys seeing hard work translate into measurable success and broader influence.",

  areas: ["career","money","relationships","publicImage"],

  practicalEffects: [
    "Professional gains increase.",
    "Useful contacts appear.",
    "Recognition improves income.",
    "Long-term goals gain momentum."
  ],

  opportunities: [
    "Expand your network.",
    "Accept recognition.",
    "Build strategic alliances.",
    "Plan future growth."
  ],

  cautions: [
    "Avoid chasing success alone.",
    "Don't compare yourself constantly.",
    "Avoid unrealistic expectations."
  ],

  bestUse:
    "Transform professional achievements into lasting opportunities.",

  dailyExpression:
    "Career progress today can create valuable long-term opportunities.",

  askSarathiExplanation:
    "The Moon links career with gains, making networking and professional relationships especially rewarding.",

  lifeReportInterpretation:
    "Throughout life, career becomes the primary source of fulfilment, influence and financial growth.",

  confidence: 10,
},
"10_lord_in_12": {
  lordshipHouse: 10,
  placementHouse: 12,
  key: "10_lord_in_12",

  principle:
    "The 10th lord directs career toward behind-the-scenes work, foreign lands, institutions and inner purpose.",

  synthesis:
    "Professional success develops through quiet preparation, international connections, service or work that is not always immediately visible.",

  psychology:
    "The person prefers meaningful contribution over public recognition and often produces their best work away from the spotlight.",

  areas: ["career","travel","spirituality","publicImage"],

  practicalEffects: [
    "Private work increases.",
    "Foreign or institutional opportunities arise.",
    "Planning becomes more valuable than immediate action.",
    "Career expenses may require attention."
  ],

  opportunities: [
    "Prepare quietly.",
    "Develop international connections.",
    "Finish background work.",
    "Reflect on long-term purpose."
  ],

  cautions: [
    "Avoid burnout.",
    "Don't overlook your achievements.",
    "Avoid unnecessary professional expenses."
  ],

  bestUse:
    "Allow quiet preparation to build lasting professional success.",

  dailyExpression:
    "Behind-the-scenes effort today may produce important future career rewards.",

  askSarathiExplanation:
    "The Moon links career with the 12th house, highlighting preparation, service and international or institutional themes.",

  lifeReportInterpretation:
    "Throughout life, your greatest professional achievements may come through service, foreign connections or meaningful work done away from the spotlight.",

  confidence: 10,
},
"9_lord_in_1": {
  lordshipHouse: 9,
  placementHouse: 1,
  key: "9_lord_in_1",

  principle:
    "The 9th lord brings dharma, wisdom and fortune directly into the personality and identity.",

  synthesis:
    "Personal growth is closely connected to higher learning, ethics and living according to meaningful principles.",

  psychology:
    "The person feels naturally guided when decisions align with conscience rather than convenience.",

  areas: ["mind","education","spirituality","travel"],

  practicalEffects: [
    "Confidence grows through clarity of purpose.",
    "Mentors or wise advice become valuable.",
    "Learning feels inspiring.",
    "People respond positively to your guidance."
  ],

  opportunities: [
    "Seek wise counsel.",
    "Lead with integrity.",
    "Study something meaningful.",
    "Trust long-term thinking."
  ],

  cautions: [
    "Avoid self-righteousness.",
    "Do not ignore practical realities.",
    "Avoid assuming luck will solve everything."
  ],

  bestUse:
    "Let wisdom guide today's decisions instead of immediate emotions.",

  dailyExpression:
    "Following your principles today is likely to produce the best outcomes.",

  askSarathiExplanation:
    "The Moon rules your 9th house and activates the ascendant, making purpose, wisdom and ethical decisions central today.",

  lifeReportInterpretation:
    "Throughout life, your greatest strength comes from living according to meaningful principles and continuous learning.",

  confidence: 10,
},
"9_lord_in_2": {
  lordshipHouse: 9,
  placementHouse: 2,
  key: "9_lord_in_2",

  principle:
    "The 9th lord directs wisdom and fortune toward wealth, family and values.",

  synthesis:
    "Financial stability grows through ethical decisions, education and long-term planning rather than shortcuts.",

  psychology:
    "The person feels secure when prosperity reflects personal values and integrity.",

  areas:["money","family","education","communication"],

  practicalEffects:[
    "Financial guidance proves valuable.",
    "Family discussions influence future planning.",
    "Wise advice improves financial decisions.",
    "Speech carries authority."
  ],

  opportunities:[
    "Review investments.",
    "Learn from experienced people.",
    "Share practical wisdom.",
    "Strengthen family values."
  ],

  cautions:[
    "Avoid greed.",
    "Do not ignore experienced advice.",
    "Avoid short-term thinking."
  ],

  bestUse:
    "Allow wisdom to shape financial choices.",

  dailyExpression:
    "Long-term thinking can improve financial stability today.",

  askSarathiExplanation:
    "The Moon links fortune with wealth, making education and ethics important in financial decisions.",

  lifeReportInterpretation:
    "Throughout life, prosperity grows steadily when guided by wisdom rather than impulse.",

  confidence:10,
},
"9_lord_in_3": {
  lordshipHouse:9,
  placementHouse:3,
  key:"9_lord_in_3",

  principle:
    "The 9th lord channels wisdom into communication, initiative and practical effort.",

  synthesis:
    "Knowledge becomes useful when shared through writing, teaching, communication and decisive action.",

  psychology:
    "The person feels fulfilled by learning continuously and helping others through practical guidance.",

  areas:["communication","education","travel","career"],

  practicalEffects:[
    "Meaningful conversations occur.",
    "Writing or teaching becomes productive.",
    "Short journeys support learning.",
    "Practical advice benefits others."
  ],

  opportunities:[
    "Write.",
    "Teach.",
    "Learn.",
    "Take initiative."
  ],

  cautions:[
    "Avoid preaching.",
    "Do not underestimate preparation.",
    "Avoid scattered effort."
  ],

  bestUse:
    "Turn knowledge into practical action.",

  dailyExpression:
    "Sharing what you know can create valuable opportunities today.",

  askSarathiExplanation:
    "The Moon connects wisdom with communication, making learning and teaching especially rewarding.",

  lifeReportInterpretation:
    "Throughout life, your voice becomes stronger when supported by genuine knowledge and experience.",

  confidence:10,
},
"9_lord_in_4": {
  lordshipHouse:9,
  placementHouse:4,
  key:"9_lord_in_4",

  principle:
    "The 9th lord directs wisdom toward home, family, emotional security and inner peace.",

  synthesis:
    "Family traditions, values and emotional stability become important foundations for personal growth.",

  psychology:
    "The person feels emotionally secure when home life reflects meaningful values and mutual respect.",

  areas:["home","family","mind","property"],

  practicalEffects:[
    "Family guidance becomes valuable.",
    "Home supports learning.",
    "Property decisions benefit from patience.",
    "Emotional clarity improves."
  ],

  opportunities:[
    "Reconnect with elders.",
    "Improve your home environment.",
    "Reflect quietly.",
    "Strengthen family bonds."
  ],

  cautions:[
    "Avoid becoming emotionally rigid.",
    "Do not ignore family wisdom.",
    "Avoid letting comfort replace growth."
  ],

  bestUse:
    "Build your future upon a peaceful and value-driven foundation.",

  dailyExpression:
    "A calm home environment helps you make wiser decisions today.",

  askSarathiExplanation:
    "The Moon links wisdom with emotional wellbeing, making family values especially influential.",

  lifeReportInterpretation:
    "Throughout life, emotional security and family guidance become important sources of wisdom and fortune.",

  confidence:10,
},
"9_lord_in_5": {
  lordshipHouse: 9,
  placementHouse: 5,
  key: "9_lord_in_5",

  principle:
    "The 9th lord directs wisdom, dharma and fortune into creativity, intelligence and children.",

  synthesis:
    "Higher learning, creative expression and thoughtful decision-making become channels through which fortune unfolds. Teaching, mentoring and intellectual pursuits are especially favoured.",

  psychology:
    "The person feels deeply fulfilled when knowledge is shared, creativity serves a meaningful purpose and future generations benefit from their experience.",

  areas: ["education", "children", "mind", "spirituality"],

  practicalEffects: [
    "Creative ideas gain clarity.",
    "Learning becomes enjoyable.",
    "Children may become a source of inspiration.",
    "Mentoring opportunities arise."
  ],

  opportunities: [
    "Study a meaningful subject.",
    "Teach someone.",
    "Develop a creative project.",
    "Trust intelligent planning."
  ],

  cautions: [
    "Avoid intellectual arrogance.",
    "Do not ignore practical execution.",
    "Avoid speculative decisions."
  ],

  bestUse:
    "Express wisdom through creativity and thoughtful leadership.",

  dailyExpression:
    "Creative insight and meaningful learning can open fortunate opportunities today.",

  askSarathiExplanation:
    "The Moon links the 9th house of wisdom with the 5th house of creativity and intelligence, encouraging inspired action.",

  lifeReportInterpretation:
    "Throughout life, fortune often grows through education, creativity and the ability to guide others.",

  confidence: 10,
},
"9_lord_in_6": {
  lordshipHouse: 9,
  placementHouse: 6,
  key: "9_lord_in_6",

  principle:
    "The 9th lord directs wisdom into service, discipline and overcoming obstacles.",

  synthesis:
    "Fortune develops through responsibility, humility and consistent effort. Challenges become opportunities for growth rather than punishment.",

  psychology:
    "The person feels most aligned when serving a meaningful purpose and improving themselves through disciplined action.",

  areas: ["career", "health", "mind", "spirituality"],

  practicalEffects: [
    "Work requires patience.",
    "Helpful guidance appears during challenges.",
    "Routine improves productivity.",
    "Health deserves attention."
  ],

  opportunities: [
    "Serve others.",
    "Strengthen daily discipline.",
    "Accept constructive feedback.",
    "Improve health routines."
  ],

  cautions: [
    "Avoid resentment.",
    "Do not expect luck without effort.",
    "Avoid neglecting wellbeing."
  ],

  bestUse:
    "Meet today's responsibilities with humility and discipline.",

  dailyExpression:
    "Steady effort today can quietly create long-term rewards.",

  askSarathiExplanation:
    "The Moon connects fortune with the 6th house, showing that discipline and service unlock today's opportunities.",

  lifeReportInterpretation:
    "Throughout life, blessings often arrive after consistent effort and the willingness to overcome difficulties.",

  confidence: 10,
},
"9_lord_in_7": {
  lordshipHouse: 9,
  placementHouse: 7,
  key: "9_lord_in_7",

  principle:
    "The 9th lord directs wisdom and fortune into partnerships and meaningful relationships.",

  synthesis:
    "Supportive relationships, mentors and collaborative ventures become important channels for growth and opportunity.",

  psychology:
    "The person feels emotionally fulfilled when relationships are based on mutual respect, learning and shared values.",

  areas: ["relationships", "communication", "career", "spirituality"],

  practicalEffects: [
    "Helpful people appear.",
    "Important discussions move forward.",
    "Partnerships become more supportive.",
    "Advice from others proves valuable."
  ],

  opportunities: [
    "Listen carefully.",
    "Strengthen partnerships.",
    "Seek guidance.",
    "Collaborate openly."
  ],

  cautions: [
    "Avoid becoming self-righteous.",
    "Do not ignore your partner's perspective.",
    "Avoid expecting others to solve every problem."
  ],

  bestUse:
    "Allow relationships to become a source of mutual growth.",

  dailyExpression:
    "Constructive conversations may open fortunate opportunities today.",

  askSarathiExplanation:
    "The Moon links the 9th house with partnerships, making cooperation and guidance especially beneficial.",

  lifeReportInterpretation:
    "Throughout life, meaningful partnerships often become turning points that shape your destiny.",

  confidence: 10,
},
"9_lord_in_8": {
  lordshipHouse: 9,
  placementHouse: 8,
  key: "9_lord_in_8",

  principle:
    "The 9th lord directs wisdom into transformation, hidden knowledge and profound personal change.",

  synthesis:
    "Fortune unfolds through inner transformation, research and the courage to embrace life's deeper lessons.",

  psychology:
    "The person feels spiritually aligned when uncertainty is approached with curiosity rather than fear.",

  areas: ["hiddenMatters", "spirituality", "mind", "education"],

  practicalEffects: [
    "Hidden information becomes valuable.",
    "Research produces insight.",
    "Unexpected events change perspective.",
    "Deep conversations become meaningful."
  ],

  opportunities: [
    "Study deeply.",
    "Accept change gracefully.",
    "Investigate carefully.",
    "Release outdated beliefs."
  ],

  cautions: [
    "Avoid fear-based thinking.",
    "Do not resist transformation.",
    "Avoid secrecy that creates mistrust."
  ],

  bestUse:
    "Treat every challenge as an opportunity for wisdom.",

  dailyExpression:
    "Today's deeper insights can permanently improve your perspective.",

  askSarathiExplanation:
    "The Moon combines the 9th house of wisdom with the 8th house of transformation, encouraging profound learning.",

  lifeReportInterpretation:
    "Throughout life, your greatest blessings often emerge after periods of deep personal transformation.",

  confidence: 10,
},
"9_lord_in_9": {
  lordshipHouse: 9,
  placementHouse: 9,
  key: "9_lord_in_9",

  principle:
    "The lord occupies its own house, powerfully strengthening wisdom, fortune, ethics and higher purpose.",

  synthesis:
    "Faith, learning, teachers and meaningful experiences naturally support growth. The person is encouraged to live according to higher principles.",

  psychology:
    "The deepest fulfilment comes from living authentically and continuously expanding one's understanding of life.",

  areas: ["education", "spirituality", "travel", "mind"],

  practicalEffects: [
    "Learning accelerates.",
    "Guidance appears naturally.",
    "Travel becomes meaningful.",
    "Fortunate opportunities arise."
  ],

  opportunities: [
    "Study.",
    "Travel.",
    "Teach.",
    "Seek guidance."
  ],

  cautions: [
    "Avoid overconfidence.",
    "Do not neglect practical action.",
    "Avoid assuming every outcome is guaranteed."
  ],

  bestUse:
    "Allow wisdom and integrity to shape every important decision.",

  dailyExpression:
    "Today's choices are best guided by long-term purpose rather than short-term gain.",

  askSarathiExplanation:
    "The Moon activates its own 9th house, strongly emphasizing wisdom, blessings and meaningful growth.",

  lifeReportInterpretation:
    "Throughout life, fortune grows naturally when your actions remain aligned with higher principles.",

  confidence: 10,
},
"9_lord_in_10": {
  lordshipHouse: 9,
  placementHouse: 10,
  key: "9_lord_in_10",

  principle:
    "The 9th lord directs wisdom and fortune toward career, leadership and public responsibility.",

  synthesis:
    "Professional success grows through ethical leadership, learning and acting with integrity. Mentors and higher knowledge can significantly influence career direction.",

  psychology:
    "The person feels most fulfilled when professional achievements reflect personal values and contribute positively to society.",

  areas: ["career", "publicImage", "education", "spirituality"],

  practicalEffects: [
    "Career guidance becomes valuable.",
    "Leadership opportunities arise.",
    "Professional recognition grows through integrity.",
    "Long-term planning gains importance."
  ],

  opportunities: [
    "Lead ethically.",
    "Seek a mentor.",
    "Develop expertise.",
    "Align work with purpose."
  ],

  cautions: [
    "Avoid compromising values for success.",
    "Do not ignore experienced advice.",
    "Avoid focusing only on status."
  ],

  bestUse:
    "Build your career on integrity, knowledge and service.",

  dailyExpression:
    "Professional opportunities today are strengthened by wisdom and ethical decision-making.",

  askSarathiExplanation:
    "The Moon links the 9th house of wisdom with the 10th house of career, highlighting purposeful leadership.",

  lifeReportInterpretation:
    "Throughout life, your greatest professional achievements come when career is aligned with your higher purpose.",

  confidence: 10,
},
"9_lord_in_11": {
  lordshipHouse: 9,
  placementHouse: 11,
  key: "9_lord_in_11",

  principle:
    "The 9th lord directs wisdom, fortune and higher purpose toward gains, networks and fulfilment of long-term aspirations.",

  synthesis:
    "Blessings often arrive through mentors, influential friendships, professional networks and communities that share your values. Long-term goals become easier to achieve when supported by meaningful relationships.",

  psychology:
    "The person feels deeply satisfied when personal success also contributes to the growth of a larger community. Meaningful friendships become a source of inspiration rather than merely social connection.",

  areas: ["money", "relationships", "career", "spirituality"],

  practicalEffects: [
    "Helpful contacts may appear.",
    "Networking creates valuable opportunities.",
    "Long-term plans gain momentum.",
    "Support from mentors or friends becomes meaningful."
  ],

  opportunities: [
    "Reconnect with influential people.",
    "Join communities that align with your values.",
    "Plan future ambitions.",
    "Accept guidance from experienced people."
  ],

  cautions: [
    "Avoid depending entirely on others.",
    "Do not confuse popularity with genuine support.",
    "Avoid chasing gains without purpose."
  ],

  bestUse:
    "Build relationships that support both personal success and meaningful contribution.",

  dailyExpression:
    "Supportive people or valuable introductions may help move an important goal forward today.",

  askSarathiExplanation:
    "The Moon links the 9th house of wisdom with the 11th house of gains and networks, making guidance and meaningful relationships powerful catalysts today.",

  lifeReportInterpretation:
    "Throughout life, fortune often unfolds through mentors, supportive friendships and communities that encourage your higher purpose.",

  confidence: 10,
},
"9_lord_in_12": {
  lordshipHouse: 9,
  placementHouse: 12,
  key: "9_lord_in_12",

  principle:
    "The 9th lord directs wisdom, dharma and fortune toward spiritual growth, solitude, foreign lands and inner transformation.",

  synthesis:
    "The search for meaning becomes deeply personal. Foreign travel, spiritual practice, retreat and quiet reflection become important channels through which wisdom and blessings unfold.",

  psychology:
    "The person feels most aligned when external achievements are balanced by inner peace, spiritual practice and compassionate service.",

  areas: ["spirituality", "travel", "mind", "education"],

  practicalEffects: [
    "Quiet reflection brings valuable insight.",
    "Foreign or long-distance matters become important.",
    "Spiritual study feels rewarding.",
    "Time alone restores clarity."
  ],

  opportunities: [
    "Meditate or pray.",
    "Study spiritual subjects.",
    "Plan meaningful travel.",
    "Release unnecessary mental burdens."
  ],

  cautions: [
    "Avoid escaping responsibilities.",
    "Do not isolate yourself unnecessarily.",
    "Avoid confusing withdrawal with wisdom."
  ],

  bestUse:
    "Allow periods of reflection to strengthen clarity, compassion and long-term purpose.",

  dailyExpression:
    "A quieter pace today can reveal insights that are easy to miss during constant activity.",

  askSarathiExplanation:
    "The Moon links the 9th house of higher wisdom with the 12th house of spiritual growth and reflection, encouraging inner development today.",

  lifeReportInterpretation:
    "Throughout life, some of your greatest blessings may come through spiritual growth, foreign experiences and learning to trust quiet inner guidance.",

  confidence: 10,
},
"8_lord_in_1": {
  lordshipHouse: 8,
  placementHouse: 1,
  key: "8_lord_in_1",

  principle:
    "The 8th lord directs transformation and hidden growth into the personality and identity.",

  synthesis:
    "Life repeatedly encourages personal reinvention. The native develops resilience by adapting to changing circumstances rather than resisting them.",

  psychology:
    "The person feels strongest after periods of deep inner change and rarely remains the same for long.",

  areas:["mind","health","spirituality","hiddenMatters"],

  practicalEffects:[
    "Personal priorities shift.",
    "Hidden emotions become clearer.",
    "Greater self-awareness develops.",
    "Unexpected situations encourage growth."
  ],

  opportunities:[
    "Reflect honestly.",
    "Accept necessary change.",
    "Strengthen emotional resilience.",
    "Release outdated habits."
  ],

  cautions:[
    "Avoid resisting change.",
    "Do not act from fear.",
    "Avoid emotional extremes."
  ],

  bestUse:
    "Treat change as an opportunity to become stronger.",

  dailyExpression:
    "Today's events may encourage a healthier perspective about yourself.",

  askSarathiExplanation:
    "The Moon rules your 8th house and activates the ascendant, making personal transformation today's dominant theme.",

  lifeReportInterpretation:
    "Throughout life, your greatest strength develops through repeated renewal and emotional resilience.",

  confidence:10,
},
"8_lord_in_2": {
  lordshipHouse:8,
  placementHouse:2,
  key:"8_lord_in_2",

  principle:
    "The 8th lord directs transformation toward wealth, family and personal values.",

  synthesis:
    "Financial priorities evolve through experience. Family responsibilities and shared resources encourage greater maturity.",

  psychology:
    "The person gradually learns that lasting security comes from adaptability rather than accumulation alone.",

  areas:["money","family","communication","hiddenMatters"],

  practicalEffects:[
    "Financial reviews become useful.",
    "Family discussions reveal deeper issues.",
    "Shared resources require attention.",
    "Speech carries emotional depth."
  ],

  opportunities:[
    "Review investments.",
    "Resolve family concerns.",
    "Simplify finances.",
    "Strengthen trust."
  ],

  cautions:[
    "Avoid secrecy about money.",
    "Do not react emotionally to financial changes.",
    "Avoid impulsive spending."
  ],

  bestUse:
    "Use today's insights to strengthen long-term financial stability.",

  dailyExpression:
    "A practical review of finances or family matters can create lasting benefits.",

  askSarathiExplanation:
    "The Moon links transformation with wealth and family, encouraging wiser financial decisions.",

  lifeReportInterpretation:
    "Throughout life, prosperity develops through learning to manage change wisely.",

  confidence:10,
},
"8_lord_in_3": {
  lordshipHouse:8,
  placementHouse:3,
  key:"8_lord_in_3",

  principle:
    "The 8th lord channels transformation through communication, learning and personal effort.",

  synthesis:
    "Growth comes by questioning assumptions, researching deeply and communicating with honesty.",

  psychology:
    "The person gains confidence through understanding difficult subjects and solving complex problems.",

  areas:["communication","education","hiddenMatters","career"],

  practicalEffects:[
    "Research becomes productive.",
    "Important conversations reveal hidden information.",
    "Writing helps organise thoughts.",
    "Learning accelerates."
  ],

  opportunities:[
    "Investigate carefully.",
    "Write your ideas.",
    "Study deeply.",
    "Take thoughtful action."
  ],

  cautions:[
    "Avoid gossip.",
    "Do not jump to conclusions.",
    "Avoid scattered thinking."
  ],

  bestUse:
    "Seek understanding before making important decisions.",

  dailyExpression:
    "A conversation today may reveal information that changes your perspective.",

  askSarathiExplanation:
    "The Moon connects transformation with communication, making research and thoughtful dialogue especially valuable.",

  lifeReportInterpretation:
    "Throughout life, knowledge becomes your greatest tool for navigating change.",

  confidence:10,
},
"8_lord_in_4": {
  lordshipHouse:8,
  placementHouse:4,
  key:"8_lord_in_4",

  principle:
    "The 8th lord directs transformation into home, family and emotional foundations.",

  synthesis:
    "Inner growth often begins with emotional healing. Family experiences become catalysts for greater maturity and self-understanding.",

  psychology:
    "The person finds lasting peace after confronting rather than avoiding emotional realities.",

  areas:["home","family","mind","property"],

  practicalEffects:[
    "Home matters require attention.",
    "Family discussions become meaningful.",
    "Property matters may need review.",
    "Emotional healing becomes possible."
  ],

  opportunities:[
    "Resolve family issues.",
    "Create emotional stability.",
    "Improve your living space.",
    "Reflect quietly."
  ],

  cautions:[
    "Avoid emotional withdrawal.",
    "Do not suppress feelings.",
    "Avoid unnecessary family conflict."
  ],

  bestUse:
    "Strengthen your emotional foundation before acting externally.",

  dailyExpression:
    "Today's emotional clarity can improve both home life and inner peace.",

  askSarathiExplanation:
    "The Moon links transformation with emotional security, encouraging healing within the home.",

  lifeReportInterpretation:
    "Throughout life, emotional resilience becomes one of your greatest strengths.",

  confidence:10,
},
"8_lord_in_5": {
  lordshipHouse:8,
  placementHouse:5,
  key:"8_lord_in_5",

  principle:
    "The 8th lord directs transformation into creativity, intelligence and future generations.",

  synthesis:
    "Creative expression becomes deeper through life experience. Learning, teaching and guiding others often emerge after significant personal growth.",

  psychology:
    "The person feels fulfilled when difficult experiences become wisdom that benefits others.",

  areas:["education","children","mind","spirituality"],

  practicalEffects:[
    "Creative insight deepens.",
    "Children inspire reflection.",
    "Learning becomes transformative.",
    "Research supports innovation."
  ],

  opportunities:[
    "Study deeply.",
    "Create thoughtfully.",
    "Teach from experience.",
    "Develop specialist skills."
  ],

  cautions:[
    "Avoid speculative risks.",
    "Do not dismiss intuition.",
    "Avoid overanalysing."
  ],

  bestUse:
    "Transform experience into wisdom that others can benefit from.",

  dailyExpression:
    "A deeper understanding today may improve your future decisions.",

  askSarathiExplanation:
    "The Moon links transformation with creativity and intelligence, encouraging thoughtful growth.",

  lifeReportInterpretation:
    "Throughout life, wisdom grows from turning experience into practical knowledge.",

  confidence:10,
},
"8_lord_in_6": {
  lordshipHouse:8,
  placementHouse:6,
  key:"8_lord_in_6",

  principle:
    "The 8th lord directs transformation toward work, discipline, health and overcoming obstacles.",

  synthesis:
    "Personal growth comes through solving problems, improving routines and becoming stronger after challenges.",

  psychology:
    "The person develops confidence by discovering that resilience is built through consistent effort rather than comfort.",

  areas:["career","health","mind","hiddenMatters"],

  practicalEffects:[
    "Routine requires adjustment.",
    "Health improvements become possible.",
    "Workplace issues reveal opportunities.",
    "Problem-solving becomes rewarding."
  ],

  opportunities:[
    "Improve routines.",
    "Address health concerns.",
    "Resolve old problems.",
    "Develop resilience."
  ],

  cautions:[
    "Avoid burnout.",
    "Do not ignore warning signs.",
    "Avoid unnecessary conflict."
  ],

  bestUse:
    "Use today's challenges as opportunities to strengthen yourself.",

  dailyExpression:
    "Small improvements today can create significant long-term benefits.",

  askSarathiExplanation:
    "The Moon combines transformation with discipline, encouraging practical improvement through consistent effort.",

  lifeReportInterpretation:
    "Throughout life, your ability to overcome obstacles becomes one of your defining strengths.",

  confidence:10,
},
"8_lord_in_7": {
  lordshipHouse: 8,
  placementHouse: 7,
  key: "8_lord_in_7",

  principle:
    "The 8th lord directs transformation into partnerships, agreements and public interactions.",

  synthesis:
    "Relationships become mirrors for deeper emotional growth. Honest conversations and mature cooperation can transform misunderstandings into trust.",

  psychology:
    "The person grows through relationships that require vulnerability, patience and emotional honesty.",

  areas: ["relationships", "communication", "mind", "hiddenMatters"],

  practicalEffects: [
    "Relationship conversations become deeper.",
    "Hidden expectations may surface.",
    "Client or partner matters need patience.",
    "Trust becomes an important theme."
  ],

  opportunities: [
    "Communicate honestly.",
    "Strengthen trust.",
    "Listen before reacting.",
    "Resolve sensitive matters maturely."
  ],

  cautions: [
    "Avoid suspicion.",
    "Do not control the conversation.",
    "Avoid making assumptions about others."
  ],

  bestUse:
    "Use honest dialogue to transform relationship dynamics.",

  dailyExpression:
    "A mature conversation may improve trust or clarity in an important relationship today.",

  askSarathiExplanation:
    "The Moon links transformation with partnerships, so relationships may bring deeper understanding today.",

  lifeReportInterpretation:
    "Throughout life, relationships become powerful catalysts for emotional maturity and personal transformation.",

  confidence: 10,
},

"8_lord_in_8": {
  lordshipHouse: 8,
  placementHouse: 8,
  key: "8_lord_in_8",

  principle:
    "The lord occupies its own house, strengthening transformation, research, hidden knowledge and deep healing.",

  synthesis:
    "This placement intensifies inner growth and supports research, emotional healing and the ability to handle uncertainty with maturity.",

  psychology:
    "The person feels strongest when they understand what others avoid and turn difficult experiences into wisdom.",

  areas: ["hiddenMatters", "mind", "spirituality", "money"],

  practicalEffects: [
    "Research becomes productive.",
    "Hidden matters may surface.",
    "Emotional insights deepen.",
    "Shared resources may need attention."
  ],

  opportunities: [
    "Investigate carefully.",
    "Do inner work.",
    "Review shared resources.",
    "Release outdated fears."
  ],

  cautions: [
    "Avoid obsessive thinking.",
    "Do not act from fear.",
    "Avoid secrecy that creates confusion."
  ],

  bestUse:
    "Use depth and patience to understand what needs transformation.",

  dailyExpression:
    "Today supports deep reflection, research and emotional renewal.",

  askSarathiExplanation:
    "The Moon activates its own 8th house, making transformation, hidden matters and deep understanding especially important.",

  lifeReportInterpretation:
    "Throughout life, transformation, research and emotional resilience become defining strengths.",

  confidence: 10,
},

"8_lord_in_9": {
  lordshipHouse: 8,
  placementHouse: 9,
  key: "8_lord_in_9",

  principle:
    "The 8th lord directs transformation into wisdom, higher learning, faith and long-distance experiences.",

  synthesis:
    "Beliefs may evolve through deep experiences. Teachers, travel, spiritual study or philosophical reflection can help turn uncertainty into wisdom.",

  psychology:
    "The person feels aligned when difficult experiences are given meaning rather than treated as random suffering.",

  areas: ["spirituality", "education", "travel", "mind"],

  practicalEffects: [
    "A belief or perspective may shift.",
    "Guidance helps during uncertainty.",
    "Spiritual study becomes meaningful.",
    "Long-distance matters may require patience."
  ],

  opportunities: [
    "Seek guidance.",
    "Study deeply.",
    "Reflect on your beliefs.",
    "Turn experience into wisdom."
  ],

  cautions: [
    "Avoid blind faith.",
    "Do not reject guidance out of fear.",
    "Avoid becoming rigid after difficult experiences."
  ],

  bestUse:
    "Allow wisdom to transform your perspective.",

  dailyExpression:
    "A broader perspective can help you understand a deeper situation today.",

  askSarathiExplanation:
    "The Moon links transformation with the 9th house of wisdom, encouraging deeper learning and perspective.",

  lifeReportInterpretation:
    "Throughout life, major transformations often reshape your beliefs and deepen spiritual understanding.",

  confidence: 10,
},

"8_lord_in_10": {
  lordshipHouse: 8,
  placementHouse: 10,
  key: "8_lord_in_10",

  principle:
    "The 8th lord directs transformation into career, responsibility and public reputation.",

  synthesis:
    "Professional life may involve change, strategy, research or crisis management. Career growth often comes through reinvention and deeper expertise.",

  psychology:
    "The person becomes professionally stronger by learning to stay calm under pressure and adapt when circumstances shift.",

  areas: ["career", "publicImage", "hiddenMatters", "mind"],

  practicalEffects: [
    "Career strategy needs review.",
    "Unexpected work changes may arise.",
    "Research or analysis becomes valuable.",
    "Private decisions influence public outcomes."
  ],

  opportunities: [
    "Adapt professionally.",
    "Build specialist knowledge.",
    "Handle sensitive work calmly.",
    "Review long-term career direction."
  ],

  cautions: [
    "Avoid impulsive career moves.",
    "Do not fear necessary change.",
    "Avoid office politics or secrecy."
  ],

  bestUse:
    "Use strategic thinking to turn professional uncertainty into strength.",

  dailyExpression:
    "A careful and strategic response at work can protect your reputation today.",

  askSarathiExplanation:
    "The Moon links transformation with career, so professional matters may require depth, patience and strategy.",

  lifeReportInterpretation:
    "Throughout life, career growth may come through reinvention, crisis management and specialist expertise.",

  confidence: 10,
},

"8_lord_in_11": {
  lordshipHouse: 8,
  placementHouse: 11,
  key: "8_lord_in_11",

  principle:
    "The 8th lord directs transformation into gains, networks and long-term aspirations.",

  synthesis:
    "Goals may evolve through changing circumstances. Gains can come through research, shared resources, strategic alliances or adapting to hidden factors.",

  psychology:
    "The person learns that fulfilment often requires releasing outdated ambitions and building wiser goals.",

  areas: ["money", "relationships", "hiddenMatters", "career"],

  practicalEffects: [
    "Long-term goals may need revision.",
    "Network dynamics may shift.",
    "Shared financial matters require review.",
    "Unexpected support may appear."
  ],

  opportunities: [
    "Review future plans.",
    "Choose trusted alliances.",
    "Research opportunities carefully.",
    "Adapt goals intelligently."
  ],

  cautions: [
    "Avoid risky gains.",
    "Do not trust every opportunity blindly.",
    "Avoid secrecy in group or financial matters."
  ],

  bestUse:
    "Let changing circumstances refine your long-term goals.",

  dailyExpression:
    "A shift in your network or goals may reveal a better long-term direction today.",

  askSarathiExplanation:
    "The Moon links transformation with gains, so ambitions may need deeper review before action.",

  lifeReportInterpretation:
    "Throughout life, gains often come through strategic adaptation, research and choosing alliances carefully.",

  confidence: 10,
},

"8_lord_in_12": {
  lordshipHouse: 8,
  placementHouse: 12,
  key: "8_lord_in_12",

  principle:
    "The 8th lord directs transformation into release, solitude, foreign lands and spiritual surrender.",

  synthesis:
    "Deep emotional renewal comes through letting go, spiritual reflection and quiet inner work. Hidden fears lose power when consciously released.",

  psychology:
    "The person feels lighter when they stop trying to control every outcome and allow healing to happen gradually.",

  areas: ["spirituality", "mind", "hiddenMatters", "travel"],

  practicalEffects: [
    "Private healing becomes important.",
    "Foreign or distant matters may arise.",
    "Old emotional patterns may be released.",
    "Rest and solitude support clarity."
  ],

  opportunities: [
    "Meditate or pray.",
    "Release emotional burdens.",
    "Rest deeply.",
    "Reflect without forcing answers."
  ],

  cautions: [
    "Avoid escapism.",
    "Do not isolate in fear.",
    "Avoid unnecessary expenses or hidden stress."
  ],

  bestUse:
    "Use solitude to release what no longer serves you.",

  dailyExpression:
    "Quiet reflection can help you release an old emotional burden today.",

  askSarathiExplanation:
    "The Moon links transformation with the 12th house of release, making inner healing and letting go especially important.",

  lifeReportInterpretation:
    "Throughout life, deep transformation comes through surrender, spiritual maturity and learning to release control.",

  confidence: 10,
},
"7_lord_in_1": {
  lordshipHouse: 7,
  placementHouse: 1,
  key: "7_lord_in_1",

  principle:
    "The 7th lord directs partnerships and public relationships into the personality and identity.",

  synthesis:
    "Relationships strongly influence personal growth. The native learns about themselves through cooperation, feedback and shared experiences.",

  psychology:
    "The person feels emotionally balanced when relationships are based on equality, trust and mutual respect.",

  areas:["relationships","mind","career","communication"],

  practicalEffects:[
    "Relationship matters become personally important.",
    "People seek your attention.",
    "Client interactions increase.",
    "Partnership decisions influence confidence."
  ],

  opportunities:[
    "Strengthen important relationships.",
    "Listen openly.",
    "Build trust.",
    "Collaborate on shared goals."
  ],

  cautions:[
    "Avoid defining yourself only through others.",
    "Do not become emotionally reactive.",
    "Avoid people-pleasing."
  ],

  bestUse:
    "Grow through healthy cooperation without losing your individuality.",

  dailyExpression:
    "Meaningful conversations may strengthen both your confidence and important relationships today.",

  askSarathiExplanation:
    "The Moon rules your 7th house and activates the ascendant, making partnerships and personal identity closely connected today.",

  lifeReportInterpretation:
    "Throughout life, important relationships become major catalysts for self-awareness and emotional maturity.",

  confidence:10,
},
"7_lord_in_2": {
  lordshipHouse:7,
  placementHouse:2,
  key:"7_lord_in_2",

  principle:
    "The 7th lord directs partnerships toward wealth, family and shared values.",

  synthesis:
    "Relationships influence financial stability, family decisions and long-term security. Cooperation strengthens prosperity.",

  psychology:
    "The person feels secure when financial and relationship goals move in the same direction.",

  areas:["money","family","relationships","communication"],

  practicalEffects:[
    "Joint financial decisions arise.",
    "Family discussions become important.",
    "Partners influence spending or savings.",
    "Communication affects trust."
  ],

  opportunities:[
    "Review shared finances.",
    "Discuss future plans.",
    "Strengthen family relationships.",
    "Communicate calmly."
  ],

  cautions:[
    "Avoid financial misunderstandings.",
    "Do not hide information.",
    "Avoid emotional spending."
  ],

  bestUse:
    "Build financial security through openness and cooperation.",

  dailyExpression:
    "Today's conversations can strengthen both relationships and financial stability.",

  askSarathiExplanation:
    "The Moon links partnerships with wealth and family, making shared decisions especially important.",

  lifeReportInterpretation:
    "Throughout life, prosperity grows through trustworthy relationships and shared values.",

  confidence:10,
},
"7_lord_in_3": {
  lordshipHouse:7,
  placementHouse:3,
  key:"7_lord_in_3",

  principle:
    "The 7th lord channels partnerships through communication, initiative and practical effort.",

  synthesis:
    "Relationships improve through honest dialogue, shared learning and taking initiative rather than waiting for problems to resolve themselves.",

  psychology:
    "The person feels emotionally connected when ideas and feelings are expressed openly.",

  areas:["communication","relationships","career","travel"],

  practicalEffects:[
    "Important conversations occur.",
    "Partnership planning progresses.",
    "Joint projects move forward.",
    "Short journeys strengthen relationships."
  ],

  opportunities:[
    "Communicate openly.",
    "Resolve misunderstandings.",
    "Take initiative together.",
    "Share ideas."
  ],

  cautions:[
    "Avoid passive communication.",
    "Do not assume others understand your intentions.",
    "Avoid unnecessary arguments."
  ],

  bestUse:
    "Use communication to strengthen trust and cooperation.",

  dailyExpression:
    "An honest discussion today can improve an important relationship.",

  askSarathiExplanation:
    "The Moon links partnerships with communication, encouraging practical dialogue today.",

  lifeReportInterpretation:
    "Throughout life, communication becomes one of the strongest foundations of successful relationships.",

  confidence:10,
},
"7_lord_in_4": {
  lordshipHouse:7,
  placementHouse:4,
  key:"7_lord_in_4",

  principle:
    "The 7th lord directs partnerships toward home, family and emotional security.",

  synthesis:
    "Relationships become strongest when supported by emotional stability, mutual care and a peaceful home environment.",

  psychology:
    "The person feels emotionally fulfilled when home life provides safety, understanding and shared purpose.",

  areas:["home","family","relationships","mind"],

  practicalEffects:[
    "Family relationships need attention.",
    "Domestic plans involve both partners.",
    "Home improvements become important.",
    "Emotional conversations strengthen trust."
  ],

  opportunities:[
    "Spend quality time together.",
    "Improve the home.",
    "Support loved ones.",
    "Create emotional stability."
  ],

  cautions:[
    "Avoid bringing work stress home.",
    "Do not ignore emotional needs.",
    "Avoid unnecessary domestic conflict."
  ],

  bestUse:
    "Build relationships upon emotional security rather than expectations.",

  dailyExpression:
    "A peaceful home environment helps important relationships flourish today.",

  askSarathiExplanation:
    "The Moon links partnerships with emotional wellbeing and family life, making home especially important today.",

  lifeReportInterpretation:
    "Throughout life, emotional security becomes one of the greatest strengths within lasting relationships.",

  confidence:10,
},
"7_lord_in_5": {
  lordshipHouse:7,
  placementHouse:5,
  key:"7_lord_in_5",

  principle:
    "The 7th lord directs partnerships into creativity, children and joyful self-expression.",

  synthesis:
    "Relationships flourish through shared creativity, learning, romance and supporting each other's personal growth.",

  psychology:
    "The person feels happiest when love includes friendship, inspiration and intellectual connection.",

  areas:["relationships","children","education","mind"],

  practicalEffects:[
    "Romantic energy increases.",
    "Creative collaboration becomes productive.",
    "Children bring shared joy.",
    "Learning together strengthens relationships."
  ],

  opportunities:[
    "Enjoy quality time together.",
    "Create something together.",
    "Support children's growth.",
    "Express appreciation."
  ],

  cautions:[
    "Avoid ego battles.",
    "Do not seek constant validation.",
    "Avoid unrealistic romantic expectations."
  ],

  bestUse:
    "Let relationships become a source of creativity and inspiration.",

  dailyExpression:
    "Shared experiences today can strengthen affection and mutual understanding.",

  askSarathiExplanation:
    "The Moon links partnerships with creativity and romance, encouraging joyful connection today.",

  lifeReportInterpretation:
    "Throughout life, relationships become richer through shared creativity, learning and emotional generosity.",

  confidence:10,
},
"7_lord_in_6": {
  lordshipHouse:7,
  placementHouse:6,
  key:"7_lord_in_6",

  principle:
    "The 7th lord directs partnerships toward service, discipline and resolving challenges.",

  synthesis:
    "Relationships grow stronger by working through disagreements, supporting each other during difficulties and building healthy routines together.",

  psychology:
    "The person feels secure when conflicts are handled fairly and responsibilities are shared.",

  areas:["relationships","health","career","mind"],

  practicalEffects:[
    "Practical responsibilities require cooperation.",
    "Routine affects relationships.",
    "Constructive problem-solving becomes important.",
    "Service strengthens trust."
  ],

  opportunities:[
    "Work as a team.",
    "Improve daily routines.",
    "Resolve disagreements calmly.",
    "Support each other's wellbeing."
  ],

  cautions:[
    "Avoid criticism.",
    "Do not keep score.",
    "Avoid neglecting health because of relationship stress."
  ],

  bestUse:
    "Treat challenges as opportunities to strengthen the relationship.",

  dailyExpression:
    "Working together on practical matters can improve trust today.",

  askSarathiExplanation:
    "The Moon links partnerships with the 6th house, showing that cooperation through challenges strengthens relationships.",

  lifeReportInterpretation:
    "Throughout life, lasting relationships are built through service, patience and shared responsibility.",

  confidence:10,
},
"7_lord_in_7": {
  lordshipHouse: 7,
  placementHouse: 7,
  key: "7_lord_in_7",

  principle:
    "The lord occupies its own house, strongly reinforcing partnerships, marriage, cooperation and public relationships.",

  synthesis:
    "Relationships become one of life's greatest strengths. Success often comes through mutual trust, collaboration and balanced partnerships.",

  psychology:
    "The person feels emotionally complete when relationships are built on equality, respect and genuine companionship.",

  areas: ["relationships","communication","career","mind"],

  practicalEffects: [
    "Partnerships become more active.",
    "Important agreements progress.",
    "Clients or spouse become supportive.",
    "Relationship clarity improves."
  ],

  opportunities: [
    "Strengthen commitments.",
    "Negotiate fairly.",
    "Build long-term trust.",
    "Share responsibilities."
  ],

  cautions: [
    "Avoid becoming dependent on others.",
    "Do not ignore your own needs.",
    "Avoid taking relationships for granted."
  ],

  bestUse:
    "Invest in relationships that encourage mutual growth.",

  dailyExpression:
    "Partnerships and meaningful conversations are especially supportive today.",

  askSarathiExplanation:
    "The Moon activates its own 7th house, making relationships, cooperation and agreements today's dominant themes.",

  lifeReportInterpretation:
    "Throughout life, meaningful partnerships become one of the greatest sources of fulfilment and success.",

  confidence: 10,
},
"7_lord_in_8": {
  lordshipHouse: 7,
  placementHouse: 8,
  key: "7_lord_in_8",

  principle:
    "The 7th lord directs partnerships toward transformation, shared resources and emotional depth.",

  synthesis:
    "Relationships evolve through honesty, vulnerability and navigating life's deeper experiences together.",

  psychology:
    "The person feels closest to others when trust allows emotional transparency rather than superficial harmony.",

  areas: ["relationships","hiddenMatters","money","mind"],

  practicalEffects: [
    "Important emotional discussions arise.",
    "Shared finances require attention.",
    "Trust becomes a central theme.",
    "Relationship dynamics deepen."
  ],

  opportunities: [
    "Strengthen emotional intimacy.",
    "Discuss shared responsibilities.",
    "Resolve hidden concerns.",
    "Build lasting trust."
  ],

  cautions: [
    "Avoid secrecy.",
    "Do not become possessive.",
    "Avoid reacting from fear."
  ],

  bestUse:
    "Allow honesty and trust to strengthen important relationships.",

  dailyExpression:
    "An open conversation today may transform an important relationship for the better.",

  askSarathiExplanation:
    "The Moon links partnerships with transformation, encouraging emotional depth and mutual trust.",

  lifeReportInterpretation:
    "Throughout life, your strongest relationships are those that continue growing through honesty and shared transformation.",

  confidence: 10,
},
"7_lord_in_9": {
  lordshipHouse: 7,
  placementHouse: 9,
  key: "7_lord_in_9",

  principle:
    "The 7th lord directs partnerships toward wisdom, higher learning and shared values.",

  synthesis:
    "Relationships flourish through mutual respect, learning and a shared sense of purpose. Mentors, travel or education may strengthen important bonds.",

  psychology:
    "The person feels emotionally fulfilled when relationships encourage personal growth rather than limit it.",

  areas: ["relationships","education","travel","spirituality"],

  practicalEffects: [
    "Shared learning becomes meaningful.",
    "Travel together may be beneficial.",
    "Mentors influence relationships.",
    "Future planning improves."
  ],

  opportunities: [
    "Learn together.",
    "Seek guidance.",
    "Travel if appropriate.",
    "Discuss long-term values."
  ],

  cautions: [
    "Avoid becoming morally superior.",
    "Do not dismiss your partner's beliefs.",
    "Avoid unrealistic expectations."
  ],

  bestUse:
    "Build relationships around shared purpose and mutual respect.",

  dailyExpression:
    "A meaningful conversation today may strengthen trust and long-term understanding.",

  askSarathiExplanation:
    "The Moon links partnerships with wisdom and higher learning, making shared values especially important today.",

  lifeReportInterpretation:
    "Throughout life, relationships become strongest when built upon learning, respect and common purpose.",

  confidence: 10,
},
"7_lord_in_10": {
  lordshipHouse: 7,
  placementHouse: 10,
  key: "7_lord_in_10",

  principle:
    "The 7th lord directs partnerships toward career, responsibility and public life.",

  synthesis:
    "Professional success is strengthened through collaboration, trusted clients and supportive partnerships. Reputation benefits from cooperative leadership.",

  psychology:
    "The person feels fulfilled when success is shared rather than achieved alone.",

  areas: ["career","relationships","publicImage","communication"],

  practicalEffects: [
    "Professional partnerships become important.",
    "Client relationships improve.",
    "Joint ventures progress.",
    "Public interactions gain significance."
  ],

  opportunities: [
    "Collaborate professionally.",
    "Strengthen business relationships.",
    "Support your team.",
    "Negotiate wisely."
  ],

  cautions: [
    "Avoid controlling partnerships.",
    "Do not take colleagues for granted.",
    "Avoid sacrificing integrity for approval."
  ],

 bestUse:
    "Use cooperation to strengthen both reputation and long-term success.",

  dailyExpression:
    "Working with others today can significantly improve professional outcomes.",

  askSarathiExplanation:
    "The Moon links partnerships with career, making cooperation a major factor in professional progress today.",

  lifeReportInterpretation:
    "Throughout life, career growth is strongly supported by trustworthy professional relationships.",

  confidence: 10,
},
"7_lord_in_11": {
  lordshipHouse: 7,
  placementHouse: 11,
  key: "7_lord_in_11",

  principle:
    "The 7th lord directs partnerships toward gains, friendships and long-term aspirations.",

  synthesis:
    "Relationships become valuable allies in achieving future goals. Mutual encouragement creates lasting progress and fulfilment.",

  psychology:
    "The person feels happiest when relationships support both emotional wellbeing and shared ambitions.",

  areas: ["relationships","money","career","mind"],

  practicalEffects: [
    "Supportive people become more visible.",
    "Shared goals gain momentum.",
    "Networking strengthens relationships.",
    "Friends may introduce opportunities."
  ],

  opportunities: [
    "Build meaningful alliances.",
    "Review future plans together.",
    "Expand your network.",
    "Celebrate shared achievements."
  ],

  cautions: [
    "Avoid comparing relationships with others.",
    "Do not depend entirely on external support.",
    "Avoid unrealistic expectations."
  ],

  bestUse:
    "Let supportive relationships become a foundation for long-term success.",

  dailyExpression:
    "A friend or partner may help you move an important goal forward today.",

  askSarathiExplanation:
    "The Moon links partnerships with gains and networks, highlighting the value of supportive relationships today.",

  lifeReportInterpretation:
    "Throughout life, fulfilment often comes through relationships that encourage mutual growth and shared aspirations.",

  confidence: 10,
},
"7_lord_in_12": {
  lordshipHouse: 7,
  placementHouse: 12,
  key: "7_lord_in_12",

  principle:
    "The 7th lord directs partnerships toward spiritual growth, foreign connections, compassion and emotional surrender.",

  synthesis:
    "Relationships may deepen through quiet understanding, forgiveness, travel or shared spiritual experiences. Compassion becomes more important than winning arguments.",

  psychology:
    "The person feels emotionally connected when relationships provide acceptance, healing and space for individual growth.",

  areas: ["relationships","spirituality","travel","mind"],

  practicalEffects: [
    "Private conversations become meaningful.",
    "Foreign connections may influence relationships.",
    "Quiet reflection strengthens understanding.",
    "Compassion improves harmony."
  ],

  opportunities: [
    "Forgive where appropriate.",
    "Spend quiet time together.",
    "Support emotional healing.",
    "Strengthen spiritual connection."
  ],

  cautions: [
    "Avoid emotional withdrawal.",
    "Do not avoid important conversations.",
    "Avoid sacrificing your own wellbeing."
  ],

  bestUse:
    "Allow compassion and understanding to deepen important relationships.",

  dailyExpression:
    "Patience and empathy today can quietly strengthen an important relationship.",

  askSarathiExplanation:
    "The Moon links partnerships with the 12th house, encouraging compassion, reflection and emotional healing.",

  lifeReportInterpretation:
    "Throughout life, your deepest relationships develop through forgiveness, empathy and shared spiritual growth.",

  confidence: 10,
},
"6_lord_in_1": {
  lordshipHouse: 6,
  placementHouse: 1,
  key: "6_lord_in_1",

  principle:
    "The 6th lord directs work, discipline and service into the personality.",

  synthesis:
    "Personal growth comes through responsibility, healthy routines and learning to overcome challenges with patience.",

  psychology:
    "The person feels strongest when actively improving themselves instead of avoiding difficult situations.",

  areas:["health","career","mind","communication"],

  practicalEffects:[
    "Work requires attention.",
    "Health becomes important.",
    "Personal discipline improves.",
    "Responsibilities increase."
  ],

  opportunities:[
    "Improve daily routines.",
    "Exercise consistently.",
    "Finish pending work.",
    "Solve practical problems."
  ],

  cautions:[
    "Avoid burnout.",
    "Don't neglect rest.",
    "Avoid unnecessary arguments."
  ],

  bestUse:
    "Use discipline to build long-term confidence.",

  dailyExpression:
    "Today's responsibilities can strengthen your confidence if handled patiently.",

  askSarathiExplanation:
    "The Moon rules the 6th house and activates the ascendant, making discipline and self-improvement today's focus.",

  lifeReportInterpretation:
    "Throughout life, your greatest growth comes from resilience, discipline and consistent self-improvement.",

  confidence:10,
},
"6_lord_in_2": {
  lordshipHouse:6,
  placementHouse:2,
  key:"6_lord_in_2",

  principle:
    "The 6th lord directs work and discipline toward wealth, speech and family.",

  synthesis:
    "Financial stability develops through consistent effort, responsible planning and practical communication.",

  psychology:
    "The person feels secure when income is built steadily rather than through shortcuts.",

  areas:["money","family","communication","career"],

  practicalEffects:[
    "Income depends upon consistent effort.",
    "Family responsibilities require attention.",
    "Budget reviews become useful.",
    "Professional communication improves."
  ],

  opportunities:[
    "Review finances.",
    "Strengthen work habits.",
    "Communicate calmly.",
    "Support family practically."
  ],

  cautions:[
    "Avoid emotional spending.",
    "Don't argue over money.",
    "Avoid careless speech."
  ],

  bestUse:
    "Allow discipline to strengthen financial stability.",

  dailyExpression:
    "Practical financial decisions today can create lasting stability.",

  askSarathiExplanation:
    "The Moon links work and discipline with money and family responsibilities.",

  lifeReportInterpretation:
    "Throughout life, prosperity develops through disciplined effort and responsible financial management.",

  confidence:10,
},
"6_lord_in_3": {
  lordshipHouse:6,
  placementHouse:3,
  key:"6_lord_in_3",

  principle:
    "The 6th lord channels discipline through communication, courage and personal effort.",

  synthesis:
    "Progress comes through initiative, practical thinking and consistent follow-through rather than inspiration alone.",

  psychology:
    "The person gains confidence by solving problems directly instead of postponing them.",

  areas:["communication","career","travel","mind"],

  practicalEffects:[
    "Important follow-ups arise.",
    "Communication becomes productive.",
    "Short journeys support work.",
    "Learning improves performance."
  ],

  opportunities:[
    "Take initiative.",
    "Finish important conversations.",
    "Learn practical skills.",
    "Stay organised."
  ],

  cautions:[
    "Avoid impatience.",
    "Don't overreact.",
    "Avoid scattered effort."
  ],

  bestUse:
    "Use practical communication to solve problems efficiently.",

  dailyExpression:
    "A practical conversation today can remove an important obstacle.",

  askSarathiExplanation:
    "The Moon combines discipline with communication, encouraging decisive action.",

  lifeReportInterpretation:
    "Throughout life, success develops through initiative, persistence and clear communication.",

  confidence:10,
},
"6_lord_in_4": {
  lordshipHouse:6,
  placementHouse:4,
  key:"6_lord_in_4",

  principle:
    "The 6th lord directs discipline toward home, family and emotional wellbeing.",

  synthesis:
    "Domestic responsibilities encourage maturity. Emotional stability improves through organised routines and practical care.",

  psychology:
    "The person feels peaceful when responsibilities are handled steadily instead of avoided.",

  areas:["home","family","health","mind"],

  practicalEffects:[
    "Home routines need attention.",
    "Family responsibilities increase.",
    "Property matters require organisation.",
    "Rest improves productivity."
  ],

  opportunities:[
    "Organise your home.",
    "Support family.",
    "Improve routines.",
    "Prioritise emotional balance."
  ],

  cautions:[
    "Avoid carrying work stress home.",
    "Don't neglect rest.",
    "Avoid family criticism."
  ],

  bestUse:
    "Create order at home to strengthen inner stability.",

  dailyExpression:
    "A well-organised home environment supports today's productivity.",

  askSarathiExplanation:
    "The Moon links discipline with emotional security and home life.",

  lifeReportInterpretation:
    "Throughout life, emotional strength develops through responsibility and steady family support.",

  confidence:10,
},
"6_lord_in_5": {
  lordshipHouse:6,
  placementHouse:5,
  key:"6_lord_in_5",

  principle:
    "The 6th lord directs discipline toward creativity, intelligence and learning.",

  synthesis:
    "Creative success develops through practice, patience and refining skills over time.",

  psychology:
    "The person feels fulfilled when effort produces visible improvement rather than instant success.",

  areas:["education","children","career","mind"],

  practicalEffects:[
    "Learning requires discipline.",
    "Creative projects improve steadily.",
    "Children require guidance.",
    "Skills become stronger."
  ],

  opportunities:[
    "Study consistently.",
    "Practice your craft.",
    "Teach patiently.",
    "Improve techniques."
  ],

  cautions:[
    "Avoid perfectionism.",
    "Don't compare yourself constantly.",
    "Avoid rushing learning."
  ],

  bestUse:
    "Develop mastery through consistent practice.",

  dailyExpression:
    "Small improvements today can create impressive long-term progress.",

  askSarathiExplanation:
    "The Moon links discipline with creativity and learning, rewarding consistent effort.",

  lifeReportInterpretation:
    "Throughout life, expertise develops through patience, repetition and continuous improvement.",

  confidence:10,
},
"6_lord_in_6": {
  lordshipHouse:6,
  placementHouse:6,
  key:"6_lord_in_6",

  principle:
    "The lord occupies its own house, strengthening discipline, service, health and resilience.",

  synthesis:
    "The native becomes highly capable of solving problems, improving systems and handling responsibility under pressure.",

  psychology:
    "The person feels most confident when overcoming challenges through persistence and practical action.",

  areas:["career","health","mind","money"],

  practicalEffects:[
    "Work becomes productive.",
    "Health routines improve.",
    "Problems become easier to solve.",
    "Responsibilities increase."
  ],

  opportunities:[
    "Lead by example.",
    "Strengthen routines.",
    "Improve efficiency.",
    "Support others."
  ],

  cautions:[
    "Avoid becoming overly critical.",
    "Don't ignore rest.",
    "Avoid carrying every burden yourself."
  ],

  bestUse:
    "Use discipline as your greatest personal strength.",

  dailyExpression:
    "Today's effort is likely to produce lasting improvements.",

  askSarathiExplanation:
    "The Moon activates its own 6th house, making discipline, service and resilience today's strongest themes.",

  lifeReportInterpretation:
    "Throughout life, resilience, service and practical problem-solving become defining strengths.",

  confidence:10,
},
"6_lord_in_7": {
  lordshipHouse: 6,
  placementHouse: 7,
  key: "6_lord_in_7",

  principle:
    "The 6th lord directs work, discipline and problem-solving into partnerships and one-to-one relationships.",

  synthesis:
    "Relationships grow stronger when responsibilities are shared fairly and disagreements are addressed constructively. Cooperation becomes the path to overcoming challenges.",

  psychology:
    "The person feels secure when both partners contribute equally and resolve issues through practical discussion rather than emotional reactions.",

  areas: ["relationships", "career", "communication", "health"],

  practicalEffects: [
    "Partnership responsibilities increase.",
    "Client matters require attention.",
    "Constructive discussions resolve issues.",
    "Working together improves results."
  ],

  opportunities: [
    "Share responsibilities.",
    "Resolve disagreements calmly.",
    "Support your partner.",
    "Strengthen teamwork."
  ],

  cautions: [
    "Avoid criticism.",
    "Do not keep score in relationships.",
    "Avoid unnecessary arguments."
  ],

  bestUse:
    "Treat challenges as opportunities to strengthen trust and cooperation.",

  dailyExpression:
    "Working together today can solve a problem that seemed difficult yesterday.",

  askSarathiExplanation:
    "The Moon links the 6th house of service with the 7th house of partnerships, encouraging practical cooperation.",

  lifeReportInterpretation:
    "Throughout life, lasting relationships develop through patience, teamwork and shared responsibility.",

  confidence: 10,
},
"6_lord_in_8": {
  lordshipHouse: 6,
  placementHouse: 8,
  key: "6_lord_in_8",

  principle:
    "The 6th lord directs discipline and service toward transformation, healing and hidden matters.",

  synthesis:
    "Challenges become opportunities for deep growth. Careful analysis, healing and research help resolve issues that others overlook.",

  psychology:
    "The person becomes emotionally stronger each time they successfully work through uncertainty instead of avoiding it.",

  areas: ["hiddenMatters", "health", "mind", "spirituality"],

  practicalEffects: [
    "Research becomes valuable.",
    "Old problems can finally be resolved.",
    "Health improvements require patience.",
    "Hidden information may surface."
  ],

  opportunities: [
    "Investigate carefully.",
    "Improve long-standing habits.",
    "Address unresolved issues.",
    "Develop specialist knowledge."
  ],

  cautions: [
    "Avoid fear-based thinking.",
    "Do not ignore warning signs.",
    "Avoid unnecessary secrecy."
  ],

  bestUse:
    "Transform persistent problems into lasting strengths.",

  dailyExpression:
    "Today's deeper understanding can help resolve an old challenge.",

  askSarathiExplanation:
    "The Moon links discipline with transformation, encouraging practical healing and careful analysis.",

  lifeReportInterpretation:
    "Throughout life, resilience grows through disciplined self-improvement and emotional healing.",

  confidence: 10,
},
"6_lord_in_9": {
  lordshipHouse: 6,
  placementHouse: 9,
  key: "6_lord_in_9",

  principle:
    "The 6th lord directs discipline toward higher learning, wisdom and purposeful action.",

  synthesis:
    "Knowledge becomes meaningful when applied consistently. Growth comes through disciplined study, ethical conduct and serving a higher purpose.",

  psychology:
    "The person feels fulfilled when daily effort aligns with long-term values rather than immediate rewards.",

  areas: ["education", "spirituality", "career", "travel"],

  practicalEffects: [
    "Learning supports career growth.",
    "Mentors offer practical guidance.",
    "Travel may involve responsibility.",
    "Routine strengthens confidence."
  ],

  opportunities: [
    "Study consistently.",
    "Seek guidance.",
    "Develop expertise.",
    "Align work with your values."
  ],

  cautions: [
    "Avoid becoming rigid.",
    "Do not ignore practical details.",
    "Avoid expecting luck without effort."
  ],

  bestUse:
    "Allow disciplined learning to shape long-term success.",

  dailyExpression:
    "Consistent effort today can create meaningful opportunities for the future.",

  askSarathiExplanation:
    "The Moon links service with wisdom, showing that disciplined learning brings lasting benefits.",

  lifeReportInterpretation:
    "Throughout life, knowledge becomes most valuable when supported by humility and consistent practice.",

  confidence: 10,
},
"6_lord_in_10": {
  lordshipHouse: 6,
  placementHouse: 10,
  key: "6_lord_in_10",

  principle:
    "The 6th lord directs discipline, service and perseverance into career and public responsibility.",

  synthesis:
    "Professional success develops through reliability, hard work and consistently solving difficult problems. Reputation grows because others trust your dependability.",

  psychology:
    "The person feels most accomplished when recognised for competence, integrity and consistent effort rather than status alone.",

  areas: ["career", "publicImage", "health", "money"],

  practicalEffects: [
    "Career responsibilities increase.",
    "Professional reputation improves.",
    "Leadership through service becomes visible.",
    "Work routines become more productive."
  ],

  opportunities: [
    "Take responsibility.",
    "Improve workplace systems.",
    "Support colleagues.",
    "Demonstrate reliability."
  ],

  cautions: [
    "Avoid overworking.",
    "Do not ignore your health.",
    "Avoid unnecessary workplace conflict."
  ],

  bestUse:
    "Build your reputation through consistent excellence.",

  dailyExpression:
    "Today's disciplined effort can significantly strengthen your professional standing.",

  askSarathiExplanation:
    "The Moon connects discipline with career, making responsible action especially rewarding today.",

  lifeReportInterpretation:
    "Throughout life, career success comes through persistence, service and dependable leadership.",

  confidence: 10,
},
"6_lord_in_11": {
  lordshipHouse: 6,
  placementHouse: 11,
  key: "6_lord_in_11",

  principle:
    "The 6th lord directs disciplined effort toward gains, networks and long-term ambitions.",

  synthesis:
    "Success develops gradually through persistence, teamwork and continuous improvement. Long-term goals are achieved one practical step at a time.",

  psychology:
    "The person finds satisfaction in steady progress rather than instant success, valuing dependable relationships over popularity.",

  areas: ["career", "money", "relationships", "mind"],

  practicalEffects: [
    "Long-term plans gain structure.",
    "Professional networks become useful.",
    "Steady effort produces measurable progress.",
    "Supportive colleagues contribute to success."
  ],

  opportunities: [
    "Expand your professional network.",
    "Review long-term goals.",
    "Work consistently.",
    "Build strategic relationships."
  ],

  cautions: [
    "Avoid impatience.",
    "Do not compare your progress with others.",
    "Avoid unrealistic expectations."
  ],

  bestUse:
    "Allow consistent effort to build lasting achievements.",

  dailyExpression:
    "Today's steady progress may produce rewards that continue growing over time.",

  askSarathiExplanation:
    "The Moon links discipline with gains, showing that persistence creates long-term opportunities.",

  lifeReportInterpretation:
    "Throughout life, fulfilment comes through disciplined effort, meaningful friendships and steady progress toward ambitious goals.",

  confidence: 10,
},
"6_lord_in_12": {
  lordshipHouse: 6,
  placementHouse: 12,
  key: "6_lord_in_12",

  principle:
    "The 6th lord directs discipline toward solitude, healing, foreign lands and spiritual service.",

  synthesis:
    "Growth comes through balancing effort with rest. Quiet preparation, compassionate service and emotional renewal become essential for long-term wellbeing.",

  psychology:
    "The person feels emotionally balanced when they know when to work hard and when to step back for recovery and reflection.",

  areas: ["health", "spirituality", "travel", "mind"],

  practicalEffects: [
    "Rest becomes productive.",
    "Behind-the-scenes work increases.",
    "Health improves through recovery.",
    "Foreign or institutional matters may require attention."
  ],

  opportunities: [
    "Rest intentionally.",
    "Meditate or pray.",
    "Complete private work.",
    "Strengthen emotional resilience."
  ],

  cautions: [
    "Avoid burnout.",
    "Do not escape responsibilities.",
    "Avoid neglecting your physical wellbeing."
  ],

  bestUse:
    "Use periods of quiet reflection to restore energy and prepare for future success.",

  dailyExpression:
    "A slower pace today may help you solve problems more effectively than constant activity.",

  askSarathiExplanation:
    "The Moon links discipline with the 12th house of rest and reflection, reminding you that recovery is part of progress.",

  lifeReportInterpretation:
    "Throughout life, your greatest resilience comes from balancing disciplined effort with meaningful rest and inner renewal.",

  confidence: 10,
},
"5_lord_in_1": {
  lordshipHouse: 5,
  placementHouse: 1,
  key: "5_lord_in_1",

  principle:
    "The 5th lord directs creativity, intelligence and self-expression into the personality.",

  synthesis:
    "The native naturally expresses intelligence, creativity and optimism through personal actions. Confidence grows when talents are actively used.",

  psychology:
    "The person feels most alive when creating, learning and inspiring others through authentic self-expression.",

  areas:["mind","education","children","career"],

  practicalEffects:[
    "Creative ideas flow easily.",
    "Confidence improves.",
    "Learning becomes enjoyable.",
    "People notice your originality."
  ],

  opportunities:[
    "Express your ideas.",
    "Learn something new.",
    "Mentor someone.",
    "Lead creatively."
  ],

  cautions:[
    "Avoid ego-driven decisions.",
    "Don't seek constant validation.",
    "Avoid overconfidence."
  ],

  bestUse:
    "Allow creativity and intelligence to guide today's actions.",

  dailyExpression:
    "Your ideas are likely to attract positive attention today.",

  askSarathiExplanation:
    "The Moon rules your 5th house and activates the ascendant, making creativity and self-expression today's strongest themes.",

  lifeReportInterpretation:
    "Throughout life, your confidence grows through learning, creativity and sharing your knowledge.",

  confidence:10,
},
"5_lord_in_2": {
  lordshipHouse:5,
  placementHouse:2,
  key:"5_lord_in_2",

  principle:
    "The 5th lord directs intelligence and creativity toward wealth, speech and family.",

  synthesis:
    "Knowledge becomes a source of prosperity. Communication and thoughtful financial planning support long-term stability.",

  psychology:
    "The person feels secure when talents create practical value for both themselves and their family.",

  areas:["money","family","communication","education"],

  practicalEffects:[
    "Creative ideas influence income.",
    "Meaningful conversations occur.",
    "Family supports learning.",
    "Financial planning improves."
  ],

  opportunities:[
    "Share knowledge.",
    "Review investments.",
    "Teach others.",
    "Communicate confidently."
  ],

  cautions:[
    "Avoid emotional spending.",
    "Don't exaggerate.",
    "Avoid speculative decisions."
  ],

  bestUse:
    "Transform knowledge into lasting value.",

  dailyExpression:
    "A thoughtful idea today could improve both finances and relationships.",

  askSarathiExplanation:
    "The Moon links creativity with wealth and communication, encouraging practical intelligence.",

  lifeReportInterpretation:
    "Throughout life, prosperity often develops through education, communication and wise financial decisions.",

  confidence:10,
},
"5_lord_in_3": {
  lordshipHouse:5,
  placementHouse:3,
  key:"5_lord_in_3",

  principle:
    "The 5th lord channels creativity into communication, learning and initiative.",

  synthesis:
    "Ideas become valuable when expressed through writing, speaking, teaching and practical action.",

  psychology:
    "The person feels fulfilled when curiosity leads to meaningful conversations and continuous learning.",

  areas:["communication","education","career","travel"],

  practicalEffects:[
    "Writing becomes productive.",
    "Ideas gain attention.",
    "Learning accelerates.",
    "Short journeys become useful."
  ],

  opportunities:[
    "Write.",
    "Teach.",
    "Take initiative.",
    "Learn continuously."
  ],

  cautions:[
    "Avoid scattered thinking.",
    "Don't hesitate unnecessarily.",
    "Avoid speaking impulsively."
  ],

  bestUse:
    "Turn ideas into practical action.",

  dailyExpression:
    "A conversation today may inspire an important opportunity.",

  askSarathiExplanation:
    "The Moon links creativity with communication, encouraging learning and initiative.",

  lifeReportInterpretation:
    "Throughout life, success grows through curiosity, communication and continuous learning.",

  confidence:10,
},
"5_lord_in_4": {
  lordshipHouse:5,
  placementHouse:4,
  key:"5_lord_in_4",

  principle:
    "The 5th lord directs creativity and intelligence toward home, family and emotional wellbeing.",

  synthesis:
    "A peaceful emotional environment supports learning, creativity and wise decision-making.",

  psychology:
    "The person feels inspired when home provides encouragement, emotional safety and intellectual freedom.",

  areas:["home","family","mind","children"],

  practicalEffects:[
    "Creative work improves at home.",
    "Family discussions inspire ideas.",
    "Children require attention.",
    "Emotional clarity supports decisions."
  ],

  opportunities:[
    "Improve your home.",
    "Spend time with family.",
    "Create peacefully.",
    "Study quietly."
  ],

  cautions:[
    "Avoid emotional overthinking.",
    "Don't ignore family needs.",
    "Avoid withdrawing unnecessarily."
  ],

  bestUse:
    "Build creativity upon emotional stability.",

  dailyExpression:
    "A peaceful environment will help your ideas flourish today.",

  askSarathiExplanation:
    "The Moon links creativity with emotional security, making home an important source of inspiration.",

  lifeReportInterpretation:
    "Throughout life, emotional stability becomes the foundation for creativity and wise decisions.",

  confidence:10,
},
"5_lord_in_5": {
  lordshipHouse:5,
  placementHouse:5,
  key:"5_lord_in_5",

  principle:
    "The lord occupies its own house, strengthening intelligence, creativity, children and self-expression.",

  synthesis:
    "Creative potential, learning ability and sound judgement become natural strengths. Inspiration flows when knowledge is continuously expanded.",

  psychology:
    "The person feels happiest when expressing creativity, sharing knowledge and encouraging others to grow.",

  areas:["education","children","mind","career"],

  practicalEffects:[
    "Creative insight increases.",
    "Learning becomes rewarding.",
    "Recognition for ideas grows.",
    "Children may bring joy."
  ],

  opportunities:[
    "Teach.",
    "Create.",
    "Mentor.",
    "Study."
  ],

  cautions:[
    "Avoid pride.",
    "Don't dismiss others' ideas.",
    "Avoid unnecessary speculation."
  ],

  bestUse:
    "Use your creativity to inspire and guide others.",

  dailyExpression:
    "Today's inspiration has the potential to create lasting value.",

  askSarathiExplanation:
    "The Moon activates its own 5th house, strongly emphasizing creativity, learning and intelligent decision-making.",

  lifeReportInterpretation:
    "Throughout life, creativity, education and thoughtful leadership become defining strengths.",

  confidence:10,
},
"5_lord_in_6": {
  lordshipHouse:5,
  placementHouse:6,
  key:"5_lord_in_6",

  principle:
    "The 5th lord directs intelligence and creativity toward discipline, service and practical improvement.",

  synthesis:
    "Creative talent becomes most effective when supported by consistent effort, structured learning and disciplined execution.",

  psychology:
    "The person feels fulfilled when ideas produce practical results through patience and persistence.",

  areas:["career","health","education","mind"],

  practicalEffects:[
    "Learning improves work.",
    "Creative problem-solving becomes valuable.",
    "Routine strengthens productivity.",
    "Skills develop steadily."
  ],

  opportunities:[
    "Practice consistently.",
    "Improve routines.",
    "Learn new techniques.",
    "Help others solve problems."
  ],

  cautions:[
    "Avoid perfectionism.",
    "Don't become overly self-critical.",
    "Avoid neglecting rest."
  ],

  bestUse:
    "Transform creativity into dependable skill through discipline.",

  dailyExpression:
    "Consistent effort today can turn a good idea into real progress.",

  askSarathiExplanation:
    "The Moon links creativity with disciplined effort, rewarding steady improvement.",

  lifeReportInterpretation:
    "Throughout life, your greatest achievements come when creativity is supported by perseverance and disciplined practice.",

  confidence:10,
},
"5_lord_in_7": {
  lordshipHouse: 5,
  placementHouse: 7,
  key: "5_lord_in_7",

  principle:
    "The 5th lord directs creativity, intelligence and self-expression into partnerships and meaningful relationships.",

  synthesis:
    "Relationships thrive through intellectual connection, shared creativity and emotional generosity. Love grows when both people continue learning from one another.",

  psychology:
    "The person feels emotionally fulfilled when a relationship is both a friendship and a partnership built on mutual inspiration.",

  areas:["relationships","communication","children","mind"],

  practicalEffects:[
    "Romantic conversations become meaningful.",
    "Creative collaboration flourishes.",
    "Partners inspire new ideas.",
    "Shared hobbies strengthen relationships."
  ],

  opportunities:[
    "Create something together.",
    "Express appreciation.",
    "Share ideas openly.",
    "Strengthen emotional connection."
  ],

  cautions:[
    "Avoid unrealistic expectations.",
    "Do not seek constant validation.",
    "Avoid unnecessary ego clashes."
  ],

  bestUse:
    "Allow creativity and affection to deepen important relationships.",

  dailyExpression:
    "A meaningful interaction today may strengthen both affection and understanding.",

  askSarathiExplanation:
    "The Moon links creativity with partnerships, making emotional connection and shared inspiration today's focus.",

  lifeReportInterpretation:
    "Throughout life, your most rewarding relationships encourage creativity, learning and mutual personal growth.",

  confidence:10,
},
"5_lord_in_8": {
  lordshipHouse:5,
  placementHouse:8,
  key:"5_lord_in_8",

  principle:
    "The 5th lord directs creativity and intelligence toward transformation, research and emotional depth.",

  synthesis:
    "Ideas mature through experience. Deep study, research and introspection transform ordinary knowledge into genuine wisdom.",

  psychology:
    "The person feels fulfilled when difficult experiences become sources of insight rather than regret.",

  areas:["hiddenMatters","education","mind","spirituality"],

  practicalEffects:[
    "Research becomes productive.",
    "Creative breakthroughs emerge.",
    "Hidden information proves valuable.",
    "Intuition becomes stronger."
  ],

  opportunities:[
    "Study deeply.",
    "Research carefully.",
    "Reflect honestly.",
    "Develop specialist expertise."
  ],

  cautions:[
    "Avoid obsessive thinking.",
    "Don't fear change.",
    "Avoid emotional extremes."
  ],

  bestUse:
    "Transform experience into wisdom that benefits yourself and others.",

  dailyExpression:
    "Today's deeper understanding may completely change your perspective.",

  askSarathiExplanation:
    "The Moon links creativity with transformation, encouraging research and emotional growth.",

  lifeReportInterpretation:
    "Throughout life, your greatest insights emerge through deep reflection, research and personal transformation.",

  confidence:10,
},
"5_lord_in_9": {
  lordshipHouse:5,
  placementHouse:9,
  key:"5_lord_in_9",

  principle:
    "The 5th lord directs creativity and intelligence toward wisdom, higher learning and purpose.",

  synthesis:
    "Education, philosophy and meaningful life experiences inspire creativity and strengthen decision-making. Learning becomes a lifelong source of fulfilment.",

  psychology:
    "The person feels happiest when knowledge expands both personal understanding and the ability to guide others.",

  areas:["education","spirituality","travel","mind"],

  practicalEffects:[
    "Learning accelerates.",
    "Mentors become influential.",
    "Travel broadens perspective.",
    "Creative inspiration increases."
  ],

  opportunities:[
    "Study.",
    "Teach.",
    "Seek guidance.",
    "Travel if appropriate."
  ],

  cautions:[
    "Avoid intellectual pride.",
    "Do not ignore practical realities.",
    "Avoid becoming overly idealistic."
  ],

  bestUse:
    "Allow wisdom to shape creative expression and important decisions.",

  dailyExpression:
    "Learning something meaningful today may inspire your next important step.",

  askSarathiExplanation:
    "The Moon links creativity with wisdom and higher learning, encouraging inspired growth.",

  lifeReportInterpretation:
    "Throughout life, education and meaningful experiences become powerful sources of creativity and purpose.",

  confidence:10,
},
"5_lord_in_10": {
  lordshipHouse:5,
  placementHouse:10,
  key:"5_lord_in_10",

  principle:
    "The 5th lord directs creativity, intelligence and leadership toward career and public achievement.",

  synthesis:
    "Professional success develops through innovation, strategic thinking and the ability to inspire others through knowledge and vision.",

  psychology:
    "The person feels fulfilled when creative ideas produce visible, meaningful results in the professional world.",

  areas:["career","publicImage","education","mind"],

  practicalEffects:[
    "Creative leadership becomes valuable.",
    "Recognition for ideas increases.",
    "Professional visibility improves.",
    "Important decisions require originality."
  ],

  opportunities:[
    "Present your ideas.",
    "Lead confidently.",
    "Develop innovative solutions.",
    "Mentor colleagues."
  ],

  cautions:[
    "Avoid seeking recognition alone.",
    "Don't dismiss practical advice.",
    "Avoid unnecessary risk."
  ],

  bestUse:
    "Lead through creativity, knowledge and thoughtful decision-making.",

  dailyExpression:
    "An original idea today may significantly improve your professional standing.",

  askSarathiExplanation:
    "The Moon links creativity with career, making innovation and intelligent leadership especially important.",

  lifeReportInterpretation:
    "Throughout life, career success develops through originality, learning and the ability to inspire others.",

  confidence:10,
},
"5_lord_in_11": {
  lordshipHouse:5,
  placementHouse:11,
  key:"5_lord_in_11",

  principle:
    "The 5th lord directs creativity and intelligence toward gains, friendships and long-term ambitions.",

  synthesis:
    "Creative ideas become practical achievements through supportive networks, collaboration and long-term planning.",

  psychology:
    "The person feels happiest when talents contribute to both personal success and collective progress.",

  areas:["career","money","relationships","education"],

  practicalEffects:[
    "Ideas receive support.",
    "Networking creates opportunities.",
    "Creative projects gain momentum.",
    "Long-term goals become clearer."
  ],

  opportunities:[
    "Expand your network.",
    "Share innovative ideas.",
    "Build strategic alliances.",
    "Plan future growth."
  ],

  cautions:[
    "Avoid comparing yourself with others.",
    "Do not chase recognition alone.",
    "Avoid unrealistic expectations."
  ],

  bestUse:
    "Use creativity to build lasting opportunities and meaningful relationships.",

  dailyExpression:
    "Support from others today can help your ideas move forward.",

  askSarathiExplanation:
    "The Moon links creativity with gains and networks, encouraging collaborative growth.",

  lifeReportInterpretation:
    "Throughout life, fulfilment comes from combining creativity, friendships and meaningful long-term ambitions.",

  confidence:10,
},
"5_lord_in_12": {
  lordshipHouse:5,
  placementHouse:12,
  key:"5_lord_in_12",

  principle:
    "The 5th lord directs creativity and intelligence toward spiritual growth, solitude and inner reflection.",

  synthesis:
    "Creative inspiration often emerges in quiet moments. Reflection, meditation and compassionate service deepen both imagination and wisdom.",

  psychology:
    "The person feels most inspired when external noise fades and inner clarity is allowed to emerge naturally.",

  areas:["spirituality","mind","education","travel"],

  practicalEffects:[
    "Creative inspiration arrives quietly.",
    "Reflection improves decisions.",
    "Spiritual study becomes meaningful.",
    "Time alone restores clarity."
  ],

  opportunities:[
    "Meditate.",
    "Journal your ideas.",
    "Study spiritual subjects.",
    "Allow creativity to unfold naturally."
  ],

  cautions:[
    "Avoid escapism.",
    "Do not isolate unnecessarily.",
    "Avoid ignoring practical responsibilities."
  ],

  bestUse:
    "Use quiet reflection to transform inspiration into lasting wisdom.",

  dailyExpression:
    "A quiet moment today may produce one of your most valuable insights.",

  askSarathiExplanation:
    "The Moon links creativity with the 12th house of reflection and spiritual growth, encouraging quiet inspiration.",

  lifeReportInterpretation:
    "Throughout life, your greatest creativity often emerges through reflection, spiritual practice and deep inner awareness.",

  confidence:10,
},

};