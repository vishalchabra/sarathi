import "server-only";

type StrengthBand = "very_strong" | "strong" | "mixed" | "weak" | string;

type TransitStrengthRow = {
  planet?: string;
  dignity?: string;
  strengthBand?: StrengthBand;
};

type NatalStrengthRow = {
  planet?: string;
  strengthBand?: StrengthBand;
};

type TransitContactRow = {
  transitPlanet?: string;
  natalTarget?: string;
  natalPlanet?: string;
  type?: string;
  tone?: "supportive" | "challenging" | "mixed" | "neutral" | string;
  label?: string;
  rule?: string;
  orb?: number | null;
  applying?: boolean | null;
  houseDistance?: number | null;
};

type InteractionRow = {
  transitPlanet: string;
  natalTarget: string;
  aspectType: string;
  tone: string;
  label: string;
  rule: string;
  orb: number | null;
  transitStrengthBand: string;
  natalStrengthBand: string;
  interactionScore: number;
  interactionLabel: "supportive" | "mixed" | "pressuring";
};

function bandToScore(band?: StrengthBand): number {
  if (band === "very_strong") return 2;
  if (band === "strong") return 1;
  if (band === "mixed") return 0;
  if (band === "weak") return -1;
  return 0;
}

function toneToScore(tone?: string): number {
  if (tone === "supportive") return 1;
  if (tone === "challenging") return -1;
  if (tone === "mixed") return 0;
  return 0;
}

function getInteractionLabel(score: number): "supportive" | "mixed" | "pressuring" {
  if (score >= 2) return "supportive";
  if (score <= -1) return "pressuring";
  return "mixed";
}

export function buildTransitNatalInteractions(params: {
  transitContacts: TransitContactRow[];
  transitStrengths: TransitStrengthRow[];
  natalStrengths: NatalStrengthRow[];
}): InteractionRow[] {
  const contacts = Array.isArray(params.transitContacts) ? params.transitContacts : [];
  const transitStrengths = Array.isArray(params.transitStrengths)
    ? params.transitStrengths
    : [];
  const natalStrengths = Array.isArray(params.natalStrengths)
    ? params.natalStrengths
    : [];

  const transitStrengthMap = new Map(
    transitStrengths
      .filter((r) => typeof r?.planet === "string")
      .map((r) => [String(r.planet), r])
  );

  const natalStrengthMap = new Map(
    natalStrengths
      .filter((r) => typeof r?.planet === "string")
      .map((r) => [String(r.planet), r])
  );

  const rows: InteractionRow[] = [];

  for (const c of contacts) {
    const transitPlanet = String(c?.transitPlanet ?? "").trim();
    const natalTarget = String(c?.natalTarget ?? c?.natalPlanet ?? "").trim();

    if (!transitPlanet || !natalTarget) continue;

    const transitStrength = transitStrengthMap.get(transitPlanet);
    const natalStrength = natalStrengthMap.get(natalTarget);

    const transitBand = String(transitStrength?.strengthBand ?? "mixed");
    const natalBand = String(natalStrength?.strengthBand ?? "mixed");

    const transitScore = bandToScore(transitBand);
    const natalScore = bandToScore(natalBand);
    const toneScore = toneToScore(c?.tone);

    const effectiveTransitScore =
  c?.tone === "challenging"
    ? -Math.abs(transitScore)
    : transitScore;

const interactionScore = effectiveTransitScore + natalScore + toneScore;

    rows.push({
      transitPlanet,
      natalTarget,
      aspectType: String(c?.type ?? "—"),
      tone: String(c?.tone ?? "neutral"),
      label: String(c?.label ?? `${natalTarget} influenced by ${transitPlanet}`),
      rule: String(c?.rule ?? "Vedic transit hit"),
      orb: typeof c?.orb === "number" ? c.orb : null,
      transitStrengthBand: transitBand,
      natalStrengthBand: natalBand,
      interactionScore,
      interactionLabel: getInteractionLabel(interactionScore),
    });
  }

  return rows.sort((a, b) => {
    if (a.interactionScore !== b.interactionScore) {
      return b.interactionScore - a.interactionScore;
    }

    const aOrb = typeof a.orb === "number" ? a.orb : 999;
    const bOrb = typeof b.orb === "number" ? b.orb : 999;

    if (aOrb !== bOrb) return aOrb - bOrb;

    if (a.transitPlanet !== b.transitPlanet) {
      return a.transitPlanet.localeCompare(b.transitPlanet);
    }

    return a.natalTarget.localeCompare(b.natalTarget);
  });
}