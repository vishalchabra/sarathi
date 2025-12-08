// src/app/sarathi/life-guidance/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import DashaTimeline from "@/components/DashaTimeline"; // ⬅️ timeline bar

type Place = { name: string; tz: string; lat: number; lon: number };
type Report = any;

const LS_KEY = "sarathi_profile_v1";

export default function LifeGuidancePage() {
  const [dobISO, setDobISO] = useState("");
  const [tob, setTob] = useState("");
  const [place, setPlace] = useState<Place>({
    name: "",
    tz: "Asia/Kolkata",
    lat: 0,
    lon: 0,
  });

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0); // forces chart reload

  // --- Load saved profile (same key used on Life Report) ---
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        setDobISO(p.dobISO ?? "");
        setTob(p.tob ?? "");
        setPlace(p.place ?? place);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function saveProfile() {
    localStorage.setItem(LS_KEY, JSON.stringify({ dobISO, tob, place }));
  }

  function fillSample() {
    setDobISO("1984-01-21");
    setTob("23:35");
    setPlace({
      name: "Saharanpur",
      tz: "Asia/Kolkata",
      lat: 29.986,
      lon: 77.504,
    });
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPlace((old) => ({
          ...old,
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        }));
      },
      (e) => setError(e?.message ?? "Location permission denied"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function generate() {
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      // refresh chart images
      setPreviewKey((k) => k + 1);

      // fetch narrative report to show under charts
      const res = await fetch("/api/life-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birth: { dobISO, tob, place } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || res.statusText);
      setReport(data.report);
    } catch (e: any) {
      setError(e?.message ?? "Failed to generate");
    } finally {
      setLoading(false);
    }
  }

  async function downloadPDF() {
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const node = document.getElementById("guidancePrint");
      if (!node) return window.print();

      const canvas = await html2canvas(node, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
      const w = canvas.width * ratio;
      const h = canvas.height * ratio;
      pdf.addImage(imgData, "PNG", (pageWidth - w) / 2, 20, w, h);
      pdf.save("Sarathi-Life-Guidance.pdf");
    } catch {
      window.print();
    }
  }

  function printPage() {
    window.print();
  }

  // Build chart image URLs. Adjust "kind" values if your /api/charts expects different keys.
  const chartSrc = (kind: "d1" | "d9" | "moon" | "d10") =>
    `/api/charts?kind=${kind}` +
    `&dobISO=${encodeURIComponent(dobISO || "")}` +
    `&tob=${encodeURIComponent(tob || "")}` +
    `&tz=${encodeURIComponent(place.tz || "")}` +
    `&lat=${place.lat}&lon=${place.lon}` +
    `&name=${encodeURIComponent(place.name || "")}` +
    `&v=${previewKey}`;

  const canRender = useMemo(
    () => Boolean(dobISO && tob && place.tz && Number.isFinite(place.lat) && Number.isFinite(place.lon)),
    [dobISO, tob, place]
  );

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      {/* Controls */}
      <header className="flex items-end justify-between gap-3 no-print">
        <h1 className="text-2xl font-bold">Life Guidance</h1>
        <div className="flex flex-wrap gap-2">
          <a href="/sarathi/life-report" className="px-3 py-2 rounded bg-gray-200">← Life Report</a>
          <button onClick={saveProfile} className="px-3 py-2 rounded bg-gray-200">Save</button>
          <button onClick={fillSample} className="px-3 py-2 rounded bg-gray-200">Use sample</button>
          <button onClick={useMyLocation} className="px-3 py-2 rounded bg-gray-200">Use my location</button>
          <button onClick={downloadPDF} className="px-3 py-2 rounded bg-gray-200">Download PDF</button>
          <button onClick={printPage} className="px-3 py-2 rounded bg-gray-200">Print</button>
        </div>
      </header>

      {/* Inputs */}
      <div className="no-print grid md:grid-cols-4 gap-3">
        <label className="text-sm">Date of Birth
          <input type="date" className="border p-2 w-full" value={dobISO} onChange={(e)=>setDobISO(e.target.value)} />
        </label>
        <label className="text-sm">Time of Birth
          <input type="time" className="border p-2 w-full" value={tob} onChange={(e)=>setTob(e.target.value)} />
        </label>
        <label className="text-sm">Place (name)
          <input type="text" className="border p-2 w-full" value={place.name} onChange={(e)=>setPlace({...place, name: e.target.value})} />
        </label>
        <label className="text-sm">Timezone (IANA)
          <input type="text" className="border p-2 w-full" value={place.tz} onChange={(e)=>setPlace({...place, tz: e.target.value})} />
        </label>
        <label className="text-sm">Latitude
          <input type="number" className="border p-2 w-full" value={place.lat} onChange={(e)=>setPlace({...place, lat: Number(e.target.value)})} step="0.001"/>
        </label>
        <label className="text-sm">Longitude
          <input type="number" className="border p-2 w-full" value={place.lon} onChange={(e)=>setPlace({...place, lon: Number(e.target.value)})} step="0.001"/>
        </label>
      </div>

      <div className="no-print">
        <button
          onClick={generate}
          disabled={loading || !canRender}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate"}
        </button>
      </div>

      {error && <div className="no-print bg-red-50 border border-red-300 text-red-700 p-3 rounded">{error}</div>}

      {/* PRINT AREA (charts + narrative summary) */}
      <div id="guidancePrint" className="space-y-6">
        {/* Charts */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Birth Charts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ChartCard title="D1 — Rāśi" src={canRender ? chartSrc("d1") : undefined} />
            <ChartCard title="D9 — Navāmśa" src={canRender ? chartSrc("d9") : undefined} />
            <ChartCard title="Chandra Lagna" src={canRender ? chartSrc("moon") : undefined} />
            <ChartCard title="D10 — Daśāmśa" src={canRender ? chartSrc("d10") : undefined} />
          </div>
        </section>

        {/* Narrative (re-using life-report data model) */}
        {report && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Guidance Summary</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded border p-4">
                <h3 className="font-semibold">Panchang at Birth</h3>
                <ul className="text-sm space-y-1 mt-2">
                  <li><b>Weekday:</b> {report.panchang?.weekday}</li>
                  <li><b>Tithi:</b> {report.panchang?.tithi?.name}</li>
                  <li><b>Nakshatra:</b> {report.panchang?.nakshatra?.name} <span className="opacity-70">(ruled by {report.panchang?.nakshatra?.lord})</span></li>
                  <li className="text-xs opacity-70">Theme: {report.panchang?.nakshatra?.theme}</li>
                </ul>
              </div>

              <div className="rounded border p-4">
                <h3 className="font-semibold">Current Dasha</h3>
                <p className="text-sm">{report.dasha?.current?.mahadasha}/{report.dasha?.current?.antardasha}</p>
                <p className="text-xs opacity-70">{report.dasha?.current?.from} → {report.dasha?.current?.to}</p>

                {/* ⬇️ Dasha timeline bar */}
                {Array.isArray(report?.dasha?.timeline) && report.dasha.timeline.length > 1 && (
                  <div className="mt-3">
                    <DashaTimeline
                      segments={report.dasha.timeline}
                      current={report.dasha.current}
                    />
                  </div>
                )}
              </div>

              <div className="rounded border p-4">
                <h3 className="font-semibold">Navamsha (D9) Highlights</h3>
                <ul className="list-disc ml-5 text-sm">
                  {report.sections?.navamsha?.highlights?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>

            <div className="rounded border p-4">
              <h3 className="font-semibold">Current Themes</h3>
              <ul className="list-disc ml-6 text-sm">
                {report.sections?.currentThemes?.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </div>

            <div className="rounded border p-4">
              <h3 className="font-semibold">Actionable Guidance (MD/AD)</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium mb-1">Do</div>
                  <ul className="list-disc ml-5">
                    {report.sections?.actionables?.do?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div>
                  <div className="font-medium mb-1">Avoid</div>
                  <ul className="list-disc ml-5">
                    {report.sections?.actionables?.dont?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded border p-4">
              <h3 className="font-semibold">Remedies & Alignments (By Current MD)</h3>
              {report.sections?.remedies ? (
                <ul className="text-sm space-y-1">
                  <li><b>Planet:</b> {report.sections.remedies.planet}</li>
                  <li><b>Mantra:</b> {report.sections.remedies.mantra?.join(" • ")}</li>
                  <li><b>Fast:</b> {report.sections.remedies.fast}</li>
                  <li><b>Donate:</b> {report.sections.remedies.donate?.join(", ")}</li>
                  <li><b>Colors:</b> {report.sections.remedies.color}</li>
                  <li className="opacity-70"><b>Gemstone:</b> {report.sections.remedies.gems?.join(", ")} (only with expert guidance)</li>
                </ul>
              ) : (
                <p className="text-sm opacity-70">General sattvic lifestyle; no specific MD remedy required.</p>
              )}
            </div>

            <div className="rounded border p-4">
              <h3 className="font-semibold">Bhavat-Bhavam (House-by-House Quick Read)</h3>
              <ul className="list-disc ml-6 text-sm">
                {report.sections?.houseBriefs?.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </div>

            <div className="rounded border p-4">
              <h3 className="font-semibold">Planet Nakshatras</h3>
              <ul className="list-disc ml-6 text-sm">
                {report.sections?.planetNakshatras?.map((line: string, i: number) => <li key={i}>{line}</li>)}
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ChartCard({ title, src }: { title: string; src?: string }) {
  return (
    <div className="rounded border p-3">
      <div className="font-medium mb-2">{title}</div>
      {src ? (
        <img src={src} alt={title} className="w-full h-auto" />
      ) : (
        <div className="text-sm opacity-60">Enter birth details and click Generate.</div>
      )}
    </div>
  );
}
