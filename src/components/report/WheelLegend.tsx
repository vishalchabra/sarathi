"use client";
export default function WheelLegend() {
  return (
    <div className="grid grid-cols-3 gap-3 text-xs text-gray-600">
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full" style={{background:"#6366f1"}} />
        <span>ASC marker</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full" style={{background:"#0ea5e9"}} />
        <span>Planets (Su, Mo, …)</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full border" />
        <span>Houses 1–12 inner labels</span>
      </div>
    </div>
  );
}
