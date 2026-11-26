import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isMetaSessionId(
  value: unknown
): value is string {
  return (
    typeof value === "string" &&
    UUID_PATTERN.test(value)
  );
}

export async function createMetaSession():
  Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin.rpc(
      "meta_create_consent_session"
    );

    if (error || !isMetaSessionId(data)) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export async function verifyMetaSession(
  sessionId: string,
  revision: number
): Promise<boolean> {
  if (
    !isMetaSessionId(sessionId) ||
    !Number.isSafeInteger(revision) ||
    revision < 1
  ) {
    return false;
  }

  try {
    const { data, error } = await supabaseAdmin.rpc(
      "meta_verify_consent_session",
      {
        p_session_id: sessionId,
        p_revision: revision,
      }
    );

    return !error && data === true;
  } catch {
    return false;
  }
}

export async function revokeMetaSession(
  sessionId: string
): Promise<boolean> {
  if (!isMetaSessionId(sessionId)) {
    return false;
  }

  try {
    const { data, error } = await supabaseAdmin.rpc(
      "meta_revoke_consent_session",
      {
        p_session_id: sessionId,
      }
    );

    return !error && data === true;
  } catch {
    return false;
  }
}