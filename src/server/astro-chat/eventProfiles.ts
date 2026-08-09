export type ConsultationStage = {
  key: "preparation" | "activation" | "conversion" | "completion";
  label: string;
  examples: string[];
};

export type EventResponseProfile = {
  key: string;
  outcomeName: string;
  windowName: string;
  immediateNegative: string;
  immediateModerate: string;
  immediateStrong: string;
  earlierMovement: string;
  conversionLanguage: string;
  blockedLanguage: string;
  stages: ConsultationStage[];
  preparationAdvice: string;
  activeWindowAdvice: string;
  caution: string;
};

const JOB_CHANGE: EventResponseProfile = {
  key: "job_change",
  outcomeName: "a change of employer",
  windowName: "job-change",
  immediateNegative:
    "Your chart does indicate a change of employer, but I do not consider the present period strong enough to complete that change dependably.",
  immediateModerate:
    "Your chart supports a change of employer, although the process is more likely to unfold in stages than conclude immediately.",
  immediateStrong:
    "Your chart shows a credible period for changing employers, with enough support for the process to move beyond exploration.",
  earlierMovement:
    "Before the main period, you may still see recruiter approaches, applications, interviews, networking or serious employer discussions. I would treat these as preparation and opening movement rather than the promised change itself.",
  conversionLanguage:
    "This is the period more capable of carrying the process through serious interviews, a confirmed offer, negotiation, resignation and joining.",
  blockedLanguage:
    "The possibility exists, but the present combination does not yet give the process a sufficiently clean route from discussion to offer and joining.",
  stages: [
    { key: "preparation", label: "Preparation", examples: ["profile strengthening", "networking", "selective applications"] },
    { key: "activation", label: "Activation", examples: ["recruiter contact", "interviews", "employer discussions"] },
    { key: "conversion", label: "Conversion", examples: ["confirmed offer", "salary negotiation", "acceptance"] },
    { key: "completion", label: "Completion", examples: ["resignation", "joining", "settling into the new role"] },
  ],
  preparationAdvice:
    "Use the intervening period to strengthen your profile, document your achievements, improve visibility and build a selective network rather than applying without direction.",
  activeWindowAdvice:
    "During the stronger period, pursue serious opportunities decisively and evaluate the quality, authority, compensation and long-term value of the role—not merely the fact that an offer has appeared.",
  caution:
    "Do not resign or make an irreversible career decision until the offer, compensation, joining date and practical conditions are confirmed.",
};

const PROMOTION: EventResponseProfile = {
  key: "promotion",
  outcomeName: "a formal promotion",
  windowName: "promotion",
  immediateNegative:
    "The chart supports professional development, but I do not yet see the present period as dependable for a formal promotion.",
  immediateModerate:
    "The chart supports recognition and greater responsibility, although formal elevation may take longer to crystallise.",
  immediateStrong:
    "The chart shows a credible period for formal elevation, recognition and increased authority.",
  earlierMovement:
    "Earlier signs may include visibility, appraisal discussions, added responsibility or management attention. These should not automatically be read as the final title or salary decision.",
  conversionLanguage:
    "This is the period more capable of converting recognition into formal approval, a title change, increased authority or revised compensation.",
  blockedLanguage:
    "Recognition may increase, but the present combination does not yet provide a clean route to formal title and compensation conversion.",
  stages: [
    { key: "preparation", label: "Preparation", examples: ["visible delivery", "stakeholder support", "documented results"] },
    { key: "activation", label: "Activation", examples: ["appraisal discussion", "senior visibility", "expanded responsibility"] },
    { key: "conversion", label: "Conversion", examples: ["formal approval", "title decision", "salary revision"] },
    { key: "completion", label: "Completion", examples: ["announcement", "new mandate", "revised compensation"] },
  ],
  preparationAdvice:
    "Make your contribution measurable, strengthen senior sponsorship and ensure the discussion is tied to role scope, title and compensation rather than additional work alone.",
  activeWindowAdvice:
    "During the stronger period, initiate or formalise the promotion discussion and ask for clear decision criteria and timelines.",
  caution:
    "Do not mistake increased workload or verbal appreciation for a completed promotion until the title, authority and compensation are formally confirmed.",
};

