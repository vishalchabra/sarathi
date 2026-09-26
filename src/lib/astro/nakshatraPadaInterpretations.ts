
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