// FILE: src/app/api/forecast/route.ts
import { NextResponse } from "next/server";

type Slice = "today" | "tomorrow" | "weekly" | "monthly";
type Item = { bucket: "Wealth" | "Health" | "Family" | "Job"; text: string };

function fmtRange(from: Date, to?: Date) {
  const f = from.toLocaleDateString();
  if (!to) return f;
  const t = to.toLocaleDateString();
  return `${f} — ${t}`;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function clampToMonth(d: Date, day: number) {
  const x = new Date(d.getFullYear(), d.getMonth(), day);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  x.setDate(Math.min(day, last));
  return x;
}
function dayName(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

/**
 * Build compact, specific guidance strings with small, dated hooks.
 * Frontend will still split into 2 bullets (we keep max 2 sentences).
 */
function todayItems(today: Date): Item[] {
  // deterministic AM/PM nudge just to feel contextual
  const amFirst = today.getDay() % 2 === 0;

  return [
    {
      bucket: "Job",
      text: amFirst
        ? `${dayName(today)}: 1 deep-work block before noon; ship one visible change. Action: post a 3-bullet impact note by 5pm.`
        : `${dayName(today)}: hold meetings early; build after 3pm. Action: close one loop and confirm next step in writing.`,
    },
    {
      bucket: "Wealth",
      text: `Small, capped-downside move only. Window: ${today.toLocaleDateString()}. Action: review costs; cut one recurring expense today.`,
    },
    {
      bucket: "Health",
      text: `Keep rhythm > intensity. Action: lock 20-min walk + 2L water; lights-out +30 min earlier tonight.`,
    },
    {
      bucket: "Family",
      text: `Short proactive check-in beats reactive fixes. Action: schedule a 10-min call or plan a shared mini-ritual for tonight.`,
    },
  ];
}

function tomorrowItems(today: Date): Item[] {
  const t = addDays(today, 1);
  return [
    {
      bucket: "Job",
      text: `${dayName(t)}: pick one task that moves the needle; avoid context switches. Action: book a 90-min focus slot.`,
    },
    {
      bucket: "Wealth",
      text: `Prep, don’t chase. Action: list 2 opportunities to explore ${t.toLocaleDateString()}–${fmtRange(addDays(t, 1))}.`,
    },
    {
      bucket: "Health",
      text: `Low-friction routine only. Action: 10k steps or 20-min mobility; protein with each meal.`,
    },
    {
      bucket: "Family",
      text: `Name one appreciation out loud. Action: send a message before noon; keep it specific.`,
    },
  ];
}

function weeklyItems(today: Date): Item[] {
  const early = { from: today, to: addDays(today, 2) }; // Sun–Tue style
  const late = { from: addDays(today, 3), to: addDays(today, 6) }; // Wed–Sat style

  return [
    {
      bucket: "Job",
      text: `Push projects ${dayName(early.from)}–${dayName(early.to)}; keep ${dayName(late.from)}–${dayName(late.to)} for reviews. Action: one demo or status note by ${late.to.toLocaleDateString()}.`,
    },
    {
      bucket: "Wealth",
      text: `Scanning > committing early week; act late week if risk is limited. Action: set a stop-loss and size small.`,
    },
    {
      bucket: "Health",
      text: `Two anchors only: sleep and steps. Action: fix wake time all week; hit 60–70k steps total by ${late.to.toLocaleDateString()}.`,
    },
    {
      bucket: "Family",
      text: `Plan the touchpoints now. Action: lock a shared meal ${dayName(late.from)} or ${dayName(late.to)}; no phones for 30 min.`,
    },
  ];
}

function monthlyItems(today: Date): Item[] {
  const mStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const mid1a = clampToMonth(today, 6);
  const mid1b = clampToMonth(today, 10);
  const mid2a = clampToMonth(today, 16);
  const mid2b = clampToMonth(today, 20);
  const lateA = clampToMonth(today, 26);
  const mEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return [
    {
      bucket: "Job",
      text: `Build ${mid1a.toLocaleDateString()}–${mid1b.toLocaleDateString()}, showcase ${mid2a.toLocaleDateString()}–${mid2b.toLocaleDateString()}. Action: schedule end-month demo by ${mEnd.toLocaleDateString()}.`,
    },
    {
      bucket: "Wealth",
      text: `Review ${mStart.toLocaleDateString()}–${mid1a.toLocaleDateString()}, deploy cautiously ${lateA.toLocaleDateString()}–${mEnd.toLocaleDateString()}. Action: one deliberate allocation; avoid impulse trades.`,
    },
    {
      bucket: "Health",
      text: `Month theme: consistency. Action: 12 workouts or 250k steps before ${mEnd.toLocaleDateString()}.`,
    },
    {
      bucket: "Family",
      text: `Put anchors on the calendar now. Action: one day-out or dinner in the window ${mid2a.toLocaleDateString()}–${mid2b.toLocaleDateString()}.`,
    },
  ];
}

export async function POST(req: Request) {
  try {
    const { slice = "today" } = await req.json();
    const today = new Date();
    const weekEnd = addDays(today, 6);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    let rangeLabel = "";
    switch (slice as Slice) {
      case "today": rangeLabel = fmtRange(today); break;
      case "tomorrow": rangeLabel = fmtRange(addDays(today, 1)); break;
      case "weekly": rangeLabel = fmtRange(today, weekEnd); break;
      case "monthly": rangeLabel = fmtRange(monthStart, monthEnd); break;
      default: rangeLabel = fmtRange(today);
    }

    let items: Item[];
    if (slice === "today") items = todayItems(today);
    else if (slice === "tomorrow") items = tomorrowItems(today);
    else if (slice === "weekly") items = weeklyItems(today);
    else items = monthlyItems(today);

    return NextResponse.json({ rangeLabel, items });
  } catch (e: any) {
    return new NextResponse(e?.message || "forecast failed", { status: 500 });
  }
}
