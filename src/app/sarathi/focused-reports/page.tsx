"use client";

import Link from "next/link";
import React, { useMemo, useRef, useState } from "react";
import TopNav from "../TopNav";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Download, Printer, Search } from "lucide-react";
import { loadBirthProfile, saveBirthProfile } from "@/lib/birth-profile";

type Place = { name?: string; tz: string; lat: number; lon: number };
type GeoSuggestion = {
  name?: string;
  tz?: string;
  lat?: number | string;
  lon?: number | string;
};
type Report = any;

function toHHMM(input: string) {
  const s = (input || "").trim();
  if (!s) return "";
  if (/^\d{2}:\d{2}$/.test(s)) return s;

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

function renderLines(arr: any) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return <div>No details available.</div>;
  }

  return (
    <div className="space-y-1">
      {arr.map((x, i) => (
        <div key={i}>{String(x)}</div>
      ))}
    </div>
  );
}

export default function FocusedReportsPage() {
  const [dobISO, setDobISO] = useState("");
  const [tob, setTob] = useState("");
  const [place, setPlace] = useState<Place>({
    name: "",
    tz: "Asia/Kolkata",
    lat: 0,
    lon: 0,
  });

  const [placeQuery, setPlaceQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([]);
  const [placePicked, setPlacePicked] = useState(false);
  const [placeSearching, setPlaceSearching] = useState(false);

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportType, setReportType] = useState<
    "career" | "marriage" | "money" | "property" | "health"
  >("career");

  const searchAbortRef = useRef<AbortController | null>(null);

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
      if (e?.name !== "AbortError") {
        setSuggestions([]);
      }
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

      const res = await fetch("/api/focused-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDateISO: d,
          birthTime: t,
          birthTz: normalizedPlace.tz,
          birthLat: normalizedPlace.lat,
          birthLon: normalizedPlace.lon,
          placeName: normalizedPlace.name,
          type: reportType,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          (data as any)?.message ||
            (data as any)?.error ||
            "Focused report failed"
        );
      }

      const reportData =
        (data as any)?.report ??
        (data as any)?.result?.report ??
        (data as any)?.result ??
        data;

      setReport(reportData as any);
    } catch (e: any) {
      setError(e?.message || "Failed to generate report.");
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
      pdf.save("Sarathi-Focused-Report.pdf");
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
    <div className="astro-bg min-h-screen text-foreground">
      <TopNav />

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .screen-only {
            display: none !important;
          }
          body {
            background: white !important;
          }
        }

        @media screen {
          .print-only {
            display: none !important;
          }
          .screen-only {
            display: block !important;
          }
        }
      `}</style>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl border border-indigo-400/30 bg-[color:var(--primary)]/10" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-foreground">
                  Focused Reports
                </h1>
                <Badge className="astro-card text-foreground">
                  Paid report
                </Badge>
              </div>
              <p className="mt-1 text-sm astro-text-soft">
                In-depth reports for the exact life area you want clarity on.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 no-print">
            <Button
              onClick={loadSavedProfile}
              variant="outline"
              className="rounded-xl border-[color:var(--border)] bg-background hover:bg-background hover:shadow-md"
            >
              Load saved profile
            </Button>

            <Button
              onClick={printPage}
              variant="outline"
              className="rounded-xl border-[color:var(--border)] bg-background hover:bg-background hover:shadow-md"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>

            <Button
              onClick={downloadPDF}
              variant="outline"
              className="rounded-xl border-[color:var(--border)] bg-background hover:bg-background hover:shadow-md"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="rounded-3xl astro-card backdrop-blur">
            <CardHeader>
              <CardTitle className="text-foreground">
                Enter birth details
              </CardTitle>
              <p className="text-sm astro-text-soft">
                Needed for accurate dasha and timing. Pick your city from the
                dropdown so lat/lon is correct.
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="mb-1 text-xs astro-text-soft">
                    Birth date 
                  </div>
                  <input
                    type="date"
                    value={dobISO}
                    onChange={(e) => setDobISO(e.target.value)}
                    className="w-full rounded-xl border border-[color:var(--border)] bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-[color:var(--primary)]/50"
                  />
                </div>

                <div>
                  <div className="mb-1 text-xs astro-text-soft">
                    Birth time (HH:MM)
                  </div>
                  <input
                    type="time"
                    step={60}
                    value={tob}
                    onChange={(e) => setTob(e.target.value)}
                    className="w-full rounded-xl border border-[color:var(--border)] bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-[color:var(--primary)]/50"
                  />
                </div>

                <div>
                  <div className="mb-1 text-xs astro-text-soft">
                    Time zone (IANA)
                  </div>
                  <input
                    value={place.tz}
                    onChange={(e) => {
                      const tz = e.target.value;
                      setPlace((p) => ({ ...p, tz }));
                      setPlacePicked(false);
                    }}
                    placeholder="Asia/Kolkata"
                    className="w-full rounded-xl border border-[color:var(--border)] bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-[color:var(--primary)]/50"
                  />
                </div>
              </div>

              <div className="relative">
                <div className="mb-1 text-xs astro-text-soft">
                  Birth place (search and pick)
                </div>

                <div className="mb-4">
                  <div className="text-xs astro-text-muted mb-2">
                    What do you want clarity on?
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: "career", label: "Career" },
                      { key: "marriage", label: "Marriage / Relationship" },
                      { key: "money", label: "Money" },
                      { key: "property", label: "Property" },
                      { key: "health", label: "Health" },
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setReportType(item.key as any)}
                        className={`px-3 py-1 rounded-full text-xs border ${
                          reportType === item.key
                            ? "bg-[color:var(--primary)] text-primary-foreground"
                            : "bg-background text-foreground border-[color:var(--border)]"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground" />
                    <input
                      value={placeQuery}
                      onChange={(e) => {
                        const v = e.target.value;
                        setPlaceQuery(v);
                        setPlacePicked(false);
                        searchPlaces(v);
                      }}
                      placeholder="Start typing city… (e.g., Saharanpur)"
                      className="w-full rounded-xl border border-[color:var(--border)] bg-background py-2 pl-10 pr-3 text-sm text-foreground outline-none focus:border-[color:var(--primary)]/50"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={useMyLocation}
                    className="rounded-xl border-[color:var(--border)] bg-background hover:bg-background hover:shadow-md"
                  >
                    Use my location
                  </Button>

                  <Button
                    type="button"
                    onClick={generate}
                    disabled={loading || !canGenerate}
                    className="rounded-xl bg-[color:var(--primary)] text-primary-foreground hover:opacity-90"
                  >
                    {loading ? "Generating…" : "Generate report"}
                  </Button>
                </div>

                {suggestions.length > 0 && (
                  <div className="mt-2 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-background backdrop-blur">
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
                          className="w-full px-4 py-3 text-left hover:bg-slate-100"
                        >
                          <div className="text-sm text-foreground">{label}</div>
                          <div className="text-xs astro-text-soft">{meta}</div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {placeSearching && (
                  <div className="mt-2 text-xs astro-text-soft">Searching…</div>
                )}

                {placePicked && (
                  <div className="mt-2 text-xs text-emerald-700">
                    Place selected:{" "}
                    <span className="text-foreground">{place.name}</span> ({place.tz})
                    {" · "}
                    {Number(place.lat).toFixed(3)}, {Number(place.lon).toFixed(3)}
                  </div>
                )}
              </div>

              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              {!placePicked && (
                <div className="text-xs astro-text-soft">
                  Tip: If you already generated Life Report once, your profile is
                  saved. If not, you can{" "}
                  <Link
                    className="underline underline-offset-4 text-[color:var(--primary)] hover:text-[color:var(--primary)]"
                    href="/sarathi/life-report"
                  >
                    open Life Report
                  </Link>{" "}
                  and save your birth profile there.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl astro-card backdrop-blur">
            <CardHeader>
              <CardTitle className="text-foreground">Report Preview</CardTitle>
              <p className="text-sm astro-text-soft">
                Generate to see your in-depth paid report here.
              </p>
            </CardHeader>

            <CardContent>
              <div
                id="guidancePrint"
                className="rounded-2xl border border-[color:var(--border)] astro-card p-6 text-sm text-foreground/90"
              >
                {!report ? (
                  <div className="astro-text-soft">
                    This page will show your area-specific paid report once generated.
                  </div>
                ) : (
                  <div className="space-y-6 text-sm text-foreground/90">
                    <div>
                      <div className="text-xs astro-text-muted mb-1">Verdict</div>
                      <div>{report.verdict}</div>
                    </div>

                    <div>
                      <div className="text-xs astro-text-muted mb-1">
                        Current reality
                      </div>
                      <div>{report.currentReality}</div>
                    </div>

                    <div>
                      <div className="text-xs astro-text-muted mb-1">
                        Why this area is active
                      </div>
                      {renderLines(report.whyThisAreaIsActive)}
                    </div>

                    <div>
                      <div className="text-xs astro-text-muted mb-1">
                        Likely developments
                      </div>
                      {renderLines(report.likelyDevelopments)}
                    </div>

                   <div>
  <div className="text-xs astro-text-muted mb-1">Timing</div>
  <div className="space-y-4">
    {report.timing?.now ? (
      <div>
        <div className="text-foreground mb-1">Now</div>
        <div>{report.timing.now}</div>
      </div>
    ) : null}

    <div>
      <div className="text-foreground mb-1">Next 30 days</div>
      {renderLines(report.timing?.next30Days)}
    </div>

    <div>
      <div className="text-foreground mb-1">Next 60 days</div>
      {renderLines(report.timing?.next60Days)}
    </div>

    <div>
      <div className="text-foreground mb-1">Next 90 days</div>
      {renderLines(report.timing?.next90Days)}
    </div>
  </div>
</div>
                    <div>
  <div className="text-xs astro-text-muted mb-1">
    Decision guidance
  </div>
  <div className="space-y-2">
    <div>
      <span className="text-foreground">Best move now:</span>{" "}
      {report.decisionGuidance?.bestMoveNow || report.decisionGuidance?.bestMove}
    </div>
    <div>
      <span className="text-foreground">Mistake to avoid now:</span>{" "}
      {report.decisionGuidance?.mistakeToAvoidNow || report.decisionGuidance?.avoid}
    </div>
    <div>
      <span className="text-foreground">What to postpone:</span>{" "}
      {report.decisionGuidance?.whatToPostpone || report.decisionGuidance?.delayIfPossible}
    </div>
    <div>
      <span className="text-foreground">Sign of improvement:</span>{" "}
      {report.decisionGuidance?.signOfImprovement || report.decisionGuidance?.prioritize}
    </div>
  </div>
</div>
                    <div>
                      <div className="text-xs astro-text-muted mb-1">
                        Opportunity / Risk
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-foreground">Opportunity:</span>{" "}
                          {report.opportunity}
                        </div>
                        <div>
                          <span className="text-foreground">Risk:</span> {report.risk}
                        </div>
                        <div>
                          <span className="text-foreground">Control lever:</span>{" "}
                          {report.controlLever}
                        </div>
                        <div>
                          <span className="text-foreground">Non-negotiable:</span>{" "}
                          {report.nonNegotiable}
                        </div>
                      </div>
                    </div>

                    {report.careerDeepDive ? (
                      <div>
                        <div className="text-xs astro-text-muted mb-1">
                          Career deep dive
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-foreground">Pattern now:</span>{" "}
                            {report.careerDeepDive.patternNow}
                          </div>
                          <div>
                            <span className="text-foreground">
                              What this often looks like:
                            </span>
                            <div className="mt-1">
                              {renderLines(report.careerDeepDive.whatThisOftenLooksLike)}
                            </div>
                          </div>
                          <div>
                            <span className="text-foreground">
                              Best use of this phase:
                            </span>{" "}
                            {report.careerDeepDive.bestUseOfThisPhase}
                          </div>
                          <div>
                            <span className="text-foreground">
                              Wrong use of this phase:
                            </span>{" "}
                            {report.careerDeepDive.wrongUseOfThisPhase}
                          </div>
                        </div>
                      </div>
                    ) : null}
                   {report.marriageDeepDive ? (
  <div>
    <div className="text-xs astro-text-muted mb-1">
      Marriage deep dive
    </div>
    <div className="space-y-2">
      <div>
        <span className="text-foreground">Pattern now:</span>{" "}
        {report.marriageDeepDive.patternNow}
      </div>
      <div>
        <span className="text-foreground">
          What this often looks like:
        </span>
        <div className="mt-1">
          {renderLines(report.marriageDeepDive.whatThisOftenLooksLike)}
        </div>
      </div>
      <div>
        <span className="text-foreground">
          Best use of this phase:
        </span>{" "}
        {report.marriageDeepDive.bestUseOfThisPhase}
      </div>
      <div>
        <span className="text-foreground">
          Wrong use of this phase:
        </span>{" "}
        {report.marriageDeepDive.wrongUseOfThisPhase}
      </div>
    </div>
  </div>
) : null}
{report.moneyDeepDive ? (
  <div>
    <div className="text-xs astro-text-muted mb-1">
      Money deep dive
    </div>
    <div className="space-y-2">
      <div>
        <span className="text-foreground">Pattern now:</span>{" "}
        {report.moneyDeepDive.patternNow}
      </div>
      <div>
        <span className="text-foreground">
          What this often looks like:
        </span>
        <div className="mt-1">
          {renderLines(report.moneyDeepDive.whatThisOftenLooksLike)}
        </div>
      </div>
      <div>
        <span className="text-foreground">
          Best use of this phase:
        </span>{" "}
        {report.moneyDeepDive.bestUseOfThisPhase}
      </div>
      <div>
        <span className="text-foreground">
          Wrong use of this phase:
        </span>{" "}
        {report.moneyDeepDive.wrongUseOfThisPhase}
      </div>
    </div>
  </div>
) : null}
{report.propertyDeepDive ? (
  <div>
    <div className="text-xs astro-text-muted mb-1">
      Property deep dive
    </div>
    <div className="space-y-2">
      <div>
        <span className="text-foreground">Pattern now:</span>{" "}
        {report.propertyDeepDive.patternNow}
      </div>
      <div>
        <span className="text-foreground">
          What this often looks like:
        </span>
        <div className="mt-1">
          {renderLines(report.propertyDeepDive.whatThisOftenLooksLike)}
        </div>
      </div>
      <div>
        <span className="text-foreground">
          Best use of this phase:
        </span>{" "}
        {report.propertyDeepDive.bestUseOfThisPhase}
      </div>
      <div>
        <span className="text-foreground">
          Wrong use of this phase:
        </span>{" "}
        {report.propertyDeepDive.wrongUseOfThisPhase}
      </div>
    </div>
  </div>
) : null}
{report.healthDeepDive ? (
  <div>
    <div className="text-xs astro-text-muted mb-1">
      Health deep dive
    </div>
    <div className="space-y-2">
      <div>
        <span className="text-foreground">Pattern now:</span>{" "}
        {report.healthDeepDive.patternNow}
      </div>
      <div>
        <span className="text-foreground">
          What this often looks like:
        </span>
        <div className="mt-1">
          {renderLines(report.healthDeepDive.whatThisOftenLooksLike)}
        </div>
      </div>
      <div>
        <span className="text-foreground">
          Best use of this phase:
        </span>{" "}
        {report.healthDeepDive.bestUseOfThisPhase}
      </div>
      <div>
        <span className="text-foreground">
          Wrong use of this phase:
        </span>{" "}
        {report.healthDeepDive.wrongUseOfThisPhase}
      </div>
    </div>
  </div>
) : null}
                    <div className="text-xs text-foreground">
                      Confidence: {report.confidence}
                    </div>

                    <div className="text-xs text-foreground">
                      {report.confidenceNote}
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