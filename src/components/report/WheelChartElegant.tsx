"use client";

import React, { useMemo } from "react";

type PlanetsMap = Record<number, number | undefined>;

const SIGNS = ["Ar","Ta","Ge","Cn","Le","Vi","Li","Sc","Sg","Cp","Aq","Pi"];
const ID = { Sun:0, Moon:1, Mars:2, Mercury:3, Jupiter:4, Venus:5, Saturn:6, Rahu:7, Ketu:8 } as const;

const wrap360 = (x:number) => (x % 360 + 360) % 360;
const deg2rad = (d:number) => (d * Math.PI) / 180;
const sIdx = (deg:number) => Math.floor(wrap360(deg)/30); // 0..11

function toXY(cx:number, cy:number, r:number, angDeg:number) {
  // 0° to the right; CCW positive
  const a = deg2rad(angDeg);
  const x = cx + r * Math.cos(a);
  const y = cy - r * Math.sin(a);      // minus => screen Y grows downward
  return { x, y };
}

export default function WheelChartElegant({
  ascDeg,
  planets = {},
  size = 440,
  svgId = "birth-wheel-svg",
}: {
  ascDeg?: number;
  planets?: PlanetsMap;
  size?: number;
  svgId?: string;
}) {
  const cx = size/2, cy = size/2;
  const R      = size*0.46;    // outer rim
  const RSigns = size*0.40;    // where sign labels sit
  const RHouses= size*0.33;    // where house numbers sit
  const RPlan  = size*0.27;    // planet badge radius
  const tick   = 12;

  const asc0 = Number.isFinite(ascDeg) ? (ascDeg as number) : 0;
  const ascSignIdx = sIdx(asc0);

  const lines = useMemo(() => {
    // 12 house spokes starting at ASC (0°), every 30°
    const arr: {x1:number,y1:number,x2:number,y2:number,ang:number}[] = [];
    for (let k=0;k<12;k++) {
      const ang = k*30; // local wheel angle from ASC
      const p1 = toXY(cx,cy,R,ang);
      const p2 = toXY(cx,cy,RPlan*0.9,ang);
      arr.push({ x1:p1.x, y1:p1.y, x2:p2.x, y2:p2.y, ang });
    }
    return arr;
  }, [cx,cy,R,RPlan]);

  const signLabels = useMemo(() => {
    const items: {text:string,x:number,y:number}[] = [];
    for (let h=0; h<12; h++) {
      const ang    = h*30 + 15;                         // mid of wedge
      const sign   = SIGNS[(ascSignIdx + h) % 12];
      const p      = toXY(cx,cy,RSigns,ang);
      items.push({ text: sign, x: p.x, y: p.y });
    }
    return items;
  }, [ascSignIdx, cx, cy, RSigns]);

  const houseLabels = useMemo(() => {
    const items: {text:string,x:number,y:number}[] = [];
    for (let h=0; h<12; h++) {
      const ang = h*30 + 15;
      const p   = toXY(cx,cy,RHouses,ang);
      items.push({ text: String(h+1), x: p.x, y: p.y });
    }
    return items;
  }, [cx,cy,RHouses]);

  // planets rendered as badges; simple collision-avoid by nudging if too-close
  const planetsBadges = useMemo(() => {
    const label = (id:number) => {
      switch(id){
        case ID.Sun: return "Su";
        case ID.Moon:return "Mo";
        case ID.Mars:return "Ma";
        case ID.Mercury:return "Me";
        case ID.Jupiter:return "Ju";
        case ID.Venus:return "Ve";
        case ID.Saturn:return "Sa";
        case ID.Rahu:return "Ra";
        case ID.Ketu:return "Ke";
        default: return "?";
      }
    };

    const order: number[] = [
      ID.Sun, ID.Moon, ID.Mercury, ID.Venus, ID.Mars, ID.Jupiter, ID.Saturn, ID.Rahu, ID.Ketu
    ];

    // collect visible planets
    const items: {id:number, ang:number, x:number, y:number, lab:string}[] = [];
    for (const id of order) {
      const lon = planets?.[id];
      if (!Number.isFinite(lon)) continue;
      const localAng = wrap360((lon as number) - asc0); // angle from ASC, CCW
      const p  = toXY(cx,cy,RPlan,localAng);
      items.push({ id, ang: localAng, x: p.x, y: p.y, lab: label(id) });
    }

    // naive collision-avoid: if two are within ~16px, push inner one slightly toward center
    for (let i=0;i<items.length;i++){
      for (let j=i+1;j<items.length;j++){
        const dx = items[i].x - items[j].x;
        const dy = items[i].y - items[j].y;
        const d2 = dx*dx + dy*dy;
        if (d2 < 16*16) {
          // move j a bit inwards along its radial line
          const rNudge = 12;
          const p2 = toXY(cx,cy,RPlan - rNudge, items[j].ang);
          items[j].x = p2.x; items[j].y = p2.y;
        }
      }
    }
    return items;
  }, [planets, asc0, cx, cy, RPlan]);

  return (
    <svg id={svgId} width={size} height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="w-full h-auto text-slate-700 dark:text-slate-200">
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={R} fill="none"
        stroke="currentColor" strokeOpacity={0.25} strokeWidth={1.5} />
      {/* Sign band divider (inner ring) */}
      <circle cx={cx} cy={cy} r={RPlan*0.9} fill="none"
        stroke="currentColor" strokeOpacity={0.18} strokeWidth={1} />

      {/* House spokes */}
      {lines.map((l,idx)=>(
        <line key={idx} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke="currentColor" strokeOpacity={0.2} strokeWidth={1}/>
      ))}

      {/* Asc line (bold) */}
      <line x1={toXY(cx,cy,R,0).x} y1={toXY(cx,cy,R,0).y}
            x2={toXY(cx,cy,RPlan*0.9,0).x} y2={toXY(cx,cy,RPlan*0.9,0).y}
            stroke="currentColor" strokeWidth={2.2} strokeOpacity={0.6} />

      {/* Sign labels */}
      {signLabels.map((s,idx)=>(
        <text key={idx} x={s.x} y={s.y}
          fontSize={Math.round(size*0.038)} textAnchor="middle" dominantBaseline="middle">
          {s.text}
        </text>
      ))}

      {/* House numbers */}
      {houseLabels.map((h,idx)=>(
        <text key={idx} x={h.x} y={h.y}
          fontSize={Math.round(size*0.034)} textAnchor="middle"
          dominantBaseline="middle" fill="currentColor" fillOpacity={0.7}>
          {h.text}
        </text>
      ))}

      {/* Planet badges */}
      {planetsBadges.map((p,idx)=>{
        const isNode = (p.lab==="Ra" || p.lab==="Ke");
        return (
          <g key={idx} transform={`translate(${p.x},${p.y})`}>
            <circle r={size*0.032}
              fill={isNode ? "transparent" : "currentColor"}
              stroke="currentColor"
              strokeWidth={isNode ? 1.6 : 0}
              fillOpacity={isNode ? 0 : 0.95}
              className={isNode ? "" : "dark:fill-slate-100"} />
            <text y={1} fontSize={Math.round(size*0.034)}
              textAnchor="middle" dominantBaseline="middle"
              fill={isNode ? "currentColor" : "var(--wheel-badge-ink, #000)"}
              className={isNode ? "" : "dark:fill-slate-900"}
              >
              {p.lab}
            </text>
          </g>
        );
      })}

      {/* captions */}
      <text x={cx} y={size-10} fontSize={Math.round(size*0.030)}
            textAnchor="middle" fill="currentColor" fillOpacity={0.6}>
        ASC at 3 o’clock • Houses increase counter-clockwise • Nodes shown as “Ra/Ke”
      </text>
    </svg>
  );
}
