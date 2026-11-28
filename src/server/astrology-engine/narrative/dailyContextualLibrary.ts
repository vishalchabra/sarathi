import type { LifeArea, PlanetName } from "../types";

import {
  getNakshatraPadaData,
} from "../knowledge/nakshatraPadaData";

import {
  getPadaInterpretation,
} from "../../../lib/astro/nakshatraPadaInterpretations";

import {
  NAKSHATRA_KNOWLEDGE,
} from "../knowledge/nakshatras";

const PLANET_ORDER: readonly PlanetName[] = [
  "Sun", "Moon", "Mars", "Mercury",
  "Jupiter", "Venus", "Saturn", "Rahu", "Ketu",
];

// Each row follows PLANET_ORDER.
// These are contextual themes, not independent event claims.

const CONTEXT: Record<LifeArea, readonly string[]> = {
  career: [
    "expectations from decision-makers",
    "changing professional priorities",
    "execution and competing deadlines",
    "professional correspondence and negotiations",
    "guidance and professional development",
    "cooperation and commercial relationships",
    "outstanding approvals and responsibilities",
    "unfamiliar professional possibilities",
    "reassessment of existing work priorities",
  ],
  money: [
    "financial decisions requiring accountability",
    "changing household requirements",
    "the urgency of financial commitments",
    "payment details and financial documentation",
    "longer-term financial considerations",
    "personal spending priorities and agreements",
    "existing obligations and available resources",
    "unfamiliar financial alternatives",
    "the value of reducing unnecessary commitments",
  ],
  relationships: [
    "individual expectations and mutual respect",
    "emotional needs and changing responses",
    "differences in approach and personal boundaries",
    "the clarity of interpersonal communication",
    "shared principles and mutual understanding",
    "affection and reciprocal consideration",
    "responsibilities and realistic expectations",
    "unfamiliar expectations within a connection",
    "the need to reconsider established patterns",
  ],
  family: [
    "family decisions and individual responsibilities",
    "the emotional needs of family members",
    "practical tasks requiring coordination",
    "household discussions and shared information",
    "guidance and understanding within the family",
    "shared preferences and family arrangements",
    "existing family obligations",
    "changes to familiar family expectations",
    "simplifying established family arrangements",
  ],
  children: [
    "confidence and individual development",
    "emotional reassurance and everyday needs",
    "initiative and participation in activities",
    "learning feedback and communication",
    "guidance and educational development",
    "creative interests and social participation",
    "routines and consistent encouragement",
    "new interests and unfamiliar experiences",
    "reconsidering an existing approach to support",
  ],
  education: [
    "independent understanding and confidence",
    "concentration and changing learning priorities",
    "practical application of knowledge",
    "research and the exchange of information",
    "deeper understanding of an existing subject",
    "creative approaches to learning",
    "structured study and sustained effort",
    "unfamiliar subjects and alternative methods",
    "reviewing assumptions about existing knowledge",
  ],
  home: [
    "ownership of domestic responsibilities",
    "comfort and everyday household routines",
    "maintenance and practical domestic tasks",
    "household coordination and arrangements",
    "the usefulness of existing living arrangements",
    "comfort and shared preferences at home",
    "unfinished domestic responsibilities",
    "alternative ways of organising the home",
    "simplifying household routines",
  ],
  property: [
    "responsibility for property-related decisions",
    "personal requirements within living arrangements",
    "practical maintenance and physical requirements",
    "documentation and administrative communication",
    "longer-term housing considerations",
    "shared preferences and property agreements",
    "existing contractual and maintenance obligations",
    "unfamiliar property-related alternatives",
    "reassessment of existing housing requirements",
  ],
  travel: [
    "the purpose and priority of existing plans",
    "changing schedules and personal requirements",
    "practical preparation and timing",
    "itineraries and appointment communication",
    "the broader purpose of a planned visit",
    "coordination with travelling companions",
    "schedules and external commitments",
    "unfamiliar routes and alternative arrangements",
    "simplifying an existing itinerary",
  ],
  communication: [
    "clarity when expressing a decision",
    "the emotional tone of an exchange",
    "directness and timing when responding",
    "messages and outstanding information",
    "the broader meaning of a conversation",
    "diplomacy and shared understanding",
    "precision and outstanding responses",
    "unfamiliar information and differing perspectives",
    "reviewing assumptions in an earlier exchange",
  ],
  mind: [
    "personal priorities and expectations",
    "emotional responses to everyday demands",
    "the balance between urgency and concentration",
    "organising competing information",
    "perspective on an existing concern",
    "the balance between obligations and enjoyment",
    "managing responsibilities at a realistic pace",
    "competing interests and unfamiliar possibilities",
    "reducing unnecessary mental distractions",
  ],
  health: [
    "consistency in everyday wellbeing routines",
    "rest and awareness of everyday needs",
    "balancing activity with appropriate recovery",
    "organising practical wellbeing information",
    "sustainable everyday habits",
    "balance between comfort and routine",
    "regularity and manageable daily routines",
    "maintaining perspective on unfamiliar advice",
    "simplifying unnecessary routine commitments",
  ],
  spirituality: [
    "personal principles and their practical meaning",
    "reflection on emotional responses",
    "applying personal beliefs through practical action",
    "questions arising from reading or discussion",
    "philosophical understanding and experienced guidance",
    "the relationship between personal values and conduct",
    "discipline and consistency in reflective practice",
    "examining unfamiliar philosophical perspectives",
    "reconsidering attachments and established beliefs",
  ],
  hiddenMatters: [
    "clarity about personal responsibility",
    "private concerns and emotional perspective",
    "practical examination of an unresolved detail",
    "verification of incomplete information",
    "the broader context of an unanswered question",
    "personal expectations within a private concern",
    "patient review of outstanding details",
    "distinguishing unfamiliar information from assumptions",
    "reconsidering an established interpretation",
  ],
  publicImage: [
    "responsibility and the visibility of your contribution",
    "responses to feedback from others",
    "initiative and the quality of execution",
    "how your contribution is communicated",
    "the value of constructive guidance",
    "cooperation and interpersonal presentation",
    "consistency and realistic external expectations",
    "unfamiliar audiences and changing expectations",
    "the value of substance over recognition",
  ],
};

