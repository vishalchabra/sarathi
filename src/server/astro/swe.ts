// FILE: src/server/astro/swe.ts
import "server-only";

let sweInstance: any | null = null;
let sweLoadError: Error | null = null;

/**
 * Lazy getter for the swisseph module.
 * Throws with the underlying error message if loading fails.
 */
export function getSwe() {
  if (sweInstance) return sweInstance;

  if (sweLoadError) {
    // Re-throw but keep the original message so logs are useful
    throw new Error(
      `swisseph unavailable: ${(sweLoadError as any)?.message ?? sweLoadError}`
    );
  }

  try {
    // Helpful: log where Node tries to resolve from
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const resolved = require.resolve("swisseph");
      console.log("[SARATHI] swisseph resolved at:", resolved);
    } catch (e) {
      console.error("[SARATHI] require.resolve('swisseph') failed:", e);
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const swe = require("swisseph");
    console.log("[SARATHI] swisseph loaded OK");
    sweInstance = swe;
    return sweInstance;
  } catch (err: any) {
    console.error("[SARATHI] Failed to load swisseph (root error):", err);
    sweLoadError = err instanceof Error ? err : new Error(String(err));
    throw new Error(
      `swisseph unavailable: ${(sweLoadError as any)?.message ?? sweLoadError}`
    );
  }
}

/**
 * Small helper to call a swisseph function safely.
 */
export async function sweCall<R = any>(
  fn: string,
  ...args: any[]
): Promise<R> {
  const swe = getSwe();
  const f = (swe as any)[fn];
  if (typeof f !== "function") {
    throw new Error(`swisseph function not found: ${fn}`);
  }
  return f(...args) as R;
}
