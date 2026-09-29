
import type { PadaNumber } from "./nakshatraPadaLibrary";

export type PadaInterpretation = {
  nakshatra: string;
  pada: PadaNumber;
  navamsa: string;

  // Traditional astrological context
  coreTheme: string;
  interpretiveThemes: string[];
  supportiveExpressions: string[];
  cautionExpressions: string[];

  // Editorial guidance for Sārathi
  narrativeAngles: string[];
  actionStyles: string[];
  cautionStyles: string[];
};

export const NAKSHATRA_PADA_INTERPRETATIONS:
  Record<string, Partial<Record<PadaNumber, PadaInterpretation>>> = {

  Ashwini: {
    1: {
      nakshatra: "Ashwini",
      pada: 1,
      navamsa: "Aries",

      coreTheme: "Initiative and swift beginnings",

      interpretiveThemes: [
        "Taking initiative",
        "Starting something new",
        "Acting independently",
        "Responding quickly",
      ],

      supportiveExpressions: [
        "Momentum in an existing opportunity",
        "Confidence to take the first step",
        "Quick progress on a pending matter",
      ],

      cautionExpressions: [
        "Acting before checking the details",
        "Impatience with slower developments",
        "Taking unnecessary risks",
      ],

      narrativeAngles: [
        "An opportunity to take the initiative",
        "A situation that may benefit from prompt action",
        "The beginning of a new phase",
        "Momentum around an existing priority",
      ],

      actionStyles: [
        "Take the first practical step",
        "Act promptly after reviewing the details",
        "Use today's momentum to move a pending matter forward",
      ],

      cautionStyles: [
        "Avoid rushing into commitments",
        "Don't mistake urgency for importance",
        "Check the details before acting",
      ],
    },

    2: {
      nakshatra: "Ashwini",
      pada: 2,
      navamsa: "Taurus",

      coreTheme: "Building stability from a new beginning",

      interpretiveThemes: [
        "Practical progress",
        "Material stability",
        "Developing resources",
        "Turning initiative into lasting results",
      ],

      supportiveExpressions: [
        "Steady progress on a practical matter",
        "An opportunity to strengthen existing resources",
        "A productive step toward greater stability",
      ],

      cautionExpressions: [
        "Becoming attached to immediate results",
        "Resisting necessary adjustments",
        "Prioritising comfort over progress",
      ],

      narrativeAngles: [
        "An opportunity to build on recent progress",
        "A practical development that deserves attention",
        "Turning an initial opportunity into something sustainable",
        "A chance to strengthen your foundations",
      ],

      actionStyles: [
        "Focus on a practical next step",
        "Review the resources needed before proceeding",
        "Choose steady progress over unnecessary urgency",
      ],

      cautionStyles: [
        "Avoid committing resources prematurely",
        "Don't let short-term comfort determine the decision",
        "Remain open to reasonable adjustments",
      ],
    },

    3: {
      nakshatra: "Ashwini",
      pada: 3,
      navamsa: "Gemini",

      coreTheme: "Progress through communication and adaptability",

      interpretiveThemes: [
        "Communication",
        "Learning",
        "Exchange of information",
        "Adaptability",
      ],

      supportiveExpressions: [
        "A useful conversation",
        "Progress through an exchange of information",
        "Clarity about an emerging opportunity",
      ],

      cautionExpressions: [
        "Scattered attention",
        "Acting on incomplete information",
        "Making too many commitments",
      ],

      narrativeAngles: [
        "A conversation that may help move matters forward",
        "New information concerning an existing priority",
        "An opportunity to clarify the next step",
        "Progress through communication and coordination",
      ],

      actionStyles: [
        "Ask the questions needed to gain clarity",
        "Follow up on an important conversation",
        "Organise the information before making a decision",
      ],

      cautionStyles: [
        "Avoid making assumptions from partial information",
        "Don't spread your attention across too many priorities",
        "Confirm important details before committing",
      ],
    },

    4: {
      nakshatra: "Ashwini",
      pada: 4,
      navamsa: "Cancer",

      coreTheme: "Initiative guided by care and emotional awareness",

      interpretiveThemes: [
        "Emotional awareness",
        "Family considerations",
        "Care and protection",
        "Balancing initiative with sensitivity",
      ],

      supportiveExpressions: [
        "A constructive family conversation",
        "Progress on a matter involving personal security",
        "An opportunity to offer or receive support",
      ],

      cautionExpressions: [
        "Reacting too quickly to emotional situations",
        "Taking on more responsibility than necessary",
        "Allowing temporary feelings to drive decisions",
      ],

      narrativeAngles: [
        "A personal matter that may benefit from attention",
        "An opportunity to strengthen an important connection",
        "Progress through a considerate approach",
        "Balancing immediate action with longer-term security",
      ],

      actionStyles: [
        "Approach an important conversation with sensitivity",
        "Make room for both practical and emotional considerations",
        "Offer support where it is genuinely needed",
      ],

      cautionStyles: [
        "Avoid reacting before understanding the situation",
        "Don't take responsibility for everything at once",
        "Allow important decisions time to settle",
      ],
    },
  },
    Bharani: {
    1: {
      nakshatra: "Bharani",
      pada: 1,
      navamsa: "Leo",

      coreTheme: "Responsibility expressed through confidence and purposeful action",

      interpretiveThemes: [
        "Responsibility",
        "Personal authority",
        "Purposeful action",
        "Managing obligations",
      ],

      supportiveExpressions: [
        "Confidence in handling an important responsibility",
        "Progress through decisive action",
        "Greater clarity about what deserves your commitment",
      ],

      cautionExpressions: [
        "Taking control too forcefully",
        "Allowing pride to influence a practical decision",
        "Carrying responsibilities that do not belong to you",
      ],

      narrativeAngles: [
        "A responsibility that may require decisive attention",
        "An opportunity to take ownership of an important matter",
        "Progress through confident but measured action",
        "A situation that may clarify where your priorities truly lie",
      ],

      actionStyles: [
        "Take ownership of the matter that genuinely requires your attention",
        "Act decisively while keeping the larger consequences in mind",
        "Focus your energy on the responsibility that matters most",
      ],

      cautionStyles: [
        "Avoid turning responsibility into a struggle for control",
        "Don't let pride make a practical matter harder than necessary",
        "Be selective about what you agree to carry",
      ],
    },

    2: {
      nakshatra: "Bharani",
      pada: 2,
      navamsa: "Virgo",

      coreTheme: "Managing responsibilities through practical organisation",

      interpretiveThemes: [
        "Organisation",
        "Practical responsibility",
        "Attention to detail",
        "Improving existing conditions",
      ],

      supportiveExpressions: [
        "Progress through careful organisation",
        "A practical solution to an existing obligation",
        "Greater clarity about details that need attention",
      ],

      cautionExpressions: [
        "Overanalysing a manageable situation",
        "Becoming overly critical of imperfections",
        "Allowing small details to delay necessary action",
      ],

      narrativeAngles: [
        "A practical matter that may benefit from closer attention",
        "An opportunity to organise an existing responsibility",
        "Progress through correcting or refining the details",
        "A situation that becomes easier once the practical requirements are clear",
      ],

      actionStyles: [
        "Organise the details before taking the next step",
        "Resolve one practical issue at a time",
        "Review what can be improved rather than starting over unnecessarily",
      ],

      cautionStyles: [
        "Avoid overcomplicating a straightforward matter",
        "Don't allow perfectionism to delay progress",
        "Focus on the details that materially affect the outcome",
      ],
    },

    3: {
      nakshatra: "Bharani",
      pada: 3,
      navamsa: "Libra",

      coreTheme: "Balancing responsibility with relationships and mutual interests",

      interpretiveThemes: [
        "Balance",
        "Relationships",
        "Negotiation",
        "Shared responsibility",
      ],

      supportiveExpressions: [
        "Progress through cooperation or negotiation",
        "A constructive adjustment in an important relationship",
        "Greater balance in a shared responsibility",
      ],

      cautionExpressions: [
        "Compromising more than necessary",
        "Delaying a decision to preserve harmony",
        "Taking responsibility for another person's choices",
      ],

      narrativeAngles: [
        "A shared matter that may require balance and cooperation",
        "An opportunity to improve an agreement or understanding",
        "Progress through a fair exchange of responsibilities",
        "A situation where another person's priorities need to be considered",
      ],

      actionStyles: [
        "Clarify what is reasonably expected from each side",
        "Look for a solution that respects both practical and relational needs",
        "Address an imbalance before it becomes more difficult",
      ],

      cautionStyles: [
        "Avoid agreeing simply to keep the peace",
        "Don't carry another person's share of the responsibility",
        "Allow fairness, not immediate approval, to guide the decision",
      ],
    },

    4: {
      nakshatra: "Bharani",
      pada: 4,
      navamsa: "Scorpio",

      coreTheme: "Transformation through confronting deeper responsibilities",

      interpretiveThemes: [
        "Transformation",
        "Emotional intensity",
        "Endurance",
        "Resolving deeper issues",
      ],

      supportiveExpressions: [
        "Progress on a matter that has required persistence",
        "An opportunity to resolve something previously avoided",
        "Greater determination to deal with an important responsibility",
      ],

      cautionExpressions: [
        "Reacting intensely to pressure",
        "Holding on to a situation that needs to change",
        "Turning a difficult matter into a confrontation",
      ],

      narrativeAngles: [
        "A deeper issue that may now require attention",
        "An opportunity to resolve something that has remained unsettled",
        "Progress through confronting an uncomfortable but necessary matter",
        "A situation that may require both patience and determination",
      ],

      actionStyles: [
        "Address the underlying issue rather than only the immediate symptom",
        "Use persistence to resolve what has remained unfinished",
        "Make the necessary change without escalating the situation",
      ],

      cautionStyles: [
        "Avoid reacting from frustration or accumulated pressure",
        "Don't hold on to an arrangement simply because it is familiar",
        "Keep difficult conversations focused on resolution rather than blame",
      ],
    },
  },
    Krittika: {
    1: {
      nakshatra: "Krittika",
      pada: 1,
      navamsa: "Sagittarius",

      coreTheme: "Clarifying direction through conviction and purposeful action",

      interpretiveThemes: [
        "Clarity",
        "Purpose",
        "Conviction",
        "Choosing a direction",
      ],

      supportiveExpressions: [
        "Greater clarity about the right direction",
        "Confidence to remove an unnecessary complication",
        "Progress through a clear and purposeful decision",
      ],

      cautionExpressions: [
        "Becoming overly certain of your own position",
        "Speaking more sharply than necessary",
        "Making a decision before considering the wider implications",
      ],

      narrativeAngles: [
        "A situation that may become clearer once priorities are defined",
        "An opportunity to remove something that is no longer useful",
        "Progress through a more decisive sense of direction",
        "A matter that may require separating what is important from what is distracting",
      ],

      actionStyles: [
        "Identify the most important objective before acting",
        "Remove an unnecessary complication from the situation",
        "Make the next decision with the longer-term direction in mind",
      ],

      cautionStyles: [
        "Avoid assuming that your first conclusion is the only one",
        "Don't let conviction become unnecessary bluntness",
        "Consider the wider consequences before making a final decision",
      ],
    },

    2: {
      nakshatra: "Krittika",
      pada: 2,
      navamsa: "Capricorn",

      coreTheme: "Refining priorities through discipline and practical responsibility",

      interpretiveThemes: [
        "Discipline",
        "Responsibility",
        "Practical judgement",
        "Structured progress",
      ],

      supportiveExpressions: [
        "Progress through a disciplined approach",
        "A practical decision that improves an existing situation",
        "Greater control over an important responsibility",
      ],

      cautionExpressions: [
        "Becoming too rigid about how something should be done",
        "Taking on excessive responsibility",
        "Focusing on obligations while overlooking changing circumstances",
      ],

      narrativeAngles: [
        "A responsibility that may require a more structured approach",
        "An opportunity to simplify an existing obligation",
        "Progress through discipline and careful prioritisation",
        "A practical matter that may benefit from firmer boundaries",
      ],

      actionStyles: [
        "Set a clear priority and deal with it systematically",
        "Remove unnecessary obligations from your immediate workload",
        "Use discipline to complete what genuinely needs attention",
      ],

      cautionStyles: [
        "Avoid carrying responsibilities that can reasonably be delegated",
        "Don't become inflexible simply because a plan already exists",
        "Keep efficiency from turning into unnecessary pressure",
      ],
    },

    3: {
      nakshatra: "Krittika",
      pada: 3,
      navamsa: "Aquarius",

      coreTheme: "Reassessing priorities through objectivity and independent thinking",

      interpretiveThemes: [
        "Objectivity",
        "Independent thinking",
        "Reassessment",
        "Improvement",
      ],

      supportiveExpressions: [
        "A clearer view of a situation that previously felt complicated",
        "An opportunity to improve an existing approach",
        "Progress through a more objective perspective",
      ],

      cautionExpressions: [
        "Becoming detached from practical or emotional considerations",
        "Rejecting an approach simply because it is conventional",
        "Making abrupt changes before testing a better alternative",
      ],

      narrativeAngles: [
        "A situation that may benefit from looking at it differently",
        "An opportunity to improve a system or existing arrangement",
        "Progress through separating facts from assumptions",
        "A matter where an independent perspective may reveal what needs to change",
      ],

      actionStyles: [
        "Review the situation from a more objective perspective",
        "Identify what can be improved rather than accepting the current arrangement",
        "Test a practical alternative before making a larger change",
      ],

      cautionStyles: [
        "Avoid changing something merely for the sake of change",
        "Don't overlook personal considerations while focusing on logic",
        "Confirm that an alternative is workable before abandoning the existing approach",
      ],
    },

    4: {
      nakshatra: "Krittika",
      pada: 4,
      navamsa: "Pisces",

      coreTheme: "Releasing what is unnecessary with sensitivity and discernment",

      interpretiveThemes: [
        "Release",
        "Discernment",
        "Sensitivity",
        "Completion",
      ],

      supportiveExpressions: [
        "Clarity about what can now be released",
        "A chance to bring an unresolved matter closer to completion",
        "Progress through a more understanding and flexible approach",
      ],

      cautionExpressions: [
        "Avoiding a necessary decision because it feels uncomfortable",
        "Allowing sympathy to weaken reasonable boundaries",
        "Remaining attached to an unclear or impractical situation",
      ],

      narrativeAngles: [
        "A situation that may require deciding what is still worth carrying",
        "An opportunity to bring greater clarity to an unresolved matter",
        "Progress through releasing an unnecessary complication",
        "A matter that may benefit from combining clear judgement with sensitivity",
      ],

      actionStyles: [
        "Decide what genuinely needs to continue and what can be released",
        "Bring an unresolved matter toward a practical conclusion",
        "Use sensitivity without losing sight of the necessary boundary",
      ],

      cautionStyles: [
        "Avoid postponing a decision simply because it is uncomfortable",
        "Don't confuse compassion with accepting an unhealthy arrangement",
        "Keep practical reality in view when emotions are involved",
      ],
    },
  },
    Rohini: {
    1: {
      nakshatra: "Rohini",
      pada: 1,
      navamsa: "Aries",

      coreTheme: "Growth through initiative and active development",

      interpretiveThemes: [
        "Growth",
        "Initiative",
        "Material development",
        "Creating momentum",
      ],

      supportiveExpressions: [
        "Momentum around something you want to develop",
        "An opportunity to actively improve an existing situation",
        "Progress through taking a clear first step",
      ],

      cautionExpressions: [
        "Pushing for growth before the foundations are ready",
        "Impatience with gradual progress",
        "Acting from desire without considering practical limits",
      ],

      narrativeAngles: [
        "An opportunity to actively develop something important",
        "A situation where initiative may create useful momentum",
        "Progress around something that has potential to grow",
        "A practical opportunity that may benefit from direct action",
      ],

      actionStyles: [
        "Take a practical step toward developing the opportunity",
        "Use today's momentum to strengthen what already shows potential",
        "Focus your effort on something capable of producing lasting value",
      ],

      cautionStyles: [
        "Avoid forcing progress before the situation is ready",
        "Don't let immediate desire override practical judgement",
        "Allow worthwhile growth enough time to develop",
      ],
    },

    2: {
      nakshatra: "Rohini",
      pada: 2,
      navamsa: "Taurus",

      coreTheme: "Strengthening stability, resources and tangible growth",

      interpretiveThemes: [
        "Stability",
        "Resources",
        "Material growth",
        "Consolidation",
      ],

      supportiveExpressions: [
        "An opportunity to strengthen existing resources",
        "Steady progress toward greater stability",
        "A practical development with longer-term value",
      ],

      cautionExpressions: [
        "Becoming overly attached to comfort or possessions",
        "Resisting a necessary adjustment",
        "Expecting immediate material results",
      ],

      narrativeAngles: [
        "A practical opportunity to strengthen your position",
        "A situation that may develop steadily rather than dramatically",
        "Progress around resources, security or something of lasting value",
        "An opportunity to consolidate what has already been built",
      ],

      actionStyles: [
        "Strengthen what is already working before expanding further",
        "Give attention to the resources supporting your longer-term plans",
        "Choose the option that offers sustainable rather than temporary value",
      ],

      cautionStyles: [
        "Avoid holding on to something solely because it feels familiar",
        "Don't make a larger commitment before confirming the practical value",
        "Remain open to adjustments that improve long-term stability",
      ],
    },

    3: {
      nakshatra: "Rohini",
      pada: 3,
      navamsa: "Gemini",

      coreTheme: "Developing opportunities through communication and exchange",

      interpretiveThemes: [
        "Communication",
        "Ideas",
        "Exchange",
        "Adaptability",
      ],

      supportiveExpressions: [
        "A useful conversation concerning an opportunity",
        "Progress through information or coordination",
        "New clarity about how something can develop",
      ],

      cautionExpressions: [
        "Scattering attention across too many possibilities",
        "Acting on incomplete information",
        "Talking about progress without taking practical action",
      ],

      narrativeAngles: [
        "A conversation that may help an opportunity develop",
        "New information concerning something you are trying to build",
        "Progress through communication, coordination or negotiation",
        "An opportunity that may become clearer through further discussion",
      ],

      actionStyles: [
        "Follow up on the conversation most likely to move matters forward",
        "Gather the information needed to develop the opportunity",
        "Turn a useful idea or discussion into a practical next step",
      ],

      cautionStyles: [
        "Avoid dividing your attention among too many possibilities",
        "Don't treat preliminary information as a confirmed outcome",
        "Make sure discussion is followed by practical action",
      ],
    },

    4: {
      nakshatra: "Rohini",
      pada: 4,
      navamsa: "Cancer",

      coreTheme: "Nurturing growth while strengthening emotional and practical security",

      interpretiveThemes: [
        "Nurturing",
        "Security",
        "Emotional investment",
        "Sustained growth",
      ],

      supportiveExpressions: [
        "Progress around something personally important",
        "An opportunity to strengthen security or support",
        "Growth through patient and consistent attention",
      ],

      cautionExpressions: [
        "Becoming overly protective of an existing situation",
        "Allowing temporary emotions to influence practical decisions",
        "Taking on more responsibility than necessary",
      ],

      narrativeAngles: [
        "Something important may benefit from patient attention",
        "An opportunity to strengthen a sense of security or stability",
        "Progress through nurturing what has already begun to develop",
        "A personal or practical matter that may require consistent support",
      ],

      actionStyles: [
        "Give steady attention to what you genuinely want to develop",
        "Strengthen the practical foundations of an important matter",
        "Balance emotional considerations with the longer-term objective",
      ],

      cautionStyles: [
        "Avoid becoming protective of an arrangement that needs adjustment",
        "Don't allow a temporary feeling to determine a longer-term decision",
        "Support what matters without taking responsibility for everything",
      ],
    },
  },
    Mrigashira: {
    1: {
      nakshatra: "Mrigashira",
      pada: 1,
      navamsa: "Leo",

      coreTheme: "Seeking clarity through confident exploration",

      interpretiveThemes: [
        "Exploration",
        "Curiosity",
        "Personal direction",
        "Confident inquiry",
      ],

      supportiveExpressions: [
        "Greater confidence about what is worth pursuing",
        "An opportunity to explore a promising direction",
        "Progress through actively seeking better information",
      ],

      cautionExpressions: [
        "Chasing an opportunity mainly for recognition",
        "Becoming impatient for certainty",
        "Assuming enthusiasm is sufficient evidence",
      ],

      narrativeAngles: [
        "A possibility that may be worth exploring further",
        "An opportunity to seek greater clarity before choosing a direction",
        "Progress through actively investigating an emerging option",
        "A situation that may reveal what genuinely deserves your attention",
      ],

      actionStyles: [
        "Investigate the option that appears most promising",
        "Ask the questions that will clarify whether the opportunity is worthwhile",
        "Use curiosity to identify the most meaningful next step",
      ],

      cautionStyles: [
        "Avoid committing simply because an opportunity feels exciting",
        "Don't let the desire for certainty rush the investigation",
        "Confirm the substance behind an attractive possibility",
      ],
    },

    2: {
      nakshatra: "Mrigashira",
      pada: 2,
      navamsa: "Virgo",

      coreTheme: "Seeking answers through analysis and careful examination",

      interpretiveThemes: [
        "Analysis",
        "Investigation",
        "Details",
        "Practical discovery",
      ],

      supportiveExpressions: [
        "Useful information emerging through closer examination",
        "Greater clarity about an unresolved practical matter",
        "Progress through research or careful review",
      ],

      cautionExpressions: [
        "Overanalysing a situation",
        "Searching for certainty that may not yet be available",
        "Getting distracted by minor details",
      ],

      narrativeAngles: [
        "A matter that may become clearer through closer examination",
        "New information that helps refine an existing decision",
        "Progress through investigating the practical details",
        "An unresolved question that may now be easier to understand",
      ],

      actionStyles: [
        "Check the details that materially affect the decision",
        "Research what remains uncertain before proceeding",
        "Separate useful information from unnecessary detail",
      ],

      cautionStyles: [
        "Avoid turning investigation into endless analysis",
        "Don't delay a reasonable decision while searching for perfect certainty",
        "Keep minor details from obscuring the larger issue",
      ],
    },

    3: {
      nakshatra: "Mrigashira",
      pada: 3,
      navamsa: "Libra",

      coreTheme: "Seeking understanding through dialogue and comparison",

      interpretiveThemes: [
        "Dialogue",
        "Comparison",
        "Relationships",
        "Considering alternatives",
      ],

      supportiveExpressions: [
        "A conversation that provides useful perspective",
        "Greater clarity through comparing available options",
        "Progress through consultation or cooperation",
      ],

      cautionExpressions: [
        "Depending too heavily on another person's opinion",
        "Remaining undecided because several options seem attractive",
        "Seeking agreement instead of genuine clarity",
      ],

      narrativeAngles: [
        "A conversation that may help clarify an uncertain matter",
        "An opportunity to compare alternatives before deciding",
        "Progress through understanding another person's perspective",
        "A situation where discussion may reveal a better option",
      ],

      actionStyles: [
        "Discuss the matter with someone whose perspective is useful",
        "Compare the realistic advantages of the available options",
        "Clarify expectations before moving forward with another person",
      ],

      cautionStyles: [
        "Avoid allowing another person's preference to make the decision for you",
        "Don't keep comparing options after the important differences are clear",
        "Seek understanding rather than agreement for its own sake",
      ],
    },

    4: {
      nakshatra: "Mrigashira",
      pada: 4,
      navamsa: "Scorpio",

      coreTheme: "Searching beneath the surface for deeper clarity",

      interpretiveThemes: [
        "Investigation",
        "Depth",
        "Hidden factors",
        "Emotional insight",
      ],

      supportiveExpressions: [
        "Greater understanding of an issue that has remained unclear",
        "An opportunity to uncover an important underlying factor",
        "Progress through looking beyond the obvious explanation",
      ],

      cautionExpressions: [
        "Becoming suspicious without sufficient evidence",
        "Searching for hidden problems where none may exist",
        "Allowing emotional intensity to distort judgement",
      ],

      narrativeAngles: [
        "A situation that may contain more than is immediately visible",
        "An unresolved matter that could benefit from deeper investigation",
        "Progress through understanding what is driving the situation underneath",
        "An opportunity to discover an important detail previously overlooked",
      ],

      actionStyles: [
        "Look beyond the immediate explanation before reaching a conclusion",
        "Investigate the underlying issue rather than only its visible effects",
        "Clarify what remains unspoken or unresolved where appropriate",
      ],

      cautionStyles: [
        "Avoid assuming that uncertainty means something is being concealed",
        "Don't let suspicion replace evidence",
        "Keep emotional reactions separate from the facts you are investigating",
      ],
    },
  },
    Ardra: {
    1: {
      nakshatra: "Ardra",
      pada: 1,
      navamsa: "Sagittarius",

      coreTheme: "Finding direction through confronting changing circumstances",

      interpretiveThemes: [
        "Change",
        "Truth",
        "Reassessment",
        "Finding direction",
      ],

      supportiveExpressions: [
        "Greater clarity after confronting an uncertain situation",
        "An opportunity to reconsider an outdated assumption",
        "Progress through acknowledging what has changed",
      ],

      cautionExpressions: [
        "Reacting strongly before understanding the wider situation",
        "Becoming overly certain about a new conclusion",
        "Making a larger change than circumstances require",
      ],

      narrativeAngles: [
        "A changing situation that may reveal a clearer direction",
        "An opportunity to reconsider something you previously believed was settled",
        "Progress through recognising what is no longer working",
        "A development that may encourage a broader reassessment of priorities",
      ],

      actionStyles: [
        "Identify what the changing circumstances are actually showing you",
        "Adjust your direction where the evidence genuinely supports it",
        "Use new clarity to make one purposeful change",
      ],

      cautionStyles: [
        "Avoid making sweeping decisions in response to one development",
        "Don't replace one rigid assumption with another",
        "Allow the larger picture to become clear before changing direction completely",
      ],
    },

    2: {
      nakshatra: "Ardra",
      pada: 2,
      navamsa: "Capricorn",

      coreTheme: "Rebuilding stability through practical adjustment",

      interpretiveThemes: [
        "Restructuring",
        "Responsibility",
        "Practical adjustment",
        "Resilience",
      ],

      supportiveExpressions: [
        "An opportunity to correct a practical weakness",
        "Progress through restructuring an existing responsibility",
        "Greater stability after making a necessary adjustment",
      ],

      cautionExpressions: [
        "Trying to control every changing circumstance",
        "Carrying unnecessary pressure alone",
        "Holding rigidly to a structure that needs adjustment",
      ],

      narrativeAngles: [
        "A practical issue that may now require restructuring",
        "An opportunity to strengthen something by correcting a weakness",
        "Progress through adapting an existing plan to current realities",
        "A responsibility that may become easier once priorities are reorganised",
      ],

      actionStyles: [
        "Correct the practical issue that is creating unnecessary pressure",
        "Restructure the plan around what is realistically manageable",
        "Focus first on restoring stability where it matters most",
      ],

      cautionStyles: [
        "Avoid trying to preserve a structure that clearly needs adjustment",
        "Don't assume you must manage every difficulty yourself",
        "Keep temporary disruption from becoming unnecessary long-term pressure",
      ],
    },

    3: {
      nakshatra: "Ardra",
      pada: 3,
      navamsa: "Aquarius",

      coreTheme: "Breaking outdated patterns through objective reassessment",

      interpretiveThemes: [
        "Change",
        "Objectivity",
        "Innovation",
        "Breaking patterns",
      ],

      supportiveExpressions: [
        "A new perspective on a persistent problem",
        "An opportunity to improve an outdated approach",
        "Progress through questioning an established pattern",
      ],

      cautionExpressions: [
        "Changing something simply because the current situation feels restrictive",
        "Becoming detached from the human impact of a decision",
        "Rejecting useful structure along with what genuinely needs to change",
      ],

      narrativeAngles: [
        "A persistent issue that may benefit from a different approach",
        "An opportunity to break an unhelpful pattern",
        "Progress through viewing a difficult situation more objectively",
        "A changing circumstance that may reveal a more effective alternative",
      ],

      actionStyles: [
        "Identify the pattern that keeps recreating the same difficulty",
        "Consider a practical alternative to the existing approach",
        "Separate what genuinely needs to change from what still works",
      ],

      cautionStyles: [
        "Avoid making changes solely to escape temporary frustration",
        "Don't overlook the practical or personal consequences of a new approach",
        "Preserve what remains useful while changing what no longer works",
      ],
    },

    4: {
      nakshatra: "Ardra",
      pada: 4,
      navamsa: "Pisces",

      coreTheme: "Processing change through acceptance, release and renewal",

      interpretiveThemes: [
        "Release",
        "Acceptance",
        "Renewal",
        "Emotional processing",
      ],

      supportiveExpressions: [
        "An opportunity to move beyond an unresolved difficulty",
        "Greater acceptance of something that cannot be controlled",
        "Progress through releasing an unnecessary emotional burden",
      ],

      cautionExpressions: [
        "Feeling overwhelmed by temporary uncertainty",
        "Avoiding a practical issue because it feels emotionally difficult",
        "Holding on to disappointment longer than necessary",
      ],

      narrativeAngles: [
        "A difficult matter that may begin moving toward resolution",
        "An opportunity to release something that has created unnecessary strain",
        "Progress through accepting what cannot be changed and addressing what can",
        "A changing situation that may ultimately create room for renewal",
      ],

      actionStyles: [
        "Focus your effort on the part of the situation you can realistically influence",
        "Allow an unresolved matter to move toward closure where possible",
        "Create space for the next step by releasing what no longer needs your attention",
      ],

      cautionStyles: [
        "Avoid allowing temporary uncertainty to define the larger situation",
        "Don't use acceptance as a reason to ignore a practical responsibility",
        "Give difficult emotions space without letting them determine the decision",
      ],
    },
  },
    Punarvasu: {
    1: {
      nakshatra: "Punarvasu",
      pada: 1,
      navamsa: "Aries",

      coreTheme: "Renewal through initiative and a fresh practical start",

      interpretiveThemes: [
        "Renewal",
        "Fresh initiative",
        "Recovery",
        "Restarting with clarity",
      ],

      supportiveExpressions: [
        "Fresh momentum around something that had slowed down",
        "An opportunity to restart a matter with greater clarity",
        "Progress through taking a renewed first step",
      ],

      cautionExpressions: [
        "Restarting too quickly without learning from the earlier experience",
        "Repeating an old approach simply because it is familiar",
        "Expecting immediate results from a renewed effort",
      ],

      narrativeAngles: [
        "A matter that may be ready for a fresh start",
        "An opportunity to return to something with renewed energy",
        "Progress through approaching an existing situation differently",
        "A second chance to move an important priority forward",
      ],

      actionStyles: [
        "Take a fresh practical step where circumstances now support it",
        "Use what you learned previously to improve the next attempt",
        "Restart the matter with a clearer objective",
      ],

      cautionStyles: [
        "Avoid repeating the same approach without making the necessary adjustment",
        "Don't confuse renewed energy with guaranteed results",
        "Check what has changed before starting again",
      ],
    },

    2: {
      nakshatra: "Punarvasu",
      pada: 2,
      navamsa: "Taurus",

      coreTheme: "Restoring stability and rebuilding useful resources",

      interpretiveThemes: [
        "Restoration",
        "Stability",
        "Resources",
        "Rebuilding",
      ],

      supportiveExpressions: [
        "An opportunity to restore greater stability",
        "Recovery of something useful or valuable",
        "Steady progress in rebuilding an existing foundation",
      ],

      cautionExpressions: [
        "Returning to something only because it feels comfortable",
        "Holding on to resources that could be used more effectively",
        "Expecting stability without making practical adjustments",
      ],

      narrativeAngles: [
        "A situation that may begin returning to firmer ground",
        "An opportunity to rebuild something of practical value",
        "Progress through restoring resources or stability",
        "A matter that may improve through patient and consistent attention",
      ],

      actionStyles: [
        "Strengthen the practical foundation before expanding further",
        "Restore the resource or routine that provides useful stability",
        "Build gradually on what has already begun to recover",
      ],

      cautionStyles: [
        "Avoid returning to an arrangement solely because it is familiar",
        "Don't rush expansion before stability has genuinely returned",
        "Make sure the restored situation remains practical for the longer term",
      ],
    },

    3: {
      nakshatra: "Punarvasu",
      pada: 3,
      navamsa: "Gemini",

      coreTheme: "Renewal through communication, learning and reconsideration",

      interpretiveThemes: [
        "Communication",
        "Reconsideration",
        "Learning",
        "Renewed understanding",
      ],

      supportiveExpressions: [
        "A conversation that reopens a useful possibility",
        "New information that helps revive an existing matter",
        "Greater clarity after reconsidering an earlier idea",
      ],

      cautionExpressions: [
        "Reopening too many possibilities at once",
        "Repeating discussions without reaching a practical next step",
        "Changing direction repeatedly as new information appears",
      ],

      narrativeAngles: [
        "A previous conversation or idea that may become relevant again",
        "New information that allows an existing matter to be reconsidered",
        "An opportunity to reopen communication with greater clarity",
        "Progress through revisiting something you may have dismissed earlier",
      ],

      actionStyles: [
        "Revisit the conversation with the benefit of what you now know",
        "Clarify what has changed before reconsidering the opportunity",
        "Turn renewed communication into a specific practical next step",
      ],

      cautionStyles: [
        "Avoid reopening an issue without a clear purpose",
        "Don't let new information scatter your attention across too many options",
        "Make sure renewed discussion leads toward a practical outcome",
      ],
    },

    4: {
      nakshatra: "Punarvasu",
      pada: 4,
      navamsa: "Cancer",

      coreTheme: "Returning to security, support and emotional equilibrium",

      interpretiveThemes: [
        "Security",
        "Emotional renewal",
        "Support",
        "Returning to balance",
      ],

      supportiveExpressions: [
        "A return to greater emotional or practical stability",
        "An opportunity to restore an important connection",
        "Progress through rebuilding a sense of security",
      ],

      cautionExpressions: [
        "Returning to an old situation for emotional comfort alone",
        "Taking responsibility for restoring everything yourself",
        "Allowing nostalgia to outweigh present circumstances",
      ],

      narrativeAngles: [
        "A personal matter that may begin returning to greater balance",
        "An opportunity to restore support or understanding",
        "Progress through reconnecting with something that provides genuine stability",
        "A situation that may benefit from returning to simpler priorities",
      ],

      actionStyles: [
        "Give attention to what genuinely restores stability",
        "Reconnect where there is a practical basis for rebuilding trust or support",
        "Create a calmer foundation before making the next larger decision",
      ],

      cautionStyles: [
        "Avoid returning to something solely because of emotional familiarity",
        "Don't take sole responsibility for restoring a shared situation",
        "Distinguish genuine security from temporary comfort",
      ],
    },
  },
    Pushya: {
    1: {
      nakshatra: "Pushya",
      pada: 1,
      navamsa: "Leo",

      coreTheme: "Supporting growth through confident leadership and responsibility",

      interpretiveThemes: [
        "Guidance",
        "Responsibility",
        "Leadership",
        "Constructive support",
      ],

      supportiveExpressions: [
        "An opportunity to guide an important matter forward",
        "Progress through taking responsible ownership",
        "Greater confidence in supporting something that needs development",
      ],

      cautionExpressions: [
        "Taking responsibility for matters others should manage",
        "Expecting recognition for providing support",
        "Becoming overly controlling while trying to help",
      ],

      narrativeAngles: [
        "A situation that may benefit from responsible leadership",
        "An opportunity to strengthen something through active support",
        "Progress through providing clear direction where it is genuinely needed",
        "A responsibility that may place you in a guiding role",
      ],

      actionStyles: [
        "Provide clear direction without taking over unnecessarily",
        "Give focused support to the matter that has genuine potential",
        "Use your influence to strengthen rather than control the situation",
      ],

      cautionStyles: [
        "Avoid taking ownership of responsibilities that belong to others",
        "Don't let the desire to help become a need to control",
        "Offer guidance without making recognition the objective",
      ],
    },

    2: {
      nakshatra: "Pushya",
      pada: 2,
      navamsa: "Virgo",

      coreTheme: "Nurturing progress through practical service and careful organisation",

      interpretiveThemes: [
        "Service",
        "Organisation",
        "Practical support",
        "Improvement",
      ],

      supportiveExpressions: [
        "Progress through practical assistance or organisation",
        "An opportunity to improve an existing system or responsibility",
        "Useful support that helps a matter become more manageable",
      ],

      cautionExpressions: [
        "Becoming overly involved in fixing every detail",
        "Taking on additional work because others have not organised it",
        "Allowing perfectionism to turn support into pressure",
      ],

      narrativeAngles: [
        "A practical matter that may benefit from better organisation",
        "An opportunity to provide useful and specific support",
        "Progress through improving the way an existing responsibility is managed",
        "A situation that may become easier once the details are organised",
      ],

      actionStyles: [
        "Focus on the practical improvement that will make the greatest difference",
        "Organise the responsibility into manageable steps",
        "Offer specific help where it genuinely improves the outcome",
      ],

      cautionStyles: [
        "Avoid trying to correct every small imperfection",
        "Don't automatically take on work that can reasonably be shared",
        "Keep helpful attention to detail from becoming unnecessary pressure",
      ],
    },

    3: {
      nakshatra: "Pushya",
      pada: 3,
      navamsa: "Libra",

      coreTheme: "Strengthening relationships through balanced support and cooperation",

      interpretiveThemes: [
        "Cooperation",
        "Relationships",
        "Mutual support",
        "Balance",
      ],

      supportiveExpressions: [
        "A constructive exchange of support",
        "Progress through cooperation or shared responsibility",
        "An opportunity to strengthen an important relationship",
      ],

      cautionExpressions: [
        "Giving more support than is being reciprocated",
        "Avoiding a necessary boundary to maintain harmony",
        "Taking responsibility for keeping everyone satisfied",
      ],

      narrativeAngles: [
        "A shared matter that may benefit from cooperation",
        "An opportunity to strengthen an important working or personal relationship",
        "Progress through a fairer distribution of responsibility",
        "A situation where mutual support may produce a better outcome",
      ],

      actionStyles: [
        "Clarify how responsibility can be shared more effectively",
        "Offer support while maintaining reasonable boundaries",
        "Look for an arrangement that works fairly for everyone involved",
      ],

      cautionStyles: [
        "Avoid giving more simply to prevent disagreement",
        "Don't confuse support with carrying another person's responsibilities",
        "Maintain balance between helping others and protecting your own priorities",
      ],
    },

    4: {
      nakshatra: "Pushya",
      pada: 4,
      navamsa: "Scorpio",

      coreTheme: "Providing resilient support through deeper change and pressure",

      interpretiveThemes: [
        "Resilience",
        "Deep support",
        "Transformation",
        "Emotional strength",
      ],

      supportiveExpressions: [
        "An opportunity to strengthen something going through change",
        "Progress through sustained support during a demanding situation",
        "Greater resilience in handling an important responsibility",
      ],

      cautionExpressions: [
        "Absorbing another person's emotional pressure",
        "Holding on to a responsibility after your role should have changed",
        "Trying to protect a situation from a necessary transformation",
      ],

      narrativeAngles: [
        "A demanding matter that may require steady support",
        "An opportunity to strengthen something while it goes through change",
        "Progress through addressing the deeper need behind an immediate problem",
        "A responsibility that may require patience and emotional resilience",
      ],

      actionStyles: [
        "Support the underlying need rather than only the immediate problem",
        "Remain steady while allowing necessary changes to occur",
        "Set clear limits around how much responsibility you can realistically carry",
      ],

      cautionStyles: [
        "Avoid absorbing pressure that does not belong to you",
        "Don't protect an arrangement from changes it genuinely needs",
        "Recognise when support should shift from carrying the problem to enabling resolution",
      ],
    },
  },
    Ashlesha: {
    1: {
      nakshatra: "Ashlesha",
      pada: 1,
      navamsa: "Sagittarius",

      coreTheme: "Finding clarity by understanding the larger meaning behind a complex situation",

      interpretiveThemes: [
        "Discernment",
        "Understanding",
        "Perspective",
        "Uncovering patterns",
      ],

      supportiveExpressions: [
        "Greater understanding of a situation that previously felt complicated",
        "An opportunity to recognise the larger pattern behind an issue",
        "Progress through questioning an existing assumption",
      ],

      cautionExpressions: [
        "Reading too much meaning into limited information",
        "Becoming overly certain about another person's intentions",
        "Using one insight to make a broader conclusion too quickly",
      ],

      narrativeAngles: [
        "A complicated matter that may become clearer when viewed in a wider context",
        "An opportunity to understand what has been influencing a situation underneath",
        "Progress through recognising a pattern you may have previously overlooked",
        "A situation that may require looking beyond the immediate explanation",
      ],

      actionStyles: [
        "Consider the larger pattern before responding to the immediate issue",
        "Use what you have learned to clarify the next practical step",
        "Question an assumption that may be shaping your understanding of the situation",
      ],

      cautionStyles: [
        "Avoid treating an interpretation as a confirmed fact",
        "Don't assume you fully understand another person's motives",
        "Keep broader conclusions proportionate to the evidence available",
      ],
    },

    2: {
      nakshatra: "Ashlesha",
      pada: 2,
      navamsa: "Capricorn",

      coreTheme: "Managing complexity through boundaries and practical control",

      interpretiveThemes: [
        "Boundaries",
        "Strategy",
        "Responsibility",
        "Practical control",
      ],

      supportiveExpressions: [
        "Greater control over a complicated responsibility",
        "An opportunity to establish clearer boundaries",
        "Progress through dealing methodically with an unresolved issue",
      ],

      cautionExpressions: [
        "Trying to control circumstances that require flexibility",
        "Carrying an obligation because it is difficult to release",
        "Becoming overly guarded in a practical relationship",
      ],

      narrativeAngles: [
        "A complicated responsibility that may require firmer boundaries",
        "An opportunity to simplify an arrangement that has become difficult to manage",
        "Progress through dealing systematically with an unresolved matter",
        "A situation where clearer limits may improve the practical outcome",
      ],

      actionStyles: [
        "Define what is genuinely your responsibility before taking further action",
        "Deal with the issue systematically rather than reacting to each new complication",
        "Establish a practical boundary where expectations have become unclear",
      ],

      cautionStyles: [
        "Avoid trying to control every part of the situation",
        "Don't continue carrying an obligation simply because releasing it feels difficult",
        "Keep necessary boundaries from becoming unnecessary rigidity",
      ],
    },

    3: {
      nakshatra: "Ashlesha",
      pada: 3,
      navamsa: "Aquarius",

      coreTheme: "Recognising hidden patterns through objectivity and detachment",

      interpretiveThemes: [
        "Objectivity",
        "Patterns",
        "Independent thinking",
        "Reassessment",
      ],

      supportiveExpressions: [
        "A clearer understanding of a recurring pattern",
        "An opportunity to step outside an unhelpful dynamic",
        "Progress through viewing a complicated situation more objectively",
      ],

      cautionExpressions: [
        "Becoming emotionally detached from an issue that still requires sensitivity",
        "Assuming every repeated difficulty has the same cause",
        "Making an abrupt break before understanding the consequences",
      ],

      narrativeAngles: [
        "A recurring situation that may reveal an important pattern",
        "An opportunity to view an established dynamic from a different perspective",
        "Progress through stepping outside a cycle that has become unproductive",
        "A complicated matter that may become clearer with greater objectivity",
      ],

      actionStyles: [
        "Identify the pattern rather than responding only to the latest incident",
        "Create enough distance to assess the situation objectively",
        "Change the part of the pattern that is realistically within your control",
      ],

      cautionStyles: [
        "Avoid becoming detached from legitimate emotional considerations",
        "Don't assume that recognising a pattern automatically explains every situation",
        "Consider the practical consequences before making a sudden break",
      ],
    },

    4: {
      nakshatra: "Ashlesha",
      pada: 4,
      navamsa: "Pisces",

      coreTheme: "Releasing complex attachments through understanding and acceptance",

      interpretiveThemes: [
        "Release",
        "Emotional understanding",
        "Closure",
        "Discernment",
      ],

      supportiveExpressions: [
        "An opportunity to release an issue that has consumed unnecessary attention",
        "Greater understanding of an emotionally complicated situation",
        "Progress toward closure or acceptance",
      ],

      cautionExpressions: [
        "Remaining emotionally attached to an unclear situation",
        "Confusing intuition with confirmed information",
        "Avoiding a necessary boundary out of sympathy",
      ],

      narrativeAngles: [
        "A complicated matter that may be ready for greater acceptance or closure",
        "An opportunity to release an attachment that is no longer useful",
        "Progress through understanding what can and cannot realistically be changed",
        "A situation that may require both sensitivity and clearer boundaries",
      ],

      actionStyles: [
        "Release the part of the situation that no longer requires your involvement",
        "Separate what you intuitively feel from what you can practically confirm",
        "Move toward closure where continued involvement is no longer productive",
      ],

      cautionStyles: [
        "Avoid remaining involved solely because letting go feels uncomfortable",
        "Don't treat intuition as a substitute for clear evidence",
        "Maintain reasonable boundaries even when you understand another person's position",
      ],
    },
  },
    Magha: {
    1: {
      nakshatra: "Magha",
      pada: 1,
      navamsa: "Aries",

      coreTheme: "Taking purposeful action from a position of responsibility",

      interpretiveThemes: [
        "Authority",
        "Initiative",
        "Responsibility",
        "Personal leadership",
      ],

      supportiveExpressions: [
        "An opportunity to take ownership of an important matter",
        "Progress through confident and responsible action",
        "Greater clarity about where your leadership is needed",
      ],

      cautionExpressions: [
        "Acting from authority without considering other perspectives",
        "Taking control before understanding the full situation",
        "Allowing pride to influence a practical decision",
      ],

      narrativeAngles: [
        "A situation that may require you to take the lead",
        "An opportunity to act with greater authority and responsibility",
        "Progress through taking ownership of an established priority",
        "A matter where decisive action may help restore direction",
      ],

      actionStyles: [
        "Take responsibility for the decision that genuinely belongs to you",
        "Use your authority to create clear forward movement",
        "Act decisively while respecting the responsibilities of others",
      ],

      cautionStyles: [
        "Avoid turning leadership into unnecessary control",
        "Don't let pride prevent you from considering useful advice",
        "Confirm the situation before taking decisive action",
      ],
    },

    2: {
      nakshatra: "Magha",
      pada: 2,
      navamsa: "Taurus",

      coreTheme: "Strengthening established foundations and preserving lasting value",

      interpretiveThemes: [
        "Stability",
        "Legacy",
        "Resources",
        "Preservation",
      ],

      supportiveExpressions: [
        "An opportunity to strengthen something already established",
        "Progress through protecting a valuable resource or foundation",
        "Greater stability around an existing responsibility",
      ],

      cautionExpressions: [
        "Holding on to an arrangement simply because it is established",
        "Resisting a useful change to preserve familiarity",
        "Placing too much importance on status or material security",
      ],

      narrativeAngles: [
        "An established matter that may benefit from strengthening its foundations",
        "An opportunity to preserve something of genuine long-term value",
        "Progress through consolidating what has already been built",
        "A responsibility involving resources, stability or an existing structure",
      ],

      actionStyles: [
        "Strengthen the foundation before considering further expansion",
        "Protect the resource or arrangement that continues to provide real value",
        "Review whether an established commitment remains sustainable",
      ],

      cautionStyles: [
        "Avoid preserving something solely because it has existed for a long time",
        "Don't resist a practical adjustment simply because the current arrangement feels secure",
        "Distinguish lasting value from attachment to familiarity",
      ],
    },

    3: {
      nakshatra: "Magha",
      pada: 3,
      navamsa: "Gemini",

      coreTheme: "Carrying knowledge, influence and established experience forward",

      interpretiveThemes: [
        "Communication",
        "Knowledge",
        "Influence",
        "Learning from experience",
      ],

      supportiveExpressions: [
        "A useful conversation with someone experienced or influential",
        "Progress through applying knowledge gained previously",
        "An opportunity to communicate from a position of experience",
      ],

      cautionExpressions: [
        "Relying on past experience without considering new information",
        "Speaking with more authority than the situation requires",
        "Becoming distracted by competing opinions",
      ],

      narrativeAngles: [
        "Past experience that may provide useful guidance now",
        "A conversation that may clarify an established responsibility",
        "An opportunity to share or receive valuable knowledge",
        "Progress through combining experience with new information",
      ],

      actionStyles: [
        "Use previous experience while remaining open to new information",
        "Have the conversation needed to clarify expectations or responsibilities",
        "Share what you know in a way that helps move the matter forward",
      ],

      cautionStyles: [
        "Avoid assuming that what worked previously must work in the same way now",
        "Don't use experience as a reason to dismiss another perspective",
        "Keep communication focused on the issue rather than authority or status",
      ],
    },

    4: {
      nakshatra: "Magha",
      pada: 4,
      navamsa: "Cancer",

      coreTheme: "Protecting legacy, belonging and important personal foundations",

      interpretiveThemes: [
        "Belonging",
        "Family",
        "Protection",
        "Emotional foundations",
      ],

      supportiveExpressions: [
        "An opportunity to strengthen an important personal foundation",
        "Progress around a family or long-standing responsibility",
        "Greater appreciation of what provides genuine security and belonging",
      ],

      cautionExpressions: [
        "Taking responsibility for maintaining every family or established expectation",
        "Allowing emotional attachment to prevent necessary change",
        "Reacting defensively when something familiar is questioned",
      ],

      narrativeAngles: [
        "A family or long-standing matter that may require attention",
        "An opportunity to strengthen something that provides genuine belonging",
        "Progress through protecting what matters while allowing reasonable change",
        "An established responsibility that may carry personal or emotional significance",
      ],

      actionStyles: [
        "Give attention to the foundation that genuinely supports you or others",
        "Address an important personal responsibility with both care and practicality",
        "Preserve what remains valuable while allowing outdated expectations to change",
      ],

      cautionStyles: [
        "Avoid carrying an obligation solely because it has always been expected",
        "Don't let emotional attachment prevent a reasonable adjustment",
        "Protect what matters without becoming defensive about necessary change",
      ],
    },
  },
    PurvaPhalguni: {
    1: {
      nakshatra: "Purva Phalguni",
      pada: 1,
      navamsa: "Leo",

      coreTheme: "Expressing creativity, confidence and personal enjoyment",

      interpretiveThemes: [
        "Creativity",
        "Self-expression",
        "Enjoyment",
        "Recognition",
      ],

      supportiveExpressions: [
        "An opportunity to express yourself with greater confidence",
        "Progress around a creative or personally meaningful priority",
        "Greater enjoyment of something you have already worked toward",
      ],

      cautionExpressions: [
        "Seeking recognition more than meaningful progress",
        "Allowing enjoyment to distract from an important responsibility",
        "Making a choice mainly because it feels rewarding in the moment",
      ],

      narrativeAngles: [
        "An opportunity to give more attention to something personally meaningful",
        "A situation where confidence and self-expression may help",
        "Progress around a creative, social or enjoyable priority",
        "A chance to appreciate the results of previous effort",
      ],

      actionStyles: [
        "Give focused attention to the opportunity that genuinely inspires you",
        "Express your position confidently without making recognition the objective",
        "Make room to enjoy progress while continuing the work that supports it",
      ],

      cautionStyles: [
        "Avoid making approval or recognition the measure of success",
        "Don't allow immediate enjoyment to displace an important responsibility",
        "Keep confidence from becoming unnecessary self-focus",
      ],
    },

    2: {
      nakshatra: "Purva Phalguni",
      pada: 2,
      navamsa: "Virgo",

      coreTheme: "Turning enjoyment and creativity into practical value",

      interpretiveThemes: [
        "Practical creativity",
        "Refinement",
        "Productivity",
        "Improvement",
      ],

      supportiveExpressions: [
        "An opportunity to make a creative idea more practical",
        "Progress through refining something you value",
        "Greater satisfaction from improving an existing situation",
      ],

      cautionExpressions: [
        "Overanalysing something that should also be enjoyed",
        "Becoming overly critical of your own or another person's contribution",
        "Turning a pleasant opportunity into another obligation",
      ],

      narrativeAngles: [
        "Something enjoyable or creative that may benefit from practical refinement",
        "An opportunity to improve the details of something personally important",
        "Progress through combining creativity with organisation",
        "A situation where a small practical adjustment may improve the overall experience",
      ],

      actionStyles: [
        "Turn a useful idea into a practical next step",
        "Improve the detail that will make the greatest difference",
        "Create enough structure to help something enjoyable develop sustainably",
      ],

      cautionStyles: [
        "Avoid analysing away the value of a positive experience",
        "Don't demand perfection before allowing yourself to appreciate progress",
        "Keep useful organisation from turning into unnecessary pressure",
      ],
    },

    3: {
      nakshatra: "Purva Phalguni",
      pada: 3,
      navamsa: "Libra",

      coreTheme: "Creating enjoyment and progress through balanced relationships",

      interpretiveThemes: [
        "Relationships",
        "Harmony",
        "Attraction",
        "Agreements",
      ],

      supportiveExpressions: [
        "A constructive development in an important relationship",
        "An opportunity for cooperation or mutual enjoyment",
        "Progress through a balanced agreement or shared interest",
      ],

      cautionExpressions: [
        "Agreeing too readily to preserve harmony",
        "Depending on another person's approval",
        "Prioritising attraction or enjoyment over practical compatibility",
      ],

      narrativeAngles: [
        "A relationship or agreement that may benefit from positive attention",
        "An opportunity to create a more balanced arrangement",
        "Progress through cooperation and shared interests",
        "A social or personal connection that may become more important",
      ],

      actionStyles: [
        "Clarify what would make the arrangement mutually beneficial",
        "Give appropriate attention to an important relationship or partnership",
        "Look for the balance between personal enjoyment and shared responsibility",
      ],

      cautionStyles: [
        "Avoid agreeing simply because the interaction feels pleasant",
        "Don't let another person's approval determine your position",
        "Consider practical compatibility alongside attraction or enthusiasm",
      ],
    },

    4: {
      nakshatra: "Purva Phalguni",
      pada: 4,
      navamsa: "Scorpio",

      coreTheme: "Deepening commitments while recognising the intensity behind desire",

      interpretiveThemes: [
        "Commitment",
        "Intensity",
        "Desire",
        "Transformation",
      ],

      supportiveExpressions: [
        "A deeper understanding of what you genuinely value",
        "An opportunity to strengthen an important commitment",
        "Progress through addressing what lies beneath a strong desire or attachment",
      ],

      cautionExpressions: [
        "Becoming overly attached to a desired outcome",
        "Allowing attraction or emotion to override practical judgement",
        "Turning disappointment into unnecessary conflict",
      ],

      narrativeAngles: [
        "A personally important matter that may carry greater intensity today",
        "An opportunity to understand what you genuinely want from a situation",
        "Progress through addressing the deeper expectations within a commitment",
        "A relationship or valued priority that may require greater honesty",
      ],

      actionStyles: [
        "Clarify what you genuinely want before increasing your commitment",
        "Address the deeper expectation rather than reacting only to the immediate situation",
        "Invest your energy where there is both genuine value and practical substance",
      ],

      cautionStyles: [
        "Avoid allowing strong desire to become attachment to one outcome",
        "Don't let emotional intensity replace practical judgement",
        "Keep disappointment from turning a manageable issue into a confrontation",
      ],
    },
  },
    UttaraPhalguni: {
    1: {
      nakshatra: "Uttara Phalguni",
      pada: 1,
      navamsa: "Sagittarius",

      coreTheme: "Strengthening commitments through shared purpose and clear principles",

      interpretiveThemes: [
        "Commitment",
        "Purpose",
        "Agreements",
        "Shared direction",
      ],

      supportiveExpressions: [
        "Greater clarity about the purpose of an important commitment",
        "An opportunity to strengthen an agreement through shared understanding",
        "Progress through aligning expectations with longer-term goals",
      ],

      cautionExpressions: [
        "Making promises before considering the practical obligations",
        "Assuming shared values automatically mean shared expectations",
        "Becoming overly certain about how an agreement should develop",
      ],

      narrativeAngles: [
        "An agreement that may benefit from greater clarity about its longer-term purpose",
        "An opportunity to strengthen a commitment through shared understanding",
        "Progress through clarifying the direction of an important arrangement",
        "A responsibility that may make more sense when viewed in its wider context",
      ],

      actionStyles: [
        "Clarify the longer-term objective before increasing your commitment",
        "Make sure expectations support the direction both sides intend to take",
        "Use the larger purpose of the arrangement to guide the next practical step",
      ],

      cautionStyles: [
        "Avoid promising more than the practical situation supports",
        "Don't assume agreement on principles means every expectation is understood",
        "Leave room for practical details to modify the larger plan",
      ],
    },

    2: {
      nakshatra: "Uttara Phalguni",
      pada: 2,
      navamsa: "Capricorn",

      coreTheme: "Making commitments sustainable through structure and responsibility",

      interpretiveThemes: [
        "Responsibility",
        "Structure",
        "Reliability",
        "Long-term commitment",
      ],

      supportiveExpressions: [
        "Progress through formalising an important responsibility",
        "An opportunity to make an existing arrangement more dependable",
        "Greater stability through clearly defined commitments",
      ],

      cautionExpressions: [
        "Accepting more responsibility than is sustainable",
        "Remaining in an arrangement purely from obligation",
        "Making commitments too rigid to accommodate reasonable change",
      ],

      narrativeAngles: [
        "An existing commitment that may need clearer structure",
        "An opportunity to make an agreement more practical and sustainable",
        "Progress through defining responsibilities more clearly",
        "A long-term matter that may benefit from greater organisation",
      ],

      actionStyles: [
        "Clarify who is responsible for what before proceeding further",
        "Put a practical structure around an important commitment",
        "Make sure the arrangement remains sustainable over time",
      ],

      cautionStyles: [
        "Avoid accepting an obligation without considering its longer-term demands",
        "Don't maintain an arrangement solely because you feel responsible for it",
        "Allow enough flexibility for circumstances to change",
      ],
    },

    3: {
      nakshatra: "Uttara Phalguni",
      pada: 3,
      navamsa: "Aquarius",

      coreTheme: "Improving commitments through fairness and objective reassessment",

      interpretiveThemes: [
        "Fairness",
        "Cooperation",
        "Reassessment",
        "Shared responsibility",
      ],

      supportiveExpressions: [
        "An opportunity to improve how responsibilities are shared",
        "Greater clarity about whether an arrangement remains fair",
        "Progress through updating an established agreement",
      ],

      cautionExpressions: [
        "Treating an important relationship too impersonally",
        "Changing an arrangement without considering individual circumstances",
        "Prioritising theoretical fairness over practical realities",
      ],

      narrativeAngles: [
        "An established agreement that may benefit from objective review",
        "An opportunity to create a fairer distribution of responsibility",
        "Progress through updating an arrangement that no longer works as effectively",
        "A shared matter where expectations may need to evolve",
      ],

      actionStyles: [
        "Review whether responsibilities are still distributed fairly",
        "Discuss how an established arrangement can work better for everyone involved",
        "Update expectations where circumstances have genuinely changed",
      ],

      cautionStyles: [
        "Avoid treating fairness as purely mathematical",
        "Don't overlook individual circumstances when changing a shared arrangement",
        "Keep objectivity from becoming emotional distance",
      ],
    },

    4: {
      nakshatra: "Uttara Phalguni",
      pada: 4,
      navamsa: "Pisces",

      coreTheme: "Honouring commitments while balancing compassion with healthy boundaries",

      interpretiveThemes: [
        "Support",
        "Compassion",
        "Commitment",
        "Boundaries",
      ],

      supportiveExpressions: [
        "An opportunity to support an important commitment with greater understanding",
        "Progress through a compassionate adjustment to an existing arrangement",
        "Greater clarity about where support is genuinely useful",
      ],

      cautionExpressions: [
        "Giving more than an arrangement reasonably requires",
        "Maintaining a commitment primarily from guilt or sympathy",
        "Allowing unclear expectations to weaken necessary boundaries",
      ],

      narrativeAngles: [
        "A commitment that may require both understanding and clearer boundaries",
        "An opportunity to support someone without taking over their responsibility",
        "Progress through adjusting an agreement with sensitivity",
        "A situation where compassion and practical expectations need to remain balanced",
      ],

      actionStyles: [
        "Offer support in a way that preserves appropriate responsibility on both sides",
        "Clarify expectations where goodwill has created uncertainty",
        "Adjust the arrangement compassionately without losing practical boundaries",
      ],

      cautionStyles: [
        "Avoid making commitments primarily from guilt or sympathy",
        "Don't allow generosity to create an unsustainable responsibility",
        "Keep compassion from replacing necessary clarity",
      ],
    },
  },
    Hasta: {
    1: {
      nakshatra: "Hasta",
      pada: 1,
      navamsa: "Aries",

      coreTheme: "Turning intention into action through practical initiative",

      interpretiveThemes: [
        "Initiative",
        "Practical action",
        "Skill",
        "Taking matters in hand",
      ],

      supportiveExpressions: [
        "An opportunity to deal directly with an important matter",
        "Progress through taking a practical first step",
        "Greater confidence in handling something yourself",
      ],

      cautionExpressions: [
        "Acting before understanding all the practical requirements",
        "Trying to handle everything personally",
        "Becoming impatient when results require repeated effort",
      ],

      narrativeAngles: [
        "A practical matter that may benefit from direct action",
        "An opportunity to take something into your own hands",
        "Progress through applying your skills rather than waiting for circumstances to change",
        "A situation where a clear practical step may create momentum",
      ],

      actionStyles: [
        "Take the practical step that is directly within your control",
        "Use your existing skills to move the matter forward",
        "Deal with the immediate requirement before expanding the plan",
      ],

      cautionStyles: [
        "Avoid acting before checking what the task actually requires",
        "Don't assume you need to handle every part yourself",
        "Keep urgency from creating unnecessary mistakes",
      ],
    },

    2: {
      nakshatra: "Hasta",
      pada: 2,
      navamsa: "Taurus",

      coreTheme: "Building tangible results through steady and skilful effort",

      interpretiveThemes: [
        "Craftsmanship",
        "Resources",
        "Steady progress",
        "Tangible results",
      ],

      supportiveExpressions: [
        "Steady progress on something requiring practical skill",
        "An opportunity to improve or strengthen a useful resource",
        "Visible results from consistent effort",
      ],

      cautionExpressions: [
        "Holding too tightly to one method",
        "Expecting immediate tangible results",
        "Prioritising comfort over a necessary practical adjustment",
      ],

      narrativeAngles: [
        "A practical effort that may begin producing more tangible results",
        "An opportunity to strengthen something through consistent attention",
        "Progress through applying a reliable skill or method",
        "A matter that may benefit more from steady work than dramatic change",
      ],

      actionStyles: [
        "Continue building on the method that is producing practical results",
        "Give focused attention to the resource or task with lasting value",
        "Choose steady execution over unnecessary changes",
      ],

      cautionStyles: [
        "Avoid becoming attached to a method that clearly needs adjustment",
        "Don't measure progress only by immediate results",
        "Remain practical without becoming resistant to useful change",
      ],
    },

    3: {
      nakshatra: "Hasta",
      pada: 3,
      navamsa: "Gemini",

      coreTheme: "Solving practical matters through communication and adaptability",

      interpretiveThemes: [
        "Communication",
        "Coordination",
        "Adaptability",
        "Problem-solving",
      ],

      supportiveExpressions: [
        "A useful conversation that helps resolve a practical issue",
        "Progress through coordination or exchange of information",
        "An opportunity to adapt your approach using new information",
      ],

      cautionExpressions: [
        "Trying too many solutions at once",
        "Acting on incomplete instructions or information",
        "Allowing discussion to replace practical execution",
      ],

      narrativeAngles: [
        "A practical issue that may become easier through better communication",
        "New information that helps you handle an existing matter more effectively",
        "Progress through coordinating the right people or resources",
        "An opportunity to adjust your method as circumstances become clearer",
      ],

      actionStyles: [
        "Clarify the information needed before completing the task",
        "Coordinate the practical details with the people involved",
        "Adapt your method where new information makes the process easier",
      ],

      cautionStyles: [
        "Avoid changing methods repeatedly without testing what works",
        "Don't proceed on the basis of incomplete instructions",
        "Make sure useful discussion leads to practical execution",
      ],
    },

    4: {
      nakshatra: "Hasta",
      pada: 4,
      navamsa: "Cancer",

      coreTheme: "Creating order and security through attentive practical care",

      interpretiveThemes: [
        "Care",
        "Practical support",
        "Security",
        "Attentive handling",
      ],

      supportiveExpressions: [
        "An opportunity to improve something through careful personal attention",
        "Progress on a matter connected with security or support",
        "Greater stability through handling practical needs thoughtfully",
      ],

      cautionExpressions: [
        "Taking responsibility for fixing everything yourself",
        "Becoming emotionally invested in controlling the outcome",
        "Allowing concern to create unnecessary intervention",
      ],

      narrativeAngles: [
        "A personal or practical matter that may benefit from careful attention",
        "An opportunity to create greater order or security",
        "Progress through handling an important responsibility thoughtfully",
        "A situation where practical support may make a meaningful difference",
      ],

      actionStyles: [
        "Give careful attention to the practical need that matters most",
        "Create order around the part of the situation you can realistically manage",
        "Offer useful support without taking over another person's responsibility",
      ],

      cautionStyles: [
        "Avoid assuming that every problem requires your intervention",
        "Don't let concern turn into a need to control the outcome",
        "Keep practical support within reasonable boundaries",
      ],
    },
  },
    Chitra: {
    1: {
      nakshatra: "Chitra",
      pada: 1,
      navamsa: "Leo",

      coreTheme: "Creating something distinctive through confidence and personal vision",

      interpretiveThemes: [
        "Creation",
        "Visibility",
        "Personal vision",
        "Self-expression",
      ],

      supportiveExpressions: [
        "An opportunity to present something with greater confidence",
        "Progress on a creative or personally important project",
        "Greater clarity about how you want something to be expressed",
      ],

      cautionExpressions: [
        "Prioritising appearance over practical substance",
        "Seeking recognition before the work is ready",
        "Becoming overly attached to your own vision",
      ],

      narrativeAngles: [
        "An opportunity to give clearer form to something you want to create",
        "A project or idea that may benefit from stronger personal direction",
        "Progress through presenting something more confidently",
        "A situation where your individual contribution may become more visible",
      ],

      actionStyles: [
        "Give the idea a clearer and more distinctive form",
        "Present your contribution confidently while remaining open to useful feedback",
        "Focus on the improvement that makes the work genuinely stronger",
      ],

      cautionStyles: [
        "Avoid improving appearance while overlooking practical substance",
        "Don't make recognition more important than the quality of the outcome",
        "Remain open to changes that strengthen the original idea",
      ],
    },

    2: {
      nakshatra: "Chitra",
      pada: 2,
      navamsa: "Virgo",

      coreTheme: "Refining ideas through precision, skill and practical improvement",

      interpretiveThemes: [
        "Refinement",
        "Precision",
        "Craftsmanship",
        "Improvement",
      ],

      supportiveExpressions: [
        "An opportunity to improve an important detail",
        "Progress through careful refinement",
        "Greater quality through practical attention and skill",
      ],

      cautionExpressions: [
        "Becoming overly critical of minor imperfections",
        "Delaying completion while trying to perfect every detail",
        "Focusing on flaws more than overall progress",
      ],

      narrativeAngles: [
        "Something you are developing may benefit from careful refinement",
        "An opportunity to improve the quality of an existing piece of work",
        "Progress through correcting an important practical detail",
        "A matter where precision may produce a noticeably better result",
      ],

      actionStyles: [
        "Refine the detail that most affects the overall outcome",
        "Use careful review to improve what has already been created",
        "Complete the necessary correction without redesigning everything",
      ],

      cautionStyles: [
        "Avoid allowing perfectionism to delay completion",
        "Don't give minor imperfections more importance than they deserve",
        "Keep refinement focused on changes that materially improve the result",
      ],
    },

    3: {
      nakshatra: "Chitra",
      pada: 3,
      navamsa: "Libra",

      coreTheme: "Creating harmony through design, collaboration and balanced presentation",

      interpretiveThemes: [
        "Design",
        "Harmony",
        "Collaboration",
        "Presentation",
      ],

      supportiveExpressions: [
        "Progress through improving presentation or balance",
        "An opportunity to create something collaboratively",
        "Greater harmony in an arrangement that needs refinement",
      ],

      cautionExpressions: [
        "Changing something mainly to gain approval",
        "Compromising the substance of an idea for presentation",
        "Spending too much time comparing alternatives",
      ],

      narrativeAngles: [
        "An arrangement that may benefit from better balance or presentation",
        "An opportunity to improve something through collaboration",
        "Progress through combining different perspectives more effectively",
        "A creative or practical matter that may become stronger through refinement",
      ],

      actionStyles: [
        "Improve the balance between practical substance and presentation",
        "Use collaboration where another perspective genuinely strengthens the result",
        "Refine the arrangement without losing its original purpose",
      ],

      cautionStyles: [
        "Avoid changing something solely to make it more acceptable to others",
        "Don't sacrifice practical value for appearance",
        "Choose a workable direction rather than endlessly comparing alternatives",
      ],
    },

    4: {
      nakshatra: "Chitra",
      pada: 4,
      navamsa: "Scorpio",

      coreTheme: "Transforming something by addressing its deeper structure",

      interpretiveThemes: [
        "Transformation",
        "Depth",
        "Reconstruction",
        "Focused creation",
      ],

      supportiveExpressions: [
        "An opportunity to make a meaningful improvement beneath the surface",
        "Progress through rebuilding an important part of something",
        "Greater understanding of what fundamentally needs to change",
      ],

      cautionExpressions: [
        "Changing more than the situation actually requires",
        "Becoming fixated on hidden flaws",
        "Destroying useful elements while trying to improve the whole",
      ],

      narrativeAngles: [
        "Something may require deeper improvement rather than a cosmetic adjustment",
        "An opportunity to rebuild an important part of an existing situation",
        "Progress through identifying what lies beneath a recurring weakness",
        "A project or arrangement that may become stronger after meaningful restructuring",
      ],

      actionStyles: [
        "Address the structural issue rather than only improving appearances",
        "Preserve what works while rebuilding the part that genuinely needs change",
        "Use focused effort to make one meaningful improvement",
      ],

      cautionStyles: [
        "Avoid dismantling useful parts of the situation unnecessarily",
        "Don't assume every imperfection indicates a deeper problem",
        "Keep the scale of the change proportionate to what actually needs improvement",
      ],
    },
  },
    Swati: {
    1: {
      nakshatra: "Swati",
      pada: 1,
      navamsa: "Sagittarius",

      coreTheme: "Expanding independently while finding a clearer direction",

      interpretiveThemes: [
        "Independence",
        "Exploration",
        "Growth",
        "Finding direction",
      ],

      supportiveExpressions: [
        "An opportunity to explore a more independent direction",
        "Progress through widening your perspective",
        "Greater clarity about where greater freedom could be useful",
      ],

      cautionExpressions: [
        "Changing direction simply for the sake of freedom",
        "Taking on more possibilities than can realistically be pursued",
        "Assuming independence means avoiding useful commitments",
      ],

      narrativeAngles: [
        "An opportunity that may offer greater room to grow independently",
        "A situation where exploring a different direction could be useful",
        "Progress through giving yourself enough space to consider the wider possibilities",
        "A matter that may become clearer when viewed beyond its immediate limitations",
      ],

      actionStyles: [
        "Explore the option that offers meaningful room for growth",
        "Use greater independence to make a purposeful next decision",
        "Consider the wider possibilities before settling on one direction",
      ],

      cautionStyles: [
        "Avoid changing direction only because the current path feels restrictive",
        "Don't spread your effort across too many possibilities",
        "Keep freedom connected to a clear longer-term purpose",
      ],
    },

    2: {
      nakshatra: "Swati",
      pada: 2,
      navamsa: "Capricorn",

      coreTheme: "Building independence through discipline and practical self-reliance",

      interpretiveThemes: [
        "Self-reliance",
        "Discipline",
        "Practical independence",
        "Sustainable progress",
      ],

      supportiveExpressions: [
        "Greater control over an important responsibility",
        "Progress through relying on your own practical judgement",
        "An opportunity to create a more sustainable independent structure",
      ],

      cautionExpressions: [
        "Taking on everything yourself",
        "Becoming overly rigid in the pursuit of independence",
        "Rejecting useful support because you want complete control",
      ],

      narrativeAngles: [
        "A responsibility that may benefit from greater personal control",
        "An opportunity to create a more independent practical arrangement",
        "Progress through disciplined and self-directed effort",
        "A situation where clearer structure may give you greater freedom",
      ],

      actionStyles: [
        "Build the practical structure needed to support greater independence",
        "Take responsibility for the part of the situation directly within your control",
        "Use discipline to reduce unnecessary dependence on uncertain circumstances",
      ],

      cautionStyles: [
        "Avoid assuming independence requires doing everything alone",
        "Don't reject useful cooperation simply to maintain control",
        "Keep structure supportive rather than unnecessarily restrictive",
      ],
    },

    3: {
      nakshatra: "Swati",
      pada: 3,
      navamsa: "Aquarius",

      coreTheme: "Finding freedom through objectivity, flexibility and new approaches",

      interpretiveThemes: [
        "Freedom",
        "Adaptability",
        "Innovation",
        "Independent thinking",
      ],

      supportiveExpressions: [
        "A new approach that provides greater flexibility",
        "Progress through questioning an unnecessary limitation",
        "An opportunity to work more independently or efficiently",
      ],

      cautionExpressions: [
        "Rejecting structure simply because it feels limiting",
        "Changing arrangements before a better alternative is ready",
        "Becoming detached from the people affected by a decision",
      ],

      narrativeAngles: [
        "An existing arrangement that may benefit from greater flexibility",
        "An opportunity to approach a persistent issue differently",
        "Progress through removing an unnecessary limitation",
        "A situation where independent thinking may reveal a better alternative",
      ],

      actionStyles: [
        "Identify which limitation is genuinely preventing progress",
        "Test a more flexible approach before making a larger change",
        "Use independent thinking to improve rather than simply reject the current arrangement",
      ],

      cautionStyles: [
        "Avoid treating every structure as a restriction",
        "Don't abandon a workable arrangement before testing the alternative",
        "Consider how greater independence may affect others involved",
      ],
    },

    4: {
      nakshatra: "Swati",
      pada: 4,
      navamsa: "Pisces",

      coreTheme: "Adapting with flexibility while maintaining a clear inner direction",

      interpretiveThemes: [
        "Adaptability",
        "Flow",
        "Release",
        "Inner direction",
      ],

      supportiveExpressions: [
        "An opportunity to adapt more easily to changing circumstances",
        "Progress through releasing an unnecessary restriction",
        "Greater ease once you stop trying to control every variable",
      ],

      cautionExpressions: [
        "Drifting without a clear practical direction",
        "Adapting so much that your own priorities become unclear",
        "Avoiding a decision in the name of keeping options open",
      ],

      narrativeAngles: [
        "A changing situation that may require greater flexibility",
        "An opportunity to release a restriction that no longer serves a practical purpose",
        "Progress through adapting without losing sight of what matters",
        "A matter that may move more easily once unnecessary resistance is reduced",
      ],

      actionStyles: [
        "Adapt the plan while keeping the main objective clear",
        "Release the part of the situation you no longer need to control",
        "Allow circumstances some flexibility without abandoning practical direction",
      ],

      cautionStyles: [
        "Avoid keeping every option open when a decision is actually required",
        "Don't adapt so completely that your own priorities disappear",
        "Keep flexibility anchored to a practical objective",
      ],
    },
  },
    Vishakha: {
    1: {
      nakshatra: "Vishakha",
      pada: 1,
      navamsa: "Aries",

      coreTheme: "Pursuing an important objective with focused initiative",

      interpretiveThemes: [
        "Determination",
        "Initiative",
        "Goals",
        "Focused action",
      ],

      supportiveExpressions: [
        "Momentum toward an important objective",
        "An opportunity to act decisively on a clear priority",
        "Greater determination to move a matter forward",
      ],

      cautionExpressions: [
        "Pushing too hard for immediate results",
        "Treating every obstacle as something to overcome by force",
        "Becoming fixated on one outcome",
      ],

      narrativeAngles: [
        "An important objective that may benefit from decisive action",
        "An opportunity to direct your energy toward a clear priority",
        "Progress through committing to the next practical step",
        "A situation where focused effort may create useful momentum",
      ],

      actionStyles: [
        "Choose the objective that deserves your strongest effort",
        "Take one decisive step toward the result you are pursuing",
        "Direct your energy toward what can realistically be advanced today",
      ],

      cautionStyles: [
        "Avoid forcing progress where circumstances require patience",
        "Don't turn determination into attachment to one outcome",
        "Keep the scale of your effort proportionate to the opportunity",
      ],
    },

    2: {
      nakshatra: "Vishakha",
      pada: 2,
      navamsa: "Taurus",

      coreTheme: "Building toward a goal through persistence and practical consolidation",

      interpretiveThemes: [
        "Persistence",
        "Resources",
        "Steady achievement",
        "Practical growth",
      ],

      supportiveExpressions: [
        "Steady progress toward a material or practical objective",
        "An opportunity to strengthen the resources supporting a goal",
        "Visible results from sustained effort",
      ],

      cautionExpressions: [
        "Holding on to a goal after circumstances have changed",
        "Measuring success only through tangible results",
        "Becoming reluctant to adjust an established approach",
      ],

      narrativeAngles: [
        "A longer-term objective that may show practical progress",
        "An opportunity to strengthen the resources behind an important goal",
        "Progress through patient and consistent effort",
        "A matter where consolidation may be more useful than expansion",
      ],

      actionStyles: [
        "Strengthen the practical foundation supporting your objective",
        "Continue the effort that is producing sustainable progress",
        "Review the resources needed for the next stage before expanding further",
      ],

      cautionStyles: [
        "Avoid continuing an approach solely because you have already invested in it",
        "Don't measure every development by immediate material results",
        "Remain willing to adjust the plan when circumstances genuinely change",
      ],
    },

    3: {
      nakshatra: "Vishakha",
      pada: 3,
      navamsa: "Gemini",

      coreTheme: "Advancing goals through communication, strategy and adaptable thinking",

      interpretiveThemes: [
        "Strategy",
        "Communication",
        "Options",
        "Adaptability",
      ],

      supportiveExpressions: [
        "A useful conversation that advances an objective",
        "New information that reveals another route forward",
        "Progress through strategic communication or coordination",
      ],

      cautionExpressions: [
        "Pursuing too many objectives simultaneously",
        "Changing strategy whenever new information appears",
        "Talking about the goal more than executing the plan",
      ],

      narrativeAngles: [
        "A conversation that may help move an important objective forward",
        "New information that could improve your strategy",
        "An opportunity to consider another route toward the same goal",
        "Progress through coordinating information, people or priorities",
      ],

      actionStyles: [
        "Use the new information to refine your strategy",
        "Have the conversation most likely to advance the objective",
        "Choose the most workable route rather than pursuing every available option",
      ],

      cautionStyles: [
        "Avoid scattering your effort across competing objectives",
        "Don't change direction every time new information appears",
        "Make sure strategy is followed by practical execution",
      ],
    },

    4: {
      nakshatra: "Vishakha",
      pada: 4,
      navamsa: "Cancer",

      coreTheme: "Pursuing meaningful goals while protecting emotional and practical foundations",

      interpretiveThemes: [
        "Commitment",
        "Security",
        "Emotional investment",
        "Purpose",
      ],

      supportiveExpressions: [
        "Progress toward a goal that carries personal importance",
        "Greater commitment to something that supports longer-term security",
        "An opportunity to strengthen the foundation behind an important objective",
      ],

      cautionExpressions: [
        "Becoming emotionally attached to a particular result",
        "Taking setbacks more personally than necessary",
        "Pursuing a goal because of emotional expectations rather than present value",
      ],

      narrativeAngles: [
        "A personally important objective that may require renewed attention",
        "An opportunity to strengthen the foundation supporting a longer-term goal",
        "Progress toward something connected with security or personal priorities",
        "A situation where determination needs to remain balanced with emotional perspective",
      ],

      actionStyles: [
        "Give focused attention to the goal that genuinely supports your longer-term priorities",
        "Strengthen the practical foundation before pushing for the next result",
        "Separate the importance of the goal from attachment to one specific outcome",
      ],

      cautionStyles: [
        "Avoid treating a temporary setback as a personal failure",
        "Don't pursue an outcome solely because of emotional investment",
        "Keep determination balanced with changing practical circumstances",
      ],
    },
  },
    Anuradha: {
    1: {
      nakshatra: "Anuradha",
      pada: 1,
      navamsa: "Leo",

      coreTheme: "Strengthening connections through confident loyalty and purposeful support",

      interpretiveThemes: [
        "Loyalty",
        "Friendship",
        "Leadership",
        "Shared purpose",
      ],

      supportiveExpressions: [
        "An opportunity to strengthen an important connection",
        "Progress through the support of a trusted person",
        "Greater confidence in contributing to a shared objective",
      ],

      cautionExpressions: [
        "Expecting loyalty to be demonstrated on your terms",
        "Taking too much responsibility within a relationship",
        "Allowing pride to complicate cooperation",
      ],

      narrativeAngles: [
        "An important connection that may benefit from positive attention",
        "An opportunity to take a constructive role in a shared matter",
        "Progress through loyalty and dependable cooperation",
        "A relationship where clear and confident support may make a difference",
      ],

      actionStyles: [
        "Give clear support where the relationship genuinely matters",
        "Take a constructive role without taking over the entire responsibility",
        "Show reliability through practical action rather than expectation",
      ],

      cautionStyles: [
        "Avoid making loyalty a test of another person's commitment",
        "Don't let pride prevent an honest conversation",
        "Support the relationship without trying to control its direction",
      ],
    },

    2: {
      nakshatra: "Anuradha",
      pada: 2,
      navamsa: "Virgo",

      coreTheme: "Strengthening relationships through practical reliability and useful support",

      interpretiveThemes: [
        "Reliability",
        "Practical support",
        "Service",
        "Cooperation",
      ],

      supportiveExpressions: [
        "Progress through practical cooperation",
        "An opportunity to help resolve an issue within an important relationship",
        "Greater trust through consistent and useful support",
      ],

      cautionExpressions: [
        "Trying to fix every problem for another person",
        "Becoming critical when others handle responsibilities differently",
        "Turning support into an ongoing obligation",
      ],

      narrativeAngles: [
        "A relationship or shared matter that may benefit from practical attention",
        "An opportunity to strengthen trust through reliability",
        "Progress through helping organise an existing shared responsibility",
        "A connection that may improve through specific rather than general support",
      ],

      actionStyles: [
        "Offer practical help where it genuinely improves the situation",
        "Clarify the specific responsibility you can reasonably support",
        "Strengthen trust by following through on an existing commitment",
      ],

      cautionStyles: [
        "Avoid taking responsibility for solving another person's entire problem",
        "Don't let useful attention to detail become criticism",
        "Keep support within limits that remain sustainable",
      ],
    },

    3: {
      nakshatra: "Anuradha",
      pada: 3,
      navamsa: "Libra",

      coreTheme: "Building lasting cooperation through balance and mutual understanding",

      interpretiveThemes: [
        "Partnership",
        "Harmony",
        "Mutual support",
        "Diplomacy",
      ],

      supportiveExpressions: [
        "A constructive development in an important relationship",
        "Progress through cooperation and mutual understanding",
        "An opportunity to restore greater balance in a partnership",
      ],

      cautionExpressions: [
        "Compromising too much to maintain harmony",
        "Avoiding an important issue because disagreement feels uncomfortable",
        "Depending on another person's approval to feel secure in the relationship",
      ],

      narrativeAngles: [
        "An important relationship that may benefit from greater balance",
        "An opportunity to improve cooperation around a shared priority",
        "Progress through understanding what each person reasonably needs",
        "A partnership where clearer mutual expectations may strengthen trust",
      ],

      actionStyles: [
        "Discuss what would create a fairer and more workable arrangement",
        "Give equal attention to cooperation and appropriate boundaries",
        "Clarify expectations before assuming that both sides understand them",
      ],

      cautionStyles: [
        "Avoid agreeing simply to prevent disagreement",
        "Don't make harmony more important than resolving the actual issue",
        "Keep mutual support from becoming one-sided dependence",
      ],
    },

    4: {
      nakshatra: "Anuradha",
      pada: 4,
      navamsa: "Scorpio",

      coreTheme: "Deepening trust through loyalty, resilience and emotional honesty",

      interpretiveThemes: [
        "Trust",
        "Loyalty",
        "Depth",
        "Resilience",
      ],

      supportiveExpressions: [
        "An opportunity to deepen trust in an important connection",
        "Progress through addressing a difficult shared matter honestly",
        "Greater resilience within a relationship that has faced pressure",
      ],

      cautionExpressions: [
        "Holding on to a relationship primarily because of past loyalty",
        "Becoming suspicious when expectations are unclear",
        "Allowing emotional intensity to turn a manageable issue into conflict",
      ],

      narrativeAngles: [
        "An important connection that may require deeper honesty",
        "An opportunity to resolve something that has remained beneath the surface",
        "Progress through maintaining trust while addressing a difficult issue",
        "A relationship that may become stronger through handling pressure constructively",
      ],

      actionStyles: [
        "Address the underlying issue with honesty and a clear intention to resolve it",
        "Protect trust by discussing what has remained unclear",
        "Remain loyal to what is healthy in the relationship while allowing necessary change",
      ],

      cautionStyles: [
        "Avoid treating loyalty as a reason to preserve an unhealthy pattern",
        "Don't allow uncertainty to become suspicion without evidence",
        "Keep emotional intensity focused on resolution rather than blame",
      ],
    },
  },
    Jyeshtha: {
    1: {
      nakshatra: "Jyeshtha",
      pada: 1,
      navamsa: "Sagittarius",

      coreTheme: "Using experience and judgement to provide purposeful direction",

      interpretiveThemes: [
        "Experience",
        "Judgement",
        "Responsibility",
        "Direction",
      ],

      supportiveExpressions: [
        "An opportunity to use previous experience constructively",
        "Greater clarity about how to handle an important responsibility",
        "Progress through applying mature judgement to a developing situation",
      ],

      cautionExpressions: [
        "Assuming experience automatically makes your view correct",
        "Taking responsibility for decisions that belong to others",
        "Becoming overly certain about the right direction",
      ],

      narrativeAngles: [
        "A situation where previous experience may provide useful guidance",
        "An important responsibility that may require mature judgement",
        "Progress through seeing the wider implications of a decision",
        "An opportunity to provide direction where circumstances have become unclear",
      ],

      actionStyles: [
        "Use what experience has taught you without ignoring present circumstances",
        "Take responsibility for the decision that genuinely belongs to you",
        "Consider the wider consequences before choosing the next direction",
      ],

      cautionStyles: [
        "Avoid assuming that past experience answers every present question",
        "Don't take over a decision another person needs to make",
        "Remain open to information that challenges your initial judgement",
      ],
    },

    2: {
      nakshatra: "Jyeshtha",
      pada: 2,
      navamsa: "Capricorn",

      coreTheme: "Managing responsibility through discipline, boundaries and competence",

      interpretiveThemes: [
        "Responsibility",
        "Competence",
        "Discipline",
        "Boundaries",
      ],

      supportiveExpressions: [
        "Greater control over a demanding responsibility",
        "Progress through disciplined management of an important matter",
        "An opportunity to establish clearer authority or boundaries",
      ],

      cautionExpressions: [
        "Carrying more responsibility than is sustainable",
        "Believing everything depends on your personal involvement",
        "Becoming rigid under pressure",
      ],

      narrativeAngles: [
        "A demanding responsibility that may require clearer structure",
        "An opportunity to bring greater control to a complicated matter",
        "Progress through disciplined handling of existing obligations",
        "A situation where clearer boundaries may reduce unnecessary pressure",
      ],

      actionStyles: [
        "Prioritise the responsibility that genuinely requires your involvement",
        "Establish a clear boundary around what you can realistically manage",
        "Use structure and discipline to reduce unnecessary pressure",
      ],

      cautionStyles: [
        "Avoid assuming you must personally carry every responsibility",
        "Don't let pressure make your approach unnecessarily rigid",
        "Delegate or share responsibility where that is reasonably possible",
      ],
    },

    3: {
      nakshatra: "Jyeshtha",
      pada: 3,
      navamsa: "Aquarius",

      coreTheme: "Using experience objectively while improving established systems",

      interpretiveThemes: [
        "Objectivity",
        "Systems",
        "Independent judgement",
        "Improvement",
      ],

      supportiveExpressions: [
        "A clearer view of how an existing system can improve",
        "An opportunity to use experience in a new way",
        "Progress through separating established practice from what actually works",
      ],

      cautionExpressions: [
        "Becoming detached from the people affected by a decision",
        "Rejecting established methods simply because they seem outdated",
        "Assuming independence means avoiding consultation",
      ],

      narrativeAngles: [
        "An established approach that may benefit from objective review",
        "An opportunity to improve how an important responsibility is handled",
        "Progress through combining experience with a different perspective",
        "A situation where independent judgement may reveal a better method",
      ],

      actionStyles: [
        "Review whether the established approach still serves its purpose",
        "Use experience to improve the system rather than simply preserve it",
        "Consider a practical alternative while retaining what continues to work",
      ],

      cautionStyles: [
        "Avoid changing an established method without understanding why it existed",
        "Don't let objectivity become detachment from legitimate human considerations",
        "Seek useful input without surrendering your own judgement",
      ],
    },

    4: {
      nakshatra: "Jyeshtha",
      pada: 4,
      navamsa: "Pisces",

      coreTheme: "Balancing responsibility with compassion, release and perspective",

      interpretiveThemes: [
        "Responsibility",
        "Compassion",
        "Release",
        "Perspective",
      ],

      supportiveExpressions: [
        "An opportunity to reduce an unnecessary burden",
        "Greater understanding of where your responsibility begins and ends",
        "Progress through handling a difficult matter with both maturity and compassion",
      ],

      cautionExpressions: [
        "Carrying another person's burden out of guilt",
        "Remaining responsible for something after your role has ended",
        "Allowing sympathy to weaken necessary boundaries",
      ],

      narrativeAngles: [
        "A responsibility that may need to be viewed with greater perspective",
        "An opportunity to release an obligation that no longer genuinely belongs to you",
        "Progress through balancing compassion with practical limits",
        "A demanding matter that may become easier once responsibilities are clarified",
      ],

      actionStyles: [
        "Clarify what remains genuinely yours to manage",
        "Release the responsibility that can reasonably return to someone else",
        "Handle the situation compassionately without abandoning necessary boundaries",
      ],

      cautionStyles: [
        "Avoid carrying an obligation primarily from guilt",
        "Don't confuse compassion with unlimited responsibility",
        "Recognise when experience is asking you to step back rather than take over",
      ],
    },
  },
    Mula: {
    1: {
      nakshatra: "Mula",
      pada: 1,
      navamsa: "Aries",

      coreTheme: "Going directly to the root of a matter and acting on what is discovered",

      interpretiveThemes: [
        "Root causes",
        "Direct investigation",
        "Decisive change",
        "Fresh beginnings",
      ],

      supportiveExpressions: [
        "Greater clarity about the real cause of an issue",
        "An opportunity to address something at its source",
        "Progress through removing an obstacle that has been limiting movement",
      ],

      cautionExpressions: [
        "Making a drastic change before understanding the full situation",
        "Removing something useful along with what genuinely needs to change",
        "Reacting strongly to an uncomfortable discovery",
      ],

      narrativeAngles: [
        "A persistent issue that may become clearer when you examine its underlying cause",
        "An opportunity to deal directly with something that has been limiting progress",
        "Progress through addressing the source rather than repeatedly managing the symptoms",
        "A situation where simplifying or removing one obstacle may create a fresh opening",
      ],

      actionStyles: [
        "Identify the underlying issue before deciding what needs to change",
        "Address the root cause directly once the evidence is clear",
        "Remove the obstacle that is genuinely preventing forward movement",
      ],

      cautionStyles: [
        "Avoid making a drastic change before the underlying issue is understood",
        "Don't discard useful parts of the situation along with the problem",
        "Give an important discovery enough time to be understood before reacting",
      ],
    },

    2: {
      nakshatra: "Mula",
      pada: 2,
      navamsa: "Taurus",

      coreTheme: "Rebuilding stronger foundations after identifying what is essential",

      interpretiveThemes: [
        "Foundations",
        "Resources",
        "Simplification",
        "Rebuilding",
      ],

      supportiveExpressions: [
        "An opportunity to strengthen an important practical foundation",
        "Greater clarity about what is genuinely worth preserving",
        "Progress through simplifying resources, commitments or priorities",
      ],

      cautionExpressions: [
        "Holding on to something simply because it provides familiarity",
        "Removing stability before a replacement is ready",
        "Equating material security with genuine long-term value",
      ],

      narrativeAngles: [
        "A practical foundation that may benefit from careful reassessment",
        "An opportunity to distinguish what is essential from what has accumulated unnecessarily",
        "Progress through simplifying an existing arrangement",
        "A resource or commitment that may become stronger after unnecessary elements are removed",
      ],

      actionStyles: [
        "Identify what provides genuine lasting value before making changes",
        "Simplify the arrangement while preserving its strongest foundation",
        "Strengthen the resources that remain important after reassessment",
      ],

      cautionStyles: [
        "Avoid removing a source of stability without a workable alternative",
        "Don't preserve something solely because it feels familiar",
        "Make practical changes gradually where continuity still matters",
      ],
    },

    3: {
      nakshatra: "Mula",
      pada: 3,
      navamsa: "Gemini",

      coreTheme: "Discovering underlying causes through questions, research and new information",

      interpretiveThemes: [
        "Investigation",
        "Questions",
        "Research",
        "Understanding",
      ],

      supportiveExpressions: [
        "New information that explains a previously confusing situation",
        "An opportunity to investigate an issue more deeply",
        "Progress through asking the question that reaches the real problem",
      ],

      cautionExpressions: [
        "Continuing to investigate after enough information is available",
        "Becoming distracted by too many possible explanations",
        "Treating assumptions as established facts",
      ],

      narrativeAngles: [
        "New information that may reveal what has been driving an existing issue",
        "A question that could lead to a more useful understanding",
        "An opportunity to investigate something beneath its surface explanation",
        "Progress through connecting information that previously seemed unrelated",
      ],

      actionStyles: [
        "Ask the question most likely to reveal the underlying issue",
        "Verify the important information before drawing a conclusion",
        "Use what you discover to simplify the next decision",
      ],

      cautionStyles: [
        "Avoid searching for complexity when the explanation is already clear",
        "Don't treat an interesting possibility as confirmed information",
        "Know when enough investigation has been done to take practical action",
      ],
    },

    4: {
      nakshatra: "Mula",
      pada: 4,
      navamsa: "Cancer",

      coreTheme: "Understanding and transforming deep emotional or personal foundations",

      interpretiveThemes: [
        "Emotional roots",
        "Belonging",
        "Release",
        "Inner foundations",
      ],

      supportiveExpressions: [
        "Greater understanding of the deeper reason behind a personal concern",
        "An opportunity to release an old emotional pattern",
        "Progress through strengthening what provides genuine security and belonging",
      ],

      cautionExpressions: [
        "Revisiting the past without a clear purpose",
        "Allowing an old emotional pattern to define the present situation",
        "Removing a familiar support before understanding what it provides",
      ],

      narrativeAngles: [
        "A personal matter that may become clearer when its deeper origins are understood",
        "An opportunity to reconsider an old emotional pattern or expectation",
        "Progress through separating present needs from past reactions",
        "A situation where understanding what provides genuine security may guide the next step",
      ],

      actionStyles: [
        "Identify whether the present reaction belongs to the current situation or an older pattern",
        "Preserve the support that remains healthy while releasing what no longer serves you",
        "Strengthen the personal foundation that gives you genuine stability",
      ],

      cautionStyles: [
        "Avoid revisiting the past without connecting it to a useful present decision",
        "Don't let an old emotional response determine what the current situation means",
        "Make sure necessary change does not remove a healthy source of support",
      ],
    },
  },
    PurvaAshadha: {
    1: {
      nakshatra: "Purva Ashadha",
      pada: 1,
      navamsa: "Leo",

      coreTheme: "Moving forward with renewed confidence and conviction",

      interpretiveThemes: [
        "Confidence",
        "Conviction",
        "Renewal",
        "Self-belief",
      ],

      supportiveExpressions: [
        "Renewed confidence around an important objective",
        "An opportunity to present your position more clearly",
        "Progress through committing your energy to something you genuinely believe in",
      ],

      cautionExpressions: [
        "Becoming overly certain that your position is the only valid one",
        "Defending a decision mainly because you have already committed to it",
        "Allowing confidence to reduce your openness to useful feedback",
      ],

      narrativeAngles: [
        "A matter where renewed confidence may help you move forward",
        "An opportunity to stand behind a decision that has been carefully considered",
        "Progress through expressing your position with greater clarity",
        "A situation where stronger self-belief may help overcome hesitation",
      ],

      actionStyles: [
        "Move forward confidently where your position is supported by clear reasoning",
        "Express what you believe without needing everyone else to agree",
        "Direct renewed motivation toward the priority that matters most",
      ],

      cautionStyles: [
        "Avoid confusing confidence with certainty",
        "Don't defend a position simply because changing it feels uncomfortable",
        "Remain open to information that could improve your decision",
      ],
    },

    2: {
      nakshatra: "Purva Ashadha",
      pada: 2,
      navamsa: "Virgo",

      coreTheme: "Strengthening a position through practical refinement and preparation",

      interpretiveThemes: [
        "Preparation",
        "Refinement",
        "Practical improvement",
        "Competence",
      ],

      supportiveExpressions: [
        "An opportunity to strengthen a plan through better preparation",
        "Progress through improving an important practical detail",
        "Greater confidence after reviewing the facts more carefully",
      ],

      cautionExpressions: [
        "Overanalysing a decision that is already sufficiently clear",
        "Trying to perfect every detail before moving forward",
        "Using preparation as a reason to postpone action",
      ],

      narrativeAngles: [
        "A plan that may become stronger through one practical improvement",
        "An opportunity to support your position with better preparation",
        "Progress through correcting a detail that has been weakening execution",
        "A situation where practical evidence may strengthen your confidence",
      ],

      actionStyles: [
        "Improve the detail most likely to strengthen the overall plan",
        "Check the practical facts before committing further",
        "Use preparation to support action rather than delay it",
      ],

      cautionStyles: [
        "Avoid turning useful preparation into perfectionism",
        "Don't keep reviewing a decision after the important facts are already clear",
        "Focus on improvements that materially affect the outcome",
      ],
    },

    3: {
      nakshatra: "Purva Ashadha",
      pada: 3,
      navamsa: "Libra",

      coreTheme: "Advancing through persuasion, cooperation and balanced conviction",

      interpretiveThemes: [
        "Persuasion",
        "Cooperation",
        "Agreements",
        "Balanced advocacy",
      ],

      supportiveExpressions: [
        "A constructive conversation that strengthens an important position",
        "Progress through gaining cooperation around a shared objective",
        "An opportunity to reach a more balanced agreement",
      ],

      cautionExpressions: [
        "Trying too hard to persuade someone who remains unconvinced",
        "Compromising an important principle merely to secure agreement",
        "Depending on external approval before moving forward",
      ],

      narrativeAngles: [
        "A conversation that may help build support around an important objective",
        "An opportunity to present your position in a more balanced way",
        "Progress through finding common ground without losing the main purpose",
        "An agreement that may become stronger through clearer mutual understanding",
      ],

      actionStyles: [
        "Present your position clearly while making room for another perspective",
        "Identify the common interest that can move the discussion forward",
        "Seek cooperation without giving away what is genuinely important",
      ],

      cautionStyles: [
        "Avoid turning persuasion into pressure",
        "Don't compromise an important requirement solely to secure agreement",
        "Remember that another person's hesitation does not automatically invalidate your position",
      ],
    },

    4: {
      nakshatra: "Purva Ashadha",
      pada: 4,
      navamsa: "Scorpio",

      coreTheme: "Renewing determination through deeper conviction and focused transformation",

      interpretiveThemes: [
        "Determination",
        "Inner conviction",
        "Renewal",
        "Focused transformation",
      ],

      supportiveExpressions: [
        "Renewed determination around something deeply important",
        "An opportunity to strengthen your position after addressing an underlying weakness",
        "Progress through committing more fully to a meaningful change",
      ],

      cautionExpressions: [
        "Becoming emotionally attached to proving a point",
        "Treating disagreement as opposition",
        "Pushing for an outcome after circumstances suggest reassessment",
      ],

      narrativeAngles: [
        "A matter that may require deeper conviction rather than greater force",
        "An opportunity to renew your commitment after resolving an underlying concern",
        "Progress through strengthening what lies beneath an important objective",
        "A situation where determination may return once the real hesitation is understood",
      ],

      actionStyles: [
        "Identify what is genuinely driving your determination before acting",
        "Strengthen the underlying weakness rather than simply pushing harder",
        "Commit fully where both conviction and practical evidence support the direction",
      ],

      cautionStyles: [
        "Avoid making the outcome a test of your personal strength",
        "Don't interpret reasonable disagreement as opposition",
        "Remain willing to reassess the objective when circumstances materially change",
      ],
    },
  },
    UttaraAshadha: {
    1: {
      nakshatra: "Uttara Ashadha",
      pada: 1,
      navamsa: "Sagittarius",

      coreTheme: "Committing to a meaningful direction with integrity and long-term purpose",

      interpretiveThemes: [
        "Purpose",
        "Integrity",
        "Commitment",
        "Long-term direction",
      ],

      supportiveExpressions: [
        "Greater clarity about a longer-term objective",
        "An opportunity to commit more firmly to a meaningful direction",
        "Progress through aligning an important decision with your principles",
      ],

      cautionExpressions: [
        "Becoming too certain that your chosen direction is the only correct one",
        "Making a long-term commitment before practical details are clear",
        "Holding yourself or others to unrealistic ideals",
      ],

      narrativeAngles: [
        "A longer-term objective that may become clearer",
        "An opportunity to strengthen your commitment to a meaningful direction",
        "Progress through making a decision that remains consistent with your principles",
        "A responsibility that may make more sense when viewed through its larger purpose",
      ],

      actionStyles: [
        "Choose the direction that remains meaningful beyond the immediate result",
        "Align the next decision with both your principles and practical circumstances",
        "Strengthen the commitment that supports a worthwhile longer-term objective",
      ],

      cautionStyles: [
        "Avoid treating conviction as proof that every detail of the plan is correct",
        "Don't commit beyond what the practical situation can sustain",
        "Leave room for experience to refine your understanding of the larger goal",
      ],
    },

    2: {
      nakshatra: "Uttara Ashadha",
      pada: 2,
      navamsa: "Capricorn",

      coreTheme: "Building durable achievement through discipline and responsibility",

      interpretiveThemes: [
        "Achievement",
        "Discipline",
        "Responsibility",
        "Endurance",
      ],

      supportiveExpressions: [
        "Steady progress toward an important long-term result",
        "Greater control over a significant responsibility",
        "An opportunity to strengthen something intended to last",
      ],

      cautionExpressions: [
        "Carrying an obligation beyond what is reasonably sustainable",
        "Becoming overly rigid about how success must be achieved",
        "Focusing on responsibility while overlooking the wider purpose",
      ],

      narrativeAngles: [
        "A long-term responsibility that may benefit from disciplined attention",
        "An opportunity to consolidate progress already made",
        "Progress through consistent effort rather than immediate results",
        "A matter where stronger structure may improve long-term sustainability",
      ],

      actionStyles: [
        "Give disciplined attention to the responsibility with the greatest long-term value",
        "Strengthen the structure needed to sustain existing progress",
        "Focus on consistent execution rather than trying to accelerate the result",
      ],

      cautionStyles: [
        "Avoid taking on more responsibility simply because you can manage it",
        "Don't make the process unnecessarily rigid",
        "Review whether the commitment still serves the objective it was created for",
      ],
    },

    3: {
      nakshatra: "Uttara Ashadha",
      pada: 3,
      navamsa: "Aquarius",

      coreTheme: "Creating lasting progress through collective responsibility and better systems",

      interpretiveThemes: [
        "Collective progress",
        "Systems",
        "Shared responsibility",
        "Long-term improvement",
      ],

      supportiveExpressions: [
        "An opportunity to improve an established system or arrangement",
        "Progress through distributing responsibility more effectively",
        "Greater clarity about how individual effort contributes to a larger objective",
      ],

      cautionExpressions: [
        "Prioritising the system while overlooking individual circumstances",
        "Expecting everyone to contribute in exactly the same way",
        "Changing an established structure before understanding what still works",
      ],

      narrativeAngles: [
        "An established system that may benefit from thoughtful improvement",
        "An opportunity to create a more sustainable distribution of responsibility",
        "Progress through aligning individual contributions with a shared objective",
        "A long-term arrangement that may need to evolve as circumstances change",
      ],

      actionStyles: [
        "Improve the part of the system that most affects long-term effectiveness",
        "Clarify how responsibility can be shared more sustainably",
        "Preserve what works while updating what no longer serves the larger objective",
      ],

      cautionStyles: [
        "Avoid treating every individual situation as identical",
        "Don't replace an established structure before understanding its useful functions",
        "Keep collective objectives connected to practical human needs",
      ],
    },

    4: {
      nakshatra: "Uttara Ashadha",
      pada: 4,
      navamsa: "Pisces",

      coreTheme: "Sustaining meaningful commitments with compassion and perspective",

      interpretiveThemes: [
        "Commitment",
        "Compassion",
        "Perspective",
        "Completion",
      ],

      supportiveExpressions: [
        "Greater understanding of which commitments remain genuinely meaningful",
        "An opportunity to complete or consolidate an important responsibility",
        "Progress through balancing duty with compassion and perspective",
      ],

      cautionExpressions: [
        "Continuing an obligation primarily because it once felt important",
        "Taking responsibility for outcomes beyond your control",
        "Allowing compassion to make a long-term commitment unsustainable",
      ],

      narrativeAngles: [
        "A long-standing commitment that may benefit from greater perspective",
        "An opportunity to bring an important responsibility toward meaningful completion",
        "Progress through recognising what remains worth sustaining",
        "A situation where responsibility and compassion may need clearer boundaries",
      ],

      actionStyles: [
        "Give your energy to the commitment that still carries genuine long-term meaning",
        "Bring appropriate closure to a responsibility that has fulfilled its purpose",
        "Balance compassion with realistic limits on what you can sustain",
      ],

      cautionStyles: [
        "Avoid continuing an obligation solely because of its history",
        "Don't assume responsibility for every aspect of the final outcome",
        "Recognise when completing something is more appropriate than continuing it",
      ],
    },
  },
    Shravana: {
    1: {
      nakshatra: "Shravana",
      pada: 1,
      navamsa: "Aries",

      coreTheme: "Turning useful information into timely and purposeful action",

      interpretiveThemes: [
        "Listening",
        "Learning",
        "Initiative",
        "Applying information",
      ],

      supportiveExpressions: [
        "Important information that helps you take the next step",
        "An opportunity to act on something you have recently learned",
        "Greater clarity after listening more carefully to what is being communicated",
      ],

      cautionExpressions: [
        "Acting before hearing the complete information",
        "Responding immediately instead of first understanding what was meant",
        "Assuming instructions are clear without confirming the details",
      ],

      narrativeAngles: [
        "Information you receive may help clarify the next practical step",
        "A conversation or message that may require timely action",
        "Progress through listening carefully before responding",
        "Something you learn may be immediately useful in moving a matter forward",
      ],

      actionStyles: [
        "Understand the message fully before deciding how to act on it",
        "Use the information that is clear enough to support a practical next step",
        "Ask the necessary question before moving into execution",
      ],

      cautionStyles: [
        "Avoid reacting to the first part of a conversation before hearing the rest",
        "Don't turn incomplete information into an immediate conclusion",
        "Confirm important instructions before acting quickly",
      ],
    },

    2: {
      nakshatra: "Shravana",
      pada: 2,
      navamsa: "Taurus",

      coreTheme: "Building practical understanding through patient observation and reliable information",

      interpretiveThemes: [
        "Practical learning",
        "Observation",
        "Retention",
        "Reliable knowledge",
      ],

      supportiveExpressions: [
        "Useful information that strengthens a practical decision",
        "Progress through patiently learning how something works",
        "Greater confidence after confirming important facts",
      ],

      cautionExpressions: [
        "Holding on to an old understanding after new information becomes available",
        "Listening only to information that supports an existing preference",
        "Delaying a decision while waiting for complete certainty",
      ],

      narrativeAngles: [
        "Information may help strengthen an important practical decision",
        "An opportunity to learn something that has lasting usefulness",
        "Progress through observing carefully before changing an established approach",
        "A practical matter that may become clearer once the important facts are confirmed",
      ],

      actionStyles: [
        "Confirm the information that materially affects the decision",
        "Give yourself enough time to understand the practical implications",
        "Retain what remains useful while updating your understanding where needed",
      ],

      cautionStyles: [
        "Avoid filtering new information through an existing preference",
        "Don't wait for absolute certainty when the important facts are already clear",
        "Remain willing to update an established understanding",
      ],
    },

    3: {
      nakshatra: "Shravana",
      pada: 3,
      navamsa: "Gemini",

      coreTheme: "Advancing through communication, exchange of knowledge and careful listening",

      interpretiveThemes: [
        "Communication",
        "Information exchange",
        "Learning",
        "Clarification",
      ],

      supportiveExpressions: [
        "A useful conversation that provides important clarity",
        "New information that changes how you understand a situation",
        "Progress through asking, listening and exchanging ideas",
      ],

      cautionExpressions: [
        "Receiving too much information without identifying what matters",
        "Speaking before fully understanding another person's point",
        "Passing information forward before confirming its accuracy",
      ],

      narrativeAngles: [
        "A conversation may reveal information that changes your understanding",
        "An opportunity to ask the question that has remained unanswered",
        "Progress through a clearer exchange of information",
        "Something you hear or learn may connect previously separate pieces of information",
      ],

      actionStyles: [
        "Ask the specific question needed to remove uncertainty",
        "Listen for the information that materially changes the situation",
        "Confirm what you understood before communicating it further",
      ],

      cautionStyles: [
        "Avoid collecting information without deciding which part is relevant",
        "Don't prepare your response while the other person is still explaining",
        "Verify important information before repeating or relying on it",
      ],
    },

    4: {
      nakshatra: "Shravana",
      pada: 4,
      navamsa: "Cancer",

      coreTheme: "Listening deeply to understand personal needs, concerns and unspoken context",

      interpretiveThemes: [
        "Empathetic listening",
        "Understanding",
        "Personal communication",
        "Emotional awareness",
      ],

      supportiveExpressions: [
        "A conversation that improves understanding in an important relationship",
        "Greater awareness of what someone genuinely needs",
        "Progress through listening beyond the immediate words being spoken",
      ],

      cautionExpressions: [
        "Taking another person's words more personally than intended",
        "Absorbing someone else's concerns as your own responsibility",
        "Assuming you understand what someone feels without asking",
      ],

      narrativeAngles: [
        "An important conversation may require more listening than immediate response",
        "Something expressed indirectly may help you understand a personal situation better",
        "Progress through giving another person enough space to explain their perspective",
        "A personal matter may become clearer when both the words and context are considered",
      ],

      actionStyles: [
        "Listen fully before deciding what the conversation requires from you",
        "Ask for clarification rather than assuming what another person needs",
        "Acknowledge the concern while keeping responsibilities appropriately defined",
      ],

      cautionStyles: [
        "Avoid treating another person's concern as automatically yours to solve",
        "Don't assume emotional meaning that has not actually been communicated",
        "Keep empathy from turning into unnecessary personal responsibility",
      ],
    },
  },
    Dhanishta: {
    1: {
      nakshatra: "Dhanishta",
      pada: 1,
      navamsa: "Leo",

      coreTheme: "Using confidence, capability and resources to create visible progress",

      interpretiveThemes: [
        "Achievement",
        "Resources",
        "Visibility",
        "Leadership",
      ],

      supportiveExpressions: [
        "An opportunity to make productive use of an available resource",
        "Greater visibility around something you are capable of contributing",
        "Progress through taking confident ownership of an important objective",
      ],

      cautionExpressions: [
        "Measuring progress mainly through recognition or status",
        "Using more resources than the objective genuinely requires",
        "Taking control of a shared matter without sufficient coordination",
      ],

      narrativeAngles: [
        "An opportunity to put an existing capability or resource to better use",
        "A situation where your contribution may become more visible",
        "Progress through taking confident responsibility for an important objective",
        "A matter where better use of what is already available may produce results",
      ],

      actionStyles: [
        "Use the resource or capability that can make the greatest practical difference",
        "Take clear ownership of the contribution that genuinely belongs to you",
        "Direct your effort toward a result with lasting value rather than recognition alone",
      ],

      cautionStyles: [
        "Avoid making visibility the main measure of progress",
        "Don't use additional resources where better coordination would be enough",
        "Keep leadership connected to the needs of the wider objective",
      ],
    },

    2: {
      nakshatra: "Dhanishta",
      pada: 2,
      navamsa: "Virgo",

      coreTheme: "Improving results through precise timing, organisation and efficient use of resources",

      interpretiveThemes: [
        "Efficiency",
        "Timing",
        "Organisation",
        "Practical resources",
      ],

      supportiveExpressions: [
        "An opportunity to use time or resources more efficiently",
        "Progress through better organisation of an existing responsibility",
        "Greater results from improving one practical part of the process",
      ],

      cautionExpressions: [
        "Focusing on efficiency while losing sight of the larger objective",
        "Trying to optimise every detail before proceeding",
        "Becoming overly critical of how others contribute",
      ],

      narrativeAngles: [
        "A practical process that may benefit from better organisation",
        "An opportunity to improve how time or resources are being used",
        "Progress through correcting an inefficiency in an existing arrangement",
        "A matter where better timing may be more useful than greater effort",
      ],

      actionStyles: [
        "Improve the part of the process that is consuming unnecessary time or resources",
        "Organise the next step before adding more effort",
        "Use timing and preparation to make existing resources work more effectively",
      ],

      cautionStyles: [
        "Avoid trying to optimise details that have little effect on the result",
        "Don't confuse greater activity with greater productivity",
        "Keep efficiency connected to the actual objective",
      ],
    },

    3: {
      nakshatra: "Dhanishta",
      pada: 3,
      navamsa: "Libra",

      coreTheme: "Creating progress through coordination, shared resources and balanced participation",

      interpretiveThemes: [
        "Coordination",
        "Collaboration",
        "Shared resources",
        "Reciprocity",
      ],

      supportiveExpressions: [
        "Progress through effective coordination with others",
        "An opportunity to combine resources or capabilities",
        "Greater momentum around a shared objective",
      ],

      cautionExpressions: [
        "Depending too heavily on others to maintain momentum",
        "Agreeing to an unequal distribution of effort or resources",
        "Prioritising harmony over clarifying practical responsibilities",
      ],

      narrativeAngles: [
        "A shared objective that may benefit from better coordination",
        "An opportunity to combine complementary resources or abilities",
        "Progress through bringing different contributions into better alignment",
        "A partnership or group matter where clearer roles may improve momentum",
      ],

      actionStyles: [
        "Clarify how each person can contribute most effectively",
        "Coordinate available resources around the shared objective",
        "Create a fair balance between contribution, responsibility and benefit",
      ],

      cautionStyles: [
        "Avoid assuming cooperation means responsibilities are automatically balanced",
        "Don't preserve harmony by leaving practical expectations unclear",
        "Make sure shared momentum does not depend excessively on one person",
      ],
    },

    4: {
      nakshatra: "Dhanishta",
      pada: 4,
      navamsa: "Scorpio",

      coreTheme: "Concentrating resources and effort where they can create meaningful transformation",

      interpretiveThemes: [
        "Focused resources",
        "Transformation",
        "Strategic timing",
        "Concentrated effort",
      ],

      supportiveExpressions: [
        "An opportunity to redirect resources toward a more important priority",
        "Progress through concentrating effort rather than spreading it widely",
        "Greater understanding of where time, money or energy can have the strongest effect",
      ],

      cautionExpressions: [
        "Becoming overly controlling about shared resources",
        "Committing too much to one outcome because of previous investment",
        "Using intensity where strategic timing would work better",
      ],

      narrativeAngles: [
        "A priority that may benefit from concentrating resources more deliberately",
        "An opportunity to redirect effort away from something producing limited value",
        "Progress through choosing where your resources can have the greatest impact",
        "A situation where timing and concentrated effort may matter more than quantity",
      ],

      actionStyles: [
        "Direct your strongest resources toward the priority with the greatest meaningful value",
        "Reduce effort where the return no longer justifies the investment",
        "Choose the right moment to concentrate effort rather than pushing continuously",
      ],

      cautionStyles: [
        "Avoid continuing an investment solely because significant resources have already been committed",
        "Don't turn control of resources into control of other people",
        "Keep intensity proportionate to the importance of the objective",
      ],
    },
  },
    Shatabhisha: {
    1: {
      nakshatra: "Shatabhisha",
      pada: 1,
      navamsa: "Sagittarius",

      coreTheme: "Seeking a clearer truth by looking beyond the immediate explanation",

      interpretiveThemes: [
        "Investigation",
        "Truth",
        "Understanding",
        "Wider perspective",
      ],

      supportiveExpressions: [
        "Greater clarity about what is actually influencing a situation",
        "An opportunity to investigate something more objectively",
        "Progress through questioning an assumption that may no longer be accurate",
      ],

      cautionExpressions: [
        "Searching for a hidden explanation when the obvious one is sufficient",
        "Becoming overly certain about an unverified conclusion",
        "Questioning established information without enough evidence",
      ],

      narrativeAngles: [
        "A situation that may become clearer when examined beyond its first explanation",
        "An opportunity to investigate what has remained uncertain",
        "Progress through distinguishing verified information from assumption",
        "A wider perspective that may change how you understand an existing issue",
      ],

      actionStyles: [
        "Verify the assumption that most affects your understanding of the situation",
        "Look beyond the immediate explanation where genuine uncertainty remains",
        "Use what you discover to create a clearer practical direction",
      ],

      cautionStyles: [
        "Avoid assuming every unanswered question has a hidden explanation",
        "Don't replace one assumption with another unsupported conclusion",
        "Know when the available evidence is sufficient to move forward",
      ],
    },

    2: {
      nakshatra: "Shatabhisha",
      pada: 2,
      navamsa: "Capricorn",

      coreTheme: "Correcting underlying weaknesses through disciplined analysis and practical boundaries",

      interpretiveThemes: [
        "Correction",
        "Discipline",
        "Boundaries",
        "Systematic improvement",
      ],

      supportiveExpressions: [
        "An opportunity to correct an issue that has been affecting performance",
        "Progress through establishing clearer limits or procedures",
        "Greater stability after identifying a structural weakness",
      ],

      cautionExpressions: [
        "Becoming too rigid while trying to correct a problem",
        "Treating every irregularity as evidence of a larger issue",
        "Creating excessive restrictions in response to one weakness",
      ],

      narrativeAngles: [
        "An underlying weakness that may benefit from systematic correction",
        "An opportunity to improve a process through clearer boundaries",
        "Progress through addressing a recurring issue at the structural level",
        "A situation where disciplined review may prevent the same problem from repeating",
      ],

      actionStyles: [
        "Correct the structural weakness most responsible for the recurring issue",
        "Put a practical boundary or process around what needs better control",
        "Make the smallest structural change capable of preventing repetition",
      ],

      cautionStyles: [
        "Avoid creating unnecessary restrictions around a manageable issue",
        "Don't assume one problem means the entire system is failing",
        "Keep corrective action proportionate to the weakness identified",
      ],
    },

    3: {
      nakshatra: "Shatabhisha",
      pada: 3,
      navamsa: "Aquarius",

      coreTheme: "Finding better solutions through independent and objective analysis",

      interpretiveThemes: [
        "Independent thinking",
        "Objectivity",
        "Innovation",
        "Problem-solving",
      ],

      supportiveExpressions: [
        "A different approach that may resolve a persistent issue",
        "Greater clarity through stepping outside established assumptions",
        "Progress through independent analysis of an existing problem",
      ],

      cautionExpressions: [
        "Rejecting conventional solutions simply because they are conventional",
        "Becoming isolated while trying to solve everything independently",
        "Focusing on analysis while delaying practical implementation",
      ],

      narrativeAngles: [
        "A persistent issue that may benefit from a different approach",
        "An opportunity to review a situation without inherited assumptions",
        "Progress through considering an alternative that was previously overlooked",
        "A problem that may become easier once you separate evidence from established expectations",
      ],

      actionStyles: [
        "Evaluate the problem independently before accepting the usual explanation",
        "Test the alternative that has a clear practical basis",
        "Turn objective analysis into one measurable practical change",
      ],

      cautionStyles: [
        "Avoid rejecting a proven method solely because it is established",
        "Don't let independent thinking become unnecessary isolation",
        "Move from analysis to execution once the important evidence is clear",
      ],
    },

    4: {
      nakshatra: "Shatabhisha",
      pada: 4,
      navamsa: "Pisces",

      coreTheme: "Creating recovery by recognising what needs release, rest or compassionate adjustment",

      interpretiveThemes: [
        "Recovery",
        "Release",
        "Reflection",
        "Compassionate adjustment",
      ],

      supportiveExpressions: [
        "An opportunity to step away from something that has been draining unnecessary energy",
        "Greater understanding of what may help restore balance",
        "Progress through allowing space for recovery and reassessment",
      ],

      cautionExpressions: [
        "Withdrawing from a situation instead of addressing what can be resolved",
        "Leaving practical boundaries unclear in the name of understanding",
        "Waiting passively for circumstances to correct themselves",
      ],

      narrativeAngles: [
        "A demanding situation that may benefit from space and reassessment",
        "An opportunity to release an unnecessary source of pressure",
        "Progress through recognising what needs correction and what simply needs time",
        "A matter that may become clearer after reducing unnecessary mental or emotional noise",
      ],

      actionStyles: [
        "Create enough space to assess what genuinely needs your attention",
        "Release the pressure that is no longer serving a practical purpose",
        "Combine reflection with one clear step toward improving the situation",
      ],

      cautionStyles: [
        "Avoid using distance as a substitute for resolving an important issue",
        "Don't leave necessary boundaries undefined",
        "Make sure reflection eventually leads back to practical action",
      ],
    },
  },
    PurvaBhadrapada: {
    1: {
      nakshatra: "Purva Bhadrapada",
      pada: 1,
      navamsa: "Aries",

      coreTheme: "Turning strong conviction into focused and purposeful action",

      interpretiveThemes: [
        "Conviction",
        "Initiative",
        "Purpose",
        "Focused action",
      ],

      supportiveExpressions: [
        "Greater determination around something you consider genuinely important",
        "An opportunity to act on a priority that has become clearer",
        "Progress through directing strong motivation toward one meaningful objective",
      ],

      cautionExpressions: [
        "Acting too quickly because you feel strongly about the issue",
        "Treating disagreement as a challenge to your principles",
        "Committing fully before considering the practical consequences",
      ],

      narrativeAngles: [
        "A matter you feel strongly about may require purposeful action",
        "An opportunity to translate conviction into a practical next step",
        "Progress through concentrating your effort on what genuinely matters",
        "A situation where clear purpose may help overcome hesitation",
      ],

      actionStyles: [
        "Direct strong motivation toward one clearly defined objective",
        "Take the practical step that best reflects what genuinely matters to you",
        "Use conviction to support action while remaining open to relevant facts",
      ],

      cautionStyles: [
        "Avoid acting solely because the issue feels urgent or important",
        "Don't interpret another perspective as opposition to your principles",
        "Check the practical consequences before making a strong commitment",
      ],
    },

    2: {
      nakshatra: "Purva Bhadrapada",
      pada: 2,
      navamsa: "Taurus",

      coreTheme: "Giving practical form and stability to meaningful priorities",

      interpretiveThemes: [
        "Values",
        "Stability",
        "Resources",
        "Sustained commitment",
      ],

      supportiveExpressions: [
        "An opportunity to invest more steadily in something meaningful",
        "Greater clarity about which priorities deserve lasting resources",
        "Progress through turning an important principle into a practical commitment",
      ],

      cautionExpressions: [
        "Holding on to a commitment because of previous investment",
        "Becoming inflexible about something you strongly value",
        "Using material commitment as the only measure of seriousness",
      ],

      narrativeAngles: [
        "A meaningful priority that may need a stronger practical foundation",
        "An opportunity to align your resources more closely with what you genuinely value",
        "Progress through giving consistent support to an important objective",
        "A commitment that may become more sustainable through practical consolidation",
      ],

      actionStyles: [
        "Direct time or resources toward the priority with lasting value",
        "Build a practical foundation beneath something you genuinely believe in",
        "Review whether your existing commitments still reflect your present values",
      ],

      cautionStyles: [
        "Avoid continuing an investment solely because you have already committed resources",
        "Don't let strong values become resistance to necessary adjustment",
        "Keep material commitment proportionate to the practical value of the objective",
      ],
    },

    3: {
      nakshatra: "Purva Bhadrapada",
      pada: 3,
      navamsa: "Gemini",

      coreTheme: "Clarifying deeper priorities through questioning, discussion and changing perspectives",

      interpretiveThemes: [
        "Inquiry",
        "Perspective",
        "Communication",
        "Reassessment",
      ],

      supportiveExpressions: [
        "A conversation that changes how you understand an important issue",
        "Greater clarity through questioning an established assumption",
        "Progress through expressing a complex idea more clearly",
      ],

      cautionExpressions: [
        "Turning every discussion into a debate about principles",
        "Exploring so many perspectives that practical direction becomes unclear",
        "Using intellectual arguments to defend an emotional position",
      ],

      narrativeAngles: [
        "A conversation may help clarify why an issue matters so much",
        "An opportunity to reconsider an assumption behind an important position",
        "Progress through explaining a complex concern more clearly",
        "New information may cause you to refine rather than abandon an existing belief",
      ],

      actionStyles: [
        "Ask what evidence would genuinely change your understanding of the issue",
        "Explain the important point clearly without turning the discussion into a contest",
        "Use new information to refine your position where appropriate",
      ],

      cautionStyles: [
        "Avoid debating simply to defend a position you already hold",
        "Don't allow multiple perspectives to prevent a practical decision",
        "Separate factual reasoning from emotional attachment to the argument",
      ],
    },

    4: {
      nakshatra: "Purva Bhadrapada",
      pada: 4,
      navamsa: "Cancer",

      coreTheme: "Reassessing deep personal commitments and what genuinely deserves emotional investment",

      interpretiveThemes: [
        "Emotional commitment",
        "Inner priorities",
        "Meaning",
        "Reassessment",
      ],

      supportiveExpressions: [
        "Greater clarity about what genuinely deserves your emotional energy",
        "An opportunity to strengthen a personally meaningful commitment",
        "Progress through releasing an expectation that no longer reflects your priorities",
      ],

      cautionExpressions: [
        "Becoming emotionally consumed by an issue you consider important",
        "Carrying an old commitment after its purpose has changed",
        "Taking another person's response as a judgement of your values",
      ],

      narrativeAngles: [
        "A personally meaningful matter may require deeper reassessment",
        "An opportunity to decide what genuinely deserves continued emotional investment",
        "Progress through separating present priorities from older expectations",
        "A commitment may become clearer once you understand why it matters to you",
      ],

      actionStyles: [
        "Give your emotional energy to the commitment that remains genuinely meaningful",
        "Clarify whether an older expectation still reflects what you need now",
        "Strengthen the personal foundation behind the priority you choose to continue",
      ],

      cautionStyles: [
        "Avoid allowing one issue to consume more emotional energy than it warrants",
        "Don't preserve a commitment solely because it once carried great meaning",
        "Keep another person's reaction separate from your assessment of your own values",
      ],
    },
  },
    UttaraBhadrapada: {
    1: {
      nakshatra: "Uttara Bhadrapada",
      pada: 1,
      navamsa: "Leo",

      coreTheme: "Bringing quiet confidence and mature leadership to an important responsibility",

      interpretiveThemes: [
        "Maturity",
        "Leadership",
        "Inner confidence",
        "Responsibility",
      ],

      supportiveExpressions: [
        "Greater confidence in handling an important responsibility",
        "An opportunity to provide steady direction in a complicated situation",
        "Progress through calm and mature leadership",
      ],

      cautionExpressions: [
        "Feeling responsible for maintaining control of the entire situation",
        "Expecting recognition for responsibilities carried quietly",
        "Allowing pride to make delegation more difficult",
      ],

      narrativeAngles: [
        "A situation that may benefit from calm and confident direction",
        "An important responsibility that you may now be better prepared to handle",
        "Progress through providing stability rather than forcing movement",
        "An opportunity to use experience without needing to dominate the outcome",
      ],

      actionStyles: [
        "Provide clear direction where your responsibility genuinely requires it",
        "Use confidence to create stability rather than control",
        "Take ownership of your role while allowing others to carry theirs",
      ],

      cautionStyles: [
        "Avoid assuming leadership means carrying every responsibility personally",
        "Don't make recognition necessary for the contribution to feel worthwhile",
        "Allow others enough space to contribute in their own way",
      ],
    },

    2: {
      nakshatra: "Uttara Bhadrapada",
      pada: 2,
      navamsa: "Virgo",

      coreTheme: "Resolving deeper issues through patient analysis and practical improvement",

      interpretiveThemes: [
        "Resolution",
        "Analysis",
        "Patience",
        "Practical improvement",
      ],

      supportiveExpressions: [
        "Greater clarity about how to resolve a persistent issue",
        "Progress through patient attention to an underlying detail",
        "An opportunity to improve something that has required sustained effort",
      ],

      cautionExpressions: [
        "Continuing to analyse after the essential issue is understood",
        "Becoming overly focused on correcting minor imperfections",
        "Expecting a complex matter to resolve through one perfect solution",
      ],

      narrativeAngles: [
        "A persistent matter that may finally become easier to resolve",
        "An opportunity to improve something through careful and patient attention",
        "Progress through addressing the practical detail beneath a larger concern",
        "A situation where steady correction may work better than dramatic change",
      ],

      actionStyles: [
        "Address the practical issue most responsible for keeping the matter unresolved",
        "Make the correction that creates sustainable improvement",
        "Use patient analysis to simplify rather than complicate the next step",
      ],

      cautionStyles: [
        "Avoid continuing analysis after enough is known to act",
        "Don't allow minor imperfections to obscure meaningful progress",
        "Accept a workable resolution rather than waiting for a perfect one",
      ],
    },

    3: {
      nakshatra: "Uttara Bhadrapada",
      pada: 3,
      navamsa: "Libra",

      coreTheme: "Creating lasting resolution through balance, understanding and mature cooperation",

      interpretiveThemes: [
        "Balance",
        "Resolution",
        "Cooperation",
        "Mutual understanding",
      ],

      supportiveExpressions: [
        "An opportunity to bring greater balance to a long-standing arrangement",
        "Progress through a mature conversation or compromise",
        "Greater stability in an important relationship or shared responsibility",
      ],

      cautionExpressions: [
        "Maintaining peace without resolving the underlying issue",
        "Compromising beyond what remains fair or sustainable",
        "Waiting for another person to create the balance you need",
      ],

      narrativeAngles: [
        "A long-standing arrangement that may be ready for greater balance",
        "An opportunity to resolve an issue through mature cooperation",
        "Progress through clarifying what each side can realistically sustain",
        "A relationship or shared responsibility that may benefit from calmer reassessment",
      ],

      actionStyles: [
        "Discuss what would make the arrangement sustainable for everyone involved",
        "Look for resolution rather than simply temporary agreement",
        "Clarify where compromise is useful and where a boundary remains necessary",
      ],

      cautionStyles: [
        "Avoid preserving harmony while leaving the real issue unresolved",
        "Don't compromise beyond what remains sustainable",
        "Take responsibility for the balance you can create rather than waiting for someone else",
      ],
    },

    4: {
      nakshatra: "Uttara Bhadrapada",
      pada: 4,
      navamsa: "Scorpio",

      coreTheme: "Bringing deep and persistent matters toward meaningful transformation and closure",

      interpretiveThemes: [
        "Depth",
        "Transformation",
        "Closure",
        "Emotional resilience",
      ],

      supportiveExpressions: [
        "An opportunity to resolve something that has remained beneath the surface",
        "Greater clarity about what needs to change at a deeper level",
        "Progress toward meaningful closure or transformation",
      ],

      cautionExpressions: [
        "Reopening an issue that has already been sufficiently resolved",
        "Holding on to a difficult situation because of emotional investment",
        "Believing meaningful change must always be dramatic",
      ],

      narrativeAngles: [
        "A deeper issue may now be ready for meaningful resolution",
        "An opportunity to address something that has remained unresolved for some time",
        "Progress through accepting what needs to change rather than continuing to resist it",
        "A long-standing matter may become easier once its deeper purpose or limitation is understood",
      ],

      actionStyles: [
        "Address the unresolved issue directly but without unnecessary intensity",
        "Allow a meaningful change to reach completion rather than repeatedly revisiting it",
        "Preserve what remains valuable while releasing what has completed its purpose",
      ],

      cautionStyles: [
        "Avoid reopening an issue solely because its resolution feels unfamiliar",
        "Don't confuse emotional intensity with the importance of the decision",
        "Allow gradual transformation where dramatic change is unnecessary",
      ],
    },
  },
    Revati: {
    1: {
      nakshatra: "Revati",
      pada: 1,
      navamsa: "Sagittarius",

      coreTheme: "Completing one phase with perspective and preparing for meaningful growth",

      interpretiveThemes: [
        "Completion",
        "Guidance",
        "Perspective",
        "Transition",
      ],

      supportiveExpressions: [
        "Greater clarity about what should come after an existing phase",
        "An opportunity to complete something with a clearer sense of direction",
        "Progress through recognising what the experience has taught you",
      ],

      cautionExpressions: [
        "Moving toward the next opportunity before properly completing the current one",
        "Assuming the next direction is clear without checking practical details",
        "Keeping possibilities open after a decision is already needed",
      ],

      narrativeAngles: [
        "A matter may be approaching completion and revealing the next direction",
        "An experience may provide useful guidance for what comes next",
        "Progress through completing an existing responsibility before expanding further",
        "A transition may become easier once the larger purpose is understood",
      ],

      actionStyles: [
        "Complete the current responsibility before committing to the next expansion",
        "Use what you have learned to guide the next practical decision",
        "Clarify the direction ahead while properly closing what is ending",
      ],

      cautionStyles: [
        "Avoid rushing toward the next opportunity before the current matter is complete",
        "Don't mistake optimism about the future for a practical plan",
        "Make sure the transition has a clear next step rather than only a broad direction",
      ],
    },

    2: {
      nakshatra: "Revati",
      pada: 2,
      navamsa: "Capricorn",

      coreTheme: "Completing responsibilities carefully and preparing a stable transition",

      interpretiveThemes: [
        "Completion",
        "Responsibility",
        "Preparation",
        "Practical transition",
      ],

      supportiveExpressions: [
        "An opportunity to bring an important responsibility toward completion",
        "Progress through organising the final practical details",
        "Greater stability during a transition because preparation has been handled carefully",
      ],

      cautionExpressions: [
        "Continuing a responsibility after it has effectively been completed",
        "Becoming overly focused on closure details",
        "Delaying the next phase because everything does not feel perfectly settled",
      ],

      narrativeAngles: [
        "An existing responsibility may be ready for practical completion",
        "A transition that may benefit from careful preparation",
        "Progress through resolving the remaining details before moving forward",
        "A matter where orderly closure may create greater stability for what follows",
      ],

      actionStyles: [
        "Complete the remaining practical requirement that allows the matter to close properly",
        "Prepare the structure needed for a smooth transition",
        "Confirm what still genuinely needs attention before moving on",
      ],

      cautionStyles: [
        "Avoid continuing work simply because completion feels unfamiliar",
        "Don't allow minor unfinished details to delay necessary movement",
        "Distinguish what must be completed from what can reasonably be left behind",
      ],
    },

    3: {
      nakshatra: "Revati",
      pada: 3,
      navamsa: "Aquarius",

      coreTheme: "Moving into the next phase through openness, independence and a broader perspective",

      interpretiveThemes: [
        "Transition",
        "Independence",
        "New direction",
        "Broader perspective",
      ],

      supportiveExpressions: [
        "An opportunity to move beyond an outdated arrangement",
        "Greater clarity about a more independent direction",
        "Progress through allowing an existing cycle to evolve into something different",
      ],

      cautionExpressions: [
        "Leaving an arrangement simply because something new feels more interesting",
        "Disconnecting from useful support during a transition",
        "Changing direction before understanding what the next phase requires",
      ],

      narrativeAngles: [
        "A transition may create room for a more independent approach",
        "An existing arrangement may be ready to evolve",
        "Progress through recognising that the next phase may require a different structure",
        "A completed experience may open a direction you had not previously considered",
      ],

      actionStyles: [
        "Allow the next phase to take a different form where circumstances support it",
        "Identify which part of the old arrangement no longer needs to continue",
        "Create enough flexibility for a new direction without abandoning useful support",
      ],

      cautionStyles: [
        "Avoid changing direction solely because novelty feels attractive",
        "Don't disconnect from resources that remain useful during the transition",
        "Understand the practical requirements of the next phase before leaving the current structure",
      ],
    },

    4: {
      nakshatra: "Revati",
      pada: 4,
      navamsa: "Pisces",

      coreTheme: "Completing a cycle with acceptance, release and readiness for renewal",

      interpretiveThemes: [
        "Completion",
        "Release",
        "Acceptance",
        "Renewal",
      ],

      supportiveExpressions: [
        "A sense that an important matter is reaching natural completion",
        "An opportunity to release something that has fulfilled its purpose",
        "Greater ease after accepting what no longer needs to be carried forward",
      ],

      cautionExpressions: [
        "Holding on because ending something feels uncertain",
        "Drifting after completion without deciding what comes next",
        "Using acceptance as a reason to avoid a practical final step",
      ],

      narrativeAngles: [
        "A matter may be ready to reach its natural conclusion",
        "An opportunity to release an obligation, expectation or pattern that has completed its purpose",
        "Progress through accepting what is ending while remaining open to what follows",
        "A transition may become easier once you stop carrying something that no longer belongs to the next phase",
      ],

      actionStyles: [
        "Complete what remains necessary and allow the matter to close",
        "Release the obligation or expectation that no longer serves the next phase",
        "Create space for what comes next without forcing an immediate replacement",
      ],

      cautionStyles: [
        "Avoid preserving something solely because its ending feels unfamiliar",
        "Don't confuse acceptance with passivity when a final practical action is required",
        "Give the next direction enough structure once the transition becomes clear",
      ],
    },
  },
};

export function getPadaInterpretation(
  nakshatra: string,
  pada: number
): PadaInterpretation | null {
  if (!Number.isInteger(pada) || pada < 1 || pada > 4) {
    return null;
  }

  const normalizedName = nakshatra.trim().toLowerCase();

  const entry = Object.entries(
    NAKSHATRA_PADA_INTERPRETATIONS
  ).find(([name]) => name.toLowerCase() === normalizedName);

  if (!entry) return null;

  return entry[1][pada as PadaNumber] ?? null;
}