export function contextualPlanetTheme(
  area: LifeArea,
  planet: PlanetName
): string | null {
  const index = PLANET_ORDER.indexOf(planet);

  return index >= 0
    ? CONTEXT[area]?.[index] ?? null
    : null;
}

export function contextualLunarKnowledge(
  longitude: number | null | undefined
) {
  const lunar = getNakshatraPadaData(longitude);

  if (!lunar) return null;

  const aliases: Record<string, string[]> = {
    "Purva Phalguni": [
      "Purva Phalguni", "PurvaPhalguni",
      "Poorva Phalguni",
    ],
    "Uttara Phalguni": [
      "Uttara Phalguni", "UttaraPhalguni",
    ],
    "Mrigashira": ["Mrigashira", "Mrigashirsha"],
    "Jyeshtha": ["Jyeshtha", "Jyestha"],
    "Shatabhisha": ["Shatabhisha", "Shatabhishak"],
    "Purva Ashadha": ["Purva Ashadha", "PurvaAshadha", "Purvashadha"],
    "Uttara Ashadha": ["Uttara Ashadha", "UttaraAshadha", "Uttarashadha"],
    "Purva Bhadrapada": [
      "Purva Bhadrapada", "Purvabhadrapada",
    ],
    "Uttara Bhadrapada": [
      "Uttara Bhadrapada", "Uttarabhadrapada",
    ],
  };

  const names =
    aliases[lunar.nakshatra] ?? [lunar.nakshatra];

  const interpretation = names
    .map(name => getPadaInterpretation(name, lunar.pada))
    .find(value => value != null) ?? null;

  const knowledge = names
    .map(name => NAKSHATRA_KNOWLEDGE[name])
    .find(value => value != null) ?? null;

  return {
    ...lunar,
    interpretation,
    knowledge,
  };
}

export function contextualVariant(
  key: string,
  variants: readonly string[]
): string {
  if (!variants.length) return "";

  let hash = 2166136261;

  for (let i = 0; i < key.length; i++) {
    hash = Math.imul(
      hash ^ key.charCodeAt(i),
      16777619
    );
  }

  return variants[(hash >>> 0) % variants.length];
}

export function validateContextualLibrary(): void {
  const areas = Object.keys(CONTEXT) as LifeArea[];

  if (areas.length !== 15) {
    throw new Error("Expected 15 contextual life areas.");
  }

  for (const area of areas) {
    if (
      CONTEXT[area].length !== 9 ||
      CONTEXT[area].some(value => !value.trim())
    ) {
      throw new Error(
        "Incomplete planetary context: " + area
      );
    }
  }
}
