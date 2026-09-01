// FILE: src/server/sarathi/reasoning/actionReasoning.ts

import type {
  ReasoningItem,
  ReasoningSection,
} from "./types";

type Params = {
  topic?: string | null;
  eventType?: string | null;

  timing?: any;

  sequence?: ReasoningSection | null;
  risks?: ReasoningSection | null;

  source?: string;
};

type ActionDefinition = {
  title: string;
  explanation: string;
  practicalMeaning: string;
};

/* --------------------------------------------------
   Topic-specific actions
-------------------------------------------------- */

const TOPIC_ACTIONS: Record<
  string,
  ActionDefinition[]
> = {
  property: [
    {
      title: "Prepare finances before the main window",
      explanation:
        "Property opportunities convert more easily when funding, affordability, and documentation are already clear.",
      practicalMeaning:
        "Review savings, mortgage eligibility, down payment, fees, and borrowing capacity before making a commitment.",
    },
    {
      title: "Use the stronger period for serious decisions",
      explanation:
        "The practical timing window is more important than an isolated activation date.",
      practicalMeaning:
        "Research and shortlist earlier, but prioritize serious negotiation, commitment, or purchase during the main actionable window.",
    },
  ],

  vehicle: [
    {
      title: "Define the purchase before acting",
      explanation:
        "Vehicle activation can increase the desire to upgrade, so practical requirements should be clear before choosing.",
      practicalMeaning:
        "Set your budget, financing limit, preferred vehicle type, and essential features before committing.",
    },
    {
      title: "Use the practical window for conversion",
      explanation:
        "The stronger timing period is better suited to turning consideration into an actual vehicle decision.",
      practicalMeaning:
        "Use the main actionable window for shortlisting, negotiation, financing, booking, or purchase rather than relying on one trigger date.",
    },
  ],
job_change: [
  {
    title: "Create active job-change momentum",
    explanation:
      "A job change is more likely to convert when opportunities are actively created rather than waiting for the final outcome to appear.",
    practicalMeaning:
      "Update your profile and CV, activate recruiter and professional-network conversations, identify suitable roles, and make targeted applications.",
  },
  {
    title: "Use the actionable period for conversion",
    explanation:
      "The stronger period is best used to move opportunities from initial contact into interviews, selection, negotiation, and a concrete offer.",
    practicalMeaning:
      "Prioritize interviews, serious role discussions, compensation negotiation, and offer evaluation during the main actionable window.",
  },
],
promotion: [
  {
    title:
      "Make your contribution visible before asking for progression",

    explanation:
      "Promotion is more likely to convert when responsibility, measurable results, and stakeholder visibility are already established.",

    practicalMeaning:
      "Document achievements, quantify your impact, strengthen management visibility, and make sure your contribution is clearly recognized.",
  },

  {
    title:
      "Use the stronger period for an explicit progression conversation",

    explanation:
      "The actionable period is best used to move recognition into a concrete discussion about role, title, responsibility, or compensation.",

    practicalMeaning:
      "Have a direct promotion or progression conversation, clarify expectations and decision criteria, and negotiate the formal outcome when management engagement is strongest.",
  },
],
salary_increase: [
  {
    title:
      "Build a measurable compensation case",

    explanation:
      "Salary growth is more likely to convert when professional value is demonstrated through measurable contribution, responsibility, and business impact.",

    practicalMeaning:
      "Document achievements, quantify results, benchmark your current responsibilities, and prepare a clear case for why your compensation should increase.",
  },

  {
    title:
      "Use the stronger period for an explicit compensation discussion",

    explanation:
      "The actionable period is best used to move professional value into a concrete salary review, negotiation, or remuneration decision.",

    practicalMeaning:
      "Initiate or advance a direct compensation conversation, clarify the approval process and budget cycle, and negotiate salary, bonus, or total package based on measurable value.",
  },
],
  career: [
    {
      title: "Increase visibility before the stronger window",
      explanation:
        "Career outcomes are more likely to convert when responsibility and contribution are already visible.",
      practicalMeaning:
        "Document achievements, strengthen stakeholder visibility, and make your career intentions clear.",
    },
    {
      title: "Use the actionable period for decisive conversations",
      explanation:
        "The stronger career period should be used for movement rather than passive expectation.",
      practicalMeaning:
        "Use it for promotion discussions, interviews, applications, negotiation, or role-change decisions.",
    },
  ],

  business: [
    {
      title: "Validate demand before expanding",
      explanation:
        "Commercial opportunity is strongest when actual customer demand supports the idea.",
      practicalMeaning:
        "Test pricing, customer interest, margins, and repeatability before committing substantial capital.",
    },
    {
      title: "Convert opportunity into measurable activity",
      explanation:
        "Business timing becomes meaningful when conversations turn into contracts, customers, or revenue.",
      practicalMeaning:
        "Use the stronger period for proposals, negotiations, partnerships, launches, and revenue-generating activity.",
    },
  ],

  marriage: [
    {
      title: "Allow compatibility to become clear",
      explanation:
        "A supportive relationship period can create opportunities for connection, but commitment should follow genuine compatibility.",
      practicalMeaning:
        "Pay attention to values, communication, emotional maturity, family expectations, and long-term goals.",
    },
    {
      title: "Use the stronger period for relationship progression",
      explanation:
        "The actionable period is more useful for developing or formalizing a genuine relationship than treating one date as destiny.",
      practicalMeaning:
        "Be open to introductions, meaningful conversations, commitment discussions, and family involvement during the stronger phase.",
    },
  ],

  relationships: [
    {
      title: "Prioritize clarity and consistency",
      explanation:
        "Relationship momentum becomes meaningful when communication and intent remain consistent.",
      practicalMeaning:
        "Judge the relationship through repeated behavior and mutual effort rather than one intense interaction.",
    },
  ],

  money: [
    {
      title: "Convert gains into stronger financial foundations",
      explanation:
        "Financial opportunity becomes more valuable when additional resources improve long-term stability.",
      practicalMeaning:
        "Prioritize savings, debt reduction, reserves, and productive use of additional income.",
    },
    {
      title: "Avoid treating stronger timing as permission to speculate",
      explanation:
        "Supportive financial periods can increase confidence as well as opportunity.",
      practicalMeaning:
        "Keep investment and spending decisions tied to affordability, evidence, and risk tolerance.",
    },
  ],

  relocation: [
    {
      title: "Prepare the practical foundation first",
      explanation:
        "Relocation becomes easier when documentation, employment, housing, and finances are aligned.",
      practicalMeaning:
        "Prepare visas or approvals, financial reserves, housing research, and transition planning before the move.",
    },
    {
      title: "Use the stronger window for execution",
      explanation:
        "The practical period is more suitable for converting relocation planning into concrete movement.",
      practicalMeaning:
        "Prioritize applications, approvals, housing commitments, travel, or the actual move during the stronger period.",
    },
  ],
  health_recovery: [
  {
    title:
      "Create the conditions for consistent recovery",

    explanation:
      "Health improvement is more likely to become sustainable when treatment, routine, rest, follow-up, and day-to-day habits support the recovery process.",

    practicalMeaning:
      "Follow qualified medical guidance, keep necessary appointments and testing on schedule, and make sleep, nutrition, medication or treatment adherence, and recovery routines as consistent as possible.",
  },

  {
    title:
      "Use the supportive period to strengthen recovery momentum",

    explanation:
      "The stronger period is better used to reinforce treatment response, routine correction, monitoring, and gradual stabilization than to expect an immediate one-day recovery.",

    practicalMeaning:
      "Track changes over time, discuss meaningful improvement or recurring symptoms with the appropriate healthcare professional, and use the supportive period to build a more stable and manageable health routine.",
  },
],
higher_education: [
  {
    title:
      "Prepare the application and study plan before the stronger period",

    explanation:
      "Higher education converts more effectively when course selection, eligibility, documents, finances, and preparation are already in place.",

    practicalMeaning:
      "Use the period beforehand to shortlist suitable programmes, confirm admission requirements, prepare documents or entrance tests, and plan the financial and time commitment.",
  },

  {
    title:
      "Use the stronger period for admission and enrollment decisions",

    explanation:
      "The practical window is better suited to concrete education movement than to passive consideration alone.",

    practicalMeaning:
      "Prioritize applications, admission decisions, enrollment, course commencement, or other concrete steps during the stronger period while still evaluating the programme on practical merit.",
  },
],
childbirth_timing: [
  {
    title:
      "Prepare practically before the stronger period",

    explanation:
      "Family expansion is better approached with practical, personal, and medical preparation already in place rather than relying on timing alone.",

    practicalMeaning:
      "Use the period beforehand to discuss family plans, consider practical readiness, and seek appropriate medical guidance where relevant.",
  },

  {
    title:
      "Use the stronger period as a planning window, not a deadline",

    explanation:
      "The practical window represents comparatively stronger astrological support for family expansion, but it cannot guarantee conception, pregnancy, or childbirth within that period.",

    practicalMeaning:
      "Give greater weight to the stronger period for family-planning efforts while allowing biological, medical, and personal circumstances to determine how the process actually unfolds.",
  },
],
dispute_resolution: [
  {
    title:
      "Prepare the case before the stronger period",
    explanation:
      "Dispute resolution is more likely to progress constructively when the facts, documents, objectives, legal position, and negotiation boundaries are already clear.",
    practicalMeaning:
      "Use the period beforehand to organize evidence, clarify the desired outcome, review the legal position with appropriate advisers, and identify realistic settlement or negotiation parameters.",
  },
  {
    title:
      "Use the stronger period for concrete resolution efforts",
    explanation:
      "The practical window is better suited to active negotiation, formal engagement, settlement discussions, mediation, procedural movement, or other legitimate steps toward closure than to passive waiting.",
    practicalMeaning:
      "Give greater weight to the stronger period for constructive resolution efforts while continuing to base every legal decision on professional advice and the actual circumstances of the dispute.",
  },
],
employment_risk: [
  {
    title:
      "Strengthen employment continuity before the higher-risk period",

    explanation:
      "If the period brings greater pressure or organizational uncertainty, practical preparation can reduce vulnerability and improve the range of available outcomes.",

    practicalMeaning:
      "Document performance and achievements, clarify expectations with management, maintain stakeholder visibility, address known performance gaps, and keep important employment records and communications organized.",
  },

  {
    title:
      "Prepare alternatives without assuming that job loss will occur",

    explanation:
      "Employment instability is easier to manage when professional and financial options exist before any formal separation decision is made.",

    practicalMeaning:
      "Discreetly update the CV, maintain relevant professional relationships, monitor suitable opportunities, preserve an emergency financial buffer where possible, and respond to concrete workplace signals rather than acting solely from fear of termination.",
  },
],
financial_loss_risk: [
  {
    title:
      "Protect liquidity and reduce avoidable financial exposure",
    explanation:
      "A risk period is better managed by strengthening financial resilience rather than assuming that a loss must occur.",
    practicalMeaning:
      "Maintain adequate reserves, review major liabilities and commitments, avoid unnecessary leverage, and make sure large financial decisions can be absorbed without destabilizing your overall position.",
  },
  {
    title:
      "Use evidence before making major financial decisions",
    explanation:
      "Financial pressure can become more damaging when decisions are driven by fear, excessive confidence, speculation, or incomplete information.",
    practicalMeaning:
      "Review investment exposure, contracts, borrowing, guarantees, and major purchases carefully. Avoid panic-selling or taking speculative positions merely because astrology identifies a higher-monitoring period.",
  },
],
relationship_breakdown_risk: [
  {
    title:
      "Strengthen communication and relationship continuity before assuming the worst",
    explanation:
      "A period of relationship pressure is better handled by clarifying concerns and observing whether both people remain willing to repair the relationship rather than treating tension as proof of separation.",
    practicalMeaning:
      "Address recurring issues directly, clarify expectations, maintain respectful communication, and look for consistent willingness from both sides to resolve problems and preserve the relationship.",
  },
  {
    title:
      "Respond to concrete relationship signals rather than fear",
    explanation:
      "Temporary emotional distance can feel more serious than it is, especially during a stressful period. Major decisions should be based on sustained patterns and actual discussions rather than prediction alone.",
    practicalMeaning:
      "Pay attention to repeated withdrawal, unresolved conflict, loss of commitment, separate-living discussions, or explicit breakup or divorce conversations. Avoid making irreversible decisions solely because astrology identifies a higher-monitoring period.",
  },
],
};

