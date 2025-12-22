"use client";

import { useEffect, useMemo, useState } from "react";
import TopNav from "../TopNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Download, Printer, Sparkles } from "lucide-react";

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
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        setDobISO(p.dobISO ?? "");
        setTob(p.tob ?? "");
        setPlace((old) => ({ ...old, ...(p.place ?? {}) }));
      }
    } catch {
      // ignore
    }
  }, []);

  function saveProfile() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ dobISO, tob, place }));
    } catch {
      // ignore
    }
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
      saveProfile();
      setPreviewKey((k) => k + 1);

      const res = await fetch("/api/life-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birth: { dobISO, tob, place } }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || res.statusText);

      setReport(data.report ?? data);
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

  const canRender = useMemo(() => {
    return Boolean(
      dobISO &&
        tob &&
        place.tz &&
        Number.isFinite(place.lat) &&
        Number.isFinite(place.lon) &&
        Math.abs(place.lat) <= 90 &&
        Math.abs(place.lon) <= 180
    );
  }, [dobISO, tob, place]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <TopNav />

      <div className="mx-auto max-w-6xl p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-400/40">
                <Sparkles className="h-4 w-4 text-indigo-300" />
              </div>
              <h1 className="text-xl font-semibold text-slate-100">Life Guidance</h1>
              <Badge className="bg-white/5 border border-white/10 text-slate-200 text-[11px]">
                Print-friendly
              </Badge>
            </div>
            <p className="mt-2 text-sm text-slate-300/90">
              A clean summary you can read, print, and use for decisions.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
              onClick={printPage}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>

            <Button
              variant="outline"
              className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
              onClick={downloadPDF}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Input card */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm rounded-3xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-100">
              Enter birth details
            </CardTitle>
            <p className="text-xs text-slate-300/80">
              Needed for accurate dasha + timing.
            </p>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-xs text-slate-300/80 mb-1">Birth date</div>
              <input
                value={dobISO}
                onChange={(e) => setDobISO(e.target.value)}
                placeholder="YYYY-MM-DD"
                className="w-full h-10 rounded-xl border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 outline-none focus:border-indigo-300/40"
              />
            </div>

            <div>
              <div className="text-xs text-slate-300/80 mb-1">Birth time</div>
              <input
                value={tob}
                onChange={(e) => setTob(e.target.value)}
                placeholder="HH:mm (24h)"
                className="w-full h-10 rounded-xl border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 outline-none focus:border-indigo-300/40"
              />
            </div>

            <div>
              <div className="text-xs text-slate-300/80 mb-1">Time zone</div>
              <input
                value={place.tz}
                onChange={(e) => setPlace((p) => ({ ...p, tz: e.target.value }))}
                placeholder="Asia/Kolkata"
                className="w-full h-10 rounded-xl border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 outline-none focus:border-indigo-300/40"
              />
            </div>

            <div className="md:col-span-3 grid gap-3 md:grid-cols-4">
              <div className="md:col-span-2">
                <div className="text-xs text-slate-300/80 mb-1">Place name</div>
                <input
                  value={place.name}
                  onChange={(e) => setPlace((p) => ({ ...p, name: e.target.value }))}
                  placeholder="City"
                  className="w-full h-10 rounded-xl border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 outline-none focus:border-indigo-300/40"
                />
              </div>

              <div>
                <div className="text-xs text-slate-300/80 mb-1">Lat</div>
                <input
                  value={String(place.lat)}
                  onChange={(e) =>
                    setPlace((p) => ({ ...p, lat: Number(e.target.value) }))
                  }
                  placeholder="29.98"
                  className="w-full h-10 rounded-xl border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 outline-none focus:border-indigo-300/40"
                />
              </div>

              <div>
                <div className="text-xs text-slate-300/80 mb-1">Lon</div>
                <input
                  value={String(place.lon)}
                  onChange={(e) =>
                    setPlace((p) => ({ ...p, lon: Number(e.target.value) }))
                  }
                  placeholder="77.50"
                  className="w-full h-10 rounded-xl border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 outline-none focus:border-indigo-300/40"
                />
              </div>
            </div>

            <div className="md:col-span-3 flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
                onClick={fillSample}
              >
                Fill sample
              </Button>

              <Button
                variant="outline"
                className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
                onClick={useMyLocation}
              >
                Use my location
              </Button>

              <Button
                className="rounded-xl bg-indigo-500 hover:bg-indigo-400"
                onClick={generate}
                disabled={!canRender || loading}
              >
                <Clock className="h-4 w-4 mr-2" />
                {loading ? "Generating…" : "Generate guidance"}
              </Button>

              {!canRender && (
                <span className="text-xs text-slate-300/70">
                  Enter DOB + TOB + valid lat/lon to generate.
                </span>
              )}
            </div>

            {error && (
              <div className="md:col-span-3 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Output */}
        {!report ? (
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm rounded-3xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-100">
                Guidance preview
              </CardTitle>
              <p className="text-xs text-slate-300/80">
                Generate once to see your print-friendly summary here.
              </p>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-6 text-sm text-slate-200/80">
                This page will show:
                <ul className="mt-3 list-disc pl-5 space-y-1 text-slate-200/80">
                  <li>Your current MD/AD phase</li>
                  <li>Next 30–90 day focus (career, money, relationships)</li>
                  <li>Do / Don’t guidance you can act on</li>
                  <li>A clean format you can print or save</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card
            id="guidancePrint"
            className="border-white/10 bg-white/5 backdrop-blur-sm rounded-3xl"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-100">
                Your guidance
              </CardTitle>
              <p className="text-xs text-slate-300/80">
                Generated from your birth details. (We’ll refine the layout next.)
              </p>
            </CardHeader>

            <CardContent>
              <pre className="max-h-[520px] overflow-auto rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-xs text-slate-100">
                {JSON.stringify(report, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
