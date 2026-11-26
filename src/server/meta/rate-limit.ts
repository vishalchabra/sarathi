import "server-only";

import { createHmac } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getMetaClientIp } from "./permissions";

export type MetaRateLimitScope =
  | "consent_grant"
  | "consent_status"
  | "discovery_session"
  | "discovery_ip";

export type MetaRateLimitResult =
  | "allowed"
  | "limited"
  | "unavailable";

export async function checkMetaRateLimit(
  scope: MetaRateLimitScope,
  identifier: string
): Promise<MetaRateLimitResult> {
  const secret =
    process.env.META_RATE_LIMIT_SECRET?.trim();

  if (
    !secret ||
    secret.length < 32 ||
    !identifier ||
    identifier.length > 256
  ) {
    return "unavailable";
  }

  try {
    const keyHash = createHmac("sha256", secret)
      .update("sarathi-meta-rate-limit-v1")
      .update("\0")
      .update(scope)
      .update("\0")
      .update(identifier)
      .digest("hex");

    const { data, error } = await supabaseAdmin.rpc(
      "meta_check_rate_limit",
      {
        p_scope: scope,
        p_key_hash: keyHash,
      }
    );

    if (error || typeof data !== "boolean") {
      return "unavailable";
    }

    return data ? "allowed" : "limited";
  } catch {
    return "unavailable";
  }
}

export async function checkMetaIpRateLimit(
  scope: MetaRateLimitScope,
  headers: Headers
): Promise<MetaRateLimitResult> {
  const ip = getMetaClientIp(headers);

  if (!ip) {
    return "unavailable";
  }

  return checkMetaRateLimit(scope, ip);
}