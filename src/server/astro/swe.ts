// FILE: src/server/astro/swe.ts
import "server-only";

/**
 * Minimal Swiss Ephemeris facade for Sarathi.
 *
 * IMPORTANT:
 * - This version is 100% server-safe on Vercel.
 * - It does NOT load any native binaries or WASM.
 * - We keep the same shape (swe, constants, sweCall) so existing
 *   code can compile without pulling swisseph.wasm into the bundle.
 */

export type SweEngine = Record<string, never>;
export type SweConstants = Record<string, never>;

// Generic sweCall type: adapt if any call sites need stricter typing
export type SweCall = (
  fnName: string,
  ...args: any[]
) => Promise<any>;

export async function getSwe(): Promise<{
  swe: SweEngine;
  constants: SweConstants;
  sweCall: SweCall;
}> {
  // No WASM, no native libraries.
  // If any old code still tries to call sweCall, it will throw a clear error
  // so we can find & refactor that usage.
  const swe: SweEngine = {};
  const constants: SweConstants = {};

  const sweCall: SweCall = async (fnName: string, ..._args: any[]) => {
    throw new Error(
      `Swiss Ephemeris (WASM/native) is disabled in this build. ` +
        `Attempted to call sweCall("${fnName}"). ` +
        `Please migrate this logic to our pure TypeScript astro providers.`
    );
  };

  return { swe, constants, sweCall };
}
