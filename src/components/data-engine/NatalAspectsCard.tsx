"use client";

type AspectRow = {
  planetA?: string;
  planetB?: string;
  type?: string;
  tone?: "supportive" | "challenging" | "mixed" | "neutral" | string;
  label?: string;
  rule?: string;
  orb?: number | null;
  diff?: number | null;
  exactAngle?: number | null;
  houseDistance?: number | null;
};

type Props = {
  rows?: AspectRow[];
};

const KEY_PLANETS = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
];

function formatOrb(v?: number | null) {
  if (typeof v !== "number" || Number.isNaN(v)) return "—";
  return `${v.toFixed(2)}°`;
}

export default function NatalAspectsCard({ rows }: Props) {
  const data = (Array.isArray(rows) ? rows : [])
  .filter(
    (r) =>
      KEY_PLANETS.includes(String(r.planetA ?? "")) &&
      KEY_PLANETS.includes(String(r.planetB ?? ""))
  )
  .sort((a, b) => {
    if ((a.houseDistance ?? 99) !== (b.houseDistance ?? 99)) {
      return (a.houseDistance ?? 99) - (b.houseDistance ?? 99);
    }
    return (a.planetB ?? "").localeCompare(b.planetB ?? "");
  });

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
      <h2 className="text-base font-semibold text-white">
        Natal Aspects
      </h2>
      <p className="mt-1 text-sm text-white/70">
        Vedic graha influences between key natal planets.
      </p>

      <div className="mt-4 space-y-2">
  {data.length ? (
    data.map((r, i) => (
      <div
        key={`${r.planetA ?? "A"}-${r.planetB ?? "B"}-${i}`}
        className="flex items-start justify-between gap-4 rounded-xl border border-white/10 px-3 py-2"
      >
        <div className="text-sm text-white">
          <div className="font-medium">
            {r.label ?? `${r.planetB ?? "—"} influenced by ${r.planetA ?? "—"}`}
          </div>
          <div className="mt-0.5 text-xs text-white/50">
            {r.rule ?? "Vedic aspect"}
          </div>
        </div>

        <div className="shrink-0 text-xs text-white/50">
          Orb {formatOrb(r.orb)}
        </div>
      </div>
    ))
  ) : (
    <div className="rounded-xl border border-white/10 px-3 py-4 text-sm text-white/50">
      No major natal aspects found.
    </div>
  )}
</div>
    </div>
  );
}