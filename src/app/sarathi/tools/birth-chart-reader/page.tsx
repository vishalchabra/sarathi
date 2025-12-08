"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CityAutocomplete, { type Place } from "../../../../components/CityAutocomplete";
import LifeReport from "../../../../components/LifeReport";

type PlaceFull = { name: string; lat: number; lon: number; tz?: string };

type Placement = {
  planet: string;
  sign?: string;
  degInSign?: number;
  nakshatra?: string;
  nak?: string;
  pada?: number | string;
};

function pickSign(data: any, planet: string): string | undefined {
  const fromArr =
    Array.isArray(data?.placements) &&
    data.placements.find(
      (p: any) => String(p?.planet || "").toLowerCase() === planet.toLowerCase()
    )?.sign;
  if (fromArr) return fromArr;
  const fromObj = data?.planets?.[planet]?.sign;
  if (fromObj) return fromObj;
  if (planet.toLowerCase() === "sun") return data?.summary?.sunSign;
  if (planet.toLowerCase() === "moon") return data?.summary?.moonSign;
  return undefined;
}

function ascSignOf(data: any): string | undefined {
  return data?.houses?.asc?.sign || data?.ascendant?.sign || data?.summary?.ascSign;
}

function weekdayOf(data: any, dobISO?: string): string | undefined {
  return (
    data?.panchang?.weekday ||
    (dobISO ? new Date(dobISO).toLocaleDateString(undefined, { weekday: "long" }) : undefined)
  );
}

function normalizePlacements(data: any): Placement[] {
  if (Array.isArray(data?.placements) && data.placements.length) return data.placements;
  const pl = data?.planets;
  if (pl && typeof pl === "object") {
    const order = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
    return order
      .filter((k) => pl[k])
      .map((k) => ({
        planet: k,
        sign: pl[k]?.sign,
        degInSign: typeof pl[k]?.degInSign === "number" ? pl[k].degInSign : undefined,
        nakshatra: pl[k]?.nakshatra || pl[k]?.nak,
        pada: pl[k]?.pada,
      }));
  }
  return [];
}

// Ensure data.summary.sunSign/moonSign/ascSign are present for all downstream UIs
function enrichSummary(d: any): any {
  const clone = { ...(d || {}) };
  const summary = { ...(clone.summary || {}) };
  summary.sunSign = summary.sunSign || pickSign(clone, "Sun");
  summary.moonSign = summary.moonSign || pickSign(clone, "Moon");
  summary.ascSign = summary.ascSign || ascSignOf(clone);
  clone.summary = summary;
  return clone;
}

