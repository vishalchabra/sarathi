type DashaSourceRow = {
  lord?: string | null;
  mahaLord?: string | null;
  antarLord?: string | null;
  label?: string | null;
  startISO?: string | null;
  endISO?: string | null;
};

type DashaSource = {
  timelines?: {
    md?: DashaSourceRow[];
    ad?: DashaSourceRow[];
    pd?: DashaSourceRow[];
  };
} | null | undefined;

type LifetimeDashaRow = {
  start: string;
  end: string;
  startISO: string;
  endISO: string;
  md: string;
  ad: string | null;
  pd: string | null;
  dashaLevel: "md" | "ad" | "pd";
  label: string;
};

function validDate(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

function validLord(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

function validRow(row: DashaSourceRow) {
  return (
    row != null &&
    validLord(row.lord) &&
    validDate(row.startISO) &&
    validDate(row.endISO) &&
    row.startISO <= row.endISO
  );
}

/**
 * Adapt complete Data Engine Vimshottari timelines.
 *
 * No independent Dasha calculations are performed.
 * Current-context timelines are deliberately not used
 * as substitutes for complete lifetime timelines.
 */
export function buildLifetimeDashaTimeline(
  dasha: DashaSource
) {
  const timelines = dasha?.timelines;

  const mdRows = Array.isArray(timelines?.md)
    ? timelines.md
    : [];

  const adRows = Array.isArray(timelines?.ad)
    ? timelines.ad
    : [];

  const pdRows = Array.isArray(timelines?.pd)
    ? timelines.pd
    : [];

  const mahadashaTimeline = mdRows
    .filter(validRow)
    .map((row) => ({
      planet: row.lord!,
      lord: row.lord!,
      startISO: row.startISO!,
      endISO: row.endISO!,
      start: row.startISO!,
      end: row.endISO!,
    }))
    .sort((a, b) =>
      a.startISO.localeCompare(b.startISO)
    );

  const dashaTimeline: LifetimeDashaRow[] = [
    ...mahadashaTimeline.map((row) => ({
      start: row.startISO,
      end: row.endISO,
      startISO: row.startISO,
      endISO: row.endISO,
      md: row.planet,
      ad: null,
      pd: null,
      dashaLevel: "md" as const,
      label: `${row.planet} Mahadasha`,
    })),

    ...adRows
      .filter(
        (row) =>
          validRow(row) &&
          validLord(row.mahaLord)
      )
      .map((row) => ({
        start: row.startISO!,
        end: row.endISO!,
        startISO: row.startISO!,
        endISO: row.endISO!,
        md: row.mahaLord!,
        ad: row.lord!,
        pd: null,
        dashaLevel: "ad" as const,
        label:
          row.label ||
          `${row.mahaLord} / ${row.lord}`,
      })),

    ...pdRows
      .filter(
        (row) =>
          validRow(row) &&
          validLord(row.mahaLord) &&
          validLord(row.antarLord)
      )
      .map((row) => ({
        start: row.startISO!,
        end: row.endISO!,
        startISO: row.startISO!,
        endISO: row.endISO!,
        md: row.mahaLord!,
        ad: row.antarLord!,
        pd: row.lord!,
        dashaLevel: "pd" as const,
        label:
          row.label ||
          `${row.mahaLord} / ${row.antarLord} / ${row.lord}`,
      })),
  ];

  const levelOrder = {
    md: 0,
    ad: 1,
    pd: 2,
  };

  dashaTimeline.sort(
    (a, b) =>
      a.startISO.localeCompare(b.startISO) ||
      levelOrder[a.dashaLevel] -
        levelOrder[b.dashaLevel]
  );

  return {
    mahadashaTimeline,
    dashaTimeline,
  };
}
