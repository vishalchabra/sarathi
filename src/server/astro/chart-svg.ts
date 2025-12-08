import "server-only";

/** Lightweight SVG wheel renderer + D9/D10 mappers (server-only module) */

// Zodiac names (first letter used on rim)
const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];

// Swiss-like ids → glyph (for display only)
const PLANET_GLYPH: Record<string, string> = {
  "0": "☉",  // Sun
  "1": "☽",  // Moon
  "2": "☿",  // Mercury
  "3": "♀",  // Venus
  "4": "♂",  // Mars
  "5": "♃",  // Jupiter
  "6": "♄",  // Saturn
  "10": "☊", // Rahu
  "-1": "☋", // Ketu
};

export function norm360(x: number) {
  let v = x % 360;
  return v < 0 ? v + 360 : v;
}
function signOfDeg(lon: number) {
  return Math.floor(norm360(lon) / 30); // 0..11
}
function relAngleFromAsc(lon: number, ascLon: number) {
  // 0° at ASC, counterclockwise; rotate -90° for SVG
  const rel = norm360(lon - ascLon);
  return (rel - 90) * (Math.PI / 180);
}

// Vargas rules
const MOV = new Set([0,3,6,9]);    // cardinal
const FIX = new Set([1,4,7,10]);   // fixed
// dual = rest

/** D9: Navāṁśa longitude (0..360) */
export function navamsaLon(lon: number) {
  const sIdx = signOfDeg(lon);
  const inSign = norm360(lon) % 30;
  const pada = Math.floor(inSign / (30 / 9));       // 0..8
  let start: number;
  if (MOV.has(sIdx))      start = sIdx;
  else if (FIX.has(sIdx)) start = (sIdx + 8) % 12;  // 9th
  else                    start = (sIdx + 4) % 12;  // 5th
  const d9Sign = (start + pada) % 12;
  const span = 30 / 9;                               // 3°20'
  const inside = inSign - pada * span;
  const d9Deg = inside * 9;                          // 0..30 inside d9 sign
  return norm360(d9Sign * 30 + d9Deg);
}

/** D10: Daśāṁśa longitude (0..360) */
export function dasamsaLon(lon: number) {
  const sIdx = signOfDeg(lon);
  const inSign = norm360(lon) % 30;
  const pada = Math.floor(inSign / 3);               // 0..9 (each 3°)
  let start: number;
  if (MOV.has(sIdx))      start = sIdx;
  else if (FIX.has(sIdx)) start = (sIdx + 8) % 12;   // 9th
  else                    start = (sIdx + 4) % 12;   // 5th
  const d10Sign = (start + pada) % 12;
  const inside = inSign - pada * 3;                  // 0..3
  const d10Deg = inside * 10;                        // → 0..30 inside d10 sign
  return norm360(d10Sign * 30 + d10Deg);
}

/** Primary SVG renderer (house wheel) */
export function renderChartSVG(opts: {
  title: string;
  ascLon: number;
  planets: Record<string | number, number>;
  size?: number;
}): string {
  const size = opts.size ?? 560;
  const cx = size / 2, cy = size / 2;
  const R = size * 0.46;
  const r = size * 0.32;
  const ri = size * 0.20;
  const ascLon = norm360(opts.ascLon);

  const lineAt = (aRad: number, len0: number, len1: number, width = 1) => {
    const x0 = cx + len0 * Math.cos(aRad), y0 = cy + len0 * Math.sin(aRad);
    const x1 = cx + len1 * Math.cos(aRad), y1 = cy + len1 * Math.sin(aRad);
    return `<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="black" stroke-width="${width}"/>`;
  };

  const wedges: string[] = [];
  for (let h = 0; h < 12; h++) {
    const a = relAngleFromAsc(ascLon + h * 30, ascLon);
    wedges.push(lineAt(a, ri, R, h === 0 ? 2 : 1));
    const aMid = relAngleFromAsc(ascLon + h * 30 + 15, ascLon);
    const tx = cx + (ri + 0.5 * (r - ri)) * Math.cos(aMid);
    const ty = cy + (ri + 0.5 * (r - ri)) * Math.sin(aMid);
    wedges.push(
      `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" font-size="${size*0.035}" text-anchor="middle" dominant-baseline="middle" fill="#555">${((h + 1) % 12) || 12}</text>`
    );
  }

  const signs: string[] = [];
  for (let h = 0; h < 12; h++) {
    const ecl = ascLon + h * 30;
    const sName = SIGNS[signOfDeg(ecl)];
    const aMid = relAngleFromAsc(ecl + 15, ascLon);
    const tx = cx + (R - size * 0.05) * Math.cos(aMid);
    const ty = cy + (R - size * 0.05) * Math.sin(aMid);
    signs.push(`<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" font-size="${size*0.032}" text-anchor="middle" dominant-baseline="middle">${sName[0]}</text>`);
  }

  const planetNodes: string[] = [];
  Object.entries(opts.planets).forEach(([key, lon]) => {
    if (typeof lon !== "number") return;
    const a = relAngleFromAsc(lon, ascLon);
    const px = cx + r * Math.cos(a);
    const py = cy + r * Math.sin(a);
    const glyph = PLANET_GLYPH[key] ?? "?";
    planetNodes.push(
      `<text x="${px.toFixed(1)}" y="${py.toFixed(1)}" font-size="${size*0.05}" text-anchor="middle" dominant-baseline="middle">${glyph}</text>`
    );
  });

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <style> text{font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto;} </style>
  </defs>
  <rect width="100%" height="100%" fill="white"/>
  <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="black" stroke-width="1.5"/>
  <circle cx="${cx}" cy="${cy}" r="${ri}" fill="none" stroke="#999" stroke-width="1"/>
  ${wedges.join("\n")}
  ${signs.join("\n")}
  ${planetNodes.join("\n")}
  <text x="${cx}" y="${size*0.06}" text-anchor="middle" font-size="${size*0.045}" font-weight="600">${opts.title}</text>
  ${lineAt(relAngleFromAsc(ascLon, ascLon), ri-6, R+6, 2)}
</svg>
`.trim();
}

/** Turn raw SVG into an embeddable data URL for <img src=...> */
export function svgDataUrl(svg: string) {
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
