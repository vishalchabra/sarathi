type Yoga = {
  name: string;
  involvedPlanets?: string[];
  evidence?: any;
};
function formatShortDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}
export function buildYogaActivation(params: {
  yogas: Yoga[];
  dasha: any;
  transitPlanets: any[];
  degreeHits: any[];
  degreeHitWindows?: any[];
}) {
  const {
  yogas,
  dasha,
  transitPlanets,
  degreeHits,
  degreeHitWindows = [],
} = params;

  const dashaPlanets = [
    dasha?.md?.planet ?? dasha?.md,
    dasha?.ad?.planet ?? dasha?.ad,
    dasha?.pd?.planet ?? dasha?.pd,
  ]
    .filter(Boolean)
    .map(String);

  return yogas.map((yoga) => {
    const involved = yoga.involvedPlanets ?? [];

    // 1. Dasha activation
    const dashaHit = involved.find((p) => dashaPlanets.includes(p));

    // 2. Transit activation (Jupiter, Saturn, Rahu, Ketu)
    const transitHit = transitPlanets.find((tp: any) => {
      if (!["Jupiter", "Saturn", "Rahu", "Ketu"].includes(tp.planet)) return false;
      return involved.includes(tp.planet);
    });

    // 3. Degree hit activation
    const degreeHit = degreeHits.find((hit: any) =>
  involved.includes(hit?.natalPlanet)
);

let peakDate: string | null = null;

if (degreeHit?.date) {
  peakDate = new Date(degreeHit.date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}
    const upcomingHit = degreeHits.find((hit: any) =>
  involved.includes(hit?.natalPlanet)
);
const windowHit = degreeHitWindows.find((w: any) =>
  involved.includes(w.natalPlanet)
);
    const strength =
  (dashaHit ? 2 : 0) +
  (transitHit ? 1 : 0) +
  (degreeHit ? 2 : 0);

let activationLevel = "Mild";

if (strength >= 4) activationLevel = "Strong";
else if (strength >= 2) activationLevel = "Moderate";
    const reasons: string[] = [];

    if (dashaHit) {
      reasons.push(`Dasha: ${dashaHit} active`);
    }

   if (transitHit) {
  reasons.push(
    `Transit: ${transitHit.planet} interacting with ${involved
  .filter((p) => p !== transitHit.planet)
  .join(", ")}`
  );
}

if (degreeHit) {
  reasons.push(
    `Degree hit now: ${degreeHit.transitPlanet ?? "Transit"} → ${degreeHit.natalPlanet} (${Math.round(degreeHit.strength ?? 0)} strength)`
  );
}
if (windowHit) {
  const start = formatShortDate(windowHit.windowStart);
  const end = formatShortDate(windowHit.windowEnd);
  const peak = formatShortDate(windowHit.peakDate);

  if (start === end) {
    reasons.push(`Trigger date: ${start}`);
  } else {
    reasons.push(`Next window: ${start} – ${end}`);
  }

  reasons.push(`Peak: ${peak}`);
}
    const dateStr = upcomingHit?.date
  ? new Date(upcomingHit.date).toLocaleDateString()
  : null;

if (dateStr) {
  reasons.push(`Peak around ${dateStr}`);
}
console.log("DEGREE HITS", degreeHits);
    return {
      ...yoga,
      isActive: reasons.length > 0,
      activation: reasons,
      activationLevel,
    };
  });
}