import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    now: new Date().toISOString(),
    vercelEnv: process.env.VERCEL_ENV ?? null,
    gitCommit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    gitMsg: process.env.VERCEL_GIT_COMMIT_MESSAGE ?? null,

    // ✅ add these:
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
    gptModel: process.env.GPT_MODEL ?? null,
  });
}
