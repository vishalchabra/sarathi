export const META_CONSENT_COOKIE =
  "sarathi_meta_consent_v1";

export const META_CONSENT_VERSION = 1;

export const META_CONSENT_MAX_AGE =
  60 * 60 * 24 * 180;

export type MetaConsentRecord = {
  version: number;
  marketing: boolean;
  updatedAt: number;
};

export function createMetaConsentRecord(
  marketing: boolean
): MetaConsentRecord {
  return {
    version: META_CONSENT_VERSION,
    marketing,
    updatedAt: Date.now(),
  };
}

export function parseMetaConsentRecord(
  value: string | undefined
): MetaConsentRecord | null {
  if (!value || value.length > 512) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);

    if (
      !parsed ||
      parsed.version !== META_CONSENT_VERSION ||
      typeof parsed.marketing !== "boolean" ||
      !Number.isSafeInteger(parsed.updatedAt) ||
      parsed.updatedAt <= 0
    ) {
      return null;
    }

    const now = Date.now();

    if (
      parsed.updatedAt > now ||
      now - parsed.updatedAt >
        META_CONSENT_MAX_AGE * 1000
    ) {
      return null;
    }

    return {
      version: parsed.version,
      marketing: parsed.marketing,
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return null;
  }
}