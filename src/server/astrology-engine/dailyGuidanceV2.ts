import type {
  PersonalizedDailyPredictionInput,
  generatePersonalizedDailyPrediction,
} from "./personalizedDailyPredictionGenerator";

import {
  EVENT_JUDGEMENT_RULES,
} from "./knowledge/eventJudgementRules";

import { EVENT_THEMES } from "./knowledge/eventThemes";

import {
  resolveDashaActivation,
} from "./knowledge/dashaActivation";

import {
  getNakshatraPadaData,
} from "./knowledge/nakshatraPadaData";

import {
  resolveUnifiedEventJudgement,
  type UnifiedJudgementInput,
} from "./judgement/eventUnifiedJudgement";

import {
  buildTemporalEventSnapshot,
  resolveTemporalEventWindow,
} from "./judgement/eventTemporalResolution";

import {
  resolveEventCompetition,
} from "./judgement/eventCompetitionResolver";

import {
  resolveFinancialCompetition,
} from "./judgement/eventFinancialCompetition";

import {
  buildMoonThemeGuidance,
  type DailyPredictionTheme,
} from "./judgement/dailyPredictionEngine";

import type { PlanetName, LifeArea } from "./types";

import {
  contextualPlanetTheme,
  contextualLunarKnowledge,
  contextualVariant,
} from "./narrative/dailyContextualLibrary";
import { resolveContextualSituation } from "./narrative/dailySituationLibrary";

type LegacyPrediction =
  ReturnType<typeof generatePersonalizedDailyPrediction>;

type ReinforcementInput = Pick<
  UnifiedJudgementInput,
  "shadbala" | "afflictions" | "ashtakvarga"
>;

type TemporalRow =
  ReturnType<typeof resolveTemporalEventWindow>[number];

const PLANETS = new Set<string>([
  "Sun", "Moon", "Mars", "Mercury",
  "Jupiter", "Venus", "Saturn", "Rahu", "Ketu",
]);

function planet(value: unknown): PlanetName | null {
  return typeof value === "string" &&
    PLANETS.has(value)
    ? value as PlanetName
    : null;
}

export function guidanceDateOffset(
  date: string,
  offset: number
): string {
  const value = new Date(`${date}T00:00:00Z`);

  if (!Number.isFinite(value.getTime())) {
    throw new Error("Invalid guidance date.");
  }

  value.setUTCDate(value.getUTCDate() + offset);

  return value.toISOString().slice(0, 10);
}

const EVENT_GUIDANCE: Record<
  string,
  readonly [string, string, string]
