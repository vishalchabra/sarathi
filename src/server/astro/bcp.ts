// src/server/astro/bcp.ts
import { DateTime } from "luxon";
import type { BirthInput } from "@/types";
import { ascAndHouseLords } from "@/server/astro/core";
import { houseSign } from "@/server/astro/asc";
import { SIGN_RULER } from "@/server/core/houselords";
import { PLANET_NAMES } from "./nakshatra";

const HOUSE_NAMES = [
  "", // 0
  "1st • Self / Vitality",
  "2nd • Wealth / Family / Speech",
  "3rd • Effort / Skills / Siblings",
  "4th • Home / Mother / Comforts",
  "5th • Creativity / Children / Intellect",
  "6th • Service / Health / Competition",
  "7th • Partnership / Public",
  "8th • Transformation / Secrets / Longevity",
  "9th • Dharma / Teachers / Fortune",
  "10th • Career / Status / Duty",
  "11th • Gains / Network / Aspirations",
  "12th • Release / Foreign / Sleep",
];

const HOUSE_THEMES: Record<number, string> = {
  1: "Identity, direction, vitality",
  2: "Resources, values, family support",
  3: "Courage, practice, communication",
  4: "Roots, real estate, emotional base",
  5: "Creation, study, joy, children",
  6: "Service, routines, debt, recovery",
  7: "Marriage, contracts, audience",
  8: "Karmic dues, research, deep change",
  9: "Purpose, teachers, long journeys",
  10: "Work, authority, leadership",
  11: "Allies, results, goals coming true",
  12: "Letting go, solitude, distant places",
};

export type BCPItem = {
  age: number;
  from: string;
  to: string;
  house: number;
  houseName: string;
  theme: string;
  why: string[];
};

export function buildBhriguPulses(birth: BirthInput, years = 7) {
  const born = DateTime.fromISO(`${birth.dobISO}T${birth.tob}`, { zone: birth.place.tz });
  const now = DateTime.now().setZone(birth.place.tz);
  const age = Math.max(0, Math.floor(now.diff(born, "years").years));

  const basics = ascAndHouseLords(birth);
  const ascSign = basics?.asc?.ascSign ?? 0;

  const items: BCPItem[] = [];
  for (let i = 0; i < years; i++) {
    const A = age + i;
    const start = born.plus({ years: A });
    const end = start.plus({ years: 1 });

    // classic BCP: one age → one house
    const house = ((A % 12) + 1); // 1..12
    const hs = houseSign(ascSign, house);
    const lord = SIGN_RULER[hs];
    const lordName = PLANET_NAMES[lord] || `#${lord}`;

    items.push({
      age: A,
      from: start.toISODate()!,
      to: end.minus({ days: 1 }).toISODate()!,
      house,
      houseName: HOUSE_NAMES[house],
      theme: HOUSE_THEMES[house],
      why: [
        `Age ${A} activates ${house}H (${HOUSE_THEMES[house]}).`,
        `Watch its lord: ${lordName}. Planets in ${house}H or strong aspects will time events.`,
      ],
    });
  }

  return {
    currentAge: age,
    tz: birth.place.tz,
    items,
  };
}

// Backward-compat export so old imports keep working:
export const bhriguChakra = buildBhriguPulses;
