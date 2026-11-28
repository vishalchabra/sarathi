export type NodeMode = "mean" | "true";

// Mean Node is the system fallback. Saved and explicit conventions take priority.
export const DEFAULT_CLIENT_NODE_MODE: NodeMode = "mean";

export function isNodeMode(value: unknown): value is NodeMode {
  return value === "mean" || value === "true";
}

export function requireNodeMode(value: unknown): NodeMode {
  if (!isNodeMode(value)) {
    throw new Error("Invalid lunar node convention.");
  }

  return value;
}

export function resolveActiveNodeMode(input: {
  selectedNodeMode?: NodeMode | null;
  savedNodeMode?: NodeMode | null;
  preferredNodeMode?: NodeMode | null;
}): NodeMode {
  const value =
    input.selectedNodeMode ??
    input.savedNodeMode ??
    input.preferredNodeMode ??
    DEFAULT_CLIENT_NODE_MODE;

  return requireNodeMode(value);
}

export function getNodeModeLabel(mode: NodeMode): string {
  return requireNodeMode(mode) === "mean"
    ? "Mean Node"
    : "True Node";
}

export const NODE_MODE_OPTIONS: ReadonlyArray<{
  value: NodeMode;
  label: string;
  description: string;
}> = [
  {
    value: "mean",
    label: "Mean Node",
    description: "Uses the averaged motion of the lunar nodes.",
  },
  {
    value: "true",
    label: "True Node",
    description: "Includes periodic variations in lunar node motion.",
  },
];
