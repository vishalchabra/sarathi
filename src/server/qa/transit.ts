// Transit windows with nakshatra-aware scoring for realistic, job-focused boosts.

export type ADSpan = {
  fromISO: string;
  toISO: string;
  label: string; // e.g. "Rahu MD / Ketu AD"
  md?: string;
  ad?: string;
};

export type TransitSample = {
  dateISO: string;
  Jup?: { deg: number; retro?: boolean };
  Sat?: { deg: number; retro?: boolean };
  Ven?: { deg: number; retro?: boolean };
  Mer?: { deg: number; retro?: boolean };
  Sun?: { deg: number; retro?: boolean };
  Moon?: { deg: number; retro?: boolean };
  Rahu?: { deg: number; retro?: boolean };
  Ketu?: { deg: number; retro?: boolean };
  // optional (preferred): provider-supplied nakshatra per planet
  nakshatras?: Record<string, { name: string; pada: 1 | 2 | 3 | 4 }>;
};

export type TransitWindow = {
  fromISO: string;
  toISO: string;
  label: string;
  why?: string[];
  score?: number;
};

type BuildArgs = {
  adSpans: ADSpan[];
  natal: {
    lagnaDeg?: number;
    moonDeg?: number;
    mc10Deg?: number;
    lord10Deg?: number;
    d10?: { lagnaDeg?: number; lordDeg?: number };
  };
  getTransitsDaily: (fromISO: string, toISO: string) => Promise<TransitSample[]>;
};

// ---------- utils ----------
const DAY = 86400000;
const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => new Date(+d + n * DAY);
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

function angleDiff(a: number, b: number) {
  let d = Math.abs(((a - b) % 360) + 360) % 360;
  if (d > 180) d = 360 - d;
  return d;
}
function inOrb(a: number, b: number, orb: number) {
  return angleDiff(a, b) <= orb;
}

// 27 nakshatras, 13°20' each
const N_NAMES = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha",
  "Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
  "Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati",
] as const;

function nakFromDeg(deg: number): { name: typeof N_NAMES[number]; pada: 1|2|3|4 } {
  const slot = ((deg % 360) + 360) % 360;
  const span = 360 / 27;
  const idx = Math.floor(slot / span);
  const within = slot - idx * span;
  const pada = (Math.floor(within / (span / 4)) + 1) as 1|2|3|4;
  return { name: N_NAMES[idx], pada };
}

// Job-friendly nakshatras (visibility, structure, networks, output)
const JOB_NAKS = new Set([
  "Rohini","Pushya","Uttara Phalguni","Chitra","Anuradha",
  "Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Uttara Bhadrapada",
]);

function scoreDay(t: TransitSample, natal: BuildArgs["natal"]) {
  let score = 0;
  const why: string[] = [];

  const mc = natal.mc10Deg ?? natal.lord10Deg;
  const j = t.Jup?.deg;
  const v = t.Ven?.deg;
  const m = t.Mer?.deg;
  const moon = t.Moon?.deg;
  const sat = t.Sat;

  // Jupiter to MC/10th-lord
  if (mc != null && j != null) {
    if (inOrb(j, mc + 120, 5) || inOrb(j, mc - 120, 5)) { score += 2;   why.push("Jupiter trine career point"); }
    else if (inOrb(j, mc + 60, 4) || inOrb(j, mc - 60, 4)) { score += 1; why.push("Jupiter sextile career point"); }
  }

  // Venus supportive
  if (mc != null && v != null) {
    if (inOrb(v, mc + 120, 4) || inOrb(v, mc - 120, 4)) { score += 1;    why.push("Venus trine career point"); }
    else if (inOrb(v, mc + 60, 3) || inOrb(v, mc - 60, 3)) { score += 0.5; why.push("Venus sextile career point"); }
  }

  // Mercury communications
  if (mc != null && m != null) {
    if (inOrb(m, mc + 60, 3) || inOrb(m, mc - 60, 3)) { score += 0.75; why.push("Mercury sextile career point"); }
    if (!t.Mer?.retro) score += 0.25;
  }

  // Moon nakshatra
  if (moon != null) {
    const nk = t.nakshatras?.Moon?.name ?? nakFromDeg(moon).name;
    if (JOB_NAKS.has(nk)) { score += 0.75; why.push(`Moon in ${nk}`); }
  }

  // Saturn steady
  if (sat && !sat.retro) score += 0.25;

  return { score: clamp(score, 0, 4), why };
}

function windowsFromDaily(
  daily: TransitSample[],
  labelPrefix = "Transit boost",
  minDays = 21,
  maxDays = 56,
  natal: BuildArgs["natal"]
) {
  const THRESH = 1.75;
  const out: TransitWindow[] = [];
  let runStart = -1;
  let aggScore = 0;
  let reasons: string[] = [];

  const pushRun = (startIdx: number, endIdx: number) => {
    if (startIdx < 0 || endIdx < startIdx) return;
    const start = daily[startIdx].dateISO;
    const end   = daily[endIdx].dateISO;
    const days = Math.round((+new Date(end) - +new Date(start)) / DAY) + 1;
    if (days < minDays) return;
    const cappedEndIdx = Math.min(endIdx, startIdx + maxDays - 1);
    const cappedEnd = daily[cappedEndIdx].dateISO;
    out.push({
      fromISO: start,
      toISO: cappedEnd,
      label: `${labelPrefix} (${new Date(start).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})} → ${new Date(cappedEnd).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})})`,
      why: Array.from(new Set(reasons)).slice(0, 4),
      score: +(aggScore / Math.max(1, cappedEndIdx - startIdx + 1)).toFixed(2),
    });
  };

  daily.forEach((d, i) => {
    const { score, why } = scoreDay(d, natal);
    if (score >= THRESH) {
      if (runStart === -1) { runStart = i; reasons = []; aggScore = 0; }
      aggScore += score;
      reasons.push(...why);
    } else {
      if (runStart !== -1) pushRun(runStart, i - 1);
      runStart = -1; aggScore = 0; reasons = [];
    }
  });
  if (runStart !== -1) pushRun(runStart, daily.length - 1);

  return out;
}

// ---------- public ----------
export async function buildTransitWindows({ adSpans, natal, getTransitsDaily }: BuildArgs) {
  const windows: TransitWindow[] = [];

  for (const ad of adSpans) {
    let daily = [] as TransitSample[];
    try {
      daily = await getTransitsDaily(ad.fromISO, ad.toISO);
    } catch { daily = []; }

    if (daily.length) {
      // keep 1-day cadence (fill gaps if provider is sparse)
      const map = new Map(daily.map(d => [d.dateISO, d]));
      const seq: TransitSample[] = [];
      const start = new Date(ad.fromISO);
      const end = new Date(ad.toISO);
      for (let dt = new Date(start); dt <= end; dt = addDays(dt, 1)) {
        const k = iso(dt);
        seq.push(map.get(k) ?? { dateISO: k });
      }
      daily = seq;
    }

    const win = windowsFromDaily(daily, "Transit boost (3–8 weeks)", 21, 56, natal);
    windows.push(...win);
  }

  const today = new Date().toISOString().slice(0, 10);
  return windows
    .filter(w => w.toISO >= today)
    .sort((a, b) => a.fromISO.localeCompare(b.fromISO))
    .slice(0, 9);
}