> = {
  career_movement: [
    "A professional discussion or pending work matter may move forward.",
    "Follow up on an existing professional opportunity.",
    "Avoid assuming that discussion means approval.",
  ],
  career_interview_invitation: [
    "Communication about a job opportunity is a possible development today, such as an interview invitation, scheduling request or discussion with a recruiter.",
    "Check pending applications and professional correspondence.",
    "Avoid treating an informal discussion as a confirmed interview.",
  ],
  career_job_offer: [
    "An employment opportunity may progress towards a decision, including a discussion about compensation, joining arrangements or offer terms.",
    "Review any terms or commitments carefully.",
    "Avoid assuming an offer exists before receiving confirmation.",
  ],
  career_responsibility: [
    "A task, decision or additional responsibility may require your involvement.",
    "Clarify ownership and deadlines.",
    "Avoid accepting unclear commitments.",
  ],
  career_recognition: [
    "Your contribution may become more visible through feedback or a discussion.",
    "Document your achievements and communicate progress.",
    "Avoid depending on immediate recognition.",
  ],
  career_change: [
    "A discussion about your role, working arrangements or professional direction may develop.",
    "Evaluate existing options before committing.",
    "Avoid impulsive career decisions.",
  ],
  workload_service: [
    "Pending tasks or operational responsibilities may demand extra attention.",
    "Prioritise the most important outstanding task.",
    "Avoid taking on unnecessary work.",
  ],
  money_inflow: [
    "Watch for an update concerning money you are expecting, such as a payment, reimbursement or pending receipt. An update does not necessarily mean the funds have arrived.",
    "Review pending receipts and payment confirmations.",
    "Avoid spending money that has not been received.",
  ],
  money_outflow: [
    "A bill, purchase or existing financial obligation may require attention.",
    "Review planned expenditure and available funds.",
    "Avoid unnecessary financial commitments.",
  ],
  money_planning: [
    "A financial discussion, budget review or payment arrangement may become relevant.",
    "Review your budget and upcoming commitments.",
    "Avoid decisions based on incomplete information.",
  ],
  money_accumulation: [
    "Savings, retained funds or a longer-term financial objective may receive attention.",
    "Review your savings plan and existing commitments.",
    "Avoid assuming investment returns are guaranteed.",
  ],
  money_settlement: [
    "An outstanding payment or reimbursement may become a subject of discussion, particularly regarding its amount, timing or remaining requirements.",
    "Check documents and confirm the status of pending payments.",
    "Avoid assuming a settlement has been completed.",
  ],
  relationship_attention: [
    "An interaction with someone important to you may require more attention.",
    "Make time for a constructive conversation.",
    "Avoid making assumptions about others.",
  ],
  relationship_harmony: [
    "A shared activity or conversation may offer an opportunity for cooperation.",
    "Make time for a positive interaction.",
    "Avoid overlooking the other person's perspective.",
  ],
  relationship_discussion: [
    "A meaningful conversation may help clarify an existing interpersonal matter.",
    "Express your expectations clearly and listen carefully.",
    "Avoid reacting before understanding the situation.",
  ],
  relationship_tension: [
    "Different expectations may create friction in an interpersonal interaction.",
    "Clarify misunderstandings calmly.",
    "Avoid escalating a disagreement.",
  ],
  relationship_commitment: [
    "A discussion about the future or responsibilities of a relationship may become relevant.",
    "Discuss expectations openly.",
    "Avoid making commitments under pressure.",
  ],
  children_attention: [
    "A child's routine, activity or requirement may need your attention.",
    "Check whether practical support is needed.",
    "Avoid assuming what the child needs without asking.",
  ],
  children_progress: [
    "A child's learning, activity or personal progress may become a topic of discussion.",
    "Recognise effort and encourage progress.",
    "Avoid unnecessary comparisons.",
  ],
  children_responsibility: [
    "A child's schedule, school activity or practical requirement may need coordination.",
    "Review upcoming responsibilities.",
    "Avoid overloading the child's schedule.",
  ],
  children_concern: [
    "An existing matter concerning a child may benefit from closer attention.",
    "Listen and check the actual circumstances.",
    "Avoid assuming that a problem will occur.",
  ],
  children_milestone: [
    "You may receive an update or have a conversation about a child's progress, such as school performance, an assessment or a personal achievement.",
    "Encourage preparation and recognise effort.",
    "Avoid placing pressure on a particular outcome.",
  ],
  education_focus: [
    "A lesson, assignment or learning objective may require concentrated effort.",
    "Set aside uninterrupted time for learning.",
    "Avoid switching repeatedly between tasks.",
  ],
  education_progress: [
    "Feedback on completed work, an assessment or progress with a subject may help clarify the next stage of learning.",
    "Review completed work and identify the next step.",
    "Avoid assuming results before receiving them.",
  ],
  education_challenge: [
    "A difficult topic, assignment or competing learning demand may require extra effort.",
    "Break the task into smaller steps and ask for help if needed.",
    "Avoid rushing through unfamiliar material.",
  ],
  home_change: [
    "A change to household routines, living arrangements or the use of space at home may become a topic of discussion.",
    "Review practical arrangements with those involved.",
    "Avoid unnecessary disruption.",
  ],
  home_attention: [
    "A household task, repair or domestic arrangement may need attention.",
    "Address one outstanding practical requirement.",
    "Avoid postponing essential household tasks.",
  ],
  home_stability: [
    "Organising household arrangements may help create a more settled environment.",
    "Complete a pending domestic task.",
    "Avoid creating unnecessary commitments.",
  ],
  family_responsibility: [
    "A family obligation or shared responsibility may need coordination.",
    "Clarify what support is required.",
    "Avoid accepting every responsibility yourself.",
  ],
  family_support: [
    "A family conversation or shared task may offer an opportunity for practical support.",
    "Offer help where it is genuinely needed.",
    "Avoid assuming everyone has the same expectations.",
  ],
  family_discussion: [
    "A family conversation may help clarify a pending decision, shared responsibility or household arrangement.",
    "Discuss practical details openly.",
    "Avoid leaving important arrangements unclear.",
  ],
  family_tension: [
    "Competing family expectations or responsibilities may require careful communication.",
    "Listen before responding.",
    "Avoid turning a practical disagreement into a personal conflict.",
  ],
  property_attention: [
    "A housing arrangement, property document or maintenance requirement may need attention.",
    "Review relevant documents and obligations.",
    "Avoid commitments without checking the details.",
  ],
  property_progress: [
    "A pending property enquiry may progress through a document request, administrative update or negotiation.",
    "Follow up on pending documentation.",
    "Avoid assuming a transaction is confirmed.",
  ],
  property_complication: [
    "A property-related obligation or administrative detail may require further review.",
    "Check documentation and contractual requirements.",
    "Avoid rushing into an agreement.",
  ],
  travel_planning: [
    "A journey, appointment or travel arrangement may require preparation.",
    "Confirm timings and practical arrangements.",
    "Avoid leaving essential preparations until the last minute.",
  ],
  travel_movement: [
    "A journey, appointment or visit outside your usual routine may become more relevant today. Check whether existing travel plans are moving forward.",
    "Check your itinerary and allow sufficient time.",
    "Avoid assuming that an unconfirmed journey will take place.",
  ],
  travel_disruption: [
    "Travel arrangements may benefit from additional flexibility.",
    "Confirm schedules and allow extra time.",
    "Avoid relying on unconfirmed arrangements.",
  ],
  communication_activity: [
    "Messages, calls or correspondence may require more attention.",
    "Respond to important outstanding communications.",
    "Avoid reacting to every notification.",
  ],
  communication_clarity: [
    "A conversation or written exchange may help clarify an outstanding question.",
    "Ask specific questions and confirm important details.",
    "Avoid ambiguous instructions.",
  ],
  communication_friction: [
    "An unclear message or differing interpretation may require clarification.",
    "Confirm the intended meaning before responding.",
    "Avoid escalating misunderstandings.",
  ],
  mental_pressure: [
    "Competing tasks or expectations may make concentration more demanding.",
    "Prioritise tasks and take regular breaks.",
    "Avoid overloading your schedule.",
  ],
  emotional_stability: [
    "A calmer routine or supportive interaction may help you feel more settled.",
    "Make time for activities that help you relax.",
    "Avoid unnecessary distractions.",
  ],
  health_attention: [
    "Your everyday wellbeing and routine may benefit from additional attention.",
    "Prioritise sleep, hydration and appropriate rest.",
    "Do not use astrology to diagnose symptoms or delay medical care.",
  ],
  spiritual_practice: [
    "A familiar spiritual or reflective practice may feel particularly relevant.",
    "Make time for a practice you find meaningful.",
    "Avoid turning spiritual practice into an obligation.",
  ],
  spiritual_introspection: [
    "An existing concern may benefit from quiet reflection.",
    "Set aside time to reflect without distractions.",
    "Avoid drawing conclusions from temporary feelings.",
  ],
  spiritual_learning: [
    "Reading, reflection or philosophical learning may hold your attention.",
    "Explore a subject that interests you.",
    "Avoid accepting unfamiliar claims without consideration.",
  ],
  spiritual_detachment: [
    "Reducing distractions may help you reconsider an existing concern.",
    "Make time for quiet reflection.",
    "Avoid withdrawing from necessary responsibilities.",
  ],
  spiritual_guidance: [
    "A meaningful conversation or reflective practice may offer a different perspective.",
    "Seek guidance from a trusted source if useful.",
    "Avoid surrendering personal judgement.",
  ],
  hidden_matters_revelation: [
    "An overlooked detail in an existing matter may deserve closer review.",
    "Check facts and available information.",
    "Avoid assuming someone is concealing information.",
  ],
  hidden_matters_introspection: [
    "A private concern or unresolved question may invite further reflection.",
    "Consider the facts before deciding how to respond.",
    "Avoid dwelling on unsupported assumptions.",
  ],
  hidden_matters_complication: [
    "An unresolved detail or incomplete information may require careful attention.",
    "Verify the relevant facts.",
    "Avoid interpreting uncertainty as evidence of wrongdoing.",
  ],
  public_image_visibility: [
    "Your participation or contribution may receive greater attention from others.",
    "Communicate clearly and participate constructively.",
    "Avoid unnecessary attention-seeking.",
  ],
  public_image_recognition: [
    "Feedback or acknowledgement of your contribution may become relevant.",
    "Recognise progress and respond constructively.",
    "Avoid depending on external approval.",
  ],
  public_image_pressure: [
    "Expectations from others may require a measured response.",
    "Clarify what is reasonably expected of you.",
    "Avoid reacting impulsively to criticism.",
  ],
};

