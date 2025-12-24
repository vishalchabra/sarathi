// FILE: src/app/sarathi/life-guidance/page.tsx
"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import TopNav from "../TopNav";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Download, Printer, Search } from "lucide-react";

// IMPORTANT: this is the same storage used across the app
import { loadBirthProfile, saveBirthProfile } from "@/lib/birth-profile";

type Place = { name?: string; tz: string; lat: number; lon: number };
type GeoSuggestion = {
  name?: string;
  tz?: string;
  lat?: number | string;
  lon?: number | string;
};
type Report = any;
const PLANET_BEEJ_MANTRA: Record<string, string> = {
  Sun: "Om Hram Hreem Hroum Sah Suryaya Namah",
  Moon: "Om Shram Shreem Shroum Sah Chandraya Namah",
  Mars: "Om Kram Kreem Kroum Sah Bhaumaya Namah",
  Mercury: "Om Bram Breem Broum Sah Budhaya Namah",
  Jupiter: "Om Gram Greem Groum Sah Gurave Namah",
  Venus: "Om Dram Dreem Droum Sah Shukraya Namah",
  Saturn: "Om Pram Preem Proum Sah Shanaishcharaya Namah",
  Rahu: "Om Bhram Bhreem Bhroum Sah Rahave Namah",
  Ketu: "Om Sram Sreem Sroum Sah Ketave Namah",
};

/* ----------------------------- small UI helpers ---------------------------- */
function renderBullets(arr: any) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return (
    <ul className="mt-2 space-y-2 text-sm text-slate-100/90">
      {arr.map((x, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-300/80" />
          <span>{String(x)}</span>
        </li>
      ))}
    </ul>
  );
}

function stripJsonFences(raw: string) {
  return (raw ?? "")
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

function safeParseJson(raw: string) {
  const s = stripJsonFences(raw);
  if (!s) return { ok: true as const, obj: {} as any, raw: "" };
  try {
    return { ok: true as const, obj: JSON.parse(s), raw: s };
  } catch {
    return { ok: false as const, obj: null as any, raw: s };
  }
}

/**
 * FULL renderer (all sections). Use in paid experience when you want everything in one flow.
 * We will NOT use this in Overview tab (to avoid “everything in one block”).
 */
function renderSarathiText(raw: string) {
  const parsed = safeParseJson(raw);
  if (!parsed.ok) return <p className="whitespace-pre-wrap">{parsed.raw}</p>;
  const obj: any = parsed.obj ?? {};

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-2">
      <div className="text-[11px] font-medium tracking-wide text-slate-300/80">
        {title}
      </div>
      {children}
    </div>
  );

  const Bullets = ({ items }: { items?: any[] }) =>
    Array.isArray(items) && items.length ? (
      <ul className="mt-2 space-y-2 text-sm text-slate-100/90">
        {items.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-300/80" />
            <span>{String(b)}</span>
          </li>
        ))}
      </ul>
    ) : null;

  return (
    <div className="space-y-6">
      {obj.posture && (
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm leading-relaxed text-slate-100">
          {String(obj.posture)}
        </div>
      )}

      {obj.deepInsight && (
        <div className="rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-5 shadow-[0_0_40px_rgba(99,102,241,0.10)]">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            One thing to understand about yourself right now
          </div>
          <div className="text-sm leading-relaxed text-slate-100/95">
            {String(obj.deepInsight)}
          </div>
          {obj.evidence && (
            <div className="mt-2 text-xs text-indigo-200/80">
              {String(obj.evidence)}
            </div>
          )}
        </div>
      )}

      {Array.isArray(obj.nonNegotiables) && obj.nonNegotiables.length > 0 && (
        <Section title="Non-negotiables for this phase">
          <Bullets items={obj.nonNegotiables} />
        </Section>
      )}

      <Section title="Now (7 days)">
        <Bullets items={obj.now} />
      </Section>

      <Section title="Near phase (30–60 days)">
        <Bullets items={obj.next30} />
      </Section>

      <Section title="Do">
        <Bullets items={obj.do} />
      </Section>

      <Section title="Don’t">
        <Bullets items={obj.dont} />
      </Section>

      {obj.remedies && (
        <Section title="Discipline plan for this phase">
          <div className="space-y-4">
            {obj.remedies.daily && (
              <div>
                <div className="mb-1 text-xs font-semibold text-slate-300">
                  Daily discipline
                </div>
                <Bullets items={obj.remedies.daily} />
              </div>
            )}

            {obj.remedies.shortTerm && (
              <div>
                <div className="mb-1 text-xs font-semibold text-slate-300">
                  Supportive discipline
                </div>
                <Bullets items={obj.remedies.shortTerm} />
              </div>
            )}

            {obj.remedies.longTerm && (
              <div>
                <div className="mb-1 text-xs font-semibold text-slate-300">
                  Corrective discipline
                </div>
                <Bullets items={obj.remedies.longTerm} />
              </div>
            )}

            {obj.remedies.optional && (
              <div>
                <div className="mb-1 text-xs font-semibold text-slate-300">
                  Optional
                </div>
                <Bullets items={obj.remedies.optional} />
              </div>
            )}
          </div>
        </Section>
      )}

      {obj.closing && (
        <p className="italic text-slate-300/80">{String(obj.closing)}</p>
      )}
    </div>
  );
}

