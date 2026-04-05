"use client";

type TabKey = "natal" | "timing" | "vargas";

type Props = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "natal", label: "Natal" },
  { key: "timing", label: "Timing" },
  { key: "vargas", label: "Vargas" },
];

export default function DataEngineTabs({ activeTab, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
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
                : "bg-slate-100 text-slate-700 hover:bg-slate-200",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}