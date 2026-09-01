// FILE: reasoning/sequenceReasoning.ts

import type {
  ReasoningItem,
  ReasoningSection,
} from "./types";

type Params = {
  topic?: string | null;
  eventType?: string | null;
  source?: string;
};

const EVENT_SEQUENCES: Record<
  string,
  string[]
> = {
  property: [
    "Preparation and planning",
    "Property search becomes active",
    "Negotiation or financial arrangement",
    "Commitment or agreement",
    "Purchase, registration or possession",
  ],

  vehicle: [
    "Research and comparison",
    "Shortlisting",
    "Financial decision",
    "Booking or purchase",
    "Delivery or handover",
  ],
job_change: [
  "Search, application or recruiter contact",
  "Interview or serious role discussion",
  "Offer or selection movement",
  "Resignation or exit decision",
  "New role or employer change",
],
promotion: [
  "Greater responsibility or expanded scope",
  "Recognition and stronger management visibility",
  "Promotion or progression discussion",
  "Management approval or formal decision",
  "Title, responsibility, or compensation progression",
],
salary_increase: [
  "Performance or professional value becomes visible",
  "Compensation review or salary discussion begins",
  "Negotiation or internal decision-making",
  "Management or budget approval",
  "Salary, bonus, or total compensation increases",
],
  career: [
    "Greater responsibility",
    "Recognition or visibility",
    "Discussion or interview",
    "Decision",
    "Role or promotion",
  ],

  marriage: [
    "Meaningful interaction",
    "Relationship develops",
    "Commitment discussions",
    "Family involvement",
    "Marriage or formal commitment",
  ],

  relationships: [
    "Communication",
    "Emotional connection",
    "Mutual understanding",
    "Commitment",
  ],

  business: [
    "Idea validation",
    "Customer conversations",
    "Commercial agreement",
    "Revenue generation",
    "Business expansion",
  ],

  money: [
    "Opportunity appears",
    "Income improves",
    "Savings accumulate",
    "Financial stability",
  ],

  relocation: [
    "Planning",
    "Documentation",
    "Approval",
    "Move",
    "Settlement",
  ],
  health_recovery: [
  "Assessment or clearer understanding of the health issue",
  "Care, treatment or routine correction begins",
  "Initial response and stabilization",
  "Measurable improvement",
  "Greater health stability or more manageable symptoms",
],
higher_education: [
  "Course or qualification exploration",
  "Application or preparation",
  "Admission or enrollment",
  "Study and skill development",
  "Qualification or completion",
],
childbirth_timing: [
  "Family planning and preparation",
  "Conception possibility",
  "Pregnancy development",
  "Medical and practical monitoring",
  "Childbirth and family expansion",
],
dispute_resolution: [
  "Issue clarification and case preparation",
  "Negotiation or legal engagement",
  "Movement toward settlement or decision",
  "Formal resolution or agreement",
  "Closure and implementation",
],
employment_risk: [
  "Work pressure or organizational signals",
  "Role uncertainty or employment instability",
  "Management, restructuring, or continuity decision",
  "Role continuation, reassignment, or separation",
  "Stabilization in the current or a new employment setup",
],
financial_loss_risk: [
  "Financial pressure, expense, or exposure signals emerge",
  "Liquidity, savings, or investment position comes under strain",
  "Financial decisions or obligations determine whether pressure increases",
  "Resources are preserved or measurable financial loss occurs",
  "Financial position stabilizes or begins to recover",
],
relationship_breakdown_risk: [
  "Relationship tension, communication strain, or emotional distance emerges",
  "Instability or reduced partnership continuity becomes more noticeable",
  "The relationship reaches a decision, repair, or reassessment stage",
  "The relationship stabilizes and reconnects or moves toward separation",
  "A more stable relationship position is established",
],
};

function normalizeTopic(
  topic?: string |null
){
  const t = String(topic ?? "")
    .toLowerCase()
    .trim();

  if (t === "home")
    return "property";

  if (t === "car")
    return "vehicle";

  if (t === "relationship")
    return "relationships";

  return t || "generic";
}

export function buildSequenceReasoning(
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

const sequenceKey =
  eventType &&
  EVENT_SEQUENCES[eventType]
    ? eventType
    : topic;

const sequence =
  EVENT_SEQUENCES[
    sequenceKey
  ] ??
  [
    "Preparation",
    "Development",
    "Decision",
    "Completion",
  ];

  const items: ReasoningItem[] =
    sequence.map(
      (
        step,
        index
      ) => ({
        id:
          `sequence:${index+1}`,

        title:
          `Step ${index+1}`,

        explanation:
          step,

        practicalMeaning:
          index === 0
            ? "This is usually where the process begins."
            : index === sequence.length-1
            ? "This represents the visible completion of the event."
            : "This is a transitional stage leading toward the final outcome.",

        role:
          index===0
            ? "primary"
            : "supporting",

        confidence:
          "medium",

        source:
          params.source ??
          "event progression",
      })
    );

  return {

    id:"sequence",

    heading:
      "Likely sequence",

    summary:
      "This is the most likely progression through which the event develops.",

    confidence:
      "medium",

    source:
      params.source ??
      "event progression",

    items,
  };

}