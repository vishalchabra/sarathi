// FILE: src/server/astro/life-milestones.ts

// These rows come from vimshottariMDTable
export type MdRow = {
  planet: string;      // "Venus", "Sun", ...
  startISO: string;    // "1984-01-21"
  endISO: string;      // "1990-03-11"
};

// This matches the shape used in your _shell.tsx (TabTimeline)
export type LifeMilestone = {
  label: string;
  approxAgeRange: string;
  periodStart: string;
  periodEnd: string;
  drivers: string;
  themes: string[];
  risk?: "caution" | "opportunity" | "mixed";
};

/* ----------------- helpers ----------------- */

function safeDate(iso: string): Date | null {
  if (!iso) return null;
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

function yearsBetween(fromISO: string, birthISO: string): number | null {
  const from = safeDate(fromISO);
  const birth = safeDate(birthISO);
  if (!from || !birth) return null;
  const ms = from.getTime() - birth.getTime();
  const years = ms / (1000 * 60 * 60 * 24 * 365.25);
  return years;
}

function approxAgeRange(startISO: string, endISO: string, birthISO: string): string {
  const a1 = yearsBetween(startISO, birthISO);
  const a2 = yearsBetween(endISO, birthISO);
  if (a1 == null || a2 == null) return "—";
  const startY = Math.max(0, Math.round(a1));
  const endY = Math.max(startY, Math.round(a2));
  if (startY === endY) return `${startY} years`;
  return `${startY}–${endY} years`;
}

function planetProfile(planet: string): {
  drivers: string;
  themes: string[];
  risk: "caution" | "opportunity" | "mixed";
} {
  const p = planet.toLowerCase();

  switch (p) {
    case "venus":
      return {
        drivers: "Relationships, comfort, creativity and material harmony.",
        risk: "opportunity",
        themes: [
          "Focus on relationships, love, and social connections.",
          "Good period to beautify life: home, wardrobe, creative projects.",
          "Financial opportunities via partnerships, luxury, or aesthetics.",
          "Watch for over-indulgence or laziness in comfort zones."
        ],
      };
    case "sun":
      return {
        drivers: "Identity, recognition, leadership and personal will.",
        risk: "mixed",
        themes: [
          "Time to step into visibility and own your leadership.",
          "Career and authority themes become louder and clearer.",
          "Father/mentors and authority figures play a strong role.",
          "Watch ego clashes or rigid pride that blocks cooperation."
        ],
      };
    case "moon":
      return {
        drivers: "Emotions, mind, home and nourishment.",
        risk: "mixed",
        themes: [
          "Emotional life and family matters come to the foreground.",
          "Good period for healing, self-care and nurturing bonds.",
          "Intuition is high – decisions are guided by gut feel.",
          "Mood swings or over-sensitivity can disturb peace if unmanaged."
        ],
      };
    case "mars":
      return {
        drivers: "Action, courage, conflict and discipline.",
        risk: "caution",
        themes: [
          "High energy for bold moves, competitive growth and action.",
          "Great phase to start projects that require drive and willpower.",
          "Physical fitness, sports, and assertiveness get highlighted.",
          "Impulsiveness, anger or conflicts can rise if energy is mis-channeled."
        ],
      };
    case "rahu":
      return {
        drivers: "Ambition, unconventional paths, obsession and breakthroughs.",
        risk: "mixed",
        themes: [
          "Life pushes towards new, unusual or foreign experiences.",
          "Strong desire for success, status and rapid growth.",
          "Good for technology, innovation, unconventional careers.",
          "Need to watch illusions, shortcuts, and obsession with results."
        ],
      };
    case "jupiter":
      return {
        drivers: "Wisdom, growth, faith and higher learning.",
        risk: "opportunity",
        themes: [
          "A broadening phase for wisdom, teaching, or higher education.",
          "Support for marriage, children, and meaningful responsibilities.",
          "Spirituality, ethics, and guidance become stronger themes.",
          "Over-optimism or over-expansion can create scattered efforts."
        ],
      };
    case "saturn":
      return {
        drivers: "Discipline, karma, responsibility and long-term building.",
        risk: "caution",
        themes: [
          "Life tests structures: career, duties, long-term commitments.",
          "Excellent for building solid foundations with patience.",
          "Hard work and persistence bring durable rewards.",
          "Delays, pressure and fatigue push you to mature and simplify."
        ],
      };
    case "mercury":
      return {
        drivers: "Intellect, communication, trade and adaptability.",
        risk: "opportunity",
        themes: [
          "Focus on learning, networking, communication and skills.",
          "Good for business, writing, marketing, and study.",
          "Mind stays curious and agile; ideas come quickly.",
          "Over-thinking, anxiety or scattered focus are the main risks."
        ],
      };
    case "ketu":
      return {
        drivers: "Detachment, spirituality, completion and inner work.",
        risk: "mixed",
        themes: [
          "Old cycles complete; people or patterns may leave your life.",
          "Inner search, spirituality and subtler insights deepen.",
          "Great time to release attachments and refine priorities.",
          "Can feel confusing or isolating if you resist inner work."
        ],
      };
    default:
      return {
        drivers: "Life lessons around this Mahadasha lord.",
        risk: "mixed",
        themes: [
          "A karmic shift in priorities and focus areas.",
          "Events revolve around the nature of the Mahadasha planet.",
          "Relationships, career and inner growth all adapt to this new tone.",
        ],
      };
  }
}

/* ----------------- main builder ----------------- */

/**
 * Turn Vimshottari Mahadasha rows into story-style milestones
 * that Tab 3 can display as “Life story by Dasha”.
 */
export function buildLifeMilestonesFromMD(
  mdRows: MdRow[],
  birthDateISO: string
): LifeMilestone[] {
  if (!Array.isArray(mdRows) || mdRows.length === 0) return [];

  return mdRows.map((row) => {
    const planet = row.planet || "";
    const { drivers, themes, risk } = planetProfile(planet);

    const approx = approxAgeRange(row.startISO, row.endISO, birthDateISO);

    const label = `${planet} Mahadasha`;

    return {
      label,
      approxAgeRange: approx,
      periodStart: row.startISO,
      periodEnd: row.endISO,
      drivers,
      themes,
      risk,
    };
  });
}
