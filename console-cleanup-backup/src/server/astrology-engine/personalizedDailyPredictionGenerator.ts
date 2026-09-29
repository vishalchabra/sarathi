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

  console.log(
    "[DAILY_MOON_SIGNALS]",
    JSON.stringify(
      {
        date: input.selectedDateISO,
        ascendant: input.ascendant,
        moon: {
          sign: enrichedSky.moon.sign,
          nakshatra: enrichedSky.moon.nakshatra,
          pada: enrichedSky.moon.pada ?? null,
        },
        signals: ascendantJudgement.rankedSignals
          .filter((signal) =>
            moonSources.has(signal.source)
          )
          .map((signal) => ({
            source: signal.source,
            area: signal.area,
            planet: signal.planet ?? null,
            importance: signal.importance,
            polarity: signal.polarity,
          })),
      },
      null,
      2
    )
  );
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

    activatedSambandha =
  resolveDashaSambandha(
    dasha,
    natalSambandha
  );

    if (process.env.NODE_ENV !== "production") {
      console.log(
        "[DASHA_SAMBANDHA]",
        JSON.stringify(
          {
            date: input.selectedDateISO,
            ascendant: input.ascendant,
            activePeriods: dasha.activePeriods,
            connections: activatedSambandha.map(
              (connection) => ({
                connectionId:
                  connection.connectionId,
                planets: connection.planets,
                relationshipTypes:
                  connection.relationshipTypes,
                activePlanets:
                  connection.activePlanets,
                activePlanetCount:
                  connection.activePlanetCount,
                connectedHouses:
                  connection.connectedHouses,
              })
            ),
          },
          null,
          2
        )
      );
    }
  }
if (process.env.NODE_ENV !== "production") {
  console.log(
    "[DASHA_AREA_CHECK]",
    JSON.stringify(
      {
        date: input.selectedDateISO,
        areas: dasha.periodAreaActivations.map(
          (area) => ({
            area: area.area,
            score: area.score,
            confirmationCount:
              area.confirmationCount,
            contributors: area.contributors.map(
              (contributor) => ({
                planet: contributor.planet,
              })
            ),
          })
        ),
      },
      null,
      2
    )
  );
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
  });

const priorities =
  buildDailyPriorities(
    events.activations
  );
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
  console.log(
    "[PERIOD_VS_DAILY]",
    JSON.stringify(
      {
        date: input.selectedDateISO,
        moon: {
          sign: enrichedSky.moon.sign,
          nakshatra: enrichedSky.moon.nakshatra,
        },
        currentPrimary: priorities.primary
          ? {
              area: priorities.primary.area,
              score: priorities.primary.dailyPriorityScore,
            }
          : null,
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
              b.strongestImportance -
                a.strongestImportance ||
              b.signalCount - a.signalCount
          ),
      },
      null,
      2
    )
  );
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
  console.log(
    "[DAILY_THEME_CHECK]",
    JSON.stringify(
      {
        date: input.selectedDateISO,
        ascendant: input.ascendant,
        moon: {
          sign: enrichedSky.moon.sign,
          nakshatra: enrichedSky.moon.nakshatra,
          pada: enrichedSky.moon.pada ?? null,
        },
        dasha: input.dasha,
        primaryTheme: prediction.primaryTheme
          ? {
              area: prediction.primaryTheme.area,
              polarity: prediction.primaryTheme.polarity,
              manifestationId:
                prediction.primaryTheme.manifestationId,
              priorityScore:
                prediction.primaryTheme.priorityScore,
            }
          : null,
        secondaryThemes:
          prediction.secondaryThemes.map((theme) => ({
            area: theme.area,
            polarity: theme.polarity,
            priorityScore: theme.priorityScore,
          })),
        priorities,
      },
      null,
      2
    )
  );
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
          primaryPada?.nakshatra ?? null,

        pada:
          primaryPada?.pada ?? null,
      })
    : null;

const buildPersonalizedOverview = (): string => {
  if (!prediction.primaryTheme || !narrativeVariant) {
    return prediction.overallTone;
  }

  const primary = prediction.primaryTheme;
  const secondary = prediction.secondaryThemes[0];

  const secondaryLabel =
    secondary?.manifestationLabel?.toLowerCase() ??
    secondary?.area
      .replace(/([A-Z])/g, " $1")
      .toLowerCase();

  const secondarySentence = secondaryLabel
    ? ` ${secondaryLabel.charAt(0).toUpperCase()}${secondaryLabel.slice(1)} may also need your attention.`
    : "";

  const focus =
    primary.manifestationLabel?.toLowerCase() ??
    primary.area
      .replace(/([A-Z])/g, " $1")
      .toLowerCase();

  const summaryVariations = {
    supportive: [
      `${focus} is highlighted today, with room for constructive progress.`,
      `Today brings a supportive emphasis to ${focus}.`,
      `There may be an opportunity to move forward with ${focus} today.`,
    ],
    challenging: [
      `${focus} may require additional care and attention today.`,
      `A measured approach to ${focus} will be useful today.`,
      `Some pressure around ${focus} may call for patience today.`,
    ],
    mixed: [
      `${focus} is active today, with both opportunity and practical considerations.`,
      `Developments around ${focus} may require a balanced approach today.`,
      `${focus} deserves attention as the situation continues to develop.`,
    ],
  };

  const variations =
  primary.polarity === "neutral"
    ? summaryVariations.mixed
    : summaryVariations[primary.polarity];

  const selectedNarrativeIndex = [
    narrativeVariant.prediction,
    narrativeVariant.action,
    narrativeVariant.avoid,
  ].join("|").length % variations.length;

  const selectedSummary =
    variations[selectedNarrativeIndex];

const overview =
  narrativeVariant.summary ?? selectedSummary;

return (
  overview.charAt(0).toUpperCase() +
  overview.slice(1) +
  secondarySentence
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
    : narrativeVariant?.prediction ??
      prediction.primaryTheme.prediction,

          action:
            narrativeVariant?.action ??
            prediction.primaryTheme.action,

          avoid:
            narrativeVariant?.avoid ??
            prediction.primaryTheme.avoid,
        }
      : null,
};
return {
  ...personalizedPrediction,
  dailyComparison,
  explanation: primaryActivation
    ? {
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