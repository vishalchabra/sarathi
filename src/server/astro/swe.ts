// FILE: src/server/astro/swe.ts
import "server-only";

let sweInstance: any | null = null;
let sweLoadError: Error | null = null;

/**
 * Lazy getter for the swisseph module.
 * Throws "swisseph unavailable" if the native module can't be loaded.
 */
export function getSwe() {
  if (sweInstance) return sweInstance;
  if (sweLoadError) {
    throw new Error("swisseph unavailable");
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const swe = require("swisseph");
    sweInstance = swe;
    return sweInstance;
  } catch (err: any) {
    console.error("[SARATHI] Failed to load swisseph:", err);
    sweLoadError = err;
    throw new Error("swisseph unavailable");
  }
}

/**
 * Small helper to call a swisseph function safely.
 */
export async function sweCall<
  T extends keyof any = any,
  R = any
>(fn: T, ...args: any[]): Promise<R> {
  const swe = getSwe();
  const f = (swe as any)[fn as any];
  if (typeof f !== "function") {
    throw new Error(`swisseph function not found: ${String(fn)}`);
  }
  return f(...args) as R;
}
