// FILE: src/server/sarathi/reasoning/riskReasoning.ts

import type {
  ReasoningItem,
  ReasoningSection,
} from "./types";

type Params = {
  topic?: string | null;
  eventType?: string | null;
  timing?: any;
  source?: string;
};

type RiskDefinition = {
  title: string;
  explanation: string;
  practicalMeaning: string;
};

const TOPIC_RISKS: Record<string, RiskDefinition[]> = {
  property: [
    {
      title: "Financial commitment needs careful management",
      explanation:
        "Property decisions can involve substantial expenditure, financing, valuation, and long-term financial obligations.",
      practicalMeaning:
        "Affordability, financing terms, cash flow, and total acquisition cost should be checked before commitment.",
    },
    {
      title: "Timing should not replace due diligence",
      explanation:
        "A supportive astrological period can increase opportunity, but it does not guarantee that every available property is suitable.",
      practicalMeaning:
        "Legal checks, documentation, valuation, location, and property quality still need independent verification.",
    },
  ],

  vehicle: [
    {
      title: "Desire for an upgrade can exceed practical value",
      explanation:
        "Vehicle periods can increase the desire for comfort, mobility, convenience, or a better-quality asset.",
      practicalMeaning:
        "Compare the upgrade against price, financing cost, depreciation, insurance, and actual need.",
    },
    {
      title: "A favorable period does not make every deal favorable",
      explanation:
        "Timing may support movement toward a vehicle purchase, but individual offers can still vary significantly in value.",
      practicalMeaning:
        "Check the vehicle, warranty, financing, resale value, and total ownership cost before committing.",
    },
  ],
job_change: [
  {
    title: "A promising opportunity may not convert immediately",
    explanation:
      "Job-change activity can produce recruiter contact, interviews, discussions, or selection movement without immediately becoming a confirmed offer.",
    practicalMeaning:
      "Treat early movement as progress, but wait for concrete terms, written confirmation, and clarity on role, compensation, and joining conditions before assuming the transition is complete.",
  },
  {
    title: "Leaving too early can increase transition risk",
    explanation:
      "A job change can involve notice periods, offer conditions, approvals, compensation negotiation, background checks, or delays between selection and joining.",
    practicalMeaning:
      "Avoid resigning solely on the strength of verbal interest or astrological timing; make the exit decision only when the new opportunity is sufficiently concrete.",
  },
],
promotion: [
  {
    title:
      "Greater responsibility may arrive before formal promotion",

    explanation:
      "Promotion activity can first show up as expanded scope, additional responsibilities, stronger visibility, or higher expectations before the title or compensation changes.",

    practicalMeaning:
      "Treat increased responsibility as evidence of progression, but look for clear movement toward formal recognition, title change, or compensation improvement.",
  },

  {
    title:
      "Formal approval may depend on organizational factors",

    explanation:
      "Even when promotion potential is active, the final outcome can still depend on management approval, budgets, organizational structure, timing cycles, or internal competition.",

    practicalMeaning:
      "Use the stronger period to build visibility, document contribution, and have explicit progression conversations rather than assuming recognition will convert automatically.",
  },
],
salary_increase: [
  {
    title:
      "Recognition may not immediately convert into higher pay",

    explanation:
      "Strong performance, greater responsibility, or positive feedback can increase salary potential without guaranteeing that compensation changes immediately.",

    practicalMeaning:
      "Treat recognition as progress, but look for a concrete compensation review, revised package, bonus decision, or written confirmation before assuming the financial outcome is complete.",
  },

  {
    title:
      "Compensation decisions may depend on budget and approval cycles",

    explanation:
      "Salary increases can depend on management approval, compensation bands, appraisal cycles, budgets, internal parity, and organizational policy even when the individual's case is strong.",

    practicalMeaning:
      "Use the stronger period to present measurable value, clarify the compensation process, and negotiate explicitly rather than assuming good performance will automatically produce an increment.",
  },
],
  career: [
    {
      title: "Visibility may increase before reward",
      explanation:
        "Career activation can first appear as additional responsibility, pressure, exposure, or expectations rather than an immediate promotion.",
      practicalMeaning:
        "Treat increased responsibility as part of the progression, while continuing to seek clarity on recognition and reward.",
    },
    {
      title: "Timing may depend on external decision-makers",
      explanation:
        "Promotion, hiring, and role changes can depend on management decisions, budgets, approvals, and organizational circumstances.",
      practicalMeaning:
        "Use the stronger period for positioning and conversations rather than assuming the outcome will occur automatically.",
    },
  ],

  marriage: [
    {
      title: "Opportunity does not automatically mean compatibility",
      explanation:
        "Relationship timing can increase introductions, attraction, commitment discussions, or family involvement without guaranteeing long-term compatibility.",
      practicalMeaning:
        "Evaluate values, expectations, communication, and long-term compatibility before formal commitment.",
    },
    {
      title: "Different stages may unfold at different speeds",
      explanation:
        "Meeting, emotional development, family involvement, and formal commitment may not occur within the same short period.",
      practicalMeaning:
        "Allow the relationship to develop naturally instead of treating one timing window as a deadline.",
    },
  ],

  relationships: [
    {
      title: "Emotional momentum can create premature expectations",
      explanation:
        "Stronger relationship periods can intensify communication, attraction, or emotional involvement.",
      practicalMeaning:
        "Look for consistency and mutual intent before assuming that emotional momentum will become commitment.",
    },
  ],

  business: [
    {
      title: "Opportunity must convert into commercial viability",
      explanation:
        "A supportive business period can create contacts, ideas, negotiations, or expansion opportunities without guaranteeing profitable execution.",
      practicalMeaning:
        "Validate demand, margins, funding, execution capacity, and commercial terms before scaling.",
    },
    {
      title: "Expansion can increase financial exposure",
      explanation:
        "Growth periods can encourage faster investment, hiring, borrowing, or operational commitments.",
      practicalMeaning:
        "Protect cash flow and avoid expanding faster than the underlying business can support.",
    },
  ],

  money: [
    {
      title: "Higher opportunity can also increase financial risk",
      explanation:
        "Periods associated with gains can encourage larger financial decisions or increased confidence.",
      practicalMeaning:
        "Separate genuine improvement in financial capacity from temporary optimism or speculative decisions.",
    },
  ],

  relocation: [
    {
      title: "Movement can involve hidden practical costs",
      explanation:
        "Relocation can activate travel, documentation, housing, employment, family adjustment, and settlement expenses simultaneously.",
      practicalMeaning:
        "Plan for documentation, housing, transition costs, and sufficient financial reserves before moving.",
    },
  ],
  health_recovery: [
  {
    title:
      "Temporary improvement should not be mistaken for sustained recovery",

    explanation:
      "Health conditions can improve unevenly, with periods of relief followed by fluctuation, recurrence, or the need for continued management.",

    practicalMeaning:
      "Look for consistent improvement over time rather than assuming that one better day, reduced symptom, or encouraging response means the recovery process is complete.",
  },

  {
    title:
      "Astrological timing should not replace medical care",

    explanation:
      "A supportive period can describe better recovery potential, treatment response, routine correction, or greater stability, but it cannot diagnose a condition or determine the appropriate medical treatment.",

    practicalMeaning:
      "Continue qualified medical guidance, prescribed treatment, follow-up, and necessary testing regardless of whether the astrological period appears supportive.",
  },
],
higher_education: [
  {
    title:
      "A supportive study period does not guarantee admission or completion",

    explanation:
      "Higher education still depends on eligibility, application quality, admission requirements, finances, available time, and the suitability of the chosen course or institution.",

    practicalMeaning:
      "Confirm entry requirements, costs, workload, accreditation, and practical career value before committing to a programme.",
  },

  {
    title:
      "Choosing the wrong course can weaken the value of the opportunity",

    explanation:
      "A favourable education period can support learning and qualification, but the benefit depends on whether the programme genuinely strengthens skills, credentials, or future prospects.",

    practicalMeaning:
      "Prioritize programmes that have clear relevance to your goals rather than enrolling only because the timing appears supportive.",
  },
],
childbirth_timing: [
  {
    title:
      "Supportive timing does not guarantee conception or childbirth",

    explanation:
      "Astrological timing can describe periods that are more supportive for family expansion, but conception, pregnancy, and childbirth depend on biological, medical, and personal factors that astrology cannot determine.",

    practicalMeaning:
      "Use the timing as a planning aid only, and rely on appropriate medical guidance for fertility, pregnancy, and childbirth decisions.",
  },

  {
    title:
      "Pregnancy and family expansion may not follow a fixed timeline",

    explanation:
      "Even during a supportive period, conception may take time and pregnancy can involve medical, practical, or family circumstances that affect how the process unfolds.",

    practicalMeaning:
      "Avoid treating the practical window as a deadline. Focus on preparation, medical advice, and real-world readiness rather than expecting a guaranteed result within a specific date range.",
  },
],
dispute_resolution: [
  {
    title:
      "Supportive timing does not guarantee a favourable legal outcome",
    explanation:
      "A stronger dispute-resolution period can support negotiation, legal movement, settlement efforts, or progress toward closure, but the final outcome still depends on the facts of the case, applicable law, evidence, counterparties, advisers, and formal decision-makers.",
    practicalMeaning:
      "Use the timing to identify periods that may be more constructive for resolution efforts, while relying on qualified legal advice and the actual merits of the case for legal decisions.",
  },
  {
    title:
      "Resolution may develop through negotiation rather than a court decision",
    explanation:
      "A dispute can move toward closure through settlement discussions, mediation, procedural developments, withdrawal, agreement, or a formal ruling, so stronger timing does not identify one guaranteed route to resolution.",
    practicalMeaning:
      "Remain open to different legitimate paths to closure and evaluate settlement or negotiation opportunities on their real-world legal and financial merits.",
  },
],
employment_risk: [
  {
    title:
      "Career pressure should not be interpreted automatically as job loss",

    explanation:
      "Employment-risk indicators can manifest through heavier workload, management pressure, restructuring, reporting-line changes, role uncertainty, reduced visibility, reassignment, or concern about continuity without producing termination.",

    practicalMeaning:
      "Give more weight to objective workplace signals such as formal restructuring, documented performance concerns, redundancy discussions, role elimination, or direct management communication than to timing indicators alone.",
  },

  {
    title:
      "Actual separation depends on organizational and real-world decisions",

    explanation:
      "Even when the period shows instability, whether employment continues or ends still depends on business conditions, organizational decisions, performance, contractual arrangements, management actions, and available alternatives.",

    practicalMeaning:
      "Treat the period as one requiring greater awareness and preparation rather than as a prediction that termination must occur.",
  },
],
financial_loss_risk: [
  {
    title:
      "Financial pressure should not automatically be interpreted as major loss",
    explanation:
      "Higher expenses, temporary investment volatility, reduced savings, or liquidity pressure can activate the relevant financial houses without producing a major or permanent loss of wealth.",
    practicalMeaning:
      "Judge the period by actual changes in savings, debt, investments, liabilities, cash flow, and asset values rather than assuming that every financial strain will become a major loss.",
  },
  {
    title:
      "Real financial exposure determines whether pressure becomes material loss",
    explanation:
      "The practical risk becomes greater when financial pressure combines with leverage, speculative exposure, concentrated investments, large commitments, unexpected liabilities, weak liquidity, or decisions that make losses difficult to absorb.",
    practicalMeaning:
      "Pay particular attention to large investments, borrowing, guarantees, speculative decisions, major purchases, unusual payment obligations, and any situation that could materially reduce available capital.",
  },
],
relationship_breakdown_risk: [
  {
    title:
      "Relationship strain should not automatically be interpreted as separation",
    explanation:
      "Arguments, emotional distance, temporary withdrawal, reduced communication, or a difficult relationship phase can activate the relevant partnership and disruption factors without producing a permanent breakup or divorce.",
    practicalMeaning:
      "Judge the period by whether tension is temporary and repairable or whether there is sustained deterioration in trust, communication, commitment, and willingness to continue the relationship.",
  },
  {
    title:
      "Actual separation depends on real deterioration in relationship continuity",
    explanation:
      "The practical risk becomes greater when strain develops into prolonged emotional or physical distance, repeated unresolved conflict, withdrawal of commitment, separate living arrangements, formal breakup discussions, or legal steps toward separation.",
    practicalMeaning:
      "Give greater weight to repeated real-world signs of relationship discontinuity than to one argument, a difficult week, temporary silence, or astrology alone.",
  },
],
};