/**
 * SHORT renderer (only posture + deep insight). Use in Overview tab.
 * This fixes your “everything appears as one block” issue.
 */
function renderSarathiSummary(raw: string) {
  const parsed = safeParseJson(raw);
  if (!parsed.ok) return <p className="whitespace-pre-wrap">{parsed.raw}</p>;
  const obj: any = parsed.obj ?? {};

  return (
    <div className="space-y-4">
      {obj.posture && (
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm leading-relaxed text-slate-100">
          {String(obj.posture)}
        </div>
      )}

      {obj.deepInsight && (
        <div className="rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-5 shadow-[0_0_40px_rgba(99,102,241,0.10)]">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            One thing to understand about yourself right now
          </div>

          <div className="text-sm leading-relaxed text-slate-100/95">
            {String(obj.deepInsight)}
          </div>

          {obj.evidence && (
            <div className="mt-2 text-xs text-indigo-200/80">
              {String(obj.evidence)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ----------------------------- misc utilities ----------------------------- */
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

/* --------------------------------- Page ---------------------------------- */
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

  const isPaid = true; // TODO: replace with real subscription check later

  useEffect(() => {
    // Intentionally blank (no auto-prefill)
  }, []);

  function setPicked(next: Place) {
    const ok =
      Boolean(next.name) &&
      Number.isFinite(next.lat) &&
      Number.isFinite(next.lon) &&
      Boolean(next.tz);
    setPlacePicked(ok);
  }

  function persistActiveProfile(
    nextPlace: Place,
    nextDobISO?: string,
    nextTob?: string
  ) {
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

  function loadSavedProfile() {
    const p: any = loadBirthProfile?.();
    if (!p) {
      setError(
        "No saved birth profile found yet. Generate Life Report once to save it."
      );
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
        const list: GeoSuggestion[] =
          (Array.isArray((data as any)?.results) && (data as any).results) ||
          (Array.isArray((data as any)?.places) && (data as any).places) ||
          (Array.isArray((data as any)?.items) && (data as any).items) ||
          [];
        return list;
      };

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
          const res = await fetch(`/api/geo?lat=${lat}&lon=${lon}`, {
            method: "GET",
          });
          const data = await res.json().catch(() => ({}));
          const name =
            (data as any)?.name || (data as any)?.place?.name || "My location";
          const tz =
            (data as any)?.tz ||
            (data as any)?.place?.tz ||
            place.tz ||
            "Asia/Kolkata";

          const next: Place = { name, tz, lat, lon };
          setPlace(next);
          setPlaceQuery(name);
          setSuggestions([]);
          setPicked(next);

          persistActiveProfile(next);
        } catch {
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

  async function generate() {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const d = (dobISO || "").trim();
      const t = toHHMM(tob);

      if (!d) throw new Error("Please enter your birth date.");
      if (!t) throw new Error("Please enter your birth time.");
      if (!placePicked) throw new Error("Please select a place from dropdown.");

      const normalizedPlace = {
        name: place.name ?? "",
        tz: place.tz ?? "Asia/Kolkata",
        lat: Number(place.lat),
        lon: Number(place.lon),
      };

      saveBirthProfile({
        dobISO: d,
        tob: t,
        place: normalizedPlace,
      });

      const res = await fetch("/api/life-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      if (!res.ok) {
        throw new Error((data as any)?.message || (data as any)?.error || "Life report failed");
      }

      const reportData =
        (data as any)?.report ??
        (data as any)?.result?.report ??
        (data as any)?.result ??
        data;

      const aiSummary =
        (data as any)?.aiSummary ??
        (data as any)?.result?.aiSummary ??
        (reportData as any)?.aiSummary ??
        "";

      setReport({ ...(reportData as any), aiSummary });
    } catch (e: any) {
      setError(e?.message || "Failed to generate guidance.");
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
     <style jsx global>{`
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    .screen-only { display: none !important; }
    body { background: white !important; }
  }
  @media screen {
    .print-only { display: none !important; }
    .screen-only { display: block !important; }
  }
`}</style>

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

          <div className="flex flex-wrap items-center gap-2 no-print">
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
                      const latN =
                        typeof s?.lat === "number" ? s.lat : Number(s?.lat ?? NaN);
                      const lonN =
                        typeof s?.lon === "number" ? s.lon : Number(s?.lon ?? NaN);
                      const meta = `${s?.tz ?? "tz?"} · ${
                        Number.isFinite(latN) ? latN.toFixed(3) : "?"
                      }, ${Number.isFinite(lonN) ? lonN.toFixed(3) : "?"}`;

                      return (
                        <button
                          key={idx}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
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
                    Place selected: <span className="text-slate-200">{place.name}</span>{" "}
                    ({place.tz}) · {Number(place.lat).toFixed(3)},{" "}
                    {Number(place.lon).toFixed(3)}
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
                    const r: any = report;

                    // Always derive signs reliably (fixes "Moon/Sun gone")
                    const getPlanetSign = (name: string) =>
                      (r?.planets || []).find(
                        (p: any) => (p?.name || "").toLowerCase() === name
                      )?.sign;

                    const ascSign =
                      r?.core?.ascSign ?? r?.ascSign ?? getPlanetSign("asc") ?? "—";
                    const moonSign =
                      r?.core?.moonSign ?? r?.moonSign ?? getPlanetSign("moon") ?? "—";
                    const sunSign =
                      r?.core?.sunSign ?? r?.sunSign ?? getPlanetSign("sun") ?? "—";

                    const aiRaw = String(r?.aiSummary ?? "");
                    const parsed = safeParseJson(aiRaw);
                    const aiObj: any = parsed.ok ? parsed.obj : {};

                    const ap = r?.activePeriods ?? null;
                    const md =
                      ap?.mahadasha?.lord ??
                      ap?.mahadasha?.planet ??
                      r?.mdad?.md?.planet ??
                      "—";
                    const ad =
                      ap?.antardasha?.subLord ??
                      ap?.antardasha?.lord ??
                      ap?.antardasha?.planet ??
                      "—";
                    const planet = String(aiObj?.remedyPlanet ?? aiObj?.activePlanet ?? "").trim();
const mantra = PLANET_BEEJ_MANTRA[planet] ?? null;

                    return (
                      
                      <div className="space-y-4 text-sm text-slate-200/80">
                        <div className="screen-only">
                        <Tabs defaultValue="overview" className="w-full">
                          <TabsList className="w-full justify-start gap-2 rounded-2xl border border-white/10 bg-slate-950/40 p-1 sticky top-2 z-10 backdrop-blur">
                            <TabsTrigger value="overview" className="rounded-xl">
                              Overview
                            </TabsTrigger>
                            <TabsTrigger value="plan" className="rounded-xl">
                              Plan
                            </TabsTrigger>
                            <TabsTrigger value="do" className="rounded-xl">
                              Do / Don’t
                            </TabsTrigger>
                            <TabsTrigger value="remedies" className="rounded-xl">
                              Remedies
                            </TabsTrigger>
                          </TabsList>

                          {/* OVERVIEW */}
                          <TabsContent value="overview" className="mt-4 space-y-4">
                            {/* Core birth signature */}
                            <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Core birth signature
                              </div>
                              <div className="mt-2 text-sm text-slate-100">
                                Asc: <span className="text-indigo-200">{ascSign}</span> ·
                                Moon: <span className="text-indigo-200"> {moonSign}</span> ·
                                Sun: <span className="text-indigo-200"> {sunSign}</span>
                              </div>
                            </div>

                            {/* Current timing */}
                            <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Current timing
                              </div>
                              <div className="mt-2 text-sm text-slate-100">
                                MD/AD: <span className="text-indigo-200">{md} / {ad}</span>
                              </div>
                              <div className="mt-2 text-xs text-slate-300/70">
                                Guidance cycle: valid for your current phase (approx. 30–45 days).
                              </div>
                            </div>

                            {/* Guidance principle */}
                            <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
                              <div className="text-[11px] font-medium tracking-wide text-slate-300/60">
                                Guidance principle
                              </div>
                              <p className="mt-1 text-[12px] leading-relaxed text-slate-200/75">
                                This guidance is designed for decisions, discipline, and inner stability — not predictions.
                              </p>
                            </div>

                            {/* Guidance summary (short) */}
                            <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Guidance summary
                              </div>

                              {isPaid ? (
                                <div className="mt-3 text-slate-200/90">
                                  {renderSarathiSummary(aiRaw)}
                                </div>
                              ) : (
                                <div className="mt-3 text-slate-200/90 relative">
                                  <div className="blur-sm pointer-events-none select-none">
                                    {renderSarathiSummary(aiRaw)}
                                  </div>

                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="rounded-2xl border border-indigo-400/30 bg-slate-950/80 px-4 py-3 text-center backdrop-blur">
                                      <div className="text-sm font-semibold text-slate-100">
                                        Unlock your Guidance Briefing
                                      </div>
                                      <div className="mt-1 text-xs text-slate-300">
                                        Deep insight + non-negotiables + discipline plan for your current life phase.
                                      </div>
                                      <div className="mt-3 flex items-center justify-center gap-2">
                                        <Button className="rounded-xl bg-indigo-500 hover:bg-indigo-400">
                                          Unlock Life Guidance
                                        </Button>
                                        <Button
                                          variant="outline"
                                          className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
                                        >
                                          See plans
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                          
                          {/* PLAN */}
                          <TabsContent value="plan" className="mt-4 space-y-4">
                            <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Non-negotiables
                              </div>
                              {renderBullets(aiObj?.nonNegotiables)}
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Now (7 days)
                              </div>
                              {renderBullets(aiObj?.now)}
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Next 30–60 days
                              </div>
                              {renderBullets(aiObj?.next30)}
                            </div>
                          </TabsContent>

                          {/* DO / DON'T */}
                          <TabsContent value="do" className="mt-4 space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                  Do
                                </div>
                                {renderBullets(aiObj?.do)}
                              </div>

                              <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                  Don’t
                                </div>
                                {renderBullets(aiObj?.dont)}
                              </div>
                            </div>
                          </TabsContent>

                          {/* REMEDIES */}
                          <TabsContent value="remedies" className="mt-4 space-y-4">
                            <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Daily (≤10 min)
                              </div>
                              {renderBullets(aiObj?.remedies?.daily)}
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Short-term (7–14 days)
                              </div>
                              {renderBullets(aiObj?.remedies?.shortTerm)}
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Long-term (40–90 days)
                              </div>
                              {renderBullets(aiObj?.remedies?.longTerm)}
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Optional
                              </div>
                              {renderBullets(aiObj?.remedies?.optional)}
                            </div>
                           
                            {!parsed.ok && (
                              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
                                Note: AI output was not valid JSON, so tabs may show limited content.
                              </div>
                            )}
                            
                          </TabsContent>
                        </Tabs>
                        
                        <div className="flex justify-end">
  <Button asChild className="rounded-xl bg-indigo-500 hover:bg-indigo-400">
    <Link href="/sarathi/chat?ref=life-guidance">
      Want deeper personalization? Go to Chat →
    </Link>
  </Button>
</div>

                      </div>
                      </div>
                    );
                    <div className="print-only space-y-4">
  {/* Overview */}
  <div className="rounded-2xl border border-slate-300 p-4 text-slate-900">
    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
      Core birth signature
    </div>
    <div className="mt-2 text-sm">
      Asc: <span className="font-semibold">{r?.ascSign ?? r?.core?.ascSign ?? "—"}</span> ·
      Moon: <span className="font-semibold">{r?.moonSign ?? r?.core?.moonSign ?? "—"}</span> ·
      Sun: <span className="font-semibold">{r?.sunSign ?? r?.core?.sunSign ?? "—"}</span>
    </div>
  </div>

  <div className="rounded-2xl border border-slate-300 p-4 text-slate-900">
    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
      Guidance summary
    </div>
    <div className="mt-2">
      {renderSarathiText(String((r as any)?.aiSummary ?? (report as any)?.aiSummary ?? ""))}
    </div>
  </div>

  {/* Plan */}
  <div className="rounded-2xl border border-slate-300 p-4 text-slate-900">
    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
      Non-negotiables
    </div>
    {renderBullets((aiObj as any)?.nonNegotiables)}
  </div>

  <div className="rounded-2xl border border-slate-300 p-4 text-slate-900">
    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
      Now (7 days)
    </div>
    {renderBullets((aiObj as any)?.now)}
  </div>

  <div className="rounded-2xl border border-slate-300 p-4 text-slate-900">
    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
      Next 30–60 days
    </div>
    {renderBullets((aiObj as any)?.next30)}
  </div>

  {/* Do / Don't */}
  <div className="rounded-2xl border border-slate-300 p-4 text-slate-900">
    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Do</div>
    {renderBullets((aiObj as any)?.do)}
  </div>

  <div className="rounded-2xl border border-slate-300 p-4 text-slate-900">
    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Don’t</div>
    {renderBullets((aiObj as any)?.dont)}
  </div>

  {/* Remedies */}
  <div className="rounded-2xl border border-slate-300 p-4 text-slate-900">
    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Daily (≤10 min)</div>
    {renderBullets((aiObj as any)?.remedies?.daily)}
  </div>

  <div className="rounded-2xl border border-slate-300 p-4 text-slate-900">
    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Short-term (7–14 days)</div>
    {renderBullets((aiObj as any)?.remedies?.shortTerm)}
  </div>

  <div className="rounded-2xl border border-slate-300 p-4 text-slate-900">
    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Long-term (40–90 days)</div>
    {renderBullets((aiObj as any)?.remedies?.longTerm)}
  </div>

  <div className="rounded-2xl border border-slate-300 p-4 text-slate-900">
    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Optional</div>
    {renderBullets((aiObj as any)?.remedies?.optional)}
  </div>
</div>
                  })()}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
