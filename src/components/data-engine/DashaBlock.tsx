"use client";

import { useMemo, useState } from "react";

type DashaRow = {
  lord?: string;
  startISO?: string;
  endISO?: string;
};

type DashaTreeNode = {
  level?: "md" | "ad" | "pd" | "sd" | "pr" | "de";
  lord?: string | null;
  label?: string | null;
  startISO?: string | null;
  endISO?: string | null;
  isActive?: boolean;
  children?: DashaTreeNode[];
};

type CurrentDasha = {
  md?: string;
  ad?: string;
  pd?: string;
  mdLord?: string;
  adLord?: string;
  pdLord?: string;
  mdStartISO?: string;
  mdEndISO?: string;
  adStartISO?: string;
  adEndISO?: string;
  pdStartISO?: string;
  pdEndISO?: string;
  [key: string]: any;
};

type Props = {
  current?: CurrentDasha;
  mdTimeline?: DashaRow[];
  adTimeline?: DashaRow[];
  pdTimeline?: DashaRow[];
  tree?: DashaTreeNode[];
};

function cardClass() {
  return "rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm";
}

function formatRange(startISO?: string | null, endISO?: string | null) {
  if (!startISO && !endISO) return "—";
  return `${startISO ?? "—"} → ${endISO ?? "—"}`;
}

function getCurrentStack(current?: CurrentDasha) {
  if (!current || typeof current !== "object") return [];

  const mdValue = current.md ?? current.mdLord ?? null;
  const adValue = current.ad ?? current.adLord ?? null;
  const pdValue = current.pd ?? current.pdLord ?? null;

  return [
    {
      key: "md",
      label: "Mahadasha",
      value: mdValue,
      startISO: current.mdStartISO,
      endISO: current.mdEndISO,
    },
    {
      key: "ad",
      label: "Antardasha",
      value: adValue,
      startISO: current.adStartISO,
      endISO: current.adEndISO,
    },
    {
      key: "pd",
      label: "Pratyantardasha",
      value: pdValue,
      startISO: current.pdStartISO,
      endISO: current.pdEndISO,
    },
  ].filter((row) => row.value || row.startISO || row.endISO);
}

function levelLabel(level?: string) {
  if (level === "md") return "MD";
  if (level === "ad") return "AD";
  if (level === "pd") return "PD";
  if (level === "sd") return "SD";
  if (level === "sd") return "SD";
  if (level === "pr") return "PR";
  if (level === "de") return "DE";
  return "Dasha";
}

function DashaTreeItem({
  node,
  depth = 0,
}: {
  node: DashaTreeNode;
  depth?: number;
}) {
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => hasChildren && setOpen((v) => !v)}
        className={`w-full rounded-xl border px-4 py-3 text-left transition ${
          node.isActive
            ? "border-slate-900 bg-white/5"
            : "border-white/10 bg-white/5 hover:bg-white/5"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-white/50">
              {levelLabel(node.level)}
            </div>
            <div className="mt-1 text-sm font-medium text-white">
              {node.label ?? node.lord ?? "—"}
            </div>
            <div className="mt-1 text-xs text-white/70">
              {formatRange(node.startISO, node.endISO)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {node.isActive ? (
              <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-medium text-white">
                Active
              </span>
            ) : null}

            {hasChildren ? (
              <span className="text-xs text-white/50">
                {open ? "Hide" : "Show"}
              </span>
            ) : null}
          </div>
        </div>
      </button>

      {hasChildren && open ? (
        <div className="ml-4 space-y-2 border-l border-white/10 pl-4">
          {node.children!.map((child, idx) => (
            <DashaTreeItem key={`${child.label ?? child.lord ?? "node"}-${idx}`} node={child} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function DashaBlock({
  current,
  tree = [],
}: Props) {
  const currentStack = useMemo(() => getCurrentStack(current), [current]);

  return (
    <div className="space-y-6">
      <div className={cardClass()}>
        <h2 className="text-base font-semibold text-white">
          Current Dasha Stack
        </h2>
        <p className="mt-1 text-sm text-white/70">
          Active timing layers for manual analysis.
        </p>

        {currentStack.length ? (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {currentStack.map((item) => (
              <div
                key={item.key}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="text-xs font-medium uppercase tracking-wide text-white/50">
                  {item.label}
                </div>
                <div className="mt-1 text-sm font-medium text-white">
                  {String(item.value ?? "—")}
                </div>
                <div className="mt-2 text-xs text-white/70">
                  {formatRange(item.startISO, item.endISO)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-sm text-white/50">
            No active dasha data available.
          </div>
        )}
      </div>

      <div className={cardClass()}>
        <h2 className="text-base font-semibold text-white">
          Full Dasha Timeline
        </h2>
        <p className="mt-1 text-sm text-white/70">
          Click any dasha to expand and view deeper levels (MD → AD → PD → SD → PR → DE).
        </p>

        <div className="mt-4 space-y-3">
          {tree.length ? (
            tree.map((node, idx) => (
              <DashaTreeItem
                key={`${node.label ?? node.lord ?? "md"}-${idx}`}
                node={node}
              />
            ))
          ) : (
            <div className="text-sm text-white/50">
              No dasha timeline available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}