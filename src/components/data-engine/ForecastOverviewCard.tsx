"use client";

import { useMemo, useState } from "react";

type ForecastFocus = "career" | "relationships" | "money" | "health" | "spiritual" | "home" | "general";
type Row = any;

type Props = {
  transitWindows?: Row[];
  transitNow?: Row[];
  upcomingTransits?: { moonTransits?: Row[]; planetaryTransits?: Row[]; allEvents?: Row[] } | null;
  currentDasha?: any;
  currentDashaLabel?: string;
  ascSign?: string | null;
};

type Signal = {
  id: string;
  dateISO: string;
  endISO: string;
  planet: string;
  event: string;
  house: number | null;
  sign: string | null;
  nakshatra: string | null;
  focus: ForecastFocus;
  strength: number;
};

const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];

const NAK_TO_SIGN: Record<string,string> = {
  Ashwini:"Aries", Bharani:"Aries", Krittika:"Aries", Rohini:"Taurus", Mrigashira:"Taurus",
  Ardra:"Gemini", Punarvasu:"Gemini", Pushya:"Cancer", Ashlesha:"Cancer", Magha:"Leo",
  "Purva Phalguni":"Leo", "Uttara Phalguni":"Leo", Hasta:"Virgo", Chitra:"Virgo",
  Swati:"Libra", Vishakha:"Libra", Anuradha:"Scorpio", Jyeshtha:"Scorpio",
  Mula:"Sagittarius", "Purva Ashadha":"Sagittarius", "Uttara Ashadha":"Sagittarius",
  Shravana:"Capricorn", Dhanishta:"Capricorn", Shatabhisha:"Aquarius",
  "Purva Bhadrapada":"Aquarius", "Uttara Bhadrapada":"Pisces", Revati:"Pisces",
};

const FOCUS_LABEL: Record<ForecastFocus,string> = {
  career:"Career", relationships:"Relationships", money:"Money", health:"Health",
  spiritual:"Spiritual / Inner", home:"Home / Property", general:"General",
};

const HOUSE_FOCUS: Record<number, ForecastFocus> = {
  1:"health", 2:"money", 3:"general", 4:"home", 5:"relationships", 6:"career",
  7:"relationships", 8:"health", 9:"spiritual", 10:"career", 11:"money", 12:"spiritual",
};

function planetName(v:any) {
  const s = String(v ?? "").trim();
  const a: Record<string,string> = {Su:"Sun",Mo:"Moon",Ma:"Mars",Me:"Mercury",Ju:"Jupiter",Ve:"Venus",Sa:"Saturn",Ra:"Rahu",Ke:"Ketu"};
  return a[s] ?? s;
}

function eventLabel(v:any) {
  const raw = String(v ?? "Transit").trim();
  const key = raw.toLowerCase().replace(/\s+/g,"_");
  const labels: Record<string,string> = {
    nakshatra_ingress:"Nakshatra change",
    sign_ingress:"Rashi change",
    rashi_ingress:"Rashi change",
    retrograde_start:"Retrograde starts",
    retrograde_end:"Retrograde ends",
    direct_station:"Direct motion starts",
    retrograde_station:"Retrograde motion starts",
    aspect_exact:"Aspect peak",
  };
  return labels[key] ?? raw.replace(/_/g," ").replace(/\b\w/g,(m)=>m.toUpperCase());
}

