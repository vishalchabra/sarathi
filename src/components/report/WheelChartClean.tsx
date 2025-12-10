"use client";

import React from "react";
import { normalizePlanets, CANON_IDS, wrap360 } from "@/lib/astro/aliases";

const SIGNS_ABBR = ["Ar","Ta","Ge","Cn","Le","Vi","Li","Sc","Sg","Cp","Aq","Pi"];

function toXY(angleDeg: number, r: number, cx = 0, cy = 0) {
  const a = ((90 - angleDeg) * Math.PI) / 180; // 0° at 3 o’clock
  return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
}

export default function WheelChartClean({
  ascDeg,
  planets = {},
  size = 360,
  svgId = "birth-wheel-svg",
}: {
  ascDeg?: number;
  planets: any;
  size?: number;
  svgId?: string;
}) {
  const P = normalizePlanets(planets);

  const R = size / 2;
  const R1 = R * 0.55; // inner ring radius
  const R2 = R * 0.95; // outer ring radius

  // house cusp (whole-sign): ASC sign at 1H, then every 30°
  const asc = Number.isFinite(ascDeg) ? (ascDeg as number) : 0;
  const ascSign0 = Math.floor(wrap360(asc) / 30);

  // draw
  return (
    <svg id={svgId} viewBox={`${-R} ${-R} ${size} ${size}`} className="w-full h-auto">
      {/* rings */}
      <circle r={R2} cx={0} cy={0} fill="#fff" stroke="#e5e7eb" />
      <circle r={R1} cx={0} cy={0} fill="#fff" stroke="#e5e7eb" />

      {/* sign wedges */}
      {Array.from({ length: 12 }).map((_, i) => {
        const start = i * 30;
        const mid = start + 15;
        const p1 = toXY(start, R2);
        const p2 = toXY(start, R1);
        const p3 = toXY(start + 30, R1);
        const p4 = toXY(start + 30, R2);
        const label = SIGNS_ABBR[(ascSign0 + i) % 12];
        const m = toXY(mid, (R1 + R2) / 2);
        return (
          <g key={i}>
            <path
              d={`M ${p1.x},${p1.y} L ${p2.x},${p2.y} A ${R1},${R1} 0 0,1 ${p3.x},${p3.y} L ${p4.x},${p4.y} A ${R2},${R2} 0 0,0 ${p1.x},${p1.y} Z`}
              fill={i % 2 ? "#fafafa" : "#ffffff"}
              stroke="#e5e7eb"
            />
            <text x={m.x} y={m.y} textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="#475569">
              {label}
            </text>
          </g>
        );
      })}

      {/* ASC axis */}
      <line
        x1={toXY(0, R2).x}
        y1={toXY(0, R2).y}
        x2={toXY(180, R2).x}
        y2={toXY(180, R2).y}
        stroke="#334155"
        strokeWidth={1.2}
      />

      {/* Planets */}
      {(
        [
          [CANON_IDS.Sun, "Su"],
          [CANON_IDS.Moon, "Mo"],
          [CANON_IDS.Mercury, "Me"],
          [CANON_IDS.Venus, "Ve"],
          [CANON_IDS.Mars, "Ma"],
          [CANON_IDS.Jupiter, "Ju"],
          [CANON_IDS.Saturn, "Sa"],
          [CANON_IDS.Rahu, "Ra"],
          [CANON_IDS.Ketu, "Ke"],
        ] as Array<[number, string]>
      ).map(([pid, label]) => {
         const deg = (P as any)[pid];
        if (!Number.isFinite(deg)) return null;
        // rotate chart so ASC sign starts at 0° (3 o’clock): planet visual angle =
        // (planetSignIndex - ascSign0)*30 + planetDegreeWithinSign
        const planetAngle = wrap360(deg - ascSign0 * 30);
        const pt = toXY(planetAngle, (R1 + R2) / 2);
        return (
          <g key={label}>
            <circle cx={pt.x} cy={pt.y} r={8} fill="#111827" />
            <text x={pt.x} y={pt.y + 0.5} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#fff">
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
