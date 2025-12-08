"use client";
import React from "react";

export default function ThemeToggle() {
  const [dark, setDark] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("report_theme_dark");
    return saved ? saved === "1" : false;
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("report_theme_dark", dark ? "1" : "0");
  }, [dark]);

  return (
    <button
      onClick={() => setDark(v => !v)}
      className="px-2 py-1 text-xs rounded border hover:bg-gray-50 dark:hover:bg-slate-700"
      title="Toggle light/dark"
    >
      {dark ? "Dark ✓" : "Light ✓"}
    </button>
  );
}
