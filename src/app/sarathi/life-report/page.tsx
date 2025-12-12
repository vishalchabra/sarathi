// FILE: src/app/sarathi/life-report/page.tsx

import TopNav from "../TopNav";
import LifeReportShell from "./_shell"; // or { LifeReportShell } if that's how it's exported

export default function LifeReportPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <TopNav />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <LifeReportShell />
      </main>
    </div>
  );
}
