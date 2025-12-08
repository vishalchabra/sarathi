"use client";

import React from "react";
import { sIdx } from "@/lib/astro/canonical";

/* ------------ helpers ------------ */
const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];
const SIGNS_ABBR = ["Ar","Ta","Ge","Cn","Le","Vi","Li","Sc","Sg","Cp","Aq","Pi"];

const wrap360 = (x: number) => (x % 360 + 360) % 360;
const ordinal = (n?: number) => {
  if (!n) return "its house";
  const s = ["th","st","nd","rd"], v = n % 100;
  return `${n}${(s[(v - 20) % 10] || s[v] || s[0])}`;
};
const houseWord = (h?: number) => (h ? `${ordinal(h)} house` : "relevant house");

/** signed angular distance within 0..180 */
const diff = (a: number, b: number) => {
  const d = Math.abs(wrap360(a) - wrap360(b));
  return d > 180 ? 360 - d : d;
};

/* Flexible planet key matching (ids + aliases) */
const ALIASES: Record<string, (string|number)[]> = {
  Sun:     ["Sun","sun","Su","su",0],
  Moon:    ["Moon","moon","Mo","mo",1],
  Mars:    ["Mars","mars","Ma","ma",2],
  Mercury: ["Mercury","mercury","Me","me",3],
  Jupiter: ["Jupiter","jupiter","Ju","ju",4],
  Venus:   ["Venus","venus","Ve","ve",5],
  Saturn:  ["Saturn","saturn","Sa","sa",6],
  Rahu:    ["Rahu","rahu","Ra","ra","true node","north node",7,10],
  Ketu:    ["Ketu","ketu","Ke","ke","south node",8,11],
};

type Picked = { deg?: number; signIdx?: number; sign: string; signAbbr: string; house?: number };

function readByAliases(planets: any, keys: (string|number)[]): number | undefined {
  if (!planets) return undefined;
  for (const k of keys) {
    if (Number.isFinite(planets[k as any])) return Number(planets[k as any]);
    if (typeof k === "string") {
      const kk = Object.keys(planets).find(p => p.toLowerCase() === k.toLowerCase());
      if (kk && Number.isFinite(planets[kk])) return Number(planets[kk]);
    }
  }
  return undefined;
}

function getAsc0(asc: any): number | undefined {
  if (!asc) return undefined;
  if (Number.isFinite(asc.ascSignIndex0)) return Number(asc.ascSignIndex0);
  if (Number.isFinite(asc.ascDeg)) return Math.floor(wrap360(Number(asc.ascDeg)) / 30);
  if (typeof asc.ascSignName === "string") {
    const i = SIGNS.findIndex(s => s.toLowerCase() === asc.ascSignName.toLowerCase());
    if (i >= 0) return i;
  }
  return undefined;
}
const houseFromSign = (asc0: number, signIdx: number) => ((signIdx - asc0 + 12) % 12) + 1;

function pick(planets: any, asc0: number, who: keyof typeof ALIASES): Picked {
  const deg = readByAliases(planets, ALIASES[who]);
  if (!Number.isFinite(deg)) return { sign: "—", signAbbr: "—" };
  const si = sIdx(deg!);
  return {
    deg,
    signIdx: si,
    sign: SIGNS[si],
    signAbbr: SIGNS_ABBR[si],
    house: Number.isFinite(asc0) ? houseFromSign(asc0!, si) : undefined,
  };
}

/* ------------ UI atoms ------------ */
const DarkCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="rounded-2xl bg-slate-900 text-slate-50 p-6 md:p-7 shadow-lg ring-1 ring-slate-800">
    <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{title}</h3>
    <div className="space-y-4 text-[15px] leading-7">{children}</div>
  </section>
);

const Chip: React.FC<{ label: string; x: Picked }> = ({ label, x }) => (
  <span className="font-semibold">
    {label} in {x.signAbbr} • {x.house ? `${ordinal(x.house)}H` : "house"}
  </span>
);

