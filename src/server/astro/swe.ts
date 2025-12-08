// FILE: src/server/astro/swe.ts
import "server-only";
import { createRequire } from "module";
import path from "path";

let _swe: any | null = null;
let _siderealSet = false;

export function getSwe() {
  if (_swe) {
    ensureSidereal(_swe);
    return _swe;
  }

  try {
    const require = createRequire(import.meta.url);
    const mod = require("swisseph");

    // Normalize CJS/ESM
    const api =
      (mod && mod.swe_julday && mod) ||
      (mod?.default && mod.default.swe_julday && mod.default) ||
      (mod?.swe && mod.swe.swe_julday && mod.swe);
    if (!api?.swe_julday) throw new Error("Unexpected swisseph export shape");

    // Ephemeris path
    const pkgDir = path.dirname(require.resolve("swisseph/package.json"));
    const epheDir = path.join(pkgDir, "ephe");
    try {
      if (typeof api.swe_set_ephe_path === "function") api.swe_set_ephe_path(epheDir);
      else if (typeof (api as any).set_ephe_path === "function") (api as any).set_ephe_path(epheDir);
    } catch {}

    _swe = api;
    ensureSidereal(_swe);
    return _swe;
  } catch (e) {
    console.error("[SARATHI] Failed to load swisseph:", e);
    _swe = {
      SE_GREG_CAL: 1, SE_SUN: 0, SE_MOON: 1,
      SEFLG_SWIEPH: 2, SEFLG_SIDEREAL: 64, SEFLG_SPEED: 256,
      SE_SIDM_LAHIRI: 1, swe_set_sid_mode() {}, swe_set_ephe_path() {},
      swe_get_ayanamsa_ut() { return NaN; },
      swe_julday() { throw new Error("swisseph unavailable"); },
      swe_calc_ut() { return { longitude: 0, x: [0,0,0,0,0,0] }; },
    };
    return _swe;
  }
}

function ensureSidereal(swe: any) {
  if (_siderealSet) return;
  try {
    // 👉 pick sidereal mode by env (default LAHIRI)
    const wanted = (process.env.VIM_SIDM || "LAHIRI").toUpperCase(); // e.g. "KRISHNAMURTI", "RAMAN"
    const mode = swe[`SE_SIDM_${wanted}`] ?? swe.SE_SIDM_LAHIRI;
    swe.swe_set_sid_mode(mode, 0, 0);
    _siderealSet = true;
  } catch {}
}
