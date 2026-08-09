import {
  classifyAstroQuestion,
  type QuestionClassification,
} from "./questionClassifier";

import {
  getBusinessReasoningProfile,
  type BusinessReasoningProfile,
} from "./businessReasoningProfiles";

import {
  buildBusinessReasoning,
  type BusinessReasoningResult,
} from "./businessReasoningEngine";

import {
  composeBusinessGuidance,
  type BusinessComposedGuidance,
} from "./businessResponseComposer";

import {
  createBusinessV2ResponseContract,
  type AstroChatV2Response,
} from "./responseContract";

export type AstroChatV2OrchestratorInput = {
  question: string;

  /*
   * This is the existing astrology bundle produced by the current
   * Astro Chat engine. V2 does not recalculate the chart here.
   */
  bundle: any;
};

export type AstroChatV2OrchestratorResult = {
  classification: QuestionClassification;
  profile: BusinessReasoningProfile;
  reasoning: BusinessReasoningResult;
  guidance: BusinessComposedGuidance;
  response: AstroChatV2Response;
};

function assertSupportedTopic(
  classification: QuestionClassification
): void {
  if (
    classification.topic !==
    "business"
  ) {
    throw new Error(
      `Astro Chat v2 milestone 1 currently supports business questions only. Received topic "${classification.topic}".`
    );
  }
}

export function runAstroChatV2(
  input: AstroChatV2OrchestratorInput
): AstroChatV2OrchestratorResult {
  const {
    question,
    bundle,
  } = input;

  const classification =
    classifyAstroQuestion(
      question
    );

  assertSupportedTopic(
    classification
  );

  const profile =
    getBusinessReasoningProfile(
      classification
    );

  const reasoning =
    buildBusinessReasoning({
      classification,
      profile,
      bundle,
    });

  const guidance =
    composeBusinessGuidance({
      profile,
      reasoning,
    });

  const response =
    createBusinessV2ResponseContract({
      classification,
      reasoning,
      profileStages:
        profile.lifecycleStages,
      guidance,
    });

  return {
    classification,
    profile,
    reasoning,
    guidance,
    response,
  };
}

export function tryRunAstroChatV2(
  input: AstroChatV2OrchestratorInput
):
  | AstroChatV2OrchestratorResult
  | null {
  try {
    return runAstroChatV2(
      input
    );
  } catch {
    return null;
  }
}
