// FILE: /src/lib/astro/canonical.ts
// Single source of truth for Swiss indices, nodes, signs, dignities & helpers.

export const SIGNS_FULL = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];
export const SIGNS_ABBR = ["Ar","Ta","Ge","Cn","Le","Vi","Li","Sc","Sg","Cp","Aq","Pi"];

// Lords by sign index (sidereal – Jyotish)
export const SIGN_LORD: Record<number, string> = {
  0:"Mars", 1:"Venus", 2:"Mercury", 3:"Moon", 4:"Sun", 5:"Mercury",
  6:"Venus", 7:"Mars", 8:"Jupiter", 9:"Saturn", 10:"Saturn", 11:"Jupiter",
};

// Exaltations (sign index) – common Jyotish set
export const EXALT: Record<string, number> = {
  Sun:0, Moon:1, Mars:9, Mercury:5, Jupiter:3, Venus:11, Saturn:6, Rahu:1, Ketu:7,
};
export const DEBIL: Record<string, number> =
  Object.fromEntries(Object.entries(EXALT).map(([k, v]) => [k, (v + 6) % 12]));

// Natural friendships (tuned so Mars↔Venus enemies per your expectation)
export const NATURAL_REL: Record<string, {friends: string[]; enemies: string[]; neutral: string[]}> = {
  Sun:    { friends:["Moon","Mars","Jupiter"], enemies:["Venus","Saturn"],           neutral:["Mercury"] },
  Moon:   { friends:["Sun","Mercury"],         enemies:[],                           neutral:["Mars","Jupiter","Venus","Saturn"] },
  Mars:   { friends:["Sun","Moon","Jupiter"],  enemies:["Mercury","Venus"],          neutral:["Saturn"] },
  Mercury:{ friends:["Sun","Venus"],           enemies:["Moon"],                      neutral:["Mars","Jupiter","Saturn"] },
  Jupiter:{ friends:["Sun","Moon","Mars"],     enemies:["Venus","Mercury"],          neutral:["Saturn"] },
  Venus:  { friends:["Mercury","Saturn"],      enemies:["Sun","Moon","Mars"],        neutral:["Jupiter"] },
  Saturn: { friends:["Mercury","Venus"],       enemies:["Sun","Moon"],               neutral:["Mars","Jupiter"] },
  Rahu:   { friends:["Venus","Saturn","Mercury"], enemies:["Sun","Moon","Mars"],    neutral:["Jupiter"] },
  Ketu:   { friends:["Mars","Jupiter","Venus"],   enemies:["Sun","Moon","Mercury"], neutral:["Saturn"] },
};

// ---------- math helpers ----------
export const wrap360 = (x: number) => {
  x %= 360;
  return x < 0 ? x + 360 : x;
};
export const norm360 = (x: number) => ((x % 360) + 360) % 360;
export const sIdx = (deg: number) => Math.floor(norm360(deg) / 30);
export const degMin = (deg: number) => {
  const d = norm360(deg) % 30;
  const D = Math.floor(d);
  const M = Math.round((d - D) * 60);
  return `${D}°${String(M).padStart(2, "0")}′`;
};

// ---------- planet picking ----------
function pickNumber(planets: Record<string, any>, candidates: (string | number)[]) {
  for (const c of candidates) {
    if (c in planets && typeof planets[c as any] === "number" && Number.isFinite(planets[c as any])) {
      return planets[c as any] as number;
    }
    const s = String(c).toLowerCase();
    const hit = Object.keys(planets).find(k => k.toLowerCase() === s);
    if (hit && typeof planets[hit] === "number" && Number.isFinite(planets[hit])) {
      return planets[hit] as number;
    }
  }
  return undefined;
}

/**
 * canonicalPlanets – normalize Swiss ephemeris indices into named longitudes (deg)
 * Swiss indices: 0 Sun, 1 Moon, 2 Mercury, 3 Venus, 4 Mars, 5 Jupiter, 6 Saturn, 10 Mean Node, 11 True Node
 * Nodes: prefer True(11) then Mean(10); compute Ketu = Rahu + 180 if one missing; enforce exact opposition if both present.
 */
export function canonicalPlanets(src: Record<string, any>) {
  const out: Record<string, number | undefined> = {};

  out.Sun     = pickNumber(src, [0, "0", "sun", "Sun"]);
  out.Moon    = pickNumber(src, [1, "1", "moon", "Moon"]);
  out.Mercury = pickNumber(src, [2, "2", "mercury", "Mercury", "merc", "Merc"]);
  out.Venus   = pickNumber(src, [3, "3", "venus", "Venus", "ven", "Ven"]);
  out.Mars    = pickNumber(src, [4, "4", "mars", "Mars"]);
  out.Jupiter = pickNumber(src, [5, "5", "jupiter", "Jupiter", "jup", "Jup"]);
  out.Saturn  = pickNumber(src, [6, "6", "saturn", "Saturn", "sat", "Sat"]);

  // Nodes
  let rahu = pickNumber(src, ["rahu","Rahu","north node","North Node","true node","True Node","mean node","Mean Node", 11, "11", 10, "10"]);
  let ketu = pickNumber(src, ["ketu","Ketu","south node","South Node"]);
  if (typeof rahu === "number" && typeof ketu !== "number") ketu = norm360(rahu + 180);
  if (typeof ketu === "number" && typeof rahu !== "number") rahu = norm360(ketu + 180);
  if (typeof rahu === "number" && typeof ketu === "number") {
    const diff = Math.abs(((rahu - ketu + 540) % 360) - 180);
    if (diff > 2) ketu = norm360(rahu + 180);
  }
  out.Rahu = rahu;
  out.Ketu = ketu;

  return out;
}

// ---------- dignity ----------
export function dignityLabel(planet: string, signIdx: number) {
  if (EXALT[planet] === signIdx) return "Exalted";
  if (SIGN_LORD[signIdx] === planet) return "Own sign";
  if (DEBIL[planet] === signIdx) return "Debilitated";
  const lord = SIGN_LORD[signIdx];
  const rel = NATURAL_REL[planet];
  if (rel?.friends.includes(lord)) return "Friend sign";
  if (rel?.enemies.includes(lord)) return "Enemy sign";
  return "Neutral";
}
