import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyMetaSession } from "./store";

export async function hasAstrologerAcquisition(
  sessionId: string,
  revision: number,
  beforeTime: number = Date.now()
): Promise<boolean> {
  try {
    if (!(await verifyMetaSession(sessionId, revision))) {
      return false;
    }

    const earliest = new Date(
      beforeTime - 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    const latest = new Date(beforeTime).toISOString();

    const { data, error } = await supabaseAdmin
      .from("meta_event_dispatch")
      .select("event_id")
      .eq("consent_session_id", sessionId)
      .eq("status", "sent")
      .in("event_name", [
        "ViewContent",
        "AstrologerTrialIntent",
        "AstrologerPlanIntent",
        "AstrologerPricingView",
      ])
      .gte("created_at", earliest)
      .lte("created_at", latest)
      .limit(1);

    return !error && Boolean(data?.length);
  } catch {
    return false;
  }
}