import { NextRequest, NextResponse } from "next/server";

import {
  getMetaConfig,
  isMetaAllowedOrigin,
} from "@/server/meta/config";

import {
  getMetaRegionalPermission,
} from "@/server/meta/permissions";

import {
  META_CONSENT_COOKIE,
  verifyMetaConsentToken,
} from "@/server/meta/consent";

import {
  isMetaPublicPath,
} from "@/lib/meta/events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function result(permitted: boolean) {
  return NextResponse.json(
    { permitted },
    {
      headers: {
        "Cache-Control": "no-store, private",
        "Vary": "Cookie",
      },
    }
  );
}

export async function GET(request: NextRequest) {
  if (process.env.META_PIXEL_ENABLED !== "true") {
    return result(false);
  }

  const origin = request.nextUrl.origin;

  if (!isMetaAllowedOrigin(origin)) {
    return result(false);
  }

  const fetchSite =
    request.headers.get("sec-fetch-site");

  if (fetchSite !== "same-origin") {
    return result(false);
  }

  const referer = request.headers.get("referer");

  if (!referer) {
    return result(false);
  }

  try {
    const source = new URL(referer);

    if (
      source.origin !== origin ||
      !isMetaPublicPath(source.pathname) ||
      source.search ||
      source.hash
    ) {
      return result(false);
    }
  } catch {
    return result(false);
  }

  const regionalPermission =
    getMetaRegionalPermission(request.headers);

  if (!regionalPermission.permitted) {
    return result(false);
  }

  const consentToken =
    request.cookies.get(META_CONSENT_COOKIE)?.value;

  if (!(await verifyMetaConsentToken(consentToken))) {
    return result(false);
  }

  const config = getMetaConfig();

  if (!config.allowedEvents.has("PageView")) {
    return result(false);
  }

  return result(true);
}