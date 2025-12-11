// stays server-side
export const runtime = "nodejs";

import "server-only";
import { DateTime } from "luxon";
import type { BirthInput } from "@/types";
import { computeVimshottariFromPayload } from "@/server/astro/dasha";

// --------- Vimshottari constants ----------
// Keep local lowercase dasha meta (used for Antardasha + gating)
export const DASHAS = [
  { lord: "ketu", years: 7 },
  { lord: "venus", years: 20 },
  { lord: "sun", years: 6 },
  { lord: "moon", years: 10 },
  { lord: "mars", years: 7 },
  { lord: "rahu", years: 18 },
  { lord: "jupiter", years: 16 },
  { lord: "saturn", years: 19 },
  { lord: "mercury", years: 17 },
] as const;

const LORD_INDEX: Record<string, number> = {
  ketu: 0,
  venus: 1,
  sun: 2,
  moon: 3,
  mars: 4,
  rahu: 5,
  jupiter: 6,
  saturn: 7,
  mercury: 8,
};

const LORDS = DASHAS.map((d) => d.lord);
const DAYS_PER_YEAR = 365.2425;

// --------- Types ----------

export type Mahadasha = { lord: string; start: string; end: string };
export type Antardasha = {
  mahaLord: string;
  lord: string;
  start: string;
  end: string;
};

// --------- Core MD from canonical engine ----------

export async function computeMahadashas(
  birth: BirthInput
): Promise<Mahadasha[]> {
  try {
    // Adapt BirthInput → payload shape expected by computeVimshottariFromPayload
    const payload = {
      dobISO: birth.dobISO,
      tob: birth.tob,
      place: {
        tz: birth.place.tz ?? "UTC",
      },
    };

    const { MD } = await computeVimshottariFromPayload(payload, {
      includeAD: false,
      horizonYears: 120,
    });

    if (!Array.isArray(MD)) return [];

    // Map DashaSpan[] → Mahadasha[]
    return MD.map((span) => ({
      lord: span.lord,
      start: span.start,
      end: span.end,
    }));
  } catch (err) {
    console.error("[dasha] computeMahadashas failed", err);
    return [];
  }
}

// Antardashas still computed locally from MD span (no Swiss needed)
export function computeAntardashas(maha: Mahadasha): Antardasha[] {
  const mahaLenDays = DateTime.fromISO(maha.end).diff(
    DateTime.fromISO(maha.start),
    "days"
  ).days;

  const res: Antardasha[] = [];
  const startIdx = LORD_INDEX[maha.lord];
  let cursor = DateTime.fromISO(maha.start);

  for (let i = 0; i < 9; i++) {
    const lord = LORDS[(startIdx + i) % 9];
    const years = DASHAS[LORD_INDEX[lord]].years;
    const frac = years / 120; // Vimshottari proportional sub-period
    const days = mahaLenDays * frac;
    const end = cursor.plus({ days });
    res.push({
      mahaLord: maha.lord,
      lord,
      start: cursor.toISO()!,
      end: end.toISO()!,
    });
    cursor = end;
  }

  return res;
}

export async function getDashaAt(
  dateISO: string,
  birth: BirthInput
): Promise<{ maha: Mahadasha; antara: Antardasha } | null> {
  try {
    const mahadashas = await computeMahadashas(birth);
    if (!mahadashas.length) return null;

    const t = DateTime.fromISO(dateISO);

    const maha =
      mahadashas.find(
        (d) =>
          t >= DateTime.fromISO(d.start) &&
          t < DateTime.fromISO(d.end)
      ) ?? null;

    if (!maha) return null;

    const antas = computeAntardashas(maha);
    const antara =
      antas.find(
        (d) =>
          t >= DateTime.fromISO(d.start) &&
          t < DateTime.fromISO(d.end)
      ) ?? antas[0];

    return { maha, antara };
  } catch (e) {
    console.error("[dashaGate] getDashaAt failed", e);
    return null;
  }
}

// --------- Category-aware gate 0.75..1.0 (soft only) ----------

export async function dashaGate(
  dateISO: string,
  birth?: BirthInput,
  category?: string
): Promise<number> {
  if (!birth) return 1; // no birth → neutral

  // Use midday UTC to avoid TZ boundary weirdness
  const info = await getDashaAt(dateISO + "T12:00:00.000Z", birth);
  if (!info) return 1;

  const supportive: Record<string, string[]> = {
    vehicle: ["venus", "jupiter", "mercury"],
    property: ["jupiter", "venus", "saturn"],
    job: ["saturn", "jupiter", "mercury"],
    wealth: ["jupiter", "venus", "mercury"],
    health: ["sun", "mars", "jupiter", "moon"],
    relationship: ["venus", "moon", "jupiter"],
  };
  const sup = supportive[category ?? "wealth"] ?? [];

  let factor = 0.9;
  if (sup.includes(info.maha.lord)) factor += 0.15;
  if (sup.includes(info.antara.lord)) factor += 0.1;
  if (info.maha.lord === "rahu" || info.maha.lord === "ketu") factor -= 0.05;

  // clamp into [0.75, 1] and never boost above 1
  if (factor > 1) factor = 1;
  if (factor < 0.75) factor = 0.75;
  return factor;
}
