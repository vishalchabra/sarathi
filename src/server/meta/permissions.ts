import "server-only";

import { isIP } from "node:net";

export type MetaRegionalPermission = {
  permitted: boolean;
  country: string | null;
  reason:
    | "allowed"
    | "sharing_disabled"
    | "untrusted_environment"
    | "unknown_country"
    | "country_not_allowed";
};

function readAllowedCountries(): ReadonlySet<string> {
  const raw = process.env.META_ALLOWED_COUNTRIES ?? "";

  return new Set(
    raw
      .split(",")
      .map((country) => country.trim().toUpperCase())
      .filter((country) => /^[A-Z]{2}$/.test(country))
  );
}

export function getMetaRegionalPermission(
  headers: Headers
): MetaRegionalPermission {
  if (process.env.META_SOURCE_SHARING_ENABLED !== "true") {
    return {
      permitted: false,
      country: null,
      reason: "sharing_disabled",
    };
  }

  if (
    process.env.VERCEL !== "1" ||
    process.env.VERCEL_ENV !== "production"
  ) {
    return {
      permitted: false,
      country: null,
      reason: "untrusted_environment",
    };
  }

  const country =
    headers.get("x-vercel-ip-country")
      ?.trim()
      .toUpperCase() ?? "";

  if (!/^[A-Z]{2}$/.test(country)) {
    return {
      permitted: false,
      country: null,
      reason: "unknown_country",
    };
  }

  if (!readAllowedCountries().has(country)) {
    return {
      permitted: false,
      country,
      reason: "country_not_allowed",
    };
  }

  return {
    permitted: true,
    country,
    reason: "allowed",
  };
}

export function getMetaClientIp(
  headers: Headers
): string | undefined {
  if (
    process.env.VERCEL !== "1" ||
    process.env.VERCEL_ENV !== "production"
  ) {
    return undefined;
  }

  const ip =
    headers.get("x-vercel-forwarded-for")?.trim();

  if (!ip || isIP(ip) === 0) {
    return undefined;
  }

  return ip;
}

export function getMetaClientUserAgent(
  headers: Headers
): string | undefined {
  const value = headers.get("user-agent")?.trim();

  return value
    ? value.slice(0, 1024)
    : undefined;
}