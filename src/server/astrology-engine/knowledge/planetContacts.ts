import type { PlanetName } from "../types";

export type PlanetContactType =
  | "conjunction"
  | "aspect";

export type PlanetContactKnowledge = {
  planet: PlanetName;
  contactPlanet: PlanetName;
  contactType: PlanetContactType;

  principle: string;
  synthesis: string;
  psychology: string;

  supportiveEffects: string[];
  cautionEffects: string[];

  dailyExpression: string;
  bestUse: string;
  effect:
  | "supportive"
  | "challenging"
  | "mixed";
  confidence: number;
};

export function planetContactKey(
  planet: PlanetName,
  contactPlanet: PlanetName,
  contactType: PlanetContactType
): string {
  if (contactType === "conjunction") {
    const [first, second] = [planet, contactPlanet]
      .map((name) => name.toLowerCase())
      .sort();

    return `${first}_conjunction_${second}`;
  }

  return `${planet.toLowerCase()}_aspected_by_${contactPlanet.toLowerCase()}`;
}
export type ContactTypeKnowledge = {
  principle: string;
  effect: string;
  caution: string;
};

export const CONTACT_TYPE_KNOWLEDGE: Record<
  PlanetContactType,
  ContactTypeKnowledge
> = {
  conjunction: {
    principle:
      "A conjunction combines the functions of two planets within the same area of the chart, making their interaction direct and highly visible.",
    effect:
      "The two planetary energies operate together and modify how each planet expresses its natural qualities.",
    caution:
      "A conjunction should not automatically be judged as beneficial or difficult; the result depends on the planets involved, their dignity, house role and wider chart context.",
  },

  aspect: {
    principle:
      "An aspect allows one planet to influence another planet or the area it occupies without sharing the same sign or house.",
    effect:
      "The aspecting planet modifies, supports, pressures or redirects the expression of the planet receiving the aspect.",
    caution:
      "The effect of an aspect depends on the nature of the aspecting planet, its functional role, dignity and the condition of the planet receiving the influence.",
  },
};
export type PlanetContactInfluence = {
  influenceStyle: string;
  supportiveExpression: string;
  challengingExpression: string;
};

export const PLANET_CONTACT_INFLUENCE: Record<
  PlanetName,
  PlanetContactInfluence
> = {
  Sun: {
    influenceStyle:
      "illuminates, strengthens identity, authority and visibility",
    supportiveExpression:
      "can bring confidence, clarity, leadership and stronger expression",
    challengingExpression:
      "can increase ego, rigidity, pressure or conflict around authority",
  },

  Moon: {
    influenceStyle:
      "emotionalises, sensitises and makes the experience more personally felt",
    supportiveExpression:
      "can increase empathy, responsiveness, intuition and emotional awareness",
    challengingExpression:
      "can increase sensitivity, fluctuation, worry or emotional reactivity",
  },

  Mars: {
    influenceStyle:
      "energises, activates, pressures and pushes toward action",
    supportiveExpression:
      "can increase courage, decisiveness, initiative and competitive strength",
    challengingExpression:
      "can increase impatience, conflict, aggression or impulsive action",
  },

  Mercury: {
    influenceStyle:
      "intellectualises, analyses, communicates and increases mental activity",
    supportiveExpression:
      "can improve reasoning, communication, learning and adaptability",
    challengingExpression:
      "can increase overthinking, nervousness, indecision or excessive analysis",
  },

  Jupiter: {
    influenceStyle:
      "expands, guides, protects and adds perspective or meaning",
    supportiveExpression:
      "can increase wisdom, optimism, opportunity, learning and constructive growth",
    challengingExpression:
      "can exaggerate expectations, overconfidence or excess",
  },

  Venus: {
    influenceStyle:
      "harmonises, attracts, softens and seeks comfort or cooperation",
    supportiveExpression:
      "can improve relationships, creativity, diplomacy, enjoyment and balance",
    challengingExpression:
      "can increase indulgence, avoidance of conflict or excessive attachment to comfort",
  },

  Saturn: {
    influenceStyle:
      "slows, disciplines, structures, tests and demands responsibility",
    supportiveExpression:
      "can create maturity, endurance, discipline, stability and lasting results",
    challengingExpression:
      "can create delay, pressure, fear, restriction or emotional heaviness",
  },

  Rahu: {
    influenceStyle:
      "amplifies, intensifies, destabilises and pushes beyond conventional limits",
    supportiveExpression:
      "can increase ambition, innovation, visibility and unconventional opportunity",
    challengingExpression:
      "can increase obsession, confusion, dissatisfaction or excessive desire",
  },

  Ketu: {
    influenceStyle:
      "detaches, separates, internalises and refines through reduction",
    supportiveExpression:
      "can increase insight, discernment, independence and spiritual or analytical depth",
    challengingExpression:
      "can create disengagement, uncertainty, disconnection or lack of sustained interest",
  },
};
export type PlanetContactInterpretation =
  PlanetContactKnowledge & {
    key: string;
    curated: boolean;
  };
