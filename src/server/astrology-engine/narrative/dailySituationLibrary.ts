import type { LifeArea, PlanetName } from "../types";

const PLANETS: readonly PlanetName[] = [
  "Sun", "Moon", "Mars", "Mercury",
  "Jupiter", "Venus", "Saturn", "Rahu", "Ketu",
];

// Area-level possibilities only.
// Do not use these to assert a confirmed event.

const SITUATIONS: Record<LifeArea, readonly string[]> = {
  career: [
    "A matter involving managerial expectations or decision-making may require your attention.",
    "Changing priorities at work may require you to reorganise your responsibilities.",
    "A task requiring execution, coordination or a timely response may become more important.",
    "Professional correspondence, documentation or an outstanding discussion may need attention.",
    "An opportunity to learn from experienced colleagues or review a professional approach may become relevant.",
    "A commercial discussion or working relationship may benefit from greater cooperation.",
    "An outstanding approval, deadline or responsibility may require a practical follow-up.",
    "An unfamiliar professional requirement may prompt you to examine alternative approaches.",
    "Reviewing an existing work commitment may help you identify what deserves further effort.",
  ],
  money: [
    "A financial decision may require greater clarity about responsibility and affordability.",
    "Changing personal or household requirements may prompt a review of available funds.",
    "A financial commitment may require timely attention without rushing into a decision.",
    "Payment information, transaction details or financial correspondence may need verification.",
    "Longer-term financial priorities may deserve consideration alongside immediate requirements.",
    "Personal spending preferences or shared financial arrangements may require review.",
    "An outstanding obligation or scheduled payment may need closer examination.",
    "An unfamiliar financial option may attract your attention, making verification particularly important.",
    "Reviewing unnecessary commitments may help simplify your financial arrangements.",
  ],
  relationships: [
    "Individual expectations within an important relationship may deserve a clearer discussion.",
    "An interaction with someone close may bring emotional needs into greater focus.",
    "Different approaches to a shared concern may require patience and clear boundaries.",
    "A message or conversation may help clarify an interpersonal misunderstanding.",
    "A difference in perspective may offer an opportunity to understand someone more fully.",
    "Shared interests or an opportunity to spend meaningful time together may become relevant.",
    "Existing responsibilities within a relationship may require a practical discussion.",
    "An unfamiliar expectation may prompt you to reconsider how you approach a relationship.",
    "Reflecting on a recurring interpersonal pattern may help you respond differently.",
  ],
  children: [
    "A child's confidence or willingness to take responsibility may deserve encouragement.",
    "A child's emotional needs or changing routine may require your attention.",
    "A child's activity or practical requirement may benefit from closer coordination.",
    "School communication, learning feedback or an everyday conversation may become relevant.",
    "A child's learning or personal development may benefit from guidance.",
    "Creative interests or social activities involving a child may deserve encouragement.",
    "A child's routine or existing responsibility may require consistent support.",
    "A child's unfamiliar interest or new learning experience may invite further discussion.",
    "Reconsidering an existing approach to supporting a child may prove useful.",
  ],
  education: [
    "An opportunity to demonstrate independent understanding may become relevant.",
    "Changing concentration or learning priorities may require a more suitable study routine.",
    "Applying knowledge to a practical problem may deserve more attention than theoretical study.",
    "Research, written material or an exchange of information may help clarify a subject.",
    "A difficult concept may benefit from broader reading or experienced guidance.",
    "A creative approach may help you understand material that previously seemed difficult.",
    "An unfinished learning objective may require structured effort and patience.",
    "An unfamiliar subject or alternative learning method may attract your attention.",
    "Reviewing earlier assumptions may help improve your understanding of an existing subject.",
  ],
  home: [
    "A domestic decision may require clearer ownership of responsibilities.",
    "Comfort, household routines or personal space may deserve additional attention.",
    "A practical household task or maintenance requirement may need coordination.",
    "Communication about domestic arrangements may help clarify an outstanding requirement.",
    "Reviewing the usefulness of existing living arrangements may offer practical insight.",
    "Shared preferences concerning comfort or the use of space may become relevant.",
    "An unfinished household responsibility may require a practical follow-up.",
    "An alternative way of organising your home may deserve consideration.",
    "Simplifying an established household routine may make everyday arrangements easier.",
  ],
  family: [
    "A family decision may require clarity about who is responsible for the next step.",
    "A conversation with a family member may bring personal needs into greater focus.",
    "A shared family task may require practical coordination.",
    "Family correspondence or a discussion about upcoming arrangements may need attention.",
    "Advice or a different perspective from a family member may prove useful.",
    "Shared preferences or plans involving family members may deserve discussion.",
    "An existing family obligation may require patience and a realistic division of responsibilities.",
    "Changing family expectations may prompt a review of existing arrangements.",
    "A recurring family concern may benefit from a simpler approach.",
  ],
  property: [
    "Responsibility for an existing housing or property decision may need clarification.",
    "Changing personal requirements may prompt a review of living arrangements.",
    "A practical maintenance or property-related requirement may deserve attention.",
    "Property documentation or administrative correspondence may need closer review.",
    "Longer-term housing requirements may deserve consideration before making commitments.",
    "Shared preferences concerning property or living arrangements may require discussion.",
    "An existing contractual or maintenance obligation may require a follow-up.",
    "An unfamiliar property-related alternative may deserve careful examination.",
    "Reconsidering an existing housing requirement may help clarify your priorities.",
  ],
  travel: [
    "The purpose or priority of an existing journey may need clarification.",
    "Changing personal requirements may influence how you organise an appointment or visit.",
    "Practical preparation and timing may become important for existing travel arrangements.",
    "Itinerary details, appointment confirmations or travel correspondence may need attention.",
    "The broader purpose of a planned visit may influence how you organise it.",
    "Coordination with other people may become relevant to an existing travel plan.",
    "Schedules and external commitments may require additional preparation.",
    "An alternative route or unfamiliar arrangement may deserve consideration.",
    "Simplifying an existing itinerary may help reduce unnecessary inconvenience.",
  ],
  communication: [
    "A decision or instruction may benefit from clearer communication.",
    "The emotional tone of an exchange may deserve more attention than its immediate wording.",
    "A direct conversation may require careful timing and a measured response.",
    "An outstanding message, document or request may need clarification.",
    "A discussion may offer useful context beyond the immediate question.",
    "Diplomacy may help reconcile different expectations during a conversation.",
    "An outstanding response or incomplete instruction may require a careful follow-up.",
    "Unfamiliar information may prompt questions that deserve verification.",
    "Reviewing an earlier exchange may help identify an assumption that needs reconsideration.",
  ],
  mind: [
    "Clarifying personal priorities may help you manage competing expectations.",
    "Changing emotional responses may make a quieter routine particularly useful.",
    "Several urgent requirements may compete for your concentration.",
    "Organising information may help reduce unnecessary mental distractions.",
    "A broader perspective may help you reconsider an existing concern.",
    "Balancing everyday obligations with enjoyable activities may deserve attention.",
    "A demanding schedule may benefit from realistic priorities and sufficient breaks.",
    "Competing interests may make it useful to concentrate on fewer tasks.",
    "Reducing unnecessary distractions may help you focus on what matters.",
  ],
  health: [
    "Consistency in your everyday wellbeing routine may deserve attention.",
    "Consider whether your current schedule allows adequate rest.",
    "Review how you balance ordinary physical activity with appropriate recovery.",
    "Organising practical wellbeing information may help you maintain your routine.",
    "Consider which everyday habits are realistic and sustainable.",
    "Balancing comfort with a consistent routine may prove useful.",
    "A manageable schedule may help you maintain ordinary wellbeing habits.",
    "Unfamiliar wellbeing advice should be evaluated using reliable information.",
    "Simplifying unnecessary commitments may help make time for everyday wellbeing.",
  ],
  spirituality: [
    "A personal principle may invite reflection on how it influences your everyday decisions.",
    "Quiet reflection may help you understand your emotional response to an existing concern.",
    "You may find value in applying a spiritual principle through a practical act of service or personal discipline.",
    "Reading, discussion or a philosophical question may encourage further exploration.",
    "A teaching or conversation with someone experienced may offer a different perspective on an existing concern.",
    "Reflecting on personal values may help you examine how they influence your interactions.",
    "Consistency in a familiar reflective or spiritual practice may deserve more attention than exploring something new.",
    "An unfamiliar philosophical perspective may invite exploration without requiring immediate acceptance.",
    "Reconsidering an established attachment or belief may offer a useful opportunity for reflection.",
  ],
  hiddenMatters: [
    "An unresolved detail may benefit from greater clarity about personal responsibility.",
    "A private concern may deserve consideration without relying solely on emotional impressions.",
    "Examining a practical detail may help clarify an outstanding question.",
    "Incomplete information or an overlooked document may deserve verification.",
    "Understanding the broader context may help you assess an unanswered question.",
    "Personal expectations may influence how you interpret an unresolved concern.",
    "Patient review of available information may help clarify an outstanding detail.",
    "Unfamiliar information may require careful verification before drawing conclusions.",
    "Reconsidering an earlier interpretation may help separate facts from assumptions.",
  ],
  publicImage: [
    "The way you communicate responsibility for your contribution may deserve attention.",
    "Feedback from others may invite reflection on how you present yourself.",
    "Demonstrating practical initiative may become more relevant than discussing intentions.",
    "How you communicate your contribution may influence how clearly others understand it.",
    "Constructive guidance may help you improve the presentation of your work.",
    "Cooperation and interpersonal presentation may deserve attention.",
    "Consistent performance may matter more than immediate acknowledgement.",
    "An unfamiliar audience may require a different approach to communication.",
    "Focusing on the substance of your contribution may be more useful than seeking recognition.",
  ],
};

export function resolveContextualSituation(
  area: LifeArea,
  planet: PlanetName | null
): string | null {
  if (!planet) return null;

  const index = PLANETS.indexOf(planet);

  return index >= 0
    ? SITUATIONS[area]?.[index] ?? null
    : null;
}

export function validateSituationLibrary(): void {
  const areas = Object.keys(SITUATIONS) as LifeArea[];

  if (areas.length !== 15) {
    throw new Error("Incomplete life-area coverage.");
  }

  for (const area of areas) {
    const entries = SITUATIONS[area];

    if (
      entries.length !== 9 ||
      entries.some(entry => !entry.trim()) ||
      new Set(entries).size !== 9
    ) {
      throw new Error(
        "Incomplete situation coverage: " + area
      );
    }
  }
}