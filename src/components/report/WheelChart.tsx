"use client";
import React from "react";

/**
 * Minimal equal-house wheel (sidereal).
 * - ascDeg: Lahiri sidereal ASC in degrees (0..360)
 * - planets: Record<key, degree> sidereal longitudes (0..360)
 */
export default function WheelChartClean({
  ascDeg,
  planets = {},
  size = 320,
}: {
  ascDeg: number | undefined;
  planets: Record<string, number>;
  size?: number;
}) {
  if (typeof ascDeg !== "number" || !Number.isFinite(ascDeg)) return null;

  const C = size / 2;
  const R0 = C - 4;
  const R1 = R0 * 0.82; // inner ring
  const R2 = R0 * 0.56; // label ring

  // convert ecliptic degree to chart angle (ASC at right, CCW increases)
  const toXY = (deg: number, r: number) => {
    const a = ((deg - ascDeg) * Math.PI) / 180; // shift by ASC
    return { x: C + r * Math.cos(a), y: C - r * Math.sin(a) };
  };

  // compact planet labels from key
  const shortName = (k: string) => {
    const s = String(k).toLowerCase();
    if (/(^|[^a-z])0($|[^a-z])|sun/.test(s)) return "Su";
    if (/(^|[^a-z])1($|[^a-z])|moon/.test(s)) return "Mo";
    if (/(^|[^a-z])2($|[^a-z])|mars/.test(s)) return "Ma";
    if (/(^|[^a-z])3($|[^a-z])|merc/.test(s)) return "Me";
    if (/(^|[^a-z])4($|[^a-z])|jup/.test(s)) return "Ju";
    if (/(^|[^a-z])5($|[^a-z])|ven/.test(s)) return "Ve";
    if (/(^|[^a-z])6($|[^a-z])|sat/.test(s)) return "Sa";
    if (/(^|[^a-z])7($|[^a-z])|10|rahu|north/.test(s)) return "Ra";
    if (/(^|[^a-z])8($|[^a-z])|11|-1|ketu|south/.test(s)) return "Ke";
    return k.replace(/^[^\d-]+/, "P");
  };

  const houses = Array.from({ length: 12 }, (_, i) => (ascDeg + i * 30) % 360);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" className="max-w-full">
      {/* rings */}
      <circle cx={C} cy={C} r={R0} fill="#ffffff" stroke="#e5e7eb" />
      <circle cx={C} cy={C} r={R1} fill="#f8fafc" stroke="#e5e7eb" />

      {/* house spokes + labels */}
      {houses.map((hDeg, i) => {
        const p0 = toXY(hDeg, R0);
        const p1 = toXY(hDeg, R2 - 8);
        const labelPos = toXY(hDeg + 15, (R1 + R2) / 2); // computed BEFORE JSX
        return (
          <g key={i}>
            <line
              x1={p0.x}
              y1={p0.y}
              x2={p1.x}
              y2={p1.y}
              stroke="#cbd5e1"
              strokeWidth={i % 3 === 0 ? 1.5 : 1}
            />
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              fill="#475569"
            >
              {i + 1}
            </text>
          </g>
        );
      })}

      {/* ASC marker */}
      {(() => {
        const p = toXY(ascDeg, R0);
        return <circle cx={p.x} cy={p.y} r={3} fill="#6366f1" />;
      })()}

      {/* planet markers */}
      {Object.entries(planets).map(([k, v], idx) => {
        if (typeof v !== "number" || !Number.isFinite(v)) return null;
        const pDot = toXY(v, (R0 + R1) / 2);
        const pTxt = toXY(v, R2);
        return (
          <g key={idx}>
            <circle cx={pDot.x} cy={pDot.y} r={3.2} fill="#0ea5e9" />
            <text
              x={pTxt.x}
              y={pTxt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10.5"
              fill="#0f172a"
              className="font-medium"
            >
              {shortName(k)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
