import type {
  ReasoningSection,
} from "./types";

export type AstrologerThoughtProcess = {
  promise: any;

  timing: any;

  reasoning:
    ReasoningSection[];

  sequence: any;

  risks: any;

  actions: any;

  story: ReasoningSection | null;
};

export function buildThoughtProcess(params: {
  promise: any;

  timing: any;

  reasoning?: ReasoningSection[];

  sequence?: any;

  risks?: any;

  actions?: any;

  story?: ReasoningSection | null;
}): AstrologerThoughtProcess {
  return {
    promise:
      params.promise ?? null,

    timing:
      params.timing ?? null,

    reasoning:
      params.reasoning ?? [],

    sequence:
      params.sequence ?? null,

    risks:
      params.risks ?? null,

    actions:
      params.actions ?? null,

    story:
      params.story ?? null,
  };
}