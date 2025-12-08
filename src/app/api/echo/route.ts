import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  return NextResponse.json({ ok: true, received: json });
}

export async function GET() {
  return NextResponse.json({ ok: true, hint: "POST to /api/echo" });
}
