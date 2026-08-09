export const runtime =
  "nodejs";

import "server-only";

import {
  NextResponse,
} from "next/server";

import {
  buildAstrologyIntelligenceEngine,
} from "@/server/astrology-intelligence/buildAstrologyIntelligenceEngine";

import {
  chartFactsFixture,
} from "@/server/astrology-intelligence/fixtures/chartFactsFixture";

import {
  resolveReasoningRequest,
} from "@/server/astrology-intelligence/reasoning/resolveReasoningRequest";

import {
  matchTargetProfile,
} from "@/server/astrology-intelligence/capability-matcher/matchTargetProfile";

import {
  buildReasoningTrace,
} from "@/server/astrology-intelligence/reasoning-traversal/buildReasoningTrace";

import {
  buildReasoningTraceSummary,
} from "@/server/astrology-intelligence/presenters/buildReasoningTraceSummary";

import type {
  CapabilityMatchResult,
} from "@/server/astrology-intelligence/capability-matcher/types";

import type {
  ReasoningTraceSummary,
} from "@/server/astrology-intelligence/presenters/buildReasoningTraceSummary";

import type {
  ChartFacts,
} from "@/server/astrology-intelligence/contracts/facts";
import {
  buildKnowledgeAudit,
} from "@/server/astrology-intelligence/audit/buildKnowledgeAudit";
type RequestBody = {
  chartFacts?: ChartFacts;
  useFixture?: boolean;
  question?: string;
};

type MatchWithTrace = {
  match:
    CapabilityMatchResult;

  trace:
    ReasoningTraceSummary;
};

export async function POST(
  request: Request
) {
  /*
   * This endpoint must never run in production.
   */
  if (
    process.env.NODE_ENV ===
    "production"
  ) {
    return NextResponse.json(
      {
        ok: false,

        error:
          "Development endpoint is unavailable in production.",
      },
      {
        status: 404,
      }
    );
  }

  try {
    const body =
      (await request.json()) as
        RequestBody;

    const chartFacts =
      body.chartFacts ??
      (
        body.useFixture
          ? chartFactsFixture
          : null
      );

    if (!chartFacts) {
      return NextResponse.json(
        {
          ok: false,

          error:
            "Provide chartFacts or set useFixture to true.",
        },
        {
          status: 400,
        }
      );
    }

    const question =
      body.question?.trim() ||
      "Should I become an astrologer?";

    const intelligence =
      buildAstrologyIntelligenceEngine(
        chartFacts
      );
    const knowledgeAudit =
  buildKnowledgeAudit();
    const reasoning =
      resolveReasoningRequest({
        question,

        matcherStore:
          intelligence
            .capabilityMatcher,
      });

    const matches:
      MatchWithTrace[] =
      reasoning.targets
        .map(
          (
            resolvedTarget
          ): MatchWithTrace | null => {
            const profile =
              intelligence
                .capabilityMatcher
                .byKey[
                  resolvedTarget
                    .profileKey
                ];

            if (!profile) {
              return null;
            }

            const match =
              matchTargetProfile({
                target:
                  profile,

                capabilities:
                  intelligence
                    .capabilities,

                ontology:
                  intelligence
                    .capabilityOntology,
              });

            const trace =
              buildReasoningTrace({
                target:
                  profile,

                match,

                facts:
                  intelligence
                    .reasoningFacts,

                capabilities:
                  intelligence
                    .capabilities,

                ontology:
                  intelligence
                    .capabilityOntology,

                links:
                  intelligence
                    .reasoningLinks,
              });

            const traceSummary =
              buildReasoningTraceSummary(
                trace
              );

            return {
              match,

              trace:
                traceSummary,
            };
          }
        )
        .filter(
          (
            result
          ): result is MatchWithTrace =>
            result !== null
        );

    return NextResponse.json({
      ok: true,

      charged:
        false,

      naturalizerCalled:
        false,

      question,

      reasoning,

      matches,
      knowledgeAudit,
      strongestCapabilities:
        intelligence
          .capabilities
          .strongest
          .slice(
            0,
            15
          )
          .map(
            (capability) => ({
              key:
                capability.key,

              label:
                capability.label,

              category:
                capability.category,

              score:
                capability.score,

              confidence:
                capability.confidence,

              strength:
                capability.strength,

              currentlyActive:
                capability
                  .activation
                  .currentlyActive,
            })
          ),

      reasoningLinkCounts: {
        total:
          intelligence
            .reasoningLinks
            .links
            .length,

        factCapability:
          (
            intelligence
              .reasoningLinks
              .byType
              .fact_capability ??
            []
          ).length,

        capabilityExpression:
          (
            intelligence
              .reasoningLinks
              .byType
              .capability_expression ??
            []
          ).length,

        expressionTarget:
          (
            intelligence
              .reasoningLinks
              .byType
              .expression_target ??
            []
          ).length,
      },

      engineWarnings:
        intelligence.warnings,
    });
  } catch (error) {
    console.error(
      "[DEV_CAPABILITY_MATCHER_ERROR]",
      error
    );

    return NextResponse.json(
      {
        ok: false,

        error:
          error instanceof Error
            ? error.message
            : "Capability matcher test failed.",
      },
      {
        status: 500,
      }
    );
  }
}