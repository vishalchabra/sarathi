// FILE: src/server/sarathi/reasoning/eventReasoning.ts

import type {
  ReasoningItem,
  ReasoningSection,
} from "./types";

type EventReasoningParams = {
  topic?: string | null;
  eventType?: string | null;

  planetReasoning?: ReasoningSection | null;
  houseReasoning?: ReasoningSection | null;

  source?: string;
};

type EventTemplate = {
  title: string;
  explanation: string;
  practicalMeaning: string;
};

/* --------------------------------------------------
   Event templates

   These do NOT calculate astrology.

   They translate already-established topic/event
   activation into practical event-level meaning.
-------------------------------------------------- */

const EVENT_TEMPLATES: Record<
  string,
  EventTemplate[]
> = {
  property: [
    {
      title:
        "Ownership and settlement are becoming more relevant",

      explanation:
        "The chart factors are converging around home, property, long-term assets, financial commitment, and settlement.",

      practicalMeaning:
        "This makes the period more suitable for moving from general interest into serious property planning, financing, negotiation, or purchase.",
    },

    {
      title:
        "Preparation needs to convert into commitment",

      explanation:
        "The supporting factors combine opportunity with the need for deliberate action rather than passive waiting.",

      practicalMeaning:
        "Research, funding readiness, negotiation, documentation, and timely decision-making become important if the property opportunity is to convert into ownership.",
    },
  ],

  vehicle: [
    {
      title:
        "Vehicle ownership or upgrade is becoming more active",

      explanation:
        "The chart factors are converging around comfort, mobility, expenditure, asset purchase, and practical decision-making.",

      practicalMeaning:
        "This can move the user from considering a vehicle change into comparing options, arranging finance, booking, or completing the purchase.",
    },

    {
      title:
        "The event requires practical execution",

      explanation:
        "The supporting factors favor action when the right option appears, but do not remove the need for financial judgement.",

      practicalMeaning:
        "The strongest outcome comes from balancing desire for an upgrade with price, financing, timing, and long-term value.",
    },
  ],

  business: [
    {
      title:
        "Commercial activity is becoming more actionable",

      explanation:
        "The chart factors are converging around initiative, commerce, partnerships, gains, visibility, and independent decision-making.",

      practicalMeaning:
        "This supports moving beyond planning into testing the offer, approaching customers, negotiating, signing work, or launching commercially.",
    },

    {
      title:
        "Execution matters more than intention",

      explanation:
        "The event requires commercial ability to convert into measurable demand and repeatable activity.",

      practicalMeaning:
        "The business should prove itself through customers, contracts, revenue, and operating discipline before aggressive expansion.",
    },
  ],
job_change: [
  {
    title:
      "A change of employer or role is becoming more actionable",

    explanation:
      "The chart factors are converging around initiative, employment, professional direction, separation from the existing setup, income, and gains.",

    practicalMeaning:
      "This can manifest through applications, recruiter contact, interviews, serious role discussions, offer movement, resignation thinking, or an actual employer change.",
  },

  {
    title:
      "Opportunity needs to convert into a concrete transition",

    explanation:
      "Job-change potential becomes meaningful when search activity, discussions, selection, compensation considerations, and the decision to leave the existing setup begin working together.",

    practicalMeaning:
      "The strongest expression is a progression from outreach or opportunity into interview, offer or selection movement, resignation decision, and finally a new role or employer.",
  },
],
promotion: [
  {
    title:
      "Recognition is becoming more capable of converting into formal progression",

    explanation:
      "The chart factors are converging around professional responsibility, visibility, achievement, gains, recognition, and reward.",

    practicalMeaning:
      "This can manifest through increased responsibility, stronger management visibility, recognition of contribution, promotion discussions, title elevation, or improved compensation.",
  },

  {
    title:
      "Professional contribution needs to convert into formal reward",

    explanation:
      "Promotion potential becomes meaningful when responsibility, measurable performance, visibility, organizational support, and recognition begin working together.",

    practicalMeaning:
      "The strongest expression is a progression from demonstrated contribution and increased visibility into a formal discussion, management approval, and eventual title, responsibility, or compensation improvement.",
  },
],
salary_increase: [
  {
    title:
      "Professional value is becoming more capable of converting into higher compensation",

    explanation:
      "The chart factors are converging around earned income, work contribution, professional standing, gains, recognition, and financial reward.",

    practicalMeaning:
      "This can manifest through a salary review, compensation discussion, increment proposal, bonus consideration, revised package, or another form of increased professional income.",
  },

  {
    title:
      "Contribution needs to convert into measurable financial reward",

    explanation:
      "Salary-growth potential becomes meaningful when performance, professional value, compensation discussions, organizational approval, and financial reward begin working together.",

    practicalMeaning:
      "The strongest expression is a progression from demonstrated value and recognition into compensation discussion or review, approval, and an actual increase in salary, bonus, or total remuneration.",
  },
],
  career: [
    {
      title:
        "Professional movement is becoming more visible",

      explanation:
        "The chart factors are converging around work, responsibility, visibility, achievement, gains, and professional recognition.",

      practicalMeaning:
        "This can manifest through greater responsibility, stronger visibility, interviews, role discussions, internal movement, or recognition.",
    },

    {
      title:
        "Responsibility needs to convert into reward",

      explanation:
        "Career activity alone is not enough; the chart needs effort and visibility to translate into an actual professional outcome.",

      practicalMeaning:
        "The user should focus on measurable contribution, stakeholder visibility, negotiation, and opportunities where responsibility can convert into title, compensation, or role progression.",
    },
  ],

  marriage: [
    {
      title:
        "Partnership and commitment themes are becoming more active",

      explanation:
        "The chart factors are converging around relationship, partnership, emotional involvement, agreement, and long-term commitment.",

      practicalMeaning:
        "This can increase the likelihood of meeting someone meaningful, deepening an existing bond, discussing commitment, or formalizing a relationship.",
    },

    {
      title:
        "Emotional connection must develop into mutual commitment",

      explanation:
        "Relationship potential becomes meaningful when attraction, compatibility, practical circumstances, and willingness to commit begin working together.",

      practicalMeaning:
        "The event is more likely to progress through genuine interaction and shared decisions than through timing alone.",
    },
  ],
marriage_commitment: [
  {
    title:
      "A relationship is becoming more capable of moving toward formal commitment",

    explanation:
      "The chart factors are converging around partnership, mutual agreement, family integration, commitment, and formalization of the relationship.",

    practicalMeaning:
      "This can manifest through serious commitment discussions, agreement about the future, family involvement, engagement planning, or movement toward marriage.",
  },

  {
    title:
      "Relationship potential needs to convert into mutual commitment",

    explanation:
      "Marriage commitment becomes meaningful when relationship development, mutual readiness, agreement about the future, family involvement, and formal commitment begin working together.",

    practicalMeaning:
      "The strongest expression is a progression from an established meaningful relationship into commitment discussions, mutual agreement, family participation, and eventual engagement or marriage formalization.",
  },
],
health_recovery: [
  {
    title:
      "Health stability is becoming more capable of improving",

    explanation:
      "The chart factors are converging around physical condition, health challenges, recovery capacity, routine, treatment response, and gradual stabilization.",

    practicalMeaning:
      "This can manifest through clearer understanding of the health issue, better treatment or care response, correction of daily routines, reduced difficulty, or gradual improvement in overall stability.",
  },

  {
    title:
      "Recovery needs to develop through sustained improvement rather than a single moment",

    explanation:
      "Health recovery becomes meaningful when diagnosis or symptom clarity, appropriate care, routine correction, treatment response, rest, and the body's ability to stabilize begin working together.",

    practicalMeaning:
      "The strongest expression is a progression from identifying or managing the problem into consistent care and routine, measurable improvement, greater stability, and a more manageable health condition.",
  },
],
  relationships: [
    {
      title:
        "Relationship dynamics are becoming more important",

      explanation:
        "The chart factors are emphasizing connection, emotional response, partnership, communication, and interaction with others.",

      practicalMeaning:
        "This can bring new interactions, clearer relationship decisions, deeper involvement, or the need to address an existing dynamic.",
    },
  ],

  money: [
    {
      title:
        "Financial growth depends on conversion into tangible gains",

      explanation:
        "The chart factors are converging around income, accumulated resources, opportunity, work, and fulfilment of financial goals.",

      practicalMeaning:
        "Financial improvement is more meaningful when opportunity converts into higher income, stronger savings, asset growth, or reduced financial pressure.",
    },

    {
      title:
        "Opportunity still requires financial discipline",

      explanation:
        "Supportive financial factors can create opportunity, but expenditure and execution remain important.",

      practicalMeaning:
        "The user should prioritize cash flow, savings, disciplined spending, and opportunities with measurable financial value.",
    },
  ],

  relocation: [
    {
      title:
        "A change of residence or location is becoming more plausible",

      explanation:
        "The chart factors are converging around home, movement, foreign or distant environments, transition, and settlement.",

      practicalMeaning:
        "This can move from discussion into applications, planning, travel, housing decisions, or an actual change of residence.",
    },
  ],

  education: [
    {
      title:
        "Learning and development themes are strengthening",

      explanation:
        "The chart factors are converging around study, knowledge, skill development, guidance, and future opportunity.",

      practicalMeaning:
        "This supports enrolling, preparing, qualifying, completing study, or using new knowledge to improve future prospects.",
    },
  ],
  higher_education: [
  {
    title:
      "The chart supports structured learning and qualification development",

    explanation:
      "The relevant factors are converging around study, knowledge, guidance, skill development, formal learning, and future opportunity.",

    practicalMeaning:
      "This can manifest through choosing a course, preparing for admission, enrolling in higher studies, gaining a professional qualification, or developing skills that improve future prospects.",
  },

  {
    title:
      "Education becomes meaningful when learning converts into a usable credential or capability",

    explanation:
      "Higher education is more significant when interest and preparation develop into admission, sustained study, skill acquisition, qualification, and practical application of the knowledge gained.",

    practicalMeaning:
      "The stronger expression is a progression from exploration and preparation into enrollment, consistent study, completion, and a qualification or capability that materially improves future options.",
  },
],
childbirth_timing: [
  {
    title:
      "The chart supports a period of family-expansion potential",

    explanation:
      "The relevant planetary and house factors are converging around children, family expansion, parenthood, and the possibility of conception and childbirth.",

    practicalMeaning:
      "This indicates a comparatively supportive phase for family planning and possible expansion, rather than a guarantee that conception or childbirth must occur.",
  },

  {
    title:
      "The event is better understood as a process rather than a single predicted date",

    explanation:
      "Family expansion can develop through planning, conception possibility, pregnancy development, medical and practical monitoring, and eventual childbirth rather than appearing as one isolated event.",

    practicalMeaning:
      "The timing window should therefore be used to understand when the broader process may receive stronger support, while biological and medical outcomes remain dependent on real-world factors.",
  },
],
dispute_resolution: [
  {
    title:
      "The chart supports movement toward dispute resolution",
    explanation:
      "The relevant planetary and house factors are converging around conflict management, legal engagement, negotiation, settlement efforts, and movement toward closure.",
    practicalMeaning:
      "This supports a period in which the dispute may become more workable through clearer positions, constructive engagement, procedural movement, negotiation, mediation, or other legitimate resolution efforts.",
  },
  {
    title:
      "Resolution is more likely to develop through a process than a single decisive moment",
    explanation:
      "Legal and interpersonal disputes usually move through clarification, engagement, negotiation or procedure, decision-making, and eventual closure rather than resolving instantly.",
    practicalMeaning:
      "The stronger expression is gradual movement from preparation and engagement into settlement, agreement, formal decision, or another workable form of closure, rather than assuming one predetermined legal outcome.",
  },
],
employment_risk: [
  {
    title:
      "Employment pressure is present, but this does not by itself confirm job loss",

    explanation:
      "The relevant factors are converging around employment, professional status, disruption, separation, income continuity, and gains. These factors can describe pressure or instability without necessarily producing termination or loss of employment.",

    practicalMeaning:
      "The period should be read first for signs of increased pressure, organizational change, role uncertainty, restructuring, difficult management conditions, or concern about continuity. Actual job loss requires stronger evidence of separation or discontinuity rather than career pressure alone.",
  },

  {
    title:
      "The key question is whether instability develops into actual separation",

    explanation:
      "Employment risk becomes more significant when work pressure or organizational disruption combines with weakening continuity, professional displacement, separation from the existing setup, and loss of the structures that normally sustain employment and income.",

    practicalMeaning:
      "A difficult career phase should not automatically be interpreted as termination. The stronger adverse expression would require the process to progress from instability or disruption into concrete signs such as role discontinuity, formal restructuring, redundancy, termination, or another involuntary break in employment.",
  },
],
financial_loss_risk: [
  {
    title:
      "Financial pressure is present for assessment, but this does not by itself confirm major loss",
    explanation:
      "The relevant factors are converging around accumulated resources, financial disruption, outflows, speculative exposure, and income continuity. These factors can describe financial pressure, higher expenses, volatility, or temporary depletion without necessarily producing a major loss of wealth.",
    practicalMeaning:
      "The period should first be read for signs of increased expenses, liquidity pressure, investment volatility, debt obligations, or strain on accumulated resources. A major financial loss requires stronger evidence of actual capital erosion rather than financial pressure alone.",
  },
  {
    title:
      "The key question is whether financial pressure develops into actual capital loss",
    explanation:
      "Financial-loss risk becomes more significant when pressure on resources combines with disruptive financial events, sustained outflows, weak recovery through income or gains, and real exposure through investments, debt, liabilities, or major financial commitments.",
    practicalMeaning:
      "Higher expenses or temporary volatility should not automatically be interpreted as major financial loss. The stronger adverse expression would require the process to progress into measurable depletion of savings, investment loss, debt stress, asset erosion, or another material reduction in financial position.",
  },
],
relationship_breakdown_risk: [
  {
    title:
      "Relationship strain is present for assessment, but this does not by itself confirm separation",
    explanation:
      "The relevant factors are converging around partnership, disruption, emotional distance, domestic stability, continuity, and possible withdrawal. These factors can describe tension, conflict, temporary distance, or instability without necessarily producing a permanent breakdown of the relationship.",
    practicalMeaning:
      "The period should first be read for signs of communication strain, emotional withdrawal, recurring conflict, reduced closeness, domestic tension, or uncertainty about the future of the relationship. Actual separation requires stronger evidence that these pressures are progressing into a sustained break in partnership continuity.",
  },
  {
    title:
      "The key question is whether relationship strain develops into actual separation",
    explanation:
      "Breakdown risk becomes more significant when partnership pressure combines with sustained emotional or physical distance, weakening commitment, inability to restore stability, and concrete decisions that interrupt the continuity of the relationship.",
    practicalMeaning:
      "Conflict or temporary distance should not automatically be interpreted as breakup or divorce. The stronger adverse expression would require the process to move from strain into concrete signs such as prolonged separation, withdrawal from the relationship, formal breakup discussions, divorce proceedings, or another clear discontinuity in the partnership.",
  },
],
};