function normalizeTopic(
  topic?: string | null
): string {
  const value = String(topic ?? "")
    .toLowerCase()
    .trim();

  if (value === "home") return "property";
  if (value === "car") return "vehicle";
  if (value === "relationship") return "relationships";

  return value || "generic";
}

export function buildRiskReasoning(
  params: Params
): ReasoningSection {
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

const riskKey =
  eventType &&
  TOPIC_RISKS[eventType]
    ? eventType
    : topic;

const definitions =
  TOPIC_RISKS[riskKey] ?? [
      {
        title: "The outcome still depends on practical conditions",
        explanation:
          "Astrological support can describe stronger periods and tendencies, but external circumstances still influence how an event develops.",
        practicalMeaning:
          "Use the timing as guidance while continuing to evaluate real-world information before making important decisions.",
      },
    ];

  const items: ReasoningItem[] =
    definitions.map((risk, index) => ({
      id: `risk:${riskKey}:${index + 1}`,

      title: risk.title,

      explanation: risk.explanation,

      practicalMeaning:
        risk.practicalMeaning,

      role:
        index === 0
          ? "primary"
          : "supporting",

      confidence:
        index === 0
          ? "high"
          : "medium",

      source:
        params.source ??
        "event-specific risk assessment",
    }));

  return {
    id: "risk",

    heading: "Risks and cautions",

    summary:
      "These factors could delay, weaken, or complicate the expected outcome and should be considered alongside the supportive indicators.",

    confidence: "medium",

    source:
      params.source ??
      "event-specific risk assessment",

    items,
  };
}