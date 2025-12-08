// FILE: src/lib/getPlanetInsights.ts
export type PlanetRow = { name: string; sign?: string; house?: number; nakshatra?: string };
export type AspectRow =
  | { from: string; to: string; type: string; orb?: number } // array shape
  | never;

type Payload =
  | {
      planets?: PlanetRow[];
      aspects?: AspectRow[];    // <-- array shape (supports "H5" etc.)
    }
  | {
      planets?: PlanetRow[];
      aspectsMap?: Record<string, Array<{ onto: string; type: string; orb?: number }>>; // map shape
    };

export async function getPlanetInsights(report: Payload, opts?: { debug?: boolean }) {
  const query = opts?.debug ? "?debug=1" : "";
  const res = await fetch(`/api/ai-planets${query}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ report }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`ai-planets failed: ${res.status} ${t}`);
  }
  return res.json();
}