export function getPlanetContactInterpretation(
  planet: PlanetName,
  contactPlanet: PlanetName,
  contactType: PlanetContactType
): PlanetContactInterpretation {
  const key = planetContactKey(
    planet,
    contactPlanet,
    contactType
  );

  const curated = PLANET_CONTACTS[key];

  if (curated) {
  return {
    ...curated,

    // Preserve the actual direction/order supplied by the caller.
    // This matters even though conjunction keys are normalized.
    planet,
    contactPlanet,
    contactType,

    key,
    curated: true,
  };
}

  const contactKnowledge =
    CONTACT_TYPE_KNOWLEDGE[contactType];

  const influence =
    PLANET_CONTACT_INFLUENCE[contactPlanet];

  return {
    planet,
    contactPlanet,
    contactType,
    key,

    principle: contactKnowledge.principle,

    synthesis:
  `${contactPlanet} ${influence.influenceStyle} to the expression of ${planet}.`,

    psychology:
      `The interaction between ${planet} and ${contactPlanet} can make the themes of ${planet} more responsive to the influence of ${contactPlanet}.`,

    supportiveEffects: [
      influence.supportiveExpression,
    ],

    cautionEffects: [
      influence.challengingExpression,
    ],

    dailyExpression:
      `${contactPlanet}'s influence may noticeably modify how ${planet} expresses itself today.`,

    bestUse:
      `Use the constructive side of ${contactPlanet}'s influence while consciously managing its more difficult expression.`,
    effect: "mixed",
    confidence: 7,

    curated: false,
  };
}
export const PLANET_CONTACTS: Record<
  string,
  PlanetContactKnowledge