const DAILY_SITUATIONS: Partial<Record<
  LifeArea,
  readonly [string, string, string]
>> = {
  career: [
    "A pending work discussion, decision or professional responsibility may require a follow-up.",
    "Check outstanding correspondence and clarify the next step.",
    "Avoid treating a discussion as a confirmed decision.",
  ],
  money: [
    "A payment, purchase, budget or financial commitment may become a subject of discussion.",
    "Check amounts, due dates and outstanding arrangements.",
    "Avoid assuming whether money will arrive or leave.",
  ],
  family: [
    "A family conversation may centre on practical arrangements or shared responsibilities.",
    "Clarify what needs to be organised.",
    "Avoid making assumptions about family expectations.",
  ],
  relationships: [
    "A conversation or shared decision may require clarification.",
    "Discuss expectations and listen carefully.",
    "Avoid interpreting silence as disagreement.",
  ],
  travel: [
    "An appointment, journey or arrangement outside your usual routine may need coordination.",
    "Confirm timings and existing arrangements.",
    "Avoid assuming a journey is confirmed.",
  ],
  spirituality: [
    "A conversation, reading or familiar practice may help you reconsider a question that has been occupying your attention.",
    "Apply any useful insight to an existing concern.",
    "Avoid withdrawing from practical responsibilities.",
  ],
  communication: [
    "An outstanding message, document or conversation may need a response or clarification.",
    "Check important correspondence and confirm details.",
    "Avoid responding before understanding the request.",
  ],
  education: [
    "A subject, assignment or unresolved question may require further investigation or feedback.",
    "Identify the next practical step in your learning.",
    "Avoid proceeding on incomplete information.",
  ],
};

const DAILY_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

function dailyLongitude(
  sign: string,
  degree: number | undefined
): number | null {
  const index = DAILY_SIGNS.indexOf(sign);

  if (
    index < 0 ||
    typeof degree !== "number" ||
    !Number.isFinite(degree) ||
    degree < 0 ||
    degree >= 30
  ) {
    return null;
  }

  return index * 30 + degree;
}

