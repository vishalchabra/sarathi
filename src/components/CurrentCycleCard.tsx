"use client";

import React from "react";

type ActivePeriods = {
  mahadasha?: {
    lord: string;
    start: string; // ISO string from backend
    end: string;
    summary?: string; // long narrative about the Mahadasha
  };
  antardasha?: {
    mahaLord: string;
    subLord: string;
    start: string;
    end: string;
    summary?: string; // "You're in Rahu/Ketu right now..." style
  };
  pratyantardasha?: {
    mahaLord: string;
    antarLord: string;
    lord: string;
    start: string;
    end: string;
    summary?: string; // even more zoomed-in "right now" flavor
  };
};

function fmtDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(+d)) return "—";
  // matches DD/MM/YYYY formatting like in your screenshots
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function CurrentCycleCard({
  activePeriods,
  className = "",
}: {
  activePeriods?: ActivePeriods;
  className?: string;
}) {
  const maha  = activePeriods?.mahadasha;
  const antar = activePeriods?.antardasha;
  const praty = activePeriods?.pratyantardasha;

  // Build header line dynamically:
  // "Rahu Mahadasha / Ketu Antardasha / Jupiter Pratyantardasha"
  const titleParts: string[] = [];
  if (maha?.lord)         titleParts.push(`${maha.lord} Mahadasha`);
  if (antar?.subLord)     titleParts.push(`${antar.subLord} Antardasha`);
  if (praty?.lord)        titleParts.push(`${praty.lord} Pratyantardasha`);
  const titleLine = titleParts.join(" / ") || "Current Cycle";

  // Rows under the title:
  const mahaRow = maha
    ? {
        label: `Major period (${maha.lord})`,
        range: `${fmtDate(maha.start)} – ${fmtDate(maha.end)}`,
      }
    : null;

  const antarRow = antar
    ? {
        label: `Current sub-period (${antar.subLord})`,
        range: `${fmtDate(antar.start)} – ${fmtDate(antar.end)}`,
      }
    : null;

  const pratyRow = praty
    ? {
        label: `Current micro-period (${praty.lord})`,
        range: `${fmtDate(praty.start)} – ${fmtDate(praty.end)}`,
      }
    : null;

  // The big descriptive paragraph about the Mahadasha
  const mahaSummary = maha?.summary;

  // The "Right now specifically:" paragraph.
  // Prefer PD summary (most precise), otherwise fall back to Antardasha summary.
  const nowSummary = praty?.summary || antar?.summary || "";

  return (
    <section
      className={
        "rounded-lg border p-4 md:p-6 bg-white shadow-sm " + className
      }
    >
      {/* Title */}
      <h3 className="text-lg font-semibold mb-4">
        {titleLine}
      </h3>

      {/* Timing rows (dates) */}
      <div className="text-xs text-gray-600 space-y-1 mb-4">
        {mahaRow && (
          <div>
            <strong>{mahaRow.label}</strong> runs {mahaRow.range}
          </div>
        )}

        {antarRow && (
          <div>
            <strong>{antarRow.label}</strong> runs {antarRow.range}
          </div>
        )}

        {/* THIS IS THE NEW PD ROW */}
        {pratyRow && (
          <div>
            <strong>{pratyRow.label}</strong> runs {pratyRow.range}
          </div>
        )}
      </div>

      {/* Long narrative from Mahadasha summary */}
      {mahaSummary && (
        <p className="text-sm text-gray-800 mb-4 leading-relaxed">
          {mahaSummary}
        </p>
      )}

      {/* "Right now specifically:" block.
          We inject PD summary here if it's present. */}
      {nowSummary && (
        <p className="text-sm text-gray-800 leading-relaxed">
          <strong>Right now specifically: </strong>
          {nowSummary}
        </p>
      )}
    </section>
  );
}
