import "server-only";

import type { User } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type RegistrationEligibility = {
  registeredAt: number;
  confirmedAt: number;
  trialEligible: boolean;
};

export async function getRegistrationEligibility(
  user: User
): Promise<RegistrationEligibility | null> {
  try {
    if (!user.email_confirmed_at) return null;

    const registeredAt = Date.parse(user.created_at);
    const confirmedAt = Date.parse(user.email_confirmed_at);
    const now = Date.now();

    if (
      !Number.isFinite(registeredAt) ||
      !Number.isFinite(confirmedAt) ||
      registeredAt > now ||
      confirmedAt > now ||
      confirmedAt < registeredAt ||
      now - registeredAt > 7 * 86400000
    ) {
      return null;
    }

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select(
        "created_at, role, astrologer_access, data_engine_grandfathered"
      )
      .eq("id", user.id)
      .maybeSingle();

    if (
      error ||
      !profile ||
      profile.astrologer_access !== true ||
      profile.role === "admin" ||
      profile.role === "support"
    ) {
      return null;
    }

    const profileCreatedAt =
      Date.parse(profile.created_at);

    if (
      !Number.isFinite(profileCreatedAt) ||
      profileCreatedAt > now
    ) {
      return null;
    }

    const { data: subscription, error: subscriptionError } =
      await supabaseAdmin
        .from("subscriptions")
        .select("provider_subscription_id")
        .eq("user_id", user.id)
        .in("status", ["active", "trialing"])
        .or(
          `ends_at.is.null,ends_at.gt.${new Date().toISOString()}`
        )
        .limit(1)
        .maybeSingle();

    if (subscriptionError) return null;

    const trialEligible =
      !subscription &&
      !profile.data_engine_grandfathered &&
      now < profileCreatedAt + 86400000;

    return {
      registeredAt: Math.floor(registeredAt / 1000),
      confirmedAt: Math.floor(confirmedAt / 1000),
      trialEligible,
    };
  } catch {
    return null;
  }
}