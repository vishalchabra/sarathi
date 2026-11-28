import "server-only";

// Shared deterministic Dasha and transit interpretation engine.
// Used by the Life Report and Dasha Transit API.

export type TransitWindow = {
  title?: string;
  startISO?: string;
  endISO?: string;
  planet?: string;
  target?: string;
  category?: string;
  strength?: number;
};

export type MdAdInfo = {
  md?: { planet?: string; start?: string | null; end?: string | null };
  ad?: { planet?: string; start?: string | null; end?: string | null };
};

export type ReqBody = {
  profile?: {
    name?: string;
    birthDateISO?: string;
    birthTime?: string;
    birthTz?: string;
  };
  mdad?: MdAdInfo | null;
  transits?: TransitWindow[];
};

function safeStr(v: any) {
  return String(v ?? "").replace(/\s+/g, " ").trim();
}

function fmtWindow(t: TransitWindow) {
  const label =
    safeStr(t.title) ||
    safeStr(`${t.planet ?? "Planet"} → ${t.target ?? ""}`) ||
    "Transit window";

  const when =
    safeStr(t.startISO) && safeStr(t.endISO)
      ? `${safeStr(t.startISO)} → ${safeStr(t.endISO)}`
      : safeStr(t.startISO) || safeStr(t.endISO) || "Timing: soon";

  const category = safeStr(t.category);
  const strength =
    typeof t.strength === "number" && isFinite(t.strength)
      ? Math.max(0, Math.min(1, t.strength))
      : undefined;

  return {
    label,
    when,
    category: category || undefined,
    strength,
  };
}

export function buildStructuredDashaTransits(
  profile: ReqBody["profile"],
  mdad: MdAdInfo | null,
  transits: TransitWindow[]
) {
  const name = safeStr(profile?.name) || "you";

  const md = safeStr(mdad?.md?.planet);
  const ad = safeStr(mdad?.ad?.planet);

  const dashaLine =
    md && ad
      ? `Current cycle: ${md} MD + ${ad} AD`
      : md
      ? `Current cycle: ${md} MD`
      : "Current cycle: steady consolidation + cleaner choices";

  // Sort “best” windows first if strength exists; otherwise keep order
  const windows = (Array.isArray(transits) ? transits : [])
    .map(fmtWindow)
    .sort((a, b) => (b.strength ?? -1) - (a.strength ?? -1))
    .slice(0, 6);

  // Compact “patterns” (these are still fallback, but crisp)
  const patterns = [
    {
      title: "Career & direction",
      text:
        "Use stronger windows for one meaningful push (project, negotiation, responsibility). Avoid random risks.",
    },
    {
      title: "Relationships & support",
      text:
        "Choose clarity over reaction. If friction shows up, slow down and tighten communication.",
    },
    {
      title: "Inner stability",
      text:
        "When you feel rushed or edgy, simplify. One priority. One grounded action.",
    },
  ];

  const nextStep =
    windows.length > 0
      ? "Pick ONE upcoming window and decide in advance how you’ll use it (push / clarify / reset)."
      : "Pick ONE area to simplify this week (work, health, relationships) and apply steady effort.";

  return {
    headline: `Past • Present • Upcoming — ${name}`,
    dashaLine,
    windows,
    patterns,
    nextStep,
    source: "fallback_rules", // important: tells UI this is not GPT
  };
}
