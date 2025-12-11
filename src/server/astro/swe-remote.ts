// FILE: src/server/astro/swe-remote.ts
import "server-only";

const ENGINE_URL =
  process.env.SARATHI_ASTRO_ENGINE_URL || "http://localhost:4000";

type SweCallPayload = { method: string; args: any[] };

async function callSwe<T = any>(payload: SweCallPayload): Promise<T> {
  const res = await fetch(`${ENGINE_URL}/swe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `remote swisseph error: HTTP ${res.status} ${res.statusText} ${text}`
    );
  }

  const json = (await res.json()) as {
    ok: boolean;
    result?: T;
    error?: string;
    message?: string;
  };

  if (!json.ok) {
    throw new Error(
      `remote swisseph error: ${json.error || "UNKNOWN"} ${
        json.message || ""
      }`
    );
  }

  return json.result as T;
}

export async function sweCall<T = any>(
  method: string,
  ...args: any[]
): Promise<T> {
  return callSwe<T>({ method, args });
}

export type SweConstants = {
  SE_GREG_CAL: number;
  SE_SUN: number;
  SE_MOON: number;
  SE_MERCURY: number;
  SE_VENUS: number;
  SE_MARS: number;
  SE_JUPITER: number;
  SE_SATURN: number;
  SE_MEAN_NODE: number;
  SE_TRUE_NODE: number;
  SEFLG_SWIEPH: number;
  SEFLG_SIDEREAL: number;
  SEFLG_SPEED: number;
};

let cachedConstants: SweConstants | null = null;

export async function getSweConstants(): Promise<SweConstants> {
  if (cachedConstants) return cachedConstants;

  const res = await fetch(`${ENGINE_URL}/constants`, {
    method: "GET",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `remote swisseph constants error: HTTP ${res.status} ${res.statusText} ${text}`
    );
  }

  const json = (await res.json()) as {
    ok: boolean;
    constants?: SweConstants;
    error?: string;
    message?: string;
  };

  if (!json.ok || !json.constants) {
    throw new Error(
      `remote swisseph constants error: ${json.error || "UNKNOWN"} ${
        json.message || ""
      }`
    );
  }

  cachedConstants = json.constants;
  return cachedConstants;
}

// Convenience wrapper for swe_julday
export async function sweJulday(
  year: number,
  month: number,
  day: number,
  hour: number,
  gregFlag = 1
): Promise<number> {
  return sweCall<number>("swe_julday", year, month, day, hour, gregFlag);
}
