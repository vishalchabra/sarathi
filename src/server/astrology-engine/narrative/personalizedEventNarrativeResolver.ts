import type {
  CandidateEventTheme,
} from "../judgement/eventActivationEngine";

import {
  resolveMoneyEventExpression,
  composeMoneyPredictionV2,
  resolveEducationEventExpression,
  composeEducationPredictionV2,
  resolveCareerEventExpression,
  composeCareerPredictionV2,
  resolveMindEventExpression,
  composeMindPredictionV2,
  resolveHomeEventExpression,
  composeHomePredictionV2,
  resolveFamilyEventExpression,
  composeFamilyPredictionV2,
  resolveHealthEventExpression,
  composeHealthPredictionV2,
  resolveRelationshipEventExpression,
  composeRelationshipPredictionV2,
  resolveChildrenEventExpression,
  composeChildrenPredictionV2,
  resolveTravelEventExpression,
  composeTravelPredictionV2,
  resolveCommunicationEventExpression,
  composeCommunicationPredictionV2,
  resolvePublicImageEventExpression,
  composePublicImagePredictionV2,
  resolveHiddenMattersEventExpression,
  composeHiddenMattersPredictionV2,
  resolvePropertyEventExpression,
  composePropertyPredictionV2,
  resolveSpiritualityEventExpression,
  composeSpiritualityPredictionV2,
} from "./eventExpressionLibrary";

import type {
  EventExpressionEvidence,
  EventStageResult,
  PadaExpressionModeResult,
} from "./eventExpressionLibrary";

export type PersonalizedEventNarrativeInput = {
  manifestation: CandidateEventTheme;
  eventStage: EventStageResult;
  padaExpressionMode: PadaExpressionModeResult;
};

export type PersonalizedEventNarrativeResult = {
  manifestationId: CandidateEventTheme["id"];
  area: CandidateEventTheme["area"];
  prediction: string;
  action?: string;
  caution?: string;
  expressionId: string;
  stage: EventStageResult["stage"];
  padaMode: PadaExpressionModeResult["mode"];
};

export function buildEventExpressionEvidence(
  manifestation: CandidateEventTheme
): EventExpressionEvidence {
  return {
    matchedPrimaryHouses:
      manifestation.matchedPrimaryHouses,

    matchedSupportingHouses:
      manifestation.matchedSupportingHouses,

    primaryHouseScore:
      manifestation.primaryHouseScore,

    supportingHouseScore:
      manifestation.supportingHouseScore,

    evidenceScore:
      manifestation.evidenceScore,

    primaryPlanetConfirmationCount:
      manifestation.primaryPlanetConfirmationCount,

    planetConfirmationCount:
      manifestation.planetConfirmationCount,

    discriminatorPlanetMatches:
      manifestation.discriminatorPlanetMatches,

    primaryDiscriminatorPlanetMatches:
      manifestation.primaryDiscriminatorPlanetMatches,

    discriminatorSourceMatches:
      manifestation.discriminatorSourceMatches,

    matchedDiscriminatorEvidence:
      manifestation.matchedDiscriminatorEvidence,

    transitDiscriminatorPlanetMatches:
      manifestation.transitDiscriminatorPlanetMatches,

    matchedTransitDiscriminatorEvidence:
      manifestation.matchedTransitDiscriminatorEvidence,

    discriminatorConfidence:
      manifestation.discriminatorConfidence,
  };
}

function resolveFinancialManifestationGuidance(
  manifestationId: CandidateEventTheme["id"]
): { action: string; caution: string } | null {
  switch (manifestationId) {
    case "money_outflow":
      return {
        action:
          "Review upcoming payments, verify amounts due and distinguish necessary expenses from discretionary spending.",
        caution:
          "Avoid unnecessary expenditure or making a payment before verifying the amount and recipient.",
      };

    case "money_planning":
      return {
        action:
          "Review your budget, existing commitments and available funds before deciding how to allocate money.",
        caution:
          "Avoid making financial commitments based on income that has not yet been received.",
      };

    case "money_accumulation":
      return {
        action:
          "Review your savings position and identify what can reasonably be set aside after meeting essential commitments.",
        caution:
          "Avoid locking away funds that may be required for immediate obligations or emergencies.",
      };

    case "money_settlement":
      return {
        action:
          "Check outstanding dues, reconcile the relevant records and clarify any remaining settlement requirements.",
        caution:
          "Avoid treating a financial obligation as settled until the payment or closure has been verified.",
      };

    default:
      return null;
  }
}

