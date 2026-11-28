import "server-only";

import React from "react";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getUserEntitlements } from "@/server/auth/getUserEntitlements";
import { verifyLifeReportSignature } from "@/server/auth/lifeReportSignature";
import { NODE_CALCULATION_VERSION } from "@/server/astro/lunarNodes";
import LifeReportPdf from "@/components/pdf/LifeReportPdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 4 * 1024 * 1024;

const PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
};

function reject(message: string, status: number) {
  return NextResponse.json(
    { ok: false, error: message },
    {
      status,
      headers: PRIVATE_HEADERS,
    }
  );
}

class RequestTooLarge extends Error {}

async function readLimitedJson(req: Request) {
  const declaredLength = req.headers.get("content-length");

  if (
    declaredLength !== null &&
    Number(declaredLength) > MAX_BODY_BYTES
  ) {
    throw new RequestTooLarge();
  }

  if (!req.body) {
    throw new Error("Missing request body.");
  }

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      total += value.byteLength;

      if (total > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RequestTooLarge();
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  return JSON.parse(
    Buffer.concat(chunks).toString("utf8")
  );
}

export async function POST(req: Request) {
  try {
    const authorization = req.headers.get("authorization");

    const bearer = authorization !== null
      ? /^Bearer ([^\s]+)$/i.exec(authorization.trim())
      : null;

    if (authorization !== null && !bearer) {
      return reject("Invalid authorization header.", 401);
    }

    const supabase = bearer
      ? createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            global: {
              headers: {
                Authorization: `Bearer ${bearer[1]}`,
              },
            },
            auth: {
              persistSession: false,
              autoRefreshToken: false,
            },
          }
        )
      : await createClient();

    const { data, error } = bearer
      ? await supabase.auth.getUser(bearer[1])
      : await supabase.auth.getUser();

    if (error || !data.user) {
      return reject("Please sign in again.", 401);
    }

    const entitlements = await getUserEntitlements(
      data.user.id,
      supabase
    );

    if (entitlements.lifeReport.allowed !== true) {
      return reject("Life Report access required.", 403);
    }

    const contentType = req.headers.get("content-type") ?? "";

    if (
      contentType.split(";")[0].trim().toLowerCase() !==
      "application/json"
    ) {
      return reject("JSON request required.", 415);
    }

    let body: any;

    try {
      body = await readLimitedJson(req);
    } catch (error) {
      if (error instanceof RequestTooLarge) {
        return reject("Report exceeds export size limit.", 413);
      }

      return reject("Invalid report request.", 400);
    }

    const report = body?.report;
    const proof = body?.pdfProof;

    if (
      !report ||
      typeof report !== "object" ||
      Array.isArray(report) ||
      !proof
    ) {
      return reject("Signed report required.", 400);
    }

    if (
      !verifyLifeReportSignature(
        data.user.id,
        report,
        proof
      )
    ) {
      return reject(
        "Report verification failed. Please regenerate your Life Report.",
        403
      );
    }

    if (
      (report.nodeMode !== "mean" &&
        report.nodeMode !== "true") ||
      report.nodeCalculationVersion !== NODE_CALCULATION_VERSION
    ) {
      return reject(
        "Report calculation version has changed. Please regenerate.",
        409
      );
    }

    const profileName = String(
      report.name ??
      report.birth?.name ??
      "Life Report"
    );

    const document = React.createElement(
      LifeReportPdf,
      {
        report,
        profileName,
        dashaTimeline: report.mahadashaTimeline ?? [],
        monthlyInsights: report.monthlyInsights ?? [],
        weeklyInsights: report.weeklyInsights ?? [],
        dailyHighlights: report.dailyHighlights ?? [],
        transits: report.transits ?? [],
        jobPrediction: report.jobPrediction ?? null,
        ascSign: report.ascSign,
        moonSign: report.moonSign,
        sunSign: report.sunSign,
      }
    );

    const buffer = await renderToBuffer(
      document as Parameters<typeof renderToBuffer>[0]
    );

    return new Response(
      new Uint8Array(buffer),
      {
        status: 200,
        headers: {
          ...PRIVATE_HEADERS,
          "Content-Type": "application/pdf",
          "Content-Disposition":
            'attachment; filename="Sarathi-Life-Report.pdf"',
          "Content-Length": String(buffer.byteLength),
        },
      }
    );
  } catch {
    console.error("[life-report/pdf] PDF export failed");

    return reject(
      "Unable to prepare your PDF. Please try again.",
      500
    );
  }
}
