// FILE: src/app/api/ai-daily/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

let cachedClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey });
  }
  return cachedClient;
}

async function handle(req: Request) {
  const openai = getOpenAIClient();

  // If no key is configured (like on Vercel right now), don't crash – just respond safely.
  if (!openai) {
    return NextResponse.json(
      {
        error: "OPENAI_API_KEY is not configured on the server.",
        message:
          "AI Daily is disabled in this environment. Add OPENAI_API_KEY to enable it.",
      },
      { status: 500 }
    );
  }

  // TODO: Your real logic here – for now just return a stub
  // so build can succeed.
  return NextResponse.json({
    ok: true,
    message: "AI Daily route is wired; add your OpenAI call here.",
  });
}

// Support both GET and POST to keep it flexible
export const GET = handle;
export const POST = handle;
