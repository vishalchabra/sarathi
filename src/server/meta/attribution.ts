import "server-only";

import { createHmac } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

import type {
  MetaConversionEvent,
} from "@/lib/meta/events";

import {
  verifyMetaSession,
} from "./store";

export type AttributionType =
  | "registration"
  | "trial"
  | "checkout";

export type ConversionAttribution = {
  sessionId: string;
  revision: number;
};

function hashReference(
  namespace: string,
  reference: string
): string | null {
  const secret =
    process.env.META_CONVERSION_SECRET?.trim();

  if (
    !secret ||
    secret.length < 32 ||
    !reference ||
    reference.length > 512
  ) {
    return null;
  }

  return createHmac("sha256", secret)
    .update("sarathi-meta-conversion-v1")
    .update("\0")
    .update(namespace)
    .update("\0")
    .update(reference)
    .digest("hex");
}

export function createConversionEventId(
  eventName: MetaConversionEvent,
  reference: string
): string | null {
  return hashReference(
    `event:${eventName}`,
    reference
  );
}

export async function saveConversionAttribution(
  type: AttributionType,
  reference: string,
  attribution: ConversionAttribution
): Promise<boolean> {
  try {
    const referenceHash = hashReference(
      `attribution:${type}`,
      reference
    );

    if (!referenceHash) return false;

    if (
      !(await verifyMetaSession(
        attribution.sessionId,
        attribution.revision
      ))
    ) {
      return false;
    }

    const { error } = await supabaseAdmin
      .from("meta_conversion_attribution")
      .insert({
        conversion_type: type,
        reference_hash: referenceHash,
        consent_session_id: attribution.sessionId,
        consent_revision: attribution.revision,
        source_path: "/sarathi/astrologers",
      });

    return !error;
  } catch {
    return false;
  }
}

export async function readConversionAttribution(
  type: AttributionType,
  reference: string
): Promise<ConversionAttribution | null> {
  try {
    const referenceHash = hashReference(
      `attribution:${type}`,
      reference
    );

    if (!referenceHash) return null;

    const { data, error } = await supabaseAdmin
      .from("meta_conversion_attribution")
      .select(
        "consent_session_id, consent_revision"
      )
      .eq("conversion_type", type)
      .eq("reference_hash", referenceHash)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (error || !data) return null;

    const attribution = {
      sessionId: data.consent_session_id,
      revision: Number(data.consent_revision),
    };

    if (
      !(await verifyMetaSession(
        attribution.sessionId,
        attribution.revision
      ))
    ) {
      return null;
    }

    return attribution;
  } catch {
    return null;
  }
}