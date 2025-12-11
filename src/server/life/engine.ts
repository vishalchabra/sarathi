// FILE: src/server/life/engine.ts
"use server";

import "server-only";

// Re-use the canonical Vimshottari implementation
import type {
  Birth as AstroBirth,
  MDT as AstroMDT,
} from "@/server/astro/vimshottari";
import { vimshottariMDTable as astroVimshottariMDTable } from "@/server/astro/vimshottari";

// Keep the same exported types so existing imports don't break
export type Birth = AstroBirth;
export type MDT = AstroMDT;

// Thin wrapper – delegate to the astro/vimshottari version
export async function vimshottariMDTable(birth: Birth): Promise<MDT[]> {
  return astroVimshottariMDTable(birth);
}
