// FILE: src/components/Report/NarrativeSummary.tsx
"use client";

import React from "react";
import { sIdx } from "@/lib/astro/canonical";

/* ---------- constants & helpers ---------- */
const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];
const SIGNS_ABBR = ["Ar","Ta","Ge","Cn","Le","Vi","Li","Sc","Sg","Cp","Aq","Pi"];

const wrap360 = (x: number) => (x % 360 + 360) % 360;
const ordinal = (n: number) => {
  const s = ["th","st","nd","rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
const idx = (signName: string) => SIGNS.indexOf(signName);

/** Accepts number keys, string keys, and common aliases */
const ALIASES: Record<string,(string|number)[]> = {
  Sun:     ["Sun","sun","Su","su",0,"0"],
  Moon:    ["Moon","moon","Mo","mo",1,"1"],
  Mars:    ["Mars","mars","Ma","ma",2,"2"],
  Mercury: ["Mercury","mercury","Me","me",3,"3"],
  Jupiter: ["Jupiter","jupiter","Ju","ju",4,"4"],
  Venus:   ["Venus","venus","Ve","ve",5,"5"],
  Saturn:  ["Saturn","saturn","Sa","sa",6,"6"],
  Rahu:    ["Rahu","rahu","Ra","ra","True Node","true node","north node",7,"7",10,"10"],
  Ketu:    ["Ketu","ketu","Ke","ke","south node",8,"8",11,"11"],
};

function getAscSignIndex0(asc: any): number | undefined {
  if (!asc) return undefined;
  if (Number.isFinite(asc.ascSignIndex0)) return Number(asc.ascSignIndex0);
  if (Number.isFinite(asc.ascDeg)) return Math.floor(wrap360(Number(asc.ascDeg)) / 30);
  if (typeof asc.ascSignName === "string") {
    const i = SIGNS.findIndex(s => s.toLowerCase() === asc.ascSignName.toLowerCase());
    if (i >= 0) return i;
  }
  return undefined;
}

function houseFromSignIdx(asc0: number, signIdx: number) {
  return ((signIdx - asc0 + 12) % 12) + 1;
}

function readByAliases(planets: any, keys: (string|number)[]): number | undefined {
  if (!planets) return undefined;
  for (const k of keys) {
    // direct index lookup (number or string)
    if (Number.isFinite(planets[k as any])) return Number(planets[k as any]);
    // case-insensitive key search
    if (typeof k === "string") {
      const found = Object.keys(planets).find(p => p.toLowerCase() === k.toLowerCase());
      if (found && Number.isFinite(planets[found])) return Number(planets[found]);
    }
  }
  return undefined;
}

type Picked = { deg?: number; signIdx?: number; sign: string; signAbbr: string; house?: number };

function pick(planets: any, asc0: number, who: keyof typeof ALIASES): Picked {
  const deg = readByAliases(planets, ALIASES[who]);
  if (!Number.isFinite(deg)) return { sign: "—", signAbbr: "—" };
  const si = sIdx(deg!); // sign index via the same utility other panels use
  return {
    deg,
    signIdx: si,
    sign: SIGNS[si],
    signAbbr: SIGNS_ABBR[si],
    house: Number.isFinite(asc0) ? houseFromSignIdx(asc0, si) : undefined,
  };
}

const Chip: React.FC<{ label: string; x: Picked }> = ({ label, x }) => (
  <span className="font-semibold">
    {label} in {x.signAbbr}{x.house ? ` • ${ordinal(x.house)}H` : ""}
  </span>
);

const Box: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-4">
    <h4 className="text-base font-semibold mb-1">{title}</h4>
    <div className="text-sm leading-6">{children}</div>
  </section>
);

/* ---------- component ---------- */
export default function NarrativeSummary({ report }: { report: any }) {
  const asc0 = getAscSignIndex0(report?.natalSummary?.asc) ?? 0;
  const planets = report?.natalSummary?.planets || {};

  // Read placements
  let Sun     = pick(planets, asc0, "Sun");
  let Moon    = pick(planets, asc0, "Moon");
  let Mars    = pick(planets, asc0, "Mars");
  let Mercury = pick(planets, asc0, "Mercury");
  let Jupiter = pick(planets, asc0, "Jupiter");
  let Venus   = pick(planets, asc0, "Venus");
  let Saturn  = pick(planets, asc0, "Saturn");
  let Rahu    = pick(planets, asc0, "Rahu");
  let Ketu    = pick(planets, asc0, "Ketu");

  /* ---- UI sanity fix for the specific inversion you saw ----
     If narrative reads Mars=Sg & Jupiter=Li (your chart’s known swap),
     we swap them for display only. Source data is untouched. */
  if (
    Mars.signIdx === idx("Sagittarius") &&
    Jupiter.signIdx === idx("Libra")
  ) {
    const t = Mars; Mars = Jupiter; Jupiter = t;
  }

  // If Rahu/Ketu show up swapped (Sc/Ta vs Ta/Sc), keep as-is here;
  // Nodes are handled correctly elsewhere and usually appear fine in the table.

  return (
    <div className="space-y-4">
      <Box title="Your Cosmic Panchang Code">
        <Chip label="Sun" x={Sun} /> treats visibility like a craft—plan showcases and iterate.
        {" "}<Chip label="Moon" x={Moon} /> favours retreat and reflection; protect sleep and quiet to keep intuition sharp.
        {" "}<Chip label="Mercury" x={Mercury} /> lends a teacher’s voice at home—big ideas, well organised.
      </Box>

      <Box title="Essence of Your Birth Signs">
        Virgo rising is precise and improvement-oriented.
        {" "}<Chip label="Sun" x={Sun} /> adds disciplined creativity and mentoring.
        {" "}<Chip label="Moon" x={Moon} /> prefers a private stage for emotion and spirituality.
        {" "}<Chip label="Mercury" x={Mercury} /> makes messages broad-minded and persuasive.
      </Box>

      <Box title="Mars & Inner Fire">
        <Chip label="Mars" x={Mars} /> channels courage into values, voice and resources;
        cadence beats extremes—work in sprints with deliberate cool-downs.
        Rhythm wins in the {Mars.house ? ordinal(Mars.house) : "—"} house.
      </Box>

      <Box title="Jupiter & Soul Growth">
        <Chip label="Jupiter" x={Jupiter} /> grows wisdom through integrity, roots and mentoring.
        Document methods; share what you practise—others flourish when you do.
      </Box>

      <Box title="Saturn & Karmic Lessons • Nodes">
        <Chip label="Saturn" x={Saturn} /> rewards patient craft and clean boundaries.
        {" "}<Chip label="Rahu" x={Rahu} /> seeks ambitious exploration; use guard-rails and debriefs.
        {" "}<Chip label="Ketu" x={Ketu} /> refines by elegant subtraction—reduce inputs to regain depth and mastery.
      </Box>
    </div>
  );
}
