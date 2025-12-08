"use client";

import React from "react";
import DashaTimeline from "./Report/DashaTimeline";
import DashaTable from "./Report/DashaTable";
import YogasAuto from "./Report/YogasAuto";
import AshtakavargaMini from "./Report/AshtakavargaMini";
import DignitiesLight from "./Report/DignitiesLight";
import HouseLords from "./Report/HouseLords";
import StrengthSignatureV2 from "./Report/StrengthSignatureV2";
import ThemeToggle from "./Report/ThemeToggle";
import NarrativeSummaryPro from "./Report/NarrativeSummaryPro"; // ✅ use the new component
import PlanetsAndAspects from "./Report/PlanetsAndAspects";
import { wrap360, degMin, SIGNS_FULL } from "@/lib/astro/canonical";

/* ---------- small UI helpers ---------- */
function Card({
  title,
  children,
  footer,
}: {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section
      className="rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-4"
      style={{ breakInside: "avoid" }}
    >
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      {children}
      {footer}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
      <div className="text-[11px] uppercase text-gray-500 dark:text-slate-400 tracking-wide">
        {label}
      </div>
      <div className="mt-1 text-base">{children ?? "—"}</div>
    </div>
  );
}

/* ---------- main component ---------- */
export default function PremiumLifeReport({
  report,
  person,
}: {
  report: any;
  person: {
    name?: string;
    dob?: string;
    tob?: string;
    place?: string;
    sun?: string;
    sunSign?: string;
    moon?: string;
    moonSign?: string;
    asc?: string;
    ascendant?: string;
    ascSignName?: string;
    nakshatra?: string;
  };
}) {
  // Signs for the header chips
  const sun = person.sunSign || person.sun || report?.natalSummary?.sunSign || "—";
  const moon = person.moonSign || person.moon || report?.natalSummary?.moonSign || "—";

  // Ascendant pretty label
  const ascDeg: number | undefined = report?.natalSummary?.asc?.ascDeg;
  const ascName = (() => {
    if (!Number.isFinite(ascDeg)) {
      return person.ascSignName || person.ascendant || person.asc || "—";
    }
    const signName =
      SIGNS_FULL[Math.floor(wrap360(Number(ascDeg)) / 30)] ||
      person.ascSignName ||
      "Ascendant";
    return `${signName} ${degMin(Number(ascDeg))}`;
  })();

  // Panchang
  const weekday = report?.panchang?.weekday || "—";
  const tithi = report?.panchang?.tithi?.name || "—";
  const paksha = report?.panchang?.tithi?.paksha ? ` (${report.panchang.tithi.paksha})` : "";
  const nak = person.nakshatra || report?.panchang?.nakshatra?.name || "—";
  const nakLord = report?.panchang?.nakshatra?.lord || "";
  const yoga = report?.panchang?.yoga?.name || "—";

  return (
    <div className="space-y-6">
      {/* Snapshot */}
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{person.name || "Life Report"}</h2>
            <div className="text-sm text-gray-600 dark:text-slate-300">{person.place}</div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
            <ThemeToggle />
            <span>Valid for Life</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Field label="Date of Birth">{person.dob || "—"}</Field>
          <Field label="Time of Birth">{person.tob || "—"}</Field>
          <Field label="Place of Birth">{person.place || "—"}</Field>
          <Field label="Sun Sign">{sun}</Field>
          <Field label="Moon Sign">{moon}</Field>
          <Field label="Ascendant">{ascName}</Field>
          <Field label="Nakshatra">
            <div>{nak}</div>
            {nakLord && (
              <div className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                ruled by {nakLord}
              </div>
            )}
          </Field>
        </div>
      </Card>

      {/* Panchang */}
      <Card title="Panchang at Birth">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-800 dark:text-slate-200">
          <div>Weekday: <b>{weekday}</b></div>
          <div>Tithi: <b>{tithi}</b>{paksha}</div>
          <div> Nakshatra: <b>{nak}</b>{nakLord ? <span className="text-gray-500 dark:text-slate-400"> (ruled by {nakLord})</span> : null}</div>
          <div>Yoga: <b>{yoga}</b></div>
        </div>
      </Card>

      {/* Planets & Aspects (table, normalized) */}
      <PlanetsAndAspects
        ascDeg={report?.natalSummary?.asc?.ascDeg}
        planets={report?.natalSummary?.planets}
        titlePlanets="Planets (sidereal)"
        titleAspects="Aspects (light)"
      />

      {/* House Lords */}
      <HouseLords ascDeg={ascDeg} />

      {/* Dashas */}
      <DashaTimeline dasha={report?.dasha} />
      <DashaTable dasha={report?.dasha} />

      {/* Strengths */}
      <StrengthSignatureV2 planets={report?.natalSummary?.planets || {}} />

      {/* Dignities */}
      <Card title="Dignities (light)">
        <DignitiesLight planets={report?.natalSummary?.planets || {}} />
      </Card>

      {/* Ashtakavarga + Yogas */}
      <Card title="Ashtakavarga (mini)">
        <AshtakavargaMini
          av={report?.sections?.ashtakavarga}
          planets={report?.natalSummary?.planets || {}}
        />
      </Card>

      <Card title="Notable Yogas (auto)">
        <YogasAuto
          planets={report?.natalSummary?.planets || {}}
          ascDeg={report?.natalSummary?.asc?.ascDeg}
          mode="strict"
        />
      </Card>

      {/* Narrative summary (enhanced) */}
      <NarrativeSummaryPro report={report} />

      {/* Optional transits */}
      {!!report?.sections?.transits?.length && (
        <Card title="Key Transits (next 12 months)">
          <ul className="text-sm text-gray-700 dark:text-slate-200 space-y-1">
            {report.sections.transits.map((t: any, i: number) => (
              <li key={i}>
                <b>{t.title || t.planet || "Transit"}</b>:{" "}
                {t.start?.slice(0, 10)} → {t.end?.slice(0, 10)} —{" "}
                {t.note || t.effect || ""}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <footer className="text-xs text-gray-500 dark:text-slate-400">
        Insights illuminate choices; they do not replace professional advice.
      </footer>
    </div>
  );
}