/* --------------------------------------------------
   Helpers
-------------------------------------------------- */

function normalizeTopic(
  topic?: string | null
): string {
  const value = String(topic ?? "")
    .toLowerCase()
    .trim();

  if (value === "home") {
    return "property";
  }

  if (value === "car") {
    return "vehicle";
  }

  if (value === "relationship") {
    return "relationships";
  }

  return value || "generic";
}

function formatWindow(
  window: any
): string | null {
  if (
    !window?.start ||
    !window?.end
  ) {
    return null;
  }

  return `${window.start} to ${window.end}`;
}

/* --------------------------------------------------
   Builder
-------------------------------------------------- */

export function buildActionReasoning(
  params: Params
): ReasoningSection {
  const {
    timing,
    sequence,
    risks,
    source =
      "timing, sequence and risk synthesis",
  } = params;

  const topic =
  normalizeTopic(
    params.topic
  );

const eventType =
  String(
    params.eventType ?? ""
  )
    .toLowerCase()
    .trim();

const actionKey =
  eventType &&
  TOPIC_ACTIONS[eventType]
    ? eventType
    : topic;

const definitions =
  TOPIC_ACTIONS[actionKey] ?? [
      {
        title:
          "Prepare before the stronger period",
        explanation:
          "The event is more likely to convert when practical preparation is already in place.",
        practicalMeaning:
          "Use the period beforehand to gather information, prepare resources, and remove avoidable obstacles.",
      },
      {
        title:
          "Act when the practical window opens",
        explanation:
          "The main actionable period should carry more weight than an isolated trigger date.",
        practicalMeaning:
          "Use the stronger window for concrete decisions while continuing to evaluate real-world circumstances.",
      },
    ];

  const items: ReasoningItem[] =
    definitions.map(
      (
        action,
        index
      ): ReasoningItem => ({
        id:
           `action:${actionKey}:${index + 1}`,

        title:
          action.title,

        explanation:
          action.explanation,

        practicalMeaning:
          action.practicalMeaning,

        role:
          index === 0
            ? "primary"
            : "supporting",

        confidence:
          index === 0
            ? "high"
            : "medium",

        source,
      })
    );

  /* ------------------------------------------------
     Timing-aware action

     This is dynamic and uses the actual practical
     window selected by the Timing Hierarchy.
  ------------------------------------------------ */

  const practicalWindow =
    timing?.practicalWindow ??
    null;

  const practicalRange =
    formatWindow(
      practicalWindow
    );

  if (practicalRange) {
    items.push({
      id:
        "action:timing",

      title:
        "Prioritize the main actionable window",

      explanation:
        `${practicalRange} is the primary working period selected by the timing hierarchy.`,

      practicalMeaning:
        "Preparation can begin earlier, but major decisions should give greater weight to this practical period than to an isolated transit trigger.",

      role:
        "primary",

      confidence:
        practicalWindow
          ?.confidence ??
        "medium",

      source,
    });
  }

  /* ------------------------------------------------
     Sequence-aware action

     Use the first stage as the immediate next step.
  ------------------------------------------------ */

  const firstSequenceStep =
    sequence?.items?.[0];

  if (
    firstSequenceStep
      ?.explanation
  ) {
    items.push({
      id:
        "action:next-step",

      title:
        "Start with the first practical stage",

      explanation:
        `The expected event sequence begins with: ${firstSequenceStep.explanation}.`,

      practicalMeaning:
        "This is the most useful immediate step instead of trying to force the final outcome before the process has developed.",

      role:
        "supporting",

      confidence:
        firstSequenceStep
          .confidence ??
        "medium",

      source,
    });
  }

  /* ------------------------------------------------
     Risk-aware action

     Convert the primary risk into something the
     user should actively manage.
  ------------------------------------------------ */

  const primaryRisk =
    risks?.items?.find(
      (item) =>
        item.role ===
        "primary"
    ) ??
    risks?.items?.[0];

  if (
    primaryRisk
      ?.practicalMeaning
  ) {
    items.push({
      id:
        "action:risk-management",

      title:
        "Manage the main practical risk",

      explanation:
        primaryRisk.title,

      practicalMeaning:
        primaryRisk
          .practicalMeaning,

      role:
        "supporting",

      confidence:
        primaryRisk
          .confidence ??
        "medium",

      source,
    });
  }

  return {
    id:
      "action",

    heading:
      "Recommended actions",

    summary:
      "These are the most useful practical steps based on the event, timing, expected sequence, and identified risks.",

    confidence:
      timing
        ?.overallConfidence ??
      "medium",

    source,

    items,
  };
}