export function resolvePersonalizedEventNarrative(
  input: PersonalizedEventNarrativeInput
): PersonalizedEventNarrativeResult | null {
  const {
    manifestation,
    eventStage,
    padaExpressionMode,
  } = input;

  const common = {
    manifestationId: manifestation.id,
    area: manifestation.area,
    stage: eventStage.stage,
    padaMode: padaExpressionMode.mode,
  };

  const predictionOnly = (
    expressionId: string,
    prediction: string
  ): PersonalizedEventNarrativeResult | null => {
    if (!prediction.trim()) {
      return null;
    }

    return {
      ...common,
      expressionId,
      prediction,
    };
  };

  switch (manifestation.area) {
    case "money": {
      const expression = resolveMoneyEventExpression(
        manifestation.id,
        buildEventExpressionEvidence(manifestation)
      );

      if (!expression) {
        return null;
      }

      const narrative = composeMoneyPredictionV2(
        expression,
        eventStage,
        padaExpressionMode
      );

      if (!narrative) {
        return null;
      }

      return {
        ...common,
        expressionId: expression.expressionId,
        prediction: narrative.prediction,
        action:
          resolveFinancialManifestationGuidance(manifestation.id)?.action
          ?? narrative.action,
        caution:
          resolveFinancialManifestationGuidance(manifestation.id)?.caution
          ?? narrative.caution,
      };
    }

    case "education": {
      const expression = resolveEducationEventExpression(
        manifestation.id,
        manifestation.matchedSupportingHouses,
        manifestation.discriminatorPlanetMatches
      );

      if (!expression) {
        return null;
      }

      return predictionOnly(
        expression.expressionId,
        composeEducationPredictionV2(
          expression,
          eventStage,
          padaExpressionMode
        )
      );
    }


    case "career": {
      const expression = resolveCareerEventExpression(
        manifestation.id
      );

      if (!expression) {
        return null;
      }

      return predictionOnly(
        expression.expressionId,
        composeCareerPredictionV2(
          expression,
          eventStage,
          padaExpressionMode
        )
      );
    }


    case "mind": {
      const expression = resolveMindEventExpression(
        manifestation.id
      );

      if (!expression) {
        return null;
      }

      return predictionOnly(
        expression.expressionId,
        composeMindPredictionV2(
          expression,
          eventStage,
          padaExpressionMode
        )
      );
    }


    case "home": {
      const expression = resolveHomeEventExpression(
        manifestation.id
      );

      if (!expression) {
        return null;
      }

      return predictionOnly(
        expression.expressionId,
        composeHomePredictionV2(
          expression,
          eventStage,
          padaExpressionMode
        )
      );
    }


    case "family": {
      const expression = resolveFamilyEventExpression(
        manifestation.id
      );

      if (!expression) {
        return null;
      }

      return predictionOnly(
        expression.expressionId,
        composeFamilyPredictionV2(
          expression,
          eventStage,
          padaExpressionMode
        )
      );
    }


    case "health": {
      const expression = resolveHealthEventExpression(
        manifestation.id
      );

      if (!expression) {
        return null;
      }

      return predictionOnly(
        expression.expressionId,
        composeHealthPredictionV2(
          expression,
          eventStage,
          padaExpressionMode
        )
      );
    }


    case "relationships": {
      const expression = resolveRelationshipEventExpression(
        manifestation.id
      );

      if (!expression) {
        return null;
      }

      return predictionOnly(
        expression.expressionId,
        composeRelationshipPredictionV2(
          expression,
          eventStage,
          padaExpressionMode
        )
      );
    }


    case "children": {
      const expression = resolveChildrenEventExpression(
        manifestation.id
      );

      if (!expression) {
        return null;
      }

      return predictionOnly(
        expression.expressionId,
        composeChildrenPredictionV2(
          expression,
          eventStage,
          padaExpressionMode
        )
      );
    }


    case "travel": {
      const expression = resolveTravelEventExpression(
        manifestation.id
      );

      if (!expression) {
        return null;
      }

      return predictionOnly(
        expression.expressionId,
        composeTravelPredictionV2(
          expression,
          eventStage,
          padaExpressionMode
        )
      );
    }


    case "communication": {
      const expression = resolveCommunicationEventExpression(
        manifestation.id
      );

      if (!expression) {
        return null;
      }

      return predictionOnly(
        expression.expressionId,
        composeCommunicationPredictionV2(
          expression,
          eventStage,
          padaExpressionMode
        )
      );
    }


    case "publicImage": {
      const expression = resolvePublicImageEventExpression(
        manifestation.id
      );

      if (!expression) {
        return null;
      }

      return predictionOnly(
        expression.expressionId,
        composePublicImagePredictionV2(
          expression,
          eventStage,
          padaExpressionMode
        )
      );
    }


    case "hiddenMatters": {
      const expression = resolveHiddenMattersEventExpression(
        manifestation.id
      );

      if (!expression) {
        return null;
      }

      return predictionOnly(
        expression.expressionId,
        composeHiddenMattersPredictionV2(
          expression,
          eventStage,
          padaExpressionMode
        )
      );
    }


    case "property": {
      const expression = resolvePropertyEventExpression(
        manifestation.id
      );

      if (!expression) {
        return null;
      }

      return predictionOnly(
        expression.expressionId,
        composePropertyPredictionV2(
          expression,
          eventStage,
          padaExpressionMode
        )
      );
    }


    case "spirituality": {
      const expression = resolveSpiritualityEventExpression(
        manifestation.id
      );

      if (!expression) {
        return null;
      }

      return predictionOnly(
        expression.expressionId,
        composeSpiritualityPredictionV2(
          expression,
          eventStage,
          padaExpressionMode
        )
      );
    }


    default:
      return null;
  }
}
