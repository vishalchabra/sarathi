// src/server/advisors/vehicle.ts
import "server-only";
import type { Place } from "@/lib/providers/grahaguru.types";
import { getFacts } from "@/server/core/facts";

export type BirthData = {
  dobISO?: string;
  tob?: string;        // "HH:mm"
  lat?: number;
  lon?: number;
  tz?: string;
  chart?: {
    longitudes?: Record<string, number>;
    houseOf?: Record<string, number>;   // planet -> natal house (1..12)
    fourthLord?: string;                // if you already compute lords, pass it here
  } | any;
};

const houseName = (n?: number) => (n ? `H${n}` : "—");

// Tiny placeholder so you always get a MD/AD (swap with real Vimshottari when ready)
function fakeVimshottari(now: Date, birth?: BirthData) {
  if (!birth?.dobISO) return { md: undefined, ad: undefined };
  const seq = ["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"];
  const t = Date.parse(`${birth.dobISO}T${birth.tob || "12:00"}:00`);
  const idx = Math.abs(Math.floor((now.getTime() - t) / (1000*3600*24*365.25))) % seq.length;
  return { md: seq[idx], ad: seq[(idx + 3) % seq.length] };
}

export async function vehicleAdvisor(params: {
  question: string;
  place: Place;
  dateISO?: string;
  birth?: BirthData;
}) {
   const { place, dateISO, birth } = params;

  // Ensure we always have a date (YYYY-MM-DD)
  const dateForFacts =
    dateISO ?? new Date().toISOString().slice(0, 10);

    // getFacts now expects (topic, context, ...).
  const facts = await getFacts(
    "vehicle",
    { place, dateISO: dateForFacts } as any
  );



  // Natal basics (from client if available)
  const natal = birth?.chart ?? {};
  const fourthLord = natal.fourthLord || "Venus";           // safe fallback
  const venHouse = natal.houseOf?.Venus as number | undefined;
  const lordHouse = natal.houseOf?.[fourthLord] as number | undefined;

  // Dasha (placeholder)
  const now = new Date(dateISO ?? new Date().toISOString());
  const { md, ad } = fakeVimshottari(now, birth);

    // Window construction: bestDay + Abhijit if available
  const f = facts as any;
  const bestDay = f.transit?.bestDay as string | undefined; // YYYY-MM-DD
  const ab = f.panchang?.abhijit as { start: string; end: string } | undefined;

  const windows =
    bestDay && ab
      ? [{ start: ab.start, peak: ab.start, end: ab.end, why: ["Abhijit within transit-favored day."] }]
      : bestDay
      ? [{ start: `${bestDay}T10:00:00`, peak: `${bestDay}T11:00:00`, end: `${bestDay}T12:00:00`, why: ["Midday calm within favored day."] }]
      : [];

  // Headline/Summary
  const headline = bestDay ? `Good window detected for vehicle: ${bestDay}` : "Guidance • vehicle";
   const summary = `Using Panchang & transits${f.healthy ? "" : " (fallbacks)"} for your question.`;

  // Explanatory paragraph for the Answer panel
  const whySentence =
    `Why this timing: vehicles are signified by the 4th house and Venus. ` +
    `Natal Venus ${venHouse ? `is in ${houseName(venHouse)}` : "placement unavailable"}; ` +
    `4th lord ${fourthLord}${lordHouse ? ` in ${houseName(lordHouse)}` : ""}. ` +
    `Current dashā MD ${md ?? "—"} / AD ${ad ?? "—"}.` +
    (bestDay ? ` Transit momentum favors ${bestDay}${ab ? ` (Abhijit ${ab.start}–${ab.end})` : ""}.` : "");

  // Why lists
  const factsList: string[] = [];
    if (f.transit?.bestDay) factsList.push(`Best day: ${f.transit.bestDay}`);
  if (f.panchang?.abhijit) factsList.push(`Abhijit: ${f.panchang.abhijit.start}–${f.panchang.abhijit.end}`);
  if (f.panchang?.rahuKaal) factsList.push(`Avoid Rahu Kaal: ${f.panchang.rahuKaal.start}–${f.panchang.rahuKaal.end}`);

  if (venHouse) factsList.push(`Natal Venus in ${houseName(venHouse)}.`);
  if (lordHouse) factsList.push(`4th lord ${fourthLord} in ${houseName(lordHouse)}.`);
  if (md || ad) factsList.push(`Current Vimshottari: MD ${md ?? "—"} / AD ${ad ?? "—"}.`);

  const rulesList = [
    "4th house + Venus signify vehicles.",
    "Dasha of Venus or 4th lord supports buying; avoid heavy afflictions.",
    "Prefer Abhijit; avoid Rahu/Gulika windows.",
  ];

  // Normalize hits for the UI
    const hitsUI = (f.transit?.hits ?? []).map((h: any) => ({

    planet: h.name ?? "Transit",
    target: h.note ?? "",
    orb: typeof h.orbDays === "number" ? h.orbDays : undefined,
    exact: h.exact,
  }));

    return {
    answer: {
      intent: "vehicle" as const,
      headline,
      summary,
      text: `${headline}\n\n${summary}\n\n${whySentence}`,
      confidence: f.healthy ? "High" : "Low",
      actions: [
        "Shortlist 2–3 cars",
        "Plan booking/test drive near the best window",
        "Avoid Rahu/Gulika windows",
      ],
      timing: { bestDay },
      warnings: f.warnings?.length ? f.warnings : undefined,
    },
    why: { facts: factsList, rules: rulesList, warnings: f.warnings ?? [] },
    context: {
      panchang: f.panchang,
      hits: hitsUI,
      windows: windows.map((w) => ({
        planet: "Venus/Jupiter",
        target: "Vehicle matters",
        start: w.start,
        peak: w.peak,
        end: w.end,
        minOrb: 0,
      })),
      dasha: { md, ad },
      natal: {
        karaka: "Venus",
        fourthLord,
        venusHouse: venHouse,
        fourthLordHouse: lordHouse,
      },
    },
  };
}
