"use client";
import React from "react";

type Col<R> = { header: string; get: (row: R) => string | number | null | undefined };

export default function ExportButton<R>({
  filename,
  rows,
  cols,
  className = "",
  label = "Export CSV",
}: {
  filename: string;
  rows: R[];
  cols: Col<R>[];
  className?: string;
  label?: string;
}) {
  function toCsvStr() {
    const head = cols.map(c => csv(c.header)).join(",");
    const body = rows
      .map(r => cols.map(c => csv(val(c.get(r)))).join(","))
      .join("\n");
    return head + "\n" + body;
  }
  function download() {
    const blob = new Blob([toCsvStr()], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  return (
    <button onClick={download} className={`px-2 py-1 text-xs rounded border hover:bg-gray-50 ${className}`}>
      {label}
    </button>
  );
}

function csv(s: string) {
  return `"${s.replace(/"/g, '""')}"`;
}
function val(v: any) {
  if (v === null || v === undefined) return "";
  return String(v);
}
