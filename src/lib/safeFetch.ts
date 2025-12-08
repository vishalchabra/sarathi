// FILE: src/lib/safeFetch.ts
export async function safeFetchJSON<T = any>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json", ...(init?.headers || {}) },
    ...init,
  });

  if (!res.ok) {
    const body = await res.text(); // Could be HTML error page
    throw new Error(
      `Fetch failed ${res.status} ${res.statusText} at ${url}\n` +
      `Body (first 300 chars): ${body.slice(0, 300)}`
    );
  }

  const ctype = res.headers.get("content-type") || "";
  if (!ctype.includes("application/json")) {
    const body = await res.text();
    throw new Error(
      `Expected JSON but got "${ctype}" at ${url}\n` +
      `Body (first 300 chars): ${body.slice(0, 300)}`
    );
  }

  return (await res.json()) as T;
}

export function tryParseJSON<T = any>(s: string): T | null {
  try { return JSON.parse(s) as T; } catch { return null; }
}
