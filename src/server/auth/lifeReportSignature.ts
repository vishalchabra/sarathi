import "server-only";

import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

const PURPOSE = "sarathi-life-report-pdf-v1";
const VALIDITY_MS = 24 * 60 * 60 * 1000;

function getSecret(): string {
  const secret = process.env.LIFE_REPORT_SIGNING_SECRET;

  if (!secret || secret.length < 64) {
    throw new Error("Life Report signing secret is not configured.");
  }

  return secret;
}

function canonicalJson(value: unknown): string {
  if (value === null) return "null";

  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(",")}]`;
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;

    return `{${Object.keys(record)
      .filter((key) => record[key] !== undefined)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${canonicalJson(record[key])}`
      )
      .join(",")}}`;
  }

  const encoded = JSON.stringify(value);

  if (encoded === undefined) {
    throw new Error("Unsupported report value.");
  }

  return encoded;
}

function calculateSignature(
  userId: string,
  expiresAt: number,
  report: unknown
): string {
  return createHmac("sha256", getSecret())
    .update(
      canonicalJson({
        purpose: PURPOSE,
        userId,
        expiresAt,
        report,
      })
    )
    .digest("hex");
}

export function signLifeReport(
  userId: string,
  report: unknown
) {
  if (!userId || !report || typeof report !== "object") {
    throw new Error("Invalid report signing input.");
  }

  const expiresAt = Date.now() + VALIDITY_MS;

  return {
    expiresAt,
    signature: calculateSignature(
      userId,
      expiresAt,
      report
    ),
  };
}

export function verifyLifeReportSignature(
  userId: string,
  report: unknown,
  proof: unknown
): boolean {
  if (
    !userId ||
    !report ||
    typeof report !== "object" ||
    !proof ||
    typeof proof !== "object"
  ) {
    return false;
  }

  const { expiresAt, signature } = proof as {
    expiresAt?: unknown;
    signature?: unknown;
  };

  if (
    typeof expiresAt !== "number" ||
    !Number.isSafeInteger(expiresAt) ||
    expiresAt <= Date.now() ||
    expiresAt > Date.now() + VALIDITY_MS ||
    typeof signature !== "string" ||
    !/^[a-f0-9]{64}$/.test(signature)
  ) {
    return false;
  }

  const expected = calculateSignature(
    userId,
    expiresAt,
    report
  );

  return timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(signature, "hex")
  );
}