function dailyPlanetaryContact(
  current: PersonalizedDailyPredictionInput,
  relevantPlanets: readonly PlanetName[]
) {
  const moon = current.sky.moon;

  const moonLongitude = dailyLongitude(
    moon.sign,
    moon.degree
  );

  if (moonLongitude === null) return null;

  const contacts: {
    planet: PlanetName;
    orb: number;
    type: "conjunction" | "opposition";
  }[] = [];

  for (const planet of new Set(relevantPlanets)) {
    if (planet === "Moon") continue;

    const position = current.sky.planets?.[planet];
    if (!position) continue;

    const longitude = dailyLongitude(
      position.sign,
      position.degree
    );

    if (longitude === null) continue;

    const difference = Math.abs(
      moonLongitude - longitude
    );

    const separation = Math.min(
      difference,
      360 - difference
    );

    const conjunctionOrb = separation;
    const oppositionOrb = Math.abs(180 - separation);

    const orb = Math.min(
      conjunctionOrb,
      oppositionOrb
    );

    if (orb <= 3) {
      contacts.push({
        planet,
        orb,
        type: conjunctionOrb <= oppositionOrb
          ? "conjunction"
          : "opposition",
      });
    }
  }

  return contacts.sort(
    (a, b) => a.orb - b.orb ||
      a.planet.localeCompare(b.planet)
  )[0] ?? null;
}

const DAILY_AREA_EXPRESSION: Partial<Record<
  LifeArea,
  readonly [string, string, string]
>> = {
  career: [
    "Pending decisions, professional correspondence or responsibilities could become more relevant.",
    "Progress may depend on clarifying expectations with the people involved.",
    "An existing work matter may benefit from a more definite next step.",
  ],
  money: [
    "The emphasis may fall on planned expenditure, pending payments or the use of available funds.",
    "Financial discussions may require a clearer understanding of amounts and commitments.",
    "Existing monetary arrangements may deserve another review before you proceed.",
  ],
  relationships: [
    "Shared expectations and individual priorities may need to be brought into balance.",
    "A conversation could help clarify what each person needs from the situation.",
    "Practical cooperation may matter more than immediate agreement.",
  ],
  children: [
    "This could involve school activities, personal development or an upcoming responsibility.",
    "A conversation may help you understand where encouragement or practical support is needed.",
    "Pay attention to progress that may not yet have produced a visible result.",
  ],
  education: [
    "Understanding a difficult concept or resolving an outstanding question may become important.",
    "Feedback or further investigation could help clarify the next stage.",
    "Applying existing knowledge may prove more useful than starting something entirely new.",
  ],
  home: [
    "Household arrangements, maintenance or everyday domestic requirements may become relevant.",
    "Coordinating practical details with others could make the situation easier to manage.",
    "An unfinished domestic task may benefit from renewed attention.",
  ],
  family: [
    "This may involve household plans, family requirements or decisions affecting more than one person.",
    "A constructive discussion could help clarify how responsibilities should be shared.",
    "Existing arrangements may need to be reconsidered in light of current requirements.",
  ],
  property: [
    "The situation may involve documentation, maintenance or an existing housing arrangement.",
    "Clarifying practical or administrative requirements could help establish the next step.",
    "Reviewing an outstanding detail may be more useful than making a fresh commitment.",
  ],
  travel: [
    "Timings, appointments or arrangements involving movement may need closer coordination.",
    "A change in practical requirements could influence how existing plans are organised.",
    "Confirming outstanding details may help avoid unnecessary inconvenience.",
  ],
  communication: [
    "An outstanding message, document or exchange of information may become relevant.",
    "The way information is communicated could influence how the situation develops.",
    "Clarifying an earlier conversation may help resolve uncertainty.",
  ],
  mind: [
    "Several responsibilities or unresolved questions may compete for your attention.",
    "Separating immediate requirements from longer-term concerns could help restore perspective.",
    "A more organised approach may make existing demands easier to manage.",
  ],
  health: [
    "Everyday routines, rest and the balance between activity and recovery deserve attention.",
    "Consider whether your existing schedule allows enough time for ordinary wellbeing needs.",
    "Keep practical wellbeing decisions grounded in your actual circumstances.",
  ],
  spirituality: [
    "A familiar teaching, personal belief or reflective practice may offer a different perspective.",
    "Reflection may help you reconsider how you approach an existing practical concern.",
    "The emphasis is on applying personal understanding rather than expecting an external sign.",
  ],
  hiddenMatters: [
    "Incomplete information or an overlooked detail may require further investigation.",
    "Distinguishing established facts from assumptions could help clarify the situation.",
    "An unanswered question may benefit from patient observation rather than immediate conclusions.",
  ],
  publicImage: [
    "Feedback, visibility or expectations from others may become more relevant.",
    "How you communicate your contribution could influence the response you receive.",
    "Demonstrating the quality of your work may be more useful than seeking immediate recognition.",
  ],
};

