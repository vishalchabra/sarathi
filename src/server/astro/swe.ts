// FILE: src/server/astro/swe.ts
import "server-only";
import SwissEPH from "sweph-wasm";

let swePromise: Promise<any> | null = null;

/**
 * Initialize and cache the sweph-wasm Swiss Ephemeris instance.
 * This runs once per server process and is reused afterwards.
 */
async function initSwe() {
  if (!swePromise) {
    swePromise = (async () => {
      // Load WASM + ephemeris data
      const swe = await SwissEPH.init();

      try {
        // Use default CDN ephemeris path (recommended by sweph-wasm)
        await swe.swe_set_ephe_path();
        console.log("[SARATHI] sweph-wasm initialized with default ephemeris path");
      } catch (e) {
        console.error("[SARATHI] swe_set_ephe_path failed in sweph-wasm:", e);
      }

      return swe;
    })();
  }
  return swePromise;
}

/**
 * Async getter for the Swiss Ephemeris engine (WASM version).
 */
export async function getSwe() {
  return initSwe();
}

/**
 * Small helper to call a Swiss Ephemeris function safely (WASM).
 */
export async function sweCall<R = any>(
  fn: string,
  ...args: any[]
): Promise<R> {
  const swe = await getSwe();
  const f = (swe as any)[fn];
  if (typeof f !== "function") {
    throw new Error(`sweph-wasm function not found: ${fn}`);
  }
  return f(...args) as R;
}
