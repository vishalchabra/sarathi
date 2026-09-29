// FILE: src/server/astro/debug.ts
export function astroDebug(...args: any[]) {
  if (process.env.ASTRO_DEBUG === "1") {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
}
