// FILE: src/app/sarathi/life-report/page.tsx

import TopNav from "../TopNav";
import LifeReportShell from "./_shell"; // or { LifeReportShell } if that's how it's exported

export default function LifeReportPage() {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950">
      <TopNav />
      <main className="mx-auto max-w-5xl px-4 py-8 md:py-10">
        <LifeReportShell />
      </main>
    </div>
  );
}