> = {
  jupiter_conjunction_mercury: {
    planet: "Mercury",
    contactPlanet: "Jupiter",
    contactType: "conjunction",

    principle:
      "Mercury and Jupiter together combine analytical intelligence with broader wisdom, linking detailed reasoning with knowledge, judgement and perspective.",

    synthesis:
      "Communication, learning and decision-making can benefit from the ability to connect practical details with a wider understanding of the situation.",

    psychology:
      "The mind seeks not only information but meaning, often wanting to understand how individual facts connect with larger principles or possibilities.",

    supportiveEffects: [
      "Broader and more constructive thinking",
      "Strong potential for learning, teaching and explanation",
      "Improved judgement through combining detail with perspective",
      "Useful conversations with advisers, teachers or knowledgeable people",
    ],

    cautionEffects: [
      "Overestimating how much is understood",
      "Speaking with excessive certainty",
      "Turning simple matters into lengthy explanations",
      "Allowing optimism to weaken attention to practical details",
    ],

    dailyExpression:
      "A conversation, idea or piece of information may become more useful when viewed from a broader perspective today.",

    bestUse:
      "Combine careful analysis with broader judgement before making an important decision or communicating your view.",
    effect: "supportive",
    confidence: 10,
  },
  saturn_conjunction_sun: {
  planet: "Sun",
  contactPlanet: "Saturn",
  contactType: "conjunction",

  principle:
    "Sun and Saturn together combine identity, authority and self-expression with discipline, responsibility, limitation and the demands of time.",

  synthesis:
    "Confidence and authority tend to develop through responsibility, persistence and learning how to work constructively within limits. Recognition may require sustained effort rather than immediate validation.",

  psychology:
    "There can be a strong inner tension between the desire to express oneself freely and the feeling that achievement, respect or approval must first be earned through effort and responsibility.",

  supportiveEffects: [
    "Greater discipline and seriousness of purpose",
    "Ability to carry responsibility and work toward long-term recognition",
    "Maturing leadership and authority through experience",
    "Persistence when progress requires patience",
  ],

  cautionEffects: [
    "Self-doubt or excessive concern about recognition",
    "Tension with authority figures or rigid expectations",
    "Feeling burdened by responsibility",
    "Becoming overly hard on oneself when progress is slow",
  ],

  dailyExpression:
    "A responsibility, authority matter or important commitment may require patience and a more disciplined approach today.",

  bestUse:
    "Focus on what can be built steadily rather than seeking immediate recognition or forcing results.",
  effect: "challenging",
  confidence: 10,
},
rahu_conjunction_sun: {
  planet: "Sun",
  contactPlanet: "Rahu",
  contactType: "conjunction",

  principle:
    "Sun and Rahu together combine identity, authority and visibility with amplification, ambition, unconventionality and an intensified desire for recognition.",

  synthesis:
    "The desire to establish a distinct identity or gain recognition can become unusually strong. This combination can support bold ambition, unconventional leadership and visibility, but may also distort judgement when recognition becomes more important than substance.",

  psychology:
    "There can be a powerful need to stand out, prove oneself or create an identity that feels exceptional, especially when ordinary forms of recognition seem insufficient.",

  supportiveEffects: [
    "Strong ambition and desire to achieve",
    "Ability to attract attention or visibility",
    "Willingness to pursue unconventional paths",
    "Capacity to reinvent personal or professional identity",
  ],

  cautionEffects: [
    "Excessive concern with status, validation or recognition",
    "Overestimating personal influence or authority",
    "Taking unnecessary risks to stand out",
    "Allowing ambition to override judgement or authenticity",
  ],

  dailyExpression:
    "A visibility, authority or recognition-related matter may feel more important than usual today, making it important to separate genuine opportunity from the desire to prove something.",

  bestUse:
    "Use ambition strategically, but keep decisions grounded in substance, credibility and long-term consequences rather than immediate recognition.",
  effect: "challenging",
  confidence: 10,
},
ketu_conjunction_sun: {
  planet: "Sun",
  contactPlanet: "Ketu",
  contactType: "conjunction",

  principle:
    "Sun and Ketu together combine identity, authority and self-expression with detachment, internalisation, separation and the need to refine one's sense of self.",

  synthesis:
    "External recognition may feel less satisfying or straightforward, encouraging a deeper examination of identity, purpose and authority. This combination can support independence and inner clarity, but may also create periods of uncertainty about one's role or direction.",

  psychology:
    "There can be a tendency to question conventional definitions of success, status or identity, creating a search for a sense of purpose that feels internally meaningful rather than dependent on external approval.",

  supportiveEffects: [
    "Greater independence from external validation",
    "Ability to question superficial definitions of success",
    "Potential for deeper self-awareness and introspection",
    "Capacity to simplify priorities and focus on meaningful purpose",
  ],

  cautionEffects: [
    "Uncertainty about identity, direction or recognition",
    "Withdrawal from authority or leadership responsibilities",
    "Difficulty feeling satisfied by external achievements",
    "Becoming disconnected from practical goals while searching for deeper meaning",
  ],

  dailyExpression:
    "A question involving identity, authority or recognition may encourage you to reconsider what genuinely matters rather than reacting only to external expectations today.",

  bestUse:
    "Use reflection to separate genuine purpose from the need for approval, while remaining engaged with practical responsibilities.",
  effect: "mixed",
  confidence: 10,
},
mars_conjunction_mercury: {
  planet: "Mercury",
  contactPlanet: "Mars",
  contactType: "conjunction",

  principle:
    "Mercury and Mars together combine thinking, communication and analysis with speed, assertion, decisiveness and the urge to act.",

  synthesis:
    "The mind can become quick, sharp and action-oriented, supporting fast decisions, debate, technical problem-solving and direct communication. The same speed can become impatience, argument or speaking before considering the consequences.",

  psychology:
    "There can be a strong need to think quickly, respond immediately and prove one's reasoning through action, making mental restraint as important as mental sharpness.",

  supportiveEffects: [
    "Fast thinking and decisive communication",
    "Strong problem-solving ability under pressure",
    "Technical, analytical or strategic sharpness",
    "Courage to express ideas directly",
  ],

  cautionEffects: [
    "Impatience in conversation or decision-making",
    "Arguments caused by overly sharp speech",
    "Acting before information has been fully assessed",
    "Mental restlessness or excessive competitiveness",
  ],

  dailyExpression:
    "A conversation, decision or practical problem may require quick thinking today, but the best result will come from balancing speed with precision.",

  bestUse:
    "Use mental sharpness for problem-solving and decisive action, while pausing long enough to avoid unnecessary conflict or rushed judgement.",

  effect: "mixed",
  confidence: 10,
},
mercury_conjunction_rahu: {
  planet: "Mercury",
  contactPlanet: "Rahu",
  contactType: "conjunction",

  principle:
    "Mercury and Rahu together combine intelligence, communication and analysis with amplification, unconventional thinking, curiosity and an intensified desire for information or mental stimulation.",

  synthesis:
    "The mind can become highly curious, inventive and capable of seeing unusual connections or unconventional solutions. At the same time, excessive information, speculation or mental intensity can make it harder to separate useful insight from distraction or assumption.",

  psychology:
    "There can be a strong need to understand what is unusual, complex or unexplored, with the mind continually searching for new information, explanations and possibilities.",

  supportiveEffects: [
    "Innovative and unconventional thinking",
    "Strong curiosity and information-gathering ability",
    "Ability to identify unusual patterns or opportunities",
    "Adaptability in rapidly changing situations",
  ],

  cautionEffects: [
    "Overthinking or excessive mental stimulation",
    "Confusion caused by too much information",
    "Treating assumptions or speculation as established facts",
    "Manipulative, exaggerated or unnecessarily complicated communication",
  ],

  dailyExpression:
    "An unusual idea, conversation or piece of information may attract your attention today, but it will be important to verify facts before drawing conclusions.",

  bestUse:
    "Use curiosity to explore new possibilities while separating verified information from speculation and mental noise.",
  effect: "mixed",
  confidence: 10,
},
saturn_conjunction_venus: {
  planet: "Venus",
  contactPlanet: "Saturn",
  contactType: "conjunction",

  principle:
    "Venus and Saturn together combine relationships, harmony, attraction, comfort and values with commitment, responsibility, restraint, endurance and the influence of time.",

  synthesis:
    "Relationships, agreements and material priorities tend to be approached more seriously. This combination can support loyalty, durability and long-term value, while also creating caution, delay or emotional reserve when security feels uncertain.",

  psychology:
    "There can be a strong need for reliability and lasting value in relationships and commitments, making trust something that is often built gradually through consistency rather than immediate emotional openness.",

  supportiveEffects: [
    "Loyalty and seriousness in relationships",
    "Ability to build durable partnerships and agreements",
    "Practical judgement around money, comfort and material priorities",
    "Patience in developing something of lasting value",
  ],

  cautionEffects: [
    "Emotional reserve or difficulty expressing affection freely",
    "Fear of rejection, disappointment or instability",
    "Remaining in situations primarily because of duty or security",
    "Allowing caution to limit enjoyment, connection or openness",
  ],

  dailyExpression:
    "A relationship, financial matter or commitment may require a more serious and practical approach today, with long-term reliability mattering more than immediate comfort.",

  bestUse:
    "Strengthen what has genuine long-term value through consistency, realistic expectations and responsible commitment.",
  effect: "mixed",
  confidence: 10,
},
rahu_conjunction_venus: {
  planet: "Venus",
  contactPlanet: "Rahu",
  contactType: "conjunction",

  principle:
    "Venus and Rahu together combine relationships, attraction, pleasure, comfort and values with amplification, desire, novelty and unconventional experience.",

  synthesis:
    "Attraction, relationships, material desires or aesthetic interests can become unusually intense. This combination can support creativity, magnetism and unconventional opportunities, but may also increase dissatisfaction, excess or the tendency to chase what appears more exciting than what is genuinely valuable.",

  psychology:
    "There can be a strong desire for experiences, relationships or comforts that feel distinctive, exciting or different from the ordinary, with satisfaction sometimes becoming difficult to sustain once novelty fades.",

  supportiveEffects: [
    "Strong attraction, charm or social magnetism",
    "Creative experimentation and unusual aesthetic sense",
    "Openness to unconventional relationships or opportunities",
    "Ability to recognise emerging tastes, trends or desires",
  ],

  cautionEffects: [
    "Excessive attachment to pleasure, attention or validation",
    "Dissatisfaction even when circumstances are objectively supportive",
    "Idealising relationships, luxuries or appearances",
    "Impulsive choices driven by attraction, novelty or desire",
  ],

  dailyExpression:
    "A relationship, attraction, purchase or social opportunity may feel unusually compelling today, making it important to distinguish genuine value from temporary excitement.",

  bestUse:
    "Enjoy creativity and new possibilities, but make important choices according to lasting value rather than intensity or novelty alone.",
  effect: "mixed",
  confidence: 10,
},
mars_conjunction_saturn: {
  planet: "Mars",
  contactPlanet: "Saturn",
  contactType: "conjunction",

  principle:
    "Mars and Saturn together combine action, courage and initiative with discipline, restraint, responsibility and endurance.",

  synthesis:
    "The urge to act meets the need for control, patience and structure. This combination can produce exceptional persistence and disciplined effort when the two energies cooperate, but frustration can develop when action feels blocked, delayed or excessively restricted.",

  psychology:
    "There can be tension between wanting immediate movement and recognising that circumstances require patience, discipline or sustained effort, creating an important lesson in controlled action.",

  supportiveEffects: [
    "Strong endurance and persistence",
    "Ability to work steadily under pressure",
    "Disciplined and controlled use of energy",
    "Capacity to handle demanding or long-term tasks",
  ],

  cautionEffects: [
    "Frustration when progress is slow or restricted",
    "Suppressed anger followed by sudden reactions",
    "Becoming overly forceful when facing resistance",
    "Exhaustion from pushing continuously against limitations",
  ],

  dailyExpression:
    "Progress may require more effort or patience than expected today, but disciplined action can produce more reliable results than forcing immediate movement.",

  bestUse:
    "Direct energy into structured effort, accept necessary limits and focus on sustained progress rather than immediate results.",
  effect: "challenging",
  confidence: 10,
},
mars_conjunction_rahu: {
  planet: "Mars",
  contactPlanet: "Rahu",
  contactType: "conjunction",

  principle:
    "Mars and Rahu together combine action, courage, competition and assertion with amplification, ambition, unconventionality and an intensified desire to overcome limits.",

  synthesis:
    "Drive and ambition can become unusually strong, creating the capacity for bold action, competitive breakthroughs and unconventional problem-solving. The same intensity can increase impatience, conflict or unnecessary risk when the desire to achieve outruns judgement.",

  psychology:
    "There can be a powerful need to act, compete or break through obstacles, with resistance often increasing determination rather than reducing it.",

  supportiveEffects: [
    "Strong ambition and competitive drive",
    "Courage to take on difficult or unconventional challenges",
    "Ability to act decisively in rapidly changing situations",
    "Determination to overcome obstacles or resistance",
  ],

  cautionEffects: [
    "Impulsive or unnecessarily risky action",
    "Escalating conflict when challenged",
    "Obsession with winning or proving oneself",
    "Acting before consequences have been properly assessed",
  ],

  dailyExpression:
    "A challenge, competition or ambitious opportunity may create a strong urge to act today, but calculated action will be more effective than reacting purely from intensity.",

  bestUse:
    "Channel ambition into a clearly defined objective, assess the risks first and use intensity strategically rather than impulsively.",
  effect: "challenging",
  confidence: 10,
},
jupiter_conjunction_saturn: {
  planet: "Jupiter",
  contactPlanet: "Saturn",
  contactType: "conjunction",

  principle:
    "Jupiter and Saturn together combine expansion, wisdom and opportunity with discipline, structure, responsibility and the influence of time.",

  synthesis:
    "Growth tends to work best when opportunity is supported by planning, patience and realistic structure. This combination can turn knowledge and long-term vision into durable results, while tension can arise between the desire to expand and the need to proceed cautiously.",

  psychology:
    "There can be an ongoing effort to balance optimism with realism, encouraging the person to test larger possibilities against practical limits before committing to them.",

  supportiveEffects: [
    "Ability to combine vision with practical planning",
    "Patient and sustainable long-term growth",
    "Mature judgement based on both opportunity and risk",
    "Capacity to turn knowledge or experience into durable results",
  ],

  cautionEffects: [
    "Hesitation caused by conflict between optimism and caution",
    "Expanding before adequate structure is in place",
    "Becoming overly conservative when opportunities appear",
    "Frustration when meaningful growth takes longer than expected",
  ],

  dailyExpression:
    "A long-term opportunity, responsibility or important decision may benefit from balancing optimism with realistic planning today.",

  bestUse:
    "Think beyond immediate circumstances, but support expansion with structure, patience and a realistic assessment of what can be sustained.",
  effect: "mixed",
  confidence: 10,
},
};