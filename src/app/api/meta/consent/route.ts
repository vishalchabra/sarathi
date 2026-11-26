import {
  createMetaSession,
  revokeMetaSession,
} from "@/server/meta/store";

import {
  checkMetaIpRateLimit,
} from "@/server/meta/rate-limit";
import { NextRequest, NextResponse } from "next/server";

import {
  META_CONSENT_COOKIE,
  createMetaConsentToken,
  parseMetaConsentToken,
  isMetaConsentConfigured,
  verifyMetaConsentToken,
  getMetaConsentCookieOptions,
} from "@/server/meta/consent";

import {
  isMetaAllowedOrigin,
} from "@/server/meta/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(
  body: Record<string, unknown>,
  status = 200
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, private",
    },
  });
}

function isTrustedOrigin(
  request: NextRequest
): boolean {
  const origin = request.headers.get("origin");

  if (!origin) {
    return false;
  }

  const fetchSite =
    request.headers.get("sec-fetch-site");

  if (
    fetchSite &&
    fetchSite !== "same-origin"
  ) {
    return false;
  }

  if (process.env.NODE_ENV === "development") {
    return (
      origin === request.nextUrl.origin &&
      (
        request.nextUrl.hostname === "localhost" ||
        request.nextUrl.hostname === "127.0.0.1"
      )
    );
  }

  return (
    isMetaAllowedOrigin(origin) &&
    origin === request.nextUrl.origin
  );
}

function clearConsent(
  response: NextResponse
) {
  response.cookies.set(
    META_CONSENT_COOKIE,
    "",
    {
      ...getMetaConsentCookieOptions(),
      maxAge: 0,
      expires: new Date(0),
    }
  );

  return response;
}

export async function GET(
  request: NextRequest
) {
  if (!isMetaAllowedOrigin(request.nextUrl.origin)) {
    return json({ marketing: false }, 403);
  }

  const limit = await checkMetaIpRateLimit(
    "consent_status",
    request.headers
  );

  if (limit !== "allowed") {
    return json(
      { marketing: false },
      limit === "limited" ? 429 : 503
    );
  }

  const token =
    request.cookies.get(META_CONSENT_COOKIE)?.value;

  return json({
    marketing: await verifyMetaConsentToken(token),
  });
}

export async function POST(
  request: NextRequest
) {
  if (!isTrustedOrigin(request)) {
    return json({
      error: "Forbidden",
    }, 403);
  }

  const contentType =
    request.headers.get("content-type") ?? "";

  if (
    contentType.split(";")[0].trim().toLowerCase()
      !== "application/json"
  ) {
    return json({
      error: "Unsupported content type",
    }, 415);
  }

  const length = Number(
    request.headers.get("content-length") ?? "0"
  );

  if (
    !Number.isFinite(length) ||
    length < 0 ||
    length > 1024
  ) {
    return json({
      error: "Invalid request size",
    }, 413);
  }

  let body: unknown;

  try {
    const reader = request.body?.getReader();

    if (!reader) {
      return json({ error: "Missing body" }, 400);
    }

    const decoder = new TextDecoder();
    let raw = "";
    let size = 0;

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      size += value.byteLength;

      if (size > 1024) {
        await reader.cancel();

        return json({
          error: "Request too large",
        }, 413);
      }

      raw += decoder.decode(value, {
        stream: true,
      });
    }

    raw += decoder.decode();

    body = JSON.parse(raw);
  } catch {
    return json({
      error: "Invalid request",
    }, 400);
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("marketing" in body) ||
    typeof body.marketing !== "boolean" ||
    Object.keys(body).length !== 1
  ) {
    return json({
      error: "Invalid consent preference",
    }, 400);
  }

  const existingToken =
    request.cookies.get(META_CONSENT_COOKIE)?.value;

  const existingConsent =
    parseMetaConsentToken(existingToken, true);

  if (body.marketing === false) {
    if (existingToken && !isMetaConsentConfigured()) {
      return json({
        success: false,
        marketing: false,
        error: "Consent service unavailable",
      }, 503);
    }

    if (existingConsent) {
      const revoked = await revokeMetaSession(
        existingConsent.sessionId
      );

      if (!revoked) {
        // Preserve the cookie so withdrawal can be retried.
        return json({
          success: false,
          marketing: false,
          error: "Withdrawal could not be confirmed",
        }, 503);
      }
    }

    return clearConsent(
      json({
        success: true,
        marketing: false,
      })
    );
  }

  if (!isMetaConsentConfigured()) {
    return json({
      success: false,
      marketing: false,
      error: "Consent service unavailable",
    }, 503);
  }

  const limit = await checkMetaIpRateLimit(
    "consent_grant",
    request.headers
  );

  if (limit !== "allowed") {
    return json({
      success: false,
      marketing: false,
      error: "Consent request unavailable",
    }, limit === "limited" ? 429 : 503);
  }

  // Reuse an existing valid session rather than creating
  // another session for repeated consent submissions.
  if (
    existingConsent &&
    await verifyMetaConsentToken(existingToken)
  ) {
    return json({
      success: true,
      marketing: true,
    });
  }

  // Do not replace an expired or revoked signed session
  // through a potentially stale grant request.
  if (existingConsent) {
    return json({
      success: false,
      marketing: false,
      error: "Consent session must be reset",
    }, 409);
  }

  const sessionId = await createMetaSession();

  if (!sessionId) {
    return json({
      success: false,
      marketing: false,
      error: "Consent service unavailable",
    }, 503);
  }

  const token = createMetaConsentToken(sessionId);

  if (!token) {
    await revokeMetaSession(sessionId);

    return json({
      success: false,
      marketing: false,
      error: "Consent service unavailable",
    }, 503);
  }

  const response = json({
    success: true,
    marketing: true,
  });

  response.cookies.set(
    META_CONSENT_COOKIE,
    token,
    getMetaConsentCookieOptions()
  );

  return response;
}