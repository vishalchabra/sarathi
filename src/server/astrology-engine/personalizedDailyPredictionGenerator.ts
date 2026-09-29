import type {
  DailySkyInput,
} from "./core/reasoningEngine";

import type {
  PlanetName,
  ZodiacSign,
} from "./types";
import {
  enrichSkyInputWithPlanetContacts,
} from "./core/aspectResolver";

import {
  judgeAllAscendants,
} from "./judgement/ascendantJudgementEngine";

import {
  resolveDashaActivation,
} from "./knowledge/dashaActivation";

import {
  synthesizeDashaTransit,
} from "./judgement/dashaTransitSynthesis";

import {
  buildEventActivations,
} from "./judgement/eventActivationEngine";

import {
  buildDailyPriorities,
} from "./judgement/dailyPriorityEngine";

import {
  buildDailyPrediction,
} from "./judgement/dailyPredictionEngine";
import {
  logDailyCalibration,
} from "./debug/dailyCalibration";
import { getPadaInterpretation } from
  "../../lib/astro/nakshatraPadaInterpretations";

import {
  selectDailyNarrativeVariant,
} from "./narrative/dailyNarrativeVariants";
import {
  resolveNatalSambandha,
} from "./knowledge/natalSambandhaResolver";

import {
  resolveDashaSambandha,
} from "./knowledge/dashaSambandhaResolver";
import type {
  ActivatedSambandha,
} from "./knowledge/dashaSambandhaResolver";

import { getNakshatraPadaData } from "./knowledge/nakshatraPadaData";

export type PersonalizedNatalPosition = {
  sign: ZodiacSign;
  house: number;

  // Optional narrative context; does not affect prediction scoring.
  nakshatra?: string | null;
  pada?: 1 | 2 | 3 | 4 | null;
};


