// FILE: src/app/sarathi/life-guidance/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import TopNav from "../TopNav";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Download, Printer, Search } from "lucide-react";

// IMPORTANT: this is the same storage used across the app
import { loadBirthProfile, saveBirthProfile } from "@/lib/birth-profile";

type Place = { name?: string; tz: string; lat: number; lon: number };


type GeoSuggestion = {
  name?: string;
  tz?: string;
  lat?: number;
  lon?: number;
};

type Report = any;

function toHHMM(input: string) {
  // Accept "11:35 PM" -> "23:35" as a friendly normalization.
  // If already HH:MM, keep it.
  const s = (input || "").trim();
  if (!s) return "";
  if (/^\d{2}:\d{2}$/.test(s)) return s;

  // Try to parse "h:mm AM/PM"
  const m = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return s;
  let hh = Number(m[1]);
  const mm = Number(m[2]);
  const ap = (m[3] || "").toUpperCase();
  if (ap === "PM" && hh !== 12) hh += 12;
  if (ap === "AM" && hh === 12) hh = 0;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export default function LifeGuidancePage() {
  // Birth fields
  const [dobISO, setDobISO] = useState("");
  const [tob, setTob] = useState("");
  const [place, setPlace] = useState<Place>({
    name: "",
    tz: "Asia/Kolkata",
    lat: 0,
    lon: 0,
  });

  // City search UI
  const [placeQuery, setPlaceQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([]);
  const [placePicked, setPlacePicked] = useState(false);
  const [placeSearching, setPlaceSearching] = useState(false);

  // Report state
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // To avoid race conditions for search
  const searchAbortRef = useRef<AbortController | null>(null);

  // 1) On first load: prefer the ACTIVE profile saved by Life Report
  useEffect(() => {
  // Do NOT auto-prefill on Life Guidance.
  // If user wants, they can click "Load saved profile" (we'll add a button later).
}, []);


  // 2) Search places (simple + robust parsing)
  async function searchPlaces(q: string) {
    const query = (q || "").trim();
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setPlaceSearching(true);
      searchAbortRef.current?.abort();
      const ac = new AbortController();
      searchAbortRef.current = ac;

      // NOTE: your repo already has /api/geo (you grep’d it). We’ll try query-based search.
      // If your /api/geo currently only supports reverse-geo, we’ll still fail gracefully.
      const res = await fetch(`/api/geo?q=${encodeURIComponent(query)}`, {
        method: "GET",
        signal: ac.signal,
      });

      const data = await res.json().catch(() => ({}));

      // Accept multiple possible shapes, because geo endpoints vary:
      const list: GeoSuggestion[] =
        (Array.isArray((data as any)?.results) && (data as any).results) ||
        (Array.isArray((data as any)?.places) && (data as any).places) ||
        (Array.isArray((data as any)?.items) && (data as any).items) ||
        [];

      setSuggestions(list.slice(0, 8));
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setSuggestions([]);
    } finally {
      setPlaceSearching(false);
    }
  }

  function pickSuggestion(s: GeoSuggestion) {
  const next: Place = {
    name: s?.name ?? "",
    tz: s?.tz ?? "Asia/Kolkata",
    lat: typeof s?.lat === "number" ? s.lat : Number(s?.lat ?? 0),
    lon: typeof s?.lon === "number" ? s.lon : Number(s?.lon ?? 0),
  };

  setPlace(next);
  setPlaceQuery(next.name || "");
  setSuggestions([]);
  setPlacePicked(
    Boolean(
      next.name &&
        Number.isFinite(next.lat) &&
        Number.isFinite(next.lon) &&
        next.tz
    )
  );
  setError(null);

  // Save as ACTIVE profile so Chat/Life Report stay in sync
  saveBirthProfile({
  dobISO: (dobISO || "").trim(),
  tob: toHHMM(tob),
  place: {
    name: next.name ?? "",
    tz: next.tz,
    lat: next.lat,
    lon: next.lon,
  },
});
}


  function useMyLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation not supported on this device/browser.");
      return;
    }
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        // We already have /api/geo and your code comments say it does reverse geocode.
        // Try to reverse to a place name + tz.
        try {
          const res = await fetch(`/api/geo?lat=${lat}&lon=${lon}`, { method: "GET" });
          const data = await res.json().catch(() => ({}));
          const name =
            (data as any)?.name ||
            (data as any)?.place?.name ||
            "My location";
          const tz =
            (data as any)?.tz ||
            (data as any)?.place?.tz ||
            place.tz ||
            "Asia/Kolkata";

          const next: Place = { name, tz, lat, lon };
          setPlace(next);
          setPlaceQuery(name);
          setPlacePicked(true);

          saveBirthProfile({
  dobISO: (dobISO || "").trim(),
  tob: toHHMM(tob),
  place: {
    name: next.name ?? "",
    tz: next.tz ?? "Asia/Kolkata",
    lat: Number(next.lat ?? 0),
    lon: Number(next.lon ?? 0),
  },
});

        } catch {
          // fallback: set lat/lon only
          const next: Place = { ...place, lat, lon };
          setPlace(next);
          setPlacePicked(true);
          saveBirthProfile({
  dobISO: (dobISO || "").trim(),
  tob: toHHMM(tob),
  place: {
    name: next.name ?? "",
    tz: next.tz ?? "Asia/Kolkata",
    lat: Number(next.lat ?? 0),
    lon: Number(next.lon ?? 0),
  },
});

        }
      },
      (e) => setError(e?.message ?? "Location permission denied"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  // IMPORTANT: Generate must match API schema used by /api/life-report
  async function generate() {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const d = (dobISO || "").trim();
      const t = toHHMM(tob);

      if (!d) throw new Error("Please enter your birth date (YYYY-MM-DD).");
      if (!t) throw new Error("Please enter your birth time (HH:MM).");
      if (!place?.tz) throw new Error("Please select a birth timezone.");
      if (!placePicked) throw new Error("Pick a birth place from the dropdown (so lat/lon is saved).");

      // Keep ACTIVE profile updated
      const normalizedPlace = {
  ...place,
  name: place?.name ?? "",
  tz: place?.tz ?? "Asia/Kolkata",
  lat: Number(place?.lat ?? 0),
  lon: Number(place?.lon ?? 0),
};

saveBirthProfile({
  dobISO: d,
  tob: t,
  place: normalizedPlace,
});


      const res = await fetch("/api/life-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        // ✅ This matches your api route expectation (birthDateISO/birthTime/birthTz/birthLat/birthLon)
        body: JSON.stringify({
  birthDateISO: d,
  birthTime: t,
  birthTz: normalizedPlace.tz,
  birthLat: normalizedPlace.lat,
  birthLon: normalizedPlace.lon,
  placeName: normalizedPlace.name,
}),

      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as any)?.error || (data as any)?.message || res.statusText);

      const normalized = (data as any)?.report ?? data;
setReport(normalized);

    } catch (e: any) {
      setError(e?.message ?? "Failed to generate guidance.");
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

  const canGenerate = useMemo(() => {
    return Boolean(
      dobISO &&
        tob &&
        place?.tz &&
        placePicked &&
        Number.isFinite(place.lat) &&
        Number.isFinite(place.lon)
    );
  }, [dobISO, tob, place, placePicked]);
function pickPlace(next: Place) {
  setPlace(next);
  setPlaceQuery(next.name ?? "");
  setPlacePicked(true);
}

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <TopNav />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl border border-indigo-400/30 bg-indigo-500/10" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-slate-100">Life Guidance</h1>
                <Badge className="bg-white/5 text-slate-200 border border-white/10">
                  Print-friendly
                </Badge>
              </div>
              <p className="mt-1 text-sm text-slate-300/80">
                A clean summary you can read, print, and use for decisions.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={printPage}
              variant="outline"
              className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>

            <Button
              onClick={downloadPDF}
              variant="outline"
              className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Birth details */}
          <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-slate-100">Enter birth details</CardTitle>
              <p className="text-sm text-slate-300/80">
                Needed for accurate dasha + timing. Best experience: pick city from dropdown so lat/lon is correct.
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="mb-1 text-xs text-slate-300/80">Birth date (YYYY-MM-DD)</div>
                  <input
  type="date"
  value={dobISO}
  onChange={(e) => setDobISO(e.target.value)}
  className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/50"
