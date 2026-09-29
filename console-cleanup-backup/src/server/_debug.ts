export function dbgEnabled(key: string) {
  // Turn on via: DEBUG_TRANSITS=1 pnpm dev
  const envKey = `DEBUG_${key.toUpperCase()}`;
  return process.env.NODE_ENV !== "production" && process.env[envKey] === "1";
}

export function dbg(key: string, ...args: any[]) {
  if (dbgEnabled(key)) console.log(...args);
}
