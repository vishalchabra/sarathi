"use client";

import React from "react";

type ActivePeriods = {
  mahadasha?: {
    lord: string;
    start: string;
    end: string;
    summary?: string;
  };
  antardasha?: {
    mahaLord: string;
    subLord: string;
    start: string;
    end: string;
    summary?: string;
  };
  pratyantardasha?: {
    mahaLord: string;
    antarLord: string;
    lord: string;
    start: string;
    end: string;
    summary?: string;
  };
};

type ReportShape = {
  activePeriods?: ActivePeriods;
};

/**
 * Format an ISO timestamp ("2025-02-02T00:00:00.000Z") into DD/MM/YYYY
 * to match the style you showed in screenshots.
 */
function fmtDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(+d)) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * CurrentDasha
 *
 * Renders the "Current Cycle" card:
 * - Mahadasha (long-term chapter)
 * - Antardasha (current subchapter)
 * - Pratyantardasha (right now / micro-period)
 *
 * IMPORTANT:
 * We pull `report.activePeriods` ourselves so the parent component
 * DOES NOT need to be updated to pass new props.
 */
export default function CurrentDasha({
  report,
  className = "",
}: {
  report?: ReportShape;
  className?: string;
}) {
  const activePeriods = report?.activePeriods;

  const maha  = activePeriods?.mahadasha;
  const antar = activePeriods?.antardasha;
  const praty = activePeriods?.pratyantardasha;

  // Build header:
  // e.g. "Rahu Mahadasha / Ketu Antardasha / Jupiter Pratyantardasha"
  const titleParts: string[] = [];
  if (maha?.lord)            titleParts.push(`${maha.lord} Mahadasha`);
  if (antar?.subLord)        titleParts.push(`${antar.subLord} Antardasha`);
  if (praty?.lord)           titleParts.push(`${praty.lord} Pratyantardasha`);
  const titleLine = titleParts.join(" / ") || "Current Cycle";

  // Sentences under header:
  const mahaLine = maha
    ? `Major period (${maha.lord}) runs ${fmtDate(maha.start)} – ${fmtDate(maha.end)}`
    : null;

  const antarLine = antar
    ? `Current sub-period (${antar.subLord}) runs ${fmtDate(antar.start)} – ${fmtDate(antar.end)}`
    : null;

  // NEW: PD line
  const pratyLine = praty
    ? `Current micro-period (${praty.lord}) runs ${fmtDate(praty.start)} – ${fmtDate(praty.end)}`
    : null;

  // Long descriptive paragraph is from mahadasha.summary
  const mahaSummary = maha?.summary;

  // "Right now specifically:" text:
  // Prefer PD summary (because it's most zoomed-in),
  // fall back to Antardasha summary if PD doesn't have one.
  const nowSummary = praty?.summary || antar?.summary || "";

  return (
    <section
      className={
        "rounded-lg border p-4 md:p-6 bg-white shadow-sm " + className
      }
    >
      {/* Card title */}
      <h3 className="text-lg font-semibold mb-4">
        {titleLine}
      </h3>

      {/* Timing lines */}
      <div className="text-xs text-gray-600 space-y-1 mb-4">
        {mahaLine && (
          <div>
            <strong>Major period ({maha?.lord})</strong>{" "}
            runs {fmtDate(maha?.start)} – {fmtDate(maha?.end)}
          </div>
        )}

        {antarLine && (
          <div>
            <strong>Current sub-period ({antar?.subLord})</strong>{" "}
            runs {fmtDate(antar?.start)} – {fmtDate(antar?.end)}
          </div>
        )}

        {pratyLine && (
          <div>
            <strong>Current micro-period ({praty?.lord})</strong>{" "}
            runs {fmtDate(praty?.start)} – {fmtDate(praty?.end)}
          </div>
        )}
      </div>

      {/* Long Mahadasha description */}
      {mahaSummary && (
        <p className="text-sm text-gray-800 mb-4 leading-relaxed">
          {mahaSummary}
        </p>
      )}

      {/* The "Right now specifically:" block */}
      {nowSummary && (
        <p className="text-sm text-gray-800 leading-relaxed">
          <strong>Right now specifically: </strong>
          {nowSummary}
        </p>
      )}
    </section>
  );
}
