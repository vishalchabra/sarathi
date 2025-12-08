// FILE: src/server/sarathi/guidance.ts

/**
 * Minimal types for this module only. We keep them local so the file is
 * self-contained and can be imported by /api/qa without type bleed.
 */
type Persona = {
  style?: "coach" | "calm" | "direct";
  [k: string]: any;
};

type GuidanceInput = {
  topic: string;                 // job | health | marriage | ...
  persona?: Persona;
  nowLabel?: string;
  windows?: Array<any>;
  byAD?: Array<any>;
  plan?: {
    quarters?: Array<any>;
    micro?: Array<any>;
  } | any;
  remedies?: string[] | { items?: string[] } | any;
};

/**
 * Normalize and return a concise set of guidance tips (string[]).
 * - If explicit remedies were passed, prefer them.
 * - Otherwise generate topic-aware defaults.
 * - Always dedupe and trim.
 */
export function buildGuidance(input: GuidanceInput): string[] {
  const topic = String(input.topic || "").toLowerCase();

  // 1) Normalize remedies -> string[]
  const normalizedRemedies: string[] = Array.isArray(input.remedies)
    ? (input.remedies as string[])
    : Array.isArray((input.remedies || {}).items)
    ? ((input.remedies.items as unknown[]) || []).map(String)
    : [];

  // 2) Topic-aware defaults (used when no remedies provided)
  const defaultCommon = [
    "Steady pipeline; track outcomes weekly.",
    "Prefer warm referrals; portfolio above the fold.",
    "Avoid impulsive switches; write decisions down.",
  ];

  const topicExtras: Record<string, string[]> = {
    job: [
      "Batch outreach into 2 focused blocks/week.",
      "Practice mock interviews aloud (2x/week).",
      "Anchor on scope → impact → comp in negotiations.",
    ],
    health: [
      "Prioritize sleep and gentle movement; track symptoms.",
      "Keep a short food & meds log; review weekly.",
      "Avoid major changes during low-energy sub-windows.",
    ],
    marriage: [
      "Align families early; keep documents ready.",
      "Use strongest sub-window for formal steps.",
      "Plan logistics during supportive Venus periods.",
    ],
    wealth: [
      "Automate savings; review allocations monthly.",
      "Stagger entries instead of lump-sum moves.",
      "Prefer instruments you can explain in 1 minute.",
    ],
    property: [
      "Shortlist areas first; separate ‘musts’ vs ‘nice-to-haves’.",
      "Lock financing docs before site visits.",
      "Negotiate in writing; insist on contingencies.",
    ],
    vehicle: [
      "Decide class & budget; get pre-approval first.",
      "Compare TCO (insurance, service) not sticker price.",
      "Close during supportive mid/late sub-window.",
    ],
    disputes: [
      "Document facts; avoid emotional decisions.",
      "Consult counsel during supportive Mercury/Jupiter windows.",
      "Prefer settlements over escalations where possible.",
    ],
    relationships: [
      "Keep communication clear & paced.",
      "Plan low-stakes meetings during supportive windows.",
      "Avoid big decisions inside short volatile sub-windows.",
    ],
  };

  const topicList = topicExtras[topic] || [];

  // 3) Final list selection
  const chosen = normalizedRemedies.length ? normalizedRemedies : [...topicList, ...defaultCommon];

  // 4) Dedupe + trim + cap length
  const cleaned = Array.from(
    new Set(chosen.map((s) => String(s || "").trim()).filter(Boolean))
  ).slice(0, 8);

  return cleaned;
}