export default function BirthChartReaderPage() {
  // inputs
  const [dobISO, setDobISO] = useState<string>("");
  const [tob, setTob] = useState<string>("");
  const [place, setPlace] = useState<PlaceFull | null>(null);

  // touched
  const [dobTouched, setDobTouched] = useState(false);
  const [tobTouched, setTobTouched] = useState(false);
  const [placeTouched, setPlaceTouched] = useState(false);

  // keys (kill autofill)
  const [dobKey, setDobKey] = useState<number>(() => 1);
  const [tobKey, setTobKey] = useState<number>(() => 2);
  const [cityKey, setCityKey] = useState<number>(() => 3);

  // options
  const [ayanamsa, setAyan] =
    useState<"lahiri" | "krishnamurti" | "raman" | "fagan">("lahiri");
  const [node, setNode] = useState<"mean" | "true">("mean");
  const [hsys, setHsys] = useState<"W" | "P">("W");

  // results
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // QA
  const [qaInput, setQaInput] = useState("");
  const [qaLoading, setQaLoading] = useState(false);
  const [qaAnswer, setQaAnswer] = useState<any>(null);
  const [qaError, setQaError] = useState<string | null>(null);

  const tz = place?.tz ?? "Asia/Kolkata";

  // blank on mount & nuke autofill
  useEffect(() => {
    setDobISO("");
    setTob("");
    setPlace(null);
    setDobTouched(false);
    setTobTouched(false);
    setPlaceTouched(false);
    const k = Date.now();
    setDobKey(k + 1);
    setTobKey(k + 2);
    setCityKey(k + 3);
  }, []);

  async function compute() {
    setData(null);
    if (!dobTouched || !tobTouched || !placeTouched || !dobISO || !tob || !place) {
      setData({ error: "Please enter DOB, TOB and select a city." });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/astro/placements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dobISO,
          tob,
          place: { tz, lat: Number(place.lat), lon: Number(place.lon), name: place.name },
          ayanamsa,
          node,
          hsys,
        }),
      });
      const raw = await res.json();
      const json = enrichSummary(raw);

      // cache for life-report page
      try {
        const cache = {
          profile: {
            name: "",
            dobISO,
            tob,
            place: { name: place.name, lat: Number(place.lat), lon: Number(place.lon), tz },
          },
          data: json,
          ts: Date.now(),
        };
        localStorage.setItem("sarathi.lifeReportCache", JSON.stringify(cache));
      } catch {}

      setData(json);
    } catch (err: unknown) {
      setData({ error: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setLoading(false);
    }
  }

  // Ask Anything (place-only OK; add birth if present)
  async function askQA() {
    setQaError(null);
    setQaAnswer(null);
    const q = (qaInput || "").trim();
    if (!q) { setQaError("Type a question first."); return; }
    if (!place || place.lat == null || place.lon == null) {
      setQaError("Pick a city with coordinates."); return;
    }

    setQaLoading(true);
    try {
      const payload: any = {
        message: q,
        place: { tz: tz || "Asia/Kolkata", lat: Number(place.lat), lon: Number(place.lon), name: place.name },
      };
      if (dobISO && tob) payload.birth = { dobISO, tob };

      const r = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await r.json().catch(() => ({}));
      if (!r.ok) setQaError(json?.error || `Server error ${r.status} ${r.statusText || ""}`.trim());
      else setQaAnswer(json);
    } catch (e: unknown) {
      setQaError(e instanceof Error ? e.message : "Ask failed");
    } finally {
      setQaLoading(false);
    }
  }

  function saveForChat() {
    if (!dobTouched || !tobTouched || !placeTouched || !dobISO || !tob || !place) {
      alert("Please enter Date/Time of Birth and select city first.");
      return;
    }
    try {
      const profile = {
        dobISO,
        tob,
        place: { name: place.name, lat: Number(place.lat), lon: Number(place.lon), tz: place.tz ?? tz },
      };
      localStorage.setItem("sarathi:chatProfile", JSON.stringify(profile));
      alert("Saved! Open the Chat page to ask questions about this profile.");
    } catch {
      alert("Could not save locally.");
    }
  }

  // derived UI
  const sunSign = useMemo(() => pickSign(data, "Sun"), [data]);
  const moonSign = useMemo(() => pickSign(data, "Moon"), [data]);
  const asc = useMemo(() => ascSignOf(data), [data]);
  const weekdayLabel = useMemo(() => weekdayOf(data, dobISO), [data, dobISO]);
  const placementsView = useMemo(() => normalizePlacements(data), [data]);

  return (
    <main className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-semibold">Birth Chart Reader</h1>
        <div className="flex items-center gap-2">
          <Link href="/sarathi/life-report" className="px-3 py-2 rounded border bg-white hover:bg-slate-50">
            Go to Life Report →
          </Link>
          <Link href="/sarathi/tools/charts" className="px-3 py-2 rounded border bg-white hover:bg-slate-50">
            Open Charts (D1/D9) →
          </Link>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid gap-2 sm:grid-cols-6">
        <input
          key={dobKey}
          className="border p-2 rounded"
          type="date"
          value={dobISO}
          onChange={(e) => setDobISO(e.target.value)}
          onInput={() => setDobTouched(true)}
          onBlur={() => setDobTouched(true)}
          placeholder="YYYY-MM-DD"
          autoComplete="off"
          name="dob-no-autofill"
        />
        <input
          key={tobKey}
          className="border p-2 rounded"
          type="time"
          value={tob}
          onChange={(e) => setTob(e.target.value)}
          onInput={() => setTobTouched(true)}
          onBlur={() => setTobTouched(true)}
          placeholder="HH:MM (24h)"
          autoComplete="off"
          name="tob-no-autofill"
        />

        <CityAutocomplete
          key={cityKey}
          className=""
          placeholder="Birth city (auto time-zone)"
          initialLabel={undefined}
          onSelect={(p: Place) => {
            setPlace({
              name: p.name,
              lat: Number((p as any).lat),
              lon: Number((p as any).lon),
              tz: (p as any).tz ?? tz,
            });
            setPlaceTouched(true);
          }}
        />

        <select className="border p-2 rounded" value={ayanamsa} onChange={(e) => setAyan(e.target.value as any)}>
          <option value="lahiri">Lahiri</option>
          <option value="krishnamurti">Krishnamurti</option>
          <option value="raman">Raman</option>
          <option value="fagan">Fagan/Bradley</option>
        </select>

        <select className="border p-2 rounded" value={node} onChange={(e) => setNode(e.target.value as any)}>
          <option value="mean">Mean Node</option>
          <option value="true">True Node</option>
        </select>

        <select
          className="border p-2 rounded"
          value={hsys}
          onChange={(e) => setHsys(e.target.value as "W" | "P")}
          title="House system"
        >
          <option value="W">Whole Sign (W)</option>
          <option value="P">Placidus (P)</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={compute} disabled={loading} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">
          {loading ? "Computing…" : "Compute placements"}
        </button>

        <button
          onClick={saveForChat}
          className="px-4 py-2 rounded border bg-white hover:bg-slate-50"
          disabled={!dobTouched || !tobTouched || !placeTouched}
          title="Save this birth profile for Chat"
        >
          Save for Chat
        </button>
      </div>

      {/* City preview */}
      {placeTouched && place ? (
        <div className="text-sm text-slate-600">
          <span className="font-medium">Selected:</span> {place.name} — tz: {tz}, lat {place.lat.toFixed(3)}, lon{" "}
          {place.lon.toFixed(3)}
        </div>
      ) : (
        <div className="text-sm text-slate-500">Tip: choose a city to auto-fill time-zone.</div>
      )}

      {/* Quick facts */}
      {data && !data.error && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="border rounded p-3"><div className="text-xs uppercase text-slate-500">Sun (sidereal)</div><div className="font-medium">{sunSign || "—"}</div></div>
          <div className="border rounded p-3"><div className="text-xs uppercase text-slate-500">Moon (sidereal)</div><div className="font-medium">{moonSign || "—"}</div></div>
          <div className="border rounded p-3"><div className="text-xs uppercase text-slate-500">Ascendant</div><div className="font-medium">{asc || "—"}</div></div>
          <div className="border rounded p-3"><div className="text-xs uppercase text-slate-500">Pañchāṅga (weekday)</div><div className="font-medium">{weekdayLabel || "—"}</div></div>
        </div>
      )}

      {/* QA */}
      <section className="card p-4 space-y-3 border rounded">
        <h2 className="section-title">Ask Anything (QA)</h2>
        <div className="flex gap-2">
          <input
            className="border p-2 rounded flex-1"
            placeholder='Try: "When will I buy a new car?"'
            value={qaInput}
            onChange={(e) => setQaInput(e.target.value)}
            autoComplete="off"
            name="qa-no-autofill"
          />
          <button type="button" onClick={askQA} disabled={qaLoading} className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-50">
            {qaLoading ? "Thinking…" : "Ask"}
          </button>
        </div>
        {qaError && <div className="text-sm text-red-700">{qaError}</div>}
        {qaAnswer?.answer && (
          <div className="space-y-2">
            <div className="font-medium">{qaAnswer.answer.headline || "Answer"}</div>
            <pre className="whitespace-pre-wrap text-sm">{qaAnswer.answer.text}</pre>
          </div>
        )}
      </section>

      {/* Results */}
      {data && (
        <div className="space-y-6">
          {data.error && <div className="card p-3 text-red-700">Error: {data.error}</div>}

          {data.warnings?.length ? (
            <div className="card p-3 text-amber-700">
              <div className="font-medium">Ephemeris warnings</div>
              <ul className="list-disc pl-5 text-sm">{data.warnings.map((w: string, i: number) => <li key={i}>{w}</li>)}</ul>
            </div>
          ) : null}

          {/* Placements (with fallback) */}
          {normalizePlacements(data).length > 0 && (
            <section className="card p-4 space-y-2">
              <h2 className="section-title">Placements (Sidereal)</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border rounded">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-2 py-1 border">Planet</th>
                      <th className="px-2 py-1 border">Sign</th>
                      <th className="px-2 py-1 border">Deg°</th>
                      <th className="px-2 py-1 border">Nakshatra</th>
                      <th className="px-2 py-1 border">Pada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {normalizePlacements(data).map((p: Placement, i: number) => (
                      <tr key={i} className={i % 2 ? "bg-slate-50/60" : undefined}>
                        <td className="px-2 py-1 border">{p.planet}</td>
                        <td className="px-2 py-1 border">{p.sign || ""}</td>
                        <td className="px-2 py-1 border">{typeof p.degInSign === "number" ? `${p.degInSign.toFixed(2)}°` : ""}</td>
                        <td className="px-2 py-1 border">{p.nakshatra ?? p.nak ?? ""}</td>
                        <td className="px-2 py-1 border">{p.pada ?? ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Houses */}
          {data?.houses && (
            <section className="card p-4 space-y-2">
              <h2 className="section-title">Ascendant & Houses ({data.houses.system || data.hsys || hsys})</h2>
              <div className="text-sm flex flex-wrap gap-6">
                {data.houses.asc && <div><b>Asc</b>: {data.houses.asc.sign} {data.houses.asc.degInSign.toFixed(2)}°</div>}
                {data.houses.mc && <div><b>MC</b>: {data.houses.mc.sign} {data.houses.mc.degInSign.toFixed(2)}°</div>}
              </div>
            </section>
          )}

          {/* Panchang */}
          {data?.panchang && (
            <section className="card p-4 space-y-2">
              <h2 className="section-title">Pañchāṅga</h2>
              <div className="text-sm grid sm:grid-cols-2 gap-2">
                <div><b>Weekday:</b> {data.panchang.weekday}</div>
                {data.panchang.tithi && <div><b>Tithi:</b> {data.panchang.tithi.paksha} {data.panchang.tithi.name} ({data.panchang.tithi.num})</div>}
                {data.panchang.nakshatra && <div><b>Nakshatra:</b> {data.panchang.nakshatra.name} — Pāda {data.panchang.nakshatra.pada}</div>}
                {data.panchang.yoga && <div><b>Yoga:</b> {data.panchang.yoga.name}</div>}
                {data.panchang.karana && <div><b>Karana:</b> {data.panchang.karana.name}</div>}
              </div>
            </section>
          )}

          {/* Life Report preview */}
          <LifeReport
            data={data}
            profile={{
              name: "",
              dobISO: dobTouched ? dobISO : "",
              tob: tobTouched ? tob : "",
              placeLabel: placeTouched && place ? place.name : undefined,
            }}
          />
        </div>
      )}
    </main>
  );
}