function enrichDailyNarrative(params: {
  prediction: string;
  area: LifeArea;
  row: TemporalRow;
  contact: ReturnType<typeof dailyPlanetaryContact>;
  current: PersonalizedDailyPredictionInput;
  ambiguous: boolean;
}): string {
  const {
    area, row, contact, current, ambiguous,
  } = params;

  const base = params.prediction
    .replace(
      /^An existing matter may still need your attention\.\s*/,
      ""
    )
    .replace(
      /^An existing learning objective may need further attention\.\s*/,
      ""
    )
    .trim();

  if (
    typeof current.age !== "number" ||
    !Number.isFinite(current.age) ||
    current.age < 18
  ) {
    return base;
  }

  const lunar = contextualLunarKnowledge(
    current.sky.moon.siderealLongitude
  );

  const influence = row.trigger.qualified
    ? contact?.planet ??
      row.trigger.strongest?.planet ??
      null
    : null;

  const context = influence
    ? contextualPlanetTheme(area, influence)
    : null;

  const contextualOpening =
    resolveContextualSituation(area, influence);

  const openingAlreadyContextual =
    contextualOpening !== null &&
    base === contextualOpening;

  const key = [
    current.profileKey,
    current.selectedDateISO,
    area,
    row.eventId,
    row.stage,
    influence,
    lunar?.nakshatra,
    lunar?.pada,
  ].join("|");

  const ignored = new Set([
    "the", "and", "for", "with", "may",
    "your", "you", "that", "this", "from",
    "into", "about", "more", "help",
    "could", "should", "would", "through",
    "existing", "today", "further",
    "attention", "consider", "matter",
    "important", "useful", "practical",
    "situation", "become", "require",
  ]);

  function words(value: string): Set<string> {
    return new Set(
      value.toLowerCase()
        .replace(/[^a-z\s]/g, " ")
        .split(/\s+/)
        .filter(word => word.length > 3)
        .map(word =>
          word.replace(/(?:ing|ed|s)$/, "")
        )
        .filter(word => !ignored.has(word))
    );
  }

  function overlaps(
    first: string,
    second: string
  ): boolean {
    const a = words(first);
    const b = words(second);

    if (!a.size || !b.size) return false;

    const common = [...b]
      .filter(word => a.has(word)).length;

    return common /
      Math.min(a.size, b.size) >= 0.45;
  }

  const sentences: string[] = [base];

  function append(candidate: string): boolean {
    const clean = candidate.trim();

    if (!clean) return false;

    if (
      sentences.some(
        sentence => overlaps(sentence, clean)
      )
    ) {
      return false;
    }

    const totalWords = [
      ...sentences, clean,
    ].join(" ").split(/\s+/).length;

    if (totalWords > 60) return false;

    sentences.push(
      /[.!?]$/.test(clean)
        ? clean
        : clean + "."
    );

    return true;
  }

  // Do not describe the same planetary influence
  // twice when it already determines the opening.

  if (
    context &&
    !openingAlreadyContextual &&
    !overlaps(base, context)
  ) {
    append(
      contextualVariant(key + "|context", [
        "Pay particular attention to " +
          context + ".",
        "A useful consideration is " +
          context + ".",
        "Give priority to " +
          context + ".",
      ])
    );
  }

  // Use the lunar pada as practical guidance,
  // not as an additional unsupported event claim.

  if (
    row.trigger.qualified &&
    lunar?.knowledge?.primaryAreas.includes(area)
  ) {
    const styles =
      lunar.interpretation?.actionStyles ?? [];

    const safeStyles = styles.filter(style =>
      !/\b(invest|borrow|lend|diagnos|medicat|treat|cure|purchase|resign|divorce)\w*/i
        .test(style)
    );

    if (safeStyles.length) {
      const preferred = contextualVariant(
        key + "|pada-action",
        safeStyles
      );

      const candidates = [
        preferred,
        ...safeStyles.filter(
          style => style !== preferred
        ),
      ];

      for (const candidate of candidates) {
        if (append(candidate)) break;
      }
    }
  }

  // Add a complementary area expression only
  // when it contributes something different.

  if (sentences.length === 1) {
    const expressions =
      DAILY_AREA_EXPRESSION[area];

    if (expressions) {
      const preferred = ambiguous
        ? 1
        : row.newDailyExpression ? 0 : 2;

      const candidates = [
        expressions[preferred],
        ...expressions.filter(
          (_, index) => index !== preferred
        ),
      ];

      for (const candidate of candidates) {
        if (append(candidate)) break;
      }
    }
  }

  return sentences.join(" ");
}

const GUIDANCE_EVENT_TITLES: Record<string, string> = {
  education_progress: "Learning and intellectual progress",
  family_discussion: "Family conversations and decisions",
  career_interview_invitation: "Possible interview communication",
  career_job_offer: "Progress on a job opportunity",
  money_inflow: "Expected payments and receipts",
  money_outflow: "Expenses and financial commitments",
  money_settlement: "Pending payments and settlements",
  property_progress: "Progress on a property matter",
  travel_movement: "Travel or movement",
  children_milestone: "A child's progress or achievement",
  relationship_discussion: "An important conversation",
};

