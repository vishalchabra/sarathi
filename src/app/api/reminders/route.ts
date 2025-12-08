import { NextRequest, NextResponse } from "next/server";
import { store, type Reminder } from "@/server/core/store";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  const { userId = "demo", title, fireAtISO, meta } = await req.json();
  if (!title || !fireAtISO) return NextResponse.json({ error: "Missing title or fireAtISO" }, { status: 400 });
  const r: Reminder = { id: crypto.randomUUID(), userId, title, fireAtISO, meta };
  store.addReminder(userId, r);
  return NextResponse.json({ ok: true, reminder: r });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") ?? "demo";
  const rows = store.getReminders(userId);
  return NextResponse.json({ reminders: rows });
}