function dateObj(v:any) {
  if (!v) return null;
  const d = new Date(`${String(v).slice(0,10)}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function fmt(v:any) {
  const d = dateObj(v);
  return d ? d.toLocaleDateString("en-IN",{day:"2-digit",month:"short"}) : "—";
}

function month(v:any) {
  const d = dateObj(v);
  return d ? d.toLocaleDateString("en-IN",{month:"short",year:"numeric"}) : "Unknown";
}

function addMonths(d:Date, n:number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
}

function houseFromSign(sign:any, asc:any) {
  if (!sign || !asc) return null;
  const s = SIGNS.findIndex(x => x.toLowerCase() === String(sign).toLowerCase());
  const a = SIGNS.findIndex(x => x.toLowerCase() === String(asc).toLowerCase());
  if (s < 0 || a < 0) return null;
  return ((s - a + 12) % 12) + 1;
}

function numHouse(v:any) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 1 && n <= 12 ? n : null;
}

function nak(row:any) {
  return row?.nakshatra ?? row?.toNakshatra ?? row?.newNakshatra ?? row?.moonNakshatra ?? null;
}

function sign(row:any) {
  const n = nak(row);
  return row?.transitSign ?? row?.sign ?? row?.toSign ?? row?.newSign ?? row?.rashi ?? (n ? NAK_TO_SIGN[String(n)] : null) ?? null;
}

function inferFocus(signal: Signal): ForecastFocus {
  if (signal.house && HOUSE_FOCUS[signal.house]) return HOUSE_FOCUS[signal.house];
  const t = `${signal.planet} ${signal.event} ${signal.sign ?? ""} ${signal.nakshatra ?? ""}`.toLowerCase();
  if (/career|work|profession|saturn|sun/.test(t)) return "career";
  if (/relationship|marriage|partner|venus/.test(t)) return "relationships";
  if (/money|income|gain|resource/.test(t)) return "money";
  if (/health|routine|mars/.test(t)) return "health";
  if (/spiritual|dharma|jupiter|ketu/.test(t)) return "spiritual";
  return "general";
}

function normalize(row:any, i:number, ascSign?:string|null): Signal | null {
  if (!row || typeof row !== "object") return null;
  const dateISO = row.startISO ?? row.dateISO ?? row.date ?? row.from ?? row.startDate;
  if (!dateISO) return null;
  const s = sign(row);
  const h = numHouse(row.transitHouse ?? row.house) ?? houseFromSign(s, ascSign);
  const out: Signal = {
    id: String(row.id ?? `sig-${i}-${dateISO}`),
    dateISO,
    endISO: row.endISO ?? row.to ?? dateISO,
    planet: planetName(row.planet ?? row.name ?? row.body ?? row.transitPlanet) || "Planet",
    event: eventLabel(row.target ?? row.eventType ?? row.type ?? row.title ?? "Transit"),
    house: h,
    sign: s,
    nakshatra: nak(row),
    focus: "general",
    strength: Number(row.strength ?? row.score ?? 0.45),
  };
  out.focus = inferFocus(out);
  return out;
}

function currentDashaLabel(currentDasha:any, fallback?:string) {
  const get = (n:any) => typeof n === "string" ? n : n?.planet ?? n?.lord ?? n?.name ?? null;
  const md = get(currentDasha?.md) ?? get(currentDasha?.mahadasha);
  const ad = get(currentDasha?.ad) ?? get(currentDasha?.antardasha);
  const pd = get(currentDasha?.pd) ?? get(currentDasha?.pratyantardasha);
  const parts = [md && `MD ${planetName(md)}`, ad && `AD ${planetName(ad)}`, pd && `PD ${planetName(pd)}`].filter(Boolean);
  return parts.length ? parts.join(" / ") : fallback || "—";
}

function buildSignals(props: Props) {
  const raw = [
    ...(Array.isArray(props.transitWindows) ? props.transitWindows : []),
    ...(Array.isArray(props.upcomingTransits?.planetaryTransits) ? props.upcomingTransits!.planetaryTransits! : []),
    ...(Array.isArray(props.upcomingTransits?.moonTransits) ? props.upcomingTransits!.moonTransits! : []),
    ...(Array.isArray(props.upcomingTransits?.allEvents) ? props.upcomingTransits!.allEvents! : []),
    ...(Array.isArray(props.transitNow) ? props.transitNow : []),
  ];
  const seen = new Set<string>();
  return raw.map((r,i)=>normalize(r,i,props.ascSign)).filter(Boolean).filter((r:any)=>{
    const key = [r.dateISO,r.endISO,r.planet,r.event,r.house,r.sign,r.nakshatra].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }) as Signal[];
}

function summarize(rows:Signal[], focus:ForecastFocus) {
  const areaRows = rows.filter(r => r.focus === focus);
  const houses = Array.from(new Set(areaRows.map(r=>r.house).filter(Boolean))).slice(0,3);
  const planets = Array.from(new Set(areaRows.map(r=>r.planet))).slice(0,4);
  const score = areaRows.reduce((s,r)=>s + Math.max(0.25, Number(r.strength||0.45)),0);
  return { focus, label: FOCUS_LABEL[focus], rows: areaRows, houses, planets, score };
}
function strengthLabel(score: number) {
  if (score >= 18) return "Very Strong";
  if (score >= 10) return "Moderate";
  return "Mild";
}
export default function ForecastOverviewCard(props: Props) {
  const [months, setMonths] = useState(6);
  const [open, setOpen] = useState<ForecastFocus | null>(null);
  const now = useMemo(()=>new Date(),[]);
  const end = useMemo(()=>addMonths(now, months),[now,months]);
  const all = useMemo(()=>buildSignals(props),[props.transitWindows,props.upcomingTransits,props.transitNow,props.ascSign]);
  const rows = useMemo(()=>all.filter(r=>{
    const s = dateObj(r.dateISO);
    const e = dateObj(r.endISO) ?? s;
    if (!s && !e) return false;
    return (e ?? s!) >= now && (s ?? e!) <= end;
  }).sort((a,b)=>a.dateISO.localeCompare(b.dateISO)),[all,now,end]);

  const areas = useMemo(()=>(["career","money","relationships","health","home","spiritual","general"] as ForecastFocus[])
    .map(f=>summarize(rows,f)).filter(x=>x.rows.length).sort((a,b)=>b.score-a.score),[rows]);

  const top = areas.slice(0,3);

  const monthly = useMemo(()=>{
    const m = new Map<string,Signal[]>();
    rows.forEach(r => m.set(month(r.dateISO), [...(m.get(month(r.dateISO)) ?? []), r]));
    return Array.from(m.entries()).map(([k,v])=>{
      const dominant = (["career","money","relationships","health","home","spiritual","general"] as ForecastFocus[])
        .map(f=>summarize(v,f)).filter(x=>x.rows.length).sort((a,b)=>b.score-a.score)[0];
      return { month:k, rows:v, dominant };
    }).slice(0,6);
  },[rows]);

  return (
    <section className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Forecast Overview</h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-500">
            Life-area summary first. Expand only when you need the raw timing rows.
          </p>
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Period</label>
          <select value={months} onChange={(e)=>setMonths(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm outline-none focus:border-[color:var(--primary)]">
            <option value={3}>Next 3 months</option>
            <option value={6}>Next 6 months</option>
            <option value={12}>Next 12 months</option>
            <option value={24}>Next 24 months</option>
          </select>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Active Dasha</div>
          <div className="mt-2 text-sm font-semibold text-slate-950">{currentDashaLabel(props.currentDasha, props.currentDashaLabel)}</div>
          <div className="mt-1 text-xs text-slate-500">Timing context</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Signals Checked</div>
          <div className="mt-2 text-2xl font-semibold text-slate-950">{all.length}</div>
          <div className="mt-1 text-xs text-slate-500">Raw transit rows scanned</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Period Rows</div>
          <div className="mt-2 text-2xl font-semibold text-slate-950">{rows.length}</div>
          <div className="mt-1 text-xs text-slate-500">Rows in selected period</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Top Activated Areas</h3>
          <p className="mt-1 text-xs text-slate-500">Grouped from transit rows by house and planet.</p>
          {!top.length ? <div className="mt-4 rounded-xl border bg-slate-50 p-4 text-sm text-slate-500">No area signals found.</div> : null}
          <div className="mt-4 space-y-3">
            {top.map((area, idx) => {
              const isOpen = open === area.focus;
              const first = area.rows[0];
const last = area.rows[area.rows.length - 1];
              return <div key={area.focus} className="rounded-2xl border border-slate-200 bg-slate-50/60">
                <button type="button" onClick={()=>setOpen(isOpen?null:area.focus)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-bold text-slate-700 shadow-sm">{idx+1}</span>
                      <div>
  <div className="font-semibold text-slate-900">
    {area.label}
  </div>

  <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
    {strengthLabel(area.score)}
  </div>
</div>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {area.rows.length} timing rows{area.houses.length ? ` • H${area.houses.join(", H")}` : ""}{area.planets.length ? ` • ${area.planets.join(", ")}` : ""}
                    </div>
                    <div className="mt-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2">
  <div className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">
    Why Active
  </div>
<div className="mt-2 text-[11px] text-slate-500">
  Peak Window: {fmt(first?.dateISO)} – {fmt(last?.dateISO)}
</div>
  <ul className="mt-1 space-y-1 text-[11px] text-emerald-700">
    {area.planets.slice(0, 3).map((planet) => (
      <li key={planet}>• {planet} activation involved</li>
    ))}

    {area.houses.slice(0, 2).map((house) => (
      <li key={house}>• House {house} emphasized</li>
    ))}
  </ul>
</div>
                  </div>
                  <span className="text-xs font-medium text-slate-500">{isOpen ? "Hide" : "Details"}</span>
                </button>
                {isOpen ? <div className="border-t border-slate-200 px-4 py-3 space-y-2">
                  {area.rows.slice(0,8).map(r=><div key={r.id} className="grid grid-cols-[72px_1fr] gap-3 text-sm">
                    <div className="text-slate-500">{fmt(r.dateISO)}</div>
                    <div>
                      <div className="font-medium text-slate-900">{r.planet} • {r.event}</div>
                      <div className="mt-0.5 text-xs text-slate-500">{[r.house&&`H${r.house}`, r.sign&&`Rashi: ${r.sign}`, r.nakshatra&&`Nakshatra: ${r.nakshatra}`].filter(Boolean).join(" • ") || "Transit update"}</div>
                    </div>
                  </div>)}
                </div> : null}
              </div>
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Month-by-Month Pulse</h3>
          <p className="mt-1 text-xs text-slate-500">Dominant area by month.</p>
          <div className="mt-4 space-y-3">
            {!monthly.length ? <div className="rounded-xl border bg-slate-50 p-4 text-sm text-slate-500">No month signals available.</div> : null}
            {monthly.map(m=><div key={m.month} className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold text-slate-900">{m.month}</div>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">{m.dominant?.label}</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">{m.rows.length} timing rows{m.dominant?.houses.length ? ` • H${m.dominant.houses.join(", H")}` : ""}</div>
            </div>)}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4 text-sm text-slate-600">
        This page summarizes the most active planets, houses and life areas. Use it to quickly identify where the chart is currently focused before reviewing the detailed activation data.
      </div>
    </section>
  );
}
