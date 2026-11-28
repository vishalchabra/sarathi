import {
  requireNodeMode,
  type NodeMode,
} from "@/lib/node-mode";

import {
  getPreferredNodeMode,
} from "@/lib/supabase/node-preference-service";

export async function resolvePersonalNodeMode(
  profile?: unknown
): Promise<NodeMode> {
  const saved = profile as {
    nodeMode?: unknown;
    node_mode?: unknown;
  } | null | undefined;

  if (
    saved?.nodeMode !== undefined &&
    saved?.node_mode !== undefined &&
    saved.nodeMode !== saved.node_mode
  ) {
    throw new Error("Conflicting saved calculation conventions.");
  }

  const mode = saved?.nodeMode ?? saved?.node_mode;

  if (mode !== undefined && mode !== null) {
    return requireNodeMode(mode);
  }

  return requireNodeMode(await getPreferredNodeMode());
}

export function verifyPersonalNodeResponse(
  result: unknown,
  requestedNodeMode: NodeMode
): void {
  const metadata = result as {
    nodeMode?: unknown;
    nodeCalculationVersion?: unknown;
  } | null;

  if (
    metadata?.nodeMode !== requestedNodeMode ||
    metadata?.nodeCalculationVersion !== "lahiri-swiss-node-v1"
  ) {
    throw new Error(
      "Calculation convention could not be verified. Please try again."
    );
  }
}