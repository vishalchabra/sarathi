import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { isMetaSessionId, verifyMetaSession } from "./store";

export const META_CONSENT_COOKIE = "sarathi_meta_consent_v1";
export const META_CONSENT_MAX_AGE = 180 * 24 * 60 * 60;

export type MetaConsentToken = {
  version: 2;
  marketing: true;
  sessionId: string;
  revision: number;
  issuedAt: number;
  expiresAt: number;
};

function getConsentSecret(): string | null {
  const secret = process.env.META_CONSENT_SECRET?.trim();
  return secret && secret.length >= 32 ? secret : null;
}

export function isMetaConsentConfigured(): boolean {
  return getConsentSecret() !== null;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
}

export function createMetaConsentToken(
  sessionId: string,
  revision = 1
): string | null {
  const secret = getConsentSecret();

  if (
    !secret ||
    !isMetaSessionId(sessionId) ||
    !Number.isSafeInteger(revision) ||
    revision < 1
  ) {
    return null;
  }

  const issuedAt = Math.floor(Date.now() / 1000);

  const consent: MetaConsentToken = {
    version: 2,
    marketing: true,
    sessionId,
    revision,
    issuedAt,
    expiresAt: issuedAt + META_CONSENT_MAX_AGE,
  };

  const payload = Buffer.from(
    JSON.stringify(consent),
    "utf8"
  ).toString("base64url");

  return `${payload}.${sign(payload, secret)}`;
}

export function parseMetaConsentToken(
  token?: string,
  allowExpired = false
): MetaConsentToken | null {
  const secret = getConsentSecret();

  if (!secret || !token || token.length > 2048) {
    return null;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payload, signature] = parts;
    const expected = Buffer.from(sign(payload, secret));
    const received = Buffer.from(signature);

    if (
      expected.length !== received.length ||
      !timingSafeEqual(expected, received)
    ) {
      return null;
    }

    const consent = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    const now = Math.floor(Date.now() / 1000);

    if (
      consent.version !== 2 ||
      consent.marketing !== true ||
      !isMetaSessionId(consent.sessionId) ||
      !Number.isSafeInteger(consent.revision) ||
      consent.revision < 1 ||
      !Number.isSafeInteger(consent.issuedAt) ||
      !Number.isSafeInteger(consent.expiresAt) ||
      consent.issuedAt > now ||
      (!allowExpired && consent.expiresAt <= now) ||
      consent.expiresAt - consent.issuedAt !==
        META_CONSENT_MAX_AGE
    ) {
      return null;
    }

    return consent;
  } catch {
    return null;
  }
}

export async function verifyMetaConsentToken(
  token?: string
): Promise<boolean> {
  const consent = parseMetaConsentToken(token);

  if (!consent) return false;

  return verifyMetaSession(
    consent.sessionId,
    consent.revision
  );
}

export function getMetaConsentCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: META_CONSENT_MAX_AGE,
  };
}