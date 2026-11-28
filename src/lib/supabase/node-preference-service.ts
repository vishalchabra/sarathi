import { createClient } from "@/lib/supabase/client";
import {
  requireNodeMode,
  type NodeMode,
} from "@/lib/node-mode";

function getClient() {
  return createClient();
}

export async function getPreferredNodeMode(): Promise<NodeMode> {
  const client = getClient();

  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser();

  if (authError) throw authError;

  if (!user) {
    throw new Error("Please sign in to load your preferences.");
  }

  const { data, error } = await client
    .from("profiles")
    .select("preferred_node_mode")
    .eq("id", user.id)
    .single();

  if (error) throw error;

  return requireNodeMode(data.preferred_node_mode);
}

export async function updatePreferredNodeMode(
  mode: NodeMode
): Promise<NodeMode> {
  const nodeMode = requireNodeMode(mode);
  const client = getClient();

  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser();

  if (authError) throw authError;

  if (!user) {
    throw new Error("Please sign in to update your preferences.");
  }

  const { data, error } = await client
    .from("profiles")
    .update({
      preferred_node_mode: nodeMode,
    })
    .eq("id", user.id)
    .select("preferred_node_mode")
    .single();

  if (error) throw error;

  const savedMode = requireNodeMode(
    data.preferred_node_mode
  );

  if (savedMode !== nodeMode) {
    throw new Error("Unable to confirm saved node preference.");
  }

  return savedMode;
}