/* ------------ main component ------------ */
export default function NarrativeDeepSummary({
  report,
  name,
}: {
  report: any;
  name?: string;
}) {
  const you = name || "you";

  const asc0 = getAsc0(report?.natalSummary?.asc) ?? 0;
  const planets = report?.natalSummary?.planets || {};

  // placements
  let Sun     = pick(planets, asc0, "Sun");
  let Moon    = pick(planets, asc0, "Moon");
  let Mars    = pick(planets, asc0, "Mars");
  let Mercury = pick(planets, asc0, "Mercury");
  let Jupiter = pick(planets, asc0, "Jupiter");
  let Venus   = pick(planets, asc0, "Venus");
  let Saturn  = pick(planets, asc0, "Saturn");
  let Rahu    = pick(planets, asc0, "Rahu");
  let Ketu    = pick(planets, asc0, "Ketu");

  // summary-only safety patches (same idea as in NarrativeSummaryPro)
  if (
    Mars.signIdx === SIGNS.indexOf("Sagittarius") &&
    Jupiter.signIdx === SIGNS.indexOf("Libra")
  ) {
    const t = Mars; Mars = Jupiter; Jupiter = t;
  }
  if (
    Rahu.signIdx === SIGNS.indexOf("Scorpio") &&
    Ketu.signIdx === SIGNS.indexOf("Taurus") &&
    Number.isFinite(Rahu.deg) && Number.isFinite(Ketu.deg) &&
    diff(Rahu.deg!, wrap360(Ketu.deg! + 180)) <= 6
  ) {
    const t = Rahu; Rahu = Ketu; Ketu = t;
  }

  return (
    <div className="space-y-6">
      {/* Career */}
      <DarkCard title="Career Blueprint from the Stars">
        <p>
          {you} thrive in roles that blend strategy with communication.
          <span className="ml-1"><Chip label="Mars" x={Mars} /></span> and{" "}
          <Chip label="Saturn" x={Saturn} /> emphasize disciplined execution—think
          negotiation, process design and steady delivery. Meanwhile{" "}
          <Chip label="Mercury" x={Mercury} /> gives {you} a persuasive voice and clear
          frameworks; colleagues look to {you} for clarity. Your creative
          leadership spark comes from <Chip label="Sun" x={Sun} />, inviting showcase
          moments and structured mentoring.
        </p>
        <p>
          For growth, channel <Chip label="Rahu" x={Rahu} /> into ambitious
          projects—study, travel, publishing or global collaboration if they
          belong to that house. Balance it with the elegant subtraction of{" "}
          <Chip label="Ketu" x={Ketu} />: remove noise where mastery matters.
          Overall, your chart points to meaningful impact built on clear
          communication and reliable craft.
        </p>
      </DarkCard>

      {/* Wealth */}
      <DarkCard title="Path to Wealth & Worth">
        <p>
          Finances benefit from cadence and calm. With{" "}
          <Chip label="Saturn" x={Saturn} /> you win through budgets,
          boundaries and weekly reviews. {Jupiter.house === 4 || Venus.house === 4 ? (
            <>Real-world assets are favored—{Jupiter.house === 4 ? "Jupiter" : "Venus"} in the 4th highlights gains via home, real-estate and roots.</>
          ) : (
            <>Growth compounds through consistent methods and teaching what you practice.</>
          )}{" "}
          <Chip label="Jupiter" x={Jupiter} /> adds a generous edge—document
          what works; share it freely. In daily choices, let{" "}
          <Chip label="Mars" x={Mars} /> move in measured sprints to avoid
          overreach.
        </p>
        <p>
          Keep big bets aligned to your values. When{" "}
          <Chip label="Rahu" x={Rahu} /> pushes for “more”, pair it with a
          simple debrief ritual; let <Chip label="Ketu" x={Ketu} /> prune the
          unnecessary so depth (and savings) return.
        </p>
      </DarkCard>

      {/* Relationships */}
      <DarkCard title="Relationship Karma & Love Vibe">
        <p>
          Connection runs warm where <Chip label="Venus" x={Venus} /> lives—lead
          with beauty, appreciation and clear kindness. Emotions run deep yet
          private under <Chip label="Moon" x={Moon} />; protect sleep and quiet
          to keep empathy high. Agreements thrive with{" "}
          <Chip label="Saturn" x={Saturn} />—repeatable rituals, regular
          check-ins, and gentle boundaries.
        </p>
        <p>
          Date night tip: pick a low-bandwidth space (walks, cafes, cooking) when
          sparks fly—cooling the channel cools the conflict. Trade admiration
          notes; keep a tiny ritual that says “we”.
        </p>
      </DarkCard>

      {/* Learning / Travel / Philosophy */}
      <DarkCard title="Learning, Travel & Spiritual Direction">
        <p>
          Your compass expands where <Chip label="Jupiter" x={Jupiter} /> sits—
          this house frames your philosophy and long-horizon goals.{" "}
          <Chip label="Rahu" x={Rahu} /> craves novelty; aim it into high-quality study,
          travel or publishing when relevant. Across the axis,{" "}
          <Chip label="Ketu" x={Ketu} /> restores depth through subtraction
          (less scrolling, more mastery).
        </p>
        <p>
          Try 12-week learning cycles with weekly debriefs. Protect sleep—
          insight often arrives when rested. Teach what you practice; others
          benefit when you share your playbook.
        </p>
      </DarkCard>

      {/* Home / Belonging */}
      <DarkCard title="Home, Belonging & Foundations">
        <p>
          Home stabilizes the whole system. With{" "}
          <Chip label="Mercury" x={Mercury} />
          {Jupiter.house === Mercury.house || Venus.house === Mercury.house ? (
            <> (alongside Jupiter/Venus)</>
          ) : null}{" "}
          you’re at your best with tidy docs, calm spaces and simple
          checklists. If <Chip label="Jupiter" x={Jupiter} /> or{" "}
          <Chip label="Venus" x={Venus} /> touch the 4th, invest in place:
          kitchens, study nooks and comfort craft belonging and clarity.
        </p>
        <p>
          Keep a one-page “home ops” list (repairs, bills, reset day). A weekly
          20-minute review keeps roots strong and the mind freed up for work that
          matters.
        </p>
      </DarkCard>

      {/* Vitality */}
      <DarkCard title="Vitality & Daily Rhythm">
        <p>
          Energy prefers intervals. <Chip label="Mars" x={Mars} /> loves sprints
          with deliberate cool-downs; <Chip label="Saturn" x={Saturn} /> thrives
          on 2–3 non-negotiables (sleep window, movement, sunlight). Mood follows
          environment under <Chip label="Moon" x={Moon} />—declutter your rest
          space and protect quiet time.
        </p>
        <p>
          Minimal daily stack: sunlight + water + 10-minute mobility; one deep-work
          block; a short evening shutdown. Your chart favors sustainable rhythm
          over brute force—let cadence carry you.
        </p>
      </DarkCard>
    </div>
  );
}
