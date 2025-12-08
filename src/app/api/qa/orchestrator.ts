// FILE: src/app/api/qa/orchestrator.ts
import "server-only";

import {
  orchestrateQA as baseOrchestrateQA,
  type Category,
  type Inputs,
} from "@/lib/qa/orchestrator";

// Re-export the types so any existing imports keep working
export type { Category, Inputs } from "@/lib/qa/orchestrator";

/**
 * Thin server wrapper that delegates to the shared QA orchestrator.
 * This keeps the real logic in src/lib/qa/orchestrator.ts (Turbopack-safe).
 */
export async function orchestrateQA(input: Inputs) {
  return baseOrchestrateQA(input);
}
