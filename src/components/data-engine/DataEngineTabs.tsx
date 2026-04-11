"use client";

type TabKey =
  | "foundations"
  | "timing"
  | "transits"
  | "vargas"
  | "charts"
  | "strength";

type Props = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "foundations", label: "Foundations" },
  { key: "timing", label: "Timing" },
  { key: "transits", label: "Transits" },
  { key: "vargas", label: "Vargas" },
  { key: "charts", label: "Charts" },
  { key: "strength", label: "Strength & Systems" }
];

export default function DataEngineTabs({ activeTab, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={[
              "rounded-xl px-4 py-2 text-sm font-medium transition",
              isActive
                ? "bg-slate-900 text-white shadow"
                : "bg-white/10 text-white/80 hover:bg-slate-200",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}