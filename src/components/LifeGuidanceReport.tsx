// FILE: /src/components/LifeGuidanceReport.tsx
"use client";

type Person = {
  name?: string;
  initials?: string;
  dob?: string;
  tob?: string;
  place?: string;
  sun?: string;
  moon?: string;
  asc?: string;
  nakshatra?: string;
};
type Props = { report: any; person?: Person };

/** Toggle if you ever want to show house-by-house text later */
const SHOW_HOUSE_BRIEFS = false;

export default function LifeGuidanceReport({ report, person }: Props) {
  const p = person ?? {};
  const dasha = report?.dasha ?? {};
  const current = dasha?.current;

  return (
    <div className="space-y-6">
      {/* Cover */}
      <section className="rounded-xl border bg-white shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Life Guidance Report</h2>
            <p className="text-sm text-gray-500">World’s Most Accurate Astrology Engine</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-indigo-600 text-white grid place-items-center font-semibold">
            {(p.name || " ").trim().split(/\s+/).slice(0,2).map(s=>s[0]||"").join("").toUpperCase() || "•"}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <InfoCard label="Location" value={report?.panchang?.at?.split(" ")?.slice(2)?.join(" ") || p.place || "—"} />
          <InfoCard label="Start" value={new Date().toLocaleDateString()} />
          <InfoCard label="ID" value="Valid for Life" />
        </div>
      </section>

      {/* Profile */}
      <section className="rounded-xl border bg-white shadow-sm p-6">
        <h3 className="font-semibold mb-3">Profile</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <InfoCard label="Date of Birth" value={p.dob || report?.intro?.match(/Born on (\d{4}-\d{2}-\d{2})/)?.[1] || "—"} />
          <InfoCard label="Time of Birth" value={p.tob || "—"} />
          <InfoCard label="Place of Birth" value={p.place || "—"} />
          <InfoCard label="Sun Sign" value={report?.natalSummary?.sunSign || "—"} />
          <InfoCard label="Moon Sign" value={report?.natalSummary?.moonSign || "—"} />
          <InfoCard label="Ascendant" value={report?.natalSummary?.asc?.ascSignName ?? report?.natalSummary?.asc?.ascSign ?? "—"} />
          <InfoCard label="Nakshatra" value={report?.panchang?.nakshatra?.name || p.nakshatra || "—"} />
        </div>
      </section>

      {/* Current Dasha */}
      <section className="rounded-xl border bg-white shadow-sm p-6">
        <h3 className="font-semibold mb-3">Current Dasha</h3>
        {current ? (
          <div className="text-sm">
            <div><b>{current.mahadasha}</b> Mahadasha</div>
            <div className="text-gray-500">{(current.mdStart ?? "").slice(0,10)} → {(current.mdEnd ?? "").slice(0,10)}</div>
            <div className="mt-2"><b>{current.antardasha}</b> Antardasha</div>
            <div className="text-gray-500">{(current.adStart ?? "").slice(0,10)} → {(current.adEnd ?? "").slice(0,10)}</div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">—</div>
        )}
      </section>

      {/* Panchang at Birth */}
      <section className="rounded-xl border bg-white shadow-sm p-6">
        <h3 className="font-semibold">Panchang at Birth</h3>
        <p className="text-sm text-gray-500">{report?.panchang?.at}</p>
        <ul className="mt-2 text-sm space-y-1">
          <li><b>Weekday:</b> {report?.panchang?.weekday || "—"}</li>
          <li><b>Tithi:</b> {report?.panchang?.tithi?.name || "—"}</li>
          <li><b>Nakshatra:</b> {report?.panchang?.nakshatra?.name || "—"} <span className="opacity-70">(ruled by {report?.panchang?.nakshatra?.lord || "—"})</span></li>
          {report?.panchang?.nakshatra?.theme && (
            <li className="opacity-80 text-xs">Theme: {report.panchang.nakshatra.theme}</li>
          )}
          <li><b>Yoga:</b> {report?.panchang?.yoga?.name || "—"}</li>
        </ul>
      </section>

      {/* Planet Nakshatras */}
      {Array.isArray(report?.sections?.planetNakshatras) && (
        <section className="rounded-xl border bg-white shadow-sm p-6">
          <h3 className="font-semibold">Planet Nakshatras</h3>
          <ul className="list-disc ml-6 text-sm">
            {report.sections.planetNakshatras.map((line: string, i: number) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Current Themes + Dos/Donts + Remedies */}
      <section className="rounded-xl border bg-white shadow-sm p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-2">Current Themes</h3>
            <ul className="list-disc ml-5 text-sm">
              {(report?.sections?.currentThemes ?? []).map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Do</h3>
            <ul className="list-disc ml-5 text-sm">
              {(report?.sections?.actionables?.do ?? []).map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Avoid</h3>
            <ul className="list-disc ml-5 text-sm">
              {(report?.sections?.actionables?.dont ?? []).map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>

        {report?.sections?.remedies && (
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <InfoCard label="Remedy Planet" value={report.sections.remedies.planet || "—"} />
            <InfoCard label="Mantra" value={(report.sections.remedies.mantra ?? []).join(" • ") || "—"} />
            <InfoCard label="Fast" value={report.sections.remedies.fast || "—"} />
            <InfoCard label="Donate" value={(report.sections.remedies.donate ?? []).join(", ") || "—"} />
            <InfoCard label="Colors" value={report.sections.remedies.color || "—"} />
            <InfoCard label="Gemstone" value={(report.sections.remedies.gems ?? []).join(", ") || "—"} />
          </div>
        )}
      </section>

      {/* OPTIONAL: House Briefs (HIDDEN by default) */}
      {SHOW_HOUSE_BRIEFS && Array.isArray(report?.sections?.houseBriefs) && report.sections.houseBriefs.length > 0 && (
        <section className="rounded-xl border bg-white shadow-sm p-6">
          <h3 className="font-semibold">Bhavat-Bhavam (House-by-House Quick Read)</h3>
          <ul className="list-disc ml-6 text-sm">
            {report.sections.houseBriefs.map((s: string, i: number) => <li key={i}>{s}</li>)}
          </ul>
        </section>
      )}

      {/* Footer */}
      <section className="rounded-xl border bg-white shadow-sm p-4">
        <p className="text-xs text-gray-500">
          Thank you for reading this report. The insights aim to illuminate choices—not replace professional advice.
          This report is based on your provided birth details and astrological principles; it is not a substitute for professional,
          legal, medical, or financial advice.
        </p>
      </section>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-0.5 text-sm">{value || "—"}</div>
    </div>
  );
}