/* --------------------------------------------------
   Helpers
-------------------------------------------------- */

function normalizeTopic(
  topic?: string | null,
  eventType?: string | null
): string {
  const t = String(
    topic ?? ""
  )
    .toLowerCase()
    .trim();

  if (t) {
    if (
      t === "property" ||
      t === "home"
    ) {
      return "property";
    }

    if (
      t === "vehicle" ||
      t === "car"
    ) {
      return "vehicle";
    }

    if (
      t === "relationships" ||
      t === "relationship"
    ) {
      return "relationships";
    }

    return t;
  }

  const e = String(
    eventType ?? ""
  )
    .toLowerCase()
    .trim();

  if (
    e.includes("property") ||
    e.includes("house")
  ) {
    return "property";
  }

  if (
    e.includes("vehicle") ||
    e.includes("car")
  ) {
    return "vehicle";
  }

  if (
    e.includes("business")
  ) {
    return "business";
  }

  if (
    e.includes("promotion") ||
    e.includes("job") ||
    e.includes("career")
  ) {
    return "career";
  }

  if (
    e.includes("marriage")
  ) {
    return "marriage";
  }

  if (
    e.includes("relationship")
  ) {
    return "relationships";
  }

  if (
    e.includes("money") ||
    e.includes("income") ||
    e.includes("wealth")
  ) {
    return "money";
  }

  if (
    e.includes("relocation") ||
    e.includes("foreign_move")
  ) {
    return "relocation";
  }

  return "generic";
}

