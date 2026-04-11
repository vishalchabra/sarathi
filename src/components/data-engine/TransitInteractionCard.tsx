"use client";

type InteractionRow = {
  transitPlanet?: string;
  natalTarget?: string;
  aspectType?: string;
  tone?: string;
  label?: string;
  rule?: string;
  orb?: number | null;
  transitStrengthBand?: string;
  natalStrengthBand?: string;
  interactionScore?: number;
  interactionLabel?: string;
};

type Props = {
  rows?: InteractionRow[];
};

function formatOrb(v?: number | null) {
  if (typeof v !== "number" || Number.isNaN(v)) return "—";
  return `${v.toFixed(2)}°`;
}

export default function TransitInteractionCard({ rows }: Props) {
  const data = Array.isArray(rows) ? rows : [];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-white">
        Current Transit Hits
      </h2>
      <p className="mt-1 text-sm text-white/70">
        Vedic transit influences on natal planets, ranked by current strength.
      </p>

      <div className="mt-4 space-y-2">
        {data.length ? (
          data.map((r, i) => (
            <div
              key={`${r.transitPlanet ?? "t"}-${r.natalTarget ?? "n"}-${i}`}
              className="rounded-xl border border-white/10 px-4 py-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-white">
                    {r.label ?? `${r.natalTarget ?? "—"} influenced by ${r.transitPlanet ?? "—"}`}
                  </div>
                  <div className="mt-1 text-xs text-white/50">
                    {r.rule ?? "Vedic transit hit"}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-white/50">Orb</div>
                  <div className="text-sm font-medium text-white">
                    {formatOrb(r.orb)}
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-white/50">
                    Transit Band
                  </div>
                  <div className="mt-1 text-sm text-white capitalize">
                    {r.transitStrengthBand?.replace(/_/g, " ") ?? "—"}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-white/50">
                    Natal Band
                  </div>
                  <div className="mt-1 text-sm text-white capitalize">
                    {r.natalStrengthBand?.replace(/_/g, " ") ?? "—"}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-white/50">
                    Score
                  </div>
                  <div className="mt-1 text-sm text-white">
                    {typeof r.interactionScore === "number" ? r.interactionScore : "—"}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-white/50">
                    Label
                  </div>
                  <div className="mt-1 text-sm text-white capitalize">
                    {r.interactionLabel ?? "—"}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-white/10 px-3 py-4 text-sm text-white/50">
            No current transit hits available.
          </div>
        )}
      </div>
    </div>
  );
}