function adaptYoungGuidance(
  theme: DailyPredictionTheme
): DailyPredictionTheme {
  if (theme.area === "family") {
    if (theme.manifestationId === "family_discussion") {
      return {
        ...theme,
        manifestationLabel: "A family conversation",
        prediction:
          "A conversation with your parents or family may help you understand a plan, activity or something happening at home.",
        action:
          "Share your thoughts and ask questions if something is unclear.",
        avoid:
          "Avoid worrying about decisions that adults need to make.",
      };
    }

    return {
      ...theme,
      prediction:
        "Time with family or a conversation about your daily routine may deserve attention.",
      action:
        "Talk openly with a parent or trusted adult.",
      avoid:
        "Avoid feeling responsible for solving adult concerns.",
    };
  }

  if (theme.area === "education") {
    if (theme.manifestationId === "education_progress") {
      return {
        ...theme,
        manifestationLabel: "Progress in learning",
        prediction:
          "A school subject, assignment or skill you have been practising may become easier to understand.",
        action:
          "Review what you have learned and practise the next step.",
        avoid:
          "Avoid comparing your progress with other children.",
      };
    }

    return {
      ...theme,
      prediction:
        "A school subject, assignment or something you are learning may need extra attention today.",
      action:
        "Work through one topic at a time and ask for help if needed.",
      avoid:
        "Avoid rushing or putting unnecessary pressure on yourself.",
    };
  }

  return theme;
}

export function ensureAgeSafeGuidance(
  prediction: LegacyPrediction,
  age: number | undefined
): LegacyPrediction {

  if (
    typeof age === "number" &&
    Number.isFinite(age) &&
    age >= 18
  ) {
    return prediction;
  }

  const blocked = new Set<string>([
    "career", "money", "children", "property",
  ]);

  const themes = [
    prediction.primaryTheme,
    ...prediction.secondaryThemes,
  ].filter((theme): theme is DailyPredictionTheme =>
    theme != null &&
    !blocked.has(theme.area) &&
    theme.manifestationId !== "relationship_commitment"
  );

  const safeThemes = themes.map(adaptYoungGuidance).map(theme => {

    if (theme.area !== "relationships") {
      return theme;
    }

    return {
      ...theme,
      manifestationId: null,
      manifestationLabel: null,
      manifestationDescription: null,
      manifestationScore: 0,
      prediction:
        "A conversation or shared activity with friends, classmates or family may need attention.",
      action:
        "Listen carefully and ask a trusted adult for help if needed.",
      avoid:
        "Avoid reacting immediately to misunderstandings.",
    };
  });

  const primary: DailyPredictionTheme = safeThemes[0]
    ? {
        ...safeThemes[0],
        role: "primary",
      }
    : {
        area: "mind",
        polarity: "neutral",
        manifestationId: null,
        manifestationLabel: null,
        manifestationDescription: null,
        prediction:
          "Focus on everyday activities and give yourself time to organise your thoughts.",
        action:
          "Complete one task at a time and ask for support when needed.",
        avoid:
          "Avoid putting unnecessary pressure on yourself.",
        priorityScore: 0,
        manifestationScore: 0,
        role: "primary",
      };

  const secondary: DailyPredictionTheme[] =
    safeThemes.slice(1, 3).map(theme => ({
      ...theme,
      role: "secondary",
    }));

  const primaryChanged =
    primary.area !== prediction.primaryTheme?.area ||
    primary.manifestationId !==
      prediction.primaryTheme?.manifestationId;

  return {
    ...prediction,
    primaryTheme: primary,
    secondaryThemes: secondary,
    overallTone:
      "Today's guidance focuses on " +
      primary.area +
      (
        secondary.length
          ? ", alongside " +
            secondary.map(theme => theme.area).join(" and ")
          : ""
      ) +
      ".",
    explanation: primaryChanged
      ? null
      : prediction.explanation,
    suppressedAreas:
      prediction.suppressedAreas.filter(
        area => !blocked.has(area)
      ),
  };
}

