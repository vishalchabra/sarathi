import "server-only";

type PlanetaryTransitEvent = {
  dateISO: string;
  transitPlanet?: string;
  natalPlanet?: string;
  natalTarget?: string;
  type?: string;
  orb?: number | null;
};

type TransitWindow = {
  transitPlanet: string;
  natalPlanet: string;
  startISO: string;
  peakISO: string;
  endISO: string;
  minOrb: number;
  hitCount: number;
};

function rowKey(r: PlanetaryTransitEvent) {
  return `${r.transitPlanet ?? "—"}__${r.natalPlanet ?? r.natalTarget ?? "—"}`;
}

function isTransitHit(
  row: PlanetaryTransitEvent
): row is PlanetaryTransitEvent & {
  dateISO: string;
  transitPlanet: string;
  natalPlanet: string;
  orb: number;
} {
  const natalPlanet = row?.natalPlanet ?? row?.natalTarget;

  return (
    row?.type === "vedic_hit" &&
    typeof row?.dateISO === "string" &&
    typeof row?.transitPlanet === "string" &&
    typeof natalPlanet === "string" &&
    typeof row?.orb === "number" &&
    !Number.isNaN(row.orb)
  );
}

export function buildTransitWindows(rows: PlanetaryTransitEvent[]): TransitWindow[] {
  if (!Array.isArray(rows) || !rows.length) return [];

  const normalized = rows
    .map((r) => ({
      ...r,
      natalPlanet: r?.natalPlanet ?? r?.natalTarget ?? undefined,
    }))
    .filter(isTransitHit);

  if (!normalized.length) return [];

  const sorted = [...normalized].sort((a, b) => {
    if (a.transitPlanet !== b.transitPlanet) {
      return a.transitPlanet.localeCompare(b.transitPlanet);
    }
    if (a.natalPlanet !== b.natalPlanet) {
      return a.natalPlanet.localeCompare(b.natalPlanet);
    }
    return a.dateISO.localeCompare(b.dateISO);
  });

  const windows: TransitWindow[] = [];
  let current: TransitWindow | null = null;
  let currentKey = "";

  for (const row of sorted) {
    const key = rowKey(row);

    if (!current || key !== currentKey) {
      if (current) windows.push(current);

      current = {
        transitPlanet: row.transitPlanet,
        natalPlanet: row.natalPlanet,
        startISO: row.dateISO,
        peakISO: row.dateISO,
        endISO: row.dateISO,
        minOrb: row.orb,
        hitCount: 1,
      };
      currentKey = key;
      continue;
    }

    const prevDate = new Date(current.endISO);
    const thisDate = new Date(row.dateISO);
    const gapDays = Math.round(
      (thisDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (gapDays <= 1) {
      current.endISO = row.dateISO;
      current.hitCount += 1;

      if (row.orb < current.minOrb) {
        current.minOrb = row.orb;
        current.peakISO = row.dateISO;
      }
    } else {
      windows.push(current);

      current = {
        transitPlanet: row.transitPlanet,
        natalPlanet: row.natalPlanet,
        startISO: row.dateISO,
        peakISO: row.dateISO,
        endISO: row.dateISO,
        minOrb: row.orb,
        hitCount: 1,
      };
      currentKey = key;
    }
  }

  if (current) windows.push(current);

  return windows.sort((a, b) => {
    if (a.startISO !== b.startISO) return a.startISO.localeCompare(b.startISO);
    return a.minOrb - b.minOrb;
  });
}