const BUSINESS: EventResponseProfile = {
  key: "business",
  outcomeName: "a viable business launch",
  windowName: "business",
  immediateNegative:
    "Your chart can support business activity, but I would not treat the present period as dependable for an all-in launch or immediate commercial stability.",
  immediateModerate:
    "Your chart supports developing a business, although the current phase is better suited to validation and controlled commercial action than rapid expansion.",
  immediateStrong:
    "Your chart shows a credible period for taking a business from preparation into visible commercial activity.",
  earlierMovement:
    "Before the stronger phase, use the time to test demand, define the offer, understand compliance and speak with prospective clients. These are groundwork, not proof of a sustainable business.",
  conversionLanguage:
    "This is the period more capable of moving the business from planning into registration, client acquisition, signed work and repeatable revenue.",
  blockedLanguage:
    "The business promise may exist, but the current combination does not yet provide a sufficiently clean route from idea to stable customers and dependable cash flow.",
  stages: [
    { key: "preparation", label: "Validation", examples: ["clear offer", "customer segment", "cost and compliance checks"] },
    { key: "activation", label: "Launch", examples: ["registration", "market outreach", "first proposals"] },
    { key: "conversion", label: "Commercial proof", examples: ["paying clients", "signed contracts", "repeatable revenue"] },
    { key: "completion", label: "Expansion", examples: ["stable cash flow", "team or channel growth", "measured scaling"] },
  ],
  preparationAdvice:
    "Build the business alongside existing income until demand, delivery capability and cash flow are proven. Start with one defined offer and one clear customer segment.",
  activeWindowAdvice:
    "During the stronger period, move into controlled market testing, client outreach and formal commercial activity, while measuring conversion and collections closely.",
  caution:
    "Do not leave stable employment, commit large capital or enter an unclear partnership before recurring revenue and written commercial terms are established.",
};
const PROFESSION_IDENTITY: EventResponseProfile = {
  key: "profession_identity",
  outcomeName: "a suitable long-term professional direction",
  windowName: "career suitability",
  immediateNegative:
    "The chart does not show a strong natural fit for this profession, although some supporting capabilities may still be present.",
  immediateModerate:
    "The chart shows a partial or conditional fit for this profession, with some relevant strengths but also meaningful capability gaps.",
  immediateStrong:
    "The chart shows a credible natural fit for this profession, supported by the native's stronger capabilities and vocational pattern.",
  earlierMovement:
    "Before making a major career move, compare the profession with the native's stronger career-fit patterns and test the work in practical life.",
  conversionLanguage:
    "If the profession is genuinely suitable, current timing should then be used to judge when to study, transition, launch, or deepen the work.",
  blockedLanguage:
    "The profession may be interesting, but the enduring capability pattern is not strong enough to treat it as a leading vocational direction.",
  stages: [
    {
      key: "preparation",
      label: "Assessment",
      examples: [
        "natural capability",
        "skill alignment",
        "career-fit comparison",
      ],
    },
    {
      key: "activation",
      label: "Exploration",
      examples: [
        "training",
        "practice",
        "mentoring",
      ],
    },
    {
      key: "conversion",
      label: "Career move",
      examples: [
        "formal transition",
        "professional practice",
        "role commitment",
      ],
    },
    {
      key: "completion",
      label: "Established direction",
      examples: [
        "sustained work",
        "professional identity",
        "long-term development",
      ],
    },
  ],
  preparationAdvice:
    "Judge the profession from long-term capability fit first. Compare it with stronger alternatives and test the work practically before making a full career transition.",
  activeWindowAdvice:
    "Once suitability is established, use stronger dasha and transit periods to time training, transition, launch or professional expansion.",
  caution:
    "Do not reject a naturally suitable profession only because the current timing is weak, and do not enter an unsuitable profession only because a temporary period is active.",
};
const GENERIC: EventResponseProfile = {
  key: "generic",
  outcomeName: "the desired outcome",
  windowName: "outcome",
  immediateNegative:
    "The chart contains some potential, but I do not consider the present period dependable for completing the matter.",
  immediateModerate:
    "The chart supports progress, although the matter is more likely to unfold in stages than conclude immediately.",
  immediateStrong:
    "The chart shows a credible period for the desired outcome.",
  earlierMovement:
    "Some earlier discussion, preparation or practical movement may arise, but it should not be confused with the completed outcome.",
  conversionLanguage:
    "This is the period more capable of carrying the matter from opportunity into a confirmed result.",
  blockedLanguage:
    "The possibility exists, but the present combination does not yet provide a clean route to completion.",
  stages: [
    { key: "preparation", label: "Preparation", examples: ["clarity", "planning", "removing obstacles"] },
    { key: "activation", label: "Activation", examples: ["discussion", "opportunity", "practical movement"] },
    { key: "conversion", label: "Conversion", examples: ["agreement", "approval", "commitment"] },
    { key: "completion", label: "Completion", examples: ["confirmation", "execution", "settlement"] },
  ],
  preparationAdvice:
    "Use the intervening period to clarify the outcome, organise the practical requirements and remove avoidable obstacles.",
  activeWindowAdvice:
    "During the stronger period, respond decisively to genuine opportunities and complete the necessary practical checks.",
  caution:
    "Do not make an irreversible commitment until the practical conditions are clear and confirmed.",
};

export function getEventResponseProfile(
  topic: string,
  eventType?: string
): EventResponseProfile {
  if (
    topic === "career" &&
    eventType === "profession_identity"
  ) {
    return PROFESSION_IDENTITY;
  }

  if (
    topic === "career" &&
    eventType === "job_change"
  ) {
    return JOB_CHANGE;
  }

  if (
    topic === "career" &&
    eventType === "promotion"
  ) {
    return PROMOTION;
  }

  if (topic === "business") {
    return BUSINESS;
  }

  return GENERIC;
}
