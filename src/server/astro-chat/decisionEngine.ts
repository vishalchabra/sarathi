import type { CanonicalChartContext } from "@/server/astro-chat/chartContext";

export type DecisionLevel = "proceed" | "prepare" | "wait" | "avoid";

export type AstroDecision = {
  eventKey: string;
  level: DecisionLevel;
  headline: string;
  rationale: string;
  do: string[];
  avoid: string[];
  stage: "preparation" | "activation" | "conversion" | "completion";
};

function conversionVerdict(bundle: any): string {
  return String(bundle?.conversionDiagnosisV2?.verdict ?? "");
}

function timingVerdict(bundle: any): string {
  return String(bundle?.timingLayer?.verdict ?? "unclear");
}

export function buildAstroDecision(params: {
  bundle: any;
  chartContext: CanonicalChartContext;
}): AstroDecision {
  const { bundle } = params;
  const eventType = String(bundle?.eventType ?? bundle?.careerEventType ?? bundle?.topic ?? "generic");
  const conversion = conversionVerdict(bundle);
  const timing = timingVerdict(bundle);
if (eventType === "profession_identity") {
  return {
    eventKey: eventType,
    level: "prepare",
    stage: "preparation",
    headline:
      "Judge this profession from long-term natural suitability and vocational fit.",

    rationale:
      "Profession suitability should be assessed from enduring chart strengths, capability alignment, career patterns, and divisional confirmation rather than current timing.",

    do: [
      "Assess the profession against the native's strongest capabilities",
      "Compare the requested profession with other strong career-fit profiles",
      "Identify the strengths and gaps that would shape long-term success in this field",
    ],

    avoid: [
      "Using current dasha or transits to judge permanent professional suitability",
      "Treating temporary timing conditions as proof for or against a long-term career path",
    ],
  };
}
  if (eventType === "job_change") {
    if (conversion === "conversion_favored") {
      return {
        eventKey: eventType,
        level: "proceed",
        stage: "conversion",
        headline: "Pursue a genuine employer change during the selected window.",
        rationale: "The chart supports carrying the process beyond exploration into offer, acceptance and joining.",
        do: ["Target roles that improve authority, compensation or long-term trajectory", "Pursue interviews actively during the selected window", "Negotiate before accepting"],
        avoid: ["Resigning before receiving a written offer", "Changing employers merely to escape temporary frustration"],
      };
    }
    return {
      eventKey: eventType,
      level: "prepare",
      stage: "preparation",
      headline: "Explore opportunities, but do not force an immediate exit.",
      rationale: "The current combination supports opening the process more clearly than completing the employer change.",
      do: ["Strengthen the CV and evidence of performance", "Build a selective recruiter and industry network", "Interview without resigning prematurely"],
      avoid: ["Leaving without a confirmed offer", "Applying indiscriminately without a role strategy"],
    };
  }

  if (eventType === "promotion") {
    return {
      eventKey: eventType,
      level: conversion === "conversion_favored" ? "proceed" : "prepare",
      stage: conversion === "conversion_favored" ? "conversion" : "activation",
      headline: conversion === "conversion_favored" ? "Formalise the promotion discussion." : "Build recognition, but insist on formal conversion.",
      rationale: conversion === "conversion_favored" ? "Recognition has a clearer route to title, authority and compensation." : "Visibility may increase before the organisation converts it into a formal promotion.",
      do: ["Document measurable outcomes", "Seek senior sponsorship", "Ask for title, scope and compensation criteria"],
      avoid: ["Accepting indefinite additional responsibility without formal recognition"],
    };
  }

  if (bundle?.topic === "business") {
    const strongEnough = conversion === "conversion_favored" || timing === "strong";
    return {
      eventKey: "business",
      level: strongEnough ? "proceed" : "prepare",
      stage: strongEnough ? "activation" : "preparation",
      headline: strongEnough ? "Begin with a controlled launch and validate revenue early." : "Develop the business alongside existing income before depending on it fully.",
      rationale: strongEnough ? "The timing can support visible commercial action, but stability still depends on execution and cash flow." : "The chart may support business capacity, while the current timing is better suited to testing, clients and groundwork than an all-in transition.",
      do: ["Validate paying demand before scaling", "Start with a defined offer and customer segment", "Track cash flow and compliance from the beginning"],
      avoid: ["Leaving stable employment before recurring revenue develops", "Committing large capital before proving demand", "Entering vague partnerships without written roles and exit terms"],
    };
  }

  return {
    eventKey: eventType,
    level: conversion === "conversion_favored" ? "proceed" : timing === "weak" ? "wait" : "prepare",
    stage: conversion === "conversion_favored" ? "conversion" : "preparation",
    headline: conversion === "conversion_favored" ? "Proceed carefully during the selected window." : "Prepare the conditions before committing.",
    rationale: conversion === "conversion_favored" ? "The main astrological layers align sufficiently for practical action." : "The promise or timing is not yet coherent enough for an irreversible decision.",
    do: ["Clarify the desired outcome", "Complete practical checks", "Act when real-world confirmation appears"],
    avoid: ["Treating an astrological window as a guarantee"],
  };
}
