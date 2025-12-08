// FILE: src/server/cache/simpleCache.ts
// Very simple in-memory cache with TTL (time-to-live)

type CacheEntry<T = any> = {
  value: T;
  expiresAt: number;
};

const CACHE = new Map<string, CacheEntry>();

/**
 * Read from cache.
 * Returns null if missing or expired.
 */
export function cacheGet<T = any>(key: string): T | null {
  const entry = CACHE.get(key);
  if (!entry) return null;

  if (entry.expiresAt < Date.now()) {
    CACHE.delete(key);
    return null;
  }

  return entry.value as T;
}

/**
 * Write to cache.
 * ttlMs: how long to keep it (in milliseconds).
 */
export function cacheSet<T = any>(key: string, value: T, ttlMs: number): void {
  const expiresAt = Date.now() + ttlMs;
  CACHE.set(key, { value, expiresAt });
}

/**
 * Helper to build a stable cache key.
 * Pass anything serialisable (birth data, dates, feature, version).
 */
export function makeCacheKey(parts: any): string {
  return JSON.stringify(parts);
}
