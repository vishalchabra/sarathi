import type {
  AstrologyIntelligenceEngineResult,
} from "../astrologyIntelligenceTypes";

import {
  buildBusinessIntelligenceSummary,
} from "./buildBusinessIntelligenceSummary";

import {
  buildCareerIntelligenceSummary,
} from "./buildCareerIntelligenceSummary";

export type IntelligenceDomain =
  | "career"
  | "money"
  | "relationships"
  | "marriage"
  | "health"
  | "property"
  | "relocation"
  | "vehicle"
  | "disputes"
  | "child"
  | "education"
  | "parents"
  | "siblings"
  | "business"
  | "travel"
  | "spiritual"
  | "reputation"
  | "debt"
  | "inheritance"
  | "mental_health"
  | "pets"
  | "inner"
  | "generic";

export type DomainIntelligenceContext = {
  domain:
    IntelligenceDomain;

  version:
    "domain-intelligence-v1";

  available:
    boolean;

  profile:
    unknown;

  instructions:
    string[];

  warnings:
    string[];
};

export function buildDomainIntelligenceContext(params: {
  domain:
    IntelligenceDomain;

  intelligence:
    AstrologyIntelligenceEngineResult;
}): DomainIntelligenceContext {
  switch (
    params.domain
  ) {
    case "career": {
      const profile =
        buildCareerIntelligenceSummary(
          params.intelligence
        );

      return {
        domain:
          "career",

        version:
          "domain-intelligence-v1",

        available:
          true,

        profile,

        instructions: [
          "Use strongestCapabilities to explain what the native is naturally better equipped to do professionally.",
          "Use strongestCareerFits as tested career directions, not as guaranteed outcomes.",
          "Treat the highest career fit as the leading direction only when its supporting capabilities are coherent.",
          "Use gaps to explain why a profession may be conditional or weak even when some supporting skills are present.",
          "Use activeCapabilities only for current momentum; do not confuse activation with permanent career suitability.",
          "Separate permanent career suitability from timing for job change, promotion, resignation, or business transition.",
          "Do not override natal promise, dasha, transit, divisional confirmation, or the event timing layer with capability fit alone.",
          "When the user asks about a specific profession, compare that profession against the native's stronger alternatives rather than answering in isolation.",
          "Use confidence to qualify certainty. A high fit score with low confidence should be described as promising but insufficiently confirmed.",
          "Do not expose internal scores unless the user explicitly requests scoring.",
          "Do not mention internal engine names, JSON fields, capability keys, or implementation details.",
        ],

        warnings:
          profile.warnings,
      };
    }

    case "business": {
      const profile =
        buildBusinessIntelligenceSummary(
          params.intelligence
        );

      return {
        domain:
          "business",

        version:
          "domain-intelligence-v1",

        available:
          true,

        profile,

        instructions: [
          "Treat the primary archetype as the leading business pattern.",
          "Use secondary archetypes only as supporting or alternative directions.",
          "Use the strongest dimensions to explain suitability.",
          "Translate suitable models into practical business formats.",
          "Use cautions to qualify execution, capital exposure, partnerships, and risk.",
          "Use current activation only for present momentum, not permanent suitability.",
          "Do not expose internal scores unless the user explicitly requests scoring.",
          "Do not mention internal engine names, JSON fields, or implementation details.",
          "Separate permanent business suitability from timing for launch or expansion.",
        ],

        warnings:
          profile.warnings,
      };
    }

    default:
      return {
        domain:
          params.domain,

        version:
          "domain-intelligence-v1",

        available:
          false,

        profile:
          null,

        instructions: [],

        warnings: [
          `Domain intelligence is not yet implemented for ${params.domain}.`,
        ],
      };
  }
}