function hasPrimarySupport(
  section?: ReasoningSection | null
): boolean {
  return Boolean(
    section?.items?.some(
      (item) =>
        item.role === "primary"
    )
  );
}

/* --------------------------------------------------
   Builder
-------------------------------------------------- */

export function buildEventReasoning(
  params: EventReasoningParams
): ReasoningSection {
  const {
    topic,
    eventType,
    planetReasoning,
    houseReasoning,
    source =
      "synthesis of planetary and house reasoning",
  } = params;

  const normalizedTopic =
  normalizeTopic(
    topic,
    eventType
  );

const normalizedEventType =
  String(
    eventType ?? ""
  )
    .toLowerCase()
    .trim();

const templateKey =
  normalizedEventType &&
  EVENT_TEMPLATES[
    normalizedEventType
  ]
    ? normalizedEventType
    : normalizedTopic;

const templates =
  EVENT_TEMPLATES[
    templateKey
  ] ?? [];

  const planetSupport =
    hasPrimarySupport(
      planetReasoning
    );

  const houseSupport =
    hasPrimarySupport(
      houseReasoning
    );

  const confidence:
    ReasoningSection["confidence"] =
    planetSupport &&
    houseSupport
      ? "high"
      : planetSupport ||
        houseSupport
      ? "medium"
      : "low";

  const items: ReasoningItem[] =
    templates.map(
      (
        template,
        index
      ): ReasoningItem => ({
        id:
           `event:${templateKey}:${index + 1}`,

        title:
          template.title,

        explanation:
          template.explanation,

        practicalMeaning:
          template.practicalMeaning,

        role:
          index === 0
            ? "primary"
            : "supporting",

        confidence,

        source,
      })
    );

  /*
   * Generic fallback.
   *
   * This keeps the reasoning pipeline valid even
   * for topics that do not yet have a dedicated
   * event template.
   */

  if (!items.length) {
    items.push({
      id:
        "event:generic:1",

      title:
        "The event is becoming more actionable",

      explanation:
        "The supplied planetary and house factors are beginning to work together around the user's question.",

      practicalMeaning:
        "The event is more likely to develop when the supporting chart factors convert into real-world action and measurable progress.",

      role:
        "primary",

      confidence,

      source,
    });
  }

  return {
    id:
      "event",

    heading:
      "Event reasoning",

    summary:
      `This section explains how the supplied astrology combines into a practical ${normalizedTopic === "generic" ? "life event" : normalizedTopic} mechanism.`,

    confidence,

    source,

    items,
  };
}