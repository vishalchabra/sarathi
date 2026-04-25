"use client";

type TabKey =
  | "foundations"
  | "timing"
  | "transits"
  | "forecast"
  | "vargas"
  | "charts"
  | "strength"
  | "utilities";
  

type Props = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "foundations", label: "Foundations" },
  { key: "timing", label: "Timing" },
  { key: "transits", label: "Transits" },
  { key: "forecast", label: "Forecast" },
  { key: "vargas", label: "Vargas" },
  { key: "charts", label: "Charts" },
  { key: "strength", label: "Strength & Systems" },
  { key: "utilities", label: "Utilities" },
];

export default function DataEngineTabs({ activeTab, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-[color:var(--border)] pb-3">
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
                ? "border border-[color:var(--border)] bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:bg-white/70 hover:text-slate-800",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}