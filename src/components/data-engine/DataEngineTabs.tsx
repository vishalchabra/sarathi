"use client";

type TabKey =
  | "foundations"
  | "charts"
  | "vargas"
  | "timing"
  | "forecast"
  | "strength"
  | "utilities"
  | "compare"
  | "analysis";

type Props = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

type TabItem = {
  key: TabKey;
  label: string;
  description: string;
  badge?: string;
};

const TABS: TabItem[] = [
  {
    key: "foundations",
    label: "Foundations",
    description:
      "Birth-chart identity, planetary placements, house ownership and functional roles.",
  },
  {
    key: "charts",
    label: "Charts",
    description:
      "Visual chart views including natal, Bhava Chalit, KP, transits, Arudhas and Upagrahas.",
  },
  {
    key: "vargas",
    label: "Vargas",
    description:
      "Divisional charts used for deeper examination of specific areas of life.",
  },
  {
    key: "timing",
    label: "Dasha",
    description:
      "Mahadasha, Antardasha, Pratyantardasha, dasha timelines, lord profiles and activation themes.",
  },
  {
    key: "forecast",
    label: "Activations",
    description:
      "Shows which planets, houses and life areas are activated through the combined influence of the current Dasha and planetary transits.",
  },
  {
    key: "strength",
    label: "Strengths & Systems",
    description:
      "Shadbala, Ashtakavarga, planetary relationships and other technical evaluation systems.",
  },
  {
    key: "utilities",
    label: "Utilities",
    description:
      "Panchang, Hora and supporting astrological calculation tools.",
  },
  {
    key: "compare",
    label: "Compare",
    description:
      "Compare two charts, dates or planetary configurations side by side.",
  },
  {
    key: "analysis",
    label: "Analysis Framework",
    badge: "Guided",
    description:
      "A guided chart-reading framework created especially for new astrologers. It helps you interpret a chart step by step and combine the major factors systematically.",
  },
];

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="h-3.5 w-3.5"
    >
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 8.75V13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="10" cy="6.25" r="0.9" fill="currentColor" />
    </svg>
  );
}

export default function DataEngineTabs({
  activeTab,
  onChange,
}: Props) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="tablist"
      aria-label="Data Engine sections"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const tooltipId = `tab-tooltip-${tab.key}`;

        return (
          <div key={tab.key} className="group relative">
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-describedby={tooltipId}
              onClick={() => onChange(tab.key)}
              className={[
                "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2",
                "text-sm font-semibold transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-[color:var(--primary)]/35 focus-visible:ring-offset-2",
                isActive
                  ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-white shadow-sm"
                  : "border-[color:var(--border)] bg-white/75 text-slate-700 hover:border-[color:var(--primary)]/40 hover:bg-white hover:text-slate-900 hover:shadow-sm",
              ].join(" ")}
            >
              <span className="whitespace-nowrap">{tab.label}</span>

              {tab.badge ? (
                <span
                  className={[
                    "rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em]",
                    isActive
                      ? "bg-white/15 text-white"
                      : "bg-violet-100 text-violet-700",
                  ].join(" ")}
                >
                  {tab.badge}
                </span>
              ) : null}

              <span
                aria-hidden="true"
                className={[
                  "grid h-5 w-5 shrink-0 place-items-center rounded-full transition-colors",
                  isActive
                    ? "bg-white/15 text-white/90"
                    : "bg-slate-100 text-slate-400 group-hover:bg-violet-50 group-hover:text-[color:var(--primary)]",
                ].join(" ")}
              >
                <InfoIcon />
              </span>
            </button>

            <div
              id={tooltipId}
              role="tooltip"
              className={[
                "pointer-events-none absolute left-1/2 top-full z-[100] mt-2.5",
                "w-72 -translate-x-1/2 rounded-xl border border-white/10",
                "bg-slate-900 px-3.5 py-3 text-left text-xs font-normal",
                "leading-relaxed text-white opacity-0 shadow-xl",
                "translate-y-1 transition-all duration-150",
                "group-hover:translate-y-0 group-hover:opacity-100",
                "group-focus-within:translate-y-0 group-focus-within:opacity-100",
              ].join(" ")}
            >
              {tab.description}

              <span
                aria-hidden="true"
                className="absolute bottom-full left-1/2 -translate-x-1/2 border-x-[5px] border-b-[5px] border-x-transparent border-b-slate-900"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
