import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";
import type { MetaEvent } from "@/lib/meta/events";

export async function claimMetaEvent(
  eventId: string,
  eventName: MetaEvent,
  sessionId: string
): Promise<"claimed" | "duplicate" | "unavailable"> {
  try {
    const { error } = await supabaseAdmin
      .from("meta_event_dispatch")
      .insert({
        event_id: eventId,
        event_name: eventName,
        consent_session_id: sessionId,
        status: "processing",
        attempt_count: 1,
      });

    if (!error) return "claimed";

    if (error.code === "23505") {
      return "duplicate";
    }

    return "unavailable";
  } catch {
    return "unavailable";
  }
}

export async function finishMetaEvent(
  eventId: string,
  sessionId: string,
  status: "sent" | "failed" | "cancelled"
): Promise<boolean> {
  try {
    const now = new Date().toISOString();

    const { error } = await supabaseAdmin
      .from("meta_event_dispatch")
      .update({
        status,
        updated_at: now,
        sent_at: status === "sent" ? now : null,
      })
      .eq("event_id", eventId)
      .eq("consent_session_id", sessionId)
      .eq("status", "processing");

    return !error;
  } catch {
    return false;
  }
}