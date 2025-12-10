// FILE: src/server/rag/retrieve.ts

import { classifyIntent } from "@/server/reasoner/intent";

export type Ctx = {
  message: string;
  profile: any;
  facts: any;
};

export type RetrievedChunk = {
  id: string;
  title: string;
  body: string;
  tags?: string[];
  score?: number;
};

/**
 * Simple stub RAG retriever.
 * - Uses classifyIntent for future routing
 * - Currently returns an empty chunk list so it’s safe for build.
 * - We can later add ctx.facts / ctx.profile-based heuristics here.
 */
export async function retrieve(ctx: Ctx): Promise<RetrievedChunk[]> {
  const intent = classifyIntent(ctx.message);
  void intent; // avoid unused variable warning for now

  const chunks: RetrievedChunk[] = [];

  // 🔒 NOTE:
  // Any heuristics that use ctx.facts (panchang, hits, etc.)
  // will be added back here later in a type-safe way.

  return chunks;
}