export function buildDailyGuidanceV2(params: {
  current: PersonalizedDailyPredictionInput;
  window: PersonalizedDailyPredictionInput[];
  legacy: LegacyPrediction;
  reinforcement?: ReinforcementInput;
}): LegacyPrediction {

  const { current, window, legacy } = params;

  const inputs = [...window, current].sort(
    (a, b) =>
      a.selectedDateISO.localeCompare(b.selectedDateISO)
  );

  if (
    new Set(inputs.map(i => i.selectedDateISO)).size !==
    inputs.length
  ) {
    throw new Error("Duplicate guidance dates.");
  }

  const prepared = inputs.map(prediction => {

    const activation = resolveDashaActivation({
      ascendant: prediction.ascendant,
      ...prediction.dasha,
      natalPositions: prediction.natalPositions,
    });

    const pada = getNakshatraPadaData(
      prediction.sky.moon.siderealLongitude
    );

    const input: UnifiedJudgementInput = {
      ...params.reinforcement,
      prediction,
      dashaActivations: activation.planetActivations,
      moon: {
        nakshatraLord: planet(pada?.nakshatraLord),
        navamsaLord: planet(pada?.navamsaLord),
        nakshatra: pada?.nakshatra ?? null,
        pada: pada?.pada ?? null,
      },
    };

    return input;
  });

  const todayRows: TemporalRow[] = [];

  const judgements = new Map<
    string,
    ReturnType<typeof resolveUnifiedEventJudgement>
  >();

  for (const rule of EVENT_JUDGEMENT_RULES) {

    const snapshots = prepared.map(input => {

      const judgement =
        resolveUnifiedEventJudgement(rule, input);

      const date = input.prediction.selectedDateISO;

      if (date === current.selectedDateISO) {
        judgements.set(rule.eventId, judgement);
      }

      return buildTemporalEventSnapshot(
        date,
        rule,
        judgement
      );
    });

    const today = resolveTemporalEventWindow(
      snapshots
    ).find(row => row.date === current.selectedDateISO);

    if (today) todayRows.push(today);
  }

  const areas = new Map<LifeArea, TemporalRow[]>();

  for (const row of todayRows) {
    const definition = EVENT_THEMES.find(
      item => item.id === row.eventId
    );

    if (!definition) continue;

    const existing = areas.get(definition.area) ?? [];

    existing.push(row);
    areas.set(definition.area, existing);
  }

  const ranked: {
    theme: DailyPredictionTheme;
    row: TemporalRow;
    specific: boolean;
    rank: number;
    dailyContactOrb: number | null;
  }[] = [];

  for (const [area, rows] of areas) {

    const competition =
      area === "money"
        ? resolveFinancialCompetition(rows)
        : resolveEventCompetition(rows);

    const supported = rows.filter(row => {
      const judgement = judgements.get(row.eventId);

      return row.foundationEligible &&
        row.revisedScore !== null &&
        (
          judgement?.scoring.admission === "EVENT_SUPPORTED" ||
          judgement?.scoring.admission === "SITUATION_SUPPORTED"
        );
    }).sort(
      (a, b) =>
        (b.revisedScore ?? 0) - (a.revisedScore ?? 0)
    );

    const selected = competition.selected;

    const dailySupported = [...supported].sort(
      (a, b) =>
        Number(b.trigger.qualified) -
          Number(a.trigger.qualified) ||
        Number(b.newDailyExpression) -
          Number(a.newDailyExpression) ||
        (b.trigger.points ?? 0) -
          (a.trigger.points ?? 0) ||
        (b.revisedScore ?? 0) -
          (a.revisedScore ?? 0)
    );

    const row = selected ?? dailySupported[0];

    if (!row) continue;

    const definition = EVENT_THEMES.find(
      item => item.id === row.eventId
    );

    if (!definition) continue;

    const guidance = EVENT_GUIDANCE[row.eventId];

    if (!guidance) continue;

    const ambiguous =
      competition.status === "COMPETING_UNRESOLVED";

    const specific =
      !ambiguous &&
      competition.publishSpecificDailyEvent &&
      selected?.eventId === row.eventId;

    const ongoing =
      row.stage === "CONTINUING_TRIGGER" ||
      row.resumedTrigger === true;

    const areaGuidance = buildMoonThemeGuidance(area);

    const eventJudgement = judgements.get(row.eventId);

    const relevantPlanets =
      eventJudgement?.diagnostics
        .foundationalTransitPlanets ?? [];

    const contact = dailyPlanetaryContact(
      current,
      relevantPlanets
    );

    const dailySituation = DAILY_SITUATIONS[area];



    let prediction: string;
    let action: string;
    let avoid: string;

    if (ambiguous || !selected) {
      prediction =
        dailySituation?.[0] ?? areaGuidance.prediction;

      action =
        dailySituation?.[1] ?? areaGuidance.action;

      avoid =
        dailySituation?.[2] ?? areaGuidance.avoid;
    } else {
      prediction = ongoing
        ? "An existing matter may still need your attention. " + guidance[0]
        : guidance[0];

      action = guidance[1];
      avoid = guidance[2];
    }

    if (
      typeof current.age === "number" &&
      current.age >= 18 &&
      area === "education" &&
      !ambiguous &&
      selected
    ) {

      if (row.eventId === "education_challenge") {
        prediction =
          "A complex subject, technical question or unfamiliar information may require additional investigation before you can progress.";
        action =
          "Resolve the outstanding question or seek clarification from someone with relevant expertise.";
        avoid =
          "Avoid proceeding on incomplete information.";
      }

      if (row.eventId === "education_focus") {
        prediction =
          "Research, professional learning or developing a better understanding of an existing subject may become important.";
        action =
          "Set aside focused time to understand the practical details.";
        avoid =
          "Avoid dividing your attention across unrelated subjects.";
      }

      if (row.eventId === "education_progress") {
        prediction =
          "You may gain greater clarity about a subject, complete a learning objective or receive useful feedback on work you have been developing.";
        action =
          "Apply what you have learned to the next practical step.";
        avoid =
          "Avoid assuming that every outstanding question has been resolved.";
      }

      if (ongoing) {
        prediction =
          "An existing learning objective may need further attention. " +
          prediction;
      }
    }

    if (
      typeof current.age === "number" &&
      current.age < 18 &&
      area === "relationships"
    ) {
      prediction =
        "A conversation or shared activity with friends, classmates or family may need attention.";

      action =
        "Listen carefully and ask a trusted adult for help if needed.";

      avoid =
        "Avoid reacting immediately to misunderstandings.";
    }

    // Improve area-level situations without changing
    // the selected event, score or financial direction.
    const adultNarrative =
      typeof current.age === "number" &&
      Number.isFinite(current.age) &&
      current.age >= 18;

    if (
      adultNarrative &&
      (ambiguous || !selected) &&
      row.trigger.qualified
    ) {
      const narrativePlanet =
        contact?.planet ??
        row.trigger.strongest?.planet ??
        null;

      prediction =
        resolveContextualSituation(
          area,
          narrativePlanet
        ) ?? prediction;
    }

    prediction = enrichDailyNarrative({
      prediction,
      area,
      row,
      contact,
      current,
      ambiguous,
    });

    ranked.push({
      row,
      specific,
      rank: row.revisedScore ?? 0,
      dailyContactOrb: contact?.orb ?? null,
      theme: {
        area,
        polarity: "neutral",
        manifestationId: specific ? definition.id : null,
        manifestationLabel: specific ? (GUIDANCE_EVENT_TITLES[definition.id] ?? definition.label) : null,
        manifestationDescription:
          specific ? definition.description : null,
        prediction,
        action,
        avoid,
        priorityScore: row.revisedScore ?? 0,
        manifestationScore: specific
          ? row.revisedScore ?? 0
          : 0,
        role: "secondary",
      },
    });
  }

  ranked.sort(
    (a, b) =>
      Number(b.row.trigger.qualified) -
        Number(a.row.trigger.qualified) ||
      Number(b.row.newDailyExpression) -
        Number(a.row.newDailyExpression) ||
      Number(b.specific) - Number(a.specific) ||
      Number(b.dailyContactOrb !== null) -
        Number(a.dailyContactOrb !== null) ||
      (a.dailyContactOrb ?? 999) -
        (b.dailyContactOrb ?? 999) ||
      (b.row.trigger.points ?? 0) -
        (a.row.trigger.points ?? 0) ||
      b.rank - a.rank ||
      a.theme.area.localeCompare(b.theme.area)
  );

  if (
    typeof current.age !== "number" ||
    !Number.isFinite(current.age) ||
    current.age < 18
  ) {
    for (const item of ranked) {
      item.theme = adaptYoungGuidance(item.theme);
    }
  }

  const leading = ranked[0];

  if (!leading) {
    // No supported V2 event. Preserve the existing guidance.
    const fallback = ensureAgeSafeGuidance(
      legacy,
      current.age
    );

    const lunar = contextualLunarKnowledge(
      current.sky.moon.siderealLongitude
    );

    const existing =
      fallback.explanation?.moonPadaContext;

    const interpretation = lunar?.interpretation;

    if (
      fallback.explanation &&
      existing &&
      interpretation &&
      existing.nakshatra === lunar.nakshatra &&
      existing.pada === lunar.pada
    ) {
      return {
        ...fallback,
        explanation: {
          ...fallback.explanation,
          moonPadaContext: {
            ...existing,
            coreTheme: interpretation.coreTheme,
            interpretiveThemes:
              interpretation.interpretiveThemes,
            actionStyles:
              interpretation.actionStyles,
            cautionStyles:
              interpretation.cautionStyles,
          },
        },
      };
    }

    return fallback;
  }

  const judgement = judgements.get(leading.row.eventId);

  const primaryTheme: DailyPredictionTheme = {
    ...leading.theme,
    role: "primary",
  };

  const secondaryThemes = ranked
    .slice(1, 3)
    .map(item => item.theme);

  const visibleAreas = new Set([
    primaryTheme.area,
    ...secondaryThemes.map(theme => theme.area),
  ]);

  // Never attach a legacy manifestation or remedy
  // to a different V2 event.
  const explanation = {
    moonPadaContext: (() => {
      const existing =
        legacy.explanation?.moonPadaContext ?? null;

      const lunar = contextualLunarKnowledge(
        current.sky.moon.siderealLongitude
      );

      const interpretation = lunar?.interpretation;

      if (!existing || !interpretation) {
        return existing;
      }

      if (
        existing.nakshatra !== lunar.nakshatra ||
        existing.pada !== lunar.pada
      ) {
        return existing;
      }

      return {
        ...existing,
        coreTheme: interpretation.coreTheme,
        interpretiveThemes: interpretation.interpretiveThemes,
        actionStyles: interpretation.actionStyles,
        cautionStyles: interpretation.cautionStyles,
      };
    })(),
    padaContext:
      legacy.explanation?.padaContext ?? [],
    area: primaryTheme.area,
    polarity: primaryTheme.polarity,
    dashaPlanets:
      judgement?.diagnostics.foundationalDashaPlanets ?? [],
    activatedHouses: [
      ...new Set([
        ...(judgement?.diagnostics.combinedCoreHouses ?? []),
        ...(judgement?.diagnostics.combinedDistinctiveHouses ?? []),
      ]),
    ],
    transitMatches: (
      judgement?.diagnostics.foundationalTransitPlanets ?? []
    ).map(planet => ({
      planet,
      source: "planet_synthesis" as const,
      polarity: "mixed" as const,
    })),
    manifestation: null,
  };

  return {
    ...legacy,
    overallTone:
      "Today's astrological guidance highlights " +
      primaryTheme.area +
      (
        secondaryThemes.length
          ? " alongside " +
            secondaryThemes.map(t => t.area).join(" and ")
          : ""
      ) +
      ".",
    primaryTheme,
    secondaryThemes,
    suppressedAreas: [...areas.keys()].filter(
      area => !visibleAreas.has(area)
    ),
    explanation,
  };
}