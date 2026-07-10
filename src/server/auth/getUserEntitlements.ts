import "server-only";
import { createClient } from "@/lib/supabase/server";

const FREE_ASK_LIMIT = 2;

type Plan = "free" | "pro" | "premium";

export type UserEntitlements = {
  plan: Plan;
  role: "user" | "admin" | "astrologer" | "support";
  askSarathi: {
  allowed: boolean;
  freeRemaining: number;
  purchasedRemaining: number;
  totalRemaining: number;
  totalUsed: number;
};
  dataEngine: {
    allowed: boolean;
    trialEndsAt: string | null;
  };
  lifeReport: {
    allowed: boolean;
  };
  consultation: {
    allowed: boolean;
  };
};

function isActiveSubscription(sub: any) {
  if (!sub) return false;

  const activeStatuses = ["active", "trialing"];
  const statusOk = activeStatuses.includes(sub.status);

  const notExpired =
    !sub.ends_at || new Date(sub.ends_at).getTime() > Date.now();

  return statusOk && notExpired;
}

export async function getUserEntitlements(
  userId: string
): Promise<UserEntitlements> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("created_at, role")
    .eq("id", userId)
    .maybeSingle();

  const {
  data: { user },
} = await supabase.auth.getUser();

const profileCreatedAt = profile?.created_at ?? user?.created_at ?? null;

  const trialEndsAt = profileCreatedAt
    ? new Date(new Date(profileCreatedAt).getTime() + 24 * 60 * 60 * 1000)
    : null;

  let { data: wallet } = await supabase
  .from("user_wallets")
  .select("*")
  .eq("user_id", userId)
  .maybeSingle();

if (!wallet) {
  const { data: createdWallet } = await supabase
    .from("user_wallets")
    .insert({
      user_id: userId,
      free_credits_remaining: FREE_ASK_LIMIT,
      purchased_credits_remaining: 0,
      total_credits_used: 0,
    })
    .select("*")
    .single();

  wallet = createdWallet;
}

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .in("status", ["active", "trialing"])
    .order("created_at", { ascending: false })
    .maybeSingle();

  const { data: lifeReportPurchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", userId)
    .eq("product", "life_report")
    .eq("status", "paid")
    .maybeSingle();

  const hasActiveSubscription = isActiveSubscription(subscription);
  const isAdmin = profile?.role === "admin";
  const plan = hasActiveSubscription
    ? ((subscription.plan ?? "pro") as Plan)
    : "free";

  const freeRemaining = Number(wallet?.free_credits_remaining ?? 0);
const purchasedRemaining = Number(wallet?.purchased_credits_remaining ?? 0);
const totalUsed = Number(wallet?.total_credits_used ?? 0);
const totalRemaining = freeRemaining + purchasedRemaining;

  

  return {
    plan,
    role: (profile?.role ?? "user") as UserEntitlements["role"],
    askSarathi: {
  allowed: isAdmin || hasActiveSubscription || totalRemaining > 0,
  freeRemaining: isAdmin ? 999999 : freeRemaining,
  purchasedRemaining: isAdmin ? 999999 : purchasedRemaining,
  totalRemaining: isAdmin ? 999999 : totalRemaining,
  totalUsed,
},

    dataEngine: {
  // Temporary open access until payment and upgrade flow are live.
  allowed: true,
  trialEndsAt: null,
},

    lifeReport: {
      allowed: isAdmin || hasActiveSubscription || Boolean(lifeReportPurchase),
    },

    consultation: {
      allowed: true,
    },
  };
}