/>

                </div>

                <div>
                  <div className="mb-1 text-xs text-slate-300/80">Birth time (HH:MM)</div>
                  <input
  type="time"
  step={60}
  value={tob}
  onChange={(e) => setTob(e.target.value)}
  className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/50"
/>

                </div>

                <div>
                  <div className="mb-1 text-xs text-slate-300/80">Time zone (IANA)</div>
                  <input
                    value={place.tz}
                    onChange={(e) => {
                      const tz = e.target.value;
                      setPlace((p) => ({ ...p, tz }));
                      setPlacePicked(false);
                    }}
                    placeholder="Asia/Kolkata"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/50"
                  />
                </div>
              </div>
             
              {/* Place search */}
              <div className="relative">
                <div className="mb-1 text-xs text-slate-300/80">Birth place (search and pick)</div>

                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={placeQuery}
                      onChange={(e) => {
                        const v = e.target.value;
                        setPlaceQuery(v);
                        setPlacePicked(false);
                        searchPlaces(v);
                      }}
                      placeholder="Start typing city… (e.g., Saharanpur)"
                      className="w-full rounded-xl border border-white/10 bg-slate-950/40 pl-10 pr-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/50"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={useMyLocation}
                    className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
                  >
                    Use my location
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      // Save active profile even before generating
                      saveBirthProfile({
  dobISO: (dobISO || "").trim(),
  tob: toHHMM(tob),
  place: {
    name: place?.name ?? "",
    tz: place?.tz ?? "Asia/Kolkata",
    lat: Number(place?.lat ?? 0),
    lon: Number(place?.lon ?? 0),
  },
});

                      generate();
                    }}
                    disabled={loading || !canGenerate}
                    className="rounded-xl bg-indigo-500 hover:bg-indigo-400"
                  >
                    {loading ? "Generating…" : "Generate guidance"}
                  </Button>
                </div>
              
                {/* Suggestion dropdown */}
                {suggestions.length > 0 && (
                  <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur">
                    {suggestions.map((s, idx) => {
                      const label = s?.name ?? "Unknown place";
                      const meta = `${s?.tz ?? "tz?"} · ${typeof s?.lat === "number" ? s.lat.toFixed(3) : "?"}, ${
                        typeof s?.lon === "number" ? s.lon.toFixed(3) : "?"
                      }`;
                      return (
                        <button
  key={idx}
  type="button"
  onMouseDown={(e) => {
    e.preventDefault(); // IMPORTANT: prevents blur clearing input before click
    pickSuggestion(s);
  }}
  className="w-full px-4 py-3 text-left hover:bg-white/5"
>

                          <div className="text-sm text-slate-100">{label}</div>
                          <div className="text-xs text-slate-300/70">{meta}</div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {placeSearching && (
                  <div className="mt-2 text-xs text-slate-300/70">Searching…</div>
                )}

                {placePicked && (
                  <div className="mt-2 text-xs text-emerald-300/80">
                    Place selected: <span className="text-slate-200">{place.name}</span> ({place.tz}) ·{" "}
                    {place.lat.toFixed(3)}, {place.lon.toFixed(3)}
                  </div>
                )}
              </div>

              {error && (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              )}

              {!placePicked && (
                <div className="text-xs text-slate-300/70">
                  Tip: If you already generated Life Report once, your profile is saved. If not, you can{" "}
                  <Link className="text-indigo-300 hover:text-indigo-200 underline underline-offset-4" href="/sarathi/life-report">
                    open Life Report
                  </Link>{" "}
                  and save your birth profile there.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-slate-100">Guidance preview</CardTitle>
              <p className="text-sm text-slate-300/80">
                Generate once to see your print-friendly summary here.
              </p>
            </CardHeader>

            <CardContent>
              <div
                id="guidancePrint"
                className="rounded-2xl border border-white/10 bg-slate-950/35 p-6 text-sm text-slate-200/90"
              >
                {!report ? (
                  <div className="text-slate-300/70">
                    This page will show your key timelines, dasha context, and a clean “do/don’t” summary once generated.
                  </div>
                ) : (
                  <div className="space-y-4 text-sm text-slate-200/80">
  {/* Core birth signature */}
  <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
      Core birth signature
    </div>

    <div className="mt-2 text-sm text-slate-100">
      Asc:{" "}
      <span className="text-indigo-200">
        {report?.ascSign ?? report?.core?.ascSign ?? "—"}
      </span>{" "}
      · Moon:{" "}
      <span className="text-indigo-200">
        {report?.moonSign ?? report?.core?.moonSign ?? "—"}
      </span>{" "}
      · Sun:{" "}
      <span className="text-indigo-200">
        {report?.sunSign ?? report?.core?.sunSign ?? "—"}
      </span>
    </div>
  </div>

 {/* Current timing */}
<div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
    Current timing
  </div>

  {(() => {
    const ap = (report as any)?.activePeriods;
    const md =
      ap?.mahadasha?.lord ??
      ap?.mahadasha?.planet ??
      (report as any)?.mdad?.md?.planet ??
      "—";
    const ad =
      ap?.antardasha?.lord ??
      ap?.antardasha?.planet ??
      (report as any)?.mdad?.ad?.planet ??
      "—";

    return (
      <div className="mt-2 text-sm text-slate-100">
        MD/AD:{" "}
        <span className="text-indigo-200">
          {md} / {ad}
        </span>
      </div>
    );
  })()}
</div>
</div>

                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