export type PersonalizedDailyPredictionInput = {
  sky: DailySkyInput;

  selectedDateISO: string;
  profileKey: string;

  ascendant: ZodiacSign;
  age?: number;
  dasha: {
    mahadasha: PlanetName;
    antardasha: PlanetName;
    pratyantardasha: PlanetName;
  };

  natalPositions: Partial<
    Record<
      PlanetName,
      PersonalizedNatalPosition
    >
  >;
};
export function generatePersonalizedDailyPrediction(
  input: PersonalizedDailyPredictionInput
) {
  const enrichedSky =
    enrichSkyInputWithPlanetContacts(
      input.sky
    );
const moonPadaData = getNakshatraPadaData(
  enrichedSky.moon.siderealLongitude
);

console.log("[DAILY MOON PADA DATA]", moonPadaData);
  const judgements =
    judgeAllAscendants(
      enrichedSky
    );

  const ascendantJudgement =
    judgements.find(
      (judgement) =>
        judgement.ascendant ===
        input.ascendant
    );

  if (!ascendantJudgement)
    {
    throw new Error(
      `Ascendant judgement not found for ${input.ascendant}.`
    );
  }

if (process.env.NODE_ENV !== "production") {
  const moonSources = new Set([
    "moon_house",
    "moon_lordship",
    "moon_nakshatra",
    "moon_condition",
  ]);

  ;
}
  const dasha =
    resolveDashaActivation({
      ascendant: input.ascendant,

      mahadasha:
        input.dasha.mahadasha,

      antardasha:
        input.dasha.antardasha,

      pratyantardasha:
        input.dasha.pratyantardasha,

      natalPositions:
        input.natalPositions,
    });
let activatedSambandha: ActivatedSambandha[] = [];
  // Natal Sambandha diagnostic.
  // Does not affect prediction scores or event selection.
  if (
    input.natalPositions &&
    Object.keys(input.natalPositions).length > 0
  ) {
    const natalSambandha =
      resolveNatalSambandha({
        ascendant: input.ascendant,
        planets: input.natalPositions,
      });
if (process.env.NODE_ENV === "development") {
  const moonNakshatraLord =
    ascendantJudgement.rankedSignals.find(
      (signal) => signal.source === "moon_nakshatra"
    )?.nakshatraLord;

  if (moonNakshatraLord) {
    console.dir(
  {
      moonNakshatraLord,
      dashaPlanets: dasha.dominantPlanets,
      relationships: natalSambandha.relationships
        .filter((relationship) =>
          relationship.planets.includes(moonNakshatraLord)
        )
        .map((relationship) => ({
          type: relationship.type,
          planets: relationship.planets,
          planetLordships: relationship.planetLordships,
          connectedHouses: relationship.houses,
          connectsDashaPlanet:
            relationship.planets.some(
              (planet) =>
                planet !== moonNakshatraLord &&
                dasha.dominantPlanets.includes(planet)
      ),
      })),
  },
  { depth: null }
);
  }
}
    activatedSambandha =
  resolveDashaSambandha(
    dasha,
    natalSambandha
  );

    if (process.env.NODE_ENV !== "production") {
      ;
    }
  }
if (process.env.NODE_ENV !== "production") {
  ;
}
  const synthesis =
    synthesizeDashaTransit(
      dasha,
      ascendantJudgement
    );


const events =
  buildEventActivations({
    dasha,
    transit: ascendantJudgement,
    synthesis,
    activatedSambandha,
    moonPadaData,
    natalPositions: input.natalPositions,
    age: input.age,
  });

const priorities =
  buildDailyPriorities(
    events.activations
  );
  if (process.env.NODE_ENV !== "production") {
  console.log(
    "[MONEY CANDIDATES]",
    JSON.stringify(
      priorities.priorities.find((p) => p.area === "money"),
      null,
      2
    )
  );
}
let dailyComparison: {
  moonSign: string;
  moonNakshatra: string;
  dailyAreas: {
    area: string;
    strongestImportance: number;
    signalCount: number;
    dashaScore: number;
    signals: {
      source: string;
      planet: string | null;
      importance: number;
      polarity: string;
    }[];
  }[];
} | null = null;

  const dailySources = new Set([
    "moon_house",
    "moon_lordship",
    "moon_nakshatra",
    "moon_condition",
  ]);

  const dailySignals =
    ascendantJudgement.rankedSignals.filter(
      (signal) => dailySources.has(signal.source)
    );

  const dailyAreas = new Map<
    string,
    {
      strongestImportance: number;
      signalCount: number;
      signals: {
        source: string;
        planet: string | null;
        importance: number;
        polarity: string;
      }[];
    }
  >();

  for (const signal of dailySignals) {
    const existing = dailyAreas.get(signal.area) ?? {
      strongestImportance: 0,
      signalCount: 0,
      signals: [],
    };

    existing.strongestImportance = Math.max(
      existing.strongestImportance,
      signal.importance
    );
    existing.signalCount += 1;
    existing.signals.push({
      source: signal.source,
      planet: signal.planet ?? null,
      importance: signal.importance,
      polarity: signal.polarity,
    });

    dailyAreas.set(signal.area, existing);
  }
dailyComparison = {
  moonSign: enrichedSky.moon.sign,
  moonNakshatra: enrichedSky.moon.nakshatra,
  dailyAreas: [...dailyAreas.entries()]
    .map(([area, evidence]) => ({
      area,
      ...evidence,
      dashaScore:
        dasha.periodAreaActivations.find(
          (item) => item.area === area
        )?.score ?? 0,
    }))
    .sort(
      (a, b) =>
        b.strongestImportance - a.strongestImportance ||
        b.signalCount - a.signalCount
    ),
};
if (process.env.NODE_ENV !== "production") {
  ;
}
if (
  process.env.NODE_ENV !==
  "production"
) {
  logDailyCalibration(
  events.activations,
  priorities,
  {
    sign:
      enrichedSky.moon.sign,

    nakshatra:
      enrichedSky.moon.nakshatra,

    pada:
      enrichedSky.moon.pada ??
      null,
  }
);
}

const prediction =
  buildDailyPrediction(priorities);
if (process.env.NODE_ENV !== "production") {
  ;
}
const primaryActivation =
  prediction.primaryTheme
    ? events.activations.find(
        (activation) =>
          activation.area ===
          prediction.primaryTheme?.area
      )
    : null;

const selectedManifestation =
  primaryActivation?.candidateEvents.find(
    (candidate) =>
      candidate.id ===
      prediction.primaryTheme?.manifestationId
  );
const relevantPadaContext = primaryActivation
  ? [...new Set(primaryActivation.dashaPlanets)]
      .map((planet) => {
        const natal = input.natalPositions[planet];

        if (
          !natal?.nakshatra ||
          !natal?.pada
        ) {
          return null;
        }

        const interpretation = getPadaInterpretation(
          natal.nakshatra,
          natal.pada
        );

        if (!interpretation) return null;

        return {
          planet,
          nakshatra: natal.nakshatra,
          pada: natal.pada,
          navamsa: interpretation.navamsa,
          coreTheme: interpretation.coreTheme,
          narrativeAngles: interpretation.narrativeAngles,
          actionStyles: interpretation.actionStyles,
          cautionStyles: interpretation.cautionStyles,
        };
      })
      .filter((item) => item !== null)
  : [];

const primaryPada =
  relevantPadaContext[0] ?? null;
const currentMoonPadaInterpretation =
  moonPadaData?.nakshatra && moonPadaData?.pada
    ? getPadaInterpretation(
        moonPadaData.nakshatra,
        moonPadaData.pada
      )
    : null;
const narrativeVariant =
  prediction.primaryTheme
    ? selectDailyNarrativeVariant({
        manifestationId:
  prediction.primaryTheme.manifestationId ??
  `${prediction.primaryTheme.area}_general`,

        polarity:
          prediction.primaryTheme.polarity,

        selectedDateISO:
          input.selectedDateISO,

        profileKey:
          input.profileKey,

        nakshatra:
  moonPadaData?.nakshatra ?? null,

pada:
  moonPadaData?.pada ?? null,
      })
    : null;
const moonPadaAction =
  currentMoonPadaInterpretation?.actionStyles?.length
    ? currentMoonPadaInterpretation.actionStyles[
        Math.abs(
          Math.floor(
            Date.parse(`${input.selectedDateISO}T00:00:00Z`) /
              86_400_000
          )
        ) %
          currentMoonPadaInterpretation.actionStyles.length
      ]
    : null;
  const moonPadaCaution =
  currentMoonPadaInterpretation?.cautionStyles?.length
    ? currentMoonPadaInterpretation.cautionStyles[
        Math.abs(
          Math.floor(
            Date.parse(`${input.selectedDateISO}T00:00:00Z`) /
              86_400_000
          )
        ) %
          currentMoonPadaInterpretation.cautionStyles.length
      ]
    : null;
  const normalizedMoonCaution =
  moonPadaCaution?.toLowerCase() ?? "";

const moonCautionDirection =
  normalizedMoonCaution.includes("rush") ||
  normalizedMoonCaution.includes("hasty") ||
  normalizedMoonCaution.includes("impulsive")
    ? "avoid_rushing"
    : normalizedMoonCaution.includes("assum") ||
      normalizedMoonCaution.includes("clarity") ||
      normalizedMoonCaution.includes("understood")
    ? "avoid_assumptions"
    : normalizedMoonCaution.includes("overextend") ||
      normalizedMoonCaution.includes("too much") ||
      normalizedMoonCaution.includes("everything")
    ? "avoid_overextension"
    : normalizedMoonCaution.includes("rigid") ||
      normalizedMoonCaution.includes("resist") ||
      normalizedMoonCaution.includes("holding")
    ? "avoid_rigidity"
    : normalizedMoonCaution.includes("react") ||
      normalizedMoonCaution.includes("emotion")
    ? "avoid_reactivity"
    : normalizedMoonCaution.includes("pride") ||
  normalizedMoonCaution.includes("ego") ||
  normalizedMoonCaution.includes("prove")
? "avoid_pride"
: normalizedMoonCaution.includes("disrupt") ||
  normalizedMoonCaution.includes("instability") ||
  normalizedMoonCaution.includes("unsettled")
? "avoid_disruption"
    : normalizedMoonCaution.includes("direction") ||
      normalizedMoonCaution.includes("next step") ||
      normalizedMoonCaution.includes("transition")
    ? "avoid_drift"
    : normalizedMoonCaution.includes("perfection") ||
      normalizedMoonCaution.includes("perfect certainty") ||
      normalizedMoonCaution.includes("delay")
     ? "avoid_overanalysis"
    : normalizedMoonCaution.includes("pressure") ||
      normalizedMoonCaution.includes("overwork") ||
      normalizedMoonCaution.includes("overburden")
    ? "avoid_overpressure"
    : "general_caution";
  const primaryManifestationLabel =
  prediction.primaryTheme?.manifestationLabel ??
  prediction.primaryTheme?.area ??
  null;
const primaryContextArea =
  prediction.primaryTheme?.area ?? null;
const moonPadaThemes =
  currentMoonPadaInterpretation?.interpretiveThemes ?? [];
  const normalizedMoonThemes =
  moonPadaThemes.map((theme) => theme.toLowerCase());

const moonThemeDirection =
  normalizedMoonThemes.some((theme) =>
    ["completion", "closure", "release"].includes(theme)
  )
    ? "complete"
    : normalizedMoonThemes.some((theme) =>
        ["clarity", "analysis", "discernment", "perspective"].includes(theme)
      )
    ? "clarify"
    : normalizedMoonThemes.some((theme) =>
        ["stability", "preparation", "responsibility", "discipline"].includes(theme)
      )
    ? "stabilize"
    : normalizedMoonThemes.some((theme) =>
        ["transition", "change", "transformation", "new direction"].includes(theme)
      )
    ? "transition"
    : normalizedMoonThemes.some((theme) =>
        ["cooperation", "balance", "understanding", "communication"].includes(theme)
      )
    ? "coordinate"
    : "develop";
const moonPredictionDirection =
  moonThemeDirection === "complete"
    ? "completion"
    : moonThemeDirection === "clarify"
    ? "clarification"
    : moonThemeDirection === "stabilize"
    ? "stabilization"
    : moonThemeDirection === "transition"
    ? "transition"
    : moonThemeDirection === "coordinate"
    ? "coordination"
    : "development";
const moonPadaNuance =
  currentMoonPadaInterpretation?.interpretiveThemes
    ?.map((theme) => theme.toLowerCase()) ?? [];

const hasMoonPadaTheme = (...themes: string[]) =>
  themes.some((theme) =>
    moonPadaNuance.includes(theme.toLowerCase())
  );
const moneyManifestationType =
  primaryContextArea === "money"
    ? prediction.primaryTheme?.manifestationId ?? null
    : null;
const educationManifestationType =
  primaryContextArea === "education"
    ? prediction.primaryTheme?.manifestationId ?? null
    : null;
const careerManifestationType =
  primaryContextArea === "career"
    ? prediction.primaryTheme?.manifestationId ?? null
    : null;
const familyManifestationType =
  primaryContextArea === "family"
    ? prediction.primaryTheme?.manifestationId ?? null
    : null;

const communicationManifestationType =
  primaryContextArea === "communication"
    ? prediction.primaryTheme?.manifestationId ?? null
    : null;

const homeManifestationType =
  primaryContextArea === "home"
    ? prediction.primaryTheme?.manifestationId ?? null
    : null;
const relationshipManifestationType =
  primaryContextArea === "relationships"
    ? prediction.primaryTheme?.manifestationId ?? null
    : null;
const childrenManifestationType =
  primaryContextArea === "children"
    ? prediction.primaryTheme?.manifestationId ?? null
    : null;
const propertyManifestationType =
  primaryContextArea === "property"
    ? prediction.primaryTheme?.manifestationId ?? null
    : null;

const mindManifestationType =
  primaryContextArea === "mind"
    ? prediction.primaryTheme?.manifestationId ?? null
    : null;

const healthManifestationType =
  primaryContextArea === "health"
    ? prediction.primaryTheme?.manifestationId ?? null
    : null;

const travelManifestationType =
  primaryContextArea === "travel"
    ? prediction.primaryTheme?.manifestationId ?? null
    : null;
const spiritualityManifestationType =
  primaryContextArea === "spirituality"
    ? prediction.primaryTheme?.manifestationId ?? null
    : null;

const publicImageManifestationType =
  primaryContextArea === "publicImage"
    ? prediction.primaryTheme?.manifestationId ?? null
    : null;

const hiddenMattersManifestationType =
  primaryContextArea === "hiddenMatters"
    ? prediction.primaryTheme?.manifestationId ?? null
    : null;
const contextualMoonPrediction =
  moneyManifestationType === "money_inflow"
    ? moonPredictionDirection === "completion"
      ? "Financial progress may come through completing or closing an existing payment, receipt or money-related matter."
      : moonPredictionDirection === "clarification"
      ? "A financial matter may become clearer today, particularly around an expected payment, receipt or available resource."
      : moonPredictionDirection === "stabilization"
      ? "Financial progress may favour strengthening or securing an existing source of money rather than pursuing something uncertain."
      : moonPredictionDirection === "transition"
      ? "A payment or financial development may mark a transition from one financial situation or arrangement into the next."
      : moonPredictionDirection === "coordination"
      ? "Financial progress may depend on communication, cooperation or coordinating the practical details of a payment or receipt."
      : "The emphasis is on allowing the financial development to build through a practical next step rather than forcing an immediate outcome."
        : moneyManifestationType === "money_accumulation"
    ? moonPredictionDirection === "completion"
      ? "The emphasis is on consolidating what has already been built and bringing an existing saving or accumulation objective closer to completion."
      : moonPredictionDirection === "clarification"
      ? "The financial picture may become clearer around what should be retained, saved or prioritised for longer-term security."
      : moonPredictionDirection === "stabilization"
      ? "The emphasis is on strengthening existing reserves and making your financial base more secure."
      : moonPredictionDirection === "transition"
      ? "The way you build or preserve financial resources may begin shifting toward a different longer-term priority."
      : moonPredictionDirection === "coordination"
      ? "Progress may depend on aligning different financial priorities so that saving or accumulation supports the broader plan."
      : "The emphasis is on building steadily on the resources already available rather than looking for immediate expansion."
       : moneyManifestationType === "money_outflow"
    ? moonPredictionDirection === "completion"
      ? "The financial outflow may be connected with completing an existing obligation, payment or expense that needs to be brought to closure."
      : moonPredictionDirection === "clarification"
      ? "Greater clarity may emerge around which expense or financial obligation genuinely needs attention and which can wait."
      : moonPredictionDirection === "stabilization"
      ? "The emphasis is on keeping necessary spending controlled so that an expense does not unnecessarily weaken your broader financial position."
      : moonPredictionDirection === "transition"
      ? "A financial outflow may accompany a change in priorities, responsibilities or an arrangement that is moving into a different phase."
      : moonPredictionDirection === "coordination"
      ? "Managing the financial outflow may depend on coordinating payments, obligations or shared financial responsibilities carefully."
      : "The emphasis is on handling necessary financial outflow practically while keeping its effect on your wider resources contained."
       : moneyManifestationType === "money_planning"
    ? moonPredictionDirection === "completion"
      ? "The emphasis is on finalising an existing financial decision or plan before opening another financial priority."
      : moonPredictionDirection === "clarification"
      ? "The financial picture may become clearer around priorities, available resources or the decision that needs to be made next."
      : moonPredictionDirection === "stabilization"
      ? "Financial planning may favour strengthening the existing structure, budget or allocation before considering further expansion."
      : moonPredictionDirection === "transition"
      ? "Your financial priorities or planning approach may begin shifting as one arrangement gives way to another."
      : moonPredictionDirection === "coordination"
      ? "Progress may depend on bringing different financial commitments, resources or priorities into a more workable arrangement."
      : "The emphasis is on developing the financial plan through a practical next step rather than trying to resolve every future decision at once."
        : moneyManifestationType === "money_settlement"
    ? moonPredictionDirection === "completion"
      ? "The financial matter may move closer to closure as an existing settlement, repayment or outstanding obligation reaches a more definite stage."
      : moonPredictionDirection === "clarification"
      ? "Greater clarity may emerge around the amount, terms or practical steps needed to resolve an outstanding financial matter."
      : moonPredictionDirection === "stabilization"
      ? "The emphasis is on resolving the financial matter in a way that restores greater stability rather than creating another obligation."
      : moonPredictionDirection === "transition"
      ? "Resolving an outstanding financial matter may help move you from one financial arrangement or obligation into the next phase."
      : moonPredictionDirection === "coordination"
      ? "Progress toward settlement may depend on coordinating terms, payments or responsibilities with another person or institution."
      : "The financial matter may develop through a practical step that brings an outstanding obligation or settlement closer to resolution."
        : educationManifestationType === "education_challenge"
    ? moonPredictionDirection === "completion"
      ? "The learning challenge may be easier to resolve by completing or closing a specific unfinished part before taking on anything new."
      : moonPredictionDirection === "clarification"
      ? "The difficulty may become more manageable once the exact gap, confusing point or underlying problem becomes clearer."
      : moonPredictionDirection === "stabilization"
      ? "Progress may come through strengthening the fundamentals and working steadily with what is already understood."
      : moonPredictionDirection === "transition"
      ? "The learning difficulty may signal that a different method, approach or stage of study now needs to replace the current one."
      : moonPredictionDirection === "coordination"
      ? "Working through the difficulty may depend on discussion, guidance or bringing different pieces of information together more effectively."
      : "The challenge may ease through steady engagement with the difficult material rather than trying to resolve it all at once."
        : educationManifestationType === "education_focus"
    ? moonPredictionDirection === "completion"
      ? "Concentration may be strongest when directed toward finishing an existing study task or bringing one learning objective to completion."
      : moonPredictionDirection === "clarification"
      ? "Mental focus may sharpen as the subject, priority or specific question requiring attention becomes clearer."
      : moonPredictionDirection === "stabilization"
      ? "Concentration may benefit from a steady structure, familiar material and a consistent study rhythm."
      : moonPredictionDirection === "transition"
      ? "Your attention may begin shifting toward a different subject, method or learning priority as the day develops."
      : moonPredictionDirection === "coordination"
      ? "Focus may improve by connecting related ideas, organising information or working through the material with someone else."
      : "The learning environment may support deeper concentration when your attention is directed toward one practical objective at a time."
        : educationManifestationType === "education_progress"
    ? moonPredictionDirection === "completion"
      ? "Learning progress may come through finishing an existing stage, assignment or study objective before moving forward."
      : moonPredictionDirection === "clarification"
      ? "Progress may become more visible once the next learning objective or the knowledge needed to move forward becomes clearer."
      : moonPredictionDirection === "stabilization"
      ? "Educational progress may come through consolidating what has already been learned and strengthening the foundation for the next stage."
      : moonPredictionDirection === "transition"
      ? "Learning may begin moving into a new stage, subject or approach as previous work creates the opening for further development."
      : moonPredictionDirection === "coordination"
      ? "Progress may develop through discussion, guidance or connecting different parts of the learning process more effectively."
      : "The learning process may advance through steady development of what has already been started rather than through a sudden breakthrough."
        : careerManifestationType === "career_movement"
    ? moonPredictionDirection === "completion"
      ? "Career movement may develop through completing an existing responsibility, process or professional matter before the next opportunity can properly open."
      : moonPredictionDirection === "clarification"
      ? "The direction of professional movement may become clearer as the next role, opportunity or practical career step comes into sharper focus."
      : moonPredictionDirection === "stabilization"
      ? "Professional progress may favour strengthening your existing position or foundation before attempting a larger move."
      : moonPredictionDirection === "transition"
      ? "Career circumstances may be moving from one phase into another, with signs of a different role, direction or professional arrangement beginning to emerge."
      : moonPredictionDirection === "coordination"
      ? "Career movement may depend on communication, cooperation or aligning the next professional step with the people involved."
      : "Professional movement may build gradually through a practical opening or next step rather than through an immediate major change."
        : careerManifestationType === "career_change"
    ? moonPredictionDirection === "completion"
      ? "A professional change may become more relevant as an existing role, responsibility or career chapter moves toward completion."
      : moonPredictionDirection === "clarification"
      ? "The need for professional change may become clearer as you recognise what should continue and what needs to be different."
      : moonPredictionDirection === "stabilization"
      ? "Any professional change may favour a measured approach that protects stability while preparing the foundation for something different."
      : moonPredictionDirection === "transition"
      ? "Career circumstances may be entering a genuine transition, with an existing professional arrangement beginning to give way to a different direction."
      : moonPredictionDirection === "coordination"
      ? "A professional change may depend on discussions, agreements or coordinating the transition with the people involved."
      : "The possibility of professional change may develop gradually as circumstances create a practical opening for a different direction."
        : careerManifestationType === "career_recognition"
    ? moonPredictionDirection === "completion"
      ? "Professional recognition may arise from completing an important responsibility, delivering a result or bringing an existing piece of work to a strong conclusion."
      : moonPredictionDirection === "clarification"
      ? "Your professional contribution may become more visible as the value of your work, role or expertise is recognised more clearly."
      : moonPredictionDirection === "stabilization"
      ? "Recognition may develop through consistency, reliability and strengthening the professional credibility you have already established."
      : moonPredictionDirection === "transition"
      ? "Greater visibility or acknowledgement may accompany a shift in your professional role, responsibilities or position."
      : moonPredictionDirection === "coordination"
      ? "Professional recognition may develop through collaboration, communication or the way your contribution supports a wider team or objective."
      : "Recognition may build gradually as your contribution becomes more visible through practical results and continued professional progress."
        : careerManifestationType === "career_responsibility"
    ? moonPredictionDirection === "completion"
      ? "Professional responsibility may centre on completing an existing commitment, deliverable or obligation before additional duties are taken on."
      : moonPredictionDirection === "clarification"
      ? "Your professional responsibilities may become clearer as priorities, expectations or ownership of an important task are better defined."
      : moonPredictionDirection === "stabilization"
      ? "The emphasis may be on handling existing responsibilities consistently and strengthening the structure around your current workload."
      : moonPredictionDirection === "transition"
      ? "Professional responsibilities may begin changing as an existing duty, role or area of ownership moves into a different phase."
      : moonPredictionDirection === "coordination"
      ? "Managing professional responsibilities may depend on aligning expectations, delegating appropriately or coordinating work with others."
      : "Professional responsibility may develop through a practical increase in ownership, follow-through or attention to an existing work priority."
        : careerManifestationType === "workload_service"
    ? moonPredictionDirection === "completion"
      ? "Workload demands may centre on finishing pending tasks or clearing an existing responsibility before additional work is taken on."
      : moonPredictionDirection === "clarification"
      ? "The workload may become easier to manage once the most important responsibility or source of pressure is clearly identified."
      : moonPredictionDirection === "stabilization"
      ? "Work demands may favour a steady, structured approach that keeps existing responsibilities manageable and under control."
      : moonPredictionDirection === "transition"
      ? "The pattern of work or service responsibilities may begin shifting as one set of demands gives way to another."
      : moonPredictionDirection === "coordination"
      ? "Managing the workload may depend on coordinating responsibilities, communicating priorities or sharing tasks more effectively."
      : "Work demands may remain active, with progress coming through handling responsibilities steadily rather than trying to resolve everything at once."
        : relationshipManifestationType === "relationship_commitment"
    ? moonPredictionDirection === "completion"
      ? "A relationship commitment may become more significant as an existing discussion, understanding or stage of the relationship moves toward a conclusion."
      : moonPredictionDirection === "clarification"
      ? "The direction of a relationship commitment may become clearer as expectations, intentions or the next step are better understood."
      : moonPredictionDirection === "stabilization"
      ? "Relationship commitment may develop through strengthening trust, consistency or the foundation that already exists between you."
      : moonPredictionDirection === "transition"
      ? "The relationship may be moving into a different phase, with an existing connection beginning to take on a new level of commitment or responsibility."
      : moonPredictionDirection === "coordination"
      ? "Progress around commitment may depend on aligning expectations, discussing practical matters or reaching a shared understanding."
      : "The relationship may develop toward greater commitment through a practical next step rather than through an immediate major decision."
        : relationshipManifestationType === "relationship_discussion"
    ? moonPredictionDirection === "completion"
      ? "A relationship discussion may help bring an unresolved matter, pending conversation or existing concern closer to closure."
      : moonPredictionDirection === "clarification"
      ? "Conversation may bring greater clarity around feelings, expectations or an issue that has not yet been fully understood."
      : moonPredictionDirection === "stabilization"
      ? "Relationship discussions may favour reinforcing understanding and creating greater stability around an existing matter."
      : moonPredictionDirection === "transition"
      ? "A conversation may mark a turning point in the relationship as an existing understanding begins shifting toward something different."
      : moonPredictionDirection === "coordination"
      ? "Progress may come through open communication and bringing different expectations or perspectives into better alignment."
      : "A relationship matter may develop through conversation, with the exchange helping move the situation toward its next practical stage."
        : relationshipManifestationType === "relationship_harmony"
    ? moonPredictionDirection === "completion"
      ? "Greater harmony may come through resolving an unfinished matter or allowing an earlier disagreement or concern to reach closure."
      : moonPredictionDirection === "clarification"
      ? "Relationship harmony may improve as feelings, intentions or expectations become easier to understand."
      : moonPredictionDirection === "stabilization"
      ? "The relationship may benefit from reinforcing trust, consistency and the sense of security already present between you."
      : moonPredictionDirection === "transition"
      ? "A more harmonious phase may begin to emerge as the relationship moves beyond an earlier pattern or source of difficulty."
      : moonPredictionDirection === "coordination"
      ? "Harmony may strengthen through cooperation, mutual understanding and bringing different needs or expectations into better balance."
      : "The relationship may become easier and more supportive through small constructive developments that strengthen the connection."
        : relationshipManifestationType === "relationship_tension"
    ? moonPredictionDirection === "completion"
      ? "Relationship tension may centre on an unresolved issue that now needs to be addressed or brought to a conclusion."
      : moonPredictionDirection === "clarification"
      ? "The source of relationship tension may become clearer as underlying feelings, expectations or misunderstandings come into sharper focus."
      : moonPredictionDirection === "stabilization"
      ? "The tension may be easier to manage by restoring consistency, reassurance or a more stable way of dealing with the issue."
      : moonPredictionDirection === "transition"
      ? "Relationship tension may reflect a changing dynamic, with an existing pattern or understanding beginning to give way to something different."
      : moonPredictionDirection === "coordination"
      ? "Reducing the tension may depend on communication, mutual adjustment and bringing different expectations into better alignment."
      : "The relationship tension may ease through steady attention to the underlying issue rather than reacting only to the immediate disagreement."
        : relationshipManifestationType === "relationship_attention"
    ? moonPredictionDirection === "completion"
      ? "A relationship matter may need attention because something unresolved, unfinished or previously left open is ready to be addressed."
      : moonPredictionDirection === "clarification"
      ? "Attention may turn toward a relationship matter as feelings, expectations or the nature of an issue become easier to understand."
      : moonPredictionDirection === "stabilization"
      ? "A relationship may benefit from attention that reinforces consistency, reassurance or the stability of the existing connection."
      : moonPredictionDirection === "transition"
      ? "A relationship matter may require attention because the connection or its circumstances are beginning to move into a different phase."
      : moonPredictionDirection === "coordination"
      ? "Relationship attention may centre on communication, mutual adjustment or bringing different needs and expectations into better alignment."
      : "A relationship matter may need greater attention as small developments reveal what requires care or a practical next step."
       : childrenManifestationType === "children_attention"
    ? moonPredictionDirection === "completion"
      ? "A matter involving a child may need attention because something unfinished, pending or previously left open is ready to be addressed."
      : moonPredictionDirection === "clarification"
      ? "A matter involving a child may become easier to understand as the specific need, concern or situation requiring attention becomes clearer."
      : moonPredictionDirection === "stabilization"
      ? "Attention involving a child may centre on providing consistency, reassurance or strengthening an existing routine or support structure."
      : moonPredictionDirection === "transition"
      ? "A child-related matter may require attention because circumstances, needs or responsibilities are beginning to move into a different phase."
      : moonPredictionDirection === "coordination"
      ? "The situation may require communication and coordination around the child's needs, schedule or responsibilities."
      : "A matter involving a child may need greater attention as small developments reveal where practical support or involvement is required."
        : childrenManifestationType === "children_concern"
    ? moonPredictionDirection === "completion"
      ? "A concern involving a child may move closer to resolution as an unfinished matter is addressed or the necessary follow-through is completed."
      : moonPredictionDirection === "clarification"
      ? "The source of concern may become clearer as you understand more precisely what the child needs or what is actually causing the difficulty."
      : moonPredictionDirection === "stabilization"
      ? "The concern may become more manageable through consistency, reassurance and strengthening the support already available to the child."
      : moonPredictionDirection === "transition"
      ? "The concern may be connected with a changing stage, routine or circumstance in the child's life that requires some adjustment."
      : moonPredictionDirection === "coordination"
      ? "Addressing the concern may depend on communication and coordinating the child's needs with the other people involved."
      : "The concern may become easier to manage through steady attention to what is developing rather than reacting to the situation too quickly."
        : childrenManifestationType === "children_milestone"
    ? moonPredictionDirection === "completion"
      ? "A milestone involving a child may mark the completion of an important stage, achievement or developmental phase."
      : moonPredictionDirection === "clarification"
      ? "A child's progress may become more visible as an achievement, ability or next developmental step becomes clearer."
      : moonPredictionDirection === "stabilization"
      ? "The milestone may reflect steady development and the strengthening of abilities, routines or foundations already being built."
      : moonPredictionDirection === "transition"
      ? "A milestone may signal that the child is moving from one stage, responsibility or developmental phase into another."
      : moonPredictionDirection === "coordination"
      ? "The milestone may develop through support, guidance or coordination between the child and the people involved in their progress."
      : "A meaningful step in the child's development may emerge through the continued growth of something already underway."
        : childrenManifestationType === "children_progress"
    ? moonPredictionDirection === "completion"
      ? "A child's progress may become visible through completing an existing stage, task or developmental objective before moving forward."
      : moonPredictionDirection === "clarification"
      ? "The child's progress may become easier to recognise as their strengths, needs or next developmental step become clearer."
      : moonPredictionDirection === "stabilization"
      ? "Progress may come through consolidating what the child has already learned or achieved and strengthening the foundation for further growth."
      : moonPredictionDirection === "transition"
      ? "The child's development may begin moving into a new stage as earlier progress creates the opening for different abilities or responsibilities."
      : moonPredictionDirection === "coordination"
      ? "Progress may develop through guidance, encouragement or better coordination between the child and the people supporting their growth."
      : "The child's progress may build steadily through continued development of abilities, routines or efforts already underway."
        : childrenManifestationType === "children_responsibility"
    ? moonPredictionDirection === "completion"
      ? "A responsibility involving a child may centre on completing an existing commitment, arrangement or task before another demand needs attention."
      : moonPredictionDirection === "clarification"
      ? "Your responsibility toward a child may become clearer as the specific need, priority or expectation requiring attention is better understood."
      : moonPredictionDirection === "stabilization"
      ? "Child-related responsibilities may favour maintaining consistency, structure and dependable support around what already needs to be managed."
      : moonPredictionDirection === "transition"
      ? "Responsibilities involving a child may begin changing as their needs, routine or stage of development moves into a different phase."
      : moonPredictionDirection === "coordination"
      ? "Managing a child-related responsibility may depend on coordinating schedules, expectations or support with the other people involved."
      : "A responsibility involving a child may develop through practical follow-through and steady attention to what currently needs your involvement."
        : prediction.primaryTheme?.manifestationId === "family_discussion"
    ? moonPredictionDirection === "completion"
      ? "A family discussion may help bring an unresolved matter, pending decision or earlier concern closer to closure."
      : moonPredictionDirection === "clarification"
      ? "A family matter may become clearer through conversation as expectations, concerns or different viewpoints are better understood."
      : moonPredictionDirection === "stabilization"
      ? "Family discussions may favour reinforcing understanding and creating a more stable approach to an existing matter."
      : moonPredictionDirection === "transition"
      ? "A family conversation may mark a turning point as an existing arrangement, understanding or situation begins moving into a different phase."
      : moonPredictionDirection === "coordination"
      ? "Progress may depend on bringing different family viewpoints, expectations or responsibilities into better alignment."
      : "A family matter may develop through conversation, with practical discussion helping move the situation toward its next stage."

    : prediction.primaryTheme?.manifestationId === "family_responsibility"
    ? moonPredictionDirection === "completion"
      ? "A family responsibility may centre on completing an existing commitment, obligation or pending matter before another demand requires attention."
      : moonPredictionDirection === "clarification"
      ? "Your role in a family responsibility may become clearer as priorities, expectations or the specific support required are better defined."
      : moonPredictionDirection === "stabilization"
      ? "Family responsibilities may favour maintaining consistency, structure and dependable support around what already needs to be managed."
      : moonPredictionDirection === "transition"
      ? "Family responsibilities may begin changing as an existing arrangement, role or household situation moves into a different phase."
      : moonPredictionDirection === "coordination"
      ? "Managing a family responsibility may depend on sharing duties, coordinating practical arrangements or aligning expectations with others."
      : "A family responsibility may develop through practical follow-through and steady attention to what currently requires your involvement."

    : prediction.primaryTheme?.manifestationId === "family_support"
    ? moonPredictionDirection === "completion"
      ? "Family support may become important in helping an existing matter reach resolution or bringing a pending responsibility to completion."
      : moonPredictionDirection === "clarification"
      ? "The kind of family support needed may become clearer as the underlying concern, priority or practical requirement is better understood."
      : moonPredictionDirection === "stabilization"
      ? "Family support may help reinforce stability, reassurance and the practical foundations around an existing situation."
      : moonPredictionDirection === "transition"
      ? "Support from or toward family may become more important as circumstances move from one stage or arrangement into another."
      : moonPredictionDirection === "coordination"
      ? "Family support may work best through cooperation, shared responsibilities and coordinating what different people can realistically contribute."
      : "Family support may strengthen through practical involvement and steady attention to what is developing."

    : prediction.primaryTheme?.manifestationId === "family_tension"
    ? moonPredictionDirection === "completion"
      ? "Family tension may centre on an unresolved issue that now needs to be addressed or brought toward a conclusion."
      : moonPredictionDirection === "clarification"
      ? "The source of family tension may become clearer as underlying expectations, concerns or misunderstandings come into sharper focus."
      : moonPredictionDirection === "stabilization"
      ? "The tension may become easier to manage by restoring consistency, reassurance or a more stable approach to the underlying issue."
      : moonPredictionDirection === "transition"
      ? "Family tension may reflect a changing dynamic as an existing arrangement, role or pattern begins giving way to something different."
      : moonPredictionDirection === "coordination"
      ? "Reducing family tension may depend on communication, mutual adjustment and bringing different expectations or responsibilities into better alignment."
      : "Family tension may ease through steady attention to the underlying issue rather than reacting only to the immediate disagreement."

        : prediction.primaryTheme?.manifestationId === "communication_activity"
    ? moonPredictionDirection === "completion"
      ? "Communication activity may centre on completing an existing exchange, following up on a pending message or bringing an ongoing discussion toward closure."
      : moonPredictionDirection === "clarification"
      ? "Conversations or messages may help clarify an issue, request or piece of information that previously remained uncertain."
      : moonPredictionDirection === "stabilization"
      ? "Communication may favour maintaining consistency, confirming details and strengthening an understanding that is already developing."
      : moonPredictionDirection === "transition"
      ? "An exchange of information may signal a shift in circumstances as one discussion, arrangement or line of communication moves into a different phase."
      : moonPredictionDirection === "coordination"
      ? "Communication may become especially useful for coordinating plans, aligning expectations or bringing different people onto the same page."
      : "Communication activity may increase as an existing matter develops and requires further exchange, follow-up or practical discussion."

    : prediction.primaryTheme?.manifestationId === "communication_clarity"
    ? moonPredictionDirection === "completion"
      ? "Greater clarity may help bring an ongoing conversation, misunderstanding or unresolved exchange toward a definite conclusion."
      : moonPredictionDirection === "clarification"
      ? "Information may become easier to understand as the key point, intention or missing detail comes into sharper focus."
      : moonPredictionDirection === "stabilization"
      ? "Communication may become more reliable as facts, expectations or previously discussed details are confirmed and placed on firmer ground."
      : moonPredictionDirection === "transition"
      ? "New information or a clearer understanding may change how an existing conversation, decision or situation is viewed."
      : moonPredictionDirection === "coordination"
      ? "Clarity may emerge by comparing perspectives, confirming details or ensuring that everyone involved has the same understanding."
      : "A communication matter may become clearer gradually as additional information or a practical conversation fills in what was previously uncertain."

    : prediction.primaryTheme?.manifestationId === "communication_friction"
    ? moonPredictionDirection === "completion"
      ? "Communication friction may centre on an unresolved exchange or disagreement that now needs to be addressed rather than carried forward."
      : moonPredictionDirection === "clarification"
      ? "The source of communication friction may become clearer as the actual misunderstanding, assumption or difference in expectations is identified."
      : moonPredictionDirection === "stabilization"
      ? "Communication may become easier by keeping the exchange measured, consistent and focused on the practical issue rather than the immediate reaction."
      : moonPredictionDirection === "transition"
      ? "Communication friction may reflect a changing situation in which an earlier understanding, expectation or way of interacting no longer fits."
      : moonPredictionDirection === "coordination"
      ? "Resolving the communication difficulty may depend on listening carefully, comparing perspectives and establishing a clearer shared understanding."
      : "Communication friction may ease as the underlying issue is addressed steadily rather than allowing one difficult exchange to define the wider situation."

       : prediction.primaryTheme?.manifestationId === "home_attention"
    ? moonPredictionDirection === "completion"
      ? "A home-related matter may need attention because something unfinished, pending or previously left open is ready to be completed."
      : moonPredictionDirection === "clarification"
      ? "A matter involving the home may become easier to address as the specific need, priority or practical issue becomes clearer."
      : moonPredictionDirection === "stabilization"
      ? "Attention around the home may favour strengthening routines, organisation or the practical foundations that support greater stability."
      : moonPredictionDirection === "transition"
      ? "A home-related matter may require attention because an existing arrangement, routine or living situation is beginning to change."
      : moonPredictionDirection === "coordination"
      ? "Managing a home-related matter may depend on coordinating responsibilities, practical arrangements or expectations with others."
      : "A matter involving the home may need greater attention as practical developments reveal what requires your involvement."

    : prediction.primaryTheme?.manifestationId === "home_change"
    ? moonPredictionDirection === "completion"
      ? "A change involving the home may become more relevant as an existing arrangement, responsibility or domestic matter moves toward completion."
      : moonPredictionDirection === "clarification"
      ? "The direction of a home-related change may become clearer as practical needs, priorities or available options are better understood."
      : moonPredictionDirection === "stabilization"
      ? "Any home-related change may favour a measured approach that protects stability while preparing for a different arrangement."
      : moonPredictionDirection === "transition"
      ? "Domestic circumstances may be entering a genuine transition as an existing routine, arrangement or living situation begins giving way to something different."
      : moonPredictionDirection === "coordination"
      ? "A home-related change may depend on coordinating plans, responsibilities or practical arrangements with the people involved."
      : "A change involving the home may develop gradually as circumstances create a practical opening for a different arrangement."

    : prediction.primaryTheme?.manifestationId === "home_stability"
    ? moonPredictionDirection === "completion"
      ? "Greater domestic stability may come through resolving an unfinished matter or completing something that has been affecting the home environment."
      : moonPredictionDirection === "clarification"
      ? "The path toward greater stability at home may become clearer as priorities, responsibilities or practical needs are better understood."
      : moonPredictionDirection === "stabilization"
      ? "The home environment may benefit from reinforcing routines, consistency and the practical foundations already supporting stability."
      : moonPredictionDirection === "transition"
      ? "Domestic stability may require adjusting to a changing arrangement before a more settled pattern can become established."
      : moonPredictionDirection === "coordination"
      ? "Greater stability at home may depend on coordinating responsibilities and creating a more workable arrangement between the people involved."
      : "The home environment may become steadier through practical improvements and consistent attention to what already supports security."

    : prediction.primaryTheme?.manifestationId === "property_attention"
    ? moonPredictionDirection === "completion"
      ? "A property matter may require attention because an unfinished process, document, decision or practical issue is ready to be addressed."
      : moonPredictionDirection === "clarification"
      ? "A property matter may become easier to assess as the relevant facts, requirements or practical priorities become clearer."
      : moonPredictionDirection === "stabilization"
      ? "Property matters may favour protecting the existing position and strengthening practical arrangements before making a larger decision."
      : moonPredictionDirection === "transition"
      ? "A property matter may need attention because an existing arrangement, decision or situation is beginning to move into a different phase."
      : moonPredictionDirection === "coordination"
      ? "Progress on a property matter may depend on coordinating documents, responsibilities or discussions with the other people involved."
      : "A property matter may require greater attention as practical developments reveal the next step that needs to be handled."

    : prediction.primaryTheme?.manifestationId === "property_complication"
    ? moonPredictionDirection === "completion"
      ? "A property complication may centre on an unfinished requirement, pending issue or earlier matter that needs to be resolved before progress can continue."
      : moonPredictionDirection === "clarification"
      ? "The source of a property complication may become clearer as missing information, requirements or the underlying practical issue are identified."
      : moonPredictionDirection === "stabilization"
      ? "The complication may be easier to manage by protecting the existing position and resolving the issue without introducing unnecessary additional changes."
      : moonPredictionDirection === "transition"
      ? "A property complication may reflect a changing arrangement or process that requires adjustment before the matter can move into its next stage."
      : moonPredictionDirection === "coordination"
      ? "Resolving the property complication may depend on coordinating documents, responsibilities, approvals or communication between the parties involved."
      : "The property complication may become more manageable through steady attention to the specific issue preventing progress."

    : prediction.primaryTheme?.manifestationId === "property_progress"
    ? moonPredictionDirection === "completion"
      ? "Property progress may come through completing a pending requirement, decision or stage before the matter can move forward."
      : moonPredictionDirection === "clarification"
      ? "Progress may become more visible as the next property-related requirement, decision or practical step becomes clearer."
      : moonPredictionDirection === "stabilization"
      ? "Property progress may favour strengthening the existing arrangement or practical foundation before pursuing a larger development."
      : moonPredictionDirection === "transition"
      ? "A property matter may begin moving into a new stage as earlier work, decisions or arrangements create the opening for further progress."
      : moonPredictionDirection === "coordination"
      ? "Progress may depend on coordinating documentation, discussions, responsibilities or approvals with the other parties involved."
      : "The property matter may advance gradually through a practical next step that builds on what has already been established."
    : prediction.primaryTheme?.manifestationId === "emotional_stability"
    ? moonPredictionDirection === "completion"
      ? "Greater emotional steadiness may come through resolving an unfinished concern or mentally closing something that has continued to occupy your attention."
      : moonPredictionDirection === "clarification"
      ? "Emotional balance may improve as the source of a feeling, concern or uncertainty becomes easier to understand."
      : moonPredictionDirection === "stabilization"
      ? "The emotional tone may favour returning to familiar routines, steady responses and what already helps you feel grounded."
      : moonPredictionDirection === "transition"
      ? "Your emotional perspective may be shifting as an earlier concern, attachment or way of responding begins giving way to something different."
      : moonPredictionDirection === "coordination"
      ? "Emotional balance may improve through conversation, perspective and bringing your own needs into better alignment with the situation around you."
      : "Emotional steadiness may develop gradually as you give yourself enough space to process what is unfolding without forcing an immediate conclusion."

    : prediction.primaryTheme?.manifestationId === "mental_pressure"
    ? moonPredictionDirection === "completion"
      ? "Mental pressure may be connected with unfinished tasks, decisions or concerns that need to be brought to a manageable conclusion."
      : moonPredictionDirection === "clarification"
      ? "Mental pressure may ease once the specific concern, decision or source of uncertainty demanding your attention becomes clearer."
      : moonPredictionDirection === "stabilization"
      ? "Mental pressure may become easier to manage by reducing unnecessary demands and returning attention to a steady, workable structure."
      : moonPredictionDirection === "transition"
      ? "Mental pressure may reflect a period of adjustment as circumstances, priorities or your understanding of a situation begin to change."
      : moonPredictionDirection === "coordination"
      ? "Some mental pressure may ease through communication, organising competing demands or clarifying expectations with the people involved."
      : "Mental pressure may remain active, but it may become more manageable by dealing with one practical concern at a time rather than trying to resolve everything together."

    : prediction.primaryTheme?.manifestationId === "health_attention"
    ? moonPredictionDirection === "completion"
      ? "A health or wellbeing matter may need attention through completing an existing routine, follow-up or practical step that has already been started."
      : moonPredictionDirection === "clarification"
      ? "A wellbeing concern may become easier to understand as you identify the specific habit, pattern or practical factor that needs attention."
      : moonPredictionDirection === "stabilization"
      ? "Wellbeing may benefit from reinforcing consistent routines, adequate recovery and the habits that already help maintain balance."
      : moonPredictionDirection === "transition"
      ? "Your wellbeing needs may be changing, making it useful to adjust an existing routine or approach as circumstances develop."
      : moonPredictionDirection === "coordination"
      ? "Supporting wellbeing may depend on balancing different demands and coordinating rest, routine and responsibilities more effectively."
      : "A health or wellbeing matter may benefit from steady attention to everyday habits and practical signals rather than waiting for the issue to become more demanding."

        : prediction.primaryTheme?.manifestationId === "travel_disruption"
    ? moonPredictionDirection === "completion"
      ? "A travel disruption may relate to an unfinished arrangement, pending requirement or earlier issue that needs to be resolved before movement can proceed smoothly."
      : moonPredictionDirection === "clarification"
      ? "The reason for a travel difficulty or delay may become clearer as timing, arrangements or missing information are better understood."
      : moonPredictionDirection === "stabilization"
      ? "Travel disruption may be easier to manage by keeping arrangements flexible while protecting the parts of the plan that are already secure."
      : moonPredictionDirection === "transition"
      ? "A disruption may reflect changing travel circumstances that require moving from the original arrangement toward an alternative plan."
      : moonPredictionDirection === "coordination"
      ? "Managing travel disruption may depend on coordinating timings, bookings or arrangements with the other people involved."
      : "Travel disruption may remain manageable through practical adjustments and attention to the specific part of the plan that needs to change."

    : prediction.primaryTheme?.manifestationId === "travel_movement"
    ? moonPredictionDirection === "completion"
      ? "Travel or movement may be connected with completing an existing journey, visit, obligation or previously arranged plan."
      : moonPredictionDirection === "clarification"
      ? "Travel or movement may become more definite as the destination, timing or practical purpose becomes clearer."
      : moonPredictionDirection === "stabilization"
      ? "Travel may favour established arrangements, familiar routes or plans that already have a reliable practical foundation."
      : moonPredictionDirection === "transition"
      ? "Travel or movement may accompany a broader transition as circumstances take you from one situation, place or stage into another."
      : moonPredictionDirection === "coordination"
      ? "Travel progress may depend on coordinating timings, logistics or arrangements with other people."
      : "Travel or movement may develop through a practical opportunity or arrangement that gradually becomes more definite."

    : prediction.primaryTheme?.manifestationId === "travel_planning"
    ? moonPredictionDirection === "completion"
      ? "Travel planning may favour finalising an existing itinerary, booking or pending arrangement before considering additional options."
      : moonPredictionDirection === "clarification"
      ? "Travel plans may become clearer as timing, destination, logistics or the purpose of the journey are better defined."
      : moonPredictionDirection === "stabilization"
      ? "Travel planning may favour securing the essential arrangements first and building the rest of the plan around a reliable foundation."
      : moonPredictionDirection === "transition"
      ? "Travel plans may begin changing as new circumstances or priorities shift the journey toward a different arrangement."
      : moonPredictionDirection === "coordination"
      ? "Progress with travel planning may depend on aligning schedules, bookings or practical preferences with the other people involved."
      : "Travel planning may develop steadily as practical details are organised and the next part of the journey becomes more definite."
    : prediction.primaryTheme?.manifestationId === "spiritual_detachment"
    ? moonPredictionDirection === "completion"
      ? "A sense of detachment may help you bring an emotional, mental or personal matter to closure rather than continuing to carry it forward."
      : moonPredictionDirection === "clarification"
      ? "Stepping back from immediate reactions may help you see a situation more clearly and recognise what genuinely deserves your energy."
      : moonPredictionDirection === "stabilization"
      ? "Detachment may create greater inner steadiness by helping you maintain perspective without becoming overly absorbed in temporary circumstances."
      : moonPredictionDirection === "transition"
      ? "A growing sense of detachment may reflect an inner transition as an earlier attachment, expectation or way of seeing something begins to loosen."
      : moonPredictionDirection === "coordination"
      ? "Inner balance may improve by recognising where involvement is useful and where allowing others space creates a healthier perspective."
      : "A more detached perspective may develop gradually, helping you engage with circumstances without becoming unnecessarily consumed by them."

    : prediction.primaryTheme?.manifestationId === "spiritual_guidance"
    ? moonPredictionDirection === "completion"
      ? "Spiritual guidance may help you understand what needs to be completed, released or brought to a meaningful conclusion."
      : moonPredictionDirection === "clarification"
      ? "Guidance may become more meaningful as it helps clarify a question, uncertainty or deeper concern that has been occupying your attention."
      : moonPredictionDirection === "stabilization"
      ? "Spiritual guidance may reinforce principles, practices or perspectives that already provide a dependable source of inner stability."
      : moonPredictionDirection === "transition"
      ? "Guidance may become especially relevant while you are moving through a change in perspective, priorities or personal direction."
      : moonPredictionDirection === "coordination"
      ? "Useful guidance may emerge through conversation, shared reflection or bringing different perspectives into a more balanced understanding."
      : "Spiritual guidance may emerge gradually through reflection, experience or an interaction that gives greater meaning to what is developing."

    : prediction.primaryTheme?.manifestationId === "spiritual_introspection"
    ? moonPredictionDirection === "completion"
      ? "Introspection may help you recognise what is ready to be concluded, released or mentally put behind you."
      : moonPredictionDirection === "clarification"
      ? "Reflection may bring greater clarity around an underlying feeling, motivation or question that has not yet been fully understood."
      : moonPredictionDirection === "stabilization"
      ? "Quiet reflection may help restore inner steadiness by reconnecting you with the principles and perspectives that keep you grounded."
      : moonPredictionDirection === "transition"
      ? "Introspection may reveal that an inner attitude, attachment or personal perspective is beginning to change."
      : moonPredictionDirection === "coordination"
      ? "Reflection may help reconcile different feelings, priorities or perspectives that have been competing for your attention."
      : "Introspection may gradually reveal a deeper understanding of what you are experiencing and why it currently matters."

    : prediction.primaryTheme?.manifestationId === "spiritual_learning"
    ? moonPredictionDirection === "completion"
      ? "Spiritual learning may help consolidate an existing lesson or understanding before your attention moves toward another area of study."
      : moonPredictionDirection === "clarification"
      ? "A teaching, concept or spiritual principle may become easier to understand as its practical meaning becomes clearer."
      : moonPredictionDirection === "stabilization"
      ? "Spiritual learning may be most useful when it strengthens an existing foundation rather than continually introducing new ideas."
      : moonPredictionDirection === "transition"
      ? "Your spiritual learning may begin moving toward a different teaching, perspective or stage of understanding."
      : moonPredictionDirection === "coordination"
      ? "Greater understanding may come from comparing teachings, discussing ideas or connecting different parts of what you have already learned."
      : "Spiritual understanding may deepen gradually as an existing teaching or idea becomes more relevant to your present circumstances."

    : prediction.primaryTheme?.manifestationId === "spiritual_practice"
    ? moonPredictionDirection === "completion"
      ? "Spiritual practice may support closure by helping you process, release or complete something that has remained mentally or emotionally active."
      : moonPredictionDirection === "clarification"
      ? "Prayer, meditation or reflection may help bring greater clarity to a question or concern that has been difficult to understand."
      : moonPredictionDirection === "stabilization"
      ? "Spiritual practice may be especially supportive when approached consistently, reinforcing the inner steadiness created by an established routine."
      : moonPredictionDirection === "transition"
      ? "Your spiritual practice may help you navigate a period of change by creating continuity while other circumstances are shifting."
      : moonPredictionDirection === "coordination"
      ? "Spiritual practice may help bring different thoughts, emotions and responsibilities into a more balanced inner perspective."
      : "Spiritual practice may deepen through simple consistency rather than intensity, allowing its effect to build naturally through the day."

       : prediction.primaryTheme?.manifestationId === "public_image_pressure"
    ? moonPredictionDirection === "completion"
      ? "Pressure around your public or professional image may centre on completing an existing responsibility or resolving something that remains visible to others."
      : moonPredictionDirection === "clarification"
      ? "Pressure around how you are perceived may ease as expectations, responsibilities or the issue affecting your visibility become clearer."
      : moonPredictionDirection === "stabilization"
      ? "Your public position may benefit from consistency and measured responses rather than trying to change how others perceive the situation immediately."
      : moonPredictionDirection === "transition"
      ? "Pressure around your public image may accompany a changing role, responsibility or situation that is altering how others see your position."
      : moonPredictionDirection === "coordination"
      ? "Managing public-image pressure may depend on communication, aligning expectations and ensuring that your contribution is understood by the people involved."
      : "Pressure around visibility or reputation may become more manageable by focusing on practical responsibilities rather than reacting to every external response."

    : prediction.primaryTheme?.manifestationId === "public_image_recognition"
    ? moonPredictionDirection === "completion"
      ? "Recognition may arise from completing an important responsibility, delivering a visible result or bringing an existing effort to a strong conclusion."
      : moonPredictionDirection === "clarification"
      ? "Your contribution may become more clearly recognised as its value, purpose or impact becomes easier for others to see."
      : moonPredictionDirection === "stabilization"
      ? "Recognition may develop through consistency and by reinforcing the credibility or reputation you have already established."
      : moonPredictionDirection === "transition"
      ? "Greater recognition may accompany a change in role, responsibility or public position as your contribution becomes visible in a different context."
      : moonPredictionDirection === "coordination"
      ? "Recognition may develop through collaboration, communication or the way your contribution supports a wider objective."
      : "Recognition may build gradually as continued effort and practical results make your contribution increasingly visible."

    : prediction.primaryTheme?.manifestationId === "public_image_visibility"
    ? moonPredictionDirection === "completion"
      ? "Greater visibility may come through completing or presenting something that has already required sustained effort or responsibility."
      : moonPredictionDirection === "clarification"
      ? "Your role or contribution may become more visible as others gain a clearer understanding of what you are doing or responsible for."
      : moonPredictionDirection === "stabilization"
      ? "Visibility may increase through consistent performance and strengthening the position or reputation you already hold."
      : moonPredictionDirection === "transition"
      ? "Your visibility may increase as a changing role, responsibility or circumstance places you in a different public or professional position."
      : moonPredictionDirection === "coordination"
      ? "Greater visibility may develop through collaboration, communication or involvement with a wider group of people."
      : "Your contribution may become increasingly visible as practical developments bring greater attention to your role or work."

    : prediction.primaryTheme?.manifestationId === "hidden_matters_complication"
    ? moonPredictionDirection === "completion"
      ? "A complication involving something unclear or previously unresolved may require an unfinished matter to be addressed before the situation can properly close."
      : moonPredictionDirection === "clarification"
      ? "The complication may become easier to understand as missing information, an overlooked detail or the underlying issue begins to emerge."
      : moonPredictionDirection === "stabilization"
      ? "The situation may be easier to manage by protecting what is already stable while investigating the uncertain part carefully."
      : moonPredictionDirection === "transition"
      ? "The complication may reflect circumstances changing beneath the surface, requiring adjustment as previously unclear information begins to alter the situation."
      : moonPredictionDirection === "coordination"
      ? "Resolving the complication may depend on gathering information, comparing perspectives or coordinating carefully with the people involved."
      : "The complication may become more manageable as the underlying issue develops enough to show where practical attention is actually required."

    : prediction.primaryTheme?.manifestationId === "hidden_matters_introspection"
    ? moonPredictionDirection === "completion"
      ? "Looking beneath the surface may help you recognise what is ready to be concluded, released or mentally put behind you."
      : moonPredictionDirection === "clarification"
      ? "Introspection may reveal an underlying motivation, concern or pattern that was not previously easy to recognise."
      : moonPredictionDirection === "stabilization"
      ? "Deeper reflection may help restore perspective by separating temporary uncertainty from what remains genuinely stable."
      : moonPredictionDirection === "transition"
      ? "Introspection may reveal that an underlying attitude, attachment or personal concern is beginning to change."
      : moonPredictionDirection === "coordination"
      ? "Greater understanding may come from reconciling different feelings, motives or pieces of information that initially seemed disconnected."
      : "Looking beneath the immediate situation may gradually reveal why a particular concern or pattern currently deserves your attention."

    : prediction.primaryTheme?.manifestationId === "hidden_matters_revelation"
    ? moonPredictionDirection === "completion"
      ? "New information may help bring an unresolved matter toward closure by revealing what was previously missing or unclear."
      : moonPredictionDirection === "clarification"
      ? "Something previously uncertain or overlooked may become easier to understand as an important detail or underlying fact comes into view."
      : moonPredictionDirection === "stabilization"
      ? "What becomes visible may help you establish a firmer understanding of the situation before deciding whether anything needs to change."
      : moonPredictionDirection === "transition"
      ? "A revelation may change your understanding of the situation and begin moving circumstances toward a different phase or direction."
      : moonPredictionDirection === "coordination"
      ? "The fuller picture may emerge by connecting different pieces of information, conversations or perspectives."
      : "Something previously unclear may gradually become more visible as developments reveal information that changes your understanding of the matter."
        : propertyManifestationType === "property_attention"
    ? moonThemeDirection === "complete"
      ? "Complete the outstanding property-related task or decision before opening another matter."
      : moonThemeDirection === "clarify"
      ? "Clarify the property detail, document or practical requirement that needs attention first."
      : moonThemeDirection === "stabilize"
      ? "Strengthen the practical foundation of the property matter before considering further changes."
      : moonThemeDirection === "transition"
      ? "Take the next practical step if the property matter is beginning to move into a different stage."
      : moonThemeDirection === "coordinate"
      ? "Coordinate the property details, responsibilities or expectations with the other people involved."
      : "Give focused practical attention to the property matter that can move forward today."

    : propertyManifestationType === "property_complication"
    ? moonThemeDirection === "complete"
      ? "Resolve the outstanding property issue that is preventing the matter from reaching closure."
      : moonThemeDirection === "clarify"
      ? "Identify the exact source of the property complication before deciding how to respond."
      : moonThemeDirection === "stabilize"
      ? "Protect the existing property arrangement while dealing carefully with the complication."
      : moonThemeDirection === "transition"
      ? "Adjust the property plan if the complication shows that the existing approach needs to change."
      : moonThemeDirection === "coordinate"
      ? "Clarify responsibilities and work with the other parties involved to resolve the property issue."
      : "Address the property complication through one practical step rather than trying to solve everything at once."

    : propertyManifestationType === "property_progress"
    ? moonThemeDirection === "complete"
      ? "Complete the pending property step that can bring the matter closer to resolution."
      : moonThemeDirection === "clarify"
      ? "Confirm the details required for the property matter to continue progressing."
      : moonThemeDirection === "stabilize"
      ? "Consolidate the progress already made before expanding or changing the property plan."
      : moonThemeDirection === "transition"
      ? "Take the next practical step as the property matter moves into a new stage."
      : moonThemeDirection === "coordinate"
      ? "Coordinate with the relevant people so the property matter can continue moving forward."
      : "Build on the property progress already developing through a practical next step."

    : mindManifestationType === "emotional_stability"
    ? moonThemeDirection === "complete"
      ? "Give yourself space to process and release the emotional matter that has already run its course."
      : moonThemeDirection === "clarify"
      ? "Identify what is genuinely affecting your emotional state before reacting to temporary feelings."
      : moonThemeDirection === "stabilize"
      ? "Protect the routines and boundaries that help you remain emotionally steady."
      : moonThemeDirection === "transition"
      ? "Allow your emotional response to adjust as circumstances begin moving into a different phase."
      : moonThemeDirection === "coordinate"
      ? "Communicate what you need clearly rather than carrying emotional pressure alone."
      : "Give your emotional state steady attention without allowing temporary feelings to direct the day."

    : mindManifestationType === "mental_pressure"
    ? moonThemeDirection === "complete"
      ? "Finish or resolve the pending matter contributing most directly to your mental pressure."
      : moonThemeDirection === "clarify"
      ? "Separate the genuine priority from the thoughts that are simply adding mental noise."
      : moonThemeDirection === "stabilize"
      ? "Reduce unnecessary demands and create a more structured pace for the important tasks."
      : moonThemeDirection === "transition"
      ? "Adjust your approach if the source of mental pressure is changing or an old method is no longer helping."
      : moonThemeDirection === "coordinate"
      ? "Clarify expectations with others where uncertainty or competing demands are adding pressure."
      : "Reduce the mental load by dealing with one practical priority at a time."

    : healthManifestationType === "health_attention"
    ? moonThemeDirection === "complete"
      ? "Follow through on the health-related routine, check or responsibility that already needs attention."
      : moonThemeDirection === "clarify"
      ? "Pay attention to what your body is actually signalling and distinguish it from temporary discomfort or worry."
      : moonThemeDirection === "stabilize"
      ? "Prioritise consistency in the routines that support your physical wellbeing."
      : moonThemeDirection === "transition"
      ? "Adjust your routine gradually if your body's needs or circumstances are changing."
      : moonThemeDirection === "coordinate"
      ? "Keep any relevant health routine, appointment or support properly coordinated."
      : "Give your physical wellbeing practical attention through a manageable supportive step."

    : travelManifestationType === "travel_disruption"
    ? moonThemeDirection === "complete"
      ? "Resolve the outstanding travel arrangement that is creating uncertainty before adding further plans."
      : moonThemeDirection === "clarify"
      ? "Confirm timings, bookings and practical details before relying on the current travel plan."
      : moonThemeDirection === "stabilize"
      ? "Keep the travel plan simple and protect the arrangements that are already confirmed."
      : moonThemeDirection === "transition"
      ? "Adjust the travel arrangement calmly if circumstances require a different route, timing or plan."
      : moonThemeDirection === "coordinate"
      ? "Confirm changes with everyone involved so the travel disruption remains manageable."
      : "Respond to any travel disruption through practical adjustments rather than rushed decisions."

    : travelManifestationType === "travel_movement"
    ? moonThemeDirection === "complete"
      ? "Complete the journey or travel-related responsibility already underway before adding another commitment."
      : moonThemeDirection === "clarify"
      ? "Confirm the purpose, timing and essential details of the movement before proceeding."
      : moonThemeDirection === "stabilize"
      ? "Keep the travel arrangements organised and rely on the most dependable plan."
      : moonThemeDirection === "transition"
      ? "Use the movement or journey as the practical next step into the situation that is beginning to change."
      : moonThemeDirection === "coordinate"
      ? "Coordinate timings and responsibilities with the other people involved in the journey."
      : "Keep the travel or movement practical and organised so it supports the day's larger priority."

    : travelManifestationType === "travel_planning"
    ? moonThemeDirection === "complete"
      ? "Finalise the outstanding travel detail before expanding the itinerary or making additional arrangements."
      : moonThemeDirection === "clarify"
      ? "Confirm the important travel details before committing to the plan."
      : moonThemeDirection === "stabilize"
      ? "Build the travel plan around dependable arrangements before adding optional elements."
      : moonThemeDirection === "transition"
      ? "Update the travel plan if changing circumstances now require a different arrangement."
      : moonThemeDirection === "coordinate"
      ? "Align dates, timings and responsibilities with everyone involved before finalising the plan."
      : "Develop the travel plan through practical details rather than trying to settle everything at once."
        : propertyManifestationType === "property_attention"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid rushing an important property decision before the practical details are checked."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming the property details or responsibilities are settled without confirming them."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid trying to deal with several property matters when one priority needs focused attention."
      : "Avoid allowing a property matter that needs attention to remain vague or unnecessarily delayed."

    : propertyManifestationType === "property_complication"
    ? moonCautionDirection === "avoid_reactivity"
      ? "Avoid reacting to a property complication before understanding its practical consequences."
      : moonCautionDirection === "avoid_rushing"
      ? "Avoid making a rushed property decision simply because a complication has appeared."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming the cause or outcome of the property issue before the details are verified."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning a manageable property complication into unnecessary pressure."
      : "Avoid making the property issue more difficult by acting before the practical facts are clear."

    : propertyManifestationType === "property_progress"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid pushing the property matter ahead faster than the practical arrangements can support."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid expanding the property plan simply because some progress has already been made."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid treating progress as final until the relevant property details are confirmed."
      : "Avoid undermining useful property progress through unnecessary changes or additional complexity."

    : mindManifestationType === "emotional_stability"
    ? moonCautionDirection === "avoid_reactivity"
      ? "Avoid allowing a temporary emotional reaction to determine an important decision."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid placing unnecessary pressure on yourself to resolve every feeling immediately."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid treating a temporary feeling as proof of what another person or situation means."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid analysing every emotional response until it becomes harder to regain perspective."
      : "Avoid giving temporary emotions more influence than the situation requires."

    : mindManifestationType === "mental_pressure"
    ? moonCautionDirection === "avoid_overextension"
      ? "Avoid taking on additional demands while your mental attention is already stretched."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning every pending responsibility into something that must be solved immediately."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid repeatedly analysing the same issue when a reasonable next step is already available."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid responding under mental pressure before giving yourself enough space to think clearly."
      : "Avoid allowing too many competing concerns to occupy your attention at the same time."

    : healthManifestationType === "health_attention"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid rushing changes to your routine simply because you want an immediate improvement."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid pushing yourself beyond what your energy and physical condition reasonably support today."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning attention to wellbeing into another source of pressure."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid making assumptions about a health concern when proper clarification may be needed."
      : "Avoid ignoring physical signals or placing unnecessary strain on your wellbeing."

    : travelManifestationType === "travel_disruption"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid making a rushed travel decision simply because the original arrangement has changed."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid allowing frustration about a travel disruption to affect the practical response."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming revised timings or arrangements until they have been confirmed."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing one travel disruption to unsettle arrangements that are still working."
      : "Avoid making the travel situation more difficult through unnecessary last-minute changes."

    : travelManifestationType === "travel_movement"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid rushing the journey or movement when practical timing and organisation matter."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid relying on travel details that have not been properly confirmed."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid adding unnecessary travel commitments when the existing movement already requires attention."
      : "Avoid allowing poor organisation to create unnecessary difficulty around travel or movement."

    : travelManifestationType === "travel_planning"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid committing to a travel plan before the essential details are confirmed."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid delaying a workable travel plan while trying to perfect every detail."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming dates, availability or arrangements without checking them."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid adding too many optional elements before the essential travel plan is secure."
      : "Avoid building the travel plan around uncertain or unconfirmed arrangements."
          : spiritualityManifestationType === "spiritual_detachment"
    ? moonThemeDirection === "complete"
      ? "Release the attachment, expectation or concern that has already served its purpose."
      : moonThemeDirection === "clarify"
      ? "Identify what genuinely needs to be released rather than withdrawing from the situation entirely."
      : moonThemeDirection === "stabilize"
      ? "Create enough inner distance to respond calmly without becoming disconnected from practical responsibilities."
      : moonThemeDirection === "transition"
      ? "Allow an old attachment or expectation to loosen as your perspective begins to change."
      : moonThemeDirection === "coordinate"
      ? "Balance inner detachment with the responsibilities and relationships that still require your involvement."
      : "Create some inner distance from what you cannot control and direct attention toward what remains meaningful."

    : spiritualityManifestationType === "spiritual_guidance"
    ? moonThemeDirection === "complete"
      ? "Apply the guidance you have already received before searching for another answer."
      : moonThemeDirection === "clarify"
      ? "Reflect on the guidance available and identify what is genuinely relevant to your present situation."
      : moonThemeDirection === "stabilize"
      ? "Return to the spiritual principle or practice that already gives you reliable perspective."
      : moonThemeDirection === "transition"
      ? "Remain open to guidance that helps you understand the direction of the change now developing."
      : moonThemeDirection === "coordinate"
      ? "Balance inner guidance with practical discussion or advice from people you trust."
      : "Use spiritual guidance as a source of perspective and translate it into one practical step."

    : spiritualityManifestationType === "spiritual_introspection"
    ? moonThemeDirection === "complete"
      ? "Bring reflection on the existing issue toward a conclusion and carry the insight into practical life."
      : moonThemeDirection === "clarify"
      ? "Use quiet reflection to understand what is actually driving your thoughts, reactions or choices."
      : moonThemeDirection === "stabilize"
      ? "Create a calm and consistent space for reflection rather than searching for immediate answers."
      : moonThemeDirection === "transition"
      ? "Reflect on what you may need to leave behind as your perspective begins to change."
      : moonThemeDirection === "coordinate"
      ? "Balance private reflection with a constructive conversation if another viewpoint would help."
      : "Give yourself enough quiet reflection to recognise the lesson or pattern developing beneath the surface."

    : spiritualityManifestationType === "spiritual_learning"
    ? moonThemeDirection === "complete"
      ? "Complete the teaching, text or spiritual lesson already under study before moving to another subject."
      : moonThemeDirection === "clarify"
      ? "Focus on understanding one spiritual principle deeply rather than collecting more information."
      : moonThemeDirection === "stabilize"
      ? "Strengthen your understanding through consistent study and practical application."
      : moonThemeDirection === "transition"
      ? "Allow new learning to reshape an older belief or perspective where necessary."
      : moonThemeDirection === "coordinate"
      ? "Discuss what you are learning with a teacher, mentor or trusted person to deepen your understanding."
      : "Develop your spiritual understanding through focused study and practical reflection."

    : spiritualityManifestationType === "spiritual_practice"
    ? moonThemeDirection === "complete"
      ? "Complete the spiritual practice or commitment you have already undertaken before adding another."
      : moonThemeDirection === "clarify"
      ? "Return to the practice that genuinely helps you regain clarity and perspective."
      : moonThemeDirection === "stabilize"
      ? "Prioritise consistency in your spiritual practice rather than intensity."
      : moonThemeDirection === "transition"
      ? "Allow your spiritual routine to evolve if your present circumstances require a different approach."
      : moonThemeDirection === "coordinate"
      ? "Create a practical balance between spiritual practice and the responsibilities that also need your attention."
      : "Give your spiritual practice steady attention and allow insight to develop naturally."

    : publicImageManifestationType === "public_image_pressure"
    ? moonThemeDirection === "complete"
      ? "Resolve the outstanding responsibility contributing most directly to the pressure around how you are being perceived."
      : moonThemeDirection === "clarify"
      ? "Separate genuine external expectations from pressure you may be placing on yourself."
      : moonThemeDirection === "stabilize"
      ? "Maintain consistency in your conduct and let dependable actions support your reputation."
      : moonThemeDirection === "transition"
      ? "Adjust how you present your role or responsibilities if external expectations are beginning to change."
      : moonThemeDirection === "coordinate"
      ? "Clarify expectations with the relevant people rather than trying to manage public perception indirectly."
      : "Focus on the responsibility itself and allow your actions to shape how others perceive the situation."

    : publicImageManifestationType === "public_image_recognition"
    ? moonThemeDirection === "complete"
      ? "Use the recognition around your work or contribution to bring the existing responsibility to a strong conclusion."
      : moonThemeDirection === "clarify"
      ? "Understand what is actually being recognised and how you can build on it constructively."
      : moonThemeDirection === "stabilize"
      ? "Support positive recognition through consistent performance rather than trying to amplify it."
      : moonThemeDirection === "transition"
      ? "Use the recognition as a foundation for the next stage of responsibility or visibility."
      : moonThemeDirection === "coordinate"
      ? "Acknowledge the contribution of others where recognition has resulted from shared effort."
      : "Build on positive recognition through dependable action and continued follow-through."

    : publicImageManifestationType === "public_image_visibility"
    ? moonThemeDirection === "complete"
      ? "Use the increased visibility to complete or communicate the work already requiring attention."
      : moonThemeDirection === "clarify"
      ? "Be clear about the message, contribution or responsibility you want your visibility to represent."
      : moonThemeDirection === "stabilize"
      ? "Maintain a consistent and dependable presence rather than trying to attract additional attention."
      : moonThemeDirection === "transition"
      ? "Use greater visibility carefully as your role or circumstances begin moving into a new stage."
      : moonThemeDirection === "coordinate"
      ? "Align your communication with the people involved so increased visibility supports the shared objective."
      : "Use increased visibility constructively by keeping attention on the work or contribution that matters."

    : hiddenMattersManifestationType === "hidden_matters_complication"
    ? moonThemeDirection === "complete"
      ? "Resolve the outstanding issue that is keeping the underlying matter complicated or unresolved."
      : moonThemeDirection === "clarify"
      ? "Establish the facts before deciding what the hidden or unclear situation actually means."
      : moonThemeDirection === "stabilize"
      ? "Protect what is already secure while you deal carefully with the uncertain part of the situation."
      : moonThemeDirection === "transition"
      ? "Adjust your approach as previously unclear information begins changing your understanding of the situation."
      : moonThemeDirection === "coordinate"
      ? "Clarify the matter with the relevant person where direct communication can reduce uncertainty."
      : "Address the unclear matter through careful practical investigation rather than speculation."

    : hiddenMattersManifestationType === "hidden_matters_introspection"
    ? moonThemeDirection === "complete"
      ? "Bring your reflection on the underlying issue toward a conclusion and decide what practical lesson to carry forward."
      : moonThemeDirection === "clarify"
      ? "Look beneath the immediate reaction and identify the deeper concern, motive or pattern requiring attention."
      : moonThemeDirection === "stabilize"
      ? "Give yourself enough quiet perspective to understand the issue without becoming absorbed by it."
      : moonThemeDirection === "transition"
      ? "Use deeper reflection to recognise what internal pattern or expectation may now be changing."
      : moonThemeDirection === "coordinate"
      ? "Balance private reflection with an honest conversation if another perspective would help."
      : "Use introspection to understand the deeper pattern while remaining connected to practical reality."

    : hiddenMattersManifestationType === "hidden_matters_revelation"
    ? moonThemeDirection === "complete"
      ? "Use what has become clear to resolve the outstanding matter rather than reopening what is already understood."
      : moonThemeDirection === "clarify"
      ? "Verify what has emerged and distinguish useful information from interpretation or assumption."
      : moonThemeDirection === "stabilize"
      ? "Allow the new information to settle before changing an arrangement that is otherwise stable."
      : moonThemeDirection === "transition"
      ? "Use the newly revealed information to adjust your direction where the situation genuinely requires change."
      : moonThemeDirection === "coordinate"
      ? "Discuss what has emerged with the relevant person where shared understanding is important."
      : "Use the new information carefully and allow it to guide the next practical decision."
          : spiritualityManifestationType === "spiritual_detachment"
    ? moonCautionDirection === "avoid_rigidity"
      ? "Avoid turning detachment into a rigid refusal to engage with responsibilities that still matter."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid withdrawing simply because a situation has become emotionally uncomfortable."
      : moonCautionDirection === "avoid_drift"
      ? "Avoid becoming so detached that you lose sight of the practical direction still required."
      : "Avoid confusing healthy detachment with avoidance or indifference."

    : spiritualityManifestationType === "spiritual_guidance"
    ? moonCautionDirection === "avoid_assumptions"
      ? "Avoid treating every impression or coincidence as guidance without applying discernment."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid searching for repeated confirmation when the useful lesson is already reasonably clear."
      : moonCautionDirection === "avoid_drift"
      ? "Avoid collecting guidance without translating any of it into practical direction."
      : "Avoid looking for external guidance simply to avoid making a reasonable decision yourself."

    : spiritualityManifestationType === "spiritual_introspection"
    ? moonCautionDirection === "avoid_overanalysis"
      ? "Avoid turning useful introspection into endless analysis of every thought or feeling."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid treating an emotional reaction as a final spiritual insight."
      : moonCautionDirection === "avoid_drift"
      ? "Avoid remaining in reflection so long that the practical next step becomes unclear."
      : "Avoid allowing introspection to become withdrawal from practical responsibilities."

    : spiritualityManifestationType === "spiritual_learning"
    ? moonCautionDirection === "avoid_overextension"
      ? "Avoid consuming too many teachings at once when one principle needs deeper understanding."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid analysing spiritual ideas so extensively that practical application is lost."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid accepting an interpretation without understanding the principle behind it."
      : "Avoid collecting spiritual information without applying what you are learning."

    : spiritualityManifestationType === "spiritual_practice"
    ? moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning spiritual practice into another obligation measured by pressure or perfection."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid adding more practices when consistency with the existing one would be more useful."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid becoming so rigid about the form of the practice that its purpose is lost."
      : "Avoid measuring spiritual practice only by intensity rather than consistency and awareness."

    : publicImageManifestationType === "public_image_pressure"
    ? moonCautionDirection === "avoid_reactivity"
      ? "Avoid reacting defensively simply because you feel observed, evaluated or misunderstood."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid allowing pride to make public perception more important than the responsibility itself."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid placing unnecessary pressure on yourself to control how everyone perceives you."
      : "Avoid making decisions primarily to manage appearances rather than the underlying responsibility."

    : publicImageManifestationType === "public_image_recognition"
    ? moonCautionDirection === "avoid_pride"
      ? "Avoid allowing recognition to become a reason to overstate your role or contribution."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid taking on additional commitments simply because your work is receiving positive attention."
      : moonCautionDirection === "avoid_rushing"
      ? "Avoid rushing toward the next opportunity before consolidating what produced the recognition."
      : "Avoid allowing positive recognition to distract you from the consistency that created it."

    : publicImageManifestationType === "public_image_visibility"
    ? moonCautionDirection === "avoid_pride"
      ? "Avoid allowing increased visibility to shift attention from the work toward the need to be noticed."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid reacting impulsively to feedback simply because your actions are receiving more attention."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid accepting every opportunity that appears simply because visibility has increased."
      : "Avoid creating unnecessary attention around something that benefits from measured visibility."

    : hiddenMattersManifestationType === "hidden_matters_complication"
    ? moonCautionDirection === "avoid_assumptions"
      ? "Avoid filling gaps in an unclear situation with assumptions before the facts are available."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid reacting strongly to incomplete information before understanding the underlying issue."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid searching endlessly for hidden explanations when the practical facts already provide enough direction."
      : "Avoid making an unclear situation more complicated through speculation."

    : hiddenMattersManifestationType === "hidden_matters_introspection"
    ? moonCautionDirection === "avoid_overanalysis"
      ? "Avoid becoming so absorbed in the deeper meaning that the practical reality of the situation is overlooked."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming every internal concern reflects an external reality."
      : moonCautionDirection === "avoid_drift"
      ? "Avoid remaining in private reflection without identifying what practical insight should come from it."
      : "Avoid allowing introspection to turn into unnecessary suspicion or mental complexity."

    : hiddenMattersManifestationType === "hidden_matters_revelation"
    ? moonCautionDirection === "avoid_reactivity"
      ? "Avoid reacting immediately to newly revealed information before understanding its full context."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming that one new piece of information explains the entire situation."
      : moonCautionDirection === "avoid_rushing"
      ? "Avoid making an immediate decision simply because something previously unclear has now emerged."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid overturning a stable arrangement until the significance of the new information is properly understood."
      : "Avoid treating newly revealed information as more conclusive than the evidence supports."

    : null;
const contextualMoonAction =
  moneyManifestationType === "money_inflow"
    ? moonThemeDirection === "complete"
      ? "Complete any outstanding step connected with an expected payment or receipt."
      : moonThemeDirection === "clarify"
      ? "Confirm the details or status of an expected payment before making further plans."
      : moonThemeDirection === "stabilize"
      ? "Keep the expected funds separate from new commitments until the receipt is confirmed."
      : moonThemeDirection === "transition"
      ? "Consider how an incoming payment could support the next practical financial priority."
      : moonThemeDirection === "coordinate"
      ? "Confirm any payment details, responsibilities or expectations with the other party."
      : "Use any financial progress to strengthen your next practical step."
          : moneyManifestationType === "money_accumulation"
    ? moonThemeDirection === "complete"
      ? "Complete the saving or allocation step that will strengthen your financial reserves."
      : moonThemeDirection === "clarify"
      ? "Review where your money is being held or allocated before making another financial commitment."
      : moonThemeDirection === "stabilize"
      ? hasMoonPadaTheme("consolidation", "resources", "material growth")
        ? "Consolidate your existing resources and strengthen your financial reserves before expanding further."
        : "Protect what you have already accumulated and keep your financial priorities structured."
      : moonThemeDirection === "transition"
      ? "Adjust how your resources are allocated if your financial priorities are changing."
      : moonThemeDirection === "coordinate"
      ? "Clarify any shared saving, contribution or financial responsibility before committing more resources."
      : "Build steadily on the financial resources you have already created."
          : moneyManifestationType === "money_outflow"
    ? moonThemeDirection === "complete"
      ? "Clear the financial obligation that genuinely needs to be settled before taking on another expense."
      : moonThemeDirection === "clarify"
      ? "Check the amount, purpose and necessity of the expense before releasing the money."
      : moonThemeDirection === "stabilize"
      ? hasMoonPadaTheme("consolidation", "resources", "material growth")
        ? "Protect your available resources and keep non-essential spending contained."
        : "Keep expenses structured and prioritise the obligations that genuinely need attention."
      : moonThemeDirection === "transition"
      ? "Adjust your spending priorities if a changing situation is creating new financial demands."
      : moonThemeDirection === "coordinate"
      ? "Confirm any shared payment, contribution or financial responsibility before making the payment."
      : "Keep the financial outflow purposeful and avoid spending beyond the immediate requirement."
          : moneyManifestationType === "money_planning"
    ? moonThemeDirection === "complete"
      ? "Finish the financial review or decision already in progress before opening another money matter."
      : moonThemeDirection === "clarify"
      ? "Review the numbers and assumptions behind your financial plan before making the next decision."
      : moonThemeDirection === "stabilize"
      ? hasMoonPadaTheme("consolidation", "resources", "material growth")
        ? "Strengthen the existing financial plan and available resources before considering expansion."
        : "Organise your financial priorities into a clear and manageable structure."
      : moonThemeDirection === "transition"
      ? "Update your financial plan to reflect the priorities or circumstances that are now changing."
      : moonThemeDirection === "coordinate"
      ? "Align any shared financial expectations or responsibilities before finalising the plan."
      : "Use the current financial picture to define the next practical priority."
          : moneyManifestationType === "money_settlement"
    ? moonThemeDirection === "complete"
      ? "Bring the pending financial settlement to closure by completing the step that is still outstanding."
      : moonThemeDirection === "clarify"
      ? "Confirm the amount, terms and remaining obligations before finalising the financial settlement."
      : moonThemeDirection === "stabilize"
      ? hasMoonPadaTheme("consolidation", "resources", "material growth")
        ? "Secure the terms of the settlement so that they strengthen your financial position rather than create another obligation."
        : "Keep the settlement structured and make sure each financial responsibility is clearly accounted for."
      : moonThemeDirection === "transition"
      ? "Use the settlement to close the existing financial matter and prepare for the next financial priority."
      : moonThemeDirection === "coordinate"
      ? "Confirm the settlement terms and responsibilities with the other party before treating the matter as resolved."
      : "Move the financial settlement toward a clear and practical resolution."
          : childrenManifestationType === "children_attention"
    ? moonThemeDirection === "complete"
      ? "Give attention to the matter involving your child that has been left unfinished before smaller concerns take priority."
      : moonThemeDirection === "clarify"
      ? "Understand what your child actually needs today before deciding how best to respond."
      : moonThemeDirection === "stabilize"
      ? hasMoonPadaTheme("structured progress", "practical judgement")
        ? "Give your child focused support through one practical action that addresses the immediate need."
        : hasMoonPadaTheme("consolidation", "resources", "material growth")
        ? "Strengthen the support and routine already helping your child rather than introducing unnecessary changes."
        : "Give your child steady attention and deal with the most important need one step at a time."
      : moonThemeDirection === "transition"
      ? "Pay attention to what may be changing for your child and adjust your support to the situation developing now."
      : moonThemeDirection === "coordinate"
      ? "Talk with your child or the people involved and make sure you understand what currently needs attention."
      : "Give meaningful attention to your child's immediate need and respond in a practical, supportive way."
          : childrenManifestationType === "children_concern"
    ? moonThemeDirection === "complete"
      ? "Deal with the unresolved matter concerning your child before allowing the worry to carry forward."
      : moonThemeDirection === "clarify"
      ? "Find out what is actually happening with your child before allowing concern to turn into assumptions."
      : moonThemeDirection === "stabilize"
      ? hasMoonPadaTheme("structured progress", "practical judgement")
        ? "Address the concern through one practical step and observe the situation before deciding what else is needed."
        : hasMoonPadaTheme("consolidation", "resources", "material growth")
        ? "Maintain the routines and support that give your child stability while you assess the concern."
        : "Keep your response calm and structured while giving the matter the attention it needs."
      : moonThemeDirection === "transition"
      ? "Consider whether the concern reflects a change your child is going through and adjust your support accordingly."
      : moonThemeDirection === "coordinate"
      ? "Speak with your child or the relevant person involved so you have a clearer picture before deciding what to do."
      : "Give the concern appropriate attention while focusing on what you can practically do to support your child."
          : childrenManifestationType === "children_milestone"
    ? moonThemeDirection === "complete"
      ? "Help your child complete the final step connected with an important milestone before shifting attention to what comes next."
      : moonThemeDirection === "clarify"
      ? "Understand what this milestone means for your child and what support will be most useful at this stage."
      : moonThemeDirection === "stabilize"
      ? hasMoonPadaTheme("structured progress", "practical judgement")
        ? "Support the milestone with the practical preparation needed to turn progress into a reliable result."
        : hasMoonPadaTheme("consolidation", "resources", "material growth")
        ? "Help your child consolidate the progress already made and build confidently on this milestone."
        : "Give steady support to the progress your child is making and help strengthen what has already been achieved."
      : moonThemeDirection === "transition"
      ? "Recognise that this milestone may mark a new stage for your child and support the adjustment that comes with it."
      : moonThemeDirection === "coordinate"
      ? "Discuss the next step with your child and the relevant people so everyone understands what follows this milestone."
      : "Acknowledge your child's progress and help turn the milestone into a foundation for the next stage."
          : childrenManifestationType === "children_progress"
    ? moonThemeDirection === "complete"
      ? "Help your child finish the current step so the progress already made turns into a clear result."
      : moonThemeDirection === "clarify"
      ? "Notice where your child is genuinely improving and identify what support would help that progress continue."
      : moonThemeDirection === "stabilize"
      ? hasMoonPadaTheme("structured progress", "practical judgement")
        ? "Support your child's progress with a consistent routine and one clear next objective."
        : hasMoonPadaTheme("consolidation", "resources", "material growth")
        ? "Reinforce what your child is already doing well and allow that progress to strengthen steadily."
        : "Maintain steady support and help your child build on the progress already visible."
      : moonThemeDirection === "transition"
      ? "Allow your child's progress to lead naturally into the next stage and adjust your support as their needs change."
      : moonThemeDirection === "coordinate"
      ? "Discuss the progress with your child and the relevant people so the next step is understood and supported."
      : "Encourage the progress already underway and help your child take the next practical step."
          : childrenManifestationType === "children_responsibility"
    ? moonThemeDirection === "complete"
      ? "Complete the responsibility involving your child that already needs attention before taking on additional demands."
      : moonThemeDirection === "clarify"
      ? "Clarify what your child genuinely needs from you today and separate it from responsibilities that can wait."
      : moonThemeDirection === "stabilize"
      ? hasMoonPadaTheme("structured progress", "practical judgement")
        ? "Handle the responsibility systematically and focus first on the practical need that matters most for your child."
        : hasMoonPadaTheme("consolidation", "resources", "material growth")
        ? "Strengthen the routines and support already helping you manage your responsibilities toward your child."
        : "Keep your responsibilities toward your child organised and deal with the most important need first."
      : moonThemeDirection === "transition"
      ? "Adjust how you manage your responsibilities if your child's needs or circumstances are beginning to change."
      : moonThemeDirection === "coordinate"
      ? "Coordinate with your child or the other people involved so responsibilities and expectations are clear."
      : "Give your child's needs dependable attention while keeping the responsibility practical and manageable."
          : familyManifestationType === "family_discussion"
    ? moonThemeDirection === "complete"
      ? "Use the family discussion to resolve the matter already awaiting closure."
      : moonThemeDirection === "clarify"
      ? "Clarify the main concern and make sure everyone understands what is actually being discussed."
      : moonThemeDirection === "stabilize"
      ? "Keep the conversation practical and focus on strengthening understanding around the existing situation."
      : moonThemeDirection === "transition"
      ? "Use the discussion to clarify what needs to change as the family situation moves into its next phase."
      : moonThemeDirection === "coordinate"
      ? "Bring the different family viewpoints together and agree on the practical next step."
      : "Move the family discussion forward through one practical and constructive next step."

    : familyManifestationType === "family_responsibility"
    ? moonThemeDirection === "complete"
      ? "Complete the family responsibility already requiring attention before taking on another obligation."
      : moonThemeDirection === "clarify"
      ? "Clarify what responsibility genuinely belongs to you and what support is actually required."
      : moonThemeDirection === "stabilize"
      ? "Keep the family responsibility organised and strengthen the routine or support already helping you manage it."
      : moonThemeDirection === "transition"
      ? "Adjust how the responsibility is handled if the family arrangement or circumstances are changing."
      : moonThemeDirection === "coordinate"
      ? "Share duties clearly and coordinate the responsibility with the other family members involved."
      : "Handle the family responsibility through steady practical follow-through."

    : familyManifestationType === "family_support"
    ? moonThemeDirection === "complete"
      ? "Offer the practical support needed to help the existing family matter reach resolution."
      : moonThemeDirection === "clarify"
      ? "Understand what kind of support is genuinely needed before stepping in."
      : moonThemeDirection === "stabilize"
      ? "Provide steady support that strengthens security and consistency around the family situation."
      : moonThemeDirection === "transition"
      ? "Adapt your support to what the family member now needs as circumstances begin to change."
      : moonThemeDirection === "coordinate"
      ? "Coordinate your support with the other people involved so help is useful rather than duplicated."
      : "Offer practical support that helps the family matter move forward."

    : familyManifestationType === "family_tension"
    ? moonThemeDirection === "complete"
      ? "Address the unresolved family issue that is continuing to create tension rather than carrying it forward."
      : moonThemeDirection === "clarify"
      ? "Clarify the real source of the family tension before responding to the surface disagreement."
      : moonThemeDirection === "stabilize"
      ? "Keep your response measured and focus on restoring stability rather than winning the disagreement."
      : moonThemeDirection === "transition"
      ? "Allow an outdated family pattern or expectation to change rather than forcing the old arrangement to continue."
      : moonThemeDirection === "coordinate"
      ? "Create space for the different viewpoints involved and work toward a practical understanding."
      : "Deal with the family tension through calm, practical engagement rather than escalation."

    : communicationManifestationType === "communication_activity"
    ? moonThemeDirection === "complete"
      ? "Finish the important message, conversation or exchange already requiring your response."
      : moonThemeDirection === "clarify"
      ? "Make the key message clear before adding more information or opening another conversation."
      : moonThemeDirection === "stabilize"
      ? "Keep important communication structured, consistent and focused on the practical issue."
      : moonThemeDirection === "transition"
      ? "Use communication to explain what is changing and what needs to happen next."
      : moonThemeDirection === "coordinate"
      ? "Use the conversation to align expectations, responsibilities or next steps with the other person."
      : "Use the increased communication activity to move one important matter forward."

    : communicationManifestationType === "communication_clarity"
    ? moonThemeDirection === "complete"
      ? "Resolve the outstanding misunderstanding or unanswered point before moving on."
      : moonThemeDirection === "clarify"
      ? "State the important point directly and confirm that it has been understood correctly."
      : moonThemeDirection === "stabilize"
      ? "Keep the message simple, factual and consistent so unnecessary confusion does not develop."
      : moonThemeDirection === "transition"
      ? "Clarify what has changed so the conversation can move toward the next stage."
      : moonThemeDirection === "coordinate"
      ? "Confirm that everyone involved has the same understanding of the decision or expectation."
      : "Use clear and direct communication to create practical forward movement."

    : communicationManifestationType === "communication_friction"
    ? moonThemeDirection === "complete"
      ? "Resolve the outstanding communication issue instead of allowing the disagreement to continue."
      : moonThemeDirection === "clarify"
      ? "Check what was actually said or intended before responding to the disagreement."
      : moonThemeDirection === "stabilize"
      ? "Keep your tone measured and return the conversation to the practical issue."
      : moonThemeDirection === "transition"
      ? "Change the way the conversation is being handled if the existing approach is creating repeated friction."
      : moonThemeDirection === "coordinate"
      ? "Find the point of misunderstanding and work toward a shared interpretation or next step."
      : "Respond to communication friction calmly and keep the discussion focused on resolution."

    : homeManifestationType === "home_attention"
    ? moonThemeDirection === "complete"
      ? "Finish the household matter already requiring attention before adding another task."
      : moonThemeDirection === "clarify"
      ? "Identify which home matter genuinely needs attention first and deal with that priority."
      : moonThemeDirection === "stabilize"
      ? "Strengthen the routine, organisation or practical arrangement already supporting the home."
      : moonThemeDirection === "transition"
      ? "Adjust the household arrangement if changing circumstances are creating a different practical need."
      : moonThemeDirection === "coordinate"
      ? "Coordinate household responsibilities with the other people involved so expectations are clear."
      : "Give practical attention to the home matter that can benefit most from steady progress."

    : homeManifestationType === "home_change"
    ? moonThemeDirection === "complete"
      ? "Complete the existing home-related step before beginning another change."
      : moonThemeDirection === "clarify"
      ? "Clarify what needs to change at home and why before making the practical adjustment."
      : moonThemeDirection === "stabilize"
      ? "Make the home change in a way that protects stability and avoids unnecessary disruption."
      : moonThemeDirection === "transition"
      ? "Take the practical next step in the home transition while allowing the new arrangement to develop gradually."
      : moonThemeDirection === "coordinate"
      ? "Discuss the home change with everyone affected and align the practical arrangements."
      : "Move the home change forward through one manageable practical step."

    : homeManifestationType === "home_stability"
    ? moonThemeDirection === "complete"
      ? "Resolve the unfinished household matter that is preventing the home environment from feeling settled."
      : moonThemeDirection === "clarify"
      ? "Identify what is creating uncertainty at home and address the practical cause."
      : moonThemeDirection === "stabilize"
      ? "Reinforce the routines, organisation and practical foundations that keep the home settled."
      : moonThemeDirection === "transition"
      ? "Protect essential stability while allowing the household arrangement to adapt to changing circumstances."
      : moonThemeDirection === "coordinate"
      ? "Agree on the household responsibilities or expectations that will help maintain stability."
      : "Strengthen the practical routines that support a stable home environment."
          : educationManifestationType === "education_focus"
    ? moonThemeDirection === "complete"
      ? "Finish the learning task already requiring your attention before moving to additional material."
      : moonThemeDirection === "clarify"
      ? "Identify the subject or task that deserves your attention most and remove unnecessary distractions."
      : moonThemeDirection === "stabilize"
      ? hasMoonPadaTheme("structured progress", "practical judgement")
        ? "Set a clear study priority and give it disciplined, uninterrupted attention."
        : hasMoonPadaTheme("consolidation", "resources", "material growth")
        ? "Consolidate what you already know and give steady attention to the material that needs strengthening."
        : "Create a structured study period and concentrate on one important learning objective."
      : moonThemeDirection === "transition"
      ? "Shift your attention to the learning method or subject that now offers the most useful progress."
      : moonThemeDirection === "coordinate"
      ? "Clarify expectations with the teacher, mentor or other person involved before directing more effort."
      : "Give sustained attention to the learning priority that can produce the most useful progress."
          : relationshipManifestationType === "relationship_commitment"
    ? moonThemeDirection === "complete"
      ? "Resolve the relationship matter already awaiting closure before making a new commitment or promise."
      : moonThemeDirection === "clarify"
      ? "Clarify what commitment means to both of you before making assumptions about the relationship's next step."
      : moonThemeDirection === "stabilize"
      ? hasMoonPadaTheme("structured progress", "practical judgement")
        ? "Strengthen the relationship through a practical commitment that both of you can realistically maintain."
        : hasMoonPadaTheme("consolidation", "resources", "material growth")
        ? "Build on the security already present in the relationship rather than pushing for a larger commitment too quickly."
        : "Give the relationship greater stability through consistent actions and realistic expectations."
      : moonThemeDirection === "transition"
      ? "Allow the relationship to move into its next stage only when both of you understand what is changing."
      : moonThemeDirection === "coordinate"
      ? "Discuss expectations openly and make sure both of you understand the commitment in the same way."
      : "Develop the relationship through a meaningful step that strengthens mutual trust and commitment."
          : relationshipManifestationType === "relationship_discussion"
    ? moonThemeDirection === "complete"
      ? "Bring the unresolved relationship discussion to a clear conclusion rather than repeatedly reopening the same issue."
      : moonThemeDirection === "clarify"
      ? "Ask the question that needs an honest answer and make sure you understand each other's position before responding."
      : moonThemeDirection === "stabilize"
      ? hasMoonPadaTheme("structured progress", "practical judgement")
        ? "Keep the conversation focused on the practical issue and work toward an outcome both of you can realistically follow."
        : hasMoonPadaTheme("consolidation", "resources", "material growth")
        ? "Use the discussion to strengthen what is already working in the relationship rather than focusing only on what needs to change."
        : "Keep the conversation measured and focus on resolving one relationship matter at a time."
      : moonThemeDirection === "transition"
      ? "Use the discussion to acknowledge what is changing in the relationship and clarify how both of you want to move forward."
      : moonThemeDirection === "coordinate"
      ? "Listen carefully, express your own expectations clearly and look for the point where both perspectives can meet."
      : "Use the conversation to improve mutual understanding and move the relationship forward constructively."
          : relationshipManifestationType === "relationship_harmony"
    ? moonThemeDirection === "complete"
      ? "Resolve the small unfinished matter that has been affecting the relationship so you can enjoy the greater harmony available."
      : moonThemeDirection === "clarify"
      ? "Use the calmer relationship atmosphere to understand each other better and clear up any remaining uncertainty."
      : moonThemeDirection === "stabilize"
      ? hasMoonPadaTheme("structured progress", "practical judgement")
        ? "Strengthen the relationship through a simple practical gesture that reinforces trust and reliability."
        : hasMoonPadaTheme("consolidation", "resources", "material growth")
        ? "Nurture what is already working well between you and give the relationship room to deepen naturally."
        : "Support the positive relationship atmosphere through consistency, patience and dependable behaviour."
      : moonThemeDirection === "transition"
      ? "Use the supportive relationship atmosphere to move naturally into the next stage of mutual understanding."
      : moonThemeDirection === "coordinate"
      ? "Spend time communicating openly and reinforce the sense that both of you are working together."
      : "Build on the positive relationship energy by giving genuine attention to the connection."
          : relationshipManifestationType === "relationship_tension"
    ? moonThemeDirection === "complete"
      ? "Address the unresolved relationship issue directly so the same tension does not continue into another interaction."
      : moonThemeDirection === "clarify"
      ? "Identify what is actually causing the tension before reacting to the words or emotions surrounding it."
      : moonThemeDirection === "stabilize"
      ? hasMoonPadaTheme("structured progress", "practical judgement")
        ? "Keep the interaction practical and deal with the specific issue rather than allowing the disagreement to widen."
        : hasMoonPadaTheme("consolidation", "resources", "material growth")
        ? "Protect the stability of the relationship by responding patiently rather than escalating a temporary disagreement."
        : "Keep your response measured and give the relationship space to settle before pushing for resolution."
      : moonThemeDirection === "transition"
      ? "Recognise what the disagreement is revealing about a changing relationship dynamic and respond to the underlying issue."
      : moonThemeDirection === "coordinate"
      ? "Listen to the other person's concern, explain your own position clearly and look for the specific point that needs agreement."
      : "Use the tension to understand what needs adjustment rather than treating the disagreement itself as the whole problem."
          : relationshipManifestationType === "relationship_attention"
    ? moonThemeDirection === "complete"
      ? "Give attention to the relationship matter that has been left unfinished before allowing smaller concerns to take over."
      : moonThemeDirection === "clarify"
      ? "Pay attention to what the other person is actually communicating and clarify anything that feels uncertain."
      : moonThemeDirection === "stabilize"
      ? hasMoonPadaTheme("structured progress", "practical judgement")
        ? "Give the relationship focused attention through a practical action that addresses what currently matters most."
        : hasMoonPadaTheme("consolidation", "resources", "material growth")
        ? "Nurture the connection that already exists and give steady attention to what helps the relationship feel secure."
        : "Give the relationship consistent attention without trying to resolve everything at once."
      : moonThemeDirection === "transition"
      ? "Pay attention to what is changing in the relationship and respond to the new dynamic rather than relying on old assumptions."
      : moonThemeDirection === "coordinate"
      ? "Make time for an open exchange and ensure both of you understand what currently needs attention."
      : "Give meaningful attention to the relationship and respond to the issue or need that is becoming more visible."
      : educationManifestationType === "education_progress"
    ? moonThemeDirection === "complete"
      ? "Complete the current stage of the learning task so the progress already made turns into a finished result."
      : moonThemeDirection === "clarify"
      ? "Review what has improved and identify the next area that will produce meaningful learning progress."
      : moonThemeDirection === "stabilize"
      ? hasMoonPadaTheme("structured progress", "practical judgement")
        ? "Build on your progress systematically and strengthen the part of the learning process that is already working."
        : hasMoonPadaTheme("consolidation", "resources", "material growth")
        ? "Consolidate what you have learned so the progress becomes a stable foundation for the next stage."
        : "Maintain a steady learning rhythm and build on the progress already made."
      : moonThemeDirection === "transition"
      ? "Use the progress already made to move into the next stage of learning when the current method has served its purpose."
      : moonThemeDirection === "coordinate"
      ? "Use feedback or discussion to understand how your progress can be strengthened further."
      : "Build on the learning progress already visible and direct your effort toward the next useful milestone."
        : educationManifestationType === "education_challenge"
    ? moonThemeDirection === "complete"
      ? "Finish the most important unfinished part of the learning task before taking on additional material."
      : moonThemeDirection === "clarify"
      ? "Identify exactly which part of the material is unclear before spending more time on it."
      : moonThemeDirection === "stabilize"
? hasMoonPadaTheme("structured progress", "practical judgement")
  ? "Set a clear study priority and work through it systematically before moving to the next task."
  : hasMoonPadaTheme("consolidation", "resources", "material growth")
  ? "Strengthen what you already understand and consolidate the material before adding something new."
  : "Use a structured study plan and focus on one manageable part of the task at a time."
      : moonThemeDirection === "transition"
      ? "Adjust your approach if the current learning method is not producing enough progress."
      : moonThemeDirection === "coordinate"
      ? "Ask for clarification or discuss the difficult part rather than struggling with it in isolation."
      : "Build on what you already understand before moving into more difficult material."
        : careerManifestationType === "career_movement"
    ? moonThemeDirection === "complete"
      ? "Complete the career step already in motion before opening another professional direction."
      : moonThemeDirection === "clarify"
      ? "Clarify the role, opportunity or next professional step before committing further effort."
      : moonThemeDirection === "stabilize"
      ? hasMoonPadaTheme("structured progress", "practical judgement")
        ? "Take a disciplined approach to the career opportunity and prioritise the step that can produce tangible progress."
        : hasMoonPadaTheme("consolidation", "resources", "material growth")
        ? "Strengthen your existing professional position while allowing the next opportunity to develop steadily."
        : "Keep the career movement practical and build on the professional position you already have."
      : moonThemeDirection === "transition"
      ? "Be prepared to adjust your professional direction if the emerging opportunity points toward a more useful path."
      : moonThemeDirection === "coordinate"
      ? "Clarify expectations, responsibilities or next steps with the people involved in the career opportunity."
      : "Use the professional momentum available today to advance the next practical career step."
          : careerManifestationType === "career_change"
    ? moonThemeDirection === "complete"
      ? "Close or complete the professional matter that needs resolution before committing to a major career change."
      : moonThemeDirection === "clarify"
      ? "Clarify what you want to change professionally and what the new direction must realistically offer."
      : moonThemeDirection === "stabilize"
      ? hasMoonPadaTheme("structured progress", "practical judgement")
        ? "Approach the career change methodically and complete the practical steps needed before making the move."
        : hasMoonPadaTheme("consolidation", "resources", "material growth")
        ? "Strengthen your professional and financial foundations before making a significant career change."
        : "Prepare the practical foundations of the career change before taking a decisive step."
      : moonThemeDirection === "transition"
      ? "Allow the professional transition to develop deliberately rather than holding onto a direction that is clearly changing."
      : moonThemeDirection === "coordinate"
      ? "Discuss the proposed career change with the people whose expectations, responsibilities or support materially affect the decision."
      : "Develop the next career direction carefully and take the practical step that moves the change forward."
          : careerManifestationType === "career_recognition"
    ? moonThemeDirection === "complete"
      ? "Complete the visible piece of work or responsibility that can strengthen how your contribution is recognised."
      : moonThemeDirection === "clarify"
      ? "Make your contribution, results and responsibilities clear rather than assuming they will be noticed automatically."
      : moonThemeDirection === "stabilize"
      ? hasMoonPadaTheme("structured progress", "practical judgement")
        ? "Let consistent execution and measurable results strengthen your professional recognition."
        : hasMoonPadaTheme("consolidation", "resources", "material growth")
        ? "Build on the professional credibility you have already established rather than seeking recognition through a sudden move."
        : "Strengthen your professional standing through steady and reliable delivery."
      : moonThemeDirection === "transition"
      ? "Use emerging recognition to position yourself for the next level of professional responsibility."
      : moonThemeDirection === "coordinate"
      ? "Communicate your contribution and progress clearly with the people whose feedback or decisions matter."
      : "Build on the visibility of your work by demonstrating the value of your contribution."
          : careerManifestationType === "career_responsibility"
    ? moonThemeDirection === "complete"
      ? "Complete the professional responsibility already requiring your attention before taking on another commitment."
      : moonThemeDirection === "clarify"
      ? "Clarify what you are responsible for, what the expected outcome is and which task deserves priority."
      : moonThemeDirection === "stabilize"
      ? hasMoonPadaTheme("structured progress", "practical judgement")
        ? "Handle the responsibility systematically and prioritise the work that carries the greatest practical importance."
        : hasMoonPadaTheme("consolidation", "resources", "material growth")
        ? "Strengthen your existing responsibilities through steady delivery before taking on additional commitments."
        : "Keep your professional responsibilities organised and work through them in a manageable order."
      : moonThemeDirection === "transition"
      ? "Adjust how you manage your responsibilities if your role or professional priorities are beginning to change."
      : moonThemeDirection === "coordinate"
      ? "Clarify responsibilities, timelines and expectations with the people involved before proceeding."
      : "Use the responsibility as an opportunity to demonstrate dependable and practical execution."
          : careerManifestationType === "workload_service"
    ? moonThemeDirection === "complete"
      ? "Finish the most important outstanding work obligation before allowing additional tasks to compete for your attention."
      : moonThemeDirection === "clarify"
      ? "Identify which work demand genuinely requires your attention and separate it from tasks that can wait."
      : moonThemeDirection === "stabilize"
      ? hasMoonPadaTheme("structured progress", "practical judgement")
        ? "Organise the workload systematically and work through the highest-priority responsibility first."
        : hasMoonPadaTheme("consolidation", "resources", "material growth")
        ? "Protect your available time and energy by keeping the workload contained and manageable."
        : "Keep the workload structured and focus on one practical responsibility at a time."
      : moonThemeDirection === "transition"
      ? "Adjust your work routine or priorities if the current workload is no longer being managed effectively."
      : moonThemeDirection === "coordinate"
      ? "Clarify priorities, timelines or workload expectations with the people involved rather than carrying unclear responsibilities."
      : "Use your effort where it can make the most practical difference and avoid spreading yourself across too many tasks."
        : familyManifestationType === "family_discussion"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid rushing the family discussion toward a conclusion before the important concerns have been heard."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming you already understand what another family member means without clarifying it."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid trying to resolve every family issue within the same conversation."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid allowing temporary emotion to turn a useful family discussion into an argument."
      : "Avoid letting the family discussion become more complicated than the issue actually requires."

    : familyManifestationType === "family_responsibility"
    ? moonCautionDirection === "avoid_overextension"
      ? "Avoid taking responsibility for every family need when the important priority requires focused attention."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming a family responsibility is yours without clarifying what is actually expected."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning a manageable family responsibility into unnecessary pressure."
      : "Avoid carrying family responsibilities without clear priorities or practical boundaries."

    : familyManifestationType === "family_support"
    ? moonCautionDirection === "avoid_overextension"
      ? "Avoid supporting everyone at once to the point that your help becomes difficult to sustain."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming what another family member needs without first understanding the situation."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid insisting on helping in only one way when different support may be more useful."
      : "Avoid offering more family support than the situation genuinely requires."

    : familyManifestationType === "family_tension"
    ? moonCautionDirection === "avoid_reactivity"
      ? "Avoid reacting emotionally to family tension before understanding what is actually driving it."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid allowing pride or the need to prove your position to prolong a family disagreement."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming another family member's intention from a temporary disagreement."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid holding so firmly to one position that a reasonable resolution becomes harder."
      : "Avoid escalating a family disagreement that can be handled more calmly."

    : communicationManifestationType === "communication_activity"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid responding too quickly when an important message or conversation deserves proper attention."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid spreading your attention across too many conversations when one important exchange needs focus."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming a message has been understood simply because it has been sent."
      : "Avoid allowing increased communication activity to become scattered or unnecessarily distracting."

    : communicationManifestationType === "communication_clarity"
    ? moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming the other person has understood your meaning without confirming the important point."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid overexplaining a message that would be clearer if stated simply and directly."
      : moonCautionDirection === "avoid_rushing"
      ? "Avoid communicating before you are clear about the point you actually need to make."
      : "Avoid adding unnecessary complexity to communication that needs to remain clear."

    : communicationManifestationType === "communication_friction"
    ? moonCautionDirection === "avoid_reactivity"
      ? "Avoid responding to communication friction while emotion is shaping your interpretation."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid treating a misunderstanding as intentional before checking what was actually meant."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid turning the conversation into a contest over who is right."
      : moonCautionDirection === "avoid_rushing"
      ? "Avoid sending a rushed response that may intensify the disagreement."
      : "Avoid allowing a manageable communication issue to become unnecessarily confrontational."

    : homeManifestationType === "home_attention"
    ? moonCautionDirection === "avoid_overextension"
      ? "Avoid trying to handle every household task when one practical priority needs proper attention."
      : moonCautionDirection === "avoid_rushing"
      ? "Avoid rushing through an important home matter simply to remove it from your list."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing a temporary household disruption to unsettle the rest of your routine."
      : "Avoid letting minor household demands distract you from the home matter that actually needs attention."

    : homeManifestationType === "home_change"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid making a home-related change before the practical details are properly considered."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid creating more disruption than necessary while changing the household arrangement."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid resisting a reasonable home adjustment simply because the existing arrangement feels familiar."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming everyone affected by the home change has the same expectations."
      : "Avoid making a home change without considering how it affects the existing household structure."

    : homeManifestationType === "home_stability"
    ? moonCautionDirection === "avoid_disruption"
      ? "Avoid introducing unnecessary disruption into a household situation that benefits from consistency."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid trying to control every household detail in the name of maintaining stability."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid confusing stability with refusing every reasonable adjustment."
      : "Avoid allowing small household issues to disturb an otherwise manageable and stable arrangement."

    : null;
const contextualMoonCaution =
  moneyManifestationType === "money_inflow"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid making financial commitments before the expected payment or receipt is actually confirmed."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming the payment is settled until the amount, timing and terms are clear."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid committing the expected funds across too many expenses or priorities before they are received."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid holding too tightly to one expectation about when or how the money should arrive."
            : moonCautionDirection === "avoid_reactivity"
      ? "Avoid making an emotional financial decision because a payment is delayed, uncertain or different from what you expected."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid letting pride or the need to prove financial progress influence how you handle an expected payment."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid making new financial commitments while the timing or availability of the expected funds remains unsettled."
            : moonCautionDirection === "avoid_drift"
      ? "Avoid treating an incoming payment as progress on its own without deciding what financial priority it should support."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid delaying a reasonable financial decision simply because every detail about the expected payment is not yet perfectly certain."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning uncertainty around an expected payment into unnecessary financial pressure or urgency."
      : "Avoid treating expected money as fully available until the financial matter is confirmed."
          : moneyManifestationType === "money_accumulation"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid rushing into a new financial commitment before strengthening the reserves you are trying to build."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming your financial position is stronger than it is without reviewing what is genuinely available."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid spreading your available resources across too many commitments when the priority is to strengthen reserves."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid locking your resources into a plan that no longer supports your current financial priorities."
          : moonCautionDirection === "avoid_reactivity"
      ? "Avoid changing a longer-term saving or accumulation plan because of a temporary financial concern."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid using accumulated resources simply to demonstrate financial progress or maintain appearances."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing a temporary financial disruption to unnecessarily weaken the reserves you have already built."
            : moonCautionDirection === "avoid_drift"
      ? "Avoid accumulating resources without a clear sense of the financial purpose or priority they are meant to support."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid delaying a reasonable saving or accumulation decision while waiting for perfect certainty about every financial detail."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning the goal of building financial reserves into unnecessary pressure to save or accumulate too aggressively."
      : "Avoid weakening the resources you are trying to build for a short-term or non-essential financial demand."
          : moneyManifestationType === "money_outflow"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid making a payment or purchase too quickly before confirming that the expense is necessary and correctly timed."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid paying or committing funds before the amount, purpose and responsibility for the expense are clear."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid allowing multiple expenses or obligations to stretch your available resources beyond a comfortable level."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid insisting on a spending plan that no longer reflects the financial obligations actually requiring attention."
            : moonCautionDirection === "avoid_reactivity"
      ? "Avoid making an unnecessary purchase or financial decision in response to temporary pressure or emotion."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid spending money simply to maintain appearances, prove a point or demonstrate financial capacity."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing an unexpected expense or temporary disruption to trigger unnecessary additional spending."
            : moonCautionDirection === "avoid_drift"
      ? "Avoid letting money flow outward without a clear reason or connection to your actual financial priorities."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid overanalysing a necessary expense so heavily that a reasonable financial decision is unnecessarily delayed."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid allowing financial pressure to trigger unnecessary spending or make routine expenses feel more urgent than they are."
      : "Avoid unnecessary financial outflow and keep spending focused on obligations that genuinely need attention."
          : moneyManifestationType === "money_planning"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid finalising an important financial plan before reviewing the numbers and practical consequences carefully."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid building the financial plan around assumptions that have not yet been confirmed."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid creating a financial plan that depends on too many commitments or stretches your available resources."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid becoming attached to a financial plan that needs adjustment as circumstances change."
            : moonCautionDirection === "avoid_reactivity"
      ? "Avoid changing your financial strategy because of a temporary concern or short-term emotional reaction."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid shaping a financial plan around appearances, status or the need to prove financial progress."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing a temporary financial disruption to force unnecessary changes to a sound longer-term plan."
            : moonCautionDirection === "avoid_drift"
      ? "Avoid making financial plans without a clear priority, purpose or practical next step."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid delaying a reasonable financial plan while trying to account for every possible uncertainty or outcome."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning financial planning into unnecessary pressure by trying to solve every future financial concern at once."
      : "Avoid making a financial decision without considering how it affects your broader priorities and available resources."
          : moneyManifestationType === "money_settlement"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid finalising the settlement too quickly before confirming that the amount, terms and remaining obligations are correct."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid treating the financial matter as settled until the terms, payments and responsibilities are clearly confirmed."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid accepting settlement terms that create additional financial obligations beyond what you can comfortably manage."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid holding to one settlement position if a practical adjustment could resolve the financial matter more effectively."
                  : moonCautionDirection === "avoid_reactivity"
      ? "Avoid allowing frustration or financial pressure to push you into settling the matter on unfavourable terms."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid allowing pride or the need to prove a point to prevent a practical financial settlement."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid letting a temporary disruption push you into settlement terms that create unnecessary longer-term financial pressure."
            : moonCautionDirection === "avoid_drift"
      ? "Avoid allowing the financial matter to remain unresolved simply because the next step or responsibility has not been clearly defined."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid delaying a reasonable financial settlement while waiting for perfect certainty about every detail or outcome."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid allowing pressure to settle the matter quickly to push you toward terms that create unnecessary financial strain."
      : "Avoid considering the financial matter closed while an important payment, term or responsibility remains unresolved."
    : educationManifestationType === "education_focus"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid rushing through study or learning tasks simply to finish them; give the important material enough attention."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming you understand the material before checking the details or testing your understanding."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid dividing your attention across too many subjects, tasks or learning priorities at once."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid forcing one study method or approach if it is no longer helping you understand the material effectively."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid letting temporary frustration or difficulty break your concentration or change your study priorities."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid allowing the need to prove what you know to prevent you from reviewing, asking questions or correcting a misunderstanding."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing temporary distractions or interruptions to derail the learning task that needs your attention."
            : moonCautionDirection === "avoid_drift"
      ? "Avoid studying without a clear learning objective or practical priority for what needs to be understood."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid spending so much time analysing the material or study approach that meaningful learning progress is delayed."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning an important learning priority into unnecessary pressure by expecting yourself to understand everything at once."
      : "Avoid scattering your attention when one learning priority needs sustained focus."
    : educationManifestationType === "education_progress"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid rushing ahead simply because progress is visible; complete the current learning stage properly before moving on."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming that recent progress means every part of the subject or task is fully understood."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid taking on too many new learning goals at once when the current progress still needs to be consolidated."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid becoming attached to one approach if adjusting your method could help the learning progress continue."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid allowing one temporary setback to make you question the progress you have already made."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid letting recent progress make you overlook feedback, revision or areas that still need improvement."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing a temporary interruption to break the momentum you have already created in your learning."
            : moonCautionDirection === "avoid_drift"
      ? "Avoid letting progress continue without identifying the next learning milestone or practical objective."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid analysing your learning progress so heavily that you delay a reasonable next step or lose useful momentum."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning positive learning progress into pressure to advance faster than the material can be properly understood."
      : "Avoid losing the momentum you have built by neglecting the next practical step in your learning."
    : educationManifestationType === "education_challenge"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid rushing through the difficult part simply to get past it; work through the problem carefully."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming you know why you are struggling before checking where the actual gap or difficulty lies."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid adding more study demands while an existing learning difficulty still needs focused attention."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid repeating the same approach if it is not helping you overcome the learning difficulty."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid letting frustration with a difficult subject or task make you abandon the effort prematurely."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid allowing pride to stop you from asking for help, reviewing the basics or acknowledging what you do not yet understand."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing a temporary setback or interruption to turn a manageable learning difficulty into a larger problem."
            : moonCautionDirection === "avoid_drift"
      ? "Avoid moving from one problem to another without identifying the specific learning difficulty that needs to be resolved."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid delaying progress by searching for a perfect answer or complete certainty before taking the next reasonable learning step."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning the learning challenge into unnecessary pressure by expecting yourself to solve everything at once."
          : "Avoid frustration or abandoning the task simply because progress requires more effort."
    : careerManifestationType === "career_movement"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid rushing a career move before the role, timing or practical terms are sufficiently clear."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming a career opportunity is confirmed until the responsibilities, terms and next steps are clear."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid pursuing too many career possibilities at once when one opportunity needs focused attention."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid becoming fixed on one career path if a practical adjustment could create better movement."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid making a career move mainly in response to temporary frustration or pressure in your current situation."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid allowing title, status or the need to prove career progress to outweigh the practical value of an opportunity."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing temporary workplace disruption to push you into a career move before the longer-term implications are clear."
      : moonCautionDirection === "avoid_drift"
      ? "Avoid pursuing career movement without a clear sense of what the next role or direction should actually improve."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid delaying a reasonable career step while waiting for perfect certainty about every outcome."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning the need for career progress into unnecessary pressure to make something happen immediately."
           : "Avoid forcing career movement before there is a sufficiently clear and practical next step."
    : careerManifestationType === "career_change"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid making a major career change before the practical consequences, timing and responsibilities are clear."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming a different role or workplace will solve the current issue without understanding what will actually change."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid trying to manage too many career changes or possibilities at once when one transition needs proper attention."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid holding onto an old career arrangement simply because it is familiar when circumstances genuinely require adjustment."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid making a major career change mainly because of a temporary conflict, disappointment or emotional reaction."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid allowing title, status or the need to prove yourself to become the main reason for changing your career direction."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing temporary workplace instability to turn into an unnecessary long-term career disruption."
      : moonCautionDirection === "avoid_drift"
      ? "Avoid changing career direction without being clear about what the new path is meant to improve."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid delaying a necessary career change indefinitely while waiting for every uncertainty to disappear."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning dissatisfaction with the current situation into pressure to make a major career change immediately."
            : "Avoid making a significant career change without a clear practical reason and workable next step."
    : careerManifestationType === "career_recognition"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid pushing for recognition before your contribution, results or responsibilities can be clearly demonstrated."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming your contribution has been fully recognised or understood without confirming expectations and feedback."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid taking on too much simply to gain visibility or prove your professional value."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid becoming fixed on one form of recognition when professional progress may appear through a different opportunity or responsibility."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid reacting emotionally if recognition is delayed or does not appear in the form you expected."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid allowing the need for status, validation or acknowledgement to influence an otherwise practical career decision."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing a temporary lack of recognition to disrupt the professional progress you are already building."
      : moonCautionDirection === "avoid_drift"
      ? "Avoid seeking visibility without being clear about the contribution or professional objective you want recognised."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid repeatedly questioning how your work is being perceived when a practical opportunity to demonstrate your value is already available."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning the desire for professional recognition into pressure to constantly prove your value."
            : "Avoid focusing so heavily on recognition that the quality and substance of your contribution receive less attention."
    : careerManifestationType === "career_responsibility"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid taking on a new professional responsibility before the expectations, scope and priorities are clear."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming responsibility for a task without confirming what is actually expected of you."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid accepting more professional responsibility than you can realistically manage alongside your existing priorities."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid becoming fixed on one way of handling a responsibility when the situation requires a practical adjustment."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid allowing temporary pressure or frustration to affect how you handle an important professional responsibility."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid taking on additional responsibility simply to prove your capability or professional value."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing temporary workplace disruption to interfere with a responsibility that still requires steady attention."
      : moonCautionDirection === "avoid_drift"
      ? "Avoid carrying a professional responsibility without being clear about the outcome, priority or next step expected from you."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid delaying a reasonable decision on an important responsibility while waiting for perfect certainty."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning an important professional responsibility into unnecessary pressure by trying to manage everything at once."
            : "Avoid allowing an important professional responsibility to become unclear, neglected or unnecessarily difficult to manage."
    : careerManifestationType === "workload_service"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid rushing through routine work or service responsibilities simply to reduce the workload."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming every task is equally urgent; confirm what genuinely needs your attention first."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid taking on more work or service obligations when your existing workload already needs careful management."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid following an inefficient work routine simply because it is familiar; adjust how the workload is organised if necessary."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid allowing temporary workload pressure or frustration to affect how you handle routine responsibilities."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid trying to handle every task yourself simply to prove that you can manage the workload."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing temporary interruptions to create unnecessary disorder across your wider workload."
      : moonCautionDirection === "avoid_drift"
      ? "Avoid moving between tasks without a clear order of priority for what genuinely needs to be completed."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid spending so much time deciding how to manage the workload that necessary tasks are delayed."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning a demanding workload into unnecessary pressure by expecting yourself to resolve everything at once."
           : "Avoid allowing routine workload or service demands to become unnecessarily difficult through poor prioritisation."
    : relationshipManifestationType === "relationship_commitment"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid rushing an important relationship commitment before both sides are clear about what it involves."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming you and the other person have the same expectations about the commitment without discussing them clearly."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid taking on more emotional or practical responsibility in the relationship than you can realistically sustain."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid becoming fixed on one idea of how the relationship should develop when a practical adjustment may be needed."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid making an important relationship commitment mainly in response to temporary emotion, pressure or insecurity."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid allowing pride or the need to prove the strength of the relationship to influence an important commitment."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing temporary relationship instability to push you into a commitment or decision with longer-term consequences."
      : moonCautionDirection === "avoid_drift"
      ? "Avoid allowing an important relationship to move toward greater commitment without clarity about what both sides actually want."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid delaying a reasonable relationship decision indefinitely while waiting for complete certainty about every outcome."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning the question of commitment into unnecessary pressure for yourself or the other person."
            : "Avoid making an important relationship commitment without sufficient clarity about expectations and responsibilities."
    : relationshipManifestationType === "relationship_discussion"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid rushing an important relationship conversation before both sides have had enough space to express what they mean."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming you know what the other person means or feels without allowing the discussion to clarify it."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid trying to resolve too many relationship issues in one conversation when one matter needs focused attention."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid entering the discussion determined to defend one position when genuine understanding may require some adjustment."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid reacting immediately to an emotional comment before understanding the concern behind it."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid allowing pride or the need to be right to become more important than understanding each other."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing one difficult exchange to create unnecessary instability in the wider relationship."
      : moonCautionDirection === "avoid_drift"
      ? "Avoid letting an important relationship discussion end without clarity about what needs to happen next."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid analysing every word so heavily that the actual issue or reasonable next step becomes harder to see."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning an important conversation into pressure to resolve everything immediately."
            : "Avoid allowing an important relationship discussion to become unclear, defensive or unnecessarily complicated."
    : relationshipManifestationType === "relationship_harmony"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid pushing the relationship forward too quickly simply because things currently feel positive."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming that a harmonious phase means important expectations or concerns no longer need to be discussed."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid taking on too much for the sake of maintaining harmony when the relationship needs balanced effort from both sides."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid trying to preserve harmony by insisting that the relationship remain exactly as it is when a healthy adjustment may be needed."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid allowing one temporary emotional reaction to disturb the cooperation or understanding that is already developing."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid allowing pride or the need to be right to disturb an otherwise supportive relationship dynamic."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing a temporary disagreement or external disruption to unsettle the wider stability of the relationship."
      : moonCautionDirection === "avoid_drift"
      ? "Avoid taking a positive relationship phase for granted; remain clear about what needs continued attention from both sides."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid analysing a positive relationship development so heavily that you create uncertainty where none is necessary."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning the desire to maintain harmony into pressure to keep everything perfect."
            : "Avoid taking the current relationship harmony for granted when continued understanding and balanced effort still matter."
    : relationshipManifestationType === "relationship_tension"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid rushing to resolve the tension before understanding what is actually causing the disagreement."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming you understand the other person's intention without clarifying what is actually creating the tension."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid trying to resolve every relationship issue at once when one source of tension needs focused attention."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid becoming fixed on your own position when easing the tension may require some adjustment from both sides."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid responding to relationship tension in the heat of the moment when a calmer response could prevent unnecessary escalation."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid allowing pride or the need to be right to keep a manageable relationship tension unresolved."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing a temporary disagreement to create unnecessary instability across the wider relationship."
      : moonCautionDirection === "avoid_drift"
      ? "Avoid leaving the source of relationship tension unresolved when a clear conversation or next step is needed."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid repeatedly analysing the disagreement when a reasonable conversation or practical response could move it forward."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning a difficult relationship moment into pressure to resolve the entire issue immediately."
            : "Avoid allowing a manageable relationship tension to grow through poor communication or delayed attention."
    : relationshipManifestationType === "relationship_attention"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid rushing to fix the relationship matter before understanding what actually needs attention."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming you know what the other person needs without checking what is actually requiring attention."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid trying to address too many relationship matters at once when one issue needs your attention most."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid approaching the relationship matter in only one way when the situation may require some flexibility."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid allowing a temporary emotional reaction to determine how you respond to the relationship matter."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid allowing pride or the need to be right to prevent you from giving the relationship matter proper attention."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing a temporary relationship issue to create unnecessary instability beyond the matter that actually needs attention."
      : moonCautionDirection === "avoid_drift"
      ? "Avoid leaving the relationship matter unattended when a clear conversation or practical next step is needed."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid analysing the relationship matter so heavily that a reasonable conversation or response is unnecessarily delayed."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning a relationship matter that needs attention into pressure to resolve everything immediately."
            : "Avoid neglecting a relationship matter that would benefit from timely and thoughtful attention."
    : childrenManifestationType === "children_attention"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid rushing to respond before understanding what the child-related matter actually needs from you."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming you know what the child needs without first understanding the situation clearly."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid trying to address too many child-related matters at once when one priority needs your attention most."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid insisting on one response when the child's needs or circumstances may require a different approach."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid allowing a temporary emotional reaction to determine how you respond to the child-related matter."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid allowing expectations or the need to prove a point to become more important than what the child actually needs."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing a temporary child-related issue to create unnecessary disruption beyond the matter that actually needs attention."
      : moonCautionDirection === "avoid_drift"
      ? "Avoid leaving a child-related matter unattended when a clear response or practical next step is needed."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid analysing the situation so heavily that a reasonable response to the child's needs is unnecessarily delayed."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning a child-related matter that needs attention into unnecessary pressure for yourself or the child."
            : "Avoid overlooking a child-related matter that would benefit from timely and thoughtful attention."
    : childrenManifestationType === "children_concern"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid reacting too quickly to a concern involving the child before understanding what is actually happening."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming the cause or seriousness of the child-related concern before the situation is clear."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid trying to address every possible concern at once when the immediate child-related issue needs focused attention."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid becoming fixed on one explanation or response when the child-related concern may require a different approach."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid allowing worry or emotion to determine your response before the child-related concern is properly understood."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid allowing expectations or the need to be right to prevent you from recognising what the child actually needs."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing a temporary concern involving the child to create unnecessary disruption beyond what the situation requires."
      : moonCautionDirection === "avoid_drift"
      ? "Avoid leaving a child-related concern unresolved when a clear response or practical next step is needed."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid repeatedly analysing the concern when a reasonable conversation, observation or practical response can provide clarity."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid allowing concern for the child to become unnecessary pressure for either you or the child."
            : "Avoid allowing worry about a child-related matter to grow without first understanding what genuinely needs attention."
    : childrenManifestationType === "children_milestone"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid rushing the child toward the next milestone before the current stage has been properly experienced or completed."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming a milestone means the child is ready for every expectation that may come with it."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid adding too many new expectations or activities simply because the child has reached an important milestone."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid measuring the child's milestone against a fixed expectation when development may unfold in an individual way."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid allowing a temporary emotional response to overshadow the wider significance of the child's progress."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid allowing pride in the child's achievement to become pressure for them to prove or repeat that success."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing the changes surrounding a milestone to create unnecessary disruption to the child's wider routine or stability."
      : moonCautionDirection === "avoid_drift"
      ? "Avoid treating the milestone as an endpoint without considering what support or next step the child now needs."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid analysing the child's progress so heavily that a positive milestone becomes a source of unnecessary uncertainty."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning an important milestone into pressure for the child to achieve the next stage immediately."
            : "Avoid placing unnecessary expectations on the child simply because an important milestone has been reached."
    : childrenManifestationType === "children_progress"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid rushing the child's progress simply because improvement is visible; allow the current development to strengthen naturally."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming that visible progress means every related difficulty or need has already been resolved."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid adding too many new expectations or activities while the child's current progress still needs to become established."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid measuring the child's progress against one fixed path when a different pace or approach may suit them better."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid allowing one temporary setback to overshadow the progress the child has already made."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid turning the child's progress into pressure to demonstrate, repeat or exceed the improvement immediately."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing a temporary interruption or difficulty to unnecessarily disrupt the progress already being made."
      : moonCautionDirection === "avoid_drift"
      ? "Avoid treating progress as sufficient on its own without considering what support or next step will help it continue."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid analysing every change so heavily that steady progress becomes a source of unnecessary doubt."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning positive progress into pressure for the child to improve faster than is reasonable."
            : "Avoid overlooking the support and consistency that will help the child's current progress continue."
    : childrenManifestationType === "children_responsibility"
    ? moonCautionDirection === "avoid_rushing"
      ? "Avoid rushing through an important responsibility involving the child simply to get it completed."
      : moonCautionDirection === "avoid_assumptions"
      ? "Avoid assuming what the child-related responsibility requires without confirming the practical details."
      : moonCautionDirection === "avoid_overextension"
      ? "Avoid taking on too many child-related responsibilities at once when one priority needs proper attention."
      : moonCautionDirection === "avoid_rigidity"
      ? "Avoid handling the responsibility in only one fixed way when the child's circumstances may require some adjustment."
      : moonCautionDirection === "avoid_reactivity"
      ? "Avoid allowing temporary frustration or emotion to affect how you handle an important responsibility involving the child."
      : moonCautionDirection === "avoid_pride"
      ? "Avoid taking on more responsibility simply to prove that you can manage everything for the child yourself."
      : moonCautionDirection === "avoid_disruption"
      ? "Avoid allowing a temporary disruption to interfere with a child-related responsibility that still needs steady attention."
      : moonCautionDirection === "avoid_drift"
      ? "Avoid carrying a child-related responsibility without being clear about what needs to be done next."
      : moonCautionDirection === "avoid_overanalysis"
      ? "Avoid delaying a reasonable child-related decision while waiting for perfect certainty about every detail."
      : moonCautionDirection === "avoid_overpressure"
      ? "Avoid turning an important responsibility involving the child into unnecessary pressure for either yourself or the child."
      : "Avoid allowing an important child-related responsibility to become unclear, delayed or unnecessarily difficult to manage."
    : null;

const buildPersonalizedOverview = (): string => {
  const primary = prediction.primaryTheme;

  if (!primary) {
    return prediction.overallTone;
  }

  const focus =
    primary.manifestationLabel?.toLowerCase() ??
    primary.area
      .replace(/([A-Z])/g, " $1")
      .toLowerCase();

  const secondary = prediction.secondaryThemes[0];

  const secondaryLabel =
    secondary?.manifestationLabel?.toLowerCase() ??
    secondary?.area
      ?.replace(/([A-Z])/g, " $1")
      .toLowerCase();

  const primaryDirection =
    primary.manifestationId === null
      ? null
      : moonPredictionDirection;

  const directionSummary =
    primaryDirection === "completion"
      ? `${focus} is the main focus today, with emphasis on bringing an existing matter toward completion or resolution.`
      : primaryDirection === "clarification"
      ? `${focus} is the main focus today, with circumstances helping clarify what needs your attention next.`
      : primaryDirection === "stabilization"
      ? `${focus} is the main focus today, with greater benefit in strengthening what is already developing than forcing rapid change.`
      : primaryDirection === "transition"
      ? `${focus} is the main focus today, with circumstances beginning to move from one stage or arrangement into another.`
      : primaryDirection === "coordination"
      ? `${focus} is the main focus today, with progress depending on communication, cooperation or bringing different priorities into alignment.`
      : primaryDirection === "development"
      ? `${focus} is the main focus today, with progress likely to develop through practical steps rather than an immediate outcome.`
      : null;

  const polaritySummary =
    primary.polarity === "supportive"
      ? `${focus} carries a constructive emphasis today.`
      : primary.polarity === "challenging"
      ? `${focus} may require additional care and a measured response today.`
      : primary.polarity === "mixed"
      ? `${focus} is active today, although progress may require some adjustment.`
      : `${focus} may deserve practical attention today.`;

  const primarySummary =
    directionSummary ?? polaritySummary;

  const secondarySummary =
    secondaryLabel && secondary
      ? secondary.polarity === "supportive"
        ? ` ${secondaryLabel.charAt(0).toUpperCase()}${secondaryLabel.slice(
            1
          )} provides a supportive secondary influence.`
        : secondary.polarity === "challenging"
        ? ` ${secondaryLabel.charAt(0).toUpperCase()}${secondaryLabel.slice(
            1
          )} may require some additional care.`
        : secondary.polarity === "mixed"
        ? ` ${secondaryLabel.charAt(0).toUpperCase()}${secondaryLabel.slice(
            1
          )} remains a secondary area to navigate with some flexibility.`
        : ` ${secondaryLabel.charAt(0).toUpperCase()}${secondaryLabel.slice(
            1
          )} remains a secondary area of attention.`
      : "";

  const combinedSummary =
  primarySummary + secondarySummary;

return (
  combinedSummary.charAt(0).toUpperCase() +
  combinedSummary.slice(1)
);
};
const personalizedPrediction = {
  ...prediction,
  overallTone: buildPersonalizedOverview(),

  primaryTheme:
    prediction.primaryTheme
      ? {
          ...prediction.primaryTheme,

          prediction:
  prediction.primaryTheme.manifestationId === null
    ? prediction.primaryTheme.prediction
    : [
        narrativeVariant?.prediction ??
          prediction.primaryTheme.prediction,
        contextualMoonPrediction,
      ]
        .filter(Boolean)
        .join(" "),

  action:
  prediction.primaryTheme.manifestationId === null
    ? prediction.primaryTheme.action
    : [
        narrativeVariant?.action ??
          prediction.primaryTheme.action,
        contextualMoonAction ?? moonPadaAction,
      ]
        .filter(Boolean)
        .join(" "),

avoid:
  prediction.primaryTheme.manifestationId === null
    ? prediction.primaryTheme.avoid
    : contextualMoonCaution ??
      prediction.primaryTheme.avoid,
        }
      : null,
};
return {
  ...personalizedPrediction,
  dailyComparison,
  explanation: primaryActivation
    ? {
    moonPadaContext:
  moonPadaData?.nakshatra && moonPadaData?.pada
    ? {
        nakshatra: moonPadaData.nakshatra,
        pada: moonPadaData.pada,
        navamsaSign: moonPadaData.navamsaSign,
        navamsaLord: moonPadaData.navamsaLord,
        coreTheme:
          currentMoonPadaInterpretation?.coreTheme ?? null,
        interpretiveThemes:
          currentMoonPadaInterpretation?.interpretiveThemes ?? [],
        actionStyles:
          currentMoonPadaInterpretation?.actionStyles ?? [],
        cautionStyles:
          currentMoonPadaInterpretation?.cautionStyles ?? [],
        predictionDirection: moonPredictionDirection,
        actionDirection: moonThemeDirection,
        cautionDirection: moonCautionDirection,
      }
    : null,

padaContext: relevantPadaContext,
        area: primaryActivation.area,
        polarity: primaryActivation.polarity,
        dashaPlanets:
          primaryActivation.dashaPlanets,
        activatedHouses:
          primaryActivation.activatedHouses,
        transitMatches:
  primaryActivation.transitMatches.map(
    (match) => ({
      planet: match.transitPlanet,
      source: match.transitSource,
      polarity: match.transitPolarity,
    })
  ),
        manifestation:
          selectedManifestation
            ? {
                label:
                  selectedManifestation.label,
                matchedPrimaryHouses:
                  selectedManifestation
                    .matchedPrimaryHouses,
                matchedSupportingHouses:
                  selectedManifestation
                    .matchedSupportingHouses,
                discriminatorPlanetMatches:
                  selectedManifestation
                    .discriminatorPlanetMatches,
                    primaryDiscriminatorPlanetMatches:
  selectedManifestation
    .primaryDiscriminatorPlanetMatches,
                transitDiscriminatorPlanetMatches:
                  selectedManifestation
                    .transitDiscriminatorPlanetMatches,
              }
            : null,
      }
    : null,
};
}