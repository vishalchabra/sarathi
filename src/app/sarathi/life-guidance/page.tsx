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

function renderSarathiText(raw: string) {
  const raw0 = (raw ?? "").trim();
  if (!raw0) return null;

  const raw1 = raw0
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  const tryParse = (s: string) => {
    try {
      return JSON.parse(s);
    } catch {
      return null;
    }
  };

  let obj: any = tryParse(raw1);
  if (typeof obj === "string") {
    const obj2 = tryParse(obj);
    if (obj2) obj = obj2;
  }

  const bullets =
    obj && Array.isArray(obj.text)
      ? (obj.text as string[])
      : obj && typeof obj.text === "string"
        ? [obj.text]
        : null;

  const closing = obj && typeof obj.closing === "string" ? obj.closing : "";

  if (bullets && bullets.length) {
    return (
      <div className="space-y-3">
        <ul className="list-disc space-y-2 pl-5">
          {bullets.map((b, i) => (
            <li key={i}>{String(b)}</li>
          ))}
        </ul>
        {closing ? <p className="text-slate-300/80 italic">{closing}</p> : null}
      </div>
    );
  }

  return <p className="whitespace-pre-wrap">{raw1}</p>;
}

type GeoSuggestion = {
  name?: string;
  tz?: string;
  lat?: number | string;
  lon?: number | string;
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

function normalizePlace(p: Partial<Place> | null | undefined): Place {
  return {
    name: (p?.name ?? "").toString(),
    tz: (p?.tz ?? "Asia/Kolkata").toString(),
    lat: Number((p as any)?.lat ?? 0),
    lon: Number((p as any)?.lon ?? 0),
  };
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

  // 1) On first load: do NOT auto-prefill (as you wanted)
  useEffect(() => {
    // Intentionally blank.
  }, []);

  function setPicked(next: Place) {
    const ok =
      Boolean(next.name) &&
      Number.isFinite(next.lat) &&
      Number.isFinite(next.lon) &&
      Boolean(next.tz);
    setPlacePicked(ok);
  }

  function persistActiveProfile(nextPlace: Place, nextDobISO?: string, nextTob?: string) {
    saveBirthProfile({
      dobISO: (nextDobISO ?? dobISO ?? "").trim(),
      tob: toHHMM(nextTob ?? tob ?? ""),
      place: {
        name: nextPlace.name ?? "",
        tz: nextPlace.tz ?? "Asia/Kolkata",
        lat: Number(nextPlace.lat ?? 0),
        lon: Number(nextPlace.lon ?? 0),
      },
    });
  }

  // Optional (and fixes unused import): manual load saved profile
  function loadSavedProfile() {
    const p: any = loadBirthProfile?.();
    if (!p) {
      setError("No saved birth profile found yet. Generate Life Report once to save it.");
      return;
    }
    setError(null);

    const nextPlace = normalizePlace(p.place);
    setDobISO((p.dobISO ?? "").toString());
    setTob(toHHMM((p.tob ?? "").toString()));
    setPlace(nextPlace);
    setPlaceQuery(nextPlace.name ?? "");
    setSuggestions([]);
    setPicked(nextPlace);
  }

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

      const tryUrl = async (url: string) => {
        const res = await fetch(url, { method: "GET", signal: ac.signal });
        const data = await res.json().catch(() => ({}));
        console.log("life-guidance /api/life-report response:", data);
        const list: GeoSuggestion[] =
          (Array.isArray((data as any)?.results) && (data as any).results) ||
          (Array.isArray((data as any)?.places) && (data as any).places) ||
          (Array.isArray((data as any)?.items) && (data as any).items) ||
          [];
        return list;
      };

      // Try `q=` then fallback to `query=`
      let list = await tryUrl(`/api/geo?q=${encodeURIComponent(query)}`);
      if (!list.length) {
        list = await tryUrl(`/api/geo?query=${encodeURIComponent(query)}`);
      }

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
      name: (s?.name ?? "").toString(),
      tz: (s?.tz ?? "Asia/Kolkata").toString(),
      lat: typeof s?.lat === "number" ? s.lat : Number(s?.lat ?? 0),
      lon: typeof s?.lon === "number" ? s.lon : Number(s?.lon ?? 0),
    };

    setPlace(next);
    setPlaceQuery(next.name || "");
    setSuggestions([]);
    setPicked(next);
    setError(null);

    // Save as ACTIVE profile so Chat/Life Report stay in sync
    persistActiveProfile(next);
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

        try {
          // reverse to a place name + tz (best effort)
          const res = await fetch(`/api/geo?lat=${lat}&lon=${lon}`, { method: "GET" });
          const data = await res.json().catch(() => ({}));
          const name = (data as any)?.name || (data as any)?.place?.name || "My location";
          const tz = (data as any)?.tz || (data as any)?.place?.tz || place.tz || "Asia/Kolkata";

          const next: Place = { name, tz, lat, lon };
          setPlace(next);
          setPlaceQuery(name);
          setSuggestions([]);
          setPicked(next);

          persistActiveProfile(next);
        } catch {
          // fallback: set lat/lon only
          const next: Place = { ...place, lat, lon };
          setPlace(next);
          setSuggestions([]);
          setPicked(next);

          persistActiveProfile(next);
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

      const normalizedPlace = normalizePlace(place);

      // Keep ACTIVE profile updated
      persistActiveProfile(normalizedPlace, d, t);

      const res = await fetch("/api/life-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ✅ matches your api route expectation (birthDateISO/birthTime/birthTz/birthLat/birthLon)
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

      const payload: any = data;

// Unwrap common response shapes safely
let r: any =
  payload?.report ??
  payload?.data?.report ??
  payload?.result?.report ??
  payload?.result ??
  payload;

// Handle double-wrapped shape: { report: { report: {...}, aiSummary } }
if (r?.report && !r?.ascSign && !r?.core?.ascSign) {
  // keep wrapper fields like aiSummary if present
  const wrapper = r;
  r = r.report;

  // carry down aiSummary if it's outside the inner report
  if (!r.aiSummary && typeof wrapper.aiSummary === "string") {
    r.aiSummary = wrapper.aiSummary;
  }
}

// Also handle shape: { report: {...}, aiSummary: "..." } where we picked inner report
if (!r?.aiSummary && typeof payload?.aiSummary === "string") {
  r.aiSummary = payload.aiSummary;
}

setReport(r);

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
                <Badge className="border border-white/10 bg-white/5 text-slate-200">
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
              onClick={loadSavedProfile}
              variant="outline"
              className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
            >
              Load saved profile
            </Button>

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
                      className="w-full rounded-xl border border-white/10 bg-slate-950/40 py-2 pl-10 pr-3 text-sm text-slate-100 outline-none focus:border-indigo-400/50"
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
                    onClick={generate}
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
                      const latN = typeof s?.lat === "number" ? s.lat : Number(s?.lat ?? NaN);
                      const lonN = typeof s?.lon === "number" ? s.lon : Number(s?.lon ?? NaN);
                      const meta = `${s?.tz ?? "tz?"} · ${
                        Number.isFinite(latN) ? latN.toFixed(3) : "?"
                      }, ${Number.isFinite(lonN) ? lonN.toFixed(3) : "?"}`;

                      return (
                        <button
                          key={idx}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault(); // prevents blur clearing input before click
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

                {placeSearching && <div className="mt-2 text-xs text-slate-300/70">Searching…</div>}

                {placePicked && (
                  <div className="mt-2 text-xs text-emerald-300/80">
                    Place selected: <span className="text-slate-200">{place.name}</span> ({place.tz}) ·{" "}
                    {Number(place.lat).toFixed(3)}, {Number(place.lon).toFixed(3)}
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
                  <Link
                    className="underline underline-offset-4 text-indigo-300 hover:text-indigo-200"
                    href="/sarathi/life-report"
                  >
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
                ) : (() => {
  const r: any =
    (report as any)?.report?.report ??
    (report as any)?.report ??
    report;

  return (

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
                            MD/AD: <span className="text-indigo-200">{md} / {ad}</span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Guidance summary */}
                    <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Guidance summary
                      </div>

                      <div className="mt-2 leading-6 text-slate-200/90">
                        {renderSarathiText(
                          (report as any)?.aiSummary ||
                            (report as any)?.timelineSummary ||
                            (report as any)?.transitSummary ||
                            (report as any)?.dashaTransitSummary ||
                            ""
                        ) || (
                          <span className="text-slate-300/70">Generate once to see your summary here.</span>
                        )}
                      </div>
                    </div>
                     </div>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
